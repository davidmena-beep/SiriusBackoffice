// Selector de escenas de SIRIUS (solo en el prototipo). Modal con búsqueda y la lista de escenas agrupadas por área.
// Datos: window.SIRIUS_ESCENAS (datos-escenas.js). Al elegir una, llama onPick(nombre); el Back-office la abre igual que con ?escena=<nombre>.
// Teclado: ↑ ↓ mueven la escena activa, Inicio y Fin van a la primera y la última, Enter la abre, Esc cierra. El foco queda en el campo de búsqueda.
(function () {
  // Etapa 8a-b: el selector usa siempre el registro completo. Si la pantalla no cargó datos-escenas.js, lo carga desde la misma carpeta que este archivo.
  function cargarRegistro(listo) { if (window.SIRIUS_ESCENAS) { listo(); return; } var ss = [].slice.call(document.scripts), me = ss.find(function (s) { return /sirius-escenas\.js(\?|$)/.test(s.src || ''); }), ya = ss.find(function (s) { return /datos-escenas\.js(\?|$)/.test(s.src || ''); });
    if (ya && !window.SIRIUS_ESCENAS && ya.dataset && ya.dataset.cargando) { ya.addEventListener('load', listo); return; } var el = document.createElement('script'); el.src = me ? me.src.replace(/sirius-escenas\.js(\?.*)?$/, 'datos-escenas.js') : 'datos-escenas.js'; el.dataset.cargando = '1'; el.onload = listo; document.head.appendChild(el); }
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  function SiriusEscenas(props) {
    var R = window.React, h = R.createElement;
    var ts = R.useState(0), setTick = ts[1]; R.useEffect(function () { if (props.open && !window.SIRIUS_ESCENAS) cargarRegistro(function () { setTick(function (x) { return x + 1; }); }); }, [props.open]);
    var D = window.SIRIUS_ESCENAS || { areas: [], escenas: [] };
    // Ninguna escena se descarta: un área que no está en la lista se agrega al final.
    var AREAS = (D.areas || []).concat((D.escenas || []).map(function (e) { return e.area; }).filter(function (a, i, arr) { return a && arr.indexOf(a) === i && (D.areas || []).indexOf(a) < 0; }));
    var qs = R.useState(''), q = qs[0], setQ = qs[1];
    var as = R.useState(null), act = as[0], setAct = as[1]; // null: la escena activa es la de nombre igual a lo escrito, o la primera
    var open = !!props.open, listRef = R.useRef(null), uid = R.useId ? R.useId() : 'esc';
    R.useEffect(function () { if (open) { setQ(''); setAct(null); } }, [open]);
    var words = norm(q).split(/\s+/).filter(Boolean), flat = [];
    var groups = AREAS.map(function (area) {
      var items = (D.escenas || []).filter(function (e) {
        if (e.area !== area) return false;
        var t = norm(e.id + ' ' + e.desc + ' ' + area);
        return words.every(function (w) { return t.indexOf(w) >= 0; });
      });
      items.forEach(function (e) { flat.push(e); });
      return { area: area, items: items };
    }).filter(function (g) { return g.items.length; });
    var exact = flat.findIndex(function (e) { return norm(e.id) === norm(q).trim(); });
    var ai = flat.length ? Math.min(act == null ? Math.max(exact, 0) : act, flat.length - 1) : -1, optId = function (id) { return 'esc-' + uid.replace(/:/g, '') + '-' + id; };
    R.useEffect(function () {
      if (!open || ai < 0) return;
      var el = document.getElementById(optId(flat[ai].id));
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }, [open, ai, q]);
    function pick(e) { if (e && props.onPick) props.onPick(e.id); }
    function onKey(ev) {
      var n = flat.length, k = ev.key;
      if (k === 'ArrowDown' && n) { ev.preventDefault(); setAct((ai + 1) % n); }
      else if (k === 'ArrowUp' && n) { ev.preventDefault(); setAct((ai - 1 + n) % n); }
      else if (k === 'Home' && n) { ev.preventDefault(); setAct(0); }
      else if (k === 'End' && n) { ev.preventDefault(); setAct(n - 1); }
      else if (k === 'Enter' && ai >= 0) { ev.preventDefault(); pick(flat[ai]); }
    }
    var count = flat.length === 1 ? '1 escena' : flat.length + ' escenas';
    var search = h('div', { style: { position: 'sticky', top: 0, zIndex: 1, background: 'var(--surface-page, #FFFFFF)', padding: '4px 0 12px' } },
      h('label', { style: { display: 'flex', alignItems: 'center', gap: 8, height: 'var(--input-outlined-height, 48px)', padding: '0 16px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF' } },
        h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style: { color: 'var(--text-muted)', flex: '0 0 auto' } }, h('circle', { cx: 11, cy: 11, r: 8 }), h('path', { d: 'm21 21-4.3-4.3' })),
        h('input', { type: 'search', role: 'combobox', 'aria-label': 'Buscar escena', 'aria-expanded': 'true', 'aria-controls': 'esc-list-' + uid.replace(/:/g, ''), 'aria-activedescendant': ai >= 0 ? optId(flat[ai].id) : undefined, 'aria-autocomplete': 'list', placeholder: 'Buscar por nombre, área o lo que muestra', value: q, autoComplete: 'off', spellCheck: false,
          onChange: function (e) { setQ(e.target.value); setAct(null); }, onKeyDown: onKey,
          style: { border: 'none', outline: 'none', flex: 1, minWidth: 0, fontFamily: 'var(--font-brand)', fontSize: 15, color: 'var(--text-strong)', background: 'transparent' } })),
      h('div', { role: 'status', 'aria-live': 'polite', style: { marginTop: 8, fontSize: 13, color: 'var(--text-muted)' } }, count + (q ? (flat.length === 1 ? ' encontrada' : ' encontradas') : ' en el registro') + ' · Solo en el prototipo'));
    var list = groups.length ? h('div', { ref: listRef, id: 'esc-list-' + uid.replace(/:/g, ''), role: 'listbox', 'aria-label': 'Escenas del prototipo', style: { display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 } },
      groups.map(function (g) {
        return h('div', { key: g.area, role: 'group', 'aria-label': g.area },
          h('p', { style: { margin: '4px 0 6px', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, g.area + ' · ' + g.items.length),
          g.items.map(function (e) {
            var on = flat[ai] && flat[ai].id === e.id, cur = props.current === e.id;
            return h('div', { key: e.id, id: optId(e.id), role: 'option', 'aria-selected': on, onClick: function () { pick(e); }, onMouseMove: function () { var i = flat.indexOf(e); if (i !== ai) setAct(i); },
              style: { display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: on ? 'var(--table-row-hover)' : 'transparent', outline: on ? '2px solid var(--color-brand)' : 'none', outlineOffset: -2 } },
              h('span', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                h('code', { style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap' } }, e.id),
                cur ? h('span', { style: { fontSize: 12, fontWeight: 700, color: 'var(--color-brand-dark, var(--color-brand))', whiteSpace: 'nowrap' } }, 'Escena actual') : null),
              h('span', { style: { fontSize: 13, lineHeight: 1.4, color: 'var(--text-muted)' } }, e.desc));
          }));
      })) : h('p', { role: 'status', style: { margin: '16px 0', fontSize: 15, color: 'var(--text-muted)' } }, 'Ninguna escena coincide con «' + q + '».');
    var NS = window.AseguradoraDelSurDesignSystem_4fbf29, onCloseBtn = function () { if (props.onClose) props.onClose(); };
    var footer = NS && NS.Button ? h(NS.Button, { variant: 'secondary', size: 'md', onClick: onCloseBtn }, 'Cerrar') : h('button', { type: 'button', onClick: onCloseBtn }, 'Cerrar');
    // Etapa 9: sirius-modal.js puede terminar de cargar después que este archivo; sin el modal no se dibuja nada (antes: React #130 intermitente).
    if (!window.SiriusModal) return null;
    return h(window.SiriusModal, { open: open, onClose: props.onClose, size: 'lg', align: 'left', title: 'Ir a una escena', description: 'Solo en el prototipo. Abre la pantalla igual que con ?escena=<nombre>, con su rol y sus datos.', footer: footer, bodyStyle: { paddingTop: 0 } }, search, list);
  }
  window.SiriusEscenas = SiriusEscenas;
})();
