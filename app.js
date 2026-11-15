const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const ui = {
  es: { mission: 'PREPARANDO MISIÓN', openMap: 'Continuar historia', introKicker: 'PRÓLOGO · 15:00 EN MASSACHUSETTS', introTitle: 'Crónica de dos mundos', introLead: 'Antes de elegir un campo de entrenamiento, debes entender por qué James desapareció y qué estás arriesgando al entrar en la carrera marciana.', introCaption: 'El primer rastro aparece en la Tierra.', introP1: 'A las 15:00 vuelves del colegio a una casa vacía en Massachusetts. James, tu hermano mayor y pasante de la NASA, no llegó en todo el día ni durante la noche.', introP2: 'Las noticias relacionan su desaparición con NEW ERA, una organización que intenta adelantar la colonización de Marte con fines militares. En el semáforo, una voz conocida te advierte que Brad escapó y que James fue secuestrado.', introP3: 'En el auditorio, la NASA anuncia un programa de entrenamiento terrestre. Tendrás que superar pruebas en lugares reales de la Tierra que ayudan a estudiar terrenos marcianos. Te inscribes sin avisar a tus padres.', introBriefingLabel: 'BRIEFING NASA', introBriefing: 'Tu objetivo es encontrar a James y completar tres rutas de entrenamiento. El mapa mostrará el lugar terrestre, su análogo marciano y las pruebas que pueden cambiar tu final.', introMap: 'Abrir mapa de misión', mapTitle: 'Elige dónde comienza tu entrenamiento', mapLead: 'Los puntos de partida conectan un escenario de la historia con un análogo terrestre. La selección fija la ruta narrativa y el paquete de generación audiovisual.', confirm: 'Confirmar ruta', change: 'Cambiar idioma', back: '← Volver al mapa', decision: 'Elige cómo responder', open: 'DECISIÓN ABIERTA', continue: 'Continuar', restart: 'Reiniciar misión', pending: 'ESCENA VISUAL PENDIENTE DE GENERACIÓN', pendingCopy: 'La viñeta se presenta como panel de novela gráfica mientras la ruta conserva sus decisiones y datos.', audioPending: 'Audio y subtítulos v2 pendientes de conectar', science: 'NASA · CONTEXTO', routeRequired: 'Selecciona una de las tres rutas para continuar.', selected: 'Ruta seleccionada', end: 'REGISTRO COMPLETADO' },
  en: { mission: 'MISSION READY', openMap: 'Continue story', introKicker: 'PROLOGUE · 15:00 IN MASSACHUSETTS', introTitle: 'Chronicle of Two Worlds', introLead: 'Before choosing a training field, you need to understand why James disappeared and what you risk by entering the Mars race.', introCaption: 'The first clue appears on Earth.', introP1: 'At 15:00 you return from school to an empty house in Massachusetts. James, your older brother and a NASA engineering intern, did not come home that day or during the night.', introP2: 'The news links his disappearance to NEW ERA, an organization trying to accelerate Mars colonization for military purposes. At a traffic light, a familiar voice warns you that Brad escaped and James was taken.', introP3: 'In the auditorium, NASA announces a terrestrial training program. You must pass tests in real places on Earth that help researchers study Martian terrain. You enroll without telling your parents.', introBriefingLabel: 'NASA BRIEFING', introBriefing: 'Your goal is to find James and complete three training routes. The map will show the Earth field, its Mars analogue and the tests that can change your ending.', introMap: 'Open mission map', mapTitle: 'Choose where your training begins', mapLead: 'Each starting point connects a story setting with an Earth analogue. Your selection fixes the narrative route and audiovisual generation package.', confirm: 'Confirm route', change: 'Change language', back: '← Back to map', decision: 'Choose your response', open: 'DECISION OPEN', continue: 'Continue', restart: 'Restart mission', pending: 'VISUAL SCENE PENDING GENERATION', pendingCopy: 'The vignette is presented as a graphic-novel panel while your choices and science data remain active.', audioPending: 'V2 audio and captions pending connection', science: 'NASA · CONTEXT', routeRequired: 'Select one of the three routes to continue.', selected: 'Route selected', end: 'MISSION RECORD COMPLETE' }
};

