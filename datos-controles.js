// SIRIUS · Catálogo único de controles (v1.1 · provisional · etapa C2-9b · 09/11/2026; v1.1: versiones, etapa C2-9c) · DEC-188
// Administración › Controles: los controles que genera el sistema para quien revisa el caso, comunes a todas las modalidades. Antes vivían en la
// configuración de la autoinspección (SIRIUS_AUTOINSPECCION.controles, DEC-149); ahora la autoinspección referencia este catálogo.
// Cada control: id · nombre · severidad ('alta' | 'media' | 'baja' | 'según gravedad') · umbral y unidad (si aplica) · aplicaA (modalidades) ·
// opcionalEn (modalidades donde se puede apagar por plantilla) · siPlantillaExige (modalidades donde aplica solo si la plantilla lo pide) · ramos · activo.
// Solo datos; la presentación está en sirius-controles-catalogo.js y el cálculo de las alertas en sirius-controles-ai.js.
window.SIRIUS_CONTROLES = {
  version: 1, vigencia: 'Provisional', decision: 'DEC-188', vigenteDesde: '2026-10-18', mod: '2026-10-18 20:30', por: 'Andrea Salazar',
  modalidades: ['Autoinspección', 'Presencial', 'Virtual guiada'],
  severidades: ['alta', 'media', 'baja', 'según gravedad'],
  ramos: ['Vehículos', 'Equipo y maquinaria'],
  catalogo: [
    { id: 'placaNoCoincide', nombre: 'Placa leída (frente o posterior) distinta de la solicitud', severidad: 'alta', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'placasDistintas', nombre: 'Placa del frente distinta de la posterior', severidad: 'alta', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'vinNoCoincide', nombre: 'VIN o serie leídos distintos de la solicitud', severidad: 'alta', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'extraFueraSolicitud', nombre: 'Extra agregado por el cliente (no estaba declarado)', severidad: 'media', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'extraSinFoto', nombre: 'Extra declarado sin foto', severidad: 'media', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'extraNoLoTiene', nombre: 'Extra declarado en la solicitud marcado «No lo tengo»', severidad: 'media', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'fotoForzada', nombre: 'Foto rechazada por la validación y usada igual', severidad: 'alta', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'videoIncompleto', nombre: 'Video sin la vuelta completa', severidad: 'media', umbral: 300, unidad: 'grados', aplicaA: ['Autoinspección'], siPlantillaExige: ['Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'tipoCambiado', nombre: 'El cliente cambió el tipo de vehículo', severidad: 'media', aplicaA: ['Autoinspección'], ramos: ['Vehículos'], activo: true },
    { id: 'pantalla', nombre: 'Posible foto tomada a una pantalla', severidad: 'alta', umbral: 60, unidad: '% de indicio', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], opcionalEn: ['Presencial'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'ubicacion', nombre: 'Cambio de ubicación entre fotos', severidad: 'media', umbral: 150, unidad: 'm', aplicaA: ['Autoinspección', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'precision', nombre: 'Ubicación imprecisa', severidad: 'baja', umbral: 100, unidad: 'm', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'sinUbicacion', nombre: 'Fotos sin ubicación', severidad: 'media', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'tiempoTotal', nombre: 'Duración total de las fotos', severidad: 'media', umbral: 30, unidad: 'min', aplicaA: ['Autoinspección'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'tiempoEntreFotos', nombre: 'Tiempo entre dos fotos', severidad: 'media', umbral: 10, unidad: 'min', aplicaA: ['Autoinspección'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'encuadre', nombre: 'Encuadre no verificado', severidad: 'baja', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'sinVideo', nombre: 'Sin video de 360°', severidad: 'media', aplicaA: ['Autoinspección'], siPlantillaExige: ['Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'danos', nombre: 'Daños detectados por el sistema', severidad: 'según gravedad', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    { id: 'documentoPortal', nombre: 'Documento del portal distinto de la solicitud', severidad: 'alta', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'documentoPortalAnio', nombre: 'Año del documento del portal distinto de la solicitud', severidad: 'media', aplicaA: ['Autoinspección', 'Presencial', 'Virtual guiada'], ramos: ['Vehículos'], activo: true },
    { id: 'llegadaFuera', nombre: 'Llegada del inspector fuera de los 150 m', severidad: 'media', umbral: 150, unidad: 'm', aplicaA: ['Presencial'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true },
    // Nuevos de la presencial (etapa C2-9b).
    { id: 'fotoLejos', nombre: 'Foto lejos de la dirección de la visita', severidad: 'media', umbral: 150, unidad: 'm', aplicaA: ['Presencial'], ramos: ['Vehículos', 'Equipo y maquinaria'], activo: true, nuevo: true },
    { id: 'placaInforme', nombre: 'Placa del informe distinta de la solicitud', severidad: 'alta', aplicaA: ['Presencial'], ramos: ['Vehículos'], activo: true, nuevo: true },
    { id: 'vinInforme', nombre: 'VIN del informe distinto de la solicitud', severidad: 'alta', aplicaA: ['Presencial'], ramos: ['Vehículos'], activo: true, nuevo: true },
    { id: 'anioInforme', nombre: 'Año del informe distinto de la solicitud', severidad: 'media', aplicaA: ['Presencial'], ramos: ['Vehículos'], activo: true, nuevo: true },
  ],
  // Etapa C2-9c: cada cambio guardado crea una versión nueva con motivo y vigencia (como el resto de la configuración); la anterior queda reemplazada.
  versiones: [{ version: 1, desde: '2026-10-18', por: 'Andrea Salazar', motivo: 'DEC-188: un solo catálogo de controles para todas las modalidades', estado: 'Vigente' }],
  historial: [
    { when: '18/10/26 · 20:30', by: 'Andrea Salazar', what: 'Publicó la versión 1 del catálogo único de controles: 21 controles traídos de la configuración de la autoinspección con su aplicación por modalidad y 4 nuevos de la presencial', motivo: 'DEC-188: un solo catálogo de controles para todas las modalidades' },
  ],
};
