// SIRIUS · Editor de campos tipo Grilla del constructor de formularios (etapa 8a-b). Vale para todas las plantillas (Vehículos,
// Equipo y maquinaria y los módulos de Ramos Generales).
// Columnas: etiqueta, clave (prefijo de la plantilla; no cambia después de crear), tipo, obligatoria, opciones o catálogo,
// validaciones según el tipo y valor por defecto. Filas libres (mínimo y máximo) o fijas (lista editable). Vista previa con una fila de ejemplo.
// Las grillas que ya existen guardan sus columnas como textos: SiriusGrilla.tipar las muestra con su tipo real sin cambiar esos datos;
// solo al editar se guarda la versión tipada en el campo (colsT y filas) junto con las etiquetas de siempre (cols y rows).
// Props: campo { key, label, cols, rows, colsT, filas } · prefijo · ro · roWhy · onChange(patch)
(function () {
  if (window.SiriusGrillaEditor) return;
  var TIPOS = ['Texto', 'Número', 'Moneda', 'Fecha', 'Sí/No', 'Lista propia', 'Catálogo maestro', 'Foto'];
  var CATS = [['piezas', 'Piezas'], ['danos', 'Tipos de daño'], ['gravedad', 'Gravedad de avería'], ['extras', 'Extras'], ['coberturas', 'Coberturas'], ['verif', 'Resultados de verificación externa'], ['sucursales', 'Sucursales'], ['eqtipos', 'Tipos de equipo'], ['eqmarcas', 'Marcas de equipo']];
  var FMT_TEXTO = ['Ninguno', 'Mayúsculas', 'Placa', 'Número de serie (PIN)', 'Medida de neumático (205/55 R16)', 'Correo'];
  var FMT_FECHA = ['Fecha', 'Fecha y hora'];
  function slug(s) { return String(s || '').toLowerCase().replace(/ñ/g, 'ni').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 28).replace(/_+$/, '') || 'columna'; }
  function catVals(id) { var E = window.SIRIUS_EJEMPLO || {}, K = E.catalogos || {}, Q = window.SIRIUS_EQUIPOS || {};
    var m = { piezas: K.piezas, danos: K.danos, gravedad: K.gravedad, extras: K.extras, coberturas: K.coberturas, verif: K.verificacion, sucursales: K.sucursales,
      eqtipos: [].concat.apply([], (Q.categorias || []).map(function (c) { return c.tipos; })), eqmarcas: (Q.marcasModelos || []).map(function (x) { return x.marca; }) };
    return (m[id] || []).slice(); }
  function catNombre(id) { var c = CATS.find(function (x) { return x[0] === id; }); return c ? c[1] : ''; }
  var C0 = function (o) { return Object.assign({ l: '', k: '', t: 'Texto', req: false, opts: [], cat: '', min: '', max: '', dec: '', fmt: '', lmax: '', def: '', fila: false }, o || {}); };
  // Tipos reales de las grillas existentes (las columnas se guardan como texto en la plantilla).
  var CONOCIDAS = {
    veh_neumaticos: { 'Posición': { fila: true }, 'Marca': {}, 'Medida': { fmt: 'Medida de neumático (205/55 R16)' }, 'Labrado (mm)': { t: 'Número', min: '0', max: '20', dec: '1', req: true }, 'Foto': { t: 'Foto' } },
    veh_extras: { 'Descripción': { t: 'Catálogo maestro', cat: 'extras', req: true }, 'Marca': {}, 'Valor (USD)': { t: 'Moneda', min: '0', req: true }, 'Foto': { t: 'Foto' } },
    veh_averias: { 'Pieza': { t: 'Catálogo maestro', cat: 'piezas', req: true }, 'Tipo de daño': { t: 'Catálogo maestro', cat: 'danos', req: true }, 'Gravedad': { t: 'Catálogo maestro', cat: 'gravedad', req: true }, 'Superficie (dm²)': { t: 'Número', min: '0', dec: '1' }, 'Origen': { t: 'Lista propia', opts: ['Extracción automática', 'Inspector'] }, 'Foto': { t: 'Foto' } },
    veh_verificaciones_externas: { 'Consulta': { fila: true }, 'Resultado': { t: 'Catálogo maestro', cat: 'verif', req: true }, 'Fecha y hora': { t: 'Fecha', fmt: 'Fecha y hora' }, 'Forma': { t: 'Lista propia', opts: ['Consulta automática', 'Manual · captura adjunta'] }, 'Observación': {} },
    em_componentes: { 'Componente': { fila: true }, 'Estado': { t: 'Lista propia', opts: ['Bueno', 'Regular', 'Malo', 'No aplica'], req: true }, 'Observación': {}, 'Foto': { t: 'Foto' } },
    em_averias: { 'Pieza': { req: true }, 'Tipo de daño': { t: 'Catálogo maestro', cat: 'danos', req: true }, 'Gravedad': { t: 'Catálogo maestro', cat: 'gravedad', req: true }, 'Foto': { t: 'Foto' } },
    em_implementos: { 'Descripción': { req: true }, 'Marca': { t: 'Catálogo maestro', cat: 'eqmarcas' }, 'Serie': {}, 'Valor': { t: 'Moneda', min: '0' } } };
  // Para las demás (Ramos Generales): el tipo sale de la etiqueta; una lista entre paréntesis son sus opciones.
  function inferir(l) { var s = String(l || ''), m = /\((?:selección múltiple:\s*)?([^)]*,[^)]*)\)\s*$/i.exec(s);
    if (/^foto/i.test(s)) return { t: 'Foto' };
    if (m) return { t: 'Lista propia', opts: m[1].split(',').map(function (x) { return x.trim(); }).filter(Boolean), multiple: /selección múltiple/i.test(s) };
    if (/valor|usd|monto|precio|suma asegurada/i.test(s)) return { t: 'Moneda', min: '0' };
    if (/fecha|vigencia/i.test(s)) return { t: 'Fecha' };
    if (/^¿.*\?$/.test(s)) return { t: 'Sí/No' };
    if (/^(año|cantidad|potencia|n\.º|número de|área \(|capacidad|altura|edad)|\((mm|kg|m²|m2|kw|kva|hp|t|años?)\)/i.test(s)) return { t: 'Número', min: '0' };
    return {}; }
  var SG = {};
  SG.TIPOS = TIPOS; SG.CATS = CATS; SG.slug = slug; SG.catVals = catVals;
  // Modelo tipado de un campo Grilla (sin modificar el campo).
  SG.tipar = function (campo, prefijo) { var key = campo.key || campo.k || '', known = CONOCIDAS[key] || {}, pre = prefijo || '';
    var cols = (campo.colsT && campo.colsT.length) ? campo.colsT.map(function (c) { return C0(JSON.parse(JSON.stringify(c))); }) : (campo.cols || []).filter(function (l) { return String(l).trim(); }).map(function (l) { var x = known[l] || inferir(l); return C0(Object.assign({}, x, { l: l, k: pre + slug(l), opts: (x.opts || []).slice() })); });
    var rows = campo.rows || [], filas = campo.filas ? JSON.parse(JSON.stringify(campo.filas)) : rows.length ? { modo: 'fijas', lista: rows.slice(), min: '', max: '' } : { modo: 'libres', lista: [], min: '0', max: '' };
    return { cols: cols, filas: filas }; };
  SG.patch = function (m) { return { colsT: m.cols, cols: m.cols.map(function (c) { return c.l; }), filas: m.filas, rows: m.filas.modo === 'fijas' ? m.filas.lista.slice() : [] }; };
  SG.claveUnica = function (cols, base) { var k = base, n = 2; while (cols.some(function (c) { return c.k === k; })) k = base + '_' + (n++); return k; };
  SG.ejemplo = function (c) { if (c.def !== '' && c.def != null) return String(c.def); var t = c.t;
    if (t === 'Número') return c.min !== '' ? String(c.min) : '0'; if (t === 'Moneda') return null; if (t === 'Fecha') return c.fmt === 'Fecha y hora' ? '14/10/2026 09:40' : '14/10/2026';
    if (t === 'Sí/No') return 'Sí'; if (t === 'Lista propia') return (c.opts || [])[0] || ''; if (t === 'Catálogo maestro') return catVals(c.cat)[0] || ''; return ''; };
  window.SiriusGrilla = SG;

  function SiriusGrillaEditor(props) {
    var R = window.React, h = R.createElement, NS = window.AseguradoraDelSurDesignSystem_4fbf29 || {}, ro = !!props.ro, why = props.roWhy || 'Solo lectura';
    var campo = props.campo || {}, pre = props.prefijo || '', M = SG.tipar(campo, pre);
    var ds = R.useState({}), drafts = ds[0], setDrafts = ds[1], dg = R.useState(null), drag = dg[0], setDrag = dg[1];
    var nl = R.useState(''), nuevo = nl[0], setNuevo = nl[1], nt = R.useState('Texto'), nuevoT = nt[0], setNuevoT = nt[1], nf = R.useState(''), nuevaFila = nf[0], setNuevaFila = nf[1];
    var uid = 'gr-' + String(campo.key || campo.k || 'x').replace(/\W+/g, '');
    var emit = function (fn) { if (ro) return; var m = SG.tipar(campo, pre); fn(m); if (props.onChange) props.onChange(SG.patch(m)); };
    var setCol = function (i, p) { emit(function (m) { Object.assign(m.cols[i], p); }); };
    var mover = function (i, d) { emit(function (m) { var j = i + d; if (j < 0 || j >= m.cols.length) return; var t = m.cols[i]; m.cols[i] = m.cols[j]; m.cols[j] = t; }); };
    var moverA = function (i, j) { emit(function (m) { if (i === j) return; var c = m.cols.splice(i, 1)[0]; m.cols.splice(j, 0, c); }); };
    var quitar = function (i) { emit(function (m) { m.cols.splice(i, 1); }); };
    var agregar = function () { var l = nuevo.trim(); if (!l) return; emit(function (m) { m.cols.push(C0({ l: l, k: SG.claveUnica(m.cols, pre + slug(l)), t: nuevoT, opts: nuevoT === 'Lista propia' ? ['Opción 1', 'Opción 2'] : [], cat: nuevoT === 'Catálogo maestro' ? 'piezas' : '' })); }); setNuevo(''); setNuevoT('Texto'); };
    var setFilas = function (p) { emit(function (m) { Object.assign(m.filas, p); }); };
    var filaOp = function (fn) { emit(function (m) { fn(m.filas.lista); }); };
    // ---- estilos
    var lbl = { fontSize: 12, fontWeight: 700, color: 'var(--text-strong)' }, inp = { width: '100%', height: 36, padding: '0 8px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: ro ? 'var(--surface-subtle)' : '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, color: 'var(--text-strong)', boxSizing: 'border-box' };
    var mini = function (label, aria, on, dis, disWhy, danger) { return h('button', { type: 'button', 'aria-label': aria, title: dis ? disWhy : aria, 'aria-disabled': dis ? 'true' : undefined, onClick: function () { if (!dis) on(); }, style: { height: 30, padding: '0 10px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', cursor: dis ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: dis ? 'var(--text-muted)' : danger ? 'var(--color-danger)' : 'var(--text-link)', opacity: dis ? 0.6 : 1 } }, label); };
    var campoTxt = function (id, label, val, on, extra) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 } }, h('label', { htmlFor: id, style: lbl }, label), h('input', Object.assign({ id: id, type: 'text', value: val == null ? '' : String(val), disabled: ro, onChange: function (e) { on(e.target.value); }, style: inp }, extra || {}))); };
    var campoSel = function (id, label, val, opts, on) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 } }, h('label', { htmlFor: id, style: lbl }, label), h('select', { id: id, value: val, disabled: ro, onChange: function (e) { on(e.target.value); }, style: inp }, opts.map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return h('option', { key: v, value: v }, l); }))); };
    var monto = function (id, label, val, on) { var SM = window.SiriusMonto; return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 } }, h('label', { htmlFor: id, style: lbl }, label), SM ? h(SM, { id: id, value: val === '' || val == null ? null : Number(val), onChange: function (n) { on(n == null ? '' : String(n)); }, disabled: ro, alto: 36 }) : h('input', { id: id, type: 'text', value: val, disabled: ro, onChange: function (e) { on(e.target.value); }, style: inp })); };
    // ---- columnas
    var cols = M.cols.map(function (c, i) { var id = uid + '-c' + i, d = drafts[i] || '';
      var valid = [];
      if (c.t === 'Texto') valid.push(campoSel(id + '-fmt', 'Formato', c.fmt || 'Ninguno', FMT_TEXTO, function (v) { setCol(i, { fmt: v === 'Ninguno' ? '' : v }); }), campoTxt(id + '-lmax', 'Largo máximo', c.lmax, function (v) { setCol(i, { lmax: v.replace(/\D/g, '') }); }, { inputMode: 'numeric' }));
      if (c.t === 'Número') valid.push(campoTxt(id + '-min', 'Mínimo', c.min, function (v) { setCol(i, { min: v }); }, { inputMode: 'decimal' }), campoTxt(id + '-max', 'Máximo', c.max, function (v) { setCol(i, { max: v }); }, { inputMode: 'decimal' }), campoTxt(id + '-dec', 'Decimales', c.dec, function (v) { setCol(i, { dec: v.replace(/\D/g, '') }); }, { inputMode: 'numeric' }));
      if (c.t === 'Moneda') valid.push(monto(id + '-min', 'Mínimo', c.min, function (v) { setCol(i, { min: v }); }), monto(id + '-max', 'Máximo', c.max, function (v) { setCol(i, { max: v }); }));
      if (c.t === 'Fecha') valid.push(campoSel(id + '-fmt', 'Formato', c.fmt || 'Fecha', FMT_FECHA, function (v) { setCol(i, { fmt: v }); }));
      if (c.t === 'Foto') valid.push(campoTxt(id + '-min', 'Fotos mínimas', c.min, function (v) { setCol(i, { min: v.replace(/\D/g, '') }); }, { inputMode: 'numeric' }));
      var defEl = c.t === 'Foto' || c.fila ? null : c.t === 'Moneda' ? monto(id + '-def', 'Valor por defecto', c.def, function (v) { setCol(i, { def: v }); }) :
        c.t === 'Sí/No' ? campoSel(id + '-def', 'Valor por defecto', c.def || '', [['', 'Sin valor'], 'Sí', 'No'], function (v) { setCol(i, { def: v }); }) :
        c.t === 'Lista propia' ? campoSel(id + '-def', 'Valor por defecto', c.def || '', [['', 'Sin valor']].concat(c.opts || []), function (v) { setCol(i, { def: v }); }) :
        c.t === 'Catálogo maestro' ? campoSel(id + '-def', 'Valor por defecto', c.def || '', [['', 'Sin valor']].concat(catVals(c.cat)), function (v) { setCol(i, { def: v }); }) :
        campoTxt(id + '-def', 'Valor por defecto', c.def, function (v) { setCol(i, { def: v }); }, { placeholder: c.t === 'Fecha' ? 'DD/MM/AAAA' : '' });
      var opciones = c.t === 'Lista propia' ? h('div', { role: 'group', 'aria-label': 'Opciones de ' + (c.l || 'la columna'), style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        h('span', { style: lbl }, 'Opciones de la lista'),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, (c.opts || []).map(function (o, oi) { return h('span', { key: oi, style: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 4px 2px 10px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', fontSize: 13, color: 'var(--text-strong)' } }, o,
          h('button', { type: 'button', 'aria-label': 'Quitar la opción ' + o, title: ro ? why : 'Quitar la opción ' + o, 'aria-disabled': ro ? 'true' : undefined, onClick: function () { if (!ro) setCol(i, { opts: c.opts.filter(function (_, j) { return j !== oi; }) }); }, style: { width: 24, height: 24, border: 'none', borderRadius: '50%', background: 'transparent', cursor: ro ? 'not-allowed' : 'pointer', color: 'var(--text-muted)', fontSize: 15 } }, '×')); })),
        h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'text', 'aria-label': 'Nueva opción de ' + (c.l || 'la columna'), placeholder: 'Nueva opción', value: d, disabled: ro, onChange: function (e) { var v = e.target.value; setDrafts(function (x) { var y = Object.assign({}, x); y[i] = v; return y; }); }, onKeyDown: function (e) { if (e.key === 'Enter' && d.trim()) { e.preventDefault(); setCol(i, { opts: (c.opts || []).concat(d.trim()) }); setDrafts(function (x) { var y = Object.assign({}, x); y[i] = ''; return y; }); } }, style: Object.assign({}, inp, { flex: 1 }) }),
          mini('Agregar', 'Agregar la opción a ' + (c.l || 'la columna'), function () { if (!d.trim()) return; setCol(i, { opts: (c.opts || []).concat(d.trim()) }); setDrafts(function (x) { var y = Object.assign({}, x); y[i] = ''; return y; }); }, ro || !d.trim(), ro ? why : 'Escribe la opción'))) : null;
      var catalogo = c.t === 'Catálogo maestro' ? campoSel(id + '-cat', 'Catálogo maestro', c.cat || 'piezas', CATS, function (v) { setCol(i, { cat: v, def: '' }); }) : null;
      return h('li', { key: c.k + i, draggable: !ro, onDragStart: function (e) { setDrag(i); try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); } catch (er) {} }, onDragOver: function (e) { if (drag != null) e.preventDefault(); }, onDrop: function (e) { e.preventDefault(); if (drag != null) moverA(drag, i); setDrag(null); }, onDragEnd: function () { setDrag(null); },
        style: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 12, border: '1px solid ' + (drag === i ? 'var(--color-brand)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-sm)', background: '#FFFFFF' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          h('span', { 'aria-hidden': 'true', title: ro ? '' : 'Arrastra para reordenar', style: { cursor: ro ? 'default' : 'grab', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1 } }, '⋮⋮'),
          h('strong', { style: { fontSize: 14, color: 'var(--text-strong)' } }, (i + 1) + '. ' + (c.l || 'Sin etiqueta')),
          h('code', { title: 'La clave no cambia después de crear la columna', style: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'ui-monospace, Menlo, Consolas, monospace' } }, c.k),
          c.fila ? h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, '· Nombre de la fila') : null,
          h('span', { style: { flex: 1 } }),
          mini('Subir', 'Subir la columna ' + c.l, function () { mover(i, -1); }, ro || i === 0, ro ? why : 'Ya es la primera'),
          mini('Bajar', 'Bajar la columna ' + c.l, function () { mover(i, 1); }, ro || i === M.cols.length - 1, ro ? why : 'Ya es la última'),
          mini('Quitar', 'Quitar la columna ' + c.l, function () { quitar(i); }, ro || M.cols.length <= 1, ro ? why : 'La grilla necesita al menos una columna', true)),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 } },
          campoTxt(id + '-l', 'Etiqueta', c.l, function (v) { setCol(i, { l: v }); }),
          c.fila ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('span', { style: lbl }, 'Tipo'), h('span', { style: { fontSize: 14, color: 'var(--text-body)', paddingTop: 8 } }, 'Texto · toma el nombre de la fila fija')) : campoSel(id + '-t', 'Tipo', c.t, TIPOS, function (v) { setCol(i, { t: v, opts: v === 'Lista propia' && !(c.opts || []).length ? ['Opción 1', 'Opción 2'] : c.opts, cat: v === 'Catálogo maestro' && !c.cat ? 'piezas' : c.cat, def: '', min: '', max: '', dec: '', fmt: '' }); })),
        c.fila ? null : h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-strong)', cursor: ro ? 'default' : 'pointer' } }, h('input', { type: 'checkbox', checked: !!c.req, disabled: ro, onChange: function () { setCol(i, { req: !c.req }); }, style: { width: 16, height: 16, accentColor: 'var(--cyan-700)' } }), 'Obligatoria'),
        opciones, catalogo,
        valid.length ? h('div', { role: 'group', 'aria-label': 'Validaciones de ' + c.l, style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 } }, valid) : null,
        defEl); });
    var colsSec = h('section', { 'aria-labelledby': uid + '-ct', style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      h('h4', { id: uid + '-ct', style: { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, 'Columnas · ' + M.cols.length),
      h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, ro ? why : 'Arrastra una columna o usa Subir y Bajar para cambiar el orden. La clave lleva el prefijo ' + (pre || 'de la plantilla') + ' y no cambia después de crear.'),
      h('ol', { style: { margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, cols),
      ro ? null : h('div', { role: 'group', 'aria-label': 'Agregar columna', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, alignItems: 'end', padding: 12, border: '1.5px dashed var(--border-default)', borderRadius: 'var(--radius-sm)' } },
        campoTxt(uid + '-nl', 'Nueva columna', nuevo, setNuevo, { placeholder: 'Etiqueta', onKeyDown: function (e) { if (e.key === 'Enter') { e.preventDefault(); agregar(); } } }),
        campoSel(uid + '-nt', 'Tipo', nuevoT, TIPOS, setNuevoT),
        mini('Agregar columna', 'Agregar columna', agregar, !nuevo.trim(), 'Escribe la etiqueta de la columna')));
    // ---- filas
    var F = M.filas, fijas = F.modo === 'fijas';
    var filasSec = h('section', { 'aria-labelledby': uid + '-ft', style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      h('h4', { id: uid + '-ft', style: { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, 'Filas'),
      h('div', { role: 'radiogroup', 'aria-label': 'Tipo de filas', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, [['libres', 'Libres', 'El inspector las agrega, con mínimo y máximo'], ['fijas', 'Fijas', 'Lista definida aquí (por ejemplo, los componentes)']].map(function (o) {
        return h('label', { key: o[0], style: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-strong)', cursor: ro ? 'default' : 'pointer' } }, h('input', { type: 'radio', name: uid + '-modo', checked: F.modo === o[0], disabled: ro, onChange: function () { setFilas({ modo: o[0], lista: o[0] === 'fijas' && !F.lista.length ? ['Fila 1'] : F.lista }); }, style: { marginTop: 3 } }), h('span', null, h('strong', null, o[1]), h('span', { style: { display: 'block', fontSize: 12, color: 'var(--text-muted)' } }, o[2]))); })),
      fijas ? h('ol', { style: { margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 } }, F.lista.map(function (r, ri) {
        return h('li', { key: ri, style: { listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' } },
          h('input', { type: 'text', 'aria-label': 'Fila ' + (ri + 1), value: r, disabled: ro, onChange: function (e) { var v = e.target.value; filaOp(function (L) { L[ri] = v; }); }, style: Object.assign({}, inp, { flex: '1 1 160px', width: 'auto' }) }),
          mini('Subir', 'Subir la fila ' + r, function () { filaOp(function (L) { var t = L[ri]; L[ri] = L[ri - 1]; L[ri - 1] = t; }); }, ro || ri === 0, ro ? why : 'Ya es la primera'),
          mini('Bajar', 'Bajar la fila ' + r, function () { filaOp(function (L) { var t = L[ri]; L[ri] = L[ri + 1]; L[ri + 1] = t; }); }, ro || ri === F.lista.length - 1, ro ? why : 'Ya es la última'),
          mini('Quitar', 'Quitar la fila ' + r, function () { filaOp(function (L) { L.splice(ri, 1); }); }, ro || F.lista.length <= 1, ro ? why : 'Deja al menos una fila o cambia a filas libres', true)); })) :
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 } }, campoTxt(uid + '-fmin', 'Mínimo de filas', F.min, function (v) { setFilas({ min: v.replace(/\D/g, '') }); }, { inputMode: 'numeric' }), campoTxt(uid + '-fmax', 'Máximo de filas', F.max, function (v) { setFilas({ max: v.replace(/\D/g, '') }); }, { inputMode: 'numeric', placeholder: 'Sin máximo' })),
      fijas && !ro ? h('div', { style: { display: 'flex', gap: 6 } }, h('input', { type: 'text', 'aria-label': 'Nueva fila', placeholder: 'Nueva fila', value: nuevaFila, onChange: function (e) { setNuevaFila(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Enter' && nuevaFila.trim()) { e.preventDefault(); filaOp(function (L) { L.push(nuevaFila.trim()); }); setNuevaFila(''); } }, style: Object.assign({}, inp, { flex: 1 }) }),
        mini('Agregar fila', 'Agregar fila', function () { filaOp(function (L) { L.push(nuevaFila.trim()); }); setNuevaFila(''); }, !nuevaFila.trim(), 'Escribe el nombre de la fila')) : null);
    // ---- vista previa
    var celda = function (c, ri, filaNombre) { var ej = SG.ejemplo(c), aria = (c.l || 'Columna') + (filaNombre ? ' · ' + filaNombre : '') + ' (vista previa)', base = { height: 32, padding: '0 6px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)', fontFamily: 'var(--font-brand)', fontSize: 13, color: 'var(--text-strong)', width: '100%', boxSizing: 'border-box', minWidth: 90 };
      if (c.fila) return h('strong', { style: { fontSize: 13, color: 'var(--text-strong)', whiteSpace: 'nowrap' } }, filaNombre || 'Fila');
      if (c.t === 'Foto') return h('span', { 'aria-label': aria, role: 'img', style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 32, border: '1px dashed var(--border-default)', borderRadius: 6, color: 'var(--text-muted)', fontSize: 11 } }, 'Foto');
      if (c.t === 'Moneda' && window.SiriusMonto) return h(window.SiriusMonto, { ariaLabel: aria, value: c.def !== '' && c.def != null ? Number(c.def) : 1200, disabled: true, alto: 32 });
      if (['Sí/No', 'Lista propia', 'Catálogo maestro'].indexOf(c.t) >= 0) { var ops = c.t === 'Sí/No' ? ['Sí', 'No'] : c.t === 'Lista propia' ? (c.opts || []) : catVals(c.cat); return h('select', { 'aria-label': aria, disabled: true, value: ej || '', style: base }, [h('option', { key: '_', value: '' }, 'Selecciona')].concat(ops.slice(0, 30).map(function (o) { return h('option', { key: o, value: o }, o); }))); }
      return h('input', { type: 'text', 'aria-label': aria, disabled: true, value: ej || '', placeholder: c.t === 'Fecha' ? 'DD/MM/AAAA' : c.t === 'Número' ? '0' : 'Texto', style: base }); };
    var filasPrev = fijas ? F.lista.slice(0, 4) : [''];
    var prev = h('section', { 'aria-labelledby': uid + '-pt', style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      h('h4', { id: uid + '-pt', style: { margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, 'Vista previa · como la ve el inspector'),
      h('div', { tabIndex: 0, role: 'region', 'aria-label': 'Vista previa de ' + (campo.label || campo.l || 'la grilla'), style: { overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' } },
        h('table', { style: { borderCollapse: 'collapse', width: '100%' } },
          h('thead', null, h('tr', null, M.cols.map(function (c, i) { return h('th', { key: i, scope: 'col', style: { textAlign: 'left', padding: '6px 8px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, (c.l || 'Sin etiqueta') + (c.req ? ' *' : '')); }))),
          h('tbody', null, filasPrev.map(function (fn, ri) { return h('tr', { key: ri }, M.cols.map(function (c, i) { return h('td', { key: i, style: { padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle' } }, celda(c, ri, fn)); })); })))),
      h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, fijas ? F.lista.length + (F.lista.length === 1 ? ' fila fija' : ' filas fijas') + (F.lista.length > 4 ? ' · se muestran 4' : '') : 'Filas libres · fila de ejemplo · el inspector usa «Agregar fila»' + (F.min ? ' · mínimo ' + F.min : '') + (F.max ? ' · máximo ' + F.max : '')));
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }, colsSec, filasSec, prev);
  }
  window.SiriusGrillaEditor = SiriusGrillaEditor;
})();

// ---------- Etapa 8b · validaciones de las columnas en la captura y en el informe ----------
// Las mismas reglas del constructor (tipo, obligatoria, mínimo, máximo, decimales, largo, formato y opciones o catálogo) se aplican a cada celda.
// Los valores de la grilla son filas de celdas en el orden de las columnas: [[v0, v1, ...], ...].
(function () {
  var SG = window.SiriusGrilla; if (!SG || SG.validar) return;
  var vacio = function (v, c) { return c && c.t === 'Foto' ? !v : v == null || String(v).trim() === ''; };
  var numero = function (v) { if (typeof v === 'number') return v; var s = String(v).trim(); if (!/^-?[\d.,]+$/.test(s)) return null; var C = window.SIRIUS_COMPANIA; if (C && C.leerMonto) { var n = C.leerMonto(s); if (n != null) return n; } var x = Number(s.replace(/\./g, '').replace(',', '.')); return isNaN(x) ? null : x; };
  var decs = function (v) { var s = String(v).trim(), d = Math.max(s.lastIndexOf(','), s.lastIndexOf('.')); if (typeof v === 'number') { var t = String(v); return t.indexOf('.') < 0 ? 0 : t.length - t.indexOf('.') - 1; } return d < 0 ? 0 : s.length - d - 1; };
  var miles = function (n) { var C = window.SIRIUS_COMPANIA; return C && C.formatoMonto ? C.formatoMonto(Number(n)) : String(n); };
  var fechaOk = function (s, conHora) { var m = (conHora ? /^(\d\d)\/(\d\d)\/(\d{4}) (\d\d):(\d\d)$/ : /^(\d\d)\/(\d\d)\/(\d{4})$/).exec(String(s).trim()); if (!m) return false; var d = new Date(+m[3], +m[2] - 1, +m[1]); if (d.getDate() !== +m[1] || d.getMonth() !== +m[2] - 1) return false; return !conHora || (+m[4] < 24 && +m[5] < 60); };
  var FMT = { 'Mayúsculas': [function (s) { return s === s.toUpperCase(); }, 'Escribe en mayúsculas'], 'Placa': [function (s) { return /^[A-Z]{3}-?\d{3,4}$/.test(s); }, 'Placa inválida (ABC-1234)'],
    'Número de serie (PIN)': [function (s) { var P = (((window.SIRIUS_EQUIPOS || {}).identificacion || {}).pin || {}).patron || '^[A-Z0-9]{17}$'; return new RegExp(P).test(s); }, 'El número de serie debe tener 17 caracteres (PIN)'],
    'Medida de neumático (205/55 R16)': [function (s) { return /^\d{3}\/\d{2} ?R\d{2}$/i.test(s); }, 'Medida inválida (205/55 R16)'], 'Correo': [function (s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }, 'Correo inválido'] };
  // Error de una celda ('' si está bien). obligatorios: también marca las obligatorias vacías.
  SG.errorCelda = function (c, v, obligatorios) {
    if (c.fila) return '';
    if (vacio(v, c)) return c.req && obligatorios ? 'Obligatorio' : '';
    var t = c.t, s = String(v).trim();
    if (t === 'Número' || t === 'Moneda') { var n = numero(v); if (n == null) return t === 'Moneda' ? 'Escribe un monto válido' : 'Escribe un número';
      if (t === 'Número' && c.dec !== '' && c.dec != null && decs(v) > Number(c.dec)) return Number(c.dec) === 0 ? 'Sin decimales' : 'Hasta ' + c.dec + (Number(c.dec) === 1 ? ' decimal' : ' decimales');
      if (c.min !== '' && c.min != null && n < Number(c.min)) return 'Mínimo ' + (t === 'Moneda' ? miles(c.min) : String(c.min).replace('.', ','));
      if (c.max !== '' && c.max != null && n > Number(c.max)) return 'Máximo ' + (t === 'Moneda' ? miles(c.max) : String(c.max).replace('.', ','));
      return ''; }
    if (t === 'Fecha') return fechaOk(s, c.fmt === 'Fecha y hora') ? '' : c.fmt === 'Fecha y hora' ? 'Fecha y hora inválidas (DD/MM/AAAA HH:MM)' : 'Fecha inválida (DD/MM/AAAA)';
    if (t === 'Sí/No') return s === 'Sí' || s === 'No' ? '' : 'Elige Sí o No';
    if (t === 'Lista propia') { var L = c.opts || [], vs = c.multiple ? s.split(/\s*,\s*/) : [s]; return vs.every(function (x) { return L.indexOf(x) >= 0; }) ? '' : 'No está en la lista: ' + L.join(', '); }
    if (t === 'Catálogo maestro') return SG.catVals(c.cat).indexOf(s) >= 0 ? '' : 'No está en el catálogo ' + (SG.CATS.find(function (x) { return x[0] === c.cat; }) || ['', ''])[1];
    if (t === 'Foto') { var k = typeof v === 'number' ? v : v ? 1 : 0; return c.min && k < Number(c.min) ? 'Mínimo ' + c.min + (Number(c.min) === 1 ? ' foto' : ' fotos') : ''; }
    if (c.lmax && s.length > Number(c.lmax)) return 'Máximo ' + c.lmax + ' caracteres';
    var f = FMT[c.fmt]; if (f && !f[0](s)) return f[1];
    return ''; };
  // Valida toda la grilla: { celdas: { 'fila-col': error }, filas: error de cantidad, lista: [{ fila, col, texto }], total }.
  SG.validar = function (m, valores, obligatorios) { var out = { celdas: {}, filas: '', lista: [], total: 0 }, F = m.filas || {}, V = valores || [];
    V.forEach(function (row, ri) { m.cols.forEach(function (c, ci) { var e = SG.errorCelda(c, row[ci], obligatorios); if (e) { out.celdas[ri + '-' + ci] = e; out.lista.push({ fila: ri, col: ci, texto: e }); } }); });
    if (F.modo !== 'fijas') { if (F.min && V.length < Number(F.min)) out.filas = 'Agrega al menos ' + F.min + (Number(F.min) === 1 ? ' fila' : ' filas'); else if (F.max && V.length > Number(F.max)) out.filas = 'Máximo ' + F.max + ' filas'; }
    out.total = out.lista.length + (out.filas ? 1 : 0); return out; };
  // Filas iniciales de la captura: las fijas con su nombre; las libres con el mínimo (vacías salvo el valor por defecto).
  SG.inicial = function (m) { var F = m.filas || {}, una = function (nombre) { return m.cols.map(function (c) { return c.fila ? nombre : c.def !== '' && c.def != null ? (c.t === 'Moneda' || c.t === 'Número' ? Number(c.def) : c.def) : c.t === 'Foto' ? false : ''; }); };
    if (F.modo === 'fijas') return (F.lista || []).map(una); var n = Number(F.min) || 0, out = []; for (var i = 0; i < n; i++) out.push(una('')); return out; };
  SG.nuevaFila = function (m) { return m.cols.map(function (c) { return c.def !== '' && c.def != null ? (c.t === 'Moneda' || c.t === 'Número' ? Number(c.def) : c.def) : c.t === 'Foto' ? false : ''; }); };

  // Captura de una grilla con sus validaciones (informe en borrador y vista previa del formulario).
  // Props: campo · prefijo · valores (filas; sin valores el componente guarda las suyas) · onChange(filas) · ro · obligatorios (marca las obligatorias vacías) · idBase · nota
  function SiriusGrillaCaptura(props) {
    var R = window.React, h = R.createElement, campo = props.campo || {}, m = SG.tipar(campo, props.prefijo || ''), ro = !!props.ro;
    var loc = R.useState(null), propias = loc[0], setPropias = loc[1], tc = R.useState({}), toc = tc[0], setToc = tc[1];
    var V = props.valores || propias || SG.inicial(m), fijas = (m.filas || {}).modo === 'fijas', F = m.filas || {};
    var set = function (nv) { if (props.onChange) props.onChange(nv); if (!props.valores) setPropias(nv); };
    var setCelda = function (ri, ci, val) { var nv = V.map(function (r) { return r.slice(); }); nv[ri][ci] = val; set(nv); };
    var tocar = function (ri, ci) { setToc(function (t) { var o = Object.assign({}, t); o[ri + '-' + ci] = true; return o; }); };
    var VAL = SG.validar(m, V, true), uid = (props.idBase || 'cap-' + String(campo.key || 'g').replace(/\W+/g, ''));
    var errDe = function (ri, ci) { var e = VAL.celdas[ri + '-' + ci] || ''; if (e === 'Obligatorio' && !props.obligatorios && !toc[ri + '-' + ci]) return ''; return e; };
    var visibles = 0; V.forEach(function (r, ri) { m.cols.forEach(function (c, ci) { if (errDe(ri, ci)) visibles++; }); });
    var base = { height: 34, padding: '0 8px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', background: ro ? 'var(--surface-subtle)' : '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, color: 'var(--text-strong)', width: '100%', minWidth: 90, boxSizing: 'border-box' };
    var nombreFila = function (r, ri) { var ix = m.cols.findIndex(function (c) { return c.fila; }); return ix >= 0 ? String(r[ix] || 'Fila ' + (ri + 1)) : 'Fila ' + (ri + 1); };
    var celda = function (c, r, ri, ci) { var v = r[ci], id = uid + '-' + ri + '-' + ci, e = errDe(ri, ci), eid = id + '-err', aria = c.l + ' · ' + nombreFila(r, ri);
      if (c.fila) return h('strong', { style: { fontSize: 14, color: 'var(--text-strong)', whiteSpace: 'nowrap' } }, String(v || ''));
      var inv = { 'aria-invalid': e ? 'true' : undefined, 'aria-describedby': e ? eid : undefined, 'aria-required': c.req ? 'true' : undefined }, st = Object.assign({}, base, e ? { borderColor: 'var(--color-danger)' } : {});
      var ctl;
      if (c.t === 'Foto') ctl = h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-strong)', whiteSpace: 'nowrap', cursor: ro ? 'default' : 'pointer' } }, h('input', Object.assign({ id: id, type: 'checkbox', checked: !!v, disabled: ro, 'aria-label': aria, onChange: function (ev) { setCelda(ri, ci, ev.target.checked); tocar(ri, ci); }, style: { width: 18, height: 18, accentColor: 'var(--color-brand)' } }, inv)), 'Con foto');
      else if (c.t === 'Moneda' && window.SiriusMonto) ctl = h(window.SiriusMonto, { id: id, ariaLabel: aria, value: v === '' || v == null ? null : Number(v), disabled: ro, permitirNegativo: true, invalid: !!e, alto: 34, ariaDescribedby: e && /^(Mínimo|Máximo|Obligatorio)/.test(e) ? eid : undefined, onChange: function (n, er, t) { setCelda(ri, ci, er ? String(t) : n == null ? '' : n); }, onBlur: function () { tocar(ri, ci); } });
      else if (['Sí/No', 'Lista propia', 'Catálogo maestro'].indexOf(c.t) >= 0) { var ops = c.t === 'Sí/No' ? ['Sí', 'No'] : c.t === 'Lista propia' ? (c.opts || []) : SG.catVals(c.cat), fuera = v && ops.indexOf(String(v)) < 0;
        ctl = h('select', Object.assign({ id: id, 'aria-label': aria, disabled: ro, value: v == null ? '' : String(v), onChange: function (ev) { setCelda(ri, ci, ev.target.value); tocar(ri, ci); }, onBlur: function () { tocar(ri, ci); }, style: st }, inv), [h('option', { key: '_', value: '' }, 'Selecciona')].concat(fuera ? [h('option', { key: '__f', value: String(v) }, String(v) + ' (no válido)')] : [], ops.map(function (o) { return h('option', { key: o, value: o }, o); }))); }
      else ctl = h('input', Object.assign({ id: id, type: 'text', 'aria-label': aria, disabled: ro, value: v == null ? '' : String(v), inputMode: c.t === 'Número' ? 'decimal' : undefined, placeholder: c.t === 'Fecha' ? (c.fmt === 'Fecha y hora' ? 'DD/MM/AAAA HH:MM' : 'DD/MM/AAAA') : '', maxLength: c.lmax ? Number(c.lmax) + 5 : undefined, onChange: function (ev) { setCelda(ri, ci, ev.target.value); }, onBlur: function () { tocar(ri, ci); }, style: st }, inv));
      var propio = c.t === 'Moneda' && window.SiriusMonto && e && !/^(Mínimo|Máximo|Obligatorio)/.test(e); // el aviso de formato lo muestra SiriusMonto
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 } }, ctl, e && !propio ? h('span', { id: eid, style: { fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', lineHeight: 1.3 } }, e) : null); };
    var btn = function (label, aria, on, dis, why) { return h('button', { type: 'button', 'aria-label': aria, title: dis ? why : aria, 'aria-disabled': dis ? 'true' : undefined, onClick: function () { if (!dis) on(); }, style: { height: 32, padding: '0 10px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: dis ? 'var(--neutral-400)' : 'var(--text-strong)', cursor: dis ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' } }, label); };
    var minF = Number(F.min) || 0, maxF = Number(F.max) || 0;
    var tabla = h('div', { tabIndex: 0, role: 'region', 'aria-label': (campo.label || 'Grilla') + ' · captura', style: { overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' } },
      h('table', { style: { borderCollapse: 'collapse', width: '100%', minWidth: Math.max(420, m.cols.length * 140) } },
        h('thead', null, h('tr', null, m.cols.map(function (c, i) { return h('th', { key: i, scope: 'col', style: { textAlign: 'left', padding: '8px 10px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, c.l + (c.req ? ' *' : '')); }).concat(!fijas && !ro ? [h('th', { key: '_a', scope: 'col', style: { padding: '8px 10px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'left' } }, 'Acciones')] : []))),
        h('tbody', null, V.length ? V.map(function (r, ri) { return h('tr', { key: ri }, m.cols.map(function (c, ci) { return h('td', { key: ci, style: { padding: '6px 10px', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' } }, celda(c, r, ri, ci)); }).concat(!fijas && !ro ? [h('td', { key: '_a', style: { padding: '6px 10px', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' } }, btn('Quitar', 'Quitar la fila ' + (ri + 1), function () { set(V.filter(function (x, j) { return j !== ri; })); }, V.length <= minF, 'La grilla pide al menos ' + minF + (minF === 1 ? ' fila' : ' filas')))] : [])); })
          : [h('tr', { key: '_v' }, h('td', { colSpan: m.cols.length + 1, style: { padding: '10px', fontSize: 14, color: 'var(--text-muted)' } }, 'Sin filas registradas.'))])));
    var pie = h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
      h('span', { role: 'status', 'aria-live': 'polite', style: { fontSize: 13, fontWeight: visibles || VAL.filas ? 700 : 400, color: visibles || VAL.filas ? 'var(--color-danger)' : 'var(--text-muted)' } },
        VAL.filas ? VAL.filas : visibles ? visibles + (visibles === 1 ? ' celda por corregir' : ' celdas por corregir') : props.nota || (fijas ? (F.lista || []).length + ' filas fijas' : 'Filas libres' + (minF ? ' · mínimo ' + minF : '') + (maxF ? ' · máximo ' + maxF : ''))),
      !fijas && !ro ? btn('Agregar fila', 'Agregar fila a ' + (campo.label || 'la grilla'), function () { set(V.concat([SG.nuevaFila(m)])); }, !!maxF && V.length >= maxF, 'La grilla admite hasta ' + maxF + ' filas') : null);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 } }, tabla, pie);
  }
  window.SiriusGrillaCaptura = SiriusGrillaCaptura;
})();
