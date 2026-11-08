// SIRIUS · Matriz de garantías (BO-26) · v1.1 · reproduce el "Esquema de calificación" vigente
// Preparado en asesoría el 22/10/26 (v1) y el 29/10/26 (v1.1, inicio de la etapa 6). Solo datos: reemplaza por completo la matriz actual.
// v1.1: fuente DB-09; tramos con límites numéricos; aviso de N/A; bloque sustituciones (su1 corregida: la detección sustituye solo a los
//   detectores; los extintores se mantienen); aviso de ítem no encontrado; Robo por código GAR-ROB-01 a 08; ramo "Todo riesgo construcción".
// Fuente única de la matriz y de las sustituciones: reemplaza a matrizGarantias y reglasSustitucion de datos-ejemplo.js.
// Referencia por título exacto del catálogo; el código es el que ya existe en el catálogo.
// "na: true" = N/A explícito. Celda sin items y sin na = sin garantía mínima.

window.SIRIUS_MATRIZ_GARANTIAS = {
  compania: "Aseguradora del Sur",
  version: "1.1",
  fuente: "Esquema de calificación (DB-09)",
  avisos: {
    na: "Combinación ramo y giro no prevista en el esquema",          // informativo, no bloquea
    itemNoEncontrado: "Ítem no encontrado en el catálogo",
  },
  giros: ["Casa habitación", "Edificios", "HORECA", "Educación", "Comercial", "Servicios", "Construcción", "Industrial", "Estación de servicios", "Cooperativas"],

  // Ítems usados (título exacto del catálogo)
  items: {
    PERMISO: { codigo: "GAR-INC-01", titulo: "Permiso de bomberos vigente del año en curso" },
    EXTINTORES: { codigo: "GAR-INC-02", titulo: "Extintores vigentes y recargados" },
    DETECCION: { codigo: "GAR-INC-03", titulo: "Sistema de detección y alarma contra incendio" },
    DETECTORES: { codigo: "GAR-INC-04", titulo: "Detectores de humo" },
    RED_HIDRICA: { codigo: "GAR-INC-05", titulo: "Red hídrica" },
    ROCIADORES: { codigo: "GAR-INC-06", titulo: "Rociadores" },
    GUARDIANIA: { codigo: "GAR-ROB-01", titulo: "Guardianía" },
    GUARDIA_8H: { codigo: "GAR-ROB-02", titulo: "Guardianía armada 8 horas laborables" },
    GUARDIA_24: { codigo: "GAR-ROB-03", titulo: "Guardianía armada 24/7" },
    CCTV: { codigo: "GAR-ROB-04", titulo: "CCTV" },
    ALARMA: { codigo: "GAR-ROB-05", titulo: "Alarma contra robo" },
    MONITOREO: { codigo: "GAR-ROB-06", titulo: "Monitoreo y respuesta armada" },
    SENSORES_MOV: { codigo: "GAR-ROB-07", titulo: "Sensores de movimiento" },
    SENSORES_PV: { codigo: "GAR-ROB-08", titulo: "Sensores en puertas y ventanas" },
    VIDRIOS: { codigo: "GAR-DYV-01", titulo: "Vidrios blindados en el área de caja" },
    PANICO: { codigo: "GAR-DYV-02", titulo: "Botón de pánico" },
    CAJA_FUERTE: { codigo: "GAR-DYV-03", titulo: "Caja fuerte empotrada al piso o pared" },
    RESGUARDO: { codigo: "GAR-DYV-04", titulo: "Resguardo policial para el traslado de dinero" },
    BLINDADO: { codigo: "GAR-DYV-05", titulo: "Empresa de seguridad o blindado para el traslado de dinero" },
    BITACORAS: { codigo: "DOC-01", titulo: "Bitácoras y cronograma de mantenimientos" },
    LISTADO: { codigo: "DOC-02", titulo: "Listado detallado y valorado de bienes" },
  },

  // Condición de la red hídrica (umbral editable en la celda)
  condiciones: {
    RED_HIDRICA: { campo: "rg_ubi_area_construccion", operador: ">=", valor: 1000, unidad: "m²", texto: "Solo si el área de construcción es 1.000 m² o más" },
  },

  // Tramos de Cooperativas por monto (Robo y Dinero y valores)
  tramos: {
    campo: "rg_dyv_monto_max",
    tipoCampo: "Moneda",
    lista: [
      { codigo: "T1", desde: 0, hasta: 20000, texto: "Hasta 20.000" },              // 20.000 inclusive
      { codigo: "T2", desde: 20000.01, hasta: 50000, texto: "20.000,01 a 50.000" },
      { codigo: "T3", desde: 50000.01, hasta: null, texto: "Más de 50.000" },
    ],
  },

  celdas: {
    "Incendio y líneas aliadas": {
      "Casa habitación": { items: [] },
      "Edificios": { items: ["PERMISO", "EXTINTORES", "DETECTORES"] },
      "HORECA": { items: ["PERMISO", "EXTINTORES", "DETECCION"] },
      "Educación": { items: ["PERMISO", "EXTINTORES", "DETECCION"] },
      "Comercial": { items: ["PERMISO", "EXTINTORES", "DETECCION"] },
      "Servicios": { items: ["PERMISO", "EXTINTORES", "DETECCION"] },
      "Construcción": { items: ["PERMISO", "EXTINTORES", "DETECCION"] },
      "Industrial": { items: ["PERMISO", "EXTINTORES", "DETECCION", "DETECTORES", "RED_HIDRICA", "ROCIADORES"] },
      "Estación de servicios": { items: ["PERMISO", "EXTINTORES", "DETECCION", "DETECTORES", "RED_HIDRICA", "ROCIADORES"] },
      "Cooperativas": { items: ["PERMISO", "EXTINTORES", "DETECCION"] },
    },
    "Robo": {
      "Casa habitación": { items: [] },
      "Edificios": { items: ["GUARDIANIA"] },
      "HORECA": { na: true },
      "Educación": { na: true },
      "Comercial": { items: ["GUARDIANIA"] },
      "Servicios": { items: ["GUARDIANIA"] },
      "Construcción": { items: ["GUARDIANIA"] },
      "Industrial": { items: ["GUARDIANIA", "CCTV"] },
      "Estación de servicios": { items: ["GUARDIANIA", "CCTV"] },
      "Cooperativas": {
        porTramo: {
          T1: ["CCTV", "ALARMA"],
          T2: ["CCTV", "ALARMA", "GUARDIA_8H"],
          T3: ["CCTV", "MONITOREO", "ALARMA", "SENSORES_MOV", "SENSORES_PV", "GUARDIA_24"],
        },
      },
    },
    "Dinero y valores": {
      "Casa habitación": { items: [] },
      "Edificios": { na: true },
      "HORECA": { na: true },
      "Educación": { na: true },
      "Comercial": { na: true },
      "Servicios": { na: true },
      "Construcción": { na: true },
      "Industrial": { na: true },
      "Estación de servicios": { na: true },
      "Cooperativas": {
        porTramo: {
          T1: ["VIDRIOS", "PANICO", "CAJA_FUERTE"],
          T2: ["VIDRIOS", "PANICO", "CAJA_FUERTE", "RESGUARDO"],
          T3: ["VIDRIOS", "PANICO", "CAJA_FUERTE", "BLINDADO"],
        },
      },
    },
    // Equipo electrónico, Equipo y maquinaria y Rotura de maquinaria: mismos documentos en todos los giros
    "Equipo electrónico": { todosLosGiros: { items: ["BITACORAS", "LISTADO"] } },
    "Equipo y maquinaria": { todosLosGiros: { items: ["BITACORAS", "LISTADO"] } },
    "Rotura de maquinaria": { todosLosGiros: { items: ["BITACORAS", "LISTADO"] } },
    "Todo riesgo construcción": { todosLosGiros: { items: [] } },
  },

  // Reglas de sustitución (por código del catálogo). Si la sustituta es exigida o ya se cumple, el reemplazado se muestra
  // "Sustituido por [código] [título]" (informativo, no se exige). Solo aplica donde ambos ítems están en la misma celda.
  sustituciones: [
    { id: "su1", nombre: "El sistema de detección y alarma sustituye a los detectores de humo", sustituta: "GAR-INC-03", reemplaza: ["GAR-INC-04"], activa: true,
      nota: "Corregida en v1.1: antes reemplazaba a GAR-INC-02 Extintores, que ahora se mantiene" },
    { id: "su2", nombre: "La guardianía armada 24/7 cubre las demás guardianías", sustituta: "GAR-ROB-03", reemplaza: ["GAR-ROB-01", "GAR-ROB-02"], activa: true },
    { id: "su3", nombre: "El transporte de valores cubre el resguardo policial", sustituta: "GAR-DYV-05", reemplaza: ["GAR-DYV-04"], activa: true },
  ],

  notas: [
    "El calificador puede agregar garantías distintas cuando la evaluación del riesgo lo justifique.",
    "\"Plan de emergencia y evacuación\" no forma parte del esquema: lo agrega el calificador o lo propone el asistente de calificación.",
    "Casa habitación no tiene garantías mínimas en el esquema vigente.",
  ],
};
