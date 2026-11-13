// SIRIUS · conexión real de la prueba de concepto (fase P · P-6a) · reemplaza al archivo mínimo del artifact.
// Con una sesión iniciada en index.html, el back-office trabaja con la base de datos (Supabase); sin sesión, en modo demostración.
// Usa la API REST de Supabase directamente (sin bibliotecas) y respeta el contrato SIRIUS_CONEXION del artifact (Etapa P-6a).
// 11/11/2026 · Observación 9 (la v5 publicada volvía a la v4): lo publicado desde Administración (origen «Administración») manda siempre sobre el
// archivo de datos; SIRIUS_FORMULARIOS (Formularios) y SIRIUS_CATALOGOS (catálogos de SIRIUS_EJEMPLO) se aplican al leer la base y al publicar;
// SIRIUS_CONTROLES se vigila como las demás claves. Evento «sirius-configuracion» { clave } cada vez que cambia la configuración aplicada.
// 11/11/2026 · C2-16: cada evidencia trae id, estado, motivo y observación (SQL 22) para confirmar o excluir fotos desde el back-office.
// 11/11/2026 · DEC-198: cada control trae vistoEn y vistoPor (SQL 24); la acción «verControles» { caso, comentario } los marca como vistos.
// 12/11/2026 · P-6e-3: casos[].visitasBase = [{ n, modalidad, estado, inicio, fin, agendadoEn, origen, inspector, enlace: { tipo, estado, vence, url }, enlaces }] (todas las visitas de la base).
// 12/11/2026 · P-6e-2: informes[].responsable { tipo, agencia, usuario, regla, asignadoEn } (SQL 32); evidencias con tipoArchivo (foto, video, documento) y canal «Autoinspección».
// 12/11/2026 · P-6e: cada caso trae formularios[], carrocerias[], anios[] y sumaAsegurada (de sus riesgos) para elegir la plantilla y aplicar los criterios.
// 12/11/2026 · C2-21: casos con registrado (fecha de creación en la base) y visita { estado, inicio, fin, agendadoEn, origen, llegada… }; informes con plantillaClave y plantillaVersion (vacía si la app no envió un número, p. ej. «local»).
// 13/11/2026 · P-6f-0 · DEC-216: SIRIUS_FACULTADES (Niveles de calificación › Facultad del inspector, con tope en USD) se vigila sin archivo de datos y
// window.SIRIUS_FACULTADES toma la versión vigente de la base (SQL 35); al publicar desde Niveles se aplica en la sesión.
// 12/11/2026 · SIRIUS_CONEXION.calificaciones[caso] = [{ riesgo, nivel, veredicto, cobertura, resultado, observacion, por, rol, hora }] (de la más antigua a la más reciente).
(function () {
  var URLB = 'https://qdciqoxselwmudlycprq.supabase.co', KEY = 'sb_publishable_pUrNhusonmxflSItZlU0fQ_ohRpCrYW';
  var CLAVE = 'sb-qdciqoxselwmudlycprq-auth-token', INGRESO = 'index.html', SONDEO_MS = 20000;
  var sesion = null; try { sesion = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) {}
  if (!sesion || !sesion.access_token || /[?&]demo=on/.test(location.search)) { window.SIRIUS_CONEXION = { activo: false }; return; }

  // ---------- Configuración: la versión vigente de la base reemplaza a la del archivo de datos (si no es más antigua) ----------
  var CONFIG = null, ORIGEN = {}, ARCH = {}, MEZCLA = {};   // ORIGEN[clave] = { origen, version, creado } de la versión vigente en la base
  function esObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function mezclar(a, b) { if (!esObj(a) || !esObj(b)) return b === undefined ? a : b; var r = {}; Object.keys(a).forEach(function (k) { r[k] = a[k]; }); Object.keys(b).forEach(function (k) { r[k] = mezclar(a[k], b[k]); }); return r; }
  function num(v) { return String(v || '0').split('.').map(function (x) { return parseInt(x, 10) || 0; }); }
  function masNueva(a, b) { var x = num(a), y = num(b); for (var i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; }
  function deAdministracion(clave) { return !!(ORIGEN[clave] && ORIGEN[clave].origen === 'Administración'); }
  // Regla: lo publicado desde Administración manda siempre; lo cargado desde el prototipo (SQL de configuración) manda salvo que el archivo sea más nuevo.
  function aplicar(clave) { var f = ARCH[clave], d = CONFIG && CONFIG[clave];
    if (d && f && !deAdministracion(clave) && masNueva(f.version, d.version)) { console.warn('[SIRIUS] ' + clave + ': el archivo (v' + f.version + ') es más nuevo que la base (v' + d.version + '); se usa el archivo.'); MEZCLA[clave] = f; return; }
    if (d && f && deAdministracion(clave) && masNueva(f.version, d.version)) console.info('[SIRIUS] ' + clave + ': se usa lo publicado desde Administración (v' + d.version + ') aunque el archivo diga v' + f.version + '.');
    MEZCLA[clave] = d ? (f ? mezclar(f, d) : d) : f; }
  function vigilar(clave) { if (Object.getOwnPropertyDescriptor(window, clave)) return;
    Object.defineProperty(window, clave, { configurable: true, enumerable: true, get: function () { return MEZCLA[clave]; }, set: function (v) { ARCH[clave] = v; aplicar(clave); } }); }
  ['SIRIUS_COMPANIA','SIRIUS_CATALOGO_CIIU','SIRIUS_INFORMES_RG','SIRIUS_CATALOGOS_MAESTROS','SIRIUS_FLUJO','SIRIUS_FLUJO_MOTOR','SIRIUS_MONITOR','SIRIUS_SEGUIMIENTO',
   'SIRIUS_EQUIPOS','SIRIUS_SALIDA_RG','SIRIUS_SALIDA_VEH','SIRIUS_DOCUMENTOS_PDF','SIRIUS_INFORME_VEH','SIRIUS_CAMPOS','SIRIUS_USUARIOS','SIRIUS_NOTIFICACIONES','SIRIUS_CONFLICTOS',
   'SIRIUS_INICIO','SIRIUS_AGENDA','SIRIUS_LIQUIDACIONES','SIRIUS_HONORARIOS','SIRIUS_TARIFAS_CUENTAS','SIRIUS_MATRIZ_GARANTIAS','SIRIUS_DATOS_IA','SIRIUS_SILUETAS','SIRIUS_CAPTURA',
   'SIRIUS_AUTOINSPECCION','SIRIUS_PORTAL_CLIENTE','SIRIUS_APP_INSPECTOR','SIRIUS_CONTROLES','SIRIUS_DOCUMENTOS_CLIENTE','SIRIUS_COMPLETADO'].forEach(vigilar);   // P-6e-1: catálogo de documentos del cliente (DEC-203)
  // P-6f-0 · DEC-216: la facultad publicada en Niveles de calificación (SIRIUS_FACULTADES) no tiene archivo de datos propio: se registra sin archivo
  // para que, al leer la base y al publicar, window.SIRIUS_FACULTADES tome lo vigente (si la base no la tiene, queda indefinida y manda el ejemplo).
  vigilar('SIRIUS_FACULTADES'); if (!Object.prototype.hasOwnProperty.call(ARCH, 'SIRIUS_FACULTADES')) ARCH.SIRIUS_FACULTADES = undefined;
  // (SIRIUS_EJEMPLO y SIRIUS_MONITOR_EJEMPLO no se reemplazan: son datos de demostración; los casos salen de la base.
  //  Excepción: sus partes que publica Administración —plantillas (SIRIUS_FORMULARIOS) y catálogos (SIRIUS_CATALOGOS)— se aplican abajo.)

  // ---------- Configuración publicada que no vive en un archivo propio ----------
  function clon(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }
  function evento(clave) { try { window.dispatchEvent(new CustomEvent('sirius-configuracion', { detail: { clave: clave } })); } catch (e) {} }
  // SIRIUS_FORMULARIOS → window.SIRIUS_FORMULARIOS (lo lee Formularios) y SIRIUS_EJEMPLO.plantillas / plantillasVigentes (los leen el informe,
  // las evidencias y la capa de la app del back-office). Cada versión con pasos queda con su estado; los pasos conservan sus atributos del
  // prototipo (sec, guia, doc…) y toman de Formularios nombre, grupo, modalidades, guía, lecturas y fotos; la columna Presencial va en su orden.
  function aplicarFormularios(F) {
    if (!F || !Array.isArray(F.formularios)) return true; window.SIRIUS_FORMULARIOS = F;
    var E = window.SIRIUS_EJEMPLO; if (!E || !E.plantillas || typeof E.plantillaVigente !== 'function') return false;   // aún no cargan los datos: se reintenta
    var nombres = {}, claves = {};
    F.formularios.forEach(function (f) { (f.versions || []).forEach(function (v) {
      if (!Array.isArray(v.steps) || !v.steps.length || v.n == null) return;   // Ramos Generales y versiones sin pasos de foto: no aplica
      var k = f.name + ' v' + v.n, previa = E.plantillas[k] || Object.keys(E.plantillas).filter(function (x) { var t = E.plantillas[x]; return (t.nombre || '') === f.name && Number(t.version) < Number(v.n); })
        .sort(function (a, b) { return Number(E.plantillas[b].version) - Number(E.plantillas[a].version); }).map(function (x) { return E.plantillas[x]; })[0];
      var T = previa ? clon(previa) : { nombre: f.name, campos: {}, secciones: [], pasos: [] }, antes = {}; (T.pasos || []).forEach(function (p) { antes[p.id] = p; });
      var O = Array.isArray(v.ordenP) ? v.ordenP : null, pos = function (id) { var i = O ? O.indexOf(id) : -1; return i < 0 ? 1e6 : i; };
      var pasos = v.steps.map(function (s, i) { var p = Object.assign({}, antes[s.id] || { sec: [], doc: '', pd: false });
        ['id', 'group', 'name', 'req', 'min', 'max', 'rep', 'ex', 'link', 'guide', 'vis', 'ayuda'].forEach(function (a) { if (s[a] !== undefined) p[a] = clon(s[a]); });
        if (Array.isArray(s.feeds)) p.feedsX = s.feeds.slice(); p._i = i; return p; });
      if (O) pasos.sort(function (a, b) { return (pos(a.id) - pos(b.id)) || (a._i - b._i); });
      pasos.forEach(function (p) { delete p._i; });
      Object.assign(T, { nombre: f.name, version: v.n, estado: v.estado || 'Vigente', vigenteDesde: v.vigenteDesde || '', motivo: v.motivo || '', pasos: pasos, origen: 'Administración' });
      if (O) T.ordenPresencial = O.slice(); if (v.retiradaEl) T.retiradaEl = v.retiradaEl;
      E.plantillas[k] = T; nombres[f.name] = true; claves[k] = true; }); });
    // Formularios es la fuente de esas plantillas: una versión del prototipo que no viene en lo publicado deja de estar vigente.
    Object.keys(E.plantillas).forEach(function (k) { var t = E.plantillas[k]; if (nombres[t.nombre] && !claves[k] && t.estado === 'Vigente') t.estado = 'Retirada'; });
    E.plantillasVigentes = E.plantillasVigentes || {};
    Object.keys(nombres).forEach(function (n) { var k = E.plantillaVigente(n); if (k) E.plantillasVigentes[n] = k; else delete E.plantillasVigentes[n]; });
    return true; }
  // SIRIUS_CATALOGOS → SIRIUS_EJEMPLO.catalogos (Catálogos › Sucursales, Coberturas, Piezas, Tipos de daño…).
  function aplicarCatalogos(C) { var E = window.SIRIUS_EJEMPLO; if (!C || typeof C !== 'object') return true; if (!E) return false;
    E.catalogos = E.catalogos || {}; Object.keys(C).forEach(function (k) { E.catalogos[k] = clon(C[k]); }); return true; }
  var ESPECIALES = { SIRIUS_FORMULARIOS: aplicarFormularios, SIRIUS_CATALOGOS: aplicarCatalogos };
  function aplicarEspeciales(soloClave) { var pend = [];
    Object.keys(ESPECIALES).forEach(function (c) { if (soloClave && c !== soloClave) return; var d = CONFIG && CONFIG[c]; if (!d) return;
      if (ESPECIALES[c](d)) evento(c); else pend.push(c); });
    if (pend.length) { var n = 0, t = setInterval(function () { n++; pend = pend.filter(function (c) { if (ESPECIALES[c](CONFIG[c])) { evento(c); return false; } return true; });
      if (!pend.length || n > 200) { clearInterval(t); if (pend.length) console.warn('[SIRIUS] no se pudo aplicar ' + pend.join(', ') + ' (faltan los datos del prototipo).'); } }, 50); } }
  // Tras publicar con éxito, lo publicado pasa a ser la configuración vigente de esta sesión (al salir y volver a una pantalla se ve lo publicado).
  function publicado(carga) { if (!carga || !carga.clave || carga.datos == null) return; CONFIG = CONFIG || {};
    CONFIG[carga.clave] = clon(carga.datos); ORIGEN[carga.clave] = { origen: 'Administración', version: String(carga.version || ''), creado: new Date().toISOString() };
    if (Object.prototype.hasOwnProperty.call(ARCH, carga.clave)) { aplicar(carga.clave); evento(carga.clave); } else aplicarEspeciales(carga.clave); }

  // ---------- API REST ----------
  function cab() { return { apikey: KEY, Authorization: 'Bearer ' + sesion.access_token, 'Content-Type': 'application/json' }; }
  function renovar() { if (sesion.expires_at && sesion.expires_at * 1000 > Date.now() + 60000) return Promise.resolve();
    return fetch(URLB + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: sesion.refresh_token }) })
      .then(function (r) { if (!r.ok) throw new Error('sesion'); return r.json(); })
      .then(function (s) { sesion = Object.assign({}, sesion, s, { expires_at: Math.floor(Date.now() / 1000) + (s.expires_in || 3600) }); localStorage.setItem(CLAVE, JSON.stringify(sesion)); }); }
  function get(ruta) { return renovar().then(function () { return fetch(URLB + '/rest/v1/' + ruta, { headers: cab() }); }).then(function (r) { if (r.status === 401) throw new Error('sesion'); if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return r.json(); }); }
  function rpc(fn, args) { return renovar().then(function () { return fetch(URLB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: cab(), body: JSON.stringify(args || {}) }); }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return r.json(); }); }

  // ---------- Formas que espera el back-office ----------
  var p2 = function (n) { return String(n).padStart(2, '0'); };
  function reloj(iso) { if (!iso) return ''; var d = new Date(iso); return p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()); }
  // Fecha y hora con la zona de Ecuador (-05:00), para que el back-office no muestre la hora UTC.
  function isoLocal(iso) { if (!iso) return null; var d = new Date(iso); if (isNaN(d)) return null; var e = new Date(d.getTime() - 5 * 3600000);
    return e.toISOString().slice(0, 19) + '-05:00'; }
  function fechaIso(iso) { var d = new Date(iso); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  // Forma del prototipo. Los 14 casos de ejemplo toman como base su ficha del prototipo (riesgos, informe, ramos…) y la base manda en estado,
  // responsable, contacto e intentos; los casos nuevos se arman solo con la base. Con varios riesgos se arma «riesgos» con id (lo exige la Bandeja).
  function fichaEjemplo(id) { var E = window.SIRIUS_EJEMPLO; return E && Array.isArray(E.casos) ? E.casos.filter(function (x) { return String(x.id) === id; })[0] : null; }
  function aCaso(k, evs) {
    var id = String(k.numero), a = k.asegurado || {}, c = a.contacto || {}, d = k.datos || {}, rs = k.riesgos || [], r0 = rs[0] || { datos: {} },
        placas = rs.map(function (r) { return (r.datos || {}).placa; }).filter(Boolean), base = fichaEjemplo(id), resp = (k.responsable && k.responsable.nombre) || (k.visitas && k.visitas[0] && k.visitas[0].inspector && k.visitas[0].inspector.nombre) || '';
    var x = base ? JSON.parse(JSON.stringify(base)) : {};
    x.id = id; x.ramo = k.ramo; x.estado = k.estado; x.asegurado = a.nombre || x.asegurado || ''; x.ident = a.identificacion || x.ident || '';
    x.orden = d.orden || x.orden || ''; x.fecha = (k.creado ? fechaIso(k.creado) : '') || x.fecha; x.registrado = isoLocal(k.creado); x.responsable = resp || x.responsable || '';   // C2-21: la fecha del caso sale de la base (corregido 12/11: este comentario tapaba la asignación del responsable)
    x.comercial = d.comercial || x.comercial || ''; x.backoffice = d.backoffice || x.backoffice || ''; x.broker = d.broker || x.broker || 'Directo'; x.sucursal = d.sucursal || x.sucursal || '';
    x.origen = k.origen || x.origen || 'Manual'; x.contacto = c.nombre || x.contacto || ''; x.tel = c.celular || x.tel || ''; x.correo = c.correo || x.correo || '';
    x.nota = d.nota || k.subestado || x.nota || '';
    // P-6e · plantilla de cada riesgo (riesgos.datos.formulario, SQL 29) y su carrocería: Coordinación ofrece las modalidades de esa plantilla.
    x.formularios = rs.map(function (r) { return (r.datos || {}).formulario || ''; }); x.carrocerias = rs.map(function (r) { return (r.datos || {}).carroceria || ''; });
    x.sumaAsegurada = rs.reduce(function (t, r) { return t + (Number(r.suma_asegurada) || 0); }, 0) || x.sumaAsegurada; x.anios = rs.map(function (r) { return (r.datos || {}).anio || null; }); x.placas = rs.map(function (r) { return (r.datos || {}).placa || r.descripcion || ''; }); x.riesgosBase = rs.map(function (r) { return { descripcion: r.descripcion || '', composicion: r.composicion || '', suma: Number(r.suma_asegurada) || null, datos: r.datos || {} }; });   // detalle de la solicitud por riesgo (marca, modelo, versión, año, color, VIN, motor, clase, uso, extras)
    // C2-3 · inspector del caso (para la bandeja «Informes por completar» del Control de calidad) y plazo de 24 h hábiles
    var vi = (k.visitas || []).filter(function (v) { return v.inspector; })[0];
    if (vi) x.inspector = { nombre: vi.inspector.nombre, tipo: vi.inspector.tipo_inspector || '', agencia: vi.inspector.agencia ? vi.inspector.agencia.nombre : '' };
    if (k.sla_vence) x.vence = isoLocal(k.sla_vence);
    // C2-7 · solicitud (precargados) y visita (automáticos del informe)
    var dd0 = r0.datos || {}; x.solicitud = { marca: dd0.marca || '', modelo: dd0.modelo || '', anio: dd0.anio ? String(dd0.anio) : '', placa: dd0.placa || '' };
    var vv = (k.visitas || []).slice().sort(function (a, b) { return String(b.creado || '').localeCompare(String(a.creado || '')); })[0];
    // P-6e-3 · todas las visitas de la base con su enlace vigente de cada tipo (Coordinación: reenviar, generar nuevo, cancelar, reagendar)
    x.visitasBase = (k.visitas || []).slice().sort(function (a, b) { return String(a.creado || '').localeCompare(String(b.creado || '')); }).map(function (v, i) {
      var ens = (v.enlaces || []).filter(function (e) { return ['Vencido','Invalidado','Revocado'].indexOf(e.estado) < 0; }).map(function (e) {
        return { tipo: e.tipo || 'Autoagendamiento', estado: e.estado, vence: isoLocal(e.vence), url: (e.tipo === 'Autoinspección' ? 'https://davidmena-beep.github.io/autoinspecciones_v1/?t=' : 'https://davidmena-beep.github.io/Autoagendamiento/?t=') + e.token }; });
      return { n: i + 1, modalidad: v.modalidad || '', estado: v.estado || '', inicio: isoLocal(v.inicio), fin: isoLocal(v.fin), agendadoEn: isoLocal(v.agendado_en), origen: v.origen || '',
               inspector: v.inspector ? v.inspector.nombre : '', enlace: ens[0] || null, enlaces: ens }; });
    if (vv) x.visita = { estado: vv.estado || '', inicio: isoLocal(vv.inicio), fin: isoLocal(vv.fin), agendadoEn: isoLocal(vv.agendado_en), origen: vv.origen || '', llegada: isoLocal(vv.llegada && vv.llegada.hora), modalidad: vv.modalidad || '', quienRecibe: (vv.direccion && vv.direccion.quien) || '', inspector: vv.inspector ? vv.inspector.nombre : '' };
    if (!base) { x.placa = placas[0] || ''; x.bien = r0.descripcion || ''; if (placas.length > 1) x.placas = placas;
      if (rs.length > 1) x.riesgos = rs.map(function (r, i) { var dd = r.datos || {}; return { id: id + '-' + (r.composicion === 'Vehículo' ? 'V' : 'U') + (i + 1), label: dd.placa || r.descripcion || ('Riesgo ' + (i + 1)), detalle: r.descripcion || '', estado: k.estado, dir: dd.direccion || '', total: r.suma_asegurada || 0, cobertura: dd.cobertura || '', recMod: dd.modalidad || 'Presencial' }; }); }
    var ints = (evs || []).filter(function (e) { return e.accion === 'Intento de contacto'; }).map(function (e) { var p = (e.detalle || '').split(' · '); return { by: (e.actor && e.actor.nombre) || '', fecha: new Date(e.hora).toISOString().slice(0, 16), medio: p[0] || '', resultado: p[1] || '', obs: p.slice(2).join(' · ') }; });
    if (ints.length || !base) x.intentos = ints;
    return x;
  }
  function aEvento(e) { var actor = (e.actor && e.actor.nombre) || (e.actor_tipo === 'Cliente' ? 'Cliente' : e.actor_tipo === 'Sistema' ? 'SIRIUS' : e.actor_tipo || '');
    return { hora: reloj(e.hora), accion: e.accion, detalle: e.detalle || '', actor: actor, rol: e.rol || (e.actor_tipo === 'Cliente' ? 'Portal del cliente' : '') }; }

  // ---------- Contrato SIRIUS_CONEXION ----------
  // ---------- P-6b · evidencias (fotos reales con URL firmada), controles e informes ----------
  function firmar(rutas) { var reales = rutas.filter(function (r) { return r && r.indexOf('(') !== 0; }); if (!reales.length) return Promise.resolve({});
    return renovar().then(function () { return fetch(URLB + '/storage/v1/object/sign/evidencias', { method: 'POST', headers: cab(), body: JSON.stringify({ expiresIn: 3600, paths: reales }) }); })
      .then(function (r) { return r.ok ? r.json() : []; }).then(function (arr) { var m = {}; (arr || []).forEach(function (x) { if (x && x.path && x.signedURL) m[x.path] = URLB + '/storage/v1' + x.signedURL; }); return m; }).catch(function () { return {}; }); }
  var FIRMAS = {}, FIRMADO = 0;
  function cargarEvidencias(idPorCaso) {
    return Promise.all([
      get('evidencias?select=id,caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas,estado,motivo,observacion,tipo_archivo&order=hora').catch(function () { return get('evidencias?select=id,caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas,estado,motivo,observacion&order=hora'); }).catch(function () { return get('evidencias?select=id,caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas&order=hora'); }),   // estado: SQL 22
      get('controles?select=id,caso_id,tipo,severidad,detalle,estado,comentario,creado,visto_en,visto:usuarios!controles_visto_por_fkey(nombre,rol)&order=creado').catch(function () { return get('controles?select=id,caso_id,tipo,severidad,detalle,estado,comentario,creado&order=creado'); }),
      get('informes?select=riesgo_id,plantilla_clave,plantilla_version,respuestas,estado,determinacion,motivo,enviado_en,criterio,decision,responsable_tipo,responsable_regla,asignado_en,responsable_agencia:agencias!informes_responsable_agencia_id_fkey(nombre),responsable_usuario:usuarios!informes_responsable_usuario_id_fkey(nombre),riesgo:riesgos(caso_id,descripcion),enviado:usuarios!informes_enviado_por_fkey(nombre)')
        .catch(function () { return get('informes?select=riesgo_id,plantilla_clave,plantilla_version,respuestas,estado,determinacion,motivo,enviado_en,criterio,decision,riesgo:riesgos(caso_id,descripcion),enviado:usuarios!informes_enviado_por_fkey(nombre)'); }),   // responsable: SQL 32 (DEC-207)
      get('calificaciones?select=nivel,resultado,observacion,fecha,riesgo:riesgos(caso_id,descripcion),usuario:usuarios(nombre,rol)&order=fecha').catch(function () { return []; })
    ]).then(function (res) {
      var evs = res[0], ctr = res[1], inf = res[2], cal = res[3] || [], rutas = evs.map(function (e) { return e.ruta; }).filter(function (r) { return !FIRMAS[r]; });
      var refrescar = Date.now() - FIRMADO > 45 * 60000; if (refrescar) { FIRMAS = {}; rutas = evs.map(function (e) { return e.ruta; }); }
      return firmar(rutas).then(function (m) { Object.keys(m).forEach(function (k) { FIRMAS[k] = m[k]; }); if (refrescar) FIRMADO = Date.now();
        var E = {}, C = {}, I = {}, Q = {};
        // Calificaciones registradas en la base (nivel 0 = al completar el informe dentro de la facultad; 1 = Ejecutivo; 2 = Suscriptor).
        cal.forEach(function (q) { var id = q.riesgo && idPorCaso[q.riesgo.caso_id]; if (!id) return; var r = String(q.resultado || ''), i = r.indexOf(' · ');
          (Q[id] = Q[id] || []).push({ riesgo: q.riesgo.descripcion, nivel: q.nivel, veredicto: i < 0 ? r : r.slice(0, i), cobertura: i < 0 ? '' : r.slice(i + 3), resultado: r,
            observacion: q.observacion || '', por: q.usuario ? q.usuario.nombre : '', rol: q.usuario ? q.usuario.rol : '', hora: reloj(q.fecha) }); });
        evs.forEach(function (e) { var id = idPorCaso[e.caso_id]; if (!id) return; (E[id] = E[id] || []).push({ id: e.id, tipoArchivo: e.tipo_archivo || 'foto', estado: e.estado || undefined, motivo: e.motivo || '', observacion: e.observacion || '', paso: e.paso, url: FIRMAS[e.ruta] || null, prueba: !FIRMAS[e.ruta], hora: reloj(e.hora), canal: e.canal, validacion: e.validacion || '', gps: e.lat != null ? [e.lat, e.lng] : null, lecturas: e.lecturas || {} }); });
        ctr.forEach(function (c) { var id = idPorCaso[c.caso_id]; if (!id) return; (C[id] = C[id] || []).push({ id: c.id, tipo: c.tipo, severidad: c.severidad, detalle: c.detalle || {}, estado: c.estado, comentario: c.comentario || '', hora: reloj(c.creado), vistoEn: c.visto_en ? reloj(c.visto_en) : '', vistoPor: c.visto ? c.visto.nombre : '', vistoRol: c.visto ? c.visto.rol : '' }); });
        inf.forEach(function (x) { var id = x.riesgo && idPorCaso[x.riesgo.caso_id]; if (!id) return; (I[id] = I[id] || []).push({ riesgo: x.riesgo.descripcion, responsable: x.responsable_tipo ? { tipo: x.responsable_tipo, agencia: x.responsable_agencia ? x.responsable_agencia.nombre : '', usuario: x.responsable_usuario ? x.responsable_usuario.nombre : '', regla: x.responsable_regla || '', asignadoEn: isoLocal(x.asignado_en) } : null, plantilla: /^\d+(\.\d+)?$/.test(String(x.plantilla_version || '')) && x.plantilla_version !== '1' ? x.plantilla_clave + ' v' + x.plantilla_version : undefined, plantillaClave: x.plantilla_clave || '', plantillaVersion: /^\d+(\.\d+)?$/.test(String(x.plantilla_version || '')) ? String(x.plantilla_version) : '',  // sin versión real: el back-office muestra la vigente
 respuestas: x.respuestas || {}, estado: x.estado, determinacion: x.determinacion || '', motivo: x.motivo || '', enviadoPor: x.enviado ? x.enviado.nombre : '', enviadoEn: reloj(x.enviado_en), criterio: x.criterio || null, decision: x.decision || null }); });
        return { evidencias: E, controles: C, informes: I, calificaciones: Q }; }); }); }
  var oyentes = [], huella = '';
  var CX = window.SIRIUS_CONEXION = { activo: true, usuario: null, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {},
    suscribir: function (fn) { if (typeof fn === 'function') oyentes.push(fn); },
    // P-6c · las acciones se guardan en la base (función bo_accion) y luego se vuelve a leer y a dibujar.
    accion: function (tipo, datos) { return rpc('bo_accion', { p_tipo: tipo, p_datos: datos || {} }).then(function (r) { r = r || { ok: false, mensaje: 'Sin respuesta de la base' };
      if (tipo === 'publicarConfiguracion' && r.ok) { try { publicado(datos); } catch (e) { console.warn('[SIRIUS] configuración publicada:', e); } }
      return cargarCasos().then(function () { avisar(); return r; }, function () { return r; }); }).catch(function (e) { return { ok: false, mensaje: String(e.message || e).slice(0, 200) }; }); },
    cerrarSesion: function () { localStorage.removeItem(CLAVE); location.href = INGRESO; },
    // Diagnóstico en la consola: SIRIUS_CONEXION.configuracion() → clave, versión y origen de lo vigente en la base, y la plantilla vigente que se aplicó.
    configuracion: function () { var E = window.SIRIUS_EJEMPLO || {}; return { origen: clon(ORIGEN), plantillasVigentes: clon(E.plantillasVigentes || {}),
      formularios: window.SIRIUS_FORMULARIOS && window.SIRIUS_FORMULARIOS.vigentes ? clon(window.SIRIUS_FORMULARIOS.vigentes) : null }; } };
  // Aviso visible si la base no responde (para diagnosticar en la copia publicada sin abrir la consola).
  function aviso(txt) { try { var d = document.getElementById('sirius-aviso-conexion') || document.createElement('div'); d.id = 'sirius-aviso-conexion';
    d.setAttribute('role', 'alert'); d.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:560px;background:#fdecea;color:#b42318;border:1px solid #f1b7b0;border-radius:10px;padding:10px 14px;font:600 13px/1.4 Mulish,system-ui,sans-serif;box-shadow:0 6px 18px #0002';
    d.textContent = 'Conexión con la base: ' + txt; if (!d.parentNode) (document.body || document.documentElement).appendChild(d); } catch (e) {} }
  function avisar() { oyentes.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function salir(motivo) { localStorage.removeItem(CLAVE); location.href = INGRESO + '?motivo=' + encodeURIComponent(motivo); }

  function cargarCasos() {
    return Promise.all([
      get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(descripcion,datos,composicion,suma_asegurada),visitas(estado,inicio,fin,llegada,modalidad,origen,agendado_en,direccion,creado,enlaces(tipo,estado,token,vence),inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero'),
      get('eventos?select=caso_id,hora,accion,detalle,rol,actor_tipo,actor:usuarios!eventos_actor_id_fkey(nombre)&order=hora')
    ]).then(function (res) {
      var casos = res[0], evs = res[1], porCaso = {};
      evs.forEach(function (e) { (porCaso[e.caso_id] = porCaso[e.caso_id] || []).push(e); });
      var nuevo = { casos: casos.map(function (k) { return aCaso(k, porCaso[k.id]); }), eventos: {} };
      casos.forEach(function (k) { nuevo.eventos[String(k.numero)] = (porCaso[k.id] || []).map(aEvento); });
      var E = window.SIRIUS_EJEMPLO, det = {}, idPorCaso = {}; if (E && E.detallesCasos) nuevo.casos.forEach(function (c) { if (E.detallesCasos[c.id]) det[c.id] = E.detallesCasos[c.id]; });
      casos.forEach(function (k) { idPorCaso[k.id] = String(k.numero); });
      return cargarEvidencias(idPorCaso).catch(function (e) { console.warn('[SIRIUS] evidencias:', e.message); return { evidencias: CX.evidencias, controles: CX.controles, informes: CX.informes, calificaciones: CX.calificaciones }; }).then(function (ev) {
        nuevo.evidencias = ev.evidencias; nuevo.controles = ev.controles; nuevo.informes = ev.informes; nuevo.calificaciones = ev.calificaciones || {};
        nuevo.casos.forEach(function (c) { var inf = (ev.informes[c.id] || []).filter(function (x) { return x.criterio; }).slice(-1)[0]; if (inf) c.criterioInspector = { valor: inf.criterio.valor, comentario: inf.criterio.comentario || '', por: inf.criterio.por || '', hora: reloj(inf.criterio.hora) }; });
        var h = JSON.stringify([nuevo.casos, nuevo.eventos, Object.keys(ev.evidencias).map(function (k) { return k + ev.evidencias[k].length; }), ev.controles, ev.informes, ev.calificaciones]);
        if (h === huella) return false; huella = h; CX.casos = nuevo.casos; CX.eventos = nuevo.eventos; CX.detalles = det; CX.evidencias = ev.evidencias; CX.controles = ev.controles; CX.informes = ev.informes; CX.calificaciones = ev.calificaciones || {}; return true; });
    });
  }

  CX.listo = get('usuarios?select=nombre,email,rol,tipo_inspector,datos,agencia:agencias(nombre)&auth_id=eq.' + (sesion.user && sesion.user.id))
    .then(function (us) {
      var u = us && us[0]; if (!u) { salir('Tu correo no está habilitado en SIRIUS.'); throw new Error('sin usuario'); }
      var roles = (u.datos && u.datos.roles) || [u.rol]; if (roles.indexOf(u.rol) < 0) roles.unshift(u.rol);
      CX.usuario = { nombre: u.nombre, email: u.email, rol: u.rol, roles: roles, tipoInspector: u.tipo_inspector, agencia: u.agencia ? u.agencia.nombre : null };
      var origenes = get('configuracion?select=clave,version,origen,creado&vigente=is.true').then(function (fs) { (fs || []).forEach(function (x) { ORIGEN[x.clave] = { origen: x.origen, version: x.version, creado: x.creado }; }); })
        .catch(function (e) { console.warn('[SIRIUS] origen de la configuración no disponible:', e.message); });
      return Promise.all([Promise.all([rpc('configuracion_vigente', {}), origenes]).then(function (r) { CONFIG = r[0] || {}; Object.keys(ARCH).forEach(aplicar); aplicarEspeciales(); evento('*'); })
        .catch(function (e) { console.warn('[SIRIUS] configuración de la base no disponible:', e.message); }), cargarCasos()]);
    })
    .then(function () { avisar(); setInterval(function () { cargarCasos().then(function (c) { if (c) avisar(); }).catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); }); }, SONDEO_MS); })
    .catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); else { console.error('[SIRIUS] conexión:', e); aviso('no se pudieron leer los casos (' + String(e.message || e).slice(0, 220) + ')'); } });
})();
