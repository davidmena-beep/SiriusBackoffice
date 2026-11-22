// SIRIUS · Lugar de la inspección en el portal del cliente (v1.0 · etapa G-2d · DEC-222 y DEC-224 · 18/10/2026).
// Primero el lugar, después los horarios: los horarios dependen de los inspectores que cubren ese lugar (ciudad y zona).
// Lo usan el autoagendamiento del portal del caso (sirius-portal-caso.js: 1 Lugar · 2 Horario · 3 Confirmación) y la autoinspección
// (sirius-portal.js: 1 Lugar · 2 Autoinspección). Reutiliza SiriusMapa, SiriusZonas, SiriusUbicacion, SiriusLugar y SiriusCobertura.
// Lugar = el de SiriusLugar { provincia, ciudad, direccion, referencia, punto, zona { id, nombre } | null, estadoZona, lejos, origen ('GPS' | 'Búsqueda' | 'Mapa' | 'Solicitud') }.
// Cómo se ubica el cliente (DEC-222): «Usar mi ubicación» (GPS del celular, con permiso) o escribir la dirección y elegir una sugerencia (SiriusUbicacion.buscar);
// el punto aparece en un mapa pequeño que se puede arrastrar. Ramos Generales no móviles: el lugar viene de la solicitud y el cliente solo lo confirma.
// Uso: SiriusPortalLugar.Paso({ lugar, onCambio, ciudadCaso, fijo, solicitud, resp, onResp, tried, color, oscuro, sim }), valido(...), textoCorto(l),
//   mensaje(l), deSolicitud(datos), sucursalDe(l, porDefecto), ciudadDePunto(pt), direccionCerca(pt), origenTxt(l), escena(e) (datos de las escenas G-2d).
(function () {
  'use strict';
  const W = window; if (W.SiriusPortalLugar) return;
  const R = () => W.React, h = (...a) => R().createElement(...a);
  const SL = () => W.SiriusLugar, Z = () => W.SiriusZonas, U = () => W.SiriusUbicacion, SM = () => W.SiriusMapa, CB = () => W.SiriusCobertura;
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const C = { strong: 'var(--text-strong, #0B2E59)', body: 'var(--text-body, #2b3a4d)', muted: 'var(--text-muted, #5b6b80)', line: '#dde3ea', ok: '#1f7a5c', okbg: '#e7f4ee', warn: '#7A4F0E', warnbg: '#FFF4DC', bad: '#B3261E', badbg: '#FDECEA' };
  const PL = { version: '1.0', sim: { gps: null, ajuste: null, buscar: '', elegir: null, resp: null, rgDir: '' } };

  // ---------- cálculos ----------
  const km = (a, b) => { const Rr = 6371, t = (x) => x * Math.PI / 180, dl = t(b[0] - a[0]), dn = t(b[1] - a[1]); const x = Math.sin(dl / 2) ** 2 + Math.cos(t(a[0])) * Math.cos(t(b[0])) * Math.sin(dn / 2) ** 2; return 2 * Rr * Math.asin(Math.sqrt(x)); };
  // Ciudad de un punto del GPS: la del centro más cercano (a menos de 40 km); en producción la da el servicio de mapas de la base.
  PL.ciudadDePunto = (pt) => { const G = Z() ? Z().geo() : {}, cen = G.centros || {}; let best = '', d0 = 1e9; Object.keys(cen).forEach((cod) => { const d = km(pt, cen[cod]); if (d < d0) { d0 = d; best = cod; } }); return d0 <= 40 ? best : ''; };
  // Dirección de referencia cerca del punto (diccionario de prueba, a menos de 1,5 km); en producción, el servicio de mapas.
  PL.direccionCerca = (pt) => { const L = (U() && U().DIRECCIONES) || []; let best = null, d0 = 1e9; L.forEach((x) => { if (!x.punto) return; const d = km(pt, x.punto); if (d < d0) { d0 = d; best = x; } }); return best && d0 <= 1.5 ? best.texto : ''; };
  PL.ciudadNombre = (cod) => (SL() ? SL().ciudadNombre(cod) : String(cod || ''));
  // «Quito · Zona Norte», «Ambato» (ciudad sin zonas) o «Quito · zona por confirmar».
  PL.textoCorto = (l) => { if (!l || !l.ciudad) return ''; const c = PL.ciudadNombre(l.ciudad); return l.estadoZona === 'Sin zonas' ? c : l.zona ? c + ' · Zona ' + l.zona.nombre : c + ' · zona por confirmar'; };
  // Sucursal con la que se mira la cobertura: la que tiene el nombre de la ciudad del lugar; si no hay, la del caso.
  PL.sucursalDe = (l, def) => { if (!l || !l.ciudad) return def || ''; const n = norm(PL.ciudadNombre(l.ciudad)), L = CB() && CB().sucursales ? CB().sucursales() : []; const s = L.find((x) => norm(x) === n); return s || def || ''; };
  PL.origenTxt = (l) => (!l ? '' : l.origen === 'GPS' ? 'GPS' : l.origen === 'Mapa' ? 'mapa' : l.origen === 'Solicitud' ? 'solicitud' : 'dirección buscada');
  // Mensaje de zona, debajo del mapa.
  PL.mensaje = (l, fijo) => { if (!l || !l.ciudad) return null; const c = PL.ciudadNombre(l.ciudad);
    if (l.estadoZona === 'Por confirmar') return fijo ? { tono: 'warn', titulo: 'Esta dirección queda por confirmar', texto: 'Un coordinador confirmará la zona antes de tu visita.' } : { tono: 'warn', titulo: 'No pudimos ubicar tu dirección', texto: 'Toca el mapa o continúa; un coordinador confirmará la zona.' };
    return { tono: 'ok', titulo: 'Tu inspección será en ' + (l.estadoZona === 'Sin zonas' ? c : c + ' · Zona ' + (l.zona ? l.zona.nombre : '')), texto: l.punto && !fijo ? 'Si el punto no es correcto, muévelo.' : '' }; };
  // Lugar de la solicitud (Ramos Generales no móviles): el del enlace o la dirección con su ciudad y su punto.
  PL.deSolicitud = (d) => { const S = SL(); if (!S || !d) return null; if (d.lugarSolicitud) return S.calcular(Object.assign({}, d.lugarSolicitud, { origen: 'Solicitud' }));
    const dir = String(d.direccion || ''), partes = dir.split(',').map((x) => x.trim()).filter(Boolean), ciu = partes.map((x) => S.ciudadDe(x)).filter(Boolean).pop() || S.ciudadDe(d.zona) || '';
    const g = d.l && Array.isArray(d.l.gps) ? d.l.gps : null; return S.calcular({ ciudad: ciu, direccion: dir, referencia: d.referencia || '', punto: g, origen: 'Solicitud' }); };
  // ¿Se puede seguir? Con lugar, ciudad y una dirección exacta (Ramos Generales: con la respuesta y, si dijo que no, la dirección correcta).
  PL.faltaTxt = (l, fijo, resp) => { if (fijo && !resp) return 'Responde si la inspección es en esta dirección'; if (!l || !l.ciudad) return 'Usa tu ubicación o escribe la dirección';
    if (String(l.direccion || '').trim().length < 8) return fijo ? 'Escribe la dirección correcta' : 'Escribe la dirección exacta'; return ''; };
  PL.valido = (l, fijo, resp) => !PL.faltaTxt(l, fijo, resp);

  // ---------- escenas (etapa G-2d) ----------
  // Cobertura de demostración: quién cubre qué en Quito, Guayaquil, Ambato y Cuenca (para que se vea el filtro por lugar).
  // R-5b · DEC-266: son filas de la Red de la sesión (SiriusCobertura.fijarFilas); una ciudad entera = fila «ciudad», cada zona = fila «zona».
  const Z_ = (cod, ...zonas) => (zonas.length ? zonas.map((z) => ({ nivel: 'zona', ciudad: cod, zona: z })) : [{ nivel: 'ciudad', ciudad: cod }]);
  const COB = () => ({
    'Marco Tapia': Z_('1701', 'z1701-1', 'z1701-2'),
    'Cristian Vaca': Z_('1701', 'z1701-3').concat(Z_('1308')),
    'Luis Andrade': Z_('1701', 'z1701-1').concat(Z_('1801')),
    'Diana Cárdenas': Z_('1701').concat(Z_('0901')),
    'Paola Vinueza': Z_('0901', 'z0901-1', 'z0901-2'),
    'Jorge Pazmiño': Z_('1801').concat(Z_('0101')),
    'Mauricio Endara': Z_('1701', 'z1701-1', 'z1701-2'),
    'Sofía Arteaga': Z_('1701', 'z1701-5').concat(Z_('0101')),
    'Pedro Lasso': Z_('0901').concat(Z_('1308')) });
  PL.ESCENAS = ['portallugargps', 'portallugarbuscar', 'portalsinubicar', 'portalsinhorarios', 'portalrgconfirmar', 'portalautoinsplugar'];
  PL.GPS_QUITO_NORTE = [-0.1525, -78.4835];
  // Prepara una escena: cobertura de demostración, GPS simulado (o denegado con ?fgps=denegado) y qué hace sola. Devuelve el lugar con el que abre (o null).
  PL.escena = (e, q) => { q = q || {}; PL.sim = { gps: null, ajuste: null, buscar: '', elegir: null, resp: null, rgDir: '', paso: '' }; if (PL.ESCENAS.indexOf(e) < 0) return null;
    const C0 = CB(); if (C0 && C0.fijarFilas) { const s = COB(); if (e === 'portalsinhorarios') s['Diana Cárdenas'] = Z_('0901'); Object.keys(s).forEach((n) => { C0.fijarFilas(n, s[n]); }); }
    const den = q.gps === 'denegado';
    if (e === 'portallugargps' || e === 'portalautoinsplugar') { PL.sim.gps = den ? 'denegado' : { punto: PL.GPS_QUITO_NORTE.slice() }; if (e === 'portallugargps' && !den) PL.sim.ajuste = [-0.1478, -78.4800]; PL.sim.auto = !q.manual; }
    if (e === 'portallugarbuscar') { PL.sim.buscar = 'Kennedy Norte'; PL.sim.elegir = 0; PL.sim.auto = !q.manual; }
    if (e === 'portalsinubicar') { PL.sim.buscar = 'calle 123'; PL.sim.elegir = 'tal cual'; PL.sim.auto = !q.manual; }
    if (e === 'portalsinhorarios') { PL.sim.buscar = 'Conocoto'; PL.sim.elegir = 0; PL.sim.auto = !q.manual; }
    if (e === 'portalrgconfirmar') { PL.sim.resp = 'no'; PL.sim.rgDir = 'Av. Abdón Calderón y Montúfar, Conocoto, galpón azul junto a la gasolinera'; PL.sim.auto = !q.manual; }
    PL.sim.paso = q.paso || ''; // las escenas terminan en Horario (?fpaso=lugar: se quedan en Lugar); la de Ramos Generales se queda en Lugar (?fpaso=horario: avanza)
    PL.sim.avanzar = ['portallugargps', 'portallugarbuscar', 'portalsinubicar', 'portalsinhorarios'].indexOf(e) >= 0 ? q.paso !== 'lugar' : e === 'portalrgconfirmar' ? q.paso === 'horario' : false; if (den) PL.sim.avanzar = false;
    return PL.sim; };

  // ---------- componente: paso «Lugar» ----------
  let css = false;
  const ponerCss = () => { if (css || !W.document) return; css = true; const s = document.createElement('style'); s.setAttribute('data-portal-lugar', '1');
    s.textContent = '.ppl-sug button:hover,.ppl-sug button:focus-visible{background:#eef5fd}.ppl-in:focus{outline:2px solid #0B5CAD;outline-offset:1px}@media (prefers-reduced-motion: reduce){.ppl-spin{animation:none!important}}@keyframes pplspin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s); };
  const aviso = (m, k, id) => (!m ? null : h('div', { key: k, id, role: 'status', 'data-pl-zona': m.tono, style: { display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 12px', borderRadius: 10, background: m.tono === 'ok' ? C.okbg : m.tono === 'bad' ? C.badbg : C.warnbg, color: m.tono === 'ok' ? C.ok : m.tono === 'bad' ? C.bad : C.warn, fontSize: 14, lineHeight: 1.45 } },
    h('b', null, m.titulo), m.texto ? h('span', null, m.texto) : null));

  // Mapa pequeño con el punto (arrastrable si se puede ajustar). Tocar el mapa marca el punto cuando la dirección no se ubicó.
  function Mini(p) {
    const ref = R().useRef(null), inst = R().useRef(null), mk = R().useRef(null), cb = R().useRef(p.onPunto); cb.current = p.onPunto;
    const l = p.lugar || {}, centro = l.punto || (Z() && l.ciudad ? Z().centro(l.ciudad) : null) || [-0.205, -78.49];
    R().useEffect(() => { const M = SM(); if (!M || !ref.current) return; const m = M.crear(ref.current, { centro, zoom: l.punto ? 15 : 12, notaArriba: true }); inst.current = m;
      if (m && m.map) m.map.on('click', (ev) => { if (cb.current && p.puedeTocar) cb.current([ev.latlng.lat, ev.latlng.lng], 'toque'); });
      const t = setTimeout(() => m && m.invalidar(), 120); return () => { clearTimeout(t); if (m) m.destruir(); inst.current = null; mk.current = null; }; }, []);
    R().useEffect(() => { const m = inst.current, M = SM(); if (!m || !M) return; if (mk.current) { m.capa.removeLayer(mk.current); mk.current = null; }
      if (l.punto) { const L = m.L, k = L.marker(l.punto, { icon: M.pinCaso(), draggable: !!p.arrastrable, keyboard: false, title: 'Punto de la inspección' }).addTo(m.capa); mk.current = k;
        if (p.arrastrable) k.on('dragend', (ev) => { const ll = ev.target.getLatLng(); if (cb.current) cb.current([ll.lat, ll.lng], 'arrastre'); }); m.vista(l.punto, Math.max(m.map.getZoom(), 14)); }
      else m.vista(centro, 12); }, [l.punto ? l.punto.join(',') : '', l.ciudad, !!p.arrastrable]);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
      h('div', { ref, 'data-pl-mapa': '1', role: 'application', 'aria-label': 'Mapa del lugar de la inspección' + (p.arrastrable ? ': arrastra el punto para ajustarlo' : ''), style: { height: 190, borderRadius: 12, overflow: 'hidden', border: '1px solid ' + C.line } }),
      p.arrastrable || p.puedeTocar ? h('span', { style: { fontSize: 12, color: C.muted } }, p.arrastrable ? 'Arrastra el punto si no está en el lugar correcto.' : 'Toca el mapa para marcar el lugar.') : null); }

  function Paso(p) {
    ponerCss();
    const l = p.lugar || null, fijo = !!p.fijo, sim = !!p.sim, sol = p.solicitud || null, color = p.color || '#0B5CAD';
    const s0 = R().useState({ q: '', sug: [], buscando: false, gps: '', abierta: false }), st = s0[0], setSt = s0[1], set = (o) => setSt((x) => Object.assign({}, x, o));
    const inRef = R().useRef(null), cambiar = (nl, extra) => { if (p.onCambio) p.onCambio(nl, extra); };
    const ciudadCaso = p.ciudadCaso || (sol && sol.ciudad) || '';
    // Búsqueda con sugerencias (SiriusUbicacion.buscar)
    R().useEffect(() => { const q = st.q; if (!st.abierta || q.trim().length < 3 || !U()) { if (st.sug.length) set({ sug: [] }); return; } let vivo = true; set({ buscando: true });
      const t = setTimeout(() => { U().buscar(q, ciudadCaso).then((r) => { if (vivo) set({ sug: r || [], buscando: false }); }, () => { if (vivo) set({ sug: [], buscando: false }); }); }, 250); return () => { vivo = false; clearTimeout(t); }; }, [st.q, st.abierta]);
    const elegir = (x) => { const S = SL(); if (!S) return; const ciudad = x.ciudad || ciudadCaso; cambiar(S.calcular({ ciudad, provincia: S.provDe(ciudad), direccion: x.texto, referencia: (l && l.referencia) || '', punto: x.punto, origen: 'Búsqueda' }), { como: 'Búsqueda', texto: x.texto }); set({ q: '', sug: [], abierta: false, gps: '' }); };
    const talCual = () => { const S = SL(), q = st.q.trim(); if (!S || q.length < 3) return; cambiar(S.calcular({ ciudad: ciudadCaso, provincia: S.provDe(ciudadCaso), direccion: q, referencia: (l && l.referencia) || '', punto: null, origen: 'Búsqueda' }), { como: 'Búsqueda', texto: q }); set({ q: '', sug: [], abierta: false, gps: '' }); };
    const conPunto = (pt, como) => { const S = SL(); if (!S || !l) return; const nuevo = !l.punto; cambiar(S.calcular(Object.assign({}, l, { punto: pt, zona: null, estadoZona: '', origen: nuevo ? 'Mapa' : l.origen })), { como: como === 'arrastre' ? 'ajuste' : 'Mapa' }); };
    const usarGps = () => { set({ gps: 'buscando' }); const fin = (pt) => { const S = SL(); if (!S) return; const ciudad = PL.ciudadDePunto(pt) || ciudadCaso; cambiar(S.calcular({ ciudad, provincia: S.provDe(ciudad), punto: pt, direccion: PL.direccionCerca(pt) || '', referencia: (l && l.referencia) || '', origen: 'GPS' }), { como: 'GPS' }); set({ gps: '' }); };
      const err = () => { set({ gps: 'error', abierta: true }); setTimeout(() => { try { if (inRef.current) inRef.current.focus(); } catch (e) { /* nada */ } }, 60); if (p.onGpsError) p.onGpsError(); };
      const sg = PL.sim.gps; if (sg === 'denegado') { setTimeout(err, 300); return; } if (sg && sg.punto) { setTimeout(() => fin(sg.punto.slice()), 300); return; }
      try { if (!navigator.geolocation) { err(); return; } navigator.geolocation.getCurrentPosition((x) => fin([x.coords.latitude, x.coords.longitude]), err, { timeout: 8000, maximumAge: 60000, enableHighAccuracy: true }); } catch (e) { err(); } };
    // Escenas: el recorrido se hace solo (GPS y ajuste, búsqueda y sugerencia, «tal cual», respuesta de Ramos Generales).
    const hecho = R().useRef(false);
    R().useEffect(() => { if (hecho.current || !PL.sim.auto || sim) return; hecho.current = true; const S = PL.sim;
      if (fijo) { if (S.resp && p.onResp) setTimeout(() => { p.onResp(S.resp); if (S.resp === 'no' && S.rgDir && SL()) cambiar(SL().calcular({ ciudad: (sol && sol.ciudad) || ciudadCaso, direccion: S.rgDir, referencia: '', punto: null, origen: 'Búsqueda' }), { como: 'corrige' }); }, 300); return; }
      if (S.gps) { setTimeout(usarGps, 300); if (S.ajuste) setTimeout(() => { const lp = PL._ultimo; if (lp && SL()) cambiar(SL().calcular(Object.assign({}, lp, { punto: S.ajuste.slice(), zona: null, estadoZona: '' })), { como: 'ajuste' }); }, 1100); return; }
      if (S.buscar) { set({ q: S.buscar, abierta: true }); setTimeout(() => { const r = U() ? U().buscarLocal(S.buscar, ciudadCaso) : []; if (S.elegir === 'tal cual' || !r.length) { const SS = SL(); if (SS) cambiar(SS.calcular({ ciudad: ciudadCaso, provincia: SS.provDe(ciudadCaso), direccion: S.buscar, referencia: '', punto: null, origen: 'Búsqueda' }), { como: 'Búsqueda', texto: S.buscar }); set({ q: '', sug: [], abierta: false }); } else elegir(r[S.elegir || 0]); }, 700); } }, []);
    PL._ultimo = l;
    const campo = (id, lab, val, on, o) => { o = o || {}; const err = o.err || ''; return h('div', { key: id, style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id, style: { fontSize: 13, fontWeight: 800, color: C.muted } }, lab),
      h(o.area ? 'textarea' : 'input', { id, className: 'ppl-in', rows: o.area ? 2 : undefined, value: val || '', placeholder: o.ph, autoComplete: 'off', 'aria-invalid': err ? 'true' : 'false', 'aria-describedby': err ? id + '-e' : undefined, onChange: (ev) => on(ev.target.value), readOnly: sim,
        style: { width: '100%', minHeight: 46, border: '1.5px solid ' + (err ? C.bad : C.line), borderRadius: 10, padding: '10px', fontFamily: 'var(--font-brand)', fontSize: 16, lineHeight: 1.35, color: C.strong, boxSizing: 'border-box', resize: 'vertical' } }),
      err ? h('span', { id: id + '-e', role: 'alert', style: { fontSize: 13, color: C.bad, fontWeight: 700 } }, err) : null); };
    const falta = p.tried ? PL.faltaTxt(l, fijo, p.resp) : '';
    const datosLugar = (lab) => l ? [
      campo('pl-dir', lab || 'Dirección exacta', l.direccion, (v) => cambiar(Object.assign({}, l, { direccion: v }), { como: 'texto' }), { area: true, ph: 'Calle principal, número y calle secundaria', err: p.tried && String(l.direccion || '').trim().length < 8 ? (fijo ? 'Escribe la dirección correcta (calle principal y número).' : 'Escribe la dirección exacta (calle principal y número).') : '' }),
      campo('pl-ref', 'Referencia', l.referencia, (v) => cambiar(Object.assign({}, l, { referencia: v }), { como: 'texto' }), { area: true, ph: 'Edificio, piso, color de la casa, punto conocido…' })] : [];
    const btnSec = (txt, onClick, o) => { o = o || {}; return h('button', { type: 'button', id: o.id, key: o.key || txt, onClick: sim ? undefined : onClick, 'aria-pressed': o.pressed, 'aria-disabled': o.dis ? 'true' : undefined,
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', minHeight: 48, padding: '10px 14px', border: '1.5px solid ' + (o.pressed ? color : o.dis ? '#c9d3de' : color), borderRadius: 12, background: o.pressed ? color : '#FFFFFF', color: o.pressed ? '#FFFFFF' : o.dis ? C.muted : color, fontFamily: 'var(--font-brand)', fontSize: 16, fontWeight: 800, cursor: o.dis ? 'not-allowed' : 'pointer' } }, o.ico || null, txt); };
    const icoGps = h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', className: st.gps === 'buscando' ? 'ppl-spin' : undefined, style: st.gps === 'buscando' ? { animation: 'pplspin 1.2s linear infinite' } : undefined }, h('path', { d: 'M12 2v3 M12 19v3 M2 12h3 M19 12h3 M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' }));

    // ----- Ramos Generales no móviles: confirmar la dirección de la solicitud -----
    if (fijo) {
      const ver = p.resp === 'no' ? l : sol;
      return h('div', { 'data-pl-paso': 'fijo', style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, padding: '13px 14px', border: '1px solid #bcd7f2', borderRadius: 14, background: '#f3f8fe' } },
          h('span', { style: { fontSize: 12, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.04em' } }, 'Dirección de tu solicitud'),
          h('b', { style: { fontSize: 16, color: C.strong, lineHeight: 1.35 } }, (sol && sol.direccion) || '—'), sol && sol.referencia ? h('span', { style: { fontSize: 14, color: C.muted } }, sol.referencia) : null,
          sol ? h('span', { style: { fontSize: 14, color: C.body } }, PL.textoCorto(sol)) : null),
        sol && sol.punto ? h(Mini, { key: 'm', lugar: sol, arrastrable: false, puedeTocar: false }) : null,
        h('fieldset', { style: { margin: 0, padding: 0, border: 'none', display: 'flex', flexDirection: 'column', gap: 8 } }, h('legend', { style: { padding: 0, marginBottom: 8, fontSize: 17, fontWeight: 800, color: p.oscuro || C.strong } }, '¿La inspección es en esta dirección?'),
          h('div', { role: 'radiogroup', 'aria-label': '¿La inspección es en esta dirección?', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
            ['si', 'no'].map((k) => h('button', { key: k, type: 'button', role: 'radio', id: 'pl-rg-' + k, 'aria-checked': p.resp === k ? 'true' : 'false', onClick: sim ? undefined : () => { if (p.onResp) p.onResp(k); if (k === 'si') cambiar(sol, { como: 'confirma' }); else if (SL()) cambiar(SL().calcular({ ciudad: (sol && sol.ciudad) || ciudadCaso, direccion: '', referencia: '', punto: null, origen: 'Búsqueda' }), { como: 'corrige' }); },
              style: { minHeight: 48, borderRadius: 12, border: '1.5px solid ' + (p.resp === k ? color : C.line), background: p.resp === k ? color : '#FFFFFF', color: p.resp === k ? '#FFFFFF' : C.strong, fontFamily: 'var(--font-brand)', fontSize: 16, fontWeight: 800, cursor: 'pointer' } }, k === 'si' ? 'Sí' : 'No')))),
        p.resp === 'no' ? h('div', { key: 'cor', style: { display: 'flex', flexDirection: 'column', gap: 12 } }, datosLugar('Escribe la dirección correcta'), aviso(PL.mensaje(ver, true), 'av', 'pl-zona')) : null,
        p.resp === 'si' ? aviso(PL.mensaje(sol, true), 'av', 'pl-zona') : null,
        falta && !String(falta).startsWith('Escribe') ? h('p', { key: 'f', role: 'alert', style: { margin: 0, color: C.bad, fontWeight: 700, fontSize: 14 } }, falta) : null);
    }

    // ----- Vehículos y equipos: GPS o dirección -----
    const lista = st.abierta && st.q.trim().length >= 3 ? st.sug : [];
    return h('div', { 'data-pl-paso': 'movil', style: { display: 'flex', flexDirection: 'column', gap: 14 } },
      btnSec('Usar mi ubicación', usarGps, { id: 'pl-gps', key: 'gps', ico: icoGps, dis: st.gps === 'buscando' }),
      st.gps === 'buscando' ? h('p', { key: 'gb', role: 'status', style: { margin: 0, fontSize: 14, color: C.muted } }, 'Buscando tu ubicación… acepta el permiso si tu celular lo pide.') : null,
      st.gps === 'error' ? aviso({ tono: 'bad', titulo: 'No pudimos usar tu ubicación: escribe la dirección', texto: 'Si no diste el permiso, puedes activarlo en la configuración de tu navegador.' }, 'ge', 'pl-gps-error') : null,
      h('div', { key: 'o', 'aria-hidden': 'true', style: { display: 'flex', alignItems: 'center', gap: 10, color: C.muted, fontSize: 13 } }, h('span', { style: { flex: 1, height: 1, background: C.line } }), 'o escribe la dirección', h('span', { style: { flex: 1, height: 1, background: C.line } })),
      h('div', { key: 'b', style: { position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 } },
        h('label', { htmlFor: 'pl-buscar', style: { fontSize: 13, fontWeight: 800, color: C.muted } }, 'Buscar la dirección'),
        h('input', { id: 'pl-buscar', ref: inRef, className: 'ppl-in', type: 'search', value: st.q, placeholder: 'Calle, número, barrio o ciudad', autoComplete: 'off', role: 'combobox', 'aria-expanded': lista.length || st.q.trim().length >= 3 ? 'true' : 'false', 'aria-controls': 'pl-sug', 'aria-autocomplete': 'list',
          onChange: (ev) => set({ q: ev.target.value, abierta: true }), onKeyDown: (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); if (lista.length) elegir(lista[0]); else talCual(); } if (ev.key === 'Escape') set({ abierta: false }); }, readOnly: sim,
          style: { width: '100%', minHeight: 48, border: '1.5px solid ' + C.line, borderRadius: 10, padding: '10px 12px', fontFamily: 'var(--font-brand)', fontSize: 16, color: C.strong, boxSizing: 'border-box' } }),
        st.abierta && st.q.trim().length >= 3 ? h('ul', { id: 'pl-sug', role: 'listbox', 'aria-label': 'Sugerencias de dirección', className: 'ppl-sug', style: { listStyle: 'none', margin: 0, padding: 4, border: '1px solid ' + C.line, borderRadius: 10, background: '#FFFFFF', boxShadow: '0 6px 18px rgba(11,46,89,.12)', display: 'flex', flexDirection: 'column' } },
          (st.buscando && !lista.length ? [h('li', { key: 'c', style: { padding: '10px', fontSize: 14, color: C.muted } }, 'Buscando…')] : []).concat(lista.map((x, i) => h('li', { key: 'x' + i, role: 'option', 'aria-selected': 'false' }, h('button', { type: 'button', 'data-pl-sug': i, onClick: sim ? undefined : () => elegir(x), style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%', minHeight: 44, padding: '8px 10px', border: 'none', borderRadius: 8, background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-brand)' } },
            h('span', { style: { fontSize: 15, fontWeight: 700, color: C.strong } }, x.texto), h('span', { style: { fontSize: 12, color: C.muted } }, PL.ciudadNombre(x.ciudad) + (x.punto ? '' : ' · sin ubicar en el mapa'))))))
            .concat([h('li', { key: 'tal', role: 'option', 'aria-selected': 'false' }, h('button', { type: 'button', 'data-pl-sug': 'tal', onClick: sim ? undefined : talCual, style: { width: '100%', minHeight: 44, padding: '8px 10px', border: 'none', borderTop: lista.length ? '1px solid ' + C.line : 'none', borderRadius: 8, background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color } }, 'Usar «' + st.q.trim() + '» tal como la escribí'))])) : null),
      l ? h(Mini, { key: 'm', lugar: l, arrastrable: !!l.punto && !sim, puedeTocar: !sim, onPunto: conPunto }) : null,
      l ? aviso(PL.mensaje(l, false), 'av', 'pl-zona') : null,
      datosLugar(),
      falta && !String(falta).startsWith('Escribe') ? h('p', { key: 'f', role: 'alert', style: { margin: 0, color: C.bad, fontWeight: 700, fontSize: 14 } }, falta) : null);
  }
  PL.Paso = Paso;
  // Indicador «Paso 1 de 3 · Lugar».
  PL.pasoTxt = (n, total, nombre) => 'Paso ' + n + ' de ' + total + ' · ' + nombre;
  W.SiriusPortalLugar = PL;
})();
