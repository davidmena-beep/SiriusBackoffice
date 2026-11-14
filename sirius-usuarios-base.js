// SIRIUS · Usuarios y agencias de la base (v1.0 · etapa P-6f-0g · DEC-233 · 18/10/2026).
// Con la conexión, Administración › Usuarios y roles lista, filtra y muestra la ficha con SIRIUS_CONEXION.usuarios y SIRIUS_CONEXION.agencias: ningún usuario sale del ejemplo.
// Contrato: usuarios = [{ nombre, email, rol, roles [], tipo ('Interno' | 'Agencia' | 'Independiente'), tipoInspector ('interno' | 'agencia' | 'independiente' | null), agencia (nombre o null),
// estado ('Activo' | 'Invitado' | 'Suspendido' | 'Inactivo'), celular, alcance { sucursales [], grupos [] } (vacío = todas / todos), zonas [], vinculado (booleano) }]; agencias = [{ nombre, estado }].
// Acciones: crearUsuario { nombre, email, celular, agencia, rol, roles, tipoInspector, alcance, zonas, motivo } → { ok, mensaje, activacion (url) };
// editarUsuario { email (el actual), cambios { … }, motivo } → { ok, mensaje }; cambiarEstadoUsuario { email, estado, motivo } → { ok, mensaje }.
// El cambio se ve al instante; con { ok: false } vuelve atrás y se devuelve el mensaje de la base. Motivo de 10 caracteres o más; el historial del usuario lo registra.
// El Administrador no puede quitarse su propio rol de Administrador ni suspenderse (o darse de baja) a sí mismo. En la prueba todos activan con correo y contraseña (DEC-128 queda para producción).
// La lista de la sesión, el historial y los enlaces de activación viven aquí (un solo módulo: los componentes vuelven a ejecutar los archivos de datos).
(function () {
  'use strict';
  const W = window; if (W.SiriusUsuariosBase) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), ON = [];
  const S = { ESTADOS: ['Activo', 'Invitado', 'Suspendido', 'Inactivo'], TIPOS: ['Interno', 'Agencia', 'Independiente'], hist: [], links: {}, _src: null, _lista: null, _agSrc: null, _ag: null };
  const C = () => W.SIRIUS_CONEXION || null;
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  S.activo = () => { const c = C(); return !!(c && c.activo === true); };
  const arr = (x) => (Array.isArray(x) ? x.filter((v) => v != null && v !== '').map(String) : []);
  const norm = (u) => { u = u || {}; const roles = arr(u.roles).length ? arr(u.roles) : arr([u.rol]), tipo = S.TIPOS.indexOf(u.tipo) >= 0 ? u.tipo : (u.agencia ? 'Agencia' : 'Interno');
    return { nombre: String(u.nombre || u.email || ''), email: String(u.email || '').trim().toLowerCase(), rol: u.rol || roles[0] || '', roles, tipo, tipoInspector: u.tipoInspector || null, agencia: u.agencia || null,
      estado: S.ESTADOS.indexOf(u.estado) >= 0 ? u.estado : 'Activo', celular: u.celular || '', alcance: { sucursales: arr((u.alcance || {}).sucursales), grupos: arr((u.alcance || {}).grupos) }, zonas: arr(u.zonas), vinculado: !!u.vinculado,
      activacion: u.activacion || null, cobertura: u.cobertura && typeof u.cobertura === 'object' ? JSON.parse(JSON.stringify(u.cobertura)) : null /* G-2b · DEC-223: si no viene, SiriusCobertura aplica migrar(zonas) */ }; };
  // Lista de la sesión: copia de SIRIUS_CONEXION.usuarios; si la base la reemplaza (otro arreglo), se vuelve a leer.
  S.lista = () => { const c = C(), src = c && Array.isArray(c.usuarios) ? c.usuarios : []; if (src !== S._src || !S._lista) { S._src = src; S._lista = src.map(norm); } return S._lista; };
  S.agencias = () => { const c = C(), src = c && Array.isArray(c.agencias) ? c.agencias : []; if (src !== S._agSrc || !S._ag) { S._agSrc = src; S._ag = src.map((a) => ({ nombre: String((a && a.nombre) || ''), estado: (a && a.estado) || 'Activa' })).filter((a) => a.nombre); } return S._ag; };
  S.usuario = (email) => S.lista().find((u) => u.email === String(email || '').trim().toLowerCase()) || null;
  S.yo = () => { const c = C(), u = (c && c.usuario) || {}; return String(u.email || '').trim().toLowerCase(); };
  S.esYo = (email) => !!S.yo() && S.yo() === String(email || '').trim().toLowerCase();
  S.esInspector = (roles) => arr(roles).some((r) => { const SU = W.SiriusUsuarios; return (SU && SU.base ? SU.base(r) : r) === 'Inspector'; });
  S.activacion = (email) => { const u = S.usuario(email); return S.links[String(email || '').toLowerCase()] || (u && u.activacion) || ''; };
  S.alcanceTxt = (a) => { a = a || {}; const s = arr(a.sucursales), g = arr(a.grupos); return (s.length ? s.join(', ') : 'Todas las sucursales') + ' · ' + (g.length ? g.join(', ') : 'Todos los grupos'); };
  S.contar = () => { const o = { total: 0 }; S.lista().forEach((u) => { o.total++; o[u.estado] = (o[u.estado] || 0) + 1; }); return o; };
  S.historial = (email) => (email ? S.hist.filter((x) => x.email === String(email).toLowerCase()) : S.hist.slice());
  // Estados a los que puede pasar (con el motivo de lo que no aplica).
  S.destinos = (u) => { const o = {}; if (!u) return o;
    S.ESTADOS.filter((e) => e !== 'Invitado').forEach((e) => { let r = '';
      if (e === u.estado) r = 'Ya está «' + e + '».';
      else if (e === 'Activo' && !u.vinculado) r = 'Aún no activó su cuenta: pasa a «Activo» al activarla con su correo y una contraseña.';
      else if (e === 'Suspendido' && u.estado === 'Invitado') r = 'Aún no activó su cuenta: para anular la invitación pásalo a «Inactivo».';
      else if (e !== 'Activo' && S.esYo(u.email)) r = e === 'Suspendido' ? 'No puedes suspenderte a ti mismo.' : 'No puedes darte de baja a ti mismo.';
      o[e] = r; });
    return o; };
  S.validarCorreo = (c) => { c = String(c || '').trim().toLowerCase(); if (!c) return 'Escribe el correo.'; return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) ? '' : 'Escribe un correo válido.'; };
  const motivoOk = (m) => String(m || '').trim().length >= 10;
  const ahora = () => { const SU = W.SiriusUsuarios; return SU && SU.ahora ? SU.ahora() : '2026-10-18T20:30'; };
  const registrar = (u, que, motivo, por, estado) => { const r = { fecha: ahora(), por: por || '', email: u.email, nombre: u.nombre, que, motivo: String(motivo || '').trim(), estado: estado || 'Guardado en la base' }; S.hist.unshift(r); return r; };
  // Llama a la base. Sin conexión no hace nada (la pantalla usa SiriusUsuarios, como antes).
  const base = (tipo, carga) => { const c = C(); if (!c || typeof c.accion !== 'function') return Promise.resolve({ ok: false, mensaje: 'No hay conexión con la base.' });
    let pr; try { pr = Promise.resolve(c.accion(tipo, carga)); } catch (e) { pr = Promise.resolve({ ok: false, mensaje: (e && e.message) || 'La base no respondió.' }); }
    return pr.then((r) => r || { ok: false, mensaje: 'La base no respondió.' }, (e) => ({ ok: false, mensaje: (e && e.message) || 'La base no respondió.' })); };
  const tipoDe = (d) => (d.agencia ? 'Agencia' : d.tipoInspector === 'independiente' || d.tipo === 'Independiente' ? 'Independiente' : 'Interno');
  // Crear: queda «Invitado» (sin cuenta vinculada) con el enlace de activación que devuelve la base.
  S.crear = (d, motivo, por) => { d = d || {}; const email = String(d.email || '').trim().toLowerCase(), roles = arr(d.roles);
    const err = !String(d.nombre || '').trim() ? 'Escribe el nombre.' : S.validarCorreo(email) || (!roles.length ? 'Elige al menos un rol.' : '') || (!motivoOk(motivo) ? 'Escribe el motivo (mínimo 10 caracteres).' : '');
    if (err) return Promise.resolve({ ok: false, validacion: true, mensaje: err });
    const insp = S.esInspector(roles), tipo = d.tipo || tipoDe(d);
    const carga = { nombre: String(d.nombre).trim(), email, celular: String(d.celular || '').trim(), agencia: tipo === 'Agencia' ? d.agencia || null : null, rol: d.rol && roles.indexOf(d.rol) >= 0 ? d.rol : roles[0], roles,
      tipoInspector: insp ? tipo.toLowerCase() : null, alcance: { sucursales: arr((d.alcance || {}).sucursales), grupos: arr((d.alcance || {}).grupos) }, zonas: insp ? arr(d.zonas) : [], motivo: String(motivo).trim() };
    const u = norm(Object.assign({}, carga, { tipo, estado: 'Invitado', vinculado: false })), L = S.lista(); L.push(u); const reg = registrar(u, 'Creado como «Invitado» · ' + u.roles.join(', '), motivo, por, 'Enviado a la base'); avisar();
    return base('crearUsuario', carga).then((r) => { if (r && r.ok) { if (r.activacion) S.links[email] = String(r.activacion); reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      const i = L.indexOf(u); if (i >= 0) L.splice(i, 1); const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el usuario.' }; }); };
  const CAMPOS = { email: 'Correo', celular: 'Celular', agencia: 'Agencia', roles: 'Roles', rol: 'Rol principal', tipoInspector: 'Tipo de inspector', alcance: 'Alcance', zonas: 'Zonas', cobertura: 'Cobertura' };
  const txt = (k, v) => (k === 'cobertura' ? (W.SiriusCobertura ? (v ? W.SiriusCobertura.corto(v) : 'Migrada de sus zonas') : '—') : k === 'alcance' ? S.alcanceTxt(v) : Array.isArray(v) ? (v.length ? v.join(', ') : '—') : v == null || v === '' ? '—' : String(v));
  // Editar: solo se envía lo que cambió (cambios { email, celular, agencia, rol, roles, tipoInspector, alcance, zonas }).
  S.editar = (email, cambios, motivo, por) => { const u = S.usuario(email); if (!u) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Ese usuario ya no está en la lista.' });
    const ch = {}; Object.keys(cambios || {}).forEach((k) => { if (CAMPOS[k] && JSON.stringify(cambios[k]) !== JSON.stringify(u[k])) ch[k] = clon(cambios[k]); });
    if (ch.email !== undefined) { const e = S.validarCorreo(ch.email); if (e) return Promise.resolve({ ok: false, validacion: true, mensaje: e }); ch.email = String(ch.email).trim().toLowerCase(); }
    if (ch.roles && !arr(ch.roles).length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Elige al menos un rol.' });
    if (ch.roles && S.esYo(u.email) && u.roles.indexOf('Administrador') >= 0 && ch.roles.indexOf('Administrador') < 0) return Promise.resolve({ ok: false, validacion: true, propio: true, mensaje: 'No puedes quitarte tu propio rol de Administrador.' });
    if (!Object.keys(ch).length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'No hay cambios para guardar.' });
    if (!motivoOk(motivo)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    if (ch.roles && !ch.rol && ch.roles.indexOf(u.rol) < 0) ch.rol = ch.roles[0];
    const antes = clon(u), actual = u.email, que = Object.keys(ch).filter((k) => k !== 'rol' || !ch.roles).map((k) => CAMPOS[k] + ': ' + (k === 'cobertura' && !antes[k] && W.SiriusCobertura ? W.SiriusCobertura.corto(W.SiriusCobertura.migrar(antes)) + ' (migrada de sus zonas)' : txt(k, antes[k])) + ' → ' + txt(k, ch[k])).join(' · ');
    Object.assign(u, clon(ch)); if (ch.agencia !== undefined) u.tipo = ch.agencia ? 'Agencia' : u.tipo === 'Agencia' ? 'Interno' : u.tipo;
    if (ch.email && S.links[actual]) { S.links[ch.email] = S.links[actual]; delete S.links[actual]; }
    const reg = registrar(u, que, motivo, por, 'Enviado a la base'); avisar();
    return base('editarUsuario', { email: actual, cambios: ch, motivo: String(motivo).trim() }).then((r) => { if (r && r.ok) { reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      Object.keys(u).forEach((k) => { delete u[k]; }); Object.assign(u, antes); if (ch.email && S.links[ch.email]) { S.links[actual] = S.links[ch.email]; delete S.links[ch.email]; }
      const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el cambio.' }; }); };
  // Cambiar estado: Activo, Suspendido o Inactivo.
  S.cambiarEstado = (email, estado, motivo, por) => { const u = S.usuario(email); if (!u) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Ese usuario ya no está en la lista.' });
    const no = S.destinos(u)[estado]; if (no === undefined) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Elige el estado nuevo.' }); if (no) return Promise.resolve({ ok: false, validacion: true, propio: S.esYo(u.email), mensaje: no });
    if (!motivoOk(motivo)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const antes = u.estado; u.estado = estado; const reg = registrar(u, 'Estado: ' + antes + ' → ' + estado, motivo, por, 'Enviado a la base'); avisar();
    return base('cambiarEstadoUsuario', { email: u.email, estado, motivo: String(motivo).trim() }).then((r) => { if (r && r.ok) { reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      u.estado = antes; const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el cambio.' }; }); };
  S.reset = () => { S.hist = []; S.links = {}; S._src = null; S._lista = null; S._agSrc = null; S._ag = null; avisar(); };
  W.SiriusUsuariosBase = S;
})();
