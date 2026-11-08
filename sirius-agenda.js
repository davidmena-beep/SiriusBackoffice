// SIRIUS · Lógica de la Agenda de inspecciones (etapa 11 · DEC-135). Lee SIRIUS_AGENDA (disponibilidad, capacidad, bloqueos,
// confirmación) y SIRIUS_FLUJO (feriados). Las visitas no viven aquí: las entrega el Back-office (visitas de cada caso y
// SIRIUS_FLUJO.ingresos), sin duplicarlas. validar() revisa un reagendamiento: choque, jornada, bloqueo, zona, modalidad y capacidad.
(function () {
  var A = {};
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  A.D = function () { return window.SIRIUS_AGENDA || { disponibilidad: [], bloqueos: [], confirmacion: { estados: [], ejemplos: {} }, vistas: ['Día', 'Semana', 'Lista'] }; };
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
  A.disp = function (n) { return A.D().disponibilidad.find(function (x) { return x.inspector === n; }) || null; };
  A.feriado = function (iso) { var F = window.SIRIUS_FLUJO, f = F && F.calendario && F.calendario.feriados.find(function (x) { return x.fecha === iso && x.alcance === 'Nacional'; }); return f ? f.nombre : null; };
  A.trabaja = function (n, iso) { var d = A.disp(n); return !!d && d.dias.indexOf(A.parse(iso).getDay()) >= 0 && !A.feriado(iso); };
  // Bloqueos del inspector en un día: [{ ini, fin (minutos), motivo, todoElDia }]
  A.bloqueos = function (n, iso) { return A.D().bloqueos.filter(function (b) { return b.inspector === n && iso >= b.desde.slice(0, 10) && iso <= b.hasta.slice(0, 10); }).map(function (b) {
    var todo = b.desde.length <= 10 && b.hasta.length <= 10, ini = b.desde.length > 10 && b.desde.slice(0, 10) === iso ? A.min(b.desde.slice(11)) : 0, fin = b.hasta.length > 10 && b.hasta.slice(0, 10) === iso ? A.min(b.hasta.slice(11)) : 24 * 60;
    return { ini: ini, fin: fin, motivo: b.motivo, todoElDia: todo || (ini === 0 && fin === 24 * 60), desde: b.desde, hasta: b.hasta }; }); };
  A.confEstados = function () { return (A.D().confirmacion || {}).estados || []; };
  A.confTono = function (e) { var x = A.confEstados().find(function (y) { return y.id === e; }); return x ? x.badge : 'neutral'; };
  // Confirmación de una visita abierta: la de la visita si la registró la pantalla; si no, la de SIRIUS_AGENDA.confirmacion.ejemplos; si no, «Por confirmar».
  A.confirmacion = function (caso, v) { if (!v || v.estado === 'Realizada' || v.estado === 'Cancelada' || v.mod === 'Autoinspección' || v.mod === 'No requiere inspección' || v.mod === 'Documental') return null;
    var ej = (A.D().confirmacion || {}).ejemplos || {}, e = v.confirmacion || ej[caso] || 'Por confirmar';
    // Etapa 11-b: sin respuesta a las 17:00 del día anterior → «Sin respuesta» (SIRIUS_AGENDA.confirmacion.regla).
    if (e === 'Por confirmar' && v.fecha) { var E = window.SIRIUS_EJEMPLO, now = E && E.ahora ? E.ahora() : null, lim = A.parse(A.sumaDias(v.fecha, -1) + 'T' + ((((window.SIRIUS_APP_INSPECTOR || {}).confirmacionVisita) || {}).horaSinRespuesta || '18:00')); /* etapa 15-2: hora de SIRIUS_APP_INSPECTOR.confirmacionVisita */ if (now && now >= lim) e = 'Sin respuesta'; }
    return e; };
  A.dur = function (v) { var i = A.min(v.hIni), f = A.min(v.hFin); return i != null && f != null && f > i ? f - i : 60; };
  A.ocupa = function (v) { return !!v.inspector && v.mod !== 'Autoinspección' && v.estado !== 'Cancelada'; };
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
    if (suc && d.zonas.indexOf(suc) < 0) out.push({ tipo: 'zona', texto: n + ' no cubre ' + suc + ' (sus zonas: ' + A.lista(d.zonas) + ').' });
    if (v.mod && d.modalidades.indexOf(v.mod) < 0) out.push({ tipo: 'modalidad', texto: n + ' no hace visitas «' + v.mod + '» (hace ' + A.lista(d.modalidades.map(function (m) { return '«' + m + '»'; })) + ').' });
    if (otras.length + 1 > d.capacidadDia) out.push({ tipo: 'capacidad', texto: n + ' ya tiene ' + otras.length + ' de ' + d.capacidadDia + ' visitas el ' + A.corta(dst.fecha) + '.' });
    if (v.fecha === dst.fecha && v.hIni === dst.hIni && v.inspector === n) out.push({ tipo: 'igual', texto: 'Es la misma fecha, hora e inspector: no hay nada que mover.' });
    return { ok: !out.length, motivos: out, fin: A.hhmm(fin) };
  };
  A.CHECKS = [['choque', 'Sin choque de horario'], ['jornada', 'Dentro de la jornada'], ['bloqueo', 'Sin bloqueos'], ['zona', 'Zona del inspector'], ['modalidad', 'Modalidad que hace'], ['capacidad', 'Capacidad del día']];
  window.SiriusAgenda = A;
})();
