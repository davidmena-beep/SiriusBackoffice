// SIRIUS · Informe de Ramos Generales · caso 20195 · v1.7 · Datos de ejemplo
// Preparado en asesoría el 23/10/26 para el envío 5A, sobre export-plantilla-ubicacion-rg.md (F1 aplicado) y los ajustes v3 (F2).
// Fuente única de los informes de Ramos Generales: datos-ejemplo.js guarda el caso y lo referencia por número; el informe vive solo aquí.
// Solo datos: la interfaz los lee de aquí. No redactar ni completar valores desde el diseño. Las opciones coinciden exactamente con la plantilla.
// Los valores de motores y conexiones son respuestas simuladas (modo Simulada, datos-motores-ia.js v1.10): llevan simulada: true.
// Fotos y documentos son marcadores de posición ("Imagen de ejemplo", "Documento de ejemplo"); nunca imágenes remotas.
// v1.1 (23/10/26, envío 5A-2): los campos requeridos por política suman al conteo de obligatorios (resultado esperado corregido);
//   rg_gen_ciiu guarda el código del catálogo CIIU (datos-catalogo-ciiu.js); panel de evidencias por instancia; edición de grillas.
// v1.2 (23/10/26, envío 5B): bloque cobertura (vista Evidencias, clasificador y cobertura de evidencia) y su resultado esperado.
// v1.3 (23/10/26, envío 5D): bloque redaccion (Generar informe con IA-05 en la vista Revisión): textos simulados por instancia,
//   cifras con el campo contra el que se validan, textos omitidos por falta de datos y resultado esperado.
//   DEC-021: ningún texto cita puntajes, bandas ni niveles del modelo. Se agrega al final con window.SIRIUS_INFORMES_RG.redaccion.
// v1.4 (29/10/26, etapa 6): bloque envio = cambios que llevan el Borrador al informe Enviado y completo (estado base de 20195).
//   Las escenas de la etapa 5 (infrg*, salvo infrgenviado) siguen cargando el Borrador sin aplicar envio. Se agrega al final.
// v1.5 (29/10/26, envío 6C): bloque calificacion = respuesta simulada de IA-06 (asistente) para 20195, propuesta de garantías
//   esperada por ramo y secuencia de prueba del nivel 1. Se agrega al final.

