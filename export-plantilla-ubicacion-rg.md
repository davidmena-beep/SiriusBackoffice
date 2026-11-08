# Exportación · Ubicación – Ramos Generales v1

Solo lectura. Generada desde `datos-ejemplo.js` (plantilla «Ubicación – Ramos Generales» v1, Vigente, desde 2026-10-18, alcance: Ramos de ubicación, captura: Libre). Ajustes F1, F2 y F3 aplicados (motivos: «Correcciones previas al informe de Ramos Generales», «Alineación del informe con los motores y la cobertura de evidencia» y «Observaciones por capítulo y evidencias de contexto para el Informe técnico»; F3 del 18/10/2026 20:15, Andrea Salazar).

**Campos: 238 de captura + 3 espejos = 241 en la lista.** Los espejos son de solo lectura, sin valor propio, leen de su clave original y no cuentan como campos de captura. Elegibles para IA: 75. Etiquetas de evidencia declaradas: 47.

Separador de opciones: « ¦ ». «Visible si» muestra clave = valor; vacío = siempre visible. «Criterio» viene de Scoring V3. «Requerida» de una etiqueta: «es igual a», «es distinto de» y «tiene al menos» se leen tal cual.

## m01 · Información general del riesgo

- Categoría: Común · Prefijo: `rg_gen_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 16

### Asegurado y entrevista

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_gen_asegurado` | Asegurado | Texto |  | Sí | No |  | No |  | Solicitud · nombre del asegurado · Bloqueado para el inspector · Precarga: Solicitud: nombre del asegurado |
| `rg_gen_ruc` | Identificación (cédula o RUC) | Texto |  | Sí | No |  | No |  | Solicitud · tipo y número de identificación del asegurado · Bloqueado para el inspector · Precarga: Solicitud: tipo y número de identificación del asegurado · Se muestra con el tipo ("Cédula · 1309876543"). Contexto externo (CNX-03) solo consulta si el tipo es RUC de sociedad. |
| `rg_gen_representante_legal` | Representante legal | Texto |  | No | No |  | No |  | Contexto externo · SCVS |
| `rg_gen_entrevistado` | Nombre del entrevistado | Texto |  | Sí | No |  | No |  | Inspector |
| `rg_gen_cargo_entrevistado` | Cargo del entrevistado | Texto |  | Sí | No |  | No |  | Inspector |
| `rg_gen_telefono` | Teléfono | Texto |  | No | No |  | No |  | Inspector |
| `rg_gen_email` | Correo electrónico | Texto |  | No | No |  | No |  | Inspector |
| `rg_gen_tipo_propiedad` | Tipo de propiedad | Opción única | Propio ¦ Arrendado ¦ Comodato | Sí | No |  | No |  | Inspector |
| `rg_gen_anio_inicio` | Año de inicio de operaciones | Número |  | Sí | No |  | No |  | Inspector |

### Información laboral

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_gen_personal` | Personal por categoría | Grilla | Columnas: Categoría ¦ Número ¦ Turnos ¦ Horario inicio ¦ Horario fin ¦ Jornadas | No | No |  | No |  | Inspector · Filas libres: el inspector usa «Agregar fila» |

### Información económica

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_gen_giro` | Tipo de riesgo (giro) | Catálogo | Casa habitación ¦ Edificios ¦ HORECA ¦ Educación ¦ Comercial ¦ Servicios ¦ Construcción ¦ Industrial ¦ Estación de servicios ¦ Cooperativas | Sí | No |  | No |  | Solicitud · Precargado desde el giro de la solicitud; el inspector puede corregirlo |
| `rg_gen_ciiu` | Ocupación (CIIU) | Catálogo |  | Sí | No |  | No |  | Inspector · Catálogo CIIU |
| `rg_gen_objeto_social` | Objeto social | Texto |  | No | No |  | No |  | Contexto externo · SCVS |
| `rg_gen_fecha_constitucion` | Fecha de constitución | Fecha |  | No | No |  | No |  | Contexto externo · SCVS |
| `rg_gen_situacion_legal` | Situación legal | Texto |  | No | No |  | No |  | Contexto externo · SCVS |
| `rg_gen_perfil` | Perfil del riesgo | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m02 · Ubicación

- Categoría: Común · Prefijo: `rg_ubi_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 13

### Ubicación geográfica

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ubi_direccion` | Dirección | Texto |  | Sí | No |  | No |  | Solicitud |
| `rg_ubi_parroquia` | Parroquia | Texto |  | No | No |  | No |  | Inspector |
| `rg_ubi_canton` | Cantón | Catálogo |  | Sí | No |  | No |  | Solicitud · cantón de la solicitud · Precarga: Solicitud: cantón · Precargado de la solicitud (Nueva solicitud, paso 3). Si el inspector lo cambia, queda Modificado con el valor de la solicitud |
| `rg_ubi_provincia` | Provincia | Catálogo |  | Sí | No |  | No |  | Solicitud · provincia de la solicitud · Precarga: Solicitud: provincia · Precargado de la solicitud (Nueva solicitud, paso 3). Si el inspector lo cambia, queda Modificado con el valor de la solicitud |
| `rg_ubi_region` | Región | Cálculo | Costa ¦ Sierra ¦ Oriente ¦ Galápagos · Fórmula: Según la provincia (catálogo provincia → región) | No | No |  | No |  | Sistema |
| `rg_ubi_latitud` | Latitud | Número |  | Sí | No |  | No |  | Inspector · Desde el GPS de las fotos o el mapa |
| `rg_ubi_longitud` | Longitud | Número |  | Sí | No |  | No |  | Inspector · Desde el GPS de las fotos o el mapa |
| `rg_ubi_altitud` | Altitud | Número | Unidad: m s. n. m. | No | No |  | No |  | Contexto externo |

### Predio y edificaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ubi_area_predio` | Área del predio | Número | Unidad: m² | No | No |  | No |  | Inspector |
| `rg_ubi_num_edificaciones` | Número de edificaciones | Cálculo | Fórmula: Cuenta de edificaciones en Descripción constructiva | No | No |  | No |  | Inspector |
| `rg_ubi_area_construccion` | Área de construcción | Cálculo | Fórmula: Suma de las áreas en Descripción constructiva · Unidad: m² | No | No |  | No |  | Inspector |
| `rg_ubi_dist_mar` | Distancia al mar | Número | Unidad: m | No | No |  | No |  | Contexto externo · Distancia geográfica |
| `rg_ubi_dist_rio` | Distancia al río | Número | Unidad: m | No | No |  | No |  | Contexto externo · Distancia geográfica |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Vista satelital (`ev_vista_satelital`) | Sí | 1 | No | `rg_ubi_latitud`, `rg_ubi_longitud`, `rg_ubi_area_predio` |

## m03 · Linderos

