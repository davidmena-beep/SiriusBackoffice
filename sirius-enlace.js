// SIRIUS · Ciclo de vida del enlace de autoinspección (prototipo · etapa 13 · DEC-169)
// Motor: calcula el estado del enlace desde su línea de tiempo y el reloj (nunca se escribe a mano), envía y reenvía por canal con consentimiento,
// amplía la vigencia, revoca, invalida, dispara los recordatorios (reglas R13 a R15 de SIRIUS_NOTIFICACIONES), registra el vencimiento (T05 + aviso R16)
// y guarda las tareas que el cliente pide desde el portal (R17). Interfaz: SiriusEnlaceTarjeta (estado, línea de tiempo compacta y acciones).
// Los datos viven en SIRIUS_AUTOINSPECCION.enlace.ciclo y SIRIUS_NOTIFICACIONES; aquí solo hay lógica. En producción el estado de entrega lo
// confirman Genesys (WhatsApp y SMS) y Gmail (correo); en el prototipo se simula con los minutos de enlace.ciclo.entrega.
(function () {
  'use strict';
  var W = window; if (W.SiriusEnlace && W.SiriusEnlace.__v) return;   // un solo motor aunque el componente vuelva a cargar el archivo (x-import)
  var z2 = function (n) { return String(n).padStart(2, '0'); };
  var CFG = function () { return W.SIRIUS_AUTOINSPECCION || {}; };
  var CI = function () { return (CFG().enlace || {}).ciclo || {}; };
  var NT = function () { return W.SIRIUS_NOTIFICACIONES || {}; };
  var FL = function () { return W.SIRIUS_FLUJO || null; };
  var EJ = function () { return W.SIRIUS_EJEMPLO || {}; };
  var NOMBRE = { whatsapp: 'WhatsApp', sms: 'SMS', correo: 'Correo', app: 'App' };

  // ---------- Reloj y fechas ----------
  // El reloj del prototipo (SIRIUS_EJEMPLO.ahora) más el tiempo real transcurrido: la confirmación de entrega llega pasados 1 a 3 minutos.
  var T0 = Date.now();
  var base = function () { return EJ().ahora ? EJ().ahora() : new Date(2026, 9, 18, 20, 30); };
  function now() { return new Date(base().getTime() + (Date.now() - T0)); }
  function parse(s) { var m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null; }
  function iso(d) { return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes()); }
  function addMin(d, m) { return new Date(d.getTime() + m * 60000); }
  function corta(s) { var m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(typeof s === 'string' ? s : s ? iso(s) : ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + ' · ' + m[4] + ':' + m[5] : ''; }
  function hora(s) { return String(typeof s === 'string' ? s : iso(s)).slice(11, 16); }
  // Horario de envío a clientes (SIRIUS_NOTIFICACIONES.horario.clientes): fuera de él, se envía al inicio del siguiente tramo.
  function ajustar(d) {
    var h = (NT().horario || {}).clientes || { dias: [1, 2, 3, 4, 5, 6], desde: '08:00', hasta: '19:00' }, mm = function (t) { var p = String(t).split(':'); return +p[0] * 60 + +p[1]; };
    var x = new Date(d.getTime()), ok = function (y) { return h.dias.indexOf(y.getDay()) >= 0; }, ini = function (y) { var r = new Date(y.getFullYear(), y.getMonth(), y.getDate()); r.setMinutes(mm(h.desde)); return r; };
    var min = x.getHours() * 60 + x.getMinutes();
    if (ok(x) && min >= mm(h.desde) && min <= mm(h.hasta)) return x;
    if (ok(x) && min < mm(h.desde)) return ini(x);
    for (var k = 0; k < 8; k++) { x = new Date(x.getFullYear(), x.getMonth(), x.getDate() + 1); if (ok(x)) return ini(x); }
    return d;
  }

  // ---------- Almacén de la sesión ----------
  var S = { ev: {}, tareas: [], seq: 0, dialogo: null };
  var oyentes = [];
  var ctx = { usuario: function () { return 'Coordinador de inspecciones'; }, cronologia: null, alVencer: null, alCambio: null, contacto: null };
  function cambio() { oyentes.slice().forEach(function (f) { try { f(); } catch (e) {} }); if (ctx.alCambio) { try { ctx.alCambio(); } catch (e) {} } }
  function tokenDe(url) { return String(url || '').split(/\/ai?\//)[1] || ''; }

  // ---------- Enlaces ----------
  function todos() { return (W.SIRIUS_PORTAL_ENLACES || []).concat((EJ().autoinspeccion || {}).enlaces || []); }
  function enlace(token) { return token ? todos().find(function (x) { return x.token === token; }) || null : null; }
  // Cambios sobre un enlace: se guarda una copia en la sesión (los datos del prototipo no se tocan).
  function modificar(token, patch) { var b = enlace(token); if (!b) return null; var c = Object.assign({}, b, patch); W.SIRIUS_PORTAL_ENLACES = [c].concat((W.SIRIUS_PORTAL_ENLACES || []).filter(function (x) { return x.token !== token; })); return c; }
  function consentimiento(caso) { var k = ((NT().consentimiento || {}).casos || {})[caso] || {}; return { whatsapp: !!k.whatsapp, sms: !!k.sms }; }
  function canalesDe(caso, lista) { return NT().canalesCliente ? NT().canalesCliente(caso, lista) : lista; }
  function contactoDe(l) { return (l && l.contacto && l.contacto.nombre) || 'Contacto del caso'; }
  function entregaInfo(canal) { return ((CI().entrega || {})[canal]) || { minutos: 1, proveedor: '' }; }

  // ---------- Eventos ----------
  function agregar(token, e) { var o = ++S.seq; (S.ev[token] = S.ev[token] || []).push(Object.assign({ _o: o }, e)); }
  function sinteticos(l) { return canalesDe(l.caso, ['whatsapp', 'sms']).map(function (c) { return { tipo: 'envio', at: l.envio, canal: c, origen: 'inicial', _sint: true, _o: 0 }; }); }
  function eventos(token) {
    var l = enlace(token); if (!l) return [];
    var g = (S.ev[token] || []).slice();
    if (l.envio && !g.some(function (e) { return e.tipo === 'envio' && e.origen === 'inicial'; })) g = sinteticos(l).concat(g);
    return g.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)) || (a._o || 0) - (b._o || 0); });
  }
  function entregaAt(e) { return addMin(parse(e.at), entregaInfo(e.canal).minutos); }
  function estadoEnvio(e, n) { return e.omitido ? 'Omitido' : parse(e.at) > n ? 'Programado' : e.falla ? 'Fallido' : entregaAt(e) <= n ? 'Entregado' : 'Enviado'; }

  // ---------- Estado (se calcula, no se escribe) ----------
  var TERMINALES = ['revocado', 'invalidado', 'completado', 'vencido'];
  function estado(token) {
    var l = enlace(token); if (!l) return null;
    var ev = eventos(token), n = now(), cat = CI().estados || [];
    var hay = function (t) { return ev.some(function (e) { return e.tipo === t && parse(e.at) <= n; }); };
    var id;
    if (l.revocado || hay('revocacion')) id = 'revocado';
    else if (l.anulado || hay('invalidacion')) id = 'invalidado';
    else if (hay('completado')) id = 'completado';
    else if (l.vence && parse(l.vence) <= n) id = 'vencido';
    else if (hay('accion')) id = 'encurso';
    else if (hay('apertura')) id = 'abierto';
    else if (ev.some(function (e) { return e.tipo === 'envio' && estadoEnvio(e, n) === 'Entregado'; })) id = 'entregado';
    else if (ev.some(function (e) { return e.tipo === 'envio' && !e.omitido && parse(e.at) <= n; })) id = 'enviado';
    else id = 'generado';
    var acc = ev.filter(function (e) { return e.tipo === 'accion' && parse(e.at) <= n; }), ult = acc[acc.length - 1], con = ev.filter(function (e) { return e.tipo === 'continuacion' && parse(e.at) <= n; });
    if (!ult && con.length) ult = con[con.length - 1];   // etapa 10b-c: el enlace nuevo parte del avance guardado
    var def = cat.find(function (x) { return x.id === id; }) || { id: id, nombre: id, tono: 'neutral', nota: '' };
    return Object.assign({}, def, { avance: ult ? ult.avance || '' : '', vence: l.vence || '', vigente: TERMINALES.indexOf(id) < 0, terminal: TERMINALES.indexOf(id) >= 0 });
  }

  // ---------- Recordatorios (reglas R13 a R15 de Notificaciones, editables en Portal del cliente › Flujo) ----------
  function reglaDe(id) { var r = NT().regla ? NT().regla(id) : null; return r && r.estado === 'Activa' ? r : null; }
  function debido(l, rid) {
    var r = reglaDe(rid); if (!r) return null; var ev = eventos(l.token), cu = r.cuando || {}, F = FL(), d, ref;
    var envios = ev.filter(function (e) { return e.tipo === 'envio' && e.origen !== 'recordatorio' && !e.omitido; });
    var ultEnvio = envios.length ? parse(envios[envios.length - 1].at) : parse(l.envio);
    if (cu.fecha === 'enlace.envio') {
      if (!ultEnvio) return null;
      d = cu.habiles && F && F.sumarHabiles ? F.sumarHabiles(ultEnvio, (cu.horas || 24) * 60) : addMin(ultEnvio, (cu.horas || 24) * 60); ref = iso(ultEnvio);
      var ap = ev.find(function (e) { return e.tipo === 'apertura'; }); if (ap && parse(ap.at) <= d) return null;   // si ya lo abrió antes de las 24 h, no hay recordatorio
    } else if (cu.fecha === 'enlace.ultimaAccion') {
      var acc = ev.filter(function (e) { return e.tipo === 'accion'; }); if (!acc.length) return null;
      var u = acc[acc.length - 1]; d = addMin(parse(u.at), (cu.horas || 24) * 60); ref = u.at;
    } else if (cu.fecha === 'enlace.vence') {
      var v = parse(l.vence); if (!v) return null; d = addMin(v, (cu.dias || 0) * 1440 + (cu.horas || 0) * 60); ref = l.vence;
      if (ultEnvio && d <= addMin(ultEnvio, 60)) return null;   // un enlace tan corto no manda aviso al enviarse
    } else return null;
    d = ajustar(d);
    if (parse(l.vence) && d >= parse(l.vence)) return null;
    return { regla: rid, at: d, ref: ref, condicion: cu.condicion || '' };
  }
  function hecho(token, rid, ref) { return (S.ev[token] || []).some(function (e) { return e.tipo === 'envio' && e.origen === 'recordatorio' && e.regla === rid && e.ref === ref; }); }
  function remitente(canal) { var r = NT().remitente || {}; return canal === 'correo' ? r.institucional || 'notificaciones@asur.ec' : 'Aseguradora del Sur'; }
  function bitacora(fila) { var B = NT().bitacora; if (!B) return; B.unshift(Object.assign({ _sesion: true }, fila)); }
  // Envía por los canales dados; los que el cliente no aceptó quedan «Omitido» con motivo (misma regla que R05).
  function emitir(l, o) {
    var at = o.at, soli = o.canales, con = consentimiento(l.caso), efect = canalesDe(l.caso, soli), regla = o.regla || 'R07', fin = [];
    soli.forEach(function (c) {
      var sin = (c === 'whatsapp' && !con.whatsapp) || (c === 'sms' && !con.sms);
      if (sin && efect.indexOf(c) < 0) {
        agregar(l.token, { tipo: 'envio', at: iso(at), canal: c, origen: o.origen, regla: o.regla, ref: o.ref, omitido: true, nota: 'Sin consentimiento para ' + NOMBRE[c] });
        bitacora({ fecha: iso(at), regla: regla, caso: l.caso, canal: c, a: contactoDe(l), remitente: remitente(c), estado: 'Omitido', motivo: 'Sin consentimiento para ' + NOMBRE[c] + '; se envió por ' + efect.map(function (x) { return NOMBRE[x].toLowerCase(); }).join(' y ') });
      }
    });
    efect.forEach(function (c) {
      var e = { tipo: 'envio', at: iso(at), canal: c, origen: o.origen, regla: o.regla, ref: o.ref, por: o.por };
      agregar(l.token, e); fin.push(c);
      bitacora({ fecha: iso(at), regla: regla, caso: l.caso, canal: c, a: contactoDe(l), remitente: remitente(c), estado: estadoEnvio(e, now()) === 'Entregado' ? 'Entregado' : 'Enviado' });
    });
    return fin;
  }
  function recordar(l, d) {
    var r = reglaDe(d.regla), fin = emitir(l, { at: d.at, canales: r.canales.filter(function (c) { return c !== 'app'; }), origen: 'recordatorio', regla: d.regla, ref: d.ref });
    if (ctx.cronologia) ctx.cronologia(l.caso, 'Recordatorio automático ' + d.regla + ' («' + d.condicion + '») enviado a ' + contactoDe(l) + ' por ' + fin.map(function (c) { return NOMBRE[c]; }).join(' y ') + ' · enlace ' + l.visita, corta(d.at), 'Sistema · Notificaciones');
  }
  function vencer(l) {
    agregar(l.token, { tipo: 'vencimiento', at: l.vence });
    var info = ctx.alVencer ? ctx.alVencer(l) : null; info = info || {};
    var ev = (S.ev[l.token] || []); ev[ev.length - 1].t05 = !!info.t05;
    var coord = reglaDe('R16');
    if (coord) bitacora({ fecha: l.vence, regla: 'R16', caso: l.caso, canal: 'app', a: 'Coordinador de inspecciones', remitente: 'SIRIUS', estado: 'Entregado' });
  }
  // Recordatorios que tocan y vencimientos: solo los enlaces de la sesión (los de los datos del prototipo no se mueven solos).
  function procesar() {
    var hizo = false, n = now();
    (W.SIRIUS_PORTAL_ENLACES || []).filter(function (x, i, a) { return a.findIndex(function (y) { return y.token === x.token; }) === i; }).forEach(function (l) {
      var st = estado(l.token); if (!st) return;
      if (['revocado', 'invalidado', 'completado'].indexOf(st.id) < 0) ['R13', 'R14', 'R15'].forEach(function (rid) { var d = debido(l, rid); if (d && d.at <= n && !hecho(l.token, rid, d.ref)) { recordar(l, d); hizo = true; } });
      st = estado(l.token);
      if (st.id === 'vencido' && !(S.ev[l.token] || []).some(function (e) { return e.tipo === 'vencimiento'; })) { vencer(l); hizo = true; }
    });
    if (hizo) cambio();
    return hizo;
  }
  function proximos(token) {
    var l = enlace(token), st = estado(token), out = []; if (!l || !st || !st.vigente) return out; var n = now();
    ['R13', 'R14', 'R15'].forEach(function (rid) { var d = debido(l, rid); if (d && d.at > n && !hecho(token, rid, d.ref)) out.push({ regla: rid, at: iso(d.at), condicion: d.condicion }); });
    return out.sort(function (a, b) { return a.at.localeCompare(b.at); });
  }

  // ---------- Acciones del Coordinador y del portal ----------
  function reenviar(token, o) {
    var l = enlace(token); if (!l) return [];
    var lista = o && o.canales && o.canales.length ? o.canales : ['whatsapp', 'sms'];
    var fin = emitir(l, { at: now(), canales: lista, origen: o && o.otro ? 'otro' : 'reenvio', por: (o && o.por) || ctx.usuario() });
    cambio(); return fin;
  }
  function activoDe(caso) { var l = todos().filter(function (x) { return x.caso === caso; }); return l.filter(function (x) { return !x.anulado; })[0] || l[0] || null; }
  function opcionesAmpliar(token) {
    var l = enlace(token), c = CI().ampliacion || { opciones: [3, 5, 7], maximoDias: 20 }; if (!l) return [];
    var tope = addMin(parse(l.envio), c.maximoDias * 1440), v = parse(l.vence);
    return c.opciones.map(function (d) { var nuevo = addMin(v, d * 1440), ok = nuevo <= tope; return { dias: d, ok: ok, nuevo: iso(nuevo), motivo: ok ? '' : 'Pasaría del máximo de ' + c.maximoDias + ' días desde el envío (' + corta(tope) + ').' }; });
  }
  function topeAmpliar(token) { var l = enlace(token), c = CI().ampliacion || { maximoDias: 20 }; return l ? iso(addMin(parse(l.envio), c.maximoDias * 1440)) : ''; }
  function ampliar(token, dias, motivo, por) {
    var l = enlace(token), st = estado(token); if (!l || !st || !st.vigente) return null;
    var op = opcionesAmpliar(token).find(function (x) { return x.dias === dias; }); if (!op || !op.ok) return null;
    modificar(token, { vence: op.nuevo });
    agregar(token, { tipo: 'ampliacion', at: iso(now()), dias: dias, motivo: motivo, por: por || ctx.usuario(), de: l.vence, a: op.nuevo });
    cambio(); return op.nuevo;
  }
  function revocar(token, motivo, por) {
    var l = enlace(token), st = estado(token); if (!l || !st || !st.vigente) return false;
    modificar(token, { revocado: true, anulado: true, estado: 'Revocado' });
    agregar(token, { tipo: 'revocacion', at: iso(now()), motivo: motivo, por: por || ctx.usuario() });
    cambio(); return true;
  }
  function invalidar(token, motivo) {
    var l = enlace(token); if (!l) return; var st = estado(token);
    if (st && st.id !== 'invalidado' && st.id !== 'revocado' && st.id !== 'completado') agregar(token, { tipo: 'invalidacion', at: iso(now()), motivo: motivo || 'Se generó un enlace nuevo' });
  }
  function apertura(token, at) { if (!enlace(token) || (S.ev[token] || []).some(function (e) { return e.tipo === 'apertura'; })) return; agregar(token, { tipo: 'apertura', at: String(at || iso(now())).slice(0, 16) }); cambio(); }
  function accion(token, at, avance) { if (!enlace(token)) return; agregar(token, { tipo: 'accion', at: String(at || iso(now())).slice(0, 16), avance: avance || '' }); cambio(); }
  function completado(token, at) { if (!enlace(token)) return; agregar(token, { tipo: 'completado', at: String(at || iso(now())).slice(0, 16) }); cambio(); }

  // ---------- Tareas que el cliente crea desde el portal (R17) ----------
  function tarea(tipo, caso, o) {
    var c = (CI().tareas || {})[tipo]; if (!c) return null; o = o || {};
    var ya = S.tareas.find(function (t) { return t.tipo === tipo && t.caso === caso && !t.hecha; }); if (ya) return ya;
    var t = { id: 'TE' + (S.tareas.length + 1), tipo: tipo, caso: caso, at: o.at || iso(now()), por: o.por || '', asegurado: o.asegurado || '', token: o.token || '', titulo: c.titulo, accion: c.accion, detalle: c.detalle, hecha: false };
    S.tareas.push(t);
    if (reglaDe('R17')) bitacora({ fecha: t.at, regla: 'R17', caso: caso, canal: 'app', a: 'Coordinador de inspecciones', remitente: 'SIRIUS', estado: 'Entregado' });
    cambio(); return t;
  }
  function tareas() { return S.tareas.filter(function (t) { return !t.hecha; }).map(function (t) { return Object.assign({}, t); }); }
  function cerrarTareas(caso) { var h = false; S.tareas.forEach(function (t) { if (t.caso === caso && !t.hecha) { t.hecha = true; h = true; } }); if (h) cambio(); return h; }

  // ---------- Línea de tiempo compacta ----------
  function lineas(token) {
    var l = enlace(token); if (!l) return []; var ev = eventos(token), n = now(), rows = [], gr = {};
    ev.filter(function (e) { return e.tipo === 'envio' && parse(e.at) <= n; }).forEach(function (e) {
      var k = e.at + '|' + e.origen + '|' + (e.regla || ''), g = gr[k];
      if (!g) { g = gr[k] = { at: e.at, tipo: 'envio', origen: e.origen, regla: e.regla, canales: [] }; rows.push(g); }
      var es = estadoEnvio(e, n); g.canales.push({ canal: e.canal, nombre: NOMBRE[e.canal] || e.canal, estado: es, hora: es === 'Entregado' ? hora(entregaAt(e)) : '', nota: e.omitido ? e.nota : e.falla || '', proveedor: entregaInfo(e.canal).proveedor });
    });
    rows.forEach(function (g) {
      var r = g.regla ? NT().regla(g.regla) : null;
      g.titulo = g.origen === 'recordatorio' ? 'Recordatorio ' + g.regla : g.origen === 'otro' ? 'Reenviado por otro canal' : g.origen === 'reenvio' ? 'Reenviado' : 'Enlace enviado';
      g.detalle = g.origen === 'recordatorio' && r ? (r.cuando || {}).condicion || '' : '';
    });
    var acc = ev.filter(function (e) { return e.tipo === 'accion' && parse(e.at) <= n; });
    ev.filter(function (e) { return e.tipo !== 'envio' && parse(e.at) <= n; }).forEach(function (e) {
      if (e.tipo === 'apertura') rows.push({ at: e.at, tipo: 'hito', tono: 'teal', titulo: 'Abrió el enlace', detalle: 'Primer acceso al portal' });
      else if (e.tipo === 'accion') { if (e === acc[0]) rows.push({ at: e.at, tipo: 'hito', tono: 'teal', titulo: 'Empezó la autoinspección', detalle: e.avance || '' }); else if (e === acc[acc.length - 1]) rows.push({ at: e.at, tipo: 'hito', tono: 'teal', titulo: 'Última acción', detalle: e.avance || '' }); }
      else if (e.tipo === 'continuacion') rows.push({ at: e.at, tipo: 'hito', tono: 'teal', titulo: 'Continúa desde el avance guardado', detalle: (e.avance ? e.avance + ' · ' : '') + 'lo cargado en el enlace anterior se conserva' });
      else if (e.tipo === 'completado') rows.push({ at: e.at, tipo: 'hito', tono: 'success', titulo: 'Envió la autoinspección', detalle: '' });
      else if (e.tipo === 'ampliacion') rows.push({ at: e.at, tipo: 'hito', tono: 'neutral', titulo: 'Vigencia ampliada ' + e.dias + (e.dias === 1 ? ' día' : ' días'), detalle: 'Vence el ' + corta(e.a) + ' · ' + (e.por || '') + ' · Motivo: ' + e.motivo });
      else if (e.tipo === 'revocacion') rows.push({ at: e.at, tipo: 'hito', tono: 'danger', titulo: 'Revocado por ' + (e.por || 'el Coordinador'), detalle: 'Motivo: ' + e.motivo });
      else if (e.tipo === 'invalidacion') rows.push({ at: e.at, tipo: 'hito', tono: 'neutral', titulo: 'Invalidado', detalle: e.motivo || '' });
      else if (e.tipo === 'vencimiento') rows.push({ at: e.at, tipo: 'hito', tono: 'danger', titulo: 'Venció sin completar', detalle: e.t05 ? 'El caso pasó a «Enlace caducado» (T05) y se avisó al Coordinador' : 'Se avisó al Coordinador; el caso no cambia de estado' });
    });
    return rows.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
  }

  // ---------- Escenas: siembra de enlaces con su historia (los datos están en enlace.ciclo.escenas) ----------
  // Etapa 10b-c · enlace nuevo de una autoinspección a medias: copia el avance guardado del portal y lo deja en la línea de tiempo y en la cronología del caso.
  function continuar(nuevo, viejo) {
    if (!nuevo || !viejo || nuevo === viejo || !enlace(nuevo)) return null;
    var acc = eventos(viejo).filter(function (e) { return e.tipo === 'accion'; }), ult = acc[acc.length - 1], P = W.SiriusPortal, copiado = P && P.copiarAvance ? P.copiarAvance(viejo, nuevo) : false;
    var av = (ult && ult.avance) || (P && P.avanceDe && copiado ? P.avanceDe(nuevo) : ''); if (!av && !copiado) return null;
    agregar(nuevo, { tipo: 'continuacion', at: iso(now()), avance: av, de: viejo });
    if (ctx.cronologia) { var l = enlace(nuevo); try { ctx.cronologia(l.caso, 'El enlace nuevo continúa desde el avance guardado' + (av ? ' (' + av + ')' : '') + ': lo cargado en el enlace anterior se conserva', corta(iso(now())), 'Sistema'); } catch (e) {} }
    cambio(); return av || true;
  }
  function reset() { S.ev = {}; S.tareas = []; S.seq = 0; S.dialogo = null; }
  function sembrar(nombre, o) {
    o = o || {}; var sc = ((CI().escenas || {})[nombre]); if (!sc) return null; reset();
    var b = ((EJ().autoinspeccion || {}).enlaces || []).find(function (x) { return x.caso === sc.caso; }) || {};
    var lista = (sc.enlaces || []).map(function (x) { return Object.assign({ caso: sc.caso, riesgo: b.riesgo || '', visita: 'V1', contacto: b.contacto || {} }, x, { eventos: undefined }, x.revocado ? { anulado: true, estado: 'Revocado' } : {}); });
    W.SIRIUS_PORTAL_ENLACES = lista.concat((W.SIRIUS_PORTAL_ENLACES || []).filter(function (x) { return !lista.some(function (y) { return y.token === x.token; }); }));
    (sc.enlaces || []).forEach(function (x) { (x.eventos || []).forEach(function (e) { agregar(x.token, e); }); if (x.revocado) agregar(x.token, { tipo: 'revocacion', at: x.revocadoEn, motivo: x.revocadoMotivo, por: x.revocadoPor }); });
    (sc.tareas || []).forEach(function (t) { S.tareas.push({ id: 'TE' + (S.tareas.length + 1), tipo: t.tipo, caso: t.caso || sc.caso, at: t.at, por: t.por, asegurado: t.asegurado || '', token: t.token || '', titulo: CI().tareas[t.tipo].titulo, accion: CI().tareas[t.tipo].accion, detalle: CI().tareas[t.tipo].detalle, hecha: false }); });
    if (o.soloDatos) return sc;   // al armar el estado de la escena solo se dejan los enlaces; la historia, los recordatorios y el diálogo se aplican al montarla
    if (sc.guardarAvance && W.SiriusPortal && W.SiriusPortal.guardarPreset) (sc.enlaces || []).forEach(function (x) { W.SiriusPortal.guardarPreset(x.token, sc.guardarAvance); });   // etapa 10b-c: lo cargado hasta el vencimiento queda guardado en el portal
    S.dialogo = sc.dialogo ? Object.assign({ token: (sc.enlaces[0] || {}).token }, sc.dialogo) : null; procesar(); cambio(); return sc;
  }
  function dialogoInicial(token) { var d = S.dialogo; if (!d || (d.token && token && d.token !== token)) return null; S.dialogo = null; return d; }

  var E = { ctx: ctx, now: now, iso: iso, parse: parse, corta: corta, tokenDe: tokenDe, enlace: enlace, modificar: modificar, eventos: eventos, estado: estado, lineas: lineas, proximos: proximos,
    procesar: procesar, activoDe: activoDe, reenviar: reenviar, ampliar: ampliar, opcionesAmpliar: opcionesAmpliar, topeAmpliar: topeAmpliar, revocar: revocar, invalidar: invalidar, apertura: apertura, accion: accion, completado: completado,
    tarea: tarea, tareas: tareas, cerrarTareas: cerrarTareas, consentimiento: consentimiento, canalesDe: canalesDe, reset: reset, continuar: continuar, sembrar: sembrar, dialogoInicial: dialogoInicial, NOMBRE: NOMBRE,
    on: function (f) { oyentes.push(f); return function () { oyentes = oyentes.filter(function (x) { return x !== f; }); }; } };
  E.__v = 1; W.SiriusEnlace = E;

  // =====================================================================================================================
  // Tarjeta del enlace en Coordinación: estado, vencimiento, línea de tiempo compacta y acciones.
  // =====================================================================================================================
  var R = W.React; if (!R) return; var h = R.createElement;
  var NS = function () { return W.AseguradoraDelSurDesignSystem_4fbf29 || {}; };
  var T = { strong: 'var(--text-strong)', body: 'var(--text-body)', muted: 'var(--text-muted)' };
  var nw = { whiteSpace: 'nowrap' };
  var TONO_ENVIO = { Entregado: 'success', Enviado: 'brand', Fallido: 'danger', Omitido: 'neutral', Programado: 'neutral' };

  function Insignia(p) { var B = NS().Badge; var t = h('span', { style: nw }, p.children); return B ? h(B, { tone: p.tone || 'neutral' }, t) : h('span', { style: Object.assign({ padding: '2px 8px', borderRadius: 999, background: 'var(--surface-subtle)', fontSize: 12, fontWeight: 700 }, nw) }, p.children); }
  function Boton(p) { var B = NS().Button; if (B) return h(B, { variant: p.variant || 'secondary', size: 'sm', onClick: p.onClick, unavailableReason: p.motivo || undefined, 'aria-label': p.aria }, p.children);
    return h('button', { type: 'button', onClick: p.motivo ? undefined : p.onClick, 'aria-disabled': p.motivo ? 'true' : undefined, 'data-motivo': p.motivo || undefined, style: { height: 36, padding: '0 14px', borderRadius: 8, border: '1.5px solid var(--color-brand)', background: '#fff', fontWeight: 700 } }, p.children); }
  var campoTxt = { width: '100%', padding: '10px 12px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 15, lineHeight: 1.45, color: T.strong, resize: 'vertical', boxSizing: 'border-box' };
  function Motivo(p) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      h('label', { htmlFor: p.id, style: { fontSize: 13, fontWeight: 700, color: T.strong } }, 'Motivo ', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, '*')),
      h('textarea', { id: p.id, rows: 3, value: p.value, onChange: function (e) { p.onChange(e.target.value); }, 'aria-invalid': p.error ? 'true' : undefined, style: Object.assign({}, campoTxt, p.error ? { borderColor: 'var(--color-danger)' } : {}) }),
      p.error ? h('span', { role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, 'Escribe el motivo (al menos 10 caracteres).') : null);
  }

  function Tarjeta(props) {
    var v = props.visita || {}, token = tokenDe(v.enlace), us = R.useState(0), setTick = us[1], uv = R.useState(false), todo = uv[0], setTodo = uv[1];
    var ud = R.useState(null), dlg = ud[0], setDlg = ud[1], um = R.useState(''), motivo = um[0], setMotivo = um[1], ut = R.useState(false), tocado = ut[0], setTocado = ut[1];
    var ua = R.useState(0), dias = ua[0], setDias = ua[1], uc = R.useState([]), canales = uc[0], setCanales = uc[1];
    var refAbrir = R.useRef(null); refAbrir.current = abrir;
    R.useEffect(function () { return E.on(function () { setTick(function (x) { return x + 1; }); var d = E.dialogoInicial(token); if (d && d.tipo && refAbrir.current) refAbrir.current(d.tipo, d); }); }, [token]);
    R.useEffect(function () { var d = E.dialogoInicial(token); if (d && d.tipo) abrir(d.tipo, d); }, [token]);
    if (!token || !enlace(token)) return null;
    var l = enlace(token), st = estado(token), filas = lineas(token), prox = proximos(token), ro = !!props.ro, con = consentimiento(l.caso);
    var visibles = todo ? filas : filas.slice(-5), ocultas = filas.length - visibles.length;
    var porque = st.id === 'completado' ? 'El cliente ya envió la autoinspección.' : st.id === 'revocado' ? 'El enlace está revocado: genera uno nuevo.' : st.id === 'invalidado' ? 'El enlace quedó invalidado: genera uno nuevo.' : st.id === 'vencido' ? 'El enlace venció: genera uno nuevo.' : '';
    var ops = st.vigente ? opcionesAmpliar(token) : [], algunaOk = ops.some(function (o) { return o.ok; });
    var motAmp = !st.vigente ? (st.id === 'vencido' ? 'Un enlace vencido no se amplía: genera uno nuevo.' : porque) : !algunaOk ? 'Ya está en el máximo de ' + ((CI().ampliacion || {}).maximoDias || 20) + ' días desde el envío (' + corta(topeAmpliar(token)) + ').' : '';
    var disp = [['whatsapp', con.whatsapp ? '' : 'El contacto no aceptó avisos por WhatsApp.'], ['sms', con.sms ? '' : 'El contacto no aceptó avisos por SMS.'], ['correo', v.cMail ? '' : 'No hay un correo registrado del contacto.']];
    function abrir(tipo, d) {
      setMotivo((d && d.motivo) || ''); setTocado(false);
      if (tipo === 'ampliar') { var o = opcionesAmpliar(token).find(function (x) { return x.ok; }); setDias(o ? o.dias : 0); }
      if (tipo === 'canal') { var usados = eventos(token).filter(function (e) { return e.tipo === 'envio' && !e.omitido; }).map(function (e) { return e.canal; }); var libre = disp.filter(function (x) { return !x[1] && usados.indexOf(x[0]) < 0; })[0] || disp.filter(function (x) { return !x[1]; })[0]; setCanales(libre ? [libre[0]] : []); }
      setDlg(tipo);
    }
    var cerrar = function () { setDlg(null); };
    var corto = motivo.trim().length < 10;
    var acciones = ro ? null : h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
      h(Boton, { key: 'r', onClick: props.onReenviar, motivo: st.terminal ? porque : '', aria: 'Reenviar el enlace ' + v.id }, 'Reenviar'),
      h(Boton, { key: 'o', onClick: function () { abrir('canal'); }, motivo: st.terminal ? porque : '', aria: 'Reenviar el enlace ' + v.id + ' por otro canal' }, 'Reenviar por otro canal'),
      h(Boton, { key: 'a', onClick: function () { abrir('ampliar'); }, motivo: motAmp, aria: 'Ampliar la vigencia del enlace ' + v.id }, 'Ampliar vigencia'),
      h(Boton, { key: 'v', variant: 'ghost', onClick: function () { abrir('revocar'); }, motivo: st.terminal ? porque : '', aria: 'Revocar el enlace ' + v.id }, 'Revocar'),
      h(Boton, { key: 'n', variant: st.terminal && st.id !== 'completado' ? 'primary' : 'secondary', onClick: props.onNuevo, motivo: st.id === 'completado' ? porque : '', aria: 'Generar un enlace nuevo para ' + v.id }, 'Generar uno nuevo'));
    var M = W.SiriusModal;
    function pie(ok, etq, motivoNo) { var B = NS().Button; return h(R.Fragment, null, h(B, { variant: 'ghost', onClick: cerrar }, 'Volver'), h(B, { variant: 'primary', onClick: ok, unavailableReason: motivoNo || undefined }, etq)); }
    var modal = null;
    if (M && dlg === 'ampliar') modal = h(M, { open: true, onClose: cerrar, size: 'sm', align: 'left', title: 'Ampliar la vigencia del enlace ' + v.id, description: 'Vence el ' + corta(l.vence) + '. El máximo es ' + corta(topeAmpliar(token)) + ' (' + ((CI().ampliacion || {}).maximoDias || 20) + ' días desde el envío).',
      footer: pie(function () { if (corto || !dias) { setTocado(true); return; } cerrar(); props.onAccion && props.onAccion('ampliarEnlace', { id: v.id, token: token, dias: dias, motivo: motivo.trim() }); }, 'Ampliar vigencia') },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        h('fieldset', { style: { border: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, h('legend', { style: { fontSize: 13, fontWeight: 700, color: T.strong, padding: 0, marginBottom: 6 } }, 'Sumar'),
          ops.map(function (o) { return h('label', { key: o.dias, style: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', border: '1.5px solid ' + (dias === o.dias ? 'var(--cyan-500)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', background: !o.ok ? 'var(--surface-subtle)' : dias === o.dias ? 'var(--color-brand-wash)' : '#fff', cursor: o.ok ? 'pointer' : 'not-allowed', color: o.ok ? T.strong : T.muted } },
            h('input', { type: 'radio', name: 'enl-dias', checked: dias === o.dias, disabled: !o.ok, 'aria-disabled': !o.ok ? 'true' : undefined, onChange: function () { setDias(o.dias); }, style: { marginTop: 3 } }),
            h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 15 } }, h('b', null, '+' + o.dias + ' días'), h('span', { style: { fontSize: 13, color: T.muted } }, o.ok ? 'Nuevo vencimiento: ' + corta(o.nuevo) : o.motivo))); })),
        h(Motivo, { id: 'enl-motivo', value: motivo, onChange: setMotivo, error: tocado && corto })));
    if (M && dlg === 'revocar') modal = h(M, { open: true, onClose: cerrar, size: 'sm', align: 'left', title: 'Revocar el enlace ' + v.id, description: 'Quien lo abra verá «' + ((CI().portalRevocado || {}).titulo || 'Este enlace ya no es válido') + '». Para que el cliente pueda inspeccionar, después genera uno nuevo.',
      footer: pie(function () { if (corto) { setTocado(true); return; } cerrar(); props.onAccion && props.onAccion('revocarEnlace', { id: v.id, token: token, motivo: motivo.trim() }); }, 'Revocar enlace') }, h(Motivo, { id: 'enl-motivo', value: motivo, onChange: setMotivo, error: tocado && corto }));
    if (M && dlg === 'canal') modal = h(M, { open: true, onClose: cerrar, size: 'sm', align: 'left', title: 'Reenviar el enlace ' + v.id + ' por otro canal', description: 'Se envía el mismo enlace a ' + (v.cName || contactoDe(l)) + '. Solo se ofrecen los canales que el contacto aceptó.',
      footer: pie(function () { if (!canales.length) { setTocado(true); return; } cerrar(); props.onAccion && props.onAccion('reenviarCanal', { id: v.id, token: token, canales: canales }); }, 'Reenviar') },
      h('fieldset', { style: { border: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, h('legend', { style: { fontSize: 13, fontWeight: 700, color: T.strong, padding: 0, marginBottom: 6 } }, 'Canales'),
        disp.map(function (d) { var on = canales.indexOf(d[0]) >= 0, no = !!d[1]; return h('label', { key: d[0], style: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', border: '1.5px solid ' + (on ? 'var(--cyan-500)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', background: no ? 'var(--surface-subtle)' : on ? 'var(--color-brand-wash)' : '#fff', cursor: no ? 'not-allowed' : 'pointer', color: no ? T.muted : T.strong } },
          h('input', { type: 'checkbox', checked: on, disabled: no, 'aria-disabled': no ? 'true' : undefined, onChange: function () { setCanales(on ? canales.filter(function (x) { return x !== d[0]; }) : canales.concat([d[0]])); }, style: { marginTop: 3 } }),
          h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 15 } }, h('b', null, NOMBRE[d[0]]), no ? h('span', { style: { fontSize: 13, color: T.muted } }, d[1]) : null)); }),
        tocado && !canales.length ? h('span', { role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, 'Elige al menos un canal.') : null));

    return h('section', { 'aria-label': 'Enlace de autoinspección ' + v.id, 'data-enlace-estado': st.id, style: { display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', minWidth: 0 } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px' } },
        h('h3', { style: { margin: 0, fontSize: 14, fontWeight: 700, color: T.strong } }, 'Estado del enlace'), h(Insignia, { tone: st.tono }, st.nombre),
        st.avance ? h('span', { style: Object.assign({ fontSize: 13, color: T.body }, nw) }, st.avance) : null,
        h('span', { style: Object.assign({ marginLeft: 'auto', fontSize: 13, color: T.muted }, nw) }, (st.id === 'vencido' ? 'Venció el ' : 'Vence el ') + corta(l.vence))),
      h('p', { style: { margin: 0, fontSize: 13, color: T.muted } }, st.nota),
      st.id === 'vencido' && st.avance ? h('p', { 'data-enlace-conserva': '1', style: { margin: 0, fontSize: 13, color: T.body } }, 'La autoinspección quedó a medias (' + st.avance + '): lo cargado se conserva. Con «Generar uno nuevo» el cliente continúa desde ahí.') : null,
      prox.length ? h('p', { style: { margin: 0, fontSize: 13, color: T.body } }, 'Próximo recordatorio: ', h('b', null, prox[0].regla), ' · ', h('span', { style: nw }, corta(prox[0].at)), ' · ', prox[0].condicion) : null,
      ocultas > 0 ? h('div', null, h(Boton, { variant: 'ghost', onClick: function () { setTodo(true); }, aria: ocultas === 1 ? 'Ver el hecho anterior del enlace' : 'Ver los ' + ocultas + ' hechos anteriores del enlace' }, ocultas === 1 ? 'Ver 1 anterior' : 'Ver los ' + ocultas + ' anteriores')) : null,
      h('ol', { 'aria-label': 'Línea de tiempo del enlace', style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } },
        visibles.map(function (r, i) { return h('li', { key: r.at + i, style: { display: 'grid', gridTemplateColumns: 'max-content minmax(0,1fr)', gap: '2px 12px', alignItems: 'start' } },
          h('time', { dateTime: r.at, style: Object.assign({ fontSize: 13, color: T.muted, paddingTop: 1 }, nw) }, corta(r.at)),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 } },
            h('span', { style: { fontSize: 14, fontWeight: 700, color: T.strong } }, r.titulo, r.detalle && r.tipo === 'envio' ? h('span', { style: { fontWeight: 400, color: T.muted } }, ' · ' + r.detalle) : null),
            r.tipo === 'envio' ? h('span', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, r.canales.map(function (c) { return h(Insignia, { key: c.canal, tone: TONO_ENVIO[c.estado] || 'neutral' }, c.nombre + ' · ' + c.estado + (c.hora ? ' ' + c.hora : '')); })) : (r.detalle ? h('span', { style: { fontSize: 13, color: T.body } }, r.detalle) : null),
            r.tipo === 'envio' && r.canales.some(function (c) { return c.nota; }) ? h('span', { style: { fontSize: 12, color: T.muted } }, r.canales.filter(function (c) { return c.nota; }).map(function (c) { return c.nombre + ': ' + c.nota; }).join(' · ')) : null)); })),
      acciones, modal);
  }
  W.SiriusEnlaceTarjeta = Tarjeta;
})();
