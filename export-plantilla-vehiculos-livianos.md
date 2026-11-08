# Exportación · Vehículos livianos v1

Solo lectura. Generada desde `datos-ejemplo.js` (plantilla «Vehículos livianos» v1, Vigente desde 2026-08-01, tipo: Vehículos, alcance: Vehículos livianos, captura: Guiado). Ajuste VL-F1 aplicado (motivo: «Opciones desde los catálogos maestros»; 18/10/2026 20:20, Andrea Salazar): solo cambia el origen de las opciones de Marca, Modelo o versión y Tipo de licencia; no cambia campos, etiquetas ni obligatoriedad ni crea versión nueva. La versión 2 de la biblioteca es un borrador y no se exporta.

**Campos: 94 en 13 secciones, sin subsecciones.** Espejos: 0 (la plantilla no define campos espejo). Elegibles para IA: no definido (la plantilla de Vehículos no tiene esa propiedad por campo; 24 campos declaran «Extracción automática» como fuente). Claves que no empiezan con `veh_`: 0. Claves repetidas: 0.

Separador de opciones: « ¦ ». Obligatorio: modalidades en las que se exige (P = Presencial, V = Virtual guiada, A = Autoinspección, D = Documental); «No» si no se exige en ninguna. «Elegible para IA»: «No definido» porque la plantilla no lo declara. «Espejo»: «No» en todos los campos. En «Origen / notas», «Visible si» muestra clave = valor.

## 01 · Datos de la inspección

