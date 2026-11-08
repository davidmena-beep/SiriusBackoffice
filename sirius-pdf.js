// SIRIUS · Motor común de la salida en PDF (etapa SV; extraído de CalificacionRG sin cambiar su resultado).
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

  window.SiriusPdf = { slice, paginar, esperar, disponible, capturar, qcTexto, cargar };
})();
