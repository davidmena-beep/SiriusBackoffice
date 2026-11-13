// SIRIUS · Agenda de inspecciones y liquidación de honorarios (v1.5 · provisional · etapa 15-1 · 06/11/2026)
// v1.5: Mauricio Endara es de Eurosurvey (SIRIUS_APP_INSPECTOR.ejemplo) y atiende Vehículos y Ramos Generales; ubicación base de la red y de Marco Tapia
//       (distancia de la oferta y ruta del día en la app del inspector · DEC-173); R06 sale a las 17:00 del día anterior.
// v1.4: red de inspectores para el autoagendamiento (DEC-172: externos y de agencias sin agenda fija en SIRIUS, por zona, grupo de ramo y modalidad)
//       y duración de la visita por ramo (vacía: se usa la del grupo de SIRIUS_PORTAL_CLIENTE.agenda.duracionPorGrupo).
// v1.3: credencial de cada inspector (la ve el cliente el día de la visita, sin teléfono ni foto · DEC-171); la de Marco Tapia es la de SIRIUS_PORTAL_CLIENTE.ejemplo.
// v1.2: impuestos y moneda desde SIRIUS_COMPANIA.
// v1.1: ciudad base de cada inspector (movilización); las tarifas hora-hombre pasan a SIRIUS_HONORARIOS y aquí queda solo
//       la tarifa fija de Vehículos; la factura puede agrupar varias liquidaciones; estado «Factura devuelta».
// Fuente única de: disponibilidad y capacidad de los inspectores, bloqueos, confirmación de visitas, tarifas de honorarios,
// reglas de liquidación, impuestos (parametrizables) y liquidaciones de meses anteriores. Las visitas NO se repiten aquí:
// salen de las visitas de cada caso (Coordinación) y de SIRIUS_FLUJO.ingresos (visitas de 20145 y 20137-G1).
// Decisiones: DEC-135 (Agenda) y DEC-136 (Liquidaciones).
window.SIRIUS_AGENDA = {
  version: '1.1', vigencia: 'Provisional',
  vistas: ['Día', 'Semana', 'Lista'], vistaInicial: { Coordinador: 'Semana', Inspector: 'Día' },
  franjaMinima: 30, // minutos
  disponibilidad: [
    { inspector: 'Marco Tapia', credencial: 'AS-INS-0142', ciudadBase: 'Quito', base: [-0.1807, -78.4678], dias: [1, 2, 3, 4, 5], jornada: ['08:00', '17:00'], zonas: ['Quito'], capacidadDia: 6, modalidades: ['Presencial', 'Virtual guiada'] },
    { inspector: 'Cristian Vaca', credencial: 'AS-INS-0157', ciudadBase: 'Quito', dias: [1, 2, 3, 4, 5, 6], jornada: ['08:00', '17:00'], zonas: ['Quito', 'Manta'], capacidadDia: 5, modalidades: ['Presencial', 'Virtual guiada'] },
    { inspector: 'Paola Vinueza', credencial: 'AS-INS-0163', ciudadBase: 'Guayaquil', dias: [1, 2, 3, 4, 5], jornada: ['08:30', '17:30'], zonas: ['Guayaquil'], capacidadDia: 6, modalidades: ['Presencial', 'Virtual guiada'] },
    { inspector: 'Luis Andrade', credencial: 'EXT-INS-0031', ciudadBase: 'Quito', dias: [1, 2, 3, 4, 5, 6], jornada: ['09:00', '18:00'], zonas: ['Quito', 'Ambato'], capacidadDia: 4, modalidades: ['Presencial'] },
    { inspector: 'Diana Cárdenas', credencial: 'EUR-INS-0012', ciudadBase: 'Quito', dias: [1, 2, 3, 4, 5], jornada: ['08:00', '16:00'], zonas: ['Quito', 'Guayaquil'], capacidadDia: 5, modalidades: ['Presencial', 'Virtual guiada'] },
    { inspector: 'Jorge Pazmiño', credencial: 'AND-INS-0008', ciudadBase: 'Ambato', dias: [1, 2, 3, 4, 5], jornada: ['08:00', '17:00'], zonas: ['Ambato', 'Cuenca'], capacidadDia: 5, modalidades: ['Presencial'] },
  ],
  bloqueos: [
    { inspector: 'Paola Vinueza', desde: '2026-10-26', hasta: '2026-10-30', motivo: 'Vacaciones' },
    { inspector: 'Marco Tapia', desde: '2026-10-21T13:00', hasta: '2026-10-21T17:00', motivo: 'Capacitación' },
    // Etapa 14b: mañana del martes 20/10 sin agenda fija en Quito (sus horarios se ofrecen a la red · escena portalhoras).
    { inspector: 'Marco Tapia', desde: '2026-10-20T08:00', hasta: '2026-10-20T12:30', motivo: 'Peritaje en el juzgado de tránsito' },
    { inspector: 'Cristian Vaca', desde: '2026-10-20T08:00', hasta: '2026-10-20T12:30', motivo: 'Capacitación' },
    { inspector: 'Diana Cárdenas', desde: '2026-10-20T08:00', hasta: '2026-10-20T12:30', motivo: 'Capacitación de la agencia' },
  ],
  // Etapa 14b · DEC-172: la agenda fija son los inspectores internos y de agencia de «disponibilidad» (los externos no confirman al instante);
  // la red recibe la oferta de los demás horarios y el primero que acepta queda asignado. activo: false = no recibe ofertas.
  red: [
    { inspector: 'Luis Andrade', organizacion: 'Independiente', tipo: 'Externo', credencial: 'EXT-INS-0031', base: [-0.2101, -78.4904], zonas: ['Quito', 'Ambato'], grupos: ['Vehículos', 'Ramos Generales'], modalidades: ['Presencial'], activo: true },
    { inspector: 'Mauricio Endara', organizacion: 'Eurosurvey', agencia: 'eurosurvey', tipo: 'Agencia', credencial: 'EUR-INS-0044', base: [-0.1406, -78.4757], zonas: ['Quito'], grupos: ['Vehículos', 'Ramos Generales'], modalidades: ['Presencial', 'Virtual guiada'], activo: true },
    { inspector: 'Sofía Arteaga', organizacion: 'Inspecciones Andinas Cía. Ltda.', agencia: 'andinas', tipo: 'Agencia', credencial: 'AND-INS-0015', base: [-0.1950, -78.4890], zonas: ['Quito', 'Ambato', 'Cuenca'], grupos: ['Vehículos', 'Ramos Generales', 'Equipo y maquinaria'], modalidades: ['Presencial'], activo: true },
    { inspector: 'Pedro Lasso', organizacion: 'Peritajes del Pacífico S.A.', tipo: 'Agencia', credencial: 'PAC-INS-0003', zonas: ['Manta', 'Guayaquil'], grupos: ['Ramos Generales'], modalidades: ['Presencial'], activo: false, nota: 'Invitación vencida: no recibe ofertas' },
  ],
  // Etapa C2-2 · DEC-178: duración de la visita virtual guiada (videollamada) cuando el enlace de autoagendamiento es de esa modalidad; la presencial sigue la del grupo o el ramo.
  autoagendamiento: { duracionPorRamo: {}, duracionPorModalidad: { 'Virtual guiada': { 'Vehículos': 30 } }, historial: [] },
  // Etapa 15-1 · hora estimada del «Avisar voy en camino» en la app del inspector (distancia en línea recta desde su ubicación base o la visita anterior).
  traslado: { velocidadKmH: 25 },
  // La autoinspección no ocupa agenda de un inspector: se muestra como franja «Enlace vigente» hasta su vencimiento.
  confirmacion: {
    estados: [{ id: 'Por confirmar', badge: 'neutral' }, { id: 'Confirmada', badge: 'success' }, { id: 'Reprogramación pedida', badge: 'warning' }, { id: 'Sin respuesta', badge: 'danger' }],
    regla: 'El recordatorio R06 (día anterior, 15:00) pide confirmar; la respuesta del cliente por WhatsApp o desde el portal cambia el estado. Sin respuesta a las 18:00 del día anterior → «Sin respuesta» y aparece en «Para hoy» del Coordinador.',
    ejemplos: { '20145': 'Confirmada', '20137-G1': 'Por confirmar' },
  },
  reglas: [
    'Arrastrar una visita a otra franja o a otro inspector reagenda (Coordinador o Administrador), con motivo, y valida choque de horario, jornada, bloqueo, zona, modalidad y capacidad del día; si algo no cumple, se explica y no se mueve.',
    'Cada inspector muestra su carga del día (visitas / capacidad) con barra; sobre la capacidad, aviso en ámbar.',
    'Una visita sin inspector aparece en la fila «Sin asignar».',
    'Clic en una visita abre su resumen (caso, asegurado, riesgos, dirección, contacto, modalidad, confirmación) con «Abrir en Coordinación».',
    'El Inspector ve solo su agenda; el Coordinador, la de sus sucursales.',
  ],
};
window.SIRIUS_LIQUIDACIONES = {
  version: '1.2', vigencia: 'Provisional',
  quienCobra: 'Inspectores externos y agencias. Los internos no generan honorarios (su trabajo se ve en reportes, no en liquidaciones).',
  periodo: { tipo: 'Mensual', corte: 'Último día del mes', nota: 'Lo que se envía después del corte entra en el periodo siguiente' },
  hecho: 'Riesgo con informe enviado (o visita fallida registrada) por un inspector que cobra; cada riesgo es una línea.',
  // Tarifa fija por inspección solo para Vehículos (USD sin IVA). Ramos Generales y Equipo y maquinaria se calculan con
  // SIRIUS_HONORARIOS (hora-hombre). El convenio de Eurosurvey para Vehículos vive en su tarifario (TAR-EUR-2026).
  tarifas: [
    { grupo: 'Vehículos', modalidad: 'Presencial', valor: 18.00 }, { grupo: 'Vehículos', modalidad: 'Virtual guiada', valor: 12.00 },
  ],
  convenios: [{ agencia: 'eurosurvey', grupo: 'Vehículos', modalidad: 'Presencial', valor: 16.50, vigente: '2026-01-01 a 2026-12-31' }],
  ajustes: [
    { id: 'garantia', nombre: 'Inspección de garantías (caso hijo)', regla: '70 % de la tarifa del grupo' },
    { id: 'fallida', nombre: 'Visita fallida (el cliente no estuvo)', regla: '50 % de la tarifa, con evidencia de llegada (GPS y hora)' },
    { id: 'traslado', nombre: 'Movilización fuera del perímetro urbano de la ciudad base', regla: 'Según SIRIUS_HONORARIOS.movilizacion (por definir); en Vehículos, USD 10,00 por visita' },
    { id: 'devuelto', nombre: 'Informe devuelto para corregir', regla: 'No paga extra; si el inspector no lo corrige, la línea queda retenida' },
    { id: 'manual', nombre: 'Ajuste manual de Finanzas', regla: 'Monto con signo y motivo obligatorio' },
  ],
  impuestos: 'SIRIUS_COMPANIA.impuestos (IVA con vigencias; retenciones por definir con Contabilidad)',
  estados: [
    { id: 'Abierta', badge: 'neutral', nota: 'Periodo en curso; las líneas se suman solas' },
    { id: 'Por aprobar', badge: 'warning', nota: 'Cerrada al corte; Finanzas revisa' },
    { id: 'Aprobada', badge: 'brand', nota: 'Espera la factura del proveedor' },
    { id: 'Facturada', badge: 'brand', nota: 'Factura cargada y validada (número, fecha, valor); una factura puede agrupar varias liquidaciones aprobadas del mismo proveedor' },
    { id: 'Factura devuelta', badge: 'danger', nota: 'Finanzas la devolvió con motivo; el proveedor la corrige y la vuelve a cargar (tarea pendiente en su inicio)' },
    { id: 'Enviada a pago', badge: 'teal', nota: 'Enviada al sistema contable' },
    { id: 'Pagada', badge: 'success' },
  ],
  reglas: [
    'Finanzas aprueba, ajusta (con motivo) o retiene líneas; cada cambio queda en el Historial de la liquidación.',
    'La factura debe coincidir con el total aprobado; si no, se explica la diferencia y no avanza.',
    'El inspector externo y la agencia ven solo sus liquidaciones (Mis honorarios) y suben su factura.',
    'Envío al sistema contable: operación nueva simulada (CNX-12, provisional).',
  ],
  // Historial de ejemplo (septiembre). El periodo de octubre se calcula con los datos de los casos.
  historial: [
    { id: 'LIQ-2026-09-EUR', proveedor: 'Eurosurvey S.A.', periodo: '2026-09', lineas: 38, subtotal: 640.50, iva: 96.08, total: 736.58, estado: 'Pagada', factura: '001-002-000004521', pagada: '2026-10-10' },
    { id: 'LIQ-2026-09-AND', proveedor: 'Inspecciones Andinas Cía. Ltda.', periodo: '2026-09', lineas: 21, subtotal: 512.00, iva: 76.80, total: 588.80, estado: 'Pagada', factura: '001-001-000001877', pagada: '2026-10-10' },
    { id: 'LIQ-2026-09-LAN', proveedor: 'Luis Andrade', periodo: '2026-09', lineas: 12, subtotal: 236.00, iva: 35.40, total: 271.40, estado: 'Enviada a pago', factura: '001-001-000000312', enviada: '2026-10-14' },
  ],
  inicioFinanzas: [
    ['Por aprobar', 'Liquidaciones en «Por aprobar»', 'Liquidaciones › Por aprobar', 'warning'],
    ['Esperando factura', 'Liquidaciones Aprobadas sin factura', 'Liquidaciones › Aprobadas', 'warning'],
    ['Por pagar', 'Facturadas y enviadas a pago (USD)', 'Liquidaciones › Por pagar', null],
    ['Pagado en el mes', 'Total pagado en el mes del reloj (USD)', 'Liquidaciones › Pagadas', null],
  ],
};
