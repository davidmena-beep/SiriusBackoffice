// SIRIUS · Liquidación de honorarios (etapa 11 · DEC-136; etapa 11-b · DEC-138). Una liquidación por proveedor y periodo, armada con
// los honorarios Aprobados (o acordados en subasta) que calcula SiriusHonorarios; septiembre sale del historial de
// SIRIUS_LIQUIDACIONES. La factura puede agrupar varias liquidaciones aprobadas del mismo proveedor y debe sumar exactamente su
// total; Finanzas la valida o la devuelve con motivo («Factura devuelta»). Todo en memoria: vuelve a los archivos al recargar.
(function () {
  var L = { ctx: { ahora: function () { return new Date(2026, 9, 18, 20, 30); }, usuario: function () { return 'Mónica Ríos'; } }, version: 0 };
  var oy = [], clon = function (o) { return JSON.parse(JSON.stringify(o)); }, pad = function (n) { return String(n).padStart(2, '0'); };
  var D = function () { return window.SIRIUS_LIQUIDACIONES || null; }, HN = function () { return window.SiriusHonorarios || null; };
  var CP = function () { return window.SIRIUS_COMPANIA || null; };
  L.ov = {}; L.facturas = {}; L.nf = 0;
  L.on = function (f) { oy.push(f); return function () { oy = oy.filter(function (x) { return x !== f; }); }; };
  function avisar() { L.version++; oy.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  L.avisar = avisar;
  L.reset = function () { L.ov = {}; L.facturas = {}; L.nf = 0; avisar(); };
  L.r2 = function (n) { return Math.round((n + 1e-9) * 100) / 100; };
  L.usd = function (n) { if (n == null) return 'Por definir'; return window.SIRIUS_COMPANIA.formatoMonto(n); };
  L.ahoraIso = function () { var d = L.ctx.ahora(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  L.periodoTxt = function (p) { var m = +p.slice(5, 7); return MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1) + ' de ' + p.slice(0, 4); };
  L.finPeriodo = function (p) { var y = +p.slice(0, 4), m = +p.slice(5, 7), d = new Date(y, m, 0); return p + '-' + pad(d.getDate()) + 'T23:59'; };
  L.estadoInfo = function (e) { return ((D() || {}).estados || []).find(function (x) { return x.id === e; }) || { id: e, badge: 'neutral' }; };
  L.ORDEN = ['Abierta', 'Por aprobar', 'Aprobada', 'Facturada', 'Enviada a pago', 'Pagada'];
  var ENTRAN = ['Aprobado', 'Acordado en subasta', 'Facturado', 'Pagado'];
  function codigo(p) { if (p.agencia) return p.agencia.slice(0, 3).toUpperCase(); var w = p.nombre.split(' '); return (w[0].charAt(0) + (w[1] || '').slice(0, 2)).toUpperCase(); }
  // ---------- IVA: tasa vigente en la fecha de la factura (o, sin factura, del cierre del periodo); la configuración vive en SIRIUS_COMPANIA ----------
  L.fechaIva = function (periodo, f) { return f && f.fecha ? String(f.fecha).slice(0, 10) : L.finPeriodo(periodo).slice(0, 10); };
  L.tasaIva = function (fechaIso) { var c = CP(), t = c ? c.tasa('iva', fechaIso) : null; return t == null ? 0 : t; };
  L.ivaDe = function (sub, tasa) { return L.r2(sub * tasa / 100); };
  // Total de varias liquidaciones si se facturaran en `fecha` (el IVA de la factura manda): sirve para validar el valor de la factura.
  L.totalEn = function (xs, fecha) { var t = L.tasaIva(fecha); return L.r2(xs.reduce(function (s, x) { return s + (x.calculada ? x.subtotal + L.ivaDe(x.subtotal, t) : x.total); }, 0)); };
  // ---------- Cálculo: honorarios aprobados por proveedor y periodo ----------
  L.calcular = function () { var Hn = HN(), todos = Hn ? Hn.lista() : [], grupos = {};
    todos.forEach(function (x) { var per = String(x.fecha).slice(0, 7), k = per + '|' + x.proveedor.nombre; var g = grupos[k] || (grupos[k] = { periodo: per, proveedor: x.proveedor, hon: [], pend: [] }); (ENTRAN.indexOf(x.estado) >= 0 ? g.hon : g.pend).push(x); });
    return Object.keys(grupos).filter(function (k) { return grupos[k].hon.length; }).sort().map(function (k) { var g = grupos[k], id = 'LIQ-' + g.periodo + '-' + codigo(g.proveedor), ov = L.ov[id] || {}, lov = ov.lineas || {};
      var lineas = g.hon.sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; }).map(function (x) { var o = lov[x.id] || {}, valor = x.valor, aj = [];
        if (o.ajuste) { aj.push({ texto: 'Ajuste de Finanzas: ' + o.ajuste.motivo, valor: o.ajuste.monto }); valor = L.r2(valor + o.ajuste.monto); }
        var ret = o.retenida ? o.retenida : x.estadoCaso === 'Devuelto al inspector' ? { motivo: 'Informe devuelto para corregir (se paga al corregirlo)', auto: true } : null;
        return { id: x.id, caso: x.caso, riesgoTxt: x.desc, fecha: x.fecha, modalidad: x.modalidad, modelo: x.calculo.modelo, inspector: x.inspector, honorario: x.valor, ajustes: aj, ajuste: L.r2(valor - x.valor), valor: valor, retenida: ret, bloqueado: x.estado === 'Acordado en subasta', estadoHon: x.estado, porDefinir: x.calculo.porDefinir }; });
      var sub = L.r2(lineas.filter(function (l) { return !l.retenida; }).reduce(function (s, l) { return s + l.valor; }, 0));
      var estado = ov.estado || (L.finPeriodo(g.periodo) < L.ahoraIso() ? 'Por aprobar' : 'Abierta'), f = ov.factura ? L.facturas[ov.factura] || null : null;
      var fijo = ov.ivaFijo || null, fechaIva = fijo ? fijo.fecha : L.fechaIva(g.periodo, f), tasaIva = fijo ? fijo.tasa : L.tasaIva(fechaIva), iva = L.ivaDe(sub, tasaIva);
      return { id: id, proveedor: g.proveedor.nombre, agencia: g.proveedor.agencia || null, inspectores: g.hon.map(function (x) { return x.inspector; }).filter(function (v, i, a) { return a.indexOf(v) === i; }), periodo: g.periodo, lineas: lineas, pendientes: g.pend.map(function (x) { return { id: x.id, caso: x.caso, estado: x.estado, valor: x.valor }; }), nLineas: lineas.length, retenidas: lineas.filter(function (l) { return l.retenida; }).length, subtotal: sub, iva: iva, ivaTasa: tasaIva, ivaFecha: fechaIva, ivaCongelado: !!fijo, total: L.r2(sub + iva), estado: estado, factura: f, historial: ov.historial || [], calculada: true, pagada: ov.pagada || null, ejemplo: !!ov.ejemplo }; });
  };
  L.lista = function () { var h = ((D() || {}).historial || []).map(function (x) { var ov = L.ov[x.id] || {}; return Object.assign({}, x, { nLineas: x.lineas, lineas: null, pendientes: [], estado: ov.estado || x.estado, factura: x.factura ? { numero: x.factura, estado: 'Validada', valor: x.total, liqs: [x.id] } : null, historial: (ov.historial || []).concat(x.pagada ? [{ fecha: x.pagada + 'T00:00', por: 'Sistema contable (CNX-12)', que: 'Pagada' }] : x.enviada ? [{ fecha: x.enviada + 'T00:00', por: 'Finanzas', que: 'Enviada a pago' }] : []), calculada: false, pagada: x.pagada || ov.pagada || null }); });
    return h.concat(L.calcular()); };
  L.liq = function (id) { return L.lista().find(function (x) { return x.id === id; }) || null; };
  function ov(id) { return L.ov[id] || (L.ov[id] = { historial: [], lineas: {} }); }
  function hist(id, que, motivo, por) { ov(id).historial.unshift({ fecha: L.ahoraIso(), por: por || L.ctx.usuario(), que: que, motivo: motivo || '' }); }
  L.hist = hist;
  // ---------- Acciones de Finanzas ----------
  L.cerrar = function (id, por) { var x = L.liq(id); if (!x || x.estado !== 'Abierta') return false; ov(id).estado = 'Por aprobar'; hist(id, 'Cerró el periodo antes del corte (solo en el prototipo): pasa a «Por aprobar»', '', por); avisar(); return true; };
  L.aprobar = function (id, por) { var x = L.liq(id); if (!x || x.estado !== 'Por aprobar') return false; ov(id).estado = 'Aprobada'; hist(id, 'Aprobó la liquidación por ' + L.usd(x.total) + ' (' + x.nLineas + ' honorarios, ' + x.retenidas + ' retenidos)', '', por); avisar(); return true; };
  L.retener = function (id, lid, motivo, por) { var o = ov(id); o.lineas[lid] = Object.assign({}, o.lineas[lid], { retenida: { motivo: motivo } }); hist(id, 'Retuvo el honorario ' + lid, motivo, por); avisar(); };
  L.liberar = function (id, lid, motivo, por) { var o = ov(id), l = Object.assign({}, o.lineas[lid]); delete l.retenida; o.lineas[lid] = l; hist(id, 'Liberó el honorario ' + lid, motivo, por); avisar(); };
  L.ajustar = function (id, lid, monto, motivo, por) { var o = ov(id); o.lineas[lid] = Object.assign({}, o.lineas[lid], { ajuste: { monto: L.r2(monto), motivo: motivo } }); hist(id, 'Ajustó el honorario ' + lid + ' en ' + L.usd(monto), motivo, por); avisar(); };
  // ---------- Factura (una o varias liquidaciones aprobadas del mismo proveedor; debe sumar exacto) ----------
  L.facturables = function (proveedor) { return L.lista().filter(function (x) { return x.proveedor === proveedor && (x.estado === 'Aprobada' && !x.factura || x.estado === 'Factura devuelta'); }); };
  L.difFactura = function (total, valor) { var d = L.r2(valor - total); if (!d) return null; return 'La factura suma ' + L.usd(valor) + ' y el total de las liquidaciones elegidas es ' + L.usd(total) + ': ' + (d > 0 ? 'sobran ' : 'faltan ') + L.usd(Math.abs(d)) + '. No se envía; corrige el valor o la selección.'; };
  // porFinanzas: Finanzas la carga en nombre del proveedor; la liquidación sigue «Factura devuelta» hasta que el proveedor la confirme.
  L.cargarFactura = function (ids, f, por, porFinanzas) { var xs = ids.map(L.liq).filter(Boolean); if (!xs.length) return { error: 'Elige al menos una liquidación.' };
    if (xs.some(function (x) { return x.proveedor !== xs[0].proveedor; })) return { error: 'Una factura solo agrupa liquidaciones del mismo proveedor.' };
    var tot = L.totalEn(xs, f.fecha), dif = L.difFactura(tot, f.valor); if (dif) return { error: dif };
    var fid = 'FAC-' + (++L.nf), conf = porFinanzas && xs.some(function (x) { return x.estado === 'Factura devuelta'; });
    L.facturas[fid] = { id: fid, numero: f.numero, fecha: f.fecha, valor: L.r2(f.valor), archivo: f.archivo, estado: conf ? 'Por confirmar del proveedor' : 'Por validar', liqs: ids.slice(), por: por, porFinanzas: !!porFinanzas };
    xs.forEach(function (x) { var o = ov(x.id); o.factura = fid; if (!conf && o.estado === 'Factura devuelta') o.estado = 'Aprobada'; hist(x.id, (porFinanzas ? 'Finanzas cargó la factura ' : 'Cargó la factura ') + f.numero + ' por ' + L.usd(f.valor) + (ids.length > 1 ? ' (agrupa ' + ids.length + ' liquidaciones)' : '') + (conf ? '; espera la confirmación del proveedor' : ''), '', por); });
    avisar(); return { ok: true, factura: fid }; };
  L.confirmarFactura = function (fid, por) { var F = L.facturas[fid]; if (!F || F.estado !== 'Por confirmar del proveedor') return false; F.estado = 'Por validar'; F.liqs.forEach(function (id) { ov(id).estado = 'Aprobada'; hist(id, 'El proveedor confirmó la factura ' + F.numero + ' cargada por Finanzas', '', por); }); avisar(); return true; };
  L.validarFactura = function (fid, por) { var F = L.facturas[fid]; if (!F || F.estado !== 'Por validar') return false; F.estado = 'Validada'; F.liqs.forEach(function (id) { var x0 = L.liq(id); if (x0 && x0.calculada) ov(id).ivaFijo = { tasa: x0.ivaTasa, fecha: x0.ivaFecha }; ov(id).estado = 'Facturada'; hist(id, 'Validó la factura ' + F.numero + ': coincide con el total; pasa a «Facturada»', '', por); }); avisar(); return true; };
  L.devolverFactura = function (fid, motivo, por) { var F = L.facturas[fid]; if (!F) return false; F.estado = 'Devuelta'; F.motivo = motivo; F.liqs.forEach(function (id) { var o = ov(id); o.estado = 'Factura devuelta'; o.factura = null; o.devuelta = { numero: F.numero, motivo: motivo, por: por || L.ctx.usuario(), fecha: L.ahoraIso() }; hist(id, 'Devolvió la factura ' + F.numero + ' al proveedor', motivo, por); }); avisar(); return true; };
  L.devuelta = function (id) { return (L.ov[id] || {}).devuelta || null; };
  L.enviarPago = function (id, por) { var x = L.liq(id); if (!x || x.estado !== 'Facturada') return false; var o = ov(id); o.estado = 'Enviada a pago'; o.envio = 'CNX12-' + id.slice(4) + '-' + String(L.version).padStart(3, '0'); hist(id, 'Envió a pago al sistema contable (CNX-12, simulado): recibido con el comprobante ' + o.envio, '', por); avisar(); return true; };
  L.registrarPago = function (id, por) { var x = L.liq(id); if (!x || x.estado !== 'Enviada a pago') return false; var o = ov(id); o.estado = 'Pagada'; o.pagada = L.ahoraIso().slice(0, 10); hist(id, 'El sistema contable confirmó el pago (CNX-12, simulado)', '', por || 'Sistema contable (CNX-12)'); avisar(); return true; };
  window.SiriusLiquidaciones = L;
})();
