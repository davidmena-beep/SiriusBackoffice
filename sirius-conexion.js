// SIRIUS · conexión real de la prueba de concepto (fase P · P-6a) · reemplaza al archivo mínimo del artifact.
// Con una sesión iniciada en index.html, el back-office trabaja con la base de datos (Supabase); sin sesión, en modo demostración.
// Usa la API REST de Supabase directamente (sin bibliotecas) y respeta el contrato SIRIUS_CONEXION del artifact (Etapa P-6a).
(function () {
  var URLB = 'https://qdciqoxselwmudlycprq.supabase.co', KEY = 'sb_publishable_pUrNhusonmxflSItZlU0fQ_ohRpCrYW';
  var CLAVE = 'sb-qdciqoxselwmudlycprq-auth-token', INGRESO = 'index.html', SONDEO_MS = 20000;
  var sesion = null; try { sesion = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) {}
  if (!sesion || !sesion.access_token || /[?&]demo=on/.test(location.search)) { window.SIRIUS_CONEXION = { activo: false }; return; }

  // ---------- Configuración: la versión vigente de la base reemplaza a la del archivo de datos (si no es más antigua) ----------
  var CONFIG = null, ARCH = {}, MEZCLA = {};
  function esObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function mezclar(a, b) { if (!esObj(a) || !esObj(b)) return b === undefined ? a : b; var r = {}; Object.keys(a).forEach(function (k) { r[k] = a[k]; }); Object.keys(b).forEach(function (k) { r[k] = mezclar(a[k], b[k]); }); return r; }
  function num(v) { return String(v || '0').split('.').map(function (x) { return parseInt(x, 10) || 0; }); }
  function masNueva(a, b) { var x = num(a), y = num(b); for (var i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; }
  function aplicar(clave) { var f = ARCH[clave], d = CONFIG && CONFIG[clave];
    if (d && f && masNueva(f.version, d.version)) { console.warn('[SIRIUS] ' + clave + ': el archivo (v' + f.version + ') es más nuevo que la base (v' + d.version + '); se usa el archivo.'); MEZCLA[clave] = f; return; }
    MEZCLA[clave] = d ? (f ? mezclar(f, d) : d) : f; }
  function vigilar(clave) { if (Object.getOwnPropertyDescriptor(window, clave)) return;
    Object.defineProperty(window, clave, { configurable: true, enumerable: true, get: function () { return MEZCLA[clave]; }, set: function (v) { ARCH[clave] = v; aplicar(clave); } }); }
  ['SIRIUS_COMPANIA','SIRIUS_CATALOGO_CIIU','SIRIUS_INFORMES_RG','SIRIUS_CATALOGOS_MAESTROS','SIRIUS_FLUJO','SIRIUS_FLUJO_MOTOR','SIRIUS_MONITOR','SIRIUS_SEGUIMIENTO',
   'SIRIUS_EQUIPOS','SIRIUS_SALIDA_RG','SIRIUS_SALIDA_VEH','SIRIUS_DOCUMENTOS_PDF','SIRIUS_INFORME_VEH','SIRIUS_CAMPOS','SIRIUS_USUARIOS','SIRIUS_NOTIFICACIONES','SIRIUS_CONFLICTOS',
   'SIRIUS_INICIO','SIRIUS_AGENDA','SIRIUS_LIQUIDACIONES','SIRIUS_HONORARIOS','SIRIUS_TARIFAS_CUENTAS','SIRIUS_MATRIZ_GARANTIAS','SIRIUS_DATOS_IA','SIRIUS_SILUETAS','SIRIUS_CAPTURA',
   'SIRIUS_AUTOINSPECCION','SIRIUS_PORTAL_CLIENTE','SIRIUS_APP_INSPECTOR'].forEach(vigilar);
  // (SIRIUS_EJEMPLO y SIRIUS_MONITOR_EJEMPLO no se reemplazan: son datos de demostración; los casos salen de la base.)

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
    x.orden = d.orden || x.orden || ''; x.fecha = x.fecha || fechaIso(k.creado); x.responsable = resp || x.responsable || '';
    x.comercial = d.comercial || x.comercial || ''; x.backoffice = d.backoffice || x.backoffice || ''; x.broker = d.broker || x.broker || 'Directo'; x.sucursal = d.sucursal || x.sucursal || '';
    x.origen = k.origen || x.origen || 'Manual'; x.contacto = c.nombre || x.contacto || ''; x.tel = c.celular || x.tel || ''; x.correo = c.correo || x.correo || '';
    x.nota = d.nota || k.subestado || x.nota || '';
    // C2-3 · inspector del caso (para la bandeja «Informes por completar» del Control de calidad) y plazo de 24 h hábiles
    var vi = (k.visitas || []).filter(function (v) { return v.inspector; })[0];
    if (vi) x.inspector = { nombre: vi.inspector.nombre, tipo: vi.inspector.tipo_inspector || '', agencia: vi.inspector.agencia ? vi.inspector.agencia.nombre : '' };
    if (k.sla_vence) x.vence = isoLocal(k.sla_vence);
    // C2-7 · solicitud (precargados) y visita (automáticos del informe)
    var dd0 = r0.datos || {}; x.solicitud = { marca: dd0.marca || '', modelo: dd0.modelo || '', anio: dd0.anio ? String(dd0.anio) : '', placa: dd0.placa || '' };
    var vv = (k.visitas || []).slice().sort(function (a, b) { return String(b.creado || '').localeCompare(String(a.creado || '')); })[0];
    if (vv) x.visita = { inicio: isoLocal(vv.inicio), llegada: isoLocal(vv.llegada && vv.llegada.hora), modalidad: vv.modalidad || '', quienRecibe: (vv.direccion && vv.direccion.quien) || '', inspector: vv.inspector ? vv.inspector.nombre : '' };
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
      get('evidencias?select=caso_id,paso,canal,ruta,hora,lat,lng,validacion,lecturas&order=hora'),
      get('controles?select=id,caso_id,tipo,severidad,detalle,estado,comentario,creado&order=creado'),
      get('informes?select=riesgo_id,plantilla_clave,plantilla_version,respuestas,estado,determinacion,motivo,enviado_en,criterio,decision,riesgo:riesgos(caso_id,descripcion),enviado:usuarios!informes_enviado_por_fkey(nombre)')
    ]).then(function (res) {
      var evs = res[0], ctr = res[1], inf = res[2], rutas = evs.map(function (e) { return e.ruta; }).filter(function (r) { return !FIRMAS[r]; });
      var refrescar = Date.now() - FIRMADO > 45 * 60000; if (refrescar) { FIRMAS = {}; rutas = evs.map(function (e) { return e.ruta; }); }
      return firmar(rutas).then(function (m) { Object.keys(m).forEach(function (k) { FIRMAS[k] = m[k]; }); if (refrescar) FIRMADO = Date.now();
        var E = {}, C = {}, I = {};
        evs.forEach(function (e) { var id = idPorCaso[e.caso_id]; if (!id) return; (E[id] = E[id] || []).push({ paso: e.paso, url: FIRMAS[e.ruta] || null, prueba: !FIRMAS[e.ruta], hora: reloj(e.hora), canal: e.canal, validacion: e.validacion || '', gps: e.lat != null ? [e.lat, e.lng] : null, lecturas: e.lecturas || {} }); });
        ctr.forEach(function (c) { var id = idPorCaso[c.caso_id]; if (!id) return; (C[id] = C[id] || []).push({ id: c.id, tipo: c.tipo, severidad: c.severidad, detalle: c.detalle || {}, estado: c.estado, comentario: c.comentario || '', hora: reloj(c.creado) }); });
        inf.forEach(function (x) { var id = x.riesgo && idPorCaso[x.riesgo.caso_id]; if (!id) return; (I[id] = I[id] || []).push({ riesgo: x.riesgo.descripcion, plantilla: x.plantilla_clave + ' v' + x.plantilla_version, respuestas: x.respuestas || {}, estado: x.estado, determinacion: x.determinacion || '', motivo: x.motivo || '', enviadoPor: x.enviado ? x.enviado.nombre : '', enviadoEn: reloj(x.enviado_en), criterio: x.criterio || null, decision: x.decision || null }); });
        return { evidencias: E, controles: C, informes: I }; }); }); }
  var oyentes = [], huella = '';
  var CX = window.SIRIUS_CONEXION = { activo: true, usuario: null, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {},
    suscribir: function (fn) { if (typeof fn === 'function') oyentes.push(fn); },
    // P-6c · las acciones se guardan en la base (función bo_accion) y luego se vuelve a leer y a dibujar.
    accion: function (tipo, datos) { return rpc('bo_accion', { p_tipo: tipo, p_datos: datos || {} }).then(function (r) { r = r || { ok: false, mensaje: 'Sin respuesta de la base' };
      return cargarCasos().then(function () { avisar(); return r; }, function () { return r; }); }).catch(function (e) { return { ok: false, mensaje: String(e.message || e).slice(0, 200) }; }); },
    cerrarSesion: function () { localStorage.removeItem(CLAVE); location.href = INGRESO; } };
  // Aviso visible si la base no responde (para diagnosticar en la copia publicada sin abrir la consola).
  function aviso(txt) { try { var d = document.getElementById('sirius-aviso-conexion') || document.createElement('div'); d.id = 'sirius-aviso-conexion';
    d.setAttribute('role', 'alert'); d.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:560px;background:#fdecea;color:#b42318;border:1px solid #f1b7b0;border-radius:10px;padding:10px 14px;font:600 13px/1.4 Mulish,system-ui,sans-serif;box-shadow:0 6px 18px #0002';
    d.textContent = 'Conexión con la base: ' + txt; if (!d.parentNode) (document.body || document.documentElement).appendChild(d); } catch (e) {} }
  function avisar() { oyentes.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function salir(motivo) { localStorage.removeItem(CLAVE); location.href = INGRESO + '?motivo=' + encodeURIComponent(motivo); }

  function cargarCasos() {
    return Promise.all([
      get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,sla_vence,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(descripcion,datos,composicion,suma_asegurada),visitas(estado,inicio,llegada,modalidad,direccion,creado,inspector:usuarios!visitas_inspector_id_fkey(nombre,tipo_inspector,agencia:agencias(nombre)))&order=numero'),
      get('eventos?select=caso_id,hora,accion,detalle,rol,actor_tipo,actor:usuarios!eventos_actor_id_fkey(nombre)&order=hora')
    ]).then(function (res) {
      var casos = res[0], evs = res[1], porCaso = {};
      evs.forEach(function (e) { (porCaso[e.caso_id] = porCaso[e.caso_id] || []).push(e); });
      var nuevo = { casos: casos.map(function (k) { return aCaso(k, porCaso[k.id]); }), eventos: {} };
      casos.forEach(function (k) { nuevo.eventos[String(k.numero)] = (porCaso[k.id] || []).map(aEvento); });
      var E = window.SIRIUS_EJEMPLO, det = {}, idPorCaso = {}; if (E && E.detallesCasos) nuevo.casos.forEach(function (c) { if (E.detallesCasos[c.id]) det[c.id] = E.detallesCasos[c.id]; });
      casos.forEach(function (k) { idPorCaso[k.id] = String(k.numero); });
      return cargarEvidencias(idPorCaso).catch(function (e) { console.warn('[SIRIUS] evidencias:', e.message); return { evidencias: CX.evidencias, controles: CX.controles, informes: CX.informes }; }).then(function (ev) {
        nuevo.evidencias = ev.evidencias; nuevo.controles = ev.controles; nuevo.informes = ev.informes;
        nuevo.casos.forEach(function (c) { var inf = (ev.informes[c.id] || []).filter(function (x) { return x.criterio; }).slice(-1)[0]; if (inf) c.criterioInspector = { valor: inf.criterio.valor, comentario: inf.criterio.comentario || '', por: inf.criterio.por || '', hora: reloj(inf.criterio.hora) }; });
        var h = JSON.stringify([nuevo.casos, nuevo.eventos, Object.keys(ev.evidencias).map(function (k) { return k + ev.evidencias[k].length; }), ev.controles, ev.informes]);
        if (h === huella) return false; huella = h; CX.casos = nuevo.casos; CX.eventos = nuevo.eventos; CX.detalles = det; CX.evidencias = ev.evidencias; CX.controles = ev.controles; CX.informes = ev.informes; return true; });
    });
  }

  CX.listo = get('usuarios?select=nombre,email,rol,tipo_inspector,datos,agencia:agencias(nombre)&auth_id=eq.' + (sesion.user && sesion.user.id))
    .then(function (us) {
      var u = us && us[0]; if (!u) { salir('Tu correo no está habilitado en SIRIUS.'); throw new Error('sin usuario'); }
      var roles = (u.datos && u.datos.roles) || [u.rol]; if (roles.indexOf(u.rol) < 0) roles.unshift(u.rol);
      CX.usuario = { nombre: u.nombre, email: u.email, rol: u.rol, roles: roles, tipoInspector: u.tipo_inspector, agencia: u.agencia ? u.agencia.nombre : null };
      return Promise.all([rpc('configuracion_vigente', {}).then(function (c) { CONFIG = c || {}; Object.keys(ARCH).forEach(aplicar); }).catch(function (e) { console.warn('[SIRIUS] configuración de la base no disponible:', e.message); }), cargarCasos()]);
    })
    .then(function () { avisar(); setInterval(function () { cargarCasos().then(function (c) { if (c) avisar(); }).catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); }); }, SONDEO_MS); })
    .catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); else { console.error('[SIRIUS] conexión:', e); aviso('no se pudieron leer los casos (' + String(e.message || e).slice(0, 220) + ')'); } });
})();