- Identificador: `ins`
- Campos: 7

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_fecha_hora_inspeccion` | Fecha y hora de inspección | Fecha |  | Sí · P · V · A | No definido | No |  | Fuente: Extracción automática · Bloqueado · Se toma de los metadatos de las fotos. |
| `veh_modalidad_realizada` | Modalidad realizada | Catálogo | Presencial ¦ Virtual guiada ¦ Autoinspección ¦ Documental | Sí · P · V · A · D | No definido | No |  | Fuente: Solicitud · Bloqueado · Precargada de la visita. |
| `veh_agencia` | Sucursal | Catálogo | Quito Norte ¦ Quito Sur ¦ Guayaquil ¦ Cuenca ¦ Manta ¦ Ambato ¦ Ibarra | Sí · P · V | No definido | No |  | Fuente: Solicitud · Se toma de la solicitud; no se edita en el informe. |
| `veh_inspector_ejecuto` | Inspector que ejecutó | Catálogo | Marco Tapia ¦ Luis Andrade ¦ Diana Cárdenas | Sí · P · V | No definido | No |  | Fuente: Solicitud · Bloqueado |
| `veh_persona_atiende` | Persona que atiende | Texto |  | Sí · P | No definido | No |  | Máx. 120 caracteres |
| `veh_relacion_asegurado` | Relación con el asegurado | Catálogo | Asegurado ¦ Familiar ¦ Empleado ¦ Conductor ¦ Otro | Sí · P | No definido | No |  |  |
| `veh_fecha_hora_carga` | Fecha y hora de carga | Fecha |  | No | No definido | No |  | Bloqueado · Campo del sistema · Lo registra: Back-office · Campo del sistema: se registra al cargar el informe y no se edita. |

## 02 · Identificación del vehículo

- Identificador: `veh`
- Campos: 14

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_placa` | Placa | Texto |  | Sí · P · V · A · D | No definido | No |  | Fuente: Solicitud, Servicio de placas, Extracción automática · Integración BPM · código VEH_PLACA · Formato: Placa · Con reglas de envío a calificación |
| `veh_marca` | Marca | Catálogo | Chevrolet ¦ Kia ¦ Hyundai ¦ Toyota ¦ Mazda ¦ Renault ¦ Nissan | Sí · P · V · A · D | No definido | No |  | Fuente: Servicio de placas, Extracción automática · Integración BPM · código VEH_MARCA · Opciones: Catálogo Marcas y modelos (marca) (VL-F1) |
| `veh_modelo` | Modelo o versión | Catálogo | Onix ¦ Onix LT ¦ D-Max ¦ Sportage ¦ Sportage LX ¦ Seltos ¦ Tucson ¦ Tucson GL ¦ Creta ¦ Corolla Cross ¦ Hilux ¦ Hilux 4x4 ¦ Fortuner ¦ CX-5 ¦ Duster ¦ Frontier | Sí · P · V · A · D | No definido | No |  | Fuente: Servicio de placas, Extracción automática · Integración BPM · código VEH_MODELO · Opciones: Catálogo Marcas y modelos (modelos y versiones de la marca elegida) (VL-F1) · Por marca: Chevrolet: Onix ¦ Onix LT ¦ D-Max · Kia: Sportage ¦ Sportage LX ¦ Seltos · Hyundai: Tucson ¦ Tucson GL ¦ Creta · Toyota: Corolla Cross ¦ Hilux ¦ Hilux 4x4 ¦ Fortuner · Mazda: CX-5 · Renault: Duster · Nissan: Frontier |
| `veh_anio_modelo` | Año del modelo | Número |  | Sí · P · V · A · D | No definido | No |  | Fuente: Servicio de placas · Integración BPM · código VEH_ANIO · Rango: 1980 a 2027 · Con reglas de envío a calificación |
| `veh_vin` | VIN o chasis | Texto |  | Sí · P · V · A · D | No definido | No |  | Fuente: Servicio de placas, Extracción automática · Integración BPM · código VEH_VIN · Formato: VIN · Máx. 17 caracteres |
| `veh_numero_motor` | Motor | Texto |  | Sí · P · V | No definido | No |  | Fuente: Servicio de placas, Extracción automática |
| `veh_tipo_carroceria` | Tipo de carrocería | Catálogo | Sedán ¦ Hatchback ¦ SUV ¦ Camioneta cabina simple ¦ Camioneta doble cabina ¦ Otros | Sí · P · V · A · D | No definido | No |  | Fuente: Servicio de placas · Integración BPM · código VEH_CARROCERIA |
| `veh_clase` | Clase | Catálogo | Automóvil ¦ Jeep ¦ Camioneta ¦ Furgoneta | Sí · P · V | No definido | No |  | Fuente: Servicio de placas |
| `veh_color` | Color | Catálogo | Blanco ¦ Negro ¦ Gris ¦ Plata ¦ Rojo ¦ Azul | Sí · P · V | No definido | No |  | Fuente: Servicio de placas, Extracción automática |
| `veh_pais_origen` | País de origen | Catálogo | Ecuador ¦ Colombia ¦ Corea del Sur ¦ Japón ¦ China ¦ Brasil | No | No definido | No |  | Fuente: Servicio de placas |
| `veh_cilindraje` | Cilindraje | Número |  | No | No definido | No |  | Fuente: Servicio de placas · Rango: 50 a 8000 · En centímetros cúbicos. |
| `veh_pasajeros` | Pasajeros | Número |  | No | No definido | No |  | Fuente: Servicio de placas · Rango: 1 a 60 |
| `veh_combustible` | Combustible | Opción única | Gasolina ¦ Diésel ¦ Híbrido ¦ Eléctrico | No | No definido | No |  |  |
| `veh_camv_cpn` | CAMV o CPN | Texto |  | No | No definido | No |  | Fuente: Servicio de placas |

## 03 · Matrícula y propietario

