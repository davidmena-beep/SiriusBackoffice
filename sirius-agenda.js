// SIRIUS · Lógica de la Agenda de inspecciones (etapa 11 · DEC-135). Lee SIRIUS_AGENDA (confirmación y vistas), la operación de cada inspector
// por SiriusRedFuente (R-5a · DEC-266: jornada, capacidad, modalidades y bloqueos de la Red de inspectores) y SIRIUS_FLUJO (feriados). Las visitas no viven aquí: las entrega el Back-office (visitas de cada caso y
// SIRIUS_FLUJO.ingresos), sin duplicarlas. validar() revisa un reagendamiento: choque, jornada, bloqueo, zona, modalidad y capacidad.
// Etapa G-2e: validarCx() revisa mover una visita de la base (Agenda conectada) con las reglas de Coordinar visita: jornada y días, choque, hora pasada y cobertura (con motivo).
(function () {
  var A = {};
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  A.D = function () { return window.SIRIUS_AGENDA || { confirmacion: { estados: [], ejemplos: {} }, vistas: ['Día', 'Semana', 'Lista'] }; };
  var RF = function () { return window.SiriusRedFuente || null; }; // R-5a · DEC-266: el lector único de la Red
  A.min = function (h) { if (!h) return null; var p = String(h).split(':'); return +p[0] * 60 + +(p[1] || 0); };
  A.hhmm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  A.parse = function (iso) { var p = String(iso).split(/[-T:]/).map(Number); return new Date(p[0], p[1] - 1, p[2], p[3] || 0, p[4] || 0); };
  A.iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  A.sumaDias = function (iso, n) { var d = A.parse(iso); d.setDate(d.getDate() + n); return A.iso(d); };
  A.lunes = function (iso) { var d = A.parse(iso), k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); return A.iso(d); };
  A.corta = function (iso) { var p = String(iso).split('-'); return p[2] + '/' + p[1]; };
  A.diaNombre = function (iso) { return DIAS[A.parse(iso).getDay()]; };
  A.diaTxt = function (iso) { return A.diaNombre(iso) + ' ' + A.corta(iso); };
  A.diaLargo = function (iso) { var s = A.diaNombre(iso); return s.charAt(0).toUpperCase() + s.slice(1) + ' ' + A.corta(iso); };
  A.lista = function (a) { a = a.slice(); if (a.length <= 1) return a.join(''); var u = a.pop(); return a.join(', ') + ' y ' + u; };
  // P-6f-b · DEC-214: el inspector se busca por su identificación (o su nombre, actual o anterior). R-5a: disp(n) = el inspector con jornada propia en la Red
  // (agenda fija), con la forma de siempre { inspector, dias (0 a 6), jornada [desde, hasta], zonas, capacidadDia, modalidades, credencial, ciudadBase, base }.
  A.disp = function (n) { var R = RF(); return R ? R.disp(n) : null; };
  A.feriado = function (iso) { var F = window.SIRIUS_FLUJO, f = F && F.calendario && F.calendario.feriados.find(function (x) { return x.fecha === iso && x.alcance === 'Nacional'; }); return f ? f.nombre : null; };
  A.trabaja = function (n, iso) { var R = RF(); return !!A.disp(n) && !!R && R.trabaja(n, iso); }; // solo la agenda fija (con jornada propia), como antes
  // Bloqueos del inspector en un día: [{ ini, fin (minutos), motivo, todoElDia }]
  A.bloqueos = function (n, iso) { var R = RF(); return R ? R.bloqueos(n, iso) : []; }; // R-5a: los bloqueos de la Red (la Agenda los muestra; se gestionan en Red de inspectores)
  A.confEstados = function () { return (A.D().confirmacion || {}).estados || []; };
  A.confTono = function (e) { var x = A.confEstados().find(function (y) { return y.id === e; }); return x ? x.badge : 'neutral'; };
  // Confirmación de una visita abierta: la de la visita si la registró la pantalla; si no, la de SIRIUS_AGENDA.confirmacion.ejemplos; si no, «Por confirmar».
  A.confirmacion = function (caso, v) { if (!v || v.estado === 'Realizada' || v.estado === 'Cancelada' || v.mod === 'Autoinspección' || v.mod === 'No requiere inspección' || v.mod === 'Documental') return null;
    var ej = (A.D().confirmacion || {}).ejemplos || {}, e = v.confirmacion || ej[caso] || 'Por confirmar';
    // Etapa 11-b: sin respuesta a las 17:00 del día anterior → «Sin respuesta» (SIRIUS_AGENDA.confirmacion.regla).
    if (e === 'Por confirmar' && v.fecha) { var E = window.SIRIUS_EJEMPLO, now = E && E.ahora ? E.ahora() : null, lim = A.parse(A.sumaDias(v.fecha, -1) + 'T' + ((((window.SIRIUS_APP_INSPECTOR || {}).confirmacionVisita) || {}).horaSinRespuesta || '18:00')); /* etapa 15-2: hora de SIRIUS_APP_INSPECTOR.confirmacionVisita */ if (now && now >= lim) e = 'Sin respuesta'; }
    return e; };
  A.dur = function (v) { var i = A.min(v.hIni), f = A.min(v.hFin); return i != null && f != null && f > i ? f - i : 60; };
  A.ocupa = function (v) { return !!v.inspector && v.mod !== 'Autoinspección' && v.estado !== 'Cancelada' && v.estado !== 'Reagendada'; }; // G-4: una visita reagendada ya no ocupa al inspector
  // Valida mover la visita v a { inspector, fecha, hIni }. visitas: todas las visitas vigentes. Devuelve { ok, motivos: [{ tipo, texto }] }.
  A.validar = function (v, dst, visitas, caso) {
    var out = [], n = dst.inspector, d = A.disp(n), ini = A.min(dst.hIni), fin = ini + A.dur(v), suc = v.zona || (caso && caso.sucursal) || v.sucursal || ''; // etapa 14: la visita autoagendada lleva la zona del riesgo
    if (!n) return { ok: false, motivos: [{ tipo: 'inspector', texto: 'Elige un inspector: para dejar la visita sin inspector usa Coordinación.' }] };
    if (!d) return { ok: false, motivos: [{ tipo: 'inspector', texto: n + ' no tiene disponibilidad registrada en la Agenda.' }] };
    var fer = A.feriado(dst.fecha);
    if (fer) out.push({ tipo: 'jornada', texto: 'El ' + A.diaNombre(dst.fecha) + ' ' + A.corta(dst.fecha) + ' es feriado (' + fer + ').' });
    else if (d.dias.indexOf(A.parse(dst.fecha).getDay()) < 0) out.push({ tipo: 'jornada', texto: n + ' no trabaja los ' + A.diaNombre(dst.fecha) + '.' });
    else if (ini < A.min(d.jornada[0]) || fin > A.min(d.jornada[1])) out.push({ tipo: 'jornada', texto: 'De ' + A.hhmm(ini) + ' a ' + A.hhmm(fin) + ' queda fuera de la jornada de ' + n + ' (' + d.jornada[0] + ' a ' + d.jornada[1] + ').' });
    A.bloqueos(n, dst.fecha).forEach(function (b) { if (ini < b.fin && fin > b.ini) out.push({ tipo: 'bloqueo', texto: n + ' tiene un bloqueo el ' + A.corta(dst.fecha) + (b.todoElDia ? ' todo el día' : ' de ' + A.hhmm(b.ini) + ' a ' + A.hhmm(b.fin)) + ': ' + b.motivo + '.' }); });
    var otras = visitas.filter(function (x) { return x.key !== v.key && A.ocupa(x) && x.inspector === n && x.fecha === dst.fecha; });
    otras.forEach(function (x) { var a = A.min(x.hIni), b = a + A.dur(x); if (a != null && ini < b && fin > a) out.push({ tipo: 'choque', texto: 'Choca con la visita del caso ' + x.caso + ' (' + A.hhmm(a) + '–' + A.hhmm(b) + ').' }); });
    // Etapa G-2b · DEC-223: la cobertura del inspector (SiriusCobertura) con la sucursal del caso; sin el módulo, las zonas como antes.
    var COB = window.SiriusCobertura;
    // Etapa G-2c · DEC-222: con el lugar de la visita, también su ciudad y su zona (un inspector «Por ciudad y zona» cubre la visita de su zona).
    var lug = v.lugar && typeof v.lugar === 'object' ? v.lugar : null;
    if ((suc || lug) && COB) { var cb = COB.cubre(d, { sucursal: suc, ciudad: lug ? lug.ciudad : '', zonaId: lug && lug.zona ? lug.zona.id : '' }); if (!cb.nivel) { var dn = lug && window.SiriusLugar ? window.SiriusLugar.texto(lug) : suc; out.push({ tipo: 'zona', texto: cb.faltaLugar ? n + ': falta el lugar de la inspección para saber si cubre ' + dn + ' (' + COB.corto(d) + ').' : n + ' no cubre ' + dn + ' (su cobertura: ' + COB.corto(d) + ').' }); } }
    else if (suc && d.zonas.indexOf(suc) < 0) out.push({ tipo: 'zona', texto: n + ' no cubre ' + suc + ' (sus zonas: ' + A.lista(d.zonas) + ').' });
    if (v.mod && d.modalidades.indexOf(v.mod) < 0) out.push({ tipo: 'modalidad', texto: n + ' no hace visitas «' + v.mod + '» (hace ' + A.lista(d.modalidades.map(function (m) { return '«' + m + '»'; })) + ').' });
    if (otras.length + 1 > d.capacidadDia) out.push({ tipo: 'capacidad', texto: n + ' ya tiene ' + otras.length + ' de ' + d.capacidadDia + ' visitas el ' + A.corta(dst.fecha) + '.' });
    if (v.fecha === dst.fecha && v.hIni === dst.hIni && v.inspector === n) out.push({ tipo: 'igual', texto: 'Es la misma fecha, hora e inspector: no hay nada que mover.' });
    return { ok: !out.length, motivos: out, fin: A.hhmm(fin) };
  };
  A.CHECKS = [['choque', 'Sin choque de horario'], ['jornada', 'Dentro de la jornada'], ['bloqueo', 'Sin bloqueos'], ['zona', 'Cobertura del inspector'], ['modalidad', 'Modalidad que hace'], ['capacidad', 'Capacidad del día']];
  // Etapa G-2e · Agenda conectada: mover una visita de la base = reagendar, con las reglas de Coordinar visita. ctx = { disp(n) → { dias (0 = domingo), jornada [ini, fin], cobertura… } | null,
  // ahora 'AAAA-MM-DDTHH:MM' (reloj real de Ecuador), jornadaTxt(n) }. Bloquean: jornada y días del inspector, choque y hora pasada. Fuera de cobertura no bloquea: va en avisos y pide motivo.
  A.CHECKS_CX = [['choque', 'Sin choque de horario'], ['jornada', 'Dentro de la jornada y los días del inspector'], ['pasada', 'No es una hora pasada'], ['zona', 'Cobertura del inspector']];
  A.validarCx = function (v, dst, visitas, ctx) {
    ctx = ctx || {}; var out = [], avisos = [], n = dst.inspector, d = n && ctx.disp ? ctx.disp(n) : null, ini = A.min(dst.hIni), fin = ini + A.dur(v), jt = ctx.jornadaTxt ? ctx.jornadaTxt(n) : '';
    if (!n) return { ok: false, motivos: [{ tipo: 'inspector', texto: 'Elige un inspector: para dejar la visita sin inspector usa Coordinar visita.' }], avisos: [], fin: A.hhmm(fin) };
    if (!d) return { ok: false, motivos: [{ tipo: 'inspector', texto: n + ' no está entre los inspectores activos de la base.' }], avisos: [], fin: A.hhmm(fin) };
    var fer = A.feriado(dst.fecha);
    if (fer) out.push({ tipo: 'jornada', texto: 'El ' + A.diaNombre(dst.fecha) + ' ' + A.corta(dst.fecha) + ' es feriado (' + fer + ').' });
    else if (d.dias.indexOf(A.parse(dst.fecha).getDay()) < 0) out.push({ tipo: 'jornada', texto: n + ' no trabaja los ' + A.diaNombre(dst.fecha) + ' (' + jt + ').' });
    else if (ini < A.min(d.jornada[0]) || fin > A.min(d.jornada[1])) out.push({ tipo: 'jornada', texto: 'De ' + A.hhmm(ini) + ' a ' + A.hhmm(fin) + ' queda fuera de la jornada de ' + n + ' (' + jt + ').' });
    (visitas || []).filter(function (x) { return x.key !== v.key && x.inspector === n && x.fecha === dst.fecha && x.hIni && !/cancel|reagend/i.test(String(x.estado || '')) && x.mod !== 'Autoinspección'; }).forEach(function (x) { var a = A.min(x.hIni), b = a + A.dur(x); if (ini < b && fin > a) out.push({ tipo: 'choque', texto: 'Choca con la visita V' + (x.n || '') + ' del caso ' + x.caso + ' (' + A.hhmm(a) + '–' + A.hhmm(b) + ').' }); });
    if (ctx.ahora && dst.fecha + 'T' + A.hhmm(ini) < String(ctx.ahora).slice(0, 16)) out.push({ tipo: 'pasada', texto: 'Las ' + A.hhmm(ini) + ' del ' + A.diaNombre(dst.fecha) + ' ' + A.corta(dst.fecha) + ' ya pasaron (ahora son las ' + String(ctx.ahora).slice(11, 16) + ' en Ecuador).' });
    var COB = window.SiriusCobertura, lug = v.lugar && typeof v.lugar === 'object' ? v.lugar : null;
    if (COB && lug && lug.ciudad) { var cb = COB.cubre(d, { sucursal: v.sucursal || '', ciudad: lug.ciudad, zonaId: lug.zona ? lug.zona.id : '' }); if (!cb.nivel) avisos.push({ tipo: 'zona', texto: n + ' no cubre ' + (v.lugarTxt || 'este lugar') + ' (su cobertura: ' + COB.corto(d) + '). Se puede mover con el motivo: la visita queda con la alerta «Fuera de cobertura».' }); }
    if (v.fecha === dst.fecha && v.hIni === dst.hIni && v.inspector === n) out.push({ tipo: 'igual', texto: 'Es la misma fecha, hora e inspector: no hay nada que mover.' });
    return { ok: !out.length, motivos: out, avisos: avisos, fuera: avisos.length > 0, fin: A.hhmm(fin) };
  };
  window.SiriusAgenda = A;
})();
