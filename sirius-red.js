// SIRIUS · Red de inspectores (v1.0 · provisional · etapa R-3a · DEC-262 · 19/11/2026). Menú «Red de inspectores» (operación del negocio, después de Agenda) para quien tiene
// «Gestionar la red de inspectores» en la matriz (Administrador y Coordinador de inspecciones). Vistas: Por zona y Por sucursal (llegan en R-3b) y Por inspector (esta etapa).
// Una sola fuente: la cobertura, la operación, la jornada y los bloqueos de cada inspector se leen y se guardan solo aquí. Con la conexión: SIRIUS_CONEXION.red y
// SIRIUS_CONEXION.redAccion(tipo, datos) → { ok, mensaje }; sin la conexión: SIRIUS_RED (datos-red.js), con redAccion simulada en la sesión (SIRIUS_RED.aplicar).
// La cobertura se resume y se decide con SiriusCobertura (resumenFilas, cortoFilas, cubreFilas): lo que muestra Por inspector = SiriusCobertura.cubre = la base.
// Filas que vienen de la ficha del usuario o bloqueos de la Agenda: «Viene de la ficha» / «Viene de la Agenda», sin «Quitar» (se cambian allí durante la transición).
// Componente: window.SiriusRedInspectores({ rol, usuario, escena, rev, onIr }). Escenas: red, redsincob, redasignar, redoperacion y redcx. Lógica: window.SiriusRed.
(function () {
  'use strict';
  const W = window; if (W.SiriusRedInspectores) return;
  const R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {}, COB = () => W.SiriusCobertura, SZ = () => W.SiriusZonas;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x));
  // ---------- Lógica ----------
  const S = { por: '' }, ON = []; let ses = null;
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  S.cx = () => { const X = W.SIRIUS_CONEXION; return X && X.activo === true ? X : null; };
  S.demo = () => { const D = W.SIRIUS_RED; if (!D) return null; if (!ses) ses = clon({ listo: D.listo !== false, hoy: D.hoy, puedeGestionar: D.puedeGestionar !== false, inspectores: D.inspectores, historial: D.historial }); return ses; };
  S.reset = () => { ses = null; avisar(); };
  // { modo: 'base' | 'demo', red | null }
  S.datos = () => { const X = S.cx(); if (X) return { modo: 'base', simulada: !!X.simulada, red: X.red && typeof X.red === 'object' ? X.red : null }; return { modo: 'demo', red: S.demo() }; };
  S.accion = (tipo, datos) => { const mot = String((datos || {}).motivo || '').trim(); if (mot.length < 10) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const X = S.cx(); if (X) { if (typeof X.redAccion !== 'function') return Promise.resolve({ ok: false, mensaje: 'La conexión todavía no guarda la red de inspectores (falta redAccion).' });
      return Promise.resolve().then(() => X.redAccion(tipo, datos)).then((r) => r || { ok: false, mensaje: 'La base no respondió.' }, (e) => ({ ok: false, mensaje: String((e && e.message) || e || 'La base no respondió.') })).then((r) => { avisar(); return r; }); }
    const D = W.SIRIUS_RED; if (!D || !D.aplicar) return Promise.resolve({ ok: false, mensaje: 'No hay datos de la red de inspectores.' });
    const r = D.aplicar(S.demo(), tipo, datos, S.por); avisar(); return Promise.resolve(r); };
  // Texto de una fila y resumen con la regla única (SiriusCobertura).
  S.ambito = (f) => (COB() && COB().ambitoTxt ? COB().ambitoTxt(f) : String(f.sucursal || f.ciudad || ''));
  S.nivel = (n) => (COB() && COB().nivelTxt ? COB().nivelTxt(n) : n);
  S.resumen = (i, hoy) => (COB() ? COB().resumenFilas(i.cobertura || [], hoy) : '');
  S.corto = (i, hoy) => (COB() ? COB().cortoFilas(i.cobertura || [], hoy) : '');
  S.sinCobertura = (i, hoy) => (COB() ? !COB().vigentes(i.cobertura || [], hoy).length : !(i.cobertura || []).length);
  S.cubre = (i, lugar, hoy, parcial) => (COB() ? COB().cubreFilas(i.cobertura || [], lugar, { hoy, parcial }) : { nivel: null });
  S.RECIBE = [['red', 'Sí, de Coordinación y de la red'], ['coord', 'Solo de Coordinación'], ['no', 'No recibe ofertas']];
  S.recibeTxt = (v) => (v === 'red' ? 'Recibe ofertas de Coordinación y de la red' : v === 'coord' ? 'Recibe ofertas solo de Coordinación' : 'No recibe ofertas');
  S.MODALIDADES = ['Presencial', 'Virtual guiada']; S.RAMOS = ['Vehículos', 'Ramos Generales'];
  W.SiriusRed = S;

  // ---------- Formato ----------
  const fDia = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; };
  const fDM = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? m[3] + '/' + m[2] : ''; };
  const fHora = (iso) => { const m = /T(\d{2}):(\d{2})/.exec(String(iso || '')); return m ? m[1] + ':' + m[2] : ''; };
  const fHist = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(iso || '')); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + (m[4] ? ' · ' + m[4] + ':' + m[5] : '') : String(iso || ''); };
  const bloqTxt = (b) => { const a = String(b.desde || ''), z = String(b.hasta || ''), ha = fHora(a), hz = fHora(z), dia = (!ha || ha === '00:00') && (!hz || hz === '23:59' || hz === '00:00');
    if (dia) return a.slice(0, 10) === z.slice(0, 10) ? 'el ' + fDia(a) : 'del ' + fDia(a) + ' al ' + fDia(z);
    return a.slice(0, 10) === z.slice(0, 10) ? 'el ' + fDia(a) + ' de ' + ha + ' a ' + hz : 'del ' + fDia(a) + ' ' + ha + ' al ' + fDia(z) + ' ' + hz; };
  const vigenciaTxt = (f, hoy) => { const vig = COB() ? COB().filaVigente(f, hoy) : true, d = String(f.desde || '').slice(0, 10), a = String(f.hasta || '').slice(0, 10);
    if (vig) return (d ? 'Desde ' + fDia(d) : 'Vigente') + (a ? ' hasta ' + fDia(a) : '');
    if (d && d > hoy) return 'Desde ' + fDM(d); return a ? 'Venció el ' + fDM(a) : 'No vigente'; };
  const agNombre = (a) => { if (!a) return ''; const SU = W.SiriusUsuarios, x = SU && SU.agencia ? SU.agencia(a) : null; return x ? x.nombreComercial || x.nombre : String(a); };
  const DIAS = [[1, 'L', 'Lunes'], [2, 'M', 'Martes'], [3, 'X', 'Miércoles'], [4, 'J', 'Jueves'], [5, 'V', 'Viernes'], [6, 'S', 'Sábado'], [7, 'D', 'Domingo']];
  const qp = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };

  // ---------- Estilos ----------
  let css = false; const ponerCss = () => { if (css || !W.document) return; css = true; const s = document.createElement('style');
    s.textContent = '.rdi{font-family:var(--font-brand);color:var(--text-body);max-width:100%;box-sizing:border-box;min-width:0}.rdi *{box-sizing:border-box}' +
      '.rdi-tabs{display:flex;gap:28px;border-bottom:1px solid var(--border-subtle);margin:20px 0 24px;flex-wrap:wrap}.rdi-tab{border:0;background:none;padding:8px 0 10px;margin-bottom:-1px;font:600 17px var(--font-brand);color:var(--text-muted);cursor:pointer;border-bottom:3px solid transparent}' +
      '.rdi-tab[aria-selected="true"]{color:var(--text-strong);font-weight:700;border-bottom-color:var(--color-brand)}.rdi-tab:hover{color:var(--text-strong)}.rdi-tab:focus-visible,.rdi button:focus-visible,.rdi input:focus-visible,.rdi select:focus-visible{outline:2px solid var(--color-brand);outline-offset:2px}' +
      '.rdi-grid{display:grid;grid-template-columns:minmax(260px,330px) minmax(0,1fr);gap:24px;align-items:start}@media (max-width:900px){.rdi-grid{grid-template-columns:minmax(0,1fr)}}' +
      /* G-3e: la lista y la ficha se desplazan por su cuenta; alto máximo = alto de la ventana disponible (--rdi-alto la calcula el componente); barra siempre visible */
      '.rdi-lcard{display:flex;flex-direction:column;min-height:0;max-height:var(--rdi-alto,none);position:sticky;top:8px}.rdi-ul{flex:1 1 auto;min-height:120px;overflow-y:scroll;overscroll-behavior:contain;margin:0 -8px;padding:0 4px 0 8px}.rdi-ul::-webkit-scrollbar{width:10px}.rdi-ul::-webkit-scrollbar-track{background:#EEF0F3;border-radius:6px}.rdi-ul::-webkit-scrollbar-thumb{background:#8A94A3;border-radius:6px;border:2px solid #EEF0F3}' +
      '.rdi-fcol{max-height:var(--rdi-alto,none);overflow-y:auto;overscroll-behavior:contain;position:sticky;top:8px;padding:2px 8px 2px 2px}.rdi-fcol::-webkit-scrollbar{width:10px}.rdi-fcol::-webkit-scrollbar-track{background:#EEF0F3;border-radius:6px}.rdi-fcol::-webkit-scrollbar-thumb{background:#8A94A3;border-radius:6px;border:2px solid #EEF0F3}@supports not selector(::-webkit-scrollbar){.rdi-ul,.rdi-fcol{scrollbar-width:thin;scrollbar-color:#8A94A3 #EEF0F3}}@media (max-width:900px){.rdi-lcard,.rdi-fcol{position:static}.rdi-lcard{max-height:60vh}.rdi-fcol{max-height:none;overflow:visible}}' +
      '.rdi-card{background:#fff;border:1px solid var(--border-subtle);border-radius:16px;padding:22px 24px;box-shadow:0 1px 3px rgba(1,30,65,.06);min-width:0}.rdi-col{display:flex;flex-direction:column;gap:16px;min-width:0}' +
      '.rdi-h3{margin:0;font:700 19px var(--font-brand);color:var(--text-strong)}.rdi-lbl{display:block;font:700 14px var(--font-brand);color:var(--text-strong);margin:0 0 6px}' +
      '.rdi-in{width:100%;height:44px;border:1.5px solid var(--input-outlined-border,#DADADA);border-radius:8px;padding:0 12px;font:400 15px var(--font-brand);color:var(--text-strong);background:#fff}.rdi-in:focus{border-color:var(--color-brand);outline:none;box-shadow:0 0 0 3px var(--cyan-100)}.rdi-in:disabled{background:var(--surface-subtle);color:var(--text-muted)}' +
      'textarea.rdi-in{height:auto;min-height:76px;padding:10px 12px;resize:vertical}' +
      '.rdi-chip{border:1.5px solid var(--border-default);border-radius:999px;padding:6px 14px;background:#fff;font:600 14px var(--font-brand);color:var(--text-strong);cursor:pointer;white-space:nowrap}.rdi-chip[aria-pressed="true"]{border-color:var(--color-brand-strong,#0033A1);background:var(--cyan-100);color:var(--color-brand-strong,#0033A1)}' +
      '.rdi-li{width:100%;border:0;background:none;text-align:left;padding:10px 12px;border-radius:10px;cursor:pointer;display:flex;gap:10px;align-items:center;justify-content:space-between;font-family:var(--font-brand)}.rdi-li:hover{background:var(--surface-subtle,#F5F6F8)}.rdi-li[aria-current="true"]{background:var(--cyan-100)}' +
      '.rdi-tg{min-width:40px;height:40px;border:1.5px solid var(--border-default);border-radius:8px;background:#fff;padding:0 14px;font:700 15px var(--font-brand);color:var(--text-muted);cursor:pointer}.rdi-tg[aria-pressed="true"]{border-color:var(--color-brand-strong,#0033A1);background:var(--surface-brand-subtle,#EEF4FF);color:var(--color-brand-strong,#0033A1)}.rdi-tg:disabled{cursor:default;opacity:.7}' +
      '.rdi-tb{width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px}.rdi-tb th{text-align:left;font:700 14px var(--font-brand);color:var(--text-strong);padding:8px 8px;border-bottom:1px solid var(--border-subtle)}.rdi-tb td{padding:12px 8px;border-bottom:1px solid var(--border-subtle);vertical-align:top;overflow-wrap:anywhere;color:var(--text-body)}' +
      '.rdi-tb tr.nv td{color:var(--text-muted);opacity:.62}.rdi-q{border:0;background:none;color:var(--color-danger,#B3261E);font:700 14px var(--font-brand);cursor:pointer;padding:2px 4px;border-radius:6px}.rdi-q:hover{background:var(--red-100,#FDECEA)}' +
      '.rdi-vie{font:600 12px var(--font-brand);color:var(--text-muted);white-space:normal}.rdi-pill{display:inline-flex;align-items:center;border-radius:999px;padding:3px 10px;font:600 13px var(--font-brand);white-space:nowrap}' +
      '.rdi-bar{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px 16px}.rdi-bar.pend{position:sticky;bottom:0;z-index:2;box-shadow:0 -4px 16px rgba(1,30,65,.10);border-color:#E9C46A}.rdi-link{border:0;background:none;padding:0;color:var(--color-brand-strong,#0033A1);text-decoration:underline;font:600 15px var(--font-brand);cursor:pointer}' +
      '.rdi-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}';
    document.head.appendChild(s); };
  const TONOS = { neutral: ['var(--surface-subtle,#F1F3F5)', 'var(--text-strong)'], success: ['#E7F5EA', '#1E6B34'], brand: ['var(--surface-brand-subtle,#EEF4FF)', 'var(--color-brand-strong,#0033A1)'], danger: ['#FDECEA', '#A1261B'], warning: ['#FFF4DE', '#7A4F0E'] };
  const pill = (txt, tono, k) => { const t = TONOS[tono] || TONOS.neutral; return h('span', { key: k, className: 'rdi-pill', style: { background: t[0], color: t[1] } }, txt); };
  const boton = (o, txt) => { const B = NS().Button; if (B) return h(B, Object.assign({ variant: 'secondary', size: 'md' }, o), txt); return h('button', Object.assign({ type: 'button', className: 'rdi-chip' }, { id: o.id, onClick: o.onClick, disabled: o.disabled }), txt); };
  const ojo = (x, y) => JSON.stringify(x) === JSON.stringify(y);

  // ---------- Componente ----------
  function SiriusRedInspectores(props) {
    ponerCss(); S.por = props.usuario || '';
    const esc = props.escena || '';
    const [n, setN] = R().useState(0), refrescar = () => setN((x) => x + 1);
    R().useEffect(() => S.on(refrescar), []);
    const [tab, setTab] = R().useState('inspector');
    const [q, setQ] = R().useState('');
    const [filtro, setFiltro] = R().useState(esc === 'redsincob' ? 'sincob' : 'todos');
    const [sel, setSel] = R().useState(esc === 'red' || esc === 'redasignar' || esc === 'redoperacion' || esc === 'redcx' || esc === 'redlistalarga' ? 'Sofía Arteaga' : esc === 'redsincob' ? 'Cristian Vaca' : '');
    const [drafts, setDrafts] = R().useState(() => esc === 'redoperacion' ? { 'Sofía Arteaga': { capacidadDia: 5, jornada: { dias: [1, 2, 3, 4, 5, 6], desde: '08:00', hasta: '17:00' } } } : {});
    const [motivo, setMotivo] = R().useState(''), [barErr, setBarErr] = R().useState(''), [guardando, setGuardando] = R().useState(false);
    const [aviso, setAviso] = R().useState(null);
    const [dlg, setDlg] = R().useState(() => esc === 'redasignar' ? { k: 'asignar', nivel: 'zona', sucursal: '', ciudad: '1701', zona: '', desde: '', hasta: '', motivo: '' } : null);
    const [verHist, setVerHist] = R().useState(false);
    const retRef = R().useRef(null);
    /* G-3e: alto disponible = alto de la ventana menos lo que hay encima del panel; se recalcula al abrir, al cambiar el tamaño y al cambiar de vista. La posición de la lista se guarda y se devuelve tras cada cambio de selección. */
    const gridRef = R().useRef(null), ulRef = R().useRef(null), posRef = R().useRef(0);
    const [alto, setAlto] = R().useState(0);
    R().useLayoutEffect(() => { const calc = () => { const g = gridRef.current; if (!g || !W.innerHeight) return; const top = g.getBoundingClientRect().top; const a = Math.max(360, Math.round(W.innerHeight - Math.max(top, 8) - 16)); setAlto((x) => (Math.abs(x - a) > 1 ? a : x)); }; calc(); W.addEventListener('resize', calc); return () => W.removeEventListener('resize', calc); }, [tab]);
    R().useLayoutEffect(() => { if (ulRef.current && posRef.current) ulRef.current.scrollTop = posRef.current; });
    const D = S.datos(), red = D.red; if (esc === 'redlistalarga' && red && W.SIRIUS_RED_EXTRA && !red.__larga) { red.__larga = true; red.inspectores = (red.inspectores || []).concat(W.SIRIUS_RED_EXTRA); } /* G-3e: escena de 30 inspectores */
    const hoy = (red && red.hoy) || (COB() ? COB().hoy() : ''), SU = W.SiriusUsuarios;
    const puede = !!red && red.puedeGestionar !== false && (!SU || !props.rol || SU.puede(props.rol, 'red'));
    const verUsuarios = !SU || !props.rol || SU.permiso(props.rol, 'Gestionar usuarios, roles e invitaciones') !== ''; /* la ficha de identidad y acceso la abre quien gestiona usuarios */
    const titulo = h('div', { key: 'cab', style: { display: 'flex', flexDirection: 'column', gap: 6 } },
      h('h1', { style: { margin: 0, fontWeight: 300, fontSize: 36, lineHeight: 1.05, color: 'var(--text-strong)' } }, 'Red de inspectores'),
      h('p', { style: { margin: 0, fontSize: 15, color: 'var(--text-muted)', maxWidth: 860 } }, 'Quién atiende cada lugar, cómo trabaja cada inspector y cuándo no está disponible. Lo que se guarda aquí es la única fuente para Coordinar visita, la Agenda, las ofertas y el portal del cliente.'),
      D.modo === 'demo' ? h('p', { 'data-red-demo': '', style: { margin: 0, fontSize: 13, color: '#7A4F0E' } }, 'Datos de demostración: sin la conexión, los cambios quedan solo en esta sesión.') : null);
    const tabs = h('div', { key: 'tabs', role: 'tablist', 'aria-label': 'Vistas de la red', className: 'rdi-tabs' }, [['zona', 'Por zona'], ['inspector', 'Por inspector'], ['sucursal', 'Por sucursal']].map(([k, t]) =>
      h('button', { key: k, type: 'button', role: 'tab', id: 'rdi-tab-' + k, 'aria-selected': tab === k ? 'true' : 'false', 'aria-controls': 'rdi-panel', tabIndex: tab === k ? 0 : -1, className: 'rdi-tab', onClick: () => setTab(k),
        onKeyDown: (e) => { const L = ['zona', 'inspector', 'sucursal'], i = L.indexOf(k); if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const nk = L[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; setTab(nk); setTimeout(() => { const b = document.getElementById('rdi-tab-' + nk); if (b) b.focus(); }, 0); } } }, t)));
    const marco = (cuerpo) => h('div', { className: 'rdi', 'data-red': '', style: { padding: '8px 0 40px' } }, titulo, tabs, h('div', { id: 'rdi-panel', role: 'tabpanel', 'aria-labelledby': 'rdi-tab-' + tab }, cuerpo));
    if (tab !== 'inspector') return marco(h('div', { className: 'rdi-card', 'data-red-proxima': tab, style: { maxWidth: 720 } }, h('h2', { className: 'rdi-h3', style: { marginBottom: 6 } }, tab === 'zona' ? 'Por zona' : 'Por sucursal'),
      h('p', { style: { margin: '0 0 4px', fontSize: 16, color: 'var(--text-strong)' } }, 'Llega en la próxima etapa.'),
      h('p', { style: { margin: 0, fontSize: 14, color: 'var(--text-muted)' } }, tab === 'zona' ? 'Mostrará, para cada ciudad y zona, quién la atiende y dónde falta cobertura.' : 'Mostrará, para cada sucursal, quién atiende sus casos y con qué nivel.')));
    if (!red) return marco(h('div', { className: 'rdi-card', 'data-red-sinbase': '', style: { maxWidth: 720 } }, h('h2', { className: 'rdi-h3', style: { marginBottom: 6 } }, 'La base todavía no tiene la red de inspectores'), h('p', { style: { margin: 0, fontSize: 14 } }, 'Cuando la conexión entregue la red (SIRIUS_CONEXION.red), aquí se verá la cobertura, la operación, la jornada y los bloqueos de cada inspector.')));
    if (red.listo === false) return marco(h('div', { className: 'rdi-card', role: 'status' }, 'Cargando la red de inspectores…'));

    const L0 = (red.inspectores || []).filter((i) => i && i.nombre).slice().sort((a, b) => (S.sinCobertura(a, hoy) - S.sinCobertura(b, hoy)) || a.nombre.localeCompare(b.nombre, 'es'));
    const nSin = L0.filter((i) => S.sinCobertura(i, hoy)).length, nRed = L0.filter((i) => (i.operacion || {}).recibeOfertas === 'red').length;
    const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const L = L0.filter((i) => (filtro === 'sincob' ? S.sinCobertura(i, hoy) : filtro === 'red' ? (i.operacion || {}).recibeOfertas === 'red' : true) && (!q.trim() || norm([i.nombre, i.tipo, agNombre(i.agencia), S.corto(i, hoy), (i.cobertura || []).map((f) => S.ambito(f)).join(' ')].join(' ')).indexOf(norm(q.trim())) >= 0));
    const actual = L0.find((i) => i.nombre === sel) || L[0] || null;
    /* G-3e: ↑ ↓ Inicio Fin recorren la lista (Tab también, todos los botones son tabulables); el foco no cambia la selección hasta pulsar Enter o clic */
    const teclaLista = (e) => { const k = e.key; if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(k)) return; const bs = Array.from(e.currentTarget.querySelectorAll('button[data-red-ins]')), i = bs.indexOf(document.activeElement); if (!bs.length) return; e.preventDefault(); const n2 = k === 'Home' ? 0 : k === 'End' ? bs.length - 1 : Math.max(0, Math.min(bs.length - 1, (i < 0 ? 0 : i) + (k === 'ArrowDown' ? 1 : -1))); bs[n2].focus(); };
    const lista = h('div', { key: 'lista', className: 'rdi-card rdi-lcard', 'data-red-lista': '', style: { padding: '20px 18px' } },
      h('label', { className: 'rdi-lbl', htmlFor: 'rdi-q' }, 'Buscar'),
      h('input', { id: 'rdi-q', className: 'rdi-in', type: 'search', value: q, placeholder: 'Nombre, agencia o ciudad', onChange: (e) => setQ(e.target.value), autoComplete: 'off' }),
      h('div', { role: 'group', 'aria-label': 'Filtrar inspectores', style: { display: 'flex', flexWrap: 'wrap', gap: 8, margin: '14px 0 12px' } },
        [['todos', 'Todos', L0.length], ['sincob', 'Sin cobertura', nSin], ['red', 'Solo red', nRed]].map(([k, t, c]) => h('button', { key: k, type: 'button', className: 'rdi-chip', 'data-red-filtro': k, 'aria-pressed': filtro === k ? 'true' : 'false', onClick: () => setFiltro(k) }, t + ' ' + c))),
      L.length ? h('ul', { ref: ulRef, className: 'rdi-ul', 'data-red-ul': '', onScroll: (e) => { posRef.current = e.currentTarget.scrollTop; }, onKeyDown: teclaLista, style: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }, 'aria-label': 'Inspectores' }, L.map((i) => { const sc = S.sinCobertura(i, hoy), cur = actual && actual.nombre === i.nombre, sg = !!drafts[i.nombre];
        return h('li', { key: i.nombre }, h('button', { type: 'button', className: 'rdi-li', 'data-red-ins': i.nombre, 'aria-current': cur ? 'true' : undefined, onClick: () => { setSel(i.nombre); setAviso(null); setBarErr(''); setVerHist(false); } },
          h('span', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 } }, h('span', { style: { font: '700 16px var(--font-brand)', color: 'var(--text-strong)' } }, i.nombre),
            h('span', { style: { fontSize: 13.5, color: 'var(--text-muted)', overflowWrap: 'anywhere' } }, [i.tipo || '—'].concat(sc ? [] : [S.corto(i, hoy)]).join(' · '))),
          h('span', { style: { display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flex: '0 0 auto' } }, sc ? pill('Sin cobertura', 'danger') : null, sg ? pill('Sin guardar', 'warning') : null))); }))
        : h('p', { role: 'status', style: { margin: '8px 4px', fontSize: 14, color: 'var(--text-muted)' } }, 'Ningún inspector coincide con la búsqueda o el filtro.'));
    if (!actual) return marco(h('div', { className: 'rdi-grid', ref: gridRef, style: { '--rdi-alto': alto ? alto + 'px' : undefined } }, lista, h('div', { className: 'rdi-card' }, 'La red no tiene inspectores.')));

    // Ficha
    const op0 = actual.operacion || {}, j0 = op0.jornada || { dias: [], desde: '', hasta: '' }, dr = drafts[actual.nombre] || {};
    const opV = { modalidades: dr.modalidades !== undefined ? dr.modalidades : (op0.modalidades || []), ramos: dr.ramos !== undefined ? dr.ramos : (op0.ramos || []), recibeOfertas: dr.recibeOfertas !== undefined ? dr.recibeOfertas : (op0.recibeOfertas || 'no'), capacidadDia: dr.capacidadDia !== undefined ? dr.capacidadDia : (op0.capacidadDia == null ? null : op0.capacidadDia), jornada: dr.jornada !== undefined ? dr.jornada : j0 };
    const cambios = {}; ['modalidades', 'ramos', 'recibeOfertas', 'capacidadDia', 'jornada'].forEach((k) => { const a = k === 'jornada' ? j0 : k === 'capacidadDia' ? (op0.capacidadDia == null ? null : op0.capacidadDia) : k === 'recibeOfertas' ? (op0.recibeOfertas || 'no') : (op0[k] || []); if (dr[k] !== undefined && !ojo(dr[k], a)) cambios[k] = dr[k]; });
    const nCamb = Object.keys(cambios).length, NOMC = { modalidades: 'Modalidades', ramos: 'Ramos', recibeOfertas: 'Recibe ofertas', capacidadDia: 'Capacidad por día', jornada: 'Jornada' };
    const setDr = (k, v) => { setBarErr(''); setDrafts((x) => { const o = Object.assign({}, x), d = Object.assign({}, o[actual.nombre] || {}); d[k] = v; o[actual.nombre] = d; return o; }); };
    const toggle = (arr, v) => (arr.indexOf(v) >= 0 ? arr.filter((x) => x !== v) : arr.concat([v]));
    const ro = !puede;
    const cab = h('div', { key: 'cab', className: 'rdi-card', 'data-red-cab': '' },
      h('h2', { style: { margin: '0 0 10px', fontWeight: 300, fontSize: 32, lineHeight: 1.1, color: 'var(--text-strong)' } }, actual.nombre),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 } }, pill(actual.tipo || '—', 'neutral', 't'), actual.agencia ? pill(agNombre(actual.agencia), 'neutral', 'a') : null, pill(actual.estado || '—', /^activ/i.test(actual.estado || '') ? 'success' : 'warning', 'e'), pill(S.recibeTxt((actual.operacion || {}).recibeOfertas), (actual.operacion || {}).recibeOfertas === 'no' ? 'neutral' : 'brand', 'r')),
      verUsuarios && props.onIr ? h('button', { type: 'button', className: 'rdi-link', 'data-red-usuarios': '', onClick: () => props.onIr({ k: 'usuarios', panel: 'ficha', usuario: actual.nombre }) }, 'Ver identidad y acceso en Usuarios') : h('p', { 'data-red-usuarios-txt': '', style: { margin: 0, fontSize: 14, color: 'var(--text-muted)' } }, 'Identidad y acceso: en Usuarios y roles (los gestiona el Administrador).'));
    const filas = (actual.cobertura || []);
    const cob = h('section', { key: 'cob', className: 'rdi-card', 'aria-labelledby': 'rdi-h-cob', 'data-red-cobertura': '' },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 } }, h('h3', { id: 'rdi-h-cob', className: 'rdi-h3' }, 'Cobertura'),
        ro ? null : boton({ id: 'rdi-agregar-cob', onClick: (e) => { retRef.current = e.currentTarget; setDlg({ k: 'asignar', nivel: 'sucursal', sucursal: '', ciudad: '', zona: '', desde: '', hasta: '', motivo: '' }); } }, 'Agregar cobertura')),
      h('p', { 'data-red-resumen': '', style: { margin: '0 0 14px', fontSize: 15.5, color: S.sinCobertura(actual, hoy) ? '#A1261B' : 'var(--text-strong)' } }, S.sinCobertura(actual, hoy) ? 'Sin cobertura vigente: no recibe ofertas ni aparece como candidato en Coordinar visita.' : S.resumen(actual, hoy)),
      filas.length ? h('table', { className: 'rdi-tb' }, h('caption', { className: 'rdi-sr' }, 'Filas de cobertura de ' + actual.nombre),
        h('colgroup', null, h('col', { style: { width: '17%' } }), h('col', { style: { width: '21%' } }), h('col', { style: { width: '18%' } }), h('col', { style: { width: '15%' } }), h('col', { style: { width: '17%' } }), h('col', { style: { width: '12%' } })),
        h('thead', null, h('tr', null, ['Nivel', 'Ámbito', 'Vigencia', 'Asignó', 'Motivo'].map((t) => h('th', { key: t, scope: 'col' }, t)), h('th', { scope: 'col' }, h('span', { className: 'rdi-sr' }, 'Acción')))),
        h('tbody', null, filas.map((f) => { const vig = COB() ? COB().filaVigente(f, hoy) : true, ficha = f.origen === 'Ficha de usuario';
          return h('tr', { key: f.id, className: vig ? '' : 'nv', 'data-red-fila': f.id, 'data-vigente': vig ? '1' : '0' }, h('td', { style: { fontWeight: 700, color: 'var(--text-strong)' } }, S.nivel(f.nivel)), h('td', null, S.ambito(f)), h('td', null, vigenciaTxt(f, hoy)), h('td', null, f.creadoPor || '—'), h('td', null, f.motivo || '—'),
            h('td', { style: { textAlign: 'right' } }, ficha ? h('span', { className: 'rdi-vie' }, 'Viene de la ficha') : ro ? null : h('button', { type: 'button', className: 'rdi-q', 'aria-label': 'Quitar cobertura ' + S.nivel(f.nivel) + ' · ' + S.ambito(f), onClick: (e) => { retRef.current = e.currentTarget; setDlg({ k: 'retirar', id: f.id, txt: S.nivel(f.nivel) + ' · ' + S.ambito(f), motivo: '' }); } }, 'Quitar'))); })))
        : null,
      h('p', { style: { margin: '14px 0 0', fontSize: 13, color: 'var(--text-muted)' } }, 'Niveles: todas · sucursal · ciudad completa · zona. Una asignación con fecha «hasta» sirve para reemplazos y temporadas. Las filas que vienen de la ficha se cambian en Usuarios mientras dura la transición.'));
    const gTg = (lbl, lista0, val, k) => h('div', { style: { minWidth: 0 } }, h('span', { className: 'rdi-lbl', id: 'rdi-l-' + k }, lbl),
      h('div', { role: 'group', 'aria-labelledby': 'rdi-l-' + k, style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, lista0.map((m) => h('button', { key: m, type: 'button', className: 'rdi-tg', disabled: ro, 'aria-pressed': val.indexOf(m) >= 0 ? 'true' : 'false', onClick: () => setDr(k, toggle(val, m)) }, m))),
      h('span', { style: { display: 'block', fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6 } }, val.length ? '' : 'Ninguna marcada: ' + (k === 'ramos' ? 'todos los ramos.' : 'todas las modalidades.')));
    const oper = h('section', { key: 'op', className: 'rdi-card', 'aria-labelledby': 'rdi-h-op', 'data-red-operacion': '' }, h('h3', { id: 'rdi-h-op', className: 'rdi-h3', style: { marginBottom: 14 } }, 'Operación'),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px 32px' } },
        gTg('Modalidades', S.MODALIDADES, opV.modalidades, 'modalidades'), gTg('Ramos', S.RAMOS, opV.ramos, 'ramos'),
        h('div', null, h('label', { className: 'rdi-lbl', htmlFor: 'rdi-recibe' }, 'Recibe ofertas'), h('select', { id: 'rdi-recibe', className: 'rdi-in', disabled: ro, value: opV.recibeOfertas, onChange: (e) => setDr('recibeOfertas', e.target.value) }, S.RECIBE.map(([v, t]) => h('option', { key: v, value: v }, t)))),
        h('div', null, h('label', { className: 'rdi-lbl', htmlFor: 'rdi-cap' }, 'Capacidad por día'), h('input', { id: 'rdi-cap', className: 'rdi-in', inputMode: 'numeric', disabled: ro, value: opV.capacidadDia == null ? '' : String(opV.capacidadDia), placeholder: 'Sin límite', 'aria-describedby': 'rdi-cap-d', onChange: (e) => { const t = e.target.value.replace(/\D/g, '').slice(0, 2); setDr('capacidadDia', t === '' ? null : Number(t)); } }),
          h('span', { id: 'rdi-cap-d', style: { display: 'block', fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6 } }, 'Visitas por día, de 1 a 20. Vacío: sin límite.'))));
    const jv = opV.jornada || { dias: [], desde: '', hasta: '' };
    const jorn = h('section', { key: 'jo', className: 'rdi-card', 'aria-labelledby': 'rdi-h-jo', 'data-red-jornada': '' }, h('h3', { id: 'rdi-h-jo', className: 'rdi-h3', style: { marginBottom: 14 } }, 'Jornada'),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 18px' } },
        h('div', { role: 'group', 'aria-label': 'Días de la jornada', style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, DIAS.map(([d, l, t]) => h('button', { key: d, type: 'button', className: 'rdi-tg', disabled: ro, 'aria-label': t, title: t, 'aria-pressed': (jv.dias || []).indexOf(d) >= 0 ? 'true' : 'false', onClick: () => setDr('jornada', Object.assign({}, jv, { dias: toggle(jv.dias || [], d).sort((a, b) => a - b) })) }, l))),
        h('span', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, h('label', { htmlFor: 'rdi-jd', style: { font: '700 15px var(--font-brand)', color: 'var(--text-strong)' } }, 'Desde'), h('input', { id: 'rdi-jd', type: 'time', className: 'rdi-in', style: { width: 130 }, disabled: ro, value: jv.desde || '', onChange: (e) => setDr('jornada', Object.assign({}, jv, { desde: e.target.value })) }),
          h('label', { htmlFor: 'rdi-jh', style: { font: '700 15px var(--font-brand)', color: 'var(--text-strong)' } }, 'Hasta'), h('input', { id: 'rdi-jh', type: 'time', className: 'rdi-in', style: { width: 130 }, disabled: ro, value: jv.hasta || '', onChange: (e) => setDr('jornada', Object.assign({}, jv, { hasta: e.target.value })) }))),
      h('p', { style: { margin: '14px 0 0', padding: '10px 14px', borderRadius: 8, background: '#E9F5F1', color: 'var(--text-strong)', fontSize: 14.5 } }, 'Única fuente: la base, Coordinar visita, la Agenda, las ofertas y el portal del cliente usan esta jornada.'));
    const bl = actual.bloqueos || [];
    const bloq = h('section', { key: 'bl', className: 'rdi-card', 'aria-labelledby': 'rdi-h-bl', 'data-red-bloqueos': '' },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 } }, h('h3', { id: 'rdi-h-bl', className: 'rdi-h3' }, 'Bloqueos'),
        ro ? null : boton({ id: 'rdi-agregar-bl', onClick: (e) => { retRef.current = e.currentTarget; setDlg({ k: 'bloquear', desde: hoy + 'T08:00', hasta: hoy + 'T17:00', motivo: '' }); } }, 'Agregar bloqueo')),
      bl.length ? h('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, bl.map((b) => h('li', { key: b.id, 'data-red-bloqueo': b.id, style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, background: 'var(--surface-subtle,#F5F6F8)', borderRadius: 8, padding: '10px 14px', fontSize: 15 } },
        h('span', { style: { minWidth: 0 } }, h('b', { style: { color: 'var(--text-strong)' } }, b.motivo || 'Bloqueo'), ' · ' + bloqTxt(b)),
        h('span', { style: { display: 'flex', alignItems: 'center', gap: 12 } }, b.por ? h('span', { style: { fontSize: 13.5, color: 'var(--text-muted)' } }, 'Registró ' + b.por) : null,
          b.origen === 'Agenda' ? h('span', { className: 'rdi-vie' }, 'Viene de la Agenda') : ro ? null : h('button', { type: 'button', className: 'rdi-q', 'aria-label': 'Quitar bloqueo ' + (b.motivo || '') + ' ' + bloqTxt(b), onClick: (e) => { retRef.current = e.currentTarget; setDlg({ k: 'desbloquear', id: b.id, txt: (b.motivo || 'Bloqueo') + ' · ' + bloqTxt(b), motivo: '' }); } }, 'Quitar'))))) :
        h('p', { style: { margin: 0, fontSize: 14, color: 'var(--text-muted)' } }, 'Sin bloqueos.'));
    const HI = (red.historial || []).filter((x) => x && x.inspector === actual.nombre).slice().sort((a, b) => String(b.hora || '').localeCompare(String(a.hora || ''))), HIv = verHist ? HI : HI.slice(0, 4);
    const hist = h('section', { key: 'hi', className: 'rdi-card', 'aria-labelledby': 'rdi-h-hi', 'data-red-historial': '' }, h('h3', { id: 'rdi-h-hi', className: 'rdi-h3', style: { marginBottom: 12 } }, 'Historial'),
      HI.length ? h('ol', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 } }, HIv.map((x, k) => h('li', { key: k, style: { fontSize: 14.5, borderLeft: '3px solid var(--border-default)', paddingLeft: 12 } },
        h('div', { style: { color: 'var(--text-strong)' } }, h('b', null, x.accion), x.detalle ? ' · ' + x.detalle : ''), h('div', { style: { color: 'var(--text-muted)', fontSize: 13.5 } }, fHist(x.hora) + (x.por ? ' · ' + x.por : '') + (x.motivo ? ' · Motivo: ' + x.motivo : ''))))) : h('p', { style: { margin: 0, fontSize: 14, color: 'var(--text-muted)' } }, 'Sin cambios registrados.'),
      HI.length > 4 ? h('button', { type: 'button', className: 'rdi-link', style: { marginTop: 10, fontSize: 14 }, 'aria-expanded': verHist ? 'true' : 'false', onClick: () => setVerHist(!verHist) }, verHist ? 'Ver menos' : 'Ver todo (' + HI.length + ')') : null);
    const guardar = () => { const m = motivo.trim(); if (!nCamb) { setBarErr('No hay cambios para guardar.'); return; } if (m.length < 10) { setBarErr('Escribe el motivo (mínimo 10 caracteres).'); setTimeout(() => { const x = document.getElementById('rdi-motivo'); if (x) x.focus(); }, 0); return; }
      setGuardando(true); S.accion('operacion', { inspector: actual.nombre, cambios: clon(cambios), motivo: m }).then((r) => { setGuardando(false); if (r && r.ok) { setDrafts((x) => { const o = Object.assign({}, x); delete o[actual.nombre]; return o; }); setMotivo(''); setBarErr(''); setAviso({ ok: true, t: r.mensaje || 'Cambios guardados.' }); refrescar(); } else setBarErr((r && r.mensaje) || 'La base no guardó el cambio.'); }); };
    const bar = ro ? null : h('div', { key: 'bar', className: 'rdi-card rdi-bar' + (nCamb ? ' pend' : ''), 'data-red-barra': nCamb ? 'pendiente' : '' },
      h('div', { style: { flex: '1 1 320px', minWidth: 0 } }, h('label', { className: 'rdi-lbl', htmlFor: 'rdi-motivo' }, 'Motivo del cambio (obligatorio)'),
        h('input', { id: 'rdi-motivo', className: 'rdi-in', value: motivo, placeholder: 'Mínimo 10 caracteres: queda en el historial', 'aria-invalid': barErr ? 'true' : undefined, 'aria-describedby': 'rdi-bar-d', onChange: (e) => { setMotivo(e.target.value); setBarErr(''); }, onKeyDown: (e) => { if (e.key === 'Enter') guardar(); } }),
        h('span', { id: 'rdi-bar-d', role: barErr ? 'alert' : 'status', style: { display: 'block', fontSize: 13, marginTop: 6, color: barErr ? '#A1261B' : nCamb ? '#7A4F0E' : 'var(--text-muted)' } }, barErr || (nCamb ? nCamb + (nCamb === 1 ? ' cambio sin guardar: ' : ' cambios sin guardar: ') + Object.keys(cambios).map((k) => NOMC[k]).join(', ') : 'Solo para la operación y la jornada. La cobertura y los bloqueos se guardan en su diálogo.'))),
      h('span', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, nCamb ? boton({ variant: 'ghost', onClick: () => { setDrafts((x) => { const o = Object.assign({}, x); delete o[actual.nombre]; return o; }); setBarErr(''); } }, 'Descartar') : null,
        boton({ variant: 'primary', id: 'rdi-guardar', loading: guardando, onClick: guardar }, 'Guardar cambios')));
    const av = h('div', { key: 'av', role: 'status', 'aria-live': 'polite', 'data-red-aviso': '' }, aviso ? h('div', { style: { padding: '10px 14px', borderRadius: 8, background: aviso.ok ? '#E7F5EA' : '#FDECEA', color: aviso.ok ? '#1E6B34' : '#A1261B', fontSize: 14.5 } }, aviso.t) : null);
    const ficha = h('div', { key: 'ficha', className: 'rdi-col rdi-fcol', 'data-red-ficha': actual.nombre, tabIndex: 0, role: 'region', 'aria-label': 'Ficha de ' + actual.nombre }, av, cab, cob, oper, jorn, bloq, hist, bar);
    return h(R().Fragment, null, marco(h('div', { className: 'rdi-grid', ref: gridRef, style: { '--rdi-alto': alto ? alto + 'px' : undefined } }, lista, ficha)), dlg ? h(Dialogo, { key: 'dlg', d: dlg, set: setDlg, ins: actual, hoy, ret: retRef, onOk: (t) => { setAviso({ ok: true, t }); refrescar(); } }) : null);
  }

  // ---------- Diálogos: agregar o quitar cobertura, agregar o quitar bloqueo ----------
  function Dialogo(p) {
    const d = p.d, M = W.SiriusModal || NS().Modal, [err, setErr] = R().useState(''), [env, setEnv] = R().useState(false);
    const upd = (o) => { setErr(''); p.set(Object.assign({}, d, o)); };
    const cerrar = () => { p.set(null); const r = p.ret.current; setTimeout(() => { if (r && r.isConnected && r.focus) r.focus(); }, 60); };
    const Z0 = SZ(), ciudades = Z0 ? Z0.ciudades().slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) : [];
    const act = (cod) => { const z = Z0 && Z0.publicadasDe ? Z0.publicadasDe(cod) : null; return z ? z.zonas.filter((x) => x.estado !== 'Inactiva') : []; };
    const conZonas = d.k === 'asignar' && d.nivel === 'zona' ? ciudades.filter((c) => act(c.cod).length) : [];
    const sucs = COB() ? COB().sucursales() : [];
    const enviar = () => { if (env) return; let tipo = d.k, datos;
      if (d.k === 'asignar') datos = Object.assign({ inspectores: [p.ins.nombre], nivel: d.nivel, motivo: d.motivo }, d.nivel === 'sucursal' ? { sucursal: d.sucursal } : {}, d.nivel === 'ciudad' || d.nivel === 'zona' ? { ciudad: d.ciudad } : {}, d.nivel === 'zona' ? { zona: d.zona } : {}, d.desde ? { desde: d.desde } : {}, d.hasta ? { hasta: d.hasta } : {});
      else if (d.k === 'retirar') datos = { id: d.id, motivo: d.motivo };
      else if (d.k === 'bloquear') datos = { inspector: p.ins.nombre, desde: d.desde, hasta: d.hasta, motivo: d.motivo };
      else datos = { id: d.id, motivo: d.motivo };
      if (d.k === 'asignar') { if (d.nivel === 'sucursal' && !d.sucursal) return setErr('Elige la sucursal.'); if ((d.nivel === 'ciudad' || d.nivel === 'zona') && !d.ciudad) return setErr('Elige la ciudad.'); if (d.nivel === 'zona' && !d.zona) return setErr('Elige la zona.'); }
      setEnv(true); S.accion(tipo, datos).then((r) => { setEnv(false); if (r && r.ok) { cerrar(); p.onOk(r.mensaje || 'Guardado.'); } else setErr((r && r.mensaje) || 'La base no guardó el cambio.'); }); };
    const campo = (id, lbl, el, ayuda) => h('div', { style: { marginBottom: 14 } }, h('label', { className: 'rdi-lbl', htmlFor: id }, lbl), el, ayuda ? h('span', { style: { display: 'block', fontSize: 12.5, color: 'var(--text-muted)', marginTop: 5 } }, ayuda) : null);
    const mot = campo('rdi-d-motivo', 'Motivo (obligatorio)', h('textarea', { id: 'rdi-d-motivo', className: 'rdi-in', value: d.motivo, placeholder: 'Mínimo 10 caracteres: queda en el historial', onChange: (e) => upd({ motivo: e.target.value }) }));
    let titulo, desc, cuerpo, ok;
    if (d.k === 'asignar') { titulo = 'Agregar cobertura'; desc = 'Para ' + p.ins.nombre + '. La base revisa que no se repita una cobertura vigente.'; ok = 'Agregar cobertura';
      cuerpo = [campo('rdi-d-nivel', 'Nivel', h('select', { id: 'rdi-d-nivel', className: 'rdi-in', value: d.nivel, onChange: (e) => upd({ nivel: e.target.value, zona: '' }) }, [['todas', 'Todas (cualquier inspección)'], ['sucursal', 'Sucursal (sus casos, estén donde estén)'], ['ciudad', 'Ciudad completa'], ['zona', 'Zona de una ciudad']].map(([v, t]) => h('option', { key: v, value: v }, t)))),
        d.nivel === 'sucursal' ? campo('rdi-d-suc', 'Sucursal', h('select', { id: 'rdi-d-suc', className: 'rdi-in', value: d.sucursal, onChange: (e) => upd({ sucursal: e.target.value }) }, h('option', { value: '' }, 'Elige la sucursal'), sucs.map((s) => h('option', { key: s, value: s }, s)))) : null,
        d.nivel === 'ciudad' || d.nivel === 'zona' ? campo('rdi-d-ciu', 'Ciudad', h('select', { id: 'rdi-d-ciu', className: 'rdi-in', value: d.ciudad, onChange: (e) => upd({ ciudad: e.target.value, zona: '' }) }, h('option', { value: '' }, 'Elige la ciudad'), (d.nivel === 'zona' ? conZonas : ciudades).map((c) => h('option', { key: c.cod, value: c.cod }, c.nombre + (c.provNombre ? ' (' + c.provNombre + ')' : '')))), d.nivel === 'zona' ? 'Solo las ciudades con zonas activas (Ciudades y zonas).' : null) : null,
        d.nivel === 'zona' && d.ciudad ? campo('rdi-d-zona', 'Zona', h('select', { id: 'rdi-d-zona', className: 'rdi-in', value: d.zona, onChange: (e) => upd({ zona: e.target.value }) }, h('option', { value: '' }, 'Elige la zona'), act(d.ciudad).map((z) => h('option', { key: z.id, value: z.id }, 'Zona ' + z.nombre)))) : null,
        h('div', { key: 'fe', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 16px' } }, campo('rdi-d-desde', 'Desde', h('input', { id: 'rdi-d-desde', type: 'date', className: 'rdi-in', value: d.desde || p.hoy, onChange: (e) => upd({ desde: e.target.value }) })),
          campo('rdi-d-hasta', 'Hasta (opcional)', h('input', { id: 'rdi-d-hasta', type: 'date', className: 'rdi-in', value: d.hasta, onChange: (e) => upd({ hasta: e.target.value }) }), 'Para reemplazos y temporadas.')), mot]; }
    else if (d.k === 'retirar') { titulo = 'Quitar cobertura'; desc = 'Quitar «' + d.txt + '» de ' + p.ins.nombre + '.'; ok = 'Quitar cobertura'; cuerpo = [mot]; }
    else if (d.k === 'bloquear') { titulo = 'Agregar bloqueo'; desc = p.ins.nombre + ' no recibe visitas ni ofertas en este rango.'; ok = 'Agregar bloqueo';
      cuerpo = [h('div', { key: 'fe', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 16px' } }, campo('rdi-d-bd', 'Desde', h('input', { id: 'rdi-d-bd', type: 'datetime-local', className: 'rdi-in', value: d.desde, onChange: (e) => upd({ desde: e.target.value }) })), campo('rdi-d-bh', 'Hasta', h('input', { id: 'rdi-d-bh', type: 'datetime-local', className: 'rdi-in', value: d.hasta, onChange: (e) => upd({ hasta: e.target.value }) }))), mot]; }
    else { titulo = 'Quitar bloqueo'; desc = 'Quitar «' + d.txt + '» de ' + p.ins.nombre + '.'; ok = 'Quitar bloqueo'; cuerpo = [mot]; }
    const B = NS().Button, pie = [B ? h(B, { key: 'c', variant: 'ghost', onClick: cerrar }, 'Cancelar') : h('button', { key: 'c', type: 'button', onClick: cerrar }, 'Cancelar'), B ? h(B, { key: 'o', variant: 'primary', loading: env, id: 'rdi-d-ok', onClick: enviar }, ok) : h('button', { key: 'o', type: 'button', onClick: enviar }, ok)];
    const errEl = err ? h('p', { key: 'err', role: 'alert', 'data-red-error': '', style: { margin: '0 0 12px', padding: '10px 12px', borderRadius: 8, background: '#FDECEA', color: '#A1261B', fontSize: 14 } }, err) : null;
    return M ? h(M, { open: true, onClose: cerrar, size: 'md', align: 'left', title: titulo, description: desc, footer: pie }, h('div', { className: 'rdi', 'data-red-dialogo': d.k }, errEl, cuerpo)) : null;
  }
  W.SiriusRedInspectores = SiriusRedInspectores;
})();
