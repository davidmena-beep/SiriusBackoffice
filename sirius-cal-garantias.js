// SIRIUS · Calificación con garantías: nueva distribución (v1.0 · etapa P-6g-2b · DEC-250, propuesta aprobada SIRIUS_propuesta_calificacion_garantias.png).
// La dibuja Calificacion.dc.html (modos n1, n2 y veh, un solo riesgo) con su propio estado y sus reglas: barra de decisión en una línea (veredicto,
// plazo global, fecha límite, próximo vencimiento y facultad), la tabla de garantías como protagonista (origen, texto para el asegurado en línea,
// plazo con «vence», prioridad, estado y «⋯» con Quitar con motivo y Ver historial; lo quitado queda tachado con «↺ Deshacer» hasta grabar), pie fijo y
// el panel de contexto a la derecha (Recomendaciones del inspector, Resumen del informe, Evidencias, Puntaje y controles), que se pliega a una franja
// de 52 px. El estado del panel (plegado y secciones abiertas) se recuerda por usuario en este navegador.
// Fechas: plazo global = el mayor de los plazos (se puede escribir uno mayor); fecha límite = la de la garantía que vence más tarde (para el endoso);
// próximo vencimiento = la más próxima de las abiertas (para el seguimiento).
(function () {
  const h = (...a) => React.createElement(...a), NS = () => window.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const z = (n) => String(n).padStart(2, '0');
  const fecha = (base, n) => { const p = String(base || '2026-10-16').split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2] + Number(n || 0)); return d; };
  const largo = (d) => z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear(), corto = (d) => z(d.getDate()) + '/' + z(d.getMonth() + 1);
  const CLAVE = (u) => 'sirius.cal.panel.' + String(u || 'usuario');
  const SEC = [['rec', 'Recomendaciones del inspector'], ['inf', 'Resumen del informe'], ['ev', 'Evidencias'], ['pun', 'Puntaje y controles']];
  const PANEL0 = { plegado: false, abiertas: { rec: true, inf: false, ev: true, pun: false } };
  const C = {};
  C.panelInicial = (usuario, preset) => { let x = null; try { x = JSON.parse(window.localStorage.getItem(CLAVE(usuario)) || 'null'); } catch (e) { x = null; }
    const b = JSON.parse(JSON.stringify(PANEL0)); if (x && typeof x === 'object') { b.plegado = !!x.plegado; Object.assign(b.abiertas, x.abiertas || {}); }
    if (preset === 'g250-plegada') b.plegado = true; else if (preset === 'g250-nueva') b.plegado = false; return b; }; /* las escenas calgarplegada y calgarnueva fijan el panel; las demás usan lo recordado */
  C.guardarPanel = (usuario, v) => { try { window.localStorage.setItem(CLAVE(usuario), JSON.stringify(v)); } catch (e) { /* sin almacenamiento: vale para esta vista */ } };
  const ORIGEN_TONO = { Inspector: 'brand', Calificador: 'teal', 'Nivel 2': 'warning' };
  const TONO_EST = { Pendiente: 'warning', Cumplido: 'success', Vencido: 'danger' };
  const cat = () => ((window.SIRIUS_EJEMPLO || {}).catalogoSeguimientos || []).filter((x) => x.tipo === 'Garantía');
  C.codigo = (x) => x.codigo || (cat().find((c) => c.titulo === x.desc) || {}).codigo || '';
  C.prioridad = (x) => x.prioridad || (cat().find((c) => c.titulo === x.desc) || {}).prioridad || 'Media';
  C.origen = (x, isN2) => x.origen || (x.added ? (isN2 ? 'Nivel 2' : 'Calificador') : 'Inspector');
  // El texto para el asegurado crece hasta 3 líneas; desde ahí, se desplaza.
  const auto = (el) => { if (!el) return; el.style.height = 'auto'; const lh = parseFloat(getComputedStyle(el).lineHeight) || 19, max = lh * 3 + 14; el.style.height = Math.min(el.scrollHeight + 2, max) + 'px'; };
  const btn = (variant, label, onClick, o) => { const B = NS().Button; o = o || {}; return B ? h(B, Object.assign({ key: o.key || label, variant, size: o.size || 'md', onClick, disabled: o.disabled, 'aria-label': o.aria }, o.extra || {}), label) : h('button', { key: o.key || label, type: 'button', onClick }, label); };
  const badge = (label, tone, key) => { const B = NS().Badge; return B ? h(B, { key, tone: tone || 'neutral' }, h('span', { style: { whiteSpace: 'nowrap' } }, label)) : h('span', { key }, label); };
  const svg = (d) => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d }));
  const etiqueta = (t) => h('span', { style: { fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, t);
  const enlace = (label, onClick, o) => h('button', Object.assign({ type: 'button', onClick, className: 'cg-lk' }, o || {}), label);
  // ---------- Barra de decisión ----------
  C.barra = (k, v) => { const s = k.state, isVeh = v.isVeh;
    const seg = (opts, cur, pick, name) => h('div', { role: 'radiogroup', 'aria-label': name, 'aria-required': 'true', className: 'cg-seg', 'aria-invalid': v.errVer ? 'true' : undefined },
      opts.map((o) => h('label', { key: o[0], className: 'cg-seg-op' + (cur === o[0] ? ' cg-on' + (o[2] ? ' cg-no' : '') : '') }, h('input', { type: 'radio', name, value: o[0], checked: cur === o[0], onChange: () => pick(o[0]), className: 'cg-sr' }), cur === o[0] ? (o[2] ? '✕ ' : '✓ ') : '', o[1])));
    const items = [h('div', { key: 'ver', className: 'cg-bitem' }, etiqueta('Veredicto'), isVeh ? seg([['si', 'Asegurable'], ['no', 'No asegurable', true]], s.veredicto, (x) => k.setState({ veredicto: x }), 'veredicto') : seg([['Aprobado', 'Aprobado'], ['No aprobado', 'No aprobado', true]], s.estado, (x) => k.setState({ estado: x }), 'estadoAprob'))];
    if (isVeh && s.veredicto === 'si') items.push(h('div', { key: 'cob', className: 'cg-bitem' }, h('label', { htmlFor: 'cal-cob' }, etiqueta('Cobertura')), h('select', { id: 'cal-cob', className: 'cg-sel', value: s.cobertura, onChange: (e) => k.setState({ cobertura: e.target.value }), 'aria-invalid': v.show('cob') ? 'true' : undefined }, h('option', { value: '' }, 'Selecciona'), k.coberturas.map((c) => h('option', { key: c, value: c }, c)))));
    if (!isVeh && s.estado !== 'No aprobado') items.push(
      h('div', { key: 'pl', className: 'cg-bitem' }, h('label', { htmlFor: 'cal-plazo' }, etiqueta('Plazo global')), h('div', { className: 'cg-bfila' }, h('input', { id: 'cal-plazo', className: 'cg-num', type: 'number', inputMode: 'numeric', min: v.PC ? Math.max(1, v.PC.max) : 1, max: 365, value: v.plazoG, onChange: (e) => k.setState({ plazoG: e.target.value }), onBlur: () => k.touch('plazo'), 'aria-invalid': v.plazoErr ? 'true' : undefined, 'aria-describedby': 'cg-plazo-h', title: 'El mayor de los plazos de las garantías; puedes escribir uno mayor' }), h('span', { style: { fontSize: 14 } }, 'días'))),
      h('div', { key: 'fl', className: 'cg-bitem', title: 'La de la garantía que vence más tarde: va en el endoso' }, etiqueta('Fecha límite'), h('strong', { 'data-cg-limite': '1', className: 'cg-fecha' }, v.limite)),
      h('div', { key: 'pv', className: 'cg-bitem', title: 'La más próxima de las garantías: marca el seguimiento' }, etiqueta('Próximo vencimiento'), h('strong', { 'data-cg-proximo': '1', className: 'cg-fecha' }, v.proximo)));
    items.push(h('span', { key: 'fac', className: 'cg-fac', 'data-cg-facultad': '1' }, v.facultad));
    return h('div', { key: 'barra', className: 'cg-barra', role: 'group', 'aria-label': 'Decisión de la calificación' }, items,
      v.plazoErr ? h('span', { key: 'pe', id: 'cg-plazo-h', role: 'alert', className: 'cg-err', style: { flexBasis: '100%' } }, v.plazoErrTxt) : null); };
  // ---------- Tabla de garantías ----------
  C.tabla = (k, v) => { const s = k.state, isN2 = v.isN2, g = s.items.garantias, q = s.removed.garantias || [], ed = s.cgEd || {}, menu = s.cgMenu, hist = s.cgHist;
    const tuya = isN2 ? 'Nivel 2' : 'Calificador', n = (o) => g.filter((x) => C.origen(x, isN2) === o).length;
    const cab = h('div', { className: 'cg-gcab' }, h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }, h('h3', { id: 'cg-gar-t', className: 'cg-h3' }, 'Garantías'),
      badge(g.length + ' de ' + (g.length + q.length), 'neutral', 'nm'), n('Inspector') ? badge(n('Inspector') + ' del inspector', 'brand', 'in') : null, isN2 && n('Calificador') ? badge(n('Calificador') + ' del calificador', 'teal', 'ca') : null,
      n(tuya) ? badge(n(tuya) + (n(tuya) === 1 ? ' tuya' : ' tuyas'), isN2 ? 'warning' : 'teal', 'tu') : null, !isN2 && n('Nivel 2') ? badge(n('Nivel 2') + ' del nivel 2', 'warning', 'n2') : null),
      btn('secondary', '＋ Del catálogo', () => k.setState({ cat: 'garantias', catSearch: '', catSel: [] }), { size: 'sm', aria: 'Agregar garantías del catálogo de ' + (k.props.ramo || 'el ramo') }));
    const nota = h('p', { className: 'cg-nota' }, h('strong', null, k.props.ramo || 'Ramo'), ' · plazo de la matriz por título; la fecha límite del caso es la de la garantía que vence más tarde (plazo global = el mayor).');
    const th = (t, w, cls) => h('th', { key: t, scope: 'col', style: w ? { width: w } : null, className: cls }, t);
    const filas = []; g.forEach((x, i) => { const o = C.origen(x, isN2), d = fecha(k.props.baseDate, Number(x.plazo) || 0), falta = v.PC && v.PC.falta.includes(x), id = x.id;
      filas.push(h('tr', { key: id, 'data-cg-fila': id, className: menu === id ? 'cg-act' : '' },
        h('td', { className: 'cg-n' }, String(i + 1)),
        h('td', null, h('div', { className: 'cg-tit' }, x.desc), h('div', { className: 'cg-sub' }, (C.codigo(x) || 'Sin código') + ' · ', h('span', { className: 'cg-or cg-or-' + (ORIGEN_TONO[o] || 'neutral'), 'data-cg-origen': o }, o))),
        h('td', null, h('textarea', { className: 'cg-txt', 'aria-label': 'Texto para el asegurado de ' + x.desc, rows: 1, ref: auto, onInput: (e) => auto(e.target), value: x.obs || '', placeholder: 'Qué debe hacer el asegurado', onChange: (e) => k.setItem('garantias', id, { obs: e.target.value }) })),
        h('td', null, h('input', { className: 'cg-num cg-num-s', type: 'number', inputMode: 'numeric', min: 1, max: 365, value: x.plazo == null ? '' : String(x.plazo), 'aria-label': 'Plazo de ' + x.desc + ' (días)', 'aria-invalid': falta ? 'true' : undefined, onChange: (e) => k.setItem('garantias', id, { plazo: e.target.value }) }),
          h('div', { className: 'cg-vence' }, falta ? h('span', { className: 'cg-err' }, 'Falta el plazo') : 'vence ' + corto(d))),
        h('td', { className: 'cg-pr' }, C.prioridad(x)),
        h('td', null, badge(x.estado || 'Pendiente', TONO_EST[x.estado || 'Pendiente'], 'e')),
        h('td', { className: 'cg-mas' }, h('div', { style: { position: 'relative' } }, h('button', { type: 'button', className: 'cg-dots', 'aria-haspopup': 'menu', 'aria-expanded': menu === id ? 'true' : 'false', 'aria-label': 'Más acciones de ' + x.desc, onClick: () => k.setState({ cgMenu: menu === id ? null : id }) }, '⋯'),
          menu === id ? h('div', { role: 'menu', className: 'cg-menu' }, h('button', { type: 'button', role: 'menuitem', onClick: () => k.setState({ cgMenu: null, cgEd: { id, motivo: '' } }) }, 'Quitar con motivo'), h('button', { type: 'button', role: 'menuitem', onClick: () => k.setState({ cgMenu: null, cgHist: hist === id ? null : id }) }, hist === id ? 'Ocultar historial' : 'Ver historial')) : null))));
      if (ed.id === id) filas.push(h('tr', { key: id + '-q', className: 'cg-qrow' }, h('td', null), h('td', { colSpan: 6 }, h('div', { className: 'cg-qbox' }, h('label', { htmlFor: 'cg-mot-' + id, className: 'cg-lbl' }, 'Motivo para quitar «' + x.desc + '»'),
        h('input', { id: 'cg-mot-' + id, className: 'cg-in', value: ed.motivo, autoFocus: true, placeholder: 'Ej. ya existe, verificada en las fotos 12 y 13', onChange: (e) => k.setState({ cgEd: { id, motivo: e.target.value, tried: false } }), 'aria-invalid': ed.tried && String(ed.motivo).trim().length < 3 ? 'true' : undefined }),
        ed.tried && String(ed.motivo).trim().length < 3 ? h('span', { role: 'alert', className: 'cg-err' }, 'Escribe por qué se quita.') : null,
        h('div', { style: { display: 'flex', gap: 8 } }, btn('primary', 'Quitar', () => { if (String(ed.motivo).trim().length < 3) return k.setState({ cgEd: Object.assign({}, ed, { tried: true }) }); k.quitarCon(id, String(ed.motivo).trim()); }, { size: 'sm' }), btn('ghost', 'Cancelar', () => k.setState({ cgEd: {} }), { size: 'sm' }))))));
      if (hist === id) filas.push(h('tr', { key: id + '-h', className: 'cg-hrow' }, h('td', null), h('td', { colSpan: 6 }, h('ul', { className: 'cg-hist' }, (v.historial(x) || []).map((y, j) => h('li', { key: j }, y))))));
    });
    q.forEach((x) => filas.push(h('tr', { key: 'q-' + x.id, className: 'cg-quitada', 'data-cg-quitada': x.id },
      h('td', { className: 'cg-n' }, '—'), h('td', null, h('div', { className: 'cg-tit cg-tach' }, x.desc), h('div', { className: 'cg-sub cg-tach' }, (C.codigo(x) || 'Sin código') + ' · ' + C.origen(x, isN2))),
      h('td', null, h('div', { className: 'cg-tach cg-qmot' }, 'Quitada por ' + (isN2 ? 'el nivel 2' : 'el calificador') + (x.motivoQuita ? ': «' + x.motivoQuita + '»' : ''))), h('td', null, '—'), h('td', { className: 'cg-tach' }, C.prioridad(x)), h('td', null, badge('Quitada', 'neutral', 'q')),
      h('td', { className: 'cg-mas' }, h('button', { type: 'button', className: 'cg-dots', title: 'Deshacer', 'aria-label': 'Deshacer: volver a agregar ' + x.desc, onClick: () => k.restore('garantias', x.id) }, '↺')))));
    const tabla = h('div', { className: 'cg-tw' }, h('table', { className: 'cg-t', 'aria-labelledby': 'cg-gar-t' }, h('thead', null, h('tr', null, th('N.°', 32), th('Garantía', v.colGar), th('Texto para el asegurado', null), th('Plazo', 76), th('Prioridad', 70), th('Estado', 94), h('th', { key: 'm', style: { width: 36 } }, h('span', { className: 'cg-sr' }, 'Acciones')))),
      h('tbody', null, filas.length ? filas : h('tr', null, h('td', { colSpan: 7, className: 'cg-vacio' }, 'Sin garantías: el caso no tiene plazo. Agrégalas del catálogo o desde las recomendaciones.')))));
    return h('section', { key: 'gar', 'aria-labelledby': 'cg-gar-t', className: 'cg-sec' }, cab, nota, tabla); };
  // Documentos y preexistencias: compactos, debajo de las garantías.
  C.otros = (k, v) => ['documentos', 'preexistencias'].map((key) => { const rows = k.state.items[key] || [], t = k.titles[key];
    return h('details', { key, className: 'cg-otros', open: rows.length ? true : undefined }, h('summary', null, h('strong', null, t), ' (' + rows.length + ')'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0' } }, rows.map((x) => h('div', { key: x.id || x.desc, className: 'cg-orow' }, h('span', { style: { fontWeight: 600, minWidth: 180 } }, x.desc), h('input', { className: 'cg-in', 'aria-label': 'Observaciones de ' + x.desc, value: x.obs || '', onChange: (e) => k.setItem(key, x.id, { obs: e.target.value }) }), btn('ghost', 'Quitar', () => k.removeItem(key, x.id), { size: 'sm', aria: 'Quitar ' + x.desc, key: 'del' }))),
        h('div', null, btn('ghost', '＋ Agregar ' + t.toLowerCase(), () => k.setState({ cat: key, catSearch: '', catSel: [] }), { size: 'sm' })))); });
  // ---------- Panel de contexto ----------
  C.panel = (k, v) => { const s = k.state, P = s.panel || PANEL0, usu = k.props.usuario;
    const setP = (np) => { k.setState({ panel: np }); C.guardarPanel(usu, np); };
    const abrir = (id) => { const np = { plegado: false, abiertas: Object.assign({}, P.abiertas, { [id]: true }) }; setP(np); setTimeout(() => { const el = document.getElementById('cg-sec-' + id); if (el) { try { el.scrollIntoView({ block: 'nearest' }); } catch (e) { /* nada */ } const b = el.querySelector('button'); if (b) b.focus(); } }, 60); };
    const nFotos = v.evid.filter((e) => e.tipo === 'foto').length, nDocs = v.evid.filter((e) => e.tipo === 'doc').length, recs = v.recs;
    if (P.plegado) { const ic = (id, sym, label, cnt) => h('button', { key: id, type: 'button', className: 'cg-ic', 'data-cg-ic': id, 'aria-label': label + (cnt != null ? ' (' + cnt + ')' : '') + ': abrir el panel en esta sección', title: label, onClick: () => abrir(id) }, sym, cnt ? h('span', { className: 'cg-cnt' }, String(cnt)) : null);
      return h('aside', { className: 'cg-franja', 'aria-label': 'Panel de contexto plegado', 'data-cg-panel': 'plegado' }, ic('rec', svg('M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'), 'Recomendaciones del inspector', recs.length), ic('inf', svg('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h6'), 'Resumen del informe'), ic('ev', svg('M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'), 'Evidencias', nFotos), ic('pun', svg('M4 20V10 M10 20V4 M16 20v-7 M22 20H2'), 'Puntaje y controles'),
        h('button', { type: 'button', className: 'cg-ic', 'aria-label': 'Expandir el panel de contexto', title: 'Expandir el panel', onClick: () => setP({ plegado: false, abiertas: P.abiertas }) }, '«')); }
    const cuerpo = { rec: () => recs.length ? recs.map((r) => { const est = v.recEstado(r); return h('div', { key: r.id, className: 'cg-rec', 'data-cg-rec': r.id },
        h('div', null, h('strong', null, r.titulo), r.prioridad ? h('span', { style: { color: 'var(--text-body)' } }, ' · ' + r.prioridad) : null), r.texto ? h('div', { className: 'cg-quote' }, '«' + r.texto + '»') : null,
        est.tipo === 'es' ? h('div', { className: 'cg-ok' }, '✓ Es la garantía ' + est.n) : est.tipo === 'quitada' ? h('div', { className: 'cg-sub' }, 'Quitada por ti · ', enlace('Volver a agregar', () => k.restore('garantias', est.id))) : h('div', null, h('button', { type: 'button', className: 'cg-add', onClick: () => k.agregarRec(r) }, '＋ Agregar como garantía'))); }) : h('p', { className: 'cg-nota' }, k.props.motivoInspector && k.props.mode === 'veh' ? k.props.motivoInspector : 'El informe no trae recomendaciones.'),
      inf: () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, h('dl', { className: 'cg-dl' }, (v.informe.fields || []).map((f, i) => h('div', { key: i }, h('dt', null, f.label), h('dd', null, f.value)))),
        (v.informe.hallazgos || []).length ? h('ul', { className: 'cg-hall' }, v.informe.hallazgos.map((x, i) => h('li', { key: i }, x))) : h('p', { className: 'cg-nota' }, 'Sin hallazgos registrados.')),
      ev: () => v.evid.length ? h('div', null, h('div', { className: 'cg-thumbs' }, v.evid.slice(0, 8).map((e, i) => h('button', { key: i, type: 'button', className: 'cg-th', 'aria-label': 'Ampliar ' + e.titulo, onClick: () => k.setState({ viewer: i }) }, e.src ? h('img', { src: e.src, alt: '', loading: 'lazy' }) : h('span', null, e.tipo === 'doc' ? 'DOC' : e.tipo === 'video' ? 'VIDEO' : 'FOTO')))),
        h('div', { style: { paddingTop: 8 } }, enlace('Ver todas en el visor ›', () => k.setState({ viewer: 0 })))) : h('p', { className: 'cg-nota' }, 'Sin evidencias en el informe.'),
      pun: () => { const F = (v.informe.fields || []).filter((f) => /puntaje|score|control|calificaci/i.test(f.label)); return F.length ? h('dl', { className: 'cg-dl' }, F.map((f, i) => h('div', { key: i }, h('dt', null, f.label), h('dd', null, f.value)))) : h('p', { className: 'cg-nota' }, 'El informe no trae puntaje ni controles automáticos.'); } };
    const cnt = { rec: recs.length || (k.props.mode === 'veh' && k.props.motivoInspector ? 1 : 0), ev: nFotos + ' fotos · ' + nDocs + ' doc.' };
    return h('aside', { className: 'cg-panel', 'aria-label': 'Panel de contexto', 'data-cg-panel': 'expandido' },
      h('div', { className: 'cg-pcab' }, h('span', { style: { fontWeight: 700, color: 'var(--text-strong)' } }, 'Contexto del caso'), h('button', { type: 'button', className: 'cg-lk', 'data-cg-plegar': '1', onClick: () => setP({ plegado: true, abiertas: P.abiertas }) }, '» Plegar el panel')),
      SEC.map(([id, t]) => { const ab = !!P.abiertas[id]; return h('section', { key: id, id: 'cg-sec-' + id, className: 'cg-psec', 'data-cg-sec': id },
        h('button', { type: 'button', className: 'cg-psec-b', 'aria-expanded': ab ? 'true' : 'false', 'aria-controls': 'cg-cuerpo-' + id, onClick: () => setP({ plegado: false, abiertas: Object.assign({}, P.abiertas, { [id]: !ab }) }) },
          h('span', null, t, cnt[id] != null ? h('span', { className: 'cg-pill' }, String(cnt[id])) : null), h('span', { 'aria-hidden': 'true', className: 'cg-car' }, ab ? '▾' : '▸')),
        ab ? h('div', { id: 'cg-cuerpo-' + id, className: 'cg-pbody' }, cuerpo[id]()) : null); })); };
  // ---------- Página completa ----------
  C.render = (k, v) => { const s = k.state, isVeh = v.isVeh, noAprob = !isVeh && s.estado === 'No aprobado';
    const motivoNo = noAprob ? h('div', { key: 'mot', className: 'cg-motno' }, h('label', { htmlFor: 'cal-mot-no', className: 'cg-lbl' }, 'Motivo de no aprobación (catálogo) ', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, '*')),
      h('select', { id: 'cal-mot-no', className: 'cg-sel', required: true, value: s.motivo, onChange: (e) => k.setState({ motivo: e.target.value }), onBlur: () => k.touch('mot'), 'aria-invalid': v.show('mot') ? 'true' : undefined, style: { maxWidth: 420 } }, h('option', { value: '' }, 'Selecciona el motivo'), v.motivosNo.map((m) => h('option', { key: m, value: m }, m))),
      v.show('mot') ? h('span', { role: 'alert', className: 'cg-err' }, 'Selecciona el motivo de no aprobación.') : h('span', { className: 'cg-nota' }, 'Con «No aprobado» no se definen garantías.')) : null;
    const vehMot = isVeh && s.veredicto === 'no' ? h('div', { key: 'vm', className: 'cg-motno' }, h('label', { htmlFor: 'cal-mot', className: 'cg-lbl' }, 'Motivo de rechazo ', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, '*')),
      h('select', { id: 'cal-mot', className: 'cg-sel', value: s.motivo, onChange: (e) => k.setState({ motivo: e.target.value }), onBlur: () => k.touch('mot'), 'aria-invalid': v.show('mot') ? 'true' : undefined, style: { maxWidth: 420 } }, h('option', { value: '' }, 'Selecciona'), k.rechazos.map((m) => h('option', { key: m, value: m }, m))),
      v.show('mot') ? h('span', { role: 'alert', className: 'cg-err' }, 'Selecciona el motivo de rechazo.') : null) : null;
    const resp = !isVeh ? h('div', { className: 'cg-bitem' }, h('label', { htmlFor: 'cal-resp' }, etiqueta('Ejecutivo responsable')), h('select', { id: 'cal-resp', className: 'cg-sel', value: s.responsable, onChange: (e) => k.setState({ responsable: e.target.value }), onBlur: () => k.touch('resp'), 'aria-invalid': v.show('resp') ? 'true' : undefined }, h('option', { value: '' }, 'Selecciona'), v.responsables.map((r) => h('option', { key: r, value: r }, r))), v.show('resp') ? h('span', { role: 'alert', className: 'cg-err' }, 'Selecciona el ejecutivo responsable.') : null) : null;
    const obs = h('div', { key: 'obs', className: 'cg-obs' }, h('div', { style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' } }, h('label', { htmlFor: 'cal-obs' }, etiqueta('Observación general'), h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')), resp),
      h('textarea', { id: 'cal-obs', className: 'cg-ta', rows: 2, value: s.obs, onChange: (e) => k.setState({ obs: e.target.value }), onBlur: () => k.touch('obs'), 'aria-invalid': v.show('obs') ? 'true' : undefined }),
      v.show('obs') ? h('span', { role: 'alert', className: 'cg-err' }, 'Escribe la observación general de la calificación.') : null,
      v.showDerivar ? h('label', { className: 'cg-chk' }, h('input', { type: 'checkbox', checked: !!s.derivar, onChange: () => k.setState({ derivar: !s.derivar }) }), ' Requerir evaluación de suscripción', h('span', { className: 'cg-nota' }, ' · el caso pasa a «En suscripción»')) : null);
    const alertas = [v.danos ? h('div', { key: 'dn', id: 'cal-danos', role: 'alert', className: 'cg-alert' }, h('strong', null, v.danos.txt), h('span', null, v.danos.sub), btn('secondary', 'Revisar daños', v.danos.abrir, { size: 'sm' })) : null,
      v.aviso ? h('div', { key: 'av', 'data-aviso-admin': '', role: 'status', className: 'cg-alert cg-info' }, v.aviso) : null, v.n1 ? h('div', { key: 'n1', className: 'cg-n1' }, h('strong', null, 'Nivel 1 · ' + v.n1.estado), ' · ' + (v.n1.obs || '') + ' · ' + (v.n1.user || '')) : null,
      isVeh ? h('div', { key: 'mi', 'data-cal-motivo': '', className: 'cg-n1' }, h('span', { className: 'cg-nota' }, (k.props.motivoTitulo || 'Motivo del inspector') + ': '), h('strong', null, k.props.motivoInspector || '—')) : null].filter(Boolean);
    const pie = h('div', { key: 'pie', className: 'cg-pie', 'data-cg-pie': '1' }, h('span', { className: 'cg-pie-t' }, v.pieTxt, v.pendiente ? h('span', { className: 'cg-nota', style: { marginLeft: 10 } }, v.pendiente) : null, s.cgBorrador ? h('span', { className: 'cg-nota', role: 'status', style: { marginLeft: 10 } }, 'Borrador guardado · ' + s.cgBorrador) : null),
      h('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap', marginLeft: 'auto' } }, btn('secondary', 'Guardar borrador', v.borrador, { key: 'bo', size: 'sm' }), btn('primary', v.primaryLabel, v.grabar, { key: 'gr', size: 'sm' })));
    const main = h('div', { className: 'cg-main' }, h('form', { ref: v.formRef, 'aria-label': v.formLabel, noValidate: true, onSubmit: (e) => { e.preventDefault(); v.grabar(); }, className: 'cg-card' },
      C.barra(k, v), alertas.length ? h('div', { className: 'cg-pad', style: { display: 'flex', flexDirection: 'column', gap: 10 } }, alertas) : null,
      h('div', { className: 'cg-pad cg-cuerpo' }, isVeh ? vehMot : noAprob ? motivoNo : [C.tabla(k, v), h('div', { key: 'ot', style: { display: 'flex', gap: 24, flexWrap: 'wrap' } }, C.otros(k, v))], obs), pie));
    const P = s.panel || PANEL0;
    return h('div', { className: 'cg-root' + (P.plegado ? ' cg-pleg' : ''), 'data-cg-root': '1', style: { '--cg-top': k.props.stickyTop || '16px' } }, h('style', null, CSS), main, C.panel(k, v)); };
  const CSS = `.cg-root{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:12px;align-items:start;font-family:var(--font-brand);min-width:0}
.cg-root.cg-pleg{grid-template-columns:minmax(0,1fr) 52px}
.cg-main{min-width:0}.cg-card{display:flex;flex-direction:column;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:#FFFFFF;margin:0;min-width:0}
.cg-barra{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px 14px;padding:10px 16px 12px;border-bottom:1px solid var(--border-subtle)}
.cg-bitem{display:flex;flex-direction:column;align-items:flex-start;gap:4px}.cg-bfila{display:flex;align-items:center;gap:6px}
.cg-seg{display:inline-flex;border:1.5px solid var(--border-default);border-radius:var(--radius-sm);overflow:hidden}
.cg-seg-op{display:flex;align-items:center;gap:4px;height:36px;padding:0 10px;font-size:15px;font-weight:700;color:var(--text-body);cursor:pointer;background:#FFFFFF}
.cg-seg-op+.cg-seg-op{border-left:1.5px solid var(--border-default)}.cg-seg-op:focus-within{outline:2px solid var(--color-brand);outline-offset:-2px}
.cg-seg-op.cg-on{background:var(--color-success-bg);color:var(--color-success)}.cg-seg-op.cg-on.cg-no{background:var(--alert-danger-bg,#FDECEA);color:var(--color-danger)}
.cg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0;padding:0}
.cg-num{width:72px;height:38px;padding:0 8px;border:1.5px solid var(--input-outlined-border);border-radius:var(--radius-sm);font:inherit;font-size:15px;text-align:right;color:var(--text-strong)}
.cg-num-s{width:64px;height:34px}.cg-num[aria-invalid=true],.cg-sel[aria-invalid=true],.cg-ta[aria-invalid=true],.cg-in[aria-invalid=true]{border-color:var(--color-danger)}
.cg-fecha{display:flex;align-items:center;height:36px;font-size:15px;color:var(--text-strong);white-space:nowrap}
.cg-fac{margin-left:auto;align-self:center;max-width:116px;padding:4px 8px;border-radius:10px;background:var(--color-success-bg);color:var(--color-success);font-size:11.5px;font-weight:700;line-height:1.3;text-align:center}
.cg-pad{padding:12px 16px 0}.cg-cuerpo{display:flex;flex-direction:column;gap:16px;padding-bottom:16px}
.cg-sec{display:flex;flex-direction:column;gap:6px;min-width:0}.cg-gcab{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.cg-h3{margin:0;font-size:18px;font-weight:700;color:var(--text-strong)}.cg-nota{margin:0;font-size:13px;color:var(--text-muted)}
.cg-tw{border:1px solid var(--border-subtle);border-radius:var(--radius-sm);overflow-x:auto;max-width:100%}
.cg-t{width:100%;min-width:640px;table-layout:fixed;border-collapse:collapse;font-size:14px;color:var(--text-body)}
.cg-t th{padding:8px;text-align:left;font-size:13px;font-weight:700;color:var(--text-strong);background:var(--table-row-hover);white-space:nowrap}
.cg-t td{padding:8px 6px;border-top:1px solid var(--border-subtle);vertical-align:top}
.cg-n{color:var(--text-muted)}.cg-tit{font-weight:700;color:var(--text-strong);line-height:1.3}.cg-sub{font-size:12px;color:var(--text-muted);margin-top:3px;line-height:1.5}
.cg-or{display:inline-block;padding:0 7px;border-radius:999px;font-weight:700;font-size:11.5px}.cg-or-brand{background:var(--cyan-100,#E0F4FB);color:var(--cyan-800,#00577A)}.cg-or-teal{background:#E6F4F1;color:#0E6B5C}.cg-or-warning{background:var(--alert-warning-bg,#FFF4DC);color:var(--alert-warning-fg,#7A5200)}
.cg-txt{width:100%;resize:none;border:1px solid transparent;border-radius:var(--radius-sm);background:var(--surface-subtle);padding:6px 8px;font:inherit;font-size:13px;line-height:1.4;color:var(--text-strong);max-height:calc(1.4em * 3 + 14px);overflow-y:auto}
.cg-txt:hover{border-color:var(--border-default)}.cg-txt:focus{outline:none;border-color:var(--color-brand);background:#FFFFFF;box-shadow:0 0 0 3px var(--cyan-100)}
.cg-vence{font-size:12px;color:var(--text-muted);margin-top:4px;white-space:nowrap}.cg-pr{white-space:nowrap}
.cg-mas{text-align:right}.cg-dots{width:30px;height:30px;border:none;border-radius:999px;background:transparent;cursor:pointer;font-size:18px;line-height:1;color:var(--text-body)}
.cg-dots:hover{background:var(--table-row-hover)}.cg-dots:focus-visible{outline:2px solid var(--color-brand)}
.cg-menu{position:absolute;right:0;top:32px;z-index:30;display:flex;flex-direction:column;min-width:170px;padding:6px 0;background:#FFFFFF;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);box-shadow:var(--shadow-md)}
.cg-menu button{border:none;background:transparent;padding:8px 14px;text-align:left;font:inherit;font-size:14px;color:var(--text-strong);cursor:pointer}.cg-menu button:hover,.cg-menu button:focus-visible{background:var(--table-row-hover);outline:none}
.cg-quitada td{background:var(--surface-subtle)}.cg-tach{text-decoration:line-through;color:var(--text-muted)}.cg-qmot{font-size:13px;line-height:1.4}
.cg-qbox{display:flex;flex-direction:column;gap:6px;padding:4px 0}.cg-lbl{font-size:13px;font-weight:700;color:var(--text-strong)}
.cg-in{height:38px;padding:0 10px;border:1.5px solid var(--input-outlined-border);border-radius:var(--radius-sm);font:inherit;font-size:14px;min-width:0;flex:1}
.cg-hist{margin:0;padding-left:18px;font-size:13px;color:var(--text-body)}.cg-err{font-size:13px;color:var(--color-danger)}
.cg-otros summary{cursor:pointer;font-size:14px;color:var(--text-strong)}.cg-orow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:14px}
.cg-obs{display:flex;flex-direction:column;gap:6px}.cg-ta{width:100%;min-height:58px;padding:8px 10px;border:1.5px solid var(--input-outlined-border);border-radius:var(--radius-sm);font:inherit;font-size:15px;line-height:1.45;color:var(--text-strong);resize:vertical}
.cg-sel{height:38px;padding:0 10px;border:1.5px solid var(--input-outlined-border);border-radius:var(--radius-sm);background:#FFFFFF;font:inherit;font-size:14px;color:var(--text-strong)}
.cg-chk{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--text-strong)}
.cg-motno{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border-radius:var(--radius-sm);background:var(--surface-subtle)}
.cg-alert{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding:10px 14px;border:1.5px solid var(--gold-500,#b7791f);border-radius:var(--radius-sm);background:var(--alert-warning-bg,#FFF4DC);font-size:14px}.cg-info{border-color:var(--color-info,#1F6FEB);background:#EEF4FF}
.cg-n1{padding:10px 14px;border-radius:var(--radius-sm);background:var(--surface-subtle);font-size:14px;color:var(--text-body)}
.cg-pie{position:sticky;bottom:0;z-index:20;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 14px;padding:10px 16px;border-top:1px solid var(--border-subtle);background:#FFFFFF;border-radius:0 0 var(--radius-md) var(--radius-md)}
.cg-pie-t{font-size:13.5px;color:var(--text-body);min-width:0}
.cg-panel{position:sticky;top:var(--cg-top,16px);display:flex;flex-direction:column;gap:10px;max-height:calc(100vh - var(--cg-top,16px) - 16px);overflow-y:auto;min-width:0}
.cg-pcab{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:14px}
.cg-psec{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:#FFFFFF}
.cg-psec-b{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;border:none;background:transparent;cursor:pointer;font:inherit;font-size:15px;font-weight:700;color:var(--text-strong);text-align:left}
.cg-psec-b:focus-visible{outline:2px solid var(--color-brand);outline-offset:-2px}.cg-pill{margin-left:8px;padding:1px 8px;border-radius:999px;background:var(--surface-subtle);font-size:12px;font-weight:700;color:var(--text-body)}
.cg-car{font-size:13px;color:var(--text-body)}.cg-pbody{display:flex;flex-direction:column;gap:8px;padding:0 14px 14px}
.cg-rec{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);font-size:14px;color:var(--text-strong)}
.cg-quote{font-size:12.5px;color:var(--text-muted)}.cg-ok{font-size:13px;font-weight:700;color:var(--color-success)}
.cg-add{align-self:flex-start;border:1.5px solid var(--color-brand);border-radius:var(--radius-sm);background:#FFFFFF;padding:4px 10px;font:inherit;font-size:13px;font-weight:700;color:var(--text-link);cursor:pointer}
.cg-lk{border:none;background:transparent;padding:0;cursor:pointer;font:inherit;font-size:13px;font-weight:700;color:var(--text-link);text-decoration:underline;text-underline-offset:3px}
.cg-lk:focus-visible,.cg-add:focus-visible,.cg-ic:focus-visible,.cg-th:focus-visible{outline:2px solid var(--color-brand);outline-offset:2px}
.cg-dl{margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.cg-dl dt{font-size:12px;color:var(--text-muted)}.cg-dl dd{margin:0;font-size:14px;font-weight:600;color:var(--text-strong)}
.cg-hall{margin:0;padding-left:18px;font-size:14px;color:var(--text-strong)}
.cg-thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.cg-th{aspect-ratio:1;border:none;border-radius:var(--radius-sm);background:var(--surface-subtle);cursor:zoom-in;padding:0;overflow:hidden;font-size:10px;font-weight:700;color:var(--text-muted)}
.cg-th img{width:100%;height:100%;object-fit:cover;display:block}
.cg-franja{position:sticky;top:var(--cg-top,16px);display:flex;flex-direction:column;align-items:center;gap:10px;width:52px;padding:10px 0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:#FFFFFF}
.cg-ic{position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:none;border-radius:var(--radius-sm);background:var(--surface-subtle);cursor:pointer;font-size:16px;color:var(--text-strong)}
.cg-cnt{position:absolute;top:-6px;right:-8px;min-width:18px;height:18px;padding:0 4px;border-radius:999px;background:var(--color-brand);color:#FFFFFF;font-size:11px;font-weight:700;line-height:18px}
@media (min-width:1600px){.cg-root{grid-template-columns:minmax(0,1fr) 360px}.cg-fac{max-width:200px;font-size:12.5px}.cg-barra{gap:10px 22px}}
.cg-root.cg-pleg{grid-template-columns:minmax(0,1fr) 52px}`;
  window.SiriusCalGar = C;
})();
