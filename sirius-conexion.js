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
  function fechaIso(iso) { var d = new Date(iso); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function aCaso(k, evs) {
    var a = k.asegurado || {}, c = a.contacto || {}, d = k.datos || {}, rs = k.riesgos || [], r0 = rs[0] || { datos: {} }, placas = rs.map(function (r) { return (r.datos || {}).placa; }).filter(Boolean);
    return { id: String(k.numero), orden: d.orden || '', ramo: k.ramo, estado: k.estado, asegurado: a.nombre || '', ident: a.identificacion || '', placa: placas[0] || '', placas: placas.length > 1 ? placas : undefined,
      bien: r0.descripcion || '', fecha: fechaIso(k.creado), responsable: (k.responsable && k.responsable.nombre) || (k.visitas && k.visitas[0] && k.visitas[0].inspector && k.visitas[0].inspector.nombre) || '',
      comercial: d.comercial || '', backoffice: d.backoffice || '', broker: d.broker || 'Directo', sucursal: d.sucursal || '', origen: k.origen || 'Manual',
      contacto: c.nombre || '', tel: c.celular || '', correo: c.correo || '', nota: d.nota || (k.subestado || ''),
      intentos: (evs || []).filter(function (e) { return e.accion === 'Intento de contacto'; }).map(function (e) { var p = (e.detalle || '').split(' · '); return { by: (e.actor && e.actor.nombre) || '', fecha: (e.hora || '').slice(0, 16), medio: p[0] || '', resultado: p[1] || '', obs: p.slice(2).join(' · ') }; }) };
  }
  function aEvento(e) { var actor = (e.actor && e.actor.nombre) || (e.actor_tipo === 'Cliente' ? 'Cliente' : e.actor_tipo === 'Sistema' ? 'SIRIUS' : e.actor_tipo || '');
    return { hora: reloj(e.hora), accion: e.accion, detalle: e.detalle || '', actor: actor, rol: e.rol || (e.actor_tipo === 'Cliente' ? 'Portal del cliente' : '') }; }

  // ---------- Contrato SIRIUS_CONEXION ----------
  var oyentes = [], huella = '';
  var CX = window.SIRIUS_CONEXION = { activo: true, usuario: null, casos: [], detalles: {}, eventos: {}, evidencias: {},
    suscribir: function (fn) { if (typeof fn === 'function') oyentes.push(fn); },
    accion: function (tipo) { return Promise.resolve({ ok: false, mensaje: 'Disponible en la próxima etapa (P-6c): «' + tipo + '»' }); },
    cerrarSesion: function () { localStorage.removeItem(CLAVE); location.href = INGRESO; } };
  function avisar() { oyentes.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function salir(motivo) { localStorage.removeItem(CLAVE); location.href = INGRESO + '?motivo=' + encodeURIComponent(motivo); }

  function cargarCasos() {
    return Promise.all([
      get('casos?select=id,numero,grupo_ramo,ramo,estado,subestado,asegurado,origen,creado,datos,responsable:usuarios!casos_responsable_id_fkey(nombre),riesgos(descripcion,datos,composicion),visitas(estado,inicio,inspector:usuarios!visitas_inspector_id_fkey(nombre))&order=numero'),
      get('eventos?select=caso_id,hora,accion,detalle,rol,actor_tipo,actor:usuarios!eventos_actor_id_fkey(nombre)&order=hora')
    ]).then(function (res) {
      var casos = res[0], evs = res[1], porCaso = {};
      evs.forEach(function (e) { (porCaso[e.caso_id] = porCaso[e.caso_id] || []).push(e); });
      var nuevo = { casos: casos.map(function (k) { return aCaso(k, porCaso[k.id]); }), eventos: {} };
      casos.forEach(function (k) { nuevo.eventos[String(k.numero)] = (porCaso[k.id] || []).map(aEvento); });
      var h = JSON.stringify(nuevo); if (h === huella) return false; huella = h; CX.casos = nuevo.casos; CX.eventos = nuevo.eventos; return true;
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
    .catch(function (e) { if (e.message === 'sesion') salir('Tu sesión venció. Ingresa de nuevo.'); else console.error('[SIRIUS] conexión:', e); });
})();
