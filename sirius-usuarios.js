// SIRIUS · Capa de usuarios, roles y permisos (etapa 10b · DEC-113 actualizada, DEC-128 a DEC-130).
// Lee SIRIUS_USUARIOS (fuente única) y aplica los cambios de la sesión EN MEMORIA: al recargar vuelven a los archivos.
// Aquí viven: invitaciones (72 h), estados, Gmail por usuario, matriz de permisos (roles del sistema de solo lectura y roles
// propios duplicados), impacto de suspender / dar de baja / quitar un rol, reasignación de casos y responsables de Flujo y SLA,
// facultades del inspector (solo lectura, vienen de Niveles de calificación) y logo de cada agencia.
(function () {
  var SU = { hist: [], reasig: {}, version: 0, ctx: { casos: function () { return []; } } };
  var oyentes = [];
  var U = function () { return window.SIRIUS_USUARIOS || null; };
  var N = function () { return window.SIRIUS_NOTIFICACIONES || null; };
  var clon = function (o) { return JSON.parse(JSON.stringify(o)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  // Etapa 11-c: acciones de Configuración general (se agregan a la matriz del archivo antes de guardar la base de restauración).
  (function () { var u = U(); if (!u || !u.acciones) return; [['Administración', 'Configurar compañía y moneda', 'E', '', '', '', '', '', '', '', ''], ['Administración', 'Configurar impuestos', 'E', '', '', '', '', '', 'E', '', '']].forEach(function (r) { if (!u.acciones.some(function (a) { return a[1] === r[1]; })) u.acciones.push(r); }); })();
  var BASE = U() ? clon({ usuarios: U().usuarios, roles: U().roles, acciones: U().acciones, agencias: U().agencias }) : null;
  var F0 = window.SIRIUS_FLUJO ? clon({ c: window.SIRIUS_FLUJO.coordinadorPorSucursal, s: window.SIRIUS_FLUJO.suscriptorPorGrupo }) : null;
  SU.on = function (fn) { oyentes.push(fn); return function () { oyentes = oyentes.filter(function (x) { return x !== fn; }); }; };
  function avisar() { SU.version++; oyentes.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  SU.avisar = avisar;
  // ---------- Reloj del prototipo ----------
  SU.ahora = function () { var E = window.SIRIUS_EJEMPLO, d = E && E.ahora ? E.ahora() : null; if (!d) return '2026-10-18T20:30'; return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  SU.sumaHoras = function (iso, h) { var p = iso.split(/[-T:]/).map(Number), d = new Date(p[0], p[1] - 1, p[2], p[3], p[4]); d = new Date(d.getTime() + h * 3600000); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  SU.fmt = function (s) { if (!s) return ''; var d = String(s).slice(0, 10).split('-'); return d[2] + '/' + d[1] + '/' + d[0].slice(2) + (String(s).length > 10 ? ' · ' + String(s).slice(11, 16) : ''); };
  SU.fmtLargo = function (s) { if (!s) return ''; var d = String(s).slice(0, 10).split('-'); return d[2] + '/' + d[1] + '/' + d[0] + ' a las ' + String(s).slice(11, 16); };
  // ---------- Reinicio (cada escena nueva parte de los archivos) ----------
  SU.reset = function () {
    var u = U(); if (!u || !BASE) return;
    ['usuarios', 'roles', 'acciones', 'agencias'].forEach(function (k) { var a = u[k]; a.length = 0; clon(BASE[k]).forEach(function (x) { a.push(x); }); });
    SU.hist.length = 0; SU.reasig = {}; SU.facHon = {};
    var N_ = N(); if (N_ && N_.bitacora) { for (var i = N_.bitacora.length - 1; i >= 0; i--) if (N_.bitacora[i].tipo === 'invitacion') N_.bitacora.splice(i, 1); }
    var F = window.SIRIUS_FLUJO; if (F && F0) { Object.keys(F.coordinadorPorSucursal).forEach(function (k) { delete F.coordinadorPorSucursal[k]; }); Object.assign(F.coordinadorPorSucursal, clon(F0.c)); Object.keys(F.suscriptorPorGrupo).forEach(function (k) { delete F.suscriptorPorGrupo[k]; }); Object.assign(F.suscriptorPorGrupo, clon(F0.s)); }
    avisar();
  };
  function log(por, objeto, accion, motivo, extra) { SU.hist.unshift(Object.assign({ fecha: SU.ahora(), por: por, objeto: objeto, accion: accion, motivo: motivo || '' }, extra || {})); }
  // ---------- Consultas ----------
  SU.usuarios = function () { return (U() || { usuarios: [] }).usuarios; };
  SU.usuario = function (n) { return SU.usuarios().find(function (u) { return u.nombre === n; }) || null; };
  SU.porCorreo = function (c) { c = String(c || '').trim().toLowerCase(); return SU.usuarios().find(function (u) { return u.correo.toLowerCase() === c; }) || null; };
  SU.roles = function () { return (U() || { roles: [] }).roles; };
  SU.rol = function (n) { return SU.roles().find(function (r) { return r.nombre === n; }) || null; };
  SU.base = function (n) { var r = SU.rol(n); return r && r.base ? r.base : n; };
  SU.agencias = function () { return (U() || { agencias: [] }).agencias; };
  SU.agencia = function (id) { return SU.agencias().find(function (a) { return a.id === id; }) || null; };
  SU.estadoEf = function (u) { if (u.estado === 'Invitado' && u.vence && u.vence < SU.ahora()) return 'Invitación vencida'; return u.estado; };
  SU.estadoInfo = function (e) { return ((U() || {}).estadosUsuario || []).find(function (x) { return x.id === e; }) || { id: e, badge: 'neutral' }; };
  SU.titularDe = function (rol) { var u = SU.usuarios().find(function (x) { return x.estado === 'Activo' && x.roles.indexOf(rol) >= 0; }) || SU.usuarios().find(function (x) { return x.roles.indexOf(rol) >= 0; }); return u ? u.nombre : null; };
  SU.contarEstados = function () { var c = { total: 0 }; SU.usuarios().forEach(function (u) { var e = SU.estadoEf(u); c[e] = (c[e] || 0) + 1; c.total++; }); return c; };
  SU.alcanceTxt = function (a) { a = a || {}; var s = a.sucursales === 'Todas' || !a.sucursales ? 'Todas las sucursales' : a.sucursales.join(', '), g = a.grupos === 'Todos' || !a.grupos ? 'Todos los grupos' : a.grupos.join(', '); return s + ' · ' + g; };
  SU.sucursales = function () { var E = window.SIRIUS_EJEMPLO; var L = ((E && E.catalogos && E.catalogos.sucursales) || []).map(function (x) { return typeof x === 'string' ? x : (x && (x.nombre || x.n)) || ''; }).filter(Boolean); return L.length ? L : ['Quito', 'Loja', 'Cuenca', 'Machala', 'Santo Domingo', 'Riobamba', 'Ambato', 'Ibarra', 'Manta', 'El Coca', 'Guayaquil']; };
  SU.grupos = function () { return ['Vehículos', 'Ramos Generales']; };
  // ---------- Matriz de permisos ----------
  SU.LETRAS = { C: 'Crear', V: 'Ver', E: 'Editar', A: 'Aprobar o decidir', P: 'Solo lo propio o asignado' };
  var A_ = {
    bandeja: ['Ver bandeja de casos'], nueva: ['Crear solicitud manual'],
    calificacion: ['Calificar nivel 1', 'Calificar nivel 2 (dictamen final)', 'Marcar revisión de control como revisada'],
    garantias: ['Adjuntar documento o respaldo de garantía', 'Marcar documento como cumplido o rechazar adjunto', 'Marcar garantía como cumplida o rechazar respaldo', 'Solicitar inspección de garantías', 'Solicitar ampliación de plazo o cierre', 'Aprobar ampliación de plazo'],
    informes: ['Completar el informe'], // etapa C2-3 · DEC-180: módulo «Informes por completar»
    liquidaciones: ['Liquidar honorarios'], usuarios: ['Gestionar usuarios, roles e invitaciones', 'Ver y configurar las tarifas a sus inspectores y las cuentas bancarias'], // etapa 15-4: Agencias en solo lectura o lo propio
    conflictos: ['Ver y resolver conflictos de configuración'], cfgGeneral: ['Configurar compañía y moneda'], impuestos: ['Configurar impuestos'], // P-6f-0f2: el comentario de arriba ocupaba toda la línea y dejaba estas tres entradas fuera (Configuración general no se veía)
    config: ['Configurar formularios, niveles, facultades, reglas, catálogos, plantillas y notificaciones'], monitor: ['Ver el monitor del proceso'],
  };
  SU.permiso = function (rol, accion) { var u = U(); return u ? u.permiso(rol, accion) : ''; };
  // Módulos que se ven por el grupo de la matriz (etapa 9): basta un permiso no vacío en cualquiera de sus acciones.
  var GRUPO_MOD = { agenda: 'Agenda', calificacion: 'Calificación', garantias: 'Garantías', liquidaciones: 'Liquidaciones', reportes: 'Reportes' };
  SU.accionesDe = function (grupo) { if (GRUPO_MOD[grupo]) return SU.filas().filter(function (a) { return a[0] === GRUPO_MOD[grupo]; }).map(function (a) { return a[1]; }); return A_[grupo] || []; };
  SU.puede = function (rol, grupo) { return SU.accionesDe(grupo).some(function (a) { return SU.permiso(rol, a) !== ''; }); };
  var ADMIN_CFG = ['catalogos', 'formularios', 'campos', 'niveles', 'flujo', 'modelos', 'garpol', 'motores', 'notificaciones'];
  SU.visible = function (rol, mod, child) {
    if (!mod || mod === 'inicio' || mod === 'perfil') return true;
    if (mod === 'solicitudes') return child === 'nueva' ? SU.puede(rol, 'nueva') : child === 'bandeja' ? SU.puede(rol, 'bandeja') : (SU.puede(rol, 'bandeja') || SU.puede(rol, 'nueva'));
    if (mod === 'informes') return SU.puede(rol, 'informes'); // etapa C2-3
    if (mod === 'agenda') return SU.puede(rol, 'agenda');
    if (mod === 'calificacion') return SU.puede(rol, 'calificacion');
    if (mod === 'garantias') return SU.puede(rol, 'garantias');
    if (mod === 'liquidaciones') return SU.puede(rol, 'liquidaciones');
    if (mod === 'reportes') return SU.puede(rol, 'reportes');
    // Etapas 16f-3 y 16f-3b · DEC-170: «Flujo y SLA › Monitor» para quien tenga «Ver el monitor del proceso» en la matriz (Administrador y Coordinador
    // por defecto); sin permisos de configuración se ve solo esa pestaña.
    var monV = SU.puede(rol, 'monitor');
    if (mod === 'administracion' && child === 'zonas') return true; // etapa G-2a · DEC-221: Ciudades y zonas la ven todos los roles (solo el Administrador edita)
    if (mod === 'administracion' && child === 'flujo' && monV) return true;
    if (mod === 'administracion' && !child && monV) return true;
    if (mod === 'administracion') return child === 'usuarios' ? SU.puede(rol, 'usuarios') : child === 'conflictos' ? SU.puede(rol, 'conflictos') : child === 'configuracion' ? (SU.puede(rol, 'cfgGeneral') || SU.puede(rol, 'impuestos')) : child ? SU.puede(rol, 'config') : (SU.puede(rol, 'usuarios') || SU.puede(rol, 'conflictos') || SU.puede(rol, 'config') || SU.puede(rol, 'cfgGeneral') || SU.puede(rol, 'impuestos'));
    return true;
  };
  // Menú lateral filtrado por la matriz del rol activo, para todos los roles (etapa 9): los módulos sin ninguna acción permitida desaparecen.
  SU.filtrarNav = function (items, rol) {
    var key = rol + '|' + SU.version; SU._nc = SU._nc || new WeakMap();
    var hit = SU._nc.get(items); if (hit && hit.k === key) return hit.v;
    var out = items.filter(function (it) { return SU.visible(rol, it.id, null); }).map(function (it) { return it.children ? Object.assign({}, it, { children: it.children.filter(function (c) { return SU.visible(rol, it.id, c.id); }) }) : it; }).filter(function (it) { return !it.children || it.children.length; });
    SU._nc.set(items, { k: key, v: out }); return out;
  };
  SU.moduloNombres = function (rol) {
    var L = [['Solicitudes › Bandeja', 'solicitudes', 'bandeja'], ['Solicitudes › Nueva solicitud', 'solicitudes', 'nueva'], ['Agenda', 'agenda'], ['Calificación', 'calificacion'], ['Garantías', 'garantias'], ['Liquidaciones', 'liquidaciones'], ['Reportes', 'reportes'], ['Administración › Usuarios y roles', 'administracion', 'usuarios'], ['Administración › Conflictos', 'administracion', 'conflictos'], ['Administración › Configuración general', 'administracion', 'configuracion'], ['Administración › Configuración (formularios, niveles, flujo, catálogos…)', 'administracion', 'catalogos']];
    return L.filter(function (x) { return SU.visible(rol, x[1], x[2] || null); }).map(function (x) { return x[0]; });
  };
  SU.filas = function () { return (U() || { acciones: [] }).acciones; };
  SU.colIdx = function (rolNombre) { return SU.roles().findIndex(function (r) { return r.nombre === rolNombre; }); };
  SU.duplicarRol = function (origenNombre, nombre, por, motivo) {
    var u = U(), i = SU.colIdx(origenNombre), o = SU.rol(origenNombre); if (!u || i < 0) return null; nombre = String(nombre || '').trim();
    var r = { id: 'rol' + (SU.roles().filter(function (x) { return !x.sistema; }).length + 1), nombre: nombre, sistema: false, base: o.base || o.nombre, origen: o.nombre, creado: [por, SU.ahora()] };
    u.roles.push(r); u.acciones.forEach(function (a) { a.push(a[2 + i]); });
    log(por, 'Rol «' + nombre + '»', 'Duplicó el rol «' + origenNombre + '»', motivo); avisar(); return r;
  };
  SU.nombreRolValido = function (n) { n = String(n || '').trim(); if (n.length < 3) return 'Escribe un nombre de al menos 3 caracteres.'; if (SU.rol(n)) return 'Ya existe un rol con ese nombre.'; return ''; };
  // cambios: [{ accion, a }] sobre un rol propio. Devuelve el impacto sin aplicar nada.
  SU.impactoMatriz = function (rolNombre, cambios) {
    var i = SU.colIdx(rolNombre), usuarios = SU.usuarios().filter(function (x) { return x.roles.indexOf(rolNombre) >= 0; });
    var antes = SU.moduloNombres(rolNombre), prev = {};
    cambios.forEach(function (c) { var f = SU.filas().find(function (a) { return a[1] === c.accion; }); if (f) { prev[c.accion] = f[2 + i]; f[2 + i] = c.a; } });
    SU.version++; var despues = SU.moduloNombres(rolNombre); var nueva = SU.puede(rolNombre, 'nueva');
    cambios.forEach(function (c) { var f = SU.filas().find(function (a) { return a[1] === c.accion; }); if (f) f[2 + i] = prev[c.accion]; }); SU.version++;
    var nuevaAntes = antes.indexOf('Solicitudes › Nueva solicitud') >= 0;
    var pierde = antes.filter(function (m) { return despues.indexOf(m) < 0; }), gana = despues.filter(function (m) { return antes.indexOf(m) < 0; });
    var acc = cambios.map(function (c) { var f = SU.filas().find(function (a) { return a[1] === c.accion; }), de = f ? f[2 + i] : ''; return { accion: c.accion, de: de, a: c.a, quita: de !== '' && c.a === '', suma: de === '' && c.a !== '' }; });
    var lineas = [];
    if (!usuarios.length) lineas.push('Ningún usuario tiene este rol todavía: el cambio no afecta a nadie hasta que se lo asignes.');
    else lineas.push(usuarios.length + (usuarios.length === 1 ? ' usuario afectado: ' : ' usuarios afectados: ') + usuarios.map(function (x) { return x.nombre + (SU.estadoEf(x) === 'Activo' ? '' : ' (' + SU.estadoEf(x) + ')'); }).join(', ') + '.');
    acc.forEach(function (a) { if (a.quita) lineas.push('Pierde «' + a.accion + '» (hoy: ' + a.de + ' · ' + SU.LETRAS[a.de] + ').'); else if (a.suma) lineas.push('Gana «' + a.accion + '» (' + a.a + ' · ' + SU.LETRAS[a.a] + ').'); else if (a.de !== a.a) lineas.push('«' + a.accion + '» pasa de ' + (a.de || 'sin acceso') + ' a ' + (a.a || 'sin acceso') + '.'); });
    pierde.forEach(function (m) { lineas.push('Deja de ver el módulo «' + m + '» en el menú lateral.'); }); gana.forEach(function (m) { lineas.push('Pasa a ver el módulo «' + m + '» en el menú lateral.'); });
    if (nuevaAntes && !nueva) lineas.push('El botón «Nueva solicitud» deja de aparecer en la Bandeja.'); if (!nuevaAntes && nueva) lineas.push('El botón «Nueva solicitud» pasa a aparecer en la Bandeja.');
    return { usuarios: usuarios, acciones: acc, pierde: pierde, gana: gana, nuevaSolicitud: { antes: nuevaAntes, despues: nueva }, lineas: lineas, hay: acc.some(function (a) { return a.de !== a.a; }) };
  };
  SU.aplicarMatriz = function (rolNombre, cambios, por, motivo) {
    var r = SU.rol(rolNombre), i = SU.colIdx(rolNombre); if (!r || r.sistema || i < 0) return false;
    var det = [];
    cambios.forEach(function (c) { var f = SU.filas().find(function (a) { return a[1] === c.accion; }); if (f && f[2 + i] !== c.a) { det.push('«' + c.accion + '»: ' + (f[2 + i] || 'sin acceso') + ' → ' + (c.a || 'sin acceso')); f[2 + i] = c.a; } });
    if (det.length) log(por, 'Rol «' + rolNombre + '»', 'Cambió permisos: ' + det.join('; '), motivo); avisar(); return true;
  };
  // ---------- Invitaciones ----------
  SU.validarCorreo = function (correo, tipo, excluir) {
    var c = String(correo || '').trim().toLowerCase(); if (!c) return 'Escribe el correo.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)) return 'Escribe un correo válido.';
    var ex = SU.porCorreo(c); if (ex && ex.nombre !== excluir) return 'Ese correo ya está registrado (' + ex.nombre + '). El correo es único.';
    if (tipo === 'Interno' && c.split('@')[1] !== U().dominio) return 'Un usuario interno debe usar el correo de la compañía (@' + U().dominio + ').';
    return '';
  };
  SU.correoInvitacion = function (d, por) {
    var u = U(), N_ = N(), interno = d.tipo === 'Interno', vence = SU.sumaHoras(SU.ahora(), 72), roles = (d.roles || []).join(', ') || 'sin roles aún';
    return {
      de: N_ ? N_.remitenteDe(por) : 'notificaciones@' + u.dominio, para: d.correo || 'correo@…', asunto: 'Te invitaron a SIRIUS · ' + u.compania,
      saludo: 'Hola, ' + (String(d.nombre || '').trim().split(/\s+/)[0] || '…') + ':',
      cuerpo: [por + ' te invitó a usar SIRIUS, el sistema de inspecciones de ' + u.compania + ', con ' + (d.roles && d.roles.length > 1 ? 'los roles' : 'el rol') + ' ' + roles + '.',
        interno ? 'Entra con tu cuenta de Google de la compañía. Después te pediremos permiso para enviar correos con tu cuenta, solo en los casos en los que participas.' : 'Crea tu contraseña y confirma el código de seis dígitos que te enviaremos a este correo.'],
      boton: 'Aceptar la invitación', vence: vence, venceTxt: 'El enlace vale ' + u.invitacion.validez + ' (hasta el ' + SU.fmtLargo(vence) + '). Si vence, pide otra invitación.',
    };
  };
  function bitacoraInvitacion(u, por, que) {
    var N_ = N(); if (!N_) return; var ci = SU.correoInvitacion(u, por);
    N_.bitacora.unshift({ fecha: SU.ahora(), tipo: 'invitacion', regla: null, caso: '—', canal: 'correo', a: u.nombre + ' (' + u.correo + ')', remitente: ci.de, estado: 'Enviado', nota: que + ' · vence ' + SU.fmt(u.vence || ci.vence) });
  }
  SU.invitar = function (d, por) {
    var u = U(), vence = SU.sumaHoras(SU.ahora(), 72);
    var n = { nombre: String(d.nombre).trim(), correo: String(d.correo).trim().toLowerCase(), celular: String(d.celular || '').trim(), tipo: d.tipo, roles: d.roles.slice(), alcance: { sucursales: d.sucursales === 'Todas' ? 'Todas' : d.sucursales.slice(), grupos: d.grupos === 'Todos' ? 'Todos' : d.grupos.slice() }, estado: 'Invitado', acceso: null, gmail: d.tipo === 'Interno' ? 'Sin conectar' : 'No aplica', invitado: [por, SU.ahora()], vence: vence, enlace: 1 };
    if (d.tipo === 'Agencia') n.agencia = d.agencia; u.usuarios.push(n);
    bitacoraInvitacion(n, por, 'Invitación a SIRIUS'); log(por, n.nombre, 'Invitó al usuario (' + n.tipo + ' · ' + n.roles.join(', ') + ')', d.motivo || 'Alta de usuario'); avisar(); return n;
  };
  SU.reenviar = function (nombre, por) {
    var x = SU.usuario(nombre); if (!x) return null; var est = SU.estadoEf(x);
    if (est === 'Invitado' || est === 'Invitación vencida' || (est === 'Inactivo' && !x.acceso)) {
      x.estado = 'Invitado'; x.invitado = [por, SU.ahora()]; x.vence = SU.sumaHoras(SU.ahora(), 72); x.enlace = (x.enlace || 1) + 1; delete x.baja; delete x.pidioNueva;
      bitacoraInvitacion(x, por, 'Reenvío de la invitación (el enlace anterior dejó de valer)'); log(por, nombre, 'Reenvió la invitación; el enlace anterior quedó invalidado', 'Nuevo vencimiento ' + SU.fmt(x.vence));
    } else { bitacoraInvitacion(x, por, 'Invitación para conectar Gmail'); log(por, nombre, 'Reenvió la invitación para conectar Gmail', 'Gmail «' + x.gmail + '»'); }
    avisar(); return x;
  };
  SU.revocar = function (nombre, por, motivo) { var x = SU.usuario(nombre); if (!x) return; x.estado = 'Inactivo'; x.baja = [por, SU.ahora(), 'Invitación revocada: ' + motivo]; x.vence = null; log(por, nombre, 'Revocó la invitación (el enlace dejó de valer)', motivo); avisar(); };
  SU.pedirNueva = function (nombre) { var x = SU.usuario(nombre); if (!x) return; x.pidioNueva = SU.ahora(); log(nombre, nombre, 'Pidió una nueva invitación desde el enlace vencido', 'Aviso para ' + (x.invitado ? x.invitado[0] : 'el Administrador')); avisar(); };
  SU.completarInvitacion = function (nombre, metodo) { var x = SU.usuario(nombre); if (!x) return; x.estado = 'Activo'; x.acceso = metodo; x.ultimoAcceso = SU.ahora(); x.vence = null; delete x.pidioNueva; log(nombre, nombre, 'Aceptó la invitación (' + metodo + ')', ''); avisar(); };
  // ---------- Estados ----------
  SU.suspender = function (nombre, por, motivo) { var x = SU.usuario(nombre); if (!x) return; x.estado = 'Suspendido'; x.suspension = [por, SU.ahora(), motivo]; log(por, nombre, 'Suspendió al usuario', motivo); avisar(); };
  SU.reactivar = function (nombre, por, motivo) { var x = SU.usuario(nombre); if (!x) return; x.estado = 'Activo'; delete x.suspension; delete x.baja; log(por, nombre, 'Reactivó al usuario', motivo); avisar(); };
  SU.darBaja = function (nombre, por, motivo) { var x = SU.usuario(nombre); if (!x) return; x.estado = 'Inactivo'; x.baja = [por, SU.ahora(), motivo]; delete x.suspension; log(por, nombre, 'Dio de baja al usuario (queda Inactivo; no se elimina)', motivo); avisar(); };
  SU.editar = function (nombre, c, por, motivo) {
    var x = SU.usuario(nombre); if (!x) return; var det = [];
    if (c.celular !== undefined && c.celular !== x.celular) { det.push('celular'); x.celular = c.celular; }
    if (c.agencia !== undefined && c.agencia !== x.agencia) { det.push('agencia'); x.agencia = c.agencia; }
    if (c.roles && c.roles.join('|') !== x.roles.join('|')) { det.push('roles: ' + c.roles.join(', ')); x.roles = c.roles.slice(); }
    if (c.sucursales !== undefined || c.grupos !== undefined) { var s = c.sucursales === undefined ? x.alcance.sucursales : c.sucursales, g = c.grupos === undefined ? x.alcance.grupos : c.grupos; if (JSON.stringify([s, g]) !== JSON.stringify([x.alcance.sucursales, x.alcance.grupos])) { det.push('alcance: ' + SU.alcanceTxt({ sucursales: s, grupos: g })); x.alcance = { sucursales: s, grupos: g }; } }
    if (det.length) log(por, nombre, 'Editó: ' + det.join('; '), motivo); avisar(); return det;
  };
  // ---------- Gmail ----------
  function sync(que, quien) { var Z = window.SiriusConflictos; if (Z && Z.K && Z.K() && Z.K().registro) Z.sync({ que: que, quien: quien }); }
  SU.conectarGmail = function (nombre, por) { var x = SU.usuario(nombre); if (!x || x.tipo !== 'Interno') return false; x.gmail = 'Conectada'; x.gmailDesde = SU.ahora(); delete x.nota; log(por || nombre, nombre, 'Conectó Gmail: sus correos salen de su cuenta', ''); avisar(); sync('Conectó Gmail (' + nombre + ')', por || nombre); return true; };
  SU.retirarGmail = function (nombre, por) { var x = SU.usuario(nombre); if (!x || x.tipo !== 'Interno') return false; x.gmail = 'Sin conectar'; x.gmailDesde = null; log(por || nombre, nombre, 'Retiró el permiso de Gmail: sus correos salen de la cuenta institucional', ''); avisar(); sync('Retiró el permiso de Gmail (' + nombre + ')', por || nombre); return true; };
  SU.cuentasGmail = function () { return SU.usuarios().filter(function (u) { return u.tipo === 'Interno' && SU.estadoEf(u) !== 'Inactivo'; }); };
  // ---------- Casos a cargo, impacto y reasignación ----------
  SU.rolDeCaso = function (c) { var F = window.SIRIUS_FLUJO, e = F && F.estado ? F.estado(c.estado) : null; if (!e) return null; return { coordinador: 'Coordinador de inspecciones', inspector: 'Inspector', ejecutivo: 'Ejecutivo de inspecciones', suscriptor: 'Suscriptor', inspeccionado: c.orden ? 'Ejecutivo de inspecciones' : 'Ejecutivo comercial' }[e.resp] || null; };
  SU.viaFlujo = function (c) { var F = window.SIRIUS_FLUJO, e = F && F.estado ? F.estado(c.estado) : null; return !!e && (e.resp === 'coordinador' || e.resp === 'suscriptor'); };
  // accion: 'suspender' | 'baja' | 'quitar'; rolQuitado: nombre del rol (solo 'quitar')
  SU.impactoUsuario = function (nombre, accion, rolQuitado) {
    var F = window.SIRIUS_FLUJO, activos = (SU.ctx.casos() || []).filter(function (c) { return c.activo && c.responsable === nombre; });
    var base = rolQuitado ? SU.base(rolQuitado) : null;
    var directos = [], porFlujo = [];
    activos.forEach(function (c) { var r = SU.rolDeCaso(c); if (base && r !== base) return; var it = { id: c.id, asegurado: c.asegurado || '', estado: c.estado, rol: r }; (SU.viaFlujo(c) ? porFlujo : directos).push(it); });
    var resp = []; if (F) {
      Object.keys(F.coordinadorPorSucursal || {}).forEach(function (s) { if (F.coordinadorPorSucursal[s] === nombre && (!base || base === 'Coordinador de inspecciones')) resp.push({ id: 'c:' + s, tipo: 'coordinador', clave: s, rol: 'Coordinador de inspecciones', txt: 'Coordinador de inspecciones ' + (s === '*' ? 'de todas las sucursales' : 'de ' + s), casos: porFlujo.filter(function (x) { return x.rol === 'Coordinador de inspecciones'; }) }); });
      Object.keys(F.suscriptorPorGrupo || {}).forEach(function (g) { if (F.suscriptorPorGrupo[g] === nombre && (!base || base === 'Suscriptor')) resp.push({ id: 's:' + g, tipo: 'suscriptor', clave: g, rol: 'Suscriptor', txt: 'Suscriptor del grupo ' + g, casos: porFlujo.filter(function (x) { return x.rol === 'Suscriptor'; }) }); }); }
    var agenda = 0; // visitas: las del inspector salen por los casos a su cargo
    return { casos: directos, flujo: resp, porFlujoSinConfig: porFlujo.filter(function (x) { return !resp.some(function (r) { return r.casos.indexOf(x) >= 0; }); }), total: directos.length + porFlujo.length, hay: directos.length > 0 || resp.length > 0, agenda: agenda };
  };
  SU.destinos = function (rol, excluir) { var base = SU.base(rol); return SU.usuarios().filter(function (u) { return u.estado === 'Activo' && u.nombre !== excluir && u.roles.some(function (r) { return SU.base(r) === base; }); }); };
  // asign: { casoId: nuevoNombre }, flujo: { idResp: nuevoNombre }
  SU.reasignar = function (de, asign, flujo, motivo, por) {
    var F = window.SIRIUS_FLUJO, casos = SU.ctx.casos() || [], n = 0;
    Object.keys(asign || {}).forEach(function (id) { var c = casos.find(function (x) { return x.id === id; }); if (!c || !asign[id]) return; SU.reasig[id] = { de: de, a: asign[id], motivo: motivo, por: por, fecha: SU.ahora(), rol: SU.rolDeCaso(c) }; n++; log(por, 'Caso ' + id, 'Reasignó el caso de ' + de + ' a ' + asign[id] + ' (' + SU.rolDeCaso(c) + '; el SLA no se reinicia)', motivo); });
    Object.keys(flujo || {}).forEach(function (k) { if (!flujo[k] || !F) return; var p = k.split(':'), clave = k.slice(2); if (p[0] === 'c') F.coordinadorPorSucursal[clave] = flujo[k]; else F.suscriptorPorGrupo[clave] = flujo[k]; log(por, 'Flujo y SLA › Responsables', (p[0] === 'c' ? 'Coordinador' : 'Suscriptor') + ' ' + (clave === '*' ? 'de todas las sucursales' : p[0] === 'c' ? 'de ' + clave : 'del grupo ' + clave) + ': ' + de + ' → ' + flujo[k], motivo); n++; });
    avisar(); return n;
  };
  // ---------- Facultad para aprobar honorarios (por usuario; etapa 11-c · DEC-139) ----------
  // Se activa en la ficha del usuario con su tope por honorario. Por defecto apagada; los ejemplos salen de SIRIUS_HONORARIOS.facultadCalificador.
  SU.facHon = SU.facHon || {};
  SU.facHonorarios = function (nombre) { if (SU.facHon[nombre]) return Object.assign({}, SU.facHon[nombre]); var Hd = window.SIRIUS_HONORARIOS, fc = Hd && Hd.facultadCalificador, ex = fc && fc.ejemplos && fc.ejemplos[nombre];
    return ex ? { activa: !!ex.activa, tope: ex.tope == null ? null : ex.tope } : { activa: !!(fc && fc.porDefecto), tope: null }; };
  // Los roles que traen la acción «Aprobar honorarios» en la matriz pueden tener esta facultad; Finanzas y Administrador la tienen sin límite.
  SU.aplicaFacHon = function (nombre) { var u = SU.usuario(nombre); return !!u && u.tipo === 'Interno' && u.roles.some(function (r) { var b = SU.base(r); return b === 'Ejecutivo de inspecciones'; }); };
  SU.impactoFacHon = function (nombre, activa, tope) { var H = window.SiriusHonorarios, hs = H ? H.lista().filter(function (x) { return x.estado === 'Por aprobar'; }) : [], ok = function (f) { return f.activa && (f.tope == null || true); };
    var antes = SU.facHonorarios(nombre), puede = function (f, x) { return f.activa && (f.tope == null || x.valor <= f.tope); }, nuevo = { activa: !!activa, tope: tope == null ? null : tope };
    var a = hs.filter(function (x) { return puede(antes, x); }), b = hs.filter(function (x) { return puede(nuevo, x); });
    return { porAprobar: hs.length, podiaAntes: a.length, puedeDespues: b.length, ids: b.map(function (x) { return x.caso; }), texto: hs.length ? 'Hay ' + hs.length + (hs.length === 1 ? ' honorario «Por aprobar»' : ' honorarios «Por aprobar»') + '; ' + nombre + ' podría aprobar ' + a.length + ' hoy y ' + b.length + ' con el cambio. Lo que supere el tope sigue pasando a Finanzas.' : 'No hay honorarios «Por aprobar» ahora; el cambio rige para los próximos.' }; };
  SU.editarFacHon = function (nombre, activa, tope, por, motivo) { var a = SU.facHonorarios(nombre), x = SU.usuario(nombre); if (!x) return false; var fm = function (f) { return f.activa ? 'activa' + (f.tope == null ? ' sin tope' : ' con tope de ' + (window.SIRIUS_COMPANIA ? window.SIRIUS_COMPANIA.formatoMonto(f.tope) : f.tope)) : 'apagada'; }, n = { activa: !!activa, tope: activa && tope != null ? tope : (activa ? null : null) };
    if (a.activa === n.activa && a.tope === n.tope) return false; var imp = SU.impactoFacHon(nombre, n.activa, n.tope); SU.facHon[nombre] = n;
    log(por, nombre, 'Facultad para aprobar honorarios: ' + fm(a) + ' → ' + fm(n), motivo, { impacto: imp.texto }); avisar(); return true; };
  // ---------- Facultades del inspector (solo lectura; se configuran en Niveles de calificación) ----------
  // P-6f-0 · DEC-216: la facultad de Vehículos publicada en la base (window.SIRIUS_FACULTADES { version, veh: { fac, tope, mue, exc } }) manda sobre la de ejemplo.
  SU.facVeh = function () { var SF = window.SIRIUS_FACULTADES, E = window.SIRIUS_EJEMPLO || {}; return (SF && SF.veh) || (E.facultades || {}).veh || null; };
  // Tope de suma asegurada efectivo: el del nivel más específico que lo define (cadena de excepciones de más a menos específica) o el global; sin ninguno, null (sin límite).
  SU.topeDe = function (cadena, Fv) { var def = function (e) { return !!e && e.tope != null && e.tope !== ''; }, src = (cadena || []).find(def);
    var lbl = function (e) { return e.level === 'tipo' ? 'del tipo de inspector ' + e.name.toLowerCase() : e.level === 'agencia' ? 'de la agencia ' + e.name : 'del inspector ' + e.name; };
    return src ? { tope: Number(src.tope), desde: 'Viene ' + lbl(src) } : def(Fv) ? { tope: Number(Fv.tope), desde: 'Viene del valor global' } : { tope: null, desde: '' }; };
  SU.fmtTope = function (n) { var C = window.SIRIUS_COMPANIA; return n == null ? 'Sin tope' : C && C.formatoMonto ? C.formatoMonto(Number(n), { decimales: Number(n) % 1 ? 2 : 0 }) : 'USD ' + n; };
  SU.facultadDe = function (nombre) {
    var E = window.SIRIUS_EJEMPLO; if (!E) return null; var ins = (E.inspectores || []).find(function (i) { return i.n === nombre; }), Fv = SU.facVeh(); if (!ins || !Fv) return null;
    var hoy = SU.ahora().slice(0, 10), ex = (Fv.exc || []).filter(function (e) { return e.desde <= hoy && (!e.hasta || e.hasta >= hoy); });
    var own = ex.find(function (e) { return e.level === 'insp' && e.name === ins.n; }), ag = ins.ag && ex.find(function (e) { return e.level === 'agencia' && e.name === ins.ag; }), tp = ex.find(function (e) { return e.level === 'tipo' && e.name === ins.tipo; }), src = own || ag || tp;
    var lbl = function (e) { return e.level === 'tipo' ? 'Tipo de inspector ' + e.name.toLowerCase() : e.level === 'agencia' ? 'Agencia ' + e.name : 'Inspector ' + e.name; };
    var fac = src ? src.fac : Fv.fac, mueOwn = own && own.mue !== '' && own.mue != null;
    var tp0 = SU.topeDe([own, ag, tp], Fv);
    return { ambito: 'Vehículos', fac: fac, desde: own ? 'asignada al inspector' : src ? 'heredada de ' + lbl(src) : 'heredada del valor global', mue: fac === 'Sin facultad' ? 'No aplica' : (mueOwn ? own.mue : Fv.mue) + ' %' + (mueOwn ? ' · del inspector' : ' · global'), hasta: src && src.hasta ? src.hasta : '', tope: tp0.tope, topeDesde: tp0.desde };
  };
  // ---------- Agencias ----------
  SU.agenciaDeInspector = function (nombreAg) { nombreAg = String(nombreAg || '').toLowerCase(); return SU.agencias().find(function (a) { var n = a.nombre.toLowerCase(); return n === nombreAg || n.indexOf(nombreAg) === 0; }) || null; };
  // Logo de la agencia para el encabezado del PDF: { archivo, nombre } o null si no subió ninguno.
  SU.logoAgencia = function (nombreAg) { var a = SU.agenciaDeInspector(nombreAg); return a && a.logoArchivo ? { archivo: a.logoArchivo, nombre: a.nombre } : null; };
  SU.editarAgencia = function (id, c, por, motivo) {
    var a = SU.agencia(id); if (!a) return []; var det = [];
    ['nombre', 'ruc', 'contacto', 'estado'].forEach(function (k) { if (c[k] !== undefined && c[k] !== a[k]) { det.push(k + ': ' + (a[k] || '—') + ' → ' + c[k]); a[k] = c[k]; } });
    if (c.sucursales && c.sucursales.join('|') !== a.sucursales.join('|')) { det.push('sucursales: ' + c.sucursales.join(', ')); a.sucursales = c.sucursales.slice(); }
    if (c.logoArchivo !== undefined && c.logoArchivo !== (a.logoArchivo || '')) { det.push(c.logoArchivo ? 'subió el logo' : 'quitó el logo'); if (c.logoArchivo) { a.logoArchivo = c.logoArchivo; a.logoNombre = c.logoNombre || 'logo'; a.logo = 'subido'; } else { delete a.logoArchivo; delete a.logoNombre; a.logo = null; } }
    if (det.length) log(por, 'Agencia ' + a.nombre, 'Editó la agencia: ' + det.join('; '), motivo); avisar(); return det;
  };
  // ---------- Etapa C2-3 · DEC-180: opción de la agencia «Sus inspectores completan su propio informe» ----------
  // Aplica a los casos cuya visita termina después del cambio: completaPropioEn(agencia, fin) mira el historial (cada cambio con su «desde»).
  SU.operacion = function (id) { var a = SU.agencia(id); if (!a) return null; if (!a.operacion) a.operacion = { completaInspector: false, historial: [] }; return a.operacion; };
  SU.completaPropioEn = function (id, fin) { var o = SU.operacion(id); if (!o) return false; var h = (o.historial || []).slice().sort(function (x, y) { return x.desde < y.desde ? -1 : 1; }), v = h.length ? h[0].de : o.completaInspector;
    h.forEach(function (x) { if (!fin || x.desde <= fin) v = x.a; }); return !!v; };
  SU.editarOperacion = function (id, valor, por, motivo) { var a = SU.agencia(id), o = SU.operacion(id); if (!a || !o || !!valor === !!o.completaInspector) return false; var f = SU.ahora();
    o.historial.unshift({ fecha: f, desde: f, por: por, de: !!o.completaInspector, a: !!valor, motivo: motivo || '' }); o.completaInspector = !!valor;
    log(por, 'Agencia ' + a.nombre, '«Sus inspectores completan su propio informe»: ' + (valor ? 'No → Sí' : 'Sí → No') + ' · aplica a las visitas que terminen desde ahora', motivo); avisar(); return true; };
  SU.controlCalidadDe = function (id) { return SU.usuarios().filter(function (u) { return u.agencia === id && u.roles.some(function (r) { return SU.base(r) === 'Control de calidad (agencia)'; }) && SU.estadoEf(u) !== 'Inactivo'; }); };
  SU.inspectoresDe = function (id) { return SU.usuarios().filter(function (u) { return u.agencia === id && SU.estadoEf(u) !== 'Inactivo'; }); };
  window.SiriusUsuarios = SU;
})();