- Categoría: Común · Prefijo: `rg_lin_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: 4 fijos: Norte, Sur, Este, Oeste
- Campos de captura: 8

### Lindero · repetible: fijo (Norte, Sur, Este, Oeste)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_lin_tipo_riesgo` | Tipo de riesgo colindante | Catálogo | Vía pública ¦ Vivienda o riesgo ligero ¦ Comercio ¦ Industria ¦ Baldío ¦ Río o quebrada ¦ Otro | Sí | No |  | Sí | B.4 Linderos | Inspector |
| `rg_lin_descripcion` | Descripción | Texto |  | No | No |  | Sí |  | Inspector · El alias cambia según el lindero |
| `rg_lin_altura_colindante` | Altura del colindante | Opción única | 1–2 pisos ¦ 3–5 pisos ¦ Más de 5 | No | Sí |  | No |  | Inspector · No aplica si es vía pública |
| `rg_lin_tipo_estructura` | Tipo de estructura | Catálogo | Hormigón armado ¦ Mampostería confinada ¦ Metálica ¦ Madera ¦ Mixta | No | Sí |  | Sí |  | Inspector |
| `rg_lin_distancia` | Distancia al colindante | Número | Unidad: m | Sí | No |  | No |  | Inspector |
| `rg_lin_dist_min_colapso` | Distancia mínima por colapso | Cálculo | Fórmula: Por definir · Unidad: m | No | No |  | No |  | Inspector · Cálculo normativo |
| `rg_lin_dist_min_golpeteo` | Distancia mínima por golpeteo | Cálculo | Fórmula: Por definir · Unidad: m | No | No |  | No |  | Inspector · Cálculo normativo |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Lindero (`ev_lindero`) | Sí | 1 | Sí | `rg_lin_tipo_riesgo`, `rg_lin_altura_colindante`, `rg_lin_tipo_estructura`, `rg_lin_distancia` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_lin_observaciones` | Observaciones de los linderos | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m04 · Riesgos de la naturaleza

- Categoría: Común · Prefijo: `rg_nat_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 7

### Zona sísmica

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_nat_zona_sismica` | Zona sísmica y factor Z | Texto |  | No | No |  | No |  | Contexto externo · Zona y factor Z según el cantón |

### Amenazas · repetible: fijo (Sísmico, Inundación, Volcánico, Vientos y rayos, Maremoto, Deslizamiento)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_nat_exposicion` | Exposición | Opción única | Baja ¦ Media ¦ Alta | Sí | Sí |  | No |  | Inspector |
| `rg_nat_descripcion` | Descripción de la amenaza | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Mapa de referencia de amenaza (`ev_mapa_amenaza`) | No | 0 | Sí | `rg_nat_exposicion` |

### Protección contra rayos

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_nat_pararrayos` | ¿Tiene pararrayos? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_nat_requiere_pararrayos` | ¿Requiere pararrayos? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_nat_justificacion_pararrayos` | Justificación | Texto |  | Sí | No | rg_nat_requiere_pararrayos = No | No |  | Inspector |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_nat_observaciones` | Observaciones de los riesgos de la naturaleza | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m05 · Descripción constructiva

- Categoría: Común · Prefijo: `rg_con_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: Por edificación
- Campos de captura: 18

### Datos · repetible: libre (edif, por edificación)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_con_nombre` | Nombre de la edificación | Texto |  | Sí | No |  | No |  | Inspector |
| `rg_con_area` | Área | Número | Unidad: m² | Sí | No |  | No |  | Inspector |
| `rg_con_descripcion` | Descripción | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Fachada (`ev_fachada`) | Sí | 1 | Sí | `rg_con_pisos`, `rg_con_conservacion`, `rg_con_paredes` |

### Altura · repetible: libre (edif, por edificación)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_con_pisos` | Número de pisos | Opción única | 1–3 ¦ 4–6 ¦ Más de 6 | Sí | No |  | No | A.4 Pisos y altura | Inspector |
| `rg_con_altura_m` | Altura | Número | Unidad: m | No | No |  | No |  | Inspector |
| `rg_con_subsuelos` | Subsuelos | Opción única | Sin subsuelos ¦ 1 ¦ 2 o más | No | No |  | No | A.4 Pisos y altura | Inspector |

### Edad y conservación · repetible: libre (edif, por edificación)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_con_anio_construccion` | Año de construcción | Número |  | No | No |  | No |  | Inspector |
| `rg_con_edad` | Edad | Cálculo | Fórmula: Año actual − año de construcción · Unidad: años | No | No |  | No |  | Inspector |
| `rg_con_conservacion` | Estado de conservación | Opción única | Excelente o nuevo ¦ Bueno ¦ Regular ¦ Malo | Sí | No |  | Sí | A.3 Estado | Inspector |

### Materiales · repetible: libre (edif, por edificación)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_con_paredes` | Paredes | Opción única | Hormigón o bloque ¦ Metálica con gypsum ¦ Mixta ¦ Madera o combustible | Sí | No |  | Sí | A.1 Paredes | Inspector |
| `rg_con_techo` | Techo | Opción única | Losa de hormigón ¦ Metálico o teja ¦ Traslúcido más de 30 % ¦ Paja o madera | Sí | No |  | Sí | A.2 Techos | Inspector |
| `rg_con_estructura` | Estructura | Opción única | Hormigón armado ¦ Acero protegido ¦ Acero sin protección ¦ Madera ¦ Mixta | No | No |  | Sí |  | Inspector |
| `rg_con_entrepisos` | Entrepisos | Opción única | Losa de hormigón ¦ Metálico ¦ Madera | No | Sí |  | No |  | Inspector |
| `rg_con_resistencia_fuego` | Resistencia al fuego | Opción única | RF 120 ¦ RF 90 ¦ RF 60 ¦ RF 30 ¦ Sin RF | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Estructura y entrepisos (`ev_estructura`) | No | 0 | Sí | `rg_con_estructura`, `rg_con_entrepisos` |
| Cubierta interior (`ev_cubierta_interior`) | Sí | 1 | Sí | `rg_con_techo` |

### Separación y egreso · repetible: libre (edif, por edificación)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_con_dist_edificio_cercano` | Distancia al edificio más cercano | Número | Unidad: m | No | No |  | No |  | Inspector |
| `rg_con_medios_egreso` | Medios de egreso | Opción única | Existen y libres ¦ No existen u obstruidos | Sí | No |  | Sí | A.5 Medios de egreso | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Medios de egreso (`ev_medios_egreso`) | No | 0 | Sí | `rg_con_medios_egreso` |

### Cierre · repetible: libre (edif, por edificación)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_con_observaciones` | Observaciones | Texto |  | No | No |  | Sí |  | IA · Texto redactado |
| `rg_con_preexistencias` | Preexistencias | Texto |  | No | No |  | No |  | Inspector · Alimenta las preexistencias del caso |

## m06 · Sistema eléctrico

