// SIRIUS · Fotos y evidencias de Vehículos (etapa VF). Arma el modelo `ec` que muestra el componente de S5 (FotosEvidencias.dc.html).
// Datos: SIRIUS_EJEMPLO.evidencias[riesgo].fotos[pasoId] y los pasos de SIRIUS_EJEMPLO.plantillas['Vehículos livianos v1'].pasos
// (req por modalidad, sec: la primera es la principal, rep, link). Valores del vehículo (para «Visible si»): SiriusSalidaVeh.contexto.
// Estado de la sesión (confirmar, excluir con motivo, observación): lo guarda el Back-office y llega en `est`.
(function () {
  const MOD = { Presencial: 'P', 'Virtual guiada': 'V', 'Autoinspección': 'A', Documental: 'D' };
  const E = () => window.SIRIUS_EJEMPLO || {};
  function vehiculo(rid) { return (E().vehiculos || []).find(v => v.riesgo === rid) || (E().equipos || []).find(v => v.riesgo === rid) || null; }   // etapa 8a: también equipos
  function plantilla(v) { return ((E().plantillas || {})[(v && v.formulario) || 'Vehículos livianos v1']) || {}; }
  function modalidad(v) { return MOD[(v && v.modalidad) || ''] || 'P'; }
  function valores(rid) { const G = window.SiriusSalidaVeh, c = G ? G.contexto(rid, {}, '', '') : null; return c ? c.val : {}; }
  function placa(v) { const p = (v && v.placa) || ''; return window.SIRIUS_PLACA ? window.SIRIUS_PLACA.normalizar(p) : p; }
  // Pasos que aplican al vehículo («Visible si» con sus valores).
  function pasos(rid) { const v = vehiculo(rid), T = plantilla(v), val = valores(rid); return (T.pasos || []).filter(s => !s.vis || String(val[s.vis.k] == null ? '' : val[s.vis.k]) === String(s.vis.v)); }
  function necesita(s, M) { return s.req && s.req[M] ? Math.max(1, s.min || 1) : 0; }
  // Fotos del vehículo con su paso y su estado de la sesión. extra: fotos subidas en la sesión por paso.
  // Toda foto registrada se muestra, aunque su paso no aplique hoy («Visible si»): ninguna foto se pierde.
  function fotos(rid, est, extra) { const EV = ((E().evidencias || {})[rid] || {}).fotos || {}, out = []; let n = 0, vis = pasos(rid).map(s => s.id);
    const T = plantilla(vehiculo(rid)).pasos || [], add = (s) => (EV[s.id] || []).concat((extra || {})[s.id] || []).forEach((f, i) => { const e = (est || {})[f.id] || {}; n++; out.push({ f, s, i, n, estado: e.estado || 'Asignada', motivo: e.motivo || '', obs: e.obs || '', por: e.by || '', at: e.at || '' }); });
    T.filter(s => vis.includes(s.id) || (EV[s.id] || []).length || ((extra || {})[s.id] || []).length).forEach(add);
    // Etapa 12d-3b · pasos de la autoinspección que la plantilla no tiene (laterales únicos, VIN grabado, tablero, llanta): sus fotos también se muestran.
    const AI = ((window.SIRIUS_AUTOINSPECCION || {}).pasos || {}).vehiculos || {}, nom = (id) => ((AI.activos || []).find(p => p.id === id) || {}).nombre || id;
    Object.keys(EV).filter(k => !T.some(s => s.id === k) && (EV[k] || []).length).forEach(k => add({ id: k, group: 'Autoinspección', name: nom(k), sec: [/^(interiores|llanta)/.test(k) ? 'acc' : /^identificacion/.test(k) ? 'ver' : 'veh'], req: {}, min: 0 }));
    return out; }
  function cuenta(x) { return x.estado !== 'Excluida'; }
  // Cumplimiento por modalidad: pasos exigidos con sus fotos válidas.
  function cumplimiento(lista, ps, M) { const req = ps.filter(s => necesita(s, M) > 0), falta = req.filter(s => lista.filter(x => x.s.id === s.id && cuenta(x)).length < necesita(s, M)); return { req: req.length, ok: req.length - falta.length, falta: falta.map(s => s.name) }; }
  function textoCumpl(c, modTxt) { if (!c.req) return 'Sin fotos exigidas en ' + modTxt; const f = c.falta, ft = f.length > 3 ? f.slice(0, 3).join(', ') + ' y ' + (f.length - 3) + ' más' : f.join(', '); return c.ok + ' de ' + c.req + (f.length ? ' · falta ' + ft : ' · completo'); }
  function fecha(at) { const m = /^(\d\d\/\d\d\/\d\d) · (\d\d:\d\d)/.exec(at || ''); return m ? { d: m[1], h: m[2] } : { d: '', h: '' }; }
  function gps(f) { return f.gps ? f.gps.lat.toFixed(5) + ', ' + f.gps.lng.toFixed(5) + ' · ± ' + f.gps.prec + ' m' + (f.marca === 'gpssim' ? ' · simulado (sin permiso de ubicación)' : '') : 'Sin GPS'; }
  // Paso y, en Extras y Daños (rep), la fila de la grilla a la que se vincula la foto.
  function etiqueta(x) { return x.f.fila ? x.s.name + ' · ' + x.f.fila.label : x.s.name; }
  function grupo(x) { return x.s.group === x.s.name ? '' : x.s.group + ' · '; }
  const TONE = { Asignada: 'neutral', Confirmada: 'success', Excluida: 'warning' };
  const MARCA = { galeria: 'Subida desde la galería', bo: 'Cargada desde el back-office', gpssim: 'GPS simulado (sin permiso de ubicación)' };   // etapa 12b: portal del cliente

  // Modelo para FotosEvidencias. o: { rid, est, extra, vista, filtro, vz (id), obsDraft, canEdit, pre (prefijo de ids),
  //   setVista, setFiltro, confirmar(ids), excluir(id), reincorporar(id), abrir(id), cerrar(), setObs(txt), guardarObs(id), irFila(fila) }
  function ec(o) {
    const v = vehiculo(o.rid); if (!v) return null;
    const T = plantilla(v), M = modalidad(v), modTxt = v.modalidad || '—', ps = pasos(o.rid), all = fotos(o.rid, o.est, o.extra), pl = placa(v) || v.label || o.rid, pre = o.pre || 'vf';
    const btn = (on, l, pick) => ({ l, pressed: on ? 'true' : 'false', bg: on ? 'var(--color-brand-wash)' : '#FFFFFF', bd: on ? 'var(--color-brand)' : 'var(--border-default)', pick });
    const vista = o.vista === 'gal' ? 'gal' : 'sec', ff = o.filtro || 'todas';
    const FIL = { todas: () => true, asig: x => x.estado === 'Asignada', conf: x => x.estado === 'Confirmada', excl: x => x.estado === 'Excluida', sgps: x => !x.f.gps };
    const cnt = {}; Object.keys(FIL).forEach(k => { cnt[k] = all.filter(FIL[k]).length; });
    const L = all.filter(FIL[ff] || FIL.todas), ed = !!o.canEdit;
    // Etapa 12d-3b · distintivo de alerta de la autoinspección (solo calificadores): abre la bandeja de controles en esa alerta.
    const AL = o.alertas || {}, alDe = (x) => { const a = AL[x.s.id + '#' + x.i]; if (!a || !o.irAlerta) return { hasAlerta: false, fid: x.f.id }; const sv = { alta: 'Alerta alta', media: 'Alerta media', baja: 'Alerta baja' }[a.sev] || 'Alerta', est = { p: 'por revisar', c: 'conforme', a: 'requiere acción' }[a.st] || '';
      return { hasAlerta: true, fid: x.f.id, alertaId: a.id, alertaTxt: sv + ' · ' + est, alertaColor: a.st === 'p' ? (a.sev === 'alta' ? 'var(--color-danger, #b42318)' : '#9a6400') : 'var(--text-muted)', alertaAria: sv + ' (' + est + '): ' + a.titulo + ' · abre la revisión de los controles', onAlerta: () => o.irAlerta(a.id) }; };
    const card = (x) => { const fh = fecha(x.f.at), marcas = [MARCA[x.f.marca], x.f.gps ? '' : (M === 'D' ? '' : 'Sin GPS'), x.f.reint ? 'Reintentos: ' + x.f.reint : ''].filter(Boolean).map(t => ({ t }));
      const notas = [{ t: grupo(x) + etiqueta(x) + ' · ' + pl }].concat(x.estado === 'Excluida' ? [{ t: 'Motivo de exclusión: ' + (x.motivo || '—') + (x.por ? ' · ' + x.por : '') }] : []);
      // Etapa 12a · DEC-134: la primera foto de un paso con daños detectados se muestra con sus polígonos (SiriusDanosMini).
      const DN = window.SiriusDanos, nD = DN && x.i === 0 ? DN.deFoto(o.rid, x.s.id).length : 0;
      return Object.assign(alDe(x), { conDanos: nD > 0, sinDanos: !nD, dRid: o.rid, dPaso: x.s.id, dTexto: 'Imagen de ejemplo', id: 'Foto ' + x.n, sel: false, noSel: true, checked: false, onSel: () => {}, selAria: '', tone: TONE[x.estado] || 'neutral', estado: x.estado, aria: 'Ver en el visor · Foto ' + x.n + ' · ' + etiqueta(x), open: () => o.abrir(x.f.id),
        fh: fh.d ? fh.d + ' · ' + fh.h : 'Fecha de toma no disponible', gps: gps(x.f), hasObs: !!x.obs, obs: x.obs, hasConf: false, conf: '',
        hasDoc: !!(x.f.fila && o.irFila), docHref: '#', docTxt: x.f.fila ? 'Ver la fila en ' + (x.f.fila.g === 'ext' ? 'Extras' : 'Averías') : '', onDoc: (e) => { if (e && e.preventDefault) e.preventDefault(); if (o.irFila) o.irFila(x.f.fila); },
        hasMarcas: marcas.length > 0, marcas, notas, hasAct: ed, canConf: ed && x.estado === 'Asignada', onConf: () => o.confirmar([x.f.id]), confAria: 'Confirmar Foto ' + x.n,
        canRest: ed && x.estado === 'Excluida', onRest: () => o.reincorporar(x.f.id), restAria: 'Reincorporar Foto ' + x.n, canExcl: ed && x.estado !== 'Excluida', onExcl: () => o.excluir(x.f.id), exclAria: 'Excluir Foto ' + x.n,
        bd: x.estado === 'Excluida' ? 'var(--border-subtle)' : 'var(--border-default)', bg: x.estado === 'Excluida' ? 'var(--surface-subtle)' : '#FFFFFF' }); };
    // Por sección: la principal de cada paso (sec[0]), en el orden de la plantilla.
    const secs = (T.secciones || []).map(([sid, tit]) => { const pS = ps.filter(s => (s.sec || [])[0] === sid); if (!pS.length && !all.some(x => (x.s.sec || [])[0] === sid)) return null; const fx = L.filter(x => (x.s.sec || [])[0] === sid), c = cumplimiento(all, pS, M), asig = fx.filter(x => x.estado === 'Asignada');
      return { hid: pre + '-sec-' + sid, lv: '3', fs: '17px', title: tit, hasSub: true, sub: textoCumpl(c, modTxt) + ' · ' + (fx.length === 1 ? '1 foto' : fx.length + ' fotos'), hasConf: ed && asig.length > 0, confTxt: 'Confirmar las asignadas (' + asig.length + ')', onConf: () => o.confirmar(asig.map(x => x.f.id)),
        hasGrid: true, path: tit, hasEmpty: !fx.length, emptyTxt: all.length ? 'Ninguna foto de esta sección cumple el filtro.' : 'Sin fotos registradas', fotos: fx.map(card), pad: '18px 22px', ml: '0', bd: '1px solid var(--border-subtle)', bg: '#FFFFFF' }; }).filter(Boolean);
    const gal = L.map(x => Object.assign(alDe(x), { eid: pre + '-gal-' + x.f.id, aria: 'Ver en el visor · Foto ' + x.n + ' · ' + etiqueta(x) + ' · ' + x.estado, open: () => o.abrir(x.f.id), bg: x.estado === 'Excluida' ? 'var(--surface-subtle)' : '#FFFFFF', ph: etiqueta(x) + ' · ' + pl, n: 'Foto ' + x.n, et: x.s.group + ' · ' + (fecha(x.f.at).d ? fecha(x.f.at).d + ' · ' + fecha(x.f.at).h : 'sin fecha de toma'), tone: TONE[x.estado] || 'neutral', estado: x.estado, title: x.obs || '', obs: x.obs || (x.estado === 'Excluida' ? 'Excluida: ' + (x.motivo || '—') : 'Sin observación'), obsC: x.obs ? 'var(--text-body)' : 'var(--text-muted)' }));
    // Visor: navega por la lista filtrada.
    const ids = L.map(x => x.f.id), cur = o.vz ? all.find(x => x.f.id === o.vz) : null, ix = cur ? ids.indexOf(cur.f.id) : -1;
    let vz = { open: false, meta: [] };
    if (cur) { const fh = fecha(cur.f.at), row = (l, val) => ({ l, v: val || '—' }), obsTxt = o.obsDraft != null ? o.obsDraft : cur.obs;
      const DN = window.SiriusDanos, dV = DN && cur.i === 0 && (DN.deFoto(o.rid, cur.s.id).length > 0 || DN.lista(o.rid).some(d => d.foto === cur.s.id) || (cur.s.ex || []).includes('Daños') || cur.s.group === 'Exteriores');
      vz = { conDanos: !!dV, sinDanos: !dV, dRid: o.rid, dPaso: cur.s.id, dPuede: !!o.revisaDanos, dUsuario: o.usuario || '', dTexto: etiqueta(cur) + ' · ' + pl + ' · Imagen de ejemplo', open: true, title: 'Foto ' + cur.n + ' · ' + etiqueta(cur) + ' · ' + pl, pos: ix >= 0 ? (ix + 1) + ' de ' + ids.length : '', close: o.cerrar, ph: etiqueta(cur) + ' · ' + pl + ' · Imagen de ejemplo',
        prev: () => { if (ix > 0) o.abrir(ids[ix - 1]); }, next: () => { if (ix >= 0 && ix < ids.length - 1) o.abrir(ids[ix + 1]); }, prevAd: ix > 0 ? 'false' : 'true', nextAd: ix >= 0 && ix < ids.length - 1 ? 'false' : 'true', prevWhy: ix > 0 ? '' : 'Es la primera foto', nextWhy: ix >= 0 && ix < ids.length - 1 ? '' : 'Es la última foto', prevCur: ix > 0 ? 'pointer' : 'not-allowed', nextCur: ix >= 0 && ix < ids.length - 1 ? 'pointer' : 'not-allowed', prevOp: ix > 0 ? '1' : '.4', nextOp: ix >= 0 && ix < ids.length - 1 ? '1' : '.4',
        meta: [row('Estado', cur.estado + (cur.estado === 'Excluida' ? ' · ' + (cur.motivo || '—') : '')), row('Paso', grupo(cur) + cur.s.name + (necesita(cur.s, M) ? ' · exigido en ' + modTxt : ' · opcional en ' + modTxt)), row('Sección', ((T.secciones || []).find(z => z[0] === (cur.s.sec || [])[0]) || [0, '—'])[1]), row('Fecha', fh.d), row('Hora', fh.h), row('GPS', gps(cur.f)), row('Dispositivo', cur.f.disp), row('Canal', cur.f.canal)].concat(cur.f.fila ? [row('Fila de la grilla', (cur.f.fila.g === 'ext' ? 'Extras · ' : 'Averías · ') + cur.f.fila.label)] : [], cur.f.carga ? [row('Fecha de carga', cur.f.carga)] : []),
        obsEd: ed, obsRo: !ed, obsTxt: obsTxt || '', obsShow: cur.obs || 'Sin observación', roWhy: o.roWhy || 'tu rol no puede editar las fotos', onObs: (e) => o.setObs(e.target.value), saveObs: () => o.guardarObs(cur.f.id, obsTxt || '') }; }
    const total = cumplimiento(all, ps, M), docs = (T.pasos || []).filter(s => s.group === 'Documentos' && (ps.includes(s) || all.some(x => x.s.id === s.id)));
    return { vistas: [['sec', 'Por sección'], ['gal', 'Galería']].map(([k, l]) => btn(vista === k, l, () => o.setVista(k))),
      filtros: [['todas', 'Todas'], ['asig', 'Asignadas'], ['conf', 'Confirmadas'], ['excl', 'Excluidas'], ['sgps', 'Sin GPS']].map(([k, l]) => btn(ff === k, l + ' (' + cnt[k] + ')', () => o.setFiltro(k))),
      fNone: all.length > 0 && !L.length, galOn: vista === 'gal' && L.length > 0, secOn: vista === 'sec' || !all.length, gal, secs: all.length ? secs : [{ hid: pre + '-sec-vacia', lv: '3', fs: '17px', title: 'Fotos', hasSub: false, sub: '', hasConf: false, hasGrid: true, path: 'Fotos', hasEmpty: true, emptyTxt: 'Sin fotos registradas', fotos: [], pad: '18px 22px', ml: '0', bd: '1px solid var(--border-subtle)', bg: '#FFFFFF' }],
      galEmpty: vista === 'gal' && !all.length, vz, soloVisor: !!o.soloVisor,
      // Resumen para la pestaña Evidencias.
      resumen: { fotos: all.filter(cuenta).length, excluidas: cnt.excl, cumpl: textoCumpl(total, modTxt), faltan: total.falta, modalidad: modTxt, placa: pl, docs: docs.map(s => { const fx = all.filter(x => x.s.id === s.id && cuenta(x)), nd = necesita(s, M); return { id: s.id, nombre: s.name, n: fx.length, estado: fx.length ? (fx.length === 1 ? '1 foto' : fx.length + ' fotos') : nd ? 'Falta · exigido en ' + modTxt : 'No exigido en ' + modTxt, falta: !fx.length && nd > 0, primera: fx[0] ? fx[0].f.id : '' }; }) } };
  }
  // Lista simple para la calificación (Calificacion.dc.html: tipo, titulo, fecha, hora, gps, dispositivo, paso).
  function evidencias(rid, est) { const v = vehiculo(rid), pl = placa(v) || (v && v.label) || rid; return fotos(rid, est).filter(cuenta).map(x => { const fh = fecha(x.f.at); return { tipo: x.s.group === 'Documentos' ? 'doc' : 'foto', titulo: etiqueta(x) + ' · ' + pl, fecha: fh.d || '—', hora: fh.h || '—', gps: x.f.gps ? x.f.gps.lat.toFixed(5) + ', ' + x.f.gps.lng.toFixed(5) : '', dispositivo: x.f.disp || '', paso: x.s.group + ' · ' + x.s.name, modalidad: v ? v.modalidad : '' }; }); }
  window.SiriusFotosVeh = { modalidad, pasos, fotos, cumplimiento, ec, evidencias, placa, vehiculo };
})();
