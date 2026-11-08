// SIRIUS · control que no aplica y tiene motivo (regla "Controles accesibles", punto 2).
// Uso: data-motivo="Motivo" en un botón o control. Queda enfocable, no ejecuta la acción, se anuncia con aria-disabled="true"
// y muestra el motivo en un tooltip (role="tooltip") al recibir foco y al pasar el mouse. Esc lo oculta.
// data-solo-lectura="Motivo": mismo tooltip y aria-describedby; el control conserva su estado de solo lectura (sin aria-disabled).
(function () {
  if (window.__SIRIUS_MOTIVO__) return; window.__SIRIUS_MOTIVO__ = true;
  var tip, cur = null, seq = 0;
  function mk() {
    if (tip) return tip;
    tip = document.createElement('div'); tip.id = 'sirius-motivo-tip'; tip.setAttribute('role', 'tooltip');
    tip.style.cssText = 'position:fixed;z-index:2147483000;visibility:hidden;pointer-events:none;max-width:280px;width:max-content;padding:8px 12px;border-radius:8px;background:#011E41;color:#fff;font:400 13px/1.4 var(--font-body,Mulish,sans-serif);box-shadow:0 12px 20px rgba(1,30,65,.2);text-wrap:pretty;white-space:normal';
    document.body.appendChild(tip); return tip;
  }
  function find(t) { return t && t.closest ? t.closest('[data-motivo],[data-solo-lectura]') : null; }
  function txt(el) { return (el.getAttribute('data-motivo') || el.getAttribute('data-solo-lectura') || '').trim(); }
  function show(el) {
    var r = txt(el); if (!r) return; var t = mk(); cur = el; t.textContent = el.hasAttribute('data-solo-lectura') && !el.hasAttribute('data-motivo') ? r : r;
    t.style.visibility = 'hidden'; t.style.left = '0px'; t.style.top = '0px';
    var b = el.getBoundingClientRect(), w = t.offsetWidth, h = t.offsetHeight;
    var x = Math.max(8, Math.min(window.innerWidth - w - 8, b.left + b.width / 2 - w / 2));
    var y = b.top - h - 8; if (y < 8) y = b.bottom + 8;
    t.style.left = x + 'px'; t.style.top = y + 'px'; t.style.visibility = 'visible';
    if (!el.__desc) el.__desc = el.getAttribute('aria-describedby') || '';
    el.setAttribute('aria-describedby', (el.__desc ? el.__desc + ' ' : '') + 'sirius-motivo-tip');
  }
  function hide(el) {
    if (tip) tip.style.visibility = 'hidden';
    if (el && el.__desc !== undefined) { if (el.__desc) el.setAttribute('aria-describedby', el.__desc); else el.removeAttribute('aria-describedby'); delete el.__desc; }
    cur = null;
  }
  function sync(root) {
    (root.querySelectorAll ? root.querySelectorAll('[data-motivo],[data-solo-lectura]') : []).forEach(function (el) {
      var on = !!txt(el);
      if (el.hasAttribute('data-motivo')) { if (on) { if (el.getAttribute('aria-disabled') !== 'true') el.setAttribute('aria-disabled', 'true'); } else if (el.getAttribute('aria-disabled') === 'true') el.removeAttribute('aria-disabled'); }
      if (on && !el.hasAttribute('tabindex') && !/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '0');
    });
  }
  function block(e) {
    var el = find(e.target); if (!el || !el.hasAttribute('data-motivo') || !txt(el)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
  }
  document.addEventListener('click', block, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cur) { hide(cur); return; }
    if ((e.key === 'Enter' || e.key === ' ') ) { var el = find(e.target); if (el && el.hasAttribute('data-motivo') && txt(el) && el.tagName !== 'BUTTON') { e.preventDefault(); e.stopPropagation(); } }
  }, true);
  document.addEventListener('mouseover', function (e) { var el = find(e.target); if (el && el !== cur) { if (cur) hide(cur); show(el); } }, true);
  document.addEventListener('mouseout', function (e) { var el = find(e.target); if (el && el === cur && !el.contains(e.relatedTarget) && document.activeElement !== el) hide(el); }, true);
  document.addEventListener('focusin', function (e) { var el = find(e.target); if (el) { if (cur && cur !== el) hide(cur); show(el); } }, true);
  document.addEventListener('focusout', function (e) { var el = find(e.target); if (el && el === cur) hide(el); }, true);
  function init() { sync(document); new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.type === 'attributes') { var n = m.target; if (n.hasAttribute && (n.hasAttribute('data-motivo') || n.hasAttribute('data-solo-lectura'))) sync(n.parentNode || document); } else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('[data-motivo],[data-solo-lectura]')) sync(n.parentNode); sync(n); } }); }); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-motivo', 'data-solo-lectura'] }); }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
