// SIRIUS · Salida de Vehículos (BO-27 · plantilla por defecto) · v1 · provisional · etapa SV · 31/10/2026
// Un informe por vehículo, porque cada vehículo tiene su propia calificación. Dos documentos por vehículo, como en Ramos
// Generales: «Resumen para el APS» e «Informe de inspección». Composición, paginación, numeración de tablas y fotos, firmas y
// control de calidad: los de SIRIUS_SALIDA_RG (composicion), que valen para cualquier salida. Este archivo no los repite.
// Valores: SIRIUS_EJEMPLO.vehiculos (base, informe.campos, informe.grillas, estadoRiesgo) + SIRIUS_INFORME_VEH.complementos.
// Nada se redacta ni se completa desde el diseño: un dato vacío se muestra «—». Decisiones: DEC-117 y DEC-118 (provisionales).
// Insumo pendiente: un informe real de Vehículos (SIAERP u otro proveedor) para ajustar contenido y orden.
window.SIRIUS_SALIDA_VEH = {
  version: '1', vigencia: 'Provisional',
  plantilla: { codigo: 'SAL-VEH-01', nombre: 'Vehículos · por defecto', estado: 'Vigente', editable: false, formulario: 'Vehículos livianos v1', nota: 'Secciones fijas hasta el editor de plantillas de salida (BO-27).' },

  // ---------- Generación (DEC-118) ----------
  generacion: {
    donde: 'Detalle del caso de Vehículos: botón «Generar informe» (pestañas Informe y Calificación)',
    selectorVehiculo: 'Lista con cada vehículo (placa o «Marca, modelo, año» si no tiene placa) y «Todos los vehículos». Con un solo vehículo no se muestra.',
    selectorDocumento: ['Resumen para el APS', 'Informe de inspección', 'Ambos'],
    disponibilidad: [
      'Informe de inspección: desde que el informe del vehículo está Enviado. Sin veredicto todavía, el resultado dice «Pendiente de calificación».',
      'Resumen para el APS: solo con veredicto (Asegurable o No asegurable).',
      'Con «Todos los vehículos», los que no cumplen se omiten y se listan antes de generar: «No se incluyen: Kia, Sportage, 2026 (sin veredicto)».',
    ],
    salida: [
      'Un vehículo: vista previa y «Descargar PDF», idéntica a la vista previa (DEC-075).',
      'Todos los vehículos: un archivo .zip con un PDF por vehículo y documento; la vista previa permite pasar de un vehículo a otro.',
    ],
    nombreArchivo: '{documento}_{caso}_{placa o riesgo}.pdf', // Informe-de-inspeccion_20196_PBA4521.pdf · Resumen-APS_20196_20196-V3.pdf
    zip: 'Informes_{caso}.zip',
    emision: '«Enviar a emisión» adjunta los dos documentos de cada vehículo con veredicto.',
  },

  reglas: [
    'Un informe por vehículo: cada documento trata un solo vehículo, con su propia numeración de páginas, tablas y fotos.',
    'El Resumen para el APS no muestra reglas de envío a calificación, verificaciones externas, valores sugeridos, diferencias, confianza de la extracción, nombres de calificadores ni la emisión por excepción.',
    'El Informe de inspección es de uso interno: todos los capítulos con dato, alertas de valores, verificaciones externas, reglas que lo enviaron a calificación, origen del veredicto y registro fotográfico.',
    'Un capítulo aparece solo si tiene al menos un valor, fila o foto. Los capítulos se numeran en orden, sin huecos (DEC-062).',
    'Un campo condicional («Visible si») que no aplica no sale. Un campo sin valor muestra «—».',
    'Los campos con origen de extracción automática muestran su origen y confianza solo en el Informe de inspección («Extraído de Matrícula · 97 %»).',
    'Resaltado por palabra según la polaridad: favorable en verde, desfavorable en rojo, «No aplica» en gris.',
    'Fotos: 2 por fila, con leyenda «etiqueta · placa» y fecha, hora, GPS y dispositivo. En el prototipo, una foto sin imagen se muestra como marco con su leyenda.',
    'La placa se muestra sin guion (DEC-116).',
  ],

  // ---------- Portada ----------
  portada: {
    titulo: { resumen: 'Resumen de inspección vehicular', informe: 'Informe de inspección vehicular' },
    filas: [
      ['Caso', 'caso.numero'], ['Asegurado', 'caso.asegurado'], ['Vehículo', 'veh.descripcion'], ['Placa', 'veh_placa'],
      ['Fecha de inspección', 'veh_fecha_hora_inspeccion'], ['Modalidad', 'veh_modalidad_realizada'], ['Sucursal', 'veh_agencia'],
      ['Resultado', 'resultado.texto'], ['Póliza', 'emision.poliza'],
    ],
    soloInforme: ['Póliza'],
  },

  // ---------- Documentos ----------
  documentos: [
    { id: 'resumen', nombre: 'Resumen para el APS', archivo: 'Resumen-APS', destino: 'Bróker (APS) y emisión', paginas: '1 a 2',
      secciones: [
        { titulo: 'Datos del vehículo', campos: ['veh_placa', 'veh_marca', 'veh_modelo', 'veh_anio_modelo', 'veh_vin', 'veh_color', 'veh_uso', 'veh_kilometraje'] },
        { titulo: 'Datos de la inspección', campos: ['veh_fecha_hora_inspeccion', 'veh_modalidad_realizada', 'veh_agencia', 'veh_persona_atiende'] },
        { titulo: 'Resultado', bloque: 'resultado', variante: 'resumen' },
        { titulo: 'Preexistencias', bloque: 'preexistencias', nota: 'Averías, neumáticos y testigos encendidos; quedan como preexistencias del vehículo.' },
        { titulo: 'Accesorios y extras declarados', bloque: 'extras', variante: 'resumen' },
        { titulo: 'Fotos principales', fotos: ['Vista frontal', 'Lateral izquierdo', 'Parte posterior', 'Odómetro'] },
      ] },
    { id: 'informe', nombre: 'Informe de inspección', archivo: 'Informe-de-inspeccion', destino: 'Uso interno y emisión',
      // Capítulos = secciones de la plantilla Vehículos livianos v1, en su orden.
      secciones: [
        { modulo: 'ins', titulo: 'Datos de la inspección' },
        { modulo: 'veh', titulo: 'Identificación del vehículo' },
        { modulo: 'mat', titulo: 'Matrícula y propietario' },
        { modulo: 'uso', titulo: 'Uso y conductor' },
        { modulo: 'ver', titulo: 'Verificación de identificación' },
        { modulo: 'acc', titulo: 'Accesorios y seguridad', nota: 'Los Sí/No se agrupan en una grilla de 3 columnas: «Tiene» y «No tiene».' },
        { modulo: 'neu', titulo: 'Neumáticos', grilla: 'neu' },
        { modulo: 'tes', titulo: 'Testigos del tablero' },
        { modulo: 'ext', titulo: 'Extras', grilla: 'ext' },
        { modulo: 'ave', titulo: 'Averías', grilla: 'ave' },
        { modulo: 'vex', titulo: 'Verificaciones externas', grilla: 'vex' },
        { modulo: 'val', titulo: 'Valores', bloque: 'valores' },
        { modulo: 'ase', titulo: 'Asegurabilidad', bloque: 'resultado', variante: 'informe' },
        { titulo: 'Registro fotográfico', fotos: 'todas' },
      ],
      cierre: ['Firma de quien atiende (solo Presencial)', 'Inspector que ejecutó', 'Calificador (si hubo calificación)'] },
  ],

  // ---------- Bloques ----------
  bloques: {
    resultado: {
      resumen: ['Resultado: Asegurable o No asegurable (texto con ícono, nunca Badge)', 'Cobertura', 'Motivo si es No asegurable'],
      informe: ['Resultado y cobertura', 'Origen del veredicto: «Determinado por el inspector», «Calificado por» o «Modificado en calificación», con persona y fecha',
        'Reglas que lo enviaron a calificación, con su detalle (p. ej. «Diferencia de valor · −12,1 %»)', 'Decisión y motivo del inspector', 'Observación general', 'Resultado de emisión: Emitido, No emitido o Emitido por excepción (con motivo y autorizador)'],
      sinVeredicto: 'Pendiente de calificación',
    },
    preexistencias: ['Averías (Pieza, Tipo de daño, Gravedad, Superficie)', 'Neumáticos (Posición, Marca, Medida, Labrado)', 'Testigos encendidos; si no hay: «Ningún testigo encendido»'],
    extras: { resumen: ['Descripción', 'Marca', 'Valor (USD)'] },
    valores: ['Valor asegurado del casco, de extras y total (de la solicitud)', 'Valor sugerido del casco, de extras y total', 'Diferencia del casco y Extras sobre el casco, con su alerta'],
  },

  // ---------- Derivados y alertas ----------
  derivados: {
    veh_kilometraje_anual: 'veh_kilometraje / MAX(1, 2026 − veh_anio_compra), redondeado, en km',
    veh_valor_sugerido_extras: 'Suma de Valor (USD) de la grilla de extras',
    veh_valor_sugerido_total: 'veh_valor_sugerido_casco + veh_valor_sugerido_extras',
    veh_diferencia_valor: '(sugerido del casco − asegurado del casco) ÷ asegurado del casco, en %, con signo',
    veh_extras_sobre_casco: 'Valor asegurado de extras ÷ valor asegurado del casco, en %',
  },
  alertas: [
    { campo: 'veh_diferencia_valor', regla: 'Menor a −10 %: «Posible sobreseguro»; mayor a +10 %: «Posible infraseguro»', umbral: 10, nota: 'Mismo umbral que la regla «Diferencia de valor»' },
    { campo: 'veh_extras_sobre_casco', regla: 'Mayor a 20 % en livianos: «Extras sobre el límite»', umbral: 20 },
  ],
  polaridad: {
    favorable: { 'veh_testigo_*': 'Apagado', 'veh_verificacion_*': 'Verificado', 'vex.res': 'Sin novedad', veh_contrato_compraventa: 'Sí' },
    desfavorable: { 'veh_testigo_*': 'Encendido', 'veh_verificacion_*': 'No verificado', 'vex.res': 'Con novedad' },
    labrado: { desfavorableMenorA: 1.6, atencionMenorA: 3, nota: 'mm; 1,6 mm es el mínimo legal habitual (por confirmar con Suscripción)' },
  },

  // ---------- Resultado esperado de ejemplo ----------
  esperado: {
    '20175-V1': 'Asegurable · Todo riesgo · Calificado por Verónica Lema el 04/10/26 · 11:15 · Regla: Vehículos de alto valor (USD 41.500) · Emitido POL-2026-117842. Sin averías ni extras.',
    '20196-V1': 'No asegurable · Daños preexistentes no reparados · Calificado por Verónica Lema · Regla: Diferencia de valor −12,1 % · Emitido por excepción POL-2026-118296 (solo en el Informe). Diferencia del casco −12,1 %: «Posible sobreseguro». 2 averías y 2 extras.',
    '20196-V2': 'Asegurable · Pérdida total · Determinado por el inspector Marco Tapia el 16/10/26 · 10:35 · Emitido POL-2026-118297.',
    '20196-V3': 'Asegurable · Todo riesgo · Calificado por Verónica Lema el 16/10/26 · 12:50 · Regla: Autoinspección · Sin placa: archivo con 20196-V3 · Sin firma (no es presencial).',
  },
};