// v1.6 (30/10/26, bloque S, S0b): bloque f3 = 12 textos de observaciones por capítulo (ajuste F3, IA-05 simulado) y 11 fotos nuevas
//   (mapas de referencia y rutas de IA-04, actividad, señalización y tablero secundario). Se aplica junto con envio. Se agrega al final.
// v1.7 (30/10/26, S5): observaciones de las 42 fotos válidas (bloque observacionesFotos, DEC-074). Se agrega al final.
window.SIRIUS_INFORMES_RG = {
  version: "1.7",

  reglas: [
    "Ramos Generales tiene un solo informe por ubicación, con módulos comunes, por actividad y por ramo. No hay selector de riesgos ni estado de informe por ramo.",
    "Un módulo se muestra si su condición \"Se incluye\" se cumple con los ramos, el giro y las respuestas del informe. Un módulo inactivo no aparece en el índice.",
    "Estado del módulo: Sin empezar (ningún campo con valor ni No aplica); Completo (todos los obligatorios visibles con valor final o No aplica, y nada por confirmar); Con pendientes (el resto). Sin obligatorios, la línea dice \"Sin campos obligatorios\".",
    "Un obligatorio cuenta como completo con valor final (Manual, Solicitud, Contexto externo, Calculado o propuesta Asignada, Confirmada o Modificada) o con No aplica. Por confirmar no cuenta como completo. No visible y No consultado cuentan como vacíos.",
    "Por confirmar se cuenta por campo y, en grillas, por fila o por celda.",
    "Los campos obligatorios por instancia se cuentan una vez por instancia (4 linderos, 6 amenazas, cada edificación, escenario y bodega).",
    "Espejos y campos de cálculo nunca son obligatorios ni se editan; el espejo muestra \"Editar en [módulo]\".",
    "Un valor propuesto por un motor y luego cambiado por una persona queda Modificado: muestra el valor propuesto, su confianza y quién lo cambió. Un motor nunca reemplaza un valor editado por una persona.",
    "Un campo marcado \"Requerido por una política\" cuenta como obligatorio en el avance del módulo y del informe, aunque la plantilla no lo marque como obligatorio.",
    "El panel de evidencias muestra por defecto las fotos de la instancia abierta (edificación, lindero, bodega o escenario) y ofrece \"Ver todas las del módulo (N)\". En módulos sin instancias muestra todas.",
    "Grillas: las celdas se editan, y se agregan y quitan filas (quitar pide confirmación). Editar una celda propuesta por un motor la deja Modificada, con el valor propuesto y su confianza. Confirmar se hace por celda o por fila.",
    "rg_gen_ciiu guarda el código del catálogo CIIU y se muestra como \"[código] · [descripción]\". rg_ocu_riesgo_ciiu se calcula con el riesgo de ese código en el catálogo.",
    "Apagar la simulación no borra lo ya propuesto: solo afecta las ejecuciones nuevas (fotos o documentos nuevos), que quedan con la nota \"Extracción no disponible\".",
  ],

  // Cómo se muestra cada origen junto al campo (chip) y en su detalle (tooltip o panel al hacer clic o con foco)
  origenes: [
    { tipo: "Solicitud", chip: "Fuente: solicitud", detalle: "Bloqueado para el inspector" },
    { tipo: "Contexto externo", chip: "[fuente] · [respaldo]", ejemplo: "Servicio de mapas · 2,1 km", detalle: "Fuente, fecha y hora de la consulta; \"Respuesta simulada · Solo en el prototipo\" si simulada" },
    { tipo: "Extracción visual", chip: "Foto · [etiqueta] ([instancia]) · [confianza] %", ejemplo: "Foto · Fachada (Edificación 1) · 93 %", detalle: "Miniatura de la foto, versión del motor, valor propuesto, fecha; simulada si aplica" },
    { tipo: "Lectura de documentos", chip: "[documento] · [confianza] %", ejemplo: "Permiso de bomberos · 97 %", detalle: "Documento, versión del motor, valor propuesto, fecha; simulada si aplica" },
    { tipo: "GPS de las fotos", chip: "GPS de las fotos · [precisión]", detalle: "Cantidad de fotos promediadas" },
    { tipo: "Calculado", chip: "Calculado", detalle: "Fórmula" },
    { tipo: "Manual", chip: null, detalle: "Persona y fecha en el historial del campo" },
    { tipo: "Modificado", chip: "Modificado · propuesto: [valor] ([confianza] %)", detalle: "Quién y cuándo lo cambió" },
    { tipo: "No aplica", chip: "No aplica · [motivo]", detalle: "Automático (\"No aplica · por tipo de riesgo\") o persona y fecha" },
    { tipo: "No visible", chip: "No visible en las fotos", detalle: "Motivo del motor y foto; el campo queda vacío" },
    { tipo: "No consultado", chip: "No consultado · persona natural", detalle: "Motivo" },
    { tipo: "Requerido por una política", chip: "Requerido por una política", detalle: "Sin el nombre de la política; admite No aplica si el campo lo permite" },
  ],
  estadosPropuesta: ["Asignado (90 % o más; 95 % en rg_bom_permiso y rg_bom_vigencia)", "Por confirmar (60 a 89 %; 70 a 94 % en el permiso de bomberos)", "Confirmado", "Modificado"],
  accionesCampo: ["Confirmar (si está Por confirmar)", "Editar (pasa a Manual o a Modificado)", "Marcar No aplica con motivo (si el campo lo admite)", "Ver origen"],

  // Vista Evidencias: clasificador y cobertura (envío 5B)
  cobertura: {
    grupos: "Módulo › etiqueta › instancia, en el orden del índice. Arriba, fijas: \"Sin clasificar (N)\" y \"Documentos detectados (N)\".",
    cuentaParaElMinimo: [
      "Asignada (90 % o más), Confirmada o Asignada por el inspector.",
      "Por confirmar no cuenta hasta que se confirma.",
      "Duplicada no cuenta para el mínimo.",
      "Borrosa y Fuera del predio no cuentan, salvo que el inspector elija \"Usar igual\" con motivo.",
      "Excluida del informe nunca cuenta; sigue visible en Evidencias con su motivo y no sale en el PDF.",
    ],
    estadosEtiqueta: ["Cumple (n de mínimo)", "Falta (n de mínimo)", "Justificada"],
    motivosJustificacion: ["No se permitió fotografiar", "Área inaccesible o restringida", "Otro"],
    reglasJustificacion: [
      "\"Otro\" exige una observación de al menos 10 caracteres.",
      "La justificación queda con persona y fecha, y la ve el calificador.",
      "Una etiqueta justificada deja de contar como faltante; si después se agrega la foto, pasa a Cumple y la justificación queda en el historial.",
    ],
    acciones: [
      "Selección múltiple con casillas; \"Mover a…\" (etiqueta e instancia) por menú y por teclado; arrastrar es opcional, nunca la única forma.",
      "\"Crear [edificación | bodega | escenario] con estas fotos\": crea la instancia con nombre propuesto editable y mueve las fotos.",
      "\"Confirmar\" por foto y \"Confirmar las de esta etiqueta\".",
      "\"Usar igual\" (fotos Borrosa o Fuera del predio) y \"Excluir del informe\", ambas con motivo.",
      "\"Cargar fotos\" desde el back-office: llegan a Sin clasificar con \"Carga desde back-office · sin GPS\" y \"Clasificación pendiente\".",
    ],
    lineaIndice: "A la línea del módulo en el índice se agrega \"· N etiquetas sin foto\" cuando faltan. Un módulo con etiquetas faltantes queda Con pendientes.",
    resumen: "Cobertura: [cumplen] de [exigidas] · [justificadas] justificadas · [faltan] faltan",
  },

  casos: {
    "20195": {
      // Datos del caso que se mueven a datos-ejemplo.js (hoy en SIRIUS Back-office.dc.html)
      caso: {
        estado: "En curso",
        asegurado: "Alfredo Antonio Mendoza",
        identificacion: { tipo: "Cédula", numero: "1309876543" },
        giro: "Comercial",
        ubicacion: { tipoBien: "Local comercial y bodega", direccion: "Av. Manabí y calle Pedro Gual, Portoviejo", provincia: "Manabí", canton: "Portoviejo" },
        ramos: [
          { ramo: "Incendio y líneas aliadas", linea: "Incendio comercial", valorAsegurado: 405000 },
          { ramo: "Robo", linea: "Robo comercial", valorAsegurado: 85000 },
          { ramo: "Equipo electrónico", linea: "Equipo electrónico fijo", valorAsegurado: 20000 },
        ],
        visita: { codigo: "V1", fecha: "16/10/2026", desde: "09:00", hasta: "12:00", estado: "En curso", modalidad: "Presencial", inspector: "Luis Andrade", agencia: "Externo" },
      },
      informe: {
        estado: "Borrador",
        plantilla: "Ubicación – Ramos Generales",
        versionPlantilla: "1",
        registradoPor: "Luis Andrade",
        canal: "App del inspector",
        inicio: "16/10/2026 09:05",
        ultimoGuardado: "16/10/2026 12:20",
        fechaInspeccion: "16/10/2026 09:08 a 12:02 (de las fotos)",
        modulosActivos: ["m01","m02","m03","m04","m05","m06","m07","m08","m09","m10","m11","m12","m13","m15","m16","m17","m18","m19"],
        modulosInactivos: { m14: "El caso no incluye Dinero y valores", m20: "Giro Comercial sin Rotura de maquinaria", m21: "Sin red hídrica con bomba ni giro Industrial o Estación de servicios", m22: "El caso no incluye Todo riesgo construcción" },
        instancias: {
          edificaciones: [{ id: "Edificación 1", nombre: "Local comercial", area: 420 }, { id: "Edificación 2", nombre: "Bodega posterior", area: 380 }],
          bodegas: [{ id: "Bodega 1", nombre: "Bodega posterior", area: 380 }],
          escenarios: [{ id: "Escenario 1", nombre: "Incendio en la bodega posterior" }],
          linderos: ["Norte", "Sur", "Este", "Oeste"],
          amenazas: ["Sísmico", "Inundación", "Volcánico", "Vientos y rayos", "Maremoto", "Deslizamiento"],
        },
        valores: [
          {
            "clave": "rg_gen_asegurado",
            "valor": "Alfredo Antonio Mendoza",
            "origen": {
              "tipo": "Solicitud"
            }
          },
          {
            "clave": "rg_gen_ruc",
            "valor": "Cédula · 1309876543",
            "origen": {
              "tipo": "Solicitud"
            }
          },
          {
            "clave": "rg_gen_representante_legal",
            "valor": null,
            "origen": {
              "tipo": "No consultado",
              "motivo": "Persona natural: la consulta a la SCVS solo aplica a RUC de sociedad"
            }
          },
          {
            "clave": "rg_gen_objeto_social",
            "valor": null,
            "origen": {
              "tipo": "No consultado",
              "motivo": "Persona natural: la consulta a la SCVS solo aplica a RUC de sociedad"
            }
          },
          {
            "clave": "rg_gen_fecha_constitucion",
            "valor": null,
            "origen": {
              "tipo": "No consultado",
              "motivo": "Persona natural: la consulta a la SCVS solo aplica a RUC de sociedad"
            }
          },
          {
            "clave": "rg_gen_situacion_legal",
            "valor": null,
            "origen": {
              "tipo": "No consultado",
              "motivo": "Persona natural: la consulta a la SCVS solo aplica a RUC de sociedad"
            }
          },
          {
            "clave": "rg_gen_entrevistado",
            "valor": "Alfredo Antonio Mendoza",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:15"
            }
          },
          {
            "clave": "rg_gen_cargo_entrevistado",
            "valor": "Propietario",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:15"
            }
          },
          {
            "clave": "rg_gen_telefono",
            "valor": "0991234567",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:16"
            }
          },
          {
            "clave": "rg_gen_tipo_propiedad",
            "valor": "Propio",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:16"
            }
          },
          {
            "clave": "rg_gen_anio_inicio",
            "valor": 2009,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:17"
            }
          },
          {
            "clave": "rg_gen_personal",
            "valor": [
              {
                "Categoría": "Ventas",
                "Número": 6,
                "Turnos": 1,
                "Horario inicio": "09:00",
                "Horario fin": "19:00",
                "Jornadas": "Lunes a sábado"
              },
              {
                "Categoría": "Bodega",
                "Número": 3,
                "Turnos": 1,
                "Horario inicio": "08:00",
                "Horario fin": "17:00",
                "Jornadas": "Lunes a viernes"
              }
            ],
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:20"
            }
          },
          {
            "clave": "rg_gen_giro",
            "valor": "Comercial",
            "origen": {
              "tipo": "Solicitud"
            }
          },
          {
            "clave": "rg_gen_ciiu",
            "valor": "G4759",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:18"
            }
          },
          {
            "clave": "rg_ubi_direccion",
            "valor": "Av. Manabí y calle Pedro Gual, Portoviejo",
            "origen": {
              "tipo": "Solicitud"
            }
          },
          {
            "clave": "rg_ubi_parroquia",
            "valor": "Portoviejo",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:10"
            }
          },
          {
            "clave": "rg_ubi_canton",
            "valor": "Portoviejo",
            "origen": {
              "tipo": "Solicitud"
            }
          },
          {
            "clave": "rg_ubi_provincia",
            "valor": "Manabí",
            "origen": {
              "tipo": "Solicitud"
            }
          },
          {
            "clave": "rg_ubi_latitud",
            "valor": -1.0546,
            "origen": {
              "tipo": "GPS de las fotos",
              "fotos": "Promedio de 30 fotos con GPS",
              "precision": "± 6 m"
            }
          },
          {
            "clave": "rg_ubi_longitud",
            "valor": -80.4545,
            "origen": {
              "tipo": "GPS de las fotos",
              "fotos": "Promedio de 30 fotos con GPS",
              "precision": "± 6 m"
            }
          },
          {
            "clave": "rg_ubi_altitud",
            "valor": 53,
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true,
              "respaldo": "53 m s. n. m."
            }
          },
          {
            "clave": "rg_ubi_area_predio",
            "valor": 1150,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:25"
            }
          },
          {
            "clave": "rg_ubi_dist_mar",
            "valor": 24300,
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "Cálculo geográfico",
              "fecha": "16/10/2026 09:05",
              "simulada": false,
              "respaldo": "24,3 km"
            }
          },
          {
            "clave": "rg_ubi_dist_rio",
            "valor": 1400,
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "Cálculo geográfico",
              "fecha": "16/10/2026 09:05",
              "simulada": false,
              "respaldo": "1,4 km · río Portoviejo"
            }
          },
          {
            "clave": "rg_lin_tipo_riesgo",
            "valor": "Vía pública",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F07",
              "confianza": 96,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Norte"
          },
          {
            "clave": "rg_lin_distancia",
            "valor": 12,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:05"
            },
            "instancia": "Norte"
          },
          {
            "clave": "rg_lin_tipo_riesgo",
            "valor": "Vivienda o riesgo ligero",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F08",
              "confianza": 81,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            },
            "instancia": "Sur"
          },
          {
            "clave": "rg_lin_distancia",
            "valor": 3,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:08"
            },
            "instancia": "Sur"
          },
          {
            "clave": "rg_lin_altura_colindante",
            "valor": "1–2 pisos",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:08"
            },
            "instancia": "Sur"
          },
          {
            "clave": "rg_lin_tipo_estructura",
            "valor": "Mampostería confinada",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F08",
              "confianza": 77,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            },
            "instancia": "Sur"
          },
          {
            "clave": "rg_lin_tipo_riesgo",
            "valor": "Comercio",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:12"
            },
            "instancia": "Este"
          },
          {
            "clave": "rg_lin_distancia",
            "valor": 0,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:12"
            },
            "instancia": "Este",
            "nota": "Pared medianera"
          },
          {
            "clave": "rg_lin_altura_colindante",
            "valor": "1–2 pisos",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:12"
            },
            "instancia": "Este"
          },
          {
            "clave": "rg_nat_zona_sismica",
            "valor": "Zona VI · Z = 0,50",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "Catálogo NEC por cantón",
              "fecha": "16/10/2026 09:05",
              "simulada": false
            }
          },
          {
            "clave": "rg_nat_exposicion",
            "valor": "Alta",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:30"
            },
            "instancia": "Sísmico"
          },
          {
            "clave": "rg_nat_exposicion",
            "valor": "Baja",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:30"
            },
            "instancia": "Inundación"
          },
          {
            "clave": "rg_nat_exposicion",
            "valor": "Baja",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:30"
            },
            "instancia": "Volcánico"
          },
          {
            "clave": "rg_nat_exposicion",
            "valor": "Media",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:30"
            },
            "instancia": "Vientos y rayos"
          },
          {
            "clave": "rg_nat_exposicion",
            "valor": "Baja",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:30"
            },
            "instancia": "Deslizamiento"
          },
          {
            "clave": "rg_nat_exposicion",
            "valor": null,
            "origen": {
              "tipo": "No aplica",
              "motivo": "Predio a 24,3 km del mar, fuera de la zona de inundación por tsunami",
              "automatico": "10:31"
            },
            "instancia": "Maremoto"
          },
          {
            "clave": "rg_nat_pararrayos",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:33"
            }
          },
          {
            "clave": "rg_nat_requiere_pararrayos",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:33"
            }
          },
          {
            "clave": "rg_nat_justificacion_pararrayos",
            "valor": "Edificaciones de una planta, sin estructuras elevadas ni equipos sensibles en cubierta.",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:34"
            }
          },
          {
            "clave": "rg_con_nombre",
            "valor": "Local comercial",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:30"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_area",
            "valor": 420,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:30"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_pisos",
            "valor": "1–3",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:31"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_subsuelos",
            "valor": "Sin subsuelos",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:31"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_anio_construccion",
            "valor": 2008,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:32"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_conservacion",
            "valor": "Bueno",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F01",
              "confianza": 93,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_paredes",
            "valor": "Hormigón o bloque",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F01",
              "confianza": 95,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_techo",
            "valor": "Losa de hormigón",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F03",
              "confianza": 91,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_estructura",
            "valor": "Hormigón armado",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F05",
              "confianza": 78,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_medios_egreso",
            "valor": "Existen y libres",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F06",
              "confianza": 90,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Edificación 1"
          },
          {
            "clave": "rg_con_nombre",
            "valor": "Bodega posterior",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:40"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_area",
            "valor": 380,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:40"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_pisos",
            "valor": "1–3",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:41"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_subsuelos",
            "valor": "Sin subsuelos",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:41"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_anio_construccion",
            "valor": 2015,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 09:41"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_conservacion",
            "valor": "Regular",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F02",
              "confianza": 88,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Modificado",
              "propuesto": "Bueno",
              "modificadoPor": "Luis Andrade",
              "fechaModificacion": "16/10/2026 12:20"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_paredes",
            "valor": "Mixta",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F02",
              "confianza": 84,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_con_techo",
            "valor": "Metálico o teja",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F04",
              "confianza": 92,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Edificación 2"
          },
          {
            "clave": "rg_ele_chk_01",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 94,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_ele_chk_02",
            "valor": "No",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 91,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_ele_chk_04",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 90,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_ele_chk_05",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 86,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_ele_chk_06",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F12",
              "confianza": 92,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_ele_chk_07",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 89,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_ele_chk_08",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 93,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_ele_chk_09",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "confianza": 95,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_ele_chk_03",
            "valor": null,
            "origen": {
              "tipo": "No visible",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F10",
              "motivo": "El interior del tablero queda fuera del encuadre",
              "simulada": true
            }
          },
          {
            "clave": "rg_ele_chk_10",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:45"
            }
          },
          {
            "clave": "rg_ele_chk_11",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:45"
            }
          },
          {
            "clave": "rg_ele_chk_13",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:45"
            }
          },
          {
            "clave": "rg_ele_chk_12",
            "valor": null,
            "origen": {
              "tipo": "No aplica",
              "motivo": "No hay equipos de media tensión ni tableros con energía incidente significativa",
              "automatico": "10:46"
            }
          },
          {
            "clave": "rg_ele_mantenimiento",
            "valor": "Correctivo",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:47"
            }
          },
          {
            "clave": "rg_pci_ext_existe",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:50"
            }
          },
          {
            "clave": "rg_pci_extintores",
            "valor": [
              {
                "Agente": "PQS",
                "Capacidad (lb)": 10,
                "Cantidad": 4,
                "Ubicación": "Local comercial",
                "Fecha de última recarga": "15/03/2026",
                "Estado del manómetro": "En zona de operación (verde)"
              },
              {
                "Agente": "CO2",
                "Capacidad (lb)": 10,
                "Cantidad": 1,
                "Ubicación": "Área de caja",
                "Fecha de última recarga": "15/03/2026"
              },
              {
                "Agente": "PQS",
                "Capacidad (lb)": 20,
                "Cantidad": 2,
                "Ubicación": "Bodega posterior",
                "Fecha de última recarga": "15/03/2026",
                "Estado del manómetro": "En zona de operación (verde)"
              }
            ],
            "origen": {
              "tipo": "Grilla",
              "filas": "Manual (Luis Andrade, 16/10/2026 10:55)",
              "columnas": {
                "Fecha de última recarga": {
                  "tipo": "Lectura de documentos",
                  "motor": "IA-03",
                  "version": "1 · Borrador",
                  "documento": "D2",
                  "confianza": 95,
                  "simulada": true,
                  "fecha": "16/10/2026 12:12",
                  "estado": "Asignado"
                },
                "Estado del manómetro": {
                  "porFila": {
                    "1": {
                      "tipo": "Extracción visual",
                      "motor": "IA-02",
                      "version": "1 · Borrador",
                      "foto": "F13",
                      "confianza": 96,
                      "estado": "Asignado",
                      "simulada": true,
                      "fecha": "16/10/2026 12:10"
                    },
                    "3": {
                      "tipo": "Extracción visual",
                      "motor": "IA-02",
                      "version": "1 · Borrador",
                      "foto": "F14",
                      "confianza": 79,
                      "estado": "Por confirmar",
                      "simulada": true,
                      "fecha": "16/10/2026 12:10"
                    }
                  }
                }
              }
            }
          },
          {
            "clave": "rg_pci_tipo_riesgo",
            "valor": "Ordinario",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 10:56"
            }
          },
          {
            "clave": "rg_pci_ext_senalizados",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F13",
              "confianza": 92,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_pci_ext_mantenimiento",
            "valor": "Vigente con etiqueta",
            "origen": {
              "tipo": "Lectura de documentos",
              "motor": "IA-03",
              "version": "1 · Borrador",
              "documento": "D2",
              "confianza": 94,
              "simulada": true,
              "fecha": "16/10/2026 12:12",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_pci_det_existe",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:00"
            }
          },
          {
            "clave": "rg_pci_det_tipo",
            "valor": [
              "Humo"
            ],
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F15",
              "confianza": 87,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_pci_det_instalados",
            "valor": 6,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:01"
            }
          },
          {
            "clave": "rg_pci_det_central",
            "valor": "Local o manual",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:02"
            }
          },
          {
            "clave": "rg_pci_det_senales",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:02"
            }
          },
          {
            "clave": "rg_pci_red_existe",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:03"
            }
          },
          {
            "clave": "rg_ges_plan_emergencia",
            "valor": "Existe pero no se entregó",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:10"
            }
          },
          {
            "clave": "rg_ges_brigadas",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:10"
            }
          },
          {
            "clave": "rg_ges_simulacros",
            "valor": "Nunca",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:11"
            }
          },
          {
            "clave": "rg_ges_orden_aseo",
            "valor": "Regular o parcial",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F16",
              "confianza": 85,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_ges_cert_gestion",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:12"
            }
          },
          {
            "clave": "rg_ges_trabajos_caliente",
            "valor": null,
            "origen": {
              "tipo": "No aplica",
              "motivo": "No se realizan trabajos en caliente en el predio",
              "automatico": "11:12"
            }
          },
          {
            "clave": "rg_ges_trabajos_altura",
            "valor": null,
            "origen": {
              "tipo": "No aplica",
              "motivo": "No se realizan trabajos en altura en el predio",
              "automatico": "11:12"
            }
          },
          {
            "clave": "rg_bom_permiso",
            "valor": "Vigente del año en curso",
            "origen": {
              "tipo": "Lectura de documentos",
              "motor": "IA-03",
              "version": "1 · Borrador",
              "documento": "D1",
              "confianza": 97,
              "simulada": true,
              "fecha": "16/10/2026 12:12",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_bom_vigencia",
            "valor": "31/12/2026",
            "origen": {
              "tipo": "Lectura de documentos",
              "motor": "IA-03",
              "version": "1 · Borrador",
              "documento": "D1",
              "confianza": 96,
              "simulada": true,
              "fecha": "16/10/2026 12:12",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_bom_estacion",
            "valor": "Estación N.° 1 de Portoviejo",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true
            }
          },
          {
            "clave": "rg_bom_distancia",
            "valor": "1 a 5 km",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true,
              "respaldo": "2,1 km"
            }
          },
          {
            "clave": "rg_bom_tiempo",
            "valor": "5 a 10 min",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true,
              "respaldo": "6 min"
            }
          },
          {
            "clave": "rg_sin_siniestros",
            "valor": [],
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-02 Base de siniestralidad del mercado",
              "fecha": "16/10/2026 09:05",
              "simulada": true,
              "respaldo": "Sin siniestros registrados"
            }
          },
          {
            "clave": "rg_sin_declarado",
            "valor": "Sin siniestros en los últimos 5 años, según el entrevistado.",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:15"
            }
          },
          {
            "clave": "rg_pmp_afectacion",
            "valor": "40–60 %",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:20"
            },
            "instancia": "Escenario 1"
          },
          {
            "clave": "rg_pmp_interrupcion",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:20"
            },
            "instancia": "Escenario 1"
          },
          {
            "clave": "rg_pmp_paralizacion",
            "valor": "1 a 3 meses",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:21"
            },
            "instancia": "Escenario 1"
          },
          {
            "clave": "rg_rob_cerramiento",
            "valor": "Muro de hormigón o bloque",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F18",
              "confianza": 94,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_rob_cerramiento_altura",
            "valor": "Más de 2,00 m",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:25"
            }
          },
          {
            "clave": "rg_rob_proteccion_adicional",
            "valor": [
              "Concertina"
            ],
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:25"
            }
          },
          {
            "clave": "rg_rob_puertas",
            "valor": "Rejas",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F19",
              "confianza": 90,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            }
          },
          {
            "clave": "rg_rob_ventanas",
            "valor": "Rejas",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F20",
              "confianza": 76,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_rob_vig_existe",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:26"
            }
          },
          {
            "clave": "rg_rob_cctv_existe",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:27"
            }
          },
          {
            "clave": "rg_rob_cctv_tipo",
            "valor": "IP",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:27"
            }
          },
          {
            "clave": "rg_rob_cctv_conexion",
            "valor": "Cableada",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:27"
            }
          },
          {
            "clave": "rg_rob_cctv_cobertura",
            "valor": "Parcial en zonas críticas",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F21",
              "confianza": 83,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_rob_cctv_monitoreo_situ",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:28"
            }
          },
          {
            "clave": "rg_rob_cctv_monitoreo_remoto",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:28"
            }
          },
          {
            "clave": "rg_rob_cctv_grabacion",
            "valor": "NVR o nube",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:28"
            }
          },
          {
            "clave": "rg_rob_cctv_resguardo_dias",
            "valor": 30,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:28"
            }
          },
          {
            "clave": "rg_rob_alarma_existe",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:29"
            }
          },
          {
            "clave": "rg_rob_alarma_activacion",
            "valor": "Sensor de movimiento",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:29"
            }
          },
          {
            "clave": "rg_rob_alarma_monitoreo",
            "valor": "Remoto por empresa o autoridades",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:29"
            }
          },
          {
            "clave": "rg_rob_boton_panico",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:29"
            }
          },
          {
            "clave": "rg_rob_upc_nombre",
            "valor": "UPC Andrés de Vera",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true
            }
          },
          {
            "clave": "rg_rob_upc_distancia",
            "valor": "Menos de 1 km",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true,
              "respaldo": "0,8 km"
            }
          },
          {
            "clave": "rg_rob_upc_tiempo",
            "valor": "Menos de 5 min",
            "origen": {
              "tipo": "Contexto externo",
              "fuente": "CNX-04 Servicio de mapas",
              "fecha": "16/10/2026 09:05",
              "simulada": true,
              "respaldo": "3 min"
            }
          },
          {
            "clave": "rg_ee_equipos",
            "valor": [
              {
                "Tipo": "Servidor",
                "Marca": "Dell",
                "Modelo": "PowerEdge T150",
                "Serie": "8JK2Q73",
                "Ubicación": "Oficina",
                "Valor (USD)": 4800,
                "Año": 2023
              },
              {
                "Tipo": "Computadores de escritorio (5)",
                "Marca": "HP",
                "Modelo": "ProDesk 400 G9",
                "Serie": "Varias",
                "Ubicación": "Local comercial",
                "Valor (USD)": 5250,
                "Año": 2024
              },
              {
                "Tipo": "Terminales de punto de venta (3)",
                "Marca": "Epson",
                "Modelo": "TM-T88VII",
                "Serie": "Varias",
                "Ubicación": "Área de caja",
                "Valor (USD)": 2850,
                "Año": 2024
              },
              {
                "Tipo": "Impresora multifunción",
                "Marca": "Ricoh",
                "Modelo": "IM 430F",
                "Serie": "3109R554",
                "Ubicación": "Oficina",
                "Valor (USD)": 2600,
                "Año": 2022
              },
              {
                "Tipo": "Equipo de red y cámaras IP",
                "Marca": "Hikvision",
                "Modelo": "Varios",
                "Serie": "Varias",
                "Ubicación": "Local comercial",
                "Valor (USD)": 4150,
                "Año": 2023
              }
            ],
            "origen": {
              "tipo": "Grilla",
              "filas": "Lectura de documentos · D3",
              "confianzaPorFila": [
                95,
                93,
                82,
                91,
                74
              ],
              "motor": "IA-03",
              "version": "1 · Borrador",
              "documento": "D3",
              "simulada": true,
              "estadoPorFila": [
                "Asignado",
                "Asignado",
                "Por confirmar",
                "Asignado",
                "Por confirmar"
              ]
            }
          },
          {
            "clave": "rg_ee_cuarto_existe",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:35"
            }
          },
          {
            "clave": "rg_ee_tierra",
            "valor": "Visible sin medición",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:36"
            }
          },
          {
            "clave": "rg_ee_circuitos_dedicados",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:36"
            }
          },
          {
            "clave": "rg_ee_ups",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:37"
            }
          },
          {
            "clave": "rg_ee_ups_autonomia",
            "valor": 15,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:37"
            }
          },
          {
            "clave": "rg_ee_supresor",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:37"
            }
          },
          {
            "clave": "rg_ee_generador",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:37"
            }
          },
          {
            "clave": "rg_ee_detector_cuarto",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:38"
            }
          },
          {
            "clave": "rg_ee_extintor_tipo",
            "valor": "Solo PQS",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:38"
            }
          },
          {
            "clave": "rg_ee_supresion",
            "valor": "Ninguna",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:38"
            }
          },
          {
            "clave": "rg_ee_respaldo_datos",
            "valor": "Sí",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:39"
            }
          },
          {
            "clave": "rg_ocu_carga_combustible",
            "valor": "Moderada",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F26",
              "confianza": 82,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            }
          },
          {
            "clave": "rg_ocu_riesgo_nfpa",
            "valor": "Ordinario",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:42"
            }
          },
          {
            "clave": "rg_alm_nombre",
            "valor": "Bodega posterior",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:44"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_area",
            "valor": 380,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:44"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_altura_apilamiento",
            "valor": 3.5,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:45"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_tipo",
            "valor": "Estanterías",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F26",
              "confianza": 91,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_clase_mercancia",
            "valor": "Clase III",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:46"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_separacion_techo",
            "valor": "0,90 m o más",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F28",
              "confianza": 72,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Por confirmar"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_pasillos_libres",
            "valor": "Sí",
            "origen": {
              "tipo": "Extracción visual",
              "motor": "IA-02",
              "version": "1 · Borrador",
              "foto": "F27",
              "confianza": 90,
              "simulada": true,
              "fecha": "16/10/2026 12:10",
              "estado": "Asignado"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_alm_valor",
            "valor": 120000,
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:47"
            },
            "instancia": "Bodega 1"
          },
          {
            "clave": "rg_cmb_glp",
            "valor": "No",
            "origen": {
              "tipo": "Manual",
              "persona": "Luis Andrade",
              "fecha": "16/10/2026 11:50"
            }
          }
        ],
        fotos: [
          {
            "id": "F01",
            "etiqueta": "Fachada",
            "codigo": "ev_fachada",
            "instancia": "Edificación 1",
            "confianza": 97,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "09:22",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4543,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F02",
            "etiqueta": "Fachada",
            "codigo": "ev_fachada",
            "instancia": "Edificación 2",
            "confianza": 95,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "09:38",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0548,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F03",
            "etiqueta": "Cubierta interior",
            "codigo": "ev_cubierta_interior",
            "instancia": "Edificación 1",
            "confianza": 91,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "09:27",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4544,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F04",
            "etiqueta": "Cubierta interior",
            "codigo": "ev_cubierta_interior",
            "instancia": "Edificación 2",
            "confianza": 92,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "09:44",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0548,
              "lon": -80.4547,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F05",
            "etiqueta": "Estructura y entrepisos",
            "codigo": "ev_estructura",
            "instancia": "Edificación 1",
            "confianza": 78,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "09:29",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F06",
            "etiqueta": "Medios de egreso",
            "codigo": "ev_medios_egreso",
            "instancia": "Edificación 1",
            "confianza": 90,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "09:33",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4544,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F07",
            "etiqueta": "Lindero",
            "codigo": "ev_lindero",
            "instancia": "Norte",
            "confianza": 96,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "10:02",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0543,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F08",
            "etiqueta": "Lindero",
            "codigo": "ev_lindero",
            "instancia": "Sur",
            "confianza": 81,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "10:06",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0549,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F09",
            "etiqueta": "Lindero",
            "codigo": "ev_lindero",
            "instancia": "Este",
            "confianza": 93,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "10:10",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0546,
              "lon": -80.4542,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F10",
            "etiqueta": "Tablero principal abierto",
            "codigo": "ev_tablero_principal",
            "instancia": null,
            "confianza": 94,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "10:38",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F11",
            "etiqueta": "Tablero principal abierto",
            "codigo": "ev_tablero_principal",
            "instancia": null,
            "confianza": 92,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "10:39",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F12",
            "etiqueta": "Puesta a tierra",
            "codigo": "ev_puesta_tierra",
            "instancia": null,
            "confianza": 88,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "10:41",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F13",
            "etiqueta": "Extintor",
            "codigo": "ev_extintor",
            "instancia": null,
            "confianza": 97,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "10:51",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4544,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F14",
            "etiqueta": "Extintor",
            "codigo": "ev_extintor",
            "instancia": null,
            "confianza": 96,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "10:53",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0547,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F15",
            "etiqueta": "Detectores y central",
            "codigo": "ev_detectores_central",
            "instancia": null,
            "confianza": 89,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "10:58",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F16",
            "etiqueta": "Orden y aseo",
            "codigo": "ev_orden_aseo",
            "instancia": null,
            "confianza": 85,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "11:05",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0546,
              "lon": -80.4544,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F17",
            "etiqueta": "Orden y aseo",
            "codigo": "ev_orden_aseo",
            "instancia": null,
            "confianza": 90,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:06",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0548,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F18",
            "etiqueta": "Cerramiento",
            "codigo": "ev_cerramiento",
            "instancia": null,
            "confianza": 94,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:22",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0549,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F19",
            "etiqueta": "Puertas de acceso",
            "codigo": "ev_puertas_acceso",
            "instancia": null,
            "confianza": 90,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:23",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4543,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F20",
            "etiqueta": "Ventanas",
            "codigo": "ev_ventanas",
            "instancia": null,
            "confianza": 76,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "11:24",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4543,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F21",
            "etiqueta": "Cámaras",
            "codigo": "ev_camaras",
            "instancia": null,
            "confianza": 83,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "11:26",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0546,
              "lon": -80.4544,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F22",
            "etiqueta": "Central de alarma",
            "codigo": "ev_central_alarma",
            "instancia": null,
            "confianza": 92,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:28",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F23",
            "etiqueta": "Equipo electrónico",
            "codigo": "ev_equipos",
            "instancia": null,
            "confianza": 93,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:31",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F24",
            "etiqueta": "Equipo electrónico",
            "codigo": "ev_equipos",
            "instancia": null,
            "confianza": 91,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:32",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F25",
            "etiqueta": "UPS",
            "codigo": "ev_ups",
            "instancia": null,
            "confianza": 90,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:34",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4546,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F26",
            "etiqueta": "Bodega",
            "codigo": "ev_bodega",
            "instancia": "Bodega 1",
            "confianza": 91,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "11:43",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0548,
              "lon": -80.4547,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F27",
            "etiqueta": "Bodega",
            "codigo": "ev_bodega",
            "instancia": "Bodega 1",
            "confianza": 72,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "11:44",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0548,
              "lon": -80.4547,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F28",
            "etiqueta": "Apilamiento",
            "codigo": "ev_apilamiento",
            "instancia": "Bodega 1",
            "confianza": 72,
            "estado": "Por confirmar",
            "fecha": "16/10/2026",
            "hora": "11:45",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0548,
              "lon": -80.4547,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F29",
            "etiqueta": null,
            "codigo": null,
            "instancia": null,
            "confianza": 48,
            "estado": "Sin clasificar",
            "fecha": "16/10/2026",
            "hora": "11:48",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0546,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial"
          },
          {
            "id": "F30",
            "etiqueta": null,
            "codigo": null,
            "instancia": null,
            "confianza": 41,
            "estado": "Sin clasificar",
            "fecha": "16/10/2026",
            "hora": "11:49",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0546,
              "lon": -80.4545,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial",
            "marcas": [
              "Borrosa"
            ]
          },
          {
            "id": "F31",
            "etiqueta": "Fachada",
            "codigo": "ev_fachada",
            "instancia": "Edificación 1",
            "confianza": 97,
            "estado": "Asignada",
            "fecha": "16/10/2026",
            "hora": "09:23",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0545,
              "lon": -80.4543,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial",
            "marcas": [
              "Duplicada de F01"
            ]
          },
          {
            "id": "F32",
            "etiqueta": null,
            "codigo": null,
            "instancia": null,
            "confianza": 96,
            "estado": "Documento detectado",
            "fecha": "16/10/2026",
            "hora": "11:40",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0546,
              "lon": -80.4544,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial",
            "documento": "D1",
            "nota": "Enviada a lectura de documentos"
          },
          {
            "id": "F33",
            "etiqueta": null,
            "codigo": null,
            "instancia": null,
            "confianza": 55,
            "estado": "Sin clasificar",
            "fecha": "16/10/2026",
            "hora": "12:02",
            "canal": "App del inspector",
            "gps": {
              "lat": -1.0604,
              "lon": -80.4524,
              "precision": "± 5 m"
            },
            "dispositivo": "Samsung Galaxy A54 · App del inspector",
            "modalidad": "Presencial",
            "marcas": [
              "Fuera del predio · 640 m"
            ]
          },
          {
            "id": "F34",
            "etiqueta": "Vista satelital",
            "codigo": "ev_vista_satelital",
            "instancia": null,
            "confianza": null,
            "estado": "Asignada por el inspector",
            "fecha": "16/10/2026",
            "hora": "09:08",
            "canal": "Back-office",
            "nota": "Carga desde back-office · sin GPS",
            "metadatosArchivo": "Captura de pantalla del 16/10/2026 09:06",
            "cargadaPor": "Luis Andrade"
          }
        ],
        documentos: [
          {
            "id": "D1",
            "nombre": "Permiso de bomberos",
            "origen": "Foto F32 · documento detectado",
            "fecha": "16/10/2026 11:40",
            "paginas": 1,
            "texto": "Vista previa no disponible · Solo en el prototipo",
            "camposLeidos": [
              "rg_bom_permiso",
              "rg_bom_vigencia"
            ],
            "seguimiento": null,
            "cumpleEn": [
              "Cuerpo de bomberos › Permiso de funcionamiento"
            ]
          },
          {
            "id": "D2",
            "nombre": "Certificado de mantenimiento y recarga de extintores",
            "origen": "Carga desde back-office · PDF",
            "cargadoPor": "Luis Andrade",
            "fecha": "16/10/2026 11:52",
            "paginas": 2,
            "texto": "Vista previa no disponible · Solo en el prototipo",
            "camposLeidos": [
              "rg_pci_ext_mantenimiento",
              "rg_pci_extintores · Fecha de última recarga"
            ],
            "seguimiento": null,
            "cumpleEn": [
              "Protección contra incendios › Extintores"
            ]
          },
          {
            "id": "D3",
            "nombre": "Listado detallado y valorado de bienes",
            "origen": "Carga desde back-office · XLSX",
            "cargadoPor": "Luis Andrade",
            "fecha": "16/10/2026 11:55",
            "paginas": 1,
            "texto": "Vista previa no disponible · Solo en el prototipo",
            "camposLeidos": [
              "rg_ee_equipos"
            ],
            "seguimiento": "DOC-02",
            "cumpleEn": [
              "Equipo electrónico › Inventario"
            ],
            "nota": "Maquinaria › Equipos no aplica en este caso (módulo no activo)"
          }
        ],
        documentosNoEntregados: [
  "Planos eléctricos",
  "Informe de termografía o mantenimiento eléctrico",
  "Plan de emergencia",
  "Registro de brigadas y simulacros",
  "Bitácoras y cronograma de mantenimientos (DOC-01)"
],
      },
    },
  },

  // Resultado esperado, calculado en asesoría sobre estos datos (para comparar; nunca se escribe en pantalla)
  esperado: {
    "cobertura": {
      "inicial": "Cobertura: 13 de 21 · 0 justificadas · 8 faltan",
      "exigidas": [
        "Ubicación › Vista satelital: Cumple (F34)",
        "Linderos › Norte: Cumple (F07) · Sur: Falta, F08 por confirmar · Este: Cumple (F09) · Oeste: Falta, sin fotos",
        "Descripción constructiva › Fachada y Cubierta interior de Edificación 1 y 2: Cumple (F01, F02, F03, F04); F31 duplicada no suma",
        "Sistema eléctrico › Tablero principal abierto: Cumple (F10, F11)",
        "Protección contra incendios › Extintor: Cumple (F13, F14) · Detectores y central: Falta, F15 por confirmar",
        "Planes de gestión › Orden y aseo: Falta, 1 de 2 (F17; F16 por confirmar)",
        "Seguridad física › Cerramiento, Puertas de acceso y Central de alarma: Cumple · Cámaras: Falta, F21 por confirmar",
        "Equipo electrónico › Equipo electrónico: Falta, 2 de 3 · UPS: Cumple · Extintor del cuarto técnico: Falta, sin fotos",
        "Almacenamiento › Bodega (Bodega 1): Falta, 1 de 2 (F26; F27 por confirmar)",
      ],
      "noExigidas": "Procesos (Línea de proceso) y Combustibles (Área de combustibles): grillas vacías",
      "sinClasificar": ["F29", "F30 (Borrosa)", "F33 (Fuera del predio · 640 m)"],
      "documentosDetectados": ["F32 → D1 Permiso de bomberos"],
      "lineasIndice": { "m03": "2 etiquetas sin foto", "m07": "1", "m08": "1", "m13": "1", "m15": "2", "m18": "1" },
      "secuencia": [
        "Confirmar F08 (Lindero Sur): 14 de 21 · 0 justificadas · 7 faltan",
        "Mover F29 a Linderos › Oeste: 15 de 21 · 0 justificadas · 6 faltan; F29 queda \"Asignada por el inspector\"",
        "Justificar Extintor del cuarto técnico con \"Otro\": 15 de 21 · 1 justificada · 5 faltan",
        "Confirmar las de Orden y aseo (F16): 16 de 21 · 1 justificada · 4 faltan",
      ],
    },
    "requeridosPorPolitica": ["rg_ubi_dist_mar", "rg_ubi_dist_rio", "rg_con_anio_construccion (por edificación)", "rg_ubi_provincia (ya obligatorio)", "rg_gen_ciiu (ya obligatorio)"],
    "riesgoCiiu": "Medio (G4759)",
    "panelPorInstancia": { "Edificación 1": ["F01", "F03", "F05", "F06", "F31"], "Edificación 2": ["F02", "F04"], "Norte": ["F07"], "Sur": ["F08"], "Este": ["F09"], "Oeste": [], "Bodega 1": ["F26", "F27", "F28"] },
    "trasConfirmarSur": { "linderos": "6 de 8 · 1 por confirmar", "total": "69 de 86 (80 %) · 14 por confirmar" },
    "trasEditarManometroFila3": { "celda": "Modificado · propuesto: En zona de operación (verde) (79 %)", "proteccionIncendios": "3 de 3 · 1 por confirmar", "total": "68 de 86 (79 %) · 14 por confirmar" },
    "modulos": [
      {
        "id": "m01",
        "modulo": "Información general del riesgo",
        "estado": "Completo",
        "obligatorios": 8,
        "completos": 8,
        "porConfirmar": 0,
        "faltan": 0
      },
      {
        "id": "m02",
        "modulo": "Ubicación",
        "estado": "Completo",
        "obligatorios": 7,
        "completos": 7,
        "porConfirmar": 0,
        "faltan": 0
      },
      {
        "id": "m03",
        "modulo": "Linderos",
        "estado": "Con pendientes",
        "obligatorios": 8,
        "completos": 5,
        "porConfirmar": 2,
        "faltan": 2
      },
      {
        "id": "m04",
        "modulo": "Riesgos de la naturaleza",
        "estado": "Completo",
        "obligatorios": 7,
        "completos": 7,
        "porConfirmar": 0,
        "faltan": 0
      },
      {
        "id": "m05",
        "modulo": "Descripción constructiva",
        "estado": "Con pendientes",
        "obligatorios": 16,
        "completos": 14,
        "porConfirmar": 2,
        "faltan": 1
      },
      {
        "id": "m06",
        "modulo": "Sistema eléctrico",
        "estado": "Con pendientes",
        "obligatorios": 18,
        "completos": 11,
        "porConfirmar": 2,
        "faltan": 5
      },
      {
        "id": "m07",
        "modulo": "Protección contra incendios",
        "estado": "Con pendientes",
        "obligatorios": 3,
        "completos": 3,
        "porConfirmar": 2,
        "faltan": 0
      },
      {
        "id": "m08",
        "modulo": "Planes de gestión",
        "estado": "Con pendientes",
        "obligatorios": 3,
        "completos": 2,
        "porConfirmar": 1,
        "faltan": 0
      },
      {
        "id": "m09",
        "modulo": "Cuerpo de bomberos",
        "estado": "Completo",
        "obligatorios": 1,
        "completos": 1,
        "porConfirmar": 0,
        "faltan": 0
      },
      {
        "id": "m10",
        "modulo": "Siniestralidad",
        "estado": "Completo",
        "obligatorios": 0,
        "completos": 0,
        "porConfirmar": 0,
        "faltan": 0
      },
      {
        "id": "m11",
        "modulo": "Estimación de pérdidas",
        "estado": "Con pendientes",
        "obligatorios": 2,
        "completos": 1,
        "porConfirmar": 0,
        "faltan": 1
      },
      {
        "id": "m12",
        "modulo": "Conclusiones",
        "estado": "Sin empezar",
        "obligatorios": 1,
        "completos": 0,
        "porConfirmar": 0,
        "faltan": 1
      },
      {
        "id": "m13",
        "modulo": "Seguridad física (Robo)",
        "estado": "Con pendientes",
        "obligatorios": 6,
        "completos": 5,
        "porConfirmar": 2,
        "faltan": 0
      },
      {
        "id": "m15",
        "modulo": "Equipo electrónico",
        "estado": "Con pendientes",
        "obligatorios": 1,
        "completos": 0,
        "porConfirmar": 2,
        "faltan": 1
      },
      {
        "id": "m16",
        "modulo": "Ocupación",
        "estado": "Con pendientes",
        "obligatorios": 2,
        "completos": 1,
        "porConfirmar": 1,
        "faltan": 0
      },
      {
        "id": "m17",
        "modulo": "Procesos",
        "estado": "Sin empezar",
        "obligatorios": 0,
        "completos": 0,
        "porConfirmar": 0,
        "faltan": 0
      },
      {
        "id": "m18",
        "modulo": "Almacenamiento",
        "estado": "Con pendientes",
        "obligatorios": 3,
        "completos": 3,
        "porConfirmar": 1,
        "faltan": 0
      },
      {
        "id": "m19",
        "modulo": "Combustibles e inflamables",
        "estado": "Completo",
        "obligatorios": 0,
        "completos": 0,
        "porConfirmar": 0,
        "faltan": 0
      }
    ],
    "total": {
      "obligatorios": 86,
      "completos": 68,
      "porcentaje": 79,
      "porConfirmar": 15,
      "faltan": 11
    },
    "panelPorModulo": {
      "m01": [],
      "m02": [
        "F34"
      ],
      "m03": [
        "F07",
        "F08",
        "F09"
      ],
      "m04": [],
      "m05": [
        "F01",
        "F02",
        "F03",
        "F04",
        "F05",
        "F06",
        "F31"
      ],
      "m06": [
        "F10",
        "F11",
        "F12"
      ],
      "m07": [
        "F13",
        "F14",
        "F15"
      ],
      "m08": [
        "F16",
        "F17"
      ],
      "m09": [],
      "m10": [],
      "m11": [],
      "m12": [],
      "m13": [
        "F18",
        "F19",
        "F20",
        "F21",
        "F22"
      ],
      "m15": [
        "F23",
        "F24",
        "F25"
      ],
      "m16": [],
      "m17": [],
      "m18": [
        "F26",
        "F27",
        "F28"
      ],
      "m19": []
    }
  },
};

