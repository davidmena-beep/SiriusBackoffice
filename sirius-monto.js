// SIRIUS · Entrada de dinero única (etapa 11-c · DEC-139). Todo campo de monto del sistema (tarifarios, ajustes, honorarios, facturas,
// valores asegurados, campos personalizados de tipo moneda) usa este componente: acepta coma o punto decimal (SIRIUS_COMPANIA.leerMonto),
// avisa «Usa hasta N decimales» si se excede y, al salir del campo, muestra el monto con SIRIUS_COMPANIA.formatoMonto.
// Props: value (número o null) · onChange(número|null, error) · id · ariaLabel · placeholder · disabled · invalid · permitirNegativo ·
// ancho · alto (px, 40 por defecto) · formatear (n → texto; para porcentajes u otras cifras que no son dinero) · ariaDescribedby · decimales (opcional, por defecto los de la moneda) · onBlur · describedBy. Un error vacío ('') significa que el texto es válido.
(function () {
  var C = function () { return window.SIRIUS_COMPANIA; };
  function decimalesUsados(t) { var s = String(t == null ? '' : t).trim().replace(/[^\d.,-]/g, ''), d = Math.max(s.lastIndexOf(','), s.lastIndexOf('.')); return d < 0 ? 0 : s.length - d - 1; }
  // Evalúa un texto: { n, err }. err: '' | «Usa hasta N decimales» | «Escribe un monto válido»
  function evaluar(t, dec, neg) { var c = C(), txt = String(t == null ? '' : t); if (!txt.trim()) return { n: null, err: '' };
    var n = c.leerMonto(txt); if (n == null) return { n: null, err: 'Escribe un monto válido' };
    if (n < 0 && !neg) return { n: n, err: 'El monto no puede ser negativo' };
    if (decimalesUsados(txt) > dec) return { n: n, err: 'Usa hasta ' + dec + ' decimales' };
    return { n: n, err: '' }; }
  function plano(n) { var c = C(); return n == null ? '' : String(n).replace('.', c.moneda.separadorDecimal); }
  function SiriusMonto(props) {
    var R = window.React, h = R.createElement, c = C(), dec = props.decimales != null ? props.decimales : c.moneda.decimales, neg = !!props.permitirNegativo;
    var st = R.useState(null), foco = st[0], setFoco = st[1];           // texto mientras se escribe (null = no está editando)
    var eS = R.useState(''), errTxt = eS[0], setErr = eS[1];
    var shown = foco != null ? foco : (props.value == null ? '' : (errTxt ? plano(props.value) : (props.formatear || c.formatoMonto)(props.value)));
    var uid = R.useId ? R.useId() : 'mt', mid = (props.id || 'mt-' + uid) + '-aviso';
    var err = foco != null || errTxt ? errTxt : '';
    var inv = !!props.invalid || !!err;
    function cambio(e) { var t = e.target.value, r = evaluar(t, dec, neg); setFoco(t); setErr(r.err); if (props.onChange) props.onChange(r.n, r.err, t); }
    function alEntrar(e) { setFoco(errTxt && foco != null ? foco : plano(props.value)); var el = e.target; setTimeout(function () { try { el.select(); } catch (x) {} }, 0); }
    function alSalir(e) { var t = foco != null ? foco : plano(props.value), r = evaluar(t, dec, neg); setErr(r.err);
      if (!r.err) { setFoco(null); if (r.n !== props.value && props.onChange) props.onChange(r.n, '', t); } // texto válido: se muestra con formatoMonto
      if (props.onBlur) props.onBlur(e, r); }
    var input = h('input', { id: props.id, type: 'text', inputMode: 'decimal', autoComplete: 'off', value: shown, placeholder: props.placeholder || (props.formatear ? '' : c.formatoMonto(0, { decimales: dec })), disabled: !!props.disabled, 'aria-label': props.ariaLabel || undefined, 'aria-invalid': inv ? 'true' : 'false', 'aria-describedby': [err ? mid : '', props.ariaDescribedby || props.describedBy || ''].filter(Boolean).join(' ') || undefined,
      onChange: cambio, onFocus: alEntrar, onBlur: alSalir, 'data-sirius-monto': '1',
      style: Object.assign({ height: props.alto || 40, width: '100%', boxSizing: 'border-box', padding: '0 10px', border: '1.5px solid ' + (inv ? 'var(--color-danger)' : 'var(--input-outlined-border)'), borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 15, textAlign: 'right', fontVariantNumeric: 'tabular-nums', background: props.disabled ? 'var(--surface-muted, #F3F4F6)' : '#FFFFFF', color: 'var(--text-strong)' }, props.style || {}) });
    return h('span', { style: { display: 'inline-flex', flexDirection: 'column', gap: 4, maxWidth: '100%', width: props.ancho || '100%', minWidth: 0, verticalAlign: 'top' } }, input,
      err ? h('span', { id: mid, role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)', lineHeight: 1.3 } }, err) : null);
  }
  SiriusMonto.evaluar = evaluar; SiriusMonto.decimalesUsados = decimalesUsados;
  window.SiriusMonto = SiriusMonto;
})();
