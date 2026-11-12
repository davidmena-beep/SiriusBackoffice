// SIRIUS · Modalidades por plantilla, criterios de la autoinspección y catálogo de documentos del cliente (prototipo · etapa P-6e-1).
// DEC-204 (reemplaza DEC-182): cada versión de plantilla guarda modalidades = { P, V, A, D } con al menos una activa; Coordinación ofrece solo las activas
//   en la versión vigente del ramo. Apagar una modalidad no borra sus pasos: se puede seguir diseñando.
// DEC-206: criteriosA = { activo, sumaMax, anioMin, carrocerias, sucursales } en la versión; con «activo», la autoinspección se ofrece solo a los casos que
//   cumplen todos los criterios definidos (los vacíos no se aplican). Sin activar, se ofrece en todos los casos del ramo.
// DEC-203: catálogo global SIRIUS_DOCUMENTOS_CLIENTE (Formularios › Portal del cliente › Documentos), publicado con SiriusPublicar como su propia clave;
//   cada versión de plantilla guarda documentos = { idDoc: { uso: 'requerido' | 'otro' | 'no', portales: { agendamiento, autoinspeccion } } }.
//   Un documento en Borrador en el catálogo no se puede usar hasta publicarlo.
// Datos iniciales y de las escenas: datos-modalidades.js (SIRIUS_MODALIDADES, SIRIUS_DOCUMENTOS_CLIENTE).
// · window.SiriusModalidades: lógica (inicial, cfgV, completar, vigente, publicarLocal, plantillaDeCaso, ofrecer, motivoA, catalogo, pasosDoc).
// · Componentes: SiriusModTabla (lista de Formularios), SiriusCuandoSeOfrece (plantilla › Autoinspección), SiriusDocUso (Autoinspección › Documentos y extras)
//   y SiriusDocCatalogo (Portal del cliente › Documentos).
(function () {
  'use strict';
  const W = window; if (W.SiriusModalidades) return;
  const R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const DM = () => W.SIRIUS_MODALIDADES || {}, clone = (o) => JSON.parse(JSON.stringify(o == null ? null : o));
  const M = ['P', 'V', 'A', 'D'], NOM = { P: 'Presencial', V: 'Virtual guiada', A: 'Autoinspección', D: 'Documental' }, DE = {}; M.forEach((k) => { DE[NOM[k]] = k; });
  const USOS = [['requerido', 'Requerido'], ['otro', 'Otro documento'], ['no', 'No se usa']];
  const num = (n) => String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const sinC = () => ({ activo: false, sumaMax: null, anioMin: null, carrocerias: [], sucursales: [] });
  const local = {}, subs = [];
  const avisar = () => subs.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  const suscribir = (f) => { subs.push(f); return () => { const i = subs.indexOf(f); if (i >= 0) subs.splice(i, 1); }; };
  const useSub = () => { const s = R().useState(0), set = s[1]; R().useEffect(() => suscribir(() => set((t) => t + 1)), []); };
  const ahoraTxt = () => { const E = W.SIRIUS_EJEMPLO || {}, d = E.ahora ? E.ahora() : new Date(2026, 9, 18, 20, 30), z = (n) => String(n).padStart(2, '0'); return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + z(d.getHours()) + ':' + z(d.getMinutes()); };

  // ---------- Lógica ----------
  function inicial(f) { const P = DM().porPlantilla || {}; let b = f && P[f.name];
    if (!b) b = f && (f.modular || f.tipo === 'Ramos Generales') ? P['Ubicación – Ramos Generales'] : P['Vehículos livianos'];
    const x = clone(b || { modalidades: { P: true, V: false, A: false, D: false }, criteriosA: sinC(), documentos: {} }); x.criteriosA = Object.assign(sinC(), x.criteriosA || {}); return x; }
  // Configuración de una versión: la guardada o la inicial de su plantilla (sin cambiar la versión).
  function cfgV(f, v) { const i = inicial(f), mo = v && v.modalidades ? Object.assign({ P: false, V: false, A: false, D: false }, v.modalidades) : i.modalidades;
    return { modalidades: mo, criteriosA: v && v.criteriosA ? Object.assign(sinC(), v.criteriosA) : i.criteriosA, documentos: v && v.documentos ? clone(v.documentos) : i.documentos }; }
  function completar(f, v) { const c = cfgV(f, v); v.modalidades = c.modalidades; v.criteriosA = c.criteriosA; v.documentos = c.documentos; return v; }
  // Versión vigente de una plantilla: la publicada en la base (SIRIUS_FORMULARIOS), la publicada en esta sesión o la inicial; las escenas pueden simularla.
  function vigente(nombre) { const F = W.SIRIUS_FORMULARIOS, X = W.SIRIUS_CONEXION; let base = null, n = null, origen = 'inicial';
    if (F && Array.isArray(F.formularios) && ((X && X.activo === true) || W.__sirFormBaseSim)) { const f = F.formularios.find((x) => x.name === nombre); if (f) { const vg = (f.versions || []).filter((v) => v.estado === 'Vigente').sort((a, b) => b.n - a.n)[0]; if (vg) { base = cfgV(f, vg); n = vg.n; origen = 'base'; } } }
    if (!base && local[nombre]) { base = clone(local[nombre].cfg); n = local[nombre].n; origen = 'sesion'; }
    if (!base) base = inicial({ name: nombre, tipo: /Ramos|Equipo/.test(nombre) ? 'Ramos Generales' : 'Vehículos' });
    const S = W.__sirModSim && W.__sirModSim.vigentes && W.__sirModSim.vigentes[nombre];
    if (S) { if (S.modalidades) base.modalidades = Object.assign({}, base.modalidades, S.modalidades); if (S.criteriosA) base.criteriosA = Object.assign(sinC(), base.criteriosA, S.criteriosA); origen = 'escena'; }
    return Object.assign(base, { nombre, n, origen }); }
  function publicarLocal(nombre, n, cfg) { local[nombre] = { n, cfg: clone(cfg) }; avisar(); }
  function plantillaDeCaso(c) { const E = W.SIRIUS_EJEMPLO || {}, sinV = (s) => String(s || '').replace(/\s+v\d+$/, ''); if (!c) return '';
    const vs = (E.vehiculos || []).filter((v) => v.caso === c.id), eq = (E.equipos || []).filter((q) => q.caso === c.id);
    if (vs[0] && vs[0].formulario) return sinV(vs[0].formulario); if (eq[0]) return sinV(eq[0].formulario) || 'Equipo y maquinaria';
    if (c.ramo === 'Vehículos' || c.tipoRiesgo === 'Vehículos') return 'Vehículos livianos';
    const RG = Object.values(E.plantillasRG || {})[0]; return (RG && RG.nombre) || 'Ubicación – Ramos Generales'; }
  function datosCaso(c) { const E = W.SIRIUS_EJEMPLO || {}, vs = (E.vehiculos || []).filter((v) => v.caso === c.id);
    const L = vs.length ? vs.map((v) => ({ suma: v.aseg != null ? Number(v.aseg) : null, anio: v.anio != null ? Number(v.anio) : null, carroceria: v.carroceria || '', etiqueta: v.placa || v.riesgo || '' }))
      : [{ suma: c.suma != null ? Number(c.suma) : null, anio: (/,\s*(\d{4})\b/.exec(String(c.bien || '')) || [])[1] ? Number(/,\s*(\d{4})\b/.exec(String(c.bien))[1]) : null, carroceria: c.carroceria || '', etiqueta: c.placa || '' }];
    return { vehiculos: L, sucursal: c.sucursal || '' }; }
  // DEC-206: primer criterio que el caso no cumple ('' si los cumple o si los criterios no están activos). Un dato que no llegó no bloquea.
  function motivoA(cr, d) { if (!cr || !cr.activo) return ''; const L = d.vehiculos || [], varios = L.length > 1, de = (v) => varios && v.etiqueta ? ' (' + v.etiqueta + ')' : '';
    for (const v of L) { if (cr.sumaMax != null && cr.sumaMax !== '' && v.suma != null && v.suma > Number(cr.sumaMax)) return 'La suma asegurada supera USD ' + num(cr.sumaMax) + de(v);
      if (cr.anioMin != null && cr.anioMin !== '' && v.anio != null && v.anio < Number(cr.anioMin)) return 'El vehículo es anterior a ' + cr.anioMin + de(v);
      if ((cr.carrocerias || []).length && v.carroceria && !cr.carrocerias.some((x) => norm(x) === norm(v.carroceria))) return 'La carrocería ' + v.carroceria + ' no está en los criterios' + de(v); }
    if ((cr.sucursales || []).length && d.sucursal && !cr.sucursales.some((x) => norm(x) === norm(d.sucursal))) return 'La sucursal ' + d.sucursal + ' no está en los criterios';
    return ''; }
  // Coordinación: qué modalidades se ofrecen al caso según la plantilla vigente de su ramo y los criterios de la autoinspección.
  function ofrecer(c) { const nombre = plantillaDeCaso(c), cfg = vigente(nombre), items = {};
    M.forEach((k) => { const on = !!cfg.modalidades[k]; let motivo = on ? '' : NOM[k] + ' no activa en la plantilla'; if (on && k === 'A') motivo = motivoA(cfg.criteriosA, datosCaso(c)); items[NOM[k]] = { ok: !motivo, motivo }; });
    items['No requiere inspección'] = { ok: true, motivo: '' };
    return { plantilla: nombre, version: cfg.n, origen: cfg.origen, criterios: !!(cfg.criteriosA && cfg.criteriosA.activo), items }; }
  // Catálogo publicado (el que usan las plantillas y los portales).
  function catalogo() { const C = W.SIRIUS_DOCUMENTOS_CLIENTE || { version: 0, documentos: [] }; return C; }
  // Pasos de la plantilla que pueden recibir las fotos de un documento (grupos Documentos y Extras de las plantillas por pasos).
  function pasosDoc() { const E = W.SIRIUS_EJEMPLO || {}, T = E.plantillas || {}, out = [], ya = {};
    Object.keys(T).forEach((k) => (T[k].pasos || []).forEach((s) => { if (ya[s.id] || !/^(Documentos|Extras)$/.test(s.group)) return; ya[s.id] = 1; out.push({ id: s.id, label: k.replace(/\s+v\d+$/, '') + ' · ' + s.name }); }));
    return out; }
  W.SiriusModalidades = { M, NOM, DE, USOS, inicial, cfgV, completar, vigente, publicarLocal, plantillaDeCaso, datosCaso, motivoA, ofrecer, catalogo, pasosDoc, suscribir, avisar, num };

  // ---------- Piezas ----------
  const T = { strong: 'var(--text-strong)', body: 'var(--text-body)', muted: 'var(--text-muted)', borde: 'var(--border-subtle)', link: 'var(--text-link, #0B5CAD)', brand: 'var(--color-brand)' };
  const inS = { height: 36, padding: '0 8px', border: '1.5px solid var(--input-outlined-border, #8a99ab)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14, background: '#FFFFFF', boxSizing: 'border-box', minWidth: 0, color: T.strong };
  const dis = (why) => why ? { 'aria-disabled': 'true', title: why, 'data-motivo': why } : {};
  const sr = (t) => h('span', { style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } }, t);
  const badge = (t, tone) => { const B = NS().Badge; return B ? h(B, { tone: tone || 'neutral' }, h('span', { style: { whiteSpace: 'nowrap' } }, t)) : h('span', null, t); };
  const btn = (t, on, o) => { o = o || {}; const why = o.motivo || '';
    return h('button', Object.assign({ type: 'button', id: o.id, 'aria-label': o.aria, onClick: why ? undefined : on, style: Object.assign({ minHeight: 36, padding: '0 14px', border: o.primary ? 'none' : '1.5px solid ' + (why ? 'var(--border-default)' : T.brand), borderRadius: 'var(--radius-sm)', background: o.primary ? (why ? 'var(--surface-subtle)' : T.brand) : '#FFFFFF', color: o.primary ? (why ? T.muted : '#FFFFFF') : (why ? T.muted : T.brand), fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, cursor: why ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }, o.style || {}) }, dis(why), o.attrs || {}), t); };
  const link = (t, on, o) => h('button', Object.assign({ type: 'button', onClick: on, style: { alignSelf: 'flex-start', minHeight: 32, padding: '0 2px', border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, color: T.link, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', whiteSpace: 'nowrap' } }, o || {}), t);
  // Interruptor accesible (role="switch"); deshabilitado con aria-disabled y el motivo en el título.
  const sw = (on, set, label, why, o) => h('button', Object.assign({ type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false', 'aria-label': label, onClick: why ? undefined : () => set(!on),
    style: { position: 'relative', flex: '0 0 auto', width: 44, height: 24, padding: 0, border: 'none', borderRadius: 999, background: on ? (why ? '#8fc3dd' : T.brand) : (why ? '#e3e8ee' : '#c3ccd6'), cursor: why ? 'not-allowed' : 'pointer' } }, dis(why), o || {}),
    h('span', { 'aria-hidden': 'true', style: { position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(1,30,65,.25)', transition: 'left .12s' } }));
  const lab = (t, id, ctl, st) => h('div', { style: Object.assign({ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }, st || {}) }, h('label', { htmlFor: id, style: { fontSize: 13, fontWeight: 700, color: T.strong } }, t), ctl);
  const card = (attrs, ...kids) => h('section', Object.assign({ style: { display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 20px', border: '1px solid ' + T.borde, borderRadius: 'var(--radius-md)', background: '#FFFFFF', minWidth: 0 } }, attrs || {}), ...kids);
  const modal = (titulo, onClose, cuerpo, pie) => { const Md = W.SiriusModal; return Md ? h(Md, { open: true, onClose, size: 'md', align: 'left', title: titulo, footer: pie }, cuerpo) : h('div', { role: 'dialog', 'aria-label': titulo }, cuerpo, pie); };

  // ---------- Formularios › lista: modalidades por plantilla (DEC-204) ----------
  // p.filas = [{ id, nombre, version, estado ('Vigente' | 'Borrador'), modular, borradorN, cambios, onRevisar, celdas: [{ k, on, sub, why, onToggle }] }]
  function SiriusModTabla(p) { const F = p.filas || [];
    const th = (t, w) => h('th', { key: t, scope: 'col', style: { padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: T.strong, whiteSpace: 'nowrap', width: w } }, t);
    const cabeza = h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '4px 16px' } }, h('h2', { id: 'mt-t', style: { margin: 0, fontSize: 17, fontWeight: 700, color: T.strong } }, 'Modalidades por plantilla'),
      h('span', { style: { fontSize: 13, color: T.muted } }, 'Coordinación ofrece solo las activas en la versión vigente. Cambiar un interruptor edita el borrador; se publica con motivo.'));
    const filaPl = (f) => h('th', { scope: 'row', style: { padding: '10px 12px', textAlign: 'left', verticalAlign: 'top', fontWeight: 400 } },
      h('span', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('b', { style: { fontSize: 14, color: T.strong } }, f.nombre),
        h('span', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, fontSize: 12.5, color: T.muted } }, badge(f.estado + ' v' + f.version, f.estado === 'Borrador' ? 'warning' : 'success'), f.cambios ? h('span', { 'data-mod-cambios': f.id }, f.cambios) : null),
        f.onRevisar ? link('Revisar y publicar el borrador v' + f.borradorN, f.onRevisar, { 'data-mod-revisar': f.id }) : null));
    const celda = (f, c) => h('td', { key: c.k, 'data-mod-celda': f.id + '-' + c.k, style: { padding: '10px 12px', verticalAlign: 'top' } },
      h('span', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 } }, sw(c.on, c.onToggle, NOM[c.k] + ' en ' + f.nombre, c.why, { 'data-mod-sw': f.id + '-' + c.k }),
        h('span', { style: { fontSize: 12.5, lineHeight: 1.35, color: c.on ? T.body : T.muted } }, c.sub)));
    const tabla = h('table', { style: { width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14, color: T.body } },
      h('thead', null, h('tr', { style: { background: 'var(--table-row-hover, #f3f6f9)' } }, [th('Plantilla', '30%')].concat(M.map((k) => th(NOM[k]))))),
      h('tbody', null, F.map((f) => h('tr', { key: f.id, 'data-mod-fila': f.id, style: { borderTop: '1px solid ' + T.borde } }, filaPl(f), f.celdas.map((c) => celda(f, c))))));
    return card({ 'aria-labelledby': 'mt-t', 'data-mod-tabla': F.length }, cabeza, h('div', { style: { overflowX: 'auto', border: '1px solid ' + T.borde, borderRadius: 'var(--radius-sm)' } }, tabla),
      p.nota ? h('p', { style: { margin: 0, fontSize: 12.5, color: T.muted } }, p.nota) : null); }

  // ---------- Plantilla › Autoinspección: «Cuándo se ofrece» (DEC-206) ----------
  // p: { criterios, aActiva, ro, roWhy, onCambio(nuevo, que) }
  function SiriusCuandoSeOfrece(p) { const c = Object.assign(sinC(), p.criterios || {}), why = p.ro ? (p.roWhy || 'Solo lectura') : '', D = DM();
    const set = (patch, que) => { if (why) return; p.onCambio(Object.assign({}, c, patch), que); };
    const numIn = (id, val, k, ph, que) => h('input', Object.assign({ id, type: 'number', inputMode: 'numeric', min: 0, value: val == null ? '' : val, placeholder: ph, readOnly: !!why, onChange: (e) => { const t = e.target.value; set({ [k]: t === '' ? null : Math.max(0, Number(t)) }, que); }, style: Object.assign({}, inS, { width: '100%', background: why ? 'var(--surface-subtle)' : '#FFFFFF' }) }, dis(why)));
    const chk = (lista, k, opts, legend) => h('fieldset', { style: { margin: 0, padding: 0, border: 'none', minWidth: 0 } }, h('legend', { style: { padding: 0, marginBottom: 6, fontSize: 13, fontWeight: 700, color: T.strong } }, legend),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px 14px' } }, opts.map((o) => { const on = lista.indexOf(o) >= 0; return h('label', { key: o, style: { display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 32, fontSize: 14, color: T.body, cursor: why ? 'not-allowed' : 'pointer' } },
        h('input', Object.assign({ type: 'checkbox', checked: on, onChange: () => set({ [k]: on ? lista.filter((x) => x !== o) : lista.concat(o) }, legend + ': ' + (on ? 'quitó ' : 'agregó ') + o), style: { width: 18, height: 18, margin: 0, accentColor: 'var(--cyan-700, #0b7fb3)' } }, dis(why))), o); })),
      h('span', { style: { display: 'block', marginTop: 4, fontSize: 12, color: T.muted } }, lista.length ? lista.length + ' de ' + opts.length + ' marcadas' : 'Sin marcar: aplica a todas'));
    return card({ id: 'fm-cuando', 'aria-labelledby': 'cs-t', 'data-criterios-a': c.activo ? 'activo' : 'inactivo' },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 320px' } }, h('h2', { id: 'cs-t', style: { margin: 0, fontSize: 17, fontWeight: 700, color: T.strong } }, 'Cuándo se ofrece'),
          h('span', { style: { fontSize: 13, color: T.muted } }, 'Coordinación ofrece la autoinspección a los casos del ramo que cumplen estos criterios. Sin criterios adicionales, a todos.')),
        h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, color: T.strong } }, sw(c.activo, (v) => set({ activo: v }, v ? 'Activó los criterios adicionales de la autoinspección' : 'Desactivó los criterios adicionales de la autoinspección'), 'Aplicar criterios adicionales', why, { id: 'cs-activo' }), h('span', { 'aria-hidden': 'true' }, 'Aplicar criterios adicionales'))),
      p.aActiva === false ? h('p', { role: 'note', 'data-cs-apagada': '1', style: { margin: 0, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--alert-warning-bg, #fdf3dc)', fontSize: 13, color: T.strong } }, 'La autoinspección no está activa en esta versión: los criterios se guardan, pero Coordinación no la ofrece hasta activarla en «Modalidades por plantilla».') : null,
      c.activo ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, alignItems: 'start' } },
        lab('Suma asegurada máxima (USD)', 'cs-suma', numIn('cs-suma', c.sumaMax, 'sumaMax', 'Sin límite', 'Cambió la suma asegurada máxima de la autoinspección')),
        lab('Año mínimo del vehículo', 'cs-anio', numIn('cs-anio', c.anioMin, 'anioMin', 'Sin límite', 'Cambió el año mínimo del vehículo de la autoinspección')),
        h('div', { style: { gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 } }, chk(c.carrocerias || [], 'carrocerias', D.carrocerias || [], 'Carrocerías'), chk(c.sucursales || [], 'sucursales', D.sucursales || [], 'Sucursales')),
        h('p', { 'data-cs-resumen': '1', style: { gridColumn: '1 / -1', margin: 0, fontSize: 13, color: T.body } }, resumenC(c)))
        : h('p', { 'data-cs-resumen': '1', style: { margin: 0, fontSize: 13, color: T.body } }, 'Sin criterios adicionales: la autoinspección se ofrece en todos los casos del ramo.')); }
  function resumenC(c) { const p = []; if (c.sumaMax != null && c.sumaMax !== '') p.push('suma asegurada hasta USD ' + num(c.sumaMax)); if (c.anioMin != null && c.anioMin !== '') p.push('vehículos desde ' + c.anioMin);
    if ((c.carrocerias || []).length) p.push('carrocerías: ' + c.carrocerias.join(', ')); if ((c.sucursales || []).length) p.push('sucursales: ' + c.sucursales.join(', '));
    return p.length ? 'Se ofrece a los casos con ' + p.join('; ') + '.' : 'Criterios activos sin ningún valor: la autoinspección se sigue ofreciendo en todos los casos del ramo.'; }

  // ---------- Plantilla › Autoinspección › Documentos y extras: uso de los documentos del catálogo (DEC-203) ----------
  // p: { usos, ro, roWhy, plantilla, onCambio(nuevo, que) }
  function SiriusDocUso(p) { useSub(); const C = catalogo(), docs = (C.documentos || []).filter((d) => d.estado !== 'Retirado'), U = p.usos || {}, why = p.ro ? (p.roWhy || 'Solo lectura') : '';
    const uso = (id) => Object.assign({ uso: 'no', portales: { agendamiento: false, autoinspeccion: false } }, U[id] || {});
    const set = (id, patch, que) => { if (why) return; const n = clone(U); n[id] = Object.assign(uso(id), patch); if (n[id].uso === 'no') n[id].portales = { agendamiento: false, autoinspeccion: false }; else if (patch.uso && !n[id].portales.agendamiento && !n[id].portales.autoinspeccion) n[id].portales = { agendamiento: true, autoinspeccion: true }; p.onCambio(n, que); };
    const capt = (d) => d.captura === 'frenteReverso' ? 'Frente y reverso' : d.porExtra ? '1 foto por extra declarado' : (d.min === d.max ? d.min + (d.min === 1 ? ' foto' : ' fotos') : 'De ' + d.min + ' a ' + d.max + ' fotos');
    const req = docs.filter((d) => d.estado === 'Vigente' && uso(d.id).uso === 'requerido').length, otros = docs.filter((d) => d.estado === 'Vigente' && uso(d.id).uso === 'otro').length;
    return h('section', { id: 'at-docuso', 'aria-labelledby': 'du-t', 'data-doc-uso': docs.length, style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, minWidth: 0 } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '4px 16px' } }, h('h3', { id: 'du-t', style: { margin: 0, fontSize: 15, fontWeight: 700, color: T.strong } }, 'Documentos del cliente en ' + (p.plantilla || 'esta plantilla')),
        h('span', { style: { fontSize: 13, color: T.muted } }, req + (req === 1 ? ' requerido' : ' requeridos') + ' · ' + otros + (otros === 1 ? ' a elección del cliente' : ' a elección del cliente') + ' · catálogo v' + (C.version || 0))),
      h('p', { style: { margin: 0, fontSize: 13, color: T.muted } }, 'Los documentos salen del catálogo global (Portal del cliente › Documentos). Requerido: el portal lo pide. Otro documento: el cliente lo elige con «+ Agregar otro documento».'),
      h('div', { style: { overflowX: 'auto', border: '1px solid ' + T.borde, borderRadius: 'var(--radius-sm)' } },
        h('table', { style: { width: '100%', minWidth: 720, borderCollapse: 'collapse', fontSize: 14, color: T.body } },
          h('thead', null, h('tr', { style: { background: 'var(--table-row-hover, #f3f6f9)' } }, ['Documento', 'Captura', 'Uso', 'Agendamiento', 'Autoinspección'].map((t) => h('th', { key: t, scope: 'col', style: { padding: '8px 10px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: T.strong, whiteSpace: 'nowrap' } }, t)))),
          h('tbody', null, docs.map((d) => { const u = uso(d.id), borr = d.estado !== 'Vigente', w = why || (borr ? 'En borrador en el catálogo: publícalo para usarlo' : ''), wp = w || (u.uso === 'no' ? 'No se usa en esta plantilla' : '');
            const cb = (k, t) => h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 32, cursor: wp ? 'not-allowed' : 'pointer' } }, h('input', Object.assign({ type: 'checkbox', checked: !!u.portales[k], onChange: () => { if (wp) return; set(d.id, { portales: Object.assign({}, u.portales, { [k]: !u.portales[k] }) }, d.nombre + ': ' + t + (u.portales[k] ? ' no' : ' sí')); }, style: { width: 18, height: 18, margin: 0, accentColor: 'var(--cyan-700, #0b7fb3)' } }, dis(wp))), sr(t + ' · ' + d.nombre));
            return h('tr', { key: d.id, 'data-doc-uso-fila': d.id, 'data-uso': borr ? 'borrador' : u.uso, style: { borderTop: '1px solid ' + T.borde, background: borr ? 'var(--surface-subtle, #f6f8fb)' : '#FFFFFF' } },
              h('td', { style: { padding: '8px 10px' } }, h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('b', { style: { fontWeight: 600, color: T.strong } }, d.nombre), borr ? h('span', { style: { fontSize: 12, color: '#7A4F0E', fontWeight: 700 } }, 'En borrador en el catálogo') : null)),
              h('td', { style: { padding: '8px 10px', fontSize: 13, color: T.muted, whiteSpace: 'nowrap' } }, capt(d)),
              h('td', { style: { padding: '8px 10px' } }, h('select', Object.assign({ 'aria-label': 'Uso de ' + d.nombre, value: borr ? 'no' : u.uso, onChange: (e) => { if (w) return; set(d.id, { uso: e.target.value }, d.nombre + ': ' + (USOS.find((x) => x[0] === e.target.value) || [0, ''])[1]); }, style: Object.assign({}, inS, { width: 190, background: w ? 'var(--surface-subtle)' : '#FFFFFF' }) }, dis(w)), USOS.map(([k, t]) => h('option', { key: k, value: k }, t)))),
              h('td', { style: { padding: '8px 10px' } }, cb('agendamiento', 'Agendamiento')), h('td', { style: { padding: '8px 10px' } }, cb('autoinspeccion', 'Autoinspección'))); })))),
      why ? h('span', { style: { fontSize: 12.5, color: T.muted } }, why) : null); }

  // ---------- Portal del cliente › Documentos: catálogo global (DEC-203) ----------
  const ICONOS = [['documento', 'Documento'], ['tarjeta', 'Tarjeta'], ['vehiculo', 'Vehículo'], ['factura', 'Factura']];
  const ICO = { documento: 'M6 2h9l5 5v15H6z M15 2v5h5 M9 12h8 M9 16h8', tarjeta: 'M3 5h18v14H3z M7 10h4 M7 14h6 M15 9h3v4h-3z', vehiculo: 'M3 13l2-5h14l2 5v5H3z M7 18v2 M17 18v2 M6 13h12', factura: 'M6 2h12v20l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6' };
  const ico = (k, s) => h('svg', { width: s || 20, height: s || 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: ICO[k] || ICO.documento }));
  const EST = { Vigente: 'success', Borrador: 'warning', Retirado: 'neutral' };
  function errores(d) { const e = {}; if (!String(d.nombre || '').trim()) e.nombre = 'Escribe el nombre del documento.';
    if (d.captura === 'varias') { const mn = Number(d.min), mx = Number(d.max); if (!(mn >= 1)) e.min = 'El mínimo es de al menos 1 foto.'; if (!(mx >= mn)) e.max = 'El máximo no puede ser menor que el mínimo.'; if (mx > 30) e.max = 'Hasta 30 fotos.'; if (!(d.pasos || [])[0]) e.pasos = 'Elige el paso al que llegan las fotos.'; }
    else if (!(d.pasos || [])[0] || !(d.pasos || [])[1]) e.pasos = 'Elige el paso del frente y el del reverso.';
    return e; }
  function SiriusDocCatalogo(p) { useSub();
    const s0 = R().useState(() => clone(catalogo().documentos || [])), docs = s0[0], setDocs = s0[1];
    const s1 = R().useState(() => { const L = catalogo().documentos || []; return (L.find((d) => d.id === p.preset) || L[0] || {}).id || null; }), selId = s1[0], setSel = s1[1];
    const s2 = R().useState(null), md = s2[0], setMd = s2[1], s3 = R().useState(p.plantilla || 'Vehículos livianos'), plPrev = s3[0], setPl = s3[1], s4 = R().useState('autoinspeccion'), portal = s4[0], setPortal = s4[1], s5 = R().useState(false), otrosAb = s5[0], setOtros = s5[1], s6 = R().useState(''), lec = s6[0], setLec = s6[1], s7 = R().useState(''), aviso = s7[0], setAviso = s7[1];
    R().useEffect(() => { const d = docs.find((x) => x.id === selId), U = vigente(plPrev).documentos || {}; if (d && p.preset === d.id && (U[d.id] || {}).uso === 'otro') setOtros(true); }, []); /* escena doccatalogo: el documento elegido se ve en «+ Agregar otro documento» */
    const C = catalogo(), cambios = JSON.stringify(docs) !== JSON.stringify(C.documentos || []), d = docs.find((x) => x.id === selId) || null, E = d ? errores(d) : {}, conErr = docs.filter((x) => Object.keys(errores(x)).length);
    const upd = (patch) => setDocs((L) => L.map((x) => x.id === selId ? Object.assign({}, x, patch) : x));
    const pasos = pasosDoc(), pasoSel = (id, val, on, label) => h('select', { id, value: val || '', 'aria-invalid': !val && E.pasos ? 'true' : 'false', onChange: (e) => on(e.target.value), style: Object.assign({}, inS, { width: '100%' }) }, h('option', { value: '' }, 'Elige el paso…'), pasos.map((x) => h('option', { key: x.id, value: x.id }, x.label + ' (' + x.id + ')')));
    const err = (k) => E[k] ? h('span', { role: 'alert', style: { fontSize: 12.5, fontWeight: 700, color: 'var(--color-danger, #b3261e)' } }, E[k]) : null;
    const nuevo = () => { let n = 1, id = 'documento_' + n; while (docs.some((x) => x.id === id)) id = 'documento_' + (++n); setDocs((L) => L.concat({ id, nombre: 'Documento nuevo', icono: 'documento', captura: 'varias', min: 1, max: 1, pasos: [], lecturas: [], estado: 'Borrador' })); setSel(id); setTimeout(() => { const el = document.getElementById('dc-nombre'); if (el) { el.focus(); el.select(); } }, 30); };
    const publicar = (mot) => { const prev = clone(C), n = (Number(C.version) || 0) + 1, datos = { version: n, publicadoEn: ahoraTxt(), publicadoPor: p.usuario || 'Andrea Salazar', motivo: mot, documentos: clone(docs) };
      W.SIRIUS_DOCUMENTOS_CLIENTE = datos; avisar(); setMd(null); setAviso('Catálogo publicado: versión ' + n + '. Las plantillas lo usan desde ahora.');
      const SP = W.SiriusPublicar; if (SP && SP.activo()) SP.publicar({ clave: 'SIRIUS_DOCUMENTOS_CLIENTE', version: n, datos, motivo: mot, pantalla: 'Formularios › Portal del cliente › Documentos', aviso: 'Publicado: el catálogo de documentos llega a los portales al volver a abrirse',
        revertir: () => { W.SIRIUS_DOCUMENTOS_CLIENTE = prev; avisar(); setAviso('No se publicó en la base: el catálogo vuelve a la versión ' + (prev.version || 0) + '.'); } }); };
    // ----- columna izquierda: el catálogo
    const lista = h('div', { 'data-dc-lista': docs.length, style: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } }, h('h2', { id: 'dc-t', style: { margin: 0, fontSize: 17, fontWeight: 700, color: T.strong } }, 'Catálogo'), link('+ Nuevo documento', nuevo, { id: 'dc-nuevo' })),
      h('ul', { role: 'listbox', 'aria-labelledby': 'dc-t', style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', border: '1px solid ' + T.borde, borderRadius: 'var(--radius-sm)', overflow: 'hidden' } }, docs.map((x, i) => { const on = x.id === selId, er = Object.keys(errores(x)).length;
        return h('li', { key: x.id, role: 'option', 'aria-selected': on ? 'true' : 'false', tabIndex: on ? 0 : -1, 'data-dc-doc': x.id, onClick: () => setSel(x.id), onKeyDown: (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const j = Math.max(0, Math.min(docs.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1))); setSel(docs[j].id); setTimeout(() => { const el = document.querySelector('[data-dc-doc="' + docs[j].id + '"]'); if (el) el.focus(); }, 0); } },
          style: { display: 'flex', alignItems: 'center', gap: 10, minHeight: 52, padding: '6px 12px', borderTop: i ? '1px solid ' + T.borde : 'none', background: on ? 'var(--color-brand-wash, #e6f3fb)' : '#FFFFFF', boxShadow: on ? 'inset 3px 0 0 var(--color-brand)' : 'none', cursor: 'pointer' } },
          h('span', { style: { color: on ? T.brand : T.muted, display: 'flex' } }, ico(x.icono)),
          h('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } }, h('b', { style: { fontSize: 14, lineHeight: 1.3, fontWeight: 600, color: T.strong, overflowWrap: 'anywhere' } }, x.nombre || 'Sin nombre'), h('span', { style: { fontSize: 12, color: er ? 'var(--color-danger, #b3261e)' : T.muted } }, er ? 'Faltan datos' : x.captura === 'frenteReverso' ? 'Frente y reverso' : x.porExtra ? '1 foto por extra' : 'De ' + x.min + ' a ' + x.max + ' fotos')),
          badge(x.estado, EST[x.estado])); })),
      h('span', { style: { fontSize: 12.5, color: T.muted } }, 'Versión ' + (C.version || 0) + ' publicada' + (C.publicadoEn ? ' el ' + C.publicadoEn : '') + (cambios ? ' · cambios sin publicar' : '')));
    // ----- columna central: el editor
    const editor = !d ? h('p', { style: { margin: 0, color: T.muted } }, 'Elige un documento del catálogo.') : h('div', { 'data-dc-editor': d.id, style: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 } },
      h('h2', { style: { margin: 0, fontSize: 17, fontWeight: 700, color: T.strong } }, 'Editar documento'),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px', gap: 12 } },
        lab('Nombre', 'dc-nombre', h('input', { id: 'dc-nombre', value: d.nombre, 'aria-invalid': E.nombre ? 'true' : 'false', onChange: (e) => upd({ nombre: e.target.value }), style: Object.assign({}, inS, { width: '100%' }) })),
        lab('Ícono', 'dc-icono', h('select', { id: 'dc-icono', value: d.icono || 'documento', onChange: (e) => upd({ icono: e.target.value }), style: Object.assign({}, inS, { width: '100%' }) }, ICONOS.map(([k, t]) => h('option', { key: k, value: k }, t))))),
      err('nombre'),
      h('fieldset', { style: { margin: 0, padding: 0, border: 'none' } }, h('legend', { style: { padding: 0, marginBottom: 6, fontSize: 13, fontWeight: 700, color: T.strong } }, 'Captura'),
        h('div', { role: 'radiogroup', style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, [['frenteReverso', 'Frente y reverso'], ['varias', 'Varias fotos']].map(([k, t]) => { const on = d.captura === k;
          return h('label', { key: k, style: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 14px', border: '2px solid ' + (on ? 'var(--cyan-500, #00aeef)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', background: on ? 'var(--color-brand-wash, #e6f3fb)' : '#FFFFFF', fontSize: 14, fontWeight: 600, color: T.strong, cursor: 'pointer' } },
            h('input', { type: 'radio', name: 'dc-captura', checked: on, onChange: () => upd(k === 'frenteReverso' ? { captura: k, min: 2, max: 2, porExtra: false, pasos: (d.pasos || []).slice(0, 2) } : { captura: k, min: 1, max: Math.max(1, Number(d.max) || 1), pasos: (d.pasos || []).slice(0, 1) }), style: { width: 18, height: 18, margin: 0, accentColor: 'var(--cyan-700, #0b7fb3)' } }), t); }))),
      d.captura === 'varias' ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 } },
        lab('Mínimo de fotos', 'dc-min', h('input', { id: 'dc-min', type: 'number', min: 1, max: 30, value: d.min, 'aria-invalid': E.min ? 'true' : 'false', onChange: (e) => upd({ min: e.target.value === '' ? '' : Number(e.target.value) }), style: Object.assign({}, inS, { width: '100%' }) })),
        lab('Máximo de fotos', 'dc-max', h('input', { id: 'dc-max', type: 'number', min: 1, max: 30, value: d.max, 'aria-invalid': E.max ? 'true' : 'false', onChange: (e) => upd({ max: e.target.value === '' ? '' : Number(e.target.value) }), style: Object.assign({}, inS, { width: '100%' }) }))) : null,
      err('min'), err('max'),
      d.captura === 'varias' ? h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: T.body } }, h('input', { type: 'checkbox', checked: !!d.porExtra, onChange: () => upd({ porExtra: !d.porExtra }), style: { width: 18, height: 18, margin: 0, accentColor: 'var(--cyan-700, #0b7fb3)' } }), 'Se pide una vez por cada extra declarado') : null,
      d.captura === 'frenteReverso' ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 } },
        lab('Paso del frente', 'dc-paso-0', pasoSel('dc-paso-0', (d.pasos || [])[0], (v) => upd({ pasos: [v, (d.pasos || [])[1] || ''] }))),
        lab('Paso del reverso', 'dc-paso-1', pasoSel('dc-paso-1', (d.pasos || [])[1], (v) => upd({ pasos: [(d.pasos || [])[0] || '', v] }))))
        : lab('Paso al que llegan las fotos', 'dc-paso-0', pasoSel('dc-paso-0', (d.pasos || [])[0], (v) => upd({ pasos: [v] }))),
      err('pasos'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('span', { id: 'dc-lec-t', style: { fontSize: 13, fontWeight: 700, color: T.strong } }, 'Lecturas del documento'),
        h('div', { 'aria-labelledby': 'dc-lec-t', 'data-dc-lecturas': (d.lecturas || []).length, style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, (d.lecturas || []).length ? d.lecturas.map((l) => h('span', { key: l, style: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 4px 2px 10px', border: '1px solid ' + T.borde, borderRadius: 999, fontSize: 13, color: T.strong } }, l, h('button', { type: 'button', 'aria-label': 'Quitar la lectura ' + l, onClick: () => upd({ lecturas: d.lecturas.filter((x) => x !== l) }), style: { width: 24, height: 24, border: 'none', borderRadius: '50%', background: 'transparent', color: T.muted, cursor: 'pointer', fontSize: 16, lineHeight: 1 } }, '×'))) : h('span', { style: { fontSize: 13, color: T.muted } }, 'Sin lecturas: el documento se guarda como foto.')),
        h('div', { style: { display: 'flex', gap: 8 } }, h('label', { htmlFor: 'dc-lec', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Nueva lectura'), h('input', { id: 'dc-lec', value: lec, placeholder: 'Nueva lectura (p. ej. Placa)', onChange: (e) => setLec(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); const t = lec.trim(); if (t && (d.lecturas || []).indexOf(t) < 0) upd({ lecturas: (d.lecturas || []).concat(t) }); setLec(''); } }, style: Object.assign({}, inS, { flex: 1 }) }),
          btn('Agregar', () => { const t = lec.trim(); if (t && (d.lecturas || []).indexOf(t) < 0) upd({ lecturas: (d.lecturas || []).concat(t) }); setLec(''); }, { motivo: lec.trim() ? '' : 'Escribe la lectura' }))),
      lab('Estado', 'dc-estado', h('select', { id: 'dc-estado', value: d.estado, onChange: (e) => upd({ estado: e.target.value }), style: Object.assign({}, inS, { width: 220 }) }, ['Borrador', 'Vigente', 'Retirado'].map((x) => h('option', { key: x, value: x }, x)))),
      h('span', { style: { fontSize: 12.5, color: T.muted } }, d.estado === 'Borrador' ? 'En borrador las plantillas no pueden usarlo hasta publicar el catálogo con el estado Vigente.' : d.estado === 'Retirado' ? 'Retirado: deja de ofrecerse en las plantillas al publicar el catálogo.' : 'Vigente: las plantillas pueden usarlo como requerido u otro documento.'));
    // ----- columna derecha: vista previa del celular
    const L = (vigente(plPrev).documentos) || {}, usoDe = (x) => (L[x.id] || { uso: 'no', portales: {} }), visible = (x) => x.estado === 'Vigente' && (usoDe(x).portales || {})[portal];
    const reqs = docs.filter((x) => visible(x) && usoDe(x).uso === 'requerido'), otros = docs.filter((x) => visible(x) && usoDe(x).uso === 'otro');
    const captTxt = (x) => x.captura === 'frenteReverso' ? 'Frente y reverso' : x.porExtra ? '1 foto por extra declarado' : x.min === x.max ? x.min + (x.min === 1 ? ' foto' : ' fotos') : 'De ' + x.min + ' a ' + x.max + ' fotos';
    const filaCel = (x, extra) => h('li', { key: x.id, 'data-cel-doc': x.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1.5px solid ' + (x.id === selId ? 'var(--cyan-500, #00aeef)' : '#dbe3ea'), borderRadius: 12, background: x.id === selId ? '#eef8fd' : '#FFFFFF' } }, h('span', { style: { color: '#0b5cad', display: 'flex' } }, ico(x.icono, 22)), h('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } }, h('b', { style: { fontSize: 13, color: '#011e41' } }, x.nombre), h('span', { style: { fontSize: 11.5, color: '#5b6b7d' } }, captTxt(x))), extra || h('span', { 'aria-hidden': 'true', style: { color: '#5b6b7d' } }, '›'));
    const nota = d && d.estado !== 'Vigente' ? '«' + d.nombre + '» está en ' + d.estado.toLowerCase() + ': no aparece en el portal.' : d && usoDe(d).uso === 'no' ? '«' + d.nombre + '» no se usa en ' + plPrev + '.' : d && !(usoDe(d).portales || {})[portal] ? '«' + d.nombre + '» no aplica en este portal.' : '';
    const prev = h('div', { 'data-dc-prev': plPrev, style: { display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 } },
      h('h2', { style: { margin: 0, fontSize: 17, fontWeight: 700, color: T.strong } }, 'Vista previa'),
      lab('Plantilla', 'dc-prev-pl', h('select', { id: 'dc-prev-pl', value: plPrev, onChange: (e) => setPl(e.target.value), style: Object.assign({}, inS, { width: '100%' }) }, ['Vehículos livianos', 'Motos', 'Pesados', 'Equipo y maquinaria'].map((x) => h('option', { key: x, value: x }, x)))),
      h('div', { role: 'group', 'aria-label': 'Portal', style: { display: 'flex', gap: 6 } }, [['autoinspeccion', 'Autoinspección'], ['agendamiento', 'Agendamiento']].map(([k, t]) => h('button', { key: k, type: 'button', 'aria-pressed': portal === k ? 'true' : 'false', onClick: () => setPortal(k), style: { flex: 1, minHeight: 34, border: '1.5px solid var(--color-brand)', borderRadius: 999, background: portal === k ? 'var(--color-brand)' : '#FFFFFF', color: portal === k ? '#FFFFFF' : 'var(--color-brand)', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, cursor: 'pointer' } }, t))),
      h('div', { 'aria-label': 'Celular del cliente', role: 'img', style: { alignSelf: 'center', width: 260, maxWidth: '100%', boxSizing: 'border-box', padding: 10, border: '8px solid #1d2733', borderRadius: 30, background: '#f4f7fa' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, minHeight: 360, fontFamily: 'var(--font-brand)' } },
          h('b', { style: { fontSize: 15, color: '#011e41' } }, 'Tus documentos'), h('span', { style: { fontSize: 11.5, color: '#5b6b7d' } }, reqs.length ? 'Toma una foto de cada documento requerido.' : 'No hay documentos requeridos.'),
          reqs.length ? h('span', { style: { fontSize: 11, fontWeight: 700, color: '#5b6b7d', textTransform: 'uppercase', letterSpacing: '.04em' } }, 'Requeridos') : null,
          h('ul', { 'data-cel-req': reqs.length, style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 } }, reqs.map((x) => filaCel(x))),
          otros.length ? h('button', { type: 'button', 'aria-expanded': otrosAb ? 'true' : 'false', 'data-cel-otro': otros.length, onClick: () => setOtros(!otrosAb), style: { minHeight: 40, border: '1.5px dashed #0b5cad', borderRadius: 12, background: '#FFFFFF', color: '#0b5cad', fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 700, cursor: 'pointer' } }, '+ Agregar otro documento') : null,
          otrosAb && otros.length ? h('ul', { style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 } }, otros.map((x) => filaCel(x, h('span', { style: { fontSize: 11, fontWeight: 700, color: '#0b5cad' } }, 'Elegir')))) : null)),
      nota ? h('span', { role: 'note', 'data-dc-prev-nota': '1', style: { fontSize: 12.5, color: T.muted } }, nota) : null,
      h('span', { style: { fontSize: 12, color: T.muted } }, 'El uso de cada documento se define en cada plantilla › Autoinspección › Documentos y extras.'));
    const pie = h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } },
      btn('Descartar cambios', () => { setDocs(clone(C.documentos || [])); setAviso('Se descartaron los cambios sin publicar.'); }, { motivo: cambios ? '' : 'No hay cambios sin publicar', id: 'dc-descartar' }),
      btn('Publicar catálogo', () => setMd({ mot: '', tried: false }), { primary: true, id: 'dc-publicar', motivo: !cambios ? 'No hay cambios sin publicar' : conErr.length ? 'Corrige los datos de ' + conErr.map((x) => x.nombre || x.id).join(', ') : '' }),
      aviso ? h('span', { role: 'status', style: { fontSize: 13, fontWeight: 700, color: 'var(--color-success, #1f7a5c)' } }, aviso) : null);
    const dlg = md ? modal('Publicar el catálogo de documentos', () => setMd(null),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, h('p', { style: { margin: 0, fontSize: 14, color: T.body } }, 'Se publica la versión ' + ((Number(C.version) || 0) + 1) + ' del catálogo. Los documentos en Vigente quedan disponibles para las plantillas; los en Borrador, no.'),
        lab('Motivo del cambio', 'dc-mot', h('textarea', { id: 'dc-mot', rows: 3, value: md.mot, 'aria-invalid': md.tried && !md.mot.trim() ? 'true' : 'false', onChange: (e) => setMd(Object.assign({}, md, { mot: e.target.value })), style: Object.assign({}, inS, { height: 'auto', padding: 8, width: '100%' }) })),
        md.tried && !md.mot.trim() ? h('span', { role: 'alert', style: { fontSize: 12.5, fontWeight: 700, color: 'var(--color-danger, #b3261e)' } }, 'Escribe el motivo del cambio.') : null),
      h('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } }, btn('Cancelar', () => setMd(null)), btn('Publicar', () => { if (!md.mot.trim()) { setMd(Object.assign({}, md, { tried: true })); return; } publicar(md.mot.trim()); }, { primary: true, id: 'dc-mot-ok' }))) : null;
    return h('section', { id: 'pc-docs', 'aria-labelledby': 'dc-h', 'data-doc-catalogo': C.version || 0, style: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('h2', { id: 'dc-h', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Documentos del cliente'),
        h('p', { style: { margin: 0, fontSize: 13.5, color: T.muted } }, 'Catálogo global de documentos que el cliente fotografía en los portales de agendamiento y de autoinspección. Cada plantilla decide cuáles pide y cuáles ofrece como «Otro documento».')),
      h('div', { className: 'sir-dc-grid', style: { display: 'grid', gridTemplateColumns: 'minmax(220px,280px) minmax(0,1fr) minmax(250px,290px)', gap: 20, alignItems: 'start' } },
        card(null, lista), card(null, editor, pie), card(null, prev)),
      h('style', null, '@media (max-width:1180px){.sir-dc-grid{grid-template-columns:minmax(220px,260px) minmax(0,1fr)!important}.sir-dc-grid>section:last-child{grid-column:1 / -1}}'),
      dlg); }

  W.SiriusModTabla = SiriusModTabla; W.SiriusCuandoSeOfrece = SiriusCuandoSeOfrece; W.SiriusDocUso = SiriusDocUso; W.SiriusDocCatalogo = SiriusDocCatalogo;
})();
