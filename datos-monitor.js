// SIRIUS · Monitor del proceso (v1.1 · provisional · etapa 16f-3b · 06/11/2026) · DEC-170
// v1.1: renumerada a DEC-170 (DEC-167 y DEC-168 ya eran de 12d-3b y DEC-169 es del enlace de la etapa 13); traspaso lento con severidad alta sobre 6 h; causa
//       «Calidad» para los cuellos de retrabajo; esperado ajustado a lo calculado en 16f-3; métricas y reglas de las vistas de 16f-3b.
// Fuente única de: métricas del Monitor, reglas de detección de cuellos de botella, clasificación de las causas de la espera,
// umbrales y el generador de la cronología histórica de ejemplo (30 días) que alimenta el prototipo. En producción, todo sale de
// la cronología real de los casos (cambios de estado con inicio y fin del trabajo, actor y rol) y de la capacidad de Agenda.
window.SIRIUS_MONITOR = {
  version: '1.1', vigencia: 'Provisional',
  // ---------- Definiciones ----------
  metricas: {
    enProceso: 'Casos activos (no finales) al final del período',
    cerradosPorDia: 'Casos que llegaron a Inspeccionado (o a un final) por día hábil',
    tiempoCiclo: 'De Registrado a Inspeccionado, en horas hábiles; se muestran mediana y p90',
    trabajo: 'Tramos en que una persona estaba actuando en el caso: desde que lo abre para actuar (o inicia la visita) hasta que ejecuta la transición',
    espera: 'Tiempo en el estado menos el trabajo',
    eficienciaFlujo: 'Trabajo ÷ tiempo de ciclo (%)',
    cumplimientoSla: 'Tramos cerrados dentro de su SLA ÷ tramos cerrados (%), por estado, rol y persona',
    retrabajo: 'Casos con al menos una devolución, reapertura o foto rechazada usada ÷ casos cerrados (%)',
    utilizacion: 'Carga (casos a cargo, visitas y tareas en horas estimadas) ÷ capacidad del período (%), por rol y por persona',
    antiguedad: 'Horas que lleva un caso en su estado actual; bandas p50 y p85 del histórico del estado',
    primeraAccion: 'Tiempo desde que el caso llega a la persona hasta su primera acción (atención)',
    traspaso: 'Tiempo entre la salida de un rol y la primera acción del rol siguiente',
  },
  comparacion: 'Cada indicador se compara con el período anterior de igual duración; la flecha es roja cuando empeora (más tiempo, menos cumplimiento, más retrabajo).',
  // ---------- Detección de cuellos ----------
  reglas: [
    { id: 'slaEstado', nombre: 'Estado sobre su SLA', si: 'p90 del estado ≥ 80 % de su SLA', severidad: 'alta si p90 > SLA; media si entre 80 y 100 %' },
    { id: 'acumulacion', nombre: 'Acumulación', si: 'Casos en el estado crecen 3 días hábiles seguidos y entran más de los que salen', severidad: 'alta' },
    { id: 'utilizacion', nombre: 'Sobrecarga', si: 'Utilización de una persona o rol > 85 %', severidad: 'alta si > 100 %; media si 85–100 %' },
    { id: 'retrabajo', nombre: 'Retrabajo', si: 'Devoluciones o reaperturas > 15 % de los casos que pasan por el estado', severidad: 'media' },
    { id: 'traspaso', nombre: 'Traspaso lento', si: 'Mediana de traspaso entre dos roles > 4 h hábiles', severidad: 'alta si la mediana > 6 h hábiles; media si entre 4 y 6 h' },
    { id: 'bucle', nombre: 'Bucle', si: 'Un caso repite el mismo par de estados más de 2 veces', severidad: 'media' },
  ],
  impacto: 'Los cuellos se ordenan por su aporte al aumento del tiempo de ciclo respecto del período anterior (%).',
  // ---------- Causas de la espera ----------
  causas: [
    { id: 'contencion', nombre: 'Contención de recursos', regla: 'Durante la espera, el responsable tenía más casos que su capacidad (utilización > 100 %)' },
    { id: 'disponibilidad', nombre: 'Disponibilidad', regla: 'Durante la espera, el responsable estaba ausente o fuera de jornada (Agenda: bloqueos y jornada)' },
    { id: 'prioridad', nombre: 'Prioridad', regla: 'El responsable atendió antes casos que llegaron después' },
    { id: 'lotes', nombre: 'Lotes', regla: 'Varios casos del mismo responsable se atendieron juntos tras esperar (tandas)' },
    { id: 'externa', nombre: 'Externa', regla: 'El caso esperaba al cliente (contacto, visita, autoinspección), al BPM o a un proveedor' },
    { id: 'calidad', nombre: 'Calidad (retrabajo)', regla: 'No es una espera: el caso vuelve a un estado anterior por devolución, reapertura o foto rechazada; se usa en los cuellos de retrabajo con su motivo principal' },
  ],
  acciones: {
    contencion: 'Reasignar casos o activar la bandeja compartida en el estado',
    disponibilidad: 'Cubrir la ausencia o ajustar la jornada o el SLA',
    prioridad: 'Revisar el orden de atención (Bandeja ordenada por SLA)',
    lotes: 'Asignar por menor carga al llegar o cambiar el horario de corte',
    externa: 'Recordatorios automáticos al cliente o revisar la integración',
    calidad: 'Revisar la guía del paso o el formulario y capacitar a los responsables con más devoluciones',
  },
  // ---------- Cronología histórica de ejemplo (prototipo) ----------
  // Generación determinista (semilla fija) de los 30 días anteriores al reloj (18/09/2026 a 18/10/2026), coherente con los
  // casos y personas de ejemplo; los casos actuales se agregan con su cronología real del prototipo.
  generador: {
    semilla: 20261018, dias: 30, casosPorDiaHabil: { 'Vehículos': 4, 'Ramos Generales': 1.5, 'Equipo y maquinaria': 0.6 },
    modalidad: { 'Autoinspección': 0.45, 'Presencial': 0.40, 'Virtual guiada': 0.15 },
    tiempos: [ // horas hábiles por estado: [espera mediana, trabajo mediano, p90 total]
      ['Registrado', 0.2, 0.1, 1.1], ['En coordinación', 8, 1.5, 21], ['Agendado', 26, 0.8, 58], ['En curso', 0.5, 1, 6],
      ['Pendiente calificación', 6.9, 0.9, 14.6], ['Devuelto al inspector', 4, 1, 11], ['Pendiente calificación de suscripción', 5, 1.5, 15],
    ],
    tendencia: 'Desde el 08/10, «Pendiente calificación» recibe 2,1 casos por día más de los que salen y Verónica Lema concentra 11 de 14 casos en espera; el tiempo de ciclo sube de 1,8 a 2,4 días (mediana).',
    retrabajo: { devolucion: 0.21, motivoPrincipal: 'Fotos ilegibles del tablero', concentracion: 'Presencial · Quito Norte' },
    lotes: 'El 38 % de los informes se envía después de las 16:00 y espera al día siguiente',
  },
  esperado: {
    resumen: { enProceso: 46, cerradosPorDia: 5.5, cicloMediana: '5,9 d', cicloP90: '10,5 d', eficiencia: '11 %', sla: '84 %', retrabajo: '11 %' },
    cuellos: ['Pendiente calificación · contención de recursos (alta; 64 % del aumento del ciclo)', 'Traspaso Inspector → Calificación de 7,9 h · lotes (alta)', 'Retrabajo del 16 % desde Devuelto · calidad (media)'],
    nota: 'Valores calculados en 16f-3 con la semilla; la maqueta usaba cifras ilustrativas. La espera en Agendado (fecha de la visita del cliente) explica la mayor parte del ciclo y es causa externa.',
  },
  // ---------- Vistas de 16f-3b ----------
  responsables: {
    columnas: ['Persona', 'Rol', 'A cargo', 'Vencidos', 'Por vencer', 'Cumplimiento de SLA', 'Atención (mediana)', 'Cerrados por día', 'Carga', 'Disponibilidad'],
    regla: 'Solo cuentan los tramos en que la persona era responsable; la atención es el tiempo hasta su primera acción; la disponibilidad sale de Agenda (bloqueos y jornada).',
    bloques: ['SLA por rol', 'Traspasos más lentos entre roles', 'Devoluciones y reaperturas por responsable'],
  },
  tareas: {
    tipos: ['Controles de autoinspección por revisar', 'Devoluciones por corregir', 'Honorarios por aprobar', 'Enlaces por reenviar o nuevo enlace', 'Endosos y garantías por gestionar', 'Revisión de control (muestreo)', 'Facturas por validar', 'Casos por tomar (bandeja compartida)'],
    tramosAntiguedad: ['< 1 día', '1 a 3 días', '3 a 5 días', '> 5 días'],
    regla: 'Tareas abiertas generadas por el flujo y los módulos, con su responsable; vencida si supera el SLA de su tipo (si no tiene, 3 días hábiles). Lista de las 5 más antiguas con «Reasignar».',
  },
  cargabilidad: {
    horizonte: 'Próximos 5 días hábiles',
    carga: 'Horas estimadas de casos a cargo (trabajo mediano del estado), visitas agendadas (duración de la franja más traslado) y tareas (30 min por tarea)',
    capacidad: 'Jornada de Agenda menos bloqueos; para roles sin Agenda, 8 h por día hábil',
    colores: ['< 70 %', '70 a 85 %', '85 a 100 %', '> 100 %', 'Ausente'],
    simulacion: 'Mover N casos de una persona a otra del mismo rol y alcance: recalcula la carga de ambas y estima la nueva espera del estado con la ley de Little (casos en espera ÷ salidas por día); «Reasignar ahora» abre la reasignación con los N casos más antiguos preseleccionados (motivo e impacto, regla de Flujo y SLA).',
  },
  ubicacion: 'Administración › Flujo y SLA › Monitor (Administrador y Coordinador). Los cuellos de severidad alta avisan en la campana al Administrador y a los Coordinadores de la sucursal afectada.',
  vistas: ['Resumen', 'Etapas y cuellos', 'Responsables y SLA', 'Tareas', 'Cargabilidad'],
};
