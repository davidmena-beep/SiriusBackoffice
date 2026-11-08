// SIRIUS · Salida de Ramos Generales (BO-27 · plantilla por defecto) · v1.1 · Datos de ejemplo
// v1.1 (30/10/26, envío S2): etiquetas de los valores derivados (antes las ponía el diseño). Sin otros cambios.
// v1.2 (30/10/26, S0b para S3): observaciones por capítulo (DEC-067, ajuste F3), sustento de la calificación (DEC-068), documentos de
//   respaldo por capítulo (DEC-069), mapas y rutas (DEC-070), orden de los bloques de cada capítulo y correcciones de S2 (claves visibles,
//   espejos y cálculos sin resolver, unidades, listas vacías). Requiere datos-informe-rg.js v1.6 (bloque f3).
// v1.3 (30/10/26, S4): descarga de PDF idéntica a la vista previa (DEC-075), leyenda de foto con su observación (DEC-074),
//   criterios No aplica en la calificación por capítulo y regla explícita del porcentaje. Requiere datos-informe-rg.js v1.7.
// v1.4 (31/10/26, S4b): composición y paginación (DEC-076). El Informe técnico de 20195 salió con 144 páginas, títulos solos y páginas casi
//   vacías. Reglas de flujo continuo, bloques compactos y control de calidad de la paginación, válidas para cualquier caso.
// v1.5 (31/10/26, 10a): sin el bloque "detalle"; se lee del catálogo de seguimientos (datos-catalogos-maestros.js). Sin otros cambios.
// Preparado en asesoría el 30/10/26 (bloque S, paso S0) a partir de 6 informes Eurosurvey reales (5 de Ramos Generales y 1 de Equipo y
//   maquinaria), del anexo v10 (11.5) y de export-plantilla-ubicacion-rg.md (F2). Solo datos: la interfaz los lee de aquí.
// Reemplaza la salida en dos partes (Parte 1 y Parte 2, DEC-042) por dos documentos independientes (DEC-056 y DEC-061):
//   "Resumen para el APS" e "Informe técnico". Nombres tomados del anexo v10 (11.5). El contenido sigue a Eurosurvey; los colores, al
//   sistema de diseño. Los valores salen de datos-informe-rg.js (caso 20195, estado base Enviado: Borrador + bloque envio) y de la
//   calificación guardada. Nunca se redacta ni se completa nada desde el diseño: un dato vacío se muestra "—".
// Decisiones: DEC-056, DEC-058 a DEC-066 (provisionales). Los textos de norma técnica, evidencia y prioridad son propuesta de asesoría:
//   por confirmar con Suscripción (pasan al catálogo de garantías en la etapa 10a).

