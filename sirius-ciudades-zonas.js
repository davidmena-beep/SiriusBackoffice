// SIRIUS · Pantalla «Ciudades y zonas» (v1.0 · etapa G-2a · DEC-221 y DEC-234 · 18/10/2026). Administración › Ciudades y zonas (también desde el índice de Catálogos).
// Tres columnas (maqueta G-1): izquierda, buscador y lista de ciudades (cantones del INEC); centro, el mapa (SiriusMapa); derecha, la barra de zonas
// con cabecera y pie fijos (solo el cuerpo se desplaza). Solo el Administrador edita (agregar, mover, nombrar, dibujar áreas, desactivar, radio) y publica con
// motivo; los demás roles ven todo en solo lectura. Datos y reglas en SiriusZonas (sirius-zonas.js).
// Componente: window.SiriusCiudadesZonas({ rol, usuario, escena }). Escenas: zonas, zonasagregar (?zrep=1), zonasarea (?zcruce=1, ?zpunto=1),
// zonasprobar (?zdir=n), zonaspublicar (?cxok=0), zonaslectura, ciudadesbuscar (?ztodas=1).
(function () {
  'use strict';
  const W = window; if (W.SiriusCiudadesZonas) return;
  const R = () => W.React, h = (...a) => R().createElement(...a), Z = () => W.SiriusZonas, SM = () => W.SiriusMapa, NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x));
  const r5 = (v) => +(+v).toFixed(5);
  let css = false;
  const ponerCss = () => { if (css) return; css = true; const s = document.createElement('style');
    s.textContent = '.zcz-l button.zcz-ciu{width:100%;text-align:left;border:0;border-left:3px solid transparent;background:none;padding:10px 16px;cursor:pointer;display:flex;justify-content:space-between;gap:8px;font-family:var(--font-brand)}' +
      '.zcz-l button.zcz-ciu:hover{background:var(--surface-subtle)}.zcz-l button.zcz-ciu[aria-current="true"]{background:var(--cyan-100);border-left-color:var(--color-brand)}' +
      '.zcz-card{border:1px solid var(--border-subtle);border-left:4px solid var(--zc,#ccc);border-radius:10px;padding:8px 10px 6px;margin-bottom:8px;background:#fff;transition:box-shadow .15s}' +
      '.zcz-card:hover,.zcz-card[data-foco="1"]{box-shadow:0 2px 10px rgba(1,30,65,.14)}.zcz-card.nueva{animation:zczDest 1.6s ease}@keyframes zczDest{0%{background:var(--cyan-100)}100%{background:#fff}}' +
      '.zcz-nom{flex:1;min-width:0;border:1px solid transparent;border-radius:6px;padding:4px 6px;font:700 15px var(--font-brand);color:var(--text-strong);background:transparent;text-overflow:ellipsis}' +
      '.zcz-nom:not([readonly]):hover{border-color:var(--border-default)}.zcz-nom:not([readonly]):focus{border-color:var(--color-brand);background:#fff;outline:none;box-shadow:0 0 0 3px var(--cyan-100)}' +
      '.zcz-mb{border:0;background:none;color:var(--cyan-700);font:700 13px var(--font-brand);padding:4px 6px;white-space:nowrap;border-radius:6px;cursor:pointer}.zcz-mb:hover{background:var(--cyan-100)}.zcz-mb.gris{color:var(--text-muted)}' +
      '.zcz-mb:focus-visible,.zcz-ciu:focus-visible,.zcz-tg:focus-visible{outline:2px solid var(--color-brand);outline-offset:1px}' +
      '.zcz-sec{margin-top:14px;border-top:1px solid var(--border-subtle);padding-top:12px}.zcz-sec>summary{cursor:pointer;font-weight:700;color:var(--text-strong);list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:15px}' +
      '.zcz-sec>summary::-webkit-details-marker{display:none}.zcz-sec>summary:after{content:"▾";color:var(--text-muted)}.zcz-sec:not([open])>summary:after{content:"▸"}' +
      '.zcz-in{border:1.5px solid var(--input-outlined-border,#DADADA);border-radius:var(--radius-sm,8px);padding:0 12px;height:40px;background:#fff;font:400 14px var(--font-brand);color:var(--text-strong);width:100%;box-sizing:border-box}' +
      '.zcz-in:focus{border-color:var(--color-brand);outline:none;box-shadow:0 0 0 3px var(--cyan-100)}.zcz-in:disabled{background:var(--surface-subtle);color:var(--text-muted)}' +
      '.zcz-tg{border:1.5px solid var(--border-default);border-radius:8px;padding:5px 12px;cursor:pointer;background:#fff;font:600 14px var(--font-brand);color:var(--text-body)}.zcz-tg[aria-pressed="true"]{border-color:var(--color-brand);background:var(--cyan-100);color:var(--text-strong);font-weight:700}' +
      '@media (prefers-reduced-motion:reduce){.zcz-card{transition:none;animation:none}}';
    document.head.appendChild(s); };
  const chip = (txt, tone) => { const B = NS().Badge; const sp = h('span', { style: { whiteSpace: 'nowrap' } }, txt); return B ? h(B, { tone: tone || 'neutral' }, sp) : h('span', null, txt); };
  const btn = (variant, txt, onClick, o) => { o = o || {}; const B = NS().Button; return B ? h(B, Object.assign({ variant, size: o.size || 'sm', onClick, disabled: !!o.disabled, key: o.key || txt }, o.id ? { id: o.id } : {}), txt) : h('button', { type: 'button', onClick, disabled: !!o.disabled, key: o.key || txt }, txt); };
  const res = (tone, titulo, txt) => { const C = { ok: ['var(--green-100,#E6F4EA)', 'var(--green-700,#1E7B3C)'], warn: ['var(--gold-100,#FFF4D6)', 'var(--text-strong)'], info: ['var(--cyan-100)', 'var(--text-strong)'] }[tone];
    return h('div', { role: 'status', 'data-zcz-resultado': tone, style: { borderRadius: 10, padding: '12px 14px', marginTop: 8, fontSize: 14, lineHeight: 1.45, background: C[0], color: C[1] } }, h('strong', { style: { display: 'block', fontSize: 15, marginBottom: 2 } }, titulo), txt); };

  // Estado inicial (y lo que arma cada escena).
  function inicial(escena) { const s = { ciudad: '1701', q: '', soloCon: true, herr: null, agr: null, area: null, prueba: null, dir: '', resaltada: null, nueva: null, radios: true, toast: null, motivo: '', publicando: false, errPub: '',
    secProbar: false, secHist: false, verCambios: false, nomEd: {}, radioEd: null, centrar: true, foco: false, fantasmaIni: null };
    const S = Z(), Q = '1701';
    if (escena === 'zonasagregar') { s.herr = 'agregar'; s.agr = { n: qp('zrep') === '1' ? 'Norte' : 'Carcelén', err: '' }; if (qp('zrep') === '1') s.agr.err = 'Ya hay una zona con ese nombre en Quito.'; s.fantasmaIni = [-0.098, -78.475]; }
    if (escena === 'zonasarea') { const cz = S.tocar(Q), x = cz.zonas.find((y) => y.nombre === 'Norte');
      if (x) { x.area = [[-0.065, -78.525], [-0.068, -78.44], [-0.16, -78.43], [-0.178, -78.47], [-0.17, -78.52]]; S.registrar(Q, 'Dibujó el área de Norte', 'area:' + x.id); s.resaltada = x.id; }
      if (qp('zcruce') === '1') { const c = cz.zonas.find((y) => y.nombre === 'Centro'); s.herr = 'area'; s.area = { id: c.id, tmp: [[-0.19, -78.53], [-0.24, -78.48], [-0.19, -78.48], [-0.24, -78.53]], err: 'El borde del área se cruza consigo mismo: deshaz puntos y vuelve a trazarlo.' }; }
      if (qp('zpunto') === '1' && x) { const antes = x.area; x.area = null; S.quitarCambio(Q, 'area:' + x.id); s.toast = { txt: 'Norte volvió a solo punto.', acc: { t: 'Deshacer', f: (st) => { x.area = antes; S.registrar(Q, 'Dibujó el área de Norte', 'area:' + x.id); } }, fijo: true }; } }
    if (escena === 'zonasprobar') { const k = qp('zdir') !== '' ? +qp('zdir') : 4, d = S.DIRECCIONES[k] || S.DIRECCIONES[4]; s.ciudad = d.c; s.dir = String(S.DIRECCIONES.indexOf(d)); s.prueba = { p: d.p, sinUbicar: !d.p }; s.secProbar = true; }
    if (escena === 'zonaspublicar') { const cz = S.tocar(Q), c = cz.zonas.find((y) => y.nombre === 'Centro'); c.punto = [-0.2105, -78.5025]; S.registrar(Q, 'Movió el punto de Centro', 'mov:' + c.id);
      cz.radio = 12; S.registrar(Q, 'Radio de referencia: 15 → 12 km', 'radio'); s.verCambios = true; s.motivo = 'Ajuste de Centro y del radio según la cobertura real de Quito.'; }
    if (escena === 'ciudadesbuscar') { if (qp('ztodas') === '1') { s.soloCon = false; } else { s.q = 'El Coca'; s.soloCon = false; s.ciudad = '2201'; } }
    return s; }

  function SiriusCiudadesZonas(p) {
    const React = R(), S = Z(), puede = p.rol === 'Administrador', usuario = p.usuario || '';
    const [, setN] = React.useState(0), rer = () => setN((n) => n + 1);
    const ref = React.useRef(null); if (!ref.current) { ponerCss(); ref.current = inicial(p.escena || ''); }
    const s = ref.current, raiz = React.useRef(null), mapEl = React.useRef(null), mm = React.useRef(null), fx = React.useRef({}), mk = React.useRef({}), guia = React.useRef(null), fantasma = React.useRef(null), tT = React.useRef(null);
    const [alto, setAlto] = React.useState(560), [ancho, setAncho] = React.useState(W.innerWidth || 1280);
    const cod = s.ciudad, ciu = S.ciudad(cod) || { cod, nombre: cod, oficial: '', oficialTxt: '', provNombre: '' }, cz = S.zonasDe(cod), act = S.activas(cod), ina = cz ? cz.zonas.filter((x) => !S.activa(x)) : [], nc = S.nCambios(cod);
    const col = (x) => (x && x.estado === 'Inactiva' ? '#BBBBBB' : S.color(cod, x.id));
    const pubDe = (id) => { const pz = S.publicadasDe(cod); return pz ? pz.zonas.find((y) => y.id === id) || null : null; };
    // Registra un cambio o lo quita si volvió a lo publicado.
    const cambio = (clave, txt, igual) => { if (igual) S.quitarCambio(cod, clave); else S.registrar(cod, txt, clave); };
    const aviso = (txt, acc) => { s.toast = { txt, acc }; clearTimeout(tT.current); tT.current = setTimeout(() => { s.toast = null; rer(); }, 6000); };
    const salirHerr = () => { s.herr = null; s.agr = null; s.area = null; const m = mm.current; if (m) m.map.doubleClickZoom.enable(); if (fantasma.current && m) { m.map.removeLayer(fantasma.current); fantasma.current = null; } };
    const elegirCiudad = (c, conservarPrueba) => { s.ciudad = c; salirHerr(); s.resaltada = null; s.nomEd = {}; s.radioEd = null; s.errPub = ''; if (!conservarPrueba) { s.prueba = null; s.dir = ''; } s.centrar = true; s.motivo = ''; rer(); };
    const resaltar = (id, desplazar) => { s.resaltada = id; const m = mm.current, L = W.L; if (!m || !cz) return;
      Object.keys(mk.current).forEach((k) => { const x = cz.zonas.find((y) => y.id === k); if (x) mk.current[k].setIcon(SM().pin(col(x), x.nombre, k === id)).setZIndexOffset(k === id ? 800 : 0); });
      const root = raiz.current; if (root) root.querySelectorAll('.zcz-card').forEach((e) => e.setAttribute('data-foco', e.getAttribute('data-id') === id ? '1' : '0'));
      if (desplazar && root) { const e = root.querySelector('.zcz-card[data-id="' + id + '"]'); if (e && e.scrollIntoView) e.scrollIntoView({ block: 'nearest' }); } void L; };
    // ---------- acciones ----------
    const agregarEn = (pt) => { if (!s.agr || s.agr.err) return; const z = S.tocar(cod), id = S.nuevoId(cod), n = (s.agr.n || '').trim() || ('Zona ' + (z.zonas.length + 1));
      z.zonas.push({ id, nombre: n, punto: pt, area: null, estado: 'Activa' }); S.registrar(cod, 'Agregó la zona ' + n, 'nueva:' + id); salirHerr(); s.nueva = id; s.resaltada = id; s.foco = false;
      aviso((/^Zona /.test(n) ? n : 'Zona ' + n) + ' agregada. Arrastra el punto si hace falta ajustarlo.', { t: 'Deshacer', f: () => { const z2 = S.tocar(cod); z2.zonas = z2.zonas.filter((y) => y.id !== id); S.quitarCambio(cod, 'nueva:' + id); s.resaltada = null; } }); rer(); };
    const cerrarArea = () => { const a = s.area; if (!a || a.tmp.length < 3) return; const t = a.tmp.slice();
      if (S.seCruza(t)) { a.err = 'El borde del área se cruza consigo mismo: deshaz puntos y vuelve a trazarlo.'; rer(); return; }
      const z = S.tocar(cod), x = z.zonas.find((y) => y.id === a.id), tenia = S.tieneArea(x); x.area = t; S.registrar(cod, (tenia ? 'Volvió a dibujar' : 'Dibujó') + ' el área de ' + x.nombre, 'area:' + x.id); salirHerr(); s.resaltada = x.id; rer(); };
    const deshacerPunto = () => { if (s.area && s.area.tmp.length) { s.area.tmp.pop(); s.area.err = ''; rer(); } };
    const cancelar = () => { salirHerr(); rer(); };
    const soloPunto = (x) => { const antes = x.area, pz = pubDe(x.id); x.area = null; cambio('area:' + x.id, x.nombre + ' volvió a solo punto', pz && !S.tieneArea(pz));
      aviso(x.nombre + ' volvió a solo punto.', { t: 'Deshacer', f: () => { x.area = antes; const pz2 = pubDe(x.id); cambio('area:' + x.id, 'Dibujó el área de ' + x.nombre, pz2 && JSON.stringify(pz2.area) === JSON.stringify(antes)); } }); rer(); };
    const ponerEstado = (x, est) => { const pz = pubDe(x.id); x.estado = est; cambio('est:' + x.id, (est === 'Inactiva' ? 'Desactivó ' : 'Activó ') + x.nombre, pz && (pz.estado || 'Activa') === est);
      if (est === 'Inactiva') { if (s.resaltada === x.id) s.resaltada = null; aviso(x.nombre + ' quedó inactiva: sus direcciones pasan a la zona más cercana.', { t: 'Deshacer', f: () => { x.estado = 'Activa'; cambio('est:' + x.id, 'Activó ' + x.nombre, pz && (pz.estado || 'Activa') === 'Activa'); } }); }
      else aviso(x.nombre + ' quedó activa.', { t: 'Deshacer', f: () => { x.estado = 'Inactiva'; cambio('est:' + x.id, 'Desactivó ' + x.nombre, pz && pz.estado === 'Inactiva'); } }); rer(); };
    const renombrar = (x, v0) => { const v = String(v0 || '').trim(); delete s.nomEd[x.id]; if (!v || v === x.nombre) { rer(); return; }
      if (S.nombreRepetido(cod, v, x.id)) { aviso('Ya hay una zona «' + v + '» en ' + ciu.nombre + '.'); rer(); return; }
      const pz = pubDe(x.id), orig = pz ? pz.nombre : x.nombre; x.nombre = v; if (!pz) S.registrar(cod, 'Agregó la zona ' + v, 'nueva:' + x.id); /* zona nueva: el cambio sigue siendo «Agregó la zona …» con su nombre */ else cambio('nom:' + x.id, 'Renombró ' + orig + ' → ' + v, pz.nombre === v); rer(); };
    const ponerRadio = (v0) => { const z = S.tocar(cod), v = parseFloat(v0), ant = z.radio, nv = v > 0 ? Math.min(60, v) : null; s.radioEd = null; if (nv === ant) { rer(); return; }
      const pz = S.publicadasDe(cod); z.radio = nv; cambio('radio', 'Radio de referencia: ' + (pz && pz.radio ? pz.radio : 'sin radio') + ' → ' + (nv || 'sin radio') + ' km', pz && pz.radio === nv); rer(); };
    const verZona = (x) => { const m = mm.current; if (!m) return; if (S.tieneArea(x)) m.map.fitBounds(W.L.polygon(x.area).getBounds(), { padding: [40, 40], maxZoom: 14 }); else m.map.setView(x.punto, 13); resaltar(x.id, false); };
    const elegirDir = (v) => { s.dir = v; const d = S.DIRECCIONES[+v]; if (v === '' || !d) { rer(); return; } if (d.c !== s.ciudad) { elegirCiudad(d.c, true); } s.prueba = { p: d.p, sinUbicar: !d.p }; s.secProbar = true; if (d.p && mm.current) mm.current.map.setView(d.p, 12); rer(); };
    const publicar = () => { if (s.publicando || String(s.motivo).trim().length < 10) return; s.publicando = true; s.errPub = ''; rer();
      S.publicar(cod, s.motivo, usuario).then((r) => { s.publicando = false; if (r && r.ok) { s.motivo = ''; s.verCambios = false; aviso('Publicado · versión ' + r.version + ': las zonas de ' + ciu.nombre + ' se usan desde ya en Coordinación, las ofertas y el portal.'); }
        else s.errPub = ((r && r.mensaje) || 'No se pudo publicar') + (r && r.validacion ? '' : '. La publicación se deshizo: los cambios siguen sin publicar.'); rer(); }); };
    const descartar = () => { S.descartar(cod); salirHerr(); s.resaltada = null; s.nomEd = {}; s.radioEd = null; s.motivo = ''; s.errPub = ''; aviso('Se descartaron los cambios: vuelve lo publicado.'); rer(); };
    fx.current = { s, cod, cz, puede, agregarEn, cerrarArea, deshacerPunto, cancelar, resaltar, rer };
    // ---------- tamaño: la pantalla ocupa el alto visible (el pie siempre a la vista) ----------
    React.useLayoutEffect(() => { const medir = () => { const el = raiz.current; if (!el) return; const top = el.getBoundingClientRect().top + (W.scrollY || 0); setAlto(Math.max(460, Math.round((W.innerHeight || 720) - top - 16))); setAncho(W.innerWidth || 1280); };
      medir(); const t = setTimeout(medir, 300); W.addEventListener('resize', medir); return () => { clearTimeout(t); W.removeEventListener('resize', medir); }; }, []);
    // ---------- mapa: se crea una vez ----------
    React.useEffect(() => { const M = SM(); if (!M || !W.L || !mapEl.current) return; const c0 = S.centro(s.ciudad) || [-0.205, -78.49];
      const m = M.crear(mapEl.current, { centro: c0, zoom: 11 }); mm.current = m; if (!m) return; s.centrar = false;
      m.map.on('click', (e) => { const F = fx.current, st = F.s, pt = [r5(e.latlng.lat), r5(e.latlng.lng)];
        if (st.herr === 'agregar') { if (F.puede) F.agregarEn(pt); return; }
        if (st.herr === 'area') { const t = st.area.tmp, u = t[t.length - 1]; if (u && Math.abs(u[0] - pt[0]) < 1e-5 && Math.abs(u[1] - pt[1]) < 1e-5) return; t.push(pt); st.area.err = ''; F.rer(); return; }
        st.prueba = { p: pt, sinUbicar: false }; st.dir = ''; st.secProbar = true; F.rer(); });
      m.map.on('dblclick', (e) => { const F = fx.current; if (F.s.herr === 'area') { W.L.DomEvent.stop(e); F.cerrarArea(); } });
      m.map.on('mousemove', (e) => { const F = fx.current, st = F.s;
        if (st.herr === 'agregar') { const nom = (st.agr && st.agr.n.trim()) || 'Nueva zona'; if (!fantasma.current) fantasma.current = W.L.marker(e.latlng, { icon: M.pin('#008BBF', nom, true), interactive: false, opacity: 0.75 }).addTo(m.map); else fantasma.current.setLatLng(e.latlng); return; }
        if (st.herr !== 'area' || !guia.current) return; const t = st.area.tmp; if (!t.length) { guia.current.setLatLngs([]); return; } const q = [e.latlng.lat, e.latlng.lng]; guia.current.setLatLngs(t.length >= 2 ? [t[t.length - 1], q, t[0]] : [t[0], q]); });
      m.map.on('mouseout', () => { if (fantasma.current && !fx.current.s.fantasmaIni) { m.map.removeLayer(fantasma.current); fantasma.current = null; } });
      rer(); return () => { clearTimeout(tT.current); m.destruir(); mm.current = null; }; }, []);
    // Teclado: Esc cancela; Retroceso quita el último vértice (fuera de los campos).
    React.useEffect(() => { const k = (e) => { const F = fx.current, st = F.s, campo = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
        if (st.herr === 'area' && !campo) { if (e.key === 'Escape') { e.preventDefault(); F.cancelar(); } else if (e.key === 'Backspace') { e.preventDefault(); F.deshacerPunto(); } }
        else if (st.herr === 'agregar' && e.key === 'Escape') { e.preventDefault(); F.cancelar(); } };
      document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);
    React.useEffect(() => { const off = S.on(() => rer()); return off; }, []);
    // ---------- pintar el mapa después de cada render ----------
    React.useEffect(() => { const m = mm.current, M = SM(), L = W.L; if (!m || !L) return; m.invalidar();
      if (s.centrar) { const c = S.centro(cod); if (c) m.map.setView(c, cod === '1701' || cod === '0901' ? 11 : 12); s.centrar = false; }
      m.capa.clearLayers(); mk.current = {};
      if (cz) { M.dibujarZonas(m.capa, cz, { radios: s.radios, color: col });
        cz.zonas.forEach((x) => { if (!S.activa(x)) return; const edit = puede && !s.herr;
          const mkr = L.marker(x.punto, { icon: M.pin(col(x), x.nombre, x.id === s.resaltada), draggable: edit, interactive: !s.herr, keyboard: !s.herr, title: 'Zona ' + x.nombre + (edit ? ' · arrastra para mover' : ''), alt: 'Zona ' + x.nombre, zIndexOffset: x.id === s.resaltada ? 800 : 0 }).addTo(m.capa);
          mk.current[x.id] = mkr;
          mkr.on('dragend', (e) => { const ll = e.target.getLatLng(), pz = pubDe(x.id); x.punto = [r5(ll.lat), r5(ll.lng)]; cambio('mov:' + x.id, 'Movió el punto de ' + x.nombre, pz && pz.punto[0] === x.punto[0] && pz.punto[1] === x.punto[1]); rer(); });
          mkr.on('click', () => { if (fx.current.s.herr) return; resaltar(x.id, true); }); }); }
      const div = mapEl.current; if (div) div.classList.toggle('dibujando', s.herr === 'area' || s.herr === 'agregar');
      if (s.herr === 'area') { const t = s.area.tmp, x = cz && cz.zonas.find((y) => y.id === s.area.id), c = x ? col(x) : '#011E41';
        if (t.length > 1) L.polyline(t, { color: c, weight: 3, interactive: false }).addTo(m.capa);
        t.forEach((pt, k) => { const cm = L.circleMarker(pt, { radius: k === 0 ? 9 : 5, color: '#fff', weight: 2, fillColor: k === 0 ? '#011E41' : c, fillOpacity: 1, bubblingMouseEvents: false, interactive: k === 0 }).addTo(m.capa);
          if (k === 0) { cm.bindTooltip(t.length >= 3 ? 'Clic aquí para cerrar el área' : 'Primer punto', { direction: 'top', offset: [0, -8], permanent: true }); cm.on('click', (e) => { L.DomEvent.stopPropagation(e); if (fx.current.s.area && fx.current.s.area.tmp.length >= 3) fx.current.cerrarArea(); }); } });
        if (!guia.current) guia.current = L.polyline([], { color: c, weight: 2, dashArray: '6 6', interactive: false }).addTo(m.map); m.map.doubleClickZoom.disable(); }
      else if (guia.current) { m.map.removeLayer(guia.current); guia.current = null; }
      if (s.herr === 'agregar' && s.fantasmaIni && !fantasma.current) fantasma.current = L.marker(s.fantasmaIni, { icon: M.pin('#008BBF', (s.agr && s.agr.n.trim()) || 'Nueva zona', true), interactive: false, opacity: 0.75 }).addTo(m.map);
      if (s.herr === 'agregar' && fantasma.current) fantasma.current.setIcon(M.pin('#008BBF', (s.agr && s.agr.n.trim()) || 'Nueva zona', true));
      if (s.herr !== 'agregar' && fantasma.current) { m.map.removeLayer(fantasma.current); fantasma.current = null; s.fantasmaIni = null; }
      if (s.prueba && s.prueba.p && (!s.dir || (S.DIRECCIONES[+s.dir] || {}).c === cod)) L.marker(s.prueba.p, { icon: M.pinCaso(), interactive: false, zIndexOffset: 900 }).addTo(m.capa);
      if (s.foco && raiz.current) { const i = raiz.current.querySelector('#zcz-nueva'); if (i) i.focus(); s.foco = false; }
      if (s.nueva) { const id = s.nueva; s.nueva = null; setTimeout(() => resaltar(id, true), 30); } });
    // ---------- columnas ----------
    const angosto = ancho < 1366, wIzq = angosto ? 260 : 300, wDer = angosto ? 330 : 380;
    const lista = S.buscar(s.q, s.soloCon);
    const izq = h('div', { className: 'zcz-l', style: { width: wIzq, flex: '0 0 ' + wIzq + 'px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' } },
      h('div', { style: { padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 } },
        h('h2', { style: { margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-strong)' } }, 'Ciudades y zonas'),
        h('p', { style: { margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 } }, 'Las ciudades son los cantones del INEC; las zonas las define Aseguradora del Sur.'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: 'zcz-busca', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Buscar ciudad'),
          h('input', { id: 'zcz-busca', type: 'search', className: 'zcz-in', value: s.q, placeholder: 'Por ejemplo: Quito, El Coca, Manta', onChange: (e) => { s.q = e.target.value; rer(); } })),
        h('div', { role: 'group', 'aria-label': 'Filtro de ciudades', style: { display: 'flex', gap: 6 } },
          h('button', { type: 'button', className: 'zcz-tg', 'aria-pressed': s.soloCon ? 'true' : 'false', onClick: () => { s.soloCon = true; rer(); } }, 'Con zonas'),
          h('button', { type: 'button', className: 'zcz-tg', 'aria-pressed': s.soloCon ? 'false' : 'true', onClick: () => { s.soloCon = false; rer(); } }, 'Todas')),
        h('span', { 'data-zcz-cuenta': String(lista.length), style: { fontSize: 13, color: 'var(--text-muted)' } }, lista.length + (lista.length === 1 ? ' ciudad' : ' ciudades') + (s.q ? (lista.length === 1 ? ' coincide' : ' coinciden') : s.soloCon ? ' con zonas' : ' activas'))),
      h('ul', { 'aria-label': 'Ciudades', style: { listStyle: 'none', margin: 0, padding: 0, flex: '1 1 auto', minHeight: 0, overflowY: 'auto', borderTop: '1px solid var(--border-subtle)' } },
        lista.length ? lista.map((c) => { const z = S.zonasDe(c.cod), n = S.nCambios(c.cod), na = z ? z.zonas.filter(S.activa).length : 0;
          return h('li', { key: c.cod }, h('button', { type: 'button', className: 'zcz-ciu', 'aria-current': c.cod === cod ? 'true' : 'false', 'data-cod': c.cod, onClick: () => elegirCiudad(c.cod) },
            h('span', { style: { minWidth: 0 } }, h('span', { style: { display: 'block', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)' } }, c.nombre),
              h('span', { style: { display: 'block', fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.4 } }, c.provNombre + ' · código ' + c.cod + (c.nombre !== c.oficialTxt ? ' · ' + c.oficialTxt : ''))),
            h('span', { style: { alignSelf: 'center', flex: '0 0 auto' } }, n ? chip('Sin publicar', 'warning') : z ? chip(na + (na === 1 ? ' zona' : ' zonas'), 'brand') : null))); })
          : h('li', { style: { padding: '10px 16px', fontSize: 13, color: 'var(--text-muted)' } }, 'Ninguna ciudad coincide.')),
      h('p', { 'data-zcz-fuente': '', style: { margin: 0, padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 12, lineHeight: 1.45, color: 'var(--text-muted)' } },
        'Fuente: INEC, Clasificador Geográfico Estadístico 2026 · ' + S.ciudades().length + ' cantones activos y ' + S.enEstudio() + ' en estudio · estructura del catálogo CANTON de gobernanza.'));
    // Centro: el mapa con el recuadro del modo y el aviso con Deshacer.
    let modo = null;
    if (s.herr === 'agregar') modo = h(React.Fragment, null, 'Nueva zona ', h('b', null, (s.agr.n || '').trim() || 'sin nombre'), ': haz clic en el mapa donde está su centro.', h('br'), 'Esc: cancelar');
    else if (s.herr === 'area') { const n = s.area.tmp.length, x = cz && cz.zonas.find((y) => y.id === s.area.id);
      modo = h(React.Fragment, null, 'Área de ', h('b', null, x ? x.nombre : ''), ' · ' + n + (n === 1 ? ' punto' : ' puntos'), h('br'), 'Clic: agregar punto · ' + (n >= 3 ? 'clic en el primer punto o doble clic: cerrar' : 'faltan ' + (3 - n) + ' para poder cerrar'), h('br'), 'Retroceso: deshacer el último · Esc: cancelar',
        s.area.err ? h(React.Fragment, null, h('br'), h('b', { style: { color: 'var(--color-danger,#B3261E)' } }, s.area.err)) : null); }
    const centro = h('div', { style: { flex: '1 1 auto', minWidth: 0, position: 'relative', background: '#E6ECF1' } },
      h('div', { ref: mapEl, role: 'application', 'aria-label': 'Mapa de ' + ciu.nombre + ' con sus zonas', style: { position: 'absolute', inset: 0 } }),
      !modo && !S.centro(cod) ? h('div', { role: 'note', 'data-zcz-sincentro': '', style: { pointerEvents: 'none', position: 'absolute', top: 12, left: 56, zIndex: 950, background: '#fff', borderRadius: 10, padding: '8px 12px', boxShadow: '0 2px 8px rgba(1,30,65,.18)', fontSize: 13, color: 'var(--text-strong)', maxWidth: '62%' } }, 'Aún no hay un centro aproximado para ' + ciu.nombre + ': el mapa no se mueve. Puedes probar una dirección o agregar zonas igual.') : null,
      modo ? h('div', { 'data-zcz-modo': '', role: 'status', style: { pointerEvents: 'none', position: 'absolute', top: 12, left: 56, zIndex: 950, background: '#fff', borderRadius: 10, padding: '8px 12px', boxShadow: '0 2px 8px rgba(1,30,65,.18)', fontSize: 13, lineHeight: 1.45, color: 'var(--text-strong)', maxWidth: '62%' } }, modo) : null,
      s.toast ? h('div', { role: 'status', 'aria-live': 'polite', 'data-zcz-aviso': '', style: { position: 'absolute', left: '50%', bottom: 26, transform: 'translateX(-50%)', zIndex: 960, background: 'var(--text-strong,#011E41)', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 14, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.25)', maxWidth: '90%' } },
        h('span', null, s.toast.txt), s.toast.acc ? h('button', { type: 'button', onClick: () => { const a = s.toast.acc; s.toast = null; a.f(s); rer(); }, style: { background: 'none', border: 0, color: '#7FD8FA', font: '700 14px var(--font-brand)', cursor: 'pointer', padding: 0, textDecoration: 'underline' } }, s.toast.acc.t) : null) : null);
    // Derecha: cabecera, cuerpo y pie.
    const cab = h('div', { style: { flex: '0 0 auto', padding: '16px 20px 12px', borderBottom: '1px solid var(--border-subtle)' } },
      h('h2', { style: { margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-strong)' } }, ciu.nombre),
      h('p', { style: { margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' } }, ciu.provNombre + ' · código INEC ' + cod + (ciu.nombre !== ciu.oficialTxt ? ' · ' + ciu.oficialTxt : '')),
      h('p', { 'data-zcz-resumen': '', style: { margin: '6px 0 0', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' } }, act.length + (act.length === 1 ? ' zona activa' : ' zonas activas') + (cz && cz.radio ? ' · Radio ' + String(cz.radio).replace('.', ',') + ' km' : '') + (ina.length ? ' · ' + ina.length + (ina.length === 1 ? ' inactiva' : ' inactivas') : '')),
      act.length > S.MAX_ZONAS ? h('p', { role: 'note', style: { margin: '8px 0 0', padding: '8px 10px', borderRadius: 8, background: 'var(--gold-100,#FFF4D6)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' } }, 'Más de 8 zonas: cuesta configurar la cobertura') : null);
    const tarjeta = (x) => { const inac = !S.activa(x), area = S.tieneArea(x), av = S.avisosArea(cz, x), ed = puede && !s.herr;
      return h('div', { key: x.id, className: 'zcz-card' + (x.id === s.nueva ? ' nueva' : ''), 'data-id': x.id, 'data-foco': x.id === s.resaltada ? '1' : '0', style: { '--zc': col(x) }, onMouseEnter: () => { if (!inac) resaltar(x.id, false); } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          h('input', { className: 'zcz-nom', 'data-zn': x.id, value: s.nomEd[x.id] !== undefined ? s.nomEd[x.id] : x.nombre, readOnly: !ed || inac, 'aria-label': 'Nombre de la zona ' + x.nombre, title: ed && !inac ? 'Clic para cambiar el nombre' : undefined,
            onChange: (e) => { s.nomEd[x.id] = e.target.value; rer(); }, onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); s.nomEd[x.id] = x.nombre; delete s.nomEd[x.id]; rer(); setTimeout(() => e.target.blur(), 0); } },
            onBlur: (e) => { if (s.nomEd[x.id] !== undefined) renombrar(x, s.nomEd[x.id]); } }),
          inac ? chip('Inactiva', 'neutral') : area ? chip('Área · ' + x.area.length + ' pts', 'brand') : chip('Punto', 'neutral')),
        av.length && !inac ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, margin: '4px 0 2px 6px' } }, av.map((a, i) => h('span', { key: i, role: 'note', 'data-zcz-avisoarea': '', style: { fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: 'var(--text-strong)', background: 'var(--gold-100,#FFF4D6)', borderRadius: 6, padding: '3px 8px' } }, a))) : null,
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 } }, inac ? (ed ? h('button', { type: 'button', className: 'zcz-mb', onClick: () => ponerEstado(x, 'Activa') }, 'Activar') : null)
          : [h('button', { key: 'v', type: 'button', className: 'zcz-mb', onClick: () => verZona(x) }, 'Ver'),
            ed ? h('button', { key: 'd', type: 'button', className: 'zcz-mb', onClick: () => { s.herr = 'area'; s.area = { id: x.id, tmp: [], err: '' }; s.resaltada = x.id; s.toast = null; rer(); } }, area ? 'Redibujar' : 'Dibujar área') : null,
            ed && area ? h('button', { key: 'q', type: 'button', className: 'zcz-mb', onClick: () => soloPunto(x) }, 'Volver a solo punto') : null,
            ed ? h('button', { key: 'i', type: 'button', className: 'zcz-mb gris', onClick: () => ponerEstado(x, 'Inactiva') }, 'Desactivar') : null])); };
    const nombreNuevo = (v) => { s.agr.n = v; const t = v.trim(); s.agr.err = t && S.nombreRepetido(cod, t) ? 'Ya hay una zona con ese nombre en ' + ciu.nombre + '.' : ''; rer(); };
    let rTxt = null; if (s.prueba) { if (s.prueba.sinUbicar) rTxt = res('warn', 'Zona por confirmar', 'La dirección no se pudo ubicar en el mapa. El Coordinador marca el punto o confirma la zona; mientras tanto se ofrece a quienes cubren toda la ciudad.');
      else { const r = S.zonaDe(cod, s.prueba.p);
        rTxt = r.tipo === 'area' ? res('ok', 'Zona ' + r.zona.nombre, 'Dentro de su área dibujada' + (r.varias > 1 ? ' (cae en ' + r.varias + ' áreas: gana la del punto más cercano)' : '') + '.')
          : r.tipo === 'punto' && r.lejos ? res('warn', 'Zona ' + r.zona.nombre + ' · lejos del centro', 'Es la zona más cercana, a ' + S.fmtKm(r.distanciaKm) + ' de su punto, fuera del radio de referencia (' + r.radio + ' km). Queda asignada; el Coordinador puede revisarla.')
            : r.tipo === 'punto' ? res('ok', 'Zona ' + r.zona.nombre, 'Es la más cercana: su punto está a ' + S.fmtKm(r.distanciaKm) + '.') : res('info', ciu.nombre + ' · sin zonas', 'Se asigna por ciudad.'); } }
    const hist = S.historial(cod);
    const cuerpo = h('div', { 'data-zcz-cuerpo': '', style: { flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '14px 20px 18px' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 } }, h('h3', { style: { margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' } }, 'Zonas'),
        puede && !s.herr ? btn('primary', 'Agregar zona', () => { s.herr = 'agregar'; s.agr = { n: '', err: '' }; s.foco = true; s.toast = null; rer(); }, { id: 'zcz-agregar' }) : null),
      s.herr === 'agregar' ? h('div', { role: 'group', 'aria-label': 'Zona nueva', style: { border: '1.5px dashed var(--color-brand)', borderRadius: 10, padding: 12, marginBottom: 10, background: 'var(--cyan-100)' } },
        h('label', { htmlFor: 'zcz-nueva', style: { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 } }, 'Nombre de la zona nueva'),
        h('input', { id: 'zcz-nueva', className: 'zcz-in', value: s.agr.n, placeholder: 'Por ejemplo: Norte', 'aria-invalid': s.agr.err ? 'true' : 'false', 'aria-describedby': 'zcz-nueva-err', onChange: (e) => nombreNuevo(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } } }),
        h('div', { id: 'zcz-nueva-err', role: s.agr.err ? 'alert' : undefined, style: { color: 'var(--color-danger,#B3261E)', fontSize: 13, minHeight: s.agr.err ? 18 : 0, marginTop: 4 } }, s.agr.err),
        h('p', { style: { margin: '4px 0 8px', fontSize: 13, color: 'var(--text-muted)' } }, 'Ahora haz clic en el mapa donde está el centro de la zona. Luego podrás arrastrarlo. Sin nombre, se llama «Zona ' + ((cz ? cz.zonas.length : 0) + 1) + '».'),
        btn('secondary', 'Cancelar', cancelar)) : null,
      s.herr === 'area' ? (() => { const x = cz && cz.zonas.find((y) => y.id === s.area.id), n = s.area.tmp.length; return h('div', { role: 'group', 'aria-label': 'Dibujo del área', style: { border: '1.5px dashed var(--color-brand)', borderRadius: 10, padding: 12, marginBottom: 10, background: 'var(--cyan-100)' } },
        h('strong', { style: { color: 'var(--text-strong)' } }, 'Dibujando el área de ' + (x ? x.nombre : '')),
        h('p', { style: { margin: '4px 0 8px', fontSize: 13, color: 'var(--text-muted)' } }, n + (n === 1 ? ' punto' : ' puntos') + '. Cierra con clic en el primer punto, con doble clic o con «Cerrar área».'),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, btn('primary', 'Cerrar área', cerrarArea, { disabled: n < 3 }), btn('secondary', 'Deshacer punto', deshacerPunto, { disabled: !n }), btn('ghost', 'Cancelar', cancelar)),
        s.area.err ? h('div', { role: 'alert', style: { marginTop: 8, borderRadius: 8, background: 'var(--red-100,#FDECEA)', color: 'var(--color-danger,#B3261E)', padding: '8px 10px', fontSize: 13, fontWeight: 600 } }, s.area.err) : null); })() : null,
      !act.length && s.herr !== 'agregar' ? res('info', 'Esta ciudad no tiene zonas', 'Las inspecciones aquí se asignan por ciudad.' + (puede ? ' Agrega zonas solo si la ciudad es grande y conviene repartirla.' : ''))
        : act.length ? h('p', { style: { margin: '-4px 0 10px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 } }, 'Una dirección queda en la zona del punto más cercano: ninguna parte de la ciudad queda sin zona. Un área dibujada manda sobre el punto.') : null,
      act.map(tarjeta),
      ina.length ? h('details', { className: 'zcz-sec' }, h('summary', null, 'Inactivas (' + ina.length + ')'), h('div', { style: { marginTop: 10 } }, ina.map(tarjeta))) : null,
      h('details', { className: 'zcz-sec', id: 'zcz-probar', open: s.secProbar, onToggle: (e) => { s.secProbar = e.target.open; } }, h('summary', null, 'Probar una dirección'),
        h('div', { style: { marginTop: 10 } }, h('label', { htmlFor: 'zcz-dir', style: { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 } }, 'Dirección de prueba'),
          h('select', { id: 'zcz-dir', className: 'zcz-in', value: s.dir, onChange: (e) => elegirDir(e.target.value), style: { paddingRight: 8 } }, h('option', { value: '' }, 'Elige una o haz clic en el mapa'),
            S.DIRECCIONES.map((d, i) => h('option', { key: i, value: String(i) }, d.t + ' · ' + ((S.ciudad(d.c) || {}).nombre || d.c)))),
          rTxt)),
      cz ? h('details', { className: 'zcz-sec' }, h('summary', null, 'Ajustes de la ciudad'), h('div', { style: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 } },
        h('label', { htmlFor: 'zcz-radio', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Radio de referencia (km)'),
        h('input', { id: 'zcz-radio', className: 'zcz-in', type: 'number', min: 1, max: 60, step: 0.5, disabled: !puede, value: s.radioEd !== null ? s.radioEd : (cz.radio || ''), style: { maxWidth: 140 }, onChange: (e) => { s.radioEd = e.target.value; rer(); }, onBlur: () => { if (s.radioEd !== null) ponerRadio(s.radioEd); }, onKeyDown: (e) => { if (e.key === 'Enter') e.target.blur(); } }),
        h('span', { style: { fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.45 } }, 'Se dibuja alrededor de cada punto como guía. Una dirección más lejos se asigna igual a la zona más cercana y se marca «lejos del centro».'),
        h('label', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-strong)', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: s.radios, onChange: (e) => { s.radios = e.target.checked; rer(); } }), 'Ver los radios en el mapa'))) : null,
      h('details', { className: 'zcz-sec', open: s.secHist, onToggle: (e) => { s.secHist = e.target.open; } }, h('summary', null, 'Historial de publicaciones (' + hist.length + ')'),
        h('ol', { 'data-zcz-hist': '', style: { listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 } }, hist.map((x, i) => h('li', { key: i, style: { borderLeft: '3px solid var(--border-default)', paddingLeft: 10, fontSize: 13, lineHeight: 1.45, color: 'var(--text-body)' } },
          h('strong', { style: { display: 'block', color: 'var(--text-strong)' } }, 'Versión ' + x.version + ' · ' + x.fecha + (x.por ? ' · ' + x.por : '')),
          h('span', { style: { display: 'block' } }, 'Motivo: ' + x.motivo), x.cambios.length ? h('ul', { style: { margin: '2px 0 0', paddingLeft: 18 } }, x.cambios.map((c, k) => h('li', { key: k }, c))) : null,
          h('span', { style: { display: 'block', color: 'var(--text-muted)' } }, x.estado)))))) ;
    const motOk = String(s.motivo).trim().length >= 10;
    const pie = h('div', { 'data-zcz-pie': '', style: { flex: '0 0 auto', borderTop: '1px solid var(--border-subtle)', background: '#fff', padding: '12px 20px 14px', boxShadow: '0 -4px 12px rgba(1,30,65,.06)' } },
      nc && puede ? h(React.Fragment, null,
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 } }, h('strong', { 'data-zcz-pendientes': String(nc), style: { fontSize: 14, color: 'var(--text-strong)' } }, nc + (nc === 1 ? ' cambio sin publicar' : ' cambios sin publicar')),
          h('button', { type: 'button', className: 'zcz-mb gris', onClick: descartar }, 'Descartar')),
        h('details', { open: s.verCambios, onToggle: (e) => { s.verCambios = e.target.open; }, style: { fontSize: 13, margin: '0 0 8px' } }, h('summary', { style: { cursor: 'pointer', color: 'var(--cyan-700)', fontWeight: 700 } }, 'Ver cambios'),
          h('ul', { 'data-zcz-cambios': '', style: { margin: '6px 0 0', paddingLeft: 18, maxHeight: 96, overflowY: 'auto', color: 'var(--text-body)' } }, S.cambios(cod).map((x, i) => h('li', { key: i }, x.t)))),
        h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
          h('input', { id: 'zcz-motivo', className: 'zcz-in', value: s.motivo, placeholder: 'Motivo (mínimo 10 caracteres)', 'aria-label': 'Motivo de la publicación', onChange: (e) => { s.motivo = e.target.value; s.errPub = ''; rer(); }, onKeyDown: (e) => { if (e.key === 'Enter' && motOk) publicar(); }, style: { flex: 1, minWidth: 0 } }),
          btn('primary', s.publicando ? 'Publicando…' : 'Publicar', publicar, { disabled: !motOk || s.publicando, size: 'md', id: 'zcz-publicar' })),
        s.errPub ? h('p', { role: 'alert', style: { margin: '8px 0 0', fontSize: 13, fontWeight: 600, color: 'var(--color-danger,#B3261E)' } }, s.errPub) : null)
        : h(React.Fragment, null,
          h('p', { 'data-zcz-publicado': '', style: { margin: '0 0 8px', fontSize: 14, color: 'var(--text-muted)' } }, h('strong', { style: { color: 'var(--text-strong)' } }, 'Publicado'), ' · versión ' + S.version() + ' · ' + S.fechaVersion()),
          puede ? h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h('input', { className: 'zcz-in', disabled: true, placeholder: 'Haz un cambio para publicar', 'aria-label': 'Motivo de la publicación', style: { flex: 1, minWidth: 0 } }), btn('primary', 'Publicar', () => {}, { disabled: true, size: 'md', id: 'zcz-publicar' }))
            : h('p', { role: 'note', style: { margin: 0, fontSize: 13, color: 'var(--text-muted)' } }, 'Solo lectura: solo el Administrador edita y publica las zonas.')));
    const der = h('div', { style: { width: wDer, flex: '0 0 ' + wDer + 'px', borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' } }, cab, cuerpo, pie);
    return h('section', { ref: raiz, 'data-screen-label': 'Ciudades y zonas', 'aria-label': 'Ciudades y zonas', 'data-zcz-lectura': puede ? '0' : '1', style: { display: 'flex', height: alto, minHeight: 460, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md,12px)', overflow: 'hidden', fontFamily: 'var(--font-brand)', color: 'var(--text-body)', background: '#fff' } }, izq, centro, der);
  }
  W.SiriusCiudadesZonas = SiriusCiudadesZonas;
})();