- Categoría: Común · Prefijo: `rg_ele_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 20

### Lista de verificación

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ele_chk_01` | Tableros rotulados y accesibles | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_02` | Cables expuestos o mal canalizados | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_03` | Conexiones improvisadas o empalmes sin protección | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_04` | Protecciones en buen estado | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_05` | Cajas de conexión con tapa | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_06` | Puesta a tierra visible | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_07` | Señalización de riesgo eléctrico | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_08` | Sin polvo, humedad ni inflamables junto a equipos | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_09` | Accesos a tableros libres | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_10` | EPP dieléctrico | Sí/No | Sí ¦ No | Sí | Sí |  | No |  | Inspector |
| `rg_ele_chk_11` | Herramientas aisladas | Sí/No | Sí ¦ No | Sí | Sí |  | No |  | Inspector |
| `rg_ele_chk_12` | Zonas de aproximación NFPA 70E | Sí/No | Sí ¦ No | Sí | Sí |  | No |  | Inspector |
| `rg_ele_chk_13` | Bloqueo y etiquetado (LOTO) | Sí/No | Sí ¦ No | Sí | Sí |  | No |  | Inspector |
| `rg_ele_chk_14` | Planos eléctricos actualizados | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_15` | Procedimientos de emergencia exhibidos | Sí/No | Sí ¦ No | Sí | No |  | Sí |  | Inspector |
| `rg_ele_chk_16` | Equipos con potencial de arco identificados | Sí/No | Sí ¦ No | Sí | Sí |  | Sí |  | Inspector |
| `rg_ele_chk_17` | Barreras o distancias de seguridad por arco | Sí/No | Sí ¦ No | Sí | Sí |  | Sí |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Tablero principal abierto (`ev_tablero_principal`) | Sí | 1 | No | `rg_ele_chk_01`, `rg_ele_chk_02`, `rg_ele_chk_03`, `rg_ele_chk_04`, `rg_ele_chk_05`, `rg_ele_chk_06`, `rg_ele_chk_07`, `rg_ele_chk_08`, `rg_ele_chk_09`, `rg_ele_chk_16`, `rg_ele_chk_17` |
| Tablero secundario (`ev_tablero_secundario`) | No | 0 | Sí | `rg_ele_chk_01`, `rg_ele_chk_02`, `rg_ele_chk_03`, `rg_ele_chk_04`, `rg_ele_chk_05`, `rg_ele_chk_07`, `rg_ele_chk_08`, `rg_ele_chk_09` |
| Puesta a tierra (`ev_puesta_tierra`) | No | 0 | No | `rg_ele_chk_06` |
| Señalización y procedimientos (`ev_senal_procedimientos`) | No | 0 | No | `rg_ele_chk_07`, `rg_ele_chk_15` |
| Seguridad eléctrica ocupacional (`ev_seguridad_ocupacional`) | No | 0 | No | `rg_ele_chk_10`, `rg_ele_chk_11`, `rg_ele_chk_12`, `rg_ele_chk_13` |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Planos eléctricos | No | Sí |  | `rg_ele_chk_14` |

### Mantenimiento

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ele_mantenimiento` | Tipo de mantenimiento | Opción única | Predictivo o termografía ¦ Preventivo con bitácora ¦ Correctivo ¦ Ninguno | Sí | No |  | Sí | B.1 Mantenimiento eléctrico | Inspector |
| `rg_ele_ultima_termografia` | Fecha de la última termografía | Fecha |  | No | No | rg_ele_mantenimiento = Predictivo o termografía | Sí |  | Inspector |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Informe de termografía o mantenimiento eléctrico | No | Sí |  | `rg_ele_mantenimiento`, `rg_ele_ultima_termografia` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ele_observaciones` | Observaciones del sistema eléctrico | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m07 · Protección contra incendios

- Categoría: Común · Prefijo: `rg_pci_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 17

### Extintores

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_pci_ext_existe` | ¿Tiene extintores? | Sí/No | Sí ¦ No | Sí | No |  | No | C.2 Extintores | Inspector |
| `rg_pci_extintores` | Extintores | Grilla | Columnas: Agente (PQS, CO2, Agua, Agente limpio, Clase K) ¦ Capacidad (lb) ¦ Cantidad ¦ Ubicación ¦ Fecha de última recarga ¦ Estado del manómetro (opción única, elegible para IA: En zona de operación (verde) ¦ Descargado (zona roja izquierda) ¦ Sobrecargado (zona roja derecha)) | No | No | rg_pci_ext_existe = Sí | Sí | C.2 Extintores | Inspector · Filas libres: el inspector usa «Agregar fila» |
| `rg_pci_tipo_riesgo` | Tipo de riesgo según NFPA 10 | Opción única | Ligero ¦ Ordinario ¦ Extra | No | No |  | No |  | Inspector |
| `rg_pci_ext_requeridos` | Extintores requeridos | Cálculo | Fórmula: Área construida ÷ cobertura por tipo de riesgo (Ligero 278,7 m²) | No | No |  | No | C.2 Extintores | Inspector · Cálculo normativo |
| `rg_pci_ext_senalizados` | ¿Están señalizados? | Sí/No | Sí ¦ No | No | No |  | Sí |  | Inspector |
| `rg_pci_ext_mantenimiento` | Mantenimiento de extintores | Opción única | Vigente con etiqueta ¦ Vencido ¦ Sin evidencia | No | No |  | Sí | C.2 Extintores | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Extintor (`ev_extintor`) | Si rg_pci_ext_existe es igual a Sí | 1 | No | `rg_pci_extintores`, `rg_pci_ext_senalizados`, `rg_pci_ext_mantenimiento` |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Certificado de mantenimiento y recarga de extintores | No | Sí |  | `rg_pci_ext_mantenimiento`, `rg_pci_extintores` |

