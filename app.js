const $ = (selector) => document.querySelector(selector);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const percent = (value) => `${Math.round(clamp(Number(value)) * 100)}%`;

const media = {
  video: {
    p001: "./media/video/p001_chimborazo_rover.mp4",
    p002: "./media/video/p002_rover_drill.mp4",
    p003: "./media/video/p003_rover_drift.mp4",
    p004: "./media/video/p004_cliff_anchor.mp4",
    p005: "./media/video/p005_camera_calibration.mp4",
    p006: "./media/video/p006_drill_overheat.mp4",
    p007: "./media/video/p007_gpr_scan.mp4",
    p008: "./media/video/p008_blind_reading.mp4",
    p009: "./media/video/p009_thermal_drill.mp4",
    p011: "./media/video/p011_ice_crack.mp4",
    p014: "./media/video/p014_solar_anchor.mp4",
    p020: "./media/video/p020_spacecraft_launch.mp4"
  },
  poster: {
    p001: "./media/posters/p001_chimborazo_rover.poster.jpg",
    p002: "./media/posters/p002_rover_drill.poster.jpg",
    p003: "./media/posters/p003_rover_drift.poster.jpg",
    p004: "./media/posters/p004_cliff_anchor.poster.jpg",
    p005: "./media/posters/p005_camera_calibration.poster.jpg",
    p006: "./media/posters/p006_drill_overheat.poster.jpg",
    p007: "./media/posters/p007_gpr_scan.poster.jpg",
    p008: "./media/posters/p008_blind_reading.poster.jpg",
    p009: "./media/posters/p009_thermal_drill.poster.jpg",
    p011: "./media/posters/p011_ice_crack.poster.jpg",
    p014: "./media/posters/p014_solar_anchor.poster.jpg",
    p020: "./media/posters/p020_spacecraft_launch.poster.jpg"
  },
  audio: {
    p001: "./media/audio/p001_prologue.wav",
    p002: "./media/audio/p002_rover_drill.wav",
    p003: "./media/audio/p003_rover_drift.wav",
    p007: "./media/audio/p007_medal_one.wav",
    p014: "./media/audio/p014_medal_two.wav",
    p020: "./media/audio/p020_three_medals.wav"
  }
};

const scienceLibrary = {
  "earth.chimborazo": ["ANALOGÍA TERRESTRE", "El Chimborazo funciona como campo de entrenamiento de ceniza, pendiente y frío. No es una lectura de Marte."],
  "mars.jezero": ["NASA / VALIDADO", "Jezero conserva evidencias de un antiguo lago y un delta que Perseverance estudia mediante imágenes, perforación y núcleos de roca."],
  "rover.traction": ["PROCEDIMIENTO", "La decisión enseña a priorizar control, anclaje y lectura del suelo antes de exigir potencia al rover."],
  "safety.anchor": ["SEGURIDAD", "Un anclaje representa una variable de procedimiento narrativo; no es telemetría NASA en vivo."],
  "mars.arcadia": ["NASA / CONTEXTO", "SHARAD, a bordo de MRO, estudia estructuras subsuperficiales y depósitos ricos en hielo. El punto exacto del guion se conserva como hipótesis educativa."],
  "earth.siloli": ["ANALOGÍA TERRESTRE", "El Siloli representa una llanura fría y expuesta para aprender a proteger energía, equipo y comunicación."],
  "mars.arsia_mons": ["NASA / VALIDADO", "HiRISE observó un pozo asociado con un tubo de lava en la región de Arsia Mons. Eso inspira la prueba de descenso y LiDAR."],
  "earth.payunia": ["ANALOGÍA TERRESTRE", "Payunia aporta el análogo volcánico para practicar arnés, lectura de techo y repetidores."],
  "radiation.shelter": ["NASA / CONTEXTO", "RAD mide radiación de alta energía en Marte. El juego usa el tema para enseñar medición y protección, no para inventar una lectura actual."],
  "mission.structure": ["FICCIÓN CONTROLADA", "2050, las tres medallas y la autorización de embarque pertenecen al universo narrativo."],
  "mars.transfer": ["ESTIMACIÓN NARRATIVA", "Los 210 días y 480 millones de kilómetros se mantienen como dato de ficción hasta completar validación de misión y trayectoria."],
  "deep_space_communications": ["CONCEPTO EDUCATIVO", "La señal estable se presenta como problema de diseño y redundancia, no como telemetría de una misión real."]
};

let story;
let currentNodeId = "p001";
let gameState;
let history = [];
let started = false;
let muted = false;
let captionsOn = true;
let sceneTimer;

const video = $("#sceneVideo");
const audio = new Audio();
audio.preload = "auto";

function initialState() {
  return JSON.parse(JSON.stringify(story.initialState));
}

