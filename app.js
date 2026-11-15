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

// Capa frontal derivada de Historia.html: cada lugar conecta el entrenamiento
// terrestre con una hipótesis de exploración marciana y con tres pruebas del guion.
const missionSites = [
  {
    id: "chimborazo",
    label: "1. El lago antiguo / Cráter Jezero",
    earthTitle: "Tierra: Gran Arenal del Chimborazo, Ecuador",
    marsTitle: "Marte: Cráter Jezero",
    earthCoords: [-1.469, -78.855],
    earthZoom: 12,
    marsCoords: [18.38, 77.58],
    marsZoom: 5,
    bridge: "Perseverance estudia un antiguo delta; el Chimborazo entrena el control de ruedas, perforación y lectura óptica en terreno volcánico sin vegetación.",
    tasks: [
      "Conducir el rover de seis ruedas sobre la ceniza sin que patinen las llantas.",
      "Extraer un tubito de roca volcánica dura con el taladro robot.",
      "Calibrar las cámaras automáticas para distinguir relieves y sombras."
    ],
    telemetry: [
      ["Inclinación", "2°–10° · MOLA", "5.2°–9.1° · SRTM"],
      ["Temperatura", "Hasta −80 °C de noche · MEDA", "+11 °C / −1 °C · MODIS"],
      ["Presión", "6.1 hPa · no respirable", "≈580 hPa · alta montaña"]
    ]
  },
  {
    id: "siloli",
    label: "2. Cazadores de hielo / Arcadia Planitia",
    earthTitle: "Tierra: Desierto de Siloli, Bolivia",
    marsTitle: "Marte: Arcadia Planitia",
    earthCoords: [-22.15, -67.85],
    earthZoom: 11,
    marsCoords: [39.2, 8],
    marsZoom: 4,
    bridge: "SHARAD y MRO inspiran la búsqueda de hielo enterrado; Siloli entrena radar GPR, perforación térmica y despliegue solar en una planicie fría.",
    tasks: [
      "Pasar el carrito GPR a ritmo firme para detectar hielo enterrado.",
      "Perforar la costra salina congelada regulando el calor.",
      "Fijar los paneles solares para resistir las ráfagas."
    ],
    telemetry: [
      ["Inclinación", "0.5°–3° · MOLA", "1.1°–2.8° · SRTM"],
      ["Temperatura", "Hasta −95 °C de noche · MRO", "+14 °C / −12 °C · MODIS"],
      ["Agua bajo tierra", "Hielo a baja temperatura", "Costra congelada y sales"]
    ]
  },
  {
    id: "payunia",
    label: "3. Cuevas secretas / Arsia Mons",
    earthTitle: "Tierra: Campo volcánico Payunia, Argentina",
    marsTitle: "Marte: flancos de Arsia Mons",
    earthCoords: [-36.05, -69.2],
    earthZoom: 10,
    marsCoords: [-9, -121],
    marsZoom: 4,
    bridge: "HiRISE observó pozos asociados a tubos de lava; Payunia entrena descenso con arnés, LiDAR y repetidores de radio en roca basáltica.",
    tasks: [
      "Verificar arnés y freno antes de bajar por la entrada vertical.",
      "Estabilizar el LiDAR y escanear el techo de la cueva en oscuridad.",
      "Colocar antenas repetidoras sin perder el anclaje ni la señal."
    ],
    telemetry: [
      ["Pendiente", "4°–15° · MOLA", "4.5°–13° · SRTM"],
      ["Temperatura", "Hasta −90 °C · THEMIS", "Variación exterior · MODIS"],
      ["Radiación", "Contexto RAD / refugio rocoso", "Atmósfera y campo magnético protectores"]
    ]
  }
];

let story;
let currentNodeId = "p001";
let gameState;
let history = [];
let started = false;
let muted = false;
let captionsOn = true;
let sceneTimer;
let selectedMissionSite = 0;
let missionMaps = { mars: null, earth: null, marsMarker: null, earthMarker: null };

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
  renderMissionIntel();
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

function currentMissionSite() {
  return missionSites[selectedMissionSite] || missionSites[0];
}

function chapterIndexForNode(nodeId) {
  const page = Number(story?.nodes?.[nodeId]?.page || 1);
  if (page < 9) return 0;
  if (page < 15) return 1;
  return 2;
}

function renderMissionSelector() {
  const select = $("#missionSiteSelect");
  if (!select.options.length) {
    missionSites.forEach((site, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = site.label;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      selectedMissionSite = Number(select.value);
      renderMissionIntel();
      if (missionMaps.mars) {
        const site = currentMissionSite();
        missionMaps.mars.setView(site.marsCoords, site.marsZoom);
        missionMaps.earth.setView(site.earthCoords, site.earthZoom);
        missionMaps.marsMarker.setLatLng(site.marsCoords);
        missionMaps.earthMarker.setLatLng(site.earthCoords);
        window.setTimeout(() => {
          missionMaps.mars.invalidateSize();
          missionMaps.earth.invalidateSize();
        }, 80);
      }
    });
  }
  select.value = String(selectedMissionSite);
}

