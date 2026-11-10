// SIRIUS · Autoinspección: enlace, flujo, controles, video y apariencia (v2.4 · provisional · etapa 15-1 · 06/11/2026)
// v2.5 (etapa C2-9b · DEC-188): el catálogo de controles pasó a Administración › Controles (datos-controles.js); aquí queda la referencia `controlesCatalogo`.
// v2.4: controles «Año del documento del portal distinto de la solicitud» (media) y «Llegada del inspector fuera de los 150 m» (media) · DEC-173.
// v2.3: bloques de los horarios cada 30 minutos (confirmación inmediata y red), de la búsqueda en la red (DEC-172), del lugar por grupo de ramo
//       y de la cámara guiada de documentos; tarea «Sin inspector en la red» para el Coordinador.
// v2.2: bloques de contenido de las pantallas del portal del caso (Mi inspección, Agenda, cita, día de la visita y Documentos · DEC-171) con sus
//       variables, y la tarea «Cita cancelada por el cliente» para el Coordinador.
// v2.1: ciclo de vida del enlace (enlace.ciclo): estados, entrega y apertura simuladas, ampliación de vigencia, recordatorios (reglas R13 a R15 de
//       Notificaciones), aviso al vencer (R16) y solicitudes del cliente desde el portal como tarea del Coordinador (R17). Decisión DEC-169.
// v2.0: contenido de cada pantalla del portal parametrizable con variables (DEC-162) y pasos retirados fuera de la lista.
// v1.9: estructura en dos niveles (Portal del cliente global y Autoinspección de cada plantilla), apariencias como
//       catálogo con logo editable y asignación por compañía o agencia, y un simulador único del portal.
// v1.8: video de 1 a 10 MB; OCR con votación entre variantes y verificación contra el dato esperado; bienvenida con los
//       documentos reales del recorrido.
// v1.7: kilometraje en foto propia, tablero completo (volante y tablero) y tablero central; extras «Declarado en la solicitud»;
//       video de al menos 4 MB; OCR con búsqueda de la zona de la placa; la falta de lectura no rechaza la foto.
// v1.6: auto más simple (tablero completo con kilometraje en una sola foto; sin volante, asientos, neumático ni cédula),
//       extras con «No lo tengo», validación del contenido de cada foto, video con vuelta completa (1 a 2 MB),
//       elección del tipo, salir y retomar, y registro en vivo de cada acción en el caso.
// v1.5: interior (volante, tablero de instrumentos, kilometraje, tablero completo, tablero central, asientos), neumático,
//       llanta de emergencia, extras declarados con foto, y VIN solo grabado (sin stickers) con ubicaciones probables.
// v1.4: pasos de autoinspección simplificados y parametrizables (6 fotos en vehículos, 9 en maquinaria), VIN único con ayuda,
//       placa leída de las fotos de frente y posterior, sin foto de cerca por defecto, sin comprobante, logo real.
// v1.3: guía con caja ajustada al contorno; frente y posterior al 86 % del alto, laterales al 92 % del ancho.
// v1.2: contorno más grande y centrado; aviso de bloqueo de rotación (iPhone y Android).
// v1.1: orientación única (fotos horizontales, documentos verticales al final) y disposición de la cámara.
// Fuente única de la configuración de la autoinspección del portal del cliente (todas las carrocerías y maquinaria).
// Se edita en Formularios › Autoinspección (pestañas Flujo, Controles, Video y Apariencia). Decisiones: DEC-146 a DEC-154.
window.SIRIUS_AUTOINSPECCION = {
  version: '2.3', vigencia: 'Provisional',
  // ---------- Enlace (DEC-146) ----------
  enlace: {
    regla: 'Un enlace único por riesgo con token aleatorio de al menos 128 bits; generar uno nuevo invalida el anterior.',
    acceso: 'Sin contraseña, sin código de verificación y sin pedir la cédula: muestra «Hola, <nombre>. ¿Eres tú?» con los datos del vehículo; «Sí, empezar» continúa y «No soy yo» avisa al Coordinador y cierra el enlace.',
    vigenciaDias: 10, recordatorioDias: 2,
    mitigaciones: ['Se envía solo al contacto registrado del caso', 'Vence y puede revocarse', 'Registra dispositivo, ubicación y horas de uso', 'Las alertas de control llegan al calificador'],
    ejemplo: { caso: '20186', riesgo: '20186-V1', token: 'k7Q2mX9dLr4Tz8Vb1Np6', url: 'https://clientes.asur.ec/a/k7Q2mX9dLr4Tz8Vb1Np6' },
    // ---------- Ciclo de vida del enlace (etapa 13 · DEC-169) ----------
    // El estado del enlace se CALCULA de su línea de tiempo (envíos, entregas, apertura, acciones, vencimiento) y del reloj; nunca se escribe a mano.
    // Prioridad cuando hay varios hechos: Revocado > Invalidado > Completado > Vencido > En curso > Abierto > Entregado > Enviado > Generado.
    ciclo: {
      estados: [
        { id: 'generado', nombre: 'Generado', tono: 'neutral', nota: 'Existe pero todavía no se envió al cliente.' },
        { id: 'enviado', nombre: 'Enviado', tono: 'brand', nota: 'Salió por al menos un canal; falta la confirmación de entrega.' },
        { id: 'entregado', nombre: 'Entregado', tono: 'brand', nota: 'El canal confirmó la entrega (Genesys para WhatsApp y SMS, Gmail para correo).' },
        { id: 'abierto', nombre: 'Abierto', tono: 'teal', nota: 'El cliente entró al portal con el enlace (primer acceso).' },
        { id: 'encurso', nombre: 'En curso', tono: 'teal', nota: 'El cliente ya hizo acciones; muestra el avance (N de M fotos).' },
        { id: 'completado', nombre: 'Completado', tono: 'success', nota: 'El cliente envió la autoinspección.' },
        { id: 'vencido', nombre: 'Vencido', tono: 'danger', nota: 'Llegó la fecha de vencimiento sin completar: el caso pasa a «Enlace caducado» (T05, desde «Agendado» o «En curso») y se avisa al Coordinador.' },
        { id: 'invalidado', nombre: 'Invalidado', tono: 'neutral', nota: 'Dejó de valer al generar uno nuevo, o porque alguien respondió «No soy yo».' },
        { id: 'revocado', nombre: 'Revocado', tono: 'danger', nota: 'El Coordinador lo revocó con motivo; el portal muestra el mensaje de enlace no válido.' },
      ],
      // Entrega y apertura simuladas en el prototipo: la confirmación de entrega llega del proveedor del canal; la apertura, del primer acceso al portal.
      entrega: { whatsapp: { minutos: 1, proveedor: 'Genesys Cloud (simulado)' }, sms: { minutos: 1, proveedor: 'Genesys Cloud (simulado)' }, correo: { minutos: 3, proveedor: 'Gmail API' } },
      // Ampliar la vigencia: el Coordinador suma días con motivo, sin pasar del máximo desde el envío del enlace.
      ampliacion: { opciones: [3, 5, 7], maximoDias: 20, regla: 'Se puede ampliar mientras el enlace esté vigente y sin pasar del máximo de días contados desde su envío. Un enlace vencido no se amplía: se genera uno nuevo.' },
      // Los recordatorios son reglas de Notificaciones (editables en Portal del cliente › Flujo); cada una respeta el consentimiento de canal del cliente y el horario de envío a clientes.
      recordatorios: ['R13', 'R14', 'R15'],
      avisoVencimiento: 'R16', solicitudesPortal: 'R17',
      // Mensaje del portal cuando el enlace fue revocado (el mismo de «enlace no válido»).
      portalRevocado: { titulo: 'Este enlace ya no es válido', texto: 'Aseguradora del Sur lo desactivó. Si todavía necesitas inspeccionar tu vehículo, llámanos y te enviamos uno nuevo.' },
      // Tareas del Coordinador que crea el portal (aparecen en «Para hoy» de su Inicio).
      tareas: {
        pedirEnlace: { titulo: 'Pedir un enlace nuevo', accion: 'Generar un enlace nuevo', detalle: 'El cliente pidió desde el portal un enlace nuevo porque el suyo venció.' },
        noSoyYo: { titulo: 'Revisar el contacto', accion: 'Revisar el contacto y generar un enlace nuevo', detalle: 'Quien abrió el enlace respondió «No soy yo»: el enlace quedó invalidado.' },
        redSinInspector: { titulo: 'Sin inspector en la red', accion: 'Coordinar la visita', detalle: 'Nadie de la red aceptó a tiempo el horario que el cliente pidió desde el portal; el cliente puede elegir otro.' }, // etapa 14b · DEC-172
        citaCancelada: { titulo: 'Cita cancelada por el cliente', accion: 'Coordinar una nueva visita', detalle: 'El cliente canceló desde el portal la cita que había agendado; el caso volvió a «En coordinación».' }, // etapa 14
      },
      // Historias de las escenas del ciclo (el prototipo las siembra al montarlas; la hora de cada hecho es la del reloj del prototipo: 18/10/2026 20:30).
      // Los recordatorios (R13 a R15) y el vencimiento NO se escriben aquí: el motor los calcula con las reglas de Notificaciones y las fechas del enlace.
      escenas: {
        // 20186 con el enlace en curso: enviado el 12/10, el cliente lo abrió el 15/10 después del primer recordatorio y se detuvo a medias.
        enlaceciclo: { caso: '20186', estadoCaso: 'En curso', visitaEstado: 'En curso', avance: '6 de 16 fotos',
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-12T09:00', vence: '2026-10-22T09:00',
            eventos: [{ at: '2026-10-15T09:40', tipo: 'apertura' }, { at: '2026-10-15T09:45', tipo: 'accion', avance: '2 de 16 fotos' }, { at: '2026-10-15T10:30', tipo: 'accion', avance: '6 de 16 fotos' }] }] },
        // Enlace sin abrir que ya se amplió una vez (+7 días): quedan 3 días hasta el máximo, así que +5 y +7 no caben.
        enlaceampliar: { caso: '20186', estadoCaso: 'Agendado', visitaEstado: 'Agendada', dialogo: { tipo: 'ampliar', motivo: 'El cliente viaja y regresa el lunes 26 de octubre.' },
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-12T09:00', vence: '2026-10-29T09:00',
            eventos: [{ at: '2026-10-16T11:10', tipo: 'ampliacion', dias: 7, motivo: 'El cliente está de viaje hasta el viernes.', por: 'Andrea Salazar', de: '2026-10-22T09:00', a: '2026-10-29T09:00' }] }] },
        // Enlace entregado ayer, con el modal «Revocar» abierto (el motivo es obligatorio).
        enlacerevocar: { caso: '20186', estadoCaso: 'Agendado', visitaEstado: 'Agendada', dialogo: { tipo: 'revocar', motivo: 'El contacto informó que el vehículo fue vendido.' },
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-17T10:00', vence: '2026-10-27T10:00', eventos: [] }] },
        // El mismo enlace ya revocado: quien lo abre en el portal ve «Este enlace ya no es válido».
        enlacerevocado: { caso: '20186', estadoCaso: 'Agendado', visitaEstado: 'Agendada',
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-17T10:00', vence: '2026-10-27T10:00', revocado: true, revocadoEn: '2026-10-18T20:05', revocadoMotivo: 'El contacto informó que el vehículo fue vendido.', revocadoPor: 'Andrea Salazar', eventos: [] }] },
        // Dos tareas que llegaron desde el portal: un enlace vencido (20152) y un «No soy yo» (20186, enlace invalidado).
        enlacetarea: { caso: '20186', estadoCaso: 'Agendado', visitaEstado: 'Agendada',
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-18T19:30', vence: '2026-10-28T19:30', anulado: true, eventos: [{ at: '2026-10-18T20:12', tipo: 'invalidacion', motivo: 'Respondió «No soy yo»' }] }],
          tareas: [{ tipo: 'pedirEnlace', caso: '20152', at: '2026-10-18T19:55', por: 'Luis Fernando Cevallos', asegurado: 'Luis Fernando Cevallos', token: '20152-AI' },
            { tipo: 'noSoyYo', caso: '20186', at: '2026-10-18T20:12', por: 'Contacto sin identificar', asegurado: 'Transportes del Litoral S.A.', token: 'k7Q2mX9dLr4Tz8Vb1Np6' }] },
        // Enlace de 10 días enviado el 06/10 que nadie abrió: recordatorios R13 y R15, venció el 16/10 y el caso pasó a «Enlace caducado» (T05).
        enlacevencido: { caso: '20186', estadoCaso: 'Agendado', visitaEstado: 'Agendada',
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-06T09:00', vence: '2026-10-16T09:00', eventos: [] }] },
        // Etapa 10b-c · el cliente abrió el enlace el 07/10 y subió 3 fotos; no volvió. Venció el 16/10 con la autoinspección «En curso»: el caso pasa a «Enlace caducado» (T05 también sale de «En curso») y lo cargado queda guardado.
        // Con «Generar uno nuevo» (T06) el enlace nuevo continúa desde esas 3 fotos. `guardarAvance` = preset del portal que se deja guardado para el token.
        enlacevencidocurso: { caso: '20186', estadoCaso: 'En curso', visitaEstado: 'En curso', avance: '3 de 10 fotos', guardarAvance: 'portalmapa',
          enlaces: [{ token: 'k7Q2mX9dLr4Tz8Vb1Np6', envio: '2026-10-06T09:00', vence: '2026-10-16T09:00',
            eventos: [{ at: '2026-10-07T08:40', tipo: 'apertura' }, { at: '2026-10-07T08:50', tipo: 'accion', avance: '1 de 10 fotos' }, { at: '2026-10-07T10:05', tipo: 'accion', avance: '3 de 10 fotos' }] }] },
      },
    },
  },
  // ---------- Flujo (anexo 7.4 actualizado) ----------
  flujo: [
    { id: 'confirmacion', nombre: '¿Eres tú?', activo: true, fijo: true },
    { id: 'consentimiento', nombre: 'Consentimientos (datos, WhatsApp, SMS)', activo: true, fijo: true, nota: 'Texto pendiente de la definición LOPDP' },
    { id: 'identidad', nombre: 'Código por SMS y cédula', activo: false, retirado: true, nota: 'Retirado por DEC-146' },
    { id: 'mapa', nombre: 'Mapa de captura y fotos', activo: true, fijo: true },
    { id: 'documentos', nombre: 'Documentos', activo: true },
    { id: 'fotoCerca', nombre: 'Fotos de cerca pedidas por el sistema', activo: false, nota: 'Desactivado por defecto (DEC-155): solo se pide si el motor de daños necesita detalle; puede activarse aquí' },
    { id: 'video360', nombre: 'Video de 360°', activo: true },
    { id: 'revision', nombre: 'Revisión', activo: true, fijo: true },
    { id: 'declaracion', nombre: 'Declaración', activo: true, fijo: true },
    { id: 'comprobante', nombre: 'Comprobante descargable al final', activo: false, retirado: true, nota: 'Retirado (DEC-155): el cliente recibe la confirmación en pantalla y por el canal elegido' },
  ],
  retomar: 'Al volver con el mismo enlace: «Hola de nuevo» con el avance (N de M fotos y video) y miniaturas de lo cargado; «Continuar donde quedé» lleva al mapa con lo hecho marcado. El avance se guarda en el servidor por cada foto aceptada.',
  // ---------- Cámara (DEC-154) ----------
  camara: {
    vivo: 'Cámara en vivo en la página (https) con el contorno punteado encima y validaciones reales: orientación por giroscopio, luz y contraluz, nitidez y movimiento (acelerómetro), encuadre con detector de vehículos (en maquinaria, contenido dentro del contorno), reflejo en placas y documentos. El disparador se habilita con todo en verde por 0,5 s.',
    orientacion: 'Todas las fotos del vehículo o equipo en horizontal (también frente, posterior, placas, VIN, tablero y neumáticos), para que el cliente no gire el celular en cada paso. Los documentos se toman al final y en vertical (la tarjeta queda horizontal dentro del marco). Un solo aviso de giro al empezar y otro al pasar a documentos.',
    horizontal: 'En los pasos horizontales pide pantalla completa y fija la orientación horizontal (Android); si no se puede, muestra «Gira el celular» y bloquea la captura.',
    bloqueoRotacion: 'Si el giroscopio indica que el celular está horizontal pero la pantalla sigue vertical (bloqueo de rotación, habitual en iPhone, donde el navegador no permite fijar la orientación), la cámara no dibuja la guía girada: muestra «Tu pantalla no está girando» con la instrucción para desbloquear la rotación (iPhone: Centro de control › candado; Android: ajustes rápidos › rotación automática) y bloquea la captura hasta que la pantalla gire.',
    disposicion: 'El contorno ocupa el centro de la pantalla, centrado en ambos ejes: en horizontal hasta el 86 % del alto (frente y posterior) o el 92 % del ancho (laterales), con el dibujo ajustado a su contorno (SIRIUS_SILUETAS cajaContorno) para que el vehículo quede cerca y bien encuadrado; en vertical hasta el 94 % del ancho. Los indicadores van abajo en una fila compacta y translúcida (solo nombre y estado: Horizontal, Encuadre, Luz, Nitidez, Reflejo); encima, un único mensaje con la corrección que falta, o «Listo: toma la foto» en verde. El disparador, a la derecha en horizontal y abajo en vertical. El nivel, pequeño arriba a la derecha.',
    captura: 'Se guarda exactamente el área visible (lo que se ve es lo que se guarda) y la posición del contorno para compararlo al revisar.',
    respaldo: 'Si la cámara en vivo no está disponible o se niega el permiso, usa la cámara del sistema (sin galería); la foto queda «Encuadre no verificado».',
    tomarIgual: 'Si el encuadre no se puede verificar en 12 s, aparece «Tomar igual» y la foto queda marcada.',
    clienteNoVe: 'El cliente no ve lecturas OCR, coincidencias ni alertas: solo «Foto lista».',
  },
  // ---------- OCR (DEC-148) ----------
  ocr: [
    { paso: 'exteriores_frontal', dato: 'Placa', zona: 'Franja inferior central del contorno', patron: 'ABC1234 o AB123C', comparaCon: 'Placa de la solicitud y placa leída en la foto posterior' },
    { paso: 'exteriores_posterior', dato: 'Placa', zona: 'Franja inferior central del contorno', patron: 'ABC1234 o AB123C', comparaCon: 'Placa de la solicitud y placa leída en la foto del frente' },
    { paso: 'identificacion_vin', dato: 'VIN', patron: '17 caracteres sin I, O ni Q', comparaCon: 'VIN de la solicitud o de la matrícula' },
    { paso: 'interiores_kilometraje', dato: 'Kilometraje', patron: 'Número de 3 a 7 dígitos', comparaCon: 'Kilometraje de la solicitud o del informe anterior (alerta si baja)' },
    { paso: 'eq_placa_fabricante', dato: 'Serie (PIN)', patron: '17 caracteres (ISO 10261) o serie del fabricante', comparaCon: 'Serie de la solicitud' },
  ],
  // ---------- Pasos de la autoinspección (DEC-155) ----------
  // Configuración de la columna «Autoinspección» de cada plantilla en Formularios › pasos de foto. Los pasos desactivados no se
  // borran: el Administrador puede volver a activarlos o crear pasos nuevos (con su guía, posición en el mapa y OCR). Presencial y
  // virtual guiada no cambian. Posición = fracción del ancho y alto del ícono superior (frente a la derecha, lado izquierdo arriba).
  pasos: {
    vehiculos: { aplicaA: ['sedan', 'suv', 'camioneta'], activos: [
      { id: 'exteriores_frontal', nombre: 'Frente', guia: 'silueta frente', pos: [1, .5], ocr: 'placa', seccion: 'Mapa' },
      { id: 'exteriores_lateral_izquierdo', nombre: 'Lateral izquierdo', guia: 'silueta lateral izquierda', pos: [.5, 0], nuevo: true, reemplaza: ['exteriores_lateral_izquierdo_de_ade', 'exteriores_lateral_izquierdo_de_atr'], seccion: 'Mapa' },
      { id: 'exteriores_posterior', nombre: 'Posterior', guia: 'silueta posterior', pos: [0, .5], ocr: 'placa', seccion: 'Mapa' },
      { id: 'exteriores_lateral_derecho', nombre: 'Lateral derecho', guia: 'silueta lateral derecha', pos: [.5, 1], nuevo: true, reemplaza: ['exteriores_lateral_derecho_de_ade', 'exteriores_lateral_derecho_de_atr'], seccion: 'Mapa' },
      { id: 'motor_habitaculo_del_motor', nombre: 'Motor', guia: 'marco libre', pos: [.88, .5], texto: 'Con el capó abierto, que se vea el motor completo.', seccion: 'Mapa' },
      { id: 'identificacion_vin', nombre: 'VIN grabado', guia: 'franja', pos: [.8, .28], ocr: 'vin', ayuda: 'vin', valida: 'vin', nuevo: true, reemplaza: ['identificacion_chasis_en_relieve', 'identificacion_sticker_vin', 'identificacion_plaqueta_panoramica_vi'], seccion: 'Mapa' },
      { id: 'interiores_kilometraje', nombre: 'Kilometraje', guia: 'franja sobre el odómetro', ocr: 'kilometraje', valida: 'kilometraje', texto: 'Con el motor encendido, acércate al odómetro: que se lea solo el kilometraje.', seccion: 'Interior' },
      { id: 'interiores_tablero_completo', nombre: 'Tablero completo', guia: 'marco libre', texto: 'Desde el asiento de atrás: el volante y todo el tablero en la imagen.', seccion: 'Interior' },
      { id: 'interiores_tablero_central', nombre: 'Tablero central con radio', guia: 'marco libre', texto: 'La consola central con el radio o la pantalla encendidos.', seccion: 'Interior' },
      { id: 'llanta_emergencia', nombre: 'Llanta de emergencia', guia: 'círculo', texto: 'Abre la cajuela o el compartimento y fotografía la llanta completa.', seccion: 'Interior' },
    ], desactivados: [
      { id: 'exteriores_parabrisas', motivo: 'Se ve en la foto del frente' },
      { id: 'identificacion_placa_delantera', motivo: 'La placa se lee de la foto del frente' },
      { id: 'identificacion_placa_trasera', motivo: 'La placa se lee de la foto posterior' },
      { id: 'exteriores_lateral_izquierdo_de_ade', motivo: 'Repetía la silueta: un solo lateral izquierdo' }, { id: 'exteriores_lateral_izquierdo_de_atr', motivo: 'Repetía la silueta: un solo lateral izquierdo' },
      { id: 'exteriores_lateral_derecho_de_ade', motivo: 'Repetía la silueta: un solo lateral derecho' }, { id: 'exteriores_lateral_derecho_de_atr', motivo: 'Repetía la silueta: un solo lateral derecho' },
      { id: 'identificacion_chasis_en_relieve', motivo: 'Un solo paso de VIN con ayuda de ubicación' },
      { id: 'llantas_delantera_derecha', motivo: 'Simplificación del recorrido (revisión de campo)' }, { id: 'interiores_tablero_instrumentos', motivo: 'Lo cubren el tablero completo y el kilometraje' },
      { id: 'interiores_volante', motivo: 'Simplificación del recorrido (revisión de campo)' }, { id: 'interiores_asientos', motivo: 'Simplificación del recorrido (revisión de campo)' },
      { id: 'documentos_cedula_frontal', motivo: 'Simplificación del recorrido (revisión de campo)' }, { id: 'documentos_cedula_posterior', motivo: 'Simplificación del recorrido (revisión de campo)' }, { id: 'identificacion_sticker_vin', motivo: 'Un solo paso de VIN' }, { id: 'identificacion_plaqueta_panoramica_vi', motivo: 'Un solo paso de VIN' },
    ] },
    motos: { aplicaA: ['moto'], activos: ['exteriores_frontal', 'exteriores_lateral_izquierdo', 'exteriores_posterior (placa)', 'exteriores_lateral_derecho', 'interiores_kilometraje (kilometraje)', 'motor_habitaculo_del_motor', 'identificacion_vin'], nota: 'La moto solo lleva placa posterior; sin interior ni llanta de emergencia' },
    maquinaria: { aplicaA: ['cargadora', 'excavadora', 'montacargas', 'generico'], activos: [
      { id: 'eq_frontal', pos: [1, .5] }, { id: 'eq_lateral_izquierdo', pos: [.5, 0], nuevo: true, reemplaza: ['eq_diag_del_izq', 'eq_diag_pos_izq'] }, { id: 'eq_posterior', pos: [0, .5] }, { id: 'eq_lateral_derecho', pos: [.5, 1], nuevo: true, reemplaza: ['eq_diag_del_der', 'eq_diag_pos_der'] },
      { id: 'eq_tablero', pos: [.52, .42] }, { id: 'eq_placa_fabricante', pos: [.38, .74], ocr: 'serie', ayuda: 'serie' }, { id: 'eq_motor', pos: [.2, .5] }, { id: 'eq_implemento', pos: [.9, .5] }, { id: 'eq_rodaje', pos: [.28, .12] },
    ] },
    secciones: 'El mapa muestra exterior, neumático, motor y VIN; el interior, los extras y los documentos van en secciones aparte debajo del mapa (tarjetas), para no saturar el dibujo.',
    documentos: 'Vehículos: matrícula y licencia (frente y reverso); la cédula queda desactivada. Maquinaria: matrícula o constancia de trámite, licencia del operador (frente y reverso) y ficha técnica. Al final y en vertical.',
  },
  // ---------- Extras declarados (DEC-156) ----------
  extras: {
    catalogo: 'Catálogos maestros › Extras de vehículo (lo administra la compañía): nombre, carrocerías a las que aplica, si exige foto, campos a detallar y estado. Base actual: SIRIUS_EJEMPLO.catalogos.extras (11).',
    atributos: [
      { extra: 'Aros de aleación', aplicaA: 'Todas', foto: true, detalle: ['Marca', 'Rin (pulgadas)'] }, { extra: 'Láminas de seguridad', aplicaA: 'Todas', foto: true, detalle: ['Marca'] },
      { extra: 'Neblineros', aplicaA: 'Todas', foto: true, detalle: ['Marca'] }, { extra: 'Estribos', aplicaA: ['suv', 'camioneta'], foto: true, detalle: ['Material'] },
      { extra: 'Barra antivuelco', aplicaA: ['camioneta'], foto: true, detalle: ['Material'] }, { extra: 'Cubre balde', aplicaA: ['camioneta'], foto: true, detalle: ['Tipo (lona, rígido)'] },
      { extra: 'Radio con pantalla', aplicaA: 'Todas', foto: true, detalle: ['Marca', 'Modelo'] }, { extra: 'Cámara de retro', aplicaA: 'Todas', foto: true, detalle: ['Marca'] },
      { extra: 'Sensores de parqueo', aplicaA: 'Todas', foto: true, detalle: ['Marca'] }, { extra: 'Portaequipaje', aplicaA: ['suv', 'camioneta'], foto: true, detalle: ['Marca'] },
      { extra: 'Sistema de sonido', aplicaA: 'Todas', foto: true, detalle: ['Marca', 'Componentes'] },
    ],
    portal: 'Sección «Extras»: aparecen los extras declarados en la solicitud con la etiqueta «Declarado en la solicitud» (aún no hay póliza: la inspección decide si se asegura) y el cliente responde «Lo tengo» o «No lo tengo» en cada uno (ninguno es obligatorio, por si se declararon por error). «Lo tengo» pide el detalle (marca y lo que defina el catálogo) y activa su paso de foto; «No lo tengo» pide un motivo opcional (Nunca lo tuvo, Lo retiré, Está dañado, Otro). Puede agregar otros del catálogo filtrado por carrocería. Mensaje: «Estos extras fueron declarados al solicitar el seguro. Si tu vehículo no tiene alguno, márcalo «No lo tengo»: no es obligatorio fotografiarlo y tu asesor revisará el dato. Si tiene otro que no aparece, agrégalo».',
    avance: 'Para continuar al video, cada extra debe tener respuesta (Lo tengo con foto, o No lo tengo).',
    calificador: 'Lista de extras con su respuesta, detalle y foto; alertas «Extra agregado por el cliente (no estaba declarado)», «Extra declarado en la solicitud marcado No lo tengo» (con motivo; afecta el valor asegurado de extras) y «Extra sin foto».',
  },
  ayudas: {
    vin: { titulo: '¿Dónde está el VIN?', texto: 'Es el número de 17 caracteres que identifica al vehículo. Fotografía el número grabado en el metal o la plaqueta del parabrisas. No se aceptan stickers ni etiquetas. Basta con uno; también figura en la matrícula.',
      vista: 'superior (frente a la derecha, conductor arriba)',
      lugares: [{ pos: [.66, .22], texto: 'Plaqueta en la base del parabrisas, lado del conductor: se lee desde afuera' }, { pos: [.76, .5], texto: 'Pared de fuego: la lámina entre el motor y la cabina, grabado en el metal' },
        { pos: [.84, .26], texto: 'Torre del amortiguador delantero (domo), dentro del capó' }, { pos: [.5, .74], texto: 'Piso bajo el asiento del copiloto: levanta la tapa de la alfombra' }],
      camioneta: [{ pos: [.7, .96], texto: 'Larguero del chasis, lado derecho, detrás de la rueda delantera' }],
      moto: [{ pos: [.78, .5], texto: 'En el tubo de dirección, bajo el manubrio, grabado en el metal' }, { pos: [.5, .5], texto: 'En el chasis junto al motor, grabado' }],
      noAdmitidos: ['Sticker del marco de la puerta', 'Etiquetas adhesivas'] },
    serie: { titulo: '¿Dónde está la serie?', texto: 'Es el número de serie del fabricante (17 caracteres en la mayoría de equipos).',
      lugares: [{ pos: [.45, .62], texto: 'En el chasis, junto a la cabina: placa metálica del fabricante' }, { pos: [.5, .32], texto: 'Dentro de la cabina, en el marco o bajo el asiento' }] },
    presentacion: 'Antes de abrir la cámara en ese paso: silueta lateral con los lugares numerados y su texto; botón «Abrir la cámara».',
  },
  bienvenida: 'La lista «Ten a mano…» se arma con los documentos activos del recorrido (vehículos: matrícula y licencia de conducir; maquinaria: matrícula o trámite, licencia del operador y ficha técnica); nunca menciona documentos desactivados.',
  final: 'Pantalla de confirmación con el vehículo y la fecha; sin comprobante descargable. La confirmación también llega por el canal elegido (WhatsApp, SMS o correo).',

  // ---------- Validación del contenido de cada foto (DEC-157) ----------
  validacion: {
    objetivo: 'Rechazar en el momento la foto que no corresponde al paso, sin bloquear al cliente que sí la tomó bien.',
    capa1Celular: [
      'Detector de vehículos (red neuronal ligera en el celular): en frente, posterior y laterales exige un vehículo (o moto) que ocupe al menos el 35 % del ancho; la forma del recuadro distingue lateral (más de 1,45 veces más ancho que alto) de frente o posterior (menos de 2,1).',
      'Lectura OCR en el celular (placa, VIN y kilometraje): la placa se busca en la zona inferior del contorno de frente y posterior (la zona con más bordes de texto sobre fondo claro), se binariza (contraste y umbral de Otsu) y se lee solo la línea principal, sin «ECUADOR» ni el marco; VIN y kilometraje se leen con dos variantes (normal e invertida). Si no se logra leer, NO se rechaza: aviso «No pudimos leer…» con los botones «Mi foto se ve bien: continuar» y «Tomar de nuevo»; la lectura definitiva la hace el motor de extracción de SIRIUS.',
      'Foto repetida: huella perceptual de cada foto; si es casi igual a otra ya tomada, se rechaza.',
      'Calidad: luz, nitidez, encuadre y orientación ya se validan antes de disparar.',
    ],
    precisionOcr: 'Cada lectura se hace sobre varias variantes del recorte (umbral normal, invertido y desplazado ±25) y se vota carácter por carácter; VIN y kilometraje se leen solo dentro de la franja de la guía. La lectura no se usa a ciegas: se compara con el dato esperado (placa y VIN de la solicitud) tolerando los caracteres que el OCR confunde (O/0/Q/D/G, I/1/L, B/8, S/5, Z/2, G/6, A/4, T/7): exacta, «Coincide (carácter dudoso)» con hasta 2 caracteres confundibles, o «No coincide». El kilometraje de pantallas de 7 segmentos lo resuelve el motor de extracción de SIRIUS.',
    capa2Servidor: 'Motor de verificación por paso en SIRIUS (modelo de visión con un prompt por paso, versionado en Motores de IA): recibe la foto y el nombre del paso, responde coincide o no, confianza y motivo. Si no coincide con confianza alta, la foto queda «No corresponde al paso» para el calificador; las de confianza baja se marcan para revisión.',
    botones: 'Todas las opciones son botones (nunca solo texto): «Tomar de nuevo» y «Mi foto se ve bien: continuar» o «Mi foto es correcta: usarla igual».',
    rechazo: 'Mensaje claro con la razón y «Tomar de nuevo». Desde el segundo rechazo del mismo paso aparece «Mi foto es correcta: usarla igual»; queda marcada y genera alerta alta al calificador.',
    metricas: 'El motor registra rechazos, forzadas y confirmaciones del calificador por paso, para ajustar umbrales (falsos rechazos menores al 5 %).',
  },
  // ---------- Elección del tipo, salir y retomar (DEC-158) ----------
  tipo: { pantalla: 'Después de los consentimientos: «¿Qué tipo de vehículo es?» (sedán o hatchback, SUV o Jeep, camioneta, moto) o «¿Qué tipo de equipo es?» (cargadora, excavadora, montacargas, otro equipo), con el ícono de cada uno y el de la solicitud marcado.',
    regresar: 'En el mapa, «‹ Tipo: …» vuelve a esta pantalla. Si cambia el tipo con fotos tomadas: «Si cambias el tipo se borran las N fotos y el video que ya tomaste. ¿Quieres cambiarlo?»; al confirmar se borran y queda en la cronología.' },
  salir: 'Botón «Salir» en el encabezado desde los consentimientos: guarda el avance y muestra «Tu avance quedó guardado» con la fecha de vencimiento del enlace y «Volver a la inspección».',
  // ---------- Registro en vivo en el caso (DEC-159) ----------
  registroEnVivo: {
    regla: 'Cada acción del cliente se guarda en el caso al momento (no al final): cada foto aceptada sube con su hora, ubicación, dispositivo, validación y lecturas; el informe se va llenando y la cronología del caso registra cada acción.',
    acciones: ['Abrió el enlace', 'Confirmó «Soy yo»', 'Aceptó los consentimientos', 'Eligió o cambió el tipo', 'Permitió o negó la cámara', 'Permitió o negó la ubicación', 'Subió cada foto (hora y ubicación)', 'Foto rechazada por validación', 'Usó una foto rechazada', 'Respondió cada extra', 'Empezó a grabar y subió el video (duración, tamaño y vuelta)', 'Salió y retomó', 'Aceptó la declaración', 'Envió la inspección'],
    estados: 'Enlace enviado (Agendado con enlace vigente) → al primer acción después de abrir: En curso «Autoinspección en curso» con el avance (N de M fotos) visible en la Bandeja y el caso → al enviar: «Autoinspección cerrada» y pasa a Pendiente calificación según las reglas.',
  },
  // ---------- Controles y alertas para el calificador (DEC-149) ----------
  // Etapa C2-9b · DEC-188: el catálogo se movió a Administración › Controles (datos-controles.js, SIRIUS_CONTROLES), común a todas las modalidades.
  // La autoinspección usa los controles activos que aplican a «Autoinspección».
  controlesCatalogo: { fuente: 'SIRIUS_CONTROLES', modalidad: 'Autoinspección' },
  alertasVisibles: 'Solo roles calificadores (Ejecutivo de inspecciones, Suscriptor y Administrador) en el panel «Controles de la autoinspección» de la calificación y en el Informe interno; nunca en el portal ni en el Resumen para el APS.',
  // ---------- Video (DEC-151) ----------
  video360: { minBytes: 1048576, maxBytes: 10485760, maxSegundos: 45, vueltaMinGrados: 300, completitud: 'En el celular se mide la vuelta con la brújula y el giroscopio mientras graba; si queda por debajo de 300° se avisa al cliente (puede grabar de nuevo) y el motor de análisis del back-office lo confirma sobre el video y muestra la alerta «Video sin la vuelta completa».', orientacion: 'horizontal', bitrate: 1600000, animacion: 'Ícono superior del vehículo centrado en un círculo, con un celular que da la vuelta alrededor (simétrico)', texto: 'Graba una vuelta completa alrededor del vehículo, a unos 2 pasos y con el celular horizontal, sin cortar. Entre 1 y 10 MB (unos 15 a 40 segundos).' },
  // ---------- Estructura de la configuración (DEC-160) ----------
  estructura: {
    global: { donde: 'Formularios › Portal del cliente (nuevo, al nivel de las plantillas)', pestanas: ['Apariencias', 'Flujo', 'Controles', 'Video'], nota: 'Vale para todas las plantillas y todos los casos de la compañía' },
    plantilla: { donde: 'Formularios › plantilla › Autoinspección', pestanas: ['Recorrido', 'Validación', 'Documentos y extras'], nota: 'Propio de cada plantilla (Vehículos livianos, Motos, Equipo y maquinaria)' },
    enlaces: 'La plantilla muestra en una línea qué flujo y qué apariencia usa, con «Ir a Portal del cliente»; no repite su configuración.',
  },
  // ---------- Simulador del portal (DEC-161) ----------
  simulador: {
    regla: 'Una sola vista previa para todo lo que ve el cliente: el «Simulador del portal». Las vistas previas sueltas de cada pestaña se reemplazan por «Ver en el simulador», que lo abre en la pantalla correspondiente.',
    acceso: 'Botón «Simular portal» en el encabezado de la plantilla y en Portal del cliente; atajo «Ver en el simulador» en cada paso, mensaje de validación, extra, documento, texto de apariencia y paso del flujo.',
    disposicion: 'Panel a pantalla completa en tres zonas: a la izquierda, el índice del recorrido (todas las pantallas en orden, agrupadas: Entrada, Fotos, Interior, Extras, Documentos, Video, Cierre, Casos especiales); al centro, el celular a 390 px; a la derecha, «Qué configura esta pantalla» con enlaces «Editar» a la pestaña exacta. Arriba: plantilla, carrocería, apariencia, versión (Vigente o Borrador) y orientación (vertical u horizontal en las cámaras).',
    pantallas: ['¿Eres tú?', 'Consentimientos', 'Elegir el tipo', 'Mapa de captura', 'Cámara de cada paso (con su guía y chips)', 'Ayuda del VIN', 'Mensajes de validación (rechazo, aviso suave, usar igual)', 'Interior', 'Extras (Lo tengo / No lo tengo)', 'Documentos', 'Video de 360° (animación y grabación)', 'Revisión', 'Declaración', 'Gracias', 'Salir y retomar', 'Enlace vencido', 'Rotación bloqueada'],
    navegacion: 'Anterior y Siguiente, teclas de flecha, y clic en el índice; recuerda la última pantalla vista por plantilla.',
    datos: 'Usa el borrador si existe (marcado «Borrador») y un caso de ejemplo de la carrocería elegida; nada de lo que se hace en el simulador crea eventos ni cambia casos.',
  },
  // ---------- Pasos retirados del flujo ----------
  retirados: 'Los pasos retirados (Código por SMS y cédula, Comprobante) no aparecen en la lista ni en la numeración del flujo, ni en el simulador; quedan en un acordeón «Retirados (N)» cerrado al final, con su motivo y decisión, solo para consulta.',

  // ---------- Contenido de las pantallas (DEC-162) ----------
  // Cada pantalla del portal se arma con bloques de contenido editables; el texto vive en la apariencia (la de la compañía
  // define todo; la de una agencia solo reemplaza lo que cambia y el resto lo hereda). Se edita en el simulador, al lado del celular.
  contenido: {
    bloques: [
      { tipo: 'titulo', max: 60 }, { tipo: 'texto', max: 280 }, { tipo: 'lista', maxItems: 5, max: 90 }, { tipo: 'boton', max: 32 },
      { tipo: 'aviso', max: 160 }, { tipo: 'mensaje', max: 200, nota: 'Mensajes de validación, de rechazo y de error' },
    ],
    variables: {
      fuente: 'Diccionario de variables de Notificaciones (DEC-123), con su disponibilidad y clasificación LOPDP',
      disponibles: ['{{contacto.nombre}} (primer nombre)', '{{asegurado.nombre}}', '{{vehiculo.descripcion}} (marca, modelo y año)', '{{vehiculo.placa}}', '{{equipo.descripcion}}', '{{caso.numero}}', '{{enlace.vence}}', '{{compania.nombre}}', '{{compania.telefono}}', '{{agencia.nombre}}', '{{avance.hechas}} y {{avance.total}}', '{{paso.nombre}} (solo en cámara y mensajes)', '{{documentos.lista}}', '{{video.minimoMB}} y {{video.maximoMB}}', '{{riesgo.zona}} (zona de los cupos)', '{{cita.fecha}} y {{cita.franja}}', '{{inspector.nombre}} y {{inspector.credencial}} (el día de la visita)', '{{agenda.apartado}} (minutos)', '{{agenda.horasCambio}}', '{{documentos.pendientes}} y {{documentos.maxMB}}', '{{garantias.limite}}', '{{agenda.duracion}}', '{{red.consultados}}', '{{inspector.organizacion}}', '{{documento.cara}}'],
      sinDato: 'Cada variable puede llevar un texto alternativo para cuando no hay dato: {{vehiculo.placa | "tu vehículo"}}.',
      lopdp: 'Las variables clasificadas «dato sensible» (cédula, correo y celular completos) no se permiten en el portal; los «datos personales» se permiten solo en las pantallas posteriores a «¿Eres tú?». El editor lo bloquea con su explicación.',
      validacion: 'Variable desconocida, no disponible en esa pantalla o texto que supera el máximo: error en línea y no se publica.',
    },
    pantallas: [
      { id: 'eresTu', bloques: { titulo: 'Hola, {{contacto.nombre}}. ¿Eres tú?', texto: 'Vas a inspeccionar {{vehiculo.descripcion}} · {{vehiculo.placa | "sin placa"}}, solicitado por {{asegurado.nombre}}.', lista: ['Ten a mano {{documentos.lista}}', 'Busca un lugar con buena luz y espacio alrededor', '{{avance.total}} fotos guiadas y un video corto de 360°'], boton: 'Sí, soy {{contacto.nombre}}: empezar', boton2: 'No soy yo' }, sinDatosPersonalesAntes: true },
      { id: 'consentimientos', bloques: { titulo: 'Antes de empezar', texto: 'Texto de tratamiento de datos (pendiente de la definición LOPDP; requiere aprobación de Legal para publicar)', boton: 'Ver el mapa de fotos' }, aprobacion: 'Legal' },
      { id: 'tipo', bloques: { titulo: '¿Qué tipo de vehículo es?', texto: 'Lo usamos para mostrarte el contorno correcto en cada foto.', aviso: 'Si cambias el tipo se borran las {{avance.hechas}} fotos que ya tomaste.' } },
      { id: 'mapa', bloques: { titulo: 'Fotos de {{vehiculo.placa | "tu vehículo"}}', texto: 'Toca un punto para tomar esa foto. El azul es el siguiente.' } },
      { id: 'camara', bloques: { texto: 'Texto de ayuda de cada paso (se edita en Recorrido › paso › Guía)' }, nota: 'Los textos por paso viven en el paso' },
      { id: 'validacion', bloques: { mensaje: 'Mensajes por tipo de validación (rechazo, aviso suave, usar igual) con {{paso.nombre}}' } },
      { id: 'extras', bloques: { titulo: '¿Tu vehículo tiene estos extras?', texto: 'Estos extras fueron declarados al solicitar el seguro. Si tu vehículo no tiene alguno, márcalo «No lo tengo».' } },
      { id: 'video', bloques: { titulo: 'Un video corto de 360°', texto: 'Graba una vuelta completa alrededor de {{vehiculo.descripcion}}, sin cortar. Entre {{video.minimoMB}} y {{video.maximoMB}} MB.' } },
      { id: 'declaracion', bloques: { titulo: 'Declaración', texto: 'Declaro que las fotos y el video fueron tomados hoy a {{vehiculo.descripcion}} {{vehiculo.placa | ""}} y que la información es verdadera.', boton: 'Enviar la inspección' }, aprobacion: 'Legal' },
      { id: 'gracias', bloques: { titulo: '¡Listo, {{contacto.nombre}}!', texto: 'Recibimos tu inspección del caso {{caso.numero}}. {{compania.nombre}} la revisará y te avisará si necesita algo más.' } },
      { id: 'salir', bloques: { titulo: 'Tu avance quedó guardado', texto: 'Llevas {{avance.hechas}} de {{avance.total}} fotos. Puedes volver con el mismo enlace hasta el {{enlace.vence}}.' } },
      { id: 'vencido', bloques: { titulo: 'Este enlace venció', texto: 'Venció el {{enlace.vence}}. Escríbenos al {{compania.telefono}} o pide uno nuevo.', boton: 'Pedir un enlace nuevo' }, sinDatosPersonalesAntes: true },
      { id: 'rotacion', bloques: { titulo: 'Tu pantalla no está girando', texto: 'Desactiva el bloqueo de rotación y vuelve a girar el celular.' } },
      // Etapa 14 · portal del caso (DEC-171): mismo enlace, navegación «Mi inspección», «Agenda» y «Documentos».
      { id: 'miInspeccion', bloques: { titulo: 'Hola, {{contacto.nombre}}', texto: 'Tu inspección de {{vehiculo.descripcion | "tu vehículo"}} · {{vehiculo.placa | ""}}', aviso: 'Documentos pendientes: {{documentos.pendientes}}.', boton: 'Ver documentos', boton2: 'Ver o cambiar la cita', mensaje: '¿Dudas? Escríbenos o llámanos al {{compania.telefono}}.' } },
      { id: 'autoAccion', bloques: { titulo: 'Tu autoinspección', texto: 'Llevas {{avance.hechas}} de {{avance.total}} fotos. Puedes terminarla con este enlace hasta el {{enlace.vence}}.', boton: 'Continuar la autoinspección' } },
      { id: 'agendarAccion', bloques: { titulo: 'Agenda tu inspección', texto: 'Elige el día y la hora en que un inspector visite tu vehículo.', boton: 'Elegir fecha y hora' } },
      { id: 'agendaDia', bloques: { titulo: '¿Qué día te queda bien?', texto: 'Horarios con inspectores en {{riesgo.zona}} · la visita dura alrededor de {{agenda.duracion}}.', titulo2: 'Confirmación inmediata', texto2: 'Un inspector tiene ese horario libre: te lo guardamos {{agenda.apartado}} minutos mientras confirmas.', titulo3: 'Otros horarios', texto3: 'Buscamos un inspector de nuestra red y te avisamos apenas uno acepte.', aviso: 'Te guardamos este horario {{agenda.apartado}} minutos mientras confirmas.', boton: 'Continuar' } },
      { id: 'agendaLugar', bloques: { titulo: '¿Dónde está el vehículo?', texto: 'Ten a mano la matrícula y deja el vehículo con acceso para tomar fotos a su alrededor.', titulo2: '¿Dónde está el bien que vamos a inspeccionar?', texto2: 'Indica la dirección del local o bodega y quién recibe al inspector; ten a mano los documentos que te pedimos.', titulo3: '¿Dónde está el equipo?', texto3: 'Deja el equipo accesible y, si puedes, encendido para revisar el horómetro.', boton: 'Confirmar la cita', boton2: 'Usar mi ubicación actual' } },
      { id: 'agendaListo', bloques: { titulo: '¡Listo! Tu inspección está agendada', texto: 'Te recordaremos el día anterior por WhatsApp o SMS.', boton: 'Ver mi inspección', boton2: 'Agregar a mi calendario' } },
      { id: 'cita', bloques: { titulo: 'Tu cita', texto: 'Puedes cambiarla o cancelarla hasta {{agenda.horasCambio}} horas hábiles antes.', mensaje: 'Faltan menos de {{agenda.horasCambio}} horas hábiles para tu cita: para cambiarla o cancelarla, llámanos al {{compania.telefono}}.', boton: 'Cambiar fecha u hora', boton2: 'Cancelar la cita', aviso: '¿Cancelar la cita? Podrás agendar otra cuando quieras.' } },
      { id: 'red', bloques: { titulo: 'Te estamos buscando un inspector', texto: 'Enviamos tu cita a {{red.consultados}} inspectores de la red cerca de {{riesgo.zona}}. Te avisamos apenas uno acepte.', titulo2: 'Tu inspección está confirmada', texto2: 'Te atenderá {{inspector.nombre}} ({{inspector.organizacion}}), credencial {{inspector.credencial}}. Te enviamos la confirmación por WhatsApp.', titulo3: 'No encontramos un inspector para ese horario', texto3: 'Elige otro horario y lo intentamos de nuevo.', boton: 'Elegir otro horario', boton2: 'Cambiar el horario', boton3: 'Cancelar la búsqueda' } },
      { id: 'camaraDoc', bloques: { titulo: 'Foto de {{documento.cara}}', mensaje: 'Acerca el documento hasta que sus bordes coincidan con el marco.', mensaje2: 'Gira el celular a vertical para tomar el documento.', mensaje3: 'Busca un lugar con más luz.', mensaje4: 'Mantén el celular quieto un momento.', mensaje5: 'Inclina un poco el documento para quitar el reflejo.', mensaje6: 'Listo: tomando la foto.', texto: 'Revisa que se lean todos los datos.', boton: 'Usar esta foto', boton2: 'Repetir', aviso: 'Tomada sin verificar el encuadre.' } },
      { id: 'camino', bloques: { titulo: 'Tu inspector va en camino', texto: 'Por tu seguridad, el inspector se identifica con su credencial de {{compania.nombre}}. Si algo no coincide, llámanos al {{compania.telefono}}.' } },
      { id: 'documentosCliente', bloques: { titulo: 'Documentos', texto: 'Súbelos desde tu celular. Te avisamos cuando los revisemos.', aviso: 'Acepta fotos o PDF de hasta {{documentos.maxMB}} MB. Los documentos se usan solo para tu inspección (LOPDP).', titulo2: 'Garantías por acreditar', texto2: 'Sube el respaldo de cada garantía de tu póliza antes del {{garantias.limite}}.', mensaje: 'La fecha límite fue el {{garantias.limite}}: súbelas cuanto antes o llámanos al {{compania.telefono}}.' } },
    ],
    herencia: 'Cada bloque de una apariencia de agencia muestra «Heredado de la compañía» o «Propio», con «Restablecer» para volver al heredado.',
    editor: 'En el simulador, el panel derecho «Qué configura esta pantalla» edita los bloques de esa pantalla en contexto (campo, contador de caracteres, insertar variable desde una lista con búsqueda, vista con datos de ejemplo y con datos vacíos), y el celular se actualiza al escribir. Publicar pide motivo y queda en el historial de la apariencia; los textos legales piden aprobación de Legal.',
    noEditable: 'Lo que garantiza la operación no se edita: orden de los pasos fijos, validaciones de seguridad y las etiquetas de los permisos del sistema operativo.',
  },

  // ---------- Apariencia (DEC-152, ampliada por DEC-160) ----------
  aparienciasCatalogo: {
    acciones: ['Crear (en blanco o duplicando otra)', 'Editar (crea un borrador de la apariencia)', 'Publicar (con motivo)', 'Inactivar', 'Eliminar: solo si nunca se usó en un enlace enviado y no está asignada; si no, Inactivar'],
    obligatoria: 'La apariencia de la compañía es la predeterminada: no se elimina ni se inactiva (sí se edita).',
    asignacion: 'Regla de asignación con precedencia: 1) agencia del caso (si tiene apariencia propia vigente), 2) compañía. La pestaña muestra qué apariencia usa cada agencia.',
    logo: 'Logo editable: subir PNG o SVG (máximo 1 MB, se recorta el margen y se valida que tenga fondo transparente o el fondo indicado), elegir de la biblioteca de logos (los de Documento PDF) o usar el logo de la agencia (Usuarios y roles › Agencias). Fondo del encabezado: claro u oscuro, con aviso si el logo no contrasta.',
    campos: ['Nombre', 'Logo y fondo del encabezado', 'Color principal y oscuro (verificación AA)', 'Textos de cada pantalla con variables (bienvenida, consentimientos, tipo, mapa, extras, video, declaración, gracias, enlace vencido, salir)', 'Contacto de ayuda (teléfono o WhatsApp)', 'Estado y versión'],
    ejemplos: 'Aseguradora del Sur (compañía, vigente) y Eurosurvey (agencia, borrador de ejemplo: se puede editar, inactivar o eliminar).',
  },
  apariencias: [
    { id: 'ads', nombre: 'Aseguradora del Sur', aplicaA: 'Todos los casos de la compañía', logo: 'assets/ads-horizontal.png', logoFondo: 'claro', encabezado: 'Blanco con el logo oficial a color', colorPrincipal: '#0B5CAD', colorOscuro: '#0B2E59',
      textos: { bienvenida: 'Vas a inspeccionar tu vehículo desde el celular. Te toma unos 10 minutos.', gracias: 'Un ejecutivo revisará tu inspección. Te avisaremos si necesitamos algo más.', declaracion: 'Declaro que las fotos y el video fueron tomados hoy al vehículo indicado y que la información entregada es verdadera.' }, estado: 'Vigente' },
    { id: 'eurosurvey', nombre: 'Eurosurvey (agencia)', aplicaA: 'Casos asignados a Eurosurvey', logo: 'logo de la agencia (Usuarios y roles › Agencias)', colorPrincipal: '#1B7F79', colorOscuro: '#0E4A47',
      textos: { bienvenida: 'Eurosurvey realiza esta inspección para Aseguradora del Sur. Toma unos 10 minutos.', gracias: 'Eurosurvey revisará tus fotos y te contactará si hace falta.' }, estado: 'Borrador' },
  ],
  aparienciaReglas: ['El color principal debe tener contraste AA con el blanco; si no, se avisa y no se publica.', 'Los textos admiten variables del diccionario (p. ej. {{contacto.nombre}}).', 'Vista previa móvil de cada pantalla antes de publicar; publicar pide motivo.'],
  // ---------- Tipos (DEC-153) ----------
  tipos: 'Todas las carrocerías de SIRIUS_SILUETAS: sedán, SUV o Jeep, camioneta, moto (mapa propio) y maquinaria (cargadora, excavadora, montacargas y equipo genérico, con el mapa de maquinaria). Equipo y maquinaria habilita la autoinspección con los pasos eq_* exigidos en presencial (frente, posterior, 4 diagonales, tablero con horómetro, placa del fabricante, motor, implemento y rodaje) y 4 documentos.',
};
