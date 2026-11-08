// Modal compartido de SIRIUS. Sigue los tokens del Modal del sistema de diseño (radio, sombra, scrim, z-index),
// pero aplica el foco inicial una sola vez al abrir: el Modal del sistema lo repetía en cada render y sacaba el foco del campo al escribir.
// Anchos: sm 400 px · md 560 px · lg 720 px. Alto máximo: ventana − 48 px. Cabecera y pie fijos; el cuerpo tiene scroll propio.
(function () {
  var W = { sm: 400, md: 560, lg: 720 };
  var FOC = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var EDIT = 'input:not([disabled]):not([readonly]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea:not([disabled]):not([readonly]), select:not([disabled])';
  function SiriusModal(props) {
    var R = window.React, h = R.createElement, ref = R.useRef(null), body = R.useRef(null), foot = R.useRef(null), cb = R.useRef(props);
    cb.current = props;
    var uid = R.useId ? R.useId() : 'sm', tid = 'sm-t-' + uid, did = 'sm-d-' + uid, open = !!props.open;
    R.useEffect(function () {
      if (!open) return;
      var prev = document.activeElement, ov = document.body.style.overflow; document.body.style.overflow = 'hidden';
      var t = setTimeout(function () { var p = cb.current, n = ref.current; if (!n) return;
        var first = (p.initialFocusRef && p.initialFocusRef.current) || (body.current && body.current.querySelector(EDIT)) || (foot.current && (foot.current.querySelector('.ads-button--primary:not([disabled])') || Array.prototype.slice.call(foot.current.querySelectorAll('button:not([disabled])')).pop())) || n;
        first.focus(); }, 30);
      return function () { clearTimeout(t); document.body.style.overflow = ov; if (prev && prev.focus && document.contains(prev)) prev.focus(); };
    }, [open]);
    if (!open) return null;
    var size = W[props.size] ? props.size : 'md', align = props.align || 'center';
    function onKey(e) { var n = ref.current; if (!n || !n.contains(e.target)) return;
      if (e.key === 'Escape' && props.closeOnEsc !== false) { e.stopPropagation(); var f = cb.current.onClose; if (f) f(); return; }
      if (e.key === 'Tab') { var list = Array.prototype.slice.call(n.querySelectorAll(FOC)).filter(function (x) { return x.offsetParent !== null || x === document.activeElement; }); if (!list.length) { e.preventDefault(); return; }
        var a = list[0], z = list[list.length - 1]; if (e.shiftKey && (document.activeElement === a || document.activeElement === n)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } }
    var showClose = props.showClose !== false && props.onClose;
    var head = (props.title || props.description) ? h('div', { style: { flex: '0 0 auto', padding: '28px 32px 16px', paddingRight: showClose ? 64 : 32, textAlign: align } },
      props.title ? h('h2', { id: tid, style: { fontFamily: 'var(--font-brand)', fontWeight: 'var(--fw-bold)', fontSize: 24, lineHeight: 1.25, color: 'var(--text-strong)', margin: '0 0 4px', textWrap: 'balance', overflowWrap: 'anywhere' } }, props.title) : null,
      props.description ? h('p', { id: did, style: { fontSize: 15, lineHeight: 1.5, color: 'var(--text-body)', margin: 0, overflowWrap: 'anywhere' } }, props.description) : null) : null;
    var close = showClose ? h('button', { type: 'button', onClick: function () { var f = cb.current.onClose; if (f) f(); }, 'aria-label': 'Cerrar', style: { position: 'absolute', top: 20, right: 20, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--neutral-500, var(--text-muted))', borderRadius: 'var(--radius-xs)' } },
      h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M18 6 6 18 M6 6l12 12' }))) : null;
    var dialog = h('div', { ref: ref, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': props.title ? tid : undefined, 'aria-describedby': props.description ? did : undefined, tabIndex: -1, onKeyDown: onKey, onClick: function (e) { e.stopPropagation(); }, className: 'ads-modal__dialog ads-modal--' + size,
      style: Object.assign({ position: 'relative', width: W[size], maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: 'var(--surface-page, #FFFFFF)', borderRadius: 'var(--modal-radius)', boxShadow: 'var(--modal-shadow)', outline: 'none', fontFamily: 'var(--font-body, var(--font-brand))', animation: 'ads-scale-in var(--dur-action) var(--ease-standard)' }, props.style || {}) },
      close, head,
      h('div', { ref: body, className: 'sirius-modal__body', style: Object.assign({ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', overflowWrap: 'anywhere', padding: head ? '4px 32px 8px' : '28px 32px 8px', paddingRight: !head && showClose ? 64 : 32 }, props.bodyStyle || {}) }, props.children),
      props.footer ? h('div', { ref: foot, style: { flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-3, 12px)', padding: '16px 32px 24px', borderTop: '1px solid var(--border-subtle)' } }, props.footer) : null);
    return h('div', { className: 'ads-modal__scrim', onClick: function () { var p = cb.current; if (p.closeOnOverlay !== false && p.onClose) p.onClose(); },
      style: { position: 'fixed', inset: 0, zIndex: 'var(--z-modal)', background: 'var(--modal-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', boxSizing: 'border-box', animation: 'ads-fade-in var(--dur-action) var(--ease-standard)' } }, dialog);
  }
  window.SiriusModal = SiriusModal;
})();
