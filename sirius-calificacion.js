// SIRIUS · Cola de trabajo del calificador (etapa 11b). Una sola cola para la página «Calificación» y para los indicadores del
// inicio del Ejecutivo de inspecciones y del Suscriptor: ambos leen SiriusCalificacion.cola(ctx), así que los números coinciden.
// No guarda calificaciones ni datos de riesgos: reutiliza los casos del Back-office (con su responsable y SLA de SIRIUS_FLUJO), los
// vehículos de SIRIUS_EJEMPLO, el motor de Ramos Generales (SIRIUS_MOTOR) y los honorarios (SiriusHonorarios).
// Lo único que vive aquí es el registro de las revisiones de control (conforme o con observación), que alimenta la
// retroalimentación del inicio del inspector y la sección «Revisiones de control» de su ficha de usuario.
(function () {
  if (window.SiriusCalificacion) return; // varias pantallas cargan este archivo: la primera carga conserva el registro de revisiones
  var SC = {}, oyentes = [];
  SC.on = function (f) { oyentes.push(f); return function () { oyentes = oyentes.filter(function (x) { return x !== f; }); }; };
  function avisar() { oyentes.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  SC.avisar = avisar;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var DIAS_ATRAS = 30;

  // ---------- Revisiones de control ----------
  SC.revisiones = [];
  SC.reset = function () { SC.revisiones.length = 0; avisar(); };
  // rev: { caso, riesgo, etiqueta, asegurado, inspector, resultado: 'Conforme' | 'Con observación', motivo, por, fecha }
  SC.registrar = function (rev) { SC.revisiones = SC.revisiones.filter(function (x) { return x.riesgo !== rev.riesgo; }); SC.revisiones.unshift(Object.assign({ id: 'RC-' + rev.riesgo }, rev)); avisar(); return true; };
  // Deshacer una revisión: quita la actual del riesgo y repone la anterior (si había).
  SC.deshacer = function (riesgo, anterior) { SC.revisiones = SC.revisiones.filter(function (x) { return x.riesgo !== riesgo; }); if (anterior) SC.revisiones.unshift(anterior); avisar(); return true; };
  SC.revisionDe = function (riesgo) { return SC.revisiones.find(function (x) { return x.riesgo === riesgo; }) || null; };
  SC.revisionesDe = function (inspector) { return SC.revisiones.filter(function (x) { return x.inspector === inspector; }); };
  SC.retroDe = function (inspector) { return SC.revisionesDe(inspector).filter(function (x) { return x.resultado === 'Con observación'; }); };

  // ---------- Utilidades ----------
  var esVeh = function (c) { return c.tipoRiesgo !== 'Ramos Generales' && (c.ramo === 'Vehículos' || c.tipoRiesgo === 'Vehículos'); };
  // Etapa 8a: Equipo y maquinaria (composición Equipo móvil) también tiene una fila por riesgo (un veredicto por equipo).
  var esEq = function (c) { return c.composicion === 'Equipo móvil' || c.tipoRiesgo === 'Equipo y maquinaria'; };
  var slaDe = function (c) { var s = c.slaInfo; return s ? { label: s.etiqueta, tono: s.tono, title: s.titulo, horas: c.sla, vence: s.vence } : null; };
  var ordenSla = function (a, b) { var x = a.sla && a.sla.horas != null ? a.sla.horas : 1e9, y = b.sla && b.sla.horas != null ? b.sla.horas : 1e9; return x - y || (a.caso < b.caso ? -1 : a.caso > b.caso ? 1 : 0) || (a.riesgo < b.riesgo ? -1 : 1); };
  var nombreVeh = function (v) { return v ? [v.marca, v.modelo, v.anio].filter(Boolean).join(' ') : ''; };
  // Columna «Riesgo». Vehículos: placa (o «Sin placa») y debajo marca, modelo y año (si el caso no tiene vehículo registrado, la descripción del caso).
  // Ramos Generales: la ubicación arriba y debajo los ramos («Incendio y líneas aliadas» o «3 ramos: …»); nunca «1 ramo» como dato principal.
  var riesgoRG = function (c, ramos) { return { etiqueta: c.bien || ramos.join(', ') || 'Sin ubicación', sub: ramos.length === 1 ? ramos[0] : ramos.length + ' ramos: ' + ramos.join(', ') }; };

  // Alertas de Ramos Generales con el motor: banda sugerida por ramo, reglas de severidad y políticas de suscripción.
  SC.rgInfo = function (c, ctx) {
    var E = window.SIRIUS_EJEMPLO, RG = window.SIRIUS_INFORMES_RG, M = window.SIRIUS_MOTOR; if (!E || !RG || !M || !RG.casos) return null;
    var X = RG.casos[c.id], ce = (E.casos || []).find(function (x) { return x.id === c.id; }); if (!X || !ce || !ce.informe) return null;
    var L = E.modelosCalificacion || [], md = M.vigente(L.find(function (x) { return x.estado === 'Vigente'; }) || L.find(function (x) { return x.id === 'sv3'; })); if (!md) return null;
    var res = X.caso.ramos.map(function (r) { return { ramo: r.ramo, x: M.calc(md, { ramo: r.ramo, giro: X.caso.giro, valores: ce.informe.valores }) }; }).filter(function (o) { return !o.x.sinModelo; });
    var bandas = [], sev = 0, pol = 0; res.forEach(function (o) { var b = o.x.final && o.x.final.resultado; if (b) bandas.push({ ramo: o.ramo, banda: b }); sev += o.x.fired.filter(function (f) { return !f.politica; }).length; pol += (o.x.pol && o.x.pol.hits ? o.x.pol.hits.length : 0); });
    return { bandas: bandas, sev: sev, pol: pol };
  };

  function alertasRG(c, ctx) {
    var I = SC.rgInfo(c, ctx), out = []; if (!I) return out;
    if (I.bandas.length) { var u = I.bandas.map(function (b) { return b.banda; }).filter(function (x, i, a) { return a.indexOf(x) === i; });
      out.push({ label: 'Banda sugerida: ' + (u.length === 1 ? u[0] : 'varía por ramo'), tono: u.length === 1 && u[0] === 'Asegurable' ? 'success' : 'warning', title: I.bandas.map(function (b) { return b.ramo + ': ' + b.banda; }).join(' · ') }); }
    if (I.sev) out.push({ label: I.sev + (I.sev === 1 ? ' regla de severidad' : ' reglas de severidad'), tono: 'warning', title: 'Reglas de severidad activadas por el informe' });
    if (I.pol) out.push({ label: I.pol + (I.pol === 1 ? ' política de suscripción' : ' políticas de suscripción'), tono: 'warning', title: 'Alertas de políticas de suscripción en Ramos Generales' });
    return out;
  }

  // Cómo llegó el riesgo a calificación: autoinspección, reglas de envío, determinación del inspector con revisión de control o,
  // si no hay nada de eso, porque el inspector no tiene facultad para determinar.
  function llegoVeh(r, v) {
    var env = (v && v.envio) || r.envio || [], auto = (v && v.modalidad === 'Autoinspección') || env.some(function (e) { return e.regla === 'Autoinspección'; });
    if (r.det && r.control) return { k: 'control', label: 'Determinación con revisión de control', sub: 'Determinó ' + r.det.by, title: 'El inspector determinó el riesgo y quedó seleccionado por muestreo para revisión posterior' };
    if (auto) return { k: 'auto', label: 'Autoinspección', sub: env.length > 1 ? 'y ' + (env.length - 1) + (env.length === 2 ? ' regla más' : ' reglas más') : '', title: 'El cliente hizo la inspección: no hay inspector que determine' };
    if (env.length) return { k: 'reglas', label: 'Reglas de envío', sub: env.map(function (e) { return e.regla; }).join(' · '), title: 'Reglas de envío activadas: ' + env.map(function (e) { return e.regla + (e.pct ? ' (' + e.pct + ')' : ''); }).join(' · ') };
    if (r.det) return { k: 'det', label: 'Determinación del inspector', sub: 'Determinó ' + r.det.by, title: 'Determinado por el inspector' };
    return { k: 'sinfac', label: 'Sin facultad', sub: '', title: 'El inspector no tiene facultad para determinar este riesgo: lo califica el Ejecutivo de inspecciones' };
  }
  function alertasVeh(v, ctx) {
    var out = [], env = (v && v.envio) || [], dv = env.find(function (e) { return e.regla === 'Diferencia de valor'; });
    if (dv) out.push({ label: 'Diferencia de valor' + (dv.pct ? ' ' + dv.pct : ''), tono: 'warning', title: dv.detalle || dv.motivo || 'El valor sugerido difiere del valor asegurado' });
    var ex = v && ctx.extrasOf ? ctx.extrasOf(v) : 0; if (ex > 0) out.push({ label: 'Extras ' + ctx.monto(ex), tono: 'neutral', title: 'Accesorios y extras declarados por ' + ctx.monto(ex) });
    return out;
  }

  // ---------- Filas ----------
  function filaBase(c) { return { caso: c.id, asegurado: c.asegurado || '—', sucursal: c.sucursal || '', ejecutivo: c.ejecutivo || '', responsable: c.responsable || '—', estadoCaso: c.estado, sla: slaDe(c) }; }

  function filasPorCalificar(c, ctx) {
    var out = [], b = filaBase(c);
    if (esEq(c) && c.riesgos) {
      c.riesgos.forEach(function (r) { if (!ctx.listo(r.estado) || r.aseg || r.n1 || r.estado === 'Pendiente calificación de suscripción' || ['Emitida', 'No emitida', 'Cancelado'].indexOf(c.estado) >= 0) return; var v = ctx.vehiculo(r.id), env = (v && v.envio) || r.envio || [];
        out.push(Object.assign({}, b, { id: r.id, riesgo: r.id, etiqueta: r.label || (v && v.label) || r.id, sub: (v && v.tipo ? v.tipo + ' · ' + v.anio : r.detalle) || '', tipo: 'Equipo y maquinaria', ramos: [c.ramo], llego: env.length ? { k: 'reglas', label: 'Reglas de envío', sub: env.map(function (e) { return e.regla; }).join(' · '), title: 'Reglas de envío activadas: ' + env.map(function (e) { return e.regla + (e.pct ? ' (' + e.pct + ')' : ''); }).join(' · ') } : { k: 'sinfac', label: 'Sin determinación', sub: '', title: 'Equipo y maquinaria no se determina en campo: lo califica el Ejecutivo de inspecciones' }, alertas: [], n: 1 })); });
    } else if (esVeh(c)) {
      var multi = c.riesgos && c.riesgos.length > 1, lista = multi ? c.riesgos : [{ id: ((ctx.vehCaso(c.id) || {}).riesgo) || (c.id + '-R1'), single: true }];
      lista.forEach(function (r) { var v = ctx.vehiculo(r.id), pend = multi ? (ctx.listo(r.estado) && !r.aseg) : c.estado === 'Pendiente calificación' && !c.aseg;
        if (!pend || ['Emitida', 'No emitida', 'Cancelado'].indexOf(c.estado) >= 0) return;
        var placa = multi ? ((v && v.placa) || 'Sin placa') : (c.placa || (v && v.placa) || 'Sin placa');
        out.push(Object.assign({}, b, { id: r.id, riesgo: r.id, etiqueta: placa, sub: nombreVeh(v) || r.detalle || c.bien || '', tipo: 'Vehículos', ramos: ['Vehículos'], llego: llegoVeh(r, v), alertas: alertasVeh(v, ctx), n: 1 })); });
    } else if (c.estado === 'Pendiente calificación') {
      var ramos = (c.ramos && c.ramos.length ? c.ramos : [c.ramo]).filter(Boolean);
      out.push(Object.assign({}, b, { id: c.id, riesgo: c.id, etiqueta: riesgoRG(c, ramos).etiqueta, sub: riesgoRG(c, ramos).sub, tipo: 'Ramos Generales', ramos: ramos, llego: { k: 'sinfac', label: 'Sin facultad', sub: '', title: 'Ramos Generales no se determina en campo: lo califica el Ejecutivo de inspecciones' }, alertas: alertasRG(c, ctx), n: 1 }));
    }
    return out;
  }
  function filaSuscripcion(c, ctx) {
    var ramos = (c.ramos && c.ramos.length ? c.ramos : [c.ramo]).filter(Boolean);
    return Object.assign({}, filaBase(c), { id: c.id, riesgo: c.id, enGrupo: !!(ctx.rolBase === 'Suscriptor' && ctx.enMisGrupos && ctx.enMisGrupos(c)), etiqueta: riesgoRG(c, ramos).etiqueta, sub: riesgoRG(c, ramos).sub, tipo: esVeh(c) ? 'Vehículos' : 'Ramos Generales', ramos: ramos, llego: { k: 'susc', label: 'Calificación de inspección lista', sub: '', title: 'La calificación de inspección terminó: falta la de suscripción' }, alertas: alertasRG(c, ctx), n: 1 });
  }

  // Etapa 8b · Equipo y maquinaria: una fila de suscripción por equipo derivado (obligatoria por suma asegurada o requerida por el nivel 1).
  function filasSuscripcionEq(c, ctx) {
    return (c.riesgos || []).filter(function (r) { return r.estado === 'Pendiente calificación de suscripción'; }).map(function (r) { var v = ctx.vehiculo(r.id), n1 = r.n1 || {};
      return Object.assign({}, filaBase(c), { id: r.id, riesgo: r.id, enGrupo: !!(ctx.rolBase === 'Suscriptor' && ctx.enMisGrupos && ctx.enMisGrupos(c)), etiqueta: r.label || (v && v.label) || r.id, sub: (v && v.tipo ? v.tipo + ' · ' + v.anio : r.detalle) || '', tipo: 'Equipo y maquinaria', ramos: [c.ramo],
        llego: { k: 'susc', label: n1.derivacion === 'obligatoria' ? 'Derivación obligatoria' : 'Requerida por el nivel 1', sub: n1.derivacion === 'obligatoria' ? String(n1.motivoDerivacion || '').replace(/^Derivación obligatoria a Suscripción: /, '') : (n1.motivoDerivacion || ''), title: 'Nivel 1: ' + (n1.resultado || '—') + (n1.by ? ' · ' + n1.by + ' · ' + n1.at : '') }, alertas: [], n: 1 }); });
  }

  function filasControl(c, ctx) {
    var out = []; if (!c.riesgos) return out;
    c.riesgos.forEach(function (r) { if (!r.control) return; var v = ctx.vehiculo(r.id), rv = SC.revisionDe(r.id), est = rv ? rv.resultado : r.control.revisado ? 'Conforme' : 'Pendiente', f = ctx.facultadDe ? ctx.facultadDe(r.det && r.det.by) : null;
      out.push(Object.assign({}, filaBase(c), { id: r.id, riesgo: r.id, etiqueta: (v && v.placa) || 'Sin placa', sub: nombreVeh(v) || r.detalle || c.bien || '', tipo: 'Vehículos', ramos: ['Vehículos'], llego: llegoVeh(r, v), alertas: [], inspector: r.det ? r.det.by : '—', detAt: r.det ? r.det.at : '', resultadoDet: r.aseg ? r.aseg + (r.cobertura ? ' · ' + r.cobertura : '') : '—', muestreo: f && f.mue ? f.mue : '', estadoCtl: est, obs: rv ? rv.motivo : (r.control.obs || ''), por: rv ? rv.por : (r.control.by || ''), cuando: rv ? rv.fecha : (r.control.at || ''), n: 1 })); });
    return out;
  }

  function filasCalificados(c, ctx) {
    var out = [], D = ctx.detalle(c.id) || {}, lim = new Date(ctx.ahora.getTime() - DIAS_ATRAS * 86400000), editable = ['Emitida', 'No emitida'].indexOf(c.estado) < 0;
    var base = function () { return Object.assign({}, filaBase(c), { editable: editable, motivoNo: editable ? '' : (c.estado === 'Emitida' ? 'El BPM ya confirmó la emisión: la calificación queda de solo lectura' : 'El BPM respondió «No emitida»: el caso se reabre desde su detalle'), emision: c.estado }); };
    if (c.riesgos && esEq(c)) {
      c.riesgos.forEach(function (r) { if (!r.aseg || !r.user) return; var d = ctx.parse(r.fecha); if (!d || d < lim) return; var v = ctx.vehiculo(r.id);
        out.push(Object.assign(base(), { id: r.id, riesgo: r.id, etiqueta: r.label || r.id, sub: (v && v.tipo ? v.tipo + ' · ' + v.anio : r.detalle) || '', tipo: 'Equipo y maquinaria', ramos: [c.ramo], resultado: r.aseg, cobertura: r.aseg === 'Asegurable' ? (r.n2 ? 'Dictamen de suscripción' : '') : (r.motivoRech || ''), user: r.user, fecha: r.fecha, fechaD: d, modificado: !!(r.n1 && r.n1.editado), n: 1 })); });
    } else if (c.riesgos && esVeh(c)) {

      c.riesgos.forEach(function (r) { if (!r.aseg || !r.user) return; var d = ctx.parse(r.fecha); if (!d || d < lim) return; var v = ctx.vehiculo(r.id);
        out.push(Object.assign(base(), { id: r.id, riesgo: r.id, etiqueta: (v && v.placa) || 'Sin placa', sub: nombreVeh(v) || r.detalle || c.bien || '', tipo: 'Vehículos', ramos: ['Vehículos'], resultado: r.aseg, cobertura: r.aseg === 'Asegurable' ? (r.cobertura || '') : (r.motivoRech || ''), user: r.user, fecha: r.fecha, fechaD: d, modificado: !!r.mod, n: 1 })); });
    } else {
      var fc = c.califFecha || (D.n2 && D.n2.fecha) || (D.n1 && D.n1.fecha), d = ctx.parse(fc), user = c.califUser || (D.n2 && D.n2.user) || (D.n1 && D.n1.user) || '';
      if (c.aseg && d && d >= lim && user) { var ramos = (c.ramos && c.ramos.length ? c.ramos : [c.ramo]).filter(Boolean), v1 = esVeh(c) ? (ctx.vehCaso(c.id) || null) : null;
        out.push(Object.assign(base(), { id: c.id, riesgo: esVeh(c) && v1 ? v1.riesgo : c.id, etiqueta: esVeh(c) ? (c.placa || (v1 && v1.placa) || 'Sin placa') : riesgoRG(c, ramos).etiqueta, sub: esVeh(c) ? (nombreVeh(v1) || c.bien || '') : riesgoRG(c, ramos).sub, tipo: esVeh(c) ? 'Vehículos' : 'Ramos Generales', ramos: esVeh(c) ? ['Vehículos'] : ramos, resultado: c.aseg, cobertura: c.aseg === 'Asegurable' ? (c.cobertura || '') : (c.motivoRech || ''), user: user, fecha: fc, fechaD: d, modificado: false, n: 1 })); }
    }
    return out;
  }

  // ctx: casos (ya con responsable, ejecutivo y SLA), yo, ahora, parse, usd, listo(estadoRiesgo), vehiculo(id), vehCaso(casoId), extrasOf(v),
  // detalle(casoId), facultadDe(inspector).
  SC.cola = function (ctx) {
    var por = [], sus = [], ctl = [], cal = [];
    ctx.casos.forEach(function (c) {
      por = por.concat(filasPorCalificar(c, ctx));
      if (esEq(c) && c.riesgos) sus = sus.concat(filasSuscripcionEq(c, ctx)); else if (c.estado === 'Pendiente calificación de suscripción') sus.push(filaSuscripcion(c, ctx));
      ctl = ctl.concat(filasControl(c, ctx));
      cal = cal.concat(filasCalificados(c, ctx));
    });
    por.sort(ordenSla); sus.sort(ordenSla);
    ctl.sort(function (a, b) { return (a.estadoCtl === 'Pendiente' ? 0 : 1) - (b.estadoCtl === 'Pendiente' ? 0 : 1) || ordenSla(a, b); });
    cal.sort(function (a, b) { return b.fechaD - a.fechaD || (a.riesgo < b.riesgo ? -1 : 1); });
    var yo = ctx.yo;
    por.forEach(function (x) { x.mio = x.responsable === yo; }); sus.forEach(function (x) { x.mio = x.responsable === yo || x.enGrupo; });
    ctl.forEach(function (x) { x.mio = x.ejecutivo === yo; }); cal.forEach(function (x) { x.mio = x.user === yo; });
    return { porCalificar: por, suscripcion: sus, control: ctl, calificados: cal };
  };
  // Los indicadores del inicio usan solo lo propio.
  SC.mias = function (cola) { var f = function (L) { return L.filter(function (x) { return x.mio; }); }; return { porCalificar: f(cola.porCalificar), suscripcion: f(cola.suscripcion), control: f(cola.control), calificados: f(cola.calificados) }; };
  SC.vencido = function (x) { return !!(x.sla && x.sla.tono === 'danger'); };
  SC.porVencer = function (x) { return !!(x.sla && x.sla.tono === 'warning'); };
  SC.conteoCasos = function (L) { return L.map(function (x) { return x.caso; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).length; };

  window.SiriusCalificacion = SC;
})();