const state = { language: localStorage.getItem('redHope.audioLanguage') || 'es', route: localStorage.getItem('redHope.route') || null, nodeId: null, marks: [], choiceHistory: [], visited: [], ending: null, story: null, routes: null, mapResources: null, audioManifest: null };
const videoPlayers = { a: '#scene-video-a', b: '#scene-video-b' };
const hlsInstances = { a: null, b: null };
const missionMaps = { mars: null, earth: null, marsMarker: null, earthMarker: null };
let activeVideoKey = 'a';
const routeColors = { jezero: '#ff713f', arcadia: '#5fd5d4', arsia: '#a57cff' };
const routeNumbers = { jezero: '01', arcadia: '02', arsia: '03' };
const routeLabels = { jezero: 'El Lago Antiguo', arcadia: 'Cazadores de Hielo', arsia: 'Las Cuevas Secretas' };
const routeTitlesEn = { jezero: 'Ancient Lake — Jezero Crater', arcadia: 'Ice Hunters — Arcadia Planitia', arsia: 'Secret Caves — Arsia Mons Flanks' };
const routeEarthEn = { jezero: 'Gran Arenal del Chimborazo, Ecuador', arcadia: 'Siloli Desert, Bolivia', arsia: 'La Payunia, Mendoza, Argentina' };

function t(key) { return ui[state.language][key] || ui.es[key] || key; }
function routeTitle(route) { return state.language === 'en' ? routeTitlesEn[route.id] : route.mapTitle; }
function routeEarth(route) { return state.language === 'en' ? routeEarthEn[route.id] : route.earthAnalog; }
function setText(selector, value) { const node = $(selector); if (node) node.textContent = value; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('is-visible'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800); }
function screen(name) { ['language', 'intro', 'map', 'story'].forEach((id) => $(`#screen-${id}`).classList.toggle('is-hidden', id !== name)); document.body.classList.toggle('story-mode', name === 'story'); window.scrollTo({ top: 0, behavior: 'smooth' }); if (name === 'map') window.setTimeout(ensureMissionMaps, 80); }
function asText(value) { return Array.isArray(value) ? value.join('\n') : String(value || ''); }
function routeById(id) { return state.routes?.routes?.find((route) => route.id === id); }
function nodeById(id) { return state.story?.nodes?.find((node) => node.id === id); }
function activeRoute() { return routeById(state.route); }

function routeMapData(route) { return state.mapResources?.routes?.[route?.id] || null; }

function ensureMissionMaps() {
  if (!state.mapResources || !window.L || !$('#map-mars') || !$('#map-earth')) return;
  const route = activeRoute() || state.routes?.routes?.[0];
  if (!route) return;
  const data = routeMapData(route); const tiles = state.mapResources.tiles;
  if (!missionMaps.mars) {
    missionMaps.mars = window.L.map('map-mars', { zoomControl: false, attributionControl: true }).setView(data.mars.coordinates, data.mars.zoom);
    window.L.control.zoom({ position: 'bottomright' }).addTo(missionMaps.mars);
    window.L.tileLayer(tiles.mars.url, { attribution: tiles.mars.attribution, maxZoom: tiles.mars.maxZoom }).addTo(missionMaps.mars);
    missionMaps.marsMarker = window.L.circleMarker(data.mars.coordinates, { radius: 10, color: '#fde047', weight: 3, fillColor: '#ef4444', fillOpacity: 0.75 }).addTo(missionMaps.mars);
  }
  if (!missionMaps.earth) {
    missionMaps.earth = window.L.map('map-earth', { zoomControl: false, attributionControl: true }).setView(data.earth.coordinates, data.earth.zoom);
    window.L.control.zoom({ position: 'bottomright' }).addTo(missionMaps.earth);
    window.L.tileLayer(tiles.earth.url, { attribution: tiles.earth.attribution, maxZoom: tiles.earth.maxZoom }).addTo(missionMaps.earth);
    missionMaps.earthMarker = window.L.circleMarker(data.earth.coordinates, { radius: 11, color: '#38bdf8', weight: 3, fillColor: '#22c55e', fillOpacity: 0.7 }).addTo(missionMaps.earth);
  }
  updateMissionMaps(route);
}

