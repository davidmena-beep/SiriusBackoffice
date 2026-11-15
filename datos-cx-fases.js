// SIRIUS · Coordinar visita por fases con la conexión simulada (v1.0 · provisional · etapa G-2c2 · DEC-237 · 18/10/2026)
// Escenas: coordfases (?ffase=lugar|horario), coordmodalidades (?fveh=3), coordfechahora (?fh=manana|choque), coordoferta (?fof=enviada), coordautoinsp (?fenviar=1),
// coordvirtual y cxcoordfases (?fof=1; ?cxok=0). Caso 50012 de Vehículos con 3 vehículos (PRB1212 USD 15.000, PR121A USD 2.400 y PRB1213 USD 33.200) y, salvo en
// coordmodalidades, la visita V1 de PRB1213 ya agendada. Reloj de demostración de Coordinación (viernes 16/10/2026, 13:40): la conexión simulada no usa el reloj real.
// Reglas de las modalidades (__sirModSim, como en coordcxmoto): plantilla «Vehículos livianos» vigente con Presencial, Virtual guiada y Autoinspección activas,
// Documental apagada y criterios de la autoinspección: suma asegurada hasta USD 30.000 y año desde 2015.
// La base simulada: agendarVisita (datos-cx-inspectores y datos-cx-lugar) y, nuevas, ofertarVisita { caso, visita, modalidad, inspectores, desde, hasta, minutos, vigenciaHoras,
// nota, lugar } → { ok, mensaje, ofertas, vence } (guarda visitasBase[].oferta) y anularOferta { caso, visita } → { ok, mensaje } (quita la visita ofertada).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxLugar) return;
  const U = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] };
  const Q = '1701', qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const INSPECTORES = [
    { nombre: 'Mauricio Endara', tipo: 'Agencia', agencia: 'Eurosurvey', zonas: ['Quito'], estado: 'Activo', cobertura: { modo: 'ciudad', sucursales: [], ciudades: [{ cod: Q, zonas: ['z1701-1', 'z1701-2'] }] } },
    { nombre: 'Diana Cárdenas', tipo: 'Agencia', agencia: 'Eurosurvey', zonas: ['Quito'], estado: 'Activo', cobertura: { modo: 'ciudad', sucursales: [], ciudades: [{ cod: Q, zonas: [] }] } },
    { nombre: 'Cristian Vaca', tipo: 'Interno', agencia: null, zonas: ['Quito'], estado: 'Activo', cobertura: { modo: 'ciudad', sucursales: [], ciudades: [{ cod: Q, zonas: ['z1701-3'] }] } },
    { nombre: 'Luis Andrade', tipo: 'Independiente', agencia: null, zonas: ['Quito', 'Ambato'], estado: 'Activo', cobertura: { modo: 'sucursales', sucursales: ['Quito', 'Ambato'], ciudades: [] } },
    { nombre: 'Marco Tapia', tipo: 'Interno', agencia: null, zonas: [], estado: 'Activo', cobertura: { modo: 'todas', sucursales: [], ciudades: [] } },
    { nombre: 'Paola Vinueza', tipo: 'Interno', agencia: null, zonas: ['Guayaquil'], estado: 'Activo', cobertura: { modo: 'sucursales', sucursales: ['Guayaquil'], ciudades: [] } },
    { nombre: 'Eurosurvey', tipo: 'Agencia', agencia: null, zonas: ['Quito', 'Guayaquil'], estado: 'Activo' },
  ];
  const J = (n, dias, a, b, cap) => ({ inspector: n, dias: dias, jornada: [a, b], capacidadDia: cap, zonas: ['Quito'], modalidades: ['Presencial', 'Virtual guiada'] });
  const DISP = [J('Mauricio Endara', [1, 2, 3, 4, 5], '08:00', '17:00', 6), J('Diana Cárdenas', [1, 2, 3, 4, 5, 6], '08:30', '17:30', 6), J('Cristian Vaca', [1, 2, 3, 4, 5], '08:00', '17:00', 5),
    J('Luis Andrade', [1, 2, 3, 4, 5, 6], '09:00', '18:00', 5), J('Marco Tapia', [1, 2, 3, 4, 5], '08:00', '17:00', 6), J('Paola Vinueza', [1, 2, 3, 4, 5], '08:30', '17:30', 5)];
  const MODSIM = { conexion: true, vigentes: { 'Vehículos livianos': { modalidades: { P: true, V: true, A: true, D: false }, criteriosA: { activo: true, sumaMax: 30000, anioMin: 2015, carrocerias: [], sucursales: [] } } } };
  const VEH = [['PRB1212', 'Kia, Rio, 2022', 15000, 2022, 'sedan'], ['PR121A', 'Suzuki, GN125, 2023', 2400, 2023, 'moto'], ['PRB1213', 'Toyota, Hilux, 2021', 33200, 2021, 'camioneta']];
  const LUG_V1 = { provincia: '17', ciudad: Q, direccion: 'Av. Amazonas N36-152 y Naciones Unidas, Quito', referencia: 'Edificio Torre Azul, piso 3', punto: [-0.1765, -78.4845], zona: { id: 'z1701-1', nombre: 'Norte' }, estadoZona: 'Calculada', lejos: false, origen: 'Búsqueda' };
  const SUR = 'Av. Mariscal Sucre S12-45 y Ajaví';
  // escena → [con la visita V1, configuración de la vista por fases (la lee Coordinación en base.escena.fases)]
  const ESC = {
    coordfases: [true, () => { const f = qp('ffase'); return f === 'horario' ? { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], diaVista: 3 } : { fase: f === 'lugar' ? 'lugar' : 'contacto', riesgos: ['PRB1212', 'PR121A'] }; }],
    coordmodalidades: [false, () => (qp('fveh') === '3' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A', 'PRB1213'] } : { fase: 'contacto', mod: 'Autoinspección', riesgos: ['PRB1212', 'PR121A'] })],
    coordfechahora: [true, () => { const v = qp('fh'); return Object.assign({ fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'] }, v === 'manana' ? { fecha: 1, hIni: '14:00', hFin: '15:00', inspector: 'Diana Cárdenas' } : v === 'choque' ? { fecha: 1, hIni: '10:30', hFin: '11:15', inspector: 'Luis Andrade' } : { fecha: 0, hIni: '09:00', hFin: '09:45', inspector: 'Diana Cárdenas' }); }],
    coordoferta: [true, () => Object.assign({ fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], panelOferta: true, ofertaIns: ['Cristian Vaca', 'Diana Cárdenas', 'Luis Andrade'], diaVista: 3 }, qp('fof') === 'enviada' ? { enviar: 'oferta' } : {})],
    coordautoinsp: [true, () => Object.assign({ fase: 'enlace', mod: 'Autoinspección', riesgos: ['PRB1212', 'PR121A'] }, qp('fenviar') === '1' ? { enviar: 'principal' } : {})],
    coordvirtual: [true, () => ({ fase: 'horario', mod: 'Virtual guiada', riesgos: ['PRB1212'], diaVista: 3 })],
    cxcoordfases: [true, () => (qp('fof') === '1' ? { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], panelOferta: true, ofertaIns: ['Cristian Vaca', 'Diana Cárdenas', 'Luis Andrade'], enviar: 'oferta', diaVista: 3 }
      : { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], fecha: 1, hIni: '14:00', hFin: '15:00', inspector: 'Diana Cárdenas', enviar: 'principal' })],
  };
  const HOY = '2026-10-16', dia = (k) => { const d = new Date(HOY + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
  const vis = (n, ins, f, a, b, extra) => Object.assign({ n: n, modalidad: 'Presencial', estado: 'Agendada', inicio: f + 'T' + a, fin: f + 'T' + b, agendadoEn: '2026-10-15T16:00', origen: 'Coordinador', inspector: ins, enlace: null, enlaces: [] }, extra || {});
  const otro = (id, aseg, L) => ({ id: id, orden: 'EMI-2026-1' + id, origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Andes Brokers', asegurado: aseg, ident: '17' + id + '0001', placa: 'PDK' + id.slice(-4), bien: 'Placa PDK' + id.slice(-4) + ', 2023', fecha: '2026-10-14', registrado: '2026-10-14T10:00', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado: 'Agendado', responsable: 'Andrea Salazar', comercial: 'Carolina Vega', flujoVersion: 2, solicitud: { formularios: ['Vehículos livianos'] }, contacto: { nombre: aseg, cel: '0990000' + id.slice(-3), correo: '' }, consentimiento: { whatsapp: true, sms: true, correo: false }, visitasBase: L });
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = ['50012', 'ninguna']; });
  CC.cxSim = function (escena) { const e = ESC[escena]; if (!e) return baseCC(escena);
    const c = { id: '50012', orden: 'EMI-2026-119012', origen: 'BPM de Emisión', ramo: 'Vehículos', tipoRiesgo: 'Vehículos', broker: 'Andes Brokers', asegurado: 'Distribuidora de prueba Doce S.A.', ident: '1792233812001', placa: '', bien: 'Flota PRB1212, PR121A y PRB1213',
      fecha: '2026-10-13', registrado: '2026-10-13T09:02', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado: e[0] ? 'Agendado' : 'En coordinación', responsable: 'Andrea Salazar', comercial: 'Carolina Vega', flujoVersion: 2,
      riesgos: VEH.map((v, i) => ({ id: '50012-V' + (i + 1), label: v[0], detalle: v[1], nowrap: true, cobertura: 'Todo riesgo', estado: e[0] && i === 2 ? 'Agendado' : 'En coordinación' })),
      formularios: VEH.map(() => 'Vehículos livianos'), sumaAsegurada: VEH.map((v) => v[2]), anios: VEH.map((v) => v[3]), placas: VEH.map((v) => v[0]),
      riesgosBase: VEH.map((v) => ({ descripcion: v[1] + ' · ' + v[0], composicion: 'Vehículo', suma: v[2], datos: { placa: v[0], marca: v[1].split(', ')[0], modelo: v[1].split(', ')[1], anio: v[3] } })),
      solicitud: { formularios: ['Vehículos livianos'] }, dir: SUR + ', Quito', contacto: { nombre: 'Fernanda Prueba', cel: '0990000012', correo: 'flota.50012@prueba.sirius.ec' }, consentimiento: { whatsapp: true, sms: true, correo: true },
      intentos: [{ fecha: '2026-10-15T10:12', medio: 'Llamada', resultado: 'No contesta', obs: '', by: 'Andrea Salazar' }, { fecha: '2026-10-15T16:40', medio: 'Llamada', resultado: 'No contesta', obs: 'Dejé mensaje de voz', by: 'Andrea Salazar' }],
      visitasBase: e[0] ? [vis(1, 'Mauricio Endara', dia(3), '10:00', '10:45', { riesgos: ['50012-V3'], direccion: LUG_V1.direccion, lugar: JSON.parse(JSON.stringify(LUG_V1)) })] : [] };
    // Agenda de los inspectores (hoy, mañana sábado y el lunes): bloques ocupados con su caso.
    const casos = [c, otro('50007', 'Sofía Moreno Paz', [vis(1, 'Mauricio Endara', dia(0), '09:00', '09:45'), vis(2, 'Mauricio Endara', dia(0), '14:00', '15:00')]), otro('30001', 'Panadería La Ronda', [vis(1, 'Diana Cárdenas', dia(0), '15:00', '16:30')]),
      otro('20200', 'Talleres Andinos', [vis(1, 'Luis Andrade', dia(0), '15:00', '15:45'), vis(2, 'Luis Andrade', dia(1), '10:00', '10:45')]), otro('20189', 'Mónica Ruiz', [vis(1, 'Marco Tapia', dia(0), '16:00', '16:45'), vis(2, 'Marco Tapia', dia(3), '08:00', '12:00')]),
      otro('20170', 'Ferretería El Sol', [vis(1, 'Diana Cárdenas', dia(1), '13:00', '14:00'), vis(2, 'Diana Cárdenas', dia(3), '13:00', '14:00')]), otro('20186', 'Pedro Alarcón', [vis(1, 'Cristian Vaca', dia(3), '10:30', '11:15')])];
    const cfg = e[1](); if (cfg.ofertaIns) cfg.ofertaIns = cfg.ofertaIns.slice();
    const X = { usuario: U, casos: casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(INSPECTORES)),
      coordEscena: { inspector: '', motivo: '', rechazar: '', dir: '', hIni: '00:00', hFin: '00:45', disponibilidad: JSON.parse(JSON.stringify(DISP)), lugar: {}, fases: cfg } };
    casos.forEach((k) => { X.eventos[k.id] = [{ hora: '2026-10-13T09:02', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[k.id] = []; X.controles[k.id] = []; X.informes[k.id] = []; X.calificaciones[k.id] = []; });
    return X; };
  // Base simulada: ofertarVisita y anularOferta (agendarVisita sigue en datos-cx-inspectores y datos-cx-lugar).
  CC.aplicar = function (X, tipo, d) { if (!X || !X.coordEscena || !X.coordEscena.fases || ['ofertarVisita', 'anularOferta', 'agendarVisita'].indexOf(tipo) < 0) return baseAp(X, tipo, d);
    if (tipo === 'agendarVisita') { // con el reloj de demostración (viernes 16/10/2026, 13:40): valida el inspector y la hora, y guarda la visita con su lugar y la alerta de cobertura
      const c0 = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c0) return { ok: false, mensaje: 'El caso no existe en la base' };
      const act = (X.inspectores || []).filter((i) => /^activ/i.test(i.estado || '') && !(i.tipo === 'Agencia' && !i.agencia)).map((i) => i.nombre);
      if (d.inspector && act.indexOf(d.inspector) < 0) return { ok: false, mensaje: 'El inspector ' + d.inspector + ' no existe en la base' };
      const ini = String(d.inicio || '').slice(0, 16); if (ini && ini < '2026-10-16T13:40') return { ok: false, mensaje: 'La hora elegida ya pasó' };
      const SF = window.SiriusFecha, fin = ini && SF ? ini.slice(0, 11) + SF.aHora(SF.aMin(ini.slice(11)) + (d.minutos || 0)) : null, V0 = c0.visitasBase = c0.visitasBase || [];
      let v = V0.find((x) => x.n === d.visita); if (!v) { v = { n: d.visita || V0.length + 1, modalidad: d.modalidad || 'Presencial', estado: 'Agendada', origen: 'Coordinador', enlace: null, enlaces: [] }; V0.push(v); }
      if (d.accion === 'cambiarInspector') v.inspector = d.inspector; else Object.assign(v, { estado: 'Agendada', inicio: ini, fin: fin, inspector: d.inspector, agendadoEn: '2026-10-16T13:40', modalidad: d.modalidad || v.modalidad });
      if (Array.isArray(d.riesgos) && d.riesgos.length) v.riesgos = d.riesgos.slice(); if (d.direccion && d.direccion.direccion) v.direccion = d.direccion.direccion; if (d.lugar) v.lugar = JSON.parse(JSON.stringify(d.lugar)); v.fueraCobertura = d.fueraCobertura && d.fueraCobertura.motivo ? { motivo: d.fueraCobertura.motivo } : null; delete v.oferta; if (d.motivo) v.motivo = d.motivo;
      const SL = window.SiriusLugar; (X.eventos[c0.id] = X.eventos[c0.id] || []).unshift({ hora: '2026-10-16T13:40', accion: d.accion === 'cambiarInspector' ? 'Inspector cambiado' : d.accion === 'reagendar' ? 'Visita reagendada' : 'Visita agendada', detalle: 'V' + d.visita + ' · ' + (d.inspector || 'sin inspector') + (d.lugar && SL ? ' · ' + SL.texto(d.lugar) : '') + (v.fueraCobertura ? ' · Alerta de cobertura: ' + d.inspector + ' no cubre este lugar. Motivo: ' + v.fueraCobertura.motivo : ''), actor: U.nombre, rol: U.rol });
      return { ok: true, mensaje: 'Visita guardada en la base' }; }
    const c = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c) return { ok: false, mensaje: 'El caso no existe en la base' };
    const V = c.visitasBase = c.visitasBase || [], E = (X.eventos[c.id] = X.eventos[c.id] || []), ahora = '2026-10-16T13:40';
    if (tipo === 'anularOferta') { const i = V.findIndex((x) => x.n === d.visita && x.oferta); if (i < 0) return { ok: false, mensaje: 'La oferta ya no existe' }; V.splice(i, 1); E.unshift({ hora: ahora, accion: 'Oferta anulada', detalle: 'V' + d.visita, actor: U.nombre, rol: U.rol }); return { ok: true, mensaje: 'Oferta anulada' }; }
    if (!Array.isArray(d.inspectores) || !d.inspectores.length) return { ok: false, mensaje: 'Elige al menos un inspector' };
    const t = new Date(2026, 9, 16, 13 + (d.vigenciaHoras || 2), 40), z = (n) => String(n).padStart(2, '0'), vence = t.getFullYear() + '-' + z(t.getMonth() + 1) + '-' + z(t.getDate()) + 'T' + z(t.getHours()) + ':' + z(t.getMinutes());
    V.push({ n: d.visita, modalidad: d.modalidad || 'Presencial', estado: 'Por agendar', origen: 'Coordinador', inspector: '', enlace: null, enlaces: [], lugar: d.lugar ? JSON.parse(JSON.stringify(d.lugar)) : null, direccion: d.lugar ? d.lugar.direccion : '',
      oferta: { inspectores: d.inspectores.slice(), desde: d.desde, hasta: d.hasta, minutos: d.minutos, vigenciaHoras: d.vigenciaHoras, nota: d.nota || '', vence: vence } });
    E.unshift({ hora: ahora, accion: 'Oferta enviada', detalle: 'V' + d.visita + ' a ' + d.inspectores.join(', ') + ' · del ' + d.desde + ' al ' + d.hasta + (d.nota ? ' · ' + d.nota : ''), actor: U.nombre, rol: U.rol });
    return { ok: true, mensaje: 'Oferta enviada', ofertas: d.inspectores.length, vence: vence }; };
  CC.cxFases = { escenas: ESC, inspectores: INSPECTORES, disponibilidad: DISP, modSim: MODSIM };
})();
