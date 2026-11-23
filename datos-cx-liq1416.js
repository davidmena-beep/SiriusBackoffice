// SIRIUS · PDF de la liquidación aprobada y Liquidaciones con conceptos, con la conexión simulada (v1.0 · provisional · etapa P-1d + H-3 · DEC-277 y DEC-275 · 22/11/2026)
// Contrato de la base (SQL 83 y 84): liquidaciones[].aprobada { por, fecha (hora de Ecuador, ISO con -05:00), version } y .periodo ('2026-11'); versiones[].enviada
// en hora de Ecuador; honorarios[].calificacion por el veredicto del vehículo; honorarios[].servicio ('inspeccion' | 'completado'); honorarios[].calculo.modelo
// ('fija' | 'horaHombre' | 'completado') y calculo.lineas [{ concepto, nombre, cantidad, unidad, unitario, valor, origen ('general' | 'contrato'), aprobacion,
// porDefinir }]; estado «Por definir»; documentoRegistrar({ documento: 'liquidacion', liquidacion, huella }) → { ok, codigo, mostrar: 'LQ-001416-v1-XXXXXXXX' }.
// Escenas (siempre con la conexión):
//   pdfliq1416      la #001416 · v1 aprobada, con EXACTAMENTE los datos de la base (Eurosurvey S.A.; 50041 Ramos Generales y 50054 PGB8170 en Ambato); el código
//                   que devuelve la base simulada es «LQ-001416-v1-7C2E19A4».
//   pdfliqsinlineas una liquidación aprobada sin líneas (#001417): «Descargar PDF» responde «La liquidación no tiene líneas: no se genera su PDF».
//   liqcompletado   honorarios de Carla Ponce (Eurosurvey) con un completado de informe (50009-V1 · PR900A, tarifa fija preacordada USD 5,00, «Por facturar»).
//   liqdesglose     el cálculo por conceptos: Ramos Generales (2,5 h × 50 del general + 1,5 h × 14 del contrato + 3 equipos × 15 del general = 191) y un
//                   vehículo con km (inspección 16,50 del contrato + 150 km × 0,20 del general = 46,50).
//   liqpordefinir   Inspecciones Andinas: un completado «Por definir» (sin tarifa en el contrato) junto a una inspección por liquidar.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxUsuarios || !CC.cxSim) return;
  const ESC = ['pdfliq1416', 'pdfliqsinlineas', 'liqcompletado', 'liqdesglose', 'liqpordefinir'];
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const clon = (x) => JSON.parse(JSON.stringify(x)), EUR = '1791456320001', AND = '1792788441001', CONTRATO = 'Contrato Eurosurvey 2026';
  const pEur = { tipo: 'agencia', nombre: 'Eurosurvey', identificacion: EUR }, pAnd = { tipo: 'agencia', nombre: 'Inspecciones Andinas', identificacion: AND };
  const CP = { nombre: 'Carla Ponce', tipoIdentificacion: 'Cédula', identificacion: '1709991317', email: 'carla.ponce.finanzas+eurosurvey@gmail.com', rol: 'Finanzas de agencia', roles: ['Finanzas de agencia'], tipo: 'Agencia', agencia: 'Eurosurvey S.A.', agenciaRuc: EUR, estado: 'Activo', vinculado: true };
  const VL = { nombre: 'Verónica Lema', tipoIdentificacion: 'Cédula', identificacion: '1709991028', email: 'veronica.lema.ejecutiva@gmail.com', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'], tipo: 'Interno', agencia: null, estado: 'Activo', vinculado: true };
  const PN = { nombre: 'Paola Núñez', tipoIdentificacion: 'Cédula', identificacion: '1803311207', email: 'paola.nunez.finanzas+andinas@gmail.com', rol: 'Finanzas de agencia', roles: ['Finanzas de agencia'], tipo: 'Agencia', agencia: 'Inspecciones Andinas Cía. Ltda.', agenciaRuc: AND, estado: 'Activo', vinculado: true };
  const L = (concepto, nombre, cantidad, unidad, unitario, valor, origen, porDefinir) => ({ concepto, nombre, cantidad, unidad, unitario, valor, origen, aprobacion: concepto === 'completado' ? 'Preacordada' : 'Liquidación', porDefinir: !!porDefinir });
  const hon = (o) => Object.assign({ visita: 1, placa: '', bien: '', linea: 'Individuales', sucursal: 'Quito', estadoCaso: '', inspectorId: '', ajuste: null, liquidacionId: '', facturaId: '', servicio: 'inspeccion' }, o);
  const calc = (o) => Object.assign({ tarifario: CONTRATO, clase: null, ciudadBase: '1701', ciudadVisita: '1701', enBase: true, kmMedicion: 'ida', nivel: null, nivelSugerido: null, horasVisita: null, horasRedaccion: null, medidoVisita: null, medidoRedaccion: null, equipos: null, base: 0, km: 0, kmSugeridos: 0, valorKm: 0.2, movilizacion: 0, subtotal: 0, modelo: 'fija', lineas: null }, o);
  // ---------- #001416 · v1 (datos de la base) ----------
  const H1 = () => hon({ id: 'HON-50041-B1', caso: '50041', orden: 'WF-1711202600041', riesgo: '50041-B1', bien: 'Bodega y local · Av. Maldonado, Quito', asegurado: 'Ferretería La Unión Cía. Ltda.', linea: 'Empresas', ramo: 'Incendio y líneas aliadas', modalidad: 'Presencial', fecha: '2026-11-16',
    inspector: 'Mauricio Endara', proveedor: clon(pEur), aprobacion: 'Liquidación', calificacion: 'Pendiente de calificación', subtotal: 191, estado: 'Por facturar', liquidacionId: 'LIQ-001416',
    calculo: calc({ modelo: 'horaHombre', nivel: 'basico', nivelSugerido: 'basico', horasVisita: 2.5, horasRedaccion: 1.5, medidoVisita: 2.4, medidoRedaccion: 1.3, equipos: 3, base: 191, subtotal: 191,
      lineas: [L('visita', 'Inspección (básico)', 2.5, 'h', 50, 125, 'general'), L('redaccion', 'Redacción', 1.5, 'h', 14, 21, 'contrato'), L('equipos', 'Equipos', 3, 'equipos', 15, 45, 'general')] }) });
  const H2 = () => hon({ id: 'HON-50054-V1', caso: '50054', orden: '', riesgo: '50054-V1', placa: 'PGB8170', bien: 'Chevrolet Aveo 2019', asegurado: 'Martina Cordero 8170', ramo: 'Vehículos', modalidad: 'Virtual guiada', sucursal: 'Ambato', fecha: '2026-11-23',
    inspector: 'Mauricio Endara', proveedor: clon(pEur), aprobacion: 'Liquidación', calificacion: 'Asegurable', subtotal: 41.02, estado: 'Por facturar', liquidacionId: 'LIQ-001416',
    calculo: calc({ modelo: 'fija', clase: 'liviano', ciudadVisita: '1801', enBase: false, base: 10, km: 155.1, kmSugeridos: 155.1, movilizacion: 31.02, subtotal: 41.02,
      lineas: [L('inspeccion', 'Inspección virtual guiada liviano', 1, '', 10, 10, 'contrato'), L('km', 'Movilización', 155.1, 'km', 0.2, 31.02, 'contrato')] }) });
  const LIQ = (o) => Object.assign({ version: 1, proveedor: clon(pEur), estado: 'Aprobada', observaciones: [], motivo: '', facturaId: '', periodo: '2026-11' }, o);
  const l1416 = () => LIQ({ id: 'LIQ-001416', numero: 1416, lineas: ['HON-50041-B1', 'HON-50054-V1'], subtotal: 232.02, iva: 34.8, total: 266.82,
    versiones: [{ version: 1, enviada: '2026-11-22T21:05:02-05:00', resultado: 'Aprobada', por: 'Carla Ponce', cambios: [] }],
    historial: [{ accion: 'Envió la liquidación (v1)', por: 'Carla Ponce', fecha: '2026-11-22T21:05:02-05:00' }, { accion: 'Aprobó la liquidación (v1)', por: 'Verónica Lema', fecha: '2026-11-22T21:06:06-05:00' }],
    aprobada: { por: 'Verónica Lema', fecha: '2026-11-22T21:06:06-05:00', version: 1 } });
  const l1417 = () => LIQ({ id: 'LIQ-001417', numero: 1417, lineas: [], subtotal: 0, iva: 0, total: 0, versiones: [{ version: 1, enviada: '2026-11-22T21:20:00-05:00', resultado: 'Aprobada', por: 'Carla Ponce', cambios: [] }],
    historial: [{ accion: 'Aprobó la liquidación (v1)', por: 'Verónica Lema', fecha: '2026-11-22T21:22:00-05:00' }], aprobada: { por: 'Verónica Lema', fecha: '2026-11-22T21:22:00-05:00', version: 1 } });
  // ---------- H-3 ----------
  const comp = (id, caso, placa, prov, insp, o) => hon(Object.assign({ id, caso, orden: '', riesgo: caso + '-V1', placa, bien: '', asegurado: 'Pablo Reinoso 900', ramo: 'Vehículos', modalidad: 'Autoinspección', fecha: '2026-11-21', inspector: insp, proveedor: clon(prov), aprobacion: 'Preacordada',
    calificacion: 'Asegurable', servicio: 'completado', subtotal: 5, estado: 'Por facturar', calculo: calc({ modelo: 'completado', clase: 'liviano', base: 5, subtotal: 5, lineas: [L('completado', 'Completado de autoinspección', 1, '', 5, 5, 'contrato')] }) }, o || {}));
  const HC = () => comp('HON-50009-V1-C', '50009', 'PR900A', pEur, 'Patricia Andrade');
  const HV = () => hon({ id: 'HON-50010-V1', caso: '50010', orden: 'EMI-2026-150010', riesgo: '50010-V1', placa: 'PCQ1010', bien: 'Kia Rio 2022', asegurado: 'Ana Lucía Torres', ramo: 'Vehículos', modalidad: 'Presencial', fecha: '2026-11-20', inspector: 'Mauricio Endara', proveedor: clon(pEur),
    aprobacion: 'Preacordada', calificacion: 'Asegurable', subtotal: 16.5, estado: 'Por facturar', calculo: calc({ modelo: 'fija', clase: 'liviano', base: 16.5, subtotal: 16.5, lineas: [L('inspeccion', 'Inspección presencial liviano', 1, '', 16.5, 16.5, 'contrato')] }) });
  const HRG = () => Object.assign(H1(), { id: 'HON-50061-B1', caso: '50061', orden: 'WF-2111202600061', riesgo: '50061-B1', fecha: '2026-11-21', estado: 'Por liquidar', liquidacionId: '', calificacion: 'Asegurable' });
  const HKM = () => hon({ id: 'HON-50062-V1', caso: '50062', orden: 'EMI-2026-150062', riesgo: '50062-V1', placa: 'PCD6210', bien: 'Toyota Corolla 2021', asegurado: 'Lucía Fernanda Paredes', ramo: 'Vehículos', modalidad: 'Presencial', sucursal: 'Latacunga', fecha: '2026-11-21', inspector: 'Mauricio Endara', proveedor: clon(pEur),
    aprobacion: 'Preacordada', calificacion: 'Asegurable', subtotal: 46.5, estado: 'Por liquidar', calculo: calc({ modelo: 'fija', clase: 'liviano', ciudadVisita: '0501', enBase: false, base: 16.5, km: 150, kmSugeridos: 150, movilizacion: 30, subtotal: 46.5,
      lineas: [L('inspeccion', 'Inspección presencial liviano', 1, '', 16.5, 16.5, 'contrato'), L('km', 'Movilización', 150, 'km', 0.2, 30, 'general')] }) });
  const HPD = () => comp('HON-50070-V1-C', '50070', 'TBA7070', pAnd, 'Sofía Arteaga', { asegurado: 'Gabriel Sánchez 7070', sucursal: 'Ambato', fecha: '2026-11-22', aprobacion: 'Preacordada', subtotal: null, estado: 'Por definir',
    calculo: calc({ tarifario: 'Contrato Inspecciones Andinas 2026', modelo: 'completado', clase: 'liviano', base: null, subtotal: null, ciudadBase: '1801', ciudadVisita: '1801', lineas: [L('completado', 'Completado de autoinspección', 1, '', null, null, 'contrato', true)] }) });
  const HAV = () => hon({ id: 'HON-50071-V1', caso: '50071', orden: 'EMI-2026-150071', riesgo: '50071-V1', placa: 'TBC7171', bien: 'Hyundai Tucson 2020', asegurado: 'Gabriel Sánchez 7070', ramo: 'Vehículos', modalidad: 'Presencial', sucursal: 'Ambato', fecha: '2026-11-22', inspector: 'Sofía Arteaga', proveedor: clon(pAnd),
    aprobacion: 'Liquidación', calificacion: 'Pendiente de calificación', subtotal: 15, estado: 'Por liquidar', calculo: calc({ tarifario: 'Contrato Inspecciones Andinas 2026', modelo: 'fija', clase: 'liviano', ciudadBase: '1801', ciudadVisita: '1801', base: 15, subtotal: 15, lineas: [L('inspeccion', 'Inspección presencial liviano', 1, '', 15, 15, 'contrato')] }) });
  const base = (e) => e === 'pdfliq1416' ? { honorarios: [H1(), H2()], liquidaciones: [l1416()] } : e === 'pdfliqsinlineas' ? { honorarios: [], liquidaciones: [l1417()] } : e === 'liqcompletado' ? { honorarios: [HC(), HV()], liquidaciones: [] }
    : e === 'liqdesglose' ? { honorarios: [HRG(), HKM()], liquidaciones: [] } : { honorarios: [HPD(), HAV()], liquidaciones: [] };
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { registrar(); /* también las escenas de liquidaciones con ?cx=1 (liqpdf, liqpdfrg…) */ if (ESC.indexOf(escena) < 0) return baseCC(escena); const LP = window.SiriusLiqProceso; if (LP) { LP.borr = []; LP._cc = null; } registrar();
    const U0 = CC.cxUsuarios, B = base(escena), usuario = clon(escena === 'liqpordefinir' ? PN : CP);
    return { usuario, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, usuarios: clon(U0.usuarios).concat([clon(CP), clon(VL), clon(PN)]), agencias: clon(U0.agencias), inspectores: [],
      honorarios: B.honorarios, liquidaciones: B.liquidaciones, facturas: [], seq: { liq: 1418, fac: 1 }, liq1416: { escena } }; };
  // documentoRegistrar de la liquidación: la base registra la huella y devuelve el código «LQ-<número>-v<versión>-<8 caracteres>» (la #001416, el de la propuesta).
  // Se instala al armar la escena (otros archivos de la base simulada, cargados después, reemplazan documentoRegistrar).
  const registrar = () => { if (CC.documentoRegistrar && CC.documentoRegistrar.liq1416) return; const regBase = CC.documentoRegistrar; CC.documentoRegistrar = function (X, d) { if (!d || d.documento !== 'liquidacion') return regBase ? regBase(X, d) : Promise.resolve({ ok: false, mensaje: 'La conexión no registra documentos' });
    const l = ((X && X.liquidaciones) || []).find((x) => Number(x.numero) === Number(d.liquidacion)); if (!l) return Promise.resolve({ ok: false, mensaje: 'La liquidación no está en la base' });
    if (!/^[0-9a-f]{64}$/.test(String(d.huella || ''))) return Promise.resolve({ ok: false, mensaje: 'Falta la huella del documento' });
    const cod = Number(l.numero) === 1416 ? '7C2E19A4' : String(d.huella).slice(0, 8).toUpperCase(), n6 = String(l.numero).padStart(6, '0');
    return Promise.resolve({ ok: true, codigo: cod, mostrar: 'LQ-' + n6 + '-v' + (l.version || 1) + '-' + cod, generadoEn: '2026-11-22T21:26:00-05:00', por: ((X.usuario || {}).nombre) || '' }); }; CC.documentoRegistrar.liq1416 = true; };
  // Vistas de Liquidaciones (pestaña, panel del cálculo).
  const V = (window.SIRIUS_LIQ_PROCESO || {}).vistas; if (V) Object.assign(V, { pdfliq1416: { tab: 'Seguimiento' }, pdfliqsinlineas: { tab: 'Seguimiento' }, liqcompletado: { tab: 'Por facturar', calc: ['HON-50009-V1-C'] },
    liqdesglose: { tab: 'Por liquidar', calc: ['HON-50061-B1', 'HON-50062-V1'] }, liqpordefinir: { tab: 'Por liquidar' } });
  CC.cxLiq1416 = { escenas: ESC, datos: { hon, calc, L, H1, H2, l1416, comp, CP, VL, pEur } }; // F-1: datos de la #001416 para las escenas de facturación
})();
