// SIRIUS · Datos de Motores de IA (BO-24) · v1.14 Borrador
// v1.14 (30/10/26, bloque S, envío S2b): IA-05 redacta las 12 observaciones por capítulo del ajuste F3 (DEC-067) e IA-04 aporta como
//   evidencia los mapas de referencia por amenaza y las rutas a bomberos y UPC (DEC-070). Requiere el ajuste F3 de la plantilla.
// Preparado en asesoría el 21/10/26 a partir del kernel de IA de Aseguradora del Sur.
// v1.13 (29/10/26, envío 7A): variantes de Vehículos livianos (DEC-048 a DEC-053). IA-02-VL, IA-03-VL e IA-04-VL son variantes por alcance
//   de IA-02, IA-03 e IA-04, con versiones propias; los motores de Ramos Generales no cambian (solo se les agrega variante).
//   Conexiones nuevas CNX-05 (datos del vehículo por placa), CNX-06 (ANT), CNX-07 (Fiscalía) y CNX-08 (SRI).
//   Elegibilidad para IA por alcance (la plantilla de Vehículos no tiene la propiedad), validaciones de formato por campo en Umbrales
//   (placa, VIN ISO 3779, cédula o RUC, licencia y caducidad) y roles de salida Principal, Contraste y Respaldo.
//   Claves validadas contra export-plantilla-vehiculos-livianos.md (Vehículos livianos v1, 94 campos). Requiere datos-pruebas-ia.js v1.5.
// v1.12 (23/10/26, envío 5D): IA-05 no recibe ni cita puntajes ni bandas (DEC-021): entrada de calificación, control e instrucción.
// v1.1 (22/10/26): documentos base con prefijo DB- para no chocar con los Documentos DOC-01 y DOC-02 del catálogo de seguimientos.
// v1.2 (22/10/26): "Obligatorio" por documento en cada motor, y reglas de uso de los documentos base.
// v1.3 (23/10/26): mapeo de salidas por motor (4B), quinta regla de documentos, documentos esperados de lectura,
//   conexión CNX-02 de siniestralidad (integración opcional), conversión de valores de contexto externo y umbrales por campo.
//   Requiere ajustes-formulario-ubicacion-rg.js aplicado (claves elegibles para IA).
// v1.4 (23/10/26): documentos esperados alineados con la plantilla (12 → 11): certificado de mantenimiento y recarga unificado,
//   brigadas y Todo riesgo construcción; rg_pci_ext_mantenimiento pasa de IA-02 a IA-03; identidad de documentos por seguimiento.
// v1.5 (23/10/26): publicación y versiones de los motores (4C-1): requisitos R1 a R5 y motivo, publicación Ahora o Programada,
//   versiones por motor, dependencia de IA-01, demostración "IA-02 versión 2 lista para publicar".
//   Ajustes de coherencia en instrucciones: IA-02 (sin indicadores de vigencia; "No visible" deja el campo vacío),
//   IA-05 (solo genera con "Generar informe"; al enviar valida cifras) e IA-06 (preexistencias y "No aplica").
//   Reemplaza por completo a la v1.4. Los motores de Vehículos no están incluidos (etapa propia).
// v1.6 (23/10/26): texto de cabecera en singular y plural; R4 "No aplica" en motores que no escriben campos del formulario;
//   referencia a datos-pruebas-ia.js (4C-2). Sin otros cambios frente a la v1.5.
// v1.7 (23/10/26): "Tarifa estimada" en las conexiones (4C-3). Sin otros cambios frente a la v1.6.
// v1.8 (23/10/26): el proyecto se diseña completo; las integraciones son conexiones que se configuran al final.
//   IA-04 usa las conexiones CNX-03 (SCVS) y CNX-04 (servicio de mapas), requeridas para publicar; ya no se rotula "MVP".
//   R1 evalúa la conexión del motor o sus conexiones requeridas.
// v1.9 (23/10/26): envío 4D. Modo de funcionamiento por conexión (Simulada, Pruebas, Producción) y simulación del prototipo:
//   mientras la conexión está Simulada, cada motor responde con su versión más reciente y respuestas de demostración, marcadas
//   "Respuesta simulada · Solo en el prototipo". Configuración de producción por conexión (acceso, funcionamiento, datos, costo y
//   campos propios del tipo), con valores "Por definir" salvo los valores por defecto indicados. Lo simulado nunca cumple R1 ni R5.
//   La tecnología del entorno de Pruebas y de Producción no se fija aquí: queda pendiente de la decisión de stack con Citytech.
// v1.10 (23/10/26): envío 4D-2. "Contiene datos personales" declarado por conexión y por motor, con motivo (provisional, por confirmar
//   con el área legal); regla de vacío: todo valor que empiece con "Por definir" o "Por confirmar" cuenta como vacío;
//   texto de "Probar conexión" en modos Pruebas y Producción. La integración real la hará Citytech con su stack.
// v1.11 (23/10/26): envío 5A-3. IA-01 agrega el umbral "Radio del predio" (200 m) para la marca "Fuera del predio" y las reglas de
//   cómo cuentan las fotos marcadas en la cobertura de evidencia.
// Solo datos: la interfaz los lee de aquí. No redactar ni modificar instrucciones desde el diseño.
// Las claves de campo coinciden con las plantillas "Ubicación – Ramos Generales" v1 (rg_…) y "Vehículos livianos" v1 (veh_…).

