// SIRIUS · Motor común de la salida en PDF (etapa SV; extraído de CalificacionRG sin cambiar su resultado). Etapa P-6g-1d · DEC-248: liquidacion() dibuja
// con jsPDF el documento de la liquidación aprobada (descarga). Etapa P-1d · DEC-277: tres ajustes de dibujo (tarjetas en dos renglones sin recortar,
// la descripción del bien de Ramos Generales bajo el asegurado con «—» en Placa, y «Aprobado por» sin repetir la empresa); el resto de DEC-248 no cambia.
// Reglas: SIRIUS_SALIDA_RG.composicion (DEC-075, DEC-076). Flujo continuo en páginas A4 de 252 mm de alto útil, medido con el
// contenido real de la vista previa; el PDF se arma página por página desde esa misma vista previa (html2canvas + jsPDF).
// Lo usan CalificacionRG (Ramos Generales, 3 fotos por fila) y SalidaVeh (Vehículos, 2 fotos por fila).
(function () {
  // Parte un bloque según el tramo { i, a, z } que devolvió paginar(). porFila: fotos por fila del registro fotográfico.
  function slice(b, s, porFila) {
    const pf = porFila || 3;
    if (s.a == null) return b;
    if (b.isTable) return Object.assign({}, b, { rows: b.rows.slice(s.a, s.z), caption: s.a > 0 ? b.caption + ' (continuación)' : b.caption, nota: s.z >= b.rows.length ? b.nota : '' });
    if (b.isPhotos) return Object.assign({}, b, { items: b.items.slice(s.a * pf, s.z * pf) });
    if (b.isText) return Object.assign({}, b, { titulo: s.a > 0 ? '' : b.titulo, vh: (s.z - s.a) * 18 + 'px', mt: (-s.a * 18) + 'px' });
    return b;
  }

  // Reparte los bloques medidos (elementos [data-bi] dentro de d2) en páginas. blocks: lista semántica con isCover, isChap, brk,
  // isTable (split), isPhotos e isText. Solo hay saltos forzados en brk y después de una portada (isCover).
  // Devuelve { pages: [[{ i, a?, z? }]], qc } con el control de calidad de SIRIUS_SALIDA_RG.composicion.controlCalidad.
  function paginar(d2, blocks, opt) {
    const pf = (opt && opt.porFila) || 3;
    const els = Array.from(d2.querySelectorAll('[data-bi]')), probe = document.createElement('div'); probe.style.cssText = 'position:absolute;visibility:hidden;width:1px;height:252mm'; d2.appendChild(probe); const avail = probe.getBoundingClientRect().height; d2.removeChild(probe);
    // Escala de la vista previa (transform del diseñador «Documento PDF»; 1 en Generar informe): las medidas fijas en px se escalan igual.
    const K = d2.offsetWidth ? (Math.round(d2.getBoundingClientRect().width / d2.offsetWidth * 1000) / 1000 || 1) : 1, GAP = 14 * K, MM = avail / 252, pages = []; let cur = [], used = 0; const hh = (e) => e.getBoundingClientRect().height;
    const newPage = () => { if (cur.length) pages.push({ it: cur, used }); cur = []; used = 0; hs = []; }; let hs = [];
    const fits = (h) => used + (cur.length ? GAP : 0) + h <= avail + 0.5, add = (it, h) => { used += (cur.length ? GAP : 0) + h; cur.push(it); hs.push(h); };
    const rowsOf = (el, b) => { if (b.isTable) { const rs = Array.from(el.querySelectorAll('tbody tr')).map(hh); if (rs.length <= 6 && !b.split) return null; const t = el.querySelector('table'), th = hh(t); return { rows: rs, head: th - rs.reduce((a, x) => a + x, 0), tail: hh(el) - th, minH: 2, minT: 1 }; }
      if (b.isPhotos) { const li = Array.from(el.querySelectorAll('li')).map(hh), rs = []; for (let k = 0; k < li.length; k += pf) { let m = 0; for (let j = 0; j < pf; j++) m = Math.max(m, li[k + j] || 0); rs.push(m + 10 * K); } return { rows: rs, head: 0, tail: -10 * K, minH: 1, minT: 1 }; }
      if (b.isText) { const p = el.querySelector('p'), n = p ? Math.round(hh(p) / (18 * K)) : 0; if (n < 6) return null; return { rows: new Array(n).fill(18 * K), head: hh(el) - hh(p), tail: 0, minH: 3, minT: 3 }; } return null; };
    const minH = (el, b) => { const r = rowsOf(el, b); return r ? r.head + r.rows.slice(0, r.minH).reduce((a, x) => a + x, 0) : hh(el); };
    els.forEach((el, ix) => { const i = +el.getAttribute('data-bi'), b = blocks[i] || {}, h = hh(el);
      if (b.brk) newPage();
      if (b.isChap) { const nx = els[ix + 1], nb = nx ? (blocks[+nx.getAttribute('data-bi')] || {}) : {}, remain = avail - used - (cur.length ? GAP : 0); if (cur.length && (remain < 40 * MM || h + (nx ? GAP + minH(nx, nb) : 0) > remain)) newPage(); }
      // Etapa 12a · un bloque con conAnterior (las firmas) no queda solo en una página: si no cabe, baja junto con el bloque anterior.
      if (b.conAnterior && !fits(h) && cur.length > 1) { const pit = cur[cur.length - 1], ph = hs[hs.length - 1]; if (ph + GAP + h <= avail + 0.5) { cur.pop(); hs.pop(); used -= ph + GAP; newPage(); add(pit, ph); add({ i }, h); if (b.isCover) newPage(); return; } }
      if (fits(h)) add({ i }, h);
      else { const r = rowsOf(el, b);
        if (r) { const n = r.rows.length, sm = (x, y) => r.rows.slice(x, y).reduce((a, v) => a + v, 0); let k = 0;
          while (k < n) { const room = avail - used - (cur.length ? GAP : 0) - r.head; let z = k; while (z < n && sm(k, z + 1) <= room + 0.5) z++; if (z < n && n - z < r.minT && n - r.minT > k) z = n - r.minT;
            if (z - k < (k === 0 ? r.minH : 1) || (z < n && n - z < r.minT)) { if (cur.length) { newPage(); continue; } z = Math.min(n, k + Math.max(1, k === 0 ? r.minH : 1)); }
            const last = z >= n; add({ i, a: k, z }, r.head + sm(k, z) + (last ? r.tail : 0)); k = z; if (k < n) newPage(); } }
        else { if (cur.length) newPage(); add({ i }, h); } }
      if (b.isCover) newPage(); });
    newPage();
    const FR = pages.map(p => (avail - p.used) / avail), brkNext = (k) => { const nx = pages[k + 1]; if (!nx) return true; const first = blocks[nx.it[0].i] || {}, lastB = blocks[pages[k].it[pages[k].it.length - 1].i] || {}; return !!first.brk || !!lastB.isCover; };
    let mx = 0, mxk = 0; FR.forEach((x, k) => { if (x > mx) { mx = x; mxk = k; } });
    const viol = FR.map((x, k) => k < pages.length - 1 && x > 0.30 && !brkNext(k) ? k + 1 : 0).filter(Boolean), tit = pages.map((p, k) => { const lb = blocks[p.it[p.it.length - 1].i] || {}; return lb.isChap && !p.it[p.it.length - 1].a ? k + 1 : 0; }).filter(Boolean);
    const qc = { paginas: pages.length, maxLibre: Math.round(mx * 1000) / 10, paginaMaxLibre: mxk + 1, libres: FR.map(x => Math.round(x * 1000) / 10), excedidas: viol, terminanEnTitulo: tit };
    return { pages: pages.map(p => p.it), qc };
  }

  // Espera a que carguen las fuentes y a que el navegador pinte antes de medir.
  function esperar(fn) { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(fn, 80)); }

  function disponible() { return !!(window.html2canvas && window.jspdf && window.jspdf.jsPDF); }

  // Captura cada página A4 (article) tal cual se ve y arma el PDF. onPage(k) se llama después de cada página. Devuelve el jsPDF.
  async function capturar(els, onPage) {
    const H2C = window.html2canvas, JS = window.jspdf.jsPDF, tot = els.length;
    const pdf = new JS({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    for (let k = 0; k < tot; k++) { const cv = await H2C(els[k], { scale: 2, backgroundColor: '#FFFFFF', useCORS: true, logging: false }); if (k) pdf.addPage('a4', 'portrait'); pdf.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297); if (onPage) onPage(k + 1); }
    return pdf;
  }

  // Texto del control de calidad, igual al de Ramos Generales.
  function qcTexto(qc) { return qc.paginas + ' páginas A4 · mayor espacio libre ' + String(qc.maxLibre).replace('.', ',') + ' % (página ' + qc.paginaMaxLibre + ')' + (qc.excedidas.length ? ' · más de 30 % libre en la página ' + qc.excedidas.join(', ') : '') + (qc.terminanEnTitulo.length ? ' · termina en título la página ' + qc.terminanEnTitulo.join(', ') : ''); }

  // Carga un script una sola vez, bajo demanda (p. ej. JSZip).
  const cargas = {};
  function cargar(src) { if (!cargas[src]) cargas[src] = new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = () => ok(); s.onerror = () => { delete cargas[src]; ko(new Error('carga')); }; document.head.appendChild(s); }); return cargas[src]; }


  // ---------- DEC-248 · Documento PDF de la liquidación aprobada (etapa P-6g-1d): se dibuja con jsPDF (texto y formas, no captura de pantalla) ----------
  // datos: SiriusLiqProceso.documentoPdf(id). Encabezado claro con el logo de SIRIUS (assets/sirius-logo-claro.png), sello «APROBADA», marca de agua
  // «APROBADO» en diagonal en todas las páginas, tarjetas, barra de composición del subtotal, tabla con franja por estado del caso y encabezado repetido,
  // cierre con subtotal aprobado, IVA y total informativos, «Presentado por» y «Aprobado por», y pie con el código de verificación y «Página N de M».
  const JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  const C = { navy: [1, 30, 65], navy2: [24, 49, 84], azul: [0, 51, 161], cian: [0, 174, 239], cianClaro: [233, 248, 253], teal: [79, 132, 136], oro: [201, 154, 6], verde: [76, 140, 30], rojo: [158, 27, 14], gris: [92, 100, 112], grisClaro: [218, 218, 218], fila: [246, 249, 253], blanco: [255, 255, 255], texto: [36, 36, 36] };
  const imagenUrl = (src) => fetch(src).then((r) => r.blob()).then((b) => new Promise((ok) => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(b); })).catch(() => null);
  const n2 = (x) => (x == null ? '—' : Number(x).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const usd = (x) => 'USD ' + n2(x);
  const fechaTxt = (iso) => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(iso || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : '—'; };
  const horaTxt = (iso) => { const m = /T(\d\d:\d\d)/.exec(String(iso || '')); return m ? m[1] : ''; };
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const fechaLarga = (iso) => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(iso || '')); return m ? m[3] + ' de ' + MESES[Number(m[2]) - 1] + ' de ' + m[1] : ''; };
  async function liquidacion(d, opt) {
    opt = opt || {}; if (!(window.jspdf && window.jspdf.jsPDF)) await cargar(JSPDF_URL); const JS = window.jspdf.jsPDF, logo = await imagenUrl(opt.logo || 'assets/sirius-logo-claro.png'), simbolo = await imagenUrl('assets/sirius-simbolo.png');
    const doc = new JS({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }), W = 210, M = 14, R = W - M, BOT = 279;
    doc.setProperties({ title: d.titulo + ' · v' + d.version, subject: 'Liquidación ' + d.estado.toLowerCase(), author: 'SIRIUS · Aseguradora del Sur', creator: 'SIRIUS' });
    const col = (k, kind) => (kind === 'f' ? doc.setFillColor : kind === 'd' ? doc.setDrawColor : doc.setTextColor).apply(doc, C[k] || k);
    const txt = (s, x, y, o) => { o = o || {}; doc.setFont('helvetica', o.b ? 'bold' : 'normal'); doc.setFontSize(o.s || 8); col(o.c || 'texto'); doc.text(String(s == null ? '' : s), x, y, { align: o.a || 'left', maxWidth: o.w }); };
    const corta = (s, w, size, b) => { doc.setFont('helvetica', b ? 'bold' : 'normal'); doc.setFontSize(size); s = String(s == null ? '' : s); if (doc.getTextWidth(s) <= w) return s; while (s.length > 1 && doc.getTextWidth(s + '…') > w) s = s.slice(0, -1); return s + '…'; };
    const verde = d.estado === 'Aprobada' || d.estado === 'Facturada' || d.estado === 'Pagada';
    // Tabla: columnas (x, ancho, alineación).
    const T = [['N°', 20.5, 0, 'right'], ['Caso', 22.5, 0], ['Orden', 33, 24], ['Asegurado', 58, 42], ['Placa', 101.5, 16], ['Tipo', 118.5, 15], ['Ciudad', 136.5, 12], ['Km', 152, 0, 'right'], ['Base', 165, 0, 'right'], ['Movil.', 178, 0, 'right'], ['Subtotal', R - 1.5, 0, 'right']];
    const encTabla = (y) => { col('navy2', 'f'); doc.roundedRect(M, y, R - M, 6, 1.2, 1.2, 'F'); T.forEach((c) => txt(c[0], c[1], y + 4.1, { s: 6.8, b: true, c: 'blanco', a: c[3] || 'left' })); return y + 6; };
    const cabCompacta = () => { col('cianClaro', 'f'); doc.rect(0, 0, W, 17, 'F'); if (simbolo) doc.addImage(simbolo, 'PNG', M, 4, 8.2, 9); txt(d.titulo + ' · v' + d.version, M + 11, 8.5, { s: 9.5, b: true, c: 'navy' }); txt((d.proveedor.razon || d.proveedor.nombre).toUpperCase() + ' · período ' + fechaTxt(d.periodo.desde) + ' – ' + fechaTxt(d.periodo.hasta), M + 11, 12.8, { s: 6.8, c: 'gris' }); if (verde) txt(d.estado.toUpperCase(), R, 10, { s: 8, b: true, c: 'verde', a: 'right' }); return 23; };
    // ---------- Página 1: encabezado claro, título, sello y tarjetas ----------
    col('cianClaro', 'f'); doc.rect(0, 0, W, 62, 'F'); col('blanco', 'f'); doc.circle(181, 4, 54, 'F');     if (logo) doc.addImage(logo, 'PNG', M, 6, 33.6, 19); txt('by aseguradora del sur', M + 17.5, 26.5, { s: 7.5, c: 'gris' });
    txt(d.aseguradora.nombre, R, 13, { s: 9.5, b: true, c: 'navy', a: 'right' }); txt(d.aseguradora.proceso, R, 17.5, { s: 7.8, c: 'gris', a: 'right' }); txt(d.aseguradora.ciudad + ', ' + fechaLarga(d.aseguradora.fecha), R, 21.5, { s: 7.8, c: 'gris', a: 'right' });
    txt('LIQUIDACIÓN DE HONORARIOS DE INSPECCIÓN', M, 34, { s: 10, c: 'azul' }); txt(d.numero, M, 46, { s: 30, b: true, c: 'navy' }); doc.setFontSize(30); doc.setFont('helvetica', 'bold'); const wn = doc.getTextWidth(d.numero); txt('versión ' + d.version, M + wn + 5, 45.5, { s: 14, c: 'azul' });
    txt('Inspecciones realizadas en el período ' + fechaTxt(d.periodo.desde) + ' – ' + fechaTxt(d.periodo.hasta), M, 53, { s: 8.5, c: 'gris' });
    // Sello «APROBADA» con fecha, hora y versión.
    col('verde', 'd'); doc.setLineWidth(0.7); doc.circle(178, 44.5, 16.5, 'S'); doc.setLineWidth(0.25); doc.circle(178, 44.5, 14.6, 'S');
    txt('SIRIUS · v' + d.version, 178, 39.5, { s: 6.5, c: 'verde', a: 'center' }); txt('APROBADA', 178, 45.6, { s: 11.5, b: true, c: 'verde', a: 'center' }); txt(fechaTxt(d.aprobada.fecha) + ' · ' + horaTxt(d.aprobada.fecha), 178, 50, { s: 6.5, c: 'verde', a: 'center' });
    // Tarjetas.
    const cw = (R - M - 9) / 4, cy = 68, ch = 22, fz = (s) => s.length > 40 ? s.slice(0, 39) + '…' : s;
    const tarjeta = (k, et, val, sub, osc) => { const x = M + k * (cw + 3); if (osc) { col('navy', 'f'); doc.roundedRect(x, cy, cw, ch, 2, 2, 'F'); } else { col('grisClaro', 'd'); doc.setLineWidth(0.25); col('blanco', 'f'); doc.roundedRect(x, cy, cw, ch, 2, 2, 'FD'); }
      txt(et, x + 3.5, cy + 6, { s: 6.5, c: osc ? [201, 238, 251] : 'gris' }); txt(corta(val, cw - 7, 13, true), x + 3.5, cy + 13.6, { s: 13, b: true, c: osc ? 'blanco' : 'navy' }); const cs = osc ? [201, 238, 251] : 'gris'; doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); /* P-1d: si no cabe, dos renglones (en el « · » o donde corte), sin recortar */
      if (doc.getTextWidth(String(sub)) <= cw - 7) txt(sub, x + 3.5, cy + 18.6, { s: 6.5, c: cs });
      else { const pp = String(sub).split(' · '), l1 = pp.length > 1 ? pp[0] : doc.splitTextToSize(String(sub), cw - 7)[0], l2 = pp.length > 1 ? pp.slice(1).join(' · ') : String(sub).slice(l1.length).trim();
        txt(corta(l1, cw - 7, 6.5), x + 3.5, cy + 16.8, { s: 6.5, c: cs }); txt(corta(l2, cw - 7, 6.5), x + 3.5, cy + 19.8, { s: 6.5, c: cs }); } };
    const R0 = d.resumen;
    tarjeta(0, 'PROVEEDOR', d.proveedor.nombre, d.proveedor.razon + ' · RUC ' + d.proveedor.ruc); tarjeta(1, 'INSPECCIONES', String(R0.n), R0.porClase.map((c) => c.n + ' ' + c.nombre).join(' · '));
    tarjeta(2, 'FUERA DE CIUDAD BASE', String(R0.fuera.n), n2(R0.fuera.km).replace(/,00$/, ',0') + ' km · ' + usd(R0.fuera.valor)); tarjeta(3, 'SUBTOTAL A FACTURAR', usd(d.subtotal), 'sin IVA · lo que debe decir la factura', true);
    // Composición del subtotal.
    let y = 99; txt('Composición del subtotal', M, y, { s: 9, b: true, c: 'navy' }); y += 3;
    const cc = { liviano: 'cian', pesado: 'navy2', rg: 'teal', mov: 'oro' }, tot = R0.composicion.reduce((a, x) => a + x.valor, 0) || 1; let x0 = M;
    R0.composicion.forEach((x) => { const w = (R - M) * x.valor / tot; col(cc[x.id] || [79, 132, 136], 'f'); doc.rect(x0, y, w, 3.2, 'F'); x0 += w; }); y += 8;
    x0 = M; R0.composicion.forEach((x) => { col(cc[x.id] || [79, 132, 136], 'f'); doc.circle(x0 + 1.3, y - 1.1, 1.25, 'F'); const t = x.texto + ' ' + usd(x.valor) + ' (' + (x.valor / tot * 100).toFixed(1).replace('.', ',') + ' %)'; txt(t, x0 + 3.6, y, { s: 7.2, c: 'texto' }); doc.setFontSize(7.2); x0 += doc.getTextWidth(t) + 9; });
    y += 6; const LEY = [['Asegurable', 'verde'], ['Pendiente de calificación', 'oro'], ['No asegurable', 'rojo']]; txt('Franja de la fila = estado del caso en calificación (referencia):', M, y, { s: 6.8, c: 'gris' }); doc.setFontSize(6.8); x0 = M + doc.getTextWidth('Franja de la fila = estado del caso en calificación (referencia):') + 5;
    LEY.forEach((l) => { col(l[1], 'f'); doc.rect(x0, y - 2.6, 1, 3, 'F'); txt(l[0], x0 + 2.5, y, { s: 6.8, c: 'gris' }); x0 += doc.getTextWidth(l[0]) + 9; });
    // ---------- Tabla con el encabezado repetido en cada página ----------
    y = encTabla(y + 4); const RH = 4.8, franja = (q) => (q === 'No asegurable' ? 'rojo' : /^Pendiente/.test(q) ? 'oro' : 'verde');
    d.filas.forEach((r, i) => { const rh = r.rg ? 7.4 : RH; if (y + rh > BOT) { doc.addPage('a4', 'portrait'); y = encTabla(cabCompacta()); }
      if (i % 2) { col('fila', 'f'); doc.rect(M, y, R - M, rh, 'F'); } col(franja(r.calificacion), 'f'); doc.rect(M + 0.6, y + 0.6, 1, rh - 1.2, 'F'); const yb = y + 3.25;
      txt(r.n, T[0][1], yb, { s: 6.6, c: 'gris', a: 'right' }); txt(r.caso, T[1][1], yb, { s: 6.6 }); txt(corta(r.orden, T[2][2], 6.6), T[2][1], yb, { s: 6.6 }); txt(corta(r.asegurado, T[3][2], 6.6), T[3][1], yb, { s: 6.6 });
      if (r.rg) { txt(corta(r.placa, T[3][2], 5.6), T[3][1], yb + 2.8, { s: 5.6, c: 'gris' }); txt('—', T[4][1], yb, { s: 6.6, c: 'gris' }); } /* P-1d: el bien completo bajo el asegurado */
      else txt(corta(r.placa, T[4][2], 6.6, true), T[4][1], yb, { s: 6.6, b: true, c: 'navy' });
      // Ramos Generales: nivel y horas en la primera línea y equipos en la segunda, en lugar de la clase.
      if (r.rg) { const pz = String(r.clase).split(' · '); txt(corta(pz[0] + ' ' + (pz[1] || ''), T[6][1] - T[5][1] - 0.5, 5.6), T[5][1], yb, { s: 5.6 }); txt(corta(pz.slice(2).join(' · ').replace(' eq', ' equipos'), T[6][1] - T[5][1] - 0.5, 5.6), T[5][1], yb + 2.8, { s: 5.6, c: 'gris' }); } else txt(corta(r.clase, T[5][2], 6.6), T[5][1], yb, { s: 6.6 });
      txt(r.enBase ? 'Base' : 'No base', T[6][1], yb, { s: 6.6, c: r.enBase ? 'gris' : 'oro' });
      txt(r.km ? n2(r.km).replace(/0$/, '') : '—', T[7][1], yb, { s: 6.6, c: r.km ? 'texto' : 'gris', a: 'right' }); txt(n2(r.base) + (r.ajuste ? '*' : ''), T[8][1], yb, { s: 6.6, a: 'right' }); txt(r.mov ? n2(r.mov) : r.porValorar ? 'por valorar' : '—', T[9][1], yb, { s: r.porValorar ? 5.6 : 6.6, c: r.mov ? 'texto' : 'gris', a: 'right' }); txt(n2(r.subtotal), T[10][1], yb, { s: 6.6, b: true, c: 'navy', a: 'right' });
      y += rh; });
    col('grisClaro', 'd'); doc.setLineWidth(0.2); doc.line(M, y, R, y);
    // ---------- Cierre: subtotal aprobado, IVA y total informativos, presentado y aprobado ----------
    if (y + 72 > BOT) { doc.addPage('a4', 'portrait'); y = cabCompacta(); } else y += 9;
    const ajustes = d.filas.some((r) => r.ajuste);
    [R0.n + ' inspecciones · ' + R0.casos + ' casos' + (d.contrato ? ' · ' + d.contrato : ''), d.tarifa ? 'Tarifa: ' + d.tarifa : '', d.valorKm != null ? 'Movilización fuera de ciudad base: ' + usd(d.valorKm) + ' por km' : 'Movilización fuera de ciudad base: km por valorar', ajustes ? '* La base incluye el ajuste ± con su comentario.' : '', 'La factura se emite por el subtotal aprobado;', 'SIRIUS la valida con su clave de acceso del SRI.'].filter(Boolean).forEach((t, k) => txt(t, M, y + 2 + k * 4.4, { s: 7.2, c: 'gris' }));
    const bx = 120, bw = R - bx; col('cianClaro', 'f'); doc.roundedRect(bx, y - 3, bw, 33, 2, 2, 'F');
    txt('IVA ' + d.tasa + ' % (informativo)', bx + 4, y + 3, { s: 7.5, c: 'gris' }); txt(usd(d.iva), R - 4, y + 3, { s: 7.5, c: 'gris', a: 'right' }); txt('Total con IVA (informativo)', bx + 4, y + 8.5, { s: 7.5, c: 'gris' }); txt(usd(d.total), R - 4, y + 8.5, { s: 7.5, c: 'gris', a: 'right' });
    col('grisClaro', 'd'); doc.line(bx + 4, y + 12, R - 4, y + 12); txt('SUBTOTAL APROBADO', bx + 4, y + 18, { s: 8, b: true, c: 'navy' }); txt(usd(d.subtotal), R - 4, y + 25, { s: 17, b: true, c: 'navy', a: 'right' });
    y += 40; const pw = (R - M - 6) / 2, ph = 24;
    const caja = (x, et, nom, l2, l3, ok) => { doc.setLineWidth(ok ? 0.5 : 0.25); col(ok ? 'verde' : 'grisClaro', 'd'); col('blanco', 'f'); doc.roundedRect(x, y, pw, ph, 2, 2, 'FD'); txt(et, x + 4, y + 6, { s: 6.5, c: ok ? 'verde' : 'gris' }); txt(corta(nom, pw - 8, 10, true), x + 4, y + 12, { s: 10, b: true, c: 'navy' }); txt(corta(l2, pw - 8, 6.8), x + 4, y + 16.5, { s: 6.8, c: 'gris' }); txt(corta(l3, pw - 8, 6.8), x + 4, y + 20.5, { s: 6.8, c: 'gris' }); };
    caja(M, 'PRESENTADO POR', d.proveedor.razon, (d.proveedor.tipo === 'agencia' ? 'Proveedor de inspecciones' : 'Inspector independiente') + ' · RUC ' + d.proveedor.ruc, 'Enviada en SIRIUS el ' + fechaTxt(d.presentado.fecha) + ' · ' + horaTxt(d.presentado.fecha) + ' · v' + d.version + (d.presentado.por ? ' · ' + d.presentado.por : ''));
    caja(M + pw + 6, 'APROBADO POR', d.aprobada.por || '—', [d.aprobada.cargo, 'Aseguradora del Sur C.A.'].filter((t) => t && t !== 'Aseguradora del Sur C.A.').concat('Aseguradora del Sur C.A.').join(' · '), /* P-1d: sin repetir la empresa */ 'Aprobada en SIRIUS el ' + fechaTxt(d.aprobada.fecha) + ' · ' + horaTxt(d.aprobada.fecha) + ' · v' + d.version, true);
    // ---------- Marca de agua y pie en todas las páginas ----------
    const np = doc.getNumberOfPages();
    for (let k = 1; k <= np; k++) { doc.setPage(k);
      if (verde) { doc.saveGraphicsState(); doc.setGState(new doc.GState({ opacity: 0.06 })); doc.setFont('helvetica', 'bold'); doc.setFontSize(118); col('verde'); doc.text('APROBADO', 24, 262, { angle: 50 }); doc.restoreGraphicsState(); }
      col('grisClaro', 'd'); doc.setLineWidth(0.2); doc.line(M, 285, R, 285); txt('Documento generado por SIRIUS · Aseguradora del Sur C.A. · Código de verificación ' + d.codigo, M, 289.5, { s: 6.5, c: 'gris' }); txt('Página ' + k + ' de ' + np, R, 289.5, { s: 6.5, c: 'gris', a: 'right' }); }
    if (opt.guardar !== false) { const u = URL.createObjectURL(doc.output('blob')), a = document.createElement('a'); a.href = u; a.download = d.archivo; a.style.display = 'none'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
    return { doc, paginas: np, archivo: d.archivo }; }

  window.SiriusPdf = { slice, paginar, esperar, disponible, capturar, qcTexto, cargar, liquidacion };
})();
