# RED HOPE — An Interactive Chronicle of Two Worlds

RED HOPE is an interactive bilingual graphic novel for NASA Space Apps Challenge 2026. The player follows James's disappearance, trains on real Earth analog environments, and prepares for a peaceful Mars mission. The experience combines narrated comic panels, interactive maps, scientific context, branching decisions, notebook marks, and eight possible endings.

## Links

- Live project: [redhope.systemsfae.net](https://redhope.systemsfae.net)
- Demo video: [YouTube](https://youtu.be/YilD1zcuLF8)
- Google Earth Engine code (maps, locations and simulations): [Earth Engine repository](https://code.earthengine.google.com/?accept_repo=users/simulador_marte/fre)
- Earth Engine app: [Mission Analoga Marte](https://nasa-space-apps-2026-514719.projects.earthengine.app/view/mision-analoga-marte)

## Why it is interactive

RED HOPE is not a linear film. The player chooses a language (English or Spanish), studies a mission map, selects a route, and makes three choices at every challenge. Those choices create notebook marks and alter the evidence available in later scenes. The Earth analog sites are paired with Mars landing zones:

- Gran Arenal del Chimborazo, Ecuador → Jezero Crater
- Siloli Desert, Bolivia → Arcadia Planitia
- La Payunia, Argentina → Arsia Mons

The story uses these locations to compare Earth observations with Mars mission scenarios. The player can reach eight different endings depending on the evidence collected and the decisions made.

## NASA and partner data

The educational layer is based on the same sources used in the submission:

- SRTM
- MODIS LST
- Mars Trek MOLA / HiRISE / CTX
- PDS MEDA / SHARAD / RAD
- ESA Sentinel-2
- Google Earth Engine
- IG-EPN
- SERGEOMIN Bolivia
- SEGEMAR Argentina
- Esri World Imagery
- OpenPlanetaryMap
- Leaflet
- hls.js

## Credits — Team FRE

- Script: Pablo Palacios, Erick Guaigua
- Narration: Guillermo Intriago, Pablo Palacios, Erick Guaigua
- Maps, locations and simulations: Cobo Allan
- Code and development: Daniel Palacios

## Use of AI

AI-generated images and videos in the application carry a visible `AI-generated · Generado con IA` watermark. NASA logos and flags were removed from AI-generated content.

Tools used:

- Claude — script editing, story-rules code, narrated comic, and decision diagram
- Codex/ChatGPT — code integration, deployment, and illustrations
- Google Flow — video generation
- Gemini — Google Earth Engine code
- ElevenLabs — AI voice generation and voice prototyping for narration

## Technical implementation

- Static frontend suitable for GitHub Pages and a custom domain.
- Local MP4 and WebP fallbacks are used when an approved HLS asset is not available.
- HLS.js and the double-player buffer-swap architecture are prepared for adaptive streaming when approved masters are processed with AWS MediaConvert.
- The application does not require a backend for the static MVP. AWS media delivery can be enabled independently through S3, MediaConvert, and CloudFront.
- Subtitles, audio controls, responsive layouts, maps, decisions, telemetry, and notebook state run in the browser.

## Run locally

From this folder:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

---

## RED HOPE — versión en español

RED HOPE es una novela gráfica bilingüe e interactiva para el NASA Space Apps Challenge 2026. El jugador sigue la desaparición de James, se entrena en análogos terrestres reales y se prepara para una misión pacífica a Marte. La experiencia combina viñetas narradas, mapas interactivos, contexto científico, decisiones ramificadas, marcas en la bitácora y ocho finales posibles.

El jugador elige inglés o español, estudia el mapa de misión, selecciona una ruta y toma tres decisiones por desafío. Las decisiones modifican las marcas de la bitácora y la evidencia disponible en las escenas posteriores. Los tres campos terrestres se vinculan con Jezero, Arcadia Planitia y Arsia Mons.

La aplicación incluye una marca visible de contenido generado con IA y retiró logotipos y banderas de NASA del material generado por IA. El frontend está preparado para GitHub Pages, mapas de Google Earth Engine, medios locales y futura entrega HLS mediante AWS MediaConvert, S3 y CloudFront.

## Ejecutar localmente

```powershell
python -m http.server 4173
```

Abrir `http://127.0.0.1:4173/`.