// ───────────────────── Redacción IA-05 (envío 5D) ─────────────────────
// Solo datos. Los textos se muestran tal cual tras "Generar informe" (respuesta simulada de IA-05 v1 Borrador).
// Cada cifra lleva el campo contra el que se valida; "Rechazada" impide aceptar el texto sin editarlo.
// Agravantes y atenuantes: la lista la calcula SIRIUS (fórmula del campo); IA-05 solo redacta el texto.
window.SIRIUS_INFORMES_RG.redaccion = {
  caso: "20195",
  motor: "IA-05",
  version: "1 · Borrador",
  simulada: true,
  fecha: "Reloj del prototipo",
  estados: ["Propuesto por IA", "Aceptado", "Editado", "Descartado", "Texto desactualizado"],
  reglas: [
    "Un texto \"Propuesto por IA\" no completa un campo obligatorio hasta que se acepta o se edita.",
    "Regenerar reemplaza solo los textos \"Propuesto por IA\"; los Aceptado, Editado y Descartado se regeneran uno a uno, con confirmación.",
    "Un texto con una cifra Rechazada no se puede aceptar sin editarlo; al editar, la cifra se vuelve a validar.",
    "Texto desactualizado: un texto Aceptado o Editado cuyos campos de origen cambiaron después; ofrece Revisar y Regenerar.",
    "Ningún texto cita puntajes, bandas ni niveles del modelo.",
    "Generar con obligatorios vacíos o fotos sin clasificar muestra un aviso con \"Generar igual\".",
    "Sin IA-05 disponible: botón no disponible con su motivo; los campos de texto se escriben a mano.",
  ],
  textos: [
    { clave: "rg_gen_perfil", modulo: "Información general",
      texto: "Local comercial y bodega de Alfredo Antonio Mendoza en Portoviejo, dedicado desde 2009 a la venta al por menor de aparatos eléctricos de uso doméstico, muebles y otros enseres (CIIU G4759). El predio tiene 1.150 m² y dos edificaciones: el local comercial, de 420 m², y la bodega posterior, de 380 m².",
      origen: ["rg_gen_asegurado", "rg_ubi_canton", "rg_gen_anio_inicio", "rg_gen_ciiu", "rg_ubi_area_predio", "rg_con_area"],
      cifras: [
        { cifra: "2009", contra: "rg_gen_anio_inicio", resultado: "Validada" },
        { cifra: "1.150 m²", contra: "rg_ubi_area_predio", resultado: "Validada" },
        { cifra: "420 m²", contra: "rg_con_area@Edificación 1", resultado: "Validada" },
        { cifra: "380 m²", contra: "rg_con_area@Edificación 2", resultado: "Validada" },
      ] },
    { clave: "rg_con_descripcion", instancia: "Edificación 1", modulo: "Descripción constructiva",
      texto: "Edificación de 420 m² construida en 2008, de 1 a 3 pisos y sin subsuelos, con estructura de hormigón armado, paredes de hormigón o bloque y losa de hormigón. Su estado de conservación es bueno.",
      origen: ["rg_con_area", "rg_con_anio_construccion", "rg_con_pisos", "rg_con_subsuelos", "rg_con_estructura", "rg_con_paredes", "rg_con_techo", "rg_con_conservacion"],
      cifras: [
        { cifra: "420 m²", contra: "rg_con_area@Edificación 1", resultado: "Validada" },
        { cifra: "2008", contra: "rg_con_anio_construccion@Edificación 1", resultado: "Validada" },
      ] },
    { clave: "rg_con_descripcion", instancia: "Edificación 2", modulo: "Descripción constructiva",
      texto: "Bodega de 380 m² construida en 2013, de 1 a 3 pisos y sin subsuelos, con paredes mixtas y cubierta metálica o de teja. Su estado de conservación es regular.",
      origen: ["rg_con_area", "rg_con_anio_construccion", "rg_con_pisos", "rg_con_subsuelos", "rg_con_paredes", "rg_con_techo", "rg_con_conservacion"],
      cifras: [
        { cifra: "380 m²", contra: "rg_con_area@Edificación 2", resultado: "Validada" },
        { cifra: "2013", contra: "rg_con_anio_construccion@Edificación 2", resultado: "Rechazada", valorCampo: "2015" },
      ],
      aviso: "La cifra 2013 no coincide con su campo (2015). Edita el texto para aceptarlo." },
    { clave: "rg_con_observaciones", instancia: "Edificación 1", modulo: "Descripción constructiva",
      texto: "Los medios de egreso existen y están libres.",
      origen: ["rg_con_medios_egreso"], cifras: [] },
    { clave: "rg_con_observaciones", instancia: "Edificación 2", modulo: "Descripción constructiva",
      texto: "La conservación regular y la cubierta metálica o de teja hacen a la bodega más vulnerable que el local comercial; conviene revisar su mantenimiento.",
      origen: ["rg_con_conservacion", "rg_con_techo"], cifras: [] },
    { clave: "rg_nat_descripcion", instancia: "Sísmico", modulo: "Riesgos de la naturaleza",
      texto: "El predio está en la zona sísmica VI (Z = 0,50) y la exposición registrada es alta.",
      origen: ["rg_nat_zona_sismica", "rg_nat_exposicion"],
      cifras: [ { cifra: "0,50", contra: "rg_nat_zona_sismica", resultado: "Validada" } ] },
    { clave: "rg_nat_descripcion", instancia: "Inundación", modulo: "Riesgos de la naturaleza",
      texto: "Exposición baja. El río más cercano está a 1,4 km y el predio se ubica a 53 m s. n. m.",
      origen: ["rg_nat_exposicion", "rg_ubi_dist_rio", "rg_ubi_altitud"],
      cifras: [
        { cifra: "1,4 km", contra: "rg_ubi_dist_rio", resultado: "Validada" },
        { cifra: "53 m s. n. m.", contra: "rg_ubi_altitud", resultado: "Validada" },
      ] },
    { clave: "rg_nat_descripcion", instancia: "Volcánico", modulo: "Riesgos de la naturaleza",
      texto: "Exposición baja.", origen: ["rg_nat_exposicion"], cifras: [] },
    { clave: "rg_nat_descripcion", instancia: "Vientos y rayos", modulo: "Riesgos de la naturaleza",
      texto: "Exposición media. No hay pararrayos; el inspector registra que no se requieren porque las edificaciones no tienen estructuras elevadas.",
      origen: ["rg_nat_exposicion", "rg_nat_pararrayos", "rg_nat_requiere_pararrayos", "rg_nat_justificacion_pararrayos"], cifras: [] },
    { clave: "rg_nat_descripcion", instancia: "Deslizamiento", modulo: "Riesgos de la naturaleza",
      texto: "Exposición baja.", origen: ["rg_nat_exposicion"], cifras: [] },
    { clave: "rg_lin_descripcion", instancia: "Norte", modulo: "Linderos",
      texto: "Colinda con la vía pública, a 12 m.", origen: ["rg_lin_tipo_riesgo", "rg_lin_distancia"],
      cifras: [ { cifra: "12 m", contra: "rg_lin_distancia@Norte", resultado: "Validada" } ] },
    { clave: "rg_lin_descripcion", instancia: "Sur", modulo: "Linderos",
      texto: "Colinda con vivienda o riesgo ligero de 1 a 2 pisos, en mampostería confinada, a 3 m.",
      origen: ["rg_lin_tipo_riesgo", "rg_lin_altura_colindante", "rg_lin_tipo_estructura", "rg_lin_distancia"],
      cifras: [ { cifra: "3 m", contra: "rg_lin_distancia@Sur", resultado: "Validada" } ] },
    { clave: "rg_lin_descripcion", instancia: "Este", modulo: "Linderos",
      texto: "Colinda con un comercio de 1 a 2 pisos, sin separación (0 m).",
      origen: ["rg_lin_tipo_riesgo", "rg_lin_altura_colindante", "rg_lin_distancia"],
      cifras: [ { cifra: "0 m", contra: "rg_lin_distancia@Este", resultado: "Validada" } ] },
    { clave: "rg_pmp_escenario", instancia: "Escenario 1", modulo: "Pérdida máxima probable",
      texto: "Incendio en la bodega posterior, de 380 m², con mercancía clase III en estanterías apiladas hasta 3,5 m y USD 120.000 en existencias. Se estima una afectación de 40–60 % del valor asegurable y una paralización de 1 a 3 meses.",
      origen: ["rg_alm_area", "rg_alm_clase_mercancia", "rg_alm_tipo", "rg_alm_altura_apilamiento", "rg_alm_valor", "rg_pmp_afectacion", "rg_pmp_paralizacion"],
      cifras: [
        { cifra: "380 m²", contra: "rg_alm_area@Bodega 1", resultado: "Validada" },
        { cifra: "3,5 m", contra: "rg_alm_altura_apilamiento@Bodega 1", resultado: "Validada" },
        { cifra: "USD 120.000", contra: "rg_alm_valor@Bodega 1", resultado: "Validada" },
        { cifra: "40–60 %", contra: "rg_pmp_afectacion@Escenario 1", resultado: "Validada" },
      ] },
    { clave: "rg_cnc_agravantes", parte: "texto", modulo: "Conclusiones",
      texto: "No hay brigadas ni se han hecho simulacros, y el plan de emergencia existe pero no se entregó. La central de detección es local o manual, sin señales acústicas y ópticas en todas las zonas, y no hay red hídrica. El orden y aseo es regular o parcial, el mantenimiento eléctrico es correctivo y no hay vigilancia humana.",
      origen: ["rg_ges_brigadas", "rg_ges_simulacros", "rg_ges_plan_emergencia", "rg_pci_det_central", "rg_pci_det_senales", "rg_pci_red_existe", "rg_ges_orden_aseo", "rg_ele_mantenimiento", "rg_rob_vig_existe"],
      cifras: [] },
    { clave: "rg_cnc_atenuantes", parte: "texto", modulo: "Conclusiones",
      texto: "El permiso de bomberos está vigente hasta el 31/12/2026 y los extintores están señalizados, con mantenimiento vigente. La estación de bomberos está a 2,1 km (6 min). El cerramiento es de hormigón o bloque de más de 2,00 m, con concertina; hay CCTV IP con monitoreo remoto y 30 días de grabación, alarma con monitoreo remoto y una UPC a 0,8 km.",
      origen: ["rg_bom_permiso", "rg_bom_vigencia", "rg_pci_ext_senalizados", "rg_pci_ext_mantenimiento", "rg_bom_distancia", "rg_bom_tiempo", "rg_rob_cerramiento", "rg_rob_cerramiento_altura", "rg_rob_proteccion_adicional", "rg_rob_cctv_tipo", "rg_rob_cctv_monitoreo_remoto", "rg_rob_cctv_resguardo_dias", "rg_rob_alarma_monitoreo", "rg_rob_upc_distancia"],
      cifras: [
        { cifra: "31/12/2026", contra: "rg_bom_vigencia", resultado: "Validada" },
        { cifra: "2,1 km", contra: "rg_bom_distancia (respaldo)", resultado: "Validada" },
        { cifra: "6 min", contra: "rg_bom_tiempo (respaldo)", resultado: "Validada" },
        { cifra: "30 días", contra: "rg_rob_cctv_resguardo_dias", resultado: "Validada" },
        { cifra: "0,8 km", contra: "rg_rob_upc_distancia (respaldo)", resultado: "Validada" },
      ] },
    { clave: "rg_cnc_resumen", modulo: "Conclusiones",
      texto: "Riesgo comercial en Portoviejo, con dos edificaciones que suman 800 m² en zona sísmica VI. Las protecciones contra incendio están vigentes, pero no hay brigadas, simulacros ni red hídrica, y la bodega posterior está en conservación regular. La seguridad física combina cerramiento alto, CCTV, alarma monitoreada y una UPC cercana. El entrevistado declara que no hubo siniestros en los últimos 5 años.",
      origen: ["rg_gen_giro", "rg_con_area", "rg_nat_zona_sismica", "rg_bom_permiso", "rg_ges_brigadas", "rg_ges_simulacros", "rg_pci_red_existe", "rg_con_conservacion", "rg_rob_cerramiento", "rg_rob_cctv_existe", "rg_rob_alarma_monitoreo", "rg_rob_upc_distancia", "rg_sin_declarado"],
      cifras: [
        { cifra: "800 m²", contra: "Suma de rg_con_area (420 + 380)", resultado: "Validada" },
        { cifra: "5 años", contra: "rg_sin_declarado", resultado: "Validada" },
      ] },
  ],
  omitidos: [
    { clave: "rg_nat_descripcion", instancia: "Maremoto", motivo: "Faltan datos: Exposición" },
    { clave: "rg_lin_descripcion", instancia: "Oeste", motivo: "Faltan datos: Tipo de riesgo colindante" },
    { clave: "rg_pro_descripcion", motivo: "Sin procesos registrados" },
  ],
  esperado: {
    aviso: "Generar al inicio: aviso con 18 obligatorios sin completar y 3 fotos sin clasificar; \"Generar igual\" continúa.",
    generacion: "17 textos Propuesto por IA, 3 omitidos con su motivo; cifras 24 de 25 validadas, 1 rechazada (2013 en Edificación 2).",
    obligatorios: "rg_pmp_escenario y rg_cnc_resumen cuentan como completos solo al aceptarlos o editarlos: tras aceptar ambos, el informe baja de 18 a 16 obligatorios sin completar. Si alguno no estaba entre los vacíos, informarlo en Diferencias.",
    rechazada: "Edificación 2: Aceptar no disponible con motivo; al editar 2013 a 2015 queda Editado y la cifra Validada.",
    desactualizado: "Aceptar el texto de Edificación 1 y cambiar rg_con_conservacion@Edificación 1 a \"Regular\": el texto pasa a Texto desactualizado con Revisar y Regenerar.",
    regenerar: "Con Edificación 1 Aceptada y Edificación 2 Editada, Regenerar reemplaza los 15 Propuesto por IA y pide confirmación uno a uno para los otros 2.",
    sinMotor: "Con la simulación de IA-05 apagada: Generar informe no disponible con \"IA-05 no disponible · escribe los textos a mano\"; los campos de texto quedan editables.",
    sinPuntajes: "Ningún texto cita puntajes ni bandas.",
  },
};

