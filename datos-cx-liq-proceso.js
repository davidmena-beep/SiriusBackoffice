// SIRIUS · Honorarios, liquidaciones y facturas con la conexión simulada (v3.0 · provisional · etapa P-6g-1c · DEC-247: el contrato con la base).
// Las escenas del proceso (honorcalculo, liqporliquidar, liqmesa, liqmesavarias, liqfacturarsri, liqdevolver, liqunicidad, liqindependiente, liqplanta,
// liqdocumento, liqcalculopanel, liqrevision, liqrevisionv2, liqfinanzas y cxliqproceso —esta, siempre con la conexión—)
// con ?cx=1 arman SIRIUS_CONEXION con los mismos datos de datos-liq-proceso.js (honorarios[], liquidaciones[] y facturas[] de la base), el usuario de
// cada escena y la base simulada: cada acción se aplica con SiriusLiqProceso.ops (las mismas reglas de la pantalla) y responde { ok, mensaje } (y { id, numero }).
// ?cxok=0 hace que la base responda { ok: false } a todo. Se suma a SIRIUS_CX_COORD (datos-cx-coordinacion.js) y a sus usuarios y agencias (datos-cx-usuarios.js).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxUsuarios) return;
  const q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const ESC = ['honorcalculo', 'liqporliquidar', 'liqmesa', 'liqmesavarias', 'liqfacturarsri', 'liqdevolver', 'liqunicidad', 'liqindependiente', 'liqplanta', 'liqdocumento', 'liqcalculopanel', 'liqrevision', 'liqrevisionv2', 'liqfinanzas', 'cxliqproceso', 'liqpdf', 'liqpdfrg', 'liqpdfsinaprobar', 'honorclase', 'honormoto', 'facturarmasivo', 'facturarfiltros', 'inicioproveedorcx'];
  const conCx = (e) => q('cx') === '1' || e === 'cxliqproceso' || e === 'inicioproveedorcx';
  if (conCx(q('escena'))) ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; }); // sin ?cx=1, las mismas escenas van sin la conexión
  const U0 = CC.cxUsuarios, clon = (x) => JSON.parse(JSON.stringify(x)), EUR = '1791456320001';
  const CP = { nombre: 'Carla Ponce', tipoIdentificacion: 'Cédula', identificacion: '1709991317', email: 'carla.ponce.finanzas+eurosurvey@gmail.com', rol: 'Finanzas de agencia', roles: ['Finanzas de agencia'], tipo: 'Agencia', agencia: 'Eurosurvey S.A.', agenciaRuc: EUR, estado: 'Activo', vinculado: true };
  const VL = { nombre: 'Verónica Lema', tipoIdentificacion: 'Cédula', identificacion: '1709991028', email: 'veronica.lema.ejecutiva@gmail.com', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'], tipo: 'Interno', agencia: null, estado: 'Activo', vinculado: true };
  const MR = { nombre: 'Mónica Ríos', tipoIdentificacion: 'Cédula', identificacion: '1709991309', email: 'monica.rios.finanzas@gmail.com', rol: 'Finanzas', roles: ['Finanzas'], tipo: 'Interno', agencia: null, estado: 'Activo', vinculado: true };
  const de = (email) => clon(U0.usuarios.find((u) => u.email === email));
  const usuarioDe = (e, v) => (e === 'liqdevolver' || e === 'liqrevision' || e === 'liqrevisionv2' ? clon(VL) : e === 'liqdocumento' || e === 'liqfinanzas' ? clon(MR) : e === 'liqindependiente' ? de('luis.andrade.independiente@gmail.com') : e === 'liqplanta' ? de('mauricio.endara.inspector+eurosurvey@gmail.com') : clon(CP));
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  CC.cxSim = function (escena) { if (ESC.indexOf(escena) < 0 || !conCx(escena)) return baseCC(escena); const LP = window.SiriusLiqProceso; if (!LP) return baseCC(escena);
    const v = q('fvista'), S = LP.semilla(escena, v), agencias = clon(U0.agencias); if (escena === 'liqplanta' && v === 'si') agencias.forEach((a) => { if (a.ruc === EUR) a.pagaInspectores = true; });
    return { usuario: usuarioDe(escena, v), casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, usuarios: clon(U0.usuarios).concat([clon(CP), clon(VL), clon(MR)]), agencias, inspectores: [],
      ...baseDe(S, LP) }; };
  // La base guarda solo el contrato (LP.aContrato); los borradores del proveedor quedan en su sesión (LP.borr) y sus líneas, en la base, «Por liquidar».
  const baseDe = (S, LP) => { const B = LP.aContrato(S); B.honorarios.forEach((h) => { if (/^BOR-/.test(h.liquidacionId || '')) { h.estado = 'Por liquidar'; h.liquidacionId = ''; } });
    LP.borr = clon(S.liquidaciones.filter((l) => l.estado === 'Borrador')); LP._cc = null; return { honorarios: B.honorarios, liquidaciones: B.liquidaciones, facturas: B.facturas, seq: clon(S.seq || null) }; };
  const TIPOS = ['ajustarHonorario', 'quitarAjuste', 'enviarLiquidacion', 'editarLiquidacion', 'reenviarLiquidacion', 'anularLiquidacion', 'aprobarLiquidacion', 'devolverLiquidacion', 'aceptarSugerencia', 'enviarFactura', 'validarFactura', 'devolverFactura', 'registrarPago'];
  // Base simulada: aplica la acción a honorarios[], liquidaciones[] y facturas[] de SIRIUS_CONEXION con las mismas reglas (unicidad, versiones, factura que cuadra).
  CC.aplicar = function (X, tipo, d) { if (TIPOS.indexOf(tipo) < 0 || !X || !Array.isArray(X.honorarios)) return baseAp(X, tipo, d); const LP = window.SiriusLiqProceso; if (!LP) return { ok: false, mensaje: 'Sin el módulo de liquidaciones' };
    // La base trabaja con el contrato: prepara una copia (tarifa del honorario), aplica la regla y guarda solo los campos del contrato.
    X.liquidaciones = X.liquidaciones || []; X.facturas = X.facturas || []; const T = { honorarios: clon(X.honorarios).map(LP.prep), liquidaciones: clon(X.liquidaciones), facturas: clon(X.facturas), seq: clon(X.seq || null) };
    const r = LP.ops(T, tipo, JSON.parse(JSON.stringify(d || {})), { por: (X.usuario || {}).nombre || '', fecha: LP.ahoraIso() });
    if (r.ok) { const B = LP.aContrato(T); ['honorarios', 'liquidaciones', 'facturas'].forEach((k) => { X[k].splice(0, X[k].length, ...B[k]); }); X.seq = T.seq; }
    return r.ok ? Object.assign({ mensaje: r.mensaje + ' en la base' }, r.id ? { id: r.id } : {}, r.numero ? { numero: r.numero } : {}, { ok: true }) : { ok: false, mensaje: r.mensaje }; };
  CC.cxLiqProceso = { escenas: ESC };
})();
