// SIRIUS · menú «⋯» de acciones de fila · UN solo componente para todas las tablas (etapa U-6).
// El menú NO vive dentro de la tabla: se dibuja en una capa flotante sobre la página (document.body, position:fixed,
// z-index 1400), así ni el desplazamiento de la tabla ni su overflow lo recortan. La posición sale del botón: abre hacia
// abajo; si no cabe, hacia arriba; si no cabe en ninguno, hacia donde haya más espacio y se desplaza por dentro.
// Teclado: se abre con el foco en la primera acción; ↑ ↓ Inicio Fin recorren; Esc y Tab cierran y devuelven el foco al botón;
// clic fuera, desplazamiento de la página y cambio de tamaño cierran sin mover el foco; elegir una acción cierra y la ejecuta.
//
// Uso sin React (DataTable):   var m = SiriusMenuFila.abrir({ boton, etiqueta, items, onElegir(id, item), onBloqueado(id, item), onCerrar(), icono })
// Uso con React (Usuarios…):   h(SiriusMenuFila.Boton, { etiqueta, items: () => [...] | [...], onElegir, abrirInicial, claseBoton, titulo })
// items: [{ id, label, peligro | danger, razon (si hay razón la acción no se ejecuta: queda aria-disabled y la razón se ve debajo), icono (trazo SVG) }]
// Cálculo puro de la posición: SiriusMenuFila.colocar(rectBoton, ancho, alto, anchoVentana, altoVentana) → { left, top, arriba, maxAlto }
(function () {
  if (window.SiriusMenuFila) return;
  var M = 8, GAP = 4, abierto = null, cssPuesto = false;

  function css() {
    if (cssPuesto) return; cssPuesto = true;
    var s = document.createElement('style'); s.setAttribute('data-sfm-css', '');
    s.textContent = '.sfm{position:fixed;z-index:1400;min-width:220px;max-width:min(340px,calc(100vw - 16px));box-sizing:border-box;display:flex;flex-direction:column;padding:6px;background:#fff;border:1px solid var(--border-subtle);border-radius:var(--radius-sm,8px);box-shadow:var(--shadow-md);overflow-y:auto;font-family:var(--font-brand)}' +
      '.sfm-i{display:flex;align-items:flex-start;gap:10px;min-height:38px;padding:9px 10px;border:0;border-radius:var(--radius-sm,8px);background:none;cursor:pointer;font:600 14px var(--font-brand);color:var(--text-strong);text-align:left}' +
      '.sfm-i+.sfm-i.peligro{border-top:1px solid var(--border-subtle);border-radius:0 0 var(--radius-sm,8px) var(--radius-sm,8px)}' +
      '.sfm-i:hover,.sfm-i:focus{background:var(--color-brand-wash,var(--cyan-100,#E0F4FB));outline:none}.sfm-i:focus-visible{outline:2px solid var(--color-brand);outline-offset:-2px}' +
      '.sfm-i.peligro{color:var(--color-danger)}.sfm-i.peligro:hover,.sfm-i.peligro:focus{background:var(--color-danger-bg,#FDECEC)}' +
      '.sfm-i[aria-disabled="true"]{color:var(--neutral-500,#6B7380);cursor:not-allowed}.sfm-i[aria-disabled="true"]:hover,.sfm-i[aria-disabled="true"]:focus{background:var(--neutral-100,#EEF0F3)}' +
      '.sfm-i svg{flex:none;margin-top:1px}.sfm-t{display:flex;flex-direction:column;gap:2px;min-width:0}.sfm-s{font-weight:400;font-size:13px;color:var(--text-muted,#5B6573);white-space:normal}' +
      '.sfm-b{width:36px;height:32px;border:0;border-radius:8px;background:none;cursor:pointer;font:700 18px var(--font-brand);color:var(--text-strong)}.sfm-b:hover{background:var(--neutral-100,#EEF0F3)}.sfm-b:focus-visible{outline:2px solid var(--color-brand);outline-offset:2px}';
    document.head.appendChild(s);
  }

  // Posición: pura, para poder comprobarla con cualquier tamaño de ventana.
  function colocar(r, ancho, alto, vw, vh) {
    var abajo = vh - r.bottom - GAP - M, arribaE = r.top - GAP - M, arriba, maxAlto = null, h = alto;
    if (alto <= abajo) arriba = false;
    else if (alto <= arribaE) arriba = true;
    else { arriba = arribaE > abajo; maxAlto = Math.max(80, arriba ? arribaE : abajo); h = Math.min(alto, maxAlto); }
    var left = Math.max(M, Math.min(r.right - ancho, vw - ancho - M));
    return { left: Math.round(left), top: Math.round(arriba ? r.top - GAP - h : r.bottom + GAP), arriba: arriba, maxAlto: maxAlto };
  }

  function cerrarTodo(foco) { if (abierto) abierto.cerrar(!!foco); }

  function abrir(o) {
    css(); cerrarTodo(false);
    var t0 = Date.now(), boton = o.boton, items = (o.items || []).slice(), host = document.createElement('div'), btns = [], cerrado = false;
    host.className = 'sfm'; host.setAttribute('role', 'menu'); host.setAttribute('data-sfm', ''); host.setAttribute('aria-label', o.etiqueta || 'Acciones');
    host.style.visibility = 'hidden'; host.style.left = '0px'; host.style.top = '0px';
    items.forEach(function (it) {
      var b = document.createElement('button'), peligro = it.peligro || it.danger;
      b.type = 'button'; b.setAttribute('role', 'menuitem'); b.tabIndex = -1; b.className = 'sfm-i' + (peligro ? ' peligro' : ''); b.setAttribute('data-sfm-accion', it.id);
      if (it.razon) { b.setAttribute('aria-disabled', 'true'); b.title = it.razon; }
      if (it.icono) { b.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + String(it.icono).replace(/"/g, '') + '"></path></svg>'; }
      var t = document.createElement('span'), l = document.createElement('span'); t.className = 'sfm-t'; l.textContent = it.label; t.appendChild(l);
      if (it.razon) { var s = document.createElement('span'); s.className = 'sfm-s'; s.textContent = it.razon; t.appendChild(s); }
      b.appendChild(t);
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (it.razon) { if (o.onBloqueado) { cerrar(false); o.onBloqueado(it.id, it); } return; }
        cerrar(false); if (o.onElegir) o.onElegir(it.id, it);
      });
      host.appendChild(b); btns.push(b);
    });
    document.body.appendChild(host);
    function poner() {
      if (cerrado || !boton || !boton.isConnected) return cerrar(false);
      host.style.maxHeight = ''; var r = boton.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight,
        p = colocar(r, host.offsetWidth, host.scrollHeight + 2, vw, vh);
      host.style.left = p.left + 'px'; host.style.top = p.top + 'px'; host.style.maxHeight = p.maxAlto ? p.maxAlto + 'px' : ''; host.setAttribute('data-sfm-abre', p.arriba ? 'arriba' : 'abajo');
      if (p.arriba && p.maxAlto == null) { host.style.top = Math.round(r.top - GAP - host.offsetHeight) + 'px'; }
    }
    function enfocar(i) { if (btns.length) btns[(i + btns.length) % btns.length].focus({ preventScroll: true }); }
    function tecla(e) {
      if (!host.contains(document.activeElement) && e.key !== 'Escape') { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); enfocar(e.key === 'ArrowDown' ? 0 : -1); } return; }
      var i = btns.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(true); }
      else if (e.key === 'Tab') { e.preventDefault(); cerrar(true); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); enfocar(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); enfocar(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); enfocar(0); }
      else if (e.key === 'End') { e.preventDefault(); enfocar(-1); }
    }
    function fuera(e) { var t = e.target; if (t && host.contains(t)) return; if (t && boton && boton.contains && boton.contains(t)) return; cerrar(false); }
    function mover(e) { if (e && e.target && host.contains(e.target)) return; if (e && e.type === 'scroll' && Date.now() - t0 < 200) return; /* el desplazamiento que acompaña al clic (scrollIntoView) llega un cuadro después */ cerrar(false); }
    function cerrar(foco) {
      if (cerrado) return; cerrado = true;
      document.removeEventListener('keydown', tecla, true); document.removeEventListener('mousedown', fuera, true); window.removeEventListener('scroll', mover, true); window.removeEventListener('resize', mover);
      if (host.parentNode) host.parentNode.removeChild(host); if (abierto && abierto.host === host) abierto = null;
      if (boton && boton.setAttribute) boton.setAttribute('aria-expanded', 'false');
      if (o.onCerrar) o.onCerrar();
      if (foco && boton && boton.isConnected) { setTimeout(function () { boton.focus({ preventScroll: true }); }, 0); }
    }
    document.addEventListener('keydown', tecla, true); document.addEventListener('mousedown', fuera, true); window.addEventListener('scroll', mover, true); window.addEventListener('resize', mover);
    if (boton && boton.setAttribute) boton.setAttribute('aria-expanded', 'true');
    poner(); host.style.visibility = 'visible';
    var pri = btns.filter(function (b) { return b.getAttribute('aria-disabled') !== 'true'; })[0] || btns[0]; if (pri) pri.focus({ preventScroll: true });
    abierto = { host: host, cerrar: cerrar, boton: boton };
    return { cerrar: cerrar, elemento: host };
  }

  // Botón «⋯» para React (Usuarios y otras listas con h()).
  function Boton(p) {
    var R = window.React, estado = R.useState(false), ab = estado[0], setAb = estado[1], ref = R.useRef(null), m = R.useRef(null);
    function abrirAhora() {
      var its = typeof p.items === 'function' ? p.items() : p.items;
      m.current = abrir({ boton: ref.current, etiqueta: p.etiqueta, items: its, onElegir: p.onElegir, onBloqueado: p.onBloqueado, onCerrar: function () { m.current = null; setAb(false); if (p.onCerrar) p.onCerrar(); } });
      setAb(true);
    }
    R.useEffect(function () { if (p.abrirInicial && !m.current) abrirAhora(); }, [p.abrirInicial]); // escenas: la lista pide abrir el menú de una fila
    R.useEffect(function () { return function () { if (m.current) m.current.cerrar(false); }; }, []);
    return R.createElement('button', { type: 'button', ref: ref, className: p.claseBoton || 'sfm-b', title: p.titulo, 'aria-label': p.etiqueta, 'aria-haspopup': 'menu', 'aria-expanded': ab ? 'true' : 'false', 'data-sfm-boton': '',
      onClick: function (e) { e.stopPropagation(); if (m.current) m.current.cerrar(false); else abrirAhora(); } }, p.texto || '⋯');
  }

  window.SiriusMenuFila = { abrir: abrir, cerrar: cerrarTodo, colocar: colocar, Boton: Boton, version: '1.0' };
})();
