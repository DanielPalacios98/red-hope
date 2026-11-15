import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = path.join(root, 'data', 'story.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const tracks = {
  j0: {
    es: 'En una pantalla, el entrenador superpone el mapa del antiguo delta de Jezero al perfil del Gran Arenal. En una esquina aparece el vehículo Perseverance. Una carga de 30 kilogramos conserva su masa en los dos mundos. En Marte pesa alrededor del treinta y ocho por ciento de lo que pesa aquí. Van a entrenar cómo subir por la ceniza, extraer un testigo de roca y calibrar las cámaras en un paisaje con pocas referencias visuales.',
    en: 'On a screen, the trainer overlays a map of the ancient Jezero delta on the profile of the Gran Arenal. In one corner, the Perseverance vehicle appears. A thirty-kilogram load keeps the same mass in both worlds. On Mars, it weighs about thirty-eight percent of what it weighs here. You will train to climb through volcanic ash, extract a rock core, and calibrate cameras in a landscape with very few visual references.'
  },
  a0: {
    es: 'El mapa orbital cambia a un corte del subsuelo. La evaluadora señala las capas donde los datos orbitales sugieren la presencia de hielo. Aquí las sales complican la lectura del radar. En Marte, además, el hielo muy frío endurece la perforación y puede sublimarse si queda expuesto. A igual velocidad, el viento de Siloli ejerce más fuerza sobre un panel porque el aire es más denso. Harán tres pruebas: detectar un blanco enterrado, extraer un núcleo congelado y montar paneles frente a las ráfagas. En superficie usen la protección ultravioleta del campo.',
    en: 'The orbital map changes to a subsurface cross-section. The evaluator points to the layers where orbital data suggests ice may be present. Salts complicate the radar reading here. On Mars, extremely cold ice also makes drilling harder and can sublimate when exposed. At the same speed, Siloli wind exerts more force on a panel because the air is denser. You will run three tests: detect a buried target, extract a frozen core, and mount panels against the gusts. On the surface, use the field ultraviolet protection.'
  },
  p0: {
    es: 'El entrenador proyecta una imagen orbital de una abertura oscura en Arsia Mons. Al lado pone una fotografía del tubo de lava donde vas a entrenar. En Marte buscamos cavidades que puedan servir de refugio. Aquí vas a descender con cuerda y arnés, escanear la bóveda en tres dimensiones y restablecer la comunicación desde el interior del tubo.',
    en: 'The trainer projects an orbital image of a dark opening on Arsia Mons. Beside it, they place a photograph of the lava-tube training site. On Mars, we are looking for cavities that could serve as shelter. Here you will descend with rope and harness, scan the ceiling in three dimensions, and restore communication from inside the tube.'
  }
};
const routeByCode = { j0: 'jezero', a0: 'arcadia', p0: 'arsia' };
const vttTime = '00:00:00.000 --> 00:01:00.000';
let updated = 0;
for (const [code, languages] of Object.entries(tracks)) {
  const node = story.nodes.find((candidate) => candidate.id === code);
  if (!node) continue;
  node.media = node.media || {};
  node.media.audio = {};
  node.media.captions = {};
  for (const [language, text] of Object.entries(languages)) {
    const relative = `media/audio/v2/${language}/${code}`;
    node.media.audio[language] = `./${relative}.mp3`;
    node.media.captions[language] = `./${relative}.vtt`;
    const captionDir = path.join(root, 'media', 'audio', 'v2', language);
    fs.mkdirSync(captionDir, { recursive: true });
    fs.writeFileSync(path.join(captionDir, `${code}.vtt`), `WEBVTT\n\n1\n${vttTime}\n${text}\n`);
  }
  node.media.status = 'earth-training-visual-and-bilingual-audio-ready';
  node.media.audioProvider = 'ElevenLabs';
  node.media.audioVoices = { es: 'HR Elena', en: 'David Boles - Well-spoken and Calm' };
  updated += 1;
}
fs.writeFileSync(storyPath, `${JSON.stringify(story, null, 2)}\n`);
const manifestPath = path.join(root, 'data', 'audio-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.status = 'partial-bilingual-openings';
manifest.readyTracks = updated * 2;
manifest.readyNodes = updated;
manifest.captionsReady = updated * 2;
manifest.voiceCasting.status = 'partial-approved';
manifest.voiceCasting.voiceNames = { es: 'HR Elena', en: 'David Boles - Well-spoken and Calm' };
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Attached ${updated * 2} ElevenLabs tracks and captions for ${updated} opening nodes.`);
