// SIRIUS · Honorarios precalculados, liquidaciones (orden de pago con versiones) y facturas con la clave de acceso del SRI
// (v3.4 · provisional · etapa F-1 · DEC-279; v3.3 · etapa P-1d + H-3 · DEC-277 y DEC-275; v3.2 · P-6g-1e · DEC-249; v3.1 · P-6g-1d · DEC-247 ajustada y DEC-248; ajusta DEC-136 a 139, conserva DEC-174).
// F-1 · DEC-279: la factura se arma en la Mesa de trabajo («En preparación», una por proveedor): facturaAgregar { liquidaciones, honorarios } y facturaQuitar
// → { ok, mensaje, id, subtotal, elementos }, facturaDescartar {} (todo vuelve a «Por facturar») y facturaConfirmar { clave } → { ok, mensaje, id, numero, subtotal }
// (49 dígitos, módulo 11, tipo 01, RUC del emisor = el del proveedor, no cargada antes; autorizada en el SRI con el mismo subtotal; pasa a «Por validar»).
// Lo agregado queda RESERVADO: la liquidación sigue «Aprobada» y el honorario «Por facturar», con facturaId de la factura en preparación. facturas[] suma
// enPreparacion, creada y devuelta { clave, numero, motivo, por, fecha }; devolverFactura regresa lo incluido a la factura en preparación del proveedor.
// Con la conexión, estas acciones las aplica solo la base y la pantalla vuelve a cargar (LP.accionBase); sin ella, las mismas reglas sobre la sesión.
// P-1d · DEC-277: el PDF de la liquidación sale de la conexión: liquidaciones[].aprobada { por, fecha (hora de Ecuador), version } y .periodo ('2026-11'),
// versiones[].enviada en hora de Ecuador, el cargo de quien aprobó (sin la aseguradora como cargo) y el código registrado en la base (documentoRegistrar
// { documento: 'liquidacion', liquidacion, huella } → mostrar «LQ-001416-v1-XXXXXXXX»; con { ok: false }, no se genera). Una liquidación sin líneas no tiene PDF.
// H-3 · DEC-275: honorarios[].servicio ('inspeccion' | 'completado'), calculo.modelo ('fija' | 'horaHombre' | 'completado') y calculo.lineas [{ concepto, nombre,
// cantidad, unidad, unitario, valor, origen ('general' | 'contrato'), aprobacion, porDefinir }]; estado «Por definir» (el concepto aplica y el contrato no tiene tarifa).
// P-6g-1e · DEC-249: tipos de vehículo del tarifario (Liviano, Pesado, Moto; antes «clases»): catálogo parametrizable con vigencia —agregar, renombrar, desactivar— y tabla de
// equivalencias del tipo de vehículo del riesgo (LP.clases, clasesActivas, claseInfo, tipoAgregar/Renombrar/Desactivar/Activar, equivalencias, equivalenciaSet/Quitar). El contrato
// con la base no cambia: calculo.clase sigue siendo el campo, con el valor nuevo 'moto'.
// P-6g-1d: tarifa de Vehículos por modalidad y clase (Liviano, Pesado; la clase sale del tipo de vehículo del riesgo); movilización desde la ciudad
// base del proveedor (km de ida —o ida y vuelta— por carretera hasta el punto de la visita, si la inspección es en otra ciudad; en la ciudad base, sin
// movilización; reemplaza la regla del radio urbano); documento PDF de la liquidación aprobada (DEC-248, LP.documentoPdf + SiriusPdf.liquidacion).
// Un solo modelo con y sin la conexión, y las mismas pantallas. Sin la conexión, los datos salen de SIRIUS_LIQ_PROCESO (datos-liq-proceso.js) y viven en
// memoria; con la conexión, de SIRIUS_CONEXION.honorarios[], .liquidaciones[] y .facturas[] (contrato de la base, SQL 53): se trabaja sobre una copia de la
// sesión, se envía la acción y, con { ok: false }, todo vuelve atrás y se muestra el mensaje. La base simulada (datos-cx-liq-proceso.js) aplica LP.ops.
// Contrato:
//   honorario { id, caso, orden, visita, riesgo, placa, bien, asegurado, linea, sucursal, ramo, modalidad, fecha, estadoCaso, inspector, inspectorId,
//     proveedor { tipo, nombre, identificacion }, aprobacion ('Preacordada' | 'Liquidación'), calificacion ('Asegurable' | 'Pendiente de calificación' |
//     'No asegurable'; P-6g-1d), calculo { tarifario, clase, nivel, nivelSugerido, horasVisita, horasRedaccion, medidoVisita, medidoRedaccion, equipos, base,
//     ciudadBase, ciudadVisita, enBase, kmMedicion, km, kmSugeridos, valorKm, movilizacion, subtotal },
//     ajuste { nivel, horasVisita, horasRedaccion, equipos, km, valor, comentario } | null, subtotal, estado, liquidacionId, facturaId }
//   liquidación { id, numero, version, proveedor, estado, lineas, observaciones [{ linea, texto, subtotalSugerido }], motivo, subtotal, iva, total,
//     facturaId, versiones [{ version, enviada, resultado, por, cambios }], historial }
//   factura { id, proveedor, clave, numero, fecha, sri { estado, ruc, subtotal, iva, total }, liquidaciones, honorarios, subtotal, estado, motivo,
//     pago { fecha, referencia } | null, historial }
// Acciones (→ { ok, mensaje }): ajustarHonorario { id, nivel, horasVisita, horasRedaccion, equipos, km, valor, comentario }, quitarAjuste { id },
//   enviarLiquidacion { lineas } → { id, numero }, editarLiquidacion { id, agregar, quitar }, reenviarLiquidacion { id }, anularLiquidacion { id, motivo },
//   aprobarLiquidacion { id }, devolverLiquidacion { id, observaciones, motivo }, aceptarSugerencia { id, linea }, enviarFactura { clave, liquidaciones,
//   honorarios } (la base vuelve a consultar el SRI y compara), validarFactura { id }, devolverFactura { id, motivo }, registrarPago { facturas, fecha, referencia }.
// La liquidación en Borrador es del proveedor y vive en su sesión (no va a la base): recibe número al enviarla. Quitar o agregar líneas y anular en
// Borrador no se envían; en «Por corregir», sí (editarLiquidacion, anularLiquidacion).
// Reglas: 1. honorario precalculado (tarifario vigente en la fecha de la inspección; Vehículos tarifa fija; Ramos Generales hora-hombre por nivel +
// redacción + equipos por tramos; horas a la media hora superior; «!» fuera del 50 %–150 % de la referencia; km = distancia − radio urbano × valor por km
// o «km por valorar»). 2. preacordado sin km ni ajuste → «Por facturar»; si no → «Por liquidar». 3. unicidad: un honorario en una sola liquidación no
// anulada; un honorario o una liquidación en una sola factura no devuelta. 4. Borrador → Enviada (vN) → Aprobada | Por corregir → Enviada (vN+1) …;
// Aprobada → Facturada → Pagada; Anulada. 5. factura por la clave de acceso: AUTORIZADO, RUC del proveedor y subtotal igual a lo marcado.
(function () {
  'use strict';
  const W = window; if (W.SiriusLiqProceso) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), sd = (x) => String(x == null ? '' : x).trim(), ON = [];
  const LP = { version: 0, EST_H: ['Por definir', 'Por liquidar', 'En liquidación', 'Por facturar', 'Facturado', 'Pagado'], EST_L: ['Borrador', 'Enviada', 'Por corregir', 'Aprobada', 'Facturada', 'Pagada', 'Anulada'], EST_F: ['En preparación', 'Por validar', 'Validada', 'Pagada', 'Factura devuelta', 'Descartada'],
    CAMPOS: ['nivel', 'horasVisita', 'horasRedaccion', 'equipos', 'km', 'ajuste'], borr: [], cbOv: {}, ctx: { ahora: () => { const E = W.SIRIUS_EJEMPLO; return E && E.ahora ? E.ahora() : new Date(); }, usuario: () => '' }, local: null, _cs: null, _cc: null, pagaOv: {} };
  LP.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  const avisar = () => { LP.version++; ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } }); };
  LP.avisar = avisar;
  LP.r2 = (n) => Math.round((Number(n) + 1e-9) * 100) / 100;
  LP.usd = (n) => (n == null || !isFinite(n) ? '—' : (W.SIRIUS_COMPANIA && W.SIRIUS_COMPANIA.formatoMonto ? W.SIRIUS_COMPANIA.formatoMonto(n) : 'USD ' + Number(n).toFixed(2)));
  LP.num = (n) => String(n).replace('.', ',');
  const pad = (n) => String(n).padStart(2, '0');
  LP.ahoraIso = () => { const d = LP.ctx.ahora(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  LP.fecha = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(sd(s)); return m ? m[3] + '/' + m[2] + '/' + m[1] : sd(s) || '—'; };
  LP.numCorto = (l) => (l && l.numero ? '#' + String(l.numero).padStart(6, '0') : 'Borrador ' + String((l && l.id) || '').replace(/\D/g, ''));
  LP.numTxt = (l) => LP.numCorto(l) + (!l || !l.numero ? '' : ' · v' + (l.version || 1));
  LP.tasaIva = (fecha) => { const c = W.SIRIUS_COMPANIA, t = c && c.tasa ? c.tasa('iva', sd(fecha).slice(0, 10) || LP.ahoraIso().slice(0, 10)) : null; return t == null ? 0 : Number(t); };
  LP.ivaDe = (sub, fecha) => { const t = LP.tasaIva(fecha); return { tasa: t, iva: LP.r2(sub * t / 100), total: LP.r2(sub + LP.r2(sub * t / 100)) }; };
  LP.D = () => W.SIRIUS_LIQ_PROCESO || {};
  LP.cfg = () => Object.assign({ aprueban: ['Ejecutivo de inspecciones', 'Finanzas', 'Administrador'], numeroInicial: 1414 }, LP.D().config || {});
  // ---------- Conexión ----------
  const C = () => W.SIRIUS_CONEXION || null;
  LP.cx = () => { const c = C(); return !!(c && c.activo === true && Array.isArray(c.honorarios)); };
  const tienda = () => { if (!LP.cx()) { if (!LP.local) LP.local = LP.semilla(''); return LP.local; }
    const c = C(), src = [c.honorarios, c.liquidaciones || [], c.facturas || []]; if (!LP._cc || src.some((x, i) => x !== LP._cs[i])) { LP._cs = src; LP._cc = { honorarios: clon(src[0]).map(LP.prep), liquidaciones: clon(src[1]), facturas: clon(src[2]) }; mezclarBorradores(LP._cc); } return LP._cc; };
  // Los borradores del proveedor viven en la sesión: se suman a lo que llega de la base (sus líneas, si siguen libres, quedan «En liquidación»).
  const mezclarBorradores = (S) => { LP.borr.forEach((b) => { if (S.liquidaciones.some((l) => l.id === b.id)) return; b.lineas = b.lineas.filter((id) => { const h = S.honorarios.find((x) => x.id === id); if (!h || h.facturaId || (h.liquidacionId && h.liquidacionId !== b.id) || ['Por liquidar', 'En liquidación'].indexOf(h.estado) < 0) return false; h.estado = 'En liquidación'; h.liquidacionId = b.id; return true; }); S.liquidaciones.push(b); }); };
  const syncBorr = (S) => { if (LP.cx()) LP.borr = S.liquidaciones.filter((l) => l.estado === 'Borrador'); };
  LP.tienda = tienda;
  LP.honorarios = () => tienda().honorarios;
  LP.liquidaciones = () => tienda().liquidaciones;
  LP.facturas = () => tienda().facturas;
  LP.hon = (id) => LP.honorarios().find((x) => x.id === sd(id)) || null;
  LP.liq = (id) => LP.liquidaciones().find((x) => x.id === sd(id)) || null;
  LP.fac = (id) => LP.facturas().find((x) => x.id === sd(id)) || null;
  // ---------- Proveedor: la agencia (por su RUC) o el inspector independiente (por su identificación) ----------
  LP.provKey = (p) => (p ? (p.tipo === 'agencia' ? 'agencia' : 'inspector') + '|' + sd(p.identificacion).toUpperCase() : '');
  LP.mismo = (a, b) => !!a && !!b && LP.provKey(a) === LP.provKey(b);
  const agencias = () => { const c = C(); if (c && c.activo && Array.isArray(c.agencias)) return c.agencias; const M = W.SiriusMaestros; return M && M.agencias ? M.agencias() : ((W.SIRIUS_USUARIOS || {}).agencias || []); };
  LP.agencia = (ref) => { const r = sd(ref).toLowerCase(); if (!r) return null; return agencias().find((a) => [a.ruc, a.id, a.nombre, a.razonSocial, a.nombreComercial].some((x) => sd(x).toLowerCase() === r)) || null; };
  LP.provNombre = (p) => { if (!p) return '—'; if (p.tipo === 'agencia') { const a = LP.agencia(p.identificacion); return a ? sd(a.nombreComercial || a.nombre) : sd(p.nombre); }
    const c = C(), L = c && c.activo ? (c.usuarios || []).concat(c.inspectores || []) : ((W.SIRIUS_USUARIOS || {}).usuarios || []), u = L.find((x) => sd(x.identificacion) && sd(x.identificacion) === sd(p.identificacion)); return u ? sd(u.nombre) : sd(p.nombre); };
  // RUC con que factura el proveedor: el de la agencia; el independiente, su cédula + 001 (persona natural).
  LP.rucProveedor = (p) => { if (!p) return ''; const id = sd(p.identificacion); return p.tipo === 'agencia' ? id : (/^\d{10}$/.test(id) ? id + '001' : id); };
  LP.pagaInspectores = (ref) => { const a = LP.agencia(ref); if (!a) return false; const k = sd(a.ruc || a.id); if (Object.prototype.hasOwnProperty.call(LP.pagaOv, k)) return !!LP.pagaOv[k]; return a.pagaInspectores === true; };
  LP.setPaga = (ref, v) => { const a = LP.agencia(ref); if (!a) return; LP.pagaOv[sd(a.ruc || a.id)] = !!v; avisar(); };
  // ---------- Cálculo ----------
  const HD = () => W.SIRIUS_HONORARIOS || {};
  LP.mediaHora = (h) => (h == null || !isFinite(h) ? 0 : Math.ceil(Number(h) * 2 - 1e-9) / 2);
  LP.NIVELES = () => (HD().roles || []).filter((r) => r.id !== 'redaccion').map((r) => ({ id: r.id, nombre: r.nombre }));
  LP.nivelCorto = (id) => ({ basico: 'Básico', n1: 'N1', n2: 'N2' }[id] || id);
  // Nivel sugerido por el tipo de riesgo u ocupación (catálogo nivelPorRiesgo).
  LP.nivelSugerido = (ocupacion) => { const o = sd(ocupacion).toLowerCase(); if (!o) return 'basico'; const L = HD().nivelPorRiesgo || [];
    for (const r of L.slice().reverse()) { if (sd(r.si).toLowerCase().split(/,|\(|\)/).map((x) => x.trim()).filter((x) => x.length > 3).some((p) => o.indexOf(p) >= 0 || p.indexOf(o) >= 0)) return r.nivel; } return 'basico'; };
  LP.referencia = (nivel) => { const r = ((HD().tiempo || {}).referencia || []).find((x) => x.nivel === nivel); return r ? { visita: r.visitaH, redaccion: r.redaccionH } : null; };
  const rad = (x) => x * Math.PI / 180;
  LP.distKm = (a, b) => { if (!a || !b) return null; const R = 6371, dLa = rad(b[0] - a[0]), dLo = rad(b[1] - a[1]), s = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s)); };
  LP.ciudadDe = (h) => { if (h.ciudad) return h.ciudad; const g = (W.SIRIUS_GEOGRAFIA || {}).ciudades || [], n = sd(h.sucursal).toUpperCase(), c = g.find((x) => sd(x.nombre).toUpperCase() === n || sd(x.buscador).toUpperCase() === n); return c ? c.cod : ''; };
  LP.ciudadNombre = (cod) => { const c = (((W.SIRIUS_GEOGRAFIA || {}).ciudades) || []).find((x) => x.cod === sd(cod)); return c ? (c.buscador || c.nombre) : sd(cod); };
  // Tipo de vehículo del tarifario (P-6g-1e · DEC-249; antes «clase»; el campo del contrato sigue llamándose calculo.clase). Catálogo parametrizable
  // SIRIUS_HONORARIOS.clasesVehiculo: [{ id, nombre, estado ('Activo' | 'Inactivo'), desde, hasta, tipos [tipos de vehículo equivalentes] }]. Se trabaja sobre una copia
  // de la sesión: agregar, renombrar y desactivar con vigencia no tocan el archivo de datos. El tipo sale del tipo de vehículo del riesgo (confirmado en la inspección, DEC-212).
  const TV = { src: null, lista: null };
  const tvBase = () => HD().clasesVehiculo || [{ id: 'liviano', nombre: 'Liviano', estado: 'Activo', desde: '2025-01-01', hasta: null, tipos: [] }, { id: 'pesado', nombre: 'Pesado', estado: 'Activo', desde: '2025-01-01', hasta: null, tipos: [] }];
  LP.clases = () => { const src = tvBase(); if (src !== TV.src || !TV.lista) { TV.src = src; TV.lista = JSON.parse(JSON.stringify(src)).map((c) => Object.assign({ estado: 'Activo', desde: '2025-01-01', hasta: null }, c)); } return TV.lista; };
  const hoyIso = () => { const E = W.SIRIUS_EJEMPLO, d = E && E.ahora ? E.ahora() : null, z = (n) => ('0' + n).slice(-2); return d ? d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) : '2026-10-18'; }; // reloj del prototipo
  LP.hoyIso = hoyIso;
  LP.tipoVigente = (c, fecha) => { const f = String(fecha || hoyIso()).slice(0, 10); return c.estado !== 'Inactivo' && (!c.desde || f >= c.desde) && (!c.hasta || f <= c.hasta); };
  LP.clasesActivas = (fecha) => LP.clases().filter((c) => LP.tipoVigente(c, fecha));
  LP.equivalencias = () => LP.clases().reduce((a, c) => a.concat((c.tipos || []).map((t) => ({ tipoVeh: t, clase: c.id }))), []);
  // El tipo del honorario: el de la equivalencia si está vigente en la fecha de la inspección; si no, el primero vigente (avisa: sinEquivalencia).
  LP.claseInfo = (tipo, fecha) => { const t = sd(tipo).toLowerCase(), c = LP.clases().find((x) => (x.tipos || []).some((y) => sd(y).toLowerCase() === t));
    if (c && LP.tipoVigente(c, fecha)) return { id: c.id, nombre: c.nombre, equivalente: true };
    const p = LP.clasesActivas(fecha)[0] || LP.clases()[0] || { id: 'liviano', nombre: 'Liviano' }; return { id: p.id, nombre: p.nombre, equivalente: false, motivo: c ? 'El tipo «' + c.nombre + '» no está vigente en esa fecha' : 'El tipo de vehículo «' + sd(tipo) + '» no está en la tabla de equivalencias' }; };
  LP.claseDe = (tipo, fecha) => LP.claseInfo(tipo, fecha).id;
  LP.claseNombre = (id) => ((LP.clases().find((x) => x.id === id) || {}).nombre || sd(id));
  const idTipo = (n) => sd(n).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Validaciones y cambios del catálogo (devuelven '' o el mensaje; los cambios devuelven { ok, mensaje }).
  LP.tipoErr = (nombre, excluirId) => { const n = sd(nombre).trim(); if (n.length < 3) return 'Escribe el nombre del tipo (mínimo 3 letras).'; return LP.clases().some((c) => c.id !== excluirId && sd(c.nombre).toLowerCase() === n.toLowerCase()) ? 'Ya existe un tipo con ese nombre.' : ''; };
  LP.tipoAgregar = (nombre, desde) => { const e = LP.tipoErr(nombre, ''); if (e) return { ok: false, mensaje: e }; let id = idTipo(nombre), k = 2; while (LP.clases().some((c) => c.id === id)) id = idTipo(nombre) + '-' + k++;
    LP.clases().push({ id, nombre: sd(nombre).trim(), estado: 'Activo', desde: desde || hoyIso(), hasta: null, tipos: [] }); avisar(); return { ok: true, id, mensaje: 'Tipo «' + sd(nombre).trim() + '» agregado: define su tarifa en cada tarifario.' }; };
  LP.tipoRenombrar = (id, nombre) => { const c = LP.clases().find((x) => x.id === id); if (!c) return { ok: false, mensaje: 'Ese tipo ya no existe.' }; const e = LP.tipoErr(nombre, id); if (e) return { ok: false, mensaje: e }; const antes = c.nombre; c.nombre = sd(nombre).trim(); avisar(); return { ok: true, mensaje: 'Tipo «' + antes + '» ahora se llama «' + c.nombre + '»; las tarifas y los honorarios conservan el mismo tipo.' }; };
  LP.tipoDesactivar = (id, hasta) => { const c = LP.clases().find((x) => x.id === id); if (!c) return { ok: false, mensaje: 'Ese tipo ya no existe.' }; if (LP.clasesActivas().filter((x) => x.id !== id).length < 1) return { ok: false, mensaje: 'Debe quedar al menos un tipo vigente.' };
    c.estado = 'Inactivo'; c.hasta = hasta || hoyIso(); avisar(); return { ok: true, mensaje: 'Tipo «' + c.nombre + '» desactivado desde el ' + c.hasta + ': no se puede elegir en tarifarios nuevos; las inspecciones anteriores conservan su tarifa.' }; };
  LP.tipoActivar = (id) => { const c = LP.clases().find((x) => x.id === id); if (!c) return { ok: false, mensaje: 'Ese tipo ya no existe.' }; c.estado = 'Activo'; c.hasta = null; avisar(); return { ok: true, mensaje: 'Tipo «' + c.nombre + '» activo de nuevo.' }; };
  LP.equivalenciaErr = (tipoVeh, clase, excluir) => { const t = sd(tipoVeh).trim(); if (t.length < 3) return 'Escribe el tipo de vehículo (mínimo 3 letras).'; if (!clase) return 'Elige el tipo del tarifario.';
    const o = LP.equivalencias().find((x) => sd(x.tipoVeh).toLowerCase() === t.toLowerCase() && sd(x.tipoVeh).toLowerCase() !== sd(excluir).toLowerCase()); return o ? '«' + t + '» ya equivale a «' + LP.claseNombre(o.clase) + '».' : ''; };
  LP.equivalenciaSet = (tipoVeh, clase, antes) => { const e = LP.equivalenciaErr(tipoVeh, clase, antes); if (e) return { ok: false, mensaje: e }; const t = sd(tipoVeh).trim(), a = sd(antes || t).toLowerCase();
    LP.clases().forEach((c) => { c.tipos = (c.tipos || []).filter((y) => sd(y).toLowerCase() !== a); }); const d = LP.clases().find((c) => c.id === clase); if (!d) return { ok: false, mensaje: 'Elige el tipo del tarifario.' }; d.tipos.push(t); avisar(); return { ok: true, mensaje: '«' + t + '» ahora equivale a «' + d.nombre + '».' }; };
  LP.equivalenciaQuitar = (tipoVeh) => { const a = sd(tipoVeh).toLowerCase(); LP.clases().forEach((c) => { c.tipos = (c.tipos || []).filter((y) => sd(y).toLowerCase() !== a); }); avisar(); return { ok: true, mensaje: '«' + sd(tipoVeh) + '» sale de la tabla: sin equivalencia, el cálculo usa el primer tipo vigente y lo avisa.' }; };
  // Ciudad base del proveedor (cantón INEC, en su ficha): la agencia o el inspector independiente. LP.setCiudadBase la cambia en la sesión.
  LP.ciudadBaseDe = (p) => { if (!p) return ''; const k = LP.provKey(p); if (Object.prototype.hasOwnProperty.call(LP.cbOv, k)) return LP.cbOv[k];
    if (p.tipo === 'agencia') { const a = LP.agencia(p.identificacion) || {}, loc = ((W.SIRIUS_USUARIOS || {}).agencias || []).find((x) => sd(x.ruc) === sd(p.identificacion)) || {}; return sd(a.ciudadBase || loc.ciudadBase); }
    const c = C(), L = (c && c.activo ? (c.usuarios || []) : []).concat((W.SIRIUS_USUARIOS || {}).usuarios || []), u = L.find((x) => sd(x.identificacion) === sd(p.identificacion) && x.ciudadBase); return u ? sd(u.ciudadBase) : ''; };
  LP.setCiudadBase = (p, cod) => { LP.cbOv[LP.provKey(p)] = sd(cod); avisar(); };
  // km de ida por carretera desde la ciudad base hasta el punto de la visita (servicio de rutas; en el prototipo, el dato del informe o la distancia en línea
  // recta × 1,25 desde el centro de la ciudad base). «Medición de km» del tarifario: ida (inicial) o ida y vuelta.
  LP.kmRuta = (base, inf) => { if (inf.kmRuta != null) return Number(inf.kmRuta); const Z = W.SiriusZonas, cen = Z && Z.centro ? Z.centro(base) : null, d = LP.distKm(cen, inf.punto); return d == null ? 0 : Math.round(d * 1.25 * 10) / 10; };
  // Tarifa vigente del proveedor (contrato sobre el general) en la fecha de la inspección.
  // El tarifario identifica a la agencia por su id del catálogo local (p. ej. «eurosurvey»); con la conexión, las agencias de la base traen otro id: se busca por RUC en el catálogo local.
  const agTarifa = (ruc) => { const r = sd(ruc), M = W.SiriusMaestros, loc = (M && M.agencias ? M.agencias() : ((W.SIRIUS_USUARIOS || {}).agencias || [])).find((a) => sd(a.ruc) === r || sd(a.id) === r); return loc ? loc.id : (LP.agencia(r) || {}).id || null; };
  LP.tarifaDe = (inf, clase) => { const H = W.SiriusHonorarios, ag = inf.proveedor && inf.proveedor.tipo === 'agencia' ? agTarifa(inf.proveedor.identificacion) : null, ef = H && H.efectivo ? H.efectivo(inf.inspector, ag) : { mapa: {} }, m = ef.mapa || {};
    const rg = inf.grupo !== 'Vehículos', apr = m['aprob.' + (rg ? 'Ramos Generales' : 'Vehículos')] || (rg ? 'Requiere liquidación' : 'Preacordada'), d = HD();
    const tramos = ((d.equipos || {}).tramos || []).map((t, i) => ({ hasta: m['eqHasta.' + i] !== undefined ? m['eqHasta.' + i] : t.hasta, valor: m['eq.' + i] !== undefined ? m['eq.' + i] : t.valor }));
    return { origen: ef.contrato ? ef.contrato.nombre : (ef.general && ef.general.nombre) || 'Tarifario general', vehiculo: rg ? null : (() => { const v = m['veh.' + inf.modalidad + '.' + (clase || 'liviano')], g = m['veh.' + inf.modalidad]; return v != null && v !== '' ? Number(v) : g == null ? 0 : Number(g); })(), clase: rg ? null : (clase || 'liviano'), medicion: m['km.medicion'] === 'idaVuelta' ? 'idaVuelta' : 'ida',
      hora: { basico: m['rol.basico'], n1: m['rol.n1'], n2: m['rol.n2'] }, redaccion: m['rol.redaccion'], valorKm: m['km.valor'] == null || m['km.valor'] === '' ? null : Number(m['km.valor']),
      tramos, aplicacion: m.eqAplicacion || (d.equipos || {}).aplicacion || 'escalonada', aprobacion: apr === 'Preacordada' ? 'Preacordada' : 'Liquidación' }; };
  // Honorario que llega de la base (solo el contrato): se completan el grupo, la ciudad y la tarifa para recalcular al editar (valor por km y base del cálculo).
  LP.prep = (h) => { if (!h) return h; h.grupo = h.grupo || (h.ramo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales'); h.calculo = h.calculo || {}; if (!h.ciudad) h.ciudad = LP.ciudadDe(h);
    if (!h.ciudad && h.calculo && h.calculo.ciudadVisita) h.ciudad = h.calculo.ciudadVisita;
    if (!h.tarifa) { const t = LP.tarifaDe(h, (h.calculo || {}).clase), c = h.calculo; if (c.valorKm !== undefined) t.valorKm = c.valorKm == null ? null : Number(c.valorKm); if (h.grupo === 'Vehículos' && c.base != null) t.vehiculo = Number(c.base); if (c.tarifario) t.origen = c.tarifario; t.aprobacion = h.aprobacion === 'Preacordada' ? 'Preacordada' : 'Liquidación'; h.tarifa = t; }
    if (h.subtotalCalculado == null) h.subtotalCalculado = h.calculo.subtotal != null ? h.calculo.subtotal : h.subtotal; return h; };
  const CONTRATO_H = ['id', 'caso', 'orden', 'visita', 'riesgo', 'placa', 'bien', 'asegurado', 'linea', 'sucursal', 'ramo', 'modalidad', 'fecha', 'estadoCaso', 'inspector', 'inspectorId', 'proveedor', 'aprobacion', 'calificacion', 'calculo', 'ajuste', 'subtotal', 'estado', 'liquidacionId', 'facturaId', 'servicio'];
  const CONTRATO_C = ['tarifario', 'clase', 'ciudadBase', 'ciudadVisita', 'enBase', 'kmMedicion', 'nivel', 'nivelSugerido', 'horasVisita', 'horasRedaccion', 'medidoVisita', 'medidoRedaccion', 'equipos', 'base', 'km', 'kmSugeridos', 'valorKm', 'movilizacion', 'subtotal', 'modelo', 'lineas'];
  const CONTRATO_L = ['id', 'numero', 'version', 'proveedor', 'estado', 'lineas', 'observaciones', 'motivo', 'subtotal', 'iva', 'total', 'facturaId', 'versiones', 'historial', 'periodo', 'aprobada'];
  const CONTRATO_F = ['id', 'proveedor', 'clave', 'numero', 'fecha', 'sri', 'liquidaciones', 'honorarios', 'subtotal', 'estado', 'motivo', 'pago', 'historial', 'enPreparacion', 'creada', 'devuelta'];
  const solo = (o, ks) => { const r = {}; ks.forEach((k) => { r[k] = o[k] === undefined ? null : clon(o[k]); }); return r; };
  // Lo que guarda la base (para la conexión simulada y la prueba del contrato).
  LP.aContrato = (S) => ({ honorarios: S.honorarios.map((h) => { const x = solo(h, CONTRATO_H); x.calculo = solo(h.calculo || {}, CONTRATO_C); return x; }),
    liquidaciones: S.liquidaciones.filter((l) => l.estado !== 'Borrador').map((l) => { const x = solo(l, CONTRATO_L); x.versiones = (l.versiones || []).map((v) => solo(v, ['version', 'enviada', 'resultado', 'por', 'cambios'])); return x; }),
    facturas: S.facturas.map((f) => solo(f, CONTRATO_F)) });
  LP.CONTRATO = { honorario: CONTRATO_H, calculo: CONTRATO_C, liquidacion: CONTRATO_L, factura: CONTRATO_F,
    acciones: { ajustarHonorario: ['id', 'nivel', 'horasVisita', 'horasRedaccion', 'equipos', 'km', 'valor', 'comentario'], quitarAjuste: ['id'], enviarLiquidacion: ['lineas'], editarLiquidacion: ['id', 'agregar', 'quitar'], reenviarLiquidacion: ['id'], anularLiquidacion: ['id', 'motivo'], aprobarLiquidacion: ['id'], devolverLiquidacion: ['id', 'observaciones', 'motivo'], aceptarSugerencia: ['id', 'linea'], enviarFactura: ['clave', 'liquidaciones', 'honorarios'], facturaAgregar: ['liquidaciones', 'honorarios'], facturaQuitar: ['liquidaciones', 'honorarios'], facturaDescartar: [], facturaConfirmar: ['clave'], validarFactura: ['id'], devolverFactura: ['id', 'motivo'], registrarPago: ['facturas', 'fecha', 'referencia'] } };
  LP.valorEquipos = (n, t) => { n = Math.max(0, Math.round(Number(n) || 0)); const T = (t && t.tramos) || []; if (!n || !T.length) return 0;
    if (t.aplicacion === 'tramoTotal') { const tr = T.find((x) => x.hasta == null || n <= x.hasta) || T[T.length - 1]; return LP.r2(n * tr.valor); }
    let s = 0, i = 0; for (let k = 1; k <= n; k++) { while (T[i].hasta != null && k > T[i].hasta && i < T.length - 1) i++; s += Number(T[i].valor) || 0; } return LP.r2(s); };
  // El ajuste del contrato con los nombres de la pantalla (el ajuste ± es «valor»).
  const AJK = { nivel: 'nivel', horasVisita: 'horasVisita', horasRedaccion: 'horasRedaccion', equipos: 'equipos', km: 'km', ajuste: 'valor' };
  LP.cambios = (h) => { const a = h.ajuste || {}, o = {}; Object.keys(AJK).forEach((k) => { const v = a[AJK[k]]; if (v !== undefined && v !== null && v !== '') o[k] = v; }); return o; };
  LP.comentario = (h) => sd((h.ajuste || {}).comentario);
  LP.val = (h, k, sinCambios) => { const c = sinCambios ? {} : LP.cambios(h); return c[k] !== undefined ? c[k] : k === 'ajuste' ? 0 : (h.calculo || {})[k]; };
  // Partes del cálculo y subtotal (con o sin los cambios del proveedor).
  LP.desglose = (h, sinCambios) => { const t = h.tarifa || {}, v = (k) => LP.val(h, k, sinCambios), km = Number(v('km')) || 0, mov = t.valorKm == null ? 0 : LP.r2(km * t.valorKm), aj = h.grupo === 'Vehículos' ? Number(v('ajuste')) || 0 : Number(v('ajuste')) || 0, partes = [];
    let base; if (h.grupo === 'Vehículos') { base = Number(t.vehiculo) || 0; partes.push({ concepto: 'Tarifa fija · ' + h.modalidad, valor: base }); }
    else { const nv = v('nivel'), hv = Number(v('horasVisita')) || 0, hr = Number(v('horasRedaccion')) || 0, eq = Math.round(Number(v('equipos')) || 0), th = Number((t.hora || {})[nv]) || 0, iv = LP.r2(hv * th), ir = LP.r2(hr * (Number(t.redaccion) || 0)), ie = LP.valorEquipos(eq, t);
      base = LP.r2(iv + ir + ie); partes.push({ concepto: 'Inspección ' + LP.num(hv) + ' h × ' + LP.usd(th) + ' (' + LP.nivelCorto(nv) + ')', valor: iv }, { concepto: 'Redacción ' + LP.num(hr) + ' h × ' + LP.usd(t.redaccion), valor: ir }, { concepto: 'Equipos: ' + eq + ' (por tramos)', valor: ie }); }
    if (km) partes.push({ concepto: 'Movilización ' + km + ' km' + (t.valorKm == null ? (km ? ' (km por valorar)' : '') : ' × ' + LP.usd(t.valorKm)), valor: mov }); if (aj) partes.push({ concepto: 'Ajuste', valor: aj });
    return { base, mov, km, ajuste: aj, partes, subtotal: LP.r2(base + mov + aj), porValorar: t.valorKm == null && km > 0 }; };
  LP.campoCambiado = (h, k) => { const c = LP.cambios(h); return c[k] !== undefined && (k === 'ajuste' ? Number(c[k]) !== 0 : String(c[k]) !== String((h.calculo || {})[k])); };
  LP.cambiado = (h) => LP.CAMPOS.some((k) => LP.campoCambiado(h, k));
  LP.falta = (h) => LP.cambiado(h) && LP.comentario(h).length < 3;
  LP.preacordado = (h) => h.aprobacion === 'Preacordada' && !(Number(LP.val(h, 'km')) > 0) && !LP.cambiado(h);
  // Fuera de la referencia del nivel (50 % a 150 %): «!» y la explicación.
  LP.fueraRef = (h) => { if (h.grupo === 'Vehículos') return null; const r = LP.referencia(LP.val(h, 'nivel')); if (!r) return null; const hv = Number(LP.val(h, 'horasVisita')) || 0, hr = Number(LP.val(h, 'horasRedaccion')) || 0, out = [];
    if (hv < r.visita * 0.5 || hv > r.visita * 1.5) out.push('visita ' + LP.num(hv) + ' h frente a ' + LP.num(r.visita) + ' h de referencia'); if (hr < r.redaccion * 0.5 || hr > r.redaccion * 1.5) out.push('redacción ' + LP.num(hr) + ' h frente a ' + LP.num(r.redaccion) + ' h');
    return out.length ? { visita: hv < r.visita * 0.5 || hv > r.visita * 1.5, redaccion: hr < r.redaccion * 0.5 || hr > r.redaccion * 1.5, texto: 'Fuera del 50 % a 150 % de la referencia del nivel ' + LP.nivelCorto(LP.val(h, 'nivel')) + ': ' + out.join('; ') + '.' } : null; };
  // Por qué pasa a liquidación una tarifa preacordada: por los km o por el ajuste.
  LP.motivoLiq = (h) => { if (h.aprobacion !== 'Preacordada' || LP.preacordado(h)) return ''; const km = Number(LP.val(h, 'km')) > 0, aj = LP.CAMPOS.filter((k) => k !== 'km').some((k) => LP.campoCambiado(h, k)); return km && !aj ? 'por los km' : aj && !km ? 'por el ajuste' : 'por los km y el ajuste'; };
  LP.caminoTxt = (h) => (LP.preacordado(h) ? 'Tarifa preacordada · directo a «Por facturar»' : h.aprobacion === 'Preacordada' ? 'Tarifa preacordada · pasa a liquidación ' + LP.motivoLiq(h) : 'Requiere liquidación · ' + (h.grupo === 'Vehículos' ? 'tarifa fija' : 'tarifario por horas'));
  // Explicación de los km con los mismos km del cálculo; si el proveedor los cambió, los sugeridos y los cobrados.
  // «Ciudad base» o «Ciudad no base» y la explicación de los km con los mismos km del cálculo (si el proveedor los cambió: sugeridos y cobrados).
  LP.enBase = (h) => (h.calculo || {}).enBase !== false;
  LP.ciudadTxt = (h) => (LP.enBase(h) ? 'Ciudad base' : 'Ciudad no base');
  LP.kmTxt = (h) => { const c = h.calculo || {}, sug = Number(c.kmSugeridos) || 0, cob = Number(LP.val(h, 'km')) || 0, t = h.tarifa || {}, base = LP.ciudadNombre(c.ciudadBase), vis = LP.ciudadNombre(c.ciudadVisita || h.ciudad);
    if (LP.enBase(h) && !cob) return 'Ciudad base (' + (base || vis || h.sucursal) + '): sin movilización.';
    const como = LP.enBase(h) ? '(en la ciudad base, ' + base + ')' : '(' + (c.kmMedicion === 'idaVuelta' ? 'ida y vuelta' : 'de ida') + ', por carretera, desde ' + base + ', ciudad base, hasta el punto de la visita en ' + vis + ')', val = t.valorKm == null ? 'km por valorar: el tarifario no tiene valor por km, movilización USD 0' : ' × ' + LP.usd(t.valorKm) + ' = ' + LP.usd(LP.r2(cob * t.valorKm));
    if (LP.campoCambiado(h, 'km')) return LP.ciudadTxt(h) + ' · km sugeridos ' + LP.num(sug) + ' ' + como + ' · km cobrados ' + LP.num(cob) + (t.valorKm == null ? ' (' + val + ')' : val) + ' · comentario: ' + (LP.comentario(h) || 'sin comentario');
    return LP.ciudadTxt(h) + ' · ' + LP.num(cob) + ' km ' + como + (t.valorKm == null ? ' · ' + val : val); };
  // Referencia de la línea, como en el sistema actual: «ASEGURABLE // CIUDAD NO BASE // LIVIANO // 19,1 KM × 0,20 = 3,82».
  LP.refLinea = (h) => { const c = h.calculo || {}, km = Number(LP.val(h, 'km')) || 0, t = h.tarifa || {}, n2 = (x) => Number(x).toFixed(2).replace('.', ','), q = [sd(h.calificacion || 'Asegurable'), LP.ciudadTxt(h)];
    q.push(h.grupo === 'Vehículos' ? LP.claseNombre(c.clase || 'liviano') : LP.nivelCorto(LP.val(h, 'nivel')) + ' · ' + LP.num(LP.val(h, 'horasVisita')) + ' H + ' + LP.num(LP.val(h, 'horasRedaccion')) + ' H · ' + LP.val(h, 'equipos') + ' EQUIPOS');
    if (km) q.push(LP.num(km) + ' KM' + (t.valorKm == null ? ' POR VALORAR' : ' × ' + n2(t.valorKm) + ' = ' + n2(LP.r2(km * t.valorKm)))); return q.join(' // ').toUpperCase(); };
  LP.porQue = (h) => { const k = Number(LP.val(h, 'km')) || 0; if (LP.cambiado(h) && h.aprobacion === 'Preacordada' && !(Number((h.calculo || {}).km) > 0)) return 'Ajustado: ' + (LP.comentario(h) || 'sin comentario');
    if (h.grupo !== 'Vehículos') return 'Tarifario por horas'; if (k > 0) return LP.num(k) + ' km fuera de la ciudad base' + (h.tarifa && h.tarifa.valorKm == null ? ' (por valorar)' : ''); return h.aprobacion === 'Preacordada' ? 'Preacordado' : 'Requiere liquidación'; };
  LP.recalc = (h) => { const d = LP.desglose(h), d0 = LP.desglose(h, true), c = h.calculo = h.calculo || {}, t = h.tarifa || {}; c.tarifario = t.origen || c.tarifario || ''; c.base = d0.base; c.valorKm = t.valorKm == null ? null : t.valorKm; c.movilizacion = d0.mov; c.subtotal = d0.subtotal;
    h.subtotal = d.subtotal; h.subtotalCalculado = d0.subtotal; return h; };
  const camino = (h) => { if (h.liquidacionId || h.facturaId || ['Por liquidar', 'Por facturar'].indexOf(h.estado) < 0) return; h.estado = LP.preacordado(h) ? 'Por facturar' : 'Por liquidar'; };
  // Al entregar el informe: un honorario por vehículo o bien, con todo calculado.
  LP.calcular = (inf) => { const grupo = inf.ramo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales', v = grupo === 'Vehículos', clase = v ? LP.claseDe(inf.tipoVehiculo, inf.fecha) : null, t = LP.tarifaDe(Object.assign({}, inf, { grupo }), clase);
    const cb = LP.ciudadBaseDe(inf.proveedor), cv = sd(inf.ciudad), enBase = !cb || !cv || cb === cv, pres = inf.modalidad === 'Presencial', k0 = !pres || enBase ? 0 : Math.round(LP.kmRuta(cb, inf) * (t.medicion === 'idaVuelta' ? 2 : 1) * 10) / 10;
    const ns = v ? null : LP.nivelSugerido(inf.ocupacion), ks = k0, calculo = { tarifario: t.origen, clase, ciudadBase: cb, ciudadVisita: cv, enBase: pres ? enBase : true, kmMedicion: t.medicion, nivel: ns, nivelSugerido: ns, horasVisita: v ? null : LP.mediaHora(inf.medidoVisita), horasRedaccion: v ? null : LP.mediaHora(inf.medidoRedaccion), medidoVisita: v ? null : inf.medidoVisita, medidoRedaccion: v ? null : inf.medidoRedaccion, equipos: v ? null : Math.round(inf.equipos || 0), base: 0, km: ks, kmSugeridos: k0, valorKm: t.valorKm, movilizacion: 0, subtotal: 0 };
    const h = { id: 'HON-' + inf.riesgo, caso: inf.caso, orden: inf.orden || '', visita: inf.visita || 1, riesgo: inf.riesgo, placa: inf.placa || '', bien: inf.bien || '', ramo: inf.ramo, grupo, modalidad: inf.modalidad, asegurado: inf.asegurado, linea: inf.linea || '', sucursal: inf.sucursal || '', ciudad: inf.ciudad || '', fecha: inf.fecha, estadoCaso: inf.estadoCaso || '',
      inspector: inf.inspector, inspectorId: inf.inspectorId || '', proveedor: clon(inf.proveedor), aprobacion: inf.aprobacion || t.aprobacion, calificacion: inf.calificacion || 'Asegurable', tarifa: t, calculo, ajuste: null, subtotal: 0, subtotalCalculado: 0, estado: 'Por liquidar', liquidacionId: '', facturaId: '' };
    LP.recalc(h); h.estado = LP.preacordado(h) ? 'Por facturar' : 'Por liquidar'; return h; };
  LP.semilla = (escena, vista) => { const D = LP.D(), S = { honorarios: (D.informes || []).filter((i) => !i.escenas || i.escenas.indexOf(escena) >= 0).map(LP.calcular), liquidaciones: [], facturas: [], seq: { liq: LP.cfg().numeroInicial, fac: 1 } };
    const f = (D.escenas || {})[escena]; if (f) { f(S, (tipo, d, por, fecha) => { const r = LP.ops(S, tipo, d, { por: por || 'Prueba', fecha: fecha || '2026-10-18T09:00' }); if (!r.ok) console.warn('Semilla ' + escena + ': ' + tipo + ' → ' + r.mensaje); return r; }, vista || ''); }
    return S; };
  LP.iniciar = (escena, vista) => { LP.local = LP.semilla(escena, vista); LP.escena = escena || ''; avisar(); };
  // ---------- Liquidación: totales y versiones ----------
  const totLiq = (S, l, fecha) => { l.subtotal = LP.r2(l.lineas.reduce((s, id) => s + ((S.honorarios.find((h) => h.id === id) || {}).subtotal || 0), 0)); const x = LP.ivaDe(l.subtotal, fecha || l.fechaIva || ''); l.iva = x.iva; l.total = x.total; };
  const foto = (S, l) => l.lineas.map((id) => { const h = S.honorarios.find((x) => x.id === id) || {}; return { linea: id, subtotal: h.subtotal, cambios: LP.cambios(h), comentario: LP.comentario(h) }; });
  // Lo que quedó en la versión i, rehecho con los cambios de cada versión (la base solo guarda los cambios).
  const fotoV = (l, i) => { const m = {}; for (let k = 0; k <= i; k++) ((l.versiones[k] || {}).cambios || []).forEach((c) => { if (c.tipo === 'Quitada') delete m[c.linea]; else m[c.linea] = { linea: c.linea, subtotal: c.ahora, comentario: c.comentario || '' }; }); return Object.keys(m).map((k) => m[k]); };
  LP.fotoV = fotoV;
  LP.diferencias = (antes, ahora) => { const out = [], A = {}, N = {}; (antes || []).forEach((x) => { A[x.linea] = x; }); (ahora || []).forEach((x) => { N[x.linea] = x; });
    (ahora || []).forEach((x) => { const a = A[x.linea]; if (!a) out.push({ linea: x.linea, tipo: 'Agregada', antes: null, ahora: x.subtotal }); else if (a.subtotal !== x.subtotal || (a.cambios ? JSON.stringify(a.cambios) !== JSON.stringify(x.cambios) : sd(a.comentario) !== sd(x.comentario))) out.push({ linea: x.linea, tipo: /^Acepto el subtotal sugerido/.test(x.comentario) ? 'Sugerencia aceptada' : 'Cambiada', antes: a.subtotal, ahora: x.subtotal, comentario: x.comentario }); });
    (antes || []).forEach((a) => { if (!N[a.linea]) out.push({ linea: a.linea, tipo: 'Quitada', antes: a.subtotal, ahora: null }); }); return out; };
  const hist = (o, que, ctx, extra) => { o.historial = o.historial || []; o.historial.push(Object.assign({ fecha: ctx.fecha, por: ctx.por, que }, extra || {})); };
  const NO = (m) => ({ ok: false, mensaje: m });
  const libre = (h) => !h.liquidacionId && !h.facturaId;
  const sigLiq = (S) => Math.max(LP.cfg().numeroInicial, (S.seq && S.seq.liq) || 0, ...S.liquidaciones.map((l) => (Number(l.numero) || 0) + 1));
  const sigBor = (S) => Math.max(1, ...S.liquidaciones.concat(LP.borr).map((l) => (/^BOR-/.test(l.id) ? Number(l.id.slice(4)) + 1 : 1)));
  const renLiq = (S, de, a) => { if (!a || a === de) return; const l = S.liquidaciones.find((x) => x.id === de); if (l) l.id = a; S.honorarios.forEach((h) => { if (h.liquidacionId === de) h.liquidacionId = a; }); S.facturas.forEach((f) => { f.liquidaciones = f.liquidaciones.map((x) => (x === de ? a : x)); }); };
  const sigFac = (S) => Math.max(1, (S.seq && S.seq.fac) || 0, ...S.facturas.map((f) => (Number(String(f.id).replace(/\D/g, '')) || 0) + 1));
  const listo = (S, l) => { const hs = l.lineas.map((id) => S.honorarios.find((h) => h.id === id)).filter(Boolean), fal = hs.filter(LP.falta); return !hs.length ? 'La liquidación no tiene líneas' : fal.length ? 'Falta el comentario del cambio en ' + fal.map((h) => h.placa || h.bien).join(', ') : ''; };
  // ---------- Reglas (las aplican la pantalla y la base simulada) ----------
  LP.ops = (S, tipo, d, ctx) => { d = d || {}; ctx = Object.assign({ por: '', fecha: LP.ahoraIso() }, ctx || {}); const H = (id) => S.honorarios.find((x) => x.id === sd(id)), L = (id) => S.liquidaciones.find((x) => x.id === sd(id)), F = (id) => S.facturas.find((x) => x.id === sd(id));
    const enLiqEditable = (h) => { const l = h.liquidacionId ? L(h.liquidacionId) : null; return l && ['Borrador', 'Por corregir'].indexOf(l.estado) >= 0 ? l : null; };
    if (tipo === 'ajustarHonorario') { const h = H(d.id); if (!h) return NO('El honorario no existe'); const l = enLiqEditable(h);
      if (!(l || (libre(h) && ['Por liquidar', 'Por facturar'].indexOf(h.estado) >= 0))) return NO('Ese honorario ya no se puede cambiar');
      const aj = { nivel: null, horasVisita: null, horasRedaccion: null, equipos: null, km: null, valor: null, comentario: sd(d.comentario) };
      for (const k of Object.keys(d)) { if (['id', 'comentario'].indexOf(k) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(aj, k)) return NO('Campo desconocido: ' + k); const v = d[k]; if (v === null || v === undefined || v === '') continue;
        if (h.grupo === 'Vehículos' && ['km', 'valor'].indexOf(k) < 0) return NO('En Vehículos la tarifa es fija: solo cambian los km');
        if (k === 'nivel') { if (!LP.NIVELES().some((n) => n.id === v)) return NO('Nivel desconocido'); if (v !== (h.calculo || {}).nivel) aj.nivel = v; continue; }
        const n = Number(v); if (!isFinite(n) || (k !== 'valor' && n < 0)) return NO('Valor no válido en ' + k); const x = k === 'equipos' ? Math.round(n) : k === 'km' ? Math.round(n * 10) / 10 : LP.r2(n);
        if (k === 'valor' ? x !== 0 : String(x) !== String((h.calculo || {})[k])) aj[k] = x; }
      const hay = ['nivel', 'horasVisita', 'horasRedaccion', 'equipos', 'km', 'valor'].some((k) => aj[k] !== null);
      const pre = h.estado === 'Por facturar'; h.ajuste = hay || aj.comentario ? aj : null; LP.recalc(h); camino(h); if (l) totLiq(S, l, ctx.fecha);
      return { ok: true, mensaje: pre && h.estado === 'Por liquidar' ? 'Al ajustar, este honorario necesita liquidación: pasa a «Por liquidar»' : 'Cambio guardado' }; }
    if (tipo === 'quitarAjuste') { const h = H(d.id); if (!h) return NO('El honorario no existe'); const l = enLiqEditable(h); if (!(l || (libre(h) && h.estado === 'Por liquidar'))) return NO('Ese honorario ya no se puede cambiar');
      h.ajuste = null; LP.recalc(h); camino(h); if (l) totLiq(S, l, ctx.fecha); return { ok: true, mensaje: h.estado === 'Por facturar' ? 'Sin el ajuste, vuelve a preacordado: «Por facturar»' : 'Ajuste quitado' }; }
    if (tipo === 'crearLiquidacion') { const ids = (d.lineas || []).map(sd).filter(Boolean); if (!ids.length) return NO('Marca al menos una inspección «Por liquidar»'); const hs = ids.map(H);
      if (hs.some((h) => !h || h.estado !== 'Por liquidar' || !libre(h))) return NO('Alguna inspección ya está en otra liquidación o no está «Por liquidar»'); if (hs.some((h) => !LP.mismo(h.proveedor, hs[0].proveedor))) return NO('Todas deben ser del mismo proveedor');
      const id = 'BOR-' + sigBor(S);
      const l = { id, numero: null, version: 1, proveedor: clon(hs[0].proveedor), estado: 'Borrador', lineas: ids.slice(), observaciones: [], motivo: '', subtotal: 0, iva: 0, total: 0, facturaId: '', fechaIva: ctx.fecha, creada: ctx.fecha, versiones: [], historial: [] };
      hs.forEach((h) => { h.estado = 'En liquidación'; h.liquidacionId = id; }); totLiq(S, l, ctx.fecha); hist(l, 'Creada en borrador con ' + ids.length + (ids.length === 1 ? ' inspección' : ' inspecciones'), ctx); S.liquidaciones.push(l); return { ok: true, mensaje: LP.numCorto(l) + ' creado: recibe su número al enviarlo', id }; }
    if (tipo === 'editarLiquidacion') { const l = L(d.id); if (!l) return NO('La liquidación no existe'); if (['Borrador', 'Por corregir'].indexOf(l.estado) < 0) return NO('Solo se cambian las líneas de una liquidación en Borrador o «Por corregir»');
      const ag = (d.agregar || []).map(sd).filter(Boolean), qu = (d.quitar || []).map(sd).filter(Boolean); if (!ag.length && !qu.length) return NO('No hay cambios');
      if (qu.some((x) => l.lineas.indexOf(x) < 0)) return NO('Esa inspección no está en la liquidación'); if (ag.some((x) => { const h = H(x); return !h || h.estado !== 'Por liquidar' || !libre(h) || !LP.mismo(h.proveedor, l.proveedor); })) return NO('Solo se agregan inspecciones «Por liquidar» libres del mismo proveedor');
      qu.forEach((x) => { const h = H(x); h.estado = 'Por liquidar'; h.liquidacionId = ''; camino(h); }); ag.forEach((x) => { const h = H(x); h.estado = 'En liquidación'; h.liquidacionId = l.id; });
      l.lineas = l.lineas.filter((x) => qu.indexOf(x) < 0).concat(ag); l.observaciones = (l.observaciones || []).filter((o) => qu.indexOf(o.linea) < 0); totLiq(S, l, ctx.fecha);
      const nm = (ids) => ids.map((x) => { const h = H(x); return h ? h.placa || h.bien : x; }).join(', '); hist(l, [ag.length ? 'Agregó ' + nm(ag) : '', qu.length ? 'Quitó ' + nm(qu) + ' (vuelve a «Por liquidar»)' : ''].filter(Boolean).join(' · '), ctx); return { ok: true, mensaje: 'Liquidación actualizada' }; }
    if (tipo === 'enviarLiquidacion' && !d.id) { const r0 = LP.ops(S, 'crearLiquidacion', { lineas: d.lineas }, ctx); if (!r0.ok) return r0; const r1 = LP.ops(S, 'enviarLiquidacion', { id: r0.id }, ctx);
      if (!r1.ok) LP.ops(S, 'anularLiquidacion', { id: r0.id }, ctx); return r1; }
    if (tipo === 'enviarLiquidacion' || tipo === 'reenviarLiquidacion') { const l = L(d.id); if (!l) return NO('La liquidación no existe'); const de = tipo === 'enviarLiquidacion' ? 'Borrador' : 'Por corregir';
      if (l.estado !== de) return NO(tipo === 'enviarLiquidacion' ? 'Solo se envía una liquidación en Borrador' : 'Solo se reenvía una liquidación «Por corregir»'); const e = listo(S, l); if (e) return NO(e);
      if (!l.numero) { const n = sigLiq(S); S.seq = Object.assign({}, S.seq || {}, { liq: n + 1 }); renLiq(S, l.id, 'LIQ-' + String(n).padStart(6, '0')); l.numero = n; }
      l.versiones = l.versiones || []; const prev = l.versiones[l.versiones.length - 1] || null, fo = foto(S, l), pf = prev ? (prev.foto || fotoV(l, l.versiones.length - 1)) : null; if (prev) l.version += 1; l.estado = 'Enviada'; l.observaciones = []; l.motivo = ''; totLiq(S, l, ctx.fecha);
      l.versiones.push({ version: l.version, enviada: ctx.fecha, resultado: 'Por aprobar', por: ctx.por, cambios: prev ? LP.diferencias(pf, fo) : fo.map((x) => ({ linea: x.linea, tipo: Object.keys(x.cambios).length ? 'Cambiada' : 'Incluida', antes: null, ahora: x.subtotal, comentario: x.comentario })), foto: fo });
      hist(l, (prev ? 'Reenviada' : 'Enviada') + ' v' + l.version + ' · ' + LP.usd(l.subtotal), ctx); return { ok: true, mensaje: 'Liquidación ' + LP.numCorto(l) + (prev ? ' reenviada' : ' enviada') + ' (v' + l.version + ')', id: l.id, numero: l.numero }; }
    if (tipo === 'anularLiquidacion') { const l = L(d.id); if (!l) return NO('La liquidación no existe'); if (['Borrador', 'Por corregir'].indexOf(l.estado) < 0) return NO('Solo el proveedor anula una liquidación en Borrador o «Por corregir»');
      if (l.estado === 'Por corregir' && sd(d.motivo).length < 10) return NO('Escribe el motivo (mínimo 10 caracteres)');
      l.lineas.forEach((x) => { const h = H(x); if (h) { h.estado = 'Por liquidar'; h.liquidacionId = ''; camino(h); } }); l.estado = 'Anulada'; l.motivo = sd(d.motivo); if (!l.numero) { S.liquidaciones.splice(S.liquidaciones.indexOf(l), 1); return { ok: true, mensaje: LP.numCorto(l) + ' descartado: sus inspecciones vuelven a «Por liquidar»' }; } hist(l, 'Anulada: sus inspecciones vuelven a «Por liquidar»', ctx, d.motivo ? { motivo: sd(d.motivo) } : {}); return { ok: true, mensaje: 'Liquidación ' + LP.numCorto(l) + ' anulada' }; }
    if (tipo === 'aprobarLiquidacion') { const l = L(d.id); if (!l) return NO('La liquidación no existe'); if (l.estado !== 'Enviada') return NO('Solo se aprueba una liquidación enviada');
      l.lineas.forEach((x) => { const h = H(x); if (h) h.estado = 'Por facturar'; }); l.estado = 'Aprobada'; const v = l.versiones[l.versiones.length - 1]; if (v) { v.resultado = 'Aprobada'; v.revisor = ctx.por; v.fechaResultado = ctx.fecha; }
      hist(l, 'Aprobada v' + l.version + ' · ' + LP.usd(l.subtotal), ctx); return { ok: true, mensaje: 'Liquidación aprobada' }; }
    if (tipo === 'devolverLiquidacion') { const l = L(d.id); if (!l) return NO('La liquidación no existe'); if (l.estado !== 'Enviada') return NO('Solo se devuelve una liquidación enviada');
      const obs = (d.observaciones || []).map((o) => ({ linea: sd(o.linea), texto: sd(o.texto), subtotalSugerido: o.subtotalSugerido == null || o.subtotalSugerido === '' ? null : LP.r2(Number(o.subtotalSugerido)) }));
      if (!obs.length) return NO('Observa al menos una línea'); if (obs.some((o) => l.lineas.indexOf(o.linea) < 0 || o.texto.length < 3 || (o.subtotalSugerido != null && !(o.subtotalSugerido >= 0)))) return NO('Cada observación necesita su línea y un texto');
      if (sd(d.motivo).length < 10) return NO('Escribe el motivo (mínimo 10 caracteres)');
      l.estado = 'Por corregir'; l.observaciones = obs; l.motivo = sd(d.motivo); const v = l.versiones[l.versiones.length - 1]; if (v) { v.resultado = 'Devuelta para corregir'; v.revisor = ctx.por; v.fechaResultado = ctx.fecha; v.observaciones = clon(obs); v.motivo = sd(d.motivo); }
      hist(l, 'Devuelta para corregir v' + l.version, ctx, { motivo: sd(d.motivo), observaciones: clon(obs) }); return { ok: true, mensaje: 'Liquidación devuelta para corregir' }; }
    // Aceptar el subtotal sugerido: en Vehículos se ajustan los km (o, sin valor por km, un ajuste); en Ramos Generales, el ajuste ±.
    if (tipo === 'aceptarSugerencia') { const l = L(d.id); if (!l || l.estado !== 'Por corregir') return NO('La liquidación no está «Por corregir»'); const o = (l.observaciones || []).find((x) => x.linea === sd(d.linea)), h = H(d.linea);
      if (!o || o.subtotalSugerido == null || !h) return NO('Esa línea no tiene un subtotal sugerido'); const c = LP.cambios(h), dd = LP.desglose(h);
      if (h.grupo === 'Vehículos' && h.tarifa.valorKm) { c.km = Math.max(0, Math.round((o.subtotalSugerido - dd.base - (Number(c.ajuste) || 0)) / h.tarifa.valorKm * 10) / 10); }
      else c.ajuste = LP.r2((Number(c.ajuste) || 0) + (o.subtotalSugerido - dd.subtotal));
      h.ajuste = { nivel: c.nivel == null ? null : c.nivel, horasVisita: c.horasVisita == null ? null : c.horasVisita, horasRedaccion: c.horasRedaccion == null ? null : c.horasRedaccion, equipos: c.equipos == null ? null : c.equipos, km: c.km == null ? null : c.km, valor: c.ajuste ? c.ajuste : null, comentario: 'Acepto el subtotal sugerido por la aseguradora (' + LP.usd(o.subtotalSugerido) + ')' };
      LP.recalc(h); totLiq(S, l, ctx.fecha); hist(l, 'Aceptó el subtotal sugerido de ' + (h.placa || h.bien) + ': ' + LP.usd(o.subtotalSugerido), ctx); return { ok: true, mensaje: 'Subtotal sugerido aceptado' }; }
    // La base vuelve a consultar el SRI con la clave (aquí, ctx.sri si la pantalla ya lo consultó, o el registro de la consulta simulada) y compara.
    if (tipo === 'enviarFactura') { const ls = (d.liquidaciones || []).map(sd).filter(Boolean), hs = (d.honorarios || []).map(sd).filter(Boolean); if (!ls.length && !hs.length) return NO('Marca al menos una liquidación aprobada o un honorario preacordado');
      const LL = ls.map(L), HH = hs.map(H); if (LL.some((l) => !l || l.estado !== 'Aprobada' || l.facturaId)) return NO('Alguna liquidación no está aprobada o ya está en otra factura');
      if (HH.some((h) => !h || h.estado !== 'Por facturar' || !libre(h))) return NO('Algún honorario no está «Por facturar» como preacordado o ya está en otra factura');
      const provs = LL.map((l) => l.proveedor).concat(HH.map((h) => h.proveedor)); if (provs.some((p) => !LP.mismo(p, provs[0]))) return NO('Todo lo de una factura debe ser del mismo proveedor');
      const SRI = W.SIRIUS_SRI, clave = sd(d.clave), ec = SRI && SRI.validarClave ? SRI.validarClave(clave) : (/^\d{49}$/.test(clave) ? '' : 'La clave de acceso tiene 49 dígitos'); if (ec) return NO(ec);
      if (S.facturas.some((f) => f.clave === clave && f.estado !== 'Factura devuelta')) return NO('Esa factura ya está cargada');
      const r = ctx.sri && ctx.sri.clave === clave ? ctx.sri : (SRI && SRI.registro ? SRI.registro(clave) : null); if (!r) return NO('El SRI no tiene un comprobante autorizado con esa clave de acceso');
      const e = LP.esperado(S, ls, hs, r.fecha), cmp = LP.compararSri(r, provs[0], e.subtotal);
      if (!cmp.estado) return NO('La factura no está AUTORIZADA en el SRI (' + sd(r.estado) + ')'); if (!cmp.ruc) return NO('El RUC del emisor (' + sd(r.ruc) + ') no es el del proveedor (' + LP.rucProveedor(provs[0]) + ')');
      if (!cmp.subtotal) return NO('El subtotal de la factura en el SRI (' + LP.usd(r.subtotal) + ') no coincide con lo marcado (' + LP.usd(e.subtotal) + ')');
      const nf = sigFac(S), id = 'FAC-' + String(nf).padStart(4, '0'); S.seq = Object.assign({}, S.seq || {}, { fac: nf + 1 });
      const f = { id, proveedor: clon(provs[0]), clave, numero: sd(r.numero), fecha: sd(r.fecha), sri: { estado: sd(r.estado), ruc: sd(r.ruc), subtotal: LP.r2(Number(r.subtotal)), iva: LP.r2(Number(r.iva)), total: LP.r2(Number(r.total)) }, liquidaciones: ls, honorarios: hs, subtotal: LP.r2(Number(r.subtotal)), estado: 'Por validar', motivo: '', pago: null, historial: [] };
      LL.forEach((l) => { l.estado = 'Facturada'; l.facturaId = id; l.lineas.forEach((x) => { const h = H(x); if (h) { h.estado = 'Facturado'; h.facturaId = id; } }); }); HH.forEach((h) => { h.estado = 'Facturado'; h.facturaId = id; });
      hist(f, 'Enviada con la clave del SRI: ' + ls.length + (ls.length === 1 ? ' liquidación' : ' liquidaciones') + ' y ' + hs.length + (hs.length === 1 ? ' honorario preacordado' : ' honorarios preacordados') + ' · subtotal ' + LP.usd(f.subtotal), ctx); S.facturas.push(f); return { ok: true, mensaje: 'Factura ' + f.numero + ' enviada: queda por validar en Finanzas', id }; }
    // ---------- F-1 · DEC-279: la factura en preparación (una por proveedor; lo agregado queda reservado con su facturaId) ----------
    if (['facturaAgregar', 'facturaQuitar', 'facturaDescartar', 'facturaConfirmar'].indexOf(tipo) >= 0) { const ls = (d.liquidaciones || []).map(sd).filter(Boolean), hs = (d.honorarios || []).map(sd).filter(Boolean);
      const LL = ls.map(L), HH = hs.map(H), prov = ctx.proveedor || (LL[0] && LL[0].proveedor) || (HH[0] && HH[0].proveedor) || null; if (!prov) return NO('No se sabe de qué proveedor es la factura');
      let f = S.facturas.find((x) => x.estado === 'En preparación' && LP.mismo(x.proveedor, prov)); const subt = () => { f.subtotal = LP.r2(f.liquidaciones.reduce((a, id) => a + ((L(id) || {}).subtotal || 0), 0) + f.honorarios.reduce((a, id) => a + ((H(id) || {}).subtotal || 0), 0)); };
      const res = (m) => ({ ok: true, mensaje: m, id: f.id, subtotal: f.subtotal, elementos: f.liquidaciones.length + f.honorarios.length });
      if (tipo === 'facturaAgregar') { if (!ls.length && !hs.length) return NO('Marca al menos una liquidación aprobada o un honorario preacordado');
        if (LL.some((l) => !l || l.estado !== 'Aprobada' || l.facturaId)) return NO('Alguna liquidación no está aprobada o ya está en una factura');
        if (HH.some((h) => !h || h.estado !== 'Por facturar' || !libre(h))) return NO('Algún honorario no está «Por facturar» o ya está en una factura');
        if (LL.map((l) => l.proveedor).concat(HH.map((h) => h.proveedor)).some((p) => !LP.mismo(p, prov))) return NO('Todo lo de una factura debe ser del mismo proveedor');
        if (!f) { const nf = sigFac(S); S.seq = Object.assign({}, S.seq || {}, { fac: nf + 1 }); f = { id: 'FAC-' + String(nf).padStart(4, '0'), proveedor: clon(prov), clave: '', numero: '', fecha: '', sri: null, liquidaciones: [], honorarios: [], subtotal: 0, estado: 'En preparación', motivo: '', pago: null, historial: [], enPreparacion: true, creada: ctx.fecha, devuelta: null }; S.facturas.push(f); hist(f, 'Factura en preparación abierta', ctx); }
        LL.forEach((l) => { l.facturaId = f.id; f.liquidaciones.push(l.id); }); HH.forEach((h) => { h.facturaId = f.id; f.honorarios.push(h.id); }); subt();
        hist(f, 'Agregó ' + [ls.length ? ls.length + (ls.length === 1 ? ' liquidación' : ' liquidaciones') : '', hs.length ? hs.length + (hs.length === 1 ? ' preacordado' : ' preacordados') : ''].filter(Boolean).join(' y '), ctx);
        return res((ls.length + hs.length) + ((ls.length + hs.length) === 1 ? ' agregado' : ' agregados') + ' a la factura en preparación'); }
      if (!f) return NO('No tienes una factura en preparación');
      if (tipo === 'facturaQuitar') { if (!ls.length && !hs.length) return NO('Elige qué quitar'); if (ls.some((id) => f.liquidaciones.indexOf(id) < 0) || hs.some((id) => f.honorarios.indexOf(id) < 0)) return NO('Eso no está en la factura en preparación');
        LL.forEach((l) => { l.facturaId = ''; }); HH.forEach((h) => { h.facturaId = ''; }); f.liquidaciones = f.liquidaciones.filter((id) => ls.indexOf(id) < 0); f.honorarios = f.honorarios.filter((id) => hs.indexOf(id) < 0); subt();
        hist(f, 'Quitó ' + (ls.length + hs.length) + ' (vuelve a «Por facturar»)', ctx); return res('Quitado: vuelve a «Por facturar»'); }
      if (tipo === 'facturaDescartar') { f.liquidaciones.forEach((id) => { const l = L(id); if (l) l.facturaId = ''; }); f.honorarios.forEach((id) => { const h = H(id); if (h) h.facturaId = ''; });
        f.estado = 'Descartada'; f.enPreparacion = false; hist(f, 'Descartada: lo incluido vuelve a «Por facturar»', ctx); return { ok: true, mensaje: 'Factura descartada: todo volvió a «Por facturar»' }; }
      // facturaConfirmar: la base valida la clave y consulta el SRI.
      if (!f.liquidaciones.length && !f.honorarios.length) return NO('La factura en preparación está vacía'); const SRI = W.SIRIUS_SRI, clave = sd(d.clave).replace(/\s/g, '');
      const ec = SRI && SRI.validarClave ? SRI.validarClave(clave) : (/^\d{49}$/.test(clave) ? '' : 'La clave de acceso tiene 49 dígitos'); if (ec) return NO(ec);
      const ruc = clave.slice(10, 23), rp = LP.rucProveedor(prov); if (ruc !== rp) return NO('El RUC del emisor (' + ruc + ') no es el del proveedor (' + rp + ')');
      if (S.facturas.some((x) => (x.clave === clave && x.estado !== 'Descartada') || (x.devuelta && x.devuelta.clave === clave))) return NO('Esa factura ya fue cargada antes');
      const r = ctx.sri && ctx.sri.clave === clave ? ctx.sri : (SRI && SRI.registro ? SRI.registro(clave) : null); if (!r || r.estado !== 'AUTORIZADO') return NO('El SRI no tiene una factura autorizada con esa clave de acceso');
      if (Math.abs(Number(r.subtotal) - f.subtotal) > 0.005) return NO('El subtotal de la factura en el SRI (' + LP.usd(r.subtotal) + ') no es el de esta factura (' + LP.usd(f.subtotal) + ')');
      f.clave = clave; f.numero = sd(r.numero); f.fecha = sd(r.fecha); f.sri = { estado: sd(r.estado), ruc: sd(r.ruc), subtotal: LP.r2(Number(r.subtotal)), iva: LP.r2(Number(r.iva)), total: LP.r2(Number(r.total)) }; f.estado = 'Por validar'; f.enPreparacion = false;
      f.liquidaciones.forEach((id) => { const l = L(id); if (l) { l.estado = 'Facturada'; l.facturaId = f.id; l.lineas.forEach((x) => { const h = H(x); if (h) { h.estado = 'Facturado'; h.facturaId = f.id; } }); } }); f.honorarios.forEach((id) => { const h = H(id); if (h) { h.estado = 'Facturado'; h.facturaId = f.id; } });
      hist(f, 'Confirmada con la clave del SRI · factura ' + f.numero + ' · subtotal ' + LP.usd(f.subtotal), ctx); return { ok: true, mensaje: 'Factura ' + f.numero + ' confirmada: queda por validar en Finanzas', id: f.id, numero: f.numero, subtotal: f.subtotal }; }
    if (tipo === 'validarFactura') { const f = F(d.id); if (!f || f.estado !== 'Por validar') return NO('La factura no está «Por validar»'); f.estado = 'Validada'; hist(f, 'Validada por Finanzas', ctx); return { ok: true, mensaje: 'Factura validada' }; }
    if (tipo === 'devolverFactura') { const f = F(d.id); if (!f || f.estado !== 'Por validar') return NO('La factura no está «Por validar»'); if (sd(d.motivo).length < 10) return NO('Escribe el motivo (mínimo 10 caracteres)');
      // F-1 · DEC-279: lo incluido vuelve a la factura en preparación del proveedor (reservado), con el motivo; si ya había otra en preparación, se suma a esa.
      const dev = { clave: f.clave, numero: f.numero, motivo: sd(d.motivo), por: ctx.por, fecha: ctx.fecha }, otra = S.facturas.find((x) => x !== f && x.estado === 'En preparación' && LP.mismo(x.proveedor, f.proveedor)), dest = otra || f;
      f.liquidaciones.forEach((x) => { const l = L(x); if (l) { l.estado = 'Aprobada'; l.facturaId = dest.id; l.lineas.forEach((y) => { const h = H(y); if (h) { h.estado = 'Por facturar'; h.facturaId = ''; } }); } }); f.honorarios.forEach((x) => { const h = H(x); if (h) { h.estado = 'Por facturar'; h.facturaId = dest.id; } });
      if (otra) { otra.liquidaciones = otra.liquidaciones.concat(f.liquidaciones); otra.honorarios = otra.honorarios.concat(f.honorarios); otra.subtotal = LP.r2(otra.subtotal + f.subtotal); otra.devuelta = dev; hist(otra, 'Se sumó lo de la factura ' + f.numero + ' devuelta', ctx, { motivo: dev.motivo });
        f.estado = 'Factura devuelta'; f.motivo = dev.motivo; f.enPreparacion = false; hist(f, 'Devuelta: lo incluido pasó a la factura en preparación', ctx, { motivo: dev.motivo }); }
      else { f.estado = 'En preparación'; f.enPreparacion = true; f.motivo = dev.motivo; f.devuelta = dev; f.clave = ''; f.numero = ''; f.fecha = ''; f.sri = null; hist(f, 'Devuelta: vuelve a la factura en preparación', ctx, { motivo: dev.motivo }); }
      return { ok: true, mensaje: 'Factura devuelta: vuelve a la factura en preparación del proveedor' }; }
    if (tipo === 'registrarPago') { const ids = (d.facturas || []).map(sd).filter(Boolean), FF = ids.map(F); if (!ids.length || FF.some((f) => !f || f.estado !== 'Validada')) return NO('Solo se paga una factura validada');
      if (!/^\d{4}-\d\d-\d\d$/.test(sd(d.fecha))) return NO('Escribe la fecha del pago'); if (!sd(d.referencia)) return NO('Escribe la referencia del pago');
      FF.forEach((f) => { f.estado = 'Pagada'; f.pago = { fecha: sd(d.fecha), referencia: sd(d.referencia) }; f.liquidaciones.forEach((x) => { const l = L(x); if (l) { l.estado = 'Pagada'; l.lineas.forEach((y) => { const h = H(y); if (h) h.estado = 'Pagado'; }); } }); f.honorarios.forEach((x) => { const h = H(x); if (h) h.estado = 'Pagado'; }); hist(f, 'Pagada · ' + LP.fecha(d.fecha) + ' · ref. ' + sd(d.referencia), ctx); });
      return { ok: true, mensaje: 'Pago registrado' }; }
    return NO('Acción desconocida: ' + tipo); };
  // Lo que debe decir la factura de lo marcado: se compara el subtotal; IVA y total son informativos.
  LP.esperado = (S, ls, hs, fecha) => { S = S || tienda(); const sub = LP.r2(ls.reduce((s, id) => s + ((S.liquidaciones.find((l) => l.id === id) || {}).subtotal || 0), 0) + hs.reduce((s, id) => s + ((S.honorarios.find((h) => h.id === id) || {}).subtotal || 0), 0)); const x = LP.ivaDe(sub, fecha); return { subtotal: sub, iva: x.iva, total: x.total, tasa: x.tasa }; };
  // ---------- Acciones (pantalla): al instante; con la conexión se envía y, con { ok: false }, vuelve atrás ----------
  const renFac = (S, de, a) => { if (!a || a === de) return; const f = S.facturas.find((x) => x.id === de); if (f) f.id = a; S.honorarios.forEach((h) => { if (h.facturaId === de) h.facturaId = a; }); S.liquidaciones.forEach((l) => { if (l.facturaId === de) l.facturaId = a; }); };
  const base = (tipo, carga) => { const c = C(); if (!c || typeof c.accion !== 'function') return Promise.resolve({ ok: false, mensaje: 'No hay conexión con la base.' });
    let pr; try { pr = Promise.resolve(c.accion(tipo, carga)); } catch (e) { pr = Promise.resolve({ ok: false, mensaje: (e && e.message) || 'La base no respondió.' }); }
    return pr.then((r) => r || { ok: false, mensaje: 'La base no respondió.' }, (e) => ({ ok: false, mensaje: (e && e.message) || 'La base no respondió.' })); };
  LP.base = base;
  // o.base: la carga que va a la base (false: solo la sesión, p. ej. el borrador); o.ctx: datos para la regla local (p. ej. la consulta al SRI ya hecha).
  LP.accion = (tipo, carga, por, o) => { o = o || {}; const S = tienda(), antes = clon({ h: S.honorarios, l: S.liquidaciones, f: S.facturas, s: S.seq || null }), volver = () => { ['honorarios', 'liquidaciones', 'facturas'].forEach((k, i) => { const v = [antes.h, antes.l, antes.f][i]; S[k].splice(0, S[k].length); v.forEach((x) => S[k].push(x)); }); S.seq = antes.s; syncBorr(S); avisar(); };
    const cb = o.base === undefined ? carga : o.base, r = LP.ops(S, tipo, carga, Object.assign({ por: por || LP.ctx.usuario() || '', fecha: LP.ahoraIso() }, o.ctx || {})); if (!r.ok) { volver(); return Promise.resolve(Object.assign({ validacion: true }, r)); }
    syncBorr(S); avisar(); if (!LP.cx() || cb === false) return Promise.resolve(r);
    return base(o.tipoBase || tipo, cb).then((rb) => { if (!rb || !rb.ok) { volver(); return { ok: false, mensaje: (rb && rb.mensaje) || 'La base no guardó el cambio.' }; }
      if (tipo === 'enviarLiquidacion' && rb.id) { renLiq(S, r.id, sd(rb.id)); const l = S.liquidaciones.find((x) => x.id === sd(rb.id)); if (l && rb.numero) l.numero = rb.numero; }
      if (tipo === 'enviarFactura' && rb.id) renFac(S, r.id, sd(rb.id)); syncBorr(S); avisar(); return Object.assign({}, r, rb, { id: rb.id || r.id, mensajeLocal: r.mensaje }); }); };
  const borr = (id) => { const l = LP.liq(id); return !!l && l.estado === 'Borrador'; };
  const AJN = (cambios) => { const c = cambios || {}, v = (k) => (c[k] === undefined || c[k] === '' ? null : c[k]); return { nivel: v('nivel'), horasVisita: v('horasVisita'), horasRedaccion: v('horasRedaccion'), equipos: v('equipos'), km: v('km'), valor: v('ajuste') }; };
  LP.ajustar = (id, cambios, comentario, por) => LP.accion('ajustarHonorario', Object.assign({ id }, AJN(cambios), { comentario: sd(comentario) }), por);
  LP.quitarAjuste = (id, por) => LP.accion('quitarAjuste', { id }, por);
  LP.crear = (lineas, por) => LP.accion('crearLiquidacion', { lineas: lineas.slice() }, por, { base: false });
  LP.editar = (id, agregar, quitar, por) => LP.accion('editarLiquidacion', { id, agregar: agregar || [], quitar: quitar || [] }, por, borr(id) ? { base: false } : {});
  LP.enviar = (id, por) => { const l = LP.liq(id); return LP.accion('enviarLiquidacion', { id }, por, { base: { lineas: l ? l.lineas.slice() : [] } }); };
  LP.reenviar = (id, por) => LP.accion('reenviarLiquidacion', { id }, por);
  LP.anular = (id, motivo, por) => LP.accion('anularLiquidacion', { id, motivo: sd(motivo) }, por, borr(id) ? { base: false } : {});
  LP.aprobar = (id, por) => LP.accion('aprobarLiquidacion', { id }, por);
  LP.devolver = (id, observaciones, motivo, por) => LP.accion('devolverLiquidacion', { id, observaciones: observaciones.map((o) => ({ linea: o.linea, texto: sd(o.texto), subtotalSugerido: o.subtotalSugerido == null || o.subtotalSugerido === '' ? null : LP.r2(Number(o.subtotalSugerido)) })), motivo: sd(motivo) }, por);
  LP.aceptar = (id, linea, por) => LP.accion('aceptarSugerencia', { id, linea }, por);
  LP.enviarFactura = (d, por) => LP.accion('enviarFactura', { clave: sd(d.clave), liquidaciones: d.liquidaciones.slice(), honorarios: d.honorarios.slice() }, por, { ctx: { sri: d.sri || null } });
  // F-1 · DEC-279: con la conexión la acción la aplica solo la base y la pantalla vuelve a cargar lo que trae la conexión; sin ella, la regla sobre la sesión.
  LP.accionBase = (tipo, carga, por, prov) => { if (LP.cx()) return base(tipo, carga).then((rb) => { LP._cc = null; avisar(); return rb && rb.ok ? rb : { ok: false, mensaje: (rb && rb.mensaje) || 'La base no guardó el cambio.' }; });
    const S = tienda(), r = LP.ops(S, tipo, clon(carga), { por: por || LP.ctx.usuario() || '', fecha: LP.ahoraIso(), proveedor: prov || null }); avisar(); return Promise.resolve(r); };
  LP.facturaPrep = (p) => LP.facturas().find((f) => f.estado === 'En preparación' && LP.deProv(p)(f)) || null;
  LP.facAgregar = (ls, hs, por, p) => LP.accionBase('facturaAgregar', { liquidaciones: (ls || []).slice(), honorarios: (hs || []).slice() }, por, p);
  LP.facQuitar = (ls, hs, por, p) => LP.accionBase('facturaQuitar', { liquidaciones: (ls || []).slice(), honorarios: (hs || []).slice() }, por, p);
  LP.facDescartar = (por, p) => LP.accionBase('facturaDescartar', {}, por, p);
  LP.facConfirmar = (clave, por, p) => LP.accionBase('facturaConfirmar', { clave: sd(clave).replace(/\s/g, '') }, por, p);
  // El proveedor del usuario de la conexión (la base lo sabe por la sesión; la base simulada lo toma de aquí).
  LP.provDeUsuario = (u) => { u = u || {}; if (u.agenciaRuc) return { tipo: 'agencia', identificacion: sd(u.agenciaRuc) }; if (u.tipoInspector === 'independiente' || u.tipo === 'Independiente' || u.tipo === 'Externo') return { tipo: 'inspector', identificacion: sd(u.identificacion) }; return null; };
  LP.validarFactura = (id, por) => LP.accion('validarFactura', { id }, por);
  LP.devolverFactura = (id, motivo, por) => LP.accion('devolverFactura', { id, motivo: sd(motivo) }, por);
  LP.registrarPago = (facturas, fecha, referencia, por) => LP.accion('registrarPago', { facturas: facturas.slice(), fecha: sd(fecha), referencia: sd(referencia) }, por);
  // Compara lo que devuelve el SRI con lo marcado: estado AUTORIZADO, RUC del emisor igual al del proveedor y subtotal igual.
  LP.compararSri = (r, prov, subtotal) => { const c = { estado: r.estado === 'AUTORIZADO', ruc: sd(r.ruc) === LP.rucProveedor(prov), subtotal: Math.abs(Number(r.subtotal) - subtotal) <= 0.005 }; c.ok = c.estado && c.ruc && c.subtotal; c.diferencia = LP.r2(Number(r.subtotal) - subtotal); return c; };
  // ---------- Consultas ----------
  LP.deProv = (p) => (x) => !p || LP.mismo(x.proveedor, p);
  LP.porLiquidar = (p) => LP.honorarios().filter((h) => h.estado === 'Por liquidar' && libre(h) && LP.deProv(p)(h));
  // H-3 · DEC-275: el completado del informe (tarifa fija, sin «Ajustar») y los honorarios «Por definir» (el concepto aplica y el contrato no tiene tarifa).
  LP.completado = (h) => !!h && (h.servicio === 'completado' || (h.calculo || {}).modelo === 'completado');
  LP.SERVICIO_COMPLETADO = 'Completado de informe';
  LP.lineasCalc = (h) => { const L = ((h && h.calculo) || {}).lineas; return Array.isArray(L) && L.length ? L : null; };
  LP.porDefinir = (h) => !!h && (h.estado === 'Por definir' || (LP.lineasCalc(h) || []).some((x) => x && x.porDefinir));
  LP.porDefinirTxt = (h) => { const x = (LP.lineasCalc(h) || []).find((y) => y && y.porDefinir), n = sd((x && (x.nombre || x.concepto)) || (LP.completado(h) ? 'Completado de informe' : 'este servicio')); return 'La aseguradora aún no define la tarifa de ' + n.charAt(0).toLowerCase() + n.slice(1) + ' en tu contrato'; };
  LP.porDefinirDe = (p) => LP.honorarios().filter((h) => h.estado === 'Por definir' && libre(h) && LP.deProv(p)(h));
  // Una línea del desglose: «2,5 h × USD 50,00 = USD 125,00 · del contrato Contrato Eurosurvey 2026» (o «Por definir: sin tarifa en el contrato»).
  LP.lineaCalcTxt = (x, h) => { if (x.porDefinir) return 'Por definir: sin tarifa en el contrato'; const u = sd(x.unidad), q = x.cantidad == null ? '' : LP.num(x.cantidad) + (u ? ' ' + u : ''), tn = sd(((h && h.calculo) || {}).tarifario).replace(/^contrato\s+/i, ''), o = x.origen === 'contrato' ? 'del contrato' + (tn ? ' ' + tn : '') : x.origen === 'general' ? 'del general' : ''; /* «del contrato Eurosurvey 2026» (sin repetir «Contrato») */
    return [(q ? q + ' × ' + LP.usd(x.unitario) + ' = ' : '') + LP.usd(x.valor), o].filter(Boolean).join(' · '); };
  LP.preacordadosPorFacturar = (p) => LP.honorarios().filter((h) => h.estado === 'Por facturar' && libre(h) && LP.deProv(p)(h));
  LP.liqsPorFacturar = (p) => LP.liquidaciones().filter((l) => l.estado === 'Aprobada' && !l.facturaId && LP.deProv(p)(l));
  LP.abiertas = (p) => LP.liquidaciones().filter((l) => ['Borrador', 'Por corregir'].indexOf(l.estado) >= 0 && LP.deProv(p)(l));
  LP.lineas = (l) => l.lineas.map(LP.hon).filter(Boolean);
  // La observación ya aceptada: el subtotal de la línea es el sugerido (la observación del contrato solo trae linea, texto y subtotalSugerido).
  LP.aceptada = (l, o) => { const h = o && LP.hon(o.linea); return !!h && o.subtotalSugerido != null && Math.abs(h.subtotal - o.subtotalSugerido) < 0.005; };
  LP.obsDe = (l, id) => (l.observaciones || []).find((o) => o.linea === id) || null;
  LP.listoParaEnviar = (l) => listo(tienda(), l);
  LP.multiVersion = () => { const o = {}; LP.liquidaciones().filter((l) => ['Anulada', 'Borrador'].indexOf(l.estado) < 0).forEach((l) => { const k = LP.provKey(l.proveedor), x = o[k] || (o[k] = { proveedor: l.proveedor, total: 0, mas: 0 }); x.total++; if ((l.version || 1) > 1) x.mas++; }); return Object.keys(o).map((k) => o[k]); };
  LP.contar = (L) => { const o = {}; LP.EST_H.forEach((e) => { o[e] = { n: 0, monto: 0 }; }); L.forEach((h) => { const x = o[h.estado]; if (x) { x.n++; x.monto = LP.r2(x.monto + h.subtotal); } }); return o; };
  // Tareas para Inicio (proveedor, aprobadores y Finanzas).
  LP.tareas = (vista) => { const out = []; if (!vista) return out; const p = vista.proveedor;
    if (p) { const pl = LP.porLiquidar(p); if (pl.length) out.push({ tipo: 'liquidar', n: pl.length, texto: pl.length + (pl.length === 1 ? ' inspección «Por liquidar»' : ' inspecciones «Por liquidar»') + ': arma la liquidación', boton: 'Liquidar', tab: 'Por liquidar' });
      LP.liquidaciones().filter((l) => l.estado === 'Por corregir' && LP.mismo(l.proveedor, p)).forEach((l) => out.push({ tipo: 'corregir', id: l.id, texto: 'Liquidación ' + LP.numTxt(l) + ' devuelta para corregir: ' + String(l.motivo || '').replace(/\.$/, ''), boton: 'Corregir en la mesa', tab: 'Mesa de trabajo' }));
      const pf = LP.liqsPorFacturar(p).length + LP.preacordadosPorFacturar(p).length; if (pf) out.push({ tipo: 'facturar', n: pf, texto: pf + ' por facturar (liquidaciones aprobadas y honorarios preacordados)', boton: 'Facturar', tab: 'Por facturar' });
      const fp = LP.facturaPrep(p); if (fp && fp.devuelta) out.push({ tipo: 'facturaDevuelta', id: fp.id, texto: 'Factura ' + fp.devuelta.numero + ' devuelta: ' + String(fp.devuelta.motivo || '').replace(/\.$/, '') + '. Volvió a tu factura en preparación', boton: 'Corregir factura', tab: 'Mesa de trabajo' }); }
    if (vista.aprueba) { const pa = LP.liquidaciones().filter((l) => l.estado === 'Enviada'); if (pa.length) out.push({ tipo: 'aprobar', n: pa.length, texto: pa.length + (pa.length === 1 ? ' liquidación por aprobar' : ' liquidaciones por aprobar'), boton: 'Revisar', tab: 'Por aprobar' }); }
    if (vista.finanzas) { const pv = LP.facturas().filter((f) => f.estado === 'Por validar'); if (pv.length) out.push({ tipo: 'validar', n: pv.length, texto: pv.length + (pv.length === 1 ? ' factura por validar' : ' facturas por validar'), boton: 'Validar', tab: 'Facturas por validar' }); const pp = LP.facturas().filter((f) => f.estado === 'Validada'); if (pp.length) out.push({ tipo: 'pagar', n: pp.length, texto: pp.length + (pp.length === 1 ? ' factura por pagar' : ' facturas por pagar'), boton: 'Registrar pago', tab: 'Por pagar' }); }
    return out; };
  // ---------- Documento «Liquidación de honorarios de inspección #N · vN» y factura (PDF con imprimir; Word con la plantilla) ----------
  const esc = (s) => sd(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  LP.filaDoc = (h, l) => { const o = l ? LP.obsDe(l, h.id) : null, d = LP.desglose(h); return { caso: h.caso, orden: h.orden || '—', asegurado: h.asegurado, ramo: h.ramo, modalidad: h.modalidad, objeto: h.placa ? h.placa + (h.bien ? ' · ' + h.bien : '') : h.bien || '—', fecha: LP.fecha(h.fecha),
    partes: d.partes.filter((p) => !/^Movilización/.test(p.concepto) && p.concepto !== 'Ajuste').map((p) => p.concepto + ' = ' + LP.usd(p.valor)).join('; '), km: d.km ? d.km + ' km' + (d.porValorar ? ' (por valorar)' : ' = ' + LP.usd(d.mov)) : '—',
    ajuste: LP.cambiado(h) ? (d.ajuste ? 'Ajuste ' + LP.usd(d.ajuste) + ' · ' : '') + (LP.comentario(h) || '—') : '—', observacion: o ? o.texto + (o.subtotalSugerido != null ? ' (sugerido ' + LP.usd(o.subtotalSugerido) + ')' : '') : '—', subtotal: LP.usd(h.subtotal) }; };
  LP.documento = (tipo, id) => { const P = (LP.D().plantillas || {})[tipo] || {}, cols = P.columnas || [], fill = (s, o) => sd(s).replace(/\{\{(\w+)\}\}/g, (m, k) => esc(o[k] == null ? '' : o[k]));
    let datos, grupos; if (tipo === 'liquidacion') { const l = LP.liq(id); if (!l) return null; const x = LP.ivaDe(l.subtotal, l.fechaIva); datos = { numero: LP.numTxt(l) + (l.numero ? '' : ' (vista previa)'), proveedor: LP.provNombre(l.proveedor), identificacion: l.proveedor.identificacion, estado: l.estado, fecha: LP.fecha(((l.versiones || [])[(l.versiones || []).length - 1] || {}).enviada || l.creada), subtotal: LP.usd(l.subtotal), iva: LP.usd(x.iva), tasa: x.tasa, total: LP.usd(x.total) };
      grupos = [{ titulo: 'Inspecciones', filas: LP.lineas(l).map((h) => LP.filaDoc(h, l)) }]; }
    else { const f = LP.fac(id); if (!f) return null; datos = { numero: f.numero, proveedor: LP.provNombre(f.proveedor), identificacion: LP.rucProveedor(f.proveedor), estado: f.estado, fecha: LP.fecha(f.fecha), subtotal: LP.usd(f.subtotal), iva: LP.usd((f.sri || {}).iva), tasa: '', total: LP.usd((f.sri || {}).total), clave: f.clave };
      grupos = f.liquidaciones.map((x) => { const l = LP.liq(x); return l ? { titulo: 'Liquidación ' + LP.numTxt(l) + ' · ' + LP.usd(l.subtotal), filas: LP.lineas(l).map((h) => LP.filaDoc(h, l)) } : null; }).filter(Boolean).concat(f.honorarios.length ? [{ titulo: 'Honorarios preacordados', filas: f.honorarios.map(LP.hon).filter(Boolean).map((h) => LP.filaDoc(h, null)) }] : []); }
    const tabla = (g) => '<h3>' + esc(g.titulo) + '</h3><table><thead><tr>' + cols.map((c) => '<th>' + esc(c[1]) + '</th>').join('') + '</tr></thead><tbody>' + g.filas.map((r) => '<tr>' + cols.map((c) => '<td>' + esc(r[c[0]]) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    const cuerpo = '<h1>' + fill(P.titulo, datos) + '</h1><p>' + fill(P.encabezado, datos) + '</p>' + grupos.map(tabla).join('') + '<p class="pie">' + fill(P.pie, datos) + '</p>';
    return { titulo: fill(P.titulo, datos), html: '<!doctype html><html><head><meta charset="utf-8"><title>' + fill(P.titulo, datos) + '</title><style>' + (P.estilo || '') + '</style></head><body>' + cuerpo + '</body></html>', cuerpo, datos, grupos, columnas: cols }; };
  // ---------- DEC-248: documento PDF de la liquidación aprobada (se descarga; solo Aprobada, Facturada o Pagada). SiriusPdf.liquidacion lo dibuja. ----------
  LP.pdfDisponible = (l) => !!l && ['Aprobada', 'Facturada', 'Pagada'].indexOf(l.estado) >= 0;
  // P-1d · DEC-277: el cargo es el rol de quien aprobó (vacío si no se encuentra; nunca el nombre de la aseguradora).
  LP.cargoDe = (nombre) => { const c = C(), L = (c && c.activo ? (c.usuarios || []) : []).concat((W.SIRIUS_USUARIOS || {}).usuarios || []), u = L.find((x) => sd(x.nombre) === sd(nombre)) || {}; return sd(u.rol || (u.roles || [])[0]); };
  const hash8 = (t) => { let x = 0x811c9dc5; for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return ('0000000' + x.toString(16).toUpperCase()).slice(-8); };
  // P-1d · DEC-277: la aprobación de la conexión (liquidaciones[].aprobada); sin ella (demostración), la del historial. El período, de las fechas de las líneas
  // o, sin fechas, de liquidaciones[].periodo ('2026-11' → del 01 al último día del mes). Base y movilización de cada fila: las del cálculo de la base.
  const periodoDe = (p) => { const m = /^(\d{4})-(\d\d)/.exec(sd(p)); if (!m) return null; const ult = new Date(Number(m[1]), Number(m[2]), 0).getDate(); return [m[1] + '-' + m[2] + '-01', m[1] + '-' + m[2] + '-' + pad(ult)]; };
  LP.documentoPdf = (id) => { const l = LP.liq(id); if (!LP.pdfDisponible(l)) return null; const xs = LP.lineas(l), hi = l.historial || [], ve = (l.versiones || []).filter((v) => v.version === l.version)[0] || (l.versiones || [])[(l.versiones || []).length - 1] || {};
    const A0 = l.aprobada && typeof l.aprobada === 'object' ? l.aprobada : null, ap = A0 ? { fecha: sd(A0.fecha), por: sd(A0.por) } : (hi.slice().reverse().find((e) => /^Aprobada v/.test(e.que || '')) || {});
    const fe0 = xs.map((x) => sd(x.fecha).slice(0, 10)).filter(Boolean).sort(), fe = fe0.length ? fe0 : (periodoDe(l.periodo) || []), p = l.proveedor || {}, ag = p.tipo === 'agencia' ? (LP.agencia(p.identificacion) || {}) : null, n6 = String(l.numero).padStart(6, '0');
    const filas = xs.map((x, i) => { const d = LP.desglose(x), c = x.calculo || {}, rg = x.grupo !== 'Vehículos', km = Number(LP.val(x, 'km')) || 0;
      const cxB = c.base != null && !LP.cambiado(x), base0 = cxB ? Number(c.base) : d.base, mov0 = cxB && c.movilizacion != null ? Number(c.movilizacion) : d.mov; /* P-1d: lo que calculó la base */
      return { n: i + 1, caso: x.caso, orden: x.orden || '—', asegurado: x.asegurado, placa: x.placa || x.bien, rg, clase: rg ? LP.nivelCorto(LP.val(x, 'nivel')) + ' · ' + LP.num(LP.val(x, 'horasVisita')) + '+' + LP.num(LP.val(x, 'horasRedaccion')) + ' h · ' + LP.val(x, 'equipos') + ' eq' : LP.claseNombre(c.clase || 'liviano'), claseId: rg ? 'rg' : (c.clase || 'liviano'),
        enBase: LP.enBase(x), km, base: LP.r2(base0 + d.ajuste), ajuste: d.ajuste, mov: LP.r2(mov0), porValorar: d.porValorar, subtotal: x.subtotal, calificacion: x.calificacion || 'Asegurable', referencia: LP.refLinea(x) }; });
    const suma = (L, k) => LP.r2(L.reduce((a, r) => a + (Number(r[k]) || 0), 0)), fuera = filas.filter((r) => !r.enBase), clases = LP.clases().map((c) => ({ id: c.id, nombre: c.nombre, filas: filas.filter((r) => r.claseId === c.id) })).filter((c) => c.filas.length), rgs = filas.filter((r) => r.rg);
    const comp = clases.map((c) => ({ id: c.id, texto: 'Tarifa ' + c.nombre.toLowerCase() + (c.filas.length === 1 ? '' : 's'), valor: suma(c.filas, 'base') })).concat(rgs.length ? [{ id: 'rg', texto: 'Ramos Generales (hora-hombre)', valor: suma(rgs, 'base') }] : [], suma(filas, 'mov') ? [{ id: 'mov', texto: 'Movilización (km)', valor: suma(filas, 'mov') }] : []);
    const iv = LP.ivaDe(l.subtotal, ap.fecha || ''), veh = xs.filter((x) => x.grupo === 'Vehículos'), tar = LP.clases().map((c) => { const x = veh.find((y) => (y.calculo || {}).clase === c.id); return x ? c.nombre.toLowerCase() + ' ' + LP.usd(x.tarifa.vehiculo) : ''; }).filter(Boolean).join(' · '), vk = (xs.find((x) => x.tarifa && x.tarifa.valorKm != null) || { tarifa: {} }).tarifa.valorKm;
    const d = { archivo: 'Liquidación_' + n6 + '_v' + l.version + '.pdf', titulo: 'Liquidación de honorarios de inspección #' + n6, numero: '#' + n6, version: l.version, estado: l.estado,
      aseguradora: { nombre: 'ASEGURADORA DEL SUR C.A.', proceso: 'Proceso de Inspecciones · Nuevo Riesgo', ciudad: 'Quito', fecha: sd(ap.fecha).slice(0, 10) },
      periodo: { desde: fe[0] || '', hasta: fe[fe.length - 1] || '' }, proveedor: { nombre: LP.provNombre(p), razon: ag ? sd(ag.razonSocial || ag.nombre) : LP.provNombre(p), ruc: LP.rucProveedor(p), tipo: p.tipo },
      aprobada: { fecha: sd(ap.fecha), por: sd(ap.por), cargo: LP.cargoDe(ap.por) || '' }, presentado: { fecha: sd(ve.enviada), por: sd(ve.por) },
      resumen: { n: filas.length, casos: new Set(xs.map((x) => x.caso)).size, porClase: clases.map((c) => ({ nombre: c.nombre.toLowerCase() + (c.filas.length === 1 ? '' : 's'), n: c.filas.length })).concat(rgs.length ? [{ nombre: 'de Ramos Generales', n: rgs.length }] : []), fuera: { n: fuera.length, km: suma(fuera, 'km'), valor: suma(fuera, 'mov') }, composicion: comp },
      contrato: sd((xs[0] && xs[0].calculo && xs[0].calculo.tarifario) || ''), tarifa: tar, valorKm: vk, filas, subtotal: l.subtotal, sumaLineas: suma(filas, 'subtotal'), iva: iv.iva, tasa: iv.tasa, total: iv.total };
    d.codigo = 'LQ-' + n6 + '-v' + l.version + '-' + hash8(JSON.stringify([n6, l.version, d.subtotal, filas.map((r) => r.caso + r.placa + r.subtotal), d.aprobada.fecha])); return d; };
  // P-1d · DEC-277: el documento listo para dibujar. Sin líneas, no hay PDF. Con la conexión, el código es el que registra la base (documentoRegistrar
  // { documento: 'liquidacion', liquidacion: <número>, huella SHA-256 del contenido }); si la base responde { ok: false }, no se genera y se muestra su mensaje.
  LP.SIN_LINEAS = 'La liquidación no tiene líneas: no se genera su PDF';
  const sha256 = async (t) => { const b = new TextEncoder().encode(String(t)), S = W.crypto && W.crypto.subtle; if (!S) throw new Error('Este navegador no calcula la huella del documento (SHA-256).'); const h = await S.digest('SHA-256', b); return Array.from(new Uint8Array(h)).map((x) => x.toString(16).padStart(2, '0')).join(''); };
  LP.pdfListo = async (id) => { const l = LP.liq(id); if (!LP.pdfDisponible(l)) return { ok: false, mensaje: 'El PDF está disponible cuando la liquidación esté aprobada.' };
    if (!(l.lineas || []).length || !LP.lineas(l).length) return { ok: false, mensaje: LP.SIN_LINEAS }; const d = LP.documentoPdf(id); if (!d) return { ok: false, mensaje: 'No se pudo armar el documento.' };
    const X = C(); if (LP.cx() && X && X.activo === true) { if (typeof X.documentoRegistrar !== 'function') return { ok: false, mensaje: 'La conexión no registra documentos: no se generó el PDF.' };
      const huella = await sha256(JSON.stringify(Object.assign({}, d, { codigo: '' }))); let r = null; try { r = await X.documentoRegistrar({ documento: 'liquidacion', liquidacion: l.numero, huella }); } catch (e) { r = { ok: false, mensaje: (e && (e.message || e.mensaje)) || 'La base no respondió.' }; }
      if (!r || r.ok === false) return { ok: false, mensaje: (r && (r.mensaje || r.error)) || 'La base no registró el documento: no se generó el PDF.' }; d.codigo = r.mostrar || r.codigo || d.codigo; d.registro = Object.assign({ huella }, r); }
    return { ok: true, d }; };
  W.SiriusLiqProceso = LP;
})();