function ensureMissionMaps() {
  if (missionMaps.mars || !window.L) return;
  const site = currentMissionSite();
  missionMaps.mars = window.L.map("mapMars", { zoomControl: false }).setView(site.marsCoords, site.marsZoom);
  window.L.control.zoom({ position: "bottomright" }).addTo(missionMaps.mars);
  window.L.tileLayer("https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png", {
    attribution: "NASA MOLA / Viking / OpenPlanetaryMap",
    maxZoom: 8
  }).addTo(missionMaps.mars);
  missionMaps.marsMarker = window.L.circleMarker(site.marsCoords, {
    radius: 10, color: "#f1c56a", weight: 2, fillColor: "#e15a46", fillOpacity: .78
  }).addTo(missionMaps.mars);

  missionMaps.earth = window.L.map("mapEarth", { zoomControl: false }).setView(site.earthCoords, site.earthZoom);
  window.L.control.zoom({ position: "bottomright" }).addTo(missionMaps.earth);
  window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Esri / Maxar / NASA SRTM",
    maxZoom: 16
  }).addTo(missionMaps.earth);
  missionMaps.earthMarker = window.L.circleMarker(site.earthCoords, {
    radius: 10, color: "#91d4d2", weight: 2, fillColor: "#36b6a3", fillOpacity: .78
  }).addTo(missionMaps.earth);
  window.setTimeout(() => {
    missionMaps.mars.invalidateSize();
    missionMaps.earth.invalidateSize();
  }, 120);
}

function renderMissionIntel() {
  if (!story) return;
  const site = currentMissionSite();
  renderMissionSelector();
  $("#intelMarsTitle").textContent = site.marsTitle;
  $("#intelEarthTitle").textContent = site.earthTitle;
  $("#mapAttribution").textContent = `${site.bridge} Las capas cartográficas son referencias educativas, no telemetría en vivo.`;

  const currentNode = story.nodes[currentNodeId];
  const currentChapter = chapterIndexForNode(currentNodeId);
  $("#storyBridge").innerHTML = "";
  const bridgeTitle = document.createElement("strong");
  bridgeTitle.textContent = `Página ${String(currentNode.page || 1).padStart(2, "0")}: ${currentNode.title}`;
  const bridgeCopy = document.createElement("small");
  bridgeCopy.textContent = currentNode.narrationDraft || site.bridge;
  $("#storyBridge").append(bridgeTitle, bridgeCopy);
  $("#chapterTrack").innerHTML = "";
  missionSites.forEach((chapter, index) => {
    const node = document.createElement("article");
    node.className = `chapter-node${index === currentChapter ? " active" : ""}`;
    node.innerHTML = `<span>ESCENARIO 0${index + 1}</span><strong></strong><small></small>`;
    node.querySelector("strong").textContent = chapter.label;
    node.querySelector("small").textContent = chapter.bridge;
    $("#chapterTrack").appendChild(node);
  });

  $("#missionBrief").innerHTML = `<h3>${site.label}</h3><p>${site.bridge}</p>`;
  $("#missionChecklist").innerHTML = "";
  site.tasks.forEach((task, index) => {
    const label = document.createElement("label");
    label.className = "mission-check";
    label.innerHTML = `<input type="checkbox" /><span>Prueba ${index + 1}: ${task}</span>`;
    $("#missionChecklist").appendChild(label);
  });
  $("#missionTelemetry").innerHTML = `<table class="telemetry-table"><thead><tr><th>Variable</th><th>Marte</th><th>Análogo</th></tr></thead><tbody>${site.telemetry.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}</tbody></table>`;
}

function setIntelTab(tabId) {
  document.querySelectorAll("[data-intel-tab]").forEach((tab) => {
    const active = tab.dataset.intelTab === tabId;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-intel-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.intelPanel !== tabId;
    panel.classList.toggle("active", panel.dataset.intelPanel === tabId);
  });
  if (tabId === "map") {
    ensureMissionMaps();
    window.setTimeout(() => {
      missionMaps.mars?.invalidateSize();
      missionMaps.earth?.invalidateSize();
    }, 100);
  }
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
  if (id === "missionIntelDrawer") {
    renderMissionIntel();
    ensureMissionMaps();
    setIntelTab("map");
  }
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
  $("#missionMapButton").addEventListener("click", () => openDrawer("missionIntelDrawer"));
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
  document.querySelectorAll("[data-intel-tab]").forEach((button) => button.addEventListener("click", () => setIntelTab(button.dataset.intelTab)));
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
    renderMissionIntel();
  } catch (error) {
    console.error(error);
    $("#placeholderTitle").textContent = "No se pudo cargar la historia";
    $("#controlNote").textContent = "Sirve el sitio desde un servidor estático para habilitar story.json.";
  }
}

boot();
