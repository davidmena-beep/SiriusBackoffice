// SIRIUS · Coordinación con los inspectores y el reloj de la base, con la conexión simulada (v1.0 · provisional · etapa P-6f-0e · 18/10/2026)
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
  const ESC = { cxcoordins: ['50081', '', ''], cxcoordpasado: ['50085', 'Luis Andrade', ''], cxcoordcambiar: ['50084', 'Luis Andrade', 'El inspector asignado tiene otra cita en el sur de Quito a esa hora.'] };
  const reloj = () => { const SF = window.SiriusFecha; return SF && SF.relojEcuador ? SF.relojEcuador() : { hoy: '2026-10-18', hora: '20:30', min: 1230 }; };
  const prop = () => { const SF = window.SiriusFecha, r = reloj(); return SF && SF.propuestaVisita ? SF.propuestaVisita(r, 45) : { fecha: r.hoy, hIni: '08:00', hFin: '08:45' }; };
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
    if (escena === 'cxcoordcambiar') casos.push(caso(id, 'Agendado', { visitasBase: [vis(1, 'Mauricio Endara', p.fecha, p.hIni, p.hFin)] }));
    else casos.push(caso(id, 'En coordinación'));
    // Agenda de Mauricio Endara el día propuesto: 2 visitas que cuentan (una choca con la hora propuesta) y 2 que no (Cancelada y Terminada).
    casos.push(caso('50082', 'Agendado', { asegurado: 'Fernando Alvear Mena', visitasBase: [vis(1, 'Mauricio Endara', p.fecha, p.hIni, hm(p.hIni, 45))] }));
    casos.push(caso('50083', 'Agendado', { asegurado: 'Patricia Garcés Ortiz', visitasBase: [vis(1, 'Mauricio Endara', p.fecha, hm(p.hIni, 60), hm(p.hIni, 105)), vis(2, 'Mauricio Endara', p.fecha, hm(p.hIni, 120), hm(p.hIni, 150), 'Cancelada')] }));
    casos.push(caso('50086', 'Inspeccionado', { asegurado: 'Javier Cueva Ríos', visitasBase: [vis(1, 'Mauricio Endara', p.fecha, '07:00', '07:45', 'Terminada')] }));
    const X = { usuario: U, casos: casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(INSPECTORES)), relojReal: true,
      coordEscena: { inspector: e[1], motivo: e[2], rechazar: rech } };
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
    if (d.motivo) v.motivo = d.motivo; return { ok: true, mensaje: 'Visita guardada en la base' }; };
  CC.cxInspectores = { inspectores: INSPECTORES, escenas: ESC };
})();
