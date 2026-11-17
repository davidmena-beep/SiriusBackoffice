// SIRIUS · Garantías y notificaciones con la conexión simulada (v1.0 · provisional · etapa P-6g-2 · 16/11/2026)
// Escenas cxgarantiaspropuestas, cxgarantiacumplir, cxgarantiaampliacion, cxgarantiacierre, cxnotificaciones y cxgarantiaserror: arman SIRIUS_CONEXION
// con casos de la base (50040 a 50044, ninguno de ejemplo), garantias[] y notificacionesEnvio[] con la forma del contrato (SQL 55), y la base simulada
// aplica las 8 acciones con SiriusGarantiasBase.ops (las mismas reglas de la pantalla). ?cxok=0 hace que la base responda { ok: false } a todo.
// cxRespaldos (solo de la simulación): el respaldo que el usuario ya adjuntó en pantalla y aún no envió con cumplirGarantia.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const clon = (x) => JSON.parse(JSON.stringify(x));
  const ESC = ['cxgarantiaspropuestas', 'cxgarantiacumplir', 'cxgarantiaampliacion', 'cxgarantiacierre', 'cxnotificaciones', 'cxgarantiaserror'];
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const hoy = () => { const GB = window.SiriusGarantiasBase; return GB ? GB.hoy() : '2026-10-18'; }, mas = (n) => { const GB = window.SiriusGarantiasBase; return GB ? GB.sumar(hoy(), n) : hoy(); };
  const VL = 'Verónica Lema', SO = 'Santiago Ortiz';
  const USR = {
    cxgarantiaspropuestas: { nombre: VL, email: 'veronica.lema.ejecutiva@gmail.com', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones', 'Suscriptor'] },
    cxgarantiacumplir: { nombre: SO, email: 'santiago.ortiz.comercial@gmail.com', rol: 'Ejecutivo comercial', roles: ['Ejecutivo comercial'] },
    cxgarantiaampliacion: { nombre: VL, email: 'veronica.lema.ejecutiva@gmail.com', rol: 'Ejecutivo comercial', roles: ['Ejecutivo comercial', 'Ejecutivo de inspecciones'] },
    cxgarantiacierre: { nombre: SO, email: 'santiago.ortiz.comercial@gmail.com', rol: 'Ejecutivo comercial', roles: ['Ejecutivo comercial'] },
    cxnotificaciones: { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] },
    cxgarantiaserror: { nombre: SO, email: 'santiago.ortiz.comercial@gmail.com', rol: 'Ejecutivo comercial', roles: ['Ejecutivo comercial'] },
  };
  const caso = (id, estado, extra) => Object.assign({ id, orden: 'EMI-2026-120' + id.slice(-3), origen: 'BPM de Emisión', ramo: 'Incendio y líneas aliadas', ramos: ['Incendio y líneas aliadas'], tipoRiesgo: 'Ramos Generales', broker: 'Seguros Pacífico Brokers',
    asegurado: 'Comercial de prueba ' + id, ident: '17920' + id + '001', placa: '', bien: 'Bodega · Quito', fecha: '2026-10-05', registrado: '2026-10-05T10:00', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado, responsable: VL,
    comercial: SO, califUser: VL, flujoVersion: 2, aps: 'Lucía Vera', apsMail: 'lucia.vera@pacificobrokers.ec', dir: 'Av. de los Shyris N35-52 y Portugal, Quito', contacto: { nombre: 'Marcela Paredes', cargo: 'Administradora', cel: '0991234040', correo: 'mparedes@correo.ec' },
    solicitud: { formularios: ['Ubicación – Ramos Generales'] }, riesgos: [{ id: id + '-R1', label: 'Bodega principal', detalle: 'Av. de los Shyris N35-52', cobertura: 'Incendio y líneas aliadas', estado }], visitasBase: [] }, extra || {});
  const G = (caso, n, codigo, titulo, texto, estado, extra) => Object.assign({ id: 'GAR-' + caso + '-' + n, caso, riesgo: caso + '-R1', codigo, titulo, texto, ramo: 'Incendio y líneas aliadas', prioridad: 'Media', plazoDias: null, vence: null, estado: estado || 'Propuesta', origen: 'Inspector',
    respaldo: null, cumplidaEn: null, ampliaciones: [], endosos: [], historial: [{ fecha: '2026-10-08T11:00', que: 'Recomendada en el informe', por: 'Mauricio Endara' }] }, extra || {});
  const pend = (plazo, vence, extra) => Object.assign({ plazoDias: plazo, vence, endosos: [{ tipo: 'inclusion', estado: 'Aplicado', fecha: '2026-10-10T09:00', motivo: '', actualizado: '2026-10-11T08:30' }], historial: [{ fecha: '2026-10-08T11:00', que: 'Recomendada en el informe', por: 'Mauricio Endara' }, { fecha: '2026-10-10T09:00', que: 'Pendiente', por: VL }] }, extra || {});
  const datos = (escena) => { const fv = q('fvista');
    const casos = [caso('50040', 'Pendiente calificación', { asegurado: 'Ferretería La Unión Cía. Ltda.', bien: 'Bodega y local · Av. Maldonado, Quito', califUser: '' }),
      caso('50041', 'Emitida', { asegurado: 'Distribuidora El Ejido S.A.', emi: { poliza: 'POL-2026-120041' } }),
      caso('50042', 'Emitida', { asegurado: 'Textiles Andinos Cía. Ltda.', emi: { poliza: 'POL-2026-120042' }, comercial: escena === 'cxgarantiaampliacion' ? VL : SO }),
      caso('50043', 'Emitida', { asegurado: 'Panificadora San Blas S.A.', emi: { poliza: 'POL-2026-120043' } }),
      caso('50044', 'Inspeccionado', { asegurado: 'Imprenta Gráficas del Norte', orden: '' })];
    const garantias = [
      // 50040: 3 recomendaciones del inspector, aún «Propuesta» (se definen al calificar).
      G('50040', 1, 'GAR-INC-02', 'Extintores vigentes y recargados', 'Recargar los 4 extintores PQS de la bodega'),
      G('50040', 2, 'GAR-INC-04', 'Detectores de humo', 'Instalar detectores en la bodega y en el mezanine'),
      G('50040', 3, 'GAR-ROB-05', 'Alarma contra robo', 'Alarma con sensores en los 2 accesos'),
      // 50041: dos pendientes; la de extintores tiene la foto ya adjunta (cxRespaldos).
      G('50041', 1, 'GAR-INC-02', 'Extintores vigentes y recargados', 'Recarga anual con etiqueta del proveedor', 'Pendiente', pend(30, mas(12))),
      G('50041', 2, 'GAR-INC-04', 'Detectores de humo', 'En la bodega y en la oficina', 'Pendiente', pend(60, mas(40))),
      // 50042: guardianía por vencer (5 días) y una cumplida; ?fvista=solicitada: la ampliación ya pedida, por aprobar.
      G('50042', 1, 'GAR-ROB-01', 'Guardianía', 'Guardia en horario nocturno', fv === 'solicitada' ? 'En ampliación' : 'Pendiente', pend(30, mas(5), fv === 'solicitada' ? { ampliaciones: [{ solicitada: hoy() + 'T09:15', nuevoVence: mas(20), motivo: 'La empresa de seguridad empieza el 1 del próximo mes', estado: 'Solicitada', resolvio: '', por: VL }] } : {})),
      G('50042', 2, 'GAR-INC-02', 'Extintores vigentes y recargados', 'Recarga anual', 'Cumplida', pend(30, '2026-10-30', { cumplidaEn: '2026-10-15T10:20', respaldo: { tipo: 'documento', ruta: 'factura-recarga-extintores.pdf', nota: 'Factura y etiqueta de recarga de octubre' }, historial: [{ fecha: '2026-10-10T09:00', que: 'Pendiente', por: VL }, { fecha: '2026-10-15T10:20', que: 'Cumplida', por: VL, motivo: 'Factura y etiqueta de recarga de octubre' }] })),
      // 50043: sin pendientes (una cumplida y una retirada); ?fvista=pendiente: la de detectores sigue pendiente.
      G('50043', 1, 'GAR-INC-02', 'Extintores vigentes y recargados', 'Recarga anual', 'Cumplida', pend(30, '2026-11-02', { cumplidaEn: '2026-10-20T16:05', respaldo: { tipo: 'casoHijo', ruta: '50043-G1', nota: 'Verificado en la reinspección' } })),
      G('50043', 2, 'GAR-INC-04', 'Detectores de humo', 'En la zona de hornos', fv === 'pendiente' ? 'Pendiente' : 'Retirada', pend(60, mas(25), fv === 'pendiente' ? {} : { historial: [{ fecha: '2026-10-08T11:00', que: 'Recomendada en el informe', por: 'Mauricio Endara' }, { fecha: '2026-10-22T09:40', que: 'Retirada', por: VL, motivo: 'La zona de hornos ya tiene detección térmica' }] })),
      // 50044: una pendiente sin respaldo (cumplir sin respaldo → { ok: false }).
      G('50044', 1, 'GAR-INC-01', 'Permiso de bomberos vigente del año en curso', 'Permiso 2026', 'Pendiente', pend(45, mas(3))),
      // 50045 no existe: vencida de un caso del dashboard no; 50041-3 vencida para los recordatorios.
      G('50041', 3, 'GAR-ROB-05', 'Alarma contra robo', 'Con monitoreo', 'Pendiente', pend(30, mas(-2)))];
    const envio = (id, caso, regla, canal, destinatario, estado, fecha, error, contenido) => ({ id, caso, regla, canal, destinatario, estado, contenido: contenido || '', fecha, error: error || '' });
    const notificacionesEnvio = [
      envio('ENV-9001', '50042', 'R02', 'correo', 'Lucía Vera (APS)', 'Leído', hoy() + 'T08:00', '', 'Faltan 5 días para la garantía Guardianía del caso 50042'),
      envio('ENV-9002', '50042', 'R02', 'whatsapp', 'Marcela Paredes', 'Fallido', hoy() + 'T08:00', 'El número 0991234040 no tiene WhatsApp', 'Faltan 5 días para cumplir las garantías de su póliza POL-2026-120042'),
      envio('ENV-9003', '50042', 'R02', 'app', SO, 'Entregado', hoy() + 'T08:00', '', 'Faltan 5 días: garantías del caso 50042'),
      envio('ENV-9004', '50041', 'R04', 'correo', 'Lucía Vera (APS)', 'Enviado', hoy() + 'T08:01', '', 'Garantía vencida: Alarma contra robo (caso 50041)'),
      envio('ENV-9005', '50041', 'R04', 'app', SO, 'Leído', hoy() + 'T08:01', '', 'Garantía vencida del caso 50041'),
      envio('ENV-9006', '50044', 'R03', 'sms', 'Marcela Paredes', 'Omitido', hoy() + 'T08:02', 'Sin consentimiento para SMS', 'Mañana vence el permiso de bomberos'),
      envio('ENV-9007', '50043', 'R12', 'correo', 'Marcela Paredes', 'Entregado', '2026-10-21T10:00', '', 'Encuesta de satisfacción')];
    const notificaciones = [{ id: 'cxn1', aud: '*', kind: 'exc', text: 'La garantía Alarma contra robo del caso 50041 venció', caseId: '50041', ts: hoy() + 'T08:01', read: false },
      { id: 'cxn2', aud: '*', kind: 'adj', text: 'Faltan 5 días para la garantía Guardianía del caso 50042', caseId: '50042', ts: hoy() + 'T08:00', read: false }];
    const X = { usuario: clon(USR[escena]), casos, detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: [], garantias, notificacionesEnvio, notificaciones,
      cxRespaldos: escena === 'cxgarantiacumplir' ? { 'GAR-50041-1': [{ name: 'foto-extintores-recargados.jpg', by: SO, at: '18/10/26 · 09:10', ts: hoy() + 'T09:10' }] } : {} };
    casos.forEach((c) => { X.eventos[c.id] = [{ hora: c.registrado, accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }]; X.evidencias[c.id] = []; X.controles[c.id] = []; X.informes[c.id] = []; X.calificaciones[c.id] = []; });
    return X; };
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar ? CC.aplicar.bind(CC) : null;
  CC.cxSim = function (escena) { return ESC.indexOf(escena) >= 0 ? datos(escena) : baseCC(escena); };
  // Base simulada: las 8 acciones con las reglas de SiriusGarantiasBase sobre garantias[] y notificacionesEnvio[] de SIRIUS_CONEXION.
  const TIPOS = ['definirGarantias', 'cumplirGarantia', 'solicitarAmpliacion', 'resolverAmpliacion', 'retirarGarantia', 'cerrarSeguimiento', 'marcarEndoso', 'reenviarNotificacion'];
  CC.aplicar = function (X, tipo, d) { if (TIPOS.indexOf(tipo) < 0 || !X || !Array.isArray(X.garantias)) return baseAp ? baseAp(X, tipo, d) : null; const GB = window.SiriusGarantiasBase; if (!GB) return { ok: false, mensaje: 'Sin el módulo de garantías' };
    try { window.__sirGbUltima = (window.__sirGbUltima || []).concat([clon({ tipo, datos: d })]); } catch (er) { /* registro de prueba */ }
    const u = X.usuario || {}, ctx = { por: u.nombre || '', rol: (window.__sirRolActivo || u.rol || ''), fecha: GB.ahoraIso() };
    if (tipo === 'reenviarNotificacion') { const r = GB.opsEnvio(X.notificacionesEnvio, d, ctx); return r.ok ? Object.assign(r, { mensaje: r.mensaje + ' desde la base' }) : r; }
    const T = clon(X.garantias).map(GB.norm), r = GB.ops(T, tipo, clon(d || {}), ctx); if (r.ok) X.garantias.splice(0, X.garantias.length, ...T);
    return r.ok ? { ok: true, mensaje: r.mensaje + ' en la base' } : r; };
  CC.cxGarantias = { escenas: ESC };
})();
