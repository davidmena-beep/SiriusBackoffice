// SIRIUS · Lectura del informe de la base (v1.0 · etapa P-1c2 · DEC-272 · 22/11/2026)
// Una sola lectura de informes[caso].respuestas para la pestaña Informe (etapa C2-8) y el PDF de Vehículos: cada campo por su clave de la plantilla
// (veh_*) y, si no está, por la clave de la app (APP_K). El valor llega como texto o como { valor, org, conf, solicitud, confirmadoPor, documento }.
// Lo guardado o completado en el back-office llega con la clave de la plantilla y por eso tiene prioridad sobre lo de la app. Antes vivía en el
// Back-office (cxResp y cxSpecInforme); ahora el Back-office y SiriusSalidaVeh.contextoCx la usan desde aquí.
(function () {
  const APP_K = { veh_placa: 'placa', veh_vin: 'vin', veh_numero_motor: 'motor', veh_anio_modelo: 'anio', veh_color: 'color', veh_kilometraje: 'km', veh_marca: 'marca', veh_modelo: 'modelo' };
  const ORG = { sistema: 'Sistema', campo: 'Campo', solicitud: 'Solicitud', lectura: 'Lectura', corregido: 'Corregido en campo', bo: 'Back-office', placas: 'Servicio de placas', calc: 'Cálculo', vacio: 'Por completar' };
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  // Claves de los campos de la plantilla (por defecto «Vehículos livianos v1», como la pestaña Informe).
  function claves(T) { const t = T || ((window.SIRIUS_EJEMPLO || {}).plantillas || {})['Vehículos livianos v1'] || {}, out = []; Object.keys(t.campos || {}).forEach((sid) => (t.campos[sid] || []).forEach((fd) => out.push(fd.k))); return out; }
  // Vehículo (riesgo) de un informe: riesgoId, o el texto «riesgo» con la placa, el id o la etiqueta del vehículo.
  function ridDe(i, riesgos) { if (!i) return ''; const rs = riesgos || [], ids = rs.map((r) => String(r.id)); if (i.riesgoId && ids.includes(String(i.riesgoId))) return String(i.riesgoId); const q = String(i.riesgo || '').trim().toUpperCase(); if (!q) return '';
    const r = rs.find((x) => String(x.id).toUpperCase() === q || [x.label, x.placa].some((y) => y && String(y).toUpperCase() === q)) || rs.find((x) => x.label && String(x.label).length >= 4 && q.indexOf(String(x.label).toUpperCase()) >= 0); return r ? String(r.id) : ''; }
  // Respuestas leídas: { [clave]: { val, org, conf, sol, confBy, doc, app } }. L: informes del vehículo; rv: su riesgo de la solicitud (riesgosBase) para casco y extras.
  function respuestas(L, keys, rv) { const out = {}, ks = keys || claves();
    const pick = (k) => { for (const inf of L || []) { const r = (inf && inf.respuestas) || {}; if (has(r, k) && r[k] != null) return r[k]; } return null; };
    ks.forEach((k) => { let x = pick(k), app = false; if (x == null && APP_K[k]) { x = pick(APP_K[k]); app = true; } if (x == null) return;
      const o = typeof x === 'object' && !Array.isArray(x) ? x : { valor: x }; if (o.valor != null && typeof o.valor === 'object') return;
      let val = o.valor == null ? '' : String(o.valor).trim(); if (k === 'veh_kilometraje' || k === 'veh_anio_modelo') val = val.replace(/\D/g, '');
      const n = o.conf == null || o.conf === '' ? NaN : Number(o.conf), cf = isNaN(n) ? undefined : Math.round(n <= 1 ? n * 100 : n);
      out[k] = { val, org: String(o.org || ''), conf: cf, sol: o.solicitud != null && o.solicitud !== '' ? String(o.solicitud) : '', confBy: o.confirmadoPor || '', doc: o.documento ? String(o.documento) : '', app }; });
    // P-6f-0 · DEC-219: si la respuesta no trae el casco o los extras de la solicitud, se toman de riesgosBase con origen «Solicitud» (bloqueados).
    if (rv) { const ok = (x) => x != null && x !== '' && isFinite(Number(x)), poner = (k, n) => { if (!ok(n)) return; const x = out[k], v = String(Number(n)); if (!x || x.val === '') out[k] = { val: v, org: 'Solicitud', sol: '', confBy: '', doc: '', app: false, rb: true }; else if (!/^solicitud/i.test(x.org) && !x.sol) x.sol = v; };
      poner('veh_valor_asegurado_casco', rv.suma); poner('veh_valor_asegurado_extras', (rv.datos || {}).valorExtras); }
    return out; }
  // Valores de la pestaña Informe (lo que ve el campo con la conexión): el valor de la respuesta, más la observación y la decisión de la app si el formulario no las trae.
  function valores(R, inf0) { const out = {}; Object.keys(R || {}).forEach((k) => { if (R[k].val !== '') out[k] = R[k].val; });
    const r0 = (inf0 || {}).respuestas || {}; if (r0.obs && !(R || {}).veh_observacion_general) out.veh_observacion_general = String(r0.obs);
    const det = String((inf0 || {}).determinacion || '').toLowerCase(); if (det && !(R || {}).veh_decision_inspector) out.veh_decision_inspector = det === 'asegurable' ? 'Determinar como asegurable' : /^no/.test(det) ? 'Determinar como no asegurable' : 'Enviar a calificación';
    return out; }
  // Lo que se pinta en el formulario (origen y confianza de cada campo): la misma lectura con la forma del formulario.
  function spec(R, inf0) { const V = window.SiriusCxVistas || {}, out = {};
    Object.keys(R || {}).forEach((k) => { const r = R[k], o = r.org; if (/^solicitud/i.test(o) || /^por completar/i.test(o)) return; if (r.val === '') { if (!r.app) out[k] = { v: '' }; return; }
      const m = /^(foto|ocr|lectura)\s*(?:[:·]\s*(.+))?$/i.exec(o);
      if (m) { out[k] = Object.assign({ v: r.val, src: 'ext', doc: m[2] ? 'Foto «' + (V.etiqueta ? V.etiqueta(m[2].trim()) : m[2]) + '»' : r.doc || 'foto o documento', conf: r.conf }, r.confBy ? { confBy: r.confBy } : {}); return; }
      const oK = /^sistema/i.test(o) ? 'sistema' : /corregid/i.test(o) ? 'corregido' : /back.?office|editado/i.test(o) ? 'bo' : null;
      out[k] = Object.assign({ v: r.val, src: /placas/i.test(o) ? 'placas' : oK === 'bo' ? 'bo' : r.app || /inspector|campo|app/i.test(o) ? 'app' : 'cx' }, oK ? { orgK: oK } : {}, r.sol ? { sol: r.sol } : {}); });
    const r0 = (inf0 || {}).respuestas || {}; if (r0.obs && !(R || {}).veh_observacion_general) out.veh_observacion_general = { v: String(r0.obs), src: 'app' };
    const det = String((inf0 || {}).determinacion || '').toLowerCase(); if (det && !(R || {}).veh_decision_inspector) out.veh_decision_inspector = { v: det === 'asegurable' ? 'Determinar como asegurable' : /^no/.test(det) ? 'Determinar como no asegurable' : 'Enviar a calificación', src: 'app' };
    return out; }
  // Grillas de las respuestas (neumáticos, extras, averías y verificaciones externas), con la forma de informe.grillas del prototipo:
  // neu { posición: { marca, medida, labrado } } · ext { descripción: { marca, valor } } y extManual [] · ave [] · vex { fuente: { res, at, obs, forma } }.
  function grillas(L) { const pick = (k) => { for (const inf of L || []) { const r = (inf && inf.respuestas) || {}; if (has(r, k) && r[k] != null) { const x = r[k], v = x && typeof x === 'object' && !Array.isArray(x) ? x.valor : x; if (Array.isArray(v)) return v; } } return null; };
    const out = {}, s = (x) => x == null ? '' : String(x);
    const neu = pick('veh_neumaticos'); if (neu) { out.neu = {}; neu.forEach((n) => { const p = s(n.pos || n.posicion); if (p) out.neu[p] = { marca: s(n.marca), medida: s(n.medida), labrado: s(n.labrado) }; }); }
    const ext = pick('veh_extras'); if (ext) { out.extManual = ext.map((e) => ({ desc: s(e.desc || e.descripcion), marca: s(e.marca), valor: s(e.valor), src: 'inspector' })).filter((e) => e.desc); }
    const ave = pick('veh_averias'); if (ave) out.ave = ave.map((a) => ({ pieza: s(a.pieza), tipo: s(a.tipo || a.tipoDano), grav: s(a.grav || a.gravedad), prof: s(a.prof || a.profundidad), sup: s(a.sup || a.superficie), desc: s(a.desc || a.descripcion), estado: a.estado || 'aceptada' })).filter((a) => a.pieza);
    const vex = pick('veh_verificaciones_externas'); if (vex) { out.vex = {}; vex.forEach((v) => { const c = s(v.consulta || v.fuente || v.c); if (c) out.vex[c] = { res: s(v.res || v.resultado), at: s(v.at || v.consultada), obs: s(v.obs), forma: s(v.forma) }; }); }
    return out; }
  window.SiriusCxInforme = { version: '1.0', APP_K, ORG, claves, ridDe, respuestas, valores, spec, grillas };
})();
