// SIRIUS · Armado de la salida en PDF de Vehículos (etapa SV · DEC-117 y DEC-118, provisionales).
// Lee todo de SIRIUS_SALIDA_VEH (documentos, reglas, portada, bloques, derivados, alertas, polaridad, generacion) y de los valores
// del vehículo: SIRIUS_EJEMPLO.vehiculos (base, informe.campos, informe.grillas, estadoRiesgo) y, solo donde falten,
// SIRIUS_INFORME_VEH.complementos. No completa nada desde el diseño: un dato vacío se muestra «—».
// La composición, la paginación y la captura del PDF son las del motor común (sirius-pdf.js, SIRIUS_SALIDA_RG.composicion).
(function () {
  const RAYA = '—';
  const E = () => window.SIRIUS_EJEMPLO || {}, SV = () => window.SIRIUS_SALIDA_VEH || {}, IV = () => (window.SIRIUS_INFORME_VEH || {}).complementos || {};
  const tpl = (v) => ((E().plantillas || {})[(v && v.formulario) || 'Vehículos livianos v1']) || null;
  const vacio = (x) => x == null || x === '' || (Array.isArray(x) && !x.length);
  const ICON = { ok: ['M20 6 9 17l-5-5', '#4C8C1E'], no: ['M18 6 6 18 M6 6l12 12', '#9E1B0E'], pend: ['M12 7v5l3 2 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', '#C99A06'] };
  const COL = { fav: { bg: '#DCEFC6' }, des: { bg: '#F8DAD5' }, aten: { bg: '#FBEFCB' }, gris: { bg: '#F4F4F4' } };
  // Nombre de cada foto principal del Resumen → paso de captura de la plantilla (PASOS de datos-ejemplo.js).
  const FOTO_PASO = { 'Vista frontal': 'Frontal', 'Lateral izquierdo': 'Lateral izquierdo de adelante hacia atrás', 'Parte posterior': 'Posterior', 'Odómetro': 'Kilometraje' };
  const FINAL = ['Inspeccionado', 'Enviado a emisión', 'Emitida', 'No emitida'];

  function placaDe(v) { const p = (v && v.placa) || ''; return window.SIRIUS_PLACA ? window.SIRIUS_PLACA.normalizar(p) : String(p).toUpperCase().replace(/[-\s]/g, ''); }
  function descripcion(v) { return [v.marca, v.modelo, v.anio].filter(x => !vacio(x)).join(', '); }
  // Etiqueta del selector: placa o «Marca, modelo, año» si no tiene placa (SIRIUS_SALIDA_VEH.generacion.selectorVehiculo).
  function etiqueta(v) { return placaDe(v) || v.label || descripcion(v); }
  // Etapa 8b · también los equipos de Equipo y maquinaria (SIRIUS_EJEMPLO.equipos, mismo armado: un informe por riesgo).
  function vehiculo(rid) { return (E().vehiculos || []).find(x => x.riesgo === rid) || (E().equipos || []).find(x => x.riesgo === rid) || null; }
  function anioHoy() { const e = E(); return e.hoy ? e.hoy().getFullYear() : 2026; }

  function miles(n) { const neg = n < 0, a = Math.abs(n), s = Number.isInteger(a) ? String(a) : String(Math.round(a * 10) / 10).replace('.', ','); const m = /^(\d+)(,\d+)?$/.exec(s); return (neg ? '−' : '') + (m ? m[1].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (m[2] || '') : s); }
  function usd(n) { return window.SIRIUS_COMPANIA.formatoMonto(n); }
  function colMon(c) { return String(c).replace('(USD)', '(' + window.SIRIUS_COMPANIA.moneda.codigo + ')'); }
  function pct1(n) { const r = Math.round(n * 10) / 10; return (r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r).toFixed(1).replace('.', ',') + ' %'; }
  const NOFMT = /anio|identificacion|cedula|imei|voucher|puntos|edad|pasajeros|airbags/;
  function fmt(k, x) { if (vacio(x)) return null; if (typeof x === 'boolean') return x ? 'Sí' : 'No'; if (typeof x === 'number') { if (NOFMT.test(k)) return String(x); return miles(x); } return String(x); }

  // ---------- Valores del vehículo ----------
  // ov: estado de la sesión del Back-office (calificación, emisión). inf: estado del informe en el Back-office.
  function contexto(rid, ov, caso, asegurado) {
    const v = vehiculo(rid); if (!v) return null;
    if (v.eq) return contextoEq(v, rid, ov, caso, asegurado);
    return contextoDe(v, rid, ov, caso, asegurado); }
  // El mismo armado para el vehículo de ejemplo y para el que se arma con la base (contextoCx): valores, grillas, derivados, resultado y etiqueta.
  function contextoDe(v, rid, ov, caso, asegurado) {
    const T = tpl(v), inf = v.informe || {}, IC = inf.campos || {}, IG = inf.grillas || {}, C = IV()[rid] || {}, CC = C.campos || {}, CG = C.grillas || {};
    const val = {}, meta = {}, put = (k, x, m) => { if (vacio(val[k]) && !vacio(x)) { val[k] = x; if (m) meta[k] = m; } };
    // 1) Informe del vehículo (con sus ediciones), 2) base, 3) complementos.
    Object.keys(IC).forEach(k => { const c = IC[k] || {}; if (!vacio(c.v)) put(k, c.v, c.src === 'ext' ? { doc: c.doc, conf: c.conf } : null); });
    (inf.ediciones || []).forEach(ed => (ed.cambios || []).forEach(ch => { if (ch.k) { val[ch.k] = ch.nuevo; delete meta[ch.k]; } }));
    const extras = Array.isArray(v.extras) ? v.extras : null;
    const base = { veh_placa: placaDe(v), veh_marca: v.marca, veh_modelo: v.modelo, veh_anio_modelo: v.anio, veh_kilometraje: v.km, veh_uso: v.uso, veh_tipo_carroceria: v.carroceria, veh_clase: v.clase,
      veh_modalidad_realizada: v.modalidad, veh_agencia: v.sucursal, veh_inspector_ejecuto: v.inspector, veh_fecha_hora_inspeccion: inf.inspeccion || v.fechaInspeccion, veh_fecha_hora_carga: inf.carga,
      veh_valor_asegurado_casco: v.aseg, veh_valor_sugerido_casco: v.sug, veh_cobertura: v.cobertura, veh_ciudad_circulacion: v.lugar, veh_contrato_compraventa: v.contrato, veh_blindaje: v.blindaje,
      veh_valor_asegurado_extras: extras ? extras.reduce((a, x) => a + (Number(x.valor) || 0), 0) : v.accesorios };
    Object.keys(base).forEach(k => put(k, base[k]));
    Object.keys(CC).forEach(k => put(k, CC[k]));
    // Grillas: la del informe manda; el complemento solo si el informe no la trae.
    const neuSrc = IG.neu || CG.neu || null, neuRows = ((((T || {}).campos || {}).neu || [])[0] || {}).rows || [];
    const neu = neuSrc ? neuRows.filter(p => neuSrc[p]).map(p => Object.assign({ pos: p }, neuSrc[p])) : [];
    const extInf = IG.ext || {}, ext = (extras || []).map(x => Object.assign({ desc: x.desc, valor: x.valor }, extInf[x.desc] || {})).concat((IG.extManual || []).map(x => Object.assign({}, x)));
    const extFinal = ext.length ? ext : (Array.isArray(CG.ext) ? CG.ext.slice() : []);
    const ave0 = (Array.isArray(IG.ave) ? IG.ave : Array.isArray(CG.ave) ? CG.ave : []).filter(a => a && a.estado !== 'descartada');
    // Etapa 12a · DEC-134: la grilla de averías sigue a la revisión de los daños detectados (SiriusDanos): pasan Confirmados, Ajustados y Agregados.
    const ave = window.SiriusDanos ? window.SiriusDanos.averias(rid, ave0) : ave0;
    const vexSrc = IG.vex || CG.vex || null, vexRows = ((((T || {}).campos || {}).vex || [])[0] || {}).rows || [];
    const vex = vexSrc ? vexRows.map(r => Object.assign({ consulta: r }, vexSrc._all || {}, vexSrc[r] || {})) : [];
    const tieneGrilla = { neu: !!neuSrc, ext: !!(extras || IG.ext || CG.ext), ave: !!(IG.ave || CG.ave), vex: !!vexSrc };
    // Derivados (SIRIUS_SALIDA_VEH.derivados).
    const N = (k) => { const x = val[k]; if (vacio(x)) return null; const n = Number(String(x).replace(',', '.')); return isFinite(n) ? n : null; };
    const km = N('veh_kilometraje'), ac = N('veh_anio_compra'); if (km != null && ac != null) val.veh_kilometraje_anual = Math.round(km / Math.max(1, anioHoy() - ac));
    if (tieneGrilla.ext) val.veh_valor_sugerido_extras = extFinal.reduce((a, x) => a + (Number(String(x.valor || 0).replace(',', '.')) || 0), 0);
    if (vacio(val.veh_valor_asegurado_extras) && tieneGrilla.ext && !extras) val.veh_valor_asegurado_extras = 0;
    const ca = N('veh_valor_asegurado_casco'), ea = N('veh_valor_asegurado_extras'), cs = N('veh_valor_sugerido_casco'), es = N('veh_valor_sugerido_extras');
    if (ca != null) val.veh_valor_asegurado_total = ca + (ea || 0);
    if (cs != null && es != null) val.veh_valor_sugerido_total = cs + es;
    if (cs != null && ca) val.veh_diferencia_valor = (cs - ca) / ca * 100;
    if (ea != null && ca) val.veh_extras_sobre_casco = ea / ca * 100;
    const ctx = { rid, v, T, val, meta, neu, ext: extFinal, ave, vex, tieneGrilla, caso: caso || v.caso, asegurado: asegurado || '', ov: ov || {} };
    ctx.res = resultado(ctx); ctx.placa = placaDe(v); ctx.etiqueta = etiqueta(v); ctx.descripcion = descripcion(v);
    return ctx;
  }

  // ---------- Vehículo desde la base (etapa P-1c2 · DEC-272) ----------
  // Con la conexión, el contexto del PDF se arma solo con SIRIUS_CONEXION y la misma lectura de la pestaña Informe (SiriusCxInforme, C2-8):
  // valores y grillas de informes[caso] del vehículo; visita (modalidad, inspector, inicio, lugar); resultado de riesgo_estado y de la última
  // calificación final del vehículo; trazabilidad de eventos[caso]; fotos de evidencias[caso] del vehículo. Después sigue el camino de contexto().
  const isoTxt = (t) => { const m = /^(\d{4})-(\d\d)-(\d\d)(?:[T ](\d\d:\d\d))?/.exec(String(t || '')); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + (m[4] ? ' · ' + m[4] : '') : String(t || ''); };
  const nombreDe = (x) => x == null ? '' : typeof x === 'string' ? x.trim() : String(x.nombre || x.n || '').trim();
  const INF_EQ = (e) => { const t = String(e || '').toLowerCase(); return t === 'completo' || t === 'enviado' ? 'Enviado' : t === 'devuelto' ? 'Devuelto' : t ? 'Por completar' : ''; };
  // P-1c3 · DEC-272: vehículos de un caso de la base, igual con uno o con varios. casos[].riesgos[] (varios vehículos, con riesgo_estado completo) o, si no
  // existe, casos[].riesgosBase[] (también con un solo vehículo: id «50047-V1», estado, riesgo_estado y datos). Devuelve [{ id, r, rb }] con r = el riesgo
  // (con su id) y rb = su riesgo de la solicitud (riesgosBase), en el orden del caso.
  const esVehBase = (x) => !!x && typeof x === 'object' && !/equipo|ubica/i.test(String(x.composicion || ''));
  function riesgosCx(caso) { const X = window.SIRIUS_CONEXION; if (!X || X.activo !== true) return [];
    const c = (X.casos || []).find(k => k && String(k.id) === String(caso)); if (!c) return [];
    const rbs = Array.isArray(c.riesgosBase) ? c.riesgosBase.filter(x => x && typeof x === 'object') : [], RS = Array.isArray(c.riesgos) ? c.riesgos.filter(x => x && x.id != null) : [];
    if (RS.length) return RS.map((r, k) => { const rb = rbs.find(x => x.id != null && String(x.id) === String(r.id)) || rbs[k] || (RS.length < 2 ? rbs.find(esVehBase) : null) || null; return { id: String(r.id), r, rb }; });
    return rbs.filter(esVehBase).map((rb, k) => { const id = String(rb.id != null ? rb.id : c.id + '-V' + (k + 1)), D = rb.datos || {}; return { id, r: Object.assign({}, rb, { id, placa: rb.placa || D.placa || '', label: rb.label || D.placa || '' }), rb }; }); }
  function contextoCx(caso, ref, ov0, asegurado) {
    const X = window.SIRIUS_CONEXION, M = window.SiriusCxInforme; if (!X || X.activo !== true || !M) return null;
    const c = (X.casos || []).find(k => k && String(k.id) === String(caso)); if (!c) return null;
    const LV = riesgosCx(caso), RS = LV.map(x => x.r), k = LV.findIndex(x => x.id === String(ref)), r = k >= 0 ? LV[k].r : null; if (!r) return null;
    const rb = LV[k].rb, rbD = (rb && rb.datos) || {};
    const L = ((X.informes || {})[c.id] || []).filter(i => i && (RS.length < 2 || M.ridDe(i, RS) === String(ref))), inf0 = L[0] || null;
    const R = M.respuestas(L, M.claves(), rb), V = M.valores(R, inf0), G = M.grillas(L);
    // Visita del vehículo: la de riesgos[].visita o, si no, la última de visitasBase que lo incluye (no cancelada).
    const VB = (Array.isArray(c.visitasBase) ? c.visitasBase : Array.isArray(c.visitas) ? c.visitas : []), rv0 = r.visita && typeof r.visita === 'object' ? r.visita : null;
    const vis = (rv0 && VB.find(x => x && Number(x.n) === Number(rv0.n))) || VB.filter(x => x && !/cancel|reagend/i.test(String(x.estado || '')) && (RS.length < 2 || (x.riesgos || []).map(String).includes(String(ref)))).pop() || rv0 || {};
    const insN = nombreDe(vis.inspector) || nombreDe(rv0 && rv0.inspector), agencia = String(vis.agencia || (vis.inspector && vis.inspector.agencia) || '').trim();
    // Resultado: estado y veredicto de riesgo_estado (DEC-271); quién calificó y cuándo, de la última calificación final del vehículo (una derivación a suscripción no es resultado).
    const re = r.riesgo_estado && typeof r.riesgo_estado === 'object' ? r.riesgo_estado : rb && rb.riesgo_estado && typeof rb.riesgo_estado === 'object' ? rb.riesgo_estado : { estado: r.estado || (rb && rb.estado) || '' }; /* P-1c3: de riesgos[] o de riesgosBase */
    const cals = ((X.calificaciones || {})[c.id] || []).filter(q => q && (String(q.riesgo || '') === String(ref) || (RS.length < 2 && !q.riesgo)) && !/deriv/i.test(String(q.resultado || '') + ' ' + String(q.veredicto || ''))), cal = cals[cals.length - 1] || null;
    const ver = /^(Asegurable|No asegurable)$/.test(String(re.veredicto || '')) ? re.veredicto : (FINAL.includes(re.estado) && cal && /^(Asegurable|No asegurable)$/.test(cal.veredicto) ? cal.veredicto : '');
    // P-1c5: decision del informe = { tipo, criterio, motivo, por, hora, facultad } (o la forma anterior: decision/completadoPor/completadoEn). La determinación al completar
    // dentro de la facultad deja una calificación de nivel 0: es el resultado (quién y cuándo); su motivo sale de la observación o del motivo de la decisión.
    const DEC = inf0 && inf0.decision && typeof inf0.decision === 'object' ? inf0.decision : null, decT = DEC ? String(DEC.tipo || '') : String((inf0 && inf0.decision) || ''), decMot = String((DEC && DEC.motivo) || '');
    const det = ver && inf0 && decT === 'determinar' && (!cal || Number(cal.nivel) === 0) ? { by: nombreDe((DEC && DEC.por) || (cal && cal.por) || inf0.completadoPor || inf0.responsable) || insN, at: isoTxt((DEC && DEC.hora) || (cal && cal.hora) || inf0.completadoEn || inf0.enviadoEn) } : null;
    const motR = ver === 'No asegurable' ? String((cal && (cal.observacion || cal.motivo)) || decMot || '') : '';
    const ov = Object.assign({ cx: true, estado: re.estado || r.estado || '' }, ver ? { aseg: ver } : {}, ver && cal ? { user: nombreDe(cal.por), fecha: isoTxt(cal.hora), cobertura: cal.cobertura || '' } : {}, motR ? { motivoRech: motR } : {}, det ? { det } : {}, ov0 || {});
    // Valores del informe con su origen (las lecturas de fotos o documentos llevan su confianza).
    const TT = tpl({ formulario: 'Vehículos livianos v1' }) || {}, tipoDe = {}; Object.keys(TT.campos || {}).forEach(sid => (TT.campos[sid] || []).forEach(fd => { tipoDe[fd.k] = fd.t; }));
    const comoNum = (kk, x) => { if (!/^(Número|Moneda)$/.test(tipoDe[kk] || '')) return x; const t = String(x).trim(), n = Number(/,\d{1,2}$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '')); return t !== '' && isFinite(n) ? n : x; }; /* los números de la base llegan como texto */
    const IC = {}; Object.keys(V).forEach(kk => { const x = R[kk] || {}, lec = /^(foto|ocr|lectura)/i.test(x.org || ''), val = comoNum(kk, V[kk]); IC[kk] = lec ? { v: val, src: 'ext', doc: x.doc || 'foto o documento', conf: x.conf } : { v: val }; });
    const ciudad = String((vis.lugar && (vis.lugar.ciudad || vis.lugar.canton)) || c.ciudad || '').trim(), autoI = /autoinspecci/i.test([vis.modalidad, c.modalidad, inf0 && inf0.canal, inf0 && inf0.plantilla, inf0 && inf0.plantillaClave].map(x => String(x || '')).join(' '));
    if (autoI && inf0 && inf0.enviadoEn) IC.veh_fecha_hora_inspeccion = { v: isoTxt(inf0.enviadoEn) }; /* P-1c5: la misma hora que precarga el formulario */
    // P-1c3: lugar de la inspección = la dirección o la ciudad de la visita (las coordenadas de las fotos solo lo complementan).
    const lugarVis = String((vis.lugar && (vis.lugar.direccion || '')) || vis.direccion || (vis.lugar && (vis.lugar.ciudad || vis.lugar.canton)) || vis.ciudad || '').trim();
    const v = { cx: true, caso: c.id, riesgo: String(ref), label: r.label || '', placa: V.veh_placa || r.placa || rbD.placa || (r.nowrap ? r.label : '') || '', marca: rbD.marca || r.marca, modelo: rbD.modelo || r.modelo, anio: rbD.anio || r.anio,
      km: rbD.km, uso: rbD.uso || r.uso, carroceria: rbD.carroceria || r.carroceria, clase: rbD.clase || r.clase, modalidad: vis.modalidad || '', inspector: insN, sucursal: c.sucursal || '', lugar: ciudad, lugarVisita: lugarVis,
      extras: [] /* como Informe con la conexión: la grilla de extras sale de las respuestas (extManual); los de la solicitud no se repiten */, accesorios: rbD.valorExtras,
      informe: { estado: INF_EQ(inf0 && inf0.estado), inspeccion: isoTxt(autoI && inf0 && inf0.enviadoEn ? inf0.enviadoEn : (vis.llegada || vis.inicio || '')), carga: isoTxt(inf0 && inf0.enviadoEn), campos: IC, grillas: G } }; /* P-1c5: en autoinspección, la hora del envío del cliente */
    const ctx = contextoDe(v, String(ref), ov, c.id, asegurado || c.asegurado || '');
    // Trazabilidad (eventos[caso]): solicitud, inicio de la inspección, envío del informe, calificación y emisión, con fecha y hora.
    const ev = ((X.eventos || {})[c.id] || []).slice().reverse(), pl = ctx.placa || '', deVeh = (e) => RS.length < 2 || [pl, String(ref)].some(q => q && String(e.detalle || '').indexOf(q) >= 0);
    const busca = (re0, veh) => { const e = ev.find(x => x && re0.test(String(x.accion || '')) && (!veh || deVeh(x))); return e ? isoTxt(e.hora) : ''; };
    ctx.traza = { 'Solicitud': busca(/^Solicitud recibida/) || isoTxt(c.registrado), 'Enlace enviado': busca(/[Ee]nlace enviado/, true), 'Inspección iniciada': busca(/Visita iniciada|Inspecci[oó]n iniciada|Llegada/, true) || v.informe.inspeccion,
      'Informe enviado': busca(/^Informe enviado/, true) || v.informe.carga, 'Informe completado': busca(/^Informe completado/, true), 'Calificación': ver ? (busca(/^Calificaci[oó]n/, true) || (cal ? isoTxt(cal.hora) : '')) : '', 'Envío a emisión': busca(/[Ee]nviado a emisi/, true), 'Emisión': busca(/Emitid|BPM de Emisi/, true) };
    ctx.inspCx = insN ? { n: insN, tipo: agencia ? 'Agencia' : String(vis.tipoInspector || (vis.inspector && vis.inspector.tipo) || 'Interno'), ag: agencia } : null;
    ctx.cx = true; ctx.cxInforme = !!inf0; ctx.cxEstado = re; ctx.cxIdx = k; ctx.cxTotal = RS.length;
    // P-1c3: registro de la declaración del cliente (autoinspección): solo con fecha y hora en la base (informe, respuestas o eventos).
    const dc = (inf0 && (inf0.declaracion || (inf0.respuestas || {}).declaracion)) || null, dcAt = dc && typeof dc === 'object' ? (dc.at || dc.hora || dc.aceptadaEn || dc.fecha) : '', dcEv = ev.find(x => x && /^Declaraci[oó]n (aceptada|del cliente)/i.test(String(x.accion || '')) && deVeh(x));
    const dcT = isoTxt(dcAt && /\d\d:\d\d/.test(String(dcAt)) ? dcAt : dcEv ? dcEv.hora : ''); ctx.declCx = /\d\d:\d\d/.test(dcT) ? dcT : '';
    // Fotos sin el Back-office (SiriusFotosCx da las de la pestaña Evidencias): evidencias del vehículo, no descartadas, en el orden de los pasos de la plantilla.
    const T = tpl(v) || {}, PA = T.pasos || [], EVs = ((X.evidencias || {})[c.id] || []).filter(e => e && e.paso && !/^(excluida|descartada)$/i.test(String(e.estado || '')) && (RS.length < 2 || !e.riesgo || String(e.riesgo) === String(ref)) && e.tipoArchivo !== 'video' && e.tipo !== 'video');
    const ordenP = (e) => { const i = PA.findIndex(p => p.id === e.paso); return i < 0 ? 999 : i; }; let n = 0;
    ctx.fotosCx = EVs.slice().sort((a, b) => ordenP(a) - ordenP(b)).map(e => { const p = PA.find(z => z.id === e.paso) || { id: e.paso, name: e.pasoNombre || e.paso, group: 'Otras fotos' }, g = Array.isArray(e.gps) ? e.gps : e.gps && e.gps.lat != null ? [e.gps.lat, e.gps.lng != null ? e.gps.lng : e.gps.lon] : null; n++;
      return { n, F: 'F-' + n, p, f: { cx: true, at: isoTxt(e.hora || e.fecha), gps: g ? { lat: Number(g[0]), lng: Number(g[1]), prec: e.precision != null ? e.precision : null } : null, url: e.url || '', disp: e.dispositivo || e.disp || '' } }; });
    return ctx;
  }
  function disponibilidadCx(ctx) { const ok = !!(ctx && ctx.cxInforme);
    return { informe: ok ? { ok: true } : { ok: false, corto: 'sin informe', motivo: 'Disponible cuando el vehículo tenga informe (antes del resultado sale en borrador).' },
      resumen: !ok ? { ok: false, corto: 'sin informe', motivo: 'Disponible cuando el vehículo tenga informe y veredicto (Asegurable o No asegurable).' } : ctx.res.veredicto ? { ok: true } : { ok: false, corto: 'sin veredicto', motivo: 'Disponible cuando el vehículo tenga veredicto (Asegurable o No asegurable).' } }; }

  // Equipo y maquinaria: valores del informe (em_*), grillas, valores calculados con SiriusEquipos (con el VRN ajustado en calificación) y resultado por niveles.
  function contextoEq(v, rid, ov, caso, asegurado) {
    const T = tpl(v), inf = v.informe || {}, IC = inf.campos || {}, val = {}, o = ov || {}, SE = window.SiriusEquipos;
    Object.keys(IC).forEach(k => { const c = IC[k] || {}; if (!vacio(c.v)) val[k] = c.v; });
    if (o.campos) Object.keys(o.campos).forEach(k => { if (!vacio(o.campos[k])) val[k] = o.campos[k]; });
    Object.assign(val, { em_modalidad_realizada: v.modalidad, em_inspector_ejecuto: v.inspector, em_fecha_hora_inspeccion: inf.inspeccion || v.fechaInspeccion, em_fecha_hora_carga: inf.carga });
    const adj = o.vrnAdj || null, eqv = SE ? SE.valores(v.eq, adj ? { vrn: adj.vrn } : {}) : null;
    const gEq = o.grillas || inf.grillas || {}, aveEq0 = (gEq.em_averias || []).filter(a => a && a.estado !== 'descartada' && a.estado !== 'propuesta'), aveEq = window.SiriusDanos ? window.SiriusDanos.averias(rid, aveEq0) : aveEq0;
    const ctx = { rid, v, T, val, meta: {}, neu: [], ext: [], ave: aveEq, vex: [], tieneGrilla: { ave: true }, caso: caso || v.caso, asegurado: asegurado || '', ov: o, em: true, eq: v.eq, grillas: gEq, eqv, vrnAdj: adj,
      hall: SE && eqv ? SE.hallazgos(v.eq, eqv) : [] };
    ctx.res = resultado(ctx); ctx.placa = ''; ctx.etiqueta = v.label || rid; ctx.descripcion = [v.tipo, v.anio].filter(x => !vacio(x)).join(' · ');
    return ctx;
  }

  // ---------- Resultado (veredicto, origen, reglas, emisión) ----------
  function resultado(ctx) {
    const v = ctx.v, ov = ctx.ov || {}, er = Object.assign({}, ov.cx ? {} : v.estadoRiesgo || {}, ov), cal = ov.cx ? null : v.calificacion || null; /* C2-18: con la conexión (ov.cx) el resultado sale del estado y el veredicto de la base, no del caso de ejemplo */
    const abierto = ov.estado && !FINAL.includes(ov.estado) && !ov.aseg; if (abierto) { er.aseg = ''; er.emi = null; }
    const veredicto = er.aseg || (!abierto && cal ? cal.aseg : '') || '';
    const cobertura = veredicto === 'Asegurable' ? (er.cobertura || (cal && cal.cobertura) || ctx.val.veh_cobertura || '') : '';
    const motivo = veredicto === 'No asegurable' ? (er.motivoRech || '') : '';
    let origen = '', calificador = null; const el = (f) => f ? ' el ' + f : '';
    if (veredicto) { if (er.user) { calificador = { nombre: er.user, fecha: er.fecha || '' }; origen = (er.mod ? 'Modificado en calificación por ' : 'Calificado por ') + er.user + el(er.fecha); } else if (er.det) origen = 'Determinado por el inspector ' + er.det.by + el(er.det.at); else if (cal && cal.by) { calificador = { nombre: cal.by, fecha: cal.at || '' }; origen = 'Calificado por ' + cal.by + el(cal.at); } }
    if (ctx.em && veredicto) { const n2 = er.n2, n1 = er.n1; calificador = n2 ? { nombre: n2.by, fecha: n2.at } : n1 ? { nombre: n1.by, fecha: n1.at } : calificador;
      origen = n2 ? 'Dictamen de suscripción por ' + n2.by + el(n2.at) + (n1 ? ' · nivel 1: ' + n1.resultado + ' (' + n1.by + ')' : '') : n1 ? (n1.aplicadoDesde ? 'Aplicado desde ' + n1.aplicadoDesde + ' por ' : n1.editado ? 'Modificado en calificación por ' : 'Calificado por ') + n1.by + el(n1.at) : origen; }
    const reglas = (er.envio && er.envio.length ? er.envio : v.envio || []).map(r => ({ regla: r.regla, pct: r.pct || '', detalle: r.detalle || '' }));
    const emi = abierto ? null : (er.emi || v.emision || null);
    const kind = veredicto === 'Asegurable' ? 'ok' : veredicto === 'No asegurable' ? 'no' : 'pend';
    const texto = veredicto || (SV().bloques || {}).resultado.sinVeredicto || 'Pendiente de calificación';
    return { veredicto, cobertura, motivo, origen, calificador, reglas, emi, kind, texto, icon: ICON[kind] };
  }

  // ---------- Disponibilidad (SIRIUS_SALIDA_VEH.generacion.disponibilidad) ----------
  function disponibilidad(ctx, informeEstado) {
    const env = (informeEstado || (ctx.v.informe || {}).estado) === 'Enviado';
    return {
      informe: env ? { ok: true } : { ok: false, corto: 'sin informe enviado', motivo: 'Disponible cuando el informe del vehículo esté Enviado' + (informeEstado ? ' (hoy: ' + informeEstado + ').' : '.') },
      resumen: !env ? { ok: false, corto: 'sin informe enviado', motivo: 'Disponible cuando el informe del vehículo esté Enviado y tenga veredicto (Asegurable o No asegurable).' } : ctx.res.veredicto ? { ok: true } : { ok: false, corto: 'sin veredicto', motivo: 'Disponible cuando el vehículo tenga veredicto (Asegurable o No asegurable).' },
    };
  }

  // ---------- Nombres de archivo (generacion.nombreArchivo y zip) ----------
  function docDef(id) { return (SV().documentos || []).find(d => d.id === id) || null; }
  function archivo(id, ctx) { const d = docDef(id), G = SV().generacion || {}; return String(G.nombreArchivo || '{documento}_{caso}_{placa o riesgo}.pdf').replace('{documento}', d ? d.archivo : id).replace('{caso}', ctx.caso).replace('{placa o riesgo}', ctx.placa || ctx.rid); }
  function zipNombre(caso) { return String((SV().generacion || {}).zip || 'Informes_{caso}.zip').replace('{caso}', caso); }
  // Adjuntos de «Enviar a emisión»: los dos documentos de cada vehículo con veredicto.
  function adjuntos(lista, caso) { const out = []; (lista || []).forEach(x => { const c = contexto(x.riesgo, x.ov, caso, ''); if (c && c.res.veredicto) out.push(archivo('resumen', c), archivo('informe', c)); }); return out; }

  // ---------- Documentos ----------
  function documento(id, ctx) {
    const S = SV(), d = docDef(id); if (!d || !ctx) return null;
    const T = ctx.T || {}, campos = T.campos || {}, def = {}; Object.keys(campos).forEach(s => (campos[s] || []).forEach(f => { def[f.k] = Object.assign({ sec: s }, f); }));
    const esInf = id === 'informe', val = ctx.val, R = ctx.res, POL = S.polaridad || {};
    const lab = (k) => (def[k] || {}).l || k;
    const visible = (k) => { const f = def[k]; if (!f || !f.vis) return true; return String(val[f.vis.k] == null ? '' : val[f.vis.k]) === String(f.vis.v); };
    const txt = (k) => { const t = fmt(k, val[k]); return t == null ? null : k === 'veh_kilometraje' || k === 'veh_kilometraje_anual' ? t + ' km' : /^veh_valor_/.test(k) && typeof val[k] === 'number' ? usd(val[k]) : t; };
    const polCell = (k, t) => { if (t === 'No aplica') return COL.gris; const F = POL.favorable || {}, D = POL.desfavorable || {}, m = (o) => Object.keys(o).find(p => p === k || (p.endsWith('*') && k.indexOf(p.slice(0, -1)) === 0)); const f = m(F), x = m(D); if (f && F[f] === t) return COL.fav; if (x && D[x] === t) return COL.des; return {}; };
    const origen = (k) => { const m = ctx.meta[k]; return esInf && m && m.doc ? 'Extraído de ' + m.doc + (m.conf != null ? ' · ' + m.conf + ' %' : '') : ''; };
    const cell = (t, o) => Object.assign({ t, fw: 400, sub: '', hasSub: false }, o || {});
    const valCell = (k) => { const t = txt(k), s = origen(k); return Object.assign(cell(t == null ? RAYA : t), t != null ? polCell(k, t) : {}, s ? { sub: s, hasSub: true } : {}); };
    let nT = 0, nF = 0, nC = 0; const out = [];
    const tabla = (titulo, cols, rows, extra) => { nT++; return Object.assign({ isTable: true, split: false, caption: 'Tabla ' + nT + ' · ' + titulo, cols: cols.map(l => ({ l })), rows: rows.map(r => ({ cells: r })), nota: '' }, extra || {}); };
    const parear = (rows) => { if (rows.length < 2 || rows.some(r => String(r[1].t || '').length > 40)) return { cols: ['Campo', 'Valor'], rows }; const rs = []; for (let i = 0; i < rows.length; i += 2) { const b = rows[i + 1] || [cell(''), cell('')]; rs.push([rows[i][0], rows[i][1], b[0], b[1]]); } return { cols: ['Campo', 'Valor', 'Campo', 'Valor'], rows: rs }; };
    const tablaCampos = (titulo, ks) => { const rows = ks.filter(visible).map(k => [cell(lab(k), { fw: 700 }), valCell(k)]); if (!rows.length) return null; const p = parear(rows); return tabla(titulo, p.cols, p.rows); };
    const conValor = (ks) => ks.some(k => visible(k) && txt(k) != null);
    const chap = (t, sub) => { if (!sub.length) return; nC++; out.push({ isChap: true, titulo: nC + '. ' + t }); sub.forEach(x => out.push(x)); };
    const resLinea = (l, v, ic) => ({ l, v, hasIc: !!ic, icD: ic ? ic[0] : '', icC: ic ? ic[1] : '' });
    // Portada (SIRIUS_SALIDA_VEH.portada).
    const P = S.portada || {}, filas = (P.filas || []).filter(f => esInf || !(P.soloInforme || []).includes(f[0])).map(f => { const src = f[1];
      let t = src === 'caso.numero' ? ctx.caso : src === 'caso.asegurado' ? (ctx.asegurado || RAYA) : src === 'veh.descripcion' ? (ctx.descripcion || RAYA) : src === 'resultado.texto' ? R.texto : src === 'emision.poliza' ? ((R.emi && R.emi.poliza) || RAYA) : (txt(src) || RAYA);
      return src === 'resultado.texto' ? resLinea(f[0], t, R.icon) : resLinea(f[0], t, null); });
    out.push({ isCover: esInf, isHead: !esInf, kicker: 'Aseguradora del Sur', titulo: (P.titulo || {})[id] || d.nombre, filas });
    // Fotos del vehículo (evidencias), con leyenda «etiqueta · placa» y fecha, hora, GPS y dispositivo.
    const PASOS = T.pasos || [], EV = ((E().evidencias || {})[ctx.rid] || {}).fotos || {};
    const CXF = window.SiriusFotosCx && ctx.caso ? window.SiriusFotosCx.lista(ctx.caso) : null; // etapa C2-16: con la conexión, las fotos son las evidencias de la base del caso
    const fotosDe = (nombres) => { if (CXF) { const L0 = CXF.filter(x => x.estado !== 'Excluida' && (!nombres || nombres.includes(x.s.name))).map(x => ({ f: Object.assign({ cx: true }, x.f), p: x.s })); if (nombres) L0.sort((a, b) => nombres.indexOf(a.p.name) - nombres.indexOf(b.p.name)); return L0; }
      const L = []; PASOS.forEach(p => { if (nombres && !nombres.includes(p.name)) return; (EV[p.id] || []).forEach(f => L.push({ f, p })); }); if (nombres) L.sort((a, b) => nombres.indexOf(a.p.name) - nombres.indexOf(b.p.name)); return L; };
    const fotoItem = (o, etq) => { nF++; const f = o.f, g = f.gps ? 'GPS ' + String(f.gps.lat).replace('.', ',') + ', ' + String(f.gps.lng).replace('.', ',') : 'Sin GPS'; return { label: 'Foto ' + nF + ' · ' + (etq || (o.p.group + ' · ' + (f.fila ? f.fila.label : o.p.name))) + ' · ' + (ctx.placa || ctx.rid), meta: [f.at, g, f.disp].filter(Boolean).join(' · '), ph: f.cx ? (f.url ? '' : 'Sin imagen') : 'Foto de ejemplo · ' + f.id, hasSrc: !!f.url, src: f.url || '' }; };
    // Grillas.
    const labN = (x) => { const n = Number(String(x).replace(',', '.')), L = POL.labrado || {}; return !isFinite(n) ? {} : n < (L.desfavorableMenorA || 1.6) ? COL.des : n < (L.atencionMenorA || 3) ? COL.aten : {}; };
    const neuTabla = () => { if (!ctx.neu.length) return null; const conf = esInf && ctx.neu.some(r => r.conf != null); return tabla('Neumáticos', ['Posición', 'Marca', 'Medida', 'Labrado (mm)'].concat(conf ? ['Confianza'] : []), ctx.neu.map(r => [cell(r.pos, { fw: 700 }), cell(r.marca || RAYA), cell(r.medida || RAYA), Object.assign(cell(r.labrado || RAYA), r.labrado ? labN(r.labrado) : {})].concat(conf ? [cell(r.conf != null ? r.conf + ' %' : RAYA)] : []))); };
    const aveTabla = () => { if (!ctx.ave.length) return null; return tabla('Averías', ['Pieza', 'Tipo de daño', 'Gravedad', 'Superficie (dm²)'].concat(esInf ? ['Origen'] : []), ctx.ave.map(a => [cell(a.pieza || RAYA, { fw: 700 }), cell(a.tipo || RAYA), cell(a.grav || RAYA), cell(a.sup || RAYA)].concat(esInf ? [cell(a.conf != null ? 'Extracción automática · ' + a.conf + ' %' + (a.by ? ' · aceptada por ' + a.by + (a.at ? ' el ' + a.at : '') : '') : a.by ? 'Registrada por ' + a.by : RAYA)] : []))); };
    const extTabla = () => { if (!ctx.ext.length) return null; return tabla(esInf ? 'Extras' : 'Accesorios y extras declarados', ['Descripción', 'Marca', colMon('Valor (USD)')], ctx.ext.map(x => [cell(x.desc || RAYA, { fw: 700 }), cell(x.marca || RAYA), cell(vacio(x.valor) ? RAYA : usd(window.SIRIUS_COMPANIA.leerMonto(x.valor)))])); };
    const TES = (campos.tes || []).map(f => f.k);
    const resultadoBloque = (variante) => { const it = [resLinea('Resultado', R.texto, R.icon)]; if (R.veredicto === 'Asegurable') it.push(resLinea('Cobertura', R.cobertura || RAYA)); if (R.veredicto === 'No asegurable') it.push(resLinea('Motivo', R.motivo || RAYA));
      if (variante === 'informe' && R.origen) it.push(resLinea('Origen del veredicto', R.origen)); return { isResult: true, items: it }; };

    if (!esInf) {
      d.secciones.forEach(sec => { const sub = [];
        if (sec.campos) { const t = tablaCampos(sec.titulo, sec.campos); if (t && conValor(sec.campos)) sub.push(t); }
        else if (sec.bloque === 'resultado') sub.push(resultadoBloque('resumen'));
        else if (sec.bloque === 'preexistencias') { const a = aveTabla(), n = neuTabla(), conTes = TES.some(k => txt(k) != null), enc = TES.filter(k => val[k] === 'Encendido');
          if (a) sub.push(a); if (n) sub.push(n);
          if (enc.length) sub.push(tabla('Testigos encendidos', ['Testigo', 'Estado'], enc.map(k => [cell(lab(k), { fw: 700 }), Object.assign(cell('Encendido'), COL.des)]))); else if (conTes) sub.push({ isLine: true, texto: 'Ningún testigo encendido' });
          if (sub.length && sec.nota) sub.unshift({ isText: true, titulo: '', texto: sec.nota }); }
        else if (sec.bloque === 'extras') { const t = extTabla(); if (t) sub.push(t); }
        else if (sec.fotos) { const L = []; sec.fotos.forEach(n => fotosDe([FOTO_PASO[n] || n]).slice(0, 1).forEach(o => L.push(fotoItem(o, n)))); if (L.length) sub.push({ isPhotos: true, items: L }); }
        chap(sec.titulo, sub); });
    } else {
      d.secciones.forEach(sec => { const sub = [], ks = sec.modulo ? (campos[sec.modulo] || []).filter(f => f.t !== 'Grilla' && f.t !== 'Foto').map(f => f.k) : [];
        if (sec.modulo === 'acc') { const sn = ks.filter(k => (def[k] || {}).t === 'Sí/No'), otros = ks.filter(k => !sn.includes(k));
          const t = tablaCampos(sec.titulo, otros.filter(visible)); const tiene = sn.filter(k => val[k] === 'Sí').map(lab), no = sn.filter(k => val[k] === 'No').map(lab), sd = sn.filter(k => txt(k) == null).map(lab);
          if (conValor(ks)) { if (t) sub.push(t); const groups = [{ l: 'Tiene', items: tiene }, { l: 'No tiene', items: no }].concat(sd.length ? [{ l: 'Sin dato', items: sd }] : []).filter(g => g.items.length).map(g => ({ l: g.l, items: g.items.map(x => ({ t: x })) })); if (groups.length) sub.push({ isGrid: true, titulo: 'Equipamiento', groups }); } }
        else if (sec.grilla === 'neu') { const t = neuTabla(); if (t) sub.push(t); }
        else if (sec.grilla === 'ext') { const t = extTabla(); if (t) sub.push(t); }
        else if (sec.grilla === 'ave') { const t = aveTabla(); if (t) sub.push(t); }
        else if (sec.grilla === 'vex') { if (ctx.vex.length) sub.push(tabla('Verificaciones externas', ['Consulta', 'Resultado', 'Fecha y hora', 'Forma', 'Observación'], ctx.vex.map(r => [cell(r.consulta, { fw: 700 }), Object.assign(cell(r.res || RAYA), r.res === 'Sin novedad' ? COL.fav : r.res === 'Con novedad' ? COL.des : {}), cell(r.at || RAYA), cell(r.forma || RAYA), cell(r.obs || RAYA)]))); }
        else if (sec.bloque === 'valores') { const ks2 = ['veh_valor_asegurado_casco', 'veh_valor_asegurado_extras', 'veh_valor_asegurado_total', 'veh_valor_sugerido_casco', 'veh_valor_sugerido_extras', 'veh_valor_sugerido_total'];
          if (ks2.some(k => txt(k) != null)) { const rows = ks2.map(k => [cell(lab(k), { fw: 700 }), cell(txt(k) || RAYA)]); const AL = S.alertas || [], al = (k) => AL.find(a => a.campo === k) || {};
            const dif = val.veh_diferencia_valor, u1 = al('veh_diferencia_valor').umbral || 10, a1 = dif == null ? '' : dif < -u1 ? 'Posible sobreseguro' : dif > u1 ? 'Posible infraseguro' : '';
            const exs = val.veh_extras_sobre_casco, u2 = al('veh_extras_sobre_casco').umbral || 20, a2 = exs != null && exs > u2 ? 'Extras sobre el límite' : '';
            rows.push([cell(lab('veh_diferencia_valor'), { fw: 700 }), Object.assign(cell(dif == null ? RAYA : pct1(dif) + (a1 ? ' · ' + a1 : '')), a1 ? COL.des : {})]);
            rows.push([cell(lab('veh_extras_sobre_casco'), { fw: 700 }), Object.assign(cell(exs == null ? RAYA : (Math.round(exs * 10) / 10).toFixed(1).replace('.', ',') + ' %' + (a2 ? ' · ' + a2 : '')), a2 ? COL.des : {})]);
            const tv = tabla('Valores', ['Concepto', 'Valor'], rows); tv.nota = 'Asegurado: de la solicitud. Sugerido de extras: suma de la grilla de extras. Diferencia: (sugerido del casco − asegurado del casco) ÷ asegurado del casco. Extras sobre el casco: asegurado de extras ÷ asegurado del casco.'; sub.push(tv); } }
        else if (sec.bloque === 'resultado') { sub.push(resultadoBloque('informe'));
          if (R.reglas.length) sub.push(tabla('Reglas que lo enviaron a calificación', ['Regla', 'Detalle'], R.reglas.map(r => [cell(r.regla + (r.pct ? ' · ' + r.pct : ''), { fw: 700 }), cell(r.detalle || RAYA)])));
          const dec = txt('veh_decision_inspector'), mk = val.veh_decision_inspector === 'Enviar a calificación' ? 'veh_motivo_envio_a_calificacion' : val.veh_decision_inspector === 'Determinar como no asegurable' ? 'veh_motivo_no_asegurable' : '';
          const rows = [[cell(lab('veh_decision_inspector'), { fw: 700 }), valCell('veh_decision_inspector')]]; if (dec && mk) rows.push([cell(lab(mk), { fw: 700 }), valCell(mk)]); ['veh_condiciones_poliza', 'veh_observacion_general'].forEach(k => { if (txt(k) != null) rows.push([cell(lab(k), { fw: 700 }), valCell(k)]); });
          const e = R.emi; rows.push([cell('Resultado de emisión', { fw: 700 }), cell(!e ? RAYA : [e.res, e.poliza].filter(Boolean).join(' · ') + (e.motivo ? ' · Motivo: ' + e.motivo : '') + (e.autorizador ? ' · Autorizó: ' + e.autorizador : ''), e && e.res === 'Emitido por excepción' ? COL.aten : {})]);
          sub.push(tabla('Decisión y emisión', ['Campo', 'Valor'], rows)); }
        else if (sec.fotos === 'todas') { const L = fotosDe(null); if (L.length) sub.push({ isPhotos: true, items: L.map(o => fotoItem(o)) }); }
        else if (sec.modulo) { if (sec.modulo === 'uso' && val.veh_kilometraje_anual != null && !ks.includes('veh_kilometraje_anual')) ks.push('veh_kilometraje_anual'); if (conValor(ks)) { const t = tablaCampos(sec.titulo, ks); if (t) sub.push(t); } }
        chap(sec.titulo, sub); });
      // Cierre: firmas (SIRIUS_SALIDA_VEH.documentos[informe].cierre).
      const pres = val.veh_modalidad_realizada === 'Presencial', fi = [];
      if (pres) fi.push({ rol: 'Quien atiende' + (val.veh_relacion_asegurado ? ' · ' + val.veh_relacion_asegurado : ''), nombre: txt('veh_persona_atiende') || RAYA, fecha: (txt('veh_firma_atiende') ? txt('veh_firma_atiende') + ' · ' : '') + (txt('veh_fecha_hora_inspeccion') || RAYA) });
      fi.push({ rol: 'Inspector que ejecutó', nombre: txt('veh_inspector_ejecuto') || RAYA, fecha: txt('veh_fecha_hora_carga') || txt('veh_fecha_hora_inspeccion') || RAYA });
      if (R.calificador) fi.push({ rol: 'Calificador', nombre: R.calificador.nombre, fecha: R.calificador.fecha || RAYA });
      out.push({ isFirmas: true, items: fi, nota: pres ? '' : 'Sin firma de quien atiende: la modalidad es ' + (val.veh_modalidad_realizada || RAYA) + ' (solo Presencial).' });
    }
    const pie = 'Aseguradora del Sur · Caso ' + ctx.caso + ' · ' + (ctx.placa || ctx.rid) + ' · ' + d.nombre + (esInf ? ' · Uso interno' : '') + ' · Página X de Y';
    return { id, nombre: d.nombre, destino: d.destino, archivo: archivo(id, ctx), pie, blocks: out };
  }

  window.SiriusSalidaVeh = { contexto, contextoCx, riesgosCx, disponibilidadCx, resultado, disponibilidad, documento, archivo, zipNombre, adjuntos, etiqueta, vehiculo, placaDe };
})();
