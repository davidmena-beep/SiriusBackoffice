// SIRIUS · Completar el informe y Control de calidad de la agencia (v1.3 · provisional · etapa C2-5 · 09/11/2026) · DEC-180
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
        controles: [{ id: 'vin', texto: 'Foto del VIN con poca luz', estado: 'Pendiente' }, { id: 'gps', texto: 'Ubicación de las fotos dentro de la dirección', estado: 'Correcto' }] },
      '30005': { visitaFin: '2026-10-14T13:50', criterio: { valor: 'No asegurable', comentario: 'Golpe fuerte en el chasis posterior; reparación sin factura.', por: 'Diana Cárdenas', hora: '2026-10-14T13:45' },
        controles: [{ id: 'dano', texto: 'Daño en el chasis posterior marcado en 2 fotos', estado: 'Pendiente' }] },
      '30006': { visitaFin: '2026-10-16T15:30', criterio: { valor: 'Asegurable', comentario: 'Sin novedades; extras de fábrica.', por: 'Luis Andrade', hora: '2026-10-16T15:26' }, controles: [] },
      '30007': { visitaFin: '2026-10-13T15:00', criterio: { valor: 'Asegurable', comentario: 'Rayón leve en la puerta posterior derecha.', por: 'Mauricio Endara', hora: '2026-10-13T14:55' },
        controles: [{ id: 'gps', texto: 'Dos fotos sin ubicación', estado: 'Pendiente' }], vencido: { at: '2026-10-16T15:00', tarea: 'Andrea Salazar' } },
      '30008': { visitaFin: '2026-10-15T16:20', criterio: { valor: 'Asegurable', comentario: 'Vehículo con mantenimiento al día.', por: 'Diana Cárdenas', hora: '2026-10-15T16:12' },
        devuelto: { at: '2026-10-16T16:40', por: 'Patricia Andrade', motivo: 'La foto del VIN está borrosa y no se lee el número; vuelve a tomarla.' }, controles: [{ id: 'vin', texto: 'VIN ilegible en la foto', estado: 'Pendiente' }] },
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
