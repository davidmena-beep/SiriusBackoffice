// SIRIUS · Monitor del proceso (etapas 16f-3 y 16f-3b · DEC-170; antes numerada DEC-167 y DEC-168).
// Lee SIRIUS_MONITOR (datos-monitor.js, tal cual: métricas, reglas de cuellos, causas, acciones y generador) y
// SIRIUS_MONITOR_EJEMPLO (datos-monitor-ejemplo.js: calibración del generador, solo prototipo). El calendario hábil, el
// SLA de cada estado y el reloj salen de SIRIUS_FLUJO. Nada se escribe a mano: todas las cifras se calculan.
// Piezas: (1) cronología — cada cambio de estado guarda entrada, inicio y fin del trabajo, actor y rol; la histórica de
// ejemplo se genera con semilla fija (30 + 30 días antes del reloj) y se suma a la de los casos actuales del prototipo,
// que además registra en vivo los cambios de la sesión; (2) métricas, diagrama de flujo acumulado, cuellos y causas;
// (3) responsables, tareas, cargabilidad y simulación de reasignación (16f-3b); (4) la interfaz Vista con las cinco vistas.
(function () {
  if (window.SiriusMonitor) return;
  const R = () => window.React, h = (...a) => R().createElement(...a), NS = () => window.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const D = () => window.SIRIUS_MONITOR || null, X = () => window.SIRIUS_MONITOR_EJEMPLO || {}, F = () => window.SIRIUS_FLUJO || null, EJ = () => window.SIRIUS_EJEMPLO || {};
  const z = (n) => String(n).padStart(2, '0');
  const isoD = (d) => d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  const DIA = 480; // minutos hábiles por día (jornada de SIRIUS_FLUJO: 8 h)
  const SM = { roles: ['Administrador', 'Coordinador de inspecciones'], accion: 'Ver el monitor del proceso', campana: [], vivos: {}, aperturas: {}, reasig: {}, _base: {}, _gen: null, _eje: null, rev: 0 };
  window.SiriusMonitor = SM;
  SM.reset = function () { SM.campana.length = 0; SM.vivos = {}; SM.aperturas = {}; SM._base = {}; SM.reasig = {}; SM._cache = null; SM._detectado = false; SM.rev++; };
  // 16f-3b · el acceso sale de la matriz de permisos (acción «Ver el monitor del proceso»); sin matriz, Administrador y Coordinador.
  SM.puedeVer = (rol) => { const SU = window.SiriusUsuarios; if (SU && SU.filas && SU.filas().some(a => a[1] === SM.accion)) return SU.permiso(rol, SM.accion) !== ''; return SM.roles.includes(rol); };
  const FLOW = ['Registrado', 'En coordinación', 'Agendado', 'En curso', 'Pendiente calificación', 'Devuelto al inspector', 'Pendiente calificación de suscripción'];
  const FINALES = ['Inspeccionado', 'Cancelado'];
  SM.FLOW = FLOW;

  // ---------- Eje de tiempo hábil (minutos hábiles desde el primer día de la cronología) ----------
  const mmOf = (s) => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };
  const ahoraD = () => { const E = EJ(); return E.ahora ? E.ahora() : new Date(2026, 9, 18, 20, 30); };
  function eje() {
    if (SM._eje) return SM._eje;
    const f = F(), now = ahoraD(), dias = X().diasHistoria || 75, bd = [], idx = {};
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dias);
    for (const d = new Date(d0); d <= now; d.setDate(d.getDate() + 1)) if (f.esHabil(d)) { idx[isoD(d)] = bd.length; bd.push(new Date(d)); }
    const jor = f.calendario.jornada.map(([a, b]) => [mmOf(a), mmOf(b)]);
    const A = { bd, idx, jor, now, d0 };
    A.toB = (date) => { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()); let i = idx[isoD(d)];
      if (i == null) { for (let k = 1; k < 12; k++) { d.setDate(d.getDate() + 1); if (idx[isoD(d)] != null) return idx[isoD(d)] * DIA; } return bd.length * DIA; }
      const m = date.getHours() * 60 + date.getMinutes(); let acc = 0; for (const [a, b] of jor) { if (m <= a) return i * DIA + acc; if (m < b) return i * DIA + acc + (m - a); acc += b - a; } return i * DIA + acc; };
    A.fromB = (b, fin) => { let i = Math.floor(b / DIA), o = b - i * DIA; if (fin && o === 0 && i > 0) { i -= 1; o = DIA; } if (i >= bd.length) { i = bd.length - 1; o = DIA; } if (i < 0) { i = 0; o = 0; }
      const d = bd[i]; let acc = 0; for (const [a, c] of jor) { const len = c - a; if (o <= acc + len) { const m = a + (o - acc); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60); } acc += len; }
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 17, 30); };
    A.nowB = A.toB(now);
    A.corte = (hhmm) => { const m = mmOf(hhmm); let acc = 0; for (const [a, b] of jor) { if (m <= a) return acc; if (m < b) return acc + m - a; acc += b - a; } return acc; };
    A.ofs = (b) => b - Math.floor(b / DIA) * DIA; // minuto hábil dentro del día (0–480)
    SM._eje = A; return A;
  }
  SM.eje = eje;

  // ---------- Azar con semilla ----------
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (s) => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
  function azar(seed) { const r = rng(seed); const norm = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    return { r, ln: (med, s) => med * Math.exp(s * norm()), elegir: (obj) => { const e = Array.isArray(obj) ? obj : Object.entries(obj), tot = e.reduce((a, x) => a + x[1], 0); let u = r() * tot; for (const [k, w] of e) { u -= w; if (u <= 0) return k; } return e[e.length - 1][0]; },
      poisson: (l) => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= r(); } while (p > L); return k - 1; }, uno: (a) => a[Math.floor(r() * a.length)] }; }

  // ---------- Parámetros por estado ----------
  function tiempos() { const T = {}, sw = X().sigmaTrabajo || 0.45; (D().generador.tiempos || []).forEach(([e, w, t, p90]) => { T[e] = { w: w * 60, t: t * 60, sw, s: Math.log(Math.max(1.05, (p90 - t) / Math.max(0.05, w))) / 1.2816 }; }); return T; }
  const ROL = { 'Registrado': 'Coordinador de inspecciones', 'En coordinación': 'Coordinador de inspecciones', 'Agendado': 'Inspector', 'En curso': 'Inspector', 'Devuelto al inspector': 'Inspector', 'Pendiente calificación': 'Ejecutivo de inspecciones', 'Pendiente calificación de suscripción': 'Suscriptor', 'Reaperturado': 'Coordinador de inspecciones', 'Enlace caducado': 'Coordinador de inspecciones' };
  SM.ROL = ROL;
  const coordinador = (suc) => { const f = F(); return (f.coordinadorPorSucursal || {})[suc] || (f.coordinadorPorSucursal || {})['*'] || 'Andrea Salazar'; };
  const suscriptor = (g) => { const f = F(); return (f.suscriptorPorGrupo || {})[g === 'Equipo y maquinaria' ? 'Ramos Generales' : g] || (f.suscriptorPorGrupo || {})['Ramos Generales'] || 'Por asignar'; };
  function actorDe(c, e) { const r = ROL[e]; if (r === 'Coordinador de inspecciones') return [coordinador(c.sucursal), r]; if (r === 'Ejecutivo de inspecciones') return [c.ejecutivo, r]; if (r === 'Suscriptor') return [suscriptor(c.grupo), r];
    if (c.modalidad === 'Autoinspección' && (e === 'Agendado' || e === 'En curso')) return ['Cliente', 'Cliente (autoinspección)']; return [c.inspector || 'Inspector', 'Inspector']; }
  const ausente = (p, b) => { const A = eje(), per = (X().personas || {})[p]; if (!per || !per.ausencias) return null; const i = Math.min(A.bd.length - 1, Math.floor(b / DIA)), k = isoD(A.bd[Math.max(0, i)]); return per.ausencias.find(([a, c]) => k >= a && k <= c) || null; };
  SM.ausente = ausente;
  function dedicacion(p, b) { const x = X(), per = (x.personas || {})[p], tb = SM._tb; if (!per) return x.dedicacionInspector || 0.75; return per.dedicacionDesdeTendencia != null && b >= tb ? per.dedicacionDesdeTendencia : per.dedicacion; }

  // ---------- Generador de la cronología histórica de ejemplo ----------
  function generar() {
    if (SM._gen) return SM._gen;
    const G = D().generador, x = X(), A = eje(), T = tiempos(), Z = azar(G.semilla), E = EJ(), N = A.bd.length;
    const ti = x.inicioTendencia ? new Date(+x.inicioTendencia.slice(0, 4), +x.inicioTendencia.slice(5, 7) - 1, +x.inicioTendencia.slice(8, 10)) : null; SM._tb = ti ? A.toB(ti) : Infinity;
    const ramosRG = (E.ramos || []).filter(r => r.grupo === 'Ramos Generales' && r.nombre !== 'Equipo y maquinaria').map(r => r.nombre);
    const insp = (E.inspectores || []).filter(i => i.tipo === 'Interno').map(i => i.n); const nom = x.nombres || {};
    const casos = []; let sec = 19001;
    for (let i = 0; i < N; i++) for (const [g, l] of Object.entries(G.casosPorDiaHabil)) { const k = Z.poisson(l); for (let j = 0; j < k; j++) {
      const t = i * DIA + Math.floor(Z.r() * DIA); const modalidad = Z.elegir(G.modalidad), suc = Z.elegir(x.sucursales);
      const ramo = g === 'Vehículos' ? 'Vehículos' : g === 'Equipo y maquinaria' ? 'Equipo y maquinaria' : Z.uno(ramosRG);
      casos.push({ t0: t, grupo: g, ramo, modalidad, sucursal: suc, ejecutivo: Z.elegir(x.ejecutivos), inspector: Z.uno(insp.length ? insp : ['Marco Tapia']), dual: g !== 'Vehículos' && Z.r() < (x.suscripcion || 0.5),
        asegurado: g === 'Vehículos' && Z.r() < 0.7 ? Z.uno(nom.personas || ['Asegurado']) : Z.uno(nom.empresas || ['Empresa']), broker: Z.uno(nom.brokers || ['Directo']),
        placa: g === 'Vehículos' ? 'P' + 'ABCDGHIJKLMNOPRSTUVWXY'[Math.floor(Z.r() * 22)] + 'ABCDGHIJKLMNOPRSTUVWXY'[Math.floor(Z.r() * 22)] + '-' + (1000 + Math.floor(Z.r() * 8999)) : '' }); } }
    casos.sort((a, b) => a.t0 - b.t0); casos.forEach(c => { c.id = String(sec++); c.real = false; c.flujo = c.grupo === 'Vehículos' ? 'FL-VEH' : c.grupo === 'Equipo y maquinaria' ? 'FL-EM' : 'FL-RG'; c.version = 1; c.tramos = []; c.devs = 0; c.retr = false; c.registro = c.t0; });
    // Simulación por eventos en orden de tiempo (la calificación es una cola por Ejecutivo: FIFO, con su dedicación y ausencias).
    const ev = []; const push = (t, c, e, extra) => { let lo = 0, hi = ev.length; while (lo < hi) { const m = (lo + hi) >> 1; if (ev[m].t <= t) lo = m + 1; else hi = m; } ev.splice(lo, 0, Object.assign({ t, c, e }, extra || {})); };
    casos.forEach(c => push(c.t0, c, 'Registrado'));
    const libre = {}, nowB = A.nowB, mult = x.modalidadEspera || {}, lot = x.lotes || { proporcion: 0 };
    const siguiente = (c, e, tr) => {
      if (e === 'Registrado') return 'En coordinación';
      if (e === 'En coordinación') return Z.r() < (x.cancelacion || 0) ? 'Cancelado' : 'Agendado';
      if (e === 'Agendado') return 'En curso';
      if (e === 'En curso' || e === 'Devuelto al inspector') return 'Pendiente calificación';
      if (e === 'Pendiente calificación') { const insp = c.modalidad !== 'Autoinspección', dv = x.devolucion || {}, conc = (G.retrabajo || {}).concentracion || '', enConc = conc === c.modalidad + ' · ' + c.sucursal;
        const p = (c.devs ? dv.repetir : enConc ? dv.concentracion : dv.base) || 0;
        if (insp && Z.r() < p) { c.devs++; c.retr = true; tr.devolucion = Z.elegir(x.motivosDevolucion || [['Informe incompleto', 1]]); if (!c.motivoDev) c.motivoDev = tr.devolucion; return 'Devuelto al inspector'; }
        return c.dual ? 'Pendiente calificación de suscripción' : 'Inspeccionado'; }
      return 'Inspeccionado'; };
    const cerrarT = (c, tr) => { if (tr.salida > nowB) { tr.salida = null; if (tr.inicio > nowB) tr.inicio = null; c.estado = tr.estado; return; } push(tr.salida, c, siguiente(c, tr.estado, tr)); };
    while (ev.length) { const { t, c, e, tr: trc, trabajo: tbc } = ev.shift();
      if (e === '__cal') { // la Ejecutiva toma el caso cuando está listo y libre (cola por orden de llegada a «listo»), con su dedicación y ausencias
        if (t >= nowB) { trc.salida = null; trc.inicio = null; c.estado = trc.estado; continue; }
        const p = trc.actor; let s = Math.max(t, libre[p] || 0), mot = '';
        for (let k = 0; k < 15; k++) { const au = ausente(p, s); if (!au) break; const ia = A.idx[au[1]]; s = Math.max(s, (ia != null ? ia + 1 : Math.floor(s / DIA) + 1) * DIA); mot = 'disponibilidad'; }
        const ded = dedicacion(p, s), dur = tbc / ded; libre[p] = s + dur; const cola = s - t;
        trc.salida = s + dur; trc.inicio = trc.salida - tbc; trc.cola = cola;
        trc.causa = mot || (cola > 30 && ded < 0.5 ? 'contencion' : A.ofs(trc.entrada) >= A.corte(lot.desde || '16:00') ? 'lotes' : cola > 30 ? 'contencion' : 'prioridad');
        cerrarT(c, trc); continue; }
      if (t >= nowB) continue;
      if (FINALES.includes(e)) { c.final = e; c.cierre = t; continue; }
      const P = T[e] || { w: 60, t: 30, s: 0.6, sw: 0.45 }, [actor, rol] = actorDe(c, e); const tr = { estado: e, entrada: t, actor, rol }; c.tramos.push(tr);
      let trabajo = Math.max(3, Z.ln(P.t, P.sw)), espera, causa;
      if (e === 'Pendiente calificación') { const base = Z.ln(P.w, P.s); tr.base = base; tr.salida = null; tr.inicio = null; c.estado = e; push(t + base, c, '__cal', { tr, trabajo }); continue; }
      if (e === 'Pendiente calificación de suscripción') {
        espera = Z.ln(P.w, P.s); let s = t + espera; for (let k = 0; k < 5; k++) { const au = ausente(actor, s); if (!au) break; const ia = A.idx[au[1]]; s = (ia != null ? ia + 1 : Math.floor(s / DIA) + 1) * DIA; } causa = s > t + espera ? 'disponibilidad' : 'prioridad'; espera = s - t;
      } else {
        espera = Z.ln(P.w * ((mult[e] || {})[c.modalidad] || 1), P.s);
        causa = e === 'Registrado' || e === 'Devuelto al inspector' ? 'prioridad' : 'externa';
        if (e === 'En curso' && c.modalidad !== 'Autoinspección' && Z.r() < lot.proporcion) { const fin = t + espera + trabajo, o = A.ofs(fin), corte = A.corte(lot.desde || '16:00'); if (o < corte) { espera += corte + Math.floor(Z.r() * 80) - o; causa = 'lotes'; } }
        if (e === 'En curso' && c.modalidad === 'Autoinspección' && Z.r() < (x.fotoRechazada || 0)) { c.retr = true; c.fotoRech = true; espera += Z.ln(240, 0.5); }
      }
      tr.inicio = t + espera; tr.salida = t + espera + trabajo; tr.causa = causa; cerrarT(c, tr); }
    casos.forEach(c => { if (!c.final && !c.estado) c.estado = c.tramos.length ? c.tramos[c.tramos.length - 1].estado : 'Registrado'; if (c.final) c.estado = c.final; });
    SM._gen = casos; return casos;
  }
  SM.generar = generar;

  // ---------- Cronología de los casos actuales del prototipo ----------
  const PATH = { 'Registrado': 0, 'En coordinación': 1, 'Agendado': 2, 'Enlace caducado': 2, 'En curso': 3, 'Pendiente calificación': 4, 'Devuelto al inspector': 5, 'Pendiente calificación de suscripción': 5, 'Reaperturado': 5 };
  function baseReal(c) {
    const f = F(), A = eje(), T = tiempos(), Z = azar(hash(c.id) ^ D().generador.semilla), est = f.normalizar(c.estado || 'Registrado');
    const grupo = c.ramo === 'Equipo y maquinaria' ? 'Equipo y maquinaria' : f.grupoDe(c);
    const o = { id: c.id, real: true, grupo, ramo: c.ramo, sucursal: c.sucursal, modalidad: c.modalidad || 'Presencial', ejecutivo: c.ejecutivo, inspector: c.inspector || '', flujo: c.flujoId || '', version: c.flujoVersion || 1, devs: 0, retr: est === 'Reaperturado' || est === 'Devuelto al inspector', tramos: [], asegurado: c.asegurado, broker: c.broker, placa: c.placa };
    const parse = (s) => { const [d, t] = s.split('T'), [y, m, dd] = d.split('-').map(Number), [hh, mi] = (t || '09:00').split(':').map(Number); return new Date(y, m - 1, dd, hh, mi); };
    let reg = A.toB(parse(String(c.fecha || isoD(A.now)) + 'T' + z(8 + (hash(c.id) % 4)) + ':' + z(30 + (hash(c.id) % 25))));
    const cerrado = ['Inspeccionado', 'Enviado a emisión', 'Emitida', 'No emitida'].includes(est), cancel = est === 'Cancelado';
    let camino = cerrado ? ['Registrado', 'En coordinación', 'Agendado', 'En curso', 'Pendiente calificación'].concat(grupo !== 'Vehículos' && hash(c.id) % 2 ? ['Pendiente calificación de suscripción'] : []) : cancel ? ['Registrado', 'En coordinación'] : null;
    if (!camino) { const k = PATH[est] != null ? PATH[est] : 1; camino = ['Registrado', 'En coordinación', 'Agendado', 'En curso', 'Pendiente calificación'].slice(0, Math.min(k, 5)); if (est === 'Devuelto al inspector' || est === 'Pendiente calificación de suscripción' || est === 'Reaperturado') camino = ['Registrado', 'En coordinación', 'Agendado', 'En curso', 'Pendiente calificación']; camino = camino.concat([est]); }
    const ing = (f.ingresos || {})[c.id]; let entradaAct = ing && ing.desde ? A.toB(parse(ing.desde)) : null;
    const dur = camino.map(e => { const P = T[e] || { w: 120, t: 40, s: 0.6, sw: 0.45 }, m = ((X().modalidadEspera || {})[e] || {})[o.modalidad] || 1; const w = Z.ln(P.w * m, P.s), t = Math.max(3, Z.ln(P.t, P.sw)); return [w, t]; });
    const abierto = !cerrado && !cancel, nPrev = abierto ? camino.length - 1 : camino.length; let tot = 0; for (let i = 0; i < nPrev; i++) tot += dur[i][0] + dur[i][1];
    let fin = abierto ? (entradaAct != null ? entradaAct : reg + tot) : reg + tot; if (fin > A.nowB - 30) fin = A.nowB - 30; if (abierto && fin < reg) reg = Math.max(0, fin - tot);
    const k = fin > reg && tot > 0 ? (fin - reg) / tot : 1; let t = reg;
    for (let i = 0; i < camino.length; i++) { const e = camino[i], [actor, rol] = actorDe(o, e), tr = { estado: e, entrada: t, actor, rol, causa: ['En coordinación', 'Agendado'].includes(e) ? 'externa' : 'prioridad' };
      if (i < nPrev) { tr.inicio = t + dur[i][0] * k; tr.salida = t + (dur[i][0] + dur[i][1]) * k; t = tr.salida; } else { tr.inicio = null; tr.salida = null; }
      o.tramos.push(tr); }
    o.registro = reg; if (cerrado) { o.final = 'Inspeccionado'; o.cierre = t; } else if (cancel) { o.final = 'Cancelado'; o.cierre = t; }
    o.estado = cerrado ? 'Inspeccionado' : cancel ? 'Cancelado' : est;
    if (est === 'Devuelto al inspector') { o.devs = 1; o.motivoDev = 'Fotos ilegibles del tablero'; o.tramos[o.tramos.length - 2].devolucion = o.motivoDev; }
    return o;
  }
  // Casos actuales: base (una vez por caso, con el estado con el que se vieron por primera vez) + cambios registrados en la sesión.
  function reales(casos) { return (casos || []).filter(c => c && c.id).map(c => { if (!SM._base[c.id]) SM._base[c.id] = baseReal(c); const b = SM._base[c.id], v = SM.vivos[c.id]; if (!v || !v.length) return b;
    const o = Object.assign({}, b, { tramos: b.tramos.map(t => Object.assign({}, t)) }); v.forEach(x => { const ab = o.tramos.find(t => t.salida == null); if (ab) { ab.salida = x.b; ab.inicio = x.b; ab.trabajoReal = x.min; ab.actor = x.actor; ab.rol = x.rol; ab.finTs = x.ts; ab.inicioTs = x.tsIni; }
      if (FINALES.includes(x.a) || ['Enviado a emisión', 'Emitida', 'No emitida'].includes(x.a)) { o.final = x.a === 'Cancelado' ? 'Cancelado' : 'Inspeccionado'; o.cierre = x.b; o.estado = o.final; }
      else { const [actor, rol] = actorDe(o, x.a); o.tramos.push({ estado: x.a, entrada: x.b, inicio: null, salida: null, actor, rol, causa: 'prioridad', vivo: true, entradaTs: x.ts }); o.estado = x.a; o.final = null; o.cierre = null; if (x.a === 'Devuelto al inspector' || x.a === 'Reaperturado') { o.retr = true; o.devs++; } } });
    return o; }); }
  // Registro en vivo: inicio del trabajo (abrir el caso para actuar o iniciar la visita) y cambio de estado (fin del trabajo).
  SM.registrarApertura = function (id, actor, rol) { if (!id) return; SM.aperturas[id] = { ms: Date.now(), actor, rol }; };
  SM.registrarCambio = function (id, de, a, actor, rol) { if (!id || !a || de === a) return; const A = eje(), ap = SM.aperturas[id], min = ap ? Math.max(0, Math.round((Date.now() - ap.ms) / 60000)) : 0;
    (SM.vivos[id] = SM.vivos[id] || []).push({ de, a, b: A.nowB, min, actor: actor || (ap && ap.actor) || '', rol: rol || (ap && ap.rol) || '', ts: isoD(A.now) + 'T' + z(A.now.getHours()) + ':' + z(A.now.getMinutes()), tsIni: isoD(A.now) + 'T' + z(A.now.getHours()) + ':' + z(Math.max(0, A.now.getMinutes() - Math.min(min, A.now.getMinutes()))) }); SM._cache = null; SM.rev++; };

  // ---------- Universo, filtros y ventanas ----------
  // Los casos actuales ocupan el lugar de los generados de su mismo grupo registrados más cerca (±3 días hábiles), para que el flujo total siga siendo
  // el de SIRIUS_MONITOR.generador.casosPorDiaHabil y el período actual no tenga más casos que el anterior solo por sumar los del prototipo.
  SM.universo = function (casosReales) { const gen = generar(), re = reales(casosReales), fuera = new Set();
    re.slice().sort((a, b) => a.registro - b.registro).forEach(r => { let mejor = null; gen.forEach(g => { if (fuera.has(g.id) || g.grupo !== r.grupo) return; const d = Math.abs(g.registro - r.registro); if (d <= 3 * DIA && (!mejor || d < mejor[1])) mejor = [g, d]; }); if (mejor) fuera.add(mejor[0].id); });
    SM._reemplazados = fuera.size; return gen.filter(g => !fuera.has(g.id)).concat(re).map(c => { const r = SM.reasig[c.id]; if (!r) return c; const o = Object.assign({}, c, { tramos: c.tramos.map(t => (t.salida == null && t.rol === r.rol) ? Object.assign({}, t, { actor: r.a, reasignado: r.de }) : t) }); if (r.rol === 'Ejecutivo de inspecciones') o.ejecutivo = r.a; return o; }); };
  // Reasignación hecha desde el Monitor (casos de ejemplo y actuales): cambia el responsable del tramo abierto; el SLA no se reinicia.
  SM.reasignar = function (ids, de, a, rol, motivo) { (ids || []).forEach(id => { SM.reasig[id] = { de, a, rol, motivo }; }); SM._cache = null; SM.rev++; };
  const MOD = ['Autoinspección', 'Presencial', 'Virtual guiada'];
  SM.opciones = function (todos, alcance) { const suc = ((EJ().catalogos || {}).sucursales || []).map((x) => typeof x === 'string' ? x : (x && (x.nombre || x.n)) || '').filter(Boolean).filter(s => !alcance || alcance === 'Todas' || alcance.includes(s)); const ver = Array.from(new Set(todos.filter(c => c.flujo).map(c => c.flujo + ' · v' + c.version))).sort();
    return { periodo: [['30', 'Últimos 30 días'], ['14', 'Últimos 14 días'], ['7', 'Últimos 7 días']], grupo: ['Todos'].concat(Object.keys(D().generador.casosPorDiaHabil)), sucursal: ['Todas'].concat(suc), modalidad: ['Todas'].concat(Object.keys(D().generador.modalidad || {}).length ? Object.keys(D().generador.modalidad) : MOD), version: ['Todas'].concat(ver) }; };
  const pasa = (c, f, alcance) => (!f.grupo || f.grupo === 'Todos' || c.grupo === f.grupo) && (!f.sucursal || f.sucursal === 'Todas' ? (!alcance || alcance === 'Todas' || alcance.includes(c.sucursal)) : c.sucursal === f.sucursal) && (!f.modalidad || f.modalidad === 'Todas' || c.modalidad === f.modalidad) && (!f.version || f.version === 'Todas' || (c.flujo + ' · v' + c.version) === f.version);
  function ventana(dias, atras) { const A = eje(), n = A.now; const fin = new Date(n.getFullYear(), n.getMonth(), n.getDate() - dias * (atras || 0), n.getHours(), n.getMinutes()), ini = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate() - dias, fin.getHours(), fin.getMinutes()); return { w0: A.toB(ini), w1: A.toB(fin), ini, fin }; }
  SM.ventana = ventana;

  // ---------- Cálculos ----------
  const q = (arr, p) => { if (!arr.length) return null; const a = arr.slice().sort((x, y) => x - y), i = (a.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); };
  SM.q = q;
  const durT = (t, b) => (t.salida != null ? t.salida : b) - t.entrada;
  const trabT = (t) => t.salida != null && t.inicio != null ? t.salida - t.inicio : 0;
  const espT = (t, b) => (t.inicio != null ? t.inicio : (t.salida != null ? t.salida : b)) - t.entrada;
  function slaH(c, e) { const f = F(), et = f.etapaDe(e); if (!et) return null; if (et.venceCon === 'visita') return null; if (e === 'Registrado') return et.hito ? et.hito.horas : null; return f.slaDe(et, { ramo: c.ramo === 'Equipo y maquinaria' ? 'Equipo y maquinaria' : c.ramo }); }
  SM.slaH = slaH;
  // Duración que se compara con el SLA: «En coordinación» cuenta desde el registro (la etapa Coordinación empieza ahí).
  function durSla(c, t, b) { if (t.estado === 'En coordinación') { const r = c.tramos.find(x => x.estado === 'Registrado'); if (r) return (t.salida != null ? t.salida : b) - r.entrada; } return durT(t, b); }
  function enEstado(c, b) { if (c.registro > b) return null; if (c.cierre != null && c.cierre <= b) return c.final; for (const t of c.tramos) if (t.entrada <= b && (t.salida == null || t.salida > b)) return t.estado; return null; }
  SM.enEstado = enEstado;
  const activo = (c, b) => c.registro <= b && !(c.cierre != null && c.cierre <= b);
  function indicadores(cs, w0, w1) {
    const cerr = cs.filter(c => c.cierre != null && c.cierre > w0 && c.cierre <= w1), insp = cerr.filter(c => c.final === 'Inspeccionado');
    const ciclos = insp.map(c => (c.cierre - c.registro) / 60), trab = insp.reduce((a, c) => a + c.tramos.reduce((s, t) => s + trabT(t), 0), 0), tot = insp.reduce((a, c) => a + (c.cierre - c.registro), 0);
    let dentro = 0, n = 0; cs.forEach(c => c.tramos.forEach(t => { if (t.salida == null || t.salida <= w0 || t.salida > w1) return; const s = slaH(c, t.estado); if (s == null) return; n++; if (durSla(c, t, w1) <= s * 60) dentro++; }));
    return { enProceso: cs.filter(c => activo(c, w1)).length, cerradosPorDia: cerr.length / Math.max(1, (w1 - w0) / DIA), cicloMediana: q(ciclos, 0.5), cicloP90: q(ciclos, 0.9), eficiencia: tot ? trab / tot : null, sla: n ? dentro / n : null, retrabajo: cerr.length ? cerr.filter(c => c.retr).length / cerr.length : null, nCerr: cerr.length, nInsp: insp.length, nTramos: n };
  }
  SM.indicadores = indicadores;

  // Diagrama de flujo acumulado: casos por estado al cierre de cada día del período (+ cerrados acumulados desde el inicio).
  function cfd(cs, dias) { const A = eje(), n = A.now, w0 = ventana(dias).w0, out = [];
    for (let k = dias - 1; k >= 0; k--) { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() - k), fin = k === 0 ? n : new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59), b = A.toB(fin), cnt = { 'Cerrados': 0 };
      FLOW.forEach(e => { cnt[e] = 0; }); cs.forEach(c => { const e = enEstado(c, b); if (!e) return; if (FINALES.includes(e)) { if (c.cierre > w0) cnt['Cerrados']++; } else cnt[e] = (cnt[e] || 0) + 1; });
      out.push({ fecha: d, iso: isoD(d), b, habil: A.idx[isoD(d)] != null, cnt }); }
    return out; }
  SM.cfd = cfd;
  // Primer día de un ensanchamiento sostenido: la banda crece 3 días hábiles seguidos y no vuelve a bajar del nivel inicial.
  function ensanche(serie, e) { const hb = serie.filter(x => x.habil); let mejor = null;
    for (let i = 0; i + 3 < hb.length; i++) { const v = (j) => hb[j].cnt[e] || 0; if (!(v(i + 1) > v(i) && v(i + 2) > v(i + 1) && v(i + 3) > v(i + 2))) continue; let ok = true; for (let j = i + 1; j < hb.length; j++) if (v(j) <= v(i)) { ok = false; break; } if (!ok) continue;
      const pend = (v(hb.length - 1) - v(i)) / (hb.length - 1 - i); if (pend >= 0.5) { mejor = { estado: e, desde: hb[i + 1].fecha, iso: hb[i + 1].iso, b0: hb[i].b, ini: v(i), fin: v(hb.length - 1), dias: hb.length - 1 - i, pend }; break; } }
    return mejor; }

  // Utilización (trabajo de los tramos en la ventana + trabajo estimado de lo que espera al final) ÷ capacidad (dedicación × jornada × días hábiles sin ausencias).
  function utilizacion(cs, w0, w1, T) { const per = {}; const x = X();
    cs.forEach(c => c.tramos.forEach(t => { if (!t.rol || /Cliente/.test(t.rol) || !t.actor || t.actor === t.rol) return; const k = t.actor; per[k] = per[k] || { rol: t.rol, carga: 0, espera: 0 }; if (t.salida != null && t.salida > w0 && t.salida <= w1) per[k].carga += trabT(t); if (t.salida == null && t.entrada <= w1) { per[k].carga += (T[t.estado] || { t: 30 }).t; per[k].espera++; } }));
    const A = eje(); Object.keys(per).forEach(p => { let cap = 0; for (let b = Math.floor(w0 / DIA) * DIA; b < w1; b += DIA) { if (ausente(p, b + 1)) continue; cap += DIA * dedicacion(p, b + 1); } per[p].cap = cap; per[p].util = cap ? per[p].carga / cap : null; });
    const roles = {}; Object.entries(per).forEach(([p, v]) => { const r = roles[v.rol] = roles[v.rol] || { carga: 0, cap: 0, personas: [] }; r.carga += v.carga; r.cap += v.cap; r.personas.push(p); }); Object.values(roles).forEach(r => { r.util = r.cap ? r.carga / r.cap : null; });
    return { per, roles }; }

  // Análisis completo para unos filtros.
  SM.analizar = function (casosReales, filtros, alcance) {
    const fz = Object.assign({ periodo: '30' }, filtros || {}), key = SM.rev + '|' + (SM._extrasN || 0) + '|' + JSON.stringify(fz) + '|' + (alcance || '') + '|' + (casosReales || []).map(c => c.id + ':' + c.estado).join(',');
    if (SM._cache && SM._cache.key === key) return SM._cache.v;
    const A = eje(), T = tiempos(), M = D(), dias = +fz.periodo || 30, todos = SM.universo(casosReales), cs = todos.filter(c => pasa(c, fz, alcance));
    const W = ventana(dias), Wp = ventana(dias, 1), now = W.w1;
    const ind = indicadores(cs, W.w0, W.w1), prev = indicadores(cs, Wp.w0, Wp.w1);
    const serie = cfd(cs, dias), anchos = FLOW.map(e => ensanche(serie, e)).filter(Boolean).sort((a, b) => b.pend - a.pend);
    const util = utilizacion(cs, W.w0, W.w1, T), utilP = utilizacion(cs, Wp.w0, Wp.w1, T);
    // 16f-3b · la utilización que se informa (regla «Sobrecarga» y columna del rol) es la carga actual de Cargabilidad (próximos 5 días hábiles).
    const CA = SM.carga({ casos: cs }, SM._extras || null), cargaP = {}, cargaR = {}; CA.filas.forEach(r => { if (r.prom == null) return; cargaP[r.persona] = r.prom; (cargaR[r.rol] = cargaR[r.rol] || []).push(r.prom); });
    // Por estado
    const estados = FLOW.concat(['Reaperturado', 'Enlace caducado'].filter(e => cs.some(c => c.estado === e && !c.final))).map(e => {
      const tr = [], trP = [], ab = []; cs.forEach(c => c.tramos.forEach(t => { if (t.estado !== e) return; if (t.salida != null && t.salida > W.w0 && t.salida <= W.w1) tr.push([c, t]); if (t.salida != null && t.salida > Wp.w0 && t.salida <= Wp.w1) trP.push([c, t]); if (t.salida == null && !c.final) ab.push([c, t]); }));
      const ent = cs.reduce((a, c) => a + c.tramos.filter(t => t.estado === e && t.entrada > W.w0 && t.entrada <= W.w1).length, 0);
      const dur = tr.map(([c, t]) => durT(t, now) / 60), esp = tr.map(([c, t]) => espT(t, now) / 60), trb = tr.map(([c, t]) => trabT(t) / 60);
      const conSla = tr.filter(([c, t]) => slaH(c, t.estado) != null), fuera = conSla.filter(([c, t]) => durSla(c, t, now) > slaH(c, t.estado) * 60);
      const ratio = conSla.map(([c, t]) => durSla(c, t, now) / (slaH(c, t.estado) * 60));
      const slas = Array.from(new Set(cs.map(c => slaH(c, e)).filter(x => x != null))).sort((a, b) => a - b);
      const causas = {}; tr.concat(ab).forEach(([c, t]) => { const k = t.causa || 'prioridad'; causas[k] = (causas[k] || 0) + espT(t, now) / 60; });
      const rol = ROL[e], ur = cargaR[rol] ? { util: cargaR[rol].reduce((a, x) => a + x, 0) / cargaR[rol].length } : null;
      const sobreSla = ab.filter(([c, t]) => slaH(c, e) != null && durSla(c, t, now) > slaH(c, e) * 60).map(([c]) => c.id).concat(fuera.map(([c]) => c.id));
      return { estado: e, rol, ahora: ab.length, idsAhora: ab.map(([c]) => c.id), entradasDia: ent / Math.max(1, (W.w1 - W.w0) / DIA), salidasDia: tr.length / Math.max(1, (W.w1 - W.w0) / DIA),
        esperaMed: q(esp, 0.5), trabajoMed: q(trb, 0.5), p50: q(dur, 0.5), p85: q(dur, 0.85), p90: q(dur, 0.9), p90ratio: q(ratio, 0.9), slas, cumplimiento: conSla.length ? 1 - fuera.length / conSla.length : null,
        nTramos: tr.length, idsFuera: Array.from(new Set(sobreSla)), idsTramos: Array.from(new Set(tr.map(([c]) => c.id))), causas, causaPrincipal: Object.entries(causas).sort((a, b) => b[1] - a[1])[0], utilRol: ur ? ur.util : null,
        abiertos: ab.map(([c, t]) => ({ id: c.id, horas: durT(t, now) / 60, real: c.real, causa: t.causa, actor: t.actor })),
        mediaPorCaso: tr.length ? tr.reduce((a, [c, t]) => a + durT(t, now), 0) : 0, trP };
    });
    // Aporte al aumento del tiempo de ciclo (ley de Little, sin sesgo por los casos que siguen abiertos): tiempo que los casos pasan en el estado
    // (o en el traspaso) dentro del período ÷ casos cerrados del período; el aporte es su diferencia con el período anterior ÷ la diferencia total.
    const nC = (w) => Math.max(1, cs.filter(c => c.cierre != null && c.cierre > w.w0 && c.cierre <= w.w1).length);
    const solape = (a, b, w) => Math.max(0, Math.min(b, w.w1) - Math.max(a, w.w0));
    const tiempoEn = (w, fn) => cs.reduce((acc, c) => acc + c.tramos.reduce((s2, t, i) => s2 + fn(c, t, i, w), 0), 0) / nC(w);
    const enEst = (e) => (c, t, i, w) => t.estado === e ? solape(t.entrada, t.salida != null ? t.salida : now, w) : 0;
    const totalL = (w) => tiempoEn(w, (c, t, i, w2) => solape(t.entrada, t.salida != null ? t.salida : now, w2));
    const dCiclo = totalL(W) - totalL(Wp);
    const aporte = (fn) => dCiclo > 0 ? Math.max(0, (tiempoEn(W, fn) - tiempoEn(Wp, fn)) / dCiclo) : 0;
    const corte = A.corte((X().lotes || {}).desde || '16:00');
    // Traspasos entre roles (la espera del rol siguiente hasta su primera acción; no cuenta la espera externa del cliente)
    const tras = {}; cs.forEach(c => c.tramos.forEach((t, i) => { if (!i) return; const a = c.tramos[i - 1]; if (a.rol === t.rol || /Cliente/.test(t.rol) || /Cliente/.test(a.rol) || t.causa === 'externa') return; const k = a.rol + '→' + t.rol; const x = tras[k] = tras[k] || { de: a.rol, a: t.rol, eDe: a.estado, eA: t.estado, v: [], vp: [], ids: [], causas: {}, tr: [], claves: [] }; if (!x.claves.includes(a.estado + '→' + t.estado)) x.claves.push(a.estado + '→' + t.estado);
      const w = espT(t, now); if ((t.inicio != null ? t.inicio : now) > W.w0 && t.entrada <= W.w1) { x.v.push(w / 60); if (w > 240) x.ids.push(c.id); const kc = A.ofs(t.entrada) >= corte ? 'lotes' : t.causa; x.causas[kc] = (x.causas[kc] || 0) + w / 60; x.tr.push(t); } if (t.inicio != null && t.inicio > Wp.w0 && t.inicio <= Wp.w1) x.vp.push(w / 60); }));
    // Reglas
    const R = {}; (M.reglas || []).forEach(r => { R[r.id] = r; });
    const cuellos = [];
    const etapaCorta = (e) => { const et = F().etapaDe(e); return e === 'Pendiente calificación' ? 'Calificación' : e === 'Pendiente calificación de suscripción' ? 'Suscripción' : et ? et.nombre : e; };
    const principal = {}; { const tw = {}; cs.forEach(c => c.tramos.forEach(t => { if (t.salida == null || t.salida <= W.w0 || t.salida > W.w1) return; const k = t.actor + '|' + t.estado; tw[k] = (tw[k] || 0) + trabT(t); }));
      Object.entries(tw).sort((a, b) => b[1] - a[1]).forEach(([k]) => { const [p, e] = k.split('|'); if (!principal[p]) principal[p] = e; }); }
    estados.forEach(s => { const reglas = [];
      if (s.p90ratio != null && s.p90ratio >= 0.8) reglas.push({ id: 'slaEstado', sev: s.p90ratio > 1 ? 'alta' : 'media', detalle: 'p90 de ' + hTxt(s.p90) + ' frente a un SLA de ' + s.slas.map(x => x + ' h').join(' o ') + ' (' + pct(s.p90ratio) + ' del SLA)' });
      const an = anchos.find(a => a.estado === s.estado); if (an) { const entr = cs.reduce((a, c) => a + c.tramos.filter(t => t.estado === s.estado && t.entrada > an.b0 && t.entrada <= now).length, 0), sal = cs.reduce((a, c) => a + c.tramos.filter(t => t.estado === s.estado && t.salida != null && t.salida > an.b0 && t.salida <= now).length, 0), nd = Math.max(1, an.dias); an.netoDia = (entr - sal) / nd; an.entr = entr; an.sal = sal;
        reglas.push({ id: 'acumulacion', sev: 'alta', detalle: 'Desde el ' + dTxt(an.desde) + ' entran ' + num(an.netoDia) + ' casos por día hábil más de los que salen (' + an.ini + ' → ' + an.fin + ' casos)' }); }
      const per = Object.entries(cargaP).filter(([p, u]) => u > 0.85 && principal[p] === s.estado).sort((a, b) => b[1] - a[1]);
      per.forEach(([p, u]) => reglas.push({ id: 'utilizacion', sev: u > 1 ? 'alta' : 'media', detalle: p + ' al ' + pct(u) + ' de su capacidad (carga de los próximos 5 días hábiles)', persona: p }));
      if (!reglas.length) return;
      const fn = enEst(s.estado);
      cuellos.push({ id: 'estado:' + s.estado, tipo: 'estado', lugar: s.estado, titulo: s.estado, reglas, aporte: aporte(fn), ids: s.idsFuera.length ? s.idsFuera : s.idsAhora, criterio: s.idsFuera.length ? 'sobre el SLA' : 'casos ahora', causas: s.causas, estadoInfo: s, ancho: an || null }); });
    // Retrabajo y bucles (sobre los informes de inspector que pasan por calificación)
    const pasaCal = cs.filter(c => c.modalidad !== 'Autoinspección' && c.tramos.some(t => t.estado === 'Pendiente calificación' && t.salida != null && t.salida > W.w0 && t.salida <= W.w1));
    const devu = pasaCal.filter(c => c.tramos.some(t => t.estado === 'Pendiente calificación' && t.devolucion && t.salida > W.w0 && t.salida <= W.w1));
    const tasa = pasaCal.length ? devu.length / pasaCal.length : 0, bucles = cs.filter(c => c.devs > 2 && c.tramos.some(t => t.salida == null || t.salida > W.w0));
    if (tasa > 0.15 || bucles.length) { const mot = {}; devu.forEach(c => c.tramos.forEach(t => { if (t.devolucion) mot[t.devolucion] = (mot[t.devolucion] || 0) + 1; })); const conc = {}; devu.forEach(c => { const k = c.modalidad + ' · ' + c.sucursal; conc[k] = (conc[k] || 0) + 1; });
      const mp = Object.entries(mot).sort((a, b) => b[1] - a[1])[0], cp2 = Object.entries(conc).sort((a, b) => b[1] - a[1])[0], reglas = [];
      if (tasa > 0.15) reglas.push({ id: 'retrabajo', sev: 'media', detalle: pct(tasa) + ' de los informes de inspector que pasaron por calificación se devolvieron (' + devu.length + ' de ' + pasaCal.length + ')' });
      if (bucles.length) reglas.push({ id: 'bucle', sev: 'media', detalle: (bucles.length === 1 ? '1 caso repite' : bucles.length + ' casos repiten') + ' Pendiente calificación ↔ Devuelto al inspector más de 2 veces' });
      cuellos.push({ id: 'retrabajo', tipo: 'retrabajo', lugar: 'Devuelto al inspector', titulo: 'Retrabajo desde Devuelto al inspector', reglas, aporte: aporte(enEst('Devuelto al inspector')), ids: Array.from(new Set(devu.map(c => c.id).concat(bucles.map(c => c.id)))), criterio: 'devueltos', calidad: { motivo: mp ? mp[0] : '', motivoN: mp ? mp[1] : 0, conc: cp2 ? cp2[0] : '', concN: cp2 ? cp2[1] : 0, tasa, n: devu.length, de: pasaCal.length } }); }
    Object.values(tras).forEach(x => { const m = q(x.v, 0.5); if (m == null || m <= 4 || x.v.length < 5) return; const tit = 'Traspaso ' + rolCorto(x.de) + ' → ' + etapaCorta(x.eA);
      cuellos.push({ id: 'traspaso:' + x.de + '→' + x.a, tipo: 'traspaso', lugar: x.eA, titulo: tit, reglas: [{ id: 'traspaso', sev: m > 6 ? 'alta' : 'media', detalle: 'Mediana de ' + hTxt(m) + ' entre la salida de ' + rolCorto(x.de) + ' (' + listaY(Array.from(new Set(x.claves.map(k => k.split('→')[0])))) + ') y la primera acción en ' + x.eA + (x.vp.length ? ' (antes ' + hTxt(q(x.vp, 0.5)) + ')' : '') }],
        aporte: aporte((c, t, i, w) => i && x.claves.includes(c.tramos[i - 1].estado + '→' + t.estado) && t.causa !== 'externa' && (!x.causas.lotes || A.ofs(t.entrada) >= corte) ? solape(t.entrada, t.inicio != null ? t.inicio : now, w) : 0), ids: Array.from(new Set(x.ids)), criterio: 'traspaso de más de 4 h', causas: x.causas, mediana: m }); });
    const sevN = { alta: 2, media: 1 }; cuellos.forEach(c => { c.severidad = c.reglas.reduce((a, r) => sevN[r.sev] > sevN[a] ? r.sev : a, 'media'); });
    // A igual aporte en el mismo lugar, primero el retrabajo (explica por qué los casos vuelven a ese estado).
    cuellos.sort((a, b) => (a.lugar === b.lugar && Math.abs(b.aporte - a.aporte) < 0.005 && a.tipo !== b.tipo && (a.tipo === 'retrabajo' || b.tipo === 'retrabajo')) ? (a.tipo === 'retrabajo' ? -1 : 1) : (b.aporte - a.aporte || sevN[b.severidad] - sevN[a.severidad] || b.ids.length - a.ids.length));
    // Causa principal de cada cuello: la de más horas de espera que no explique ya un cuello anterior del mismo estado.
    const usadas = {}; cuellos.forEach(c => { if (c.tipo === 'retrabajo') { c.causa = 'calidad'; return; } const ya = usadas[c.lugar] || [], ord = Object.entries(c.causas || {}).filter(([k, v]) => v > 0).sort((a, b) => b[1] - a[1]); const elegido = (ord.find(([k]) => !ya.includes(k)) || ord[0] || ['prioridad'])[0]; c.causa = elegido; usadas[c.lugar] = ya.concat(elegido); });
    // Evidencia de la causa (Contención: quién concentra los casos en espera)
    cuellos.forEach(c => { if (c.tipo !== 'estado') return; const ab = c.estadoInfo.abiertos, porP = {}; ab.forEach(a => { porP[a.actor] = (porP[a.actor] || 0) + 1; }); const top = Object.entries(porP).sort((a, b) => b[1] - a[1])[0]; c.concentra = top ? { persona: top[0], n: top[1], de: ab.length } : null; });
    const trasL = Object.values(tras).filter(x => x.v.length).map(x => { const m = q(x.v, 0.5); return { de: x.de, a: x.a, eA: x.eA, titulo: rolCorto(x.de) + ' → ' + etapaCorta(x.eA), mediana: m, antes: x.vp.length ? q(x.vp, 0.5) : null, n: x.v.length, ids: x.ids, sev: m > 6 ? 'alta' : m > 4 ? 'media' : '' }; }).sort((a, b) => b.mediana - a.mediana);
    const v = { filtros: fz, W, Wp, ind, prev, serie, anchos, estados, cuellos, util, utilP, dCiclo, casos: cs, todos, tras: trasL, nReales: cs.filter(c => c.real).length, nGen: cs.filter(c => !c.real).length };
    SM._cache = { key, v }; return v;
  };


  // ---------- 16f-3b · Responsables, tareas, cargabilidad y simulación ----------
  const placeholder = (t) => !t.actor || t.actor === t.rol || /Cliente/.test(t.rol || '') || t.actor === 'Inspector';
  const usuarioDe = (n) => { const U = window.SIRIUS_USUARIOS; return U && U.usuarios ? U.usuarios.find(u => u.nombre === n) : null; };
  const parseIso = (s) => { const [d, t] = String(s).split('T'), [y, m, dd] = d.split('-').map(Number), [hh, mi] = (t || '00:00').split(':').map(Number); return new Date(y, m - 1, dd, hh, mi); };
  // Próximos días hábiles después del reloj (horizonte de Cargabilidad).
  function horizonte(n) { const f = F(), A = eje(), out = []; const d = new Date(A.now.getFullYear(), A.now.getMonth(), A.now.getDate()); for (let k = 0; k < 20 && out.length < n; k++) { d.setDate(d.getDate() + 1); if (f.esHabil(d)) out.push(new Date(d)); } return out; }
  SM.horizonte = horizonte;
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  // Capacidad de una persona en un día: jornada de Agenda (inspectores, menos 1 h de almuerzo) o la jornada hábil; menos bloqueos y ausencias.
  function capacidad(p, d) { const AG = window.SIRIUS_AGENDA || {}, f = F(), k = isoD(d), disp = (AG.disponibilidad || []).find(x => x.inspector === p), per = (X().personas || {})[p];
    if (per && (per.ausencias || []).some(([a, b]) => k >= a && k <= b)) return { cap: 0, ausente: (per.ausencias.find(([a, b]) => k >= a && k <= b) || [])[2] || 'Ausente' };
    let cap = f.calendario.horasDia || 8; if (disp) { if (!disp.dias.includes(d.getDay())) return { cap: 0, ausente: 'No laborable' }; cap = Math.max(0, (mmOf(disp.jornada[1]) - mmOf(disp.jornada[0])) / 60 - 1); }
    let motivo = ''; (AG.bloqueos || []).filter(b => b.inspector === p).forEach(b => { const a = String(b.desde).slice(0, 10), c = String(b.hasta).slice(0, 10); if (k < a || k > c) return; if (String(b.desde).length <= 10) { cap = 0; motivo = b.motivo; } else { const h0 = mmOf(String(b.desde).slice(11, 16)), h1 = mmOf(String(b.hasta).slice(11, 16)); cap = Math.max(0, cap - (h1 - h0) / 60); motivo = b.motivo + ' (parcial)'; } });
    return cap ? { cap, nota: motivo } : { cap: 0, ausente: motivo || 'Ausente' }; }
  // Disponibilidad que se muestra en Responsables: el próximo bloqueo o ausencia desde hoy.
  function disponibilidad(p) { const AG = window.SIRIUS_AGENDA || {}, hoy = isoD(eje().now), per = (X().personas || {})[p], L = [];
    (AG.bloqueos || []).filter(b => b.inspector === p && String(b.hasta).slice(0, 10) >= hoy).forEach(b => { const a = String(b.desde), c = String(b.hasta); L.push([a.slice(0, 10), b.motivo + ' ' + (a.length > 10 ? a.slice(8, 10) + '/' + a.slice(5, 7) + (+a.slice(11, 13) >= 12 ? ' tarde' : ' mañana') : a.slice(8, 10) + '–' + c.slice(8, 10) + '/' + c.slice(5, 7))]); });
    ((per || {}).ausencias || []).filter(([a, b]) => b >= hoy).forEach(([a, b, m]) => L.push([a, m + ' ' + a.slice(8, 10) + '–' + b.slice(8, 10) + '/' + b.slice(5, 7)]));
    L.sort((x, y) => x[0] < y[0] ? -1 : 1); return L.length ? L[0][1] : 'Disponible'; }

  // Tareas abiertas (por tipo de SIRIUS_MONITOR.tareas): las del flujo salen de la cronología; las de los módulos, de `extras.tareas` (Back-office);
  // honorarios, facturas y muestreo de control de los casos de ejemplo, de la calibración (prototipo).
  SM.tareas = function (v, extras) { const A = eje(), T = tiempos(), M = D(), x = X(), now = A.nowB, tipos = (M.tareas || {}).tipos || [], out = [], cs = v.casos, ids = new Set(cs.map(c => c.id)), Z = azar(D().generador.semilla + 7);
    const add = (tipo, c, resp, desde, sla, estado) => { if (!tipos.includes(tipo)) return; out.push({ tipo, caso: c.id, real: !!c.real, responsable: resp, rol: (usuarioDe(resp) || { roles: [''] }).roles[0], desde, horas: Math.max(0, (now - desde) / 60), slaH: sla, estado: estado || (c.final || c.estado) }); };
    cs.forEach(c => { const ab = c.final ? null : c.tramos.find(t => t.salida == null); if (!ab) return;
      if (ab.estado === 'Pendiente calificación' && c.modalidad === 'Autoinspección' && !c.real) add(tipos[0], c, ab.actor, ab.entrada, slaH(c, ab.estado), ab.estado);
      if (ab.estado === 'Devuelto al inspector' && !placeholder(ab)) add(tipos[1], c, ab.actor, ab.entrada, slaH(c, ab.estado), ab.estado);
      if ((ab.estado === 'Enlace caducado') || (ab.estado === 'Agendado' && c.modalidad === 'Autoinspección' && now - ab.entrada > 3 * DIA)) add(tipos[3], c, coordinador(c.sucursal), ab.entrada + (ab.estado === 'Agendado' ? 3 * DIA : 0), null, ab.estado); });
    const tx = x.tareas || {}; cs.filter(c => !c.real && c.final === 'Inspeccionado' && c.cierre > now - 10 * DIA).forEach(c => { Object.keys(tx).forEach(tipo => { const r = tx[tipo]; if (c.cierre <= now - r.dias * DIA) return; if (r.modalidad && !r.modalidad.includes(c.modalidad)) return; if (Z.r() < r.prob) add(tipo, c, r.responsable === 'ejecutivo' ? c.ejecutivo : r.responsable, c.cierre, null, 'Inspeccionado'); }); });
    ((extras || {}).tareas || []).forEach(t => { if (!ids.has(t.caso)) return; const c = cs.find(y => y.id === t.caso); add(t.tipo, c, t.responsable, A.toB(parseIso(t.desde)), t.slaH || null, t.estado); });
    out.forEach(t => { t.limite = (t.slaH != null ? t.slaH : 24); t.vencida = t.horas > t.limite; t.tramo = t.horas < 8 ? 0 : t.horas < 24 ? 1 : t.horas < 40 ? 2 : 3; });
    const filas = tipos.map(tipo => { const L = out.filter(t => t.tipo === tipo), porR = {}; L.forEach(t => { porR[t.responsable] = (porR[t.responsable] || 0) + 1; }); const top = Object.entries(porR).sort((a, b) => b[1] - a[1])[0];
      return { tipo, abiertas: L.length, tramos: [0, 1, 2, 3].map(k => L.filter(t => t.tramo === k).length), vencidas: L.filter(t => t.vencida).length, top: top ? top[0] + (top[1] > 1 ? ' (' + top[1] + ')' : '') : '—', ids: Array.from(new Set(L.map(t => t.caso))), idsVenc: Array.from(new Set(L.filter(t => t.vencida).map(t => t.caso))) }; });
    return { lista: out, filas, viejas: out.slice().sort((a, b) => b.horas - a.horas).slice(0, 5), vencidas: out.filter(t => t.vencida).length }; };

  // Carga de los próximos 5 días hábiles por persona: casos a cargo (trabajo mediano del estado; se reparten 5-4-3-2-1), llegadas esperadas
  // (las de los últimos 5 días hábiles), visitas (franja + traslado), tareas (30 min) y otras funciones (1 − dedicación).
  SM.carga = function (v, extras, mover) { const A = eje(), T = tiempos(), x = X(), now = A.nowB, dias = horizonte(5), tar = SM.tareas(v, extras).lista, per = {}, W5 = [5, 4, 3, 2, 1].map(w => w / 15), trasl = x.trasladoHoras != null ? x.trasladoHoras : 0.75;
    const ensure = (p, rol) => per[p] = per[p] || { persona: p, rol, casos: [], lleg: [], visitas: dias.map(() => 0), tareas: 0 };
    v.casos.forEach(c => c.tramos.forEach(t => { if (placeholder(t)) return; if (t.salida == null && !c.final) { const r = ensure(t.actor, t.rol); r.casos.push({ id: c.id, estado: t.estado, desde: t.entrada, h: ((T[t.estado] || { t: 30 }).t) / 60, real: c.real }); if (t.estado === 'Agendado' && c.modalidad !== 'Autoinspección') { const k = hash(c.id) % 5; r.visitas[k] += 1 + trasl; } }
      if (t.entrada > now - 5 * DIA && t.entrada <= now && !(t.rol === 'Inspector' && ['Agendado', 'En curso'].includes(t.estado))) ensure(t.actor, t.rol).lleg.push({ id: c.id, h: ((T[t.estado] || { t: 30 }).t) / 60 / 5 }); }));
    ((extras || {}).visitas || []).forEach(vi => { const k = dias.findIndex(d => isoD(d) === vi.fecha); if (k < 0 || !vi.inspector) return; const r = ensure(vi.inspector, 'Inspector'); r.visitas[k] += Math.max(0.5, (mmOf(vi.hFin || '10:00') - mmOf(vi.hIni || '09:00')) / 60) + trasl; });
    tar.forEach(t => { if (per[t.responsable]) per[t.responsable].tareas += 0.5; });
    if (mover && per[mover.de] && per[mover.a]) { const L = per[mover.de].casos.filter(c => c.estado === mover.estado).sort((a, b) => a.desde - b.desde).slice(0, mover.n); per[mover.de].casos = per[mover.de].casos.filter(c => !L.includes(c)); per[mover.a].casos = per[mover.a].casos.concat(L); const ids = L.map(c => c.id), LL = per[mover.de].lleg.filter(x => ids.includes(x.id)); per[mover.de].lleg = per[mover.de].lleg.filter(x => !ids.includes(x.id)); per[mover.a].lleg = per[mover.a].lleg.concat(LL); }
    Object.values(per).forEach(r => { r.llegadas = r.lleg.reduce((a, x) => a + x.h, 0); });
    const filas = Object.values(per).filter(r => r.rol && r.rol !== 'Cliente (autoinspección)').map(r => { const pp = (X().personas || {})[r.persona], ded = pp ? dedicacion(r.persona, now) : 1, otras = (1 - ded) * 8, back = r.casos.reduce((a, c) => a + c.h, 0);
      const celdas = dias.map((d, k) => { const cp = capacidad(r.persona, d); if (!cp.cap) return { dia: d, ausente: cp.ausente }; const carga = otras + back * W5[k] + r.llegadas + r.visitas[k] + r.tareas / 5; return { dia: d, carga, cap: cp.cap, pct: carga / cp.cap, nota: cp.nota || '' }; });
      const val = celdas.filter(c => !c.ausente), prom = val.length ? val.reduce((a, c) => a + c.pct, 0) / val.length : null;
      return { persona: r.persona, rol: r.rol, celdas, prom, casos: r.casos, otras, nota: pp && pp.nota ? pp.nota : '' }; });
    const orden = ['Ejecutivo de inspecciones', 'Coordinador de inspecciones', 'Inspector', 'Suscriptor'];
    filas.sort((a, b) => orden.indexOf(a.rol) - orden.indexOf(b.rol) || (b.prom || 0) - (a.prom || 0));
    return { dias, filas }; };

  const ESTADO_ROL = { 'Ejecutivo de inspecciones': 'Pendiente calificación', 'Coordinador de inspecciones': 'En coordinación', 'Suscriptor': 'Pendiente calificación de suscripción', 'Inspector': 'Devuelto al inspector' };
  SM.ESTADO_ROL = ESTADO_ROL;
  // Simulación: mover N casos (los más antiguos del estado del rol) de una persona a otra del mismo rol y alcance. Espera estimada del estado con la
  // ley de Little por persona: casos en espera ÷ casos que puede cerrar por día (horas libres del día ÷ trabajo mediano), ponderada por casos.
  SM.destinosDe = function (v, extras, p, rol) { const C = SM.carga(v, extras), o = C.filas.find(r => r.persona === p); if (!o) { const SU = window.SiriusUsuarios, uo = usuarioDe(p), al = (u) => !u || !u.alcance || u.alcance.sucursales === 'Todas' ? 'Todas' : u.alcance.sucursales; return SU && SU.destinos && rol ? SU.destinos(rol, p).filter(u => { const a1 = al(uo), a2 = al(u); return a1 === 'Todas' || a2 === 'Todas' || a1.some(x => a2.includes(x)); }).map(u => u.nombre) : []; } const uo = usuarioDe(p), al = (u) => !u || !u.alcance || u.alcance.sucursales === 'Todas' ? 'Todas' : u.alcance.sucursales;
    return C.filas.filter(r => r.persona !== p && r.rol === o.rol && (() => { const a1 = al(uo), a2 = al(usuarioDe(r.persona)); return a1 === 'Todas' || a2 === 'Todas' || a1.some(x => a2.includes(x)); })()).map(r => r.persona); };
  SM.simular = function (v, extras, n, de, a) { const T = tiempos(), C0 = SM.carga(v, extras), o = C0.filas.find(r => r.persona === de), d = C0.filas.find(r => r.persona === a); if (!o || !d) return null; const est = ESTADO_ROL[o.rol] || 'Pendiente calificación', t = ((T[est] || { t: 54 }).t) / 60;
    const mov = o.casos.filter(c => c.estado === est).sort((x, y) => x.desde - y.desde).slice(0, n), C1 = SM.carga(v, extras, { de, a, n, estado: est }), o1 = C1.filas.find(r => r.persona === de), d1 = C1.filas.find(r => r.persona === a);
    const ritmo = (r) => { const vals = r.celdas.filter(c => !c.ausente); const libre = vals.length ? vals.reduce((s2, c) => s2 + Math.max(0.5, c.cap - r.otras), 0) / vals.length : 1; return Math.max(0.1, libre / t); };
    const esperaDe = (qs) => { const tot = qs.reduce((s2, x) => s2 + x.q, 0) || 1; return qs.reduce((s2, x) => s2 + x.q * (x.q / x.r), 0) / tot * 8; };
    const qo = o.casos.filter(c => c.estado === est).length, qd = d.casos.filter(c => c.estado === est).length, otros = C0.filas.filter(r => r.rol === o.rol && r.persona !== de && r.persona !== a).map(r => ({ q: r.casos.filter(c => c.estado === est).length, r: ritmo(r) }));
    const antes = esperaDe([{ q: qo, r: ritmo(o) }, { q: qd, r: ritmo(d) }].concat(otros)), despues = esperaDe([{ q: qo - mov.length, r: ritmo(o) }, { q: qd + mov.length, r: ritmo(d) }].concat(otros));
    return { de, a, n: mov.length, estado: est, ids: mov.map(c => c.id), cargaDe: [o.prom, o1.prom], cargaA: [d.prom, d1.prom], espera: [antes, despues], filas: C1.filas, dias: C1.dias }; };

  // Responsables y SLA: por persona (solo los tramos en que era responsable), por rol, traspasos y devoluciones o reaperturas.
  SM.responsables = function (v, extras) { const A = eje(), now = A.nowB, f = F(), W = v.W, Wp = v.Wp, C = SM.carga(v, extras), per = {};
    const R = (p, rol) => per[p] = per[p] || { persona: p, rol, aCargo: [], venc: [], porVencer: [], sla: [0, 0], slaP: [0, 0], aten: [], cerr: 0, cerrP: 0, ids: new Set(), fuera: [] };
    v.casos.forEach(c => c.tramos.forEach(t => { if (placeholder(t)) return; const r = R(t.actor, t.rol), s = slaH(c, t.estado);
      if (t.salida == null && !c.final) { r.aCargo.push(c.id); if (s != null) { const d = durSla(c, t, now) / 60; if (d > s) r.venc.push(c.id); else if (s - d <= (f.porVencerHoras || 4)) r.porVencer.push(c.id); } }
      if (t.salida != null && t.salida > W.w0 && t.salida <= W.w1) { r.cerr++; r.ids.add(c.id); if (s != null) { r.sla[1]++; if (durSla(c, t, now) <= s * 60) r.sla[0]++; else r.fuera.push(c.id); } }
      if (t.salida != null && t.salida > Wp.w0 && t.salida <= Wp.w1) { r.cerrP++; if (s != null) { r.slaP[1]++; if (durSla(c, t, now) <= s * 60) r.slaP[0]++; } }
      if (t.rol !== 'Inspector' && t.causa !== 'externa' && t.inicio != null && t.inicio > W.w0 && t.inicio <= W.w1) r.aten.push(espT(t, now) / 60); }));
    const dd = Math.max(1, (W.w1 - W.w0) / DIA), ddp = Math.max(1, (Wp.w1 - Wp.w0) / DIA);
    const filas = Object.values(per).filter(r => r.aCargo.length || r.cerr).map(r => { const cg = C.filas.find(x => x.persona === r.persona); return { persona: r.persona, rol: r.rol, aCargo: r.aCargo, vencidos: r.venc, porVencer: r.porVencer, cumplimiento: r.sla[1] ? r.sla[0] / r.sla[1] : null, cumplimientoP: r.slaP[1] ? r.slaP[0] / r.slaP[1] : null, atencion: r.rol === 'Inspector' ? null : q(r.aten, 0.5), cerradosDia: r.cerr / dd, cerradosDiaP: r.cerrP / ddp, carga: cg ? cg.prom : null, disponibilidad: disponibilidad(r.persona), idsPeriodo: Array.from(r.ids), fuera: Array.from(new Set(r.fuera)) }; });
    const orden = ['Ejecutivo de inspecciones', 'Coordinador de inspecciones', 'Inspector', 'Suscriptor']; filas.sort((a, b) => orden.indexOf(a.rol) - orden.indexOf(b.rol) || b.aCargo.length - a.aCargo.length);
    const roles = orden.map(rol => { const L = Object.values(per).filter(r => r.rol === rol), s0 = L.reduce((a, r) => a + r.sla[0], 0), s1 = L.reduce((a, r) => a + r.sla[1], 0), p0 = L.reduce((a, r) => a + r.slaP[0], 0), p1 = L.reduce((a, r) => a + r.slaP[1], 0); return { rol, cumplimiento: s1 ? s0 / s1 : null, cumplimientoP: p1 ? p0 / p1 : null, n: s1, fuera: Array.from(new Set(L.reduce((a, r) => a.concat(r.fuera), []))) }; }).filter(r => r.n);
    // Devoluciones por inspector (informes que volvieron) y reaperturas por coordinador.
    const dev = {}; v.casos.forEach(c => c.tramos.forEach((t, i) => { if (t.estado !== 'En curso' || placeholder(t) || t.salida == null || t.salida <= W.w0 || t.salida > W.w1) return; const d = dev[t.actor] = dev[t.actor] || { persona: t.actor, tipo: 'devueltos', n: 0, de: 0, ids: [] }; d.de++; if (c.tramos.slice(i + 1).some(x => x.estado === 'Devuelto al inspector')) { d.n++; d.ids.push(c.id); } }));
    const rea = {}; v.casos.forEach(c => c.tramos.forEach(t => { if (t.estado !== 'Reaperturado' || t.entrada <= W.w0) return; const k = coordinador(c.sucursal), d = rea[k] = rea[k] || { persona: k, tipo: 'reaperturas', n: 0, de: 0, ids: [] }; d.n++; d.ids.push(c.id); }));
    Object.values(rea).forEach(d => { d.de = v.casos.filter(c => c.final && c.cierre > W.w0).length; });
    const retrab = Object.values(dev).filter(d => d.n).sort((a, b) => b.n / b.de - a.n / a.de).concat(Object.values(rea));
    return { filas, roles, traspasos: (v.tras || []).slice(0, 4), retrab }; };
  // ---------- Formatos ----------
  const num = (n, d) => n == null || isNaN(n) ? '—' : n.toLocaleString('es-EC', { minimumFractionDigits: d == null ? 1 : d, maximumFractionDigits: d == null ? 1 : d });
  const pct = (r) => r == null || isNaN(r) ? '—' : Math.round(r * 100) + ' %';
  const hTxt = (hh) => hh == null || isNaN(hh) ? '—' : hh >= 8 ? num(hh / 8) + ' d' : num(hh) + ' h';
  const dTxt = (d) => z(d.getDate()) + '/' + z(d.getMonth() + 1);
  const listaY = (a) => { a = a.slice(); if (a.length <= 1) return a.join(''); const u = a.pop(); return a.join(', ') + ' y ' + u; };
  const rolCorto = (r) => ({ 'Coordinador de inspecciones': 'Coordinación', 'Ejecutivo de inspecciones': 'Calificación', 'Inspector': 'Inspector', 'Suscriptor': 'Suscripción' }[r] || r);
  SM.fmt = { num, pct, hTxt, dTxt, rolCorto };

  // ---------- Casos de la Bandeja (los de la cronología de ejemplo solo se ven con un filtro del Monitor) ----------
  SM.esEjemplo = (id) => !!(SM._gen && SM._gen.some(c => c.id === id));
  SM.casoBandeja = function (id) { const c = (SM._gen || []).find(x => x.id === id); if (!c) return null; const A = eje(), f = F(), ab = c.tramos.find(t => t.salida == null) || null;
    let slaInfo = null; if (ab && !c.final) { const s = slaH(c, ab.estado); if (s != null) { const ini = ab.estado === 'En coordinación' ? (c.tramos.find(t => t.estado === 'Registrado') || ab).entrada : ab.entrada, d0 = A.fromB(ini), vence = f.sumarHabiles(d0, s * 60, c.sucursal), now = A.now, m = vence >= now ? f.minutosHabiles(now, vence, c.sucursal) : -f.minutosHabiles(vence, now, c.sucursal); slaInfo = Object.assign({ horas: m / 60, vence, etapa: (f.etapaDe(ab.estado) || {}).nombre }, f.formato(m / 60, vence)); } }
    return { id: c.id, ejemplo: true, orden: '', ramo: c.ramo, broker: c.broker, asegurado: c.asegurado, ident: '', placa: c.placa || '', bien: c.grupo === 'Vehículos' ? '' : 'Riesgo de ' + c.ramo.toLowerCase(), fecha: isoD(A.fromB(c.registro)), sucursal: c.sucursal, ejecutivo: c.ejecutivo, backoffice: c.ejecutivo,
      estado: c.final || c.estado, responsable: ab && !c.final ? ab.actor : '—', comercial: '', origen: 'Manual', flujoId: c.flujo, flujoVersion: c.version, flujoNombre: '', tipoRiesgo: c.grupo === 'Vehículos' ? 'Vehículos' : '', slaInfo, sla: slaInfo ? slaInfo.horas : null, modalidad: c.modalidad }; };
  // Cronología de un caso (para la ventana «Cronología»): cada tramo con entrada, inicio y fin del trabajo, actor, rol, espera y causa.
  const tsTxt = (s) => s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(2, 4) + ' · ' + s.slice(11, 16);
  SM.cronologia = function (id, casosReales) { const c = SM.universo(casosReales || SM._ultimosReales || []).find(x => x.id === id); if (!c) return null; const A = eje(), M = D(), fecha = (b, fin) => { const d = A.fromB(b, fin); return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(2) + ' · ' + z(d.getHours()) + ':' + z(d.getMinutes()); };
    const nomC = (k) => ((M.causas || []).find(x => x.id === k) || { nombre: k === 'calidad' ? 'Calidad' : k || '—' }).nombre;
    return { caso: c, filas: c.tramos.map(t => ({ estado: t.estado, entrada: t.entradaTs ? tsTxt(t.entradaTs) : fecha(t.entrada), inicio: t.inicioTs ? tsTxt(t.inicioTs) : t.inicio != null ? fecha(t.inicio) : t.salida == null ? 'Aún no empieza' : fecha(t.salida, true), fin: t.finTs ? tsTxt(t.finTs) : t.salida != null ? fecha(t.salida, true) : 'En curso', actor: t.actor, rol: t.rol, espera: hTxt(espT(t, A.nowB) / 60), trabajo: t.trabajoReal != null ? t.trabajoReal + ' min (en la sesión)' : t.salida != null ? hTxt(trabT(t) / 60) : '—', causa: nomC(t.causa), devolucion: t.devolucion || '' })),
      cierre: c.cierre != null ? (c.final === 'Cancelado' ? 'Cancelado el ' : 'Inspeccionado el ') + fecha(c.cierre, true) : '' }; };

  // ---------- Campana: cuellos de severidad alta ----------
  SM.detectar = function (casosReales, ts) { if (SM._detectado) return SM.campana; SM._detectado = true; SM._ultimosReales = casosReales;
    const v = SM.analizar(casosReales, { periodo: '30' }), U = window.SIRIUS_USUARIOS, M = D();
    v.cuellos.filter(c => c.severidad === 'alta').forEach(c => { const cnt = {}; c.ids.forEach(id => { const k = (v.casos.find(x => x.id === id) || {}).sucursal; if (k) cnt[k] = (cnt[k] || 0) + 1; }); const ord = Object.entries(cnt).sort((a, b) => b[1] - a[1]), tot = c.ids.length || 1, sucs = ord.filter(([k, n]) => n / tot >= 0.2).map(([k]) => k).concat(ord.length && ord[0][1] / tot < 0.2 ? [ord[0][0]] : []);
      const causa = c.causa === 'calidad' ? 'calidad del informe' : ((M.causas || []).find(x => x.id === c.causa) || { nombre: c.causa }).nombre.toLowerCase();
      const text = 'Cuello de botella alto en «' + c.titulo + '»: ' + causa + (c.aporte ? ' · ' + pct(c.aporte) + ' del aumento del tiempo de ciclo' : '') + '.';
      SM.campana.unshift({ id: 'mon-' + c.id + '-adm', aud: 'Administrador', kind: 'monitor', text, ts, read: false, monId: c.id });
      ((U && U.usuarios) || []).filter(u => u.estado === 'Activo' && (u.roles || []).includes('Coordinador de inspecciones') && (u.alcance && (u.alcance.sucursales === 'Todas' || (u.alcance.sucursales || []).some(x => sucs.includes(x))))).forEach(u => {
        SM.campana.unshift({ id: 'mon-' + c.id + '-' + u.nombre, aud: 'Coordinador de inspecciones', user: u.nombre, kind: 'monitor', text: text.replace('.', '') + ' · sucursales ' + listaY(sucs.filter(x => u.alcance.sucursales === 'Todas' || u.alcance.sucursales.includes(x))) + '.', ts, read: false, monId: c.id }); }); });
    return SM.campana; };

  // ---------- Interfaz ----------
  const C = { strong: 'var(--text-strong)', body: 'var(--text-body)', muted: 'var(--text-muted)', borde: 'var(--border-subtle)', brand: 'var(--color-brand)', danger: 'var(--color-danger, #9E1B0E)', success: 'var(--color-success, #4C8C1E)', link: 'var(--text-link, #0B5CAD)' };
  const SERIE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948']; // paleta categórica validada (orden fijo por estado o causa)
  const GRIS = '#B4B4B4', ROJO = '#9E1B0E';
  const sr = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };
  const Btn = (variant, txt, onClick, extra) => { const B = NS().Button; return B ? h(B, Object.assign({ variant, size: 'sm', onClick }, extra || {}), txt) : h('button', Object.assign({ type: 'button', onClick }, extra || {}), txt); };
  const Badge = (tone, txt) => { const B = NS().Badge; return B ? h(B, { tone }, txt) : h('span', null, txt); };
  const linkBtn = (txt, onClick, extra) => { const x = Object.assign({}, extra || {}), st = x.style || {}; delete x.style; return h('button', Object.assign({ type: 'button', onClick }, x, { style: Object.assign({ border: 'none', background: 'transparent', padding: 0, color: C.link, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 13, textAlign: 'left' }, st) }), txt); };
  const panel = (id, titulo, sub, acciones, ...hijos) => h('section', { id, tabIndex: -1, 'aria-labelledby': id + '-t', style: { outline: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1px solid ' + C.borde, borderRadius: 'var(--radius-md, 12px)', background: '#FFFFFF', minWidth: 0 } },
    h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '4px 12px' } }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 240px' } }, h('h3', { id: id + '-t', style: { margin: 0, fontSize: 17, color: C.strong } }, titulo), sub ? h('p', { style: { margin: 0, fontSize: 13, color: C.muted, textWrap: 'pretty' } }, sub) : null), acciones || null), ...hijos);
  const VISTAS = () => (D().vistas || ['Resumen', 'Etapas y cuellos', 'Responsables y SLA', 'Tareas', 'Cargabilidad']);
  const corta = (e) => { const x = F() && F().estado ? F().estado(e) : null; return x && x.corta ? x.corta : e; };
  const causaNom = (k) => ((D().causas || []).find(x => x.id === k) || { nombre: k || '—' }).nombre;
  const ESPERAS = () => (D().causas || []).filter(x => x.id !== 'calidad').map(x => x.id); // «Calidad (retrabajo)» no es una espera
  const SUAVE = { ok: ['#e7f4ee', '#1f7a5c'], warn: ['#fdf3dc', '#9a6400'], bad: ['#fdecea', '#b42318'], info: ['#e8eef6', '#3d5a80'] };
  const chip = (tono, txt, extra) => h('span', Object.assign({ style: { display: 'inline-block', borderRadius: 999, padding: '2px 9px', fontSize: 12, fontWeight: 800, background: SUAVE[tono][0], color: SUAVE[tono][1], whiteSpace: 'nowrap' } }, extra || {}), txt);
  const tonoPct = (r) => r == null ? 'info' : r >= 0.9 ? 'ok' : r >= 0.75 ? 'warn' : 'bad';
  const medidor = (r) => h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' } }, h('span', { 'aria-hidden': 'true', style: { width: 90, height: 8, borderRadius: 4, background: '#eef2f6', overflow: 'hidden', display: 'inline-block' } }, h('i', { style: { display: 'block', height: '100%', width: Math.min(100, Math.round((r || 0) * 100)) + '%', background: r > 1 ? '#b42318' : r > 0.85 ? '#d99a00' : '#1f7a5c' } })), pct(r));
  const CALOR = (x) => x == null ? '#e3e8ee' : x > 1 ? '#b42318' : x > 0.85 ? '#f6c3be' : x >= 0.7 ? '#fbe3b0' : '#cfe9dc';
  const causaReg = (k) => ((D().causas || []).find(x => x.id === k) || { regla: '' }).regla;

  // Escenas: vista inicial, filtros, cuello abierto y foco.
  const ESC = { monitor: {}, monitorcfd: { foco: '#mon-cfd-marca' }, monitorcuello: { cuello: 0, foco: '#mon-cuello-0-casos' }, monitoretapas: { vista: 1 }, monitoraging: { vista: 1, foco: '#mon-aging' }, monitorcausas: { vista: 1, foco: '#mon-causas' }, monitorfiltro: { filtros: { grupo: 'Vehículos', modalidad: 'Autoinspección' } },
    monitorresp: { vista: 2 }, monitorrol: { vista: 2, foco: '#mon-roles' }, monitortareas: { vista: 3 }, monitorviejas: { vista: 3, foco: '#mon-viejas' }, monitorcarga: { vista: 4 }, monitorsim: { vista: 4, sim: { n: 5, de: 'Verónica Lema', a: 'Daniela Ruiz', ver: true }, foco: '#mon-sim-res' } };
  SM.ESC = ESC;

  const pp = (d) => Math.round(d * 100) + ' pp', TRAMO_C = ['#cfe9dc', '#fbe3b0', '#f6c3be', '#b42318'];
  function Vista(p) {
    const e0 = ESC[p.escena] || {};
    const [vista, setVista] = R().useState(e0.vista || 0), [fz, setFz] = R().useState(Object.assign({ periodo: '30', grupo: 'Todos', sucursal: 'Todas', modalidad: 'Todas', version: 'Todas' }, e0.filtros || {}));
    const [abierto, setAbierto] = R().useState(e0.cuello != null ? e0.cuello : null), [cfdTabla, setCfdTabla] = R().useState(false), [cauTabla, setCauTabla] = R().useState(false), [hov, setHov] = R().useState(null), [todos, setTodos] = R().useState(false), [anchos, setAnchos] = R().useState({}), [sim, setSim] = R().useState(e0.sim || { n: 5, de: '', a: '', ver: false }), [reas, setReas] = R().useState(null), [cauEst, setCauEst] = R().useState(false);
    R().useEffect(() => { const med = () => { const o = {}; ['mon-cfd-lienzo', 'mon-aging-lienzo'].forEach(id => { const el = document.getElementById(id); if (el) o[id] = Math.round(el.clientWidth); }); setAnchos(a => (a['mon-cfd-lienzo'] === o['mon-cfd-lienzo'] && a['mon-aging-lienzo'] === o['mon-aging-lienzo']) ? a : o); }; med(); const RO = window.ResizeObserver ? new ResizeObserver(med) : null; ['mon-cfd-lienzo', 'mon-aging-lienzo'].forEach(id => { const el = document.getElementById(id); if (el && RO) RO.observe(el); }); window.addEventListener('resize', med); return () => { if (RO) RO.disconnect(); window.removeEventListener('resize', med); }; });
    const irN = R().useRef(window.__siriusMonIrN != null ? window.__siriusMonIrN : null);
    R().useEffect(() => { if (!e0.foco) return; const go = () => { const el = document.querySelector(e0.foco); if (el && document.activeElement !== el) { el.scrollIntoView({ block: 'center' }); el.focus && el.focus({ preventScroll: true }); } }; const t1 = setTimeout(go, 600), t2 = setTimeout(go, 1600); return () => { clearTimeout(t1); clearTimeout(t2); }; }, []);
    R().useEffect(() => { const ir = p.ir; if (ir && ir.n !== irN.current) { irN.current = ir.n; window.__siriusMonIrN = ir.n; setVista(0); const k = v.cuellos.findIndex(c => c.id === ir.cuello); setAbierto(k >= 0 ? k : null); setTimeout(() => { const el = document.getElementById('mon-cuello-' + (k >= 0 ? k : 0)); if (el) { el.scrollIntoView({ block: 'center' }); el.focus && el.focus({ preventScroll: true }); } }, 300); } });
    const reales = p.casos || []; SM._ultimosReales = reales; if (p.extras !== SM._extras) { SM._extras = p.extras || null; SM._extrasN = (SM._extrasN || 0) + 1; }
    const v = SM.analizar(reales, fz, p.alcance), A = eje(), M = D(), op = SM.opciones(v.todos, p.alcance);
    const ctx = [fz.grupo !== 'Todos' ? fz.grupo : '', fz.sucursal !== 'Todas' ? fz.sucursal : '', fz.modalidad !== 'Todas' ? fz.modalidad : '', fz.version !== 'Todas' ? fz.version : '', fz.periodo !== '30' ? 'últimos ' + fz.periodo + ' días' : ''].filter(Boolean);
    const ir = (que, ids) => { if (!p.onBandeja) return; p.onBandeja({ titulo: 'Monitor: ' + que + (ctx.length ? ' · ' + ctx.join(' · ') : ''), ids: Array.from(new Set(ids)) }); };
    const fd = (d) => z(d.getDate()) + '/' + z(d.getMonth() + 1);
    const perTxt = fd(v.W.ini) + '–' + fd(v.W.fin), prevTxt = fd(v.Wp.ini) + '–' + fd(v.Wp.fin);
    const sel = (id, label, k, opts) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, flex: '0 1 190px', minWidth: 120 } }, h('label', { htmlFor: id, style: { fontSize: 12, fontWeight: 700, color: C.muted } }, label),
      h('select', { id, value: fz[k], onChange: (ev) => { setFz(Object.assign({}, fz, { [k]: ev.target.value })); setAbierto(null); }, style: { height: 36, minWidth: 0, width: '100%', padding: '0 8px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 10, background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: C.strong } }, opts.map(o => Array.isArray(o) ? h('option', { key: o[0], value: o[0] }, o[1]) : h('option', { key: o, value: o }, o))));
    const filtros = h('div', { role: 'search', 'aria-label': 'Filtros del Monitor', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '8px 10px', padding: '10px 12px', border: '1px solid ' + C.borde, borderRadius: 12, background: '#fafcfe' } },
      sel('mon-f-periodo', 'Período', 'periodo', op.periodo), sel('mon-f-grupo', 'Grupo de ramo', 'grupo', op.grupo), sel('mon-f-sucursal', 'Sucursal', 'sucursal', op.sucursal), sel('mon-f-modalidad', 'Modalidad', 'modalidad', op.modalidad), sel('mon-f-version', 'Versión del flujo', 'version', op.version),
      h('p', { id: 'mon-meta', style: { margin: 0, flex: '1 1 240px', textAlign: 'right', fontSize: 12, color: C.muted, textWrap: 'pretty' } }, 'Comparado con ' + prevTxt + ' (período anterior de igual duración) · actualizado el ' + z(A.now.getDate()) + '/' + z(A.now.getMonth() + 1) + '/' + String(A.now.getFullYear()).slice(2) + ' · ' + z(A.now.getHours()) + ':' + z(A.now.getMinutes()) + ' · ' + v.nReales + ' casos actuales y ' + v.nGen + ' de la cronología de ejemplo (prototipo)'));
    const TT = SM.tareas(v, p.extras), badges = { 1: v.cuellos.filter(c => c.severidad === 'alta').length, 3: TT.vencidas };
    // Pestañas internas (vistas)
    const tabs = h('div', { role: 'tablist', 'aria-label': 'Vistas del Monitor', style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, VISTAS().map((t, i) => h('button', { key: t, id: 'mon-v-' + i, role: 'tab', type: 'button', 'aria-selected': vista === i ? 'true' : 'false', 'aria-controls': 'mon-panel', tabIndex: vista === i ? 0 : -1, onClick: () => setVista(i),
      onKeyDown: (ev) => { const n = VISTAS().length; if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { const k = (i + (ev.key === 'ArrowRight' ? 1 : n - 1)) % n; setVista(k); setTimeout(() => { const b = document.getElementById('mon-v-' + k); if (b) b.focus(); }, 0); } },
      style: { height: 36, padding: '0 14px', borderRadius: 999, border: '1.5px solid ' + (vista === i ? 'var(--color-brand)' : C.borde), background: vista === i ? 'var(--color-brand-wash, #E6F7FD)' : '#FFFFFF', color: C.strong, fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: vista === i ? 700 : 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 } }, t, badges[i] ? h('span', { 'aria-label': i === 1 ? '(' + badges[i] + ' cuellos de severidad alta)' : '(' + badges[i] + ' tareas vencidas)', style: { display: 'inline-grid', placeItems: 'center', minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px', background: '#b42318', color: '#FFFFFF', fontSize: 11, fontWeight: 800 } }, String(badges[i])) : null)));
    let cuerpo;
    cuerpo = vista === 0 ? resumen() : vista === 1 ? etapas() : vista === 2 ? responsablesV() : vista === 3 ? tareasV() : cargaV();
    return h('div', { id: 'mon-root', style: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 } }, tabs, filtros, reas ? reasModal() : null, h('div', { id: 'mon-panel', role: 'tabpanel', 'aria-labelledby': 'mon-v-' + vista, style: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 } }, cuerpo));

    // ----- Resumen -----
    function resumen() {
      const I = v.ind, Pv = v.prev, cerr = v.casos.filter(c => c.cierre != null && c.cierre > v.W.w0 && c.cierre <= v.W.w1), insp = cerr.filter(c => c.final === 'Inspeccionado');
      const ciclo = (c) => (c.cierre - c.registro) / 60;
      const kpis = [
        { id: 'enProceso', titulo: 'En proceso', valor: String(I.enProceso), dif: I.enProceso - Pv.enProceso, peor: I.enProceso > Pv.enProceso, txt: (d) => (d > 0 ? '+' : '−') + Math.abs(d) + (Math.abs(d) === 1 ? ' caso' : ' casos'), ids: v.casos.filter(c => c.registro <= v.W.w1 && !(c.cierre != null && c.cierre <= v.W.w1)).map(c => c.id), que: 'En proceso · casos activos' },
        { id: 'cerradosPorDia', titulo: 'Cerrados por día', valor: num(I.cerradosPorDia), dif: I.cerradosPorDia - Pv.cerradosPorDia, peor: I.cerradosPorDia < Pv.cerradosPorDia, txt: (d) => (d > 0 ? '+' : '−') + num(Math.abs(d)), ids: cerr.map(c => c.id), que: 'Cerrados en el período' },
        { id: 'cicloMediana', titulo: 'Tiempo de ciclo · mediana', valor: hTxt(I.cicloMediana), dif: (I.cicloMediana || 0) - (Pv.cicloMediana || 0), peor: I.cicloMediana > Pv.cicloMediana, txt: (d) => (d > 0 ? '+' : '−') + hTxt(Math.abs(d)), ids: insp.map(c => c.id), que: 'Tiempo de ciclo · casos inspeccionados en el período' },
        { id: 'cicloP90', titulo: 'Tiempo de ciclo · p90', valor: hTxt(I.cicloP90), dif: (I.cicloP90 || 0) - (Pv.cicloP90 || 0), peor: I.cicloP90 > Pv.cicloP90, txt: (d) => (d > 0 ? '+' : '−') + hTxt(Math.abs(d)), ids: insp.filter(c => ciclo(c) >= I.cicloP90).map(c => c.id), que: 'Tiempo de ciclo · sobre el p90' },
        { id: 'eficiencia', titulo: 'Eficiencia del flujo', valor: pct(I.eficiencia), dif: (I.eficiencia || 0) - (Pv.eficiencia || 0), peor: I.eficiencia < Pv.eficiencia, txt: (d) => (d > 0 ? '+' : '−') + Math.abs(Math.round(d * 100)) + ' pp', ids: insp.filter(c => c.tramos.reduce((a, t) => a + trabT(t), 0) / Math.max(1, c.cierre - c.registro) < (I.eficiencia || 0)).map(c => c.id), que: 'Eficiencia del flujo · bajo el ' + pct(I.eficiencia) },
        { id: 'sla', titulo: 'Cumplimiento del SLA', valor: pct(I.sla), dif: (I.sla || 0) - (Pv.sla || 0), peor: I.sla < Pv.sla, txt: (d) => (d > 0 ? '+' : '−') + Math.abs(Math.round(d * 100)) + ' pp', ids: v.estados.reduce((a, s) => a.concat(s.idsFuera), []), que: 'Cumplimiento del SLA · tramos fuera del SLA' },
        { id: 'retrabajo', titulo: 'Retrabajo', valor: pct(I.retrabajo), dif: (I.retrabajo || 0) - (Pv.retrabajo || 0), peor: I.retrabajo > Pv.retrabajo, txt: (d) => (d > 0 ? '+' : '−') + Math.abs(Math.round(d * 100)) + ' pp', ids: cerr.filter(c => c.retr).map(c => c.id), que: 'Retrabajo · casos con devolución, reapertura o foto rechazada' },
      ];
      const tiles = h('div', { id: 'mon-kpis', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))', gap: 10 } }, kpis.map(k => { const igual = Math.abs(k.dif) < 1e-9, col = igual ? C.muted : k.peor ? ROJO : C.success;
        return h('button', { key: k.id, id: 'mon-kpi-' + k.id, type: 'button', onClick: () => ir(k.que, k.ids), title: (M.metricas || {})[k.id === 'cicloMediana' || k.id === 'cicloP90' ? 'tiempoCiclo' : k.id === 'eficiencia' ? 'eficienciaFlujo' : k.id === 'sla' ? 'cumplimientoSla' : k.id] || '', 'aria-label': k.titulo + ': ' + k.valor + '. ' + (igual ? 'Sin cambio' : (k.peor ? 'Empeora ' : 'Mejora ') + k.txt(k.dif)) + ' frente a ' + prevTxt + '. Abre ' + (k.ids.length === 1 ? '1 caso' : k.ids.length + ' casos') + ' en la Bandeja.',
          style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: '12px 12px 10px', border: '1px solid ' + C.borde, borderRadius: 12, background: '#FFFFFF', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-brand)', minWidth: 0 } },
          h('span', { style: { fontSize: 12, fontWeight: 700, color: C.muted, lineHeight: 1.25 } }, k.titulo), h('span', { style: { fontSize: 22, fontWeight: 800, color: C.strong, lineHeight: 1.15 } }, k.valor),
          h('span', { style: { fontSize: 12, fontWeight: 700, color: col, display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true' }, igual ? '=' : k.dif > 0 ? '▲' : '▼'), igual ? 'Sin cambio' : k.txt(k.dif) + (k.peor ? ' · peor' : ' · mejor')),
          h('span', { style: { fontSize: 11, color: C.muted } }, 'vs. ' + prevTxt)); }));
      return h(R().Fragment, null, tiles, h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' } }, h('div', { style: { flex: '2 1 520px', minWidth: 0 } }, cfdPanel()), h('div', { style: { flex: '1 1 320px', minWidth: 0 } }, cuellosPanel())));
    }
    // ----- Diagrama de flujo acumulado -----
    function cfdPanel() {
      // Bandas agrupadas por etapa (maqueta v2): Coordinación, Agendado, En curso (con Devuelto), Calificación (con Suscripción) e Inspeccionado y cerrados.
      const CERR = 'Inspeccionado y cerrados', GRP = [[CERR, ['Cerrados'], '#cfe9dc'], ['Calificación', ['Pendiente calificación', 'Pendiente calificación de suscripción'], '#f6c3be'], ['En curso', ['En curso', 'Devuelto al inspector'], '#bcd7f2'], ['Agendado', ['Agendado', 'Enlace caducado'], '#d9e4ef'], ['Coordinación', ['Registrado', 'En coordinación', 'Reaperturado'], '#fbe3b0']];
      const S = v.serie.map(d => { const cnt = {}; GRP.forEach(([g, es]) => { cnt[g] = es.reduce((a2, e) => a2 + (d.cnt[e] || 0), 0); }); return Object.assign({}, d, { cnt }); }), bandas = GRP.map(g => g[0]), color = (b) => (GRP.find(g => g[0] === b) || [0, 0, GRIS])[2];
      const grupoDe = (e) => (GRP.find(g => g[1].includes(e)) || [e])[0];
      const an = v.anchos[0] || null, W0 = Math.max(360, anchos['mon-cfd-lienzo'] || 660), H0 = 300, ml = 36, mr = 12, mt = 26, mb = 28, pw = W0 - ml - mr, ph = H0 - mt - mb;
      const tot = S.map(d => bandas.reduce((a, b) => a + (d.cnt[b] || 0), 0)), mx = Math.max(1, ...tot), yS = (n) => mt + ph - n / mx * ph, xS = (i) => ml + (S.length === 1 ? 0 : i / (S.length - 1) * pw);
      let acc = S.map(() => 0); const paths = bandas.map(b => { const lo = acc.slice(), hi = acc.map((a, i) => a + (S[i].cnt[b] || 0)); acc = hi; const up = hi.map((y, i) => (i ? 'L' : 'M') + xS(i).toFixed(1) + ' ' + yS(y).toFixed(1)).join(' '), dn = lo.map((y, i) => 'L' + xS(i).toFixed(1) + ' ' + yS(y).toFixed(1)).reverse().join(' '); return { b, d: up + ' ' + dn + ' Z', hi, lo }; });
      const ahora = (b) => b === CERR ? v.casos.filter(c => c.cierre != null && c.cierre > v.W.w0 && c.cierre <= v.W.w1).map(c => c.id) : v.estados.filter(s => (GRP.find(g => g[0] === b) || [0, []])[1].includes(s.estado)).reduce((a2, s) => a2.concat(s.idsAhora), []);
      const mk = an ? S.findIndex(d => d.iso === an.iso) : -1, ticks = [0, Math.round(mx / 2), mx];
      const idsMarca = an ? v.casos.filter(c => c.tramos.some(t => t.estado === an.estado && t.entrada > an.b0)).map(c => c.id) : [];
      const svg = h('div', { id: 'mon-cfd-lienzo', style: { position: 'relative', width: '100%' }, onMouseLeave: () => setHov(null) },
        h('svg', { viewBox: '0 0 ' + W0 + ' ' + H0, width: '100%', height: H0, role: 'img', 'aria-labelledby': 'mon-cfd-t mon-cfd-desc', style: { display: 'block', overflow: 'visible' },
          onMouseMove: (ev) => { const r = ev.currentTarget.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * W0, i = Math.round((x - ml) / pw * (S.length - 1)); setHov(i >= 0 && i < S.length ? i : null); } },
          h('desc', { id: 'mon-cfd-desc' }, 'Casos por estado al cierre de cada día entre ' + perTxt + '. ' + (an ? 'Desde el ' + dTxt(an.desde) + ' se ensancha la banda «' + corta(an.estado) + '»: de ' + an.ini + ' a ' + an.fin + ' casos.' : 'Ninguna banda se ensancha de forma sostenida.')),
          ticks.map((t, i) => h('g', { key: 'y' + i }, h('line', { x1: ml, x2: W0 - mr, y1: yS(t), y2: yS(t), stroke: '#E8E8E8', strokeWidth: 1 }), h('text', { x: ml - 6, y: yS(t) + 4, textAnchor: 'end', fontSize: 11, fill: '#5C6470' }, String(t)))),
          paths.map(pp => h('path', { key: pp.b, d: pp.d, fill: color(pp.b), fillOpacity: 1, stroke: '#FFFFFF', strokeWidth: 1, strokeLinejoin: 'round', style: { cursor: 'pointer' }, onClick: () => ir((pp.b === CERR ? 'Cerrados en el período' : pp.b + ' · casos ahora'), ahora(pp.b)) }, h('title', null, (pp.b === CERR ? 'Cerrados en el período' : pp.b) + ' · clic para ver los casos'))),
          S.map((d, i) => i % 5 === (S.length - 1) % 5 ? h('text', { key: 'x' + i, x: xS(i), y: H0 - 8, textAnchor: 'middle', fontSize: 11, fill: '#5C6470' }, fd(d.fecha)) : null),
          mk >= 0 ? h('g', { 'data-marca': an.iso }, h('line', { x1: xS(mk), x2: xS(mk), y1: mt - 4, y2: mt + ph, stroke: '#b42318', strokeWidth: 1.5, strokeDasharray: '4 3' }), h('text', { x: xS(mk) + (mk > S.length * 0.75 ? -6 : 6), y: mt + 10, textAnchor: mk > S.length * 0.75 ? 'end' : 'start', fontSize: 12, fontWeight: 800, fill: '#b42318' }, dTxt(an.desde) + ': ' + grupoDe(an.estado)), h('text', { x: xS(mk) + (mk > S.length * 0.75 ? -6 : 6), y: mt + 25, textAnchor: mk > S.length * 0.75 ? 'end' : 'start', fontSize: 12, fill: '#b42318' }, 'se ensancha')) : null,
          hov != null ? h('line', { x1: xS(hov), x2: xS(hov), y1: mt, y2: mt + ph, stroke: '#011E41', strokeOpacity: 0.5, strokeWidth: 1, pointerEvents: 'none' }) : null),
        hov != null ? h('div', { role: 'status', style: { position: 'absolute', top: 6, left: (xS(hov) / W0 * 100) + '%', transform: 'translateX(' + (hov > S.length / 2 ? '-104%' : '4%') + ')', background: '#FFFFFF', border: '1px solid ' + C.borde, borderRadius: 8, boxShadow: '0 4px 14px rgba(1,30,65,.12)', padding: '8px 10px', fontSize: 12, color: C.body, pointerEvents: 'none', minWidth: 170, zIndex: 2 } },
          h('div', { style: { fontWeight: 700, color: C.strong, marginBottom: 4 } }, fd(S[hov].fecha) + (S[hov].habil ? '' : ' · no hábil')), bandas.slice().reverse().map(b => h('div', { key: b, style: { display: 'flex', justifyContent: 'space-between', gap: 10 } }, h('span', { style: { display: 'flex', gap: 6, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 10, height: 10, borderRadius: 3, background: color(b) } }), b === CERR ? 'Cerrados (acum.)' : b), h('b', { style: { color: C.strong } }, String(S[hov].cnt[b] || 0))))) : null);
      const leyenda = h('div', { role: 'list', 'aria-label': 'Bandas del diagrama (abre la Bandeja con los casos)', style: { display: 'flex', flexWrap: 'wrap', gap: '6px 12px' } }, bandas.slice().reverse().map(b => { const n = b === CERR ? ahora(b).length : (S[S.length - 1].cnt[b] || 0);
        return h('div', { role: 'listitem', key: b }, h('button', { type: 'button', 'data-banda': b, onClick: () => ir(b === CERR ? 'Cerrados en el período' : b + ' · casos ahora', ahora(b)), 'aria-label': (b === CERR ? 'Cerrados en el período' : b) + ': ' + n + (n === 1 ? ' caso' : ' casos') + '. Abre la Bandeja.', style: { display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', padding: '2px 0', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 12, color: C.body } }, h('span', { 'aria-hidden': 'true', style: { width: 12, height: 12, borderRadius: 3, background: color(b), outline: an && b === grupoDe(an.estado) ? '2px solid #b42318' : 'none', outlineOffset: 1 } }), (b === CERR ? 'Inspeccionado y cerrados' : b) + ' · ', h('b', { style: { color: C.strong } }, String(n)))); }));
      const tabla = h('div', { style: { maxHeight: 300, overflow: 'auto', border: '1px solid ' + C.borde, borderRadius: 8 } }, h('table', { id: 'mon-cfd-tabla', style: { width: '100%', borderCollapse: 'collapse', fontSize: 12 } }, h('caption', { style: sr }, 'Casos por estado al cierre de cada día'), h('thead', null, h('tr', null, h('th', { scope: 'col', style: thS }, 'Día'), bandas.slice().reverse().map(b => h('th', { key: b, scope: 'col', style: thS }, b === CERR ? 'Cerrados (acum.)' : b)))),
        h('tbody', null, S.map(d => h('tr', { key: d.iso }, h('th', { scope: 'row', style: Object.assign({}, tdS, { fontWeight: 700, color: C.strong }) }, fd(d.fecha) + (d.habil ? '' : ' (no hábil)')), bandas.slice().reverse().map(b => h('td', { key: b, style: Object.assign({}, tdS, { textAlign: 'right' }) }, String(d.cnt[b] || 0))))))));
      return panel('mon-cfd', 'Flujo acumulado de los últimos ' + S.length + ' días', 'Cada banda es una etapa. Una banda que se ensancha significa que entran más casos de los que salen: ahí se forma un cuello. Clic en una banda para ver sus casos.', linkBtn(cfdTabla ? 'Ver el diagrama' : 'Ver como tabla', () => setCfdTabla(!cfdTabla), { id: 'mon-cfd-ver', 'aria-pressed': cfdTabla ? 'true' : 'false' }),
        cfdTabla ? tabla : svg, leyenda,
        an ? h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 12px', padding: '8px 12px', borderRadius: 8, background: 'var(--surface-subtle, #F3F5F8)', fontSize: 13, color: C.body } }, h('span', { style: { flex: '1 1 260px', textWrap: 'pretty' } }, h('b', { style: { color: C.strong } }, 'Desde el ' + dTxt(an.desde) + ' se ensancha «' + grupoDe(an.estado) + '» (' + an.estado + ')'), ': pasa de ' + an.ini + ' a ' + an.fin + ' casos (entran ' + num(an.netoDia || an.pend) + ' por día hábil más de los que salen).'),
          linkBtn('Ver ' + (idsMarca.length === 1 ? '1 caso' : idsMarca.length + ' casos'), () => ir(an.estado + ' · ingresaron desde el ' + dTxt(an.desde), idsMarca), { id: 'mon-cfd-marca' })) : h('p', { style: { margin: 0, fontSize: 13, color: C.muted } }, 'Ninguna banda se ensancha de forma sostenida en el período.'));
    }
    // ----- Cuellos detectados -----
    function cuellosPanel() {
      const L = v.cuellos, TOPE = 4, vis = todos || (abierto != null && abierto >= TOPE) ? L : L.slice(0, TOPE);
      return panel('mon-cuellos', 'Cuellos detectados', (M.impacto || '') + ' Reglas de Administración › Flujo y SLA › Monitor.', null,
        L.length ? h('ol', { id: 'mon-cuellos-lista', style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, vis.map((c, i) => { const op2 = abierto === i, accion = (M.acciones || {})[c.causa] || '', resumenTxt = (c.aporte ? 'Explica el ' + pct(c.aporte) + ' del aumento del tiempo de ciclo. ' : '') + (c.causa === 'calidad' && c.calidad ? c.calidad.motivoN + ' de ' + c.calidad.n + ' devoluciones por «' + c.calidad.motivo.toLowerCase() + '», concentradas en ' + c.calidad.conc + '. ' : '') + c.reglas.map(r => r.detalle).join('; ') + (c.concentra && c.causa === 'contencion' ? '. ' + c.concentra.persona + ' concentra ' + c.concentra.n + ' de los ' + c.concentra.de + ' casos en espera.' : '.');
          return h('li', { key: c.id, id: 'mon-cuello-' + i, tabIndex: -1, 'data-cuello': c.id, style: { border: '1px solid ' + (c.severidad === 'alta' ? 'var(--red-100, #F8DAD5)' : C.borde), borderLeft: '4px solid ' + (c.severidad === 'alta' ? ROJO : '#C99A06'), borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, background: '#FFFFFF', outline: 'none' } },
            h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 } }, chip(c.severidad === 'alta' ? 'bad' : 'warn', c.severidad === 'alta' ? 'Alta' : 'Media'), h('span', { style: { fontSize: 12, fontWeight: 700, color: C.muted } }, (i + 1) + ' · ' + (c.aporte ? pct(c.aporte) + ' del aumento del ciclo' : 'sin aporte al aumento del ciclo'))),
            h('h4', { style: { margin: 0, fontSize: 15, color: C.strong, textWrap: 'pretty' } }, c.titulo + ' · ' + causaNom(c.causa)),
            h('p', { style: { margin: 0, fontSize: 13, color: C.muted, textWrap: 'pretty' } }, resumenTxt), accion ? h('p', { style: { margin: 0, fontSize: 13, fontWeight: 800, color: C.link, textWrap: 'pretty' } }, 'Acción sugerida: ' + accion) : null,
            op2 ? h('div', { id: 'mon-cuello-' + i + '-det', style: { display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 6, borderTop: '1px solid ' + C.borde } },
              h('div', null, h('h5', { style: { margin: '0 0 4px', fontSize: 13, color: C.strong } }, 'Reglas que se cumplen'), h('ul', { style: { margin: 0, paddingLeft: 18, fontSize: 13, color: C.body, display: 'flex', flexDirection: 'column', gap: 3 } }, c.reglas.map((r, k) => h('li', { key: k }, h('b', null, (((M.reglas || []).find(x => x.id === r.id) || {}).nombre || r.id) + ' (' + r.sev + '): '), r.detalle, h('span', { style: { display: 'block', fontSize: 12, color: C.muted } }, 'Regla: ' + (((M.reglas || []).find(x => x.id === r.id) || {}).si || '')))))),
              h('div', null, h('h5', { style: { margin: '0 0 4px', fontSize: 13, color: C.strong } }, 'Causa: ' + causaNom(c.causa)), h('p', { style: { margin: 0, fontSize: 13, color: C.body, textWrap: 'pretty' } }, c.causa === 'calidad' ? 'Motivo principal de devolución: «' + c.calidad.motivo + '» (' + c.calidad.motivoN + ' de ' + c.calidad.n + '), concentrado en ' + c.calidad.conc + ' (' + c.calidad.concN + ').' : causaReg(c.causa) + (c.concentra && c.causa === 'contencion' ? '. ' + c.concentra.persona + ' tiene ' + c.concentra.n + ' de los ' + c.concentra.de + ' casos que esperan en el estado.' : '.')),
                c.causas ? causasMini(c.causas) : null),
              null) : null,
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'center' } }, linkBtn(op2 ? 'Ocultar el detalle' : 'Ver el detalle', () => setAbierto(op2 ? null : i), { id: 'mon-cuello-' + i + '-det-btn', 'aria-expanded': op2 ? 'true' : 'false', 'aria-controls': 'mon-cuello-' + i + '-det' }),
              linkBtn('Ver ' + (c.ids.length === 1 ? '1 caso' : c.ids.length + ' casos') + ' en la Bandeja', () => ir(c.titulo + ' · ' + c.criterio, c.ids), { id: 'mon-cuello-' + i + '-casos' }))); })) : h('p', { style: { margin: 0, fontSize: 14, color: C.body } }, 'No se detectan cuellos con los filtros elegidos.'),
        L.length > TOPE ? linkBtn(vis.length < L.length ? 'Ver ' + (L.length - TOPE) + (L.length - TOPE === 1 ? ' cuello más' : ' cuellos más') : 'Ver solo los ' + TOPE + ' primeros', () => setTodos(vis.length < L.length), { id: 'mon-cuellos-mas', 'aria-expanded': vis.length < L.length ? 'false' : 'true', 'aria-controls': 'mon-cuellos-lista' }) : null);
    }
    function causasMini(cz) { const tot = Object.values(cz).reduce((a, b) => a + b, 0) || 1, ids = ESPERAS(); return h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginTop: 6, fontSize: 12, color: C.body } }, ids.filter(k => cz[k] > 0).map(k => h('span', { key: k, style: { display: 'flex', alignItems: 'center', gap: 4 } }, h('span', { 'aria-hidden': 'true', style: { width: 10, height: 10, borderRadius: 3, background: SERIE[ids.indexOf(k)] } }), causaNom(k) + ' ' + pct(cz[k] / tot)))); }

    // ----- Etapas y cuellos -----
    function etapas() {
      const E = v.estados, mxT = Math.max(1, ...E.map(s => (s.esperaMed || 0) + (s.trabajoMed || 0)));
      const filaBtn = (s) => linkBtn(s.estado, () => ir(s.estado + ' · casos ahora', s.idsAhora), { 'aria-label': s.estado + ': ' + s.ahora + (s.ahora === 1 ? ' caso' : ' casos') + ' ahora. Abre la Bandeja.', style: { fontSize: 13, color: C.strong } });
      const barra = (s) => { const e = s.esperaMed || 0, t = s.trabajoMed || 0; return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 3, minWidth: 150 } }, h('div', { 'aria-hidden': 'true', style: { display: 'flex', gap: 2, height: 10, width: Math.max(4, (e + t) / mxT * 100) + '%' } }, h('span', { style: { flex: e || 0.0001, background: '#f2b8a0', borderRadius: '4px 0 0 4px' } }), h('span', { style: { flex: t || 0.0001, background: '#0B5CAD', borderRadius: '0 4px 4px 0' } })), h('span', { style: { fontSize: 12, color: C.body, whiteSpace: 'nowrap' } }, hTxt(s.esperaMed) + ' espera · ' + hTxt(s.trabajoMed) + ' trabajo')); };
      const cols = ['Estado', 'Casos ahora', 'Entran / salen por día', 'Espera · trabajo (mediana)', 'p90 total', 'SLA', 'Cumplimiento', 'Utilización del rol (carga actual)', 'Causa principal de la espera'];
      const tabla = panel('mon-etapas', 'Tiempo en cada estado: espera frente a trabajo', 'El tiempo de ciclo es la suma del trabajo efectivo y la espera; cuanto más baja la eficiencia, más espera hay que eliminar. Período ' + perTxt + '. Clic en el estado para ver sus casos de ahora y en el cumplimiento para ver los que quedaron fuera del SLA.', h('span', { style: { display: 'flex', gap: 12, fontSize: 12, color: C.body } }, h('span', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 12, height: 10, borderRadius: 3, background: '#f2b8a0' } }), 'Espera'), h('span', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 12, height: 10, borderRadius: 3, background: '#0B5CAD' } }), 'Trabajo efectivo')),
        h('div', { style: { overflowX: 'auto', border: '1px solid ' + C.borde, borderRadius: 8 } }, h('table', { id: 'mon-etapas-tabla', style: { width: '100%', minWidth: 940, borderCollapse: 'collapse' } }, h('caption', { style: sr }, 'Etapas del flujo: casos, flujo diario, tiempos, SLA, utilización y causa'),
          h('thead', null, h('tr', null, cols.map(c => h('th', { key: c, scope: 'col', style: thS }, c)))),
          h('tbody', null, E.map(s => { const cuello = v.cuellos.find(c => c.tipo === 'estado' && c.lugar === s.estado);
            return h('tr', { key: s.estado, 'data-estado': s.estado }, h('th', { scope: 'row', style: Object.assign({}, tdS, { textAlign: 'left' }) }, filaBtn(s), cuello ? h('span', { style: { display: 'block', marginTop: 4 } }, Badge(cuello.severidad === 'alta' ? 'danger' : 'warning', 'Cuello ' + cuello.severidad)) : null),
              h('td', { style: tdN }, String(s.ahora)), h('td', { style: tdN }, num(s.entradasDia) + ' / ' + num(s.salidasDia)), h('td', { style: tdS }, barra(s)), h('td', { style: tdN }, hTxt(s.p90)), h('td', { style: tdS }, s.slas.length ? s.slas.map(x => x + ' h').join(' / ') : s.estado === 'Agendado' ? 'Con la visita' : '—'),
              h('td', { style: tdS }, s.cumplimiento == null ? '—' : s.idsFuera.length ? h('button', { type: 'button', onClick: () => ir(s.estado + ' · sobre el SLA', s.idsFuera), 'aria-label': 'Cumplimiento ' + pct(s.cumplimiento) + ' en ' + s.estado + '. Abre ' + s.idsFuera.length + ' casos sobre el SLA.', style: { border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' } }, chip(tonoPct(s.cumplimiento), pct(s.cumplimiento))) : chip(tonoPct(s.cumplimiento), pct(s.cumplimiento))),
              h('td', { style: tdS }, s.utilRol == null ? '—' : medidor(s.utilRol), h('span', { style: { display: 'block', fontSize: 11, color: C.muted } }, rolCorto(s.rol))),
              h('td', { style: tdS }, s.causaPrincipal ? causaNom(s.causaPrincipal[0]) : '—')); })))));
      return h(R().Fragment, null, tabla, h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' } }, h('div', { style: { flex: '1.4 1 640px', minWidth: 0 } }, agingPanel()), h('div', { style: { flex: '1 1 340px', minWidth: 0 } }, causasPanel())));
    }
    function agingPanel() {
      const E = v.estados.filter(s => s.abiertos.length), W0 = Math.max(560, anchos['mon-aging-lienzo'] || 900), H0 = 320, ml = 44, mr = 12, mt = 16, mb = 44, pw = W0 - ml - mr, ph = H0 - mt - mb, cw = pw / Math.max(1, E.length);
      const mx = Math.max(8, ...E.map(s => Math.max(s.p85 || 0, ...s.abiertos.map(a => a.horas)))), y = (hh) => mt + ph - Math.sqrt(Math.max(0, hh)) / Math.sqrt(mx) * ph;
      const ticks = [1, 4, 8, 16, 40, 80, 160].filter(t => t <= mx * 1.02);
      return panel('mon-aging', 'Antigüedad de los casos en proceso', 'Cada punto es un caso, en su estado actual, según cuánto lleva ahí (horas hábiles). Las bandas marcan lo habitual (p50 y p85 del período); sobre la línea roja, el caso está en riesgo.', null,
        h('div', { id: 'mon-aging-lienzo', style: { width: '100%', overflowX: 'auto' } }, h('svg', { viewBox: '0 0 ' + W0 + ' ' + H0, width: W0, height: H0, role: 'group', 'aria-label': 'Antigüedad por estado', style: { display: 'block' } },
          ticks.map(t => h('g', { key: 't' + t }, h('line', { x1: ml, x2: W0 - mr, y1: y(t), y2: y(t), stroke: '#E8E8E8' }), h('text', { x: ml - 6, y: y(t) + 4, textAnchor: 'end', fontSize: 11, fill: '#5C6470' }, hTxt(t)))),
          E.map((s, i) => { const x0 = ml + i * cw, cx = x0 + cw / 2, sobre = s.abiertos.filter(a => s.p85 != null && a.horas > s.p85);
            return h('g', { key: s.estado, 'data-aging': s.estado },
              s.p50 != null ? h('rect', { x: x0 + 8, width: cw - 16, y: y(s.p50), height: mt + ph - y(s.p50), fill: '#cfe9dc' }) : null,
              s.p85 != null ? h('rect', { x: x0 + 8, width: cw - 16, y: y(s.p85), height: y(s.p50 || 0) - y(s.p85), fill: '#fbe3b0', fillOpacity: 0.8 }) : null,
              s.p85 != null ? h('line', { x1: x0 + 8, x2: x0 + cw - 8, y1: y(s.p85), y2: y(s.p85), stroke: '#b42318', strokeDasharray: '3 3' }) : null,
              s.abiertos.slice().sort((a, b) => a.horas - b.horas).map((a, k) => { const rojo = s.p85 != null && a.horas > s.p85, dx = ((k % 7) - 3) * Math.min(9, (cw - 24) / 7);
                return h('circle', { key: a.id, cx: cx + dx, cy: y(a.horas), r: rojo ? 6 : 5, fill: rojo ? ROJO : '#0B5CAD', stroke: '#FFFFFF', strokeWidth: 2, role: 'button', tabIndex: 0, 'aria-label': 'Caso ' + a.id + ': ' + hTxt(a.horas) + ' en ' + s.estado + (rojo ? ', sobre el p85' : '') + '. Abre la Bandeja.', style: { cursor: 'pointer' }, onClick: () => ir(s.estado + ' · caso ' + a.id, [a.id]), onKeyDown: (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ir(s.estado + ' · caso ' + a.id, [a.id]); } } }, h('title', null, 'Caso ' + a.id + ' · ' + hTxt(a.horas) + (rojo ? ' · sobre el p85' : ''))); }),
              h('text', { x: cx, y: H0 - 26, textAnchor: 'middle', fontSize: 11, fontWeight: 700, fill: '#011E41' }, (() => { const n = corta(s.estado), mx = Math.max(6, Math.floor((cw - 6) / 6.6)); return n.length > mx ? n.slice(0, mx - 1) + '…' : n; })(), h('title', null, s.estado)),
              h('text', { x: cx, y: H0 - 10, textAnchor: 'middle', fontSize: cw < 110 ? 10 : 11, fill: sobre.length ? ROJO : '#5C6470' }, cw < 110 ? s.abiertos.length + ' · ' + sobre.length + ' ↑p85' : s.abiertos.length + ' · ' + sobre.length + ' sobre p85')); }))),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 12, color: C.body, alignItems: 'center' } }, h('span', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 10, height: 10, borderRadius: 5, background: '#0B5CAD' } }), 'Dentro del p85'), h('span', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 12, height: 12, borderRadius: 6, background: ROJO } }), 'Sobre el p85'), h('span', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 14, height: 10, background: '#cfe9dc' } }), 'Hasta p50 (habitual)'), h('span', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 14, height: 10, background: '#fbe3b0' } }), 'p50 a p85; sobre la línea roja, en riesgo'),
          E.filter(s => s.abiertos.some(a => s.p85 != null && a.horas > s.p85)).map(s => { const ids = s.abiertos.filter(a => a.horas > s.p85).map(a => a.id); return h('span', { key: s.estado }, linkBtn(corta(s.estado) + ': ' + ids.length + ' sobre p85', () => ir(s.estado + ' · sobre el p85', ids), { style: { fontSize: 12 } })); })));
    }
    function causasPanel() {
      const ids = ESPERAS(), E = v.estados.filter(s => Object.values(s.causas).some(x => x > 0)), mx = Math.max(1, ...E.map(s => Object.values(s.causas).reduce((a, b) => a + b, 0)));
      const casosDe = (s, k) => v.casos.filter(c => c.tramos.some(t => t.estado === s.estado && (t.causa || 'prioridad') === k && (t.salida == null ? !c.final : t.salida > v.W.w0 && t.salida <= v.W.w1))).map(c => c.id);
      const tot = {}; E.forEach(s => ids.forEach(k => { tot[k] = (tot[k] || 0) + (s.causas[k] || 0); })); const totAll = Object.values(tot).reduce((a, b) => a + b, 0) || 1;
      const barras = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, E.map(s => { const t = Object.values(s.causas).reduce((a, b) => a + b, 0);
        return h('div', { key: s.estado, 'data-causas': s.estado, style: { display: 'grid', gridTemplateColumns: 'minmax(120px, 190px) 1fr', gap: 10, alignItems: 'center' } }, h('span', { style: { fontSize: 13, fontWeight: 700, color: C.strong } }, corta(s.estado), h('span', { style: { display: 'block', fontSize: 11, fontWeight: 400, color: C.muted } }, hTxt(t) + ' de espera')),
          h('div', { style: { display: 'flex', gap: 2, width: Math.max(3, t / mx * 100) + '%', minWidth: 0 } }, ids.filter(k => s.causas[k] > 0).map(k => { const w = s.causas[k] / t, cs2 = casosDe(s, k);
            return h('button', { key: k, type: 'button', onClick: () => ir(s.estado + ' · ' + causaNom(k).toLowerCase(), cs2), 'aria-label': s.estado + ' · ' + causaNom(k) + ': ' + hTxt(s.causas[k]) + ' de espera (' + pct(w) + '), ' + cs2.length + (cs2.length === 1 ? ' caso' : ' casos') + '. Abre la Bandeja.', title: causaNom(k) + ' · ' + hTxt(s.causas[k]) + ' (' + pct(w) + ')',
              style: { flex: w + ' 1 0', minWidth: 4, height: 22, border: 'none', padding: 0, borderRadius: 4, background: SERIE[ids.indexOf(k)], cursor: 'pointer', color: [2, 3, 4].includes(ids.indexOf(k)) ? '#011E41' : '#FFFFFF', fontSize: 11, fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'var(--font-brand)' } }, w >= 0.18 ? pct(w) : ''); }))); }));
      const leyenda = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 12, color: C.body } }, ids.map((k, i) => h('span', { key: k, title: causaReg(k), style: { display: 'flex', gap: 4, alignItems: 'center' } }, h('span', { 'aria-hidden': 'true', style: { width: 12, height: 12, borderRadius: 3, background: SERIE[i] } }), causaNom(k) + ' · ' + pct((tot[k] || 0) / totAll))));
      const tabla = h('div', { style: { overflowX: 'auto', border: '1px solid ' + C.borde, borderRadius: 8 } }, h('table', { id: 'mon-causas-tabla', style: { width: '100%', borderCollapse: 'collapse' } }, h('caption', { style: sr }, 'Horas de espera por causa y estado'), h('thead', null, h('tr', null, h('th', { scope: 'col', style: thS }, 'Estado'), ids.map(k => h('th', { key: k, scope: 'col', style: thS }, causaNom(k))))),
        h('tbody', null, E.map(s => h('tr', { key: s.estado }, h('th', { scope: 'row', style: Object.assign({}, tdS, { textAlign: 'left', fontWeight: 700, color: C.strong }) }, s.estado), ids.map(k => h('td', { key: k, style: tdN }, s.causas[k] ? hTxt(s.causas[k]) : '—')))))));
      const casosCausa = (k) => v.casos.filter(c => c.tramos.some(t => (t.causa || 'prioridad') === k && t.estado !== 'Registrado' && (t.salida == null ? !c.final : t.salida > v.W.w0 && t.salida <= v.W.w1))).map(c => c.id);
      const mxC = Math.max(...ids.map(k => (tot[k] || 0) / totAll), 0.01);
      const total = h('div', { id: 'mon-causas-total', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, ids.slice().sort((a2, b2) => (tot[b2] || 0) - (tot[a2] || 0)).map(k => { const r = (tot[k] || 0) / totAll, cs2 = casosCausa(k);
        return h('button', { key: k, type: 'button', 'data-causa': k, onClick: () => ir('Causa de la espera · ' + causaNom(k).toLowerCase(), cs2), 'aria-label': causaNom(k) + ': ' + pct(r) + ' de la espera (' + hTxt(tot[k] || 0) + '), ' + cs2.length + ' casos. Abre la Bandeja.', title: causaReg(k),
          style: { display: 'grid', gridTemplateColumns: 'minmax(120px, 170px) 1fr 44px', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '2px 0', cursor: 'pointer', fontFamily: 'var(--font-brand)', textAlign: 'left' } },
          h('span', { style: { fontSize: 13, color: C.body } }, causaNom(k)), h('span', { 'aria-hidden': 'true', style: { display: 'block', height: 10, borderRadius: 5, background: SERIE[ids.indexOf(k)], width: Math.max(2, r / mxC * 100) + '%' } }), h('b', { style: { fontSize: 13, color: C.strong, textAlign: 'right' } }, pct(r))); }));
      return panel('mon-causas', 'Causas de la espera', (cauEst ? 'Por estado: horas' : 'Todo el flujo: parte') + ' de la espera del período (y de los casos que aún esperan) según su origen. Clic para ver sus casos.', h('span', { style: { display: 'flex', gap: 12 } }, linkBtn(cauEst ? 'Todo el flujo' : 'Por estado', () => setCauEst(!cauEst), { id: 'mon-causas-estado', 'aria-pressed': cauEst ? 'true' : 'false' }), linkBtn(cauTabla ? 'Ver las barras' : 'Ver como tabla', () => setCauTabla(!cauTabla), { id: 'mon-causas-ver', 'aria-pressed': cauTabla ? 'true' : 'false' })),
        cauEst && !cauTabla ? leyenda : null, cauTabla ? tabla : cauEst ? barras : total,
        h('details', null, h('summary', { style: { cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.strong } }, 'Cómo se clasifica cada causa'), h('ul', { style: { margin: '6px 0 0', paddingLeft: 18, fontSize: 13, color: C.body, display: 'flex', flexDirection: 'column', gap: 3 } }, (D().causas || []).map(x => h('li', { key: x.id }, h('b', null, x.nombre + ': '), x.regla, ' · ', h('i', null, 'Acción: ' + ((D().acciones || {})[x.id] || '—')))))));
    }

    // ----- 16f-3b · Responsables y SLA -----
    function delta(a, b, mejorSiSube, fmt) { if (a == null || b == null) return null; const d = a - b; if (Math.abs(d) < 1e-9 || fmt(Math.abs(d)) === fmt(0)) return h('span', { style: { display: 'block', fontSize: 11, color: C.muted } }, '= vs. anterior'); const peor = mejorSiSube ? d < 0 : d > 0; return h('span', { style: { display: 'block', fontSize: 11, fontWeight: 700, color: peor ? ROJO : C.success } }, (d > 0 ? '▲ ' : '▼ ') + fmt(Math.abs(d)) + (peor ? ' · peor' : ' · mejor')); }
    function responsablesV() {
      const RS = SM.responsables(v, p.extras), MR = M.responsables || {}, cols = MR.columnas || ['Persona', 'Rol', 'A cargo', 'Vencidos', 'Por vencer', 'Cumplimiento de SLA', 'Atención (mediana)', 'Cerrados por día', 'Carga', 'Disponibilidad'];
      const abrir = (r) => ir(r.persona + ' · ' + (r.aCargo.length ? 'casos a cargo' : 'casos del período'), r.aCargo.length ? r.aCargo : r.idsPeriodo);
      const tabla = panel('mon-resp', 'SLA por responsable', MR.regla || '', null,
        h('div', { style: { overflowX: 'auto', border: '1px solid ' + C.borde, borderRadius: 8 } }, h('table', { id: 'mon-resp-tabla', style: { width: '100%', minWidth: 980, borderCollapse: 'collapse' } }, h('caption', { style: sr }, 'Cumplimiento del SLA por responsable'),
          h('thead', null, h('tr', null, cols.map((c, i) => h('th', { key: c, scope: 'col', style: Object.assign({}, thS, [2, 3, 4, 6, 7].includes(i) ? { textAlign: 'right' } : {}) }, c)))),
          h('tbody', null, RS.filas.map(r => h('tr', { key: r.persona, 'data-persona': r.persona, onClick: (ev) => { if (ev.target.closest('button')) return; abrir(r); }, style: { cursor: 'pointer' } },
            h('th', { scope: 'row', style: Object.assign({}, tdS, { textAlign: 'left' }) }, linkBtn(r.persona, () => abrir(r), { 'aria-label': r.persona + ': ' + r.aCargo.length + ' casos a cargo, ' + r.vencidos.length + ' vencidos. Abre su Bandeja.', style: { color: C.strong, fontSize: 13 } })),
            h('td', { style: tdS }, r.rol), h('td', { style: tdN }, String(r.aCargo.length)), h('td', { style: tdN }, r.vencidos.length ? chip('bad', String(r.vencidos.length)) : '0'), h('td', { style: tdN }, r.porVencer.length ? chip('warn', String(r.porVencer.length)) : '0'),
            h('td', { style: tdS }, r.cumplimiento == null ? '—' : chip(tonoPct(r.cumplimiento), pct(r.cumplimiento)), delta(r.cumplimiento, r.cumplimientoP, true, pp)),
            h('td', { style: tdN }, r.atencion == null ? '—' : hTxt(r.atencion)), h('td', { style: tdN }, num(r.cerradosDia), delta(r.cerradosDia, r.cerradosDiaP, true, (d) => num(d))),
            h('td', { style: tdS }, r.carga == null ? '—' : medidor(r.carga)), h('td', { style: tdS }, r.disponibilidad === 'Disponible' ? chip('ok', 'Disponible') : chip('info', r.disponibilidad, { style: { display: 'inline-block', borderRadius: 10, padding: '2px 9px', fontSize: 12, fontWeight: 800, background: SUAVE.info[0], color: SUAVE.info[1], whiteSpace: 'normal', maxWidth: 150 } }))))))));
      const bloque = (id, t, sub, filas) => h('div', { style: { flex: '1 1 280px', minWidth: 0 } }, panel(id, t, sub, null, filas.length ? h('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 } }, filas) : h('p', { style: { margin: 0, fontSize: 13, color: C.muted } }, 'Sin datos en el período.')));
      const fila = (k, izq, der, onClick, aria) => h('li', { key: k }, h('button', { type: 'button', onClick, 'aria-label': aria, style: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, border: 'none', borderBottom: '1px solid #eef2f6', background: 'transparent', padding: '7px 0', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 13, color: C.body, textAlign: 'left' } }, h('span', null, izq), h('span', { style: { textAlign: 'right' } }, der)));
      const bloques = (MR.bloques || ['SLA por rol', 'Traspasos más lentos entre roles', 'Devoluciones y reaperturas por responsable']);
      return h(R().Fragment, null, tabla, h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' } },
        bloque('mon-roles', bloques[0], 'Tramos cerrados dentro del SLA por rol; frente a ' + prevTxt + '.', RS.roles.map(r => fila(r.rol, r.rol, h(R().Fragment, null, chip(tonoPct(r.cumplimiento), pct(r.cumplimiento)), delta(r.cumplimiento, r.cumplimientoP, true, pp)), () => ir(r.rol + ' · fuera del SLA', r.fuera), r.rol + ': ' + pct(r.cumplimiento) + ' dentro del SLA. Abre ' + r.fuera.length + ' casos fuera del SLA.'))),
        bloque('mon-traspasos', bloques[1], 'Tiempo entre que un rol termina y el siguiente empieza (mediana).', RS.traspasos.map(t => fila(t.titulo, t.titulo, h(R().Fragment, null, h('b', { style: { color: C.strong } }, hTxt(t.mediana)), ' ', t.sev ? chip(t.sev === 'alta' ? 'bad' : 'warn', t.sev === 'alta' ? 'Alta' : 'Media') : null, t.antes != null ? h('span', { style: { display: 'block', fontSize: 11, color: C.muted } }, 'antes ' + hTxt(t.antes)) : null), () => ir('Traspaso ' + t.titulo + ' · más de 4 h', t.ids), 'Traspaso ' + t.titulo + ': mediana ' + hTxt(t.mediana) + '. Abre ' + t.ids.length + ' casos.'))),
        bloque('mon-retrab', bloques[2], 'Informes devueltos por inspector y reaperturas por coordinador en el período.', RS.retrab.map(d => fila(d.persona + d.tipo, d.persona + ' (' + d.tipo + ')', h('b', { style: { color: C.strong } }, d.n + ' de ' + d.de), () => ir(d.persona + ' · ' + d.tipo, d.ids), d.persona + ': ' + d.n + ' ' + d.tipo + ' de ' + d.de + '. Abre los casos.')))));
    }
    // ----- 16f-3b · Tareas -----
    function tareasV() {
      const T = TT, MT = M.tareas || {}, tr = MT.tramosAntiguedad || ['< 1 día', '1 a 3 días', '3 a 5 días', '> 5 días'];
      const tabla = panel('mon-tareas', 'Tareas pendientes por antigüedad', MT.regla || '', null,
        h('div', { style: { overflowX: 'auto', border: '1px solid ' + C.borde, borderRadius: 8 } }, h('table', { id: 'mon-tareas-tabla', style: { width: '100%', minWidth: 760, borderCollapse: 'collapse' } }, h('caption', { style: sr }, 'Tareas abiertas por tipo'),
          h('thead', null, h('tr', null, ['Tipo de tarea', 'Abiertas', 'Antigüedad', 'Vencidas', 'Responsable con más pendientes', 'Casos'].map((c, i) => h('th', { key: c, scope: 'col', style: Object.assign({}, thS, [1, 3].includes(i) ? { textAlign: 'right' } : {}) }, c)))),
          h('tbody', null, T.filas.map(f => h('tr', { key: f.tipo, 'data-tarea': f.tipo }, h('th', { scope: 'row', style: Object.assign({}, tdS, { textAlign: 'left', color: C.strong }) }, f.tipo), h('td', { style: tdN }, String(f.abiertas)),
            h('td', { style: tdS }, h('div', { role: 'img', 'aria-label': tr.map((t, k) => t + ': ' + f.tramos[k]).join(', '), style: { display: 'flex', height: 10, width: 160, borderRadius: 5, overflow: 'hidden', background: '#eef2f6' } }, f.tramos.map((n, k) => n ? h('i', { key: k, style: { display: 'block', width: (n / Math.max(1, f.abiertas) * 160) + 'px', background: TRAMO_C[k] } }) : null))),
            h('td', { style: tdN }, f.vencidas ? chip('bad', String(f.vencidas)) : '0'), h('td', { style: tdS }, f.top),
            h('td', { style: tdS }, Btn('secondary', 'Ver', () => ir('Tareas · ' + f.tipo, f.ids), Object.assign({ 'aria-label': 'Ver los casos de «' + f.tipo + '»' }, f.abiertas ? {} : { unavailableReason: 'No hay tareas abiertas de este tipo' })))))))),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 12, color: C.body } }, tr.map((t, k) => h('span', { key: t, style: { display: 'flex', gap: 5, alignItems: 'center' } }, h('i', { 'aria-hidden': 'true', style: { width: 11, height: 11, borderRadius: 3, background: TRAMO_C[k], display: 'inline-block' } }), t))));
      const viejas = panel('mon-viejas', 'Las 5 más antiguas', 'Clic en el caso para abrirlo; «Reasignar» abre la reasignación con motivo e impacto.', null,
        h('div', { style: { overflowX: 'auto', border: '1px solid ' + C.borde, borderRadius: 8 } }, h('table', { id: 'mon-viejas-tabla', style: { width: '100%', minWidth: 760, borderCollapse: 'collapse' } }, h('caption', { style: sr }, 'Las 5 tareas más antiguas'),
          h('thead', null, h('tr', null, ['Caso', 'Tarea', 'Responsable', 'Antigüedad', 'Estado del caso', 'Acción'].map((c, i) => h('th', { key: c, scope: 'col', style: Object.assign({}, thS, i === 3 ? { textAlign: 'right' } : {}) }, c)))),
          h('tbody', null, T.viejas.map((t, i) => { const insp = t.rol === 'Inspector' || (usuarioDe(t.responsable) || { roles: [] }).roles.includes('Inspector'), destinos = SM.destinosDe(v, p.extras, t.responsable, t.rol || (usuarioDe(t.responsable) || { roles: [''] }).roles[0]);
            return h('tr', { key: t.caso + t.tipo }, h('th', { scope: 'row', style: Object.assign({}, tdS, { textAlign: 'left' }) }, linkBtn(t.caso, () => p.onCaso && p.onCaso(t.caso), { id: 'mon-vieja-' + i, 'aria-label': 'Abrir el caso ' + t.caso, style: { fontSize: 13 } }), t.real ? null : h('span', { style: { display: 'block', fontSize: 11, color: C.muted } }, 'Ejemplo')),
              h('td', { style: tdS }, t.tipo), h('td', { style: tdS }, t.responsable), h('td', { style: tdN }, chip(t.vencida ? 'bad' : 'warn', hTxt(t.horas))), h('td', { style: tdS }, corta(t.estado)),
              h('td', { style: tdS }, Btn('secondary', 'Reasignar', () => abrirReas([t.caso], t.responsable, t.rol || (usuarioDe(t.responsable) || { roles: [''] }).roles[0], destinos[0] || ''), Object.assign({ id: 'mon-reas-' + i }, insp ? { unavailableReason: 'Las visitas y los informes del inspector se reasignan desde Agenda o la pestaña Coordinación' } : !destinos.length ? { unavailableReason: 'No hay otra persona del mismo rol y alcance' } : {})))); })))));
      return h(R().Fragment, null, tabla, viejas);
    }
    // ----- 16f-3b · Cargabilidad y simulación -----
    function cargaV() {
      const MC = M.cargabilidad || {}, S0 = sim.ver && sim.de && sim.a ? SM.simular(v, p.extras, sim.n, sim.de, sim.a) : null, CG = S0 ? { dias: S0.dias, filas: S0.filas } : SM.carga(v, p.extras);
      const base = SM.carga(v, p.extras), eleg = base.filas.filter(r => SM.ESTADO_ROL[r.rol] && r.rol !== 'Inspector' && r.casos.some(c => c.estado === SM.ESTADO_ROL[r.rol])), de = sim.de || (eleg.slice().sort((a2, b2) => (b2.prom || 0) - (a2.prom || 0))[0] || {}).persona || '', dest = de ? SM.destinosDe(v, p.extras, de) : [], a = dest.includes(sim.a) ? sim.a : (dest.slice().sort((x1, x2) => ((base.filas.find(r => r.persona === x1) || {}).prom || 0) - ((base.filas.find(r => r.persona === x2) || {}).prom || 0))[0] || '');
      const ndia = (d) => DIAS[d.getDay()] + ' ' + d.getDate();
      const tabla = h('div', { style: { overflowX: 'auto' } }, h('table', { id: 'mon-carga-tabla', style: { width: '100%', minWidth: 760, borderCollapse: 'separate', borderSpacing: 4, tableLayout: 'fixed' } }, h('caption', { style: sr }, 'Carga frente a capacidad por persona y día' + (S0 ? ' (con la simulación)' : '')),
        h('thead', null, h('tr', null, h('th', { scope: 'col', style: Object.assign({}, thS, { background: 'transparent', borderBottom: 'none', width: 250 }) }, 'Persona'), CG.dias.map(d => h('th', { key: isoD(d), scope: 'col', style: Object.assign({}, thS, { background: 'transparent', borderBottom: 'none', textAlign: 'center' }) }, ndia(d))), h('th', { scope: 'col', style: Object.assign({}, thS, { background: 'transparent', borderBottom: 'none', textAlign: 'center', width: 90 }) }, 'Promedio'))),
        h('tbody', null, CG.filas.map(r => h('tr', { key: r.persona, 'data-carga': r.persona }, h('th', { scope: 'row', style: { textAlign: 'left', padding: '6px 8px', fontSize: 13, fontWeight: 700, color: C.strong } }, r.persona + ' · ' + rolCorto(r.rol).replace('Calificación', 'Ejecutivo').replace('Coordinación', 'Coordinador').replace('Suscripción', 'Suscriptor'), r.nota ? h('span', { style: { display: 'block', fontSize: 11, fontWeight: 400, color: C.muted } }, r.nota) : null),
          r.celdas.map((c, k) => h('td', { key: k, title: c.ausente ? c.ausente : 'Carga ' + num(c.carga) + ' h de ' + num(c.cap) + ' h' + (c.nota ? ' · ' + c.nota : ''), style: { textAlign: 'center', padding: '7px 6px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: c.ausente ? '#e3e8ee' : CALOR(c.pct), color: !c.ausente && c.pct > 1 ? '#FFFFFF' : C.strong, whiteSpace: 'nowrap' } }, c.ausente ? 'Ausente' : pct(c.pct), c.nota && !c.ausente ? h('span', { style: { display: 'block', fontSize: 10, fontWeight: 400 } }, c.nota) : null)),
          h('td', { style: { textAlign: 'center', fontSize: 13, fontWeight: 800, color: C.strong } }, pct(r.prom)))))));
      const leyenda = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 12, color: C.body } }, (MC.colores || ['< 70 %', '70 a 85 %', '85 a 100 %', '> 100 %', 'Ausente']).map((t, k) => h('span', { key: t, style: { display: 'flex', gap: 5, alignItems: 'center' } }, h('i', { 'aria-hidden': 'true', style: { width: 11, height: 11, borderRadius: 3, display: 'inline-block', background: ['#cfe9dc', '#fbe3b0', '#f6c3be', '#b42318', '#e3e8ee'][k] } }), t)));
      const selS = (id, label, val, opts, on) => h('label', { htmlFor: id, style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.body } }, label, h('select', { id, value: val, onChange: (ev) => on(ev.target.value), style: { height: 34, padding: '0 8px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 10, background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: C.strong } }, opts.map(o => h('option', { key: o, value: o }, o))));
      const S1 = sim.ver ? S0 || (de && a ? SM.simular(v, p.extras, sim.n, de, a) : null) : null;
      const simBox = h('div', { id: 'mon-sim', role: 'group', 'aria-labelledby': 'mon-sim-t', style: { display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: 10, background: '#eef5fd' } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } }, h('b', { id: 'mon-sim-t', style: { fontSize: 14, color: C.strong } }, 'Simular reasignación:'),
          selS('mon-sim-n', 'mover', String(sim.n), ['3', '5', '7'], (x) => setSim(Object.assign({}, sim, { n: +x, ver: false }))), selS('mon-sim-de', 'casos de', de, eleg.map(r => r.persona).length ? eleg.map(r => r.persona) : [''], (x) => setSim(Object.assign({}, sim, { de: x, a: '', ver: false }))), selS('mon-sim-a', 'a', a, dest.length ? dest : [''], (x) => setSim(Object.assign({}, sim, { a: x, ver: false }))),
          Btn('secondary', 'Ver el efecto', () => setSim({ n: sim.n, de, a, ver: true }), Object.assign({ id: 'mon-sim-ver' }, !de || !a ? { unavailableReason: 'Elige una persona con casos y otra del mismo rol y alcance' } : {})),
          sim.ver ? linkBtn('Quitar la simulación', () => setSim(Object.assign({}, sim, { ver: false })), { id: 'mon-sim-quitar' }) : null),
        S1 ? h('div', { id: 'mon-sim-res', tabIndex: -1, role: 'status', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 12px', fontSize: 14, color: C.body, outline: 'none' } }, h('span', { style: { flex: '1 1 420px', textWrap: 'pretty' } }, S1.de.split(' ')[0] + ' bajaría de ' + pct(S1.cargaDe[0]) + ' a ' + pct(S1.cargaDe[1]) + ' y ' + S1.a.split(' ')[0] + ' subiría de ' + pct(S1.cargaA[0]) + ' a ' + pct(S1.cargaA[1]) + ' (promedio de 5 días). Espera estimada en ' + S1.estado + ': de ' + hTxt(S1.espera[0]) + ' a ' + hTxt(S1.espera[1]) + ' (ley de Little: casos en espera ÷ casos que cada persona puede cerrar por día).'),
          Btn('primary', 'Reasignar ahora', () => abrirReas(S1.ids, S1.de, (base.filas.find(r => r.persona === S1.de) || {}).rol, S1.a), Object.assign({ id: 'mon-sim-reasignar' }, S1.n ? {} : { unavailableReason: 'La persona no tiene casos en ' + S1.estado }))) : null);
      return panel('mon-carga', 'Carga frente a capacidad · ' + (MC.horizonte || 'próximos 5 días hábiles').toLowerCase(), (MC.carga || '') + '. Capacidad: ' + (MC.capacidad || '') + '. Los casos a cargo se reparten en los 5 días (más al inicio) y se suman las llegadas de los últimos 5 días hábiles' + (S0 ? '. Se muestra la simulación.' : '.'), null, tabla, leyenda, simBox,
        h('details', null, h('summary', { style: { cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.strong } }, 'Cómo se simula'), h('p', { style: { margin: '6px 0 0', fontSize: 13, color: C.body } }, MC.simulacion || '')));
    }
    // ----- Reasignación (motivo e impacto; regla de Flujo y SLA) -----
    function abrirReas(ids, de, rol, a) { setReas({ ids: ids.slice(), sel: ids.slice(), de, rol, a: a || '', motivo: '', tried: false }); }
    function reasModal() {
      const Mo = window.SiriusModal, f = F(), x = reas, dest = SM.destinosDe(v, p.extras, x.de, x.rol), a = x.a || dest[0] || '', est = SM.ESTADO_ROL[x.rol], sim2 = a && est ? SM.simular(v, p.extras, x.sel.length, x.de, a) : null;
      const regla = ((f.reglas || {}).reasignacion || f.reasignacion || (f.reglasReasignacion) || []).find ? (((f.reasignacion) || []).find(r => x.rol === 'Ejecutivo de inspecciones' ? /Ejecutivo de inspecciones responsable/.test(r.que) : x.rol === 'Inspector' ? /Inspector/.test(r.que) : /Coordinador|Suscriptor/.test(r.que)) || null) : null;
      const motOk = x.motivo.trim().length >= 10, listo = x.sel.length && a && motOk;
      const set = (o) => setReas(Object.assign({}, x, o));
      const ok = () => { set({ tried: true }); if (!listo) { const el = document.getElementById(!x.sel.length ? 'mon-rs-c-0' : !a ? 'mon-rs-a' : 'mon-rs-motivo'); if (el) el.focus(); return; } SM.reasignar(x.sel, x.de, a, x.rol, x.motivo.trim()); if (p.onReasignar) p.onReasignar({ ids: x.sel, de: x.de, a, rol: x.rol, motivo: x.motivo.trim() }); setReas(null); setSim(Object.assign({}, sim, { ver: false })); };
      const casosT = x.ids.map(id => { const c = v.casos.find(y => y.id === id), t = c ? c.tramos.find(y => y.salida == null) : null; return { id, estado: t ? t.estado : (c || {}).estado, horas: t ? (eje().nowB - t.entrada) / 60 : 0, ej: c && !c.real }; });
      const cuerpo = h('div', { id: 'mon-reasignar', style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        h('fieldset', { style: { border: 'none', margin: 0, padding: 0 } }, h('legend', { style: { fontSize: 13, fontWeight: 700, color: C.strong, marginBottom: 6 } }, 'Casos (' + x.sel.length + ' de ' + x.ids.length + ', los más antiguos primero)'),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 } }, casosT.map((c, i) => h('label', { key: c.id, htmlFor: 'mon-rs-c-' + i, style: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: C.body, border: '1px solid ' + C.borde, borderRadius: 8, padding: '6px 8px' } }, h('input', { id: 'mon-rs-c-' + i, type: 'checkbox', checked: x.sel.includes(c.id), onChange: (ev) => set({ sel: ev.target.checked ? x.sel.concat(c.id) : x.sel.filter(y => y !== c.id) }) }), h('span', null, h('b', { style: { color: C.strong } }, c.id), (c.ej ? ' (ejemplo)' : '') + ' · ' + corta(c.estado || '') + ' · ' + hTxt(c.horas)))))),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: 'mon-rs-a', style: { fontSize: 13, fontWeight: 700, color: C.strong } }, 'De ' + x.de + ' a'), h('select', { id: 'mon-rs-a', value: a, onChange: (ev) => set({ a: ev.target.value }), style: { height: 40, maxWidth: 320, padding: '0 8px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: C.strong } }, dest.map(d => h('option', { key: d, value: d }, d))), h('span', { style: { fontSize: 12, color: C.muted } }, 'Solo personas activas del mismo rol (' + x.rol + ') y alcance.')),
        h('div', { id: 'mon-rs-impacto', style: { padding: 10, borderRadius: 8, background: 'var(--surface-subtle, #F3F5F8)', fontSize: 13, color: C.body } }, h('b', { style: { color: C.strong } }, 'Impacto: '), sim2 ? x.de + ' pasa de ' + pct(sim2.cargaDe[0]) + ' a ' + pct(sim2.cargaDe[1]) + ' de carga y ' + a + ' de ' + pct(sim2.cargaA[0]) + ' a ' + pct(sim2.cargaA[1]) + '; espera estimada en ' + sim2.estado + ' de ' + hTxt(sim2.espera[0]) + ' a ' + hTxt(sim2.espera[1]) + '. ' : '', 'El responsable de ' + (x.sel.length === 1 ? '1 caso' : x.sel.length + ' casos') + ' cambia; el SLA no se reinicia y queda en el Historial de cada caso.', regla ? h('span', { style: { display: 'block', marginTop: 4, fontSize: 12, color: C.muted } }, 'Regla de Flujo y SLA: ' + regla.que + ' · ' + regla.quien + ' · ' + regla.efecto + '.') : null),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: 'mon-rs-motivo', style: { fontSize: 13, fontWeight: 700, color: C.strong } }, 'Motivo *'), h('textarea', { id: 'mon-rs-motivo', rows: 2, value: x.motivo, onChange: (ev) => set({ motivo: ev.target.value }), 'aria-invalid': x.tried && !motOk ? 'true' : undefined, 'aria-describedby': 'mon-rs-motivo-e', style: { width: '100%', padding: 8, border: '1.5px solid ' + (x.tried && !motOk ? C.danger : 'var(--input-outlined-border)'), borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14 } }), h('span', { id: 'mon-rs-motivo-e', role: x.tried && !motOk ? 'alert' : undefined, style: { fontSize: 12, color: x.tried && !motOk ? C.danger : C.muted } }, x.tried && !motOk ? 'Escribe el motivo (al menos 10 caracteres).' : 'Queda en el Historial de cada caso.')));
      const pie = h(R().Fragment, null, Btn('ghost', 'Cancelar', () => setReas(null)), Btn('primary', 'Reasignar ' + (x.sel.length === 1 ? '1 caso' : x.sel.length + ' casos'), ok, Object.assign({ id: 'mon-rs-ok' }, !x.sel.length ? { unavailableReason: 'Elige al menos un caso' } : !a ? { unavailableReason: 'No hay otra persona del mismo rol y alcance' } : !motOk ? { unavailableReason: 'Escribe el motivo (al menos 10 caracteres)' } : {})));
      return Mo ? h(Mo, { open: true, onClose: () => setReas(null), size: 'lg', align: 'left', title: 'Reasignar casos de ' + x.de, description: 'Cambia el responsable en el estado actual del caso.', footer: pie }, cuerpo) : cuerpo;
    }
  }
  const thS = { textAlign: 'left', padding: '9px 10px', fontSize: 12, fontWeight: 700, color: 'var(--text-strong)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap', background: 'var(--table-row-hover, #f5f8fb)', position: 'sticky', top: 0 };
  const tdS = { padding: '8px 10px', fontSize: 13, color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' };
  const tdN = Object.assign({}, tdS, { textAlign: 'right', whiteSpace: 'nowrap' }), tdD = Object.assign({}, tdS, { whiteSpace: 'nowrap' });
  SM.Vista = Vista;

  // Ventana «Cronología» de un caso (se abre desde la Bandeja filtrada por el Monitor).
  function Cronologia(p) { const Mo = window.SiriusModal, x = SM.cronologia(p.caso, p.casos); if (!x) return null; const c = x.caso;
    const cuerpo = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, h('p', { style: { margin: 0, fontSize: 14, color: C.body } }, (c.real ? 'Caso del prototipo' : 'Caso de la cronología de ejemplo (prototipo)') + ' · ' + c.ramo + ' · ' + c.sucursal + ' · ' + c.modalidad + ' · ' + (c.flujo ? c.flujo + ' v' + c.version : '') + (x.cierre ? ' · ' + x.cierre : '')),
      h('div', { style: { overflowX: 'auto' } }, h('table', { id: 'mon-cron-tabla', style: { width: '100%', borderCollapse: 'collapse', minWidth: 820, wordBreak: 'normal', overflowWrap: 'normal' } }, h('caption', { style: sr }, 'Cronología del caso ' + c.id), h('thead', null, h('tr', null, ['Estado', 'Entrada', 'Inicio del trabajo', 'Fin (transición)', 'Actor y rol', 'Espera', 'Trabajo', 'Causa'].map(k => h('th', { key: k, scope: 'col', style: thS }, k)))),
        h('tbody', null, x.filas.map((f, i) => h('tr', { key: i }, h('th', { scope: 'row', style: Object.assign({}, tdS, { textAlign: 'left', color: C.strong, minWidth: 120 }) }, corta(f.estado), f.devolucion ? h('span', { style: { display: 'block', fontSize: 11, color: ROJO } }, 'Devuelto: ' + f.devolucion) : null), h('td', { style: tdD }, f.entrada), h('td', { style: tdD }, f.inicio), h('td', { style: tdD }, f.fin), h('td', { style: tdS }, f.actor, h('span', { style: { display: 'block', fontSize: 11, color: C.muted } }, f.rol)), h('td', { style: tdN }, f.espera), h('td', { style: tdN }, f.trabajo), h('td', { style: tdS }, f.causa)))))));
    return Mo ? h(Mo, { open: true, onClose: p.onClose, size: 'lg', align: 'left', title: 'Cronología · caso ' + c.id, description: c.asegurado || '', footer: Btn('primary', 'Cerrar', p.onClose) }, cuerpo) : cuerpo; }
  SM.Cronologia = Cronologia;
})();
