// SIRIUS · Usuarios y agencias de la base, con la conexión simulada (v1.0 · provisional · etapa P-6f-0g · DEC-233 · 18/10/2026)
// Escenas: cxusuarios (8 usuarios de la base y la ficha de un usuario vinculado), cxusuariocrear (crear una inspectora de agencia: queda «Invitado» con su enlace
// de activación) y cxusuarioeditar (cambiar roles con motivo; ?cxdup=1 escribe un correo que ya usa otro usuario y la base responde { ok: false, «El correo ya lo usa otro usuario» };
// ?cxyo=1 abre la propia ficha del Administrador sin el rol de Administrador para ver el aviso). Los correos son los de las cuentas de prueba de la base, no los del ejemplo.
// Forma del contrato: ver sirius-usuarios-base.js. Se suma a SIRIUS_CX_COORD (datos-cx-coordinacion.js): las mismas escenas simuladas (cxSimBoot), que se limpian al cambiar de escena.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC) return;
  const ADM = { nombre: 'Andrea Salazar', email: 'andrea.salazar.admin@gmail.com', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
  const T = (s, g) => ({ sucursales: s || [], grupos: g || [] });
  // 8 usuarios de la base: 5 activos (vinculados), 2 invitados y 1 inactivo.
  const USUARIOS = [
    { nombre: 'Andrea Salazar', email: ADM.email, rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'], tipo: 'Interno', tipoInspector: null, agencia: null, estado: 'Activo', celular: '0991234567', alcance: T(), zonas: [], vinculado: true },
    { nombre: 'David Mena', email: 'david.mena.coordinador+agencia@gmail.com', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones'], tipo: 'Agencia', tipoInspector: null, agencia: 'Eurosurvey', estado: 'Activo', celular: '0998801245', alcance: T(['Quito', 'Guayaquil'], ['Vehículos']), zonas: [], vinculado: true },
    { nombre: 'Gabriela Toapanta', email: 'gabriela.toapanta.inspectora@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Interno', tipoInspector: 'interno', agencia: null, estado: 'Activo', celular: '0984412378', alcance: T(['Quito']), zonas: ['Quito'], vinculado: true },
    { nombre: 'Mauricio Endara', email: 'mauricio.endara.inspector+eurosurvey@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Agencia', tipoInspector: 'agencia', agencia: 'Eurosurvey', estado: 'Activo', celular: '0987745120', alcance: T(['Quito']), zonas: ['Quito'], vinculado: true },
    { nombre: 'Luis Andrade', email: 'luis.andrade.independiente@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Independiente', tipoInspector: 'independiente', agencia: null, estado: 'Activo', celular: '0995521304', alcance: T(['Quito', 'Ambato']), zonas: ['Quito', 'Ambato'], vinculado: true },
    { nombre: 'Carolina Vega', email: 'carolina.vega.comercial@gmail.com', rol: 'Ejecutivo comercial', roles: ['Ejecutivo comercial'], tipo: 'Interno', tipoInspector: null, agencia: null, estado: 'Invitado', celular: '0996640021', alcance: T(['Quito']), zonas: [], vinculado: false },
    { nombre: 'Sofía Arteaga', email: 'sofia.arteaga.inspectora+andinas@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Agencia', tipoInspector: 'agencia', agencia: 'Inspecciones Andinas', estado: 'Invitado', celular: '0983307719', alcance: T(['Ambato', 'Cuenca']), zonas: ['Ambato', 'Cuenca'], vinculado: false },
    { nombre: 'Diego Salinas', email: 'diego.salinas.independiente@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Independiente', tipoInspector: 'independiente', agencia: null, estado: 'Inactivo', celular: '0992218806', alcance: T(['Quito']), zonas: ['Quito'], vinculado: true },
  ];
  const AGENCIAS = [{ nombre: 'Eurosurvey', estado: 'Activa' }, { nombre: 'Inspecciones Andinas', estado: 'Activa' }, { nombre: 'Peritajes del Pacífico', estado: 'Inactiva' }];
  // escena → qué abre la pantalla (usuariosEscena): ficha, crear o editar con su borrador.
  const ESC = {
    cxusuarios: { panel: 'ficha', email: 'david.mena.coordinador+agencia@gmail.com' },
    cxusuariocrear: { panel: 'crear', d: { nombre: 'Valeria Cevallos', email: 'valeria.cevallos.inspectora+eurosurvey@gmail.com', celular: '0991187245', tipo: 'Agencia', agencia: 'Eurosurvey', roles: ['Inspector'], sucursales: ['Quito'], grupos: ['Vehículos'], zonas: ['Quito'] }, motivo: 'Nueva inspectora de Eurosurvey para la zona de Quito.' },
    cxusuarioeditar: { panel: 'editar', email: 'david.mena.coordinador+agencia@gmail.com', d: { roles: ['Coordinador de inspecciones', 'Ejecutivo de inspecciones'] }, motivo: 'También revisará los informes de Eurosurvey en Quito.' },
  };
  const q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  CC.cxSim = function (escena) { const e = ESC[escena]; if (!e) return baseCC(escena);
    const ue = JSON.parse(JSON.stringify(e));
    if (escena === 'cxusuarioeditar' && q('cxdup') === '1') ue.d.email = 'luis.andrade.independiente@gmail.com'; // la base responde que el correo ya lo usa otro usuario
    if (escena === 'cxusuarioeditar' && q('cxyo') === '1') { ue.email = ADM.email; ue.d = { roles: ['Coordinador de inspecciones'] }; ue.motivo = 'Dejo la administración a otra persona del área.'; } // el aviso del propio rol de Administrador
    return { usuario: ADM, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: [], usuarios: JSON.parse(JSON.stringify(USUARIOS)), agencias: JSON.parse(JSON.stringify(AGENCIAS)), usuariosEscena: ue }; };
  // Base simulada: el correo es único; crear devuelve el enlace de activación; editar y cambiar estado guardan en usuarios.
  const fnv = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); };
  const token = (s) => fnv(s) + fnv(s + '|activar'); // fijo por correo: el mismo enlace en cada prueba
  CC.aplicar = function (X, tipo, d) { if (['crearUsuario', 'editarUsuario', 'cambiarEstadoUsuario'].indexOf(tipo) < 0 || !X || !Array.isArray(X.usuarios)) return baseAp(X, tipo, d);
    const U = X.usuarios, de = (m) => U.find((u) => u.email === String(m || '').toLowerCase()); d = d || {};
    if (tipo === 'crearUsuario') { if (de(d.email)) return { ok: false, mensaje: 'El correo ya lo usa otro usuario' };
      U.push({ nombre: d.nombre, email: d.email, rol: d.rol, roles: d.roles, tipo: d.agencia ? 'Agencia' : d.tipoInspector === 'independiente' ? 'Independiente' : 'Interno', tipoInspector: d.tipoInspector, agencia: d.agencia, estado: 'Invitado', celular: d.celular, alcance: d.alcance, zonas: d.zonas, vinculado: false });
      return { ok: true, mensaje: 'Usuario creado en la base', activacion: 'https://sirius-prueba.asur.ec/activar?token=' + token(d.email) }; }
    const u = de(d.email); if (!u) return { ok: false, mensaje: 'El usuario no existe en la base' };
    if (tipo === 'editarUsuario') { const ch = d.cambios || {}; if (ch.email && ch.email !== u.email && de(ch.email)) return { ok: false, mensaje: 'El correo ya lo usa otro usuario' };
      Object.assign(u, JSON.parse(JSON.stringify(ch))); if (ch.agencia !== undefined) u.tipo = ch.agencia ? 'Agencia' : u.tipo === 'Agencia' ? 'Interno' : u.tipo; return { ok: true, mensaje: 'Usuario actualizado en la base' }; }
    if (d.estado === 'Activo' && !u.vinculado) return { ok: false, mensaje: 'El usuario aún no activó su cuenta' };
    u.estado = d.estado; return { ok: true, mensaje: 'Estado actualizado en la base' }; };
  CC.cxUsuarios = { usuarios: USUARIOS, agencias: AGENCIAS, escenas: ESC };
})();
