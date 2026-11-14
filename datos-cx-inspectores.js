// SIRIUS · Coordinación con los inspectores y el reloj de la base, con la conexión simulada (v1.2 · provisional · etapas P-6f-0e, P-6f-0f y P-6f-0f2 · 18/10/2026)
// v1.2 (P-6f-0f2 · DEC-232): escena agendajornada (Configuración general › Agenda; caso 50095 para ver Coordinación con la jornada por defecto nueva); la propuesta de las escenas lee SIRIUS_AGENDA.jornadaDefecto.
// v1.1 (P-6f-0f · DEC-232): escenas cxcoordmismo, cxcoordjornada (jornada de Mauricio Endara en la Agenda solo en esa escena) y cxvisitariesgos (3 vehículos con placa,
// detalle y nowrap; la visita guarda en la base los vehículos elegidos y su dirección); aplicar guarda riesgos y direccion.
// Decisiones: DEC-230 (reloj real de Ecuador para los casos de la base) y DEC-231 (inspectores de la base y agendarVisita con acción y motivo).
// Forma del contrato: SIRIUS_CONEXION.inspectores = [{ nombre, tipo ('Interno' | 'Agencia' | 'Independiente'), agencia (nombre o null), zonas [], estado }];
// la carga y los choques salen de casos[].visitasBase (inspector, inicio, fin; sin Cancelada, Enviada ni Terminada); agendarVisita { caso, visita, accion, inicio, minutos,
// inspector, modalidad, direccion, motivo } → { ok, mensaje }. Solo para estas escenas: relojReal (usa el reloj real aunque la conexión sea simulada) y coordEscena (datos del panel abierto).
// Se suma a SIRIUS_CX_COORD (datos-cx-coordinacion.js): las mismas escenas simuladas (cxSimBoot), que se limpian al cambiar de escena. Las fechas de las visitas se calculan
// con el reloj real de Ecuador al abrir la escena, para que ocupen el día que propone Coordinación.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC) return;
  const U = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] };
  // Inspectores de la base: 3 activos que se listan, la agencia como registro propio y un inspector inactivo (estos dos no se listan).
  const INSPECTORES = [
    { nombre: 'Mauricio Endara', tipo: 'Agencia', agencia: 'Eurosurvey', zonas: ['Quito'], estado: 'Activo' },
    { nombre: 'Luis Andrade', tipo: 'Independiente', agencia: null, zonas: ['Quito'], estado: 'Activo' },
    { nombre: 'Gabriela Toapanta', tipo: 'Interno', agencia: null, zonas: ['Quito'], estado: 'Activo' },
    { nombre: 'Eurosurvey', tipo: 'Agencia', agencia: null, zonas: ['Quito', 'Guayaquil'], estado: 'Activo' },
    { nombre: 'Diego Salinas', tipo: 'Independiente', agencia: null, zonas: ['Quito'], estado: 'Inactivo' },
  ];
  // escena → [caso, quién se elige en el panel, motivo escrito]
  const ESC = { cxcoordins: ['50081', '', ''], cxcoordpasado: ['50085', 'Luis Andrade', ''], cxcoordcambiar: ['50084', 'Luis Andrade', 'El inspector asignado tiene otra cita en el sur de Quito a esa hora.'],
    cxcoordmismo: ['50087', 'Mauricio Endara', ''], cxcoordjornada: ['50091', '', 'El cliente pidió otra hora para la visita.'], cxvisitariesgos: ['50093', 'Luis Andrade', ''],
    agendajornada: ['50095', '', ''] }; // P-6f-0f2: Configuración general › Agenda con la conexión simulada; el caso 50095 (En coordinación) sirve para ver Coordinación con la jornada nueva
  // Jornada de Mauricio Endara en la Agenda (solo en cxcoordjornada): de lunes a viernes, de 08:00 a 17:00. Gabriela Toapanta no tiene jornada propia: usa la jornada por defecto de las visitas (SIRIUS_AGENDA.jornadaDefecto; inicial lunes a sábado, 08:30–17:30).
  const JORNADA_ME = { inspector: 'Mauricio Endara', credencial: 'EUR-INS-0058', ciudadBase: 'Quito', dias: [1, 2, 3, 4, 5], jornada: ['08:00', '17:00'], zonas: ['Quito'], capacidadDia: 5, modalidades: ['Presencial', 'Virtual guiada'] };
  // cxvisitariesgos: 3 vehículos del caso (como los envía la base: label = placa, detalle «Marca, Modelo, Año», nowrap) y la dirección que escribe el Coordinador para la visita.
  const VEH3 = [['PRB1212', 'Kia, Rio, 2022'], ['PR121A', 'Suzuki, GN125, 2023'], ['PRB1213', 'Toyota, Hilux, 2022']];
  const DIR_VISITA = 'Av. Mariana de Jesús E7-42 y La Pradera, Quito';
  const lunes = () => { const r = reloj(), t = new Date(r.hoy + 'T12:00:00Z'); for (let k = 1; k < 8; k++) { const u = new Date(t.getTime() + k * 864e5); if (u.getUTCDay() === 1) return u.toISOString().slice(0, 10); } return r.hoy; };
  const reloj = () => { const SF = window.SiriusFecha; return SF && SF.relojEcuador ? SF.relojEcuador() : { hoy: '2026-10-18', hora: '20:30', min: 1230 }; };
  // P-6f-0f2 · DEC-232: la hora propuesta ya cae dentro de la jornada por defecto de las visitas (SiriusFecha.propuestaVisita la lee de SIRIUS_AGENDA.jornadaDefecto).
  const prop = () => { const SF = window.SiriusFecha, r = reloj(); return SF && SF.propuestaVisita ? SF.propuestaVisita(r, 45) : { fecha: r.hoy, hIni: '', hFin: '' }; };
  const hm = (h, m) => { const SF = window.SiriusFecha; return SF && SF.aHora ? SF.aHora(SF.aMin(h) + m) : h; };
  const caso = (id, estado, extra) => Object.assign({ id: id, orden: 'EMI-2026-119' + id.slice(-3), origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Andes Brokers', asegurado: 'Rosa Elvira Quishpe', ident: '1715570321', placa: 'PDK' + id.slice(-4), bien: 'Placa PDK' + id.slice(-4) + ', 2023',
    fecha: '2026-10-17', registrado: '2026-10-17T15:20', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado: estado, responsable: 'Andrea Salazar', comercial: 'Carolina Vega', flujoVersion: 2,
    solicitud: { marca: 'Chevrolet', modelo: 'Tracker', anio: 2023, placa: 'PDK' + id.slice(-4), carroceria: 'SUV', sumaAsegurada: 21900, formularios: ['Vehículos livianos'] },
    contacto: { nombre: 'Rosa Quishpe', cel: '0987712045', correo: 'rosa.quishpe@correo.ec' }, consentimiento: { whatsapp: true, sms: true, correo: true }, dir: 'Av. Eloy Alfaro N39-112 y José Puerta, Quito', visitasBase: [] }, extra || {});
  const vis = (n, inspector, fecha, a, b, estado) => ({ n: n, modalidad: 'Presencial', estado: estado || 'Agendada', inicio: fecha + 'T' + a, fin: fecha + 'T' + b, agendadoEn: '2026-10-17T16:00', origen: 'Coordinador', inspector: inspector, enlace: null, enlaces: [] });
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = [ESC[k][0], 'ninguna']; });
  CC.cxSim = function (escena) { const e = ESC[escena]; if (!e) return baseCC(escena); const p = prop(), id = e[0];
    let rech = ''; try { rech = new URLSearchParams(location.search).get('cxrech') === '1' ? e[1] : ''; } catch (er) { rech = ''; }
    const casos = [];
    // La visita a cambiar: el próximo lunes de 10:00 a 10:45, dentro de la jornada de todos los inspectores de la base.
    if (escena === 'cxcoordcambiar' || escena === 'cxcoordmismo') casos.push(caso(id, 'Agendado', { visitasBase: [vis(1, 'Mauricio Endara', lunes(), '10:00', '10:45')] }));
    else if (escena === 'cxcoordjornada') { const L = lunes(); casos.push(caso(id, 'Agendado', { visitasBase: [vis(1, 'Mauricio Endara', L, '10:00', '10:45')] })); casos.push(caso('50092', 'En coordinación', { asegurado: 'Andrés Proaño Vela' }));
    }
    else if (escena === 'cxvisitariesgos') casos.push(caso(id, 'En coordinación', { tipoRiesgo: 'Vehículos', placa: '', bien: 'Flota PRB1212, PR121A y PRB1213', riesgos: VEH3.map((x, i) => ({ id: id + '-V' + (i + 1), label: x[0], detalle: x[1], nowrap: true, cobertura: 'Todo riesgo', estado: 'En coordinación' })) }));
    else casos.push(caso(id, 'En coordinación'));
    // Agenda de Mauricio Endara el día propuesto: 2 visitas que cuentan (una choca con la hora propuesta) y 2 que no (Cancelada y Terminada).
    casos.push(caso('50082', 'Agendado', { asegurado: 'Fernando Alvear Mena', visitasBase: [vis(1, 'Mauricio Endara', p.fecha, p.hIni, hm(p.hIni, 45))] }));
    casos.push(caso('50083', 'Agendado', { asegurado: 'Patricia Garcés Ortiz', visitasBase: [vis(1, 'Mauricio Endara', p.fecha, hm(p.hIni, 60), hm(p.hIni, 105)), vis(2, 'Mauricio Endara', p.fecha, hm(p.hIni, 120), hm(p.hIni, 150), 'Cancelada')] }));
    casos.push(caso('50086', 'Inspeccionado', { asegurado: 'Javier Cueva Ríos', visitasBase: [vis(1, 'Mauricio Endara', p.fecha, '07:00', '07:45', 'Terminada')] }));
    const X = { usuario: U, casos: casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(INSPECTORES)), relojReal: true,
      coordEscena: { inspector: e[1], motivo: e[2], rechazar: rech, dir: escena === 'cxvisitariesgos' ? DIR_VISITA : '', hIni: '00:00', hFin: '00:45',
        // Solo en cxcoordjornada: la disponibilidad de la Agenda para esta escena (se suma a SIRIUS_AGENDA.disponibilidad sin cambiarla).
        disponibilidad: escena === 'cxcoordjornada' ? [JSON.parse(JSON.stringify(JORNADA_ME))] : [] } };
    if (escena === 'agendajornada') X.usuario = Object.assign({}, U, { rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] }); // P-6f-0f2: la Agenda se configura como Administrador (y puede coordinar)
    try { const h = new URLSearchParams(location.search).get('cxhora'); if (escena === 'cxcoordjornada' && /^\d\d:\d\d$/.test(h || '')) { X.coordEscena.hIni = h; X.coordEscena.hFin = hm(h, 45); } } catch (er) { /* nada */ }
    casos.forEach((c) => { X.eventos[c.id] = [{ hora: '2026-10-17T15:20', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[c.id] = []; X.controles[c.id] = []; X.informes[c.id] = []; X.calificaciones[c.id] = []; });
    return X; };
  // Base simulada: agendarVisita valida el inspector (activo y que exista) y la hora (no en el pasado), y guarda la visita en visitasBase.
  CC.aplicar = function (X, tipo, d) { if (tipo !== 'agendarVisita' || !X || !X.coordEscena) return baseAp(X, tipo, d);
    const c = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c) return null;
    const act = (X.inspectores || []).filter((i) => /^activ/i.test(i.estado || '') && !(i.tipo === 'Agencia' && !i.agencia)).map((i) => i.nombre);
    if (d.inspector && (act.indexOf(d.inspector) < 0 || X.coordEscena.rechazar === d.inspector)) return { ok: false, mensaje: 'El inspector ' + d.inspector + ' no existe en la base' };
    const r = reloj(), ini = String(d.inicio || '').slice(0, 16); if (ini && ini < r.hoy + 'T' + r.hora) return { ok: false, mensaje: 'La hora elegida ya pasó' };
    const V = c.visitasBase = c.visitasBase || [], SF = window.SiriusFecha, fin = ini && SF ? ini.slice(0, 11) + SF.aHora(SF.aMin(ini.slice(11)) + (d.minutos || 0)) : null;
    let v = V.find((x) => x.n === d.visita);
    if (!v) { v = { n: d.visita || V.length + 1, modalidad: d.modalidad || 'Presencial', estado: 'Agendada', origen: 'Coordinador', enlace: null, enlaces: [] }; V.push(v); }
    if (d.accion === 'cambiarInspector') v.inspector = d.inspector; else Object.assign(v, { estado: 'Agendada', inicio: ini, fin: fin, inspector: d.inspector, agendadoEn: r.hoy + 'T' + r.hora });
    if (Array.isArray(d.riesgos) && d.riesgos.length) v.riesgos = d.riesgos.slice(); if (d.direccion && d.direccion.direccion) v.direccion = d.direccion.direccion; // DEC-232: la base guarda los vehículos y la dirección de la visita
    if (d.motivo) v.motivo = d.motivo; return { ok: true, mensaje: 'Visita guardada en la base' }; };
  CC.cxInspectores = { inspectores: INSPECTORES, escenas: ESC };
})();