function updateMissionMaps(route) {
  const data = routeMapData(route); if (!data) return;
  if (missionMaps.mars) { missionMaps.mars.setView(data.mars.coordinates, data.mars.zoom); missionMaps.marsMarker.setLatLng(data.mars.coordinates); missionMaps.mars.invalidateSize(); }
  if (missionMaps.earth) { missionMaps.earth.setView(data.earth.coordinates, data.earth.zoom); missionMaps.earthMarker.setLatLng(data.earth.coordinates); missionMaps.earth.invalidateSize(); }
}

function renderRouteIntel(route) {
  const data = routeMapData(route); if (!data) return;
  setText('#mars-map-caption', data.mars.label); setText('#earth-map-caption', data.earth.label);
  setText('#map-route-title', routeTitle(route));
  setText('#map-route-narrative', `${route.earthAnalog} funciona como campo terrestre para estudiar ${route.scienceFocus.join(', ')}. Las capas son referencias educativas, no telemetría en vivo.`);
  const tasks = $('#map-tasks'); tasks.innerHTML = data.tasks.map((task, index) => `<li><strong>Prueba ${index + 1}</strong> ${task}</li>`).join('');
  $('#map-telemetry-body').innerHTML = data.telemetry.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('');
  ensureMissionMaps(); updateMissionMaps(route);
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  setText('#mission-status', t('mission'));
  setText('#open-map', t('openMap'));
  setText('#intro-kicker', t('introKicker')); setText('#intro-title', t('introTitle')); setText('#intro-lede', t('introLead')); setText('#intro-caption', t('introCaption')); setText('#intro-p1', t('introP1')); setText('#intro-p2', t('introP2')); setText('#intro-p3', t('introP3')); setText('#intro-briefing-label', t('introBriefingLabel')); setText('#intro-briefing', t('introBriefing')); setText('#intro-to-map', `${t('introMap')} →`);
  setText('#map-title', t('mapTitle'));
  setText('#map-lede', t('mapLead'));
  setText('#start-route', t('confirm'));
  setText('#change-language', t('change'));
  setText('#back-to-map', t('back'));
  setText('#decision-title', t('decision'));
  setText('#decision-state', t('open'));
  setText('#restart-mission', t('restart'));
  localStorage.setItem('redHope.audioLanguage', state.language);
  $$('.language-card').forEach((card) => card.classList.toggle('is-selected', card.dataset.language === state.language));
  $('#language-notice').textContent = state.language === 'es' ? 'La selección se guarda en este dispositivo y activa el primer gesto de audio en móviles.' : 'Your choice is saved on this device and enables the first audio gesture on mobile.';
  if (state.story && !$('#screen-story').classList.contains('is-hidden')) renderNode(state.nodeId);
  if (state.routes && !$('#screen-map').classList.contains('is-hidden')) { renderRouteCards(); if (state.route) selectRoute(state.route); }
}

function renderRouteCards() {
  const grid = $('#route-grid');
  grid.innerHTML = '';
  (state.routes.routes || []).forEach((route, index) => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = `route-card${state.route === route.id ? ' is-selected' : ''}`; card.dataset.route = route.id; card.style.setProperty('--route-glow', routeColors[route.id]);
    card.innerHTML = `<span class="route-num">${routeNumbers[route.id] || String(index + 1).padStart(2, '0')} · ${state.language === 'en' ? 'TRAINING ROUTE' : 'RUTA DE ENTRENAMIENTO'}</span><h3>${routeTitle(route)}</h3><p>${state.language === 'en' ? 'Trains at' : 'Entrenas en'} <strong>${routeEarth(route)}</strong></p><footer><span>${route.mars.location}</span><span>${state.language === 'en' ? 'Choose' : 'Elegir'} →</span></footer>`;
    card.addEventListener('click', () => selectRoute(route.id));
    grid.appendChild(card);
  });
}

