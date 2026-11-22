// SIRIUS · Determinación al completar por vehículo, con la conexión simulada (v1.0 · provisional · etapa P-1c5 · DEC-271 y DEC-272 · 22/11/2026)
// Forma de la base (como la guardó el caso real 50052): por vehículo,
//  · informes[caso][] con riesgoId y decision = { tipo: 'determinar', criterio, motivo, por, hora, facultad: { fac, dentro } };
//  · calificaciones[caso][] con una de nivel 0 por vehículo (veredicto y su motivo en observacion);
//  · riesgos[].estado y riesgos[].riesgo_estado = { estado, veredicto } (DEC-271); casos[].estado «Inspeccionado» cuando todos los vehículos tienen resultado.
// caldeterminado: caso 50140 de dos vehículos (autoinspección, completa el Control de calidad de Eurosurvey), los dos determinados al completar con horas
//   distintas: 50140-V1 PCX5140 Asegurable (14:24) y 50140-V2 PCX5141 No asegurable con motivo (14:31). Usuario: Daniela Ruiz, Ejecutivo de inspecciones.
// caldeterminadoflujo: caso 50141 con los dos informes recibidos del cliente («Informe por completar») y las respuestas completas, salvo la fecha y hora de
//   inspección (la precarga la pantalla con la hora del envío). Usuario: Andrea Salazar como Administrador. completarInforme lo aplica esta base simulada
//   como la real: decisión en el informe del vehículo, calificación de nivel 0, riesgo_estado y estado del caso; responde { ok: true } y la pantalla vuelve a leer.
// pdfvehpreview usa el caso de ejemplo 20196 (no esta base).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const ESC = { caldeterminado: '50140', caldeterminadoflujo: '50141' };
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = [ESC[k], 'ninguna']; });
  const AG = { tipo: 'agencia', agencia: 'Eurosurvey S.A.', usuario: 'Patricia Andrade', regla: 'Regla 2 · Autoinspección hasta USD 60.000', asignadoEn: '2026-11-21T23:10' };
  const FAC = { fac: 'Asegurable y No asegurable', dentro: true, agencia: 'Eurosurvey' };
  const R = (valor, org, conf) => Object.assign({ valor, org }, conf != null ? { conf } : {});
  const respuestas = (pl, marca, modelo, anio, km, casco, conductor) => ({
    veh_placa: R(pl, 'foto:identificacion_placa_trasera', 0.95), veh_marca: R(marca, 'Solicitud'), veh_modelo: R(modelo, 'Solicitud'), veh_anio_modelo: R(anio, 'Solicitud'),
    veh_vin: R('KNADN512' + pl.slice(-4) + 'L01847', 'foto:identificacion_sticker_vin', 0.93), veh_numero_motor: R('G4LC-' + pl.slice(-4) + '18', 'Cliente'), veh_color: R('Gris', 'Cliente'), veh_tipo_carroceria: R('Sedán', 'Cliente'), veh_uso: R('Particular', 'Cliente'),
    veh_kilometraje: R(km, 'foto:interiores_kilometraje', 0.91), veh_anio_compra: R(anio, 'Cliente'), veh_ciudad_circulacion: R('Quito', 'Cliente'),
    veh_nombre_matricula: R('Flota Autoinspección 6044', 'foto:documentos_matricula_frontal', 0.94), veh_gad_matriculacion: R('Quito', 'Cliente'), veh_vigencia_matricula: R('2027-06-30', 'Cliente'),
    veh_persona_atiende: R('Rocío Benalcázar', 'Cliente'), veh_relacion_asegurado: R('Titular', 'Cliente'), veh_modalidad_realizada: R('Autoinspección', 'Sistema'), veh_conductor_habitual: R(conductor, 'Cliente'),
    veh_verificacion_chasis_relieve: R('Verificado', 'Cliente'), veh_verificacion_sticker_vin: R('Verificado', 'Cliente'), veh_verificacion_plaqueta_panoramica: R('Verificado', 'Cliente'),
    veh_testigo_check_engine: R('Apagado', 'Cliente'), veh_testigo_abs: R('Apagado', 'Cliente'), veh_testigo_airbag: R('Apagado', 'Cliente'), veh_testigo_frenos: R('Apagado', 'Cliente'),
    veh_valor_asegurado_casco: R(casco, 'Solicitud'), veh_valor_asegurado_extras: R('0', 'Solicitud'), veh_valor_sugerido_casco: R(casco, 'Cliente'),
    veh_verificaciones_externas: { valor: ['Fiscalía por placa', 'Fiscalía por cédula', 'ANT', 'Siniestralidad', 'SRI', 'Codificación del VIN'].map((q) => ({ consulta: q, res: 'Sin novedad', at: '21/11/26 · 23:12', forma: 'Consulta automática' })), org: 'Sistema' },
    veh_averias: { valor: pl === 'PCX5141' ? [{ pieza: 'Guardafango posterior izquierdo', tipo: 'Hundimiento', grav: 'Alta', prof: 'Profunda', sup: '6,2', desc: 'Hundimiento profundo sin reparar' }] : [], org: 'Cliente' },
    veh_observacion_general: R(pl === 'PCX5141' ? 'Hundimiento profundo en el guardafango posterior izquierdo, sin reparar.' : 'Vehículo en buen estado.', 'Cliente') });
  const FOTO = (n) => 'assets/prueba-pdf/' + n + '.jpg';
  const PASOS = [['exteriores_frontal', 'frontal'], ['exteriores_posterior', 'posterior'], ['exteriores_lateral_izquierdo_de_ade', 'lateral-izq'], ['exteriores_lateral_derecho_de_ade', 'lateral-der'], ['identificacion_placa_trasera', 'placa-trasera'], ['interiores_kilometraje', 'kilometraje'], ['documentos_matricula_frontal', 'matricula']];
  const evid = (caso, rid, h0) => PASOS.map((p, i) => ({ id: rid + '-ev-' + (i + 1), riesgo: rid, paso: p[0], url: FOTO(p[1]), hora: h0 + ':' + String(10 + i * 3).padStart(2, '0'), gps: { lat: -0.12836, lng: -78.63897 }, precision: 9, dispositivo: 'Celular del cliente · navegador', canal: 'Autoinspección', tipoArchivo: p[0].indexOf('documentos_') === 0 ? 'documento' : 'foto', estado: 'Confirmada', validacion: { vertical: true, encuadre: true, luz: true, nitidez: true, reflejo: true } }));
  const RE = (estado, ver) => ({ estado, corta: estado === 'Inspeccionado' ? 'Inspeccionado' : estado === 'Informe por completar' ? 'Por completar' : estado, badge: estado === 'Inspeccionado' ? 'success' : 'warning', fase: estado === 'Inspeccionado' ? 5 : 3, veredicto: ver || null });
  const caso = (id, estado, est1, est2, ver1, ver2) => ({ id, orden: 'EMI-2026-1' + id, origen: 'BPM de Emisión', ramo: 'Vehículos', tipoRiesgo: 'Vehículos', broker: 'Andes Brokers', asegurado: 'Flota Autoinspección 6044', ident: '1792604401001', placa: 'PCX5140', bien: 'Flota PCX5140 y PCX5141',
    fecha: '2026-11-21', registrado: '2026-11-21T09:00', sucursal: 'Quito', backoffice: 'Daniela Ruiz', estado, responsable: 'Andrea Salazar', comercial: 'Santiago Ortiz', flujoVersion: 2, ciudad: 'Quito', modalidad: 'Autoinspección',
    riesgos: [{ id: id + '-V1', label: 'PCX5140', nowrap: true, detalle: 'Kia, Rio, 2024', cobertura: 'Todo riesgo', estado: est1, riesgo_estado: RE(est1, ver1), visita: { n: 1, estado: 'Realizada', inicio: '2026-11-21T22:40', inspector: '' } },
      { id: id + '-V2', label: 'PCX5141', nowrap: true, detalle: 'Kia, Soluto, 2023', cobertura: 'Todo riesgo', estado: est2, riesgo_estado: RE(est2, ver2), visita: { n: 1, estado: 'Realizada', inicio: '2026-11-21T22:40', inspector: '' } }],
    riesgosBase: [{ id: id + '-V1', descripcion: 'Kia, Rio, 2024 · PCX5140', composicion: 'Vehículo', suma: 19800, datos: { placa: 'PCX5140', marca: 'Kia', modelo: 'Rio', anio: 2024, uso: 'Particular', carroceria: 'Sedán' } },
      { id: id + '-V2', descripcion: 'Kia, Soluto, 2023 · PCX5141', composicion: 'Vehículo', suma: 16400, datos: { placa: 'PCX5141', marca: 'Kia', modelo: 'Soluto', anio: 2023, uso: 'Particular', carroceria: 'Sedán' } }],
    formularios: ['Vehículos livianos', 'Vehículos livianos'], placas: ['PCX5140', 'PCX5141'], solicitud: { formularios: ['Vehículos livianos'] }, contacto: { nombre: 'Rocío Benalcázar', cel: '0991406044', correo: 'flota6044@correo.ec' },
    visita: { estado: 'Terminada', modalidad: 'Autoinspección', origen: 'Cliente', inspector: '', fin: '2026-11-21T23:07' },
    visitasBase: [{ n: 1, modalidad: 'Autoinspección', estado: 'Realizada', inicio: '2026-11-21T22:40', fin: '2026-11-21T23:07', origen: 'Cliente', inspector: '', riesgos: [id + '-V1', id + '-V2'], lugar: { ciudad: 'Quito', direccion: 'Av. Eloy Alfaro N35-12' }, enlace: null, enlaces: [] }] });
  const informe = (id, n, pl, marca, modelo, anio, km, casco, env, conductor) => ({ riesgoId: id + '-V' + n, riesgo: marca + ', ' + modelo + ', ' + anio + ' · ' + pl, estado: 'Datos de campo', plantilla: 'Vehículos livianos · Autoinspección', plantillaClave: 'Vehículos livianos · Autoinspección', plantillaVersion: 1,
    enviadoEn: env, enviadoPor: 'Rocío Benalcázar', canal: 'Autoinspección', responsable: AG, vence: '2026-11-24T23:10', respuestas: respuestas(pl, marca, modelo, anio, km, casco, conductor) });
  const decision = (criterio, motivo, hora) => ({ tipo: 'determinar', criterio, motivo, por: 'Patricia Andrade', rol: 'Control de calidad (agencia)', hora, facultad: Object.assign({}, FAC) });
  const MOT2 = 'Hundimiento profundo en el guardafango posterior izquierdo, sin reparar';
  const datos = (escena) => {
    const det = escena === 'caldeterminado', id = ESC[escena];
    const c = det ? caso(id, 'Inspeccionado', 'Inspeccionado', 'Inspeccionado', 'Asegurable', 'No asegurable') : caso(id, 'Informe por completar', 'Informe por completar', 'Informe por completar');
    const I = [informe(id, 1, 'PCX5140', 'Kia', 'Rio', '2024', '8200', '19800', '2026-11-21T22:55', 'Es el asegurado'), informe(id, 2, 'PCX5141', 'Kia', 'Soluto', '2023', '31400', '16400', '2026-11-21T23:07', 'Otra persona')];
    Object.assign(I[1].respuestas, { veh_nombre_conductor: R('Marco Benalcázar', 'Cliente'), veh_cedula_conductor: R('1716044023', 'Cliente'), veh_edad_conductor: R('38', 'Cliente'), veh_tipo_licencia: R('B', 'Cliente'), veh_caducidad_licencia: R('2028-09-30', 'Cliente') });
    const cal = [], ev = [{ hora: '2026-11-21T23:10', accion: 'Responsable del completado asignado', detalle: 'Control de calidad de Eurosurvey · ' + AG.regla, actor: 'SIRIUS', rol: 'Sistema' },
      { hora: '2026-11-21T23:07', accion: 'Informe enviado', detalle: 'PCX5141 · Rocío Benalcázar', actor: 'Rocío Benalcázar', rol: 'Cliente' }, { hora: '2026-11-21T22:55', accion: 'Informe enviado', detalle: 'PCX5140 · Rocío Benalcázar', actor: 'Rocío Benalcázar', rol: 'Cliente' },
      { hora: '2026-11-21T22:40', accion: 'Autoinspección iniciada', detalle: 'PCX5140 y PCX5141 · el cliente abrió el enlace', actor: 'Rocío Benalcázar', rol: 'Cliente' }, { hora: '2026-11-21T09:00', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }];
    if (det) {
      [['Asegurable', 'Vehículo sin daños; identificación verificada.', '2026-11-22T14:24'], ['No asegurable', MOT2, '2026-11-22T14:31']].forEach((x, k) => { const inf = I[k]; Object.assign(inf, { estado: 'Completo', decision: decision(x[0], x[1], x[2]), completadoPor: 'Patricia Andrade', completadoEn: x[2] });
        inf.respuestas.veh_fecha_hora_inspeccion = R(inf.enviadoEn, 'Sistema');
        cal.push({ riesgo: c.riesgos[k].id, nivel: 0, veredicto: x[0], cobertura: x[0] === 'Asegurable' ? 'Todo riesgo' : '', observacion: x[1], resultado: 'Inspeccionado', por: 'Patricia Andrade', rol: 'Control de calidad (agencia)', hora: x[2] });
        c.riesgos[k].aseg = x[0]; ev.unshift({ hora: x[2], accion: 'Informe completado', detalle: c.riesgos[k].label + ' · determinó ' + x[0] + ' · dentro de la facultad ' + FAC.fac + ' de Eurosurvey · Inspeccionado', actor: 'Patricia Andrade', rol: 'Control de calidad (agencia)' }); });
    }
    const evs0 = evid(id, id + '-V1', '2026-11-21T22'); evs0[0].validacion = 'Aviso: No reconocemos un vehículo en la foto; revisa que se vea el vehículo completo y vuelve a tomarla si hace falta.'; /* P-1c5: el aviso largo de la foto queda dentro de su tarjeta */
    const evs = evs0.concat(evid(id, id + '-V2', '2026-11-21T22').map((e, i) => Object.assign(e, { hora: '2026-11-21T23:' + String(i * 1).padStart(2, '0') })));
    const usuario = det ? { nombre: 'Daniela Ruiz', email: 'daniela.ruiz@asur.ec', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'] } : { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
    return { usuario, casos: [c], detalles: {}, eventos: { [id]: ev }, evidencias: { [id]: evs }, controles: { [id]: [] }, informes: { [id]: I }, calificaciones: { [id]: cal }, inspectores: [], notificaciones: [], determinado: { escena, horas: ['2026-11-22T14:24', '2026-11-22T14:31'] } }; };
  // completarInforme en esta base: el informe del vehículo guarda la decisión; con Asegurable o No asegurable dentro de la facultad de la agencia,
  // la base registra la calificación de nivel 0 y deja el vehículo «Inspeccionado» con su veredicto; el caso pasa a «Inspeccionado» cuando todos tienen resultado.
  const aplicarDet = function (X, tipo, d) {
    const c = (X.casos || []).find((k) => String(k.id) === String((d || {}).caso)), r = c && (c.riesgos || []).find((x) => String(x.id) === String(d.riesgo)); if (!c || !r) return { ok: false, mensaje: 'Falta el vehículo (riesgo) o no está en el caso' };
    const inf = (X.informes[c.id] || []).find((i) => i.riesgoId === r.id); if (!inf) return { ok: false, mensaje: r.label + ' no tiene informe todavía' };
    if (tipo === 'guardarInforme') { inf.respuestas = Object.assign(inf.respuestas || {}, d.respuestas || {}); return { ok: true, local: false, mensaje: 'Borrador guardado · ' + r.label }; }
    if (tipo !== 'completarInforme') return { ok: true, local: false };
    const U = X.usuario || {}, D = X.determinado = X.determinado || { horas: [] }, n = (D.n = (D.n || 0) + 1), H = D.horas[n - 1] || D.horas[D.horas.length - 1] || '2026-11-22T14:40', EV = X.eventos[c.id] = X.eventos[c.id] || [], CA = d.comoAdmin ? ' (como Administrador)' : '';
    inf.respuestas = Object.assign(inf.respuestas || {}, d.respuestas || {});
    if (d.decision === 'devolver') { inf.estado = 'Devuelto'; inf.decision = { tipo: 'devolver', motivo: d.motivo || '', por: U.nombre, hora: H }; r.estado = 'Devuelto al inspector'; r.riesgo_estado = RE('Devuelto al inspector'); EV.unshift({ hora: H, accion: 'Informe devuelto', detalle: r.label + ' · ' + (d.motivo || '') + CA, actor: U.nombre, rol: U.rol }); return { ok: true, local: false, mensaje: 'Informe devuelto · ' + r.label }; }
    const cr = String(d.criterio || ''), ver = /^(Asegurable|No asegurable)$/.test(cr) ? cr : '';
    Object.assign(inf, { estado: 'Completo', decision: { /* como la base real: el criterio va dentro de la decisión (sin inspector en sitio no hay criterio del inspector) */ tipo: d.decision || 'determinar', criterio: cr, motivo: d.motivo || '', por: U.nombre, rol: d.comoAdmin ? 'Administrador' : U.rol, hora: H, facultad: ver ? Object.assign({}, FAC) : { fac: FAC.fac, dentro: false } }, completadoPor: U.nombre, completadoEn: H });
    if (ver) { (X.calificaciones[c.id] = X.calificaciones[c.id] || []).push({ riesgo: r.id, nivel: 0, veredicto: ver, cobertura: ver === 'Asegurable' ? 'Todo riesgo' : '', observacion: d.motivo || '', resultado: 'Inspeccionado', por: U.nombre, rol: d.comoAdmin ? 'Administrador' : U.rol, hora: H }); r.estado = 'Inspeccionado'; r.aseg = ver; r.riesgo_estado = RE('Inspeccionado', ver); }
    else { r.estado = 'Pendiente calificación'; r.riesgo_estado = RE('Pendiente calificación'); }
    const est = c.riesgos.map((x) => x.estado); c.estado = est.every((e) => e === 'Inspeccionado') ? 'Inspeccionado' : est.some((e) => e === 'Informe por completar') ? 'Informe por completar' : 'Pendiente calificación';
    EV.unshift({ hora: H, accion: 'Informe completado', detalle: r.label + ' · ' + (ver ? 'determinó ' + ver + ' · dentro de la facultad ' + FAC.fac + ' de Eurosurvey · Inspeccionado' : cr || d.decision) + CA, actor: U.nombre, rol: d.comoAdmin ? 'Administrador' : U.rol });
    return { ok: true, local: false, mensaje: 'Informe completado · ' + r.label }; };
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar;
  CC.cxSim = function (escena) { return ESC[escena] ? datos(escena) : baseCC(escena); };
  CC.aplicar = function (X, tipo, d) { if (X && X.determinado && ['completarInforme', 'guardarInforme', 'devolverCoordinacion'].indexOf(tipo) >= 0) return aplicarDet(X, tipo, d); return baseAp ? baseAp(X, tipo, d) : null; };
  CC.cxDeterminado = { escenas: Object.keys(ESC) };
})();
