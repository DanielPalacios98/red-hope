import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const story = JSON.parse(fs.readFileSync(path.join(root, 'data', 'story.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data', 'audio-manifest.json'), 'utf8'));
const clean = (value) => String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const scriptText = (node) => {
  const script = Array.isArray(node.script) ? node.script.map(clean).join(' ') : clean(node.script);
  if (script) return script;
  const choices = (node.choices || []).map((choice, index) => `Opción ${index + 1}: ${clean(choice.label)}`).join(' ');
  return [clean(node.title), choices].filter(Boolean).join('. ');
};

const items = [];
for (const node of story.nodes) {
  for (const language of manifest.languages) {
    items.push({
      id: `${node.code.toLowerCase()}-${language}`,
      nodeId: node.id,
      nodeCode: node.code,
      language,
      speaker: node.speaker || node.character || 'NARRATOR',
      text: scriptText(node),
      textSourceLanguage: 'es',
      translationStatus: language === 'es' ? 'not-required' : 'pending',
      output: manifest.outputPattern.replace('{language}', language).replace('{nodeCode}', node.code.toLowerCase()),
      captions: manifest.captionPattern.replace('{language}', language).replace('{nodeCode}', node.code.toLowerCase()),
      status: language === 'es' ? 'pending-voice-id' : 'pending-translation'
    });
  }
}

const queue = {
  schemaVersion: '2.0.0',
  provider: manifest.provider,
  status: manifest.status,
  sourceStory: manifest.sourceStory,
  generatedAt: new Date().toISOString(),
  summary: { nodes: story.nodes.length, languages: manifest.languages, tracks: items.length, ready: 0 },
  items
};
const output = path.join(root, 'data', 'audio-generation-queue.json');
fs.writeFileSync(output, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Wrote ${items.length} audio jobs to ${output}`);