function selectRoute(id) {
  const route = routeById(id); if (!route) return;
  state.route = id; localStorage.setItem('redHope.route', id); renderRouteCards();
  renderRouteIntel(route);
  $('#route-notice').textContent = `${state.language === 'en' ? routeTitle(route) : routeLabels[id]} · ${routeEarth(route)}`;
  $('#route-notice').classList.remove('notice-warn');
  $('#start-route').disabled = false;
}

function applyChoiceEffects(choice) {
  const effects = [...(choice.effects || []), ...(choice.conditionalEffects || []).filter((effect) => effect.type === 'removeMark')];
  effects.forEach((effect) => {
    if (!effect.mark) return;
    if (effect.type === 'removeMark') state.marks = state.marks.filter((mark) => mark !== effect.mark);
    if (effect.type === 'addMark' && !state.marks.includes(effect.mark)) state.marks.push(effect.mark);
  });
}

function renderMarks() {
  const container = $('#marks');
  container.innerHTML = state.marks.length ? state.marks.map((mark) => `<span>${mark}</span>`).join('') : '<span class="empty-mark">Aún no hay marcas</span>';
}

function renderLog() {
  const list = $('#log-list'); list.innerHTML = '';
  state.visited.slice(-5).forEach((id) => { const node = nodeById(id); if (!node) return; const li = document.createElement('li'); li.textContent = node.title; list.appendChild(li); });
}

function renderStoryHeader(route) {
  setText('#route-kicker', `${routeLabels[route.id] || route.id} · ${route.mars.location}`);
  setText('#active-route', routeTitle(route));
  setText('#active-earth', `${state.language === 'en' ? 'Earth analogue' : 'Análogo'}: ${routeEarth(route)}`);
}

function videoElement(key) { return $(videoPlayers[key]); }
function clearVideoSource(key) { const video = videoElement(key); if (hlsInstances[key]) { hlsInstances[key].destroy(); hlsInstances[key] = null; } video.pause(); video.removeAttribute('src'); video.load(); }
function imageRouteForNode(node, route) {
  const id = String(node.id || '').toLowerCase();
  if (id.startsWith('i')) return 'shared';
  if (id.startsWith('j')) return 'jezero';
  if (id.startsWith('a')) return 'arcadia';
  if (id.startsWith('p')) return 'arsia';
  return route.id;
}
function prepareVideoSource(key, source) {
  const video = videoElement(key);
  clearVideoSource(key);
  if (!source) return;
  if (source.endsWith('.m3u8')) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = source;
    else if (window.Hls?.isSupported()) { hlsInstances[key] = new window.Hls({ enableWorker: true, lowLatencyMode: false }); hlsInstances[key].loadSource(source); hlsInstances[key].attachMedia(video); }
    else { showToast('Este navegador no soporta HLS.'); return; }
  } else video.src = source;
  video.classList.remove('is-hidden');
}
function swapVideoPlayers(nextKey) {
  const previousKey = activeVideoKey;
  const previous = videoElement(previousKey);
  const next = videoElement(nextKey);
  previous.pause(); previous.classList.remove('is-active');
  next.classList.remove('is-hidden'); next.classList.add('is-active');
  activeVideoKey = nextKey;
  next.play().catch(() => {});
}
function prepareAndSwapVideo(source) {
  const standbyKey = activeVideoKey === 'a' ? 'b' : 'a';
  prepareVideoSource(standbyKey, source);
  const standby = videoElement(standbyKey);
  const swap = () => swapVideoPlayers(standbyKey);
  if (standby.readyState >= 3) swap();
  else standby.addEventListener('canplay', swap, { once: true });
}
function renderMedia(node, route) {
  const placeholder = $('#video-placeholder'); const sceneImage = $('#scene-image'); const audio = $('#scene-audio');
  const visual = node.media?.visual;
  const imageSource = node.media?.image || `./media/images/v2/${imageRouteForNode(node, route)}/${node.id}.svg`;
  const audioSource = node.media?.audio?.[state.language];
  const captionsSource = node.media?.captions?.[state.language];
  setText('#scene-code', node.code);
  sceneImage.classList.add('is-hidden'); sceneImage.removeAttribute('src'); sceneImage.onerror = () => { sceneImage.classList.add('is-hidden'); placeholder.classList.remove('is-hidden'); setText('#media-status', 'IMAGEN NO DISPONIBLE'); };
  if (visual) { prepareAndSwapVideo(visual); placeholder.classList.add('is-hidden'); setText('#media-status', visual.endsWith('.m3u8') ? 'HLS V2 · BUFFER SWAP' : 'MP4 V2 · BUFFER SWAP'); }
  else { ['a', 'b'].forEach((key) => { clearVideoSource(key); videoElement(key).classList.add('is-hidden'); videoElement(key).classList.toggle('is-active', key === activeVideoKey); }); sceneImage.src = imageSource; sceneImage.alt = node.media?.imageAlt || `${node.title} · ${routeEarth(route)}`; sceneImage.classList.remove('is-hidden'); placeholder.classList.add('is-hidden'); setText('#media-status', 'IMAGEN · NOVELA GRÁFICA'); setText('#placeholder-title', node.title); setText('#placeholder-copy', t('pendingCopy')); setText('#placeholder-asset', `image: ${imageSource}`); }
  if (audioSource) { audio.src = audioSource; audio.classList.remove('is-hidden'); } else { audio.pause(); audio.removeAttribute('src'); audio.classList.add('is-hidden'); }
  ['a', 'b'].forEach((key) => { const track = $(`#scene-track-${key}`); if (captionsSource) { track.src = captionsSource; track.srclang = state.language; track.label = state.language === 'es' ? 'Español' : 'English'; } else track.removeAttribute('src'); });
  setText('#video-caption', audioSource ? `${state.language.toUpperCase()} · audio conectado` : t('audioPending'));
  const manifest = state.audioManifest;
  if (manifest) setText('#audio-status', `ELEVENLABS · ${manifest.readyTracks}/${manifest.requiredTracks} pistas listas · ${state.language.toUpperCase()} · ${manifest.voiceCasting.status === 'pending' ? 'voces por asignar' : 'casting aprobado'}`);
}

