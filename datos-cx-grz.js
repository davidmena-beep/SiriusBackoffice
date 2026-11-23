// SIRIUS · PDF de Vehículos con todo lo capturado, con la conexión simulada (v1.0 · provisional · etapa P-1f · DEC-273 · 22/11/2026)
// pdfvehgrz: el caso real de David (50061, GRZ3277) con EXACTAMENTE los datos de su base: 62 respuestas del formulario con valor (cada una { org, valor }),
//   todo lo demás vacío («Por completar», también las grillas de neumáticos, extras, averías y verificaciones), y de la app de autoinspección el tipo
//   («sedan») y la lista de extras (Neblineros · Ford). Decisión al completar de David Alejandro Mena (Administrador, en lugar del Control de calidad de
//   Eurosurvey) el 22/11/2026 16:26, dentro de la facultad de la agencia; calificación de nivel 0 Asegurable y riesgo_estado Inspeccionado · Asegurable.
//   16 fotos con su respaldo (fecha, hora y GPS) de la propuesta aprobada (assets/grz3277), con los pasos y nombres de su formulario publicado de
//   autoinspección (la escena lo agrega a SIRIUS_FORMULARIOS). La hora de la base (reloj.ahora) es la de la propuesta: 22/11/2026 21:26.
// pdfvehaverias: caso 50062 presencial (PCD6210) con lo que el GRZ3277 no tiene: 2 averías con pieza y 1 sin pieza, 3 verificaciones externas (Fiscalía
//   por placa con una novedad, ANT y SRI), un extra verificado con su foto, cobertura, condiciones de póliza, observación general, criterio del inspector,
//   motivo de envío a calificación y la firma de quien atiende; calificado Asegurable en nivel 1 por Daniela Ruiz.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const ESC = { pdfvehgrz: '50061', pdfvehaverias: '50062' };
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = [ESC[k], 'ninguna']; });
  const R = (valor, org) => ({ valor, org: org || 'Cliente' }), V0 = () => ({ valor: '', org: 'Por completar' });
  const RE = (estado, ver) => ({ estado, corta: estado, badge: estado === 'Inspeccionado' ? 'success' : 'warning', fase: estado === 'Inspeccionado' ? 5 : 3, veredicto: ver || null });
  // Todas las claves del formulario «Vehículos livianos v1» vacías (Por completar); después se ponen las que tienen valor.
  const vacias = () => { const T = ((window.SIRIUS_EJEMPLO || {}).plantillas || {})['Vehículos livianos v1'] || {}, out = {}; Object.keys(T.campos || {}).forEach((s) => (T.campos[s] || []).forEach((f) => { out[f.k] = V0(); })); return out; };
  // ---------- 50061 · GRZ3277 (datos de la base de David) ----------
  const GRZ = { veh_agencia: 'Quito', veh_aire_acondicionado: 'No', veh_anio_compra: '2010', veh_anio_matricula: '2015', veh_anio_modelo: '2018', veh_aros: 'Aluminio', veh_blindaje: 'No', veh_caducidad_licencia: '22/11/2026',
    veh_camara_retro: 'No', veh_camv_cpn: 'adasdddd', veh_cantidad_airbags: '8', veh_cilindraje: '2500', veh_ciudad_circulacion: 'Quito', veh_clase: 'Automóvil', veh_color: 'Amarillo', veh_combustible: 'Gasolina',
    veh_conductor_habitual: 'Es el asegurado', veh_contrato_compraventa: 'No', veh_estribos: 'No', veh_fecha_hora_carga: '20/11/2026 · 23:19', veh_fecha_hora_inspeccion: '20/11/2026 · 23:19', veh_fuente_valor: 'Guía de precios',
    veh_gad_matriculacion: 'Quito', veh_identificacion_propietario: '1751830132', veh_interes_asegurable: 'Propietario', veh_kilometraje: '100000', veh_laminas_seguridad: 'No', veh_marca: 'Kia', veh_modalidad_realizada: 'Autoinspección',
    veh_modelo: 'Sportage LX', veh_neblineros: 'No', veh_nombre_matricula: 'EMILY JULIANA MENA', veh_numero_motor: 'KIGBT5512447', veh_pais_origen: 'Ecuador', veh_parrilla: 'No', veh_pasajeros: '5', veh_placa: 'GRZ3277',
    veh_puntos_licencia: '30', veh_radio: 'Fijo', veh_satelital: 'No', veh_sunroof: 'No', veh_techo_panoramico: 'No', veh_telemetria: 'No',
    veh_testigo_check_engine: 'Apagado', veh_testigo_abs: 'Apagado', veh_testigo_airbag: 'Apagado', veh_testigo_presion_aceite: 'Apagado', veh_testigo_bateria: 'Apagado', veh_testigo_temperatura: 'Apagado', veh_testigo_frenos: 'Apagado',
    veh_tipo_carroceria: 'Sedán', veh_tipo_licencia: 'B', veh_uso: 'Particular', veh_valor_asegurado_casco: '18000', veh_valor_asegurado_extras: '3800', veh_valor_comercial_referencia: '18000', veh_valor_sugerido_casco: '18000',
    veh_verificacion_chasis_relieve: 'Verificado', veh_verificacion_plaqueta_panoramica: 'Verificado', veh_vidrios_electricos: 'No', veh_vigencia_matricula: '22/11/2026', veh_vin: '8XAPRB22042024000' };
  const APP = { tipo: 'sedan', extras: [{ nombre: 'Neblineros', marca: 'Ford', tiene: true, motivo: '' }] };
  // Pasos del formulario publicado de autoinspección (nombres y grupos de la propuesta), con su foto, hora y GPS.
  const PASOS = [['exteriores_frontal', 'Frontal', 'Exteriores', '23:15', 56, 908], ['exteriores_posterior', 'Posterior', 'Exteriores', '23:15', 56, 908], ['exteriores_lateral_izquierdo_de_ade', 'Lateral izquierdo', 'Exteriores', '23:15', 56, 908],
    ['exteriores_lateral_derecho_de_ade', 'Lateral derecho', 'Exteriores', '23:15', 56, 908], ['motor_habitaculo_del_motor', 'Habitáculo del motor', 'Motor', '23:15', 56, 908], ['identificacion_chasis_en_relieve', 'Chasis/VIN grabado', 'Identificación', '23:16', 57, 907],
    ['interiores_tablero_de_instrumento', 'Tablero completo', 'Interiores', '23:16', 57, 906], ['interiores_kilometraje', 'Kilometraje', 'Interiores', '23:17', 58, 906], ['llantas_neumaticos', 'Neumáticos', 'Llantas', '23:17', 58, 906],
    ['llantas_emergencia', 'Neumático de emergencia', 'Llantas', '23:17', 58, 906], ['extras_extras', 'Extras', 'Extras', '23:17', 58, 906], ['danos_danos', 'Daños', 'Daños', '23:17', 57, 906],
    ['documentos_matricula_frontal', 'Matrícula frontal', 'Documentos', '23:18', 57, 905], ['documentos_matricula_posterior', 'Matrícula posterior', 'Documentos', '23:18', 57, 905], ['documentos_licencia_frontal', 'Licencia frontal', 'Documentos', '23:18', 57, 905],
    ['documentos_licencia_posterior', 'Licencia posterior', 'Documentos', '23:18', 57, 905]];
  const FORM = 'Vehículos livianos · Autoinspección';
  const formulario = () => { const F = window.SIRIUS_FORMULARIOS = window.SIRIUS_FORMULARIOS || { formularios: [], vigentes: {} }; F.formularios = F.formularios || []; F.vigentes = F.vigentes || {};
    if (!F.formularios.some((f) => f.id === 'f-auto-50061')) { F.formularios.push({ id: 'f-auto-50061', name: FORM, versions: [{ n: 1, estado: 'Vigente', steps: PASOS.map((p) => ({ id: p[0], name: p[1], group: p[2] })) }] }); F.vigentes['f-auto-50061'] = 1; } };
  const evGrz = () => PASOS.map((p, i) => ({ id: '50061-ev-' + (i + 1), riesgo: '50061-V1', paso: p[0], pasoNombre: p[1], url: 'assets/grz3277/f' + String(i + 1).padStart(2, '0') + '.jpg', fecha: '2026-11-20T' + p[3], hora: '2026-11-20T' + p[3],
    gps: { lat: -(1 + 28300 / 1e5 + p[4] / 1e5), lng: -(78 + 63000 / 1e5 + p[5] / 1e5) }, canal: 'Autoinspección', tipoArchivo: p[2] === 'Documentos' ? 'documento' : 'foto', estado: 'Confirmada' }));
  const DAVID = 'David Alejandro Mena', HDEC = '2026-11-22T16:26';
  const grz = () => {
    const c = { id: '50061', orden: 'EMI-2026-150061', origen: 'BPM de Emisión', ramo: 'Vehículos', tipoRiesgo: 'Vehículos', broker: 'Directo', asegurado: 'EMILY JULIANA MENA', ident: '1751830132', placa: 'GRZ3277', bien: 'Kia Sportage LX 2018 · GRZ3277',
      fecha: '2026-11-20', registrado: '2026-11-20T22:19', sucursal: 'Quito', backoffice: DAVID, estado: 'Inspeccionado', responsable: DAVID, comercial: '', flujoVersion: 2, ciudad: 'Quito', modalidad: 'Autoinspección',
      riesgos: [{ id: '50061-V1', label: 'GRZ3277', nowrap: true, detalle: 'Kia, Sportage LX, 2018', cobertura: '', estado: 'Inspeccionado', riesgo_estado: RE('Inspeccionado', 'Asegurable'), visita: { n: 1, estado: 'Realizada', inicio: '2026-11-20T23:15', inspector: '' } }],
      riesgosBase: [{ id: '50061-V1', descripcion: 'Kia Sportage LX 2018 · GRZ3277', composicion: 'Vehículo', suma: 18000, datos: { placa: 'GRZ3277', marca: 'Kia', modelo: 'Sportage LX', anio: 2018, uso: 'Particular', carroceria: 'Sedán', valorExtras: 3800 } }],
      formularios: ['Vehículos livianos'], placas: ['GRZ3277'], solicitud: { formularios: ['Vehículos livianos'] }, contacto: { nombre: 'EMILY JULIANA MENA', cel: '', correo: '' },
      visita: { estado: 'Terminada', modalidad: 'Autoinspección', origen: 'Cliente', inspector: '', fin: '2026-11-20T23:19' },
      visitasBase: [{ n: 1, modalidad: 'Autoinspección', estado: 'Realizada', inicio: '2026-11-20T23:15', fin: '2026-11-20T23:19', origen: 'Cliente', inspector: '', riesgos: ['50061-V1'], enlace: null, enlaces: [] }] };
    const resp = vacias(); Object.keys(GRZ).forEach((k) => { resp[k] = R(GRZ[k], k === 'veh_modalidad_realizada' || k === 'veh_fecha_hora_carga' ? 'Sistema' : 'Cliente'); });
    resp.tipo = R(APP.tipo); resp.extras = R(APP.extras);
    const inf = { riesgoId: '50061-V1', riesgo: 'Kia Sportage LX 2018 · GRZ3277', estado: 'Completo', plantilla: FORM, plantillaClave: FORM, plantillaVersion: 1, enviadoEn: '2026-11-20T23:19', enviadoPor: 'EMILY JULIANA MENA', canal: 'Autoinspección',
      responsable: { tipo: 'agencia', agencia: 'Eurosurvey', usuario: 'Patricia Andrade' }, vence: '2026-11-23T23:19', respuestas: resp, completadoPor: DAVID, completadoEn: HDEC,
      decision: { tipo: 'determinar', criterio: 'Asegurable', motivo: '', por: DAVID, rol: 'Administrador', hora: HDEC, facultad: { fac: 'Asegurable y No asegurable', dentro: true, origen: 'Agencia Eurosurvey' } } };
    const cal = [{ riesgoId: '50061-V1', riesgo: 'Kia Sportage LX 2018 · GRZ3277', nivel: 0, veredicto: 'Asegurable', cobertura: '', observacion: '', resultado: 'Inspeccionado', por: DAVID, rol: 'Administrador', hora: HDEC }];
    const ev = [{ hora: HDEC, accion: 'Informe completado', detalle: 'GRZ3277 · determinó Asegurable · dentro de la facultad de la agencia Eurosurvey · Inspeccionado', actor: DAVID, rol: 'Administrador' },
      { hora: '2026-11-20T23:19', accion: 'Informe enviado', detalle: 'GRZ3277 · EMILY JULIANA MENA', actor: 'EMILY JULIANA MENA', rol: 'Cliente' },
      { hora: '2026-11-20T22:19', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }];
    return { c, inf, cal, ev, evs: evGrz() }; };
  // ---------- 50062 · PCD6210 (presencial con averías, verificaciones, firma) ----------
  const ave = () => {
    const c = { id: '50062', orden: 'EMI-2026-150062', origen: 'BPM de Emisión', ramo: 'Vehículos', tipoRiesgo: 'Vehículos', broker: 'Andes Brokers', asegurado: 'Lucía Fernanda Paredes', ident: '1716220458', placa: 'PCD6210', bien: 'Toyota Corolla 2021 · PCD6210',
      fecha: '2026-11-21', registrado: '2026-11-21T08:40', sucursal: 'Quito', backoffice: 'Daniela Ruiz', estado: 'Inspeccionado', responsable: 'Daniela Ruiz', comercial: 'Santiago Ortiz', flujoVersion: 2, ciudad: 'Quito', modalidad: 'Presencial',
      riesgos: [{ id: '50062-V1', label: 'PCD6210', nowrap: true, detalle: 'Toyota, Corolla, 2021', cobertura: 'Todo riesgo', estado: 'Inspeccionado', riesgo_estado: RE('Inspeccionado', 'Asegurable'), visita: { n: 1, estado: 'Realizada', inicio: '2026-11-21T10:05', inspector: 'Mauricio Endara' } }],
      riesgosBase: [{ id: '50062-V1', descripcion: 'Toyota Corolla 2021 · PCD6210', composicion: 'Vehículo', suma: 21500, datos: { placa: 'PCD6210', marca: 'Toyota', modelo: 'Corolla', anio: 2021, uso: 'Particular', carroceria: 'Sedán', valorExtras: 900 } }],
      formularios: ['Vehículos livianos'], placas: ['PCD6210'], solicitud: { formularios: ['Vehículos livianos'] }, contacto: { nombre: 'Lucía Fernanda Paredes', cel: '0998162210', correo: '' },
      visita: { estado: 'Terminada', modalidad: 'Presencial', origen: 'Coordinación', inspector: 'Mauricio Endara', fin: '2026-11-21T10:50' },
      visitasBase: [{ n: 1, modalidad: 'Presencial', estado: 'Realizada', inicio: '2026-11-21T10:05', llegada: '2026-11-21T10:05', fin: '2026-11-21T10:50', origen: 'Coordinación', inspector: { nombre: 'Mauricio Endara', agencia: 'Eurosurvey' }, agencia: 'Eurosurvey', riesgos: ['50062-V1'], lugar: { ciudad: 'Quito', direccion: 'Av. República de El Salvador N34-120' } }] };
    const D = { veh_placa: 'PCD6210', veh_marca: 'Toyota', veh_modelo: 'Corolla', veh_anio_modelo: '2021', veh_tipo_carroceria: 'Sedán', veh_clase: 'Automóvil', veh_color: 'Gris', veh_cilindraje: '1800', veh_pasajeros: '5', veh_combustible: 'Gasolina', veh_pais_origen: 'Japón',
      veh_vin: 'JTDBR32E210457813', veh_numero_motor: '2ZR4578130', veh_modalidad_realizada: 'Presencial', veh_fecha_hora_inspeccion: '21/11/2026 · 10:05', veh_fecha_hora_carga: '21/11/2026 · 10:52', veh_agencia: 'Quito', veh_inspector_ejecuto: 'Mauricio Endara',
      veh_persona_atiende: 'Lucía Fernanda Paredes', veh_relacion_asegurado: 'Titular', veh_nombre_matricula: 'Lucía Fernanda Paredes', veh_identificacion_propietario: '1716220458', veh_gad_matriculacion: 'Quito', veh_anio_matricula: '2025', veh_vigencia_matricula: '30/06/2027',
      veh_interes_asegurable: 'Propietario', veh_uso: 'Particular', veh_ciudad_circulacion: 'Quito', veh_anio_compra: '2021', veh_kilometraje: '48200', veh_conductor_habitual: 'Otra persona', veh_cedula_conductor: '1718800342', veh_nombre_conductor: 'Andrés Paredes',
      veh_edad_conductor: '27', veh_tipo_licencia: 'B', veh_caducidad_licencia: '15/03/2028', veh_puntos_licencia: '24', veh_verificacion_chasis_relieve: 'Verificado', veh_verificacion_sticker_vin: 'Verificado', veh_verificacion_plaqueta_panoramica: 'No verificado',
      veh_radio: 'Fijo', veh_aros: 'Aluminio', veh_cantidad_airbags: '7', veh_aire_acondicionado: 'Sí', veh_camara_retro: 'Sí', veh_satelital: 'Sí', veh_proveedor_satelital: 'Hunter', veh_telemetria: 'No', veh_blindaje: 'No',
      veh_testigo_check_engine: 'Apagado', veh_testigo_abs: 'Apagado', veh_testigo_airbag: 'Apagado', veh_testigo_frenos: 'Encendido', veh_valor_asegurado_casco: '21500', veh_valor_asegurado_extras: '900', veh_valor_comercial_referencia: '20800', veh_fuente_valor: 'Guía de precios',
      veh_valor_sugerido_casco: '20800', veh_decision_inspector: 'Enviar a calificación', veh_cobertura: 'Todo riesgo', veh_motivo_envio_a_calificacion: 'Testigo de frenos encendido y una novedad en Fiscalía por placa.',
      veh_condiciones_poliza: 'Excluir los daños preexistentes del parachoques posterior y de la puerta delantera derecha.', veh_observacion_general: 'Vehículo en buen estado general; dos daños leves y un rayón sin pieza identificada en la tabla.', veh_firma_atiende: 'assets/grz3277/firma-prueba.png' };
    const resp = vacias(); Object.keys(D).forEach((k) => { resp[k] = R(D[k], 'Campo'); });
    resp.veh_averias = { valor: [{ pieza: 'Parachoques posterior', tipo: 'Rayón', grav: 'Baja', prof: 'Superficial', sup: '1,5', desc: 'Rayones en la esquina izquierda' }, { pieza: 'Puerta delantera derecha', tipo: 'Hundimiento', grav: 'Media', prof: 'Media', sup: '2,4', desc: '' },
      { pieza: '', tipo: 'Rayón', grav: 'Baja', prof: 'Superficial', sup: '', desc: 'Rayón leve sin pieza identificada' }], org: 'Campo' };
    resp.veh_verificaciones_externas = { valor: [{ consulta: 'Fiscalía por placa', res: 'Con novedad', at: '21/11/26 · 10:40', forma: 'Consulta automática', obs: 'Denuncia por robo de 2019, archivada' }, { consulta: 'ANT', res: 'Sin novedad', at: '21/11/26 · 10:41', forma: 'Consulta automática', obs: '' },
      { consulta: 'SRI', res: 'Sin novedad', at: '21/11/26 · 10:42', forma: 'Consulta manual', obs: 'Matrícula al día' }], org: 'Sistema' };
    resp.veh_extras = { valor: [{ desc: 'Alarma', marca: 'Viper', valor: '900', foto: 'extras_extras' }], org: 'Campo' };
    const inf = { riesgoId: '50062-V1', riesgo: 'Toyota Corolla 2021 · PCD6210', estado: 'Completo', plantilla: 'Vehículos livianos v1', plantillaVersion: 1, enviadoEn: '2026-11-21T10:52', enviadoPor: 'Mauricio Endara', canal: 'App de inspección', responsable: 'Daniela Ruiz',
      respuestas: resp, completadoPor: 'Daniela Ruiz', completadoEn: '2026-11-21T11:20', decision: { tipo: 'enviarCalificacion', criterio: 'Enviar a calificación', motivo: '', por: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones', hora: '2026-11-21T11:20' } };
    const cal = [{ riesgoId: '50062-V1', riesgo: 'Toyota Corolla 2021 · PCD6210', nivel: 1, veredicto: 'Asegurable', cobertura: 'Todo riesgo', observacion: 'Con las condiciones de póliza del informe.', resultado: 'Inspeccionado', por: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones', hora: '2026-11-22T11:40' }];
    const ev = [{ hora: '2026-11-22T11:40', accion: 'Calificación', detalle: 'PCD6210 · Asegurable · nivel 1', actor: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones' }, { hora: '2026-11-21T11:20', accion: 'Informe completado', detalle: 'PCD6210 · enviado a calificación', actor: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones' },
      { hora: '2026-11-21T10:52', accion: 'Informe enviado', detalle: 'PCD6210 · Mauricio Endara', actor: 'Mauricio Endara', rol: 'Inspector' }, { hora: '2026-11-21T10:05', accion: 'Visita iniciada', detalle: 'PCD6210 · Mauricio Endara', actor: 'Mauricio Endara', rol: 'Inspector' },
      { hora: '2026-11-21T08:40', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }];
    const FT = (n) => 'assets/prueba-pdf/' + n + '.jpg', P2 = [['exteriores_frontal', 'frontal'], ['exteriores_posterior', 'posterior'], ['exteriores_lateral_izquierdo_de_ade', 'lateral-izq'], ['exteriores_lateral_derecho_de_ade', 'lateral-der'], ['identificacion_placa_trasera', 'placa-trasera'],
      ['interiores_kilometraje', 'kilometraje'], ['extras_extras', 'frontal'], ['danos_danos', 'posterior'], ['documentos_matricula_frontal', 'matricula']];
    const evs = P2.map((p, i) => ({ id: '50062-ev-' + (i + 1), riesgo: '50062-V1', paso: p[0], url: FT(p[1]), fecha: '2026-11-21T10:' + String(8 + i * 3).padStart(2, '0'), hora: '2026-11-21T10:' + String(8 + i * 3).padStart(2, '0'), gps: { lat: -0.17652, lng: -78.47811 }, canal: 'App de inspección', tipoArchivo: p[0].indexOf('documentos_') === 0 ? 'documento' : 'foto', estado: 'Confirmada' }));
    return { c, inf, cal, ev, evs }; };
  const datos = (escena) => { const A = escena === 'pdfvehgrz' ? grz() : ave(), id = A.c.id;
    if (escena === 'pdfvehgrz') formulario();
    const usuario = escena === 'pdfvehgrz' ? { nombre: DAVID, email: 'david.mena@asur.ec', rol: 'Administrador', roles: ['Administrador'] } : { nombre: 'Daniela Ruiz', email: 'daniela.ruiz@asur.ec', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'] };
    return { usuario, casos: [A.c], detalles: {}, eventos: { [id]: A.ev }, evidencias: { [id]: A.evs }, controles: { [id]: [] }, informes: { [id]: [A.inf] }, calificaciones: { [id]: A.cal }, inspectores: [], notificaciones: [], grz: { escena }, reloj: { ahora: escena === 'pdfvehgrz' ? '2026-11-22T21:26' : '2026-11-22T12:05' } /* la hora de la base: la de la propuesta aprobada */ }; };
  // documentoRegistrar: el de la base simulada (P-1c2), con la hora y el usuario de la propuesta para estos casos.
  const regBase = CC.documentoRegistrar;
  CC.documentoRegistrar = function (X, d) { const p = regBase ? regBase(X, d) : Promise.resolve({ ok: false, mensaje: 'La conexión no registra documentos' });
    if (!X || !X.grz) return p; return p.then((r) => r && r.ok ? Object.assign({}, r, { generadoEn: X.grz.escena === 'pdfvehgrz' ? '2026-11-22T21:26' : '2026-11-22T12:05', por: ((X.usuario || {}).nombre) || r.por }) : r); };
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { return ESC[escena] ? datos(escena) : baseCC(escena); };
  CC.cxGrz = { escenas: Object.keys(ESC), claves: GRZ, app: APP };
})();
