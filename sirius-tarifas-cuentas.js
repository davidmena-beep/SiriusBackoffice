// SIRIUS · Tarifas de la agencia a sus inspectores, honorarios según el tipo de inspector y cuentas bancarias (etapa 15-4 · DEC-174).
// Lee SIRIUS_TARIFAS_CUENTAS (datos-tarifas-cuentas.js), SIRIUS_APP_INSPECTOR.honorarios (v1.2), SiriusHonorarios, SiriusLiquidaciones y
// SIRIUS_USUARIOS. Los cambios viven en memoria (al recargar vuelve lo del archivo; cambiar de escena los reinicia con reset()).
// · window.SiriusTarifasCuentas: tarifas agencia → inspector (vigencia sin cruces, motivo e historial), honorarios del inspector de agencia
//   (visitas y acumulado a la tarifa de su agencia; nunca lo que la agencia cobra a la aseguradora), honorarios del independiente (por aprobar,
//   aprobados y pagados, con el estado de pago simulado de CNX-12), «Lo que pagamos a nuestros inspectores» (informativa) y cuentas bancarias
//   (validación, cambio «Pendiente de aprobación» hasta que Finanzas lo aprueba con motivo, número enmascarado fuera de Finanzas y del titular).
// · Componentes: SiriusCuentaBancaria, SiriusTarifasAgencia y SiriusPagosAgencia (Usuarios y roles y Liquidaciones).
(function () {
  if (window.SiriusTarifasCuentas) return;
  var W = window;
  var D = function () { return W.SIRIUS_TARIFAS_CUENTAS || { bancos: [], tiposCuenta: [], tarifasAgencia: [], cuentas: [], cambios: [], actividad: [], pagosSimulados: [], identificaciones: {}, grupos: [], validacion: {} }; };
  var clon = function (x) { return JSON.parse(JSON.stringify(x)); };
  var z2 = function (n) { return String(n).padStart(2, '0'); };
  var TC = { version: 0 };
  var ON = [];
  function nuevo() { var d = D(); return { tarifas: clon(d.tarifasAgencia || []), cuentas: clon(d.cuentas || []), cambios: clon(d.cambios || []), hist: [], seqT: 0, seqC: 0 }; }
  var S = nuevo();
  TC.S = function () { return S; };
  TC.on = function (f) { ON.push(f); return function () { ON = ON.filter(function (g) { return g !== f; }); }; };
  function avisar() { TC.version++; ON.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  TC.reset = function () { S = nuevo(); avisar(); };
  TC.ahora = function () { var E = W.SIRIUS_EJEMPLO, d = E && E.ahora ? E.ahora() : new Date(); return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes()); };
  TC.usd = function (n) { var C = W.SIRIUS_COMPANIA; return C && C.formatoMonto ? C.formatoMonto(n || 0) : 'USD ' + Number(n || 0).toFixed(2); };
  TC.fecha = function (s) { var m = /^(\d{4})-(\d\d)-(\d\d)/.exec(s || ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) : ''; };
  TC.fechaHora = function (s) { var m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(s || ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + ' · ' + m[4] + ':' + m[5] : TC.fecha(s); };
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  TC.mesTxt = function (p) { var m = /^(\d{4})-(\d\d)/.exec(p || ''); return m ? MESES[+m[2] - 1] + ' ' + m[1] : p; };
  TC.bancos = function () { return D().bancos || []; };
  TC.tipos = function () { return D().tiposCuenta || []; };
  TC.grupos = function () { return D().grupos || []; };
  TC.unidades = function (g) { var x = TC.grupos().find(function (y) { return y.id === g; }); return x ? x.unidades : ['visita']; };
  function log(por, objeto, accion, motivo) { S.hist.unshift({ fecha: TC.ahora(), por: por, objeto: objeto, accion: accion, motivo: motivo || '' }); }
  TC.hist = function (objeto) { return S.hist.filter(function (x) { return !objeto || x.objeto === objeto; }); };
  var SU = function () { return W.SiriusUsuarios || null; };
  TC.agencia = function (id) { var s = SU(); return s && s.agencia ? s.agencia(id) : ((W.SIRIUS_USUARIOS || {}).agencias || []).find(function (a) { return a.id === id; }) || null; };
  TC.inspectoresDe = function (id) { var s = SU(); return s && s.inspectoresDe ? s.inspectoresDe(id).filter(function (u) { return (u.roles || []).some(function (r) { return (s.base ? s.base(r) : r) === 'Inspector'; }); }).map(function (u) { return u.nombre; }) : []; };
  TC.usuario = function (n) { var s = SU(); return s && s.usuario ? s.usuario(n) : null; };

  // ---------- Tarifas de la agencia a sus inspectores ----------
  TC.unidadTxt = function (u) { return u === 'hora' ? 'por hora' : 'por visita'; };
  TC.tarifaTxt = function (t) { return t ? TC.usd(t.valor) + ' ' + TC.unidadTxt(t.unidad) : '—'; };
  TC.vigenteEn = function (t, fecha) { var f = String(fecha || TC.ahora()).slice(0, 10); return t.desde <= f && (!t.hasta || t.hasta >= f); };
  TC.tarifas = function (agencia) { return S.tarifas.filter(function (t) { return t.agencia === agencia; }).sort(function (a, b) { return (a.inspector || '') < (b.inspector || '') ? -1 : (a.inspector || '') > (b.inspector || '') ? 1 : a.grupo < b.grupo ? -1 : a.grupo > b.grupo ? 1 : a.desde < b.desde ? 1 : -1; }); };
  // Tarifa que aplica a un inspector de agencia en una fecha: la propia del inspector; si no tiene, la general de la agencia.
  TC.tarifa = function (agencia, inspector, grupo, fecha) {
    var L = S.tarifas.filter(function (t) { return t.agencia === agencia && t.grupo === grupo && TC.vigenteEn(t, fecha); });
    var propia = L.find(function (t) { return t.inspector === inspector; }), gen = L.find(function (t) { return !t.inspector; });
    return propia ? Object.assign({ origen: 'propia' }, propia) : gen ? Object.assign({ origen: 'general' }, gen) : null; };
  TC.sumarDia = function (f, n) { var p = f.split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2] + n); return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()); };
  // Valida y muestra qué tarifa reemplaza (misma agencia, mismo «a quién» y mismo grupo, vigente en la fecha de inicio).
  TC.validarTarifa = function (t) { var e = {}, v = D().validacion || {};
    if (!t.grupo) e.grupo = 'Elige el grupo de ramo.';
    if (TC.unidades(t.grupo).indexOf(t.unidad) < 0) e.unidad = t.grupo === 'Vehículos' ? 'En Vehículos la tarifa es fija por visita.' : 'Elige por visita o por hora.';
    if (!(t.valor > 0)) e.valor = 'Escribe un valor mayor que cero.';
    if (!/^\d{4}-\d\d-\d\d$/.test(t.desde || '')) e.desde = 'Elige desde cuándo rige.';
    if (String(t.motivo || '').trim().length < (v.motivoMin || 10)) e.motivo = 'Escribe el motivo (mínimo ' + (v.motivoMin || 10) + ' caracteres): queda en el historial.';
    var prev = S.tarifas.find(function (x) { return x.agencia === t.agencia && (x.inspector || null) === (t.inspector || null) && x.grupo === t.grupo && TC.vigenteEn(x, t.desde); });
    var fut = S.tarifas.find(function (x) { return x.agencia === t.agencia && (x.inspector || null) === (t.inspector || null) && x.grupo === t.grupo && x.desde > (t.desde || ''); });
    if (!e.desde && prev && prev.desde >= t.desde) e.desde = 'Ya hay una tarifa que empieza el ' + TC.fecha(prev.desde) + ': elige una fecha posterior.';
    if (!e.desde && fut) e.desde = 'Ya hay una tarifa programada desde el ' + TC.fecha(fut.desde) + '.';
    return { errores: e, ok: !Object.keys(e).length, reemplaza: prev || null }; };
  TC.guardarTarifa = function (t, por) { var r = TC.validarTarifa(t); if (!r.ok) return r;
    if (r.reemplaza) r.reemplaza.hasta = TC.sumarDia(t.desde, -1);
    S.seqT++; var n = { id: 'TAI-' + String(t.agencia).slice(0, 3).toUpperCase() + '-N' + S.seqT, agencia: t.agencia, inspector: t.inspector || null, grupo: t.grupo, unidad: t.unidad, valor: t.valor, desde: t.desde, hasta: null, motivo: String(t.motivo).trim(), por: por, at: TC.ahora() };
    S.tarifas.push(n); var ag = TC.agencia(t.agencia) || { nombre: t.agencia };
    log(por, 'Tarifas de ' + ag.nombre, 'Tarifa ' + (t.inspector ? 'de ' + t.inspector : 'general') + ' · ' + t.grupo + ': ' + TC.tarifaTxt(n) + ' desde el ' + TC.fecha(t.desde) + (r.reemplaza ? ' (antes ' + TC.tarifaTxt(r.reemplaza) + ', hasta el ' + TC.fecha(r.reemplaza.hasta) + ')' : ''), n.motivo);
    avisar(); return { ok: true, tarifa: n, reemplaza: r.reemplaza }; };

  // ---------- Honorarios según el tipo de inspector ----------
  var H = function () { return W.SiriusHonorarios || null; }, LQ = function () { return W.SiriusLiquidaciones || null; };
  var grupoHon = function (h) { return h.ramo === 'Equipo y maquinaria' ? 'Equipo y maquinaria' : h.grupo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales'; };
  var horasHon = function (h) { if (h.grupo === 'Vehículos') return 0; var c = h.calculo || {}, x = Number(c.horasVisita || c.horas || (typeof h.horasEvid === 'number' ? h.horasEvid : 0)); return isFinite(x) ? x : 0; };
  // Visitas del inspector de agencia en el periodo: las de ejemplo, los honorarios de sus casos y los informes enviados desde la app en la sesión.
  TC.visitasAgencia = function (agencia, periodo) { var out = [];
    (D().actividad || []).filter(function (a) { return a.agencia === agencia && a.periodo === periodo; }).forEach(function (a) { out.push({ inspector: a.inspector, grupo: a.grupo, visitas: a.visitas, horas: a.horas || 0, fecha: periodo + '-15', origen: 'Visitas registradas (ejemplo)' }); });
    var vistos = {};
    (H() ? H().lista() : []).filter(function (h) { return h.agencia === agencia && String(h.fecha || '').slice(0, 7) === periodo; }).forEach(function (h) { vistos[h.caso] = 1; out.push({ inspector: h.inspector, grupo: grupoHon(h), visitas: 1, horas: horasHon(h), fecha: String(h.fecha).slice(0, 10), caso: h.caso, origen: 'Informe del caso ' + h.caso }); });
    var VL = W.SiriusAppVisitaLogic; if (VL && VL.S) Object.keys(VL.S.v || {}).forEach(function (c) { var p = (VL.S.v[c] || {}).enviado; if (!p || vistos[c] || String(p.at || '').slice(0, 7) !== periodo) return; var u = TC.usuario(p.inspector); if (!u || u.agencia !== agencia) return; out.push({ inspector: p.inspector, grupo: 'Vehículos', visitas: 1, horas: 0, fecha: p.at.slice(0, 10), caso: c, origen: 'Informe enviado desde la app (caso ' + c + ')' }); });
    return out; };
  TC.valorVisitas = function (agencia, x) { var t = TC.tarifa(agencia, x.inspector, x.grupo, x.fecha); if (!t) return { valor: 0, tarifa: null };
    return { valor: Math.round((t.unidad === 'hora' ? (x.horas || 0) * t.valor : x.visitas * t.valor) * 100) / 100, tarifa: t }; };
  // «Lo que pagamos a nuestros inspectores» (rol Finanzas de agencia): por inspector, calculado con las tarifas de la agencia. Es informativa.
  TC.pagosAgencia = function (agencia, periodo) { var por = {};
    TC.inspectoresDe(agencia).forEach(function (n) { por[n] = { inspector: n, grupos: {}, visitas: 0, total: 0 }; });
    TC.visitasAgencia(agencia, periodo).forEach(function (x) { var r = por[x.inspector] = por[x.inspector] || { inspector: x.inspector, grupos: {}, visitas: 0, total: 0 }, v = TC.valorVisitas(agencia, x), g = r.grupos[x.grupo] = r.grupos[x.grupo] || { visitas: 0, horas: 0, valor: 0, tarifas: {} };
      g.visitas += x.visitas; g.horas += Number(x.horas) || 0; g.valor = Math.round((g.valor + v.valor) * 100) / 100; if (v.tarifa) g.tarifas[TC.tarifaTxt(v.tarifa) + (v.tarifa.origen === 'propia' ? ' (propia)' : '')] = 1; r.visitas += x.visitas; r.total = Math.round((r.total + v.valor) * 100) / 100; });
    var filas = Object.keys(por).map(function (k) { return por[k]; }).sort(function (a, b) { return a.inspector < b.inspector ? -1 : 1; });
    return { filas: filas, total: Math.round(filas.reduce(function (s, r) { return s + r.total; }, 0) * 100) / 100, visitas: filas.reduce(function (s, r) { return s + r.visitas; }, 0) }; };
  TC.periodosAgencia = function (agencia) { var s = {}; (D().actividad || []).filter(function (a) { return a.agencia === agencia; }).forEach(function (a) { s[a.periodo] = 1; }); (H() ? H().lista() : []).filter(function (h) { return h.agencia === agencia; }).forEach(function (h) { s[String(h.fecha).slice(0, 7)] = 1; }); return Object.keys(s).sort().reverse(); };
  // «Yo» del inspector de agencia: visitas del mes y lo acumulado a SU tarifa. No incluye nada de lo que la agencia cobra a la aseguradora.
  TC.honorariosAgenciaInspector = function (n, periodo) { var u = TC.usuario(n) || {}, ag = TC.agencia(u.agencia) || { id: u.agencia, nombre: u.agencia }, L = TC.visitasAgencia(ag.id, periodo).filter(function (x) { return x.inspector === n; });
    var tot = 0, vis = 0, porGrupo = {}; L.forEach(function (x) { var v = TC.valorVisitas(ag.id, x); tot += v.valor; vis += x.visitas; var g = porGrupo[x.grupo] = porGrupo[x.grupo] || { visitas: 0, valor: 0 }; g.visitas += x.visitas; g.valor += v.valor; });
    var fin = periodo + '-28', tar = TC.grupos().map(function (g) { return TC.tarifa(ag.id, n, g.id, fin); }).filter(Boolean);
    return { agencia: ag, visitas: vis, acumulado: Math.round(tot * 100) / 100, porGrupo: porGrupo, tarifas: tar }; };
  // Honorarios del inspector independiente en el mes: por aprobar, aprobados y pagados (los pagos con el estado simulado de CNX-12).
  var POR_APROBAR = ['Calculado', 'Propuesto', 'Por validar en la agencia', 'Por aprobar', 'Por liquidar', 'Devuelto'], APROBADOS = ['Aprobado', 'Liquidado', 'Facturado', 'Acordado en subasta'];
  TC.estadoPago = function (liqId) { return (D().pagosSimulados || []).find(function (p) { return p.liquidacion === liqId; }) || null; };
  TC.honorariosIndependiente = function (n, periodo) { var L = (H() ? H().lista() : []).filter(function (h) { return h.inspector === n && !h.agencia && String(h.fecha || '').slice(0, 7) === periodo; });
    var det = L.map(function (h) { var cls = h.estado === 'Pagado' ? 'pagado' : APROBADOS.indexOf(h.estado) >= 0 ? 'aprobado' : 'porAprobar'; return { caso: h.caso, fecha: String(h.fecha).slice(0, 10), grupo: grupoHon(h), estado: h.estado, valor: h.valor != null ? h.valor : (h.propuesta != null ? h.propuesta : h.calculado || 0), clase: cls }; });
    var pagos = []; (LQ() ? LQ().lista() : []).filter(function (x) { return x.proveedor === n; }).forEach(function (x) { var p = TC.estadoPago(x.id), f = x.pagada || (p && p.fecha); if (!f || String(f).slice(0, 7) !== periodo) return; pagos.push({ liquidacion: x.id, periodo: x.periodo, lineas: x.nLineas || (x.lineas || []).length, valor: x.total, fecha: String(f).slice(0, 10), referencia: p ? p.referencia : '', simulado: !!(p && p.simulado && !x.pagada) || !!(p && p.simulado) }); });
    var suma = function (c) { return Math.round(det.filter(function (d) { return d.clase === c; }).reduce(function (s, d) { return s + (d.valor || 0); }, 0) * 100) / 100; };
    return { detalle: det, pagos: pagos, porAprobar: suma('porAprobar'), aprobados: suma('aprobado'), pagados: Math.round((suma('pagado') + pagos.reduce(function (s, p) { return s + p.valor; }, 0)) * 100) / 100, visitas: det.length, simulado: pagos.some(function (p) { return p.simulado; }) }; };

  // ---------- Cuentas bancarias ----------
  TC.claveAgencia = function (id) { return 'agencia:' + id; };
  TC.claveInspector = function (n) { return 'insp:' + n; };
  // Titular según la ficha: agencia (razón social y RUC) o inspector independiente (nombre y cédula).
  TC.titular = function (clave) { var p = String(clave).split(':'), k = p[0], id = p.slice(1).join(':');
    if (k === 'agencia') { var a = TC.agencia(id) || {}; return { clave: clave, tipo: 'agencia', id: id, nombre: a.nombre || id, idTipo: 'RUC', identificacion: a.ruc || '' }; }
    var x = (D().identificaciones || {})[id] || {}; return { clave: clave, tipo: 'inspector', id: id, nombre: id, idTipo: x.tipo || 'Cédula', identificacion: x.numero || '' }; };
  TC.cuenta = function (clave) { return S.cuentas.find(function (c) { return c.titular === clave; }) || null; };
  TC.pendiente = function (clave) { return S.cambios.find(function (c) { return c.titular === clave && c.estado === 'Pendiente de aprobación'; }) || null; };
  TC.cambiosDe = function (clave) { return S.cambios.filter(function (c) { return c.titular === clave; }).slice().reverse(); };
  TC.pendientes = function () { return S.cambios.filter(function (c) { return c.estado === 'Pendiente de aprobación'; }); };
  TC.titulares = function () { var out = []; ((W.SIRIUS_USUARIOS || {}).agencias || []).forEach(function (a) { out.push(TC.claveAgencia(a.id)); });
    var s = SU(); (s && s.usuarios ? s.usuarios() : []).filter(function (u) { return u.tipo === 'Externo' && (u.roles || []).some(function (r) { return (s.base ? s.base(r) : r) === 'Inspector'; }); }).forEach(function (u) { out.push(TC.claveInspector(u.nombre)); }); return out; };
  TC.mascara = function (num) { var s = String(num || ''); return s ? '···' + s.slice(-4) : ''; };
  // Quién ve el número completo: Finanzas (de la aseguradora) y el propio titular (Finanzas de su agencia o el inspector independiente).
  TC.puedeVer = function (clave, viewer) { viewer = viewer || {}; var t = TC.titular(clave), u = TC.usuario(viewer.nombre) || {};
    if (viewer.rolBase === 'Finanzas') return true; if (t.tipo === 'agencia') return viewer.rolBase === 'Finanzas de agencia' && u.agencia === t.id; return viewer.nombre === t.id; };
  TC.numero = function (clave, num, viewer) { return TC.puedeVer(clave, viewer) ? String(num || '') : TC.mascara(num); };
  TC.identificacion = function (clave, idn, viewer) { var t = TC.titular(clave); return t.tipo === 'agencia' || TC.puedeVer(clave, viewer) ? String(idn || '') : TC.mascara(idn); };
  var norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); };
  TC.validarCuenta = function (clave, d) { var t = TC.titular(clave), v = D().validacion || {}, e = {}, mn = v.digitosMin || 6, mx = v.digitosMax || 20, num = String(d.numero || '').trim();
    if (TC.bancos().indexOf(d.banco) < 0) e.banco = 'Elige el banco del catálogo.';
    if (TC.tipos().indexOf(d.tipo) < 0) e.tipo = 'Elige si es de ahorros o corriente.';
    if (!num) e.numero = 'Escribe el número de cuenta.'; else if (!/^\d+$/.test(num)) e.numero = 'El número lleva solo dígitos (sin espacios ni guiones).'; else if (num.length < mn || num.length > mx) e.numero = 'El número tiene de ' + mn + ' a ' + mx + ' dígitos (tiene ' + num.length + ').';
    var c = TC.cuenta(clave); if (!e.numero && c && c.numero === num && c.banco === d.banco) e.numero = 'Es la cuenta vigente: no hay nada que cambiar.';
    if (!String(d.nombre || '').trim()) e.nombre = 'Escribe el titular de la cuenta.'; else if (norm(d.nombre) !== norm(t.nombre)) e.nombre = 'El titular debe ser ' + (t.tipo === 'agencia' ? 'la agencia' : 'el inspector') + ' tal como está en la ficha: ' + String(t.nombre).replace(/\.$/, '') + '.';
    var idn = String(d.identificacion || '').trim();
    if (!idn) e.identificacion = 'Escribe ' + (t.idTipo === 'RUC' ? 'el RUC' : 'la cédula') + ' del titular.'; else if (!/^\d+$/.test(idn) || idn.length !== (t.idTipo === 'RUC' ? 13 : 10)) e.identificacion = (t.idTipo === 'RUC' ? 'El RUC tiene 13 dígitos.' : 'La cédula tiene 10 dígitos.'); else if (t.identificacion && idn !== t.identificacion) e.identificacion = (t.idTipo === 'RUC' ? 'El RUC' : 'La cédula') + ' no coincide con la ficha del titular.';
    if (String(d.motivo || '').trim().length < (v.motivoMin || 10)) e.motivo = 'Escribe el motivo (mínimo ' + (v.motivoMin || 10) + ' caracteres).';
    return { errores: e, ok: !Object.keys(e).length }; };
  TC.solicitarCambio = function (clave, d, por) { var r = TC.validarCuenta(clave, d); if (!r.ok) return r; if (TC.pendiente(clave)) return { ok: false, errores: { general: 'Ya hay un cambio pendiente de aprobación.' } };
    S.seqC++; var c = { id: 'CC-N' + S.seqC, titular: clave, banco: d.banco, tipo: d.tipo, numero: String(d.numero).trim(), nombre: String(d.nombre).trim(), identificacion: String(d.identificacion).trim(), estado: 'Pendiente de aprobación', por: por, at: TC.ahora(), motivo: String(d.motivo).trim() };
    S.cambios.push(c); log(por, 'Cuenta de ' + TC.titular(clave).nombre, 'Pidió cambiar la cuenta a ' + c.banco + ' · ' + c.tipo.toLowerCase() + ' ' + TC.mascara(c.numero) + ' (pendiente de aprobación de Finanzas)', c.motivo); avisar(); return { ok: true, cambio: c }; };
  TC.resolverCambio = function (id, decision, por, motivo) { var c = S.cambios.find(function (x) { return x.id === id; }); if (!c || c.estado !== 'Pendiente de aprobación') return false; if (String(motivo || '').trim().length < ((D().validacion || {}).motivoMin || 10)) return false;
    c.resuelto = { por: por, at: TC.ahora(), motivo: String(motivo).trim() };
    if (decision === 'aprobar') { c.estado = 'Aprobado'; var ant = TC.cuenta(c.titular); if (ant) { ant.hasta = TC.ahora().slice(0, 10); c.anterior = { banco: ant.banco, tipo: ant.tipo, numero: ant.numero }; }
      S.cuentas = S.cuentas.filter(function (x) { return x.titular !== c.titular; }).concat([{ titular: c.titular, banco: c.banco, tipo: c.tipo, numero: c.numero, nombre: c.nombre, identificacion: c.identificacion, desde: TC.ahora().slice(0, 10), aprobada: { por: por, at: TC.ahora(), motivo: c.resuelto.motivo } }]); }
    else c.estado = 'Rechazado';
    log(por, 'Cuenta de ' + TC.titular(c.titular).nombre, (decision === 'aprobar' ? 'Aprobó' : 'Rechazó') + ' el cambio a ' + c.banco + ' ' + TC.mascara(c.numero), c.resuelto.motivo); avisar(); return true; };
  TC.cuentaTxt = function (clave, viewer) { var c = TC.cuenta(clave); return c ? c.banco + ' · ' + c.tipo.toLowerCase() + ' ' + TC.numero(clave, c.numero, viewer) : 'Sin cuenta registrada'; };
  TC.backlog = function () { return D().moduloFinanciero || ''; };
  W.SiriusTarifasCuentas = TC;

  // =================== Componentes ===================
  var R = function () { return W.React; }, h = function () { return R().createElement.apply(null, arguments); }, NS = function () { return W.AseguradoraDelSurDesignSystem_4fbf29 || {}; };
  var ST = { lab: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }, help: { fontSize: 12.5, lineHeight: 1.45, color: 'var(--text-muted)' }, err: { fontSize: 13, color: 'var(--color-danger)' },
    inp: function (bad) { return { width: '100%', height: 42, padding: '0 12px', border: '1.5px solid ' + (bad ? 'var(--color-danger)' : 'var(--input-outlined-border,#9fb3c8)'), borderRadius: 'var(--radius-sm,8px)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 15, color: 'var(--text-strong)' }; },
    card: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm,8px)', background: '#FFFFFF' },
    h3: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }, nw: { whiteSpace: 'nowrap' } };
  function useTC() { var s = R().useState(0), set = s[1]; R().useEffect(function () { return TC.on(function () { set(function (x) { return x + 1; }); }); }, []); }
  function boton(variant, label, onClick, o) { o = o || {}; var B = NS().Button; return B ? h(B, Object.assign({ key: o.key || label, variant: variant, size: o.size || 'md', onClick: onClick }, o.reason ? { unavailableReason: o.reason } : {}), label) : h('button', { key: o.key || label, type: 'button', onClick: o.reason ? undefined : onClick, 'aria-disabled': o.reason ? 'true' : undefined, title: o.reason || undefined }, label); }
  function badge(tone, label, key) { var B = NS().Badge; return B ? h(B, { key: key || label, tone: tone, style: { whiteSpace: 'nowrap' } }, label) : h('span', { key: key || label }, label); }
  function campo(id, label, control, err, help, req) { return h('div', { key: id, style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 } }, h('label', { htmlFor: id, style: ST.lab }, label, req ? h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *') : null), control, err ? h('span', { role: 'alert', id: id + '-e', style: ST.err }, err) : null, help ? h('span', { style: ST.help }, help) : null); }
  function dl(pairs) { return h('dl', { style: { margin: 0, display: 'grid', gridTemplateColumns: 'minmax(110px,170px) minmax(0,1fr)', gap: '8px 16px' } }, pairs.filter(Boolean).map(function (p, i) { return [h('dt', { key: 'k' + i, style: { fontSize: 13, color: 'var(--text-muted)' } }, p[0]), h('dd', { key: 'v' + i, style: { margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', minWidth: 0 } }, p[1])]; })); }
  function radios(id, label, opts, val, on, err) { return h('div', { key: id, role: 'radiogroup', 'aria-labelledby': id + '-l', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('span', { id: id + '-l', style: ST.lab }, label, h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, opts.map(function (o) { var sel = o.v === val; return h('button', { key: o.v, type: 'button', role: 'radio', 'aria-checked': sel ? 'true' : 'false', 'aria-disabled': o.dis ? 'true' : undefined, title: o.dis || undefined, onClick: o.dis ? undefined : function () { on(o.v); }, style: { minHeight: 36, padding: '0 14px', borderRadius: 999, border: '1.5px solid ' + (sel ? 'var(--color-brand)' : 'var(--border-default,#c9d3de)'), background: sel ? 'var(--color-brand)' : '#FFFFFF', color: sel ? '#FFFFFF' : o.dis ? 'var(--neutral-500,#8a97a6)' : 'var(--text-strong)', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, cursor: o.dis ? 'not-allowed' : 'pointer' } }, o.l); })), err ? h('span', { role: 'alert', style: ST.err }, err) : null); }
  function motivoArea(id, value, on, err, ph) { return campo(id, 'Motivo', h('textarea', { id: id, rows: 3, value: value || '', placeholder: ph || 'Qué cambia y por qué', 'aria-invalid': err ? 'true' : 'false', onChange: function (e) { on(e.target.value); }, style: Object.assign(ST.inp(!!err), { height: 'auto', padding: '9px 12px', lineHeight: 1.45, resize: 'vertical' }) }), err, null, true); }

  // ---------- Cuenta bancaria ----------
  // props: titular (clave), viewer {nombre, rolBase}, puedePedir, puedeAprobar, onAviso, ancla
  function SiriusCuentaBancaria(p) { useTC(); var clave = p.titular, t = TC.titular(clave), c = TC.cuenta(clave), pe = TC.pendiente(clave), v = p.viewer || {}, ve = TC.puedeVer(clave, v);
    var s0 = R().useState(null), form = s0[0], setForm = s0[1], s1 = R().useState(null), dec = s1[0], setDec = s1[1], s2 = R().useState(false), verH = s2[0], setVerH = s2[1];
    var M = W.SiriusModal, aviso = p.onAviso || function () {};
    var num = function (n) { return h('span', { style: ST.nw, 'data-cuenta-numero': ve ? 'completo' : 'enmascarado' }, TC.numero(clave, n, v)); };
    var vig = c ? dl([['Banco', c.banco], ['Tipo', c.tipo], ['Número', num(c.numero)], ['Titular', c.nombre], [t.idTipo, h('span', { style: ST.nw }, TC.identificacion(clave, c.identificacion, v))], ['Aprobada', h('span', null, h('span', { style: ST.nw }, TC.fecha(c.aprobada ? c.aprobada.at : c.desde)), ' · ' + (c.aprobada ? c.aprobada.por : '—'))]]) : h('p', { style: { margin: 0, fontSize: 14, color: 'var(--text-body)' } }, 'Sin cuenta registrada: Finanzas no puede programar pagos hasta que se registre y se apruebe una.');
    var pend = pe ? h('div', { key: 'pe', role: 'note', 'data-cuenta-pendiente': pe.id, style: { display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', borderRadius: 'var(--radius-sm,8px)', background: 'var(--alert-warning-bg,#FDF3DC)' } },
      h('span', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } }, badge('warning', 'Pendiente de aprobación', 'b'), h('strong', { style: { fontSize: 14, color: 'var(--text-strong)' } }, 'Cambio a ' + pe.banco + ' · ' + pe.tipo.toLowerCase() + ' ', num(pe.numero))),
      h('span', { style: { fontSize: 14, color: 'var(--text-body)' } }, 'Pedido por ' + pe.por + ' el ', h('span', { style: ST.nw }, TC.fechaHora(pe.at)), ' · motivo: ' + pe.motivo + '. Mientras Finanzas no lo apruebe, los pagos usan la cuenta vigente.'),
      p.puedeAprobar ? h('span', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, boton('secondary', 'Rechazar', function () { setDec({ id: pe.id, d: 'rechazar', motivo: '', tried: false }); }, { key: 'r', size: 'sm' }), boton('primary', 'Aprobar el cambio', function () { setDec({ id: pe.id, d: 'aprobar', motivo: '', tried: false }); }, { key: 'a', size: 'sm' })) : null) : null;
    var Lc = TC.cambiosDe(clave).filter(function (x) { return x.estado !== 'Pendiente de aprobación'; });
    var histN = verH ? h('ul', { key: 'hl', style: { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--text-body)' } }, Lc.length ? Lc.map(function (x) { return h('li', { key: x.id }, h('span', { style: ST.nw }, TC.fechaHora(x.resuelto ? x.resuelto.at : x.at)), ' · ' + x.estado + ' el cambio a ' + x.banco + ' ' + TC.numero(clave, x.numero, v) + ' (pedido por ' + x.por + ')' + (x.resuelto ? ' · ' + x.resuelto.por + ': ' + x.resuelto.motivo : '')); }) : h('li', null, 'Sin cambios resueltos: la cuenta vigente se aprobó el ' + (c ? TC.fecha(c.desde) : '—') + '.')) : null;
    var fd = form || {}, ferr = fd.tried ? TC.validarCuenta(clave, fd).errores : {};
    var modalForm = form && M ? h(M, { key: 'mf', open: true, onClose: function () { setForm(null); }, size: 'md', align: 'left', title: 'Cambiar la cuenta de ' + t.nombre, description: 'El cambio queda «Pendiente de aprobación» hasta que Finanzas lo aprueba con motivo; mientras tanto los pagos usan la cuenta vigente.',
      footer: h(R().Fragment, null, boton('ghost', 'Cancelar', function () { setForm(null); }, { key: 'c' }), boton('primary', 'Enviar a aprobación', function () { var r = TC.solicitarCambio(clave, fd, v.nombre || 'Usuario'); if (!r.ok) { setForm(Object.assign({}, fd, { tried: true })); return; } setForm(null); aviso('Cambio de cuenta enviado a Finanzas: queda pendiente de aprobación.'); }, { key: 'o' })) },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        campo('tc-banco', 'Banco', h('select', { id: 'tc-banco', value: fd.banco || '', 'aria-invalid': ferr.banco ? 'true' : 'false', onChange: function (e) { setForm(Object.assign({}, fd, { banco: e.target.value })); }, style: ST.inp(!!ferr.banco) }, [h('option', { key: '', value: '' }, 'Elige el banco')].concat(TC.bancos().map(function (b) { return h('option', { key: b, value: b }, b); }))), ferr.banco, 'Catálogo de bancos', true),
        radios('tc-tipo', 'Tipo de cuenta', TC.tipos().map(function (x) { return { v: x, l: x }; }), fd.tipo, function (x) { setForm(Object.assign({}, fd, { tipo: x })); }, ferr.tipo),
        campo('tc-num', 'Número de cuenta', h('input', { id: 'tc-num', inputMode: 'numeric', autoComplete: 'off', value: fd.numero || '', 'aria-invalid': ferr.numero ? 'true' : 'false', onChange: function (e) { setForm(Object.assign({}, fd, { numero: e.target.value })); }, style: ST.inp(!!ferr.numero) }), ferr.numero, 'Solo dígitos, de 6 a 20. Dato personal (LOPDP): fuera de Finanzas y del titular se muestra enmascarado.', true),
        campo('tc-tit', 'Titular', h('input', { id: 'tc-tit', autoComplete: 'off', value: fd.nombre || '', 'aria-invalid': ferr.nombre ? 'true' : 'false', onChange: function (e) { setForm(Object.assign({}, fd, { nombre: e.target.value })); }, style: ST.inp(!!ferr.nombre) }), ferr.nombre, 'Igual que en la ficha: ' + t.nombre, true),
        campo('tc-id', t.idTipo === 'RUC' ? 'RUC del titular' : 'Cédula del titular', h('input', { id: 'tc-id', inputMode: 'numeric', autoComplete: 'off', value: fd.identificacion || '', 'aria-invalid': ferr.identificacion ? 'true' : 'false', onChange: function (e) { setForm(Object.assign({}, fd, { identificacion: e.target.value.replace(/\D/g, '').slice(0, 13) })); }, style: ST.inp(!!ferr.identificacion) }), ferr.identificacion, t.idTipo === 'RUC' ? '13 dígitos, el de la ficha de la agencia' : '10 dígitos, la de la ficha del inspector', true),
        motivoArea('tc-mot', fd.motivo, function (x) { setForm(Object.assign({}, fd, { motivo: x })); }, ferr.motivo, 'Por qué cambia la cuenta'))) : null;
    var decErr = dec && dec.tried && String(dec.motivo || '').trim().length < 10 ? 'Escribe el motivo (mínimo 10 caracteres): queda en el historial.' : '';
    var modalDec = dec && M ? h(M, { key: 'md', open: true, onClose: function () { setDec(null); }, size: 'sm', align: 'left', title: dec.d === 'aprobar' ? 'Aprobar el cambio de cuenta' : 'Rechazar el cambio de cuenta', description: dec.d === 'aprobar' ? 'Desde que lo apruebas, los pagos a ' + t.nombre + ' van a la cuenta nueva. La anterior queda en el historial.' : 'Los pagos siguen yendo a la cuenta vigente. ' + (t.tipo === 'agencia' ? 'La agencia' : 'El inspector') + ' ve tu motivo.',
      footer: h(R().Fragment, null, boton('ghost', 'Volver', function () { setDec(null); }, { key: 'c' }), boton('primary', dec.d === 'aprobar' ? 'Aprobar' : 'Rechazar', function () { if (String(dec.motivo || '').trim().length < 10) { setDec(Object.assign({}, dec, { tried: true })); return; } TC.resolverCambio(dec.id, dec.d, v.nombre || 'Finanzas', dec.motivo); setDec(null); aviso(dec.d === 'aprobar' ? 'Cambio aprobado: los pagos a ' + t.nombre + ' van a la cuenta nueva.' : 'Cambio rechazado: los pagos siguen yendo a la cuenta vigente.'); }, { key: 'o' })) },
      motivoArea('tc-dec-m', dec.motivo, function (x) { setDec(Object.assign({}, dec, { motivo: x })); }, decErr, dec.d === 'aprobar' ? 'Por ejemplo: certificado bancario verificado' : 'Qué falta o qué no coincide')) : null;
    R().useEffect(function () { if (p.decision && pe && !dec) setDec({ id: pe.id, d: p.decision.d, motivo: p.decision.motivo || '', tried: false }); }, [p.decision ? p.decision.n : 0]);
    return h('section', { 'aria-label': 'Cuenta bancaria de ' + t.nombre, 'data-cuenta': clave, style: ST.card },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } }, h('h3', { style: ST.h3 }, p.titulo || 'Cuenta bancaria'), h('span', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, badge(ve ? 'brand' : 'neutral', ve ? 'Número completo' : 'Número enmascarado', 'v'), badge('warning', 'Dato personal (LOPDP)', 'l'))),
      vig, pend,
      h('span', { style: ST.help }, ve ? 'Ves el número completo porque ' + (v.rolBase === 'Finanzas' ? 'eres de Finanzas.' : 'eres el titular.') + ' Fuera de Finanzas y del titular se muestra enmascarado.' : 'El número de cuenta es dato personal (LOPDP): solo Finanzas y el titular lo ven completo.'),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 } }, p.puedePedir ? boton('secondary', 'Cambiar la cuenta', function () { setForm({ banco: '', tipo: '', numero: '', nombre: t.nombre, identificacion: t.idTipo === 'RUC' ? t.identificacion : '', motivo: '', tried: false }); }, { key: 'cc', size: 'sm', reason: pe ? 'Ya hay un cambio pendiente de aprobación de Finanzas' : '' }) : null,
        h('button', { type: 'button', 'aria-expanded': verH ? 'true' : 'false', onClick: function () { setVerH(!verH); }, style: { border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-link)', textDecoration: 'underline', textUnderlineOffset: 3 } }, verH ? 'Ocultar el historial' : 'Ver el historial de la cuenta')),
      histN, modalForm, modalDec); }
  W.SiriusCuentaBancaria = SiriusCuentaBancaria;

  // ---------- Tarifas a sus inspectores ----------
  // props: agencia (id), editable, viewer {nombre}, onAviso, nuevo (abre el formulario con valores)
  function SiriusTarifasAgencia(p) { useTC(); var ag = TC.agencia(p.agencia) || { id: p.agencia, nombre: p.agencia }, L = TC.tarifas(ag.id), hoy = TC.ahora().slice(0, 10), vig = L.filter(function (t) { return !t.hasta || t.hasta >= hoy; }), cer = L.filter(function (t) { return t.hasta && t.hasta < hoy; });
    var s0 = R().useState(null), f = s0[0], setF = s0[1], s1 = R().useState(false), verH = s1[0], setVerH = s1[1], M = W.SiriusModal, Mo = W.SiriusMonto, aviso = p.onAviso || function () {}, ins = TC.inspectoresDe(ag.id);
    R().useEffect(function () { if (p.nuevo && p.editable) setF(Object.assign({ inspector: '', grupo: 'Vehículos', unidad: 'visita', valor: null, desde: '', motivo: '', tried: false }, p.nuevo)); }, [p.nuevo ? p.nuevo.n : 0]);
    var th = function (t, w) { return h('th', { key: t, scope: 'col', style: { textAlign: 'left', padding: '8px 10px', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap', width: w } }, t); };
    var td = function (x, k, st) { return h('td', { key: k, style: Object.assign({ padding: '9px 10px', fontSize: 14, color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' }, st || {}) }, x); };
    var fila = function (t) { var activa = TC.vigenteEn(t, hoy), fut = t.desde > hoy; return h('tr', { key: t.id, 'data-tarifa': t.id }, td(h('span', { style: { fontWeight: 700, color: 'var(--text-strong)' } }, t.inspector || 'General de la agencia'), 'a'), td(t.grupo, 'g'), td(h('span', { style: ST.nw }, TC.tarifaTxt(t)), 'v', { fontWeight: 700, color: 'var(--text-strong)' }),
      td(h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('span', { style: ST.nw }, 'Desde ' + TC.fecha(t.desde)), t.hasta ? h('span', { style: ST.nw }, 'hasta ' + TC.fecha(t.hasta)) : null, h('span', null, badge(activa ? 'success' : fut ? 'brand' : 'neutral', activa ? 'Vigente' : fut ? 'Programada' : 'Cerrada', 'b'))), 'vg'),
      td(h('span', null, t.motivo, h('span', { style: { display: 'block', fontSize: 12.5, color: 'var(--text-muted)' } }, t.por + ' · ', h('span', { style: ST.nw }, TC.fechaHora(t.at)))), 'm', { minWidth: 220 })); };
    var tabla = function (xs, k) { return h('div', { key: k, style: { overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm,8px)' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse', minWidth: 720 } }, h('thead', null, h('tr', null, th('A quién', 190), th('Grupo de ramo', 170), th('Tarifa', 150), th('Vigencia', 140), th('Motivo'))), h('tbody', null, xs.map(fila)))); };
    var fd = f || {}, vr = f ? TC.validarTarifa(Object.assign({ agencia: ag.id }, fd, { inspector: fd.inspector || null })) : null, fe = f && fd.tried ? vr.errores : {};
    var modal = f && M ? h(M, { key: 'mt', open: true, onClose: function () { setF(null); }, size: 'md', align: 'left', title: 'Nueva tarifa · ' + ag.nombre, description: 'Lo que ' + ag.nombre + ' paga a su inspector. No cambia lo que la aseguradora paga a la agencia (tarifario de Liquidaciones).',
      footer: h(R().Fragment, null, boton('ghost', 'Cancelar', function () { setF(null); }, { key: 'c' }), boton('primary', 'Guardar tarifa', function () { var r = TC.guardarTarifa(Object.assign({ agencia: ag.id }, fd, { inspector: fd.inspector || null }), (p.viewer || {}).nombre || 'Usuario'); if (!r.ok) { setF(Object.assign({}, fd, { tried: true })); return; } setF(null); aviso('Tarifa guardada: ' + TC.tarifaTxt(r.tarifa) + ' desde el ' + TC.fecha(r.tarifa.desde) + (r.reemplaza ? '; la anterior queda en el historial.' : '.')); }, { key: 'o' })) },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        campo('ta-quien', 'A quién', h('select', { id: 'ta-quien', value: fd.inspector || '', onChange: function (e) { setF(Object.assign({}, fd, { inspector: e.target.value })); }, style: ST.inp(false) }, [h('option', { key: '', value: '' }, 'General de la agencia (todos sus inspectores)')].concat(ins.map(function (n) { return h('option', { key: n, value: n }, n + ' (propia)'); }))), null, 'La propia de un inspector reemplaza a la general solo en su grupo de ramo.', true),
        campo('ta-grupo', 'Grupo de ramo', h('select', { id: 'ta-grupo', value: fd.grupo || '', onChange: function (e) { var g = e.target.value; setF(Object.assign({}, fd, { grupo: g, unidad: TC.unidades(g).indexOf(fd.unidad) >= 0 ? fd.unidad : TC.unidades(g)[0] })); }, style: ST.inp(!!fe.grupo) }, TC.grupos().map(function (g) { return h('option', { key: g.id, value: g.id }, g.id); })), fe.grupo, null, true),
        radios('ta-unidad', 'Cómo se paga', [{ v: 'visita', l: 'Por visita' }, { v: 'hora', l: 'Por hora', dis: fd.grupo === 'Vehículos' ? 'En Vehículos la tarifa es fija por visita' : '' }], fd.unidad, function (x) { setF(Object.assign({}, fd, { unidad: x })); }, fe.unidad),
        campo('ta-valor', 'Valor', Mo ? h(Mo, { id: 'ta-valor', value: fd.valor, invalid: !!fe.valor, ancho: 220, onChange: function (n) { setF(Object.assign({}, fd, { valor: n })); } }) : h('input', { id: 'ta-valor', value: fd.valor || '', onChange: function (e) { setF(Object.assign({}, fd, { valor: parseFloat(String(e.target.value).replace(',', '.')) })); }, style: ST.inp(!!fe.valor) }), fe.valor, null, true),
        campo('ta-desde', 'Rige desde', h('input', { id: 'ta-desde', type: 'date', value: fd.desde || '', onChange: function (e) { setF(Object.assign({}, fd, { desde: e.target.value })); }, style: Object.assign(ST.inp(!!fe.desde), { maxWidth: 220 }) }), fe.desde, null, true),
        vr && vr.reemplaza && !fe.desde && fd.desde ? h('p', { key: 'imp', role: 'note', style: { margin: 0, padding: '10px 12px', borderRadius: 'var(--radius-sm,8px)', background: 'var(--surface-subtle,#F3F5F8)', fontSize: 14, color: 'var(--text-body)' } }, h('strong', null, 'Impacto: '), 'reemplaza a ' + TC.tarifaTxt(vr.reemplaza) + ' (desde el ' + TC.fecha(vr.reemplaza.desde) + '), que queda cerrada el ' + TC.fecha(TC.sumarDia(fd.desde, -1)) + ' y pasa al historial.') : null,
        motivoArea('ta-mot', fd.motivo, function (x) { setF(Object.assign({}, fd, { motivo: x })); }, fe.motivo))) : null;
    return h('section', { 'aria-label': 'Tarifas a sus inspectores', 'data-tarifas-agencia': ag.id, style: ST.card },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } }, h('h3', { style: ST.h3 }, 'Tarifas a sus inspectores'), p.editable ? boton('primary', 'Nueva tarifa', function () { setF({ inspector: '', grupo: 'Vehículos', unidad: 'visita', valor: null, desde: '', motivo: '', tried: false }); }, { key: 'nt', size: 'sm' }) : badge('neutral', 'Solo lectura', 'ro')),
      h('p', { style: { margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-body)' } }, 'Lo que ' + ag.nombre + ' paga a sus inspectores: fija por visita en Vehículos; por visita o por hora en Ramos Generales y Equipo y maquinaria. Es distinta de lo que la aseguradora paga a la agencia (Liquidaciones › Tarifarios). ' + (p.editable ? 'La editan Finanzas de la agencia y el Administrador; cada cambio pide motivo y queda en el historial.' : 'La editan Finanzas de la agencia y el Administrador; aquí la ves en solo lectura.')),
      vig.length ? tabla(vig, 'tv') : h('p', { key: 'sv', style: { margin: 0, fontSize: 14, color: 'var(--text-muted)' } }, 'Sin tarifas registradas.'),
      cer.length ? h('button', { key: 'vh', type: 'button', 'aria-expanded': verH ? 'true' : 'false', onClick: function () { setVerH(!verH); }, style: { alignSelf: 'flex-start', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-link)', textDecoration: 'underline', textUnderlineOffset: 3 } }, verH ? 'Ocultar el historial' : 'Ver el historial (' + cer.length + (cer.length === 1 ? ' tarifa cerrada' : ' tarifas cerradas') + ')') : null,
      verH && cer.length ? tabla(cer, 'tc') : null,
      TC.hist('Tarifas de ' + ag.nombre).length ? h('ul', { key: 'hs', 'aria-label': 'Cambios de esta sesión', style: { margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: 4 } }, TC.hist('Tarifas de ' + ag.nombre).map(function (x, i) { return h('li', { key: i }, h('span', { style: ST.nw }, TC.fechaHora(x.fecha)), ' · ' + x.por + ': ' + x.accion + ' (' + x.motivo + ')'); })) : null,
      modal); }
  W.SiriusTarifasAgencia = SiriusTarifasAgencia;

  // ---------- Lo que pagamos a nuestros inspectores ----------
  // props: agencia (id), periodo (opcional)
  function SiriusPagosAgencia(p) { useTC(); var ag = TC.agencia(p.agencia) || { id: p.agencia, nombre: p.agencia }, per = TC.periodosAgencia(ag.id), s0 = R().useState(p.periodo || per[0] || TC.ahora().slice(0, 7)), pe = s0[0], setPe = s0[1], r = TC.pagosAgencia(ag.id, pe), G = TC.grupos().map(function (g) { return g.id; });
    var th = function (t, k, al) { return h('th', { key: k || t, scope: 'col', style: { textAlign: al || 'left', padding: '8px 10px', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, t); };
    var td = function (x, k, st) { return h('td', { key: k, style: Object.assign({ padding: '9px 10px', fontSize: 14, color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' }, st || {}) }, x); };
    var celda = function (g) { if (!g || !g.visitas) return h('span', { style: { color: 'var(--text-muted)' } }, '—'); return h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('strong', { style: Object.assign({ color: 'var(--text-strong)' }, ST.nw) }, TC.usd(g.valor)), h('span', { style: { fontSize: 12.5, color: 'var(--text-muted)' } }, g.visitas + (g.visitas === 1 ? ' visita' : ' visitas') + (g.horas ? ' · ' + String(g.horas).replace('.', ',') + ' h' : '') + ' · ' + Object.keys(g.tarifas).join(' y '))); };
    return h('section', { 'aria-label': 'Lo que pagamos a nuestros inspectores', 'data-pagos-agencia': ag.id, style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 } }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 820 } }, h('h2', { style: { margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-strong)' } }, 'Lo que pagamos a nuestros inspectores'), h('p', { style: { margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-body)' } }, 'Por mes e inspector, calculado con las tarifas de ' + ag.nombre + ' a sus inspectores (Usuarios y roles › Agencias › ficha). Es informativa: SIRIUS no paga a los inspectores de la agencia ni se integra con sus pagos.')),
        h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } }, h('label', { htmlFor: 'pa-mes', style: ST.lab }, 'Mes'), h('select', { id: 'pa-mes', value: pe, onChange: function (e) { setPe(e.target.value); }, style: Object.assign(ST.inp(false), { width: 'auto', minWidth: 180, height: 40, fontWeight: 700 }) }, per.map(function (x) { return h('option', { key: x, value: x }, TC.mesTxt(x).replace(/^./, function (c) { return c.toUpperCase(); }) + (x === TC.ahora().slice(0, 7) ? ' (en curso)' : '')); })))),
      h('div', { style: { overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm,8px)' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse', minWidth: 760 } },
        h('thead', null, h('tr', null, [th('Inspector', 'i')].concat(G.map(function (g) { return th(g, g); }), [th('Visitas', 'v', 'right'), th('Total a pagar', 't', 'right')]))),
        h('tbody', null, r.filas.map(function (x) { return h('tr', { key: x.inspector, 'data-pago-inspector': x.inspector }, [td(h('strong', { style: { color: 'var(--text-strong)' } }, x.inspector), 'i')].concat(G.map(function (g) { return td(celda(x.grupos[g]), g); }), [td(String(x.visitas), 'v', { textAlign: 'right' }), td(h('strong', { style: Object.assign({ color: 'var(--text-strong)' }, ST.nw) }, TC.usd(x.total)), 't', { textAlign: 'right' })])); })),
        h('tfoot', null, h('tr', null, [td(h('strong', null, 'Total de ' + TC.mesTxt(pe)), 'i', { borderBottom: 'none' })].concat(G.map(function (g) { return td('', g, { borderBottom: 'none' }); }), [td(h('strong', null, String(r.visitas)), 'v', { textAlign: 'right', borderBottom: 'none' }), td(h('strong', { style: ST.nw }, TC.usd(r.total)), 't', { textAlign: 'right', borderBottom: 'none' })]))))),
      h('p', { style: ST.help }, 'Visitas: las registradas de ejemplo del mes' + (pe === TC.ahora().slice(0, 7) ? ' (hasta el ' + TC.fecha(TC.ahora()) + ')' : '') + ', los informes de los casos de la agencia y los enviados desde la app. La tarifa se toma en la fecha de cada visita: la propia del inspector si la tiene; si no, la general de la agencia.')); }
  W.SiriusPagosAgencia = SiriusPagosAgencia;
})();