function renderScience(route) {
  const marsCoords = `${route.mars.latitude}°, ${route.mars.longitude}°`;
  $('#science-content').innerHTML = `<p><strong>${route.mars.location}</strong> se presenta junto a <strong>${route.earth.location}</strong> como análogo visual de entrenamiento. La ruta usa la lógica de relieve MOLA y referencias de NASA como contexto; las coordenadas del libreto están marcadas para validación antes de exhibición científica final.</p><div class="science-list"><span>NASA MOLA</span><span>${marsCoords}</span>${route.scienceFocus.map((item) => `<span>${item}</span>`).join('')}</div>`;
}

function conditionLabel(choice) {
  if (!choice.conditions?.length) return `Ruta ${choice.targetCode} →`;
  const labels = choice.conditions.map((condition) => {
    if (condition.type === 'hasAny') return `requiere una: ${condition.marks.join(' / ')}`;
    if (condition.type === 'hasAll' || condition.type === 'has') return `si tienes: ${condition.marks.join(' + ')}`;
    if (condition.type === 'lacksAll' || condition.type === 'lacks') return `si falta: ${condition.marks.join(' + ')}`;
    if (condition.type === 'composite') return `si tienes ${condition.has.join(' + ')} y falta ${condition.lacks.join(' + ')}`;
    if (condition.type === 'path') return `si seguiste ${condition.path}`;
    return 'regla de campo';
  });
  return `Reglas posibles · ${labels.join(' · ')}`;
}

