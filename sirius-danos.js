// SIRIUS · Detección de daños (etapa 12a · DEC-134).
// Modelo de la sesión: los daños que el sistema detecta en las fotos (SIRIUS_CAPTURA.ejemplos), su revisión por una persona
// (Confirmar, Ajustar, Descartar con motivo, Agregar a mano) con quién y cuándo, y su paso a la grilla de averías (Confirmados,
// Ajustados y Agregados). La gravedad sale siempre de SIRIUS_CAPTURA.gravedad y la profundidad mostrada de profundidadMostrada.
// Dibujo: polígonos translúcidos en el color de su gravedad, con atributos de presentación (sin clases) para pantalla y PDF.
// Componentes (React sin JSX, en window): SiriusDanosMini (miniatura), SiriusDanosFoto (foto con polígonos y puntos editables),
// SiriusDanosLista (revisión) y SiriusDanosRevision (todas las fotos de un riesgo; la usa la calificación).
(function () {
  if (window.SiriusDanos) return; // se carga desde el Back-office y desde los x-import: un solo estado de sesión
  const CAP = () => window.SIRIUS_CAPTURA || { danos: { tipos: [], profundidad: { categorias: [] }, estados: [] }, ejemplos: [] };
  const SIL = () => window.SIRIUS_SILUETAS || null, EJ = () => window.SIRIUS_EJEMPLO || {};
  const GRAV = { Alta: { c: '#b42318', f: 'rgba(180,35,24,0.26)', bg: '#FDECEA', fg: '#8F1D14' }, Media: { c: '#b7791f', f: 'rgba(183,121,31,0.26)', bg: '#FFF4DC', fg: '#7A4F0E' }, Baja: { c: '#5b6b80', f: 'rgba(91,107,128,0.26)', bg: '#EEF2F6', fg: '#3D4B5C' } };
  const ACEPTA = ['Confirmado', 'Ajustado', 'Agregado a mano'];
  const TONO = { Propuesto: 'brand', Confirmado: 'success', Ajustado: 'warning', Descartado: 'neutral', 'Agregado a mano': 'teal' };
  const MOTIVO_MIN = 10;
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/izquierda/g, 'izquierdo').replace(/derecha/g, 'derecho').replace(/\s+/g, ' ').trim();
  // Piezas del catálogo de Vehículos que no tienen zona propia en la silueta: se marcan en la zona que las contiene.
  const ALIAS = { 'compuerta o maletero': ['maletero', 'compuerta'], 'faro delantero izquierdo': ['guardafango_delantero_izq'], 'faro delantero derecho': ['guardafango_delantero_der'], 'retrovisor izquierdo': ['puerta_delantera_izq'], 'retrovisor derecho': ['puerta_delantera_der'] };

  // ---------- Fecha y hora del reloj del prototipo ----------
  function ahora() { const E = EJ(); return E.ahora ? E.ahora() : new Date(2026, 9, 18, 20, 30); }
  const z2 = (n) => String(n).padStart(2, '0');
  function isoAhora() { const d = ahora(); return d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes()); }
  function fmtEn(iso) { const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(iso || ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + ' · ' + m[4] + ':' + m[5] : (iso || ''); }
  const num = (x) => String(Math.round(Number(x) * 10) / 10).replace('.', ',');

  // ---------- Riesgo, silueta y zonas ----------
  function riesgo(rid) { const E = EJ(); return (E.vehiculos || []).find(v => v.riesgo === rid) || (E.equipos || []).find(v => v.riesgo === rid) || null; }
  function esEquipo(rid) { const v = riesgo(rid); return !!(v && (v.eq || (EJ().equipos || []).includes(v))); }
  function silueta(rid) { const S = SIL(), v = riesgo(rid); if (!S) return 'sedan'; if (esEquipo(rid)) return S.siluetaEquipo((v && (v.tipo || (v.eq || {}).tipo)) || ''); return S.carroceriaDe((v && (v.carroceria || v.clase)) || ''); }
  function zonas(tipo) { const S = SIL(); return S && S.zonas ? (S.zonas[tipo] || []) : []; }
  function zonaDe(tipo, pieza) { const L = zonas(tipo), n = norm(pieza); if (!n) return null; const z = L.find(x => x.id === pieza || norm(x.nombre) === n); if (z) return z.id; const al = (ALIAS[n] || []).find(id => L.some(x => x.id === id)); return al || null; }
  // Nombre que se muestra: el de la pieza del catálogo de Vehículos si existe (con su género), si no el de la zona.
  function nombrePieza(tipo, zonaId) { const z = zonas(tipo).find(x => x.id === zonaId); if (!z) return zonaId || ''; const cat = ((EJ().catalogos || {}).piezas || []).find(p => norm(p) === norm(z.nombre)); return cat || z.nombre; }

  // ---------- Estado de la sesión ----------
  const ST = { r: {}, subs: [], edit: null, seq: 0 };
  function emit() { ST.subs.slice().forEach(f => { try { f(); } catch (e) {} }); }
  function on(f) { ST.subs.push(f); return () => { ST.subs = ST.subs.filter(x => x !== f); }; }
  function lista(rid) {
    if (!rid) return [];
    if (!ST.r[rid]) ST.r[rid] = (CAP().ejemplos || []).filter(x => x.riesgo === rid).map((x, i) => { const d = Object.assign({ id: rid + '-d' + (i + 1), origen: 'Sistema', hist: [] }, clone(x));
      d.hist.push({ accion: 'Detectado por el sistema', por: 'Sistema', en: '' }); if (d.estado !== 'Propuesto') d.hist.push({ accion: d.estado, por: d.por || '—', en: d.en || '' }); return d; });
    return ST.r[rid];
  }
  function daño(rid, id) { return lista(rid).find(d => d.id === id) || null; }
  const umbral = () => ((CAP().danos || {}).profundidad || {}).umbralConfianza || 60;
  function profMostrada(d) { if (!d) return ''; if (!d.profundidad || d.profundidad === 'Por confirmar') return 'Por confirmar'; const C = CAP(); return C.profundidadMostrada ? C.profundidadMostrada(d.profundidad, d.confProf == null ? 100 : d.confProf) : d.profundidad; }
  function gravedad(d) { const C = CAP(); return C.gravedad ? C.gravedad(d.tipo, profMostrada(d), Number(d.superficie) || 0) : 'Baja'; }
  function etiqueta(d) { return d.tipo + ' · ' + num(d.superficie) + ' dm² · ' + profMostrada(d) + ' · confianza ' + (d.confTipo == null ? 100 : d.confTipo) + ' %'; }
  function ultimo(d) { const h = (d.hist || []).filter(x => x.en); return h.length ? h[h.length - 1] : null; }
  function origenTxt(d) { if (d.origen === 'Manual') return 'Agregado a mano · ' + (d.por || '—'); if (d.estado === 'Propuesto') return 'Sistema · Propuesto · por revisar'; return 'Sistema · ' + d.estado + ' por ' + (d.por || '—'); }
  function pendientes(rid) { return lista(rid).filter(d => d.estado === 'Propuesto').length; }
  function deFoto(rid, paso, soloAceptados) { return lista(rid).filter(d => d.foto === paso && d.estado !== 'Descartado' && (!soloAceptados || ACEPTA.includes(d.estado))); }
  function area(p) { let a = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2; }
  const r2 = (n) => Math.round(n * 1000) / 1000;

  function registrar(d, accion, usr, extra) { d.hist.push(Object.assign({ accion, por: usr || '—', en: isoAhora() }, extra || {})); d.por = usr || '—'; d.en = isoAhora(); }
  function confirmar(rid, id, usr) { const d = daño(rid, id); if (!d || d.estado === 'Descartado') return false; d.estado = 'Confirmado'; registrar(d, 'Confirmado', usr); ST.edit = null; emit(); return true; }
  // cambios: { tipo, profundidad, pieza, poligono }. Recalcula la superficie con el área del polígono y la gravedad con la regla.
  function ajustar(rid, id, cambios, usr) { const d = daño(rid, id); if (!d) return false; const c = cambios || {}, det = [];
    if (c.tipo && c.tipo !== d.tipo) { det.push('Tipo: ' + d.tipo + ' → ' + c.tipo); d.tipo = c.tipo; d.confTipo = 100; }
    if (c.profundidad && c.profundidad !== profMostrada(d)) { det.push('Profundidad: ' + profMostrada(d) + ' → ' + c.profundidad); d.profundidad = c.profundidad; d.confProf = 100; }
    if (c.pieza && c.pieza !== d.pieza) { const t = silueta(rid); det.push('Pieza: ' + nombrePieza(t, d.pieza) + ' → ' + nombrePieza(t, c.pieza)); d.pieza = c.pieza; }
    if (c.poligono && JSON.stringify(c.poligono) !== JSON.stringify(d.poligono)) { const a0 = area(d.poligono), a1 = area(c.poligono), s0 = Number(d.superficie) || 0; const s1 = a0 > 0 ? Math.max(0.1, Math.round(s0 * a1 / a0 * 10) / 10) : s0;
      det.push('Área del daño: ' + num(s0) + ' → ' + num(s1) + ' dm²'); d.poligono = c.poligono.map(p => [r2(p[0]), r2(p[1])]); d.superficie = s1; d.confSup = 100; }
    if (!det.length) return false; d.estado = d.origen === 'Manual' ? 'Agregado a mano' : 'Ajustado'; registrar(d, 'Ajustado', usr, { detalle: det.join(' · ') + ' · gravedad ' + gravedad(d) }); ST.edit = null; emit(); return true; }
  function descartar(rid, id, motivo, usr) { const d = daño(rid, id), m = String(motivo || '').trim(); if (!d || m.length < MOTIVO_MIN) return false; d.estado = 'Descartado'; d.motivo = m; registrar(d, 'Descartado', usr, { detalle: 'Motivo: ' + m }); ST.edit = null; emit(); return true; }
  function agregar(rid, o, usr) { const L = lista(rid); ST.seq++; const d = { id: rid + '-m' + ST.seq, riesgo: rid, foto: o.foto, pieza: o.pieza, tipo: o.tipo, confTipo: 100, superficie: Number(o.superficie) || 1, confSup: 100, profundidad: o.profundidad || 'Superficial', confProf: 100,
      poligono: o.poligono || [[0.42, 0.42], [0.58, 0.42], [0.58, 0.58], [0.42, 0.58]], estado: 'Agregado a mano', origen: 'Manual', hist: [] };
    registrar(d, 'Agregado a mano', usr); L.push(d); emit(); return d.id; }
  // Etapa 12a-b: cada escena empieza desde los datos (el selector de escenas vuelve a cargar el estado sin recargar la página).
  function reset() { ST.r = {}; ST.edit = null; ST.seq = 0; emit(); }
  function primerPendiente(rids) { for (const rid of (rids || [])) { const d = lista(rid).find(x => x.estado === 'Propuesto'); if (d) return { rid, d }; } return null; }
  function editar(rid, id) { const d = id ? daño(rid, id) : null; ST.edit = d ? { rid, id, poligono: clone(d.poligono), tipo: d.tipo, profundidad: profMostrada(d), pieza: d.pieza, foco: -1 } : null; emit(); }
  function moverPunto(k, x, y) { const e = ST.edit; if (!e) return; e.poligono[k] = [Math.max(0, Math.min(1, r2(x))), Math.max(0, Math.min(1, r2(y)))]; e.foco = k; emit(); }
  function setEdit(p) { if (!ST.edit) return; Object.assign(ST.edit, p); emit(); }

  // ---------- Grilla de averías ----------
  // base: filas de la grilla del informe ({ pieza, tipo, grav, sup, by, at }). Una fila que coincide con un daño detectado (misma pieza y
  // tipo) sigue al daño: si está Propuesto o Descartado no pasa; si está Confirmado o Ajustado pasa con su gravedad, profundidad y origen.
  // Los daños aceptados sin fila propia se agregan. Las filas sin daño detectado quedan como «Agregado a mano».
  function averias(rid, base) { const t = silueta(rid), D = lista(rid), usados = {}, out = [];
    const fila = (d, a) => Object.assign({}, a || {}, { pieza: nombrePieza(t, d.pieza), zona: d.pieza, tipo: d.tipo, grav: gravedad(d), sup: num(d.superficie), prof: profMostrada(d), origen: origenTxt(d), estado: 'aceptada', by: d.por, at: fmtEn(d.en), conf: undefined, danoId: d.id, fotoPaso: d.foto });
    (base || []).forEach(a => { const zid = zonaDe(t, a.pieza), d = zid ? D.find(x => !usados[x.id] && x.pieza === zid && norm(x.tipo) === norm(a.tipo)) : null;
      if (d) { usados[d.id] = 1; if (ACEPTA.includes(d.estado)) out.push(fila(d, a)); return; }
      // Etapa 12a-b: si la fila trae la clave de la zona («implemento»), se muestra el nombre de la pieza; la foto del paso va a la columna Foto.
      const esClave = zid && zid === a.pieza; out.push(Object.assign({}, a, { pieza: esClave ? nombrePieza(t, zid) : a.pieza, zona: zid, prof: a.prof || '—', fotoPaso: a.fotoPaso || (typeof a.foto === 'string' && a.foto ? a.foto : undefined), origen: a.origen || ('Agregado a mano' + (a.by ? ' · ' + a.by : '')) })); });
    D.filter(d => !usados[d.id] && ACEPTA.includes(d.estado)).forEach(d => out.push(fila(d, null)));
    return out; }
  // Daño detectado que corresponde a una fila de la grilla del informe (para mostrar su origen y profundidad en el informe).
  function deFila(rid, a) { const t = silueta(rid), zid = zonaDe(t, a && a.pieza); return zid ? lista(rid).find(x => x.pieza === zid && norm(x.tipo) === norm(a.tipo)) || null : null; }

  // ---------- Dibujo (texto SVG para el PDF) ----------
  function svgDanos(L, o) { o = o || {}; if (!L || !L.length) return '';
    const pol = L.map(d => { const g = GRAV[gravedad(d)] || GRAV.Baja, pts = d.poligono.map(p => (p[0] * 100).toFixed(2) + ',' + (p[1] * 100).toFixed(2)).join(' ');
      return '<polygon points="' + pts + '" fill="' + g.f + '" stroke="' + g.c + '" stroke-width="' + (o.trazo || 0.8) + '"' + (d.estado === 'Propuesto' ? ' stroke-dasharray="2 1.4"' : '') + ' stroke-linejoin="round"/>'; }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible">' + pol + '</svg>'; }
  function bbox(p) { const xs = p.map(q => q[0]), ys = p.map(q => q[1]); return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }; }

  // ---------- Componentes ----------
  const R = () => window.React, h = (...a) => R().createElement(...a);
  const NS = () => window.AseguradoraDelSurDesignSystem_4fbf29 || {};
  function useStore() { const s = R().useState(0), set = s[1]; R().useEffect(() => on(() => set(x => x + 1)), []); }
  function Badge(tone, txt) { const B = NS().Badge; return B ? h(B, { tone }, h('span', { style: { whiteSpace: 'nowrap' } }, txt)) : h('span', { style: { fontSize: 12, fontWeight: 700 } }, txt); }
  const btnLink = (txt, onClick, aria, extra) => h('button', Object.assign({ type: 'button', onClick, 'aria-label': aria || txt, style: { padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: 'var(--text-link)', textDecoration: 'underline', textUnderlineOffset: 3 } }, extra || {}), txt);
  const btnSec = (txt, onClick, extra) => h('button', Object.assign({ type: 'button', onClick, style: { height: 34, padding: '0 12px', border: '1.5px solid var(--color-brand)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: 'var(--color-brand)' } }, extra || {}), txt);
  const btnPri = (txt, onClick, extra) => h('button', Object.assign({ type: 'button', onClick, style: { height: 34, padding: '0 14px', border: '1.5px solid var(--color-brand)', borderRadius: 'var(--radius-sm)', background: 'var(--color-brand)', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: '#FFFFFF' } }, extra || {}), txt);
  const selSt = { height: 34, minWidth: 0, width: '100%', padding: '0 6px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, color: 'var(--text-strong)' };
  const lab = (txt, ctl, id) => h('label', { htmlFor: id, style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', minWidth: 0 } }, txt, ctl);
  const sel = (id, val, opts, onChange) => h('select', { id, value: val, onChange: (e) => onChange(e.target.value), style: selSt }, opts.map(o => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return h('option', { key: v, value: v }, l); }));

  // Foto con sus daños. modo: 'mini' (miniatura de la galería) o 'visor'. En el visor el daño en edición muestra sus puntos.
  function SiriusDanosFoto(p) { useStore(); const rid = p.rid, paso = p.paso, L = deFoto(rid, paso, false), E = ST.edit && ST.edit.rid === rid ? ST.edit : null, ref = R().useRef(null), mini = p.modo === 'mini';
    const tit = p.etiqueta || 'Foto';
    const ver = L.map(d => E && E.id === d.id ? Object.assign({}, d, { poligono: E.poligono, tipo: E.tipo, profundidad: E.profundidad }) : d);
    const svg = h('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true', style: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' } },
      ver.map(d => { const g = GRAV[gravedad(d)] || GRAV.Baja; return h('polygon', { key: d.id, points: d.poligono.map(q => (q[0] * 100).toFixed(2) + ',' + (q[1] * 100).toFixed(2)).join(' '), fill: g.f, stroke: g.c, strokeWidth: mini ? 1.6 : 1, vectorEffect: 'non-scaling-stroke', strokeDasharray: d.estado === 'Propuesto' ? '5 3' : undefined, strokeLinejoin: 'round' }); }));
    const etqs = mini ? null : ver.map((d, i) => { const b = bbox(d.poligono), g = GRAV[gravedad(d)] || GRAV.Baja, arriba = b.y0 > 0.16;
      return h('span', { key: d.id, 'data-dano': d.id, style: { position: 'absolute', left: (Math.min(b.x0, 0.62) * 100) + '%', top: (arriba ? b.y0 * 100 : b.y1 * 100) + '%', transform: arriba ? 'translateY(calc(-100% - 6px))' : 'translateY(6px)', maxWidth: '38%', padding: '3px 7px', borderRadius: 6, background: '#FFFFFF', border: '1.5px solid ' + g.c, fontSize: 12, lineHeight: 1.35, color: '#14263f', pointerEvents: 'none', boxShadow: '0 1px 3px rgba(0,0,0,.25)' } },
        h('b', { style: { display: 'block', color: g.c } }, (i + 1) + '. ' + d.tipo + ' · ' + d.estado), num(d.superficie) + ' dm² · ' + profMostrada(d) + ' · ' + (d.confTipo == null ? 100 : d.confTipo) + ' %'); });
    const ed = E && L.some(d => d.id === E.id) ? E : null;
    const punto = (q, k) => { const n = ed.poligono.length;
      const mover = (dx, dy) => moverPunto(k, q[0] + dx, q[1] + dy);
      return h('button', { key: 'p' + k, type: 'button', 'data-punto': '1', 'aria-label': 'Punto ' + (k + 1) + ' de ' + n + ' del daño: ' + Math.round(q[0] * 100) + ' % horizontal, ' + Math.round(q[1] * 100) + ' % vertical. Muévelo con las flechas (Mayúsculas: más rápido) o arrastrándolo.',
        onKeyDown: (e) => { const st = e.shiftKey ? 0.05 : 0.01, M = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key]; if (M) { e.preventDefault(); e.stopPropagation(); mover(M[0], M[1]); } },
        onPointerDown: (e) => { e.preventDefault(); const box = ref.current; if (!box) return; const t = e.currentTarget; try { t.setPointerCapture(e.pointerId); } catch (x) {} t.focus();
          const mv = (ev) => { const r = box.getBoundingClientRect(); moverPunto(k, (ev.clientX - r.left) / r.width, (ev.clientY - r.top) / r.height); };
          const up = () => { t.removeEventListener('pointermove', mv); t.removeEventListener('pointerup', up); t.removeEventListener('pointercancel', up); };
          t.addEventListener('pointermove', mv); t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up); },
        style: { position: 'absolute', left: (q[0] * 100) + '%', top: (q[1] * 100) + '%', width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: '50%', border: '2.5px solid #FFFFFF', background: '#0B5CAD', boxShadow: '0 0 0 2px #0B2E59', cursor: 'move', padding: 0, touchAction: 'none', zIndex: 2 } }); };
    const fondo = p.fondo || (mini ? 'var(--surface-subtle)' : 'rgba(255,255,255,.08)'), color = mini ? 'var(--text-muted)' : '#FFFFFF';
    const caja = h('div', { ref, style: { position: 'relative', width: '100%', height: '100%' } }, h('span', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, textAlign: 'center', fontSize: mini ? 13 : 16, color } }, p.texto || tit), svg, etqs, ed && !mini ? ed.poligono.map(punto) : null);
    if (mini) return h('button', { type: 'button', 'aria-label': p.aria || tit, onClick: p.onOpen, style: { position: 'relative', display: 'block', width: '100%', height: p.alto || 96, padding: 0, border: '1.5px dashed var(--border-default)', borderRadius: 'var(--radius-sm)', background: fondo, cursor: 'pointer', fontFamily: 'var(--font-brand)', overflow: 'hidden' } }, caja,
      L.length ? h('span', { style: { position: 'absolute', right: 6, bottom: 6, padding: '1px 7px', borderRadius: 999, background: '#FFFFFF', border: '1px solid var(--border-default)', fontSize: 12, fontWeight: 700, color: 'var(--text-strong)' } }, L.length === 1 ? '1 daño' : L.length + ' daños') : null);
    return h('div', { role: 'img', 'aria-label': tit + (L.length ? ' · ' + L.length + (L.length === 1 ? ' daño marcado' : ' daños marcados') : ''), style: { position: 'relative', width: '100%', height: p.alto || '100%', minHeight: p.alto ? undefined : 320, border: mini ? 'none' : '1.5px dashed rgba(255,255,255,.5)', borderRadius: 'var(--radius-sm)', background: fondo, overflow: 'visible' } }, caja); }

  // Lista de revisión de los daños de una foto (paso) o de todo el riesgo. puede: el rol revisa (inspector o calificador).
  function SiriusDanosLista(p) { useStore(); const rid = p.rid, t = silueta(rid), L = p.paso ? lista(rid).filter(d => d.foto === p.paso) : lista(rid), E = ST.edit && ST.edit.rid === rid ? ST.edit : null, usr = p.usuario || '—', puede = !!p.puede, pre = p.pre || 'dn';
    const s0 = R().useState(null), modo = s0[0], setModo = s0[1], s1 = R().useState(''), mot = s1[0], setMot = s1[1], s2 = R().useState(false), intento = s2[0], setIntento = s2[1];
    const s3 = R().useState({ pieza: (zonas(t)[0] || {}).id || '', tipo: (CAP().danos.tipos || [])[0] || '', profundidad: 'Superficial', superficie: '1' }), nv = s3[0], setNv = s3[1];
    const TIPOS = CAP().danos.tipos || [], PROF = ((CAP().danos.profundidad || {}).categorias || []).concat(['Por confirmar']), ZS = zonas(t).map(z => [z.id, nombrePieza(t, z.id)]);
    const item = (d, i) => { const g = gravedad(d), G = GRAV[g] || GRAV.Baja, u = ultimo(d), enEd = E && E.id === d.id, enDesc = modo && modo.k === 'desc' && modo.id === d.id, idb = pre + '-' + d.id;
      const errMot = intento && String(mot).trim().length < MOTIVO_MIN ? 'Escribe el motivo (mínimo ' + MOTIVO_MIN + ' caracteres).' : '';
      return h('li', { key: d.id, style: { display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', border: '1px solid var(--border-subtle)', borderLeft: '4px solid ' + G.c, borderRadius: 'var(--radius-sm)', background: d.estado === 'Descartado' ? 'var(--surface-subtle)' : '#FFFFFF' } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '6px 10px' } },
          h('span', { id: idb + '-t', style: { fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' } }, (i + 1) + '. ' + d.tipo + ' · ' + nombrePieza(t, d.pieza)), Badge(TONO[d.estado] || 'neutral', d.estado)),
        h('span', { style: { fontSize: 13, color: 'var(--text-body)' } }, num(d.superficie) + ' dm² · profundidad ' + profMostrada(d) + ' · confianza ' + (d.confTipo == null ? 100 : d.confTipo) + ' % · gravedad ', h('b', { style: { color: G.fg } }, g)),
        h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, origenTxt(d) + (u ? ' · ' + fmtEn(u.en) : '') + (d.estado === 'Descartado' && d.motivo ? ' · Motivo: ' + d.motivo : '') + (d.nota && d.estado === 'Propuesto' ? ' · ' + d.nota : '')),
        (d.hist || []).length > 1 ? h('details', null, h('summary', { style: { cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--text-link)' } }, 'Historial (' + d.hist.length + ')'),
          h('ul', { style: { margin: '6px 0 0', paddingLeft: 18, fontSize: 12, lineHeight: 1.5, color: 'var(--text-body)' } }, d.hist.map((x, k) => h('li', { key: k }, x.accion + (x.por && x.por !== 'Sistema' ? ' · ' + x.por : '') + (x.en ? ' · ' + fmtEn(x.en) : '') + (x.detalle ? ' · ' + x.detalle : ''))))) : null,
        enEd ? h('div', { role: 'group', 'aria-labelledby': idb + '-t', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)' } },
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 } },
            lab('Tipo de daño', sel(idb + '-tipo', E.tipo, TIPOS, (v) => setEdit({ tipo: v })), idb + '-tipo'),
            lab('Profundidad', sel(idb + '-prof', E.profundidad, PROF, (v) => setEdit({ profundidad: v })), idb + '-prof'),
            lab('Pieza', sel(idb + '-pieza', E.pieza, ZS, (v) => setEdit({ pieza: v })), idb + '-pieza')),
          h('span', { style: { fontSize: 12, lineHeight: 1.45, color: 'var(--text-muted)' } }, 'Mueve los puntos del polígono en la foto: arrástralos o enfócalos con Tab y usa las flechas. La superficie y la gravedad se recalculan al guardar.'),
          h('span', { style: { fontSize: 13, color: 'var(--text-body)' } }, 'Gravedad con estos valores: ', h('b', null, gravedad(Object.assign({}, d, { tipo: E.tipo, profundidad: E.profundidad, confProf: 100, superficie: area(d.poligono) > 0 ? (Number(d.superficie) || 0) * area(E.poligono) / area(d.poligono) : d.superficie })))),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, btnPri('Guardar ajuste', () => ajustar(rid, d.id, { tipo: E.tipo, profundidad: E.profundidad, pieza: E.pieza, poligono: E.poligono }, usr) || editar(null)), btnSec('Cancelar', () => editar(null)))) : null,
        enDesc ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)' } },
          h('label', { htmlFor: idb + '-mot', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Motivo del descarte'),
          h('textarea', { id: idb + '-mot', rows: 2, value: mot, 'aria-invalid': errMot ? 'true' : undefined, 'aria-describedby': errMot ? idb + '-mot-e' : undefined, onChange: (e) => setMot(e.target.value), placeholder: 'Por ejemplo: es un reflejo del sol, no un daño', style: { width: '100%', padding: '6px 8px', border: '1.5px solid ' + (errMot ? 'var(--color-danger)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14, resize: 'vertical' } }),
          errMot ? h('span', { id: idb + '-mot-e', role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, errMot) : null,
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, btnPri('Descartar daño', () => { setIntento(true); if (descartar(rid, d.id, mot, usr)) { setModo(null); setMot(''); setIntento(false); } }), btnSec('Cancelar', () => { setModo(null); setMot(''); setIntento(false); }))) : null,
        puede && !enEd && !enDesc && d.estado !== 'Descartado' ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px 16px' } },
          d.estado === 'Propuesto' ? btnLink('Confirmar', () => confirmar(rid, d.id, usr), 'Confirmar daño ' + (i + 1) + ' · ' + d.tipo) : null,
          btnLink('Ajustar', () => { setModo(null); editar(rid, d.id); if (p.onFoto) p.onFoto(d.foto); }, 'Ajustar daño ' + (i + 1) + ' · ' + d.tipo),
          btnLink('Descartar', () => { editar(null); setModo({ k: 'desc', id: d.id }); setMot(''); setIntento(false); }, 'Descartar daño ' + (i + 1) + ' · ' + d.tipo)) : null); };
    const pend = L.filter(d => d.estado === 'Propuesto').length;
    const agregarForm = modo && modo.k === 'add' ? h('div', { role: 'group', 'aria-label': 'Agregar daño a mano', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 10, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)' } },
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 } },
        lab('Pieza', sel(pre + '-n-pieza', nv.pieza, ZS, (v) => setNv(Object.assign({}, nv, { pieza: v }))), pre + '-n-pieza'),
        lab('Tipo de daño', sel(pre + '-n-tipo', nv.tipo, TIPOS, (v) => setNv(Object.assign({}, nv, { tipo: v }))), pre + '-n-tipo'),
        lab('Profundidad', sel(pre + '-n-prof', nv.profundidad, (CAP().danos.profundidad || {}).categorias || [], (v) => setNv(Object.assign({}, nv, { profundidad: v }))), pre + '-n-prof'),
        lab('Superficie (dm²)', h('input', { id: pre + '-n-sup', type: 'text', inputMode: 'decimal', value: nv.superficie, onChange: (e) => setNv(Object.assign({}, nv, { superficie: e.target.value })), style: selSt }), pre + '-n-sup')),
      h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, 'El área se marca en el centro de la foto; después ajústala con «Ajustar».'),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, btnPri('Agregar daño', () => { const s = Number(String(nv.superficie).replace(',', '.')); agregar(rid, { foto: p.paso, pieza: nv.pieza, tipo: nv.tipo, profundidad: nv.profundidad, superficie: s > 0 ? s : 1 }, usr); setModo(null); }), btnSec('Cancelar', () => setModo(null)))) : null;
    return h('section', { 'aria-label': p.titulo || 'Daños detectados', style: { display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 } }, h('h3', { style: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, p.titulo || 'Daños detectados'),
        h('span', { style: { fontSize: 13, color: pend ? 'var(--color-danger)' : 'var(--text-muted)', fontWeight: pend ? 700 : 400 } }, L.length ? (pend ? (pend === 1 ? '1 propuesto por revisar' : pend + ' propuestos por revisar') : 'Todo revisado') : 'Sin daños en esta foto')),
      L.length ? h('ol', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, L.map(item)) : null,
      !puede ? h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, 'Solo lectura: revisan el inspector y el calificador.') : null,
      puede && p.paso && !(modo && modo.k === 'add') ? h('div', null, btnSec('Agregar daño a mano', () => { editar(null); setModo({ k: 'add' }); })) : null, agregarForm); }

  // Miniatura de la galería: la misma caja de la foto con sus polígonos y el número de daños.
  function SiriusDanosMini(p) { return h(SiriusDanosFoto, Object.assign({}, p, { modo: 'mini' })); }

  // Todas las fotos con daños de un riesgo (la calificación lo abre antes de grabar si hay daños propuestos).
  function SiriusDanosRevision(p) { useStore(); const rid = p.rid, L = lista(rid), fotos = L.map(d => d.foto).filter((x, i, a) => a.indexOf(x) === i), T = ((EJ().plantillas || {})[((riesgo(rid) || {}).formulario) || 'Vehículos livianos v1'] || {}).pasos || [];
    const nombre = (paso) => (T.find(s => s.id === paso) || {}).name || paso;
    if (!fotos.length) return h('p', { style: { margin: 0, fontSize: 14, color: 'var(--text-muted)' } }, 'El sistema no detectó daños en las fotos de este riesgo.');
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } }, fotos.map(f => h('div', { key: f, style: { display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 16, alignItems: 'start' } },
      h('div', { style: { height: 260 } }, h(SiriusDanosFoto, { rid, paso: f, etiqueta: 'Foto · ' + nombre(f), texto: nombre(f) + ' · imagen de ejemplo', fondo: '#1f2a37', alto: 260 })),
      h(SiriusDanosLista, { rid, paso: f, usuario: p.usuario, puede: p.puede, titulo: nombre(f), pre: 'dnr' })))); }

  window.SiriusDanos = { reset, primerPendiente, lista, deFoto, pendientes, confirmar, ajustar, descartar, agregar, editar, moverPunto, setEdit, averias, deFila, gravedad, profMostrada, etiqueta, origenTxt, silueta, zonaDe, nombrePieza, zonas, svgDanos, on, GRAV, ACEPTA, MOTIVO_MIN, fmtEn, estado: () => ST };
  Object.assign(window, { SiriusDanosFoto, SiriusDanosLista, SiriusDanosMini, SiriusDanosRevision });
})();
