// SIRIUS · Cola única de «por calificar» con la conexión simulada (v1.0 · provisional · etapa P-6g-2c · DEC-252 · 17/11/2026)
// Escena colacalconsistente: arma SIRIUS_CONEXION con 6 casos de la base (50051 a 50056, ninguno de ejemplo) y 9 informes en distintas situaciones:
//   50051 Flota de 3 vehículos «En coordinación»: PBA5101 completo fuera de facultad (nivel 1), PBA5102 completo dentro de facultad (no está por
//         calificar: ya tiene el veredicto del inspector) y PBA5103 sin visita todavía.
//   50052 Flota de 2 vehículos «Pendiente calificación» del ejecutivo Verónica Lema (responsable Daniela Ruiz): GBF2201 enviado a calificación el 14/10 (nivel 1, SLA de calificación vencido) y GBF2202 enviado el 16/10.
//   50053 Flota de 2 vehículos «Pendiente calificación» (responsable Daniela Ruiz): PCA3301 fuera de facultad desde el 15/10 (vencido) y PCA3302.
//   50054 Ramos Generales «Pendiente calificación» (Daniela Ruiz): un informe de nivel 1.
//   50055 Ramos Generales «Pendiente calificación de suscripción» (Ricardo Almeida): un informe de nivel 2 en tiempo.
//   50056 Ramos Generales «Pendiente calificación de suscripción» (Ricardo Almeida): un informe de nivel 2 vencido.
// Usuario: Daniela Ruiz, Ejecutivo de inspecciones; ?frol=sus → Ricardo Almeida, Suscriptor; ?frol=admin → Andrea Salazar, Administrador.
// Vista: ?fvista=bandeja (pestaña «En calificación»; «En suscripción» para el Suscriptor), calificacion (menú Calificación) o inicio; ?fcampana=1 abre la campana.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const ESC = ['colacalconsistente'];
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const DR = 'Daniela Ruiz', RA = 'Ricardo Almeida', VL = 'Verónica Lema';
  const usuario = () => { const r = q('frol'); return r === 'sus' ? { nombre: RA, email: 'ricardo.almeida@asur.ec', rol: 'Suscriptor', roles: ['Suscriptor'] }
    : r === 'admin' ? { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] }
      : { nombre: DR, email: 'daniela.ruiz@asur.ec', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'] }; };
  const base = (id, estado, extra) => Object.assign({ id, orden: 'EMI-2026-130' + id.slice(-3), origen: 'BPM de Emisión', broker: 'Andes Brokers', ident: '17920' + id + '001', fecha: '2026-10-12', registrado: '2026-10-12T09:00',
    sucursal: 'Quito', backoffice: DR, estado, comercial: 'Santiago Ortiz', flujoVersion: 2, visitasBase: [] }, extra || {});
  const veh = (id, estado, aseg, placas, extra) => base(id, estado, Object.assign({ ramo: 'Vehículos', tipoRiesgo: 'Vehículos', asegurado: aseg, placa: placas[0][0], placas: placas.map((p) => p[0]), bien: placas[0][0],
    solicitud: { formularios: placas.map(() => 'Vehículos livianos') },
    riesgos: placas.map((p, i) => ({ id: id + '-V' + (i + 1), label: p[0], nowrap: true, detalle: p[1], cobertura: 'Todo riesgo', total: 20000 + i * 1500, estado: p[2] || 'Inspeccionado', visita: p[2] === 'Por coordinar' ? null : { n: 1, estado: 'Realizada', inicio: '2026-10-14T10:00', inspector: 'Mauricio Endara' } })) }, extra || {}));
  const rg = (id, estado, aseg, bien, resp, extra) => base(id, estado, Object.assign({ ramo: 'Incendio y líneas aliadas', ramos: ['Incendio y líneas aliadas'], tipoRiesgo: 'Ramos Generales', asegurado: aseg, placa: '', bien,
    responsable: resp, solicitud: { formularios: ['Ubicación – Ramos Generales'] }, riesgos: [{ id: id + '-R1', label: bien, detalle: bien, cobertura: 'Incendio y líneas aliadas', estado }] }, extra || {}));
  // Informe de un vehículo: completo, con por qué llegó (fuera de facultad, enviado a calificación o determinado dentro de la facultad) y desde cuándo.
  const inf = (rid, placa, como, desde) => Object.assign({ riesgoId: rid, riesgo: placa, estado: 'Completo', plantilla: 'Vehículos livianos · Presencial', plantillaClave: 'Vehículos livianos · Presencial', plantillaVersion: 1,
    enviadoEn: desde, enviadoPor: 'Mauricio Endara', completadoPor: 'Mauricio Endara', completadoEn: desde, criterioInspector: { valor: 'Asegurable', comentario: 'Sin daños visibles.', por: 'Mauricio Endara', hora: desde },
    respuestas: { veh_placa: { valor: placa, org: 'foto:identificacion_placa_trasera', conf: 0.95 } } },
  como === 'fuera' ? { criterio: 'Enviar a calificación', decision: 'enviar', fueraFacultad: true, motivoEnvio: 'Fuera de facultad del inspector' }
    : como === 'enviar' ? { criterio: 'Enviar a calificación', decision: 'enviar' } : { criterio: 'Asegurable', decision: 'determinar' });
  const datos = () => {
    const casos = [
      veh('50051', 'En coordinación', 'Transportes Cotopaxi Cía. Ltda.', [['PBA5101', 'Chevrolet, D-Max, 2022', 'Pendiente calificación'], ['PBA5102', 'Toyota, Hilux, 2021'], ['PBA5103', 'Nissan, Frontier, 2023', 'Por coordinar']], { responsable: 'Andrea Salazar', subestado: '2 de 3 con informe' } /* AV-3 · DEC-271: PBA5101 con su informe enviado a calificación (fuera de facultad); PBA5102 determinado por el inspector (Inspeccionado); PBA5103 sin informe */),
      veh('50052', 'Pendiente calificación', 'Agroexportadora del Valle S.A.', [['GBF2201', 'Hyundai, Tucson, 2020', 'Pendiente calificación'], ['GBF2202', 'Kia, Sportage, 2022', 'Pendiente calificación']], { responsable: DR, backoffice: VL }),
      veh('50053', 'Pendiente calificación', 'Constructora Pichincha S.A.', [['PCA3301', 'Mazda, BT-50, 2019', 'Pendiente calificación'], ['PCA3302', 'Ford, Ranger, 2021', 'Pendiente calificación']], { responsable: DR }),
      rg('50054', 'Pendiente calificación', 'Bodegas Andinas Cía. Ltda.', 'Bodega · Av. Galo Plaza, Quito', DR),
      rg('50055', 'Pendiente calificación de suscripción', 'Química Industrial del Norte S.A.', 'Planta · Calacalí, Quito', RA),
      rg('50056', 'Pendiente calificación de suscripción', 'Hotel Mitad del Mundo S.A.', 'Hotel · Av. Equinoccial, Quito', RA)];
    const informes = {
      '50051': [inf('50051-V1', 'PBA5101', 'fuera', '2026-10-16T15:00'), inf('50051-V2', 'PBA5102', 'determinar', '2026-10-16T15:10')],
      '50052': [inf('50052-V1', 'GBF2201', 'enviar', '2026-10-14T10:00'), inf('50052-V2', 'GBF2202', 'enviar', '2026-10-16T16:00')],
      '50053': [inf('50053-V1', 'PCA3301', 'fuera', '2026-10-15T09:00'), inf('50053-V2', 'PCA3302', 'fuera', '2026-10-16T14:30')] };
    // Ramos Generales: el informe completo (desde cuándo corre el SLA de calificación) y, para 50055 y 50056, la calificación de nivel 1 (desde cuándo corre el de suscripción).
    const infRG = (id, desde) => ({ riesgoId: id + '-R1', riesgo: 'Ubicación', estado: 'Completo', plantilla: 'Ubicación – Ramos Generales · Presencial', enviadoEn: desde, enviadoPor: 'Mauricio Endara', completadoPor: 'Mauricio Endara', completadoEn: desde, criterio: 'Enviar a calificación', decision: 'enviar' });
    informes['50054'] = [infRG('50054', '2026-10-16T10:00')]; informes['50055'] = [infRG('50055', '2026-10-15T10:00')]; informes['50056'] = [infRG('50056', '2026-10-12T10:00')];
    const cal1 = { '50055': [{ riesgo: '50055-R1', nivel: 1, veredicto: 'Asegurable', por: DR, rol: 'Ejecutivo de inspecciones', hora: '2026-10-16T11:00', resultado: 'Pendiente calificación de suscripción' }], '50056': [{ riesgo: '50056-R1', nivel: 1, veredicto: 'Asegurable', por: DR, rol: 'Ejecutivo de inspecciones', hora: '2026-10-13T09:00', resultado: 'Pendiente calificación de suscripción' }] };
    const X = { usuario: usuario(), casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: [], notificaciones: [] };
    casos.forEach((c) => { X.eventos[c.id] = [{ hora: c.registrado, accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[c.id] = []; X.controles[c.id] = []; X.informes[c.id] = informes[c.id] || []; X.calificaciones[c.id] = cal1[c.id] || []; });
    return X; };
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { return ESC.indexOf(escena) >= 0 ? datos() : baseCC(escena); };
  CC.cxColaCal = { escenas: ESC };
})();
