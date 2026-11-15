import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const story = JSON.parse(fs.readFileSync(path.join(root, 'data', 'story.json'), 'utf8'));
const globalPrompt = 'Animated cinematic graphic-novel field training on Earth, hand-painted layered backgrounds, visible ink strokes, consistent expedition crew and terrestrial equipment, restrained camera movement, physically scaled wind and dust, 16:9, no readable text, no logos, no subtitles, no photorealism, neutral visual performance for separate Spanish and English audio.';
const negativePrompt = 'No Mars surface action, no red-planet horizon, no EVA spacesuits, no sealed life-support helmets, no alien geology, no invented landmark, no franchise imitation, no readable labels.';
const routes = {
  jezero: {
    earth: 'Gran Arenal del Chimborazo, Ecuador: high-altitude volcanic ash, loose dark rocks, sparse dry páramo grass, cold mountain light, distant snow-capped Chimborazo massif.',
    action: 'field cadet in a practical orange-and-graphite alpine jacket, open helmet, harness and radio; six-wheel terrestrial rover; loose-slope traverse, rock-core drill and camera calibration.'
  },
  arcadia: {
    earth: 'Desierto de Siloli, Bolivia: open high-altitude altiplano, ochre and brown volcanic sand, wind-carved rocks, salt crust, distant ridges and deep blue sky.',
    action: 'field cadet in layered expedition clothing, open helmet and safety radio; compact GPR cart, dry sample handling, frozen-soil survey and lightweight panel anchoring.'
  },
  arsia: {
    earth: 'La Payunia Provincial Reserve, Mendoza, Argentina: black basaltic scoria, copper and gold ash, broad lava plains, small volcanic cones and clear Patagonian light.',
    action: 'field cadet in practical field clothing, open helmet, harness, gloves and radio; safe constructed basalt training module, rope descent, compact 3D lidar and radio repeater.'
  }
};
const routeForCode = (code) => ({ J: 'jezero', A: 'arcadia', P: 'arsia' }[String(code || '').charAt(0)] || 'shared');
const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const storyBrief = (node) => {
  const script = Array.isArray(node.script) ? node.script.map(clean).join(' ') : clean(node.script);
  return script || `${clean(node.title)}. ${node.choices?.map((choice) => clean(choice.label)).join('. ') || ''}`;
};

const items = story.nodes.map((node) => {
  const routeId = routeForCode(node.code);
  const route = routes[routeId];
  const routeText = route ? `${route.earth} ${route.action}` : 'Use the selected Earth training location and keep the visual language consistent with that route.';
  const ready = ['J0', 'A0', 'P0'].includes(node.code);
  return {
    id: node.id,
    nodeCode: node.code,
    routeId,
    status: ready ? 'earth-opening-render-ready' : 'pending-google-video-render',
    earthOnlyAction: true,
    sceneBrief: storyBrief(node),
    prompt: `${globalPrompt} ${routeText} Stage the scene as a visual interpretation of: ${storyBrief(node)}`,
    negativePrompt,
    outputMp4: `media/video/v2/${routeId === 'shared' ? 'shared' : routeId}/${node.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-earth.mp4`,
    outputHls: `media/video/v2/${routeId === 'shared' ? 'shared' : routeId}/master.m3u8`,
    audioPolicy: 'Generate visuals without embedded dialogue; attach approved ElevenLabs ES/EN tracks after MP4 QA.'
  };
});
const queue = {
  schemaVersion: '2.1.0',
  provider: 'Google Flow',
  status: 'earth-training-queue-prepared',
  sourceStory: 'data/story.json',
  selectionRequired: true,
  selectionKey: 'route',
  summary: { nodes: items.length, openingsReady: items.filter((item) => item.status === 'earth-opening-render-ready').length, pending: items.filter((item) => item.status !== 'earth-opening-render-ready').length },
  items
};
fs.writeFileSync(path.join(root, 'data', 'video-generation-queue.json'), `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Wrote ${items.length} video jobs to data/video-generation-queue.json`);