function renderNode(nodeId) {
  const node = nodeById(nodeId); const route = activeRoute(); if (!node || !route) return;
  state.nodeId = node.id; if (!state.visited.includes(node.id)) state.visited.push(node.id); state.ending = node.code.toLowerCase().startsWith('final');
  renderStoryHeader(route); renderMedia(node, route); renderMarks(); renderLog(); renderScience(route);
  setText('#scene-title', node.title); setText('#scene-index', node.code); setText('#science-chip', t('science'));
  const script = asText(node.script).replace(/^Viñeta(?:\s*\d+)?\.\s*/g, '').trim();
  $('#scene-script').innerHTML = script.split(/(?=Viñeta(?:\s*\d+)?\.)/).filter(Boolean).map((part) => `<p>${part.trim()}</p>`).join('') || '<p>La bitácora espera una nueva escena.</p>';
  const choices = $('#choices'); choices.innerHTML = '';
  node.choices.forEach((choice, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'choice-button'; button.innerHTML = `<span class="choice-number">OPCIÓN ${String(index + 1).padStart(2, '0')}</span><span class="choice-label">${choice.label}</span><span class="choice-effect">${conditionLabel(choice)}</span>`; button.addEventListener('click', () => choose(node, choice)); choices.appendChild(button); });
  $('#continue-wrap').innerHTML = '';
  if (!node.choices.length && !state.ending) {
    const next = inferNext(node); const actions = document.createElement('div'); actions.className = 'transition-actions';
    const continueButton = document.createElement('button'); continueButton.type = 'button'; continueButton.className = 'primary-button'; continueButton.textContent = next ? `${state.language === 'en' ? 'Open choices for' : 'Abrir opciones de'} ${next.code}: ${next.title} →` : `${t('continue')} →`; if (next) continueButton.addEventListener('click', () => renderNode(next.id)); else continueButton.disabled = true;
    actions.appendChild(continueButton); $('#continue-wrap').appendChild(actions);
  }
  $('#decision-state').textContent = state.ending ? t('end') : node.choices.length ? t('open') : 'ESCENA';
  $('#ending-panel').classList.toggle('is-hidden', !state.ending); if (state.ending) { setText('#ending-title', node.title); setText('#ending-copy', script); }
  updateProgress();
}

function inferNext(node) { const text = asText(node.script); const targetCode = text.match(/(?:Continúa en|Ve a)\s+([A-Z0-9-]+)/i)?.[1]; if (!targetCode) return null; return state.story.nodes.find((candidate) => candidate.code.toUpperCase() === targetCode.toUpperCase()) || null; }
function choose(node, choice) { state.choiceHistory.push({ from: node.id, choice: choice.id, target: choice.target, conditions: choice.conditions || [] }); applyChoiceEffects(choice); renderNode(choice.target); }
function updateProgress() { const total = state.story?.nodes?.length || 1; const visited = state.visited.length; $('#progress-fill').style.width = `${Math.max(18, Math.min(100, 18 + (visited / total) * 82))}%`; }

function startRoute() { const route = activeRoute(); if (!route) { showToast(t('routeRequired')); return; } state.nodeId = route.startNode; state.visited = []; state.marks = []; state.choiceHistory = []; screen('story'); renderNode(route.startNode); }
function restart() { state.nodeId = null; state.marks = []; state.choiceHistory = []; state.visited = []; state.ending = null; screen('map'); renderRouteCards(); if (state.route) selectRoute(state.route); }

async function boot() {
  try { const [story, routes, mapResources, audioManifest] = await Promise.all([fetch('./data/story.json').then((r) => r.json()), fetch('./data/routes.json').then((r) => r.json()), fetch('./data/map-resources.json').then((r) => r.json()), fetch('./data/audio-manifest.json').then((r) => r.json())]); state.story = story; state.routes = routes; state.mapResources = mapResources; state.audioManifest = audioManifest; applyLanguage(); renderRouteCards(); if (state.route) selectRoute(state.route); $('#open-map').disabled = false; }
  catch (error) { console.error(error); showToast('No se pudo cargar el paquete narrativo.'); }
}

$$('.language-card').forEach((card) => card.addEventListener('click', () => { state.language = card.dataset.language; applyLanguage(); }));
$('#open-map').addEventListener('click', () => screen('intro'));
$('#intro-to-map').addEventListener('click', () => screen('map'));
$('#start-route').addEventListener('click', startRoute);
$('#change-language').addEventListener('click', () => screen('language'));
$('#back-to-map').addEventListener('click', () => screen('map'));
$('#restart-mission').addEventListener('click', restart);
boot();