- Identificador: `mat`
- Campos: 7

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_nombre_matricula` | Nombre en la matrícula | Texto |  | Sí · P · V · A · D | No definido | No |  | Fuente: Extracción automática |
| `veh_identificacion_propietario` | Identificación del propietario | Texto |  | Sí · P · V · A · D | No definido | No |  | Fuente: Solicitud, Extracción automática · Formato: Cédula |
| `veh_gad_matriculacion` | GAD de matriculación | Catálogo | Quito ¦ Guayaquil ¦ Cuenca ¦ Manta | No | No definido | No |  | Fuente: Extracción automática |
| `veh_anio_matricula` | Año de la matrícula | Número |  | No | No definido | No |  | Fuente: Extracción automática · Rango: 1990 a 2027 |
| `veh_vigencia_matricula` | Vigencia de la matrícula | Fecha |  | No | No definido | No |  | Fuente: Extracción automática |
| `veh_interes_asegurable` | Interés asegurable | Opción única | Propietario ¦ Arrendatario ¦ Acreedor prendario ¦ Otro | Sí · P · V · D | No definido | No |  |  |
| `veh_contrato_compraventa` | ¿Presenta contrato de compraventa? | Sí/No | Sí ¦ No | No | No definido | No |  | Con reglas de envío a calificación |

## 04 · Uso y conductor

- Identificador: `uso`
- Campos: 12

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_uso` | Uso | Opción única | Particular ¦ Comercial ¦ Público ¦ Cuenta propia ¦ Alquiler | Sí · P · V · A | No definido | No |  | Fuente: Solicitud · Con reglas de envío a calificación |
| `veh_ciudad_circulacion` | Ciudad de circulación | Catálogo | Quito ¦ Guayaquil ¦ Cuenca ¦ Manta ¦ Ambato | Sí · P · V | No definido | No |  | Fuente: Solicitud, Cliente 360 · Buscador de cantones. |
| `veh_anio_compra` | Año de compra | Número |  | No | No definido | No |  | Rango: 1980 a 2026 |
| `veh_kilometraje` | Kilometraje | Número |  | Sí · P · V · A | No definido | No |  | Fuente: Extracción automática · Rango: 0 a 999999 · Con reglas de envío a calificación · Lectura del odómetro, en km. |
| `veh_kilometraje_anual` | Kilometraje por año | Cálculo |  | No | No definido | No |  | Fórmula: {veh_kilometraje} / MAX(1, AÑO(HOY()) - {veh_anio_compra}) · Kilometraje dividido para los años transcurridos desde la compra (mínimo 1). Se recalcula al cambiar el kilometraje o el año de compra. |
| `veh_conductor_habitual` | Conductor habitual | Opción única | Es el asegurado ¦ Otra persona | Sí · P · V · A | No definido | No |  | Fuente: Cliente 360 |
| `veh_cedula_conductor` | Cédula del conductor | Texto |  | Sí · P · V · A | No definido | No | veh_conductor_habitual = Otra persona | Formato: Cédula |
| `veh_nombre_conductor` | Nombre del conductor | Texto |  | Sí · P · V · A | No definido | No | veh_conductor_habitual = Otra persona |  |
| `veh_edad_conductor` | Edad del conductor | Número |  | No | No definido | No | veh_conductor_habitual = Otra persona | Rango: 16 a 99 |
| `veh_tipo_licencia` | Tipo de licencia | Catálogo | A ¦ A1 ¦ B ¦ C1 ¦ C ¦ D1 ¦ D ¦ E1 ¦ E ¦ F ¦ G | No | No definido | No |  | Fuente: Extracción automática · Opciones: Catálogo Categorías de licencia (11) (VL-F1) |
| `veh_caducidad_licencia` | Caducidad de la licencia | Fecha |  | No | No definido | No |  | Fuente: Extracción automática |
| `veh_puntos_licencia` | Puntos de la licencia | Número |  | No | No definido | No |  | Rango: 0 a 30 |

## 05 · Verificación de identificación

