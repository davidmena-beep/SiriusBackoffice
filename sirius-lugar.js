// SIRIUS · Lugar de la inspección (v1.0 · etapa G-2c · DEC-222, DEC-224 y DEC-225 · 18/10/2026). Lo usan Coordinación (agendar, reagendar y cambiar inspector),
// la tarjeta de la visita, la Agenda y la red de inspectores.
// Lugar (DEC-222) = { provincia (COD_PROVINCIA), ciudad (COD_CANTON), direccion, referencia, punto [lat, lng] | null, zona { id, nombre } | null,
//   estadoZona ('Calculada' | 'Confirmada' | 'Por confirmar' | 'Sin zonas'), lejos (booleano), origen ('Búsqueda' | 'Mapa' | 'Solicitud') }.
//   La zona se calcula con SiriusZonas.zonaDePublicada y el lugar guarda una copia del id y del nombre de la zona del momento: si después la zona se renombra o se
//   elimina, la visita conserva la que tenía. Vehículos y equipos móviles: el lugar se define al agendar. Ramos Generales no móviles: nace de la dirección del riesgo.
// Sugerencias (DEC-224 y DEC-225): grupos(inspectores, sucursal, lugar) → { zona: [...], ciudad: [...], fuera: [...] } con SiriusCobertura.cubre(inspector,
//   { sucursal del caso, ciudad, zonaId }); «Cubren la zona», «Cubren toda la ciudad o la sucursal» (también «Todas») y «Fuera de cobertura».
// Uso: SiriusLugar.normalizar(l), calcular(l), desdeTexto(direccion, ciudad, referencia), ciudadDe(nombre | cod), texto(l) («Quito · Zona Norte»), estadoTxt(l),
//   porConfirmar(l), cubre(inspector, sucursal, l), grupos(...), y el componente SiriusLugar.Editor({ lugar, onCambio, error, onBlurDir, ro, buscarAlAbrir }).
(function () {
  'use strict';
  const W = window; if (W.SiriusLugar) return;
  const R = () => W.React, h = (...a) => R().createElement(...a), Z = () => W.SiriusZonas, SM = () => W.SiriusMapa, U = () => W.SiriusUbicacion, C = () => W.SiriusCobertura, NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const r5 = (v) => +(+v).toFixed(5);
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const L = {};
  L.ESTADOS = ['Calculada', 'Confirmada', 'Por confirmar', 'Sin zonas'];
  L.ORIGENES = ['Búsqueda', 'Mapa', 'Solicitud'];
  // ---------- ciudades ----------
  L.ciudadDe = (x) => { const S = Z(); if (!S || x == null || x === '') return ''; const t = String(x).trim();
    if (/^\d{4}$/.test(t) && S.ciudad(t)) return t;
    const n = norm(t.replace(/,.*$/, '')), all = S.ciudades();
    const c = all.find((y) => norm(y.nombre) === n) || all.find((y) => norm(y.oficial) === n) || all.find((y) => norm(y.oficialTxt) === n);
    return c ? c.cod : ''; };
  L.provDe = (cod) => { const c = Z() && cod ? Z().ciudad(cod) : null; return c ? c.prov : String(cod || '').slice(0, 2); };
  L.ciudadNombre = (cod) => { const c = Z() && cod ? Z().ciudad(cod) : null; return c ? c.nombre : String(cod || ''); };
  L.provincias = () => { const S = Z(), G = S ? S.geo() : { provincias: [] }; return (G.provincias || []).filter((p) => p.cod !== '90').map((p) => ({ cod: p.cod, nombre: S.titulo(p.nombre) })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); };
  L.ciudadesDe = (prov) => (Z() ? Z().ciudades().filter((c) => c.prov === prov).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) : []);
  const zonasActivas = (cod) => { const z = Z() && cod ? Z().publicadasDe(cod) : null; return z ? z.zonas.filter((x) => x.estado !== 'Inactiva') : []; };
  L.zonasActivas = zonasActivas;
  // ---------- forma y cálculo ----------
  L.normalizar = (l) => { l = l || {}; const ciudad = L.ciudadDe(l.ciudad) || String(l.ciudad || ''), pt = Array.isArray(l.punto) && l.punto.length === 2 && l.punto.every((v) => v !== null && v !== '' && isFinite(+v)) ? [r5(l.punto[0]), r5(l.punto[1])] : null;
    const z = l.zona && typeof l.zona === 'object' && l.zona.id ? { id: String(l.zona.id), nombre: String(l.zona.nombre || l.zona.id) } : null;
    return { provincia: String(l.provincia || L.provDe(ciudad) || ''), ciudad, direccion: String(l.direccion || ''), referencia: String(l.referencia || ''), punto: pt, zona: z,
      estadoZona: L.ESTADOS.indexOf(l.estadoZona) >= 0 ? l.estadoZona : '', lejos: !!l.lejos, origen: L.ORIGENES.indexOf(l.origen) >= 0 ? l.origen : 'Solicitud' }; };
  // Zona según el punto (lo publicado). Una zona elegida o confirmada a mano no se recalcula.
  L.calcular = (l0) => { const l = L.normalizar(l0); if (l.estadoZona === 'Confirmada' && l.zona) return l;
    const act = zonasActivas(l.ciudad);
    if (!act.length) return Object.assign(l, { zona: null, estadoZona: 'Sin zonas', lejos: false });
    if (!l.punto) return Object.assign(l, { zona: null, estadoZona: 'Por confirmar', lejos: false });
    const r = Z().zonaDePublicada(l.ciudad, l.punto);
    if (r.tipo === 'area' || r.tipo === 'punto') return Object.assign(l, { zona: { id: r.zona.id, nombre: r.zona.nombre }, estadoZona: 'Calculada', lejos: !!r.lejos });
    return Object.assign(l, { zona: null, estadoZona: r.tipo === 'sinZonas' ? 'Sin zonas' : 'Por confirmar', lejos: false }); };
  // Lugar armado con una dirección de texto (lo que hay hoy) y la ciudad: sin punto, «Zona por confirmar» (o «Sin zonas»).
  L.desdeTexto = (dir, ciudad, ref, origen) => L.calcular({ ciudad: L.ciudadDe(ciudad) || '', direccion: dir && dir !== '—' ? dir : '', referencia: ref || '', punto: null, origen: origen || 'Solicitud' });
  L.detalle = (l) => (l && l.punto && l.ciudad && Z() ? Z().zonaDePublicada(l.ciudad, l.punto) : null);
  // ---------- textos ----------
  L.porConfirmar = (l) => !!l && l.estadoZona === 'Por confirmar';
  L.zonaTxt = (l) => (!l ? '' : l.zona ? 'Zona ' + l.zona.nombre : l.estadoZona === 'Sin zonas' ? 'Ciudad sin zonas' : 'Zona por confirmar');
  L.estadoTxt = (l) => (!l ? '' : l.estadoZona === 'Calculada' ? (l.lejos ? 'Calculada · lejos del centro' : 'Calculada') : l.estadoZona === 'Confirmada' ? 'Confirmada' : l.estadoZona === 'Sin zonas' ? 'Ciudad sin zonas' : 'Zona por confirmar');
  L.texto = (l) => (!l ? '' : (l.ciudad ? L.ciudadNombre(l.ciudad) + ' · ' : '') + L.zonaTxt(l));
  L.tono = (l) => (!l ? 'neutral' : l.estadoZona === 'Confirmada' ? 'success' : l.estadoZona === 'Calculada' ? (l.lejos ? 'warning' : 'brand') : l.estadoZona === 'Sin zonas' ? 'neutral' : 'warning');
  // ---------- cobertura y sugerencias ----------
  L.cubre = (ins, sucursal, l) => { const CB = C(); if (!CB) return { nivel: 'todas', por: '' }; return CB.cubre(ins, { sucursal: sucursal || '', ciudad: l && l.ciudad ? l.ciudad : '', zonaId: l && l.zona ? l.zona.id : '' }); };
  L.grupoDe = (c) => (!c || !c.nivel ? 'fuera' : c.nivel === 'zona' ? 'zona' : 'ciudad');
  // lista: [{ n, ... }]; carga(n) → número de visitas del día (para ordenar). Devuelve los tres grupos ordenados por menos visitas.
  L.grupos = (lista, sucursal, l, carga) => { const k = carga || (() => 0), out = { zona: [], ciudad: [], fuera: [] };
    (lista || []).forEach((i, idx) => { const c = L.cubre(i.inspector ? i : i.n, sucursal, l); out[L.grupoDe(c)].push({ ins: i, c, k: k(i.n), idx }); });
    Object.keys(out).forEach((g) => out[g].sort((a, b) => a.k - b.k || a.idx - b.idx)); return out; };
  L.fueraTxt = (n) => n + ' no cubre este lugar. ' + (C() ? C().resumen(n) : '');

  // ---------- componente: «Lugar de la inspección» ----------
  let css = false;
  const ponerCss = () => { if (css) return; css = true; const s = document.createElement('style');
    s.textContent = '.slug-in{width:100%;box-sizing:border-box;height:44px;padding:0 12px;border:1.5px solid var(--input-outlined-border,#DADADA);border-radius:var(--radius-sm,8px);background:#fff;font:400 15px var(--font-brand);color:var(--text-strong)}' +
      '.slug-in:focus{border-color:var(--color-brand);outline:none;box-shadow:0 0 0 3px var(--cyan-100)}.slug-in[aria-invalid="true"]{border-color:var(--color-danger)}.slug-in:disabled{background:var(--surface-subtle);color:var(--text-muted)}' +
      '.slug-lb{font-size:13px;font-weight:700;color:var(--text-strong)}.slug-sug{width:100%;border:0;background:none;text-align:left;padding:8px 12px;cursor:pointer;font:400 14px var(--font-brand);color:var(--text-body)}' +
      '.slug-sug:hover,.slug-sug[aria-selected="true"]{background:var(--cyan-100)}.slug-mb{border:1.5px solid var(--border-default);background:#fff;border-radius:8px;padding:0 12px;height:36px;font:700 14px var(--font-brand);color:var(--text-strong);cursor:pointer}' +
      '.slug-mb:hover{border-color:var(--color-brand)}.slug-mb:focus-visible,.slug-sug:focus-visible{outline:2px solid var(--color-brand);outline-offset:1px}';
    document.head.appendChild(s); };
  const chip = (txt, tone, extra) => { const B = NS().Badge; const sp = h('span', Object.assign({ style: { whiteSpace: 'nowrap' } }, extra || {}), txt); return B ? h(B, { tone }, sp) : sp; };
  const btn = (variant, txt, onClick, o) => { o = o || {}; const B = NS().Button; return B ? h(B, Object.assign({ variant, size: 'sm', onClick, disabled: !!o.disabled }, o.id ? { id: o.id } : {}), txt) : h('button', { type: 'button', onClick, disabled: !!o.disabled, id: o.id }, txt); };
  const sr = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' };

  function Editor(p) {
    const React = R(), S = Z(); ponerCss();
    const l = L.normalizar(p.lugar), ro = !!p.ro, id = p.idBase || 'co-lugar';
    const [st, setSt] = React.useState({ sugs: [], idx: -1, open: false, noUbica: !!p.noUbicada, buscando: false });
    const mapEl = React.useRef(null), mm = React.useRef(null), seq = React.useRef(0), cur = React.useRef(null), centrar = React.useRef(true), auto = React.useRef(false);
    const cambiar = (nl, o) => { const out = L.calcular(nl); cur.current = out; if (o && o.centrar) centrar.current = true; if (p.onCambio) p.onCambio(out); };
    cur.current = l; const fx = React.useRef({}); fx.current = { cambiar, ro };
    // Búsqueda: con 3 letras o más; al elegir, se ubica el punto y puede cambiar la ciudad.
    const elegir = (d) => { setSt((x) => Object.assign({}, x, { open: false, idx: -1, sugs: [], noUbica: !d.punto }));
      const ciudad = d.ciudad || l.ciudad; cambiar(Object.assign({}, l, { direccion: d.texto, ciudad, provincia: L.provDe(ciudad), punto: d.punto ? d.punto.slice() : null, zona: null, estadoZona: '', lejos: false, origen: d.punto ? 'Búsqueda' : l.origen }), { centrar: true }); };
    const buscar = (q0) => { const q = String(q0 != null ? q0 : l.direccion).trim(); if (!q || !U()) return Promise.resolve(); const k = ++seq.current; setSt((x) => Object.assign({}, x, { buscando: true }));
      return U().buscar(q, l.ciudad).then((r) => { if (k !== seq.current) return; if (r.length && r[0].punto) elegir(r[0]); else { setSt((x) => Object.assign({}, x, { open: false, sugs: [], noUbica: true, buscando: false })); const c0 = cur.current || l; cambiar(Object.assign({}, c0, { direccion: q, punto: null, zona: null, estadoZona: '', lejos: false }), { centrar: true }); } }); };
    const sugerir = (q) => { const k = ++seq.current; if (!U() || String(q).trim().length < 3) { setSt((x) => Object.assign({}, x, { sugs: [], open: false })); return; }
      U().buscar(q, l.ciudad).then((r) => { if (k !== seq.current) return; setSt((x) => Object.assign({}, x, { sugs: r, idx: -1, open: r.length > 0 })); }); };
    // Ramos Generales no móviles: si la dirección del riesgo no trae punto, se busca al abrir.
    React.useEffect(() => { if (p.buscarAlAbrir && !auto.current && !l.punto && l.direccion && !ro) { auto.current = true; buscar(l.direccion); } }, []);
    // Mapa: se crea una vez y se pinta en cada render.
    React.useEffect(() => { const M = SM(); if (!M || !W.L || !mapEl.current) return; const c0 = l.punto || (S && S.centro(l.ciudad)) || [-0.205, -78.49];
      const m = M.crear(mapEl.current, { centro: c0, zoom: l.punto ? 13 : 12, notaArriba: true }); mm.current = m; if (!m) return;
      m.map.on('click', (e) => { const F = fx.current; if (F.ro) return; const c = cur.current; setSt((x) => Object.assign({}, x, { noUbica: false })); F.cambiar(Object.assign({}, c, { punto: [r5(e.latlng.lat), r5(e.latlng.lng)], zona: null, estadoZona: '', lejos: false, origen: 'Mapa' })); });
      return () => { m.destruir(); mm.current = null; }; }, []);
    React.useEffect(() => { const m = mm.current, M = SM(), LL = W.L; if (!m || !LL) return; m.invalidar(); m.capa.clearLayers();
      const cz = S ? S.publicadasDe(l.ciudad) : null;
      if (cz) { M.dibujarZonas(m.capa, cz, { radios: false, color: (x) => S.color(l.ciudad, x.id) }); cz.zonas.forEach((x) => { if (x.estado === 'Inactiva') return; LL.marker(x.punto, { icon: M.pin(S.color(l.ciudad, x.id), x.nombre, !!(l.zona && l.zona.id === x.id)), interactive: false, keyboard: false, opacity: 0.85 }).addTo(m.capa); }); }
      if (l.punto) { const mk = LL.marker(l.punto, { icon: M.pinCaso(), draggable: !ro, title: 'Lugar de la inspección' + (ro ? '' : ' · arrastra para ajustarlo'), alt: 'Lugar de la inspección', zIndexOffset: 1000 }).addTo(m.capa);
        mk.on('dragend', (e) => { const ll = e.target.getLatLng(), c = cur.current; fx.current.cambiar(Object.assign({}, c, { punto: [r5(ll.lat), r5(ll.lng)], zona: null, estadoZona: '', lejos: false, origen: 'Mapa' })); }); }
      if (centrar.current) { centrar.current = false; const c = l.punto || (S && S.centro(l.ciudad)); if (c) m.map.setView(c, l.punto ? 13 : 12); } });
    // ---------- vista ----------
    const provs = L.provincias(), ciudades = L.ciudadesDe(l.provincia), act = zonasActivas(l.ciudad), r = L.detalle(l);
    const sel = (lab, idS, val, opts, on) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 } }, h('label', { className: 'slug-lb', htmlFor: idS }, lab, ' ', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, '*')),
      h('select', { id: idS, className: 'slug-in', value: val, disabled: ro, onChange: (e) => on(e.target.value), style: { padding: '0 10px' } }, opts.map((o) => h('option', { key: o.v, value: o.v }, o.l))));
    const cambiarProv = (pv) => { const c = L.ciudadesDe(pv)[0]; setSt((x) => Object.assign({}, x, { noUbica: false })); cambiar({ provincia: pv, ciudad: c ? c.cod : '', direccion: '', referencia: l.referencia, punto: null, origen: l.origen }, { centrar: true }); };
    const cambiarCiudad = (cd) => { setSt((x) => Object.assign({}, x, { noUbica: false })); cambiar({ provincia: l.provincia, ciudad: cd, direccion: '', referencia: l.referencia, punto: null, origen: l.origen }, { centrar: true }); };
    const errId = id + '-dir-err', ayId = id + '-dir-ayuda';
    const dirCampo = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, gridColumn: '1 / -1', position: 'relative' } },
      h('label', { className: 'slug-lb', htmlFor: id + '-dir' }, 'Dirección ', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, '*')),
      h('div', { style: { display: 'flex', gap: 8 } },
        h('input', { id: id + '-dir', className: 'slug-in', value: l.direccion, disabled: ro, autoComplete: 'off', placeholder: 'Calle principal, número y calle secundaria', role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': st.open ? 'true' : 'false', 'aria-controls': id + '-sugs',
          'aria-activedescendant': st.open && st.idx >= 0 ? id + '-sug-' + st.idx : undefined, 'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': [ayId, p.error ? errId : ''].filter(Boolean).join(' '),
          onChange: (e) => { const v = e.target.value; cambiar(Object.assign({}, cur.current || l, { direccion: v })); sugerir(v); },
          onBlur: () => { setTimeout(() => setSt((x) => (x.open ? Object.assign({}, x, { open: false }) : x)), 150); if (p.onBlurDir) p.onBlurDir(); },
          onKeyDown: (e) => { const n = st.open ? st.sugs.length : 0; if (e.key === 'ArrowDown' && n) { e.preventDefault(); setSt((x) => Object.assign({}, x, { idx: (x.idx + 1) % n })); } else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setSt((x) => Object.assign({}, x, { idx: (x.idx - 1 + n) % n })); }
            else if (e.key === 'Enter') { e.preventDefault(); if (n && st.idx >= 0) elegir(st.sugs[st.idx]); else buscar(); } else if (e.key === 'Escape' && st.open) { e.preventDefault(); e.stopPropagation(); setSt((x) => Object.assign({}, x, { open: false })); } } }),
        ro ? null : h('button', { type: 'button', className: 'slug-mb', id: id + '-buscar', onClick: () => buscar(), style: { height: 44, flex: '0 0 auto' } }, 'Buscar')),
      st.open && st.sugs.length ? h('ul', { id: id + '-sugs', role: 'listbox', 'aria-label': 'Direcciones sugeridas', style: { listStyle: 'none', margin: 0, padding: '4px 0', position: 'absolute', top: 74, left: 0, right: 90, zIndex: 1100, background: '#fff', borderRadius: 8, boxShadow: 'var(--shadow-modal, 0 8px 24px rgba(1,30,65,.2))', maxHeight: 220, overflowY: 'auto' } },
        st.sugs.map((d, k) => h('li', { key: k, role: 'none' }, h('button', { type: 'button', role: 'option', id: id + '-sug-' + k, className: 'slug-sug', tabIndex: -1, 'aria-selected': k === st.idx ? 'true' : 'false', 'data-lugar-sug': d.texto, onMouseDown: (e) => { e.preventDefault(); elegir(d); } },
          d.texto, h('span', { style: { color: 'var(--text-muted)', fontSize: 13 } }, ' · ' + L.ciudadNombre(d.ciudad)))))) : null,
      h('span', { id: ayId, style: { fontSize: 13, color: 'var(--text-muted)' } }, 'Escribe la dirección y elige una sugerencia o pulsa «Buscar»; también puedes marcar o arrastrar el punto en el mapa.'),
      st.noUbica && !l.punto ? h('span', { role: 'alert', 'data-lugar-noubica': '', style: { fontSize: 13, fontWeight: 600, color: '#7A4F0E' } }, 'No se pudo ubicar la dirección. Marca el punto en el mapa o elige la zona.') : null,
      p.error ? h('span', { id: errId, role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, p.error) : null);
    const refCampo = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, gridColumn: '1 / -1' } }, h('label', { className: 'slug-lb', htmlFor: id + '-ref' }, 'Referencia'),
      h('input', { id: id + '-ref', className: 'slug-in', value: l.referencia, disabled: ro, placeholder: 'Ej. Edificio Torre Azul, piso 3; portón verde', onChange: (e) => cambiar(Object.assign({}, cur.current || l, { referencia: e.target.value })) }));
    // Zona: nombre, estado, nota, «Cambiar la zona» y «Confirmar zona X».
    let nota = null; const notaS = { margin: 0, fontSize: 13, lineHeight: 1.45 };
    if (l.estadoZona === 'Calculada' && r && r.tipo === 'area') nota = h('p', { style: Object.assign({ color: 'var(--text-muted)' }, notaS) }, 'Dentro del área dibujada de la zona.');
    else if (l.estadoZona === 'Calculada' && r && r.tipo === 'punto' && !r.lejos) nota = h('p', { style: Object.assign({ color: 'var(--text-muted)' }, notaS) }, 'Es la zona más cercana: su punto está a ' + S.fmtKm(r.distanciaKm) + '.');
    else if (l.estadoZona === 'Calculada' && r && r.lejos) nota = h('p', { role: 'note', 'data-lugar-lejos': '', style: Object.assign({ color: 'var(--text-strong)', background: 'var(--gold-100,#FFF4D6)', borderRadius: 8, padding: '8px 10px' }, notaS) }, 'Es la zona más cercana, pero su punto está a ' + S.fmtKm(r.distanciaKm) + ', fuera del radio de referencia (' + r.radio + ' km). Revisa si la zona es correcta; puedes cambiarla abajo.');
    else if (l.estadoZona === 'Por confirmar') nota = h('p', { role: 'note', style: Object.assign({ color: 'var(--text-strong)', background: 'var(--gold-100,#FFF4D6)', borderRadius: 8, padding: '8px 10px' }, notaS) }, (l.punto ? 'No se pudo calcular la zona. ' : 'Falta ubicar el punto: marca el lugar en el mapa o elige la zona. ') + 'Mientras quede por confirmar, se sugiere a quienes cubren toda la ciudad.');
    else if (l.estadoZona === 'Confirmada') nota = h('p', { style: Object.assign({ color: 'var(--text-muted)' }, notaS) }, 'Zona confirmada por el Coordinador.');
    else if (l.estadoZona === 'Sin zonas') nota = h('p', { style: Object.assign({ color: 'var(--text-muted)' }, notaS) }, L.ciudadNombre(l.ciudad) + ' no tiene zonas: se asigna por ciudad.');
    const zonaSel = l.estadoZona === 'Confirmada' && l.zona ? l.zona.id : '';
    const zonaBox = h('div', { 'data-lugar-zona': l.estadoZona, style: { display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm,8px)', background: 'var(--surface-subtle,#F5F6F8)', gridColumn: '1 / -1' } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' } },
        h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, 'Zona'), h('b', { 'data-lugar-zonanom': '', style: { fontSize: 16, color: L.porConfirmar(l) ? '#7A4F0E' : 'var(--text-strong)' } }, L.zonaTxt(l))),
        chip(L.estadoTxt(l), L.tono(l), { 'data-lugar-estado': L.estadoTxt(l) })),
      nota,
      act.length && !ro ? h('div', { style: { display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 200px', minWidth: 0 } }, h('label', { className: 'slug-lb', htmlFor: id + '-zona' }, 'Cambiar la zona'),
          h('select', { id: id + '-zona', className: 'slug-in', value: zonaSel, onChange: (e) => { const v = e.target.value, z = act.find((x) => x.id === v); cambiar(Object.assign({}, cur.current || l, z ? { zona: { id: z.id, nombre: z.nombre }, estadoZona: 'Confirmada', lejos: false } : { zona: null, estadoZona: '' })); }, style: { padding: '0 10px' } },
            [h('option', { key: '', value: '' }, l.punto ? 'Usar la calculada' : 'Por confirmar')].concat(act.map((x) => h('option', { key: x.id, value: x.id }, x.nombre))))),
        l.estadoZona === 'Calculada' && l.zona ? btn('secondary', 'Confirmar zona ' + l.zona.nombre, () => cambiar(Object.assign({}, cur.current || l, { estadoZona: 'Confirmada' })), { id: id + '-confirmar' }) : null) : null);
    return h('section', { 'aria-labelledby': id + '-t', 'data-lugar': '', style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      h('h3', { id: id + '-t', style: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, 'Lugar de la inspección'),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '14px 16px', alignItems: 'start' } },
        sel('Provincia', id + '-prov', l.provincia, provs.map((x) => ({ v: x.cod, l: x.nombre })), cambiarProv),
        sel('Ciudad', id + '-ciudad', l.ciudad, (ciudades.length ? ciudades : [{ cod: '', nombre: 'Elige la provincia' }]).map((x) => ({ v: x.cod, l: x.nombre })), cambiarCiudad),
        dirCampo, refCampo,
        h('div', { style: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 } },
          h('div', { ref: mapEl, role: 'application', 'aria-label': 'Mapa de ' + L.ciudadNombre(l.ciudad) + (ro ? '' : ': haz clic para marcar el lugar o arrastra el punto'), 'data-lugar-mapa': '', style: { height: p.altoMapa || 260, borderRadius: 'var(--radius-sm,8px)', overflow: 'hidden', border: '1px solid var(--border-subtle)' } }),
          h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, ro ? '' : l.punto ? 'Arrastra el punto si la ubicación no es exacta.' : 'Haz clic en el mapa para marcar el lugar.')),
        zonaBox),
      h('span', { style: sr, 'aria-live': 'polite' }, L.texto(l) + ' · ' + L.estadoTxt(l)));
  }
  L.Editor = Editor;
  W.SiriusLugar = L;
})();
