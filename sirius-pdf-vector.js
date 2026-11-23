// SIRIUS · Motor vectorial de los PDF de Vehículos (v1.1 · etapa P-1f · DEC-273 · 22/11/2026; v1.0 · etapa P-1c1 · DEC-272 · 21/11/2026)
// P-1f: paginación sin cortes (el alto de cada fila de fotos sale de la proporción 4:3 y de su respaldo; un subtítulo de grupo va con su primera fila; una sección
// corta no se parte), firmas de quien actuó (con su cabecera y la firma de quien atiende), las 4 fotos exteriores del resumen en una fila y fotos más livianas.
// Dibuja con jsPDF (Helvetica, texto que se puede buscar y copiar) el contenido que arma sirius-documentos-pdf.js.
// No decide contenido: lee los bloques HTML de documento() (las mismas secciones, reglas, números y frases de la vista previa)
// y los convierte en piezas (capítulo, datos, frases, tabla, hallazgos, diagrama, línea de tiempo, firmas, galería) que pinta
// con el diseño aprobado (maqueta del informe 20196-V1). Las fotos y el diagrama de averías van como imagen; el resto es vectorial.
// Paginación por flujo: una fila de tabla, una foto con su respaldo o una firma no se parten; una tabla corta va entera; un
// capítulo no queda solo al pie de la página; la tabla que sigue en otra página repite su cabecera.
(function () {
  const PAG = { W: 210, H: 297 }, LIM_PIE = 284;
  const K = { ink: '#14263F', muted: '#5B6B80', line: '#D9E0E8', navy: '#0B2E59', acc: '#0B5CAD', band: '#E6F1FA', soft: '#F3F6F9', celeste: '#E3F0FA',
    ok: '#1F7A5C', okbg: '#E7F4EE', bad: '#B42318', badbg: '#FDECEA', warn: '#9A6400', warnbg: '#FDF3DC', ph: '#EAEFF5', phTxt: '#8A99AB',
    selloOk: '#2E7D32', selloNo: '#A01F1A', selloPend: '#B8741A', verdeBorde: '#4C8C1E' };
  // ---------- Texto WinAnsi (Helvetica estándar) ----------
  const WIN = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
  function san(s) { return String(s == null ? '' : s).replace(/−/g, '–').replace(/[   ]/g, ' ').replace(/ /g, ' ').replace(/[‐‑]/g, '-')
    .replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->').replace(/[✓✔✕✗✖]/g, '')
    .split('').filter((c) => { const n = c.charCodeAt(0); return n === 10 || (n >= 32 && n <= 126) || (n >= 160 && n <= 255) || WIN.indexOf(c) >= 0; }).join(''); }
  const sty = (el) => String((el && el.getAttribute && el.getAttribute('style')) || '').toLowerCase();
  const ultimo = (re, s) => { let m, r = null; re.lastIndex = 0; while ((m = re.exec(s))) r = m[1]; return r; };
  const colorDe = (s) => ultimo(/(?:^|;)\s*color:\s*(#[0-9a-f]{3,6})/g, s);
  const fondoDe = (s) => ultimo(/(?:^|;)\s*background:\s*(#[0-9a-f]{3,6})/g, s);
  const negrita = (s, tag) => tag === 'b' || tag === 'strong' || /font-weight:\s*(600|700|800|bold)/.test(s);
  const limpio = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  // ---------- Lectura de los bloques HTML (sin ejecutar nada: innerHTML de un div suelto) ----------
  function runsDe(node, base) {
    const out = []; const walk = (n, c) => { if (n.nodeType === 3) { if (n.nodeValue) out.push({ t: n.nodeValue, c: c.c, b: c.b }); return; } if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase(); if (tag === 'svg' || n.getAttribute('aria-hidden') === 'true') return; if (tag === 'br') { out.push({ t: '\n', c: c.c, b: c.b }); return; }
      const s = sty(n), blk = /display:\s*block/.test(s) && out.length, nc = { c: colorDe(s) || c.c, b: c.b || negrita(s, tag) }; if (blk) out.push({ t: '\n', c: c.c, b: c.b });
      Array.from(n.childNodes).forEach((ch) => walk(ch, nc)); };
    walk(node, base || { c: null, b: false });
    const m = []; out.forEach((r) => { const l = m[m.length - 1]; if (l && l.c === r.c && l.b === r.b && r.t !== '\n' && l.t !== '\n') l.t += r.t; else m.push(Object.assign({}, r)); });
    return m; }
  const textoRuns = (R) => R.map((r) => r.t === '\n' ? ' ' : r.t).join('');
  // Textos de un bloque en el orden del HTML (para la prueba de contenido): sin el SVG del diagrama ni los íconos (aria-hidden).
  function textosHtml(html) { const root = document.createElement('div'); root.innerHTML = html; const out = [];
    const walk = (n) => { if (n.nodeType === 3) { const t = limpio(n.nodeValue); if (t) out.push(t); return; } if (n.nodeType !== 1) return; const tag = n.tagName.toLowerCase(); if (tag === 'svg' || n.getAttribute('aria-hidden') === 'true') return; Array.from(n.childNodes).forEach(walk); };
    walk(root); return out; }
  function tablaDe(t) {
    const th = Array.from(t.querySelectorAll('thead th')), head = th.map((x) => ({ t: limpio(x.textContent), der: /text-align:\s*right/.test(sty(x)) }));
    const anchos = Array.from(t.querySelectorAll('colgroup col')).map((c) => parseFloat((/width:\s*([\d.]+)%/.exec(sty(c)) || [])[1]) || 0);
    const rows = Array.from(t.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children).map((td) => { const s = sty(td), sp = td.querySelector('span'), ss = sty(sp);
      if (sp && /border-radius:\s*50%/.test(ss)) return { circulo: limpio(sp.textContent), bg: fondoDe(ss) || K.muted };
      if (sp && /border-radius:\s*3px/.test(ss) && limpio(td.textContent) === limpio(sp.textContent)) return { chip: limpio(sp.textContent), bg: fondoDe(ss), fg: colorDe(ss) };
      return { runs: runsDe(td, { c: colorDe(s), b: negrita(s, 'td') }), der: /text-align:\s*right/.test(s) }; }));
    const total = rows.length > 1 && /^total$/i.test(limpio(textoRuns((rows[rows.length - 1][0] || {}).runs || [])));
    return { k: 'tabla', head, rows, anchos: anchos.length === head.length && anchos.every((x) => x > 0) ? anchos : null, total }; }
  function clasificar(n, out) {
    const tag = n.tagName.toLowerCase(), s = sty(n);
    if (tag === 'h2') { const sp = n.querySelector('span'), num = sp ? limpio(sp.textContent) : '', t = limpio(n.textContent).slice(num.length).trim(); out.push({ k: 'cap', n: num, t }); return; }
    if (tag === 'h3') { out.push({ k: 'sub', t: limpio(n.textContent) }); return; }
    if (tag === 'table') { out.push(tablaDe(n)); return; }
    if (tag === 'ul') { out.push({ k: 'hall', items: Array.from(n.children).map((li) => { const ch = li.querySelector('span'), cs = sty(ch), rest = Array.from(li.children).slice(1);
      return { chip: limpio(ch ? ch.textContent : ''), bg: fondoDe(cs), fg: colorDe(cs), runs: [].concat.apply([], rest.map((x) => runsDe(x))) }; }) }); return; }
    if (tag === 'p') { const b0 = n.firstElementChild;
      if (b0 && b0.tagName.toLowerCase() === 'b' && n.firstChild === b0) { const sp = b0.querySelector('span'), num = sp ? limpio(sp.textContent) : '', lab = limpio(b0.textContent).slice(num.length).trim().replace(/:$/, '');
        const tmp = n.cloneNode(true); tmp.removeChild(tmp.firstElementChild); const runs = runsDe(tmp, { c: null, b: false });
        if (num) { out.push({ k: 'cap', n: num, t: lab, dosPuntos: true }); out.push({ k: 'parr', runs }); } else out.push({ k: 'frase', l: lab, runs }); return; }
      const cP = colorDe(s), chico = /font-size:\s*8\.5pt/.test(s) && cP; out.push({ k: 'parr', runs: runsDe(n, { c: cP, b: negrita(s, 'p') }), chico, estado: !chico && cP && cP.toLowerCase() !== '#14263f' ? cP : '' }); return; }
    if (tag === 'div' || tag === 'section' || tag === 'span') {
      if (!limpio(n.textContent) && !n.querySelector('svg,img')) return;
      if (n.querySelector(':scope > svg[data-carroceria]')) { const sv = n.querySelector(':scope > svg[data-carroceria]'), vb = String(sv.getAttribute('viewBox') || '0 0 700 300').split(/\s+/).map(Number);
        const lg = Array.from(n.children).find((x) => x.tagName.toLowerCase() !== 'svg'), ley = lg ? Array.from(lg.children).map((sp) => ({ t: limpio(sp.textContent), c: sp.querySelector('i') ? fondoDe(sty(sp.querySelector('i'))) : '' })).filter((x) => x.t) : []; out.push({ k: 'diag', svg: sv.outerHTML, vw: vb[2], vh: vb[3], ley }); return; }
      const hijos = Array.from(n.children);
      if (/padding-top:\s*calc\(/.test(s)) { const dec = n.querySelector('b');
        if (dec && /^Declaraci/.test(limpio(dec.textContent))) { const caja = dec.parentElement, tmp = caja.cloneNode(true); tmp.removeChild(tmp.querySelector('b')); out.push({ k: 'caja', t: limpio(dec.textContent), runs: runsDe(tmp) }); return; }
        out.push({ k: 'firmas', L: hijos.map((h) => { const im = h.querySelector('img'); return { nombre: limpio((h.querySelector('b') || {}).textContent), rol: limpio((h.querySelector('i') || {}).textContent), cab: h.getAttribute('data-cab') || '', extra: h.getAttribute('data-extra') || '', verde: h.getAttribute('data-verde') === '1', firma: im ? im.getAttribute('src') || '' : '' }; }) }); return; }
      if (hijos[0] && /position:\s*absolute/.test(sty(hijos[0])) && hijos.slice(1).every((h) => h.querySelector('b'))) { out.push({ k: 'tiempo', ev: hijos.slice(1).map((h) => ({ e: limpio(h.querySelector('b').textContent), f: limpio((h.querySelector('span') || {}).textContent) })) }); return; }
      if (hijos.length && hijos.every((h) => /flex-direction:\s*column/.test(sty(h)) && h.querySelectorAll(':scope > span').length === 2)) { out.push({ k: 'datos', campos: hijos.map((h) => { const sp = h.querySelectorAll(':scope > span'); return { l: limpio(sp[0].textContent), v: limpio(sp[1].textContent) }; }) }); return; }
      if (/display:\s*grid/.test(s) && hijos.length && hijos.every((h) => h.lastElementChild && h.lastElementChild.querySelector(':scope > b') && (h.querySelector('img') || h.querySelector('[style*="justify-content:center"]')))) {
        out.push({ k: 'fotos', items: hijos.map((h) => { const cap = h.lastElementChild, b = cap.querySelector(':scope > b'), img = h.querySelector('img'), ph = img ? null : h.querySelector('[style*="justify-content:center"]'), ov = h.querySelector('[data-danos] > svg');
          const tmp = cap.cloneNode(true); tmp.removeChild(tmp.querySelector(':scope > b')); const meta = runsDe(tmp);
          return { url: img ? img.getAttribute('src') : '', alt: img ? img.getAttribute('alt') : '', ph: ph ? limpio(ph.textContent) : '', ov: ov ? ov.outerHTML : '', cap: limpio(b.textContent), meta }; }) }); return; }
      if (hijos.length && hijos[0].tagName.toLowerCase() === 'b' && /:$/.test(limpio(hijos[0].textContent)) && n.querySelector(':scope > table')) { out.push({ k: 'frase', l: limpio(hijos[0].textContent).replace(/:$/, ''), runs: [] }); out.push(tablaDe(n.querySelector(':scope > table'))); return; }
      if (!hijos.length) { out.push({ k: 'parr', runs: runsDe(n, { c: colorDe(s), b: negrita(s, tag) }) }); return; }
      hijos.forEach((h) => clasificar(h, out)); return; }
    if (limpio(n.textContent)) out.push({ k: 'parr', runs: runsDe(n) }); }
  function piezas(html) { const root = document.createElement('div'); root.innerHTML = html; const out = []; Array.from(root.children).forEach((h) => clasificar(h, out));
    // Galerías seguidas (filas de la vista previa) se unen para volver a armarlas de 3 por fila.
    const m = []; out.forEach((x) => { const l = m[m.length - 1]; if (x.k === 'fotos' && l && l.k === 'fotos') l.items = l.items.concat(x.items); else m.push(x); }); return m; }
  // Recuadro del resultado: título, líneas (cada <br> es una línea) y si es negativo/positivo/pendiente.
  function resultadoDe(html) { const root = document.createElement('div'); root.innerHTML = html; const g = root.querySelector('[role=group]') || root, b = g.querySelector('b'), meta = b ? b.nextElementSibling : null;
    const lineas = []; let cur = []; if (meta) runsDe(meta).forEach((r) => { if (r.t === '\n') { lineas.push(cur); cur = []; } else cur.push(r); }); if (cur.length) lineas.push(cur);
    return { titulo: limpio(b ? b.textContent : ''), lineas }; }

  // ---------- Imágenes ----------
  const cargarImg = (src) => new Promise((ok) => { if (!src) return ok(null); const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => ok(im.naturalWidth ? im : null); im.onerror = () => ok(null); im.src = src; });
  // Foto: recorte al formato del recuadro, lado mayor 1000 px (P-1f: unos 400 ppp en el ancho impreso de una foto), JPEG 0,78.
  async function fotoData(url, aspecto) { const im = await cargarImg(url); if (!im) return null; try { const W0 = im.naturalWidth, H0 = im.naturalHeight; let sw = W0, sh = W0 / aspecto; if (sh > H0) { sh = H0; sw = H0 * aspecto; }
    const k = Math.min(1, 1000 / Math.max(sw, sh)), cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(sw * k)); cv.height = Math.max(1, Math.round(sh * k)); const g = cv.getContext('2d'); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, cv.width, cv.height);
    g.drawImage(im, (W0 - sw) / 2, (H0 - sh) / 2, sw, sh, 0, 0, cv.width, cv.height); return cv.toDataURL('image/jpeg', 0.78); } catch (e) { return null; } }
  async function logoData(src) { const im = await cargarImg(src); if (!im) return null; try { const k = Math.min(1, 900 / im.naturalWidth), cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k);
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); return { data: cv.toDataURL('image/png'), w: cv.width, h: cv.height }; } catch (e) { return null; } }
  // SVG → PNG (el diagrama al doble de resolución; la capa de daños de una foto al tamaño del recuadro).
  async function svgData(svg, w, h, escala) { const k = escala || 2; let s = String(svg).replace(/^<svg\b([^>]*)>/, (m, a) => '<svg' + a.replace(/\s(width|height|style)="[^"]*"/g, '') + ' width="' + w + '" height="' + h + '">');
    if (!/xmlns=/.test(s.slice(0, 200))) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    const im = await cargarImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s)); if (!im) return null;
    try { const cv = document.createElement('canvas'); cv.width = Math.round(w * k); cv.height = Math.round(h * k); const g = cv.getContext('2d'); g.drawImage(im, 0, 0, cv.width, cv.height); return cv.toDataURL('image/png'); } catch (e) { return null; } }

  // ---------- Lienzo ----------
  function Lienzo(o) {
    const JS = window.jspdf.jsPDF; this.doc = new JS({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    this.M = o.margen || 14; this.CW = PAG.W - 2 * this.M; this.y = this.M; this.top = this.M; this.cp = o.colorP || K.navy; this.ca = o.colorA || K.acc; this.log = []; this.sec = ''; this.img = o.img || {};
    this.doc.setProperties({ title: o.titulo || 'Documento SIRIUS', creator: 'SIRIUS · Aseguradora del Sur', subject: o.asunto || '' }); }
  const LP = Lienzo.prototype;
  LP.reg = function (t, diseno) { const s = limpio(t); if (s) this.log.push({ sec: this.sec, t: s, d: !!diseno, pg: this.doc.getNumberOfPages(), y: Math.round(this.y * 10) / 10 }); };
  LP.f = function (s, b, c, fam) { this.doc.setFont(fam || 'helvetica', b ? 'bold' : 'normal'); this.doc.setFontSize(s); this.doc.setTextColor(c || K.ink); };
  LP.w = function (t, s, b, fam) { this.f(s, b, null, fam); return this.doc.getTextWidth(san(t)); };
  LP.t = function (t, x, y, o) { o = o || {}; this.f(o.s || 9, o.b, o.c, o.fam); const op = {}; if (o.a) op.align = o.a; if (o.cs) op.charSpace = o.cs; if (o.ang) op.angle = o.ang; this.doc.text(san(t), x, y, op); };
  LP.nueva = function () { this.doc.addPage('a4', 'portrait'); this.y = this.top; };
  LP.libre = function () { return LIM_PIE - this.y; };
  LP.cabe = function (h) { if (this.y + h > LIM_PIE && this.y > this.top + 0.5) { this.nueva(); return false; } return true; };
  LP.lineaPunteada = function (x1, y, x2) { const d = this.doc; d.setDrawColor(K.line); d.setLineWidth(0.25); d.setLineDashPattern([0.35, 0.7], 0); d.line(x1, y, x2, y); d.setLineDashPattern([], 0); };
  // Texto con estilos por tramo: líneas de { t, b, c, x }.
  LP.lineas = function (runs, maxW, s, colBase) {
    const L = []; let cur = [], curW = 0, esp = false; const push = () => { L.push(cur); cur = []; curW = 0; esp = false; };
    runs.forEach((r) => { if (r.t === '\n') { push(); return; } String(r.t).split(/(\s+)/).forEach((tok) => { if (!tok) return; if (/^\s+$/.test(tok)) { if (cur.length) esp = true; return; }
      let wd = this.w(tok, s, r.b); const ws = this.w(' ', s, r.b);
      if (cur.length && curW + (esp ? ws : 0) + wd > maxW) push();
      while (wd > maxW && tok.length > 1) { if (cur.length) push(); let k = tok.length - 1; while (k > 1 && this.w(tok.slice(0, k), s, r.b) > maxW) k--; cur.push({ t: tok.slice(0, k), b: r.b, c: r.c || colBase }); push(); tok = tok.slice(k); wd = this.w(tok, s, r.b); }
      const conSp = cur.length > 0 && esp, sp = conSp ? ' ' : '', l = cur[cur.length - 1], c = r.c || colBase;
      if (l && l.b === r.b && l.c === c) l.t += sp + tok; else cur.push({ t: sp + tok, b: r.b, c }); curW += (conSp ? ws : 0) + wd; esp = false; }); });
    if (cur.length) L.push(cur); return L.filter((l) => l.length); };
  LP.pintaLineas = function (L, x, y, s, lh, a) { L.forEach((ln, i) => { let xx = x; if (a === 'center' || a === 'right') { const tw = ln.reduce((q, p) => q + this.w(p.t, s, p.b), 0); xx = a === 'center' ? x - tw / 2 : x - tw; }
    ln.forEach((p) => { const sp = /^ /.test(p.t) ? this.w(' ', s, p.b) : 0; this.t(p.t.replace(/^ /, ''), xx + sp, y + i * lh, { s, b: p.b, c: p.c }); xx += this.w(p.t, s, p.b); }); }); };
  LP.lineasTxt = function (t, maxW, s, b) { this.f(s, b); return this.doc.splitTextToSize(san(t), maxW); };

  // ---------- Portada (franja, logos, título, sello y tarjetas) ----------
  LP.portada = function (P) {
    const d = this.doc, M = this.M, R = PAG.W - M;
    // Encabezado compacto (P-1c4 · DEC-272): la franja termina a 59 mm (un quinto de la hoja: 59,4 mm), con 5,5 mm de margen arriba y 2,5 mm abajo, en dos filas.
    // Fila 1, logos (de 5,5 a unos 27 mm): a la izquierda el logo a 17 mm de alto (hasta 40 mm de ancho) y debajo «by aseguradora del sur» (8 pt), alineado con el texto del
    // logo; a la derecha el logo a 11 mm de alto (hasta 40 mm), alineado a x = 196 mm, y debajo el nombre (10 pt negrita) y una sola línea de 8 pt («Proceso … · Ciudad, fecha»).
    // La agencia (opcional, P-1c2b) va a la izquierda del logo de la derecha, en la misma fila, a 9 mm de alto y con la línea fina (sin logo: su nombre en 9 pt).
    // Fila 2, identificación (de unos 29 a 56 mm): título (9 pt), placa (27 pt negrita) con «Caso N · vehículo i de n» (12,5 pt), vehículo (8,5 pt) y el sello de 27 mm
    // (anillo de 1,1 mm) a la derecha. Cada logo se ajusta a su zona sin deformarse.
    const FR = 59, Y0 = 5.5;
    d.setFillColor(K.band); d.rect(0, 0, PAG.W, FR, 'F'); d.setFillColor('#FFFFFF'); d.circle(192, 0, 48, 'F'); /* círculo decorativo de unos 96 mm, en la esquina superior derecha */
    const izq = P.logoIzq, der = P.logoDer, ag = P.logoAg, ajusta = (im, mw, mh) => { const k = Math.min(mw / im.w, mh / im.h); return { w: im.w * k, h: im.h * k }; }; this.rects = { franja: FR };
    if (izq && izq.data) { const z = ajusta(izq, 40, 17); d.addImage(izq.data, 'PNG', M, Y0, z.w, z.h, undefined, 'FAST'); this.rects.izq = { x: M, y: Y0, w: z.w, h: z.h };
      if (P.lema) { const xr = Math.max(M + z.w * (P.lemaFin || 1), M + this.w(P.lema, 8)), yb = Y0 + z.h + 3.7; /* nunca antes del margen */ this.t(P.lema, xr, yb, { s: 8, c: K.muted, a: 'right' }); this.rects.lema = { x: xr - this.w(P.lema, 8), x2: xr, y: yb - 2.8, y2: yb + 0.7 }; this.reg(P.lema, true); } }
    let xDer = R; if (der && der.data) { const z = ajusta(der, 40, 11); d.addImage(der.data, 'PNG', R - z.w, Y0 + (11 - z.h) / 2, z.w, z.h, undefined, 'FAST'); this.rects.der = { x: R - z.w, y: Y0 + (11 - z.h) / 2, w: z.w, h: z.h }; xDer = R - z.w; }
    if ((ag && ag.data) || P.agTxt) { const sx = xDer - 3; d.setDrawColor(K.line); d.setLineWidth(0.25); d.line(sx, Y0 + 1, sx, Y0 + 10); this.rects.sep = sx;
      if (ag && ag.data) { const z = ajusta(ag, Math.max(8, Math.min(40, sx - 3 - 60)), 9); /* no entra en la zona izquierda (termina a unos 54 mm) */ d.addImage(ag.data, 'PNG', sx - 3 - z.w, Y0 + (11 - z.h) / 2, z.w, z.h, undefined, 'FAST'); this.rects.ag = { x: sx - 3 - z.w, y: Y0 + (11 - z.h) / 2, w: z.w, h: z.h }; }
      else { this.t(P.agTxt, sx - 3, Y0 + 6.7, { s: 9, c: K.muted, a: 'right' }); this.rects.ag = { x: sx - 3 - this.w(P.agTxt, 9), y: Y0 + 3.5, w: this.w(P.agTxt, 9), h: 4 }; this.reg(P.agTxt, true); } }
    this.rects.lineas = []; (P.derLineas || []).forEach((t, i) => { const yb = Y0 + 11 + (i ? 9.4 : 4.7), sz = i ? 8 : 10; this.t(t, R, yb, { s: sz, b: !i, c: i ? K.muted : this.cp, a: 'right' }); this.rects.lineas.push({ x: R - this.w(t, sz, !i), x2: R, y2: yb + 0.9 }); this.reg(t, true); });
    // Título, placa, caso y vehículo.
    this.t(P.titulo, M, 34.3, { s: 9, c: this.ca, cs: 0.25 }); this.reg(P.titulo, true);
    this.t(P.placa, M, 45.7, { s: 27, b: true, c: this.cp }); const wp = this.w(P.placa, 27, true); this.reg(P.placa, true);
    this.t(P.casoTxt, M + wp + 3, 45.7, { s: 12.5, c: this.ca }); this.reg(P.casoTxt, true); this.rects.caso = { x: M + wp + 3, x2: M + wp + 3 + this.w(P.casoTxt, 12.5) };
    const vl = this.lineasTxt(P.vehLinea, 128, 8.5); this.t(vl[0] || '', M, 51.3, { s: 8.5, c: K.muted }); this.reg(P.vehLinea, true);
    // Sello circular de 27 mm (anillo de 1,1 mm): estado del vehículo (DEC-271) y su veredicto; el texto cabe dentro del anillo.
    const S = P.sello, cx = 179.5, cy = 43, col = S.color; d.setDrawColor(col); d.setLineWidth(0.25); d.circle(cx, cy, 13.5, 'S'); d.setLineWidth(1.1); d.setFillColor('#FFFFFF'); d.circle(cx, cy, 12.3, 'FD'); this.rects.sello = { cx, cy, r: 13.5, ri: 12.3 - 0.55 };
    this.t(S.top, cx, cy - 5.4, { s: 5.5, c: col, a: 'center', cs: 0.12 }); this.reg(S.top, true);
    let se = 8; while (se > 5.5 && this.w(S.estado, se, true) > 21.6) se -= 0.1; this.t(S.estado, cx, cy + (S.ver ? 0 : 1.2), { s: se, b: true, c: col, a: 'center' }); this.reg(S.estado, true); this.rects.selloTxt = [{ t: S.estado, s: se, w: this.w(S.estado, se, true), y: cy + (S.ver ? 0 : 1.2) }];
    if (S.ver) { let sv = 7; while (sv > 5.2 && this.w(S.ver, sv, true) > 20.4) sv -= 0.1; this.t(S.ver, cx, cy + 4.4, { s: sv, b: true, c: col, a: 'center' }); this.reg(S.ver, true); this.rects.selloTxt.push({ t: S.ver, s: sv, w: this.w(S.ver, sv, true), y: cy + 4.4 }); }
    // Fila de 4 tarjetas (la última, oscura, con el resultado): empiezan 5 mm debajo de la franja.
    const y0 = FR + 5, gap = 3.8, cw = (this.CW - 3 * gap) / 4, ch = 29; this.rects.tarjetasY = y0;
    (P.tarjetas || []).slice(0, 4).forEach((c, i) => { const x = M + i * (cw + gap), osc = !!c.oscura;
      d.setFillColor(osc ? this.cp : '#FFFFFF'); d.setDrawColor(osc ? this.cp : K.line); d.setLineWidth(0.3); d.roundedRect(x, y0, cw, ch, 2.4, 2.4, osc ? 'F' : 'FD');
      this.t(c.l.toUpperCase(), x + 4, y0 + 5.8, { s: 6.2, c: osc ? '#C9D6E6' : K.muted, cs: 0.3 }); this.reg(c.l.toUpperCase(), true);
      const vL = this.lineasTxt(c.v, cw - 8, 12.2, true).slice(0, 2); vL.forEach((t, k) => this.t(t, x + 4, y0 + 12.6 + k * 4.8, { s: 12.2, b: true, c: osc ? '#FFFFFF' : K.ink })); this.reg(c.v, true);
      const sy = y0 + 12.6 + vL.length * 4.8 - 0.6; this.lineasTxt(c.sub || '', cw - 8, 7.2).slice(0, 3).forEach((t, k) => this.t(t, x + 4, sy + k * 3.6, { s: 7.2, c: osc ? '#DCE5F0' : K.muted })); this.reg(c.sub, true); });
    this.y = y0 + ch + 5.5; };
  // Tarjeta de identificación (placa, VIN, motor…) con las 2 fotos referenciales.
  LP.identificacion = function (I) {
    if (I.soloFotos) { const n = Math.max(1, (I.fotos || []).length), gap = 3.2, fw = (this.CW - (n - 1) * gap) / n, fh = fw * 0.75, hh = fh + 8.4; this.cabe(hh + 2); const y1 = this.y; /* P-1f · DEC-273: resumen, las 4 fotos exteriores en una fila (4:3) */
      (I.fotos || []).forEach((f, k) => { const x = this.M + k * (fw + gap); this.foto(f, x, y1, fw, fh); if (f.F) { this.t(f.F, x, y1 + fh + 3.6, { s: 7, b: true, c: K.ink }); let nm = ' · ' + f.nombre; const mx = fw - this.w(f.F, 7, true) - 0.5; if (this.w(nm, 7) > mx) { while (nm.length > 4 && this.w(nm + '…', 7) > mx) nm = nm.slice(0, -1); nm = nm.replace(/\s+$/, '') + '…'; } this.t(nm, x + this.w(f.F, 7, true), y1 + fh + 3.6, { s: 7, c: K.muted }); } /* el nombre largo se corta con «…» dentro de su foto */ else this.t(f.nombre, x, y1 + fh + 3.6, { s: 7, c: K.muted }); this.t(f.at, x, y1 + fh + 6.8, { s: 6, c: K.muted }); this.reg(f.F ? f.F + ' · ' + f.nombre : f.nombre, true); this.reg(f.at, true); });
      this.y = y1 + hh + 4; return; }
    const d = this.doc, M = this.M, y0 = this.y, h = 42, w1 = 62; this.cabe(h + 2);
    d.setFillColor('#FFFFFF'); d.setDrawColor(K.line); d.setLineWidth(0.3); d.roundedRect(M, y0, w1, h, 2.4, 2.4, 'FD');
    d.setDrawColor(this.cp); d.setLineWidth(0.6); d.roundedRect(M + 4.2, y0 + 4.6, w1 - 8.4, 17, 1.8, 1.8, 'S');
    if (I.pais) { this.t(I.pais, M + w1 / 2, y0 + 8.6, { s: 5.8, c: this.ca, a: 'center', cs: 0.45 }); this.reg(I.pais); }
    let sp = 19.5; while (sp > 11 && this.w(I.placa, sp, true) + I.placa.length * 0.9 > w1 - 12) sp -= 0.5; this.t(I.placa, M + w1 / 2, y0 + 17.4, { s: sp, b: true, c: this.cp, a: 'center', cs: 0.9 }); this.reg(I.placa);
    (I.filas || []).slice(0, 4).forEach((f, k) => { const yy = y0 + 27 + k * 4.6; this.t(f.l, M + 4.2, yy, { s: 7.4, c: K.muted }); this.t(f.v, M + 14.5, yy, { s: 7.6, c: K.ink, fam: 'courier', b: false }); this.reg(f.l); this.reg(f.v); });
    const fw = (PAG.W - M - (M + w1 + 4) - 3.2) / 2;
    (I.fotos || []).slice(0, 2).forEach((f, k) => { const x = M + w1 + 4 + k * (fw + 3.2); this.foto(f, x, y0, fw, 35); if (f.F) { this.t(f.F, x, y0 + 38.6, { s: 7, b: true, c: K.ink }); this.t(' · ' + f.nombre, x + this.w(f.F, 7, true), y0 + 38.6, { s: 7, c: K.muted }); } else this.t(f.nombre, x, y0 + 38.6, { s: 7, c: K.muted }); this.t(f.at, x, y0 + 41.8, { s: 6, c: K.muted }); this.reg(f.F ? f.F + ' · ' + f.nombre : f.nombre, true); this.reg(f.at, true); });
    this.y = y0 + h + 5; };
  // Foto o su marcador: imagen recortada, marcador de la demostración o «Foto no disponible».
  LP.foto = function (f, x, y, w, h) { const d = this.doc, im = f.url ? this.img[f.url] : null;
    if (im) { d.addImage(im, 'JPEG', x, y, w, h, undefined, 'FAST'); d.setDrawColor(K.line); d.setLineWidth(0.25); d.roundedRect(x, y, w, h, 1.6, 1.6, 'S'); }
    else { d.setFillColor(f.url ? '#F6E9E7' : K.ph); d.roundedRect(x, y, w, h, 1.6, 1.6, 'F'); const cx = x + w / 2, cy = y + h / 2 - 3.2; d.setDrawColor(K.phTxt); d.setLineWidth(0.35); d.roundedRect(cx - 2.6, cy - 1.7, 5.2, 3.6, 0.6, 0.6, 'S'); d.circle(cx, cy + 0.1, 1, 'S'); d.line(cx - 1, cy - 1.7, cx - 0.4, cy - 2.5); d.line(cx - 0.4, cy - 2.5, cx + 0.8, cy - 2.5); d.line(cx + 0.8, cy - 2.5, cx + 1.3, cy - 1.7);
      const txt = f.url ? 'Foto no disponible' : f.ph; const L = this.lineasTxt(txt, w - 6, 6.6).slice(0, 2); L.forEach((t, k) => this.t(t, cx, cy + 5.8 + k * 3, { s: 6.6, c: f.url ? K.bad : K.phTxt, a: 'center' })); this.reg(txt, !!f.url); }
    if (f.ov && this.img['ov:' + f.ov]) d.addImage(this.img['ov:' + f.ov], 'PNG', x, y, w, h, undefined, 'FAST'); };
  // Recuadro del resultado: veredicto, quién calificó, la regla que lo envió a calificación y la emisión.
  LP.resultado = function (Rs, color) { const d = this.doc, M = this.M, W = this.CW, pad = 5, tL = this.lineasTxt(Rs.titulo, W - 2 * pad - 2, 10.3, true), LL = [];
    Rs.lineas.forEach((ln) => this.lineas(ln, W - 2 * pad - 2, 7.8, K.muted).forEach((x) => LL.push(x)));
    const h = 4.6 + tL.length * 4.8 + LL.length * 3.75 + 3.2; this.cabe(h + 2); const y0 = this.y;
    d.setFillColor('#FFFFFF'); d.setDrawColor(K.line); d.setLineWidth(0.3); d.roundedRect(M, y0, W, h, 2, 2, 'FD'); d.setFillColor(color); d.rect(M, y0, 1.3, h, 'F');
    tL.forEach((t, k) => this.t(t, M + pad + 1, y0 + 6.4 + k * 4.8, { s: 10.3, b: true, c: color })); this.reg(Rs.titulo);
    this.pintaLineas(LL, M + pad + 1, y0 + 6.4 + tL.length * 4.8 + 0.4, 7.8, 3.75); Rs.lineas.forEach((ln) => this.reg(textoRuns(ln)));
    this.y = y0 + h + 5; };

  // ---------- Cuerpo ----------
  LP.altoMin = function (p) { if (!p) return 0; switch (p.k) {
    case 'tabla': { const m = this.medirTabla(p); return m.altoTot <= 70 ? m.altoTot : 7.2 + m.filas.slice(0, 2).reduce((a, f) => a + f.h, 0); } case 'datos': return this.altoDatos(p, 1); case 'frase': return 8; case 'hall': return 7; case 'parr': return 10;
    case 'diag': return this.altoDiag(p); case 'tiempo': return 18; case 'firmas': return this.altoFirmas(p, 1); case 'fotos': return this.altoFotos(p, 1); case 'sub': return 7.4 + (p.sigP && p.sigP.k === 'fotos' ? this.altoFotos(p.sigP, 1) : 8); case 'caja': return 14; default: return 8; } };
  // P-1f · DEC-273: alto de las filas (datos, fotos y firmas) con la misma medida con que se dibujan, y el alto total de una pieza (para no partir una sección corta).
  LP.altoDatos = function (p, filas) { const n = 3, gap = 6, cw = (this.CW - (n - 1) * gap) / n; let h = 0; for (let i = 0, k = 0; i < p.campos.length && (!filas || k < filas); i += n, k++) { const nl = Math.max.apply(null, p.campos.slice(i, i + n).map((c) => this.lineasTxt(c.v, cw - 1, 8.8).length)); h += 4.6 + nl * 4 + 1.8 + 1.6; } return h ? h - 0.1 : 0; }; /* la última fila no necesita su espacio de abajo (como en datos(): cabe(h + 1,5)) */
  LP.altoFotos = function (p, filas) { const n = 3, gap = 4, cw = (this.CW - (n - 1) * gap) / n, ih = cw * 0.75; let h = 0; for (let i = 0, k = 0; i < p.items.length && (!filas || k < filas); i += n, k++) { const nm = Math.max(1, ...p.items.slice(i, i + n).map((f) => this.lineas(f.meta, cw - 1, 6.2, K.muted).slice(0, 4).length)); h += ih + 5.2 + nm * 2.85 + 2.4; } return h + (filas ? 0 : 1); };
  LP.altoFirmas = function (p, filas) { const L = p.L || [], k = Math.min(3, Math.max(1, L.length)); let h = 0; for (let i = 0, j = 0; i < L.length && (!filas || j < filas); i += k, j++) h += 0.6 + (L.slice(i, i + k).some((f) => f.firma && this.img['firma:' + f.firma]) ? 40 : 26) + 4; return h; };
  LP.alto = function (p) { switch (p.k) {
    case 'datos': return this.altoDatos(p); case 'fotos': return this.altoFotos(p); case 'firmas': return this.altoFirmas(p); case 'tabla': return this.medirTabla(p).altoTot + 3; case 'diag': return this.altoDiag(p) + 3; case 'tiempo': return 18;
    case 'frase': { const nl = Math.max(this.lineasTxt(p.l, 37, 8.2, true).length, this.lineas(p.runs, this.CW - 40, 8.4, K.ink).length || 0); return 3 + nl * 4.1 + 2.2; }
    case 'hall': return p.items.reduce((a, h) => a + Math.max(5.8, this.lineas(h.runs, this.CW - 18, 8.6, K.ink).length * 4.2 + 1.8) + 0.4, 0) + 0.6;
    case 'parr': { if (p.chico) return this.lineas(p.runs, this.CW, 7.4, p.chico).length * 3.6 + 2; if (p.estado) return this.lineas(p.runs, this.CW, 8.8, p.estado).length * 4.3 + 3.5; return this.lineas(p.runs, this.CW - 10, 8.8, K.ink).length * 4.3 + 8.4; }
    case 'caja': return 13 + this.lineas(p.runs, this.CW - 10, 8.4, K.ink).length * 4.1; case 'sub': return 7.4; default: return 8; } };
  LP.cap = function (p, sig) { const arriba = this.y <= this.top + 0.5; if (!arriba) this.y += 2.6; const tot = (p.seg || []).reduce((a, x) => a + this.alto(x), 0); this.cabe(10 + (p.seg && p.seg.length && tot <= 95 ? tot : this.altoMin(sig))); /* P-1f: una sección corta va entera */
    if (this.y > this.top + 0.5 && this.y - 2.6 <= this.top) this.y = this.top; const y = this.y, M = this.M; let x = M;
    if (p.n) { this.t(p.n, x, y + 4.6, { s: 11, b: true, c: this.ca }); x += this.w(p.n, 11, true) + 2.6; this.reg(p.n); }
    this.t(p.t, x, y + 4.6, { s: 11, b: true, c: this.cp }); this.reg(p.t); this.doc.setDrawColor(K.line); this.doc.setLineWidth(0.3); this.doc.line(M, y + 7.4, PAG.W - M, y + 7.4); this.y = y + 10.4; };
  LP.sub = function (p, sig) { this.y += 1; this.cabe(6 + this.altoMin(sig)); this.t(p.t.toUpperCase(), this.M, this.y + 3.4, { s: 8, b: true, c: K.muted, cs: 0.35 }); this.reg(p.t); this.y += 6.4; };
  LP.datos = function (p) { const n = 3, gap = 6, cw = (this.CW - (n - 1) * gap) / n, M = this.M;
    for (let i = 0; i < p.campos.length; i += n) { const fila = p.campos.slice(i, i + n), LL = fila.map((c) => this.lineasTxt(c.v, cw - 1, 8.8)), nl = Math.max.apply(null, LL.map((l) => l.length)), h = 4.6 + nl * 4 + 1.8;
      this.cabe(h + 1.5); fila.forEach((c, k) => { const x = M + k * (cw + gap); this.t(c.l, x, this.y + 3, { s: 6.8, c: K.muted }); LL[k].forEach((t, j) => this.t(t, x, this.y + 7.6 + j * 4, { s: 8.8, c: K.ink })); this.lineaPunteada(x, this.y + h, x + cw); this.reg(c.l); this.reg(c.v); });
      this.y += h + 1.6; } };
  LP.frase = function (p) { const M = this.M, lw = 40, L1 = this.lineasTxt(p.l, lw - 3, 8.2, true), L2 = this.lineas(p.runs, this.CW - lw, 8.4, K.ink), nl = Math.max(L1.length, L2.length || 0), h = 3 + nl * 4.1 + 1.6;
    this.cabe(h + 0.5); L1.forEach((t, j) => this.t(t, M, this.y + 4.2 + j * 4.1, { s: 8.2, b: true, c: this.cp })); this.pintaLineas(L2, M + lw, this.y + 4.2, 8.4, 4.1);
    this.reg(p.l); this.reg(textoRuns(p.runs)); this.lineaPunteada(M, this.y + h, PAG.W - M); this.y += h + 0.6; };
  LP.hall = function (p) { const M = this.M;
    p.items.forEach((h) => { const L = this.lineas(h.runs, this.CW - 18, 8.6, K.ink), hh = Math.max(5.8, L.length * 4.2 + 1.8); this.cabe(hh + 0.4);
      this.doc.setFillColor(h.bg || K.soft); this.doc.roundedRect(M, this.y + 0.9, 14, 4.3, 1.2, 1.2, 'F'); this.t(h.chip, M + 7, this.y + 4, { s: 6.2, b: true, c: h.fg || K.muted, a: 'center', cs: 0.2 });
      this.pintaLineas(L, M + 18, this.y + 4.1, 8.6, 4.2); this.reg(h.chip); this.reg(textoRuns(h.runs)); this.y += hh + 0.4; }); this.y += 0.6; };
  LP.parr = function (p) { const M = this.M;
    if (p.chico) { const L = this.lineas(p.runs, this.CW, 7.4, p.chico); const h = L.length * 3.6 + 1; this.cabe(h); this.pintaLineas(L, M, this.y + 3, 7.4, 3.6); this.reg(textoRuns(p.runs)); this.y += h + 1; return; }
    if (p.estado) { const L = this.lineas(p.runs, this.CW, 8.8, p.estado), h = L.length * 4.3 + 2; this.cabe(h); this.pintaLineas(L, M, this.y + 4, 8.8, 4.3); this.reg(textoRuns(p.runs)); this.y += h + 1.5; return; }
    const L = this.lineas(p.runs, this.CW - 10, 8.8, K.ink), h = L.length * 4.3 + 6.4; this.cabe(h + 1);
    this.doc.setFillColor(K.soft); this.doc.roundedRect(M, this.y, this.CW, h, 1.6, 1.6, 'F'); this.doc.setFillColor(this.ca); this.doc.rect(M, this.y, 0.9, h, 'F');
    this.pintaLineas(L, M + 5.5, this.y + 5.2, 8.8, 4.3); this.reg(textoRuns(p.runs)); this.y += h + 2; };
  LP.caja = function (p) { const M = this.M, L = this.lineas(p.runs, this.CW - 10, 8.4, K.ink), h = 9 + L.length * 4.1 + 2; this.cabe(h + 2); this.doc.setDrawColor(K.line); this.doc.setLineWidth(0.3); this.doc.roundedRect(M, this.y, this.CW, h, 2, 2, 'S');
    this.t(p.t, M + 5, this.y + 5.6, { s: 8.6, b: true, c: K.ink }); this.pintaLineas(L, M + 5, this.y + 10, 8.4, 4.1); this.reg(p.t); this.reg(textoRuns(p.runs)); this.y += h + 2; };
  // Tabla: cabecera oscura (se repite si sigue en otra página), filas con línea fina y la fila de total en celeste.
  LP.medirTabla = function (p) { if (p._m) return p._m; const M = this.M, W = this.CW, nc = p.head.length, pad = 2.4, sH = 7.6, sC = 8.3, lh = 3.8;
    let an; if (p.anchos) { const tot = p.anchos.reduce((a, b) => a + b, 0); an = p.anchos.map((x) => x / tot * W); }
    else { const need = p.head.map((h, i) => Math.max(this.w(h.t, sH, true), ...p.rows.map((r) => { const c = r[i] || {}; return c.chip ? this.w(c.chip, 6.6, true) + 4 : c.circulo ? 5 : this.w(textoRuns(c.runs || []).replace(/\n/g, ' '), sC, false); })) + 2 * pad + 1);
      const tot = need.reduce((a, b) => a + b, 0); if (tot <= W) { const extra = (W - tot) / nc; an = need.map((x) => x + extra); } else { const min = need.map((x) => Math.min(x, 16)), flex = need.map((x, i) => x - min[i]), fx = flex.reduce((a, b) => a + b, 0), rest = W - min.reduce((a, b) => a + b, 0); an = need.map((x, i) => min[i] + (fx ? flex[i] / fx * rest : 0)); } }
    const xs = an.reduce((a, w, i) => { a.push(i ? a[i - 1] + an[i - 1] : M); return a; }, []);
    const filas = p.rows.map((r, ri) => { const tot = p.total && ri === p.rows.length - 1; const cel = r.map((c, i) => c.chip || c.circulo ? c : Object.assign({}, c, { L: this.lineas((c.runs || []).map((x) => tot ? Object.assign({}, x, { b: true }) : x), an[i] - 2 * pad, sC, K.ink) }));
      const nl = Math.max(1, ...cel.map((c) => (c.L || [1]).length)); return { cel, tot, h: Math.max(7.4, pad + nl * lh + 1.6) }; });
    p._m = { an, xs, filas, pad, sH, sC, lh, altoTot: 7.2 + filas.reduce((a, f) => a + f.h, 0) }; return p._m; };
  LP.tabla = function (p) { const M = this.M, W = this.CW, m = this.medirTabla(p), xs = m.xs, filas = m.filas, pad = m.pad, sH = m.sH, sC = m.sC, lh = m.lh;
    const cab = () => { const y = this.y; this.doc.setFillColor(this.cp); this.doc.roundedRect(M, y, W, 7.2, 1.6, 1.6, 'F'); this.doc.rect(M, y + 3, W, 4.2, 'F');
      p.head.forEach((h, i) => { if (h.t) this.t(h.t, xs[i] + pad, y + 4.75, { s: sH, b: true, c: '#FFFFFF' }); }); this.y += 7.2; };
    const altoTot = m.altoTot; if (altoTot <= 70 && this.y + altoTot > LIM_PIE) this.nueva(); else this.cabe(7.2 + (filas[0] ? filas[0].h : 0));
    cab(); p.head.forEach((h) => this.reg(h.t));
    filas.forEach((f) => { if (this.y + f.h > LIM_PIE) { this.nueva(); cab(); } const y = this.y;
      if (f.tot) { this.doc.setFillColor(K.celeste); this.doc.rect(M, y, W, f.h, 'F'); }
      f.cel.forEach((c, i) => { const x = xs[i] + pad;
        if (c.circulo) { this.doc.setFillColor(c.bg); this.doc.circle(x + 2.3, y + f.h / 2, 2.3, 'F'); this.t(c.circulo, x + 2.3, y + f.h / 2 + 1, { s: 6.8, b: true, c: '#FFFFFF', a: 'center' }); this.reg(c.circulo); }
        else if (c.chip) { const cw = this.w(c.chip, 6.6, true) + 4; this.doc.setFillColor(c.bg || K.soft); this.doc.roundedRect(x, y + f.h / 2 - 2.1, cw, 4.2, 1, 1, 'F'); this.t(c.chip, x + cw / 2, y + f.h / 2 + 0.9, { s: 6.6, b: true, c: c.fg || K.muted, a: 'center' }); this.reg(c.chip); }
        else { this.pintaLineas(c.L, x, y + pad + 2.75, sC, lh); this.reg(textoRuns(c.runs || [])); } });
      this.doc.setDrawColor(K.line); this.doc.setLineWidth(0.25); this.doc.line(M, y + f.h, M + W, y + f.h); this.y += f.h; });
    this.y += 3; };
  LP.altoDiag = function (p) { const iw = this.CW - 22, ih = iw * p.vh / p.vw; return ih + 9 + (p.ley && p.ley.length ? 4 : 0); };
  LP.diag = function (p) { const M = this.M, h = this.altoDiag(p), iw = this.CW - 22, ih = iw * p.vh / p.vw; this.cabe(h + 2); const y = this.y;
    this.doc.setDrawColor(K.line); this.doc.setLineWidth(0.3); this.doc.roundedRect(M, y, this.CW, h, 2.4, 2.4, 'S'); const im = this.img['svg:' + p.svg]; if (im) this.doc.addImage(im, 'PNG', M + 11, y + 3.5, iw, ih, undefined, 'FAST');
    if (p.ley && p.ley.length) { let x = M + 5; const yl = y + 3.5 + ih + 4.2; p.ley.forEach((l) => { if (l.c) { this.doc.setFillColor(l.c); this.doc.circle(x + 1, yl - 1, 1, 'F'); x += 3; } else x = Math.max(x + 3, M + this.CW - 4 - this.w(l.t, 6.6)); this.t(l.t, x, yl, { s: 6.6, c: K.muted }); x += this.w(l.t, 6.6) + 4.5; this.reg(l.t); }); }
    this.y = y + h + 3; };
  LP.tiempo = function (p) { const M = this.M, n = p.ev.length, cw = this.CW / n; this.cabe(18); const y = this.y + 3;
    this.doc.setDrawColor(K.line); this.doc.setLineWidth(0.45); this.doc.line(M + cw / 2 - cw * 0.35, y, M + this.CW - cw / 2 + cw * 0.35, y);
    p.ev.forEach((e, i) => { const cx = M + cw * i + cw / 2; this.doc.setFillColor('#FFFFFF'); this.doc.setDrawColor(this.ca); this.doc.setLineWidth(0.5); this.doc.circle(cx, y, 1.9, 'FD'); this.doc.setFillColor(this.ca); this.doc.circle(cx, y, 0.85, 'F');
      this.t(e.e, cx, y + 6.4, { s: 7.6, b: true, c: K.ink, a: 'center' }); this.t(e.f, cx, y + 10, { s: 7, c: K.muted, a: 'center' }); this.reg(e.e); this.reg(e.f); }); this.y = y + 12.8; };
  // Firmas: recuadros (atendió, inspeccionó y, si hay calificación, calificó con borde verde).
  LP.firmas = function (p) { const M = this.M, L = p.L, k = Math.min(3, Math.max(1, L.length)), gap = 4.2, cw = (this.CW - (Math.max(2, k) - 1) * gap) / Math.max(2, k); /* P-1f: hasta 3 por fila */
    for (let i0 = 0; i0 < L.length; i0 += k) { const fila = L.slice(i0, i0 + k), conF = fila.some((f) => f.firma && this.img['firma:' + f.firma]), h = conF ? 40 : 26, dy = conF ? 14 : 0; this.y += 0.6; this.cabe(h + 0.5);
      fila.forEach((f, i) => { const x = M + i * (cw + gap), verde = !!f.verde; this.doc.setDrawColor(verde ? K.verdeBorde : K.line); this.doc.setLineWidth(verde ? 0.45 : 0.3); this.doc.roundedRect(x, this.y, cw, h, 2.2, 2.2, 'S');
        this.t(f.cab, x + 4.4, this.y + 5.6, { s: 6.2, c: verde ? K.verdeBorde : K.muted, cs: 0.4 }); this.reg(f.cab, true);
        this.t(f.nombre, x + 4.4, this.y + 11.8, { s: 10, b: true, c: K.ink }); this.reg(f.nombre, !!f.disenoNombre);
        const fi = f.firma ? this.img['firma:' + f.firma] : null; if (fi) { const hh = 11.5, ww = Math.min(cw - 8.8, hh * fi.w / fi.h); this.doc.addImage(fi.data, 'PNG', x + 4.4, this.y + 13.6, ww, ww * fi.h / fi.w > hh ? hh : ww * fi.h / fi.w, undefined, 'FAST'); }
        this.lineasTxt(f.rol, cw - 8, 7.2).slice(0, 2).forEach((t, k2) => this.t(t, x + 4.4, this.y + 16.4 + dy + k2 * 3.3, { s: 7.2, c: K.muted })); this.reg(f.rol, !!f.disenoNombre);
        (f.extra ? [f.extra] : []).forEach((t) => { this.t(t, x + 4.4, this.y + 22.4 + dy, { s: 6.6, c: K.muted }); this.reg(t, true); }); });
      this.y += h + 4; } };
  // Galería: 3 por fila, cada foto con su número y su respaldo (fecha, hora, GPS con precisión y dispositivo).
  LP.fotos = function (p, porFila) { const M = this.M, n = porFila || 3, gap = 4, cw = (this.CW - (n - 1) * gap) / n, ih = cw * 0.75; /* P-1f: proporción real de la foto (4:3) */
    for (let i = 0; i < p.items.length; i += n) { const fila = p.items.slice(i, i + n), metas = fila.map((f) => this.lineas(f.meta, cw - 1, 6.2, K.muted).slice(0, 4)), nm = Math.max(1, ...metas.map((m) => m.length)), h = ih + 5.2 + nm * 2.85 + 2.4;
      this.cabe(h); fila.forEach((f, k) => { const x = M + k * (cw + gap); this.foto(f, x, this.y, cw, ih); const m = /^(F-\d+)(\s·\s)?(.*)$/.exec(f.cap) || [0, '', '', f.cap];
        let xx = x; if (m[1]) { this.t(m[1], xx, this.y + ih + 4, { s: 7.2, b: true, c: K.ink }); xx += this.w(m[1], 7.2, true); this.t(' · ' + m[3], xx, this.y + ih + 4, { s: 7.2, c: K.ink }); } else this.t(f.cap, xx, this.y + ih + 4, { s: 7.2, c: K.ink });
        this.reg(f.cap); this.pintaLineas(metas[k], x, this.y + ih + 7.2, 6.2, 2.85); this.reg(textoRuns(f.meta)); });
      this.y += h; } this.y += 1; };
  // Recorre las piezas de los bloques; sig: la pieza que sigue (para no dejar un capítulo solo al pie).
  LP.pieza = function (p, sig, o) { switch (p.k) { case 'cap': this.cap(p, sig); break; case 'sub': this.sub(p, sig); break; case 'datos': this.datos(p); break; case 'frase': this.frase(p); break;
    case 'hall': this.hall(p); break; case 'parr': this.parr(p); break; case 'caja': this.caja(p); break; case 'tabla': this.tabla(p); break; case 'diag': this.diag(p); break; case 'tiempo': this.tiempo(p); break;
    case 'firmas': this.firmas(o && o.firmas ? o.firmas(p) : p); break; case 'fotos': this.fotos(p, 3); break; default: break; } };
  LP.piezas = function (L, o) { L.forEach((p, i) => this.pieza(p, L[i + 1], o)); };
  // Salto de página del modelo: se respeta si la página ya tiene más de la mitad ocupada (la portada nueva ocupa más que la anterior).
  LP.salto = function () { if (this.y - this.top > (LIM_PIE - this.top) / 2) this.nueva(); };
  // Marca de agua y pie en todas las páginas.
  LP.cerrar = function (o) { const d = this.doc, np = d.getNumberOfPages(), M = this.M, R = PAG.W - M;
    for (let k = 1; k <= np; k++) { d.setPage(k);
      if (o.marca) { d.saveGraphicsState(); d.setGState(new d.GState({ opacity: 0.075 })); this.t(o.marca, 30, 250, { s: 118, b: true, c: K.selloPend, ang: 40 }); d.restoreGraphicsState(); }
      d.setDrawColor(K.line); d.setLineWidth(0.25); d.line(M, 286.6, R, 286.6);
      const izq = this.lineasTxt(o.pieIzq || '', this.CW - 26, 5.7); this.t(izq[0] || '', M, 290.2, { s: 5.7, c: K.ink }); if (o.pagina !== false) this.t('Página ' + k + ' de ' + np, R, 290.2, { s: 5.7, c: K.ink, a: 'right' }); }
    this.reg(o.pieIzq, true); if (o.marca) this.reg(o.marca, true); return np; };

  // Precarga de imágenes: logos, fotos (recortadas al recuadro), capas de daños y diagramas.
  async function precargar(L, items, extra) { const tareas = [];
    (extra || []).forEach((x) => { if (x && x.url) tareas.push(fotoData(x.url, x.aspecto || 1.45).then((r) => { if (r) L.img[x.url] = r; })); });
    items.forEach((p) => { if (p.k === 'firmas') (p.L || []).forEach((f) => { if (f.firma) tareas.push(logoData(f.firma).then((r) => { if (r) L.img['firma:' + f.firma] = r; })); }); /* P-1f: firma de quien atiende */
      if (p.k === 'fotos') p.items.forEach((f) => { if (f.url) tareas.push(fotoData(f.url, 4 / 3).then((r) => { if (r) L.img[f.url] = r; }));
      if (f.ov) tareas.push(svgData(f.ov, 232, 160, 2).then((r) => { if (r) L.img['ov:' + f.ov] = r; })); });
      if (p.k === 'diag') tareas.push(svgData(p.svg, p.vw, p.vh, 2).then((r) => { if (r) L.img['svg:' + p.svg] = r; })); });
    await Promise.all(tareas); }
  // Carga jsPDF si la pantalla no lo trae (la misma versión de la liquidación).
  const JSPDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  async function listo() { if (window.jspdf && window.jspdf.jsPDF) return true; const P = window.SiriusPdf; if (P && P.cargar) { await P.cargar(JSPDF); return !!(window.jspdf && window.jspdf.jsPDF); } return false; }
  function guardar(doc, nombre) { const u = URL.createObjectURL(doc.output('blob')), a = document.createElement('a'); a.href = u; a.download = nombre; a.style.display = 'none'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }

  window.SiriusPdfVector = { version: '1.1', K, san, piezas, resultadoDe, textosHtml, textoRuns, runsDe, lienzo: (o) => new Lienzo(o), precargar, fotoData, logoData, svgData, listo, guardar };
})();
