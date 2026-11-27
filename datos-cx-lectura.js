// SIRIUS · Lectura automática y catálogos con la conexión simulada (v1.0 · provisional · etapa L-1 · DEC-292 a DEC-294 · 26/11/2026)
// La asesoría integró la lectura automática de documentos (PP-OCRv4) en la base y en la conexión (SQL 93 a 96). Esta base simulada solo sirve a las escenas de pantallas:
//   catrecom (Catálogos › Recomendaciones como Administrador: 17 pendientes de 9 campos, 1 Agregada y 1 Descartada) · catrecomsolover (lo mismo, sin permiso de acciones: la escena simula a quien ve Catálogos sin ser el Administrador)
//   catrecomagregar (el modal «Agregar al catálogo» de una marca, con el motivo escrito)
//   leccaso (Informe › Identificación del vehículo del 50068, GRZ3276: Lectura, Por confirmar y Editado) · lecconductor (Informe › Uso y conductor: Cédula, Nombre y Edad del conductor
//   se muestran y validan con «Es el asegurado»).
// SIRIUS_CONEXION.catalogoSugerencias = [{ id, campo, valor, veces, estado, primera, ultima, ultimoCaso, resueltoPor }] y resolverSugerenciaCatalogo(id, 'Agregada' | 'Descartada') (la agrega el Back-office
// en su conexión simulada con CC.resolverSugerenciaCatalogo). Los datos del 50068 son de demostración, no los de la base real. informes[].respuestas.__lecturas[clave] = { valor, origen, evidencia, conf, por_confirmar, fecha }.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const ESC = { catrecom: '50068', catrecomsolover: '50068', catrecomagregar: '50068', leccaso: '50068', lecconductor: '50068' };
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = [ESC[k], 'ninguna']; });
  const R = (valor, org) => ({ valor, org: org || 'Cliente' }), V0 = () => ({ valor: '', org: 'Por completar' });
  const DAVID = 'David Alejandro Mena', LEC = 'Lectura automática', HLEC = '2026-11-25T21:44:10-05:00';
  const vacias = () => { const T = ((window.SIRIUS_EJEMPLO || {}).plantillas || {})['Vehículos livianos v1'] || {}, out = {}; Object.keys(T.campos || {}).forEach((s) => (T.campos[s] || []).forEach((f) => { out[f.k] = V0(); })); return out; };
  // Lo que leyó el OCR de la matrícula y de la foto del VIN: [clave, valor, confianza, por_confirmar, evidencia]
  const LECT = [['veh_placa', 'GRZ3276', 0.98, false, 'documentos_matricula_frontal'], ['veh_marca', 'KIA', 0.97, false, 'documentos_matricula_frontal'], ['veh_modelo', 'SPORTAGE GT', 0.84, true, 'documentos_matricula_frontal'],
    ['veh_anio_modelo', '2018', 0.95, false, 'documentos_matricula_frontal'], ['veh_vin', '8XAPRB22042024000', 0.93, false, 'identificacion_chasis_en_relieve'], ['veh_numero_motor', 'KIGBT5512447', 0.91, false, 'documentos_matricula_posterior'],
    ['veh_color', 'TURQUESA', 0.86, true, 'documentos_matricula_frontal'], ['veh_clase', 'AUTOMOVIL', 0.96, false, 'documentos_matricula_frontal'], ['veh_tipo_carroceria', 'SEDAN', 0.90, false, 'documentos_matricula_frontal'],
    ['veh_pais_origen', 'COREA DEL SUR', 0.94, false, 'documentos_matricula_posterior'], ['veh_combustible', 'GASOLINA', 0.95, false, 'documentos_matricula_posterior'], ['veh_cilindraje', '2400', 0.86, false, 'documentos_matricula_posterior'],
    ['veh_pasajeros', '5', 0.90, false, 'documentos_matricula_posterior'], ['veh_nombre_matricula', 'ANDRES PAREDES LEMA', 0.97, false, 'documentos_matricula_frontal'], ['veh_identificacion_propietario', '1710034065', 0.96, false, 'documentos_matricula_frontal'],
    ['veh_gad_matriculacion', 'QUITO', 0.97, false, 'documentos_matricula_frontal'], ['veh_anio_matricula', '2015', 0.95, false, 'documentos_matricula_frontal'], ['veh_vigencia_matricula', '22/11/2026', 0.92, false, 'documentos_matricula_frontal']];
  // Lo que quedó en el informe: lo leído, salvo el cilindraje, que la persona cambió de 2400 a 2500 (queda «Editado»).
  const CLI = { veh_agencia: 'Quito', veh_uso: 'Particular', veh_ciudad_circulacion: 'Quito', veh_anio_compra: '2018', veh_kilometraje: '64000', veh_conductor_habitual: 'Es el asegurado', veh_interes_asegurable: 'Propietario', veh_contrato_compraventa: 'No',
    veh_aire_acondicionado: 'Sí', veh_camara_retro: 'No', veh_radio: 'Fijo', veh_aros: 'Aluminio', veh_cantidad_airbags: '6', veh_vidrios_electricos: 'Sí' };
  const caso = () => {
    const c = { id: '50068', orden: 'EMI-2026-150068', origen: 'BPM de Emisión', ramo: 'Vehículos', tipoRiesgo: 'Vehículos', broker: 'Directo', asegurado: 'ANDRES PAREDES LEMA', ident: '1710034065', placa: 'GRZ3276', bien: 'Kia Sportage GT 2018 · GRZ3276',
      fecha: '2026-11-25', registrado: '2026-11-25T20:10', sucursal: 'Quito', backoffice: DAVID, estado: 'Informe por completar', responsable: DAVID, comercial: '', flujoVersion: 2, ciudad: 'Quito', modalidad: 'Autoinspección',
      riesgos: [{ id: '50068-V1', label: 'GRZ3276', nowrap: true, detalle: 'Kia, Sportage GT, 2018', cobertura: '', estado: 'Informe por completar', riesgo_estado: { estado: 'Informe por completar', corta: 'Por completar', badge: 'warning', fase: 3, veredicto: null }, visita: { n: 1, estado: 'Realizada', inicio: '2026-11-25T21:30', inspector: '' } }],
      riesgosBase: [{ id: '50068-V1', descripcion: 'Kia Sportage GT 2018 · GRZ3276', composicion: 'Vehículo', suma: 17500, datos: { placa: 'GRZ3276', marca: 'Kia', modelo: 'Sportage GT', anio: 2018, uso: 'Particular', carroceria: 'Sedán', valorExtras: 0 } }],
      formularios: ['Vehículos livianos'], placas: ['GRZ3276'], solicitud: { formularios: ['Vehículos livianos'] }, contacto: { nombre: 'ANDRES PAREDES LEMA', cel: '', correo: '' },
      visita: { estado: 'Terminada', modalidad: 'Autoinspección', origen: 'Cliente', inspector: '', fin: '2026-11-25T21:44' },
      visitasBase: [{ n: 1, modalidad: 'Autoinspección', estado: 'Realizada', inicio: '2026-11-25T21:30', fin: '2026-11-25T21:44', origen: 'Cliente', inspector: '', riesgos: ['50068-V1'], enlace: null, enlaces: [] }] };
    const resp = vacias(), lec = {};
    LECT.forEach((x) => { resp[x[0]] = R(x[0] === 'veh_cilindraje' ? '2500' : x[1], LEC); lec[x[0]] = { valor: x[1], origen: LEC, evidencia: x[4], conf: x[2], por_confirmar: x[3], fecha: HLEC }; });
    Object.keys(CLI).forEach((k) => { resp[k] = R(CLI[k], 'Cliente'); });
    resp.veh_modalidad_realizada = R('Autoinspección', 'Sistema'); resp.veh_fecha_hora_carga = R('25/11/2026 · 21:44', 'Sistema'); resp.veh_fecha_hora_inspeccion = R('25/11/2026 · 21:30', 'Sistema');
    resp.__lecturas = lec; // no es un campo: lo que leyó el OCR, con su procedencia
    const inf = { riesgoId: '50068-V1', riesgo: 'Kia Sportage GT 2018 · GRZ3276', estado: 'Enviado', plantilla: 'Vehículos livianos v1', plantillaVersion: 1, enviadoEn: '2026-11-25T21:44', enviadoPor: 'ANDRES PAREDES LEMA', canal: 'Autoinspección',
      responsable: { tipo: 'agencia', agencia: 'Eurosurvey', usuario: 'Patricia Andrade' }, vence: '2026-11-28T21:44', respuestas: resp };
    const ev = [{ hora: '2026-11-25T21:44', accion: 'Informe enviado', detalle: 'GRZ3276 · ANDRES PAREDES LEMA', actor: 'ANDRES PAREDES LEMA', rol: 'Cliente' }, { hora: '2026-11-25T20:10', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }];
    return { c, inf, ev }; };
  // Recomendaciones de catálogo: lo que la lectura leyó y no está en el catálogo de su campo. [campo, valor, veces, estado, primera, ultima, ultimoCaso, resueltoPor]
  const S0 = [['veh_marca', 'GREAT WALL', 7, 'Pendiente', '2026-11-18T10:14', '2026-11-25T18:42', '50066'], ['veh_marca', 'DFSK', 4, 'Pendiente', '2026-11-19T09:02', '2026-11-25T16:20', '50064'], ['veh_marca', 'JAC', 3, 'Pendiente', '2026-11-20T11:30', '2026-11-24T15:08', '50059'],
    ['veh_marca', 'CHEVY', 1, 'Pendiente', '2026-11-23T08:55', '2026-11-23T08:55', '50057'], ['veh_marca', 'FOTON', 5, 'Agregada', '2026-11-17T14:20', '2026-11-24T10:11', '50051', DAVID],
    ['veh_modelo', 'SPORTAGE GT', 5, 'Pendiente', '2026-11-19T15:40', '2026-11-25T21:44', '50068'], ['veh_modelo', 'HILUX CD 4X4', 2, 'Pendiente', '2026-11-22T09:10', '2026-11-24T12:30', '50062'],
    ['veh_color', 'TURQUESA', 6, 'Pendiente', '2026-11-18T12:00', '2026-11-25T21:44', '50068'], ['veh_color', 'MORADO', 2, 'Pendiente', '2026-11-21T17:25', '2026-11-24T09:45', '50060'], ['veh_color', 'PLOMO', 2, 'Pendiente', '2026-11-22T11:05', '2026-11-23T14:50', '50058'],
    ['veh_color', 'GRIS OSCURO', 3, 'Descartada', '2026-11-17T10:00', '2026-11-22T16:00', '50053', DAVID],
    ['veh_clase', 'MOTOCICLETA', 3, 'Pendiente', '2026-11-20T08:15', '2026-11-25T13:12', '50065'], ['veh_tipo_carroceria', 'PICK UP', 4, 'Pendiente', '2026-11-19T13:45', '2026-11-25T10:05', '50063'],
    ['veh_pais_origen', 'TAILANDIA', 2, 'Pendiente', '2026-11-22T16:40', '2026-11-24T11:20', '50062'], ['veh_pais_origen', 'INDIA', 1, 'Pendiente', '2026-11-24T14:05', '2026-11-24T14:05', '50061'],
    ['veh_combustible', 'HIBRIDO ENCHUFABLE', 2, 'Pendiente', '2026-11-21T10:30', '2026-11-25T09:48', '50056'], ['veh_gad_matriculacion', 'SANTO DOMINGO DE LOS TSACHILAS', 3, 'Pendiente', '2026-11-19T18:20', '2026-11-25T17:33', '50067'],
    ['veh_gad_matriculacion', 'LA CONCORDIA', 1, 'Pendiente', '2026-11-24T12:10', '2026-11-24T12:10', '50061'], ['veh_uso', 'TAXI', 2, 'Pendiente', '2026-11-23T10:05', '2026-11-25T08:40', '50054']];
  const sugerencias = () => S0.map((x, i) => Object.assign({ id: 'SUG-' + String(i + 1).padStart(3, '0'), campo: x[0], valor: x[1], veces: x[2], estado: x[3], primera: x[4], ultima: x[5], ultimoCaso: x[6], resueltoPor: x[7] || null }));
  const datos = (esc) => { const A = caso(), admin = esc !== 'catrecomsolover';
    return { usuario: admin ? { nombre: DAVID, email: 'david.mena@asur.ec', rol: 'Administrador', roles: ['Administrador'] } : { nombre: DAVID, email: 'david.mena@asur.ec', rol: 'Administrador', roles: ['Administrador'] },
      casos: [A.c], detalles: {}, eventos: { '50068': A.ev }, evidencias: { '50068': [] }, controles: { '50068': [] }, informes: { '50068': [A.inf] }, calificaciones: { '50068': [] }, inspectores: [], notificaciones: [],
      catalogoSugerencias: sugerencias(), lectura: { escena: esc }, reloj: { ahora: '2026-11-26T09:00' } }; };
  // La base simulada: resolverSugerenciaCatalogo(id, 'Agregada' | 'Descartada') cambia el estado y deja quién la resolvió; si ya estaba resuelta, no la cambia.
  CC.resolverSugerenciaCatalogo = function (X, id, estado) { const s = ((X && X.catalogoSugerencias) || []).find((x) => String(x.id) === String(id));
    if (!s) return Promise.resolve({ ok: false, mensaje: 'La recomendación no existe en la base' }); if (['Agregada', 'Descartada'].indexOf(estado) < 0) return Promise.resolve({ ok: false, mensaje: 'Estado no válido' });
    if (s.estado !== 'Pendiente') return Promise.resolve({ ok: true, yaResuelta: true, estado: s.estado });
    s.estado = estado; s.resueltoPor = ((X.usuario || {}).nombre) || ''; s.resuelta = '2026-11-26T09:00'; return Promise.resolve({ ok: true, estado }); };
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { return ESC[escena] ? datos(escena) : baseCC(escena); };
  CC.cxLectura = { escenas: Object.keys(ESC), lecturas: LECT.map((x) => x[0]) };
})();
