// SIRIUS · Usuarios y agencias de la base, con la conexión simulada (v1.2 · provisional · etapa P-6f-0g · DEC-233 · ajustes P-6f-0h y G-2b · 18/10/2026)
// Escenas: cxusuarios (8 usuarios de la base y la ficha de un usuario vinculado), cxusuariocrear (crear una inspectora de agencia: queda «Invitado» con su enlace
// de activación) y cxusuarioeditar (cambiar roles con motivo; ?cxdup=1 escribe un correo que ya usa otro usuario y la base responde { ok: false, «El correo ya lo usa otro usuario» };
// ?cxyo=1 abre la propia ficha del Administrador sin el rol de Administrador para ver el aviso). Los correos son los de las cuentas de prueba de la base, no los del ejemplo.
// cxusuarioestado (P-6f-0h): «Cambiar estado» de un usuario activo; ?cxestado=1 abre con «Suspendido» y motivo, ?cxmismo=1 con el estado actual y motivo (el botón sigue deshabilitado).
// Forma del contrato: ver sirius-usuarios-base.js. Se suma a SIRIUS_CX_COORD (datos-cx-coordinacion.js): las mismas escenas simuladas (cxSimBoot), que se limpian al cambiar de escena.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC) return;
  const ADM = { nombre: 'Andrea Salazar', tipoIdentificacion: 'Cédula', identificacion: '0909991010', email: 'andrea.salazar.admin@gmail.com', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
  const T = (s, g) => ({ sucursales: s || [], grupos: g || [] });
  // 8 usuarios de la base: 5 activos (vinculados), 2 invitados y 1 inactivo.
  const USUARIOS = [
    { nombre: 'Andrea Salazar', tipoIdentificacion: 'Cédula', identificacion: '0909991010', email: ADM.email, rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'], tipo: 'Interno', tipoInspector: null, agencia: null, estado: 'Activo', celular: '0991234567', alcance: T(), zonas: [], vinculado: true },
    { nombre: 'David Mena', tipoIdentificacion: 'Cédula', identificacion: '1709991218', email: 'david.mena.coordinador+agencia@gmail.com', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones'], tipo: 'Agencia', tipoInspector: null, agencia: 'Eurosurvey', estado: 'Activo', celular: '0998801245', alcance: T(['Quito', 'Guayaquil'], ['Vehículos']), zonas: [], vinculado: true },
    { nombre: 'Gabriela Toapanta', tipoIdentificacion: 'Cédula', identificacion: '0909991226', email: 'gabriela.toapanta.inspectora@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Interno', tipoInspector: 'interno', agencia: null, estado: 'Activo', celular: '0984412378', alcance: T(['Quito']), zonas: ['Quito'], vinculado: true },
    { nombre: 'Mauricio Endara', tipoIdentificacion: 'Cédula', identificacion: '0909991135', email: 'mauricio.endara.inspector+eurosurvey@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Agencia', tipoInspector: 'agencia', agencia: 'Eurosurvey', estado: 'Activo', celular: '0987745120', alcance: T(['Quito']), zonas: ['Quito'], vinculado: true },
    { nombre: 'Luis Andrade', tipoIdentificacion: 'Cédula', identificacion: '1709991119', email: 'luis.andrade.independiente@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Independiente', tipoInspector: 'independiente', agencia: null, estado: 'Activo', celular: '0995521304', alcance: T(['Quito', 'Ambato']), zonas: ['Quito', 'Ambato'], vinculado: true },
    { nombre: 'Carolina Vega', tipoIdentificacion: 'Cédula', identificacion: '1709991234', email: 'carolina.vega.comercial@gmail.com', rol: 'Ejecutivo comercial', roles: ['Ejecutivo comercial'], tipo: 'Interno', tipoInspector: null, agencia: null, estado: 'Invitado', celular: '0996640021', alcance: T(['Quito']), zonas: [], vinculado: false },
    { nombre: 'Sofía Arteaga', tipoIdentificacion: 'Cédula', identificacion: '1709991143', email: 'sofia.arteaga.inspectora+andinas@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Agencia', tipoInspector: 'agencia', agencia: 'Inspecciones Andinas', estado: 'Invitado', celular: '0983307719', alcance: T(['Ambato', 'Cuenca']), zonas: ['Ambato', 'Cuenca'], vinculado: false },
    { nombre: 'Diego Salinas', tipoIdentificacion: 'Cédula', identificacion: '1709991242', email: 'diego.salinas.independiente@gmail.com', rol: 'Inspector', roles: ['Inspector'], tipo: 'Independiente', tipoInspector: 'independiente', agencia: null, estado: 'Inactivo', celular: '0992218806', alcance: T(['Quito']), zonas: ['Quito'], vinculado: true },
  ];
  // P-6f-b · DEC-214: agencias con RUC, razón social y nombre comercial; usuarios con su identificación (de prueba). Carlos Mora es un inspector de la base sin usuario en SIRIUS:
  // su cédula no está en usuarios[], así que solo la base detecta que está repetida.
  const AGENCIAS = [{ nombre: 'Eurosurvey', razonSocial: 'Eurosurvey S.A.', nombreComercial: 'Eurosurvey', ruc: '1791456320001', estado: 'Activa' }, { nombre: 'Inspecciones Andinas', razonSocial: 'Inspecciones Andinas Cía. Ltda.', nombreComercial: 'Inspecciones Andinas', ruc: '1792788441001', estado: 'Activa' }, { nombre: 'Peritajes del Pacífico', razonSocial: 'Peritajes del Pacífico S.A.', nombreComercial: 'Peritajes del Pacífico', ruc: '0992671543001', estado: 'Inactiva' }];
  const INSPECTORES_BASE = [{ nombre: 'Carlos Mora', tipoIdentificacion: 'Cédula', identificacion: '1709991275', tipo: 'Independiente', estado: 'Inactivo' }];
  // escena → qué abre la pantalla (usuariosEscena): ficha, crear o editar con su borrador.
  const ESC = {
    cxusuarios: { panel: 'ficha', email: 'david.mena.coordinador+agencia@gmail.com' },
    cxusuariocrear: { panel: 'crear', d: { nombre: 'Valeria Cevallos', email: 'valeria.cevallos.inspectora+eurosurvey@gmail.com', celular: '0991187245', tipo: 'Agencia', agencia: 'Eurosurvey', roles: ['Inspector'], sucursales: ['Quito'], grupos: ['Vehículos'], zonas: ['Quito'] }, motivo: 'Nueva inspectora de Eurosurvey para la zona de Quito.' },
    cxcobertura: { panel: 'ficha', email: 'mauricio.endara.inspector+eurosurvey@gmail.com' }, // G-2b · DEC-223: su cobertura (sin cobertura en la base: migrada de sus zonas, «Sucursales: Quito»); guardar envía editarUsuario { cambios: { cobertura } } (?cxok=0: { ok: false })
    cxusuarioestado: { panel: 'estado', email: 'gabriela.toapanta.inspectora@gmail.com', estado: '', motivo: '' }, // ?cxestado=1: «Suspendido» con motivo; ?cxmismo=1: su estado actual con motivo
    cxmaestros: { panel: 'crear', d: { nombre: 'Valeria Cevallos', tipoIdentificacion: 'Cédula', identificacion: '0909991259', email: 'valeria.cevallos.inspectora+eurosurvey@gmail.com', celular: '0991187245', tipo: 'Agencia', agencia: 'Eurosurvey', roles: ['Inspector'], sucursales: ['Quito'], grupos: ['Vehículos'], zonas: ['Quito'] }, motivo: 'Nueva inspectora de Eurosurvey para la zona de Quito.' }, // P-6f-b · DEC-214 (?cxdup=1: la cédula de Carlos Mora; ?fvista=agencia: guardarAgencia)
    cxusuarioeditar: { panel: 'editar', email: 'david.mena.coordinador+agencia@gmail.com', d: { roles: ['Coordinador de inspecciones', 'Ejecutivo de inspecciones'] }, motivo: 'También revisará los informes de Eurosurvey en Quito.' },
  };
  const q = (k) => { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  const baseCC = CC.cxSim.bind(CC), baseAp = CC.aplicar.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  CC.cxSim = function (escena) { const e = ESC[escena]; if (!e) return baseCC(escena);
    const ue = JSON.parse(JSON.stringify(e));
    if (escena === 'cxusuarioeditar' && q('cxdup') === '1') ue.d.email = 'luis.andrade.independiente@gmail.com'; // la base responde que el correo ya lo usa otro usuario
    if (escena === 'cxusuarioeditar' && q('cxyo') === '1') { ue.email = ADM.email; ue.d = { roles: ['Coordinador de inspecciones'] }; ue.motivo = 'Dejo la administración a otra persona del área.'; } // el aviso del propio rol de Administrador
    if (escena === 'cxmaestros' && q('cxdup') === '1') ue.d.identificacion = '1709991275';
    if (escena === 'cxmaestros' && q('fvista') === 'agencia') { ue.panel = 'agencia'; ue.d = { ruc: '1793012345001', razonSocial: 'Verifica Inspecciones Técnicas S.A.', nombreComercial: 'Verifica', estado: 'Activa' }; ue.motivo = 'Nueva agencia de inspección para Quito y Guayaquil.'; }
    if (escena === 'cxusuarioestado' && q('cxestado') === '1') { ue.estado = 'Suspendido'; ue.motivo = 'Licencia sin sueldo por tres meses.'; }
    if (escena === 'cxusuarioestado' && q('cxmismo') === '1') { ue.estado = 'Activo'; ue.motivo = 'Se confirma que sigue activa en el área.'; }
    return { usuario: ADM, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: JSON.parse(JSON.stringify(INSPECTORES_BASE)), usuarios: JSON.parse(JSON.stringify(USUARIOS)), agencias: JSON.parse(JSON.stringify(AGENCIAS)), usuariosEscena: ue }; };
  // Base simulada: el correo es único; crear devuelve el enlace de activación; editar y cambiar estado guardan en usuarios.
  const fnv = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); };
  const token = (s) => fnv(s) + fnv(s + '|activar'); // fijo por correo: el mismo enlace en cada prueba
  CC.aplicar = function (X, tipo, d) { if (['crearUsuario', 'editarUsuario', 'cambiarEstadoUsuario', 'guardarAgencia'].indexOf(tipo) < 0 || !X || !Array.isArray(X.usuarios)) return baseAp(X, tipo, d);
    const U = X.usuarios, de = (m) => U.find((u) => u.email === String(m || '').toLowerCase()); d = d || {};
    // DEC-214: la identificación es única (usuarios e inspectores de la base); el RUC de la agencia, también.
    const idDe = (v, excl) => { const s = String(v || '').trim().toUpperCase(); return s ? U.concat(Array.isArray(X.inspectores) ? X.inspectores : []).find((u) => String(u.identificacion || '').toUpperCase() === s && (!excl || u.email !== excl)) : null; };
    if (tipo === 'guardarAgencia') { const A = X.agencias = Array.isArray(X.agencias) ? X.agencias : [], ruc = String(d.ruc || ''); if (!/^\d{10}001$/.test(ruc)) return { ok: false, mensaje: 'RUC no válido' };
      const a = A.find((x) => x.ruc === ruc); if (a) Object.assign(a, { razonSocial: d.razonSocial, nombreComercial: d.nombreComercial, nombre: d.nombreComercial, estado: d.estado }); else A.push({ nombre: d.nombreComercial, razonSocial: d.razonSocial, nombreComercial: d.nombreComercial, ruc, estado: d.estado || 'Activa' });
      return { ok: true, mensaje: a ? 'Agencia actualizada en la base' : 'Agencia creada en la base' }; }
    if (tipo === 'crearUsuario') { const o = idDe(d.identificacion); if (o) return { ok: false, mensaje: 'La identificación ' + d.identificacion + ' ya está registrada (' + o.nombre + ')' }; }
    if (tipo === 'editarUsuario' && (d.cambios || {}).identificacion) { const o = idDe(d.cambios.identificacion, String(d.email || '').toLowerCase()); if (o) return { ok: false, mensaje: 'La identificación ' + d.cambios.identificacion + ' ya está registrada (' + o.nombre + ')' }; }
    if (tipo === 'crearUsuario') { if (de(d.email)) return { ok: false, mensaje: 'El correo ya lo usa otro usuario' };
      U.push({ nombre: d.nombre, tipoIdentificacion: d.tipoIdentificacion, identificacion: d.identificacion, email: d.email, rol: d.rol, roles: d.roles, tipo: d.agencia ? 'Agencia' : d.tipoInspector === 'independiente' ? 'Independiente' : 'Interno', tipoInspector: d.tipoInspector, agencia: d.agencia, estado: 'Invitado', celular: d.celular, alcance: d.alcance, zonas: d.zonas, vinculado: false });
      return { ok: true, mensaje: 'Usuario creado en la base', activacion: 'https://sirius-prueba.asur.ec/activar?token=' + token(d.email) }; }
    const u = de(d.email); if (!u) return { ok: false, mensaje: 'El usuario no existe en la base' };
    if (tipo === 'editarUsuario') { const ch = d.cambios || {}; if (ch.email && ch.email !== u.email && de(ch.email)) return { ok: false, mensaje: 'El correo ya lo usa otro usuario' };
      Object.assign(u, JSON.parse(JSON.stringify(ch))); if (ch.agencia !== undefined) u.tipo = ch.agencia ? 'Agencia' : u.tipo === 'Agencia' ? 'Interno' : u.tipo; return { ok: true, mensaje: 'Usuario actualizado en la base' }; }
    if (d.estado === 'Activo' && !u.vinculado) return { ok: false, mensaje: 'El usuario aún no activó su cuenta' };
    u.estado = d.estado; return { ok: true, mensaje: 'Estado actualizado en la base' }; };
  CC.cxUsuarios = { usuarios: USUARIOS, agencias: AGENCIAS, escenas: ESC };
})();
