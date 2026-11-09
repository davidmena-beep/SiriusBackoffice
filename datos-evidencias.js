// SIRIUS · Evidencias unificadas y visor único (v1.0 · provisional · etapa C2-6 · 09/11/2026) · DEC-184
// Fuente única de las evidencias de un caso (fotos y documentos de la app del inspector, del portal del cliente, del back-office y, más adelante,
// de la virtual guiada). Aquí solo hay datos; la lógica está en sirius-evidencias.js. En Ramos Generales «paso» se lee como «grupo de insumos».
window.SIRIUS_EVIDENCIAS = {
  version: '1.0', vigencia: 'Provisional', decision: 'DEC-184',
  canales: ['App del inspector', 'Portal del cliente', 'Back-office', 'Virtual guiada'],
  // Nombres de canal que llegan de otras fuentes y su canal unificado.
  sinonimos: { 'Videollamada guiada': 'Virtual guiada', 'Videollamada': 'Virtual guiada', 'Portal': 'Portal del cliente', 'App': 'App del inspector' },
  estados: ['Asignada', 'Confirmada', 'Excluida'],
  // Estados de origen (Ramos Generales y conexión) y su estado unificado; el de origen se muestra como nota en el visor.
  estadoDe: { 'Por confirmar': 'Asignada', 'Sin clasificar': 'Asignada', 'Documento detectado': 'Asignada', 'Asignada por el inspector': 'Asignada', 'Pendiente': 'Asignada' },
  filtrosFotos: [['todas', 'Todas'], ['asig', 'Asignadas'], ['conf', 'Confirmadas'], ['excl', 'Excluidas'], ['sgps', 'Sin GPS'], ['ctl', 'Con control']],
  exclusionMinimo: 5,   // caracteres mínimos del motivo para excluir (regla de la etapa VF)
  zoom: { min: 0.5, max: 5, paso: 0.25, rueda: 0.15 },
  // Daños a mano desde el visor.
  danos: { zonas: ['Frente', 'Posterior', 'Lateral izquierdo', 'Lateral derecho', 'Techo', 'Interior', 'Otra'], tipos: ['Rayón', 'Abolladura', 'Rotura', 'Fisura', 'Faltante', 'Otro'], gravedades: ['Leve', 'Media', 'Grave'] },
  // Coordenadas de la dirección de la visita de los casos de ejemplo (para la distancia y el mapa del visor). Con la conexión: caso.gps o la distancia que llega.
  direcciones: {
    '30003': [-0.17985, -78.47930], '30004': [-0.17985, -78.47930], '30005': [-0.17985, -78.47930], '30006': [-0.17985, -78.47930], '30007': [-0.17985, -78.47930], '30008': [-0.17985, -78.47930],
    '20196': [-0.16490, -78.47790], '20202': [-2.17110, -79.92230], '20186': [-2.17040, -79.92200], '20141': [-0.20080, -78.43260], '20195': [-1.05462, -80.45412],
  },
  dispositivoPorCanal: { 'Portal del cliente': 'Celular del cliente · navegador', 'Back-office': 'Computador · back-office', 'Virtual guiada': 'Captura de la videollamada' },
};
