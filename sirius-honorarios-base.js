// SIRIUS · Honorarios y liquidaciones de la base (v1.0 · provisional · etapa P-6g-1 · DEC-214 · 18/10/2026).
// Con la conexión, Liquidaciones lee SIRIUS_CONEXION.honorarios y SIRIUS_CONEXION.liquidaciones (nada sale del ejemplo); sin la conexión, todo sigue
// con SiriusHonorarios y SiriusLiquidaciones como antes.
// Contrato:
//   honorarios[] = { id, caso, visita (VN), fecha, inspector, inspectorId, agencia, agenciaRuc, monto, moneda, concepto, estado, motivo, liquidacionId }
//   liquidaciones[] = { id, periodo (AAAA-MM), beneficiario { tipo: 'agencia' | 'inspector', nombre, identificacion }, estado, total, honorarios [ids],
//                       pago { fecha, referencia, cuenta } | null, historial [{ fecha, por, que, motivo }] }
// Ciclo del honorario: «Por aprobar» (al terminar la visita) → «Aprobado» o «Rechazado» (motivo de 10 caracteres o más; Finanzas o Administrador)
//   → «Liquidado» (al entrar en una liquidación) → «Pagado» (al registrar el pago). Un rechazado se corrige (monto y motivo) y vuelve a «Por aprobar».
// Ciclo de la liquidación: «Abierta» (se agregan o quitan honorarios aprobados del período) → «Cerrada» (total fijo) → «Aprobada» → «Pagada»
//   (fecha, referencia y cuenta). «Anulada»: solo desde Abierta o Cerrada; sus honorarios vuelven a «Aprobado».
// Acciones → { ok, mensaje }: aprobarHonorarios { ids, motivo? }, rechazarHonorario { id, motivo }, corregirHonorario { id, monto, motivo },
//   generarLiquidacion { periodo, beneficiario { tipo, identificacion } } → { ok, mensaje, id }, editarLiquidacion { id, agregar, quitar },
//   cerrarLiquidacion { id }, aprobarLiquidacion { id }, pagarLiquidacion { id, fecha, referencia, cuenta }, anularLiquidacion { id, motivo }.
//   El cambio se ve al instante; con { ok: false } todo vuelve atrás y se devuelve el mensaje de la base.
// Quién ve qué: Finanzas y Administrador, todo (y gestionan); Finanzas de agencia, lo de su agencia (por su RUC); el inspector independiente, sus
//   honorarios y liquidaciones (por su identificación); el inspector de agencia, sus honorarios, sin montos de la liquidación de su agencia.
// Referencias por identificación (DEC-214): inspectorId y agenciaRuc; el nombre que se muestra es el actual (usuarios, inspectores y agencias de la base).
(function () {
  'use strict';
  const W = window; if (W.SiriusHonorariosBase) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), ON = [];
  const S = { EST_H: ['Por aprobar', 'Aprobado', 'Rechazado', 'Liquidado', 'Pagado'], EST_L: ['Abierta', 'Cerrada', 'Aprobada', 'Pagada', 'Anulada'], _hs: null, _h: null, _ls: null, _l: null, nTmp: 0 };
  const C = () => W.SIRIUS_CONEXION || null;
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  S.activo = () => { const c = C(); return !!(c && c.activo === true); };
  const sd = (x) => String(x == null ? '' : x).trim();
  S.r2 = (n) => Math.round((Number(n) + 1e-9) * 100) / 100;
  S.usd = (n) => (n == null || !isFinite(n) ? '—' : (W.SIRIUS_COMPANIA && W.SIRIUS_COMPANIA.formatoMonto ? W.SIRIUS_COMPANIA.formatoMonto(n) : 'USD ' + Number(n).toFixed(2)));
  // Reloj real de Ecuador (DEC-230): el período actual con la conexión.
  S.hoy = () => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); } };
  S.periodoActual = () => S.hoy().slice(0, 7);
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  S.periodoTxt = (p) => { const m = /^(\d{4})-(\d\d)$/.exec(sd(p)); if (!m) return sd(p); const t = MESES[+m[2] - 1]; return t.charAt(0).toUpperCase() + t.slice(1) + ' de ' + m[1]; };
  const normH = (x) => { x = x || {}; return { id: sd(x.id), caso: sd(x.caso), visita: x.visita == null ? '' : x.visita, fecha: sd(x.fecha), inspector: sd(x.inspector), inspectorId: sd(x.inspectorId), agencia: sd(x.agencia), agenciaRuc: sd(x.agenciaRuc),
    monto: Number(x.monto) || 0, moneda: sd(x.moneda) || 'USD', concepto: sd(x.concepto), estado: S.EST_H.indexOf(x.estado) >= 0 ? x.estado : 'Por aprobar', motivo: sd(x.motivo), liquidacionId: sd(x.liquidacionId) }; };
  const normL = (x) => { x = x || {}; const b = x.beneficiario || {}; return { id: sd(x.id), periodo: sd(x.periodo), beneficiario: { tipo: b.tipo === 'agencia' ? 'agencia' : 'inspector', nombre: sd(b.nombre), identificacion: sd(b.identificacion) },
    estado: S.EST_L.indexOf(x.estado) >= 0 ? x.estado : 'Abierta', total: Number(x.total) || 0, honorarios: Array.isArray(x.honorarios) ? x.honorarios.map(sd) : [], pago: x.pago ? { fecha: sd(x.pago.fecha), referencia: sd(x.pago.referencia), cuenta: sd(x.pago.cuenta) } : null,
    historial: Array.isArray(x.historial) ? clon(x.historial) : [] }; };
  // Copias de la sesión: si la base reemplaza el arreglo, se vuelven a leer.
  S.honorarios = () => { const c = C(), src = c && Array.isArray(c.honorarios) ? c.honorarios : []; if (src !== S._hs || !S._h) { S._hs = src; S._h = src.map(normH); } return S._h; };
  S.liquidaciones = () => { const c = C(), src = c && Array.isArray(c.liquidaciones) ? c.liquidaciones : []; if (src !== S._ls || !S._l) { S._ls = src; S._l = src.map(normL); } return S._l; };
  S.hon = (id) => S.honorarios().find((x) => x.id === sd(id)) || null;
  S.liq = (id) => S.liquidaciones().find((x) => x.id === sd(id)) || null;
  S.reset = () => { S._hs = S._h = S._ls = S._l = null; avisar(); };
  // Nombres actuales por identificación (DEC-214).
  const personas = () => { const c = C() || {}; return (Array.isArray(c.usuarios) ? c.usuarios : []).concat(Array.isArray(c.inspectores) ? c.inspectores : []); };
  const agencias = () => { const c = C() || {}; return Array.isArray(c.agencias) ? c.agencias : []; };
  S.agencia = (ruc) => agencias().find((a) => a && sd(a.ruc) && sd(a.ruc) === sd(ruc)) || null;
  S.agenciaNombre = (ruc, alt) => { const a = S.agencia(ruc); return a ? sd(a.nombreComercial || a.nombre || a.razonSocial) : sd(alt) || sd(ruc); };
  S.personaNombre = (id, alt) => { const p = sd(id) ? personas().find((u) => u && sd(u.identificacion).toUpperCase() === sd(id).toUpperCase()) : null; return p ? sd(p.nombre) : sd(alt) || sd(id); };
  S.inspNombre = (h) => S.personaNombre(h.inspectorId, h.inspector);
  S.benefNombre = (l) => (l.beneficiario.tipo === 'agencia' ? S.agenciaNombre(l.beneficiario.identificacion, l.beneficiario.nombre) : S.personaNombre(l.beneficiario.identificacion, l.beneficiario.nombre));
  // ¿El honorario es de este beneficiario? Agencia por su RUC; inspector independiente por su identificación (sin agencia).
  S.esDe = (h, b) => (b.tipo === 'agencia' ? !!h.agenciaRuc && h.agenciaRuc === sd(b.identificacion) : !h.agenciaRuc && !!h.inspectorId && h.inspectorId.toUpperCase() === sd(b.identificacion).toUpperCase());
  S.periodoDe = (h) => sd(h.fecha).slice(0, 7);
  S.totalDe = (ids) => S.r2(ids.reduce((s, id) => { const h = S.hon(id); return s + (h ? h.monto : 0); }, 0));
  // ---------- Quién ve qué ----------
  // rolBase llega de la pantalla (el rol con que se entra); el usuario, de SIRIUS_CONEXION.usuario.
  S.vista = (rolBase) => { const c = C() || {}, u = c.usuario || {}, id = sd(u.identificacion), ruc = sd(u.agenciaRuc) || ((S.agencia(u.agencia) || agencias().find((a) => a && [a.nombre, a.razonSocial, a.nombreComercial].some((n) => sd(n) && sd(n) === sd(u.agencia))) || {}).ruc || '');
    const indep = sd(u.tipoInspector) === 'independiente' || sd(u.tipo) === 'Independiente';
    if (rolBase === 'Finanzas' || rolBase === 'Administrador') return { tipo: 'todo', gestiona: true, nombre: sd(u.nombre) };
    if (rolBase === 'Finanzas de agencia') return { tipo: 'agencia', gestiona: false, ruc, agencia: S.agenciaNombre(ruc, u.agencia), nombre: sd(u.nombre) };
    if (rolBase === 'Inspector' && indep) return { tipo: 'independiente', gestiona: false, id, nombre: sd(u.nombre) };
    if (rolBase === 'Inspector' && ruc) return { tipo: 'inspectorAgencia', gestiona: false, id, ruc, agencia: S.agenciaNombre(ruc, u.agencia), nombre: sd(u.nombre) };
    return { tipo: 'ninguno', gestiona: false, nombre: sd(u.nombre) }; };
  S.honVisibles = (v) => S.honorarios().filter((h) => v.tipo === 'todo' || (v.tipo === 'agencia' && !!v.ruc && h.agenciaRuc === v.ruc) || ((v.tipo === 'independiente' || v.tipo === 'inspectorAgencia') && !!v.id && h.inspectorId.toUpperCase() === v.id.toUpperCase()));
  S.liqVisibles = (v) => S.liquidaciones().filter((l) => v.tipo === 'todo' || (v.tipo === 'agencia' && l.beneficiario.tipo === 'agencia' && l.beneficiario.identificacion === v.ruc) || (v.tipo === 'independiente' && l.beneficiario.tipo === 'inspector' && l.beneficiario.identificacion.toUpperCase() === v.id.toUpperCase())); // el inspector de agencia no ve liquidaciones
  S.contar = (L) => { const o = {}; S.EST_H.forEach((e) => { o[e] = { n: 0, monto: 0 }; }); L.forEach((h) => { const x = o[h.estado]; x.n++; x.monto = S.r2(x.monto + h.monto); }); return o; };
  // Beneficiarios posibles de un período: agencias (por RUC) e independientes (por identificación) con honorarios aprobados sin liquidar.
  S.beneficiarios = (periodo) => { const out = {}; S.honorarios().filter((h) => S.periodoDe(h) === periodo && h.estado === 'Aprobado').forEach((h) => {
      const b = h.agenciaRuc ? { tipo: 'agencia', identificacion: h.agenciaRuc } : h.inspectorId ? { tipo: 'inspector', identificacion: h.inspectorId } : null; if (!b) return;
      const k = b.tipo + '|' + b.identificacion, x = out[k] || (out[k] = Object.assign(b, { nombre: b.tipo === 'agencia' ? S.agenciaNombre(b.identificacion, h.agencia) : S.personaNombre(b.identificacion, h.inspector), n: 0, monto: 0 })); x.n++; x.monto = S.r2(x.monto + h.monto); });
    return Object.keys(out).map((k) => out[k]).sort((a, b) => a.nombre.localeCompare(b.nombre)); };
  S.disponibles = (l) => S.honorarios().filter((h) => h.estado === 'Aprobado' && S.periodoDe(h) === l.periodo && S.esDe(h, l.beneficiario));
  S.periodos = () => { const s = {}; s[S.periodoActual()] = 1; S.honorarios().forEach((h) => { if (S.periodoDe(h)) s[S.periodoDe(h)] = 1; }); S.liquidaciones().forEach((l) => { if (l.periodo) s[l.periodo] = 1; }); return Object.keys(s).sort().reverse(); };
  // ---------- Base ----------
  const base = (tipo, carga) => { const c = C(); if (!c || typeof c.accion !== 'function') return Promise.resolve({ ok: false, mensaje: 'No hay conexión con la base.' });
    let pr; try { pr = Promise.resolve(c.accion(tipo, carga)); } catch (e) { pr = Promise.resolve({ ok: false, mensaje: (e && e.message) || 'La base no respondió.' }); }
    return pr.then((r) => r || { ok: false, mensaje: 'La base no respondió.' }, (e) => ({ ok: false, mensaje: (e && e.message) || 'La base no respondió.' })); };
  const motivoOk = (m) => sd(m).length >= 10;
  const ahora = () => { const d = new Date(); try { return S.hoy() + 'T' + new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit', hour12: false }).format(d); } catch (e) { return S.hoy() + 'T00:00'; } };
  const no = (m) => Promise.resolve({ ok: false, validacion: true, mensaje: m });
  // Foto de lo que cambia (para volver atrás con { ok: false }).
  const foto = () => ({ h: clon(S.honorarios()), l: clon(S.liquidaciones()) });
  const volver = (f) => { const H = S.honorarios(), L = S.liquidaciones(); H.splice(0, H.length); f.h.forEach((x) => H.push(x)); L.splice(0, L.length); f.l.forEach((x) => L.push(x)); avisar(); };
  const enviar = (tipo, carga, f, ok) => { avisar(); return base(tipo, carga).then((r) => { if (r && r.ok) { if (ok) ok(r); avisar(); return Object.assign({ ok: true }, r); } volver(f); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el cambio.' }; }); };
  const hist = (l, que, por, motivo) => { l.historial.push(Object.assign({ fecha: ahora(), por: sd(por), que }, motivo ? { motivo: sd(motivo) } : {})); };
  const recalc = (l) => { l.total = S.totalDe(l.honorarios); };
  // Honorarios
  S.aprobar = (ids, motivo) => { ids = (ids || []).map(sd).filter(Boolean); if (!ids.length) return no('Elige al menos un honorario «Por aprobar».');
    const xs = ids.map(S.hon); if (xs.some((h) => !h || h.estado !== 'Por aprobar')) return no('Solo se aprueban honorarios «Por aprobar».');
    const f = foto(); xs.forEach((h) => { h.estado = 'Aprobado'; h.motivo = sd(motivo); });
    return enviar('aprobarHonorarios', Object.assign({ ids }, sd(motivo) ? { motivo: sd(motivo) } : {}), f); };
  S.rechazar = (id, motivo) => { const h = S.hon(id); if (!h) return no('Ese honorario ya no está en la lista.'); if (h.estado !== 'Por aprobar') return no('Solo se rechazan honorarios «Por aprobar».'); if (!motivoOk(motivo)) return no('Escribe el motivo (mínimo 10 caracteres).');
    const f = foto(); h.estado = 'Rechazado'; h.motivo = sd(motivo); return enviar('rechazarHonorario', { id: h.id, motivo: sd(motivo) }, f); };
  S.corregir = (id, monto, motivo) => { const h = S.hon(id), m = Number(monto); if (!h) return no('Ese honorario ya no está en la lista.'); if (h.estado !== 'Rechazado') return no('Solo se corrigen honorarios «Rechazado».');
    if (!isFinite(m) || m <= 0) return no('Escribe un monto mayor que 0.'); if (!motivoOk(motivo)) return no('Escribe el motivo (mínimo 10 caracteres).');
    const f = foto(); h.monto = S.r2(m); h.estado = 'Por aprobar'; h.motivo = sd(motivo); return enviar('corregirHonorario', { id: h.id, monto: S.r2(m), motivo: sd(motivo) }, f); };
  // Liquidaciones
  S.generar = (periodo, benef, por) => { const p = sd(periodo), b = { tipo: benef && benef.tipo === 'agencia' ? 'agencia' : 'inspector', identificacion: sd(benef && benef.identificacion) };
    if (!/^\d{4}-\d\d$/.test(p)) return no('Elige el período (AAAA-MM).'); if (!b.identificacion) return no('Elige el beneficiario.');
    if (S.liquidaciones().some((l) => l.periodo === p && l.estado !== 'Anulada' && l.beneficiario.tipo === b.tipo && l.beneficiario.identificacion === b.identificacion)) return no('Ya hay una liquidación de ' + (b.tipo === 'agencia' ? S.agenciaNombre(b.identificacion) : S.personaNombre(b.identificacion)) + ' para ' + S.periodoTxt(p) + '.');
    const f = foto(), hs = S.honorarios().filter((h) => h.estado === 'Aprobado' && S.periodoDe(h) === p && S.esDe(h, b)), tmp = 'LIQ-nueva-' + (++S.nTmp);
    const l = normL({ id: tmp, periodo: p, beneficiario: Object.assign({ nombre: b.tipo === 'agencia' ? S.agenciaNombre(b.identificacion) : S.personaNombre(b.identificacion) }, b), estado: 'Abierta', honorarios: hs.map((h) => h.id) });
    hs.forEach((h) => { h.estado = 'Liquidado'; h.liquidacionId = tmp; }); recalc(l); hist(l, 'Generada con ' + hs.length + (hs.length === 1 ? ' honorario aprobado' : ' honorarios aprobados'), por); S.liquidaciones().push(l);
    return enviar('generarLiquidacion', { periodo: p, beneficiario: b }, f, (r) => { const nid = sd(r.id) || tmp; l.id = nid; hs.forEach((h) => { h.liquidacionId = nid; }); }).then((r) => Object.assign({ id: r.ok ? l.id : '' }, r)); };
  S.editar = (id, agregar, quitar, por) => { const l = S.liq(id); agregar = (agregar || []).map(sd).filter(Boolean); quitar = (quitar || []).map(sd).filter(Boolean);
    if (!l) return no('Esa liquidación ya no está en la lista.'); if (l.estado !== 'Abierta') return no('Solo se cambian los honorarios de una liquidación «Abierta».'); if (!agregar.length && !quitar.length) return no('No hay cambios.');
    const disp = S.disponibles(l).map((h) => h.id); if (agregar.some((x) => disp.indexOf(x) < 0)) return no('Solo se agregan honorarios «Aprobado» del mismo período y beneficiario.'); if (quitar.some((x) => l.honorarios.indexOf(x) < 0)) return no('Ese honorario no está en la liquidación.');
    const f = foto(); quitar.forEach((x) => { const h = S.hon(x); if (h) { h.estado = 'Aprobado'; h.liquidacionId = ''; } }); agregar.forEach((x) => { const h = S.hon(x); if (h) { h.estado = 'Liquidado'; h.liquidacionId = l.id; } });
    l.honorarios = l.honorarios.filter((x) => quitar.indexOf(x) < 0).concat(agregar); recalc(l);
    hist(l, [agregar.length ? 'Agregó ' + agregar.join(', ') : '', quitar.length ? 'Quitó ' + quitar.join(', ') : ''].filter(Boolean).join(' · '), por);
    return enviar('editarLiquidacion', { id: l.id, agregar, quitar }, f); };
  const paso = (id, de, a, tipo, que, por, extra) => { const l = S.liq(id); if (!l) return no('Esa liquidación ya no está en la lista.'); if (de.indexOf(l.estado) < 0) return no('La liquidación está «' + l.estado + '».');
    const f = foto(); l.estado = a; if (extra) extra(l); hist(l, que, por); return enviar(tipo, { id: l.id }, f); };
  // Cerrar sin honorarios lo rechaza la base (la regla vive allí); la pantalla lo avisa antes de enviar.
  S.cerrar = (id, por) => paso(id, ['Abierta'], 'Cerrada', 'cerrarLiquidacion', 'Cerrada: total fijo', por);
  S.aprobarLiq = (id, por) => paso(id, ['Cerrada'], 'Aprobada', 'aprobarLiquidacion', 'Aprobada', por);
  S.pagar = (id, pago, por) => { const l = S.liq(id), p = { fecha: sd(pago && pago.fecha), referencia: sd(pago && pago.referencia), cuenta: sd(pago && pago.cuenta) };
    if (!l) return no('Esa liquidación ya no está en la lista.'); if (l.estado !== 'Aprobada') return no('Solo se paga una liquidación «Aprobada».'); if (!/^\d{4}-\d\d-\d\d$/.test(p.fecha)) return no('Escribe la fecha del pago.'); if (!p.referencia) return no('Escribe la referencia del pago.');
    const f = foto(); l.estado = 'Pagada'; l.pago = p; l.honorarios.forEach((x) => { const h = S.hon(x); if (h) h.estado = 'Pagado'; }); hist(l, 'Pagada · ' + p.fecha.split('-').reverse().join('/') + ' · ref. ' + p.referencia + (p.cuenta ? ' · ' + p.cuenta : ''), por);
    return enviar('pagarLiquidacion', { id: l.id, fecha: p.fecha, referencia: p.referencia, cuenta: p.cuenta }, f); };
  S.anular = (id, motivo, por) => { const l = S.liq(id); if (!l) return no('Esa liquidación ya no está en la lista.'); if (['Abierta', 'Cerrada'].indexOf(l.estado) < 0) return no('Solo se anula una liquidación «Abierta» o «Cerrada».'); if (!motivoOk(motivo)) return no('Escribe el motivo (mínimo 10 caracteres).');
    const f = foto(); l.honorarios.forEach((x) => { const h = S.hon(x); if (h) { h.estado = 'Aprobado'; h.liquidacionId = ''; } }); l.estado = 'Anulada'; hist(l, 'Anulada: sus honorarios vuelven a «Aprobado»', por, motivo);
    return enviar('anularLiquidacion', { id: l.id, motivo: sd(motivo) }, f); };
  W.SiriusHonorariosBase = S;
})();
