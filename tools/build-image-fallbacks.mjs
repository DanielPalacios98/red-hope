import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = path.join(root, 'data', 'story.json');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

const palettes = {
  shared: { sky: '#111c2b', ground: '#263242', accent: '#ff713f', glow: '#efb16a', label: 'MASSACHUSETTS · TIERRA' },
  jezero: { sky: '#182433', ground: '#6b5144', accent: '#ff713f', glow: '#e5b36b', label: 'GRAN ARENAL DEL CHIMBORAZO · ECUADOR' },
  arcadia: { sky: '#102630', ground: '#746b59', accent: '#5fd5d4', glow: '#d7e7e3', label: 'DESIERTO DE SILOLI · BOLIVIA' },
  arsia: { sky: '#211a29', ground: '#5d3f3b', accent: '#a57cff', glow: '#d49467', label: 'LA PAYUNIA · MENDOZA' },
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
}

function wrap(value, max = 28, limit = 3) {
  const words = String(value || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > max) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, limit);
}

function folderFor(node) {
  const id = String(node.id || '').toLowerCase();
  if (id.startsWith('i')) return 'shared';
  if (id.startsWith('j')) return 'jezero';
  if (id.startsWith('a')) return 'arcadia';
  if (id.startsWith('p')) return 'arsia';
  return 'shared';
}

function sceneHint(node, folder) {
  const id = String(node.id || '').toLowerCase();
  if (folder === 'shared') {
    if (id === 'i1') return 'CASA VACÍA · SEMÁFORO · PRIMERA SEÑAL';
    if (id.startsWith('ib')) return 'AUDITORIO NASA · NOTA DE VOZ';
    if (id.startsWith('im')) return 'PERIODISTA · ARCHIVOS EN LA TIERRA';
    if (id.startsWith('ie')) return 'CASETA DE SEGURIDAD · EVIDENCIA';
    return 'ENTRENAMIENTO TERRESTRE · ARCHIVO DE MISIÓN';
  }
  if (folder === 'jezero') return 'RUTA JEZERO · RELIEVE Y CENIZA VOLCÁNICA';
  if (folder === 'arcadia') return 'RUTA ARCADIA · HIELO, SAL Y SEÑAL';
  return 'RUTA ARSIA · BASALTO, CUERDA Y SOMBRA';
}

function backdrop(folder, palette) {
  if (folder === 'shared') return `
    <path d="M0 610 L0 500 L260 500 L320 430 L520 430 L590 500 L850 500 L930 450 L1180 450 L1280 520 L1600 520 L1600 900 L0 900Z" fill="#1d2a3a"/>
    <path d="M0 710 Q400 620 780 720 T1600 680 L1600 900 L0 900Z" fill="#0c131e"/>
    <path d="M0 716 Q390 642 805 728 T1600 690" fill="none" stroke="#5fd5d4" stroke-width="4" opacity=".35"/>
    <rect x="1050" y="270" width="22" height="250" rx="10" fill="#303e51"/><rect x="1034" y="284" width="56" height="118" rx="26" fill="#0a111a" stroke="${palette.accent}" stroke-width="3"/><circle cx="1062" cy="312" r="10" fill="#ff5e4f"/><circle cx="1062" cy="344" r="10" fill="#e6b45b"/><circle cx="1062" cy="376" r="10" fill="#5fd5d4"/>
    <path d="M1160 520 L1160 390 L1450 390 L1450 520" fill="#172334" stroke="#7890a6" stroke-width="4"/><path d="M1140 390 L1305 280 L1470 390" fill="#1d3042" stroke="#9baec1" stroke-width="4"/>
  `;
  if (folder === 'jezero') return `
    <path d="M0 480 Q230 430 410 465 Q650 505 840 420 Q1070 315 1250 390 Q1450 470 1600 390 L1600 900 L0 900Z" fill="#4a3b39"/>
    <path d="M0 540 Q260 475 460 540 T900 510 T1300 490 T1600 530 L1600 900 L0 900Z" fill="${palette.ground}"/>
    <path d="M620 500 L820 170 L1010 500Z" fill="#2b3038" stroke="#d7c1a0" stroke-width="5"/><path d="M745 300 L820 170 L880 300" fill="#ebeee8" opacity=".8"/>
    <path d="M0 760 Q300 690 620 760 T1260 735 T1600 770" fill="none" stroke="#e0b578" stroke-width="9" opacity=".45"/>
    <circle cx="1240" cy="280" r="42" fill="#e5b36b" opacity=".72"/><path d="M180 650 l100 -60 90 38 -112 76z M1250 630 l120 -70 100 44 -130 80z" fill="#2e2525" stroke="#d49d6b" stroke-width="4"/>
  `;
  if (folder === 'arcadia') return `
    <path d="M0 500 Q300 410 620 480 T1240 460 T1600 500 L1600 900 L0 900Z" fill="#555747"/>
    <path d="M0 650 Q300 590 680 635 T1300 620 T1600 650 L1600 900 L0 900Z" fill="${palette.ground}"/>
    <path d="M260 660 l110 -180 90 180z M720 690 l130 -240 120 240z M1180 650 l75 -145 100 145z" fill="#d9d9c6" opacity=".7"/>
    <path d="M0 730 C280 690 480 780 730 720 S1200 690 1600 740" fill="none" stroke="#d8e7df" stroke-width="8" opacity=".55"/>
    <circle cx="1330" cy="235" r="56" fill="#d5e4df" opacity=".76"/><path d="M1200 230 l70 -24 60 30 -68 28z" fill="#1e3942" stroke="#5fd5d4" stroke-width="4"/>
  `;
  return `
    <path d="M0 460 Q220 360 420 470 Q650 570 850 430 Q1070 285 1250 430 Q1420 550 1600 420 L1600 900 L0 900Z" fill="#3b2a32"/>
    <path d="M0 630 Q300 540 620 640 T1240 600 T1600 650 L1600 900 L0 900Z" fill="${palette.ground}"/>
    <path d="M200 630 Q300 485 405 630 M420 650 Q530 430 650 650 M1170 640 Q1260 500 1360 640" fill="none" stroke="#c8866e" stroke-width="25" opacity=".58"/>
    <path d="M0 760 Q360 685 770 758 T1600 730" fill="none" stroke="#e3a26d" stroke-width="7" opacity=".45"/>
    <path d="M1020 640 C1040 530 1120 500 1200 550 C1240 580 1240 650 1265 710 L1000 710Z" fill="#161820" stroke="#a57cff" stroke-width="5"/>
    <path d="M1010 675 L890 520 M900 520 L930 520" stroke="#e6b45b" stroke-width="6" fill="none"/>
  `;
}

