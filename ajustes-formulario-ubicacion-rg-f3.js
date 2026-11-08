// SIRIUS · Ajuste F3 de la plantilla "Ubicación – Ramos Generales" v1 · Datos exactos
// Preparado en asesoría el 30/10/26 (bloque S, paso S0b) por DEC-067 (observaciones por capítulo) y DEC-070 (mapas y rutas).
// Se aplica sobre v1 con el mismo mecanismo que F1 y F2 (ajuste con motivo, historial de la plantilla). Solo agrega: no cambia ni
// quita campos, opciones, obligatoriedad ni etiquetas existentes, así que los conteos de obligatorios y de cobertura no cambian.
// DEC-041 (rg_pci_tipo_riesgo como espejo) sigue en el backlog: no se incluye para no mover los conteos de 20195.

window.SIRIUS_AJUSTE_F3 = {
  plantilla: "Ubicación – Ramos Generales",
  version: "1",
  ajuste: "F3",
  motivo: "Observaciones por capítulo y evidencias de contexto para el Informe técnico",
  fecha: "18/10/2026 20:15",
  persona: "Andrea Salazar",

  // 12 campos nuevos. Todos: tipo Texto · Obligatorio No · Admite No aplica No · Visible si (vacío) · Elegible para IA Sí ·
  // Criterio (ninguno) · Origen "IA · Texto redactado" (los redacta IA-05; el inspector acepta o edita).
  // Cada uno va en una sección nueva "Observaciones" al final de su módulo, no repetible (aunque el módulo tenga secciones repetibles).
  campos: [
    { modulo: "m03", nombreModulo: "Linderos", clave: "rg_lin_observaciones", etiqueta: "Observaciones de los linderos" },
    { modulo: "m04", nombreModulo: "Riesgos de la naturaleza", clave: "rg_nat_observaciones", etiqueta: "Observaciones de los riesgos de la naturaleza" },
    { modulo: "m16", nombreModulo: "Ocupación", clave: "rg_ocu_observaciones", etiqueta: "Observaciones de la ocupación" },
    { modulo: "m18", nombreModulo: "Almacenamiento", clave: "rg_alm_observaciones", etiqueta: "Observaciones del almacenamiento" },
    { modulo: "m19", nombreModulo: "Combustibles e inflamables", clave: "rg_cmb_observaciones", etiqueta: "Observaciones de combustibles e inflamables" },
    { modulo: "m15", nombreModulo: "Equipo electrónico", clave: "rg_ee_observaciones", etiqueta: "Observaciones del equipo electrónico" },
    { modulo: "m06", nombreModulo: "Sistema eléctrico", clave: "rg_ele_observaciones", etiqueta: "Observaciones del sistema eléctrico" },
    { modulo: "m13", nombreModulo: "Seguridad física (Robo)", clave: "rg_rob_observaciones", etiqueta: "Observaciones de la seguridad física" },
    { modulo: "m07", nombreModulo: "Protección contra incendios", clave: "rg_pci_observaciones", etiqueta: "Observaciones de la protección contra incendios" },
    { modulo: "m08", nombreModulo: "Planes de gestión", clave: "rg_ges_observaciones", etiqueta: "Observaciones de los planes de gestión" },
    { modulo: "m09", nombreModulo: "Cuerpo de bomberos", clave: "rg_bom_observaciones", etiqueta: "Observaciones del cuerpo de bomberos" },
    { modulo: "m10", nombreModulo: "Siniestralidad", clave: "rg_sin_observaciones", etiqueta: "Observaciones de la siniestralidad" },
  ],

  // 3 etiquetas de evidencia nuevas (Requerida No, mínimo 0: no cambian la cobertura). ev_mapa_amenaza ya existe (m04, por instancia).
  etiquetas: [
    { modulo: "m16", etiqueta: "Actividad y mercancía", codigo: "ev_actividad", requerida: "No", minimo: 0, porInstancia: "No", respalda: ["rg_ocu_carga_combustible", "rg_ocu_riesgo_nfpa"] },
    { modulo: "m09", etiqueta: "Ruta a la estación de bomberos", codigo: "ev_ruta_bomberos", requerida: "No", minimo: 0, porInstancia: "No", respalda: ["rg_bom_distancia", "rg_bom_tiempo"], origen: "Contexto externo (mapa de ruta)" },
    { modulo: "m13", etiqueta: "Ruta a la UPC", codigo: "ev_ruta_upc", requerida: "No", minimo: 0, porInstancia: "No", respalda: ["rg_rob_upc_distancia", "rg_rob_upc_tiempo"], origen: "Contexto externo (mapa de ruta)" },
  ],

  esperado: {
    campos: "238 de captura + 3 espejos = 241 en la lista (antes 226 + 3)",
    elegiblesIA: "75 (antes 63)",
    etiquetas: "48 (antes 45)",
    obligatorios20195: "86 de 86 sin cambio (los 12 campos no son obligatorios)",
    cobertura20195: "19 de 21 · 2 justificadas, sin cambio (las 3 etiquetas no son requeridas)",
    historial: "Nueva entrada F3 en el historial de la plantilla; F1 y F2 no se reescriben",
  },
};
