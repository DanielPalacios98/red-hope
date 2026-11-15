/* RED HOPE · Reglas exactas del libreto v2 (marcas, condiciones y finales).
   app.js consulta window.RH al elegir una opción, al continuar y al terminar. */
(() => {
  const any = (m, ...k) => k.some((x) => m.includes(x));
  // Al entrar en cada escena: marcas que se ganan o pierden según lo que ya llevas.
  const OUT = {
    i1_a: () => ({ add: ['CÓDIGO'] }), i1_b: () => ({ add: ['PRENSA'] }), i1_c: () => ({ add: ['SÍMBOLO'] }),
    // Jezero
    j1_a: () => ({ add: ['BATERÍA'] }), j1_b: () => ({ add: ['CRESTA'] }),
    jr_a: () => ({ add: ['TORNO'] }), jr_b: () => ({ add: ['BATERÍA'] }), jr_c: () => ({ add: ['CRESTA'] }),
    j2_a: () => ({ add: ['PULSOS'] }), j2_b: () => ({ add: ['FISURA'] }),
    j2_c: (m) => ({ add: ['VIBRACIÓN'], rm: m.includes('BATERÍA') ? ['BATERÍA'] : [] }),
    j3_a: () => ({ add: ['COORDENADAS'] }), j3_b: () => ({ add: ['IMAGEN'] }), j3_c: () => ({ add: ['INTERVALO'] }),
    j4_a: () => ({ add: ['PRUEBAS'] }),
    j4_b: (m) => ({ add: any(m, 'TORNO', 'PULSOS') ? ['PRUEBAS'] : [] }),
    j4_c: (m) => ({ add: [...(any(m, 'INTERVALO', 'CÓDIGO') ? ['PRUEBAS'] : []), ...(m.includes('IMAGEN') ? ['RASTRO'] : [])] }),
    // Arcadia
    a1_a: () => ({ add: ['MAPA'] }), a1_b: () => ({ add: ['FILTRO'] }),
    ar_a: () => ({ add: ['MAPA'] }), ar_b: () => ({ add: ['FILTRO'] }), ar_c: () => ({ add: ['COSTRA'] }),
    a2_a: () => ({ add: ['SONDA'] }), a2_b: () => ({ add: ['RESERVA'] }), a2_c: () => ({ add: ['SELLO'] }),
    a3_a: () => ({ add: ['ANCLAJES'] }), a3_b: () => ({ add: ['EMISOR'] }), a3_c: () => ({ add: ['ENERGÍA'] }),
    a4_a: (m) => ({ add: any(m, 'ENERGÍA', 'ANCLAJES') ? ['PRUEBAS'] : [] }),
    a4_b: (m) => ({ add: any(m, 'SELLO', 'SONDA') ? ['PRUEBAS'] : ['RASTRO'] }),
    a4_c: (m) => ({ add: any(m, 'EMISOR', 'FILTRO') ? ['PRUEBAS'] : ['RASTRO'] }),
    // Arsia Mons
    p1_a: () => ({ add: ['IZADO'] }), p1_b: () => ({ add: ['RELLANO'] }),
    pr_a: () => ({ add: ['IZADO'] }), pr_b: () => ({ add: ['RELLANO'] }), pr_c: () => ({ add: ['ANCLAJE'] }),
    p2_a: () => ({ add: ['MAPA 3D'] }), p2_b: () => ({ add: ['TECHO'] }), p2_c: () => ({ add: ['GALERÍA'] }),
    p3_a: () => ({ add: ['CABLE'] }), p3_b: () => ({ add: ['RED'] }), p3_c: () => ({ add: ['GRABACIÓN'] }),
    p4_a: (m) => ({ add: any(m, 'GALERÍA', 'MAPA 3D') ? ['PRUEBAS'] : [] }),
    p4_b: (m) => ({ add: any(m, 'TECHO', 'IZADO') ? ['PRUEBAS'] : [] }),
    p4_c: (m) => ({ add: [...(any(m, 'CABLE', 'RED') ? ['PRUEBAS'] : []), ...(any(m, 'GRABACIÓN', 'SÍMBOLO') ? ['RASTRO'] : [])] })
  };
  // Escenas cuyo destino depende de las marcas
  const NEXT = {
    f1_a: (m) => (m.includes('PRUEBAS') && m.includes('PRENSA') ? 'final_a' : m.includes('PRUEBAS') ? 'final_e' : 'final_f'),
    f1_b: (m) => (m.includes('PRUEBAS') ? 'final_b' : 'final_c'),
    f1_c: (m) => (m.includes('PRUEBAS') ? 'final_d' : m.includes('RASTRO') ? 'final_g' : 'final_h')
  };
  const CLUE = { 'CÓDIGO': 'IB', 'PRENSA': 'IM', 'SÍMBOLO': 'IE' };
  const EPI = {
    es: { IB: 'La grabación que conservaste de Brad queda adjunta al informe de la misión.', IM: 'Tu madre y la periodista reciben aviso cuando James sube a la nave.', IE: 'El enlace de la agencia agrega al informe el dibujo que Brad hizo en la caseta.' },
    en: { IB: 'The recording you kept from Brad is attached to the mission report.', IM: 'Your mother and the journalist are notified when James boards the ship.', IE: 'The agency liaison adds Brad’s drawing from the security booth to the report.' }
  };
  const firstClue = () => { try { return localStorage.getItem('redHope.firstClue') || null; } catch (e) { return null; } };

  window.RH = {
    // Escenas con video que no corresponden a su escena: se muestran con su ilustración
    noVideo: new Set([]), // cuando existan j1_a.svg, j1_b.svg y jr.svg, pon aquí: 'j1_a', 'j1_b', 'jr'
    outcome(target, marks) {
      const f = OUT[target]; const m = [...marks];
      if (!f) return { marks: m, added: [], removed: [] };
      const r = f(m); const removed = (r.rm || []).filter((x) => m.includes(x));
      let next = m.filter((x) => !removed.includes(x));
      const added = (r.add || []).filter((x) => !next.includes(x));
      next = [...next, ...added];
      return { marks: next, added, removed };
    },
    next(nodeId, marks) { return NEXT[nodeId] ? NEXT[nodeId](marks) : null; },
    // Conserva la marca narrativa para las reglas de finales y su clave de
    // epílogo para que la elección de Brad no se pierda al iniciar una ruta.
    startMarks() { const c = firstClue(); return c && CLUE[c] ? [c, CLUE[c]] : []; },
    epilogue(lang) { const c = firstClue(); const k = c && CLUE[c]; return k ? (EPI[lang] || EPI.es)[k] : ''; },
    rules: { OUT, NEXT }
  };
})();
