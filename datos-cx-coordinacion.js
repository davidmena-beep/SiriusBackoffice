// SIRIUS · Coordinación con la conexión: visitas de la base (visitasBase) y casos con número de un caso de ejemplo (v1.1 · provisional · etapa P-6e-3, G-4 · 18/10/2026)
// Decisiones: DEC-200 (con la conexión, ningún dato de un caso de la base sale de un caso de ejemplo) y DEC-209 (enlaces de la visita).
// Forma del contrato (SIRIUS_CONEXION.casos[i].visitasBase): [{ n, modalidad, estado ('Por agendar' | 'Agendada' | 'En curso' | 'Terminada' | 'Cancelada'), inicio, fin, agendadoEn,
//   origen, inspector, enlace: { tipo ('Autoagendamiento' | 'Autoinspección'), estado ('Vigente' | 'En curso' | 'Usado' | 'Vencido' | 'Invalidado'), vence, url } | null,
//   enlaces: [{ tipo, estado, enviadoEn, canal, vence }] }].
// Acciones que acepta la base: enviarEnlace { caso, canal, destinatario, modalidad, tipo } (crea la visita y el enlace e invalida solo el anterior del mismo tipo),
// reenviarEnlace { caso, tipo, canal } (reenvía el mismo enlace vigente), cancelarVisita { caso, visita, modalidad, motivo } (G-2c9: cancela esa visita exacta, la «Vn» de la tarjeta; sin «visita» cancelaba la abierta más reciente de la modalidad;
// responde { ok: false, mensaje: 'La visita V2 está cancelada: no se puede cancelar' } si no está abierta) e invalida sus enlaces y agendarVisita (como hoy, para reagendar).
// cxEscenas: escenas que arman la conexión simulada solo en esa pantalla (cxSimBoot); se limpia al cambiar de escena.
(function () {
  const U = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] };
  // Caso de la base: ninguna persona, placa ni fecha es de un caso de ejemplo con el mismo número.
  const caso = (id, extra) => Object.assign({ id: id, orden: 'EMI-2026-118' + id.slice(-3), origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Seguros Pacífico Brokers', asegurado: 'Mónica Villacís Paz', ident: '1714409821', placa: 'PDQ4072', bien: 'Placa PDQ4072, 2022',
    fecha: '2026-10-17', registrado: '2026-10-17T16:05', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado: 'En coordinación', responsable: 'Andrea Salazar', comercial: 'Carolina Vega', flujoVersion: 2,
    solicitud: { marca: 'Toyota', modelo: 'Corolla Cross', anio: 2022, placa: 'PDQ4072', carroceria: 'SUV', sumaAsegurada: 24500, formularios: ['Vehículos livianos'] },
    contacto: { nombre: 'Mónica Villacís', cel: '0998815530', correo: 'monica.villacis@correo.ec' }, consentimiento: { whatsapp: true, sms: true, correo: true }, dir: 'Av. 6 de Diciembre N33-42 y Bossano, Quito' }, extra || {});
  const url = (tipo, tk) => 'https://clientes.asur.ec/' + (tipo === 'Autoinspección' ? 'autoinspeccion' : 'agendar') + '?token=' + tk;
  const visitas = {
    // Visita «Por agendar» con enlace de Autoinspección vigente (se envió el 18/10 a las 09:12 por WhatsApp; vence en 48 h).
    autoinspeccion: [{ n: 1, modalidad: 'Autoinspección', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-10-18T09:12', origen: 'Coordinador', inspector: '',
      enlace: { tipo: 'Autoinspección', estado: 'Vigente', vence: '2026-10-20T09:12', url: url('Autoinspección', 'AI-7Q2K9X') },
      enlaces: [{ tipo: 'Autoinspección', estado: 'Vigente', enviadoEn: '2026-10-18T09:12', canal: 'WhatsApp', vence: '2026-10-20T09:12' }] }],
    // Visita «Por agendar» con enlace de Autoagendamiento vigente (el cliente todavía no elige la fecha).
    autoagendamiento: [{ n: 1, modalidad: 'Presencial', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-10-18T10:40', origen: 'Coordinador', inspector: '',
      enlace: { tipo: 'Autoagendamiento', estado: 'Vigente', vence: '2026-10-19T10:40', url: url('Autoagendamiento', 'AG-3M8P1D') },
      enlaces: [{ tipo: 'Autoagendamiento', estado: 'Invalidado', enviadoEn: '2026-10-17T16:30', canal: 'SMS', vence: '2026-10-18T16:30' }, { tipo: 'Autoagendamiento', estado: 'Vigente', enviadoEn: '2026-10-18T10:40', canal: 'WhatsApp', vence: '2026-10-19T10:40' }] }],
  };
  // G-2c9: 50012 con cuatro visitas presenciales (V1, V3 y V4 abiertas; V2 cancelada) para comprobar que «Cancelar visita» lleva el número de la tarjeta.
  const pres = (n, estado, ini, fin, ins, extra) => Object.assign({ n: n, modalidad: 'Presencial', estado: estado, inicio: ini, fin: fin, agendadoEn: '2026-10-17T16:30', origen: 'Coordinador', inspector: ins, enlace: null, enlaces: [] }, extra || {});
  visitas.cancelarnumero = [pres(1, 'Agendada', '2026-10-19T09:00', '2026-10-19T09:45', 'Mauricio Endara'), pres(2, 'Cancelada', '2026-10-19T14:00', '2026-10-19T14:45', 'Marco Tapia', { motivoCancelacion: 'El cliente cambió la fecha' }),
    pres(3, 'Agendada', '2026-10-20T10:00', '2026-10-20T10:45', 'Diana Cárdenas'), pres(4, 'Agendada', '2026-10-21T15:00', '2026-10-21T15:45', 'Cristian Vaca')];
  // G-3c · DEC-260: caso 30041 con dos visitas pedidas por el cliente desde el portal. V1 «Agendada» en la agenda fija (lugar con GPS en Quito · Zona Norte); V2 «Buscando inspector» en la red, con la oferta
  // pedida por el cliente a 1 inspector de Riobamba (visitasBase[].origen 'Cliente · agenda fija' | 'Cliente · red'; visitasBase[].oferta.porCliente).
  visitas.cliente = [pres(1, 'Agendada', '2026-10-20T09:00', '2026-10-20T09:45', 'Mauricio Endara', { origen: 'Cliente · agenda fija', agendadoEn: '2026-10-18T19:42', direccion: 'Av. Amazonas N36-152 y Naciones Unidas, Quito',
      lugar: { provincia: '17', ciudad: '1701', ciudadNombre: 'Quito', direccion: 'Av. Amazonas N36-152 y Naciones Unidas, Quito', referencia: 'Edificio Torre Azul, piso 3', punto: [-0.1765, -78.4845], zona: { id: 'z1701-1', nombre: 'Norte' }, estadoZona: 'Calculada', lejos: false, origen: 'GPS', texto: 'Quito · Zona Norte' } }),
    pres(2, 'Buscando inspector', null, null, '', { origen: 'Cliente · red', agendadoEn: '2026-10-18T19:50', direccion: 'Av. Daniel León Borja y Juan de Velasco, Riobamba',
      lugar: { provincia: '06', ciudad: '0601', ciudadNombre: 'Riobamba', direccion: 'Av. Daniel León Borja y Juan de Velasco, Riobamba', referencia: 'Frente al parque Sucre', punto: [-1.6636, -78.6546], zona: null, estadoZona: 'Sin zonas', lejos: false, origen: 'Búsqueda', texto: 'Riobamba · Ciudad sin zonas' },
      oferta: { inspectores: ['Pablo Heredia'], desde: '2026-10-21', hasta: '2026-10-23', minutos: 45, vigenciaHoras: 2, nota: '', vence: '2026-10-18T21:50', porCliente: true } })];
  // G-3e: caso 30052 «Agendado» con dos visitas del portal. V1 «Virtual guiada» agendada por el cliente (agenda fija) para el 21/10 a las 10:00 con Mauricio Endara, y su enlace de Autoagendamiento todavía
  // «En curso» (queda abierto a propósito: «Cambiar la fecha» lo usa). V2 «Por agendar» con otro enlace de Autoagendamiento «En curso»: se ve «Enlace abierto por el cliente», no «En curso por el cliente».
  visitas.clienteagendada = [{ n: 1, modalidad: 'Virtual guiada', estado: 'Agendada', inicio: '2026-10-21T10:00', fin: '2026-10-21T10:30', agendadoEn: '2026-10-18T19:42', origen: 'Cliente · agenda fija', inspector: 'Mauricio Endara',
      enlace: { tipo: 'Autoagendamiento', estado: 'En curso', vence: '2026-10-25T13:18', url: url('Autoagendamiento', 'AG-7B652C') },
      enlaces: [{ tipo: 'Autoagendamiento', estado: 'En curso', enviadoEn: '2026-10-18T09:05', canal: 'WhatsApp', vence: '2026-10-25T13:18' }] },
    { n: 2, modalidad: 'Presencial', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-10-18T10:40', origen: 'Coordinador', inspector: '',
      enlace: { tipo: 'Autoagendamiento', estado: 'En curso', vence: '2026-10-19T10:40', url: url('Autoagendamiento', 'AG-3M8P1D') },
      enlaces: [{ tipo: 'Autoagendamiento', estado: 'En curso', enviadoEn: '2026-10-18T10:40', canal: 'WhatsApp', vence: '2026-10-19T10:40' }] }];
  // G-4: caso 50054 (2 vehículos) de la maqueta de cartas. PGB8170: V1 enlace de autoagendamiento invalidado (reemplazado), V2 pedida a la red y cancelada,
  // V3 reagendada por el cliente (estado 'Reagendada', reemplazadaPor: 4) y V4 agendada por el cliente con su enlace abierto. PCL7594: V5 autoinspección en curso
  // por el cliente (avance { fotos, total, ultimo, paso }). Campos nuevos de la base que lee la carta: canceladoPor, canceladoEn, motivoReagenda, reagendadaEn, reemplazadaPor, reemplazoEn, avance.
  const LQ = { provincia: '17', ciudad: '1701', ciudadNombre: 'Quito', direccion: 'Av. de los Shyris y Portugal, Quito', referencia: 'Edificio Shyris Park, garaje', punto: [-0.1771, -78.4786], zona: { id: 'z1701-1', nombre: 'Norte' }, estadoZona: 'Calculada', lejos: false, origen: 'GPS', texto: 'Quito · Zona Norte' };
  const LR = { provincia: '06', ciudad: '0601', ciudadNombre: 'Riobamba', direccion: 'Av. Daniel León Borja y Juan de Velasco, Riobamba', referencia: '', punto: [-1.6636, -78.6546], zona: null, estadoZona: 'Sin zonas', lejos: false, origen: 'Búsqueda', texto: 'Riobamba · Ciudad sin zonas' };
  visitas.cartas = [
    { n: 1, modalidad: 'Presencial', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-11-19T23:43', origen: 'Coordinador', inspector: '', riesgos: ['50054-V1'], reemplazoEn: '2026-11-20T09:30',
      enlace: { tipo: 'Autoagendamiento', estado: 'Invalidado', vence: '2026-11-20T23:43', url: url('Autoagendamiento', 'AG-5Q1W8E') }, enlaces: [{ tipo: 'Autoagendamiento', estado: 'Invalidado', enviadoEn: '2026-11-19T23:43', canal: 'WhatsApp', vence: '2026-11-20T23:43' }] },
    pres(2, 'Cancelada', null, null, '', { origen: 'Cliente · red', agendadoEn: '2026-11-20T09:40', riesgos: ['50054-V1'], direccion: LR.direccion, lugar: LR, motivoCancelacion: 'El cliente pidió volver a Quito', canceladoPor: 'Andrea Salazar', canceladoEn: '2026-11-20T10:12' }),
    pres(3, 'Reagendada', '2026-11-27T16:30', '2026-11-27T17:15', 'Mauricio Endara', { origen: 'Cliente · agenda fija', agendadoEn: '2026-11-20T10:30', riesgos: ['50054-V1'], direccion: LQ.direccion, lugar: LQ, reemplazadaPor: 4, motivoReagenda: 'El cliente cambió la hora desde el portal', reagendadaEn: '2026-11-20T11:58' }),
    pres(4, 'Agendada', '2026-11-27T15:00', '2026-11-27T15:45', 'Mauricio Endara', { origen: 'Cliente · agenda fija', agendadoEn: '2026-11-20T11:58', riesgos: ['50054-V1'], direccion: LQ.direccion, lugar: LQ,
      enlace: { tipo: 'Autoagendamiento', estado: 'En curso', vence: '2026-11-30T09:30', url: url('Autoagendamiento', 'AG-9T4R2Y') },
      enlaces: [{ tipo: 'Autoagendamiento', estado: 'En curso', enviadoEn: '2026-11-20T09:30', canal: 'WhatsApp', vence: '2026-11-30T09:30' }, { tipo: 'Autoagendamiento', estado: 'En curso', enviadoEn: '2026-11-20T09:30', canal: 'Correo', vence: '2026-11-30T09:30' }] }),
    { n: 5, modalidad: 'Autoinspección', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-11-20T20:18', origen: 'Coordinador', inspector: '', riesgos: ['50054-V2'], avance: { fotos: 5, total: 9, ultimo: '2026-11-21T12:40', paso: 'Lateral derecho' },
      enlace: { tipo: 'Autoinspección', estado: 'En curso', vence: '2026-11-23T20:18', url: url('Autoinspección', 'AI-6H3N7K') }, enlaces: [{ tipo: 'Autoinspección', estado: 'En curso', enviadoEn: '2026-11-20T20:18', canal: 'Correo', vence: '2026-11-23T20:18' }] }];
  const CARTAS50054 = { estado: 'Agendado', asegurado: 'Martina Cordero', ident: '1718830245', placa: '', bien: 'PGB8170 y PCL7594', tipoRiesgo: 'Vehículos', sucursal: 'Quito', responsable: 'Andrea Salazar', dir: LQ.direccion,
    contacto: { nombre: 'Martina Cordero', cel: '0995817021', correo: 'martina.cordero@correo.ec' },
    riesgos: [{ id: '50054-V1', label: 'PGB8170', detalle: 'Hyundai Tucson 2025', nowrap: true, cobertura: 'Todo riesgo', estado: 'Agendado' }, { id: '50054-V2', label: 'PCL7594', detalle: 'Kia Sportage 2024', nowrap: true, cobertura: 'Todo riesgo', estado: 'En coordinación' }],
    formularios: ['Vehículos livianos', 'Vehículos livianos'], placas: ['PGB8170', 'PCL7594'], anios: [2025, 2024], sumaAsegurada: [38900, 31200],
    riesgosBase: [{ descripcion: 'Hyundai Tucson · PGB8170', composicion: 'Vehículo', suma: 38900, datos: { placa: 'PGB8170', marca: 'Hyundai', modelo: 'Tucson', anio: 2025 } }, { descripcion: 'Kia Sportage · PCL7594', composicion: 'Vehículo', suma: 31200, datos: { placa: 'PCL7594', marca: 'Kia', modelo: 'Sportage', anio: 2024 } }],
    solicitud: { formularios: ['Vehículos livianos'] } };
  // S-1b · SQL 72: casos con la solicitud completa (casos[].aseguradoDatos, solicitante, prov, canton, dir, correoAps, tipoSolicitud, fechaSolicitud, orden y broker).
  // 50059: «Agendado» (el asegurado es el solicitante; autoinspección en curso) → escena soleditarfuera. 50060: «En coordinación» con un solicitante distinto → escena solcx.
  const PERS = (o) => Object.assign({ nombre: '', tipoIdentificacion: 'Cédula', identificacion: '', nombres: '', apellidos: '', fechaNacimiento: '', estadoCivil: '', genero: '', telefonoFijo: '', celular: '', correo: '', provincia: '', canton: '', direccion: '' }, o);
  const VICTOR = PERS({ nombre: 'VÍCTOR GERMÁN VALLEJO RUÍZ', identificacion: '1003315098', nombres: 'VÍCTOR GERMÁN', apellidos: 'VALLEJO RUÍZ', fechaNacimiento: '1984-06-15', estadoCivil: 'Soltero(a)', genero: 'Masculino', telefonoFijo: '022456789', celular: '0999550262', correo: 'victor.vallejo@asur.ec', provincia: '17', canton: '1701', direccion: 'EL INCA' });
  const ANDINA = PERS({ nombre: 'Comercial Andina del Norte S.A.', tipoIdentificacion: 'RUC', identificacion: '1792345678001', nombres: 'Comercial Andina del Norte S.A.', telefonoFijo: '022904410', celular: '0987001122', correo: 'flota@andinanorte.ec', provincia: '17', canton: '1701', direccion: 'Av. Eloy Alfaro N39-120 y José Puerta' });
  const MAJO = PERS({ nombre: 'María José Andrade Peña', identificacion: '1715678908', nombres: 'María José', apellidos: 'Andrade Peña', fechaNacimiento: '1990-02-14', estadoCivil: 'Casado(a)', genero: 'Femenino', telefonoFijo: '022556677', celular: '0998877665', correo: 'mjandrade@brokerpacifico.ec', provincia: '17', canton: '1701', direccion: 'Av. República de El Salvador N34-211 y Moscú' });
  const SOLV = (P, sol, pol, placa, marca, modelo, anio, suma) => ({ asegurado: P.nombre, ident: P.identificacion, tipoIdentificacion: P.tipoIdentificacion, aseguradoDatos: P, solicitante: sol, prov: 'Pichincha', canton: 'Quito', dir: P.direccion, correo: P.correo, tel: P.celular,
    contacto: { nombre: P.nombre, cel: P.celular, correo: P.correo }, broker: pol.broker, correoAps: pol.correoAps, orden: pol.orden, tipoSolicitud: pol.tipoSolicitud, fechaSolicitud: pol.fechaSolicitud, origen: 'Back-office', placa: placa, bien: placa, ramo: 'Vehículos', tipoRiesgo: 'Vehículos',
    solicitud: { marca: marca, modelo: modelo, anio: anio, placa: placa, formularios: ['Vehículos livianos'], observaciones: '' }, riesgosBase: [{ descripcion: marca + ' ' + modelo + ' · ' + placa, composicion: 'Vehículo', suma: suma, datos: { placa: placa, marca: marca, modelo: modelo, anio: anio } }] });
  const SOLCASOS = {
    solfuera: SOLV(VICTOR, null, { broker: 'Broker Pacífico', correoAps: 'emisiones@brokerpacifico.ec', orden: 'EMI-409120', tipoSolicitud: 'Emisión nueva', fechaSolicitud: '2026-11-20T21:30' }, 'PCL7594', 'Kia', 'Sportage', 2024, 31200),
    solcx: SOLV(ANDINA, MAJO, { broker: 'Broker Pacífico', correoAps: 'emisiones@brokerpacifico.ec', orden: 'EMI-409133', tipoSolicitud: 'Renovación', fechaSolicitud: '2026-11-20T16:05' }, 'PDH2231', 'Toyota', 'Hilux', 2023, 42500) };
  SOLCASOS.solfuera.estado = 'Agendado'; SOLCASOS.solcx.estado = 'En coordinación';
  visitas.solfuera = [{ n: 1, modalidad: 'Autoinspección', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-11-20T21:38', origen: 'Coordinador', inspector: '',
    enlace: { tipo: 'Autoinspección', estado: 'En curso', vence: '2026-11-30T21:38', url: url('Autoinspección', 'AI-5V9C2Q') }, enlaces: [{ tipo: 'Autoinspección', estado: 'En curso', enviadoEn: '2026-11-20T21:38', canal: 'Correo', vence: '2026-11-30T21:38' }] }];
  visitas.solcx = [];
  const sim = (id, vis, extra) => { const c = caso(id, Object.assign({ visitasBase: JSON.parse(JSON.stringify(vis)) }, extra || {}));
    const eventos = [
      { hora: '2026-10-17T16:05', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' },
      vis[0] ? { hora: vis[0].agendadoEn, accion: vis[0].enlace ? 'Enlace enviado' : 'Visita agendada', detalle: vis[0].enlace ? vis[0].enlace.tipo + ' · ' + (((vis[0].enlaces || [])[0] || {}).canal === 'Correo' ? 'Correo' : 'WhatsApp al 0998815530') : 'Presencial · ' + (vis[0].inspector || ''), actor: 'Andrea Salazar', rol: 'Coordinador de inspecciones' } : null ].filter(Boolean); /* S-1b: un caso sin visitas */
    return { usuario: U, casos: [c], detalles: {}, eventos: { [id]: eventos }, evidencias: { [id]: [] }, controles: { [id]: [] }, informes: { [id]: [] }, calificaciones: { [id]: [] } }; };
  window.SIRIUS_CX_COORD = {
    version: '1.1',
    // escena → [caso, conjunto de visitas, pestaña del caso (1 = Coordinación)]
    cxEscenas: { cxvisitaenlace: ['30031', 'autoinspeccion'], cxvisitacancelar: ['30031', 'autoinspeccion'], cxcancelarvisitanumero: ['50012', 'cancelarnumero'], cxnumerocruce: ['30007', 'autoagendamiento'], cxvisitacliente: ['30041', 'cliente'], cxvisclienteagendada: ['30052', 'clienteagendada'], coordcartascx: ['50054', 'cartas'] /* G-4 */, solcx: ['50060', 'solcx'], soleditarfuera: ['50059', 'solfuera'] /* S-1b */ },
    cxSim: function (escena) { const e = this.cxEscenas[escena]; if (!e) return null; let vv = visitas[e[1]], desfase = null;
      if (escena === 'cxcancelarvisitanumero') { const f = (function () { try { return new URLSearchParams(location.search).get('fvisita') || ''; } catch (er) { return ''; } })(); window.__sirCancelUltima = null;
        if (f === '2') { vv = JSON.parse(JSON.stringify(vv)); vv[1] = Object.assign(vv[1], { estado: 'Agendada', inicio: '2026-10-19T14:00', fin: '2026-10-19T14:45', inspector: 'Marco Tapia', motivoCancelacion: undefined }); desfase = { n: 2 }; /* la pantalla aún la ve «Agendada»; en la base otra persona ya la canceló */ } }
      const X = sim(e[0], vv, escena === 'cxvisclienteagendada' ? { estado: 'Agendado', subestado: 'Autoinspección en curso', responsable: 'Mauricio Endara' } : escena === 'coordcartascx' ? JSON.parse(JSON.stringify(CARTAS50054)) : SOLCASOS[e[1]] ? JSON.parse(JSON.stringify(SOLCASOS[e[1]])) : null); if (desfase) X.cxDesfase = desfase; if (escena === 'coordcartascx' && this.cxFases && Array.isArray(this.cxFases.inspectores)) X.inspectores = JSON.parse(JSON.stringify(this.cxFases.inspectores)); /* G-4: «Ver en Agenda» con los inspectores de la base simulada */ return X; },
    // Base simulada de las escenas: aplica las acciones de visitas sobre SIRIUS_CONEXION.casos[i].visitasBase (como lo haría la base) y devuelve el enlace.
    aplicar: function (X, tipo, d) { const c = ((X && X.casos) || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c) return null; const V = c.visitasBase = c.visitasBase || [];
      const E = window.SIRIUS_EJEMPLO || {}, a = typeof E.ahora === 'function' ? E.ahora() : null, two = (n) => (n < 10 ? '0' : '') + n;
      const iso = (t) => t.getFullYear() + '-' + two(t.getMonth() + 1) + '-' + two(t.getDate()) + 'T' + two(t.getHours()) + ':' + two(t.getMinutes());
      const now = a instanceof Date ? a : new Date(2026, 9, 18, 20, 30), mas = (h) => iso(new Date(now.getTime() + h * 3600000)), abierta = (v) => v && ['Terminada', 'Cancelada', 'Reagendada', 'Cerrada sin inspección'].indexOf(v.estado) < 0;
      if (tipo === 'reenviarEnlace') { const v = (d.visita != null ? V.filter((x, i) => (x.n || i + 1) === d.visita) : V).find((x) => abierta(x) && x.enlace && x.enlace.tipo === d.tipo && /^(Vigente|En curso)$/.test(x.enlace.estado)); /* G-4: también el enlace en curso, y el de esa visita */ if (!v) return { ok: false, mensaje: 'No hay un enlace vigente de ' + d.tipo + ' para reenviar' };
        v.enlaces = (v.enlaces || []).concat([{ tipo: d.tipo, estado: 'Vigente', enviadoEn: iso(now), canal: d.canal || '', vence: v.enlace.vence, reenvio: true }]); return { enlace: v.enlace.url }; }
      if (tipo === 'enviarEnlace') { const tk = (d.tipo === 'Autoinspección' ? 'AI-' : 'AG-') + Math.random().toString(36).slice(2, 8).toUpperCase(), enl = { tipo: d.tipo, estado: 'Vigente', vence: mas(d.tipo === 'Autoinspección' ? 48 : 24), url: url(d.tipo, tk) };
        V.forEach((x) => { if (x.enlace && x.enlace.tipo === d.tipo && x.enlace.estado === 'Vigente') { x.enlace = Object.assign({}, x.enlace, { estado: 'Invalidado' }); (x.enlaces || []).forEach((y) => { if (y.tipo === d.tipo && y.estado === 'Vigente') y.estado = 'Invalidado'; }); } });
        let v = V.find((x) => abierta(x) && x.estado === 'Por agendar' && x.modalidad === d.modalidad); if (!v) { v = { n: V.reduce((m, x) => Math.max(m, x.n || 0), 0) + 1, modalidad: d.modalidad, estado: 'Por agendar', inicio: null, fin: null, agendadoEn: iso(now), origen: 'Coordinador', inspector: '', enlaces: [] }; V.push(v); }
        v.enlace = enl; v.enlaces = (v.enlaces || []).concat((Array.isArray(d.canales) && d.canales.length ? d.canales : [d.canal || '']).map((cn) => ({ tipo: d.tipo, estado: 'Vigente', enviadoEn: iso(now), canal: cn, vence: enl.vence }))); /* S-1b: un registro por canal */ return { enlace: enl.url, mensaje: 'Enlace enviado por ' + (Array.isArray(d.canales) ? d.canales.join(', ') : d.canal || '') }; }
      if (tipo === 'editarSolicitud') { /* S-1b · SQL 72: solo en las fases de coordinación, con motivo, sin cambiar la identificación del asegurado */
        const FASES = ['Registrado', 'En coordinación', 'Reaperturado', 'Enlace caducado'], rol = ((X.usuario || {}).rol) || '', ch = d.cambios || {};
        if (FASES.indexOf(c.estado) < 0) return { ok: false, mensaje: 'Solo se edita la solicitud mientras el caso está en coordinación (estado: ' + c.estado + ')' };
        if (['Coordinador de inspecciones', 'Ejecutivo comercial', 'Administrador'].indexOf(rol) < 0) return { ok: false, mensaje: 'Tu rol no edita solicitudes' };
        if (String(d.motivo || '').trim().length < 10) return { ok: false, mensaje: 'El motivo debe tener 10 caracteres o más' };
        const A0 = c.aseguradoDatos || {}; if (ch.asegurado && ch.asegurado.identificacion && String(ch.asegurado.identificacion) !== String(A0.identificacion || c.ident || '')) return { ok: false, mensaje: 'La identificación del asegurado no se cambia' };
        const partes = [];
        if (ch.asegurado) { c.aseguradoDatos = Object.assign({}, A0, window.SIRIUS_CX_COORD.personaBase(ch.asegurado), { tipoIdentificacion: A0.tipoIdentificacion || c.tipoIdentificacion || '', identificacion: A0.identificacion || c.ident || '' }); c.asegurado = c.aseguradoDatos.nombre || c.asegurado; c.dir = c.aseguradoDatos.direccion || c.dir; c.correo = c.aseguradoDatos.correo; c.tel = c.aseguradoDatos.celular; partes.push('asegurado'); }
        if ('solicitante' in ch) { c.solicitante = ch.solicitante ? window.SIRIUS_CX_COORD.personaBase(ch.solicitante) : null; partes.push(ch.solicitante ? 'solicitante' : 'solicitante: es el asegurado'); }
        if (ch.poliza) { const P = ch.poliza; if (P.fechaSolicitud) c.fechaSolicitud = P.fechaSolicitud; if ('broker' in P) c.broker = P.broker; if ('correoAps' in P) c.correoAps = P.correoAps; if ('ordenEmision' in P) c.orden = P.ordenEmision; if ('tipoSolicitud' in P) c.tipoSolicitud = P.tipoSolicitud; partes.push('póliza'); }
        (X.eventos = X.eventos || {})[c.id] = (X.eventos[c.id] || []).concat([{ hora: iso(now), accion: 'Editó la solicitud', detalle: (partes.join(', ') || 'sin cambios') + ' · Motivo: ' + String(d.motivo).trim(), actor: (X.usuario || U).nombre, rol: rol }]);
        return { ok: true, mensaje: 'Solicitud del caso ' + c.id + ' actualizada (' + partes.join(', ') + ')' }; }
      if (tipo === 'cancelarVisita') { try { window.__sirCancelUltima = JSON.parse(JSON.stringify({ tipo: tipo, datos: d })); } catch (er) { /* nada */ }
        let v;
        if (d.visita != null) { v = V.find((x, i) => (x.n || i + 1) === d.visita); if (!v) return { ok: false, mensaje: 'La visita V' + d.visita + ' no existe en el caso ' + c.id }; if (X.cxDesfase && X.cxDesfase.n === d.visita && abierta(v)) { v.estado = 'Cancelada'; v.motivoCancelacion = 'Cancelada por otra persona'; (v.enlaces || []).forEach((y) => { if (y.estado === 'Vigente' || y.estado === 'En curso') y.estado = 'Invalidado'; }); }
          if (!abierta(v)) return { ok: false, mensaje: 'La visita V' + d.visita + ' está ' + String(v.estado).toLowerCase() + ': no se puede cancelar' }; if (d.modalidad && v.modalidad !== d.modalidad) return { ok: false, mensaje: 'La visita V' + d.visita + ' es ' + v.modalidad + ', no ' + d.modalidad }; }
        else { v = V.slice().reverse().find((x) => abierta(x) && x.modalidad === d.modalidad); if (!v) return { ok: false, mensaje: 'No hay una visita abierta de ' + d.modalidad }; } /* sin «visita»: la abierta más reciente de la modalidad (como la base antes del SQL 43) */
        v.estado = 'Cancelada'; v.motivoCancelacion = d.motivo || ''; if (v.enlace) v.enlace = Object.assign({}, v.enlace, { estado: 'Invalidado' }); (v.enlaces || []).forEach((y) => { if (y.estado === 'Vigente' || y.estado === 'En curso') y.estado = 'Invalidado'; }); return {}; }
      return null; },
    // S-1b: persona de la base desde la persona del contrato (crearCaso y editarSolicitud): { nombre, tipoIdentificacion, identificacion, nombres, apellidos, fechaNacimiento, estadoCivil, genero, telefonoFijo, celular, correo, provincia, canton, direccion }.
    personaBase: function (p) { p = p || {}; const C = p.contacto || {}, o = {}; ['nombre', 'tipoIdentificacion', 'identificacion', 'nombres', 'apellidos', 'fechaNacimiento', 'estadoCivil', 'genero', 'telefonoFijo', 'provincia', 'canton', 'direccion'].forEach((k) => { if (p[k] != null && p[k] !== '') o[k] = p[k]; });
      if (C.celular || p.celular) o.celular = C.celular || p.celular; if (C.correo || p.correo) o.correo = C.correo || p.correo; return o; },
    // Datos que no deben aparecer en 30007 de la base (vienen del caso de ejemplo 30007 de «Informes por completar»).
    ejemplo30007: ['PCD5521', 'Mauricio Endara', 'Carolina Mejía', 'Renault', 'Duster'],
  };
})();
