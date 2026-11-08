// SIRIUS · Catálogos maestros (etapa 10a) · v1.1 · PROVISIONAL (v1.1: Sail, Soluto y CX-30, etapa 16g)
// Preparado en asesoría el 31/10/26. Solo datos: la interfaz los lee de aquí. Fuente única de cada catálogo; nada se duplica en otro archivo.
// Todo el contenido es provisional (insumos del negocio por conseguir: Suscripción, ANT, catálogo WMI completo, fuentes oficiales de mapas).
// Decisiones: DEC-077 a DEC-082. Los resultados ya guardados de los casos no se recalculan.

window.SIRIUS_CATALOGOS_MAESTROS = {
  version: "1",
  historial: { fecha: "18/10/2026 20:20", persona: "Andrea Salazar", motivo: "Carga de los catálogos maestros (etapa 10a)" },

  // 1 · Catálogo de seguimientos: valores por código (DEC-077). Reemplazan norma, prioridad y evidencia de la lista de datos-ejemplo.js
  //     y el bloque "detalle" de datos-salida-rg.js (eliminado en su v1.5). Título, solución, ramos, plazo, relación y "Se considera
  //     cumplido si…" siguen en datos-ejemplo.js sin cambio.
  //     prioridad: Alta · Media · Baja (por ítem). La salida la muestra "[prioridad] · Garantía", "[prioridad] · Recomendación" o "Documento".
  //     norma vacía: la fila "Norma técnica" no se muestra. hallazgo: plantilla de variables (DEC-066); si falta un valor, "—".
  //     ubicacion: si no viene, "Predio completo".
  seguimientos: [
    {codigo: "GAR-INC-01",tipo: "Garantía",prioridad: "Alta",norma: "Reglamento de Prevención, Mitigación y Protección contra Incendios (Acuerdo Ministerial 1257)",evidencia: "Copia del permiso de funcionamiento vigente",hallazgo: "Permiso de bomberos: {rg_bom_permiso}; vigencia: {rg_bom_vigencia}."},
    {codigo: "GAR-INC-02",tipo: "Garantía",prioridad: "Alta",norma: "NFPA 10 · NTE INEN 802",evidencia: "Certificados de mantenimiento y recarga",hallazgo: "{extintoresInstalados} extintores instalados de {rg_pci_ext_requeridos} requeridos; mantenimiento: {rg_pci_ext_mantenimiento}."},
    {codigo: "GAR-INC-03",tipo: "Garantía",prioridad: "Alta",norma: "NFPA 72 · NFPA 101 · Acuerdo Ministerial 1257",evidencia: "Certificado de instalación y puesta en marcha del sistema",hallazgo: "Detección: {rg_pci_det_tipo}; {rg_pci_det_instalados} detectores instalados de {rg_pci_det_requeridos} requeridos; central: {rg_pci_det_central}; señales acústicas y ópticas en todas las zonas: {rg_pci_det_senales}."},
    {codigo: "GAR-INC-04",tipo: "Garantía",prioridad: "Media",norma: "NFPA 72",evidencia: "Factura y fotos de los detectores instalados",hallazgo: "{rg_pci_det_instalados} detectores instalados de {rg_pci_det_requeridos} requeridos."},
    {codigo: "GAR-INC-05",tipo: "Garantía",prioridad: "Media",norma: "NFPA 14 · NFPA 20 · NFPA 22 · NFPA 24",evidencia: "Planos y prueba hidrostática de la red",hallazgo: "Red hídrica: {rg_pci_red_existe}; área de construcción: {rg_ubi_area_construccion} m²."},
    {codigo: "GAR-INC-06",tipo: "Garantía",prioridad: "Media",norma: "NFPA 13",evidencia: "Memoria de cálculo y certificado de prueba del sistema",hallazgo: "Tipo de red: {rg_pci_red_tipo}."},
    {codigo: "GAR-INC-07",tipo: "Garantía",prioridad: "Media",norma: "NFPA 101 · NFPA 1600",evidencia: "Plan aprobado, registro de brigadas y acta del primer simulacro",hallazgo: "Plan de emergencia: {rg_ges_plan_emergencia}; brigadas: {rg_ges_brigadas}; simulacros: {rg_ges_simulacros}."},
    {codigo: "GAR-ROB-01",tipo: "Garantía",prioridad: "Media",norma: "Ley de Vigilancia y Seguridad Privada · Buenas prácticas de seguridad física (ASIS International)",evidencia: "Contrato vigente con la empresa de seguridad",hallazgo: "Vigilancia humana: {rg_rob_vig_existe}."},
    {codigo: "GAR-ROB-02",tipo: "Garantía",prioridad: "Media",norma: "Ley de Vigilancia y Seguridad Privada · Buenas prácticas de seguridad física (ASIS International)",evidencia: "Contrato vigente con la empresa de seguridad",hallazgo: "Vigilancia: {rg_rob_vig_existe}; armada: {rg_rob_vig_armada}; turnos: {rg_rob_vig_turnos}."},
    {codigo: "GAR-ROB-03",tipo: "Garantía",prioridad: "Alta",norma: "Ley de Vigilancia y Seguridad Privada · Buenas prácticas de seguridad física (ASIS International)",evidencia: "Contrato vigente con la empresa de seguridad",hallazgo: "Vigilancia: {rg_rob_vig_existe}; armada: {rg_rob_vig_armada}; días: {rg_rob_vig_dias}."},
    {codigo: "GAR-ROB-04",tipo: "Garantía",prioridad: "Media",norma: "Buenas prácticas de seguridad física (ASIS International)",evidencia: "Fotos de las cámaras y del grabador",hallazgo: "CCTV: {rg_rob_cctv_existe}; cobertura: {rg_rob_cctv_cobertura}."},
    {codigo: "GAR-ROB-05",tipo: "Garantía",prioridad: "Alta",norma: "",evidencia: "Contrato de monitoreo de la alarma",hallazgo: "Alarma de intrusión: {rg_rob_alarma_existe}."},
    {codigo: "GAR-ROB-06",tipo: "Garantía",prioridad: "Media",norma: "",evidencia: "Contrato de monitoreo y respuesta armada",hallazgo: "Monitoreo de la alarma: {rg_rob_alarma_monitoreo}."},
    {codigo: "GAR-ROB-07",tipo: "Garantía",prioridad: "Baja",norma: "",evidencia: "Fotos de los sensores instalados",hallazgo: "Activación de la alarma: {rg_rob_alarma_activacion}."},
    {codigo: "GAR-ROB-08",tipo: "Garantía",prioridad: "Baja",norma: "",evidencia: "Fotos de los sensores instalados",hallazgo: "Activación de la alarma: {rg_rob_alarma_activacion}."},
    {codigo: "GAR-DYV-01",tipo: "Garantía",prioridad: "Media",norma: "",evidencia: "Fotos del área de caja",hallazgo: "Vidrios blindados en caja: {rg_dyv_vidrios_blindados_caja}."},
    {codigo: "GAR-DYV-02",tipo: "Garantía",prioridad: "Alta",norma: "",evidencia: "Fotos del botón de pánico y contrato de monitoreo",hallazgo: "Botón de pánico en caja: {rg_dyv_boton_panico_caja}."},
    {codigo: "GAR-DYV-03",tipo: "Garantía",prioridad: "Alta",norma: "",evidencia: "Fotos de la caja fuerte empotrada",hallazgo: "Resguardo: {rg_dyv_resguardo}."},
    {codigo: "GAR-DYV-04",tipo: "Garantía",prioridad: "Media",norma: "",evidencia: "Protocolo de traslado con resguardo policial",hallazgo: "Transporte de valores: {rg_dyv_transporte}."},
    {codigo: "GAR-DYV-05",tipo: "Garantía",prioridad: "Alta",norma: "Ley de Vigilancia · Seguridad Privada",evidencia: "Contrato con la empresa de transporte de valores",hallazgo: "Transporte de valores: {rg_dyv_transporte}."},
    {codigo: "DOC-01",tipo: "Documento",prioridad: "Media",norma: "",evidencia: "Bitácoras y cronograma de mantenimientos",hallazgo: "Plan de mantenimiento: {rg_ee_plan_mantenimiento}."},
    {codigo: "DOC-02",tipo: "Documento",prioridad: "Media",norma: "",evidencia: "Listado detallado y valorado de bienes",hallazgo: "Equipos registrados en el inventario: {conteo rg_ee_equipos}."},
    {codigo: "DOC-03",tipo: "Documento",prioridad: "Alta",norma: "",evidencia: "Copia del permiso"},
    {codigo: "DOC-04",tipo: "Documento",prioridad: "Media",norma: "NFPA 101",evidencia: "Plan con sello de aprobación"},
    {codigo: "DOC-05",tipo: "Documento",prioridad: "Media",norma: "NFPA 10",evidencia: "Certificados del proveedor"},
    {codigo: "REC-01",tipo: "Recomendación de mejora",prioridad: "Baja",norma: "NEC-SB-IE · NTE INEN-ISO 3864",evidencia: "Fotos de los tableros rotulados"},
    {codigo: "REC-02",tipo: "Recomendación de mejora",prioridad: "Baja",norma: "NFPA 70 · NFPA 70B · NEC-SB-IE",evidencia: "Diagrama unifilar y planos eléctricos actualizados",hallazgo: "Planos eléctricos actualizados: {rg_ele_chk_14}; mantenimiento eléctrico: {rg_ele_mantenimiento}."},
    {codigo: "REC-03",tipo: "Recomendación de mejora",prioridad: "Baja",norma: "NFPA 10",evidencia: "Tarjetas de inspección mensual"},
    {codigo: "REC-04",tipo: "Recomendación de mejora",prioridad: "Baja",norma: "NFPA 101",evidencia: "Fotos de la sectorización"},
    {codigo: "REC-05",tipo: "Recomendación de mejora",prioridad: "Baja",norma: "NEC-SE-DS (Norma Ecuatoriana de la Construcción · peligro sísmico)",evidencia: "Fotos de los anclajes instalados",hallazgo: "Zona sísmica: {rg_nat_zona_sismica}; exposición sísmica: {rg_nat_exposicion·Sísmico}; altura de apilamiento: {rg_alm_altura_apilamiento·Bodega 1} m.",ubicacion: "Bodega 1 · [rg_alm_nombre]"},
    {codigo: "PRE-01",tipo: "Preexistencia",prioridad: "Media",norma: "NEC-SE-DS",evidencia: "Informe técnico y fotos de la reparación"},
    {codigo: "PRE-02",tipo: "Preexistencia",prioridad: "Media",norma: "NEC-SE-DS",evidencia: "Informe técnico y fotos de la reparación"},
    {codigo: "PRE-03",tipo: "Preexistencia",prioridad: "Media",norma: "NEC-SE-DS",evidencia: "Informe técnico y fotos de la reparación"},
    {codigo: "PRE-04",tipo: "Preexistencia",prioridad: "Media",norma: "NEC-SE-DS",evidencia: "Informe técnico y fotos de la reparación"},
    {codigo: "PRE-05",tipo: "Preexistencia",prioridad: "Media",norma: "NEC-SE-DS",evidencia: "Informe técnico y fotos de la reparación"},
    {codigo: "PRE-06",tipo: "Preexistencia",prioridad: "Media",norma: "NEC-SE-DS",evidencia: "Informe técnico y fotos de la reparación"}
  ],

  // 2 · Categorías de licencia de conducir (Ecuador). Reemplazan las opciones de veh_tipo_licencia (antes A, B, C, D, E, F, G).
  licencias: [
    { codigo: "A", tipo: "No profesional", descripcion: "Motocicletas, tricimotos y cuadrones" },
    { codigo: "A1", tipo: "Profesional", descripcion: "Mototaxis y tricimotos de transporte comercial" },
    { codigo: "B", tipo: "No profesional", descripcion: "Vehículos livianos de hasta 3,5 t y hasta 9 pasajeros" },
    { codigo: "C1", tipo: "Profesional", descripcion: "Vehículos policiales, militares, municipales y ambulancias" },
    { codigo: "C", tipo: "Profesional", descripcion: "Taxis y vehículos livianos de transporte comercial" },
    { codigo: "D1", tipo: "Profesional", descripcion: "Transporte escolar, institucional y de turismo hasta 25 pasajeros" },
    { codigo: "D", tipo: "Profesional", descripcion: "Buses de transporte de pasajeros" },
    { codigo: "E1", tipo: "Profesional", descripcion: "Vehículos de emergencia y de mercancías peligrosas" },
    { codigo: "E", tipo: "Profesional", descripcion: "Camiones pesados y extrapesados, con o sin remolque" },
    { codigo: "F", tipo: "No profesional", descripcion: "Vehículos adaptados para personas con discapacidad" },
    { codigo: "G", tipo: "Especial", descripcion: "Maquinaria agrícola y equipo caminero" },
  ],

  // 3 · Marcas, modelos y versiones (DEC-079). Opciones de veh_marca (7, sin cambio) y de veh_modelo filtradas por la marca.
  //     Opción visible de veh_modelo: el modelo y cada "modelo versión" (Sportage y Sportage LX son válidos).
  //     Incluye todos los pares de datos-ejemplo.js y de datos-pruebas-ia.js, más Chevrolet Sail, Kia Soluto y Mazda CX-30 (carga masiva de demo, etapa 16g; Chery queda fuera a propósito). "Otra" no existe: un valor fuera del catálogo queda Por confirmar.
  marcas: [
    { marca: "Chevrolet", modelos: [{ modelo: "Onix", versiones: ["LT"] }, { modelo: "D-Max", versiones: [] }, { modelo: "Sail", versiones: [] }] },
    { marca: "Kia", modelos: [{ modelo: "Sportage", versiones: ["LX"] }, { modelo: "Seltos", versiones: [] }, { modelo: "Soluto", versiones: [] }] },
    { marca: "Hyundai", modelos: [{ modelo: "Tucson", versiones: ["GL"] }, { modelo: "Creta", versiones: [] }] },
    { marca: "Toyota", modelos: [{ modelo: "Corolla Cross", versiones: [] }, { modelo: "Hilux", versiones: ["4x4"] }, { modelo: "Fortuner", versiones: [] }] },
    { marca: "Mazda", modelos: [{ modelo: "CX-5", versiones: [] }, { modelo: "CX-30", versiones: [] }] },
    { marca: "Renault", modelos: [{ modelo: "Duster", versiones: [] }] },
    { marca: "Nissan", modelos: [{ modelo: "Frontier", versiones: [] }] },
  ],

  // 4 · WMI (ISO 3780) para la fila "Codificación del VIN" de IA-04-VL (DEC-080). Carga parcial: códigos de los VIN de ejemplo y de las
  //     marcas del catálogo. Un WMI que no está aquí: "Servicio no disponible" con la observación "WMI no registrado en el catálogo".
  //     Fabricante o país distintos de veh_marca o veh_pais_origen: "Con novedad".
  wmi: [
    { wmi: "9BG", fabricante: "General Motors do Brasil", marca: "Chevrolet", pais: "Brasil" },
    { wmi: "9BR", fabricante: "Toyota do Brasil", marca: "Toyota", pais: "Brasil" },
    { wmi: "JTD", fabricante: "Toyota Motor Corporation", marca: "Toyota", pais: "Japón" },
    { wmi: "KNA", fabricante: "Kia Corporation", marca: "Kia", pais: "Corea del Sur" },
    { wmi: "KND", fabricante: "Kia Corporation (SUV y MPV)", marca: "Kia", pais: "Corea del Sur" },
    { wmi: "KMH", fabricante: "Hyundai Motor Company", marca: "Hyundai", pais: "Corea del Sur" },
    { wmi: "JM3", fabricante: "Mazda Motor Corporation (SUV)", marca: "Mazda", pais: "Japón" },
    { wmi: "3N1", fabricante: "Nissan Mexicana", marca: "Nissan", pais: "México" },
    { wmi: "VF1", fabricante: "Renault", marca: "Renault", pais: "Francia" },
  ],

  // 5 · Mapas de referencia por amenaza (DEC-081, completa DEC-070). Una fuente por instancia fija de m04. IA-04 la usa para ev_mapa_amenaza
  //     con el punto del predio, solo para amenazas con exposición registrada. Mientras la conexión no esté configurada: "Simulada".
  //     Los nombres de las 5 primeras son los que ya muestran las leyendas de 20195 (sin cambio).
  mapasAmenaza: [
    { amenaza: "Sísmico", fuente: "Zonificación sísmica NEC-15", institucion: "Ministerio de Desarrollo Urbano y Vivienda (NEC-SE-DS)", estado: "Simulada" },
    { amenaza: "Inundación", fuente: "Amenaza por inundación SNGR", institucion: "Secretaría Nacional de Gestión de Riesgos", estado: "Simulada" },
    { amenaza: "Volcánico", fuente: "Amenaza volcánica IG-EPN", institucion: "Instituto Geofísico de la Escuela Politécnica Nacional", estado: "Simulada" },
    { amenaza: "Vientos y rayos", fuente: "Vientos y tormentas INAMHI", institucion: "Instituto Nacional de Meteorología e Hidrología", estado: "Simulada" },
    { amenaza: "Deslizamiento", fuente: "Susceptibilidad a movimientos en masa SNGR", institucion: "Secretaría Nacional de Gestión de Riesgos", estado: "Simulada" },
    { amenaza: "Maremoto", fuente: "Amenaza por tsunami INOCAR", institucion: "Instituto Oceanográfico y Antártico de la Armada", estado: "Simulada" },
  ],

  // 6 · Ajuste VL-F1 de la plantilla "Vehículos livianos" v1 (mismo mecanismo que F1 a F3 de RG). Solo cambia de dónde salen las opciones:
  //     no cambia campos, obligatoriedad ni etiquetas. "Elegible para IA" y "Cédula o RUC" siguen en el backlog.
  ajustePlantillaVL: {
    plantilla: "Vehículos livianos", version: "1", ajuste: "VL-F1", fecha: "18/10/2026 20:20", persona: "Andrea Salazar",
    motivo: "Opciones desde los catálogos maestros",
    campos: [
      { clave: "veh_marca", opciones: "Catálogo Marcas y modelos (marca)" },
      { clave: "veh_modelo", opciones: "Catálogo Marcas y modelos (modelos y versiones de la marca elegida)" },
      { clave: "veh_tipo_licencia", opciones: "Catálogo Categorías de licencia (11)" },
    ],
  },

  esperado: {
    plantillaVL: "94 campos sin cambio; veh_tipo_licencia con 11 opciones; historial con la entrada VL-F1",
    resumen20195: "Mismas 4 páginas. Cambian 5 fichas: GAR-INC-03 (norma), GAR-INC-07 (Media · Garantía; separador ·), GAR-ROB-01 (norma y Media · Garantía), REC-02 (norma y Baja · Recomendación), REC-05 (Baja · Recomendación). Evidencias y hallazgos sin cambio",
    informeTecnico20195: "Sin cambio de páginas; las leyendas de los 5 mapas, iguales",
    pruebaIA04VL: "33 de 34 sin cambio (la codificación del VIN no entra en el cálculo). Al ejecutar de nuevo vlp1 y vlp2: Codificación del VIN Sin novedad",
    casos: "Ningún caso cambia de estado, asegurabilidad ni verificaciones guardadas",
  },
};
