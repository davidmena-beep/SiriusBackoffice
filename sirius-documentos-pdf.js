// SIRIUS · Renderizador de documentos PDF desde el modelo común (etapa DP1 · DEC-125 y DEC-126).
// Lee SIRIUS_DOCUMENTOS_PDF (documentos, secciones, tiposSeccion, modosCampo, hallazgosVeh, logos, estilo) y arma cada documento
// como bloques HTML atómicos que pagina el motor común (sirius-pdf.js): un renderizador por tipo de sección.
// Valores: SiriusSalidaVeh.contexto (SIRIUS_EJEMPLO.vehiculos, SIRIUS_INFORME_VEH) y SIRIUS_EJEMPLO.evidencias. Nada se inventa:
// un campo vacío no se imprime, una sección sin contenido no aparece y los capítulos se renumeran sin huecos.
// Todos los estilos van en línea y el diagrama usa atributos de presentación (sin clases ni <use>) para que la vista previa,
// html2canvas y el PDF se vean iguales. Etapa DP2: el modelo de la sesión (versiones, borradores, estilo, logos e historial) y la
// migración de Ramos Generales (rg-informe y rg-resumen como secciones; CalificacionRG los arma con su composición de siempre).
(function () {
  const RAYA = '—';
  const DP = () => window.SIRIUS_DOCUMENTOS_PDF || {}, E = () => window.SIRIUS_EJEMPLO || {}, SV = () => window.SIRIUS_SALIDA_VEH || {};
  const vacio = (x) => x == null || x === '' || (Array.isArray(x) && !x.length);
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const C = { ink: '#14263f', muted: '#5b6b80', line: '#d9e0e8', brand: '#0B2E59', acc: '#0B5CAD', ok: '#1f7a5c', okbg: '#e7f4ee', bad: '#b42318', badbg: '#fdecea', warn: '#9a6400', warnbg: '#fdf3dc', soft: '#f3f6f9' };
  const GRAV = { Alta: { c: '#b42318', bg: C.badbg, fg: C.bad, o: 3 }, Media: { c: '#b7791f', bg: C.warnbg, fg: C.warn, o: 2 }, Baja: { c: '#6b7a8c', bg: C.soft, fg: C.muted, o: 1 } };
  const SEV = { alta: { o: 3, t: 'ALTA', bg: C.badbg, fg: C.bad }, media: { o: 2, t: 'MEDIA', bg: C.warnbg, fg: C.warn }, baja: { o: 1, t: 'BAJA', bg: C.soft, fg: C.muted } };
  const DOC_ID = { informe: 'veh-informe', resumen: 'veh-resumen' };
  const DOC_ID_EM = { informe: 'em-informe', resumen: 'em-resumen' };   // etapa 8b · Equipo y maquinaria

  // ---------- Formato ----------
  function miles(n, dec) { const neg = n < 0, a = Math.abs(n), s = dec ? a.toFixed(dec).replace('.', ',') : Number.isInteger(a) ? String(a) : String(Math.round(a * 10) / 10).replace('.', ','); const m = /^(\d+)(,\d+)?$/.exec(s); return (neg ? '−' : '') + (m ? m[1].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (m[2] || '') : s); }
  const usd = (n) => window.SIRIUS_COMPANIA.formatoMonto(n); // dinero: siempre con el formato de la compañía (moneda, decimales, separadores)
  const colMon = (c) => String(c).replace('(USD)', '(' + window.SIRIUS_COMPANIA.moneda.codigo + ')');
  const pct = (n, signo) => { const r = Math.round(n * 10) / 10; return (signo && r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r).toFixed(1).replace('.', ',') + ' %'; };
  const num = (x) => { if (vacio(x)) return null; const n = Number(String(x).replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : null; };
  const numDec = (x) => { if (vacio(x)) return null; const n = Number(String(x).replace(',', '.')); return isFinite(n) ? n : null; };
  // «16/10/26 · 09:15» → «16/10/2026 · 09:15»; «2026-10-16» → «16/10/2026».
  function f4(s) { if (vacio(s)) return ''; const t = String(s), m = /^(\d\d)\/(\d\d)\/(\d\d)(?!\d)(.*)$/.exec(t); if (m) return m[1] + '/' + m[2] + '/20' + m[3] + m[4]; const i = /^(\d{4})-(\d\d)-(\d\d)/.exec(t); return i ? i[3] + '/' + i[2] + '/' + i[1] : t; }
  const sinPunto = (s) => String(s || '').replace(' · ', ' ');
  function fecha(s) { const m = /^(\d\d)\/(\d\d)\/(\d{2,4})/.exec(String(s || '')); if (!m) return null; const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]); return new Date(y, Number(m[2]) - 1, Number(m[1])); }
  function hoy() { const e = E(); return e.hoy ? e.hoy() : new Date(2026, 9, 18); }
  function ahora() { const e = E(); return e.ahora ? e.ahora() : new Date(2026, 9, 18, 20, 30); }
  const z2 = (n) => String(n).padStart(2, '0');
  const fmtAhora = () => { const d = ahora(); return z2(d.getDate()) + '/' + z2(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + z2(d.getHours()) + ':' + z2(d.getMinutes()); };
  // Primera letra en minúscula, salvo siglas (ABS, VIN, GPS).
  const lc1 = (s) => { s = String(s || ''); return /^[A-ZÁÉÍÓÚÑ]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1); };
  const uc1 = (s) => { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  const unir = (l) => l.length <= 1 ? (l[0] || '') : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1];
  // Código de verificación: 8 caracteres sin ambigüedad (sin 0/O, 1/I/L), estable por documento.
  function codigo(s) { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let h1 = 2166136261, h2 = 5381; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 16777619) >>> 0; h2 = (Math.imul(h2, 33) + c) >>> 0; } let o = ''; for (let i = 0; i < 8; i++) { const v = i < 4 ? (h1 >>> (i * 7)) : (h2 >>> ((i - 4) * 7)); o += A[v % A.length]; } return o.slice(0, 4) + '-' + o.slice(4); }

  // ---------- Piezas del bloque HTML ----------
  const H2 = (n, t) => '<h2 style="margin:0 0 6px;padding-bottom:3px;border-bottom:1px solid ' + C.line + ';font-size:10.5pt;line-height:1.3;font-weight:800;color:' + C.brand + '">' + (n ? '<span style="color:' + C.acc + ';margin-right:6px">' + n + '</span>' : '') + esc(t) + '</h2>';
  const RUN = (n, t, html) => ({ compact: true, html: '<p style="margin:0;padding:0 0 5px;border-bottom:1px dotted ' + C.line + ';font-size:9.5pt;line-height:1.45;color:' + C.ink + '"><b style="font-size:10pt;font-weight:800;color:' + C.brand + '">' + (n ? '<span style="color:' + C.acc + ';margin-right:6px">' + n + '</span>' : '') + esc(t) + ':</b> ' + html + '</p>' });
  const H3 = (t) => '<h3 style="margin:0 0 6px;font-size:9pt;font-weight:800;color:' + C.ink + '">' + esc(t) + '</h3>';
  const P = (html, o) => '<p style="margin:0;font-size:9.5pt;line-height:1.45;color:' + C.ink + (o || '') + '">' + html + '</p>';
  const TH = (t, al) => '<th style="background:' + C.brand + ';color:#fff;text-align:' + (al || 'left') + ';font-weight:700;padding:5px 6px;font-size:9pt">' + t + '</th>';
  const TD = (t, o) => '<td style="padding:5px 6px;border-bottom:1px solid ' + C.line + ';font-size:9pt;vertical-align:top' + (o || '') + '">' + t + '</td>';
  const TABLE = (head, rows, extra) => '<table style="width:100%;border-collapse:collapse;font-size:9pt;color:' + C.ink + (extra || '') + '"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table>';
  const tag = (t, bg, fg) => '<span style="display:inline-block;font-size:7.5pt;line-height:1.5;font-weight:800;border-radius:3px;padding:0 6px;white-space:nowrap;background:' + bg + ';color:' + fg + '">' + esc(t) + '</span>';
  const campoHtml = (l, v) => '<div style="display:flex;flex-direction:column;padding:3px 0;border-bottom:1px dotted ' + C.line + ';min-width:0"><span style="color:' + C.muted + ';font-size:7.5pt">' + esc(l) + '</span><span style="font-size:9pt;color:' + C.ink + ';overflow-wrap:anywhere">' + esc(v) + '</span></div>';
  const fotoPh = (txt, h, bg) => '<div style="height:' + h + ';display:flex;align-items:center;justify-content:center;text-align:center;padding:4px;box-sizing:border-box;border-radius:4px;background:' + (bg || '#e9eef4') + ';background-image:repeating-linear-gradient(45deg,#eef2f6 0,#eef2f6 8px,#e5eaf0 8px,#e5eaf0 16px);color:' + C.muted + ';font-weight:700;font-size:8pt">' + esc(txt) + '</div>';

  // ---------- Fotos del vehículo con su número F-n ----------
  // Numeración del vehículo en el orden de los pasos de la plantilla (la misma de «Fotos y evidencias»).
  function fotosVeh(ctx) { const T = ctx.T || {}, EV = ((E().evidencias || {})[ctx.rid] || {}).fotos || {}, out = []; let n = 0;
    (T.pasos || []).forEach(p => (EV[p.id] || []).forEach(f => { n++; out.push({ n, f, p, F: 'F-' + n }); })); return out; }
  function gpsTxt(f, dec) { if (!f.gps) return 'Sin GPS'; const d = dec || 5, x = (v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d).replace('.', ','); return x(f.gps.lat) + ', ' + x(f.gps.lng); }
  function dispCorto(d) { return String(d || '').split(' · ')[0]; }

  // ---------- Contexto del documento ----------
  function preparar(ctx, opts) {
    const o = opts || {}, T = ctx.T || {}, campos = T.campos || {}, def = {};
    Object.keys(campos).forEach(s => (campos[s] || []).forEach(f => { def[f.k] = Object.assign({ sec: s }, f); }));
    const casos = E().casos || [], c0 = casos.find(c => c.id === ctx.caso) || {}, caso = Object.assign({ numero: ctx.caso, asegurado: ctx.asegurado || c0.asegurado || '', ident: c0.ident || '', comercial: c0.comercial || '', broker: c0.broker || '', fecha: c0.fecha || '', backoffice: c0.backoffice || '' }, o.caso || {});
    if (!caso.asegurado && ctx.asegurado) caso.asegurado = ctx.asegurado;
    const fotos = fotosVeh(ctx), insp = (E().inspectores || []).find(i => i.n === (ctx.val.veh_inspector_ejecuto || ctx.val.em_inspector_ejecuto)) || null;
    return Object.assign({}, ctx, { def, caso, fotos, insp, usuario: o.usuario || '', idx: o.idx || 0, total: o.total || 1 });
  }
  const lab = (d, k) => ((d.def[k] || {}).l) || k;
  const LBL = { veh_modalidad_realizada: 'Modalidad', veh_fecha_hora_inspeccion: 'Fecha y hora', veh_vigencia_matricula: 'Matrícula vigente hasta', veh_gad_matriculacion: 'Matriculado en', veh_camv_cpn: 'CAMV / CPN', veh_nombre_matricula: 'Propietario en la matrícula', veh_interes_asegurable: 'Interés asegurable', veh_contrato_compraventa: 'Contrato de compraventa', veh_nombre_conductor: 'Nombre', veh_edad_conductor: 'Edad', veh_tipo_licencia: 'Tipo de licencia', veh_caducidad_licencia: 'Licencia vigente hasta', veh_puntos_licencia: 'Puntos de la licencia', veh_numero_motor: 'Motor', veh_vin: 'VIN' };
  const NOFMT = /anio|identificacion|cedula|imei|voucher|puntos|edad|pasajeros|airbags|cilindraje/;
  function txt(d, k) { const x = d.val[k]; if (vacio(x)) return null; if (typeof x === 'boolean') return x ? 'Sí' : 'No';
    if (typeof x === 'number') { const s = NOFMT.test(k) ? String(x) : miles(x); return k === 'veh_kilometraje' || k === 'veh_kilometraje_anual' ? s + ' km' : /^veh_valor_/.test(k) ? usd(x) : k === 'veh_edad_conductor' ? s + ' años' : s; }
    return /fecha|vigencia|caducidad/.test(k) ? f4(x) : String(x); }
  const mismoNombre = (a, b) => String(a || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '') === String(b || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  function propDistinto(d) { const n = d.val.veh_nombre_matricula; return !vacio(n) && !vacio(d.caso.asegurado) && !mismoNombre(n, d.caso.asegurado); }
  // Condición de una sección o de un campo («k = v», «distinto del asegurado», «tiene valor», «hay extras», «hay averías»).
  // Condición del diseñador (DEC-127): árbol { items: [ { con: 'Y' | 'O' (desde la 2.ª), campo, op, valor } | { con, grupo: [ …items ] } ] }.
  // Cada condición tiene su conector; Y se evalúa antes que O; un grupo equivale a paréntesis (hasta 2 niveles). op: = ≠ > < «tiene valor» «está vacío» «caducada» (fecha anterior al reloj).
  // Las condiciones de un solo conector { modo, reglas } se leen como árbol sin cambiar su resultado.
  function fechaDe(x) { if (vacio(x)) return null; const t = String(x), i = /^(\d{4})-(\d\d)-(\d\d)/.exec(t); return i ? new Date(+i[1], +i[2] - 1, +i[3]) : fecha(t); }
  function cumpleRegla(d, r) { const v = d.val[r.campo], t = vacio(v) ? '' : String(v), n1 = num(v), n2 = num(r.valor);
    if (r.op === 'tiene valor') return t !== ''; if (r.op === 'está vacío') return t === ''; if (r.op === '≠') return t !== String(r.valor == null ? '' : r.valor);
    if (r.op === 'caducada') { const f = fechaDe(v), h = hoy(); return !!f && f < new Date(h.getFullYear(), h.getMonth(), h.getDate()); }
    if (r.op === '>' || r.op === '<') return n1 != null && n2 != null && (r.op === '>' ? n1 > n2 : n1 < n2); return t === String(r.valor == null ? '' : r.valor); }
  const itemValido = (it) => !!it && (it.grupo ? it.grupo.some(itemValido) : !!it.campo);
  function arbol(c) { if (!c || typeof c !== 'object') return null; if (Array.isArray(c.items)) return c; return { items: (c.reglas || []).map((r, j) => Object.assign(j ? { con: c.modo === 'O' ? 'O' : 'Y' } : {}, r)) }; }
  // Los términos separados por O son grupos de Y: a Y b O c = (a Y b) O c.
  function terminos(items) { const L = (items || []).filter(itemValido), T = []; L.forEach((it, k) => { if (!k || it.con === 'O') T.push([]); T[T.length - 1].push(it); }); return T; }
  function evalItems(d, items) { const T = terminos(items); if (!T.length) return true; return T.some(t => t.every(it => it.grupo ? evalItems(d, it.grupo) : cumpleRegla(d, it))); }
  function reglaTxt(r, lab) { const l = lab ? lab(r.campo) : r.campo, v = r.valor == null ? '' : String(r.valor); return l + ' ' + (r.op === 'tiene valor' ? 'tiene valor' : r.op === 'está vacío' ? 'está vacío' : r.op === 'caducada' ? 'está caducada' : r.op + ' ' + (/^-?\d+([.,]\d+)?$/.test(v) ? v : '«' + v + '»')); }
  // Frase en lenguaje natural; con conectores mezclados y sin grupos muestra los paréntesis implícitos de Y.
  function fraseItems(items, lab) { const T = terminos(items); if (!T.length) return ''; const itx = (it) => it.grupo ? (terminos(it.grupo).length > 1 || terminos(it.grupo)[0].length > 1 ? '(' + fraseItems(it.grupo, lab) + ')' : fraseItems(it.grupo, lab)) : reglaTxt(it, lab);
    const partes = T.map(t => { const x = t.map(itx).join(' y '); return T.length > 1 && t.length > 1 ? '(' + x + ')' : x; }); return partes.join(' o '); }
  function fraseCond(c, lab) { const A = arbol(c), x = A ? fraseItems(A.items, lab) : ''; return x ? 'Se muestra si ' + x : 'Se muestra siempre'; }
  function cumple(d, cond) { if (!cond) return true;
    if (typeof cond === 'object') { const A = arbol(cond); return evalItems(d, A.items); }
    const c = String(cond).replace(/^condicion:\s*/, '');
    if (/distinto/.test(c)) return propDistinto(d); if (/hay extras/.test(c)) return d.ext.length > 0; if (/hay averías/.test(c)) return d.ave.length > 0; if (/hay evidencia/.test(c)) return d.vex.some(r => r.evidencia); if (/tiene valor/.test(c)) return true;
    const m = /^(\w+)\s*=\s*(.+)$/.exec(c); return m ? String(d.val[m[1]] == null ? '' : d.val[m[1]]) === m[2].trim() : true; }
  // Un campo con su modo (siempre · conValor · excepcion · condicion · nunca). Devuelve { l, v } o null si no se imprime.
  function campo(d, spec, modo) {
    const md = String(modo || 'conValor'); if (md === 'nunca') return null;
    const s = String(spec), k = (/^(veh_\w+)/.exec(s) || [])[1], val = d.val; let l = '', v = null;
    if (k === 'veh_kilometraje' && /km por año/.test(s)) { l = 'Kilometraje'; const t = txt(d, k); v = t == null ? null : t + ' · ' + (val.veh_kilometraje_anual != null ? miles(val.veh_kilometraje_anual) + ' km/año' : RAYA + ' km/año'); }
    else if (k === 'veh_persona_atiende') { l = 'Atendió'; const t = txt(d, k); v = t == null ? null : t + (val.veh_relacion_asegurado ? ' · ' + lc1(val.veh_relacion_asegurado) : ''); }
    else if (k) { l = LBL[k] || lab(d, k); v = txt(d, k); }
    else if (/^inspecci[oó]n\.lugar/.test(s)) { l = 'Lugar'; const ciudad = d.v.lugar || val.veh_ciudad_circulacion || '', f = (d.fotos.find(x => x.f.gps) || {}).f; v = [ciudad, f ? gpsTxt(f, 4) : ''].filter(Boolean).join(' · ') || null; }
    else if (/^inspector/.test(s)) { const i = d.insp, n = val.veh_inspector_ejecuto, mod = val.veh_modalidad_realizada; l = i && i.tipo === 'Agencia' ? 'Agencia' : 'Inspector';
      v = mod === 'Autoinspección' ? 'Autoinspección del cliente' : mod === 'Documental' ? 'No aplica · revisión documental' : !n ? null : i && i.tipo === 'Agencia' ? n + ' · ' + i.ag : n + (i ? ' (' + lc1(i.tipo) + ')' : ''); }
    else if (s === 'caso.sucursal') { l = 'Sucursal'; v = val.veh_agencia || d.caso.sucursal || null; }
    else if (s === 'comercial.nombre') { l = 'Ejecutivo comercial'; v = d.caso.comercial || null; }
    else if (s === 'broker.nombre') { l = 'Bróker (APS)'; v = d.caso.broker || null; }
    else if (s === 'asegurado.nombre') { l = 'Asegurado'; v = d.caso.asegurado || null; }
    else if (s === 'asegurado.identificacion') { const id = String(d.caso.ident || ''); l = id.length === 13 ? 'RUC' : id.length === 10 ? 'Cédula' : 'Identificación'; v = id || null; }
    else { l = s; v = null; }
    if (md === 'siempre') return { l, v: v == null ? RAYA : v };
    if (v == null) return null;
    if (md === 'excepcion') { if (k === 'veh_puntos_licencia') return Number(val[k]) < 10 ? { l, v } : null; const D = (SV().polaridad || {}).desfavorable || {}, pk = Object.keys(D).find(p => p === k || (p.endsWith('*') && k && k.indexOf(p.slice(0, -1)) === 0)); return pk && D[pk] === val[k] ? { l, v } : null; }
    if (/^condicion/.test(md)) return cumple(d, md) ? { l, v } : null;
    return { l, v };
  }

  // ---------- Hallazgos (reglas de SIRIUS_DOCUMENTOS_PDF.hallazgosVeh) ----------
  function hallazgos(d, ids) {
    const R = DP().hallazgosVeh || [], out = [], val = d.val, def = d.def, tes = Object.keys(def).filter(k => /^veh_testigo_/.test(k)), ver = Object.keys(def).filter(k => /^veh_verificacion_/.test(k));
    const regla = (id) => R.find(r => r.id === id) || {}, add = (id, texto, sev) => out.push({ id, texto, sev: sev || regla(id).severidad, ord: out.length });
    const t = (id, o) => String(regla(id).texto || '').replace(/\{(\w+)(?:\/\w+)?\}/g, (m, k) => o[k] != null ? o[k] : m);
    const on = (id) => !ids || ids.includes(id);
    R.forEach(r => { if (!on(r.id)) return; const id = r.id;
      if (id === 'testigo') { const l = tes.filter(k => val[k] === 'Encendido').map(k => lab(d, k)); if (l.length) add(id, t(id, { lista: unir(l) })); }
      else if (id === 'idNoVerificada') { const l = ver.filter(k => val[k] === 'No verificado').map(k => lc1(lab(d, k))); if (l.length) add(id, t(id, { lista: unir(l) })); }
      else if (id === 'externaNovedad') d.vex.filter(x => x.res === 'Con novedad').forEach(x => add(id, t(id, { fuente: x.consulta, detalle: x.obs || 'con novedad' })));
      else if (id === 'propiedad') { if (propDistinto(d) && (vacio(val.veh_interes_asegurable) || val.veh_interes_asegurable === 'No' || val.veh_contrato_compraventa !== 'Sí')) add(id, t(id, { propietario: val.veh_nombre_matricula })); }
      else if (id === 'labradoBajo' || id === 'labradoAtencion') d.neu.forEach(n => { const x = numDec(n.labrado); if (x == null) return; if (id === 'labradoBajo' ? x < 1.6 : x >= 1.6 && x < 3) add(id, t(id, { posicion: lc1(n.pos), labrado: n.labrado })); });
      else if (id === 'averia') { if (!d.ave.length) return; const m = averias(d)[0], n = d.ave.length; add(id, n === 1 ? '1 avería: ' + lc1(m.pieza) + ' (' + m.grav + ')' : t(id, { n, pieza: lc1(m.pieza), gravedad: m.grav }), String(m.grav || 'Baja').toLowerCase()); }
      else if (id === 'diferenciaValor') { const x = val.veh_diferencia_valor; if (x != null && Math.abs(x) > 10) add(id, t(id, { pct: pct(x, true), alerta: x < 0 ? 'posible sobreseguro' : 'posible infraseguro' })); }
      else if (id === 'extrasLimite') { const x = val.veh_extras_sobre_casco; if (x != null && x > 20) add(id, t(id, { pct: pct(x) })); }
      else if (id === 'matricula') { const f = fecha(val.veh_vigencia_matricula); if (f) { const dias = (f - hoy()) / 864e5; if (dias < 0) add(id, 'Matrícula vencida el ' + f4(val.veh_vigencia_matricula)); else if (dias <= 30) add(id, 'Matrícula vence el ' + f4(val.veh_vigencia_matricula)); } }
      else if (id === 'licencia') { const f = fecha(val.veh_caducidad_licencia); if (f && f < hoy()) add(id, t(id, { fecha: f4(val.veh_caducidad_licencia) })); }
      else if (id === 'kmInconsistente') { const km = num(val.veh_kilometraje), an = num(val.veh_anio_modelo), anios = an != null ? hoy().getFullYear() - an : null, porRegla = (d.res.reglas || []).some(x => x.regla === 'Kilometraje inconsistente'); if (porRegla || (km != null && anios != null && km < 1000 && anios > 2)) add(id, t(id, { km: km != null ? miles(km) : RAYA, anios: anios != null ? anios : RAYA })); }
      else if (id === 'fotoGaleria') { const n = d.fotos.filter(x => x.f.marca === 'galeria').length; if (n) add(id, n === 1 ? '1 foto cargada desde la galería' : t(id, { n })); }
      else if (id === 'externaNoDisponible') d.vex.filter(x => x.res === 'Servicio no disponible').forEach(x => add(id, t(id, { fuente: x.consulta, fecha: f4(x.at) || RAYA })));
      else if (id === 'puntos') { const x = num(val.veh_puntos_licencia); if (x != null && x < 10) add(id, t(id, { puntos: x })); }
    });
    return out.sort((a, b) => (SEV[b.sev] || {}).o - (SEV[a.sev] || {}).o || a.ord - b.ord);
  }

  // Averías ordenadas por gravedad (Alta, Media, Baja), con su número, color y foto F-n.
  function averias(d) { if (d._ave) return d._ave; const fotos = d.fotos.filter(x => x.f.fila && x.f.fila.g === 'ave');
    d._ave = d.ave.map((a, i) => ({ a, i })).sort((x, y) => ((GRAV[y.a.grav] || {}).o || 0) - ((GRAV[x.a.grav] || {}).o || 0) || x.i - y.i).map((x, k) => { const ft = fotos.find(f => f.f.fila.label === x.a.pieza) || (x.a.fotoPaso ? d.fotos.find(f => f.p.id === x.a.fotoPaso) : null); return Object.assign({}, x.a, { n: k + 1, color: (GRAV[x.a.grav] || GRAV.Baja).c, foto: ft ? ft.F : '' }); });
    return d._ave; }

  // ---------- Diagrama de averías (lienzo de 700 × 300, 5 vistas a escala común) ----------
  const S = { b: 'fill="#f4f7fa" stroke="#2f3e52" stroke-width="1.8" stroke-linejoin="round"', w: 'fill="#dfe8f1" stroke="#5b6b80" stroke-width="1.2"', ln: 'fill="none" stroke="#9aa7b6" stroke-width="1.1" stroke-linecap="round"', sh: 'fill="none" stroke="#c9d2dc" stroke-width="4" stroke-linecap="round"', ti: 'fill="#2f3e52"', ri: 'fill="#cfd8e2" stroke="#2f3e52" stroke-width="1"', lt: 'fill="#fff6cf" stroke="#5b6b80" stroke-width="1"', tl: 'fill="#f3c4c0" stroke="#5b6b80" stroke-width="1"' };
  const pa = (st, dd) => '<path ' + S[st] + ' d="' + dd + '"/>';
  const rueda = (cx) => '<circle fill="#2f3e52" cx="' + cx + '" cy="103" r="21"/><circle ' + S.ri + ' cx="' + cx + '" cy="103" r="11"/><circle fill="#2f3e52" cx="' + cx + '" cy="103" r="3"/>';
  // Siluetas por carrocería, en unidades del lienzo (largo L entre R y F; ancho W; techo yr; hombros ys; suelo y = 124).
  const MODELOS = {
    suv: { R: 16, F: 308, W: 104, wr: 77, wf: 245, yr: 28, ys: 57,
      lado: { body: 'M16,98 L16,74 C16,62 22,52 32,46 L58,34 C66,30 74,28 84,28 L196,28 C210,28 220,32 230,40 L258,62 L290,68 C302,70 308,78 308,88 L308,98 C308,101 306,103 303,103 L272,103 A26,26 0 0 0 218,103 L104,103 A26,26 0 0 0 50,103 L19,103 C17,103 16,101 16,98 Z',
        win: ['M42,60 L60,40 C64,37 68,36 72,36 L118,36 L118,60 Z', 'M124,60 L124,36 L190,36 C200,36 207,39 213,45 L229,60 Z'], ln: ['M70,25 L200,25', 'M22,66 L300,72', 'M121,60 L121,101 M230,62 L226,101 M44,60 L48,101', 'M262,92 L306,94 M18,92 L48,92'],
        lt: 'M291,71 L305,76 L304,82 L289,79 Z', tl: 'M17,60 L27,58 L27,72 L17,73 Z', esp: 'M229,57 L238,52 C241,51 243,53 242,56 L240,60 L231,61 Z', sh: 'M40,118 L284,118' },
      top: { a: 212, techo: [86, 190], b: 56, b2: 80, capo: 236, puertas: [120, 188], mx: 214, maletero: 38, rieles: true },
      pos: { dF: 174, dR: 84, techoX: 138 } },
    sedan: { R: 16, F: 308, W: 100, wr: 77, wf: 245, yr: 40, ys: 60,
      lado: { body: 'M16,98 L16,72 C16,64 20,60 28,58 L62,56 L90,44 C96,41 102,40 110,40 L180,40 C192,40 202,42 210,48 L236,64 L290,68 C302,70 308,78 308,88 L308,98 C308,101 306,103 303,103 L272,103 A26,26 0 0 0 218,103 L104,103 A26,26 0 0 0 50,103 L19,103 C17,103 16,101 16,98 Z',
        win: ['M70,58 L94,47 C98,45 102,44 108,44 L132,44 L132,58 Z', 'M138,58 L138,44 L180,44 C190,44 198,46 205,51 L216,58 Z'], ln: ['M22,64 L300,72', 'M135,58 L135,101 M218,62 L214,101 M68,60 L72,101', 'M262,92 L306,94 M18,92 L48,92'],
        lt: 'M291,71 L305,76 L304,82 L289,79 Z', tl: 'M17,62 L28,61 L28,72 L17,73 Z', esp: 'M213,57 L222,52 C225,51 227,53 226,56 L224,60 L215,61 Z', sh: 'M40,118 L284,118' },
      top: { a: 206, techo: [118, 186], b: 92, b2: 114, capo: 232, puertas: [135, 200], mx: 212, maletero: 44, tapa: 66 },
      pos: { dF: 176, dR: 103, techoX: 152 } },
    hatchback: { R: 16, F: 272, W: 100, wr: 72, wf: 216, yr: 32, ys: 58,
      lado: { body: 'M16,98 L16,70 C16,60 20,52 26,46 L44,34 C50,31 56,32 64,32 L168,32 C182,32 192,36 200,44 L226,64 L256,69 C266,71 272,78 272,88 L272,98 C272,101 270,103 267,103 L243,103 A26,26 0 0 0 189,103 L99,103 A26,26 0 0 0 45,103 L19,103 C17,103 16,101 16,98 Z',
        win: ['M30,58 L46,40 C50,37 54,36 60,36 L106,36 L106,58 Z', 'M112,58 L112,36 L164,36 C174,36 182,40 188,46 L200,58 Z'], ln: ['M20,64 L264,72', 'M109,58 L109,101 M202,62 L198,101 M34,60 L38,101', 'M228,92 L270,94 M18,92 L44,92'],
        lt: 'M255,71 L269,76 L268,82 L253,79 Z', tl: 'M17,56 L26,54 L26,70 L17,71 Z', esp: 'M200,57 L209,52 C212,51 214,53 213,56 L211,60 L202,61 Z', sh: 'M36,118 L252,118' },
      top: { a: 186, techo: [70, 170], b: 36, b2: 60, capo: 210, puertas: [109, 170], mx: 192, maletero: 30 },
      pos: { dF: 155, dR: 72, techoX: 120 } },
    camioneta: { R: 16, F: 316, W: 106, wr: 80, wf: 252, yr: 30, ys: 60,
      lado: { body: 'M16,98 L16,58 L120,58 L122,40 C124,34 128,30 136,30 L206,30 C218,30 226,34 234,42 L258,62 L296,67 C308,69 316,77 316,88 L316,98 C316,101 314,103 311,103 L279,103 A26,26 0 0 0 225,103 L107,103 A26,26 0 0 0 53,103 L19,103 C17,103 16,101 16,98 Z',
        win: ['M126,60 L127,40 C128,36 132,34 136,34 L168,34 L168,60 Z', 'M174,60 L174,34 L204,34 C214,34 222,38 228,44 L242,60 Z'], ln: ['M20,64 L118,64', 'M124,66 L306,72', 'M171,60 L171,101 M244,62 L240,101 M122,58 L122,101', 'M270,92 L314,94 M18,92 L50,92'],
        lt: 'M299,70 L313,75 L312,81 L297,78 Z', tl: 'M17,62 L25,62 L25,78 L17,78 Z', esp: 'M234,57 L243,52 C246,51 248,53 247,56 L245,60 L236,61 Z', sh: 'M40,118 L292,118' },
      top: { a: 222, techo: [134, 204], b: 124, b2: 132, capo: 250, puertas: [171, 236], mx: 232, maletero: 40, balde: [22, 116] },
      pos: { dF: 207, dR: 146, techoX: 169 } },
  };
  function modeloDe(d, sec) { const SC = (sec || (((((DP().documentos || []).find(x => x.id === 'veh-informe') || {}).secciones || []).find(s => s.tipo === 'diagrama')) || {})).siluetaSegunCarroceria || {}, c = String(d.val.veh_tipo_carroceria || '');
    const k = Object.keys(SC).find(x => x !== 'otra' && c.toLowerCase().indexOf(x.toLowerCase()) === 0); return SC[k] || SC.otra || 'sedan'; }
  function lado(m, tr, vista) { const L = m.lado; return '<g data-vista="' + vista + '" transform="' + tr + '">' + pa('sh', L.sh) + pa('b', L.body) + L.win.map(x => pa('w', x)).join('') + L.ln.map(x => pa('ln', x)).join('') + pa('lt', L.lt) + pa('tl', L.tl) + pa('b', L.esp) + rueda(m.wr) + rueda(m.wf) + '</g>'; }
  function superior(m, tr) { const R = m.R, F = m.F, y0 = 60 - m.W / 2, y1 = 60 + m.W / 2, t = m.top, a = t.a, b = t.b, b2 = t.b2, h = t.capo;
    const body = 'M' + (R + 24) + ',' + y0 + ' C' + (R + 8) + ',' + y0 + ' ' + R + ',' + (y0 + 14) + ' ' + R + ',' + (y0 + 30) + ' L' + R + ',' + (y1 - 30) + ' C' + R + ',' + (y1 - 14) + ' ' + (R + 8) + ',' + y1 + ' ' + (R + 24) + ',' + y1 + ' L' + (F - 40) + ',' + y1 + ' C' + (F - 16) + ',' + y1 + ' ' + F + ',' + (y1 - 14) + ' ' + F + ',' + (y1 - 36) + ' L' + F + ',' + (y0 + 36) + ' C' + F + ',' + (y0 + 14) + ' ' + (F - 16) + ',' + y0 + ' ' + (F - 40) + ',' + y0 + ' Z';
    const ws = 'M' + a + ',' + (y0 + 14) + ' C' + (a + 14) + ',' + (y0 + 32) + ' ' + (a + 14) + ',' + (y1 - 32) + ' ' + a + ',' + (y1 - 14) + ' L' + (a - 18) + ',' + (y1 - 20) + ' C' + (a - 10) + ',' + (y1 - 36) + ' ' + (a - 10) + ',' + (y0 + 36) + ' ' + (a - 18) + ',' + (y0 + 20) + ' Z';
    const rw = 'M' + b + ',' + (y0 + 18) + ' L' + b2 + ',' + (y0 + 20) + ' L' + b2 + ',' + (y1 - 20) + ' L' + b + ',' + (y1 - 18) + ' C' + (b - 7) + ',' + (y1 - 34) + ' ' + (b - 7) + ',' + (y0 + 34) + ' ' + b + ',' + (y0 + 18) + ' Z';
    const lns = ['M' + h + ',' + (y0 + 12) + ' C' + (h + 16) + ',' + (y0 + 32) + ' ' + (h + 16) + ',' + (y1 - 32) + ' ' + h + ',' + (y1 - 12)].concat(t.puertas.map(x => 'M' + x + ',' + (y0 + 2) + ' L' + x + ',' + (y0 + 18) + ' M' + x + ',' + (y1 - 18) + ' L' + x + ',' + (y1 - 2)));
    if (t.tapa) lns.push('M' + t.tapa + ',' + (y0 + 10) + ' C' + (t.tapa - 6) + ',' + (y0 + 30) + ' ' + (t.tapa - 6) + ',' + (y1 - 30) + ' ' + t.tapa + ',' + (y1 - 10));
    const ruedas = [m.wr, m.wf].map(x => '<rect ' + S.ti + ' x="' + (x - 19) + '" y="' + (y0 - 6) + '" width="38" height="10" rx="3"/><rect ' + S.ti + ' x="' + (x - 19) + '" y="' + (y1 - 4) + '" width="38" height="10" rx="3"/>').join('');
    const esp = '<ellipse ' + S.b + ' cx="' + t.mx + '" cy="' + (y0 - 3) + '" rx="9" ry="4"/><ellipse ' + S.b + ' cx="' + t.mx + '" cy="' + (y1 + 3) + '" rx="9" ry="4"/>';
    const lt = 'M' + (F - 10) + ',' + (y0 + 14) + ' L' + (F - 2) + ',' + (y0 + 26) + ' L' + (F - 6) + ',' + (y0 + 28) + ' L' + (F - 14) + ',' + (y0 + 18) + ' Z M' + (F - 10) + ',' + (y1 - 14) + ' L' + (F - 2) + ',' + (y1 - 26) + ' L' + (F - 6) + ',' + (y1 - 28) + ' L' + (F - 14) + ',' + (y1 - 18) + ' Z';
    const tl = 'M' + (R + 2) + ',' + (y0 + 18) + ' L' + (R + 8) + ',' + (y0 + 16) + ' L' + (R + 8) + ',' + (y0 + 28) + ' L' + (R + 1) + ',' + (y0 + 28) + ' Z M' + (R + 2) + ',' + (y1 - 18) + ' L' + (R + 8) + ',' + (y1 - 16) + ' L' + (R + 8) + ',' + (y1 - 28) + ' L' + (R + 1) + ',' + (y1 - 28) + ' Z';
    const balde = t.balde ? '<rect ' + S.ln + ' x="' + t.balde[0] + '" y="' + (y0 + 10) + '" width="' + (t.balde[1] - t.balde[0]) + '" height="' + (m.W - 20) + '" rx="3"/>' + pa('ln', 'M' + (t.balde[0] + 4) + ',60 L' + (t.balde[1] - 4) + ',60') : '';
    return '<g data-vista="superior" transform="' + tr + '">' + ruedas + pa('b', body) + pa('w', ws) + '<rect ' + S.w + ' x="' + t.techo[0] + '" y="' + (y0 + 18) + '" width="' + (t.techo[1] - t.techo[0]) + '" height="' + (m.W - 36) + '" rx="12"/>' + pa('w', rw) + balde + lns.map(x => pa('ln', x)).join('') + esp + pa('lt', lt) + pa('tl', tl) + '</g>'; }
  // Frente y posterior: dibujados con medio ancho 64 y escalados a W en horizontal (escala común con la superior).
  function frontal(m, tr, post) { const yr = m.yr, ys = m.ys, yb = 112, M = (s) => s + ' ' + s.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (x, a, b) => (-Number(a)) + ',' + b);
    const body = 'M-64,' + (yb - 4) + ' L-64,' + (ys + 18) + ' C-64,' + (ys + 8) + ' -58,' + (ys + 2) + ' -48,' + ys + ' L-38,' + (yr + 7) + ' C-35,' + (yr + 2) + ' -31,' + yr + ' -26,' + yr + ' L26,' + yr + ' C31,' + yr + ' 35,' + (yr + 2) + ' 38,' + (yr + 7) + ' L48,' + ys + ' C58,' + (ys + 2) + ' 64,' + (ys + 8) + ' 64,' + (ys + 18) + ' L64,' + (yb - 4) + ' C64,' + (yb - 1) + ' 62,' + yb + ' 59,' + yb + ' L-59,' + yb + ' C-62,' + yb + ' -64,' + (yb - 1) + ' -64,' + (yb - 4) + ' Z';
    const esp = 'M-50,' + (ys - 4) + ' L-64,' + (ys - 6) + ' C-67,' + (ys - 6) + ' -68,' + (ys - 4) + ' -68,' + (ys - 2) + ' L-68,' + (ys + 2) + ' L-50,' + (ys + 2) + ' Z';
    const ruedas = '<rect ' + S.ti + ' x="-56" y="' + (yb - 10) + '" width="22" height="22" rx="4"/><rect ' + S.ti + ' x="34" y="' + (yb - 10) + '" width="22" height="22" rx="4"/>';
    let det;
    if (!post) { const lt = 'M-58,' + (ys + 12) + ' L-32,' + (ys + 10) + ' L-32,' + (ys + 18) + ' L-56,' + (ys + 21) + ' Z';
      det = pa('w', 'M-34,' + (ys - 2) + ' L-25,' + (yr + 6) + ' L25,' + (yr + 6) + ' L34,' + (ys - 2) + ' Z') + pa('b', M(esp)) + pa('lt', M(lt)) + '<rect ' + S.w + ' x="-24" y="' + (ys + 10) + '" width="48" height="18" rx="5"/>' + pa('ln', 'M-20,' + (ys + 16) + ' L20,' + (ys + 16) + ' M-20,' + (ys + 22) + ' L20,' + (ys + 22));
    } else { const tl = 'M-60,' + (ys + 6) + ' L-44,' + (ys + 5) + ' L-44,' + (ys + 20) + ' L-59,' + (ys + 21) + ' Z', top = m.top.balde ? ys - 12 : ys - 4;
      det = pa('w', 'M-32,' + top + ' L-24,' + (yr + 7) + ' L24,' + (yr + 7) + ' L32,' + top + ' Z') + (m.top.balde ? pa('ln', 'M-58,' + (ys - 2) + ' L58,' + (ys - 2)) : '') + pa('b', M(esp)) + pa('tl', M(tl)) + '<rect ' + S.w + ' x="-20" y="' + (ys + 15) + '" width="40" height="11" rx="2"/>'; }
    return '<g data-vista="' + (post ? 'posterior' : 'frente') + '" transform="' + tr + '">' + ruedas + pa('b', body) + det + pa('ln', 'M-60,' + (yb - 16) + ' L60,' + (yb - 16)) + '</g>'; }
  // Mapa pieza → vistas y posición, armado desde la lista de piezas del formulario (SIRIUS_EJEMPLO.catalogos.piezas).
  // Coordenadas locales de cada vista: laterales y superior en el largo (R…F; superior: izquierda arriba, derecha abajo),
  // frente y posterior centrados (frente: la izquierda del vehículo queda a la derecha del lector; posterior, al revés).
  function mapaPiezas(m) { const y0 = 60 - m.W / 2, y1 = 60 + m.W / 2, p = m.pos, t = m.top, ys = m.ys, yr = m.yr, F = m.F, R = m.R, out = {};
    const ladoDe = (sd) => sd === 'izq' ? { lat: 'li', y: y0 + 10, yEsp: y0 - 3, yFaro: y0 + 20, fx: 1, px: -1 } : { lat: 'ld', y: y1 - 10, yEsp: y1 + 3, yFaro: y1 - 20, fx: -1, px: 1 };
    const PZ = (E().catalogos || {}).piezas || [];
    PZ.forEach(n => { const s = /izquierd/.test(n) ? ladoDe('izq') : /derech/.test(n) ? ladoDe('der') : null, v = [];
      if (/^Parachoques delantero/.test(n)) v.push(['fr', 0, 98], ['su', F - 4, 60]);
      else if (/^Parachoques posterior/.test(n)) v.push(['po', 0, 98], ['su', R + 4, 60]);
      else if (/^Capó/.test(n)) v.push(['fr', 0, ys + 3], ['su', Math.round((t.capo + F) / 2), 60]);
      else if (/^Techo/.test(n)) v.push(['su', p.techoX, 60]);
      else if (/^Compuerta|maletero/.test(n)) v.push(['po', 0, ys + 8], ['su', t.maletero, 60]);
      else if (/^Parabrisas/.test(n)) v.push(['fr', 0, Math.round((yr + ys) / 2) - 3], ['su', t.a - 6, 60]);
      else if (s && /^Guardafango delantero/.test(n)) v.push([s.lat, m.wf, 70], ['fr', 58 * s.fx, ys + 33], ['su', m.wf, s.y]);
      else if (s && /^Guardafango posterior/.test(n)) v.push([s.lat, m.wr - 14, 70], ['po', 58 * s.px, ys + 33], ['su', m.wr - 14, s.y]);
      else if (s && /^Puerta delantera/.test(n)) v.push([s.lat, p.dF, 82], ['su', p.dF, s.y]);
      else if (s && /^Puerta posterior/.test(n)) v.push([s.lat, p.dR + 12, 80], ['su', p.dR + 12, s.y]);
      else if (s && /^Faro delantero/.test(n)) v.push([s.lat, F - 10, 76], ['fr', 40 * s.fx, ys + 13], ['su', F - 8, s.yFaro]);
      else if (s && /^Retrovisor/.test(n)) v.push([s.lat, t.mx + 6, 56], ['fr', 62 * s.fx, ys - 2], ['su', t.mx, s.yEsp]);
      out[n] = v; });
    return out; }
  // Etapa 12a · DEC-133: el diagrama se dibuja con la biblioteca SIRIUS_SILUETAS (estilo «pdf», atributos de presentación) según la
  // carrocería (carroceriaDe) o el tipo de equipo (siluetaEquipo), y cada avería se marca en su zona (posicion) en todas las vistas
  // donde se ve. Lienzo: fila 1 laterales izquierdo y derecho; fila 2 frente, superior y posterior; misma escala en todas las vistas.
  function siluetaDe(d) { const S = window.SIRIUS_SILUETAS; if (!S) return 'sedan'; return d.em ? S.siluetaEquipo(d.val.em_tipo || (d.eq || {}).tipo || '') : S.carroceriaDe(d.val.veh_tipo_carroceria || ''); }
  function diagrama(d, sec) {
    const S = window.SIRIUS_SILUETAS, DN = window.SiriusDanos, A = averias(d), F = 'font-family="Mulish, Arial, sans-serif"';
    const VIS = [['Lateral izquierdo', 'lateral_izq'], ['Lateral derecho', 'lateral_der'], ['Frente', 'frente'], ['Superior', 'superior'], ['Posterior', 'posterior']];
    const pedidas = sec && sec.vistas ? sec.vistas : VIS.map(x => x[0]), on = VIS.filter(x => pedidas.includes(x[0])).map(x => x[1]), tipo = siluetaDe(d);
    if (!S || !S.geometria[tipo]) return { svg: '', marcas: [], tipo };
    const G = S.geometria[tipo], vb = (v) => G[v === 'lateral_izq' || v === 'lateral_der' ? 'lateral' : v].vb, GAP = 18, LB = 22;
    const fila1 = on.filter(v => /^lateral/.test(v)), fila2 = on.filter(v => !/^lateral/.test(v));
    const anchoFila = (L) => L.reduce((a, v) => a + vb(v)[2], 0) + Math.max(0, L.length - 1) * GAP, altoFila = (L) => L.reduce((a, v) => Math.max(a, vb(v)[3]), 0);
    const W = Math.max(anchoFila(fila1), anchoFila(fila2), 200), pos = {}; let y = 0;
    [fila1, fila2].forEach(L => { if (!L.length) return; const hF = altoFila(L); let x = (W - anchoFila(L)) / 2; L.forEach(v => { const b = vb(v); pos[v] = { x, y: y + (hF - b[3]), w: b[2], h: b[3] }; x += b[2] + GAP; }); y += hF + LB; });
    const H = y, NOM = { lateral_izq: 'Lateral izquierdo', lateral_der: 'Lateral derecho', frente: 'Frente', superior: 'Superior · frente a la derecha', posterior: 'Posterior' };
    const vistas = on.map(v => { const p = pos[v]; return S.svg(tipo, v, 'pdf', { etiqueta: NOM[v] }).replace(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" /, '<svg x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" '); }).join('');
    const etq = '<g ' + F + ' font-size="11" font-weight="600" fill="#5b6b80" text-anchor="middle">' + on.map(v => '<text x="' + (pos[v].x + pos[v].w / 2) + '" y="' + (pos[v].y + pos[v].h + 15) + '">' + NOM[v] + '</text>').join('') + '</g>';
    const usados = {}, marcas = A.map(a => { const zid = a.zona || (DN ? DN.zonaDe(tipo, a.pieza) : null); if (!zid) return [];
      return on.map(v => { const q = S.posicion(tipo, zid, v); if (!q) return null; let cx = Math.round(pos[v].x + q[0]), cy = Math.round(pos[v].y + q[1]); const key = cx + ',' + cy; usados[key] = (usados[key] || 0) + 1; cx += (usados[key] - 1) * 22; return { vi: v, cx, cy, a }; }).filter(Boolean); }).reduce((p, q) => p.concat(q), []);
    const mk = marcas.map(x => '<g data-averia="' + x.a.n + '" data-vista="' + x.vi + '"><circle fill="' + x.a.color + '" stroke="#fff" stroke-width="2" cx="' + x.cx + '" cy="' + x.cy + '" r="10"/><text ' + F + ' font-size="11" font-weight="800" fill="#fff" text-anchor="middle" x="' + x.cx + '" y="' + (x.cy + 4) + '">' + x.a.n + '</text></g>').join('');
    const que = d.em ? 'del equipo' : 'del vehículo', svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(H) + '" width="100%" role="img" aria-label="Siluetas ' + que + ' (' + tipo + ') en ' + on.length + ' vistas con ' + A.length + (A.length === 1 ? ' avería marcada' : ' averías marcadas') + '" data-carroceria="' + tipo + '" style="display:block;width:100%;height:auto">' + vistas + etq + mk + '</svg>';
    return { svg, marcas, tipo }; }

  // ---------- Renderizadores por tipo de sección ----------
  const R = {};
  R.tarjeta = (d, s) => { const val = d.val, pl = d.placa, campos = (s.campos || []).filter(x => !/veh_(marca|modelo|anio_modelo)$/.test(x)).map(x => campo(d, x, 'conValor')).filter(Boolean);
    const tit = [val.veh_marca, val.veh_modelo, val.veh_anio_modelo].filter(x => !vacio(x)).join(' ') || RAYA;
    const kv = campos.map(c => '<span style="white-space:nowrap"><span style="color:' + C.muted + '">' + esc(c.l) + '</span> <b style="font-weight:700">' + esc(c.v) + '</b></span>').join('');
    const ref = (s.fotosReferencia || []).map(id => { const f = d.fotos.find(x => x.p.id === id), nom = id === 'exteriores_frontal' ? 'Foto frontal' : id === 'exteriores_posterior' ? 'Foto posterior' : ((d.fotos.find(x => x.p.id === id) || {}).p || {}).name || id;
      return '<div style="min-width:0">' + fotoPh(f ? nom : (s.sinFoto || 'Sin foto'), '78px') + '<div style="font-size:7pt;color:' + C.muted + ';margin-top:2px;white-space:nowrap">' + (f ? esc(f.F + ' · ' + sinPunto(f.f.at)) : esc(s.sinFoto || 'Sin foto')) + '</div></div>'; }).join('');
    return '<div style="display:grid;grid-template-columns:120px minmax(0,1fr) 250px;gap:14px;align-items:center;background:' + C.soft + ';border-radius:8px;padding:12px 14px">'
      + '<div style="border:2.5px solid ' + C.ink + ';border-radius:6px;text-align:center;font-weight:800;font-size:17pt;line-height:1;padding:9px 4px;letter-spacing:1px;background:#fff;color:' + C.ink + ';white-space:nowrap">' + (pl ? '<small style="display:block;font-size:6.5pt;letter-spacing:.5px;color:' + C.muted + ';margin-bottom:3px;font-weight:700">ECUADOR</small>' + esc(pl) : '<span style="font-size:12pt">Sin placa</span>') + '</div>'
      + '<div style="min-width:0"><div style="font-size:13pt;font-weight:800;color:' + C.ink + '">' + esc(tit) + '</div><div style="display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:4px;font-size:9pt;color:' + C.ink + '">' + kv + '</div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' + ref + '</div></div>'; };
  R.resultado = (d, s) => { const r = d.res, kind = r.kind, col = kind === 'ok' ? [C.ok, C.okbg, '✓'] : kind === 'no' ? [C.bad, C.badbg, '✕'] : [C.warn, C.warnbg, '…'];
    const big = r.veredicto ? r.veredicto + (r.veredicto === 'Asegurable' && r.cobertura ? ' · ' + r.cobertura : r.veredicto === 'No asegurable' && r.motivo ? ' · ' + r.motivo : '') : (s.sinVeredicto || 'Pendiente de calificación');
    const meta = [];
    if (r.veredicto && s.mostrarOrigen && r.origen) { let o = r.origen.replace(/(\d\d\/\d\d\/\d\d)(?!\d)/g, (x) => f4(x)); if (s.mostrarReglas && r.reglas.length) o += ' · Enviado a calificación por ' + (r.reglas.length === 1 ? 'la regla ' : 'las reglas ') + unir(r.reglas.map(x => '«' + x.regla + '»' + (x.pct ? ' (' + x.pct + ')' : ''))); meta.push(esc(o).replace(/\(([^()]*)\)$/, '<span style="white-space:nowrap">($1)</span>')); }
    else if (s.mostrarReglas && r.reglas.length) meta.push(esc('Enviado a calificación por ' + (r.reglas.length === 1 ? 'la regla ' : 'las reglas ') + unir(r.reglas.map(x => '«' + x.regla + '»' + (x.pct ? ' (' + x.pct + ')' : '')))));
    if (s.mostrarEmision && r.emi) { const e = r.emi; meta.push('Emisión: <b>' + esc(e.res) + '</b>' + esc((e.poliza ? ' · ' + e.poliza : '') + (e.autorizador ? ' · autorizó ' + e.autorizador : '') + (e.fecha ? ' · ' + f4(e.fecha) : ''))); }
    return '<div role="group" aria-label="' + esc(s.titulo || 'Resultado') + '" style="display:flex;gap:14px;align-items:flex-start;border:1.5px solid ' + col[0] + ';background:' + col[1] + ';border-radius:8px;padding:10px 14px">'
      + '<div aria-hidden="true" style="width:26px;height:26px;border-radius:50%;background:' + col[0] + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;flex:none;font-size:12pt">' + col[2] + '</div>'
      + '<div style="min-width:0"><b style="font-size:12pt;display:block;color:' + C.ink + '">' + esc(big) + '</b>' + (meta.length ? '<div style="font-size:8.5pt;color:#3d2b26;line-height:1.45">' + meta.join('<br>') + '</div>' : '') + '</div></div>'; };
  R.hallazgos = (d, s, n) => { const L = hallazgos(d, Array.isArray(s.reglas) ? s.reglas : null);
    const body = L.length ? '<ul style="list-style:none;margin:0;padding:0">' + L.map(h => { const v = SEV[h.sev] || SEV.baja; return '<li style="display:flex;gap:8px;align-items:baseline;padding:5px 0;border-bottom:1px dotted ' + C.line + ';font-size:9.5pt;color:' + C.ink + '">' + tag(v.t, v.bg, v.fg) + '<span>' + esc(String(h.texto).replace(/\.+$/, '')) + '.</span></li>'; }).join('') + '</ul>' : P(esc(s.textoSinHallazgos || 'Sin hallazgos relevantes.'), ';color:' + C.ok + ';font-weight:700');
    return H2(n, s.titulo) + body; };
  R.valores = (d, s, n) => { const v = d.val, ca = v.veh_valor_asegurado_casco, cs = v.veh_valor_sugerido_casco, ea = v.veh_valor_asegurado_extras, es = v.veh_valor_sugerido_extras;
    if (ca == null && cs == null) return '';
    const hayExt = (ea != null && ea > 0) || (es != null && es > 0), dif = (a, b) => a != null && b != null && a > 0 ? (b - a) / a * 100 : null;
    const dCasco = dif(ca, cs), al = dCasco != null && Math.abs(dCasco) > 10 ? (dCasco < 0 ? 'posible sobreseguro' : 'posible infraseguro') : '';
    const celda = (x) => x == null ? RAYA : usd(x), neg = ';color:' + C.bad + ';font-weight:700';
    let rows = '<tr>' + TD('Casco') + TD(celda(ca), ';text-align:right;white-space:nowrap') + TD(celda(cs), ';text-align:right;white-space:nowrap') + TD(dCasco == null ? RAYA : pct(dCasco, true) + (s.mostrarAlertas && al ? ' · ' + al : ''), ';text-align:right' + (al ? neg : '')) + '</tr>';
    if (hayExt) { const exs = v.veh_extras_sobre_casco, lim = exs != null && exs > 20; rows += '<tr>' + TD('Extras') + TD(celda(ea), ';text-align:right;white-space:nowrap') + TD(celda(es), ';text-align:right;white-space:nowrap') + TD(exs == null ? RAYA : pct(exs) + ' del casco' + (s.mostrarAlertas && lim ? ' · sobre el límite' : ''), ';text-align:right' + (lim ? neg : '')) + '</tr>';
      const ta = ca != null ? ca + (ea || 0) : null, ts = cs != null && es != null ? cs + es : null, dt = dif(ta, ts), tot = ';font-weight:800;border-top:1.5px solid ' + C.ink;
      rows += '<tr>' + TD('Total', tot) + TD(celda(ta), tot + ';text-align:right;white-space:nowrap') + TD(celda(ts), tot + ';text-align:right;white-space:nowrap') + TD(dt == null ? RAYA : pct(dt, true), tot + ';text-align:right' + (dt != null && Math.abs(dt) > 10 ? ';color:' + C.bad : '')) + '</tr>'; }
    const head = TH('') + (s.mostrarDiferencias ? TH('Asegurado (solicitud)', 'right') + TH('Sugerido (inspección)', 'right') + TH('Diferencia', 'right') : '');
    return H2(n, s.titulo) + TABLE(head, rows); };
  R.campos = (d, s, n) => { if (!cumple(d, s.condiciones || s.condicion)) { if (s.resumenSiNo && !vacio(d.val.veh_conductor_habitual) && d.val.veh_conductor_habitual !== 'Otra persona') return RUN(n, s.titulo, esc(lc1(quitaTitulo(s.resumenSiNo, s.titulo))));  return ''; }
    const L = (s.campos || []).map(c => Array.isArray(c) ? campo(d, c[0], c[1]) : campo(d, c, s.modoPorDefecto)).filter(Boolean); if (!L.length || L.every(x => x.v === RAYA)) return '';
    const grid = (cols) => H2(n, s.titulo) + '<div style="display:grid;grid-template-columns:repeat(' + cols + ',minmax(0,1fr));gap:4px 16px">' + L.map(x => campoHtml(x.l, x.v)).join('') + '</div>';
    return { html: grid(s.columnas || 2), media: grid(2) }; };
  function quitaTitulo(t, tit) { const s = String(t || ''), p = String(tit || '') + ':'; if (tit && s.toLowerCase().indexOf(p.toLowerCase()) === 0) return uc1(s.slice(p.length).trim()); if (tit && s.toLowerCase().indexOf(String(tit).toLowerCase() + ' ') === 0) return uc1(s.slice(String(tit).length + 1)); return s; }
  R.lista = (d, s, n) => { const val = d.val, def = d.def, ok = ';color:' + C.ok + ';font-weight:700', bad = ';color:' + C.bad + ';font-weight:700';
    const span = (t, st) => '<span style="' + (st || '').replace(/^;/, '') + '">' + esc(t) + '</span>';
    if ((s.campos || []).some(c => /^veh_verificacion_/.test(c))) { const ks = s.campos.filter(k => !vacio(val[k])); if (!ks.length) return '';
      const ver = ks.filter(k => val[k] === 'Verificado').map(k => lc1(lab(d, k))), no = ks.filter(k => val[k] === 'No verificado').map(k => lc1(lab(d, k))), na = ks.filter(k => val[k] === 'No aplica').map(k => lc1(lab(d, k)));
      if (ver.length === s.campos.length) return RUN(n, s.titulo, span(s.textoTodosNormales, ok));
      const partes = []; if (ver.length) partes.push('Verificado: ' + esc(unir(ver)) + '.'); if (no.length) partes.push(span('No verificado: ' + unir(no) + '.', bad)); if (na.length) partes.push(span('No aplica: ' + unir(na) + '.', ';color:' + C.muted));
      return RUN(n, s.titulo, partes.join(' ')); }
    if ((s.campos || []).some(c => /^veh_testigo_/.test(c))) { const ks = Object.keys(def).filter(k => /^veh_testigo_/.test(k) && !vacio(val[k])); if (!ks.length) return '';
      const enc = ks.filter(k => val[k] === 'Encendido').map(k => lab(d, k));
      return RUN(n, s.titulo, enc.length ? span(String(s.frase || 'Encendidos: {lista}').replace('{lista}', unir(enc)) + '.', bad) + (ks.length - enc.length ? ' Apagados: ' + (ks.length - enc.length) + ' de ' + ks.length + '.' : '') : span(String(s.textoTodosNormales || 'Todos apagados ({n} revisados).').replace('{n}', ks.length), ok)); }
    // Equipamiento: solo lo que tiene (nunca los «No»). Una opción cuenta como presente si no es «No», «No tiene» ni «Ninguno» (v1.3).
    const AUS = ['no', 'no tiene', 'ninguno', 'ninguna'], CON = { veh_aros: ' de ' }, op = (s.campos || []).map(c => (/^(veh_\w+) \(opción\)/.exec(c) || [])[1]).filter(Boolean);
    const opc = op.filter(k => !vacio(val[k]) && !AUS.includes(String(val[k]).trim().toLowerCase())).map(k => lc1(lab(d, k)) + (CON[k] || ' ') + lc1(String(val[k])));
    const acc = Object.keys(def).filter(k => def[k].sec === 'acc'), sn = opc.concat(acc.filter(k => def[k].t === 'Sí/No' && !['veh_telemetria', 'veh_satelital', 'veh_blindaje'].includes(k) && val[k] === 'Sí').map(k => lc1(lab(d, k)))), it = [];
    if (num(val.veh_cantidad_airbags)) it.push(val.veh_cantidad_airbags + (Number(val.veh_cantidad_airbags) === 1 ? ' airbag' : ' airbags'));
    if (val.veh_satelital === 'Sí') it.push('rastreo satelital' + (val.veh_proveedor_satelital ? ' (' + val.veh_proveedor_satelital + ')' : ''));
    if (val.veh_telemetria === 'Sí') it.push('telemetría' + (val.veh_tipo_dispositivo ? ' (' + val.veh_tipo_dispositivo + ')' : ''));
    if (val.veh_blindaje === 'Sí') it.push('blindaje' + [val.veh_nivel_blindaje ? ' nivel ' + val.veh_nivel_blindaje : '', val.veh_proveedor_blindaje ? ' (' + val.veh_proveedor_blindaje + ')' : ''].join(''));
    const todo = sn.concat(it); if (!todo.length) return '';
    return RUN(n, s.titulo, esc(String(s.frase || 'Tiene: {lista}').replace(/\{lista[^}]*\}/, unir(todo)) + '.')); };
  R.tabla = (d, s, n) => { if (!cumple(d, s.condicion)) return '';
    if (s.grilla === 'ext') { if (!d.ext.length) return ''; let tot = 0;
      const rows = d.ext.map(x => { const v = numDec(x.valor); if (v != null) tot += v; return '<tr>' + TD(esc(x.desc || RAYA), ';font-weight:700') + TD(esc(x.marca || RAYA)) + TD(v == null ? RAYA : miles(v, 2), ';text-align:right;white-space:nowrap') + '</tr>'; }).join('')
        + (s.totales ? '<tr>' + TD('Total', ';font-weight:800;border-top:1.5px solid ' + C.ink) + TD('', ';border-top:1.5px solid ' + C.ink) + TD(usd(tot), ';font-weight:800;text-align:right;white-space:nowrap;border-top:1.5px solid ' + C.ink) + '</tr>' : '');
      return H2(n, s.titulo) + TABLE(TH(esc(s.columnas[0])) + TH(esc(s.columnas[1])) + TH(esc(colMon(s.columnas[2])), 'right'), rows); }
    if (s.grilla === 'neu') { const L = d.neu; if (!L.length) return ''; const rep = L.find(x => /repuesto|emergencia/i.test(x.pos)), mov = L.filter(x => x !== rep), labs = mov.map(x => numDec(x.labrado)).filter(x => x != null);
      const uni = L.every(x => x.marca === L[0].marca && x.medida === L[0].medida) && L.every(x => { const v = numDec(x.labrado); return v == null || v >= 3; }) && labs.length;
      if (uni && s.resumirSiUniforme) { const fm = (x) => String(x).replace('.', ','), mn = Math.min.apply(null, labs), mx = Math.max.apply(null, labs);
        let t = String(s.resumirSiUniforme).replace('{marca}', L[0].marca || '').replace('{medida}', L[0].medida || '').replace('{min}', fm(mn.toFixed(1))).replace('{max}', fm(mx.toFixed(1)));
        t = rep && rep.labrado ? t.replace('{rep}', fm(numDec(rep.labrado).toFixed(1))) : t.replace(/\s*\(repuesto \{rep\} mm\)/, '');
        return RUN(n, s.titulo, esc(quitaTitulo(t, s.titulo))); }
      const col = (v) => v == null ? '' : v < 1.6 ? ';background:' + C.badbg + ';color:' + C.bad + ';font-weight:700' : v < 3 ? ';background:' + C.warnbg + ';color:' + C.warn + ';font-weight:700' : '';
      const tbn = TABLE(s.columnas.map((c, i) => TH(esc(c), i === 3 ? 'right' : '')).join(''), L.map(x => '<tr>' + TD(esc(x.pos), ';font-weight:700') + TD(esc(x.marca || RAYA)) + TD(esc(x.medida || RAYA)) + TD(esc(x.labrado || RAYA), ';text-align:right' + col(numDec(x.labrado))) + '</tr>').join(''));
      if (s._grupo) return { compact: true, html: '<div style="padding:0 0 5px;border-bottom:1px dotted ' + C.line + '"><b style="display:block;margin-bottom:4px;font-size:10pt;font-weight:800;color:' + C.brand + '">' + esc(s.titulo) + ':</b>' + tbn + '</div>' };
      return H2(n, s.titulo) + tbn; }
    if (s.grilla === 'ave') return ''; // la tabla de averías va con el diagrama, debajo del lienzo
    return ''; };
  R.diagrama = (d, s, n, tablaAve) => { if (!cumple(d, s.condicion) || !d.ave.length) return ''; const g = diagrama(d, s), A = averias(d);
    const leg = '<div style="display:flex;flex-wrap:wrap;gap:4px 14px;font-size:7.5pt;color:' + C.muted + ';margin-top:4px;align-items:center">' + ['Alta', 'Media', 'Baja'].map(x => '<span style="white-space:nowrap"><i style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px;background:' + GRAV[x].c + '"></i>' + x + '</span>').join('') + '<span style="margin-left:auto">Cada número es una avería de la tabla y aparece en todas las vistas donde se ve la pieza.</span></div>';
    let tabla = '';
    if (tablaAve) { const an = tablaAve.anchos || ['7%', '27%', '16%', '13%', '14%', '12%', '11%'], cols = tablaAve.columnas || ['#', 'Pieza', 'Tipo de daño', 'Gravedad', 'Profundidad', 'Superficie', 'Foto'], nw = ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      // Etapa 12a: columnas por nombre; «Profundidad» es la mostrada (con confianza baja, «Por confirmar»).
      const CEL = { '#': (a) => TD('<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;color:#fff;font-weight:800;font-size:8pt;background:' + a.color + '">' + a.n + '</span>', nw), 'Pieza': (a) => TD(esc(a.pieza || RAYA) + (a.desc ? '<span style="display:block;font-size:7.5pt;color:' + C.muted + '">' + esc(a.desc) + '</span>' : '')), 'Tipo de daño': (a) => TD(esc(a.tipo || RAYA), nw),
        'Gravedad': (a) => { const g2 = GRAV[a.grav] || GRAV.Baja; return TD(tag(a.grav || RAYA, g2.bg, g2.fg), nw); }, 'Profundidad': (a) => TD(esc(a.prof && a.prof !== '—' ? a.prof : RAYA), nw), 'Superficie': (a) => TD(a.sup ? esc(String(a.sup).replace('.', ',')) + ' dm²' : RAYA, nw + ';text-align:right'), 'Foto': (a) => TD(esc(a.foto || RAYA), nw) };
      tabla = '<table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:9pt;margin-top:8px;color:' + C.ink + '"><colgroup>' + an.map(w => '<col style="width:' + w + '">').join('') + '</colgroup><thead><tr>' + cols.map(c => TH(esc(c), c === 'Superficie' ? 'right' : '')).join('') + '</tr></thead><tbody>'
        + A.map(a => '<tr>' + cols.map(c => (CEL[c] || (() => TD(RAYA)))(a)).join('') + '</tr>').join('') + '</tbody></table>'; }
    return H2(n, s.titulo) + '<div style="border:1px solid ' + C.line + ';border-radius:8px;padding:10px 12px 8px;background:#fff">' + g.svg + leg + '</div>' + tabla; };
  R.verificaciones = (d, s, n) => { if (s.soloEvidencia) return cumple(d, s.condicion) ? '' : ''; const L = d.vex; if (!L.length) return '';
    const res = (x) => x.res === 'Sin novedad' ? ['Sin novedad', ';color:' + C.ok + ';font-weight:700'] : x.res === 'Con novedad' ? ['Con novedad' + (x.obs ? ': ' + x.obs : ''), ';color:' + C.bad + ';font-weight:700'] : x.res === 'Servicio no disponible' ? ['No disponible', ';color:' + C.muted] : [x.res || RAYA, ''];
    const conForma = L.some(x => !vacio(x.forma)), cols = (s.columnas || ['Fuente', 'Resultado', 'Consultada', 'Forma']).filter(c => c !== 'Forma' || conForma);
    return H2(n, s.titulo) + TABLE(cols.map(c => TH(esc(c))).join(''), L.map(x => { const r = res(x); return '<tr>' + TD(esc(x.consulta)) + TD(esc(r[0]), r[1]) + TD(esc(f4(x.at) || RAYA), ';white-space:nowrap') + (conForma ? TD(esc(x.forma || RAYA)) : '') + '</tr>'; }).join('')); };
  R.texto = (d, s, n) => { const t = String(s.contenido || '').replace(/\{(\w+)\}/g, (m, k) => vacio(d.val[k]) ? '' : String(d.val[k])).trim(); if (!t) return '';
    return s.titulo ? H2(n, s.titulo) + P(esc(t)) : P(esc(t), ';font-size:8.5pt;color:' + C.muted); };
  R.lineaTiempo = (d, s, n) => { const v = d.v, inf = v.informe || {}, r = d.res, ev = v.eventos || [], busca = (re) => (ev.find(e => re.test(e[1])) || [])[0] || '';
    const enlace = busca(/[Ee]nlace/), envEmi = busca(/[Ee]nviado a emisi/), emi = (r.emi && r.emi.fecha) || busca(/BPM de Emisi|Emitid/);
    const F = { 'Solicitud': d.caso.fecha ? f4(d.caso.fecha).slice(0, 5) : '', 'Enlace enviado': enlace, 'Inspección iniciada': inf.inspeccion || '', 'Informe enviado': inf.carga || '', 'Calificación': r.veredicto ? ((r.calificador || {}).fecha || '') : '', 'Envío a emisión': envEmi, 'Emisión': r.emi ? emi : '' };
    const L = (s.eventos || []).map(e => ({ e, f: F[e] })).filter(x => !vacio(x.f)); if (L.length < 2) return '';
    const corto = (f) => String(f).replace(/^(\d\d\/\d\d)\/\d\d/, '$1');
    return H2(n, s.titulo) + '<div style="display:flex;justify-content:space-between;font-size:7.8pt;color:' + C.muted + ';position:relative;margin-top:6px"><div style="position:absolute;left:4%;right:4%;top:6px;border-top:2px solid ' + C.line + '"></div>'
      + L.map(x => '<div style="position:relative;text-align:center;flex:1 1 0;min-width:0"><div style="width:12px;height:12px;border-radius:50%;background:' + C.acc + ';margin:0 auto 4px"></div><b style="display:block;color:' + C.ink + ';font-size:8pt">' + esc(x.e) + '</b><span style="white-space:nowrap">' + esc(corto(x.f)) + '</span></div>').join('') + '</div>'; };
  R.firmas = (d, s) => { const val = d.val, mod = val.veh_modalidad_realizada || '', L = ((s.segunModalidad || {})[mod]) || [], sep = (s.espacio || {}).separacion || '16mm', esp = (s.espacio || {}).firma || '20mm';
    if (!L.length) return ''; const tipo = d.insp ? lc1(d.insp.tipo) : '';
    const quien = (r) => /Quien atiende/.test(r) ? [txt(d, 'veh_persona_atiende') || RAYA, 'Quien atendió la inspección' + (val.veh_relacion_asegurado ? ' · ' + lc1(val.veh_relacion_asegurado) : '')]
      : /^Inspector/.test(r) ? [txt(d, 'veh_inspector_ejecuto') || RAYA, 'Inspector' + (d.insp && d.insp.tipo === 'Agencia' ? ' · ' + d.insp.ag : tipo ? ' · ' + tipo : '')]
      : /Aceptación del cliente/.test(r) ? [d.caso.asegurado || RAYA, 'Aceptación del cliente en la videollamada'] : /Ejecutivo/.test(r) ? [d.caso.backoffice || d.usuario || RAYA, 'Ejecutivo de inspecciones'] : [RAYA, r];
    if (L.length === 1 && /^Declaración/.test(L[0])) { const f = f4(val.veh_fecha_hora_inspeccion || (d.v.informe || {}).inspeccion || '') || RAYA;
      return '<div style="padding-top:calc(' + sep.replace(' ', '') + ' - 14px);break-inside:avoid"><div style="border:1px solid ' + C.line + ';border-radius:6px;padding:10px 12px;font-size:9pt;color:' + C.ink + '"><b style="display:block;margin-bottom:2px">Declaración del cliente</b>' + esc(L[0].replace('{fecha}', f)) + '</div></div>'; }
    return '<div style="padding-top:calc(' + sep.replace(' ', '') + ' - 14px);break-inside:avoid;display:grid;grid-template-columns:repeat(' + Math.max(2, L.length) + ',minmax(0,1fr));gap:40px;font-size:8.5pt;text-align:center;color:' + C.ink + '">'
      + L.map(r => { const q = quien(r); return '<div><div style="height:' + esp.replace(' ', '') + '"></div><div style="border-top:1px solid ' + C.ink + ';padding-top:4px"><b style="display:block;font-size:9pt">' + esc(q[0]) + '</b><i style="font-style:normal;color:' + C.muted + ';font-size:7.5pt">' + esc(q[1]) + '</i></div></div>'; }).join('') + '</div>'; };
  // Fotos: un bloque por fila (la paginación nunca parte una fila). pasos: ids de paso; grupos: grupos de la plantilla.
  function fotosBloques(d, s, n) { const pf = Number(s.porFila) || 3, out = [], h = pf >= 3 ? '105px' : pf === 2 ? '150px' : '200px';
    let L; if (s.pasos) L = s.pasos.map(id => d.fotos.find(x => x.p.id === id)).filter(Boolean);
    else { const G = s.grupos || []; L = d.fotos.filter(x => G.includes(x.p.group)); }
    if (!L.length) return [];
    const item = (x) => { const f = x.f, et = x.f.fila ? x.p.name + ' · ' + x.f.fila.label : x.p.name, gps = f.gps ? gpsTxt(f) + ' · ± ' + f.gps.prec + ' m' : 'Sin GPS';
      // Etapa 12a · DEC-134: la foto con daños aceptados (Confirmados, Ajustados o Agregados) se imprime con sus polígonos.
      const DN = window.SiriusDanos, dan = DN && d.fotos.find(y => y.p.id === x.p.id) === x ? DN.deFoto(d.rid, x.p.id, true) : [], ph = fotoPh('Foto de ejemplo · ' + x.p.name, h, x.p.group === 'Daños' ? C.badbg : '');
      return '<div style="border:1px solid ' + C.line + ';border-radius:4px;overflow:hidden;min-width:0">' + (dan.length ? '<div data-danos="' + dan.length + '" style="position:relative">' + ph + DN.svgDanos(dan) + '</div>' : ph) + '<div style="padding:4px 6px;font-size:7.5pt;line-height:1.35;color:' + C.muted + '"><b style="display:block;color:' + C.ink + ';font-size:8pt">' + esc(x.F + ' · ' + et) + '</b>' + esc([sinPunto(f.at), gps, dispCorto(f.disp)].filter(Boolean).join(' · ')) + (f.marca === 'galeria' ? '<span style="display:block;color:' + C.warn + ';font-weight:700">Cargada desde la galería</span>' : '') + '</div></div>'; };
    const fila = (xs) => '<div style="display:grid;grid-template-columns:repeat(' + pf + ',minmax(0,1fr));gap:10px">' + xs.map(item).join('') + '</div>';
    const grupos = []; if (s.pasos) grupos.push({ g: '', xs: L }); else L.forEach(x => { const last = grupos[grupos.length - 1]; if (last && last.g === x.p.group) last.xs.push(x); else grupos.push({ g: x.p.group, xs: [x] }); });
    const sub = !s.pasos && grupos.length > 1;
    out.push({ isChap: true, html: H2(n, s.titulo) });
    grupos.forEach(gr => { for (let i = 0; i < gr.xs.length; i += pf) out.push({ html: (sub && i === 0 ? H3(gr.g) : '') + fila(gr.xs.slice(i, i + pf)) }); });
    return out; }

  // ---------- Equipo y maquinaria (etapa 8b) ----------
  // Mismo modelo de secciones; estos renderizadores leen el contexto del equipo (SiriusSalidaVeh.contexto con ctx.em): valores de
  // SiriusEquipos.valores (con el VRN ajustado en calificación), hallazgos de SIRIUS_EQUIPOS.hallazgos y las grillas del informe.
  const REM = {};
  const labE = (d, k) => ((d.def[k] || {}).l) || k;
  const txtE = (d, k) => { const x = d.val[k]; if (vacio(x)) return null; if (typeof x === 'number') return /anio/.test(k) ? String(x) : k === 'em_horometro' ? miles(x) + ' h' : k === 'em_frecuencia' ? 'cada ' + miles(x) + ' h' : miles(x); return /fecha|vigencia|ultimo_mant/.test(k) ? f4(x) : String(x); };
  const MALO_NO = ['em_matricula', 'em_licencia', 'em_bitacora', 'em_preventivo', 'em_extintor', 'em_gps', 'em_alarma_retroceso', 'em_rops', 'em_chequeo_previo'];
  const vencida = (x) => { const f = fecha(x); return !!f && f < hoy(); };
  function hallEM(d, ids) { const L = (d.hall || []).filter(h => !ids || ids.includes(h.id)).map((h, i) => ({ id: h.id, texto: h.texto, sev: h.severidad, ord: i }));
    return L.sort((a, b) => (SEV[b.sev] || {}).o - (SEV[a.sev] || {}).o || a.ord - b.ord); }
  REM.tarjeta = (d, s) => { const val = d.val, tit = [val.em_marca, val.em_modelo].filter(x => !vacio(x)).join(' ') || RAYA, tipo0 = val.em_tipo || (d.eq || {}).tipo || '', tipo = tipo0 === 'Otro (describir)' ? (String(val.em_tipo_descripcion || (d.eq || {}).descripcion || '').trim() || tipo0) : tipo0; // Etapa 8c · «Otro (describir)»: el PDF muestra la descripción ingresada.
    const campos = (s.campos || []).map(k => { const v = txtE(d, k); return v == null ? null : { l: k === 'em_serie_pin' ? 'Serie' : k === 'em_anio_fabricacion' ? 'Año' : labE(d, k).replace(/ \(h\)$/, ''), v }; }).filter(Boolean);
    const kv = campos.map(c => '<span style="white-space:nowrap"><span style="color:' + C.muted + '">' + esc(c.l) + '</span> <b style="font-weight:700">' + esc(c.v) + '</b></span>').join('');
    const ref = (s.fotosReferencia || []).map(id => { const f = d.fotos.find(x => x.p.id === id), nom = id === 'eq_frontal' ? 'Foto frente' : id === 'eq_posterior' ? 'Foto posterior' : ((f || {}).p || {}).name || id;
      return '<div style="min-width:0">' + fotoPh(f ? nom : (s.sinFoto || 'Sin foto'), '78px') + '<div style="font-size:7pt;color:' + C.muted + ';margin-top:2px;white-space:nowrap">' + (f ? esc(f.F + ' · ' + sinPunto(f.f.at)) : esc(s.sinFoto || 'Sin foto')) + '</div></div>'; }).join('');
    return '<div style="display:grid;grid-template-columns:120px minmax(0,1fr) 250px;gap:14px;align-items:center;background:' + C.soft + ';border-radius:8px;padding:12px 14px">'
      + '<div style="border:2.5px solid ' + C.ink + ';border-radius:6px;text-align:center;font-weight:800;font-size:10pt;line-height:1.2;padding:9px 6px;background:#fff;color:' + C.ink + '"><small style="display:block;font-size:6.5pt;letter-spacing:.5px;color:' + C.muted + ';margin-bottom:3px;font-weight:700">EQUIPO</small>' + esc(tipo || RAYA) + '</div>'
      + '<div style="min-width:0"><div style="font-size:13pt;font-weight:800;color:' + C.ink + '">' + esc(tit) + '</div><div style="display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:4px;font-size:9pt;color:' + C.ink + '">' + kv + '</div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' + ref + '</div></div>'; };
  REM.resultado = (d, s) => R.resultado(d, s);
  REM.hallazgos = (d, s, n) => { const L = hallEM(d, Array.isArray(s.reglas) ? s.reglas : null);
    const body = L.length ? '<ul style="list-style:none;margin:0;padding:0">' + L.map(h => { const v = SEV[h.sev] || SEV.baja; return '<li style="display:flex;gap:8px;align-items:baseline;padding:5px 0;border-bottom:1px dotted ' + C.line + ';font-size:9.5pt;color:' + C.ink + '">' + tag(v.t, v.bg, v.fg) + '<span>' + esc(String(h.texto).replace(/\.+$/, '')) + '.</span></li>'; }).join('') + '</ul>' : P(esc(s.textoSinHallazgos || 'Sin hallazgos relevantes.'), ';color:' + C.ok + ';font-weight:700');
    return H2(n, s.titulo) + body; };
  REM.valores = (d, s, n) => { const v = d.eqv; if (!v || v.sa == null) return ''; const adj = d.vrnAdj, neg = ';color:' + C.bad + ';font-weight:700', al = v.alerta;
    const fila = (l, x, nota, st) => '<tr>' + TD(esc(l)) + TD(x, ';text-align:right;white-space:nowrap' + (st || '')) + TD(esc(nota || ''), ';color:' + C.muted) + '</tr>';
    let rows = fila('Suma asegurada', esc(usd(v.sa)), 'De la solicitud')
      + fila('VRN (valor de reposición a nuevo)', esc(usd(v.vrn)), s.mostrarFuente === false ? '' : adj ? 'Ajustado en calificación por ' + adj.by + ' el ' + f4(adj.at) + ' · informe: ' + usd(adj.anterior) : 'Fuente: ' + [v.fuente, (d.eq || {}).vrnFuente && (d.eq || {}).vrnFuente !== v.fuente ? (d.eq || {}).vrnFuente : ''].filter(Boolean).join(' · '));
    if (s.mostrarValorReal !== false) rows += fila('Valor real', esc(usd(v.real)), v.anios + (v.anios === 1 ? ' año' : ' años') + ' desde la puesta en servicio · depreciación ' + v.dep.total + ' %');
    rows += fila('Relación suma asegurada / VRN', esc((v.relR == null ? RAYA : v.relR + ' %') + (al ? ' · ' + (al.id === 'infraseguro' ? 'infraseguro' : 'sobreseguro') : '')), al ? '' : 'Dentro de ±10 %', al ? neg : '');
    let html = H2(n, s.titulo) + TABLE(TH('') + TH('Valor', 'right') + TH(''), rows);
    if (al && al.id === 'infraseguro' && s.mostrarExplicacion && s.explicacion) { const dn = Number(s.ejemploDanio) || 50000, pago = Math.round(dn * v.sa / v.vrn);
      html += '<div style="margin-top:6px;padding:8px 10px;border-left:3px solid ' + C.bad + ';background:' + C.badbg + ';font-size:9pt;line-height:1.45;color:' + C.ink + '"><b>Infraseguro.</b> ' + esc(String(s.explicacion).replace('{pct}', v.relR).replace('{danio}', usd(dn)).replace('{pago}', usd(pago))) + '</div>'; }
    else if (al && al.id === 'infraseguro' && s.recomendacion) html += P(esc('Asegurado al ' + v.relR + ' % del VRN. ' + s.recomendacion), ';margin-top:6px;font-weight:700;color:' + C.bad);
    return html; };
  REM.campos = (d, s, n) => { const val = d.val, out = [];
    (s.campos || []).forEach(([spec, modo]) => { const md = String(modo || 'conValor'); let l = '', v = null; const k = (/^(em_\w+)/.exec(spec) || [])[1];
      if (k) { l = k === 'em_modalidad_realizada' ? 'Modalidad' : k === 'em_fecha_hora_inspeccion' ? 'Fecha y hora' : labE(d, k); v = txtE(d, k); }
      else if (/^inspecci[oó]n\.lugar/.test(spec)) { l = 'Lugar'; const f = (d.fotos.find(x => x.f.gps) || {}).f; v = [d.v.lugar || '', f ? gpsTxt(f, 4) : ''].filter(Boolean).join(' · ') || null; }
      else if (/^inspector/.test(spec)) { const i = d.insp, nm = val.em_inspector_ejecuto; l = i && i.tipo === 'Agencia' ? 'Agencia' : 'Inspector'; v = !nm ? null : i && i.tipo === 'Agencia' ? nm + ' · ' + i.ag : nm; }
      else if (spec === 'caso.sucursal') { l = 'Sucursal'; v = d.caso.sucursal || d.v.sucursal || null; }
      else if (spec === 'broker.nombre') { l = 'Bróker (APS)'; v = d.caso.broker || null; }
      if (md === 'siempre') out.push({ l, v: v == null ? RAYA : v }); else if (v != null) out.push({ l, v }); });
    if (!out.length) return ''; const cols = s.columnas || 2;
    return H2(n, s.titulo) + '<div style="display:grid;grid-template-columns:repeat(' + cols + ',minmax(0,1fr));gap:0 16px">' + out.map(c => campoHtml(c.l, c.v)).join('') + '</div>'; };
  // Etapa 8c · «Presentación» de la lista compacta: Frase (la de siempre), Tabla (dato | valor) o Tarjetas (una tarjeta por grupo, con su chip de novedades).
  const PRES = (s) => s.presentacion === 'tabla' || s.presentacion === 'tarjetas' ? s.presentacion : 'frase';
  const ICO_MALO = '<svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;vertical-align:-1px;margin-right:3px" fill="none" stroke="' + C.bad + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5"/><path d="M12 18.5v.5"/></svg>';
  // Datos de la lista con valor (los vacíos no ocupan fila): dato, valor y si es desfavorable (No / En trámite en los datos de «debe tener», vigencia vencida).
  const datosLista = (d, s) => (s.campos || []).filter(k => !vacio(d.val[k])).map(k => { const t = txtE(d, k), x = d.val[k], venc = /vigencia/.test(k) && vencida(x), malo = (MALO_NO.includes(k) && (x === 'No' || x === 'En trámite')) || venc;
    return { k, l: uc1(labE(d, k).replace(/ \(cada N horas\)$/, '')), v: venc ? t + ' (vencida)' : t, malo }; });
  const filaDV = (x) => '<tr><td style="padding:1.5px 8px 1.5px 0;border-bottom:1px dotted ' + C.line + ';font-size:9pt;line-height:1.25;color:' + C.muted + ';width:60%;vertical-align:top">' + esc(x.l) + '</td><td style="padding:1.5px 0;border-bottom:1px dotted ' + C.line + ';font-size:9pt;line-height:1.25;vertical-align:top;font-weight:700;color:' + (x.malo ? C.bad : C.ink) + '">' + (x.malo ? ICO_MALO : '') + esc(x.v) + '</td></tr>';
  const tablaDV = (L) => '<table style="width:100%;table-layout:fixed;border-collapse:collapse"><tbody>' + L.map(filaDV).join('') + '</tbody></table>';
  REM.lista = (d, s, n) => { const ks = (s.campos || []).filter(k => !vacio(d.val[k])); if (!ks.length) return '';
    const pres = PRES(s);
    if (pres !== 'frase') { const L = datosLista(d, s), nov = L.filter(x => x.malo).length;
      if (pres === 'tarjetas') { const chip = nov ? '<span style="display:inline-block;font-size:8pt;line-height:1.5;font-weight:800;border-radius:999px;padding:0 8px;white-space:nowrap;background:' + C.badbg + ';color:' + C.bad + '">' + nov + (nov === 1 ? ' novedad' : ' novedades') + '</span>' : '<span style="display:inline-block;font-size:8pt;line-height:1.5;font-weight:700;border-radius:999px;padding:0 8px;white-space:nowrap;background:' + C.okbg + ';color:' + C.ok + '">Sin novedades</span>';
        const card = '<div data-tarjeta="1" style="break-inside:avoid;page-break-inside:avoid;border:1px solid ' + C.line + ';border-radius:6px;padding:5px 10px 3px;background:#fff;min-width:0"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:2px"><b style="font-size:10pt;font-weight:800;color:' + C.brand + '">' + esc(s.titulo || '') + '</b>' + chip + '</div>' + tablaDV(L) + '</div>';
        return s._grupo ? { compact: true, html: card, tarjeta: true } : { html: '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">' + card + '</div>' }; }
      const t = TABLE(TH('Dato') + TH('Valor'), L.map(x => '<tr>' + TD(esc(x.l), ';color:' + C.muted + ';width:46%') + TD((x.malo ? ICO_MALO : '') + esc(x.v), ';font-weight:700;color:' + (x.malo ? C.bad : C.ink)) + '</tr>').join(''));
      return s._grupo ? { compact: true, html: '<div style="padding:0 0 5px;border-bottom:1px dotted ' + C.line + '"><b style="display:block;margin-bottom:4px;font-size:10pt;font-weight:800;color:' + C.brand + '">' + esc(s.titulo) + ':</b>' + t + '</div>' } : H2(n, s.titulo) + t; }
    const partes = ks.map(k => { const t = txtE(d, k), x = d.val[k], malo = (MALO_NO.includes(k) && (x === 'No' || x === 'En trámite')) || (/vigencia/.test(k) && vencida(x));
      const v = /vigencia/.test(k) && vencida(x) ? t + ' (vencida)' : t, lb = labE(d, k).replace(/ \(cada N horas\)$/, ''); return (lc1(lb) === lc1(s.titulo || '') ? '' : esc(lc1(lb)) + ': ') + (malo ? '<span style="color:' + C.bad + ';font-weight:700">' + esc(v) + '</span>' : '<b style="font-weight:700">' + esc(v) + '</b>'); });
    return RUN(n, s.titulo, uc1(partes.join(' · ').replace(/^([a-záéíóúñ])/, (m) => m)) + '.'); };
  REM.tabla = (d, s, n) => { const G = d.grillas || {}, L = G[s.grilla] || [];
    if (s.grilla === 'em_componentes') { if (!L.length) return ''; const ex = s.porExcepcion || ['Regular', 'Malo'], mal = L.filter(r => ex.includes(r.estado)), bien = L.filter(r => r.estado === 'Bueno').map(r => lc1(r.componente)), na = L.filter(r => r.estado === 'No aplica').map(r => lc1(r.componente));
      if (!mal.length) return RUN(n, s.titulo, '<span style="color:' + C.ok + ';font-weight:700">' + esc(String(s.textoTodosNormales || 'Todos en buen estado ({n} revisados).').replace('{n}', L.length - na.length)) + '</span>' + (na.length ? ' No aplica: ' + esc(unir(na)) + '.' : ''));
      const col = (e) => e === 'Malo' ? tag('Malo', C.badbg, C.bad) : tag('Regular', C.warnbg, C.warn);
      const t = TABLE(TH(esc(s.columnas[0])) + TH(esc(s.columnas[1])) + TH(esc(s.columnas[2])), mal.map(r => '<tr>' + TD(esc(r.componente), ';font-weight:700') + TD(col(r.estado)) + TD(esc(r.obs || RAYA)) + '</tr>').join(''));
      return H2(n, s.titulo) + t + (bien.length ? P(esc(uc1(String(s.restoTexto || 'Resto en buen estado: {lista}.').replace('{lista}', unir(bien)))) + (na.length ? ' No aplica: ' + esc(unir(na)) + '.' : ''), ';margin-top:4px;color:' + C.muted) : ''); }
    if (s.grilla === 'em_implementos') { if (!L.length) return ''; let tot = 0;
      const rows = L.map(x => { const v = Number(x.valor); if (isFinite(v)) tot += v; return '<tr>' + TD(esc(x.desc || RAYA), ';font-weight:700') + TD(esc(x.marca || RAYA)) + TD(esc(x.serie || RAYA)) + TD(isFinite(v) ? usd(v) : RAYA, ';text-align:right;white-space:nowrap') + '</tr>'; }).join('')
        + (s.totales ? '<tr>' + TD('Total', ';font-weight:800;border-top:1.5px solid ' + C.ink) + TD('', ';border-top:1.5px solid ' + C.ink) + TD('', ';border-top:1.5px solid ' + C.ink) + TD(usd(tot), ';font-weight:800;text-align:right;white-space:nowrap;border-top:1.5px solid ' + C.ink) + '</tr>' : '');
      return H2(n, s.titulo) + TABLE(TH(esc(s.columnas[0])) + TH(esc(s.columnas[1])) + TH(esc(s.columnas[2])) + TH(esc(colMon(s.columnas[3])), 'right'), rows); }
    if (s.grilla === 'em_averias') { if (!s.titulo) return ''; // etapa 12a: sin título va debajo del diagrama
      if (!L.length) return ''; return H2(n, s.titulo) + TABLE(s.columnas.map(c => TH(esc(c))).join(''), L.map(a => { const g = GRAV[a.grav] || GRAV.Baja; return '<tr>' + TD(esc(a.pieza || RAYA), ';font-weight:700') + TD(esc(a.tipo || RAYA)) + TD(tag(a.grav || RAYA, g.bg, g.fg)) + '</tr>'; }).join('')); }
    return ''; };
  REM.seguimientos = (d, s, n) => { const L = (d.ov.seg || []).filter(x => !s.soloAceptados || x.estado === 'Aceptado'); if (!L.length) return '';
    return H2(n, s.titulo) + '<ul style="list-style:none;margin:0;padding:0">' + L.map(x => '<li style="display:flex;gap:8px;align-items:baseline;padding:4px 0;border-bottom:1px dotted ' + C.line + ';font-size:9.5pt;color:' + C.ink + '">' + tag(String(x.tipo || 'Seguimiento').toUpperCase(), C.soft, C.muted) + '<span>' + esc(x.texto) + '</span></li>').join('') + '</ul>'; };
  REM.firmas = (d, s) => { const val = d.val, mod = val.em_modalidad_realizada || '', L = ((s.segunModalidad || {})[mod]) || [], sep = (s.espacio || {}).separacion || '16mm', esp = (s.espacio || {}).firma || '20mm'; if (!L.length) return '';
    const ct = (((E().detallesCasos || {})[d.caso.numero] || {}).contacto) || {}, tipo = d.insp ? lc1(d.insp.tipo) : '';
    const quien = (r) => /Quien atiende/.test(r) ? [ct.nombre ? String(ct.nombre).replace(/ \(.*\)$/, '') : RAYA, 'Quien atendió la inspección' + (/\((.*)\)$/.exec(ct.nombre || '') ? ' · ' + lc1(/\((.*)\)$/.exec(ct.nombre)[1]) : '')] : /^Inspector/.test(r) ? [val.em_inspector_ejecuto || RAYA, 'Inspector' + (d.insp && d.insp.tipo === 'Agencia' ? ' · ' + d.insp.ag : tipo ? ' · ' + tipo : '')] : /Aceptación del cliente/.test(r) ? [d.caso.asegurado || RAYA, 'Aceptación del cliente en la videollamada'] : [RAYA, r];
    return '<div style="padding-top:calc(' + sep.replace(' ', '') + ' - 14px);break-inside:avoid;display:grid;grid-template-columns:repeat(' + Math.max(2, L.length) + ',minmax(0,1fr));gap:40px;font-size:8.5pt;text-align:center;color:' + C.ink + '">'
      + L.map(r => { const q = quien(r); return '<div><div style="height:' + esp.replace(' ', '') + '"></div><div style="border-top:1px solid ' + C.ink + ';padding-top:4px"><b style="display:block;font-size:9pt">' + esc(q[0]) + '</b><i style="font-style:normal;color:' + C.muted + ';font-size:7.5pt">' + esc(q[1]) + '</i></div></div>'; }).join('') + '</div>'; };

  // ---------- Documento ----------
  // id: 'informe' | 'resumen' (el documento Vigente de ese destino) o el id del modelo. opts.def: definición a usar (borrador del diseñador).
  function documento(id, ctx, opts) {
    const o = opts || {}, M = modelo(), did0 = (ctx && ctx.em ? DOC_ID_EM : DOC_ID)[id] || id, doc = o.def || vigentePara(did0); if (!doc || !doc.secciones || !ctx) return null;
    const did = doc.id || did0, es = Object.assign({}, estiloBase(), doc.estiloDoc || {}), C0 = Object.assign({}, C);
    Object.assign(C, { brand: es.colorPrincipal || C0.brand, acc: es.colorAcento || C0.acc });
    try {
    const d = preparar(ctx, o), blocks = []; let nC = 0, brk = false, enc = null; const hechos = {};
    const secs = doc.secciones.filter(s => !s.oculta), tablaAve = secs.find(s => s.tipo === 'tabla' && (s.grilla === 'ave' || (s.grilla === 'em_averias' && !s.titulo)));
    let cur = -1; const push = (b) => { if (brk) { b.brk = true; brk = false; } if (!b.sis) b.sis = [cur]; blocks.push(b); };
    secs.forEach(s => { const t = s.tipo; cur = doc.secciones.indexOf(s);
      if (t === 'encabezado') { enc = s; return; } if (t === 'salto') { if (blocks.length) brk = true; return; }
      if (s.condiciones && !s.resumenSiNo && !cumple(d, s.condiciones)) return;
      // Secciones con el mismo agruparEn: un solo capítulo con una línea por sección (título en negrita), en la posición de la primera.
      if (s.agruparEn) { const g = s.agruparEn; if (hechos[g]) return; hechos[g] = true;
        const L0 = secs.filter(x => x.agruparEn === g && (!x.condiciones || cumple(d, x.condiciones))).map(x => { const f = (d.em && REM[x.tipo]) || R[x.tipo], r = f ? f(d, Object.assign({}, x, { _grupo: true }), 0) : ''; return { h: typeof r === 'string' ? r : (r && r.html) || '', t: !!(r && r.tarjeta) }; }).filter(x => x.h);
        // Etapa 8c · las tarjetas seguidas se agrupan en una cuadrícula de 2 columnas (2×2 con 4 grupos); lo demás sigue en una línea por lista.
        const L = []; L0.forEach((x, k) => { if (x.t) { if (k > 0 && L0[k - 1].t) L[L.length - 1] = L[L.length - 1].replace(/<\/div>$/, x.h + '</div>'); else L.push('<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;align-items:stretch">' + x.h + '</div>'); } else L.push(x.h); });
        if (!L.length) return; nC++; push({ html: H2(nC, g) + L.join('<div style="height:6px"></div>'), tipo: 'grupo', sis: doc.secciones.map((x, k) => x.agruparEn === g ? k : -1).filter(k => k >= 0) }); return; }
      if (t === 'fotos') { const L = fotosBloques(d, s, nC + 1); if (L.length) { nC++; L.forEach(push); } return; }
      const numerada = !!s.titulo && !['tarjeta', 'resultado', 'firmas'].includes(t), n = numerada ? nC + 1 : 0, fn = (d.em && REM[t]) || R[t];
      const r = fn ? (t === 'diagrama' ? fn(d, s, n, tablaAve) : fn(d, s, n)) : '', html = typeof r === 'string' ? r : (r && r.html) || ''; if (!html) return; if (numerada) nC++;
      const last = blocks[blocks.length - 1]; if (r && r.compact && last && last.compact && !brk) { last.html += '<div style="height:6px"></div>' + html; last.sis.push(cur); return; }
      // Dos secciones de datos seguidas van lado a lado, cada una en 2 columnas (como Asegurado y propiedad junto a Conductor habitual).
      if (r && r.media && last && last.media && !last.par && !brk) { last.html = '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start"><div style="min-width:0">' + last.media + '</div><div style="min-width:0">' + r.media + '</div></div>'; last.par = true; last.sis.push(cur); return; }
      push({ html, tipo: t, compact: !!(r && r.compact), media: (r && r.media) || '', conAnterior: t === 'firmas' }); });
    // Encabezado y pie (logos de la biblioteca, estilo del documento y versión con la que se genera).
    const LG = M.logos || [], le = es.logos || {}, lgIzq = LG.find(l => l.id === (le.izq || 'compania')) || {}, agencia = d.insp && d.insp.tipo === 'Agencia' ? d.insp.ag : '';
    const der = le.der === undefined ? 'proveedor' : le.der, lgDer = LG.find(l => l.id === der) || null, ver = doc.version || 1;
    // Etapa 10b: si la agencia del inspector subió su logo en Usuarios y roles › Agencias, ese logo ocupa el lugar del nombre de la agencia en el encabezado.
    const lgAg = der === 'proveedor' && agencia && window.SiriusUsuarios && window.SiriusUsuarios.logoAgencia ? window.SiriusUsuarios.logoAgencia(agencia) : null;
    const cod = codigo(did + '|' + ctx.rid + '|' + ctx.caso + '|v' + ver), ins = f4(d.val.veh_fecha_hora_inspeccion || d.val.em_fecha_hora_inspeccion || '');
    const cab = (enc && enc.datosCabecera || []).map(x => x.replace('{caso.numero}', d.caso.numero + (d.total > 1 ? (ctx.em ? ' · Equipo ' : ' · Riesgo ') + (d.idx + 1) + ' de ' + d.total : '')).replace('{veh_fecha_hora_inspeccion}', ins || RAYA).replace('{em_fecha_hora_inspeccion}', ins || RAYA).replace('{documento.codigo}', cod));
    const tipoDoc = /resumen/.test(did0) || /APS/.test(doc.destino || '') ? 'resumen' : 'informe', archivo = window.SiriusSalidaVeh ? window.SiriusSalidaVeh.archivo(DOC_ID[id] ? id : tipoDoc, ctx) : did + '.pdf';
    const pie = es.pie || {}, interno = /interno/i.test(doc.destino || ''), pd = [], mm = (x) => String(x || '14 mm').replace(/\s+/g, '');
    if (pie.codigo !== false) pd.push('Código ' + cod); if (interno && ver >= 2) pd.push('Plantilla de documento v' + ver); if (pie.pagina !== false) pd.push('Página {N} de {M}');
    return { id: did, nombre: doc.nombre, destino: doc.destino, version: ver, archivo, codigo: cod, titulo: (enc && enc.titulo) || doc.nombre,
      logo: lgIzq.archivo || '', logoAlt: lgIzq.nombre || 'Aseguradora del Sur', agencia: der === 'proveedor' && !lgAg ? agencia : '', logoDer: lgAg ? lgAg.archivo : der && der !== 'proveedor' && lgDer && lgDer.archivo ? lgDer.archivo : '', logoDerAlt: lgAg ? lgAg.nombre : lgDer ? lgDer.nombre : '',
      cab1: cab, cabN: ['Caso ' + d.caso.numero + ' · ' + (ctx.placa || ctx.etiqueta || ctx.rid)],
      pieIzq: pie.generado === false ? 'Aseguradora del Sur' : 'Aseguradora del Sur · Generado con SIRIUS el ' + fmtAhora() + (d.usuario ? ' por ' + d.usuario : ''), pieDer: pd.join(' · '), blocks,
      colorP: es.colorPrincipal || '#0B2E59', margen: mm(es.margenes), fuente: /^Arial/.test(es.fuente || '') ? 'Arial, sans-serif' : 'var(--font-brand), Mulish, Arial, sans-serif', marca: o.marca || '', unaPagina: doc.paginas === 'Una' };
    } finally { Object.assign(C, C0); }
  }

  // ---------- Modelo de la sesión (diseñador «Documento PDF» · DEC-126) ----------
  // Los cambios viven en SIRIUS_DOCUMENTOS_PDF durante la sesión (al recargar vuelven al archivo). Cada documento: secciones y estiloDoc
  // de la versión Vigente, borrador (o null), versiones, generados por versión e historial.
  const clone = (x) => JSON.parse(JSON.stringify(x));
  function estiloBase() { const e = DP().estilo || {}; return { pagina: e.pagina || 'A4 vertical', margenes: e.margenes || '14 mm', fuente: e.fuente || 'Mulish (respaldo Arial)', colorPrincipal: e.colorPrincipal || '#0B2E59', colorAcento: e.colorAcento || '#0B5CAD', marcaAgua: e.marcaAgua || '', pie: { pagina: true, codigo: true, generado: true }, logos: { izq: 'compania', der: 'proveedor' } }; }
  const TIPOS_RG = [
    { id: 'portada', nombre: 'Portada', opciones: ['titulo', 'filas', 'foto de fachada'], nota: 'DP2 · Ramos Generales: portada del bloque S (página propia con datos del caso y la foto de fachada).' },
    { id: 'indice', nombre: 'Contenido', opciones: [], nota: 'DP2 · Ramos Generales: tabla de contenido con los capítulos que tienen contenido.' },
    { id: 'capitulo', nombre: 'Capítulo de Ramos Generales', opciones: ['modulo', 'bloques', 'porInstancia', 'observaciones', 'criterios', 'fotos', 'siVacio'], nota: 'DP2 · Ramos Generales: capítulo del bloque S con sus bloques (tabla de datos, grilla, texto, tabla por instancia, lista de verificación, criterio, matriz, fichas, línea y documentos), observaciones, calificación del capítulo, documentos de respaldo y fotos.' },
    { id: 'personalizada', nombre: 'Personalizada (solo lectura)', opciones: [], nota: 'DP2 · Ramos Generales: sección que no se puede expresar con los tipos del modelo sin cambiar el resultado (Calificación del riesgo y Anexo). Se puede mover o quitar, no editar.' },
  ];
  // Migración de Ramos Generales: cada capítulo de SIRIUS_SALIDA_RG pasa a una sección con todos sus datos.
  function seccionRG(c) { const b0 = Array.isArray(c.bloques) ? c.bloques[0] : null, t = b0 === 'portada' ? 'portada' : b0 === 'firmas' ? 'firmas' : (c.anexo || c.id === 'calificacion') ? 'personalizada' : 'capitulo';
    return Object.assign({ tipo: t }, clone(c), t === 'personalizada' ? { soloLectura: true, motivo: c.anexo ? 'Anexo con las decisiones del calificador, las garantías no exigidas y los textos pendientes: se arma con el estado de la calificación.' : 'Calificación del riesgo: tablas por ramo, módulos, capítulos, mapa de calor y escala, calculadas por el motor de calificación.' } : {}); }
  function migrarRG(D) { const SD = window.SIRIUS_SALIDA_RG; if (!SD || !SD.documentos) return false; let ok = false;
    [['rg-resumen', SD.documentos[0]], ['rg-informe', SD.documentos[1]]].forEach(([id, src]) => { const doc = D.documentos.find(x => x.id === id); if (!doc || doc.secciones || !src) return;
      const L = (src.capitulos || []).map(seccionRG); if (id === 'rg-informe') L.splice(1, 0, { tipo: 'indice', titulo: 'Contenido' }); doc.secciones = L; doc.salidaRG = src.id; ok = true; });
    return ok; }
  function prepararDoc(d) { d.estiloDoc = d.estiloDoc || estiloBase(); if (d.secciones && !d.versiones) d.versiones = [{ n: d.version || 1, secciones: clone(d.secciones), estiloDoc: clone(d.estiloDoc), fecha: '', por: '', motivo: 'Base del modelo (' + (DP().version ? 'v' + DP().version : '') + ')' }];
    d.borrador = d.borrador || null; d.generados = d.generados || {}; d.actualizado = d.actualizado || ''; d.por = d.por || ''; }
  // Logos (DEC-127): cada logo de la biblioteca declara su fondo. Los de assets se clasificaron mirando cada archivo.
  const FONDO_ENC = 'claro';
  const FONDO_ASSET = { 'assets/ads-horizontal.png': 'claro', 'assets/sirius-logo-claro.png': 'claro', 'assets/ads-logo-oscuro.png': 'oscuro', 'assets/sirius-logo-oscuro-solo.png': 'oscuro', 'assets/sirius-logo-oscuro.png': 'oscuro' };
  const PARES = { compania: 'compania-oscuro', 'compania-oscuro': 'compania', sirius: 'sirius-claro', 'sirius-claro': 'sirius-oscuro', 'sirius-oscuro': 'sirius-claro' };
  const LOGOS_EXTRA = [
    { id: 'compania-oscuro', nombre: 'Aseguradora del Sur (fondo oscuro)', archivo: 'assets/ads-logo-oscuro.png', tipo: 'Compañía', fondo: 'oscuro', uso: 'Versión con letras claras para fondos oscuros' },
    { id: 'sirius-claro', nombre: 'SIRIUS (fondo claro)', archivo: 'assets/sirius-logo-claro.png', tipo: 'Plataforma', fondo: 'claro', uso: 'Versión para fondos claros, sin recuadro' },
    { id: 'sirius-oscuro', nombre: 'SIRIUS (fondo oscuro)', archivo: 'assets/sirius-logo-oscuro-solo.png', tipo: 'Plataforma', fondo: 'oscuro', uso: 'Versión con letras claras, transparente, para fondos oscuros' } ];
  function logosMeta(D) { const L = D.logos || []; if (D.__lg) return; D.__lg = true;
    L.forEach(l => { if (!l.fondo) l.fondo = FONDO_ASSET[l.archivo] || 'claro'; if (l.archivo === 'assets/sirius-logo-oscuro.png') l.nota = 'Imagen con su propio fondo negro: sobre un encabezado claro se imprime como un rectángulo oscuro.'; });
    LOGOS_EXTRA.forEach(x => { if (!L.some(l => l.id === x.id)) L.push(Object.assign({}, x)); }); }
  const logoPor = (id) => ((modelo().logos || []).find(l => l.id === id)) || null;
  // Aviso en línea cuando el logo no corresponde al fondo del encabezado (siempre claro, porque el documento se imprime sobre blanco).
  const nomF = (l) => /\(fondo/.test(l.nombre) ? l.nombre : l.nombre + ' (fondo ' + (l.fondo || 'claro') + ')';
  function avisoLogo(id) { const l = logoPor(id); if (!l || !l.archivo || (l.fondo || 'claro') === FONDO_ENC) return null;
    const par = logoPor(l.par || PARES[l.id]), alt = par && par.archivo && par.fondo === FONDO_ENC ? par : (modelo().logos || []).find(x => x.tipo === l.tipo && x.archivo && x.fondo === FONDO_ENC && x.id !== l.id) || null;
    return { id: l.id, alt: alt ? alt.id : '', altNombre: alt ? nomF(alt) : '', msg: '«' + nomF(l) + '» es para fondo oscuro y el encabezado tiene fondo claro: se vería con poco contraste' + (l.nota ? ' (' + l.nota.charAt(0).toLowerCase() + l.nota.slice(1).replace(/\.$/, '') + ')' : '') + '.', sug: alt ? 'Usa «' + nomF(alt) + '», la versión para fondo claro.' : 'Sube la versión para fondo claro.' }; }
  function modelo() { const D = DP(); if (!D || !D.documentos) return D || {};
    const S = window.__SIRIUS_DOCPDF_SES;
    if (!D.__ses) { if (S && S.version === D.version) { ['documentos', 'logos', 'historial', 'tiposSeccion'].forEach(k => { D[k] = S[k]; }); D.rev = S.rev || 0; D.__ses = true; }
      else { TIPOS_RG.forEach(t => { if (!(D.tiposSeccion || []).some(x => x.id === t.id)) D.tiposSeccion.push(Object.assign({}, t)); }); D.historial = []; D.rev = 0; D.__ses = true;
        window.__SIRIUS_DOCPDF_SES = { version: D.version, documentos: D.documentos, logos: D.logos, historial: D.historial, tiposSeccion: D.tiposSeccion, get rev() { return D.rev; } }; } }
    if (D.documentos.some(x => !x.secciones) && migrarRG(D)) D.rev = (D.rev || 0) + 1;
    D.documentos.forEach(prepararDoc); logosMeta(D); return D; }
  const tocar = () => { const D = DP(); D.rev = (D.rev || 0) + 1; (oyentes || []).forEach(f => { try { f(); } catch (e) {} }); };
  let oyentes = [];
  function on(f) { oyentes.push(f); return () => { oyentes = oyentes.filter(x => x !== f); }; }
  function porId(id) { return (modelo().documentos || []).find(x => x.id === id) || null; }
  // Documento Vigente para el destino del documento base (si se retiró la base, el otro Vigente de esa plantilla y destino).
  function vigentePara(id) { const b = porId(id); if (!b) return null; if (b.estado === 'Vigente' && b.secciones) return b; return (modelo().documentos || []).find(x => x.plantilla === b.plantilla && x.destino === b.destino && x.estado === 'Vigente' && x.secciones) || null; }
  function docsDe(plantilla) { return (modelo().documentos || []).filter(x => x.plantilla === plantilla); }
  function quien(p) { return p || 'Andrea Salazar'; }
  function sello() { const d = ahora(); return z2(d.getDate()) + '/' + z2(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + z2(d.getHours()) + ':' + z2(d.getMinutes()); }
  function anotar(doc, que, motivo, por) { modelo().historial.unshift({ fecha: sello(), por: quien(por), doc: doc.nombre, id: doc.id, que, motivo: motivo || '' }); doc.actualizado = sello(); doc.por = quien(por); }
  // Borrador: copia de la versión Vigente (o el contenido de un documento nuevo).
  function borrador(id, crear) { const d = porId(id); if (!d) return null; if (!d.borrador && crear) d.borrador = { secciones: clone(d.secciones || []), estiloDoc: clone(d.estiloDoc || estiloBase()), desde: d.version || 0 }; return d.borrador; }
  function editar(id, fn, por) { const b = borrador(id, true); if (!b) return; const nuevo = !b.tocado; fn(b); b.tocado = true; if (nuevo) anotar(porId(id), 'Creó un borrador a partir de la versión ' + (porId(id).version || '—'), '', por); tocar(); }
  function definicion(id, conBorrador) { const d = porId(id); if (!d) return null; const b = conBorrador && d.borrador; return Object.assign({}, d, { secciones: b ? b.secciones : d.secciones, estiloDoc: b ? b.estiloDoc : d.estiloDoc }); }
  const nombreTipo = (t) => ((modelo().tiposSeccion || []).find(x => x.id === t) || { nombre: t }).nombre;
  const etiquetaSec = (s) => s.titulo || s.agruparEn || nombreTipo(s.tipo);
  // Impacto de publicar: qué cambia frente a la Vigente y qué documentos se generarán distinto.
  function impacto(id) { const d = porId(id), b = d && d.borrador; if (!b) return { cambios: [], docs: '' }; const A = d.secciones || [], B = b.secciones, cambios = [], key = (s) => s.tipo + '|' + etiquetaSec(s);
    A.forEach(s => { if (!B.some(x => key(x) === key(s))) cambios.push('Quita la sección «' + etiquetaSec(s) + '»'); });
    B.forEach(s => { if (!A.some(x => key(x) === key(s))) cambios.push('Agrega la sección «' + etiquetaSec(s) + '»'); });
    B.forEach(s => { const a = A.find(x => key(x) === key(s)); if (a && JSON.stringify(a) !== JSON.stringify(s)) { const PL = { frase: 'Frase', tabla: 'Tabla', tarjetas: 'Tarjetas' }, pa = PL[a.presentacion || 'frase'], pb = PL[s.presentacion || 'frase'], resto = JSON.stringify(Object.assign({}, a, { presentacion: null })) !== JSON.stringify(Object.assign({}, s, { presentacion: null })); if (pa !== pb) cambios.push('Presentación de «' + etiquetaSec(s) + '» pasa de ' + pa + ' a ' + pb); if (resto || pa === pb) cambios.push('Cambia la sección «' + etiquetaSec(s) + '»'); } });
    const ordA = A.map(key).filter(k => B.some(x => key(x) === k)), ordB = B.map(key).filter(k => A.some(x => key(x) === k)); if (ordA.join() !== ordB.join()) cambios.push('Cambia el orden de las secciones');
    const ea = d.estiloDoc || {}, eb = b.estiloDoc || {}; ['pagina', 'margenes', 'fuente', 'colorPrincipal', 'colorAcento', 'marcaAgua'].forEach(k => { if (String(ea[k] || '') !== String(eb[k] || '')) cambios.push('Estilo: ' + k.replace('colorPrincipal', 'color principal').replace('colorAcento', 'color de acento').replace('marcaAgua', 'marca de agua').replace('margenes', 'márgenes').replace('pagina', 'página') + ' pasa de «' + (ea[k] || '—') + '» a «' + (eb[k] || '—') + '»'); });
    if (JSON.stringify(ea.pie || {}) !== JSON.stringify(eb.pie || {})) cambios.push('Cambia el pie del documento'); if (JSON.stringify(ea.logos || {}) !== JSON.stringify(eb.logos || {})) cambios.push('Cambian los logos del encabezado');
    const E0 = E(), veh = /Vehículos/.test(d.plantilla), L = veh ? (E0.vehiculos || []).filter(v => v.informe && v.informe.estado === 'Enviado') : Object.keys((window.SIRIUS_INFORMES_RG || {}).casos || {});
    const ej = veh ? L.slice(0, 2).map(v => v.riesgo + (v.placa ? ' · ' + v.placa : '')) : L.slice(0, 2);
    const docs = d.estado === 'Vigente' || d.version ? 'Desde ahora «' + d.nombre + '» se generará con la versión ' + ((d.version || 0) + 1) + ' para ' + L.length + (veh ? (L.length === 1 ? ' vehículo con informe enviado' : ' vehículos con informe enviado') : (L.length === 1 ? ' caso de Ramos Generales' : ' casos de Ramos Generales')) + (ej.length ? ' (p. ej. ' + ej.join(', ') + ')' : '') + '. Los PDF ya generados no cambian.' : 'Es la primera versión: el documento pasa a Vigente.';
    return { cambios, docs }; }
  function publicar(id, motivo, por) { const d = porId(id), b = d && d.borrador; if (!b) return false; const v = (d.version || 0) + 1, cambios = impacto(id).cambios;
    d.secciones = b.secciones; d.estiloDoc = b.estiloDoc; d.version = v; d.estado = 'Vigente'; d.borrador = null; d.versiones.push({ n: v, secciones: clone(d.secciones), estiloDoc: clone(d.estiloDoc), fecha: sello(), por: quien(por), motivo });
    anotar(d, 'Publicó la versión ' + v + (cambios.length ? ': ' + cambios.join('; ') : ''), motivo, por); tocar(); return true; }
  function descartar(id, por) { const d = porId(id); if (!d || !d.borrador) return; d.borrador = null; anotar(d, 'Descartó el borrador', '', por); if (!d.secciones && !d.version) { const D = modelo(); D.documentos.splice(D.documentos.indexOf(d), 1); } tocar(); }
  function nuevoId(base) { const D = modelo(); let i = 1, id; do { id = base + '-' + (i++); } while (D.documentos.some(x => x.id === id)); return id; }
  // Agregar documento: vacío (encabezado y una sección de texto) o copiando otro. Nace como Borrador; al publicar pasa a Vigente v1.
  function agregar(o, por) { const D = modelo(), src = o.copiaDe ? porId(o.copiaDe) : null, pl = o.plantilla || (src && src.plantilla);
    const secs = src ? clone(src.borrador ? src.borrador.secciones : src.secciones) : (/Vehículos/.test(pl) ? [{ tipo: 'encabezado', logos: ['compania', 'proveedor'], titulo: o.nombre, datosCabecera: ['Caso {caso.numero}', 'Inspección {veh_fecha_hora_inspeccion}', 'Código {documento.codigo}'] }, { tipo: 'tarjeta', destacado: 'veh_placa', campos: ['veh_marca', 'veh_modelo', 'veh_anio_modelo'], fotosReferencia: ['exteriores_frontal', 'exteriores_posterior'], sinFoto: 'Sin foto' }] : [{ tipo: 'portada', id: 'portada', titulo: null, bloques: ['portada'] }]);
    if (src) { const e = secs.find(x => x.tipo === 'encabezado'); if (e) e.titulo = o.nombre; }
    const d = { id: nuevoId(src ? src.id : (/Vehículos/.test(pl) ? 'veh-doc' : 'rg-doc')), plantilla: pl, nombre: o.nombre, destino: o.destino || (src && src.destino) || '', estado: 'Borrador', version: 0, base: false, paginas: src && src.paginas, salidaRG: src && src.salidaRG, secciones: null, estiloDoc: clone(src ? src.estiloDoc : estiloBase()), versiones: [], borrador: null, generados: {}, actualizado: '', por: '' };
    d.borrador = { secciones: secs, estiloDoc: clone(d.estiloDoc), desde: 0, tocado: true }; D.documentos.push(d);
    anotar(d, src ? 'Agregó el documento copiando «' + src.nombre + '» (' + src.id + ')' : 'Agregó un documento vacío', '', por); tocar(); return d; }
  function generadosDe(d) { return Object.keys(d.generados || {}).reduce((a, k) => a + (d.generados[k] || 0), 0); }
  // Motivos por los que una acción no aplica ('' = se puede).
  function puede(id) { const d = porId(id); if (!d) return {}; const vig = (modelo().documentos || []).filter(x => x.plantilla === d.plantilla && x.destino === d.destino && x.estado === 'Vigente'), unico = d.estado === 'Vigente' && vig.length <= 1, g = generadosDe(d);
    return { retirar: d.estado !== 'Vigente' ? 'Solo se retira un documento Vigente' : unico ? 'Es el único documento Vigente para «' + d.destino + '»: publica otro para ese destino antes de retirarlo.' : '',
      eliminar: d.base ? 'Es una base del modelo: no se puede eliminar; sí duplicar y modificar.' : g ? 'Ya se generaron ' + g + (g === 1 ? ' PDF' : ' PDF') + ' con este documento: solo se puede retirar.' : unico ? 'Es el único documento Vigente para «' + d.destino + '».' : '' }; }
  function retirar(id, motivo, por) { const p = puede(id); if (p.retirar) return false; const d = porId(id); d.estado = 'Retirada'; anotar(d, 'Retiró el documento (los PDF ya generados no cambian)', motivo, por); tocar(); return true; }
  function eliminar(id, por) { const p = puede(id); if (p.eliminar) return false; const D = modelo(), d = porId(id); D.documentos.splice(D.documentos.indexOf(d), 1); D.historial.unshift({ fecha: sello(), por: quien(por), doc: d.nombre, id: d.id, que: 'Eliminó el documento', motivo: '' }); tocar(); return true; }
  // Cada PDF guarda la versión con la que se hizo.
  function registrarGenerado(id, n, version) { const d = typeof id === 'string' ? (vigentePara(DOC_ID[id] || id) || porId(id)) : id; if (!d) return; const v = version || d.version || 1; d.generados[v] = (d.generados[v] || 0) + (n || 1); tocar(); }
  // Ramos Generales: capítulos de SIRIUS_SALIDA_RG reconstruidos desde las secciones (Vigente u override del diseñador).
  // override: secciones, o { secciones, estiloDoc } (borrador del diseñador). Desde la v2 devuelve también el encabezado, el estilo y el pie.
  function capitulosRG(cual, override) { const D = modelo(), id = cual === 'tecnico' ? 'rg-informe' : 'rg-resumen', base = vigentePara(id), ov = override && !Array.isArray(override) ? override : null, secs = ov ? ov.secciones : (override || (base && base.secciones)); if (!secs) return null;
    const L = secs.filter(s => !s.oculta), quitar = (s) => { const c = clone(s); delete c.tipo; delete c.soloLectura; delete c.motivo; delete c.condiciones; delete c.oculta; return c; };
    const version = override ? ((porId(id) || {}).version || 1) + 1 : (base ? base.version || 1 : 1), es = Object.assign({}, estiloBase(), (ov ? ov.estiloDoc : (base && base.estiloDoc)) || {});
    let enc = null; if (version >= 2) { const le = es.logos || {}, izq = logoPor(le.izq || 'compania') || {}, derId = le.der === undefined ? 'proveedor' : le.der, der = derId && derId !== 'proveedor' ? logoPor(derId) : null, pie = es.pie || {};
      enc = { titulo: (base && base.nombre) || '', logo: izq.archivo || '', logoAlt: izq.nombre || 'Aseguradora del Sur', logoDer: der && der.archivo ? der.archivo : '', logoDerAlt: der ? der.nombre : '', colorP: es.colorPrincipal || '#0B2E59', margen: String(es.margenes || '14 mm').replace(/\s+/g, ''), fuente: /^Arial/.test(es.fuente || '') ? 'Arial, sans-serif' : 'var(--font-brand), Mulish, Arial, sans-serif', pagina: pie.pagina !== false, codigo: pie.codigo !== false, generado: pie.generado !== false, semilla: id + '|v' + version }; }
    return { capitulos: L.filter(s => s.tipo !== 'indice').map(quitar), portada: L.some(s => s.tipo === 'portada'), indice: L.some(s => s.tipo === 'indice'), firmas: L.some(s => s.tipo === 'firmas'), version, doc: base, enc }; }
  function contraste(hex) { const h = String(hex || '').replace('#', ''); if (!/^[0-9a-f]{6}$/i.test(h)) return null; const L = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)), lum = 0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2]; return Math.round((1.05 / (lum + 0.05)) * 100) / 100; }

  window.SiriusDocumentosPdf = { documento, hallazgos: (ctx, ids, opts) => hallazgos(preparar(ctx, opts), ids), diagrama: (ctx, opts) => diagrama(preparar(ctx, opts)), averias: (ctx, opts) => averias(preparar(ctx, opts)), codigo, modelos: MODELOS,
    modelo, on, porId, vigentePara, docsDe, borrador, editar, definicion, impacto, publicar, descartar, agregar, puede, retirar, eliminar, registrarGenerado, generadosDe, capitulosRG, contraste, estiloBase, arbol, fraseCond, reglaTxt, cumpleRegla, evalItems, itemValido, avisoLogo, logoPor, FONDO_ENC, nombreTipo, etiquetaSec, sello, anotar, tocar, clone };
})();
