/* RED HOPE · Intro en cómic narrado (v2)
   Se abre al pulsar "Continuar historia" (#open-map) y, al terminar o al saltarla,
   pulsa #intro-to-map para abrir el mapa de entrenamiento. No modifica app.js.
   Narración: usa media/audio/v2/<idioma>/intro-XX.mp3 si existe en PANELS[].audio;
   si no, la voz del navegador (Web Speech API). Sin voz: avance por tiempo de lectura. */
(() => {
  const IMG = './media/images/v2/intro/';
  // focus = punto que la cámara mantiene en cuadro; move = dirección del movimiento lento
  const PANELS = [
    { img: 'intro-01.webp', focus: '62% 45%', move: 'in',
      es: [['n', 'Cambridge, Massachusetts. Las quince horas. Vuelves del colegio y empujas la puerta del cuarto de James.'], ['n', 'Su maqueta sigue a medio armar. La cama, intacta. James no volvió en todo el día… ni en toda la noche.']],
      en: [['n', 'Cambridge, Massachusetts. Three in the afternoon. You get home from school and push open James’s door.'], ['n', 'His model is still half-built. The bed hasn’t been touched. James didn’t come home all day… or all night.']] },
    { img: 'intro-02.webp', focus: '55% 45%', move: 'left',
      es: [['n', 'Pasan los días. La casa se llena de silencio.'], ['mom', 'Ya pasaron varios días… y nadie sabe dónde está.']],
      en: [['n', 'Days go by. The house fills with silence.'], ['mom', 'It’s been days… and nobody knows where he is.']] },
    { img: 'intro-03.webp', focus: '50% 35%', move: 'in',
      es: [['anchor', 'Una investigación global vincula a New Era con la desaparición de ingenieros en todo el mundo.'], ['anchor', 'La organización habría recibido dinero de traficantes de armas para levantar instalaciones militares en Marte.']],
      en: [['anchor', 'A global investigation links New Era to the disappearance of engineers around the world.'], ['anchor', 'The organization allegedly received money from arms traffickers to build military facilities on Mars.']] },
    { img: 'intro-04.webp', focus: '50% 30%', move: 'out',
      es: [['n', 'Sobre su escritorio quedan los planos de James: módulos para colonizar Marte. Un frío te recorre el cuerpo.'], ['you', 'No puede ser… Se lo llevaron para obligarlo a construir esos módulos.']],
      en: [['n', 'James’s blueprints are still on his desk: modules for colonizing Mars. A chill runs through you.'], ['you', 'It can’t be… They took him to force him to build those modules.']] },
    { img: 'intro-05.webp', focus: '70% 50%', move: 'right',
      es: [['n', 'Camino al colegio, esperas a que cambie el semáforo. Alguien con capucha se acerca, ocultando su rostro.'], ['brad', 'No mires directo. Sigue caminando conmigo.']],
      en: [['n', 'On your way to school, you wait for the light to change. Someone in a hood comes closer, hiding his face.'], ['brad', 'Don’t look straight at me. Keep walking with me.']] },
    { img: 'intro-06.webp', focus: '65% 45%', move: 'in',
      es: [['you', '¿Brad?'], ['brad', 'A James lo secuestraron hace cinco días agentes de New Era. Yo escapé antes del lanzamiento y copié tres destinos en esta tarjeta.'], ['brad', 'Me están buscando. No vamos a poder volver a vernos. Cuídate.']],
      en: [['you', 'Brad?'], ['brad', 'New Era agents kidnapped James five days ago. I escaped before the launch and copied three destinations onto this card.'], ['brad', 'They’re looking for me. We won’t be able to see each other again. Take care.']],
      choice: [
        { mark: 'CÓDIGO', es: ['Pedir a Brad el código que usaban cuando trabajaban juntos.', ['brad', '«Marea baja». James la reconocerá aunque la radio falle y solo puedas enviar texto.']], en: ['Ask Brad for the code they used when they worked together.', ['brad', '“Low tide.” James will recognize it even if the radio fails and you can only send text.']] },
        { mark: 'PRENSA', es: ['Llamar a tu madre y enviarle una copia de la tarjeta.', ['n', 'Tu madre consigue que una periodista verifique los archivos. Publicará las pruebas desde la Tierra si se las envías.']], en: ['Call your mother and send her a copy of the card.', ['n', 'Your mother gets a journalist to verify the files. She will publish the evidence from Earth if you send it.']] },
        { mark: 'SÍMBOLO', es: ['Acompañar a Brad hasta la caseta de seguridad del colegio.', ['n', 'Brad informa del secuestro sin exponerse. Antes de irse, te dibuja el símbolo de mantenimiento del carguero.']], en: ['Walk Brad to the school security booth.', ['n', 'Brad reports the kidnapping without exposing himself. Before leaving, he draws the cargo ship’s maintenance symbol for you.']] }
      ] },
    { img: 'intro-07.webp', focus: '45% 40%', move: 'out',
      es: [['n', 'Ese mismo día, la NASA reúne a todos los estudiantes de último año en el auditorio.'], ['rec', 'Comenzó una carrera espacial. Buscamos postulantes que cumplan dieciocho años al terminar el colegio.']],
      en: [['n', 'That same day, NASA gathers every senior student in the auditorium.'], ['rec', 'A space race has begun. We’re looking for applicants who turn eighteen when they finish school.']] },
    { img: 'intro-08.webp', focus: '60% 50%', move: 'left',
      es: [['rec', 'Cada zona de aterrizaje en Marte tiene su campo de pruebas aquí, en la Tierra.'], ['rec', 'Un desierto salino en Bolivia, la ceniza del Chimborazo en Ecuador y los tubos de lava de Argentina. Nadie aprueba con una sola prueba.']],
      en: [['rec', 'Every landing zone on Mars has its own training field here on Earth.'], ['rec', 'A salt desert in Bolivia, the ash of Chimborazo in Ecuador and the lava tubes of Argentina. No one passes with a single test.']] },
    { img: 'intro-09.webp', focus: '55% 60%', move: 'in',
      es: [['n', 'Sin decirles nada a tus padres, llenas la postulación.'], ['you', 'Si paso estas pruebas en la Tierra, podré llegar a Marte… y encontrar a James.']],
      en: [['n', 'Without telling your parents, you fill out the application.'], ['you', 'If I pass these tests on Earth, I can make it to Mars… and find James.']] },
    { img: 'intro-10.webp', focus: '40% 35%', move: 'out', last: true,
      es: [['n', 'Tu entrenamiento empieza ahora. Tres terrenos. Una sola misión. Elige dónde comenzar.']],
      en: [['n', 'Your training starts now. Three terrains. One mission. Choose where to begin.']] }
  ].map((p, i) => ({ ...p, audio: { es: null, en: null }, n: i + 1 }));
  // Para usar audio de ElevenLabs: PANELS[0].audio.es = './media/audio/v2/es/intro-01.mp3', etc.

  const UI = {
    es: { kicker: 'PRÓLOGO', skip: 'Saltar intro', prev: 'Anterior', next: 'Siguiente', pause: 'Pausar', play: 'Reanudar', voiceOn: 'Voz activada', voiceOff: 'Voz desactivada', open: 'Abrir mapa de misión', choose: '¿Qué haces?', noted: 'Anotado en tu bitácora', place: ['CAMBRIDGE · 15:00', 'CASA · DÍAS DESPUÉS', 'NOTICIERO', 'CUARTO DE JAMES', 'SEMÁFORO', 'SEMÁFORO', 'AUDITORIO', 'AUDITORIO', 'AUDITORIO', 'AUDITORIO'],
      who: { n: '', you: 'Tú', mom: 'Mamá', anchor: 'Presentador', brad: 'Brad', rec: 'Reclutador NASA' } },
    en: { kicker: 'PROLOGUE', skip: 'Skip intro', prev: 'Previous', next: 'Next', pause: 'Pause', play: 'Resume', voiceOn: 'Voice on', voiceOff: 'Voice off', open: 'Open mission map', choose: 'What do you do?', noted: 'Logged in your notebook', place: ['CAMBRIDGE · 3 PM', 'HOME · DAYS LATER', 'NEWS', 'JAMES’S ROOM', 'CROSSWALK', 'CROSSWALK', 'AUDITORIUM', 'AUDITORIUM', 'AUDITORIUM', 'AUDITORIUM'],
      who: { n: '', you: 'You', mom: 'Mom', anchor: 'News anchor', brad: 'Brad', rec: 'NASA recruiter' } }
  };
  // Tono de voz por personaje (pitch / velocidad)
  const VOICE = { n: [1, .96], you: [1.12, 1], mom: [1.25, .92], anchor: [.85, 1], brad: [.78, 1.05], rec: [.92, .98] };

  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let lang = 'es', idx = 0, playing = true, voiceOn = true, token = 0, timer = null, audioEl = null, root = null, layer = 0;

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  try { voiceOn = localStorage.getItem('redHope.introVoice') !== 'off'; } catch (e) { /* sin almacenamiento */ }

  function pickVoice() {
    if (!synth) return null;
    const vs = synth.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith(lang));
    const pref = lang === 'es' ? ['es-us', 'es-mx', 'es-419', 'es-es'] : ['en-us', 'en-gb'];
    const score = (v) => (/(natural|neural|google|premium|enhanced)/i.test(v.name) ? 10 : 0) + (5 - Math.max(0, pref.indexOf(v.lang.toLowerCase()) === -1 ? 5 : pref.indexOf(v.lang.toLowerCase())));
    return vs.sort((a, b) => score(b) - score(a))[0] || null;
  }

  function build() {
    root = el('div', 'rh-intro', null);
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Prólogo');
    root.innerHTML = `
      <div class="rh-intro-top">
        <div class="rh-intro-kicker"><span class="rh-intro-dot"></span><span id="rh-kicker"></span></div>
        <button type="button" class="rh-intro-skip" id="rh-skip"></button>
      </div>
      <div class="rh-intro-stage">
        <div class="rh-intro-frame">
          <div class="rh-intro-img"><img alt="" decoding="async"></div>
          <div class="rh-intro-img"><img alt="" decoding="async"></div>
          <div class="rh-intro-shade"></div>
          <div class="rh-intro-place" id="rh-place"></div>
          <div class="rh-intro-lines" id="rh-lines" aria-live="polite"></div>
          <button type="button" class="rh-intro-hit rh-left" aria-label="prev" id="rh-hit-prev"></button>
          <button type="button" class="rh-intro-hit rh-right" aria-label="next" id="rh-hit-next"></button>
        </div>
      </div>
      <div class="rh-intro-bar">
        <button type="button" class="rh-intro-btn" id="rh-prev">←</button>
        <button type="button" class="rh-intro-btn" id="rh-play">❚❚</button>
        <div class="rh-intro-dots" id="rh-dots"></div>
        <button type="button" class="rh-intro-btn" id="rh-voice">🔊</button>
        <button type="button" class="rh-intro-btn rh-next" id="rh-next">→</button>
      </div>
      `;
    document.body.appendChild(root);
    const dots = root.querySelector('#rh-dots');
    PANELS.forEach((p, i) => { const d = el('button', 'rh-dot'); d.type = 'button'; d.setAttribute('aria-label', String(i + 1)); d.onclick = () => go(i, true); dots.appendChild(d); });
    root.querySelector('#rh-skip').onclick = finish;
    root.querySelector('#rh-prev').onclick = root.querySelector('#rh-hit-prev').onclick = () => go(idx - 1, true);
    root.querySelector('#rh-next').onclick = root.querySelector('#rh-hit-next').onclick = () => (PANELS[idx].last ? finish() : go(idx + 1, true));
    root.querySelector('#rh-play').onclick = togglePlay;
    root.querySelector('#rh-voice').onclick = toggleVoice;
    document.addEventListener('keydown', (e) => {
      if (!root.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); PANELS[idx].last ? finish() : go(idx + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1, true); }
      else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') finish();
    });
  }

  function labels() {
    const u = UI[lang];
    root.querySelector('#rh-skip').textContent = `${u.skip} ⏭`;
    root.querySelector('#rh-prev').title = u.prev; root.querySelector('#rh-next').title = u.next;
    root.querySelector('#rh-play').title = playing ? u.pause : u.play;
    root.querySelector('#rh-play').textContent = playing ? '❚❚' : '▶';
    root.querySelector('#rh-voice').title = voiceOn ? u.voiceOn : u.voiceOff;
    root.querySelector('#rh-voice').textContent = voiceOn ? '🔊' : '🔇';
  }

  function stopAudio() {
    token++; clearTimeout(timer);
    if (synth) synth.cancel();
    if (audioEl) { audioEl.pause(); audioEl = null; }
  }

  function go(i, manual) {
    if (i < 0 || i >= PANELS.length) return;
    stopAudio();
    if (manual && !playing) { playing = true; labels(); }
    idx = i; const p = PANELS[i], u = UI[lang]; if (p.choice) p.chosen = null;
    // imagen con fundido cruzado + movimiento de cámara
    layer = 1 - layer;
    const boxes = root.querySelectorAll('.rh-intro-img');
    const cur = boxes[layer], old = boxes[1 - layer], img = cur.querySelector('img');
    img.src = IMG + p.img; img.style.objectPosition = p.focus; img.alt = u.place[i];
    cur.className = `rh-intro-img is-on rh-move-${p.move}`; cur.style.setProperty('--fx', p.focus);
    void cur.offsetWidth; cur.classList.add('is-anim');
    old.classList.remove('is-on');
    root.querySelector('#rh-kicker').textContent = `${u.kicker} · ${String(i + 1).padStart(2, '0')} / ${PANELS.length}`;
    root.querySelector('#rh-place').textContent = u.place[i];
    root.querySelectorAll('.rh-dot').forEach((d, k) => { d.classList.toggle('is-on', k === i); d.classList.toggle('is-done', k < i); });
    const box = root.querySelector('#rh-lines'); box.innerHTML = '';
    p[lang].forEach(([who, text]) => {
      const name = u.who[who];
      const line = el('div', `rh-line ${who === 'n' ? 'rh-narr' : 'rh-say'} rh-${who}`, `${name ? `<b>${esc(name)}</b>` : ''}<span>${esc(text)}</span>`);
      box.appendChild(line);
    });
    if (p.last) { const f = el('div', 'rh-intro-final'); const b = el('button', 'primary-button rh-open', `${esc(u.open)} <span>→</span>`); b.type = 'button'; b.onclick = finish; f.appendChild(b); box.appendChild(f); }
    if (PANELS[i + 1]) { const pre = new Image(); pre.src = IMG + PANELS[i + 1].img; }
    narrate(i);
  }

  function showChoice() {
    const p = PANELS[idx], u = UI[lang], box = root.querySelector('#rh-lines');
    if (box.querySelector('.rh-choice')) return;
    const wrap = el('div', 'rh-choice', `<b>${esc(u.choose)}</b>`);
    p.choice.forEach((c, k) => {
      const b = el('button', 'rh-opt', `<span>${k + 1}</span>${esc(c[lang][0])}`); b.type = 'button';
      b.onclick = () => pickClue(c);
      wrap.appendChild(b);
    });
    box.appendChild(wrap);
  }

  function pickClue(c) {
    stopAudio();
    try { localStorage.setItem('redHope.firstClue', c.mark); } catch (e) { /* sin almacenamiento */ }
    const p = PANELS[idx], u = UI[lang], box = root.querySelector('#rh-lines');
    p.chosen = c.mark;
    box.innerHTML = '';
    const [who, text] = c[lang][1]; const name = u.who[who];
    box.appendChild(el('div', `rh-line ${who === 'n' ? 'rh-narr' : 'rh-say'} rh-${who}`, `${name ? `<b>${esc(name)}</b>` : ''}<span>${esc(text)}</span>`));
    box.appendChild(el('div', 'rh-line rh-mark', `📓 ${esc(u.noted)}: <strong>${esc(c.mark)}</strong>`));
    playing = true; labels();
    speakLines(++token, [[who, text]], 0);
  }

  function reveal(k) {
    const ls = root.querySelectorAll('.rh-line');
    if (PANELS[idx].chosen) { ls.forEach((l, j) => { l.classList.add('is-in'); l.classList.toggle('is-now', j === 0 && k < 1); }); return; }
    ls.forEach((l, j) => { l.classList.toggle('is-in', j <= k); l.classList.toggle('is-now', j === k); });
  }

  function afterPanel(my) {
    if (my !== token) return;
    if (PANELS[idx].choice && !PANELS[idx].chosen) { reveal(PANELS[idx][lang].length); return showChoice(); }
    reveal(PANELS[idx][lang].length);
    if (!playing || PANELS[idx].last) return;
    timer = setTimeout(() => { if (my === token && playing) go(idx + 1); }, 1100);
  }

  function narrate(i) {
    const my = ++token, lines = PANELS[i][lang], file = PANELS[i].audio[lang];
    if (voiceOn && file) {
      reveal(lines.length);
      audioEl = new Audio(file); audioEl.onended = () => afterPanel(my);
      audioEl.onerror = () => speakLines(my, lines, 0);
      audioEl.play().catch(() => speakLines(my, lines, 0));
      return;
    }
    speakLines(my, lines, 0);
  }

  function speakLines(my, lines, k) {
    if (my !== token) return;
    if (k >= lines.length) return afterPanel(my);
    reveal(k);
    const [who, text] = lines[k];
    const readTime = Math.max(2200, text.split(/\s+/).length * 330);
    const nextLine = () => { if (my === token) timer = setTimeout(() => speakLines(my, lines, k + 1), 350); };
    if (!voiceOn || !synth) { timer = setTimeout(() => { if (my === token && playing) speakLines(my, lines, k + 1); else if (my === token) reveal(lines.length); }, readTime); return; }
    const ut = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if (v) ut.voice = v;
    ut.lang = v ? v.lang : (lang === 'es' ? 'es-419' : 'en-US');
    [ut.pitch, ut.rate] = VOICE[who] || VOICE.n;
    const t0 = Date.now();
    let done = false; const end = (ev) => {
      if (done) return; done = true; clearTimeout(guard);
      const el = Date.now() - t0;
      // si la voz falla o no hay voces instaladas, termina al instante: se respeta el tiempo de lectura
      if ((ev && ev.type === 'error') || el < readTime * 0.35) { if (my === token) timer = setTimeout(() => speakLines(my, lines, k + 1), Math.max(350, readTime - el)); }
      else nextLine();
    };
    ut.onend = end; ut.onerror = end;
    // seguro por si el navegador no dispara onend
    const guard = setTimeout(() => end({ type: 'end' }), readTime + 6000);
    synth.speak(ut);
  }

  function togglePlay() {
    playing = !playing; labels();
    if (playing) {
      if (synth && synth.paused) synth.resume();
      else if (audioEl && audioEl.paused) audioEl.play().catch(() => {});
      else narrate(idx);
    } else {
      if (synth && synth.speaking) synth.pause();
      if (audioEl) audioEl.pause();
      clearTimeout(timer);
    }
  }

  function toggleVoice() {
    voiceOn = !voiceOn;
    try { localStorage.setItem('redHope.introVoice', voiceOn ? 'on' : 'off'); } catch (e) { /* sin almacenamiento */ }
    labels(); go(idx);
  }

  function open() {
    try { lang = (localStorage.getItem('redHope.audioLanguage') || document.documentElement.lang || 'es').slice(0, 2); } catch (e) { lang = 'es'; }
    if (!UI[lang]) lang = 'es';
    if (!root) build();
    playing = true; labels();
    root.classList.add('is-open'); document.documentElement.classList.add('rh-intro-lock');
    go(0);
  }

  function finish() {
    stopAudio();
    if (!root) return;
    root.classList.remove('is-open'); document.documentElement.classList.remove('rh-intro-lock');
    const toMap = document.getElementById('intro-to-map');
    if (toMap) toMap.click(); else document.dispatchEvent(new CustomEvent('redhope:intro-finished'));
  }

  window.RedHopeIntro = { open, finish };
  const hook = () => { const b = document.getElementById('open-map'); if (b) b.addEventListener('click', open); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook); else hook();
})();