// ---------------------------------------------------------------------------------------------------------------
// v1.4 · Informe Enviado y completo (estado base de 20195 desde la etapa 6). Se aplica sobre casos["20195"] en este orden.
// Las escenas infrgev, infrgevcob, infrgdoc, infrgctx, infrgrevini, infrgrev, infrgpun, infrgpunadm e infrgenvdes NO lo aplican.
window.SIRIUS_INFORMES_RG.envio = {
  caso: "20195",
  enviadoPor: "Luis Andrade",
  fecha: "18/10/2026 20:30",
  estadoInforme: "Enviado",                 // solo lectura (DEC-029)
  estadoCaso: "En calificación",
  responsable: "Verónica Lema",
  visita: { codigo: "V1", estado: "Realizada" },

  // 1) Todo lo "Por confirmar" (campos, filas y celdas de grillas) pasa a Confirmado, con su valor propuesto sin cambios.
  confirmarTodo: { confirmadoPor: "Luis Andrade", fecha: "18/10/2026 20:05" },

  // 2) Los 11 obligatorios vacíos, con valor (origen Manual)
  valores: [
    { clave: "rg_lin_tipo_riesgo", instancia: "Oeste", valor: "Vivienda o riesgo ligero", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_lin_distancia", instancia: "Oeste", valor: 3, origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_con_medios_egreso", instancia: "Edificación 2", valor: "Existen y libres", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_ele_chk_03", valor: "No", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" }, nota: "Antes: No visible en las fotos" },
    { clave: "rg_ele_chk_14", valor: "No", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_ele_chk_15", valor: "No", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_ele_chk_16", valor: "No", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_ele_chk_17", valor: "No", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    { clave: "rg_ee_plan_mantenimiento", valor: "Interno con registro", origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:10" } },
    // rg_pmp_escenario (Escenario 1) y rg_cnc_resumen: se completan al aceptar su texto (punto 5).
  ],

  // 3) Fotos y cobertura
  fotos: [
    { id: "F29", etiqueta: "Lindero", codigo: "ev_lindero", instancia: "Oeste", estado: "Asignada por el inspector" },
    { ids: ["F05", "F08", "F12", "F15", "F16", "F20", "F21", "F27", "F28"], estado: "Confirmada" },
    { id: "F30", estado: "Excluida", motivo: "Foto borrosa, sin valor como evidencia" },
    { id: "F33", estado: "Excluida", motivo: "Tomada fuera del predio (640 m)" },
  ],
  justificaciones: [
    { modulo: "Equipo electrónico", etiqueta: "Extintor del cuarto técnico", motivo: "Otro", texto: "El predio no tiene cuarto técnico" },
    { modulo: "Equipo electrónico", etiqueta: "Equipo electrónico", motivo: "Área inaccesible o restringida", texto: "Tercer equipo en rack cerrado por el proveedor" },
  ],

  // 4) Documentos: D4 nuevo. DOC-01 (D4) y DOC-02 (D3) se muestran al calificador "Adjunto en el informe, por revisar".
  documentos: [
    { id: "D4", nombre: "Bitácoras y cronograma de mantenimientos", origen: "Carga desde back-office · PDF", cargadoPor: "Luis Andrade",
      fecha: "18/10/2026 20:00", paginas: 3, texto: "Vista previa no disponible · Solo en el prototipo", camposLeidos: [], seguimiento: "DOC-01",
      cumpleEn: ["Equipo electrónico › Mantenimiento"] },
  ],
  documentosNoEntregadosQuitar: ["Bitácoras y cronograma de mantenimientos (DOC-01)"],
  seguimientosAdjuntos: [
    { codigo: "DOC-01", documento: "D4", estado: "Adjunto en el informe, por revisar" },
    { codigo: "DOC-02", documento: "D3", estado: "Adjunto en el informe, por revisar" },
  ],

  // 5) Redacción (IA-05): 17 textos → 15 Aceptado, 1 Editado, 1 Texto desactualizado; 3 omitidos sin cambio.
  textos: {
    todos: "Aceptado",
    excepciones: [
      { clave: "rg_con_descripcion", instancia: "Edificación 2", estado: "Editado", cambio: "2013 → 2015; cifra Validada" },
      { clave: "rg_lin_descripcion", instancia: "Norte", estado: "Texto desactualizado",
        causa: "rg_lin_distancia@Norte cambió de 12 a 15 después de aceptar el texto (el texto aún dice 12 m)" },
    ],
  },
  // Cambio posterior a la aceptación (origen del texto desactualizado; no alimenta ningún criterio)
  cambiosPosteriores: [
    { clave: "rg_lin_distancia", instancia: "Norte", valor: 15, anterior: 12, origen: { tipo: "Manual", persona: "Luis Andrade", fecha: "18/10/2026 20:25" } },
  ],
  enviarIgual: "Al enviar, la validación mostró 1 texto desactualizado y el inspector eligió Enviar igual",

  // Resultado esperado, calculado en asesoría con motor-calificacion.js y Scoring V3 vigente (nunca se escribe en pantalla)
  esperado: {
    obligatorios: "86 de 86 (100 %) · 0 por confirmar · 0 por confirmar no obligatorios",
    cobertura: "19 de 21 · 2 justificadas · 0 faltan",
    redaccion: "17 textos: 15 Aceptado, 1 Editado, 1 Texto desactualizado (Linderos › Norte) · 3 omitidos",
    marca: "1 texto desactualizado",
    puntaje: {
      "Incendio y líneas aliadas": "53,9 · Subestándar (A 72,6 % · B 45,7 % · C1 40,0 %)",
      "Robo": "62,2 · Subestándar (A 72,6 % · B 45,7 % · C2 80,0 %)",
      "Equipo electrónico": "56,6 · Subestándar (A 72,6 % · B 45,7 % · C3 50,0 %; C.9 No aplica)",
      "Incendio y Robo (informativo, composición por confirmar)": "57,8 · Subestándar",
    },
    criterios: "A.1 5,15 · A.2 6,05 · A.3 3,58 · A.4 4 · A.5 3 · B.1 3 · B.2 4 · B.3 6 · B.4 3 · C.1 3 · C.2 5 · C.3 0 (oculto por condición, DEC-025) · C.4 0 · C.5 5 · C.6 7 · C.7 2 · C.8 2 · C.10 1 · C.11 1",
    sinDato: 0,
    severidad: "Ninguna regla se activa. C1 queda exactamente en 40,0 %: no es módulo crítico (la regla exige menos de 40)",
    politicas: "Ninguna se activa ni queda sin evaluar",
    dec025: "Sin efecto numérico en 20195: C.3 ya valía 0 («Sin red»); ahora muestra «Oculto por condición»",
    pruebaGarantias: "53,9 · 62,2 · 56,6 (antes 53,9 · 62,2 · 55; cambia Equipo electrónico por C.11)",
    garantiasMatriz: {
      "Incendio y líneas aliadas · Comercial": ["GAR-INC-01", "GAR-INC-02", "GAR-INC-03"],
      "Robo · Comercial": ["GAR-ROB-01"],
      "Equipo electrónico": ["DOC-01 (adjunto, por revisar)", "DOC-02 (adjunto, por revisar)"],
      plazoSiSeAceptanTodas: "90 días (GAR-INC-03)",
    },
  },
};