- Identificador: `ver`
- Campos: 3

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_verificacion_chasis_relieve` | Número de chasis en relieve | Opción única | Verificado ¦ No verificado ¦ No aplica | Sí · P · V | No definido | No |  |  |
| `veh_verificacion_sticker_vin` | Sticker VIN | Opción única | Verificado ¦ No verificado ¦ No aplica | Sí · P · V | No definido | No |  |  |
| `veh_verificacion_plaqueta_panoramica` | Plaqueta panorámica | Opción única | Verificado ¦ No verificado ¦ No aplica | Sí · P · V | No definido | No |  |  |

## 06 · Accesorios y seguridad

- Identificador: `acc`
- Campos: 25

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_telemetria` | Telemetría | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_tipo_dispositivo` | Tipo de dispositivo | Catálogo | GPS ¦ OBD ¦ Cámara | No | No definido | No | veh_telemetria = Sí |  |
| `veh_fecha_instalacion` | Fecha de instalación | Fecha |  | No | No definido | No | veh_telemetria = Sí |  |
| `veh_voucher` | Voucher | Texto |  | No | No definido | No | veh_telemetria = Sí |  |
| `veh_imei` | IMEI | Texto |  | No | No definido | No | veh_telemetria = Sí | Máx. 15 caracteres |
| `veh_id_dispositivo` | ID del dispositivo | Texto |  | No | No definido | No | veh_telemetria = Sí |  |
| `veh_satelital` | Satelital | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_proveedor_satelital` | Proveedor satelital | Catálogo | Hunter ¦ Carseg ¦ Otro | No | No definido | No | veh_satelital = Sí |  |
| `veh_descripcion_satelital` | Descripción del satelital | Texto |  | No | No definido | No | veh_satelital = Sí |  |
| `veh_blindaje` | Blindaje | Sí/No | Sí ¦ No | No | No definido | No |  | Con reglas de envío a calificación |
| `veh_proveedor_blindaje` | Proveedor de blindaje | Texto |  | Sí · P · V | No definido | No | veh_blindaje = Sí |  |
| `veh_nivel_blindaje` | Nivel de blindaje | Opción única | I ¦ IIA ¦ II ¦ IIIA ¦ III ¦ IV | Sí · P · V | No definido | No | veh_blindaje = Sí |  |
| `veh_descripcion_blindaje` | Descripción del blindaje | Texto |  | No | No definido | No | veh_blindaje = Sí |  |
| `veh_radio` | Radio | Opción única | No tiene ¦ Fijo ¦ Desmontable | No | No definido | No |  |  |
| `veh_aros` | Aros | Opción única | Originales ¦ Aluminio ¦ Magnesio ¦ Hierro | No | No definido | No |  |  |
| `veh_cantidad_airbags` | Airbags | Número |  | No | No definido | No |  | Rango: 0 a 12 · Cantidad. |
| `veh_vidrios_electricos` | Vidrios eléctricos | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_laminas_seguridad` | Láminas de seguridad | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_aire_acondicionado` | Aire acondicionado | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_neblineros` | Neblineros | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_estribos` | Estribos | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_parrilla` | Parrilla | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_sunroof` | Sunroof | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_techo_panoramico` | Techo panorámico | Sí/No | Sí ¦ No | No | No definido | No |  |  |
| `veh_camara_retro` | Cámara de retro | Sí/No | Sí ¦ No | No | No definido | No |  |  |

## 07 · Neumáticos

- Identificador: `neu`
- Campos: 1

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_neumaticos` | Estado de neumáticos | Grilla | Columnas: Posición ¦ Marca ¦ Medida ¦ Labrado (mm) ¦ Foto · Filas fijas: Delantera izquierda ¦ Delantera derecha ¦ Trasera izquierda ¦ Trasera derecha ¦ Repuesto | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias · Alertas: Labrado bajo el mínimo (columna labrado menor 1,6) · Medida con el formato 205/55 R16. Labrado desde la foto con calibrador. |

Columnas de la grilla `veh_neumaticos` (la plantilla no define tipo, opciones, obligatorio, IA ni espejo por columna; heredan los de la grilla):