function announce(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setMeter(id, value) {
  $(id).style.width = percent(value);
}

function renderTelemetry() {
  const medals = Number(gameState["training.medals"] || 0);
  document.querySelectorAll("[data-medal]").forEach((element) => {
    element.classList.toggle("earned", Number(element.dataset.medal) <= medals);
  });
  $("#roverValue").textContent = percent(gameState["rover.control"]);
  $("#equipmentValue").textContent = percent(gameState["equipment.integrity"]);
  $("#riskValue").textContent = percent(gameState["route.risk"]);
  setMeter("#roverMeter", gameState["rover.control"]);
  setMeter("#equipmentMeter", gameState["equipment.integrity"]);
  setMeter("#riskMeter", gameState["route.risk"]);
}

function setRailLog(message) {
  $("#railLog").innerHTML = `<p class="eyebrow">Bitácora</p><p>${message}</p>`;
}

function updateCaption(node) {
  const caption = $("#caption");
  caption.textContent = node.narrationDraft || "";
  caption.classList.toggle("visible", captionsOn && Boolean(node.narrationDraft));
}

function routeLabel(route) {
  return ({ safe: "control", risk: "riesgo", recovery: "recuperación" })[route] || route || "decisión";
}

function applyEffects(effects = []) {
  effects.forEach((effect) => {
    const current = Number(gameState[effect.var] || 0);
    if (effect.operation === "set") gameState[effect.var] = effect.value;
    if (effect.operation === "add") gameState[effect.var] = clamp(current + effect.value);
    if (effect.operation === "subtract") gameState[effect.var] = clamp(current - effect.value);
  });
  localStorage.setItem("red-hope-v1-state", JSON.stringify(gameState));
  renderTelemetry();
}

function renderChoices(node) {
  const container = $("#choices");
  container.innerHTML = "";
  const choices = node.choices || [];
  $("#choiceQuestion").textContent = choices.length ? "Elige cómo responder" : "Escena completada";
  $("#choiceLock").textContent = choices.length ? "BLOQUEADO" : "FINAL ABIERTO";
  $("#choiceLock").classList.toggle("open", !choices.length);
  $("#showChoicesButton").textContent = choices.length ? "Abrir decisiones" : "Ver final";
  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-card";
    button.dataset.choiceId = choice.id;
    button.innerHTML = `<span class="choice-index">OPCIÓN 0${index + 1}</span><span class="choice-label"></span><span class="choice-route">${routeLabel(choice.route)} ↗</span>`;
    button.querySelector(".choice-label").textContent = choice.label;
    button.addEventListener("click", () => choose(choice));
    container.appendChild(button);
  });
  $("#choicePanel").classList.remove("is-open");
}