### Detección y alarma

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_pci_det_existe` | ¿Tiene detección y alarma? | Sí/No | Sí ¦ No | Sí | No |  | No | C.1 Detección | Inspector |
| `rg_pci_det_tipo` | Tipo de detección | Opción múltiple | Humo ¦ Temperatura ¦ Llama ¦ Gas ¦ Pulsadores manuales | No | No |  | Sí |  | Inspector |
| `rg_pci_det_instalados` | Detectores instalados | Número |  | No | No |  | No |  | Inspector |
| `rg_pci_det_requeridos` | Detectores requeridos | Cálculo | Fórmula: Área construida ÷ 84 m² | No | No |  | No |  | Inspector · Cálculo normativo |
| `rg_pci_det_central` | Central de alarma | Opción única | Centralizada, zonificada y supervisada ¦ Local o manual ¦ No tiene | No | No |  | No | C.1 Detección | Inspector |
| `rg_pci_det_senales` | Señales acústicas y ópticas en todas las zonas | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Detectores y central (`ev_detectores_central`) | Si rg_pci_det_existe es igual a Sí | 1 | No | `rg_pci_det_tipo`, `rg_pci_det_central` |

### Red hídrica

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_pci_red_existe` | ¿Tiene red hídrica? | Sí/No | Sí ¦ No | Sí | No |  | No |  | Inspector |
| `rg_pci_red_tipo` | Tipo de red | Opción múltiple | Rociadores ¦ Gabinetes con bomba ¦ Gabinetes sin bomba ¦ Hidrantes | No | No | rg_pci_red_existe = Sí | No | C.3 Red hídrica | Inspector |
| `rg_pci_reserva_m3` | Reserva de agua | Número | Unidad: m³ | No | No |  | No |  | Inspector |
| `rg_pci_reserva_exclusiva` | ¿Reserva exclusiva para incendios? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Gabinetes o rociadores (`ev_gabinetes_rociadores`) | Si rg_pci_red_existe es igual a Sí | 1 | No | `rg_pci_red_tipo` |
| Tanque de reserva (`ev_tanque_reserva`) | Si rg_pci_reserva_exclusiva es igual a Sí | 1 | No | `rg_pci_reserva_exclusiva` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_pci_observaciones` | Observaciones de la protección contra incendios | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m08 · Planes de gestión

- Categoría: Común · Prefijo: `rg_ges_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 13

### Plan de emergencia y brigadas

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ges_plan_emergencia` | Plan de emergencia | Opción única | Entregado y vigente ¦ Existe pero no se entregó ¦ No existe | Sí | No |  | Sí |  | Inspector |
| `rg_ges_plan_evaluacion` | Evaluación del plan | Opción única | Adecuado ¦ Parcial ¦ Deficiente | No | No | rg_ges_plan_emergencia = Entregado y vigente | No |  | Inspector |
| `rg_ges_brigadas` | ¿Tiene brigadas de emergencia? | Sí/No | Sí ¦ No | Sí | No |  | Sí | C.4 Brigadas | Inspector |
| `rg_ges_simulacros` | Simulacros | Opción única | En el último año ¦ Hace más de un año ¦ Nunca | No | No |  | Sí |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Señalización de evacuación (`ev_senal_evacuacion`) | No | 0 | No | `rg_ges_plan_evaluacion`, `rg_con_medios_egreso` |
| Punto de encuentro (`ev_punto_encuentro`) | No | 0 | No | `rg_ges_plan_evaluacion`, `rg_ges_simulacros` |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Plan de emergencia | No | Sí |  | `rg_ges_plan_emergencia` |
| Registro de brigadas y simulacros | No | Sí |  | `rg_ges_brigadas`, `rg_ges_simulacros` |

### Orden, mantenimiento y certificaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ges_orden_aseo` | Orden y aseo | Opción única | Excelente ¦ Regular o parcial ¦ Malo | Sí | No |  | Sí | B.2 Orden y aseo | Inspector |
| `rg_ges_cert_gestion` | ¿Tiene certificación de gestión? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_ges_cert_gestion_cual` | ¿Cuál certificación? | Texto |  | No | No | rg_ges_cert_gestion = Sí | No |  | Inspector |
| `rg_ges_mant_equipos` | ¿Hay mantenimiento de equipos? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_ges_trabajos_caliente` | ¿Hay control de trabajos en caliente? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |
| `rg_ges_trabajos_altura` | ¿Hay control de trabajos en altura? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |
| `rg_ges_cert_ambiental` | ¿Tiene certificación ambiental? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |
| `rg_ges_cert_social` | ¿Tiene certificación social? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Orden y aseo (`ev_orden_aseo`) | Sí | 2 | No | `rg_ges_orden_aseo` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ges_observaciones` | Observaciones de los planes de gestión | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m09 · Cuerpo de bomberos

- Categoría: Común · Prefijo: `rg_bom_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 6

### Permiso de funcionamiento

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_bom_permiso` | Permiso de bomberos | Opción única | Vigente del año en curso ¦ Vencido ¦ No presentado | Sí | No |  | Sí |  | Inspector |
| `rg_bom_vigencia` | Vigencia del permiso | Fecha |  | No | No |  | Sí |  | IA · Lectura del documento |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Permiso de bomberos | No | Sí |  | `rg_bom_permiso`, `rg_bom_vigencia` |

### Estación más cercana

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_bom_estacion` | Estación de bomberos | Texto |  | No | No |  | No |  | Contexto externo · Editable por el inspector |
| `rg_bom_distancia` | Distancia a la estación | Opción única | Menos de 1 km ¦ 1 a 5 km ¦ Más de 5 km | No | No |  | No |  | Contexto externo · Editable por el inspector |
| `rg_bom_tiempo` | Tiempo de respuesta | Opción única | Menos de 5 min ¦ 5 a 10 min ¦ Más de 10 min | No | No |  | No |  | Contexto externo · Editable por el inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Ruta a la estación de bomberos (`ev_ruta_bomberos`) | No | 0 | No | `rg_bom_distancia`, `rg_bom_tiempo` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_bom_observaciones` | Observaciones del cuerpo de bomberos | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m10 · Siniestralidad

- Categoría: Común · Prefijo: `rg_sin_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 4

### Historial de siniestros

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_sin_siniestros` | Siniestros registrados | Grilla | Columnas: Ramo ¦ Fecha ¦ Estado (Reportado, Liquidado, Pagado, Pago parcial) ¦ Monto (USD) | No | No |  | No |  | Contexto externo · SCVS · Filas desde el contexto externo |
| `rg_sin_declarado` | Siniestralidad declarada | Texto |  | No | No |  | No |  | Inspector · Lo que informa el entrevistado |
| `rg_sin_cantidad_5_anios` | Siniestros en los últimos 5 años | Cálculo | Fórmula: Cuenta de filas de la grilla con fecha en los últimos 5 años | No | No |  | No |  | Inspector |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_sin_observaciones` | Observaciones de la siniestralidad | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m11 · Estimación de pérdidas

- Categoría: Común · Prefijo: `rg_pmp_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: Por escenario
- Campos de captura: 4

### Escenario · repetible: libre (esc, por escenario)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_pmp_escenario` | Descripción del escenario | Texto |  | Sí | No |  | Sí |  | IA · Texto redactado |
| `rg_pmp_afectacion` | Afectación del valor asegurable | Opción única | 0–20 % ¦ 20–40 % ¦ 40–60 % ¦ 60–80 % ¦ 80–100 % | Sí | No |  | No |  | Inspector |
| `rg_pmp_interrupcion` | ¿Hay interrupción del negocio? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_pmp_paralizacion` | Tiempo de paralización | Opción única | Menos de 1 mes ¦ 1 a 3 meses ¦ 3 a 6 meses ¦ 6 a 9 meses ¦ Más de 9 meses | No | No | rg_pmp_interrupcion = Sí | No |  | Inspector |

## m12 · Conclusiones

- Categoría: Común · Prefijo: `rg_cnc_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 4

