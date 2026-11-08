// SIRIUS · Guías de captura y detección de daños (v1 · provisional · etapa 12a · 04/11/2026)
// Fuente única de: validaciones en vivo de la cámara, textos de ayuda por tipo de guía, regla de la foto de cerca pedida por el
// sistema, modelo de daño detectado (área, tipo, superficie, profundidad estimada, gravedad, confianza y origen), revisión por
// una persona y ejemplos. El dibujo (siluetas, marcos, zonas y mapa de captura) vive en SIRIUS_SILUETAS. Decisiones: DEC-132 a DEC-134.
window.SIRIUS_CAPTURA = {
  version: '1', vigencia: 'Provisional',
  // ---------- Validaciones en vivo (simuladas en el prototipo) ----------
  validaciones: [
    { id: 'encuadre', nombre: 'Encuadre', regla: 'El objeto ocupa al menos el 70 % de la guía y no se sale de ella', mensajeFalla: { cerca: 'Aléjate un paso', lejos: 'Acércate un poco', fuera: 'Centra el vehículo en la silueta' } },
    { id: 'orientacion', nombre: 'Orientación', regla: 'La del paso (vertical u horizontal)', mensajeFalla: { gira: 'Gira el celular' } },
    { id: 'luz', nombre: 'Luz', regla: 'Exposición suficiente y sin contraluz fuerte', mensajeFalla: { oscuro: 'Busca más luz', contraluz: 'Evita el sol de frente' } },
    { id: 'nitidez', nombre: 'Nitidez', regla: 'Sin movimiento ni desenfoque', mensajeFalla: { borrosa: 'Mantén el celular quieto' } },
    { id: 'reflejo', nombre: 'Reflejo', regla: 'Solo documentos y placas: sin brillo que tape el texto', mensajeFalla: { brillo: 'Inclina un poco para quitar el reflejo' } },
    { id: 'lectura', nombre: 'Lectura', regla: 'Si el paso extrae un dato (placa, VIN, serie, kilometraje, horómetro), el dato se lee con confianza suficiente', mensajeFalla: { ilegible: 'No se lee el dato; acércate o mejora la luz' } },
  ],
  disparador: 'El botón de captura se habilita cuando encuadre, orientación, luz y nitidez están en verde; reflejo y lectura avisan pero no bloquean (configurable por paso).',
  configurablePorPaso: ['Tipo de guía (silueta o marco)', 'Vista o marco', 'Orientación', 'Texto de ayuda', 'Zona objetivo (p. ej. «Placa aquí»)', 'Validaciones activas', 'Cuáles bloquean el disparador'],
  textosPorGuia: {
    'silueta:frente': 'Ponte de frente, a unos 3 pasos. Que se lea la placa.',
    'silueta:posterior': 'Ponte detrás, a unos 3 pasos. Que se lea la placa.',
    'silueta:lateral': 'Aléjate hasta que el vehículo entero quepa en la silueta.',
    'marco:placa': 'La placa dentro del recuadro, sin reflejo.',
    'marco:franja': 'El número completo dentro de la franja.',
    'marco:circulo': 'El neumático completo y la medida del flanco legible.',
    'marco:tablero': 'Enciende el motor: deben verse los testigos y el kilometraje u horómetro.',
    'marco:documento': 'Sobre una superficie plana, sin dedos encima.',
    'marco:libre': 'Centra lo que se pide en el marco.',
  },
  // ---------- Detección de daños (DEC-134) ----------
  danos: {
    alcance: 'El sistema analiza todas las fotos exteriores del riesgo; el cliente no declara daños.',
    tipos: ['Rayón', 'Abolladura', 'Rotura', 'Faltante', 'Desprendimiento', 'Oxidación', 'Fisura de vidrio'],
    profundidad: { categorias: ['Superficial', 'Media', 'Profunda'], nunca: 'milímetros', umbralConfianza: 60, sinConfianza: 'Por confirmar',
      estado: 'Pendiente de confirmación del negocio (corrige el anexo 7.3); se usa con este valor por defecto' },
    gravedad: [
      { si: 'Profundidad Profunda, o tipo Rotura, Faltante o Fisura de vidrio', resultado: 'Alta' },
      { si: 'Abolladura de profundidad Media, o superficie mayor a 4 dm²', resultado: 'Media' },
      { si: 'Resto (p. ej. rayón superficial de hasta 2 dm²)', resultado: 'Baja' },
    ],
    fotoDeCerca: { si: 'Posible daño con confianza menor a 75 % en el tipo o la profundidad, o área menor a 1 dm² en una foto general', accion: 'Agrega al mapa de captura un paso «Foto de cerca · <pieza>» con marco libre y círculo central, y referencia de tamaño (mano o tarjeta)', limite: 'Máximo 5 fotos de cerca por riesgo' },
    area: 'Polígono sobre la foto (coordenadas relativas 0 a 1), translúcido en el color de la gravedad, con puntos editables. Superficie estimada en dm² con su confianza.',
    estados: [
      { id: 'Propuesto', nota: 'Lo detectó el sistema; falta revisión', badge: 'brand' },
      { id: 'Confirmado', nota: 'Una persona lo aceptó sin cambios', badge: 'success' },
      { id: 'Ajustado', nota: 'Una persona cambió el área, el tipo, la profundidad o la pieza', badge: 'warning' },
      { id: 'Descartado', nota: 'No era un daño (reflejo, suciedad); con motivo', badge: 'neutral' },
      { id: 'Agregado a mano', nota: 'Lo registró el inspector (presencial) o el calificador', badge: 'teal' },
    ],
    revision: 'La hacen el inspector (presencial y virtual) y el calificador. Calificar un riesgo con daños «Propuestos» pide revisarlos antes de grabar.',
    preexistencias: 'Los daños Confirmados, Ajustados o Agregados a mano pasan a la grilla de averías como preexistencias del riesgo.',
  },
  // Ejemplos para el prototipo: daños propuestos por el sistema en fotos existentes (pasos de SIRIUS_EJEMPLO.evidencias).
  ejemplos: [
    { riesgo: '20196-V1', foto: 'exteriores_lateral_derecho_de_ade', pieza: 'puerta_delantera_der', tipo: 'Abolladura', confTipo: 92, superficie: 3.1, confSup: 85, profundidad: 'Media', confProf: 78,
      poligono: [[0.32, 0.46], [0.41, 0.40], [0.50, 0.47], [0.46, 0.60], [0.36, 0.59]], estado: 'Confirmado', por: 'Marco Tapia', en: '2026-10-16T10:30' },
    { riesgo: '20196-V1', foto: 'exteriores_posterior', pieza: 'parachoques_posterior', tipo: 'Rayón', confTipo: 88, superficie: 1.5, confSup: 80, profundidad: 'Superficial', confProf: 82,
      poligono: [[0.40, 0.70], [0.58, 0.69], [0.60, 0.74], [0.42, 0.76]], estado: 'Confirmado', por: 'Marco Tapia', en: '2026-10-16T10:31' },
    { riesgo: '20141-V1', foto: 'exteriores_posterior', pieza: 'parachoques_posterior', tipo: 'Abolladura', confTipo: 71, superficie: 2.0, confSup: 64, profundidad: 'Por confirmar', confProf: 52,
      poligono: [[0.30, 0.68], [0.44, 0.66], [0.47, 0.76], [0.33, 0.78]], estado: 'Propuesto', fotoDeCerca: 'Pedida y tomada (danos_danos)' },
    { riesgo: '20141-V1', foto: 'exteriores_lateral_izquierdo_de_ade', pieza: 'puerta_posterior_izq', tipo: 'Rayón', confTipo: 58, superficie: 0.6, confSup: 50, profundidad: 'Por confirmar', confProf: 40,
      poligono: [[0.55, 0.52], [0.60, 0.51], [0.61, 0.54], [0.56, 0.55]], estado: 'Propuesto', nota: 'Posible reflejo: caso de ejemplo para «Descartar» con motivo' },
  ],
};
(function () {
  const C = window.SIRIUS_CAPTURA;
  // Gravedad según tipo, profundidad y superficie (regla por defecto).
  C.gravedad = (tipo, prof, sup) => (prof === 'Profunda' || ['Rotura', 'Faltante', 'Fisura de vidrio'].indexOf(tipo) >= 0) ? 'Alta' : ((tipo === 'Abolladura' && prof === 'Media') || sup > 4) ? 'Media' : 'Baja';
  C.profundidadMostrada = (cat, conf) => conf < C.danos.profundidad.umbralConfianza ? C.danos.profundidad.sinConfianza : cat;
})();
