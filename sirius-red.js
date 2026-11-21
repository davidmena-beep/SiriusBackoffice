// SIRIUS · Red de inspectores (v1.1 · etapa R-3b · DEC-265 · 21/11/2026: Por zona y Por sucursal; v1.0 en R-3a · DEC-262). Menú «Red de inspectores» (operación del negocio, después de Agenda) para quien tiene
// «Gestionar la red de inspectores» en la matriz (Administrador y Coordinador de inspecciones). Vistas: Por zona y Por sucursal (R-3b · DEC-265, con redLugar) y Por inspector (R-3a).
// Una sola fuente: la cobertura, la operación, la jornada y los bloqueos de cada inspector se leen y se guardan solo aquí. Con la conexión: SIRIUS_CONEXION.red y
// SIRIUS_CONEXION.redAccion(tipo, datos) → { ok, mensaje }; sin la conexión: SIRIUS_RED (datos-red.js), con redAccion simulada en la sesión (SIRIUS_RED.aplicar).
// La cobertura se resume y se decide con SiriusCobertura (resumenFilas, cortoFilas, cubreFilas): lo que muestra Por inspector = SiriusCobertura.cubre = la base.
// Filas que vienen de la ficha del usuario: «Viene de la ficha», sin «Quitar» (se cambian allí durante la transición). R-5a · DEC-266: los bloqueos son todos de la Red (con «Quitar»).
// Componente: window.SiriusRedInspectores({ rol, usuario, escena, rev, onIr, inspector }). Escenas: red, redsincob, redasignar, redoperacion y redcx; R-3b: redzona, redzonasinzonas, redzonaprobar, redzonaconfirmar, redzonaasignar, redsucursal, redsucursalasignar, redzonacx y redzonacxerror. Lógica: window.SiriusRed.
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
  // Etapa R-4 · DEC-262: la operación de un inspector para la tarjeta «Operación (solo lectura)» de la ficha de Usuarios (misma fuente que Por inspector: SIRIUS_CONEXION.red o SIRIUS_RED).
  // → null si la base no trae la red; { encontrado: false } si el inspector no figura; si figura: { encontrado, cobertura, modalidadesRamos, recibe, jornada }.
  const DIA_L = ['', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  S.diasTxt = (dias) => { const d = Array.from(new Set((dias || []).map(Number).filter((x) => x >= 1 && x <= 7))).sort((a, b) => a - b); if (!d.length) return 'Sin días';
    const seguidos = d.every((x, i) => i === 0 || x === d[i - 1] + 1), cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    if (d.length === 1) return cap(DIA_L[d[0]]); if (seguidos) return cap(DIA_L[d[0]]) + ' a ' + DIA_L[d[d.length - 1]];
    const n = d.map((x) => DIA_L[x]); return cap(n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1]); };
  S.jornadaTxt = (op) => { const j = (op || {}).jornada || {}, c = (op || {}).capacidadDia; if (!j.desde) { const SF = window.SiriusFecha, G = SF && SF.jornadaDefecto ? SF.jornadaDefecto() : null; return 'Sin jornada propia' + (G ? ': usa la jornada por defecto (' + S.diasTxt(G.dias) + ', ' + G.desde + ' a ' + G.hasta + ')' : '') + (c ? ' · capacidad ' + c + ' por día' : ''); } /* R-5a · DEC-268 */
    return S.diasTxt(j.dias) + ', ' + j.desde + ' a ' + j.hasta + ' · ' + (c ? 'capacidad ' + c + ' por día' : 'sin límite de visitas por día'); };
  // Resumen de cobertura para la ficha: como el corto de la Red, pero con «(ciudad completa)» en cada ciudad entera, por ejemplo «Sucursal Quito · Riobamba (ciudad completa)».
  S.coberturaTxt = (i, hoy) => { const C = COB(); if (!C) return ''; const v = C.vigentes(i.cobertura || [], hoy); if (!v.length) return 'Sin cobertura vigente'; if (v.some((f) => f.nivel === 'todas')) return 'Todas las inspecciones';
    const zon = {}, out = []; v.forEach((f) => { if (f.nivel === 'zona') { const k = String(f.ciudad); (zon[k] = zon[k] || []).push(C.zonaNombre(k, String(f.zona || ''))); } });
    v.forEach((f) => { if (f.nivel === 'sucursal') out.push('Sucursal ' + f.sucursal); else if (f.nivel === 'ciudad') out.push(C.ciudadNombre(f.ciudad) + ' (ciudad completa)'); else if (f.nivel === 'zona' && zon[String(f.ciudad)]) { out.push(C.ciudadNombre(f.ciudad) + ' · ' + (zon[String(f.ciudad)].length === 1 ? 'Zona ' : 'Zonas ') + C.lista(zon[String(f.ciudad)])); delete zon[String(f.ciudad)]; } });
    return out.filter((x, k, arr) => arr.indexOf(x) === k).join(' · '); };
  S.operacionDe = (nombre) => { const D = S.datos(), red = D && D.red; if (!red) return null; const i = (red.inspectores || []).find((x) => x && x.nombre === nombre); if (!i) return { encontrado: false };
    const op = i.operacion || {}, hoy = red.hoy || (COB() ? COB().hoy() : ''), L = (a, todo) => ((a || []).length ? a.join(', ') : todo);
    return { encontrado: true, cobertura: S.coberturaTxt(i, hoy), modalidadesRamos: L(op.modalidades, 'Todas las modalidades') + ' · ' + L(op.ramos, 'Todos los ramos'),
      recibe: op.recibeOfertas === 'red' ? 'De Coordinación y de la red' : op.recibeOfertas === 'coord' ? 'Solo de Coordinación' : 'No recibe ofertas', jornada: S.jornadaTxt(op) }; };
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
    const [tab, setTab] = R().useState(/^redzona/.test(esc) ? 'zona' : /^redsucursal/.test(esc) ? 'sucursal' : 'inspector'); /* R-3b: escenas de Por zona y Por sucursal */
    const [ciudad, setCiudad] = R().useState(() => { if (esc === 'redzonasinzonas') return '1801'; if (/^redzona/.test(esc)) return '1701'; const SU0 = W.SiriusUsuarios, u = SU0 && SU0.usuario ? SU0.usuario(props.usuario) : null, sc = u && (u.sucursal || (Array.isArray(u.sucursales) && u.sucursales[0])); return (sc && S.codSucursal(sc)) || '1701'; }); /* R-3b: la sucursal del usuario o Quito */
    const [q, setQ] = R().useState('');
    const [filtro, setFiltro] = R().useState(esc === 'redsincob' ? 'sincob' : 'todos');
    const [sel, setSel] = R().useState(props.inspector ? String(props.inspector) /* R-4: «Abrir en Red de inspectores» desde la ficha de Usuarios */ : esc === 'red' || esc === 'redasignar' || esc === 'redoperacion' || esc === 'redcx' || esc === 'redlistalarga' ? 'Sofía Arteaga' : esc === 'redsincob' ? 'Cristian Vaca' : '');
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
    if (!red) return marco(h('div', { className: 'rdi-card', 'data-red-sinbase': '', style: { maxWidth: 720 } }, h('h2', { className: 'rdi-h3', style: { marginBottom: 6 } }, 'La base todavía no tiene la red de inspectores'), h('p', { style: { margin: 0, fontSize: 14 } }, 'Cuando la conexión entregue la red (SIRIUS_CONEXION.red), aquí se verá la cobertura, la operación, la jornada y los bloqueos de cada inspector.')));
    if (red.listo === false) return marco(h('div', { className: 'rdi-card', role: 'status' }, 'Cargando la red de inspectores…'));
    // R-3b · DEC-265: Por zona y Por sucursal (redLugar). «Ver en el mapa» de Por sucursal abre Por zona con esa ciudad.
    if (tab === 'zona') return marco(h(PorZona, { key: 'zona', ciudad, setCiudad, n, escena: esc, red, hoy, puede }));
    if (tab === 'sucursal') return marco(h(PorSucursal, { key: 'suc', n, escena: esc, red, hoy, puede, irMapa: (c) => { setCiudad(c); setTab('zona'); setTimeout(() => { const b = document.getElementById('rdi-tab-zona'); if (b) b.focus(); }, 0); } }));

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
      !(op0.jornada && op0.jornada.desde) && !dr.jornada ? h('p', { 'data-red-jornada-defecto': '', style: { margin: '14px 0 0', fontSize: 14.5, color: 'var(--text-muted)' } }, S.jornadaTxt({ jornada: null }) + '. Marca los días y las horas para darle una jornada propia.') : null, /* R-5a · DEC-268 */
      h('p', { style: { margin: '14px 0 0', padding: '10px 14px', borderRadius: 8, background: '#E9F5F1', color: 'var(--text-strong)', fontSize: 14.5 } }, 'Única fuente: la base, Coordinar visita, la Agenda, las ofertas y el portal del cliente usan esta jornada.'));
    const bl = actual.bloqueos || [];
    const bloq = h('section', { key: 'bl', className: 'rdi-card', 'aria-labelledby': 'rdi-h-bl', 'data-red-bloqueos': '' },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 } }, h('h3', { id: 'rdi-h-bl', className: 'rdi-h3' }, 'Bloqueos'),
        ro ? null : boton({ id: 'rdi-agregar-bl', onClick: (e) => { retRef.current = e.currentTarget; setDlg({ k: 'bloquear', desde: hoy + 'T08:00', hasta: hoy + 'T17:00', motivo: '' }); } }, 'Agregar bloqueo')),
      bl.length ? h('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, bl.map((b) => h('li', { key: b.id, 'data-red-bloqueo': b.id, style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, background: 'var(--surface-subtle,#F5F6F8)', borderRadius: 8, padding: '10px 14px', fontSize: 15 } },
        h('span', { style: { minWidth: 0 } }, h('b', { style: { color: 'var(--text-strong)' } }, b.motivo || 'Bloqueo'), ' · ' + bloqTxt(b)),
        h('span', { style: { display: 'flex', alignItems: 'center', gap: 12 } }, b.por ? h('span', { style: { fontSize: 13.5, color: 'var(--text-muted)' } }, 'Registró ' + b.por) : null,
          ro ? null : h('button', { type: 'button', className: 'rdi-q', 'aria-label': 'Quitar bloqueo ' + (b.motivo || '') + ' ' + bloqTxt(b), onClick: (e) => { retRef.current = e.currentTarget; setDlg({ k: 'desbloquear', id: b.id, txt: (b.motivo || 'Bloqueo') + ' · ' + bloqTxt(b), motivo: '' }); } }, 'Quitar'))))) :
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
  // ---------- R-3b · DEC-265: Por zona, Por sucursal y el diálogo «Asignar inspectores» ----------
  // Lo que muestra la Red es lo que ofrece el portal: las listas salen de redLugar (con la conexión: SIRIUS_CONEXION.redLugar = función red_lugar de la base, SQL 75;
  // sin la conexión: SIRIUS_RED.lugar con la red de la sesión). Con { ok: false } se muestra el mensaje y no cambia nada. Asignar usa redAccion('asignar', …) y vuelve a pedir redLugar.
  const arrL = (x) => (Array.isArray(x) ? x : []), cnt = (x) => (Array.isArray(x) ? x.length : Number(x) || 0), nomDe = (x) => (x && typeof x === 'object' ? String(x.nombre || '') : String(x || ''));
  const nrm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const nInsp = (n) => n + (n === 1 ? ' inspector' : ' inspectores');
  S.lugar = (datos) => { const X = S.cx();
    if (X) { if (typeof X.redLugar !== 'function') return Promise.resolve({ ok: false, mensaje: 'La conexión todavía no calcula la red por lugar (falta el SQL 75)' });
      return Promise.resolve().then(() => X.redLugar(datos)).then((r) => r || { ok: false, mensaje: 'La base no respondió.' }, (e) => ({ ok: false, mensaje: String((e && e.message) || e || 'La base no respondió.') })); }
    const D = W.SIRIUS_RED; if (!D || typeof D.lugar !== 'function') return Promise.resolve({ ok: false, mensaje: 'No hay datos de la red de inspectores.' });
    return Promise.resolve(D.lugar(datos, S.demo())); };
  // Categoría de un inspector según DEC-265 (para «Aporta» y el efecto del diálogo): Inmediata = Interno o Agencia; Red = Agencia o Independiente con «Recibe ofertas» = red.
  S.categoria = (i) => { const t = (i && (i.tipo || i.tipoInspector)) || '', rec = ((i && i.operacion) || {}).recibeOfertas; return { inmediata: t === 'Interno' || t === 'Agencia', red: (t === 'Agencia' || t === 'Independiente') && rec === 'red' }; };
  // Ciudades del selector de Por zona: las que tienen zonas publicadas activas y las de las 11 sucursales.
  S.codSucursal = (s) => { const Z0 = SZ(); if (!Z0 || !s) return ''; const n = nrm(s), c = Z0.ciudades().find((x) => nrm(x.nombre) === n); return c ? c.cod : ''; };
  S.ciudadesRed = () => { const Z0 = SZ(); if (!Z0) return []; const pub = (Z0.publicado() || {}).ciudades || {}, cods = {};
    Object.keys(pub).forEach((c) => { if (arrL(pub[c].zonas).some((z) => z.estado !== 'Inactiva')) cods[c] = 1; });
    (COB() ? COB().sucursales() : []).forEach((s) => { const c = S.codSucursal(s); if (c) cods[c] = 1; });
    return Object.keys(cods).map((c) => Z0.ciudad(c)).filter(Boolean).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); };
  const COLZ = { azul: '#1F5FBF', ambar: '#B86E00', rojo: '#C62828', punto: '#011E41' };
  const sinNadie = (z) => z.alerta === 'Sin inspectores' || (!cnt(z.inmediata) && !cnt(z.red) && !cnt(z.coordinacion));
  const colorZona = (z) => (sinNadie(z) ? COLZ.rojo : arrL(z.propios).length ? COLZ.azul : COLZ.ambar);
  const tonoAl = (t) => (t === 'error' ? 'danger' : t === 'aviso' ? 'warning' : 'neutral');
  const insDe = (red, n) => arrL(red && red.inspectores).find((x) => x && x.nombre === n) || null;
  const catDe = (x, red) => (x && typeof x === 'object' && typeof x.inmediata === 'boolean' ? { inmediata: x.inmediata, red: !!x.red } : S.categoria(insDe(red, nomDe(x)) || {}));
  const etiquetas = (c, k) => [c.inmediata ? pill('Inmediata', 'success', k + 'i') : null, c.red ? pill('Red', 'brand', k + 'r') : null, !c.inmediata && !c.red ? pill('solo Coordinación', 'neutral', k + 'c') : null];
  const personas = (L, red, vacio, k) => (arrL(L).length ? h('ul', { className: 'rdz-pers', 'data-rdz-lista': k }, arrL(L).map((x, j) => { const n = nomDe(x), ins = insDe(red, n), t = (x && x.tipo) || (ins && ins.tipo) || '';
    return h('li', { key: n + j, 'data-rdz-persona': n }, h('span', { className: 'rdz-pn' }, h('b', null, n), h('span', { className: 'rdz-pt' }, ' · ' + (t || '—') + (x && x.nivel === 'todas' ? ' · todas las sucursales' : ''))), h('span', { className: 'rdz-tags' }, etiquetas(catDe(x, red), n))); }))
    : h('p', { className: 'rdz-vacio' }, vacio));
  const nombres = (L) => (arrL(L).length ? arrL(L).map(nomDe).join(', ') : 'nadie');
  let cssZ = false; const ponerCssZ = () => { if (cssZ || !W.document) return; cssZ = true; const s = document.createElement('style');
    s.textContent = '.rdz-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;margin:0 0 14px}.rdz-ciu{display:flex;align-items:center;gap:10px}.rdz-ciu select{width:auto;min-width:200px;height:42px}' +
      '.rdz-grid{display:grid;grid-template-columns:minmax(0,1fr) clamp(380px,34%,460px);gap:18px;height:var(--rdz-alto,560px);min-height:460px}' +
      '.rdz-map{position:relative;min-height:360px;border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden;background:#E6ECF1}' +
      '.rdz-col{min-height:0;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:14px;padding:2px 8px 2px 2px}.rdz-col::-webkit-scrollbar{width:10px}.rdz-col::-webkit-scrollbar-track{background:#EEF0F3;border-radius:6px}.rdz-col::-webkit-scrollbar-thumb{background:#8A94A3;border-radius:6px;border:2px solid #EEF0F3}' +
      '@media (max-width:1099px){.rdz-grid{grid-template-columns:minmax(0,1fr);height:auto}.rdz-map{height:440px}.rdz-col{overflow:visible}}' +
      '.rdz-sec{padding:18px 18px}.rdz-pers{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.rdz-pers li{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 8px;font-size:14.5px}' +
      '.rdz-pn{min-width:0;color:var(--text-strong)}.rdz-pt{color:var(--text-muted);font-size:13.5px}.rdz-tags{display:flex;flex-wrap:wrap;gap:4px}.rdz-tags .rdi-pill{font-size:12px;padding:2px 8px}.rdz-vacio{margin:0;font-size:14px;color:var(--text-muted)}' +
      '.rdz-nota{margin:10px 0 0;font-size:13px;color:var(--text-muted)}.rdz-zona{border:1px solid var(--border-subtle);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;background:#fff;scroll-margin:8px}.rdz-zona.sel{border-color:var(--color-brand-strong,#0033A1);box-shadow:0 0 0 2px var(--color-brand-strong,#0033A1)}' +
      '.rdz-zh{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 8px}.rdz-zn{border:0;background:none;padding:0;display:inline-flex;align-items:center;gap:8px;font:700 16px var(--font-brand);color:var(--text-strong);cursor:pointer;text-align:left}.rdz-zn:hover{text-decoration:underline}' +
      '.rdz-dot{width:12px;height:12px;border-radius:50%;flex:0 0 auto;border:2px solid #fff;box-shadow:0 0 0 1px rgba(1,30,65,.35)}.rdz-cuenta{font-size:14px;font-weight:700;color:var(--text-strong)}.rdz-det{font-size:13px;color:var(--text-muted);line-height:1.45}.rdz-h5{margin:4px 0 2px;font:700 13px var(--font-brand);color:var(--text-strong)}' +
      '.rdz-flot{position:absolute;z-index:1000;background:#fff;border-radius:12px;box-shadow:0 4px 18px rgba(1,30,65,.22)}' +
      '.rdz-probar{left:12px;bottom:12px;width:min(360px,calc(100% - 24px));max-height:calc(100% - 24px);overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}' +
      '.rdz-ley{top:12px;right:12px;padding:8px 10px;font-size:12.5px;color:var(--text-strong);display:flex;flex-direction:column;gap:4px}.rdz-ley span{display:flex;align-items:center;gap:6px}' +
      '.rdz-sug{display:block;width:100%;text-align:left;border:0;background:none;padding:6px 10px;font:400 14px var(--font-brand);color:var(--text-strong);cursor:pointer}.rdz-sug[aria-selected="true"],.rdz-sug:hover{background:var(--cyan-100)}' +
      '.rdz-res{border-top:1px solid var(--border-subtle);padding-top:8px;display:flex;flex-direction:column;gap:6px;font-size:13.5px}.rdz-res ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}' +
      '.rdz-tb{width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px}.rdz-tb th{text-align:left;font:700 13.5px var(--font-brand);color:var(--text-strong);padding:8px;border-bottom:1px solid var(--border-subtle);vertical-align:bottom}.rdz-tb td{padding:10px 8px;border-bottom:1px solid var(--border-subtle);vertical-align:top;overflow-wrap:anywhere;color:var(--text-body)}' +
      '.rdz-tb tr.ya td{color:var(--text-muted)}.rdz-tb input[type=checkbox]{width:18px;height:18px;margin:2px 0 0;accent-color:var(--color-brand-strong,#0033A1)}.rdz-acc{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}' +
      '.rdz-ef{border-radius:10px;background:var(--surface-brand-subtle,#EEF4FF);padding:12px 14px;font-size:14px;color:var(--text-strong);display:flex;flex-direction:column;gap:4px}.rdz-niv{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;border:0;margin:0 0 14px;padding:0}' +
      '.rdz-niv label{display:flex;gap:10px;align-items:flex-start;border:1.5px solid var(--border-default);border-radius:10px;padding:10px 12px;cursor:pointer;font-size:14px}.rdz-niv label.on{border-color:var(--color-brand-strong,#0033A1);background:var(--surface-brand-subtle,#EEF4FF)}.rdz-niv input{margin-top:3px;accent-color:var(--color-brand-strong,#0033A1)}' +
      '.rdz-av{padding:10px 14px;border-radius:8px;font-size:14.5px;margin:0 0 12px}.rdz-av.ok{background:#E7F5EA;color:#1E6B34}.rdz-av.mal{background:#FDECEA;color:#A1261B}' +
      '.rdz-sutb .rdi-pill{white-space:normal;text-align:left}@media (max-width:1099px){.rdz-sutb{font-size:13.5px}}';
    document.head.appendChild(s); };
  const avisoEl = (a, k) => (a ? h('div', { key: k, className: 'rdz-av ' + (a.ok ? 'ok' : 'mal'), role: a.ok ? 'status' : 'alert', 'data-rdz-aviso': a.ok ? 'ok' : 'error' }, a.t) : null);
  const fDMy = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? m[3] + '/' + m[2] : ''; };

  // Mapa de Por zona (SiriusMapa): círculo y punto por zona activa (o su área), color por estado (también en texto en las tarjetas), radio de la ciudad sin zonas, dirección probada.
  function MapaRed(p) {
    const el = R().useRef(null), mm = R().useRef(null), fx = R().useRef(p), ciu = R().useRef(''); fx.current = p;
    R().useEffect(() => { const M = W.SiriusMapa; if (!M || !W.L || !el.current) return undefined; const m = M.crear(el.current, { centro: [-0.205, -78.49], zoom: 11 }); mm.current = m; if (!m) return undefined;
      m.map.on('click', (e) => { const f = fx.current; if (f.onPunto) f.onPunto([Math.round(e.latlng.lat * 1e5) / 1e5, Math.round(e.latlng.lng * 1e5) / 1e5]); });
      let ro = null; if (W.ResizeObserver) { ro = new W.ResizeObserver(() => m.invalidar()); ro.observe(el.current); }
      fx.current.dibujar = true; return () => { if (ro) ro.disconnect(); m.destruir(); mm.current = null; ciu.current = ''; }; }, []);
    R().useEffect(() => { const m = mm.current, L = W.L, M = W.SiriusMapa, d = p.data; if (!m || !L || !M) return; m.capa.clearLayers(); if (!d) return;
      const zs = arrL(d.zonas), pts = [];
      zs.forEach((z) => { if (!Array.isArray(z.punto)) return; const col = colorZona(z), sel = z.id === p.zonaSel, est = z.alerta || 'Con inspectores propios', elegir = () => { if (fx.current.onZona) fx.current.onZona(z.id); };
        if (Array.isArray(z.area) && z.area.length >= 3) { L.polygon(z.area, { color: col, weight: sel ? 3.5 : 2.5, fillColor: col, fillOpacity: sel ? 0.3 : 0.16, bubblingMouseEvents: false }).on('click', elegir).addTo(m.capa); z.area.forEach((q) => pts.push(q)); }
        else L.circle(z.punto, { radius: Math.max(600, (Number(d.radio) || 10) * 100), color: col, weight: sel ? 3.5 : 2, fillColor: col, fillOpacity: sel ? 0.34 : 0.2, bubblingMouseEvents: false }).on('click', elegir).addTo(m.capa);
        L.marker(z.punto, { icon: M.pin(col, z.nombre, sel), title: 'Zona ' + z.nombre + ' · ' + est, alt: 'Zona ' + z.nombre + ' · ' + est, keyboard: true, bubblingMouseEvents: false, zIndexOffset: sel ? 800 : 0 }).on('click', elegir).addTo(m.capa); pts.push(z.punto); });
      const Z0 = SZ(), c0 = (Z0 && Z0.centro(d.ciudad)) || pts[0] || [-1.5, -78.5]; let rc = null;
      if (!zs.length) rc = L.circle(c0, { radius: (Number(d.radio) || 10) * 1000, color: COLZ.punto, weight: 1.5, dashArray: '6 6', fillColor: COLZ.punto, fillOpacity: 0.04, interactive: false }).addTo(m.capa);
      if (p.prueba && Array.isArray(p.prueba.p) && (!p.prueba.c || p.prueba.c === d.ciudad)) L.marker(p.prueba.p, { icon: M.pinCaso(), title: 'Dirección probada', alt: 'Dirección probada', interactive: false, keyboard: false, zIndexOffset: 900 }).addTo(m.capa);
      if (ciu.current !== d.ciudad) { ciu.current = d.ciudad; m.invalidar(); try { if (pts.length > 1) m.map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [60, 50], paddingBottomRight: [60, 150], maxZoom: 12 }); else if (rc) m.map.fitBounds(rc.getBounds(), { paddingTopLeft: [24, 24], paddingBottomRight: [24, 120] }); /* abajo queda el panel «Probar una dirección» */ else m.map.setView(c0, 12); } catch (e) { /* nada */ } }
    }, [p.data, p.zonaSel, p.prueba]);
    R().useEffect(() => { const m = mm.current; if (m && p.prueba && Array.isArray(p.prueba.p) && p.prueba.centrar) { try { m.map.panTo(p.prueba.p); } catch (e) { /* nada */ } } }, [p.prueba]);
    return h('div', { ref: el, 'data-rdz-leaflet': '', style: { position: 'absolute', inset: 0 } });
  }

  function PorZona(p) {
    ponerCssZ();
    const ciudad = p.ciudad, esc = p.escena || '', red = p.red, hoy = p.hoy, puede = p.puede;
    const [st, setSt] = R().useState({ data: null, cargando: true, err: '' });
    const [zonaSel, setZonaSel] = R().useState('');
    const [prueba, setPrueba] = R().useState(() => (esc === 'redzonaprobar' ? { t: 'Av. Amazonas N36-152 y Naciones Unidas', p: [-0.1765, -78.4845], c: '1701' } : esc === 'redzonaconfirmar' ? { t: 'Calle sin nombre, barrio La Esperanza', p: null, c: '1701' } : null));
    const [pq, setPq] = R().useState(prueba ? prueba.t : ''), [sugs, setSugs] = R().useState([]), [sugOpen, setSugOpen] = R().useState(false), [sugIdx, setSugIdx] = R().useState(-1);
    const [pr, setPr] = R().useState({ r: null, cargando: false, err: '' });
    const [dlg, setDlg] = R().useState(null), [aviso, setAviso] = R().useState(null);
    const seq = R().useRef(0), pseq = R().useRef(0), sseq = R().useRef(0), auto = R().useRef(esc === 'redzonaasignar'), retRef = R().useRef(null), gridRef = R().useRef(null);
    const [alto, setAlto] = R().useState(0);
    R().useLayoutEffect(() => { const calc = () => { const g = gridRef.current; if (!g || !W.innerHeight) return; const a = Math.max(460, Math.round(W.innerHeight - Math.max(g.getBoundingClientRect().top, 8) - 16)); setAlto((x) => (Math.abs(x - a) > 1 ? a : x)); };
      calc(); const t = setTimeout(calc, 250); W.addEventListener('resize', calc); return () => { clearTimeout(t); W.removeEventListener('resize', calc); }; }, [!!st.data, !!st.err, !!aviso]);
    R().useEffect(() => { const k = ++seq.current; setSt((x) => Object.assign({}, x, { cargando: true }));
      S.lugar({ vista: 'ciudad', ciudad }).then((r) => { if (k !== seq.current) return; if (r && r.ok) setSt({ data: r, cargando: false, err: '' }); else setSt((x) => ({ data: x.data && x.data.ciudad === ciudad ? x.data : null, cargando: false, err: (r && r.mensaje) || 'La base no devolvió la red de ' + ciudad + '.' })); }); }, [ciudad, p.n]);
    R().useEffect(() => { const k = ++pseq.current; if (!prueba) { setPr({ r: null, cargando: false, err: '' }); return; } setPr((x) => Object.assign({}, x, { cargando: true }));
      S.lugar({ vista: 'probar', lugar: Object.assign({ ciudad: prueba.c || ciudad, direccion: prueba.t }, Array.isArray(prueba.p) ? { punto: prueba.p } : {}) }).then((r) => { if (k !== pseq.current) return; if (r && r.ok) setPr({ r, cargando: false, err: '' }); else setPr({ r: null, cargando: false, err: (r && r.mensaje) || 'La base no respondió.' }); }); }, [prueba, p.n]);
    const d = st.data && st.data.ciudad === ciudad ? st.data : null;
    const base = (o) => Object.assign({ ciudad: d.ciudad, ciudadNombre: d.ciudadNombre || d.ciudad, sucursal: d.sucursal || '', ciudadBase: { inmediata: d.inmediata, red: d.red, alerta: d.alerta } }, o);
    R().useEffect(() => { if (!auto.current || !d) return; auto.current = false; const z = arrL(d.zonas).find((x) => x.id === 'z1701-3') || arrL(d.zonas).find((x) => !arrL(x.propios).length); if (z) { setZonaSel(z.id); setDlg(base({ entrada: 'zona', zona: z, elegidos: ['Cristian Vaca', 'Luis Andrade'] })); } }, [d]);
    const abrir = (o, e) => { retRef.current = e && e.currentTarget ? e.currentTarget : null; setAviso(null); setDlg(base(o)); };
    const elegirZona = (id) => { setZonaSel(id); setTimeout(() => { const c = document.getElementById('rdz-zona-' + id); if (c) { c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); c.focus({ preventScroll: true }); } }, 30); };
    // probar una dirección (búsqueda de Coordinación: SiriusUbicacion)
    const UBI = () => W.SiriusUbicacion;
    const elegirDir = (x) => { setSugOpen(false); setSugIdx(-1); setPq(x.texto); const c = x.ciudad || ciudad; if (c !== ciudad && S.ciudadesRed().some((y) => y.cod === c)) p.setCiudad(c); setPrueba({ t: x.texto, p: x.punto, c, centrar: true }); };
    const sugerir = (q) => { const U = UBI(), k = ++sseq.current; if (!U || String(q).trim().length < 3) { setSugs([]); setSugOpen(false); return; } U.buscar(q, ciudad).then((r) => { if (k !== sseq.current) return; setSugs(r); setSugIdx(-1); setSugOpen(r.length > 0); }); };
    const buscarDir = () => { const U = UBI(), q = String(pq).trim(); if (!q) return; const k = ++sseq.current; (U ? U.buscar(q, ciudad) : Promise.resolve([])).then((r) => { if (k !== sseq.current) return; if (r.length) elegirDir(r[0]); else { setSugOpen(false); setPrueba({ t: q, p: null, c: ciudad }); } }); };
    const quitarPrueba = () => { setPrueba(null); setPq(''); setSugs([]); setSugOpen(false); };
    const opciones = S.ciudadesRed(); if (ciudad && !opciones.some((c) => c.cod === ciudad) && SZ() && SZ().ciudad(ciudad)) opciones.push(SZ().ciudad(ciudad));
    const nomCiu = (d && d.ciudadNombre) || ((SZ() && SZ().ciudad(ciudad)) || {}).nombre || ciudad;
    const rs = d ? (d.resumen || {}) : {}, nZon = d ? (rs.zonas != null ? rs.zonas : arrL(d.zonas).length) : 0, nIns = d ? (rs.inspectores != null ? rs.inspectores : 0) : 0;
    const bar = h('div', { key: 'bar', className: 'rdz-bar', 'data-rdz-barra': '' },
      h('div', { className: 'rdz-ciu' }, h('label', { className: 'rdi-lbl', htmlFor: 'rdz-ciudad', style: { margin: 0 } }, 'Ciudad'),
        h('select', { id: 'rdz-ciudad', className: 'rdi-in', value: ciudad, onChange: (e) => { setZonaSel(''); setAviso(null); p.setCiudad(e.target.value); } }, opciones.map((c) => h('option', { key: c.cod, value: c.cod }, c.nombre)))),
      h('p', { 'data-rdz-resumen': '', role: 'status', style: { flex: '1 1 300px', margin: 0, fontSize: 15, color: 'var(--text-strong)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } },
        d ? [h('span', { key: 't' }, (nZon ? nZon + (nZon === 1 ? ' zona publicada' : ' zonas publicadas') : 'Sin zonas publicadas') + ' · ' + (nIns ? nInsp(nIns) + (nIns === 1 ? ' atiende ' : ' atienden ') : 'nadie atiende ') + nomCiu), d.alerta ? pill(d.alerta, tonoAl(d.alertaTipo), 'al') : null]
          : st.cargando ? h('span', { style: { color: 'var(--text-muted)' } }, 'Cargando la red de ' + nomCiu + '…') : null),
      puede && d ? boton({ variant: 'primary', id: 'rdz-asignar', onClick: (e) => abrir({ entrada: 'ciudad' }, e) }, 'Asignar inspectores') : null);
    const avisos = [st.err ? avisoEl({ ok: false, t: st.err }, 'e') : null, avisoEl(aviso, 'a')];
    // panel flotante «Probar una dirección»
    const lst = (t, L, k) => h('div', { key: k, 'data-rdz-probar-lista': k }, h('div', { className: 'rdz-h5' }, t + ' (' + arrL(L).length + ')'), arrL(L).length ? h('ul', null, arrL(L).map((x, j) => h('li', { key: j }, h('b', null, nomDe(x)), h('span', { style: { color: 'var(--text-muted)' } }, ' · ' + ((x && x.tipo) || ((insDe(red, nomDe(x)) || {}).tipo) || '—'))))) : h('p', { className: 'rdz-vacio', style: { fontSize: 13 } }, 'Nadie'));
    const res = pr.cargando ? h('p', { className: 'rdz-vacio', role: 'status' }, 'Calculando…') : pr.err ? h('p', { role: 'alert', 'data-rdz-probar-error': '', style: { margin: 0, fontSize: 13.5, color: '#A1261B' } }, pr.err)
      : pr.r ? h('div', { className: 'rdz-res', role: 'status', 'data-rdz-probar-res': (pr.r.lugar && pr.r.lugar.zona && (pr.r.lugar.zona.id || pr.r.lugar.zona)) || pr.r.lugar && pr.r.lugar.estadoZona || '' },
        h('div', { style: { fontWeight: 700, fontSize: 15, color: 'var(--text-strong)' } }, (pr.r.lugar && pr.r.lugar.texto) || ''), pr.r.mensaje ? h('div', { style: { color: 'var(--text-body)' } }, pr.r.mensaje) : null,
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 } }, lst('Confirmación inmediata', pr.r.inmediata, 'inmediata'), lst('Red', pr.r.red, 'red')),
        pr.r.redAmpliada ? h('div', { 'data-rdz-ampliada': '', style: { fontSize: 12.5, color: '#7A4F0E' } }, 'Red ampliada: con «zona por confirmar» nadie de la red atiende toda la ciudad o la sucursal, así que se ofrece a quienes atienden alguna zona.') : null)
        : h('p', { className: 'rdz-vacio', style: { fontSize: 13 } }, 'Verás la zona y lo que ofrecerá el portal.');
    const probar = h('div', { key: 'pro', className: 'rdz-flot rdz-probar', role: 'search', 'aria-label': 'Probar una dirección', 'data-rdz-probar': '' },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } }, h('label', { htmlFor: 'rdz-dir', style: { font: '700 15px var(--font-brand)', color: 'var(--text-strong)' } }, 'Probar una dirección'),
        prueba ? h('button', { type: 'button', className: 'rdi-link', style: { fontSize: 13.5 }, onClick: quitarPrueba, 'data-rdz-quitar': '' }, 'Quitar') : null),
      sugOpen && sugs.length ? h('ul', { id: 'rdz-sugs', role: 'listbox', 'aria-label': 'Direcciones sugeridas', style: { listStyle: 'none', margin: 0, padding: '4px 0', border: '1px solid var(--border-subtle)', borderRadius: 8, maxHeight: 160, overflowY: 'auto' } },
        sugs.map((x, k) => h('li', { key: k, role: 'none' }, h('button', { type: 'button', role: 'option', id: 'rdz-sug-' + k, className: 'rdz-sug', tabIndex: -1, 'aria-selected': k === sugIdx ? 'true' : 'false', onMouseDown: (e) => { e.preventDefault(); elegirDir(x); } },
          x.texto, h('span', { style: { color: 'var(--text-muted)', fontSize: 12.5 } }, ' · ' + (((SZ() && SZ().ciudad(x.ciudad)) || {}).nombre || x.ciudad)))))) : null,
      h('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        h('input', { id: 'rdz-dir', className: 'rdi-in', style: { height: 40, fontSize: 14 }, value: pq, autoComplete: 'off', placeholder: 'Dirección (o clic en el mapa)', role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': sugOpen ? 'true' : 'false', 'aria-controls': 'rdz-sugs', 'aria-activedescendant': sugOpen && sugIdx >= 0 ? 'rdz-sug-' + sugIdx : undefined,
          onChange: (e) => { setPq(e.target.value); sugerir(e.target.value); }, onBlur: () => setTimeout(() => setSugOpen(false), 150),
          onKeyDown: (e) => { const n = sugOpen ? sugs.length : 0; if (e.key === 'ArrowDown' && n) { e.preventDefault(); setSugIdx((sugIdx + 1) % n); } else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setSugIdx((sugIdx - 1 + n) % n); }
            else if (e.key === 'Enter') { e.preventDefault(); if (n && sugIdx >= 0) elegirDir(sugs[sugIdx]); else buscarDir(); } else if (e.key === 'Escape' && sugOpen) { e.preventDefault(); e.stopPropagation(); setSugOpen(false); } } }),
        boton({ variant: 'secondary', size: 'sm', id: 'rdz-buscar', onClick: buscarDir }, 'Buscar')),
      res);
    const ley = h('div', { key: 'ley', className: 'rdz-flot rdz-ley', role: 'note', 'aria-label': 'Leyenda del mapa', 'data-rdz-leyenda': '' },
      [[COLZ.azul, 'Con inspectores propios'], [COLZ.ambar, 'Sin inspectores propios'], [COLZ.rojo, 'Sin inspectores']].map(([c, t]) => h('span', { key: t }, h('i', { className: 'rdz-dot', style: { background: c }, 'aria-hidden': 'true' }), t)),
      h('span', null, h('svg', { width: 12, height: 16, viewBox: '0 0 30 40', 'aria-hidden': 'true' }, h('path', { d: 'M15 39s12-14 12-23A12 12 0 1 0 3 16c0 9 12 23 12 23Z', fill: COLZ.punto }), h('circle', { cx: 15, cy: 16, r: 5, fill: '#00AEEF' })), 'Dirección probada'));
    const mapa = h('div', { key: 'map', className: 'rdz-map', role: 'region', 'aria-label': 'Mapa de ' + nomCiu + ': zonas y dirección probada', 'data-rdz-map': ciudad },
      h(MapaRed, { data: d, zonaSel, prueba, onZona: elegirZona, onPunto: (pt) => { setPq(''); setSugOpen(false); setPrueba({ t: 'Punto marcado en el mapa', p: pt, c: ciudad }); } }), ley, probar);
    // columna derecha
    const sec = (k, titulo, acc, cuerpo) => h('section', { key: k, className: 'rdi-card rdz-sec', 'aria-labelledby': 'rdz-h-' + k, 'data-rdz-sec': k },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 } }, h('h3', { id: 'rdz-h-' + k, className: 'rdi-h3', style: { fontSize: 17 } }, titulo), acc), cuerpo);
    let col = null;
    if (d) { const zs = arrL(d.zonas), pc = d.porConfirmar || {};
      const toda = sec('toda', 'Atienden toda la ciudad', puede ? boton({ size: 'sm', id: 'rdz-asignar-ciudad', onClick: (e) => abrir({ entrada: 'ciudad' }, e) }, 'Asignar') : null,
        [h('div', { key: 'l' }, personas(d.todaCiudad, red, 'Nadie atiende toda ' + nomCiu + '.', 'toda')),
          zs.length ? h('p', { key: 'n', className: 'rdz-nota', 'data-rdz-nota-confirmar': '' }, 'Con «zona por confirmar», el portal solo ofrece horarios de quienes atienden toda la ciudad o la sucursal' + (pc.redAmpliada ? ' y la red se amplía a quienes atienden alguna zona.' : '.')) : null]);
      const porSuc = d.sucursal ? sec('suc', 'Por sucursal ' + d.sucursal, null, [h('div', { key: 'l' }, personas(d.porSucursal, red, 'Nadie atiende por la sucursal ' + d.sucursal + '.', 'sucursal')),
        h('p', { key: 'n', className: 'rdz-nota' }, 'Atiende los casos de la sucursal ' + d.sucursal + ', estén donde estén. Se edita en «Por sucursal».')]) : null;
      const tarjeta = (z) => { const sel = z.id === zonaSel, c = colorZona(z), nI = cnt(z.inmediata), nR = cnt(z.red), nC = cnt(z.coordinacion), prop = arrL(z.propios), al = z.alerta || '';
        return h('article', { key: z.id, id: 'rdz-zona-' + z.id, tabIndex: -1, className: 'rdz-zona' + (sel ? ' sel' : ''), 'data-rdz-zona': z.id, 'data-rdz-alerta': al, 'aria-labelledby': 'rdz-zt-' + z.id },
          h('div', { className: 'rdz-zh' }, h('button', { type: 'button', id: 'rdz-zt-' + z.id, className: 'rdz-zn', 'aria-pressed': sel ? 'true' : 'false', title: 'Ver la zona en el mapa', onClick: () => setZonaSel(sel ? '' : z.id) }, h('i', { className: 'rdz-dot', style: { background: c }, 'aria-hidden': 'true' }), 'Zona ' + z.nombre),
            al ? pill(al, tonoAl(z.alertaTipo), 'al') : pill('Con inspectores propios', 'neutral', 'al')),
          h('div', { className: 'rdz-cuenta', 'data-rdz-cuenta': '' }, 'Inmediata ' + nI + ' · Red ' + nR + (nC ? ' · Solo Coordinación ' + nC : '')),
          h('div', { className: 'rdz-det' }, h('div', { 'data-rdz-inm': nombres(z.inmediata) }, 'Inmediata: ' + nombres(z.inmediata)), h('div', { 'data-rdz-red': nombres(z.red) }, 'Red: ' + nombres(z.red)), nC ? h('div', null, 'Solo Coordinación: ' + nombres(z.coordinacion)) : null),
          h('div', { className: 'rdz-h5' }, 'Propios de la zona'), personas(prop, red, sinNadie(z) ? 'Nadie la atiende: el portal dirá «te contactará un coordinador».' : 'Sin inspectores propios: la atienden quienes cubren toda la ciudad o la sucursal.', 'propios-' + z.id),
          puede ? h('div', null, boton({ size: 'sm', 'data-rdz-asignar-zona': z.id, onClick: (e) => abrir({ entrada: 'zona', zona: z }, e) }, 'Asignar a esta zona')) : null); };
      const sinZ = () => { const z = { id: 'ciudad', nombre: '', inmediata: d.inmediata, red: d.red, coordinacion: d.coordinacion, alerta: d.alerta, alertaTipo: d.alertaTipo }, nI = cnt(z.inmediata), nR = cnt(z.red), nC = cnt(z.coordinacion);
        return h('article', { key: 'sinz', className: 'rdz-zona', 'data-rdz-zona': 'ciudad', 'data-rdz-alerta': z.alerta || '' },
          h('div', { className: 'rdz-zh' }, h('h4', { style: { margin: 0, font: '700 16px var(--font-brand)', color: 'var(--text-strong)' } }, 'Toda la ciudad (sin zonas)'), z.alerta ? pill(z.alerta, tonoAl(z.alertaTipo), 'al') : null),
          h('div', { className: 'rdz-cuenta', 'data-rdz-cuenta': '' }, 'Inmediata ' + nI + ' · Red ' + nR + (nC ? ' · Solo Coordinación ' + nC : '')),
          h('div', { className: 'rdz-det' }, h('div', { 'data-rdz-inm': nombres(z.inmediata) }, 'Inmediata: ' + nombres(z.inmediata)), h('div', { 'data-rdz-red': nombres(z.red) }, 'Red: ' + nombres(z.red)), nC ? h('div', null, 'Solo Coordinación: ' + nombres(z.coordinacion)) : null),
          h('p', { className: 'rdz-nota', style: { marginTop: 0 } }, nomCiu + ' no tiene zonas publicadas: cualquier dirección de la ciudad cuenta como ciudad completa.'),
          puede ? h('div', null, boton({ size: 'sm', id: 'rdz-asignar-sinz', onClick: (e) => abrir({ entrada: 'ciudad' }, e) }, 'Asignar a toda la ciudad')) : null); };
      col = h('div', { key: 'col', className: 'rdz-col', role: 'region', 'aria-label': 'Quién atiende ' + nomCiu, tabIndex: 0, 'data-rdz-col': '' }, toda, porSuc,
        sec('zonas', zs.length ? 'Por zona' : 'Toda la ciudad', null, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, zs.length ? zs.map(tarjeta) : sinZ())));
    } else col = h('div', { key: 'col', className: 'rdz-col', 'data-rdz-col': '' }, h('div', { className: 'rdi-card', role: 'status', 'data-rdz-estado': st.cargando ? 'cargando' : 'vacio' }, st.cargando ? 'Cargando la red de ' + nomCiu + '…' : 'Sin datos de la red para ' + nomCiu + '. Elige otra ciudad o vuelve a intentar más tarde.'));
    const cerrar = () => { setDlg(null); const r0 = retRef.current; setTimeout(() => { if (r0 && r0.isConnected && r0.focus) r0.focus(); }, 60); };
    return h('div', { 'data-red-zona': ciudad }, bar, avisos, h('div', { className: 'rdz-grid', ref: gridRef, style: { '--rdz-alto': alto ? alto + 'px' : undefined } }, mapa, col),
      dlg ? h(AsignarLugar, { key: 'dlg', a: dlg, red, hoy, onClose: cerrar, onOk: (t) => { cerrar(); setAviso({ ok: true, t }); } }) : null);
  }

  function PorSucursal(p) {
    ponerCssZ();
    const red = p.red, hoy = p.hoy, puede = p.puede, esc = p.escena || '';
    const [st, setSt] = R().useState({ data: null, cargando: true, err: '' }), [dlg, setDlg] = R().useState(null), [aviso, setAviso] = R().useState(null);
    const seq = R().useRef(0), auto = R().useRef(esc === 'redsucursalasignar'), retRef = R().useRef(null);
    R().useEffect(() => { const k = ++seq.current; setSt((x) => Object.assign({}, x, { cargando: true }));
      S.lugar({ vista: 'sucursales' }).then((r) => { if (k !== seq.current) return; if (r && r.ok) setSt({ data: r, cargando: false, err: '' }); else setSt((x) => ({ data: x.data, cargando: false, err: (r && r.mensaje) || 'La base no devolvió las sucursales.' })); }); }, [p.n]);
    const d = st.data, todas = d ? arrL(d.todas) : [];
    const todasBase = () => { const o = { inmediata: [], red: [], alerta: '' }; todas.forEach((x) => { const c = catDe(x, red); if (c.inmediata) o.inmediata.push(nomDe(x)); if (c.red) o.red.push(nomDe(x)); }); return o; };
    const abrir = (o, e) => { retRef.current = e && e.currentTarget ? e.currentTarget : null; setAviso(null); setDlg(o); };
    const deFila = (f, extra) => Object.assign({ entrada: 'sucursal', sucursal: f.sucursal, ciudad: f.ciudad, ciudadNombre: f.ciudadNombre || f.ciudad, sucBase: { inmediata: f.inmediata, red: f.red, alerta: f.alerta } }, extra || {});
    R().useEffect(() => { if (!auto.current || !d) return; auto.current = false; const f = arrL(d.sucursales).find((x) => x.sucursal === 'Loja') || arrL(d.sucursales).find((x) => x.alerta === 'Sin inspectores'); if (f) setDlg(deFila(f, { elegidos: ['Cristian Vaca'] })); }, [d]);
    const intro = h('div', { key: 'intro', className: 'rdi-card', style: { padding: '16px 20px', marginBottom: 16 }, 'data-rds-intro': '' },
      h('p', { style: { margin: '0 0 6px', fontSize: 15, color: 'var(--text-strong)' } }, h('b', null, 'Por sucursal: '), 'atiende los casos que solicita la sucursal, estén donde estén.'),
      h('p', { style: { margin: 0, fontSize: 15, color: 'var(--text-strong)' } }, h('b', null, 'Por ciudad o zona: '), 'atiende según el lugar de la inspección que elige el cliente o el Coordinador.'));
    const tarjetaTodas = h('section', { key: 'todas', className: 'rdi-card rdz-sec', 'aria-labelledby': 'rds-h-todas', 'data-rds-todas': '', style: { marginBottom: 16 } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 } }, h('h3', { id: 'rds-h-todas', className: 'rdi-h3', style: { fontSize: 17 } }, 'Atienden todas las sucursales'),
        puede && d ? boton({ size: 'sm', id: 'rds-asignar-todas', onClick: (e) => abrir({ entrada: 'todas', todasBase: todasBase() }, e) }, 'Asignar') : null),
      personas(todas, red, 'Nadie tiene hoy cobertura «todas». Úsala solo para un equipo de respaldo nacional.', 'todas'));
    const enCiudad = (f) => { const tc = arrL(f.todaCiudad).map(nomDe), nz = Number(f.porZonas) || 0, nzon = Number(f.zonas) || 0, out = [];
      if (tc.length) out.push(tc.join(', ') + (nzon ? ' (toda la ciudad)' : ' (ciudad completa)')); if (nz) out.push(nz + ' por zonas');
      return out.length ? out.join(' · ') : nzon ? '— (' + nzon + (nzon === 1 ? ' zona publicada)' : ' zonas publicadas)') : 'Sin zonas: ciudad completa'; };
    const tabla = d ? h('div', { key: 'tb', className: 'rdi-card', style: { padding: '8px 16px 12px', overflowX: 'auto' } },
      h('table', { className: 'rdz-tb rdz-sutb', 'data-rds-tabla': '' }, h('caption', { className: 'rdi-sr' }, 'Quién atiende cada sucursal'),
        h('colgroup', null, ['10%', '16%', '21%', '8%', '6%', '19%', '20%'].map((w, k) => h('col', { key: k, style: { width: w } }))),
        h('thead', null, h('tr', null, ['Sucursal', 'Atienden por sucursal', 'Atienden en la ciudad (ciudad o zonas)', 'Inmediata', 'Red', 'Alerta', 'Acciones'].map((t) => h('th', { key: t, scope: 'col' }, t)))),
        h('tbody', null, arrL(d.sucursales).map((f) => h('tr', { key: f.sucursal, 'data-rds-fila': f.sucursal, 'data-rds-alerta': f.alerta || '' },
          h('th', { scope: 'row', style: { fontWeight: 700, color: 'var(--text-strong)', borderBottom: '1px solid var(--border-subtle)', padding: '10px 8px', verticalAlign: 'top' } }, f.sucursal),
          h('td', null, arrL(f.porSucursal).length ? arrL(f.porSucursal).map(nomDe).join(', ') : '—'), h('td', null, enCiudad(f)),
          h('td', { 'data-rds-inm': cnt(f.inmediata) }, String(cnt(f.inmediata))), h('td', { 'data-rds-red': cnt(f.red) }, String(cnt(f.red))),
          h('td', null, f.alerta ? pill(f.alerta, tonoAl(f.alertaTipo), 'al') : h('span', { style: { color: 'var(--text-muted)' } }, 'Sin alertas')),
          h('td', null, h('div', { className: 'rdz-acc' }, f.ciudad ? h('button', { type: 'button', className: 'rdi-link', style: { fontSize: 14 }, 'data-rds-mapa': f.sucursal, 'aria-label': 'Ver ' + (f.ciudadNombre || f.sucursal) + ' en el mapa', onClick: () => p.irMapa(f.ciudad) }, 'Ver en el mapa') : null,
            puede ? h('button', { type: 'button', className: 'rdi-link', style: { fontSize: 14 }, 'data-rds-asignar': f.sucursal, 'aria-label': 'Asignar inspectores a la sucursal ' + f.sucursal, onClick: (e) => abrir(deFila(f), e) }, 'Asignar') : null))))))
      , h('p', { className: 'rdz-nota', 'data-rds-nota': '', style: { margin: '12px 0 4px' } }, 'Sin inspectores: el portal del cliente dirá «te contactará un coordinador» y Coordinar visita no tendrá sugerencias para esa sucursal. Solo Coordinación: el portal no ofrece horarios, pero Coordinar visita sí sugiere.'))
      : h('div', { key: 'tb', className: 'rdi-card', role: 'status', 'data-rds-estado': st.cargando ? 'cargando' : 'vacio' }, st.cargando ? 'Cargando las sucursales…' : 'Sin datos de las sucursales. Vuelve a intentar más tarde.');
    const cerrar = () => { setDlg(null); const r0 = retRef.current; setTimeout(() => { if (r0 && r0.isConnected && r0.focus) r0.focus(); }, 60); };
    return h('div', { 'data-red-sucursal': '' }, st.err ? avisoEl({ ok: false, t: st.err }, 'e') : null, avisoEl(aviso, 'a'), intro, d ? tarjetaTodas : null, tabla,
      dlg ? h(AsignarLugar, { key: 'dlg', a: dlg, red, hoy, onClose: cerrar, onOk: (t) => { cerrar(); setAviso({ ok: true, t }); } }) : null);
  }

  // Diálogo único «Asignar inspectores» (zona, ciudad, sucursal o todas). a = { entrada, ciudad, ciudadNombre, sucursal, zona?, ciudadBase?, sucBase?, todasBase?, elegidos? }.
  function AsignarLugar(p) {
    const a = p.a, red = p.red, hoy = p.hoy, M = W.SiriusModal || NS().Modal, B = NS().Button;
    const [nivel, setNivel] = R().useState(a.entrada), [q, setQ] = R().useState(''), [tipo, setTipo] = R().useState(''), [rec, setRec] = R().useState('');
    const efRef = R().useRef(null); R().useEffect(() => { if (a.elegidos && efRef.current) { const t = setTimeout(() => { if (efRef.current) efRef.current.scrollIntoView({ block: 'end' }); }, 120); return () => clearTimeout(t); } return undefined; }, []); /* escenas con elegidos: el efecto a la vista */
    const [eleg, setEleg] = R().useState(arrL(a.elegidos)), [desde, setDesde] = R().useState(hoy), [hasta, setHasta] = R().useState(''), [mot, setMot] = R().useState(''), [err, setErr] = R().useState(''), [env, setEnv] = R().useState(false);
    const lugarAmb = nivel === 'zona' ? { ciudad: a.ciudad, zonaId: a.zona && a.zona.id, sucursal: a.sucursal } : nivel === 'ciudad' ? { ciudad: a.ciudad, sucursal: a.sucursal } : nivel === 'sucursal' ? { sucursal: a.sucursal } : {};
    const porTxt = (n) => (n === 'zona' ? 'esta zona' : n === 'ciudad' ? 'toda la ciudad' : n === 'sucursal' ? 'la sucursal ' + a.sucursal : 'todas las sucursales');
    const ya = (i) => { if (nivel === 'todas') return COB() && COB().vigentes(i.cobertura || [], hoy).some((f) => f.nivel === 'todas') ? porTxt('todas') : ''; const r = S.cubre(i, lugarAmb, hoy); return r && r.nivel && r.nivel !== 'parcial' ? porTxt(r.nivel) : ''; };
    const activos = arrL(red && red.inspectores).filter((i) => i && i.nombre && i.estado === 'Activo').slice().sort((x, y) => x.nombre.localeCompare(y.nombre, 'es'));
    const n0 = nrm(q), filas = activos.filter((i) => (!tipo || i.tipo === tipo) && (!rec || ((i.operacion || {}).recibeOfertas || 'no') === rec) && (!n0 || nrm([i.nombre, i.tipo, agNombre(i.agencia), S.corto(i, hoy)].join(' ')).indexOf(n0) >= 0));
    const okEleg = eleg.filter((n) => { const i = activos.find((x) => x.nombre === n); return i && !ya(i); });
    const baseAmb = nivel === 'zona' ? a.zona || {} : nivel === 'ciudad' ? a.ciudadBase || {} : nivel === 'sucursal' ? a.sucBase || {} : a.todasBase || {};
    const nuevos = (k) => okEleg.filter((n) => S.categoria(activos.find((x) => x.nombre === n))[k]);
    const antes = (k) => cnt(baseAmb[k]), despues = (k) => (Array.isArray(baseAmb[k]) ? new Set(baseAmb[k].map(nomDe).concat(nuevos(k))).size : cnt(baseAmb[k]) + nuevos(k).length);
    const ambTxt = nivel === 'zona' ? a.ciudadNombre + ' · Zona ' + (a.zona && a.zona.nombre) : nivel === 'ciudad' ? a.ciudadNombre + ' (toda la ciudad)' : nivel === 'sucursal' ? 'la sucursal ' + a.sucursal : 'todas las sucursales';
    const futuro = desde && desde > hoy;
    const efecto = [h('div', { key: 't', style: { fontWeight: 700 } }, 'Efecto en ' + ambTxt), h('div', { key: 'i', 'data-rdz-ef-inm': antes('inmediata') + '>' + despues('inmediata') }, 'Confirmación inmediata: ' + antes('inmediata') + ' → ' + despues('inmediata')),
      h('div', { key: 'r', 'data-rdz-ef-red': antes('red') + '>' + despues('red') }, 'Red: ' + antes('red') + ' → ' + despues('red')),
      okEleg.length && baseAmb.alerta === 'Sin inspectores' ? h('div', { key: 's', 'data-rdz-ef-deja': 'sin' }, 'Deja de estar «sin inspectores»') : okEleg.length && nivel === 'zona' && !arrL(baseAmb.propios).length ? h('div', { key: 'p', 'data-rdz-ef-deja': 'propios' }, 'Deja de estar «sin inspectores propios»') : null,
      futuro ? h('div', { key: 'f', 'data-rdz-ef-futuro': '', style: { color: '#7A4F0E' } }, 'Rige desde el ' + fDMy(desde) + ': hoy no cambia') : null];
    const titulo = a.entrada === 'zona' ? 'Asignar inspectores a una zona' : a.entrada === 'ciudad' ? 'Asignar inspectores a la ciudad' : a.entrada === 'sucursal' ? 'Asignar inspectores a la sucursal ' + a.sucursal : 'Asignar inspectores a todas las sucursales';
    const desc = a.entrada === 'zona' ? a.ciudadNombre + ' · Zona ' + (a.zona && a.zona.nombre) : a.entrada === 'ciudad' ? a.ciudadNombre + ' (toda la ciudad)' : a.entrada === 'sucursal' ? 'Atienden los casos que solicita la sucursal ' + a.sucursal + ', estén donde estén.' : 'Cualquier inspección, en cualquier ciudad. Úsala solo para un equipo de respaldo nacional.';
    const guardar = () => { if (env) return; if (!okEleg.length) { setErr('Elige al menos un inspector.'); return; }
      const datos = Object.assign({ nivel, inspectores: okEleg.slice(), motivo: mot }, nivel === 'zona' ? { ciudad: a.ciudad, zona: a.zona.id } : {}, nivel === 'ciudad' ? { ciudad: a.ciudad } : {}, nivel === 'sucursal' ? { sucursal: a.sucursal } : {}, desde ? { desde } : {}, hasta ? { hasta } : {});
      setEnv(true); setErr(''); S.accion('asignar', datos).then((r) => { setEnv(false); if (r && r.ok) p.onOk(r.mensaje || 'Asignación guardada.'); else { setErr((r && r.mensaje) || 'La base no guardó la asignación.'); if (r && r.validacion) setTimeout(() => { const x = document.getElementById('rdz-a-motivo'); if (x) x.focus(); }, 0); } }); };
    const sel = (id, lbl, v, set, ops) => h('div', { style: { minWidth: 0 } }, h('label', { className: 'rdi-lbl', htmlFor: id }, lbl), h('select', { id, className: 'rdi-in', value: v, onChange: (e) => set(e.target.value) }, ops.map(([x, t]) => h('option', { key: x, value: x }, t))));
    const cuerpo = [
      err ? h('p', { key: 'err', role: 'alert', 'data-red-error': '', style: { margin: '0 0 12px', padding: '10px 12px', borderRadius: 8, background: '#FDECEA', color: '#A1261B', fontSize: 14 } }, err) : null,
      a.entrada === 'zona' ? h('fieldset', { key: 'niv', className: 'rdz-niv', 'data-rdz-nivel': nivel }, h('legend', { className: 'rdi-lbl', style: { padding: 0 } }, 'Nivel de la asignación'),
        [['zona', 'Esta zona', 'Atiende las inspecciones de la Zona ' + (a.zona && a.zona.nombre) + ' y cuenta como inspector propio de la zona.'], ['ciudad', 'Toda la ciudad', 'Atiende cualquier lugar de ' + a.ciudadNombre + ', también con «zona por confirmar».']].map(([v, t, x]) =>
          h('label', { key: v, className: nivel === v ? 'on' : '' }, h('input', { type: 'radio', name: 'rdz-a-nivel', value: v, checked: nivel === v, onChange: () => { setNivel(v); setErr(''); } }), h('span', null, h('b', { style: { display: 'block', color: 'var(--text-strong)' } }, t), h('span', { style: { color: 'var(--text-muted)', fontSize: 13 } }, x))))) : null,
      h('div', { key: 'fil', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)', gap: '0 12px', marginBottom: 10 } },
        h('div', { style: { minWidth: 0 } }, h('label', { className: 'rdi-lbl', htmlFor: 'rdz-a-q' }, 'Buscar'), h('input', { id: 'rdz-a-q', className: 'rdi-in', type: 'search', value: q, placeholder: 'Nombre, agencia o cobertura', autoComplete: 'off', onChange: (e) => setQ(e.target.value) })),
        sel('rdz-a-tipo', 'Tipo', tipo, setTipo, [['', 'Todos'], ['Interno', 'Interno'], ['Agencia', 'Agencia'], ['Independiente', 'Independiente']]),
        sel('rdz-a-rec', 'Recibe ofertas', rec, setRec, [['', 'Todos'], ['red', 'De Coordinación y de la red'], ['coord', 'Solo de Coordinación'], ['no', 'No recibe ofertas']])),
      h('div', { key: 'tb', style: { border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 14, maxHeight: 'min(300px, 34vh)', minHeight: 150, overflowY: 'auto' } },
        h('table', { className: 'rdz-tb', 'data-rdz-tabla': '' }, h('caption', { className: 'rdi-sr' }, 'Inspectores activos para ' + ambTxt),
          h('colgroup', null, ['40px', '29%', '21%', '27%', '23%'].map((w, k) => h('col', { key: k, style: { width: w } }))),
          h('thead', { style: { position: 'sticky', top: 0, background: '#fff', zIndex: 1 } }, h('tr', null, h('th', { scope: 'col' }, h('span', { className: 'rdi-sr' }, 'Elegir')), ['Inspector', 'Modalidades', 'Cobertura actual', 'Aporta'].map((t) => h('th', { key: t, scope: 'col' }, t)))),
          h('tbody', null, filas.length ? filas.map((i) => { const y = ya(i), on = !y && eleg.indexOf(i.nombre) >= 0, c = S.categoria(i), id = 'rdz-a-c-' + i.nombre.replace(/\W+/g, '');
            return h('tr', { key: i.nombre, className: y ? 'ya' : '', 'data-rdz-fila': i.nombre, 'data-rdz-ya': y ? '1' : '0' },
              h('td', null, h('input', { type: 'checkbox', id, checked: on, disabled: !!y, 'aria-describedby': y ? id + '-ya' : undefined, onChange: () => { setErr(''); setEleg((L) => (L.indexOf(i.nombre) >= 0 ? L.filter((x) => x !== i.nombre) : L.concat([i.nombre]))); } })),
              h('td', null, h('label', { htmlFor: id, style: { display: 'block', fontWeight: 700, color: y ? 'var(--text-muted)' : 'var(--text-strong)', cursor: y ? 'default' : 'pointer' } }, i.nombre),
                h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, (i.tipo || '—') + (i.agencia ? ' · ' + agNombre(i.agencia) : '')),
                y ? h('span', { id: id + '-ya', 'data-rdz-ya-txt': '', style: { display: 'block', fontSize: 12.5, color: '#7A4F0E', marginTop: 2 } }, 'Ya la atiende por ' + y) : null),
              h('td', null, arrL((i.operacion || {}).modalidades).length ? (i.operacion || {}).modalidades.join(', ') : 'Todas'),
              h('td', null, S.corto(i, hoy)),
              h('td', null, h('span', { className: 'rdz-tags' }, etiquetas(c, i.nombre)))); })
            : h('tr', null, h('td', { colSpan: 5, style: { color: 'var(--text-muted)' } }, 'Ningún inspector activo coincide con la búsqueda o los filtros.'))))),
      h('div', { key: 'fe', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 16px' } },
        h('div', { style: { marginBottom: 12 } }, h('label', { className: 'rdi-lbl', htmlFor: 'rdz-a-desde' }, 'Vigente desde'), h('input', { id: 'rdz-a-desde', type: 'date', className: 'rdi-in', value: desde, onChange: (e) => setDesde(e.target.value) })),
        h('div', { style: { marginBottom: 12 } }, h('label', { className: 'rdi-lbl', htmlFor: 'rdz-a-hasta' }, 'Hasta (opcional)'), h('input', { id: 'rdz-a-hasta', type: 'date', className: 'rdi-in', value: hasta, onChange: (e) => setHasta(e.target.value) }))),
      h('div', { key: 'mo', style: { marginBottom: 12 } }, h('label', { className: 'rdi-lbl', htmlFor: 'rdz-a-motivo' }, 'Motivo (obligatorio)'), h('textarea', { id: 'rdz-a-motivo', className: 'rdi-in', value: mot, placeholder: 'Mínimo 10 caracteres: queda en el historial', onChange: (e) => { setMot(e.target.value); setErr(''); } })),
      h('div', { key: 'ef', ref: efRef, className: 'rdz-ef', role: 'status', 'aria-live': 'polite', 'data-rdz-efecto': '' }, efecto),
      h('p', { key: 'pie', className: 'rdz-nota' }, 'Queda en el historial de cada inspector. No cambia sus cuentas ni sus roles.')];
    const okTxt = okEleg.length ? 'Asignar ' + nInsp(okEleg.length) : 'Asignar inspectores';
    const pie = [B ? h(B, { key: 'c', variant: 'ghost', onClick: p.onClose }, 'Cancelar') : h('button', { key: 'c', type: 'button', onClick: p.onClose }, 'Cancelar'), B ? h(B, { key: 'o', variant: 'primary', loading: env, id: 'rdz-a-ok', onClick: guardar }, okTxt) : h('button', { key: 'o', type: 'button', id: 'rdz-a-ok', onClick: guardar }, okTxt)];
    return M ? h(M, { open: true, onClose: p.onClose, size: 'lg', align: 'left', title: titulo, description: desc, footer: pie }, h('div', { className: 'rdi', 'data-red-dialogo': 'asignar-' + a.entrada }, cuerpo)) : null;
  }
  W.SiriusRedInspectores = SiriusRedInspectores;
})();
