// SIRIUS · Pruebas e indicadores de los motores de IA (BO-24 · pestañas Prueba e Indicadores) · v1.5 · Datos de demostración
// v1.5 (29/10/26, envío 7A): conjuntos de prueba de IA-02-VL, IA-03-VL e IA-04-VL con casos solo del conjunto (vlp1, vlp2), validación de
//   formato por campo y resultado esperado calculado en asesoría. Requiere datos-motores-ia.js v1.13. Sin cambios en los motores de Ramos Generales.
// Preparado en asesoría el 23/10/26 para el envío 4C-2. Requiere datos-motores-ia.js v1.6 (v1.4: v1.12).
// v1.4 (23/10/26, envío 5D): prueba de IA-05 sin puntajes ni bandas (DEC-021): cifras contra campos del informe y control de textos con puntaje o banda.
// Solo datos: la interfaz los lee de aquí. No redactar ni completar valores desde el diseño.
// v1.1 (23/10/26): el conjunto de prueba tiene sus propios valores correctos cuando el caso no tiene valor (valorCorrecto en el ítem);
//   nunca se escriben en los casos, para no mover su puntaje ni sus garantías. Se agrega el bloque indicadores (4C-3).
// v1.2 (23/10/26): valores correctos con las opciones exactas de cada campo (informadas por Claude Design en el 4C-2b).
//   En distancias y tiempos de IA-04 se declara el número: la opción se elige por rango (reglasSalida de IA-04) y el número se muestra como respaldo.
// v1.3 (23/10/26): IA-04 con conexiones CNX-03 y CNX-04 (costo de demostración y aviso de prueba); reglas del gráfico de ejecuciones
//   por día (30 días con fines de semana visibles, etiquetas los lunes, tooltip, resumen y "Ver como tabla"); respaldo numérico en IA-04.
// Valor correcto de cada ítem: 1) valorCorrecto declarado en el ítem; 2) si no hay, el valor del informe del caso (datos-ejemplo.js o donde esté hoy).
// Si ninguno existe, el ítem muestra "Sin valor correcto", sale del cálculo y se informa en Diferencias.
// Si un valorCorrecto no coincide exactamente con una opción del campo, se usa la opción equivalente (o, en rangos, la que contiene el valor) y se informa en Diferencias.