// ---------------------------------------------------------------------------------------------------------------
// v1.5 · Calificación de 20195 (BO-27, envío 6C). Solo datos; la pantalla no redacta ni calcula propuestas por su cuenta.
window.SIRIUS_INFORMES_RG.calificacion = {
  caso: "20195",

  // Respuesta simulada de IA-06 (Asistente de calificación). Se ejecuta al abrir la calificación. "Respuesta simulada · Solo en el prototipo".
  asistente: {
    motor: "IA-06", version: "1 · Borrador", simulada: true, fecha: "18/10/2026 20:30",
    veredicto: [
      { ramo: "Incendio y líneas aliadas", sugerido: "Asegurable con garantías" },
      { ramo: "Robo", sugerido: "Asegurable con garantías" },
      { ramo: "Equipo electrónico", sugerido: "Asegurable con garantías" },
    ],
    resumen: "Local comercial y bodega en Portoviejo (800 m², zona sísmica VI). Los tres ramos quedan en Subestándar. " +
      "En incendio, el permiso y los extintores están vigentes, pero la detección es local, sin señales en todas las zonas, sin red hídrica, " +
      "sin brigadas ni simulacros, y el plan de emergencia no se entregó. En robo, el cerramiento, la alarma y el CCTV compensan la falta de vigilancia humana. " +
      "En equipo electrónico no hay cuarto técnico y la extinción es solo con PQS.",
    planAccion: [
      "Centralizar la detección y completar señales acústicas y ópticas en todas las zonas.",
      "Entregar y aprobar el plan de emergencia, con brigada y un simulacro anual.",
      "Contratar guardianía o justificar la protección actual de robo.",
    ],
    garantiasAdicionales: [
      { codigo: "GAR-INC-07", ramo: "Incendio y líneas aliadas",
        justificacion: "El plan de emergencia existe pero no se entregó, no hay brigadas y nunca se hicieron simulacros.",
        evidencia: ["rg_ges_plan_emergencia = Existe pero no se entregó", "rg_ges_brigadas = No", "rg_ges_simulacros = Nunca"] },
    ],
    recomendaciones: [
      { codigo: "REC-02", ramos: ["Incendio y líneas aliadas", "Equipo electrónico"],
        justificacion: "No hay planos eléctricos actualizados y el mantenimiento eléctrico es correctivo.",
        evidencia: ["rg_ele_chk_14 = No", "rg_ele_mantenimiento = Correctivo"] },
      { codigo: "REC-05", ramos: ["Incendio y líneas aliadas", "Equipo electrónico"],
        justificacion: "Zona sísmica VI con exposición alta; la bodega tiene estanterías con apilamiento de 3,5 m.",
        evidencia: ["rg_nat_zona_sismica = Zona VI · Z = 0,50", "rg_nat_exposicion (Sísmico) = Alta", "rg_alm_altura_apilamiento (Bodega 1) = 3,5 m"] },
    ],
    preexistencias: [],      // vacío: "El asistente no observó preexistencias con evidencia"
    noAplica: [],            // vacío: "Sin propuestas de No aplica"
  },

  // Propuesta de garantías esperada (calculada en asesoría con la matriz v1.1, la severidad de Scoring V3 y el campo "cumplido" del catálogo)
  esperado: {
    propuestas: [
      { codigo: "GAR-INC-03", ramo: "Incendio y líneas aliadas", origen: "Mínimo del esquema · Incendio y líneas aliadas · Comercial", plazo: 90, estado: "Propuesta" },
      { codigo: "GAR-INC-07", ramo: "Incendio y líneas aliadas", origen: "Propuesta por el asistente", plazo: 90, estado: "Propuesta" },
      { codigo: "GAR-ROB-01", ramo: "Robo", origen: "Mínimo del esquema · Robo · Comercial", plazo: 30, estado: "Propuesta" },
    ],
    informativos: [
      { codigo: "GAR-INC-01", estado: "Ya cumple", motivo: "rg_bom_permiso = Vigente del año en curso" },
      { codigo: "GAR-INC-02", estado: "Ya cumple", motivo: "C.2 = 5" },
    ],
    documentos: [
      { codigo: "DOC-01", estado: "Adjunto en el informe, por revisar", documento: "D4", acciones: ["Dar por recibido", "Pedir de nuevo (seguimiento, 30 días)"] },
      { codigo: "DOC-02", estado: "Adjunto en el informe, por revisar", documento: "D3", acciones: ["Dar por recibido", "Pedir de nuevo (seguimiento, 30 días)"] },
    ],
    recomendaciones: ["REC-02", "REC-05"],
    severidad: "Ninguna regla exige garantías",
    nivel2: "No requiere evaluación de suscripción",
    alAbrir: "3 propuestas sin decidir · 2 documentos por revisar · Guardar veredicto no disponible: «Decide las 3 propuestas y los 2 documentos»",
    secuencia: [
      "Aceptar todas: 3 garantías aceptadas · plazo global 90 días",
      "Descartar GAR-INC-07 (del asistente, sin motivo): 2 aceptadas · plazo global 90 días (GAR-INC-03)",
      "Editar GAR-INC-03 a 60 días (pide motivo): plazo global 60 días",
      "Descartar GAR-ROB-01 (mínimo del esquema): pide motivo de 10 caracteres o más",
      "Dar por recibidos DOC-01 y DOC-02: Guardar veredicto disponible",
      "Veredicto por ramo: por defecto el resultado de la banda (Asegurable con garantías); elegir otro pide motivo",
    ],
  },
};

