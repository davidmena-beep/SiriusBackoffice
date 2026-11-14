// SIRIUS · Pantalla «Ciudades y zonas» (v2.0 · etapa G-2a2 · DEC-221, DEC-234 y DEC-235 · 18/10/2026). Administración › Ciudades y zonas (también desde el índice de Catálogos).
// Disposición (maqueta G-1b): el mapa ocupa todo el espacio libre y hay un solo panel a la derecha, ajustable (300 a 560 px, tirador con mouse o flechas) y contraíble
// a un riel. Panel: cabecera con la ciudad en una lista desplegable con búsqueda, los chips del resumen, Historial y Contraer; cuerpo con «Agregar zona» y las tarjetas;
// pie fijo con la publicación. Sobre el mapa: «Probar una dirección» (abajo a la izquierda, con SiriusUbicacion), «Ajustes de la ciudad» (abajo a la derecha), la barra de
// dibujo (abajo al centro) y el cajón del historial (desde la derecha). Eliminar zona (DEC-235) con confirmación dentro de la tarjeta y «Deshacer» hasta publicar.
// Solo el Administrador edita y publica con motivo; los demás roles ven todo en solo lectura. Datos y reglas en SiriusZonas; cobertura afectada en SiriusCobertura.
// Componente: window.SiriusCiudadesZonas({ rol, usuario, escena }). Escenas: zonas, zonasagregar (?zrep=1), zonasarea (?zcruce=1, ?zpunto=1), zonasprobar (?zdir=n),
// zonaspublicar (?cxok=0), zonaslectura, ciudadesbuscar (?ztodas=1), zonaspanel (?zriel=1), zonasbuscar (?zq=…), zonaseliminar (?zelim=1) y zonashistorial.
(function () {
  'use strict';
  const W = window; if (W.SiriusCiudadesZonas) return;
  const R = () => W.React, h = (...a) => R().createElement(...a), Z = () => W.SiriusZonas, SM = () => W.SiriusMapa, NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {}, UBI = () => W.SiriusUbicacion, COB = () => W.SiriusCobertura;
  const qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const r5 = (v) => +(+v).toFixed(5);
  const PANEL = { ancho: 380, contraido: false }, MIN = 300, MAX = 560; // se recuerda durante la sesión
  let css = false;
  const ponerCss = () => { if (css) return; css = true; const s = document.createElement('style');
    s.textContent = '.zcz-card{border:1px solid var(--border-subtle);border-left:4px solid var(--zc,#ccc);border-radius:10px;padding:7px 10px 5px;margin-bottom:8px;background:#fff;transition:box-shadow .15s}' +
      '.zcz-card:hover,.zcz-card[data-foco="1"]{box-shadow:0 2px 10px rgba(1,30,65,.14)}.zcz-card.nueva{animation:zczDest 1.6s ease}@keyframes zczDest{0%{background:var(--cyan-100)}100%{background:#fff}}' +
      '.zcz-nom{flex:1;min-width:0;border:1px solid transparent;border-radius:6px;padding:3px 6px;font:700 15px var(--font-brand);color:var(--text-strong);background:transparent;text-overflow:ellipsis}' +
      '.zcz-nom:not([readonly]):hover{border-color:var(--border-default)}.zcz-nom:not([readonly]):focus{border-color:var(--color-brand);background:#fff;outline:none;box-shadow:0 0 0 3px var(--cyan-100)}' +
      '.zcz-mb{border:0;background:none;color:var(--cyan-700);font:700 13px var(--font-brand);padding:4px 6px;white-space:nowrap;border-radius:6px;cursor:pointer}.zcz-mb:hover{background:var(--cyan-100)}.zcz-mb.gris{color:var(--text-muted)}' +
      '.zcz-mb.rojo{color:var(--color-danger,#B3261E)}.zcz-mb.rojo:hover{background:var(--red-100,#FDECEA)}' +
      '.zcz-mb:focus-visible,.zcz-ico:focus-visible,.zcz-tg:focus-visible,.zcz-cb:focus-visible,.zcz-opt:focus-visible,.zcz-rb:focus-visible,.zcz-sug:focus-visible{outline:2px solid var(--color-brand);outline-offset:1px}' +
      '.zcz-ico{flex:0 0 auto;width:36px;height:36px;border:0;border-radius:8px;background:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:var(--text-strong)}.zcz-ico:hover{background:var(--surface-subtle,#F5F6F8)}' +
      '.zcz-in{border:1.5px solid var(--input-outlined-border,#DADADA);border-radius:var(--radius-sm,8px);padding:0 10px;height:36px;background:#fff;font:400 14px var(--font-brand);color:var(--text-strong);width:100%;box-sizing:border-box}' +
      '.zcz-in:focus{border-color:var(--color-brand);outline:none;box-shadow:0 0 0 3px var(--cyan-100)}.zcz-in:disabled,.zcz-in[readonly]{background:var(--surface-subtle);color:var(--text-muted)}' +
      '.zcz-tg{border:1.5px solid var(--border-default);border-radius:8px;padding:4px 10px;cursor:pointer;background:#fff;font:600 13px var(--font-brand);color:var(--text-body)}.zcz-tg[aria-pressed="true"]{border-color:var(--color-brand);background:var(--cyan-100);color:var(--text-strong);font-weight:700}' +
      '.zcz-cb{flex:1;min-width:0;display:flex;align-items:center;gap:8px;border:1.5px solid var(--border-default);border-radius:10px;background:#fff;padding:6px 10px;cursor:pointer;text-align:left;font-family:var(--font-brand)}.zcz-cb:hover{border-color:var(--color-brand)}' +
      '.zcz-opt{width:100%;border:0;background:none;text-align:left;padding:7px 8px;border-radius:8px;cursor:pointer;display:flex;justify-content:space-between;gap:8px;align-items:center;font-family:var(--font-brand)}.zcz-opt:hover,.zcz-opt[aria-current="true"]{background:var(--cyan-100)}' +
      '.zcz-sug{width:100%;border:0;background:none;text-align:left;padding:6px 10px;cursor:pointer;font:400 14px var(--font-brand);color:var(--text-body)}.zcz-sug:hover,.zcz-sug[aria-selected="true"]{background:var(--cyan-100)}' +
      '.zcz-flot{position:absolute;z-index:950;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(1,30,65,.2)}' +
      '.zcz-tir{flex:0 0 8px;width:8px;cursor:col-resize;background:linear-gradient(90deg,transparent 3px,var(--border-default,#DADADA) 3px,var(--border-default,#DADADA) 5px,transparent 5px);position:relative;z-index:2;outline:none}' +
      '.zcz-tir:hover,.zcz-tir:focus-visible{background:linear-gradient(90deg,transparent 2px,var(--color-brand) 2px,var(--color-brand) 6px,transparent 6px)}' +
      '.zcz-rb{border:1.5px solid var(--color-danger,#B3261E);border-radius:8px;padding:5px 12px;font:700 13px var(--font-brand);cursor:pointer;background:var(--color-danger,#B3261E);color:#fff}.zcz-rb.sec{background:#fff;color:var(--text-strong);border-color:var(--border-default)}' +
      '.zcz-vert{writing-mode:vertical-rl;transform:rotate(180deg);font:700 13px var(--font-brand);color:var(--text-strong);white-space:nowrap}' +
      '@media (prefers-reduced-motion:reduce){.zcz-card{transition:none;animation:none}}';
    document.head.appendChild(s); };
  const ico = (d, sz) => h('svg', { width: sz || 18, height: sz || 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d }));
  const I = { hist: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5 M12 7v5l4 2', der: 'M9 18l6-6-6-6', izq: 'M15 18l-6-6 6-6', x: 'M18 6 6 18 M6 6l12 12', abajo: 'M6 9l6 6 6-6', lupa: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3' };
  const chip = (txt, tone, extra) => { const B = NS().Badge; const sp = h('span', Object.assign({ style: { whiteSpace: 'nowrap' } }, extra || {}), txt); return B ? h(B, { tone: tone || 'neutral' }, sp) : h('span', null, txt); };
  const btn = (variant, txt, onClick, o) => { o = o || {}; const B = NS().Button; return B ? h(B, Object.assign({ variant, size: o.size || 'sm', onClick, disabled: !!o.disabled, key: o.key || txt }, o.id ? { id: o.id } : {}), txt) : h('button', { type: 'button', onClick, disabled: !!o.disabled, key: o.key || txt }, txt); };
  const TONOS = { ok: ['var(--green-100,#E6F4EA)', 'var(--green-700,#1E7B3C)'], warn: ['var(--gold-100,#FFF4D6)', 'var(--text-strong)'], info: ['var(--cyan-100)', 'var(--text-strong)'] };

  // Estado inicial (y lo que arma cada escena).
  function inicial(escena) { const s = { ciudad: '1701', soloCon: true, herr: null, agr: null, area: null, prueba: null, pq: '', sugs: [], sugIdx: -1, sugOpen: false, resaltada: null, nueva: null, radios: true, toast: null, motivo: '', publicando: false, errPub: '',
    verCambios: false, nomEd: {}, radioEd: null, centrar: true, foco: null, fantasmaIni: null, pop: false, popQ: '', hist: false, confElim: null };
    const S = Z(), U = UBI(), C = COB(), Q = '1701';
    if (escena) { PANEL.ancho = 380; PANEL.contraido = false; }
    if (escena === 'zonaspanel') { PANEL.ancho = 500; PANEL.contraido = qp('zriel') === '1'; }
    if (escena === 'zonasagregar') { s.herr = 'agregar'; s.agr = { n: qp('zrep') === '1' ? 'Norte' : 'Carcelén', err: '' }; if (qp('zrep') === '1') s.agr.err = 'Ya hay una zona con ese nombre en Quito.'; s.fantasmaIni = [-0.098, -78.475]; }
    if (escena === 'zonasarea') { const cz = S.tocar(Q), x = cz.zonas.find((y) => y.nombre === 'Norte');
      if (x) { x.area = [[-0.065, -78.525], [-0.068, -78.44], [-0.16, -78.43], [-0.178, -78.47], [-0.17, -78.52]]; S.registrar(Q, 'Dibujó el área de Norte', 'area:' + x.id); s.resaltada = x.id; }
      if (qp('zcruce') === '1') { const c = cz.zonas.find((y) => y.nombre === 'Centro'); s.herr = 'area'; s.area = { id: c.id, tmp: [[-0.19, -78.53], [-0.24, -78.48], [-0.19, -78.48], [-0.24, -78.53]], err: 'El borde del área se cruza consigo mismo: deshaz puntos y vuelve a trazarlo.' }; }
      if (qp('zpunto') === '1' && x) { const antes = x.area; x.area = null; S.quitarCambio(Q, 'area:' + x.id); s.toast = { txt: 'Norte volvió a solo punto.', acc: { t: 'Deshacer', f: () => { x.area = antes; S.registrar(Q, 'Dibujó el área de Norte', 'area:' + x.id); } } }; } }
    if (escena === 'zonasprobar' && U) { const k = qp('zdir') !== '' ? +qp('zdir') : 4, d = U.DIRECCIONES[k] || U.DIRECCIONES[4]; s.ciudad = d.ciudad; s.pq = d.texto; s.prueba = { t: d.texto, p: d.punto, c: d.ciudad }; }
    if (escena === 'zonasbuscar' && U) { const q = qp('zq') || 'quitumbe', r = U.buscarLocal(q, Q); s.pq = q; if (r.length && r[0].punto) { s.ciudad = r[0].ciudad; s.prueba = { t: r[0].texto, p: r[0].punto, c: r[0].ciudad }; s.pq = r[0].texto; } else s.prueba = { t: q, p: null, c: Q }; }
    if (escena === 'zonaspublicar') { const cz = S.tocar(Q), c = cz.zonas.find((y) => y.nombre === 'Centro'); c.punto = [-0.2105, -78.5025]; S.registrar(Q, 'Movió el punto de Centro', 'mov:' + c.id);
      cz.radio = 12; S.registrar(Q, 'Radio de referencia: 15 → 12 km', 'radio'); s.verCambios = true; s.motivo = 'Ajuste de Centro y del radio según la cobertura real de Quito.'; }
    if (escena === 'ciudadesbuscar') { s.pop = true; s.soloCon = false; s.popQ = qp('ztodas') === '1' ? '' : 'El Coca'; }
    if (escena === 'zonaseliminar') { if (C && C.escena) C.escena('zonaseliminar'); const id = 'z1701-2';
      if (qp('zelim') === '1') { const und = S.eliminar(Q, id, C ? C.conZona(Q, id) : []); s.toast = { txt: 'Zona Centro eliminada. Los casos que la usaban conservan su nombre.', acc: { t: 'Deshacer', f: und } }; } else s.confElim = id; }
    if (escena === 'zonashistorial') { const cz = S.tocar(Q); if (S.version() < 2) { cz.radio = 12; S.registrar(Q, 'Radio de referencia: 15 → 12 km', 'radio'); S.publicar(Q, 'Radio más corto para repartir mejor las visitas del norte.', 'Andrea Salazar'); } s.hist = true; }
    return s; }

  function SiriusCiudadesZonas(p) {
    const React = R(), S = Z(), puede = p.rol === 'Administrador', usuario = p.usuario || '';
    const [, setN] = React.useState(0), rer = () => setN((n) => n + 1);
    const ref = React.useRef(null); if (!ref.current) { ponerCss(); ref.current = inicial(p.escena || ''); }
    const s = ref.current, raiz = React.useRef(null), mapEl = React.useRef(null), mm = React.useRef(null), fx = React.useRef({}), mk = React.useRef({}), guia = React.useRef(null), fantasma = React.useRef(null), tT = React.useRef(null), seq = React.useRef(0);
    const [alto, setAlto] = React.useState(560);
    const cod = s.ciudad, ciu = S.ciudad(cod) || { cod, nombre: cod, oficial: '', oficialTxt: '', provNombre: '' }, cz = S.zonasDe(cod), act = S.activas(cod), ina = cz ? cz.zonas.filter((x) => !S.activa(x)) : [], nc = S.nCambios(cod);
    const col = (x) => (x && x.estado === 'Inactiva' ? '#BBBBBB' : S.color(cod, x.id));
    const pubDe = (id) => { const pz = S.publicadasDe(cod); return pz ? pz.zonas.find((y) => y.id === id) || null : null; };
    const cambio = (clave, txt, igual) => { if (igual) S.quitarCambio(cod, clave); else S.registrar(cod, txt, clave); };
    const aviso = (txt, acc) => { s.toast = { txt, acc }; clearTimeout(tT.current); tT.current = setTimeout(() => { s.toast = null; rer(); }, 6500); };
    const salirHerr = () => { s.herr = null; s.agr = null; s.area = null; const m = mm.current; if (m) m.map.doubleClickZoom.enable(); if (fantasma.current && m) { m.map.removeLayer(fantasma.current); fantasma.current = null; } };
    const elegirCiudad = (c, conservarPrueba) => { s.ciudad = c; salirHerr(); s.resaltada = null; s.nomEd = {}; s.radioEd = null; s.errPub = ''; s.confElim = null; if (!conservarPrueba) { s.prueba = null; s.pq = ''; } s.centrar = true; s.motivo = ''; rer(); };
    const resaltar = (id, desplazar) => { s.resaltada = id; const m = mm.current; if (!m || !cz) return;
      Object.keys(mk.current).forEach((k) => { const x = cz.zonas.find((y) => y.id === k); if (x) mk.current[k].setIcon(SM().pin(col(x), x.nombre, k === id)).setZIndexOffset(k === id ? 800 : 0); });
      const root = raiz.current; if (root) root.querySelectorAll('.zcz-card').forEach((e) => e.setAttribute('data-foco', e.getAttribute('data-id') === id ? '1' : '0'));
      if (desplazar && root) { const e = root.querySelector('.zcz-card[data-id="' + id + '"]'); if (e && e.scrollIntoView) e.scrollIntoView({ block: 'nearest' }); } };
    // ---------- acciones sobre las zonas ----------
    const agregarEn = (pt) => { if (!s.agr || s.agr.err) return; const z = S.tocar(cod), id = S.nuevoId(cod), n = (s.agr.n || '').trim() || ('Zona ' + (z.zonas.length + 1));
      z.zonas.push({ id, nombre: n, punto: pt, area: null, estado: 'Activa' }); S.registrar(cod, 'Agregó la zona ' + n, 'nueva:' + id); salirHerr(); s.nueva = id; s.resaltada = id;
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
      const pz = pubDe(x.id), orig = pz ? pz.nombre : x.nombre; x.nombre = v; if (!pz) S.registrar(cod, 'Agregó la zona ' + v, 'nueva:' + x.id); else cambio('nom:' + x.id, 'Renombró ' + orig + ' → ' + v, pz.nombre === v); rer(); };
    const ponerRadio = (v0) => { const z = S.tocar(cod), v = parseFloat(v0), ant = z.radio, nv = v > 0 ? Math.min(60, v) : null; s.radioEd = null; if (nv === ant) { rer(); return; }
      const pz = S.publicadasDe(cod); z.radio = nv; cambio('radio', 'Radio de referencia: ' + (pz && pz.radio ? pz.radio : 'sin radio') + ' → ' + (nv || 'sin radio') + ' km', pz && pz.radio === nv); rer(); };
    const verZona = (x) => { const m = mm.current; if (!m) return; if (S.tieneArea(x)) m.map.fitBounds(W.L.polygon(x.area).getBounds(), { padding: [60, 60], maxZoom: 14 }); else m.map.setView(x.punto, 13); resaltar(x.id, false); };
    const afectados = (id) => { const C = COB(); return C && C.conZona ? C.conZona(cod, id) : []; };
    const eliminar = (x) => { const afe = afectados(x.id), und = S.eliminar(cod, x.id, afe); s.confElim = null; if (s.resaltada === x.id) s.resaltada = null; delete s.nomEd[x.id];
      aviso('Zona ' + x.nombre + ' eliminada. Los casos que la usaban conservan su nombre.', { t: 'Deshacer', f: () => { if (und) und(); } }); rer(); };
    const publicar = () => { if (s.publicando || String(s.motivo).trim().length < 10) return; s.publicando = true; s.errPub = ''; rer();
      S.publicar(cod, s.motivo, usuario).then((r) => { s.publicando = false; if (r && r.ok) { s.motivo = ''; s.verCambios = false; aviso('Publicado · versión ' + r.version + ': las zonas de ' + ciu.nombre + ' se usan desde ya en Coordinación, las ofertas y el portal.'); }
        else s.errPub = ((r && r.mensaje) || 'No se pudo publicar') + (r && r.validacion ? '' : '. La publicación se deshizo: los cambios siguen sin publicar.'); rer(); }); };
    const descartar = () => { S.descartar(cod); salirHerr(); s.resaltada = null; s.nomEd = {}; s.radioEd = null; s.motivo = ''; s.errPub = ''; s.confElim = null; aviso('Se descartaron los cambios: vuelve lo publicado.'); rer(); };
    // ---------- probar una dirección ----------
    const elegirDir = (d) => { s.sugOpen = false; s.sugIdx = -1; s.pq = d.texto; if (d.ciudad && d.ciudad !== s.ciudad) elegirCiudad(d.ciudad, true); s.prueba = { t: d.texto, p: d.punto, c: d.ciudad || s.ciudad }; if (d.punto && mm.current) mm.current.map.setView(d.punto, 13); rer(); };
    const sugerir = (q) => { const U = UBI(), k = ++seq.current; if (!U || String(q).trim().length < 3) { s.sugs = []; s.sugOpen = false; rer(); return; } U.buscar(q, s.ciudad).then((r) => { if (k !== seq.current) return; s.sugs = r; s.sugIdx = -1; s.sugOpen = r.length > 0; rer(); }); };
    const buscarDir = () => { const U = UBI(), q = String(s.pq).trim(); if (!q) return; const k = ++seq.current; (U ? U.buscar(q, s.ciudad) : Promise.resolve([])).then((r) => { if (k !== seq.current) return; if (r.length) elegirDir(r[0]); else { s.sugOpen = false; s.prueba = { t: q, p: null, c: s.ciudad }; rer(); } }); };
    const quitarPrueba = () => { s.prueba = null; s.pq = ''; s.sugs = []; s.sugOpen = false; rer(); };
    // ---------- panel ----------
    const fijarAncho = (w) => { PANEL.ancho = Math.max(MIN, Math.min(MAX, Math.round(w))); s.soloTam = true; rer(); };
    const contraer = (si) => { PANEL.contraido = si; s.pop = false; rer(); setTimeout(() => { const el = raiz.current && raiz.current.querySelector(si ? '#zcz-expandir' : '#zcz-contraer'); if (el) el.focus(); }, 40); };
    const abrirPop = () => { s.pop = true; s.popQ = ''; s.foco = 'pop'; rer(); };
    const cerrarPop = (volver) => { s.pop = false; rer(); if (volver !== false) setTimeout(() => { const b = raiz.current && raiz.current.querySelector('#zcz-ciudad'); if (b) b.focus(); }, 20); };
    const abrirHist = () => { s.hist = true; s.foco = 'hist'; rer(); };
    const cerrarHist = () => { s.hist = false; rer(); setTimeout(() => { const b = raiz.current && raiz.current.querySelector('#zcz-btnhist'); if (b) b.focus(); }, 20); };
    fx.current = { s, cod, cz, puede, agregarEn, cerrarArea, deshacerPunto, cancelar, resaltar, rer, cerrarPop, cerrarHist };
    // ---------- tamaño: la pantalla ocupa el alto visible (el pie siempre a la vista) ----------
    React.useLayoutEffect(() => { const medir = () => { const el = raiz.current; if (!el) return; const top = el.getBoundingClientRect().top + (W.scrollY || 0); setAlto(Math.max(460, Math.round((W.innerHeight || 720) - top - 16))); };
      medir(); const t = setTimeout(medir, 300); W.addEventListener('resize', medir); return () => { clearTimeout(t); W.removeEventListener('resize', medir); }; }, []);
    // ---------- mapa: se crea una vez ----------
    React.useEffect(() => { const M = SM(); if (!M || !W.L || !mapEl.current) return; const c0 = S.centro(s.ciudad) || [-0.205, -78.49];
      const m = M.crear(mapEl.current, { centro: c0, zoom: 11, notaArriba: true }); mm.current = m; if (!m) return; s.centrar = true;
      m.map.on('click', (e) => { const F = fx.current, st = F.s, pt = [r5(e.latlng.lat), r5(e.latlng.lng)]; if (st.cierreFuera && Date.now() - st.cierreFuera < 400) return; /* el clic que cierra la lista de ciudades no marca un punto */
        if (st.herr === 'agregar') { if (F.puede) F.agregarEn(pt); return; }
        if (st.herr === 'area') { const t = st.area.tmp, u = t[t.length - 1]; if (u && Math.abs(u[0] - pt[0]) < 1e-5 && Math.abs(u[1] - pt[1]) < 1e-5) return; t.push(pt); st.area.err = ''; F.rer(); return; }
        st.prueba = { t: 'Punto marcado en el mapa', p: pt, c: st.ciudad }; st.pq = ''; st.sugOpen = false; F.rer(); });
      m.map.on('dblclick', (e) => { const F = fx.current; if (F.s.herr === 'area') { W.L.DomEvent.stop(e); F.cerrarArea(); } });
      m.map.on('mousemove', (e) => { const F = fx.current, st = F.s;
        if (st.herr === 'agregar') { const nom = (st.agr && st.agr.n.trim()) || 'Nueva zona'; if (!fantasma.current) fantasma.current = W.L.marker(e.latlng, { icon: M.pin('#008BBF', nom, true), interactive: false, opacity: 0.75 }).addTo(m.map); else fantasma.current.setLatLng(e.latlng); return; }
        if (st.herr !== 'area' || !guia.current) return; const t = st.area.tmp; if (!t.length) { guia.current.setLatLngs([]); return; } const q = [e.latlng.lat, e.latlng.lng]; guia.current.setLatLngs(t.length >= 2 ? [t[t.length - 1], q, t[0]] : [t[0], q]); });
      m.map.on('mouseout', () => { if (fantasma.current && !fx.current.s.fantasmaIni) { m.map.removeLayer(fantasma.current); fantasma.current = null; } });
      rer(); return () => { clearTimeout(tT.current); m.destruir(); mm.current = null; }; }, []);
    // Teclado: Esc cierra (lista de ciudades, historial, confirmación) o cancela la herramienta; Retroceso quita el último vértice (fuera de los campos).
    React.useEffect(() => { const k = (e) => { const F = fx.current, st = F.s, campo = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
        if (e.key === 'Escape') { if (st.pop) { e.preventDefault(); F.cerrarPop(); return; } if (st.hist) { e.preventDefault(); F.cerrarHist(); return; } if (st.confElim) { e.preventDefault(); const id = st.confElim; st.confElim = null; F.rer(); setTimeout(() => { const b = document.querySelector('[data-zcz-elim="' + id + '"]'); if (b) b.focus(); }, 20); return; }
          if (st.herr && (!campo || st.herr === 'agregar')) { e.preventDefault(); F.cancelar(); } return; }
        if (e.key === 'Backspace' && st.herr === 'area' && !campo) { e.preventDefault(); F.deshacerPunto(); } };
      const fuera = (e) => { const F = fx.current; if (!F.s.pop) return; const pop = raiz.current && raiz.current.querySelector('[data-zcz-pop]'), b = raiz.current && raiz.current.querySelector('#zcz-ciudad'); if (pop && !pop.contains(e.target) && !(b && b.contains(e.target))) { F.s.cierreFuera = Date.now(); F.cerrarPop(false); } };
      document.addEventListener('keydown', k); document.addEventListener('mousedown', fuera); return () => { document.removeEventListener('keydown', k); document.removeEventListener('mousedown', fuera); }; }, []);
    React.useEffect(() => { const off = S.on(() => rer()); return off; }, []);
    // ---------- pintar el mapa después de cada render ----------
    React.useEffect(() => { const m = mm.current, M = SM(), L = W.L; if (!m || !L) return; m.invalidar();
      if (s.soloTam) { s.soloTam = false; return; } // al arrastrar el tirador solo se reajusta el tamaño
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
      if (s.prueba && s.prueba.p && (s.prueba.c || cod) === cod) L.marker(s.prueba.p, { icon: M.pinCaso(), interactive: false, zIndexOffset: 900 }).addTo(m.capa);
      const R0 = raiz.current;
      if (s.foco && R0) { const sel = { nueva: '#zcz-nueva', pop: '#zcz-popq', hist: '#zcz-histcerrar', elim: '[data-zcz-sielim]' }[s.foco], el = sel && R0.querySelector(sel); if (el) el.focus(); s.foco = null; }
      if (s.nueva) { const id = s.nueva; s.nueva = null; setTimeout(() => resaltar(id, true), 30); } });

    // ---------- mapa y sus barras ----------
    const herrTxt = (() => { if (s.herr === 'agregar') return { t: h(React.Fragment, null, 'Nueva zona ', h('b', null, (s.agr.n || '').trim() || 'sin nombre')), sub: 'Clic en el mapa donde está su centro · Esc cancela' };
      if (s.herr === 'area') { const n = s.area.tmp.length, x = cz && cz.zonas.find((y) => y.id === s.area.id); return { t: h(React.Fragment, null, 'Área de ', h('b', null, x ? x.nombre : ''), ' · ' + n + (n === 1 ? ' punto' : ' puntos')), sub: (n >= 3 ? 'Clic en el primer punto o doble clic para cerrar' : 'Faltan ' + (3 - n) + ' para poder cerrar') + ' · Retroceso deshace · Esc cancela' }; } return null; })();
    const barraDibujo = herrTxt ? h('div', { className: 'zcz-flot', role: 'status', 'data-zcz-barradibujo': '', style: { left: '50%', bottom: 28, transform: 'translateX(-50%)', padding: '8px 10px', display: 'flex', gap: 10, alignItems: 'center', width: 'max-content', maxWidth: 'calc(100% - 24px)', boxSizing: 'border-box', flexWrap: 'wrap', justifyContent: 'center' } },
      h('div', { style: { flex: '1 1 260px', minWidth: 0, fontSize: 13.5, color: 'var(--text-strong)', lineHeight: 1.35 } }, herrTxt.t, h('small', { style: { display: 'block', color: 'var(--text-muted)', fontSize: 12 } }, herrTxt.sub),
        s.herr === 'area' && s.area.err ? h('span', { role: 'alert', style: { display: 'block', marginTop: 3, color: 'var(--color-danger,#B3261E)', fontSize: 12.5, fontWeight: 600 } }, s.area.err) : null),
      h('div', { style: { display: 'flex', gap: 6, flex: '0 0 auto' } },
        s.herr === 'area' ? btn('primary', 'Cerrar área', cerrarArea, { disabled: s.area.tmp.length < 3 }) : null,
        s.herr === 'area' ? btn('secondary', 'Deshacer', deshacerPunto, { disabled: !s.area.tmp.length }) : null,
        btn('secondary', 'Cancelar', cancelar))) : null;
    let rTxt = null; if (s.prueba) { const pr = s.prueba, c2 = pr.c || cod, nom2 = (S.ciudad(c2) || {}).nombre || c2, line = (tone, b, t) => h('div', { 'data-zcz-resultado': tone, role: 'status', style: { fontSize: 13, borderRadius: 8, padding: '7px 10px', background: TONOS[tone][0], color: TONOS[tone][1], lineHeight: 1.4 } }, h('b', null, b), ' · ' + t);
      if (!pr.p) rTxt = line('warn', 'Zona por confirmar', '«' + pr.t + '» no se pudo ubicar. Marca el punto en el mapa.');
      else { const r = S.zonaDe(c2, pr.p);
        rTxt = r.tipo === 'area' ? line('ok', 'Zona ' + r.zona.nombre, 'dentro de su área dibujada' + (r.varias > 1 ? ' (cae en ' + r.varias + ' áreas: gana la del punto más cercano)' : ''))
          : r.tipo === 'punto' && r.lejos ? line('warn', 'Zona ' + r.zona.nombre + ' · lejos del centro', 'a ' + S.fmtKm(r.distanciaKm) + ', fuera del radio (' + r.radio + ' km)')
            : r.tipo === 'punto' ? line('ok', 'Zona ' + r.zona.nombre, 'su punto está a ' + S.fmtKm(r.distanciaKm)) : line('info', nom2 + ' · sin zonas', 'se asigna por ciudad'); } }
    const probar = h('div', { className: 'zcz-flot', role: 'search', 'aria-label': 'Probar una dirección', 'data-zcz-probar': '', style: { position: 'relative', flex: '1 1 auto', minWidth: 0, maxWidth: 620, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 } },
      s.sugOpen && s.sugs.length ? h('ul', { id: 'zcz-sugs', role: 'listbox', 'aria-label': 'Direcciones sugeridas', style: { listStyle: 'none', margin: 0, padding: '4px 0', border: '1px solid var(--border-subtle)', borderRadius: 8, maxHeight: 170, overflowY: 'auto' } },
        s.sugs.map((d, k) => h('li', { key: k, role: 'none' }, h('button', { type: 'button', role: 'option', id: 'zcz-sug-' + k, className: 'zcz-sug', tabIndex: -1, 'aria-selected': k === s.sugIdx ? 'true' : 'false', 'data-zcz-sug': d.texto, onMouseDown: (e) => { e.preventDefault(); elegirDir(d); } },
          d.texto, h('span', { style: { color: 'var(--text-muted)', fontSize: 12.5 } }, ' · ' + ((S.ciudad(d.ciudad) || {}).nombre || d.ciudad)))))) : null,
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        h('label', { htmlFor: 'zcz-dir', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Probar una dirección'),
        h('input', { id: 'zcz-dir', className: 'zcz-in', value: s.pq, autoComplete: 'off', placeholder: 'Probar una dirección (o clic en el mapa)', title: 'Escribe una dirección y busca, o haz clic en el mapa', role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': s.sugOpen ? 'true' : 'false', 'aria-controls': 'zcz-sugs', 'aria-activedescendant': s.sugOpen && s.sugIdx >= 0 ? 'zcz-sug-' + s.sugIdx : undefined,
          onChange: (e) => { s.pq = e.target.value; rer(); sugerir(e.target.value); }, onFocus: () => { if (String(s.pq).trim().length >= 3 && !s.prueba) sugerir(s.pq); }, onBlur: () => setTimeout(() => { if (s.sugOpen) { s.sugOpen = false; rer(); } }, 150),
          onKeyDown: (e) => { const n = s.sugOpen ? s.sugs.length : 0; if (e.key === 'ArrowDown' && n) { e.preventDefault(); s.sugIdx = (s.sugIdx + 1) % n; rer(); } else if (e.key === 'ArrowUp' && n) { e.preventDefault(); s.sugIdx = (s.sugIdx - 1 + n) % n; rer(); }
            else if (e.key === 'Enter') { e.preventDefault(); if (n && s.sugIdx >= 0) elegirDir(s.sugs[s.sugIdx]); else buscarDir(); } else if (e.key === 'Escape' && s.sugOpen) { e.preventDefault(); e.stopPropagation(); s.sugOpen = false; rer(); } } }),
        btn('primary', 'Buscar', buscarDir, { id: 'zcz-buscar' }),
        s.prueba ? h('button', { type: 'button', className: 'zcz-ico', 'aria-label': 'Quitar la prueba', title: 'Quitar la prueba', onClick: quitarPrueba, style: { width: 32, height: 32 } }, ico(I.x, 16)) : null),
      rTxt);
    const ajustes = cz ? h('div', { className: 'zcz-flot', role: 'group', 'aria-label': 'Ajustes de la ciudad', 'data-zcz-ajustes': '', style: { position: 'relative', flex: '0 0 auto', padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-strong)', whiteSpace: 'nowrap' } },
      h('label', { htmlFor: 'zcz-radio', title: 'Radio de referencia: se dibuja alrededor de cada punto como guía' }, h('span', { 'aria-hidden': 'true' }, 'Radio'), h('span', { style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Radio de referencia en kilómetros')),
      h('input', { id: 'zcz-radio', className: 'zcz-in', type: 'number', min: 1, max: 60, step: 0.5, readOnly: !puede, 'aria-readonly': puede ? undefined : 'true', title: puede ? 'Se dibuja alrededor de cada punto como guía; una dirección más lejos se asigna igual y se marca «lejos del centro».' : 'Solo el Administrador cambia el radio', value: s.radioEd !== null ? s.radioEd : (cz.radio || ''), style: { width: 60, padding: '0 6px' },
        onChange: (e) => { if (!puede) return; s.radioEd = e.target.value; rer(); }, onBlur: () => { if (puede && s.radioEd !== null) ponerRadio(s.radioEd); }, onKeyDown: (e) => { if (e.key === 'Enter') e.target.blur(); } }), 'km',
      h('label', { style: { display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: s.radios, onChange: (e) => { s.radios = e.target.checked; rer(); } }), 'Ver radios')) : null;
    const hist = S.historial(cod);
    const cajon = s.hist ? h('aside', { role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'zcz-hist-t', 'data-zcz-cajon': '', style: { position: 'absolute', top: 0, bottom: 0, right: 0, width: 400, maxWidth: '90%', background: '#fff', zIndex: 1000, boxShadow: '-8px 0 24px rgba(1,30,65,.18)', display: 'flex', flexDirection: 'column' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' } }, h('h2', { id: 'zcz-hist-t', style: { margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-strong)' } }, 'Historial · ' + ciu.nombre),
        h('button', { type: 'button', id: 'zcz-histcerrar', className: 'zcz-ico', 'aria-label': 'Cerrar el historial', title: 'Cerrar', onClick: cerrarHist }, ico(I.x))),
      h('div', { style: { flex: '1 1 auto', overflowY: 'auto', padding: '12px 14px' } }, hist.length ? h('ol', { 'data-zcz-hist': '', style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, hist.map((v, i) => h('li', { key: i, style: { border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 12px' } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8, fontWeight: 700, color: 'var(--text-strong)', fontSize: 14 } }, h('span', null, 'Versión ' + v.version), h('span', { style: { fontWeight: 400, fontSize: 12.5, color: 'var(--text-muted)' } }, v.fecha)),
          h('div', { style: { fontSize: 13, color: 'var(--text-muted)' } }, (v.por ? v.por + ' · ' : '') + '«' + v.motivo + '»'),
          v.cambios.length ? h('ul', { style: { margin: '6px 0 0', paddingLeft: 18, fontSize: 13, color: 'var(--text-body)' } }, v.cambios.map((c, k) => h('li', { key: k }, c))) : null,
          h('div', { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 4 } }, v.estado)))) : h('p', { style: { margin: 0, fontSize: 13, color: 'var(--text-muted)' } }, 'Todavía no hay publicaciones.'),
        h('div', { style: { marginTop: 12 } }, btn('secondary', 'Cerrar', cerrarHist)))) : null;
    const mapa = h('div', { style: { flex: '1 1 auto', minWidth: 0, position: 'relative', background: '#E6ECF1' } },
      h('div', { ref: mapEl, role: 'application', 'aria-label': 'Mapa de ' + ciu.nombre + ' con sus zonas', style: { position: 'absolute', inset: 0 } }),
      !herrTxt && !S.centro(cod) ? h('div', { className: 'zcz-flot', role: 'note', 'data-zcz-sincentro': '', style: { pointerEvents: 'none', top: 12, left: 56, padding: '8px 12px', fontSize: 13, color: 'var(--text-strong)', maxWidth: '62%' } }, 'Aún no hay un centro aproximado para ' + ciu.nombre + ': el mapa no se mueve. Puedes probar una dirección o agregar zonas igual.') : null,
      s.toast ? h('div', { className: 'zcz-flot', role: 'status', 'aria-live': 'polite', 'data-zcz-aviso': '', style: { left: '50%', top: 14, transform: 'translateX(-50%)', zIndex: 960, background: 'var(--text-strong,#011E41)', color: '#fff', padding: '9px 14px', fontSize: 14, display: 'flex', gap: 12, alignItems: 'center', maxWidth: '90%' } },
        h('span', null, s.toast.txt), s.toast.acc ? h('button', { type: 'button', onClick: () => { const a = s.toast.acc; s.toast = null; a.f(s); rer(); }, style: { background: 'none', border: 0, color: '#7FD8FA', font: '700 14px var(--font-brand)', cursor: 'pointer', padding: 0, textDecoration: 'underline' } }, s.toast.acc.t) : null) : null,
      herrTxt ? barraDibujo : h('div', { 'data-zcz-barrainf': '', style: { position: 'absolute', zIndex: 950, left: 12, right: 12, bottom: 28, display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'space-between', pointerEvents: 'none' } },
        h('div', { style: { pointerEvents: 'auto', flex: '1 1 auto', minWidth: 0, display: 'flex' } }, probar), ajustes ? h('div', { style: { pointerEvents: 'auto', flex: '0 0 auto' } }, ajustes) : null),
      cajon);
    // ---------- panel único ----------
    const ancho = PANEL.ancho;
    const tirador = PANEL.contraido ? null : h('div', { className: 'zcz-tir', role: 'separator', tabIndex: 0, 'aria-orientation': 'vertical', 'aria-label': 'Ajustar el ancho del panel de zonas (flechas; Enter o doble clic contrae)', 'aria-valuemin': MIN, 'aria-valuemax': MAX, 'aria-valuenow': ancho, 'aria-valuetext': ancho + ' px', 'data-zcz-tirador': '',
      onMouseDown: (e) => { e.preventDefault(); const x0 = e.clientX, w0 = PANEL.ancho; const mv = (ev) => fijarAncho(w0 + (x0 - ev.clientX)), up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); document.body.style.userSelect = ''; s.soloTam = false; rer(); }; document.body.style.userSelect = 'none'; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up); },
      onDoubleClick: () => contraer(true), onKeyDown: (e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); fijarAncho(PANEL.ancho + 20); } else if (e.key === 'ArrowRight') { e.preventDefault(); fijarAncho(PANEL.ancho - 20); } else if (e.key === 'Home') { e.preventDefault(); fijarAncho(MIN); } else if (e.key === 'End') { e.preventDefault(); fijarAncho(MAX); } else if (e.key === 'Enter') { e.preventDefault(); contraer(true); } } });
    const riel = PANEL.contraido ? h('aside', { 'aria-label': 'Panel de zonas contraído', 'data-zcz-riel': '', style: { width: 44, flex: '0 0 44px', background: '#fff', borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 10 } },
      h('button', { type: 'button', id: 'zcz-expandir', className: 'zcz-ico', 'aria-label': 'Expandir el panel de zonas', title: 'Expandir el panel', onClick: () => contraer(false) }, ico(I.izq)),
      h('span', { className: 'zcz-vert' }, ciu.nombre + ' · ' + act.length + (act.length === 1 ? ' zona' : ' zonas')),
      nc ? h('span', { title: nc + (nc === 1 ? ' cambio sin publicar' : ' cambios sin publicar'), 'aria-label': nc + (nc === 1 ? ' cambio sin publicar' : ' cambios sin publicar') }, chip(String(nc), 'warning')) : null) : null;
    const lista = s.pop ? S.buscar(s.popQ, s.soloCon) : [];
    const pop = s.pop ? h('div', { role: 'dialog', 'aria-label': 'Elegir ciudad', 'data-zcz-pop': '', style: { position: 'absolute', top: 58, left: 10, right: 10, zIndex: 1100, background: '#fff', borderRadius: 12, boxShadow: '0 8px 28px rgba(1,30,65,.25)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 } },
      h('label', { htmlFor: 'zcz-popq', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Buscar ciudad'),
      h('input', { id: 'zcz-popq', className: 'zcz-in', type: 'search', value: s.popQ, placeholder: 'Buscar ciudad: Quito, El Coca, Manta…', 'aria-controls': 'zcz-poplista', onChange: (e) => { s.popQ = e.target.value; rer(); },
        onKeyDown: (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); const b = raiz.current.querySelector('#zcz-poplista button'); if (b) b.focus(); } else if (e.key === 'Enter') { e.preventDefault(); if (lista.length) { elegirCiudad(lista[0].cod); cerrarPop(); } } } }),
      h('div', { role: 'group', 'aria-label': 'Filtro de ciudades', style: { display: 'flex', gap: 6, alignItems: 'center' } },
        h('button', { type: 'button', className: 'zcz-tg', 'aria-pressed': s.soloCon ? 'true' : 'false', onClick: () => { s.soloCon = true; rer(); } }, 'Con zonas'),
        h('button', { type: 'button', className: 'zcz-tg', 'aria-pressed': s.soloCon ? 'false' : 'true', onClick: () => { s.soloCon = false; rer(); } }, 'Todas'),
        h('span', { 'data-zcz-cuenta': String(lista.length), style: { marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' } }, lista.length + (lista.length === 1 ? ' ciudad' : ' ciudades'))),
      h('ul', { id: 'zcz-poplista', 'aria-label': 'Ciudades', style: { listStyle: 'none', margin: 0, padding: 0, maxHeight: Math.max(160, Math.min(320, alto - 240)), overflowY: 'auto' },
        onKeyDown: (e) => { if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault(); const bs = [...e.currentTarget.querySelectorAll('button')], i = bs.indexOf(document.activeElement), j = e.key === 'ArrowDown' ? Math.min(bs.length - 1, i + 1) : i - 1; if (j < 0) { const q = raiz.current.querySelector('#zcz-popq'); if (q) q.focus(); } else if (bs[j]) bs[j].focus(); } },
        lista.length ? lista.map((c) => { const z = S.zonasDe(c.cod), n = S.nCambios(c.cod), na = z ? z.zonas.filter(S.activa).length : 0;
          return h('li', { key: c.cod }, h('button', { type: 'button', className: 'zcz-opt', 'aria-current': c.cod === cod ? 'true' : 'false', 'data-cod': c.cod, onClick: () => { elegirCiudad(c.cod); cerrarPop(); } },
            h('span', { style: { minWidth: 0 } }, h('b', { style: { color: 'var(--text-strong)', fontSize: 14 } }, c.nombre), h('span', { style: { display: 'block', fontSize: 12, color: 'var(--text-muted)' } }, c.provNombre + ' · ' + c.cod + (c.nombre !== c.oficialTxt ? ' · ' + c.oficialTxt : ''))),
            n ? chip('Sin publicar', 'warning') : z ? chip(na + (na === 1 ? ' zona' : ' zonas'), 'brand') : null)); })
          : h('li', { style: { padding: 6, fontSize: 13, color: 'var(--text-muted)' } }, 'Ninguna ciudad coincide.')),
      h('p', { 'data-zcz-fuente': '', style: { margin: 0, fontSize: 11.5, lineHeight: 1.4, color: 'var(--text-muted)' } }, 'Fuente: INEC, Clasificador Geográfico Estadístico 2026 · ' + S.ciudades().length + ' cantones activos y ' + S.enEstudio() + ' en estudio · estructura del catálogo CANTON de gobernanza.')) : null;
    const chips = [chip(act.length ? act.length + (act.length === 1 ? ' zona activa' : ' zonas activas') : 'Sin zonas', act.length ? 'brand' : 'neutral', { 'data-zcz-resumen': '' })].concat(cz && cz.radio ? [chip('Radio ' + String(cz.radio).replace('.', ',') + ' km', 'neutral')] : [], ina.length ? [chip(ina.length + (ina.length === 1 ? ' inactiva' : ' inactivas'), 'neutral')] : [], ciu.nombre !== ciu.oficialTxt ? [chip(ciu.oficialTxt, 'neutral', { title: 'Nombre oficial del INEC' })] : [], act.length > S.MAX_ZONAS ? [chip('Más de 8 zonas: cuesta configurar la cobertura', 'warning')] : []);
    const cab = h('div', { style: { flex: '0 0 auto', padding: '12px 14px 10px', borderBottom: '1px solid var(--border-subtle)' } },
      h('div', { style: { display: 'flex', gap: 4, alignItems: 'center' } },
        h('button', { type: 'button', id: 'zcz-ciudad', className: 'zcz-cb', 'aria-haspopup': 'dialog', 'aria-expanded': s.pop ? 'true' : 'false', 'aria-label': 'Ciudad: ' + ciu.nombre + ', ' + ciu.provNombre + ', código ' + cod + '. Cambiar ciudad', onClick: () => (s.pop ? cerrarPop() : abrirPop()) },
          h('span', { style: { minWidth: 0, flex: '1 1 auto' } }, h('b', { style: { display: 'block', fontSize: 17, color: 'var(--text-strong)' } }, ciu.nombre), h('span', { style: { display: 'block', fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, ciu.provNombre + ' · código INEC ' + cod)),
          h('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, ico(I.abajo))),
        h('button', { type: 'button', id: 'zcz-btnhist', className: 'zcz-ico', 'aria-label': 'Historial de publicaciones', title: 'Historial de publicaciones', 'aria-expanded': s.hist ? 'true' : 'false', onClick: () => (s.hist ? cerrarHist() : abrirHist()) }, ico(I.hist)),
        h('button', { type: 'button', id: 'zcz-contraer', className: 'zcz-ico', 'aria-label': 'Contraer el panel de zonas', title: 'Contraer el panel', onClick: () => contraer(true) }, ico(I.der))),
      h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 } }, chips));
    const tarjeta = (x) => { const inac = !S.activa(x), area = S.tieneArea(x), av = S.avisosArea(cz, x), ed = puede && !s.herr, conf = s.confElim === x.id;
      let pie2; if (conf) { const afe = afectados(x.id);
        pie2 = h('div', { role: 'alertdialog', 'aria-labelledby': 'zcz-el-t-' + x.id, 'aria-describedby': 'zcz-el-d-' + x.id, 'data-zcz-confirma': x.id, style: { margin: '6px 0 4px', background: 'var(--red-100,#FDECEA)', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: 'var(--color-danger,#B3261E)', lineHeight: 1.45 } },
          h('b', { id: 'zcz-el-t-' + x.id, style: { display: 'block' } }, '¿Eliminar la zona ' + x.nombre + '?'),
          h('span', { id: 'zcz-el-d-' + x.id }, 'Los casos y visitas que ya la usan conservan el nombre que tenían. ' + (afe.length ? 'Se quitará de la cobertura de ' + S.lista(afe) + '.' : 'Ningún inspector la tiene en su cobertura.')),
          h('div', { style: { display: 'flex', gap: 6, marginTop: 6 } }, h('button', { type: 'button', className: 'zcz-rb', 'data-zcz-sielim': x.id, onClick: () => eliminar(x) }, 'Eliminar'), h('button', { type: 'button', className: 'zcz-rb sec', onClick: () => { s.confElim = null; rer(); } }, 'Cancelar'))); }
      else pie2 = h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: 2 } }, inac ? [ed ? h('button', { key: 'a', type: 'button', className: 'zcz-mb', onClick: () => ponerEstado(x, 'Activa') }, 'Activar') : null]
        : [h('button', { key: 'v', type: 'button', className: 'zcz-mb', onClick: () => verZona(x) }, 'Ver'),
          ed ? h('button', { key: 'd', type: 'button', className: 'zcz-mb', onClick: () => { s.herr = 'area'; s.area = { id: x.id, tmp: [], err: '' }; s.resaltada = x.id; s.toast = null; s.confElim = null; rer(); } }, area ? 'Redibujar' : 'Dibujar área') : null,
          ed && area ? h('button', { key: 'q', type: 'button', className: 'zcz-mb', onClick: () => soloPunto(x) }, 'Volver a solo punto') : null,
          ed ? h('button', { key: 'i', type: 'button', className: 'zcz-mb gris', onClick: () => ponerEstado(x, 'Inactiva') }, 'Desactivar') : null],
        ed ? h('button', { key: 'e', type: 'button', className: 'zcz-mb rojo', 'data-zcz-elim': x.id, 'aria-label': 'Eliminar la zona ' + x.nombre, onClick: () => { s.confElim = x.id; s.foco = 'elim'; rer(); } }, 'Eliminar') : null);
      return h('div', { key: x.id, className: 'zcz-card' + (x.id === s.nueva ? ' nueva' : ''), 'data-id': x.id, 'data-foco': x.id === s.resaltada ? '1' : '0', style: { '--zc': col(x) }, onMouseEnter: () => { if (!inac) resaltar(x.id, false); } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
          h('input', { className: 'zcz-nom', 'data-zn': x.id, value: s.nomEd[x.id] !== undefined ? s.nomEd[x.id] : x.nombre, readOnly: !ed || inac, 'aria-label': 'Nombre de la zona ' + x.nombre, title: ed && !inac ? 'Clic para cambiar el nombre' : undefined,
            onChange: (e) => { s.nomEd[x.id] = e.target.value; rer(); }, onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); delete s.nomEd[x.id]; rer(); setTimeout(() => e.target.blur(), 0); } },
            onBlur: () => { if (s.nomEd[x.id] !== undefined) renombrar(x, s.nomEd[x.id]); } }),
          inac ? chip('Inactiva', 'neutral') : area ? chip('Área · ' + x.area.length + ' pts', 'brand') : chip('Punto', 'neutral')),
        av.length && !inac ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, margin: '4px 0 2px 6px' } }, av.map((a, i) => h('span', { key: i, role: 'note', 'data-zcz-avisoarea': '', style: { fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: 'var(--text-strong)', background: 'var(--gold-100,#FFF4D6)', borderRadius: 6, padding: '3px 8px' } }, a))) : null,
        pie2); };
    const nombreNuevo = (v) => { s.agr.n = v; const t = v.trim(); s.agr.err = t && S.nombreRepetido(cod, t) ? 'Ya hay una zona con ese nombre en ' + ciu.nombre + '.' : ''; rer(); };
    const cuerpo = h('div', { 'data-zcz-cuerpo': '', style: { flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '12px 14px' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 } }, h('h3', { style: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, 'Zonas'),
        puede && !s.herr ? btn('primary', 'Agregar zona', () => { s.herr = 'agregar'; s.agr = { n: '', err: '' }; s.foco = 'nueva'; s.toast = null; s.confElim = null; rer(); }, { id: 'zcz-agregar' }) : null),
      s.herr === 'agregar' ? h('div', { role: 'group', 'aria-label': 'Zona nueva', style: { border: '1.5px dashed var(--color-brand)', borderRadius: 10, padding: 10, marginBottom: 10, background: 'var(--cyan-100)' } },
        h('label', { htmlFor: 'zcz-nueva', style: { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 } }, 'Nombre de la zona nueva'),
        h('input', { id: 'zcz-nueva', className: 'zcz-in', value: s.agr.n, placeholder: 'Por ejemplo: Carcelén', 'aria-invalid': s.agr.err ? 'true' : 'false', 'aria-describedby': 'zcz-nueva-err', onChange: (e) => nombreNuevo(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } } }),
        h('div', { id: 'zcz-nueva-err', role: s.agr.err ? 'alert' : undefined, style: { color: 'var(--color-danger,#B3261E)', fontSize: 13, marginTop: s.agr.err ? 4 : 0 } }, s.agr.err),
        h('p', { style: { margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' } }, 'Luego haz clic en el mapa donde está su centro. Sin nombre, se llama «Zona ' + ((cz ? cz.zonas.length : 0) + 1) + '».')) : null,
      !act.length && s.herr !== 'agregar' ? h('div', { role: 'status', style: { borderRadius: 10, padding: '10px 12px', fontSize: 13, lineHeight: 1.45, background: 'var(--cyan-100)', color: 'var(--text-strong)' } }, h('b', null, 'Esta ciudad no tiene zonas.'), ' Las inspecciones se asignan por ciudad.' + (puede ? ' Agrega zonas solo si conviene repartirla.' : ''))
        : act.length ? h('p', { style: { margin: '0 0 10px', fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.45 } }, 'Una dirección queda en la zona del punto más cercano: ninguna parte de la ciudad queda sin zona. Un área dibujada manda sobre el punto.') : null,
      act.map(tarjeta),
      ina.length ? h('details', { open: ina.some((x) => x.id === s.confElim) || undefined, style: { marginTop: 8 } }, h('summary', { style: { cursor: 'pointer', fontWeight: 700, color: 'var(--text-muted)', fontSize: 13 } }, 'Inactivas (' + ina.length + ')'), h('div', { style: { marginTop: 8 } }, ina.map(tarjeta))) : null);
    const motOk = String(s.motivo).trim().length >= 10;
    const histBtn = h('button', { type: 'button', className: 'zcz-mb', 'data-zcz-verhist': '', onClick: abrirHist }, 'Historial (' + hist.length + ')');
    const pie = h('div', { 'data-zcz-pie': '', style: { flex: '0 0 auto', borderTop: '1px solid var(--border-subtle)', background: '#fff', padding: '10px 14px 12px', boxShadow: '0 -4px 12px rgba(1,30,65,.06)' } },
      nc && puede ? h(React.Fragment, null,
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 } }, h('strong', { 'data-zcz-pendientes': String(nc), style: { fontSize: 14, color: 'var(--text-strong)' } }, nc + (nc === 1 ? ' cambio sin publicar' : ' cambios sin publicar')),
          h('button', { type: 'button', className: 'zcz-mb gris', onClick: descartar }, 'Descartar')),
        h('details', { open: s.verCambios, onToggle: (e) => { s.verCambios = e.target.open; }, style: { fontSize: 13, margin: '0 0 6px' } }, h('summary', { style: { cursor: 'pointer', color: 'var(--cyan-700)', fontWeight: 700 } }, 'Ver cambios'),
          h('ul', { 'data-zcz-cambios': '', style: { margin: '4px 0 0', paddingLeft: 18, maxHeight: 96, overflowY: 'auto', color: 'var(--text-body)' } }, S.cambios(cod).map((x, i) => h('li', { key: i }, x.t)))),
        h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
          h('input', { id: 'zcz-motivo', className: 'zcz-in', value: s.motivo, placeholder: 'Motivo (mínimo 10 caracteres)', 'aria-label': 'Motivo de la publicación', onChange: (e) => { s.motivo = e.target.value; s.errPub = ''; rer(); }, onKeyDown: (e) => { if (e.key === 'Enter' && motOk) publicar(); }, style: { flex: 1, minWidth: 0 } }),
          btn('primary', s.publicando ? 'Publicando…' : 'Publicar', publicar, { disabled: !motOk || s.publicando, size: 'md', id: 'zcz-publicar' })),
        s.errPub ? h('p', { role: 'alert', style: { margin: '6px 0 0', fontSize: 13, fontWeight: 600, color: 'var(--color-danger,#B3261E)' } }, s.errPub) : null)
        : h(React.Fragment, null,
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: puede ? 6 : 2 } }, h('p', { 'data-zcz-publicado': '', style: { margin: 0, fontSize: 13, color: 'var(--text-muted)', minWidth: 0 } }, h('strong', { style: { color: 'var(--text-strong)' } }, 'Publicado'), ' · versión ' + S.version() + ' · ', h('span', { style: { whiteSpace: 'nowrap' } }, S.fechaVersion())), histBtn),
          puede ? h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } }, h('input', { className: 'zcz-in', disabled: true, placeholder: 'Haz un cambio para publicar', 'aria-label': 'Motivo de la publicación', style: { flex: 1, minWidth: 0 } }), btn('primary', 'Publicar', () => {}, { disabled: true, size: 'md', id: 'zcz-publicar' }))
            : h('p', { role: 'note', style: { margin: 0, fontSize: 13, color: 'var(--text-muted)' } }, 'Solo lectura: solo el Administrador edita y publica las zonas.')));
    const panel = PANEL.contraido ? null : h('aside', { 'aria-label': 'Zonas de ' + ciu.nombre, 'data-zcz-panel': '', style: { width: ancho, flex: '0 0 ' + ancho + 'px', position: 'relative', borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' } }, cab, cuerpo, pie, pop);
    return h('section', { ref: raiz, 'data-screen-label': 'Ciudades y zonas', 'aria-label': 'Ciudades y zonas', 'data-zcz-lectura': puede ? '0' : '1', style: { position: 'relative', display: 'flex', height: alto, minHeight: 460, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md,12px)', overflow: 'hidden', fontFamily: 'var(--font-brand)', color: 'var(--text-body)', background: '#fff' } }, mapa, tirador, panel, riel);
  }
  W.SiriusCiudadesZonas = SiriusCiudadesZonas;
})();
