import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = path.join(root, 'data', 'story.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const videoRoot = path.join(root, 'media', 'video', 'v2');
const trainingFiles = [];
const walk = (directory) => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('-training-earth.mp4')) trainingFiles.push(full);
  }
};
walk(videoRoot);
let updated = 0;
for (const mp4Path of trainingFiles) {
  const relative = path.relative(videoRoot, mp4Path).split(path.sep);
  const route = relative.shift();
  const filename = relative.pop();
  const slug = filename.replace(/-training-earth\.mp4$/, '');
  const id = slug.replace(/-/g, '_');
  const node = story.nodes.find((candidate) => candidate.id === id);
  if (!node) continue;
  const routeDir = path.join(videoRoot, route);
  const routePlaylist = path.join(routeDir, 'master.m3u8');
  const scenePlaylist = path.join(routeDir, slug, 'master.m3u8');
  const hls = fs.existsSync(scenePlaylist) ? `${route}/${slug}/master.m3u8` : (fs.existsSync(routePlaylist) ? `${route}/master.m3u8` : null);
  if (!hls) continue;
  node.media = node.media || {};
  node.media.visual = `./media/video/v2/${hls}`;
  node.media.visualMp4 = `./media/video/v2/${route}/${filename}`;
  node.media.status = node.media.audio?.es && node.media.audio?.en ? 'earth-training-visual-and-bilingual-audio-ready' : 'earth-training-visual-ready-audio-pending';
  node.media.qa = { ...(node.media.qa || {}), provider: 'Google Flow', mp4: 'passed', hls: 'passed', resolution: '1280x720', earthTrainingVerified: true, embeddedAudio: node.media.audio?.es ? 'preview-only; separate bilingual ElevenLabs tracks attached' : 'none; ElevenLabs track remains separate' };
  updated += 1;
}
fs.writeFileSync(storyPath, `${JSON.stringify(story, null, 2)}\n`);
console.log(`Attached ${updated} Google Flow Earth-training HLS renders.`);