### Conclusiones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_cnc_agravantes` | Factores agravantes | Texto | Fórmula: Lista desde los criterios en las dos bandas más bajas | No | No |  | Sí |  | IA · Lista calculada más texto redactado |
| `rg_cnc_atenuantes` | Factores atenuantes | Texto | Fórmula: Lista desde los criterios en la banda más alta | No | No |  | Sí |  | IA · Lista calculada más texto redactado |
| `rg_cnc_resumen` | Resumen ejecutivo | Texto |  | Sí | No |  | Sí |  | IA · Texto redactado |
| `rg_cnc_recomendacion_inspector` | Recomendación del inspector | Texto |  | No | No |  | No |  | Inspector · No influye en la calificación |

## m13 · Seguridad física (Robo)

- Categoría: Por ramo · Prefijo: `rg_rob_` · Versión 1 (Vigente)
- Se incluye: Solo si el caso incluye Robo
- Repetible: No
- Campos de captura: 30

### Cerramiento y accesos

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_rob_cerramiento` | Cerramiento perimetral | Opción única | Muro de hormigón o bloque ¦ Reja metálica ¦ Malla ¦ Mixto ¦ Abierto | Sí | No |  | Sí | C.5 Seguridad física | Inspector |
| `rg_rob_cerramiento_altura` | Altura del cerramiento | Opción única | Menos de 1,50 m ¦ 1,50 a 2,00 m ¦ Más de 2,00 m | No | No |  | No |  | Inspector |
| `rg_rob_proteccion_adicional` | Protección adicional | Opción múltiple | Cerco eléctrico ¦ Concertina ¦ Alambre de púas ¦ Ninguna | No | No |  | No | C.5 Seguridad física | Inspector |
| `rg_rob_puertas` | Protección de puertas | Opción única | Blindaje ¦ Rejas ¦ Láminas de seguridad ¦ Sin protección | Sí | No |  | Sí |  | Inspector |
| `rg_rob_ventanas` | Protección de ventanas | Opción única | Blindaje ¦ Rejas ¦ Láminas de seguridad ¦ Sin protección | Sí | No |  | Sí |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Cerramiento (`ev_cerramiento`) | Sí | 1 | No | `rg_rob_cerramiento`, `rg_rob_cerramiento_altura`, `rg_rob_proteccion_adicional` |
| Puertas de acceso (`ev_puertas_acceso`) | Sí | 1 | No | `rg_rob_puertas` |
| Ventanas (`ev_ventanas`) | No | 0 | No | `rg_rob_ventanas` |

### Guardianía

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_rob_vig_existe` | ¿Tiene vigilancia humana? | Sí/No | Sí ¦ No | Sí | No |  | No | C.6 Vigilancia y CCTV | Inspector |
| `rg_rob_vig_tipo` | Tipo de vigilancia | Opción única | Empresa de seguridad privada ¦ Personal propio ¦ Conserje | No | No | rg_rob_vig_existe = Sí | No |  | Inspector |
| `rg_rob_vig_armada` | ¿Vigilancia armada? | Sí/No | Sí ¦ No | No | No | rg_rob_vig_existe = Sí | No |  | Inspector |
| `rg_rob_vig_rondas` | ¿Hace rondas? | Sí/No | Sí ¦ No | No | No | rg_rob_vig_existe = Sí | No |  | Inspector |
| `rg_rob_vig_turnos` | Turnos | Opción única | 1x8 ¦ 1x12 ¦ 2x12 ¦ 24 h | No | No | rg_rob_vig_existe = Sí | No | C.6 Vigilancia y CCTV | Inspector |
| `rg_rob_vig_dias` | Días de vigilancia | Opción única | 5 días ¦ 6 días ¦ 7 días | No | No | rg_rob_vig_existe = Sí | No | C.6 Vigilancia y CCTV | Inspector |
| `rg_rob_vig_horario_inicio` | Horario de inicio | Texto |  | No | No | rg_rob_vig_existe = Sí | No |  | Inspector · Hora (hh:mm) |
| `rg_rob_vig_horario_fin` | Horario de fin | Texto |  | No | No | rg_rob_vig_existe = Sí | No |  | Inspector · Hora (hh:mm) |
| `rg_rob_vig_empresa` | Empresa de seguridad | Texto |  | No | No | rg_rob_vig_existe = Sí | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Garita o guardia (`ev_garita_guardia`) | Si rg_rob_vig_existe es igual a Sí | 1 | No | `rg_rob_vig_existe`, `rg_rob_vig_tipo` |

### CCTV

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_rob_cctv_existe` | ¿Tiene CCTV? | Sí/No | Sí ¦ No | Sí | No |  | No | C.6 Vigilancia y CCTV | Inspector |
| `rg_rob_cctv_tipo` | Tipo de cámaras | Opción única | IP ¦ Analógica | No | No | rg_rob_cctv_existe = Sí | No |  | Inspector |
| `rg_rob_cctv_conexion` | Conexión | Opción única | Cableada ¦ Inalámbrica | No | No | rg_rob_cctv_existe = Sí | No |  | Inspector |
| `rg_rob_cctv_cobertura` | Cobertura | Opción única | Total ¦ Parcial en zonas críticas ¦ Parcial | No | No | rg_rob_cctv_existe = Sí | Sí |  | Inspector |
| `rg_rob_cctv_monitoreo_situ` | ¿Monitoreo en sitio? | Sí/No | Sí ¦ No | No | No | rg_rob_cctv_existe = Sí | No |  | Inspector |
| `rg_rob_cctv_monitoreo_remoto` | ¿Monitoreo remoto? | Sí/No | Sí ¦ No | No | No | rg_rob_cctv_existe = Sí | No |  | Inspector |
| `rg_rob_cctv_grabacion` | Grabación | Opción única | NVR o nube ¦ DVR ¦ Sin grabación | No | No | rg_rob_cctv_existe = Sí | No |  | Inspector |
| `rg_rob_cctv_resguardo_dias` | Días de resguardo de grabación | Número | Unidad: días | No | No | rg_rob_cctv_existe = Sí | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Cámaras (`ev_camaras`) | Si rg_rob_cctv_existe es igual a Sí | 1 | No | `rg_rob_cctv_tipo`, `rg_rob_cctv_cobertura` |

### Alarma

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_rob_alarma_existe` | ¿Tiene alarma de intrusión? | Sí/No | Sí ¦ No | Sí | No |  | No | C.6 Vigilancia y CCTV | Inspector |
| `rg_rob_alarma_activacion` | Activación | Opción única | Sensor de movimiento ¦ Contactos magnéticos ¦ Mixta | No | No |  | No |  | Inspector |
| `rg_rob_alarma_monitoreo` | Monitoreo de la alarma | Opción única | Remoto por empresa o autoridades ¦ Local ¦ Sin monitoreo | No | No |  | No |  | Inspector |
| `rg_rob_boton_panico` | ¿Tiene botón de pánico? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Central de alarma (`ev_central_alarma`) | Si rg_rob_alarma_existe es igual a Sí | 1 | No | `rg_rob_alarma_activacion`, `rg_rob_alarma_monitoreo` |

