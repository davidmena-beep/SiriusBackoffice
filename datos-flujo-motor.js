// SIRIUS · Motor de flujo parametrizable (v1.3 · provisional · etapa C2-3 · 08/11/2026) · DEC-145
// v1.3 (etapa C2-3 · DEC-180): versión 2 publicada de Vehículos, Ramos Generales · Ubicación y Equipo y maquinaria con el estado «Informe por completar»
// (desdeVersion: 2) y las transiciones T23 a T27. Los casos activos siguen la versión con la que nacieron (v1); los nuevos usan la v2. El borrador de ejemplo pasa a la v3.
// v1.2 (etapa 10b-c, corrección de datos en la v1 de los tres flujos): T05 también sale de «En curso»: si el enlace vence con la autoinspección a medias, el caso pasa a «Enlace caducado» y conserva lo cargado.
// v1.1 (etapa 13): un estado propio define su etapa de SLA y su plazo en horas hábiles (slaHoras); «Revisión técnica» queda con 16 h en Suscripción.
// Fuente única de: flujos por grupo, ramo o composición con versiones; estados (con los de núcleo protegidos); transiciones con
// roles, condiciones, requisitos y efectos; responsable por rol con su regla de asignación; reglas de publicación y validación.
// Complementa a SIRIUS_FLUJO (v1.2: calendario, SLA hábil, feriados y cálculo del Badge), que sigue siendo la fuente del SLA.
// Valores por defecto vigentes por la regla de 48 h: (1) los casos activos siguen la versión con la que nacieron, con migración
// opcional por mapeo; (2) editor por tablas con diagrama automático (arrastrar: backlog); (3) se respeta la asignación actual y la
// bandeja compartida se activa por estado.
(function () { const PUB = { at: '2026-10-12T08:30', por: 'Andrea Salazar', motivo: 'DEC-180: completar el informe después de la visita y rol Control de calidad de la agencia', cambios: ['Agregó el estado «Informe por completar» (24 h hábiles, alerta al 80 %)', 'Agregó las transiciones T23 a T27'] };
window.SIRIUS_FLUJO_MOTOR = {
  version: '1.3', vigencia: 'Provisional',
  // Plazo propio de un estado propio (etapa 13): horas hábiles del calendario de SIRIUS_FLUJO, contadas desde que el caso entra al estado.
  slaPropio: { minimo: 1, maximo: 240, regla: 'Un estado propio con etapa de SLA lleva su plazo en horas hábiles (entero de 1 a 240); sin etapa no lleva plazo. El Badge de la Bandeja, el Inicio y el Monitor lo calculan igual que el de los estados originales: con el calendario hábil, desde la entrada al estado.' },
  resolucion: 'El flujo de un caso se elige por ramo, luego por composición y luego por grupo de ramo (igual que SLA, niveles y honorarios).',
  nucleo: ['Registrado', 'Inspeccionado', 'Enviado a emisión', 'Emitida', 'No emitida', 'Cancelado'],
  reglaNucleo: 'Los estados de núcleo se pueden renombrar (etiqueta corta) pero no eliminar ni cambiar de tipo: las integraciones (BPM) y los reportes dependen de ellos.',
  tiposEstado: [
    { id: 'inicial', nota: 'Uno solo por flujo' }, { id: 'intermedio' }, { id: 'transversal', nota: 'Se entra y se sale de él desde varios estados (Devuelto, Reaperturado, Enlace caducado)' }, { id: 'final', nota: 'Sin salidas, salvo reapertura configurada' },
  ],
  // ---------- Responsable por rol y regla de asignación ----------
  asignacion: {
    tipos: [
      { id: 'delCaso', nombre: 'Del caso', nota: 'La persona asignada al caso para ese rol (p. ej., ejecutivo responsable, ejecutivo comercial)' },
      { id: 'deLaVisita', nombre: 'De la visita', nota: 'El inspector de la visita más próxima sin terminar; en Devuelto, quien registró el informe' },
      { id: 'porRegla', nombre: 'Por regla', criterios: ['Sucursal del caso', 'Grupo de ramo', 'Menor carga', 'Rotación'], nota: 'Elige a una persona del rol con el criterio' },
      { id: 'bandeja', nombre: 'Bandeja compartida del rol', nota: 'Cualquier persona del rol (y del alcance) puede «Tomar el caso»; mientras nadie lo toma, el responsable es el rol' },
      { id: 'sistema', nombre: 'Sistema externo', nota: 'BPM de Emisión' },
      { id: 'ninguno', nombre: 'Sin responsable', nota: 'Estados finales' },
    ],
    porDefecto: 'Se respeta la asignación actual de SIRIUS_FLUJO.responsables; la bandeja compartida se activa por estado (ninguno la usa por defecto).',
    tomar: '«Tomar el caso» asigna a quien lo toma, con registro en el Historial; «Devolver a la bandeja» lo libera con motivo.',
  },
  // ---------- Estados (comunes a los flujos; cada flujo elige cuáles usa) ----------
  estados: [
    { nombre: 'Registrado', tipo: 'inicial', etapa: 'coordinacion', rol: 'Coordinador de inspecciones', asignacion: { tipo: 'porRegla', criterio: 'Sucursal del caso' } },
    { nombre: 'En coordinación', tipo: 'intermedio', etapa: 'coordinacion', rol: 'Coordinador de inspecciones', asignacion: { tipo: 'porRegla', criterio: 'Sucursal del caso' } },
    { nombre: 'Agendado', tipo: 'intermedio', etapa: 'ejecucion', rol: 'Inspector', asignacion: { tipo: 'deLaVisita' } },
    { nombre: 'En curso', tipo: 'intermedio', etapa: 'ejecucion', rol: 'Inspector', asignacion: { tipo: 'deLaVisita' }, nota: 'En autoinspección se muestra «Autoinspección en curso» con su avance' },
    // Etapa C2-3 · DEC-180: entre «En curso» y la determinación o la calificación (solo en las versiones 2 o posteriores de cada flujo).
    { nombre: 'Informe por completar', tipo: 'intermedio', etapa: 'completar', rol: 'Inspector o Control de calidad de su agencia', asignacion: { tipo: 'deLaVisita' }, desdeVersion: 2, nota: 'Inspector interno o independiente: lo completa él · de agencia: el Control de calidad de su agencia (o el inspector en el back-office si la agencia lo permite)' },
    { nombre: 'Pendiente calificación', tipo: 'intermedio', etapa: 'calificacion', rol: 'Ejecutivo de inspecciones', asignacion: { tipo: 'delCaso' } },
    { nombre: 'Pendiente calificación de suscripción', tipo: 'intermedio', etapa: 'suscripcion', rol: 'Suscriptor', asignacion: { tipo: 'porRegla', criterio: 'Grupo de ramo' } },
    { nombre: 'Inspeccionado', tipo: 'intermedio', etapa: null, rol: 'Ejecutivo de inspecciones (con orden) o Ejecutivo comercial (sin orden)', asignacion: { tipo: 'delCaso' } },
    { nombre: 'Enviado a emisión', tipo: 'intermedio', etapa: null, rol: 'BPM de Emisión', asignacion: { tipo: 'sistema' } },
    { nombre: 'Emitida', tipo: 'final', etapa: null, rol: '—', asignacion: { tipo: 'ninguno' } },
    { nombre: 'No emitida', tipo: 'final', etapa: null, rol: '—', asignacion: { tipo: 'ninguno' } },
    { nombre: 'Devuelto al inspector', tipo: 'transversal', etapa: 'devuelto', rol: 'Inspector', asignacion: { tipo: 'deLaVisita' } },
    { nombre: 'Cancelado', tipo: 'final', etapa: null, rol: '—', asignacion: { tipo: 'ninguno' }, reapertura: true },
    { nombre: 'Reaperturado', tipo: 'transversal', etapa: 'coordinacion', rol: 'Coordinador de inspecciones', asignacion: { tipo: 'porRegla', criterio: 'Sucursal del caso' } },
    { nombre: 'Enlace caducado', tipo: 'transversal', etapa: 'coordinacion', rol: 'Coordinador de inspecciones', asignacion: { tipo: 'porRegla', criterio: 'Sucursal del caso' } },
  ],
  // ---------- Transiciones (estructuradas a partir de SIRIUS_FLUJO.transiciones v1.2) ----------
  // roles: los que la ejecutan (validados contra la matriz de permisos); sistema: evento automático; condiciones: árbol Y/O
  // (constructor de DEC-127); requisitos: motivo y campos; efectos: notificación (regla), tarea, BPM, SLA y responsable.
  transiciones: [
    { id: 'T01', de: ['—'], a: 'Registrado', boton: 'Crear solicitud', roles: ['Administrador', 'Ejecutivo comercial', 'Coordinador de inspecciones'], sistema: 'Orden del BPM de Emisión o Sur One', efectos: ['Asigna el Coordinador de la sucursal', 'Inicia el SLA de coordinación'] },
    { id: 'T02', de: ['Registrado', 'Reaperturado'], a: 'En coordinación', boton: 'Registrar contacto o enviar enlace', roles: ['Coordinador de inspecciones', 'Administrador'], efectos: ['Indicador de primer contacto a las 4 h'] },
    { id: 'T03', de: ['En coordinación'], a: 'Agendado', boton: 'Agendar', roles: ['Coordinador de inspecciones', 'Administrador'], sistema: 'Autoagendamiento del cliente', condiciones: 'Todos los riesgos con visita y fecha', efectos: ['Notificación R06 (recordatorio de visita)', 'Responsable: inspector de la visita'] },
    { id: 'T04', de: ['Agendado'], a: 'En coordinación', boton: 'Reagendar sin fecha', roles: ['Coordinador de inspecciones', 'Administrador'], requisitos: { motivo: true } },
    { id: 'T05', de: ['Agendado', 'En curso'], a: 'Enlace caducado', boton: null, roles: [], sistema: 'Vence el enlace de autoinspección sin envío (tiempo)', efectos: ['Aviso al Coordinador', 'Desde «En curso» conserva el avance guardado'] },
    { id: 'T06', de: ['Enlace caducado'], a: 'Agendado', boton: 'Reenviar enlace', roles: ['Coordinador de inspecciones', 'Administrador'], efectos: ['Nuevo enlace único (invalida el anterior)', 'Notificación R07'] },
    { id: 'T07', de: ['Enlace caducado'], a: 'En coordinación', boton: 'Cambiar de modalidad', roles: ['Coordinador de inspecciones', 'Administrador'], requisitos: { motivo: true } },
    { id: 'T08', de: ['Agendado'], a: 'En curso', boton: 'Iniciar la visita', roles: ['Inspector'], sistema: 'Primera acción del cliente en el portal', efectos: ['Autoinspección en curso con su avance'] },
    { id: 'T09', de: ['En curso'], a: 'Pendiente calificación', boton: 'Enviar el informe', roles: ['Inspector', 'Ejecutivo de inspecciones', 'Administrador'], sistema: 'Envío del portal (autoinspección)', condiciones: 'Sin facultad, por regla de envío o por decisión del inspector; RG: todos los ramos con informe', efectos: ['Inicia el SLA de calificación', 'Propuesta de honorario según el tarifario'] },
    { id: 'T10', de: ['En curso'], a: 'Inspeccionado', boton: 'Determinar asegurabilidad', roles: ['Inspector'], condiciones: 'Inspector con facultad en todos los riesgos y sin reglas de envío cumplidas', efectos: ['Muestreo de revisión de control'] },
    { id: 'T11', de: ['Pendiente calificación'], a: 'Devuelto al inspector', boton: 'Devolver', roles: ['Ejecutivo de inspecciones', 'Administrador'], requisitos: { motivo: true, campos: 'Campos señalados' }, efectos: ['Tarea al inspector'] },
    { id: 'T12', de: ['Devuelto al inspector'], a: 'Pendiente calificación', boton: 'Reenviar corregido', roles: ['Inspector'] },
    { id: 'T13', de: ['Pendiente calificación'], a: 'Pendiente calificación de suscripción', boton: 'Requerir evaluación de suscripción', roles: ['Ejecutivo de inspecciones', 'Administrador'], requisitos: { motivo: true }, sistema: 'Derivación obligatoria por monto (Equipo y maquinaria > USD 150.000)', soloFlujos: ['FL-RG', 'FL-EM'] },
    { id: 'T14', de: ['Pendiente calificación'], a: 'Inspeccionado', boton: 'Grabar calificación', roles: ['Ejecutivo de inspecciones', 'Administrador'], condiciones: 'Todos los riesgos calificados; sin daños propuestos ni alertas altas de la autoinspección sin revisar (DEC-166)' },
    { id: 'T15', de: ['Pendiente calificación de suscripción'], a: 'Inspeccionado', boton: 'Dictaminar', roles: ['Suscriptor', 'Administrador'], soloFlujos: ['FL-RG', 'FL-EM'] },
    { id: 'T16', de: ['Inspeccionado'], a: 'Enviado a emisión', boton: 'Crear orden de emisión', roles: ['Ejecutivo comercial', 'Administrador'], sistema: 'Envío automático del resultado (caso con orden)', efectos: ['Llamada al BPM de Emisión'] },
    { id: 'T17', de: ['Enviado a emisión'], a: 'Emitida', boton: null, roles: [], sistema: 'Respuesta del BPM con al menos un riesgo emitido', efectos: ['Seguimiento de garantías (RG y EM)'] },
    { id: 'T18', de: ['Enviado a emisión'], a: 'No emitida', boton: null, roles: [], sistema: 'Respuesta del BPM sin riesgos emitidos' },
    { id: 'T19', de: ['Registrado', 'En coordinación', 'Reaperturado', 'Agendado', 'Enlace caducado'], a: 'Cancelado', boton: 'Cancelar por coordinación', roles: ['Coordinador de inspecciones', 'Administrador'], requisitos: { motivo: 'De catálogo; «Cliente no contesta» exige 3 intentos' } },
    { id: 'T20', de: ['*antes de Inspeccionado'], a: 'Cancelado', boton: null, roles: [], sistema: 'El BPM anula la orden de emisión (DEC-099)', requisitos: { motivo: true } },
    // Etapa C2-3 · DEC-180 (desdeVersion: 2): completar el informe después de la visita.
    { id: 'T23', de: ['En curso'], a: 'Informe por completar', boton: 'Terminar la visita', roles: ['Inspector'], sistema: 'Fin de la visita en la app del inspector (datos de campo y criterio)', condiciones: 'Vehículos presencial o virtual guiada; Ramos Generales presencial', efectos: ['Inicia el plazo de 24 h hábiles para completar el informe', 'Alerta al 80 % del plazo', 'Vencido: tarea al Coordinador', 'Responsable: el inspector o el Control de calidad de su agencia'], desdeVersion: 2 },
    { id: 'T24', de: ['Informe por completar'], a: 'Inspeccionado', boton: 'Completar y enviar', roles: ['Inspector', 'Control de calidad (agencia)', 'Administrador'], condiciones: 'Sin obligatorios pendientes; Asegurable o No asegurable dentro de la facultad del inspector (el Control de calidad confirma el criterio)', efectos: ['Muestreo de revisión de control', 'Historial con la decisión'], desdeVersion: 2 },
    { id: 'T25', de: ['Informe por completar'], a: 'Pendiente calificación', boton: 'Completar y enviar a calificación', roles: ['Inspector', 'Control de calidad (agencia)', 'Administrador'], condiciones: 'Sin obligatorios pendientes; sin facultad, «Enviar a calificación» o criterio cambiado por el Control de calidad', requisitos: { motivo: 'Obligatorio al cambiar el criterio del inspector' }, efectos: ['Inicia el SLA de calificación', 'La calificación ve los dos criterios'], desdeVersion: 2 },
    { id: 'T26', de: ['Informe por completar'], a: 'Devuelto al inspector', boton: 'Devolver al inspector', roles: ['Control de calidad (agencia)', 'Administrador'], requisitos: { motivo: true }, efectos: ['Tarea y aviso al inspector'], desdeVersion: 2 },
    { id: 'T27', de: ['Devuelto al inspector'], a: 'Informe por completar', boton: 'Reenviar corregido', roles: ['Inspector'], condiciones: 'Devuelto por el Control de calidad', efectos: ['El plazo de 24 h hábiles se reinicia'], desdeVersion: 2 },
    { id: 'T21', de: ['Cancelado'], a: 'Reaperturado', boton: 'Reaperturar', roles: ['Ejecutivo comercial', 'Administrador'], requisitos: { motivo: true }, condiciones: 'Solo motivos de coordinación y hasta 30 días' },
  ],
  // ---------- Flujos y versiones ----------
  flujos: [
    // Etapa C2-3 · DEC-180: version es la vigente; publicada describe esa publicación (la v1 queda «Reemplazada» y sus casos activos siguen en ella).
    { id: 'FL-VEH', nombre: 'Vehículos', aplicaA: { grupo: 'Vehículos' }, version: 2, estado: 'Vigente', excluye: ['Pendiente calificación de suscripción'], casosActivos: 'calculado', publicada: PUB },
    { id: 'FL-RG', nombre: 'Ramos Generales · Ubicación', aplicaA: { grupo: 'Ramos Generales', composicion: 'Ubicación' }, version: 2, estado: 'Vigente', excluye: [], casosActivos: 'calculado', publicada: PUB },
    { id: 'FL-EM', nombre: 'Equipo y maquinaria', aplicaA: { ramo: 'Equipo y maquinaria' }, version: 2, estado: 'Vigente', excluye: [], casosActivos: 'calculado', publicada: PUB },
  ],
  // Borrador de ejemplo para el prototipo (no publicado): agrega un estado propio a Ramos Generales.
  borradorEjemplo: { flujo: 'FL-RG', version: 3, estado: 'Borrador', cambios: [
    { tipo: 'nuevoEstado', estado: { nombre: 'Revisión técnica', tipo: 'intermedio', etapa: 'suscripcion', slaHoras: 16, rol: 'Suscriptor', asignacion: { tipo: 'bandeja' } } },
    { tipo: 'nuevaTransicion', transicion: { id: 'T22', de: ['Pendiente calificación'], a: 'Revisión técnica', boton: 'Enviar a revisión técnica', roles: ['Ejecutivo de inspecciones'], requisitos: { motivo: true }, condiciones: 'Riesgo con puntaje en banda «Requiere revisión»' } },
  ], errorEsperado: '«Revisión técnica» no tiene salida: agrega al menos una transición desde ese estado para publicar.' },
  // ---------- Publicación y validación ----------
  publicacion: {
    casosActivos: 'siguenSuVersion',
    nota: 'Al publicar, los casos activos siguen la versión con la que nacieron; los nuevos usan la vigente. El Administrador puede migrar casos indicando a qué estado nuevo pasa cada estado anterior (mapeo obligatorio para los estados que desaparecen), con motivo e impacto.',
    pide: ['Motivo', 'Impacto: casos activos por estado de la versión anterior'],
  },
  validacion: [
    'Un solo estado inicial; todo estado alcanzable desde el inicial.',
    'Todo estado no final tiene al menos una salida.',
    'Sin transiciones duplicadas (mismo origen, destino y condición).',
    'Cada transición manual tiene al menos un rol con el permiso correspondiente en la matriz.',
    'Los estados de núcleo están presentes.',
    'Un estado propio con etapa de SLA tiene plazo en horas hábiles (1 a 240); sin etapa no lleva plazo.',
    'Los errores impiden publicar y aparecen también en el Centro de conflictos.',
  ],
  editor: { forma: 'Tablas de estados y transiciones, con diagrama generado automáticamente (solo lectura) que se actualiza al editar', backlog: 'Editor visual con arrastre: después de 16f (backlog del plan, fase D)' },
};
})();
