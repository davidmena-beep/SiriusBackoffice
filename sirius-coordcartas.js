// SIRIUS · Pestaña Coordinación en cartas (etapa G-4 · maqueta aprobada) · v1.0
// Una pila por riesgo (o por visita): arriba la visita vigente con sus datos y acciones; detrás asoman hasta dos capas con las
// visitas anteriores del mismo riesgo. «N visitas anteriores» las despliega en una línea de tiempo (de la más nueva a la más
// antigua); cada una es un botón que abre su resumen, sin acciones ni enlaces; «Volver a apilar» las recoge.
// El estado de cada carta es el de la visita (G-3e): lo arma Coordinacion.dc.html (cartas[].c) con las mismas acciones de siempre.
// Props: datos = { visitas: [carta], riesgos: [{ id, label }], ro, coordinar: { fn, why } | null, coordinarRiesgo(id) | null,
//                  inicial: { agrupar: 'riesgo' | 'visita', abierto: clave de pila | null, filtro: id de riesgo | '' } }
// carta = { id, n, mod, estado, estadoTxt, tone, origen, grande, filas: [{ label, value, link: { label, fn } }],
//           acciones: [{ label, tipo: 'sec' | 'pri' | 'link' | 'peligro', fn, why }], enlace: props de SiriusEnlaceTarjeta | null,
//           riesgos: [ids], anterior: true si ya no es vigente (Cancelada, Reagendada, Cerrada sin inspección),
//           res: { cab, estado, linea, lugarCorto, detalle: [{ label, value }] }, nota }
(function () {
  if (window.SiriusCoordCartas) return;
  const R = () => window.React, h = (...a) => R().createElement(...a);
  const TONO = { success: ['#E3F4E8', '#1D6B36'], brand: ['#E8F0FE', '#0B3A8C'], warning: ['#FFF2D6', '#7A4F0E'], danger: ['#FDE7E7', '#9B1C1C'], neutral: ['#EEF0F3', '#3C4552'] };
  let cssPuesto = false;
  function css() {
    if (cssPuesto) return; cssPuesto = true;
    const s = document.createElement('style'); s.setAttribute('data-cc-css', '');
    s.textContent = [
      '.cc{display:flex;flex-direction:column;gap:20px;min-width:0;font-family:var(--font-brand)}',
      '.cc-barra{display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px}',
      '.cc-lbl{font-size:14px;font-weight:600;color:var(--text-body)}',
      '.cc-seg{display:inline-flex;gap:2px;padding:3px;border:1px solid var(--border-default,#C9D0DA);border-radius:10px;background:#fff}',
      '.cc-seg button{min-height:36px;padding:0 16px;border:0;border-radius:7px;background:transparent;font:600 14px var(--font-brand);color:var(--text-body);cursor:pointer}',
      '.cc-seg button:focus-visible{outline:2px solid var(--blue-700,#0033A1);outline-offset:2px}',
      '.cc-seg button[aria-checked="true"]{background:var(--blue-100,#F1F5FF);color:var(--blue-700,#0033A1);box-shadow:inset 0 0 0 2px var(--blue-700,#0033A1)}',
      '.cc-chip{min-height:40px;padding:0 16px;border:1px solid var(--border-default,#C9D0DA);border-radius:999px;background:#fff;font:600 14px var(--font-brand);color:var(--text-strong);cursor:pointer;white-space:nowrap}',
      '.cc-chip[aria-pressed="true"]{background:var(--blue-100,#F1F5FF);border-color:var(--blue-700,#0033A1);color:var(--blue-700,#0033A1);box-shadow:inset 0 0 0 1px var(--blue-700,#0033A1)}',
      '.cc-pri{min-height:44px;padding:0 22px;border:0;border-radius:10px;background:var(--blue-700,#0033A1);color:#fff;font:700 15px var(--font-brand);cursor:pointer;white-space:nowrap}',
      '.cc-pri[aria-disabled="true"]{background:var(--neutral-300,#C9D0DA);color:var(--neutral-700,#3C4552);cursor:not-allowed}',
      '.cc-sec{min-height:40px;padding:0 14px;border:1.5px solid var(--blue-700,#0033A1);border-radius:10px;background:#fff;color:var(--blue-700,#0033A1);font:700 14px var(--font-brand);cursor:pointer;white-space:nowrap}',
      '.cc-sec[aria-disabled="true"],.cc-link[aria-disabled="true"],.cc-pel[aria-disabled="true"]{border-color:var(--neutral-300,#C9D0DA);color:var(--neutral-500,#6B7380);cursor:not-allowed}',
      '.cc-link{min-height:40px;padding:0 8px;border:0;background:none;color:var(--blue-700,#0033A1);font:700 14px var(--font-brand);cursor:pointer;white-space:nowrap}',
      '.cc-pel{min-height:40px;padding:0 8px;border:0;background:none;color:var(--color-danger,#B3261E);font:700 14px var(--font-brand);cursor:pointer;white-space:nowrap}',
      '.cc-ul{padding:0;border:0;background:none;color:var(--blue-700,#0033A1);font:600 inherit var(--font-brand);font-size:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}',
      '.cc button:focus-visible,.cc-carta:focus-visible,.cc-ant:focus-visible{outline:3px solid var(--color-brand,#00A3E0);outline-offset:2px}',
      '.cc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(440px,100%),1fr));gap:28px 24px;align-items:start}',
      '.cc-pila{display:flex;flex-direction:column;gap:10px;min-width:0;max-width:900px}',
      '.cc-tit{margin:0;font-size:17px;font-weight:700;color:var(--text-strong)}',
      '.cc-mazo{position:relative;display:flex;flex-direction:column}',
      '.cc-carta{position:relative;z-index:3;display:flex;flex-direction:column;gap:14px;padding:20px 20px;border:1px solid var(--border-subtle,#DDE2E8);border-radius:16px;background:#fff;box-shadow:0 6px 18px rgba(1,30,65,.10);min-width:0}',
      '.cc-capa{position:relative;height:16px;margin-top:-6px;border:1px solid var(--border-subtle,#DDE2E8);border-top:0;border-radius:0 0 14px 14px;background:#F4F6F9}',
      '.cc-capa.c1{z-index:2;margin-left:12px;margin-right:12px}.cc-capa.c2{z-index:1;margin-left:24px;margin-right:24px;background:#EDF0F4}',
      '.cc-mas{position:relative;z-index:4;align-self:center;margin-top:-16px;display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 16px;border:1px solid var(--border-subtle,#DDE2E8);border-radius:999px;background:#fff;box-shadow:0 2px 6px rgba(1,30,65,.12);font:700 13px var(--font-brand);color:var(--blue-800,#183154);cursor:pointer}',
      '.cc-cab{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px}',
      '.cc-n{height:28px;min-width:36px;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:var(--blue-900,#011E41);color:#fff;font-size:14px;font-weight:700}',
      '.cc-n.ant{background:#5B6573}',
      '.cc-mod{font-size:18px;font-weight:600;color:var(--text-strong)}',
      '.cc-est{display:inline-flex;align-items:center;gap:6px;min-height:24px;padding:0 10px;border-radius:999px;font-size:13px;font-weight:700;white-space:nowrap}',
      '.cc-est i{width:7px;height:7px;border-radius:50%;background:currentColor;flex:none}',
      '.cc-ori{display:inline-flex;align-items:center;min-height:24px;padding:0 10px;border-radius:999px;background:var(--blue-100,#F1F5FF);color:var(--blue-700,#0033A1);font-size:13px;font-weight:600;white-space:nowrap}',
      '.cc-grande{margin:0;font-size:22px;font-weight:700;color:var(--text-strong);line-height:1.2}',
      '.cc-dl{margin:0;display:grid;grid-template-columns:max-content minmax(0,1fr);gap:8px 18px;font-size:15px}',
      '.cc-dl dt{font-weight:700;color:var(--text-body)}.cc-dl dd{margin:0;color:var(--text-strong);overflow-wrap:anywhere}',
      '.cc-acc{display:flex;flex-wrap:wrap;align-items:center;gap:6px}',
      '.cc-why{flex:1 1 100%;font-size:13px;color:var(--text-muted)}',
      '.cc-nota{font-size:13px;color:var(--text-body)}',
      '.cc-sin{display:flex;flex-direction:column;gap:12px;padding:20px 22px;border:1.5px dashed var(--border-default,#C9D0DA);border-radius:16px;background:#fff}',
      '.cc-vacio{margin:0;font-size:13px;color:var(--text-muted)}',
      '.cc-hist{grid-column:1 / -1;display:flex;flex-direction:column;gap:14px;max-width:960px;min-width:0}',
      '.cc-hcab{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}',
      '.cc-vig{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:14px 18px;border:1.5px solid var(--color-brand,#00A3E0);border-radius:14px;background:#fff;box-shadow:0 4px 12px rgba(1,30,65,.08)}',
      '.cc-vig .cc-der{margin-left:auto;font-size:14px;color:var(--text-body)}',
      '.cc-tl{list-style:none;margin:0 0 0 14px;padding:0 0 0 22px;border-left:2px solid var(--border-subtle,#DDE2E8);display:flex;flex-direction:column;gap:12px}',
      '.cc-ant{width:100%;display:flex;flex-direction:column;gap:6px;padding:14px 18px;border:1px solid var(--border-subtle,#DDE2E8);border-radius:14px;background:#fff;text-align:left;font-family:var(--font-brand);cursor:pointer}',
      '.cc-ant[aria-expanded="true"]{border-color:var(--blue-700,#0033A1);box-shadow:inset 0 0 0 1px var(--blue-700,#0033A1)}',
      '.cc-ant .cc-l1{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;font-size:15px;font-weight:700;color:var(--text-strong)}',
      '.cc-ant .cc-l2{font-size:13px;color:var(--text-body)}',
      '.cc-det{margin:8px 0 0;padding:12px 16px;border-radius:10px;background:var(--surface-subtle,#F5F7FA)}',
      '@media (max-width:720px){.cc-dl{grid-template-columns:1fr}.cc-dl dt{margin-top:4px}.cc-vig .cc-der{margin-left:0}}',
    ].join('');
    document.head.appendChild(s);
  }

  // Estado con texto y punto: el color nunca es la única señal.
  const Estado = (txt, tono) => { const t = TONO[tono] || TONO.neutral; return h('span', { className: 'cc-est', style: { background: t[0], color: t[1] } }, h('i', { 'aria-hidden': 'true' }), txt); };
  function Boton(a, k) {
    const cls = { sec: 'cc-sec', pri: 'cc-pri', link: 'cc-link', peligro: 'cc-pel' }[a.tipo] || 'cc-sec';
    return h('button', { key: k, type: 'button', className: cls, 'aria-disabled': a.why ? 'true' : undefined, title: a.why || undefined, 'aria-label': a.aria || undefined,
      onClick: () => { if (!a.why && a.fn) a.fn(); } }, a.label);
  }
  const Filas = (filas) => filas && filas.length ? h('dl', { className: 'cc-dl' }, filas.map((f, i) => [h('dt', { key: 'dt' + i }, f.label), h('dd', { key: 'dd' + i, 'data-cc-campo': f.label }, f.value, f.link ? [' · ', h('button', { key: 'l', type: 'button', className: 'cc-ul', onClick: f.link.fn }, f.link.label)] : null)])) : null;

  // AV-1: bajo un riesgo (p.rid) de una visita con el avance por vehículo (c.porRiesgo[rid]), la carta muestra el avance de ESE vehículo: su estado con «N de M fotos» y su «Último avance»,
  // y oculta «Por vehículo». Sin rid (Agrupar por: Visita) o sin porRiesgo, queda el total de la visita.
  const delRiesgo = (c, rid) => rid && c.porRiesgo ? c.porRiesgo[rid] || null : null;
  function Carta(p) { const c = p.c, ET = window.SiriusEnlaceTarjeta, pr = delRiesgo(c, p.rid), est = pr ? pr.estadoTxt : c.estadoTxt;
    const why = (c.acciones || []).filter((a) => a.why).map((a) => a.label + ': ' + a.why);
    const filas = pr ? (c.filas || []).filter((f) => f.label !== 'Por vehículo').map((f) => f.label === 'Último avance' ? Object.assign({}, f, { value: pr.ultimo || '—' }) : f) : c.filas;
    return h('article', { className: 'cc-carta', tabIndex: 0, 'data-cc-carta': c.id, 'aria-label': 'Visita ' + c.id + ' · ' + c.mod + ' · ' + est + (c.origen ? ' · ' + c.origen : '') + (c.grande ? ' · ' + c.grande : '') },
      h('div', { className: 'cc-cab' }, h('span', { className: 'cc-n' }, c.id), h('span', { className: 'cc-mod' }, c.mod), Estado(est, c.tone), c.origen ? h('span', { className: 'cc-ori' }, c.origen) : null),
      c.grande ? h('p', { className: 'cc-grande' }, c.grande) : null,
      Filas(filas),
      c.enlace && ET ? h(ET, c.enlace) : null,
      c.nota ? h('span', { className: 'cc-nota' }, c.nota) : null,
      (c.acciones || []).length && !p.ro ? h('div', { className: 'cc-acc' }, c.acciones.map(Boton), why.length ? h('span', { className: 'cc-why' }, why.join(' · ')) : null) : null);
  }

  function SinVisita(p) { return h('article', { className: 'cc-sin', tabIndex: 0, 'data-cc-sinvisita': p.rid || '', 'aria-label': 'Sin visita' + (p.titulo ? ' · ' + p.titulo : '') },
    h('div', { className: 'cc-cab' }, Estado('Sin visita', 'neutral')),
    h('span', { style: { fontSize: 15, color: 'var(--text-body)' } }, p.anteriores ? 'Ninguna visita abierta: las anteriores terminaron.' : 'Todavía no tiene una visita.'),
    p.fn && !p.ro ? h('div', { className: 'cc-acc' }, Boton({ label: 'Coordinar visita', tipo: 'pri', fn: p.fn, why: p.why || '' }, 'cv')) : null); }

  // Una pila: carta vigente (o «Sin visita»), capas detrás y el botón «N visitas anteriores».
  function Pila(p) { const g = p.g, n = g.anteriores.length, capas = Math.min(2, n);
    return h('section', { className: 'cc-pila', 'aria-labelledby': 'cc-t-' + g.key, 'data-cc-pila': g.key },
      h('h3', { id: 'cc-t-' + g.key, className: 'cc-tit' }, g.titulo),
      h('div', { className: 'cc-mazo' },
        g.top ? h(Carta, { c: g.top, ro: p.ro, rid: g.rid }) : h(SinVisita, { rid: g.rid, titulo: g.titulo, anteriores: n > 0, fn: g.coordinar, why: p.whyCoord, ro: p.ro }),
        capas >= 1 ? h('div', { className: 'cc-capa c1', 'aria-hidden': 'true' }) : null, capas >= 2 ? h('div', { className: 'cc-capa c2', 'aria-hidden': 'true' }) : null,
        n ? h('button', { type: 'button', className: 'cc-mas', 'aria-expanded': 'false', 'aria-controls': 'cc-h-' + g.key, 'data-cc-desplegar': g.key, onClick: () => p.abrir(g.key) },
          n === 1 ? '1 visita anterior' : n + ' visitas anteriores', h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, 'aria-hidden': 'true' }, h('path', { d: 'M6 9l6 6 6-6' }))) : null),
      n ? null : h('p', { className: 'cc-vacio' }, 'Sin visitas anteriores.'),
      (g.otras || []).map((o) => h('div', { key: o.id, style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('span', { className: 'cc-vacio' }, 'Otra visita abierta de este riesgo'), h(Carta, { c: o, ro: p.ro, rid: g.rid })))); }

  // Las anteriores desplegadas: la vigente arriba y la línea de tiempo de la más nueva a la más antigua.
  function Historia(p) { const g = p.g, [sel, setSel] = R().useState(p.sel || ''), ref = R().useRef(null);
    R().useEffect(() => { const b = ref.current; if (b && p.foco) b.focus(); }, []);
    const total = g.anteriores.length + (g.top ? 1 : 0), t = g.top;
    return h('section', { id: 'cc-h-' + g.key, className: 'cc-hist', 'aria-labelledby': 'cc-ht-' + g.key, 'data-cc-historia': g.key },
      h('div', { className: 'cc-hcab' }, h('h3', { id: 'cc-ht-' + g.key, className: 'cc-tit' }, g.corto + ' · ' + total + (total === 1 ? ' visita' : ' visitas')),
        h('button', { ref, type: 'button', className: 'cc-chip', 'aria-expanded': 'true', 'aria-controls': 'cc-h-' + g.key, 'data-cc-apilar': g.key, onClick: p.cerrar, style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
          'Volver a apilar', h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, 'aria-hidden': 'true' }, h('path', { d: 'M6 15l6-6 6 6' })))),
      t ? h('div', { className: 'cc-vig', 'data-cc-vigente': t.id }, h('span', { className: 'cc-n' }, t.id), h('strong', { style: { fontSize: 15, color: 'var(--text-strong)' } }, t.res.cab), Estado((delRiesgo(t, g.rid) || t).estadoTxt + ' · vigente', t.tone), t.res.lugarCorto ? h('span', { className: 'cc-der' }, t.res.lugarCorto) : null)
        : h('div', { className: 'cc-vig' }, Estado('Sin visita vigente', 'neutral')),
      h('ol', { className: 'cc-tl', 'aria-label': 'Visitas anteriores, de la más nueva a la más antigua' }, g.anteriores.map((a) => { const abierto = sel === a.id;
        return h('li', { key: a.id }, h('button', { type: 'button', className: 'cc-ant', 'aria-expanded': abierto ? 'true' : 'false', 'aria-controls': 'cc-d-' + g.key + '-' + a.id, 'data-cc-anterior': a.id, onClick: () => setSel(abierto ? '' : a.id) },
          h('span', { className: 'cc-l1' }, h('span', { className: 'cc-n ant' }, a.id), a.res.cab, Estado(a.res.estado, a.tone === 'danger' ? 'danger' : 'neutral')),
          a.res.linea ? h('span', { className: 'cc-l2' }, a.res.linea) : null),
          abierto ? h('div', { id: 'cc-d-' + g.key + '-' + a.id, className: 'cc-det', role: 'region', 'aria-label': 'Resumen de ' + a.id }, Filas(a.res.detalle), h('p', { className: 'cc-vacio', style: { marginTop: 8 } }, 'Visita anterior: solo lectura, sin acciones.')) : null); })),
      h('p', { className: 'cc-vacio' }, 'Elige una visita anterior para ver su resumen. Las visitas anteriores no tienen acciones ni enlaces.')); }

  // Arma las pilas: por riesgo (una por riesgo, en el orden del caso) o por visita (los riesgos con la misma visita vigente van juntos).
  function pilas(D, agrupar) { const V = (D.visitas || []).slice().sort((a, b) => (b.n || 0) - (a.n || 0)), RS = D.riesgos || [], lbl = (id) => (RS.find((r) => r.id === id) || { label: id }).label;
    // La vigente: la visita abierta con más avance (en curso › agendada › enlace › oferta › por agendar), y entre iguales la más nueva. Un enlace caducado solo es la vigente si es la visita más nueva.
    // Si el riesgo tiene otra visita abierta (no debería: un riesgo, una visita abierta), se muestra como carta aparte debajo, con sus acciones; las cerradas van detrás.
    const rango = (v) => /^(En curso|En camino|Por sincronizar)$/.test(v.estado) ? 4 : v.estado === 'Agendada' ? 3 : /enlace enviado|autoinspecci[oó]n enviada|por el cliente|enlace abierto/i.test(v.estado) ? 2 : /oferta|buscando|sin respuesta/i.test(v.estado) ? 1 : v.estado === 'Realizada' ? -1 : 0;
    const deRiesgo = (rid) => { const L = V.filter((v) => (v.riesgos || []).includes(rid)), cand = L.filter((v, i) => !v.anterior && (v.estado !== 'Enlace caducado' || i === 0));
      let top = null; cand.forEach((v) => { if (!top || rango(v) > rango(top)) top = v; });
      const otras = cand.filter((v) => v !== top && v.estado !== 'Realizada' && v.estado !== 'Enlace caducado');
      return { top, otras, anteriores: L.filter((v) => v !== top && !otras.includes(v)) }; };
    if (agrupar !== 'visita') return RS.map((r) => { const x = deRiesgo(r.id); return { key: 'r-' + r.id, rid: r.id, riesgos: [r.id], titulo: r.label, corto: r.corto || r.label.split(' · ')[0], top: x.top, otras: x.otras, anteriores: x.anteriores, coordinar: D.coordinarRiesgo ? () => D.coordinarRiesgo(r.id) : null }; });
    const out = [], idx = {};
    RS.forEach((r) => { const x = deRiesgo(r.id), k = x.top ? 'v-' + x.top.id : 'r-' + r.id;
      if (idx[k] == null) { idx[k] = out.length; out.push({ key: k, rid: x.top ? '' : r.id, riesgos: [], top: x.top, otras: [], anteriores: [], coordinar: D.coordinarRiesgo ? () => D.coordinarRiesgo(r.id) : null }); }
      const g = out[idx[k]]; g.riesgos.push(r.id); x.otras.forEach((a) => { if (!g.otras.includes(a)) g.otras.push(a); }); x.anteriores.forEach((a) => { if (!g.anteriores.includes(a)) g.anteriores.push(a); }); });
    out.forEach((g) => { g.anteriores.sort((a, b) => (b.n || 0) - (a.n || 0)); const nombres = g.riesgos.map(lbl).join(' y ');
      g.titulo = g.top ? g.top.id + ' · ' + g.top.mod + ' · ' + nombres : 'Sin visita · ' + nombres; g.corto = g.top ? g.top.id + ' · ' + g.riesgos.map((id) => lbl(id).split(' · ')[0]).join(' y ') : nombres; });
    return out; }

  function SiriusCoordCartas(props) { css(); const D = props.datos || {}, ini = D.inicial || {}, RS = D.riesgos || [];
    const [agrupar, setAgrupar] = R().useState(ini.agrupar === 'visita' ? 'visita' : 'riesgo'), [filtro, setFiltro] = R().useState(ini.filtro || ''), [abierto, setAbierto] = R().useState(ini.abierto || ''), [foco, setFoco] = R().useState(false);
    const todas = pilas(D, agrupar), ver = todas.filter((g) => !filtro || g.riesgos.includes(filtro));
    const keyIni = abierto === '*' ? ((todas.find((g) => g.anteriores.length) || {}).key || '') : abierto; // «*»: la primera pila con anteriores (escena)
    const volver = (k) => { setAbierto(''); setFoco(false); setTimeout(() => { const b = document.querySelector('[data-cc-desplegar="' + k + '"]'); if (b) b.focus(); }, 0); };
    const radios = (e) => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); const nv = agrupar === 'riesgo' ? 'visita' : 'riesgo'; setAgrupar(nv); setAbierto(''); setTimeout(() => { const b = document.querySelector('[data-cc-agrupar="' + nv + '"]'); if (b) b.focus(); }, 0); } };
    return h('div', { className: 'cc', 'data-cc': agrupar },
      h('div', { className: 'cc-barra' },
        h('span', { className: 'cc-lbl', id: 'cc-agr' }, 'Agrupar por'),
        h('div', { className: 'cc-seg', role: 'radiogroup', 'aria-labelledby': 'cc-agr', onKeyDown: radios }, ['riesgo', 'visita'].map((k) => h('button', { key: k, type: 'button', role: 'radio', 'aria-checked': agrupar === k ? 'true' : 'false', tabIndex: agrupar === k ? 0 : -1, 'data-cc-agrupar': k,
          onClick: () => { setAgrupar(k); setAbierto(''); } }, k === 'riesgo' ? 'Riesgo' : 'Visita'))),
        RS.length > 1 ? h('div', { role: 'group', 'aria-label': 'Filtrar por riesgo', style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
          h('button', { type: 'button', className: 'cc-chip', 'aria-pressed': filtro ? 'false' : 'true', 'data-cc-filtro': '', onClick: () => setFiltro('') }, 'Todos ' + RS.length),
          RS.map((r) => h('button', { key: r.id, type: 'button', className: 'cc-chip', 'aria-pressed': filtro === r.id ? 'true' : 'false', 'data-cc-filtro': r.id, onClick: () => setFiltro(filtro === r.id ? '' : r.id) }, r.chip || r.label))) : null,
        D.coordinar && !D.ro ? h('span', { style: { marginLeft: 'auto' } }, Boton({ label: 'Coordinar visita', tipo: 'pri', fn: D.coordinar.fn, why: D.coordinar.why || '' }, 'cv')) : null),
      D.coordinar && D.coordinar.why && !D.ro ? h('span', { className: 'cc-vacio', style: { marginTop: -12, textAlign: 'right' } }, D.coordinar.why) : null,
      ver.length ? h('div', { className: 'cc-grid' }, ver.map((g) => g.key === keyIni ? h(Historia, { key: 'h' + g.key, g, foco, sel: ini.sel && abierto === ini.abierto ? ini.sel : '', cerrar: () => volver(g.key) })
        : h(Pila, { key: g.key, g, ro: D.ro, whyCoord: D.coordinar && D.coordinar.why, abrir: (k) => { setAbierto(k); setFoco(true); } })))
        : h('p', { className: 'cc-vacio' }, RS.length ? 'Ninguna visita con ese filtro.' : 'Aún no hay visitas.'));
  }
  SiriusCoordCartas.pilas = pilas; // para las pruebas: la misma función que dibuja
  window.SiriusCoordCartas = SiriusCoordCartas;
})();