### UPC

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_rob_upc_nombre` | UPC más cercana | Texto |  | No | No |  | No |  | Contexto externo · Editable por el inspector |
| `rg_rob_upc_distancia` | Distancia a la UPC | Opción única | Menos de 1 km ¦ 1 a 5 km ¦ Más de 5 km | No | No |  | No |  | Contexto externo · Editable por el inspector |
| `rg_rob_upc_tiempo` | Tiempo de respuesta | Opción única | Menos de 5 min ¦ 5 a 10 min ¦ Más de 10 min | No | No |  | No |  | Contexto externo · Editable por el inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Ruta a la UPC (`ev_ruta_upc`) | No | 0 | No | `rg_rob_upc_distancia`, `rg_rob_upc_tiempo` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_rob_observaciones` | Observaciones de la seguridad física | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m14 · Dinero y valores

- Categoría: Por ramo · Prefijo: `rg_dyv_` · Versión 1 (Vigente)
- Se incluye: Solo si el caso incluye Dinero y valores
- Repetible: No
- Campos de captura: 6

### Dinero y valores

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_dyv_monto_max` | Monto máximo en efectivo | Moneda |  | Sí | No |  | No |  | Inspector · Los tramos de Cooperativas (matriz de garantías) se evalúan con este valor. |
| `rg_dyv_resguardo` | Resguardo | Opción única | Caja fuerte empotrada en piso o pared ¦ Caja fuerte no empotrada ¦ Cajón con llave ¦ Sin resguardo | Sí | No |  | Sí |  | Inspector |
| `rg_dyv_vidrios_blindados_caja` | ¿Vidrios blindados en caja? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |
| `rg_dyv_boton_panico_caja` | ¿Botón de pánico en caja? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |
| `rg_dyv_frecuencia_recoleccion` | Frecuencia de recolección | Opción única | Diaria ¦ Varias por semana ¦ Semanal ¦ Menor | No | No |  | No |  | Inspector |
| `rg_dyv_transporte` | Transporte de valores | Opción única | Empresa de seguridad o blindado ¦ Resguardo policial ¦ Personal propio ¦ Sin protección | Sí | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Caja fuerte (`ev_caja_fuerte`) | Sí | 1 | No | `rg_dyv_resguardo` |
| Área de caja (`ev_area_caja`) | Si rg_gen_giro es igual a Cooperativas o Comercial | 1 | No | `rg_dyv_vidrios_blindados_caja`, `rg_dyv_boton_panico_caja` |

## m15 · Equipo electrónico

- Categoría: Por ramo · Prefijo: `rg_ee_` · Versión 1 (Vigente)
- Se incluye: Solo si el caso incluye Equipo electrónico
- Repetible: No
- Campos de captura: 20

### Inventario

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ee_equipos` | Equipos | Grilla | Columnas: Tipo ¦ Marca ¦ Modelo ¦ Serie ¦ Ubicación ¦ Valor (USD) ¦ Año | No | No |  | Sí |  | Inspector · Se alimenta desde la lectura del listado de equipos |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Equipo electrónico (`ev_equipos`) | Sí | 3 | No | `rg_ee_equipos` |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Listado detallado y valorado de bienes | No | Sí | DOC-02 | `rg_ee_equipos` |

### Cuarto técnico

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ee_cuarto_existe` | ¿Tiene cuarto técnico? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_ee_cuarto_distancia_fuentes` | Distancia a fuentes de interferencia | Opción única | A 2 m o más de transformadores, ascensores y aire acondicionado ¦ Menos de 2 m | No | No |  | No |  | Inspector |
| `rg_ee_cuarto_humedad` | Riesgo de agua | Opción única | Sin humedad ni desagües encima ¦ Con riesgo de agua | No | No |  | Sí | C.9 Ambiente del cuarto técnico | Inspector |
| `rg_ee_climatizacion` | Climatización | Opción única | Climatización dedicada ¦ Ventilación natural ¦ Ninguna | No | No |  | No | C.9 Ambiente del cuarto técnico | Inspector |
| `rg_ee_temperatura` | Temperatura | Opción única | 20 a 25 °C ¦ Fuera de rango | No | No |  | No |  | Inspector |
| `rg_ee_humedad_relativa` | Humedad relativa | Opción única | 40 a 60 % ¦ Fuera de rango ¦ No medida | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Cuarto técnico (`ev_cuarto_tecnico`) | Si rg_ee_cuarto_existe es igual a Sí | 1 | No | `rg_ee_cuarto_distancia_fuentes`, `rg_ee_cuarto_humedad` |
| Rack o servidores (`ev_rack_servidores`) | No | 0 | No | `rg_ee_circuitos_dedicados`, `rg_ee_tierra` |
| Climatización (`ev_climatizacion`) | Si rg_ee_climatizacion es igual a Climatización dedicada | 1 | No | `rg_ee_climatizacion`, `rg_ee_temperatura` |

### Protección eléctrica

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ee_tierra` | Puesta a tierra | Opción única | Medida 5 ohmios o menos con certificado ¦ Visible sin medición ¦ No tiene | No | No |  | No | C.7 Puesta a tierra | Inspector |
| `rg_ee_circuitos_dedicados` | ¿Circuitos dedicados? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_ee_ups` | ¿Tiene UPS? | Sí/No | Sí ¦ No | No | No |  | No | C.8 Respaldo de energía | Inspector |
| `rg_ee_ups_autonomia` | Autonomía de la UPS | Número | Unidad: minutos | No | No | rg_ee_ups = Sí | No |  | Inspector |
| `rg_ee_supresor` | ¿Tiene supresor de picos? | Sí/No | Sí ¦ No | No | No |  | No | C.8 Respaldo de energía | Inspector |
| `rg_ee_generador` | ¿Tiene generador? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| UPS (`ev_ups`) | Si rg_ee_ups es igual a Sí | 1 | No | `rg_ee_ups`, `rg_ee_ups_autonomia` |

### Protección contra incendio del área

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ee_detector_cuarto` | ¿Detector en el cuarto? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_ee_extintor_tipo` | Tipo de extintor | Opción única | CO2 o agente limpio ¦ Solo PQS ¦ No tiene | No | No |  | No | C.10 Extinción apta | Inspector |
| `rg_ee_supresion` | Sistema de supresión | Opción única | Agente limpio automático ¦ Rociadores de agua ¦ Ninguna | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Extintor del cuarto técnico (`ev_extintor_cuarto`) | Si rg_ee_extintor_tipo es distinto de No tiene | 1 | No | `rg_ee_extintor_tipo` |