window.SIRIUS_SALIDA_RG = {
  version: "1.5",
  plantilla: { codigo: "SAL-RG-01", nombre: "Ramos Generales · por defecto", estado: "Vigente", editable: false,
    nota: "Secciones fijas hasta el editor de plantillas de salida (BO-27, fase B). DEC-043." },

  reglas: [
    "Son dos documentos independientes, cada uno con su vista previa, su botón \"Imprimir o guardar PDF\", su nombre de archivo, su numeración y su pie de página. \"Enviar a emisión\" adjunta los dos.",
    "El Resumen para el APS no muestra puntajes, bandas, niveles, módulos, criterios ni nombres de reglas: solo el resultado por ramo (veredicto), las garantías, las recomendaciones y los documentos.",
    "El Informe técnico es de uso interno de la compañía. Lleva datos, textos, fotos y la calificación por capítulo; termina con la calificación del riesgo y el anexo de decisiones del calificador.",
    "Un capítulo aparece solo si su módulo está activo en el informe y tiene al menos un valor, texto o foto. Los capítulos se numeran en orden, sin huecos (DEC-062).",
    "Numeración secuencial obligatoria por documento: \"Tabla N · título\" y \"Foto N · leyenda\" (anexo 11.5).",
    "Los datos estructurados de cada sección salen siempre. Un campo sin valor muestra \"—\"; uno No aplica muestra \"No aplica\"; uno No consultado muestra \"No consultado\" y su motivo, solo en el Informe técnico. El Resumen omite las filas vacías.",
    "Texto desactualizado (DEC-060): no sale en el Resumen. En el Informe técnico, en su lugar va \"Texto pendiente de actualizar: [cambio]\" y los datos de la sección se muestran igual. Texto omitido al redactar: \"Sin texto redactado\".",
    "Resaltado por palabra (anexo 11.5): el valor favorable en verde, el desfavorable en rojo y \"No aplica\" en gris, según la polaridad de cada campo de la lista de verificación (polaridad). Los niveles del modelo usan los colores del mapa de calor.",
    "Fotos: cada capítulo cierra con su registro fotográfico (2 por fila, leyenda \"etiqueta · instancia\"), con las fotos Asignadas o Confirmadas de sus etiquetas. Las Excluidas y los documentos no salen. La portada usa la primera foto de Fachada de la Edificación 1 (también sale en su capítulo).",
    "Calificación por capítulo (DEC-058): solo en el Informe técnico. Se muestran los criterios del capítulo (puntaje \"x de y\" y nivel) y el porcentaje del capítulo = puntos ÷ máximo de sus criterios con dato; el nivel del capítulo se toma del porcentaje con los mismos rangos del mapa de calor. Un criterio vale lo mismo en todos los ramos donde aparece; se muestra una vez con sus ramos.",
    "Garantías y recomendaciones (DEC-059): se usan los términos de SIRIUS. Cada una muestra código y título, ramo, ubicación, hallazgo, norma técnica, qué debe hacer (texto del catálogo), prioridad, plazo y evidencia a remitir. Solo las aceptadas; las \"Ya cumple\", sustituidas o descartadas salen únicamente en el anexo del Informe técnico.",
    "Hallazgo: se arma con la plantilla de hallazgo del código y los valores del informe (variables vinculadas, anexo 11.5). No lo redacta la IA. Si falta un valor, la variable muestra \"—\".",
    "Orden de cada capítulo del Informe técnico (v1.2): datos (tablas y grillas) · Observaciones (texto del capítulo) · Calificación del capítulo y Sustento (si tiene criterios) · Documentos de respaldo · Registro fotográfico. Un bloque sin contenido no se muestra.",
    "Sustento de la calificación (DEC-068): debajo de \"Calificación del capítulo\", una tabla \"Sustento de la calificación\" con Criterio · Puntaje · Determinado por. \"Determinado por\" es el mismo detalle que el motor muestra en el mapa de calor (valores e instancias, regla de combinación), con cada clave reemplazada por su etiqueta. Solo en el Informe técnico.",
    "Documentos de respaldo (DEC-069): cada capítulo muestra los documentos del informe cuyos campos leídos o \"cumple en\" pertenecen a su módulo (documentosCapitulo), como \"Documento N · nombre · N páginas\" con el marcador \"Documento de ejemplo\". Numeración propia \"Documento N\", secuencial en el documento.",
    "Mapas y rutas (DEC-070): son fotos con canal Contexto externo; su leyenda agrega la fuente (\"Mapa de referencia · Sísmico · Zonificación sísmica NEC-15 · Simulada\"). Marcador \"Mapa de ejemplo\". En Naturaleza, el mapa va en la fila de su amenaza; en Bomberos y Seguridad física, al registro fotográfico.",
    "Nunca se muestran claves internas (rg_…, ev_…, @instancia): siempre la etiqueta del campo y la instancia. Texto pendiente de actualizar: \"Texto pendiente de actualizar: [etiqueta] pasó de [anterior] a [valor] después de aceptar el texto\", con unidades.",
    "Espejos y cálculos se resuelven siempre: el espejo muestra el valor de su clave de origen y el cálculo, su resultado (número de edificaciones = instancias; área de construcción = suma de áreas; edad = año del reloj − año de construcción; riesgo CIIU desde el catálogo). Cada valor numérico lleva la unidad declarada en la plantilla.",
    "Lista de verificación sin ningún valor: no se muestra. Títulos fijos: \"Lista de verificación\" y \"Calificación del capítulo\".",
    "Descarga (DEC-075): la vista previa se arma en páginas A4 (210 × 297 mm, márgenes de 15 mm) y lo que se ve es lo que se descarga. Botón principal \"Descargar PDF\" en cada documento: genera el archivo con el nombre de documentos[].archivo, con los mismos colores, tipografía, tablas, fotos y saltos de página que la vista previa, y el pie \"Página X de Y\" con números reales. Sin diálogo de impresión. Prototipo: generación en el navegador. Producción (Citytech): el servidor renderiza la misma plantilla HTML con Chromium sin interfaz y entrega un PDF vectorial con texto seleccionable.",
    "Leyenda de foto (DEC-074): \"Foto N · etiqueta · instancia · observación\". Sin observación: sin el último tramo.",
    "Porcentaje del capítulo: suma de puntos de sus criterios con dato ÷ suma de sus máximos, sin ponderar. Planes de gestión = (B.2 4 + C.4 0) ÷ (8 + 1) = 44,4 %. Un criterio No aplica se lista como \"C.9 (No aplica)\" y no entra en el cálculo.",
    "Números y fechas con formato de Ecuador: coma decimal, punto de miles, dd/mm/aaaa; moneda \"$405.000\".",
    "Firmas: nombre, rol y fecha de quien envió el informe y de quien guardó la calificación. Sin imagen de firma en el prototipo.",
  ],

  documentos: [
    {
      id: "resumen",
      nombre: "Resumen para el APS",
      destinatario: "Asegurado o bróker (APS)",
      archivo: "Resumen [caso] – [asegurado].pdf",
      pie: "Aseguradora del Sur · Caso [caso] · Resumen para el APS · Página X de Y",
      capitulos: [
        { id: "portada", titulo: null, bloques: ["portada"] },
        { id: "general", titulo: "Información general del riesgo", modulo: "m01",
          bloques: [
            { tipo: "tablaDatos", titulo: "Datos del asegurado", claves: ["rg_gen_asegurado", "rg_gen_ruc", "rg_gen_representante_legal", "rg_gen_entrevistado", "rg_gen_cargo_entrevistado", "rg_gen_telefono", "rg_gen_email"] },
            { tipo: "grilla", titulo: "Información laboral", clave: "rg_gen_personal" },
            { tipo: "tablaDatos", titulo: "Información económica", claves: ["rg_gen_giro", "rg_gen_ciiu", "rg_gen_anio_inicio", "rg_gen_objeto_social", "rg_gen_fecha_constitucion", "rg_gen_situacion_legal"] },
            { tipo: "texto", clave: "rg_gen_perfil" },
          ] },
        { id: "ubicacion", titulo: "Ubicación del riesgo", modulo: "m02",
          bloques: [{ tipo: "tablaDatos", titulo: "Ubicación geográfica", claves: ["rg_ubi_direccion", "rg_ubi_parroquia", "rg_ubi_canton", "rg_ubi_provincia", "coordenadasDMS", "coordenadasDecimales", "rg_ubi_altitud"] }] },
        { id: "resultado", titulo: "Resultado de la inspección",
          bloques: [{ tipo: "tablaRamos", titulo: "Resultado por ramo", columnas: ["Ramo", "Valor asegurado", "Resultado"], nota: "Resultado = veredicto guardado. Sin puntaje ni banda." }] },
        { id: "garantias", titulo: "Garantías", bloques: [{ tipo: "fichas", fuente: "garantiasAceptadas" }, { tipo: "linea", fuente: "plazoGlobal" }],
          siVacio: "No se exigen garantías." },
        { id: "recomendaciones", titulo: "Recomendaciones", bloques: [{ tipo: "fichas", fuente: "recomendacionesAceptadas" }], siVacio: "Sin recomendaciones." },
        { id: "documentos", titulo: "Documentos", bloques: [{ tipo: "tablaDocumentos", columnas: ["Documento", "Ramo", "Estado"], fuente: "documentosEsquema" }], siVacio: "No se solicitan documentos." },
        { id: "resumen", titulo: "Resumen ejecutivo", bloques: [{ tipo: "texto", clave: "rg_cnc_resumen" }] },
        { id: "firmas", titulo: null, bloques: ["firmas"] },
      ],
    },
    {
      id: "tecnico",
      nombre: "Informe técnico",
      destinatario: "Uso interno · Suscripción y reaseguro",
      archivo: "Informe técnico [caso] – [asegurado].pdf",
      pie: "Aseguradora del Sur · Caso [caso] · Informe técnico · Uso interno · Página X de Y",
      capitulos: [
        { id: "portada", titulo: null, bloques: ["portada"] },
        { id: "general", titulo: "Información general del riesgo", modulo: "m01", igualQue: "resumen.general", fotos: [] },
        { id: "ubicacion", titulo: "Ubicación del riesgo", modulo: "m02",
          bloques: [
            { tipo: "tablaDatos", titulo: "Ubicación geográfica", claves: ["rg_ubi_direccion", "rg_ubi_parroquia", "rg_ubi_canton", "rg_ubi_provincia", "rg_ubi_region", "coordenadasDMS", "coordenadasDecimales", "rg_ubi_altitud", "rg_ubi_dist_mar", "rg_ubi_dist_rio"] },
            { tipo: "tablaDatos", titulo: "Predio y edificaciones", claves: ["rg_ubi_area_predio", "rg_ubi_num_edificaciones", "rg_ubi_area_construccion"] },
            { tipo: "tablaInstancias", titulo: "Edificaciones", instancias: "edificaciones", columnas: ["N.°", "Nombre", "Área (m²)"], claves: ["rg_con_nombre", "rg_con_area"] },
          ],
          fotos: ["ev_vista_satelital"] },
        { id: "linderos", titulo: "Linderos", modulo: "m03", porInstancia: "linderos",
          bloques: [
            { tipo: "tablaDatos", titulo: "Lindero [instancia]", claves: ["rg_lin_tipo_riesgo", "rg_lin_altura_colindante", "alturaCliente", "rg_lin_tipo_estructura", "rg_lin_distancia", "rg_lin_dist_min_colapso", "rg_lin_dist_min_golpeteo"] },
            { tipo: "criterioInstancia", criterio: "B.4" },
            { tipo: "texto", clave: "rg_lin_descripcion" },
          ],
          observaciones: "rg_lin_observaciones", criterios: ["B.4"], fotos: ["ev_lindero"] },
        { id: "naturaleza", titulo: "Riesgos de la naturaleza", modulo: "m04",
          bloques: [
            { tipo: "tablaDatos", claves: ["rg_nat_zona_sismica"] },
            { tipo: "tablaInstancias", titulo: "Amenazas", instancias: "amenazas", columnas: ["Amenaza", "Exposición", "Descripción"], claves: ["rg_nat_exposicion", "rg_nat_descripcion"], resaltar: { Alta: "desfavorable", Media: "atencion", Baja: "favorable" } },
            { tipo: "tablaDatos", titulo: "Protección contra rayos", claves: ["rg_nat_pararrayos", "rg_nat_requiere_pararrayos", "rg_nat_justificacion_pararrayos"] },
          ],
          observaciones: "rg_nat_observaciones", criterios: [], nota: "El modelo no califica amenazas naturales: el capítulo muestra la exposición, sin puntaje. Mapas de amenaza: cuando exista la fuente geográfica (ev_mapa_amenaza).",
          fotos: ["ev_mapa_amenaza"] },
        { id: "constructiva", titulo: "Descripción constructiva", modulo: "m05", porInstancia: "edificaciones", observaciones: "rg_con_observaciones (por edificación, ya existente)",
          bloques: [
            { tipo: "tablaDatos", titulo: "Edificación [instancia] · [rg_con_nombre]", claves: ["rg_con_area", "rg_con_pisos", "rg_con_altura_m", "rg_con_subsuelos", "rg_con_anio_construccion", "rg_con_edad", "rg_con_conservacion", "rg_con_dist_edificio_cercano", "rg_con_medios_egreso"] },
            { tipo: "tablaDatos", titulo: "Materiales y resistencia al fuego", claves: ["rg_con_estructura", "rg_con_paredes", "rg_con_techo", "rg_con_entrepisos", "rg_con_resistencia_fuego"] },
            { tipo: "texto", clave: "rg_con_descripcion" }, { tipo: "texto", clave: "rg_con_observaciones" }, { tipo: "texto", clave: "rg_con_preexistencias" },
            { tipo: "matrizEdificaciones", titulo: "Construcción por edificación", criterios: ["A.1", "A.2", "A.3", "A.4", "A.5"], soloUnaVez: true },
          ],
          criterios: ["A.1", "A.2", "A.3", "A.4", "A.5"], fotos: ["ev_fachada", "ev_cubierta_interior", "ev_estructura", "ev_medios_egreso"] },
        { id: "ocupacion", titulo: "Ocupación", modulo: "m16",
          bloques: [{ tipo: "tablaDatos", claves: ["rg_ocu_ciiu", "rg_ocu_riesgo_ciiu", "rg_ocu_clase_mrl", "rg_ocu_carga_combustible", "rg_ocu_riesgo_nfpa"] }],
          observaciones: "rg_ocu_observaciones", criterios: ["B.3"], fotos: ["ev_actividad"] },
        { id: "procesos", titulo: "Procesos", modulo: "m17", bloques: [{ tipo: "grilla", clave: "rg_pro_procesos" }, { tipo: "texto", clave: "rg_pro_descripcion" }], criterios: [], fotos: [] },
        { id: "almacenamiento", titulo: "Almacenamiento", modulo: "m18", porInstancia: "bodegas",
          bloques: [{ tipo: "tablaDatos", titulo: "[instancia] · [rg_alm_nombre]", claves: ["rg_alm_area", "rg_alm_altura_apilamiento", "rg_alm_tipo", "rg_alm_clase_mercancia", "rg_alm_separacion_techo", "rg_alm_pasillos_libres", "rg_alm_valor"] }],
          observaciones: "rg_alm_observaciones", criterios: [], fotos: ["ev_bodega", "ev_apilamiento"] },
        { id: "combustibles", titulo: "Combustibles e inflamables", modulo: "m19",
          bloques: [{ tipo: "grilla", clave: "rg_cmb_sustancias" }, { tipo: "listaVerificacion", claves: ["rg_cmb_agr_01", "rg_cmb_agr_02", "rg_cmb_agr_03", "rg_cmb_agr_04", "rg_cmb_agr_05", "rg_cmb_agr_06", "rg_cmb_agr_07", "rg_cmb_agr_08", "rg_cmb_agr_09"] }, { tipo: "tablaDatos", claves: ["rg_cmb_porcentaje_agravantes", "rg_cmb_glp", "rg_cmb_glp_ubicacion", "rg_cmb_glp_kg"] }],
          observaciones: "rg_cmb_observaciones", criterios: [], fotos: [] },
        { id: "maquinaria", titulo: "Maquinaria", modulo: "m20", bloques: [{ tipo: "grilla", clave: "rg_maq_equipos" }, { tipo: "tablaDatos", claves: ["rg_maq_mantenimiento", "rg_maq_ultimo_mantenimiento", "rg_maq_operadores_capacitados", "rg_maq_protecciones"] }], criterios: [], fotos: [] },
        { id: "electronico", titulo: "Equipo electrónico", modulo: "m15",
          bloques: [{ tipo: "grilla", clave: "rg_ee_equipos" }, { tipo: "tablaDatos", titulo: "Cuarto técnico y protección", claves: ["rg_ee_cuarto_existe", "rg_ee_tierra", "rg_ee_circuitos_dedicados", "rg_ee_ups", "rg_ee_ups_autonomia", "rg_ee_supresor", "rg_ee_generador", "rg_ee_detector_cuarto", "rg_ee_extintor_tipo", "rg_ee_supresion", "rg_ee_plan_mantenimiento", "rg_ee_respaldo_datos", "rg_ee_plan_continuidad"] }],
          observaciones: "rg_ee_observaciones", criterios: ["C.7", "C.8", "C.9", "C.10", "C.11"], fotos: ["ev_equipos", "ev_cuarto_tecnico", "ev_rack_servidores", "ev_climatizacion", "ev_ups", "ev_extintor_cuarto"] },
        { id: "electrico", titulo: "Sistema eléctrico", modulo: "m06",
          bloques: [{ tipo: "listaVerificacion", claves: ["rg_ele_chk_01", "rg_ele_chk_02", "rg_ele_chk_03", "rg_ele_chk_04", "rg_ele_chk_05", "rg_ele_chk_06", "rg_ele_chk_07", "rg_ele_chk_08", "rg_ele_chk_09", "rg_ele_chk_10", "rg_ele_chk_11", "rg_ele_chk_12", "rg_ele_chk_13", "rg_ele_chk_14", "rg_ele_chk_15", "rg_ele_chk_16", "rg_ele_chk_17"] }, { tipo: "tablaDatos", claves: ["rg_ele_mantenimiento", "rg_ele_ultima_termografia"] }],
          observaciones: "rg_ele_observaciones", criterios: ["B.1"], fotos: ["ev_tablero_principal", "ev_tablero_secundario", "ev_puesta_tierra", "ev_senal_procedimientos", "ev_seguridad_ocupacional"] },
        { id: "seguridad", titulo: "Seguridad física", modulo: "m13",
          bloques: [
            { tipo: "tablaDatos", titulo: "Cerramiento y accesos", claves: ["rg_rob_cerramiento", "rg_rob_cerramiento_altura", "rg_rob_proteccion_adicional", "rg_rob_puertas", "rg_rob_ventanas"] },
            { tipo: "tablaDatos", titulo: "Guardianía", claves: ["rg_rob_vig_existe", "rg_rob_vig_tipo", "rg_rob_vig_armada", "rg_rob_vig_rondas", "rg_rob_vig_turnos", "rg_rob_vig_dias", "rg_rob_vig_horario_inicio", "rg_rob_vig_horario_fin", "rg_rob_vig_empresa"] },
            { tipo: "tablaDatos", titulo: "CCTV", claves: ["rg_rob_cctv_existe", "rg_rob_cctv_tipo", "rg_rob_cctv_conexion", "rg_rob_cctv_cobertura", "rg_rob_cctv_monitoreo_situ", "rg_rob_cctv_monitoreo_remoto", "rg_rob_cctv_grabacion", "rg_rob_cctv_resguardo_dias"] },
            { tipo: "tablaDatos", titulo: "Alarma", claves: ["rg_rob_alarma_existe", "rg_rob_alarma_activacion", "rg_rob_alarma_monitoreo", "rg_rob_boton_panico"] },
            { tipo: "tablaDatos", titulo: "UPC", claves: ["rg_rob_upc_nombre", "rg_rob_upc_distancia", "rg_rob_upc_tiempo"] },
          ],
          observaciones: "rg_rob_observaciones", criterios: ["C.5", "C.6"], fotos: ["ev_cerramiento", "ev_puertas_acceso", "ev_ventanas", "ev_garita_guardia", "ev_camaras", "ev_central_alarma", "ev_ruta_upc"] },
        { id: "dinero", titulo: "Dinero y valores", modulo: "m14", bloques: [{ tipo: "tablaDatos", claves: ["rg_dyv_monto_max", "rg_dyv_resguardo", "rg_dyv_vidrios_blindados_caja", "rg_dyv_boton_panico_caja", "rg_dyv_frecuencia_recoleccion", "rg_dyv_transporte"] }], criterios: [], fotos: ["ev_caja_fuerte", "ev_area_caja"] },
        { id: "pci", titulo: "Protección contra incendios", modulo: "m07",
          bloques: [
            { tipo: "grilla", titulo: "Extintores", clave: "rg_pci_extintores" },
            { tipo: "tablaDatos", titulo: "Cálculo de extintores (NFPA 10)", claves: ["rg_ubi_area_construccion", "rg_ocu_riesgo_nfpa", "coberturaExtintor", "rg_pci_ext_requeridos", "extintoresInstalados", "rg_pci_ext_senalizados", "rg_pci_ext_mantenimiento"] },
            { tipo: "tablaDatos", titulo: "Detección y alarma (NFPA 72)", claves: ["rg_pci_det_existe", "rg_pci_det_tipo", "rg_pci_det_instalados", "rg_pci_det_requeridos", "rg_pci_det_central", "rg_pci_det_senales"] },
            { tipo: "tablaDatos", titulo: "Red hídrica", claves: ["rg_pci_red_existe", "rg_pci_red_tipo", "rg_pci_reserva_m3", "rg_pci_reserva_exclusiva"] },
          ],
          observaciones: "rg_pci_observaciones", criterios: ["C.1", "C.2", "C.3"], fotos: ["ev_extintor", "ev_detectores_central", "ev_gabinetes_rociadores", "ev_tanque_reserva"] },
        { id: "bombas", titulo: "Sistema de bombas", modulo: "m21", bloques: [{ tipo: "tablaDatos", claves: ["rg_bmb_tipo", "rg_bmb_listada", "rg_bmb_caudal", "rg_bmb_presion", "rg_bmb_arranque_automatico", "rg_bmb_pruebas", "rg_bmb_energia_alterna"] }], criterios: [], fotos: [] },
        { id: "gestion", titulo: "Planes de gestión", modulo: "m08",
          bloques: [{ tipo: "tablaDatos", titulo: "Plan de emergencia y brigadas", claves: ["rg_ges_plan_emergencia", "rg_ges_plan_evaluacion", "rg_ges_brigadas", "rg_ges_simulacros"] }, { tipo: "tablaDatos", titulo: "Orden, mantenimiento y certificaciones", claves: ["rg_ges_orden_aseo", "rg_ges_cert_gestion", "rg_ges_cert_gestion_cual", "rg_ges_mant_equipos", "rg_ges_trabajos_caliente", "rg_ges_trabajos_altura", "rg_ges_cert_ambiental", "rg_ges_cert_social"] }],
          observaciones: "rg_ges_observaciones", criterios: ["B.2", "C.4"], fotos: ["ev_orden_aseo", "ev_senal_evacuacion", "ev_punto_encuentro"] },
        { id: "bomberos", titulo: "Cuerpo de bomberos", modulo: "m09", bloques: [{ tipo: "tablaDatos", claves: ["rg_bom_permiso", "rg_bom_vigencia", "rg_bom_estacion", "rg_bom_distancia", "rg_bom_tiempo"] }], observaciones: "rg_bom_observaciones", criterios: [], fotos: ["ev_ruta_bomberos"] },
        { id: "siniestralidad", titulo: "Siniestralidad", modulo: "m10", bloques: [{ tipo: "grilla", clave: "rg_sin_siniestros", siVacio: "Sin siniestros registrados en la fuente" }, { tipo: "tablaDatos", claves: ["rg_sin_declarado", "rg_sin_cantidad_5_anios"] }], observaciones: "rg_sin_observaciones", criterios: [], fotos: [] },
        { id: "pmp", titulo: "Estimación de pérdidas", modulo: "m11", porInstancia: "escenarios",
          bloques: [{ tipo: "parrafo", texto: "La pérdida máxima probable (PMP) es el monto de la pérdida que puede anticiparse por un incendio o explosión severos, con todos los sistemas de protección fuera de servicio y sin esfuerzos por extinguir el fuego." }, { tipo: "texto", clave: "rg_pmp_escenario" }, { tipo: "tablaDatos", claves: ["rg_pmp_afectacion", "rg_pmp_interrupcion", "rg_pmp_paralizacion"] }],
          criterios: [], fotos: [] },
        { id: "conclusiones", titulo: "Conclusiones", modulo: "m12", bloques: [{ tipo: "texto", clave: "rg_cnc_agravantes" }, { tipo: "texto", clave: "rg_cnc_atenuantes" }, { tipo: "texto", clave: "rg_cnc_resumen" }, { tipo: "texto", clave: "rg_cnc_recomendacion_inspector" }], criterios: [], fotos: [] },
        { id: "calificacion", titulo: "Calificación del riesgo",
          bloques: [
            { tipo: "tablaRamos", titulo: "Puntaje por ramo", columnas: ["Ramo", "Valor asegurado", "Puntaje", "Banda", "Resultado de la banda", "Veredicto"] },
            { tipo: "tablaModulos", titulo: "Módulos · porcentaje de su máximo" },
            { tipo: "tablaCapitulos", titulo: "Calificación por capítulo", columnas: ["Capítulo", "Criterios", "Porcentaje", "Nivel"] },
            { tipo: "mapaCalor", titulo: "Mapa de calor por criterio" },
            { tipo: "escala", titulo: "Escala del modelo", nota: "Bandas del modelo de calificación vigente con su resultado; se resalta la banda de cada ramo." },
          ] },
        { id: "anexoCalificador", titulo: "Anexo · Decisiones del calificador", anexo: true,
          bloques: [{ tipo: "tablaDecisiones", columnas: ["Qué", "Decisión", "Motivo", "Persona y fecha"] }, { tipo: "lista", titulo: "Garantías no exigidas", fuente: "garantiasNoExigidas", nota: "Ya cumple, sustituidas y descartadas, con su motivo" }, { tipo: "linea", fuente: "textosDesactualizados" }] },
        { id: "firmas", titulo: null, bloques: ["firmas"] },
      ],
    },
  ],

  // Composición y paginación (v1.4 · DEC-076). Valen para los dos documentos y para cualquier caso, no solo 20195.
  composicion: {
    principio: "Flujo continuo: el contenido llena cada página A4 antes de pasar a la siguiente. La vista previa y el PDF usan la misma paginación: el PDF se genera página por página desde las páginas A4 de la vista previa, nunca bloque por bloque.",
    saltosForzados: ["Después de la portada", "Antes de \"Calificación del riesgo\" (Informe técnico)", "Antes del anexo"],
    capitulos: "Un capítulo NO empieza en página nueva. Su título va pegado a su primer bloque: si en la página quedan menos de 40 mm, título y primer bloque pasan juntos a la siguiente.",
    tablas: [
      "Una tabla de más de 6 filas se parte por filas entre páginas y repite el encabezado. Una de 6 filas o menos no se parte.",
      "El título \"Tabla N · …\" nunca queda solo al final de una página: va con al menos 2 filas de su tabla.",
      "Tabla de datos (Campo · Valor): las filas sin dato no se listan una por una; se agrupan en una línea al pie de la tabla: \"Sin dato: Campo A · Campo B\". Si ninguna fila tiene dato, la tabla no se muestra.",
      "Tabla de datos con valores cortos (40 caracteres o menos): dos pares por fila (Campo · Valor · Campo · Valor). Valores largos: un par por fila.",
      "Calificación del capítulo y Sustento van en una sola tabla: Criterio · Puntaje · Nivel · Determinado por, con una fila final \"Capítulo · porcentaje · nivel\".",
    ],
    fotos: [
      "Registro fotográfico en cuadrícula de 3 por fila (ancho igual, proporción 4:3, leyenda debajo de 2 líneas como máximo). Se parte entre páginas por filas completas.",
      "Mapas de amenaza: miniatura de 35 mm dentro de la fila de su amenaza, no en el registro fotográfico.",
      "Foto de portada: alto máximo de 90 mm.",
      "Documentos de respaldo: una línea por documento (\"Documento N · nombre · N páginas\"), sin miniatura.",
    ],
    textos: "Los textos (observaciones, descripciones) se parten entre páginas por líneas, con un mínimo de 3 líneas a cada lado (viudas y huérfanas).",
    vacios: "Un bloque, una sección o un capítulo sin contenido no se muestra ni deja espacio (DEC-062). Nunca hay una página en blanco ni con solo un título.",
    controlCalidad: [
      "Ninguna página, salvo la última de un capítulo con salto forzado y la última del documento, tiene más del 30 % de su alto libre.",
      "Ninguna página termina con un título (de capítulo, de tabla o de bloque) sin contenido debajo.",
      "El número de páginas del PDF es igual al de la vista previa.",
      "20195 · Informe técnico: entre 18 y 30 páginas. Resumen para el APS: 4 páginas (ya correcto).",
    ],
  },

  // Portada (los dos documentos). Las fechas salen del historial del caso; si un hito no existe, "—".
  portada: {
    titulo: { resumen: "Resumen de inspección", tecnico: "Informe técnico de inspección" },
    filas: [
      { etiqueta: "Aseguradora", fuente: "Aseguradora del Sur" },
      { etiqueta: "Caso", fuente: "número de caso · orden de emisión" },
      { etiqueta: "Cliente", fuente: "rg_gen_asegurado" },
      { etiqueta: "Ramos", fuente: "ramos del caso, separados por ·" },
      { etiqueta: "N.° de informe", fuente: "INF-[caso]-[n.° de envío]", nota: "DEC-065: el n.° de envío empieza en 1 y sube si el informe se reabre y se envía de nuevo" },
      { etiqueta: "Fecha de registro", fuente: "historial · Registrado" },
      { etiqueta: "Fecha de coordinación", fuente: "historial · Agendado" },
      { etiqueta: "Fecha de inspección", fuente: "visita · fecha" },
      { etiqueta: "Fecha de envío del informe", fuente: "envio · fecha" },
      { etiqueta: "Inspector", fuente: "visita · inspector · agencia" },
      { etiqueta: "Modalidad", fuente: "visita · modalidad" },
    ],
    foto: "Primera foto ev_fachada de la Edificación 1",
  },

  firmas: [
    { rol: "Inspector", fuente: "envio · enviadoPor y fecha" },
    { rol: "Calificador", fuente: "calificación guardada · persona y fecha" },
  ],

  // Valores derivados que la salida muestra y que no son campos de la plantilla
  derivados: {
    coordenadasDMS: "rg_ubi_latitud y rg_ubi_longitud en grados, minutos y segundos (un decimal), con S/N y O/E",
    coordenadasDecimales: "rg_ubi_latitud, rg_ubi_longitud con 6 decimales",
    alturaCliente: "rg_con_altura_m de la edificación más alta; vacío: \"—\"",
    coberturaExtintor: "Cobertura NFPA 10 por extintor según rg_ocu_riesgo_nfpa (DEC-040: Ligero 278,7 · Ordinario 139,4 · Extra 92,9 m²)",
    extintoresInstalados: "Suma de la columna Cantidad de rg_pci_extintores",
    rg_pci_det_requeridos: "Área construida ÷ 84 m², redondeado hacia arriba (DEC-063, igual que DEC-040)",
    rg_lin_dist_min_colapso: "Fórmula por definir en la plantilla: se muestra \"Por definir\" (insumo de Ingeniería)",
    rg_lin_dist_min_golpeteo: "Fórmula por definir en la plantilla: se muestra \"Por definir\" (insumo de Ingeniería)",
  },

  // Documentos de respaldo por capítulo (v1.2 · DEC-069), según los campos leídos o "cumple en" de cada documento de 20195
  documentosCapitulo: {
    regla: "Un documento va al capítulo del módulo de sus campos leídos; si no leyó campos, al de su \"cumple en\". Puede ir a más de un capítulo.",
    caso20195: { D1: "bomberos", D2: "pci", D3: "electronico", D4: "electronico" },
  },

  // Etiquetas de los valores derivados (v1.1)
  etiquetasDerivados: {
    coordenadasDMS: "Coordenadas (grados, minutos y segundos)",
    coordenadasDecimales: "Coordenadas (decimales)",
    alturaCliente: "Altura de la edificación del cliente",
    coberturaExtintor: "Cobertura por extintor (NFPA 10)",
    extintoresInstalados: "Extintores instalados",
  },

  // Polaridad de las listas de verificación: valor favorable. El resto de valores es desfavorable; No aplica, neutro.
  polaridad: {
    favorableSi: ["rg_ele_chk_01", "rg_ele_chk_04", "rg_ele_chk_05", "rg_ele_chk_06", "rg_ele_chk_07", "rg_ele_chk_08", "rg_ele_chk_09", "rg_ele_chk_10", "rg_ele_chk_11", "rg_ele_chk_12", "rg_ele_chk_13", "rg_ele_chk_14", "rg_ele_chk_15", "rg_ele_chk_16", "rg_ele_chk_17"],
    favorableNo: ["rg_ele_chk_02", "rg_ele_chk_03", "rg_cmb_agr_01", "rg_cmb_agr_02", "rg_cmb_agr_03", "rg_cmb_agr_04", "rg_cmb_agr_05", "rg_cmb_agr_06", "rg_cmb_agr_07", "rg_cmb_agr_08", "rg_cmb_agr_09"],
  },

  // detalle: movido al catálogo de seguimientos (datos-catalogos-maestros.js, etapa 10a · DEC-077). La salida lee de ahí norma, prioridad,
  //   evidencia, hallazgo y ubicación por código.


  // Resultado esperado para 20195 (estado base Enviado), calculado en asesoría. Si no coincide, informar la diferencia.
  esperado: {
    "caso": "20195",
    "resumen": {
      "capitulos": [
        "1. Información general del riesgo",
        "2. Ubicación del riesgo",
        "3. Resultado de la inspección",
        "4. Garantías",
        "5. Recomendaciones",
        "6. Documentos",
        "7. Resumen ejecutivo"
      ],
      "garantias": [
        "GAR-INC-03 · 90 días",
        "GAR-INC-07 · 90 días",
        "GAR-ROB-01 · 30 días"
      ],
      "recomendaciones": [
        "REC-02 · 180 días",
        "REC-05 · 180 días"
      ],
      "documentos": [
        "DOC-01 · Recibido",
        "DOC-02 · Recibido"
      ],
      "plazoGlobal": "90 días",
      "filasOmitidas": [
        "Representante legal",
        "Correo electrónico",
        "Objeto social",
        "Fecha de constitución",
        "Situación legal"
      ],
      "fotos": "Solo la de portada (F01)"
    },
    "tecnico": {
      "capitulos": [
        "1. Información general del riesgo",
        "2. Ubicación del riesgo",
        "3. Linderos",
        "4. Riesgos de la naturaleza",
        "5. Descripción constructiva",
        "6. Ocupación",
        "7. Almacenamiento",
        "8. Combustibles e inflamables",
        "9. Equipo electrónico",
        "10. Sistema eléctrico",
        "11. Seguridad física",
        "12. Protección contra incendios",
        "13. Planes de gestión",
        "14. Cuerpo de bomberos",
        "15. Siniestralidad",
        "16. Estimación de pérdidas",
        "17. Conclusiones",
        "18. Calificación del riesgo",
        "Anexo · Decisiones del calificador"
      ],
      "omitidos": {
        "Procesos": "Módulo activo sin datos",
        "Maquinaria": "Módulo inactivo",
        "Dinero y valores": "Módulo inactivo",
        "Sistema de bombas": "Módulo inactivo"
      },
      "fotos": {
        "Ubicación del riesgo": "1 (Foto 1 a 1)",
        "Linderos": "4 (Foto 2 a 5)",
        "Riesgos de la naturaleza": "5 (Foto 6 a 10)",
        "Descripción constructiva": "7 (Foto 11 a 17)",
        "Ocupación": "2 (Foto 18 a 19)",
        "Almacenamiento": "3 (Foto 20 a 22)",
        "Equipo electrónico": "3 (Foto 23 a 25)",
        "Sistema eléctrico": "4 (Foto 26 a 29)",
        "Seguridad física": "6 (Foto 30 a 35)",
        "Protección contra incendios": "3 (Foto 36 a 38)",
        "Planes de gestión": "3 (Foto 39 a 41)",
        "Cuerpo de bomberos": "1 (Foto 42 a 42)"
      },
      "totalFotos": 42,
      "porcentajeCapitulo": {
        "Linderos": "42,9 %",
        "Descripción constructiva": "72,6 %",
        "Ocupación": "60,0 %",
        "Equipo electrónico": "50,0 %",
        "Sistema eléctrico": "30,0 %",
        "Seguridad física": "80,0 %",
        "Protección contra incendios": "42,1 %",
        "Planes de gestión": "44,4 %"
      },
      "linderos": {
        "Norte": "Vía pública · 15 m · Texto pendiente de actualizar: Distancia al colindante pasó de 12 m a 15 m después de aceptar el texto",
        "Sur": "Vivienda o riesgo ligero · 3 m",
        "Este": "Comercio · 0 m",
        "Oeste": "Vivienda o riesgo ligero · 3 m · Sin texto redactado",
        "distanciasMinimas": "Por definir (las 8)"
      },
      "pci": {
        "coberturaExtintor": "139,4 m² (Ordinario)",
        "extintoresRequeridos": 6,
        "extintoresInstalados": 7,
        "detectoresRequeridos": 10,
        "detectoresInstalados": 6
      },
      "coordenadasDMS": "1°03'16,6\" S · 80°27'16,2\" O",
      "nota": "Porcentaje del capítulo = puntos ÷ máximo de sus criterios con dato (C.9 no aplica). Debe coincidir con los módulos: Construcción = A 72,6 %; Seguridad física = C2 80,0 %; Equipo electrónico = C3 50,0 %.",
      "observaciones": "12 capítulos con su texto de f3 (Linderos, Naturaleza, Ocupación, Almacenamiento, Combustibles, Equipo electrónico, Eléctrico, Seguridad física, Protección contra incendios, Gestión, Bomberos, Siniestralidad) más Construcción con rg_con_observaciones por edificación. Sin observaciones propias: Información general (usa el perfil), Ubicación, Pérdida máxima probable y Conclusiones.",
      "documentos": {
        "Equipo electrónico": "Documento 1 · Listado detallado y valorado de bienes · 1 página; Documento 2 · Bitácoras y cronograma de mantenimientos · 3 páginas",
        "Protección contra incendios": "Documento 3 · Certificado de mantenimiento y recarga de extintores · 2 páginas",
        "Cuerpo de bomberos": "Documento 4 · Permiso de bomberos · 1 página"
      },
      "calculos": {
        "Número de edificaciones": "2",
        "Área de construcción": "800 m²",
        "Edad · Edificación 1": "18 años",
        "Edad · Edificación 2": "11 años",
        "Ocupación (CIIU)": "G4759 (espejo de Información general)",
        "Riesgo según CIIU": "Medio",
        "Distancia al mar": "24.300 m",
        "Distancia al río": "1.400 m"
      },
      "sustento": {
        "A.1": "5,15 de 8 · Hormigón o bloque · Mixta (2 instancias · ponderado por área)",
        "A.2": "6,05 de 7 · Losa de hormigón · Metálico o teja (2 instancias · ponderado por área)",
        "A.3": "3,58 de 8 · Bueno · Regular (2 instancias · ponderado por área)",
        "A.4": "4 de 4 · 1–3 pisos · sin subsuelos (2 instancias · peor caso)",
        "A.5": "3 de 3 · Existen y libres (2 instancias · peor caso)",
        "B.1": "3 de 10 · Correctivo",
        "B.2": "4 de 8 · Regular o parcial",
        "B.3": "6 de 10 · Medio",
        "B.4": "3 de 7 · Vía pública · Vivienda o riesgo ligero · Comercio (4 instancias · peor caso entre los 4 linderos)",
        "C.1": "3 de 6 · Existe: Sí · central: Local o manual",
        "C.2": "5 de 5 · 7 instalados de 6 requeridos · mantenimiento Vigente con etiqueta",
        "C.3": "0 de 8 · Oculto por condición",
        "C.4": "0 de 1 · No",
        "C.5": "5 de 5 · Muro de hormigón o bloque · Concertina",
        "C.6": "7 de 10 · Guardia: No · alarma: Sí · CCTV: Sí",
        "C.7": "2 de 4 · Visible sin medición",
        "C.8": "2 de 3 · UPS: Sí · supresor: No",
        "C.9": "No aplica · ¿Tiene cuarto técnico? = No",
        "C.10": "1 de 3 · Solo PQS",
        "C.11": "1 de 2 · Interno con registro",
        "nota": "Es el detalle del mapa de calor actual con las claves reemplazadas por su etiqueta (\"ponderado por área\" en lugar de \"(rg_con_area)\")."
      },
      "combustibles": "Solo la fila ¿Usa GLP? = No y su texto; la lista de agravantes no se muestra (sin valores)"
    },
    "hallazgos": {
      "GAR-INC-03": "Detección: Humo; 6 detectores instalados de 10 requeridos; central: Local o manual; señales acústicas y ópticas en todas las zonas: No.",
      "GAR-INC-07": "Plan de emergencia: Existe pero no se entregó; brigadas: No; simulacros: Nunca.",
      "GAR-ROB-01": "Vigilancia humana: No.",
      "GAR-INC-01": "Permiso de bomberos: Vigente del año en curso; vigencia: 31/12/2026.",
      "GAR-INC-02": "7 extintores instalados de 6 requeridos; mantenimiento: Vigente con etiqueta.",
      "DOC-01": "Plan de mantenimiento: Interno con registro.",
      "DOC-02": "Equipos registrados en el inventario: 5.",
      "REC-02": "Planos eléctricos actualizados: No; mantenimiento eléctrico: Correctivo.",
      "REC-05": "Zona sísmica: Zona VI · Z = 0,50; exposición sísmica: Alta; altura de apilamiento: 3,5 m."
    },
    "version": "1.2 (estado Enviado con envio y f3)"
  },
};
