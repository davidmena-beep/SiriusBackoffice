// SIRIUS · Inicio por rol (etapa 9 · DEC-131). Calcula el modelo del inicio del rol activo a partir de SIRIUS_INICIO (qué se
// muestra y en qué orden) y de los datos vigentes que entrega el Back-office en ctx (casos con SLA, visitas, garantías,
// conflictos, usuarios, historiales, integraciones). Nada se escribe a mano: cada número y cada fila salen de ctx.
// El componente Inicio.dc.html solo dibuja el modelo; cada clic devuelve un destino «ir» que interpreta el Back-office.
(function () {
  var I = {};
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var parse = function (s) { if (!s) return null; if (s instanceof Date) return s; var m = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d))?/.exec(s); if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    m = /(\d\d)\/(\d\d)\/(\d\d)(?: · (\d\d):(\d\d))?/.exec(s); if (m) return new Date(2000 + +m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)); return null; };
  var corta = function (d) { d = parse(d); return d ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) : ''; };
  var conHora = function (d) { d = parse(d); return d ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(2) + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : ''; };
  var diaLargo = function (d) { d = parse(d); return d ? DIAS[d.getDay()] + ' ' + d.getDate() + '/' + pad(d.getMonth() + 1) : ''; };
  I.parse = parse; I.iso = iso;
  I.fechaSaludo = function (d) { var s = DIAS[d.getDay()]; return s.charAt(0).toUpperCase() + s.slice(1) + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear() + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  var dias = function (a, b) { return Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000); };
  var plural = function (n, s, p) { return n + ' ' + (n === 1 ? s : p); };
  var COORD = ['Registrado', 'En coordinación', 'Reaperturado', 'Enlace caducado'];
  var abierta = function (v) { return v.estado !== 'Cancelada' && v.estado !== 'Realizada'; };

  // ---------- Filas de «Para hoy» y su urgencia ----------
  // rango 0 = SLA vencido (o vencido), 1 = por vencer, 2 = el resto por fecha. Dentro del rango: horas de SLA o fecha.
  function filaCaso(c, motivo, accion, ir, ctx) {
    var s = c.slaInfo, r = s ? (s.tono === 'danger' ? 0 : s.tono === 'warning' ? 1 : 2) : 2;
    // Dentro de cada rango se ordena por fecha: la del vencimiento del SLA o, sin SLA, la fecha del caso.
    var t = ((s && s.vence) || parse(c.fecha) || ctx.ahora).getTime() / 3.6e6;
    return { id: 'c-' + c.id + '-' + accion, caso: c.id, asegurado: c.asegurado || '—', motivo: motivo, urg: s ? { label: s.etiqueta, tono: s.tono, title: s.titulo } : null, accion: { label: accion, ir: ir }, rango: r, orden: t };
  }
  function filaOtra(ref, quien, motivo, urg, accion, ir, rango, fecha) { var d = parse(fecha); return { id: 'o-' + ref + '-' + accion + '-' + quien, caso: ref, asegurado: quien, motivo: motivo, urg: urg, accion: { label: accion, ir: ir }, rango: rango, orden: d ? d.getTime() / 3.6e6 : 0 }; }
  function ordenar(filas) { var vistos = {}; return filas.sort(function (a, b) { return a.rango - b.rango || a.orden - b.orden; }).filter(function (f) { var k = f.caso + '|' + f.asegurado; if (vistos[k]) return false; vistos[k] = 1; return true; }); }
  var irCaso = function (id, tab) { return { k: 'caso', id: id, tab: tab || 0 }; };
  var irIds = function (titulo, ids) { return { k: 'bandeja', titulo: titulo, ids: ids }; };
  var irGar = function (titulo, ids, tab, caso) { return { k: 'garantias', titulo: titulo, ids: ids, tab: tab, caso: caso || null }; };

  // ---------- Bloques reutilizables ----------
  function porEstado(ctx, casos, titulo) {
    var orden = ctx.ordenEstados, cuenta = {}; casos.forEach(function (c) { cuenta[c.estado] = (cuenta[c.estado] || 0) + 1; });
    var tramos = orden.filter(function (e) { return cuenta[e]; }).map(function (e) { return { estado: e, label: ctx.etiqueta(e), n: cuenta[e], tono: ctx.tono(e), ir: irIds('Estado: ' + ctx.etiqueta(e), casos.filter(function (c) { return c.estado === e; }).map(function (c) { return c.id; })) }; });
    return { tipo: 'barras', titulo: titulo, total: casos.length, tramos: tramos, vacio: 'No hay casos activos.' };
  }
  function siguiente(items, ctx) { var f = items.filter(function (x) { return x.fecha && x.fecha > ctx.ahora; }).sort(function (a, b) { return a.fecha - b.fecha; })[0]; return f ? { texto: f.texto, fecha: diaLargo(f.fecha) + ' · ' + pad(f.fecha.getHours()) + ':' + pad(f.fecha.getMinutes()) } : null; }
  var venceSla = function (c, texto) { return c.slaInfo && c.slaInfo.vence ? { fecha: c.slaInfo.vence, texto: texto || ('SLA del caso ' + c.id + ' (' + ctx_lbl(c) + ')') } : null; };
  var ctx_lbl = function (c) { return I._ctx ? I._ctx.etiqueta(c.estado) : c.estado; };
  var visFecha = function (v) { return parse(v.fecha + 'T' + (v.hIni || '00:00')); };

  // ---------- Cálculos por rol (claves = títulos de SIRIUS_INICIO) ----------
  var R = {};
  R['Administrador'] = function (ctx) {
    var ab = ctx.conflictos, bl = ab.filter(function (e) { return e.severidad === 'bloqueante'; });
    var inv = ctx.usuarios.filter(function (u) { return u.estadoEf === 'Invitado' || u.estadoEf === 'Invitación vencida'; }), venc = inv.filter(function (u) { return u.estadoEf === 'Invitación vencida'; });
    var act = ctx.casos.filter(ctx.activo), slaV = act.filter(function (c) { return c.sla != null && c.sla < 0; }), fal = ctx.integraciones.filter(function (x) { return x.falla; });
    var ind = {
      'Conflictos abiertos': { n: ab.length, tono: bl.length ? 'danger' : ab.length ? 'warning' : null, sub: ab.length ? (bl.length ? plural(bl.length, 'bloqueante', 'bloqueantes') + ' y ' + plural(ab.length - bl.length, 'advertencia', 'advertencias') : 'Solo advertencias') : 'Nada que resolver', ir: { k: 'conflictos' } },
      'Invitaciones pendientes': { n: inv.length, tono: venc.length ? 'warning' : null, sub: inv.length ? plural(inv.length - venc.length, 'vigente', 'vigentes') + ' y ' + plural(venc.length, 'vencida', 'vencidas') : 'Sin invitaciones abiertas', ir: { k: 'usuarios', fEst: 'pendiente' } },
      'Casos con SLA vencido': { n: slaV.length, tono: slaV.length ? 'danger' : null, sub: slaV.length ? 'De todos los responsables' : 'Todo en tiempo', ir: irIds('Casos con SLA vencido', slaV.map(function (c) { return c.id; })) },
      'Integraciones con falla': { n: fal.length, tono: fal.length ? 'warning' : null, sub: fal.length ? fal.map(function (x) { return x.codigo; }).join(', ') : plural(ctx.integraciones.length, 'conexión sin fallas', 'conexiones sin fallas') + (ctx.simulacion ? ' (simulación activa)' : ''), ir: { k: 'motores' } },
    };
    var filas = [];
    bl.forEach(function (e) { filas.push(filaOtra(e.id, e.objNombre, e.nombre + ': ' + e.detalle, { label: 'Bloqueante', tono: 'danger' }, 'Resolver', { k: 'conflictos' }, 0, e.abierto && e.abierto.fecha)); });
    venc.forEach(function (u) { filas.push(filaOtra('Invitación', u.nombre, 'La invitación venció el ' + conHora(u.vence) + '; ' + (u.correo || ''), { label: 'Vencida', tono: 'danger' }, 'Reenviar', { k: 'usuarios', panel: 'reenviar', usuario: u.nombre }, 0, u.vence)); });
    slaV.filter(function (c) { var r = c.responsable, u = r && r !== '—' ? ctx.usuario(r) : null; return !r || r === '—' || (u && u.estadoEf !== 'Activo'); }).forEach(function (c) { var r = c.responsable, u = r && r !== '—' ? ctx.usuario(r) : null; filas.push(filaCaso(c, u ? 'Responsable ' + u.estadoEf.toLowerCase() + ': ' + r : 'Sin responsable', 'Reasignar', { k: 'mod', mod: 'administracion', child: 'flujo' }, ctx)); });
    var sig = siguiente(act.map(function (c) { return venceSla(c); }).filter(Boolean).concat(inv.map(function (u) { return { fecha: parse(u.vence), texto: 'Vence la invitación de ' + u.nombre }; })), ctx);
    var hist = ctx.historial.slice(0, 5);
    return { ind: ind, filas: filas, sig: sig, bloques: {
      'Casos por estado': porEstado(ctx, act, 'Casos por estado'),
      'Últimos cambios de configuración': { tipo: 'lista', titulo: 'Últimos cambios de configuración', items: hist.map(function (h) { return { a: h.que, b: h.donde ? h.donde : '', c: conHora(h.fecha) + ' · ' + h.por + (h.motivo ? ' · Motivo: ' + h.motivo : '') }; }), vacio: 'Sin cambios registrados.' },
    } };
  };
  R['Ejecutivo comercial'] = function (ctx) {
    var me = ctx.yo, mios = ctx.casos.filter(function (c) { return ctx.activo(c) && c.comercial === me; });
    var orden = ctx.casos.filter(function (c) { return c.comercial === me && c.estado === 'Inspeccionado' && !c.orden && !c.parentId; });
    var gs = ctx.garantias.filter(function (g) { return g.comercial === me; }), porV = gs.filter(function (g) { return g.estado === 'Pendiente' && !g.cerrado && g.diff >= 0 && g.diff <= ctx.umbralGarantias; }), venc = gs.filter(function (g) { return g.estado === 'Vencido' && !g.cerrado; });
    var ind = {
      'Mis casos activos': { n: mios.length, tono: null, sub: plural(mios.filter(function (c) { return c.sla != null && c.sla < 0; }).length, 'con SLA vencido', 'con SLA vencido'), ir: irIds('Mis casos activos', mios.map(function (c) { return c.id; })) },
      'Por crear orden de emisión': { n: orden.length, tono: orden.length ? 'warning' : null, sub: 'Inspeccionados sin orden', ir: irIds('Por crear orden de emisión', orden.map(function (c) { return c.id; })) },
      'Garantías por vencer': { n: porV.length, tono: porV.length ? 'warning' : null, sub: 'En ' + ctx.umbralGarantias + ' días o menos', ir: irGar('Garantías por vencer', porV.map(function (g) { return g.caso; }), 0) },
      'Garantías vencidas': { n: venc.length, tono: venc.length ? 'danger' : null, sub: venc.length ? plural(venc.filter(function (g) { return g.solicitudPend; }).length, 'con solicitud en trámite', 'con solicitud en trámite') : 'Ninguna vencida', ir: irGar('Garantías vencidas', venc.map(function (g) { return g.caso; }), 1) },
    };
    var filas = [];
    orden.forEach(function (c) { filas.push(filaCaso(c, 'Inspeccionado sin orden de emisión', 'Crear orden', irCaso(c.id, 0), ctx)); });
    venc.filter(function (g) { return !g.solicitudPend; }).forEach(function (g) { filas.push(filaOtra(g.caso, g.asegurado, 'Garantías vencidas el ' + corta(g.limIso) + ': solicita ampliación de plazo o cierre', { label: 'Vencidas hace ' + plural(-g.diff, 'día', 'días'), tono: 'danger' }, 'Solicitar ampliación o cierre', irGar('', null, 1, g.caso), 0, g.limIso)); });
    gs.forEach(function (g) { (g.endosos || []).filter(function (e) { return /rechaz/i.test(e.estado); }).forEach(function (e) { filas.push(filaOtra(g.caso, g.asegurado, 'Endoso de ' + e.tipo + ' rechazado por el BPM', { label: 'Rechazado', tono: 'danger' }, 'Reenviar', irGar('', null, 4, g.caso), 0, e.respuesta || e.fecha)); }); });
    var ult = ctx.usuarioYo && ctx.usuarioYo.ultimoAcceso ? parse(ctx.usuarioYo.ultimoAcceso) : null;
    gs.forEach(function (g) { (g.solicitudes || []).filter(function (s) { return /Aprobada|Rechazada/.test(s.estado) && s.respuesta && (!ult || parse(s.respuesta) > ult); }).forEach(function (s) { filas.push(filaOtra(g.caso, g.asegurado, 'Ampliación ' + s.estado.toLowerCase() + ' el ' + conHora(s.respuesta), null, 'Ver respuesta', irGar('', null, 4, g.caso), 2, s.respuesta)); }); });
    var sig = siguiente(mios.map(function (c) { return venceSla(c); }).filter(Boolean).concat(gs.filter(function (g) { return g.estado === 'Pendiente'; }).map(function (g) { return { fecha: parse(g.limIso + 'T23:59'), texto: 'Fecha límite de garantías del caso ' + g.caso }; })), ctx);
    return { ind: ind, filas: filas, sig: sig, bloques: { 'Mis casos por estado': porEstado(ctx, mios, 'Mis casos por estado') } };
  };
  R['Coordinador de inspecciones'] = function (ctx) {
    var suc = ctx.alcanceSuc, enSuc = function (c) { return !suc || suc.indexOf(c.sucursal) >= 0; };
    var coord = ctx.casos.filter(function (c) { return ctx.activo(c) && COORD.indexOf(c.estado) >= 0 && enSuc(c); });
    var hoy = ctx.hoyIso, sig = ctx.sigHabil(hoy), vis = ctx.visitas.filter(abierta);
    var hm = vis.filter(function (v) { return v.fecha === hoy || v.fecha === sig; });
    var lim = new Date(ctx.ahora.getTime() + 24 * 3600000), enl = ctx.visitas.filter(function (v) { var d = parse(v.venceIso); return v.enlace && abierta(v) && d && d > ctx.ahora && d <= lim; });
    var sinIns = vis.filter(function (v) { return v.fecha && !v.inspector && ['Autoinspección', 'Documental', 'No requiere inspección'].indexOf(v.mod) < 0; });
    var tonoC = coord.some(function (c) { return c.sla != null && c.sla < 0; }) ? 'danger' : coord.some(function (c) { return c.slaInfo && c.slaInfo.tono === 'warning'; }) ? 'warning' : null;
    var ids = function (L) { return L.map(function (v) { return v.caso; }).filter(function (x, i, a) { return a.indexOf(x) === i; }); };
    var ind = {
      'Por coordinar': { n: coord.length, tono: tonoC, sub: plural(coord.filter(function (c) { return c.sla != null && c.sla < 0; }).length, 'con SLA vencido', 'con SLA vencido'), ir: irIds('Por coordinar', coord.map(function (c) { return c.id; })) },
      'Visitas de hoy y mañana': { n: hm.length, tono: null, sub: 'Hoy ' + corta(hoy) + ' y ' + diaLargo(sig), ir: irIds('Visitas de hoy y mañana', ids(hm)) },
      'Enlaces por caducar': { n: enl.length, tono: enl.length ? 'warning' : null, sub: 'Vencen en 24 h o menos', ir: irIds('Enlaces por caducar', ids(enl)) },
      'Sin inspector asignado': { n: sinIns.length, tono: sinIns.length ? 'danger' : null, sub: 'Visitas agendadas', ir: irIds('Visitas sin inspector', ids(sinIns)) },
    };
    var filas = [];
    coord.forEach(function (c) { var cad = c.estado === 'Enlace caducado'; filas.push(filaCaso(c, cad ? 'Enlace caducado: reenvía o cambia la modalidad' : c.estado === 'En coordinación' ? 'En coordinación: agenda la visita' : ctx.etiqueta(c.estado) + ': registra el contacto con el cliente', cad ? 'Reenviar enlace' : c.estado === 'En coordinación' ? 'Agendar' : 'Registrar contacto', irCaso(c.id, 1), ctx)); });
    // Etapa 13 · lo que el cliente pidió desde el portal («Pedir un enlace nuevo», «No soy yo»): una fila por caso con el detalle; reemplaza la fila genérica del mismo caso y conserva su SLA.
    (ctx.tareasEnlace || []).forEach(function (t) { var c = ctx.caso(t.caso); if (!c) return; filas = filas.filter(function (f) { return f.caso !== t.caso; });
      var f = filaCaso(c, t.titulo + ' · ' + t.detalle + ' (' + (t.por || 'el cliente') + ', ' + conHora(t.at) + ')', t.accion, irCaso(c.id, 1), ctx); f.id = 'te-' + t.id; f.rango = Math.min(f.rango, 1); filas.push(f); });
    // Etapa 15-1 · DEC-173: cambios de alcance que un inspector pide desde su app (amplían zonas o modalidades): el Coordinador los aprueba en la Agenda.
    (ctx.tareasPerfil || []).forEach(function (t) { filas.push(filaOtra('Alcance', t.inspector, 'Pidió desde la app del inspector ampliar ' + (t.campo === 'zonas' ? 'sus zonas' : 'sus modalidades') + ': ' + t.agrega.join(', '), { label: 'Por aprobar', tono: 'warning' }, 'Revisar el pedido', { k: 'agenda', pedidos: true }, 1, t.at)); });
    // Etapa C2-3 · DEC-180: un informe por completar con el plazo de 24 h hábiles vencido pasa como tarea al Coordinador de la sucursal.
    ctx.casos.filter(function (c) { return ctx.activo(c) && c.estado === 'Informe por completar' && c.sla != null && c.sla < 0 && enSuc(c); }).forEach(function (c) { var SCx = window.SiriusCompletar, q = SCx ? SCx.quienCompleta(c) : null; filas.push(filaCaso(c, 'Informe por completar con el plazo vencido: lo completa ' + (q ? q.texto : 'el responsable') + '. Da seguimiento', 'Ver el informe', irCaso(c.id, 2), ctx)); });
    // Etapa 11: confirmación de SIRIUS_AGENDA.confirmacion (sin confirmar = cualquier estado distinto de «Confirmada»).
    vis.filter(function (v) { return v.fecha === sig && v.confirmacion && v.confirmacion !== 'Confirmada'; }).forEach(function (v) { var c = ctx.caso(v.caso); if (c) filas.push(filaCaso(c, 'Visita de mañana (' + diaLargo(v.fecha) + ' · ' + (v.hIni || '') + ') sin confirmar con el cliente: «' + v.confirmacion + '»', 'Confirmar', irCaso(c.id, 1), ctx)); });
    var prox = vis.filter(function (v) { return v.fecha && v.fecha >= hoy; }).sort(function (a, b) { return (a.fecha + a.hIni) < (b.fecha + b.hIni) ? -1 : 1; });
    var h5 = ctx.habiles(hoy, 5), carga = ctx.inspectores.map(function (n) { var L = vis.filter(function (v) { return v.inspector === n.n && h5.indexOf(v.fecha) >= 0; }); return { label: n.n, sub: n.tipo + (n.ag ? ' · ' + n.ag : ''), n: L.length, ir: { k: 'agenda', vista: 'Semana', fecha: h5[0], inspector: n.n } }; });
    var sg = siguiente(coord.map(function (c) { return venceSla(c); }).filter(Boolean).concat(prox.map(function (v) { return { fecha: visFecha(v), texto: 'Visita del caso ' + v.caso + (v.inspector ? ' con ' + v.inspector : '') }; })), ctx);
    return { ind: ind, filas: filas, sig: sg, bloques: {
      'Carga por inspector': { tipo: 'carga', titulo: 'Carga por inspector', nota: 'Visitas de los próximos 5 días hábiles (' + corta(h5[0]) + ' al ' + corta(h5[h5.length - 1]) + ')', items: carga },
      'Próximas visitas': { tipo: 'visitas', titulo: 'Próximas visitas', items: prox.slice(0, 5).map(function (v) { return { fecha: diaLargo(v.fecha), franja: v.hIni ? v.hIni + (v.hFin ? '–' + v.hFin : '') : 'Sin hora', caso: v.caso, inspector: v.inspector || 'Sin inspector', mod: v.mod || '', ir: irCaso(v.caso, 1) }; }), vacio: 'No hay visitas agendadas desde hoy.' },
    } };
  };
  R['Inspector'] = function (ctx) {
    var me = ctx.yo, hoy = ctx.hoyIso, man = ctx.manana, mis = ctx.visitas.filter(function (v) { return v.inspector === me && v.estado !== 'Cancelada'; });
    var asig = ctx.casos.filter(function (c) { return ctx.activo(c) && ctx.asignado(c, me); });
    var hoyV = mis.filter(function (v) { return v.fecha === hoy; }), inf = asig.filter(function (c) { return c.estado === 'En curso' || ctx.borrador(c); }), dev = asig.filter(function (c) { return c.estado === 'Devuelto al inspector'; });
    var h5 = ctx.habiles(ctx.sigHabil(hoy), 5), prox = mis.filter(function (v) { return abierta(v) && h5.indexOf(v.fecha) >= 0; });
    var ids = function (L) { return L.map(function (v) { return v.caso; }).filter(function (x, i, a) { return a.indexOf(x) === i; }); };
    var ind = {
      'Mis visitas de hoy': { n: hoyV.length, tono: null, sub: diaLargo(hoy), ir: { k: 'agenda', vista: 'Día', fecha: hoy } },
      'Informes por terminar': { n: inf.length, tono: inf.length ? 'warning' : null, sub: 'En borrador o en curso', ir: irIds('Informes por terminar', inf.map(function (c) { return c.id; })) },
      'Devueltos para corregir': { n: dev.length, tono: dev.length ? 'danger' : null, sub: dev.length ? 'Corrige y reenvía' : 'Ninguno devuelto', ir: irIds('Devueltos para corregir', dev.map(function (c) { return c.id; })) },
      'Próximas visitas': { n: prox.length, tono: null, sub: 'Próximos 5 días hábiles', ir: { k: 'agenda', vista: 'Semana', fecha: h5[0] } },
    };
    var filas = [];
    dev.forEach(function (c) { filas.push(filaCaso(c, 'Devuelto para corregir' + (c.obsDevolucion ? ': ' + c.obsDevolucion : ''), 'Corregir', irCaso(c.id, 2), ctx)); });
    inf.forEach(function (c) { filas.push(filaCaso(c, c.estado === 'En curso' ? 'Informe en curso' : 'Informe en borrador', 'Continuar', irCaso(c.id, 2), ctx)); });
    // Etapa 11b: la observación de una revisión de control llega aquí como retroalimentación (también queda en su ficha de usuario).
    (ctx.retro ? ctx.retro(me) : []).forEach(function (rv) { filas.push(filaOtra(rv.caso, rv.asegurado || rv.etiqueta, 'Retroalimentación de la revisión de control de ' + rv.etiqueta + ' (' + rv.por + ', ' + rv.fecha + '): ' + rv.motivo, { label: 'Con observación', tono: 'warning' }, 'Ver el caso', irCaso(rv.caso, 6), 1, rv.fecha)); });
    honTareas(ctx, me, ctx.proveedor).forEach(function (f) { filas.push(f); });
    mis.filter(function (v) { return abierta(v) && (v.fecha === hoy || v.fecha === man); }).forEach(function (v) { var c = ctx.caso(v.caso); if (c) filas.push(filaCaso(c, 'Visita ' + (v.fecha === hoy ? 'hoy' : 'mañana') + (v.hIni ? ' a las ' + v.hIni : '') + (v.dir ? ' · ' + v.dir : ''), 'Ver visita', irCaso(c.id, 0), ctx)); });
    var semana = ctx.habiles(hoy, 5); if (semana[0] !== hoy) semana = [hoy].concat(semana.slice(0, 4));
    var sg = siguiente(asig.map(function (c) { return venceSla(c); }).filter(Boolean).concat(mis.filter(abierta).map(function (v) { return { fecha: visFecha(v), texto: 'Visita del caso ' + v.caso + (v.dir ? ' en ' + v.dir : '') }; })), ctx);
    return { ind: ind, filas: filas, sig: sg, bloques: {
      'Mi agenda de la semana': { tipo: 'semana', titulo: 'Mi agenda de la semana', dias: semana.map(function (d) { return { dia: diaLargo(d), hoy: d === hoy, items: mis.filter(function (v) { return v.fecha === d; }).sort(function (a, b) { return (a.hIni || '') < (b.hIni || '') ? -1 : 1; }).map(function (v) { return { franja: v.hIni ? v.hIni + (v.hFin ? '–' + v.hFin : '') : 'Sin hora', caso: v.caso, dir: v.dir || '—', mod: v.mod || '', estado: v.estado, ir: irCaso(v.caso, 0) }; }) }; }), vacio: 'Sin visitas' },
    } };
  };
  R['Ejecutivo de inspecciones'] = function (ctx) {
    var me = ctx.yo, mios = ctx.casos.filter(function (c) { return c.ejecutivo === me; });
    // Etapa 11b: «Por calificar» y «Revisión de control» salen de la cola de la página Calificación (SiriusCalificacion.cola): una fila por
    // vehículo (o por caso de Ramos Generales) y los mismos números que esa página con «Mis riesgos».
    var SCl = window.SiriusCalificacion, Q = SCl ? SCl.mias(ctx.cola()) : { porCalificar: [], control: [] };
    var puedeN1 = !window.SiriusUsuarios || window.SiriusUsuarios.permiso(ctx.rolNombre, 'Calificar nivel 1') !== '';
    var cal = Q.porCalificar, ctlP = Q.control.filter(function (x) { return x.estadoCtl === 'Pendiente'; }), ctl = ctlP;
    var gs = ctx.garantias.filter(function (g) { return g.ejecutivo === me; }), resp = gs.filter(function (g) { return g.porRevisar > 0 && !g.cerrado; }), nResp = resp.reduce(function (n, g) { return n + g.porRevisar; }, 0);
    var amp = ctx.garantias.filter(function (g) { return g.calificador === me && g.solicitudPend; });
    var tonoC = cal.some(function (x) { return x.sla && x.sla.tono === 'danger'; }) ? 'danger' : cal.some(function (x) { return x.sla && x.sla.tono === 'warning'; }) ? 'warning' : null;
    var ind = {
      'Por calificar': { n: cal.length, tono: tonoC, sub: plural(cal.filter(function (x) { return x.sla && x.sla.tono === 'danger'; }).length, 'con SLA vencido', 'con SLA vencido'), ir: { k: 'cola', tab: 'Por calificar', scope: 'mis' } },
      'Revisión de control': { n: ctl.length, tono: ctl.length ? 'warning' : null, sub: 'Determinados por el inspector', ir: { k: 'cola', tab: 'Revisión de control', scope: 'mis' } },
      'Respaldos por validar': { n: nResp, tono: nResp ? 'warning' : null, sub: 'En ' + plural(resp.length, 'caso', 'casos'), ir: irGar('Respaldos por validar', resp.map(function (g) { return g.caso; }), 2) },
      'Ampliaciones por aprobar': { n: amp.length, tono: amp.length ? 'warning' : null, sub: 'Eres el calificador final', ir: irGar('Ampliaciones por aprobar', amp.map(function (g) { return g.caso; }), 4) },
    };
    // Etapa 12d-3b · bajo «Por calificar»: casos con la autoinspección cerrada y alertas altas sin revisar; lleva a la bandeja de controles (un caso) o a la Bandeja filtrada.
    var aiA = typeof ctx.aiAltas === 'function' ? ctx.aiAltas() : [];
    if (aiA.length) ind['Por calificar'].extra = { texto: plural(aiA.length, 'con alertas altas sin revisar', 'con alertas altas sin revisar'), ir: aiA.length === 1 ? { k: 'caso', id: aiA[0].caso, tab: 4 } : { k: 'bandeja', titulo: 'Autoinspecciones con alertas altas sin revisar', ids: aiA.map(function (x) { return x.caso; }) } };
    var filas = [];
    cal.forEach(function (x) { var c = ctx.caso(x.caso); if (c) filas.push(filaCaso(c, 'Pendiente de calificación' + (x.tipo === 'Vehículos' ? ' · ' + x.etiqueta : ''), puedeN1 ? 'Calificar' : 'Ver caso', { k: 'calificar', caso: x.caso, riesgo: x.riesgo, tipo: x.tipo }, ctx)); });
    ctl.forEach(function (x) { var c = ctx.caso(x.caso); if (c) filas.push(filaCaso(c, 'Revisión de control de ' + x.etiqueta + (x.inspector && x.inspector !== '—' ? ' (determinado por ' + x.inspector + ')' : ''), 'Revisar', { k: 'calificar', caso: x.caso, riesgo: x.riesgo, tipo: x.tipo }, ctx)); });
    resp.forEach(function (g) { filas.push(filaOtra(g.caso, g.asegurado, plural(g.porRevisar, 'respaldo cargado sin revisar', 'respaldos cargados sin revisar') + (g.antiguo ? ' desde el ' + conHora(g.antiguo) : ''), null, 'Validar', irGar('', null, 2, g.caso), 2, g.antiguo)); });
    amp.forEach(function (g) { filas.push(filaOtra(g.caso, g.asegurado, 'Ampliación de plazo solicitada por ' + g.solicitudPend.por + ' (' + g.solicitudPend.dias + ' días)', { label: 'Por aprobar', tono: 'warning' }, 'Aprobar o rechazar', irGar('', null, 4, g.caso), 2, g.solicitudPend.fecha)); });
    (ctx.honorarios || []).filter(function (h) { return h.estado === 'Por aprobar' && h.despues && h.despues.por === me; }).forEach(function (h) { var u = ctx.usd || function (n) { return window.SIRIUS_COMPANIA.formatoMonto(n); }; filas.push(filaOtra(h.caso, h.inspector, 'Honorario por aprobar (lo dejaste para después): ' + u(h.valor) + (h.revisar ? ' · Revisar' : ''), { label: 'Por aprobar', tono: 'warning' }, 'Aprobar honorario', { k: 'liq', tab: 'Honorarios', hon: h.id }, 1, h.despues.fecha)); });
    var dev = mios.filter(function (c) { return c.estado === 'Devuelto al inspector'; });
    var sg = siguiente(cal.map(function (x) { var c = ctx.caso(x.caso); return c ? venceSla(c) : null; }).filter(Boolean), ctx);
    return { ind: ind, filas: filas, sig: sg, bloques: {
      'Devueltos esperando corrección': { tipo: 'lista', titulo: 'Devueltos esperando corrección', items: dev.map(function (c) { var d = parse(ctx.ingreso(c.id)), n = d ? dias(d, ctx.ahora) : null; return { a: 'Caso ' + c.id + ' · ' + (c.asegurado || ''), b: 'Inspector: ' + (c.responsable || '—'), c: n == null ? 'Sin fecha de devolución' : 'Devuelto hace ' + plural(n, 'día', 'días') + ' (' + corta(d) + ')', ir: irCaso(c.id, 2) }; }), vacio: 'No hay casos devueltos esperando corrección.' },
    } };
  };
  R['Suscriptor'] = function (ctx) {
    var me = ctx.yo, gr = ctx.alcanceGrupos, enGr = function (c) { return !gr || gr.indexOf(ctx.grupo(c)) >= 0; };
    // Etapa 11b: «En suscripción» sale de la cola de la página Calificación (con «Mis riesgos»).
    var SCl = window.SiriusCalificacion, sus = (SCl ? SCl.mias(ctx.cola()).suscripcion : []).map(function (x) { return ctx.caso(x.caso); }).filter(Boolean);
    var amp = ctx.garantias.filter(function (g) { return g.calificador === me && g.solicitudPend; });
    var mes = function (d) { d = parse(d); return d && d.getMonth() === ctx.ahora.getMonth() && d.getFullYear() === ctx.ahora.getFullYear(); };
    var exc = ctx.riesgos.filter(function (r) { return r.emi && r.emi.res === 'Emitido por excepción' && mes(r.fecha); });
    var mios = ctx.dictamenes.filter(function (d) { return d.por === me && mes(d.fecha); });
    var tonoS = sus.some(function (c) { return c.sla != null && c.sla < 0; }) ? 'danger' : sus.some(function (c) { return c.slaInfo && c.slaInfo.tono === 'warning'; }) ? 'warning' : null;
    var ind = {
      'En suscripción': { n: sus.length, tono: tonoS, sub: gr ? 'Grupo ' + gr.join(' y ') : 'Todos los grupos', ir: { k: 'cola', tab: 'En suscripción', scope: 'mis' } },
      'Ampliaciones por aprobar': { n: amp.length, tono: amp.length ? 'warning' : null, sub: 'Eres el calificador final', ir: irGar('Ampliaciones por aprobar', amp.map(function (g) { return g.caso; }), 4) },
      'Emitidos por excepción (mes)': { n: exc.length, tono: null, sub: MESES[ctx.ahora.getMonth()] + ' de ' + ctx.ahora.getFullYear(), ir: irIds('Emitidos por excepción en el mes', exc.map(function (r) { return r.caso; }).filter(function (x, i, a) { return a.indexOf(x) === i; })) },
      'Calificados por mí (mes)': { n: mios.length, tono: null, sub: MESES[ctx.ahora.getMonth()] + ' de ' + ctx.ahora.getFullYear(), ir: irIds('Calificados por mí en el mes', mios.map(function (d) { return d.caso; }).filter(function (x, i, a) { return a.indexOf(x) === i; })) },
    };
    var filas = [];
    sus.forEach(function (c) { filas.push(filaCaso(c, 'Pendiente de dictamen de suscripción (' + c.ramo + ')', 'Dictaminar', irCaso(c.id, 4), ctx)); });
    amp.forEach(function (g) { filas.push(filaOtra(g.caso, g.asegurado, 'Ampliación de plazo solicitada por ' + g.solicitudPend.por + ': ' + g.solicitudPend.dias + ' días, hasta el ' + corta(g.solicitudPend.nuevaFecha), { label: 'Por aprobar', tono: 'warning' }, 'Aprobar o rechazar', irGar('', null, 4, g.caso), 2, g.solicitudPend.fecha)); });
    var res = {}; ctx.calificados.filter(function (x) { return enGr(x.c) && mes(x.fecha); }).forEach(function (x) { var k = x.c.ramo, o = res[k] || (res[k] = { a: 0, n: 0 }); if (x.aseg === 'Asegurable') o.a++; else o.n++; });
    var sg = siguiente(sus.map(function (c) { return venceSla(c); }).filter(Boolean), ctx);
    return { ind: ind, filas: filas, sig: sg, bloques: {
      'Resultados del mes por ramo': { tipo: 'ramos', titulo: 'Resultados del mes por ramo', nota: MESES[ctx.ahora.getMonth()].charAt(0).toUpperCase() + MESES[ctx.ahora.getMonth()].slice(1) + ' de ' + ctx.ahora.getFullYear() + (gr ? ' · ' + gr.join(' y ') : ''), items: Object.keys(res).sort().map(function (k) { return { ramo: k, a: res[k].a, n: res[k].n }; }), vacio: 'Sin calificaciones de tus grupos en el mes.' },
    } };
  };
  // Etapa 11-b · Tareas de honorarios y facturas del inspector que cobra (DEC-138): propuesta por revisar, honorario devuelto,
  // factura devuelta por Finanzas, factura cargada por Finanzas por confirmar y liquidación aprobada esperando factura.
  function honTareas(ctx, me, prov) { var out = [], usd = ctx.usd || function (n) { return window.SIRIUS_COMPANIA.formatoMonto(n); }, per = function (x) { return x.periodo.slice(5, 7) + '/' + x.periodo.slice(0, 4); };
    (ctx.honorarios || []).filter(function (h) { return h.inspector === me; }).forEach(function (h) {
      if (h.estado === 'Devuelto') out.push(filaOtra(h.caso, 'Honorario', 'Honorario devuelto' + (h.devolucion ? ': ' + h.devolucion.motivo : '') + ' · ' + usd(h.propuesta), { label: 'Devuelto', tono: 'danger' }, 'Revisar propuesta', { k: 'liq', tab: 'Honorarios', hon: h.id }, 0, h.devolucion ? h.devolucion.fecha : h.fecha));
      if (h.estado === 'Por liquidar' && h.calculo && h.calculo.liquida && h.calculo.liquida.quien === 'Inspector') out.push(filaOtra(h.caso, 'Honorario', 'Informe enviado sin honorario: líquidalo con la calculadora (calculado ' + usd(h.calculado) + ')', { label: 'Por liquidar', tono: 'warning' }, 'Liquidar honorario', { k: 'liq', tab: 'Honorarios', hon: h.id }, 1, h.fecha));
      if (h.estado === 'Calculado') out.push(filaOtra(h.caso, 'Honorario', 'Propuesta de honorario por revisar: calculado ' + usd(h.calculado), { label: 'Por proponer', tono: 'warning' }, 'Revisar propuesta', { k: 'liq', tab: 'Honorarios', hon: h.id }, 1, h.fecha)); });
    if (!prov) return out;
    (ctx.liquidaciones || []).filter(function (x) { return x.proveedor === prov; }).forEach(function (x) { var dv = x.estado === 'Factura devuelta' && ctx.devuelta ? ctx.devuelta(x.id) : null;
      if (x.estado === 'Factura devuelta') out.push(filaOtra(per(x), 'Liquidación ' + x.id, 'Factura ' + (dv ? dv.numero + ' devuelta por ' + dv.por + ': ' + dv.motivo : 'devuelta') + '. Corrígela y vuelve a cargarla (' + usd(x.total) + ')', { label: 'Factura devuelta', tono: 'danger' }, 'Corregir factura', { k: 'liq', tab: 'Liquidaciones' }, 0, dv ? dv.fecha : ''));
      else if (x.estado === 'Aprobada' && !x.factura) out.push(filaOtra(per(x), 'Liquidación ' + x.id, 'Liquidación aprobada por ' + usd(x.total) + ': carga la factura (puede agrupar varias)', { label: 'Esperando factura', tono: 'warning' }, 'Cargar factura', { k: 'liq', tab: 'Liquidaciones' }, 1, '')); });
    (ctx.facturas || []).filter(function (F) { return F.estado === 'Por confirmar del proveedor' && (ctx.liquidaciones || []).some(function (x) { return x.proveedor === prov && F.liqs.indexOf(x.id) >= 0; }); }).forEach(function (F) { out.push(filaOtra(F.numero, 'Factura', 'Finanzas cargó la factura ' + F.numero + ' por ' + usd(F.valor) + ' en tu nombre: confírmala', { label: 'Por confirmar', tono: 'warning' }, 'Confirmar factura', { k: 'liq', tab: 'Liquidaciones' }, 0, F.fecha)); });
    return out; }
  // Etapa 11-b · Finanzas de agencia: honorarios de su agencia por validar y sus liquidaciones (la agencia factura).
  R['Finanzas de agencia'] = function (ctx) { var ag = ctx.agenciaFin || {}, usd = ctx.usd || function (n) { return window.SIRIUS_COMPANIA.formatoMonto(n); }, H = (ctx.honorarios || []).filter(function (h) { return h.agencia === ag.id; }), Lq = (ctx.liquidaciones || []).filter(function (x) { return x.proveedor === ag.nombre; });
    var porV = H.filter(function (h) { return h.estado === 'Por validar en la agencia'; }), porA = H.filter(function (h) { return h.estado === 'Por aprobar'; }), espF = Lq.filter(function (x) { return (x.estado === 'Aprobada' && !x.factura) || x.estado === 'Factura devuelta'; }), suma = function (L, k) { return L.reduce(function (s, x) { return s + x[k]; }, 0); };
    var rev = porV.filter(function (h) { return h.revisar; }), porL = H.filter(function (h) { return h.estado === 'Por liquidar' && h.calculo && h.calculo.liquida.quien === 'Finanzas de agencia'; });
    var ind = {
      'Honorarios por validar': { n: porV.length, tono: porV.length ? 'warning' : null, sub: porV.length ? usd(suma(porV, 'propuesta')) + ' propuestos' : 'Ninguno pendiente', ir: { k: 'liq', tab: 'Honorarios' } },
      'Marcados «Revisar»': { n: rev.length, tono: rev.length ? 'danger' : null, sub: 'Diferencia de más de 20 % o tiempo fuera de la referencia', ir: { k: 'liq', tab: 'Honorarios' } },
      'En aprobación en la aseguradora': { n: porA.length, tono: null, sub: porA.length ? usd(suma(porA, 'valor')) : 'Ninguno', ir: { k: 'liq', tab: 'Honorarios' } },
      'Facturas por cargar': { n: espF.length, tono: espF.length ? 'warning' : null, sub: espF.length ? usd(suma(espF, 'total')) + ' aprobados' : 'Ninguna liquidación aprobada sin factura', ir: { k: 'liq', tab: 'Liquidaciones' } },
    };
    var filas = porL.map(function (h) { return filaOtra(h.caso, h.inspector, 'Informe enviado sin honorario: liquídalo (uno a uno o en lote) · calculado ' + usd(h.calculado), { label: 'Por liquidar', tono: 'warning' }, 'Liquidar honorarios', { k: 'liq', tab: 'Honorarios', hon: h.id }, 1, h.fecha); }).concat(porV.map(function (h) { return filaOtra(h.caso, h.inspector, 'Honorario por validar: propuesta ' + usd(h.propuesta) + ' · calculado ' + usd(h.calculado) + (h.revisar ? ' · Revisar' : ''), { label: 'Por validar', tono: h.revisar ? 'danger' : 'warning' }, 'Validar honorario', { k: 'liq', tab: 'Honorarios', hon: h.id }, h.revisar ? 0 : 1, h.fecha); })).concat(honTareas(ctx, '', ag.nombre));
    return { ind: ind, filas: filas, sig: null, bloques: {} }; };
  // Etapa 11 · Finanzas: indicadores de SIRIUS_LIQUIDACIONES.inicioFinanzas y «Para hoy» (liquidaciones por aprobar, facturas por validar).
  R['Finanzas'] = function (ctx) { var Lq = ctx.liquidaciones || [], usd = ctx.usd || function (n) { return window.SIRIUS_COMPANIA.formatoMonto(n); }, mes = ctx.hoyIso.slice(0, 7);
    var porA = Lq.filter(function (x) { return x.estado === 'Por aprobar'; }), espF = Lq.filter(function (x) { return x.estado === 'Aprobada' && !x.factura; }), porP = Lq.filter(function (x) { return x.estado === 'Facturada' || x.estado === 'Enviada a pago'; }), pag = Lq.filter(function (x) { return x.estado === 'Pagada' && String(x.pagada || '').slice(0, 7) === mes; });
    var suma = function (L) { return L.reduce(function (s, x) { return s + x.total; }, 0); }, porV = Lq.filter(function (x) { return x.estado === 'Aprobada' && x.factura && x.factura.estado === 'Por validar'; });
    var ind = {
      'Por aprobar': { n: porA.length, tono: porA.length ? 'warning' : null, sub: porA.length ? usd(suma(porA)) + ' en total' : 'Ninguna cerrada al corte', ir: { k: 'liq', estado: 'Por aprobar' } },
      'Esperando factura': { n: espF.length, tono: espF.length ? 'warning' : null, sub: espF.length ? usd(suma(espF)) + ' aprobados' : 'Ninguna aprobada sin factura', ir: { k: 'liq', estado: 'Aprobada' } },
      'Por pagar': { n: porP.length, texto: usd(suma(porP)), tono: null, sub: plural(porP.length, 'liquidación facturada o enviada a pago', 'liquidaciones facturadas o enviadas a pago'), ir: { k: 'liq', estado: 'Por pagar' } },
      'Pagado en el mes': { n: pag.length, texto: usd(suma(pag)), tono: null, sub: plural(pag.length, 'liquidación pagada', 'liquidaciones pagadas') + ' en ' + MESES[ctx.ahora.getMonth()], ir: { k: 'liq', estado: 'Pagada' } },
    };
    var filas = [], per = function (x) { return x.periodo.slice(5, 7) + '/' + x.periodo.slice(0, 4); };
    porA.forEach(function (x) { filas.push(filaOtra(per(x), x.proveedor, 'Liquidación por aprobar: ' + x.nLineas + ' líneas, ' + usd(x.total), { label: 'Por aprobar', tono: 'warning' }, 'Revisar y aprobar', { k: 'liq', id: x.id }, 1, ctx.finPeriodo(x.periodo))); });
    // Etapa 11-b: una fila por factura (puede agrupar varias liquidaciones) y los honorarios que esperan aprobación de Finanzas.
    (ctx.facturas || []).filter(function (F) { return F.estado === 'Por validar'; }).forEach(function (F) { var xs = Lq.filter(function (x) { return F.liqs.indexOf(x.id) >= 0; }); if (!xs.length) return; filas.push(filaOtra(F.numero, xs[0].proveedor, 'Factura por ' + usd(F.valor) + ' por validar · ' + (xs.length > 1 ? 'agrupa ' + xs.length + ' liquidaciones (' + xs.map(per).join(', ') + ')' : 'liquidación ' + per(xs[0])), { label: 'Factura por validar', tono: 'warning' }, 'Validar factura', { k: 'liq', id: xs[xs.length - 1].id }, 1, F.fecha)); });
    (ctx.honorarios || []).filter(function (h) { return h.estado === 'Por aprobar'; }).forEach(function (h) { filas.push(filaOtra(h.caso, h.inspector, 'Honorario por aprobar: ' + usd(h.valor) + (h.revisar ? ' · Revisar (' + (h.difPct > 0 ? '+' : '') + String(h.difPct).replace('.', ',') + ' %)' : ''), { label: 'Por aprobar', tono: h.revisar ? 'danger' : 'warning' }, 'Aprobar honorario', { k: 'liq', tab: 'Honorarios', hon: h.id }, 2, h.fecha)); });
    var ab = Lq.filter(function (x) { return x.estado === 'Abierta'; }), sig = ab.length ? { fecha: parse(ctx.finPeriodo(ab[0].periodo)), texto: 'Corte del periodo de ' + MESES[+ab[0].periodo.slice(5, 7) - 1] + ' (' + plural(ab.length, 'liquidación abierta', 'liquidaciones abiertas') + ', ' + usd(suma(ab)) + ')' } : null;
    return { ind: ind, filas: filas, sig: sig && sig.fecha > ctx.ahora ? { texto: sig.texto, fecha: diaLargo(sig.fecha) + ' · ' + pad(sig.fecha.getHours()) + ':' + pad(sig.fecha.getMinutes()) } : null, bloques: {} }; };

  // ---------- Accesos rápidos ----------
  var ACC = {
    'Invitar usuario': { ir: { k: 'usuarios', panel: 'invitar' }, permiso: 'usuarios' },
    'Nueva solicitud': { ir: { k: 'nueva' }, permiso: 'nueva' },
    'Conflictos': { ir: { k: 'conflictos' }, permiso: 'conflictos' },
    'Garantías': { ir: { k: 'mod', mod: 'garantias' }, permiso: 'garantias' },
    'Bandeja': { ir: { k: 'mod', mod: 'solicitudes', child: 'bandeja' }, permiso: 'bandeja' },
    'Agenda': { ir: { k: 'mod', mod: 'agenda' }, permiso: 'agenda' },
    'Calificación': { ir: { k: 'mod', mod: 'calificacion' }, permiso: 'calificacion' },
    'Liquidaciones': { ir: { k: 'mod', mod: 'liquidaciones' }, permiso: 'liquidaciones' },
  };

  // ---------- Modelo completo ----------
  I.modelo = function (rolBase, ctx) {
    I._ctx = ctx;
    var D = (window.SIRIUS_INICIO || { roles: {} }).roles[rolBase] || null, LQ = window.SIRIUS_LIQUIDACIONES;
    // Etapa 11: el inicio de Finanzas sale de SIRIUS_LIQUIDACIONES.inicioFinanzas (ya no es solo el saludo).
    if (rolBase === 'Finanzas de agencia' && !D) D = { nota: 'Valida los honorarios de tu agencia y carga sus facturas.', indicadores: [['Honorarios por validar', 'Honorarios de la agencia en «Por validar en la agencia»', 'Liquidaciones › Honorarios'], ['Marcados «Revisar»', 'Por validar con diferencia > 20 % o tiempo fuera de la referencia', 'Liquidaciones › Honorarios'], ['En aprobación en la aseguradora', 'Validados por la agencia, «Por aprobar»', 'Liquidaciones › Honorarios'], ['Facturas por cargar', 'Liquidaciones aprobadas sin factura o con factura devuelta', 'Liquidaciones']], paraHoy: ['Honorarios por validar (Validar)', 'Facturas por cargar o corregir'], bloques: [], accesos: ['Liquidaciones'] };
    if (rolBase === 'Finanzas' && LQ && LQ.inicioFinanzas) D = { indicadores: LQ.inicioFinanzas, paraHoy: ['Liquidaciones por aprobar (Aprobar)', 'Facturas por validar (Validar)'], bloques: [], accesos: ['Liquidaciones'] };
    var m = { rol: ctx.rolNombre, saludo: { nombre: ctx.yo, primer: String(ctx.yo || '').split(' ')[0], fecha: I.fechaSaludo(ctx.ahora), rol: ctx.rolNombre }, nota: D && D.nota || '', indicadores: [], paraHoy: null, bloques: [], accesos: [] };
    if (!D) return m;
    var calc = (R[rolBase] || R['Finanzas'])(ctx);
    m.indicadores = (D.indicadores || []).slice(0, 4).map(function (x, i) { var v = calc.ind[x[0]] || { n: 0, tono: null, sub: '', ir: null }; return { id: 'ind' + i, titulo: x[0], regla: x[1], destino: x[2], n: v.n, texto: v.texto || null, tono: v.n ? v.tono : null, sub: v.sub, extra: v.extra || null, ir: v.n ? v.ir : null }; });
    if ((D.paraHoy || []).length) {
      var filas = ordenar(calc.filas);
      m.paraHoy = { titulo: 'Para hoy', total: filas.length, filas: filas, reglas: D.paraHoy, vacio: { titulo: 'Nada pendiente para hoy', siguiente: calc.sig } };
    }
    m.bloques = (D.bloques || []).map(function (b) { var x = calc.bloques[b[0]]; return x ? Object.assign({ descripcion: b[1] }, x) : null; }).filter(Boolean);
    m.accesos = (D.accesos || []).map(function (a) { var x = ACC[a]; return x && (!x.permiso || ctx.puede(x.permiso)) ? { label: a, ir: x.ir } : null; }).filter(Boolean);
    return m;
  };
  window.SiriusInicio = I;
})();