### Mantenimiento y continuidad

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ee_plan_mantenimiento` | Plan de mantenimiento | Opción única | Contrato vigente ¦ Interno con registro ¦ Sin plan | Sí | No |  | Sí | C.11 Mantenimiento de equipos | Inspector |
| `rg_ee_respaldo_datos` | ¿Hay respaldo de datos? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_ee_plan_continuidad` | ¿Hay plan de continuidad? | Sí/No | Sí ¦ No | No | Sí |  | No |  | Inspector |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Bitácoras y cronograma de mantenimientos | No | Sí | DOC-01 | `rg_ee_plan_mantenimiento` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ee_observaciones` | Observaciones del equipo electrónico | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m22 · Todo riesgo construcción

- Categoría: Por ramo · Prefijo: `rg_trc_` · Versión 1 (Vigente)
- Se incluye: Solo si el caso incluye Todo riesgo construcción
- Repetible: No
- Campos de captura: 9

### Datos de la obra

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_trc_tipo_obra` | Tipo de obra | Opción única | Edificación ¦ Vial ¦ Hidráulica ¦ Industrial ¦ Otra | Sí | No |  | Sí |  | Inspector |
| `rg_trc_area` | Área de la obra | Número | Unidad: m² | Sí | No |  | Sí |  | Inspector |
| `rg_trc_constructor` | Constructor | Texto |  | Sí | No |  | No |  | Inspector |
| `rg_trc_avance` | Avance de la obra | Número | Unidad: % | Sí | No |  | No |  | Inspector |
| `rg_trc_fecha_inicio` | Fecha de inicio | Fecha |  | No | No |  | Sí |  | Inspector · Según el cronograma |
| `rg_trc_fecha_fin` | Fecha de fin | Fecha |  | No | No |  | Sí |  | Inspector · Según el cronograma |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Frente de obra (`ev_frente_obra`) | Sí | 2 | No | `rg_trc_tipo_obra`, `rg_trc_avance` |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Permiso de construcción | No | Sí |  | `rg_trc_tipo_obra` |
| Cronograma de obra | No | Sí |  | `rg_trc_fecha_inicio`, `rg_trc_fecha_fin` |
| Especificaciones técnicas | No | Sí |  | `rg_trc_tipo_obra`, `rg_trc_area` |

### Seguridad en obra

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_trc_cerramiento` | ¿Tiene cerramiento? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_trc_vigilancia` | ¿Tiene vigilancia? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_trc_almacen_materiales` | Almacén de materiales | Opción única | Bodega cerrada ¦ Patio abierto ¦ Sin control | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Almacén de materiales (`ev_almacen_materiales`) | No | 0 | No | `rg_trc_almacen_materiales` |
| Cerramiento (`ev_cerramiento`) | Si rg_trc_cerramiento es igual a Sí | 1 | No | `rg_trc_cerramiento` |

## m16 · Ocupación

- Categoría: Por actividad · Prefijo: `rg_ocu_` · Versión 1 (Vigente)
- Se incluye: Siempre
- Repetible: No
- Campos de captura: 5 · espejos: 1

### Ocupación

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ocu_ciiu` | Ocupación (CIIU) | Espejo | Lee `rg_gen_ciiu` | No | No |  | No |  | Inspector · Solo lectura · rg_ocu_riesgo_ciiu se calcula desde rg_gen_ciiu |
| `rg_ocu_riesgo_ciiu` | Riesgo según CIIU | Cálculo | Bajo ¦ Medio ¦ Alto · Fórmula: Según el catálogo CIIU de rg_gen_ciiu | No | No |  | No | B.3 Actividad | Inspector |
| `rg_ocu_clase_mrl` | Clase MRL | Catálogo |  | No | No |  | No |  | Inspector · Catálogo MRL |
| `rg_ocu_carga_combustible` | Carga combustible | Opción única | Baja ¦ Moderada ¦ Alta | Sí | No |  | Sí |  | Inspector |
| `rg_ocu_riesgo_nfpa` | Riesgo de ocupación NFPA | Opción única | Ligero ¦ Ordinario ¦ Extra | Sí | No |  | No |  | Inspector · Lo usa el cálculo de extintores requeridos |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Actividad y mercancía (`ev_actividad`) | No | 0 | No | `rg_ocu_carga_combustible`, `rg_ocu_riesgo_nfpa` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_ocu_observaciones` | Observaciones de la ocupación | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m17 · Procesos

- Categoría: Por actividad · Prefijo: `rg_pro_` · Versión 1 (Vigente)
- Se incluye: Giro Industrial o Comercial
- Repetible: No
- Campos de captura: 2 · espejos: 1

### Procesos

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_pro_procesos` | Procesos | Grilla | Columnas: Proceso ¦ Descripción ¦ Área ¦ Peligros (selección múltiple: Calor, Chispas, Polvo combustible, Químicos, Presión) ¦ Controles | No | No |  | No |  | Inspector · Filas libres: el inspector usa «Agregar fila» |
| `rg_pro_permiso_caliente` | ¿Hay control de trabajos en caliente? | Espejo | Lee `rg_ges_trabajos_caliente` | No | No |  | No |  | Inspector · Solo lectura · Se unifica la etiqueta con la del dato original |
| `rg_pro_descripcion` | Descripción de los procesos | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Línea de proceso (`ev_linea_proceso`) | Si rg_pro_procesos tiene al menos una fila | 2 | No | `rg_pro_procesos`, `rg_pro_descripcion`, `rg_ocu_carga_combustible` |

## m18 · Almacenamiento

- Categoría: Por actividad · Prefijo: `rg_alm_` · Versión 1 (Vigente)
- Se incluye: Giro Industrial o Comercial
- Repetible: Por bodega
- Campos de captura: 9

### Bodega · repetible: libre (bod, por bodega)

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_alm_nombre` | Nombre de la bodega | Texto |  | Sí | No |  | No |  | Inspector |
| `rg_alm_area` | Área | Número | Unidad: m² | Sí | No |  | No |  | Inspector |
| `rg_alm_altura_apilamiento` | Altura de apilamiento | Número | Unidad: m | No | No |  | No |  | Inspector |
| `rg_alm_tipo` | Tipo de almacenamiento | Opción única | Estanterías ¦ Racks ¦ Pallets en piso ¦ Granel | No | No |  | Sí |  | Inspector |
| `rg_alm_clase_mercancia` | Clase de mercancía según NFPA 13 | Opción única | Clase I ¦ Clase II ¦ Clase III ¦ Clase IV ¦ Plásticos grupo A ¦ Plásticos grupo B ¦ Plásticos grupo C | Sí | No |  | No |  | Inspector |
| `rg_alm_separacion_techo` | Separación al techo | Opción única | 0,90 m o más ¦ Menos de 0,90 m | No | No |  | Sí |  | Inspector |
| `rg_alm_pasillos_libres` | ¿Pasillos libres? | Sí/No | Sí ¦ No | No | No |  | Sí |  | Inspector |
| `rg_alm_valor` | Valor almacenado | Moneda | Unidad: USD | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Bodega (`ev_bodega`) | Sí | 2 | Sí | `rg_alm_tipo`, `rg_alm_clase_mercancia`, `rg_alm_pasillos_libres`, `rg_ocu_carga_combustible` |
| Apilamiento (`ev_apilamiento`) | No | 0 | Sí | `rg_alm_altura_apilamiento`, `rg_alm_separacion_techo` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_alm_observaciones` | Observaciones del almacenamiento | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m19 · Combustibles e inflamables

