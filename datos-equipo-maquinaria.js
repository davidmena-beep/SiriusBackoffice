// SIRIUS · Equipo y maquinaria (v1 · provisional · etapa 8 · 03/11/2026)
// Fuente única de: grupos de ramo y composiciones (parametrizables), catálogo de equipos, formulario «Equipo y maquinaria v1»,
// pasos de foto, valor de reposición a nuevo (VRN) y valor real, hallazgos, reglas de envío, niveles y el caso de ejemplo 20204.
// Referencia: caso real 51574 de SIAERP e informe de Eurosurvey (datos del ejemplo FICTICIOS por LOPDP).
// Decisiones: DEC-141 (grupos y composiciones), DEC-142 (VRN), DEC-143 (formulario, hallazgos y niveles).
window.SIRIUS_EQUIPOS = {
  version: '1', vigencia: 'Provisional',

  // ---------- Grupos de ramo y composiciones (DEC-141) ----------
  // Van a Catálogos maestros › Grupos de ramo (editable: agregar, editar, inactivar). Un ramo tiene grupo + tipo de objeto
  // (SIRIUS_EJEMPLO.ramos ya lo trae). SLA, niveles y honorarios se resuelven primero por ramo, luego por composición y
  // por último por grupo.
  composiciones: [
    { tipoObjeto: 'Ubicación', informe: 'Uno por ubicación (módulos comunes y por ramo)', calificacion: 'Una por ramo', seguimientos: 'Del caso' },
    { tipoObjeto: 'Vehículo', informe: 'Uno por vehículo', calificacion: 'Un veredicto por vehículo', seguimientos: 'No aplica' },
    { tipoObjeto: 'Equipo móvil', informe: 'Uno por equipo', calificacion: 'Un veredicto por equipo («Aplicar a otros equipos»)', seguimientos: 'Del caso (Garantías y Documentos)' },
  ],
  grupos: [
    { nombre: 'Vehículos', composiciones: ['Vehículo'], mezcla: false, nivelesPorDefecto: 1, estado: 'Vigente', sistema: true },
    { nombre: 'Ramos Generales', composiciones: ['Ubicación', 'Equipo móvil'], mezcla: 'Solo ramos de la misma composición en un caso', nivelesPorDefecto: 2, estado: 'Vigente', sistema: true },
  ],
  reglasGrupos: [
    'Un grupo nuevo define sus composiciones, si admite mezclar ramos y sus valores por defecto (niveles, SLA, honorarios).',
    'Un caso no mezcla composiciones: una ubicación con sus ramos, o uno o más vehículos, o uno o más equipos.',
    'Un grupo con casos no se elimina: se inactiva. Cambiar sus composiciones muestra el impacto (ramos y casos activos).',
  ],

  // ---------- Catálogo de equipos ----------
  categorias: [
    { id: 'construccion', nombre: 'Construcción y minería', tipos: ['Cargadora de ruedas', 'Excavadora', 'Retroexcavadora', 'Motoniveladora', 'Rodillo compactador', 'Tractor de oruga', 'Volqueta articulada'] },
    { id: 'izaje', nombre: 'Izaje y montacargas', tipos: ['Montacargas', 'Grúa', 'Manipulador telescópico', 'Plataforma elevadora'] },
    { id: 'agricola', nombre: 'Agrícola', tipos: ['Tractor agrícola', 'Cosechadora', 'Fumigadora autopropulsada'] },
    { id: 'generacion', nombre: 'Generación y aire', tipos: ['Generador portátil', 'Compresor portátil', 'Torre de iluminación'] },
    { id: 'especial', nombre: 'Equipo especial', tipos: ['Otro (describir)'] },
  ],
  marcasModelos: [
    { marca: 'Caterpillar', modelos: ['966M XE', '950 GC', '320 GX', '416F2', '140 GC'] },
    { marca: 'Komatsu', modelos: ['PC210LC-11', 'WA380-8', 'D61PX-24'] },
    { marca: 'John Deere', modelos: ['310L', '624P', '6125J'] },
    { marca: 'Toyota', modelos: ['8FGU25', '8FD30'] },
    { marca: 'Volvo', modelos: ['L120H', 'EC220E'] },
    { marca: 'JCB', modelos: ['3CX', '540-170'] },
  ],
  identificacion: {
    pin: { nombre: 'Número de serie (PIN)', norma: 'ISO 10261 (maquinaria de movimiento de tierras): 17 caracteres, empieza con el código del fabricante', patron: '^[A-Z0-9]{17}$', falla: 'Por confirmar: el número de serie no tiene 17 caracteres', nota: 'Para equipos sin PIN de 17 caracteres se acepta la serie del fabricante y se marca «Serie sin formato PIN»' },
    anios: 'Se registran el año de fabricación y el de puesta en servicio (placa del fabricante); la depreciación cuenta desde la puesta en servicio.',
    horometro: 'Lectura con foto del tablero; horas por año = horómetro ÷ años desde la puesta en servicio.',
  },

  // ---------- Formulario «Equipo y maquinaria v1» (composición Equipo móvil) ----------
  // Se arma con la biblioteca de módulos de Formularios; los campos comunes del caso (datos de la inspección, quien atiende) se reutilizan.
  formulario: {
    nombre: 'Equipo y maquinaria v1', ramo: 'Equipo y maquinaria', composicion: 'Equipo móvil', version: 1, estado: 'Vigente',
    secciones: [
      { id: 'eqi', titulo: 'Identificación del equipo', campos: ['Categoría (lista)', 'Tipo (lista según categoría)', 'Descripción del equipo (solo si el tipo es «Otro (describir)»; mínimo 5 caracteres)', 'Marca (catálogo)', 'Modelo (catálogo según marca)', 'Color', 'Año de fabricación', 'Año de puesta en servicio', 'País de origen', 'Número de serie (PIN, validado)', 'Número de motor', 'Capacidad (valor y unidad: t, kg, kW, m³)', 'Peso operativo (kg)', 'Horómetro (h)', 'Horas por año (calculado)'] },
      { id: 'eqd', titulo: 'Documentación', campos: ['Matrícula o registro (Sí · No · En trámite)', 'Número de matrícula (si Sí)', 'Fecha del trámite (si En trámite)', 'Documento de propiedad (factura, contrato)', 'Licencia del operador (Sí/No)', 'Tipo de licencia', 'Vigencia de la licencia', 'Permiso de operación (Sí/No/No aplica)', 'Ficha técnica o catálogo (Sí/No)', 'Contrato de arrendamiento (si uso es Alquiler)'] },
      { id: 'equ', titulo: 'Uso y operación', campos: ['Uso (Propio · Alquiler a terceros · Contratista)', 'Actividad (Construcción · Minería · Petrolera · Agrícola · Portuaria · Industrial · Otra)', 'Horas promedio por día', 'Turnos por día', 'Operador (Propio · Tercero)', 'Experiencia del operador (años)', 'Lugar de trabajo actual', 'Lugar donde pasa la noche (Patio cerrado · Obra · Vía pública)', 'Traslados entre obras (Cama baja · Por sus medios · No se traslada)'] },
      { id: 'eqm', titulo: 'Mantenimiento', campos: ['Bitácora (Sí/No)', 'Mantenimiento preventivo (Sí/No)', 'Frecuencia (cada N horas)', 'Mantenimiento correctivo (Sí/No)', 'Último mantenimiento (fecha)', 'Horómetro en el último mantenimiento', 'Quién lo realiza (Personal propio · Concesionario · Taller externo)', 'Chequeo antes del uso por el operador (Sí/No)'] },
      { id: 'eqs', titulo: 'Seguridad', campos: ['Extintor (Sí/No)', 'Vigencia del extintor', 'GPS o rastreo (Sí/No)', 'Proveedor del rastreo', 'Inmovilizador (Sí/No)', 'Alarma de retroceso (Sí/No)', 'Cabina con estructura antivuelco (ROPS/FOPS) (Sí/No/No aplica)', 'Balizas y luces (Sí/No)', 'Vigilancia del lugar de pernocta (Guardia · Cámaras · Ninguna)'] },
      { id: 'eqc', titulo: 'Estado por componentes', grilla: { columnas: ['Componente', 'Estado (Bueno · Regular · Malo)', 'Observación', 'Foto'], filas: ['Motor', 'Sistema hidráulico', 'Neumáticos u orugas', 'Cabina y vidrios', 'Implemento', 'Estructura y chasis', 'Sistema eléctrico'] } },
      { id: 'eqa', titulo: 'Averías', grilla: { columnas: ['Pieza', 'Tipo de daño', 'Gravedad', 'Foto'], nota: 'Preexistencias del equipo; mismo modelo que Vehículos' } },
      { id: 'eqx', titulo: 'Implementos y accesorios', grilla: { columnas: ['Descripción', 'Marca', 'Serie', 'Valor (moneda de la compañía)'], nota: 'Se suman como extras' } },
      { id: 'eqv', titulo: 'Valores', campos: ['Suma asegurada (de la solicitud, bloqueada)', 'VRN de referencia', 'Fuente del VRN (Cotización · Lista de precios · Factura de equipo nuevo · Catálogo de referencias)', 'Evidencia del VRN (archivo o enlace)', 'Modelo equivalente (si el original ya no se fabrica)', 'Valor real (calculado)', 'Relación suma asegurada / VRN (calculado)', 'Valor de implementos'] },
      { id: 'eqh', titulo: 'Siniestralidad declarada', campos: ['Siniestros en los últimos 3 años (Sí/No)', 'Detalle'] },
      { id: 'eqr', titulo: 'Asegurabilidad', campos: ['Decisión del inspector (solo enviar a calificación al inicio)', 'Observación general', 'Firma de quien atiende (Presencial)'] },
    ],
  },
  pasosFoto: [
    // [id, nombre, grupo, P, V] (autoinspección no aplica a este ramo por defecto)
    ['eq_frontal', 'Frente', 'Exteriores', true, true], ['eq_posterior', 'Posterior', 'Exteriores', true, true],
    ['eq_diag_del_izq', 'Diagonal delantera izquierda', 'Exteriores', true, true], ['eq_diag_del_der', 'Diagonal delantera derecha', 'Exteriores', true, true],
    ['eq_diag_pos_izq', 'Diagonal posterior izquierda', 'Exteriores', true, true], ['eq_diag_pos_der', 'Diagonal posterior derecha', 'Exteriores', true, true],
    ['eq_cabina_ext', 'Cabina por fuera', 'Cabina', true, true], ['eq_cabina_int', 'Cabina por dentro (asiento y cinturón)', 'Cabina', true, false],
    ['eq_mandos', 'Mandos y palancas', 'Cabina', true, false], ['eq_tablero', 'Tablero encendido con horómetro', 'Cabina', true, true],
    ['eq_placa_fabricante', 'Placa del fabricante (serie y año)', 'Identificación', true, true], ['eq_motor', 'Compartimento del motor y número de motor', 'Identificación', true, true],
    ['eq_implemento', 'Implemento (cucharón, horquillas, brazo)', 'Equipamiento', true, true], ['eq_rodaje', 'Neumáticos u orugas', 'Equipamiento', true, true],
    ['eq_extintor', 'Extintor con su etiqueta', 'Seguridad', true, false], ['eq_gps', 'Dispositivo de rastreo', 'Seguridad', false, false],
    ['eq_danos', 'Averías (una por daño)', 'Daños', false, false],
    ['eq_doc_matricula', 'Matrícula o constancia del trámite', 'Documentos', true, true], ['eq_doc_licencia_f', 'Licencia del operador (frente)', 'Documentos', true, true],
    ['eq_doc_licencia_p', 'Licencia del operador (reverso)', 'Documentos', true, true], ['eq_doc_ficha', 'Ficha técnica o catálogo', 'Documentos', false, false],
  ],
  extraccion: ['Placa del fabricante: serie (PIN), modelo, año y peso', 'Tablero: horómetro', 'Licencia del operador: tipo y vigencia', 'Matrícula: número y fecha'],

  // ---------- Valor de reposición a nuevo (DEC-142) ----------
  valores: {
    baseSumaAsegurada: { 'Equipo y maquinaria': 'VRN', opciones: ['VRN', 'Valor real'] },
    vrn: 'Valor de un equipo nuevo de la misma clase, tipo y capacidad, con flete, aranceles y montaje cuando aplican. Si el modelo ya no se fabrica, el equivalente actual.',
    componentesVrn: ['Precio del equipo', 'Flete', 'Aranceles e impuestos de importación', 'Montaje'],
    sugerenciaIA: 'El motor de contexto externo puede proponer un VRN de referencia con su fuente; siempre lo confirma el inspector con evidencia.',
    sinEvidencia: 'Sin evidencia del VRN el campo queda «Por confirmar» y el informe no se puede enviar.',
    // Depreciación para el valor real (no cambia la suma asegurada). Años desde la puesta en servicio.
    depreciacion: { porAntiguedad: [[1, 0], [2, 10], [3, 18], [4, 25], [5, 32], [7, 40], [10, 50], [null, 60]], horasEsperadasPorAnio: 1500,
      ajusteHoras: '+5 % por cada 2.000 h sobre lo esperado (máximo +15 %)', piso: 30, nota: 'Valor real = VRN × (1 − depreciación); nunca menos del 30 % del VRN' },
    alertas: [
      { id: 'infraseguro', si: 'Suma asegurada más de 10 % menor que el VRN', texto: 'Infraseguro: asegurado al {pct} % del VRN; en un siniestro aplica la regla proporcional' },
      { id: 'sobreseguro', si: 'Suma asegurada más de 10 % mayor que el VRN', texto: 'Sobreseguro: {pct} % sobre el VRN' },
    ],
    referencias: [
      { tipo: 'Cargadora de ruedas', marca: 'Caterpillar', modelo: '966M XE', capacidad: '4,2 m³', vrn: 385000, fecha: '2026-09-15', fuente: 'Cotización de distribuidor (ejemplo ficticio)' },
      { tipo: 'Excavadora', marca: 'Komatsu', modelo: 'PC210LC-11', capacidad: '1,2 m³', vrn: 195000, fecha: '2026-08-20', fuente: 'Lista de precios (ejemplo ficticio)' },
      { tipo: 'Montacargas', marca: 'Toyota', modelo: '8FGU25', capacidad: '2,5 t', vrn: 31000, fecha: '2026-07-10', fuente: 'Factura de equipo nuevo (ejemplo ficticio)' },
    ],
  },

  // ---------- Hallazgos del PDF (Equipo y maquinaria) ----------
  hallazgos: [
    { id: 'infraseguro', texto: 'Infraseguro: asegurado al {pct} % del VRN', severidad: 'alta' },
    { id: 'sinMatricula', texto: 'Equipo sin matrícula o con matrícula en trámite', severidad: 'media' },
    { id: 'horometro', texto: 'Horómetro inconsistente con el uso declarado ({hAnio} h/año)', severidad: 'media', si: 'Más de 3.000 h/año o menos de 100 h/año con uso declarado' },
    { id: 'sinMantenimiento', texto: 'Sin bitácora y sin mantenimiento en los últimos 12 meses', severidad: 'media' },
    { id: 'sinGps', texto: 'Equipo de alto valor sin GPS', severidad: 'media', si: 'Suma asegurada mayor a 80.000' },
    { id: 'licencia', texto: 'Licencia del operador vencida o de tipo no adecuado', severidad: 'alta' },
    { id: 'extintor', texto: 'Extintor vencido o ausente', severidad: 'baja' },
    { id: 'hidraulico', texto: 'Sistema hidráulico en estado Malo (posibles fugas)', severidad: 'alta' },
    { id: 'pernocta', texto: 'Pasa la noche en vía pública o sin vigilancia', severidad: 'media' },
    { id: 'antiguedad', texto: 'Antigüedad de {anios} años', severidad: 'media', si: 'Más de 15 años desde la puesta en servicio' },
    { id: 'sobreseguro', texto: 'Sobreseguro: {pct} % sobre el VRN', severidad: 'baja' },
  ],

  // ---------- Calificación (DEC-143) ----------
  calificacion: {
    niveles: { cantidad: 2, nivel1: 'Ejecutivo de inspecciones', nivel2: 'Suscriptor', parametrizable: 'Niveles de calificación permite dejar un solo nivel por ramo' },
    derivacion: ['Manual: el nivel 1 marca «Requerir evaluación de suscripción»', 'Obligatoria: suma asegurada de un equipo mayor a 150.000'],
    determinacionInspector: false, modelo: 'Veredicto directo con reglas de envío',
    reglasEnvio: ['Suma asegurada mayor a 150.000 (va además a nivel 2)', 'Infraseguro mayor a 10 %', 'Sin matrícula o en trámite', 'Antigüedad mayor a 15 años', 'Horómetro inconsistente', 'Sin mantenimiento registrado'],
    seguimientosSugeridos: [
      { hallazgo: 'sinMatricula', tipo: 'Documento', texto: 'Matrícula actualizada del equipo' },
      { hallazgo: 'sinGps', tipo: 'Garantía', texto: 'Instalar dispositivo de rastreo GPS' },
      { hallazgo: 'extintor', tipo: 'Garantía', texto: 'Recargar o instalar extintor vigente' },
      { hallazgo: 'infraseguro', tipo: 'Recomendación', texto: 'Actualizar la suma asegurada al VRN' },
    ],
  },
  honorarios: 'Hora-hombre (SIRIUS_HONORARIOS): inspector por nivel + redacción + «Revisión Máquina y Equipos» por tramos (cada equipo cuenta) + movilización. Corrige modeloPorGrupo: se resuelve por ramo («Equipo y maquinaria» → horaHombre).',

  // ---------- Caso de ejemplo 20204 (datos ficticios) ----------
  ejemplo: {
    caso: '20204', asegurado: 'Constructora Amazonía Sacha S.A.', ruc: '2290456712001', sucursal: 'Quito', ciudad: 'El Coca (Orellana)',
    direccion: 'Vía Coca–Lago Agrio km 4, patio de maquinaria', contacto: { nombre: 'Gabriela Andrade Toapanta', cargo: 'Jefa de equipos', celular: '0987114502', correo: 'equipos@amazoniasacha.ec' },
    broker: 'Asesores Andinos', comercial: 'Santiago Ortiz', backoffice: 'Verónica Lema', estado: 'Pendiente calificación', origen: 'BPM de Emisión',
    visita: { fecha: '2026-10-14', franja: ['09:30', '12:00'], modalidad: 'Presencial', inspector: 'Diana Cárdenas', agencia: 'eurosurvey', nota: 'Fuera de su ciudad base: movilización «Por definir»' },
    ingresoCalificacion: '2026-10-15T16:00',
    equipos: [
      { id: '20204-E1', categoria: 'Construcción y minería', tipo: 'Cargadora de ruedas', marca: 'Caterpillar', modelo: '966M XE', color: 'Amarillo', anioFab: 2017, anioServicio: 2018, pais: 'Estados Unidos', pin: 'CAT0966MXP7A04521', motor: 'SYD20417', capacidad: '4,2 m³', horometro: 12480,
        sumaAsegurada: 100000, vrn: 385000, vrnFuente: 'Cotización de distribuidor (ejemplo ficticio)', implementos: [['Horquillas para pallets', 'Caterpillar', 'HF-2291', 6500]],
        documentacion: { matricula: 'En trámite', tramite: '2026-07-20', licencia: 'Sí', tipoLicencia: 'G', vigenciaLicencia: '2029-07-18' },
        uso: { uso: 'Propio', actividad: 'Construcción', horasDia: 6, operador: 'Propio', pernocta: 'Patio cerrado', vigilancia: 'Guardia' },
        mantenimiento: { bitacora: 'No', preventivo: 'Sí', frecuencia: 250, ultimo: '2026-09-02', quien: 'Personal propio', chequeo: 'Sí' },
        seguridad: { extintor: 'Sí', vigenciaExtintor: '2027-03-31', gps: 'No', alarmaRetroceso: 'Sí', rops: 'Sí' },
        componentes: { 'Motor': 'Bueno', 'Sistema hidráulico': 'Bueno', 'Neumáticos u orugas': 'Regular', 'Cabina y vidrios': 'Bueno', 'Implemento': 'Bueno', 'Estructura y chasis': 'Bueno', 'Sistema eléctrico': 'Bueno' },
        // Etapa 12a-b · averías registradas por la inspectora (preexistencias); «pieza» es la zona de la silueta (SIRIUS_SILUETAS.zonas).
        averias: [{ pieza: 'implemento', descripcion: 'Desgaste en la cuchilla del cucharón', tipo: 'Rayón', gravedad: 'Baja', superficie: 1.2, profundidad: 'Superficial', foto: 'eq_implemento' }],
        esperado: 'Infraseguro (26 % del VRN), sin matrícula (en trámite), alto valor sin GPS; valor real con depreciación de 8 años desde la puesta en servicio; seguimientos sugeridos: Matrícula actualizada, Instalar GPS, Actualizar suma asegurada' },
      { id: '20204-E2', categoria: 'Construcción y minería', tipo: 'Excavadora', marca: 'Komatsu', modelo: 'PC210LC-11', color: 'Amarillo', anioFab: 2021, anioServicio: 2021, pais: 'Japón', pin: 'KMTPC210C55101488', motor: 'SAA6D107E-3', capacidad: '1,2 m³', horometro: 6240,
        sumaAsegurada: 180000, vrn: 195000, vrnFuente: 'Lista de precios (ejemplo ficticio)', implementos: [],
        documentacion: { matricula: 'Sí', numero: 'MAQ-ORE-04471', licencia: 'Sí', tipoLicencia: 'G', vigenciaLicencia: '2028-11-30' },
        uso: { uso: 'Contratista', actividad: 'Petrolera', horasDia: 8, operador: 'Propio', pernocta: 'Obra', vigilancia: 'Cámaras' },
        mantenimiento: { bitacora: 'Sí', preventivo: 'Sí', frecuencia: 500, ultimo: '2026-08-15', quien: 'Concesionario', chequeo: 'Sí' },
        seguridad: { extintor: 'Sí', vigenciaExtintor: '2027-05-31', gps: 'Sí', proveedor: 'Hunter', alarmaRetroceso: 'Sí', rops: 'Sí' },
        componentes: { 'Motor': 'Bueno', 'Sistema hidráulico': 'Bueno', 'Neumáticos u orugas': 'Bueno', 'Cabina y vidrios': 'Bueno', 'Implemento': 'Regular', 'Estructura y chasis': 'Bueno', 'Sistema eléctrico': 'Bueno' },
        esperado: 'Sin hallazgos de valor (−7,7 % del VRN); suma asegurada mayor a 150.000: derivación obligatoria a Suscripción' },
      { id: '20204-E3', categoria: 'Izaje y montacargas', tipo: 'Montacargas', marca: 'Toyota', modelo: '8FGU25', color: 'Naranja', anioFab: 2019, anioServicio: 2019, pais: 'Japón', pin: '8FGU25-61884', motor: '4Y-2219004', capacidad: '2,5 t', horometro: 9900,
        sumaAsegurada: 28000, vrn: 31000, vrnFuente: 'Factura de equipo nuevo (ejemplo ficticio)', implementos: [],
        documentacion: { matricula: 'No', licencia: 'Sí', tipoLicencia: 'G', vigenciaLicencia: '2027-02-14' },
        uso: { uso: 'Propio', actividad: 'Industrial', horasDia: 4, operador: 'Propio', pernocta: 'Patio cerrado', vigilancia: 'Guardia' },
        mantenimiento: { bitacora: 'Sí', preventivo: 'Sí', frecuencia: 250, ultimo: '2026-06-10', quien: 'Taller externo', chequeo: 'Sí' },
        seguridad: { extintor: 'Sí', vigenciaExtintor: '2026-05-31', gps: 'No', alarmaRetroceso: 'Sí', rops: 'Sí' },
        componentes: { 'Motor': 'Bueno', 'Sistema hidráulico': 'Regular', 'Neumáticos u orugas': 'Bueno', 'Cabina y vidrios': 'No aplica', 'Implemento': 'Bueno', 'Estructura y chasis': 'Bueno', 'Sistema eléctrico': 'Bueno' },
        // Etapa 12a-b · averías registradas por la inspectora (preexistencias): coherente con el sistema hidráulico «Regular».
        averias: [{ pieza: 'mastil', descripcion: 'Fuga leve en el cilindro del mástil', tipo: 'Desprendimiento', gravedad: 'Media', superficie: 0.8, profundidad: 'Media', foto: 'eq_rodaje' }],
        esperado: 'Serie sin formato PIN (aceptada con aviso); sin matrícula; extintor vencido (31/05/2026); −9,7 % del VRN (sin alerta)' },
    ],
  },
};
