// Campo de fecha, fecha y hora u hora compartido de SIRIUS (el sistema de diseño no tiene selector de fecha).
// Se escribe con máscara DD/MM/AAAA · HH:MM o se elige en un panel (mes, año, Hoy; horas y minutos, Ahora).
// formato del valor: 'iso' (AAAA-MM-DD · AAAA-MM-DDTHH:MM · HH:MM), 'corto' (DD/MM/AA · HH:MM) o 'largo' (DD/MM/AAAA · HH:MM).
// onChange recibe { target: { value } } como un input. Incompleto: 'iso' envía '' y los demás el texto escrito, para que el formulario no pueda guardarlo.
// SiriusFecha.validar(valor, { modo, min, max, minLabel, maxLabel, req }) devuelve el error o ''.
(function () {
  var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'], DIAS_L = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  function z(n) { return String(n).padStart(2, '0'); }
  function ahora() { var E = window.SIRIUS_EJEMPLO || {}; return E.ahora ? E.ahora() : new Date(); }
  function partsOf(d) { return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), mi: d.getMinutes() }; }
  function lim(v, modo) { if (v === 'ahora' || v === 'hoy') { var p = partsOf(ahora()); if (v === 'hoy' || modo === 'fecha') { p.h = 23; p.mi = 59; } return p; } return parse(v); }
  function y4(y) { return y < 100 ? 2000 + y : y; }
  // Acepta AAAA-MM-DD[THH:MM], DD/MM/AA[AA][ · HH:MM] y HH:MM. Devuelve partes o null si no está completo.
  function parse(s) { s = String(s || '').trim(); if (!s) return null; var m;
    if ((m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/.exec(s))) return { y: +m[1], m: +m[2], d: +m[3], h: m[4] != null ? +m[4] : null, mi: m[5] != null ? +m[5] : null };
    if ((m = /^(\d{2})\/(\d{2})\/(\d{4}|\d{2})(?:\s*·\s*(\d{2}):(\d{2}))?$/.exec(s))) return { y: y4(+m[3]), m: +m[2], d: +m[1], h: m[4] != null ? +m[4] : null, mi: m[5] != null ? +m[5] : null };
    if ((m = /^(\d{2}):(\d{2})$/.exec(s))) return { y: null, m: null, d: null, h: +m[1], mi: +m[2] };
    return null; }
  function key(p, modo) { return modo === 'hora' ? (p.h * 60 + p.mi) : ((p.y * 100 + p.m) * 100 + p.d) * 10000 + (modo === 'fecha' ? 0 : (p.h || 0) * 100 + (p.mi || 0)); }
  function existe(p) { var d = new Date(p.y, p.m - 1, p.d); return d.getFullYear() === p.y && d.getMonth() === p.m - 1 && d.getDate() === p.d; }
  function mascara(modo) { return modo === 'hora' ? 'HH:MM' : modo === 'fecha' ? 'DD/MM/AAAA' : 'DD/MM/AAAA · HH:MM'; }
  function mostrar(p, modo) { if (!p) return ''; if (modo === 'hora') return z(p.h) + ':' + z(p.mi); var f = z(p.d) + '/' + z(p.m) + '/' + p.y; return modo === 'fecha' ? f : f + ' · ' + z(p.h || 0) + ':' + z(p.mi || 0); }
  function salida(p, modo, formato) { if (modo === 'hora') return z(p.h) + ':' + z(p.mi);
    if (formato === 'iso') return p.y + '-' + z(p.m) + '-' + z(p.d) + (modo === 'fecha' ? '' : 'T' + z(p.h) + ':' + z(p.mi));
    var f = z(p.d) + '/' + z(p.m) + '/' + (formato === 'corto' ? String(p.y).slice(2) : p.y); return modo === 'fecha' ? f : f + ' · ' + z(p.h) + ':' + z(p.mi); }
  // Texto con máscara a partir de los dígitos escritos.
  function enmascarar(txt, modo) { var d = String(txt || '').replace(/\D/g, ''), out = '';
    var seps = modo === 'hora' ? [[2, ':']] : modo === 'fecha' ? [[2, '/'], [4, '/']] : [[2, '/'], [4, '/'], [8, ' · '], [10, ':']], max = modo === 'hora' ? 4 : modo === 'fecha' ? 8 : 12;
    d = d.slice(0, max); for (var i = 0; i < d.length; i++) { seps.forEach(function (s) { if (s[0] === i) out += s[1]; }); out += d[i]; } return out; }
  function completo(txt, modo) { return String(txt || '').replace(/\D/g, '').length === (modo === 'hora' ? 4 : modo === 'fecha' ? 8 : 12); }
  function validar(v, o) { o = o || {}; var modo = o.modo || 'fecha', s = String(v || '').trim(); if (!s) return o.req ? 'Completa este campo.' : '';
    var p = parse(s); if (!p || (modo !== 'hora' && p.y == null) || (modo !== 'fecha' && p.h == null)) return 'Completa ' + (modo === 'hora' ? 'la hora' : modo === 'fecha' ? 'la fecha' : 'la fecha y la hora') + ' con el formato ' + mascara(modo) + '.';
    if (modo !== 'hora' && (p.m < 1 || p.m > 12 || p.d < 1 || !existe(p))) return 'La fecha no existe.';
    if (modo !== 'fecha' && (p.h > 23 || p.mi > 59)) return 'La hora no es válida: usa de 00:00 a 23:59.';
    var mn = o.min ? lim(o.min, modo) : null, mx = o.max ? lim(o.max, modo) : null;
    if (mx && key(p, modo) > key(mx, modo)) return 'No puede ser posterior a ' + (o.maxLabel || (o.max === 'ahora' ? 'la fecha y hora actual' : o.max === 'hoy' ? 'hoy' : mostrar(mx, modo))) + '.';
    if (mn && key(p, modo) < key(mn, modo)) return 'No puede ser anterior a ' + (o.minLabel || (o.min === 'ahora' ? 'la fecha y hora actual' : o.min === 'hoy' ? 'hoy' : mostrar(mn, modo))) + '.';
    return ''; }
  var ICON = { cal: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', prev: 'M15 18l-6-6 6-6', next: 'M9 18l6-6-6-6' };

  function SiriusFecha(props) {
    var R = window.React, h = R.createElement, modo = props.modo || 'fecha', formato = props.formato || 'iso';
    var st = R.useState(mostrar(parse(props.value), modo) || String(props.value || '')), txt = st[0], setTxt = st[1];
    var sent = R.useRef(props.value), wrap = R.useRef(null), inp = R.useRef(null), panel = R.useRef(null);
    var so = R.useState(false), open = so[0], setOpen = so[1], sp = R.useState(null), pos = sp[0], setPos = sp[1];
    var sv = R.useState(null), vista = sv[0], setVista = sv[1], sf = R.useState(null), foco = sf[0], setFoco = sf[1], sd = R.useState(null), pend = sd[0], setPend = sd[1];
    var stt = R.useState(false), toc = stt[0], setToc = stt[1], sfc = R.useState(false), fc = sfc[0], setFc = sfc[1];
    var opts = { modo: modo, min: props.min, max: props.max, minLabel: props.minLabel, maxLabel: props.maxLabel, req: props.req };
    var cb = R.useRef(props); cb.current = props;
    R.useEffect(function () { if (props.value !== sent.current) { sent.current = props.value; var p = parse(props.value); setTxt(p ? mostrar(p, modo) : String(props.value || '')); } }, [props.value]);
    function emitir(t) { var p = parse(t), v = completo(t, modo) && p ? salida(p, modo, formato) : (t === '' ? '' : (formato === 'iso' ? '' : t)); sent.current = v; var f = cb.current.onChange; if (f) f({ target: { value: v }, currentTarget: { value: v } }); }
    function onInput(e) { var raw = e.target.value, t = enmascarar(raw, modo); if (raw.length < txt.length && t === txt) t = enmascarar(txt.replace(/\D/g, '').slice(0, -1), modo); setTxt(t); emitir(t); }
    var err = validar(completo(txt, modo) ? txt : txt, opts), showErr = !!err && (toc || !!props.showError) && !open;
    // Debajo del campo; si no cabe, encima; nunca lo tapa. Si no cabe en ninguno de los dos lados, se abre centrado como modal pequeño.
    function colocar() { var el = wrap.current; if (!el) return; var r = el.getBoundingClientRect(), W = modo === 'hora' ? 220 : 312, H = (panel.current && panel.current.offsetHeight) || (modo === 'fecha' ? 370 : modo === 'hora' ? 260 : 540), vh = window.innerHeight, vw = window.innerWidth;
      var left = Math.max(8, Math.min(r.left, vw - W - 8));
      if (r.bottom + 4 + H <= vh - 8) setPos({ top: r.bottom + 4, left: left, w: W, centro: false });
      else if (r.top - 4 - H >= 8) setPos({ top: r.top - 4 - H, left: left, w: W, centro: false });
      else setPos({ top: Math.max(8, Math.round((vh - H) / 2)), left: Math.max(8, Math.round((vw - W) / 2)), w: W, centro: true }); }
    function abrir() { if (props.disabled) return; var p = parse(txt) || null, base = p && p.y ? p : partsOf(ahora()); if (modo === 'hora' && !p) { var n = partsOf(ahora()); base = { h: n.h, mi: n.mi }; }
      setPend(Object.assign({ y: base.y, m: base.m, d: base.d, h: base.h != null ? base.h : 0, mi: base.mi != null ? base.mi : 0 }, p && p.y == null ? { h: p.h, mi: p.mi } : {}));
      var b0 = new Date(base.y || partsOf(ahora()).y, (base.m || partsOf(ahora()).m) - 1, base.d || 1), lmx = props.max ? lim(props.max, 'fecha') : null, lmn = props.min ? lim(props.min, 'fecha') : null, kb = key({ y: b0.getFullYear(), m: b0.getMonth() + 1, d: b0.getDate() }, 'fecha');
      if (modo !== 'hora') { if (lmx && kb > key(lmx, 'fecha')) b0 = new Date(lmx.y, lmx.m - 1, lmx.d); else if (lmn && kb < key(lmn, 'fecha')) b0 = new Date(lmn.y, lmn.m - 1, lmn.d); }
      setVista({ y: b0.getFullYear(), m: b0.getMonth() + 1 }); setFoco(b0.getDate()); colocar(); setOpen(true); }
    function cerrar(volver) { setOpen(false); setToc(true); if (volver && inp.current) inp.current.focus(); }
    function aplicar(p) { var t = mostrar(p, modo); setTxt(t); emitir(t); cerrar(true); }
    R.useEffect(function () { if (!open) return; function fuera(e) { if (wrap.current && wrap.current.contains(e.target)) return; if (panel.current && panel.current.contains(e.target)) return; setOpen(false); setToc(true); }
      var raf = 0, last = '', anc = [], q = wrap.current && wrap.current.parentElement; while (q && q !== document.body) { var cs = getComputedStyle(q); if (/(auto|scroll|hidden)/.test(cs.overflowY + cs.overflowX)) anc.push(q); q = q.parentElement; }
      // Sigue al campo en cada cuadro: si la página o el contenedor se desplazan, el panel se mueve con él; si el campo sale de la vista, se cierra.
      var vivo = true; function seguir(una) { var el = wrap.current; if (!el || !vivo) return; var r = el.getBoundingClientRect(), vh = window.innerHeight, fuera2 = r.bottom < 0 || r.top > vh || (r.width === 0 && r.height === 0);
        for (var i = 0; !fuera2 && i < anc.length; i++) { var a = anc[i].getBoundingClientRect(); if (r.bottom < a.top + 4 || r.top > a.bottom - 4) fuera2 = true; }
        if (fuera2) { vivo = false; setOpen(false); setToc(true); return; } var s = Math.round(r.top) + ',' + Math.round(r.left) + ',' + vh + ',' + window.innerWidth + ',' + (panel.current ? panel.current.offsetHeight : 0); if (s !== last) { last = s; colocar(); } if (una !== true) raf = requestAnimationFrame(seguir); }
      function alMover(e) { if (e && e.target && panel.current && e.target.nodeType === 1 && panel.current.contains(e.target)) return; seguir(true); }
      raf = requestAnimationFrame(seguir); document.addEventListener('mousedown', fuera, true); window.addEventListener('scroll', alMover, true); window.addEventListener('resize', alMover);
      var t = setTimeout(function () { var n = panel.current && (panel.current.querySelector('[data-foco="1"]') || panel.current.querySelector('button')); if (n) n.focus(); }, 0);
      return function () { clearTimeout(t); vivo = false; cancelAnimationFrame(raf); document.removeEventListener('mousedown', fuera, true); window.removeEventListener('scroll', alMover, true); window.removeEventListener('resize', alMover); }; }, [open]);
    R.useEffect(function () { if (!open || !panel.current) return; var n = panel.current.querySelector('[data-foco="1"]'); if (n && document.activeElement && panel.current.contains(document.activeElement) && (document.activeElement.getAttribute('data-dia') || document.activeElement.tagName === 'SELECT' || document.activeElement.tagName === 'BUTTON')) { if (document.activeElement.getAttribute('data-dia')) n.focus(); } }, [foco, vista && vista.m, vista && vista.y]);
    var mn = props.min ? lim(props.min, 'fecha') : null, mx = props.max ? lim(props.max, 'fecha') : null;
    function diaFuera(y, m, d) { var k = key({ y: y, m: m, d: d }, 'fecha'); return (mx && k > key(mx, 'fecha')) || (mn && k < key(mn, 'fecha')); }
    // Lleva una fecha al día permitido más cercano (límites min/max del campo).
    function ajustar(d) { var k = key({ y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }, 'fecha'); if (mx && k > key(mx, 'fecha')) return new Date(mx.y, mx.m - 1, mx.d); if (mn && k < key(mn, 'fecha')) return new Date(mn.y, mn.m - 1, mn.d); return d; }
    function irA(d) { d = ajustar(d); setVista({ y: d.getFullYear(), m: d.getMonth() + 1 }); setFoco(d.getDate()); }
    function moverDia(n) { irA(new Date(vista.y, vista.m - 1, foco + n)); }
    function moverMes(n) { var d = new Date(vista.y, vista.m - 1 + n, 1), dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); irA(new Date(d.getFullYear(), d.getMonth(), Math.min(foco || 1, dim))); }
    function elegirDia(d) { if (diaFuera(vista.y, vista.m, d)) return; var p = Object.assign({}, pend, { y: vista.y, m: vista.m, d: d }); setFoco(d); if (modo === 'fecha') aplicar(p); else setPend(p); }
    function teclaPanel(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(true); return; } if (e.key === 'Tab') { var f = Array.prototype.slice.call(panel.current.querySelectorAll('button:not([disabled]),select,[tabindex="0"]')); if (!f.length) return; var i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } e.stopPropagation(); } }
    function teclaDia(e) { var k = e.key, map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }; if (map[k]) { e.preventDefault(); moverDia(map[k]); } else if (k === 'PageUp' || k === 'PageDown') { e.preventDefault(); moverMes(k === 'PageUp' ? -1 : 1); } else if (k === 'Home' || k === 'End') { e.preventDefault(); setFoco(k === 'Home' ? 1 : new Date(vista.y, vista.m, 0).getDate()); } else if (k === 'Enter' || k === ' ') { e.preventDefault(); elegirDia(foco); } }
    // Lista de horas o minutos. off(i) devuelve el motivo si el valor está fuera de límite ('' si es válido). La rueda solo desplaza la lista.
    function lista(n, sel, onSel, label, off) {
      function paso(dir) { for (var k = 1; k <= n; k++) { var c = ((sel + dir * k) % n + n) % n; if (!off(c)) return c; } return sel; }
      return h('div', { role: 'listbox', 'aria-label': label, tabIndex: 0, onKeyDown: function (e) { var k = e.key; if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); onSel(paso(k === 'ArrowDown' ? 1 : -1)); } else if (k === 'Home' || k === 'End') { e.preventDefault(); for (var i = 0; i < n; i++) { var c = k === 'Home' ? i : n - 1 - i; if (!off(c)) { onSel(c); break; } } } },
        style: { position: 'relative', flex: 1, height: 150, overflowY: 'auto', overscrollBehavior: 'contain', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 'none' },
        ref: function (el) { if (!el) return; if (!el.__rueda) { el.__rueda = 1; el.addEventListener('wheel', function (ev) { ev.preventDefault(); ev.stopPropagation(); el.scrollTop += ev.deltaMode === 1 ? ev.deltaY * 28 : ev.deltaY; }, { passive: false }); }
          if (el.__sel !== sel) { el.__sel = sel; var s = el.querySelector('[aria-selected="true"]'); if (s && (s.offsetTop < el.scrollTop || s.offsetTop + s.offsetHeight > el.scrollTop + el.clientHeight)) el.scrollTop = s.offsetTop - 60; } } },
        Array.from({ length: n }, function (_, i) { var on = i === sel, r = off(i); return h('div', { key: i, role: 'option', 'aria-selected': on ? 'true' : 'false', 'aria-disabled': r ? 'true' : undefined, title: r || undefined, onClick: r ? undefined : function () { onSel(i); },
          style: { padding: '6px 0', textAlign: 'center', fontSize: 14, fontWeight: on ? 800 : 400, cursor: r ? 'not-allowed' : 'pointer', background: on ? (r ? 'var(--neutral-200)' : 'var(--color-brand)') : 'transparent', color: r ? 'var(--neutral-400)' : on ? 'var(--neutral-900)' : 'var(--text-strong)' } }, z(i)); })); }
    var boton = function (label, onClick, primary, dis) { return h('button', { type: 'button', onClick: dis ? undefined : onClick, disabled: !!dis, style: { opacity: dis ? 0.5 : 1, height: 36, padding: '0 14px', border: '1.5px solid var(--color-brand)', borderRadius: 'var(--radius-sm)', background: primary ? 'var(--color-brand)' : '#FFFFFF', color: primary ? 'var(--neutral-900)' : 'var(--text-strong)', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, cursor: dis ? 'not-allowed' : 'pointer' } }, label); };
    var svg = function (d, s) { return h('svg', { width: s || 18, height: s || 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: d })); };
    var pnl = null;
    if (open && pos && pend) {
      var hijos = [];
      // Límites con fecha y hora juntas: en un día pasado todas las horas son válidas; solo el día del límite bloquea horas.
      var mxT = props.max ? lim(props.max, modo) : null, mnT = props.min ? lim(props.min, modo) : null;
      var mxTx = props.maxLabel || (props.max === 'ahora' ? 'la fecha y hora actual' : mostrar(mxT, modo)), mnTx = props.minLabel || (props.min === 'ahora' ? 'la fecha y hora actual' : mostrar(mnT, modo));
      var K = function (hh, mm) { return key({ y: pend.y, m: pend.m, d: pend.d, h: hh, mi: mm }, modo === 'hora' ? 'hora' : 'fechaHora'); };
      var offR = function (a, b) { if (mxT && a > key(mxT, modo === 'hora' ? 'hora' : 'fechaHora')) return 'No disponible: es posterior a ' + mxTx; if (mnT && b < key(mnT, modo === 'hora' ? 'hora' : 'fechaHora')) return 'No disponible: es anterior a ' + mnTx; return ''; };
      var offH = function (hh) { return offR(K(hh, 0), K(hh, 59)); }, offM = function (mm) { return offR(K(pend.h, mm), K(pend.h, mm)); };
      if (modo !== 'hora') { var y = vista.y, m = vista.m, first = (new Date(y, m - 1, 1).getDay() + 6) % 7, dim = new Date(y, m, 0).getDate(), hoy = partsOf(ahora()), celdas = [];
        for (var i = 0; i < first; i++) celdas.push(h('span', { key: 'v' + i, role: 'gridcell' }));
        for (var d = 1; d <= dim; d++) (function (d) { var fuera = diaFuera(y, m, d), sel = pend.y === y && pend.m === m && pend.d === d, esHoy = hoy.y === y && hoy.m === m && hoy.d === d, enfoque = d === foco;
          celdas.push(h('button', { key: d, type: 'button', role: 'gridcell', 'data-dia': '1', 'data-foco': enfoque ? '1' : undefined, tabIndex: enfoque ? 0 : -1, 'aria-disabled': fuera ? 'true' : undefined, 'aria-selected': sel ? 'true' : 'false', 'aria-label': DIAS_L[(first + d - 1) % 7] + ' ' + d + ' de ' + MESES[m - 1].toLowerCase() + ' de ' + y + (fuera ? ', fuera del rango permitido' : ''), onClick: function () { elegirDia(d); }, onKeyDown: teclaDia,
            style: { height: 36, border: esHoy && !sel ? '1.5px solid var(--color-brand)' : '1.5px solid transparent', borderRadius: 'var(--radius-sm)', background: sel ? 'var(--color-brand)' : 'transparent', color: fuera ? 'var(--neutral-400)' : 'var(--text-strong)', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: sel ? 800 : 400, cursor: fuera ? 'not-allowed' : 'pointer', textDecoration: fuera ? 'line-through' : 'none' } }, d)); })(d);
        var anios = []; for (var a = y - 100; a <= y + 10; a++) anios.push(a);
        hijos.push(h('div', { key: 'cab', style: { display: 'flex', alignItems: 'center', gap: 6 } },
          h('button', { type: 'button', 'aria-label': 'Mes anterior', onClick: function () { moverMes(-1); }, style: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-strong)', cursor: 'pointer' } }, svg(ICON.prev)),
          h('select', { 'aria-label': 'Mes', value: m, onChange: function (e) { var nm = +e.target.value; irA(new Date(y, nm - 1, Math.min(foco, new Date(y, nm, 0).getDate()))); }, style: { flex: 1, height: 36, padding: '0 6px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' } }, MESES.map(function (n, i) { return h('option', { key: i, value: i + 1 }, n); })),
          h('select', { 'aria-label': 'Año', value: y, onChange: function (e) { var ny = +e.target.value; irA(new Date(ny, m - 1, Math.min(foco, new Date(ny, m, 0).getDate()))); }, style: { width: 84, height: 36, padding: '0 6px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' } }, anios.map(function (n) { return h('option', { key: n, value: n }, n); })),
          h('button', { type: 'button', 'aria-label': 'Mes siguiente', onClick: function () { moverMes(1); }, style: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-strong)', cursor: 'pointer' } }, svg(ICON.next))));
        hijos.push(h('div', { key: 'grid', role: 'grid', 'aria-label': MESES[m - 1] + ' de ' + y, style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 } }, DIAS.map(function (n, i) { return h('span', { key: 'h' + i, role: 'columnheader', 'aria-label': DIAS_L[i], style: { textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' } }, n); }).concat(celdas))); }
      if (modo !== 'fecha') hijos.push(h('div', { key: 'hora', style: { display: 'flex', flexDirection: 'column', gap: 6, paddingTop: modo === 'hora' ? 0 : 10, borderTop: modo === 'hora' ? 'none' : '1px solid var(--border-subtle)' } },
        h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Hora · ' + z(pend.h) + ':' + z(pend.mi)),
        h('div', { style: { display: 'flex', gap: 8 } }, lista(24, pend.h, function (v) { setPend(function (q) { return Object.assign({}, q, { h: v }); }); }, 'Horas', offH), lista(60, pend.mi, function (v) { setPend(function (q) { return Object.assign({}, q, { mi: v }); }); }, 'Minutos', offM))));
      var perr = modo !== 'hora' ? validar(mostrar(pend, modo), opts) : validar(z(pend.h) + ':' + z(pend.mi), opts);
      var ok = function () { if (perr) return; var p = Object.assign({}, pend); if (modo === 'hora') { p.y = null; } aplicar(p); };
      var pie = modo === 'fecha' ? [boton('Hoy', function () { var n = partsOf(ahora()); if (!diaFuera(n.y, n.m, n.d)) aplicar(n); })] : modo === 'hora' ? [boton('Ahora', function () { var n = partsOf(ahora()); setPend(function (q) { return Object.assign({}, q, { h: n.h, mi: n.mi }); }); }), boton('Aceptar', ok, true, !!perr)] : [boton('Hoy', function () { var n = partsOf(ahora()); if (diaFuera(n.y, n.m, n.d)) { irA(new Date(n.y, n.m - 1, n.d)); return; } setVista({ y: n.y, m: n.m }); setFoco(n.d); setPend(Object.assign({}, pend, { y: n.y, m: n.m, d: n.d })); }), boton('Ahora', function () { var n = partsOf(ahora()); setVista({ y: n.y, m: n.m }); setFoco(n.d); setPend({ y: n.y, m: n.m, d: n.d, h: n.h, mi: n.mi }); }), boton('Aceptar', ok, true, !!perr)];
      if (modo !== 'fecha' && perr) hijos.push(h('span', { key: 'perr', role: 'alert', style: { fontSize: 12, color: 'var(--color-danger)' } }, perr));
      hijos.push(h('div', { key: 'pie', style: { display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' } }, pie));
      pnl = h('div', { ref: panel, role: 'dialog', 'aria-modal': pos.centro ? 'true' : undefined, 'aria-label': modo === 'hora' ? 'Elegir hora' : modo === 'fecha' ? 'Elegir fecha' : 'Elegir fecha y hora', onKeyDown: teclaPanel, onMouseDown: function (e) { e.stopPropagation(); },
        style: { position: 'fixed', top: pos.top, left: pos.left, width: pos.w, maxHeight: 'calc(100vh - 16px)', overflowY: 'auto', overscrollBehavior: 'contain', zIndex: 2100, background: '#FFFFFF', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-modal)', border: '1px solid var(--border-subtle)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-brand)', boxSizing: 'border-box' } }, hijos);
      if (pos.centro) pnl = h(R.Fragment, null, h('div', { 'aria-hidden': 'true', onMouseDown: function (e) { e.stopPropagation(); cerrar(true); }, style: { position: 'fixed', inset: 0, zIndex: 2099, background: 'var(--scrim-modal, rgba(0,0,0,.4))' } }), pnl);
      pnl = window.ReactDOM && window.ReactDOM.createPortal ? window.ReactDOM.createPortal(pnl, document.body) : pnl; }
    var errId = (props.id || 'sf') + '-ferr', H = props.height || 44, border = showErr || props.invalid === 'true' ? 'var(--color-danger)' : 'var(--input-outlined-border)';
    return h('div', { ref: wrap, style: { position: 'relative', display: 'flex', flexDirection: 'column', gap: 4, width: props.width || '100%', minWidth: 0 } },
      h('div', { style: { position: 'relative', display: 'flex' } },
        h('input', { ref: inp, id: props.id, type: 'text', inputMode: 'numeric', autoComplete: 'off', value: txt, placeholder: props.placeholder || mascara(modo), disabled: !!props.disabled, 'aria-label': props.ariaLabel, 'aria-invalid': showErr || props.invalid === 'true' ? 'true' : undefined, 'aria-describedby': [props.ariaDescribedby, showErr ? errId : ''].filter(Boolean).join(' ') || undefined, 'aria-required': props.req ? 'true' : undefined,
          onChange: onInput, onBlur: function (e) { setToc(true); setFc(false); var f = cb.current.onBlur; if (f) f(e); }, onFocus: function () { setFc(true); }, onKeyDown: function (e) { if ((e.altKey && e.key === 'ArrowDown') || (e.key === 'Enter' && !completo(txt, modo))) { e.preventDefault(); abrir(); } },
          style: { width: '100%', height: H, padding: '0 44px 0 12px', border: '1.5px solid ' + (fc && !showErr ? 'var(--color-brand)' : border), boxShadow: fc ? '0 0 0 3px var(--cyan-100)' : 'none', borderRadius: 'var(--radius-sm)', background: props.disabled ? 'var(--surface-subtle)' : '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: props.fontSize || 15, color: 'var(--text-strong)', boxSizing: 'border-box', fontVariantNumeric: 'tabular-nums', outline: 'none' } }),
        h('button', { type: 'button', disabled: !!props.disabled, 'aria-label': modo === 'hora' ? 'Abrir selector de hora' : 'Abrir calendario', 'aria-haspopup': 'dialog', 'aria-expanded': open ? 'true' : 'false', onClick: function () { open ? cerrar(true) : abrir(); },
          style: { position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', color: props.disabled ? 'var(--neutral-400)' : 'var(--text-strong)', cursor: props.disabled ? 'default' : 'pointer' } }, svg(modo === 'hora' ? ICON.clock : ICON.cal))),
      showErr && !props.hideError ? h('span', { id: errId, role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, err) : null, pnl);
  }
  SiriusFecha.validar = validar; SiriusFecha.parse = parse;
  // Etapa P-6f-0e · DEC-230: reloj real de Ecuador (America/Guayaquil, UTC−5 sin horario de verano) para los casos de la base. Devuelve { hoy: 'AAAA-MM-DD', hora: 'HH:MM', min } (min = minutos del día).
  SiriusFecha.relojEcuador = function (fecha) { var d = fecha || new Date(), p = null;
    try { var f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d), o = {}; f.forEach(function (x) { o[x.type] = x.value; }); p = { y: o.year, m: o.month, d: o.day, h: o.hour === '24' ? '00' : o.hour, mi: o.minute }; } catch (e) { p = null; }
    if (!p) { var u = new Date(d.getTime() - 5 * 3600000); p = { y: String(u.getUTCFullYear()), m: z(u.getUTCMonth() + 1), d: z(u.getUTCDate()), h: z(u.getUTCHours()), mi: z(u.getUTCMinutes()) }; }
    return { hoy: p.y + '-' + p.m + '-' + p.d, hora: p.h + ':' + p.mi, min: Number(p.h) * 60 + Number(p.mi) }; };
  // Hora mínima para agendar hoy: la actual redondeada a los 15 minutos siguientes. «HH:MM» → minutos y al revés.
  SiriusFecha.aMin = function (t) { var q = String(t || '').split(':').map(Number); return (q[0] || 0) * 60 + (q[1] || 0); };
  SiriusFecha.aHora = function (m) { m = Math.max(0, Math.min(23 * 60 + 59, m)); return z(Math.floor(m / 60)) + ':' + z(m % 60); };
  SiriusFecha.minimaHoy = function (r) { return SiriusFecha.aHora(Math.ceil(((r && r.min) || 0) / 15) * 15 + (((r && r.min) || 0) % 15 === 0 ? 15 : 0)); };
  // Propuesta de visita (DEC-230): hoy a la hora mínima si termina antes de las 18:00; si no, mañana a las 08:00. Duración por defecto: 45 minutos.
  SiriusFecha.propuestaVisita = function (r, dur) { dur = dur || 45; var ini = SiriusFecha.aMin(SiriusFecha.minimaHoy(r)), fecha = r.hoy;
    if (ini + dur > 18 * 60) { var t = new Date(r.hoy + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + 1); fecha = t.getUTCFullYear() + '-' + z(t.getUTCMonth() + 1) + '-' + z(t.getUTCDate()); ini = 8 * 60; }
    return { fecha: fecha, hIni: SiriusFecha.aHora(ini), hFin: SiriusFecha.aHora(ini + dur) }; };
  window.SiriusFecha = SiriusFecha;
})();
