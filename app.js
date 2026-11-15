const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const ui = {
  es: { mission: 'PREPARANDO MISIÓN', openMap: 'Abrir mapa de misión', mapTitle: 'Elige dónde comienza tu entrenamiento', mapLead: 'Los puntos de partida conectan un escenario de la historia con un análogo terrestre. La selección fija la ruta narrativa y el paquete de generación audiovisual.', confirm: 'Confirmar ruta', change: 'Cambiar idioma', back: '← Volver al mapa', decision: 'Elige cómo responder', open: 'DECISIÓN ABIERTA', continue: 'Continuar', restart: 'Reiniciar misión', pending: 'ESCENA VISUAL PENDIENTE DE GENERACIÓN', pendingCopy: 'La ruta ya está fijada. Aquí se conectará el MP4 maestro y después su variante HLS.', audioPending: 'Audio y subtítulos v2 pendientes de conectar', science: 'NASA · CONTEXTO', routeRequired: 'Selecciona una de las tres rutas para continuar.', selected: 'Ruta seleccionada', end: 'REGISTRO COMPLETADO' },
  en: { mission: 'MISSION READY', openMap: 'Open mission map', mapTitle: 'Choose where your training begins', mapLead: 'Each starting point connects a story setting with an Earth analogue. Your selection fixes the narrative route and audiovisual generation package.', confirm: 'Confirm route', change: 'Change language', back: '← Back to map', decision: 'Choose your response', open: 'DECISION OPEN', continue: 'Continue', restart: 'Restart mission', pending: 'VISUAL SCENE PENDING GENERATION', pendingCopy: 'The route is fixed. The master MP4 and its HLS variant will be connected here.', audioPending: 'V2 audio and captions pending connection', science: 'NASA · CONTEXT', routeRequired: 'Select one of the three routes to continue.', selected: 'Route selected', end: 'MISSION RECORD COMPLETE' }
};

const state = { language: localStorage.getItem('redHope.audioLanguage') || 'es', route: localStorage.getItem('redHope.route') || null, nodeId: null, marks: [], choiceHistory: [], visited: [], ending: null, story: null, routes: null };
const videoPlayers = { a: '#scene-video-a', b: '#scene-video-b' };
const hlsInstances = { a: null, b: null };
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
function screen(name) { ['language', 'map', 'story'].forEach((id) => $(`#screen-${id}`).classList.toggle('is-hidden', id !== name)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function asText(value) { return Array.isArray(value) ? value.join('\n') : String(value || ''); }
function routeById(id) { return state.routes?.routes?.find((route) => route.id === id); }
function nodeById(id) { return state.story?.nodes?.find((node) => node.id === id); }
function activeRoute() { return routeById(state.route); }

function applyLanguage() {
  document.documentElement.lang = state.language;
  setText('#mission-status', t('mission'));
  setText('#open-map', t('openMap'));
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
  setText('#mars-map-caption', `${route.mars.location} · ${route.mars.latitude}°, ${route.mars.longitude}°`);
  setText('#earth-map-caption', `${route.earth.location} · ${route.earth.elevationMeters} m`);
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
  const placeholder = $('#video-placeholder'); const audio = $('#scene-audio');
  const visual = node.media?.visual;
  const audioSource = node.media?.audio?.[state.language];
  const captionsSource = node.media?.captions?.[state.language];
  setText('#scene-code', node.code);
  if (visual) { prepareAndSwapVideo(visual); placeholder.classList.add('is-hidden'); setText('#media-status', visual.endsWith('.m3u8') ? 'HLS V2 · BUFFER SWAP' : 'MP4 V2 · BUFFER SWAP'); }
  else { ['a', 'b'].forEach((key) => { clearVideoSource(key); videoElement(key).classList.add('is-hidden'); videoElement(key).classList.toggle('is-active', key === activeVideoKey); }); placeholder.classList.remove('is-hidden'); setText('#media-status', 'VIDEO V2 PENDIENTE'); setText('#placeholder-title', routeTitle(route)); setText('#placeholder-copy', t('pendingCopy')); setText('#placeholder-asset', `assetPrefix: ${route.assetPrefix}`); }
  if (audioSource) { audio.src = audioSource; audio.classList.remove('is-hidden'); } else { audio.pause(); audio.removeAttribute('src'); audio.classList.add('is-hidden'); }
  ['a', 'b'].forEach((key) => { const track = $(`#scene-track-${key}`); if (captionsSource) { track.src = captionsSource; track.srclang = state.language; track.label = state.language === 'es' ? 'Español' : 'English'; } else track.removeAttribute('src'); });
  setText('#video-caption', audioSource ? `${state.language.toUpperCase()} · audio conectado` : t('audioPending'));
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
  if (!node.choices.length && !state.ending) { const button = document.createElement('button'); button.type = 'button'; button.className = 'primary-button'; button.textContent = `${t('continue')} →`; const next = inferNext(node); if (next) button.addEventListener('click', () => renderNode(next.id)); else button.disabled = true; $('#continue-wrap').appendChild(button); }
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
  try { const [story, routes] = await Promise.all([fetch('./data/story.json').then((r) => r.json()), fetch('./data/routes.json').then((r) => r.json())]); state.story = story; state.routes = routes; applyLanguage(); renderRouteCards(); if (state.route) selectRoute(state.route); $('#open-map').disabled = false; }
  catch (error) { console.error(error); showToast('No se pudo cargar el paquete narrativo.'); }
}

$$('.language-card').forEach((card) => card.addEventListener('click', () => { state.language = card.dataset.language; applyLanguage(); }));
$('#open-map').addEventListener('click', () => screen('map'));
$('#start-route').addEventListener('click', startRoute);
$('#change-language').addEventListener('click', () => screen('language'));
$('#back-to-map').addEventListener('click', () => screen('map'));
$('#restart-mission').addEventListener('click', restart);
boot();
