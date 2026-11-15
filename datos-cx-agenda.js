// SIRIUS · Agenda conectada con la conexión simulada (v1.0 · provisional · etapa G-2e · 18/10/2026)
// Escenas: cxagenda (semana con los inspectores y las visitas de la base: Mauricio Endara con 2 visitas, una «Fuera de cobertura»; una visita con «Oferta enviada» y otra
// «Por agendar» en «Sin asignar»; la línea de la hora actual), cxagendamover (mover una visita a otra hora con motivo; ?fmov=choque | jornada | fuera | enviar | base:
// choque, fuera de la jornada, fuera de cobertura (pide motivo), se guarda en la base o la base responde { ok: false }) y cxagendafiltros («Ciudad y zona» = Quito · Norte e
// inspector Mauricio Endara). Reloj real de Ecuador (relojReal, DEC-230): las fechas se calculan al abrir la escena; el «día base» es hoy si es hábil y todavía no son las
// 13:00, si no, el siguiente día hábil. Inspectores: los de la base de las escenas de fases (sin jornada propia, Mauricio Endara usa la jornada por defecto de las visitas).
// La base simulada responde agendarVisita { caso, visita, accion: 'reagendar', inicio, minutos, inspector, riesgos, lugar, motivo, fueraCobertura } → { ok, mensaje }:
// valida el inspector y la hora (no en el pasado) y guarda la visita; la última petición queda en window.__sirAgendaUltima (para revisar su forma).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxFases || !CC.cxSim) return;
  const U = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] };
  const qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const reloj = () => { const SF = window.SiriusFecha; return SF && SF.relojEcuador ? SF.relojEcuador() : { hoy: '2026-10-18', hora: '20:30', min: 1230 }; };
  const sumar = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const habil = (iso) => { const F = window.SIRIUS_FLUJO, p = iso.split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2]); return F && F.esHabil ? F.esHabil(d) : [1, 2, 3, 4, 5].indexOf(d.getDay()) >= 0; };
  const sigHabil = (iso) => { let f = iso; for (let k = 0; k < 15 && !habil(f); k++) f = sumar(f, 1); return f; };
  const masHoras = (r, h) => { const t = new Date(r.hoy + 'T' + r.hora + ':00Z'); t.setUTCHours(t.getUTCHours() + h); return t.toISOString().slice(0, 16); };
  const Q = '1701', ZN = { id: 'z1701-1', nombre: 'Norte' }, ZC = { id: 'z1701-2', nombre: 'Centro' }, ZS = { id: 'z1701-3', nombre: 'Sur' }, ZV = { id: 'z1701-5', nombre: 'Valles Cumbayá y Tumbaco' };
  const lugar = (dir, punto, zona, ciudad) => ({ provincia: ciudad === '0901' ? '09' : '17', ciudad: ciudad || Q, direccion: dir, referencia: '', punto: punto, zona: zona, estadoZona: 'Calculada', lejos: false, origen: 'Búsqueda' });
  const ESC = { cxagenda: 'Semana', cxagendamover: 'Día', cxagendafiltros: 'Semana' };
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = ['60101', 'ninguna']; });
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  CC.cxSim = function (escena) {
    if (!ESC[escena]) return baseCC(escena);
    const r = reloj(), h0 = sigHabil(r.hoy), B = h0 === r.hoy && r.min >= 13 * 60 ? sigHabil(sumar(r.hoy, 1)) : h0, B1 = sigHabil(sumar(B, 1)), B2 = sigHabil(sumar(B1, 1));
    const vis = (n, ins, f, a, b, extra) => Object.assign({ n: n, modalidad: 'Presencial', estado: 'Agendada', inicio: f + 'T' + a, fin: f + 'T' + b, agendadoEn: r.hoy + 'T08:00', origen: 'Coordinador', inspector: ins, enlace: null, enlaces: [] }, extra || {});
    const caso = (id, aseg, placa, auto, L) => ({ id: id, orden: 'EMI-2026-1' + id, origen: 'BPM de Emisión', ramo: 'Vehículos', tipoRiesgo: 'Vehículos', broker: 'Andes Brokers', asegurado: aseg, ident: '17' + id + '0001', placa: placa, bien: auto + ' · ' + placa,
      fecha: r.hoy, registrado: r.hoy + 'T07:30', sucursal: 'Quito', backoffice: U.nombre, estado: 'Agendado', responsable: U.nombre, comercial: 'Carolina Vega', flujoVersion: 2,
      riesgos: [{ id: id + '-V1', label: placa, detalle: auto, nowrap: true, cobertura: 'Todo riesgo', estado: 'Agendado' }], solicitud: { formularios: ['Vehículos livianos'] }, formularios: ['Vehículos livianos'],
      contacto: { nombre: aseg, cel: '0990' + id.slice(-6), correo: '' }, consentimiento: { whatsapp: true, sms: true, correo: false }, dir: (L[0] && L[0].direccion) || '', visitasBase: L });
    const V = (id, extra) => Object.assign({ riesgos: [id + '-V1'] }, extra);
    const casos = [
      caso('60101', 'Comercial Andina S.A.', 'PCX1001', 'Toyota, Fortuner, 2023', [vis(1, 'Mauricio Endara', B, '09:00', '09:45', V('60101', { lugar: lugar('Av. Amazonas N36-152 y Naciones Unidas, Quito', [-0.1765, -78.4845], ZN), direccion: 'Av. Amazonas N36-152 y Naciones Unidas, Quito' }))]),
      caso('60102', 'Rosa Elvira Quishpe', 'PCX1002', 'Chevrolet, Tracker, 2022', [vis(1, 'Mauricio Endara', B, '11:00', '11:45', V('60102', { lugar: lugar('Av. Mariscal Sucre S12-45 y Ajaví, Quito', [-0.2702, -78.5426], ZS), direccion: 'Av. Mariscal Sucre S12-45 y Ajaví, Quito', fueraCobertura: { motivo: 'La clienta solo puede recibir en su casa del sur; Mauricio ya conoce el sector.' } }))]),
      caso('60103', 'Talleres Andinos Cía. Ltda.', 'PCX1003', 'Hyundai, Tucson, 2021', [vis(1, 'Diana Cárdenas', B, '10:00', '11:00', V('60103', { lugar: lugar('Av. 10 de Agosto N20-15 y Bolivia, Quito', [-0.2081, -78.4987], ZC), direccion: 'Av. 10 de Agosto N20-15 y Bolivia, Quito' }))]),
      caso('60104', 'Ferretería El Sol', 'PCX1004', 'Kia, Sportage, 2024', [vis(1, 'Cristian Vaca', B1, '14:00', '14:45', V('60104', { lugar: lugar('Av. Maldonado S9-120 y Pujilí, Quito', [-0.2601, -78.5281], ZS), direccion: 'Av. Maldonado S9-120 y Pujilí, Quito' }))]),
      caso('60105', 'Panadería La Ronda', 'PCX1005', 'Nissan, Frontier, 2020', [vis(1, 'Luis Andrade', B1, '09:00', '09:45', V('60105', { lugar: lugar('Av. Interoceánica km 12, Cumbayá', [-0.2035, -78.4319], ZV), direccion: 'Av. Interoceánica km 12, Cumbayá' }))]),
      caso('60106', 'Mónica Ruiz Andrade', 'PCX1006', 'Suzuki, Vitara, 2022', [vis(1, 'Marco Tapia', r.hoy, '08:00', '08:45', V('60106', { estado: 'Realizada', lugar: lugar('Av. de los Shyris N35-20, Quito', [-0.1789, -78.4797], ZN), direccion: 'Av. de los Shyris N35-20, Quito' }))]),
      caso('60107', 'Constructora Pichincha S.A.', 'PCX1007', 'Ford, Ranger, 2023', [vis(1, 'Marco Tapia', B, '15:00', '16:00', V('60107', { lugar: lugar('Av. Gran Colombia N15-210, Quito', [-0.2119, -78.5021], ZC), direccion: 'Av. Gran Colombia N15-210, Quito' }))]),
      caso('60108', 'Distribuidora del Valle S.A.', 'PCX1008', 'Mazda, CX-5, 2024', [{ n: 1, modalidad: 'Presencial', estado: 'Buscando inspector', origen: 'Coordinador', inspector: '', enlace: null, enlaces: [], riesgos: ['60108-V1'], lugar: lugar('Av. Eloy Alfaro N39-112 y José Puerta, Quito', [-0.1702, -78.4781], ZN), direccion: 'Av. Eloy Alfaro N39-112 y José Puerta, Quito',
        oferta: { inspectores: ['Mauricio Endara', 'Diana Cárdenas', 'Cristian Vaca'], desde: B, hasta: B2, minutos: 45, vigenciaHoras: 2, nota: '', vence: masHoras(r, 2) } }]),
      caso('60109', 'Pedro Alarcón Vega', 'PCX1009', 'Renault, Duster, 2021', [{ n: 1, modalidad: 'Presencial', estado: 'Por agendar', origen: 'Coordinador', inspector: '', enlace: null, enlaces: [], riesgos: ['60109-V1'], lugar: lugar('Av. Colón E4-105 y 9 de Octubre, Quito', [-0.2009, -78.4931], ZC), direccion: 'Av. Colón E4-105 y 9 de Octubre, Quito' }]),
      caso('60110', 'Javier Cueva Ríos', 'PCX1010', 'Chevrolet, Onix, 2025', [vis(1, 'Mauricio Endara', B, '15:00', '15:45', V('60110', { estado: 'Cancelada', motivoCancelacion: 'El cliente vendió el vehículo', lugar: lugar('Av. República E7-55, Quito', [-0.1868, -78.4837], ZN) }))]),
      caso('60111', 'Comercial Guayas S.A.', 'GCX1011', 'Toyota, Hilux, 2022', [vis(1, 'Paola Vinueza', B1, '10:00', '10:45', V('60111', { lugar: lugar('Av. Francisco de Orellana, Guayaquil', [-2.1544, -79.8915], { id: 'z0901-1', nombre: 'Norte' }, '0901'), direccion: 'Av. Francisco de Orellana, Guayaquil' }))]),
    ];
    casos[10].sucursal = 'Guayaquil';
    const mov = qp('fmov'), M = { caso: '60101', visita: 1, inspector: 'Mauricio Endara', fecha: B, hIni: '15:00', motivo: 'El cliente pidió pasar la visita a la tarde por una reunión.' };
    if (mov === 'choque') Object.assign(M, { hIni: '11:00', motivo: 'El cliente pidió la visita a media mañana.' });
    if (mov === 'jornada') Object.assign(M, { hIni: '17:30', motivo: 'El cliente solo puede después de las cinco.' });
    if (mov === 'fuera') Object.assign(M, { inspector: 'Cristian Vaca', hIni: '15:00', motivo: 'Mauricio tiene una urgencia; Cristian está cerca del norte esa tarde.' });
    if (mov === 'enviar' || mov === 'base') M.enviar = true;
    const esc = { escena: escena, vista: ESC[escena], fecha: B, rechazar: mov === 'base' };
    if (escena === 'cxagendamover') esc.mover = M;
    if (escena === 'cxagendafiltros') Object.assign(esc, { fCz: 'z:' + Q + ':' + ZN.id, fIns: 'Mauricio Endara' });
    const X = { usuario: U, casos: casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(CC.cxFases.inspectores)), relojReal: true, agendaEscena: esc };
    casos.forEach((c) => { X.eventos[c.id] = [{ hora: r.hoy + 'T07:30', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[c.id] = []; X.controles[c.id] = []; X.informes[c.id] = []; X.calificaciones[c.id] = []; });
    if (window.SiriusCoordEstado) casos.forEach((c) => window.SiriusCoordEstado.aplicarBase(c, U.nombre));
    return X; };
  // Base simulada de la Agenda: agendarVisita (reagendar desde la Agenda) con el reloj real.
  CC.aplicar = function (X, tipo, d) {
    if (tipo !== 'agendarVisita' || !X || !X.agendaEscena) return baseAp(X, tipo, d);
    try { window.__sirAgendaUltima = JSON.parse(JSON.stringify({ tipo: tipo, datos: d })); } catch (e) { /* nada */ }
    const c = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c) return { ok: false, mensaje: 'El caso no existe en la base' };
    if (X.agendaEscena.rechazar) return { ok: false, mensaje: 'La visita V' + d.visita + ' del caso ' + c.id + ' cambió en la base mientras la movías (otra persona la reagendó). Vuelve a abrir la Agenda e inténtalo de nuevo.' };
    const act = (X.inspectores || []).filter((i) => /^activ/i.test(i.estado || '') && !(i.tipo === 'Agencia' && !i.agencia)).map((i) => i.nombre);
    if (!d.inspector || act.indexOf(d.inspector) < 0) return { ok: false, mensaje: 'El inspector ' + (d.inspector || '(vacío)') + ' no existe en la base' };
    const r = reloj(), ini = String(d.inicio || '').slice(0, 16); if (!ini || ini < r.hoy + 'T' + r.hora) return { ok: false, mensaje: 'La hora elegida ya pasó' };
    if (String(d.motivo || '').trim().length < 10) return { ok: false, mensaje: 'Falta el motivo del reagendamiento' };
    const v = (c.visitasBase || []).find((x) => x && x.n === d.visita); if (!v) return { ok: false, mensaje: 'La visita V' + d.visita + ' no existe en el caso ' + c.id };
    const SF = window.SiriusFecha, fin = SF ? ini.slice(0, 11) + SF.aHora(SF.aMin(ini.slice(11)) + (d.minutos || 45)) : ini;
    const antes = (v.inicio || '').replace('T', ' ') + ' · ' + (typeof v.inspector === 'object' && v.inspector ? v.inspector.nombre : v.inspector);
    Object.assign(v, { estado: 'Agendada', inicio: ini, fin: fin, inspector: d.inspector, motivo: d.motivo, fueraCobertura: d.fueraCobertura && d.fueraCobertura.motivo ? { motivo: d.fueraCobertura.motivo } : null });
    if (Array.isArray(d.riesgos) && d.riesgos.length) v.riesgos = d.riesgos.slice(); if (d.lugar) v.lugar = JSON.parse(JSON.stringify(d.lugar));
    (X.eventos[c.id] = X.eventos[c.id] || []).unshift({ hora: r.hoy + 'T' + r.hora, accion: 'Visita reagendada', detalle: 'V' + d.visita + ' · de ' + antes + ' a ' + ini.replace('T', ' ') + ' · ' + d.inspector + ' · Motivo: ' + d.motivo + (v.fueraCobertura ? ' · Alerta de cobertura' : '') + ' · desde la Agenda', actor: U.nombre, rol: U.rol });
    if (window.SiriusCoordEstado) window.SiriusCoordEstado.aplicarBase(c, U.nombre);
    return { ok: true, mensaje: 'Visita reagendada en la base' }; };
})();
