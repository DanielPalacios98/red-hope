import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = path.join(root, 'data', 'story.json');
const queuePath = path.join(root, 'data', 'audio-generation-queue.json');
const manifestPath = path.join(root, 'data', 'audio-manifest.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let readyTracks = 0;
let captionsReady = 0;
const readyNodes = new Set();
for (const language of manifest.languages) {
  const directory = path.join(root, 'media', 'audio', 'v2', language);
  if (!fs.existsSync(directory)) continue;
  for (const filename of fs.readdirSync(directory)) {
    if (!filename.endsWith('.mp3')) continue;
    const slug = filename.slice(0, -4);
    const id = slug.replace(/-/g, '_');
    const node = story.nodes.find((candidate) => candidate.id === id);
    if (!node) continue;
    const item = queue.items.find((candidate) => candidate.nodeId === id && candidate.language === language);
    node.media = node.media || {};
    node.media.audio = node.media.audio || {};
    node.media.captions = node.media.captions || {};
    node.media.audio[language] = `./media/audio/v2/${language}/${filename}`;
    const captionName = `${slug}.vtt`;
    const captionPath = path.join(directory, captionName);
    if (item?.text) {
      fs.writeFileSync(captionPath, `WEBVTT\n\n1\n00:00:00.000 --> 00:01:00.000\n${item.text}\n`);
      node.media.captions[language] = `./media/audio/v2/${language}/${captionName}`;
      captionsReady += 1;
    }
    readyTracks += 1;
    if (node.media.audio.es && node.media.audio.en) readyNodes.add(id);
    node.media.audioProvider = 'ElevenLabs';
    node.media.status = node.media.visual && node.media.audio.es && node.media.audio.en ? 'earth-training-visual-and-bilingual-audio-ready' : (node.media.visual ? 'earth-training-visual-ready-audio-pending' : 'audio-ready-visual-pending');
  }
}
manifest.readyTracks = readyTracks;
manifest.readyNodes = readyNodes.size;
manifest.captionsReady = captionsReady;
manifest.status = readyTracks === manifest.requiredTracks ? 'complete-bilingual-audio' : 'partial-bilingual-audio';
fs.writeFileSync(storyPath, `${JSON.stringify(story, null, 2)}\n`);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Attached ${readyTracks} ElevenLabs tracks and ${captionsReady} captions.`);
