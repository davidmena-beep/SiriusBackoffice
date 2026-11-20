// SIRIUS · Usuarios y agencias de la base (v1.0 · etapa P-6f-0g · DEC-233 · 18/10/2026).
// Con la conexión, Administración › Usuarios y roles lista, filtra y muestra la ficha con SIRIUS_CONEXION.usuarios y SIRIUS_CONEXION.agencias: ningún usuario sale del ejemplo.
// Contrato: usuarios = [{ nombre, email, rol, roles [], tipo ('Interno' | 'Agencia' | 'Independiente'), tipoInspector ('interno' | 'agencia' | 'independiente' | null), agencia (nombre o null),
// estado ('Activo' | 'Invitado' | 'Suspendido' | 'Inactivo'), celular, alcance { sucursales [], grupos [] } (vacío = todas / todos), zonas [], vinculado (booleano) }]; agencias = [{ nombre, estado }].
// Etapa P-6f-b · DEC-214: usuarios[] llevan tipoIdentificacion ('Cédula' | 'Pasaporte') e identificacion (obligatorias y únicas); agencias[] llevan ruc, razonSocial y nombreComercial.
// crearUsuario y editarUsuario llevan { tipoIdentificacion, identificacion } (y agenciaRuc junto a agencia); guardarAgencia { ruc, razonSocial, nombreComercial, estado } → { ok, mensaje }.
// Acciones: crearUsuario { nombre, email, celular, agencia, rol, roles, tipoInspector, alcance, zonas, motivo } → { ok, mensaje, activacion (url) };
// editarUsuario { email (el actual), cambios { … }, motivo } → { ok, mensaje }; cambiarEstadoUsuario { email, estado, motivo } → { ok, mensaje }.
// P-6g-1e · DEC-249: reinvitarUsuario { email (el actual), nuevoEmail? (opcional), motivo } → { ok, mensaje, activacion (url) }. Solo el Administrador. Aplica a un «Invitado»
// (enlace vencido o perdido), a un «Inactivo» que nunca activó su cuenta y a un «Activo» cuando se quiere cambiar su correo de acceso (la cuenta actual se desvincula y la persona
// activa una cuenta nueva con el correo nuevo). El usuario queda «Invitado». editarUsuario con correo nuevo de un invitado también devuelve activacion; para los demás, la base
// responde { ok: false } con un mensaje que manda a «Volver a invitar» (la pantalla lo muestra tal cual, con el botón al lado).
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
    return { nombre: String(u.nombre || u.email || ''), tipoIdentificacion: u.identificacion ? (u.tipoIdentificacion || 'Cédula') : '', identificacion: String(u.identificacion || '').trim(), email: String(u.email || '').trim().toLowerCase(), rol: u.rol || roles[0] || '', roles, tipo, tipoInspector: u.tipoInspector || null, agencia: u.agencia || null, agenciaRuc: String(u.agenciaRuc || '').trim(),
      estado: S.ESTADOS.indexOf(u.estado) >= 0 ? u.estado : 'Activo', celular: u.celular || '', alcance: { sucursales: arr((u.alcance || {}).sucursales), grupos: arr((u.alcance || {}).grupos) }, zonas: arr(u.zonas), vinculado: !!u.vinculado,
      activacion: u.activacion || null, sucursal: u.sucursal || '', modalidades: arr(u.modalidades), ramos: arr(u.ramos), recibeOfertas: u.recibeOfertas || '', jornada: u.jornada && typeof u.jornada === 'object' ? JSON.parse(JSON.stringify(u.jornada)) : null, ultimoAcceso: u.ultimoAcceso || '', vence: u.vence || u.invitacionVence || '' /* U-3a · DEC-254: datos de la ficha única */, cobertura: u.cobertura && typeof u.cobertura === 'object' ? JSON.parse(JSON.stringify(u.cobertura)) : null /* G-2b · DEC-223: si no viene, SiriusCobertura aplica migrar(zonas) */, coberturaFilas: Array.isArray(u.coberturaFilas) ? JSON.parse(JSON.stringify(u.coberturaFilas)) : null, coberturaMixta: !!u.coberturaMixta /* R-3a · DEC-262: filas de la Red de inspectores; con ellas SiriusCobertura.cubre decide */ }; };
  // Lista de la sesión: copia de SIRIUS_CONEXION.usuarios; si la base la reemplaza (otro arreglo), se vuelve a leer.
  S.lista = () => { const c = C(), src = c && Array.isArray(c.usuarios) ? c.usuarios : []; if (src !== S._src || !S._lista) { S._src = src; S._lista = src.map(norm); } return S._lista; };
  S.agencias = () => { const c = C(), src = c && Array.isArray(c.agencias) ? c.agencias : []; if (src !== S._agSrc || !S._ag) { S._agSrc = src; S._ag = src.map((a) => ({ nombre: String((a && (a.nombreComercial || a.nombre || a.razonSocial)) || ''), razonSocial: String((a && (a.razonSocial || a.nombre)) || ''), nombreComercial: String((a && (a.nombreComercial || a.nombre)) || ''), ruc: String((a && a.ruc) || ''), estado: (a && a.estado) || 'Activa' })).filter((a) => a.nombre); } return S._ag; };
  S.agencia = (ref) => { const r = String(ref || '').trim(); return S.agencias().find((a) => (a.ruc && a.ruc === r) || a.nombre === r || a.razonSocial === r) || null; }; // DEC-214: por RUC o por nombre
  const MX = () => W.SiriusMaestros || null;
  // P-6f-d · DEC-214: la relación agencia–inspector es por RUC (agencias[].ruc = usuarios[].agenciaRuc = inspectores[].agenciaRuc). Sin RUC en alguno de los
  // dos lados («Sin identificación»), relación de transición por el nombre (comercial o razón social) con que llega la persona.
  const bajo = (x) => String(x || '').trim().toLowerCase();
  S.deAgencia = (p, a) => { if (!p || !a) return false; const pr = String(p.agenciaRuc || '').trim(), ar = String(a.ruc || '').trim();
    if (pr && ar) return pr === ar;
    const n = bajo(p.agencia); return !!n && (n === bajo(a.nombre) || n === bajo(a.razonSocial) || n === bajo(a.nombreComercial)); };
  S.agenciaDe = (p) => { if (!p) return null; const r = String(p.agenciaRuc || '').trim(); return (r && S.agencias().find((a) => a.ruc === r)) || (p.agencia ? S.agencia(p.agencia) : null); };
  S.baseInspectores = () => { const c = C(), src = c && Array.isArray(c.inspectores) ? c.inspectores : []; return src.filter((i) => i && i.nombre).map((i) => ({ nombre: String(i.nombre), identificacion: String(i.identificacion || '').trim(), agencia: i.agencia || null, agenciaRuc: String(i.agenciaRuc || '').trim(), estado: i.estado || 'Activo', roles: ['Inspector'] })); };
  // Usuarios de la agencia y sus inspectores (usuarios con rol Inspector + inspectores de la base sin usuario), sin repetir a la misma persona (identificación; sin ella, el nombre).
  S.usuariosDeAgencia = (a) => S.lista().filter((u) => S.deAgencia(u, a));
  S.inspectoresDeAgencia = (a) => { const visto = {}, out = [], cl = (p) => (p.identificacion ? 'i:' + p.identificacion.toUpperCase() : 'n:' + bajo(p.nombre));
    S.lista().filter((u) => S.deAgencia(u, a) && S.esInspector(u.roles)).concat(S.baseInspectores().filter((i) => S.deAgencia(i, a))).forEach((p) => { const k = cl(p); if (!visto[k]) { visto[k] = 1; out.push(p); } }); return out; };
  // DEC-214: identificación obligatoria, válida y única entre los usuarios de la base (excluye al que se edita).
  S.validarIdent = (tipo, ident, excluirEmail) => { const M = MX(); if (!M) return ''; const e = M.ident(tipo, ident); if (e) return e; const v = M.normal(tipo, ident), o = S.lista().find((u) => u.identificacion && u.identificacion.toUpperCase() === v.toUpperCase() && u.email !== String(excluirEmail || '').toLowerCase()); return o ? 'Esa identificación ya está registrada (' + o.nombre + '). La identificación es única en la compañía.' : ''; };
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
      else if (e === 'Activo' && !u.vinculado) r = u.estado === 'Inactivo' ? 'Este usuario nunca activó su cuenta: usa «Volver a invitar» para enviarle una invitación nueva' : 'Aún no activó su cuenta: pasa a «Activo» al activarla con su correo y una contraseña.';
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
    const err = !String(d.nombre || '').trim() ? 'Escribe el nombre.' : S.validarIdent(d.tipoIdentificacion || 'Cédula', d.identificacion, '') || S.validarCorreo(email) || (!roles.length ? 'Elige al menos un rol.' : '') || (!motivoOk(motivo) ? 'Escribe el motivo (mínimo 10 caracteres).' : '');
    if (err) return Promise.resolve({ ok: false, validacion: true, mensaje: err });
    const insp = S.esInspector(roles), tipo = d.tipo || tipoDe(d);
    const M0 = MX(), tId = d.tipoIdentificacion || 'Cédula', ag0 = tipo === 'Agencia' && d.agencia ? S.agencia(d.agencia) : null;
    const carga = { nombre: String(d.nombre).trim(), tipoIdentificacion: tId, identificacion: M0 ? M0.normal(tId, d.identificacion) : String(d.identificacion || '').trim(), email, celular: String(d.celular || '').trim(), agencia: tipo === 'Agencia' ? d.agencia || null : null, agenciaRuc: ag0 && ag0.ruc ? ag0.ruc : null, rol: d.rol && roles.indexOf(d.rol) >= 0 ? d.rol : roles[0], roles,
      tipoInspector: insp ? tipo.toLowerCase() : null, alcance: { sucursales: arr((d.alcance || {}).sucursales), grupos: arr((d.alcance || {}).grupos) }, zonas: insp ? arr(d.zonas) : [], motivo: String(motivo).trim() };
    ['sucursal', 'modalidades', 'ramos', 'recibeOfertas', 'jornada', 'cobertura'].forEach((k) => { if (d[k] != null && !(Array.isArray(d[k]) && !d[k].length)) carga[k] = clon(d[k]); }); /* U-3a · DEC-254: la ficha en modo nuevo */
    const u = norm(Object.assign({}, carga, { tipo, estado: 'Invitado', vinculado: false })), L = S.lista(); L.push(u); const reg = registrar(u, 'Creado como «Invitado» · ' + u.roles.join(', '), motivo, por, 'Enviado a la base'); avisar();
    return base('crearUsuario', carga).then((r) => { if (r && r.ok) { if (r.activacion) S.links[email] = String(r.activacion); reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      const i = L.indexOf(u); if (i >= 0) L.splice(i, 1); const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el usuario.', campo: (r && r.campo) || '' }; }); };
  const CAMPOS = { nombre: 'Nombre', tipo: 'Tipo', sucursal: 'Sucursal', modalidades: 'Modalidades', ramos: 'Ramos', recibeOfertas: 'Recibe ofertas', jornada: 'Jornada' /* U-3a · DEC-254 */, tipoIdentificacion: 'Tipo de identificación', identificacion: 'Identificación', agenciaRuc: 'RUC de la agencia', email: 'Correo', celular: 'Celular', agencia: 'Agencia', roles: 'Roles', rol: 'Rol principal', tipoInspector: 'Tipo de inspector', alcance: 'Alcance', zonas: 'Zonas', cobertura: 'Cobertura' };
  const txt = (k, v) => (k === 'jornada' ? (v && v.desde ? (W.SiriusFecha && W.SiriusFecha.jornadaTxt ? W.SiriusFecha.jornadaTxt(v) : v.desde + '–' + v.hasta) : '—') : k === 'cobertura' ? (W.SiriusCobertura ? (v ? W.SiriusCobertura.corto(v) : 'Migrada de sus zonas') : '—') : k === 'alcance' ? S.alcanceTxt(v) : Array.isArray(v) ? (v.length ? v.join(', ') : '—') : v == null || v === '' ? '—' : String(v));
  // Editar: solo se envía lo que cambió (cambios { email, celular, agencia, rol, roles, tipoInspector, alcance, zonas }).
  S.editar = (email, cambios, motivo, por) => { const u = S.usuario(email); if (!u) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Ese usuario ya no está en la lista.' });
    const ch = {}; Object.keys(cambios || {}).forEach((k) => { if (CAMPOS[k] && JSON.stringify(cambios[k]) !== JSON.stringify(u[k])) ch[k] = clon(cambios[k]); });
    if (ch.identificacion !== undefined || ch.tipoIdentificacion !== undefined) { const ti = ch.tipoIdentificacion || u.tipoIdentificacion || 'Cédula', iv = ch.identificacion !== undefined ? ch.identificacion : u.identificacion, e = S.validarIdent(ti, iv, u.email); if (e) return Promise.resolve({ ok: false, validacion: true, mensaje: e }); ch.tipoIdentificacion = ti; ch.identificacion = MX() ? MX().normal(ti, iv) : iv; } /* DEC-214 */
    if (ch.tipo !== undefined) { if (S.TIPOS.indexOf(ch.tipo) < 0) return Promise.resolve({ ok: false, validacion: true, campo: 'tipo', mensaje: 'Elige el tipo.' });
      const ag1 = ch.agencia !== undefined ? ch.agencia : u.agencia; if (ch.tipo === 'Agencia' && !ag1) return Promise.resolve({ ok: false, validacion: true, campo: 'agencia', mensaje: 'Elige la agencia.' });
      if (ch.tipo !== 'Agencia' && u.agencia) { ch.agencia = null; ch.agenciaRuc = ''; }
      if (S.esInspector(ch.roles || u.roles)) ch.tipoInspector = ch.tipo.toLowerCase(); } /* U-3a · DEC-254: el tipo viaja con su agencia (o sin ella) y el tipo de inspector */
    if (ch.agencia) { const a = S.agencia(ch.agencia); if (a && a.ruc) ch.agenciaRuc = a.ruc; }
    if (ch.email !== undefined) { const e = S.validarCorreo(ch.email); if (e) return Promise.resolve({ ok: false, validacion: true, mensaje: e }); ch.email = String(ch.email).trim().toLowerCase(); }
    if (ch.roles && !arr(ch.roles).length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Elige al menos un rol.' });
    if (ch.roles && S.esYo(u.email) && u.roles.indexOf('Administrador') >= 0 && ch.roles.indexOf('Administrador') < 0) return Promise.resolve({ ok: false, validacion: true, propio: true, mensaje: 'No puedes quitarte tu propio rol de Administrador.' });
    if (!Object.keys(ch).length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'No hay cambios para guardar.' });
    if (!motivoOk(motivo)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    if (ch.roles && !ch.rol && ch.roles.indexOf(u.rol) < 0) ch.rol = ch.roles[0];
    const antes = clon(u), actual = u.email, que = Object.keys(ch).filter((k) => k !== 'rol' || !ch.roles).map((k) => CAMPOS[k] + ': ' + (k === 'cobertura' && !antes[k] && W.SiriusCobertura ? W.SiriusCobertura.corto(W.SiriusCobertura.migrar(antes)) + ' (migrada de sus zonas)' : txt(k, antes[k])) + ' → ' + txt(k, ch[k])).join(' · ');
    Object.assign(u, clon(ch)); if (ch.agencia !== undefined && ch.tipo === undefined) u.tipo = ch.agencia ? 'Agencia' : u.tipo === 'Agencia' ? 'Interno' : u.tipo;
    if (ch.email && S.links[actual]) { S.links[ch.email] = S.links[actual]; delete S.links[actual]; }
    const reg = registrar(u, que, motivo, por, 'Enviado a la base'); avisar();
    return base('editarUsuario', { email: actual, cambios: ch, motivo: String(motivo).trim() }).then((r) => { if (r && r.ok) { if (r.activacion) S.links[ch.email || actual] = String(r.activacion); reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      Object.keys(u).forEach((k) => { delete u[k]; }); Object.assign(u, antes); if (ch.email && S.links[ch.email]) { S.links[actual] = S.links[ch.email]; delete S.links[ch.email]; }
      const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el cambio.', campo: (r && r.campo) || '' }; }); };
  // Cambiar estado: Activo, Suspendido o Inactivo.
  S.cambiarEstado = (email, estado, motivo, por) => { const u = S.usuario(email); if (!u) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Ese usuario ya no está en la lista.' });
    const no = S.destinos(u)[estado]; if (no === undefined) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Elige el estado nuevo.' }); if (no) return Promise.resolve({ ok: false, validacion: true, propio: S.esYo(u.email), mensaje: no });
    if (!motivoOk(motivo)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const antes = u.estado; u.estado = estado; const reg = registrar(u, 'Estado: ' + antes + ' → ' + estado, motivo, por, 'Enviado a la base'); avisar();
    return base('cambiarEstadoUsuario', { email: u.email, estado, motivo: String(motivo).trim() }).then((r) => { if (r && r.ok) { reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      u.estado = antes; const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó el cambio.' }; }); };
  // P-6g-1e · DEC-249: «Volver a invitar». Aplica a Invitado, a Inactivo que nunca activó y a Activo (para cambiar el correo de acceso).
  S.reinvitarMotivo = (u) => { if (!u) return 'Ese usuario ya no está en la lista.'; if (u.estado === 'Invitado' || (u.estado === 'Inactivo' && !u.vinculado) || u.estado === 'Activo') return ''; return u.estado === 'Suspendido' ? 'Está suspendido: reactívalo primero.' : 'Está dado de baja y ya usó su cuenta: no se vuelve a invitar.'; };
  S.reinvitarAvisoActivo = 'La cuenta actual se desvincula; la persona activará una cuenta nueva con el correo nuevo.';
  S.sugiereReinvitar = (msg) => /volver a invitar/i.test(String(msg || ''));
  S.reinvitar = (email, nuevoEmail, motivo, por) => { const u = S.usuario(email); if (!u) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Ese usuario ya no está en la lista.' });
    const no = S.reinvitarMotivo(u); if (no) return Promise.resolve({ ok: false, validacion: true, mensaje: no });
    const nuevo = String(nuevoEmail || '').trim().toLowerCase(), cambia = !!nuevo && nuevo !== u.email;
    if (nuevo) { const e = S.validarCorreo(nuevo); if (e) return Promise.resolve({ ok: false, validacion: true, mensaje: e }); }
    if (u.estado === 'Activo' && !cambia) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el correo nuevo: a un usuario activo solo se le vuelve a invitar para cambiar su correo de acceso.' });
    if (!motivoOk(motivo)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const antes = clon(u), actual = u.email, linkAntes = S.links[actual], que = (u.estado === 'Activo' ? 'Cuenta desvinculada y nueva invitación' : 'Nueva invitación') + (cambia ? ' · correo: ' + actual + ' → ' + nuevo : ' · mismo correo (el enlace anterior deja de valer)');
    if (cambia) u.email = nuevo; u.estado = 'Invitado'; u.vinculado = false; delete S.links[actual];
    const reg = registrar(u, que, motivo, por, 'Enviado a la base'); avisar();
    const carga = { email: actual, motivo: String(motivo).trim() }; if (cambia) carga.nuevoEmail = nuevo;
    return base('reinvitarUsuario', carga).then((r) => { if (r && r.ok) { S.links[u.email] = r.activacion ? String(r.activacion) : ''; reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r, { email: u.email }); }
      Object.keys(u).forEach((k) => { delete u[k]; }); Object.assign(u, antes); if (linkAntes) S.links[actual] = linkAntes; const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó la invitación.' }; }); };
  // DEC-214 · guardarAgencia { ruc, razonSocial, nombreComercial, estado } → { ok, mensaje }. Crea o actualiza (por RUC; refRuc = el RUC actual si cambia).
  S.guardarAgencia = (d, motivo, por, refRuc) => { d = d || {}; const M = MX(), ruc = String(d.ruc || '').trim(), rs = String(d.razonSocial || '').trim(), nc = String(d.nombreComercial || '').trim(), est = d.estado || 'Activa';
    const err = (M ? M.ruc(ruc) : (!/^\d{13}$/.test(ruc) ? 'El RUC tiene 13 dígitos.' : '')) || (S.agencias().some((a) => a.ruc === ruc && a.ruc !== String(refRuc || '')) ? 'Ese RUC ya es de otra agencia de la base. El RUC es único.' : '') || (rs.length < 3 ? 'Escribe la razón social.' : '') || (nc.length < 2 ? 'Escribe el nombre comercial.' : '') || (!motivoOk(motivo) ? 'Escribe el motivo (mínimo 10 caracteres).' : '');
    if (err) return Promise.resolve({ ok: false, validacion: true, mensaje: err });
    const L = S.agencias(), prev = L.find((a) => (refRuc && a.ruc === refRuc) || a.ruc === ruc) || null, antes = prev ? clon(prev) : null, nueva = { nombre: nc, razonSocial: rs, nombreComercial: nc, ruc, estado: est };
    if (prev) Object.assign(prev, nueva); else L.push(nueva);
    const reg = { fecha: ahora(), por: por || '', email: '', nombre: 'Agencia ' + nc, que: (prev ? 'Agencia actualizada' : 'Agencia creada') + ' · RUC ' + ruc + ' · ' + rs + ' · ' + est, motivo: String(motivo).trim(), estado: 'Enviado a la base' }; S.hist.unshift(reg); avisar();
    return base('guardarAgencia', { ruc, razonSocial: rs, nombreComercial: nc, estado: est }).then((r) => { if (r && r.ok) { reg.estado = 'Guardado en la base'; avisar(); return Object.assign({ ok: true }, r); }
      if (prev) { Object.keys(prev).forEach((k) => { delete prev[k]; }); Object.assign(prev, antes); } else { const i = L.indexOf(nueva); if (i >= 0) L.splice(i, 1); } const j = S.hist.indexOf(reg); if (j >= 0) S.hist.splice(j, 1); avisar(); return { ok: false, mensaje: (r && r.mensaje) || 'La base no guardó la agencia.' }; }); };
  // U-3a · DEC-254: quién liquida los honorarios del inspector (la misma regla que usa Liquidaciones): la agencia, él mismo (independiente) o nadie (interno).
  S.proveedorDe = (u) => { if (!u) return null; if (u.tipo === 'Agencia') { const a = S.agenciaDe(u); return { tipo: 'agencia', identificacion: (a && a.ruc) || u.agenciaRuc || '', nombre: (a && a.nombre) || u.agencia || '' }; }
    if (u.tipo === 'Independiente' || u.tipoInspector === 'independiente') return { tipo: 'inspector', identificacion: u.identificacion || '', nombre: u.nombre }; return null; };
  // U-1: crearUsuario y reinvitarUsuario envían la invitación por correo (función sirius-invitar). La respuesta dice si el correo salió:
  // { correoEnviado: true | false } (también se acepta { correo: { enviado } } o { invitacion: { correoEnviado } }); sin el dato, null (la pantalla muestra el enlace).
  S.correoSalio = (r) => { if (!r) return null; if (typeof r.correoEnviado === 'boolean') return r.correoEnviado; if (r.correo && typeof r.correo === 'object' && typeof r.correo.enviado === 'boolean') return r.correo.enviado; if (r.invitacion && typeof r.invitacion.correoEnviado === 'boolean') return r.invitacion.correoEnviado; return null; };
  S.refrescar = () => { S._src = null; S._lista = null; S._agSrc = null; S._ag = null; avisar(); }; // U-3a · DEC-254: vuelve a leer lo que tiene la base (lo guardado manda)
  S.reset = () => { S.hist = []; S.links = {}; S._src = null; S._lista = null; S._agSrc = null; S._ag = null; avisar(); };
  W.SiriusUsuariosBase = S;
})();
