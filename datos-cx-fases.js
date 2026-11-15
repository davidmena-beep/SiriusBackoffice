// SIRIUS · Coordinar visita por fases con la conexión simulada (v1.2 · provisional · etapa G-2c4 · DEC-237 · 18/10/2026; v1.1 en G-2c3; v1.0 en G-2c2)
// G-2c4: coordcancelavisitas (V1 Agendada y V2 con oferta; cancelar la solicitud las deja «Cancelada · motivo»; ?fpaso=tarjetas cierra el panel para ver las tarjetas; ?fcurso=1: V1 «En curso» y el aviso),
// coordvehiculoduplicado (PRB1212 en la V1; ?freag=1 reagenda la V1; ?fpestana=1 muestra la pestaña; ?frech=1|oferta: la base rechaza «PRB1212 ya está en la visita V1 (Agendada)»),
// coordofertamarcar (?fmarcar=ninguno|todos) y coordlugarotraciudad (busca una dirección de Guayaquil desde 50012 de Quito; ?fantes=1: sin buscar).
// La base simulada: agendarVisita y ofertarVisita rechazan un vehículo que ya está en otra visita abierta; cancelarSolicitud cancela todas las visitas abiertas del caso (motivoCancelacion), retira las
// ofertas, anula los enlaces vigentes y guarda casos[].cancelacion { motivo, detalle, por, hora }; con una visita «En curso» o «Por sincronizar» responde { ok: false } con el aviso.
// G-2c3 · fase Contacto: coordcontacto (?fhist=1 abre el historial), coordotronumero (?fnum=9: celular de 9 dígitos), coordenlaceauto (3 intentos sin respuesta; ?fenviar=1 envía),
// coordcancelar (?fconf=0: sin confirmar), coordeditarcontacto (?fedit=1: con el formulario abierto) y cxcoordcontacto (?fpaso=enlace|cancelar; ?cxok=0).
// La base simulada responde además intentoContacto { caso, medio, resultado, obs, destino { tipo, nombre, numero, relacion }, duracionSeg } y cancelarSolicitud { caso, motivo, detalle }.
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
  const CHOFER = (num) => ({ tipo: 'otro', nombre: 'Jorge Pillajo', relacion: 'Chofer', numero: num || '0991234567' });
  const DET_CANC = 'La empresa decidió asegurar la flota con otra compañía; lo confirmó Fernanda Prueba por teléfono.';
  // escena → [con la visita V1, configuración de la vista por fases (la lee Coordinación en base.escena.fases)]
  const ESC = {
    coordfases: [true, () => { const f = qp('ffase'); return f === 'horario' ? { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], diaVista: 3 } : { fase: f === 'lugar' ? 'lugar' : 'contacto', riesgos: ['PRB1212', 'PR121A'] }; }],
    coordmodalidades: [false, () => (qp('fveh') === '3' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A', 'PRB1213'] } : { fase: 'contacto', mod: 'Autoinspección', riesgos: ['PRB1212', 'PR121A'] })],
    coordfechahora: [true, () => { const v = qp('fh'); return Object.assign({ fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'] }, v === 'manana' ? { fecha: 1, hIni: '14:00', hFin: '15:00', inspector: 'Diana Cárdenas' } : v === 'choque' ? { fecha: 1, hIni: '10:30', hFin: '11:15', inspector: 'Luis Andrade' } : { fecha: 0, hIni: '09:00', hFin: '09:45', inspector: 'Diana Cárdenas' }); }],
    coordoferta: [true, () => Object.assign({ fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], panelOferta: true, ofertaIns: ['Cristian Vaca', 'Diana Cárdenas', 'Luis Andrade'], diaVista: 3 }, qp('fof') === 'enviada' ? { enviar: 'oferta' } : {})],
    coordautoinsp: [true, () => Object.assign({ fase: 'enlace', mod: 'Autoinspección', riesgos: ['PRB1212', 'PR121A'] }, qp('fenviar') === '1' ? { enviar: 'principal' } : {})],
    coordvirtual: [true, () => ({ fase: 'horario', mod: 'Virtual guiada', riesgos: ['PRB1212'], diaVista: 3 })],
    coordcontacto: [true, () => ({ fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], llamarHace: 95, contacto: { llamar: true, nota: 'Puede el lunes desde las 10:00 en la oficina de la Av. Mariscal Sucre; preguntar por Fernanda en recepción.', resultado: 'Contestó', historial: qp('fhist') === '1' } })],
    coordotronumero: [true, () => (qp('fnum') === '9' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], dest: CHOFER('099123456'), contacto: { numT: true } }
      : { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], dest: CHOFER(), llamarHace: 22, contacto: { llamar: true, nota: 'Timbró hasta el final; el chofer maneja la camioneta en las mañanas.', resultado: 'No contestó' } })],
    coordenlaceauto: [true, () => ({ fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], dest: CHOFER(), contacto: qp('fenviar') === '1' ? { enviarEnlace: true } : {} }), { tercero: true }],
    coordcancelar: [true, () => ({ fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: { cancelar: { motivo: 'El cliente desiste de la póliza', detalle: DET_CANC, confirmar: qp('fconf') !== '0' } } })],
    coordeditarcontacto: [true, () => ({ fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: { editar: { cCel: '0987654321', cerrar: qp('fedit') !== '1' } } })],
    cxcoordcontacto: [true, () => { const f = qp('fpaso'); return f === 'enlace' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], dest: CHOFER(), contacto: { enviarEnlace: true } }
      : f === 'cancelar' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: { cancelar: { motivo: 'El cliente desiste de la póliza', detalle: DET_CANC, confirmar: true } } }
      : { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], llamarHace: 61, contacto: { llamar: true, nota: 'Confirma la visita el lunes en la mañana.', resultado: 'Contestó' } }; }],
    // G-2c4 · DEC-237: cancelar también las visitas, vehículos en una sola visita abierta, marcar o desmarcar inspectores y dirección de otra ciudad
    coordcancelavisitas: [true, () => { const canc = { motivo: 'El cliente desiste de la póliza', detalle: DET_CANC }; return qp('fcurso') === '1' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: { cancelar: Object.assign({ confirmar: false }, canc) } }
      : { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: { cancelar: Object.assign({ confirmar: qp('fconf') !== '0', cerrarTras: qp('fpaso') === 'tarjetas' }, canc) } }; }, { v2: true, get curso() { return qp('fcurso') === '1'; } }],
    coordvehiculoduplicado: [true, () => { if (qp('freag') === '1') return { fase: 'contacto', reagendar: 'V1' }; if (qp('fpestana') === '1') return { cerrado: true };
      const r = qp('frech'); if (r === 'oferta') return { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], panelOferta: true, ofertaIns: ['Cristian Vaca', 'Diana Cárdenas'], enviar: 'oferta', diaVista: 3 };
      if (r === '1') return { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], fecha: 1, hIni: '14:00', hFin: '15:00', inspector: 'Diana Cárdenas', enviar: 'principal' };
      return { fase: 'contacto', riesgos: ['PR121A', 'PRB1213'] }; }, { v1: 'PRB1212' }],
    coordofertamarcar: [true, () => { const m = qp('fmarcar'); return { fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], panelOferta: true, diaVista: 3, ofertaIns: m === 'ninguno' ? [] : m === 'todos' ? INSPECTORES.map((i) => i.nombre) : null }; }],
    coordlugarotraciudad: [false, () => (qp('fantes') === '1' ? { fase: 'lugar', riesgos: ['PRB1212', 'PR121A'] } : { fase: 'lugar', riesgos: ['PRB1212', 'PR121A'], texto: 'Malecón 2000' })],
    // G-2c6 · DEC-237: Coordinar visita dentro del marco del sistema (barra superior, migas y menú contraído) y confirmación al salir
    // G-2c8 · DEC-238: cxestadoparcial — 50012 con V1 (PRB1212) y V2 (PR121A) agendadas y PRB1213 por coordinar; la base entrega casos[].estado «En coordinación» y subestado «2 de 3 agendados», y en cada riesgo estado y visita { n, estado, inicio, inspector } o null.
    cxestadoparcial: [true, () => ({ cerrado: true }), { v1: 'PRB1212', v2ag: true }],
    // G-2c10 · DEC-239: cxestadofases — 50012 con V1 (PRB1212) y V2 (PR121A) «En curso» (llegada registrada en la app) y PRB1213 por coordinar; la base entrega «En coordinación · 2 de 3 agendados · 2 en curso», responsable el coordinador y cada riesgo con su estado y su visita. ?ffase=inspeccion: PRB1213 agendada en la V3 → «En curso · 1 de 3 agendado», responsable el inspector.
    cxestadofases: [true, () => ({ cerrado: true }), { v1: 'PRB1212', v2ag: true, curso: true, curso2: true }],
    cxcabecera: [true, () => ({ cerrado: true }), { v1: 'PRB1212', v2ag: true }], // G-2e2 · DEC-238: el mismo caso 50012; la cabecera trae «Coordinar visita» (PRB1213 por coordinar)
    coordmarco: [true, () => ({ fase: 'horario', texto: SUR, riesgos: ['PRB1212', 'PR121A'], diaVista: 3 })],
    migasangostas: [true, () => ({ fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: qp('fmenu') === '1' ? { menu: true } : {} })],
    coordsalir: [true, () => { const s = qp('fsalir'), NOTA = 'Confirmó que recibe el lunes a las 10:00; pedir el ingreso por la puerta de carga.'; return s === 'limpio' ? { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: { salir: true } }
      : { fase: 'contacto', riesgos: ['PRB1212', 'PR121A'], contacto: s === '0' ? { nota: NOTA } : { nota: NOTA, salir: true } }; }],
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
      riesgos: VEH.map((v, i) => ({ id: '50012-V' + (i + 1), label: v[0], detalle: v[1], nowrap: true, cobertura: 'Todo riesgo', estado: e[0] && i === (e[2] && e[2].v1 === 'PRB1212' ? 0 : 2) ? 'Agendado' : 'En coordinación' })),
      formularios: VEH.map(() => 'Vehículos livianos'), sumaAsegurada: VEH.map((v) => v[2]), anios: VEH.map((v) => v[3]), placas: VEH.map((v) => v[0]),
      riesgosBase: VEH.map((v) => ({ descripcion: v[1] + ' · ' + v[0], composicion: 'Vehículo', suma: v[2], datos: { placa: v[0], marca: v[1].split(', ')[0], modelo: v[1].split(', ')[1], anio: v[3] } })),
      solicitud: { formularios: ['Vehículos livianos'] }, dir: SUR + ', Quito', contacto: { nombre: 'Fernanda Prueba', cel: '0990000012', correo: 'flota.50012@prueba.sirius.ec' }, consentimiento: { whatsapp: true, sms: true, correo: true },
      intentos: [{ fecha: '2026-10-15T10:12', medio: 'Llamada', resultado: 'No contestó', obs: '', by: 'Andrea Salazar', destino: { tipo: 'coordinacion', nombre: 'Fernanda Prueba', numero: '0990000012', relacion: '' }, duracionSeg: 35 },
        { fecha: '2026-10-15T16:40', medio: 'Llamada', resultado: 'Buzón de voz', obs: 'Dejé mensaje de voz', by: 'Andrea Salazar', destino: { tipo: 'coordinacion', nombre: 'Fernanda Prueba', numero: '0990000012', relacion: '' }, duracionSeg: 48 }].concat(e[2] && e[2].tercero ? [{ fecha: '2026-10-16T09:05', medio: 'Llamada', resultado: 'No contestó', obs: '', by: 'Andrea Salazar', destino: { tipo: 'coordinacion', nombre: 'Fernanda Prueba', numero: '0990000012', relacion: '' }, duracionSeg: 30 }] : []),
      visitasBase: (e[0] ? [vis(1, 'Mauricio Endara', dia(3), '10:00', '10:45', Object.assign({ riesgos: [e[2] && e[2].v1 === 'PRB1212' ? '50012-V1' : '50012-V3'], direccion: LUG_V1.direccion, lugar: JSON.parse(JSON.stringify(LUG_V1)) }, e[2] && e[2].curso ? { estado: 'En curso', inicio: dia(0) + 'T13:00', fin: dia(0) + 'T13:45' } : {}))] : [])
        .concat(e[2] && e[2].v2ag ? [vis(2, 'Diana Cárdenas', dia(4), '14:00', '14:45', Object.assign({ riesgos: ['50012-V2'], direccion: LUG_V1.direccion, lugar: JSON.parse(JSON.stringify(LUG_V1)) }, e[2].curso2 ? { estado: 'En curso', inicio: dia(0) + 'T13:00', fin: dia(0) + 'T13:45' } : {}))] : [])
        .concat(e[2] && e[2].curso2 && qp('ffase') === 'inspeccion' ? [vis(3, 'Mauricio Endara', dia(5), '09:00', '09:45', { riesgos: ['50012-V3'], direccion: LUG_V1.direccion, lugar: JSON.parse(JSON.stringify(LUG_V1)) })] : []) /* G-2c10: PRB1213 agendada */
        .concat(e[2] && e[2].v2 ? [{ n: 2, modalidad: 'Presencial', estado: 'Buscando inspector', origen: 'Coordinador', inspector: '', enlace: null, enlaces: [], riesgos: ['50012-V1', '50012-V2'], direccion: LUG_V1.direccion, lugar: JSON.parse(JSON.stringify(LUG_V1)),
          oferta: { inspectores: ['Cristian Vaca', 'Diana Cárdenas', 'Luis Andrade'], desde: dia(1), hasta: dia(3), minutos: 45, vigenciaHoras: 2, nota: '', vence: HOY + 'T15:40' } }] : []) };
    // Agenda de los inspectores (hoy, mañana sábado y el lunes): bloques ocupados con su caso.
    const casos = [c, otro('50007', 'Sofía Moreno Paz', [vis(1, 'Mauricio Endara', dia(0), '09:00', '09:45'), vis(2, 'Mauricio Endara', dia(0), '14:00', '15:00')]), otro('30001', 'Panadería La Ronda', [vis(1, 'Diana Cárdenas', dia(0), '15:00', '16:30')]),
      otro('20200', 'Talleres Andinos', [vis(1, 'Luis Andrade', dia(0), '15:00', '15:45'), vis(2, 'Luis Andrade', dia(1), '10:00', '10:45')]), otro('20189', 'Mónica Ruiz', [vis(1, 'Marco Tapia', dia(0), '16:00', '16:45'), vis(2, 'Marco Tapia', dia(3), '08:00', '12:00')]),
      otro('20170', 'Ferretería El Sol', [vis(1, 'Diana Cárdenas', dia(1), '13:00', '14:00'), vis(2, 'Diana Cárdenas', dia(3), '13:00', '14:00')]), otro('20186', 'Pedro Alarcón', [vis(1, 'Cristian Vaca', dia(3), '10:30', '11:15')])];
    if (window.SiriusCoordEstado) window.SiriusCoordEstado.aplicarBase(c, U.nombre); // G-2c8 · DEC-238: la base calcula estado, subestado, responsable y el estado y la visita de cada riesgo
    const cfg = e[1](); if (cfg.ofertaIns) cfg.ofertaIns = cfg.ofertaIns.slice();
    const X = { usuario: U, casos: casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(INSPECTORES)),
      coordEscena: { inspector: '', motivo: '', rechazar: '', dir: '', hIni: '00:00', hFin: '00:45', disponibilidad: JSON.parse(JSON.stringify(DISP)), lugar: {}, fases: cfg } };
    casos.forEach((k) => { X.eventos[k.id] = [{ hora: '2026-10-13T09:02', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[k.id] = []; X.controles[k.id] = []; X.informes[k.id] = []; X.calificaciones[k.id] = []; });
    // G-2c3: historial del caso 50012 con la asignación, los intentos y la visita V1 (filtros Contacto, Visitas y Estado del cajón «Historial del caso»).
    X.eventos['50012'] = [{ hora: '2026-10-15T16:40', accion: 'Intento de contacto', detalle: 'Llamada · Buzón de voz · a Fernanda Prueba (contacto para la coordinación) · 0990000012 · 0:48 · «Dejé mensaje de voz»', actor: U.nombre, rol: U.rol },
      { hora: '2026-10-15T10:12', accion: 'Intento de contacto', detalle: 'Llamada · No contestó · a Fernanda Prueba (contacto para la coordinación) · 0990000012 · 0:35', actor: U.nombre, rol: U.rol }].concat(e[0] ? [{ hora: '2026-10-14T11:20', accion: 'Visita agendada', detalle: 'V1 · PRB1213 · Mauricio Endara · Quito · Zona Norte', actor: U.nombre, rol: U.rol }] : [])
      .concat([{ hora: '2026-10-13T09:05', accion: 'Caso asignado a coordinación', detalle: 'Responsable: Andrea Salazar', actor: 'SIRIUS', rol: 'Sistema' }, { hora: '2026-10-13T09:02', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]);
    return X; };
  // Base simulada: ofertarVisita y anularOferta (agendarVisita sigue en datos-cx-inspectores y datos-cx-lugar).
  // G-2c4: una visita abierta es toda la que no está Cancelada ni terminada; «Buscando inspector» es la que tiene la oferta enviada.
  const FIN = /cancel|termin|realiz|finaliz|complet/i, estV = (v) => (v.oferta && /por agendar/i.test(String(v.estado || '')) ? 'Buscando inspector' : v.estado);
  const dupVeh = (c, d) => { const L = Array.isArray(c.visitasBase) ? c.visitasBase : [], ids = Array.isArray(d.riesgos) ? d.riesgos : [];
    for (let i = 0; i < ids.length; i++) { const o = L.find((x) => x && x.n !== d.visita && !FIN.test(String(x.estado || '')) && Array.isArray(x.riesgos) && x.riesgos.indexOf(ids[i]) >= 0);
      if (o) { const r = (c.riesgos || []).find((y) => y.id === ids[i]); return (r ? r.label : ids[i]) + ' ya está en la visita V' + o.n + ' (' + estV(o) + ')'; } } return ''; };
  CC.aplicar = function (X, tipo, d) { if (!X || !X.coordEscena || !X.coordEscena.fases || ['ofertarVisita', 'anularOferta', 'agendarVisita', 'intentoContacto', 'cancelarSolicitud'].indexOf(tipo) < 0) return baseAp(X, tipo, d);
    if (tipo === 'intentoContacto' || tipo === 'cancelarSolicitud') { const c1 = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c1) return { ok: false, mensaje: 'El caso no existe en la base' }; const E1 = (X.eventos[c1.id] = X.eventos[c1.id] || []); // G-2c3 · DEC-237
      if (tipo === 'intentoContacto') { if (!d.resultado) return { ok: false, mensaje: 'Falta el resultado del intento' }; c1.intentos = (c1.intentos || []).concat([{ fecha: '2026-10-16T13:40', medio: d.medio, resultado: d.resultado, obs: d.obs || '', by: U.nombre, destino: d.destino || null, duracionSeg: d.duracionSeg || 0 }]);
        E1.unshift({ hora: '2026-10-16T13:40', accion: 'Intento de contacto', detalle: d.medio + ' · ' + d.resultado + (d.destino ? ' · a ' + d.destino.nombre + ' · ' + d.destino.numero : '') + (d.duracionSeg ? ' · ' + d.duracionSeg + ' s' : ''), actor: U.nombre, rol: U.rol }); return { ok: true, mensaje: 'Intento registrado en la base' }; }
      if (!d.motivo || String(d.detalle || '').trim().length < 10) return { ok: false, mensaje: 'Falta el motivo o el detalle de la cancelación' }; if (c1.estado === 'Cancelado') return { ok: false, mensaje: 'El caso ya está cancelado' };
      const V1c = Array.isArray(c1.visitasBase) ? c1.visitasBase : [], enc = V1c.find((x) => x && /curso|sincroniz/i.test(String(x.estado || '')) && !FIN.test(String(x.estado || '')));
      if (enc) return { ok: false, mensaje: 'Hay una visita en curso: espera a que termine o cancélala con el inspector.' }; // G-2c4 · DEC-237
      const canceladas = [], retiradas = []; V1c.forEach((x) => { if (!x || FIN.test(String(x.estado || ''))) return; canceladas.push('V' + x.n); if (x.oferta) { retiradas.push('V' + x.n); delete x.oferta; } x.estado = 'Cancelada'; x.motivoCancelacion = d.motivo; if (x.enlace && typeof x.enlace === 'object' && /vigente/i.test(String(x.enlace.estado || ''))) x.enlace.estado = 'Anulado'; });
      c1.estado = 'Cancelado'; c1.cancelacion = { motivo: d.motivo, detalle: d.detalle, por: U.nombre, hora: '2026-10-16T13:40' }; E1.unshift({ hora: '2026-10-16T13:40', accion: 'Solicitud cancelada', detalle: d.motivo + ' · ' + d.detalle + (canceladas.length ? ' · Visitas canceladas: ' + canceladas.join(', ') : '') + (retiradas.length ? ' · Ofertas retiradas: ' + retiradas.join(', ') : ''), actor: U.nombre, rol: U.rol });
      return { ok: true, mensaje: 'Solicitud cancelada en la base' }; }
    if (tipo === 'agendarVisita') { // con el reloj de demostración (viernes 16/10/2026, 13:40): valida el inspector y la hora, y guarda la visita con su lugar y la alerta de cobertura
      const c0 = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c0) return { ok: false, mensaje: 'El caso no existe en la base' };
      if (d.accion !== 'cambiarInspector') { const dm = dupVeh(c0, d); if (dm) return { ok: false, mensaje: dm }; } // G-2c4 · DEC-237: un vehículo, una sola visita abierta
      const act = (X.inspectores || []).filter((i) => /^activ/i.test(i.estado || '') && !(i.tipo === 'Agencia' && !i.agencia)).map((i) => i.nombre);
      if (d.inspector && act.indexOf(d.inspector) < 0) return { ok: false, mensaje: 'El inspector ' + d.inspector + ' no existe en la base' };
      const ini = String(d.inicio || '').slice(0, 16); if (ini && ini < '2026-10-16T13:40') return { ok: false, mensaje: 'La hora elegida ya pasó' };
      const SF = window.SiriusFecha, fin = ini && SF ? ini.slice(0, 11) + SF.aHora(SF.aMin(ini.slice(11)) + (d.minutos || 0)) : null, V0 = c0.visitasBase = c0.visitasBase || [];
      let v = V0.find((x) => x.n === d.visita); if (!v) { v = { n: d.visita || V0.length + 1, modalidad: d.modalidad || 'Presencial', estado: 'Agendada', origen: 'Coordinador', enlace: null, enlaces: [] }; V0.push(v); }
      if (d.accion === 'cambiarInspector') v.inspector = d.inspector; else Object.assign(v, { estado: 'Agendada', inicio: ini, fin: fin, inspector: d.inspector, agendadoEn: '2026-10-16T13:40', modalidad: d.modalidad || v.modalidad });
      if (Array.isArray(d.riesgos) && d.riesgos.length) v.riesgos = d.riesgos.slice(); if (d.direccion && d.direccion.direccion) v.direccion = d.direccion.direccion; if (d.lugar) v.lugar = JSON.parse(JSON.stringify(d.lugar)); v.fueraCobertura = d.fueraCobertura && d.fueraCobertura.motivo ? { motivo: d.fueraCobertura.motivo } : null; delete v.oferta; if (d.motivo) v.motivo = d.motivo; v.observaciones = d.observaciones || ''; /* G-2c3 */
      const SL = window.SiriusLugar; (X.eventos[c0.id] = X.eventos[c0.id] || []).unshift({ hora: '2026-10-16T13:40', accion: d.accion === 'cambiarInspector' ? 'Inspector cambiado' : d.accion === 'reagendar' ? 'Visita reagendada' : 'Visita agendada', detalle: 'V' + d.visita + ' · ' + (d.inspector || 'sin inspector') + (d.lugar && SL ? ' · ' + SL.texto(d.lugar) : '') + (v.fueraCobertura ? ' · Alerta de cobertura: ' + d.inspector + ' no cubre este lugar. Motivo: ' + v.fueraCobertura.motivo : ''), actor: U.nombre, rol: U.rol });
      if (window.SiriusCoordEstado) window.SiriusCoordEstado.aplicarBase(c0, U.nombre); // G-2c8 · DEC-238
      return { ok: true, mensaje: 'Visita guardada en la base' }; }
    const c = (X.casos || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c) return { ok: false, mensaje: 'El caso no existe en la base' };
    const V = c.visitasBase = c.visitasBase || [], E = (X.eventos[c.id] = X.eventos[c.id] || []), ahora = '2026-10-16T13:40';
    if (tipo === 'anularOferta') { const i = V.findIndex((x) => x.n === d.visita && x.oferta); if (i < 0) return { ok: false, mensaje: 'La oferta ya no existe' }; V.splice(i, 1); E.unshift({ hora: ahora, accion: 'Oferta anulada', detalle: 'V' + d.visita, actor: U.nombre, rol: U.rol }); if (window.SiriusCoordEstado) window.SiriusCoordEstado.aplicarBase(c, U.nombre); return { ok: true, mensaje: 'Oferta anulada' }; }
    if (!Array.isArray(d.inspectores) || !d.inspectores.length) return { ok: false, mensaje: 'Elige al menos un inspector' };
    { const dm = dupVeh(c, d); if (dm) return { ok: false, mensaje: dm }; } // G-2c4 · DEC-237
    const t = new Date(2026, 9, 16, 13 + (d.vigenciaHoras || 2), 40), z = (n) => String(n).padStart(2, '0'), vence = t.getFullYear() + '-' + z(t.getMonth() + 1) + '-' + z(t.getDate()) + 'T' + z(t.getHours()) + ':' + z(t.getMinutes());
    V.push({ n: d.visita, modalidad: d.modalidad || 'Presencial', estado: 'Buscando inspector', origen: 'Coordinador', inspector: '', enlace: null, enlaces: [], riesgos: Array.isArray(d.riesgos) ? d.riesgos.slice() : [], lugar: d.lugar ? JSON.parse(JSON.stringify(d.lugar)) : null, direccion: d.lugar ? d.lugar.direccion : '',
      oferta: { inspectores: d.inspectores.slice(), desde: d.desde, hasta: d.hasta, minutos: d.minutos, vigenciaHoras: d.vigenciaHoras, nota: d.nota || '', vence: vence } });
    E.unshift({ hora: ahora, accion: 'Oferta enviada', detalle: 'V' + d.visita + ' a ' + d.inspectores.join(', ') + ' · del ' + d.desde + ' al ' + d.hasta + (d.nota ? ' · ' + d.nota : ''), actor: U.nombre, rol: U.rol });
    if (window.SiriusCoordEstado) window.SiriusCoordEstado.aplicarBase(c, U.nombre); // G-2c8 · DEC-238
    return { ok: true, mensaje: 'Oferta enviada', ofertas: d.inspectores.length, vence: vence }; };
  CC.cxFases = { escenas: ESC, inspectores: INSPECTORES, disponibilidad: DISP, modSim: MODSIM };
})();
// Etapa G-2c5 · cxresponsableobjeto: la conexión entrega el caso 50012 en Agendado sin responsable y con el inspector como objeto { nombre, tipo, agencia } (también en su visita V1).
// La bandeja se dibuja, el responsable dice «Valeria Cevallos», los filtros de Sucursal y Responsable se abren y la consola avisa una sola vez. ?fsuc=1: otro caso con la sucursal como objeto.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxFases || !CC.cxSim) return;
  const prev = CC.cxSim.bind(CC), qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  CC.cxEscenas.cxresponsableobjeto = ['50012', 'ninguna'];
  CC.cxSim = function (escena) {
    if (escena !== 'cxresponsableobjeto') return prev(escena);
    const X = prev('coordfases'), ins = () => ({ nombre: 'Valeria Cevallos', tipo: 'agencia', agencia: 'Eurosurvey S.A.' });
    delete X.coordEscena;
    const c = (X.casos || []).find((x) => x && String(x.id) === '50012'); if (!c) return X;
    c.estado = 'Agendado'; delete c.responsable; c.inspector = ins();
    (c.riesgos || []).forEach((r) => { r.estado = 'Agendado'; }); // los tres vehículos en la visita V1: el caso queda de verdad en Agendado
    (c.visitasBase || []).forEach((v) => { if (v && /agendad/i.test(String(v.estado || ''))) { v.inspector = ins(); v.riesgos = (c.riesgos || []).map((r) => r.id); } });
    (c.riesgos || []).forEach((r) => { delete r.visita; }); c.subestado = ''; if (window.SiriusCoordEstado) { window.SiriusCoordEstado.aplicarBase(c, ''); delete c.responsable; } // G-2c8: estado y visita de cada riesgo con la regla (los tres en la V1 = Agendado, sin subestado)
    if (qp('fsuc') === '1') { const o = (X.casos || []).find((x) => x && String(x.id) !== '50012'); if (o) o.sucursal = { nombre: o.sucursal || 'Quito', cod: '1701' }; }
    return X; };
})();
// Etapa G-2c6 · coordriesgorg: caso 50012 de Ramos Generales con 2 ubicaciones; la «Bodega principal» ya está en la V1 (Agendada) y las «Oficinas» siguen por coordinar. En una visita nueva, la bodega sale
// deshabilitada como «Bodega principal · en V1» (la regla de un riesgo por visita abierta vale para todos los grupos de ramo). ?fpestana=1: la pestaña Coordinación (fila deshabilitada);
// ?fdividir=1: la V1 con las dos ubicaciones (para probar «Dividir visita»); la base simulada rechaza un duplicado con «Bodega principal ya está en la visita V1 (Agendada)».
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxFases || !CC.cxSim) return;
  const prev = CC.cxSim.bind(CC), qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  CC.cxEscenas.coordriesgorg = ['50012', 'ninguna'];
  const RG = [['Bodega principal', 'Av. Amazonas N36-152, Quito', 380000], ['Oficinas administrativas', 'Av. de los Shyris N35-20, Quito', 220000]];
  CC.cxSim = function (escena) {
    if (escena !== 'coordriesgorg') return prev(escena);
    const X = prev('coordfases'), c = (X.casos || []).find((x) => x && String(x.id) === '50012'); if (!c) return X;
    Object.assign(c, { ramo: 'Incendio y líneas aliadas', tipoRiesgo: 'Ramos Generales', placa: '', bien: 'Bodega y oficinas · Quito', estado: 'En coordinación', formularios: ['Ubicación – Ramos Generales', 'Ubicación – Ramos Generales'], sumaAsegurada: RG.map((r) => r[2]), dir: RG[0][1] });
    delete c.anios; delete c.placas;
    c.riesgos = RG.map((r, i) => ({ id: '50012-R' + (i + 1), label: r[0], detalle: r[1], cobertura: 'Incendio y líneas aliadas', estado: i === 0 ? 'Agendado' : 'En coordinación' }));
    c.riesgosBase = RG.map((r) => ({ descripcion: r[0] + ' · ' + r[1], composicion: 'Ubicación', suma: r[2], datos: { tipoRiesgo: 'Bodega', direccion: r[1], ciudad: 'Quito' } }));
    const dividir = qp('fdividir') === '1';
    (c.visitasBase || []).forEach((v) => { if (v && /agendad/i.test(String(v.estado || ''))) v.riesgos = dividir ? ['50012-R1', '50012-R2'] : ['50012-R1']; });
    if (dividir) c.riesgos.forEach((r) => { r.estado = 'Agendado'; });
    c.subestado = ''; if (window.SiriusCoordEstado) window.SiriusCoordEstado.aplicarBase(c, 'Andrea Salazar'); // G-2c8: «N de M agendados» según las ubicaciones y la V1
    X.coordEscena.fases = qp('fpestana') === '1' || dividir ? { cerrado: true } : { fase: 'contacto', riesgos: [RG[1][0]] };
    return X; };
})();
