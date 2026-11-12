// SIRIUS · Completado del informe por responsable (etapa P-6e-2 · DEC-207).
// Lee SIRIUS_COMPLETADO (datos-completado.js), SIRIUS_HONORARIOS (tarifa «Completado de informe»), SiriusUsuarios (agencias e independientes) y SiriusPublicar.
// · window.SiriusCompletado: reglas ordenadas (ramo, modalidad, sucursal, suma hasta → destino), el destino por defecto, el probador, el responsable de
//   cada caso (reglas, reasignación o lo que trae la base en informes[].responsable), la reasignación con motivo, la publicación y el honorario «Completado de informe».
// · Componentes: SiriusCompletado.Vista (Administración › Flujo › «Completado del informe»), SiriusCompletado.Linea (línea «Responsable del completado»
//   con «Reasignar…» en el caso) y SiriusCompletado.Reasignar (diálogo con destino, agencia o inspector y motivo obligatorio).
// Los cambios viven en memoria (al cambiar de escena vuelve lo del archivo con reset()). Con la conexión, la versión se publica con
// SiriusPublicar como SIRIUS_COMPLETADO = { version, reglas, porDefecto } y la reasignación va con accion('reasignarCompletado').
(function () {
  if (window.SiriusCompletado) return;
  const W = window, R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const D = () => W.SIRIUS_COMPLETADO || { reglas: [], porDefecto: { destino: 'interno', plazoHoras: 24 }, destinos: [], modalidades: [] };
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x));
  const pad = (n) => String(n).padStart(2, '0');
  const SU = () => W.SiriusUsuarios || null, HN = () => W.SiriusHonorarios || null;
  const ahoraIso = () => { const E = W.SIRIUS_EJEMPLO || {}, d = E.ahora ? E.ahora() : new Date(2026, 9, 18, 20, 30); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  const fmt = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d)[T ](\d\d):(\d\d)/.exec(s || ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + ' · ' + m[4] + ':' + m[5] : String(s || ''); };
  const nuevo = () => { const d = D(); return { reglas: clon(d.reglas || []), porDefecto: clon(d.porDefecto || { destino: 'interno', plazoHoras: 24 }), ver: d.version || 1, hist: [], reasig: {}, pub: null }; };
  let S = nuevo(), ON = [];
  const SCo = { ctx: { informe: () => null } };
  SCo.on = (f) => { ON.push(f); return () => { ON = ON.filter((x) => x !== f); }; };
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  SCo.avisar = avisar;
  SCo.reset = () => { S = nuevo(); avisar(); };
  SCo.snap = () => clon(S);
  SCo.restore = (x) => { S = x || nuevo(); avisar(); };
  SCo.datos = D;
  SCo.version = () => S.ver;
  SCo.reglas = () => clon(S.reglas);
  SCo.porDefecto = () => clon(S.porDefecto);
  SCo.hist = () => S.hist.slice();
  SCo.fmt = fmt;
  SCo.ahora = ahoraIso;

  // ---------- Catálogos de los selectores (todo sale de los datos del sistema) ----------
  SCo.ramos = () => { const E = W.SIRIUS_EJEMPLO || {}, n = ['Vehículos'].concat((E.ramos || []).map((r) => r.nombre)); return n.filter((x, i) => x && n.indexOf(x) === i); };
  SCo.sucursales = () => (((W.SIRIUS_EJEMPLO || {}).catalogos || {}).sucursales || []).map((x) => typeof x === 'string' ? x : x.nombre || x.n).filter(Boolean);
  SCo.modalidades = () => (D().modalidades || []).slice();
  SCo.agencias = () => { const U = W.SIRIUS_USUARIOS || {}; return (U.agencias || []).filter((a) => a.estado !== 'Inactiva').map((a) => ({ id: a.id, nombre: SCo.corta(a.nombre) })); };
  SCo.independientes = () => { const U = W.SIRIUS_USUARIOS || {}; return (U.usuarios || []).filter((u) => u.tipo === 'Externo' && (u.roles || []).some((r) => /Inspector/.test(r))).map((u) => u.nombre); };
  SCo.corta = (x) => String(x || '').replace(/\s+(S\.A\.|Cía\. Ltda\.|C\.A\.)$/i, '');
  SCo.agenciaId = (x) => { const a = SCo.agencias().find((y) => y.id === x || y.nombre === SCo.corta(x)); return a ? a.id : ''; };
  SCo.agenciaNombre = (x) => { const a = SCo.agencias().find((y) => y.id === x || y.nombre === SCo.corta(x)); return a ? a.nombre : SCo.corta(x); };
  SCo.destinos = () => (D().destinos || []).slice();
  SCo.destinoNombre = (id) => ((D().destinos || []).find((x) => x.id === id) || {}).nombre || id || '';
  const usd = (n) => (W.SIRIUS_COMPANIA && W.SIRIUS_COMPANIA.formatoMonto ? W.SIRIUS_COMPANIA.formatoMonto(n) : 'USD ' + Number(n).toFixed(2));
  SCo.usd = usd;

  // ---------- Reglas ----------
  SCo.coincide = (r, k) => { const m = [];
    if (r.ramo && r.ramo !== k.ramo) m.push('el ramo es ' + (k.ramo || 'otro'));
    if (r.modalidad && r.modalidad !== k.modalidad) m.push('la modalidad es ' + (k.modalidad || 'otra'));
    if (r.sucursal && r.sucursal !== k.sucursal) m.push('la sucursal es ' + (k.sucursal || 'otra'));
    if (r.sumaMax != null && !(Number(k.suma) <= Number(r.sumaMax))) m.push('la suma asegurada ' + (k.suma != null && k.suma !== '' ? usd(Number(k.suma)) : '(sin dato)') + ' supera ' + usd(Number(r.sumaMax)));
    return m; };
  SCo.reglaTxt = (r, i) => { const c = []; if (r.modalidad) c.push(r.modalidad); if (r.ramo) c.push(r.ramo); if (r.sucursal) c.push('en ' + r.sucursal); if (r.sumaMax != null) c.push('hasta ' + usd(Number(r.sumaMax))); return 'Regla ' + (i + 1) + ' · ' + (c.length ? c.join(' · ') : 'Cualquier caso'); };
  SCo.resolver = (k, reglas, pd) => { reglas = reglas || S.reglas; pd = pd || S.porDefecto;
    for (let i = 0; i < reglas.length; i++) { const r = reglas[i]; if (!SCo.coincide(r, k).length) return { destino: r.destino, agencia: r.agencia || '', inspector: r.inspector || '', plazoHoras: r.plazoHoras || 24, n: i, regla: SCo.reglaTxt(r, i) }; }
    return { destino: pd.destino || 'interno', agencia: '', inspector: '', plazoHoras: pd.plazoHoras || 24, n: null, regla: 'Por defecto' }; };
  SCo.trazas = (k, reglas) => (reglas || S.reglas).map((r, i) => ({ n: i, txt: SCo.reglaTxt(r, i), motivos: SCo.coincide(r, k) }));
  // Una regla no se aplica nunca si otra anterior ya la cubre (mismos criterios o más amplios).
  SCo.cubierta = (reglas, j) => { const b = reglas[j]; for (let i = 0; i < j; i++) { const a = reglas[i]; const ok = (!a.ramo || a.ramo === b.ramo) && (!a.modalidad || a.modalidad === b.modalidad) && (!a.sucursal || a.sucursal === b.sucursal) && (a.sumaMax == null || (b.sumaMax != null && Number(a.sumaMax) >= Number(b.sumaMax))); if (ok) return i; } return -1; };
  SCo.errorRegla = (r) => { if (!r.destino) return 'Elige el destino'; if (r.destino === 'agencia' && !r.agencia) return 'Elige la agencia'; if (r.destino === 'independiente' && !r.inspector) return 'Elige el inspector independiente'; if (!(Number(r.plazoHoras) >= 1)) return 'El plazo es de al menos 1 hora hábil'; return ''; };
  SCo.cambios = (reglas, pd) => { const out = [], a = S.reglas, b = reglas, f = (r) => SCo.reglaTxt(r, 0).replace(/^Regla \d+ · /, '') + ' → ' + SCo.destinoNombre(r.destino) + (r.destino === 'agencia' ? ' ' + SCo.agenciaNombre(r.agencia) : r.destino === 'independiente' ? ' ' + r.inspector : '') + ' · ' + r.plazoHoras + ' h hábiles';
    const n = Math.max(a.length, b.length); for (let i = 0; i < n; i++) { if (!a[i]) out.push('Regla ' + (i + 1) + ' nueva: ' + f(b[i])); else if (!b[i]) out.push('Regla ' + (i + 1) + ' eliminada: ' + f(a[i])); else if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) out.push('Regla ' + (i + 1) + ': ' + f(a[i]) + ' ⇒ ' + f(b[i])); }
    if (JSON.stringify(pd) !== JSON.stringify(S.porDefecto)) out.push('Por defecto: ' + S.porDefecto.plazoHoras + ' h ⇒ ' + pd.plazoHoras + ' h hábiles'); return out; };
  // Publica una versión nueva con motivo; con la conexión va a la base como SIRIUS_COMPLETADO y, con { ok: false }, vuelve a la versión anterior.
  SCo.publicar = (reglas, pd, motivo, por) => { const prev = clon(S), ver = S.ver + 1, cambios = SCo.cambios(reglas, pd);
    S.reglas = clon(reglas); S.porDefecto = clon(pd); S.ver = ver; S.hist.unshift({ fecha: ahoraIso(), por: por || '', version: ver, motivo, cambios }); avisar();
    const SP = W.SiriusPublicar; if (SP && SP.activo()) SP.publicar({ clave: 'SIRIUS_COMPLETADO', version: ver, datos: { version: ver, reglas: clon(S.reglas), porDefecto: clon(S.porDefecto) }, motivo, pantalla: 'Flujo › Completado del informe',
      revertir: () => { S = prev; avisar(); }, alPublicar: (i) => { S.hist.unshift({ fecha: ahoraIso(), por: por || '', version: ver, motivo, cambios: ['Publicada en la base: versión ' + ver] }); avisar(); } });
    return { version: ver, cambios }; };

  // ---------- Responsable del completado de un caso ----------
  // Solo hay responsable cuando no hay inspector en sitio (hoy, la autoinspección): presencial sigue como antes (completa quien inspeccionó).
  SCo.esSinInspector = (c) => { if (!c) return false; const i = SCo.ctx.informe(c.id) || {}, v = c.visita && typeof c.visita === 'object' ? c.visita : {}; return [c.modalidad, v.modalidad, i.canal, (c.visitaMod || '')].some((x) => SCo.modalidades().indexOf(x) >= 0); };
  const suma = (c) => { const i = SCo.ctx.informe(c.id) || {}, r = i.respuestas || {}, x = r.veh_valor_asegurado_casco; const v = x && typeof x === 'object' ? x.valor : x; const n = Number(String(v == null ? '' : v).replace(/[^\d.-]/g, '')); return v != null && v !== '' && !isNaN(n) ? n : (c.suma != null ? Number(c.suma) : null); };
  SCo.llave = (c) => ({ ramo: c.ramo, modalidad: 'Autoinspección', sucursal: c.sucursal, suma: suma(c) });
  const armar = (x, fuente) => { const tipo = x.destino || x.tipo, ag = tipo === 'agencia' ? SCo.agenciaId(x.agencia) || x.agencia || '' : '', nom = tipo === 'independiente' ? (x.inspector || x.usuario || '') : tipo === 'agencia' ? SCo.agenciaNombre(ag) : '';
    const texto = tipo === 'agencia' ? 'Control de calidad de ' + nom : tipo === 'independiente' ? nom + ' (independiente)' : 'Interno · Ejecutivos de inspecciones';
    return { tipo, agencia: ag, nombre: nom, usuario: x.usuario || '', regla: x.regla || '', asignadoEn: x.asignadoEn || '', fuente, texto, plazoHoras: x.plazoHoras || 24 }; };
  SCo.responsable = (c) => { if (!c || !SCo.esSinInspector(c)) return null; const rs = S.reasig[c.id]; if (rs) return armar(rs, 'reasignado');
    const i = SCo.ctx.informe(c.id) || {}, b = i.responsable; if (b && b.tipo) return armar({ tipo: b.tipo, agencia: b.agencia, usuario: b.usuario, inspector: b.tipo === 'independiente' ? b.usuario : '', regla: b.regla || 'Por defecto', asignadoEn: b.asignadoEn }, 'base');
    const r = SCo.resolver(SCo.llave(c)); return armar(Object.assign({}, r, { asignadoEn: '' }), 'reglas'); };
  SCo.linea = (r) => r ? 'Responsable del completado: ' + r.texto + ' · ' + (r.fuente === 'reasignado' ? r.regla : r.regla && r.regla !== 'Por defecto' ? 'por la ' + r.regla.charAt(0).toLowerCase() + r.regla.slice(1) : 'por defecto') : '';
  SCo.reasignable = (rolBase) => rolBase === 'Coordinador de inspecciones' || rolBase === 'Administrador';
  SCo.reasignar = (c, d) => { const mot = String(d.motivo || '').trim(); if (!c || mot.length < 10) return false; const ant = SCo.responsable(c);
    S.reasig[c.id] = { destino: d.destino, agencia: d.destino === 'agencia' ? d.agencia : '', inspector: d.destino === 'independiente' ? d.inspector : '', usuario: d.destino === 'independiente' ? d.inspector : '', regla: 'Reasignado por ' + (d.por || '—') + (mot ? ' · ' + mot : ''), asignadoEn: ahoraIso(), plazoHoras: (ant && ant.plazoHoras) || 24 };
    avisar(); return true; };

  // ---------- Honorario «Completado de informe» ----------
  SCo.tarifa = (r) => { const H = HN(); return H && H.tarifaCompletado && r && r.tipo !== 'interno' ? H.tarifaCompletado(r.tipo, r.tipo === 'agencia' ? r.agencia : r.nombre) : null; };
  SCo.honorario = (c, r) => { const H = HN(); if (!H || !H.agregarCompletado || !r || r.tipo === 'interno') return null; return H.agregarCompletado({ caso: c.id, ramo: c.ramo, sucursal: c.sucursal, tipo: r.tipo, nombre: r.nombre, agencia: r.agencia, estadoCaso: c.estado, por: r.nombre }); };

  W.SiriusCompletado = SCo;

  // ---------- Piezas visuales ----------
  const T = { strong: 'var(--text-strong)', body: 'var(--text-body)', muted: 'var(--text-muted)', borde: 'var(--border-subtle)', bordeD: 'var(--border-default)', brand: 'var(--color-brand)' };
  const inS = { height: 40, boxSizing: 'border-box', padding: '0 8px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, color: T.strong, width: '100%', minWidth: 0 };
  const chip = (txt, tone) => { const B = NS().Badge; const sp = h('span', { style: { whiteSpace: 'nowrap' } }, txt); return B ? h(B, { tone }, sp) : sp; };
  const card = (id, kids, extra) => h('section', Object.assign({ 'data-comp-card': id, style: { display: 'flex', flexDirection: 'column', gap: 12, padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', minWidth: 0 } }, extra || {}), kids);
  const campo = (id, label, kid, nota) => h('div', { key: id, style: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 } }, h('label', { htmlFor: id, style: { fontSize: 13, fontWeight: 700, color: T.strong } }, label), kid, nota ? h('span', { style: { fontSize: 12, color: T.muted } }, nota) : null);
  const sel = (id, v, opts, on, extra) => h('select', Object.assign({ id, value: v == null ? '' : v, onChange: (e) => on(e.target.value), style: inS }, extra || {}), opts.map((o) => h('option', { key: o[0], value: o[0] }, o[1])));
  const Btn = (p) => { const B = NS().Button; return B ? h(B, Object.assign({ size: 'md' }, p), p.children) : h('button', { type: 'button', onClick: p.onClick }, p.children); };
  const link = (txt, on, o) => h('button', Object.assign({ type: 'button', onClick: on, style: { padding: 0, border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--text-link, var(--color-brand))', textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' } }, o || {}), txt);

  // Línea «Responsable del completado: … · por …» con «Reasignar…» (Resumen del caso y cabecera del informe).
  function Linea(p) { const r = p.responsable; if (!r) return null; const tar = SCo.tarifa(r);
    return h('div', { 'data-comp-linea': r.tipo, style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px', minWidth: 0, fontSize: 14, color: T.body } },
      h('span', { style: { minWidth: 0 } }, 'Responsable del completado: ', h('strong', { style: { color: T.strong } }, r.texto), ' · ', h('span', null, r.fuente === 'reasignado' ? r.regla : r.regla && r.regla !== 'Por defecto' ? 'por la ' + r.regla.charAt(0).toLowerCase() + r.regla.slice(1) : 'por defecto')),
      r.tipo !== 'interno' && p.mostrarTarifa ? h('span', { style: { fontSize: 13, color: T.muted } }, tar != null ? 'Honorario «Completado de informe»: ' + usd(tar) : 'Honorario «Completado de informe»: tarifa por definir') : null,
      p.puedeReasignar ? link('Reasignar…', p.onReasignar, { 'data-comp-reasignar': '', 'aria-label': 'Reasignar el completado del informe del caso ' + (p.caso || '') }) : null); }

  // Diálogo de reasignación: destino, agencia o inspector y motivo obligatorio (mínimo 10 caracteres).
  function Reasignar(p) { const M = W.SiriusModal, a = p.actual || {}, [v, setV] = R().useState({ destino: a.tipo || 'interno', agencia: a.agencia || '', inspector: a.tipo === 'independiente' ? a.nombre : '', motivo: '' }), [tried, setTried] = R().useState(false);
    R().useEffect(() => { if (p.open) { setV({ destino: a.tipo || 'interno', agencia: a.agencia || '', inspector: a.tipo === 'independiente' ? a.nombre : '', motivo: '' }); setTried(false); } }, [p.open, p.caso]);
    if (!M) return null; const mot = String(v.motivo || '').trim(), eMot = mot.length < 10, eDest = (v.destino === 'agencia' && !v.agencia) || (v.destino === 'independiente' && !v.inspector), mismo = v.destino === a.tipo && (v.destino === 'interno' || (v.destino === 'agencia' && v.agencia === a.agencia) || (v.destino === 'independiente' && v.inspector === a.nombre));
    const err = mismo ? 'Elige un destino distinto del actual' : eDest ? (v.destino === 'agencia' ? 'Elige la agencia' : 'Elige el inspector') : eMot ? 'Escribe el motivo (al menos 10 caracteres)' : '';
    const ok = () => { if (err) { setTried(true); return; } p.onConfirmar({ destino: v.destino, agencia: v.agencia, inspector: v.inspector, motivo: mot }); };
    const dn = SCo.destinos();
    return h(M, { open: !!p.open, onClose: p.onClose, size: 'md', title: 'Reasignar el completado del informe', description: 'Caso ' + (p.caso || '') + ' · hoy lo completa ' + (a.texto || '—') + '. El plazo no se reinicia.',
      footer: [h(Btn, { key: 'c', variant: 'ghost', onClick: p.onClose }, 'Cancelar'), h(Btn, { key: 'o', variant: 'primary', onClick: ok, 'data-comp-confirmar': '', unavailableReason: tried && err ? err : undefined }, 'Reasignar')] },
      h('div', { 'data-comp-dialogo': '', style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        h('div', { role: 'radiogroup', 'aria-label': 'Destino', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, dn.map((o) => h('label', { key: o.id, htmlFor: 'comp-ra-' + o.id, style: { display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '2px 10px', padding: '9px 12px', border: '1.5px solid ' + (v.destino === o.id ? 'var(--color-brand)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-sm)', background: v.destino === o.id ? 'var(--cyan-50, #F0FAFE)' : '#FFFFFF', cursor: 'pointer' } },
          h('input', { type: 'radio', id: 'comp-ra-' + o.id, name: 'comp-ra', checked: v.destino === o.id, onChange: () => setV(Object.assign({}, v, { destino: o.id })), style: { width: 18, height: 18, margin: '2px 0 0', accentColor: 'var(--color-brand)' } }), h('span', { style: { fontSize: 15, fontWeight: 700, color: T.strong } }, o.nombre), h('span', { style: { gridColumn: 2, fontSize: 13, lineHeight: 1.4, color: T.muted } }, o.desc)))),
        v.destino === 'agencia' ? campo('comp-ra-ag', 'Agencia', sel('comp-ra-ag', v.agencia, [['', 'Elige la agencia…']].concat(SCo.agencias().map((x) => [x.id, x.nombre])), (x) => setV(Object.assign({}, v, { agencia: x })), { 'aria-invalid': tried && eDest ? 'true' : 'false' }), 'Lo completa el Control de calidad de esa agencia.') : null,
        v.destino === 'independiente' ? campo('comp-ra-in', 'Inspector independiente', sel('comp-ra-in', v.inspector, [['', 'Elige el inspector…']].concat(SCo.independientes().map((x) => [x, x])), (x) => setV(Object.assign({}, v, { inspector: x })), { 'aria-invalid': tried && eDest ? 'true' : 'false' })) : null,
        campo('comp-ra-mot', 'Motivo ', h('textarea', { id: 'comp-ra-mot', rows: 3, value: v.motivo, onChange: (e) => setV(Object.assign({}, v, { motivo: e.target.value })), 'aria-invalid': tried && eMot ? 'true' : 'false', placeholder: 'Ej. La agencia no tiene cupo esta semana', style: Object.assign({}, inS, { height: 'auto', padding: '8px 10px', lineHeight: 1.45, resize: 'vertical' }) }), 'Obligatorio · queda en el Historial del caso.'),
        tried && err ? h('p', { role: 'alert', style: { margin: 0, fontSize: 13, color: 'var(--color-danger)' } }, err + '.') : null)); }

  // Administración › Flujo › «Completado del informe».
  class Vista extends R().Component {
    constructor(p) { super(p); const e = p.escena || ''; const d = D(); this.state = { reglas: clon(S.reglas), pd: clon(S.porDefecto), motivo: '', modal: e === 'complpublicar', tried: false, aviso: '', pr: Object.assign({}, d.probador || {}) };
      if (e === 'complprobar') this.state.pr = { ramo: 'Vehículos', modalidad: 'Autoinspección', sucursal: 'Guayaquil', suma: 18500 }; }
    componentDidMount() { this._off = SCo.on(() => { const dirty = JSON.stringify(this.state.reglas) !== JSON.stringify(this._ult || S.reglas); if (!dirty) this.setState({ reglas: clon(S.reglas), pd: clon(S.porDefecto) }); else this.forceUpdate(); }); this._ult = clon(S.reglas); }
    componentWillUnmount() { if (this._off) this._off(); }
    set(i, o) { this.setState((s) => ({ reglas: s.reglas.map((r, k) => k === i ? Object.assign({}, r, o) : r) })); }
    mover(i, d) { this.setState((s) => { const L = s.reglas.slice(), j = i + d; if (j < 0 || j >= L.length) return null; const t = L[i]; L[i] = L[j]; L[j] = t; return { reglas: L }; }); }
    quitar(i) { this.setState((s) => ({ reglas: s.reglas.filter((r, k) => k !== i) })); }
    agregar() { this.setState((s) => ({ reglas: s.reglas.concat([{ ramo: null, modalidad: SCo.modalidades()[0] || null, sucursal: null, sumaMax: null, destino: 'agencia', agencia: '', inspector: null, plazoHoras: 24 }]) }), () => { const el = document.getElementById('comp-r' + (this.state.reglas.length - 1) + '-ramo'); if (el) el.focus(); }); }
    render() { const p = this.props, s = this.state, ed = p.puedeEditar !== false, dn = SCo.destinos(), mods = SCo.modalidades(), rs = s.reglas, pd = s.pd, B = NS().Button;
      const cambios = SCo.cambios(rs, pd), errs = rs.map((r) => SCo.errorRegla(r)), hayErr = errs.some(Boolean), dirty = cambios.length > 0;
      const probado = SCo.resolver(s.pr, rs, pd), trazas = SCo.trazas(s.pr, rs), M = W.SiriusMonto;
      const respProbado = armar(Object.assign({}, probado, { usuario: probado.inspector, asignadoEn: '' }), 'reglas'); const pr = s.pr, setPr = (o) => this.setState({ pr: Object.assign({}, pr, o) });
      const opt = (arr, vacio) => [['', vacio]].concat(arr.map((x) => [x, x]));
      const regla = (r, i) => { const pre = 'comp-r' + i, cub = SCo.cubierta(rs, i), tar = r.destino === 'interno' ? null : SCo.tarifa(armar({ destino: r.destino, agencia: r.agencia, inspector: r.inspector }, 'reglas'));
        return h('li', { key: i, 'data-comp-regla': i + 1, style: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 16, border: '1px solid ' + (errs[i] ? 'var(--color-danger)' : 'var(--border-subtle)'), borderRadius: 'var(--radius-md)', background: '#FFFFFF', minWidth: 0 } },
          h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
            h('h3', { style: { margin: 0, fontSize: 16, fontWeight: 700, color: T.strong } }, 'Regla ' + (i + 1), cub >= 0 ? h('span', { style: { marginLeft: 8 } }, chip('Nunca se aplica: la cubre la regla ' + (cub + 1), 'warning')) : null),
            ed ? h('div', { style: { display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' } }, link('Subir', () => this.mover(i, -1), { 'aria-label': 'Subir la regla ' + (i + 1), 'data-motivo': i === 0 ? 'Ya es la primera regla' : undefined, 'aria-disabled': i === 0 ? 'true' : undefined, style: { padding: 0, border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: i === 0 ? 'var(--text-muted)' : 'var(--text-link, var(--color-brand))', textDecoration: 'underline', cursor: i === 0 ? 'default' : 'pointer' } }),
              link('Bajar', () => this.mover(i, 1), { 'aria-label': 'Bajar la regla ' + (i + 1), 'data-motivo': i === rs.length - 1 ? 'Ya es la última regla (la de por defecto va después)' : undefined, 'aria-disabled': i === rs.length - 1 ? 'true' : undefined, style: { padding: 0, border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: i === rs.length - 1 ? 'var(--text-muted)' : 'var(--text-link, var(--color-brand))', textDecoration: 'underline', cursor: i === rs.length - 1 ? 'default' : 'pointer' } }),
              link('Eliminar', () => this.quitar(i), { 'aria-label': 'Eliminar la regla ' + (i + 1), style: { padding: 0, border: 'none', background: 'transparent', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, color: 'var(--color-danger)', textDecoration: 'underline', cursor: 'pointer' } })) : null),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 } },
            campo(pre + '-ramo', 'Ramo', sel(pre + '-ramo', r.ramo || '', opt(SCo.ramos(), 'Cualquier ramo'), (x) => this.set(i, { ramo: x || null }), { disabled: !ed })),
            campo(pre + '-mod', 'Modalidad', sel(pre + '-mod', r.modalidad || '', opt(mods, 'Cualquiera sin inspector'), (x) => this.set(i, { modalidad: x || null }), { disabled: !ed })),
            campo(pre + '-suc', 'Sucursal', sel(pre + '-suc', r.sucursal || '', opt(SCo.sucursales(), 'Cualquier sucursal'), (x) => this.set(i, { sucursal: x || null }), { disabled: !ed })),
            campo(pre + '-suma', 'Suma asegurada hasta', M ? h(M, { id: pre + '-suma', value: r.sumaMax == null ? null : r.sumaMax, disabled: !ed, ancho: '100%', placeholder: 'Sin tope', onChange: (n) => this.set(i, { sumaMax: n == null || n === '' ? null : n }) }) : null)),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, alignItems: 'start' } },
            campo(pre + '-dest', 'Destino', sel(pre + '-dest', r.destino, dn.map((o) => [o.id, o.nombre]), (x) => this.set(i, { destino: x, agencia: x === 'agencia' ? r.agencia || '' : null, inspector: x === 'independiente' ? r.inspector || '' : null }), { disabled: !ed })),
            r.destino === 'agencia' ? campo(pre + '-ag', 'Agencia', sel(pre + '-ag', r.agencia || '', [['', 'Elige la agencia…']].concat(SCo.agencias().map((x) => [x.id, x.nombre])), (x) => this.set(i, { agencia: x }), { disabled: !ed, 'aria-invalid': errs[i] && !r.agencia ? 'true' : 'false' }), tar != null ? 'Tarifa «Completado de informe»: ' + usd(tar) : 'Sin tarifa propia: defínela en Honorarios › Tarifarios') : null,
            r.destino === 'independiente' ? campo(pre + '-in', 'Inspector independiente', sel(pre + '-in', r.inspector || '', [['', 'Elige el inspector…']].concat(SCo.independientes().map((x) => [x, x])), (x) => this.set(i, { inspector: x }), { disabled: !ed, 'aria-invalid': errs[i] && !r.inspector ? 'true' : 'false' }), tar != null ? 'Tarifa «Completado de informe»: ' + usd(tar) : 'Sin tarifa propia: defínela en Honorarios › Tarifarios') : null,
            r.destino === 'interno' ? campo(pre + '-int', 'Quién', h('span', { style: { display: 'flex', alignItems: 'center', minHeight: 40, fontSize: 14, color: T.body } }, 'Ejecutivos de inspecciones y Administrador'), 'Sin honorario.') : null,
            campo(pre + '-plazo', 'Plazo (horas hábiles)', h('input', { id: pre + '-plazo', type: 'number', min: 1, step: 1, value: r.plazoHoras == null ? '' : r.plazoHoras, disabled: !ed, onChange: (e) => this.set(i, { plazoHoras: e.target.value === '' ? '' : Math.max(0, Math.round(Number(e.target.value))) }), 'aria-invalid': errs[i] && !(Number(r.plazoHoras) >= 1) ? 'true' : 'false', style: Object.assign({}, inS, { width: 120, textAlign: 'right' }) }))),
          errs[i] ? h('p', { role: 'alert', style: { margin: 0, fontSize: 13, color: 'var(--color-danger)' } }, errs[i] + '.') : null); };
      const porDefecto = h('li', { key: 'pd', 'data-comp-regla': 'defecto', style: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1.5px dashed var(--border-default)', borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle, #F6F8FB)', minWidth: 0 } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 } }, h('h3', { style: { margin: 0, fontSize: 16, fontWeight: 700, color: T.strong } }, 'Por defecto'), chip('Siempre al final', 'neutral')),
        h('p', { style: { margin: 0, fontSize: 14, color: T.body } }, 'Si ninguna regla coincide, lo completa ', h('strong', null, 'Interno · Ejecutivos de inspecciones'), ': el calificador completa y califica en un solo paso, sin honorario. Esta regla no se puede quitar ni cambiar de destino.'),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12 } }, campo('comp-pd-plazo', 'Plazo (horas hábiles)', h('input', { id: 'comp-pd-plazo', type: 'number', min: 1, step: 1, value: pd.plazoHoras == null ? '' : pd.plazoHoras, disabled: !ed, onChange: (e) => this.setState({ pd: Object.assign({}, pd, { plazoHoras: e.target.value === '' ? '' : Math.max(0, Math.round(Number(e.target.value))) }) }), 'aria-invalid': !(Number(pd.plazoHoras) >= 1) ? 'true' : 'false', style: Object.assign({}, inS, { width: 120, textAlign: 'right' }) }))));
      const errPd = !(Number(pd.plazoHoras) >= 1) ? 'El plazo por defecto es de al menos 1 hora hábil' : '', motivoPub = hayErr ? 'Corrige las reglas con aviso' : errPd || (!dirty ? 'No hay cambios para publicar' : '');
      const trz = h('ul', { 'data-comp-trazas': '', style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 } }, trazas.map((t) => h('li', { key: t.n, 'data-comp-traza': t.n + 1, style: { fontSize: 13, lineHeight: 1.4, color: t.motivos.length ? T.muted : T.strong } }, h('strong', null, t.txt), t.motivos.length ? ': no aplica, ' + t.motivos.join(' y ') + '.' : ': coincide' + (probado.n === t.n ? ' y es la que gana.' : ', pero gana una anterior.'))), h('li', { key: 'd', style: { fontSize: 13, color: T.muted } }, h('strong', null, 'Por defecto'), probado.n == null ? ': gana, ninguna regla coincidió.' : ': no se usa.'));
      const probador = card('probar', [h('h2', { key: 't', style: { margin: 0, fontSize: 18, fontWeight: 700, color: T.strong } }, 'Probar con un caso'),
        h('div', { key: 'f', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 } },
          campo('comp-p-ramo', 'Ramo', sel('comp-p-ramo', pr.ramo || '', SCo.ramos().map((x) => [x, x]), (x) => setPr({ ramo: x }))), campo('comp-p-mod', 'Modalidad', sel('comp-p-mod', pr.modalidad || '', mods.map((x) => [x, x]), (x) => setPr({ modalidad: x }))),
          campo('comp-p-suc', 'Sucursal', sel('comp-p-suc', pr.sucursal || '', SCo.sucursales().map((x) => [x, x]), (x) => setPr({ sucursal: x }))), campo('comp-p-suma', 'Suma asegurada', M ? h(M, { id: 'comp-p-suma', value: pr.suma == null ? null : pr.suma, ancho: '100%', onChange: (n) => setPr({ suma: n == null || n === '' ? null : n }) }) : null)),
        h('div', { key: 'r', 'data-comp-resultado': probado.destino, role: 'status', style: { display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--cyan-50, #F0FAFE)', border: '1px solid var(--cyan-200, #99E1F7)' } },
          h('strong', { style: { fontSize: 15, color: T.strong } }, 'Lo completa: ' + respProbado.texto), h('span', { style: { fontSize: 13, color: T.body } }, 'Gana: ' + probado.regla + ' · plazo de ' + probado.plazoHoras + ' h hábiles' + (respProbado.tipo === 'interno' ? ' · sin honorario' : SCo.tarifa(respProbado) != null ? ' · honorario ' + usd(SCo.tarifa(respProbado)) : ' · tarifa «Completado de informe» por definir'))),
        h('div', { key: 'z' }, h('strong', { style: { fontSize: 13, color: T.strong } }, 'Cómo se revisó'), trz)], { 'data-comp-probar': '' });
      const asi = card('asi', [h('h2', { key: 't', style: { margin: 0, fontSize: 18, fontWeight: 700, color: T.strong } }, 'Así se ve en el caso'), h('p', { key: 'p', style: { margin: 0, fontSize: 13, color: T.muted } }, 'Línea del Resumen y de la cabecera del informe cuando el cliente envía la autoinspección.'),
        h('div', { key: 'l', style: { padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle, #F6F8FB)' } }, h(Linea, { responsable: Object.assign({}, respProbado, { regla: probado.regla }), caso: 'de ejemplo', puedeReasignar: false, mostrarTarifa: true })),
        h('p', { key: 'b', style: { margin: 0, fontSize: 13, color: T.muted } }, respProbado.tipo === 'interno' ? 'Aparece en «Informes por completar» de los Ejecutivos de inspecciones y del Administrador.' : respProbado.tipo === 'agencia' ? 'Aparece en «Informes por completar» del Control de calidad de la agencia.' : 'Aparece en «Informes por completar» del inspector independiente.'),
        h('p', { key: 'c', style: { margin: 0, fontSize: 13, color: T.muted } }, 'El Coordinador y el Administrador pueden reasignar mientras el informe no se envíe.')], { 'data-comp-asi': '' });
      const histo = S.hist.length ? card('hist', [h('h2', { key: 't', style: { margin: 0, fontSize: 18, fontWeight: 700, color: T.strong } }, 'Historial de versiones'), S.hist.map((x, k) => h('p', { key: k, style: { margin: 0, fontSize: 14, color: T.body } }, h('strong', null, 'Versión ' + x.version), ' · ' + fmt(x.fecha) + ' · ' + x.por + ' · Motivo: ' + x.motivo + ' · ' + x.cambios.join('; ')))]) : null;
      const mot = String(s.motivo || '').trim(), M2 = W.SiriusModal, eMot = mot.length < 10;
      const publicar = () => { if (eMot) { this.setState({ tried: true }); return; } const r = SCo.publicar(rs, pd, mot, p.usuario || ''); this._ult = clon(S.reglas); this.setState({ modal: false, motivo: '', tried: false, aviso: 'Versión ' + r.version + ' publicada: aplica a los casos que lleguen desde ahora.' }); };
      return h('div', { 'data-comp-vista': '', style: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 } },
        h('p', { style: { margin: 0, fontSize: 14, lineHeight: 1.5, color: T.body, maxWidth: 1000, textWrap: 'pretty' } }, D().intro),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 } }, chip('Versión ' + S.ver + ' vigente', 'brand'), dirty ? chip(cambios.length + (cambios.length === 1 ? ' cambio sin publicar' : ' cambios sin publicar'), 'warning') : null,
          s.aviso ? h('span', { role: 'status', style: { fontSize: 14, color: 'var(--color-success)', fontWeight: 700 } }, s.aviso) : null),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 20, alignItems: 'start', minWidth: 0 } },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 } },
            h('ol', { 'data-comp-reglas': rs.length, 'aria-label': 'Reglas de completado, en orden', style: { margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 } }, rs.map(regla).concat([porDefecto])),
            ed ? h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 } }, B ? h(B, { variant: 'secondary', size: 'md', onClick: () => this.agregar(), 'data-comp-agregar': '' }, '+ Agregar regla') : null,
              B ? h(B, { variant: 'primary', size: 'md', onClick: motivoPub ? undefined : () => this.setState({ modal: true, tried: false }), unavailableReason: motivoPub || undefined, 'data-comp-publicar': '' }, 'Publicar versión ' + (S.ver + 1) + '…') : null,
              dirty && B ? h(B, { variant: 'ghost', size: 'md', onClick: () => this.setState({ reglas: clon(S.reglas), pd: clon(S.porDefecto) }) }, 'Descartar') : null) : null,
            histo),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 } }, probador, asi)),
        M2 ? h(M2, { open: !!s.modal, onClose: () => this.setState({ modal: false, tried: false }), size: 'md', title: 'Publicar versión ' + (S.ver + 1), description: 'Aplica a los casos que lleguen desde ahora; los que ya tienen responsable no cambian.',
          footer: [h(Btn, { key: 'c', variant: 'ghost', onClick: () => this.setState({ modal: false, tried: false }) }, 'Cancelar'), h(Btn, { key: 'p', variant: 'primary', onClick: publicar, 'data-comp-confirmar-pub': '', unavailableReason: s.tried && eMot ? 'Escribe el motivo (al menos 10 caracteres)' : undefined }, 'Publicar')] },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
            h('div', { 'data-comp-cambios': '', style: { padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--gold-100, #FDF3DC)', display: 'flex', flexDirection: 'column', gap: 4 } }, h('strong', { style: { fontSize: 14, color: T.strong } }, 'Qué cambia'), cambios.length ? cambios.map((x, k) => h('span', { key: k, style: { fontSize: 14, color: T.strong } }, x)) : h('span', { style: { fontSize: 14 } }, 'Sin cambios.')),
            campo('comp-motivo', 'Motivo del cambio ', h('textarea', { id: 'comp-motivo', rows: 3, value: s.motivo, onChange: (e) => this.setState({ motivo: e.target.value }), 'aria-invalid': s.tried && eMot ? 'true' : 'false', placeholder: D().motivoEjemplo, style: Object.assign({}, inS, { height: 'auto', padding: '8px 10px', lineHeight: 1.45, resize: 'vertical' }) }), s.tried && eMot ? 'Escribe el motivo (al menos 10 caracteres).' : 'Obligatorio · queda en el historial de versiones.'))) : null); }
  }
  SCo.Vista = Vista; SCo.Linea = Linea; SCo.Reasignar = Reasignar;
})();
