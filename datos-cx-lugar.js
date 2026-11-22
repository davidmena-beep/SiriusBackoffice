// SIRIUS · Lugar de la inspección en Coordinación con la conexión simulada (v1.0 · provisional · etapa G-2c · DEC-222, DEC-224 y DEC-225 · 18/10/2026)
// Escenas: lugarbuscar, lugarmapa (?lpunto=1), lugarlejos (?lconf=1), lugarfuera (?lguardar=1), lugarrg (?lmod=1) y cxlugar (?cxok=0).
// Inspectores de la base con su cobertura (R-5b: SIRIUS_CONEXION.inspectores[].coberturaFilas, filas de la Red; antes .cobertura, DEC-223): Mauricio Endara (Quito, zona Norte), Cristian Vaca (Quito, zona Sur),
// Gabriela Toapanta (toda Quito), Luis Andrade (sucursal Quito), Marco Tapia (todas) y Paola Vinueza (toda Guayaquil: fuera de cobertura en Quito).
// agendarVisita { …, lugar: { provincia, ciudad, direccion, referencia, punto, zona: { id, nombre } | null, estadoZona, lejos, origen }, fueraCobertura: { motivo } | null }:
// la base simulada guarda el lugar y la alerta en visitasBase[] y deja la línea en el historial del caso (eventos). Caso 50013: Ramos Generales no móvil con riesgosBase
// (composicion 'Ubicación', datos.direccion y datos.ciudad, sin punto: Coordinación busca la dirección al abrir). Se suma a SIRIUS_CX_COORD (datos-cx-inspectores.js).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxInspectores) return;
  const U = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] };
  const Q = '1701';
  // R-5b · DEC-266: la cobertura de los inspectores de la base son filas de la Red (coberturaFilas); las mismas que antes daba su «cobertura» o sus «zonas». zonas se ignora.
  const FC = (nivel, x) => Object.assign({ id: 'rc-b-' + nivel + '-' + String((x && (x.zona || x.ciudad || x.sucursal)) || 't').replace(/\W/g, ''), nivel, sucursal: '', ciudad: '', zona: '', desde: '2026-01-01', hasta: '', vigente: true, origen: 'Red de inspectores', motivo: 'Cobertura de la base' }, x || {});
  const INSPECTORES = [
    { nombre: 'Mauricio Endara', tipo: 'Agencia', agencia: 'Eurosurvey', zonas: ['Quito'], estado: 'Activo', coberturaFilas: [FC('zona', { ciudad: Q, zona: 'z1701-1' })] },
    { nombre: 'Cristian Vaca', tipo: 'Interno', agencia: null, zonas: ['Quito'], estado: 'Activo', coberturaFilas: [FC('zona', { ciudad: Q, zona: 'z1701-3' })] },
    { nombre: 'Gabriela Toapanta', tipo: 'Interno', agencia: null, zonas: ['Quito'], estado: 'Activo', coberturaFilas: [FC('ciudad', { ciudad: Q })] },
    { nombre: 'Luis Andrade', tipo: 'Independiente', agencia: null, zonas: ['Quito'], estado: 'Activo', coberturaFilas: [FC('sucursal', { sucursal: 'Quito' })] },
    { nombre: 'Marco Tapia', tipo: 'Interno', agencia: null, zonas: [], estado: 'Activo', coberturaFilas: [FC('todas')] },
    { nombre: 'Paola Vinueza', tipo: 'Independiente', agencia: null, zonas: ['Guayaquil'], estado: 'Activo', coberturaFilas: [FC('ciudad', { ciudad: '0901' })] },
    { nombre: 'Eurosurvey', tipo: 'Agencia', agencia: null, zonas: ['Quito', 'Guayaquil'], estado: 'Activo', coberturaFilas: [FC('sucursal', { sucursal: 'Quito' }), FC('sucursal', { sucursal: 'Guayaquil' })] },
  ];
  const qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const MOT = 'El cliente pidió a Paola Vinueza, que ya inspeccionó el local el año pasado.';
  // escena → [caso, configuración del lugar (la lee Coordinación en base.escena.lugar)]
  const ESC = {
    lugarbuscar: ['50012', () => ({ texto: 'Av. Amazonas y Naciones Unidas', abrir: true, fase: 'horario' })],
    lugarmapa: ['50012', () => Object.assign({ texto: 'calle 123', abrir: true }, qp('lpunto') === '1' ? { punto: [-0.2950, -78.5500] } : {})],
    lugarlejos: ['50012', () => ({ texto: 'Mitad del Mundo', abrir: true, confirmar: qp('lconf') === '1' })],
    lugarfuera: ['50012', () => Object.assign({ texto: 'Av. Amazonas y Naciones Unidas', inspector: 'Paola Vinueza' }, qp('lguardar') === '1' ? { motivo: MOT, enviar: true } : {})],
    lugarrg: ['50013', () => (qp('lmod') === '1' ? { punto: [-0.2105, -78.5025], confirmar: true, ref: 'Bodega posterior; ingreso por la calle Japón' } : {})],
    cxlugar: ['50012', () => ({ texto: 'Av. Amazonas y Naciones Unidas', inspector: 'Paola Vinueza', motivo: MOT, enviar: true })],
  };
  const reloj = () => { const SF = window.SiriusFecha; return SF && SF.relojEcuador ? SF.relojEcuador() : { hoy: '2026-10-18', hora: '20:30', min: 1230 }; };
  const prop = () => { const SF = window.SiriusFecha, r = reloj(); return SF && SF.propuestaVisita ? SF.propuestaVisita(r, 45) : { fecha: r.hoy, hIni: '09:00', hFin: '09:45' }; };
  const hm = (h, m) => { const SF = window.SiriusFecha; return SF && SF.aHora ? SF.aHora(Math.max(0, SF.aMin(h) + m)) : h; };
  const caso = (id, estado, extra) => Object.assign({ id: id, orden: 'EMI-2026-119' + id.slice(-3), origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Andes Brokers', asegurado: 'Distribuidora de prueba Doce S.A.', ident: '1792233812001', placa: 'PRB1212', bien: 'Kia Rio PRB1212, 2022',
    fecha: '2026-10-17', registrado: '2026-10-17T15:20', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado: estado, responsable: 'Andrea Salazar', comercial: 'Carolina Vega', flujoVersion: 2,
    solicitud: { marca: 'Kia', modelo: 'Rio', anio: 2022, placa: 'PRB1212', carroceria: 'Sedán', sumaAsegurada: 15000, formularios: ['Vehículos livianos'] },
    contacto: { nombre: 'Mónica Andrade', cel: '0987712046', correo: 'monica.andrade@correo.ec' }, consentimiento: { whatsapp: true, sms: true, correo: true }, dir: 'Av. Eloy Alfaro N39-112 y José Puerta, Quito', visitasBase: [] }, extra || {});
  const vis = (n, inspector, fecha, a, b) => ({ n: n, modalidad: 'Presencial', estado: 'Agendada', inicio: fecha + 'T' + a, fin: fecha + 'T' + b, agendadoEn: '2026-10-17T16:00', origen: 'Coordinador', inspector: inspector, enlace: null, enlaces: [] });
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = [ESC[k][0], 'ninguna']; });
  CC.cxSim = function (escena) { const e = ESC[escena]; if (!e) return baseCC(escena); const p = prop(), casos = [];
    if (e[0] === '50013') casos.push(caso('50013', 'En coordinación', { ramo: 'Incendio y líneas aliadas', tipoRiesgo: 'Ramos Generales', asegurado: 'Distribuidora Andina de Alimentos S.A.', ident: '1790012345001', placa: '', bien: 'Bodega y oficinas · La Carolina, Quito', solicitud: { formularios: ['Ubicación – Ramos Generales'] },
      riesgosBase: [{ descripcion: 'Bodega y oficinas · Av. de los Shyris y Naciones Unidas', composicion: 'Ubicación', suma: 380000, datos: { tipoRiesgo: 'Bodega', direccion: 'Av. de los Shyris y Naciones Unidas, La Carolina', ciudad: 'Quito', giro: 'Distribución de alimentos', construccion: 'Hormigón armado', pisos: 3, areaM2: 1200, anioConstruccion: 2012, coberturas: ['Incendio y líneas aliadas'], valorEdificio: 300000, valorContenidos: 80000 } }] }));
    else casos.push(caso(e[0], 'En coordinación'));
    // Carga del día propuesto (ordena las sugerencias por menos visitas): Gabriela Toapanta 2, Luis Andrade 1, Mauricio Endara 1; los demás, ninguna.
    casos.push(caso('50014', 'Agendado', { asegurado: 'Fernando Alvear Mena', placa: 'PDK0014', visitasBase: [vis(1, 'Gabriela Toapanta', p.fecha, hm(p.hIni, 120), hm(p.hIni, 165)), vis(2, 'Gabriela Toapanta', p.fecha, hm(p.hIni, 180), hm(p.hIni, 225))] }));
    casos.push(caso('50016', 'Agendado', { asegurado: 'Patricia Garcés Ortiz', placa: 'PDK0016', visitasBase: [vis(1, 'Luis Andrade', p.fecha, hm(p.hIni, 120), hm(p.hIni, 165)), vis(2, 'Mauricio Endara', p.fecha, hm(p.hIni, 180), hm(p.hIni, 225))] }));
    const X = { usuario: U, casos: casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(INSPECTORES)), relojReal: true,
      coordEscena: { inspector: '', motivo: '', rechazar: '', dir: '', hIni: '00:00', hFin: '00:45', lugar: e[1]() } };
    casos.forEach((c) => { X.eventos[c.id] = [{ hora: '2026-10-17T15:20', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[c.id] = []; X.controles[c.id] = []; X.informes[c.id] = []; X.calificaciones[c.id] = []; });
    return X; };
  // Base simulada: además de lo de datos-cx-inspectores (inspector, hora, vehículos y dirección), guarda el lugar y la alerta de cobertura y deja la línea en el historial.
  CC.aplicar = function (X, tipo, d) { const r = baseAp(X, tipo, d); if (tipo !== 'agendarVisita' || !X || !X.coordEscena || !X.coordEscena.lugar || (r && r.ok === false)) return r;
    const c = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)), v = c && (c.visitasBase || []).find((x) => x.n === d.visita); if (!v) return r;
    if (d.lugar) { v.lugar = JSON.parse(JSON.stringify(d.lugar)); v.direccion = d.lugar.direccion || v.direccion; }
    v.fueraCobertura = d.fueraCobertura && d.fueraCobertura.motivo ? { motivo: d.fueraCobertura.motivo } : null;
    const SL = window.SiriusLugar, rr = reloj(), lug = d.lugar && SL ? SL.texto(d.lugar) : '';
    (X.eventos[c.id] = X.eventos[c.id] || []).unshift({ hora: rr.hoy + 'T' + rr.hora, accion: d.accion === 'cambiarInspector' ? 'Inspector cambiado' : d.accion === 'reagendar' ? 'Visita reagendada' : 'Visita agendada',
      detalle: 'V' + d.visita + ' · ' + (d.inspector || 'sin inspector') + (lug ? ' · ' + lug : '') + (v.fueraCobertura ? ' · Alerta de cobertura: ' + d.inspector + ' no cubre este lugar. Motivo: ' + v.fueraCobertura.motivo : ''), actor: (X.usuario || {}).nombre || '', rol: (X.usuario || {}).rol || '' });
    return r; };
  CC.cxLugar = { inspectores: INSPECTORES, escenas: ESC };
})();