function openChoices() {
  const node = story.nodes[currentNodeId];
  if (!node) return;
  if (!(node.choices || []).length) {
    showEnding(node);
    return;
  }
  $("#choicePanel").classList.add("is-open");
  $("#choiceLock").textContent = "DECISION ABIERTA";
  $("#choiceLock").classList.add("open");
  $("#controlNote").textContent = "La ruta elegida modifica la telemetría y la bitácora.";
  $("#choicePanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function choose(choice) {
  const node = story.nodes[currentNodeId];
  applyEffects(choice.effects);
  history.push({ nodeId: currentNodeId, title: node.title, choice: choice.label, route: choice.route, next: choice.next });
  setRailLog(`${choice.route === "risk" ? "Riesgo" : "Procedimiento"}: ${choice.label}`);
  localStorage.setItem("red-hope-v1-history", JSON.stringify(history));
  announce(`Ruta registrada: ${routeLabel(choice.route)}`);
  loadNode(choice.next);
}

function resetMedia() {
  window.clearTimeout(sceneTimer);
  video.pause();
  video.removeAttribute("src");
  video.removeAttribute("poster");
  video.classList.remove("ready");
  video.load();
  $("#mediaPlaceholder").style.display = "grid";
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
}

function loadNode(nodeId) {
  if (!story.nodes[nodeId]) return;
  currentNodeId = nodeId;
  const node = story.nodes[nodeId];
  resetMedia();
  $("#stageScene").textContent = (node.scene || "scene").replaceAll("_", " ").toUpperCase();
  $("#stageTitle").textContent = node.title;
  $("#nodeReadout").textContent = String(node.page || 1).padStart(2, "0");
  $("#placeholderTitle").textContent = node.title;
  updateCaption(node);
  renderChoices(node);
  if (media.video[nodeId]) {
    video.src = media.video[nodeId];
    video.poster = media.poster[nodeId] || "";
    video.classList.add("ready");
    $("#mediaPlaceholder").style.display = "none";
    $("#mediaMode").textContent = "MVP / MP4 local";
  } else {
    $("#mediaMode").textContent = "Placa pendiente / audio listo";
  }
  if (media.audio[nodeId]) {
    audio.src = media.audio[nodeId];
    audio.muted = muted;
  }
  $("#mediaDuration").textContent = node.targetDurationSec ? `${node.targetDurationSec}s objetivo` : "—";
  $("#startButton").classList.toggle("hidden", started);
  $("#playButton").textContent = started ? "Ⅱ Pausar" : "▶ Reproducir";
  setRailLog(`Nodo ${String(node.page || 1).padStart(2, "0")}: ${node.title}`);
  renderTelemetry();
  renderScience(node);
  if (started) {
    playCurrentMedia();
    sceneTimer = window.setTimeout(openChoices, media.video[nodeId] ? 4500 : 1800);
  }
}

function playCurrentMedia() {
  const videoPromise = media.video[currentNodeId] ? video.play() : Promise.resolve();
  const audioPromise = audio.src ? audio.play() : Promise.resolve();
  Promise.allSettled([videoPromise, audioPromise]);
  $("#playButton").textContent = "Ⅱ Pausar";
}

function pauseCurrentMedia() {
  video.pause();
  audio.pause();
  $("#playButton").textContent = "▶ Reproducir";
}

function showEnding(node) {
  const ending = story.endings[node.endingId || "e001_mars_authorization"] || {};
  $("#endingTitle").textContent = ending.title || "Autorización para Marte";
  $("#endingCopy").textContent = ending.openQuestion || "El horizonte rojo queda abierto.";
  $("#endingScreen").classList.add("open");
  $("#endingScreen").setAttribute("aria-hidden", "false");
}

function renderScience(node) {
  const content = $("#scienceContent");
  content.innerHTML = "";
  const refs = node.dataRefs || [];
  refs.forEach((ref) => {
    const item = scienceLibrary[ref] || ["PENDIENTE DE VALIDACIÓN", "Esta referencia todavía no puede presentarse como telemetría confirmada."];
    const block = document.createElement("article");
    block.className = "science-item";
    block.innerHTML = `<span class="science-badge"></span><strong></strong><small></small>`;
    block.querySelector(".science-badge").textContent = item[0];
    block.querySelector("strong").textContent = ref.replaceAll("_", " ");
    block.querySelector("small").textContent = item[1];
    content.appendChild(block);
  });
}

function renderLog() {
  const content = $("#logContent");
  content.innerHTML = history.length ? "" : "<p class='drawer-intro'>Todavía no has tomado una decisión.</p>";
  history.forEach((entry, index) => {
    const item = document.createElement("article");
    item.className = "log-item";
    item.innerHTML = `<strong>0${index + 1}. ${entry.title}</strong><small>${entry.choice}<br>Ruta: ${routeLabel(entry.route)} → ${entry.next}</small>`;
    content.appendChild(item);
  });
}

function openDrawer(id) {
  const drawer = document.getElementById(id);
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  if (id === "logDrawer") renderLog();
}

function closeDrawer(id) {
  const drawer = document.getElementById(id);
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function restartMission() {
  started = false;
  history = [];
  gameState = initialState();
  localStorage.removeItem("red-hope-v1-state");
  localStorage.removeItem("red-hope-v1-history");
  $("#endingScreen").classList.remove("open");
  $("#endingScreen").setAttribute("aria-hidden", "true");
  loadNode(story.startNode || "p001");
  announce("Misión reiniciada");
}

function bindEvents() {
  $("#startButton").addEventListener("click", () => {
    started = true;
    $("#startButton").classList.add("hidden");
    playCurrentMedia();
    sceneTimer = window.setTimeout(openChoices, media.video[currentNodeId] ? 4500 : 1800);
  });
  $("#playButton").addEventListener("click", () => {
    if (!started) return $("#startButton").click();
    if (!video.paused || !audio.paused) pauseCurrentMedia();
    else playCurrentMedia();
  });
  $("#showChoicesButton").addEventListener("click", openChoices);
  $("#scienceButton").addEventListener("click", () => openDrawer("scienceDrawer"));
  $("#logButton").addEventListener("click", () => openDrawer("logDrawer"));
  $("#restartButton").addEventListener("click", restartMission);
  $("#captionsButton").addEventListener("click", () => {
    captionsOn = !captionsOn;
    $("#caption").classList.toggle("visible", captionsOn && Boolean(story.nodes[currentNodeId].narrationDraft));
    $("#captionsButton").classList.toggle("active", captionsOn);
  });
  $("#muteButton").addEventListener("click", () => {
    muted = !muted;
    audio.muted = muted;
    $("#muteButton").textContent = muted ? "♫̸" : "♫";
  });
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => closeDrawer(button.dataset.close)));
  $("#endingReplay").addEventListener("click", restartMission);
  $("#endingScience").addEventListener("click", () => {
    $("#endingScreen").classList.remove("open");
    openDrawer("scienceDrawer");
  });
  video.addEventListener("ended", openChoices);
  audio.addEventListener("ended", () => {
    if (currentNodeId === "p020") showEnding(story.nodes[currentNodeId]);
  });
}

async function boot() {
  try {
    const response = await fetch("./data/story.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`story.json ${response.status}`);
    story = await response.json();
    const savedState = localStorage.getItem("red-hope-v1-state");
    const savedHistory = localStorage.getItem("red-hope-v1-history");
    gameState = savedState ? { ...initialState(), ...JSON.parse(savedState) } : initialState();
    history = savedHistory ? JSON.parse(savedHistory) : [];
    bindEvents();
    loadNode(story.startNode || "p001");
  } catch (error) {
    console.error(error);
    $("#placeholderTitle").textContent = "No se pudo cargar la historia";
    $("#controlNote").textContent = "Sirve el sitio desde un servidor estático para habilitar story.json.";
  }
}

boot();
