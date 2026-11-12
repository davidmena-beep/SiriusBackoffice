// SIRIUS · Completar el informe y Control de calidad de la agencia (v1.9 · provisional · etapa C2-22 · 12/11/2026) · DEC-180
// v1.9 (etapa C2-22): `cxLimpio` con «Solicitud registrada» del 08/11/2026 19:15 y tres eventos con la fecha escrita con año de cuatro dígitos («dd/mm/aaaa · hh:mm») en el mismo día y a horas distintas, para probar el orden del Historial (escenas cxlimpio e historden).
// v1.8 (etapa C2-21 · DEC-200): `cxLimpio` (escena cxlimpio): la conexión completa simulada con el caso 30004 Inspeccionado (registrado, visita con cita, llegada y fin, informe sin número de versión, evidencias, eventos desordenados y su calificación).
// v1.7 (etapa C2-20 · DEC-199): `cxCalifPrueba` (escena calcxcalif) con dos calificaciones de 30004 en la forma de SIRIUS_CONEXION.calificaciones (nivel 0 y nivel 1).
// v1.6 (etapa C2-19 · DEC-198): 30006 trae dos controles (llegada fuera del radio y foto sin ubicación) para el paso Controles del inspector independiente.
// v1.5 (etapa C2-16): `cxFotosPrueba` (escena infcxfotos) con 6 evidencias de 30004 en la forma de la conexión.
// v1.4 (etapa C2-9 · DEC-185): los controles de completar traen tipo, severidad y detalle; 30004 con los 9 tipos de control (uno ya «Correcto»).
// v1.3 (etapa C2-5): `conexionPrueba` (escena infcompletarcx) con casos de la conexión que traen inspector { nombre, tipo, agencia } y vence.
// v1.2 (etapa C2-4): el caso 20152 nace en la v2 de Vehículos (su visita termina en la app con T23).
// v1.1 (etapa C2-3b, disposición): `insumosRG` (insumos de campo de la redacción del informe de Ramos Generales).
// Fuente única de: reglas de quién completa el informe después de la visita, decisiones del Control de calidad y determinación del inspector,
// bandeja «Informes por completar», criterio del inspector en campo, controles de las evidencias de campo y los casos de ejemplo de la etapa.
// El estado «Informe por completar», su plazo (24 h hábiles, alerta al 80 %) y las transiciones T23 a T27 viven en datos-flujo.js (v1.3) y
// datos-flujo-motor.js (v1.3); el rol, sus permisos y la opción de la agencia, en datos-usuarios.js (v1.8).
// Reloj: SIRIUS_EJEMPLO.ahora() (18/10/2026 · 20:30, domingo). Los casos nuevos nacieron con la versión 2 de su flujo (flujoVersion: 2).
(function () {
  const C = {
    version: '1.3', vigencia: 'Provisional', decision: 'DEC-180',
    plazo: { horas: 24, alertaPct: 80, alVencer: 'Tarea al Coordinador de la sucursal', reinicio: 'Al reenviar un informe devuelto, el plazo vuelve a 24 h hábiles' },
    aplica: 'Vehículos (presencial y virtual guiada) y Ramos Generales (presencial), en los flujos v2 o posteriores',
    // Quién completa (se resuelve con el inspector de la visita y la opción de su agencia vigente al terminar la visita).
    quien: [
      'Inspector interno o independiente: completa él mismo (en la app o en el back-office) y determina con su facultad.',
      'Inspector de agencia: en la app solo captura lo clave y su criterio (Asegurable o No asegurable, con comentario); completa el Control de calidad de su agencia.',
      'Si la agencia tiene «Sus inspectores completan su propio informe» en Sí, el inspector lo completa en el back-office (no en la app). Aplica a los casos cuya visita termina después del cambio.',
    ],
    // Decisión del Control de calidad (agencia).
    decisionesCC: [
      { id: 'confirmar', titulo: 'Confirmar el criterio del inspector', desc: 'Se aplica la facultad del inspector: Asegurable dentro de su facultad pasa a Inspeccionado; si no, va a calificación.' },
      { id: 'cambiar', titulo: 'Cambiar el criterio', desc: 'Motivo obligatorio. El caso va siempre a calificación con los dos criterios.', motivo: true },
      { id: 'devolver', titulo: 'Devolver al inspector', desc: 'Motivo obligatorio. El inspector corrige y reenvía; el plazo se reinicia.', motivo: true },
    ],
    // Determinación del inspector interno o independiente (o de agencia con la opción).
    determinacion: [
      { id: 'Asegurable', desc: 'Dentro de tu facultad pasa a Inspeccionado.' },
      { id: 'No asegurable', desc: 'Con motivo. Dentro de tu facultad pasa a Inspeccionado.', motivo: true },
      { id: 'Enviar a calificación', desc: 'El Ejecutivo de inspecciones califica el caso.' },
    ],
    reglas: [
      '«Completar y enviar» se habilita cuando no quedan obligatorios pendientes.',
      '«Guardar borrador» guarda el avance; el informe sigue «Por completar».',
      'El Historial registra cada guardado, cada decisión y cada devolución con su motivo.',
    ],
    bandeja: { pestanas: ['Por completar', 'Devueltos al inspector', 'Completados (últimos 30 días)'], orden: 'Por plazo: el que vence primero, arriba', diasCompletados: 30 },
    // Criterio en campo, controles de las evidencias y lo que ya pasó (devoluciones y completados) por caso.
    casos: {
      '30003': { visitaFin: '2026-10-15T09:40', criterio: { valor: 'Asegurable', comentario: 'Vehículo sin daños; documentos en regla.', por: 'Diana Cárdenas', hora: '2026-10-15T09:38' },
        completado: { at: '2026-10-15T15:10', por: 'Patricia Andrade', rol: 'Control de calidad (agencia)', decision: 'confirmar', criterio: 'Asegurable', resultado: 'Inspeccionado' }, controles: [] },
      '30004': { visitaFin: '2026-10-16T11:00', criterio: { valor: 'Asegurable', comentario: 'Vehículo en buen estado, sin daños visibles; el kilometraje es coherente con el año.', por: 'Mauricio Endara', hora: '2026-10-16T10:52' },
        // Etapa C2-9 · DEC-185: los 9 tipos de control con tipo, severidad y detalle (misma forma que los controles de la conexión, P-6d); texto y estado siguen para el panel.
        controles: [
          { id: 'placa', texto: 'Placa leída no coincide con la solicitud', tipo: 'Placa leída no coincide con la solicitud', severidad: 'Alta', estado: 'Pendiente', detalle: { paso: 'identificacion_placa_trasera', leida: 'PRB2Z04', solicitud: 'PRB2204' } },
          { id: 'vin', texto: 'Foto del VIN con poca luz', tipo: 'Foto del VIN con poca luz', severidad: 'Media', estado: 'Pendiente', detalle: { paso: 'identificacion_sticker_vin', validaciones: { luz: false } } },
          { id: 'forzada', texto: 'Foto tomada sin cumplir las validaciones', tipo: 'Foto tomada sin cumplir las validaciones', severidad: 'Media', estado: 'Pendiente', detalle: { paso: 'exteriores_lateral_izquierdo_de_ade', validaciones: { forzada: true } } },
          { id: 'lejos', texto: 'Foto lejos de la dirección de la visita', tipo: 'Foto lejos de la dirección de la visita', severidad: 'Media', estado: 'Pendiente', detalle: { paso: 'motor_habitaculo_del_motor', distancia: 420, radio: 150 } },
          { id: 'sinGps', texto: 'Foto sin ubicación', tipo: 'Foto sin ubicación', severidad: 'Baja', estado: 'Pendiente', detalle: { paso: 'interiores_tablero_de_instrumento', gps: null } },
          { id: 'llegada', texto: 'Llegada del inspector fuera del radio', tipo: 'Llegada del inspector fuera del radio', severidad: 'Media', estado: 'Pendiente', detalle: { distancia: 380, radio: 150 } },
          { id: 'anio', texto: 'Año del informe distinto al de la solicitud', tipo: 'Año del informe distinto al de la solicitud', severidad: 'Media', estado: 'Pendiente', detalle: { anioInforme: 2023, anioSolicitud: 2024 } },
          { id: 'km', texto: 'Kilometraje menor que el de la solicitud', tipo: 'Kilometraje menor que el de la solicitud', severidad: 'Baja', estado: 'Pendiente', detalle: { campo: 'km', informe: '12.400 km', solicitud: '15.000 km' } },
          { id: 'gps', texto: 'Ubicación de las fotos dentro de la dirección', tipo: 'Ubicación de las fotos dentro de la dirección', severidad: 'Baja', estado: 'Correcto', detalle: { distancia: 40, radio: 150 } }] },
      '30005': { visitaFin: '2026-10-14T13:50', criterio: { valor: 'No asegurable', comentario: 'Golpe fuerte en el chasis posterior; reparación sin factura.', por: 'Diana Cárdenas', hora: '2026-10-14T13:45' },
        controles: [{ id: 'dano', texto: 'Daño en el chasis posterior marcado en 2 fotos', tipo: 'Daño marcado por el inspector', severidad: 'Alta', estado: 'Pendiente', detalle: { paso: 'exteriores_posterior', motivo: 'golpe en el chasis posterior, en 2 fotos' } }] },
      // Etapa C2-19 · DEC-198: 30006 (Luis Andrade, independiente) con dos controles; él los ve y confirma «Ya los vi», el calificador los revisa (escena ctrlindep).
      '30006': { visitaFin: '2026-10-16T15:30', criterio: { valor: 'Asegurable', comentario: 'Sin novedades; extras de fábrica.', por: 'Luis Andrade', hora: '2026-10-16T15:26' },
        controles: [
          { id: 'llegada', texto: 'Llegada del inspector fuera del radio', tipo: 'Llegada del inspector fuera del radio', severidad: 'Media', estado: 'Pendiente', detalle: { distancia: 260, radio: 150 } },
          { id: 'sinGps', texto: 'Foto sin ubicación', tipo: 'Foto sin ubicación', severidad: 'Baja', estado: 'Pendiente', detalle: { paso: 'interiores_tablero_de_instrumento', gps: null } }] },
      '30007': { visitaFin: '2026-10-13T15:00', criterio: { valor: 'Asegurable', comentario: 'Rayón leve en la puerta posterior derecha.', por: 'Mauricio Endara', hora: '2026-10-13T14:55' },
        controles: [{ id: 'gps', texto: 'Dos fotos sin ubicación', tipo: 'Foto sin ubicación', severidad: 'Baja', estado: 'Pendiente', detalle: { fotos: 2, gps: null } }], vencido: { at: '2026-10-16T15:00', tarea: 'Andrea Salazar' } },
      '30008': { visitaFin: '2026-10-15T16:20', criterio: { valor: 'Asegurable', comentario: 'Vehículo con mantenimiento al día.', por: 'Diana Cárdenas', hora: '2026-10-15T16:12' },
        devuelto: { at: '2026-10-16T16:40', por: 'Patricia Andrade', motivo: 'La foto del VIN está borrosa y no se lee el número; vuelve a tomarla.' }, controles: [{ id: 'vin', texto: 'VIN ilegible en la foto', tipo: 'VIN ilegible en la foto', severidad: 'Media', estado: 'Pendiente', detalle: { paso: 'identificacion_sticker_vin', validaciones: { nitidez: false } } }] },
      // Ramos Generales (presencial): 20195 nació con la v2 de su flujo; en la escena infcompletarrg terminó la visita y Luis Andrade redacta el informe.
      '20195': { visitaFin: '2026-10-16T12:00', criterio: { valor: 'Asegurable', comentario: 'Local y bodega con extintores vigentes; instalación eléctrica ordenada.', por: 'Luis Andrade', hora: '2026-10-16T11:55' }, controles: [], soloEscena: 'infcompletarrg' },
    },
    // Etapa C2-3b · insumos de campo de la redacción RG (fase R; en el prototipo, datos de ejemplo): grupos de fotos de la app (por etiqueta de
    // datos-informe-rg.js), la nota del inspector en campo y los módulos del informe a los que se vinculan.
    insumosRG: {
      '20195': [
        { grupo: 'Fachada y entorno', etiquetas: ['Fachada', 'Lindero', 'Vista satelital'], modulos: ['m02', 'm03', 'm04'], nota: 'Local comercial con bodega posterior; vía asfaltada y vecinos comerciales.', por: 'Luis Andrade · app', hora: '16/10/26 · 09:30' },
        { grupo: 'Construcción', etiquetas: ['Cubierta interior', 'Estructura y entrepisos', 'Medios de egreso'], modulos: ['m05'], nota: 'Estructura de hormigón y cubierta metálica sin filtraciones.', por: 'Luis Andrade · app', hora: '16/10/26 · 09:58' },
        { grupo: 'Instalaciones eléctricas', etiquetas: ['Tablero principal abierto', 'Puesta a tierra'], modulos: ['m06'], nota: 'Tablero principal con breakers; cableado en canaleta.', por: 'Luis Andrade · app', hora: '16/10/26 · 10:20' },
        { grupo: 'Protecciones contra incendio', etiquetas: ['Extintor', 'Detectores y central'], modulos: ['m07', 'm09'], nota: 'Extintores PQS vigentes; detectores en la bodega.', por: 'Luis Andrade · app', hora: '16/10/26 · 10:41' },
        { grupo: 'Seguridad física', etiquetas: ['Cerramiento', 'Puertas de acceso', 'Ventanas', 'Cámaras', 'Central de alarma'], modulos: ['m13'], nota: 'Cámaras y alarma monitoreada; rejas en ventanas.', por: 'Luis Andrade · app', hora: '16/10/26 · 11:05' },
        { grupo: 'Equipos y almacenamiento', etiquetas: ['Equipo electrónico', 'UPS', 'Bodega', 'Apilamiento', 'Orden y aseo'], modulos: ['m15', 'm16', 'm18'], nota: 'Mercadería en perchas metálicas; equipos con UPS.', por: 'Luis Andrade · app', hora: '16/10/26 · 11:30' },
      ],
    },
    // Casos de ejemplo (Vehículos) que se agregan a SIRIUS_EJEMPLO: [id, asegurado, cédula, placa, marca, modelo, año, km, valor, inspector, modalidad, estado, fecha, dirección, contacto, celular].
    ejemplos: [
      ['30003', 'Fernando Iturralde Vega', '1712093845', 'PCK1093', 'Chevrolet', 'Sail', 2023, 21800, 17900, 'Diana Cárdenas', 'Presencial', 'Inspeccionado', '2026-10-14', 'Av. de los Shyris N36-120, Quito', 'Fernando Iturralde', '0991203384'],
      ['30004', 'Andrés Cevallos Rivas', '1718820436', 'PRB2204', 'Chevrolet', 'Onix', 2024, 12400, 19800, 'Mauricio Endara', 'Presencial', 'Informe por completar', '2026-10-15', 'Av. Eloy Alfaro N32-55, Quito', 'Andrés Cevallos', '0987702215'],
      ['30005', 'Lucía Paredes Ortiz', '1716604527', 'PRB3305', 'Kia', 'Seltos', 2022, 38900, 31500, 'Diana Cárdenas', 'Virtual guiada', 'Informe por completar', '2026-10-13', 'Calle Lizardo García E10-80, Quito', 'Lucía Paredes', '0995518832'],
      ['30006', 'Pablo Benítez Salazar', '1719944102', 'PBX1180', 'Hyundai', 'Tucson', 2021, 54300, 24600, 'Luis Andrade', 'Presencial', 'Informe por completar', '2026-10-15', 'Av. Cevallos y Montalvo, Ambato', 'Pablo Benítez', '0983349170'],
      ['30007', 'Carolina Mejía Torres', '1720381156', 'PCD5521', 'Renault', 'Duster', 2023, 18700, 21900, 'Mauricio Endara', 'Presencial', 'Informe por completar', '2026-10-12', 'Av. Mariscal Sucre S12-40, Quito', 'Carolina Mejía', '0998842260'],
      ['30008', 'Ramiro Castillo Andrade', '1713378290', 'PBR6650', 'Mazda', 'CX-5', 2020, 61200, 16800, 'Diana Cárdenas', 'Presencial', 'Devuelto al inspector', '2026-10-14', 'Av. 6 de Diciembre N24-330, Quito', 'Ramiro Castillo', '0984471906'],
    ],
    // Campos del informe que llegan vacíos de la app (obligatorios pendientes) por caso; el resto se toma como en 20202.
    vacios: { '30004': ['veh_numero_motor', 'veh_kilometraje'], '30007': ['veh_numero_motor'], '30008': ['veh_vin'] },
    // Etapa C2-5 · escena infcompletarcx: conexión de prueba (solo datos) con la forma del contrato: casos en «Informe por completar» o «Devuelto al inspector»
    // con inspector { nombre, tipo, agencia } y vence (ISO del plazo de 24 h hábiles). La agencia llega escrita de varias formas; el Control de calidad de
    // Eurosurvey ve las tres primeras (mismo nombre sin mayúsculas ni sufijos), no la de otra agencia ni la del independiente.
    conexionPrueba: {
      usuario: { nombre: 'Patricia Andrade', email: 'patricia.andrade@eurosurvey.com.ec', rol: 'Control de calidad (agencia)', roles: ['Control de calidad (agencia)'], agencia: 'Eurosurvey S.A.' },
      casos: [
        { id: '40101', ramo: 'Vehículos', estado: 'Informe por completar', asegurado: 'María José Recalde', ident: '1718822450', placa: 'PDF2210', bien: 'Chevrolet Onix 2023', fecha: '2026-10-16', sucursal: 'Quito Norte', responsable: 'Patricia Andrade', comercial: 'Santiago Ortiz', backoffice: 'Verónica Lema', broker: 'Directo', flujoVersion: 2, inspector: { nombre: 'Mauricio Endara', tipo: 'Agencia', agencia: 'EUROSURVEY S.A.' }, vence: '2026-10-19T11:00', criterioInspector: { valor: 'Asegurable', comentario: 'Sin daños visibles.', por: 'Mauricio Endara', hora: '16/10/26 · 11:00' } },
        { id: '40102', ramo: 'Vehículos', estado: 'Informe por completar', asegurado: 'Andrés Salgado Mora', ident: '1715543320', placa: 'PCK8813', bien: 'Kia Sportage 2022', fecha: '2026-10-17', sucursal: 'Quito Norte', responsable: 'Patricia Andrade', comercial: 'Santiago Ortiz', backoffice: 'Verónica Lema', broker: 'Directo', flujoVersion: 2, inspector: { nombre: 'Mauricio Endara', tipo: 'Agencia', agencia: 'Eurosurvey Cía. Ltda.' }, vence: '2026-10-20T15:30', criterioInspector: { valor: 'No asegurable', comentario: 'Golpe en el larguero delantero derecho.', por: 'Mauricio Endara', hora: '17/10/26 · 15:30' } },
        { id: '40103', ramo: 'Vehículos', estado: 'Devuelto al inspector', asegurado: 'Daniela Pazmiño', ident: '1720045512', placa: 'PBT4405', bien: 'Toyota Corolla 2021', fecha: '2026-10-15', sucursal: 'Quito Norte', responsable: 'Patricia Andrade', comercial: 'Santiago Ortiz', backoffice: 'Verónica Lema', broker: 'Directo', flujoVersion: 2, inspector: { nombre: 'Mauricio Endara', tipo: 'Agencia', agencia: 'eurosurvey' }, vence: '2026-10-19T17:00', devuelto: { motivo: 'Falta la foto del número de motor.', por: 'Patricia Andrade', at: '2026-10-17T09:40' }, criterioInspector: { valor: 'Asegurable', comentario: '', por: 'Mauricio Endara', hora: '15/10/26 · 17:00' } },
        { id: '40104', ramo: 'Vehículos', estado: 'Informe por completar', asegurado: 'Jorge Proaño', ident: '1712098876', placa: 'PCA7788', bien: 'Hyundai Tucson 2022', fecha: '2026-10-17', sucursal: 'Quito Norte', responsable: 'Diana Cárdenas', comercial: 'Santiago Ortiz', backoffice: 'Verónica Lema', broker: 'Directo', flujoVersion: 2, inspector: { nombre: 'Diana Cárdenas', tipo: 'Agencia', agencia: 'Inspecciones Andinas S.A.' }, vence: '2026-10-20T10:00' },
        { id: '40105', ramo: 'Vehículos', estado: 'Informe por completar', asegurado: 'Lorena Vaca', ident: '1716677012', placa: 'PDC1190', bien: 'Mazda CX-5 2024', fecha: '2026-10-17', sucursal: 'Quito Norte', responsable: 'Luis Andrade', comercial: 'Santiago Ortiz', backoffice: 'Verónica Lema', broker: 'Directo', flujoVersion: 2, inspector: { nombre: 'Luis Andrade', tipo: 'Independiente', agencia: '' }, vence: '2026-10-20T12:00' },
      ],
    },
    // Etapa C2-16 · escena infcxfotos: conexión simulada solo en Informe › Fotos de 30004 con 6 evidencias en la forma de SIRIUS_CONEXION.evidencias
    // ({ id, paso, url, hora, canal, validacion, gps [lat, lng], precision, dispositivo, lecturas }): 2 sin GPS (VIN y matrícula), 1 con el control de la placa
    // (detalle.paso = identificacion_placa_trasera) y 1 sin url (el motor: «Sin imagen»). Las imágenes son láminas de color con el nombre del paso, no fotos de ejemplo.
    cxFotosPrueba: (() => { const img = (t, c) => 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="' + c + '"/><text x="320" y="236" font-family="Arial,sans-serif" font-size="30" font-weight="700" text-anchor="middle" fill="#ffffff">' + t + '</text><text x="320" y="276" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="#ffffff" fill-opacity=".85">Imagen de la base</text></svg>');
      const ok = { vertical: true, encuadre: true, luz: true, nitidez: true, reflejo: true }, ap = 'App del inspector', dsp = 'Samsung Galaxy A54 · app SIRIUS';
      return { caso: '30004',
        evidencias: [
          { id: 'cxf-1', paso: 'exteriores_frontal', url: img('Frontal', '#1f5f8b'), hora: '2026-10-16T10:12', canal: ap, validacion: ok, gps: [-0.18072, -78.46781], precision: 6, dispositivo: dsp },
          { id: 'cxf-2', paso: 'exteriores_posterior', url: img('Posterior', '#2b7a5f'), hora: '2026-10-16T10:14', canal: ap, validacion: ok, gps: [-0.18071, -78.46779], precision: 7, dispositivo: dsp },
          { id: 'cxf-3', paso: 'identificacion_placa_trasera', url: img('Placa trasera', '#8a5a1f'), hora: '2026-10-16T10:21', canal: ap, validacion: ok, gps: [-0.18070, -78.46780], precision: 5, dispositivo: dsp, lecturas: { Placa: { valor: 'PRB2Z04', conf: 0.93 } } },
          { id: 'cxf-4', paso: 'identificacion_sticker_vin', url: img('Sticker VIN', '#5b3f8c'), hora: '2026-10-16T10:26', canal: ap, validacion: { luz: false }, gps: null, dispositivo: dsp },
          { id: 'cxf-5', paso: 'documentos_matricula_frontal', url: img('Matrícula frontal', '#7a2f3a'), hora: '2026-10-16T10:31', canal: ap, validacion: ok, gps: null, dispositivo: dsp },
          { id: 'cxf-6', paso: 'motor_habitaculo_del_motor', url: '', hora: '2026-10-16T10:36', canal: ap, validacion: ok, gps: [-0.18069, -78.46782], precision: 8, dispositivo: dsp } ],
        controles: [ { id: 'placa', tipo: 'Placa leída no coincide con la solicitud', severidad: 'Alta', estado: 'Pendiente', detalle: { paso: 'identificacion_placa_trasera', leida: 'PRB2Z04', solicitud: 'PRB2204' } } ],
        informes: [ { plantilla: 'Vehículos livianos v1' } ] }; })(),
    // Etapa C2-20 · escena calcxcalif: conexión simulada solo en la pestaña Calificación de 30004, con lo que registra la base en SIRIUS_CONEXION.calificaciones[idCaso]
    // ([{ riesgo, nivel, veredicto, cobertura, resultado, observacion, por, rol, hora }], de la más antigua a la más reciente). Nivel 0 = determinada al completar el informe,
    // 1 = Ejecutivo de inspecciones, 2 = Suscriptor. Aquí: nivel 0 de Patricia Andrade y nivel 1 de Verónica Lema, que es la que muestra el bloque «Tu calificación».
    cxCalifPrueba: { caso: '30004', calificaciones: [
      { riesgo: '30004-V1', nivel: 0, veredicto: 'Asegurable', cobertura: '', resultado: 'Aprobado', observacion: '', por: 'Patricia Andrade', rol: 'Control de calidad (agencia)', hora: '2026-10-18T19:52' },
      { riesgo: '30004-V1', nivel: 1, veredicto: 'Asegurable', cobertura: 'Todo riesgo', resultado: 'Aprobado', observacion: 'Asegurable según el informe y los controles revisados; sin observaciones adicionales.', por: 'Verónica Lema', rol: 'Ejecutivo de inspecciones', hora: '2026-10-18T20:24' } ] },
    // Etapa C2-21 · escena cxlimpio: la conexión completa simulada (forma de SIRIUS_CONEXION, sin funciones) con un solo caso, 30004 Inspeccionado, armado solo con datos «de la base»:
    // creado el 08/11/2026 19:15 desde el BPM de Emisión; visita con cita el 11/11/2026 10:30, llegada el 10/11/2026 05:57 y fin el 10/11/2026 18:10; informe «Completo» enviado el
    // 10/11/2026 18:10 con plantillaVersion vacía (la app envió «local»); 24 fotos de la app (3 de documentos y 1 de un paso que no está en la plantilla) y eventos desordenados.
    // Ninguna persona ni fecha es del caso de ejemplo 30004. Todas las horas son de Ecuador.
    cxLimpio: (() => { const img = (t, c) => 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="' + c + '"/><text x="320" y="248" font-family="Arial,sans-serif" font-size="30" font-weight="700" text-anchor="middle" fill="#ffffff">' + t + '</text></svg>');
      const ap = 'App del inspector', dsp = 'Xiaomi Redmi Note 13 · app SIRIUS', ok = { vertical: true, encuadre: true, luz: true, nitidez: true, reflejo: true }, col = ['#1f5f8b', '#2b7a5f', '#8a5a1f', '#5b3f8c', '#7a2f3a', '#356b72'];
      const P = [['exteriores_frontal', 'Frontal'], ['exteriores_posterior', 'Posterior'], ['exteriores_parabrisas', 'Parabrisas'], ['exteriores_lateral_derecho_de_ade', 'Lateral derecho'], ['exteriores_lateral_izquierdo_de_ade', 'Lateral izquierdo'], ['motor_habitaculo_del_motor', 'Motor'],
        ['identificacion_placa_delantera', 'Placa delantera'], ['identificacion_placa_trasera', 'Placa trasera'], ['identificacion_chasis_en_relieve', 'Chasis'], ['identificacion_sticker_vin', 'Sticker VIN'], ['documentos_matricula_frontal', 'Matrícula frontal'], ['documentos_matricula_posterior', 'Matrícula posterior'],
        ['documentos_cedula_frontal', 'Cédula frontal'], ['interiores_puerta_del_conductor', 'Puerta del conductor'], ['interiores_tablero_de_instrumento', 'Tablero'], ['interiores_kilometraje', 'Kilometraje'], ['interiores_asientos_delanteros', 'Asientos delanteros'], ['interiores_asientos_posteriores', 'Asientos posteriores'],
        ['interiores_cajuela_o_balde', 'Cajuela'], ['llantas_delantera_derecha', 'Llanta delantera derecha'], ['llantas_delantera_izquierda', 'Llanta delantera izquierda'], ['llantas_trasera_derecha', 'Llanta trasera derecha'], ['llantas_trasera_izquierda', 'Llanta trasera izquierda'], ['adicional_rayon_guardafango', 'Rayón en el guardafango']];
      const two = (n) => (n < 10 ? '0' : '') + n, gps = [-0.20412, -78.49186];
      const evidencias = P.map((x, i) => ({ id: 'cxl-' + two(i + 1), paso: x[0], url: img(x[1], col[i % col.length]), hora: '10/11/26 · ' + two(6 + Math.floor((2 + i * 2) / 60)) + ':' + two((2 + i * 2) % 60), canal: ap, validacion: ok, gps: [gps[0] + i * 0.00001, gps[1]], precision: 5, dispositivo: dsp }));
      const caso = { id: '30004', orden: 'EMI-2026-118450', origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Asesores Andinos', asegurado: 'Andrés Cevallos Rivas', ident: '1718820436', placa: 'PRB2204', bien: 'Placa PRB2204, 2024', fecha: '2026-11-08', registrado: '2026-11-08T19:15',
        sucursal: 'Quito Norte', backoffice: 'Daniela Ruiz', estado: 'Inspeccionado', responsable: 'Daniela Ruiz', comercial: 'Carolina Vega', flujoVersion: 2, aseg: 'Asegurable', cobertura: 'Todo riesgo', solicitud: { marca: 'Chevrolet', modelo: 'Onix', anio: 2024, placa: 'PRB2204' },
        campos: { canal_venta: 'Bróker' }, contacto: { nombre: 'Andrés Cevallos', cel: '0987702215' }, dir: 'Av. Amazonas N34-120 y Atahualpa, Quito', gps: gps,
        visita: { estado: 'Realizada', inicio: '2026-11-11T10:30', llegada: '2026-11-10T05:57', fin: '2026-11-10T18:10', agendadoEn: '2026-11-10T00:15', origen: 'Coordinador', modalidad: 'Presencial', quienRecibe: 'Andrés Cevallos', inspector: 'Jorge Benítez' },
        criterioInspector: { valor: 'Asegurable', comentario: 'Vehículo en buen estado; sin daños relevantes.', por: 'Jorge Benítez', hora: '10/11/26 · 18:08' } };
      const informes = [{ riesgo: '30004-V1', plantilla: 'Vehículos livianos · Presencial vlocal', plantillaClave: 'Vehículos livianos · Presencial', plantillaVersion: '', estado: 'Completo', enviadoEn: '2026-11-10T18:10', enviadoPor: 'Jorge Benítez', determinacion: 'Asegurable',
        respuestas: { veh_valor_asegurado_casco: { valor: '18500', org: 'solicitud' }, veh_valor_asegurado_extras: { valor: '650', org: 'solicitud' }, placa: { valor: 'PRB2204', org: 'foto:identificacion_placa_trasera', conf: 0.97 }, anio: { valor: '2024', org: 'inspector' }, color: { valor: 'Blanco', org: 'inspector' }, km: { valor: '15230', org: 'foto:interiores_kilometraje', conf: 0.91 }, pintura: 'Bueno', carroceria: 'Bueno', llantas: 'Bueno', obs: 'Vehículo en buen estado; rayón leve en el guardafango delantero derecho.' } }];
      const eventos = [
        { hora: '2026-11-10T18:12', accion: 'Determinación del inspector', detalle: 'Asegurable', actor: 'Jorge Benítez', rol: 'Inspector' },
        { hora: '2026-11-10T00:15', accion: 'Visita agendada', detalle: '11/11/26 · 10:30 · Presencial · Jorge Benítez', actor: 'Carolina Vega', rol: 'Coordinador de inspecciones' },
        { hora: '2026-11-10T19:30', accion: 'Calificación', detalle: 'Asegurable · Todo riesgo', actor: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones' },
        { hora: '2026-11-10T05:57', accion: 'Llegada del inspector', detalle: 'A 40 m de la dirección', actor: 'Jorge Benítez', rol: 'Inspector' },
        { hora: '2026-11-10T18:10', accion: 'Visita terminada', detalle: '', actor: 'Jorge Benítez', rol: 'Inspector' },
        /* C2-22: fechas escritas «dd/mm/aaaa · hh:mm» (año de cuatro dígitos), dos el mismo día a distinta hora */
        { hora: '11/11/2026 · 18:00', accion: 'Comentario del coordinador', detalle: 'El cliente confirmó el retiro del vehículo', actor: 'Carolina Vega', rol: 'Coordinador de inspecciones' },
        { hora: '10/11/2026 · 05:53', accion: 'Inspector en camino', detalle: 'Salió hacia la dirección de la inspección', actor: 'Jorge Benítez', rol: 'Inspector' },
        { hora: '11/11/2026 · 18:12', accion: 'Comentario del ejecutivo', detalle: 'Se pide confirmar el año del vehículo', actor: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones' } ];
      return { usuario: { nombre: 'Daniela Ruiz', email: 'daniela.ruiz@asur.ec', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'] }, casos: [caso], detalles: {}, eventos: { '30004': eventos }, evidencias: { '30004': evidencias }, controles: { '30004': [] }, informes: { '30004': informes },
        calificaciones: { '30004': [{ riesgo: '30004-V1', nivel: 1, veredicto: 'Asegurable', cobertura: 'Todo riesgo', resultado: 'Aprobado', observacion: 'Asegurable según el informe.', por: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones', hora: '2026-11-10T19:30' }] } }; })(),
  };
  window.SIRIUS_COMPLETAR = C;

  // ---------- Casos de ejemplo en SIRIUS_EJEMPLO ----------
  const E = window.SIRIUS_EJEMPLO; if (!E || !E.casos || E.casos.some(c => c.id === '30004')) return;
  const iso2 = (s) => s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(2, 4) + ' · ' + s.slice(11, 16);
  const molde = E.vehiculos.find(v => v.caso === '20202'), evMolde = (E.evidencias || {})['20202-V1'];
  const tx = (v) => v.valor === 'Asegurable' ? 'Asegurable' : v.valor;
  C.ejemplos.forEach(([id, aseg, ced, placa, marca, modelo, anio, km, valor, insp, mod, estado, fecha, dir, cNom, cCel]) => {
    const K = C.casos[id], fin = K.visitaFin, ini = fin.slice(0, 11) + String(Number(fin.slice(11, 13)) - 1).padStart(2, '0') + fin.slice(13);
    const row = { id, orden: '', ramo: 'Vehículos', broker: id === '30006' ? 'Tecniseguros' : 'Asesores Andinos', asegurado: aseg, ident: ced, placa, bien: 'Placa ' + placa + ', ' + anio, fecha, sucursal: id === '30006' ? 'Ambato' : 'Quito Norte', backoffice: 'Verónica Lema', estado, responsable: insp, comercial: 'Santiago Ortiz', flujoVersion: 2,
      criterioInspector: { valor: K.criterio.valor, comentario: K.criterio.comentario, por: K.criterio.por, hora: iso2(K.criterio.hora) } };
    if (K.completado) Object.assign(row, { aseg: K.completado.criterio, califUser: K.completado.por, califFecha: iso2(K.completado.at) });
    E.casos.push(row);
    const campos = JSON.parse(JSON.stringify((molde.informe || {}).campos || {})); (C.vacios[id] || []).forEach(k => { campos[k] = { v: '', src: 'app' }; });
    const v = { caso: id, riesgo: id + '-V1', placa, marca, modelo, anio, km, aseg: valor, sug: valor, cobertura: 'Todo riesgo', modalidad: mod, inspector: insp, fechaInspeccion: iso2(fin).slice(0, 8), formulario: 'Vehículos livianos v1',
      informe: { estado: K.completado ? 'Enviado' : estado === 'Devuelto al inspector' ? 'Devuelto' : 'Por completar', visita: 'V1', canal: 'App del inspector', registradoPor: insp, inspeccion: iso2(ini), carga: iso2(fin), campos },
      sucursal: row.sucursal, lugar: id === '30006' ? 'Ambato' : 'Quito', clase: ['Seltos', 'Tucson', 'Duster', 'CX-5'].includes(modelo) ? 'Jeep' : 'Automóvil', carroceria: ['Seltos', 'Tucson', 'Duster', 'CX-5'].includes(modelo) ? 'SUV' : 'Sedán', uso: 'Particular',
      vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Inspección previa a la emisión', hallazgos: [K.criterio.comentario], eventos: [] };
    if (K.completado) v.calificacion = { aseg: K.completado.criterio, cobertura: 'Todo riesgo', by: K.completado.por, at: iso2(K.completado.at) };
    E.vehiculos.push(v);
    E.visitas = E.visitas || {}; E.visitas[id] = [{ id: 'V1', mod, inspector: insp, fecha: fin.slice(0, 10), hIni: ini.slice(11, 16), hFin: fin.slice(11, 16), dir, inter: '', ref: '', riesgos: [id + '-R1'], estado: 'Realizada', cName: cNom, cCel, cMail: '' }];
    if (evMolde && E.evidencias) { const ev = JSON.parse(JSON.stringify(evMolde)); Object.keys(ev.fotos || {}).forEach(pk => (ev.fotos[pk] || []).forEach((f, i) => { f.id = id + '-V1-' + pk + '-' + (i + 1); f.at = iso2(ini).slice(0, 11) + f.at.slice(11); f.disp = (insp === 'Luis Andrade' ? 'Xiaomi Redmi Note 13' : 'Samsung Galaxy A35') + ' · App del inspector 3.2'; if (f.gps) { f.gps.lat = -0.18 - (f.gps.lat + 2.17) / 3; f.gps.lng = -78.48 - (f.gps.lng + 79.92) / 3; } })); E.evidencias[id + '-V1'] = ev; }
    // Cronología del caso (lo más reciente primero).
    const ev = [];
    if (K.completado) ev.push([iso2(K.completado.at), 'Informe completado por el Control de calidad · confirmó el criterio del inspector (' + K.completado.criterio + ') · dentro de la facultad del inspector · pasa a Inspeccionado', K.completado.por + ' · Control de calidad (agencia)']);
    if (K.devuelto) ev.push([iso2(K.devuelto.at), 'Informe devuelto al inspector · ' + K.devuelto.motivo, K.devuelto.por + ' · Control de calidad (agencia)']);
    if (K.vencido) ev.push([iso2(K.vencido.at), 'Venció el plazo para completar el informe (24 h hábiles) · tarea al Coordinador ' + K.vencido.tarea, 'Sistema']);
    ev.push([iso2(fin), 'Visita terminada en la app · criterio del inspector: ' + tx(K.criterio) + ' · pasa a «Informe por completar» (plazo de 24 h hábiles)', insp]);
    ev.push([iso2(ini), 'Visita iniciada en la app del inspector · ' + mod, insp]);
    E.eventos = E.eventos || {}; E.eventos[id] = ev.concat(E.eventos[id] || []);
  });
  const rg = E.casos.find(c => c.id === '20195'); if (rg) rg.flujoVersion = 2; // nació el 16/10, después de publicar la v2 de Ramos Generales · Ubicación
  const v52 = E.casos.find(c => c.id === '20152'); if (v52) v52.flujoVersion = 2; // etapa C2-4: nació el 12/10, después de publicar la v2 de Vehículos (08:30); su visita termina en la app
})();
