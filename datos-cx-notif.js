// SIRIUS · Cola de correos con la conexión simulada (v1.0 · provisional · etapa N-2 · DEC-256 · 18/11/2026; N-1d: escena bitacoratardia)
// Escena cxnotifcola: arma SIRIUS_CONEXION con el caso 50012 de coordinación (la misma base de cxestadoparcial) y notificacionesEnvio[] con la forma
// del contrato (SQL 58): 4 «Por aprobar» (2 R05, 1 R19 y 1 R23 «Solicitud cancelada»), 2 «Pendiente», 1 «Fallido», 1 «Enviado» y 1 WhatsApp simulado.
// La base simulada aplica aprobarNotificacion, rechazarNotificacion, reenviarNotificacion y enviarNotificacionesAhora con SiriusNotifCola.ops (la misma
// regla de la pantalla) sobre cualquier SIRIUS_CONEXION que traiga notificacionesEnvio[]. enviarPruebaNotificacion todavía no existe en la base:
// responde { ok: false } y la pantalla solo avisa. ?cxok=0 hace que la base responda { ok: false } a todo.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const clon = (x) => JSON.parse(JSON.stringify(x));
  const ESC = ['cxnotifcola', 'notifinterruptor', 'notifprueba', 'historialreloj', 'botondestino', 'plantillapublicada', 'bitacoraorden', 'casoporenlace', 'vistapreviabase', 'vercorreobase', 'campanaavisos', 'campanavacia', 'bitacoratardia', 'plantillasubirimagen', 'plantillaimagenerror']; // N-2b: notifinterruptor, notifprueba e historialreloj; N-2c: las cuatro siguientes; N-2d: vistapreviabase y vercorreobase
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const ADM = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
  const prevSim = CC.cxSim.bind(CC), prevAp = CC.aplicar ? CC.aplicar.bind(CC) : null;
  const iso = (min) => new Date(Date.now() - min * 60000).toISOString(); // horas reales, como las devuelve la base (UTC con zona)
  const CFG = 'sirius.sim.config.SIRIUS_NOTIFICACIONES', leerCfg = () => { try { return JSON.parse(sessionStorage.getItem(CFG) || 'null'); } catch (e) { return null; } }, guardarCfg = (c) => { try { sessionStorage.setItem(CFG, JSON.stringify(c)); } catch (e) { /* sin almacenamiento */ } };
  const datos = (escena) => { if (escena === 'plantillasubirimagen' || escena === 'plantillaimagenerror') escena = 'vistapreviabase'; /* N-2e: los mismos datos de la base que vistapreviabase (caso 50013 con enlace activo) */ const X = prevSim(escena === 'botondestino' ? 'cxvisitaenlace' : escena === 'casoporenlace' || escena === 'vistapreviabase' || escena === 'vercorreobase' || escena === 'campanaavisos' || escena === 'campanavacia' ? 'lugarrg' : 'cxestadoparcial'), hoy = '2026-10-18', c = (X.casos || []).find((x) => String(x.id) === '50012') || {}, ct = c.contacto || {};
    const cli = ct.nombre || c.asegurado || 'Cliente del caso 50012', mail = ct.correo || ct.email || 'cliente.50012@correo.ec';
    const n = (id, regla, destinatario, destinatarioNombre, rolDestino, estado, asunto, plantilla, hora, extra) => Object.assign({ id, caso: '50012', regla, canal: 'correo', destinatario, destinatarioNombre, rolDestino, estado, asunto, plantilla, contenido: '', fecha: hoy + 'T' + hora, error: '', simulado: false, requiereAprobacion: estado === 'Por aprobar', aprobadoPor: null, aprobadoEn: null, intentos: 0 }, extra || {});
    X.usuario = clon(ADM);
    X.notificacionesEnvio = [
      n('ENV-5801', 'R05', mail, cli, 'Cliente', 'Por aprobar', 'Tu inspección está agendada', 'visita_confirmada', '19:40'),
      n('ENV-5802', 'R05', 'lucia.vera@austrobrokers.ec', 'Lucía Vera', 'Bróker (APS)', 'Por aprobar', 'Caso 50012: visita agendada', 'visita_confirmada', '19:40'),
      n('ENV-5803', 'R19', mail, cli, 'Cliente', 'Por aprobar', 'Agenda la inspección de tu caso 50012', 'enlace_autoagendamiento', '19:52'),
      n('ENV-5804', 'R23', 'lucia.vera@austrobrokers.ec', 'Lucía Vera', 'Bróker (APS)', 'Por aprobar', 'Caso 50012: se canceló la solicitud de PRB1213', 'solicitud_cancelada', '20:05', { contenido: 'La solicitud de inspección del vehículo PRB1213 (caso 50012) se canceló: el cliente vendió el vehículo.' }),
      n('ENV-5805', 'R05', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Pendiente', 'Visita agendada · caso 50012', 'visita_confirmada', '19:40'),
      n('ENV-5806', 'R05', 'david.mena.coordinador@gmail.com', '', 'Suscriptor', 'Pendiente', '[Sin destinatario: Suscriptor] Visita agendada · caso 50012', 'visita_confirmada', '19:40'),
      n('ENV-5807', 'R19', 'cliente.50012@correo', cli, 'Cliente', 'Fallido', 'Agenda la inspección de tu caso 50012', 'enlace_autoagendamiento', '10:15', { fecha: '2026-10-17T10:15', error: 'Dirección rechazada por el servidor de correo: «cliente.50012@correo» no es una dirección válida', requiereAprobacion: true, aprobadoPor: 'Andrea Salazar', aprobadoEn: '2026-10-17T10:16', intentos: 1 }),
      n('ENV-5808', 'R05', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Enviado', 'Visita agendada · caso 50012 (V1)', 'visita_confirmada', '09:02', { fecha: '2026-10-16T09:02', enviadoEn: '2026-10-16T09:03', intentos: 1 }),
      n('ENV-5809', 'R05', ct.cel || '0991234012', cli, 'Cliente', 'Pendiente', 'Visita agendada por WhatsApp', 'visita_confirmada', '19:40', { canal: 'whatsapp', simulado: true })];
    X.envio = { activo: true }; // SQL 59: el interruptor «Notificaciones» (lo lee y lo cambia la base)
    // N-2b · notifinterruptor: apagadas desde las 19:30, con dos correos nuevos que quedaron «Simulado» (no salen).
    if (escena === 'notifinterruptor') { X.envio = { activo: false, cambio: { por: 'Andrea Salazar', fecha: hoy + 'T19:30', motivo: 'Pruebas de plantillas con la base: no debe salir nada a clientes' } };
      X.notificacionesEnvio = X.notificacionesEnvio.filter((x) => x.estado !== 'Por aprobar').concat([
        n('ENV-5811', 'R05', mail, cli, 'Cliente', 'Simulado', 'Tu inspección está agendada', 'visita_confirmada', '19:45'),
        n('ENV-5812', 'R23', 'lucia.vera@austrobrokers.ec', 'Lucía Vera', 'Bróker (APS)', 'Simulado', 'Caso 50012: se canceló la solicitud de PRB1213', 'solicitud_cancelada', '20:05')]); }
    if (escena === 'notifprueba') X.notificacionesEnvio = X.notificacionesEnvio.filter((x) => x.estado !== 'Por aprobar');
    // N-2b · historialreloj: horas reales de la base (UTC, con zona) y las mismas en la bitácora y en Coordinación.
    if (escena === 'historialreloj') { const t = (min) => new Date(Date.now() - min * 60000).toISOString(); /* como las devuelve la base: 2026-11-18T17:41:22.123Z */
      const tAg = t(95), tInt = t(140), tReg = t(60 * 24 * 2);
      c.intentos = [{ fecha: tInt, medio: 'Llamada', resultado: 'Contestó', obs: 'Acepta la visita del jueves', by: 'Andrea Salazar', destino: { tipo: 'coordinacion', nombre: cli, numero: ct.cel || '0990000012', relacion: '' }, duracionSeg: 64 }];
      X.eventos = X.eventos || {}; X.eventos['50012'] = [{ hora: tAg, accion: 'Visita agendada', detalle: 'V1 · PRB1212 · Mauricio Endara', actor: 'Andrea Salazar', rol: 'Coordinador de inspecciones' },
        { hora: tInt, accion: 'Intento de contacto', detalle: 'Llamada · Contestó · a ' + cli, actor: 'Andrea Salazar', rol: 'Coordinador de inspecciones' },
        { hora: tReg, accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }];
      X.notificacionesEnvio = [n('ENV-5821', 'R05', mail, cli, 'Cliente', 'Enviado', 'Tu inspección está agendada', 'visita_confirmada', '00:00', { fecha: tAg, enviadoEn: tAg, intentos: 1 }),
        n('ENV-5822', 'R05', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Enviado', 'Visita agendada · caso 50012', 'visita_confirmada', '00:00', { fecha: tAg, enviadoEn: tAg, intentos: 1 })];
      X.horaReal = { agendada: tAg, intento: tInt }; }
    // N-2c · plantillapublicada: la configuración se guarda por versiones (publicar_configuracion crea una vigente nueva; configuracion_vigente la devuelve).
    // La base simulada la guarda en sessionStorage para que sobreviva a la recarga de la página; al entrar, la vigente se aplica a SIRIUS_NOTIFICACIONES (como el cargador real).
    if (escena === 'plantillapublicada') { const N = window.SIRIUS_NOTIFICACIONES; let c = leerCfg();
      if (!c && N) { const d0 = JSON.parse(JSON.stringify(N)); delete d0.cola; delete d0.colaEjemplo; c = { version: 3, fecha: iso(60 * 24 * 2), por: 'Andrea Salazar', datos: d0, versiones: [{ version: 3, fecha: iso(60 * 24 * 2), por: 'Andrea Salazar', motivo: 'Versión inicial de la prueba' }] }; guardarCfg(c); }
      X.configuracion = { SIRIUS_NOTIFICACIONES: c }; if (N && c && c.datos) Object.keys(c.datos).forEach((k) => { if (typeof N[k] !== 'function') N[k] = JSON.parse(JSON.stringify(c.datos[k])); });
      if (N) { N.__version = c.version; N.__fecha = c.fecha; N.__por = c.por; } }
    // N-2c · bitacoraorden: correos y «Simulado» (WhatsApp, SMS, En SIRIUS) con horas reales, desordenados como llegan de la base.
    if (escena === 'bitacoraorden' || escena === 'bitacoratardia') { X.notificacionesEnvio = [
      n('ENV-5901', 'R05', mail, cli, 'Cliente', 'Enviado', 'Tu inspección está agendada', 'visita_confirmada', '', { fecha: iso(240), enviadoEn: iso(239), intentos: 1 }),
      n('ENV-5902', 'R05', ct.cel || '0990000012', cli, 'Cliente', 'Pendiente', 'Visita agendada por WhatsApp', 'visita_confirmada', '', { canal: 'whatsapp', simulado: true, fecha: iso(240) }),
      n('ENV-5903', 'R19', mail, cli, 'Cliente', 'Enviado', 'Agenda la inspección de tu caso 50012', 'enlace_autoagendamiento', '', { fecha: iso(30), enviadoEn: iso(29), intentos: 1 }),
      n('ENV-5904', 'R04', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Fallido', 'Caso 50012: garantías vencidas', 'gar_vencidas', '', { fecha: iso(600), error: 'Buzón lleno (552 5.2.2)', intentos: 1 }),
      n('ENV-5905', 'R19', ct.cel || '0990000012', cli, 'Cliente', 'Simulado', 'Enlace de autoagendamiento por SMS', 'enlace_autoagendamiento', '', { canal: 'sms', simulado: true, fecha: iso(30) }),
      n('ENV-5906', 'R23', 'lucia.vera@austrobrokers.ec', 'Lucía Vera', 'Bróker (APS)', 'Enviado', 'Caso 50012: se canceló la solicitud de PRB1213', 'solicitud_cancelada', '', { fecha: iso(5), enviadoEn: iso(4), intentos: 1 }),
      n('ENV-5907', 'R04', 'Ricardo Almeida', 'Ricardo Almeida', 'Ejecutivo de inspecciones', 'Enviado', 'Caso 50012: garantías vencidas.', 'gar_vencidas', '', { canal: 'app', simulado: true, fecha: iso(600), enviadoEn: iso(599), intentos: 1 }),
      n('ENV-5908', 'R05', 'santiago.ortiz@asur.ec', 'Santiago Ortiz', 'Ejecutivo comercial', 'Pendiente', 'Visita agendada · caso 50012', 'visita_confirmada', '', { fecha: iso(1) })]; }
    if (escena === 'casoporenlace' || escena === 'botondestino' || escena === 'vistapreviabase') X.notificacionesEnvio = [];
    // N-2c · botondestino: 30031 (autoinspección con enlace vigente) y 50012 (sin enlace activo) para ver el botón con y sin dirección.
    if (escena === 'botondestino') { const c1 = (X.casos || []).find((x) => String(x.id) === '30031'), v1 = c1 && (c1.visitasBase || [])[0]; if (v1 && v1.enlace) { v1.estado = 'Enlace enviado'; v1.enlace.estado = 'Vigente'; } }
    if (escena === 'botondestino' || escena === 'vistapreviabase' || escena === 'vercorreobase' || escena === 'campanaavisos' || escena === 'campanavacia') { const X2 = prevSim('cxestadoparcial'), c2 = (X2.casos || []).find((x) => String(x.id) === '50012'); if (c2 && !(X.casos || []).some((x) => String(x.id) === '50012')) { X.casos = (X.casos || []).concat([c2]); ['detalles', 'eventos', 'evidencias', 'controles', 'informes', 'calificaciones'].forEach((k) => { X[k] = X[k] || {}; if (X2[k] && X2[k]['50012'] !== undefined) X[k]['50012'] = X2[k]['50012']; }); X.inspectores = (X.inspectores || []).concat((X2.inspectores || []).filter((i) => !(X.inspectores || []).some((j) => j.nombre === i.nombre))); } }
    // N-2d · DEC-258: la base arma el correo con su propio contexto. enlacesBase = enlace activo del cliente por caso (50013 tiene uno; 50012 no); contextoEjemplo = lo que la base
    // sabe de la visita de ese caso. contextosNotif = el contexto guardado de cada notificación (notificacionContexto), igual al que se usó al encolarla.
    if (escena === 'vistapreviabase' || escena === 'vercorreobase') { X.usuario = clon(ADM);
      X.enlacesBase = { '50013': { url: 'https://clientes.asur.ec/caso/50013?token=PC-50013-X7K2', vence: iso(-60 * 24 * 6) } };
      X.contextoEjemplo = { '50013': { visita: { fecha: '22/10/26', franja: '09:00 y 10:00', modalidad: 'Presencial', inspector: 'Diana Cárdenas', direccion: 'Av. de los Shyris y Naciones, Quito' } } };
      if (escena === 'vistapreviabase') X.notificacionesEnvio = [];
      if (escena === 'vercorreobase') { const mk = (id, caso, nombre, correo, estado, asunto, min, extra) => Object.assign({ id, caso, regla: 'R05', canal: 'correo', destinatario: correo, destinatarioNombre: nombre, rolDestino: 'Cliente', estado, asunto, plantilla: 'visita_confirmada', contenido: '', fecha: iso(min), error: '', simulado: false, requiereAprobacion: false, aprobadoPor: null, aprobadoEn: null, intentos: 0 }, extra || {});
        X.notificacionesEnvio = [mk('ENV-6001', '50013', 'Mónica Andrade', 'monica.andrade@correo.ec', 'Pendiente', 'No 50013 · Tu inspección está agendada para el 22/10/26', 3),
          mk('ENV-6002', '50012', 'Fernanda Prueba', 'flota.50012@prueba.sirius.ec', 'Enviado', 'No 50012 · Tu inspección está agendada para el 19/10/26', 40, { enviadoEn: iso(39), intentos: 1 }),
          mk('ENV-6003', '50013', 'Mónica Andrade', 'monica.andrade@correo.ec', 'Pendiente', 'No 50013 · Tu inspección está agendada para el 22/10/26', 8)];
        X.contextosNotif = { 'ENV-6003': { error: '{"code":"P0001","details":null,"hint":null,"message":"El contexto de la notificación ENV-6003 ya no está disponible"}' } }; } }
    // N-1c · DEC-259 (SQL 61): avisos del canal App. La base deja un aviso por destinatario que es usuario de SIRIUS; la bitácora tiene su fila (canal app) con estado Entregado o Leído.
    if (escena === 'campanaavisos' || escena === 'campanavacia') { X.usuario = clon(ADM);
      if (escena === 'campanavacia') { X.avisos = []; X.notificacionesEnvio = []; }
      else { const av = (id, caso, regla, titulo, texto, min, leido) => ({ id, caso, regla, titulo, texto, fecha: iso(min), leido: !!leido, rol: 'Administrador' });
        X.avisos = [av('AV-7001', '50013', 'R09', 'Caso 50013 devuelto al inspector', 'Mauricio Endara debe corregir el informe: faltan las fotos de la fachada y del tablero eléctrico.', 12, false),
          av('AV-7002', '50012', 'R17', 'Solicitud del cliente desde el portal · caso 50012', 'Fernanda Prueba pidió cambiar la fecha de la visita del 19/10.', 35, false),
          av('AV-7003', '50013', 'R11', 'Ampliación de plazo · caso 50013', 'El cliente pidió 5 días más para cumplir las garantías: la solicitud espera tu respuesta.', 60 * 5, true)];
        const fila = (a, i, estado) => ({ id: 'ENV-710' + (i + 1), caso: a.caso, regla: a.regla, canal: 'app', destinatario: 'andrea.salazar', destinatarioNombre: 'Andrea Salazar', rolDestino: 'Administrador', estado, asunto: a.titulo, plantilla: '', contenido: a.texto, fecha: a.fecha, enviadoEn: a.fecha, error: '', simulado: false, requiereAprobacion: false, aprobadoPor: null, aprobadoEn: null, intentos: 1, aviso: a.id });
        X.notificacionesEnvio = X.avisos.map((a, i) => fila(a, i, a.leido ? 'Leído' : 'Entregado')); } }
    // N-1d · bitacoratardia: la conexión está activa pero notificacionesEnvio todavía no llegó (como en GitHub con la base). Las filas de bitacoraorden quedan en X.__tardia y
    // el Back-office las entrega 1,5 s después del primer dibujo con una lista nueva (X.notificacionesEnvio = [...]); la Bitácora debe pasar de vacía a mostrar las filas sin recargar.
    if (escena === 'bitacoratardia') { X.usuario = clon(ADM); X.__tardia = X.notificacionesEnvio; delete X.notificacionesEnvio; }
    return X; };
  // ---------- N-2e: almacén público «correo» de Supabase (SQL 64) ----------
  // subirImagenCorreo(archivo, nombre) → Promise de { ok, mensaje, url, ruta }. Ver: todos; subir: solo el Administrador; PNG, JPG, GIF o WebP hasta 2 MB. La base simulada guarda lo que se sube en memoria
  // (X.imagenesSim[url] = data URL) para que la pantalla lo muestre; la base real devuelve una dirección pública de Supabase. La escena plantillaimagenerror responde { ok: false, mensaje: 'La imagen pesa más de 2 MB' }.
  CC.subirImagenCorreo = function (X, archivo, nombre) { let esc = ''; try { esc = new URLSearchParams(location.search).get('escena') || ''; } catch (er) { /* nada */ }
    try { window.__sirImgUltima = (window.__sirImgUltima || []).concat([{ nombre: nombre || (archivo && archivo.name) || '', tipo: archivo && archivo.type, bytes: archivo && archivo.size }]); } catch (er) { /* registro de prueba */ }
    const rol = window.__sirRolActivo || (X.usuario || {}).rol || ''; if (rol && rol !== 'Administrador') return Promise.resolve({ ok: false, mensaje: 'Solo el Administrador sube imágenes' });
    if (esc === 'plantillaimagenerror') return new Promise((ok) => setTimeout(() => ok({ ok: false, mensaje: 'La imagen pesa más de 2 MB' }), 900));
    if (!archivo || ['image/png', 'image/jpeg', 'image/gif', 'image/webp'].indexOf(archivo.type) < 0) return Promise.resolve({ ok: false, mensaje: 'Solo se aceptan imágenes PNG, JPG, GIF o WebP' });
    if (archivo.size > 2 * 1048576) return Promise.resolve({ ok: false, mensaje: 'La imagen pesa más de 2 MB' });
    return new Promise((ok) => { const rd = new FileReader(); rd.onerror = () => ok({ ok: false, mensaje: 'No se pudo leer la imagen' });
      rd.onload = () => { const limpio = String(nombre || archivo.name || 'imagen').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'imagen', ruta = Date.now() + '-' + limpio, url = 'https://sirius-sim.supabase.co/storage/v1/object/public/correo/' + ruta;
        X.imagenesSim = X.imagenesSim || {}; X.imagenesSim[url] = rd.result; setTimeout(() => ok({ ok: true, mensaje: 'Imagen subida', url, ruta }), 1200); }; rd.readAsDataURL(archivo); }); }; // la demora deja ver «Subiendo…»
  CC.cxSim = function (escena) { return ESC.indexOf(escena) >= 0 ? datos(escena) : prevSim(escena); };
  const TIPOS = ['aprobarNotificacion', 'rechazarNotificacion', 'reenviarNotificacion', 'enviarNotificacionesAhora', 'enviarPruebaNotificacion', 'configurarEnvioNotificaciones'];
  CC.aplicar = function (X, tipo, d) {
    // N-2c: publicar_configuracion de la base simulada (solo si la escena trae configuracion): la versión debe ser mayor que la vigente; la nueva queda vigente.
    if (tipo === 'publicarConfiguracion' && X && X.configuracion && d && d.clave === 'SIRIUS_NOTIFICACIONES') { const c = X.configuracion[d.clave] || { version: 0 }, v = Number(d.version);
      if (!(v > Number(c.version || 0))) return { ok: false, mensaje: 'La versión ' + v + ' no es mayor que la vigente (' + c.version + '): vuelve a abrir la plantilla para trabajar sobre la vigente' };
      const nueva = { version: v, fecha: iso(0), por: (X.usuario || {}).nombre || '', datos: JSON.parse(JSON.stringify(d.datos || {})), versiones: [{ version: v, fecha: iso(0), por: (X.usuario || {}).nombre || '', motivo: d.motivo || '' }].concat(c.versiones || []) };
      X.configuracion[d.clave] = nueva; guardarCfg(nueva); try { window.__sirNcUltima = (window.__sirNcUltima || []).concat([{ tipo, datos: { clave: d.clave, version: v, motivo: d.motivo } }]); } catch (e) { /* nada */ }
      return { ok: true, mensaje: 'Versión ' + v + ' publicada y vigente', version: v, fecha: nueva.fecha }; }
    // N-1c · SQL 61: marcarAvisoLeido { ids } y marcarAvisosLeidos {} → { ok, mensaje, leidos }; marca el aviso y la fila de la bitácora (canal app) como «Leído».
    if ((tipo === 'marcarAvisoLeido' || tipo === 'marcarAvisosLeidos') && X && Array.isArray(X.avisos)) { try { window.__sirNcUltima = (window.__sirNcUltima || []).concat([clon({ tipo, datos: d || {} })]); } catch (er) { /* registro de prueba */ }
      if (tipo === 'marcarAvisoLeido' && !(d && Array.isArray(d.ids) && d.ids.length)) return { ok: false, mensaje: 'Falta el aviso que se marca como leído' };
      const set = {}; ((d && d.ids) || []).forEach((i) => { set[String(i)] = true; }); let c = 0;
      let pas = false; try { pas = new URLSearchParams(location.search).get('cxpasivo') === '1'; } catch (er) { /* nada */ } // ?cxpasivo=1: la base responde pero no cambia sus listas hasta que se vuelven a leer (como una conexión real sin recargar)
      X.avisos.forEach((a) => { if (!a.leido && (tipo === 'marcarAvisosLeidos' || set[String(a.id)])) { if (!pas) a.leido = true; c++; } });
      if (!pas) (X.notificacionesEnvio || []).forEach((n) => { if (n.canal === 'app' && n.estado !== 'Leído' && n.aviso && (tipo === 'marcarAvisosLeidos' || set[String(n.aviso)])) n.estado = 'Leído'; });
      return { ok: true, mensaje: c === 1 ? '1 aviso marcado como leído' : c + ' avisos marcados como leídos', leidos: c }; }
    if (TIPOS.indexOf(tipo) < 0 || !X || !Array.isArray(X.notificacionesEnvio)) return prevAp ? prevAp(X, tipo, d) : null;
    try { window.__sirNcUltima = (window.__sirNcUltima || []).concat([clon({ tipo, datos: d || {} })]); } catch (er) { /* registro de prueba */ }
    const act = !X.envio || X.envio.activo !== false, rol = window.__sirRolActivo || (X.usuario || {}).rol || '';
    // SQL 59: configurarEnvioNotificaciones { activo, motivo } → { ok, mensaje, activo } (solo el Administrador, con motivo).
    if (tipo === 'configurarEnvioNotificaciones') { if (rol !== 'Administrador') return { ok: false, mensaje: 'Solo el Administrador cambia el envío de notificaciones' }; if (String((d || {}).motivo || '').trim().length < 10) return { ok: false, mensaje: 'Escribe el motivo (al menos 10 caracteres)' };
      X.envio = { activo: !!d.activo, cambio: { por: (X.usuario || {}).nombre || '', fecha: (window.SiriusNotifCola || { ahoraIso: () => '' }).ahoraIso(), motivo: d.motivo } }; return { ok: true, mensaje: 'Notificaciones ' + (d.activo ? 'encendidas: los correos nuevos salen solos' : 'apagadas: los correos nuevos quedan «Simulado»'), activo: !!d.activo }; }
    // SQL 59: enviarPruebaNotificacion { plantilla, caso, destinatario?, destinatarioNombre?, asunto? } → la prueba entra a la cola («Pendiente»; «Simulado» si están apagadas).
    if (tipo === 'enviarPruebaNotificacion') { d = d || {}; if (!d.plantilla) return { ok: false, mensaje: 'Falta la plantilla' }; const u = X.usuario || {}, L = X.notificacionesEnvio, id = 'ENV-P' + String(L.length + 1).padStart(3, '0');
      const fila = { id, caso: String(d.caso || ''), regla: '', canal: 'correo', destinatario: d.destinatario || u.email || '', destinatarioNombre: d.destinatarioNombre || u.nombre || '', rolDestino: 'Prueba', estado: act ? 'Pendiente' : 'Simulado', asunto: d.asunto || '[Prueba]', plantilla: d.plantilla, contenido: '', fecha: (window.SiriusNotifCola || { ahoraIso: () => '' }).ahoraIso(), error: '', simulado: false, requiereAprobacion: false, aprobadoPor: null, aprobadoEn: null, intentos: 0 };
      L.unshift(fila); const N0 = window.SIRIUS_NOTIFICACIONES, cx = ctxCaso(X, fila.caso, fila.plantilla, null); if (cx) { X.contextosNotif = X.contextosNotif || {}; X.contextosNotif[id] = { contexto: cx, asunto: fila.asunto, plantilla: N0 && N0.plantilla ? clon(N0.plantilla(fila.plantilla)) : fila.plantilla }; } /* N-2d: la prueba llega como la recibe el destinatario de la regla */
      return { ok: true, mensaje: 'Prueba en la cola: «' + fila.estado + '»', id, estado: fila.estado, notificacion: clon(fila) }; }
    const NC = window.SiriusNotifCola; if (!NC) return { ok: false, mensaje: 'Sin el módulo de la cola' };
    const u = X.usuario || {}, r = NC.ops(X.notificacionesEnvio, tipo, clon(d || {}), { por: u.nombre || '', rol: rol, fecha: NC.ahoraIso() });
    return r; };
  // ---------- N-2d · DEC-258: la base simulada entrega el contexto con que arma el correo ----------
  const z2 = (n) => String(n).padStart(2, '0'), fd = (t) => { const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(t || '')); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) : ''; }, hm = (t) => { const m = /[T ](\d{2}:\d{2})/.exec(String(t || '')); return m ? m[1] : ''; };
  const ctxCaso = (X, caso, plantilla, n) => { caso = String(caso || ''); const c = (X.casos || []).find((x) => String(x.id) === caso); if (!c) return null;
    const ct = c.contacto || {}, vb = (c.visitasBase || []).filter((v) => v.estado !== 'Cancelada'), v0 = vb.find((v) => v.inicio || v.fecha) || vb[0] || null, ej = ((X.contextoEjemplo || {})[caso]) || {};
    const act = (X.enlacesBase || {})[caso] || (() => { const v = vb.find((y) => y.enlace && y.enlace.estado === 'Vigente' && y.enlace.url); return v ? { url: v.enlace.url, vence: v.enlace.vence, tipo: v.enlace.tipo } : null; })();
    const venc = act ? (/^\d{4}-/.test(String(act.vence || '')) ? fd(act.vence) + ' · ' + hm(act.vence) : String(act.vence || '')) : '';
    const dom = 'https://clientes.asur.ec/', bo = 'https://sirius.asur.ec/SiriusBackoffice/';
    const visita = v0 ? { fecha: fd(v0.inicio || v0.fecha), franja: hm(v0.inicio || v0.fecha) + (hm(v0.fin) ? ' y ' + hm(v0.fin) : ''), modalidad: v0.modalidad || '', inspector: v0.inspector || '', direccion: v0.direccion || '' } : {};
    const NC = window.SiriusNotifCola, rol = n && n.rolDestino && n.rolDestino !== 'Prueba' ? n.rolDestino : (NC && NC.rolDe ? NC.rolDe(plantilla) : 'Asegurado o contacto'), ext = /asegurado|cliente|contacto|bróker|broker/i.test(rol);
    const dest = n && n.rolDestino && n.rolDestino !== 'Prueba' ? { nombre: n.destinatarioNombre || '', rol: n.rolDestino, sinDestino: !!(NC && NC.sinDestinatario && NC.sinDestinatario(n)) } : { nombre: ext ? (ct.nombre || '') : (c.responsable || ''), rol, sinDestino: false };
    return clon({ caso: { numero: caso, estado: c.estado || '', ramo: c.ramo || '', sucursal: c.sucursal || '', tipo: c.tipoRiesgo || '', enlace: bo + '?caso=' + caso }, asegurado: { nombre: c.asegurado || '', correo: ct.correo || '', celular: ct.cel || '' }, contacto: { nombre: ct.nombre || '', celular: ct.cel || '', correo: ct.correo || '' },
      visita: Object.assign(visita, ej.visita || {}), garantias: {}, tablas: { visitas: [Object.assign({ fecha: visita.fecha || '', franja: visita.franja || '', modalidad: visita.modalidad || '', inspector: visita.inspector || '', direccion: visita.direccion || '' }, ej.visita || {})].filter((r) => r.fecha) },
      enlace: { url: act ? act.url : '', vence: venc }, enlaces: { autoagendamiento: act && /autoagend/i.test(act.tipo || '') ? act.url : '', autoinspeccion: act && /autoinsp/i.test(act.tipo || '') ? act.url : '', caso: bo + '?caso=' + caso, portal: dom + 'caso/' + caso, backoffice: bo },
      compania: { nombre: 'Aseguradora del Sur' }, destinatario: dest }); };
  const falla = (X) => { try { return new URLSearchParams(location.search).get('cxctx'); } catch (e) { return ''; } }; // ?cxctx=error: la base responde con el JSON crudo de un error; ?cxctx=sin: no tiene datos del caso
  CC.contextoNotificacion = function (X, caso, plantilla) { const f = falla(); if (f === 'error') return Promise.reject(new Error('{"code":"P0001","details":null,"hint":null,"message":"No se pudo armar el contexto del caso ' + caso + '"}')); if (f === 'sin') return Promise.resolve(null);
    return new Promise((ok) => setTimeout(() => ok(ctxCaso(X, caso, plantilla || '', null)), 350)); }; // la demora deja ver «Cargando los datos del caso…»
  CC.notificacionContexto = function (X, id) { const g = (X.contextosNotif || {})[id], N = window.SIRIUS_NOTIFICACIONES;
    if (g && g.error) return Promise.reject(new Error(g.error)); if (g) return Promise.resolve(clon(g));
    const n = (X.notificacionesEnvio || []).find((x) => x.id === id); if (!n || n.canal !== 'correo') return Promise.resolve(null); const ctx = ctxCaso(X, n.caso, n.plantilla, n); if (!ctx) return Promise.resolve(null);
    return new Promise((ok) => setTimeout(() => ok({ contexto: ctx, asunto: n.asunto, plantilla: N && N.plantilla ? clon(N.plantilla(n.plantilla)) : n.plantilla }), 250)); };
  CC.cxNotif = { escenas: ESC };
})();
