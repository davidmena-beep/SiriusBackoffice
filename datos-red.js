// SIRIUS · Red de inspectores sin la conexión (v1.0 · provisional · etapa R-3a · DEC-262 · 19/11/2026). Demostración con la misma forma que SIRIUS_CONEXION.red:
// { listo, hoy ('AAAA-MM-DD' de Ecuador; aquí el reloj del prototipo), puedeGestionar, inspectores: [{ nombre, tipo ('Interno' | 'Agencia' | 'Independiente'), tipoInspector, agencia,
//   estado, cuenta, operacion: { modalidades [] (vacío = todas), ramos [] (vacío = todos), recibeOfertas ('red' | 'coord' | 'no'), jornada: { dias [1..7], desde, hasta }, capacidadDia, fuente, actualizado },
//   cobertura: [{ id, nivel ('todas' | 'sucursal' | 'ciudad' | 'zona'), sucursal, ciudad (código INEC), zona (id), desde, hasta, vigente, origen ('Ficha de usuario' | 'Red de inspectores'), motivo, creado, creadoPor }],
//   bloqueos: [{ id, desde, hasta, motivo, origen ('Agenda' | 'Red de inspectores') }] }], historial: [{ inspector, accion, detalle, motivo, por, hora }] }.
// Los inspectores son los del ejemplo (datos-usuarios.js); la operación, la jornada y los bloqueos de la Agenda salen de SIRIUS_AGENDA. Sofía Arteaga tiene cobertura mixta
// (sucursal Quito y Riobamba, ciudad completa); Cristian Vaca y Pedro Lasso, ninguna; Diana Cárdenas, una fila que aún no rige (zona Centro desde el 01/11); Renata Cobo, una vencida.
// aplicar(red, tipo, datos, por) es la base simulada de redAccion: la usa SiriusRed sin la conexión (en la sesión) y la conexión simulada de la escena redcx. Mismos mensajes que la base.
// redcx: se suma a SIRIUS_CX_COORD (conexión simulada) con la fila sucursal Quito de Sofía Arteaga «Viene de la ficha».
(function () {
  const HOY = '2026-10-18', POR = 'Andrea Salazar';
  const op = (modalidades, ramos, recibeOfertas, dias, desde, hasta, capacidadDia) => ({ modalidades, ramos, recibeOfertas, jornada: { dias, desde, hasta }, capacidadDia, fuente: 'Red de inspectores', actualizado: '2026-10-15T10:20' });
  let nf = 0; const fila = (nivel, o) => Object.assign({ id: 'rc-' + String(++nf).padStart(3, '0'), nivel, sucursal: '', ciudad: '', zona: '', desde: '2026-10-01', hasta: '', origen: 'Red de inspectores', motivo: '', creado: '2026-10-01T09:00', creadoPor: POR }, o);
  let nb = 0; const bloq = (desde, hasta, motivo, origen, por) => ({ id: 'rb-' + String(++nb).padStart(3, '0'), desde, hasta, motivo, origen: origen || 'Red de inspectores', por: por || '' });
  const P = ['Presencial'], PV = ['Presencial', 'Virtual guiada'], V = ['Vehículos'], RG = ['Ramos Generales'], VR = ['Vehículos', 'Ramos Generales'], LV = [1, 2, 3, 4, 5], LS = [1, 2, 3, 4, 5, 6];
  const ins = (nombre, tipo, agencia, estado, operacion, cobertura, bloqueos) => ({ nombre, tipo, tipoInspector: tipo, agencia: agencia || '', estado, cuenta: estado !== 'Invitación vencida', operacion, cobertura, bloqueos: bloqueos || [] });
  const inspectores = [
    ins('Sofía Arteaga', 'Agencia', 'andinas', 'Activo', op(PV, VR, 'red', LS, '08:00', '18:00', 6),
      [fila('sucursal', { sucursal: 'Quito', motivo: 'Atiende los casos de la sucursal Quito', creado: '2026-10-01T09:00' }), fila('ciudad', { ciudad: '0601', motivo: 'Red en Riobamba', desde: '2026-10-05', creado: '2026-10-05T11:40' })],
      [bloq('2026-12-22T00:00', '2027-01-02T23:59', 'Vacaciones', 'Red de inspectores', POR)]),
    ins('Mauricio Endara', 'Agencia', 'eurosurvey', 'Activo', op(PV, VR, 'red', LV, '08:00', '17:00', 6), [fila('ciudad', { ciudad: '1701', motivo: 'Cubre todo Quito para Eurosurvey' })]),
    ins('Diana Cárdenas', 'Agencia', 'eurosurvey', 'Activo', op(PV, V, 'coord', LV, '08:00', '16:00', 5),
      [fila('zona', { ciudad: '1701', zona: 'z1701-1', motivo: 'Zona habitual de la agencia' }), fila('zona', { ciudad: '1701', zona: 'z1701-2', desde: '2026-11-01', motivo: 'Refuerzo del centro desde noviembre', creado: '2026-10-16T15:10' })],
      [bloq('2026-10-20T08:00', '2026-10-20T12:30', 'Capacitación de la agencia', 'Agenda')]),
    ins('Luis Andrade', 'Independiente', '', 'Activo', op(P, VR, 'red', LS, '09:00', '18:00', 4),
      [fila('zona', { ciudad: '1701', zona: 'z1701-5', motivo: 'Vive en Cumbayá' }), fila('sucursal', { sucursal: 'Ambato', motivo: 'Atiende la sucursal Ambato' })]),
    ins('Marco Tapia', 'Interno', '', 'Activo', op(PV, [], 'coord', LV, '08:00', '17:00', 6), [fila('sucursal', { sucursal: 'Quito', motivo: 'Inspector interno de Quito' })],
      [bloq('2026-10-20T08:00', '2026-10-20T12:30', 'Peritaje en el juzgado de tránsito', 'Agenda'), bloq('2026-10-21T13:00', '2026-10-21T17:00', 'Capacitación', 'Agenda')]),
    ins('Paola Vinueza', 'Interno', '', 'Activo', op(PV, [], 'coord', LV, '08:30', '17:30', 6), [fila('sucursal', { sucursal: 'Guayaquil', origen: 'Ficha de usuario', motivo: 'Migrada de la ficha del usuario' })],
      [bloq('2026-10-26T00:00', '2026-10-30T23:59', 'Vacaciones', 'Agenda')]),
    ins('Cristian Vaca', 'Interno', '', 'Activo', op(PV, [], 'coord', LS, '08:00', '17:00', 5), [], [bloq('2026-10-20T08:00', '2026-10-20T12:30', 'Capacitación', 'Agenda')]),
    ins('Jorge Pazmiño', 'Agencia', 'andinas', 'Activo', op(P, [], 'coord', LV, '08:00', '17:00', 5), [fila('sucursal', { sucursal: 'Ambato', motivo: 'Sucursal de la agencia' }), fila('sucursal', { sucursal: 'Cuenca', motivo: 'Sucursal de la agencia' })]),
    ins('Pedro Lasso', 'Agencia', 'pacifico', 'Invitación vencida', op(P, RG, 'no', LV, '08:00', '17:00', null), []),
    ins('Renata Cobo', 'Independiente', '', 'Inactivo', op(P, V, 'no', LV, '08:00', '17:00', 4), [fila('sucursal', { sucursal: 'Quito', desde: '2026-03-01', hasta: '2026-09-30', motivo: 'Temporada de renovaciones' })]),
  ];
  const vig = (f, hoy) => { const d = String(f.desde || '').slice(0, 10), a = String(f.hasta || '').slice(0, 10); return (!d || d <= hoy) && (!a || hoy <= a); };
  inspectores.forEach((i) => i.cobertura.forEach((f) => { f.vigente = vig(f, HOY); }));
  const historial = [
    { inspector: 'Sofía Arteaga', accion: 'Asignó cobertura', detalle: 'Ciudad completa · Riobamba · desde 05/10/2026', motivo: 'Red en Riobamba', por: POR, hora: '2026-10-05T11:40' },
    { inspector: 'Sofía Arteaga', accion: 'Agregó un bloqueo', detalle: 'Vacaciones · del 22/12/2026 al 02/01/2027', motivo: 'Vacaciones aprobadas por la agencia', por: POR, hora: '2026-10-12T16:05' },
    { inspector: 'Diana Cárdenas', accion: 'Asignó cobertura', detalle: 'Zona · Quito · Zona Centro · desde 01/11/2026', motivo: 'Refuerzo del centro desde noviembre', por: POR, hora: '2026-10-16T15:10' },
    { inspector: 'Sofía Arteaga', accion: 'Cambió la operación', detalle: 'Capacidad por día: 5 → 6', motivo: 'La agencia sumó un vehículo para sus inspectores', por: POR, hora: '2026-10-15T10:20' },
  ];

  // ---------- Base simulada de redAccion (mismas validaciones y mensajes) ----------
  const z2 = (n) => String(n).padStart(2, '0');
  const fDia = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; };
  const fHora = (iso) => { const m = /T(\d{2}):(\d{2})/.exec(String(iso || '')); return m ? m[1] + ':' + m[2] : ''; };
  const ahora = () => { const SC = window.SiriusCompania, iso = SC && SC.ahoraIso ? SC.ahoraIso() : null; if (iso) return String(iso).slice(0, 16); const d = new Date(); return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes()); };
  const Z = () => window.SiriusZonas || null;
  const ciudadCod = (c) => { c = String(c || '').trim(); if (!c) return ''; if (/^\d{4}$/.test(c)) return c; const SZ = Z(); if (!SZ) return ''; const n = SZ.norm(c), x = SZ.ciudades().find((y) => SZ.norm(y.nombre) === n); return x ? x.cod : ''; };
  const ciudadNom = (cod) => { const SZ = Z(), x = SZ && SZ.ciudad(cod); return x ? x.nombre : cod; };
  const zonasAct = (cod) => { const SZ = Z(), z = SZ && SZ.publicadasDe ? SZ.publicadasDe(cod) : null; return z ? z.zonas.filter((x) => x.estado !== 'Inactiva') : []; };
  const zonaNom = (cod, id) => { const x = zonasAct(cod).find((y) => y.id === id); return x ? x.nombre : id; };
  const ambito = (f) => (f.nivel === 'todas' ? 'Todas las inspecciones' : f.nivel === 'sucursal' ? f.sucursal : f.nivel === 'zona' ? ciudadNom(f.ciudad) + ' · Zona ' + zonaNom(f.ciudad, f.zona) : ciudadNom(f.ciudad));
  const NIV = { todas: 'Todas', sucursal: 'Sucursal', ciudad: 'Ciudad completa', zona: 'Zona' };
  const RECIBE = { red: 'De Coordinación y de la red', coord: 'Solo de Coordinación', no: 'No recibe ofertas' };
  const DIAS = ['', 'L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const jorTxt = (j) => (j ? (j.dias || []).map((d) => DIAS[d]).join(' ') + ' · ' + j.desde + '–' + j.hasta : '—');
  const opTxt = (k, v) => (k === 'jornada' ? jorTxt(v) : k === 'recibeOfertas' ? RECIBE[v] || v : k === 'capacidadDia' ? (v == null ? 'sin límite' : String(v)) : (Array.isArray(v) && v.length ? v.join(', ') : 'todas'));
  const OPN = { modalidades: 'Modalidades', ramos: 'Ramos', recibeOfertas: 'Recibe ofertas', jornada: 'Jornada', capacidadDia: 'Capacidad por día' };
  const SUCS = () => { const E = window.SIRIUS_EJEMPLO || {}, L = ((E.catalogos || {}).sucursales || []).map((x) => (typeof x === 'string' ? x : x && (x.nombre || x.n))).filter(Boolean); return L.length ? L : ['Quito', 'Loja', 'Cuenca', 'Machala', 'Santo Domingo', 'Riobamba', 'Ambato', 'Ibarra', 'Manta', 'El Coca', 'Guayaquil']; };
  const no = (m) => ({ ok: false, mensaje: m });
  const aplicar = (red, tipo, d, por) => {
    d = d || {}; if (!red || !Array.isArray(red.inspectores)) return no('La base no tiene la red de inspectores.');
    const mot = String(d.motivo || '').trim(); if (mot.length < 10) return no('Escribe el motivo (mínimo 10 caracteres).');
    const H = red.historial = red.historial || [], hora = ahora(), hoy = String(red.hoy || HOY), quien = por || POR, reg = (inspector, accion, detalle) => H.unshift({ inspector, accion, detalle, motivo: mot, por: quien, hora });
    const insDe = (n) => red.inspectores.find((x) => x.nombre === n);
    const filaDe = (id) => { for (const i of red.inspectores) { const f = (i.cobertura || []).find((x) => x.id === id); if (f) return { i, f }; } return null; };
    const bloqDe = (id) => { for (const i of red.inspectores) { const b = (i.bloqueos || []).find((x) => x.id === id); if (b) return { i, b }; } return null; };
    if (tipo === 'asignar') {
      const L = Array.isArray(d.inspectores) ? d.inspectores.filter(Boolean) : []; if (!L.length) return no('Elige al menos un inspector.');
      const falta = L.find((n) => !insDe(n)); if (falta) return no(falta + ' no está en la red de inspectores.');
      if (!NIV[d.nivel]) return no('Elige el nivel de la cobertura.');
      const f0 = { nivel: d.nivel, sucursal: '', ciudad: '', zona: '' };
      if (d.nivel === 'sucursal') { if (!d.sucursal) return no('Elige la sucursal.'); if (SUCS().indexOf(d.sucursal) < 0) return no('La sucursal ' + d.sucursal + ' no está en el catálogo.'); f0.sucursal = d.sucursal; }
      if (d.nivel === 'ciudad' || d.nivel === 'zona') { const c = ciudadCod(d.ciudad); if (!c) return no(d.ciudad ? 'La ciudad ' + d.ciudad + ' no está en el catálogo.' : 'Elige la ciudad.'); f0.ciudad = c; }
      if (d.nivel === 'zona') { if (!d.zona) return no('Elige la zona.'); if (!zonasAct(f0.ciudad).some((z) => z.id === d.zona)) return no('La zona no está activa en ' + ciudadNom(f0.ciudad) + '.'); f0.zona = d.zona; }
      const desde = String(d.desde || hoy).slice(0, 10), hasta = String(d.hasta || '').slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(desde) || (hasta && !/^\d{4}-\d{2}-\d{2}$/.test(hasta))) return no('Las fechas deben tener la forma AAAA-MM-DD.');
      if (hasta && hasta < desde) return no('La fecha «hasta» no puede ser anterior a «desde».');
      const igual = (f) => f.nivel === f0.nivel && String(f.sucursal || '') === f0.sucursal && String(f.ciudad || '') === f0.ciudad && String(f.zona || '') === f0.zona && f.vigente;
      const rep = L.find((n) => (insDe(n).cobertura || []).some(igual)); if (rep) return no(rep + ' ya tiene esa cobertura vigente.');
      L.forEach((n) => { const f = Object.assign({ id: 'rc-' + Math.random().toString(36).slice(2, 8) }, f0, { desde, hasta, origen: 'Red de inspectores', motivo: mot, creado: hora, creadoPor: quien }); f.vigente = vig(f, hoy); (insDe(n).cobertura = insDe(n).cobertura || []).push(f);
        reg(n, 'Asignó cobertura', NIV[f.nivel] + ' · ' + ambito(f) + ' · desde ' + fDia(desde) + (hasta ? ' hasta ' + fDia(hasta) : '')); });
      return { ok: true, mensaje: L.length === 1 ? 'Cobertura asignada a ' + L[0] + '.' : 'Cobertura asignada a ' + L.length + ' inspectores.' };
    }
    if (tipo === 'retirar') { const x = filaDe(d.id); if (!x) return no('La cobertura no existe.'); if (x.f.origen === 'Ficha de usuario') return no('Esta cobertura viene de la ficha del usuario: se cambia allí.');
      x.i.cobertura = x.i.cobertura.filter((f) => f !== x.f); reg(x.i.nombre, 'Quitó cobertura', NIV[x.f.nivel] + ' · ' + ambito(x.f)); return { ok: true, mensaje: 'Cobertura quitada a ' + x.i.nombre + '.' }; }
    if (tipo === 'operacion') { const i = insDe(d.inspector); if (!i) return no('El inspector no está en la red de inspectores.'); const ch = d.cambios || {}, o = i.operacion = i.operacion || {}, ks = Object.keys(ch).filter((k) => OPN[k]);
      if (!ks.length) return no('No hay cambios para guardar.');
      if (ch.jornada) { const j = ch.jornada; if (!Array.isArray(j.dias) || !j.dias.length || !/^\d{2}:\d{2}$/.test(j.desde || '') || !/^\d{2}:\d{2}$/.test(j.hasta || '') || j.hasta <= j.desde) return no('La jornada necesita al menos un día y «hasta» después de «desde».'); }
      if (ks.indexOf('capacidadDia') >= 0 && ch.capacidadDia != null && (!Number.isInteger(ch.capacidadDia) || ch.capacidadDia < 1 || ch.capacidadDia > 20)) return no('La capacidad por día debe ser un número entero de 1 a 20.');
      if (ch.recibeOfertas && !RECIBE[ch.recibeOfertas]) return no('Elige si recibe ofertas.');
      const det = ks.map((k) => OPN[k] + ': ' + opTxt(k, o[k]) + ' → ' + opTxt(k, ch[k])); ks.forEach((k) => { o[k] = JSON.parse(JSON.stringify(ch[k] === undefined ? null : ch[k])); }); o.fuente = 'Red de inspectores'; o.actualizado = hora;
      reg(i.nombre, 'Cambió la operación', det.join(' · ')); return { ok: true, mensaje: 'Operación de ' + i.nombre + ' guardada.' }; }
    if (tipo === 'bloquear') { const i = insDe(d.inspector); if (!i) return no('El inspector no está en la red de inspectores.'); const a = String(d.desde || ''), b = String(d.hasta || '');
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(a) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(b)) return no('Indica desde y hasta del bloqueo (fecha y hora).'); if (b <= a) return no('«Hasta» debe ser posterior a «desde».');
      const bl = { id: 'rb-' + Math.random().toString(36).slice(2, 8), desde: a.slice(0, 16), hasta: b.slice(0, 16), motivo: mot, origen: 'Red de inspectores', por: quien }; (i.bloqueos = i.bloqueos || []).push(bl);
      reg(i.nombre, 'Agregó un bloqueo', mot + ' · del ' + fDia(a) + ' ' + fHora(a) + ' al ' + fDia(b) + ' ' + fHora(b)); return { ok: true, mensaje: 'Bloqueo agregado a ' + i.nombre + '.' }; }
    if (tipo === 'desbloquear') { const x = bloqDe(d.id); if (!x) return no('El bloqueo no existe.'); if (x.b.origen === 'Agenda') return no('Este bloqueo viene de la Agenda: se cambia allí.');
      x.i.bloqueos = x.i.bloqueos.filter((b) => b !== x.b); reg(x.i.nombre, 'Quitó un bloqueo', x.b.motivo + ' · del ' + fDia(x.b.desde) + ' al ' + fDia(x.b.hasta)); return { ok: true, mensaje: 'Bloqueo quitado a ' + x.i.nombre + '.' }; }
    return no('Acción desconocida: ' + tipo);
  };
  window.SIRIUS_RED = { version: '1.0', listo: true, hoy: HOY, puedeGestionar: true, inspectores, historial, aplicar, ambito, NIVELES: NIV, RECIBE };

  // ---------- Escena redcx: conexión simulada (SIRIUS_CX_COORD) con una fila «Viene de la ficha» ----------
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxEscenas) return;
  const baseCC = CC.cxSim.bind(CC); CC.cxEscenas.redcx = ['', 'ninguna'];
  CC.cxSim = function (escena) { if (escena !== 'redcx') return baseCC(escena);
    const red = JSON.parse(JSON.stringify({ listo: true, hoy: HOY, puedeGestionar: true, inspectores, historial })); const s = red.inspectores.find((x) => x.nombre === 'Sofía Arteaga'); if (s) Object.assign(s.cobertura[0], { origen: 'Ficha de usuario', motivo: 'Migrada de la ficha del usuario' });
    return { usuario: { nombre: POR, email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] }, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, red }; };
  CC.redAccion = function (X, tipo, d) { return Promise.resolve(aplicar(X && X.red, tipo, d, ((X && X.usuario) || {}).nombre)); };
})();
