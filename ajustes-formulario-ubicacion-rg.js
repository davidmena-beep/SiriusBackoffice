// SIRIUS · Ajustes de la plantilla "Ubicación – Ramos Generales" v1 (BO-23) · v3
// Preparado en asesoría el 23/10/26 sobre export-plantilla-ubicacion-rg.md con el F1 aplicado (226 de captura + 3 espejos).
// v2 (23/10/26, F1, aplicada): espejos, etiquetas, documentos de Todo riesgo construcción e identificación.
// v3 (23/10/26, F2): trae solo los ajustes nuevos. Corrección de la v1 de la plantilla (sin versión nueva): prototipo sin informes reales.
// Motivo para el Historial de cambios: "Alineación del informe con los motores y la cobertura de evidencia".
// Solo datos: aplicar tal cual. No cambiar diseño, orden de módulos ni otros campos.

window.SIRIUS_AJUSTES_FORMULARIO_RG = {
  plantilla: "Ubicación – Ramos Generales",
  version: "1",
  ajustesVersion: "3",
  motivoHistorial: "Alineación del informe con los motores y la cobertura de evidencia",

  // 1 · Columna que falta en la grilla de extintores.
  //     IA-02 (datos-motores-ia.js) y el conjunto de prueba (datos-pruebas-ia.js) proponen "rg_pci_extintores · columna Estado del manómetro",
  //     pero la grilla no tiene esa columna.
  columnas: [
    { clave: "rg_pci_extintores", agregar: "Estado del manómetro", despuesDe: "Fecha de última recarga",
      tipo: "Opción única",
      opciones: ["En zona de operación (verde)", "Descargado (zona roja izquierda)", "Sobrecargado (zona roja derecha)"],
      obligatoria: false, elegibleIA: true, motor: "IA-02" },
  ],

  // 2 · Etiquetas exigidas aunque el módulo no tenga lo que deben mostrar.
  //     Procesos, Almacenamiento y Combustibles se activan en todo giro Comercial; un comercio sin procesos ni combustibles
  //     no puede fotografiarlos y tendría que justificarlo en cada informe.
  etiquetas: [
    { etiqueta: "Línea de proceso", codigo: "ev_linea_proceso", requerida: "Si «Procesos» (rg_pro_procesos) tiene al menos una fila", minimo: 2 },
    { etiqueta: "Área de combustibles", codigo: "ev_area_combustibles", requerida: "Si «Sustancias combustibles e inflamables» (rg_cmb_sustancias) tiene al menos una fila", minimo: 1 },
  ],

  // 3 · Provincia y cantón: la solicitud ya los trae (Nueva solicitud, paso 3 de Ramos Generales).
  campos: [
    { clave: "rg_ubi_provincia", precarga: "Solicitud", editablePorInspector: true, nota: "Si el inspector lo cambia, queda Modificado con el valor de la solicitud" },
    { clave: "rg_ubi_canton", precarga: "Solicitud", editablePorInspector: true, nota: "Si el inspector lo cambia, queda Modificado con el valor de la solicitud" },
  ],

  pendientes: [
    "Modelo Scoring V3: la banda Subestándar dice \"plazo 60 días\"; se corrige al inicio de la etapa 6.",
    "Modelo Scoring V3: composición \"Incendio y Robo\" sin ramo en el catálogo; por confirmar con el negocio.",
  ],
};
