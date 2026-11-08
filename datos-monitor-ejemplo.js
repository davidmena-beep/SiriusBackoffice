// SIRIUS · Monitor del proceso · calibración de la cronología de ejemplo (prototipo · etapas 16f-3 y 16f-3b · DEC-170)
// Complementa a datos-monitor.js (SIRIUS_MONITOR, tal cual): aquí van solo los parámetros que el generador necesita y que
// SIRIUS_MONITOR no trae (reparto por sucursal y responsable, dedicación y ausencias de las personas, multiplicadores por
// modalidad, probabilidades de devolución y nombres de ejemplo). En producción este archivo no existe: el Monitor lee la
// cronología real de los casos y la capacidad de Agenda.
window.SIRIUS_MONITOR_EJEMPLO = {
  version: '1', vigencia: 'Provisional · solo prototipo',
  // Días de cronología generada: período actual (30) + período anterior (30) para comparar + 15 de arranque.
  diasHistoria: 75,
  // Desde esta fecha Verónica Lema cubre además la coordinación de Manta y dedica menos horas a calificar (tendencia de SIRIUS_MONITOR.generador).
  inicioTendencia: '2026-10-08',
  sucursales: { 'Quito Norte': 0.27, 'Guayaquil': 0.24, 'Quito Sur': 0.11, 'Cuenca': 0.11, 'Manta': 0.11, 'Ambato': 0.08, 'Ibarra': 0.08 },
  ejecutivos: { 'Verónica Lema': 0.76, 'Daniela Ruiz': 0.24 },
  // dedicacion: fracción de la jornada hábil (8 h) que la persona dedica a los casos de su rol.
  personas: {
    'Andrea Salazar': { rol: 'Coordinador de inspecciones', dedicacion: 1 },
    'Verónica Lema': { rol: 'Ejecutivo de inspecciones', dedicacion: 1, dedicacionDesdeTendencia: 0.3, nota: 'Desde el 08/10 cubre además la coordinación de Manta' },
    'Daniela Ruiz': { rol: 'Ejecutivo de inspecciones', dedicacion: 0.6, ausencias: [['2026-10-01', '2026-10-02', 'Vacaciones']] },
    'Ricardo Almeida': { rol: 'Suscriptor', dedicacion: 0.4, ausencias: [['2026-09-29', '2026-09-29', 'Capacitación']] },
  },
  dedicacionInspector: 0.75,
  // Multiplicador de la espera por modalidad (la autoinspección no espera la franja de un inspector).
  modalidadEspera: { 'Agendado': { 'Autoinspección': 0.12, 'Virtual guiada': 0.45, 'Presencial': 1 }, 'En coordinación': { 'Autoinspección': 0.5, 'Virtual guiada': 0.8, 'Presencial': 1 } },
  // Devolución del informe: primera vez (base o en la concentración de SIRIUS_MONITOR.generador.retrabajo) y repetición.
  devolucion: { base: 0.15, concentracion: 0.45, repetir: 0.2 },
  motivosDevolucion: [['Fotos ilegibles del tablero', 0.6], ['Falta la foto del número de chasis', 0.25], ['Kilometraje no coincide con el tablero', 0.15]],
  fotoRechazada: 0.06,             // autoinspección: el cliente repite fotos rechazadas (cuenta como retrabajo)
  suscripcion: 0.5,                // casos de Ramos Generales y Equipo y maquinaria con calificación dual
  cancelacion: 0.03,               // se cancelan en coordinación
  lotes: { proporcion: 0.38, desde: '16:00' }, // = SIRIUS_MONITOR.generador.lotes
  trasladoHoras: 0.75,            // 16f-3b · Cargabilidad: traslado que se suma a cada visita presencial
  sigmaTrabajo: 0.45,
  nombres: {
    personas: ['Juan Carlos Égüez', 'María Fernanda Ortiz', 'Pablo Andrés Salgado', 'Sofía Benítez Mora', 'Diego Armando Paz', 'Lucía Carrera Vela', 'Andrés Proaño León', 'Gabriela Torres Ruiz', 'Héctor Villacís', 'Patricia Andrade Mena', 'Ricardo Montesdeoca', 'Valeria Cisneros', 'Jorge Luis Naranjo', 'Carolina Espinosa', 'Mateo Guerrero Cobo', 'Daniela Saltos', 'Fernando Ayala', 'Cristina Haro Pozo'],
    empresas: ['Agrícola Los Andes S.A.', 'Comercial Sierra Norte Cía. Ltda.', 'Importadora El Ejido S.A.', 'Panificadora La Espiga', 'Constructora Litoral S.A.', 'Clínica Santa Inés', 'Hostería Valle Verde', 'Distribuidora Austral S.A.', 'Textiles del Pacífico', 'Ferretería Central Cía. Ltda.', 'Laboratorios Andinos S.A.', 'Florícola Cayambe'],
    brokers: ['Tecniseguros', 'Novaseguros', 'Asesores Andinos', 'Directo', 'Seguros Unidos Brokers'],
  },
};