| Columna | Tipo | Opciones | Obligatorio | Elegible para IA | Espejo |
|---|---|---|---|---|---|
| Posición | No definido | No definido | Como la grilla | No definido | No |
| Marca | No definido | No definido | Como la grilla | No definido | No |
| Medida | No definido | No definido | Como la grilla | No definido | No |
| Labrado (mm) | No definido | No definido | Como la grilla | No definido | No |
| Foto | No definido | No definido | Como la grilla | No definido | No |

## 08 · Testigos del tablero

- Identificador: `tes`
- Campos: 7

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_testigo_check_engine` | Check engine | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |
| `veh_testigo_abs` | ABS | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |
| `veh_testigo_airbag` | Airbag | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |
| `veh_testigo_presion_aceite` | Presión de aceite | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |
| `veh_testigo_bateria` | Batería | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |
| `veh_testigo_temperatura` | Temperatura | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |
| `veh_testigo_frenos` | Frenos | Opción única | Encendido ¦ Apagado ¦ No aplica | Sí · P · V | No definido | No |  | Fuente: Extracción automática · Marca preexistencias |

## 09 · Extras

- Identificador: `ext`
- Campos: 1

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_extras` | Extras | Grilla | Columnas: Descripción ¦ Marca ¦ Valor (USD) ¦ Foto | No | No definido | No |  | Descripción desde el catálogo de extras. |

Columnas de la grilla `veh_extras` (la plantilla no define tipo, opciones, obligatorio, IA ni espejo por columna; heredan los de la grilla):

| Columna | Tipo | Opciones | Obligatorio | Elegible para IA | Espejo |
|---|---|---|---|---|---|
| Descripción | No definido | No definido | No | No definido | No |
| Marca | No definido | No definido | No | No definido | No |
| Valor (USD) | No definido | No definido | No | No definido | No |
| Foto | No definido | No definido | No | No definido | No |

## 10 · Averías

- Identificador: `ave`
- Campos: 1

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_averias` | Averías | Grilla | Columnas: Pieza ¦ Tipo de daño ¦ Gravedad ¦ Superficie (dm²) ¦ Origen ¦ Foto | No | No definido | No |  | Fuente: Extracción automática · Marca preexistencias · Pieza de catálogo normalizado, sin duplicados. Tipo de daño: rayón, abolladura, rotura, corrosión o faltante. Gravedad: Baja, Media o Alta. |

Columnas de la grilla `veh_averias` (la plantilla no define tipo, opciones, obligatorio, IA ni espejo por columna; heredan los de la grilla):

| Columna | Tipo | Opciones | Obligatorio | Elegible para IA | Espejo |
|---|---|---|---|---|---|
| Pieza | No definido | No definido | No | No definido | No |
| Tipo de daño | No definido | No definido | No | No definido | No |
| Gravedad | No definido | No definido | No | No definido | No |
| Superficie (dm²) | No definido | No definido | No | No definido | No |
| Origen | No definido | No definido | No | No definido | No |
| Foto | No definido | No definido | No | No definido | No |

## 11 · Verificaciones externas

- Identificador: `vex`
- Campos: 1

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_verificaciones_externas` | Verificaciones externas | Grilla | Columnas: Consulta ¦ Resultado ¦ Fecha y hora ¦ Forma ¦ Observación · Filas fijas: Fiscalía por placa ¦ Fiscalía por cédula ¦ ANT ¦ Siniestralidad ¦ SRI ¦ Codificación del VIN | No | No definido | No |  | Lo registra: Back-office · Resultado: Sin novedad, Con novedad o Servicio no disponible. La observación es obligatoria si hay novedad. |

Columnas de la grilla `veh_verificaciones_externas` (la plantilla no define tipo, opciones, obligatorio, IA ni espejo por columna; heredan los de la grilla):