window.SIRIUS_PRUEBAS_IA = {
  version: "1",
  avisoResultado: "Resultado de demostración · Solo en el prototipo",
  ultimaEjecucion: { fecha: "18/10/2026", hora: "09:30", persona: "Andrea Salazar" },

  reglas: [
    "La pestaña tiene dos partes: \"Probar con…\" (una entrada) y \"Conjunto de prueba\" (entradas con valores correctos conocidos).",
    "Con la conexión sin configurar (o, en IA-04, con fuentes sin integrar), todo resultado es de demostración y no cumple el requisito R5: se muestra \"La prueba de demostración no cuenta para publicar\".",
    "Precisión = resultados que coinciden con el valor correcto ÷ resultados propuestos. Cobertura = resultados propuestos ÷ resultados esperados. Por confirmar = propuestos con confianza entre el umbral de por confirmar y el de asignar. Se calculan sobre los ítems; nunca se escriben fijos.",
    "Cada resultado muestra su confianza y el estado según los umbrales del motor (y los umbrales por campo si existen): Asignado, Por confirmar o Sin propuesta.",
    "\"Difiere\" en un campo con opciones: el valor propuesto es la opción siguiente a la correcta en la lista del campo (la anterior, si la correcta es la última). En campos de fecha: un año antes.",
    "Comparación con la versión vigente: en la v1, \"Primera versión: sin versión vigente para comparar\".",
    "\"Probar con…\" ofrece elegir una entrada del conjunto (muestra su resultado) o subir una propia (muestra \"Sin resultado de demostración para esta entrada · Solo en el prototipo\").",
    "Los valores correctos declarados en el conjunto son del conjunto de prueba: se muestran con la nota \"Valor del conjunto de prueba\" y nunca se escriben en el informe del caso.",
    "Fotos y documentos son marcadores de posición con su etiqueta y el caso (\"Imagen de ejemplo\", \"Documento de ejemplo\"); nunca imágenes remotas.",
    "Casos solo del conjunto (soloConjunto): no existen como casos del prototipo, no aparecen en bandejas y no tienen enlace; todos sus valores correctos están declarados en el ítem.",
    "Variantes de Vehículos livianos: en un \"Difiere\" el valor propuesto se declara en valorPropuesto (no se usa la regla de la opción siguiente).",
    "Validación de formato (validacionesFormato de datos-motores-ia.js): se aplica al valor propuesto. Si falla, el resultado queda \"Por confirmar\" con el motivo, aunque la confianza supere el umbral de asignar; la columna \"Validación\" muestra Válida o el motivo.",
    "En la prueba, las salidas Contraste y Respaldo se miden como lecturas: su estado sigue los umbrales y la validación, igual que una salida Principal.",
  ],

  casos: [
    { id: "20200", nombre: "20200 Alianza Francesa de Cuenca", nota: "Educación · Incendio · Subestándar" },
    { id: "hotelManta", nombre: "Hotel en Manta", nota: "Preferente · escena gpolpruebahotel" },
    { id: "vlp1", nombre: "Vehículo de prueba 1 · Chevrolet Onix LT 2022 · PCD4821", nota: "Vehículos livianos · solo del conjunto de prueba · conductor: el asegurado", soloConjunto: true, alcance: "Vehículos livianos" },
    { id: "vlp2", nombre: "Vehículo de prueba 2 · Kia Sportage LX 2019 · GSA7305", nota: "Vehículos livianos · solo del conjunto de prueba · conductor: otra persona", soloConjunto: true, alcance: "Vehículos livianos" },
  ],

  motores: {
    // IA-01 · Clasificación de evidencias: 12 fotos (las 10 de IA-02, una borrosa y una duplicada)
    "IA-01": {
      entrada: "Set de fotos",
      metricas: ["Precisión (etiqueta e instancia correctas ÷ fotos clasificadas)", "% sin clasificar", "Marcas: borrosa, duplicada, fuera del predio"],
      items: [
        { foto: "F01", caso: "20200", etiquetaCorrecta: "Fachada", resultado: "Coincide", confianza: 96 },
        { foto: "F02", caso: "20200", etiquetaCorrecta: "Tablero principal abierto", resultado: "Coincide", confianza: 94 },
        { foto: "F03", caso: "20200", etiquetaCorrecta: "Extintor", resultado: "Coincide", confianza: 97 },
        { foto: "F04", caso: "20200", etiquetaCorrecta: "Detectores y central", resultado: "Coincide", confianza: 91 },
        { foto: "F05", caso: "20200", etiquetaCorrecta: "Medios de egreso", resultado: "Coincide", confianza: 92 },
        { foto: "F06", caso: "hotelManta", etiquetaCorrecta: "Fachada", resultado: "Coincide", confianza: 98 },
        { foto: "F07", caso: "hotelManta", etiquetaCorrecta: "Cubierta interior", resultado: "Difiere", etiquetaPropuesta: "Estructura y entrepisos", confianza: 82 },
        { foto: "F08", caso: "hotelManta", etiquetaCorrecta: "Lindero", instanciaCorrecta: "Norte", resultado: "Coincide", confianza: 78 },
        { foto: "F09", caso: "hotelManta", etiquetaCorrecta: "Orden y aseo", resultado: "Coincide", confianza: 90 },
        { foto: "F10", caso: "hotelManta", etiquetaCorrecta: "Tablero secundario", resultado: "Coincide", confianza: 93 },
        { foto: "F11", caso: "20200", etiquetaCorrecta: "Fachada", resultado: "Sin propuesta", marca: "Borrosa", confianza: 41 },
        { foto: "F12", caso: "hotelManta", etiquetaCorrecta: "Fachada", resultado: "Coincide", marca: "Duplicada de F06", confianza: 97 },
      ],
      // Esperado: 11 clasificadas, 10 correctas → precisión 91 %; 1 sin clasificar de 12 → 8 %; por confirmar 2 (F07, F08).
    },

    // IA-02 · Extracción visual: 10 fotos, 16 campos esperados
    "IA-02": {
      entrada: "Foto con su etiqueta",
      metricas: ["Precisión", "Cobertura", "% por confirmar", "Resultado por campo"],
      items: [
        { foto: "F01", caso: "20200", etiqueta: "Fachada", instancia: "Primera edificación del caso", campos: [
          { clave: "rg_con_conservacion", resultado: "Coincide", confianza: 93 },
          { clave: "rg_con_paredes", resultado: "Coincide", confianza: 95 } ] },
        { foto: "F02", caso: "20200", etiqueta: "Tablero principal abierto", campos: [
          { clave: "rg_ele_chk_01", valorCorrecto: "Sí", resultado: "Coincide", confianza: 91 },
          { clave: "rg_ele_chk_02", valorCorrecto: "Sí", resultado: "Difiere", confianza: 74 },
          { clave: "rg_ele_chk_03", valorCorrecto: "Sí", resultado: "No visible", motivo: "El interior del tablero queda fuera del encuadre" } ] },
        { foto: "F03", caso: "20200", etiqueta: "Extintor", campos: [
          { clave: "rg_pci_extintores · columna Estado del manómetro", valorCorrecto: "En zona de operación (verde)", resultado: "Coincide", confianza: 96 },
          { clave: "rg_pci_ext_senalizados", valorCorrecto: "Sí", resultado: "Coincide", confianza: 92 } ] },
        { foto: "F04", caso: "20200", etiqueta: "Detectores y central", campos: [
          { clave: "rg_pci_det_tipo", resultado: "Coincide", confianza: 88 } ] },
        { foto: "F05", caso: "20200", etiqueta: "Medios de egreso", campos: [
          { clave: "rg_con_medios_egreso", resultado: "Coincide", confianza: 90 } ] },
        { foto: "F06", caso: "hotelManta", etiqueta: "Fachada", instancia: "Primera edificación del caso", campos: [
          { clave: "rg_con_conservacion", resultado: "Coincide", confianza: 97 },
          { clave: "rg_con_paredes", resultado: "Coincide", confianza: 96 } ] },
        { foto: "F07", caso: "hotelManta", etiqueta: "Cubierta interior", instancia: "Primera edificación del caso", campos: [
          { clave: "rg_con_techo", resultado: "Difiere", confianza: 81 } ] },
        { foto: "F08", caso: "hotelManta", etiqueta: "Lindero", instancia: "Norte", campos: [
          { clave: "rg_lin_tipo_riesgo", resultado: "Coincide", confianza: 89 } ] },
        { foto: "F09", caso: "hotelManta", etiqueta: "Orden y aseo", campos: [
          { clave: "rg_ges_orden_aseo", resultado: "Coincide", confianza: 94 } ] },
        { foto: "F10", caso: "hotelManta", etiqueta: "Tablero secundario", campos: [
          { clave: "rg_ele_chk_04", valorCorrecto: "Sí", resultado: "Coincide", confianza: 92 },
          { clave: "rg_ele_chk_05", valorCorrecto: "Sí", resultado: "No visible", motivo: "Reflejo sobre la tapa del tablero" } ] },
      ],
      // Esperado con todos los valores correctos presentes: 16 esperados, 14 propuestos, 12 coinciden →
      // precisión 86 %, cobertura 88 %, por confirmar 4 de 14 (29 %).
    },

    // IA-03 · Lectura de documentos: 4 documentos del hotel en Manta, 7 campos esperados
    "IA-03": {
      entrada: "Documento",
      metricas: ["Precisión", "Cobertura", "% por confirmar", "Resultado por campo", "Texto transcrito"],
      textoTranscrito: "Texto transcrito de demostración · Solo en el prototipo",
      items: [
        { documento: "D1", caso: "hotelManta", tipo: "Permiso de bomberos", campos: [
          { clave: "rg_bom_permiso", resultado: "Coincide", confianza: 97 },
          { clave: "rg_bom_vigencia", valorCorrecto: "31/12/2026", resultado: "Coincide", confianza: 96 } ] },
        { documento: "D2", caso: "hotelManta", tipo: "Certificado de mantenimiento y recarga de extintores", campos: [
          { clave: "rg_pci_ext_mantenimiento", resultado: "Coincide", confianza: 92 },
          { clave: "rg_pci_extintores · columna Fecha de última recarga", valorCorrecto: "15/07/2026", resultado: "Difiere", confianza: 85 } ] },
        { documento: "D3", caso: "hotelManta", tipo: "Plan de emergencia", campos: [
          { clave: "rg_ges_plan_emergencia", valorCorrecto: "Entregado y vigente", resultado: "Coincide", confianza: 93 } ] },
        { documento: "D4", caso: "hotelManta", tipo: "Informe de termografía o mantenimiento eléctrico", campos: [
          { clave: "rg_ele_mantenimiento", resultado: "Coincide", confianza: 91 },
          { clave: "rg_ele_ultima_termografia", valorCorrecto: "10/06/2026", resultado: "No legible", motivo: "Fecha manuscrita sobre un sello" } ] },
      ],
      // Esperado: 7 esperados, 6 propuestos, 5 coinciden → precisión 83 %, cobertura 86 %, por confirmar 1 de 6 (17 %).
      // D1 muestra los umbrales por campo 95 / 70 (97 y 96 → Asignado).
    },

    // IA-04 · Contexto externo: entradas leídas del caso (RUC, provincia, cantón, coordenadas). Sin confianza.
    "IA-04": {
      entrada: "RUC y coordenadas del caso",
      metricas: ["Coincidencia por clave", "Fuentes que respondieron"],
      reglas: [
        "Entran las claves de salida de IA-04 cuyo campo está activo en el informe del caso.",
        "Todas coinciden salvo las indicadas en difieren.",
        "rg_sin_siniestros: \"CNX-02 no configurada · captura manual\"; no entra en el cálculo.",
        "Resultado no cuenta para publicar: \"Las conexiones CNX-03 y CNX-04 no están configuradas\".",
        "Distancias y tiempos muestran la opción y el número de respaldo con su fuente (\"1 a 5 km · 2,4 km · Servicio de mapas\").",
      ],
      casos: ["20200", "hotelManta"],
      // Valores del conjunto para las claves sin valor en el caso (dato de demostración, nunca se escriben en el caso).
      valoresCorrectos: {
        "20200": { rg_gen_representante_legal: "Representante de ejemplo", rg_gen_objeto_social: "Enseñanza de idiomas y difusión cultural", rg_gen_fecha_constitucion: "12/05/1987", rg_gen_situacion_legal: "Activa", rg_ubi_altitud: "2.560 m", rg_nat_zona_sismica: "Zona II", rg_bom_estacion: "Estación de bomberos de ejemplo N.º 3", rg_bom_distancia: "2,4 km", rg_bom_tiempo: "6 min" },
        "hotelManta": { rg_gen_representante_legal: "Representante de ejemplo", rg_gen_objeto_social: "Actividades de alojamiento en hoteles", rg_gen_fecha_constitucion: "03/09/2013", rg_gen_situacion_legal: "Activa", rg_ubi_altitud: "8 m", rg_nat_zona_sismica: "Zona VI", rg_bom_estacion: "Estación de bomberos de ejemplo N.º 1", rg_bom_distancia: "1,8 km", rg_bom_tiempo: "4 min" },
      },
      difieren: [{ caso: "20200", clave: "rg_bom_tiempo", nota: "El servicio de mapas propone el rango siguiente al correcto" }],
      // Esperado: 11 claves por caso (sin UPC, porque Robo no está activo, y sin rg_sin_siniestros) = 22; 21 coinciden → 95 %.
    },

    // IA-05 · Redacción: informe de 20200. Valida cifras contra sus campos y retiene textos que citen puntajes o bandas (DEC-021).
    "IA-05": {
      entrada: "Informe de ejemplo",
      caso: "20200",
      metricas: ["Cifras validadas (N de N)", "Hechos ausentes de los campos (debe ser 0)", "Textos con puntaje o banda (debe ser 0 aceptados)", "Textos retenidos"],
      textos: [
        { clave: "rg_cnc_resumen", texto: "La ubicación no cuenta con permiso de bomberos vigente. La estación de bomberos más cercana está a 2,4 km, con un tiempo de respuesta estimado de 6 min.",
          cifras: [ { cifra: "2,4 km", contra: "rg_bom_distancia (respaldo)", resultado: "Validada" }, { cifra: "6 min", contra: "rg_bom_tiempo (respaldo)", resultado: "Validada" } ] },
        { clave: "rg_cnc_agravantes (texto)", texto: "La ubicación no cuenta con permiso de bomberos y la estación más cercana está a 4,2 km.",
          cifras: [ { cifra: "4,2 km", contra: "rg_bom_distancia (respaldo)", resultado: "Rechazada", valorCampo: "2,4 km" } ],
          retenido: "Texto retenido: la cifra 4,2 km no coincide con su campo (2,4 km)" },
        { clave: "rg_cnc_atenuantes (texto)", texto: "El riesgo queda en la banda Subestándar por la falta de detección.",
          cifras: [], retenido: "Texto retenido: cita una banda del modelo" },
      ],
      hechosAusentes: 0,
      // Esperado: cifras validadas 2 de 3; 2 textos retenidos (cifra y banda); hechos ausentes 0. Si 2,4 km o 6 min no coinciden con
      // los respaldos de 20200 en IA-04, informar en Diferencias.
    },

    // IA-06 · Asistente de calificación: los dos casos con su calificación calculada
    "IA-06": {
      entrada: "Informe y calificación de ejemplo",
      metricas: ["Veredicto sugerido igual al esperado", "Garantías exigidas que quitó (debe ser 0)", "Garantías propuestas que existen en el catálogo"],
      items: [
        { caso: "20200", veredictoEsperado: "Asegurable", veredictoSugerido: "Asegurable", nota: "Con garantías (banda Subestándar)",
          garantiasAdicionales: [ { titulo: "Plan de emergencia y evacuación", justificacion: "El informe no registra plan de emergencia", requiere: "rg_ges_plan_emergencia en 20200 vacío o con una opción que indique que no existe (hoy: \"No existe\"); si no, informar en Diferencias" } ],
          garantiasExigidasQuitadas: 0 },
        { caso: "hotelManta", veredictoEsperado: "Asegurable", veredictoSugerido: "Asegurable", garantiasAdicionales: [], garantiasExigidasQuitadas: 0 },
      ],
      // Esperado: 2 de 2 veredictos iguales; 0 garantías exigidas quitadas; la garantía propuesta se busca por título en el catálogo
      // (si no existe: "Ítem no encontrado en el catálogo").
    },

    // ───────────── Variantes de Vehículos livianos (v1.5) ─────────────
    // Casos solo del conjunto (vlp1, vlp2): todos los valores correctos están declarados en el ítem.
    // El resultado esperado (resultadoEsperado) se calculó en asesoría con estas reglas; si la pantalla da otra cifra, se informa en Diferencias.

    // IA-02-VL · Extracción visual: 8 fotos de la captura guiada, 23 resultados esperados
    "IA-02-VL": {
      entrada: "Foto con su etiqueta",
      metricas: ["Precisión", "Cobertura", "% por confirmar", "Resultado por campo", "Validación de formato"],
      items: [
        { foto: "F01", caso: "vlp1", etiqueta: "Placa posterior", campos: [
          { clave: "veh_placa", rol: "Contraste", valorCorrecto: "PCD4821", resultado: "Coincide", confianza: 97 },
          { clave: "veh_color", rol: "Respaldo", valorCorrecto: "Blanco", resultado: "Coincide", confianza: 93 },
        ] },
        { foto: "F02", caso: "vlp1", etiqueta: "Sticker VIN", campos: [
          { clave: "veh_vin", rol: "Contraste", valorCorrecto: "9BGKS48U0NB123456", resultado: "Difiere", valorPropuesto: "9BGKS48U0NB12345O", confianza: 93, nota: "Lee una O en lugar de 0: la validación lo deja Por confirmar aunque la confianza sea 93" },
        ] },
        { foto: "F03", caso: "vlp1", etiqueta: "Tablero encendido", campos: [
          { clave: "veh_kilometraje", valorCorrecto: "48210", resultado: "Coincide", confianza: 95 },
          { clave: "veh_testigo_check_engine", valorCorrecto: "Apagado", resultado: "Coincide", confianza: 94 },
          { clave: "veh_testigo_abs", valorCorrecto: "Apagado", resultado: "Coincide", confianza: 93 },
          { clave: "veh_testigo_airbag", valorCorrecto: "Apagado", resultado: "Coincide", confianza: 92 },
          { clave: "veh_testigo_presion_aceite", valorCorrecto: "Apagado", resultado: "Coincide", confianza: 91 },
          { clave: "veh_testigo_bateria", valorCorrecto: "Apagado", resultado: "Coincide", confianza: 90 },
          { clave: "veh_testigo_temperatura", valorCorrecto: "Apagado", resultado: "Coincide", confianza: 86 },
          { clave: "veh_testigo_frenos", valorCorrecto: "Apagado", resultado: "Difiere", valorPropuesto: "No aplica", confianza: 72 },
        ] },
        { foto: "F04", caso: "vlp2", etiqueta: "Placa frontal", campos: [
          { clave: "veh_placa", rol: "Contraste", valorCorrecto: "GSA7305", resultado: "Coincide", confianza: 96 },
          { clave: "veh_color", rol: "Respaldo", valorCorrecto: "Gris", resultado: "Coincide", confianza: 94 },
        ] },
        { foto: "F05", caso: "vlp2", etiqueta: "Daño · Puerta delantera derecha", campos: [
          { clave: "veh_averias · columna Pieza", valorCorrecto: "Puerta delantera derecha", resultado: "Coincide", confianza: 92 },
          { clave: "veh_averias · columna Tipo de daño", valorCorrecto: "Abolladura", resultado: "Coincide", confianza: 89 },
          { clave: "veh_averias · columna Gravedad", valorCorrecto: "Media", resultado: "Difiere", valorPropuesto: "Alta", confianza: 71 },
          { clave: "veh_averias · columna Superficie (dm²)", valorCorrecto: "4", resultado: "Coincide", confianza: 64 },
        ] },
        { foto: "F06", caso: "vlp2", etiqueta: "Neumático · Delantera izquierda", campos: [
          { clave: "veh_neumaticos · fila Delantera izquierda · columna Marca", valorCorrecto: "Hankook", resultado: "Coincide", confianza: 93 },
          { clave: "veh_neumaticos · fila Delantera izquierda · columna Medida", valorCorrecto: "225/60 R17", resultado: "Coincide", confianza: 95 },
          { clave: "veh_neumaticos · fila Delantera izquierda · columna Labrado (mm)", valorCorrecto: "5", resultado: "No visible", motivo: "La foto no muestra el calibrador" },
        ] },
        { foto: "F07", caso: "vlp2", etiqueta: "Extra", campos: [
          { clave: "veh_extras · columna Descripción", valorCorrecto: "Pantalla multimedia", resultado: "Coincide", confianza: 90 },
          { clave: "veh_extras · columna Marca", valorCorrecto: "Pioneer", resultado: "Coincide", confianza: 84 },
        ] },
        { foto: "F08", caso: "vlp2", etiqueta: "Tablero encendido", campos: [
          { clave: "veh_kilometraje", valorCorrecto: "61530", resultado: "No visible", motivo: "Reflejo sobre el odómetro" },
        ] },
      ],
      resultadoEsperado: { esperados: 23, propuestos: 21, coinciden: 18, asignados: 14, porConfirmar: 7, sinPropuesta: 2, texto: "Precisión 85,7 % · Cobertura 91,3 % · Por confirmar 33,3 %", validacionFallida: ["F02 · veh_vin: el VIN no admite I, O ni Q"] },
    },

    // IA-03-VL · Lectura de documentos: 4 documentos, 23 resultados esperados
    "IA-03-VL": {
      entrada: "Documento",
      metricas: ["Precisión", "Cobertura", "% por confirmar", "Resultado por campo", "Validación de formato", "Texto transcrito"],
      textoTranscrito: "Texto transcrito de demostración · Solo en el prototipo",
      items: [
        { documento: "D1", caso: "vlp1", tipo: "Matrícula", campos: [
          { clave: "veh_nombre_matricula", valorCorrecto: "Propietario de ejemplo 1", resultado: "Coincide", confianza: 96 },
          { clave: "veh_identificacion_propietario", rol: "Contraste", valorCorrecto: "1712345675", resultado: "Coincide", confianza: 97 },
          { clave: "veh_gad_matriculacion", valorCorrecto: "Quito", resultado: "Coincide", confianza: 95 },
          { clave: "veh_anio_matricula", valorCorrecto: "2026", resultado: "Coincide", confianza: 94 },
          { clave: "veh_vigencia_matricula", valorCorrecto: "31/07/2027", resultado: "Coincide", confianza: 93 },
          { clave: "veh_placa", rol: "Contraste", valorCorrecto: "PCD4821", resultado: "Coincide", confianza: 96 },
          { clave: "veh_marca", rol: "Respaldo", valorCorrecto: "Chevrolet", resultado: "Coincide", confianza: 95 },
          { clave: "veh_modelo", rol: "Respaldo", valorCorrecto: "Onix LT", resultado: "Coincide", confianza: 92 },
          { clave: "veh_vin", rol: "Respaldo", valorCorrecto: "9BGKS48U0NB123456", resultado: "Coincide", confianza: 95 },
          { clave: "veh_numero_motor", rol: "Respaldo", valorCorrecto: "B10S1234567", resultado: "Coincide", confianza: 91 },
          { clave: "veh_color", rol: "Contraste", valorCorrecto: "Blanco", resultado: "Coincide", confianza: 94 },
        ] },
        { documento: "D2", caso: "vlp2", tipo: "Matrícula", campos: [
          { clave: "veh_nombre_matricula", valorCorrecto: "Propietario de ejemplo 2", resultado: "Coincide", confianza: 95 },
          { clave: "veh_identificacion_propietario", rol: "Contraste", valorCorrecto: "0923456784", resultado: "Difiere", valorPropuesto: "0923456785", confianza: 96, nota: "Un dígito mal leído: falla el dígito verificador y queda Por confirmar aunque la confianza sea 96" },
          { clave: "veh_gad_matriculacion", valorCorrecto: "Guayaquil", resultado: "Coincide", confianza: 94 },
          { clave: "veh_anio_matricula", valorCorrecto: "2026", resultado: "Coincide", confianza: 93 },
          { clave: "veh_vigencia_matricula", valorCorrecto: "30/04/2027", resultado: "No legible", motivo: "Sello sobre la fecha" },
          { clave: "veh_vin", rol: "Respaldo", valorCorrecto: "KNAPN81ABK7123456", resultado: "Coincide", confianza: 97 },
          { clave: "veh_placa", rol: "Contraste", valorCorrecto: "GSA7305", resultado: "Coincide", confianza: 97 },
        ] },
        { documento: "D3", caso: "vlp2", tipo: "Cédula del conductor", campos: [
          { clave: "veh_cedula_conductor", valorCorrecto: "0911223345", resultado: "Coincide", confianza: 98 },
          { clave: "veh_nombre_conductor", valorCorrecto: "Conductor de ejemplo 2", resultado: "Coincide", confianza: 97 },
          { clave: "veh_edad_conductor", valorCorrecto: "34", resultado: "Coincide", confianza: 95, nota: "Nacimiento 02/05/1992; fecha del reloj 18/10/2026" },
        ] },
        { documento: "D4", caso: "vlp2", tipo: "Licencia de conducir", numeroLeido: "0911223345", campos: [
          { clave: "veh_tipo_licencia", valorCorrecto: "B", resultado: "Coincide", confianza: 96 },
          { clave: "veh_caducidad_licencia", valorCorrecto: "14/03/2026", resultado: "Coincide", confianza: 94, nota: "Anterior al reloj: alerta \"Vencida\"; el estado no cambia" },
        ] },
      ],
      resultadoEsperado: { esperados: 23, propuestos: 22, coinciden: 21, asignados: 20, porConfirmar: 2, sinPropuesta: 1, texto: "Precisión 95,5 % · Cobertura 95,7 % · Por confirmar 9,1 %", validacionFallida: ["D2 · veh_identificacion_propietario: dígito verificador"], alertas: ["D4 · veh_caducidad_licencia: Vencida"] },
    },

    // IA-04-VL · Contexto externo (sin IA)
    "IA-04-VL": {
      entrada: "Placa e identificaciones del caso",
      metricas: ["Coincidencia por clave", "Fuentes que respondieron"],
      reglas: [
        "Entran las claves de salida de IA-04-VL con valor correcto declarado y las filas Fiscalía por placa, Fiscalía por cédula, ANT y SRI (columna Resultado).",
        "Todas coinciden salvo las indicadas en difieren.",
        "Siniestralidad: \"CNX-02 no configurada · registro manual\"; Codificación del VIN: se calcula con el catálogo WMI (Catálogos maestros). Ninguna de las dos filas entra en el cálculo.",
        "Resultado no cuenta para publicar: \"Las conexiones CNX-05, CNX-06, CNX-07 y CNX-08 no están configuradas\".",
      ],
      casos: ["vlp1", "vlp2"],
      valoresCorrectos: {
        vlp1: { veh_marca: "Chevrolet", veh_modelo: "Onix LT", veh_anio_modelo: "2022", veh_vin: "9BGKS48U0NB123456", veh_numero_motor: "B10S1234567", veh_tipo_carroceria: "Hatchback", veh_clase: "Automóvil", veh_color: "Blanco", veh_pais_origen: "Brasil", veh_cilindraje: "1000", veh_pasajeros: "5", veh_camv_cpn: "CAMV de ejemplo 1", veh_puntos_licencia: "30",
          "Fiscalía por placa": "Sin novedad", "Fiscalía por cédula": "Sin novedad", ANT: "Sin novedad", SRI: "Sin novedad" },
        vlp2: { veh_marca: "Kia", veh_modelo: "Sportage LX", veh_anio_modelo: "2019", veh_vin: "KNAPN81ABK7123456", veh_numero_motor: "G4NA1234567", veh_tipo_carroceria: "SUV", veh_clase: "Jeep", veh_color: "Gris", veh_pais_origen: "Corea del Sur", veh_cilindraje: "2000", veh_pasajeros: "5", veh_camv_cpn: "CAMV de ejemplo 2", veh_puntos_licencia: "28",
          "Fiscalía por placa": "Sin novedad", "Fiscalía por cédula": "Sin novedad", ANT: "Sin novedad", SRI: "Con novedad" },
      },
      observaciones: { vlp2: { SRI: "Valores pendientes de la matrícula 2026 (demostración)" } },
      difieren: [
        { caso: "vlp2", clave: "veh_clase", valorPropuesto: "Camioneta", nota: "La fuente registra la clase como Camioneta; el valor correcto es Jeep" },
      ],
      resultadoEsperado: { clavesEvaluadas: 34, coinciden: 33, texto: "33 de 34 coinciden (97,1 %)" },
    },
  },

  // ───────────────────── Indicadores (4C-3) ─────────────────────
  indicadores: {
    aviso: "Datos de demostración · Solo en el prototipo",
    periodo: { desde: "19/09/2026", hasta: "18/10/2026", texto: "Últimos 30 días" },
    inspeccionesDelPeriodo: 48,
    tarifa: "Costo calculado con una tarifa de demostración; la tarifa real se define en la conexión (Tarifa estimada: Por definir).",
    reglas: [
      "Comunes a todos los motores: ejecuciones, tiempo medio, % no disponible (el motor no respondió) y costo estimado: total y por inspección (total ÷ inspecciones del periodo). Se calculan sobre estos datos.",
      "Los porcentajes propios se muestran como vienen; los marcados \"número\" son conteos.",
      "Gráfico de ejecuciones por día (grafico): los 30 días del periodo en barras, en el orden de fechas.",
      "IA-02 e IA-03: tabla \"Campos más modificados por el inspector\" (clave y etiqueta, % modificado), con enlace de la clave a su campo en Formularios.",
      "En IA-06 quien modifica es el calificador, no el inspector.",
      "Si en el periodo hubo más de una versión, los indicadores se separan por versión (hoy no aplica: solo v1).",
      "Estado vacío real, sin datos de demostración: \"Sin ejecuciones: el motor no tiene versión vigente\". Se documenta; no se muestra mientras haya datos de demostración.",
      "IA-02-VL, IA-03-VL e IA-04-VL no tienen datos de demostración de indicadores: muestran el estado vacío real \"Sin ejecuciones: el motor no tiene versión vigente\".",
    ],
    grafico: {
      dias: "Los 30 días, siempre: los días sin ejecuciones muestran una marca mínima en la línea base, no un hueco.",
      finesDeSemana: "Sábados y domingos con una banda de fondo atenuada; en el tooltip, \"Fin de semana\".",
      etiquetasEje: "Solo los lunes, con día abreviado y fecha (\"lun 21/09\", \"lun 28/09\", \"lun 05/10\", \"lun 12/10\"); nunca etiquetas encimadas ni saltadas al azar.",
      tooltip: "Al pasar el cursor o al enfocar la barra con el teclado (flechas izquierda y derecha): día, fecha y ejecuciones con su unidad (\"lun 21/09 · 120 fotos\").",
      ejeY: "Tres líneas guía con valores enteros.",
      resumen: "Sobre el gráfico: \"Promedio por día hábil\" (ejecuciones ÷ días de lunes a viernes del periodo, 20) y \"Máximo diario\".",
      alternativa: "Enlace \"Ver como tabla\" que muestra fecha, día y ejecuciones (accesibilidad AA); \"Ver como gráfico\" vuelve.",
      colores: "Del design system; nunca solo el color para distinguir fines de semana (banda + texto del tooltip).",
    },
    fechas: ["19/09", "20/09", "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09", "01/10", "02/10", "03/10", "04/10", "05/10", "06/10", "07/10", "08/10", "09/10", "10/10", "11/10", "12/10", "13/10", "14/10", "15/10", "16/10", "17/10", "18/10"],
    motores: {
      "IA-01": {"ejecuciones": 48, "unidad": "sets de fotos", "tiempoMedio": "38 s", "noDisponible": 2, "costoTotalUSD": 57.6, "propios": [["Asignada", 81], ["Por confirmar", 12], ["Sin clasificar", 7], ["Reasignada por el inspector", 9]], "serieDiaria": [0, 0, 3, 2, 2, 3, 2, 0, 0, 2, 3, 2, 2, 3, 0, 0, 2, 2, 3, 2, 2, 0, 0, 3, 2, 3, 3, 2, 0, 0]},
      "IA-02": {"ejecuciones": 1920, "unidad": "fotos", "tiempoMedio": "6,2 s", "noDisponible": 1, "costoTotalUSD": 76.8, "propios": [["Asignado", 68], ["Por confirmar", 17], ["No visible", 15], ["Modificado por el inspector", 11]], "camposMasModificados": [["rg_con_conservacion", 22], ["rg_ocu_carga_combustible", 19], ["rg_rob_cctv_cobertura", 16], ["rg_ele_chk_07", 14], ["rg_alm_separacion_techo", 12]], "serieDiaria": [0, 0, 120, 80, 80, 120, 80, 0, 0, 80, 120, 80, 80, 120, 0, 0, 80, 80, 120, 80, 80, 0, 0, 120, 80, 120, 120, 80, 0, 0]},
      "IA-03": {"ejecuciones": 212, "unidad": "documentos", "tiempoMedio": "11,4 s", "noDisponible": 1, "costoTotalUSD": 31.8, "propios": [["Asignado", 79], ["Por confirmar", 14], ["No legible", 7], ["Modificado por el inspector", 6]], "camposMasModificados": [["rg_ee_equipos", 15], ["rg_ele_ultima_termografia", 12], ["rg_maq_ultimo_mantenimiento", 9], ["rg_bom_vigencia", 4], ["rg_ges_simulacros", 4]], "serieDiaria": [0, 0, 11, 11, 10, 11, 11, 0, 0, 10, 11, 10, 10, 11, 0, 0, 10, 11, 11, 10, 11, 0, 0, 11, 10, 11, 11, 10, 0, 0]},
      "IA-04": {"ejecuciones": 48, "unidad": "informes", "tiempoMedio": "3,1 s", "noDisponible": 0, "costoTotalUSD": 7.2, "propios": [["Respuesta CNX-03 SCVS", 92], ["Respuesta CNX-04 Servicio de mapas", 98], ["Cálculo geográfico (interno)", 100], ["Catálogo NEC (interno)", 100], ["Modificado por el inspector", 7]], "cnx02": "CNX-02 no configurada: siniestralidad por captura manual", "serieDiaria": [0, 0, 3, 2, 2, 3, 2, 0, 0, 2, 3, 2, 2, 3, 0, 0, 2, 2, 3, 2, 2, 0, 0, 3, 2, 3, 3, 2, 0, 0]},
      "IA-05": {"ejecuciones": 61, "unidad": "generaciones", "tiempoMedio": "24 s", "noDisponible": 0, "costoTotalUSD": 42.7, "propios": [["Textos generados", 610, "número"], ["Aceptados sin cambios", 58], ["Editados", 37], ["Descartados", 5], ["Cifras rechazadas por la validación", 9, "número"]], "serieDiaria": [0, 0, 3, 3, 3, 3, 3, 0, 0, 4, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0]},
      "IA-06": {"ejecuciones": 45, "unidad": "calificaciones", "tiempoMedio": "18 s", "noDisponible": 0, "costoTotalUSD": 22.5, "propios": [["Veredicto sugerido igual al final", 91], ["Veredicto modificado por el calificador", 9], ["Garantías propuestas", 38, "número"], ["Garantías aceptadas", 27, "número"], ["Garantías descartadas", 11, "número"]], "serieDiaria": [0, 0, 2, 2, 3, 2, 2, 0, 0, 3, 2, 2, 3, 2, 0, 0, 2, 3, 2, 2, 3, 0, 0, 2, 2, 2, 2, 2, 0, 0]},
    },
    // Esperado: costo por inspección IA-01 1,20; IA-02 1,60; IA-03 0,66; IA-04 0,15; IA-05 0,89; IA-06 0,47 (USD). Total 4,97 USD por inspección.
    // Gráfico: 30 barras (10 en fin de semana con marca mínima); promedio por día hábil IA-01 2,4; IA-02 96; IA-03 10,6; IA-04 2,4; IA-05 3,05; IA-06 2,25.
    // Máximo diario: IA-01 3; IA-02 120; IA-03 11; IA-04 3; IA-05 4; IA-06 3.
  },
};
