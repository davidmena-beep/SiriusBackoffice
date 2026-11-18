// SIRIUS · Cola única de «por calificar» (v1.0 · etapa P-6g-2c · DEC-252 · 17/11/2026)
// Una sola regla y una sola unidad para todas las pantallas: bandeja (pestaña «En calificación» y nota de cada fila), menú Calificación
// (cabecera, indicadores y pestañas), Inicio (tarjetas de calificación) y campana. Ninguna pantalla recalcula por su cuenta.
//
// Regla (sale de SiriusCalificacion.cola, que arma las filas con o sin la conexión):
//   · por calificar = informe completo de un vehículo o bien, sin el veredicto del nivel que le toca (fuera de la facultad de quien lo
//     completó o enviado a calificación), en un caso que no está cancelado ni emitido.
//   · nivel 1 (Ejecutivo de inspecciones) = filas de «porCalificar»; nivel 2 (Suscriptor) = filas de «suscripcion».
//   · vencido = SLA de calificación vencido (sla.tono === 'danger').
//   · alcance: cada usuario ve los de su nivel que son suyos (responsable, cola compartida o grupo de ramo); el Administrador y los
//     roles sin nivel de calificación ven todos.
// Unidades: N casos (casos con al menos un informe por calificar) · M informes · V vencidos (informes con el SLA vencido).
(function () {
  var Q = {};
  var NIVEL = { 'Ejecutivo de inspecciones': 1, 'Suscriptor': 2 };
  var plural = function (n, s, p) { return n + ' ' + (n === 1 ? s : p); };
  Q.nivelDe = function (rolBase) { return NIVEL[rolBase] || 0; }; // 0 = todos los niveles
  // Los ítems de la cola: un informe por calificar = una fila de nivel 1 o de nivel 2.
  Q.items = function (cola) {
    var C = cola || {}, out = [], ven = function (x) { return !!(x.sla && x.sla.tono === 'danger'); }, pv = function (x) { return !!(x.sla && x.sla.tono === 'warning'); };
    (C.porCalificar || []).forEach(function (x) { out.push({ id: x.id, caso: x.caso, riesgo: x.riesgo, nivel: 1, vencido: ven(x), porVencer: pv(x), mio: !!x.mio, fila: x }); });
    (C.suscripcion || []).forEach(function (x) { out.push({ id: x.id, caso: x.caso, riesgo: x.riesgo, nivel: 2, vencido: ven(x), porVencer: pv(x), mio: !!x.mio, fila: x }); });
    return out;
  };
  // opts.ver: 'mis' (solo los suyos), 'todos' (los de su nivel de todos los responsables) o vacío (lo que le toca al rol: el
  // Ejecutivo de inspecciones y el Suscriptor, los suyos; el Administrador y los demás roles, todos). opts.nivel fuerza un nivel.
  Q.resumen = function (cola, rolBase, opts) {
    var o = opts || {}, nv = o.nivel != null ? o.nivel : Q.nivelDe(rolBase), ver = o.ver || (Q.nivelDe(rolBase) ? 'mis' : 'todos');
    var L = Q.items(cola).filter(function (x) { return (!nv || x.nivel === nv) && (ver === 'todos' || x.mio); });
    var porCaso = {}, vencPorCaso = {}, casos = [];
    L.forEach(function (x) { if (!porCaso[x.caso]) { porCaso[x.caso] = 0; vencPorCaso[x.caso] = 0; casos.push(x.caso); } porCaso[x.caso]++; if (x.vencido) vencPorCaso[x.caso]++; });
    var r = { items: L, casos: casos.length, informes: L.length, vencidos: L.filter(function (x) { return x.vencido; }).length, porVencer: L.filter(function (x) { return x.porVencer; }).length,
      n1: L.filter(function (x) { return x.nivel === 1; }).length, n2: L.filter(function (x) { return x.nivel === 2; }).length, porCaso: porCaso, vencPorCaso: vencPorCaso, idsCasos: casos, nivel: nv, ver: ver };
    r.texto = Q.texto(r); return r;
  };
  Q.texto = function (r) { return plural(r.casos, 'caso', 'casos') + ' · ' + plural(r.informes, 'informe', 'informes') + ' · ' + plural(r.vencidos, 'vencido', 'vencidos'); };
  Q.nota = function (n) { return n + ' por calificar'; };
  // Atajo: arma la cola con el ctx del Back-office (inicioCtx) y devuelve el resumen del rol.
  Q.de = function (ctx, rolBase, opts) { var SC = window.SiriusCalificacion; if (!SC || !ctx) return Q.resumen(null, rolBase, opts); return Q.resumen(ctx._colaCache || SC.cola(ctx), rolBase, opts); };
  window.SiriusColaCalificacion = Q;
})();
