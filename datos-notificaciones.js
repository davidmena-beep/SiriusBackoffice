// SIRIUS · Módulo de Notificaciones (v1.12 · provisional · etapa C2-2 · 08/11/2026)
// v1.12: recordatorios por tipo de enlace (DEC-178): R13 a R15 son del enlace de autoinspección y R20 a R22 del de autoagendamiento («Agenda tu inspección»),
//       con su plantilla; cada regla dice a qué tipo aplica (tipoEnlace). La plantilla del autoagendamiento menciona la modalidad elegida.
// v1.11: R19 «Enlace de autoagendamiento» y su plantilla (DEC-178): el enlace lleva al portal del caso (estado, Agenda y Documentos), sin la captura de fotos.
// v1.10: variables del grupo «Proveedor» (banco, número de cuenta enmascarado y titular de la cuenta de pago; el número y el titular son dato personal · DEC-174).
// v1.9: R06 sale el día anterior a las 15:00 con «Confirmar» y «Cambiar» (SIRIUS_APP_INSPECTOR.confirmacionVisita); sin confirmar a las 18:00, «Sin respuesta».
// v1.8: R06 (recordatorio de la visita) sale el día anterior a las 17:00 (corrección de 14b en SIRIUS_APP_INSPECTOR.correcciones).
// v1.7: R18 «Revisión de un documento del portal» (aceptado o «Volver a subir» con motivo) y su plantilla, para el portal del caso (DEC-171).
// v1.6: recordatorios del enlace de autoinspección (R13 sin abrir a las 24 h hábiles, R14 abandonado a medias, R15 dos días antes de vencer), aviso interno al
//       vencer (R16) y solicitudes del cliente desde el portal (R17); plantilla «Recordatorio del enlace»; consentimiento del contacto de 20186.
// v1.5: dominio de la compañía asur.ec (correos y enlaces).
// v1.4: las cuentas de Gmail pasan a SIRIUS_USUARIOS (fuente única); el celular de prueba sale del usuario.
// v1.3: estados «Inactiva por conflicto» y «Pausada por conflicto»; nombres y cargos son General; datos de la compañía; fuente de riesgo.vin.
// v1.2: diccionario de variables con disponibilidad y clasificación LOPDP; incluye correo y celular del asegurado.
// v1.1: tablas parametrizables (tabla libre n×m y tabla de datos con fuentes y columnas a elección), texto alternativo de
//       imágenes, celular de prueba, aviso de SMS según GSM, días restantes sin negativos y caso de vista previa por regla.
// Fuente única de: canales y conexiones, remitente de correo, reglas de envío (por estado, por regla de tiempo o por
// evento), plantillas con variante por canal, variables, consentimiento del cliente y bitácora de envíos de ejemplo.
// Reemplaza a «Plantillas de notificación». Las notificaciones en la campana de SIRIUS son el canal «En SIRIUS».
// Decisiones: DEC-111 a DEC-115.
(function () {
  const N = {
    version: '1.6', vigencia: 'Provisional',
    // ---------- Canales ----------
    canales: [
      { id: 'correo', nombre: 'Correo', conexion: 'CNX-11', proveedor: 'Gmail API (Google Workspace, OAuth2)', estado: 'Conectado' },
      { id: 'whatsapp', nombre: 'WhatsApp', conexion: 'CNX-10', proveedor: 'Genesys Cloud (por confirmar)', estado: 'Simulado' },
      { id: 'sms', nombre: 'SMS', conexion: 'CNX-10', proveedor: 'Genesys Cloud (por confirmar)', estado: 'Simulado' },
      { id: 'app', nombre: 'En SIRIUS', conexion: null, proveedor: 'Campana de notificaciones', estado: 'Activo' },
    ],
    // ---------- Remitente del correo (DEC-111) ----------
    remitente: {
      regla: 'Sale de la cuenta de Gmail del responsable del caso si la conectó (incluye envíos programados, con permiso sin conexión); si no, de la cuenta institucional.',
      institucional: 'notificaciones@asur.ec',
      // El estado de la conexión de Gmail de cada usuario vive en SIRIUS_USUARIOS.usuarios[].gmail (etapa 10b).
    },
    // ---------- Horario y límites ----------
    horario: { clientes: { dias: [1, 2, 3, 4, 5, 6], desde: '08:00', hasta: '19:00', nota: 'Fuera de horario se envía al inicio del siguiente tramo' }, internos: 'Inmediato' },
    limites: {
      whatsapp: { cuerpo: 1024, botones: 3, encabezado: 'Imagen PNG o JPG hasta 5 MB', nota: 'Los mensajes que inicia la empresa usan plantillas aprobadas por Meta; cada cambio vuelve a revisión' },
      sms: { gsm: 160, unicode: 70, enlaces: 1, nota: 'Con á, í, ó, ú u otros caracteres fuera del alfabeto GSM, cada segmento admite 70 caracteres (ñ, é y ü sí son GSM); el editor cuenta segmentos con los valores del caso' },
      correo: { imagen: 'PNG o JPG hasta 1 MB; ancho recomendado 600 px; texto alternativo obligatorio', botones: 3, tabla: { maxFilas: 20, maxColumnas: 8, apilarMovilDesde: 4, nota: 'Las tablas solo existen en Correo; en WhatsApp y SMS se usan variables de texto' } },
    },
    // ---------- Consentimiento del cliente (DEC-114, LOPDP) ----------
    consentimiento: {
      regla: 'WhatsApp y SMS al asegurado o su contacto solo con consentimiento registrado; sin él, la regla usa correo.',
      casos: {
        '20178': { whatsapp: true, sms: true, fecha: '2026-08-25T10:05', origen: 'Nueva solicitud', por: 'Santiago Ortiz' },
        '20137': { whatsapp: false, sms: false, fecha: '2026-10-08T09:30', origen: 'Coordinación', por: 'Andrea Salazar' },
        '20187': { whatsapp: true, sms: false, fecha: '2026-10-17T16:20', origen: 'Sur One', por: 'Integración' },
        '20152': { whatsapp: true, sms: true, fecha: '2026-10-17T10:15', origen: 'Coordinación', por: 'Andrea Salazar' },
        '20186': { whatsapp: true, sms: true, fecha: '2026-10-16T09:35', origen: 'Coordinación', por: 'Andrea Salazar' },
      },
    },
    // ---------- Disparadores ----------
    disparadores: {
      estado: 'Al entrar el caso (o el riesgo) a un estado de SIRIUS_FLUJO',
      regla: 'Condición de tiempo: N días u horas antes o después de una fecha (fecha límite de garantías, visita, vencimiento del enlace, SLA)',
      evento: 'Hecho del sistema: enlace enviado, endoso rechazado, solicitud de ampliación, respuesta del BPM, informe recibido',
    },
    eventos: ['Enlace de autoagendamiento enviado', 'Enlace de autoinspección enviado', 'Endoso rechazado por el BPM', 'Endoso aplicado por el BPM', 'Solicitud de ampliación de plazo', 'Ampliación aprobada o rechazada', 'Informe recibido', 'Respaldo de garantía cargado', 'Solicitud del cliente desde el portal'],
    destinatarios: ['Asegurado o contacto', 'Bróker (APS)', 'Ejecutivo comercial', 'Coordinador de inspecciones', 'Inspector de la visita', 'Ejecutivo de inspecciones', 'Suscriptor', 'Calificador final', 'Responsable actual (SIRIUS_FLUJO)', 'Correo fijo'],
    // ---------- Diccionario de variables (DEC-123) ----------
    // Toda variable sale del modelo de datos de SIRIUS. El Administrador decide cuáles se ofrecen al insertar (disponible) en
    // Administración › Notificaciones › Variables. Clasificación LOPDP: «Dato personal» se puede usar, y se avisa si va a un
    // destinatario externo distinto del titular; «Dato sensible» solo se ofrece para destinatarios internos.
    // Los campos personalizados activos (SIRIUS_CAMPOS) se agregan solos como {{campo.<clave>}}, con su etiqueta, en el grupo
    // «Campos personalizados»; nacen disponibles si su «Quién ve» es «Todos los roles».
    // {{mensaje}} es interna de la plantilla «Aviso interno».
    diccionario: [
      { grupo: 'Caso', clave: 'caso.numero', etiqueta: 'Número de caso', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: '20178' },
      { grupo: 'Caso', clave: 'caso.estado', etiqueta: 'Estado del caso', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'Emitida' },
      { grupo: 'Caso', clave: 'caso.ramo', etiqueta: 'Ramo', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'Equipo electrónico' },
      { grupo: 'Caso', clave: 'caso.tipo', etiqueta: 'Tipo de caso', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'Ramos Generales' },
      { grupo: 'Caso', clave: 'caso.sucursal', etiqueta: 'Sucursal', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'Quito Norte' },
      { grupo: 'Caso', clave: 'caso.origen', etiqueta: 'Origen del caso', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'BPM de Emisión' },
      { grupo: 'Caso', clave: 'caso.fechaSolicitud', etiqueta: 'Fecha de solicitud', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: '25/08/2026' },
      { grupo: 'Caso', clave: 'caso.enlace', etiqueta: 'Enlace al caso en SIRIUS', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: 'https://sirius…/casos/20178' },
      { grupo: 'Caso', clave: 'caso.ordenEmision', etiqueta: 'Orden de emisión', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'OE-2026-08795' },
      { grupo: 'Caso', clave: 'caso.poliza', etiqueta: 'Póliza', origen: 'Emisión', clasificacion: 'General', disponible: true, ejemplo: 'POL-2026-113870' },
      { grupo: 'Caso', clave: 'caso.resultado', etiqueta: 'Asegurabilidad del caso', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: '2 de 3 asegurables' },
      { grupo: 'Asegurado', clave: 'asegurado.nombre', etiqueta: 'Nombre del asegurado', origen: 'Asegurado', clasificacion: 'General', disponible: true, ejemplo: 'Clínica San Rafael' },
      { grupo: 'Asegurado', clave: 'asegurado.identificacion', etiqueta: 'Cédula o RUC del asegurado', origen: 'Asegurado', clasificacion: 'Dato sensible', disponible: false, ejemplo: '1792…' },
      { grupo: 'Asegurado', clave: 'asegurado.correo', etiqueta: 'Correo del asegurado', origen: 'Asegurado', clasificacion: 'Dato personal', disponible: true, ejemplo: 'administracion@clinicasanrafael.ec' },
      { grupo: 'Asegurado', clave: 'asegurado.celular', etiqueta: 'Celular del asegurado', origen: 'Asegurado', clasificacion: 'Dato personal', disponible: true, ejemplo: '0998…' },
      { grupo: 'Asegurado', clave: 'asegurado.direccion', etiqueta: 'Dirección del asegurado', origen: 'Asegurado', clasificacion: 'Dato personal', disponible: true, ejemplo: 'Av. …' },
      { grupo: 'Contacto', clave: 'contacto.nombre', etiqueta: 'Nombre del contacto', origen: 'Contacto', clasificacion: 'General', disponible: true, ejemplo: 'Patricia Andrade Ruiz' },
      { grupo: 'Contacto', clave: 'contacto.cargo', etiqueta: 'Cargo del contacto', origen: 'Contacto', clasificacion: 'General', disponible: true, ejemplo: 'Administradora' },
      { grupo: 'Contacto', clave: 'contacto.correo', etiqueta: 'Correo del contacto', origen: 'Contacto', clasificacion: 'Dato personal', disponible: true, ejemplo: 'administracion@clinicasanrafael.ec' },
      { grupo: 'Contacto', clave: 'contacto.celular', etiqueta: 'Celular del contacto', origen: 'Contacto', clasificacion: 'Dato personal', disponible: true, ejemplo: '0987…' },
      { grupo: 'Contacto', clave: 'contacto.fijo', etiqueta: 'Teléfono fijo del contacto', origen: 'Contacto', clasificacion: 'Dato personal', disponible: true, ejemplo: '022…' },
      { grupo: 'Contacto', clave: 'contacto.horario', etiqueta: 'Horario de atención del contacto', origen: 'Contacto', clasificacion: 'General', disponible: true, ejemplo: '08:00–17:00' },
      { grupo: 'Bróker', clave: 'broker.nombre', etiqueta: 'Nombre del bróker (APS)', origen: 'Bróker', clasificacion: 'General', disponible: true, ejemplo: 'Carolina Mena' },
      { grupo: 'Bróker', clave: 'broker.correo', etiqueta: 'Correo del bróker', origen: 'Bróker', clasificacion: 'Dato personal', disponible: true, ejemplo: 'carolina.mena@austrobrokers.ec' },
      { grupo: 'Bróker', clave: 'broker.agencia', etiqueta: 'Agencia del bróker', origen: 'Bróker', clasificacion: 'General', disponible: true, ejemplo: 'Austro Brokers' },
      { grupo: 'Riesgo', clave: 'riesgo.descripcion', etiqueta: 'Descripción del riesgo', origen: 'Riesgo', clasificacion: 'General', disponible: true, ejemplo: 'Toyota Corolla Cross 2022' },
      { grupo: 'Riesgo', clave: 'riesgo.placa', etiqueta: 'Placa', origen: 'Vehículo', clasificacion: 'General', disponible: true, ejemplo: 'PBA4521' },
      { grupo: 'Riesgo', clave: 'riesgo.marca', etiqueta: 'Marca', origen: 'Vehículo', clasificacion: 'General', disponible: true, ejemplo: 'Toyota' },
      { grupo: 'Riesgo', clave: 'riesgo.modelo', etiqueta: 'Modelo', origen: 'Vehículo', clasificacion: 'General', disponible: true, ejemplo: 'Corolla Cross' },
      { grupo: 'Riesgo', clave: 'riesgo.anio', etiqueta: 'Año', origen: 'Vehículo', clasificacion: 'General', disponible: true, ejemplo: '2022' },
      { grupo: 'Riesgo', clave: 'riesgo.vin', etiqueta: 'VIN', origen: 'Vehículo', clasificacion: 'General', disponible: false, ejemplo: '9BR…', fuente: 'Informe del vehículo: veh_vin' },
      { grupo: 'Riesgo', clave: 'riesgo.direccion', etiqueta: 'Dirección de la ubicación', origen: 'Ubicación', clasificacion: 'Dato personal', disponible: true, ejemplo: 'Av. …' },
      { grupo: 'Riesgo', clave: 'riesgo.cobertura', etiqueta: 'Cobertura', origen: 'Riesgo', clasificacion: 'General', disponible: true, ejemplo: 'Todo riesgo' },
      { grupo: 'Riesgo', clave: 'riesgo.valorAsegurado', etiqueta: 'Valor asegurado', origen: 'Riesgo', clasificacion: 'General', disponible: false, ejemplo: 'USD 29.700,00' },
      { grupo: 'Riesgo', clave: 'riesgo.asegurabilidad', etiqueta: 'Asegurabilidad del riesgo', origen: 'Calificación', clasificacion: 'General', disponible: true, ejemplo: 'Asegurable' },
      { grupo: 'Visita', clave: 'visita.fecha', etiqueta: 'Fecha de la visita', origen: 'Visita', clasificacion: 'General', disponible: true, ejemplo: '20/10/2026' },
      { grupo: 'Visita', clave: 'visita.franja', etiqueta: 'Horario de la visita', origen: 'Visita', clasificacion: 'General', disponible: true, ejemplo: '10:00 – 11:00' },
      { grupo: 'Visita', clave: 'visita.modalidad', etiqueta: 'Modalidad', origen: 'Visita', clasificacion: 'General', disponible: true, ejemplo: 'Presencial' },
      { grupo: 'Visita', clave: 'visita.inspector', etiqueta: 'Inspector', origen: 'Visita', clasificacion: 'General', disponible: true, ejemplo: 'Marco Tapia' },
      { grupo: 'Visita', clave: 'visita.inspectorCelular', etiqueta: 'Celular del inspector', origen: 'Usuario', clasificacion: 'Dato personal', disponible: false, ejemplo: '099…' },
      { grupo: 'Visita', clave: 'visita.direccion', etiqueta: 'Dirección de la visita', origen: 'Visita', clasificacion: 'Dato personal', disponible: true, ejemplo: 'Av. …' },
      { grupo: 'Garantías', clave: 'garantias.pendientes', etiqueta: 'Garantías pendientes (número)', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: '2' },
      { grupo: 'Garantías', clave: 'garantias.lista', etiqueta: 'Garantías pendientes (texto)', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: 'Regulador de voltaje; UPS' },
      { grupo: 'Garantías', clave: 'garantias.fechaLimite', etiqueta: 'Fecha límite de garantías', origen: 'Seguimiento', clasificacion: 'General', disponible: true, ejemplo: '07/10/2026' },
      { grupo: 'Garantías', clave: 'garantias.diasRestantes', etiqueta: 'Días para la fecha límite', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: '15' },
      { grupo: 'Garantías', clave: 'garantias.vencidaHace', etiqueta: 'Días desde el vencimiento', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: '11' },
      { grupo: 'Enlaces', clave: 'enlace.portal', etiqueta: 'Enlace al portal del cliente', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: 'https://sirius…/p/abc123' },
      { grupo: 'Documentos', clave: 'documento.nombre', etiqueta: 'Documento pedido al cliente', origen: 'Portal del cliente', clasificacion: 'General', disponible: true, ejemplo: 'Licencia de conducir' }, // etapa 14
      { grupo: 'Documentos', clave: 'documento.resultado', etiqueta: 'Resultado de la revisión del documento', origen: 'Portal del cliente', clasificacion: 'General', disponible: true, ejemplo: 'hay que volver a subirlo: la foto está borrosa' },
      { grupo: 'Enlaces', clave: 'enlace.vence', etiqueta: 'Vencimiento del enlace', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: '21/10/2026 · 18:00' },
      { grupo: 'Personas', clave: 'responsable.nombre', etiqueta: 'Responsable actual', origen: 'Flujo', clasificacion: 'General', disponible: true, ejemplo: 'Verónica Lema' },
      { grupo: 'Personas', clave: 'comercial.nombre', etiqueta: 'Ejecutivo comercial', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'Santiago Ortiz' },
      { grupo: 'Personas', clave: 'comercial.correo', etiqueta: 'Correo del ejecutivo comercial', origen: 'Usuario', clasificacion: 'General', disponible: true, ejemplo: 'santiago.ortiz@asur.ec' },
      { grupo: 'Personas', clave: 'ejecutivo.nombre', etiqueta: 'Ejecutivo de inspecciones', origen: 'Caso', clasificacion: 'General', disponible: true, ejemplo: 'Verónica Lema' },
      { grupo: 'Personas', clave: 'remitente.nombre', etiqueta: 'Nombre de quien envía', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: 'Santiago Ortiz' },
      { grupo: 'Personas', clave: 'remitente.correo', etiqueta: 'Correo de quien envía', origen: 'Calculada', clasificacion: 'General', disponible: true, ejemplo: 'santiago.ortiz@asur.ec' },
      { grupo: 'SLA', clave: 'sla.vence', etiqueta: 'Vencimiento del SLA', origen: 'Flujo', clasificacion: 'General', disponible: true, ejemplo: '19/10/2026 · 12:00' },
      { grupo: 'SLA', clave: 'sla.restante', etiqueta: 'SLA restante', origen: 'Flujo', clasificacion: 'General', disponible: true, ejemplo: '3 h' },
      // v1.10 (etapa 15-4 · DEC-174): cuenta bancaria de la agencia o del inspector independiente. El número es dato personal (LOPDP) y sale enmascarado.
      { grupo: 'Proveedor', clave: 'proveedor.banco', etiqueta: 'Banco de la cuenta de pago', origen: 'Cuenta bancaria', clasificacion: 'General', disponible: true, ejemplo: 'Banco Pichincha' },
      { grupo: 'Proveedor', clave: 'proveedor.cuenta', etiqueta: 'Número de cuenta de pago (enmascarado)', origen: 'Cuenta bancaria', clasificacion: 'Dato personal', disponible: true, ejemplo: '···4521' },
      { grupo: 'Proveedor', clave: 'proveedor.cuentaTitular', etiqueta: 'Titular de la cuenta de pago', origen: 'Cuenta bancaria', clasificacion: 'Dato personal', disponible: true, ejemplo: 'Luis Andrade' },
      { grupo: 'Compañía', clave: 'compania.nombre', etiqueta: 'Nombre de la compañía', origen: 'Configuración', clasificacion: 'General', disponible: true, ejemplo: 'Aseguradora del Sur' },
      { grupo: 'Compañía', clave: 'compania.telefono', etiqueta: 'Teléfono de atención', origen: 'Configuración', clasificacion: 'General', disponible: true, ejemplo: '1800 …' },
    ],
    // Compatibilidad: grupos de variables disponibles (se calcula desde el diccionario al cargar).
    variables: [],
    // Datos de la compañía (Configuración; fuente de compania.*). Teléfono de ejemplo.
    compania: { nombre: 'Aseguradora del Sur', telefono: '1800 737 787 (ejemplo)' },
    // Estados por conflicto (SIRIUS_CONFLICTOS): una plantilla «Inactiva por conflicto» vuelve sola a su estado anterior al
    // resolverse; una regla «Pausada por conflicto» solo en el canal afectado.
    estadosConflicto: { plantilla: 'Inactiva por conflicto', regla: 'Pausada por conflicto' },

    // ---------- Fuentes para tablas de datos ----------
    // Una «Tabla de datos» repite una fila por cada elemento de la fuente; el usuario elige columnas, títulos, orden, filtro y máximo.
    fuentesTabla: [
      { id: 'garantias', nombre: 'Garantías del caso', columnas: [['codigo', 'Código'], ['nombre', 'Garantía'], ['detalle', 'Detalle'], ['estado', 'Estado'], ['respaldo', 'Respaldo'], ['fechaCumplimiento', 'Cumplida el']], filtros: ['Todas', 'Pendientes', 'Cumplidas', 'Vencidas'] },
      { id: 'vehiculos', nombre: 'Vehículos del caso', columnas: [['placa', 'Placa'], ['marca', 'Marca'], ['modelo', 'Modelo'], ['anio', 'Año'], ['cobertura', 'Cobertura'], ['valorAsegurado', 'Valor asegurado'], ['asegurabilidad', 'Asegurabilidad'], ['emision', 'Resultado de emisión']], filtros: ['Todos', 'Asegurables', 'No asegurables'] },
      { id: 'ramos', nombre: 'Ramos del caso (Ramos Generales)', columnas: [['ramo', 'Ramo'], ['resultado', 'Resultado'], ['puntaje', 'Puntaje'], ['banda', 'Banda']], filtros: ['Todos'] },
      { id: 'visitas', nombre: 'Visitas del caso', columnas: [['fecha', 'Fecha'], ['franja', 'Horario'], ['modalidad', 'Modalidad'], ['inspector', 'Inspector'], ['direccion', 'Dirección'], ['riesgos', 'Riesgos']], filtros: ['Todas', 'Próximas'] },
      { id: 'documentos', nombre: 'Documentos pendientes', columnas: [['nombre', 'Documento'], ['estado', 'Estado'], ['solicitado', 'Solicitado el']], filtros: ['Pendientes', 'Todos'] },
      { id: 'endosos', nombre: 'Endosos con el BPM', columnas: [['tipo', 'Tipo'], ['estado', 'Estado'], ['enviado', 'Enviado'], ['respuesta', 'Respuesta']], filtros: ['Todos', 'Rechazados'] },
    ],
    // Bloque «tabla»: modo 'datos' (fuente, columnas [[clave, título]], filtro, maxFilas, vacio) o modo 'libre'
    // (filas × columnas de celdas con texto y variables; encabezadoColumnas: primera fila como títulos de columna;
    // titulosFila: primera columna como títulos de fila). estilo: bordes, cebra, colorEncabezado, alineacion por columna.
    // Caso de vista previa: el primero que cumple la condición de alguna regla que usa la plantilla; si el usuario elige
    // otro que no la cumple, la vista previa lo avisa.

    // ---------- Plantillas ----------
    // correo.bloques: banner | texto | tabla | boton | separador | pie. boton.destino: 'sirius' (enlace al caso o al portal) o una URL.
    plantillas: [
      { id: 'gar_recordatorio', nombre: 'Garantías por vencer', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-12T16:30'],
        correo: { asunto: 'Caso {{caso.numero}}: faltan {{garantias.diasRestantes}} días para cumplir las garantías',
          estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [
            { tipo: 'banner', archivo: 'banner-garantias.png', alto: 140, alt: 'Aseguradora del Sur · Seguimiento de garantías' },
            { tipo: 'texto', contenido: 'Hola, {{broker.nombre}}:\nLa póliza {{caso.poliza}} de {{asegurado.nombre}} tiene garantías pendientes. La fecha límite es el {{garantias.fechaLimite}}.' },
            { tipo: 'tabla', modo: 'datos', fuente: 'garantias', columnas: [['nombre', 'Garantía'], ['detalle', 'Detalle'], ['estado', 'Estado']], filtro: 'Pendientes', maxFilas: 10, vacio: 'No hay garantías pendientes.', estilo: { bordes: true, cebra: true, colorEncabezado: '#0B5CAD' } },
            { tipo: 'boton', texto: 'Ver el seguimiento', destino: 'sirius', estilo: 'primario' },
            { tipo: 'texto', contenido: 'Si ya cumpliste alguna, responde a este correo con el respaldo.' },
            { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur · Este correo se envió desde SIRIUS.' },
          ] },
        whatsapp: { nombreMeta: 'garantias_por_vencer_v2', estadoMeta: 'Aprobada', encabezado: 'banner-garantias.png',
          cuerpo: 'Hola, {{contacto.nombre}}. Tu póliza {{caso.poliza}} tiene garantías pendientes hasta el {{garantias.fechaLimite}}. Si ya las cumpliste, comparte el respaldo con tu bróker.',
          botones: [{ texto: 'Ver detalle', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: tu poliza {{caso.poliza}} tiene garantias pendientes hasta el {{garantias.fechaLimite}}. Detalle: {{enlace.portal}}' },
        app: { texto: 'Caso {{caso.numero}}: garantías vencen el {{garantias.fechaLimite}}.' } },
      { id: 'gar_vencidas', nombre: 'Garantías vencidas', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-12T16:45'],
        correo: { asunto: 'Caso {{caso.numero}}: garantías vencidas', estilo: { fuente: 'Mulish', primario: '#B42318', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'texto', contenido: 'Las garantías del caso {{caso.numero}} vencieron el {{garantias.fechaLimite}} con {{garantias.pendientes}} pendientes.' }, { tipo: 'tabla', modo: 'datos', fuente: 'garantias', columnas: [['nombre', 'Garantía'], ['estado', 'Estado']], filtro: 'Vencidas', maxFilas: 10, vacio: 'Sin garantías vencidas.', estilo: { bordes: true, cebra: false, colorEncabezado: '#B42318' } }, { tipo: 'boton', texto: 'Abrir el caso', destino: 'sirius', estilo: 'primario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        app: { texto: 'Caso {{caso.numero}}: garantías vencidas.' } },
      { id: 'visita_confirmada', nombre: 'Visita agendada', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-05T11:10'],
        correo: { asunto: 'Tu inspección está agendada para el {{visita.fecha}}', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'banner', archivo: 'banner-inspeccion.jpg', alto: 140, alt: 'Aseguradora del Sur · Inspección de tu seguro' }, { tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Ya agendamos la inspección de tu seguro.' },
            { tipo: 'tabla', modo: 'libre', titulo: 'Datos de tu visita', encabezadoColumnas: false, titulosFila: true, celdas: [['Fecha', '{{visita.fecha}}'], ['Horario', '{{visita.franja}}'], ['Dirección', '{{visita.direccion}}'], ['Inspector', '{{visita.inspector}}'], ['Modalidad', '{{visita.modalidad}}']], estilo: { bordes: false, cebra: true, colorEncabezado: '#0B5CAD', alineacion: ['izquierda', 'izquierda'] } }, { tipo: 'boton', texto: 'Cambiar la fecha', destino: 'sirius', estilo: 'secundario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        whatsapp: { nombreMeta: 'visita_agendada_v1', estadoMeta: 'Aprobada', encabezado: null, cuerpo: 'Hola, {{contacto.nombre}}. Tu inspección es el {{visita.fecha}} entre {{visita.franja}}. Te atenderá {{visita.inspector}}.', botones: [{ texto: 'Cambiar la fecha', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: tu inspeccion es el {{visita.fecha}} entre {{visita.franja}}. Cambios: {{enlace.portal}}' } },
      { id: 'enlace_autoinspeccion', nombre: 'Enlace de autoinspección', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-05T11:30'],
        correo: { asunto: 'Inspecciona tu vehículo desde tu celular', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Puedes hacer la inspección de {{riesgo.placa}} tú mismo. El enlace vence el {{enlace.vence}}.' }, { tipo: 'boton', texto: 'Empezar la inspección', destino: 'sirius', estilo: 'primario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        whatsapp: { nombreMeta: 'autoinspeccion_enlace_v3', estadoMeta: 'En revisión', encabezado: null, cuerpo: 'Hola, {{contacto.nombre}}. Inspecciona tu vehículo {{riesgo.placa}} desde tu celular. El enlace vence el {{enlace.vence}}.', botones: [{ texto: 'Empezar', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: inspecciona tu vehiculo {{riesgo.placa}} aqui: {{enlace.portal}} (vence {{enlace.vence}})' } },
      // Etapa C2-1 · DEC-178: enlace de autoagendamiento (Presencial o Virtual guiada); variables del diccionario, todas «General» (LOPDP).
      { id: 'enlace_autoagendamiento', nombre: 'Enlace de autoagendamiento', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-18T20:20'],
        correo: { asunto: 'Agenda la inspección de tu caso {{caso.numero}}', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Desde este enlace puedes agendar la inspección {{visita.modalidad}} de {{riesgo.descripcion}} (caso {{caso.numero}}), ver el estado de tu caso y subir tus documentos: {{enlace.portal}}. El enlace vence el {{enlace.vence}}.' }, { tipo: 'boton', texto: 'Agendar mi inspección', destino: 'sirius', estilo: 'primario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        whatsapp: { nombreMeta: 'autoagendamiento_enlace_v1', estadoMeta: 'En revisión', encabezado: null, cuerpo: 'Hola, {{contacto.nombre}}. Agenda la inspección {{visita.modalidad}} de {{riesgo.descripcion}} (caso {{caso.numero}}), revisa el estado de tu caso y sube tus documentos desde este enlace: {{enlace.portal}}\n\nEl enlace vence el {{enlace.vence}}.', botones: [{ texto: 'Agendar', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: agenda la inspeccion {{visita.modalidad}} de tu caso {{caso.numero}} aqui: {{enlace.portal}} (vence {{enlace.vence}})' } },
      { id: 'enlace_agenda_recordatorio', nombre: 'Recordatorio: agenda tu inspección', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-18T20:25'], // etapa C2-2 · DEC-178
        correo: { asunto: 'Agenda tu inspección del caso {{caso.numero}}', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Agenda tu inspección: todavía no elegiste el horario para {{riesgo.descripcion}}. Usa el mismo enlace hasta el {{enlace.vence}}.' }, { tipo: 'boton', texto: 'Agendar mi inspección', destino: 'sirius', estilo: 'primario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        whatsapp: { nombreMeta: 'autoagendamiento_recordatorio_v1', estadoMeta: 'En revisión', encabezado: null, cuerpo: 'Hola, {{contacto.nombre}}. Agenda tu inspección: todavía no elegiste el horario para {{riesgo.descripcion}}. Usa el mismo enlace hasta el {{enlace.vence}}.', botones: [{ texto: 'Agendar', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: agenda tu inspeccion del caso {{caso.numero}} aqui: {{enlace.portal}} (vence {{enlace.vence}})' } },
      { id: 'enlace_recordatorio', nombre: 'Recordatorio del enlace', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-18T20:05'],
        correo: { asunto: 'Tu inspección de {{riesgo.placa}} sigue pendiente', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Te recordamos que la inspección de {{riesgo.placa}} sigue pendiente. Puedes hacerla desde tu celular con el mismo enlace hasta el {{enlace.vence}}.' }, { tipo: 'boton', texto: 'Continuar la inspección', destino: 'sirius', estilo: 'primario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        whatsapp: { nombreMeta: 'autoinspeccion_recordatorio_v1', estadoMeta: 'En revisión', encabezado: null, cuerpo: 'Hola, {{contacto.nombre}}. La inspección de {{riesgo.placa}} sigue pendiente. Usa el mismo enlace hasta el {{enlace.vence}}.', botones: [{ texto: 'Continuar', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: la inspeccion de {{riesgo.placa}} sigue pendiente. Continua aqui: {{enlace.portal}} (vence {{enlace.vence}})' } },
      { id: 'documento_revision', nombre: 'Revisión de un documento', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-18T19:00'],
        correo: { asunto: 'Revisamos tu documento «{{documento.nombre}}»', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' },
          bloques: [{ tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Revisamos «{{documento.nombre}}»: {{documento.resultado}}.' }, { tipo: 'boton', texto: 'Ver mis documentos', destino: 'sirius', estilo: 'primario' }, { tipo: 'pie', archivo: 'pie-aseguradora.png', alt: 'Logotipo de Aseguradora del Sur', texto: 'Aseguradora del Sur' }] },
        whatsapp: { nombreMeta: 'documento_revision_v1', estadoMeta: 'En revisión', encabezado: null, cuerpo: 'Hola, {{contacto.nombre}}. Revisamos «{{documento.nombre}}»: {{documento.resultado}}.', botones: [{ texto: 'Ver mis documentos', destino: 'sirius' }] },
        sms: { texto: 'Aseguradora del Sur: revisamos {{documento.nombre}}: {{documento.resultado}}. Ver: {{enlace.portal}}' } },
      { id: 'interno_aviso', nombre: 'Aviso interno', estado: 'Activa', actualizada: ['Andrea Salazar', '2026-10-05T12:00'],
        correo: { asunto: 'SIRIUS · Caso {{caso.numero}}', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' }, bloques: [{ tipo: 'texto', contenido: '{{mensaje}}' }, { tipo: 'boton', texto: 'Abrir en SIRIUS', destino: 'sirius', estilo: 'primario' }] },
        app: { texto: '{{mensaje}}' } },
      { id: 'encuesta', nombre: 'Encuesta de satisfacción', estado: 'Borrador', actualizada: ['Andrea Salazar', '2026-10-14T09:00'],
        correo: { asunto: '¿Cómo fue tu inspección?', estilo: { fuente: 'Mulish', primario: '#0B5CAD', texto: '#1F2A37', fondo: '#FFFFFF' }, bloques: [{ tipo: 'texto', contenido: 'Hola, {{contacto.nombre}}. Cuéntanos cómo te fue.' }, { tipo: 'boton', texto: 'Responder la encuesta', destino: 'https://encuestas.asur.ec/inspeccion', estilo: 'primario' }] } },
    ],
    // ---------- Reglas ----------
    // tipo: estado | regla | evento. cuando: estado de SIRIUS_FLUJO, condición o evento. canales en orden de preferencia.
    reglas: [
      { id: 'R01', nombre: 'Garantías: faltan 15 días', tipo: 'regla', cuando: { fecha: 'garantias.fechaLimite', dias: -15, condicion: 'Conjunto Pendiente' }, a: ['Bróker (APS)', 'Ejecutivo comercial'], canales: ['correo'], plantilla: 'gar_recordatorio', estado: 'Activa' },
      { id: 'R02', nombre: 'Garantías: faltan 5 días', tipo: 'regla', cuando: { fecha: 'garantias.fechaLimite', dias: -5, condicion: 'Conjunto Pendiente' }, a: ['Bróker (APS)', 'Ejecutivo comercial', 'Asegurado o contacto'], canales: ['correo', 'whatsapp'], plantilla: 'gar_recordatorio', estado: 'Activa' },
      { id: 'R03', nombre: 'Garantías: falta 1 día', tipo: 'regla', cuando: { fecha: 'garantias.fechaLimite', dias: -1, condicion: 'Conjunto Pendiente' }, a: ['Bróker (APS)', 'Ejecutivo comercial', 'Asegurado o contacto'], canales: ['correo', 'whatsapp', 'sms'], plantilla: 'gar_recordatorio', estado: 'Activa' },
      { id: 'R04', nombre: 'Garantías vencidas', tipo: 'regla', cuando: { fecha: 'garantias.fechaLimite', dias: 0, condicion: 'Conjunto Vencido' }, a: ['Bróker (APS)', 'Ejecutivo comercial', 'Ejecutivo de inspecciones', 'Suscriptor'], canales: ['correo', 'app'], plantilla: 'gar_vencidas', estado: 'Activa' },
      { id: 'R05', nombre: 'Visita agendada', tipo: 'estado', cuando: { estado: 'Agendado' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'correo'], plantilla: 'visita_confirmada', estado: 'Activa' },
      { id: 'R06', nombre: 'Recordatorio de visita', tipo: 'regla', cuando: { fecha: 'visita.fecha', dias: -1, hora: '15:00' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'visita_confirmada', estado: 'Activa' },
      { id: 'R07', nombre: 'Enlace de autoinspección', tipo: 'evento', cuando: { evento: 'Enlace de autoinspección enviado' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms', 'correo'], plantilla: 'enlace_autoinspeccion', estado: 'Activa' },
      { id: 'R08', nombre: 'SLA por vencer', tipo: 'regla', cuando: { fecha: 'sla.vence', horas: -4 }, a: ['Responsable actual (SIRIUS_FLUJO)'], canales: ['app'], plantilla: 'interno_aviso', estado: 'Activa' },
      { id: 'R09', nombre: 'Caso devuelto al inspector', tipo: 'estado', cuando: { estado: 'Devuelto al inspector' }, a: ['Inspector de la visita'], canales: ['app', 'correo'], plantilla: 'interno_aviso', estado: 'Activa' },
      { id: 'R10', nombre: 'Endoso rechazado por el BPM', tipo: 'evento', cuando: { evento: 'Endoso rechazado por el BPM' }, a: ['Ejecutivo comercial'], canales: ['app', 'correo'], plantilla: 'interno_aviso', estado: 'Activa' },
      { id: 'R11', nombre: 'Solicitud de ampliación de plazo', tipo: 'evento', cuando: { evento: 'Solicitud de ampliación de plazo' }, a: ['Calificador final'], canales: ['app'], plantilla: 'interno_aviso', estado: 'Activa' },
      { id: 'R12', nombre: 'Encuesta después de la emisión', tipo: 'estado', cuando: { estado: 'Emitida' }, a: ['Asegurado o contacto'], canales: ['correo'], plantilla: 'encuesta', estado: 'Inactiva' },
      // Etapa 13 · ciclo de vida del enlace (DEC-169). R13 a R15 se editan también en Portal del cliente › Flujo; cuentan desde el envío (R13, horas hábiles), la última acción del cliente (R14) o el vencimiento (R15).
      { id: 'R13', nombre: 'Recordatorio: enlace sin abrir (autoinspección)', tipoEnlace: 'Autoinspección', tipo: 'regla', cuando: { fecha: 'enlace.envio', horas: 24, habiles: true, condicion: 'Enlace sin abrir' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'enlace_recordatorio', estado: 'Activa' },
      { id: 'R14', nombre: 'Recordatorio: autoinspección abandonada a medias (autoinspección)', tipoEnlace: 'Autoinspección', tipo: 'regla', cuando: { fecha: 'enlace.ultimaAccion', horas: 24, condicion: 'Autoinspección abandonada a medias' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'enlace_recordatorio', estado: 'Activa' },
      { id: 'R15', nombre: 'Recordatorio: enlace por vencer (autoinspección)', tipoEnlace: 'Autoinspección', tipo: 'regla', cuando: { fecha: 'enlace.vence', dias: -2, condicion: 'Autoinspección sin completar' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'enlace_recordatorio', estado: 'Activa' },
      { id: 'R16', nombre: 'Enlace caducado sin completar', tipo: 'estado', cuando: { estado: 'Enlace caducado' }, a: ['Coordinador de inspecciones'], canales: ['app'], plantilla: 'interno_aviso', estado: 'Activa' },
      { id: 'R17', nombre: 'Solicitud del cliente desde el portal', tipo: 'evento', cuando: { evento: 'Solicitud del cliente desde el portal' }, a: ['Coordinador de inspecciones'], canales: ['app'], plantilla: 'interno_aviso', estado: 'Activa' },
      { id: 'R18', nombre: 'Revisión de un documento del portal', tipo: 'evento', cuando: { evento: 'Documento del portal revisado' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'documento_revision', estado: 'Activa' }, // etapa 14
      { id: 'R19', nombre: 'Enlace de autoagendamiento', tipoEnlace: 'Autoagendamiento', tipo: 'evento', cuando: { evento: 'Enlace de autoagendamiento enviado' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms', 'correo'], plantilla: 'enlace_autoagendamiento', estado: 'Activa' }, // etapa C2-1 · DEC-178 (R16 ya es «Enlace caducado sin completar»)
      // Etapa C2-2 · DEC-178: recordatorios del enlace de autoagendamiento, con su propio texto («Agenda tu inspección»).
      { id: 'R20', nombre: 'Recordatorio: enlace sin abrir (autoagendamiento)', tipoEnlace: 'Autoagendamiento', tipo: 'regla', cuando: { fecha: 'enlace.envio', horas: 24, habiles: true, condicion: 'Agenda tu inspección · enlace sin abrir' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'enlace_agenda_recordatorio', estado: 'Activa' },
      { id: 'R21', nombre: 'Recordatorio: abrió el enlace y no agendó (autoagendamiento)', tipoEnlace: 'Autoagendamiento', tipo: 'regla', cuando: { fecha: 'enlace.apertura', horas: 24, condicion: 'Agenda tu inspección · sin horario elegido' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'enlace_agenda_recordatorio', estado: 'Activa' },
      { id: 'R22', nombre: 'Recordatorio: enlace por vencer (autoagendamiento)', tipoEnlace: 'Autoagendamiento', tipo: 'regla', cuando: { fecha: 'enlace.vence', dias: -2, condicion: 'Agenda tu inspección · el enlace vence pronto' }, a: ['Asegurado o contacto'], canales: ['whatsapp', 'sms'], plantilla: 'enlace_agenda_recordatorio', estado: 'Activa' },
    ],
    // ---------- Bitácora de envíos (ejemplo) ----------
    // estado: Enviado | Entregado | Leído | Fallido | Omitido (con motivo).
    bitacora: [
      { fecha: '2026-10-07T08:00', regla: 'R04', caso: '20178', canal: 'correo', a: 'Carolina Mena (APS)', remitente: 'santiago.ortiz@asur.ec', estado: 'Leído' },
      { fecha: '2026-10-07T08:00', regla: 'R04', caso: '20178', canal: 'app', a: 'Ricardo Almeida', remitente: 'SIRIUS', estado: 'Leído' },
      { fecha: '2026-10-06T08:00', regla: 'R03', caso: '20178', canal: 'whatsapp', a: 'Patricia Andrade Ruiz', remitente: 'Aseguradora del Sur', estado: 'Leído' },
      { fecha: '2026-10-06T08:00', regla: 'R03', caso: '20178', canal: 'sms', a: 'Patricia Andrade Ruiz', remitente: 'Aseguradora del Sur', estado: 'Entregado' },
      { fecha: '2026-10-02T08:00', regla: 'R02', caso: '20178', canal: 'whatsapp', a: 'Patricia Andrade Ruiz', remitente: 'Aseguradora del Sur', estado: 'Fallido', motivo: 'Número sin WhatsApp; se reintentó por correo' },
      { fecha: '2026-10-02T08:00', regla: 'R02', caso: '20178', canal: 'correo', a: 'Patricia Andrade Ruiz', remitente: 'santiago.ortiz@asur.ec', estado: 'Entregado' },
      { fecha: '2026-09-22T08:00', regla: 'R01', caso: '20178', canal: 'correo', a: 'Carolina Mena (APS)', remitente: 'santiago.ortiz@asur.ec', estado: 'Leído' },
      { fecha: '2026-10-16T14:00', regla: 'R05', caso: '20137', canal: 'whatsapp', a: 'Alfredo Antonio Mendoza', remitente: 'Aseguradora del Sur', estado: 'Omitido', motivo: 'Sin consentimiento para WhatsApp; se envió por correo' },
      { fecha: '2026-10-16T14:00', regla: 'R05', caso: '20137', canal: 'correo', a: 'Alfredo Antonio Mendoza', remitente: 'notificaciones@asur.ec', estado: 'Entregado', nota: 'Andrea Salazar no tenía Gmail conectado en ese momento' },
      { fecha: '2026-10-17T16:25', regla: 'R05', caso: '20187', canal: 'whatsapp', a: 'Daniela Mora Paredes', remitente: 'Aseguradora del Sur', estado: 'Leído' },
      { fecha: '2026-10-14T10:05', regla: 'R09', caso: '20170', canal: 'app', a: 'Cristian Vaca', remitente: 'SIRIUS', estado: 'Leído' },
    ],
  };
  // Grupos disponibles para insertar (desde el diccionario).
  N.variables = Array.from(new Set(N.diccionario.map(v => v.grupo))).map(g => ({ grupo: g, items: N.diccionario.filter(v => v.grupo === g && v.disponible).map(v => v.clave) })).filter(g => g.items.length);
  N.variable = (clave) => N.diccionario.find(v => v.clave === clave) || null;
  N.canal = (id) => N.canales.find(c => c.id === id) || null;
  N.plantilla = (id) => N.plantillas.find(p => p.id === id) || null;
  N.regla = (id) => N.reglas.find(r => r.id === id) || null;
  // Variables usadas en un texto: ['caso.numero', ...]
  N.variablesEn = (txt) => Array.from(new Set((String(txt || '').match(/\{\{\s*([\w.]+)\s*\}\}/g) || []).map(x => x.replace(/[{}\s]/g, ''))));
  // Variables desconocidas (ni del catálogo ni campo.<clave> activo ni {{mensaje}}).
  N.variablesInvalidas = (txt) => {
    const ok = new Set(N.variables.flatMap(g => g.items).concat(['mensaje'])), C = window.SIRIUS_CAMPOS;
    return N.variablesEn(txt).filter(v => !ok.has(v) && !(v.startsWith('campo.') && C && C.campo(v.slice(6)) && C.campo(v.slice(6)).estado === 'Activo'));
  };
  // Segmentos de SMS: 160 por segmento en GSM; 70 si hay tildes, ñ u otros caracteres fuera de GSM (153/67 si son varios).
  N.segmentosSms = (txt) => {
    const t = String(txt || ''), unicode = /[^\x0A\x0D\x20-\x7E£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉÄÖÑÜ§¿äöñüà]/.test(t) || /[áíóúÁÍÓÚ]/.test(t);
    const uno = unicode ? 70 : 160, varios = unicode ? 67 : 153;
    return { caracteres: t.length, unicode, segmentos: t.length <= uno ? 1 : Math.ceil(t.length / varios) };
  };
  // Remitente de un correo para un responsable dado.
  N.remitenteDe = (usuario) => { const U = window.SIRIUS_USUARIOS, c = U && U.usuario(usuario); return c && c.gmail === 'Conectada' ? c.correo : N.remitente.institucional; };
  // Canales efectivos para el cliente según consentimiento.
  N.canalesCliente = (caso, canales) => { const k = N.consentimiento.casos[caso] || {}; const r = canales.filter(c => (c !== 'whatsapp' || k.whatsapp) && (c !== 'sms' || k.sms)); return r.length ? r : ['correo']; };
  window.SIRIUS_NOTIFICACIONES = N;
})();
