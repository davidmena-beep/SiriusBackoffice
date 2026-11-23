// SIRIUS · Escenas de la facturación con la factura en preparación, con la conexión simulada (v1.0 · provisional · etapa F-1 · DEC-279 · 23/11/2026)
// Carla Ponce (Finanzas de agencia · Eurosurvey), con los datos reales de David: la liquidación #001416 v1 (232,02; aprobada el 22/11/2026; 50041 y 50054 PGB8170),
// 7 preacordados de vehículos (20186-V1 12,00 · 30001-V1 12,00 · 30004-V1 12,00 · 30006-V1 17,00 pesado · 50042-V1 12,00 y 50042-V2 10,00 moto · 50043-V1 12,00)
// y los completados 50052-V1 (PAU6044), 50052-V2 (AU044M) y 50061-V1 (GRZ3277) de 5,00. Reloj de la base: 23/11/2026 11:30.
//   facporfacturar · facpreparacion (?fvista=abierto: panel abierto) · facclave (?fvista=dv, ?fvista=emisor: la base responde al confirmar)
//   facdevuelta (devuelta por Mónica Ríos, otra vez en preparación) · facseguimiento (?fvista=finanzas: Mónica Ríos en «Facturas por validar»).
// La base simulada (datos-cx-liq-proceso.js) aplica facturaAgregar/Quitar/Descartar/Confirmar y devolverFactura con SiriusLiqProceso.ops; el SRI simulado conoce
// la factura 001-001-000000123 (subtotal 247,02 · IVA 37,05 · total 284,07) y una de otro emisor (RUC 1792788441001).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim || !CC.cxLiq1416 || !CC.cxLiq1416.datos) return;
  const ESC = ['facporfacturar', 'facpreparacion', 'facclave', 'facdevuelta', 'facseguimiento'];
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const D = CC.cxLiq1416.datos, clon = (x) => JSON.parse(JSON.stringify(x)), q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const CLAVE = '2311202601179145632000110010010000001231234567814', CLAVE_DV = CLAVE.slice(0, 48) + '5', CLAVE_OTRO = '2311202601179278844100110010010000001231234567819';
  const MR = { nombre: 'Mónica Ríos', tipoIdentificacion: 'Cédula', identificacion: '1709991309', email: 'monica.rios.finanzas@gmail.com', rol: 'Finanzas', roles: ['Finanzas'], tipo: 'Interno', agencia: null, estado: 'Activo', vinculado: true };
  const veh = (caso, v, clase, valor, fecha) => D.hon({ id: 'HON-' + caso + '-' + v, caso, orden: '', riesgo: caso + '-' + v, placa: '', bien: '', asegurado: '', ramo: 'Vehículos', modalidad: 'Presencial', fecha, inspector: 'Mauricio Endara', proveedor: clon(D.pEur), aprobacion: 'Preacordada', calificacion: 'Asegurable', subtotal: valor, estado: 'Por facturar',
    calculo: D.calc({ modelo: 'fija', clase, base: valor, subtotal: valor, lineas: [D.L('insp_veh', 'Inspección vehicular', 1, 'inspección', valor, valor, 'contrato')] }) });
  const VEH = () => [veh('20186', 'V1', 'liviano', 12, '2026-10-14'), veh('30001', 'V1', 'liviano', 12, '2026-11-05'), veh('30004', 'V1', 'liviano', 12, '2026-11-06'), veh('30006', 'V1', 'pesado', 17, '2026-11-06'), veh('50042', 'V1', 'liviano', 12, '2026-11-17'), veh('50042', 'V2', 'moto', 10, '2026-11-17'), veh('50043', 'V1', 'liviano', 12, '2026-11-17')];
  const COMP = () => [D.comp('HON-50052-V1-C', '50052', 'PAU6044', D.pEur, 'Patricia Andrade', { riesgo: '50052-V1', fecha: '2026-11-22', asegurado: 'Daniel Ortega 6044' }), D.comp('HON-50052-V2-C', '50052', 'AU044M', D.pEur, 'Patricia Andrade', { riesgo: '50052-V2', fecha: '2026-11-22', asegurado: 'Daniel Ortega 6044' }),
    D.comp('HON-50061-V1-C', '50061', 'GRZ3277', D.pEur, 'Patricia Andrade', { riesgo: '50061-V1', fecha: '2026-11-22', asegurado: 'Gabriela Ruiz Zambrano' })];
  const FAC = 'FAC-0007', DEV = { clave: CLAVE, numero: '001-001-000000123', motivo: 'El subtotal del SRI no coincide', por: 'Mónica Ríos', fecha: '2026-11-23T10:42:00-05:00' };
  function base(e) { const hs = [D.H1(), D.H2()].concat(VEH(), COMP()), l = D.l1416(), fs = [], comp = hs.filter((x) => x.servicio === 'completado').map((x) => x.id);
    if (e === 'facporfacturar') return { honorarios: hs, liquidaciones: [l], facturas: fs };
    const f = { id: FAC, proveedor: clon(D.pEur), clave: '', numero: '', fecha: '', sri: null, liquidaciones: ['LIQ-001416'], honorarios: comp, subtotal: 247.02, estado: 'En preparación', motivo: '', pago: null, enPreparacion: true, creada: '2026-11-23T08:10:00-05:00', devuelta: null,
      historial: [{ fecha: '2026-11-23T08:10:00-05:00', por: 'Carla Ponce', que: 'Factura en preparación abierta' }, { fecha: '2026-11-23T08:10:00-05:00', por: 'Carla Ponce', que: 'Agregó 1 liquidación y 3 preacordados' }] };
    if (e === 'facseguimiento') { Object.assign(f, { clave: CLAVE, numero: '001-001-000000123', fecha: '2026-11-23', sri: { estado: 'AUTORIZADO', ruc: '1791456320001', subtotal: 247.02, iva: 37.05, total: 284.07 }, estado: 'Por validar', enPreparacion: false });
      f.historial.push({ fecha: '2026-11-23T09:05:00-05:00', por: 'Carla Ponce', que: 'Confirmada con la clave del SRI · factura 001-001-000000123 · subtotal USD 247,02' }); l.estado = 'Facturada'; l.facturaId = FAC;
      hs.forEach((x) => { if (x.liquidacionId === 'LIQ-001416' || comp.indexOf(x.id) >= 0) { x.estado = 'Facturado'; x.facturaId = FAC; } }); }
    else { l.facturaId = FAC; hs.forEach((x) => { if (comp.indexOf(x.id) >= 0) x.facturaId = FAC; }); if (e === 'facdevuelta') { f.devuelta = clon(DEV); f.motivo = DEV.motivo; f.historial.push({ fecha: '2026-11-23T09:05:00-05:00', por: 'Carla Ponce', que: 'Confirmada con la clave del SRI · factura 001-001-000000123' }, { fecha: DEV.fecha, por: 'Mónica Ríos', que: 'Devuelta: vuelve a la factura en preparación', motivo: DEV.motivo }); } }
    fs.push(f); return { honorarios: hs, liquidaciones: [l], facturas: fs }; }
  const registrarSri = () => { const S = window.SIRIUS_SRI; if (!S) return; S.registrar(CLAVE, { subtotal: 247.02, iva: 37.05, total: 284.07 }); S.registrar(CLAVE_OTRO, { subtotal: 247.02, iva: 37.05, total: 284.07 }); };
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { if (ESC.indexOf(escena) < 0) return baseCC(escena); const LP = window.SiriusLiqProceso; if (LP) { LP.borr = []; LP._cc = null; } registrarSri();
    const U0 = CC.cxUsuarios, B = base(escena), fin = escena === 'facseguimiento' && q('fvista') === 'finanzas';
    return { usuario: clon(fin ? MR : D.CP), casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, usuarios: clon(U0.usuarios).concat([clon(D.CP), clon(D.VL), clon(MR)]), agencias: clon(U0.agencias), inspectores: [],
      honorarios: B.honorarios, liquidaciones: B.liquidaciones, facturas: B.facturas, seq: { liq: 1418, fac: 7 + (escena === 'facporfacturar' ? 0 : 1) }, reloj: { ahora: '2026-11-23T11:30:00-05:00' }, facturacion: { escena } }; };
  const V = (window.SIRIUS_LIQ_PROCESO || {}).vistas, SEL = ['HON-20186-V1', 'HON-30001-V1', 'HON-30004-V1'];
  if (V) Object.assign(V, { facporfacturar: { tab: 'Por facturar' }, facpreparacion: { tab: 'Por facturar', fx: { sl: [], sh: SEL } }, 'facpreparacion:abierto': { tab: 'Por facturar', fx: { sl: [], sh: SEL }, facAbierto: true },
    facclave: { tab: 'Mesa de trabajo', fx: { clave: CLAVE } }, 'facclave:dv': { tab: 'Mesa de trabajo', fx: { clave: CLAVE_DV, autoConfirmar: true } }, 'facclave:emisor': { tab: 'Mesa de trabajo', fx: { clave: CLAVE_OTRO, autoConfirmar: true } },
    facdevuelta: { tab: 'Mesa de trabajo' }, facseguimiento: { tab: 'Seguimiento' }, 'facseguimiento:finanzas': { tab: 'Facturas por validar' } });
  CC.cxFacturacion = { escenas: ESC, claves: { valida: CLAVE, dv: CLAVE_DV, otroEmisor: CLAVE_OTRO } };
})();