| Columna | Tipo | Opciones | Obligatorio | Elegible para IA | Espejo |
|---|---|---|---|---|---|
| Consulta | No definido | No definido | No | No definido | No |
| Resultado | No definido | No definido | No | No definido | No |
| Fecha y hora | No definido | No definido | No | No definido | No |
| Forma | No definido | No definido | No | No definido | No |
| Observación | No definido | No definido | No | No definido | No |

## 12 · Valores

- Identificador: `val`
- Campos: 8

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_valor_asegurado_casco` | Valor asegurado del casco | Moneda |  | No | No definido | No |  | Fuente: Solicitud · Bloqueado |
| `veh_valor_asegurado_extras` | Valor asegurado de extras | Moneda |  | No | No definido | No |  | Fuente: Solicitud · Bloqueado |
| `veh_valor_asegurado_total` | Valor asegurado total | Moneda |  | No | No definido | No |  | Fuente: Solicitud · Bloqueado |
| `veh_valor_sugerido_casco` | Valor sugerido del casco | Moneda |  | Sí · P · V · D | No definido | No |  | Integración BPM · código VAL_SUG_CASCO · Rango: 0 a — · Lo ingresa el inspector, en USD. |
| `veh_valor_sugerido_extras` | Valor sugerido de extras | Cálculo |  | No | No definido | No |  | Integración BPM · código VAL_SUG_EXTRAS · Fórmula: SUMA({veh_extras}.valor) |
| `veh_valor_sugerido_total` | Total sugerido | Cálculo |  | No | No definido | No |  | Integración BPM · código VAL_SUG_TOTAL · Fórmula: {veh_valor_sugerido_casco} + {veh_valor_sugerido_extras} |
| `veh_diferencia_valor` | Diferencia del casco | Cálculo |  | No | No definido | No |  | Fórmula: ({veh_valor_sugerido_casco} − {veh_valor_asegurado_casco}) / {veh_valor_asegurado_casco} × 100 · Alertas: Posible infraseguro (mayor 10); Posible sobreseguro (menor -10) · Con signo. Solo compara el casco. |
| `veh_extras_sobre_casco` | Extras sobre el casco | Cálculo |  | No | No definido | No |  | Fórmula: {veh_valor_sugerido_extras} / {veh_valor_sugerido_casco} × 100 · Alertas: Extras sobre el límite de la política (mayor 20) · Porcentaje de los extras sugeridos sobre el casco sugerido. |

## 13 · Asegurabilidad

- Identificador: `ase`
- Campos: 7

| Clave | Etiqueta | Tipo | Opciones exactas | Obligatorio | Elegible para IA | Espejo | Visible si | Origen / notas |
|---|---|---|---|---|---|---|---|---|
| `veh_decision_inspector` | Decisión del inspector | Opción única | Determinar como asegurable ¦ Determinar como no asegurable ¦ Enviar a calificación | Sí · P · V · D | No definido | No |  | Integración BPM · código ASEG_DECISION · Las opciones dependen de la facultad del inspector. |
| `veh_cobertura` | Cobertura | Opción única | Todo riesgo ¦ Pérdida total ¦ Daños propios y RC | Sí · P · V · D | No definido | No |  | Integración BPM · código ASEG_COBERTURA |
| `veh_motivo_no_asegurable` | Motivo de no asegurable | Texto |  | Sí · P · V · D | No definido | No | veh_decision_inspector = Determinar como no asegurable |  |
| `veh_motivo_envio_a_calificacion` | Motivo de envío a calificación | Texto |  | Sí · P · V · D | No definido | No | veh_decision_inspector = Enviar a calificación |  |
| `veh_condiciones_poliza` | Condiciones de póliza | Texto |  | No | No definido | No |  | Texto informativo. |
| `veh_observacion_general` | Observación general | Texto |  | No | No definido | No |  | Máx. 1000 caracteres |
| `veh_firma_atiende` | Firma de quien atiende | Foto |  | Sí · P | No definido | No | veh_modalidad_realizada = Presencial | Solo en modalidad Presencial. |