function svgFor(node) {
  const folder = folderFor(node);
  const palette = palettes[folder];
  const titleLines = wrap(node.title, 29, 3);
  const title = titleLines.map((line, index) => `<tspan x="104" dy="${index ? 58 : 0}">${esc(line)}</tspan>`).join('');
  const hint = esc(sceneHint(node, folder));
  const code = esc(node.code);
  const earth = esc(palette.label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">${esc(node.title)} · ${code}</title>
  <desc id="desc">Panel de novela gráfica de RED HOPE en ${earth}.</desc>
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${palette.sky}"/><stop offset="1" stop-color="#090d16"/></linearGradient>
    <linearGradient id="wash" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".82"/></linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1200" cy="210" r="190" fill="${palette.glow}" opacity=".14" filter="url(#glow)"/>
  ${backdrop(folder, palette)}
  <rect width="1600" height="900" fill="url(#wash)"/>
  <g opacity=".32" fill="none" stroke="${palette.accent}" stroke-width="2"><path d="M60 130 H1540"/><path d="M60 140 H940"/><path d="M60 760 H1540"/><path d="M60 772 H700"/></g>
  <text x="76" y="74" fill="#f4f1e9" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="24" letter-spacing="6">RED HOPE</text>
  <text x="76" y="108" fill="#9eabc1" font-family="Inter,Arial,sans-serif" font-size="14" letter-spacing="4">CRÓNICA DE DOS MUNDOS · SIMULACIÓN TERRESTRE</text>
  <text x="1520" y="82" text-anchor="end" fill="${palette.accent}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="24" letter-spacing="4">${code}</text>
  <text x="104" y="230" fill="${palette.accent}" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="17" letter-spacing="4">${hint}</text>
  <text x="104" y="360" fill="#f4f1e9" font-family="Georgia,serif" font-weight="500" font-size="52">${title}</text>
  <rect x="104" y="630" width="620" height="72" rx="8" fill="#070a12" fill-opacity=".72" stroke="${palette.accent}" stroke-opacity=".7"/>
  <text x="132" y="674" fill="#dbe5ef" font-family="Inter,Arial,sans-serif" font-size="18" letter-spacing="2">${earth}</text>
  <text x="104" y="820" fill="#9eabc1" font-family="Inter,Arial,sans-serif" font-size="15" letter-spacing="3">VIÑETA INTERACTIVA · DECISIÓN Y DATOS NASA</text>
</svg>`;
}

let written = 0;
for (const node of story.nodes || []) {
  const folder = folderFor(node);
  const relative = `./media/images/v2/${folder}/${node.id}.svg`;
  const output = path.join(root, relative.replace('./', ''));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, svgFor(node), 'utf8');
  node.media ||= {};
  node.media.image = relative;
  node.media.imageAlt = `${node.title} · ${palettes[folder].label}`;
  if (!node.media.visual) node.media.status = node.media.audio?.es || node.media.audio?.en ? 'image-novel-graphic-ready' : 'image-novel-graphic-ready-audio-pending';
  written += 1;
}

fs.writeFileSync(storyPath, `${JSON.stringify(story, null, 2)}\n`, 'utf8');
console.log(`Generated ${written} graphic-novel fallback images and linked them in story.json.`);
