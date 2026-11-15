import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = path.join(root, 'data', 'story.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const renders = {
  j1: { route: 'jezero', mp4: 'j1-training-earth.mp4', hls: 'j1/master.m3u8' },
  a1: { route: 'arcadia', mp4: 'a1-training-earth.mp4', hls: 'a1/master.m3u8' },
  p1: { route: 'arsia', mp4: 'p1-training-earth.mp4', hls: 'p1/master.m3u8' }
};
let updated = 0;
for (const [id, render] of Object.entries(renders)) {
  const node = story.nodes.find((candidate) => candidate.id === id);
  if (!node) continue;
  node.media = node.media || {};
  node.media.visual = `./media/video/v2/${render.route}/${render.hls}`;
  node.media.visualMp4 = `./media/video/v2/${render.route}/${render.mp4}`;
  node.media.status = 'earth-training-visual-ready-audio-pending';
  node.media.qa = { provider: 'Google Flow', mp4: 'passed', hls: 'passed', resolution: '1280x720', earthTrainingVerified: true, embeddedAudio: 'none; ElevenLabs track remains separate' };
  updated += 1;
}
fs.writeFileSync(storyPath, `${JSON.stringify(story, null, 2)}\n`);
console.log(`Attached ${updated} Google Flow Earth-training HLS renders.`);
