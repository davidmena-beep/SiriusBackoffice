// SIRIUS · Facturación del proveedor con la factura en preparación (v1.0 · provisional · etapa F-1 · DEC-279 · 23/11/2026)
// Recorrido: Por liquidar → Mesa: liquidación → Por facturar → Mesa: factura en preparación → Seguimiento.
// «Por facturar»: lista compacta (una línea por fila; los vehículos de un mismo caso en una fila), fichas de filtro, «⋯» con Cálculo y Ajustar, y el panel
// «Factura en preparación» plegable (contraído por defecto: riel de 64 px). «Agregar a la factura» vive en UN solo lugar: la barra inferior (panel contraído)
// o arriba en el panel (abierto). «Mesa de trabajo › Factura en preparación»: lo agregado con «Quitar», los tres pasos (arma, emite en el SRI, pega la
// clave) y «Confirmar factura». «Seguimiento»: liquidaciones y facturas enviadas, con fichas por estado.
// Toda acción es de la base (SiriusLiqProceso.facAgregar / facQuitar / facDescartar / facConfirmar → accion('factura…')); la pantalla no reserva ni calcula:
// lee facturas, honorarios y liquidaciones de la conexión y vuelve a cargar después de cada acción. Sin la conexión, las mismas reglas simuladas.
// Se usa desde Liquidaciones.dc.html: SiriusFacturacion.porFacturar(C, v), .mesa(C, v), .seguimiento(C, v) y .flujo(), con C = el componente.
(function () {
  'use strict';
  const W = window; if (W.SiriusFacturacion && W.SiriusFacturacion.version === '1.0') return;
  const h = (...a) => W.React.createElement(...a), sd = (x) => String(x == null ? '' : x).trim();
  const miles = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const n2 = (x) => { const n = Number(x); if (!isFinite(n)) return '—'; const a = Math.abs(n).toFixed(2).split('.'); return (n < 0 ? '−' : '') + miles(a[0]) + ',' + a[1]; };
  const usd = (x) => 'USD ' + n2(x);
  const fecha = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(sd(s)); return m ? m[3] + '/' + m[2] + '/' + m[1] : '—'; };
  const hora = (s) => { const m = /T(\d\d:\d\d)/.exec(sd(s)); return m ? m[1] : ''; };
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const lista = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]);
  const LPx = () => W.SiriusLiqProceso;
  // «Hoy» de la base (reloj de la conexión) o del prototipo.
  const hoy = () => { const c = W.SIRIUS_CONEXION, r = c && c.activo === true && c.reloj && c.reloj.ahora; return sd(r || LPx().ahoraIso()).slice(0, 10); };
  const dias = (f) => { const a = Date.parse(sd(f).slice(0, 10) + 'T12:00:00Z'), b = Date.parse(hoy() + 'T12:00:00Z'); return isFinite(a) && isFinite(b) ? Math.max(0, Math.round((b - a) / 864e5)) : null; };
  const mesDe = (f) => sd(f).slice(0, 7);
  const mesTxt = (ym, corto) => { const m = /^(\d{4})-(\d\d)/.exec(ym || ''); if (!m) return ''; const n = MESES[Number(m[2]) - 1]; return (corto ? n.slice(0, 3) + '.' : n.charAt(0).toUpperCase() + n.slice(1)) + ' ' + m[1]; };
  // ---------- Estilos (los de la maqueta aprobada) ----------
  const CSS = `.fc{font-family:var(--font-brand);color:#484848;display:flex;flex-direction:column;gap:16px;min-width:0}
.fc .fc-grid{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:22px;align-items:start}
.fc .fc-grid.contraido{grid-template-columns:minmax(0,1fr) 64px}
.fc .fc-lat{position:relative}.fc .fc-riel{display:none}
.fc .fc-grid.contraido .fc-lat .fc-cont{display:none}
.fc .fc-grid.contraido .fc-lat .fc-riel{display:flex;flex-direction:column;align-items:center;gap:14px;padding:12px 0 16px;min-height:320px}
.fc .fc-vert{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:800;color:#011E41;font-size:14px;letter-spacing:.02em}
.fc .fc-tot{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:800;color:#0033A1;font-size:14px}
.fc .fc-plegar{width:40px;height:40px;border:1px solid #DADADA;border-radius:8px;background:#FFFFFF;color:#011E41;font-size:16px;cursor:pointer;flex:none}
.fc .fc-cab{display:flex;justify-content:space-between;align-items:center;gap:10px}
.fc .fc-masn{font-size:11.5px;font-weight:800;color:#011E41;background:#00AEEF;border-radius:999px;padding:2px 7px}
@media (max-width:1100px){.fc .fc-grid,.fc .fc-grid.contraido{grid-template-columns:1fr}.fc .fc-grid.contraido .fc-lat .fc-riel{min-height:0;flex-direction:row;justify-content:space-between;padding:10px 14px}.fc .fc-vert,.fc .fc-tot{writing-mode:horizontal-tb;transform:none}}
.fc .fc-card{background:#FFFFFF;border:1px solid #E8E8E8;border-radius:16px;box-shadow:0 12px 20px rgba(1,30,65,.08);min-width:0}
.fc .fc-tool{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:14px 16px;border-bottom:1px solid #E8E8E8}
.fc .fc-tool input[type=search]{flex:1 1 220px;height:40px;border:1px solid #DADADA;border-radius:8px;padding:0 12px;font:14px var(--font-brand);background:#FFFFFF;color:#011E41;min-width:0}
.fc .fc-chip{height:34px;padding:0 12px;border:1px solid #DADADA;border-radius:999px;background:#FFFFFF;font:600 13px var(--font-brand);color:#484848;cursor:pointer;white-space:nowrap}
.fc .fc-chip[aria-pressed="true"]{background:#F1F5FF;border-color:#0033A1;color:#0033A1}
.fc .fc-mas{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;padding:10px 16px;border-bottom:1px solid #E8E8E8;background:#FAFBFC}
.fc .fc-mas label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:700;color:#011E41}
.fc .fc-mas select{height:38px;border:1px solid #B4B4B4;border-radius:8px;padding:0 8px;font:14px var(--font-brand);color:#011E41;background:#FFFFFF;min-width:140px}
.fc .fc-grp{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 16px;background:#E8F4F4;color:#3D6A6E;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.fc .fc-grp button{background:none;border:none;color:#008BBF;font:700 13px var(--font-brand);cursor:pointer;text-transform:none;letter-spacing:0;white-space:nowrap}
.fc .fc-row{display:grid;grid-template-columns:28px minmax(0,1.3fr) 108px minmax(0,1.3fr) 124px 84px 40px;gap:10px;align-items:center;padding:10px 16px;border-bottom:1px solid #E8E8E8;font-size:14px;position:relative}
.fc .fc-row.suc{grid-template-columns:28px minmax(0,1.2fr) 104px minmax(0,1.2fr) 96px 124px 84px 40px}
.fc .fc-row:hover{background:#F1F5FF}.fc .fc-row.sel{background:#F1F5FF}
.fc .fc-row.head{font-size:12px;font-weight:800;color:#011E41;background:#F1F5FF;padding-top:8px;padding-bottom:8px}
.fc .fc-row.head button{background:none;border:none;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left}
.fc .fc-row.mesa{grid-template-columns:minmax(0,1.3fr) 108px minmax(0,1.4fr) 124px 86px 64px}
.fc .fc-row .fc-tag{white-space:normal;line-height:1.35}
.fc .fc-row input[type=checkbox]{width:18px;height:18px;accent-color:#0033A1;cursor:pointer;margin:0}
.fc .fc-fecha{font-size:13.5px;color:#011E41}.fc .fc-fecha small{display:block;font-size:11.5px;color:#5C6470}
.fc .fc-ref{font-weight:800;color:#011E41}.fc .fc-det{color:#5C6470;font-size:13px}.fc .fc-amt{text-align:right;font-weight:800;color:#011E41}
.fc .fc-more{width:36px;height:36px;border:none;background:none;border-radius:8px;color:#5C6470;font-size:18px;cursor:pointer}
.fc .fc-more:hover,.fc .fc-more[aria-expanded="true"]{background:#E8E8E8;color:#011E41}
.fc .fc-menu{position:absolute;right:16px;top:44px;z-index:30;min-width:200px;background:#FFFFFF;border:1px solid #DADADA;border-radius:8px;box-shadow:0 12px 24px rgba(1,30,65,.16);padding:6px;display:flex;flex-direction:column}
.fc .fc-menu button{height:38px;text-align:left;padding:0 12px;border:none;background:none;border-radius:6px;font:600 14px var(--font-brand);color:#011E41;cursor:pointer}.fc .fc-menu button:hover{background:#F1F5FF}
.fc .fc-menu .fc-mt{font-size:11.5px;font-weight:800;color:#5C6470;padding:6px 12px 2px;text-transform:uppercase;letter-spacing:.04em}
.fc .fc-tag{display:inline-block;padding:1px 8px;border-radius:999px;font-size:11.5px;font-weight:800;white-space:nowrap}
.fc .t-ok{background:#DCEFC6;color:#2F5A10}.fc .t-w{background:#FBEFCB;color:#6B5103}.fc .t-b{background:#F1F5FF;color:#0033A1}.fc .t-r{background:#FBE3E0;color:#7A1409}.fc .t-n{background:#F4F4F4;color:#484848}
.fc .fc-bar{position:sticky;bottom:0;z-index:5;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;background:#011E41;color:#FFFFFF;border-radius:0 0 16px 16px}
.fc .fc-bar b{font-size:16px}
.fc .fc-btn{height:44px;padding:0 18px;border-radius:8px;font:800 14px var(--font-brand);cursor:pointer;white-space:nowrap}
.fc .fc-btn.p{background:#00AEEF;color:#011E41;border:none;box-shadow:0 4px 8px rgba(0,174,239,.24)}.fc .fc-btn.p:disabled{background:#DADADA;color:#5C6470;box-shadow:none;cursor:not-allowed}
.fc .fc-btn.s{background:#FFFFFF;color:#008BBF;border:1px solid #00AEEF}
.fc .fc-btn.g{background:transparent;color:#FFFFFF;border:1px solid rgba(255,255,255,.5)}
.fc .fc-btn.r{background:#FFFFFF;color:#9E1B0E;border:1px solid #9E1B0E}
.fc .fc-btn:focus-visible,.fc .fc-chip:focus-visible,.fc .fc-more:focus-visible,.fc .fc-plegar:focus-visible{outline:3px solid #0033A1;outline-offset:2px}
.fc .fc-pan{padding:18px 20px;display:flex;flex-direction:column;gap:12px}
.fc .fc-pan h2{margin:0;font-size:18px;color:#011E41}
.fc .fc-kv{display:flex;justify-content:space-between;gap:10px;font-size:14px}
.fc .fc-kv.t{border-top:2px solid #011E41;padding-top:10px;font-size:17px;font-weight:800;color:#011E41}
.fc .fc-it{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #E8E8E8;font-size:13.5px}.fc .fc-it span:first-child{color:#011E41}
.fc .fc-x{background:none;border:none;color:#5C6470;cursor:pointer;font:600 14px var(--font-brand);text-decoration:underline}
.fc .fc-note{padding:12px 14px;border-radius:8px;background:#E8F4F4;color:#011E41;font-size:13.5px;line-height:1.55}
.fc .fc-step{display:flex;gap:12px;align-items:flex-start}
.fc .fc-num{flex:none;width:30px;height:30px;border-radius:999px;background:#011E41;color:#FFFFFF;display:grid;place-items:center;font-weight:800;font-size:14px}
.fc .fc-step.done .fc-num{background:#2F5A10}
.fc .fc-copy{display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:center;padding:12px 14px;border:1px dashed #DADADA;border-radius:8px;font-size:14px}
.fc .fc-copy code{font:700 14px ui-monospace,Menlo,monospace;color:#011E41;text-align:right}
.fc .fc-clave{width:100%;height:48px;border:2px solid #00AEEF;border-radius:8px;padding:0 12px;font:700 15px ui-monospace,Menlo,monospace;color:#011E41;background:#FFFFFF;letter-spacing:.04em;box-sizing:border-box}
.fc .fc-clave.err{border-color:#9E1B0E}
.fc .fc-chk{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:8px;align-items:center;padding:9px 0;border-bottom:1px solid #E8E8E8;font-size:14px}
.fc .fc-chk .ok{color:#2F5A10;font-weight:800}.fc .fc-chk .no{color:#9E1B0E;font-weight:800}.fc .fc-chk .pe{color:#5C6470;font-weight:800}
.fc .fc-legend{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px;color:#5C6470}
.fc .fc-al{padding:12px 14px;border-radius:8px;font-size:14px;line-height:1.5}
.fc .fc-al.err{background:#FBE3E0;color:#7A1409;border:1px solid #E7B4AD}.fc .fc-al.warn{background:#FBEFCB;color:#4A3802}
.fc table.fc-seg{width:100%;border-collapse:collapse;min-width:760px}
.fc table.fc-seg th,.fc table.fc-seg td{text-align:left;padding:12px 14px;border-bottom:1px solid #E8E8E8;font-size:14px;vertical-align:top}
.fc table.fc-seg th{font-size:12.5px;color:#011E41;background:#F1F5FF}
.fc .fc-lk{background:none;border:none;padding:0;font:inherit;color:#008BBF;text-decoration:underline;cursor:pointer}
.fc-flow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px;margin:0}
.fc-flow span{padding:4px 10px;border-radius:999px;background:#F1F5FF;color:#0033A1;font-weight:700;font-family:var(--font-brand)}
.fc-flow i{font-style:normal;color:#5C6470}
.fc-cuenta{display:inline-block;min-width:22px;padding:0 6px;margin-left:6px;border-radius:999px;background:#F1F5FF;color:#0033A1;font-size:12px;font-weight:800;text-align:center;line-height:20px}
.fc-cuenta.hot{background:#00AEEF;color:#011E41}`;
  const estilos = () => { if (document.getElementById('fc-css')) return; const s = document.createElement('style'); s.id = 'fc-css'; s.textContent = CSS; document.head.appendChild(s); };
  // ---------- Estado (en C.lp().fx; el plegado del panel, compartido por Por facturar y la Mesa, en C.lp().facAbierto) ----------
  const fx = (C) => C.lp().fx || {};
  const setFx = (C, p) => C.setState((st) => { const lp = Object.assign({}, st.lp || {}); lp.fx = Object.assign({}, lp.fx || {}, p); return { lp }; });
  const abierto = (C) => !!C.lp().facAbierto;
  const plegar = (C) => C.lpSet({ facAbierto: !abierto(C) });
  // ---------- Lo que está en Por facturar (sin lo reservado): filas ----------
  const tipoHon = (LP, x) => (LP.completado(x) ? 'comp' : 'pre');
  const claseTxt = (LP, x) => { const c = (x.calculo || {}).clase; return c ? String(LP.claseNombre(c)).toLowerCase() : ''; };
  const detHon = (LP, x) => (LP.completado(x) ? 'Completado de informe · ' + sd(x.modalidad).toLowerCase() : x.grupo === 'Vehículos' ? [claseTxt(LP, x), sd(x.modalidad).toLowerCase()].filter(Boolean).join(' · ').replace(/^./, (c) => c.toUpperCase()) : (x.bien || x.ramo) + ' · ' + sd(x.modalidad).toLowerCase());
  const refHon = (x) => x.placa || x.riesgo || x.bien || x.id;
  const liqInsp = (LP, l) => { const xs = LP.lineas(l); return xs.length + (xs.length === 1 ? ' inspección: ' : ' inspecciones: ') + xs.map((x) => x.caso + ' (' + (x.placa || x.grupo || x.ramo) + ')').join(', '); };
  const fechaLiq = (C, l) => (l.aprobada && l.aprobada.fecha) || C.lpAprobFecha(l);
  function filas(C, LP, p) { const out = [];
    LP.liqsPorFacturar(p).forEach((l) => { const xs = LP.lineas(l); out.push({ key: l.id, tipo: 'liq', ls: [l.id], hs: [], ref: 'Liquidación ' + LP.numCorto(l), sub2: 'v' + (l.version || 1), fecha: fechaLiq(C, l), det: liqInsp(LP, l), subtotal: l.subtotal, xs, l, busca: [LP.numCorto(l), l.id, String(l.numero || '')].concat(xs.reduce((a, x) => a.concat([x.caso, x.placa, x.bien, x.asegurado]), [])) }); });
    const hs = LP.preacordadosPorFacturar(p), porCaso = {};
    hs.forEach((x) => { const k = tipoHon(LP, x) + '|' + x.caso + '|' + x.grupo + '|' + x.modalidad; (porCaso[k] = porCaso[k] || []).push(x); });
    Object.keys(porCaso).forEach((k) => { const g = porCaso[k], x = g[0], t = tipoHon(LP, x), suf = (y) => (String(y.riesgo || '').split('-').pop() || '');
      if (g.length === 1) out.push({ key: x.id, tipo: t, ls: [], hs: [x.id], ref: refHon(x), sub2: 'caso ' + x.caso, fecha: x.fecha, det: detHon(LP, x), subtotal: x.subtotal, xs: [x], busca: [x.caso, x.placa, x.riesgo, x.bien, x.asegurado, x.orden] });
      else out.push({ key: 'caso-' + k, tipo: t, ls: [], hs: g.map((y) => y.id), ref: 'Caso ' + x.caso, sub2: g.length + ' vehículos', fecha: g.map((y) => y.fecha).sort()[0], det: g.map((y) => suf(y) + ' ' + (t === 'comp' ? (y.placa || '') : claseTxt(LP, y)) + ' ' + n2(y.subtotal)).join(' · '), subtotal: LP.r2(g.reduce((a, y) => a + (y.subtotal || 0), 0)), xs: g, busca: g.reduce((a, y) => a.concat([y.caso, y.placa, y.riesgo, y.bien, y.asegurado, y.orden]), []) }); });
    out.forEach((r) => { r.dias = dias(r.fecha); r.n = r.ls.length + r.hs.length; r.sucursales = Array.from(new Set(r.xs.map((x) => x.sucursal).filter(Boolean))); r.grupo = r.tipo === 'liq' ? 'liq' : r.tipo === 'comp' ? 'comp' : 'pre|' + r.xs[0].grupo + '|' + r.xs[0].modalidad; });
    return out; }
  const grupoTxt = (k) => { if (k === 'liq') return 'Liquidaciones aprobadas'; if (k === 'comp') return 'Completados de informe'; const [, g, m] = k.split('|'); return 'Preacordados · ' + (g === 'Vehículos' ? 'inspección vehicular' : sd(g).toLowerCase()) + ' ' + sd(m).toLowerCase(); };
  const tag = (t) => (t === 'liq' ? h('span', { className: 'fc-tag t-b' }, 'Liquidación') : t === 'comp' ? h('span', { className: 'fc-tag t-ok' }, 'Completado de informe') : h('span', { className: 'fc-tag t-ok' }, 'Preacordado'));
  // Resumen de la factura en preparación (para el panel y la descripción sugerida).
  function contenido(LP, f) { const ls = f.liquidaciones.map(LP.liq).filter(Boolean), hs = f.honorarios.map(LP.hon).filter(Boolean), comp = hs.filter((x) => LP.completado(x)), pre = hs.filter((x) => !LP.completado(x));
    const casos = (a) => { const o = {}; a.forEach((x) => { o[x.caso] = (o[x.caso] || 0) + 1; }); return Object.keys(o).map((k) => k + (o[k] > 1 ? ' ×' + o[k] : '')).join(', '); };
    return { ls, hs, comp, pre, casos }; }
  // ---------- Panel «Factura en preparación» (riel contraído o abierto) ----------
  function panelFactura(C, LP, v, f, sel) { const ab = abierto(C), sub = f ? f.subtotal : 0, n = f ? f.liquidaciones.length + f.honorarios.length : 0, iva = LP.ivaDe(sub, hoy()), quedaria = LP.r2(sub + sel.subtotal);
    const riel = h('div', { className: 'fc-riel' }, h('button', { type: 'button', className: 'fc-plegar', 'aria-expanded': 'false', 'aria-label': 'Abrir la factura en preparación', 'data-fc-plegar': 'abrir', onClick: () => plegar(C) }, '‹'), h('span', { className: 'fc-vert' }, 'Factura en preparación'), h('span', { className: 'fc-tot', 'data-fc-riel-total': sub }, usd(sub)), h('span', { className: 'fc-tag t-b', 'data-fc-riel-n': n, title: n + (n === 1 ? ' elemento' : ' elementos') }, String(n)), sel.n ? h('span', { className: 'fc-masn', title: sel.n + ' seleccionados sin agregar', 'data-fc-riel-sel': sel.n }, '+' + sel.n) : null);
    let cuerpo; if (!f) cuerpo = [h('p', { key: 'v', className: 'fc-legend', style: { margin: 0 } }, 'Aún no tienes una factura en preparación. Marca lo que vas a cobrar y pulsa «Agregar a la factura»: se abre una y sigue abierta hasta que la confirmes con la clave del SRI.')];
    else { const c = contenido(LP, f); cuerpo = [h('div', { key: 'lg', className: 'fc-legend' }, 'Abierta desde el ' + fecha(f.creada) + ' · sigue abierta hasta que la confirmes con la clave del SRI'),
      f.devuelta ? h('div', { key: 'dv', className: 'fc-al warn' }, h('strong', null, 'Devuelta por ' + (f.devuelta.por || 'Finanzas') + ': '), '«' + f.devuelta.motivo + '»') : null,
      c.ls.map((l) => h('div', { key: l.id, className: 'fc-it' }, h('span', null, 'Liquidación ' + LP.numTxt(l) + ' · ' + l.lineas.length + (l.lineas.length === 1 ? ' inspección' : ' inspecciones')), h('span', null, n2(l.subtotal)))),
      c.comp.length ? h('div', { key: 'cp', className: 'fc-it' }, h('span', null, c.comp.length + (c.comp.length === 1 ? ' completado de informe (' : ' completados de informe (') + c.casos(c.comp) + ')'), h('span', null, n2(c.comp.reduce((a, x) => a + x.subtotal, 0)))) : null,
      c.pre.length ? h('div', { key: 'pr', className: 'fc-it' }, h('span', null, c.pre.length + (c.pre.length === 1 ? ' preacordado (' : ' preacordados (') + c.casos(c.pre) + ')'), h('span', null, n2(c.pre.reduce((a, x) => a + x.subtotal, 0)))) : null,
      !n ? h('p', { key: 'va', className: 'fc-legend', style: { margin: 0 } }, 'Está vacía: agrega desde la lista.') : null,
      h('div', { key: 'st', className: 'fc-kv' }, h('span', null, 'Subtotal'), h('b', { style: { color: '#011E41' }, 'data-fc-subtotal': sub }, n2(sub))), h('div', { key: 'iv', className: 'fc-kv' }, h('span', null, 'IVA ' + iva.tasa + ' % (informativo)'), h('span', null, n2(iva.iva))), h('div', { key: 'tt', className: 'fc-kv t' }, h('span', null, 'Total'), h('span', { 'data-fc-total': iva.total }, usd(iva.total))),
      h('button', { key: 'vm', type: 'button', className: 'fc-btn s', 'data-fc-ver-mesa': '1', onClick: () => C.setState({ tab: 'Mesa de trabajo', lp: Object.assign({}, C.lp(), { mesaVista: 'factura', calc: [] }) }) }, 'Ver la factura en la mesa'),
      h('p', { key: 'nt', className: 'fc-legend', style: { margin: 0 } }, 'Puedes seguir agregando liquidaciones aprobadas y preacordados; lo que está en la factura ya no aparece en esta lista.')]; }
    const selpan = sel.n ? h('div', { key: 'sp', 'data-fc-agregar-lugar': 'panel', style: { padding: '12px 14px', borderRadius: 8, background: '#011E41', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10 } }, h('span', null, h('b', null, sel.n + (sel.n === 1 ? ' seleccionado · ' : ' seleccionados · ') + usd(sel.subtotal)), h('br'), h('span', { style: { fontSize: 13, opacity: 0.85 } }, 'la factura quedaría en ' + usd(quedaria))),
      h('span', { style: { display: 'flex', gap: 8 } }, h('button', { type: 'button', className: 'fc-btn p', style: { flex: 1 }, 'data-fc-agregar': '1', disabled: !!fx(C).busy, onClick: () => agregar(C, LP, v, sel) }, fx(C).busy ? 'Agregando…' : 'Agregar a la factura'), h('button', { type: 'button', className: 'fc-btn g', onClick: () => setFx(C, { sl: [], sh: [] }) }, 'Limpiar'))) : null;
    return h('aside', { key: 'lat', className: 'fc-card fc-lat', 'aria-label': 'Factura en preparación', 'data-fc-panel': ab ? 'abierto' : 'contraido' }, riel,
      h('div', { className: 'fc-cont fc-pan' }, h('div', { className: 'fc-cab' }, h('h2', null, 'Factura en preparación'), h('button', { type: 'button', className: 'fc-plegar', 'aria-expanded': 'true', 'aria-label': 'Contraer el panel', 'data-fc-plegar': 'contraer', onClick: () => plegar(C) }, '›')), ab ? selpan : null, cuerpo)); }
  function agregar(C, LP, v, sel) { setFx(C, { busy: true }); C.lpSet({ err: '' });
    return LP.facAgregar(sel.ls, sel.hs, v.yo, v.proveedor).then((r) => { setFx(C, { busy: false }); if (r && r.ok) { setFx(C, { sl: [], sh: [], menu: null }); C.toast(r.mensaje + ' · subtotal ' + usd(r.subtotal)); } else C.lpSet({ err: (r && r.mensaje) || 'La base no agregó.' }); return r; }); }
  // ---------- Por facturar ----------
  function porFacturar(C, v) { estilos(); const LP = LPx(), p = v.proveedor, st = fx(C), q = sd(st.q).toLowerCase(), ff = st.ff || {}, chip = st.chip || 'todo', mesHoy = mesDe(hoy()), f = LP.facturaPrep(p);
    const todas = filas(C, LP, p), sucs = Array.from(new Set(todas.reduce((a, r) => a.concat(r.sucursales), []))), conSuc = sucs.length > 1, n30 = todas.filter((r) => r.dias > 30).reduce((a, r) => a + r.n, 0);
    const cuenta = (t) => todas.filter((r) => (t === 'liq' ? r.tipo === 'liq' : r.tipo !== 'liq')).reduce((a, r) => a + r.n, 0);
    const vis = todas.filter((r) => (chip === 'todo' || (chip === 'liq' ? r.tipo === 'liq' : r.tipo !== 'liq')) && (!st.mes || mesDe(r.fecha) === mesHoy) && (!st.viejos || r.dias > 30)
      && (!ff.ramo || r.xs.some((x) => x.ramo === ff.ramo)) && (!ff.modalidad || r.xs.some((x) => x.modalidad === ff.modalidad)) && (!ff.sucursal || r.xs.some((x) => x.sucursal === ff.sucursal)) && (!ff.linea || r.xs.some((x) => x.linea === ff.linea))
      && (!q || r.busca.concat([r.ref]).some((z) => String(z || '').toLowerCase().indexOf(q) >= 0)));
    const desc = st.orden === 'desc'; vis.sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0) * (desc ? -1 : 1));
    const sl = (st.sl || []).filter((id) => todas.some((r) => r.ls.indexOf(id) >= 0)), sh = (st.sh || []).filter((id) => todas.some((r) => r.hs.indexOf(id) >= 0));
    const marcada = (r) => r.ls.every((id) => sl.indexOf(id) >= 0) && r.hs.every((id) => sh.indexOf(id) >= 0);
    const poner = (rs, on) => { let a = sl.slice(), b = sh.slice(); rs.forEach((r) => { if (on) { r.ls.forEach((id) => { if (a.indexOf(id) < 0) a.push(id); }); r.hs.forEach((id) => { if (b.indexOf(id) < 0) b.push(id); }); } else { a = a.filter((id) => r.ls.indexOf(id) < 0); b = b.filter((id) => r.hs.indexOf(id) < 0); } }); setFx(C, { sl: a, sh: b }); };
    const selR = todas.filter((r) => marcada(r)), sel = { ls: sl, hs: sh, n: sl.length + sh.length, subtotal: LP.r2(sl.reduce((a, id) => a + ((LP.liq(id) || {}).subtotal || 0), 0) + sh.reduce((a, id) => a + ((LP.hon(id) || {}).subtotal || 0), 0)) };
    const ab = abierto(C), sufTipo = conSuc ? ' suc' : '';
    const chipB = (k, t, on, fn, extra) => h('button', Object.assign({ key: k, type: 'button', className: 'fc-chip', 'aria-pressed': on ? 'true' : 'false', 'data-fc-chip': k, onClick: fn }, extra || {}), t);
    const tool = h('div', { key: 'tool', className: 'fc-tool', role: 'search', 'aria-label': 'Filtrar lo que está por facturar' }, h('input', { type: 'search', 'aria-label': 'Buscar', placeholder: 'Caso, placa, liquidación o asegurado', value: st.q || '', onChange: (e) => setFx(C, { q: e.target.value }) }),
      chipB('todo', 'Todo (' + (cuenta('liq') + cuenta('pre')) + ')', chip === 'todo', () => setFx(C, { chip: 'todo' })), chipB('liq', 'Liquidaciones (' + cuenta('liq') + ')', chip === 'liq', () => setFx(C, { chip: chip === 'liq' ? 'todo' : 'liq' })), chipB('pre', 'Preacordados (' + cuenta('pre') + ')', chip === 'pre', () => setFx(C, { chip: chip === 'pre' ? 'todo' : 'pre' })),
      chipB('mes', mesTxt(mesHoy), !!st.mes, () => setFx(C, { mes: !st.mes })), chipB('viejos', 'Más de 30 días (' + n30 + ')', !!st.viejos, () => setFx(C, { viejos: !st.viejos })), chipB('mas', 'Más filtros', !!st.mas, () => setFx(C, { mas: !st.mas }), { 'aria-expanded': st.mas ? 'true' : 'false' }));
    const xsAll = todas.reduce((a, r) => a.concat(r.xs), []), sel1 = (k, lbl, vals) => h('label', { key: k }, lbl, h('select', { value: ff[k] || '', onChange: (e) => setFx(C, { ff: Object.assign({}, ff, { [k]: e.target.value }) }) }, [h('option', { key: '', value: '' }, 'Todos')].concat(Array.from(new Set(vals.filter(Boolean))).sort().map((z) => h('option', { key: z, value: z }, z)))));
    const mas = st.mas ? h('div', { key: 'mas', className: 'fc-mas', 'data-fc-mas': '1' }, sel1('ramo', 'Ramo', xsAll.map((x) => x.ramo)), sel1('modalidad', 'Modalidad', xsAll.map((x) => x.modalidad)), sel1('sucursal', 'Sucursal', xsAll.map((x) => x.sucursal)), sel1('linea', 'Línea de negocio', xsAll.map((x) => x.linea)),
      Object.keys(ff).some((k) => ff[k]) ? h('button', { type: 'button', className: 'fc-x', onClick: () => setFx(C, { ff: {} }) }, 'Limpiar filtros') : null) : null;
    const head = h('div', { key: 'head', className: 'fc-row head' + sufTipo, 'aria-hidden': 'true' }, h('span'), h('span', null, 'Referencia'), h('span', null, h('button', { type: 'button', tabIndex: -1, onClick: () => setFx(C, { orden: desc ? 'asc' : 'desc' }) }, 'Fecha ' + (desc ? '↓' : '↑'))), h('span', null, 'Detalle'), conSuc ? h('span', null, 'Sucursal') : null, h('span', null, 'Tipo'), h('span', { style: { textAlign: 'right' } }, 'Subtotal'), h('span'));
    const menuDe = (r) => { const it = []; if (r.tipo === 'liq') { it.push(['Documento', () => C.lpSet({ doc: { tipo: 'liquidacion', id: r.l.id } })]); if (LP.pdfDisponible(r.l)) it.push(['Descargar PDF', () => C.lpDescargarPdf(r.l.id)]); }
      else r.xs.forEach((x) => { const s = r.xs.length > 1 ? ' · ' + refHon(x) : ''; it.push(['Cálculo' + s, () => C.lpVerCalc(x.id)]); if (!LP.completado(x)) it.push(['Ajustar' + s, () => C.lpSet({ aj: { id: x.id, km: '', comentario: '', tried: false } })]); }); return it; };
    const fila = (r) => { const on = marcada(r), m = st.menu === r.key, lbl = r.ref + (r.sub2 ? ' · ' + r.sub2 : '');
      return h('div', { key: r.key, className: 'fc-row' + sufTipo + (on ? ' sel' : ''), 'data-fc-fila': r.key, 'data-fc-tipo': r.tipo }, h('input', { type: 'checkbox', checked: on, 'aria-label': 'Seleccionar ' + lbl, onChange: () => poner([r], !on) }),
        h('span', null, h('span', { className: 'fc-ref' }, r.ref), r.sub2 ? ' · ' + r.sub2 : ''), h('span', { className: 'fc-fecha' }, fecha(r.fecha), h('small', null, r.dias == null ? '' : r.dias > 30 ? h('span', { className: 'fc-tag t-w' }, r.dias + ' días') : r.dias === 1 ? '1 día' : r.dias + ' días')),
        h('span', { className: 'fc-det' }, r.det), conSuc ? h('span', { className: 'fc-det' }, r.sucursales.join(', ')) : null, h('span', null, tag(r.tipo)), h('span', { className: 'fc-amt' }, n2(r.subtotal)),
        h('button', { type: 'button', className: 'fc-more', 'aria-label': 'Acciones de ' + lbl, 'aria-haspopup': 'menu', 'aria-expanded': m ? 'true' : 'false', 'data-fc-menu-btn': r.key, onClick: () => setFx(C, { menu: m ? null : r.key }) }, '⋯'),
        m ? h('div', { className: 'fc-menu', role: 'menu', 'data-fc-menu': r.key, onKeyDown: (e) => { if (e.key === 'Escape') setFx(C, { menu: null }); } }, menuDe(r).map(([t, fn]) => h('button', { key: t, type: 'button', role: 'menuitem', onClick: () => { setFx(C, { menu: null }); fn(); } }, t))) : null); };
    const grupos = []; ['liq', 'pre', 'comp'].forEach((t) => { const ks = Array.from(new Set(vis.filter((r) => (t === 'pre' ? r.tipo === 'pre' : r.tipo === t)).map((r) => r.grupo))); ks.forEach((k) => grupos.push(k)); });
    const cuerpo = grupos.length ? grupos.map((k) => { const rs = vis.filter((r) => r.grupo === k), n = rs.reduce((a, r) => a + r.n, 0), tot = LP.r2(rs.reduce((a, r) => a + r.subtotal, 0)), todos = rs.every(marcada);
      return [h('div', { key: 'g-' + k, className: 'fc-grp', 'data-fc-grupo': k }, h('span', null, grupoTxt(k) + ' (' + n + ')'), h('button', { type: 'button', onClick: () => poner(rs, !todos) }, todos ? 'Quitar la selección' : 'Seleccionar ' + (n === 1 ? 'el 1' : 'los ' + n) + ' · ' + usd(tot))), head].concat(rs.map(fila)); })
      : [h('p', { key: 'nada', className: 'fc-legend', style: { margin: 0, padding: '16px' } }, todas.length ? 'Nada con estos filtros.' : f ? 'Todo lo que tenías por facturar está en tu factura en preparación.' : 'Nada por facturar todavía: aquí llegan las liquidaciones aprobadas y los honorarios preacordados.')];
    const barra = sel.n && !ab ? h('div', { key: 'bar', className: 'fc-bar', 'data-fc-agregar-lugar': 'barra', role: 'region', 'aria-label': 'Selección para la factura' }, h('span', null, h('b', null, sel.n + (sel.n === 1 ? ' seleccionado · ' : ' seleccionados · ') + usd(sel.subtotal)), ' \u00a0·\u00a0 la factura en preparación quedaría en ' + usd(LP.r2((f ? f.subtotal : 0) + sel.subtotal))),
      h('span', { style: { display: 'flex', gap: 8 } }, h('button', { type: 'button', className: 'fc-btn g', onClick: () => setFx(C, { sl: [], sh: [] }) }, 'Limpiar'), h('button', { type: 'button', className: 'fc-btn p', 'data-fc-agregar': '1', disabled: !!st.busy, onClick: () => agregar(C, LP, v, sel) }, st.busy ? 'Agregando…' : 'Agregar a la factura'))) : null;
    const lista0 = h('div', { key: 'lst', className: 'fc-card', 'data-fc-porfacturar': '1', onKeyDown: (e) => { if (e.key === 'Escape' && st.menu) setFx(C, { menu: null }); } }, tool, mas, cuerpo, barra);
    void selR; return [C.lpAjustePre(v), h('div', { key: 'fc', className: 'fc' }, h('div', { className: 'fc-grid' + (ab ? '' : ' contraido') }, lista0, panelFactura(C, LP, v, f, sel)))]; }
  // ---------- Mesa de trabajo › Factura en preparación ----------
  function descripcion(LP, f) { const c = contenido(LP, f), lq = c.ls.length ? (c.ls.length === 1 ? 'Liq. ' : 'Liqs. ') + lista(c.ls.map((l) => LP.numCorto(l))) : '', n = c.hs.length, pr = n ? n + (c.pre.length ? (n === 1 ? ' preacordado' : ' preacordados') : (n === 1 ? ' completado' : ' completados')) : '';
    return 'Honorarios de inspección · ' + [lq, pr].filter(Boolean).join(' y ') + ' · ' + mesTxt(mesDe(hoy()), true); }
  function checksClave(C, LP, v, f, clave) { const SRI = W.SIRIUS_SRI, out = []; if (!clave) return { lista: out, ok: false };
    if (clave.length < 49) return { lista: [['pe', clave.length + ' de 49 dígitos']], ok: false }; const e = SRI ? SRI.validarClave(clave) : ''; if (e) return { lista: [['no', e]], ok: false };
    const d = SRI.desarmar(clave), rp = LP.rucProveedor(v.proveedor), a = LP.agencia(d.ruc), nom = a ? (a.razonSocial || a.nombre) : d.ruc === rp ? LP.provNombre(v.proveedor) : 'otro emisor', s = fx(C).sri;
    out.push([d.ruc === rp ? 'ok' : 'no', 'Emisor RUC ' + d.ruc + ': ' + nom + (d.ruc === rp ? '' : ' (no es ' + LP.provNombre(v.proveedor) + ')')]);
    out.push(['ok', 'Factura ' + d.numero + ' · emitida el ' + fecha(d.fecha)]);
    /* Con la conexión no se consulta sirius-sri.js: en esta prueba la base simula la autorización y Finanzas la comprueba al validar (F-1b). */
    if (LP.cx()) out.push(['in', 'La autorización y el subtotal en el SRI los comprueba Finanzas al validar (consulta simulada en esta prueba)']);
    else if (!s || s.clave !== clave) out.push(['pe', 'Consultando la autorización en el SRI…']); else if (!s.ok) out.push(['no', s.mensaje || 'El SRI no tiene una factura autorizada con esa clave']);
    else { const igual = Math.abs(Number(s.subtotal) - f.subtotal) <= 0.005; out.push([s.estado === 'AUTORIZADO' && igual ? 'ok' : 'no', s.estado !== 'AUTORIZADO' ? 'En el SRI: ' + s.estado : igual ? 'Autorizada en el SRI · subtotal ' + usd(s.subtotal) + ' = el de esta factura' : 'Autorizada en el SRI · subtotal ' + usd(s.subtotal) + ' ≠ ' + usd(f.subtotal) + ' de esta factura']); }
    const antes = LP.facturas().some((x) => (x.clave === clave && x.estado !== 'Descartada') || (x.devuelta && x.devuelta.clave === clave)); out.push([antes ? 'no' : 'ok', antes ? 'Ya fue cargada antes' : 'No fue cargada antes']);
    return { lista: out, ok: out.every((x) => x[0] === 'ok' || x[0] === 'in') }; }
  function setClave(C, z) { const c = String(z || '').replace(/\D/g, '').slice(0, 49); setFx(C, { clave: c, errBase: '' }); }
  // La consulta al SRI (informativa: la base vuelve a consultar al confirmar) se pide una vez por clave, fuera del dibujo.
  const PEND = {}; let AUTO = false;
  const consultar = (C, clave) => { const SRI = W.SIRIUS_SRI; if (!SRI || PEND[clave] || SRI.validarClave(clave)) return; PEND[clave] = true; setTimeout(() => SRI.consultar(clave).then((r) => { PEND[clave] = false; setFx(C, { sri: Object.assign({ clave }, r) }); }), 0); };
  function mesa(C, v) { estilos(); const LP = LPx(), f = LP.facturaPrep(v.proveedor), st = fx(C), ab = abierto(C); if (!f) return null; const c = contenido(LP, f), n = c.ls.length + c.hs.length, iva = LP.ivaDe(f.subtotal, hoy()), clave = st.clave || '', ck = checksClave(C, LP, v, f, clave), ofs = LP.abiertas(v.proveedor);
    const quitar = (ls, hs) => { setFx(C, { busy: true }); LP.facQuitar(ls, hs, v.yo, v.proveedor).then((r) => { setFx(C, { busy: false }); if (r && r.ok) C.toast(r.mensaje); else C.lpSet({ err: (r && r.mensaje) || 'La base no quitó.' }); }); };
    const row = (key, ref, sub2, fch, est, det, t, amt, qL, qH) => h('div', { key, className: 'fc-row mesa', 'data-fc-elemento': key }, h('span', null, h('span', { className: 'fc-ref' }, ref), sub2 ? ' · ' + sub2 : ''), h('span', { className: 'fc-fecha' }, fecha(fch), h('small', null, est)), h('span', { className: 'fc-det' }, det), h('span', null, tag(t)), h('span', { className: 'fc-amt' }, n2(amt)),
      h('button', { type: 'button', className: 'fc-x', 'aria-label': 'Quitar ' + ref, 'data-fc-quitar': key, disabled: !!st.busy, onClick: () => quitar(qL, qH) }, 'Quitar'));
    const filasM = c.ls.map((l) => row(l.id, 'Liquidación ' + LP.numCorto(l), 'v' + (l.version || 1), fechaLiq(C, l), 'Aprobada', liqInsp(LP, l).replace(/^(\d+ inspecci(ón|ones)): /, '$1: '), 'liq', l.subtotal, [l.id], []))
      .concat(c.hs.map((x) => row(x.id, refHon(x), 'caso ' + x.caso, x.fecha, LP.completado(x) ? 'Completado' : 'Inspección', detHon(LP, x), 'pre', x.subtotal, [], [x.id]))); /* en la mesa, como la maqueta: «Preacordado» (el detalle ya dice «Completado de informe») */
    const head = h('div', { key: 'hd', className: 'fc-row mesa head', 'aria-hidden': 'true' }, h('span', null, 'Referencia'), h('span', null, 'Fecha'), h('span', null, 'Detalle'), h('span', null, 'Tipo'), h('span', { style: { textAlign: 'right' } }, 'Subtotal'), h('span'));
    const texto = 'Subtotal (base imponible): ' + n2(f.subtotal) + '\nIVA ' + iva.tasa + ' %: ' + n2(iva.iva) + '\nTotal: ' + n2(iva.total) + '\nDescripción: ' + descripcion(LP, f);
    const copiar = () => { const ok = () => C.toast('Valores copiados'); try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok, ok); else ok(); } catch (e) { ok(); } setFx(C, { copiado: true }); };
    const confirmar = () => { setFx(C, { busy: true, errBase: '' }); LP.facConfirmar(clave, v.yo, v.proveedor).then((r) => { setFx(C, { busy: false }); if (r && r.ok) { setFx(C, { clave: '', sri: null, errBase: '' }); C.toast(r.mensaje || 'Factura confirmada'); C.setState({ tab: 'Seguimiento' }); } else setFx(C, { errBase: (r && r.mensaje) || 'La base no confirmó la factura.' }); }); };
    const descartar = () => { setFx(C, { busy: true, conf: false }); LP.facDescartar(v.yo, v.proveedor).then((r) => { setFx(C, { busy: false, clave: '', sri: null }); if (r && r.ok) { C.toast(r.mensaje); C.setState({ tab: 'Por facturar' }); } else C.lpSet({ err: (r && r.mensaje) || 'La base no descartó la factura.' }); }); };
    if (!LP.cx() && clave.length === 49 && !(st.sri && st.sri.clave === clave)) consultar(C, clave);
    if (st.autoConfirmar && !AUTO) { AUTO = true; setTimeout(() => { setFx(C, { autoConfirmar: false }); confirmar(); AUTO = false; }, 300); } // escenas: la respuesta de la base al confirmar
    const dev = f.devuelta ? h('div', { key: 'dev', role: 'alert', className: 'fc-al warn', 'data-fc-devuelta': '1' }, h('strong', null, 'Factura ' + f.devuelta.numero + ' devuelta por ' + (f.devuelta.por || 'Finanzas') + ' el ' + fecha(f.devuelta.fecha) + (hora(f.devuelta.fecha) ? ' · ' + hora(f.devuelta.fecha) : '') + ': '), '«' + f.devuelta.motivo + '». ', h('br'), 'Clave anterior: ', h('code', { style: { fontSize: 12.5 } }, f.devuelta.clave), '. Corrige lo que haga falta, emite la nota de crédito o la nueva factura en el SRI y pega la nueva clave.') : null;
    const pasos = h('div', { key: 'pasos', className: 'fc-pan', style: { borderTop: '1px solid #E8E8E8' } },
      h('div', { className: 'fc-step' + (n ? ' done' : '') }, h('span', { className: 'fc-num' }, '1'), h('div', null, h('b', { style: { color: '#011E41' } }, 'Arma la factura'), h('div', { className: 'fc-legend' }, 'Agrega o quita hasta que esté lo que vas a cobrar. Nada se envía todavía.'))),
      h('div', { className: 'fc-step' }, h('span', { className: 'fc-num' }, '2'), h('div', { style: { flex: 1, minWidth: 0 } }, h('b', { style: { color: '#011E41' } }, 'Emítela en el SRI con estos valores'),
        h('div', { className: 'fc-copy', style: { marginTop: 8 }, 'data-fc-valores': '1' }, h('span', null, 'Subtotal (base imponible)'), h('code', null, n2(f.subtotal)), h('span', null, 'IVA ' + iva.tasa + ' %'), h('code', null, n2(iva.iva)), h('span', null, 'Total'), h('code', null, n2(iva.total)), h('span', null, 'Descripción sugerida'), h('code', { style: { fontSize: 12.5 }, 'data-fc-descripcion': '1' }, descripcion(LP, f))),
        h('button', { type: 'button', className: 'fc-btn s', style: { marginTop: 8 }, onClick: copiar }, 'Copiar los valores'))),
      h('div', { className: 'fc-step' + (ck.ok ? ' done' : '') }, h('span', { className: 'fc-num' }, '3'), h('div', { style: { flex: 1, minWidth: 0 } }, h('label', { htmlFor: 'fc-clave', style: { fontWeight: 700, color: '#011E41' } }, 'Pega la clave de acceso (49 dígitos)'),
        h('input', { id: 'fc-clave', className: 'fc-clave' + (st.errBase ? ' err' : ''), inputMode: 'numeric', autoComplete: 'off', 'aria-label': 'Clave de acceso del SRI', 'aria-describedby': st.errBase ? 'fc-clave-err' : undefined, 'aria-invalid': st.errBase ? 'true' : 'false', placeholder: '49 dígitos de la factura autorizada', value: clave, style: { marginTop: 8 }, onChange: (e) => setClave(C, e.target.value) }),
        st.errBase ? h('div', { id: 'fc-clave-err', role: 'alert', className: 'fc-al err', style: { marginTop: 8 }, 'data-fc-error-base': '1' }, st.errBase) : null,
        h('div', { 'data-fc-checks': '1' }, ck.lista.map((x, i) => h('div', { key: i, className: 'fc-chk', style: i === ck.lista.length - 1 ? { borderBottom: 'none' } : null }, h('span', { className: x[0] }, x[0] === 'ok' ? '✓' : x[0] === 'no' ? '✗' : x[0] === 'in' ? '' : '…'), h('span', x[0] === 'in' ? { style: { color: '#5C6470' }, 'data-fc-chk-info': '1' } : null, x[1]), h('span'))))))) ;
    const barra = h('div', { key: 'bar', className: 'fc-bar', style: { position: 'static' } }, st.conf ? [h('span', { key: 't' }, h('b', null, '¿Descartar la factura en preparación?'), ' Todo vuelve a «Por facturar». No toca el SRI: si ya la emitiste allá, anúlala allá.'),
        h('span', { key: 'b', style: { display: 'flex', gap: 8 } }, h('button', { type: 'button', className: 'fc-btn g', onClick: () => setFx(C, { conf: false }) }, 'Cancelar'), h('button', { type: 'button', className: 'fc-btn p', 'data-fc-descartar-si': '1', onClick: descartar }, 'Sí, descartar'))]
      : [h('span', { key: 't' }, h('b', null, usd(f.subtotal) + ' sin IVA'), ' \u00a0·\u00a0 al confirmar, pasa a «Por validar» de Finanzas'), h('span', { key: 'b', style: { display: 'flex', gap: 8 } }, h('button', { type: 'button', className: 'fc-btn g', 'data-fc-descartar': '1', onClick: () => setFx(C, { conf: true }) }, 'Descartar la factura'),
        h('button', { type: 'button', className: 'fc-btn p', 'data-fc-confirmar': '1', disabled: !!st.busy || !n || clave.length !== 49, onClick: confirmar }, st.busy ? 'Confirmando…' : 'Confirmar factura'))]);
    const izq = h('div', { key: 'izq', className: 'fc-card', 'data-fc-mesa-factura': f.id }, h('div', { className: 'fc-grp' }, h('span', null, 'Factura en preparación · ' + n + (n === 1 ? ' elemento' : ' elementos')), h('button', { type: 'button', onClick: () => C.setState({ tab: 'Por facturar' }) }, '+ Agregar desde Por facturar')), n ? head : null, n ? filasM : h('p', { className: 'fc-legend', style: { margin: 0, padding: 16 } }, 'La factura está vacía: agrega desde «Por facturar».'), pasos, barra);
    const lat = h('aside', { key: 'lat', className: 'fc-card fc-lat', 'aria-label': 'Cómo funciona y liquidaciones abiertas', 'data-fc-panel': ab ? 'abierto' : 'contraido' },
      h('div', { className: 'fc-riel' }, h('button', { type: 'button', className: 'fc-plegar', 'aria-expanded': 'false', 'aria-label': 'Abrir cómo funciona', 'data-fc-plegar': 'abrir', onClick: () => plegar(C) }, '‹'), h('span', { className: 'fc-vert' }, 'Cómo funciona · liquidaciones abiertas'), ofs.length ? h('span', { className: 'fc-tag t-b' }, String(ofs.length)) : null),
      h('div', { className: 'fc-cont fc-pan' }, h('div', { className: 'fc-cab' }, h('h2', null, 'Cómo funciona'), h('button', { type: 'button', className: 'fc-plegar', 'aria-expanded': 'true', 'aria-label': 'Contraer el panel', 'data-fc-plegar': 'contraer', onClick: () => plegar(C) }, '›')),
        h('div', { className: 'fc-note' }, 'Una sola factura en preparación a la vez. Mientras no la confirmes, lo que tiene queda reservado para ella: no aparece en «Por facturar» ni puede entrar en otra.'),
        h('div', { className: 'fc-note' }, 'Si Finanzas la devuelve, todo vuelve aquí con su motivo: corriges, emites la nota de crédito o la nueva factura en el SRI y pegas la nueva clave.'),
        h('div', { className: 'fc-note' }, '«Descartar la factura» devuelve todo a «Por facturar». No toca el SRI: si ya la emitiste allá, anúlala allá.'),
        h('h2', { style: { marginTop: 6 } }, 'Liquidaciones abiertas'), ofs.length ? ofs.map((l) => h('div', { key: l.id, className: 'fc-it' }, h('span', null, LP.numCorto(l) + ' · ' + l.estado + ' · ' + l.lineas.length + (l.lineas.length === 1 ? ' inspección' : ' inspecciones')), h('button', { type: 'button', className: 'fc-lk', onClick: () => C.lpSet({ mesaVista: 'liq', abierta: l.id, verTodas: false }) }, 'Abrir')))
          : h('div', { className: 'fc-legend' }, 'No tienes liquidaciones abiertas. En «Por liquidar» marcas inspecciones y creas una liquidación.')));
    return [h('div', { key: 'fc', className: 'fc' }, dev, h('div', { className: 'fc-grid' + (ab ? '' : ' contraido') }, izq, lat))]; }
  // Acceso a la factura desde la mesa de liquidaciones.
  function accesoMesa(C, v) { estilos(); const LP = LPx(), f = LP.facturaPrep(v.proveedor); if (!f) return null; const n = f.liquidaciones.length + f.honorarios.length;
    return h('div', { key: 'fcacc', className: 'fc' }, h('div', { className: 'fc-card', style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' } }, h('span', null, h('strong', { style: { color: '#011E41' } }, 'Factura en preparación'), ' · ' + n + (n === 1 ? ' elemento · ' : ' elementos · ') + usd(f.subtotal) + (f.devuelta ? ' · devuelta por Finanzas' : '')), h('button', { type: 'button', className: 'fc-btn s', 'data-fc-ir-factura': '1', onClick: () => C.lpSet({ mesaVista: 'factura' }) }, 'Abrir la factura'))); }
  // ---------- Seguimiento: liquidaciones y facturas enviadas ----------
  function seguimiento(C, v) { estilos(); const LP = LPx(), p = v.proveedor, st = fx(C), chip = st.seg || 'todas';
    const ls = LP.liquidaciones().filter((l) => LP.mismo(l.proveedor, p) && ['Borrador', 'Anulada'].indexOf(l.estado) < 0), fs = LP.facturas().filter((f) => LP.mismo(f.proveedor, p) && ['En preparación', 'Descartada'].indexOf(f.estado) < 0);
    const grupoDe = (d) => (d.k === 'f' ? { 'Por validar': 'validar', Validada: 'pagar', 'Factura devuelta': 'devueltas', Pagada: 'pagadas' }[d.o.estado] : { 'Por corregir': 'devueltas', Pagada: 'pagadas' }[d.o.estado]) || '';
    const docs = fs.map((f) => ({ k: 'f', o: f, t: f.fecha || f.creada || '' })).concat(ls.map((l) => ({ k: 'l', o: l, t: ((l.versiones || [])[(l.versiones || []).length - 1] || {}).enviada || l.creada || '' }))).sort((a, b) => (a.t < b.t ? 1 : -1));
    const n = (g) => docs.filter((d) => grupoDe(d) === g).length, vis = docs.filter((d) => chip === 'todas' || grupoDe(d) === chip);
    const chipB = (k, t) => h('button', { key: k, type: 'button', className: 'fc-chip', 'aria-pressed': chip === k ? 'true' : 'false', 'data-fc-seg': k, onClick: () => setFx(C, { seg: k }) }, t);
    const tagE = (e) => h('span', { className: 'fc-tag ' + ({ 'Por validar': 't-w', Validada: 't-b', Pagada: 't-ok', 'Factura devuelta': 't-r', Enviada: 't-w', 'Por corregir': 't-r', Aprobada: 't-b', Facturada: 't-n' }[e] || 't-n') }, e === 'Validada' ? 'Por pagar' : e === 'Enviada' ? 'Por aprobar' : e);
    const contiene = (f) => { const c = contenido(LP, f), a = c.ls.map((l) => 'Liquidación ' + LP.numCorto(l)); if (c.comp.length) a.push(c.comp.length + (c.comp.length === 1 ? ' completado' : ' completados')); if (c.pre.length) a.push(c.pre.length + (c.pre.length === 1 ? ' preacordado' : ' preacordados')); return a.join(' · ') || '—'; };
    const fila = (d) => { if (d.k === 'f') { const f = d.o, sig = { 'Por validar': 'Finanzas la valida con la consulta al SRI', Validada: 'Finanzas registra el pago', Pagada: f.pago ? 'Pagada el ' + fecha(f.pago.fecha) + ' (ref. ' + f.pago.referencia + ')' : 'Pagada', 'Factura devuelta': 'Lo que incluía está en tu factura en preparación' }[f.estado] || '';
        return h('tr', { key: f.id, 'data-fac': f.id }, h('td', null, h('b', { style: { color: '#011E41' } }, 'Factura ' + f.numero), h('div', { className: 'fc-legend' }, (f.estado === 'Factura devuelta' ? 'Devuelta: ' + f.motivo : 'Confirmada el ' + fecha(f.fecha)) + (f.clave ? ' · clave …' + f.clave.slice(-12) : '')), h('button', { type: 'button', className: 'fc-lk', style: { fontSize: 13 }, onClick: () => C.lpSet({ doc: { tipo: 'factura', id: f.id } }) }, 'Documento')),
          h('td', null, contiene(f)), h('td', null, tagE(f.estado)), h('td', { style: { textAlign: 'right', fontWeight: 800, color: '#011E41' } }, n2(f.subtotal)), h('td', { className: 'fc-legend', style: { display: 'table-cell' } }, sig)); }
      const l = d.o, xs = LP.lineas(l), fac = l.facturaId ? LP.fac(l.facturaId) : null, sig = l.estado === 'Enviada' ? 'La aseguradora la aprueba o la devuelve' : l.estado === 'Por corregir' ? h('button', { type: 'button', className: 'fc-lk', onClick: () => C.setState({ tab: 'Mesa de trabajo', lp: Object.assign({}, C.lp(), { mesaVista: 'liq', abierta: l.id, verTodas: false }) }) }, 'Corrígela en la mesa') : l.estado === 'Aprobada' ? (fac && fac.estado === 'En preparación' ? 'Está en tu factura en preparación' : 'Agrégala a tu factura en «Por facturar»') : l.estado === 'Facturada' ? 'En la factura ' + ((fac || {}).numero || '') : l.estado === 'Pagada' ? 'Pagada' : '';
      return h('tr', { key: l.id, 'data-liq': l.id }, h('td', null, h('b', { style: { color: '#011E41' } }, 'Liquidación ' + LP.numTxt(l)), h('div', { className: 'fc-legend' }, 'Enviada el ' + fecha(d.t) + (l.estado === 'Por corregir' && l.motivo ? ' · aseguradora: ' + l.motivo : '')), h('span', { style: { display: 'inline-flex', gap: 10, fontSize: 13 } }, h('button', { type: 'button', className: 'fc-lk', onClick: () => C.lpSet({ doc: { tipo: 'liquidacion', id: l.id } }) }, 'Documento'), C.lpPdfLk(l))),
        h('td', null, xs.length + (xs.length === 1 ? ' inspección' : ' inspecciones') + (xs.length ? ': ' + xs.map((x) => x.caso + (x.placa ? ' (' + x.placa + ')' : '')).join(', ') : '')), h('td', null, tagE(l.estado)), h('td', { style: { textAlign: 'right', fontWeight: 800, color: '#011E41' } }, n2(l.subtotal)), h('td', { className: 'fc-legend', style: { display: 'table-cell' } }, sig)); };
    return [h('div', { key: 'fc', className: 'fc' }, h('div', { className: 'fc-card', style: { overflowX: 'auto' }, 'data-fc-seguimiento': '1' }, h('div', { className: 'fc-tool' }, chipB('todas', 'Todas (' + docs.length + ')'), chipB('validar', 'Por validar (' + n('validar') + ')'), chipB('pagar', 'Por pagar (' + n('pagar') + ')'), chipB('devueltas', 'Devueltas (' + n('devueltas') + ')'), chipB('pagadas', 'Pagadas (' + n('pagadas') + ')')),
      h('table', { className: 'fc-seg', 'aria-label': 'Seguimiento' }, h('thead', null, h('tr', null, h('th', null, 'Documento'), h('th', null, 'Contiene'), h('th', null, 'Estado'), h('th', { style: { textAlign: 'right' } }, 'Subtotal'), h('th', null, 'Siguiente paso'))),
        h('tbody', null, vis.length ? vis.map(fila) : h('tr', null, h('td', { colSpan: 5, className: 'fc-legend', style: { display: 'table-cell' } }, docs.length ? 'Nada en este estado.' : 'Nada enviado todavía.'))))),
      h('p', { className: 'fc-legend', style: { margin: 0 } }, 'El seguimiento junta tus liquidaciones enviadas y tus facturas en un solo lugar, con su estado y lo que falta para cobrar.'))]; }
  // ---------- Recorrido y contador de las pestañas ----------
  const flujo = () => { estilos(); const P = ['Por liquidar', 'Mesa: liquidación', 'Por facturar', 'Mesa: factura en preparación', 'Seguimiento'], out = []; P.forEach((t, i) => { if (i) out.push(h('i', { key: 'i' + i, 'aria-hidden': 'true' }, '→')); out.push(h('span', { key: 's' + i }, t)); }); return h('div', { key: 'flujo', className: 'fc-flow', 'aria-label': 'Recorrido', 'data-fc-flujo': '1' }, out); };
  W.SiriusFacturacion = { version: '1.0', porFacturar, mesa, accesoMesa, seguimiento, flujo, estilos, descripcion, filas, hoy, dias };
})();
