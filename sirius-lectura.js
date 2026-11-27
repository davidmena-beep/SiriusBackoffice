/* =====================================================================================================
   SIRIUS · sirius-lectura.js · Lectura automática de datos (PP-OCRv4) · 25/11/2026 · DEC-285 a DEC-289
   Motor y reglas validados en la maqueta (50 pruebas, 8 probadores): placa, kilometraje, VIN, matrícula (formatos ANT, ATT y ATM;
   frente y reverso) y licencia de conducir (formato nuevo y anterior). Endereza fotos giradas y amplía documentos lejanos.
   · SiriusLectura.leer(imagen | canvas | blob | url, tipo?) → { tipo, lado, campos: { campo: { valor, conf, nota, dudoso?, iso? } }, ms }
   · SiriusLectura.cola(conexión): cola en segundo plano del Back-office (SQL 93): lee las fotos pendientes y registra cada lectura;
     la base precarga el informe (solo campos vacíos) y genera los controles.
   Requiere onnxruntime-web 1.30.0 (ort.wasm.min.js). Modelos: AppInspector/ocr/modelos (GitHub Pages).
   ===================================================================================================== */
(typeof window !== 'undefined' ? window : self).SiriusLectura = (function () {
'use strict';
const EN_WORKER = typeof document === 'undefined';
const nuevoLienzo = () => EN_WORKER ? new OffscreenCanvas(1, 1) : document.createElement('canvas');   // en el Web Worker no hay «document»
const ORT_CDN = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';
const DET = { limit: 736, thresh: 0.3, boxThresh: 0.5, unclip: 1.6, maxSide: 2000 };
const REC = { h: 48, w: 320, batch: 6, minScore: 0.5 };
let detS = null, recS = null, CLAVES = null; const MED = { info: {} };
const ahora = () => performance.now();
let CARGA = null, BASE = 'https://davidmena-beep.github.io/AppInspector/ocr/modelos/';
async function bajar(url) { const r = await fetch(url, { cache: 'force-cache' }); if (!r.ok) throw new Error('No se pudo descargar ' + url); return new Uint8Array(await r.arrayBuffer()); }
function iniciar() {
  if (CARGA) return CARGA;
  CARGA = (async () => { if (!self.ort) throw new Error('Falta onnxruntime-web');
    ort.env.wasm.wasmPaths = ORT_CDN; ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;
    const [det, rec, claves] = await Promise.all([bajar(BASE + 'ch_PP-OCRv4_det_infer.onnx'), bajar(BASE + 'ch_PP-OCRv4_rec_infer.onnx'), fetch(BASE + 'claves.txt', { cache: 'force-cache' }).then(r => r.text())]);
    const op = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
    detS = await ort.InferenceSession.create(det, op); recS = await ort.InferenceSession.create(rec, op); CLAVES = ['blank'].concat(claves.split('\n')).concat([' ']); return true; })();
  CARGA.catch(() => { CARGA = null; }); return CARGA;
}
function aLienzo(img, maxSide) { const k = Math.min(1, maxSide / Math.max(img.width, img.height)); const c = nuevoLienzo(); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c; }
function tensorBGR(ctx, w, h, mean, std) {   // [1,3,h,w] en BGR, (x/255 - mean)/std
  const d = ctx.getImageData(0, 0, w, h).data, n = w * h, f = new Float32Array(3 * n);
  for (let i = 0, p = 0; p < n; i += 4, p++) { f[p] = (d[i + 2] / 255 - mean) / std; f[n + p] = (d[i + 1] / 255 - mean) / std; f[2 * n + p] = (d[i] / 255 - mean) / std; }
  return f;
}
async function detectar(src) {
  const h = src.height, w = src.width; let r = 1; if (Math.min(h, w) < DET.limit) r = DET.limit / Math.min(h, w);
  const rh = Math.max(32, Math.round(Math.floor(h * r) / 32) * 32), rw = Math.max(32, Math.round(Math.floor(w * r) / 32) * 32);
  const c = nuevoLienzo(); c.width = rw; c.height = rh; const x = c.getContext('2d'); x.drawImage(src, 0, 0, rw, rh);
  const out = await detS.run({ [detS.inputNames[0]]: new ort.Tensor('float32', tensorBGR(x, rw, rh, 0.5, 0.5), [1, 3, rh, rw]) });
  const prob = out[detS.outputNames[0]].data; const sx = w / rw, sy = h / rh;
  // binarización + dilatación 2×2 + componentes conectados
  const bin = new Uint8Array(rw * rh); for (let i = 0; i < bin.length; i++) bin[i] = prob[i] > DET.thresh ? 1 : 0;
  const dil = new Uint8Array(bin); for (let y = 0; y < rh; y++) for (let xx = 0; xx < rw; xx++) if (bin[y * rw + xx]) { if (xx + 1 < rw) dil[y * rw + xx + 1] = 1; if (y + 1 < rh) { dil[(y + 1) * rw + xx] = 1; if (xx + 1 < rw) dil[(y + 1) * rw + xx + 1] = 1; } }
  const vis = new Uint8Array(rw * rh), cajas = [], pila = new Int32Array(rw * rh);
  for (let s = 0; s < dil.length; s++) {
    if (!dil[s] || vis[s]) continue; let sp = 0; pila[sp++] = s; vis[s] = 1; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, suma = 0, n = 0;
    let mx = 0, my = 0, mxx = 0, myy = 0, mxy = 0; const pix = [];
    while (sp) { const p = pila[--sp], py = (p / rw) | 0, px = p - py * rw; if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; suma += prob[p]; n++;
      mx += px; my += py; mxx += px * px; myy += py * py; mxy += px * py; pix.push(px, py);
      if (px > 0 && dil[p - 1] && !vis[p - 1]) { vis[p - 1] = 1; pila[sp++] = p - 1; } if (px < rw - 1 && dil[p + 1] && !vis[p + 1]) { vis[p + 1] = 1; pila[sp++] = p + 1; }
      if (py > 0 && dil[p - rw] && !vis[p - rw]) { vis[p - rw] = 1; pila[sp++] = p - rw; } if (py < rh - 1 && dil[p + rw] && !vis[p + rw]) { vis[p + rw] = 1; pila[sp++] = p + rw; } }
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1; if (Math.min(bw, bh) < 3 || suma / n < DET.boxThresh) continue;
    // rectángulo girado: eje principal por momentos de inercia (como minAreaRect para textos alargados)
    const cx = mx / n, cy = my / n, sxx = mxx / n - cx * cx, syy = myy / n - cy * cy, sxy = mxy / n - cx * cy; let ang = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    const tr = sxx + syy, de = Math.sqrt(Math.max(0, (sxx - syy) * (sxx - syy) / 4 + sxy * sxy)), l1 = tr / 2 + de, l2 = Math.max(1e-6, tr / 2 - de);
    if (Math.abs(ang) < 0.035 || l1 / l2 < 4) ang = 0;   // menos de 2°, o caja casi cuadrada (una o dos letras): recto
    const ca = Math.cos(ang), sa = Math.sin(ang); let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
    for (let i = 0; i < pix.length; i += 2) { const dx = pix[i] - cx, dy = pix[i + 1] - cy, u = dx * ca + dy * sa, v = -dx * sa + dy * ca; if (u < u0) u0 = u; if (u > u1) u1 = u; if (v < v0) v0 = v; if (v > v1) v1 = v; }
    const L = u1 - u0 + 1, A = v1 - v0 + 1; if (Math.min(L, A) < 3) continue;
    const dist = (L * A) * DET.unclip / (2 * (L + A));   // «unclip» del rectángulo
    const uc = (u0 + u1) / 2, vc = (v0 + v1) / 2, ccx = cx + uc * ca - vc * sa, ccy = cy + uc * sa + vc * ca;
    const rot = { cx: ccx * sx, cy: ccy * sy, L: (L + 2 * dist) * sx, A: (A + 2 * dist) * sy, ang };
    const X0 = Math.max(0, (x0 - dist) * sx), Y0 = Math.max(0, (y0 - dist) * sy), X1 = Math.min(w, (x1 + 1 + dist) * sx), Y1 = Math.min(h, (y1 + 1 + dist) * sy);
    if (Math.min(rot.L, rot.A) > 5) cajas.push({ x0: X0, y0: Y0, x1: X1, y1: Y1, rot });
  }
  cajas.sort((a, b) => (Math.abs(a.y0 - b.y0) < 10 ? a.x0 - b.x0 : a.y0 - b.y0));
  return cajas;
}
async function reconocer(src, cajas) {
  const recortes = cajas.map(b => { const r = b.rot, c = nuevoLienzo(), W = Math.max(1, Math.round(r.L)), H = Math.max(1, Math.round(r.A));
    c.width = W; c.height = H; const x = c.getContext('2d'); x.translate(W / 2, H / 2); x.rotate(-r.ang); x.drawImage(src, -r.cx, -r.cy);   // enderezar el texto inclinado
    if (H / W >= 1.5) { const v = nuevoLienzo(); v.width = H; v.height = W; const y = v.getContext('2d'); y.translate(0, W); y.rotate(-Math.PI / 2); y.drawImage(c, 0, 0); return v; }
    return c; });
  const orden = recortes.map((c, i) => i).sort((a, b) => recortes[a].width / recortes[a].height - recortes[b].width / recortes[b].height);
  const res = new Array(recortes.length);
  for (let i = 0; i < orden.length; i += REC.batch) {
    const lote = orden.slice(i, i + REC.batch); let maxR = REC.w / REC.h; lote.forEach(j => { maxR = Math.max(maxR, recortes[j].width / recortes[j].height); });
    const W = Math.round(REC.h * maxR), datos = new Float32Array(lote.length * 3 * REC.h * W);
    lote.forEach((j, k) => { const c = recortes[j], rw = Math.min(W, Math.ceil(REC.h * c.width / c.height)); const t = nuevoLienzo(); t.width = W; t.height = REC.h; const x = t.getContext('2d');
      x.fillStyle = 'rgb(128,128,128)'; x.fillRect(0, 0, W, REC.h); x.drawImage(c, 0, 0, rw, REC.h);   // relleno gris = 0 tras normalizar
      datos.set(tensorBGR(x, W, REC.h, 0.5, 0.5), k * 3 * REC.h * W); });
    const out = await recS.run({ [recS.inputNames[0]]: new ort.Tensor('float32', datos, [lote.length, 3, REC.h, W]) });
    const t = out[recS.outputNames[0]], [B, T, C] = t.dims, p = t.data;
    for (let k = 0; k < B; k++) { let txt = '', s = 0, n = 0, prev = -1;
      for (let q = 0; q < T; q++) { let mi = 0, mv = -1; const o = (k * T + q) * C; for (let c = 0; c < C; c++) if (p[o + c] > mv) { mv = p[o + c]; mi = c; }
        if (mi !== 0 && mi !== prev) { txt += CLAVES[mi] || ''; s += mv; n++; } prev = mi; }
      res[lote[k]] = { t: txt, c: n ? Math.round(100 * s / n) : 0 }; }
  }
  return res;
}

// ===================== Reglas de SIRIUS (las mismas que se midieron) =====================
const N = (s) => String(s || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/g, '');
function leerPlaca(cs) { const h = cs.map(c => ({ v: N(c.t), c: c.c })).filter(c => /^[A-Z]{3}\d{3,4}$|^[A-Z]{2}\d{3}[A-Z]$/.test(c.v) && !/^(DOR|ANT|ECU)/.test(c.v) && /^[A-Z]/.test(c.v)).filter(c => 'ABCEGHIJKLMNOPQRSTUVWXYZ'.includes(c.v[0]));
  return h.length ? { valor: h.sort((a, b) => b.c - a.c)[0].v, conf: h[0].c, nota: 'formato de placa de Ecuador' } : null; }
function leerKm(cs) { const h = []; cs.forEach(c => { const t = c.t.toUpperCase().replace(/\s/g, ''); if (/[:]/.test(t)) return; const m = t.match(/(\d{3,7})(?:[.,](\d))?(KM)?/); if (m) h.push({ valor: m[1].replace(/^0+(?=\d)/, ''), dec: m[2] || null, km: !!m[3] || /KM/.test(t), c: c.c, caja: c }); });
  if (!h.length) return null; h.sort((a, b) => (b.km - a.km) || (b.valor.length - a.valor.length) || (b.c - a.c)); const r = h[0];
  return { valor: r.valor, conf: r.c, caja: r.caja, nota: (r.dec ? 'décimas ignoradas (' + r.valor + '.' + r.dec + ')' : 'entero') + (r.km ? ' · junto a «km»' : '') }; }
function leerVin(cs) { const t = cs.map(c => ({ v: N(c.t), c: c.c })); const ok = t.filter(c => /^[A-HJ-NPR-Z0-9]{17}$/.test(c.v) && /\d/.test(c.v) && /[A-Z]/.test(c.v));
  if (ok.length) return { valor: ok[0].v, conf: ok[0].c, nota: 'VIN válido (17 caracteres, sin I, O ni Q)' };
  const d18 = t.filter(c => c.v.length === 18 && /^[A-HJ-NPR-Z0-9]+$/.test(c.v.slice(1)))[0]; if (d18) { const sinPri = d18.v.slice(1), sinUlt = d18.v.slice(0, 17), v = /^[A-HJ-NPR-Z]{1,3}/.test(sinPri) && !/^[0-9]/.test(sinPri) ? sinPri : sinUlt; return { valor: v, conf: d18.c, nota: 'DUDOSO: se leyeron 18 caracteres («' + d18.v + '»); se quitó el del borde · confirmar con la matrícula', dudoso: true }; }
  const casi = t.filter(c => c.v.length >= 15 && c.v.length <= 19 && /\d/.test(c.v) && /[A-Z]/.test(c.v)); return casi.length ? { valor: casi[0].v, conf: casi[0].c, nota: 'DUDOSO: ' + casi[0].v.length + ' caracteres · confirmar con la matrícula', dudoso: true } : null; }
// Matrícula: etiquetas con sinónimos + valor debajo en su columna + validación por tipo + respaldos (medido: 89 de 97 en 5 formatos)
const SIN = { placa: [['PLACAACTUAL'], []], vin: [['NUMEROVINCHASIS', 'NUMEROVIN', 'CHASIS'], []], motor: [['NUMEROMOTOR', 'MOTOR'], ['REMCHAMOT']], marca: [['MARCA'], []], modelo: [['MODELO'], ['ANOMODELO']],
  anio_modelo: [['ANOMODELO', 'ANOFAB', 'EANOMODELO'], []], color1: [['COLOR1', 'COLOR'], ['COLOR2']], clase: [['CLASEDEVEHICULO', 'CLASE'], ['CLASEDETRANSPORTE', 'CLASESERVICIO', 'CLASETRANSPORTE']],
  tipo: [['TIPODEVEHICULO', 'TIPO'], ['TIPODEPESO', 'TIPODETRANSPORTEMODALIDAD', 'TIPOTONE', 'TIPOTRANSPORTE']], cilindraje: [['CILINDRAJE'], []], pasajeros: [['PASAJEROS', 'PASAJ', 'PAS'], []], combustible: [['COMBUSTIBLE', 'COMBU'], []],
  pais: [['PAISDEORIGEN', 'PAISORIGEN'], []], ramv: [['RAMVCPN', 'RAMV'], []], identificacion: [['CIPASAPORTERUC', 'CCPASAPORTERUC', 'CLPASAPORTERUC', 'PASAPORTERUC', 'PASAPORTEIRUC'], []],
  propietario: [['NOMBREDELPROPIETARIO', 'APELLIDOSYNOMBRES'], []], anio_matricula: [['ANO'], ['ANOMODELO', 'ANOFAB', 'ANOS']], uso: [['CLASEDETRANSPORTE', 'CLASESERVICIO', 'CLASETRANSPORTE'], []], provincia: [['PROVINCIA'], []], canton: [['CANTON'], []], fecha_emision: [['FECHAEMISION', 'FECHAMATRICULA', 'FECHAE'], []], fecha_caduca: [['FECHACADUCA', 'CADUCA'], []] };
const NOMBRES = { placa: 'Placa', vin: 'VIN (chasis)', motor: 'Motor', marca: 'Marca', modelo: 'Modelo', anio_modelo: 'Año modelo', color1: 'Color', clase: 'Clase', tipo: 'Tipo', cilindraje: 'Cilindraje', pasajeros: 'Pasajeros',
  combustible: 'Combustible', pais: 'País de origen', ramv: 'RAMV / CPN', identificacion: 'Identificación', propietario: 'Propietario', provincia: 'Provincia', canton: 'Cantón', anio_matricula: 'Año de la matrícula', uso: 'Uso (clase de transporte)', fecha_emision: 'Fecha de emisión', fecha_caduca: 'Fecha de caducidad' };
const TODAS = new Set(Object.values(SIN).flatMap(([a, b]) => a.concat(b)).concat(['ANO', 'PLACAANTERIOR', 'TONELADAS', 'CARROCERIA', 'CARR', 'TIPODEPESO', 'COLOR2', 'ORTOPEDICO', 'REMARCADO', 'OBSERVACIONES', 'DOMICILIO', 'DIRECCION', 'TELEFONO', 'DISCO', 'AVALUO', 'VALORMATRICULA', 'FECHACOMPRA', 'DIGITADOR', 'LUGAREMISION', 'FIRMARESPONSABLE', 'OPERADORDETRANSPORTE', 'AMBITODEOPERACION', 'TON', 'TO', 'REMCHAIMOT', 'PA', 'OPERADORADETRANSPORTE', 'AMBITO', 'TONELAJE', 'NUMERODEESPECIE', 'COMBU', 'PAISORIGEN', 'OBSERVACION']));
const esEti = (t) => { const n = N(t); return TODAS.has(n) || [...TODAS].some(e => e.length >= 5 && n.startsWith(e) && n.length <= e.length + 3); };
const MESES = { ENE: 1, FEB: 2, MAR: 3, ABR: 4, MAY: 5, JUN: 6, JUL: 7, AGO: 8, SEP: 9, OCT: 10, NOV: 11, DIC: 12 };
function aFecha(n) { const m = n.match(/^(\d{1,2})([A-Z]{3})(\d{4}|\d{2})$/) || n.match(/^(\d{2})(\d{2})(\d{4})$/) || n.match(/^(\d{2})(\d{2})(\d{2})$/); if (!m) return null;
  let [, d, mo, y] = m; mo = /\d/.test(mo) ? +mo : MESES[mo]; y = +y + (y.length === 2 ? 2000 : 0); if (!mo || y < 1990 || y > 2040) return null; const f = new Date(y, mo - 1, +d); return isNaN(f) ? null : f; }
function cedulaOk(c) { if (!/^\d{10}$/.test(c)) return false; const p = +c.slice(0, 2); if (!((p >= 1 && p <= 24) || p === 30) || +c[2] > 5) return false; let s = 0;
  for (let i = 0; i < 9; i++) { let v = +c[i] * (i % 2 === 0 ? 2 : 1); if (v > 9) v -= 9; s += v; } return (10 - s % 10) % 10 === +c[9]; }
const VAL = { placa: v => /^[A-Z]{3}\d{3,4}$|^[A-Z]{2}\d{3}[A-Z]$/.test(v), vin: v => /^[A-HJ-NPR-Z0-9]{17}$/.test(v) || /^[A-Z0-9]{8,20}$/.test(v), motor: v => /^[A-Z0-9]{5,22}$/.test(v) && /\d/.test(v),
  anio_modelo: v => /^(19[5-9]\d|20[0-3]\d)$/.test(v), anio_matricula: v => /^20[0-3]\d$/.test(v), uso: v => /^[A-Z]{5,40}$/.test(v) && !/^(OPERADOR|TIPODE|AMBITO|DISCO)/.test(v), cilindraje: v => /^(\d{2,5}|0)(CC)?$/.test(v), pasajeros: v => /^\d{1,2}$/.test(v), ramv: v => /^[A-Z]\d{6,9}$/.test(v), identificacion: v => /^(\d{10}|\d{13})$/.test(v),
  fecha_emision: v => !!aFecha(v), fecha_caduca: v => !!aFecha(v) };
function placaPorFormato(t) { const v = N(t); if (/^[A-Z]{3}\d{3,4}$/.test(v)) return v; if (v.length < 6 || v.length > 7) return null;
  const aL = { 1: 'I', 0: 'O', 5: 'S', 8: 'B', 2: 'Z', 6: 'G' }, aN = { I: '1', O: '0', S: '5', B: '8', Z: '2', G: '6', L: '1', D: '0', Q: '0' };
  const r = v.slice(0, 3).replace(/[0-9]/g, c => aL[c] || c) + v.slice(3).replace(/[A-Z]/g, c => aN[c] || c); return /^[A-Z]{3}\d{3,4}$/.test(r) ? r : null; }
function leerMatricula(cs) {
  const todoM = cs.map(c => N(c.t)), pistaF = ['MODELO', 'CILINDRAJE', 'COMBUSTIBLE', 'PASAJEROS', 'TIPODEVEHICULO', 'CLASEDEVEHICULO', 'PAISDEORIGEN', 'CARROCERIA', 'NUMEROMOTOR'].filter(w => todoM.some(t => t.startsWith(w))).length;
  const pistaR = ['PROPIETARIO', 'APELLIDOSYNOMBRES', 'PROVINCIA', 'CANTON', 'DOMICILIO', 'DIRECCION', 'TELEFONO', 'DIGITADOR'].filter(w => todoM.some(t => t.includes(w))).length;
  const lado = (cs.some(c => ['PLACAACTUAL', 'MARCA'].includes(N(c.t))) || (pistaF >= 2 && pistaF > pistaR)) ? 'frente (datos del vehículo)' : 'reverso (propietario y trámite)'; const frente = lado.startsWith('frente'); const sal = {};
  const coincide = (t, s) => { const n = N(t); return n === s || (n.startsWith(s) && n.length <= s.length + 4) || (s.length >= 8 && n.includes(s) && n.length <= s.length + 4); };
  for (const [campo, [sin, no]] of Object.entries(SIN)) {
    const ets = cs.filter(c => (campo === 'anio_matricula' ? N(c.t) === 'ANO' : sin.some(s => coincide(c.t, s))) && !no.some(x => N(c.t).includes(x))); let mejor = null;
    for (const e of ets) { const h = e.y1 - e.y0; const cand = cs.filter(c => c !== e && !esEti(c.t)).filter(c => c.y0 >= e.y0 + 0.5 * h && c.y0 - e.y1 < 3.5 * h && (Math.min(e.x1, c.x1) - Math.max(e.x0, c.x0) > -0.2 * (e.x1 - e.x0) || Math.abs(c.x0 - e.x0) < 2.5 * h))
        .sort((a, b) => (a.y0 - e.y1 + 0.02 * Math.abs((a.x0 + a.x1) / 2 - (e.x0 + e.x1) / 2)) - (b.y0 - e.y1 + 0.02 * Math.abs((b.x0 + b.x1) / 2 - (e.x0 + e.x1) / 2)));
      for (const c of cand) { const v = N(c.t); if (campo === 'propietario' && (c.t.trim().split(/\s+/).length < 2 || /ECUADOR|REPUBLICA|MUNICIP|GOBIERNO|AGENCIA|MATRICULA/.test(v))) continue;   // un nombre tiene al menos dos palabras y no es el encabezado
        if ((VAL[campo] || (v2 => v2.length >= 2))(v)) { mejor = { valor: campo === 'cilindraje' ? v.replace(/CC$/, '') : c.t, conf: c.c, nota: 'por su etiqueta' }; break; }
        if (campo === 'placa' && placaPorFormato(c.t)) { mejor = { valor: placaPorFormato(c.t), conf: c.c, nota: 'corregida por formato (leído «' + c.t + '») · por confirmar', dudoso: true }; break; } } if (mejor) break; }
    if (!mejor && frente && (campo === 'vin' || campo === 'placa')) { const re = campo === 'vin' ? /^[A-HJ-NPR-Z0-9]{17}$/ : /^[A-Z]{3}\d{3,4}$/; const h = cs.find(c => re.test(N(c.t)) && /\d/.test(N(c.t)) && /[A-Z]/.test(N(c.t))); if (h) mejor = { valor: h.t, conf: h.c, nota: 'por su formato' }; }
    if (mejor) sal[campo] = mejor;
  }
  const toks = cs.filter(c => !esEti(c.t));
  if (!sal.ramv && frente) { const h = toks.filter(c => /^[A-Z]\d{8}$/.test(N(c.t))); if (h.length === 1) sal.ramv = { valor: h[0].t, conf: h[0].c, nota: 'por su formato' }; }
  if (!sal.identificacion && !frente) { const h = toks.filter(c => cedulaOk(N(c.t))); if (h.length === 1) sal.identificacion = { valor: h[0].t, conf: h[0].c, nota: 'cédula válida (dígito verificador)' }; }
  if (!sal.anio_modelo && frente) { const usados = new Set(Object.values(sal).map(v => N(v.valor))); let anioMat = null; const pc = sal.placa && cs.find(c => N(c.t) === N(sal.placa.valor));
    if (pc) { const fila = toks.filter(c => /^20\d{2}$/.test(N(c.t)) && Math.abs((c.y0 + c.y1) / 2 - (pc.y0 + pc.y1) / 2) < 1.2 * (pc.y1 - pc.y0)); if (fila.length === 1) anioMat = N(fila[0].t); }
    if (sal.anio_matricula) anioMat = N(sal.anio_matricula.valor);
    const h = toks.filter(c => /^(19[5-9]\d|20[0-3]\d)$/.test(N(c.t)) && N(c.t) !== anioMat && !usados.has(N(c.t))); if (h.length === 1) sal.anio_modelo = { valor: h[0].t, conf: h[0].c, nota: 'año sin etiqueta · por confirmar', dudoso: true }; }
  if (frente) {   // formato ANT: si el sello tapa la etiqueta, el valor se toma por su posición en la fila
    const cajaDe = (campo) => sal[campo] && cs.find(c => c.t === sal[campo].valor || N(c.t) === N(sal[campo].valor));
    const derecha = (ancla, re) => ancla ? toks.filter(c => c !== ancla && c.x0 > ancla.x1 - 4 && Math.abs((c.y0 + c.y1) / 2 - (ancla.y0 + ancla.y1) / 2) < 0.75 * Math.max(ancla.y1 - ancla.y0, c.y1 - c.y0) && re.test(N(c.t))).sort((a, b) => a.x0 - b.x0) : [];
    const usados = () => new Set(Object.values(sal).filter(v => v && v.valor).map(v => N(v.valor))), nota = 'por su posición en la fila (sello sobre la etiqueta) · por confirmar';
    const aM = cajaDe('modelo');
    if (aM && (!sal.cilindraje || !sal.anio_modelo)) { const nums = derecha(aM, /^(\d{2,5}|0)(CC)?$/);
      if (nums.length >= 2) { if (!sal.cilindraje) sal.cilindraje = { valor: N(nums[0].t).replace(/CC$/, ''), conf: nums[0].c, nota, dudoso: true }; const an = nums.slice(1).find(c => /^(19[5-9]\d|20[0-3]\d)$/.test(N(c.t))); if (!sal.anio_modelo && an) sal.anio_modelo = { valor: N(an.t), conf: an.c, nota, dudoso: true }; }
      else if (nums.length === 1) { const v = N(nums[0].t), esAnio = /^(19[5-9]\d|20[0-3]\d)$/.test(v), ancho = Math.max(...cs.map(c => c.x1));
        if (esAnio && nums[0].x0 > 0.78 * ancho) { if (!sal.anio_modelo) sal.anio_modelo = { valor: v, conf: nums[0].c, nota, dudoso: true }; } else if (!sal.cilindraje && !usados().has(v)) sal.cilindraje = { valor: v.replace(/CC$/, ''), conf: nums[0].c, nota, dudoso: true }; } }
    const aT = cajaDe('tipo') || cajaDe('clase'); if (aT && !sal.pasajeros) { const h = derecha(aT, /^\d{1,2}$/)[0]; if (h) sal.pasajeros = { valor: N(h.t), conf: h.c, nota, dudoso: true }; }
    const aV = cajaDe('motor') || cajaDe('vin'); if (aV && !sal.ramv) { const h = derecha(aV, /^[A-Z]\d{7,9}$/)[0]; if (h) sal.ramv = { valor: N(h.t), conf: h.c, nota, dudoso: true }; }
  }
  if (frente && !sal.anio_matricula && sal.placa) { const pc2 = cs.find(c => N(c.t) === N(sal.placa.valor)); if (pc2) { const fila = toks.filter(c => /^20[0-3]\d$/.test(N(c.t)) && Math.abs((c.y0 + c.y1) / 2 - (pc2.y0 + pc2.y1) / 2) < 1.2 * (pc2.y1 - pc2.y0)); if (fila.length === 1) sal.anio_matricula = { valor: N(fila[0].t), conf: fila[0].c, nota: 'en la fila de la placa (sello sobre la etiqueta) · por confirmar', dudoso: true }; } }
  const fechas = toks.map(c => ({ f: aFecha(N(c.t)), c })).filter(z => z.f).sort((a, b) => a.f - b.f);
  if (!sal.fecha_caduca && fechas.length >= 2) sal.fecha_caduca = { valor: fechas[fechas.length - 1].c.t, conf: fechas[fechas.length - 1].c.c, nota: 'la fecha más reciente' };
  if (!sal.fecha_emision && fechas.length >= 2) { const a = fechas[fechas.length - 2], b = fechas[fechas.length - 1]; if ((b.f - a.f) / 864e5 > 0 && (b.f - a.f) / 864e5 < 6 * 366) sal.fecha_emision = { valor: a.c.t, conf: a.c.c, nota: 'la fecha anterior a la caducidad' }; }
  if (!sal.propietario && !frente && pistaR >= 1) { const alto = Math.max(...cs.map(c => c.y1)); const h = toks.filter(c => !/ECUADOR|REPUBLICA|MUNICIP|GOBIERNO|AGENCIA|MATRICULA/.test(N(c.t)) && c.y0 < 0.35 * alto && /^[A-ZÑÁÉÍÓÚ ]{8,}$/.test(c.t.toUpperCase().replace(/\d+$/, '').trim()) && c.t.trim().split(/\s+/).length >= 2); if (h.length) { const c = h.sort((a, b) => (b.y1 - b.y0) - (a.y1 - a.y0))[0]; sal.propietario = { valor: c.t, conf: c.c, nota: 'texto principal (sin su etiqueta) · por confirmar', dudoso: true }; } }
  if (sal.fecha_emision && sal.fecha_caduca) { const a = aFecha(N(sal.fecha_emision.valor)), b = aFecha(N(sal.fecha_caduca.valor)); if (!a || !b || !((b - a) / 864e5 > 0 && (b - a) / 864e5 < 6 * 366)) { delete sal.fecha_emision; sal._aviso = 'Fecha de emisión descartada: no es plausible'; } }
  if (sal.fecha_emision) { const a = aFecha(N(sal.fecha_emision.valor)); if (!a || a > new Date()) { delete sal.fecha_emision; sal._aviso = 'Fecha de emisión descartada: no es plausible'; } }
  if (sal.fecha_caduca) { const b = aFecha(N(sal.fecha_caduca.valor)); if (b && b < new Date()) sal.fecha_caduca.alerta = 'MATRÍCULA CADUCADA'; }
  return { lado, sal };
}

// ===================== Licencia de conducir (formato ANT: nuevo y anterior) =====================
// Datos: titular (apellidos y nombres), identificación (número de licencia = cédula), categoría y vigencia.
const CATS = ['A1', 'A', 'B', 'C1', 'C', 'D1', 'D', 'E1', 'E', 'F', 'G'];
function bajo(cs, e, valida) {   // texto más cercano debajo de la etiqueta, en su columna, que cumpla la validación
  const h = e.y1 - e.y0; return cs.filter(c => c !== e && !esEti(c.t) && !/[\/]/.test(c.t.replace(/\d+\/\d+\/\d+/, '')) || false)
    .filter(c => c !== e && c.y0 >= e.y0 + 0.5 * h && c.y0 - e.y1 < 3.5 * h && (Math.min(e.x1, c.x1) - Math.max(e.x0, c.x0) > -0.2 * (e.x1 - e.x0) || Math.abs(c.x0 - e.x0) < 2.5 * h))
    .sort((a, b) => (a.y0 - e.y1) - (b.y0 - e.y1)).find(c => valida(c.t)); }
const letras = (t) => /^[A-ZÑÁÉÍÓÚ ]{3,}$/.test(t.toUpperCase().trim()) && !/FAMILY|NAME|SURNAME|APELLIDO|NOMBRE|LICENCIA|SEXO|CATEG/.test(N(t));
const fechaTxt = (t) => { const m = t.toUpperCase().match(/(\d{1,2})[-\/. ]?(\d{2}|[A-Z]{3})[-\/. ]?(\d{2,4})/); return m ? aFecha(m[1] + m[2] + m[3]) : null; };
function leerLicencia(cs) {
  const T = (c) => c.t.toUpperCase(), sal = {}, todo = cs.map(c => N(c.t)).join('|');
  const reverso = ['PARTICULAR', 'COMERCIAL', 'ESTATAL', 'PASAJEROS', 'ESPECIAL', 'PESADO', 'DISCAPAC', 'AGRC', 'ESCTURISMO'].filter(w => todo.includes(w)).length >= 3;
  // --- reverso: fila de la tabla de categorías con fechas (la categoría vigente) ---
  const filas = [];
  cs.forEach(c => { const f = fechaTxt(c.t); if (!f || /\d{4}/.test(c.t.replace(/[^\d]/g, '').slice(0, 0))) return; const cy = (c.y0 + c.y1) / 2, h = c.y1 - c.y0;
    let fila = filas.find(r => Math.abs(r.cy - cy) < 0.9 * Math.max(h, r.h)); if (!fila) { fila = { cy, h, fechas: [] }; filas.push(fila); } fila.fechas.push({ f, c }); });
  const conCat = filas.map(r => { const cod = cs.filter(c => CATS.includes(N(c.t)) && Math.abs((c.y0 + c.y1) / 2 - r.cy) < 0.9 * Math.max(r.h, c.y1 - c.y0) && c.x1 <= Math.min(...r.fechas.map(z => z.c.x0)) + 5)
      .sort((a, b) => a.x0 - b.x0)[0]; return cod ? { cat: N(cod.t), n: r.fechas.length, hasta: r.fechas.map(z => z.f).sort((a, b) => b - a)[0], txt: r.fechas.map(z => z.c.t).join(' · ') } : null; }).filter(Boolean);
  if (reverso && conCat.length) { const tabla = conCat.filter(r => r.hasta); sal.categoria = { valor: tabla.map(r => r.cat).join(', '), conf: 90, nota: 'fila de la tabla con fechas' };
    const v = tabla.sort((a, b) => b.hasta - a.hasta)[0]; if (v.n >= 2) sal.vigencia = { valor: v.hasta.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' }), conf: 90, nota: 'válida hasta (categoría ' + v.cat + ')' }; else sal._aviso = 'En la fila de la categoría se leyó una sola fecha: no se puede asegurar la vigencia'; }
  if (!reverso) {
    // --- formato nuevo: etiquetas bilingües ---
    const et = (re) => cs.find(c => re.test(N(c.t)));
    const eA = et(/FAMILY|^APEL|LLIDO/), eN = cs.find(c => /^NOMBR|^N0MBR|BRENAME|BREINAME/.test(N(c.t)) && !/PROPIET|APELL|FAMILY/.test(N(c.t))), eL = et(/^LICENCIA(NUMBER)?$|LICENCIANUMBER/), eC = et(/^CATEGORIA|^CATEGORY/), eV = et(/VENCIMIENTO|^FECHAVENC|EXP$/);
    const vA = eA && bajo(cs, eA, letras); let vN = eN && bajo(cs, eN, letras);
    if (vA && (!vN || vN === vA)) { const h = vA.y1 - vA.y0; vN = cs.filter(c => c !== vA && c.y0 > vA.y1 - 0.2 * h && c.y0 - vA.y1 < 4.5 * h && Math.abs(c.x0 - vA.x0) < 2.5 * h && letras(c.t) && !/^(M|F|ECUADOR)$/.test(c.t.trim().toUpperCase())).sort((a2, b2) => a2.y0 - b2.y0)[0] || null; }   // sin la etiqueta «NOMBRE»: la línea bajo los apellidos
    if (vA || vN) sal.titular = { valor: [vA && vA.t, vN && vN.t].filter(Boolean).join(' '), conf: Math.min(vA ? vA.c : 100, vN ? vN.c : 100), nota: vA && vN ? 'apellidos y nombres por su etiqueta' : 'INCOMPLETO: falta ' + (vA ? 'el nombre' : 'el apellido') + ' · por confirmar', dudoso: !(vA && vN) };
    const vL = eL && bajo(cs, eL, t => /^\d{10}$/.test(N(t))); if (vL) sal.identificacion = { valor: N(vL.t), conf: vL.c, nota: cedulaOk(N(vL.t)) ? 'cédula válida (dígito verificador)' : 'DUDOSO: no pasa el dígito verificador', dudoso: !cedulaOk(N(vL.t)) };
    const vC = eC && bajo(cs, eC, t => /^(A1|B|C1|D1|E1|A|C|D|E|F|G)([ ,]+(A1|B|C1|D1|E1|A|C|D|E|F|G))*$/.test(t.toUpperCase().trim())); if (vC) sal.categoria = { valor: vC.t.toUpperCase().trim(), conf: vC.c, nota: 'por su etiqueta' };
    const vV = eV && bajo(cs, eV, t => !!fechaTxt(t)); if (vV) sal.vigencia = { valor: vV.t.trim(), conf: vV.c, nota: 'fecha de vencimiento por su etiqueta' };
    // --- formato anterior: campos numerados (1. apellidos · 2. nombres · 4b. válido hasta · 8. número) ---
    if (!sal.titular) { const a = cs.find(c => /^\s*1\s*[.,]\s*[A-ZÑ]/.test(T(c))), n = cs.find(c => /^\s*2\s*[.,]\s*[A-ZÑ]/.test(T(c)));
      if (a || n) sal.titular = { valor: [a && T(a).replace(/^\s*1\s*[.,]\s*/, ''), n && T(n).replace(/^\s*2\s*[.,]\s*/, '')].filter(Boolean).join(' '), conf: Math.min(a ? a.c : 100, n ? n.c : 100), nota: 'campos 1 y 2 (formato anterior)' }; }
    if (!sal.vigencia) { const v = cs.find(c => /4\s*B\s*[.,]?\s*\d/.test(T(c))); if (v) { const m = T(v).match(/4\s*B\s*[.,]?\s*([\d][\d\-\/.]{6,})/); if (m && fechaTxt(m[1])) sal.vigencia = { valor: m[1], conf: v.c, nota: 'campo 4b (formato anterior)' }; } }
    if (!sal.identificacion) { const v = cs.find(c => /^\s*8\s*[.,]?\s*\d{10}$/.test(T(c).replace(/\s/g, '')) && cedulaOk(N(c.t).replace(/^8(?=\d{10}$)/, ''))) || cs.find(c => cedulaOk(N(c.t))); if (v) { const num = N(v.t).replace(/^8(?=\d{10}$)/, ''); sal.identificacion = { valor: num, conf: v.c, nota: cedulaOk(num) ? 'cédula válida (dígito verificador)' : 'DUDOSO: no pasa el dígito verificador', dudoso: !cedulaOk(num) }; } }
  }
  if (sal.vigencia) { const f = fechaTxt(sal.vigencia.valor); if (f && f < new Date()) sal.vigencia.alerta = 'LICENCIA VENCIDA'; }
  if (!reverso && !sal.categoria && sal.titular && /anterior/.test(sal.titular.nota)) sal._catReverso = true;   // formato anterior: la categoría está en el reverso
  return { lado: reverso ? 'reverso (tabla de categorías)' : 'frente (titular)', sal };
}

// ===================== Orientación: si la foto está girada, se prueba 90° en cada sentido =====================
function girar(src, sentido) { const c = nuevoLienzo(); c.width = src.height; c.height = src.width; const x = c.getContext('2d'); x.translate(c.width / 2, c.height / 2); x.rotate(sentido * Math.PI / 2); x.drawImage(src, -src.width / 2, -src.height / 2); return c; }
const CLAVE_DOC = /LICENCIA|CONDUCIR|APELLIDO|NOMBRE|CATEGOR|PARTICULAR|COMERCIAL|PASAJEROS|ECUADOR|REPUBLICA|NACIMIENTO|VENCIMIENTO|EMISION|PLACA|MARCA|MODELO|PROPIETARIO|CANTON|PROVINCIA|AGENCIA|TRANSITO/;
const puntaje = (cs) => cs.reduce((s, c) => s + (CLAVE_DOC.test(N(c.t)) ? 3 : 0) + (fechaTxt(c.t) ? 2 : 0) + c.c / 100, 0);
async function leerTodo(src) {
  let cajas = await detectar(src); const vert = cajas.filter(b => b.rot && Math.abs(b.rot.ang) > 0.8 && b.rot.L > 2 * b.rot.A).length, horiz = cajas.filter(b => b.rot && Math.abs(b.rot.ang) <= 0.8 && b.rot.L > 2 * b.rot.A).length;
  const armar = async (img, cj) => { const tx = await reconocer(img, cj); return cj.map((b, i) => Object.assign({}, b, tx[i])).filter(c => c.c >= REC.minScore * 100 && c.t); };
  if (vert <= horiz) {
    if (cajas.length >= 8) { const x0 = Math.min(...cajas.map(b => b.x0)), y0 = Math.min(...cajas.map(b => b.y0)), x1 = Math.max(...cajas.map(b => b.x1)), y1 = Math.max(...cajas.map(b => b.y1));
      if ((x1 - x0) * (y1 - y0) < 0.4 * src.width * src.height) {   // el documento ocupa poco de la foto: se recorta y se relee ampliado
        const mx = 0.06 * (x1 - x0), my = 0.08 * (y1 - y0), rx = Math.max(0, x0 - mx), ry = Math.max(0, y0 - my), rw = Math.min(src.width, x1 + mx) - rx, rh = Math.min(src.height, y1 + my) - ry, k = Math.min(2.5, 1800 / Math.max(rw, rh));
        const z = nuevoLienzo(); z.width = Math.round(rw * k); z.height = Math.round(rh * k); const zx = z.getContext('2d'); zx.imageSmoothingQuality = 'high'; zx.drawImage(src, rx, ry, rw, rh, 0, 0, z.width, z.height);
        return { src: z, cs: await armar(z, await detectar(z)), giro: 0, zoom: true }; } }
    return { src, cs: await armar(src, cajas), giro: 0 }; }
  let mejor = null; for (const s of [1, -1]) { const g = girar(src, s), cj = await detectar(g), muestra = cj.slice().sort((a, b) => b.rot.L - a.rot.L).slice(0, 14), p = puntaje(await armar(g, muestra)); if (!mejor || p > mejor.p) mejor = { src: g, cj, giro: s * 90, p }; }
  return { src: mejor.src, cs: await armar(mejor.src, mejor.cj), giro: mejor.giro };   // lectura completa solo de la orientación ganadora
}


// ===================== API para SIRIUS: leer una foto y entregar los campos listos para la base =====================
const ISO = (f) => f ? f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0') + '-' + String(f.getDate()).padStart(2, '0') : null;
const RE_CAT = /^(A1|B|C1|D1|E1|A|C|D|E|F|G)([ ,]+(A1|B|C1|D1|E1|A|C|D|E|F|G))*$/;
function aCampo(campo, r) {   // normaliza el valor según el campo; las fechas llevan además su forma ISO
  if (!r || r.valor == null || r.valor === '—') return null; let v = String(r.valor).trim(); const o = { conf: Math.round(+r.conf || 0), nota: r.nota || '' }; if (r.dudoso) o.dudoso = true; if (r.alerta) o.alerta = r.alerta;
  if (['placa', 'vin', 'motor', 'ramv'].includes(campo)) v = N(v);
  else if (['km', 'cilindraje', 'pasajeros', 'anio_modelo', 'anio_matricula'].includes(campo)) { v = v.replace(/\D/g, ''); if (!v) return null; }
  else if (campo === 'identificacion') v = v.replace(/\D/g, '');
  else if (campo === 'categoria') v = v.toUpperCase().replace(/[^A-Z0-9, ]/g, '').trim();
  else if (/fecha|vigencia/.test(campo)) { const f = fechaTxt(v) || aFecha(N(v)); o.iso = ISO(f); if (!o.iso) o.dudoso = true; }
  o.valor = v; return o;
}
async function fuenteALienzo(f) {
  if (!EN_WORKER && f instanceof HTMLCanvasElement) return f;
  if (EN_WORKER) { const b = typeof f === 'string' ? await (await fetch(f)).blob() : f; return aLienzo(await createImageBitmap(b), DET.maxSide); }   // en el Web Worker: la imagen se descarga y se decodifica sin «Image»
  let img = f;
  if (typeof f === 'string' || f instanceof Blob) { img = new Image(); img.crossOrigin = 'anonymous'; const url = typeof f === 'string' ? f : URL.createObjectURL(f); await new Promise((ok, no) => { img.onload = ok; img.onerror = () => no(new Error('No se pudo cargar la imagen')); img.src = url; }); }
  return aLienzo(img, DET.maxSide);
}
async function leer(fuente, tipo) {
  await iniciar(); const t0 = ahora(); const src0 = await fuenteALienzo(fuente); const LT = await leerTodo(src0); const src = LT.src, cs = LT.cs; const campos = {}; let lado = null;
  let t = tipo || 'auto';
  if (t === 'auto') { const all = cs.map(c => N(c.t)).join('|'); t = /LICENCIADECONDUCIR|DRIVERSLICENSE|FAMILYNAME|SURNAME|CATEGORIACATEGORY|ESCTURISMO/.test(all) ? 'licencia' : /PLACAACTUAL|PROPIETARIO|APELLIDOSYNOMBRES|CILINDRAJE/.test(all) ? 'matricula' : (cs.some(c => /KM/i.test(c.t) && /\d{3}/.test(c.t)) ? 'km' : 'placa'); }
  if (t === 'matricula') { const m = leerMatricula(cs); lado = m.lado.startsWith('frente') ? 'frente' : 'reverso'; Object.keys(m.sal).filter(k => !k.startsWith('_')).forEach(k => { const c = aCampo(k, m.sal[k]); if (c) campos[k] = c; }); }
  else if (t === 'licencia') { const m = leerLicencia(cs); lado = m.lado.startsWith('reverso') ? 'reverso' : 'frente';
    if (lado === 'frente' && !m.sal.categoria) { const e = cs.find(c => /^CATEGORIA|^CATEGORY/.test(N(c.t)));
      if (e) { const h = e.y1 - e.y0; for (const [ancho, dy, alto] of [[1.5, -0.1, 2.0], [2.0, 0, 2.2], [3.0, 0, 1.7]]) { const caja = { x0: e.x0 - 0.2 * h, y0: e.y1 + dy * h, x1: e.x0 - 0.2 * h + ancho * h, y1: e.y1 + (dy + alto) * h };
          caja.rot = { cx: (caja.x0 + caja.x1) / 2, cy: (caja.y0 + caja.y1) / 2, L: caja.x1 - caja.x0, A: caja.y1 - caja.y0, ang: 0 }; const r = (await reconocer(src, [caja]))[0], v = (r.t || '').toUpperCase().replace(/[^A-Z0-9, ]/g, '').trim();
          if (r.c >= 60 && RE_CAT.test(v)) { m.sal.categoria = { valor: v, conf: r.c, nota: 'recuadro bajo su etiqueta' }; break; } } } }
    Object.keys(m.sal).filter(k => !k.startsWith('_')).forEach(k => { const c = aCampo(k, m.sal[k]); if (c) campos[k] = c; }); }
  else { let r = t === 'placa' ? leerPlaca(cs) : t === 'km' ? leerKm(cs) : leerVin(cs);
    if (t === 'km' && r && r.caja && (r.caja.y1 - r.caja.y0) < 0.06 * src.height) { const b = r.caja, mw = 0.45 * (b.x1 - b.x0), mh = 0.6 * (b.y1 - b.y0), rx = Math.max(0, b.x0 - mw), ry = Math.max(0, b.y0 - mh), rw = Math.min(src.width, b.x1 + mw) - rx, rh = Math.min(src.height, b.y1 + mh) - ry, k = Math.min(4, 900 / rw);
      const z = nuevoLienzo(); z.width = Math.round(rw * k); z.height = Math.round(rh * k); const zx = z.getContext('2d'); zx.imageSmoothingQuality = 'high'; zx.drawImage(src, rx, ry, rw, rh, 0, 0, z.width, z.height);
      const cz = await detectar(z), tz = await reconocer(z, cz), r2 = leerKm(cz.map((q, i) => Object.assign({}, q, tz[i])).filter(q => q.c >= 50 && q.t)); if (r2 && r2.valor.length >= r.valor.length && r2.conf >= r.conf - 10) r = Object.assign(r2, { nota: r2.nota + ' · releído ampliado' }); }
    const c = aCampo(t === 'km' ? 'km' : t, r); if (c) campos[t === 'km' ? 'km' : t] = c; }
  return { tipo: t, lado, motor: 'PP-OCRv4', campos, textos: cs.length, giro: LT.giro || 0, ampliada: !!LT.zoom, ms: Math.round(ahora() - t0) };
}

// ===================== Cola en segundo plano (Back-office, usuarios internos · SQL 93 y 96) =====================
// La lectura corre en un Web Worker (sirius-lectura-worker.js): no ocupa la pantalla, así que lee de forma continua, sin esperar a que el
// usuario esté inactivo. Reserva UNA foto a la vez (primero las del caso abierto, luego las más recientes), la lee y registra el resultado.
// Si el navegador no admite el Worker, lee en la página, solo con el usuario inactivo. Muestra un indicador discreto mientras trabaja.
let ultimaActividad = Date.now(); if (!EN_WORKER) ['mousemove', 'keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { ultimaActividad = Date.now(); }, { passive: true, capture: true }));
// 27/11/2026 · la foto del tablero se reduce aquí (1280 px, JPEG) y viaja en base64: la función de Supabase solo la reenvía a la IA
async function fotoReducida(url, max) {
  const r = await fetch(url); if (!r.ok) throw new Error('No se pudo descargar la foto (' + r.status + ')'); const bm = await createImageBitmap(await r.blob());
  const k = Math.min(1, max / Math.max(bm.width, bm.height)), w = Math.round(bm.width * k), h = Math.round(bm.height * k), c = nuevoLienzo(); c.width = w; c.height = h; c.getContext('2d').drawImage(bm, 0, 0, w, h);
  const blob = c.convertToBlob ? await c.convertToBlob({ type: 'image/jpeg', quality: 0.85 }) : await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.85));
  const datos = await new Promise((ok, no) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result).split(',')[1] || ''); fr.onerror = () => no(new Error('No se pudo preparar la foto')); fr.readAsDataURL(blob); });
  return { imagen: datos, mime: 'image/jpeg', ancho: w, alto: h };
}
function cola(CX, op) {
  op = Object.assign({ cadaMs: 15000, inactivoMs: 8000, carpeta: '', indicador: true }, op || {}); let ocupado = false, aplicado = 0, w = null, sec = 0; const espera = {};
  const estado = { leidas: 0, errores: 0, pendientes: null, ultima: null, activo: true, modo: 'página' };
  try { if (op.carpeta && typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') { w = new Worker(op.carpeta + 'sirius-lectura-worker.js?v=102'); estado.modo = 'segundo plano';
      w.onmessage = (e) => { const d = e.data || {}, f = espera[d.id]; if (!f) return; delete espera[d.id]; d.error ? f.no(new Error(d.error)) : f.ok(d.lectura); };
      w.onerror = (e) => { console.warn('[SIRIUS lectura] sin Web Worker:', e.message || e); Object.values(espera).forEach(f => f.no(new Error('Worker no disponible'))); w = null; estado.modo = 'página'; };
      w.postMessage({ base: BASE }); } } catch (e) { w = null; }
  const leerUna = (url, tipo) => w ? new Promise((ok, no) => { const id = ++sec; espera[id] = { ok, no }; w.postMessage({ id, url, tipo }); setTimeout(() => { if (espera[id]) { delete espera[id]; no(new Error('La lectura tardó demasiado')); } }, 120000); }) : leer(url, tipo);
  let chip = null; const avisar = (t) => { if (!op.indicador || EN_WORKER) return; if (!t) { if (chip) chip.style.display = 'none'; return; }
    if (!chip) { chip = document.createElement('div'); chip.setAttribute('role', 'status'); chip.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:9999;background:#0b1f3a;color:#fff;font:500 12.5px/1.3 system-ui,sans-serif;padding:7px 12px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.25);pointer-events:none;opacity:.94'; document.body.appendChild(chip); }
    chip.textContent = t; chip.style.display = 'block'; };
  const casoAbierto = () => { const m = /[?&#]caso=([^&#]+)/.exec(location.search + location.hash); return m ? decodeURIComponent(m[1]) : null; };
  async function vuelta() {
    if (ocupado || document.visibilityState !== 'visible') return; if (!w && Date.now() - ultimaActividad < op.inactivoMs) return; ocupado = true;
    let enEspera = false;
    try { let hechas = 0;
      for (let i = 0; i < 40; i++) {   // hasta agotar la cola, de a una foto
        const r = await CX.rpc('lectura_pendientes', { p_limite: 1, p_caso: casoAbierto() }); const pend = Array.isArray(r) ? r : (r && r.fotos) || []; estado.pendientes = r && r.pendientes != null ? r.pendientes : pend.length;
        if (!pend.length) break; const p = pend[0]; avisar('Leyendo documentos · ' + (hechas + 1) + ' de ' + (hechas + Math.max(1, estado.pendientes)));
        let lectura; try { const urls = await CX.firmar([p.ruta]); if (!urls[p.ruta]) throw new Error('Sin URL firmada');
          // SQL 101 · DEC-300: el tablero lo lee la IA (función de Supabase lectura-tablero); lo demás, el OCR del navegador
          lectura = p.tipo === 'tablero' ? await (CX.funcion ? CX.funcion('lectura-tablero', await fotoReducida(urls[p.ruta], 1280)) : Promise.reject(new Error('La conexión no admite funciones'))) : await leerUna(urls[p.ruta], p.tipo); }
        catch (e) { const msg = String(e && e.message || e).slice(0, 200);
          // 26/11/2026 · error temporal del servicio de IA (alta demanda, límite, caída): no se registra; la reserva vence en 2 minutos y se
          // vuelve a intentar (la base corta a los 3 intentos). Los demás errores sí se registran.
          if (p.tipo === 'tablero' && /(temporal|\b50[03]\b|\b429\b|\b546\b|demand|compute resources|WORKER_LIMIT|tardó|Failed to fetch|NetworkError)/i.test(msg)) {
            // 27/11/2026 · el motivo queda visible (indicador, consola y SIRIUS_CONEXION.lecturas.ultimoError); la foto se reintenta en 2 minutos
            estado.reintentos = (estado.reintentos || 0) + 1; estado.ultimoError = { foto: p.paso, motivo: msg, hora: new Date().toISOString() };
            console.warn('[SIRIUS lectura] la lectura del tablero se reintentará en 2 minutos:', msg); avisar('Tablero en espera: ' + msg.slice(0, 80)); enEspera = true; continue; }
          lectura = { tipo: p.tipo, motor: p.tipo === 'tablero' ? 'IA (Gemini)' : 'PP-OCRv4', campos: {}, error: msg }; estado.errores++; }
        await CX.rpc('lectura_registrar', { p_evidencia: p.id, p_lectura: lectura }); hechas++; estado.leidas++; estado.ultima = new Date().toISOString();
        if (document.visibilityState !== 'visible' || (!w && Date.now() - ultimaActividad < op.inactivoMs)) break;
      }
      if (hechas) { avisar('Lectura lista · ' + hechas + (hechas === 1 ? ' documento' : ' documentos') + (enEspera ? ' · el tablero se reintentará' : '')); setTimeout(() => avisar(null), enEspera ? 15000 : 5000); if (CX.recargar) try { CX.recargar(); } catch (e) {} }
      else if (enEspera) setTimeout(() => avisar(null), 15000);   // el aviso de espera no queda fijo
      else if (Date.now() - aplicado > 600000) { aplicado = Date.now(); await CX.rpc('lectura_aplicar_recientes', {}); }
    } catch (e) { console.warn('[SIRIUS lectura]', e && e.message || e); avisar(null); }
    finally { ocupado = false; }
  }
  setTimeout(vuelta, 2500); setInterval(vuelta, op.cadaMs); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') vuelta(); }); estado.ahora = vuelta; return estado;
}
return { leer, iniciar, cola: EN_WORKER ? null : cola, base: (u) => { if (u) BASE = u; return BASE; }, listo: () => !!detS, _interno: { leerMatricula, leerLicencia, leerPlaca, leerKm, leerVin } };

})();
