// SIRIUS · Estado de coordinación de cada riesgo y del caso (v1.1 · etapa G-2c10 · DEC-239, que amplía DEC-238 · 18/10/2026)
// Una sola regla para la sesión, la bandeja, la pestaña Coordinación y la base simulada.
//
// Un riesgo está «coordinado» si tiene una visita abierta con cita (Agendada o En camino), está en curso, o está en una visita de Autoinspección con el enlace
// enviado y vigente. No cuentan como coordinados un riesgo sin visita, en una visita «Por agendar», en una oferta («Oferta enviada») ni con un enlace de
// autoagendamiento sin respuesta.
// Estado de coordinación de un riesgo: «Por coordinar» · «Oferta enviada» · «Enlace enviado» · «Agendado» · «En curso» (y lo que siga en el flujo, sin cambios).
// Estado del caso en la fase de coordinación (Registrado, En coordinación, Reaperturado, Enlace caducado, Agendado): «En coordinación» mientras algún riesgo no esté
// coordinado, con el subestado «N de M agendados» (+ «Oferta enviada» / «Enlace enviado» si corresponde); «Agendado» cuando todos lo están. Con un solo riesgo: igual que antes.
//
//
// DEC-239 · Estado del caso por fases con varios riesgos: manda el riesgo más atrasado. Fases de un riesgo, en orden: 1 Coordinación (Por coordinar, Oferta enviada, Enlace enviado),
// 2 Inspección (Agendado, En curso), 3 Informe (Informe por completar, Devuelto al inspector), 4 Calificación (En calificación y siguientes). El caso toma la fase del riesgo más
// atrasado y, dentro de ella, el estado más activo: en Inspección, «En curso» si algún riesgo está en curso y, si no, «Agendado». El subestado cuenta lo demás, en este orden y solo
// lo que haya: «N de M agendados», «N en curso», «Oferta enviada», «Enlace enviado». Ejemplos: 2 en curso y 1 por coordinar → «En coordinación · 2 de 3 agendados · 2 en curso»;
// 2 en curso y 1 agendado → «En curso · 1 de 3 agendado» (en Inspección, el «En curso» ya está en el estado y no se repite). Responsable y acción principal siguen la fase del caso
// (Coordinación: el coordinador y «Coordinar visita»; Inspección: el inspector y «Ver visita»). No cuentan los riesgos cancelados, excluidos ni con «No requiere inspección».
// Con un solo riesgo no cambia nada. Las fases 3 y 4 quedan como hoy (DEC-209/212).
//
// Contrato con la conexión (casos[]): estado y subestado ya calculados por la base; riesgos[].estado (su estado de coordinación) y riesgos[].visita { n, estado, inicio, inspector } | null.
// Si un riesgo no trae visita, se calcula con visitasBase.
(function () {
  const COORD = ['Registrado', 'En coordinación', 'Reaperturado', 'Enlace caducado', 'Agendado'];
  const ETIQ = ['Por coordinar', 'Oferta enviada', 'Enlace enviado', 'Agendado', 'En curso'];
  const FIN = /cancel|termin|realiz|finaliz|complet/i;
  const num = (v) => (v && v.n != null ? Number(v.n) : parseInt(String((v && v.id) || '').replace(/\D/g, ''), 10) || 0);
  const txt = (v) => { if (v == null) return ''; if (typeof v === 'string') return v.trim(); if (typeof v === 'object' && typeof v.nombre === 'string') return v.nombre.trim(); return ''; };
  const dos = (n) => (n < 10 ? '0' : '') + n;
  const ahoraIso = () => { try { const E = window.SIRIUS_EJEMPLO, d = E && E.ahora ? E.ahora() : null; if (d instanceof Date) return d.getFullYear() + '-' + dos(d.getMonth() + 1) + '-' + dos(d.getDate()) + 'T' + dos(d.getHours()) + ':' + dos(d.getMinutes()); } catch (e) {} return '2026-10-18T20:30'; };
  // Visita de la sesión ({ id, mod, estado, fecha, hIni, inspector, riesgos, oferta, enlace (texto), vence }) o de la base ({ n, modalidad, estado, inicio, inspector, riesgos, oferta, enlace { tipo, estado, vence } }).
  function norm(v) {
    const est = String(v.estado || ''), mod = String(v.mod || v.modalidad || ''), en = v.enlace, enObj = en && typeof en === 'object' ? en : null;
    const inicio = v.inicio || (v.fecha ? v.fecha + 'T' + (v.hIni || '00:00') : '');
    const vence = (enObj && enObj.vence) || v.vence || '';
    const vigente = enObj ? /vigente|en curso/i.test(String(enObj.estado || '')) : !!en && (!vence || String(vence).slice(0, 16) >= ahoraIso());
    return { n: num(v), estado: est, abierta: !FIN.test(est) && !(v.estado === 'Realizada'), mod, inicio, inspector: txt(v.inspector), riesgos: Array.isArray(v.riesgos) ? v.riesgos : [],
      oferta: !!v.oferta || /oferta enviada|buscando inspector/i.test(est), enlaceTipo: enObj ? String(enObj.tipo || '') : (mod === 'Autoinspección' && en ? 'Autoinspección' : ''), enlaceVigente: !!en && vigente, enlaceTxt: /enlace enviado|autoinspecci[oó]n enviada/i.test(est) };
  }
  // Resultado de un riesgo según una visita abierta.
  function deVisita(w) {
    const visita = { n: w.n, estado: w.estado, inicio: w.inicio || null, inspector: w.inspector || '' };
    if (/en curso|por sincronizar/i.test(w.estado)) return { estado: 'En curso', coordinado: true, visita };
    if (/enlace caducado|sin respuesta/i.test(w.estado)) return { estado: 'Por coordinar', coordinado: false, visita };
    if (w.oferta) return { estado: 'Oferta enviada', coordinado: false, visita };
    if (w.mod === 'Autoinspección') return w.enlaceVigente || w.enlaceTxt ? { estado: 'Enlace enviado', coordinado: true, visita } : { estado: 'Por coordinar', coordinado: false, visita };
    if (/agendad|en camino|confirmad/i.test(w.estado)) return { estado: 'Agendado', coordinado: true, visita };
    if (w.enlaceVigente) return { estado: 'Enlace enviado', coordinado: false, visita }; // enlace de autoagendamiento sin respuesta
    return { estado: 'Por coordinar', coordinado: false, visita };
  }
  const RANGO = { 'En curso': 4, 'Agendado': 3, 'Enlace enviado': 2, 'Oferta enviada': 1, 'Por coordinar': 0 };
  // Estado de coordinación de un riesgo r con las visitas dadas. Si r ya trae estado de coordinación y visita { n, estado, inicio, inspector } (la base), se usa tal cual.
  function riesgo(r, visitas) {
    const e = String((r && r.estado) || '');
    const bv = r && r.visita && typeof r.visita === 'object' ? r.visita : null;
    if (bv && ETIQ.indexOf(e) >= 0) { const w = (visitas || []).map(norm).find((x) => x.n === Number(bv.n)); const coord = e === 'Agendado' || e === 'En curso' || (e === 'Enlace enviado' && !!w && w.mod === 'Autoinspección'); return { estado: e, coordinado: coord, visita: { n: Number(bv.n), estado: bv.estado || '', inicio: bv.inicio || null, inspector: txt(bv.inspector) } }; }
    if (e && COORD.indexOf(e) < 0 && ETIQ.indexOf(e) < 0) { // ya salió de la coordinación (Pendiente calificación, Inspeccionado…): se conserva
      const w0 = (visitas || []).map(norm).filter((x) => (x.riesgos || []).indexOf(r.id) >= 0).pop(); return { estado: e, coordinado: true, visita: w0 ? { n: w0.n, estado: w0.estado, inicio: w0.inicio || null, inspector: w0.inspector } : null }; }
    let mejor = null;
    (visitas || []).map(norm).filter((w) => w.abierta && w.riesgos.indexOf(r.id) >= 0).forEach((w) => { const x = deVisita(w); if (!mejor || RANGO[x.estado] > RANGO[mejor.estado]) mejor = x; });
    if (mejor) return mejor;
    if (e === 'Agendado' || e === 'En curso') return { estado: e, coordinado: true, visita: null }; // dato sin visita (casos de ejemplo)
    return { estado: 'Por coordinar', coordinado: false, visita: null };
  }
  // Estados de todos los riesgos de un caso: { [id]: { estado, coordinado, visita } }.
  function riesgos(caso, visitas) { const o = {}; ((caso && caso.riesgos) || []).forEach((r) => { o[r.id] = riesgo(r, visitas); }); return o; }
  // DEC-239: fase de un riesgo según su estado (1 Coordinación, 2 Inspección, 3 Informe, 4 Calificación y siguientes). Un enlace de autoinspección enviado y vigente cuenta como coordinado (fase 2).
  const FASE = { 'Por coordinar': 1, 'Oferta enviada': 1, 'Enlace enviado': 1, 'En coordinación': 1, 'Registrado': 1, 'Reaperturado': 1, 'Enlace caducado': 1, 'Agendado': 2, 'En curso': 2, 'Informe por completar': 3, 'Devuelto al inspector': 3 };
  function fase(x) { const e = String((x && x.estado) || ''); if (e === 'Enlace enviado' && x.coordinado) return 2; return FASE[e] || 4; }
  // No cuentan: riesgos cancelados, excluidos o con «No requiere inspección».
  function cuenta(x) { if (!x) return false; if (x.excluido || x.cancelado || x.noRequiere) return false; const e = String(x.estado || ''); return !/cancel|excluid|no requiere/i.test(e); }
  // Estado y subestado del caso a partir de los resultados de sus riesgos. estadoActual: el estado que tiene hoy. Solo se recalcula mientras el caso está en Coordinación o en Inspección
  // (Registrado, En coordinación, Reaperturado, Enlace caducado, Agendado, En curso); con menos de 2 riesgos que cuenten, o con el riesgo más atrasado en Informe o Calificación, queda como hoy.
  function casoDe(estadoActual, resultados) {
    const L0 = Array.isArray(resultados) ? resultados : Object.keys(resultados || {}).map((k) => resultados[k]), L = L0.filter(cuenta), m = L.length, n = L.filter((x) => x.coordinado).length;
    const base = { estado: estadoActual, subestado: '', n: n, m: m, completo: m > 0 && n === m, enCurso: 0, fase: null };
    if ((COORD.indexOf(estadoActual) < 0 && estadoActual !== 'En curso') || m < 2) return base;
    const f = Math.min.apply(null, L.map(fase)), cur = L.filter((x) => x.estado === 'En curso').length, of = L.some((x) => x.estado === 'Oferta enviada'), en = L.some((x) => x.estado === 'Enlace enviado' && !x.coordinado);
    if (f === 1) { // Coordinación: el coordinador sigue con trabajo pendiente
      const estado = ['Registrado', 'Reaperturado', 'Enlace caducado', 'En coordinación'].indexOf(estadoActual) >= 0 ? estadoActual : 'En coordinación';
      const sub = n > 0 || of || en ? (n + ' de ' + m + ' agendados') + (cur ? ' · ' + cur + ' en curso' : '') + (of ? ' · Oferta enviada' : '') + (en ? ' · Enlace enviado' : '') : '';
      return Object.assign(base, { estado: estado, subestado: sub, enCurso: cur, fase: 1 });
    }
    if (f === 2) { // Inspección: «En curso» si algún riesgo está en curso; si no, «Agendado»
      const ag = L.filter((x) => fase(x) === 2 && x.estado !== 'En curso').length, estado = cur ? 'En curso' : 'Agendado';
      return Object.assign(base, { estado: estado, subestado: cur && ag ? ag + ' de ' + m + (ag === 1 ? ' agendado' : ' agendados') : '', enCurso: cur, fase: 2 });
    }
    return Object.assign(base, { fase: f });
  }
  // «Agendado · V1 · 17/10 10:00 · Mauricio Endara», «Oferta enviada · V2», «Enlace enviado · V3», «Por coordinar».
  function texto(k) {
    if (!k) return '';
    const v = k.visita, f = v && v.inicio ? String(v.inicio).slice(8, 10) + '/' + String(v.inicio).slice(5, 7) + ' ' + String(v.inicio).slice(11, 16) : '';
    if (k.estado === 'Por coordinar') return 'Por coordinar';
    return k.estado + (v && v.n ? ' · V' + v.n : '') + (k.estado === 'Agendado' || k.estado === 'En curso' ? (f ? ' · ' + f : '') + (v && v.inspector ? ' · ' + v.inspector : '') : '');
  }
  // Calcula y deja en el caso (objeto de la base) estado, subestado, responsable e, en cada riesgo, estado de coordinación y visita. Lo usa la base simulada.
  function aplicarBase(c, coordinador) {
    if (!c || !Array.isArray(c.riesgos) || !Array.isArray(c.visitasBase)) return c;
    const R = riesgos(c, c.visitasBase);
    c.riesgos.forEach((r) => { const x = R[r.id]; if (x && (COORD.indexOf(String(r.estado || '')) >= 0 || ETIQ.indexOf(String(r.estado || '')) >= 0)) { r.estado = x.estado; r.visita = x.visita ? { n: x.visita.n, estado: x.visita.estado, inicio: x.visita.inicio, inspector: x.visita.inspector } : null; } });
    const k = casoDe(c.estado, R); c.estado = k.estado; c.subestado = k.subestado;
    if (COORD.indexOf(c.estado) >= 0 || c.estado === 'En curso') { /* DEC-239: en Inspección, el inspector (el de la visita en curso primero); en Coordinación, el coordinador */
      const ins = c.riesgos.filter((r) => r.visita && r.visita.inspector && /curso/i.test(String(r.estado))).concat(c.riesgos.filter((r) => r.visita && r.visita.inspector)).map((r) => r.visita.inspector)[0]; c.responsable = (c.estado === 'Agendado' || c.estado === 'En curso') && ins ? ins : (coordinador || c.responsable); }
    return c;
  }
  window.SiriusCoordEstado = { version: '1.1', COORD: COORD, ETIQUETAS: ETIQ, riesgo: riesgo, riesgos: riesgos, caso: casoDe, fase: fase, cuenta: cuenta, texto: texto, aplicarBase: aplicarBase };
})();
