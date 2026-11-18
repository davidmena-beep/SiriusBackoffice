// SIRIUS · Cola de correos con la conexión simulada (v1.0 · provisional · etapa N-2 · DEC-256 · 18/11/2026)
// Escena cxnotifcola: arma SIRIUS_CONEXION con el caso 50012 de coordinación (la misma base de cxestadoparcial) y notificacionesEnvio[] con la forma
// del contrato (SQL 58): 4 «Por aprobar» (2 R05, 1 R19 y 1 «Solicitud cancelada»), 2 «Pendiente», 1 «Fallido», 1 «Enviado» y 1 WhatsApp simulado.
// La base simulada aplica aprobarNotificacion, rechazarNotificacion, reenviarNotificacion y enviarNotificacionesAhora con SiriusNotifCola.ops (la misma
// regla de la pantalla) sobre cualquier SIRIUS_CONEXION que traiga notificacionesEnvio[]. enviarPruebaNotificacion todavía no existe en la base:
// responde { ok: false } y la pantalla solo avisa. ?cxok=0 hace que la base responda { ok: false } a todo.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const clon = (x) => JSON.parse(JSON.stringify(x));
  const ESC = ['cxnotifcola'];
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const ADM = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
  const prevSim = CC.cxSim.bind(CC), prevAp = CC.aplicar ? CC.aplicar.bind(CC) : null;
  const datos = () => { const X = prevSim('cxestadoparcial'), hoy = '2026-10-18', c = (X.casos || []).find((x) => String(x.id) === '50012') || {}, ct = c.contacto || {};
    const cli = ct.nombre || c.asegurado || 'Cliente del caso 50012', mail = ct.correo || ct.email || 'cliente.50012@correo.ec';
    const n = (id, regla, destinatario, destinatarioNombre, rolDestino, estado, asunto, plantilla, hora, extra) => Object.assign({ id, caso: '50012', regla, canal: 'correo', destinatario, destinatarioNombre, rolDestino, estado, asunto, plantilla, contenido: '', fecha: hoy + 'T' + hora, error: '', simulado: false, requiereAprobacion: estado === 'Por aprobar', aprobadoPor: null, aprobadoEn: null, intentos: 0 }, extra || {});
    X.usuario = clon(ADM);
    X.notificacionesEnvio = [
      n('ENV-5801', 'R05', mail, cli, 'Cliente', 'Por aprobar', 'Tu inspección está agendada', 'visita_confirmada', '19:40'),
      n('ENV-5802', 'R05', 'lucia.vera@austrobrokers.ec', 'Lucía Vera', 'Bróker (APS)', 'Por aprobar', 'Caso 50012: visita agendada', 'visita_confirmada', '19:40'),
      n('ENV-5803', 'R19', mail, cli, 'Cliente', 'Por aprobar', 'Agenda la inspección de tu caso 50012', 'enlace_autoagendamiento', '19:52'),
      n('ENV-5804', 'Solicitud cancelada', 'lucia.vera@austrobrokers.ec', 'Lucía Vera', 'Bróker (APS)', 'Por aprobar', 'Caso 50012: se canceló la solicitud de PRB1213', '', '20:05', { contenido: 'La solicitud de inspección del vehículo PRB1213 (caso 50012) se canceló: el cliente vendió el vehículo.' }),
      n('ENV-5805', 'R05', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Pendiente', 'Visita agendada · caso 50012', 'visita_confirmada', '19:40'),
      n('ENV-5806', 'R05', 'david.mena.coordinador@gmail.com', '', 'Suscriptor', 'Pendiente', '[Sin destinatario: Suscriptor] Visita agendada · caso 50012', 'visita_confirmada', '19:40'),
      n('ENV-5807', 'R19', 'cliente.50012@correo', cli, 'Cliente', 'Fallido', 'Agenda la inspección de tu caso 50012', 'enlace_autoagendamiento', '10:15', { fecha: '2026-10-17T10:15', error: 'Dirección rechazada por el servidor de correo: «cliente.50012@correo» no es una dirección válida', requiereAprobacion: true, aprobadoPor: 'Andrea Salazar', aprobadoEn: '2026-10-17T10:16', intentos: 1 }),
      n('ENV-5808', 'R05', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Enviado', 'Visita agendada · caso 50012 (V1)', 'visita_confirmada', '09:02', { fecha: '2026-10-16T09:02', enviadoEn: '2026-10-16T09:03', intentos: 1 }),
      n('ENV-5809', 'R05', ct.cel || '0991234012', cli, 'Cliente', 'Pendiente', 'Visita agendada por WhatsApp', 'visita_confirmada', '19:40', { canal: 'whatsapp', simulado: true })];
    return X; };
  CC.cxSim = function (escena) { return ESC.indexOf(escena) >= 0 ? datos() : prevSim(escena); };
  const TIPOS = ['aprobarNotificacion', 'rechazarNotificacion', 'reenviarNotificacion', 'enviarNotificacionesAhora', 'enviarPruebaNotificacion'];
  CC.aplicar = function (X, tipo, d) { if (TIPOS.indexOf(tipo) < 0 || !X || !Array.isArray(X.notificacionesEnvio)) return prevAp ? prevAp(X, tipo, d) : null;
    try { window.__sirNcUltima = (window.__sirNcUltima || []).concat([clon({ tipo, datos: d || {} })]); } catch (er) { /* registro de prueba */ }
    if (tipo === 'enviarPruebaNotificacion') return { ok: false, mensaje: 'Acción desconocida: enviarPruebaNotificacion' };
    const NC = window.SiriusNotifCola; if (!NC) return { ok: false, mensaje: 'Sin el módulo de la cola' };
    const u = X.usuario || {}, r = NC.ops(X.notificacionesEnvio, tipo, clon(d || {}), { por: u.nombre || '', rol: window.__sirRolActivo || u.rol || '', fecha: NC.ahoraIso() });
    return r; };
  CC.cxNotif = { escenas: ESC };
})();
