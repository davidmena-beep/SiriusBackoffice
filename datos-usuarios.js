// SIRIUS · Usuarios, roles, permisos, agencias e invitaciones (v1.7 · provisional · etapa 15-4 · 07/11/2026)
// v1.7: acciones «Ver y configurar las tarifas a sus inspectores y las cuentas bancarias» (Usuarios y roles › Agencias y ficha de los independientes:
//       Administrador edita, Finanzas de agencia lo propio, Coordinador y Finanzas ven) y «Aprobar cambios de cuenta bancaria» (Finanzas · DEC-174).
// v1.6: inspectores de la red Mauricio Endara (Eurosurvey) y Sofía Arteaga (Inspecciones Andinas); `dispositivos` de la app del inspector
//       (celular de confianza registrado en el primer ingreso; el Administrador lo revoca desde la ficha · DEC-173).
// v1.5: `niveles` y `accionesInfo` (niveles válidos y explicación corta de cada acción) para la pantalla Roles y permisos de un rol a la vez;
//       el Monitor del proceso pasa a DEC-170 (DEC-168 es la placa o el VIN con carácter dudoso).
// v1.4: acción «Ver el monitor del proceso» (Administración › Flujo y SLA › Monitor · DEC-170): Administrador y Coordinador.
// v1.3: rol «Finanzas de agencia» (Carla Ponce, Eurosurvey) y acciones «Aprobar honorarios» y «Validar honorarios y facturas de
//       la agencia» según SIRIUS_HONORARIOS.facultades (DEC-138).
// v1.2: acciones «Ver agenda» y «Ver reportes» en la matriz (antes se sumaban en memoria en sirius-usuarios.js).
// v1.1: dominio de la compañía asur.ec.
// Fuente única de: usuarios (incluye el estado de la conexión de Gmail, que antes estaba en SIRIUS_NOTIFICACIONES),
// roles con su matriz de permisos (anexo 1), agencias de inspección, invitaciones y políticas de acceso.
// Las facultades del inspector siguen en Niveles de calificación (BO-21); aquí solo se enlazan. Decisiones: DEC-113 (actualizada), DEC-128 a DEC-130.
(function () {
  const U = {
    version: '1.5', vigencia: 'Provisional', compania: 'Aseguradora del Sur', dominio: 'asur.ec',
    // ---------- Acceso (DEC-113 actualizada, DEC-128) ----------
    acceso: {
      internos: { metodos: ['Google', 'Usuario y contraseña'], nota: 'Correo del dominio de la compañía; eligen cualquiera de los dos al entrar' },
      externos: { metodos: ['Usuario y contraseña'], segundoFactor: 'Código por correo en cada inicio de sesión desde un dispositivo nuevo', nota: 'Inspectores externos y de agencias' },
      contrasena: { minimo: 12, reglas: ['Al menos una mayúscula, una minúscula y un número', 'No puede contener el nombre ni el correo', 'Caduca a los 180 días'], bloqueo: '5 intentos fallidos bloquean la cuenta 15 minutos' },
      sesion: { inactividad: '30 minutos', aviso: '2 minutos antes de cerrar' },
    },
    invitacion: {
      validez: '72 horas', reenvios: 'Ilimitados; cada reenvío invalida el enlace anterior',
      pasos: [
        'El Administrador crea al usuario: queda «Invitado» y se envía la invitación por correo (canal de Notificaciones).',
        'El usuario abre el enlace. Interno: «Continuar con Google» (o crear contraseña). Externo o de agencia: crea su contraseña y confirma el código.',
        'Interno que entró con Google: SIRIUS pide autorización para enviar correos en su nombre, solo en los casos en los que participa o están a su cargo según el flujo y las reglas.',
        'Si autoriza, su Gmail queda «Conectada». Si no, puede usar SIRIUS igual; sus correos salen de la cuenta institucional y se abre la advertencia gmail_vencido en Conflictos.',
        'Al terminar, el usuario queda «Activo» y entra a su inicio por rol.',
      ],
      textoAutorizacion: 'SIRIUS enviará correos con tu cuenta solo para los casos en los que participas o que están a tu cargo (avisos de visitas, garantías, endosos y seguimientos). Puedes retirar este permiso desde Mi perfil cuando quieras.',
    },
    estadosUsuario: [
      { id: 'Invitado', badge: 'brand', nota: 'Invitación enviada y vigente' },
      { id: 'Invitación vencida', badge: 'warning', nota: 'Pasaron 72 horas; reenviar' },
      { id: 'Activo', badge: 'success' },
      { id: 'Suspendido', badge: 'danger', nota: 'No puede entrar; conserva sus casos (se reasignan con motivo)' },
      { id: 'Inactivo', badge: 'neutral', nota: 'Dado de baja; no se elimina para conservar la trazabilidad' },
    ],
    // ---------- Roles y permisos (anexo 1) ----------
    // C crea · V ve · E edita · A aprueba o decide · P solo lo propio o asignado · '' sin acceso. Roles del sistema: no se
    // eliminan; se pueden duplicar para crear roles propios y editar sus permisos (con motivo e impacto).
    roles: [
      { id: 'adm', nombre: 'Administrador', sistema: true }, { id: 'com', nombre: 'Ejecutivo comercial', sistema: true },
      { id: 'coo', nombre: 'Coordinador de inspecciones', sistema: true }, { id: 'ins', nombre: 'Inspector', sistema: true },
      { id: 'eje', nombre: 'Ejecutivo de inspecciones', sistema: true, nota: 'Calificador nivel 1' }, { id: 'sus', nombre: 'Suscriptor', sistema: true, nota: 'Calificador nivel 2' },
      { id: 'fin', nombre: 'Finanzas', sistema: true, nota: 'Solo Inicio y Liquidaciones' },
      { id: 'fag', nombre: 'Finanzas de agencia', sistema: true, nota: 'Usuario de la agencia: valida sus honorarios y facturas' },
    ],
    acciones: [
      // [grupo, acción, adm, com, coo, ins, eje, sus, fin, fag]
      ['Solicitudes', 'Crear solicitud manual', 'C', 'C', 'C', '', '', '', '', ''],
      ['Solicitudes', 'Ver bandeja de casos', 'V', 'P', 'V', 'P', 'P', 'P', '', ''],
      ['Coordinación', 'Coordinar visitas, reagendar, cambiar inspector, dividir, cancelar', 'E', '', 'E', '', '', '', '', ''],
      ['Coordinación', 'Registrar intento de contacto', 'E', '', 'E', '', '', '', '', ''],
      ['Coordinación', 'Cancelar caso por falta de datos o contacto', 'E', '', 'E', '', '', '', '', ''],
      ['Coordinación', 'Reaperturar caso cancelado', 'E', 'E', '', '', '', '', '', ''],
      ['Coordinación', 'Ver visitas', 'V', 'V', 'V', 'P', 'V', 'V', '', ''],
      ['Agenda', 'Ver agenda', 'V', 'V', 'E', 'P', 'V', 'V', '', ''],
      ['Informe', 'Registrar informe', 'E', '', '', 'P', 'P', '', '', ''],
      ['Informe', 'Determinar asegurabilidad desde el informe', '', '', '', 'P', '', '', '', ''],
      ['Calificación', 'Calificar nivel 1', 'A', '', '', '', 'A', '', '', ''],
      ['Calificación', 'Calificar nivel 2 (dictamen final)', 'A', '', '', '', '', 'A', '', ''],
      ['Calificación', 'Marcar revisión de control como revisada', 'A', '', '', '', 'A', '', '', ''],
      ['Emisión', 'Crear orden de emisión (caso sin orden)', 'C', 'C', '', '', '', '', '', ''],
      ['Garantías', 'Adjuntar documento o respaldo de garantía', 'C', 'C', '', '', '', '', '', ''],
      ['Garantías', 'Marcar documento como cumplido o rechazar adjunto', 'A', '', '', '', 'A', 'A', '', ''],
      ['Garantías', 'Marcar garantía como cumplida o rechazar respaldo', 'A', '', '', '', 'A', '', '', ''],
      ['Garantías', 'Solicitar inspección de garantías', 'C', 'C', '', '', '', '', '', ''],
      ['Garantías', 'Solicitar ampliación de plazo o cierre', 'C', 'C', '', '', '', '', '', ''],
      ['Garantías', 'Aprobar ampliación de plazo', 'A', '', '', '', 'P', 'P', '', ''],
      ['Liquidaciones', 'Liquidar honorarios', 'V', '', '', 'P', '', '', 'A', 'P'],
      ['Liquidaciones', 'Aprobar honorarios', 'A', '', '', '', 'A', '', 'A', ''],
      ['Liquidaciones', 'Validar honorarios y facturas de la agencia', '', '', '', '', '', '', '', 'P'],
      ['Liquidaciones', 'Aprobar cambios de cuenta bancaria', 'V', '', '', '', '', '', 'A', ''],
      ['Reportes', 'Ver reportes', 'V', 'V', 'V', '', 'V', 'V', '', ''],
      ['Administración', 'Configurar formularios, niveles, facultades, reglas, catálogos, plantillas y notificaciones', 'E', '', '', '', '', '', '', ''],
      ['Administración', 'Gestionar usuarios, roles e invitaciones', 'E', '', '', '', '', '', '', ''],
      ['Administración', 'Ver y resolver conflictos de configuración', 'E', '', '', '', '', '', '', ''],
      ['Administración', 'Ver el monitor del proceso', 'V', '', 'V', '', '', '', '', ''],
      ['Administración', 'Ver y configurar las tarifas a sus inspectores y las cuentas bancarias', 'E', '', 'V', '', '', '', 'V', 'P'],
    ],
    // Niveles en el orden del selector y, por acción, los niveles válidos (además de «Sin acceso») con su explicación corta.
    niveles: [['', 'Sin acceso'], ['V', 'Ver'], ['P', 'Lo propio'], ['E', 'Editar'], ['A', 'Aprobar'], ['C', 'Crear']],
    accionesInfo: {
      'Crear solicitud manual': ['C', 'Nueva solicitud y carga masiva'],
      'Ver bandeja de casos': ['VP', 'Lo propio: solo los casos a su cargo'],
      'Coordinar visitas, reagendar, cambiar inspector, dividir, cancelar': ['E', 'Incluye el enlace de autoinspección: generar, reenviar, ampliar y revocar'],
      'Registrar intento de contacto': ['E', 'Queda en la cronología del caso'],
      'Cancelar caso por falta de datos o contacto': ['E', 'Pide motivo de catálogo; «Cliente no contesta» exige 3 intentos'],
      'Reaperturar caso cancelado': ['E', 'Solo motivos de coordinación y hasta 30 días'],
      'Ver visitas': ['VP', 'Lo propio: las visitas que le toca hacer'],
      'Ver agenda': ['VPE', 'Editar: mover visitas en la agenda'],
      'Registrar informe': ['PE', 'Lo propio: los informes de sus visitas'],
      'Determinar asegurabilidad desde el informe': ['P', 'Solo con la facultad de la ficha del inspector'],
      'Calificar nivel 1': ['A', 'Incluye revisar los controles de la autoinspección'],
      'Calificar nivel 2 (dictamen final)': ['A', 'Dictamen del Suscriptor'],
      'Marcar revisión de control como revisada': ['A', 'Revisión de control por muestreo'],
      'Crear orden de emisión (caso sin orden)': ['C', 'Llama al BPM de Emisión'],
      'Adjuntar documento o respaldo de garantía': ['C', 'Seguimiento de garantías y endosos'],
      'Marcar documento como cumplido o rechazar adjunto': ['A', 'Garantías con documentos por validar'],
      'Marcar garantía como cumplida o rechazar respaldo': ['A', 'Garantías con respaldo por validar'],
      'Solicitar inspección de garantías': ['C', 'Pide la visita de verificación'],
      'Solicitar ampliación de plazo o cierre': ['C', 'Queda pendiente de aprobación'],
      'Aprobar ampliación de plazo': ['PA', 'Lo propio: las garantías de sus casos'],
      'Liquidar honorarios': ['VPA', 'Lo propio: «Mis honorarios»'],
      'Aprobar honorarios': ['A', 'Con facultad y tope en la ficha del usuario'],
      'Validar honorarios y facturas de la agencia': ['PA', 'Lo propio: los de su agencia'],
      'Ver reportes': ['V', 'Reportes del proceso'],
      'Configurar formularios, niveles, facultades, reglas, catálogos, plantillas y notificaciones': ['E', 'Formularios, catálogos, reglas, plantillas y notificaciones'],
      'Gestionar usuarios, roles e invitaciones': ['E', 'Usuarios y roles'],
      'Ver y resolver conflictos de configuración': ['E', 'Centro de conflictos'],
      'Ver el monitor del proceso': ['V', 'Administración › Flujo y SLA › Monitor'],
      'Aprobar cambios de cuenta bancaria': ['VA', 'Liquidaciones › Cuentas bancarias: aprueba o rechaza con motivo'],
      'Ver y configurar las tarifas a sus inspectores y las cuentas bancarias': ['VPE', 'Lo propio: las tarifas y la cuenta de su agencia (Usuarios y roles › Agencias)'],
    },
    // ---------- Agencias de inspección ----------
    agencias: [
      { id: 'eurosurvey', nombre: 'Eurosurvey S.A.', ruc: '1791456320001', contacto: 'operaciones@eurosurvey.com.ec', logo: 'proveedor', estado: 'Activa', sucursales: ['Quito Norte', 'Quito Sur', 'Guayaquil'] },
      { id: 'andinas', nombre: 'Inspecciones Andinas Cía. Ltda.', ruc: '1792788441001', contacto: 'coordinacion@inspeccionesandinas.ec', logo: null, estado: 'Activa', sucursales: ['Ambato', 'Cuenca', 'Ibarra'] },
      { id: 'pacifico', nombre: 'Peritajes del Pacífico S.A.', ruc: '0992671543001', contacto: 'peritajes@pacifico.ec', logo: null, estado: 'Activa', sucursales: ['Guayaquil', 'Manta'] },
    ],
    // ---------- Usuarios ----------
    // gmail: Conectada · Sin conectar · Permiso vencido · No aplica (externos). alcance: sucursales y grupos de ramo que ve.
    usuarios: [
      { nombre: 'Andrea Salazar', correo: 'andrea.salazar@asur.ec', celular: '0991234567', tipo: 'Interno', roles: ['Administrador', 'Coordinador de inspecciones'], alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-01T09:12', ultimoAcceso: '2026-10-18T19:55' },
      { nombre: 'Verónica Lema', correo: 'veronica.lema@asur.ec', celular: '0987451230', tipo: 'Interno', roles: ['Ejecutivo de inspecciones'], alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-01T10:40', ultimoAcceso: '2026-10-18T18:20' },
      { nombre: 'Daniela Ruiz', correo: 'daniela.ruiz@asur.ec', celular: '0984412598', tipo: 'Interno', roles: ['Ejecutivo de inspecciones'], alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-03T11:20', ultimoAcceso: '2026-10-17T17:05' },
      { nombre: 'Santiago Ortiz', correo: 'santiago.ortiz@asur.ec', celular: '0995528841', tipo: 'Interno', roles: ['Ejecutivo comercial'], alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-02T08:55', ultimoAcceso: '2026-10-18T16:40' },
      { nombre: 'Ricardo Almeida', correo: 'ricardo.almeida@asur.ec', celular: '0998815532', tipo: 'Interno', roles: ['Suscriptor'], alcance: { sucursales: 'Todas', grupos: ['Ramos Generales'] }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'Sin conectar', gmailDesde: null, ultimoAcceso: '2026-10-16T13:20', nota: 'Entra con contraseña; no autorizó Gmail' },
      { nombre: 'Rodrigo Salvador', correo: 'rodrigo.salvador@asur.ec', celular: '0991140027', tipo: 'Interno', roles: ['Suscriptor'], cargo: 'Gerencia técnica', alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-09-15T10:00', ultimoAcceso: '2026-10-17T10:05', nota: 'Autoriza emisiones por excepción' },
      { nombre: 'Mónica Ríos', correo: 'monica.rios@asur.ec', celular: '0983307719', tipo: 'Interno', roles: ['Finanzas'], alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Permiso vencido', gmailDesde: '2026-08-14T15:02', ultimoAcceso: '2026-10-15T09:30', nota: 'Debe volver a autorizar Gmail' },
      { nombre: 'Marco Tapia', correo: 'marco.tapia@asur.ec', celular: '0994471205', tipo: 'Interno', roles: ['Inspector'], alcance: { sucursales: ['Quito Norte', 'Quito Sur'], grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-01T08:00', ultimoAcceso: '2026-10-18T10:05', dispositivos: [{ id: 'DV-0142-1', nombre: 'Samsung Galaxy A35 · Chrome', registrado: '2026-10-01T08:20', ultimaConexion: '2026-10-18T10:05', desbloqueo: 'Huella', estado: 'Activo' }] },
      { nombre: 'Cristian Vaca', correo: 'cristian.vaca@asur.ec', celular: '0996632418', tipo: 'Interno', roles: ['Inspector'], alcance: { sucursales: ['Quito Norte', 'Manta'], grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-01T08:10', ultimoAcceso: '2026-10-15T09:31' },
      { nombre: 'Paola Vinueza', correo: 'paola.vinueza@asur.ec', celular: '0992210384', tipo: 'Interno', roles: ['Inspector'], alcance: { sucursales: ['Guayaquil'], grupos: 'Todos' }, estado: 'Activo', acceso: 'Google', gmail: 'Conectada', gmailDesde: '2026-10-02T12:30', ultimoAcceso: '2026-10-16T15:12' },
      { nombre: 'Luis Andrade', correo: 'luis.andrade.inspecciones@gmail.com', celular: '0987790341', tipo: 'Externo', roles: ['Inspector'], alcance: { sucursales: ['Quito Norte', 'Ambato'], grupos: ['Vehículos', 'Ramos Generales'] }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'No aplica', ultimoAcceso: '2026-10-16T12:10', dispositivos: [{ id: 'DV-0031-1', nombre: 'Xiaomi Redmi Note 13 · Chrome', registrado: '2026-09-02T09:40', ultimaConexion: '2026-10-16T12:10', desbloqueo: 'PIN', estado: 'Activo' }] },
      { nombre: 'Diana Cárdenas', correo: 'diana.cardenas@eurosurvey.com.ec', celular: '0985514472', tipo: 'Agencia', agencia: 'eurosurvey', roles: ['Inspector'], alcance: { sucursales: ['Quito Norte', 'Guayaquil'], grupos: ['Vehículos'] }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'No aplica', ultimoAcceso: '2026-10-14T11:40' },
      { nombre: 'Mauricio Endara', correo: 'mauricio.endara@eurosurvey.com.ec', celular: '0984417736', tipo: 'Agencia', agencia: 'eurosurvey', roles: ['Inspector'], alcance: { sucursales: ['Quito Norte', 'Quito Sur'], grupos: ['Vehículos', 'Ramos Generales'] }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'No aplica', ultimoAcceso: '2026-10-18T19:42', nota: 'Red de inspectores (DEC-172)', dispositivos: [{ id: 'DV-0044-1', nombre: 'Samsung Galaxy A54 · Chrome', registrado: '2026-10-05T07:58', ultimaConexion: '2026-10-18T19:42', desbloqueo: 'Huella', estado: 'Activo' }, { id: 'DV-0044-2', nombre: 'Motorola Moto G54 · Chrome', registrado: '2026-08-11T10:15', ultimaConexion: '2026-10-02T18:30', desbloqueo: 'PIN', estado: 'Activo', nota: 'Celular anterior' }] },
      { nombre: 'Sofía Arteaga', correo: 'sofia.arteaga@inspeccionesandinas.ec', celular: '0995520184', tipo: 'Agencia', agencia: 'andinas', roles: ['Inspector'], alcance: { sucursales: ['Quito Norte', 'Ambato', 'Cuenca'], grupos: 'Todos' }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'No aplica', ultimoAcceso: '2026-10-17T16:05', nota: 'Red de inspectores (DEC-172)', dispositivos: [{ id: 'DV-0015-1', nombre: 'iPhone 13 · Safari', registrado: '2026-09-20T08:30', ultimaConexion: '2026-10-17T16:05', desbloqueo: 'Rostro', estado: 'Activo' }] },
      { nombre: 'Jorge Pazmiño', correo: 'jorge.pazmino@inspeccionesandinas.ec', celular: '0993348120', tipo: 'Agencia', agencia: 'andinas', roles: ['Inspector'], alcance: { sucursales: ['Ambato', 'Cuenca'], grupos: 'Todos' }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'No aplica', ultimoAcceso: '2026-10-13T16:25' },
      { nombre: 'Carla Ponce', correo: 'carla.ponce@eurosurvey.com.ec', celular: '0984470213', tipo: 'Agencia', agencia: 'eurosurvey', roles: ['Finanzas de agencia'], alcance: { sucursales: 'Todas', grupos: 'Todos' }, estado: 'Activo', acceso: 'Usuario y contraseña', gmail: 'No aplica', ultimoAcceso: '2026-10-17T15:40', nota: 'Valida los honorarios y las facturas de Eurosurvey' },
      // Ejemplos de invitación
      { nombre: 'Gabriela Torres', correo: 'gabriela.torres@asur.ec', celular: '0990012355', tipo: 'Interno', roles: ['Ejecutivo comercial'], alcance: { sucursales: ['Cuenca'], grupos: 'Todos' }, estado: 'Invitado', acceso: null, gmail: 'Sin conectar', invitado: ['Andrea Salazar', '2026-10-17T15:30'], vence: '2026-10-20T15:30' },
      { nombre: 'Pedro Lasso', correo: 'pedro.lasso@peritajes-pacifico.ec', celular: '0982261190', tipo: 'Agencia', agencia: 'pacifico', roles: ['Inspector'], alcance: { sucursales: ['Manta'], grupos: ['Ramos Generales'] }, estado: 'Invitación vencida', acceso: null, gmail: 'No aplica', invitado: ['Andrea Salazar', '2026-10-10T09:00'], vence: '2026-10-13T09:00' },
      { nombre: 'Felipe Andrade', correo: 'felipe.andrade@asur.ec', celular: '0997718462', tipo: 'Interno', roles: ['Coordinador de inspecciones'], alcance: { sucursales: ['Guayaquil'], grupos: 'Todos' }, estado: 'Inactivo', acceso: 'Google', gmail: 'Sin conectar', baja: ['Andrea Salazar', '2026-09-30T17:00', 'Salió de la compañía'] },
    ],
    reglas: [
      'Un usuario puede tener varios roles; el rol activo se cambia desde la barra superior.',
      'El correo es único y no cambia después de la invitación; un interno debe usar el dominio de la compañía.',
      'Suspender o dar de baja a alguien con casos a su cargo pide reasignarlos (Flujo y SLA › reasignación) antes de confirmar.',
      'Quitar un rol muestra el impacto: casos y pendientes que dejarán de estar a su cargo.',
      'Un usuario nunca se elimina: queda Inactivo para conservar la trazabilidad.',
      'Las facultades del inspector (determinar Asegurable o No asegurable) se configuran en Niveles de calificación y se muestran aquí en solo lectura con enlace.',
    ],
  };
  U.usuario = (nombre) => U.usuarios.find(u => u.nombre === nombre) || null;
  U.permiso = (rolNombre, accion) => { const i = U.roles.findIndex(r => r.nombre === rolNombre), a = U.acciones.find(x => x[1] === accion); return i < 0 || !a ? '' : a[2 + i]; };
  window.SIRIUS_USUARIOS = U;
})();