- Categoría: Por actividad · Prefijo: `rg_cmb_` · Versión 1 (Vigente)
- Se incluye: Giro Industrial o Comercial
- Repetible: No
- Campos de captura: 15

### Sustancias

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_cmb_sustancias` | Sustancias combustibles e inflamables | Grilla | Columnas: Sustancia ¦ Clase NFPA 30 (IA, IB, IC, II, IIIA, IIIB, Gas) ¦ Cantidad ¦ Tipo de recipiente ¦ Ubicación | No | No |  | No |  | Inspector · Filas libres: el inspector usa «Agregar fila» |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Área de combustibles (`ev_area_combustibles`) | Si rg_cmb_sustancias tiene al menos una fila | 1 | No | `rg_cmb_sustancias`, `rg_cmb_agr_01`, `rg_cmb_agr_02`, `rg_cmb_agr_03`, `rg_cmb_agr_04`, `rg_cmb_agr_05`, `rg_ocu_carga_combustible` |

### Factores agravantes

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_cmb_agr_01` | Almacenamiento interior sin ventilación | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_02` | Sin dique de contención | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_03` | Cerca de fuentes de ignición | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_04` | Sin señalización | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_05` | Recipientes no aprobados | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_06` | Sin conexión a tierra en trasvase | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_07` | Cantidad sobre el límite del área | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_08` | Trasvase sin control | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_agr_09` | Sin extintor adecuado | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_porcentaje_agravantes` | Porcentaje de agravantes | Cálculo | Fórmula: Agravantes presentes ÷ agravantes evaluados · Unidad: % | No | No |  | No |  | Inspector |

### GLP

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_cmb_glp` | ¿Usa GLP? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_cmb_glp_ubicacion` | Ubicación de los cilindros | Opción única | Exterior ¦ Interior con ventilación superior e inferior ¦ Interior sin ventilación | No | No | rg_cmb_glp = Sí | Sí |  | Inspector |
| `rg_cmb_glp_kg` | Cantidad de GLP | Número | Unidad: kg | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Cilindros de GLP (`ev_cilindros_glp`) | Si rg_cmb_glp es igual a Sí | 1 | No | `rg_cmb_glp_ubicacion`, `rg_cmb_glp_kg` |

### Observaciones

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_cmb_observaciones` | Observaciones de combustibles e inflamables | Texto |  | No | No |  | Sí |  | IA · Texto redactado |

## m20 · Maquinaria

- Categoría: Por actividad · Prefijo: `rg_maq_` · Versión 1 (Vigente)
- Se incluye: Giro Industrial, o si el caso incluye Rotura de maquinaria
- Repetible: No
- Campos de captura: 5

### Equipos

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_maq_equipos` | Maquinaria fija | Grilla | Columnas: Tipo ¦ Marca ¦ Modelo ¦ Serie ¦ Año ¦ Potencia ¦ Valor (USD) | No | No |  | Sí |  | Inspector · Filas libres: el inspector usa «Agregar fila» |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Maquinaria (`ev_maquinaria`) | Sí | 2 | No | `rg_maq_equipos`, `rg_maq_protecciones` |
| Placa de datos (`ev_placa_datos`) | Si rg_maq_equipos tiene al menos una fila | 1 | No | `rg_maq_equipos` |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Listado detallado y valorado de bienes | No | Sí | DOC-02 | `rg_maq_equipos` |

### Mantenimiento y operación

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_maq_mantenimiento` | Tipo de mantenimiento | Opción única | Predictivo ¦ Preventivo con bitácora ¦ Correctivo ¦ Ninguno | Sí | No |  | Sí |  | Inspector |
| `rg_maq_ultimo_mantenimiento` | Fecha del último mantenimiento | Fecha |  | No | No |  | Sí |  | Inspector |
| `rg_maq_operadores_capacitados` | ¿Operadores capacitados? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_maq_protecciones` | ¿Tiene guardas y paros de emergencia? | Sí/No | Sí ¦ No | No | No |  | Sí |  | Inspector |

**Documentos esperados**

| Documento | Requerido | Lectura por IA | Seguimiento | Campos que respalda |
|---|---|---|---|---|
| Bitácoras y cronograma de mantenimientos | No | Sí | DOC-01 | `rg_maq_mantenimiento`, `rg_maq_ultimo_mantenimiento` |

## m21 · Sistema de bombas

- Categoría: Por actividad · Prefijo: `rg_bmb_` · Versión 1 (Vigente)
- Se incluye: Giro Industrial o Estación de servicios, o si Tipo de red incluye Rociadores o Gabinetes con bomba
- Repetible: No
- Campos de captura: 7 · espejos: 1

### Bombas

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_bmb_tipo` | Tipo de bomba | Opción múltiple | Eléctrica ¦ Diésel ¦ Jockey | Sí | No |  | No |  | Inspector |
| `rg_bmb_listada` | ¿Listada UL o FM? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_bmb_caudal` | Caudal | Número | Unidad: gpm | No | No |  | No |  | Inspector |
| `rg_bmb_presion` | Presión | Número | Unidad: psi | No | No |  | No |  | Inspector |
| `rg_bmb_arranque_automatico` | ¿Arranque automático? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |

**Etiquetas de evidencia**

| Etiqueta | Requerida | Mínimo | Por instancia | Campos que respalda |
|---|---|---|---|---|
| Cuarto de bombas (`ev_cuarto_bombas`) | Sí | 1 | No | `rg_bmb_tipo`, `rg_bmb_listada` |
| Tablero de control de bombas (`ev_tablero_bombas`) | Sí | 1 | No | `rg_bmb_arranque_automatico`, `rg_bmb_energia_alterna` |

### Pruebas y respaldo

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Admite «No aplica» | Visible si | Elegible para IA | Criterio que alimenta | Origen / notas |
|---|---|---|---|---|---|---|---|---|---|
| `rg_bmb_pruebas` | Pruebas | Opción única | Semanal registrada ¦ Mensual ¦ Sin registro | No | No |  | No |  | Inspector |
| `rg_bmb_energia_alterna` | ¿Tiene energía alterna? | Sí/No | Sí ¦ No | No | No |  | No |  | Inspector |
| `rg_bmb_reserva_exclusiva` | ¿Reserva exclusiva para incendios? | Espejo | Lee `rg_pci_reserva_exclusiva` | No | No |  | No |  | Inspector · Solo lectura |