// ───────────────────── v1.6 · Bloque f3 (bloque S, S0b · DEC-067, DEC-069 y DEC-070) ─────────────────────
// Se aplica junto con envio (estado base Enviado de 20195). Las escenas de la etapa 5 (Borrador) no lo aplican.
// Textos: respuesta simulada de IA-05 v1 para los 12 campos de observaciones del ajuste F3, generados después del último cambio
//   (Linderos › Norte, 20:25), aceptados por el inspector antes de enviar. Ninguno cita puntajes, bandas ni niveles (DEC-021).
// Fotos: mapas de referencia y rutas son respuestas simuladas de IA-04 (Contexto externo); las demás, del inspector.
window.SIRIUS_INFORMES_RG.f3 = {
  caso: "20195",
  motor: "IA-05", version: "1", simulada: true,
  generado: "18/10/2026 20:26", aceptadoPor: "Luis Andrade", aceptado: "18/10/2026 20:27",
  textos: [
    { clave: "rg_lin_observaciones", modulo: "Linderos", estado: "Aceptado",
      texto: "El predio colinda al norte con una vía pública, a 15 m, que actúa como franja de separación y facilita el acceso de los bomberos. Al sur y al oeste colinda con viviendas o riesgos ligeros a 3 m; al sur, la edificación vecina es de 1 a 2 pisos en mampostería confinada. La principal exposición está al este: un comercio de 1 a 2 pisos sin separación (0 m), que favorece la propagación de un incendio entre predios. No se registró la altura de las edificaciones del cliente, por lo que no se evaluaron las distancias mínimas por colapso y golpeteo.",
      origen: ["rg_lin_tipo_riesgo", "rg_lin_distancia", "rg_lin_altura_colindante", "rg_lin_tipo_estructura"],
      cifras: [{ cifra: "15 m", contra: "rg_lin_distancia@Norte", resultado: "Validada" }, { cifra: "3 m", contra: "rg_lin_distancia@Sur", resultado: "Validada" }, { cifra: "3 m", contra: "rg_lin_distancia@Oeste", resultado: "Validada" }, { cifra: "0 m", contra: "rg_lin_distancia@Este", resultado: "Validada" }] },
    { clave: "rg_nat_observaciones", modulo: "Riesgos de la naturaleza", estado: "Aceptado",
      texto: "La amenaza dominante es la sísmica: el predio está en la zona VI (Z = 0,50) con exposición alta, lo que exige atención a los elementos no estructurales y a las estanterías de la bodega. La exposición a vientos y rayos es media; no hay pararrayos y el inspector registra que no se requieren porque las edificaciones no tienen estructuras elevadas. Las amenazas de inundación, volcánica y de deslizamiento son bajas: el río más cercano está a 1.400 m y el predio a 53 m s. n. m. El maremoto no aplica: el mar está a 24.300 m.",
      origen: ["rg_nat_zona_sismica", "rg_nat_exposicion", "rg_nat_pararrayos", "rg_nat_requiere_pararrayos", "rg_nat_justificacion_pararrayos", "rg_ubi_dist_rio", "rg_ubi_altitud", "rg_ubi_dist_mar"],
      cifras: [{ cifra: "Z = 0,50", contra: "rg_nat_zona_sismica", resultado: "Validada" }, { cifra: "1.400 m", contra: "rg_ubi_dist_rio", resultado: "Validada" }, { cifra: "53 m", contra: "rg_ubi_altitud", resultado: "Validada" }, { cifra: "24.300 m", contra: "rg_ubi_dist_mar", resultado: "Validada" }] },
    { clave: "rg_ocu_observaciones", modulo: "Ocupación", estado: "Aceptado",
      texto: "La actividad es la venta al por menor de aparatos eléctricos de uso doméstico, muebles y otros enseres (CIIU G4759), con atención al público en el local comercial y la mercancía en la bodega posterior. La carga combustible es moderada y la ocupación corresponde a riesgo ordinario según NFPA. No se registraron procesos productivos. Trabajan 9 personas en un turno: 6 en ventas y 3 en bodega.",
      origen: ["rg_gen_ciiu", "rg_ocu_carga_combustible", "rg_ocu_riesgo_nfpa", "rg_gen_personal"],
      cifras: [{ cifra: "9 personas", contra: "rg_gen_personal · suma de Número", resultado: "Validada" }, { cifra: "6", contra: "rg_gen_personal · Ventas", resultado: "Validada" }, { cifra: "3", contra: "rg_gen_personal · Bodega", resultado: "Validada" }] },
    { clave: "rg_alm_observaciones", modulo: "Almacenamiento", estado: "Aceptado",
      texto: "La bodega posterior, de 380 m², guarda mercancía clase III en estanterías apiladas hasta 3,5 m, con una separación al techo de 0,90 m o más y pasillos libres. El valor almacenado declarado es de $120.000. Por la altura de apilamiento y la zona sísmica, la estabilidad de las estanterías es un punto de atención.",
      origen: ["rg_alm_area", "rg_alm_clase_mercancia", "rg_alm_tipo", "rg_alm_altura_apilamiento", "rg_alm_separacion_techo", "rg_alm_pasillos_libres", "rg_alm_valor"],
      cifras: [{ cifra: "380 m²", contra: "rg_alm_area@Bodega 1", resultado: "Validada" }, { cifra: "3,5 m", contra: "rg_alm_altura_apilamiento@Bodega 1", resultado: "Validada" }, { cifra: "$120.000", contra: "rg_alm_valor@Bodega 1", resultado: "Validada" }] },
    { clave: "rg_cmb_observaciones", modulo: "Combustibles e inflamables", estado: "Aceptado",
      texto: "No se registraron sustancias combustibles o inflamables almacenadas y no se usa GLP en el predio.",
      origen: ["rg_cmb_sustancias", "rg_cmb_glp"], cifras: [] },
    { clave: "rg_ee_observaciones", modulo: "Equipo electrónico", estado: "Aceptado",
      texto: "El inventario registra 5 grupos de equipos por $19.650: un servidor, computadores de escritorio, terminales de punto de venta, una impresora multifunción y el equipo de red con las cámaras IP. No hay cuarto técnico: el servidor está en la oficina. La puesta a tierra es visible pero no se ha medido; hay circuitos dedicados y una UPS con 15 minutos de autonomía, sin supresor de picos ni generador. La extinción disponible es solo con PQS, que puede dañar los equipos. El mantenimiento es interno, con registro, y hay respaldo de datos.",
      origen: ["rg_ee_equipos", "rg_ee_cuarto_existe", "rg_ee_tierra", "rg_ee_circuitos_dedicados", "rg_ee_ups", "rg_ee_ups_autonomia", "rg_ee_supresor", "rg_ee_generador", "rg_ee_extintor_tipo", "rg_ee_plan_mantenimiento", "rg_ee_respaldo_datos"],
      cifras: [{ cifra: "5 grupos", contra: "rg_ee_equipos · filas", resultado: "Validada" }, { cifra: "$19.650", contra: "rg_ee_equipos · suma de Valor (USD)", resultado: "Validada" }, { cifra: "15 minutos", contra: "rg_ee_ups_autonomia", resultado: "Validada" }] },
    { clave: "rg_ele_observaciones", modulo: "Sistema eléctrico", estado: "Aceptado",
      texto: "El estado físico de la instalación es aceptable: los tableros están rotulados y accesibles, no hay cables expuestos ni conexiones improvisadas, las protecciones están en buen estado, las cajas tienen tapa y la puesta a tierra es visible. Las brechas son de documentación y de seguridad ocupacional: no hay planos eléctricos actualizados ni procedimientos de emergencia exhibidos, no se identificaron los equipos con potencial de arco y no hay EPP dieléctrico, herramientas aisladas ni bloqueo y etiquetado. El mantenimiento eléctrico es correctivo.",
      origen: ["rg_ele_chk_01", "rg_ele_chk_02", "rg_ele_chk_03", "rg_ele_chk_04", "rg_ele_chk_05", "rg_ele_chk_06", "rg_ele_chk_10", "rg_ele_chk_11", "rg_ele_chk_13", "rg_ele_chk_14", "rg_ele_chk_15", "rg_ele_chk_16", "rg_ele_mantenimiento"], cifras: [] },
    { clave: "rg_rob_observaciones", modulo: "Seguridad física (Robo)", estado: "Aceptado",
      texto: "El cerramiento es un muro de hormigón o bloque de más de 2,00 m con concertina, y las puertas y ventanas tienen rejas. No hay vigilancia humana. El CCTV es IP, cableado, con cobertura parcial en zonas críticas, monitoreo remoto sin monitoreo en sitio y 30 días de grabación. La alarma se activa por sensores de movimiento y la monitorea una empresa o las autoridades; no hay botón de pánico. La UPC Andrés de Vera está a menos de 1 km, con respuesta en menos de 5 minutos.",
      origen: ["rg_rob_cerramiento", "rg_rob_cerramiento_altura", "rg_rob_proteccion_adicional", "rg_rob_puertas", "rg_rob_ventanas", "rg_rob_vig_existe", "rg_rob_cctv_tipo", "rg_rob_cctv_conexion", "rg_rob_cctv_cobertura", "rg_rob_cctv_monitoreo_situ", "rg_rob_cctv_monitoreo_remoto", "rg_rob_cctv_resguardo_dias", "rg_rob_alarma_activacion", "rg_rob_alarma_monitoreo", "rg_rob_boton_panico", "rg_rob_upc_nombre", "rg_rob_upc_distancia", "rg_rob_upc_tiempo"],
      cifras: [{ cifra: "30 días", contra: "rg_rob_cctv_resguardo_dias", resultado: "Validada" }] },
    { clave: "rg_pci_observaciones", modulo: "Protección contra incendios", estado: "Aceptado",
      texto: "Hay 7 extintores para 6 requeridos según NFPA 10 en riesgo ordinario: 4 de PQS de 10 lb en el local, 1 de CO2 en el área de caja y 2 de PQS de 20 lb en la bodega, señalizados y con mantenimiento vigente (última recarga el 15/03/2026). La detección es por humo, con 6 detectores para 10 requeridos según NFPA 72, central local o manual y sin señales acústicas y ópticas en todas las zonas. No hay red hídrica.",
      origen: ["rg_pci_extintores", "rg_pci_ext_requeridos", "rg_pci_ext_senalizados", "rg_pci_ext_mantenimiento", "rg_pci_det_tipo", "rg_pci_det_instalados", "rg_pci_det_requeridos", "rg_pci_det_central", "rg_pci_det_senales", "rg_pci_red_existe"],
      cifras: [{ cifra: "7 extintores", contra: "rg_pci_extintores · suma de Cantidad", resultado: "Validada" }, { cifra: "6 requeridos", contra: "rg_pci_ext_requeridos", resultado: "Validada" }, { cifra: "15/03/2026", contra: "rg_pci_extintores · Fecha de última recarga", resultado: "Validada" }, { cifra: "6 detectores", contra: "rg_pci_det_instalados", resultado: "Validada" }, { cifra: "10 requeridos", contra: "rg_pci_det_requeridos", resultado: "Validada" }] },
    { clave: "rg_ges_observaciones", modulo: "Planes de gestión", estado: "Aceptado",
      texto: "El plan de emergencia existe pero no se entregó para su revisión; no hay brigadas y nunca se han hecho simulacros. El orden y aseo es regular o parcial. No hay certificación de gestión, y el control de trabajos en caliente y en altura no aplica a la actividad.",
      origen: ["rg_ges_plan_emergencia", "rg_ges_brigadas", "rg_ges_simulacros", "rg_ges_orden_aseo", "rg_ges_cert_gestion", "rg_ges_trabajos_caliente", "rg_ges_trabajos_altura"], cifras: [] },
    { clave: "rg_bom_observaciones", modulo: "Cuerpo de bomberos", estado: "Aceptado",
      texto: "El permiso de funcionamiento está vigente para el año en curso, hasta el 31/12/2026, según el documento leído. La estación más cercana es la Estación N.° 1 de Portoviejo, a entre 1 y 5 km, con un tiempo de respuesta de 5 a 10 minutos.",
      origen: ["rg_bom_permiso", "rg_bom_vigencia", "rg_bom_estacion", "rg_bom_distancia", "rg_bom_tiempo"],
      cifras: [{ cifra: "31/12/2026", contra: "rg_bom_vigencia", resultado: "Validada" }] },
    { clave: "rg_sin_observaciones", modulo: "Siniestralidad", estado: "Aceptado",
      texto: "La consulta a la fuente no devolvió siniestros registrados, y el entrevistado declara que no hubo siniestros en los últimos 5 años.",
      origen: ["rg_sin_siniestros", "rg_sin_declarado"], cifras: [] },
  ],

  // Fotos nuevas (F35 a F45). Mapas y rutas: canal "Contexto externo", sin GPS ni dispositivo, leyenda con la fuente.
  fotos: [
    { id: "F35", etiqueta: "Mapa de referencia de amenaza", codigo: "ev_mapa_amenaza", instancia: "Sísmico", estado: "Asignada", canal: "Contexto externo", fuente: "Zonificación sísmica NEC-15 · Simulada" },
    { id: "F36", etiqueta: "Mapa de referencia de amenaza", codigo: "ev_mapa_amenaza", instancia: "Inundación", estado: "Asignada", canal: "Contexto externo", fuente: "Amenaza por inundación SNGR · Simulada" },
    { id: "F37", etiqueta: "Mapa de referencia de amenaza", codigo: "ev_mapa_amenaza", instancia: "Volcánico", estado: "Asignada", canal: "Contexto externo", fuente: "Amenaza volcánica IG-EPN · Simulada" },
    { id: "F38", etiqueta: "Mapa de referencia de amenaza", codigo: "ev_mapa_amenaza", instancia: "Vientos y rayos", estado: "Asignada", canal: "Contexto externo", fuente: "Vientos y tormentas INAMHI · Simulada" },
    { id: "F39", etiqueta: "Mapa de referencia de amenaza", codigo: "ev_mapa_amenaza", instancia: "Deslizamiento", estado: "Asignada", canal: "Contexto externo", fuente: "Susceptibilidad a movimientos en masa SNGR · Simulada" },
    { id: "F40", etiqueta: "Ruta a la estación de bomberos", codigo: "ev_ruta_bomberos", estado: "Asignada", canal: "Contexto externo", fuente: "CNX-04 Servicio de mapas · Simulada" },
    { id: "F41", etiqueta: "Ruta a la UPC", codigo: "ev_ruta_upc", estado: "Asignada", canal: "Contexto externo", fuente: "CNX-04 Servicio de mapas · Simulada" },
    { id: "F42", etiqueta: "Actividad y mercancía", codigo: "ev_actividad", estado: "Asignada", confianza: 94, fecha: "16/10/2026", hora: "09:31", canal: "App del inspector", gps: { lat: -1.0546, lon: -80.4544, precision: "± 5 m" }, dispositivo: "Samsung Galaxy A54 · App del inspector", modalidad: "Presencial" },
    { id: "F43", etiqueta: "Actividad y mercancía", codigo: "ev_actividad", estado: "Asignada", confianza: 92, fecha: "16/10/2026", hora: "09:33", canal: "App del inspector", gps: { lat: -1.0546, lon: -80.4545, precision: "± 5 m" }, dispositivo: "Samsung Galaxy A54 · App del inspector", modalidad: "Presencial" },
    { id: "F44", etiqueta: "Señalización de evacuación", codigo: "ev_senal_evacuacion", estado: "Asignada", confianza: 90, fecha: "16/10/2026", hora: "10:48", canal: "App del inspector", gps: { lat: -1.0547, lon: -80.4545, precision: "± 5 m" }, dispositivo: "Samsung Galaxy A54 · App del inspector", modalidad: "Presencial" },
    { id: "F45", etiqueta: "Tablero secundario", codigo: "ev_tablero_secundario", instancia: "Edificación 2", estado: "Asignada", confianza: 93, fecha: "16/10/2026", hora: "10:12", canal: "App del inspector", gps: { lat: -1.0548, lon: -80.4546, precision: "± 5 m" }, dispositivo: "Samsung Galaxy A54 · App del inspector", modalidad: "Presencial" },
  ],

  esperado: {
    redaccion: "29 textos: 27 Aceptado, 1 Editado, 1 Texto desactualizado (Linderos › Norte) · 3 omitidos (antes 17: 15, 1 y 1)",
    cifras: "Las 24 cifras de los 12 textos nuevos, Validadas",
    fotos: "45 en el informe: 42 válidas para la salida (sin F30 y F33, excluidas, ni F32, documento)",
    obligatorios: "86 de 86 sin cambio",
    cobertura: "19 de 21 · 2 justificadas, sin cambio",
    calificacion: "Sin cambio: ningún campo nuevo alimenta criterios del modelo",
  },
};

