// SIRIUS · Calculadora de honorarios y su flujo de aprobación (v1.1 · provisional · etapa 11-c · 03/11/2026)
// v1.1: moneda e IVA desde SIRIUS_COMPANIA; momento y responsable de liquidar por tarifario; facultad de aprobar del
//       calificador configurable por usuario; aprobar después.
// Fuente única de: tarifario hora-hombre (Tarifario_Inspecciones_RTG_2025), niveles de inspector, tramos de equipos,
// movilización, tiempos de referencia, cómo se mide el tiempo efectivo, tarifarios por agencia e inspector, flujo del
// honorario (propuesta → validación de la agencia → aprobación → liquidación → factura → pago) y facultades.
// Reemplaza a SIRIUS_LIQUIDACIONES.tarifas, convenios y ajustes (que quedan solo para Vehículos como tarifa fija).
// Decisiones: DEC-137 (calculadora) y DEC-138 (flujo del honorario y de la factura).
window.SIRIUS_HONORARIOS = {
  version: '1.1', vigencia: 'Provisional', moneda: 'SIRIUS_COMPANIA.moneda', iva: 'SIRIUS_COMPANIA.impuestos (tasa vigente en la fecha de la factura)',
  // ---------- Modelo de cálculo ----------
  // Etapa 8a (DEC-141): se resuelve primero por ramo, luego por composición y por último por grupo (SIRIUS_FLUJO.resolver).
  // «Equipo y maquinaria» es un ramo del grupo Ramos Generales (composición Equipo móvil): ya no es una clave de grupo.
  modeloPorRamo: {
    'Equipo y maquinaria': 'horaHombre',
  },
  modeloPorComposicion: {},
  modeloPorGrupo: {
    'Ramos Generales': 'horaHombre',
    'Vehículos': 'tarifaFija', // por confirmar: el tarifario RTG no cubre Vehículos; se mantiene la tarifa por inspección
  },
  // ---------- Tarifario general (hora-hombre) ----------
  roles: [
    { id: 'basico', nombre: 'Inspector Riesgos Básicos', valorHora: 50, alcance: 'Riesgos básicos a medios: casa habitación, comercios, servicios, cooperativas, instituciones educativas, equipo y maquinaria. Medidas de seguridad estándar y notas técnicas.', requisitos: 'Más de 3 años en inspecciones de riesgo de ramos técnicos y generales.' },
    { id: 'n1', nombre: 'Inspector Especialista Nivel 1', valorHora: 80, alcance: 'Riesgos industriales y de ingeniería: fábricas con transformación de materia prima, instituciones médicas. Sistemas complejos y recomendaciones técnicas avanzadas.', requisitos: 'Especialista en seguros (cursos, certificaciones) y más de 3 años de experiencia.' },
    { id: 'n2', nombre: 'Inspector Especialista Nivel 2', valorHora: 100, alcance: 'Riesgos estratégicos: hidroeléctricas, termoeléctricas, puentes, carreteras, petroleras, acueductos, malecones y puertos, transporte masivo, casco de buques.', requisitos: 'Profesional en Ingeniería, Arquitectura u otra; especialista en seguros; más de 3 años de experiencia.' },
    { id: 'redaccion', nombre: 'Redacción Técnica - Calidad', valorHora: 15, alcance: 'Revisión y compilación de la información de los inspectores, informe técnico detallado y aseguramiento de calidad.' },
  ],
  equipos: { nombre: 'Revisión Máquina y Equipos', unidad: 'equipo', tramos: [{ hasta: 10, valor: 15 }, { hasta: 15, valor: 12 }, { hasta: null, valor: 10 }],
    aplicacion: 'escalonada', // por confirmar: 'escalonada' (1–10 a 15, 11–15 a 12, 16+ a 10) o 'tramoTotal' (todas al precio del tramo alcanzado)
    cuenta: 'Equipos y máquinas registrados en el informe (filas de las grillas de equipos del formulario)' },
  movilizacion: [
    { id: 'urbano', nombre: 'Perímetro urbano', valor: 0, nota: 'Incluido' },
    { id: 'fuera', nombre: 'Fuera del perímetro urbano de la ciudad base del inspector', valor: null, nota: 'Por definir (valor fijo o por km)' },
  ],
  // Nivel sugerido según el riesgo (catálogo de actividades u ocupación del formulario de ubicación); el inspector puede cambiarlo con motivo.
  nivelPorRiesgo: [
    { si: 'Casa habitación, comercio, servicios, cooperativa, institución educativa, bodega, equipo y maquinaria', nivel: 'basico' },
    { si: 'Industria con transformación de materia prima, institución médica (clínica, hospital)', nivel: 'n1' },
    { si: 'Riesgo estratégico (generación eléctrica, obra vial, petrolera, acueducto, puerto, transporte masivo, casco de buque)', nivel: 'n2' },
  ],
  // ---------- Tiempo efectivo y tiempos de referencia ----------
  tiempo: {
    visita: 'Desde la primera hasta la última evidencia de la visita (o el registro de llegada y salida en la app), sin contar pausas de más de 20 minutos; tope: la jornada del día.',
    redaccion: 'Tiempo activo de edición del informe por cada persona (inspector y redactor): suma de sesiones con actividad; los intervalos sin actividad de más de 10 minutos no cuentan.',
    redondeo: 'Al medio hora superior',
    referencia: [
      { nivel: 'basico', visitaH: 2, redaccionH: 1.5 },
      { nivel: 'n1', visitaH: 4, redaccionH: 3 },
      { nivel: 'n2', visitaH: 8, redaccionH: 6 },
    ],
    recomendacion: 'Horas recomendadas = tiempo medido redondeado, dentro de 50 % a 150 % de la referencia; si el medido sale de ese rango, se recomienda el límite y se marca «Revisar tiempo».',
  },
  // ---------- Tarifarios por agencia e inspector (contratos) ----------
  // Reemplazan valores del general por partes; lo que no definen, sale del general. Con vigencia y versión.
  tarifarios: [
    { id: 'TAR-GEN-2025', nombre: 'Tarifario general RTG 2025', aplicaA: 'Todos', vigencia: ['2025-01-01', '2026-12-31'], version: 1, estado: 'Vigente', origen: 'Tarifario_Inspecciones_RTG_2025.xlsx', liquida: { momento: 'alEnviarInforme', quien: 'Inspector' } },
    { id: 'TAR-EUR-2026', nombre: 'Contrato Eurosurvey 2026', aplicaA: { agencia: 'eurosurvey' }, vigencia: ['2026-01-01', '2026-12-31'], version: 2, estado: 'Vigente', cambios: { redaccion: 14, vehiculosPresencial: 16.5 }, validacionAgencia: true, liquida: { momento: 'posterior', quien: 'Finanzas de agencia', nota: 'El inspector envía el informe sin honorario; Carla Ponce los liquida después en lote' } },
    { id: 'TAR-AND-2026', nombre: 'Contrato Inspecciones Andinas 2026', aplicaA: { agencia: 'andinas' }, vigencia: ['2026-01-01', '2026-12-31'], version: 1, estado: 'Vigente', cambios: {}, validacionAgencia: false, liquida: { momento: 'alEnviarInforme', quien: 'Inspector' } },
    { id: 'TAR-LAN-2026', nombre: 'Luis Andrade (externo)', aplicaA: { inspector: 'Luis Andrade' }, vigencia: ['2026-01-01', '2026-12-31'], version: 1, estado: 'Vigente', cambios: { nivelMaximo: 'basico' }, nota: 'Solo puede facturar como Inspector Riesgos Básicos' },
  ],
  // ---------- Quién y cuándo liquida (DEC-138, ampliada) ----------
  // Se define en cada tarifario (agencia o inspector); lo que no define, sale del general.
  liquidacion: {
    momentos: [
      { id: 'alEnviarInforme', nombre: 'Al enviar el informe', nota: 'El inspector ve la propuesta antes de enviar y la acepta o ajusta' },
      { id: 'posterior', nombre: 'Después, por separado', nota: 'El informe se envía sin honorario; queda «Por liquidar» y quien liquida lo hace después, uno a uno o en lote' },
    ],
    quienes: ['Inspector', 'Finanzas de agencia'],
    estadoNuevo: { id: 'Por liquidar', badge: 'neutral', nota: 'Informe enviado sin honorario propuesto (momento «Después»)' },
  },
  // Facultad del calificador: se activa por usuario en Usuarios y roles (ficha del usuario) con su tope; por defecto, apagada.
  facultadCalificador: { donde: 'Usuarios y roles › ficha del usuario › «Puede aprobar honorarios» y «Tope por honorario»', porDefecto: false,
    ejemplos: { 'Verónica Lema': { activa: true, tope: 500 }, 'Daniela Ruiz': { activa: false, tope: null } },
    aprobarDespues: 'El calificador puede calificar el riesgo y dejar el honorario «Por aprobar» («Aprobar después»); lo ve en su inicio y en Liquidaciones › Honorarios hasta aprobarlo, o lo aprueba Finanzas.' },

  // ---------- Flujo del honorario (DEC-138) ----------
  estados: [
    { id: 'Calculado', badge: 'neutral', nota: 'SIRIUS calculó la propuesta al enviar el informe' },
    { id: 'Propuesto', badge: 'brand', nota: 'El inspector revisó y envió su propuesta (igual o ajustada con motivo)' },
    { id: 'Por validar en la agencia', badge: 'warning', nota: 'Solo agencias con validación activa' },
    { id: 'Por aprobar', badge: 'warning', nota: 'Espera al calificador con facultad o a Finanzas' },
    { id: 'Devuelto', badge: 'danger', nota: 'Vuelve al inspector para corregir; tarea pendiente en su inicio' },
    { id: 'Aprobado', badge: 'success', nota: 'Entra en la liquidación abierta del proveedor' },
    { id: 'Facturado', badge: 'teal' }, { id: 'Pagado', badge: 'success' },
    { id: 'Acordado en subasta', badge: 'teal', nota: 'Valor aceptado por ambas partes en la subasta (fase D): bloqueado; solo se factura' },
  ],
  pasos: [
    'Al enviar el informe, SIRIUS calcula la propuesta con el tarifario que aplica (agencia o inspector, si no el general), el nivel sugerido, las horas recomendadas, los equipos del informe y la movilización. El inspector la ve antes de enviar: puede aceptarla o ajustarla con motivo; una diferencia mayor a 20 % se marca para revisión.',
    'Si la agencia tiene validación activa, su usuario de finanzas la valida o ajusta (con motivo) antes de que pase a aprobación.',
    'En la calificación, el calificador con la facultad «Aprobar honorarios» ve el panel de honorarios (cálculo, propuesta, diferencias y tiempos) y puede aprobar, ajustar con motivo o devolver al inspector. Si no tiene la facultad o no lo hace, queda «Por aprobar» para Finanzas.',
    'Un honorario aprobado entra en la liquidación abierta del proveedor (por periodo). La liquidación muestra cada honorario con su detalle.',
    'El proveedor elige una o varias liquidaciones aprobadas y carga una factura por la suma exacta; si no coincide, se explica y no se envía.',
    'Finanzas valida la factura. Si es incorrecta, la devuelve con motivo: el proveedor la corrige y la vuelve a cargar (tarea pendiente en su inicio). Opcional: Finanzas puede cargarla por él, pero el estado queda «Factura devuelta» hasta que el proveedor la confirme.',
    'Después de la validación, «Enviar a pago» (CNX-12) y «Pagado».',
  ],
  facultades: [
    { accion: 'Aprobar honorarios', roles: { 'Ejecutivo de inspecciones': 'Solo si su ficha tiene la facultad activa, hasta su tope', 'Finanzas': 'Sin límite', 'Administrador': 'Sin límite' } },
    { accion: 'Liquidar honorarios (proponer)', roles: { 'Inspector': 'Los suyos, si su tarifario dice «Inspector»', 'Finanzas de agencia': 'Los de su agencia, si su tarifario dice «Finanzas de agencia»' } },
    { accion: 'Validar honorarios y facturas de la agencia', roles: { 'Finanzas de agencia': 'Solo su agencia' } },
    { accion: 'Configurar tarifarios', roles: { 'Finanzas': 'Edita con motivo', 'Administrador': 'Edita con motivo' } },
  ],
  rolNuevo: { nombre: 'Finanzas de agencia', tipo: 'Agencia', ejemplo: { nombre: 'Carla Ponce', correo: 'carla.ponce@eurosurvey.com.ec', agencia: 'eurosurvey' } },
  // ---------- Ejemplo esperado ----------
  ejemplo: {
    caso: '20195', inspector: 'Luis Andrade', tarifario: 'TAR-LAN-2026 (sobre el general)', nivel: 'basico',
    lineas: [['Inspector Riesgos Básicos', 'horas recomendadas según la visita del 16/10 (09:00–12:00) → 3 h × 50'], ['Redacción Técnica - Calidad', 'tiempo activo de edición del informe, redondeado'], ['Revisión Máquina y Equipos', 'equipos del ramo Equipo electrónico en el informe × tramo'], ['Movilización', 'Manta está fuera de su ciudad base: «Por definir»']],
    nota: 'El chat calcula las horas y los equipos con los datos del informe e informa el total.',
  },
};
