// SIRIUS · Varios riesgos en el Resumen (v1.1 · etapa P-6f-0d · ajuste P-6f-0h · DEC-226 · 18/10/2026).
// Con varios riesgos, «Objeto a asegurar» muestra cada riesgo como una tarjeta propia (borde de 1 px, esquinas de 8 px, 12 px entre tarjetas)
// con una cabecera de resumen siempre visible (número, bien con su identificación, estado como en la bandeja, valor total y flecha) que abre y cierra
// el detalle con clic, Enter o Espacio (aria-expanded y aria-controls). Debajo, la tabla de valores con la fila «Total del caso».
// Con hasta 3 riesgos, todas abiertas; con 4 o más, todas cerradas. Con 2 o más, «Expandir todo» / «Contraer todo» (componente Todos, a la derecha del título; P-6f-0h). Lo abierto vive en el estado del Back-office.
// Componente: window.SiriusRiesgos.Tarjetas({ datos, abiertos, onToggle, onTodos, uid }).
//  · datos = { noun, items: [{ n, titulo, ident, estado, tone, totalTxt, fields: [{ label, value, ws, span }], valores: [{ label, amount, bold }] }],
//            tabla: { cols: [texto], rows: [[texto]], total: [texto] } }  (la primera columna es el riesgo; las demás, montos)
//  · abiertos = [bool] por riesgo.
(function () {
  if (window.SiriusRiesgos) return;
  const W = window, R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const ANGOSTO = 720;
  const useAngosto = () => { const [a, setA] = R().useState(() => (W.innerWidth || 1280) < ANGOSTO);
    R().useEffect(() => { const f = () => setA((W.innerWidth || 1280) < ANGOSTO); W.addEventListener('resize', f); return () => W.removeEventListener('resize', f); }, []); return a; };
  const chip = (estado, tone) => { const B = NS().Badge, sp = h('span', { style: { whiteSpace: 'nowrap' } }, estado); return B ? h(B, { tone: tone || 'neutral' }, sp) : sp; };
  const flecha = (abierta) => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true',
    style: { flex: '0 0 auto', color: 'var(--text-muted)', transition: 'transform .15s', transform: abierta ? 'rotate(180deg)' : 'none' } }, h('path', { d: 'M6 9l6 6 6-6' }));

  function Tarjeta(p) { const it = p.it, ab = !!p.abierta, ang = p.angosto, idB = p.uid + '-cuerpo-' + it.n, idT = p.uid + '-cab-' + it.n;
    const tecla = (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); p.onToggle(); } };
    const titulo = h('strong', { id: idT, style: { flex: '1 1 auto', minWidth: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', overflowWrap: 'anywhere' } },
      it.titulo, it.ident ? h(R().Fragment, null, ' · ', h('span', { style: { whiteSpace: 'nowrap' } }, it.ident)) : null);
    const lado = [h('span', { key: 'e', style: { flex: '0 0 auto' } }, chip(it.estado, it.tone)),
      h('span', { key: 'v', 'data-riesgo-total': '', style: { flex: '0 0 auto', marginLeft: ang ? 'auto' : 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, it.totalTxt)];
    const num = h('span', { 'aria-hidden': 'true', style: { flex: '0 0 auto', width: 26, height: 26, borderRadius: 999, background: 'var(--text-strong)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 } }, String(it.n));
    const cab = h('div', { role: 'button', tabIndex: 0, 'aria-expanded': ab ? 'true' : 'false', 'aria-controls': idB, 'aria-label': (p.nombre || 'Riesgo') + ' ' + it.n + ': ' + it.titulo + (it.ident ? ' · ' + it.ident : '') + ' · ' + it.estado + ' · ' + it.totalTxt,
      'data-riesgo-cab': String(it.n), onClick: p.onToggle, onKeyDown: tecla,
      style: { display: 'flex', flexWrap: ang ? 'wrap' : 'nowrap', alignItems: 'center', gap: ang ? '8px 12px' : 12, padding: '12px 16px', background: 'var(--surface-subtle)', cursor: 'pointer', outlineOffset: -2, borderBottom: ab ? '1px solid var(--border-default)' : 'none' } },
      ang ? [h('div', { key: 'l1', style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', minWidth: 0 } }, num, titulo, flecha(ab)), h('div', { key: 'l2', style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', paddingLeft: 38, boxSizing: 'border-box' } }, lado)]
        : [h(R().Fragment, { key: 'a' }, num, titulo), lado, h(R().Fragment, { key: 'f' }, flecha(ab))]);
    const cuerpo = h('div', { id: idB, role: 'region', 'aria-labelledby': idT, hidden: !ab, style: { padding: 16, display: ab ? 'flex' : 'none', flexDirection: 'column', gap: 14 } },
      h('dl', { style: { margin: 0, display: 'grid', gridTemplateColumns: ang ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: '12px 24px' } },
        it.fields.map((f, i) => h('div', { key: i, style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, gridColumn: f.span || 'auto' } },
          h('dt', { style: { fontSize: 13, color: 'var(--text-muted)' } }, f.label), h('dd', { style: { margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', whiteSpace: f.ws || 'normal', overflowWrap: 'break-word' } }, f.value)))),
      it.valores.length ? h('div', { 'data-riesgo-valores': '', style: { display: 'flex', flexDirection: 'column' } }, it.valores.map((v, i) => h('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '8px 0', borderTop: '1px solid ' + (v.bold ? 'var(--border-default)' : 'var(--border-subtle)') } },
        h('span', { style: { fontSize: 14, fontWeight: v.bold ? 700 : 400, color: v.bold ? 'var(--text-strong)' : 'var(--text-muted)' } }, v.label),
        h('span', { style: { fontSize: 14, fontWeight: v.bold ? 700 : 400, color: 'var(--text-strong)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, v.amount)))) : null);
    return h('article', { 'data-riesgo': String(it.n), style: { border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden', background: '#FFFFFF' } }, cab, cuerpo); }

  // Tabla de valores. En anchos menores a 720 px y con más de dos columnas, quedan «Vehículo | Total» y los demás montos van debajo del nombre.
  function Tabla(p) { const t = p.tabla, ang = p.angosto, pad = ang ? '8px 6px' : '9px 12px', compacta = ang && t.cols.length > 2, veh = t.cols.length > 2;
    const cols = compacta ? [t.cols[0], t.cols[t.cols.length - 1]] : t.cols;
    const sub = (r) => t.cols.slice(1, -1).map((c, i) => [c, r[i + 1]]).filter(x => x[1] && x[1] !== '—').map(x => x[0] + ' ' + x[1]);
    const fila = (r) => compacta ? [[r[0], sub(r)], r[r.length - 1]] : r;
    const th = (c, i) => h('th', { key: i, scope: 'col', style: { textAlign: i > 0 ? 'right' : 'left', padding: pad, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' } }, c);
    const td = (c, i, tot) => { const nom = Array.isArray(c) ? c[0] : c, s2 = Array.isArray(c) ? c[1] : '';
      return h(i === 0 ? 'th' : 'td', Object.assign({ key: i, style: { textAlign: i > 0 ? 'right' : 'left', verticalAlign: 'top', padding: pad, fontSize: tot ? 15 : 14, fontWeight: tot ? 700 : (i === 0 ? 600 : 400), color: 'var(--text-strong)', whiteSpace: i > 0 || (veh && !tot) ? 'nowrap' : 'normal', overflowWrap: 'break-word', fontVariantNumeric: 'tabular-nums' } }, i === 0 ? { scope: 'row' } : {}),
        nom, s2 && s2.length ? h('span', { style: { display: 'block', marginTop: 2, fontSize: 12.5, fontWeight: 400, color: 'var(--text-muted)', whiteSpace: 'normal' } }, s2.map((x, k) => h(R().Fragment, { key: k }, k ? ' · ' : null, h('span', { style: { whiteSpace: 'nowrap' } }, x)))) : null); };
    return h('div', { 'data-riesgos-tabla': '', style: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 } },
      h('h3', { style: { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, 'Valores'),
      h('div', { style: { overflowX: 'auto' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        h('thead', null, h('tr', null, cols.map(th))),
        h('tbody', null, t.rows.map((r, j) => h('tr', { key: j, style: { borderBottom: '1px solid var(--border-subtle)' } }, fila(r).map((c, i) => td(c, i, false))))),
        h('tfoot', null, h('tr', { 'data-total-caso': '', style: { borderTop: '2px solid var(--border-strong)' } }, fila(t.total).map((c, i) => td(c, i, true)))))));
  }

  // Botón de texto a la derecha del título «Objeto a asegurar · N …» (lo pinta el Back-office en la fila del título): con 2 riesgos o más.
  // «Expandir todo» si alguna tarjeta está cerrada; «Contraer todo» si todas están abiertas. Componente: window.SiriusRiesgos.Todos({ abiertos, uid, onTodos }).
  function Todos(p) { const ab = p.abiertos || [], n = ab.length, todas = n > 0 && ab.every(Boolean), uid = 'rz-' + String(p.uid || 'caso').replace(/[^\w-]/g, '');
    if (n < 2) return null;
    return h('button', { type: 'button', 'data-riesgos-todos': '', 'aria-expanded': todas ? 'true' : 'false', 'aria-controls': ab.map((x, i) => uid + '-cuerpo-' + (i + 1)).join(' '), onClick: () => p.onTodos && p.onTodos(!todas),
      style: { border: 'none', background: 'transparent', padding: '4px 0', cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-link)', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' } }, todas ? 'Contraer todo' : 'Expandir todo'); }

  function Tarjetas(p) { const d = p.datos || { items: [] }, ab = p.abiertos || [], ang = useAngosto(), uid = 'rz-' + String(p.uid || 'caso').replace(/[^\w-]/g, '');
    return h('div', { 'data-riesgos': String(d.items.length), style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      d.items.map((it, i) => h(Tarjeta, { key: i, it, abierta: !!ab[i], angosto: ang, uid, nombre: d.nombre, onToggle: () => p.onToggle && p.onToggle(i) })),
      d.tabla ? h(Tabla, { tabla: d.tabla, angosto: ang }) : null); }

  window.SiriusRiesgos = { Tarjetas, Todos, ANGOSTO };
})();
