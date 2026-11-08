// SIRIUS · Calificación de Equipo y maquinaria en dos niveles por equipo (etapa 8b · DEC-143).
// Nivel 1 (Ejecutivo de inspecciones): veredicto por equipo, «Aplicar a otros equipos» y «Requerir evaluación de suscripción».
// La derivación es obligatoria cuando la suma asegurada del equipo supera el umbral de la regla de envío de nivel 2 (SiriusEquipos.reglas).
// Nivel 2 (Suscriptor): dictamen de los equipos derivados; tiene la última palabra. «Ajustar VRN» recalcula valores, alertas y hallazgos
// sin reabrir el informe. Seguimientos del caso sugeridos desde los hallazgos (SIRIUS_EQUIPOS.calificacion.seguimientosSugeridos).
// Todo lee SIRIUS_EQUIPOS y SiriusEquipos; el estado de la sesión vive en el Back-office (props.datos y props.seg).
// Props: caso · equipos [{ rid, label, detalle, eq, envio }] · datos { rid: { n1, n2, vrn } } · seg { hallazgo: decisión } · usuario · ahora
//   puedeN1 · puedeN2 · motivoNo (por qué no puede calificar) · foco ('seg' | rid) · onAccion(evento) · onVerInforme(rid)
(function () {
  if (window.SiriusCalifEquipos) return;
  var Q = function () { return window.SIRIUS_EQUIPOS || {}; };
  var usd = function (n) { var C = window.SIRIUS_COMPANIA; return n == null ? '—' : C && C.formatoMonto ? C.formatoMonto(Number(n)) : 'USD ' + n; };
  var SEV = { alta: ['Alta', 'danger'], media: ['Media', 'warning'], baja: ['Baja', 'neutral'] };
  var TIPO_TONO = { Documento: 'neutral', 'Garantía': 'brand', 'Recomendación': 'warning' };

  // Cálculo por equipo con el VRN ajustado en calificación (si hay).
  function calc(x, d) { var SE = window.SiriusEquipos, adj = d && d.vrn, val = SE.valores(x.eq, adj ? { vrn: adj.vrn } : {}), hall = SE.hallazgos(x.eq, val), reglasHoy = SE.reglas(x.eq, val);
    var oblig = reglasHoy.find(function (r) { return r.nivel2; }) || null; return { val: val, hall: hall, oblig: oblig }; }
  // Estado de un equipo: pendiente, derivado (en suscripción), final.
  function estadoDe(d, oblig) { d = d || {}; if (d.n2) return { k: 'final', label: d.n2.resultado, tone: d.n2.resultado === 'Asegurable' ? 'success' : 'danger', nivel: 2 };
    if (d.n1 && d.n1.derivar) return { k: 'susc', label: 'En suscripción', tone: 'warning' };
    if (d.n1) return { k: 'final', label: d.n1.resultado, tone: d.n1.resultado === 'Asegurable' ? 'success' : 'danger', nivel: 1 };
    return { k: 'pend', label: 'Por calificar', tone: 'neutral' }; }
  function origenN1(n) { if (!n) return ''; return (n.aplicadoDesde ? 'Aplicado desde ' + n.aplicadoDesde + ' por ' : n.editado ? 'Modificado en calificación por ' : 'Calificado por ') + n.by + ' · ' + n.at; }
  function origenN2(n) { return n ? 'Dictamen de suscripción por ' + n.by + ' · ' + n.at : ''; }

  function SiriusCalifEquipos(props) {
    var R = window.React, h = R.createElement, NS = window.AseguradoraDelSurDesignSystem_4fbf29 || {}, SE = window.SiriusEquipos;
    var eqs = props.equipos || [], datos = props.datos || {}, seg = props.seg || {}, yo = props.usuario || '', act = props.onAccion || function () {};
    var fS = R.useState({}), form = fS[0], setForm = fS[1];        // borradores por equipo: { rid: { resultado, motivoNo, obs, derivar, motivoDer, motivoCambio, editando } }
    var vS = R.useState({}), vrnF = vS[0], setVrnF = vS[1];        // ajuste de VRN abierto: { rid: { vrn, motivo, try } }
    var aS = R.useState(null), apl = aS[0], setApl = aS[1];        // «Aplicar a otros equipos»: { desde, sel: [] }
    var sS = R.useState({}), segF = sS[0], setSegF = sS[1];        // edición o descarte de un seguimiento: { id: { modo, texto, motivo, try } }
    var tS = R.useState({}), tried = tS[0], setTried = tS[1];
    var refSeg = R.useRef(null);
    R.useEffect(function () { if (!props.foco) return; setTimeout(function () { var el = props.foco === 'seg' ? refSeg.current : document.getElementById('cem-' + props.foco); if (el && el.scrollIntoView) { try { el.scrollIntoView({ block: 'start' }); el.focus({ preventScroll: true }); } catch (e) {} } }, 500); }, []);
    if (!SE) return null;
    var B = function (variant, label, on, extra) { return NS.Button ? h(NS.Button, Object.assign({ variant: variant, size: 'sm', onClick: on }, extra || {}), label) : h('button', { type: 'button', onClick: on }, label); };
    var Badge = function (tone, txt) { return NS.Badge ? h(NS.Badge, { tone: tone }, h('span', { style: { whiteSpace: 'nowrap' } }, txt)) : h('span', null, txt); };
    var lbl = { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }, muted = { fontSize: 13, color: 'var(--text-muted)' };
    var inp = { height: 40, padding: '0 10px', border: '1.5px solid var(--input-outlined-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 14, color: 'var(--text-strong)', background: '#FFFFFF', width: '100%', boxSizing: 'border-box' };
    var ta = Object.assign({}, inp, { height: 'auto', minHeight: 64, padding: '8px 10px', resize: 'vertical', lineHeight: 1.4 });
    var errT = function (id, t) { return t ? h('span', { id: id, style: { fontSize: 12, fontWeight: 700, color: 'var(--color-danger)' } }, t) : null; };
    var C = {}; eqs.forEach(function (x) { C[x.rid] = calc(x, datos[x.rid]); });
    var setF = function (rid, p) { setForm(function (f) { var o = Object.assign({}, f); o[rid] = Object.assign({}, f[rid] || {}, p); return o; }); };
    var nombre = function (rid) { var x = eqs.find(function (y) { return y.rid === rid; }); return x ? x.label : rid; };

    // ---------- nivel 1: validación y grabado ----------
    var draftN1 = function (x) { var f = form[x.rid] || {}, c = C[x.rid]; return { resultado: f.resultado || '', motivoNo: f.motivoNo || '', obs: f.obs || '', derivar: !!c.oblig || !!f.derivar, motivoDer: c.oblig ? '' : (f.motivoDer || ''), obligatoria: !!c.oblig, motivoCambio: f.motivoCambio || '' }; };
    var erroresN1 = function (x, d, edit) { var e = {}; if (!d.resultado) e.resultado = 'Elige el resultado del equipo'; if (d.resultado === 'No asegurable' && d.motivoNo.trim().length < 10) e.motivoNo = 'Escribe el motivo (al menos 10 caracteres)';
      if (d.derivar && !d.obligatoria && d.motivoDer.trim().length < 10) e.motivoDer = 'Escribe por qué requiere suscripción (al menos 10 caracteres)'; if (edit && d.motivoCambio.trim().length < 10) e.motivoCambio = 'Escribe el motivo del cambio (al menos 10 caracteres)'; return e; };
    var grabarN1 = function (x, edit) { var d = draftN1(x), e = erroresN1(x, d, edit); if (Object.keys(e).length) { setTried(function (t) { var o = Object.assign({}, t); o[x.rid] = true; return o; }); setTimeout(function () { var el = document.getElementById('cem-' + x.rid + '-' + Object.keys(e)[0]); if (el) el.focus(); }, 30); return; }
      act({ tipo: 'n1', rids: [x.rid], datos: Object.assign({}, d, { derivacion: d.obligatoria ? 'obligatoria' : d.derivar ? 'manual' : '', motivoDerivacion: d.obligatoria ? 'Derivación obligatoria a Suscripción: ' + C[x.rid].oblig.regla + ' (' + C[x.rid].oblig.pct + ')' : d.motivoDer.trim(), editado: !!edit }) });
      setF(x.rid, { editando: false }); setTried(function (t) { var o = Object.assign({}, t); delete o[x.rid]; return o; }); };

    // ---------- ajuste del VRN ----------
    var vrnPanel = function (x) { var v = vrnF[x.rid], c = C[x.rid]; if (!v) return null; var id = 'cem-' + x.rid + '-vrn', n = v.vrn, sim = n ? SE.valores(x.eq, { vrn: n }) : null;
      var eV = !n || n <= 0 ? 'Escribe el VRN' : '', eM = String(v.motivo || '').trim().length < 10 ? 'Escribe el motivo del ajuste (al menos 10 caracteres)' : '';
      var guardar = function () { if (eV || eM) { setVrnF(function (o) { var y = Object.assign({}, o); y[x.rid] = Object.assign({}, v, { try: true }); return y; }); var el = document.getElementById(eV ? id + '-v' : id + '-m'); if (el) el.focus(); return; }
        act({ tipo: 'vrn', rid: x.rid, vrn: n, motivo: v.motivo.trim(), anterior: c.val.vrn }); setVrnF(function (o) { var y = Object.assign({}, o); delete y[x.rid]; return y; }); };
      return h('div', { role: 'group', 'aria-labelledby': id + '-t', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 14, border: '1.5px solid var(--color-brand)', borderRadius: 'var(--radius-sm)', background: 'var(--color-brand-wash)' } },
        h('strong', { id: id + '-t', style: { fontSize: 14, color: 'var(--text-strong)' } }, 'Ajustar VRN en calificación · el informe no se reabre'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 } },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-v', style: lbl }, 'VRN ajustado *'),
            window.SiriusMonto ? h(window.SiriusMonto, { id: id + '-v', value: n == null ? null : n, invalid: !!(v.try && eV), ariaDescribedby: v.try && eV ? id + '-ve' : undefined, onChange: function (k) { setVrnF(function (o) { var y = Object.assign({}, o); y[x.rid] = Object.assign({}, v, { vrn: k }); return y; }); } }) : null, v.try ? errT(id + '-ve', eV) : null,
            h('span', { style: muted }, 'VRN del informe: ' + usd(x.eq.vrn) + ' · ' + SE.fuenteDe(x.eq.vrnFuente))),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-m', style: lbl }, 'Motivo del ajuste *'),
            h('textarea', { id: id + '-m', value: v.motivo || '', rows: 2, 'aria-invalid': v.try && eM ? 'true' : undefined, 'aria-describedby': v.try && eM ? id + '-me' : undefined, onChange: function (e) { var t = e.target.value; setVrnF(function (o) { var y = Object.assign({}, o); y[x.rid] = Object.assign({}, v, { motivo: t }); return y; }); }, style: ta }), v.try ? errT(id + '-me', eM) : null)),
        sim ? h('p', { role: 'status', 'aria-live': 'polite', style: { margin: 0, fontSize: 13, color: 'var(--text-body)' } }, 'Con ' + usd(n) + ': valor real ' + usd(sim.real) + ' · relación ' + sim.relR + ' % · ' + (sim.alerta ? sim.alerta.texto : 'sin alerta de valor')) : null,
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, B('primary', 'Guardar ajuste', guardar), B('ghost', 'Cancelar', function () { setVrnF(function (o) { var y = Object.assign({}, o); delete y[x.rid]; return y; }); }))); };

    // ---------- bloques del equipo ----------
    var valores = function (x, d, puedeAj, why) { var c = C[x.rid], v = c.val, adj = d && d.vrn;
      var tile = function (t, val, sub) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', minWidth: 0 } }, h('span', { style: muted }, t), h('strong', { style: { fontSize: 16, color: 'var(--text-strong)', whiteSpace: 'nowrap' } }, val), sub ? h('span', { style: { fontSize: 12, color: 'var(--text-muted)', overflowWrap: 'anywhere' } }, sub) : null); };
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10 } },
          tile('Suma asegurada', usd(v.sa), 'De la solicitud'),
          tile('VRN', usd(v.vrn), adj ? 'Ajustado en calificación' : 'Fuente: ' + (v.fuente || '—')),
          tile('Valor real', usd(v.real), v.anios + (v.anios === 1 ? ' año' : ' años') + ' · depreciación ' + v.dep.total + ' %'),
          tile('Relación suma asegurada / VRN', v.relR == null ? '—' : v.relR + ' %', v.alerta ? (v.alerta.id === 'infraseguro' ? 'Infraseguro' : 'Sobreseguro') : 'Sin alerta de valor')),
        adj ? h('p', { style: { margin: 0, fontSize: 13, color: 'var(--text-body)' } }, h('strong', null, 'Ajustado en calificación por ' + adj.by + ' · ' + adj.at), ' · VRN del informe ' + usd(adj.anterior) + ' · Motivo: ' + adj.motivo) : null,
        v.alerta && NS.Alert ? h(NS.Alert, { tone: 'warning', size: 'sm' }, v.alerta.texto) : null,
        vrnF[x.rid] ? vrnPanel(x) : h('div', null, B('secondary', 'Ajustar VRN', function () { if (!puedeAj) return; setVrnF(function (o) { var y = Object.assign({}, o); y[x.rid] = { vrn: v.vrn, motivo: '' }; return y; }); }, puedeAj ? { 'aria-label': 'Ajustar VRN · ' + x.label } : { unavailableReason: why }))); };
    var hallazgos = function (x) { var L = C[x.rid].hall; return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('span', { style: lbl }, 'Hallazgos (' + L.length + ')'),
      L.length ? h('ul', { style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 } }, L.map(function (y) { var s = SEV[y.severidad] || SEV.baja; return h('li', { key: y.id, style: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-body)' } }, Badge(s[1], s[0]), h('span', null, y.texto)); }))
        : h('span', { style: muted }, 'Sin hallazgos.')); };
    var llego = function (x) { var L = x.envio || []; return h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 } }, h('span', { style: lbl }, 'Llegó por:'),
      L.length ? L.map(function (r, i) { return h('span', { key: i, title: r.nivel2 ? 'Esta regla además envía el equipo a nivel 2' : undefined, style: { display: 'inline-flex', padding: '2px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-default)', fontSize: 13, color: 'var(--text-strong)', background: 'var(--surface-subtle)' } }, r.regla + (r.pct ? ' (' + r.pct + ')' : '') + (r.nivel2 ? ' · nivel 2' : '')); }) : h('span', { style: muted }, 'Sin reglas de envío (lo califica el Ejecutivo de inspecciones)')); };
    var radios = function (x, name, val, on, err, dis) { return h('div', { role: 'radiogroup', id: 'cem-' + x.rid + '-' + name, tabIndex: -1, 'aria-labelledby': 'cem-' + x.rid + '-' + name + '-l', 'aria-describedby': err ? 'cem-' + x.rid + '-' + name + '-e' : undefined, style: { display: 'flex', flexWrap: 'wrap', gap: 8, outline: 'none' } },
      ['Asegurable', 'No asegurable'].map(function (o) { var on2 = val === o; return h('label', { key: o, style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: '2px solid ' + (on2 ? 'var(--color-brand)' : 'var(--border-default)'), borderRadius: 'var(--radius-sm)', background: on2 ? 'var(--color-brand-wash)' : '#FFFFFF', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)', cursor: dis ? 'default' : 'pointer' } },
        h('input', { type: 'radio', name: 'cem-' + x.rid + '-' + name, checked: on2, disabled: dis, onChange: function () { on(o); }, style: { width: 18, height: 18, accentColor: 'var(--color-brand)' } }), o); })); };

    var formN1 = function (x, edit) { var d = draftN1(x), c = C[x.rid], e = tried[x.rid] ? erroresN1(x, d, edit) : {}, id = 'cem-' + x.rid, f = form[x.rid] || {};
      var otros = eqs.filter(function (y) { return y.rid !== x.rid && !(datos[y.rid] || {}).n1; });
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' } },
        h('span', { id: id + '-resultado-l', style: lbl }, 'Resultado del equipo · nivel 1 *'), radios(x, 'resultado', d.resultado, function (o) { setF(x.rid, { resultado: o }); }, e.resultado), errT(id + '-resultado-e', e.resultado),
        d.resultado === 'No asegurable' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-motivoNo', style: lbl }, 'Motivo *'), h('textarea', { id: id + '-motivoNo', rows: 2, value: d.motivoNo, 'aria-invalid': e.motivoNo ? 'true' : undefined, 'aria-describedby': e.motivoNo ? id + '-motivoNo-e' : undefined, onChange: function (ev) { setF(x.rid, { motivoNo: ev.target.value }); }, style: ta }), errT(id + '-motivoNo-e', e.motivoNo)) : null,
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-obs', style: lbl }, 'Observación del equipo'), h('textarea', { id: id + '-obs', rows: 2, value: d.obs, onChange: function (ev) { setF(x.rid, { obs: ev.target.value }); }, style: ta })),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
          h('label', { title: c.oblig ? 'Derivación obligatoria a Suscripción: ' + c.oblig.regla + ' (' + c.oblig.pct + ')' : undefined, style: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-strong)', cursor: c.oblig ? 'not-allowed' : 'pointer' } },
            h('input', { type: 'checkbox', id: id + '-derivar', checked: d.derivar, 'aria-disabled': c.oblig ? 'true' : undefined, 'aria-describedby': c.oblig ? id + '-oblig' : undefined, onChange: function () { if (c.oblig) return; setF(x.rid, { derivar: !f.derivar }); }, style: { width: 18, height: 18, accentColor: 'var(--color-brand)' } }), 'Requerir evaluación de suscripción'),
          c.oblig ? h('span', { id: id + '-oblig', style: { fontSize: 13, color: 'var(--text-body)' } }, 'Derivación obligatoria a Suscripción: ' + c.oblig.regla + ' (' + c.oblig.pct + '). El Suscriptor tiene la última palabra.') : null,
          d.derivar && !c.oblig ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-motivoDer', style: lbl }, 'Por qué requiere suscripción *'), h('textarea', { id: id + '-motivoDer', rows: 2, value: d.motivoDer, 'aria-invalid': e.motivoDer ? 'true' : undefined, 'aria-describedby': e.motivoDer ? id + '-motivoDer-e' : undefined, onChange: function (ev) { setF(x.rid, { motivoDer: ev.target.value }); }, style: ta }), errT(id + '-motivoDer-e', e.motivoDer)) : null),
        edit ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-motivoCambio', style: lbl }, 'Motivo del cambio *'), h('textarea', { id: id + '-motivoCambio', rows: 2, value: d.motivoCambio, 'aria-invalid': e.motivoCambio ? 'true' : undefined, 'aria-describedby': e.motivoCambio ? id + '-motivoCambio-e' : undefined, onChange: function (ev) { setF(x.rid, { motivoCambio: ev.target.value }); }, style: ta }), errT(id + '-motivoCambio-e', e.motivoCambio)) : null,
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, B('primary', edit ? 'Guardar cambios' : 'Grabar calificación', function () { grabarN1(x, edit); }, { 'aria-label': (edit ? 'Guardar cambios · ' : 'Grabar calificación · ') + x.label }),
          edit ? B('ghost', 'Cancelar', function () { setF(x.rid, { editando: false }); }) : B('secondary', 'Aplicar a otros equipos', function () { if (!d.resultado || !otros.length) return; setApl({ desde: x.rid, sel: otros.map(function (y) { return y.rid; }) }); }, !d.resultado ? { unavailableReason: 'Elige primero el resultado de este equipo' } : !otros.length ? { unavailableReason: 'No quedan otros equipos por calificar' } : { 'aria-label': 'Aplicar a otros equipos el resultado de ' + x.label }))); };

    var aplicar = function () { var x = eqs.find(function (y) { return y.rid === apl.desde; }), d = draftN1(x), e = erroresN1(x, d, false); if (Object.keys(e).length) { setApl(null); setTried(function (t) { var o = Object.assign({}, t); o[x.rid] = true; return o; }); return; }
      var rids = [x.rid].concat(apl.sel); act({ tipo: 'n1', rids: rids, desde: x.rid, datos: Object.assign({}, d, { derivacion: d.obligatoria ? 'obligatoria' : d.derivar ? 'manual' : '', motivoDerivacion: d.obligatoria ? 'Derivación obligatoria a Suscripción: ' + C[x.rid].oblig.regla + ' (' + C[x.rid].oblig.pct + ')' : d.motivoDer.trim() }),
        porEquipo: rids.reduce(function (o, r) { var cc = C[r]; o[r] = cc.oblig ? { derivar: true, derivacion: 'obligatoria', motivoDerivacion: 'Derivación obligatoria a Suscripción: ' + cc.oblig.regla + ' (' + cc.oblig.pct + ')' } : r === x.rid ? {} : { derivar: d.derivar && !d.obligatoria, derivacion: d.derivar && !d.obligatoria ? 'manual' : '', motivoDerivacion: d.derivar && !d.obligatoria ? d.motivoDer.trim() : '' }; return o; }, {}) });
      setApl(null); };
    var aplPanel = function () { if (!apl) return null; var x = eqs.find(function (y) { return y.rid === apl.desde; }), d = draftN1(x), otros = eqs.filter(function (y) { return y.rid !== x.rid && !(datos[y.rid] || {}).n1; });
      return h('div', { role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'cem-apl-t', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1.5px solid var(--color-brand)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', boxShadow: 'var(--shadow-md)' } },
        h('strong', { id: 'cem-apl-t', style: { fontSize: 16, color: 'var(--text-strong)' } }, 'Aplicar a otros equipos · ' + d.resultado),
        h('span', { style: muted }, 'Se aplica el resultado y la observación de ' + x.label + '. Cada equipo conserva su derivación: si su suma asegurada supera el umbral, va a Suscripción igual.'),
        h('ul', { style: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 } }, otros.map(function (y) { var on = apl.sel.indexOf(y.rid) >= 0, cc = C[y.rid];
          return h('li', { key: y.rid }, h('label', { style: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-strong)', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: on, onChange: function () { setApl(Object.assign({}, apl, { sel: on ? apl.sel.filter(function (z) { return z !== y.rid; }) : apl.sel.concat(y.rid) })); }, style: { width: 18, height: 18, accentColor: 'var(--color-brand)' } }),
            h('span', null, h('strong', null, y.label), ' · ' + y.detalle + (cc.oblig ? ' · derivación obligatoria a Suscripción' : '')))); })),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, B('primary', 'Aplicar a ' + (apl.sel.length + 1) + ' equipos', aplicar, apl.sel.length ? {} : { unavailableReason: 'Elige al menos un equipo' }), B('ghost', 'Cancelar', function () { setApl(null); }))); };

    var resumenN1 = function (x, n1) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' } },
      h('span', { style: lbl }, 'Nivel 1 · Ejecutivo de inspecciones'),
      h('span', { style: { fontSize: 15, fontWeight: 700, color: n1.resultado === 'Asegurable' ? 'var(--color-success)' : 'var(--color-danger)' } }, n1.resultado + (n1.resultado === 'No asegurable' && n1.motivoNo ? ' · ' + n1.motivoNo : '')),
      n1.obs ? h('span', { style: { fontSize: 14, color: 'var(--text-body)' } }, n1.obs) : null,
      h('span', { style: muted }, 'Origen del veredicto: ' + origenN1(n1)),
      n1.derivar ? h('span', { style: { fontSize: 13, color: 'var(--text-body)' } }, h('strong', null, n1.derivacion === 'obligatoria' ? 'Derivación obligatoria a Suscripción' : 'Requirió evaluación de suscripción'), n1.derivacion === 'obligatoria' ? ' · ' + n1.motivoDerivacion.replace(/^Derivación obligatoria a Suscripción: /, '') : ' · ' + n1.motivoDerivacion) : null,
      n1.motivoCambio ? h('span', { style: muted }, 'Motivo del cambio: ' + n1.motivoCambio) : null); };
    var formN2 = function (x) { var f = form[x.rid] || {}, id = 'cem-' + x.rid, res = f.n2res || '', obs = f.n2obs || '', e = tried['n2' + x.rid] ? { resultado: res ? '' : 'Elige el dictamen del equipo', obs: obs.trim().length < 10 ? 'Escribe el fundamento del dictamen (al menos 10 caracteres)' : '' } : {};
      var grabar = function () { if (!res || obs.trim().length < 10) { setTried(function (t) { var o = Object.assign({}, t); o['n2' + x.rid] = true; return o; }); setTimeout(function () { var el = document.getElementById(!res ? id + '-n2res' : id + '-n2obs'); if (el) el.focus(); }, 30); return; } act({ tipo: 'n2', rid: x.rid, datos: { resultado: res, obs: obs.trim() } }); };
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' } },
        h('span', { id: id + '-n2res-l', style: lbl }, 'Dictamen de suscripción · nivel 2 (resultado final) *'), radios(x, 'n2res', res, function (o) { setF(x.rid, { n2res: o }); }, e.resultado), errT(id + '-n2res-e', e.resultado),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id + '-n2obs', style: lbl }, 'Fundamento y condiciones *'), h('textarea', { id: id + '-n2obs', rows: 3, value: obs, 'aria-invalid': e.obs ? 'true' : undefined, 'aria-describedby': e.obs ? id + '-n2obs-e' : undefined, onChange: function (ev) { setF(x.rid, { n2obs: ev.target.value }); }, style: ta }), errT(id + '-n2obs-e', e.obs)),
        h('div', null, B('primary', 'Grabar dictamen', grabar, { 'aria-label': 'Grabar dictamen · ' + x.label }))); };

    var card = function (x) { var d = datos[x.rid] || {}, c = C[x.rid], est = estadoDe(d, c.oblig), f = form[x.rid] || {};
      var pend1 = !d.n1, susc = d.n1 && d.n1.derivar && !d.n2;
      var puedeAj = (props.puedeN1 && !d.n2 && !(d.n1 && d.n1.derivar)) || (props.puedeN2 && susc), whyAj = d.n2 ? 'El equipo ya tiene dictamen final' : susc && !props.puedeN2 ? 'El equipo está en suscripción: ajusta el VRN el Suscriptor' : props.motivoNo || 'Tu rol no califica este equipo';
      var cuerpo;
      if (props.puedeN1 && (pend1 || f.editando) && !d.n2 && !(d.n1 && d.n1.derivar && !f.editando)) cuerpo = formN1(x, !!f.editando);
      else { var partes = []; if (d.n1) partes.push(resumenN1(x, d.n1));
        if (d.n2) partes.push(h('div', { key: 'n2', style: { display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' } }, h('span', { style: lbl }, 'Nivel 2 · Suscripción (resultado final)'), h('span', { style: { fontSize: 15, fontWeight: 700, color: d.n2.resultado === 'Asegurable' ? 'var(--color-success)' : 'var(--color-danger)' } }, d.n2.resultado), h('span', { style: { fontSize: 14, color: 'var(--text-body)' } }, d.n2.obs), h('span', { style: muted }, 'Origen del veredicto: ' + origenN2(d.n2))));
        else if (susc && props.puedeN2) partes.push(h('div', { key: 'f2' }, formN2(x)));
        else if (susc) partes.push(h('p', { key: 'p', style: Object.assign({ margin: 0 }, muted) }, 'Pendiente del dictamen del Suscriptor: tiene la última palabra sobre este equipo.'));
        else if (!d.n1) partes.push(h('p', { key: 'p', style: Object.assign({ margin: 0, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }, muted) }, props.puedeN2 ? 'Pendiente del nivel 1 (Ejecutivo de inspecciones).' + (c.oblig ? ' Llegará a Suscripción por derivación obligatoria.' : '') : props.motivoNo || 'Solo lectura.'));
        if (d.n1 && props.puedeN1 && !d.n2 && !d.n1.derivar) partes.push(h('div', { key: 'ed' }, B('ghost', 'Editar calificación', function () { setF(x.rid, { editando: true, resultado: d.n1.resultado, motivoNo: d.n1.motivoNo, obs: d.n1.obs, derivar: d.n1.derivar && d.n1.derivacion === 'manual', motivoDer: d.n1.derivacion === 'manual' ? d.n1.motivoDerivacion : '', motivoCambio: '' }); }, { 'aria-label': 'Editar calificación · ' + x.label })));
        cuerpo = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, partes); }
      return h('section', { key: x.rid, id: 'cem-' + x.rid, tabIndex: -1, 'aria-labelledby': 'cem-' + x.rid + '-h', style: { display: 'flex', flexDirection: 'column', gap: 14, padding: '18px 20px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', outline: 'none', minWidth: 0 } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px 16px' } },
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 } }, h('h3', { id: 'cem-' + x.rid + '-h', style: { margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' } }, x.label), h('span', { style: muted }, x.detalle + ' · ' + x.rid)),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } }, c.oblig && !d.n2 ? Badge('warning', 'Derivación obligatoria a Suscripción') : null, Badge(est.tone, est.label), B('ghost', 'Ver informe', function () { if (props.onVerInforme) props.onVerInforme(x.rid); }, { 'aria-label': 'Ver informe · ' + x.label }))),
        llego(x), valores(x, d, puedeAj, whyAj), hallazgos(x), cuerpo, apl && apl.desde === x.rid ? aplPanel() : null); };

    // ---------- seguimientos sugeridos ----------
    var SUG = ((Q().calificacion || {}).seguimientosSugeridos) || [], HD = Q().hallazgos || [];
    var sugeridos = SUG.map(function (s) { var en = eqs.filter(function (x) { return C[x.rid].hall.some(function (y) { return y.id === s.hallazgo; }); }); return { s: s, en: en, h: HD.find(function (y) { return y.id === s.hallazgo; }) }; }).filter(function (z) { return z.en.length; });
    var puedeSeg = props.puedeN1 || props.puedeN2;
    var segItem = function (z) { var id = z.s.hallazgo, dsc = seg[id], fe = segF[id], hid = 'cem-seg-' + id, nombres = z.en.map(function (x) { return x.label; });
      var origen = 'Sugerido por SIRIUS desde el hallazgo «' + ((C[z.en[0].rid].hall.find(function (y) { return y.id === id; }) || {}).texto || id) + '» en ' + (nombres.length > 1 ? nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1] : nombres[0]);
      var estTxt = !dsc ? null : dsc.estado === 'Descartado' ? ['Descartado', 'neutral'] : dsc.texto !== z.s.texto ? ['Aceptado con cambios', 'success'] : ['Aceptado', 'success'];
      var acciones = !puedeSeg ? null : fe ? (function () { var eT = fe.modo === 'editar' && fe.texto.trim().length < 5 ? 'Escribe el seguimiento' : '', eM = fe.modo === 'descartar' && String(fe.motivo || '').trim().length < 10 ? 'Escribe el motivo (al menos 10 caracteres)' : '';
          var ok = function () { if (eT || eM) { setSegF(function (o) { var y = Object.assign({}, o); y[id] = Object.assign({}, fe, { try: true }); return y; }); var el = document.getElementById(hid + '-' + (fe.modo === 'editar' ? 't' : 'm')); if (el) el.focus(); return; }
            act({ tipo: 'seg', id: id, estado: fe.modo === 'editar' ? 'Aceptado' : 'Descartado', texto: fe.modo === 'editar' ? fe.texto.trim() : z.s.texto, original: z.s.texto, motivo: fe.modo === 'descartar' ? fe.motivo.trim() : '', equipos: z.en.map(function (x) { return x.rid; }), tipoSeg: z.s.tipo });
            setSegF(function (o) { var y = Object.assign({}, o); delete y[id]; return y; }); };
          return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' } },
            fe.modo === 'editar' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: hid + '-t', style: lbl }, 'Seguimiento *'), h('input', { id: hid + '-t', type: 'text', value: fe.texto, 'aria-invalid': fe.try && eT ? 'true' : undefined, onChange: function (e) { var t = e.target.value; setSegF(function (o) { var y = Object.assign({}, o); y[id] = Object.assign({}, fe, { texto: t }); return y; }); }, style: inp }), fe.try ? errT(hid + '-te', eT) : null)
              : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: hid + '-m', style: lbl }, 'Motivo del descarte *'), h('textarea', { id: hid + '-m', rows: 2, value: fe.motivo || '', 'aria-invalid': fe.try && eM ? 'true' : undefined, 'aria-describedby': fe.try && eM ? hid + '-me' : undefined, onChange: function (e) { var t = e.target.value; setSegF(function (o) { var y = Object.assign({}, o); y[id] = Object.assign({}, fe, { motivo: t }); return y; }); }, style: ta }), fe.try ? errT(hid + '-me', eM) : null),
            h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, B('primary', fe.modo === 'editar' ? 'Aceptar con cambios' : 'Descartar', ok), B('ghost', 'Cancelar', function () { setSegF(function (o) { var y = Object.assign({}, o); delete y[id]; return y; }); }))); })()
        : dsc ? h('div', null, B('ghost', 'Revisar de nuevo', function () { act({ tipo: 'seg', id: id, estado: null }); }, { 'aria-label': 'Revisar de nuevo · ' + z.s.texto }))
        : h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }, B('secondary', 'Aceptar', function () { act({ tipo: 'seg', id: id, estado: 'Aceptado', texto: z.s.texto, original: z.s.texto, motivo: '', equipos: z.en.map(function (x) { return x.rid; }), tipoSeg: z.s.tipo }); }, { 'aria-label': 'Aceptar · ' + z.s.texto }),
            B('ghost', 'Editar', function () { setSegF(function (o) { var y = Object.assign({}, o); y[id] = { modo: 'editar', texto: z.s.texto }; return y; }); }, { 'aria-label': 'Editar · ' + z.s.texto }),
            B('ghost', 'Descartar', function () { setSegF(function (o) { var y = Object.assign({}, o); y[id] = { modo: 'descartar', motivo: '' }; return y; }); }, { 'aria-label': 'Descartar · ' + z.s.texto }));
      return h('li', { key: id, style: { display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 0', borderTop: '1px solid var(--border-subtle)' } },
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
          h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, minWidth: 0 } }, Badge(TIPO_TONO[z.s.tipo] || 'neutral', z.s.tipo), h('strong', { style: { fontSize: 15, color: dsc && dsc.estado === 'Descartado' ? 'var(--text-muted)' : 'var(--text-strong)', textDecoration: dsc && dsc.estado === 'Descartado' ? 'line-through' : 'none' } }, dsc && dsc.estado !== 'Descartado' ? dsc.texto : z.s.texto)),
          estTxt ? Badge(estTxt[1], estTxt[0]) : Badge('warning', 'Sugerido')),
        h('span', { style: { fontSize: 13, color: 'var(--text-body)' } }, 'Equipos: ' + nombres.join(', ')),
        h('span', { style: muted }, 'Origen: ' + origen + (dsc ? ' · ' + (dsc.estado === 'Descartado' ? 'descartado' : dsc.texto !== z.s.texto ? 'aceptado con cambios' : 'aceptado') + ' por ' + dsc.by + ' · ' + dsc.at + (dsc.motivo ? ' · Motivo: ' + dsc.motivo : '') + (dsc.texto !== z.s.texto && dsc.estado !== 'Descartado' ? ' · Texto sugerido: ' + z.s.texto : '') : '')),
        acciones); };
    var nDec = sugeridos.filter(function (z) { return seg[z.s.hallazgo]; }).length;
    var segSec = h('section', { ref: refSeg, tabIndex: -1, 'aria-labelledby': 'cem-seg-t', style: { display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 20px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', outline: 'none' } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 } }, h('h3', { id: 'cem-seg-t', style: { margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' } }, 'Seguimientos del caso · sugeridos desde los hallazgos'), h('span', { style: muted }, nDec + ' de ' + sugeridos.length + ' revisados')),
      h('span', { style: Object.assign({ marginBottom: 6 }, muted) }, puedeSeg ? 'Una persona acepta, edita o descarta cada sugerencia; solo los aceptados pasan a Garantías y Documentos del caso.' : 'Solo lectura: los revisa quien califica.'),
      sugeridos.length ? h('ul', { style: { margin: 0, padding: 0, listStyle: 'none' } }, sugeridos.map(segItem)) : h('p', { style: Object.assign({ margin: 0 }, muted) }, 'Los hallazgos de los equipos no sugieren seguimientos.'));

    // ---------- cabecera ----------
    var nFin = eqs.filter(function (x) { return estadoDe(datos[x.rid], C[x.rid].oblig).k === 'final'; }).length, nSus = eqs.filter(function (x) { return estadoDe(datos[x.rid], C[x.rid].oblig).k === 'susc'; }).length;
    var N = (Q().calificacion || {}).niveles || {};
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 } },
      h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px 16px' } },
        h('h2', { id: 'cem-title', tabIndex: -1, style: { margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-strong)', outline: 'none' } }, 'Calificación por equipo'),
        h('span', { role: 'status', style: { fontSize: 14, color: 'var(--text-body)' } }, nFin + ' de ' + eqs.length + ' con resultado final' + (nSus ? ' · ' + nSus + ' en suscripción' : ''))),
      h('span', { style: muted }, 'Nivel 1: ' + (N.nivel1 || 'Ejecutivo de inspecciones') + ' · Nivel 2: ' + (N.nivel2 || 'Suscriptor') + ', que tiene la última palabra en los equipos derivados.' + (props.motivoNo && !props.puedeN1 && !props.puedeN2 ? ' ' + props.motivoNo : '')),
      eqs.map(card), segSec);
  }
  SiriusCalifEquipos.estadoDe = estadoDe; SiriusCalifEquipos.calc = calc; SiriusCalifEquipos.origenN1 = origenN1; SiriusCalifEquipos.origenN2 = origenN2;
  window.SiriusCalifEquipos = SiriusCalifEquipos;
})();