window.SIRIUS_DATOS_IA = {
  compania: "Aseguradora del Sur",

  // Umbrales globales de confianza (parametrizables por motor y por campo)
  umbralesPorDefecto: { asignar: 90, porConfirmar: 60 },

  // Reglas de uso de los documentos base en los motores
  reglasDocumentos: [
    "Obligatorio = Sí: si el documento no está Vigente o no tiene texto legible, el motor no se puede publicar y muestra \"Falta documento obligatorio: [nombre]\".",
    "Obligatorio = No: si no está disponible, el motor se ejecuta sin él y lo indica en su resultado.",
    "Cada motor solo consulta los documentos cuyos ramos coinciden con los ramos del caso (\"Todos\" aplica siempre).",
    "Los documentos con \"También configurado en\" son solo contexto: el cálculo usa la configuración, nunca el documento.",
    "\"Obligatorio\" se evalúa al publicar el motor. Al ejecutarse, un documento cuyos ramos no coinciden con los del caso no se consulta ni se reporta como faltante.",
  ],

  // Reglas del mapeo de salidas (4B)
  reglasMapeo: [
    "Un campo, un motor principal: dentro de una plantilla, cada clave tiene un solo motor que la propone como Principal. En grillas, la regla se aplica por columna. Otros motores pueden leerla solo como Contraste o Respaldo (ver rolesSalida).",
    "Extracción visual y lectura de documentos solo proponen campos elegibles para IA (\"Elegible para IA\" = Sí en la plantilla o, si la plantilla no tiene la propiedad, según elegibilidadPorAlcance); nunca escriben campos de tipo Texto (los redacta IA-05), salvo los campos Texto que son un dato leído y están en la lista de elegibles del alcance (placa, VIN, motor, nombres e identificaciones).",
    "Contexto externo no usa IA: sus campos se rigen por este mapeo y muestran su fuente.",
    "Si un motor o una conexión no responde, el campo queda para captura manual y el informe nunca se bloquea.",
    "En el prototipo, con la simulación activa, las conexiones en modo Simulada responden con datos de demostración (ver simulacion).",
    "Un valor propuesto nunca reemplaza uno que una persona ya editó.",
    "Un documento declarado en varias secciones con el mismo código de seguimiento (DOC-01, DOC-02) es el mismo documento en el caso: se carga una vez y cumple todas sus declaraciones.",
  ],

  // ───────────────────── Variantes por alcance (v1.13 · DEC-048) ─────────────────────
  variantes: {
    regla: "Un motor puede tener una variante por plantilla (alcance). Cada variante tiene código propio (IA-02-VL), su propia línea de versiones, salidas, umbrales, documentos base e instrucciones, y comparte la conexión del motor base. Se publica, se programa y se da de baja por separado.",
    lista: [
      { variante: "Ramos Generales", plantilla: "Ubicación – Ramos Generales", sufijo: "", motores: ["IA-01", "IA-02", "IA-03", "IA-04", "IA-05", "IA-06"] },
      { variante: "Vehículos livianos", plantilla: "Vehículos livianos", sufijo: "-VL", motores: ["IA-02-VL", "IA-03-VL", "IA-04-VL"] },
    ],
    nombreVisible: "[código del motor base] · [variante] (\"IA-02 · Vehículos livianos\")",
    listado: "La lista de motores agrupa por motor base y muestra sus variantes debajo, cada una con su versión y estado. Filtro \"Alcance\": Todos, Ramos Generales, Vehículos livianos.",
    sinVariante: "IA-01, IA-05 e IA-06 no tienen variante de Vehículos livianos en esta etapa.",
  },

  // Roles de una salida dentro de un alcance (v1.13 · DEC-053)
  rolesSalida: [
    { rol: "Principal", regla: "Propone el valor del campo. Uno por clave (o por columna en grillas) dentro del alcance; lo exige R4." },
    { rol: "Contraste", regla: "Lee el mismo dato de otra fuente y lo compara con el valor del campo. Si coincide, se anota como respaldo del valor; si no coincide, el campo pasa a \"Por confirmar\" con los dos valores y sus fuentes (\"No coincide con la matrícula: 9BGKS48U0NB123456\"). Nunca reemplaza el valor." },
    { rol: "Respaldo", regla: "Contraste que además propone el valor solo si el campo está vacío porque la fuente principal no respondió o no está configurada. El valor queda \"Por confirmar\" aunque la confianza supere el umbral de asignar." },
  ],
  precedenciaFuentes: "Si la plantilla declara varias fuentes, la primera es la principal y las siguientes son Contraste o Respaldo, en ese orden (veh_placa: Solicitud › Servicio de placas › Extracción automática). Un valor editado por una persona nunca se reemplaza.",

  // Elegibilidad para IA cuando la plantilla no tiene la propiedad (v1.13 · DEC-052)
  elegibilidadPorAlcance: {
    "Vehículos livianos": {
      regla: "Mientras la plantilla no tenga \"Elegible para IA\" por campo, son elegibles los campos cuya fuente incluye \"Extracción automática\" y los de la lista adicional. Ajuste de la plantilla en el backlog (agregar la propiedad y la fuente a los adicionales).",
      porFuente: ["veh_fecha_hora_inspeccion", "veh_placa", "veh_marca", "veh_modelo", "veh_vin", "veh_numero_motor", "veh_color", "veh_nombre_matricula", "veh_identificacion_propietario", "veh_gad_matriculacion", "veh_anio_matricula", "veh_vigencia_matricula", "veh_kilometraje", "veh_tipo_licencia", "veh_caducidad_licencia", "veh_neumaticos", "veh_testigo_check_engine", "veh_testigo_abs", "veh_testigo_airbag", "veh_testigo_presion_aceite", "veh_testigo_bateria", "veh_testigo_temperatura", "veh_testigo_frenos", "veh_averias"],
      adicionales: [
        { clave: "veh_extras", columnas: ["Descripción", "Marca"], motivo: "El alcance de IA-02 incluye Extras; el valor (USD) lo ingresa el inspector." },
        { clave: "veh_cedula_conductor", motivo: "Se lee de la cédula del conductor (IA-03-VL)." },
        { clave: "veh_nombre_conductor", motivo: "Se lee de la cédula del conductor (IA-03-VL)." },
        { clave: "veh_edad_conductor", motivo: "Se calcula con la fecha de nacimiento de la cédula y el reloj del prototipo." },
      ],
      noPropone: [
        { clave: "veh_fecha_hora_inspeccion", motivo: "Sale de los metadatos de las fotos (sistema), no de un motor." },
        { clave: "veh_verificacion_chasis_relieve, veh_verificacion_sticker_vin, veh_verificacion_plaqueta_panoramica", motivo: "Son verificaciones físicas del inspector; la IA solo contrasta el VIN leído." },
      ],
    },
  },

  // Validaciones de formato por campo (v1.13 · DEC-051). Se configuran en la pestaña Umbrales (umbralesPorCampo.validacion).
  // Una validación nunca rechaza un valor: si falla, el campo queda "Por confirmar" con el motivo, aunque la confianza sea ≥ asignar.
  validacionesFormato: [
    {
      id: "placa", nombre: "Placa",
      normalizar: "Mayúsculas; se quitan guiones y espacios (\"pcd-4821\" → \"PCD4821\"). Se guarda sin guion.",
      formatos: [
        { tipo: "Automóvil y demás vehículos de cuatro ruedas", patron: "^[A-Z]{3}[0-9]{4}$", ejemplo: "PCD4821" },
        { tipo: "Motocicleta", patron: "^[A-Z]{2}[0-9]{3}[A-Z]$", ejemplo: "PB123C" },
      ],
      reglaAlcance: "En Vehículos livianos solo vale el formato de automóvil; una placa con formato de motocicleta queda \"Por confirmar: formato de placa de motocicleta\".",
      falla: "Por confirmar: formato de placa no reconocido",
    },
    {
      id: "vin", nombre: "VIN (ISO 3779)",
      normalizar: "Mayúsculas; se quitan espacios.",
      regla: "17 caracteres, letras y números, sin I, O ni Q. Estándar global ISO 3779, obligatorio desde el año modelo 1981 para todas las marcas.",
      noValida: "El dígito verificador (posición 9) y el código de año (posición 10) no se validan: solo son obligatorios en Norteamérica y China.",
      anterior1981: "Si veh_anio_modelo < 1981, se acepta un número de chasis de 1 a 17 caracteres alfanuméricos (anterior a la norma).",
      fallas: ["Por confirmar: el VIN debe tener 17 caracteres", "Por confirmar: el VIN no admite I, O ni Q"],
      codificacion: "Fila \"Codificación del VIN\" de veh_verificaciones_externas: los 3 primeros caracteres (WMI, ISO 3780) identifican fabricante y país; se contrastan con veh_marca y veh_pais_origen. Catálogo WMI interno: carga parcial en Catálogos maestros.",
    },
    {
      id: "cedula", nombre: "Cédula",
      regla: "10 dígitos; provincia (dos primeros) de 01 a 24 o 30; tercer dígito de 0 a 5; dígito verificador en módulo 10 (coeficientes 2,1,2,1,2,1,2,1,2; restar 9 a productos mayores que 9).",
      falla: "Por confirmar: cédula no válida ([motivo])",
    },
    {
      id: "cedulaORuc", nombre: "Cédula o RUC",
      regla: "Cédula (10 dígitos, como arriba) o RUC (13 dígitos que terminan en 001; persona natural: cédula válida + 001; sociedad privada: tercer dígito 9; entidad pública: tercer dígito 6). Pasaporte u otro documento: \"Por confirmar: identificación extranjera\".",
      nota: "El propietario puede ser una empresa. La plantilla declara \"Formato: Cédula\" en veh_identificacion_propietario: ajuste al backlog (DEC-054).",
      falla: "Por confirmar: identificación no válida ([motivo])",
    },
    {
      id: "licencia", nombre: "Licencia de conducir",
      regla: "El número de la licencia es igual a la cédula del titular (veh_cedula_conductor o, si el conductor es el asegurado, veh_identificacion_propietario). La categoría debe ser una opción de veh_tipo_licencia.",
      falla: "Por confirmar: el número de la licencia no coincide con la cédula",
      nota: "El catálogo del campo tiene A a G; faltan A1, C1, D1 y E1 de la normativa de la ANT. Ajuste al backlog.",
    },
    {
      id: "caducidad", nombre: "Fecha de caducidad",
      regla: "Fecha válida (dd/mm/aaaa). Si es anterior a la fecha del reloj del prototipo, el valor se conserva con su estado y el campo muestra la alerta \"Vencida\". No cambia el estado de la propuesta.",
    },
  ],

  // ───────────────────── Publicación y versiones (4C-1) ─────────────────────
  // El estado de cada requisito se calcula sobre estos datos; nunca se escribe fijo (salvo en la demostración).
  publicacion: {
    estadosVersion: ["Borrador", "Programada", "Vigente", "Dada de baja"],
    requisitos: [
      { codigo: "R1", nombre: "Conexiones configuradas", regla: "La conexión del motor (conexion) y cada una de sus conexiones requeridas (conexionesRequeridas) están en estado Configurada. Las conexiones opcionales (CNX-02) nunca bloquean.", noAplica: "Motor sin conexiones requeridas.", textoFalta: "Falta configurar la conexión [código] [nombre] (una línea por conexión)", pestana: "General" },
      { codigo: "R2", nombre: "Instrucciones", regla: "Las instrucciones no están vacías.", noAplica: "Instrucciones con estado \"No aplica\" (IA-04).", textoFalta: "Faltan instrucciones", pestana: "Instrucciones" },
      { codigo: "R3", nombre: "Documentos base obligatorios", regla: "Todo documento con Obligatorio = Sí está Vigente y tiene texto legible.", noAplica: "Motor sin documentos obligatorios.", textoFalta: "Falta documento obligatorio: [nombre]", pestana: "Documentos base" },
      { codigo: "R4", nombre: "Mapeo de salidas válido", regla: "Cada clave existe en la versión vigente de la plantilla del alcance; en motores con modelo de lenguaje es elegible para IA (plantilla o elegibilidadPorAlcance); extracción visual y lectura de documentos no escriben campos de tipo Texto salvo los elegibles del alcance; ningún otro motor Vigente del mismo alcance la propone como Principal (en grillas, la misma columna). Contraste y Respaldo no cuentan como duplicado.", noAplica: "El motor no escribe campos del formulario (IA-01 escribe en evidencias; IA-06, propuestas de calificación).", textoFalta: "[clave]: [motivo]", pestana: "Salidas" },
      { codigo: "R5", nombre: "Prueba ejecutada", regla: "Hay un conjunto de prueba ejecutado sobre esta versión del Borrador con una conexión configurada. Un resultado de demostración no cumple este requisito.", desactualiza: "Cualquier cambio en instrucciones, documentos base, umbrales o salidas marca la prueba \"Prueba desactualizada\".", noAplica: null, fuenteResultados: "datos-pruebas-ia.js", textoFalta: "Falta ejecutar la prueba", textoDemostracion: "La prueba de demostración no cuenta para publicar", textoDesactualizada: "Prueba desactualizada: vuelve a ejecutarla", pestana: "Prueba" },
    ],
    motivo: "Obligatorio al confirmar la publicación. No cuenta como requisito pendiente.",
    textoCabecera: { uno: "Falta 1 requisito para publicar", varios: "Faltan [N] requisitos para publicar" },
    modos: [
      { modo: "Ahora", efecto: "La versión pasa a Vigente al confirmar. La versión Vigente anterior pasa a Dada de baja." },
      { modo: "Programada", efecto: "La versión pasa a Programada con fecha y hora futuras; al llegar la fecha pasa a Vigente. Solo puede haber una versión Programada por motor." },
    ],
    impacto: "Se aplica a las ejecuciones desde [fecha]. Los valores ya propuestos conservan la versión que los produjo.",
    comparacion: {
      regla: "Informativa. Muestra la precisión de la prueba de la versión nueva frente a la de la versión Vigente.",
      sinVigente: "Primera versión: sin versión vigente para comparar",
      siBaja: "La precisión baja de [vigente] % a [nueva] %. Confirma con el motivo.",
      bloquea: false,
      provisional: true,
    },
    darDeBaja: {
      ubicacion: "Menú ⋯ de la cabecera del editor",
      deshabilitadoSi: "No hay versión vigente",
      impacto: "Los campos que propone este motor quedan para captura manual desde [fecha]. El informe nunca se bloquea.",
      pideMotivo: true,
    },
    historial: "Publicar, programar y dar de baja quedan en el Historial de cambios del módulo con persona, fecha y motivo.",
    dependencias: [
      "IA-02 e IA-03 pueden publicarse sin IA-01. Sin IA-01 Vigente, trabajan sobre las fotos que etiqueta el inspector.",
      "IA-02-VL e IA-03-VL no dependen de IA-01: en Vehículos livianos la captura es guiada y cada foto llega con su etiqueta.",
      "Cada variante se publica, se programa y se da de baja por separado: publicar IA-02-VL no cambia la versión vigente de IA-02 (DEC-048).",
    ],
  },

  // ───────────────────── Simulación del prototipo (4D) ─────────────────────
  // Interruptor global en el menú "Ver como otro usuario · demostración". No modifica motores, versiones ni requisitos.
  simulacion: {
    activaPorDefecto: true,
    ubicacionInterruptor: "Menú \"Ver como otro usuario · demostración\", debajo de \"Fecha del prototipo\"",
    textoInterruptor: { activa: "Simulación de motores y conexiones: Activa", apagada: "Simulación de motores y conexiones: Apagada" },
    nota: "Solo en el prototipo",
    reglas: [
      "Con la simulación activa, toda conexión en modo Simulada responde con datos de demostración y cada motor usa su versión más reciente, aunque esté en Borrador.",
      "Todo valor, texto o resultado producido así muestra en su detalle \"Respuesta simulada · Solo en el prototipo\" y la versión del motor (\"v1 · Borrador\"). El origen visible del valor no cambia.",
      "Con la simulación apagada, una conexión Simulada se comporta como una conexión que no responde: sus campos quedan para captura manual con la nota \"Extracción no disponible\" y nada se bloquea.",
      "Lo simulado nunca cumple R1 (conexiones configuradas) ni R5 (prueba ejecutada). El estado de los requisitos y la cabecera \"Faltan N requisitos para publicar\" no cambian.",
      "El interruptor no se guarda: al recargar vuelve a Activa.",
      "Variantes de Vehículos livianos: con la simulación activa, en los casos de Vehículos del prototipo CNX-05 responde con los valores que el caso ya tiene (resultado Coincide), CNX-06, CNX-07 y CNX-08 responden \"Sin novedad\" y CNX-01 propone los valores del caso. En los casos del conjunto de prueba se usan los de datos-pruebas-ia.js. Nunca se inventan otros valores.",
    ],
    avisoConexiones: { activa: "Simulación activa: las conexiones en modo Simulada responden con datos de demostración. Solo en el prototipo.", apagada: "Simulación apagada: las conexiones en modo Simulada no responden y sus campos quedan para captura manual. Solo en el prototipo." },
  },

  // ─────────────── Configuración de las conexiones (producción, 4D) ───────────────
  configuracionConexiones: {
    modos: [
      { modo: "Simulada", descripcion: "Responde con datos de demostración. Solo en el prototipo.", cumpleR1: false },
      { modo: "Pruebas", descripcion: "Conectada a un entorno de pruebas del servicio. Sirve para ejecutar la prueba del motor (R5).", cumpleR1: true },
      { modo: "Producción", descripcion: "Conectada al servicio definitivo.", cumpleR1: true },
    ],
    estados: [
      { estado: "Sin configurar", regla: "Faltan datos obligatorios del modo elegido." },
      { estado: "Configurada", regla: "Modo Pruebas o Producción, datos completos y última prueba de conexión correcta." },
      { estado: "Con error", regla: "La última prueba de conexión o ejecución falló; muestra fecha, hora y mensaje." },
      { estado: "Desactivada", regla: "Apagada por el Administrador con motivo; sus motores no se ejecutan y los campos quedan para captura manual." },
    ],
    // Secciones del formulario de cada conexión (orden de presentación)
    secciones: [
      { seccion: "General", campos: ["Código (solo lectura)", "Nombre", "Tipo de conexión (solo lectura)", "Modo de funcionamiento", "Estado (calculado)", "Opcional (solo lectura)", "Motores que la usan (calculado, con enlace)"] },
      { seccion: "Acceso", campos: ["Servicio o proveedor", "Dirección del servicio (endpoint)", "Método de autenticación", "Referencia del secreto"] },
      { seccion: "Funcionamiento", campos: ["Tiempo de espera", "Reintentos", "Límite de solicitudes por minuto", "Vigencia de la caché"] },
      { seccion: "Datos", campos: ["Retención de datos", "Ubicación del procesamiento", "Contiene datos personales"] },
      { seccion: "Costo", campos: ["Tarifa estimada", "Presupuesto mensual", "Alerta de presupuesto"] },
      { seccion: "Propios del tipo", campos: ["Según la conexión (ver configuracion.propios)"] },
      { seccion: "Prueba de conexión", campos: ["Botón \"Probar conexión\"", "Última prueba (fecha, hora, persona y resultado)"] },
    ],
    reglas: [
      "La credencial nunca se muestra ni se escribe en pantalla: solo se registra la referencia al secreto guardado en el gestor de secretos del entorno.",
      "\"Probar conexión\" en modo Simulada responde \"Respuesta simulada · Solo en el prototipo\" con la hora del reloj del prototipo; no cambia el estado ni cuenta para R1. No se guarda al recargar.",
      "Guardar cambios pide motivo y queda en el Historial de cambios del módulo. Cambiar el modo muestra el impacto: motores afectados y si su prueba queda desactualizada (R5).",
      "Los valores \"Por definir\" y \"Por confirmar\" se muestran tal cual, en texto secundario; no bloquean en modo Simulada.",
      "Para la obligatoriedad por modo, todo valor que empiece con \"Por definir\" o \"Por confirmar\" cuenta como vacío.",
      "\"Contiene datos personales\" se declara en cada conexión y en cada motor, con su motivo; no se calcula. Es provisional: se confirma con el área legal (LOPDP).",
      "Reintentos con espera creciente entre intentos. Agotados los reintentos, el campo queda para captura manual (\"Extracción no disponible\").",
    ],
    probarConexion: {
      Simulada: "Responde \"Respuesta simulada · Solo en el prototipo\" con la hora del reloj del prototipo; no cambia el estado.",
      otrosModos: { habilitado: false, tooltip: "Disponible cuando la conexión esté integrada al servicio. Solo en el prototipo." },
    },
    camposObligatoriosPorModo: {
      Simulada: [],
      Pruebas: ["Servicio o proveedor", "Dirección del servicio (endpoint)", "Método de autenticación", "Referencia del secreto", "Tiempo de espera", "Reintentos"],
      "Producción": ["Servicio o proveedor", "Dirección del servicio (endpoint)", "Método de autenticación", "Referencia del secreto", "Tiempo de espera", "Reintentos", "Retención de datos", "Ubicación del procesamiento", "Presupuesto mensual"],
    },
  },

  // ───────────────────────── Conexiones de IA ─────────────────────────
  conexiones: [
    {
      codigo: "CNX-01",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Procesa documentos y textos con nombres, números de identificación y el representante legal (IA-03, IA-05 e IA-06)",
      nombre: "Modelo de lenguaje con visión",
      servicio: "Por definir",
      modelo: "Por definir",
      capacidades: ["Texto", "Imágenes", "Documentos PDF"],
      retencionDatos: "Por confirmar con el área legal (LOPDP)",
      ubicacionProcesamiento: "Por confirmar",
      estado: "Sin configurar",
      tipoConexion: "Modelo de lenguaje",
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por uso del modelo; con ella se calcula el costo estimado de los indicadores.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 60, reintentos: 2, limitePorMinuto: "Por definir", cache: "Sin caché" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Modelo", valor: "Por definir" },
          { campo: "Versión del modelo", valor: "Por definir" },
          { campo: "Temperatura", valor: "0,2", nota: "Valor por defecto para extracción y lectura; editable" },
          { campo: "Máximo de salida", valor: "Por definir" },
          { campo: "Modelo alterno si falla", valor: "Ninguno", nota: "Si no hay alterno, el campo queda para captura manual" },
          { campo: "Capacidades", valor: "Texto, Imágenes, Documentos PDF" },
        ],
      },
    },
    {
      codigo: "CNX-02",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Consulta siniestros por RUC o cédula",
      nombre: "Base de siniestralidad del mercado",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (servicio SaaS con siniestros de esta y otras compañías)",
      modelo: null,
      capacidades: ["Consulta de siniestros por RUC o cédula", "Consulta por dirección o coordenadas"],
      retencionDatos: "Por confirmar con el área legal (LOPDP): consentimiento y base legal para compartir siniestros entre compañías",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: true,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "7 días por RUC o cédula" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Criterio de consulta", valor: "RUC o cédula; dirección o coordenadas" },
          { campo: "Mapeo de la respuesta", valor: "rg_sin_siniestros (fecha, causa, monto, estado)" },
          { campo: "Base legal para compartir siniestros", valor: "Por confirmar (LOPDP)" },
        ],
      },
    },
    {
      codigo: "CNX-03",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Devuelve el representante legal de la compañía",
      nombre: "Superintendencia de Compañías (SCVS)",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (consulta de compañías por RUC)",
      modelo: null,
      capacidades: ["Representante legal, objeto social, fecha de constitución y situación legal por RUC"],
      retencionDatos: "Por confirmar con el área legal (LOPDP): el representante legal es un dato personal",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: false,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "30 días por RUC" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Método de consulta", valor: "Por definir", nota: "Confirmar con la SCVS: no hay una API pública documentada" },
          { campo: "Se consulta solo si", valor: "La identificación del asegurado es RUC de sociedad" },
          { campo: "Mapeo de la respuesta", valor: "rg_gen_representante_legal, rg_gen_objeto_social, rg_gen_fecha_constitucion, rg_gen_situacion_legal" },
        ],
      },
    },
    {
      codigo: "CNX-04",
      contieneDatosPersonales: false,
      motivoDatosPersonales: "Solo recibe las coordenadas del predio",
      nombre: "Servicio de mapas",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (geocodificación, elevación y rutas)",
      modelo: null,
      capacidades: ["Altitud por coordenadas", "Estación de bomberos y UPC más cercanas, con distancia y tiempo de llegada"],
      retencionDatos: "Coordenadas del predio; sin datos personales",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: false,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Clave de API restringida", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 5, reintentos: 2, limitePorMinuto: "Por definir", cache: "90 días por coordenadas" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Servicios habilitados", valor: "Geocodificación, Elevación, Lugares, Rutas, Mapa interactivo" },
          { campo: "Región", valor: "ec" },
          { campo: "Idioma", valor: "es" },
          { campo: "Restricción de la clave", valor: "Por dominio del sistema", nota: "La clave del mapa interactivo se usa en el navegador; las demás, solo desde el servidor" },
          { campo: "Mapeo de la respuesta", valor: "rg_ubi_altitud, rg_bom_estacion, rg_bom_distancia, rg_bom_tiempo, rg_rob_upc_nombre, rg_rob_upc_distancia, rg_rob_upc_tiempo" },
        ],
      },
    },
    // ── Conexiones de Vehículos livianos (v1.13 · DEC-049 y DEC-050). Datos personales: provisional, por confirmar con el área legal (LOPDP).
    {
      codigo: "CNX-05",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "La placa y el VIN se vinculan con el propietario",
      nombre: "Datos del vehículo por placa",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (servicio de consulta vehicular por placa)",
      modelo: null,
      capacidades: ["Marca, modelo, año, VIN, motor, carrocería, clase, color, país de origen, cilindraje, pasajeros y CAMV o CPN por placa"],
      retencionDatos: "Por confirmar con el área legal (LOPDP)",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: false,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "30 días por placa" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Criterio de consulta", valor: "Placa normalizada (veh_placa)" },
          { campo: "Se consulta solo si", valor: "La placa pasa la validación de formato" },
          { campo: "Mapeo de la respuesta", valor: "veh_marca, veh_modelo, veh_anio_modelo, veh_vin, veh_numero_motor, veh_tipo_carroceria, veh_clase, veh_color, veh_pais_origen, veh_cilindraje, veh_pasajeros, veh_camv_cpn" },
          { campo: "Proveedor", valor: "Por definir", nota: "Confirmar si la fuente es la ANT, el SRI o un servicio comercial" },
        ],
      },
    },
    {
      codigo: "CNX-06",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Consulta la licencia y los puntos de una persona por cédula",
      nombre: "Agencia Nacional de Tránsito (ANT)",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (consulta de licencias y del vehículo)",
      modelo: null,
      capacidades: ["Puntos y estado de la licencia por cédula", "Novedades del vehículo por placa"],
      retencionDatos: "Por confirmar con el área legal (LOPDP)",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: false,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "Sin caché (se consulta en cada informe)" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Método de consulta", valor: "Por definir", nota: "Confirmar con la ANT el convenio o servicio disponible" },
          { campo: "Criterio de consulta", valor: "Cédula del conductor habitual (veh_cedula_conductor o veh_identificacion_propietario) y placa" },
          { campo: "Mapeo de la respuesta", valor: "veh_puntos_licencia; fila \"ANT\" de veh_verificaciones_externas" },
        ],
      },
    },
    {
      codigo: "CNX-07",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Consulta denuncias por cédula; pueden ser datos sensibles",
      nombre: "Fiscalía General del Estado",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (consulta de denuncias por placa y por cédula)",
      modelo: null,
      capacidades: ["Denuncias asociadas a una placa (robo del vehículo)", "Denuncias asociadas a una cédula"],
      retencionDatos: "Por confirmar con el área legal (LOPDP): base legal para consultar denuncias por cédula",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: false,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "Sin caché (se consulta en cada informe)" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Método de consulta", valor: "Por definir", nota: "Confirmar con la Fiscalía si hay un servicio para empresas" },
          { campo: "Criterio de consulta", valor: "Placa (veh_placa) y cédula del propietario (veh_identificacion_propietario)" },
          { campo: "Mapeo de la respuesta", valor: "Filas \"Fiscalía por placa\" y \"Fiscalía por cédula\" de veh_verificaciones_externas" },
        ],
      },
    },
    {
      codigo: "CNX-08",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Devuelve el propietario registrado y sus valores pendientes",
      nombre: "Servicio de Rentas Internas (SRI)",
      tipoConexion: "Fuente de datos externa",
      servicio: "Por definir (consulta de valores a pagar del vehículo)",
      modelo: null,
      capacidades: ["Avalúo, valores pendientes de matrícula e impuestos por placa"],
      retencionDatos: "Por confirmar con el área legal (LOPDP)",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el dato queda para captura manual",
      estado: "Sin configurar",
      opcional: false,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "7 días por placa" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Método de consulta", valor: "Por definir", nota: "Confirmar con el SRI el servicio disponible" },
          { campo: "Criterio de consulta", valor: "Placa (veh_placa)" },
          { campo: "Mapeo de la respuesta", valor: "Fila \"SRI\" de veh_verificaciones_externas (Con novedad si hay valores pendientes)" },
        ],
      },
    },
    {
      codigo: "CNX-09",
      contieneDatosPersonales: false,
      motivoDatosPersonales: "Solo devuelve catálogos corporativos (sin datos personales)",
      nombre: "BD de Gobernanza",
      tipoConexion: "Fuente de datos interna",
      servicio: "Por definir (consulta de catálogos corporativos)",
      modelo: null,
      capacidades: ["Catálogos corporativos que se administran fuera de SIRIUS (por ejemplo, Sucursales)"],
      retencionDatos: "Por confirmar con el área legal (LOPDP)",
      ubicacionProcesamiento: "Por confirmar",
      resiliencia: "Tiempo de espera y reintentos acotados; si falla o no está configurada, el catálogo conserva su última sincronización",
      estado: "Sin configurar",
      opcional: true,
      tarifaEstimada: "Por definir",
      notaTarifa: "Costo por consulta a la fuente de datos.",
      modo: "Simulada",
      configuracion: {
        acceso: { endpoint: "Por definir", autenticacion: "Por definir", referenciaSecreto: "Por definir" },
        funcionamiento: { tiempoEsperaSeg: 10, reintentos: 2, limitePorMinuto: "Por definir", cache: "24 horas por catálogo" },
        costo: { presupuestoMensual: "Por definir", alertaPresupuestoPct: 80 },
        propios: [
          { campo: "Método de consulta", valor: "Por definir", nota: "Confirmar con Gobernanza el servicio disponible" },
          { campo: "Criterio de consulta", valor: "Catálogo (por ejemplo, Sucursales)" },
          { campo: "Mapeo de la respuesta", valor: "Catálogo conectado de Administración › Catálogos (un registro que deja de venir de la fuente queda Inactivo)" },
        ],
      },
    },
  ],
  // Fuentes internas de IA-04 (no son conexiones): "Cálculo geográfico" (distancias al mar y a ríos sobre capas geográficas del catálogo)
  // y "Catálogo NEC por cantón" (Administración › Catálogos).

  // ───────────────────── Biblioteca de documentos base ─────────────────────
  documentosBase: [
    { codigo: "DB-01", nombre: "Políticas de Suscripción Corporativos", tipo: "Política de suscripción", ramos: ["Todos"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: "Garantías y políticas › Políticas de suscripción", textoLegible: true },
    { codigo: "DB-02", nombre: "Modelo de Scoring de Calificación V3", tipo: "Matriz o catálogo", ramos: ["Incendio y líneas aliadas", "Robo"], version: "3", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: "Modelos de calificación › Scoring V3 – Ramos de ubicación", textoLegible: true },
    { codigo: "DB-03", nombre: "Criterios Norma NFPA", tipo: "Normativa técnica", ramos: ["Incendio y líneas aliadas", "Robo", "Equipo electrónico"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: null, textoLegible: true },
    { codigo: "DB-04", nombre: "Criterios Normas NEC", tipo: "Normativa técnica", ramos: ["Incendio y líneas aliadas", "Robo", "Equipo electrónico"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: null, textoLegible: true },
    { codigo: "DB-05", nombre: "Condiciones generales y especiales de Incendio", tipo: "Condicionado de póliza", ramos: ["Incendio y líneas aliadas"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: null, textoLegible: true },
    { codigo: "DB-06", nombre: "Condiciones generales y especiales de Robo", tipo: "Condicionado de póliza", ramos: ["Robo"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: null, textoLegible: true },
    { codigo: "DB-07", nombre: "Condiciones generales y especiales de Equipo electrónico", tipo: "Condicionado de póliza", ramos: ["Equipo electrónico"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: null, textoLegible: true },
    { codigo: "DB-08", nombre: "Procedimiento de calificación e inspección de riesgo, Ramos Generales y Técnicos (TEC.RPD.002)", tipo: "Procedimiento interno", ramos: ["Todos"], version: "05", vigenteDesde: "10/10/2024", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: null, textoLegible: true },
    { codigo: "DB-09", nombre: "Esquema de calificación (garantías)", tipo: "Matriz o catálogo", ramos: ["Todos"], version: "1", vigenteDesde: "01/08/2026", estado: "Vigente", cargadoPor: "Andrea Salazar", tambienConfiguradoEn: "Garantías y políticas › Matriz de garantías", textoLegible: true },
  ],

  // ───────────────────────────── Motores ─────────────────────────────
  motores: [
    // 1 · Clasificación de evidencias
    {
      codigo: "IA-01",
      variante: "Ramos Generales",
      motorBase: null,
      contieneDatosPersonales: false,
      motivoDatosPersonales: "Clasifica fotos del predio",
      nombre: "Clasificación de evidencias",
      tipo: "Clasificación de evidencias",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Ubicación – Ramos Generales"], ramos: ["Todos los de ubicación"], modalidades: ["Presencial", "Virtual guiada", "Documental"] },
      activador: "Al subir el set de fotos",
      entradas: [
        { tipo: "Evidencia", ref: "Set completo de fotos del informe" },
        { tipo: "Catálogo", ref: "Etiquetas de evidencia (nombre y descripción para la IA)" },
        { tipo: "Plantilla", ref: "Evidencias esperadas de los módulos activos e instancias (@edif, @bod, linderos)" },
        { tipo: "Metadatos", ref: "GPS, fecha y hora de cada foto; coordenadas del predio (rg_ubi_latitud, rg_ubi_longitud)" },
      ],
      salidas: [
        { destino: "Evidencia", dato: "Etiqueta e instancia por foto", conConfianza: true },
        { destino: "Evidencia", dato: "Leyenda propuesta (editable)", conConfianza: false },
        { destino: "Evidencia", dato: "Marcas: documento detectado, duplicada, borrosa, fuera del predio", conConfianza: true },
        { destino: "Motor IA-03", dato: "Fotos de documentos detectadas, para lectura" },
      ],
      umbrales: { asignar: 90, porConfirmar: 60 },
      umbralesMarcas: [
        { marca: "Fuera del predio", parametro: "Radio del predio", valor: 200, unidad: "m", regla: "La foto tiene GPS a más de esta distancia de rg_ubi_latitud y rg_ubi_longitud. Sin GPS: \"Sin GPS, no evaluado\"." },
        { marca: "Duplicada", parametro: null, valor: null, regla: "Misma escena que otra foto del informe; se indica cuál (\"Duplicada de F01\")." },
        { marca: "Borrosa", parametro: null, valor: null, regla: "Nitidez insuficiente para leer la escena." },
      ],
      // Cómo cuentan las fotos marcadas en la cobertura: Duplicada no suma al mínimo; Borrosa y Fuera del predio no suman salvo que
      // el inspector elija "Usar igual" con motivo; Excluida del informe nunca suma. Cambiar el radio desactualiza la prueba (R5).
      documentosBase: [],
      instrucciones: { estado: "Vacío", origen: "Sin equivalente en el kernel actual", texto: "" },
    },

    // 2 · Extracción visual
    {
      codigo: "IA-02",
      variante: "Ramos Generales",
      motorBase: null,
      contieneDatosPersonales: false,
      motivoDatosPersonales: "Extrae datos de fotos del predio",
      nombre: "Extracción visual",
      tipo: "Extracción visual",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Ubicación – Ramos Generales"], ramos: ["Todos los de ubicación"], modalidades: ["Presencial", "Virtual guiada", "Documental"] },
      activador: "Al clasificar una foto (por etiqueta)",
      entradas: [
        { tipo: "Evidencia", ref: "Fotos clasificadas, con su etiqueta e instancia" },
        { tipo: "Plantilla", ref: "Campos que respalda cada evidencia esperada y que tienen \"Elegible para IA\" = Sí" },
      ],
      salidas: [
        { destino: "Campo", regla: "Todo campo respaldado por la evidencia y con \"Elegible para IA\" = Sí", conConfianza: true, conFotoDeRespaldo: true },
      ],
      // Mapeo 4B: campo, etiquetas de evidencia que lo respaldan y criterio de Scoring V3 que alimenta
      mapeo: [
        { clave: "rg_lin_tipo_riesgo", etiquetas: "Lindero", criterio: "B.4 Linderos" },
        { clave: "rg_lin_tipo_estructura", etiquetas: "Lindero", criterio: null },
        { clave: "rg_con_conservacion", etiquetas: "Fachada", criterio: "A.3 Estado" },
        { clave: "rg_con_paredes", etiquetas: "Fachada", criterio: "A.1 Paredes" },
        { clave: "rg_con_techo", etiquetas: "Cubierta interior", criterio: "A.2 Techos" },
        { clave: "rg_con_estructura", etiquetas: "Estructura y entrepisos", criterio: null },
        { clave: "rg_con_medios_egreso", etiquetas: "Medios de egreso; Señalización de evacuación", criterio: "A.5 Medios de egreso" },
        { clave: "rg_ele_chk_01", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_02", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_03", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_04", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_05", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_06", etiquetas: "Tablero principal abierto; Puesta a tierra", criterio: null },
        { clave: "rg_ele_chk_07", etiquetas: "Tablero principal abierto; Tablero secundario; Señalización y procedimientos", criterio: null },
        { clave: "rg_ele_chk_08", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_09", etiquetas: "Tablero principal abierto; Tablero secundario", criterio: null },
        { clave: "rg_ele_chk_15", etiquetas: "Señalización y procedimientos", criterio: null },
        { clave: "rg_ele_chk_16", etiquetas: "Tablero principal abierto", criterio: null },
        { clave: "rg_ele_chk_17", etiquetas: "Tablero principal abierto", criterio: null },
        { clave: "rg_pci_extintores · columna Estado del manómetro", etiquetas: "Extintor", criterio: "C.2 Extintores" },
        { clave: "rg_pci_ext_senalizados", etiquetas: "Extintor", criterio: null },
        { clave: "rg_pci_det_tipo", etiquetas: "Detectores y central", criterio: null },
        { clave: "rg_ges_orden_aseo", etiquetas: "Orden y aseo", criterio: "B.2 Orden y aseo" },
        { clave: "rg_rob_cerramiento", etiquetas: "Cerramiento", criterio: "C.5 Seguridad física" },
        { clave: "rg_rob_puertas", etiquetas: "Puertas de acceso", criterio: null },
        { clave: "rg_rob_ventanas", etiquetas: "Ventanas", criterio: null },
        { clave: "rg_rob_cctv_cobertura", etiquetas: "Cámaras", criterio: null },
        { clave: "rg_dyv_resguardo", etiquetas: "Caja fuerte", criterio: null },
        { clave: "rg_ee_cuarto_humedad", etiquetas: "Cuarto técnico", criterio: "C.9 Ambiente del cuarto técnico" },
        { clave: "rg_ocu_carga_combustible", etiquetas: "Bodega; Línea de proceso; Área de combustibles", criterio: null },
        { clave: "rg_alm_tipo", etiquetas: "Bodega", criterio: null },
        { clave: "rg_alm_separacion_techo", etiquetas: "Apilamiento", criterio: null },
        { clave: "rg_alm_pasillos_libres", etiquetas: "Bodega", criterio: null },
        { clave: "rg_maq_protecciones", etiquetas: "Maquinaria", criterio: null },
        { clave: "rg_cmb_glp_ubicacion", etiquetas: "Cilindros de GLP", criterio: null },
      ],
      sinValor: "Si el motor indica \"No visible\", el campo queda vacío con la nota \"No visible en las fotos\"; nunca se escribe como valor.",
      excluidos: "Campos de tipo Texto (los redacta IA-05) y rg_ele_chk_10 a rg_ele_chk_13 (procedimientos, no visibles en foto).",
      umbrales: { asignar: 90, porConfirmar: 60 },
      documentosBase: [{ codigo: "DB-03", obligatorio: true }, { codigo: "DB-04", obligatorio: true }],
      instrucciones: {
        estado: "Borrador",
        origen: "Kernel actual · Fase 1 (ajustado en asesoría, v1.5)",
        texto:
          "Analiza cada foto con su etiqueta y propone el valor de los campos que esa evidencia respalda.\n" +
          "Búsqueda activa: cables expuestos, empalmes improvisados, tableros sin tapa, cilindros o tanques de GLP, puntos ciegos de CCTV, cerramientos dañados; estado de los manómetros de los extintores.\n" +
          "Usa solo las opciones de cada campo. Si la foto no permite determinar el valor, no propongas ninguno: indica \"No visible\" con el motivo. No inventes datos.\n" +
          "Para cada valor indica tu confianza y la foto que lo respalda.",
      },
    },

    // 3 · Lectura de documentos
    {
      codigo: "IA-03",
      variante: "Ramos Generales",
      motorBase: null,
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Los documentos pueden traer nombres y números de identificación",
      nombre: "Lectura de documentos",
      tipo: "Lectura de documentos",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Ubicación – Ramos Generales"], ramos: ["Todos los de ubicación"], modalidades: ["Todas"] },
      activador: "Al subir un documento o al detectarse una foto de documento",
      entradas: [
        { tipo: "Documento", ref: "Permiso de bomberos, plan de emergencia, bitácoras, planos, certificados, listados valorados" },
        { tipo: "Plantilla", ref: "Campos que respalda cada documento" },
      ],
      salidas: [
        { destino: "Campo", clave: "rg_bom_permiso", conConfianza: true },
        { destino: "Campo", clave: "rg_bom_vigencia", conConfianza: true },
        { destino: "Campo", clave: "rg_ges_plan_emergencia", conConfianza: true },
        { destino: "Campo", clave: "rg_ele_mantenimiento", conConfianza: true },
        { destino: "Campo", clave: "rg_ele_ultima_termografia", conConfianza: true },
        { destino: "Campo", clave: "rg_ele_chk_14", conConfianza: true },
        { destino: "Grilla", clave: "rg_ee_equipos", conConfianza: true },
        { destino: "Grilla", clave: "rg_maq_equipos", conConfianza: true },
        { destino: "Grilla", clave: "rg_pci_extintores · columna Fecha de última recarga", conConfianza: true },
        { destino: "Campo", clave: "rg_pci_ext_mantenimiento", conConfianza: true },
        { destino: "Campo", clave: "rg_ges_brigadas", conConfianza: true },
        { destino: "Campo", clave: "rg_ges_simulacros", conConfianza: true },
        { destino: "Campo", clave: "rg_trc_tipo_obra", conConfianza: true },
        { destino: "Campo", clave: "rg_trc_area", conConfianza: true },
        { destino: "Campo", clave: "rg_trc_fecha_inicio", conConfianza: true },
        { destino: "Campo", clave: "rg_trc_fecha_fin", conConfianza: true },
        { destino: "Campo", clave: "rg_ee_plan_mantenimiento", conConfianza: true },
        { destino: "Campo", clave: "rg_maq_mantenimiento", conConfianza: true },
        { destino: "Campo", clave: "rg_maq_ultimo_mantenimiento", conConfianza: true },
        { destino: "Documento", dato: "Texto transcrito, visible en el visor" },
      ],
      // Mapeo 4B: documentos esperados. Semilla para la plantilla: se cargan en "Documentos" de cada sección indicada
      // y desde ahí los lee IA-03 (fuente única: la plantilla). Ninguno es requerido: la exigencia la da la matriz de garantías.
      documentosEsperados: [
        { documento: "Planos eléctricos", secciones: ["Sistema eléctrico › Lista de verificación"], campos: ["rg_ele_chk_14"], requerido: false },
        { documento: "Informe de termografía o mantenimiento eléctrico", secciones: ["Sistema eléctrico › Mantenimiento"], campos: ["rg_ele_mantenimiento", "rg_ele_ultima_termografia"], requerido: false },
        { documento: "Certificado de mantenimiento y recarga de extintores", secciones: ["Protección contra incendios › Extintores"], campos: ["rg_pci_ext_mantenimiento", "rg_pci_extintores · columna Fecha de última recarga"], requerido: false },
        { documento: "Plan de emergencia", secciones: ["Planes de gestión › Plan de emergencia y brigadas"], campos: ["rg_ges_plan_emergencia"], requerido: false },
        { documento: "Registro de brigadas y simulacros", secciones: ["Planes de gestión › Plan de emergencia y brigadas"], campos: ["rg_ges_brigadas", "rg_ges_simulacros"], requerido: false },
        { documento: "Permiso de bomberos", secciones: ["Cuerpo de bomberos › Permiso de funcionamiento"], campos: ["rg_bom_permiso", "rg_bom_vigencia"], requerido: false },
        { documento: "Listado detallado y valorado de bienes", seguimiento: "DOC-02", secciones: ["Equipo electrónico › Inventario", "Maquinaria › Equipos"], campos: ["rg_ee_equipos", "rg_maq_equipos"], requerido: false },
        { documento: "Bitácoras y cronograma de mantenimientos", seguimiento: "DOC-01", secciones: ["Equipo electrónico › Mantenimiento y continuidad", "Maquinaria › Mantenimiento y operación"], campos: ["rg_ee_plan_mantenimiento", "rg_maq_mantenimiento", "rg_maq_ultimo_mantenimiento"], requerido: false },
        { documento: "Permiso de construcción", secciones: ["Todo riesgo construcción › Datos de la obra"], campos: ["rg_trc_tipo_obra"], requerido: false },
        { documento: "Cronograma de obra", secciones: ["Todo riesgo construcción › Datos de la obra"], campos: ["rg_trc_fecha_inicio", "rg_trc_fecha_fin"], requerido: false, nota: "El avance real (rg_trc_avance) lo registra el inspector con la evidencia Frente de obra; el cronograma solo da lo planificado." },
        { documento: "Especificaciones técnicas", secciones: ["Todo riesgo construcción › Datos de la obra"], campos: ["rg_trc_tipo_obra", "rg_trc_area"], requerido: false },
      ],
      umbrales: { asignar: 90, porConfirmar: 60 },
      // Deciden si la garantía "Permiso de bomberos vigente del año en curso" se marca "Ya cumple"
      umbralesPorCampo: [
        { clave: "rg_bom_permiso", asignar: 95, porConfirmar: 70 },
        { clave: "rg_bom_vigencia", asignar: 95, porConfirmar: 70 },
      ],
      documentosBase: [],
      instrucciones: {
        estado: "Borrador",
        origen: "Kernel actual · Fase 1 (lectura de vigencias e indicadores)",
        texto:
          "Lee el documento, identifica su tipo y extrae los datos de los campos que respalda: emisor, fechas de emisión y vencimiento, vigencia, responsables y valores.\n" +
          "En listados de bienes, devuelve una fila por bien con sus columnas.\n" +
          "Si un dato no es legible, indícalo como no legible; nunca lo completes por inferencia.",
      },
    },

    // 4 · Contexto externo
    {
      codigo: "IA-04",
      variante: "Ramos Generales",
      motorBase: null,
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Consulta el representante legal por CNX-03",
      nombre: "Contexto externo",
      tipo: "Contexto externo",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: null,
      conexionesRequeridas: ["CNX-03", "CNX-04"],
      alcance: { plantillas: ["Ubicación – Ramos Generales"], ramos: ["Todos los de ubicación"], modalidades: ["Todas"] },
      activador: "Al abrir el informe",
      entradas: [
        { tipo: "Solicitud", ref: "RUC, provincia, cantón y dirección" },
        { tipo: "Campo", ref: "rg_ubi_latitud y rg_ubi_longitud" },
      ],
      salidas: [
        { destino: "Campo", clave: "rg_gen_representante_legal", fuente: "CNX-03 Superintendencia de Compañías (SCVS)" },
        { destino: "Campo", clave: "rg_gen_objeto_social", fuente: "CNX-03 Superintendencia de Compañías (SCVS)" },
        { destino: "Campo", clave: "rg_gen_fecha_constitucion", fuente: "CNX-03 Superintendencia de Compañías (SCVS)" },
        { destino: "Campo", clave: "rg_gen_situacion_legal", fuente: "CNX-03 Superintendencia de Compañías (SCVS)" },
        { destino: "Campo", clave: "rg_ubi_altitud", fuente: "CNX-04 Servicio de mapas" },
        { destino: "Evidencia", etiqueta: "ev_mapa_amenaza", porInstancia: "amenaza", fuente: "Catálogo de mapas de amenaza (Catálogos maestros): una fuente por amenaza, con el punto del predio", nota: "v1.14 · DEC-070. Solo para amenazas con exposición registrada" },
        { destino: "Evidencia", etiqueta: "ev_ruta_bomberos", fuente: "CNX-04 Servicio de mapas", nota: "v1.14 · DEC-070. Ruta del predio a rg_bom_estacion" },
        { destino: "Evidencia", etiqueta: "ev_ruta_upc", fuente: "CNX-04 Servicio de mapas", nota: "v1.14 · DEC-070. Ruta del predio a rg_rob_upc_nombre" },
        { destino: "Campo", clave: "rg_ubi_dist_mar", fuente: "Cálculo geográfico (interno)" },
        { destino: "Campo", clave: "rg_ubi_dist_rio", fuente: "Cálculo geográfico (interno)" },
        { destino: "Campo", clave: "rg_nat_zona_sismica", fuente: "Catálogo NEC por cantón (interno)" },
        { destino: "Campo", clave: "rg_bom_estacion, rg_bom_distancia, rg_bom_tiempo", fuente: "CNX-04 Servicio de mapas" },
        { destino: "Campo", clave: "rg_rob_upc_nombre, rg_rob_upc_distancia, rg_rob_upc_tiempo", fuente: "CNX-04 Servicio de mapas" },
        { destino: "Grilla", clave: "rg_sin_siniestros", fuente: "CNX-02 Base de siniestralidad del mercado", opcional: true },
      ],
      conexionesOpcionales: ["CNX-02"],
      reglasSalida: [
        "Distancias y tiempos (rg_bom_distancia, rg_bom_tiempo, rg_rob_upc_distancia, rg_rob_upc_tiempo): se elige la opción cuyo rango contiene el valor y se muestra el número como respaldo, con su fuente (\"2,4 km · Servicio de mapas\").",
        "Siniestralidad (rg_sin_siniestros): integración opcional. Si CNX-02 no está configurada o no responde, el inspector registra los siniestros a mano o usa rg_sin_declarado. El dato no bloquea el informe ni el envío, no alimenta criterios de calificación y no genera alerta de dato faltante.",
      ],
      nota: "No usa modelo de lenguaje. Sus fuentes externas son conexiones (CNX-03 SCVS y CNX-04 Servicio de mapas, requeridas; CNX-02 siniestralidad, opcional) que se configuran al final del proyecto. Mientras una conexión no esté configurada o no responda, sus campos quedan para captura manual y el informe nunca se bloquea. El cálculo geográfico y el catálogo NEC son internos.",
      documentosBase: [],
      instrucciones: { estado: "No aplica", origen: "Son fuentes de datos, no instrucciones", texto: "" },
    },

    // 5 · Redacción
    {
      codigo: "IA-05",
      variante: "Ramos Generales",
      motorBase: null,
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Recibe el informe completo, incluido el representante legal",
      nombre: "Redacción del informe",
      tipo: "Redacción",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Ubicación – Ramos Generales"], ramos: ["Todos los de ubicación"], modalidades: ["Todas"] },
      activador: "Botón \"Generar informe\"",
      entradas: [
        { tipo: "Campo", ref: "Todos los campos del informe, con su valor, origen y evidencia" },
        { tipo: "Calificación", ref: "Criterios marcados como agravantes y atenuantes por la fórmula del sistema, sin puntajes ni bandas (solo lectura)" },
        { tipo: "Notas", ref: "Notas del inspector por capítulo" },
        { tipo: "Evidencia", ref: "Leyendas de las fotos marcadas \"Incluir en el informe\"" },
      ],
      salidas: [
        { destino: "Campo", clave: "rg_gen_perfil" },
        { destino: "Campo", clave: "rg_con_descripcion@<edificación>" },
        { destino: "Campo", clave: "rg_con_observaciones@<edificación>" },
        { destino: "Campo", clave: "rg_nat_descripcion@<amenaza>" },
        { destino: "Campo", clave: "rg_lin_descripcion@<lindero>" },
        { destino: "Campo", clave: "rg_pro_descripcion" },
        { destino: "Campo", clave: "rg_pmp_escenario@<escenario>" },
        { destino: "Campo", clave: "rg_cnc_agravantes (texto)" },
        { destino: "Campo", clave: "rg_cnc_atenuantes (texto)" },
        { destino: "Campo", clave: "rg_cnc_resumen" },
        // v1.14 · ajuste F3 (DEC-067): observaciones por capítulo
        { destino: "Campo", clave: "rg_lin_observaciones" },
        { destino: "Campo", clave: "rg_nat_observaciones" },
        { destino: "Campo", clave: "rg_ocu_observaciones" },
        { destino: "Campo", clave: "rg_alm_observaciones" },
        { destino: "Campo", clave: "rg_cmb_observaciones" },
        { destino: "Campo", clave: "rg_ee_observaciones" },
        { destino: "Campo", clave: "rg_ele_observaciones" },
        { destino: "Campo", clave: "rg_rob_observaciones" },
        { destino: "Campo", clave: "rg_pci_observaciones" },
        { destino: "Campo", clave: "rg_ges_observaciones" },
        { destino: "Campo", clave: "rg_bom_observaciones" },
        { destino: "Campo", clave: "rg_sin_observaciones" },
        { destino: "Plantilla de salida", dato: "Texto de las secciones narrativas de la plantilla de salida (BO-27)" },
      ],
      controles: [
        "Todo texto lleva \"Propuesto por IA\" hasta que una persona lo acepta o edita.",
        "Toda cifra citada se valida contra su campo antes de mostrarse.",
        "No recibe la escala de decisión ni asigna puntajes ni bandas.",
        "No cita puntajes, bandas ni niveles del modelo; un texto que los cite se retiene.",
        "Al enviar el informe no se genera texto: solo se validan las cifras citadas y se marca \"Texto desactualizado\" en todo texto aceptado cuyos datos cambiaron después de aceptarlo.",
      ],
      documentosBase: [{ codigo: "DB-03", obligatorio: true }, { codigo: "DB-04", obligatorio: true }, { codigo: "DB-05", obligatorio: false }, { codigo: "DB-06", obligatorio: false }, { codigo: "DB-07", obligatorio: false }, { codigo: "DB-08", obligatorio: true }],
      instrucciones: {
        estado: "Borrador",
        origen: "Kernel actual · Fases 2 y 3 (sin cálculo de puntaje ni formato del PDF)",
        texto:
          "Actúa como inspector de riesgos senior de Aseguradora del Sur en Ecuador.\n" +
          "Redacta cada sección con los datos del informe, sin agregar hechos que no estén en los campos, las notas o las evidencias.\n" +
          "Para cada hallazgo relevante: (1) análisis técnico contra las guías NFPA y NEC; (2) relevancia para la póliza según las condiciones generales y especiales del ramo.\n" +
          "Antecedentes: fecha, entrevistado y cargo, dirección y coordenadas. Actividad: giro, horarios y procesos. Infraestructura: construcción (antigüedad, materialidad, conservación y obras de mitigación si existen) e instalaciones (tableros, transformadores, gas).\n" +
          "Linderos: describe cada punto cardinal y su riesgo. Agravantes y atenuantes: usa los criterios que el sistema marcó en esos niveles.\n" +
          "Conclusiones: balance técnico de construcción, protecciones y entorno.\n" +
          "Observaciones de cada capítulo: describe lo evidenciado (datos, fotos y documentos), las brechas frente a la norma y su efecto sobre el riesgo, en un párrafo de 3 a 6 oraciones. No repitas la tabla de datos.\n" +
          "No cites puntajes, bandas ni niveles del modelo: el informe del inspector no los muestra.",
      },
      descartadoDelKernel: [
        "Cálculo del puntaje (lo hace el modelo de calificación)",
        "Formato, colores y maquetación del PDF (plantilla de salida, BO-27)",
        "Datos fijos de casos anteriores: ramos fijos, marca INATRA, playas, muros de contención",
      ],
    },

    // 6 · Asistente de calificación
    {
      codigo: "IA-06",
      variante: "Ramos Generales",
      motorBase: null,
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Recibe el informe completo, incluido el representante legal",
      nombre: "Asistente de calificación",
      tipo: "Asistente de calificación",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Ubicación – Ramos Generales"], ramos: ["Todos los de ubicación"], modalidades: ["Todas"] },
      activador: "Al abrir la calificación",
      visibleSolo: ["Ejecutivo de inspecciones", "Suscriptor", "Administrador"],
      entradas: [
        { tipo: "Informe", ref: "Informe completo con textos aceptados" },
        { tipo: "Calificación", ref: "Puntaje por ramo, banda, reglas de severidad, alertas de política y propuesta de garantías calculada (solo lectura)" },
        { tipo: "Catálogo", ref: "Catálogo de seguimientos" },
      ],
      salidas: [
        { destino: "Calificación (propuesta)", dato: "Veredicto sugerido con resumen técnico" },
        { destino: "Calificación (propuesta)", dato: "Garantías adicionales del catálogo, con justificación y evidencia" },
        { destino: "Calificación (propuesta)", dato: "Recomendaciones de mejora" },
        { destino: "Calificación (propuesta)", dato: "Preexistencias observadas" },
        { destino: "Calificación (propuesta)", dato: "Propuestas de \"No aplica\" con motivo" },
      ],
      controles: [
        "Solo propone: el calificador acepta, edita o descarta cada propuesta y queda registrado.",
        "No puede quitar garantías exigidas por la matriz, la severidad o las políticas.",
      ],
      documentosBase: [{ codigo: "DB-01", obligatorio: false }, { codigo: "DB-05", obligatorio: false }, { codigo: "DB-06", obligatorio: false }, { codigo: "DB-07", obligatorio: false }, { codigo: "DB-08", obligatorio: true }, { codigo: "DB-09", obligatorio: false }],
      instrucciones: {
        estado: "Borrador",
        origen: "Kernel actual · Fase 4 (sin el umbral \"menos de 25\"; ajustado en asesoría, v1.5)",
        texto:
          "Actúa como gerente de suscripción de Aseguradora del Sur.\n" +
          "Con el informe, la calificación calculada, las alertas de política y la propuesta de garantías, entrega: (1) veredicto de asegurabilidad sugerido; (2) resumen técnico del riesgo; (3) plan de acción; (4) preexistencias observadas, con su evidencia; (5) propuestas de \"No aplica\" con su motivo.\n" +
          "Separa las GARANTÍAS (obligatorias para emitir: incumplimientos críticos o condiciones para levantar exclusiones relativas) de las RECOMENDACIONES (opcionales, de mejora).\n" +
          "Propón garantías adicionales solo del catálogo y justifica cada una con un hallazgo y su evidencia.\n" +
          "Respeta el resultado calculado por el sistema y las políticas: no cambies puntajes ni bandas.",
      },
    },

    // ───────────── Variantes de Vehículos livianos (v1.13 · DEC-048) ─────────────
    // 7 · Extracción visual · Vehículos livianos
    {
      codigo: "IA-02-VL",
      variante: "Vehículos livianos",
      motorBase: "IA-02",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Lee placa y VIN, que se vinculan con el propietario",
      nombre: "Extracción visual",
      tipo: "Extracción visual",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Vehículos livianos"], ramos: ["Vehículos"], modalidades: ["Presencial", "Virtual guiada", "Autoinspección", "Documental"] },
      activador: "Al recibir una foto de la captura guiada (por etiqueta)",
      entradas: [
        { tipo: "Evidencia", ref: "Fotos de la captura guiada, con su etiqueta (Placa, VIN, Tablero, Daños, Extras, Neumáticos)" },
        { tipo: "Plantilla", ref: "Campos elegibles del alcance (elegibilidadPorAlcance) que respalda cada foto" },
      ],
      grupos: ["Placa", "VIN", "Tablero", "Daños", "Extras", "Neumáticos"],
      salidas: [
        { grupo: "Placa", destino: "Campo", clave: "veh_placa", rol: "Contraste", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "VIN", destino: "Campo", clave: "veh_vin", rol: "Contraste", conConfianza: true, conFotoDeRespaldo: true, nota: "Lectura del sticker VIN o de la plaqueta" },
        { grupo: "Placa", destino: "Campo", clave: "veh_color", rol: "Respaldo", conConfianza: true, conFotoDeRespaldo: true, nota: "Foto exterior con la placa" },
        { grupo: "Tablero", destino: "Campo", clave: "veh_kilometraje", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_check_engine", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_abs", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_airbag", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_presion_aceite", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_bateria", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_temperatura", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Tablero", destino: "Campo", clave: "veh_testigo_frenos", rol: "Principal", conConfianza: true, conFotoDeRespaldo: true },
        { grupo: "Daños", destino: "Grilla", clave: "veh_averias", columnas: ["Pieza", "Tipo de daño", "Gravedad", "Superficie (dm²)", "Foto"], rol: "Principal", conConfianza: true, nota: "Origen lo marca el inspector" },
        { grupo: "Extras", destino: "Grilla", clave: "veh_extras", columnas: ["Descripción", "Marca", "Foto"], rol: "Principal", conConfianza: true, nota: "Valor (USD) lo ingresa el inspector" },
        { grupo: "Neumáticos", destino: "Grilla", clave: "veh_neumaticos", columnas: ["Marca", "Medida", "Labrado (mm)", "Foto"], rol: "Principal", conConfianza: true, nota: "Posición son filas fijas; Labrado solo con calibrador visible" },
      ],
      reglasSalida: [
        "En grillas, \"Foto\" enlaza la foto que respalda la fila; no lleva confianza propia.",
        "Averías: una fila por pieza, sin duplicados; si dos fotos muestran la misma pieza, se une en una fila con las dos fotos.",
        "Un valor fuera de las opciones del campo no se propone: queda \"No visible\" con el motivo \"Valor fuera del catálogo: [valor leído]\".",
      ],
      umbrales: { asignar: 90, porConfirmar: 60 },
      umbralesPorCampo: [
        { clave: "veh_placa", asignar: 95, porConfirmar: 70, validacion: "placa" },
        { clave: "veh_vin", asignar: 95, porConfirmar: 70, validacion: "vin" },
      ],
      documentosBase: [],
      instrucciones: {
        estado: "Borrador",
        origen: "Nuevo · asesoría v1.13 (sin equivalente en el kernel actual)",
        texto:
          "Analiza cada foto de la captura guiada con su etiqueta y propone el valor de los campos que esa foto respalda.\n" +
          "Placa y VIN: transcribe carácter por carácter, sin guiones ni espacios, y no completes los que no se leen. El VIN no usa I, O ni Q: si ves algo parecido, transcribe lo que ves y baja tu confianza.\n" +
          "Tablero: lee el odómetro en km y el estado de cada testigo (Encendido, Apagado o No aplica).\n" +
          "Daños: una fila por pieza con tipo de daño (rayón, abolladura, rotura, corrosión o faltante), gravedad (Baja, Media o Alta) y superficie aproximada en dm².\n" +
          "Neumáticos: marca y medida (formato 205/55 R16); el labrado solo si la foto muestra el calibrador. Extras: descripción y marca visible; nunca estimes valores.\n" +
          "Usa solo las opciones de cada campo. Si la foto no permite determinar el valor, indica \"No visible\" con el motivo. No inventes datos.\n" +
          "Para cada valor indica tu confianza y la foto que lo respalda.",
      },
    },

    // 8 · Lectura de documentos · Vehículos livianos
    {
      codigo: "IA-03-VL",
      variante: "Vehículos livianos",
      motorBase: "IA-03",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Lee matrícula, cédula y licencia: nombres, identificaciones y fecha de nacimiento",
      nombre: "Lectura de documentos",
      tipo: "Lectura de documentos",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: "CNX-01",
      alcance: { plantillas: ["Vehículos livianos"], ramos: ["Vehículos"], modalidades: ["Todas"] },
      activador: "Al subir un documento o una foto de documento (Matrícula, Cédula, Licencia)",
      entradas: [
        { tipo: "Documento", ref: "Matrícula, cédula del conductor y licencia de conducir (anverso y reverso)" },
        { tipo: "Plantilla", ref: "Campos que respalda cada documento" },
      ],
      grupos: ["Matrícula", "Cédula", "Licencia"],
      salidas: [
        { grupo: "Matrícula", destino: "Campo", clave: "veh_nombre_matricula", rol: "Principal", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_gad_matriculacion", rol: "Principal", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_anio_matricula", rol: "Principal", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_vigencia_matricula", rol: "Principal", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_identificacion_propietario", rol: "Contraste", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_placa", rol: "Contraste", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_marca", rol: "Respaldo", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_modelo", rol: "Respaldo", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_vin", rol: "Respaldo", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_numero_motor", rol: "Respaldo", conConfianza: true },
        { grupo: "Matrícula", destino: "Campo", clave: "veh_color", rol: "Contraste", conConfianza: true },
        { grupo: "Cédula", destino: "Campo", clave: "veh_cedula_conductor", rol: "Principal", conConfianza: true },
        { grupo: "Cédula", destino: "Campo", clave: "veh_nombre_conductor", rol: "Principal", conConfianza: true },
        { grupo: "Cédula", destino: "Campo", clave: "veh_edad_conductor", rol: "Principal", conConfianza: true, nota: "Años cumplidos entre la fecha de nacimiento y la fecha del reloj" },
        { grupo: "Licencia", destino: "Campo", clave: "veh_tipo_licencia", rol: "Principal", conConfianza: true },
        { grupo: "Licencia", destino: "Campo", clave: "veh_caducidad_licencia", rol: "Principal", conConfianza: true },
        { destino: "Documento", dato: "Texto transcrito, visible en el visor" },
      ],
      documentosEsperados: [
        { documento: "Matrícula", secciones: ["Matrícula y propietario", "Identificación del vehículo"], campos: ["veh_nombre_matricula", "veh_identificacion_propietario", "veh_gad_matriculacion", "veh_anio_matricula", "veh_vigencia_matricula", "veh_placa", "veh_marca", "veh_modelo", "veh_vin", "veh_numero_motor", "veh_color"], requerido: false },
        { documento: "Cédula del conductor", secciones: ["Uso y conductor"], campos: ["veh_cedula_conductor", "veh_nombre_conductor", "veh_edad_conductor"], requerido: false, visibleSi: "veh_conductor_habitual = Otra persona" },
        { documento: "Licencia de conducir", secciones: ["Uso y conductor"], campos: ["veh_tipo_licencia", "veh_caducidad_licencia"], requerido: false },
      ],
      reglasSalida: [
        "Un campo oculto por su condición (\"Visible si\") no recibe propuesta; la lectura queda en el visor del documento.",
        "Licencia: el número leído se contrasta con la cédula del titular (validación \"licencia\"); no se guarda en un campo propio.",
        "Un valor fuera de las opciones del campo no se propone: queda \"No legible\" con el motivo \"Valor fuera del catálogo: [valor leído]\".",
      ],
      umbrales: { asignar: 90, porConfirmar: 60 },
      umbralesPorCampo: [
        { clave: "veh_identificacion_propietario", asignar: 95, porConfirmar: 70, validacion: "cedulaORuc" },
        { clave: "veh_cedula_conductor", asignar: 95, porConfirmar: 70, validacion: "cedula" },
        { clave: "veh_placa", asignar: 95, porConfirmar: 70, validacion: "placa" },
        { clave: "veh_vin", asignar: 95, porConfirmar: 70, validacion: "vin" },
        { clave: "veh_numero_motor", asignar: 95, porConfirmar: 70 },
        { clave: "veh_tipo_licencia", asignar: 90, porConfirmar: 60, validacion: "licencia" },
        { clave: "veh_caducidad_licencia", asignar: 90, porConfirmar: 60, validacion: "caducidad" },
        { clave: "veh_vigencia_matricula", asignar: 90, porConfirmar: 60, validacion: "caducidad" },
      ],
      documentosBase: [],
      instrucciones: {
        estado: "Borrador",
        origen: "Nuevo · asesoría v1.13 (sin equivalente en el kernel actual)",
        texto:
          "Identifica el tipo de documento (Matrícula, Cédula o Licencia) y extrae los datos de los campos que respalda.\n" +
          "Matrícula: propietario, identificación, GAD, año, fecha de caducidad, placa, VIN, motor, marca, modelo y color. Cédula: número, nombres y apellidos, fecha de nacimiento. Licencia: número, categoría y fecha de caducidad.\n" +
          "Transcribe números e identificaciones carácter por carácter, sin guiones ni espacios.\n" +
          "Usa solo las opciones de cada campo. Si un dato no es legible, indícalo como no legible; nunca lo completes por inferencia.",
      },
    },

    // 9 · Contexto externo · Vehículos livianos
    {
      codigo: "IA-04-VL",
      variante: "Vehículos livianos",
      motorBase: "IA-04",
      contieneDatosPersonales: true,
      motivoDatosPersonales: "Consulta denuncias, licencia y valores por placa y cédula",
      nombre: "Contexto externo",
      tipo: "Contexto externo",
      version: "1",
      estado: "Borrador",
      versiones: [{ version: "1", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
      conexion: null,
      conexionesRequeridas: ["CNX-05", "CNX-06", "CNX-07", "CNX-08"],
      conexionesOpcionales: ["CNX-02"],
      alcance: { plantillas: ["Vehículos livianos"], ramos: ["Vehículos"], modalidades: ["Todas"] },
      activador: "Al registrar o cambiar la placa; las consultas por cédula, al registrar o cambiar la identificación",
      entradas: [
        { tipo: "Campo", ref: "veh_placa (normalizada y validada)" },
        { tipo: "Campo", ref: "veh_identificacion_propietario, veh_cedula_conductor" },
      ],
      salidas: [
        { destino: "Campo", clave: "veh_marca", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_modelo", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_anio_modelo", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_vin", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_numero_motor", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_tipo_carroceria", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_clase", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_color", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_pais_origen", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_cilindraje", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_pasajeros", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_camv_cpn", rol: "Principal", fuente: "CNX-05 Datos del vehículo por placa" },
        { destino: "Campo", clave: "veh_puntos_licencia", rol: "Principal", fuente: "CNX-06 Agencia Nacional de Tránsito (ANT)" },
        { destino: "Grilla", clave: "veh_verificaciones_externas", fila: "Fiscalía por placa", columnas: ["Resultado", "Fecha y hora", "Forma", "Observación"], rol: "Principal", fuente: "CNX-07 Fiscalía General del Estado" },
        { destino: "Grilla", clave: "veh_verificaciones_externas", fila: "Fiscalía por cédula", columnas: ["Resultado", "Fecha y hora", "Forma", "Observación"], rol: "Principal", fuente: "CNX-07 Fiscalía General del Estado" },
        { destino: "Grilla", clave: "veh_verificaciones_externas", fila: "ANT", columnas: ["Resultado", "Fecha y hora", "Forma", "Observación"], rol: "Principal", fuente: "CNX-06 Agencia Nacional de Tránsito (ANT)" },
        { destino: "Grilla", clave: "veh_verificaciones_externas", fila: "SRI", columnas: ["Resultado", "Fecha y hora", "Forma", "Observación"], rol: "Principal", fuente: "CNX-08 Servicio de Rentas Internas (SRI)" },
        { destino: "Grilla", clave: "veh_verificaciones_externas", fila: "Siniestralidad", columnas: ["Resultado", "Fecha y hora", "Forma", "Observación"], rol: "Principal", fuente: "CNX-02 Base de siniestralidad del mercado", opcional: true },
        { destino: "Grilla", clave: "veh_verificaciones_externas", fila: "Codificación del VIN", columnas: ["Resultado", "Fecha y hora", "Forma", "Observación"], rol: "Principal", fuente: "Decodificación WMI (interno)" },
      ],
      reglasSalida: [
        "En veh_verificaciones_externas la regla \"un campo, un motor\" se aplica por fila y columna.",
        "Resultado: \"Sin novedad\", \"Con novedad\" o \"Servicio no disponible\". Forma: \"Automática\" cuando la escribe este motor y \"Manual\" cuando la registra una persona. Fecha y hora: la de la consulta (reloj del prototipo). Con novedad, la Observación lleva el detalle de la fuente.",
        "Si una conexión no responde o no está configurada, su fila queda \"Servicio no disponible\" y se puede registrar a mano; nunca bloquea el informe.",
        "Siniestralidad (CNX-02) es opcional: sin conexión, la fila queda para registro manual y no genera alerta.",
        "Codificación del VIN: \"Con novedad\" si el fabricante o el país del WMI no coinciden con veh_marca o veh_pais_origen. Un WMI que no está en el catálogo: \"Servicio no disponible\" con la observación \"WMI no registrado en el catálogo\".",
        "Un valor de la fuente que no es una opción del campo (marca, modelo, color…) no se escribe: el campo queda vacío y \"Por confirmar\" con la nota \"Valor recibido: [valor] · fuera del catálogo\".",
        "Fiscalía con novedad por placa (denuncia de robo) genera la alerta \"Vehículo con denuncia\" en el informe.",
      ],
      validacionesPorCampo: [
        { clave: "veh_vin", validacion: "vin" },
      ],
      nota: "No usa modelo de lenguaje. Sus fuentes son conexiones (CNX-05 a CNX-08 requeridas; CNX-02 opcional) que se configuran al final del proyecto. Mientras una conexión no esté configurada o no responda, sus campos quedan para captura manual y el informe nunca se bloquea. La decodificación WMI es interna.",
      documentosBase: [],
      instrucciones: { estado: "No aplica", origen: "Son fuentes de datos, no instrucciones", texto: "" },
    },
  ],

  // ───────────────────── Demostración (anexo 8.5) ─────────────────────
  // Solo mientras está activa; no escribe estos datos en los motores. Al desactivarla o recargar, IA-02 vuelve a su estado real.
  demos: [
    {
      id: "ia02v2",
      nombre: "IA-02 versión 2 lista para publicar",
      motor: "IA-02",
      etiqueta: "Demostración",
      nota: "Solo en el prototipo",
      simula: {
        conexion: { codigo: "CNX-01", estado: "Configurada" },
        versiones: [
          { version: "1", estado: "Vigente", vigenteDesde: "01/10/2026", publicadaPor: "Andrea Salazar", motivo: "Primera versión desde el kernel actual", precisionPrueba: 86 },
          { version: "2", estado: "Borrador", vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: 91 },
        ],
        instruccionesV1: "Texto del kernel original (v1.4): incluye \"indicadores de vigencia\" y \"Información no visible\".",
        instruccionesV2: "Texto vigente de IA-02 en este archivo (v1.5).",
        requisitos: { R1: "Cumple", R2: "Cumple", R3: "Cumple", R4: "Cumple", R5: "Cumple" },
        alConfirmar: "La v2 pasa a Vigente desde la fecha elegida, la v1 a Dada de baja y se registra en el Historial de cambios con el motivo. Al recargar, vuelve al estado inicial.",
      },
    },
  ],
};
