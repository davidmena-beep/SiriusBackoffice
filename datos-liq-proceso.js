// SIRIUS · Datos de prueba de honorarios precalculados, liquidaciones y facturas (etapas P-6g-1b, P-6g-1c y P-6g-1d · DEC-247 y DEC-248).
// P-6g-1d: cada informe trae el tipo de vehículo (clase), el cantón de la visita (ciudad) y, fuera de la ciudad base del proveedor, los km de ida por carretera
// (kmRuta, del servicio de rutas); la calificación del caso (franja del PDF). escenas: [...] limita un informe a esas escenas.
// informes: informes entregados a la aseguradora (uno por vehículo o bien) con lo que mide SIRIUS: tiempo de visita y de redacción, equipos del informe,
// ocupación (nivel sugerido) y el punto de la visita (km fuera del perímetro). SiriusLiqProceso.calcular los convierte en honorarios con el tarifario del
// proveedor. escenas: lo que deja hecho cada escena, con las mismas acciones que usa la pantalla (op = LP.ops). vistas: qué abre Liquidaciones en cada escena.
// plantillas: documento de la liquidación y de la factura. Las escenas con ?cx=1 usan la conexión simulada (datos-cx-liq-proceso.js) con estos mismos datos.
(function () {
  const EUR = { tipo: 'agencia', nombre: 'Eurosurvey S.A.', identificacion: '1791456320001' }, AND = { tipo: 'agencia', nombre: 'Inspecciones Andinas Cía. Ltda.', identificacion: '1792788441001' }, LAN = { tipo: 'inspector', nombre: 'Luis Andrade', identificacion: '1709991119' };
  const ME = { inspector: 'Mauricio Endara', inspectorId: '0909991135' }, VC = { inspector: 'Valeria Cevallos', inspectorId: '0909991259' }, SA = { inspector: 'Sofía Arteaga', inspectorId: '1709991143' }, LA = { inspector: 'Luis Andrade', inspectorId: '1709991119' };
  const UIO = [-0.2050, -78.4900], CIU = { Quito: '1701', Ambato: '1801', Guayaquil: '0901', 'Santo Domingo': '2301' }, RUM = '1705', MEJ = '1703', CAY = '1702', CON = '2302';
  const veh = (caso, n, placa, bien, asegurado, linea, sucursal, modalidad, fecha, estadoCaso, quien, prov, punto, extra) => Object.assign({ caso, orden: extra && extra.orden || '00-' + caso + '2610', visita: 1, riesgo: caso + '-V' + n, placa, bien, ramo: 'Vehículos', modalidad, asegurado, linea, sucursal, ciudad: CIU[sucursal], fecha, estadoCaso, proveedor: prov, punto: punto || null, tipoVehiculo: 'Automóvil' }, quien, extra || {});
  const rg = (caso, ramo, bien, placa, asegurado, linea, sucursal, ocupacion, medV, medR, equipos, fecha, estadoCaso, quien, prov, extra) => Object.assign({ caso, orden: extra && extra.orden || 'WF-' + caso + '2610', visita: 1, riesgo: caso + '-B1', placa, bien, ramo, modalidad: 'Presencial', asegurado, linea, sucursal, ciudad: CIU[sucursal], fecha, estadoCaso, proveedor: prov, ocupacion, medidoVisita: medV, medidoRedaccion: medR, equipos }, quien, extra || {});
  const informes = [
    // Eurosurvey (contrato 2026: Vehículos presencial USD 16,50; redacción USD 14 por hora; USD 0,40 por km).
    veh('50012', 1, 'PRB1212', 'Kia Rio 2022', 'Distribuidora de prueba Doce S.A.', 'Corporativo', 'Quito', 'Presencial', '2026-10-16', 'Emitida', ME, EUR, UIO, { orden: '00-0411202609', tipoVehiculo: 'Automóvil' }),
    veh('50012', 2, 'PR121A', 'Suzuki GN125 2023', 'Distribuidora de prueba Doce S.A.', 'Corporativo', 'Quito', 'Presencial', '2026-10-16', 'Emitida', ME, EUR, UIO, { orden: '00-0411202609', tipoVehiculo: 'Motocicleta' }),
    veh('50013', 1, 'PCK2210', 'Kia Sportage 2021', 'Cliente de prueba Trece', 'Individuales', 'Quito', 'Presencial', '2026-10-16', 'Emitida', ME, EUR, [-0.3340, -78.4480], { orden: 'Q6-1211202611', tipoVehiculo: 'SUV', ciudad: RUM, kmRuta: 18 }),
    rg('50014', 'Incendio', 'Bodega · Av. Mariscal Sucre', 'Bodega', 'Comercial de prueba Catorce', 'Corporativo', 'Quito', 'Bodega', 2.4, 1.4, 0, '2026-10-15', 'Inspeccionado', VC, EUR, { orden: 'WF-0611202603' }),
    veh('50016', 1, 'TBA1235', 'Chevrolet Aveo 2019', 'Cliente Dieciséis', 'Individuales', 'Ambato', 'Presencial', '2026-10-14', 'Emitida', VC, EUR, [-1.2491, -78.6168], { orden: '4Q-0411202605', ciudad: '1801', kmRuta: 136 }),
    rg('50018', 'Incendio', 'Planta de plásticos · Calacalí', 'Planta', 'Plásticos del Litoral S.A.', 'Corporativo', 'Quito', 'Industria con transformación de materia prima', 6.4, 2.9, 14, '2026-10-13', 'Inspeccionado', ME, EUR, { orden: '00-1311202601' }),
    rg('50019', 'Equipo y maquinaria', 'Cargadora Caterpillar 966M', 'Cargadora', 'Constructora Andina Cía. Ltda.', 'Corporativo', 'Quito', 'Equipo y maquinaria', 1.3, 0.9, 1, '2026-10-12', 'Emitida', VC, EUR, { orden: '00-1311202655' }),
    veh('50017', 1, 'PFI4777', 'Hyundai Tucson 2020', 'María Fernanda Ruiz', 'Individuales', 'Quito', 'Presencial', '2026-10-13', 'Emitida', ME, EUR, UIO, { orden: 'CF-1211202600', tipoVehiculo: 'SUV' }),
    veh('50020', 1, 'PDF3350', 'Mazda CX-30 2022', 'Rosa Elvira Quishpe', 'Masivos', 'Quito', 'Virtual guiada', '2026-10-11', 'Enviado a emisión', VC, EUR, null, { orden: '00-2010202611', tipoVehiculo: 'SUV' }),
    veh('50022', 1, 'PBX4410', 'Toyota Hilux 2020', 'Transportes Machachi Cía. Ltda.', 'Corporativo', 'Quito', 'Presencial', '2026-10-10', 'Emitida', ME, EUR, [-0.5100, -78.5670], { orden: '00-1010202604', tipoVehiculo: 'Camioneta', ciudad: MEJ, kmRuta: 20 }),
    // Luis Andrade, inspector independiente (tarifario general: Vehículos presencial USD 18, virtual guiada USD 12; sin valor por km: «km por valorar»).
    veh('52552', 1, 'PDO2939', 'Mazda 3 2022', 'Castillo Mena María Paz', 'Masivos', 'Quito', 'Virtual guiada', '2026-10-12', 'Emitida', LA, LAN, null, { orden: '00-0411202609' }),
    veh('52559', 1, 'PDK2997', 'Chevrolet Onix 2025', 'Calispa Quinatoa Wilson', 'Masivos', 'Quito', 'Virtual guiada', '2026-10-12', 'Emitida', LA, LAN, null, { orden: '00-0411202614' }),
    veh('52563', 1, 'PFJ3628', 'Toyota Fortuner 2021', 'Morocho Cabrera Luis', 'Individuales', 'Santo Domingo', 'Presencial', '2026-10-13', 'Emitida', LA, LAN, [0.0050, -79.3960], { orden: '00-0411202633', tipoVehiculo: 'SUV', ciudad: CON, kmRuta: 12 }),
    // P-6g-1d · honorclase: tarifa por clase (liviano USD 12, pesado USD 17) y un liviano fuera de la ciudad base (19,1 km × USD 0,20).
    veh('50120', 1, 'PCB4521', 'Chevrolet Sail 2023', 'Distribuidora Andina de Repuestos S.A.', 'Corporativo', 'Quito', 'Presencial', '2026-10-15', 'Emitida', ME, EUR, UIO, { tipoVehiculo: 'Automóvil', escenas: ['honorclase'] }),
    veh('50121', 1, 'PCX1180', 'Hino 500 GH 2021', 'Transportes Pichincha Cía. Ltda.', 'Corporativo', 'Quito', 'Presencial', '2026-10-15', 'Emitida', VC, EUR, UIO, { tipoVehiculo: 'Camión', escenas: ['honorclase'] }),
    veh('50122', 1, 'PDA7712', 'Kia Soluto 2024', 'Guerrero Vaca Ana Lucía', 'Individuales', 'Quito', 'Presencial', '2026-10-16', 'Emitida', ME, EUR, [-0.3290, -78.4510], { tipoVehiculo: 'Automóvil', ciudad: RUM, kmRuta: 19.1, escenas: ['honorclase'] }),
    // P-6g-1d · liqpdf: 12 inspecciones de Eurosurvey (9 livianos, 3 pesados; 3 fuera de la ciudad base) para el documento PDF. Como en la #001412 real,
    // todas se liquidan (aprobacion: 'Liquidación' en el dato de prueba; el contrato de Eurosurvey del prototipo sigue con Vehículos «Preacordada»).
    ...[['52225', 'PFW6683', 'Automóvil', 'Perez Aguilar Roberto', '9L-3009202604', '2026-10-01'], ['52227', 'PFH2038', 'Automóvil', 'Martinez Barba Rosa Teodora', 'EMI-406567', '2026-10-01'],
      ['52229', 'IBG6407', 'Camioneta', 'Cooperativa De Ahorro Y Credito Imbabura', 'EMI11111', '2026-10-02', { calificacion: 'Pendiente de calificación' }], ['52231', 'PFS2923', 'Automóvil', 'Osorio Avellaneda Harold Julian', '00-0110202610', '2026-10-03'],
      ['52236', 'ABR4059', 'SUV', 'Atiencia Lombaida Gustavo Rene', 'EMI-406622', '2026-10-05'], ['52243', 'PPA3438', 'Camión', 'Creaciones Juventus S.A.S.', 'EMI-406718', '2026-10-06'],
      ['52244', 'PDY2716', 'Automóvil', 'Navarrete Muñoz Edwin Patricio', 'VM-0210202609', '2026-10-07', { calificacion: 'No asegurable' }], ['52248', 'GSZ9258', 'Tracto camión', 'Importadora Chinatown S.A.', '123456', '2026-10-08'],
      ['52254', 'PFW4525', 'Automóvil', 'Maritza Bibiana Chamorro Tavera', '12-0210202604', '2026-10-09'], ['52325', 'PFO7819', 'Automóvil', 'Zambrano Cedeño Angel Alcides', '0J-1310202610', '2026-10-13', { ciudad: RUM, kmRuta: 34.5 }],
      ['52357', 'ABJ2401', 'SUV', 'Romero Jaramillo Guido Alfredo', '00-1510202610', '2026-10-15', { ciudad: CAY, kmRuta: 101 }], ['52523', 'GTM5764', 'Volqueta', 'Matute Castro Miguel Angel', '00-2910202610', '2026-10-16', { ciudad: MEJ, kmRuta: 56.5, calificacion: 'Pendiente de calificación' }]]
      .map((r, i) => veh(r[0], 1, r[1], r[2], r[3], 'Individuales', 'Quito', 'Presencial', r[5], 'Emitida', i % 2 ? VC : ME, EUR, UIO, Object.assign({ orden: r[4], tipoVehiculo: r[2], escenas: ['liqpdf', 'liqpdfsinaprobar'], aprobacion: 'Liquidación' }, r[6] || {}))),
    // P-6g-1e · DEC-249 · honormoto: tarifa por tipo con Moto (presencial USD 10,00), Liviano (Camioneta, 12,00) y Pesado (Bus, 17,00); una liquidación aprobada con las tres para el PDF.
    veh('50130', 1, 'PMB3205', 'Yamaha MT-03 2022', 'Hidalgo Paredes Cristian Andrés', 'Individuales', 'Quito', 'Presencial', '2026-10-19', 'Emitida', ME, EUR, UIO, { tipoVehiculo: 'Moto', aprobacion: 'Liquidación', escenas: ['honormoto'] }),
    veh('50131', 1, 'PCT8832', 'Chevrolet D-Max 2021', 'Ferretería El Constructor Cía. Ltda.', 'Corporativo', 'Quito', 'Presencial', '2026-10-19', 'Emitida', VC, EUR, UIO, { tipoVehiculo: 'Camioneta', aprobacion: 'Liquidación', escenas: ['honormoto'] }),
    veh('50132', 1, 'PBZ9921', 'Hino FC9J Bus 2020', 'Cooperativa de Transportes Rutas del Sol', 'Corporativo', 'Quito', 'Presencial', '2026-10-20', 'Emitida', ME, EUR, UIO, { tipoVehiculo: 'Bus', aprobacion: 'Liquidación', escenas: ['honormoto'] }),
    // P-6g-1f · DEC-247 · facturarmasivo y facturarfiltros: 21 preacordados más de Eurosurvey (Vehículos en la ciudad base, sin km; con los 4 de siempre suman 25),
    // de varias sucursales, modalidades y líneas de negocio, y 3 vehículos que sí requieren liquidación para la tercera liquidación aprobada (Guayaquil).
    ...[['Quito', 'Presencial', 'Individuales', 'Automóvil', 'Salazar Pérez Jorge Luis', '2026-10-02'], ['Quito', 'Virtual guiada', 'Masivos', 'SUV', 'Cabrera Núñez Andrea Paola', '2026-10-02'], ['Guayaquil', 'Presencial', 'Corporativo', 'Camioneta', 'Importadora del Pacífico S.A.', '2026-10-03'],
      ['Quito', 'Presencial', 'Individuales', 'Automóvil', 'Vega Torres Marcelo Ernesto', '2026-10-05'], ['Ambato', 'Presencial', 'Individuales', 'SUV', 'Tapia Guamán Verónica Elena', '2026-10-05'], ['Guayaquil', 'Virtual guiada', 'Masivos', 'Automóvil', 'Intriago Zambrano Pedro Pablo', '2026-10-06'],
      ['Santo Domingo', 'Presencial', 'Individuales', 'Camioneta', 'Loor Mendoza Carlos Alberto', '2026-10-06'], ['Quito', 'Virtual guiada', 'Masivos', 'Automóvil', 'Jácome Ortiz Silvia Marcela', '2026-10-07'], ['Guayaquil', 'Presencial', 'Corporativo', 'SUV', 'Distribuidora Costa Azul Cía. Ltda.', '2026-10-08'],
      ['Quito', 'Presencial', 'Individuales', 'Automóvil', 'Espinosa Rivadeneira Daniel', '2026-10-08'], ['Ambato', 'Virtual guiada', 'Masivos', 'Automóvil', 'Paredes Sánchez Lucía Beatriz', '2026-10-09'], ['Guayaquil', 'Presencial', 'Individuales', 'SUV', 'Villamar Castro Jessica Alexandra', '2026-10-09'],
      ['Quito', 'Presencial', 'Corporativo', 'Camioneta', 'Constructora Cumbayá S.A.', '2026-10-12'], ['Santo Domingo', 'Virtual guiada', 'Masivos', 'Automóvil', 'Mera Alcívar Fernando Xavier', '2026-10-12'], ['Guayaquil', 'Presencial', 'Individuales', 'Automóvil', 'Burgos Macías Karina Estefanía', '2026-10-13'],
      ['Quito', 'Virtual guiada', 'Masivos', 'SUV', 'Reinoso Chiriboga Patricio', '2026-10-14'], ['Quito', 'Presencial', 'Individuales', 'Automóvil', 'Yépez Almeida Gabriela Cristina', '2026-10-14'], ['Guayaquil', 'Presencial', 'Corporativo', 'Camioneta', 'Textiles del Guayas S.A.', '2026-10-15'],
      ['Ambato', 'Presencial', 'Individuales', 'Automóvil', 'Cevallos Naranjo Rodrigo', '2026-10-16'], ['Quito', 'Virtual guiada', 'Masivos', 'Automóvil', 'Maldonado Ponce Elena Isabel', '2026-10-19'], ['Guayaquil', 'Presencial', 'Individuales', 'SUV', 'Alvarado Peña Ricardo Andrés', '2026-10-20']]
      .map((r, i) => veh(String(53001 + i), 1, 'GF' + String(2100 + i * 7).slice(-3) + String.fromCharCode(65 + i % 26), r[3] + ' ' + (2019 + i % 6), r[4], r[2], r[0], r[1], r[5], 'Emitida', i % 2 ? VC : ME, EUR, r[1] === 'Virtual guiada' ? null : UIO, { tipoVehiculo: r[3], ciudad: '1701', escenas: ['facturarmasivo', 'facturarfiltros'] })),
    ...[['53101', 'GLQ4101', 'Toyota Hilux 2022', 'Transportes Marítimos del Sur S.A.', '2026-10-14'], ['53102', 'GLQ4102', 'Chevrolet D-Max 2021', 'Agroexportadora Santa Elena S.A.', '2026-10-14'], ['53103', 'GLQ4103', 'Nissan Frontier 2023', 'Servicios Petroleros Litoral Cía. Ltda.', '2026-10-15']]
      .map((r) => veh(r[0], 1, r[1], r[2], r[3], 'Corporativo', 'Guayaquil', 'Presencial', r[4], 'Emitida', ME, EUR, UIO, { tipoVehiculo: 'Camioneta', ciudad: '1701', aprobacion: 'Liquidación', escenas: ['facturarmasivo', 'facturarfiltros', 'inicioproveedorcx'] })),
    // Inspecciones Andinas: 1 preacordado (no es de Eurosurvey ni de Luis).
    veh('50045', 1, 'TBA3301', 'Toyota Corolla 2021', 'Agrícola Tungurahua S.A.', 'Corporativo', 'Ambato', 'Presencial', '2026-10-11', 'Emitida', SA, AND, null, {}),
  ];
  const H = (r) => 'HON-' + r, CP = 'Carla Ponce', EJE = 'Verónica Lema', FIN = 'Mónica Ríos', LUIS = 'Luis Andrade';
  const sub = (S, id) => (S.honorarios.find((h) => h.id === id) || {}).subtotal || 0;
  // Liquidaciones de prueba con las mismas acciones de la pantalla.
  const crear = (op, ids, por, fecha) => op('crearLiquidacion', { lineas: ids }, por || CP, fecha || '2026-10-16T09:00').id;
  const enviada = (op, ids, cambios, por, fecha) => { (cambios || []).forEach((c) => op('ajustarHonorario', c, por || CP, '2026-10-16T09:10')); const id = crear(op, ids, por); return op('enviarLiquidacion', { id }, por || CP, fecha || '2026-10-16T09:30').id; };
  const aprobada = (op, ids, cambios, por) => { const id = enviada(op, ids, cambios, por); op('aprobarLiquidacion', { id }, EJE, '2026-10-16T16:00'); return id; };
  const PDF12 = ['52225', '52227', '52229', '52231', '52236', '52243', '52244', '52248', '52254', '52325', '52357', '52523'].map((c) => H(c + '-V1'));
  const cambioPBX = { id: H('50022-V1'), km: 28, comentario: 'km adicional: desvío por la vía Alóag–Machachi' };
  const cambioPCK = { id: H('50013-V1'), km: 25, comentario: 'km adicional: vía a Nayón' }, cambioBod = { id: H('50014-B1'), horasVisita: 3, comentario: 'Bodega de 2 pisos: el recorrido tomó 3 h' };
  const revision = (op) => enviada(op, [H('50013-V1'), H('50014-B1'), H('50018-B1'), H('50016-V1')], [cambioPCK, cambioBod]);
  const devueltaBod = (op, id) => op('devolverLiquidacion', { id, observaciones: [{ linea: H('50014-B1'), texto: '3 h no corresponde a una bodega de riesgo básico (referencia 2 h)', subtotalSugerido: 146 }], motivo: 'Revisar las horas de la bodega.' }, EJE, '2026-10-16T15:00');
  const porCorregir = (S, op) => { const id = enviada(op, [H('50022-V1'), H('50019-B1')], [cambioPBX]); op('devolverLiquidacion', { id, observaciones: [{ linea: H('50019-B1'), texto: '1,5 h de visita no corresponde a una sola cargadora: la referencia del nivel Básico es 2 h, pero el informe tiene 6 fotos en 40 min', subtotalSugerido: Math.round((sub(S, H('50019-B1')) - 25) * 100) / 100 }], motivo: 'Revisar las horas de visita de la cargadora.' }, EJE, '2026-10-17T10:15'); return id; };
  // Factura de prueba en el SRI (consulta simulada): una clave que coincide y otra con distinto subtotal.
  const sri = (S, prov, ls, hs, sec, extra) => { const SRI = window.SIRIUS_SRI, LP = window.SiriusLiqProceso; if (!SRI || !LP) return ''; const e = LP.esperado(S, ls, hs, '2026-10-18'), st = Math.round((e.subtotal + (extra || 0)) * 100) / 100, iva = Math.round(st * e.tasa) / 100;
    const clave = SRI.clave({ fecha: '2026-10-18', ruc: LP.rucProveedor(prov), serie: prov.tipo === 'agencia' ? '001002' : '001001', secuencial: sec, codigo: String(10000000 + sec * 7919).slice(-8) }); SRI.registrar(clave, { subtotal: st, iva, total: Math.round((st + iva) * 100) / 100 }); return clave; };
  const CLAVES = {};
  const facturada = (S, op, prov, ls, hs, sec, por) => { const k = sri(S, prov, ls, hs, sec); return op('enviarFactura', { clave: k, liquidaciones: ls, honorarios: hs }, por, '2026-10-18T08:00').id; };
  const escenas = {
    liqporliquidar: (S, op) => { crear(op, [H('50022-V1')]); },
    liqmesa: (S, op) => { crear(op, [H('50013-V1'), H('50016-V1'), H('50014-B1'), H('50018-B1')]); op('ajustarHonorario', cambioBod, CP); op('ajustarHonorario', { id: H('50013-V1'), km: 25, comentario: '' }, CP); },
    liqmesavarias: (S, op) => { porCorregir(S, op); crear(op, [H('50013-V1'), H('50014-B1'), H('50018-B1'), H('50016-V1')], CP, '2026-10-17T11:00'); },
    liqunicidad: (S, op) => { crear(op, [H('50013-V1'), H('50014-B1'), H('50018-B1')]); crear(op, [H('50016-V1')], CP, '2026-10-16T10:00'); },
    liqfacturarsri: (S, op) => { const id = aprobada(op, [H('50013-V1'), H('50014-B1')]), hs = [H('50012-V1'), H('50012-V2'), H('50017-V1')]; CLAVES.ok = sri(S, EUR, [id], hs, 412); CLAVES.mal = sri(S, EUR, [id], hs, 413, 3.5); },
    // P-6g-1f · DEC-247: tres liquidaciones aprobadas (#001414 Quito, #001415 Ambato y Quito, #001416 Guayaquil) y 25 preacordados por facturar.
    facturarmasivo: (S, op) => { aprobada(op, [H('50013-V1'), H('50014-B1')]); aprobada(op, [H('50016-V1'), H('50018-B1')]); aprobada(op, [H('53101-V1'), H('53102-V1'), H('53103-V1')]); },
    facturarfiltros: (S, op) => { aprobada(op, [H('50013-V1'), H('50014-B1')]); aprobada(op, [H('50016-V1'), H('50018-B1')]); aprobada(op, [H('53101-V1'), H('53102-V1'), H('53103-V1')]); },
    // P-6g-1f · DEC-247: el Inicio de Carla Ponce con la base: 3 por liquidar (Guayaquil), 1 enviada, 1 devuelta, 2 aprobadas y 1 preacordado por facturar, 1 factura devuelta y 1 por validar.
    inicioproveedorcx: (S, op) => { porCorregir(S, op); enviada(op, [H('50013-V1'), H('50016-V1')]); aprobada(op, [H('50014-B1'), H('50018-B1')]); const k = facturada(S, op, EUR, [], [H('50017-V1')], 430, CP); op('devolverFactura', { id: k, motivo: 'La factura no tiene el número de autorización del SRI.' }, FIN, '2026-10-18T09:15'); facturada(S, op, EUR, [], [H('50020-V1')], 431, CP); },
    liqindependiente: () => {},
    honorcalculo: () => {},
    liqplanta: (S, op, v) => { const LP = window.SiriusLiqProceso; if (LP) LP.pagaOv = v === 'si' ? { '1791456320001': true } : {}; },
    // P-6g-1c (lado de la aseguradora), con el modelo nuevo.
    // P-6g-1c: panel del cálculo, revisión de la aseguradora, Finanzas y la prueba del contrato.
    liqcalculopanel: (S, op) => { op('ajustarHonorario', { id: H('50013-V1'), km: 27, comentario: 'km adicional: el punto queda en la vía a Nayón, camino de tierra' }, CP); },
    liqrevision: (S, op) => { revision(op); enviada(op, [H('52563-V1')], [], LUIS, '2026-10-16T11:00'); },
    liqrevisionv2: (S, op) => { const id = revision(op); devueltaBod(op, id); op('aceptarSugerencia', { id, linea: H('50014-B1') }, CP, '2026-10-17T09:00'); op('editarLiquidacion', { id, agregar: [], quitar: [H('50016-V1')] }, CP, '2026-10-17T09:05'); op('reenviarLiquidacion', { id }, CP, '2026-10-17T09:10'); },
    liqfinanzas: (S, op) => { const l1 = aprobada(op, [H('50013-V1'), H('50014-B1')]); facturada(S, op, EUR, [l1], [H('50012-V1'), H('50012-V2')], 421, CP);
      const l2 = aprobada(op, [H('52563-V1')], [], LUIS); facturada(S, op, LAN, [l2], [H('52552-V1'), H('52559-V1')], 422, LUIS);
      const f3 = facturada(S, op, AND, [], [H('50045-V1')], 423, 'Sofía Arteaga'); op('validarFactura', { id: f3 }, FIN, '2026-10-18T10:00');
      const f0 = facturada(S, op, EUR, [], [H('50017-V1'), H('50020-V1')], 410, CP); op('validarFactura', { id: f0 }, FIN, '2026-10-18T10:05'); op('registrarPago', { facturas: [f0], fecha: '2026-10-15', referencia: 'SPI-2026-104201' }, FIN, '2026-10-18T10:10'); },
    cxliqproceso: () => {},
    // P-6g-1d · DEC-248: documento PDF de la liquidación aprobada, tarifa por clase y ciudad base.
    liqpdf: (S, op) => { aprobada(op, PDF12); },
    liqpdfrg: (S, op) => { aprobada(op, [H('50014-B1'), H('50018-B1')]); },
    liqpdfsinaprobar: (S, op) => { enviada(op, PDF12.slice(0, 6)); porCorregir(S, op); },
    honormoto: (S, op) => { aprobada(op, [H('50130-V1'), H('50131-V1'), H('50132-V1')]); }, tarifatipos: () => {},
    honorclase: () => {}, fichaciudadbase: () => {},
    liqdevolver: (S, op) => { enviada(op, [H('50022-V1'), H('50019-B1')], [cambioPBX]); },
    liqdocumento: (S, op, v) => { const id = porCorregir(S, op); op('aceptarSugerencia', { id, linea: H('50019-B1') }, CP); op('reenviarLiquidacion', { id }, CP, '2026-10-17T15:00'); op('aprobarLiquidacion', { id }, EJE, '2026-10-17T17:00'); if (v === 'factura') facturada(S, op, EUR, [id], [H('50012-V1')], 415, CP); },
    // Escenas que ya existían, con el modelo nuevo.
    liquidaciones: (S, op) => { enviada(op, [H('50022-V1'), H('50019-B1')], [cambioPBX]); const l = aprobada(op, [H('52563-V1')], [], LUIS); facturada(S, op, LAN, [l], [H('52552-V1'), H('52559-V1')], 361, LUIS); },
    liqdetalle: (S, op) => { enviada(op, [H('50022-V1'), H('50019-B1')], [cambioPBX]); },
    liqfactura: (S, op) => { aprobada(op, [H('52563-V1')], [], LUIS); },
    facturagrupo: (S, op) => { const l = aprobada(op, [H('52563-V1')], [], LUIS); CLAVES.ok = sri(S, LAN, [l], [H('52552-V1'), H('52559-V1')], 362); },
    facturadevuelta: (S, op) => { const l = aprobada(op, [H('52563-V1')], [], LUIS), f = facturada(S, op, LAN, [l], [H('52552-V1')], 358, LUIS); op('devolverFactura', { id: f, motivo: 'La factura no tiene el número de autorización del SRI.' }, FIN, '2026-10-18T09:15'); },
    mishonorarios: () => {},
  };
  // Qué abre Liquidaciones en cada escena (pestaña, detalle, marcas, filtros, mesa, clave y documento).
  const vistas = {
    honorcalculo: { tab: 'Por liquidar', calc: [H('50012-V1'), H('50013-V1'), H('50014-B1'), H('50018-B1')] },
    liqporliquidar: { tab: 'Por liquidar', filtros: { sucursal: 'Quito' }, sel: [H('50013-V1'), H('50014-B1')] },
    liqmesa: { tab: 'Mesa de trabajo', exp: [H('50014-B1')] }, liqmesavarias: { tab: 'Mesa de trabajo', verTodas: true },
    liqunicidad: { tab: 'Mesa de trabajo', verTodas: true },
    liqfacturarsri: { tab: 'Por facturar', marcarLiq: ['LIQ-001414'], marcar: [H('50012-V1'), H('50012-V2'), H('50017-V1')], clave: 'ok' }, 'liqfacturarsri:nocoincide': { tab: 'Por facturar', marcarLiq: ['LIQ-001414'], marcar: [H('50012-V1'), H('50012-V2'), H('50017-V1')], clave: 'mal', consultar: true },
    facturarmasivo: { tab: 'Por facturar', marcarLiq: ['LIQ-001414', 'LIQ-001415'], marcar: ['53001', '53002', '53003', '53004', '53005', '53006'].map((c) => H(c + '-V1')) },
    facturarfiltros: { tab: 'Por facturar', filtrosFac: { sucursal: 'Guayaquil', tipo: 'Honorarios preacordados' }, marcarLiq: ['LIQ-001414'], marcar: ['53001', '53002', '53003', '53006', '53009'].map((c) => H(c + '-V1')) },
    liqindependiente: { tab: 'Por facturar', marcar: [H('52552-V1'), H('52559-V1')] }, liqplanta: {},
    liqdevolver: { tab: 'Por aprobar', det: 'LIQ-001414', rev: { obs: { [H('50022-V1')]: { texto: 'km sin respaldo: la visita registra 20 km', sug: '16' } }, motivo: 'Los km adicionales de PBX4410 no tienen respaldo en la visita.' } },
    liqdocumento: { tab: 'Liquidaciones', det: 'LIQ-001414', doc: 'liquidacion' }, 'liqdocumento:factura': { tab: 'Facturas por validar', doc: 'factura', docId: 'FAC-0001' },
    liqcalculopanel: { tab: 'Por liquidar', calc: [H('50013-V1')] }, 'liqcalculopanel:planta': { tab: 'Por liquidar', calc: [H('50018-B1')] },
    liqrevision: { tab: 'Por aprobar', det: 'LIQ-001414', rev: { obs: { [H('50014-B1')]: { texto: '3 h no corresponde a una bodega de riesgo básico (referencia 2 h)', sug: '146' } }, motivo: 'Revisar las horas de la bodega.' } },
    liqrevisionv2: { tab: 'Por aprobar', det: 'LIQ-001414' }, liqfinanzas: { tab: 'Facturas por validar' }, cxliqproceso: { tab: 'Por liquidar', prueba: true },
    liqpdf: { tab: 'Seguimiento' }, liqpdfrg: { tab: 'Seguimiento' }, liqpdfsinaprobar: { tab: 'Seguimiento' }, honorclase: { tab: 'Por liquidar', calc: [H('50120-V1'), H('50121-V1'), H('50122-V1')] }, honormoto: { tab: 'Seguimiento', calc: [H('50130-V1'), H('50131-V1'), H('50132-V1')] },
    liquidaciones: { tab: 'Por aprobar' }, liqdetalle: { tab: 'Por aprobar', det: 'LIQ-001414' }, liqfactura: { tab: 'Por facturar' }, facturagrupo: { tab: 'Por facturar', marcarLiq: ['LIQ-001414'], marcar: [H('52552-V1'), H('52559-V1')], clave: 'ok' }, mishonorarios: { tab: 'Por liquidar' },
  };
  const col = [['caso', 'Caso'], ['orden', 'Orden'], ['asegurado', 'Asegurado'], ['ramo', 'Ramo'], ['modalidad', 'Modalidad'], ['objeto', 'Placa o bien'], ['fecha', 'Fecha de inspección'], ['partes', 'Partes del cálculo'], ['km', 'km'], ['ajuste', 'Ajuste y comentario'], ['observacion', 'Observación de la aseguradora'], ['subtotal', 'Subtotal']];
  const estilo = 'body{font-family:Arial,sans-serif;font-size:11px;color:#011E41;margin:24px}h1{font-size:18px;margin:0 0 6px}h3{font-size:13px;margin:16px 0 6px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #C9D4E0;padding:4px 6px;text-align:left;vertical-align:top}th{background:#F1F5FF}.pie{margin-top:12px;font-weight:bold;text-align:right}';
  window.SIRIUS_LIQ_PROCESO = { informes, escenas, vistas, claves: CLAVES,
    config: { aprueban: ['Ejecutivo de inspecciones', 'Finanzas', 'Administrador'], numeroInicial: 1414 },
    plantillas: {
      liquidacion: { titulo: 'Liquidación de honorarios de inspección {{numero}}', encabezado: 'Proveedor: {{proveedor}} ({{identificacion}}) · {{fecha}} · Estado: {{estado}}', pie: 'Subtotal {{subtotal}} · IVA {{iva}} · Total {{total}}', columnas: col, estilo },
      factura: { titulo: 'Factura {{numero}}', encabezado: 'Proveedor: {{proveedor}} (RUC {{identificacion}}) · Fecha {{fecha}} · Estado: {{estado}} · Clave de acceso {{clave}}', pie: 'Subtotal {{subtotal}} · IVA {{iva}} · Total {{total}}', columnas: col, estilo } } };
})();
