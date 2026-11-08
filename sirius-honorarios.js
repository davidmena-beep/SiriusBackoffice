// SIRIUS · Calculadora de honorarios y flujo del honorario (etapa 11-b · DEC-137 y DEC-138). Lee SIRIUS_HONORARIOS (modelo por
// grupo, roles y valor por hora, tramos de equipos, movilización, tiempos de referencia, nivel por riesgo, tarifarios y estados)
// y, para Vehículos, la tarifa fija de SIRIUS_LIQUIDACIONES. Los informes enviados los entrega el Back-office (ctx.informes): con
// ellos calcula un honorario por informe y guarda en memoria su flujo (propuesta, validación de la agencia, aprobación,
// devolución), con historial. Al recargar o cambiar de escena vuelve a los archivos.
(function () {
  var H = { ctx: { informes: function () { return []; }, ahora: function () { return new Date(2026, 9, 18, 20, 30); }, usuario: function () { return ''; } }, version: 0, st: {}, extra: [], tarHist: [] };
  var oy = [], pad = function (n) { return String(n).padStart(2, '0'); }, clon = function (o) { return JSON.parse(JSON.stringify(o)); };
  var D = function () { return window.SIRIUS_HONORARIOS || null; };
  var LQ = function () { return window.SIRIUS_LIQUIDACIONES || {}; };
  H.on = function (f) { oy.push(f); return function () { oy = oy.filter(function (x) { return x !== f; }); }; };
  function avisar() { H.version++; oy.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  H.avisar = avisar;
  H.r2 = function (n) { return Math.round((n + 1e-9) * 100) / 100; };
  H.usd = function (n) { if (n == null) return 'Por definir'; return window.SIRIUS_COMPANIA.formatoMonto(n); };
  H.horas = function (h) { if (h == null) return '—'; var m = Math.round(h * 60); return Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : ''); };
  H.ahoraIso = function () { var d = H.ctx.ahora(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  H.estadoInfo = function (e) { var d = D() || {}; return (d.estados || []).find(function (x) { return x.id === e; }) || (d.liquidacion && d.liquidacion.estadoNuevo && d.liquidacion.estadoNuevo.id === e ? d.liquidacion.estadoNuevo : null) || { id: e, badge: 'neutral' }; };
  // ---------- Tarifarios como mapa plano (lo que un contrato no define sale del general) ----------
  H.CAMPOS = [];
  function general0() { var d = D(), g = {}; if (!d) return g; d.roles.forEach(function (r) { g['rol.' + r.id] = r.valorHora; });
    d.equipos.tramos.forEach(function (t, i) { g['eq.' + i] = t.valor; g['eqHasta.' + i] = t.hasta; }); g.eqAplicacion = d.equipos.aplicacion;
    d.movilizacion.forEach(function (m) { g['mov.' + m.id] = m.valor; }); d.tiempo.referencia.forEach(function (r) { g['ref.' + r.nivel + '.v'] = r.visitaH; g['ref.' + r.nivel + '.r'] = r.redaccionH; });
    (LQ().tarifas || []).forEach(function (t) { if (t.grupo === 'Vehículos') g['veh.' + t.modalidad] = t.valor; }); var tr = (LQ().ajustes || []).find(function (x) { return x.id === 'traslado'; }), mu = tr && /USD\s*(\d+(?:[.,]\d+)?)/.exec(tr.regla); g.movVeh = mu ? parseFloat(mu[1].replace(',', '.')) : null; g.nivelMaximo = null; g.validacionAgencia = false; return g; }
  // Nombres de los cambios del archivo (redaccion, vehiculosPresencial, nivelMaximo) en el mapa plano.
  var ALIAS = { redaccion: 'rol.redaccion', vehiculosPresencial: 'veh.Presencial', vehiculosVirtual: 'veh.Virtual guiada', nivelMaximo: 'nivelMaximo' };
  function tars0() { return ((D() || {}).tarifarios || []).map(function (t) { var c = {}; Object.keys(t.cambios || {}).forEach(function (k) { c[ALIAS[k] || k] = t.cambios[k]; }); if (t.validacionAgencia) c.validacionAgencia = true; if (t.liquida) { c['liq.momento'] = t.liquida.momento; c['liq.quien'] = t.liquida.quien; if (t.liquida.nota) c['liq.nota'] = t.liquida.nota; } return Object.assign(clon(t), { mapa: t.id === 'TAR-GEN-2025' ? Object.assign(general0(), c) : c, historial: [] }); }); }
  H.tars = tars0();
  H.reset = function () { H.tars = tars0(); H.st = {}; H.extra = []; H.tarHist = []; avisar(); };
  H.general = function () { return H.tars.find(function (t) { return t.aplicaA === 'Todos'; }); };
  H.tarifario = function (id) { return H.tars.find(function (t) { return t.id === id; }) || null; };
  H.contratoDe = function (inspector, agencia) { return H.tars.find(function (t) { return t.estado === 'Vigente' && t.aplicaA && t.aplicaA.inspector === inspector; }) || (agencia ? H.tars.find(function (t) { return t.estado === 'Vigente' && t.aplicaA && t.aplicaA.agencia === agencia; }) : null) || null; };
  H.efectivo = function (inspector, agencia, tars) { tars = tars || H.tars; var g = tars.find(function (t) { return t.aplicaA === 'Todos'; }), c = tars.find(function (t) { return t.estado === 'Vigente' && t.aplicaA && t.aplicaA.inspector === inspector; }) || (agencia ? tars.find(function (t) { return t.estado === 'Vigente' && t.aplicaA && t.aplicaA.agencia === agencia; }) : null);
    return { mapa: Object.assign({}, g.mapa, c ? c.mapa : {}), contrato: c || null, general: g }; };
  // ---------- Piezas del cálculo ----------
  H.equiposValor = function (n, m) { var tr = [0, 1, 2].filter(function (i) { return ('eq.' + i) in m; }).map(function (i) { return { hasta: m['eqHasta.' + i], valor: m['eq.' + i] }; });
    if (!n) return { valor: 0, texto: 'Sin equipos en el informe' };
    if (m.eqAplicacion === 'tramoTotal') { var t = tr.find(function (x) { return x.hasta == null || n <= x.hasta; }); return { valor: H.r2(n * t.valor), texto: n + ' equipos × ' + H.usd(t.valor) + ' (tramo alcanzado)' }; }
    var rest = n, prev = 0, v = 0, partes = []; tr.forEach(function (x) { if (rest <= 0) return; var cap = x.hasta == null ? rest : Math.min(rest, x.hasta - prev); if (cap > 0) { v += cap * x.valor; partes.push(cap + ' × ' + H.usd(x.valor)); rest -= cap; } prev = x.hasta == null ? prev : x.hasta; });
    return { valor: H.r2(v), texto: n + ' equipos: ' + partes.join(' + ') + ' (escalonado)' }; };
  // Porcentaje de un ajuste de Vehículos leído de su regla en SIRIUS_LIQUIDACIONES.ajustes («70 % de la tarifa»).
  H.pctAjuste = function (id) { var a = (LQ().ajustes || []).find(function (x) { return x.id === id; }), m = a && /(\d+(?:[.,]\d+)?)\s*%/.exec(a.regla); return m ? parseFloat(m[1].replace(',', '.')) : null; };
  H.redondeo = function (min) { return Math.ceil(min / 30) / 2; }; // al medio hora superior, en horas
  // Tiempo efectivo de la visita: de la primera a la última evidencia, sin pausas de más de 20 min.
  H.tiempoVisita = function (horas) { var t = (horas || []).map(function (h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; }).sort(function (a, b) { return a - b; }); if (t.length < 2) return null;
    var pausas = [], min = 0; for (var i = 1; i < t.length; i++) { var d = t[i] - t[i - 1]; if (d > 20) pausas.push({ desde: t[i - 1], hasta: t[i], min: d }); else min += d; }
    var hm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }; return { min: min, desde: hm(t[0]), hasta: hm(t[t.length - 1]), pausas: pausas.map(function (p) { return { texto: hm(p.desde) + '–' + hm(p.hasta), min: p.min }; }) }; };
  H.nivelSugerido = function (texto) { var d = D(); if (!d) return 'basico'; var s = String(texto || '').toLowerCase(), hit = function (n) { var r = d.nivelPorRiesgo.find(function (x) { return x.nivel === n; }); return r && r.si.toLowerCase().split(/[,()]/).some(function (w) { w = w.trim().replace(/^(industria|institución|riesgo) /, ''); var st = w.slice(0, 7); return st.length > 3 && s.indexOf(st) >= 0; }); };
    return hit('n2') ? 'n2' : hit('n1') ? 'n1' : 'basico'; };
  H.recomendar = function (medidoMin, refH) { var lo = refH * 0.5, hi = refH * 1.5; if (medidoMin == null) return { h: refH, revisar: false, origen: 'sin medición registrada: referencia ' + H.horas(refH) };
    var r = H.redondeo(medidoMin); if (r < lo) return { h: lo, revisar: true, origen: 'medido ' + H.horas(medidoMin / 60) + ' → bajo el 50 % de la referencia: se recomienda ' + H.horas(lo) + ' · Revisar tiempo' };
    if (r > hi) return { h: hi, revisar: true, origen: 'medido ' + H.horas(medidoMin / 60) + ' → sobre el 150 % de la referencia: se recomienda ' + H.horas(hi) + ' · Revisar tiempo' };
    return { h: r, revisar: false, origen: 'medido ' + H.horas(medidoMin / 60) + ' → ' + H.horas(r) }; };
  // ---------- Cálculo de un informe ----------
  // inf: { id, caso, inspector, agencia, proveedor, grupo, ramo, sucursal, ciudad, fecha, modalidad, riesgos:[{id,label}], horasEvid:[], ocupacion, equipos, redaccionMin, hijo, fallida }
  // Etapa 8a: modelo por ramo → composición → grupo (SIRIUS_FLUJO.resolver); sin SIRIUS_FLUJO, por grupo.
  H.modeloDe = function (inf, d) { d = d || D(); var F = window.SIRIUS_FLUJO, r = F && F.resolver ? F.resolver({ ramo: inf.ramo }, d.modeloPorRamo, d.modeloPorComposicion, d.modeloPorGrupo) : null;
    return (r && r.valor) || (d.modeloPorRamo || {})[inf.ramo] || (d.modeloPorGrupo || {})[inf.grupo] || 'tarifaFija'; };
  H.calcular = function (inf, tars) { var d = D(), ef = H.efectivo(inf.inspector, inf.agencia, tars), m = ef.mapa, modelo = H.modeloDe(inf, d), L = [], disp = window.SiriusAgenda ? window.SiriusAgenda.disp(inf.inspector) : null;
    var base = disp && disp.ciudadBase, fuera = !!(base && inf.ciudad && inf.ciudad !== base), tiempos = null;
    if (modelo === 'horaHombre') {
      var sug = H.nivelSugerido(inf.ocupacion), orden = ['basico', 'n1', 'n2'], nivel = sug; if (m.nivelMaximo && orden.indexOf(nivel) > orden.indexOf(m.nivelMaximo)) nivel = m.nivelMaximo;
      var rol = d.roles.find(function (r) { return r.id === nivel; }), tv = H.tiempoVisita(inf.horasEvid), rv = H.recomendar(tv ? tv.min : null, m['ref.' + nivel + '.v']), rr = H.recomendar(inf.redaccionMin, m['ref.' + nivel + '.r']);
      L.push({ id: 'rol', concepto: rol.nombre, cantidad: rv.h, unidad: 'h', unit: m['rol.' + nivel], valor: H.r2(rv.h * m['rol.' + nivel]), origen: (tv ? 'Visita ' + tv.desde + '–' + tv.hasta + (tv.pausas.length ? ' sin la pausa ' + tv.pausas.map(function (p) { return p.texto + ' (' + p.min + ' min)'; }).join(', ') : '') + ': ' : '') + rv.origen + ' × ' + H.usd(m['rol.' + nivel]) + ' / h', revisar: rv.revisar });
      var red = d.roles.find(function (r) { return r.id === 'redaccion'; });
      L.push({ id: 'red', concepto: red.nombre, cantidad: rr.h, unidad: 'h', unit: m['rol.redaccion'], valor: H.r2(rr.h * m['rol.redaccion']), origen: 'Edición del informe: ' + rr.origen + ' × ' + H.usd(m['rol.redaccion']) + ' / h', revisar: rr.revisar });
      if (inf.equipos) { var ev = H.equiposValor(inf.equipos, m); L.push({ id: 'eq', concepto: d.equipos.nombre, cantidad: inf.equipos, unidad: 'equipo', unit: null, valor: ev.valor, origen: ev.texto + ' · ' + (inf.equiposOrigen || 'equipos del informe') }); }
      var mv = fuera ? m['mov.fuera'] : m['mov.urbano']; L.push({ id: 'mov', concepto: 'Movilización', cantidad: 1, unidad: 'visita', unit: mv, valor: mv == null ? null : mv, origen: fuera ? inf.ciudad + ' está fuera de la ciudad base de ' + inf.inspector + ' (' + base + ')' + (mv == null ? ': por definir' : '') : 'Perímetro urbano de ' + (base || inf.ciudad) + ': incluido' });
      tiempos = { nivelSugerido: sug, nivel: nivel, nivelNota: nivel !== sug ? 'Limitado por el tarifario: solo factura como ' + rol.nombre : '', visita: tv, visitaRec: rv.h, visitaRef: m['ref.' + nivel + '.v'], redaccionMin: inf.redaccionMin, redaccionRec: rr.h, redaccionRef: m['ref.' + nivel + '.r'], revisar: rv.revisar || rr.revisar };
    } else {
      var tf = m['veh.' + inf.modalidad]; (inf.riesgos || []).forEach(function (r, i) { var v = tf == null ? null : tf, o = (ef.contrato && ef.contrato.mapa['veh.' + inf.modalidad] != null ? ef.contrato.nombre : 'Tarifario general') + ': ' + inf.modalidad + ' ' + H.usd(tf);
        var pg = H.pctAjuste('garantia'), pf = H.pctAjuste('fallida'); if (inf.hijo && v != null && pg != null) { v = H.r2(v * pg / 100); o += ' · inspección de garantías (' + pg + ' %)'; } if (inf.fallida && v != null && pf != null) { v = H.r2(v * pf / 100); o += ' · visita fallida (' + pf + ' %)'; }
        L.push({ id: 'r' + i, concepto: 'Inspección ' + (r.label || r.id), cantidad: 1, unidad: 'riesgo', unit: tf, valor: v, origen: o }); });
      if (fuera) L.push({ id: 'mov', concepto: 'Movilización', cantidad: 1, unidad: 'visita', unit: m.movVeh, valor: m.movVeh, origen: inf.ciudad + ' está fuera de la ciudad base de ' + inf.inspector + ' (' + base + '): ' + H.usd(m.movVeh) + ' por visita en Vehículos' });
    }
    var porDef = L.filter(function (l) { return l.valor == null; }), total = H.r2(L.filter(function (l) { return l.valor != null; }).reduce(function (s, l) { return s + l.valor; }, 0));
    return { modelo: modelo, tarifario: ef.contrato ? ef.contrato.id + ' (sobre el general)' : ef.general.id, lineas: L, total: total, porDefinir: porDef.map(function (l) { return l.concepto; }), tiempos: tiempos, validacionAgencia: !!m.validacionAgencia, liquida: { momento: m['liq.momento'] || 'alEnviarInforme', quien: m['liq.quien'] || 'Inspector', nota: m['liq.nota'] || '' } }; };
  // ---------- Honorarios y su flujo ----------
  var CALIF = ['Inspeccionado', 'Enviado a emisión', 'Emitida', 'No emitida'];
  H.lista = function () { var out = (H.ctx.informes() || []).map(function (inf) { var c = H.calcular(inf), s = H.st[inf.id] || {};
      var est = s.estado || (inf.subasta ? 'Acordado en subasta' : c.liquida.momento === 'posterior' ? 'Por liquidar' : c.validacionAgencia ? 'Por validar en la agencia' : CALIF.indexOf(inf.estadoCaso) >= 0 ? 'Aprobado' : 'Por aprobar');
      var prop = s.propuesta != null ? s.propuesta : c.total, final = s.final != null ? s.final : (s.ajusteAgencia != null ? s.ajusteAgencia : prop);
      if (inf.subasta) { prop = inf.subasta.valor; final = inf.subasta.valor; }
      var dif = c.total ? H.r2((prop - c.total) / c.total * 100) : 0;
      return Object.assign({}, inf, { calculo: c, estado: est, calculado: c.total, propuesta: prop, valor: final, difPct: dif, revisar: Math.abs(dif) > 20 || !!(c.tiempos && c.tiempos.revisar), motivo: s.motivo || '', despues: s.despues || null, liquidado: s.liquidado || null, historial: (s.historial || []).concat(inf.historialBase || []), devolucion: s.devolucion || null }); });
    return out.concat(H.extra.map(function (x) { return Object.assign({}, x); })); };
  H.hon = function (id) { return H.lista().find(function (x) { return x.id === id; }) || null; };
  function st(id) { return H.st[id] || (H.st[id] = { historial: [] }); }
  function hist(id, que, motivo, por) { st(id).historial.unshift({ fecha: H.ahoraIso(), por: por || H.ctx.usuario(), que: que, motivo: motivo || '' }); }
  H.UMBRAL = 20;
  H.proponer = function (id, valor, motivo, por) { var x = H.hon(id); if (!x) return; var s = st(id), v = valor == null ? x.calculado : H.r2(valor); s.propuesta = v; s.motivo = motivo || ''; var dif = x.calculado ? (v - x.calculado) / x.calculado * 100 : 0;
    hist(id, valor == null || v === x.calculado ? 'Aceptó la propuesta calculada por ' + H.usd(v) : 'Ajustó la propuesta: ' + H.usd(x.calculado) + ' → ' + H.usd(v) + (Math.abs(dif) > H.UMBRAL ? ' (diferencia de ' + Math.round(dif) + ' %: Revisar)' : ''), motivo, por);
    s.estado = x.calculo.validacionAgencia ? 'Por validar en la agencia' : 'Por aprobar'; delete s.devolucion; avisar(); };
  H.calculado = function (id) { var s = st(id); s.estado = 'Calculado'; delete s.propuesta; avisar(); };
  H.validarAgencia = function (id, valor, motivo, por) { var x = H.hon(id); if (!x) return; var s = st(id); if (valor != null && H.r2(valor) !== x.valor) { s.ajusteAgencia = H.r2(valor); hist(id, 'Finanzas de la agencia ajustó: ' + H.usd(x.valor) + ' → ' + H.usd(valor), motivo, por); } else hist(id, 'Finanzas de la agencia validó el honorario por ' + H.usd(x.valor), '', por); s.estado = 'Por aprobar'; avisar(); };
  H.aprobar = function (id, por, rol) { var x = H.hon(id); if (!x) return; var s = st(id); s.estado = 'Aprobado'; s.final = x.valor; hist(id, 'Aprobó el honorario por ' + H.usd(x.valor) + (rol ? ' (' + rol + ')' : ''), '', por); avisar(); };
  H.ajustar = function (id, valor, motivo, por) { var x = H.hon(id); if (!x) return; var s = st(id); s.final = H.r2(valor); hist(id, 'Ajustó el honorario: ' + H.usd(x.valor) + ' → ' + H.usd(valor), motivo, por); avisar(); };
  H.devolver = function (id, motivo, por) { var s = st(id); s.estado = 'Devuelto'; s.devolucion = { motivo: motivo, por: por || H.ctx.usuario(), fecha: H.ahoraIso() }; hist(id, 'Devolvió el honorario al inspector', motivo, por); avisar(); };
  // ---------- Liquidar después (tarifario con momento «Después»): el informe sale sin honorario y queda «Por liquidar» ----------
  // quien liquida (Inspector o Finanzas de agencia) lo hace uno a uno o en lote con la misma calculadora; si ajusta, pide motivo.
  H.porLiquidar = function (filtro) { return H.lista().filter(function (x) { return x.estado === 'Por liquidar' && (!filtro || filtro(x)); }); };
  H.liquidar = function (id, valor, motivo, por, quien) { var x = H.hon(id); if (!x || x.estado !== 'Por liquidar') return false; var s = st(id), v = valor == null ? x.calculado : H.r2(valor), dif = x.calculado ? (v - x.calculado) / x.calculado * 100 : 0;
    if (v !== x.calculado && !String(motivo || '').trim()) return false;
    s.propuesta = v; s.motivo = motivo || ''; s.liquidado = { por: por || H.ctx.usuario(), fecha: H.ahoraIso(), quien: quien || x.calculo.liquida.quien };
    hist(id, (v === x.calculado ? 'Liquidó el honorario con la calculadora por ' + H.usd(v) : 'Liquidó el honorario ajustado: ' + H.usd(x.calculado) + ' → ' + H.usd(v) + (Math.abs(dif) > H.UMBRAL ? ' (diferencia de ' + Math.round(dif) + ' %: Revisar)' : '')) + ' · ' + s.liquidado.quien, motivo, por);
    s.estado = s.liquidado.quien === 'Finanzas de agencia' ? 'Por aprobar' : x.calculo.validacionAgencia ? 'Por validar en la agencia' : 'Por aprobar'; avisar(); return true; };
  H.liquidarLote = function (ids, por, quien) { var n = 0; ids.forEach(function (id) { var x = H.hon(id); if (x && x.estado === 'Por liquidar') { var s = st(id), v = x.calculado; s.propuesta = v; s.motivo = ''; s.liquidado = { por: por || H.ctx.usuario(), fecha: H.ahoraIso(), quien: quien || x.calculo.liquida.quien, lote: ids.length };
      hist(id, 'Liquidó en lote (' + ids.length + (ids.length === 1 ? ' honorario' : ' honorarios') + ') con la calculadora por ' + H.usd(v) + ' · ' + s.liquidado.quien, '', por); s.estado = 'Por aprobar'; n++; } }); if (n) avisar(); return n; };
  // «Aprobar después»: el calificador califica el riesgo y deja el honorario «Por aprobar»; lo ve en su inicio y en Liquidaciones › Honorarios.
  H.aprobarDespues = function (id, por) { var x = H.hon(id); if (!x || x.estado !== 'Por aprobar') return false; var s = st(id); s.despues = { por: por || H.ctx.usuario(), fecha: H.ahoraIso() }; hist(id, 'Dejó el honorario «Por aprobar» para aprobarlo después (tiene ' + H.usd(x.valor) + ')', '', por); avisar(); return true; };
  // Facultad para aprobar: Finanzas y Administrador sin límite; el Ejecutivo de inspecciones solo si su ficha tiene «Puede aprobar honorarios», hasta su tope.
  H.facultad = function (rolBase, usuario) { var SU = window.SiriusUsuarios;
    if (rolBase === 'Finanzas' || rolBase === 'Administrador') return { texto: 'Sin límite', tope: null, activa: true };
    if (rolBase === 'Ejecutivo de inspecciones') { var f = SU && SU.facHonorarios ? SU.facHonorarios(usuario) : { activa: false, tope: null };
      return f.activa ? { texto: f.tope == null ? 'Tu ficha tiene la facultad activa, sin tope' : 'Tu ficha tiene la facultad activa, hasta ' + H.usd(f.tope) + ' por honorario', tope: f.tope, activa: true } : null; }
    return null; };
  // ---------- Tarifarios: guardar con motivo e impacto en los honorarios abiertos ----------
  var CERR = ['Aprobado', 'Facturado', 'Pagado', 'Acordado en subasta'];
  H.impacto = function (id, mapa) { var tars = clon(H.tars), t = tars.find(function (x) { return x.id === id; }); t.mapa = mapa; var a = 0, b = 0, filas = [];
    (H.ctx.informes() || []).forEach(function (inf) { var x = H.hon(inf.id); if (!x || CERR.indexOf(x.estado) >= 0) return; var c0 = H.calcular(inf).total, c1 = H.calcular(inf, tars).total; a += c0; b += c1; if (c0 !== c1) filas.push({ id: inf.id, caso: inf.caso, antes: c0, despues: c1 }); });
    return { antes: H.r2(a), despues: H.r2(b), dif: H.r2(b - a), filas: filas }; };
  H.guardarTarifario = function (id, mapa, motivo, por, cambios) { var t = H.tarifario(id), imp = H.impacto(id, mapa); t.mapa = mapa; t.version += 1; t.historial.unshift({ fecha: H.ahoraIso(), por: por || H.ctx.usuario(), que: 'Versión ' + t.version + ': ' + cambios.join('; '), motivo: motivo, impacto: imp.dif }); avisar(); return imp; };
  window.SiriusHonorarios = H;
})();
