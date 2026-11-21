// SIRIUS · Lector único de la operación de los inspectores (v1.0 · etapa R-5a · DEC-266 y DEC-268 · 21/11/2026).
// Red de inspectores es la única dueña de la jornada, la capacidad por día, las modalidades, los ramos, «recibe ofertas» y los bloqueos (DEC-262).
// Toda la pantalla los lee aquí: la Agenda (SiriusAgenda), Coordinar visita, la Agenda conectada, la ficha de Usuarios, el monitor, el portal del cliente,
// la app del inspector, SiriusCobertura y Configuración general. Fuente: SIRIUS_CONEXION.red si la conexión (real o simulada) está activa y trae la red;
// si no, SIRIUS_RED (demostración, datos-red.js). Sin jornada propia en la Red: la «Jornada por defecto de las visitas» (SiriusFecha.jornadaDefecto()).
// Días: la Red usa 1 a 7 (lunes = 1); la Agenda, 0 a 6 (domingo = 0). La conversión se hace solo aquí (dias06).
// Transición hasta R-5b: cada inspector de la Red puede traer `ficha` (credencial, ciudadBase, base, zonas y, si estaba en la red de ofertas, red:
// { organizacion, tipo, agencia, nota }); con ella disp(n) y deRed(n) devuelven los registros con la forma que antes tenían SIRIUS_AGENDA.disponibilidad y .red.
(function () {
  const W = window; if (W.SiriusRedFuente) return; const R = {};
  const pad = (n) => String(n).padStart(2, '0');
  const min = (h) => { if (!h) return null; const p = String(h).split(':'); return +p[0] * 60 + +(p[1] || 0); };
  const parse = (iso) => { const p = String(iso).split(/[-T:]/).map(Number); return new Date(p[0], p[1] - 1, p[2], p[3] || 0, p[4] || 0); };
  const mismo = (a, b) => { const M = W.SiriusMaestros; return M && M.mismo ? M.mismo(a, b) : a === b; };
  const MODS = ['Presencial', 'Virtual guiada'], RAMOS = ['Vehículos', 'Ramos Generales', 'Equipo y maquinaria'];
  // ---------- Fuente ----------
  // Sin la conexión, la Red de la sesión (SiriusRed.demo(): lo que se guarda en Red › Por inspector); en las páginas sin el módulo de la Red, SIRIUS_RED.
  R.fuente = () => { const X = W.SIRIUS_CONEXION; if (X && X.activo === true && X.red && typeof X.red === 'object' && Array.isArray(X.red.inspectores)) return X.red; const SR = W.SiriusRed, s = SR && SR.demo ? SR.demo() : null; return s || W.SIRIUS_RED || null; };
  R.inspectores = () => { const F = R.fuente(); return F && Array.isArray(F.inspectores) ? F.inspectores : []; };
  R.inspector = (n) => { if (!n) return null; const L = R.inspectores(); return L.find((x) => x && x.nombre === n) || L.find((x) => x && (mismo(x.nombre, n) || (x.identificacion && mismo(x.identificacion, n)))) || null; };
  R.lista = () => R.inspectores().map((x) => x.nombre);
  const op = (n) => ((R.inspector(n) || {}).operacion) || {};
  const ficha = (n) => ((R.inspector(n) || {}).ficha) || {};
  // ---------- Jornada ----------
  R.defecto = () => { const SF = W.SiriusFecha, G = SF && SF.jornadaDefecto ? SF.jornadaDefecto() : null; return G ? { dias: (G.dias || []).slice(), desde: G.desde, hasta: G.hasta } : { dias: [1, 2, 3, 4, 5, 6], desde: '08:30', hasta: '17:30' }; };
  R.propia = (n) => { const j = op(n).jornada; return !!(j && Array.isArray(j.dias) && j.dias.length && j.desde && j.hasta); };
  R.jornada = (n) => { if (R.propia(n)) { const j = op(n).jornada; return { dias: j.dias.slice().sort((a, b) => a - b), desde: j.desde, hasta: j.hasta, propia: true }; } return Object.assign(R.defecto(), { propia: false }); };
  R.dias06 = (dias) => (dias || []).map((d) => (d === 7 ? 0 : d));
  R.feriado = (iso) => { const F = W.SIRIUS_FLUJO, f = F && F.calendario && (F.calendario.feriados || []).find((x) => x.fecha === iso && x.alcance === 'Nacional'); return f ? f.nombre : null; };
  R.trabaja = (n, iso) => { const j = R.jornada(n); return j.dias.indexOf(((parse(iso).getDay() + 6) % 7) + 1) >= 0 && !R.feriado(iso); };
  // ---------- Operación ----------
  R.capacidad = (n) => { const c = op(n).capacidadDia; return c == null || c === '' ? null : Number(c); };
  R.modalidades = (n) => (op(n).modalidades || []).slice();   // vacía = todas
  R.ramos = (n) => (op(n).ramos || []).slice();               // vacía = todos
  R.recibe = (n) => { const r = op(n).recibeOfertas; return r === 'red' || r === 'coord' || r === 'no' ? r : 'coord'; };
  // ---------- Bloqueos ----------
  // Un bloqueo de 00:00 a 23:59 es «todo el día»: se lee con fechas sin hora, como los anotaba la Agenda.
  const norm = (b) => { let a = String(b.desde || ''), z = String(b.hasta || ''); if (/T00:00$/.test(a) && /T23:59$/.test(z)) { a = a.slice(0, 10); z = z.slice(0, 10); } return Object.assign({}, b, { desde: a, hasta: z }); };
  R.bloqueosDe = (n) => { const i = R.inspector(n); return i ? (i.bloqueos || []).map(norm).map((b) => Object.assign({ inspector: i.nombre }, b)) : []; };
  R.bloqueos = (n, iso) => R.bloqueosDe(n).filter((b) => iso >= b.desde.slice(0, 10) && iso <= b.hasta.slice(0, 10)).map((b) => {
    const todo = b.desde.length <= 10 && b.hasta.length <= 10, ini = b.desde.length > 10 && b.desde.slice(0, 10) === iso ? min(b.desde.slice(11)) : 0, fin = b.hasta.length > 10 && b.hasta.slice(0, 10) === iso ? min(b.hasta.slice(11)) : 24 * 60;
    return { ini, fin, motivo: b.motivo, todoElDia: todo || (ini === 0 && fin === 24 * 60), desde: b.desde, hasta: b.hasta }; });
  // ---------- Registros con la forma de la Agenda anterior (transición hasta R-5b) ----------
  // disp(n): el inspector con jornada propia (agenda fija): { inspector, credencial, ciudadBase, base, dias (0 a 6), jornada [desde, hasta], zonas, capacidadDia, modalidades }.
  const dispDe = (i) => { const n = i.nombre, f = i.ficha || {}, j = R.jornada(n), o = { inspector: n };
    ['credencial', 'ciudadBase', 'base'].forEach((k) => { if (f[k] != null) o[k] = Array.isArray(f[k]) ? f[k].slice() : f[k]; });
    const m = R.modalidades(n); return Object.assign(o, { dias: R.dias06(j.dias), jornada: [j.desde, j.hasta], zonas: (f.zonas || []).slice(), capacidadDia: R.capacidad(n), modalidades: m.length ? m : MODS.slice() }); };
  R.agenda = () => R.inspectores().filter((i) => R.propia(i.nombre)).map(dispDe);
  R.disp = (n) => { const i = R.inspector(n); return i && R.propia(i.nombre) ? dispDe(i) : null; };
  // deRed(n): quien recibe ofertas de la red (o estaba en ella): { inspector, organizacion, agencia, tipo, credencial, base, zonas, grupos, modalidades, activo, nota }.
  const tipoRed = (t) => (t === 'Independiente' ? 'Externo' : t || 'Agencia');
  const redDe = (i) => { const n = i.nombre, f = i.ficha || {}, r = f.red || {}, o = { inspector: n, organizacion: r.organizacion || (i.tipo === 'Interno' ? 'Aseguradora del Sur' : i.tipo === 'Independiente' ? 'Independiente' : (i.agencia || 'Agencia')) };
    if (r.agencia || i.agencia) o.agencia = r.agencia || i.agencia; o.tipo = r.tipo || tipoRed(i.tipo); if (f.credencial != null) o.credencial = f.credencial; if (f.base) o.base = f.base.slice();
    const g = R.ramos(n), m = R.modalidades(n); Object.assign(o, { zonas: (f.zonas || []).slice(), grupos: g.length ? g : RAMOS.slice(), modalidades: m.length ? m : MODS.slice(), activo: R.recibe(n) === 'red' }); if (r.nota) o.nota = r.nota; return o; };
  R.ofertas = () => R.inspectores().filter((i) => R.recibe(i.nombre) === 'red' || !!((i.ficha || {}).red)).map(redDe);
  R.deRed = (n) => { const i = R.inspector(n); return i && (R.recibe(i.nombre) === 'red' || (i.ficha || {}).red) ? redDe(i) : null; };
  // ---------- Escenas con la conexión simulada ----------
  // conJornadas(L): una red para la escena = SIRIUS_RED con la jornada, la capacidad y las modalidades de L (registros con la forma de la Agenda: dias 0 a 6).
  R.conJornadas = (L) => { const B = W.SIRIUS_RED || { inspectores: [] }, red = { listo: true, puedeGestionar: !!B.puedeGestionar, inspectores: JSON.parse(JSON.stringify(B.inspectores || [])), historial: [] };
    (L || []).forEach((d) => { let i = red.inspectores.find((x) => x.nombre === d.inspector);
      if (!i) { const f = {}; ['credencial', 'ciudadBase', 'base'].forEach((k) => { if (d[k] != null) f[k] = d[k]; }); f.zonas = (d.zonas || []).slice();
        i = { nombre: d.inspector, tipo: 'Interno', tipoInspector: 'Interno', agencia: '', estado: 'Activo', cuenta: true, operacion: { modalidades: [], ramos: [], recibeOfertas: 'coord' }, cobertura: [], bloqueos: [], ficha: f }; red.inspectores.push(i); }
      const o = i.operacion = Object.assign({}, i.operacion || {}); if (Array.isArray(d.dias) && Array.isArray(d.jornada)) o.jornada = { dias: d.dias.map((x) => (x === 0 ? 7 : x)), desde: d.jornada[0], hasta: d.jornada[1] };
      if (d.capacidadDia != null) o.capacidadDia = d.capacidadDia; if (Array.isArray(d.modalidades)) o.modalidades = d.modalidades.slice(); });
    return red; };   // solo la operación: la ficha (credencial, zonas…) sigue siendo la de la Red
  R.pad = pad;
  W.SiriusRedFuente = R;
})();
