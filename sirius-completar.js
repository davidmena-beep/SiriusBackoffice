// SIRIUS · Completar el informe y Control de calidad de la agencia (etapa C2-3 · DEC-180).
// Lee SIRIUS_COMPLETAR (datos-completar-informe.js), SIRIUS_FLUJO (plazo) y SiriusUsuarios (agencia, opción y facultad). Piezas:
// - SiriusCompletar: quién completa, facultad, resultado de cada decisión y lo que pasó en la sesión (guardados, devoluciones y completados).
// - SiriusCompletarBandeja: bandeja «Informes por completar» (Por completar · Devueltos al inspector · Completados de los últimos 30 días).
// - Etapa C2-3b (disposición): SiriusCompletarDecision (sección «Criterio y decisión», última del centro), SiriusCompletarEvidencias (panel
//   derecho plegable: evidencias de campo o insumos de campo de Ramos Generales, con «Cargar insumos») y SiriusCompletarBarra (barra de acción fija).
// - SiriusCompletarOperacion: tarjeta «Operación» de la ficha de la agencia (opción «Sus inspectores completan su propio informe»).
(function () {
  if (window.SiriusCompletar) return;
  const R = () => window.React, h = (...a) => R().createElement(...a), NS = () => window.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const D = () => window.SIRIUS_COMPLETAR || { casos: {}, decisionesCC: [], determinacion: [], reglas: [], plazo: { horas: 24, alertaPct: 80 } };
  const EJ = () => window.SIRIUS_EJEMPLO || {}, SU = () => window.SiriusUsuarios || null, F = () => window.SIRIUS_FLUJO || null;
  const pad = (n) => String(n).padStart(2, '0');
  const ahoraIso = () => { const d = EJ().ahora ? EJ().ahora() : new Date(2026, 9, 18, 20, 30); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  const fmt = (s) => s ? s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(2, 4) + ' · ' + s.slice(11, 16) : '';
  const CC = 'Control de calidad (agencia)';

  // ---------- Lógica ----------
  const S = { ses: {}, oy: [] }; // ses[id] = { guardados: [{ at, por }], decision, completado, devuelto, criterio }
  const SC = {};
  SC.on = (fn) => { S.oy.push(fn); return () => { S.oy = S.oy.filter(x => x !== fn); }; };
  const avisar = () => S.oy.slice().forEach(f => { try { f(); } catch (e) {} });
  SC.reset = () => { S.ses = {}; avisar(); };
  SC.snap = () => JSON.parse(JSON.stringify(S.ses));
  SC.restore = (x) => { S.ses = x || {}; avisar(); };
  SC.datos = () => D();
  SC.ses = (id) => S.ses[id] || (S.ses[id] = { guardados: [] });
  SC.info = (id) => { const k = (D().casos || {})[id] || (S.ses[id] && (S.ses[id].visitaFin || S.ses[id].devuelto || S.ses[id].completado) ? {} : null); /* C2-4: también los casos que terminaron su visita en la sesión */ if (!k) return null; const s = S.ses[id] || {}; return Object.assign({}, k, s.devuelto ? { devuelto: s.devuelto } : {}, s.completado ? { completado: s.completado } : {}, s.visitaFin ? { visitaFin: s.visitaFin } : {}); };
  SC.fmt = fmt;
  SC.ahora = ahoraIso;
  // Inspector de la visita: el que llega en el caso (inspectorVisita), la visita realizada o el responsable.
  // Etapa C2-5 · casos de la conexión: inspector { nombre, tipo, agencia } y vence (ISO del plazo de 24 h hábiles). Las agencias se comparan por nombre,
  // sin mayúsculas, tildes ni sufijos societarios («S.A.», «Cía. Ltda.», «C.A.»…).
  const insObj = (c) => c && c.inspector && typeof c.inspector === 'object' ? c.inspector : null;
  SC.limpiarAgencia = (x) => String(x || '').replace(/[\s,]+(s\.?\s?a\.?s?|c[ií]a\.?\s*ltda\.?|ltda\.?|c\.?\s?a\.?)\s*$/i, '').trim();
  const normAg = (x) => { const a = SU() && x ? SU().agencia(x) : null; return SC.limpiarAgencia(a ? a.nombre : x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
  SC.mismaAgencia = (a, b) => { const x = normAg(a), y = normAg(b); return !!x && x === y; };
  const TIPOS = { interno: 'Interno', independiente: 'Externo', externo: 'Externo', agencia: 'Agencia', 'de agencia': 'Agencia' };
  SC.tipoDe = (c) => { const o = insObj(c); if (o) return { tipo: TIPOS[String(o.tipo || '').toLowerCase()] || o.tipo || '', ag: o.agencia || '' }; return SC.tipoInspector(SC.inspectorDe(c)); };
  SC.agenciaDeCaso = (c) => { const o = insObj(c); if (o) return o.agencia || ''; return SC.agenciaId(SC.inspectorDe(c)); };
  SC.inspectorDe = (c) => { if (!c) return ''; const o = insObj(c); if (o) return o.nombre || ''; if (c.inspectorVisita) return c.inspectorVisita; const v = ((EJ().visitas || {})[c.id] || []).find(x => x.estado !== 'Cancelada'); return v ? v.inspector : (c.responsable || ''); };
  SC.tipoInspector = (n) => { const i = (EJ().inspectores || []).find(x => x.n === n); if (i) return { tipo: i.tipo, ag: i.ag || '' }; const u = SU() && SU().usuario(n); return u ? { tipo: u.tipo, ag: u.agencia ? ((SU().agencia(u.agencia) || {}).nombre || '') : '' } : { tipo: '', ag: '' }; };
  SC.agenciaId = (n) => { const t = SC.tipoInspector(n); if (t.tipo !== 'Agencia' || !SU()) return ''; const a = SU().agenciaDeInspector(t.ag); return a ? a.id : ''; };
  SC.agenciaNombre = (id) => { const a = id && SU() ? SU().agencia(id) : null; return a ? a.nombre.replace(/ S\.A\.$| Cía\. Ltda\.$/, '') : ''; };
  // Quién completa: interno o independiente → el inspector; de agencia → Control de calidad de su agencia, o el inspector si la opción estaba en Sí al terminar la visita.
  SC.quienCompleta = (c) => { const n = SC.inspectorDe(c), t = SC.tipoDe(c), info = SC.info(c && c.id) || {}, fin = info.visitaFin || '';
    if (t.tipo !== 'Agencia') return { tipo: 'inspector', nombre: n, agencia: '', texto: n + ' (' + (t.tipo === 'Externo' ? 'independiente' : t.tipo ? t.tipo.toLowerCase() : 'inspector') + ')' };
    const agC = SC.agenciaDeCaso(c), agK = SU() && agC ? ((SU().agencias ? SU().agencias() : []).find(a => SC.mismaAgencia(a.id, agC)) || {}).id || (SU().agencia(agC) ? agC : '') : '', ag = agK || agC, propio = SU() && agK ? SU().completaPropioEn(agK, fin) : false, cc = SU() && agK ? SU().controlCalidadDe(agK) : [];
    if (propio) return { tipo: 'inspector', nombre: n, agencia: ag, texto: n + ' (la agencia permite que complete su informe)' };
    const agN = SC.agenciaNombre(agK) || SC.limpiarAgencia(agC), q = cc[0] ? cc[0].nombre : 'Control de calidad de ' + agN; return { tipo: 'cc', nombre: q, agencia: ag, texto: q + ' · Control de calidad de ' + agN }; };
  // Quién ve y completa: Administrador (todo); Control de calidad (los de los inspectores de su agencia, aunque la agencia permita que completen ellos); inspector (los suyos si le toca).
  SC.puede = (c, usuario, rolBase, agUsuario) => { if (!c) return false; if (rolBase === 'Administrador') return true; const n = SC.inspectorDe(c), q = SC.quienCompleta(c);
    if (rolBase === CC) { const u = SU() && SU().usuario(usuario), a = agUsuario || (u ? u.agencia : ''), b = SC.agenciaDeCaso(c); return !!a && !!b && (a === b || SC.mismaAgencia(a, b)); }
    if (rolBase === 'Inspector') return q.tipo === 'inspector' && n === usuario; return false; };
  SC.esVisible = (c, usuario, rolBase) => SC.puede(c, usuario, rolBase) || (rolBase === 'Inspector' && SC.inspectorDe(c) === usuario);
  // Facultad del inspector (Vehículos: Niveles de calificación; Ramos Generales no tiene facultad del inspector).
  SC.facultad = (c) => { const n = SC.inspectorDe(c), rg = c && c.ramo !== 'Vehículos', f = !rg && SU() ? SU().facultadDe(n) : null, fac = f ? f.fac : 'Sin facultad';
    const p = { Asegurable: /Asegurable/.test(fac) && fac !== 'Sin facultad', 'No asegurable': /No asegurable/.test(fac) };
    return { texto: rg ? 'Sin facultad en Ramos Generales' : fac, desde: f ? f.desde : '', permite: p, ambito: rg ? 'Ramos Generales' : 'Vehículos' }; };
  // Resultado de una decisión: destino del caso y asegurabilidad.
  SC.resultado = (c, decision, criterio) => { const fac = SC.facultad(c), ci = (c && c.criterioInspector) || {};
    if (decision === 'devolver') return { destino: 'Devuelto al inspector', texto: 'Vuelve al inspector con tu motivo; el plazo se reinicia cuando lo reenvíe.' };
    if (decision === 'cambiar') return { destino: 'Pendiente calificación', aseg: criterio, texto: 'Va a calificación con los dos criterios (inspector: ' + (ci.valor || '—') + ' · Control de calidad: ' + (criterio || '—') + ').' };
    const v = decision === 'confirmar' ? ci.valor : criterio; if (!v) return { destino: '', texto: '' };
    if (v === 'Enviar a calificación') return { destino: 'Pendiente calificación', texto: 'Va a calificación; el Ejecutivo de inspecciones decide.' };
    if (fac.permite[v]) return { destino: 'Inspeccionado', aseg: v, texto: 'Pasa a Inspeccionado como ' + v + ' (dentro de la facultad: ' + fac.texto + ').' };
    return { destino: 'Pendiente calificación', aseg: v, texto: v + ' está fuera de la facultad (' + fac.texto + '): va a calificación.' }; };
  SC.plazo = (c, escena) => { const Fx = F(); if (!Fx || !c) return null; if (c.vence && Fx.minutosHabiles && Fx.formato) { const m = String(c.vence).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); if (m) { const v = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]), a = EJ().ahora ? EJ().ahora() : new Date(), mn = v >= a ? Fx.minutosHabiles(a, v, c.sucursal) : -Fx.minutosHabiles(v, a, c.sucursal), hr = mn / 60; return Object.assign({ horas: hr, vence: v, plazo: 24, usado: Math.max(0, Math.round((24 - hr) / 24 * 100)) }, Fx.formato(hr, v, 24 * .2)); } } /* etapa C2-5: «vence» de la conexión */ const r = Fx.calcular(c, escena); if (!r) return null; return r; };
  SC.registrarGuardado = (id, por) => { const s = SC.ses(id); s.guardados.unshift({ at: ahoraIso(), por }); avisar(); };
  SC.registrarDecision = (id, d) => { const s = SC.ses(id); if (d.decision === 'devolver') s.devuelto = { at: ahoraIso(), por: d.por, motivo: d.motivo }; else s.completado = { at: ahoraIso(), por: d.por, rol: d.rol, decision: d.decision, criterio: d.criterio, resultado: d.resultado, motivo: d.motivo || '' }; avisar(); };
  SC.registrarInsumo = (id, x) => { const s = SC.ses(id); (s.insumos = s.insumos || []).push(x); avisar(); }; // etapa C2-3b: «Cargar insumos»
  SC.terminada = (id, at) => { const s = SC.ses(id); s.visitaFin = at || ahoraIso(); delete s.devuelto; avisar(); }; // etapa C2-4: fin de la visita en la app
  SC.reenviado = (id) => { const s = SC.ses(id); s.visitaFin = ahoraIso(); delete s.devuelto; avisar(); };
  SC.completadoReciente = (info) => { if (!info || !info.completado) return false; const d = (D().bandeja || {}).diasCompletados || 30, a = new Date(info.completado.at), n = EJ().ahora ? EJ().ahora() : new Date(); return (n - a) / 86400000 <= d; };
  window.SiriusCompletar = SC;

  // ---------- Piezas visuales ----------
  const chip = (txt, tone) => { const B = NS().Badge; const sp = h('span', { style: { whiteSpace: 'nowrap' } }, txt); return B ? h(B, { tone }, sp) : sp; };
  const tonoCriterio = (v) => v === 'Asegurable' ? 'success' : v === 'No asegurable' ? 'danger' : 'warning';
  const card = (titulo, kids, extra) => h('section', Object.assign({ 'aria-label': titulo, style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', minWidth: 0 } }, extra || {}), h('h3', { style: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, titulo), kids);
  const barra = (pct, color) => h('div', { 'aria-hidden': 'true', style: { height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-200)', overflow: 'hidden' } }, h('div', { style: { width: Math.max(0, Math.min(100, pct)) + '%', height: '100%', background: color } }));
  const tonoColor = (t) => t === 'danger' ? 'var(--color-danger)' : t === 'warning' ? 'var(--color-warning)' : 'var(--color-success)';

  // Bandeja: filas = [{ id, bien, inspector, agencia, visita, criterio: { valor, comentario }, avance: { txt, pct }, plazo: { etiqueta, tono, titulo, orden }, accion }]
  class Bandeja extends R().Component {
    constructor(p) { super(p); this.state = { tab: p.pestana || 0 }; }
    componentDidUpdate(pp) { if (pp.pestana !== this.props.pestana && this.props.pestana != null) this.setState({ tab: this.props.pestana }); }
    render() { const p = this.props, tabs = p.pestanas || [], i = this.state.tab, filas = (tabs[i] || {}).filas || [], B = NS().Button;
      const th = (t, w) => h('th', { scope: 'col', style: { textAlign: 'left', padding: '10px 12px', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', width: w || 'auto', borderBottom: '1px solid var(--border-default)' } }, t);
      const td = (k, kids, st) => h('td', { key: k, style: Object.assign({ padding: '12px', fontSize: 14, color: 'var(--text-body)', verticalAlign: 'top', borderBottom: '1px solid var(--border-subtle)' }, st || {}) }, kids);
      return h('div', { 'data-completar-bandeja': '', style: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('h1', { style: { margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-strong)' } }, p.titulo || 'Informes por completar'), p.intro ? h('p', { style: { margin: 0, fontSize: 15, color: 'var(--text-body)', maxWidth: 820 } }, p.intro) : null),
        h('div', { role: 'tablist', 'aria-label': 'Pestañas de la bandeja', style: { display: 'flex', flexWrap: 'wrap', gap: 24, borderBottom: '1px solid var(--border-default)' } }, tabs.map((t, k) => h('button', { key: k, type: 'button', role: 'tab', id: 'cp-tab-' + k, 'aria-selected': k === i ? 'true' : 'false', 'aria-controls': 'cp-panel', onClick: () => { this.setState({ tab: k }); if (p.onPestana) p.onPestana(k); },
          style: { appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 12px', marginBottom: -1, fontFamily: 'var(--font-brand)', fontSize: 15, fontWeight: k === i ? 700 : 500, color: k === i ? 'var(--text-strong)' : 'var(--text-muted)', borderBottom: '3px solid ' + (k === i ? 'var(--color-brand)' : 'transparent'), whiteSpace: 'nowrap' } }, t.label + ' (' + t.filas.length + ')'))),
        h('div', { id: 'cp-panel', role: 'tabpanel', 'aria-labelledby': 'cp-tab-' + i, style: { minWidth: 0 } },
          filas.length ? h('div', { style: { overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse', minWidth: 900 } },
            h('caption', { style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, (tabs[i] || {}).label + ', ordenados por plazo'),
            h('thead', null, h('tr', null, th('Caso', 80), th('Bien'), th('Inspector'), th(i === 2 ? 'Completado' : i === 1 ? 'Devuelto' : 'Visita terminada', 130), th('Criterio del inspector'), th('Avance', 150), th(i === 0 ? 'Plazo' : i === 1 ? 'Motivo' : 'Resultado', i === 0 ? 120 : 'auto'), th(h('span', { style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Acción'), 120))),
            h('tbody', null, filas.map(f => h('tr', { key: f.id },
              td('c', h('a', { href: '#caso-' + f.id, onClick: (e) => { e.preventDefault(); if (p.onAbrir) p.onAbrir(f.id); }, style: { fontWeight: 700, whiteSpace: 'nowrap' } }, f.id)),
              td('b', h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('span', { style: { fontWeight: 600, color: 'var(--text-strong)' } }, f.bien), h('span', { style: { fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, f.sub || ''))),
              td('i', h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2 } }, h('span', null, f.inspector), h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, f.agencia || ''))),
              td('v', h('span', { style: { whiteSpace: 'nowrap' } }, f.visita)),
              td('k', h('span', { style: { display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' } }, chip(f.criterio.valor, tonoCriterio(f.criterio.valor)), f.criterio.comentario ? h('span', { style: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 } }, '«' + f.criterio.comentario + '»') : null)),
              td('a', f.avance ? h('span', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('span', { style: { fontSize: 13, whiteSpace: 'nowrap' } }, f.avance.txt), barra(f.avance.pct, f.avance.pend ? 'var(--color-warning)' : 'var(--color-success)'), h('span', { style: { fontSize: 12, color: f.avance.pend ? 'var(--color-warning-strong, #8a5a00)' : 'var(--text-muted)' } }, f.avance.pendTxt || '')) : '—'),
              td('p', i === 0 && f.plazo ? h('span', { title: f.plazo.titulo, style: { display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' } }, chip(f.plazo.etiqueta, f.plazo.tono), h('span', { style: { fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, 'usado ' + f.plazo.usado + ' %')) : h('span', { style: { fontSize: 13, lineHeight: 1.4 } }, f.nota || '—')),
              td('x', B ? h(B, { variant: i === 0 ? 'primary' : 'secondary', size: 'sm', onClick: () => p.onAbrir && p.onAbrir(f.id), 'aria-label': (i === 0 ? 'Completar el informe del caso ' : 'Ver el caso ') + f.id }, i === 0 ? 'Completar' : 'Ver') : null, { textAlign: 'right' })))))) :
            h('div', { style: { padding: '28px 20px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 4 } }, h('strong', { style: { fontSize: 16, color: 'var(--text-strong)' } }, (tabs[i] || {}).vacio || 'No hay casos en esta pestaña'), h('span', { style: { fontSize: 14, color: 'var(--text-muted)' } }, 'Aquí aparecen los casos cuando termina la visita en la app.'))),
        p.nota ? h('p', { style: { margin: 0, fontSize: 13, color: 'var(--text-muted)' } }, p.nota) : null); }
  }

  // ---------- Etapa C2-3b · disposición de completar el informe (ajuste de DEC-180) ----------
  // Pendientes de la sección «Criterio y decisión» según el rol (lo usa el back-office para la barra de acción).
  SC.decisionPendiente = (modo, v, ci) => { v = v || {}; const m = String(v.motivo || '').trim().length >= 10;
    if (modo === 'cc') { if (!v.decision) return 'Elige tu decisión'; if (v.decision === 'cambiar' && !v.criterio) return 'Elige el nuevo criterio'; if ((v.decision === 'cambiar' || v.decision === 'devolver') && !m) return 'Escribe el motivo en las observaciones'; return ''; }
    if (modo === 'determinar') { if (!v.criterio) return 'Elige tu determinación'; if (v.criterio === 'No asegurable' && !m) return 'Escribe el motivo en las observaciones'; return ''; }
    return ''; };
  // Sección «Criterio y decisión» (última del centro). Controlada: valor { decision, criterio, motivo } y onCambio(parche).
  // modo: 'cc' (Control de calidad) · 'determinar' (inspector interno o independiente) · 'lectura' (devuelto, completado o sin permiso).
  class Decision extends R().Component {
    render() { const p = this.props, v = p.valor || {}, cc = p.modo === 'cc', lect = p.modo === 'lectura', ci = p.criterio || {}, fac = p.facultad || { permite: {} }, D0 = D(), set = (o) => p.onCambio && p.onCambio(o);
      const pend = !lect && SC.decisionPendiente(p.modo, v, ci), tried = !!p.marcar && !!pend;
      const dec = cc ? v.decision : 'determinar', res = !lect && (cc ? v.decision : v.criterio) ? SC.resultado(p.casoObj, dec, cc && v.decision === 'confirmar' ? '' : v.criterio) : null;
      const pideMot = (cc && (v.decision === 'cambiar' || v.decision === 'devolver')) || (!cc && v.criterio === 'No asegurable'), motErr = tried && pideMot && String(v.motivo || '').trim().length < 10;
      const opt = (id, val, titulo, desc, on, pick, extra) => h('label', { key: id, htmlFor: id, style: { display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '2px 10px', padding: '9px 12px', border: '1.5px solid ' + (on ? 'var(--color-brand)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-sm)', background: on ? 'var(--cyan-50, #F0FAFE)' : '#FFFFFF', cursor: 'pointer' } },
        h('input', { type: 'radio', id, name: cc ? 'cp-dec' : 'cp-det', value: val, checked: on, onChange: pick, 'aria-describedby': id + '-d', style: { width: 18, height: 18, margin: '2px 0 0', accentColor: 'var(--color-brand)' } }), h('span', { style: { fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, titulo), h('span', { id: id + '-d', style: { gridColumn: 2, fontSize: 13, lineHeight: 1.4, color: 'var(--text-muted)' } }, desc), extra || null);
      const criterioBox = h('div', { 'data-cp-criterio': '', style: { display: 'flex', flexDirection: 'column', gap: 6, padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--surface-subtle)', minWidth: 0 } },
        h('strong', { style: { fontSize: 14, color: 'var(--text-strong)' } }, 'Criterio del inspector en campo'), h('div', null, chip(ci.valor || 'Sin criterio', tonoCriterio(ci.valor))),
        ci.comentario ? h('p', { style: { margin: 0, fontSize: 14, lineHeight: 1.45, color: 'var(--text-body)' } }, '«' + ci.comentario + '»') : null,
        h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, (ci.por || '—') + (p.yo ? ' (tú)' : '') + ' · ', h('span', { style: { whiteSpace: 'nowrap' } }, ci.hora || '')),
        !cc && !lect ? h('span', { style: { fontSize: 13, color: 'var(--text-body)', marginTop: 4 } }, 'Tu facultad (' + (fac.ambito || 'Vehículos') + '): ', h('strong', null, fac.texto)) : null);
      let lado;
      if (lect) lado = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 } }, h('strong', { style: { fontSize: 14, color: 'var(--text-strong)' } }, p.lecturaTitulo || 'Decisión'), (p.lectura || []).map((l, k) => h('p', { key: k, style: { margin: 0, fontSize: 14, lineHeight: 1.45, color: 'var(--text-body)' } }, l)));
      else { const ops = cc ? (D0.decisionesCC || []).map(o => opt('cp-dec-' + o.id, o.id, o.titulo, o.desc, v.decision === o.id, () => set({ decision: o.id, criterio: o.id === 'cambiar' ? (ci.valor === 'Asegurable' ? 'No asegurable' : 'Asegurable') : '' }),
            o.id === 'cambiar' && v.decision === 'cambiar' ? h('div', { role: 'radiogroup', 'aria-label': 'Nuevo criterio', style: { gridColumn: 2, display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 } }, ['Asegurable', 'No asegurable'].filter(x => x !== ci.valor).map((x, k) => h('label', { key: x, htmlFor: 'cp-crit-' + k, style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1.5px solid ' + (v.criterio === x ? 'var(--color-brand)' : 'var(--border-default)'), borderRadius: 'var(--radius-pill)', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' } }, h('input', { type: 'radio', id: 'cp-crit-' + k, name: 'cp-crit', checked: v.criterio === x, onChange: () => set({ criterio: x }), style: { accentColor: 'var(--color-brand)' } }), x))) : null))
          : (D0.determinacion || []).map((o, k) => opt('cp-crit-' + k, o.id, o.id, o.id === 'Asegurable' || o.id === 'No asegurable' ? (fac.permite[o.id] ? o.desc : 'Fuera de tu facultad: va a calificación.') : o.desc, v.criterio === o.id, () => set({ criterio: o.id })));
        lado = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 } },
          h('div', { role: 'radiogroup', 'aria-label': cc ? 'Decisión del Control de calidad' : 'Determinación del inspector', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, ops),
          h('label', { htmlFor: 'cp-motivo', style: { marginTop: 4, fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Observaciones para el calificador', pideMot ? h('span', null, ' · motivo obligatorio', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')) : null),
          h('textarea', { id: 'cp-motivo', rows: 3, value: v.motivo || '', onChange: (e) => set({ motivo: e.target.value }), 'aria-invalid': motErr ? 'true' : 'false', 'aria-describedby': 'cp-motivo-h', placeholder: v.decision === 'devolver' ? 'Ej. La foto del VIN no se lee; vuelve a tomarla.' : 'Escribe aquí', style: { width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1.5px solid ' + (motErr ? 'var(--color-danger)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14, lineHeight: 1.45, color: 'var(--text-strong)', resize: 'vertical', background: '#FFFFFF' } }),
          h('span', { id: 'cp-motivo-h', style: { fontSize: 12, color: motErr ? 'var(--color-danger)' : 'var(--text-muted)' } }, motErr ? 'Escribe el motivo (al menos 10 caracteres).' : pideMot ? 'Motivo obligatorio · queda en el Historial del caso.' : 'Opcional · queda en el Historial del caso.'),
          res && res.texto ? h('p', { 'aria-live': 'polite', style: { margin: 0, padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid var(--border-subtle)', fontSize: 13, lineHeight: 1.45, color: 'var(--text-body)' } }, h('strong', null, 'Resultado: '), res.texto) : null); }
      return h('section', { id: 'cp-dec-sec', tabIndex: -1, 'aria-labelledby': 'cp-dec-t', 'data-cp-decision': '', style: { display: 'flex', flexDirection: 'column', gap: 0, border: '2px solid var(--color-brand)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: tried ? '0 0 0 4px var(--cyan-100, #CCF0FB)' : 'none', outline: 'none', minWidth: 0, scrollMarginTop: 140 } },
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '12px 16px', background: 'var(--cyan-50, #F0FAFE)', borderBottom: '1px solid var(--border-subtle)' } },
          h('h3', { id: 'cp-dec-t', style: { margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-strong)' } }, 'Criterio y decisión'), lect ? null : chip(pend ? 'Pendiente' : 'Lista', pend ? 'warning' : 'success')),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', alignItems: 'start', gap: 16, padding: 16, background: '#FFFFFF' } }, criterioBox, lado),
        pend && tried ? h('p', { role: 'alert', style: { margin: 0, padding: '0 16px 14px', fontSize: 13, color: 'var(--color-danger)', background: '#FFFFFF' } }, pend + '.') : null); }
  }

  // Panel derecho plegable: evidencias de campo (Vehículos) o insumos de campo (Ramos Generales). Contraído deja una franja con el botón.
  class Evidencias extends R().Component {
    constructor(p) { super(p); this.state = { carga: null, err: false }; }
    render() { const p = this.props, ab = !!p.abierto, B = NS().Button, s = this.state, tit = p.titulo || 'Evidencias de campo';
      const tog = h('button', { type: 'button', onClick: () => p.onToggle && p.onToggle(!ab), 'aria-expanded': ab ? 'true' : 'false', 'aria-controls': 'cp-ev-cuerpo', 'aria-label': (ab ? 'Contraer ' : 'Expandir ') + tit.toLowerCase(), title: (ab ? 'Contraer ' : 'Expandir ') + tit.toLowerCase(), style: { width: 32, height: 32, flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', cursor: 'pointer', color: 'var(--text-strong)' } },
        h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: ab ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6' })));
      if (!ab) return h('aside', { 'aria-label': tit, 'data-cp-ev': 'cerrado', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '10px 0', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', minHeight: 160 } }, tog,
        h('span', { 'aria-hidden': 'true', style: { writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, tit));
      const thumbs = (L, n) => h('ul', { 'aria-hidden': 'true', style: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 } }, L.slice(0, n).map((m, k) => h('li', { key: k, title: m, style: { aspectRatio: '4 / 3', borderRadius: 6, background: 'var(--neutral-100)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-end', padding: 3, overflow: 'hidden' } }, h('span', { style: { fontSize: 10, lineHeight: 1.2, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' } }, m))));
      const grupo = (g, k) => h('div', { key: k, style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('strong', { style: { fontSize: 13, color: 'var(--text-strong)' } }, g.titulo + ' · ' + g.n + (g.n === 1 ? ' foto' : ' fotos')), g.nota ? h('span', { style: { fontSize: 12, lineHeight: 1.4, color: 'var(--text-muted)' } }, '«' + g.nota + '»' + (g.por ? ' · ' + g.por : '')) : null, g.miniaturas && g.miniaturas.length ? thumbs(g.miniaturas, 6) : null, g.miniaturas && g.miniaturas.length > 6 ? h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, '+' + (g.miniaturas.length - 6) + ' más') : null);
      const gs = p.grupos || [], docs = p.documentos || [], ctl = p.controles || [], carg = p.cargados || [], sC = s.carga;
      const enviarCarga = () => { if (!sC.nombre.trim()) { this.setState({ err: true }, () => { const el = document.getElementById('cp-ins-nom'); if (el) el.focus(); }); return; } if (p.onCargar) p.onCargar({ grupo: sC.grupo, nombre: sC.nombre.trim(), tipo: sC.tipo }); this.setState({ carga: null, err: false }); };
      const campo = (id, label, kid) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id, style: { fontSize: 12, fontWeight: 700, color: 'var(--text-strong)' } }, label), kid);
      const inSt = { width: '100%', boxSizing: 'border-box', height: 36, padding: '0 8px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14, background: '#FFFFFF' };
      return h('aside', { 'aria-label': tit, 'data-cp-ev': 'abierto', style: { display: 'flex', flexDirection: 'column', minWidth: 0, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', maxHeight: p.maxH || 'none', overflow: 'hidden' } },
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' } }, h('h3', { style: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, tit), tog),
        h('div', { id: 'cp-ev-cuerpo', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', alignContent: 'start', gap: 14, padding: 12, overflowY: 'auto', minHeight: 0 } },
          p.puedeCargar ? (sC ? h('div', { 'data-cp-cargar': '', style: { display: 'flex', flexDirection: 'column', gap: 8, padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)' } },
              campo('cp-ins-tipo', 'Tipo', h('select', { id: 'cp-ins-tipo', value: sC.tipo, onChange: (e) => this.setState({ carga: Object.assign({}, sC, { tipo: e.target.value }) }), style: inSt }, ['Foto', 'Documento'].map(x => h('option', { key: x, value: x }, x)))),
              campo('cp-ins-grupo', 'Grupo', h('select', { id: 'cp-ins-grupo', value: sC.grupo, onChange: (e) => this.setState({ carga: Object.assign({}, sC, { grupo: e.target.value }) }), style: inSt }, gs.map(g => h('option', { key: g.titulo, value: g.titulo }, g.titulo)))),
              campo('cp-ins-nom', 'Archivo', h('input', { id: 'cp-ins-nom', type: 'text', value: sC.nombre, placeholder: 'Ej. planos-bodega.pdf', 'aria-invalid': s.err ? 'true' : 'false', onChange: (e) => this.setState({ carga: Object.assign({}, sC, { nombre: e.target.value }), err: false }), style: Object.assign({}, inSt, { borderColor: s.err ? 'var(--color-danger)' : 'var(--border-default)' }) })),
              s.err ? h('span', { role: 'alert', style: { fontSize: 12, color: 'var(--color-danger)' } }, 'Escribe el nombre del archivo.') : h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, 'Queda como evidencia del caso con canal «Back-office».'),
              h('div', { style: { display: 'flex', gap: 8 } }, B ? h(B, { variant: 'primary', size: 'sm', onClick: enviarCarga }, 'Cargar') : null, B ? h(B, { variant: 'ghost', size: 'sm', onClick: () => this.setState({ carga: null, err: false }) }, 'Cancelar') : null))
            : (B ? h(B, { variant: 'secondary', size: 'sm', fullWidth: true, onClick: () => this.setState({ carga: { tipo: 'Foto', grupo: (gs[0] || {}).titulo || '', nombre: '' } }) }, 'Cargar insumos (fotos y documentos)') : null)) : null,
          // Etapa C2-6 · DEC-184: con la fuente única, miniaturas por sección del informe (o módulo en RG) que abren el visor único.
          p.evCaso && window.SiriusEvidenciasSecciones ? h(window.SiriusEvidenciasSecciones, { caso: p.evCaso }) : gs.length ? gs.map(grupo) : h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, 'Sin fotos de campo.'),
          docs.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('strong', { style: { fontSize: 13, color: 'var(--text-strong)' } }, 'Documentos · ' + docs.length), h('span', { style: { fontSize: 12, lineHeight: 1.4, color: 'var(--text-muted)' } }, docs.join(' · '))) : null,
          carg.length ? h('div', { 'data-cp-cargados': '', style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('strong', { style: { fontSize: 13, color: 'var(--text-strong)' } }, 'Cargados en el back-office · ' + carg.length), carg.map((x, k) => h('span', { key: k, style: { fontSize: 12, lineHeight: 1.4, color: 'var(--text-muted)' } }, x.tipo + ' · ' + x.nombre + ' · ' + x.grupo + ' · ' + x.por + ' · ', h('span', { style: { whiteSpace: 'nowrap' } }, x.at)))) : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('strong', { style: { fontSize: 13, color: 'var(--text-strong)' } }, 'Controles'), ctl.length ? ctl.map(x => h('div', { key: x.id, style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, fontSize: 12, lineHeight: 1.4, color: 'var(--text-body)' } }, h('span', { style: { minWidth: 0 } }, x.texto), chip(x.estado, x.estado === 'Pendiente' ? 'warning' : 'success'))) : h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, 'Sin controles pendientes')),
          p.onVerTodo ? h('a', { href: '#evidencias', onClick: (e) => { e.preventDefault(); p.onVerTodo(); }, style: { fontSize: 14, fontWeight: 700, alignSelf: 'flex-start' } }, p.verTodoTxt || 'Ver en Evidencias') : null)); }
  }

  // Barra de acción fija (abajo): avance, pendientes, «Ir al siguiente pendiente», «Guardar borrador» y la acción principal.
  class Barra extends R().Component {
    render() { const p = this.props, B = NS().Button, n = p.pendientes || 0, pl = p.plazo;
      return h('div', { role: 'region', 'aria-label': 'Acciones del informe', 'data-cp-barra': '', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 14px', padding: '10px 16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', boxShadow: '0 -6px 18px rgba(11,46,89,.08)' } },
        h('div', { style: { flex: '1 1 320px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 12px', minWidth: 0 } },
          h('div', { 'aria-hidden': 'true', style: { width: 140, height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-200)', overflow: 'hidden', flex: '0 0 auto' } }, h('div', { style: { width: Math.max(0, Math.min(100, p.pct || 0)) + '%', height: '100%', background: n ? 'var(--color-warning)' : 'var(--color-success)' } })),
          h('span', { 'aria-live': 'polite', style: { fontSize: 14, color: 'var(--text-body)' } }, h('strong', { style: { color: 'var(--text-strong)' } }, n ? (n === 1 ? '1 pendiente para enviar' : n + ' pendientes para enviar') : 'Todo listo para enviar'), p.avanceTxt ? ' · ' + p.avanceTxt : ''),
          n ? h('button', { type: 'button', 'data-cp-siguiente': '', onClick: () => p.onSiguiente && p.onSiguiente(), style: { padding: 0, border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-link, var(--color-brand))', textDecoration: 'underline', cursor: 'pointer' } }, 'Ir al siguiente pendiente') : null,
          pl ? h('span', { title: pl.titulo + ' · alerta al 80 %; vencido pasa una tarea al Coordinador', style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, 'Plazo', chip(pl.etiqueta, pl.tono), 'usado ' + pl.usado + ' %') : null),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
          B ? h(B, { variant: 'secondary', size: 'md', onClick: () => p.onGuardar && p.onGuardar() }, 'Guardar borrador') : null,
          B ? h(B, { variant: 'primary', size: 'md', onClick: () => p.onEnviar && p.onEnviar(), unavailableReason: n ? (n === 1 ? 'Queda 1 pendiente: usa «Ir al siguiente pendiente»' : 'Quedan ' + n + ' pendientes: usa «Ir al siguiente pendiente»') : undefined, 'data-cp-enviar': '' }, p.etiqueta || 'Completar y enviar') : null)); }
  }

  // Tarjeta «Operación» de la ficha de la agencia.
  class Operacion extends R().Component {
    constructor(p) { super(p); this.state = { editando: false, valor: null, motivo: '', tried: false, v: 0 }; }
    componentDidMount() { const U = SU(); if (U && U.on) this.off = U.on(() => this.setState(s => ({ v: s.v + 1 }))); }
    componentWillUnmount() { if (this.off) this.off(); }
    render() { const p = this.props, U = SU(); if (!U) return null; const a = U.agencia(p.agencia), o = U.operacion(p.agencia); if (!a || !o) return null; const s = this.state, B = NS().Button, Sw = NS().Switch, cc = U.controlCalidadDe(a.id), ins = U.inspectoresDe(a.id).filter(x => x.roles.some(r => U.base(r) === 'Inspector'));
      const val = s.editando ? s.valor : o.completaInspector, motErr = s.tried && s.motivo.trim().length < 10, ed = !!p.editable;
      const guardar = () => { if (s.motivo.trim().length < 10) { this.setState({ tried: true }, () => { const el = document.getElementById('ag-op-mot'); if (el) el.focus(); }); return; } U.editarOperacion(a.id, s.valor, p.usuario || 'Andrea Salazar', s.motivo.trim()); this.setState({ editando: false, motivo: '', tried: false }); if (p.onAviso) p.onAviso('Opción guardada · aplica a las visitas que terminen desde ahora'); };
      const th = (t) => h('th', { scope: 'col', style: { textAlign: 'left', padding: '6px 8px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, t), td = (t, nw) => h('td', { style: { padding: '8px', fontSize: 14, color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: nw ? 'nowrap' : 'normal' } }, t);
      return h('section', { 'aria-label': 'Operación', 'data-operacion': '', style: { display: 'flex', flexDirection: 'column', gap: 12, padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' } },
        h('h3', { style: { margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' } }, 'Operación'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
          Sw ? h(Sw, { checked: !!val, label: 'Sus inspectores completan su propio informe', onChange: (e) => { const nv = typeof e === 'boolean' ? e : e && e.target ? e.target.checked : !val; if (!ed) return; this.setState({ editando: nv !== o.completaInspector, valor: nv, tried: false }); }, unavailableReason: ed ? undefined : 'Solo el Administrador cambia la operación de la agencia' }) : null,
          h('p', { style: { margin: 0, fontSize: 13, lineHeight: 1.45, color: 'var(--text-muted)' } }, 'Sí: el inspector de esta agencia completa su informe en el back-office (no en la app). No: lo completa el Control de calidad de la agencia. En ambos casos el Control de calidad puede devolver el informe con motivo. El cambio pide motivo, queda en el historial y aplica a los casos cuya visita termine desde ese momento.')),
        s.editando ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)' } },
          h('label', { htmlFor: 'ag-op-mot', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Motivo del cambio', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
          h('textarea', { id: 'ag-op-mot', rows: 2, value: s.motivo, onChange: (e) => this.setState({ motivo: e.target.value }), 'aria-invalid': motErr ? 'true' : 'false', 'aria-describedby': 'ag-op-mot-h', style: { width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1.5px solid ' + (motErr ? 'var(--color-danger)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14, resize: 'vertical' } }),
          h('span', { id: 'ag-op-mot-h', style: { fontSize: 12, color: motErr ? 'var(--color-danger)' : 'var(--text-muted)' } }, motErr ? 'Escribe el motivo (al menos 10 caracteres).' : (s.valor ? 'Sí' : 'No') + ' aplica a las visitas que terminen desde ahora; los casos ya en «Informe por completar» siguen con quien los tenía.'),
          h('div', { style: { display: 'flex', gap: 8 } }, B ? h(B, { variant: 'primary', size: 'sm', onClick: guardar }, 'Guardar cambio') : null, B ? h(B, { variant: 'ghost', size: 'sm', onClick: () => this.setState({ editando: false, motivo: '', tried: false }) }, 'Cancelar') : null)) : null,
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('h4', { style: { margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' } }, 'Control de calidad de la agencia'),
          h('table', { style: { width: '100%', borderCollapse: 'collapse' } }, h('thead', null, h('tr', null, th('Usuario'), th('Rol'), th('Estado'))), h('tbody', null, cc.map(u => h('tr', { key: u.nombre }, td(u.nombre), td('Control de calidad (agencia)'), td(chip(U.estadoEf(u), (U.estadoInfo(U.estadoEf(u)) || {}).badge || 'neutral'), true))).concat(ins.map(u => h('tr', { key: u.nombre }, td(u.nombre), td('Inspector (agencia)'), td(chip(U.estadoEf(u), (U.estadoInfo(U.estadoEf(u)) || {}).badge || 'neutral'), true)))))),
          cc.length ? null : h('span', { style: { fontSize: 13, color: 'var(--color-warning)' } }, 'La agencia no tiene usuario de Control de calidad: con la opción en No, nadie de la agencia puede completar los informes.')),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('h4', { style: { margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' } }, 'Historial de la opción'),
          (o.historial || []).length ? h('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 } }, o.historial.map((x, k) => h('li', { key: k, style: { fontSize: 13, lineHeight: 1.45, color: 'var(--text-body)' } }, h('span', { style: { whiteSpace: 'nowrap', fontWeight: 700 } }, fmt(x.fecha)), ' · ' + x.por + ' · ' + (x.de ? 'Sí' : 'No') + ' → ' + (x.a ? 'Sí' : 'No') + ' · ' + x.motivo))) : h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, 'Sin cambios: ' + (o.completaInspector ? 'Sí' : 'No') + ' desde el alta de la agencia.'))); }
  }
  window.SiriusCompletarBandeja = Bandeja;
  window.SiriusCompletarDecision = Decision;
  window.SiriusCompletarEvidencias = Evidencias;
  window.SiriusCompletarBarra = Barra;
  window.SiriusCompletarOperacion = Operacion;
})();
