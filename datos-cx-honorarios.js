// SIRIUS · Honorarios y liquidaciones de la base, con la conexión simulada (v1.0 · provisional · etapa P-6g-1 · 18/10/2026).
// Escenas: cxhonorarios (Finanzas aprueba y rechaza honorarios «Por aprobar»), cxliquidaciongen (generar la de Eurosurvey del período actual, quitar
// un honorario, cerrar, aprobar y pagar), cxliquidacionindep (la de Luis Andrade, inspector independiente, por su cédula; ?fvista=inspector: como Luis),
// cxliquidacionagencia (Finanzas de agencia de Eurosurvey; ?fvista=inspector: Mauricio Endara, inspector de agencia) y cxliquidacionerror (la base
// rechaza cerrar una liquidación sin honorarios; ?fvista=anular: anular una liquidación cerrada). Período actual = mes de hoy en Ecuador (DEC-230).
// Forma del contrato: ver sirius-honorarios-base.js. Se suma a SIRIUS_CX_COORD (datos-cx-coordinacion.js): las mismas escenas simuladas (cxSimBoot),
// que se limpian al cambiar de escena. Agencias y personas salen de datos-cx-usuarios.js (identificación y RUC de prueba, DEC-214).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxUsuarios) return;
  const U0 = CC.cxUsuarios, clon = (x) => JSON.parse(JSON.stringify(x));
  const hoy = () => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  const prev = (p) => { let y = +p.slice(0, 4), m = +p.slice(5, 7) - 1; if (!m) { m = 12; y--; } return y + '-' + String(m).padStart(2, '0'); };
  const EUR = '1791456320001', AND = '1792788441001';
  const FIN = { nombre: 'Mónica Ríos', tipoIdentificacion: 'Cédula', identificacion: '1709991309', email: 'monica.rios.finanzas@gmail.com', rol: 'Finanzas', roles: ['Finanzas'], tipo: 'Interno', agencia: null, estado: 'Activo', vinculado: true };
  const FAG = { nombre: 'Paola Herrera', tipoIdentificacion: 'Cédula', identificacion: '1709991317', email: 'paola.herrera.finanzas+eurosurvey@gmail.com', rol: 'Finanzas de agencia', roles: ['Finanzas de agencia'], tipo: 'Agencia', agencia: 'Eurosurvey S.A.', agenciaRuc: EUR, estado: 'Activo', vinculado: true };
  const INSPECTORES = [{ nombre: 'Valeria Cevallos', tipoIdentificacion: 'Cédula', identificacion: '0909991259', tipo: 'Agencia', agencia: 'Eurosurvey S.A.', agenciaRuc: EUR, estado: 'Activo' }, { nombre: 'Carlos Mora', tipoIdentificacion: 'Cédula', identificacion: '1709991275', tipo: 'Independiente', estado: 'Inactivo' }];
  const usuario = (email) => clon(U0.usuarios.find((u) => u.email === email));
  // Honorarios del período actual (P) y del anterior (Q): una visita terminada = un honorario (monto según la tarifa).
  function datos() { const H = hoy(), P = H.slice(0, 7), Q = prev(P), dd = +H.slice(8, 10), dia = (n) => P + '-' + String(Math.min(n, dd)).padStart(2, '0');
    const ME = { inspector: 'Mauricio Endara', inspectorId: '0909991135', agencia: 'Eurosurvey S.A.', agenciaRuc: EUR }, VC = { inspector: 'Valeria Cevallos', inspectorId: '0909991259', agencia: 'Eurosurvey S.A.', agenciaRuc: EUR };
    const SA = { inspector: 'Sofía Arteaga', inspectorId: '1709991143', agencia: 'Inspecciones Andinas Cía. Ltda.', agenciaRuc: AND }, LA = { inspector: 'Luis Andrade', inspectorId: '1709991119', agencia: '', agenciaRuc: '' };
    const h = (id, caso, visita, fecha, quien, monto, estado, extra) => Object.assign({ id, caso, visita, fecha, monto, moneda: 'USD', concepto: 'Inspección presencial de vehículo', estado, motivo: '', liquidacionId: '' }, quien, extra || {});
    const hon = [
      h('HON-6101', '60101', 1, dia(3), ME, 28, 'Por aprobar'), h('HON-6102', '60102', 1, dia(4), ME, 28, 'Por aprobar'), h('HON-6103', '60103', 1, dia(5), VC, 32.5, 'Por aprobar'),
      h('HON-6104', '60104', 1, dia(6), VC, 32.5, 'Aprobado'), h('HON-6105', '60105', 2, dia(7), ME, 28, 'Aprobado'), h('HON-6106', '60106', 1, dia(8), VC, 14, 'Aprobado', { concepto: 'Visita fallida (cliente ausente)' }),
      h('HON-6107', '60107', 1, dia(6), SA, 30, 'Aprobado'),
      h('HON-6108', '60108', 1, dia(4), LA, 25, 'Aprobado'), h('HON-6109', '60109', 1, dia(9), LA, 25, 'Aprobado'), h('HON-6110', '60110', 1, dia(10), LA, 25, 'Por aprobar'),
      h('HON-6111', '60111', 1, dia(5), LA, 40, 'Rechazado', { motivo: 'El monto no corresponde a la tarifa de Quito.' }),
      h('HON-5901', '59901', 1, Q + '-14', ME, 28, 'Pagado', { liquidacionId: 'LIQ-' + Q + '-EUR' }), h('HON-5902', '59902', 1, Q + '-21', VC, 32.5, 'Pagado', { liquidacionId: 'LIQ-' + Q + '-EUR' }),
      h('HON-5903', '59903', 1, Q + '-16', LA, 25, 'Pagado', { liquidacionId: 'LIQ-' + Q + '-LAN' })];
    const liq = [
      { id: 'LIQ-' + Q + '-EUR', periodo: Q, beneficiario: { tipo: 'agencia', nombre: 'Eurosurvey S.A.', identificacion: EUR }, estado: 'Pagada', total: 60.5, honorarios: ['HON-5901', 'HON-5902'], pago: { fecha: H.slice(0, 7) + '-02', referencia: 'TRF-2026-11833', cuenta: 'Banco Pichincha · Corriente ···4410' }, historial: [{ fecha: Q + '-30T17:10', por: 'Mónica Ríos', que: 'Pagada' }] },
      { id: 'LIQ-' + Q + '-LAN', periodo: Q, beneficiario: { tipo: 'inspector', nombre: 'Luis Andrade', identificacion: '1709991119' }, estado: 'Pagada', total: 25, honorarios: ['HON-5903'], pago: { fecha: H.slice(0, 7) + '-02', referencia: 'TRF-2026-11834', cuenta: 'Produbanco · Ahorros ···2291' }, historial: [{ fecha: Q + '-30T17:12', por: 'Mónica Ríos', que: 'Pagada' }] }];
    return { P, Q, hon, liq }; }
  const liqDe = (D, id, b, ids, estado) => { const l = { id, periodo: D.P, beneficiario: b, estado, total: 0, honorarios: ids, pago: null, historial: [{ fecha: D.P + '-12T10:00', por: 'Mónica Ríos', que: 'Generada con ' + ids.length + (ids.length === 1 ? ' honorario aprobado' : ' honorarios aprobados') }] };
    ids.forEach((x) => { const h = D.hon.find((y) => y.id === x); h.estado = 'Liquidado'; h.liquidacionId = id; l.total = Math.round((l.total + h.monto) * 100) / 100; }); if (estado === 'Cerrada') l.historial.push({ fecha: D.P + '-13T09:30', por: 'Mónica Ríos', que: 'Cerrada: total fijo' }); D.liq.push(l); return l; };
  const q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  // escena → { usuario, honorariosEscena { tab, det, form, sel } }
  const ESC = { cxhonorarios: 1, cxliquidaciongen: 1, cxliquidacionindep: 1, cxliquidacionagencia: 1, cxliquidacionerror: 1 };
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  CC.cxSim = function (escena) { if (!ESC[escena]) return baseCC(escena);
    const D = datos(), v = q('fvista'); let u = clon(FIN), he = { tab: 'Honorarios' };
    if (escena === 'cxliquidaciongen') he = { tab: 'Liquidaciones', gen: { periodo: D.P, benef: 'agencia|' + EUR } };
    if (escena === 'cxliquidacionindep') { const l = liqDe(D, 'LIQ-' + D.P + '-LAN', { tipo: 'inspector', nombre: 'Luis Andrade', identificacion: '1709991119' }, ['HON-6108', 'HON-6109'], 'Abierta'); he = { tab: 'Liquidaciones', det: l.id };
      if (v === 'inspector') u = usuario('luis.andrade.independiente@gmail.com'); }
    if (escena === 'cxliquidacionagencia') { liqDe(D, 'LIQ-' + D.P + '-EUR', { tipo: 'agencia', nombre: 'Eurosurvey S.A.', identificacion: EUR }, ['HON-6104', 'HON-6105', 'HON-6106'], 'Cerrada'); liqDe(D, 'LIQ-' + D.P + '-LAN', { tipo: 'inspector', nombre: 'Luis Andrade', identificacion: '1709991119' }, ['HON-6108'], 'Abierta');
      u = v === 'inspector' ? usuario('mauricio.endara.inspector+eurosurvey@gmail.com') : clon(FAG); he = { tab: v === 'inspector' ? 'Mis honorarios' : 'Honorarios' }; }
    if (escena === 'cxliquidacionerror') { const vac = liqDe(D, 'LIQ-' + D.P + '-AND', { tipo: 'agencia', nombre: 'Inspecciones Andinas Cía. Ltda.', identificacion: AND }, [], 'Abierta'); vac.historial = [{ fecha: D.P + '-12T10:00', por: 'Mónica Ríos', que: 'Generada sin honorarios: Sofía Arteaga aún no tenía honorarios aprobados' }];
      const cer = liqDe(D, 'LIQ-' + D.P + '-EUR', { tipo: 'agencia', nombre: 'Eurosurvey S.A.', identificacion: EUR }, ['HON-6104', 'HON-6105'], 'Cerrada');
      he = v === 'anular' ? { tab: 'Liquidaciones', det: cer.id, form: { k: 'anular', motivo: 'Faltó incluir la visita fallida del caso 60106; se genera de nuevo.' } } : { tab: 'Liquidaciones', det: vac.id }; }
    const usuarios = clon(U0.usuarios).concat([clon(FIN), clon(FAG)]);
    return { usuario: u, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, usuarios, agencias: clon(U0.agencias), inspectores: clon(INSPECTORES), honorarios: D.hon, liquidaciones: D.liq, honorariosEscena: he }; };
  // Base simulada: aplica cada acción sobre honorarios[] y liquidaciones[] y responde { ok, mensaje } (generarLiquidacion también { id }).
  const TIPOS = ['aprobarHonorarios', 'rechazarHonorario', 'corregirHonorario', 'generarLiquidacion', 'editarLiquidacion', 'cerrarLiquidacion', 'aprobarLiquidacion', 'pagarLiquidacion', 'anularLiquidacion'];
  CC.aplicar = function (X, tipo, d) { if (TIPOS.indexOf(tipo) < 0 || !X || !Array.isArray(X.honorarios)) return baseAp(X, tipo, d);
    d = d || {}; const H = X.honorarios, L = X.liquidaciones = Array.isArray(X.liquidaciones) ? X.liquidaciones : [], hon = (id) => H.find((x) => x.id === id), liq = (id) => L.find((x) => x.id === id);
    const tot = (l) => { l.total = Math.round(l.honorarios.reduce((s, x) => s + ((hon(x) || {}).monto || 0), 0) * 100) / 100; };
    if (tipo === 'aprobarHonorarios') { const xs = (d.ids || []).map(hon); if (!xs.length || xs.some((x) => !x || x.estado !== 'Por aprobar')) return { ok: false, mensaje: 'Algún honorario ya no está «Por aprobar»' }; xs.forEach((x) => { x.estado = 'Aprobado'; }); return { ok: true, mensaje: xs.length + ' honorarios aprobados en la base' }; }
    if (tipo === 'rechazarHonorario') { const x = hon(d.id); if (!x || x.estado !== 'Por aprobar') return { ok: false, mensaje: 'El honorario ya no está «Por aprobar»' }; x.estado = 'Rechazado'; x.motivo = d.motivo; return { ok: true, mensaje: 'Honorario rechazado en la base' }; }
    if (tipo === 'corregirHonorario') { const x = hon(d.id); if (!x || x.estado !== 'Rechazado') return { ok: false, mensaje: 'El honorario no está «Rechazado»' }; x.monto = d.monto; x.estado = 'Por aprobar'; x.motivo = d.motivo; return { ok: true, mensaje: 'Honorario corregido: vuelve a «Por aprobar»' }; }
    if (tipo === 'generarLiquidacion') { const b = d.beneficiario || {}, per = d.periodo, cod = b.tipo === 'agencia' ? (b.identificacion === EUR ? 'EUR' : b.identificacion === AND ? 'AND' : b.identificacion.slice(0, 4)) : 'I' + String(b.identificacion).slice(-4), id = 'LIQ-' + per + '-' + cod;
      if (L.some((l) => l.periodo === per && l.estado !== 'Anulada' && (l.beneficiario || {}).identificacion === b.identificacion)) return { ok: false, mensaje: 'Ya hay una liquidación de ese beneficiario en ' + per };
      const xs = H.filter((x) => x.estado === 'Aprobado' && String(x.fecha).slice(0, 7) === per && (b.tipo === 'agencia' ? x.agenciaRuc === b.identificacion : !x.agenciaRuc && x.inspectorId === b.identificacion));
      xs.forEach((x) => { x.estado = 'Liquidado'; x.liquidacionId = id; }); const l = { id, periodo: per, beneficiario: { tipo: b.tipo, identificacion: b.identificacion, nombre: '' }, estado: 'Abierta', total: 0, honorarios: xs.map((x) => x.id), pago: null, historial: [] }; tot(l); L.push(l);
      return { ok: true, mensaje: 'Liquidación generada en la base', id }; }
    const l = liq(d.id); if (!l) return { ok: false, mensaje: 'La liquidación no existe en la base' };
    if (tipo === 'editarLiquidacion') { if (l.estado !== 'Abierta') return { ok: false, mensaje: 'La liquidación no está «Abierta»' }; (d.quitar || []).forEach((x) => { const h = hon(x); if (h) { h.estado = 'Aprobado'; h.liquidacionId = ''; } }); (d.agregar || []).forEach((x) => { const h = hon(x); if (h) { h.estado = 'Liquidado'; h.liquidacionId = l.id; } });
      l.honorarios = l.honorarios.filter((x) => (d.quitar || []).indexOf(x) < 0).concat(d.agregar || []); tot(l); return { ok: true, mensaje: 'Liquidación actualizada en la base' }; }
    if (tipo === 'cerrarLiquidacion') { if (l.estado !== 'Abierta') return { ok: false, mensaje: 'La liquidación no está «Abierta»' }; if (!l.honorarios.length) return { ok: false, mensaje: 'La liquidación no tiene honorarios: no se puede cerrar' }; l.estado = 'Cerrada'; return { ok: true, mensaje: 'Liquidación cerrada en la base' }; }
    if (tipo === 'aprobarLiquidacion') { if (l.estado !== 'Cerrada') return { ok: false, mensaje: 'La liquidación no está «Cerrada»' }; l.estado = 'Aprobada'; return { ok: true, mensaje: 'Liquidación aprobada en la base' }; }
    if (tipo === 'pagarLiquidacion') { if (l.estado !== 'Aprobada') return { ok: false, mensaje: 'La liquidación no está «Aprobada»' }; if (!d.fecha || !d.referencia) return { ok: false, mensaje: 'Faltan la fecha o la referencia del pago' }; l.estado = 'Pagada'; l.pago = { fecha: d.fecha, referencia: d.referencia, cuenta: d.cuenta || '' }; l.honorarios.forEach((x) => { const h = hon(x); if (h) h.estado = 'Pagado'; }); return { ok: true, mensaje: 'Pago registrado en la base' }; }
    if (tipo === 'anularLiquidacion') { if (['Abierta', 'Cerrada'].indexOf(l.estado) < 0) return { ok: false, mensaje: 'Solo se anula una liquidación «Abierta» o «Cerrada»' }; l.honorarios.forEach((x) => { const h = hon(x); if (h) { h.estado = 'Aprobado'; h.liquidacionId = ''; } }); l.estado = 'Anulada'; return { ok: true, mensaje: 'Liquidación anulada en la base' }; }
    return { ok: false, mensaje: 'Acción desconocida' }; };
  CC.cxHonorarios = { escenas: ESC, datos };
})();
