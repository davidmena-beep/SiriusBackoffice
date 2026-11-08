// SIRIUS · Inicio por rol (v1 · provisional · etapa 9 · 02/11/2026)
// Fuente única de: qué ve cada rol al entrar (indicadores, lista «Para hoy», bloques y accesos rápidos), de dónde sale cada
// número y adónde lleva cada clic. Nada se escribe a mano: todo se calcula con los datos vigentes (casos, SIRIUS_FLUJO,
// SIRIUS_SEGUIMIENTO, SIRIUS_CONFLICTOS, SIRIUS_USUARIOS, SIRIUS_NOTIFICACIONES). Decisión: DEC-131.
window.SIRIUS_INICIO = {
  version: '1', vigencia: 'Provisional',
  principios: [
    'Responde «¿qué tengo que hacer ahora?»: primero la lista «Para hoy», ordenada por urgencia (SLA vencido, por vencer, luego fecha).',
    'Hasta 4 indicadores por rol; cada uno lleva a la Bandeja o al módulo ya filtrado con lo que cuenta («Ver los 3»).',
    'Listas de hasta 5 filas con «Ver todos»; cada fila dice qué hacer («Crear orden», «Calificar», «Aprobar») y abre el caso en la pestaña correcta.',
    'Con varios roles, el inicio es el del rol activo; cambiar de rol cambia el inicio.',
    'Vacío positivo: «Nada pendiente para hoy» con el siguiente vencimiento, nunca un bloque en blanco.',
    'Saludo con nombre, fecha del reloj y rol activo; sin gráficos decorativos.',
  ],
  // Cada indicador: [titulo, regla de cálculo, destino del clic, tono si > 0]
  roles: {
    'Administrador': {
      indicadores: [
        ['Conflictos abiertos', 'SIRIUS_CONFLICTOS calculados (bloqueantes primero)', 'Administración › Conflictos', 'danger si hay bloqueantes; warning si solo advertencias'],
        ['Invitaciones pendientes', 'Usuarios Invitado o Invitación vencida', 'Usuarios y roles › filtro estado', 'warning si alguna vencida'],
        ['Casos con SLA vencido', 'Casos activos con sla < 0 (todos los responsables)', 'Bandeja › SLA vencido', 'danger'],
        ['Integraciones con falla', 'Conexiones simuladas con estado distinto de Conectado', 'Administración › Conexiones', 'warning'],
      ],
      paraHoy: ['Conflictos bloqueantes (Resolver)', 'Invitaciones vencidas (Reenviar)', 'Casos con SLA vencido sin responsable o con responsable inactivo (Reasignar)'],
      bloques: [['Casos por estado', 'Barra horizontal con el número de casos activos por estado de SIRIUS_FLUJO; clic en un tramo abre la Bandeja filtrada'], ['Últimos cambios de configuración', 'Las 5 entradas más recientes de los historiales de Administración (quién, qué, motivo)']],
      accesos: ['Invitar usuario', 'Nueva solicitud', 'Conflictos'],
    },
    'Ejecutivo comercial': {
      indicadores: [
        ['Mis casos activos', 'Casos activos con comercial = el usuario', 'Bandeja › mis casos', null],
        ['Por crear orden de emisión', 'Inspeccionado sin orden y comercial = el usuario', 'Bandeja › Inspeccionado sin orden', 'warning'],
        ['Garantías por vencer', 'Seguimientos Pendiente de sus casos con fecha límite en 15 días o menos (mismo umbral que la regla R01)', 'Garantías › Por vencer', 'warning'],
        ['Garantías vencidas', 'Seguimientos Vencido de sus casos', 'Garantías › Vencidas', 'danger'],
      ],
      paraHoy: ['Crear orden de emisión (Inspeccionado sin orden)', 'Garantías vencidas: Solicitar ampliación o cierre', 'Endosos rechazados por el BPM: Reenviar', 'Ampliaciones respondidas (aprobadas o rechazadas) desde la última visita'],
      bloques: [['Mis casos por estado', 'Igual que el del Administrador, solo sus casos']],
      accesos: ['Nueva solicitud', 'Garantías', 'Bandeja'],
    },
    'Coordinador de inspecciones': {
      indicadores: [
        ['Por coordinar', 'Casos en Registrado, En coordinación, Reaperturado o Enlace caducado de sus sucursales', 'Bandeja › En coordinación', 'warning si alguno por vencer; danger si vencido'],
        ['Visitas de hoy y mañana', 'Visitas agendadas para el día hábil actual y el siguiente', 'Agenda', null],
        ['Enlaces por caducar', 'Enlaces de autoagendamiento o autoinspección que vencen en 24 h o menos', 'Bandeja › filtro enlace', 'warning'],
        ['Sin inspector asignado', 'Visitas sin inspector', 'Agenda › Sin asignar', 'danger'],
      ],
      paraHoy: ['Casos por coordinar ordenados por SLA (Registrar contacto o Agendar)', 'Enlaces caducados (Reenviar o cambiar modalidad)', 'Visitas de mañana sin confirmar con el cliente'],
      bloques: [['Carga por inspector', 'Visitas de los próximos 5 días hábiles por inspector (interno, externo y agencia), con barra y número; clic abre la Agenda de ese inspector'], ['Próximas visitas', 'Las 5 siguientes: fecha, franja, caso, inspector y modalidad']],
      accesos: ['Nueva solicitud', 'Agenda', 'Bandeja'],
    },
    'Inspector': {
      indicadores: [
        ['Mis visitas de hoy', 'Visitas del usuario en el día del reloj', 'Agenda › mis visitas', null],
        ['Informes por terminar', 'Informes en Borrador o En curso del usuario', 'Bandeja › mis informes', 'warning'],
        ['Devueltos para corregir', 'Casos Devuelto al inspector donde él registró el informe', 'Bandeja › Devuelto', 'danger'],
        ['Próximas visitas', 'Visitas del usuario en los próximos 5 días hábiles', 'Agenda', null],
      ],
      paraHoy: ['Devueltos (Corregir), con los campos señalados', 'Informes en borrador (Continuar)', 'Retroalimentación de revisiones de control con observación (Ver el caso)', 'Visitas de hoy y mañana con dirección y contacto'],
      bloques: [['Mi agenda de la semana', 'Lista por día con franja, dirección y modalidad']],
      accesos: ['Agenda', 'Bandeja'],
    },
    'Ejecutivo de inspecciones': {
      indicadores: [
        ['Por calificar', 'Riesgos por calificar del usuario (una fila por vehículo; una por caso en Ramos Generales), de la cola de Calificación. Debajo (etapa 12d-3b): «N con alertas altas sin revisar» de la autoinspección, que lleva a la bandeja de controles', 'Calificación › Por calificar (Mis riesgos)', 'warning si alguno por vencer; danger si vencido'],
        ['Revisión de control', 'Riesgos determinados por el inspector, seleccionados por el muestreo de Niveles de calificación y sin revisar', 'Calificación › Revisión de control (Mis riesgos)', 'warning'],
        ['Respaldos por validar', 'Respaldos de garantía cargados y sin revisar de sus casos', 'Garantías › Respaldos', 'warning'],
        ['Ampliaciones por aprobar', 'Solicitudes de ampliación donde es el calificador final', 'Garantías › Solicitudes', 'warning'],
      ],
      paraHoy: ['Calificaciones ordenadas por SLA (Calificar)', 'Revisiones de control (Revisar)', 'Respaldos por validar (Validar)', 'Ampliaciones por aprobar (Aprobar o Rechazar)'],
      bloques: [['Devueltos esperando corrección', 'Casos que devolvió al inspector, con días desde la devolución']],
      accesos: ['Calificación', 'Garantías', 'Bandeja'],
    },
    'Suscriptor': {
      indicadores: [
        ['En suscripción', 'Pendiente calificación de suscripción de sus grupos de ramo, de la cola de Calificación', 'Calificación › En suscripción (Mis riesgos)', 'warning si alguno por vencer; danger si vencido'],
        ['Ampliaciones por aprobar', 'Solicitudes de ampliación donde es el calificador final', 'Garantías › Solicitudes', 'warning'],
        ['Emitidos por excepción (mes)', 'Riesgos con resultado de emisión «Emitido por excepción» en el mes del reloj', 'Bandeja › filtro emisión', null],
        ['Calificados por mí (mes)', 'Dictámenes del usuario en el mes del reloj', 'Bandeja › filtro calificador', null],
      ],
      paraHoy: ['Casos en suscripción por SLA (Dictaminar)', 'Ampliaciones por aprobar (Aprobar o Rechazar)'],
      bloques: [['Resultados del mes por ramo', 'Asegurables y no asegurables por ramo de sus grupos']],
      accesos: ['Calificación', 'Garantías'],
    },
    'Finanzas': {
      nota: 'Su inicio se construye en la etapa 11 con los datos de Liquidaciones; hasta entonces muestra el acceso a Liquidaciones y el saludo.',
      indicadores: [], paraHoy: [], bloques: [], accesos: ['Liquidaciones'],
    },
  },
};
