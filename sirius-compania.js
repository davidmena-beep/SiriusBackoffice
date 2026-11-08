// SIRIUS · Configuración general de la compañía (etapa 11-c · DEC-139). Lógica en memoria sobre SIRIUS_COMPANIA: nombre, país, zona
// horaria, idioma, moneda (cambiar NO convierte valores) e IVA con vigencias (una nueva cierra la anterior; sin huecos ni cruces).
// Vuelve a los archivos al recargar. Los demás módulos leen siempre SIRIUS_COMPANIA (formatoMonto, tasa), nunca copias.
(function () {
  var C = window.SIRIUS_COMPANIA; if (!C) return;
  var S = { version: 0, hist: [] }, oy = [], clon = function (o) { return JSON.parse(JSON.stringify(o)); }, pad = function (n) { return String(n).padStart(2, '0'); };
  var BASE = { nombre: C.nombre, pais: C.pais, zonaHoraria: C.zonaHoraria, idioma: C.idioma, moneda: clon(C.moneda), iva: clon(C.impuestos.find(function (i) { return i.id === 'iva'; }).vigencias) };
  S.ctx = { ahora: function () { return window.SIRIUS_EJEMPLO && SIRIUS_EJEMPLO.ahora ? SIRIUS_EJEMPLO.ahora() : new Date(2026, 9, 18, 20, 30); }, usuario: function () { return 'Mónica Ríos'; } };
  S.PAISES = [{ id: 'Ecuador', zona: 'America/Guayaquil', idioma: 'es-EC' }, { id: 'Colombia', zona: 'America/Bogota', idioma: 'es-CO' }, { id: 'Perú', zona: 'America/Lima', idioma: 'es-PE' }, { id: 'España', zona: 'Europe/Madrid', idioma: 'es-ES' }];
  S.ZONAS = [{ id: 'America/Guayaquil', nombre: 'Ecuador continental (UTC−5)' }, { id: 'Pacific/Galapagos', nombre: 'Galápagos (UTC−6)' }, { id: 'America/Bogota', nombre: 'Colombia (UTC−5)' }, { id: 'America/Lima', nombre: 'Perú (UTC−5)' }, { id: 'Europe/Madrid', nombre: 'España peninsular (UTC+1/+2)' }];
  S.IDIOMAS = [{ id: 'es-EC', nombre: 'Español (Ecuador)' }, { id: 'es-CO', nombre: 'Español (Colombia)' }, { id: 'es-PE', nombre: 'Español (Perú)' }, { id: 'es-ES', nombre: 'Español (España)' }, { id: 'en-US', nombre: 'Inglés (Estados Unidos)' }];
  S.on = function (f) { oy.push(f); return function () { oy = oy.filter(function (x) { return x !== f; }); }; };
  function avisar() { S.version++; oy.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  S.avisar = avisar;
  S.ahoraIso = function () { var d = S.ctx.ahora(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  S.hoyIso = function () { return S.ahoraIso().slice(0, 10); };
  S.reset = function () { C.nombre = BASE.nombre; C.pais = BASE.pais; C.zonaHoraria = BASE.zonaHoraria; C.idioma = BASE.idioma; C.moneda = clon(BASE.moneda); C.impuestos.find(function (i) { return i.id === 'iva'; }).vigencias = clon(BASE.iva); S.hist = []; avisar(); };
  S.hist = [];
  function reg(que, motivo, extra) { S.hist.unshift(Object.assign({ fecha: S.ahoraIso(), por: S.ctx.usuario(), que: que, motivo: motivo || '' }, extra || {})); }
  S.historial = function (area) { return S.hist.filter(function (h) { return !area || h.area === area; }); };
  S.fmt = function (n, o) { return C.formatoMonto(n, o); };
  // ---------- Compañía ----------
  S.guardarCompania = function (c, motivo, por) { var cambios = []; ['nombre', 'pais', 'zonaHoraria', 'idioma'].forEach(function (k) { if (c[k] != null && c[k] !== C[k]) { cambios.push(k + ': ' + C[k] + ' → ' + c[k]); C[k] = c[k]; } });
    if (!cambios.length) return false; reg('Compañía: ' + cambios.join(' · '), motivo, { area: 'compania', por: por || S.ctx.usuario() }); avisar(); return true; };
  // ---------- Moneda ----------
  S.monedaInfo = function (cod) { return C.monedasDisponibles.find(function (m) { return m.codigo === cod; }) || null; };
  S.vista = function (cod, n) { var m = S.monedaInfo(cod), a = C.moneda, antes = Object.assign({}, a); if (!m) return '—'; C.moneda = Object.assign({}, a, { codigo: m.codigo, simbolo: m.simbolo, nombre: m.nombre, decimales: m.decimales }); var t = C.formatoMonto(n == null ? 1234.5 : n); C.moneda = antes; return t; };
  S.impactoMoneda = function (cod) { var H = window.SiriusHonorarios, L = window.SiriusLiquidaciones, m = S.monedaInfo(cod), cant = {}, tot = 0, lq = 0, lqv = 0;
    var tars = H ? H.tars.length : 0, tv = H ? H.tars.filter(function (t) { return t.estado === 'Vigente'; }).length : 0;
    var hons = H ? H.lista().filter(function (x) { return ['Pagado'].indexOf(x.estado) < 0; }) : [];
    var liqs = L ? L.lista().filter(function (x) { return x.estado !== 'Pagada'; }) : [];
    liqs.forEach(function (x) { lq++; lqv += x.total || 0; });
    hons.forEach(function (x) { tot += x.valor || 0; });
    var ejemplo = S.vista(cod, 1234.5);
    return { codigo: cod, nombre: m ? m.nombre : cod, decimales: m ? m.decimales : null, tarifarios: tars, tarifariosVigentes: tv, honorariosAbiertos: hons.length, honorariosValor: Math.round(tot * 100) / 100, liquidacionesSinPagar: lq, liquidacionesValor: Math.round(lqv * 100) / 100,
      antes: C.formatoMonto(1234.5), despues: ejemplo, texto: 'Los valores guardados NO se convierten: ' + tars + ' tarifarios, ' + hons.length + ' honorarios sin pagar y ' + lq + ' liquidaciones sin pagar conservarán sus números y se mostrarán con el formato de ' + (m ? m.nombre : cod) + (m && m.decimales === 0 ? ' (sin decimales: los céntimos se redondean solo al mostrar)' : '') + '.' }; };
  S.cambiarMoneda = function (cod, motivo, por) { var m = S.monedaInfo(cod); if (!m || cod === C.moneda.codigo || !String(motivo || '').trim()) return false; var imp = S.impactoMoneda(cod), prev = C.moneda.codigo;
    C.moneda = Object.assign({}, C.moneda, { codigo: m.codigo, simbolo: m.simbolo, nombre: m.nombre, decimales: m.decimales });
    reg('Moneda: ' + prev + ' → ' + cod + ' (sin convertir valores)', motivo, { area: 'moneda', por: por || S.ctx.usuario(), impacto: imp.texto }); avisar(); return true; };
  // ---------- Impuestos (IVA con vigencias) ----------
  S.iva = function () { return C.impuestos.find(function (i) { return i.id === 'iva'; }); };
  S.vigencias = function () { return S.iva().vigencias.slice().sort(function (a, b) { return a.desde < b.desde ? -1 : 1; }); };
  S.diaAntes = function (iso) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  S.validarVigencia = function (tasa, desde) { var v = S.vigencias(), ult = v[v.length - 1];
    if (tasa == null || isNaN(tasa) || tasa < 0 || tasa > 100) return 'La tasa debe estar entre 0 y 100 %.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(desde || '')) return 'Indica desde qué fecha rige.';
    if (ult && desde <= ult.desde) return 'Debe empezar después del ' + S.fechaTxt(ult.desde) + ' (inicio de la vigencia actual); no se permiten cruces.';
    if (ult && ult.hasta && desde <= ult.hasta) return 'Cruza la vigencia anterior, que termina el ' + S.fechaTxt(ult.hasta) + '.';
    if (ult && ult.hasta && desde > S.diaSig(ult.hasta)) return 'Dejaría un hueco: la anterior termina el ' + S.fechaTxt(ult.hasta) + '.';
    return ''; };
  S.diaSig = function (iso) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  S.fechaTxt = function (iso) { return iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : 'sin fin'; };
  S.tasaEn = function (fecha) { return C.tasa('iva', fecha); };
  // Impacto de una vigencia nueva sobre las liquidaciones abiertas (no facturadas): simula con la tasa que regiría en su fecha base.
  S.impactoIva = function (tasa, desde) { var L = window.SiriusLiquidaciones, v = S.vigencias(), ant = v.slice(), prev = S.iva().vigencias; if (!L) return { liquidaciones: 0, antes: 0, despues: 0, diferencia: 0 };
    var calc = function () { return L.lista().filter(function (x) { return x.calculada && ['Abierta', 'Por aprobar', 'Aprobada'].indexOf(x.estado) >= 0 && !x.factura; }); };
    var a = calc(), antes = a.reduce(function (s, x) { return s + x.total; }, 0);
    var u = ant[ant.length - 1], tmp = ant.map(function (x) { return Object.assign({}, x); }); if (u) tmp[tmp.length - 1].hasta = S.diaAntes(desde); tmp.push({ tasa: tasa, desde: desde, hasta: null, nota: 'Simulada' });
    S.iva().vigencias = tmp; var b = calc(), despues = b.reduce(function (s, x) { return s + x.total; }, 0); S.iva().vigencias = prev;
    return { liquidaciones: a.length, antes: Math.round(antes * 100) / 100, despues: Math.round(despues * 100) / 100, diferencia: Math.round((despues - antes) * 100) / 100 }; };
  S.agregarVigencia = function (tasa, desde, nota, motivo, por) { var err = S.validarVigencia(tasa, desde); if (err || !String(motivo || '').trim()) return err || 'Falta el motivo.';
    var imp = S.impactoIva(tasa, desde), v = S.iva().vigencias, ult = S.vigencias().slice(-1)[0], prevTxt = ult ? ult.tasa + ' %' : '—';
    if (ult) ult.hasta = S.diaAntes(desde); v.push({ tasa: tasa, desde: desde, hasta: null, nota: nota || '' });
    reg('IVA: ' + prevTxt + ' → ' + tasa + ' % desde el ' + S.fechaTxt(desde) + ' (cierra la anterior el ' + S.fechaTxt(ult && ult.hasta) + ')', motivo, { area: 'impuestos', por: por || S.ctx.usuario(), impacto: imp.liquidaciones + ' liquidaciones abiertas: ' + C.formatoMonto(imp.diferencia) + ' de diferencia en el total' }); avisar(); return ''; };
  window.SiriusCompania = S;
})();
