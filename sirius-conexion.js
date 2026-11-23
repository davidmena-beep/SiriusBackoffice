// SIRIUS · conexión real de la prueba de concepto (fase P · P-6a) · reemplaza al archivo mínimo del artifact.
// Con una sesión iniciada en index.html, el back-office trabaja con la base de datos (Supabase); sin sesión, en modo demostración.
// Usa la API REST de Supabase directamente (sin bibliotecas) y respeta el contrato SIRIUS_CONEXION del artifact (Etapa P-6a).
// 11/11/2026 · Observación 9 (la v5 publicada volvía a la v4): lo publicado desde Administración (origen «Administración») manda siempre sobre el
// archivo de datos; SIRIUS_FORMULARIOS (Formularios) y SIRIUS_CATALOGOS (catálogos de SIRIUS_EJEMPLO) se aplican al leer la base y al publicar;
// SIRIUS_CONTROLES se vigila como las demás claves. Evento «sirius-configuracion» { clave } cada vez que cambia la configuración aplicada.
// 11/11/2026 · C2-16: cada evidencia trae id, estado, motivo y observación (SQL 22) para confirmar o excluir fotos desde el back-office.
// 11/11/2026 · DEC-198: cada control trae vistoEn y vistoPor (SQL 24); la acción «verControles» { caso, comentario } los marca como vistos.
// 12/11/2026 · P-6e-3: casos[].visitasBase = [{ n, modalidad, estado, inicio, fin, agendadoEn, origen, inspector, enlace: { tipo, estado, vence, url }, enlaces }] (todas las visitas de la base).
// 12/11/2026 · P-6e-2: informes[].responsable { tipo, agencia, usuario, regla, asignadoEn } (SQL 32); evidencias con tipoArchivo (foto, video, documento) y canal «Autoinspección».
// 12/11/2026 · P-6e: cada caso trae formularios[], carrocerias[], anios[] y sumaAsegurada (de sus riesgos) para elegir la plantilla y aplicar los criterios.
// 12/11/2026 · C2-21: casos con registrado (fecha de creación en la base) y visita { estado, inicio, fin, agendadoEn, origen, llegada… }; informes con plantillaClave y plantillaVersion (vacía si la app no envió un número, p. ej. «local»).
// 16/11/2026 · P-6g · SQL 53b: los honorarios se leen con liq_honorarios() (con caso, asegurado, línea, sucursal, ramo y placa aunque el usuario no vea los casos); si la base no la tiene, se leen de la tabla.
// 19/11/2026 · SQL 65: visitas.riesgos_en_curso: en Riesgos, un vehículo con fotos de autoinspección queda «En curso».
// 19/11/2026 · SQL 64: subirImagenCorreo(archivo, nombre) → { ok, url } en el almacén público «correo».
// 19/11/2026 · SQL 62: CX.usuarios trae sucursal, modalidades, ramos, recibeOfertas y jornada (todos los campos de la ficha única).
// 19/11/2026 · N-1c · SQL 61: SIRIUS_CONEXION.avisos[] = { id, caso, regla, titulo, texto, fecha, leido, rol } (canal App del usuario actual); acciones marcarAvisoLeido { ids } y marcarAvisosLeidos {}.
// 19/11/2026 · N-2d: contextoNotificacion(caso, plantilla) y notificacionContexto(id) para la vista previa y «Ver correo»; salir() conserva ?caso.
// 19/11/2026 · Configuración publicada escrita dentro del objeto de cada archivo de datos (las funciones de ayuda del archivo ven lo publicado).
// 18/11/2026 · N-2c: SIRIUS_CONEXION.configuracion = { clave: { version, fecha, por, datos } } (versión vigente de cada configuración).
// 18/11/2026 · N-2c: SIRIUS_CONEXION.usuario.correo (igual a email), para «Enviar prueba a mi correo».
// 18/11/2026 · N-1 · SQL 58: la bitácora de notificaciones trae la cola real (asunto, rol, aprobación, intentos; estados Pendiente, Por aprobar, Enviado, Fallido, Rechazado) y «Enviar ahora» llama a la función sirius-notificar.
// 18/11/2026 · U-1: al crear, reinvitar o cambiar el correo de un invitado, la invitación sale por correo con la función sirius-invitar (el mensaje dice si salió; si no, se copia el enlace como antes).
// 17/11/2026 · P-6g-2 · SQL 55: SIRIUS_CONEXION.garantias[] y .notificacionesEnvio[] con el contrato de SiriusGarantiasBase (sin el SQL 55, quedan sin definir y siguen los datos de demostración).
// 16/11/2026 · P-6g · Corrección: SIRIUS_CONEXION.usuario con agenciaRuc, identificacion y tipo (Liquidaciones reconoce al proveedor: Finanzas de agencia o independiente).
// 16/11/2026 · P-6g · SQL 53: SIRIUS_CONEXION.honorarios[], .liquidaciones[] y .facturas[] con el contrato de SiriusLiqProceso (si la base aún no tiene el SQL 53, quedan sin definir y el módulo sigue en demostración).
// 16/11/2026 · DEC-246 (SQL 52): un vehículo enviado desde la app queda «Inspeccionado» aunque su visita siga en curso (visitas.riesgos_enviados).
// 15/11/2026 · P-6f-b · DEC-214 (SQL 51): usuarios[] e inspectores[] con tipoIdentificacion, identificacion y agenciaRuc; agencias[] con ruc, razonSocial y nombreComercial (si la base aún no tiene el SQL 51, se lee como antes).
// 15/11/2026 · R-0 · DEC-245 (SQL 47): riesgos[] con tipoConfirmado, plantilla, tipoAnterior, noInspeccionado y revisarDatos; visitasBase[] con motivoCierre y noInspeccionados; evidencias e informes con su riesgo («50012-V1»).
// 15/11/2026 · Corrección: el estado de cada riesgo sale de sus visitas también con el caso «En curso» (DEC-239).
// 15/11/2026 · Corrección: el riesgo de una visita realizada (Enviada o Terminada) queda «Inspeccionado», no «Por coordinar».
// 15/11/2026 · G-2c8 · DEC-238: casos[].riesgos[].estado (coordinación) y .visita { n, estado, inicio, inspector }; el estado y subestado del caso los calcula la base (SQL 41).
// 15/11/2026 · Corrección: el responsable del caso es siempre texto y sale solo de la base; sin responsable en la base, el prototipo usa la regla del flujo (G-2c5 lo protege si llega un objeto).
// 14/11/2026 · G-2c3/G-2c4: casos[].cancelacion; la búsqueda de direcciones es en todo el Ecuador (la ciudad solo da preferencia).
// 14/11/2026 · G-2c2 · DEC-237: visitasBase[].oferta (ofertas abiertas del Coordinador: inspectores, desde, hasta, minutos, nota, vence); ofertarVisita y anularOferta van por bo_accion (SQL 39).
// 22/11/2026 · P-1f: los riesgos de cada caso se ordenan como la base (creado, descripción) antes de numerarlos («V1», «V2»): sin orden, se podían cruzar.
// 22/11/2026 · P-1c5b: calificaciones[caso][].riesgoId = la referencia del vehículo («50046-V1»), como en evidencias e informes.
// 22/11/2026 · P-1c5b: informes[caso][].decision.hora y .criterio.hora llegan convertidas a la hora de Ecuador (antes, en UTC dentro del objeto).
// 22/11/2026 · P-1c3: casos[].riesgosBase[] trae id (referencia «50047-V1»), estado y riesgo_estado de cada riesgo (también con un solo vehículo, donde
//   casos[].riesgos no existe); casos[].riesgos[] (varios vehículos) trae además riesgo_estado { estado, corta, badge, fase, veredicto }.
// 22/11/2026 · P-1b · SQL 81: evidencias[caso][].disp (dispositivo) y .precision (± m del GPS), desde evidencias.meta (las apps los envían).
//   documentoRegistrar({ caso, riesgo, documento: 'veh-informe' | 'veh-resumen', version, huella }) → { ok, codigo, mostrar ('IV-20196-V1-8F3A21C4'),
//   generadoEn, por, estado, veredicto } (el estado y el veredicto al generar los pone la base); documentoValidar(codigo) → { ok, documento, caso,
//   vehiculo, estado, veredicto, version, huella, generadoEn, por }.
// 22/11/2026 · SQL 80 · DEC-271: riesgos[].riesgo_estado = { estado, corta, badge, fase, veredicto, informe } (reemplaza a riesgo_enviado). Con informe,
//   el estado de cada vehículo sale de la base (Informe por completar … Inspeccionado); sin informe, la regla de coordinación de siempre.
// (histórico) SQL 79: riesgos[].riesgo_enviado (enviado en cualquier visita del caso, con su informe en trabajo): el estado de cada vehículo
//   («Inspeccionado») ya no queda en «Enlace enviado» cuando la visita abierta lo vuelve a incluir. Sin el SQL 79, la consulta de respaldo.
// 21/11/2026 · A · SQL 77: visitas[].avance = { fotos, total (suma de los vehículos), video, ultimo, paso, pasoNombre,
//   vehiculos: [{ ref, fotos, total, enviado, ultimo, paso, pasoNombre }] } — siempre por vehículo, como la app del cliente: lo que ese vehículo
//   ya subió en el caso cuenta una vez por paso (también de una visita anterior), sin el video; total = el que ve el cliente (o la estimación).
// 21/11/2026 · R-5c · SQL 76 · DEC-266: la Red es la única fuente. usuarios[] e inspectores[] ya no traen zonas, cobertura (forma de un solo modo),
//   modalidades, ramos, recibeOfertas ni jornada desde la ficha (usuarios.datos): coberturaFilas, coberturaMixta, jornada, recibeOfertas,
//   capacidadDia, modalidades y ramos salen solo de SIRIUS_CONEXION.red (ponerRedEnUsuarios). Sin fila en la Red, esos campos no vienen.
// 21/11/2026 · R-3b · SQL 75 · DEC-265: SIRIUS_CONEXION.redLugar(datos) → red_lugar (solo lectura, permiso de la Red) → { ok, mensaje? , … }:
//   { vista: 'ciudad', ciudad } → { ciudad, ciudadNombre, sucursal, radio, zonas[{ id, nombre, punto, area, inmediata[], red[], coordinacion[], propios[{ nombre, tipo, inmediata, red }], alerta, alertaTipo }],
//     porConfirmar{ inmediata[], red[], redAmpliada, coordinacion[] }, todaCiudad[{ nombre, tipo, nivel, inmediata, red }], porSucursal[…], resumen{ zonas, inmediata, red, coordinacion,
//     inspectores, zonasSinPropios, zonasSinInspectores }, inmediata[], red[], coordinacion[], alerta, alertaTipo ('error'|'aviso') };
//   { vista: 'sucursales' } → { sucursales[{ sucursal, ciudad, ciudadNombre, porSucursal[], todaCiudad[], porZonas, zonas, inmediata, red, coordinacion, inspectores, alerta, alertaTipo }], todas[{ nombre, tipo }] };
//   { vista: 'probar', lugar: { ciudad | ciudadNombre, punto?, direccion? }, sucursal? } → { lugar (zona calculada), sucursal, inmediata[{ nombre, tipo, nivel }], red[…], redAmpliada, mensaje }.
//   Sale de las mismas funciones del portal: lo que muestra la Red es lo que ofrece el portal.
// 21/11/2026 · G-4c · SQL 74: visitasBase[] con canceladoPor, canceladoEn y avance { fotos, total, ultimo, paso }; enlaces[] con canal, canales y enviadoEn (un registro por canal).
// 20/11/2026 · S-1a · SQL 72: casos[] con prov, canton, dir, correoAps, tipoSolicitud, fechaSolicitud, aseguradoDatos y solicitante (solicitud completa); accion('editarSolicitud', { caso, cambios, motivo }).
// 20/11/2026 · DEC-263 (B): consentimiento de WhatsApp, SMS y correo dado por otorgado en los casos de la base (solo prueba; brecha LOPDP para Citytech).
// 20/11/2026 · R-2 · DEC-262: SIRIUS_CONEXION.red (Red de inspectores, SQL 68) = { listo, puedeGestionar, hoy, inspectores: [{ nombre, tipo, tipoInspector, agencia, estado, cuenta,
//   operacion: { modalidades, ramos, recibeOfertas ('red'|'coord'|'no'), jornada: { dias, desde, hasta }, capacidadDia, fuente, actualizado },
//   cobertura: [{ id, nivel ('todas'|'sucursal'|'ciudad'|'zona'), sucursal, ciudad, zona, desde, hasta, vigente, origen, motivo, creado, creadoPor }],
//   bloqueos: [{ id, desde, hasta, motivo, origen }] }], historial: [{ inspector, accion, detalle, motivo, por, hora }] } (null si la base no tiene el SQL 68)
//   y SIRIUS_CONEXION.redAccion(tipo, datos) → red_accion (asignar, retirar, operacion, bloquear, desbloquear) → { ok, mensaje }.
//   usuarios[] e inspectores[] reciben coberturaFilas (vigentes), coberturaMixta y, desde el perfil, jornada, recibeOfertas, capacidadDia
//   (y modalidades y ramos si tienen). Desde R-5c ya no se arma la cobertura de un solo modo.
// 19/11/2026 · G-3b · DEC-224: visitasBase[].oferta incluye la oferta dirigida que pidió el cliente desde el portal (origen 'Cliente', SQL 46), con porCliente: true.
// 14/11/2026 · G-2c · DEC-222 y DEC-225: visitasBase[].lugar y visitasBase[].fueraCobertura (SQL 38 guarda lo que envía agendarVisita).
// 14/11/2026 · G-2a2 · DEC-222: SIRIUS_CONEXION.buscarDireccion(texto, codCiudad) con OpenStreetMap (Nominatim): espera al teclear, 1 consulta por segundo, memoria de búsquedas y respaldo en el diccionario de prueba.
// 14/11/2026 · G-2b · DEC-223: usuarios[].cobertura e inspectores[].cobertura (datos.cobertura; SQL 37 la guarda con editarUsuario y crearUsuario).
// 14/11/2026 · G-2a · DEC-221: SIRIUS_ZONAS (Ciudades y zonas) se vigila: lo publicado en la base manda sobre datos-zonas.js.
// 14/11/2026 · P-6f-0g · DEC-233: SIRIUS_CONEXION.usuarios (con vinculado e historial de la base) y agencias; crearUsuario, editarUsuario y cambiarEstadoUsuario van por bo_accion (SQL 36d).
// 14/11/2026 · P-6f-0f · DEC-232: riesgos con label (placa), detalle («Marca, Modelo, Año») y nowrap; visitasBase[].riesgos (ids del caso) y direccion (texto). agendarVisita guarda los riesgos (SQL 36c).
// 13/11/2026 · P-6f-0e · DEC-231: SIRIUS_CONEXION.inspectores = [{ nombre, tipo ('Interno' | 'Agencia' | 'Independiente'), agencia, zonas [], estado }] (activos con rol Inspector). agendarVisita valida en la base (SQL 36b).
// 13/11/2026 · P-6f-0b · DEC-217: casos[].visitasBase[].plantilla = { nombre, version } (versión con que empezó la visita; null si no empezó o es anterior al SQL 36).
// 13/11/2026 · P-6f-0: cada caso trae tipoRiesgo según su grupo de ramo (Vehículos o Ramos Generales).
// 13/11/2026 · P-6f-0: SIRIUS_CATALOGOS se aplica en la forma del archivo de datos (listas de texto; noaseg, noinsp y verif con su clave del archivo).
// 13/11/2026 · P-6f-0: los riesgos de cada caso llegan en orden fijo (creación y descripción).
// 13/11/2026 · P-6f-0 · DEC-216: SIRIUS_FACULTADES (Niveles de calificación › Facultad del inspector, con tope en USD) se vigila sin archivo de datos y
// window.SIRIUS_FACULTADES toma la versión vigente de la base (SQL 35); al publicar desde Niveles se aplica en la sesión.
// 12/11/2026 · SIRIUS_CONEXION.calificaciones[caso] = [{ riesgo, nivel, veredicto, cobertura, resultado, observacion, por, rol, hora }] (de la más antigua a la más reciente).
(function () {
  var URLB = 'https://qdciqoxselwmudlycprq.supabase.co', KEY = 'sb_publishable_pUrNhusonmxflSItZlU0fQ_ohRpCrYW';
  var CLAVE = 'sb-qdciqoxselwmudlycprq-auth-token', INGRESO = 'index.html', SONDEO_MS = 20000;
  var sesion = null; try { sesion = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) {}
  if (!sesion || !sesion.access_token || /[?&]demo=on/.test(location.search)) { window.SIRIUS_CONEXION = { activo: false }; return; }

  // ---------- Configuración: la versión vigente de la base reemplaza a la del archivo de datos (si no es más antigua) ----------
  var CONFIG = null, ORIGEN = {}, ARCH = {}, MEZCLA = {};   // ORIGEN[clave] = { origen, version, creado } de la versión vigente en la base
  function esObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function mezclar(a, b) { if (!esObj(a) || !esObj(b)) return b === undefined ? a : b; var r = {}; Object.keys(a).forEach(function (k) { r[k] = a[k]; }); Object.keys(b).forEach(function (k) { r[k] = mezclar(a[k], b[k]); }); return r; }
  function num(v) { return String(v || '0').split('.').map(function (x) { return parseInt(x, 10) || 0; }); }
  function masNueva(a, b) { var x = num(a), y = num(b); for (var i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; }
  function deAdministracion(clave) { return !!(ORIGEN[clave] && ORIGEN[clave].origen === 'Administración'); }
  // Regla: lo publicado desde Administración manda siempre; lo cargado desde el prototipo (SQL de configuración) manda salvo que el archivo sea más nuevo.
  function aplicar(clave) { var f = ARCH[clave], d = CONFIG && CONFIG[clave];
    if (d && f && !deAdministracion(clave) && masNueva(f.version, d.version)) { console.warn('[SIRIUS] ' + clave + ': el archivo (v' + f.version + ') es más nuevo que la base (v' + d.version + '); se usa el archivo.'); MEZCLA[clave] = f; return; }
    if (d && f && deAdministracion(clave) && masNueva(f.version, d.version)) console.info('[SIRIUS] ' + clave + ': se usa lo publicado desde Administración (v' + d.version + ') aunque el archivo diga v' + f.version + '.');
    MEZCLA[clave] = d ? (f ? enElArchivo(f, mezclar(f, d)) : d) : f; }
  // 19/11/2026 · Corrección definitiva: lo publicado se escribe DENTRO del objeto del archivo de datos (misma identidad), no en una copia.
  // Los archivos datos-*.js traen funciones de ayuda que leen su propio objeto (por ejemplo N.plantilla = (id) => N.plantillas.find(…)).
  // Con una copia, esas funciones seguían leyendo los datos originales del archivo: la pantalla mostraba la versión vigente en la
  // cabecera, pero el contenido de la versión del archivo (la plantilla publicada «no se guardaba»).
  function enElArchivo(f, r) { if (!esObj(f) || !esObj(r) || f === r) return r;
    Object.keys(r).forEach(function (k) { if (f[k] !== r[k]) { try { f[k] = r[k]; } catch (e) {} } }); return f; }
  function vigilar(clave) { if (Object.getOwnPropertyDescriptor(window, clave)) return;
    Object.defineProperty(window, clave, { configurable: true, enumerable: true, get: function () { return MEZCLA[clave]; }, set: function (v) { ARCH[clave] = v; aplicar(clave); } }); }
  ['SIRIUS_COMPANIA','SIRIUS_CATALOGO_CIIU','SIRIUS_INFORMES_RG','SIRIUS_CATALOGOS_MAESTROS','SIRIUS_FLUJO','SIRIUS_FLUJO_MOTOR','SIRIUS_MONITOR','SIRIUS_SEGUIMIENTO',
   'SIRIUS_EQUIPOS','SIRIUS_SALIDA_RG','SIRIUS_SALIDA_VEH','SIRIUS_DOCUMENTOS_PDF','SIRIUS_INFORME_VEH','SIRIUS_CAMPOS','SIRIUS_USUARIOS','SIRIUS_NOTIFICACIONES','SIRIUS_CONFLICTOS',
   'SIRIUS_INICIO','SIRIUS_AGENDA','SIRIUS_LIQUIDACIONES','SIRIUS_HONORARIOS','SIRIUS_TARIFAS_CUENTAS','SIRIUS_MATRIZ_GARANTIAS','SIRIUS_DATOS_IA','SIRIUS_SILUETAS','SIRIUS_CAPTURA',
   'SIRIUS_AUTOINSPECCION','SIRIUS_PORTAL_CLIENTE','SIRIUS_APP_INSPECTOR','SIRIUS_CONTROLES','SIRIUS_DOCUMENTOS_CLIENTE','SIRIUS_COMPLETADO','SIRIUS_ZONAS'].forEach(vigilar);   // G-2a · DEC-221: zonas de las ciudades (datos-zonas.js)   // P-6e-1: catálogo de documentos del cliente (DEC-203)
  // P-6f-0 · DEC-216: la facultad publicada en Niveles de calificación (SIRIUS_FACULTADES) no tiene archivo de datos propio: se registra sin archivo
  // para que, al leer la base y al publicar, window.SIRIUS_FACULTADES tome lo vigente (si la base no la tiene, queda indefinida y manda el ejemplo).
  vigilar('SIRIUS_FACULTADES'); if (!Object.prototype.hasOwnProperty.call(ARCH, 'SIRIUS_FACULTADES')) ARCH.SIRIUS_FACULTADES = undefined;
  // (SIRIUS_EJEMPLO y SIRIUS_MONITOR_EJEMPLO no se reemplazan: son datos de demostración; los casos salen de la base.
  //  Excepción: sus partes que publica Administración —plantillas (SIRIUS_FORMULARIOS) y catálogos (SIRIUS_CATALOGOS)— se aplican abajo.)

  // ---------- Configuración publicada que no vive en un archivo propio ----------
  function clon(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }
  function evento(clave) { try { window.dispatchEvent(new CustomEvent('sirius-configuracion', { detail: { clave: clave } })); } catch (e) {} }
  // SIRIUS_FORMULARIOS → window.SIRIUS_FORMULARIOS (lo lee Formularios) y SIRIUS_EJEMPLO.plantillas / plantillasVigentes (los leen el informe,
  // las evidencias y la capa de la app del back-office). Cada versión con pasos queda con su estado; los pasos conservan sus atributos del
  // prototipo (sec, guia, doc…) y toman de Formularios nombre, grupo, modalidades, guía, lecturas y fotos; la columna Presencial va en su orden.
  function aplicarFormularios(F) {
    if (!F || !Array.isArray(F.formularios)) return true; window.SIRIUS_FORMULARIOS = F;
    var E = window.SIRIUS_EJEMPLO; if (!E || !E.plantillas || typeof E.plantillaVigente !== 'function') return false;   // aún no cargan los datos: se reintenta
    var nombres = {}, claves = {};
    F.formularios.forEach(function (f) { (f.versions || []).forEach(function (v) {
      if (!Array.isArray(v.steps) || !v.steps.length || v.n == null) return;   // Ramos Generales y versiones sin pasos de foto: no aplica
      var k = f.name + ' v' + v.n, previa = E.plantillas[k] || Object.keys(E.plantillas).filter(function (x) { var t = E.plantillas[x]; return (t.nombre || '') === f.name && Number(t.version) < Number(v.n); })
        .sort(function (a, b) { return Number(E.plantillas[b].version) - Number(E.plantillas[a].version); }).map(function (x) { return E.plantillas[x]; })[0];
      var T = previa ? clon(previa) : { nombre: f.name, campos: {}, secciones: [], pasos: [] }, antes = {}; (T.pasos || []).forEach(function (p) { antes[p.id] = p; });
      var O = Array.isArray(v.ordenP) ? v.ordenP : null, pos = function (id) { var i = O ? O.indexOf(id) : -1; return i < 0 ? 1e6 : i; };
      var pasos = v.steps.map(function (s, i) { var p = Object.assign({}, antes[s.id] || { sec: [], doc: '', pd: false });
        ['id', 'group', 'name', 'req', 'min', 'max', 'rep', 'ex', 'link', 'guide', 'vis', 'ayuda'].forEach(function (a) { if (s[a] !== undefined) p[a] = clon(s[a]); });
        if (Array.isArray(s.feeds)) p.feedsX = s.feeds.slice(); p._i = i; return p; });
      if (O) pasos.sort(function (a, b) { return (pos(a.id) - pos(b.id)) || (a._i - b._i); });
      pasos.forEach(function (p) { delete p._i; });
      Object.assign(T, { nombre: f.name, version: v.n, estado: v.estado || 'Vigente', vigenteDesde: v.vigenteDesde || '', motivo: v.motivo || '', pasos: pasos, origen: 'Administración' });
      if (O) T.ordenPresencial = O.slice(); if (v.retiradaEl) T.retiradaEl = v.retiradaEl;
      E.plantillas[k] = T; nombres[f.name] = true; claves[k] = true; }); });
    // Formularios es la fuente de esas plantillas: una versión del prototipo que no viene en lo publicado deja de estar vigente.
    Object.keys(E.plantillas).forEach(function (k) { var t = E.plantillas[k]; if (nombres[t.nombre] && !claves[k] && t.estado === 'Vigente') t.estado = 'Retirada'; });
    E.plantillasVigentes = E.plantillasVigentes || {};
    Object.keys(nombres).forEach(function (n) { var k = E.plantillaVigente(n); if (k) E.plantillasVigentes[n] = k; else delete E.plantillasVigentes[n]; });
    return true; }
  // SIRIUS_CATALOGOS → SIRIUS_EJEMPLO.catalogos (Catálogos › Sucursales, Coberturas, Piezas, Tipos de daño…).
  // P-6f-0: Catálogos publica cada catálogo como registros ({ nombre, … }) y con el id de su pantalla (noaseg, noinsp, verif); las pantallas leen
  // listas de texto con el nombre del archivo de datos (motivosNoAsegurable, motivosNoInspeccion, verificacion). Se aplica en la forma del archivo:
  // si el catálogo del prototipo es una lista de texto, los registros se convierten a su nombre (así «Sucursal» no muestra «[object Object]»).
  var ALIAS_CAT = { noaseg: 'motivosNoAsegurable', noinsp: 'motivosNoInspeccion', verif: 'verificacion' };
  function textoDe(x) { return x && typeof x === 'object' ? String(x.nombre != null ? x.nombre : x.descripcion != null ? x.descripcion : x.codigo != null ? x.codigo : '') : x == null ? '' : String(x); }
  function aplicarCatalogos(C) { var E = window.SIRIUS_EJEMPLO; if (!C || typeof C !== 'object') return true; if (!E) return false;
    E.catalogos = E.catalogos || {}; var orig = E.__catalogosForma || (E.__catalogosForma = {});
    Object.keys(E.catalogos).forEach(function (k) { if (!(k in orig)) { var v = E.catalogos[k]; orig[k] = Array.isArray(v) && v.length && typeof v[0] === 'string' ? 'texto' : 'otro'; } });
    var claves = Object.keys(C).filter(function (k) { return !ALIAS_CAT[k]; }).concat(Object.keys(C).filter(function (k) { return ALIAS_CAT[k]; }));   // lo publicado con el id de la pantalla manda sobre la clave del archivo
    claves.forEach(function (k) { var dest = ALIAS_CAT[k] || k, v = clon(C[k]);
      if (orig[dest] === 'texto' && Array.isArray(v)) v = v.map(textoDe).filter(function (t) { return t !== ''; });
      E.catalogos[dest] = v; });
    return true; }
  var ESPECIALES = { SIRIUS_FORMULARIOS: aplicarFormularios, SIRIUS_CATALOGOS: aplicarCatalogos };
  function aplicarEspeciales(soloClave) { var pend = [];
    Object.keys(ESPECIALES).forEach(function (c) { if (soloClave && c !== soloClave) return; var d = CONFIG && CONFIG[c]; if (!d) return;
      if (ESPECIALES[c](d)) evento(c); else pend.push(c); });
    if (pend.length) { var n = 0, t = setInterval(function () { n++; pend = pend.filter(function (c) { if (ESPECIALES[c](CONFIG[c])) { evento(c); return false; } return true; });
      if (!pend.length || n > 200) { clearInterval(t); if (pend.length) console.warn('[SIRIUS] no se pudo aplicar ' + pend.join(', ') + ' (faltan los datos del prototipo).'); } }, 50); } }
  // Tras publicar con éxito, lo publicado pasa a ser la configuración vigente de esta sesión (al salir y volver a una pantalla se ve lo publicado).
  function publicado(carga) { if (!carga || !carga.clave || carga.datos == null) return; CONFIG = CONFIG || {};
    CONFIG[carga.clave] = clon(carga.datos); ORIGEN[carga.clave] = { origen: 'Administración', version: String(carga.version || ''), creado: new Date().toISOString() };
    if (Object.prototype.hasOwnProperty.call(ARCH, carga.clave)) { aplicar(carga.clave); evento(carga.clave); } else aplicarEspeciales(carga.clave); }

  // ---------- API REST ----------
  function cab() { return { apikey: KEY, Authorization: 'Bearer ' + sesion.access_token, 'Content-Type': 'application/json' }; }
  function renovar() { if (sesion.expires_at && sesion.expires_at * 1000 > Date.now() + 60000) return Promise.resolve();
    return fetch(URLB + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: sesion.refresh_token }) })
      .then(function (r) { if (!r.ok) throw new Error('sesion'); return r.json(); })
      .then(function (s) { sesion = Object.assign({}, sesion, s, { expires_at: Math.floor(Date.now() / 1000) + (s.expires_in || 3600) }); localStorage.setItem(CLAVE, JSON.stringify(sesion)); }); }
  function get(ruta) { return renovar().then(function () { return fetch(URLB + '/rest/v1/' + ruta, { headers: cab() }); }).then(function (r) { if (r.status === 401) throw new Error('sesion'); if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return r.json(); }); }
  function rpc(fn, args) { return renovar().then(function () { return fetch(URLB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: cab(), body: JSON.stringify(args || {}) }); }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return r.json(); }); }

  // ---------- Formas que espera el back-office ----------
  var p2 = function (n) { return String(n).padStart(2, '0'); };
  function reloj(iso) { if (!iso) return ''; var d = new Date(iso); return p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()); }
  // Fecha y hora con la zona de Ecuador (-05:00), para que el back-office no muestre la hora UTC.
  function isoLocal(iso) { if (!iso) return null; var d = new Date(iso); if (isNaN(d)) return null; var e = new Date(d.getTime() - 5 * 3600000);
    return e.toISOString().slice(0, 19) + '-05:00'; }
  function fechaIso(iso) { var d = new Date(iso); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  // Forma del prototipo. Los 14 casos de ejemplo toman como base su ficha del prototipo (riesgos, informe, ramos…) y la base manda en estado,
  // responsable, contacto e intentos; los casos nuevos se arman solo con la base. Con varios riesgos se arma «riesgos» con id (lo exige la Bandeja).
  function fichaEjemplo(id) { var E = window.SIRIUS_EJEMPLO; return E && Array.isArray(E.casos) ? E.casos.filter(function (x) { return String(x.id) === id; })[0] : null; }
  // Visitas de la más reciente a la más antigua; el inspector vigente es el de la visita abierta más reciente (texto, nunca objeto)
  function visitasPorReciente(k) { return (k.visitas || []).slice().sort(function (a, b) { return String(b.creado || '').localeCompare(String(a.creado || '')); }); }
  function inspectorVigente(k) { var L = visitasPorReciente(k), abierta = L.filter(function (v) { return v.inspector && v.inspector.nombre && !/cancel|termin|enviada/i.test(v.estado || ''); })[0],
      cualquiera = L.filter(function (v) { return v.inspector && v.inspector.nombre; })[0]; return String(((abierta || cualquiera || {}).inspector || {}).nombre || ''); }
  // G-2c8 · DEC-238: estado de coordinación de un riesgo (Por coordinar, Oferta enviada, Enlace enviado, Agendado, En curso) y su visita
  var FASE_COORD = ['Registrado', 'En coordinación', 'Reaperturado', 'Enlace caducado', 'Agendado'];
  function estadoRiesgo(k, r) {   // DEC-238/239: el estado de cada riesgo sale de SUS visitas, no del estado del caso
    var vs = (k.visitas || []).slice().sort(function (a, b) { return String(a.creado || '').localeCompare(String(b.creado || '')); }), ahora = new Date();
    var con = vs.map(function (v, i) { return { v: v, n: i + 1 }; }).filter(function (x) { return Array.isArray(x.v.riesgo_ids) && x.v.riesgo_ids.indexOf(r.id) >= 0; });
    var hecha = function (x) { return /enviada|termin|realizada/i.test(x.v.estado || ''); }, cancel = function (x) { return /cancel/i.test(x.v.estado || ''); };
    var abierta = con.filter(function (x) { return !cancel(x) && !hecha(x); }).pop(), hecho = con.filter(hecha).pop(), ult = abierta || hecho || con.slice().pop();
    var vis = ult ? { n: ult.n, estado: ult.v.estado || '', inicio: ult.v.inicio || null, inspector: ult.v.inspector ? String(ult.v.inspector.nombre || '') : '' } : null;
    var enFase = FASE_COORD.indexOf(k.estado) >= 0 || k.estado === 'En curso';
    // DEC-271 · SQL 80: con informe, el estado del vehículo sale de SUS datos (informe y calificaciones) con las etapas del flujo:
    // Informe por completar · Devuelto al inspector · Pendiente calificación · Pendiente calificación de suscripción · Inspeccionado (+ veredicto).
    var RE = r.riesgo_estado && typeof r.riesgo_estado === 'object' && r.riesgo_estado.estado ? r.riesgo_estado : null;
    if (RE) return { estado: RE.estado, corta: RE.corta || RE.estado, badge: RE.badge || '', fase: RE.fase || '', veredicto: RE.veredicto || '', visita: vis };
    if (abierta) {
      var v = abierta.v, e = v.estado || '', vig = function (en, tipo) { return en.tipo === tipo && /enviado|entregado|abierto|curso/i.test(en.estado || '') && (!en.vence || new Date(en.vence) > ahora); };
      if (Array.isArray(v.riesgos_enviados) && v.riesgos_enviados.indexOf(r.id) >= 0) return { estado: enFase ? 'Inspeccionado' : k.estado, visita: vis };   // DEC-246 (solo sin el SQL 80: con él manda riesgo_estado)
      if (v.modalidad === 'Autoinspección' && Array.isArray(v.riesgos_en_curso) && v.riesgos_en_curso.indexOf(r.id) >= 0) return { estado: 'En curso', visita: vis };   // SQL 65: el cliente ya subió fotos de este vehículo
      if (/en curso|por sincronizar/i.test(e)) return { estado: 'En curso', visita: vis };
      if (/agendada|en camino/i.test(e)) return { estado: 'Agendado', visita: vis };
      if (v.modalidad === 'Autoinspección' && (v.enlaces || []).some(function (en) { return vig(en, 'Autoinspección'); })) return { estado: 'Enlace enviado', visita: vis };
      if ((v.ofertas_red || []).some(function (o) { return o.estado === 'Abierta' && new Date(o.vence) > ahora; }) || /buscando/i.test(e)) return { estado: 'Oferta enviada', visita: vis };
      if ((v.enlaces || []).some(function (en) { return vig(en, 'Autoagendamiento'); })) return { estado: 'Enlace enviado', visita: vis };
      return { estado: 'Por coordinar', visita: vis };
    }
    if (hecho) return { estado: enFase ? 'Inspeccionado' : k.estado, visita: vis };   // las fases de informe y calificación por riesgo llegan con DEC-209/212
    return { estado: enFase ? 'Por coordinar' : k.estado, visita: vis };
  }
  var RREF = {};   // R-0 · DEC-245: uuid del riesgo -> id del caso («50012-V1»)
  function aCaso(k, evs) {
    var id = String(k.numero), a = k.asegurado || {}, c = a.contacto || {}, d = k.datos || {}, rs = ordenRiesgos(k.riesgos || []), r0 = rs[0] || { datos: {} },
        placas = rs.map(function (r) { return (r.datos || {}).placa; }).filter(Boolean), base = fichaEjemplo(id), resp = (k.responsable && k.responsable.nombre) || '';   // 15/11: solo el responsable de la base; si no hay, el prototipo aplica la regla del flujo según el estado (en coordinación, el coordinador; agendado, el inspector)
    var x = base ? JSON.parse(JSON.stringify(base)) : {};
    x.id = id; x.ramo = k.ramo; x.estado = k.estado; x.asegurado = a.nombre || x.asegurado || ''; x.ident = a.identificacion || x.ident || '';
    x.orden = d.orden || x.orden || ''; x.fecha = (k.creado ? fechaIso(k.creado) : '') || x.fecha; x.registrado = isoLocal(k.creado); x.responsable = resp || x.responsable || '';   // C2-21: la fecha del caso sale de la base (corregido 12/11: este comentario tapaba la asignación del responsable)
    x.comercial = d.comercial || x.comercial || ''; x.backoffice = d.backoffice || x.backoffice || ''; x.broker = d.broker || x.broker || 'Directo'; x.sucursal = d.sucursal || x.sucursal || '';
    x.tipoRiesgo = k.grupo_ramo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales';   // P-6f-0: la bandeja rotula «3 vehículos» (no «3 ramos») y muestra «PRB1212 +2»
    x.origen = k.origen || x.origen || 'Manual'; x.contacto = c.nombre || x.contacto || ''; x.tel = c.celular || x.tel || ''; x.correo = c.correo || x.correo || '';
    x.nota = d.nota || k.subestado || x.nota || '';
    x.subestado = k.subestado || '';
    // S-1a · SQL 72: solicitud completa. Provincia, cantón y dirección del asegurado (antes salían «—» o la ciudad de la sucursal),
    // datos personales, solicitante distinto y póliza. aseguradoDatos y solicitante: { nombre, tipoIdentificacion, identificacion, nombres, apellidos,
    // fechaNacimiento, estadoCivil, genero, telefonoFijo, celular, correo, provincia, canton, direccion }; poliza: { fechaSolicitud, broker, correoAps, ordenEmision, tipoSolicitud }.
    var tit = function (t) { return String(t || '').toLowerCase().replace(/(^|[\s-])(\S)/g, function (m, a1, b) { return a1 + b.toUpperCase(); }); }, pol = d.poliza || {};
    x.prov = a.provincia ? tit(a.provincia) : (x.prov || ''); x.canton = a.canton || x.canton || ''; x.dir = a.direccion || x.dir || '';
    x.correoAps = pol.correoAps || x.correoAps || ''; x.tipoSolicitud = pol.tipoSolicitud || x.tipoSolicitud || ''; x.fechaSolicitud = pol.fechaSolicitud || '';
    if (pol.ordenEmision) x.orden = pol.ordenEmision;
    x.aseguradoDatos = { nombre: a.nombre || '', tipoIdentificacion: a.tipoIdentificacion || '', identificacion: a.identificacion || '', nombres: a.nombres || '', apellidos: a.apellidos || '',
      fechaNacimiento: a.fechaNacimiento || '', estadoCivil: a.estadoCivil || '', genero: a.genero || '', telefonoFijo: a.telefonoFijo || '', celular: c.celular || '', correo: c.correo || '',
      provincia: a.provincia ? tit(a.provincia) : '', canton: a.canton || '', direccion: a.direccion || '' };
    x.solicitante = d.solicitante ? Object.assign({}, d.solicitante, { provincia: d.solicitante.provincia ? tit(d.solicitante.provincia) : '' }) : null;   // null: el solicitante es el asegurado   // G-2c8 · DEC-238: «N de M agendados», «Oferta enviada», «Enlace enviado» (SQL 41)
    // P-6e · plantilla de cada riesgo (riesgos.datos.formulario, SQL 29) y su carrocería: Coordinación ofrece las modalidades de esa plantilla.
    x.formularios = rs.map(function (r) { return (r.datos || {}).formulario || ''; }); x.carrocerias = rs.map(function (r) { return (r.datos || {}).carroceria || ''; });
    x.sumaAsegurada = rs.reduce(function (t, r) { return t + (Number(r.suma_asegurada) || 0); }, 0) || x.sumaAsegurada; x.anios = rs.map(function (r) { return (r.datos || {}).anio || null; }); x.placas = rs.map(function (r) { return (r.datos || {}).placa || r.descripcion || ''; }); x.riesgosBase = rs.map(function (r, i) { var re = r.riesgo_estado && typeof r.riesgo_estado === 'object' ? r.riesgo_estado : null; return { id: id + '-' + (r.composicion === 'Vehículo' ? 'V' : 'U') + (i + 1), descripcion: r.descripcion || '', composicion: r.composicion || '', suma: Number(r.suma_asegurada) || null, datos: r.datos || {}, estado: re ? re.estado : null, riesgo_estado: re }; });   // P-1c3: referencia y estado por fases (DEC-271) también con un solo vehículo   // detalle de la solicitud por riesgo (marca, modelo, versión, año, color, VIN, motor, clase, uso, extras)
    // C2-3 · inspector del caso (para la bandeja «Informes por completar» del Control de calidad) y plazo de 24 h hábiles
    var vi = visitasPorReciente(k).filter(function (v) { return v.inspector && !/cancel/i.test(v.estado || ''); })[0] || visitasPorReciente(k).filter(function (v) { return v.inspector; })[0];
    if (vi) x.inspector = { nombre: vi.inspector.nombre, tipo: vi.inspector.tipo_inspector || '', agencia: vi.inspector.agencia ? vi.inspector.agencia.nombre : '' };
    if (k.sla_vence) x.vence = isoLocal(k.sla_vence);
    // C2-7 · solicitud (precargados) y visita (automáticos del informe)
    var dd0 = r0.datos || {}; x.solicitud = { marca: dd0.marca || '', modelo: dd0.modelo || '', anio: dd0.anio ? String(dd0.anio) : '', placa: dd0.placa || '' };
    var vv = (k.visitas || []).slice().sort(function (a, b) { return String(b.creado || '').localeCompare(String(a.creado || '')); })[0];
    // P-6e-3 · todas las visitas de la base con su enlace vigente de cada tipo (Coordinación: reenviar, generar nuevo, cancelar, reagendar)
    var rsOrden = rs.map(function (r, i) { return { uuid: r.id, id: id + '-' + (r.composicion === 'Vehículo' ? 'V' : 'U') + (i + 1) }; });   // P-6f-0f · DEC-232
    if (d.cancelacion && typeof d.cancelacion === 'object') x.cancelacion = { motivo: d.cancelacion.motivo || '', detalle: d.cancelacion.detalle || '', por: d.cancelacion.por || '', hora: d.cancelacion.hora || '' };   // G-2c3 · DEC-237 (SQL 40)
    x.visitasBase = (k.visitas || []).slice().sort(function (a, b) { return String(a.creado || '').localeCompare(String(b.creado || '')); }).map(function (v, i) {
      var ens = (v.enlaces || []).filter(function (e) { return ['Vencido','Invalidado','Revocado'].indexOf(e.estado) < 0; }).map(function (e) {
        return { tipo: e.tipo || 'Autoagendamiento', estado: e.estado, vence: isoLocal(e.vence), url: (e.tipo === 'Autoinspección' ? 'https://davidmena-beep.github.io/autoinspecciones_v1/?t=' : 'https://davidmena-beep.github.io/Autoagendamiento/?t=') + e.token,
          canales: Array.isArray(e.canales) ? e.canales : [], enviadoEn: isoLocal(e.creado) }; });
      // G-4c · SQL 74: un registro por canal en enlaces[] (como en la demostración de S-1b); enlace sigue siendo el primer enlace vigente
      var ensCanal = []; ens.forEach(function (e) { (e.canales.length ? e.canales : ['']).forEach(function (cn) { ensCanal.push(Object.assign({}, e, { canal: cn })); }); });
      return { n: i + 1, motivoCierre: v.motivo_cierre || '', noInspeccionados: Array.isArray(v.no_inspeccionados) ? v.no_inspeccionados.map(function (x) { return { placa: x.placa || '', motivo: x.motivo || '', detalle: x.detalle || '', por: x.por || '', origen: x.origen || '' }; }) : [], modalidad: v.modalidad || '', estado: v.estado || '', inicio: isoLocal(v.inicio), fin: isoLocal(v.fin), agendadoEn: isoLocal(v.agendado_en), origen: v.origen || '',
               inspector: v.inspector ? v.inspector.nombre : '', enlace: ens[0] || null, enlaces: ensCanal,
               canceladoPor: v.cancelado_por || '', canceladoEn: isoLocal(v.cancelado_en),
               avance: v.avance_autoinspeccion ? { fotos: +(v.avance_autoinspeccion.fotos || 0), total: v.avance_autoinspeccion.total != null ? +v.avance_autoinspeccion.total : null, video: !!v.avance_autoinspeccion.video, vehiculos: (Array.isArray(v.avance_autoinspeccion.vehiculos) ? v.avance_autoinspeccion.vehiculos : []).map(function (x) { return { ref: x.ref || '', fotos: +(x.fotos || 0), total: x.total != null ? +x.total : null, enviado: !!x.enviado, ultimo: isoLocal(x.ultimo), paso: x.paso || '', pasoNombre: x.pasoNombre || x.paso || '' }; }), ultimo: isoLocal(v.avance_autoinspeccion.ultimo), paso: v.avance_autoinspeccion.paso || '', pasoNombre: v.avance_autoinspeccion.pasoNombre || v.avance_autoinspeccion.paso || '' } : null,   // SQL 77: avance por vehículo (como la app del cliente), total de fotos y video
               plantilla: v.plantilla && v.plantilla.nombre ? { nombre: v.plantilla.nombre, version: v.plantilla.version == null ? null : v.plantilla.version } : null,   // P-6f-0b · DEC-217 (SQL 36)
               riesgos: Array.isArray(v.riesgo_ids) && v.riesgo_ids.length ? rsOrden.filter(function (o) { return v.riesgo_ids.indexOf(o.uuid) >= 0; }).map(function (o) { return o.id; }) : undefined,
               direccion: v.direccion && typeof v.direccion === 'object' && v.direccion.direccion ? String(v.direccion.direccion) : undefined,   // P-6f-0f · DEC-232
               lugar: v.lugar && typeof v.lugar === 'object' ? v.lugar : undefined,   // G-2c · DEC-222 (SQL 38)
               fueraCobertura: v.fuera_cobertura && v.fuera_cobertura.motivo ? { motivo: v.fuera_cobertura.motivo, inspector: v.fuera_cobertura.inspector || '' } : null,   // G-2c · DEC-225
               oferta: (function () { var ab = (v.ofertas_red || []).filter(function (o) { return o.estado === 'Abierta' && (o.origen === 'Coordinador' || o.origen === 'Cliente') && new Date(o.vence) > new Date(); });   // G-2c2 · DEC-237 (SQL 39) · G-3b: también la pedida por el cliente (SQL 46)
                 if (!ab.length) return undefined; var o0 = ab[0];
                 return { inspectores: ab.map(function (o) { return o.inspector ? o.inspector.nombre : ''; }).filter(Boolean), desde: o0.desde || '', hasta: o0.hasta || '', minutos: o0.minutos || 45,
                          nota: o0.nota || '', vence: o0.vence, vigenciaHoras: null, porCliente: o0.origen === 'Cliente' }; })() }; });
    if (vv) x.visita = { estado: vv.estado || '', inicio: isoLocal(vv.inicio), fin: isoLocal(vv.fin), agendadoEn: isoLocal(vv.agendado_en), origen: vv.origen || '', llegada: isoLocal(vv.llegada && vv.llegada.hora), modalidad: vv.modalidad || '', quienRecibe: (vv.direccion && vv.direccion.quien) || '', inspector: vv.inspector ? vv.inspector.nombre : '' };
    if (!base) { x.placa = placas[0] || ''; x.bien = r0.descripcion || ''; if (placas.length > 1) x.placas = placas;
      if (rs.length > 1) x.riesgos = rs.map(function (r, i) { var dd = r.datos || {}; var rEst = estadoRiesgo(k, r);   // G-2c8 · DEC-238: estado de coordinación y visita de cada riesgo
        var mma = [dd.marca, dd.modelo, dd.anio].filter(function (t) { return t != null && String(t).trim() !== ''; }).join(', ');   // P-6f-0f: placa arriba y «Marca, Modelo, Año» abajo
        RREF[r.id] = id + '-' + (r.composicion === 'Vehículo' ? 'V' : 'U') + (i + 1);
        return { id: id + '-' + (r.composicion === 'Vehículo' ? 'V' : 'U') + (i + 1), label: dd.placa || r.descripcion || ('Riesgo ' + (i + 1)), nowrap: !!dd.placa, detalle: (dd.placa ? (mma || r.descripcion) : r.descripcion) || '', estado: rEst.estado, visita: rEst.visita, tipoConfirmado: dd.tipoConfirmado || null, plantilla: dd.plantilla || null, tipoAnterior: dd.tipoAnterior || null,
          noInspeccionado: rEst.estado === 'Por coordinar' && dd.noInspeccionado ? { motivo: dd.noInspeccionado.motivo || '', detalle: dd.noInspeccionado.detalle || '', por: dd.noInspeccionado.por || '', hora: isoLocal(dd.noInspeccionado.hora), origen: dd.noInspeccionado.origen || 'inspector' } : null,
          revisarDatos: dd.revisarDatos ? { motivo: dd.revisarDatos.motivo || '', hora: isoLocal(dd.revisarDatos.hora) } : null, dir: dd.direccion || '', total: r.suma_asegurada || 0, cobertura: dd.cobertura || '', recMod: dd.modalidad || 'Presencial', riesgo_estado: r.riesgo_estado && typeof r.riesgo_estado === 'object' ? r.riesgo_estado : null }; }); }
    var ints = (evs || []).filter(function (e) { return e.accion === 'Intento de contacto'; }).map(function (e) { var p = (e.detalle || '').split(' · '); return { by: (e.actor && e.actor.nombre) || '', fecha: new Date(e.hora).toISOString().slice(0, 16), medio: p[0] || '', resultado: p[1] || '', obs: p.slice(2).join(' · ') }; });
    if (ints.length || !base) x.intentos = ints;
    return x;
  }
  function aEvento(e) { var actor = (e.actor && e.actor.nombre) || (e.actor_tipo === 'Cliente' ? 'Cliente' : e.actor_tipo === 'Sistema' ? 'SIRIUS' : e.actor_tipo || '');
    return { hora: reloj(e.hora), accion: e.accion, detalle: e.detalle || '', actor: actor, rol: e.rol || (e.actor_tipo === 'Cliente' ? 'Portal del cliente' : '') }; }

  // ---------- Contrato SIRIUS_CONEXION ----------
  // ---------- P-6b · evidencias (fotos reales con URL firmada), controles e informes ----------
  function firmar(rutas) { var reales = rutas.filter(function (r) { return r && r.indexOf('(') !== 0; }); if (!reales.length) return Promise.resolve({});
    return renovar().then(function () { return fetch(URLB + '/storage/v1/object/sign/evidencias', { method: 'POST', headers: cab(), body: JSON.stringify({ expiresIn: 3600, paths: reales }) }); })
      .then(function (r) { return r.ok ? r.json() : []; }).then(function (arr) { var m = {}; (arr || []).forEach(function (x) { if (x && x.path && x.signedURL) m[x.path] = URLB + '/storage/v1' + x.signedURL; }); return m; }).catch(function () { return {}; }); }
  var FIRMAS = {}, FIRMADO = 0;
  function cargarEvidencias(idPorCaso) {
    return Promise.all([
      get('evidencias?select=id,caso_id,riesgo_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas,estado,motivo,observacion,tipo_archivo,meta&order=hora').catch(function () { return get('evidencias?select=id,caso_id,riesgo_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas,estado,motivo,observacion,tipo_archivo&order=hora'); }).catch(function () { return get('evidencias?select=id,caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas,estado,motivo,observacion,tipo_archivo&order=hora'); }).catch(function () { return get('evidencias?select=id,caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas,estado,motivo,observacion&order=hora'); }).catch(function () { return get('evidencias?select=id,caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas&order=hora'); }),   // estado: SQL 22
      get('controles?select=id,caso_id,tipo,severidad,detalle,estado,comentario,creado,visto_en,visto:usuarios!controles_visto_por_fkey(nombre,rol)&order=creado').catch(function () { return get('controles?select=id,caso_id,tipo,severidad,detalle,estado,comentario,creado&order=creado'); }),
      get('informes?select=riesgo_id,plantilla_clave,plantilla_version,respuestas,estado,determinacion,motivo,enviado_en,criterio,decision,responsable_tipo,responsable_regla,asignado_en,responsable_agencia:agencias!informes_responsable_agencia_id_fkey(nombre),responsable_usuario:usuarios!informes_responsable_usuario_id_fkey(nombre),riesgo:riesgos(caso_id,descripcion),enviado:usuarios!informes_enviado_por_fkey(nombre)')
        .catch(function () { return get('informes?select=riesgo_id,plantilla_clave,plantilla_version,respuestas,estado,determinacion,motivo,enviado_en,criterio,decision,riesgo:riesgos(caso_id,descripcion),enviado:usuarios!informes_enviado_por_fkey(nombre)'); }),   // responsable: SQL 32 (DEC-207)
      get('calificaciones?select=riesgo_id,nivel,resultado,observacion,fecha,riesgo:riesgos(caso_id,descripcion),usuario:usuarios(nombre,rol)&order=fecha').catch(function () { return get('calificaciones?select=nivel,resultado,observacion,fecha,riesgo:riesgos(caso_id,descripcion),usuario:usuarios(nombre,rol)&order=fecha'); }).catch(function () { return []; })
    ]).then(function (res) {
      var evs = res[0], ctr = res[1], inf = res[2], cal = res[3] || [], rutas = evs.map(function (e) { return e.ruta; }).filter(function (r) { return !FIRMAS[r]; });
      var refrescar = Date.now() - FIRMADO > 45 * 60000; if (refrescar) { FIRMAS = {}; rutas = evs.map(function (e) { return e.ruta; }); }
      return firmar(rutas).then(function (m) { Object.keys(m).forEach(function (k) { FIRMAS[k] = m[k]; }); if (refrescar) FIRMADO = Date.now();
        var E = {}, C = {}, I = {}, Q = {};
        // Calificaciones registradas en la base (nivel 0 = al completar el informe dentro de la facultad; 1 = Ejecutivo; 2 = Suscriptor).
        cal.forEach(function (q) { var id = q.riesgo && idPorCaso[q.riesgo.caso_id]; if (!id) return; var r = String(q.resultado || ''), i = r.indexOf(' · ');
          (Q[id] = Q[id] || []).push({ riesgoId: RREF[q.riesgo_id] || null, riesgo: q.riesgo.descripcion, nivel: q.nivel,   /* P-1c5b: la referencia del vehículo («50046-V1»), como evidencias e informes */ veredicto: i < 0 ? r : r.slice(0, i), cobertura: i < 0 ? '' : r.slice(i + 3), resultado: r,
            observacion: q.observacion || '', por: q.usuario ? q.usuario.nombre : '', rol: q.usuario ? q.usuario.rol : '', hora: reloj(q.fecha) }); });
        evs.forEach(function (e) { var id = idPorCaso[e.caso_id]; if (!id) return; (E[id] = E[id] || []).push({ riesgo: RREF[e.riesgo_id] || null, id: e.id, tipoArchivo: e.tipo_archivo || 'foto', estado: e.estado || undefined, motivo: e.motivo || '', observacion: e.observacion || '', paso: e.paso, url: FIRMAS[e.ruta] || null, prueba: !FIRMAS[e.ruta], hora: reloj(e.hora), canal: e.canal, validacion: e.validacion || '', gps: e.lat != null ? [e.lat, e.lng] : null, lecturas: e.lecturas || {}, disp: (e.meta && e.meta.disp) || '', precision: e.meta && e.meta.prec != null ? +e.meta.prec : null }); });   // P-1b: dispositivo y precisión del GPS (respaldo de la foto, DEC-125)
        ctr.forEach(function (c) { var id = idPorCaso[c.caso_id]; if (!id) return; (C[id] = C[id] || []).push({ id: c.id, tipo: c.tipo, severidad: c.severidad, detalle: c.detalle || {}, estado: c.estado, comentario: c.comentario || '', hora: reloj(c.creado), vistoEn: c.visto_en ? reloj(c.visto_en) : '', vistoPor: c.visto ? c.visto.nombre : '', vistoRol: c.visto ? c.visto.rol : '' }); });
        inf.forEach(function (x) { var id = x.riesgo && idPorCaso[x.riesgo.caso_id]; if (!id) return; (I[id] = I[id] || []).push({ riesgoId: RREF[x.riesgo_id] || null, riesgo: x.riesgo.descripcion, responsable: x.responsable_tipo ? { tipo: x.responsable_tipo, agencia: x.responsable_agencia ? x.responsable_agencia.nombre : '', usuario: x.responsable_usuario ? x.responsable_usuario.nombre : '', regla: x.responsable_regla || '', asignadoEn: isoLocal(x.asignado_en) } : null, plantilla: /^\d+(\.\d+)?$/.test(String(x.plantilla_version || '')) && x.plantilla_version !== '1' ? x.plantilla_clave + ' v' + x.plantilla_version : undefined, plantillaClave: x.plantilla_clave || '', plantillaVersion: /^\d+(\.\d+)?$/.test(String(x.plantilla_version || '')) ? String(x.plantilla_version) : '',  // sin versión real: el back-office muestra la vigente
 respuestas: x.respuestas || {}, estado: x.estado, determinacion: x.determinacion || '', motivo: x.motivo || '', enviadoPor: x.enviado ? x.enviado.nombre : '', enviadoEn: reloj(x.enviado_en), criterio: horaLocal(x.criterio), decision: horaLocal(x.decision) }); });   // P-1c5b: la hora de la decisión y del criterio, en la zona de Ecuador como las demás
        return { evidencias: E, controles: C, informes: I, calificaciones: Q }; }); }); }
  // P-1f · Los vehículos de un caso, en el MISMO orden con que la base arma su referencia (sirius_ref_de: por creado y, si empata, por descripción).
  // La consulta no garantiza orden: sin esto, al modificarse un riesgo, «V1» y «V2» podían cruzarse (informes, fotos, calificaciones y PDF del otro vehículo).
  function ordenRiesgos(rs) { return rs.slice().sort(function (a, b) { var ca = String(a.creado || ''), cb = String(b.creado || ''); if (ca !== cb) return ca < cb ? -1 : 1;
    var da = String(a.descripcion || ''), db = String(b.descripcion || ''); return da === db ? 0 : (da < db ? -1 : 1); }); }
  function horaLocal(o) { if (!o || typeof o !== 'object' || Array.isArray(o)) return o || null; var c = Object.assign({}, o); if (c.hora) c.hora = isoLocal(c.hora); return c; }   // P-1c5b · decision.hora y criterio.hora llegan en UTC dentro del objeto
  var oyentes = [], huella = '';
  var CX = window.SIRIUS_CONEXION = { activo: true, usuario: null, casos: [], inspectores: [], usuarios: [], agencias: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {},
    suscribir: function (fn) { if (typeof fn === 'function') oyentes.push(fn); },
    // P-6c · las acciones se guardan en la base (función bo_accion) y luego se vuelve a leer y a dibujar.
    // 64: sube una imagen de plantilla (banner, pie, logo) al almacén público «correo» y devuelve su dirección completa
    subirImagenCorreo: function (archivo, nombre) {
      if (!archivo) return Promise.resolve({ ok: false, mensaje: 'Elige una imagen' });
      if (!/^image\/(png|jpeg|gif|webp)$/.test(archivo.type || '')) return Promise.resolve({ ok: false, mensaje: 'La imagen debe ser PNG, JPG, GIF o WebP' });
      if (archivo.size > 2 * 1024 * 1024) return Promise.resolve({ ok: false, mensaje: 'La imagen pesa más de 2 MB' });
      var limpio = String(nombre || archivo.name || 'imagen').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'imagen';
      var ruta = 'plantillas/' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '-' + limpio;
      return renovar().then(function () { var h = cab(); h['Content-Type'] = archivo.type; h['x-upsert'] = 'true';
          return fetch(URLB + '/storage/v1/object/correo/' + ruta, { method: 'POST', headers: h, body: archivo }); })
        .then(function (r) { if (!r.ok) return r.text().then(function (t) { var m = t; try { m = JSON.parse(t).message || t; } catch (e) {}
            return { ok: false, mensaje: /bucket/i.test(m) ? 'Falta el almacén de imágenes: ejecuta el SQL 64' : /security|policy|unauthor/i.test(m) ? 'Solo el Administrador sube imágenes' : 'No se pudo subir la imagen: ' + m }; });
          return { ok: true, mensaje: 'Imagen subida', url: URLB + '/storage/v1/object/public/correo/' + ruta, ruta: ruta }; })
        .catch(function (e) { return { ok: false, mensaje: 'No se pudo subir la imagen: ' + (e.message || e) }; });
    },
    // 59f: los datos con que la base arma el correo de un caso (enlaces activos y destinatario típico de la plantilla), para la vista previa
    contextoNotificacion: function (caso, plantilla) { return rpc('notif_contexto', { p_caso: String(caso || ''), p_plantilla: String(plantilla || '') }).catch(function () { return null; }); },
    notificacionContexto: function (id) { return get('notificaciones?select=contexto,asunto,plantilla&id=eq.' + encodeURIComponent(id)).then(function (r) { return (r && r[0]) || null; }).catch(function () { return null; }); },
    documentoRegistrar: function (datos) { return rpc('documento_registrar', { p_datos: datos || {} }).then(function (r) { return r || { ok: false, mensaje: 'Sin respuesta de la base' }; })   // P-1b · SQL 81
      .catch(function (e) { var m = String(e.message || e); return { ok: false, mensaje: /documento_registrar|PGRST202/.test(m) ? 'La base todavía no registra documentos (falta el SQL 81)' : m.slice(0, 200) }; }); },
    documentoValidar: function (codigo) { return rpc('documento_validar', { p_codigo: String(codigo || '') }).then(function (r) { return r || { ok: false, mensaje: 'Sin respuesta de la base' }; })
      .catch(function (e) { var m = String(e.message || e); return { ok: false, mensaje: /documento_validar|PGRST202/.test(m) ? 'La base todavía no valida documentos (falta el SQL 81)' : m.slice(0, 200) }; }); },
    redLugar: function (datos) { return rpc('red_lugar', { p_datos: datos || {} }).then(function (r) { return r || { ok: false, mensaje: 'Sin respuesta de la base' }; })   // R-3b · SQL 75
      .catch(function (e) { var m = String(e.message || e); return { ok: false, mensaje: /red_lugar|PGRST202/.test(m) ? 'La base todavía no tiene la Red por lugar (falta el SQL 75)' : m.slice(0, 200) }; }); },
    redAccion: function (tipo, datos) { return rpc('red_accion', { p_tipo: tipo, p_datos: datos || {} }).then(function (r) { r = r || { ok: false, mensaje: 'Sin respuesta de la base' };   // R-2 · DEC-262
      return cargarCasos().then(function () { avisar(); return r; }, function () { return r; }); }).catch(function (e) { return { ok: false, mensaje: String(e.message || e).slice(0, 200) }; }); },
    accion: function (tipo, datos) { return rpc('bo_accion', { p_tipo: tipo, p_datos: datos || {} }).then(function (r) { r = r || { ok: false, mensaje: 'Sin respuesta de la base' };
  // N-2c: la versión vigente de cada configuración, para publicar «vigente + 1» y mostrarla en los editores: { clave: { version, fecha, por, datos } }
  try { Object.defineProperty(CX, 'configuracion', { configurable: true, enumerable: true, get: function () { var o = {};
    Object.keys(CONFIG || {}).forEach(function (k) { var g = ORIGEN[k] || {}; o[k] = { version: String(g.version || (CONFIG[k] && CONFIG[k].version) || ''), fecha: g.creado || null, por: g.origen || '', datos: CONFIG[k] }; });
    return o; } }); } catch (e) {}
        if (r.ok && r.funcion && tipo === 'enviarNotificacionesAhora') {   // N-1: el Administrador manda ya los correos pendientes (función sirius-notificar)
          return renovar().then(function () { return fetch(r.funcion, { method: 'POST', headers: cab(), body: '{"origen":"backoffice"}' }); })
            .then(function (x) { return x.json().catch(function () { return { ok: false, mensaje: 'La función de envío no respondió (¿está publicada?)' }; }); })
            .catch(function () { return { ok: false, mensaje: 'La función de envío no respondió (¿está publicada?)' }; })
            .then(function (m) { r.ok = !!(m && m.ok); r.mensaje = (m && m.mensaje) || 'Sin respuesta'; r.enviados = m && m.enviados; r.fallidos = m && m.fallidos; return cargarCasos().then(function () { avisar(); return r; }, function () { return r; }); });
        }
        if (r.ok && r.activacion && /^(crearUsuario|reinvitarUsuario|editarUsuario)$/.test(tipo)) {   // U-1: la invitación sale por correo (función sirius-invitar)
          var dd = datos || {}, cb = dd.cambios || {}, correo = String(dd.nuevoEmail || cb.email || dd.email || '').trim().toLowerCase();
          return renovar().then(function () { return fetch(URLB + '/functions/v1/sirius-invitar', { method: 'POST', headers: cab(), body: JSON.stringify({ email: correo, redirectTo: r.activacion, nombre: dd.nombre || cb.nombre || '' }) }); })
            .then(function (x) { return x.json().catch(function () { return { ok: false, mensaje: 'La función de correo no respondió (¿está publicada?)' }; }); })
            .catch(function () { return { ok: false, mensaje: 'La función de correo no respondió (¿está publicada?)' }; })
            .then(function (m) { r.correo = m; r.mensaje = (r.mensaje || '') + (m && m.ok ? ' · ' + m.mensaje : ' · El correo no salió: ' + ((m && m.mensaje) || 'sin respuesta') + '. Copia el enlace y envíalo tú.'); })
            .then(function () { return cargarCasos().then(function () { avisar(); return r; }, function () { return r; }); });   // como el resto de las acciones: recarga y avisa
        }
      if (tipo === 'publicarConfiguracion' && r.ok) { try { if (r.version) datos = Object.assign({}, datos, { version: r.version }); publicado(datos); }   // 59e: la versión que asignó la base
        /* */ catch (e) { console.warn('[SIRIUS] configuración publicada:', e); } }
      return cargarCasos().then(function () { avisar(); return r; }, function () { return r; }); }).catch(function (e) { return { ok: false, mensaje: String(e.message || e).slice(0, 200) }; }); },
    cerrarSesion: function () { localStorage.removeItem(CLAVE); location.href = INGRESO; },
    // Diagnóstico en la consola: SIRIUS_CONEXION.configuracion() → clave, versión y origen de lo vigente en la base, y la plantilla vigente que se aplicó.
    configuracion: function () { var E = window.SIRIUS_EJEMPLO || {}; return { origen: clon(ORIGEN), plantillasVigentes: clon(E.plantillasVigentes || {}),
      formularios: window.SIRIUS_FORMULARIOS && window.SIRIUS_FORMULARIOS.vigentes ? clon(window.SIRIUS_FORMULARIOS.vigentes) : null }; } };
  // Aviso visible si la base no responde (para diagnosticar en la copia publicada sin abrir la consola).
  function aviso(txt) { try { var d = document.getElementById('sirius-aviso-conexion') || document.createElement('div'); d.id = 'sirius-aviso-conexion';
    d.setAttribute('role', 'alert'); d.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:560px;background:#fdecea;color:#b42318;border:1px solid #f1b7b0;border-radius:10px;padding:10px 14px;font:600 13px/1.4 Mulish,system-ui,sans-serif;box-shadow:0 6px 18px #0002';
    d.textContent = 'Conexión con la base: ' + txt; if (!d.parentNode) (document.body || document.documentElement).appendChild(d); } catch (e) {} }
  function avisar() { oyentes.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function salir(motivo) { localStorage.removeItem(CLAVE); var cs = (location.search.match(/[?&]caso=(\d{3,10})/) || [])[1]; location.href = INGRESO + '?motivo=' + encodeURIComponent(motivo) + (cs ? '&caso=' + cs : ''); }   // N-2d: conserva el caso del enlace

  // ---------- R-2 · DEC-262: Red de inspectores (SQL 68) ----------
  var huellaRed = '';
  function hoyEc() { var d = new Date(Date.now() - 5 * 3600000); return d.toISOString().slice(0, 10); }
  function hhmm(t) { return String(t || '').slice(0, 5); }
  function cargarRed() {
    return Promise.all([
      get('usuarios?select=id,nombre,rol,tipo_inspector,estado,auth_id,datos,agencia:agencias(nombre)&order=nombre'),
      get('inspector_operacion?select=usuario_id,modalidades,ramos,recibe_ofertas,jornada_dias,jornada_desde,jornada_hasta,capacidad_dia,fuente,actualizado'),
      get('inspector_cobertura?select=id,usuario_id,nivel,sucursal,ciudad,zona,desde,hasta,origen,motivo,creado,autor:usuarios!inspector_cobertura_creado_por_fkey(nombre)&retirado=is.null&order=creado'),
      get('inspector_bloqueos?select=id,usuario_id,desde,hasta,motivo,origen&retirado=is.null&order=desde'),
      get('red_historial?select=id,usuario_id,accion,detalle,motivo,hora,autor:usuarios!red_historial_por_fkey(nombre)&order=hora.desc&limit=300').catch(function () { return []; })
    ]).then(function (r) {
      var hoy = hoyEc(), porId = {}, ops = {}, cob = {}, blq = {};
      (r[0] || []).forEach(function (u) { porId[u.id] = u; });
      (r[1] || []).forEach(function (o) { ops[o.usuario_id] = o; });
      (r[2] || []).forEach(function (c) { (cob[c.usuario_id] = cob[c.usuario_id] || []).push({ id: c.id, nivel: c.nivel, sucursal: c.sucursal || null, ciudad: c.ciudad || null, zona: c.zona || null,
        desde: c.desde, hasta: c.hasta || null, vigente: c.desde <= hoy && (!c.hasta || c.hasta >= hoy), origen: c.origen, motivo: c.motivo || '', creado: c.creado, creadoPor: c.autor ? c.autor.nombre : '' }); });
      (r[3] || []).forEach(function (b) { (blq[b.usuario_id] = blq[b.usuario_id] || []).push({ id: b.id, desde: b.desde, hasta: b.hasta, motivo: b.motivo || '', origen: b.origen }); });
      var esIns = function (u) { var rs = (u.datos && Array.isArray(u.datos.roles)) ? u.datos.roles : []; return u.rol === 'Inspector' || rs.indexOf('Inspector') >= 0; };
      var yo = CX.usuario || {}, rolesYo = (yo.roles || []).concat([yo.rol]);
      CX.red = { listo: true, hoy: hoy, puedeGestionar: rolesYo.indexOf('Administrador') >= 0 || rolesYo.indexOf('Coordinador de inspecciones') >= 0,
        inspectores: (r[0] || []).filter(esIns).map(function (u) { var o = ops[u.id], t = String(u.tipo_inspector || '').toLowerCase();
          return { nombre: u.nombre, tipoInspector: t || null, tipo: t === 'agencia' ? 'Agencia' : t === 'independiente' ? 'Independiente' : 'Interno', agencia: u.agencia ? u.agencia.nombre : null,
            estado: u.estado || 'Activo', cuenta: !!u.auth_id,
            operacion: o ? { modalidades: o.modalidades || [], ramos: o.ramos || [], recibeOfertas: o.recibe_ofertas, jornada: { dias: o.jornada_dias || [], desde: hhmm(o.jornada_desde), hasta: hhmm(o.jornada_hasta) },
              capacidadDia: o.capacidad_dia, fuente: o.fuente, actualizado: o.actualizado } : null,
            cobertura: cob[u.id] || [], bloqueos: blq[u.id] || [] }; }),
        historial: (r[4] || []).map(function (h) { return { inspector: porId[h.usuario_id] ? porId[h.usuario_id].nombre : '', accion: h.accion, detalle: h.detalle || '', motivo: h.motivo || '', por: h.autor ? h.autor.nombre : '', hora: h.hora }; }) };
      ponerRedEnUsuarios();
    }).catch(function (e) { if (CX.red !== null) console.warn('[SIRIUS] Red de inspectores (¿falta el SQL 68?):', e.message); CX.red = null; });
  }
  function ponerRedEnUsuarios() {
    if (!CX.red) return; var por = {}; CX.red.inspectores.forEach(function (i) { por[i.nombre] = i; });
    [CX.usuarios, CX.inspectores].forEach(function (lista) { (lista || []).forEach(function (u) { var i = por[u.nombre]; if (!i) return;
      var vig = i.cobertura.filter(function (c) { return c.vigente; }), niveles = {}; vig.forEach(function (c) { niveles[c.nivel === 'zona' ? 'ciudad' : c.nivel] = 1; });
      u.coberturaFilas = vig; u.coberturaMixta = Object.keys(niveles).length > 1;   // R-5c: sin la cobertura de un solo modo (coberturaLegada)
      if (i.operacion) { u.jornada = { dias: i.operacion.jornada.dias, desde: i.operacion.jornada.desde, hasta: i.operacion.jornada.hasta }; u.recibeOfertas = i.operacion.recibeOfertas; u.capacidadDia = i.operacion.capacidadDia;
        if (i.operacion.modalidades.length) u.modalidades = i.operacion.modalidades; if (i.operacion.ramos.length) u.ramos = i.operacion.ramos; } }); });
  }
  // DEC-263 (decisión B, solo prueba de concepto): los casos de la base no traen consentimiento del cliente; se da por otorgado en WhatsApp,
  // SMS y correo para que la pantalla permita esos canales (se simulan hasta Genesis, N-3). Brecha LOPDP para Citytech: en producción el
  // consentimiento se registra en la solicitud con fecha y origen, y sin él no se escribe por WhatsApp ni SMS.
  function ponerConsentimiento() {
    var N = window.SIRIUS_NOTIFICACIONES; if (!N) return; N.consentimiento = N.consentimiento || {}; N.consentimiento.casos = N.consentimiento.casos || {};
    (CX.casos || []).forEach(function (c) { var id = String(c.id || ''); if (id && !N.consentimiento.casos[id]) N.consentimiento.casos[id] = { whatsapp: true, sms: true, correo: true, origen: 'Prueba de concepto · se asume (DEC-263)' }; });
  }
  function cargarCasos() {
    return Promise.all([cargarCasos0(), cargarRed()]).then(function (r) { ponerRedEnUsuarios(); ponerConsentimiento(); var hr = JSON.stringify(CX.red); if (hr !== huellaRed) { huellaRed = hr; return true; } return r[0]; });
  }

  function cargarCasos0() {
    return Promise.all([
      get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(id,descripcion,datos,composicion,suma_asegurada,creado,riesgo_estado),visitas(cancelado_en,cancelado_por,avance_autoinspeccion,estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,plantilla,riesgo_ids,lugar,fuera_cobertura,no_inspeccionados,motivo_cierre,riesgos_enviados,riesgos_en_curso,ofertas_red(estado,origen,desde,hasta,minutos,nota,vence,inspector:usuarios!ofertas_red_inspector_id_fkey(nombre)),enlaces(tipo,estado,token,vence,canales,creado),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero&riesgos.order=creado.asc,descripcion.asc').catch(function () { return get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(id,descripcion,datos,composicion,suma_asegurada,creado),visitas(estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,plantilla,riesgo_ids,lugar,fuera_cobertura,no_inspeccionados,motivo_cierre,riesgos_enviados,ofertas_red(estado,origen,desde,hasta,minutos,nota,vence,inspector:usuarios!ofertas_red_inspector_id_fkey(nombre)),enlaces(tipo,estado,token,vence,canales,creado),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero&riesgos.order=creado.asc,descripcion.asc'); }).catch(function () { return get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(id,descripcion,datos,composicion,suma_asegurada,creado),visitas(estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,plantilla,riesgo_ids,lugar,fuera_cobertura,no_inspeccionados,motivo_cierre,ofertas_red(estado,origen,desde,hasta,minutos,nota,vence,inspector:usuarios!ofertas_red_inspector_id_fkey(nombre)),enlaces(tipo,estado,token,vence,canales,creado),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero&riesgos.order=creado.asc,descripcion.asc'); }),   // P-6f-0: riesgos en orden fijo («Vehículo 1, 2, 3» no cambia entre cargas).catch(function () { return get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(id,descripcion,datos,composicion,suma_asegurada,creado),visitas(estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,plantilla,riesgo_ids,lugar,fuera_cobertura,no_inspeccionados,motivo_cierre,riesgos_enviados,riesgos_en_curso,ofertas_red(estado,origen,desde,hasta,minutos,nota,vence,inspector:usuarios!ofertas_red_inspector_id_fkey(nombre)),enlaces(tipo,estado,token,vence),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero&riesgos.order=creado.asc,descripcion.asc').catch(function () { return get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(id,descripcion,datos,composicion,suma_asegurada,creado),visitas(estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,plantilla,riesgo_ids,lugar,fuera_cobertura,no_inspeccionados,motivo_cierre,riesgos_enviados,ofertas_red(estado,origen,desde,hasta,minutos,nota,vence,inspector:usuarios!ofertas_red_inspector_id_fkey(nombre)),enlaces(tipo,estado,token,vence),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero&riesgos.order=creado.asc,descripcion.asc'); }).catch(function () { return get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(id,descripcion,datos,composicion,suma_asegurada,creado),visitas(estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,plantilla,riesgo_ids,lugar,fuera_cobertura,no_inspeccionados,motivo_cierre,ofertas_red(estado,origen,desde,hasta,minutos,nota,vence,inspector:usuarios!ofertas_red_inspector_id_fkey(nombre)),enlaces(tipo,estado,token,vence),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero&riesgos.order=creado.asc,descripcion.asc'); }),   // P-6f-0: riesgos en orden fijo («Vehículo 1, 2, 3» no cambia entre cargas); })   // G-4c · SQL 74 (sin el SQL 74, la consulta de antes)
      get('eventos?select=caso_id,hora,accion,detalle,rol,actor_tipo,actor:usuarios!eventos_actor_id_fkey(nombre)&order=hora'),
      get('usuarios?select=nombre,tipo_inspector,estado,datos,tipo_identificacion,identificacion,agencia:agencias(nombre,ruc)&rol=eq.Inspector&estado=eq.Activo&order=nombre').catch(function () { return get('usuarios?select=nombre,tipo_inspector,estado,datos,agencia:agencias(nombre)&rol=eq.Inspector&estado=eq.Activo&order=nombre'); }).catch(function (e) { console.warn('[SIRIUS] inspectores:', e.message); return null; }),   // P-6f-0e · DEC-231
      get('usuarios?select=nombre,email,rol,tipo_inspector,estado,datos,auth_id,tipo_identificacion,identificacion,sucursal,agencia:agencias(nombre,ruc)&order=nombre').catch(function () { return get('usuarios?select=nombre,email,rol,tipo_inspector,estado,datos,auth_id,tipo_identificacion,identificacion,agencia:agencias(nombre,ruc)&order=nombre'); }).catch(function () { return get('usuarios?select=nombre,email,rol,tipo_inspector,estado,datos,auth_id,agencia:agencias(nombre)&order=nombre'); }).catch(function (e) { console.warn('[SIRIUS] usuarios:', e.message); return null; }),   // P-6f-0g · DEC-233
      get('agencias?select=nombre,estado,ruc,razon_social,nombre_comercial&order=nombre').catch(function () { return get('agencias?select=nombre,estado&order=nombre'); }).catch(function (e) { console.warn('[SIRIUS] agencias:', e.message); return null; })
      ,rpc('liq_honorarios', {}).then(function (rows) { return Array.isArray(rows) ? rows.map(function (x) {   // SQL 53b: con los datos del caso aunque el usuario no vea los casos
          return { id: x.id, estado: x.estado, aprobacion: x.aprobacion, calculo: x.calculo, ajuste: x.ajuste, subtotal: x.subtotal, liquidacion_id: x.liquidacion_id, factura_id: x.factura_id, proveedor_tipo: x.proveedor_tipo,
            fecha_inspeccion: x.fecha_inspeccion, visita_id: x.visita_id, _ref: x.riesgo_ref, inspector: x.inspector, agencia: x.agencia, visita: { modalidad: x.modalidad },
            riesgo: { id: null, descripcion: x.bien, datos: { placa: x.placa || '' }, _bien: x.bien, caso: { numero: x.caso, ramo: x.ramo, grupo_ramo: x.grupo, estado: x.estado_caso, asegurado: { nombre: x.asegurado }, datos: { sucursal: x.sucursal, linea: x.linea, orden: x.orden } } } }; }) : rows; })
        .catch(function () { return get('honorarios?select=id,estado,aprobacion,calculo,ajuste,subtotal,liquidacion_id,factura_id,proveedor_tipo,fecha_inspeccion,visita_id,riesgo:riesgos(id,descripcion,datos,creado,caso:casos(id,numero,ramo,grupo_ramo,estado,asegurado,datos)),inspector:usuarios!honorarios_inspector_id_fkey(nombre,identificacion),agencia:agencias(nombre,ruc),visita:visitas(modalidad,creado,caso_id)&riesgo_id=not.is.null&order=fecha_inspeccion').catch(function (e) { console.info('[SIRIUS] honorarios (SQL 53):', e.message); return null; }); })
      ,get('liquidaciones?select=id,numero,version,estado,proveedor_tipo,observaciones,motivo,subtotal,iva,total,factura_id,versiones,historial,agencia:agencias(nombre,ruc),usuario:usuarios(nombre,identificacion)&numero=not.is.null&order=numero').catch(function () { return null; })
      ,get('facturas?select=id,proveedor_tipo,clave,numero,fecha,sri,liquidaciones,honorarios,subtotal,estado,motivo,pago,historial,agencia:agencias(nombre,ruc),usuario:usuarios(nombre,identificacion)&order=creado').catch(function () { return null; })
      ,get('garantias?select=id,caso,riesgo,codigo,titulo,texto,ramo,prioridad,plazo_dias,vence,estado,origen,respaldo,cumplida_en,ampliaciones,endosos,historial&order=id').catch(function () { return null; })
      ,get('notificaciones?select=id,regla,canal,destinatario,estado,contenido,enviado_en,error,asunto,plantilla,destinatario_nombre,rol_destino,requiere_aprobacion,aprobado_por,aprobado_en,intentos,creado,caso:casos(numero)&order=creado.desc&limit=300').catch(function () { return get('notificaciones?select=id,regla,canal,destinatario,estado,contenido,enviado_en,error,caso:casos(numero)&order=enviado_en.desc&limit=300'); }).catch(function () { return get('notificaciones?select=id,regla,canal,destinatario,estado,contenido,enviado_en,caso:casos(numero)&order=enviado_en.desc&limit=300'); }).catch(function () { return null; })
      ,(CX.usuario && CX.usuario.email ? get('notificaciones?select=id,regla,estado,asunto,contenido,creado,rol_destino,caso:casos(numero)&canal=eq.App&destinatario=eq.' + encodeURIComponent(String(CX.usuario.email).toLowerCase()) + '&order=creado.desc&limit=60').catch(function () { return null; }) : Promise.resolve(null))
    ]).then(function (res) {
      var casos = res[0], evs = res[1], porCaso = {};
      if (Array.isArray(res[3])) CX.usuarios = res[3].map(function (u) { var d = u.datos || {}, t = String(u.tipo_inspector || '').toLowerCase(), al = d.alcance || {};
        return { nombre: u.nombre, email: u.email, rol: u.rol, roles: Array.isArray(d.roles) && d.roles.length ? d.roles : [u.rol],
                 tipo: u.agencia ? 'Agencia' : t === 'independiente' ? 'Independiente' : 'Interno', tipoInspector: t || null, agencia: u.agencia ? u.agencia.nombre : null,
                 estado: u.estado || 'Activo', celular: d.celular || '', alcance: { sucursales: Array.isArray(al.sucursales) ? al.sucursales : [], grupos: Array.isArray(al.grupos) ? al.grupos : [] },
                 vinculado: !!u.auth_id,   // R-5c · SQL 76: la cobertura, las zonas y la operación ya no salen de la ficha (las pone ponerRedEnUsuarios desde la Red)
                 historial: Array.isArray(d.historial) ? d.historial : [], tipoIdentificacion: u.tipo_identificacion || null, identificacion: u.identificacion || null,
                 agenciaRuc: u.agencia && u.agencia.ruc ? u.agencia.ruc : null,
                 sucursal: u.sucursal || (Array.isArray(al.sucursales) && al.sucursales[0] && al.sucursales[0] !== 'Todas' ? al.sucursales[0] : '') || '',   // SQL 62: todos los campos de la ficha única
                 }; });   // P-6f-0g · DEC-233 (historial: lo que guarda la base) · P-6f-b · DEC-214
      if (Array.isArray(res[4])) CX.agencias = res[4].map(function (a) { return { nombre: a.nombre, estado: a.estado || 'Activa', ruc: a.ruc || null, razonSocial: a.razon_social || a.nombre, nombreComercial: a.nombre_comercial || null }; });   // P-6f-b · DEC-214
      if (Array.isArray(res[5])) {   // P-6g · SQL 53 · DEC-247/248/249: contrato de SiriusLiqProceso
        var provDe = function (tipo, ag, us) { return tipo === 'agencia' ? { tipo: 'agencia', nombre: ag ? ag.nombre : '', identificacion: ag ? ag.ruc || '' : '' } : { tipo: 'inspector', nombre: us ? us.nombre : '', identificacion: us ? us.identificacion || '' : '' }; };
        var nVis = {};
        CX.honorarios = res[5].map(function (h) { var r = h.riesgo || {}, k = r.caso || {}, d = r.datos || {}, kd = k.datos || {}, a = k.asegurado || {}, c = h.calculo || {}, aj = h.ajuste || null;
          var est = String(k.estado || '');
          return { id: h.id, _rid: r.id, caso: String(k.numero || ''), orden: kd.orden || kd.numeroOrden || '', visita: h.visita_id, riesgo: h._ref || String(k.numero || ''), placa: d.placa || '', bien: r._bien || (d.placa ? [d.marca, d.modelo, d.anio].filter(Boolean).join(' ') : (r.descripcion || '')),
            asegurado: a.nombre || '', linea: kd.linea || k.grupo_ramo || '', sucursal: kd.sucursal || '', ramo: k.grupo_ramo === 'Vehículos' ? 'Vehículos' : (k.ramo || ''), modalidad: (h.visita && h.visita.modalidad) || 'Presencial',
            fecha: h.fecha_inspeccion ? isoLocal(h.fecha_inspeccion) : null, estadoCaso: est, inspector: h.inspector ? h.inspector.nombre : '', inspectorId: h.inspector ? h.inspector.identificacion || '' : '',
            proveedor: provDe(h.proveedor_tipo, h.agencia, h.inspector), aprobacion: h.aprobacion === 'Preacordada' ? 'Preacordada' : 'Liquidación',
            calificacion: /Calificado|Emitid|Asegurable/i.test(est) ? 'Asegurable' : /No asegurable|Rechaz/i.test(est) ? 'No asegurable' : 'Pendiente de calificación',
            calculo: { tarifario: c.tarifario || '', clase: c.clase || null, nivel: c.nivel || null, nivelSugerido: c.nivelSugerido || null, horasVisita: c.horasVisita != null ? +c.horasVisita : null, horasRedaccion: c.horasRedaccion != null ? +c.horasRedaccion : null,
              medidoVisita: c.medidoVisita != null ? +c.medidoVisita : null, medidoRedaccion: c.medidoRedaccion != null ? +c.medidoRedaccion : null, equipos: c.equipos != null ? +c.equipos : null, base: +(c.base || 0), ciudadBase: c.ciudadBase || null, ciudadVisita: c.ciudadVisita || null,
              enBase: c.enBase !== false, kmMedicion: c.kmMedicion || 'ida', km: +(c.km || 0), kmSugeridos: +(c.kmSugeridos || 0), valorKm: +(c.valorKm || 0), movilizacion: +(c.movilizacion || 0), subtotal: +(c.subtotal || 0) },
            ajuste: aj ? { nivel: aj.nivel || null, horasVisita: aj.horasVisita != null ? +aj.horasVisita : null, horasRedaccion: aj.horasRedaccion != null ? +aj.horasRedaccion : null, equipos: aj.equipos != null ? +aj.equipos : null, km: aj.km != null ? +aj.km : null, valor: aj.valor != null ? +aj.valor : null, comentario: aj.comentario || '' } : null,
            subtotal: +(h.subtotal || 0), estado: h.estado, liquidacionId: h.liquidacion_id || null, facturaId: h.factura_id || null }; });
        CX.liquidaciones = (res[6] || []).map(function (l) { return { id: l.id, numero: l.numero, version: l.version || 1, proveedor: provDe(l.proveedor_tipo, l.agencia, l.usuario), estado: l.estado,
            lineas: CX.honorarios.filter(function (h) { return h.liquidacionId === l.id; }).map(function (h) { return h.id; }),
            observaciones: (l.observaciones || []).map(function (o) { return { linea: o.linea, texto: o.texto || '', subtotalSugerido: o.subtotalSugerido == null ? null : +o.subtotalSugerido }; }),
            motivo: l.motivo || '', subtotal: +(l.subtotal || 0), iva: +(l.iva || 0), total: +(l.total || 0), facturaId: l.factura_id || null, versiones: (l.versiones || []).map(function (v) { return Object.assign({}, v, { cambios: Array.isArray(v.cambios) ? v.cambios : [] }); }), historial: l.historial || [] }; });   // SQL 53c: cambios siempre como lista
        CX.facturas = (res[7] || []).map(function (f) { return { id: f.id, proveedor: provDe(f.proveedor_tipo, f.agencia, f.usuario), clave: f.clave, numero: f.numero, fecha: f.fecha, sri: f.sri || null,
            liquidaciones: f.liquidaciones || [], honorarios: f.honorarios || [], subtotal: +(f.subtotal || 0), estado: f.estado, motivo: f.motivo || '', pago: f.pago || null, historial: f.historial || [] }; });
      }
      if (Array.isArray(res[8])) CX.garantias = res[8].map(function (g) { return { id: g.id, caso: String(g.caso || ''), riesgo: g.riesgo || '', codigo: g.codigo || '', titulo: g.titulo, texto: g.texto || '', ramo: g.ramo || '',
          prioridad: g.prioridad || 'Media', plazoDias: g.plazo_dias, vence: g.vence || null, estado: g.estado, origen: g.origen, respaldo: g.respaldo || null, cumplidaEn: g.cumplida_en ? isoLocal(g.cumplida_en) : null,
          ampliaciones: g.ampliaciones || [], endosos: g.endosos || [], historial: g.historial || [] }; });   // P-6g-2 · SQL 55
      if (Array.isArray(res[9])) CX.notificacionesEnvio = res[9].map(function (n) { return { id: n.id, caso: n.caso ? String(n.caso.numero) : '', regla: n.regla || '', canal: n.canal || '', destinatario: n.destinatario || '',
          estado: n.estado === 'Simulado' ? 'Enviado' : n.estado, contenido: n.contenido || '', fecha: n.enviado_en ? isoLocal(n.enviado_en) : (n.creado ? isoLocal(n.creado) : null), error: n.error || null,
          asunto: n.asunto || '', plantilla: n.plantilla || null, destinatarioNombre: n.destinatario_nombre || '', rolDestino: n.rol_destino || '', simulado: n.estado === 'Simulado',
          requiereAprobacion: !!n.requiere_aprobacion, aprobadoPor: n.aprobado_por || null, aprobadoEn: n.aprobado_en ? isoLocal(n.aprobado_en) : null, intentos: n.intentos || 0 }; });   // N-1 · SQL 58: la cola real
      if (Array.isArray(res[10])) CX.avisos = res[10].map(function (a) { return { id: a.id, caso: a.caso ? String(a.caso.numero) : '', regla: a.regla || '', titulo: a.asunto || '', texto: a.contenido || a.asunto || '',
          fecha: a.creado ? isoLocal(a.creado) : null, leido: a.estado === 'Leído', rol: a.rol_destino || '' }; });   // N-1c · SQL 61: avisos de la campana (canal App) del usuario actual
      if (Array.isArray(res[2])) CX.inspectores = res[2].map(function (u) { var d = u.datos || {}, t = String(u.tipo_inspector || '').toLowerCase();
        return { nombre: u.nombre, tipo: t === 'agencia' ? 'Agencia' : t === 'independiente' ? 'Independiente' : 'Interno', agencia: u.agencia ? u.agencia.nombre : null,
                 estado: u.estado || 'Activo',   // R-5c: sin zonas ni cobertura de la ficha
                 tipoIdentificacion: u.tipo_identificacion || null, identificacion: u.identificacion || null, agenciaRuc: u.agencia && u.agencia.ruc ? u.agencia.ruc : null }; });   // P-6f-b · DEC-214 · G-2b · DEC-223: sin cobertura, el prototipo migra las zonas
      evs.forEach(function (e) { (porCaso[e.caso_id] = porCaso[e.caso_id] || []).push(e); });
      var nuevo = { casos: casos.map(function (k) { return aCaso(k, porCaso[k.id]); }), eventos: {} };
      if (Array.isArray(CX.honorarios)) CX.honorarios.forEach(function (x) { if (x._rid && RREF[x._rid]) x.riesgo = RREF[x._rid]; delete x._rid; });   // «50012-V1»
      casos.forEach(function (k) { nuevo.eventos[String(k.numero)] = (porCaso[k.id] || []).map(aEvento); });
      var E = window.SIRIUS_EJEMPLO, det = {}, idPorCaso = {}; if (E && E.detallesCasos) nuevo.casos.forEach(function (c) { if (E.detallesCasos[c.id]) det[c.id] = E.detallesCasos[c.id]; });
      casos.forEach(function (k) { idPorCaso[k.id] = String(k.numero); });
      return cargarEvidencias(idPorCaso).catch(function (e) { console.warn('[SIRIUS] evidencias:', e.message); return { evidencias: CX.evidencias, controles: CX.controles, informes: CX.informes, calificaciones: CX.calificaciones }; }).then(function (ev) {
        nuevo.evidencias = ev.evidencias; nuevo.controles = ev.controles; nuevo.informes = ev.informes; nuevo.calificaciones = ev.calificaciones || {};
        nuevo.casos.forEach(function (c) { var inf = (ev.informes[c.id] || []).filter(function (x) { return x.criterio; }).slice(-1)[0]; if (inf) c.criterioInspector = { valor: inf.criterio.valor, comentario: inf.criterio.comentario || '', por: inf.criterio.por || '', hora: reloj(inf.criterio.hora) }; });
        var h = JSON.stringify([nuevo.casos, nuevo.eventos, Object.keys(ev.evidencias).map(function (k) { return k + ev.evidencias[k].length; }), ev.controles, ev.informes, ev.calificaciones]);
        if (h === huella) return false; huella = h; CX.casos = nuevo.casos; CX.eventos = nuevo.eventos; CX.detalles = det; CX.evidencias = ev.evidencias; CX.controles = ev.controles; CX.informes = ev.informes; CX.calificaciones = ev.calificaciones || {}; return true; });
    });
  }

  // G-2a2 · DEC-222: búsqueda de direcciones con OpenStreetMap (Nominatim). Se llama mientras se escribe: espera a que la persona
  // deje de escribir, hace como máximo una consulta por segundo (política de uso de Nominatim) y guarda lo ya buscado. Si no hay
  // respuesta o no encuentra nada, usa el diccionario de prueba del prototipo (SiriusUbicacion.buscarLocal).
  var GEO = { cache: {}, ultimo: 0, pend: null };
  function geoNorm(t) { return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/^(canton|distrito metropolitano de)\s+/, '').trim(); }
  function geoCiudad(nombres, cod) { var G = window.SIRIUS_GEOGRAFIA; if (!G || !G.ciudades) return cod || '';
    for (var i = 0; i < nombres.length; i++) { var n = geoNorm(nombres[i]); if (!n) continue;
      var c = G.ciudades.filter(function (x) { return x.estado !== 'INACTIVO' && (geoNorm(x.buscador) === n || geoNorm(x.nombre) === n); });
      if (c.length) return c[0].cod; }
    return cod || ''; }
  function geoTexto(x) { var a = x.address || {}, p = [[a.road, a.house_number].filter(Boolean).join(' '), a.neighbourhood || a.suburb || a.quarter, a.city || a.town || a.village || a.county].filter(Boolean);
    return p.length ? p.join(', ') : String(x.display_name || '').split(',').slice(0, 3).join(',').trim(); }
  function geoLocal(texto, cod) { var U = window.SiriusUbicacion; try { return U && typeof U.buscarLocal === 'function' ? U.buscarLocal(texto, cod) : []; } catch (e) { return []; } }
  CX.buscarDireccion = function (texto, cod) { var q = String(texto || '').trim(); if (q.length < 3) return Promise.resolve([]);
    var G = window.SIRIUS_GEOGRAFIA;
    var clave = q.toLowerCase() + '|' + (cod || ''); if (GEO.cache[clave]) return Promise.resolve(GEO.cache[clave]);
    return new Promise(function (res) {
      if (GEO.pend) { clearTimeout(GEO.pend.t); GEO.pend.res(null); }
      var p = { res: res }; GEO.pend = p;
      p.t = setTimeout(function () { GEO.pend = null; GEO.ultimo = Date.now();
        var ctr = G && G.centros && cod ? G.centros[cod] : null;   // G-2c4: la ciudad solo da preferencia (viewbox sin límite); la búsqueda es en todo el Ecuador
        var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&countrycodes=ec&accept-language=es' +
          (ctr ? '&bounded=0&viewbox=' + [ctr[1] - 0.35, ctr[0] + 0.35, ctr[1] + 0.35, ctr[0] - 0.35].join(',') : '') + '&q=' + encodeURIComponent(q + ', Ecuador');
        fetch(url, { headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : []; }).then(function (a) {
          var out = (Array.isArray(a) ? a : []).map(function (x) { var ad = x.address || {};
            return { texto: geoTexto(x), ciudad: geoCiudad([ad.city, ad.town, ad.municipality, ad.county, ad.village], cod), punto: [+(+x.lat).toFixed(6), +(+x.lon).toFixed(6)] }; })
            .filter(function (x) { return isFinite(x.punto[0]) && isFinite(x.punto[1]); });
          if (!out.length) out = geoLocal(q, cod); GEO.cache[clave] = out; res(out);
        }, function () { res(geoLocal(q, cod)); });
      }, Math.max(450, 1100 - (Date.now() - GEO.ultimo)));
    }).then(function (r) { return r === null ? [] : r; });   // una búsqueda reemplazada por otra más nueva devuelve []
  };
  CX.listo = get('usuarios?select=nombre,email,rol,tipo_inspector,datos,identificacion,agencia:agencias(nombre,ruc)&auth_id=eq.' + (sesion.user && sesion.user.id)).catch(function () { return get('usuarios?select=nombre,email,rol,tipo_inspector,datos,agencia:agencias(nombre)&auth_id=eq.' + (sesion.user && sesion.user.id)); })
    .then(function (us) {
      var u = us && us[0]; if (!u) { salir('Tu correo no está habilitado en SIRIUS.'); throw new Error('sin usuario'); }
      var roles = (u.datos && u.datos.roles) || [u.rol]; if (roles.indexOf(u.rol) < 0) roles.unshift(u.rol);
      CX.usuario = { nombre: u.nombre, email: u.email, correo: u.email, rol: u.rol, roles: roles, tipoInspector: u.tipo_inspector, agencia: u.agencia ? u.agencia.nombre : null,
        agenciaRuc: u.agencia && u.agencia.ruc ? u.agencia.ruc : null, identificacion: u.identificacion || null, tipo: u.agencia ? 'Agencia' : String(u.tipo_inspector || '').toLowerCase() === 'independiente' ? 'Independiente' : 'Interno' };   // P-6g: el proveedor de Liquidaciones (agencia por RUC o independiente)
      var origenes = get('configuracion?select=clave,version,origen,creado&vigente=is.true').then(function (fs) { (fs || []).forEach(function (x) { ORIGEN[x.clave] = { origen: x.origen, version: x.version, creado: x.creado }; }); })
        .catch(function (e) { console.warn('[SIRIUS] origen de la configuración no disponible:', e.message); });
      return Promise.all([Promise.all([rpc('configuracion_vigente', {}), origenes]).then(function (r) { CONFIG = r[0] || {}; Object.keys(ARCH).forEach(aplicar); aplicarEspeciales(); evento('*'); })
        .catch(function (e) { console.warn('[SIRIUS] configuración de la base no disponible:', e.message); }), cargarCasos()]);
    })
    .then(function () { avisar(); setInterval(function () { cargarCasos().then(function (c) { if (c) avisar(); }).catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); }); }, SONDEO_MS); })
    .catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); else { console.error('[SIRIUS] conexión:', e); aviso('no se pudieron leer los casos (' + String(e.message || e).slice(0, 220) + ')'); } });
})();