// ───────────────────── v1.7 · Observaciones de las fotos (DEC-074, galería) ─────────────────────
// Leyenda propuesta por IA-01 (simulada) y aceptada por el inspector antes de enviar; en mapas y rutas, la fuente.
// Se aplica junto con envio y f3 (estado Enviado). En Borrador las fotos no tienen observación ("Sin observación").
// Máximo 200 caracteres. Es la misma leyenda que usa el Informe técnico ("Foto N · etiqueta · instancia · observación").
window.SIRIUS_INFORMES_RG.observacionesFotos = {
  caso: "20195", origen: "IA-01 v1 · Simulada", aceptadoPor: "Luis Andrade", aceptado: "18/10/2026 20:28",
  fotos: {
    F01: "Local comercial de 1 a 3 pisos, con paredes de hormigón o bloque y losa de hormigón; buen estado de conservación.",
    F31: "Acceso principal del local comercial sobre la Av. Manabí.",
    F02: "Bodega posterior con paredes mixtas y cubierta metálica o de teja; conservación regular.",
    F03: "Losa de hormigón del local comercial.",
    F04: "Cubierta metálica o de teja de la bodega posterior.",
    F05: "Estructura de hormigón armado del local comercial.",
    F06: "Medios de egreso existentes y libres.",
    F07: "Vía pública al norte, a 15 m.",
    F08: "Vivienda o riesgo ligero de 1 a 2 pisos en mampostería confinada, a 3 m.",
    F09: "Comercio de 1 a 2 pisos colindante, sin separación (0 m).",
    F29: "Vivienda o riesgo ligero al oeste, a 3 m.",
    F34: "Vista satelital del predio de 1.150 m² con sus dos edificaciones.",
    F35: "Zonificación sísmica NEC-15 · zona VI (Z = 0,50) · Simulada",
    F36: "Amenaza por inundación SNGR · exposición baja · Simulada",
    F37: "Amenaza volcánica IG-EPN · exposición baja · Simulada",
    F38: "Vientos y tormentas INAMHI · exposición media · Simulada",
    F39: "Movimientos en masa SNGR · exposición baja · Simulada",
    F40: "Ruta a la Estación N.° 1 de Portoviejo: entre 1 y 5 km, de 5 a 10 minutos · CNX-04 · Simulada",
    F41: "Ruta a la UPC Andrés de Vera: menos de 1 km, menos de 5 minutos · CNX-04 · Simulada",
    F42: "Exhibición de electrodomésticos y muebles en el local comercial.",
    F43: "Mercancía en exhibición; carga combustible moderada.",
    F10: "Tablero principal rotulado y accesible, con tapa.",
    F11: "Protecciones del tablero principal en buen estado.",
    F45: "Tablero secundario de la bodega posterior.",
    F12: "Puesta a tierra visible, sin medición registrada.",
    F13: "Extintor de PQS de 10 lb señalizado, recargado el 15/03/2026.",
    F14: "Extintor de CO2 de 10 lb en el área de caja.",
    F15: "Detector de humo; la central es local o manual.",
    F16: "Orden y aseo regular o parcial.",
    F17: "Área de trabajo con orden y aseo regular o parcial.",
    F44: "Señalización de evacuación; el plan de emergencia no se entregó.",
    F18: "Muro de hormigón o bloque de más de 2,00 m con concertina.",
    F19: "Puertas de acceso con rejas.",
    F20: "Ventanas con rejas.",
    F21: "Cámara IP cableada; cobertura parcial en zonas críticas.",
    F22: "Central de alarma con sensores de movimiento y monitoreo remoto.",
    F23: "Servidor Dell PowerEdge T150 en la oficina, sin cuarto técnico.",
    F24: "Terminales de punto de venta Epson en el área de caja.",
    F25: "UPS con 15 minutos de autonomía; sin supresor de picos.",
    F26: "Bodega posterior de 380 m² con estanterías.",
    F27: "Mercancía clase III en estanterías; pasillos libres.",
    F28: "Apilamiento hasta 3,5 m, con separación al techo de 0,90 m o más.",
  },
  esperado: {
    galeria: "44 tarjetas con \"Todas\" (45 fotos menos F32, que es documento): 42 con número \"Foto N\" igual al del Informe técnico y 2 Excluidas sin número (F30 y F33)",
    filtros: "Por confirmar 0 (todas confirmadas al enviar) · Excluidas 2 · Mapas y rutas 7 (F35 a F41) · Sin observación 2 (las Excluidas)",
    observaciones: "42, todas de 200 caracteres o menos",
  },
};
