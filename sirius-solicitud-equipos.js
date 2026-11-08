// SIRIUS · Equipos de la Nueva solicitud (etapa 8b · ramo Equipo y maquinaria, composición Equipo móvil).
// Como la sección de vehículos: empieza vacía, «Agregar equipo» y «Cargar desde Excel». Por equipo: categoría, tipo, marca y modelo
// (catálogo SIRIUS_EQUIPOS), año de fabricación, número de serie (aviso si no tiene formato PIN), número de motor, suma asegurada
// (SiriusMonto) e implementos con valor. Sin texto libre, salvo el tipo «Otro (describir)» (etapa 8c): pide una descripción obligatoria (mínimo 5 caracteres).
// Carga masiva: lee el archivo real (.xlsx con SheetJS, o .csv) y mapea las columnas por su encabezado; la plantilla (.xlsx con ExcelJS)
// trae listas de categoría, tipo, marca y modelo desde la hoja «Catálogos».
// Props: equipos [] · onChange(equipos) · mostrarErrores · escena ('embulk' abre la carga con una vista previa) · onEstado({ editando })
(function () {
  if (window.SiriusEquiposSolicitud) return;
  var Q = function () { return window.SIRIUS_EQUIPOS || {}; };
  var XLSX_URL = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', EXCELJS_URL = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';
  function cargar(url, key) { if (window[key]) return Promise.resolve(window[key]); return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = url; s.onload = function () { window[key] ? ok(window[key]) : ko(new Error(key)); }; s.onerror = ko; document.head.appendChild(s); }); }
  var norm = function (s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); };
  var usd = function (n) { var C = window.SIRIUS_COMPANIA; return C && C.formatoMonto ? C.formatoMonto(Number(n) || 0) : 'USD ' + n; };
  var anioMax = function () { var E = window.SIRIUS_EJEMPLO || {}; return (E.ahora ? E.ahora().getFullYear() : 2026) + 1; };
  // Catálogo completo. «Otro (describir)» (categoría Equipo especial) se permite con descripción obligatoria (etapa 8c) y deja el caso en Conflictos como «Valor fuera de catálogo».
  var OTRO = 'Otro (describir)', DESC_MIN = 5;
  function cats() { return (Q().categorias || []).map(function (c) { return { nombre: c.nombre, tipos: (c.tipos || []).slice() }; }).filter(function (c) { return c.tipos.length; }); }
  var esOtro = function (x) { return !!x && x.tipo === OTRO; };
  // Cómo se nombra el tipo en pantallas y PDF: la descripción ingresada cuando es «Otro (describir)».
  var tipoTxt = function (x) { return esOtro(x) ? (String(x.descripcion || '').trim() || OTRO) : (x && x.tipo) || ''; };
  function marcas() { return Q().marcasModelos || []; }
  function leerNum(t) { if (typeof t === 'number') return t; var C = window.SIRIUS_COMPANIA; var s = String(t == null ? '' : t).trim(); if (!s) return null; if (C && C.leerMonto) { var n = C.leerMonto(s); if (n != null) return n; } var x = Number(s.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isFinite(x) ? x : null; }
  var pinValido = function (s) { return window.SiriusEquipos ? window.SiriusEquipos.pinValido(s) : /^[A-Z0-9]{17}$/.test(String(s || '')); };
  var notaPin = function () { return (((Q().identificacion || {}).pin) || {}).nota || 'Serie sin formato PIN: se acepta con aviso.'; };

  // Errores de un equipo (los mismos en el formulario y en la carga masiva).
  function errores(x, lista, propio) { var e = {}, C = cats(), cat = C.find(function (c) { return c.nombre === x.categoria; }), mk = marcas().find(function (m) { return m.marca === x.marca; });
    if (!x.categoria) e.categoria = 'Elige la categoría'; else if (!cat) e.categoria = 'Categoría fuera del catálogo';
    if (!x.tipo) e.tipo = 'Elige el tipo'; else if (cat && cat.tipos.indexOf(x.tipo) < 0) e.tipo = 'Tipo fuera del catálogo para esa categoría';
    if (esOtro(x) && String(x.descripcion || '').trim().length < DESC_MIN) e.descripcion = String(x.descripcion || '').trim() ? 'Describe el equipo con al menos ' + DESC_MIN + ' caracteres' : 'Describe el equipo (mínimo ' + DESC_MIN + ' caracteres)';
    if (!x.marca) e.marca = 'Elige la marca'; else if (!mk) e.marca = 'Marca fuera del catálogo';
    if (!x.modelo) e.modelo = 'Elige el modelo'; else if (mk && mk.modelos.indexOf(x.modelo) < 0) e.modelo = 'Modelo fuera del catálogo para esa marca';
    var a = Number(x.anio); if (!String(x.anio || '').trim()) e.anio = 'Ingresa el año de fabricación'; else if (!/^\d{4}$/.test(String(x.anio).trim()) || a < 1970 || a > anioMax()) e.anio = 'Año entre 1970 y ' + anioMax();
    var sr = String(x.serie || '').trim().toUpperCase(); if (!sr) e.serie = 'Ingresa el número de serie'; else if (!/^[A-Z0-9-]{5,25}$/.test(sr)) e.serie = 'Serie inválida: letras, números y guion (5 a 25)';
    else if ((lista || []).some(function (y) { return y !== propio && String(y.serie || '').toUpperCase() === sr; })) e.serie = 'Serie repetida en este caso';
    if (!(Number(x.suma) > 0)) e.suma = 'Ingresa la suma asegurada';
    (x.implementos || []).forEach(function (im, i) { if (!String(im.desc || '').trim()) e['imp' + i + 'd'] = 'Describe el implemento'; if (!(Number(im.valor) > 0)) e['imp' + i + 'v'] = 'Ingresa el valor'; });
    return e; }
  function total(x) { return (Number(x.suma) || 0) + (x.implementos || []).reduce(function (s, im) { return s + (Number(im.valor) || 0); }, 0); }

  // ---------- Carga masiva: columnas por encabezado ----------
  var COLS = [
    { k: 'categoria', l: 'Categoría', req: true, alias: ['categoria'] }, { k: 'tipo', l: 'Tipo', req: true, alias: ['tipo', 'tipo de equipo'] },
    { k: 'descripcion', l: 'Descripción del equipo (solo si el tipo es «Otro (describir)»)', req: false, alias: ['descripcion del equipo', 'descripcion', 'descripcion del equipo solo si el tipo es otro describir', 'descripcion otro', 'describir'] },
    { k: 'marca', l: 'Marca', req: true, alias: ['marca'] }, { k: 'modelo', l: 'Modelo', req: true, alias: ['modelo'] },
    { k: 'anio', l: 'Año de fabricación', req: true, alias: ['ano de fabricacion', 'anio de fabricacion', 'ano', 'anio', 'year'] },
    { k: 'serie', l: 'Número de serie', req: true, alias: ['numero de serie', 'serie', 'pin', 'numero de serie pin', 'n de serie'] },
    { k: 'motor', l: 'Número de motor', req: false, alias: ['numero de motor', 'motor', 'n de motor'] },
    { k: 'suma', l: 'Suma asegurada', req: true, alias: ['suma asegurada', 'valor asegurado', 'suma asegurada usd'] },
    { k: 'implementos', l: 'Implementos (descripción: valor; …)', req: false, alias: ['implementos', 'implementos descripcion valor', 'implementos y accesorios'] }];
  function celda(c) { if (c == null) return ''; if (c instanceof Date) return c.getFullYear() + ''; if (typeof c === 'object' && c.text) return String(c.text); return String(c).trim(); }
  function leerImpl(t) { var s = String(t || '').trim(); if (!s) return { L: [], err: '' }; var L = [], err = '';
    s.split(/\s*;\s*/).filter(Boolean).forEach(function (p) { var m = /^(.*?)\s*[:=]\s*(.+)$/.exec(p); if (!m) { err = 'implementos: usa «descripción: valor» separados por punto y coma'; return; } var v = leerNum(m[2]); if (!m[1].trim() || !(v > 0)) { err = 'implementos: valor inválido en «' + p + '»'; return; } L.push({ desc: m[1].trim(), valor: v }); });
    return { L: L, err: err }; }
  function leer(grid, r0) { var err = [], warn = [], vacia = function (c) { return celda(c) === ''; };
    var hi = grid.findIndex(function (r) { return (r || []).some(function (c) { return !vacia(c); }); }); if (hi < 0) return { err: ['El archivo está vacío.'], warn: warn, rows: [] };
    var head = grid[hi].map(function (h) { return norm(celda(h)); }), idx = {};
    COLS.forEach(function (c) { var i = head.findIndex(function (h) { return h && c.alias.indexOf(h) >= 0; }); if (i >= 0) idx[c.k] = i; });
    COLS.filter(function (c) { return c.req && idx[c.k] == null; }).forEach(function (c) { err.push('Falta la columna ' + c.l); });
    var usadas = Object.keys(idx).map(function (k) { return idx[k]; }); grid[hi].forEach(function (h, i) { var t = celda(h); if (t && usadas.indexOf(i) < 0) warn.push('Se ignoró la columna ' + t); });
    var rows = []; grid.slice(hi + 1).forEach(function (r, k) { if (!r || r.every(vacia)) return; var g = function (key) { return idx[key] == null ? '' : celda(r[idx[key]]); };
      rows.push({ fila: (r0 || 0) + hi + k + 2, categoria: g('categoria'), tipo: g('tipo'), descripcion: g('descripcion'), marca: g('marca'), modelo: g('modelo'), anio: g('anio'), serie: g('serie'), motor: g('motor'), suma: g('suma'), implementos: g('implementos') }); });
    if (!err.length && !rows.length) err.push('El archivo no tiene equipos para cargar.');
    if (rows.length > 200) err.push('El archivo tiene ' + rows.length + ' equipos; el máximo es 200.');
    return { err: err, warn: warn, rows: err.length ? [] : rows }; }
  // Fila → equipo con el catálogo (sin importar mayúsculas ni tildes) y sus errores.
  function revisar(rows, existentes) { var C = cats(), MK = marcas(), vistos = [];
    return rows.map(function (r) { var cat = C.find(function (c) { return norm(c.nombre) === norm(r.categoria); }), tipo = cat ? cat.tipos.find(function (t) { return norm(t) === norm(r.tipo); }) : null, mk = MK.find(function (m) { return norm(m.marca) === norm(r.marca); }), mo = mk ? mk.modelos.find(function (m) { return norm(m) === norm(r.modelo); }) : null, im = leerImpl(r.implementos);
      var x = { categoria: cat ? cat.nombre : r.categoria, tipo: tipo || r.tipo, descripcion: (tipo || r.tipo) === OTRO ? String(r.descripcion || '').trim() : '', marca: mk ? mk.marca : r.marca, modelo: mo || r.modelo, anio: String(r.anio || '').replace(/\.0+$/, ''), serie: String(r.serie || '').trim().toUpperCase(), motor: String(r.motor || '').trim().toUpperCase(), suma: leerNum(r.suma), implementos: im.L };
      var e = errores(x, existentes.concat(vistos), null), m = Object.keys(e).map(function (k) { return e[k].charAt(0).toLowerCase() + e[k].slice(1); }); if (im.err) m.push(im.err); if (String(r.suma || '').trim() && x.suma == null) m = m.filter(function (t) { return t !== 'ingresa la suma asegurada'; }).concat('suma asegurada inválida');
      vistos.push(x); return { r: r, x: x, msg: m.join('; '), aviso: !m.length && x.serie && !pinValido(x.serie) ? 'Serie sin formato PIN (se acepta con aviso)' : '' }; }); }
  // Vista previa de la escena embulk: la misma ruta de lectura con una matriz de ejemplo (como si viniera del archivo).
  function gridDemo() { var X = (Q().ejemplo || {}).equipos || [], H = COLS.map(function (c) { return c.l; });
    return [H].concat(X.map(function (q) { return [q.categoria, q.tipo, '', q.marca, q.modelo, q.anioFab, q.pin, q.motor, q.sumaAsegurada, (q.implementos || []).map(function (i) { return i[0] + ': ' + i[3]; }).join('; ')]; }),
      [['Construcción y minería', 'Excavadora', '', 'Komatsu', 'PC200', 2020, 'KMTPC200A44012233', '', 150000, ''], ['Agrícola', 'Tractor agrícola', '', 'John Deere', '6125J', 2022, 'JD6125JX0441', 'JDM-55120', '95.000,00', 'Arado de discos: 4800']]); }

  async function plantilla() { var EX = await cargar(EXCELJS_URL, 'ExcelJS'), wb = new EX.Workbook(); wb.creator = 'SIRIUS'; wb.created = new Date();
    var C = cats(), MK = marcas().slice().sort(function (a, b) { return a.marca.localeCompare(b.marca, 'es'); }), parCT = [], parMM = [];
    C.forEach(function (c) { c.tipos.forEach(function (t) { parCT.push([c.nombre, t]); }); }); MK.forEach(function (m) { m.modelos.forEach(function (x) { parMM.push([m.marca, x]); }); });
    var ws = wb.addWorksheet('Equipos', { views: [{ state: 'frozen', ySplit: 1 }] }), CAT = "'Catálogos'!", LAST = 201;
    ws.columns = COLS.map(function (c) { return { header: c.l, key: c.k, width: Math.max(16, c.l.length + 4) }; });
    ws.getRow(1).height = 30; ws.getRow(1).eachCell(function (cell, n) { var req = COLS[n - 1].req; cell.font = { bold: true, color: { argb: req ? 'FFFFFFFF' : 'FF0B3C49' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: req ? 'FF0E7490' : 'FFCFE8EF' } }; cell.alignment = { vertical: 'middle', wrapText: true }; });
    var X = ((Q().ejemplo || {}).equipos || [])[0]; if (X) ws.addRow({ categoria: X.categoria, tipo: X.tipo, descripcion: '', marca: X.marca, modelo: X.modelo, anio: X.anioFab, serie: X.pin, motor: X.motor, suma: X.sumaAsegurada, implementos: (X.implementos || []).map(function (i) { return i[0] + ': ' + i[3]; }).join('; ') });
    ws.getColumn('suma').numFmt = '#,##0.00';
    var L = function (k) { return ws.getColumn(k).letter; }, set = function (k, dv) { ws.dataValidations.add(L(k) + '2:' + L(k) + LAST, Object.assign({ allowBlank: true, showErrorMessage: true, errorStyle: 'stop' }, dv)); };
    var nCT = parCT.length + 1, nMM = parMM.length + 1, nC = C.length + 1, nM = MK.length + 1;
    set('categoria', { type: 'list', formulae: [CAT + '$D$2:$D$' + nC], errorTitle: 'Categoría no válida', error: 'Elige una categoría de la lista.' });
    set('tipo', { type: 'list', formulae: ['OFFSET(' + CAT + '$B$1,MATCH($' + L('categoria') + '2,' + CAT + '$A$1:$A$' + nCT + ',0)-1,0,COUNTIF(' + CAT + '$A$1:$A$' + nCT + ',$' + L('categoria') + '2),1)'], errorTitle: 'Tipo no válido', error: 'Elige primero la categoría y luego un tipo de su lista.' });
    set('descripcion', { type: 'textLength', operator: 'greaterThanOrEqual', formulae: [DESC_MIN], errorTitle: 'Descripción del equipo', error: 'Describe el equipo con al menos ' + DESC_MIN + ' caracteres (obligatoria si el tipo es «Otro (describir)»).' });
    set('marca', { type: 'list', formulae: [CAT + '$I$2:$I$' + nM], errorTitle: 'Marca no válida', error: 'Elige una marca de la lista.' });
    set('modelo', { type: 'list', formulae: ['OFFSET(' + CAT + '$G$1,MATCH($' + L('marca') + '2,' + CAT + '$F$1:$F$' + nMM + ',0)-1,0,COUNTIF(' + CAT + '$F$1:$F$' + nMM + ',$' + L('marca') + '2),1)'], errorTitle: 'Modelo no válido', error: 'Elige primero la marca y luego un modelo de su lista.' });
    set('anio', { type: 'whole', operator: 'between', formulae: [1970, anioMax()], errorTitle: 'Año no válido', error: 'Año entero entre 1970 y ' + anioMax() + '.' });
    set('suma', { type: 'decimal', operator: 'greaterThan', formulae: [0], errorTitle: 'Suma asegurada', error: 'Ingresa un valor mayor a 0.' });
    var cat = wb.addWorksheet('Catálogos', { views: [{ state: 'frozen', ySplit: 1 }] });
    cat.columns = [{ header: 'Categoría', width: 26 }, { header: 'Tipo', width: 28 }, { width: 3 }, { header: 'Categorías', width: 26 }, { width: 3 }, { header: 'Marca', width: 16 }, { header: 'Modelo', width: 16 }, { width: 3 }, { header: 'Marcas', width: 16 }];
    parCT.forEach(function (p, i) { cat.getCell(i + 2, 1).value = p[0]; cat.getCell(i + 2, 2).value = p[1]; }); C.forEach(function (c, i) { cat.getCell(i + 2, 4).value = c.nombre; });
    parMM.forEach(function (p, i) { cat.getCell(i + 2, 6).value = p[0]; cat.getCell(i + 2, 7).value = p[1]; }); MK.forEach(function (m, i) { cat.getCell(i + 2, 9).value = m.marca; });
    [1, 2, 4, 6, 7, 9].forEach(function (n) { var c = cat.getCell(1, n); c.font = { bold: true, color: { argb: 'FFFFFFFF' } }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0E7490' } }; });
    var ins = wb.addWorksheet('Instrucciones'); ins.columns = [{ width: 110 }];
    ['Plantilla de carga masiva de equipos · SIRIUS', '', '1. Completa una fila por equipo en la hoja «Equipos». Máximo 200 equipos por archivo. Borra la fila de ejemplo antes de subir el archivo.',
      '2. Categoría, Tipo, Marca y Modelo se eligen de las listas (hoja «Catálogos»); el tipo depende de la categoría y el modelo de la marca. Si no está, pídele al Administrador que lo agregue en Catálogos maestros.',
      '2b. Si el tipo es «Otro (describir)» (categoría Equipo especial), escribe qué equipo es en «Descripción del equipo» (mínimo ' + DESC_MIN + ' caracteres). Queda como valor fuera de catálogo hasta que el Administrador lo agregue en Catálogos maestros; para los demás tipos deja esa columna vacía.',
      '3. Año de fabricación: entero entre 1970 y ' + anioMax() + '. Número de serie: el de la placa del fabricante; si no tiene 17 caracteres (PIN) se acepta con aviso.',
      '4. Suma asegurada en ' + ((window.SIRIUS_COMPANIA || {}).moneda || {}).codigo + '. Implementos (opcional): «descripción: valor» separados por punto y coma, p. ej. «Horquillas para pallets: 6500; Martillo hidráulico: 12000».',
      '', 'Los encabezados en azul oscuro son obligatorios; los de azul claro son opcionales. Las columnas se leen por su encabezado, en cualquier orden.'].forEach(function (t, i) { var c = ins.getCell(i + 1, 1); c.value = t; c.alignment = { wrapText: true, vertical: 'top' }; if (!i) c.font = { bold: true, size: 14 }; });
    var buf = await wb.xlsx.writeBuffer(), name = 'plantilla-carga-equipos.xlsx', url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 4000); return name; }
  async function leerArchivo(f) { if (/\.csv$/i.test(f.name)) { var b = await f.arrayBuffer(), t; try { t = new TextDecoder('utf-8', { fatal: true }).decode(b); } catch (e) { t = new TextDecoder('windows-1252').decode(b); }
      var sep = (t.split(/\r?\n/)[0].match(/;/g) || []).length >= (t.split(/\r?\n/)[0].match(/,/g) || []).length ? ';' : ','; return leer(t.replace(/^﻿/, '').split(/\r?\n/).map(function (l) { return l.split(sep).map(function (c) { return c.replace(/^"|"$/g, ''); }); }), 0); }
    var X = await cargar(XLSX_URL, 'XLSX'), wb = X.read(await f.arrayBuffer(), { type: 'array', cellDates: true }), nm = wb.SheetNames.find(function (n) { return norm(n) === 'equipos'; }) || wb.SheetNames[0], ws = nm && wb.Sheets[nm];
    if (!ws || !ws['!ref']) return { err: ['El archivo está vacío.'], warn: [], rows: [] }; var rg = X.utils.decode_range(ws['!ref']);
    return leer(X.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '', blankrows: true }), rg.s.r); }

  function SiriusEquiposSolicitud(props) {
    var R = window.React, h = R.createElement, NS = window.AseguradoraDelSurDesignSystem_4fbf29 || {}, lista = props.equipos || [], set = props.onChange || function () {};
    var fS = R.useState(function () { var o = props.escena === 'emotro' ? lista.find(esOtro) : null; return o ? { x: JSON.parse(JSON.stringify(o)), editId: o.id } : null; }), form = fS[0], setForm = fS[1], tS = R.useState(false), intento = tS[0], setIntento = tS[1];
    var bS = R.useState(props.escena === 'embulk' ? { stage: 'preview', file: 'equipos-amazonia-sacha.xlsx', rows: leer(gridDemo(), 0).rows, err: [], warn: [] } : null), bulk = bS[0], setBulk = bS[1], pS = R.useState(null), tpl = pS[0], setTpl = pS[1];
    var fileRef = R.useRef(null);
    R.useEffect(function () { if (props.onEstado) props.onEstado({ editando: !!form }); }, [!!form]);
    var mS = R.useState(!!window.SiriusModal), setM = mS[1]; R.useEffect(function () { if (!window.SiriusModal) cargar('sirius-modal.js', 'SiriusModal').then(function () { setM(true); }, function () {}); }, []);
    var B = function (variant, label, on, extra) { return NS.Button ? h(NS.Button, Object.assign({ variant: variant, size: 'sm', onClick: on }, extra || {}), label) : h('button', { type: 'button', onClick: on }, label); };
    var lbl = { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }, inp = { height: 44, padding: '0 12px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 15, color: 'var(--text-strong)', background: '#FFFFFF', width: '100%', boxSizing: 'border-box' };
    var nuevo = function () { return { id: 'q' + Date.now(), categoria: '', tipo: '', descripcion: '', marca: '', modelo: '', anio: '', serie: '', motor: '', suma: null, implementos: [] }; };
    var abrir = function (x) { setIntento(false); setForm({ x: JSON.parse(JSON.stringify(x || nuevo())), editId: x ? x.id : null }); setTimeout(function () { var el = document.getElementById('nse-categoria'); if (el) el.focus(); }, 60); };
    var E = form ? errores(form.x, lista, lista.find(function (y) { return y.id === form.editId; }) || null) : {};
    var upd = function (p) { setForm(function (f) { return Object.assign({}, f, { x: Object.assign({}, f.x, p) }); }); };
    var guardar = function () { if (Object.keys(E).length) { setIntento(true); setTimeout(function () { var k = Object.keys(E)[0], el = document.getElementById('nse-' + k); if (el) el.focus(); }, 30); return; }
      var x = Object.assign({}, form.x, { serie: String(form.x.serie).trim().toUpperCase(), motor: String(form.x.motor || '').trim().toUpperCase() }); set(form.editId ? lista.map(function (y) { return y.id === form.editId ? x : y; }) : lista.concat(x)); setForm(null);
      setTimeout(function () { var el = document.getElementById('nse-add'); if (el) el.focus(); }, 60); };
    var campo = function (k, label, ctl, help) { var e = intento ? E[k] : ''; return h('div', { key: k, style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 } }, h('label', { htmlFor: 'nse-' + k, style: lbl }, label, h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, k === 'motor' ? '' : ' *')), ctl, help ? h('span', { id: 'nse-' + k + '-h', style: { fontSize: 13, color: help.warn ? 'var(--color-warning-strong, #8a5a00)' : 'var(--text-muted)', fontWeight: help.warn ? 700 : 400 } }, help.t) : null, e ? h('span', { id: 'nse-' + k + '-e', role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, e) : null); };
    var sel = function (k, val, ops, on, dis, ph) { var e = intento ? E[k] : ''; return h('select', { id: 'nse-' + k, value: val || '', disabled: !!dis, 'aria-invalid': e ? 'true' : undefined, 'aria-describedby': e ? 'nse-' + k + '-e' : undefined, onChange: function (ev) { on(ev.target.value); }, style: Object.assign({}, inp, dis ? { background: 'var(--surface-subtle)', color: 'var(--text-muted)' } : {}) }, [h('option', { key: '_', value: '' }, ph || 'Selecciona')].concat(ops.map(function (o) { return h('option', { key: o, value: o }, o); }))); };
    var formulario = function () { var x = form.x, C = cats(), cat = C.find(function (c) { return c.nombre === x.categoria; }), mk = marcas().find(function (m) { return m.marca === x.marca; }), sr = String(x.serie || '').trim().toUpperCase();
      var errT = function (k) { return intento && E[k] ? 'true' : undefined; };
      return h('section', { 'aria-labelledby': 'nse-form-h', style: { display: 'flex', flexDirection: 'column', gap: 16, padding: 20, border: '2px solid var(--color-brand)', borderRadius: 'var(--radius-md)', background: '#FFFFFF' } },
        h('h3', { id: 'nse-form-h', style: { margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-strong)' } }, form.editId ? 'Editar equipo' : 'Nuevo equipo'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px 20px', alignItems: 'start' } },
          campo('categoria', 'Categoría', sel('categoria', x.categoria, C.map(function (c) { return c.nombre; }), function (v) { upd({ categoria: v, tipo: '' }); })),
          campo('tipo', 'Tipo', sel('tipo', x.tipo, cat ? cat.tipos : [], function (v) { upd({ tipo: v, descripcion: v === OTRO ? x.descripcion : '' }); }, !cat, cat ? 'Selecciona' : 'Elige primero la categoría')),
          x.tipo === OTRO ? campo('descripcion', 'Descripción del equipo', h('input', { id: 'nse-descripcion', type: 'text', value: x.descripcion || '', autoComplete: 'off', maxLength: 120, 'aria-invalid': errT('descripcion'), 'aria-describedby': [errT('descripcion') ? 'nse-descripcion-e' : '', 'nse-descripcion-h'].filter(Boolean).join(' '), onChange: function (ev) { upd({ descripcion: ev.target.value }); }, style: inp }), { t: 'Mínimo ' + DESC_MIN + ' caracteres. El tipo queda como valor fuera de catálogo en Conflictos hasta que el Administrador lo agregue.' }) : null,
          campo('marca', 'Marca', sel('marca', x.marca, marcas().map(function (m) { return m.marca; }), function (v) { upd({ marca: v, modelo: '' }); })),
          campo('modelo', 'Modelo', sel('modelo', x.modelo, mk ? mk.modelos : [], function (v) { upd({ modelo: v }); }, !mk, mk ? 'Selecciona' : 'Elige primero la marca')),
          campo('anio', 'Año de fabricación', h('input', { id: 'nse-anio', type: 'text', inputMode: 'numeric', maxLength: 4, value: x.anio, 'aria-invalid': errT('anio'), 'aria-describedby': errT('anio') ? 'nse-anio-e' : undefined, onChange: function (ev) { upd({ anio: ev.target.value.replace(/\D/g, '') }); }, style: inp })),
          campo('serie', 'Número de serie', h('input', { id: 'nse-serie', type: 'text', value: x.serie, autoComplete: 'off', 'aria-invalid': errT('serie'), 'aria-describedby': [errT('serie') ? 'nse-serie-e' : '', 'nse-serie-h'].filter(Boolean).join(' '), onChange: function (ev) { upd({ serie: ev.target.value.toUpperCase() }); }, style: inp }),
            sr && !E.serie && !pinValido(sr) ? { warn: true, t: 'Serie sin formato PIN: ' + notaPin().replace(/^Para equipos sin PIN de 17 caracteres se acepta/, 'se acepta') } : { t: 'PIN de 17 caracteres (ISO 10261) o la serie del fabricante.' }),
          campo('motor', 'Número de motor', h('input', { id: 'nse-motor', type: 'text', value: x.motor, autoComplete: 'off', onChange: function (ev) { upd({ motor: ev.target.value.toUpperCase() }); }, style: inp })),
          campo('suma', 'Suma asegurada', window.SiriusMonto ? h(window.SiriusMonto, { id: 'nse-suma', value: x.suma, invalid: !!(intento && E.suma), ariaDescribedby: intento && E.suma ? 'nse-suma-e' : undefined, alto: 44, onChange: function (n) { upd({ suma: n }); } }) : null, { t: 'Valor del equipo nuevo (VRN); los implementos van aparte.' })),
        h('div', { role: 'group', 'aria-labelledby': 'nse-imp-h', style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } }, h('span', { id: 'nse-imp-h', style: lbl }, 'Implementos y accesorios (' + x.implementos.length + ')'), B('secondary', 'Agregar implemento', function () { upd({ implementos: x.implementos.concat({ desc: '', valor: null }) }); setTimeout(function () { var el = document.getElementById('nse-imp' + x.implementos.length + 'd'); if (el) el.focus(); }, 40); })),
          x.implementos.length ? h('ul', { style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 } }, x.implementos.map(function (im, i) { var eD = intento && E['imp' + i + 'd'], eV = intento && E['imp' + i + 'v'];
            return h('li', { key: i, style: { display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr) auto', gap: 10, alignItems: 'start' } },
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('input', { id: 'nse-imp' + i + 'd', type: 'text', 'aria-label': 'Descripción del implemento ' + (i + 1), placeholder: 'Descripción (p. ej. Martillo hidráulico)', value: im.desc, 'aria-invalid': eD ? 'true' : undefined, onChange: function (ev) { var L = x.implementos.slice(); L[i] = Object.assign({}, im, { desc: ev.target.value }); upd({ implementos: L }); }, style: inp }), eD ? h('span', { role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, eD) : null),
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, window.SiriusMonto ? h(window.SiriusMonto, { id: 'nse-imp' + i + 'v', ariaLabel: 'Valor del implemento ' + (i + 1), value: im.valor, invalid: !!eV, alto: 44, onChange: function (n) { var L = x.implementos.slice(); L[i] = Object.assign({}, im, { valor: n }); upd({ implementos: L }); } }) : null, eV ? h('span', { role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, eV) : null),
              h('button', { type: 'button', 'aria-label': 'Quitar el implemento ' + (i + 1), onClick: function () { upd({ implementos: x.implementos.filter(function (y, j) { return j !== i; }) }); }, style: { height: 44, padding: '0 10px', border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--color-danger)', cursor: 'pointer' } }, 'Quitar')); })) : h('span', { style: { fontSize: 14, color: 'var(--text-muted)' } }, 'Sin implementos. Agrega cucharones, horquillas, martillos u otros accesorios con su valor.')),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' } },
          h('span', { style: { fontSize: 15, color: 'var(--text-body)' } }, 'Total del equipo: ', h('strong', { style: { color: 'var(--text-strong)' } }, usd(total(x)))),
          h('div', { style: { display: 'flex', gap: 8 } }, B('ghost', 'Cancelar', function () { setForm(null); }), B('primary', form.editId ? 'Guardar cambios' : 'Guardar equipo', guardar)))); };

    // ---------- carga masiva ----------
    var revisadas = bulk && bulk.stage === 'preview' ? revisar(bulk.rows, lista) : [], ok = revisadas.filter(function (z) { return !z.msg; }), bad = revisadas.filter(function (z) { return z.msg; });
    var onFile = function (ev) { var f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (!f) return; if (!/\.(xlsx|xls|csv)$/i.test(f.name)) { setBulk({ stage: 'upload', file: f.name, rows: [], err: ['Formato no admitido: sube un archivo .xlsx o .csv.'], warn: [] }); return; }
      setBulk({ stage: 'upload', file: f.name, rows: [], err: [], warn: [], leyendo: true });
      leerArchivo(f).then(function (res) { setBulk(res.err.length ? { stage: 'upload', file: f.name, rows: [], err: res.err, warn: [] } : { stage: 'preview', file: f.name, rows: res.rows, err: [], warn: res.warn }); }, function () { setBulk({ stage: 'upload', file: f.name, rows: [], err: ['No se pudo leer el archivo. Revisa que no esté protegido o dañado.'], warn: [] }); }); };
    var agregarOk = function () { set(lista.concat(ok.map(function (z, i) { return Object.assign({ id: 'q' + Date.now() + '-' + i }, z.x); }))); setBulk(null); };
    var bulkBody = function () { if (!bulk) return null;
      if (bulk.stage === 'upload') return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        (bulk.err || []).length ? h('div', { role: 'alert', style: { display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--alert-danger-bg, #FDECEA)', color: 'var(--alert-danger-fg, #9E1B0E)' } }, h('strong', null, 'No se pudo cargar ' + bulk.file), bulk.err.map(function (t, i) { return h('span', { key: i }, t); })) : null,
        h('ol', { style: { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, color: 'var(--text-body)' } }, h('li', null, 'Descarga la plantilla: trae listas de categoría, tipo, marca y modelo (hoja «Catálogos»).'), h('li', null, 'Completa una fila por equipo; las columnas se leen por su encabezado, en cualquier orden.'), h('li', null, 'Sube el archivo (.xlsx o .csv, hasta 200 equipos) y revisa la vista previa.')),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 } }, B('secondary', tpl && tpl.busy ? 'Generando plantilla…' : 'Descargar plantilla', function () { if (tpl && tpl.busy) return; setTpl({ busy: true }); plantilla().then(function (n) { setTpl({ ok: n }); }, function () { setTpl({ err: 'No se pudo generar la plantilla. Revisa tu conexión e inténtalo de nuevo.' }); }); }),
          B('primary', bulk.leyendo ? 'Leyendo archivo…' : 'Subir archivo', function () { if (fileRef.current) fileRef.current.click(); }),
          tpl && (tpl.ok || tpl.err) ? h('span', { role: 'status', style: { fontSize: 14, color: tpl.err ? 'var(--color-danger)' : 'var(--text-muted)' } }, tpl.err || 'Descargada: ' + tpl.ok) : null));
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } }, h('strong', { style: { fontSize: 15, color: 'var(--text-strong)' } }, bulk.file), NS.Badge ? h(NS.Badge, { tone: 'success' }, ok.length === 1 ? '1 fila válida' : ok.length + ' filas válidas') : null, bad.length && NS.Badge ? h(NS.Badge, { tone: 'danger' }, bad.length === 1 ? '1 fila con error' : bad.length + ' filas con errores') : null),
        (bulk.warn || []).length ? h('div', { role: 'status', style: { fontSize: 14, color: 'var(--text-muted)' } }, bulk.warn.join(' · ')) : null,
        h('div', { tabIndex: 0, role: 'region', 'aria-label': 'Vista previa de la carga', style: { overflowX: 'auto', maxHeight: 360, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' } },
          h('table', { style: { width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14 } },
            h('thead', null, h('tr', null, ['Fila', 'Equipo', 'Serie', 'Suma asegurada', 'Implementos', 'Estado'].map(function (t, i) { return h('th', { key: i, scope: 'col', style: { position: 'sticky', top: 0, textAlign: i === 3 || i === 4 ? 'right' : 'left', padding: '8px 10px', background: 'var(--surface-subtle)', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, t); }))),
            h('tbody', null, revisadas.map(function (z) { var x = z.x; return h('tr', { key: z.r.fila, style: { background: z.msg ? 'var(--alert-danger-bg, #FDECEA)' : 'transparent' } },
              h('td', { style: { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)' } }, String(z.r.fila)),
              h('td', { style: { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)' } }, h('strong', { style: { display: 'block', color: 'var(--text-strong)' } }, [x.marca, x.modelo].filter(Boolean).join(' ') || '—'), h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, [tipoTxt(x), x.anio].filter(Boolean).join(' · '))),
              h('td', { style: { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, x.serie || '—'),
              h('td', { style: { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right', whiteSpace: 'nowrap' } }, x.suma > 0 ? usd(x.suma) : '—'),
              h('td', { style: { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right', whiteSpace: 'nowrap' } }, x.implementos.length ? x.implementos.length + ' · ' + usd(x.implementos.reduce(function (s, i) { return s + i.valor; }, 0)) : '—'),
              h('td', { style: { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', minWidth: 220 } }, z.msg ? h('span', { style: { color: 'var(--color-danger)', fontWeight: 600 } }, 'Fila ' + z.r.fila + ': ' + z.msg) : h('span', { style: { color: z.aviso ? 'var(--color-warning-strong, #8a5a00)' : 'var(--color-success)', fontWeight: 600 } }, z.aviso || 'Lista para agregar'))); })))),
        bad.length ? h('span', { style: { fontSize: 14, color: 'var(--text-body)' } }, 'Solo se agregarán las filas válidas; corrige las demás en el archivo y vuelve a subirlo.') : null); };
    var bulkFooter = !bulk ? null : h(R.Fragment, null, B('ghost', 'Cancelar', function () { setBulk(null); }), bulk.stage === 'preview' ? B('secondary', 'Subir otro archivo', function () { if (fileRef.current) fileRef.current.click(); }) : null,
      bulk.stage === 'preview' ? B('primary', ok.length === 1 ? 'Agregar 1 equipo' : 'Agregar ' + ok.length + ' equipos', agregarOk, ok.length ? {} : { unavailableReason: 'No hay filas válidas para agregar' }) : null);
    var modal = window.SiriusModal ? h(window.SiriusModal, { open: !!bulk, onClose: function () { setBulk(null); }, size: 'lg', align: 'left', title: 'Carga masiva de equipos', description: bulk && bulk.stage === 'preview' ? 'Revisa la vista previa. Las columnas se reconocieron por su encabezado.' : 'Agrega muchos equipos a este caso con un archivo Excel.', footer: bulkFooter }, bulkBody())
      : bulk ? h('div', { role: 'dialog', 'aria-label': 'Carga masiva de equipos', style: { padding: 16, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' } }, bulkBody(), h('div', { style: { display: 'flex', gap: 8, marginTop: 12 } }, bulkFooter)) : null;

    // ---------- lista ----------
    var editTip = form ? 'Guarda o cancela primero' : '';
    var tot = lista.reduce(function (s, x) { return s + total(x); }, 0);
    var tarjetas = lista.map(function (x, i) { var on = form && form.editId === x.id, aviso = x.serie && !pinValido(x.serie);
      return h('li', { key: x.id, style: { display: 'grid', gridTemplateColumns: '32px minmax(0,1.4fr) minmax(0,1fr) auto auto', alignItems: 'center', gap: 16, padding: '12px 16px', border: on ? '2px solid var(--color-brand)' : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: on ? 'var(--color-brand-wash)' : '#FFFFFF' } },
        h('span', { 'aria-hidden': 'true', style: { width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--surface-subtle)', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, String(i + 1)),
        h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 } }, h('span', { style: { fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, x.marca + ' ' + x.modelo), h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, tipoTxt(x) + ' · ' + x.anio + ' · Serie ' + x.serie + (x.motor ? ' · Motor ' + x.motor : '')), aviso ? h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--color-warning-strong, #8a5a00)' } }, 'Serie sin formato PIN · se acepta con aviso') : null),
        h('span', { style: { fontSize: 14, color: 'var(--text-body)' } }, x.implementos.length ? x.implementos.length + (x.implementos.length === 1 ? ' implemento' : ' implementos') + ' · ' + usd(x.implementos.reduce(function (s, im) { return s + (Number(im.valor) || 0); }, 0)) : 'Sin implementos'),
        h('span', { style: { fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', textAlign: 'right' } }, usd(total(x))),
        h('span', { style: { display: 'flex', gap: 12 } }, on ? h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--cyan-700)' } }, 'En edición') : [
          h('button', { key: 'e', type: 'button', 'aria-label': 'Editar ' + x.marca + ' ' + x.modelo + ' (serie ' + x.serie + ')', 'aria-disabled': form ? 'true' : undefined, title: editTip || undefined, onClick: function () { if (!form) abrir(x); }, style: { border: 'none', background: 'transparent', padding: 0, cursor: form ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: form ? 'var(--neutral-400)' : 'var(--text-link)', textDecoration: 'underline' } }, 'Editar'),
          h('button', { key: 'q', type: 'button', 'aria-label': 'Quitar ' + x.marca + ' ' + x.modelo + ' (serie ' + x.serie + ')', 'aria-disabled': form ? 'true' : undefined, title: editTip || undefined, onClick: function () { if (!form) set(lista.filter(function (y) { return y.id !== x.id; })); }, style: { border: 'none', background: 'transparent', padding: 0, cursor: form ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: form ? 'var(--neutral-400)' : 'var(--color-danger)', textDecoration: 'underline' } }, 'Quitar')])); });
    var errSec = props.mostrarErrores && !form && !lista.length ? 'Agrega al menos un equipo' : props.mostrarErrores && form ? 'Guarda o cancela el equipo en edición' : '';
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      h('section', { 'aria-labelledby': 'nse-h', style: { display: 'flex', flexDirection: 'column', gap: 14, padding: 24, border: '1px solid ' + (errSec ? 'var(--color-danger)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', background: '#FFFFFF' } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, h('h2', { id: 'nse-h', style: { margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' } }, 'Equipos'), NS.Badge ? h(NS.Badge, { tone: 'neutral' }, h('span', { style: { whiteSpace: 'nowrap' } }, lista.length === 1 ? '1 equipo' : lista.length + ' equipos')) : null),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, B('secondary', 'Cargar desde Excel', function () { if (form) return; cargar(XLSX_URL, 'XLSX').catch(function () {}); setTpl(null); setBulk({ stage: 'upload', file: '', rows: [], err: [], warn: [] }); }, form ? { unavailableReason: editTip } : {}),
            h('span', { id: 'nse-add-w', style: { display: 'inline-flex' } }, B('primary', 'Agregar equipo', function () { if (!form) abrir(null); }, form ? { unavailableReason: editTip, id: 'nse-add' } : { id: 'nse-add' })))),
        errSec ? h('span', { role: 'alert', style: { fontSize: 14, fontWeight: 700, color: 'var(--color-danger)' } }, errSec) : null,
        lista.length ? h('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, tarjetas)
          : !form ? h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 16px', textAlign: 'center' } }, h('img', { src: 'assets/empty-state.png', alt: '', style: { width: 150, height: 'auto' } }), h('p', { style: { margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' } }, 'Aún no agregas equipos'), h('p', { style: { margin: 0, fontSize: 15, color: 'var(--text-muted)' } }, 'Agrégalos uno por uno o cárgalos desde un archivo de Excel.')) : null,
        lista.length ? h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 8, fontSize: 15, color: 'var(--text-body)' } }, 'Total del caso: ', h('strong', { style: { color: 'var(--text-strong)' } }, usd(tot))) : null),
      form ? formulario() : null,
      h('input', { type: 'file', ref: fileRef, accept: '.xlsx,.xls,.csv', 'aria-hidden': 'true', tabIndex: -1, onChange: onFile, style: { display: 'none' } }),
      modal);
  }
  SiriusEquiposSolicitud.errores = errores; SiriusEquiposSolicitud.total = total; SiriusEquiposSolicitud.leer = leer; SiriusEquiposSolicitud.revisar = revisar; SiriusEquiposSolicitud.tipoTxt = tipoTxt; SiriusEquiposSolicitud.OTRO = OTRO;
  window.SiriusEquiposSolicitud = SiriusEquiposSolicitud;
})();
