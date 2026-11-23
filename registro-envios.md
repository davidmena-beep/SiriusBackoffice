# Registro de envíos

Respuestas finales completas de cada envío, la más reciente primero. Fecha = reloj del prototipo (`SIRIUS_EJEMPLO.ahora()`).

---

## 18/10/2026 · 20:30 — Etapa P-1d + H-3

Publiqué la versión 393 de SIRIUS. Los archivos subieron en la 392 y esta versión cierra el registro con el tiempo de la etapa.

El PDF de la liquidación #001416 sale ahora igual a la propuesta aprobada: el mismo texto y los mismos píxeles, con el código que registra la base. En Liquidaciones, el completado de informe tiene su nombre y no se ajusta. El cálculo se muestra concepto por concepto. Los honorarios sin tarifa en el contrato aparecen «Por definir» y no se pueden liquidar.

### Mapa de impacto

- **`sirius-liq-proceso.js` (v3.3):**
  - `LP.documentoPdf`: aprobación de `l.aprobada` (sin ella, el historial como antes); `cargoDe` sin la aseguradora como cargo; fecha del documento = la de la aprobación; período desde las líneas o, sin fechas, desde `l.periodo`; base y movilización de cada fila = las del cálculo de la base.
  - `LP.pdfListo`: sin líneas no hay PDF; con la conexión, `documentoRegistrar` antes de dibujar.
  - Completado y «Por definir»: `LP.completado`, `lineasCalc`, `lineaCalcTxt`, `porDefinir`, `porDefinirTxt`, `porDefinirDe`.
  - El contrato suma `servicio`, `calculo.modelo`, `calculo.lineas`, `periodo` y `aprobada`; estado «Por definir».
- **`sirius-pdf.js`:** solo los tres ajustes de dibujo de la propuesta (DEC-248 no cambia en nada más).
- **`Liquidaciones.dc.html`:**
  - «Descargar PDF» usa `LP.pdfListo`.
  - El completado se llama «Completado de informe» y no tiene «Ajustar».
  - «Cálculo» por conceptos, también en Por facturar.
  - Filas «Por definir» sin casilla, con su nota.
- **Escenas:**
  - `datos-cx-liq1416.js` (nuevo): base simulada de las 5 escenas y `documentoRegistrar` de la liquidación.
  - Back-office: script, KNOWN_ESC y la ruta de las escenas.
  - `datos-escenas.js`: 833 escenas.
- **Sin cambios:** `sirius-conexion.js` (70 bytes) y los archivos de configuración vigilados.

### Qué cambió

- **Datos del PDF:**
  - «Quito, 22 de noviembre de 2026».
  - Sello «APROBADA · 22/11/2026 · 21:06».
  - «Aprobado por Verónica Lema · Ejecutivo de inspecciones · Aseguradora del Sur C.A.» (sin repetir la empresa).
  - Envío «22/11/2026 · 21:05 · v1 · Carla Ponce» en hora de Ecuador.
  - Franja de cada fila según `honorarios[].calificacion`.
- **Dibujo del PDF:**
  - Las tarjetas parten la segunda línea en dos renglones sin recortar: «Eurosurvey S.A.» / «RUC 1791456320001» y «sin IVA» / «lo que debe decir la factura».
  - En las filas de Ramos Generales, el bien va bajo el asegurado y Placa dice «—».
- **Código del pie:** el que devuelve la base. Con `{ ok: false }` no se genera el PDF y se muestra el mensaje. Sin la conexión, el código local.
- **Liquidación sin líneas:** «Descargar PDF» sigue activo y responde «La liquidación no tiene líneas: no se genera su PDF».
- **Liquidaciones:**
  - «PR900A · caso 50009 · Completado de informe», sin «Ajustar».
  - El cálculo muestra una fila por concepto: «2,5 h × USD 50,00 = USD 125,00 · del general», «1,5 h × USD 14,00 = USD 21,00 · del contrato Eurosurvey 2026»; una línea sin tarifa dice «Por definir: sin tarifa en el contrato».
  - En «Por liquidar», insignia «Por definir» y la nota «La aseguradora aún no define la tarifa de completado de autoinspección en tu contrato.», sin casilla.

### Prueba visual (pdfliq1416 contra la propuesta)

El PDF que genera SIRIUS es el mismo documento que la propuesta: 1 página, las mismas 90 líneas de texto y una diferencia de píxeles de 0,000/255 a 110 ppp. El código del pie también coincide (LQ-001416-v1-7C2E19A4), porque la base simulada devuelve el de la propuesta.

### Prueba de cobertura

Comprobé los 42 datos de la #001416 en el texto del PDF y aparecen los 42:

- casos y órdenes;
- asegurados, el bien y la placa;
- tipo, ciudad y km;
- base y movilización;
- subtotales y la composición 10,00 + 191,00 + 31,02;
- IVA y total;
- contrato y tarifas;
- envío y aprobación;
- código.

La tabla está en `cobertura.txt`, que se entregó en el chat.

### Verificado

- **pdfliqsinlineas:** sin descarga y con el mensaje.
- **liqcompletado, liqdesglose y liqpordefinir:** capturas de cada vista. A 1280×720, 1440×900 y 1920×1080 no hay desplazamiento horizontal de la página.
- **Regresión:** antes y después en 14 escenas de demostración y 4 con `?cx=1`. Las pantallas quedan iguales, salvo el enlace «Cálculo» en los preacordados de Por facturar (facturarmasivo y liqfacturarsri).
  - PDF liqpdf y liqpdfrg (demostración y conexión): cambian solo los tres ajustes de dibujo.
  - Con la conexión, el código del pie es el que registra la base.

### No verificado

- La base real: la forma de `calculo.lineas`, el nombre del tarifario, `documentoRegistrar` para la liquidación y el texto de su mensaje con `{ ok: false }`.
- Firefox y Safari.

### Diferencias

- Agregué «Cálculo» a los honorarios preacordados de «Por facturar», para ver el desglose del completado.
- El origen del contrato dice «del contrato Eurosurvey 2026», sin repetir «Contrato».
- Estas vistas no tienen una lista de honorarios para el personal interno. La insignia «Por definir» es la misma en la lista del proveedor que el personal abre desde la ficha de la agencia (sin conexión).

### Escenas

- **`pdfliq1416`:** la #001416 con los datos de la base.
- **`pdfliqsinlineas`:** liquidación aprobada sin líneas.
- **`liqcompletado`:** completado de informe en Por facturar.
- **`liqdesglose`:** cálculo por conceptos, de Ramos Generales y de un vehículo con km.
- **`liqpordefinir`:** completado «Por definir» de Inspecciones Andinas.

Todas están en el área Liquidaciones y usan la conexión simulada.

Tiempo de la etapa: inicio 22/11/2026 23:11 · fin 22/11/2026 23:32 · 21 min

---

## 18/10/2026 · 20:30 — Etapa P-1f

Publiqué la versión 391 de SIRIUS. Los archivos subieron en la 390 y esta versión cierra el registro con el tiempo de la etapa.

El Informe de inspección y el Resumen para el APS de Vehículos imprimen ahora todo lo capturado (DEC-273). Con el caso real de David (50061, GRZ3277), el informe tiene el mismo contenido y el mismo orden que la propuesta aprobada. Hay dos salvedades previstas: las fotos siguen sin salto de página y la facultad lleva su nombre, que sale del dato. El resumen tiene exactamente las mismas palabras.

### Mapa de impacto

- **`sirius-documentos-pdf.js`:**
  - `migrarVeh273`: el Informe y el Resumen base de «Vehículos livianos v1» pasan a las secciones de DEC-273 al abrir el modelo de la sesión. El archivo vigilado `datos-documentos-pdf.js` no cambia.
  - Tipos nuevos `extrasCliente`, `asegurabilidad` y `averiasFrase`.
  - Firmas de quien actuó (`actuaron`).
  - Etiquetas del formulario; puntos solo si son menos de 30; cilindraje «2.500 cc».
  - Referencia de valor; recuadro del resumen.
  - Verificaciones externas con Observación; extras verificados con su foto.
  - Portada con la carrocería.
  - «Hoy» con la hora de la base (`reloj.ahora`).
- **`sirius-pdf-vector.js` (v1.1):**
  - Alto real de las filas de datos, fotos y firmas: una sección corta no se parte y un subtítulo va con su primera fila.
  - Fotos 4:3.
  - Firmas de hasta 3 por fila, con su cabecera y la firma de quien atiende.
  - Las 4 fotos del resumen en una fila.
  - Fotos de 1000 px a calidad 0,78.
- **`sirius-salida-veh.js`:**
  - Decisión completa: rol, responsable al que reemplazó y facultad.
  - `extrasApp` y `completoCx`.
  - Origen «Determinado al completar» o «Calificado por <quién> · <fecha>».
  - «Informe completado» con la hora de la decisión, y Derivación.
  - La calificación de cada vehículo por `riesgoId`.
- **`sirius-cx-informe.js` (v1.1):** la foto de cada extra verificado y la avería sin pieza.
- **Escenas:**
  - `SalidaVeh.dc.html` y el Back-office: escenas `pdfvehgrz` y `pdfvehaverias`.
  - `datos-cx-grz.js` (nuevo).
  - `datos-escenas.js`, 828 escenas.
  - `assets/grz3277/` (16 fotos de la propuesta y una firma de prueba).
- **Sin cambios:** `sirius-conexion.js` (70 bytes), `datos-documentos-pdf.js` y los archivos de configuración vigilados.

### Qué cambió

- **Informe, en este orden:**
  1. Portada: «Kia Sportage LX 2018 · Sedán · Amarillo · Uso particular»; la tarjeta Vehículo dice «2018 · Sedán · Amarillo».
  2. Recuadro del resultado según quién decidió: «Determinado al completar por David Alejandro Mena (Administrador, en lugar de Control de calidad de Eurosurvey) · 22/11/2026 · 16:26 · dentro de la facultad Asegurable y No asegurable de la agencia Eurosurvey»; «Calificado por <quién> · <fecha>»; «Determinado por el inspector» solo si lo determinó el inspector en sitio.
  3. Hallazgos relevantes.
  4. Valores, con «Valor comercial de referencia: … · Fuente del valor: …».
  5. Datos de la inspección, con la fecha y hora de carga.
  6. Identificación del vehículo (nueva).
  7. Matrícula y propietario (el nombre en la matrícula siempre).
  8. Uso y conductor: «Conductor habitual» es un dato; si es otra persona, su cédula, nombre y edad.
  9. Estado del vehículo.
  10. Extras declarados por el cliente y Extras verificados.
  11. Averías: la isometría y la tabla en cualquier modalidad; la avería sin pieza va solo en la tabla.
  12. Verificaciones externas: consulta, resultado, fecha y hora, forma y observación.
  13. Asegurabilidad (reemplaza «Observaciones del inspector»).
  14. Trazabilidad y firmas de quien actuó: realizó la autoinspección, atendió (con su firma), inspeccionó, completó y determinó o completó, y calificó.
  15. Registro fotográfico y Documentos, sin salto de página.
- **Resumen para el APS:**
  - Portada con las 4 fotos exteriores en una fila.
  - Recuadro con el veredicto, la cobertura, las condiciones de póliza y «Inspección por autoinspección del … · resultado del …».
  - Secciones: 1 Vehículo inspeccionado, 2 Valores con la referencia, 3 Puntos a considerar para la emisión, 4 Estado del vehículo (con averías o preexistencias y extras declarados y verificados), 5 Datos de la inspección, y la nota final.

### Prueba de cobertura (pdfvehgrz)

Son 64 claves con valor: 62 del formulario y 2 de la app.

- **49 impresas:**
  - Identificación del vehículo: 14.
  - Matrícula y propietario: 7.
  - Uso y conductor: 7.
  - Datos de la inspección: 4.
  - Estado › Identificación: 2.
  - Equipamiento: 3.
  - Testigos: 7.
  - Valores: 5.
- **13 omitidas por regla:** 12 accesorios en «No», porque el equipamiento va por excepción, y los puntos de la licencia en 30.
- **De la app:** la lista de extras se imprime en «Extras declarados por el cliente» (Neblineros | Ford | F-11). El tipo «sedan» se omite porque repite la carrocería.
- **Resultado:** sin diferencias. La tabla clave por clave, con su sección y su texto, está en `cobertura.txt`, que se entregó en el chat.

### Prueba visual

- **Informe:** 5 páginas, frente a 6 de la propuesta. Por palabras es el mismo contenido. La única diferencia es «Asegurable y No asegurable», el nombre de la facultad, que sale del dato.
- **Resumen:** 2 páginas, con exactamente las mismas 299 palabras.
- **Diferencias de compaginación:** el motor de P-1c4 deja algo más de aire que la maqueta. Por eso «Datos de la inspección» (informe) y «Valores» (resumen) empiezan en la página 2: les faltan 1,7 mm para caber enteras al pie de la página 1, y una sección corta no se parte.
- **Vista previa:** muestra el mismo PDF, con el mismo texto en las 5 páginas y una diferencia de píxeles de 1,7 a 2,7/255.

### Prueba de paginación (pdfvehgrz y pdfvehaverias)

- Ninguna foto queda separada de su número y su respaldo (18 de 18 y 11 de 11).
- Ningún subtítulo de grupo queda solo al pie.
- Ningún contenido pasa de 284 mm (el pie empieza en 286,6).
- Ningún capítulo queda solo.
- Revisé una captura de cada cambio de página.

### Verificado

- **Tamaño:** el informe del GRZ3277 pesa 0,88 MB y el resumen 0,26 MB.
- **Pantalla:** a 1280×720 y 1920×1080 no hay desplazamiento horizontal y se ven las 5 páginas.
- **Regresión:** el contenido de cada escena cambia solo en lo que define DEC-273.
  - Comunes a todas:
    - la carrocería en la portada;
    - «Calificado por X · fecha» (antes «el fecha»);
    - las fechas de las fotos con el año completo;
    - «Fecha y hora de inspección» y «de carga»;
    - las secciones Identificación del vehículo, Matrícula y propietario, Uso y conductor y Asegurabilidad;
    - las etiquetas del formulario;
    - «Extras verificados»;
    - las verificaciones con Consulta y Fecha y hora;
    - la trazabilidad con «Informe completado»;
    - las firmas solo de quien actuó.
  - pdfvehvector, pdfvehborrador y pdfvehpreview: 9 páginas en lugar de 8. pdfvehasegurable sigue con 7.
  - pdfvehresumen: además, el nuevo esquema del resumen. Los extras de la solicitud del ejemplo salen en «Extras verificados».
  - pdfvehcx, pdfvehcxuno y pdfvehcxvacio: lo común.
  - pdfvehagencia y pdfvehagenciaoff: lo común, y desaparece la firma vacía «Atendió —».
  - caldeterminado:
    - la pantalla de Calificación queda igual;
    - el PDF de cada vehículo pasa de «Determinado por el inspector Patricia Andrade» (incorrecto) a «Determinado al completar por Patricia Andrade (Control de calidad (agencia)) · … · dentro de la facultad …»;
    - el V1 ahora trae la cobertura de su calificación (P-1c5b).

### No verificado

- La base real: el nombre de la facultad, la forma de `respuestas.extras`, la firma de quien atiende, la foto de cada extra verificado, la avería sin pieza y si la base informa su hora (`reloj.ahora`).
- Los nombres de los pasos de la app (Frontal, Chasis/VIN grabado…): la escena los toma de un formulario publicado simulado.
- Firefox y Safari.

### Diferencias y pendientes

- Las dos diferencias previstas con la propuesta: las fotos siguen sin salto de página y la facultad lleva su nombre.
- «Datos de la inspección» y «Valores» empiezan en la página 2 por la regla de no partir una sección corta.
- **Defecto anterior, no corregido:** la frase de Identificación imprime «sticker VIN.No verificado» sin espacio cuando hay un «No verificado». Viene de antes; la regresión de la base lo muestra igual.
- El rol «Control de calidad (agencia)» sale entre paréntesis dentro del paréntesis de la frase, tal como llega en el dato.

### Escenas

- **`pdfvehgrz`:** caso 50061 (GRZ3277) con los datos de la base de David.
- **`pdfvehaverias`:** caso 50062, presencial, con averías, verificaciones externas, extra verificado, asegurabilidad completa y firma. Las dos están en el área «Salida PDF» y abren el Informe y el Resumen para el APS.

Tiempo de la etapa: inicio 22/11/2026 17:02 · fin 22/11/2026 17:42 · 40 min

---

## 18/10/2026 · 20:30 — Etapa P-1c5b

Publiqué la versión 389 de SIRIUS. Los archivos subieron en la 388 y esta versión cierra el registro con el tiempo de la etapa.

Con la base real, las calificaciones traen `riesgoId` (la referencia del vehículo, «50046-V1») y `riesgo` con la descripción completa («Chevrolet Onix 2024 · PGA8978»). `cxCalifMap` y `cxCalifs` usaban primero `riesgo`, que no coincide con `r.id`, `r.label` ni `r.placa`; por eso un vehículo determinado al completar salía como «Calificado por — · —», con «Cambiar veredicto». Apliqué los dos reemplazos exactos de la asesoría: ahora van primero `riesgoId` y después `riesgo`. Sin `riesgoId` (escenas anteriores) todo queda como antes.

La escena caldeterminado ahora trae `riesgoId` y la descripción completa en `riesgo`, como la base real (datos-cx-determinado.js v1.1). Reproduje el fallo con el archivo anterior y estos datos: «Calificado por — · —» y «Cambiar veredicto». Con los reemplazos sale «Determinado al completar por Patricia Andrade · dentro de su facultad · 22/11/26 · 14:24», sin «Cambiar veredicto». Regresión: caldeterminado, caldeterminadoflujo, calveh, calvehapply, calrapida y calcola, iguales que antes (texto y sin errores).

No verificado: la escena con la base real.

Tiempo de la etapa: inicio 22/11/2026 16:18 · fin 22/11/2026 16:22 · 4 min

---

## 18/10/2026 · 20:30 — Etapa P-1c5

Publiqué la versión 387 de SIRIUS. Los archivos subieron en la 386 y esta versión cierra el registro con el tiempo de la etapa.

Con la conexión, la decisión y el resultado de cada vehículo salen ahora de la base. El bloque «Informe completado», «Resultado», Riesgos, Calificación, el encabezado, la cola y las bandejas leen el informe de ese vehículo y su `riesgo_estado`. La pantalla ya no guarda estados propios por número de caso, y después de completar, devolver o reenviar vuelve a leer la base.

La determinación al completar (nivel 0) cuenta como resultado. La vista previa de Vehículos muestra el mismo PDF que se descarga, dibujado con pdf.js. Corregí siete detalles del PDF y del formulario.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia |
|---|---|
| `SIRIUS Back-office.dc.html` | **Decisión por vehículo.** Nueva `cxDecVeh(c)`, que lee el informe del vehículo (`decision` con `tipo`, `criterio`, `motivo`, `por`, `rol`, `hora` y `facultad`) y su `riesgo_estado`. La usan el bloque «Informe completado», `cpRelevante` y las filas de la bandeja.<br>**Completar, devolver y reenviar.** Con la conexión no dejan `overrides`, `riesgoOv` ni `infOv`, y después vuelven a leer la base (`cxRecargarCaso`).<br>**Lectura de la base.** `riesgo_estado` pasa a `estado` y `aseg`. La calificación de nivel 0 deja `detCx`. El estado del caso es el de `casos[].estado`.<br>**Calificación.** Solo lectura con «Determinado al completar…», «N de M vehículos con resultado» y sin «Calificar inspección» cuando todos tienen resultado. `cxInfVeh` acepta `decision` como objeto.<br>**Formulario.** La fecha de la autoinspección es la hora del envío. Lo vacío en pantalla ya no borra lo que la base tiene.<br>**Escenas** nuevas en el registro. |
| `sirius-completar.js` | `registrarDecision(id, d, rid)` e `info(id, rid)` con clave caso + vehículo (solo para la demostración) |
| `sirius-salida-veh.js` | `contextoCx`: `decision` como objeto, el nivel 0 como resultado y el motivo de No asegurable (observación o motivo de la decisión). En autoinspección, la hora de inspección es el envío. |
| `sirius-documentos-pdf.js` | Preexistencias del resumen («en lo revisado»), «todavía» solo con el informe por completar, trazabilidad «21/11 · 22:55», conductor «Es el asegurado» y «vehículo i de n» en la demostración |
| `SalidaVeh.dc.html` | Vista previa con pdf.js 3.11.174 (cdnjs). Aviso con «Descargar PDF» si pdf.js no carga. Control de calidad tomado del PDF y descarga del mismo PDF. |
| `FotosEvidencias.dc.html` | El aviso de la foto queda dentro de su tarjeta: «…» y el texto completo al pasar el cursor |
| Nuevos | `datos-cx-determinado.js` (base simulada de `caldeterminado` y `caldeterminadoflujo`) y las tres escenas en `datos-escenas.js` (826 escenas) |
| Sin cambio | `sirius-pdf-vector.js` (motor y diseño del PDF), `datos-documentos-pdf.js`, `sirius-conexion.js` (70 bytes) y los archivos de configuración vigilados: no se subió ninguna versión (DEC-262) |

**Qué cambió**

1. **«Informe completado» y «Resultado» por vehículo.** Con la conexión, el bloque lee el informe del vehículo y muestra:
   - quién y cuándo (`decision.por`, `rol` y `hora`);
   - qué decidió (confirmar, cambiar o determinar, con el criterio) y su motivo;
   - la facultad: «Dentro de la facultad <fac> de <agencia>» o «Fuera de la facultad: va a calificación»;
   - «Resultado: <estado> · <veredicto>», de `riesgo_estado`.

   El registro en memoria queda solo para la demostración, con la clave caso + vehículo. También se usa cuando una base simulada antigua no aplica la acción (`local`).
2. **Completar, devolver y reenviar.** Con la conexión, la pantalla ya no deja su propio destino. Con `{ ok: true }` quita lo que la sesión tuviera del caso y de sus vehículos, vuelve a leer la base y el aviso dice lo que respondió la base («Informe completado · PCX5140 · Inspeccionado · Asegurable»).
   - El estado del caso es el de `casos[].estado`. Antes, con varios vehículos, se recalculaba y un caso con dos informes por completar salía «Agendado».
   - `riesgos[].riesgo_estado` manda en el estado y el veredicto de cada vehículo.
3. **Determinación al completar (nivel 0).** Es un resultado:
   - el vehículo muestra en Calificación «Resultado de <placa>», con la etiqueta «Determinado al completar», el veredicto, el motivo si es No asegurable y «Determinado al completar por <quien> · dentro de su facultad · <fecha>»;
   - está en solo lectura: sin formulario ni «Cambiar veredicto»;
   - el contador dice «N de M vehículos con resultado · K asegurables»;
   - no entra en la cola ni en el menú Calificación;
   - con todos los vehículos con resultado, no aparece «Calificar inspección».

   Con un solo vehículo, la tarjeta «Determinada al completar el informe» se muestra en solo lectura, con el aviso.
4. **Vista previa = PDF.** La ventana genera el PDF vectorial de la descarga y dibuja sus páginas con pdf.js, a todo el ancho y con desplazamiento, para el informe y el resumen.
   - «Descargar PDF» guarda ese mismo PDF y el diseño no cambia.
   - Si pdf.js no carga, aparece el aviso con el botón de descarga, nunca la versión HTML.
   - El control de calidad («N páginas A4 · mayor espacio libre…») se mide en el PDF.
5. **PDF.**
   - **Motivo de No asegurable:** va en el recuadro, en la tarjeta y en el resumen. Sale de la observación de la calificación o, en la determinación, del motivo de la decisión.
   - **Preexistencias:** el resumen lista las encontradas. Si no hay, dice «Sin preexistencias en lo revisado: <solo las revisiones con datos>». Sin datos dice «El informe no registra datos de preexistencias», y «todavía» solo aparece con el informe por completar.
   - **Trazabilidad:** «21/11 · 22:55». Antes, un año de cuatro cifras quedaba «21/1126».
   - **Conductor:** con la opción «Es el asegurado», la frase es «El conductor habitual es el asegurado.», sin «es es».
   - **«Vehículo i de n»:** también en la demostración, con los vehículos del caso.
6. **Fecha de la autoinspección.** Es la hora en que el cliente envió ese vehículo (`enviadoEn` de su informe). Se precarga con origen «Sistema» y la nota «Envío del cliente (autoinspección)», y ya no es un pendiente. El PDF imprime la misma hora. En presencial no cambia.
7. **Aviso de la foto.** Queda dentro de su tarjeta, cortado con «…», con el texto completo al pasar el cursor.

Otro hallazgo: al completar, la pantalla mandaba a la base las grillas vacías (averías, neumáticos, verificaciones externas) y borraba lo que el cliente había enviado. Por eso el resumen de un informe completo podía decir que no tenía datos, como el de AU044M. Ahora lo vacío en pantalla no reemplaza lo que la base ya tiene, y una grilla respondida aunque esté vacía («sin averías») se conserva.

**Prueba cruzada**

| Escena · vehículo | Base simulada | Bloque «Informe completado» | Riesgos | Calificación | Encabezado · cola · bandeja | PDF |
|---|---|---|---|---|---|---|
| caldeterminado · PCX5140 | Completo; nivel 0 Asegurable; 22/11 14:24; `riesgo_estado` Inspeccionado · Asegurable | Patricia Andrade · Control de calidad (agencia) · 22/11/26 · 14:24 · Determinó: Asegurable · Motivo · Dentro de la facultad Asegurable y No asegurable de Eurosurvey · Resultado: Inspeccionado · Asegurable | Asegurable · Determinado al completar por Patricia Andrade · dentro de su facultad · 22/11/26 · 14:24 | Solo lectura; «2 de 2 vehículos con resultado · 1 asegurable»; sin formulario ni «Cambiar veredicto» | «Inspeccionado»; sin «Calificar inspección»; no está en la cola (0 informes) | Sello «INSPECCIONADO · ASEGURABLE»; recuadro «Inspeccionado · Asegurable · Todo riesgo»; vehículo 1 de 2; fecha de inspección 21/11/2026 · 22:55 (envío); «El conductor habitual es el asegurado.» |
| caldeterminado · PCX5141 | Completo; nivel 0 No asegurable con motivo; 22/11 14:31 | Patricia Andrade · 14:31 · Determinó: No asegurable · Motivo: Hundimiento profundo… · Resultado: Inspeccionado · No asegurable | No asegurable · Determinado al completar · 14:31 | Solo lectura; motivo de rechazo | Igual | Sello «NO ASEGURABLE»; recuadro, tarjeta y resumen con el motivo; Preexistencias «1 avería: guardafango posterior izquierdo (Alta)»; fecha 21/11/2026 · 23:07 (envío) |
| caldeterminadoflujo · después de completar PCX5140 | V1 Inspeccionado · Asegurable (nivel 0, 14:24); V2 y caso «Informe por completar» | V1: Andrea Salazar · Administrador · 14:24 · Determinó: Asegurable · Resultado: Inspeccionado · Asegurable; V2 sigue por completar | V1 Asegurable · Determinado al completar; V2 Esperando informe | «1 de 2 vehículos con resultado · 1 asegurable»; V2 «Esperando el informe» | «Informe por completar», como la base; sin `overrides` (nulos) | — |
| caldeterminadoflujo · después de completar PCX5141 | V2 Inspeccionado · No asegurable (14:31); caso Inspeccionado | V1 sigue con lo suyo (14:24, Asegurable); V2: 14:31 · No asegurable · Motivo · Resultado: Inspeccionado · No asegurable | Los dos con su veredicto y su hora | «2 de 2 vehículos con resultado · 1 asegurable» | «Inspeccionado»; sin «Calificar inspección»; cola 0; Completados: PCX5141 «Inspeccionado · No asegurable · Andrea Salazar» (14:31) y PCX5140 «Inspeccionado · Asegurable» | PDF generado en la misma sesión: sellos y recuadros como la base; fechas 22:55 y 23:07 |
| Formulario (caldeterminadoflujo, PCX5140) | `enviadoEn` 21/11/26 22:55 | «Fecha y hora de inspección» 21/11/26 · 22:55, origen «Sistema»; ya no es un pendiente | | | | 21/11/2026 · 22:55 |
| Vista previa = PDF | | pdfvehpreview (informe, 8 páginas; resumen, 2) y caldeterminado (PCX5141 informe, 4 páginas; resumen, 1; PCX5140 informe, 4): las mismas páginas, el mismo texto en cada página (pdf.js frente al PDF descargado) y una diferencia media de píxeles de 0,4 a 3,2 sobre 255 (suavizado). Con la conexión, una sola llamada a `documentoRegistrar` para la vista previa y la descarga. Sin pdf.js: el aviso con «Descargar PDF» (8 páginas A4) | | | | |

**Verificado**

- **Escenas nuevas:** caldeterminado, caldeterminadoflujo y pdfvehpreview, sin errores de página. Revisé las pantallas a 1280×720 y 1920×1080 (Calificación, el bloque «Informe completado», la vista previa e Informe › Fotos), sin desborde horizontal.
- **Aviso de la foto:** queda dentro de su tarjeta (174 a 409 px, con la tarjeta de 163 a 420 px) a 1280×720 y 1920×1080, con «…» y el texto completo al pasar el cursor.
- **Un solo vehículo** determinado al completar (sin `riesgos[]`): Calificación en solo lectura con «Determinada al completar el informe», sin «Calificar inspección» ni «Editar calificación». El bloque se lee de la base.
- **Regresión:**
  - Al abrir, el texto de la pantalla es igual en infcompletar, infcompletarcaso, infcompletarcambiar, infcompletarind, cxr0bcompletar, autodecision, autointerno, autotercero, calveh, calvehapply, calrapida, calcola y n2done.
  - Al completar en la demostración (infcompletarcaso e infcompletarcambiar) y en autodecision (base simulada sin aplicar), el estado, el bloque y el aviso no cambian.
  - Con la conexión simulada, es igual en cxestadoparcial, cxcabecera, cxestadofases, cxriesgosestados, cxr0, cxr0cauto, cxr0dcalidad, cxr0dcalificar, cxr0dadmin, cxr0emodulo, cxr0ebandeja, cxr0eresumen, cxlimpio, calcxcalif, coordagrupar y coordfases, salvo cxr0b (ver Diferencias).
  - El texto de los PDF es igual y tiene las mismas páginas en pdfvehvector, pdfvehresumen, pdfvehborrador, pdfvehasegurable, pdfvehcx, pdfvehagencia, pdfvehagenciaoff, pdfvehcxuno y pdfvehcxvacio. pdfvehcxerror sigue sin PDF y con el mensaje de la base.
- **Archivos sin cambio:** `sirius-conexion.js` sigue en 70 bytes. `datos-documentos-pdf.js` y `sirius-pdf-vector.js` no cambiaron, y no se tocó ningún archivo de configuración vigilado.

**No verificado**

- **Base real:** que `informes[caso][].decision` traiga `tipo`, `criterio`, `motivo`, `por`, `rol`, `hora` y `facultad { fac, dentro, agencia }`; si falta `agencia`, el bloque usa el nombre del responsable del completado. Tampoco verifiqué que la calificación de nivel 0 traiga el motivo en `observacion` o `motivo`, ni que `casos[].estado` y `riesgo_estado` se actualicen antes de responder `{ ok: true }`.
- **Hallazgo de las grillas:** que la causa del resumen de AU044M sea la de las grillas vacías. Si la base real ya las borró, hay que volver a pedir el informe a la base o corregir los datos.
- **pdf.js** desde cdnjs en la red de la compañía, Firefox y Safari. La prueba usó la misma versión 3.11.174 servida localmente.
- **Devolver al inspector y reenviar** con la conexión real: probé completar en las dos escenas, no la devolución.

**Diferencias**

- **Encabezado con la conexión:** el estado del caso es el de la base (`casos[].estado`) y ya no se recalcula con los vehículos. En las escenas con la conexión probadas no cambia nada.
- **cxr0b:** PRB1212, que la base trae «Completo», ahora muestra su bloque «Informe completado» (Mauricio Endara · Determinó: Asegurable · Resultado: Inspeccionado), leído de la base. Antes no aparecía.
- **Vista previa:** en Vehículos ya no es la versión HTML: son las páginas del PDF. Con la conexión, abrirla registra el documento en la base, como la descarga: el código que se ve es el mismo que se descarga, y descargar después no lo registra otra vez. Las escenas dp1diag, dp1veh y svpdq muestran ahora el PDF y dp1diag ya no lleva la vista al diagrama de averías. Equipo y maquinaria sigue con la versión HTML.
- **Preexistencias:** el resumen sin preexistencias dice «Sin preexistencias en lo revisado: …» con solo las revisiones con datos. Sin datos, «El informe no registra datos de preexistencias». Con el informe por completar, «El informe todavía no tiene los datos para evaluar preexistencias».
- **Texto neutro de hallazgos:** con el informe completo y sin datos, dice «El informe no registra datos para evaluar hallazgos.»
- **Completados (bandeja):** la columna «Completado» muestra la hora en que se completó, no la del envío.
- **Avisos al completar con la conexión:** dicen lo que respondió la base. Antes decían lo que la pantalla calculaba.

**Escenas**

- `caldeterminado` (Calificación, conexión simulada): caso 50140 con los dos vehículos determinados al completar, Daniela Ruiz como Ejecutivo de inspecciones.
- `caldeterminadoflujo` (Calificación, conexión simulada): caso 50141. Completa PCX5140 y luego PCX5141 en la misma sesión, como Administrador.
- `pdfvehpreview` (Salida PDF): la vista previa del 20196 con pdf.js.

Registro: este archivo. Inventario: filas actualizadas y la sección «Decisión y resultado por vehículo desde la base, y vista previa = PDF (etapa P-1c5 · DEC-271, DEC-272)».

Tiempo de la etapa: inicio 22/11/2026 14:49 · fin 22/11/2026 15:56 · 67 min

---

## 18/10/2026 · 20:30 — Etapa P-1c4

Publiqué la versión 385 de SIRIUS (los archivos subieron en la 384; esta versión cierra el registro con el tiempo de la etapa). El encabezado del PDF de Vehículos ahora ocupa un quinto de la página (la franja termina en 58,9 mm, con el tope en 59 mm), en dos filas como el modelo, y el contenido tiene dos ajustes: la frase completa del conductor habitual y los números de foto en el orden en que se imprimen.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia |
|---|---|
| `sirius-pdf-vector.js` | Solo `LP.portada` (franja, logos, sello, título, placa y tarjetas); las demás piezas, la paginación y el pie no se tocan |
| `sirius-documentos-pdf.js` | `documentoVector`: línea de la aseguradora («Proceso de Inspecciones · Nuevo Riesgo · <ciudad>, <fecha>» en una sola línea, también con la fecha del registro); frase del conductor habitual; nueva `fotosEnOrden` y `preparar(ctx, opts, secs)` (numeración F-n), llamada desde `documento()` y `documentoVector()` |
| Sin cambio | `datos-documentos-pdf.js`, `sirius-salida-veh.js`, `datos-cx-pdfveh.js`, `SalidaVeh.dc.html`, `SIRIUS Back-office.dc.html`, `DocumentoPdf.dc.html`, `datos-escenas.js`, `sirius-conexion.js` (70 bytes). Ningún archivo vigilado cambió, por eso no subió ninguna versión de configuración (DEC-262) |

**Qué cambió**

1. **Encabezado compacto (franja de 59 mm como máximo).** Fila 1 (5,5 a 27 mm): a la izquierda el logo de SIRIUS de 17 mm de alto (hasta 40 mm de ancho) con «by aseguradora del sur» de 8 pt debajo; a la derecha, a 196 mm, el logo de la aseguradora de 11 mm de alto (hasta 40 mm), debajo «ASEGURADORA DEL SUR C.A.» de 10 pt en negrita y una sola línea de 8 pt «Proceso de Inspecciones · Nuevo Riesgo · <ciudad>, <fecha>». Con el logo de la agencia activado, va a la izquierda del logo de la aseguradora, en la misma fila, de 9 mm de alto y con la línea fina. Fila 2 (29 a 56 mm): «INFORME DE INSPECCIÓN VEHICULAR» (o «RESUMEN…») de 9 pt; la placa de 27 pt en negrita con «Caso N · vehículo i de n» de 12,5 pt en la misma línea; el vehículo de 8,5 pt; el sello de 27 mm de diámetro (aro de 1,1 mm), centrado bajo el bloque de la aseguradora, con «SIRIUS · v1» de 5,5 pt, el estado de 8 pt y el veredicto de 7 pt, todo dentro del aro. El círculo blanco decorativo es más pequeño (96 mm) y queda en la esquina superior derecha. Margen de la franja: 5,5 mm arriba y 2,5 mm abajo; las tarjetas empiezan 5 mm bajo la franja. Los logos se ajustan a su zona sin deformarse.
2. **Conductor habitual.** Con el asegurado como conductor, el informe imprime «El conductor habitual es el asegurado.» (frase completa); con otro valor, «El conductor habitual es <valor>.».
3. **Números de foto en el orden de impresión.** Primero las fotos de la portada (frontal y posterior), después el registro fotográfico y por último los documentos, sin saltos. La tabla de averías (columna «Foto») y las dos fotos de la portada leen el mismo número que la foto impresa, porque salen del mismo registro. La vista previa de la hoja usa la misma numeración.

**Prueba visual (contra la imagen del modelo)**

| Escena | La franja termina en | Texto del sello | Texto de la izquierda termina en |
|---|---|---|---|
| pdfvehvector | 58,9 mm | 21,5 mm de ancho dentro del aro | 115,3 mm (el sello empieza en 166 mm) |
| pdfvehresumen | 58,9 mm | 21,5 mm | 115,3 mm |
| pdfvehasegurable | 58,9 mm | 21,5 mm | 115,3 mm |
| pdfvehborrador | 58,9 mm | 15,6 mm («POR COMPLETAR») | 115,3 mm |
| pdfvehagencia (logo de la agencia activado) | 58,9 mm | 21,5 mm | 81,7 mm |
| pdfvehcxuno | 58,9 mm | 21,5 mm | 81,7 mm |
| pdfvehagenciaoff, pdfvehcx, pdfvehcxvacio | 58,9 mm | de 15,6 a 21,5 mm | de 81,7 a 115,3 mm |

El texto del sello queda entre 168,7 y 190,4 mm, dentro del interior del aro (167,2 a 191,8 mm), incluido «INSPECCIONADO». Ningún texto se cruza con el sello, ni con los logos o la línea fina. Capturé la portada de las nueve escenas con la franja y las tarjetas debajo: las cuatro filas del modelo (logos y aseguradora, título, placa con caso y vehículo, sello) se ven en cada una.

**Prueba cruzada**

| Prueba | Resultado |
|---|---|
| pdfvehvector: números de foto | F-1 a F-45 consecutivos, sin saltos ni repetidos, en el orden impreso |
| pdfvehvector: tabla de averías | «Puerta delantera derecha» → F-38 y «Parachoques posterior» → F-37; coinciden con «F-38 · Daños · Puerta delantera derecha» y «F-37 · Daños · Parachoques posterior» |
| pdfvehvector: fotos de la portada | F-1 Frontal y F-2 Posterior, iguales a las del registro fotográfico |
| pdfvehresumen | Frontal F-1, Posterior F-2, lateral izquierdo F-3 y lateral derecho F-4, en el orden impreso (antes F-1, F-2, F-6 y F-4) |
| pdfvehcxuno | «El conductor habitual es el asegurado.» y fotos F-1 a F-7 consecutivas |

**Verificado**

- **Escenas:** las diez escenas de P-1c1 a P-1c3 se descargan con «Descargar PDF» sin errores de página (pdfvehcxerror sigue sin PDF y con el mensaje de la base, como antes). Pantalla revisada a 1280×720 y a 1920×1080 (pdfvehvector y pdfvehcxuno).
- **Regresión de texto (9 escenas con PDF):** mismo texto y mismo número de páginas que antes de la etapa, salvo lo que esta etapa cambia:
  - **Portada:** «Proceso de Inspecciones · Nuevo Riesgo» y «<ciudad>, <fecha>» pasan de dos líneas a una sola.
  - **Fotos:** los números F-n siguen el orden de impresión (en pdfvehvector, pdfvehborrador, pdfvehasegurable, pdfvehagencia y pdfvehagenciaoff, de F-21… a F-14…; en pdfvehcx y pdfvehcxuno, Kilometraje F-6 y Matrícula frontal F-7; en pdfvehresumen, lateral izquierdo F-6 a F-3) y la tabla de averías lee F-38 y F-37 en lugar de F-45 y F-44.
  - **Conductor:** «el asegurado.» pasa a «El conductor habitual es el asegurado.» (pdfvehcxuno).
  - **Cortes de página:** como el encabezado es más corto, algunos títulos y bloques de la primera y la segunda página suben antes del pie; el contenido es el mismo.
- **Archivos sin cambio:** `sirius-conexion.js` sigue en 70 bytes; `datos-documentos-pdf.js` es idéntico al anterior; los archivos vigilados no se tocaron.

**No verificado**

- Firefox y Safari.
- El logo real de una agencia (se probó con el de demostración, Eurosurvey).
- Un nombre de vehículo o una ciudad muy largos en el encabezado (el texto ajusta a la zona izquierda, pero no probé un caso extremo).
- La base real, igual que en P-1c3 (forma de `documentoRegistrar`, `riesgosBase`, registro de la declaración y URL firmadas).

**Diferencias**

- **Alto del encabezado:** antes la franja terminaba a 89,4 mm de la parte superior; ahora termina en 58,9 mm (tope 59 mm).
- **Líneas de la derecha:** la aseguradora ya no lleva tres líneas, sino el nombre y una sola línea de 8 pt.
- **Sello:** de 27 mm, con el estado dentro del aro; el texto largo reduce su tamaño solo si no cabe.
- **Fotos:** el número de una foto puede cambiar entre versiones del PDF si cambian las fotos que se imprimen, porque ahora siempre es consecutivo.

**Escenas**

Sin escenas nuevas: las seis pedidas (pdfvehvector, pdfvehresumen, pdfvehasegurable, pdfvehborrador, pdfvehagencia y pdfvehcxuno) ya existen en «Salida PDF» y usan el motor nuevo.

Registro: este archivo. Inventario: filas actualizadas y la sección «PDF de Vehículos: encabezado en un quinto de la página (etapa P-1c4 · DEC-272)».

Tiempo de la etapa: inicio 22/11/2026 12:43 · fin 22/11/2026 12:57 · 14 min

---

## 18/10/2026 · 20:30 — Etapa P-1c3

Publiqué la versión 383 de SIRIUS (los archivos subieron en la 382; esta versión cierra el registro con el tiempo de la etapa). Corregí los seis problemas que la asesoría encontró con la base real:

- Un caso de un solo vehículo tiene PDF.
- Con la conexión se imprime «· vehículo i de n».
- El PDF solo afirma lo que tiene respaldo en el informe: sin datos de hallazgos sale un texto neutro, la declaración del cliente solo aparece con su registro fechado y los datos vacíos no se imprimen.
- El recuadro del resultado dice el mismo estado que el sello y la tarjeta.
- El lugar es la dirección de la visita.

En la demostración, lo que tiene datos queda igual; las diferencias están anotadas abajo.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia |
|---|---|
| `sirius-salida-veh.js` | Nueva `riesgosCx(caso)`: los vehículos del caso desde `riesgos[]` o, si no existe, desde `riesgosBase` (id, estado, `riesgo_estado` y datos). `contextoCx` la usa y agrega el lugar de la visita (`lugarVisita`) y el registro de la declaración (`declCx`) |
| `sirius-documentos-pdf.js` | Hallazgos con respaldo, declaración fechada, recuadro DEC-271, campos vacíos fuera, filas vacías fuera de las tablas, lugar de la visita e «i de n» con la conexión |
| `SIRIUS Back-office.dc.html` | `svVehiculos` usa `riesgosCx` (también con un solo vehículo); escenas en el registro |
| `datos-cx-pdfveh.js` (v1.1) | Casos 50047 y 50068, `documentoRegistrar` con `riesgosBase`, la sección de daños respondida en 50091-V1 |
| `SalidaVeh.dc.html`, `datos-escenas.js` | Escenas `pdfvehcxuno` y `pdfvehcxvacio` (823 escenas) |
| Sin cambio | `datos-documentos-pdf.js` (su texto se usa tal cual cuando las cuatro revisiones tienen datos), `sirius-pdf-vector.js` (el motor lee los mismos bloques), `DocumentoPdf.dc.html`, Equipo y maquinaria, `sirius-conexion.js` (70 bytes) |

**Qué cambió**

1. **Un solo vehículo:** si `casos[].riesgos` no existe, el vehículo sale de `casos[].riesgosBase` (id, o «<caso>-V<n>» si falta). El estado y el veredicto salen de `riesgo_estado` de `riesgos[]` o de `riesgosBase`. Lo usan `contextoCx`, `disponibilidadCx`, la lista de la Salida y `documentoRegistrar` de la base simulada. Un caso de ejemplo sin informe en la base sigue con los datos del ejemplo, como en C2-18; `calpdfcx` no cambia.
2. **Hallazgos:** sin hallazgos, el resumen nombra solo las revisiones con datos: testigos registrados, al menos una verificación «Verificado», la sección de daños respondida y consultas externas con resultado; en el resumen, también neumáticos. Si están todas, se usa el texto del modelo tal cual. Si no hay ninguna, sale «El informe todavía no tiene los datos para evaluar hallazgos.» en gris, sin el verde de «bien».
3. **Declaración del cliente:** con la conexión, solo si la base trae su registro con fecha y hora (en el informe, en las respuestas o en el evento «Declaración aceptada»). Si no lo trae, el bloque no aparece. En la demostración se usa la fecha de la inspección, como antes.
4. **Recuadro del resultado:** dice «Informe por completar», «Devuelto al inspector», «Pendiente calificación», «Pendiente calificación de suscripción» o «Inspeccionado · <veredicto> · <cobertura o motivo>». En el PDF toma el estado final, también el que devuelve el registro en la base. Equipo y maquinaria no cambia.
5. **Datos vacíos:** un campo sin valor no se imprime, aunque el modelo lo marque «siempre»; tampoco sale «— km/año». Las filas de neumáticos, extras y verificaciones externas sin ningún valor no se imprimen, y la celda vacía de una fila con datos lleva «—». Las tarjetas de la portada siguen con «—».
6. **Lugar e i de n:** con la conexión, el lugar es la dirección o la ciudad de la visita, con las coordenadas como complemento; sin dirección ni ciudad, el par no aparece. «Vehículo i de n» y «Riesgo i de n» usan los vehículos del caso en la base (`cxIdx`, `cxTotal`).

**Prueba cruzada**

| Prueba | Resultado |
|---|---|
| pdfvehcxuno (50047, un solo vehículo, sin `riesgos[]`) | El PDF existe: 4 páginas, código IV-50047-V1-…, sello «INSPECCIONADO · ASEGURABLE» |
| pdfvehcxuno frente a Informe › Formulario | 41 datos impresos iguales (inspección, identificación, matrícula, uso, verificaciones, accesorios, testigos y valores). No se imprimen la fecha de carga y el tipo de carrocería, porque no están en el modelo del documento, como en 50091. La identificación del propietario sale como «Cédula» del asegurado |
| pdfvehcxuno: fotos y trazabilidad | Las 7 fotos de Evidencias (F-1 a F-7); trazabilidad 15/11 16:20 · 16/11 09:03 · 09:45 · 16:05, igual que el Historial |
| pdfvehcxvacio (50068-V1): texto del PDF | No aparecen «testigos apagados», «identificación verificada», «sin averías», «novedades externas», «aceptada» ni «Declaración». Hallazgos: «El informe todavía no tiene los datos para evaluar hallazgos.» |
| pdfvehcxvacio: «—» | Solo en la tarjeta fija de la portada (Kilometraje) y en dos celdas de la tabla de valores (sugerido y diferencia). Ningún par de datos con «—» |
| pdfvehcxvacio: i de n | «Caso 50068 · vehículo 1 de 2» con la conexión |
| Estado «Informe por completar» (50091-V2) | Recuadro: «Informe por completar» · sello: «POR COMPLETAR» · tarjeta: «Por completar» · Riesgos: «Por completar» |
| Estado «Devuelto al inspector» | Recuadro: «Devuelto al inspector» · sello: «DEVUELTO» · tarjeta: «Devuelto» · Riesgos: «Devuelto» |
| Estado «Pendiente calificación» | Recuadro: «Pendiente calificación» · sello: «EN CALIFICACIÓN» · tarjeta: «En calificación» · Riesgos: «En calificación» |
| Estado «Inspeccionado · No asegurable» | Recuadro: «Inspeccionado · No asegurable» · sello: «INSPECCIONADO · NO ASEGURABLE» · tarjeta: «No asegurable» · Riesgos: «Inspeccionado · No asegurable» |

El recuadro usa el nombre largo del estado; el sello, la tarjeta y Riesgos usan el nombre corto de `SIRIUS_FLUJO` (DEC-271). En los cuatro casos es el mismo estado.

**Verificado**

- **Escenas nuevas:** pdfvehcxuno y pdfvehcxvacio se descargan con «Descargar PDF» sin errores de página. Pantalla revisada a 1280×720 (pdfvehcxvacio) y 1920×1080 (pdfvehcxuno).
- **Regresión de las 8 escenas de P-1c1, P-1c2 y P-1c2b:** mismo texto, salvo lo que corrige esta etapa:
  - **Recuadro:** en todas, «Inspeccionado · <veredicto> · <detalle>» en lugar de «<veredicto> · <detalle>».
  - **pdfvehborrador:** el recuadro pasa de «Pendiente de calificación» a «Informe por completar».
  - **pdfvehcx:** el lugar pasa de «Quito» a la dirección de la visita, «Av. Amazonas N34-120». Salen 3 filas de verificaciones externas sin datos en la base («Fiscalía por cédula», «Siniestralidad», «Codificación del VIN», que salían «— — —»), y el PDF pasa de 5 a 4 páginas.
  - **pdfvehagencia y pdfvehagenciaoff (30003-V1, demostración):** hallazgos «Sin hallazgos relevantes: testigos apagados.», porque ese vehículo de ejemplo solo tiene testigos registrados. Además sale el par «Matrícula vigente hasta —».
  - **pdfvehcxerror:** igual, sin PDF y con el mensaje de la base.
- **Vista previa de otras escenas:** en svpdq, svresumen y dp1veh solo cambia el título del recuadro («Inspeccionado · …»). empdf (Equipo y maquinaria), calpdfcx (C2-18) y dpestilo quedan iguales.
- **Archivos sin cambio:** `sirius-conexion.js` sigue en 70 bytes. `datos-documentos-pdf.js`, `sirius-pdf-vector.js` y `DocumentoPdf.dc.html` no cambiaron.

**No verificado**

- La base real: que `riesgosBase[]` traiga `id`, `estado` y `riesgo_estado` con un solo vehículo, y la forma del registro de la declaración del cliente (acepto `declaracion.at`/`hora`/`aceptadaEn` en el informe o sus respuestas, o el evento «Declaración aceptada»).
- Un caso de la base con un solo vehículo y `riesgos[]` presente (sigue el camino de varios).
- Firefox y Safari.

**Diferencias**

- **Título del recuadro:** con veredicto, ahora empieza con «Inspeccionado ·» en el informe, en el resumen y en la vista previa, como pide DEC-271.
- **Demostración:** 30003-V1 pierde las afirmaciones sin datos (identificación, averías y externas) y el par «Matrícula vigente hasta —». En 50091-V1 agregué la sección de daños respondida sin averías, para que su resumen siga completo como antes.
- **Caso de ejemplo con un solo vehículo:** si la base no tiene informe, sigue con los datos del ejemplo (C2-18). Con informe en la base, sale de la base.
- **Estado «Devuelto» en Riesgos:** la segunda línea de Riesgos sigue diciendo «Esperando informe»; esa pestaña no es parte de esta etapa.

**Escenas**

En el área «Salida PDF», con la conexión simulada:

- `pdfvehcxuno`: el caso 50047, de un solo vehículo, Inspeccionado · Asegurable y con el informe completo.
- `pdfvehcxvacio`: 50068-V1, vehículo 1 de 2, con el informe en «Datos de campo» y sin respuestas.

Registro: este archivo. Inventario: filas actualizadas y la sección «PDF de Vehículos: un solo vehículo y contenido con respaldo (etapa P-1c3 · DEC-272, DEC-125)».

Tiempo de la etapa: inicio 22/11/2026 11:41 · fin 22/11/2026 11:57 · 16 min

---

## 18/10/2026 · 20:30 — Etapa P-1c2b

Publiqué la versión 381 de SIRIUS (los archivos subieron en la 380; esta versión cierra el registro con el tiempo de la etapa). El logo de la agencia que inspeccionó ya no sale siempre: ahora es una opción del documento, «Incluir el logo de la agencia que inspeccionó», en Documento PDF › Estilo y logos, desactivada por defecto. Con la opción desactivada la portada lleva solo el logo de la aseguradora con sus tres líneas; con la opción activada y un vehículo inspeccionado por una agencia, el logo de la agencia va a su izquierda, en la misma fila, a 12 mm de alto y con la línea fina; sin logo, su nombre en 9 pt. Si el vehículo no lo inspeccionó una agencia, sale solo la aseguradora en los dos casos.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia |
|---|---|
| `DocumentoPdf.dc.html` | La casilla en Estilo y logos (solo en los documentos de Vehículos), su nota y el texto de la muestra del encabezado |
| `sirius-documentos-pdf.js` | `estiloBase` con `logoAgencia: false`; el motor vectorial y la vista previa de Vehículos usan la agencia solo con la opción activada; el listado de cambios del borrador la nombra |
| `SalidaVeh.dc.html` y `SIRIUS Back-office.dc.html` | La escena nueva `pdfvehagenciaoff`; `pdfvehagencia` activa la opción en el estilo del documento |
| `datos-escenas.js` | 1 escena nueva (821) y la descripción de `pdfvehagencia` |
| Sin cambio | `datos-documentos-pdf.js`, `sirius-pdf-vector.js`, `sirius-salida-veh.js`, `datos-cx-pdfveh.js`, Equipo y maquinaria, Ramos Generales, `sirius-conexion.js` (70 bytes) |

**Qué cambió**

- **Estilo del documento:** la opción se guarda como `logoAgencia` en `estiloDoc`, igual que los logos y el pie. Su valor por defecto está en `estiloBase` del renderizador; los documentos publicados en la base no la traen y quedan desactivados, así que `datos-documentos-pdf.js` no se tocó.
- **Diseñador:** la casilla aparece solo en el informe y el resumen de Vehículos (no en Equipo y maquinaria ni en Ramos Generales). Al marcarla se crea el borrador, el listado de cambios de la publicación dice «Logo de la agencia que inspeccionó: se incluye en la portada» y se versiona como los demás cambios. La muestra del encabezado dice «Sin logo de la agencia» o «Logo de la agencia (si inspeccionó una)».
- **Motor y vista previa:** `documentoVector` y el encabezado de la vista previa de Vehículos leen `estiloDoc.logoAgencia === true`. Equipo y maquinaria sigue como antes.
- **Escenas:** `pdfvehagencia` activa la opción; `pdfvehagenciaoff` es el mismo vehículo (30003-V1) con la opción desactivada.

**Prueba cruzada (portada, descargada con «Descargar PDF»)**

| Caso | Opción | Portada |
|---|---|---|
| 30003-V1 (agencia Eurosurvey con logo de prueba) | Activada | Logo de la agencia, línea fina y logo de la aseguradora en la misma fila (6 imágenes en la página 1) |
| 30003-V1 | Desactivada (pdfvehagenciaoff) | Solo la aseguradora con sus tres líneas (4 imágenes) |
| 20196-V1 (inspector interno) | Activada | Solo la aseguradora, igual que desactivada |
| 20196-V1 | Desactivada / por defecto | Solo la aseguradora |

La vista previa de la hoja muestra lo mismo que el PDF en cada caso.

**Verificado**

- **Diseñador:** a 1280×720 y 1920×1080 la casilla sale desmarcada, se marca y se desmarca; al marcarla el borrador pasa a `logoAgencia: true` y el listado de cambios la nombra; al desmarcarla el listado queda vacío. En Equipo y maquinaria (dppresentacion) y en Ramos Generales (dprg) no aparece; en Vehículos sí (dpestilo, dpnuevo).
- **Regresión:** las escenas pdfvehvector, pdfvehresumen, pdfvehborrador, pdfvehasegurable y pdfvehagencia dan el mismo texto y las mismas páginas que en la versión anterior. pdfvehcx también, salvo una línea: el inspector del 50091 es de Eurosurvey y la portada ya no repite su nombre arriba (la sección Inspector del informe sigue nombrándolo).
- **Sin errores de página** en ninguna escena probada; `sirius-conexion.js` sigue en 70 bytes y `datos-documentos-pdf.js` no cambió.

**No verificado**

- Una agencia con logo real subido en Usuarios y roles › Agencias (solo con el de prueba).
- La publicación del borrador con la opción en la base real.
- Firefox y Safari.

**Diferencias**

- **Cambio de comportamiento:** los PDF de Vehículos que antes llevaban el nombre o el logo de la agencia en la portada ya no lo llevan hasta que se active la opción en Estilo y logos y se publique la versión.
- **Equipo y maquinaria:** su encabezado sigue mostrando la agencia como antes; la opción pedida es solo de Vehículos.
- **Lado derecho «Agencia de inspección»:** en el selector de logos sigue existiendo como elección del encabezado de las demás plantillas.

**Escenas**

En el área «Salida PDF»: `pdfvehagencia` (30003-V1, opción activada) y `pdfvehagenciaoff` (el mismo vehículo, opción desactivada). En Administración, `dpestilo` muestra la casilla en Estilo y logos.

Registro: este archivo. Inventario: filas actualizadas y la sección «El logo de la agencia en el PDF, opcional (etapa P-1c2b · DEC-272)».

Tiempo de la etapa: inicio 22/11/2026 11:25 · fin 22/11/2026 11:33 · 8 min

---

## 18/10/2026 · 20:30 — Etapa P-1c2

Publiqué la versión 379 de SIRIUS (los archivos subieron en la 378; esta versión cierra el registro con el tiempo de la etapa). Con la conexión, el PDF de Vehículos se arma solo con la base: lee las respuestas igual que la pestaña Informe, que ahora toma esa lectura de un módulo común, y trae las fotos reales del vehículo. Antes de dibujarlo, lo registra con `documentoRegistrar`: el pie lleva el código que devuelve la base, y el sello, su estado y su veredicto. La portada lleva los logos ampliados aprobados, con o sin conexión. En la demostración, el contenido no cambia.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia | Qué no cambia |
|---|---|---|
| `sirius-cx-informe.js` (nuevo) | La lectura C2-8 de las respuestas (antes `cxResp` y `cxSpecInforme` del Back-office), más las grillas | — |
| `SIRIUS Back-office.dc.html` | `cxResp` y `cxSpecInforme` usan el módulo; Informe muestra las grillas de las respuestas; con varios vehículos, el casco y los extras de la solicitud son los del vehículo elegido; `svVehiculos` con la conexión; `SiriusFotosCx.lista(caso, rid)`; `documentoRegistrar` en la conexión simulada; 3 escenas | El resto de la pantalla |
| `sirius-salida-veh.js` | `contextoDe` (el armado de siempre), `contextoCx` y `disponibilidadCx` | `contexto()` de la demostración, `resultado`, `disponibilidad`, archivos |
| `sirius-documentos-pdf.js` | Registro y código en `documentoVector`; inspector, fotos y trazabilidad de la base; respaldo de la foto sin los datos que faltan (solo con la conexión) | `documento()` de la demostración y las reglas de cada sección |
| `sirius-pdf-vector.js` | Zonas de logos de la portada | El resto del diseño y del motor de P-1c1 |
| `SalidaVeh.dc.html` | Vehículos de la base, mensaje de la base sin PDF (también en el .zip), logo de prueba de la agencia en su escena | La vista previa y la selección |
| `datos-cx-pdfveh.js` (nuevo), `assets/prueba-pdf/`, `datos-escenas.js` | Escenas pdfvehcx, pdfvehcxerror y pdfvehagencia, con fotos y logo de prueba | — |
| `datos-documentos-pdf.js`, `sirius-pdf.js`, Ramos Generales, `DocumentoPdf.dc.html`, `sirius-conexion.js` | Sin cambio | `sirius-conexion.js` sigue en 70 bytes; no sube ninguna versión |

**Qué cambió**

- **Contexto con la conexión (`SiriusSalidaVeh.contextoCx(caso, ref)`):** usa la misma forma de siempre (val, meta, neu, ext, ave, vex, res, fotos, caso) y después sigue el camino de `contexto()`.
  - Valores y grillas: de `SiriusCxInforme`, la misma lectura de Informe. Los números llegan como texto y se toman como número.
  - Datos de la inspección: de la visita (modalidad, llegada o inicio, lugar, inspector y su agencia) y de las respuestas.
  - Resultado: el estado y el veredicto de `riesgo_estado`. Quién calificó y cuándo, de la última calificación final del vehículo (una derivación no cuenta). Si el inspector determinó dentro de su facultad, «Determinado por el inspector». Regla y emisión solo si existen.
  - Trazabilidad: de `eventos[caso]` (solicitud recibida, visita iniciada, informe enviado, calificación), con fecha y hora.
  - Firmas: atendió (respuestas), inspeccionó (visita) y calificó (calificación).
  - Fotos: las de la pestaña Evidencias de ese vehículo, con su número y su respaldo, desde la URL firmada; la que no carga queda «Foto no disponible». Un dato que falta en el respaldo no se imprime.
- **Lectura común:** la pestaña Informe lee desde `sirius-cx-informe.js`. Ahora también muestra las grillas que llegan en las respuestas (neumáticos, extras, averías y verificaciones externas).
- **Registro:**
  - Antes de dibujar, se llama a `documentoRegistrar({ caso, riesgo, documento: 'veh-informe' | 'veh-resumen', version, huella })`, con la huella SHA-256 (`crypto.subtle`) de la portada, la identificación y los bloques.
  - El pie lleva «mostrar», con la fecha y el usuario del registro; la fecha de la portada es la del registro.
  - El sello y la tarjeta del resultado usan el estado y el veredicto que devuelve la base.
  - Si la base responde { ok: false }, no se genera el PDF y se muestra su mensaje.
- **Salida con la conexión:** se listan todos los vehículos del caso. El informe se descarga cuando el vehículo tiene informe (antes del resultado sale en borrador); el resumen, cuando además tiene veredicto.
- **Portada:**
  - «Caso N · vehículo i de n» cuando hay varios vehículos (también en la demostración).
  - Logos ampliados: la franja de logos empieza a 8 mm.
  - Zona izquierda, desde x = 14 mm: logo hasta 62 × 28 mm, y «by aseguradora del sur» en 9,5 pt alineado al final del texto del logo (nunca antes del margen). Termina a 41 mm.
  - Zona derecha, alineada a x = 196 mm: logo hasta 62 × 16 mm, nombre en 11,5 pt negrita, proceso y «Ciudad, fecha» en 9 pt. Termina a 41 mm.
  - Agencia: a la izquierda del logo de la derecha, a 12 mm de alto, con una línea fina, sin entrar en la zona izquierda. Sin logo, su nombre en 9 pt.

**Prueba cruzada (pdfvehcx, PRA7781 · 50091-V1)**

| Dato (Informe › Formulario) | Valor en Informe | En el PDF |
|---|---|---|
| Fecha y hora de inspección | 18/11/2026 · 10:04 | Igual (Datos de la inspección) |
| Modalidad · Sucursal · Inspector | Presencial · Quito · Mauricio Endara | Igual (con «Eurosurvey») |
| Persona que atiende · Relación | Gabriela Montúfar · Empleado | Igual («Gabriela Montúfar · empleado») |
| Placa · Marca · Modelo · Año | PRA7781 · Toyota · Hilux · 2023 | Igual |
| VIN · Motor · Carrocería · Color | 8AJHA3CD5P2604417 · 2GD-4417203 · Camioneta · Gris | Igual |
| CAMV o CPN · Nombre en la matrícula · GAD · Vigencia | CAMV-2023-778120 · Transportes del Pacífico S.A. · Quito · 30/04/2027 | Igual |
| Uso · Ciudad · Año de compra · Kilometraje | Comercial · Quito · 2023 · 18450 | Igual (18.450 km) |
| Conductor: nombre · edad · licencia · caducidad | Wilson Cando · 41 · E · 15/02/2029 | Igual |
| Verificación (chasis, sticker VIN, plaqueta) | Verificado ×3 | «Chasis, sticker VIN y plaqueta verificados.» |
| Accesorios (radio, aros, airbags, vidrios, aire, cámara) | Fijo · Aluminio · 6 · Sí · Sí · Sí | Igual («Tiene: radio fijo, aros de aluminio…, 6 airbags») |
| Testigos (check engine, ABS, airbag, frenos) | Apagado ×4 | «Todos apagados (4 revisados).» |
| Neumáticos | Bridgestone 265/65 R17, 6,4 a 7,1 mm, repuesto 8,0 | Igual |
| Extras | Barra antivuelco (Toyota, 1.200) · Cubre balde (Roll-N-Lock, 600) | Igual (total USD 1.800,00) |
| Verificaciones externas | Fiscalía por placa, ANT, SRI: Sin novedad | Igual (las demás con «—») |
| Valores: casco · extras · sugerido | USD 36.500,00 · USD 1.800,00 · USD 35.200,00 | Igual |
| Fotos (Evidencias del vehículo) | 7: F-1 Frontal … F-6 Matrícula frontal, F-7 Kilometraje | Las mismas 7 con sus números (F-6 en Documentos) |
| Estado (Riesgos) y calificación | Inspeccionado · Asegurable · Todo riesgo · Daniela Ruiz 19/11 09:40 | Sello «INSPECCIONADO · ASEGURABLE»; «Calificado por Daniela Ruiz el 19/11/2026 · 09:40» |
| Historial | Solicitud recibida 17/11 09:10 · Visita iniciada 18/11 10:04 · Informe enviado 18/11 11:05 · Calificación 19/11 09:40 | Trazabilidad con las mismas fechas y horas |

No van en el PDF, por diseño de sus secciones como en la demostración: la fecha de carga y el «Otra persona» del conductor habitual. La identificación del propietario va como RUC del asegurado.

Además, la prueba de contenido de P-1c1 (PDF frente a la vista previa HTML) da 0 diferencias para 50091-V1.

**Prueba visual de la portada (frente a la imagen aprobada)**

| Bloque | Zona | Medido |
|---|---|---|
| Logo izquierdo (SIRIUS) | x 14–76, y 8–36 (hasta 41 con el texto) | x 14–63,6 · y 8–36 (49,6 × 28 mm); «by aseguradora del sur» x 28,3–62,4, hasta y 41 |
| Logo derecho (aseguradora) | x 134–196, y 8–24 | x 157,5–196 · y 8–24 (38,5 × 16 mm) |
| Nombre, proceso y fecha | a la derecha, hasta y 41 | x 135,8–196, terminan a 39,2 mm |
| Logo de prueba más ancho (1200 × 100 y 1300 × 90) | Ancho máximo | Izquierda 62 × 5,2 mm; derecha 62 × 4,3 mm; proporción 12 y 14,5, igual que la imagen |
| Logo de prueba más alto (100 × 420 y 120 × 500) | Alto máximo | Izquierda 6,7 × 28 mm; derecha 3,8 × 16 mm; proporción 0,24 |
| Con agencia (Eurosurvey, pdfvehagencia) | En la misma fila, sin encimarse | Agencia x 111,5–151,5 · línea x 154,5 · aseguradora x 157,5–196 |

Los tres logos quedan sin encimarse y sin deformarse.

**Verificado**

- **Sintaxis:** `node --check` de los .js y el verificador de los .dc.html, sin errores. Escenas: 820.
- **pdfvehcx:**
  - «Descargar PDF» genera el PDF de PRA7781 (5 páginas, 287 KB con 7 fotos) con el código IV-50091-V1-6F38598E, registrado en la base simulada.
  - PRA7782 sale en borrador (sello ámbar «POR COMPLETAR», marca de agua, «vehículo 2 de 2»).
  - El resumen sale con «RV-50091-V1-…».
- **pdfvehcxerror:** muestra «La base no registró el documento…» y no hay descarga.
- **Prueba interna (copia aparte con una conexión activa temporal):**
  - Con { ok: true, mostrar: 'IV-50052-V1-1B8F2C13' }, el pie lleva ese código.
  - Con { ok: false }, no hay PDF y llega el mensaje.
  - La base recibió { caso, riesgo, documento, version, huella }.
  - En el proyecto, `sirius-conexion.js` sigue en 70 bytes.
- **Regresión:**
  - pdfvehvector, pdfvehresumen, pdfvehborrador y pdfvehasegurable: el mismo texto y las mismas páginas que en P-1c1; solo cambian los logos de la portada.
  - Informe con la conexión simulada: cxr0bcompletar, cxr0cauto, cxr0cvacio, cxr0dcalidad, calpdfcx y cxlimpio, iguales.
  - En cxr0b y cxriesgosestados aparece la barra «Informe en PDF», porque ahora los vehículos de la base se pueden descargar.
- **Pantalla:** a 1280×720 y 1920×1080.

**No verificado**

- La base real: forma real de `documentoRegistrar` y de `riesgo_estado`, y las URL firmadas reales (con su vencimiento y CORS).
- Un caso de un solo vehículo de la base sin `riesgos[]` (calpdfcx sigue con el camino anterior).
- Firefox y Safari.

**Diferencias**

- **Informe:** ahora muestra las grillas que llegan en las respuestas (antes quedaban vacías con la conexión).
- **Extras con la conexión:** salen de las respuestas, como en Informe; los de la solicitud no se repiten.
- **Trazabilidad:** la sección del modelo no tiene «Informe completado». El evento se lee, pero agregarlo pide cambiar `datos-documentos-pdf.js` (subir su versión, DEC-262).
- **Código en borrador:** con la conexión, un borrador lleva el código que devuelve la base (en la demostración, «…-BORRADOR»).
- **Escena de la agencia:** el logo de Eurosurvey es una imagen de prueba que pone la escena; ninguna agencia lo tiene en los datos.
- **Fotos de la escena:** las fotos de 50091 son imágenes de prueba del proyecto (`assets/prueba-pdf`).

**Escenas**

Nuevas (área «Salida PDF»):

- `pdfvehcx`: 50091, con dos vehículos; V1 calificado Asegurable con fotos y V2 por completar.
- `pdfvehcxerror`: `documentoRegistrar` responde { ok: false }.
- `pdfvehagencia`: 30003-V1 de Eurosurvey con logo.

Registro: `project/registro-envios.md`. Inventario:

- Filas nuevas de `sirius-cx-informe.js`, `datos-cx-pdfveh.js` y `assets/prueba-pdf/`.
- Filas actualizadas de los archivos cambiados.
- Sección «PDF de Vehículos con los datos de la base (etapa P-1c2 · DEC-272)».

Tiempo de la etapa: inicio 22/11/2026 10:30 · fin 22/11/2026 10:56 · 26 min

---

## 18/10/2026 · 20:30 — Etapa P-1c1

Publiqué la versión 377 de SIRIUS (los archivos subieron en la 376; esta versión cierra el registro con el tiempo de la etapa). El informe y el resumen de Vehículos se descargan ahora con un motor vectorial (jsPDF con Helvetica) y el diseño aprobado de la maqueta (DEC-272). El texto se puede buscar y copiar, y el informe completo de 20196-V1 pesa 210 KB en 8 páginas. El contenido es el mismo: `documentoVector` lee los bloques que arma `documento()` (las mismas secciones, el mismo orden, las mismas reglas, números y frases) y los dibuja con las piezas nuevas.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia | Qué no cambia |
|---|---|---|
| `sirius-pdf-vector.js` (nuevo) | Primitivas de dibujo con jsPDF, lectura de los bloques, imágenes, paginación por flujo, marca de agua y pie | — |
| `sirius-documentos-pdf.js` | `documentoVector(id, ctx, opts)` y `estadoVeh` (se agregan a `SiriusDocumentosPdf`) | `documento()`, `preparar()` y todos los renderizadores de sección: la vista previa HTML da los mismos bloques, byte a byte |
| `SalidaVeh.dc.html` | En Vehículos, «Descargar PDF» y «Descargar .zip» usan `documentoVector`; la nota de la descarga; las 4 escenas | La vista previa paginada, la selección de vehículos y documentos, Equipo y maquinaria (sigue con la captura) |
| `SIRIUS Back-office.dc.html` | Carga `sirius-pdf-vector.js` y registra las 4 escenas | Todo lo demás |
| `datos-escenas.js` | 4 escenas en el área «Salida PDF» (817) | — |
| `datos-documentos-pdf.js`, `sirius-pdf.js` (liquidación y captura), `CalificacionRG.dc.html`, `DocumentoPdf.dc.html`, `sirius-salida-veh.js`, `sirius-conexion.js` | Sin cambio | `sirius-conexion.js` sigue en 70 bytes; no sube ninguna versión |

Lugares donde se descarga hoy el PDF de Vehículos: la Salida de Vehículos (pestañas Informe y Calificación del caso): «Descargar PDF» en la vista previa y «Descargar .zip» con «Todos los vehículos».

**Qué cambió**

- **Motor:** jsPDF 2.5.1 vectorial, como la liquidación. Usa Helvetica, y Courier para VIN y motor. Las fotos y el diagrama de averías van como imagen; el diagrama es el SVG de siempre, rasterizado al doble de resolución.
- **Portada:**
  - Franja clara con el círculo blanco.
  - Logos: SIRIUS con «by aseguradora del sur» a la izquierda. A la derecha, la aseguradora con «ASEGURADORA DEL SUR C.A.», «Proceso de Inspecciones · Nuevo Riesgo», ciudad y fecha. Si inspeccionó una agencia, su logo va debajo (o su nombre, si no subió logo).
  - «INFORME DE INSPECCIÓN VEHICULAR» (o «RESUMEN…»), la placa en grande, «Caso 20196 · vehículo 1 de 3» y el vehículo en una línea.
  - Sello «SIRIUS · v1» con el estado del vehículo (DEC-271) y su veredicto: verde Asegurable, rojo No asegurable, ámbar sin resultado («POR COMPLETAR», «EN CALIFICACIÓN»).
  - Fila de 4 tarjetas: vehículo, kilometraje, valor asegurado y la tarjeta oscura del resultado.
  - Tarjeta de identificación (placa, VIN, motor) con las 2 fotos referenciales.
  - Recuadro del resultado con el texto de la sección Resultado.
- **Cuerpo:**
  - Capítulos numerados con línea fina.
  - Tablas con cabecera oscura (se repite si la tabla sigue en otra página) y la fila de total en celeste.
  - Datos en 3 columnas; frases con sus colores; hallazgos con su chip; observaciones en un recuadro.
  - Trazabilidad en línea de tiempo.
  - Firmas en recuadros: atendió, inspeccionó y, si hay calificación, calificó con borde verde.
  - Registro fotográfico y documentos en 3 por fila, con número y respaldo.
- **Pie en cada página:** «Documento generado por SIRIUS · Aseguradora del Sur C.A. · Código de verificación IV-20196-V1-NTCDSF4M · Generado el 18/10/2026 · 20:30 por Verónica Lema» y «Página N de M». En la demostración, el código es el de siempre (`codigo()`) sin el guion; en borrador, «IV-20196-V1-BORRADOR».
- **Marca de agua:** «BORRADOR» mientras el vehículo no esté Inspeccionado.
- **Paginación por flujo:**
  - No se parte una fila de tabla, una foto con su respaldo ni una firma.
  - Una tabla de hasta 70 mm va entera.
  - Un capítulo o subgrupo no queda solo al pie de una página.
  - Un salto de página del modelo se respeta si la página ya tiene más de la mitad ocupada.
- **Fotos:** cada imagen se recorta al recuadro y se reduce (lado mayor 1400 px, JPEG 0,82). Si no carga, va «Foto no disponible» con su número y su respaldo, sin cortar el documento. En la demostración van los marcadores de siempre («Foto de ejemplo · …»).
- **Logos:** la disposición aprobada es la de por defecto. Si el documento cambió los logos en Documento PDF › Estilo y logos, se usan los elegidos: el izquierdo a la izquierda, el derecho a la derecha y la agencia debajo.
- **Resumen (veh-resumen):** el mismo diseño, con la portada (franja, sello y tarjetas) y sus secciones.

**Prueba de contenido (20196-V1, informe): textos que dibuja `documentoVector` frente a la vista previa HTML, sección por sección**

| Sección | Textos en la vista previa | Textos en el PDF | Resultado |
|---|---|---|---|
| Tarjeta (portada) | 17 | 12 + diseño | Diseño nuevo: todos los valores presentes (placa, ECUADOR, vehículo, color, uso, kilometraje, km/año, VIN, motor, fotos F-1 y F-2) |
| Resultado | 6 | 3 | Igual |
| 1 Hallazgos relevantes | 8 | 8 | Igual |
| 2 Valores | 17 | 17 | Igual |
| 3 Datos de la inspección | 18 | 18 | Igual |
| 4 Asegurado y propiedad + 5 Conductor habitual | 22 | 22 | Igual |
| 6 Estado del vehículo (Identificación, Equipamiento, Neumáticos, Testigos) | 11 | 10 | Igual |
| 7 Extras | 13 | 13 | Igual |
| 8 Averías (leyenda y tabla) | 27 | 27 | Igual |
| 9 Verificaciones externas | 23 | 23 | Igual |
| 10 Observaciones del inspector | 3 | 3 | Igual |
| 11 Trazabilidad | 10 | 10 | Igual |
| Firmas | 4 | 4 | Igual |
| 12 Registro fotográfico | 124 | 124 | Igual |
| 13 Documentos | 23 | 23 | Igual |

Diferencias de contenido: 0. La comparación no tiene en cuenta los espacios, las mayúsculas, los dos puntos de las etiquetas ni «−»/«–»; los recuentos difieren donde una frase va en un solo trazo.

Textos propios del diseño nuevo:

- **Portada:** «by aseguradora del sur», «ASEGURADORA DEL SUR C.A.», «Proceso de Inspecciones · Nuevo Riesgo», «Quito, 18/10/2026», título, placa, caso, línea del vehículo, sello (SIRIUS · v1, INSPECCIONADO, NO ASEGURABLE) y las 4 tarjetas.
- **Fotos de la identificación:** «F-1 · Frontal», «F-2 · Posterior».
- **Firmas:** ATENDIÓ, INSPECCIONÓ, CALIFICÓ, «Registrado en SIRIUS» y el recuadro de quien calificó: Verónica Lema · Ejecutivo de inspecciones · Calificado en SIRIUS el 16/10/26 · 12:40.
- **Pie y marca de agua.**

La misma prueba con el resumen de 20196-V1, el informe de 20196-V2, el de 20196-V3 (sin placa) y el borrador de 20196-V1 también da 0 diferencias.

**Prueba visual (pdfvehvector frente a la maqueta, página por página)**

| Página | Maqueta | PDF generado |
|---|---|---|
| 1 | Portada, resultado, 1 Hallazgos | Igual, más 2 Valores (cabe en la página) |
| 2 | 2 Valores a 7 Extras | 3 Datos de la inspección a 7 Extras |
| 3 | 8 Averías a 11 Trazabilidad y firmas | Igual |
| 4 | 12 Registro fotográfico: Exteriores F-1 a F-7 y Motor F-8 | Igual |
| 5 | Identificación F-9 a F-13 e Interiores F-21 a F-26 | Igual |
| 6 | F-27 a F-34 y Airbags F-35, F-36 | Igual |
| 7 | Llantas F-37 a F-41, Extras F-42, F-43 y Daños F-44, F-45 | Igual |
| 8 | 13 Documentos F-14 a F-20 | Igual |

`pdftotext` extrae todo el texto (placa, valores, frases, pie), y `pdffonts` muestra Helvetica y Courier (WinAnsi).

**Verificado**

- **Sintaxis:** `node --check` de los .js y el verificador de los .dc.html, sin errores.
- **Tamaño:** informe completo de 20196-V1, 210 KB (por debajo de 2 MB); resumen 82 KB; informe de 20196-V2 64 KB.
- **Descarga desde la pantalla:**
  - pdfvehvector, pdfvehresumen, pdfvehborrador y pdfvehasegurable: «Descargar PDF» guarda el PDF hecho con jsPDF («Descargado: … · 8 páginas»).
  - svflota: el .zip trae 6 PDF vectoriales (3 informes y 3 resúmenes).
- **Borrador (pdfvehborrador):** sello ámbar «POR COMPLETAR», tarjeta «Por completar · Esperando el informe», marca de agua BORRADOR, código IV-20196-V1-BORRADOR y la vista previa con «Pendiente de calificación».
- **Asegurable (pdfvehasegurable, 20196-V2):** sello verde «INSPECCIONADO · ASEGURABLE» y tarjeta «Asegurable · Pérdida total».
- **Fotos:** una imagen que carga se recorta y se reduce a JPEG; una que no carga queda como «Foto no disponible» con su número y su respaldo, sin cortar el documento.
- **Regresión (antes y después, IGUAL):** calrg, calrgsalida, calrgemision, salrgtecnico, salrganexo (Ramos Generales), liqpdf (liquidación) y dpdocs (diseñador). Los bloques de `documento()` de 20196-V1 son idénticos byte a byte (vista previa HTML). En dp1veh, dp1aps y svflota solo cambia la nota de la descarga.
- **Pantalla:** el panel de la Salida y la vista previa a 1280×720 y 1920×1080.
- **Archivos sin cambio:** `sirius-conexion.js` sigue en 70 bytes; `datos-documentos-pdf.js` no cambió.

**No verificado**

- Fotos reales de la base (con la conexión); probé la carga y el «Foto no disponible» con imágenes del proyecto.
- El logo de una agencia en la portada: ningún vehículo de ejemplo lo tiene; el camino sin logo muestra «Inspección: <agencia>».
- Un documento con los logos cambiados en Estilo y logos.
- Firefox y Safari, y la impresión en papel.

**Diferencias**

- **Página 1:** «2 Valores» cabe en la página 1 (en la maqueta empieza la página 2). Desde la página 3, las páginas coinciden con la maqueta.
- **Resultado:** el recuadro usa el texto de la sección Resultado. La maqueta separaba la regla en otra línea con su detalle; aquí va como en la vista previa.
- **Saltos de página:** el salto después de «Datos de la inspección» no se aplica porque la página no está a la mitad.
- **Fotos de la demostración:** los marcadores dicen «Foto de ejemplo · …», como en la vista previa (la maqueta solo el nombre).
- **Diagrama:** debajo va la leyenda «Alta / Media / Baja · Cada número es una avería…» de la vista previa.
- **Firmas:** se agrega el recuadro de quien calificó (Verónica Lema), que la vista previa no tiene, y la línea «Registrado en SIRIUS». El rol va como «Ejecutivo de inspecciones», sin el nivel.
- **Signo menos:** «−» se imprime como «–», porque Helvetica estándar no trae U+2212.
- **Resumen:** ocupa 2 páginas (la portada nueva es más alta). La vista previa lo marcaba en una página.
- **Vehículo sin placa:** la portada muestra «Sin placa» en grande.
- **Notas de la pantalla:** dicen «la descarga tiene el mismo contenido que la vista previa, con el diseño del PDF».
- **Equipo y maquinaria:** sigue con la captura.

**Escenas**

Nuevas (área «Salida PDF»):

- `pdfvehvector`: informe de 20196-V1.
- `pdfvehresumen`: resumen de 20196-V1.
- `pdfvehborrador`: 20196-V1 con el informe por completar; sello ámbar y BORRADOR.
- `pdfvehasegurable`: 20196-V2 Asegurable; sello verde.

En cada una, «Descargar PDF» genera el PDF vectorial.

Registro: `project/registro-envios.md`. Inventario: filas de `sirius-pdf-vector.js` (nueva), `sirius-documentos-pdf.js`, `SalidaVeh.dc.html`, `SIRIUS Back-office.dc.html` y `datos-escenas.js`, y la sección «PDF de Vehículos con motor vectorial (etapa P-1c1 · DEC-272)».

Tiempo de la etapa: inicio 21/11/2026 23:37 · fin 22/11/2026 00:05 · 28 min

---

## 18/10/2026 · 20:30 — Etapa AV-3

Publiqué la versión 375 de SIRIUS (los archivos subieron en la 374; esta versión cierra el registro con el tiempo de la etapa). Los datos de demostración siguen ahora el estado por fases de cada vehículo (DEC-271): un vehículo con la visita realizada y su informe en Datos de campo dice «Informe por completar», «Inspeccionado» queda solo para quien ya tiene su resultado, y «N de M inspeccionados» pasó a «N de M con informe». Solo cambiaron datos de escenas.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia | Qué no cambia |
|---|---|---|
| `datos-cx-fases.js` | Estados e informes de PRB1212 y PR121A en cxriesgosestados, r0noinsp, r0nomio, r0evidencias, cxr0 y cxr0d/e (infcal); la acción simulada `completarInforme` deja «Pendiente calificación» | Las visitas, los inspectores y las demás escenas |
| `datos-cx-colacal.js` | Caso 50051: estados de sus tres vehículos y el subestado «2 de 3 con informe» | Los informes y las calificaciones de la cola |
| `SIRIUS Back-office.dc.html` | Solo los datos de las escenas riesgosestados y r0informes (`riesgoOv`) | Todo el código de la pantalla |
| `datos-escenas.js` | Texto de dos descripciones | Las 813 escenas |
| Archivos vigilados, `sirius-conexion.js` | Sin cambio | `sirius-conexion.js` sigue en 70 bytes; no sube ninguna versión |

**Qué cambió**

- **Con la visita realizada y el informe en Datos de campo:** r0noinsp, r0nomio, r0evidencias y cxr0 ahora le dan a PRB1212 y PR121A su informe en Datos de campo y el estado «Informe por completar» (en pantalla, «Por completar»). Antes figuraban «Inspeccionado» sin informe, y el Informe decía «Ningún vehículo tiene informe todavía».
- **Con el informe completo y determinado por el inspector:** cxriesgosestados (PRB1212 y PR121A) queda «Inspeccionado», ahora con su informe completo y «Determinado por el inspector · Dentro de su facultad».
- **Completo y enviado a calificación:** en cxr0dcalificar, cxr0emodulo, cxr0ebandeja y cxr0eresumen, PR121A pasa de «Inspeccionado» a «Pendiente calificación» (en pantalla, «En calificación»), como dice «1 por calificar».
- **colacalconsistente, caso 50051:** PBA5101 (informe enviado a calificación) «Pendiente calificación», PBA5102 (determinado por el inspector) «Inspeccionado», PBA5103 «Por coordinar»; el subestado dice «2 de 3 con informe».
- **Sin conexión (riesgosestados y r0informes):** los dos vehículos con informe quedan «Inspeccionado» con Asegurable determinado por el inspector.
- **Simulación de la base:** al completar un informe y enviarlo a calificación, el vehículo queda «Pendiente calificación» (antes «En calificación», un alias).
- **«No asegurable» como estado:** no hay ninguno. Solo aparece como veredicto (`aseg`, `criterioInspector`, `veredicto`).

**Prueba cruzada (estado de cada vehículo contra su Informe y su Calificación; el caso)**

| Escena | Vehículos (estado · Informe) | Caso |
|---|---|---|
| cxriesgosestados | PRB1212 y PR121A Inspeccionado · informe Enviado, determinado por el inspector; PRB1213 En curso · sin informe | En curso (el más atrasado) |
| r0noinsp, r0nomio, r0evidencias | PRB1212 y PR121A Por completar · informe Por completar; PRB1213 Por coordinar o En curso · sin informe | En coordinación (r0noinsp, r0nomio) o En curso (r0evidencias), como antes |
| cxr0ebandeja | PRB1212 Por completar · PR121A En calificación (informe Enviado, «por calificar») · PRB1213 Por coordinar | En coordinación · «1 por calificar» |
| colacal 50051 | PBA5101 En calificación (Enviado) · PBA5102 Inspeccionado (Enviado, determinado) · PBA5103 Por coordinar (sin informe) | En coordinación · «2 de 3 con informe» |
| r0informes | PBA4521 y GSE1098 Inspeccionado · informe Enviado, Asegurable; Kia Sportage Por completar | Agendado, como antes |

**Verificado**

- **Sintaxis:** `node --check` de los .js y el verificador del .dc.html, sin errores. Escenas: 813.
- **Búsqueda en todo el proyecto:** «inspeccionados» solo queda en «Inspeccionados sin orden» (Inicio, casos Inspeccionado sin orden de emisión) y en un texto del Monitor sobre casos; no hay «No asegurable» como estado.
- **Regresión (antes y después, IGUAL):** riesgos, bandejaexp, coordagrupar, cxestadoparcial, cxestadofases, estadofasecurso, estadofaseinspeccion, r0sininsp, cxr0b (también en Calificación), cxr0bcompletar, cxr0cauto, cxr0cvacio, cxr0dcalidad, cxr0emodulo, calveh, calcola y colacalconsistente (bandeja, Calificación, Inicio, `?frol=admin` y `?frol=sus`: 4 casos · 6 informes · 2 vencidos).
- **Cambian, a propósito:** los estados de los vehículos en las escenas de la prueba cruzada, con el mismo estado del caso que antes.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**

- La conexión real: el estado por fases que entrega la base en `riesgos[].riesgo_estado` (usé datos simulados).
- La acción «Completar y enviar» sobre estos informes con el nuevo estado (cambié la simulación, no la probé en pantalla).
- Las escenas de un caso con un solo vehículo, ni las de calificación con vehículos ya calificados (no las toqué).
- Firefox y Safari.

**Diferencias**

- **Código por corregir (no tocado):** `recalc` del Back-office pone el caso en «Pendiente calificación» si algún vehículo lo está, aunque otro siga «En curso» o «Informe por completar», y deja «Agendado» con un vehículo «Informe por completar» (r0informes). DEC-239 pide el más atrasado. Por eso riesgosestados, r0informes y cxriesgosestados quedan con «Inspeccionado» con resultado y no con «Pendiente calificación», y su caso sigue como antes.
- En riesgosestados y r0informes, la Calificación ahora dice «2 de 3 vehículos calificados · 2 asegurables» (antes «0 de 3 · Por calificar»), porque el resultado del inspector es Asegurable.
- En riesgosestados, el Informe de Kia Sportage (En curso) sigue diciendo «Enviado»: viene del informe de ejemplo del caso 20196, igual que antes.
- «N de M agendados» del caso en Coordinación sigue contando los vehículos ya coordinados, aunque ya tengan informe (lo calcula `SiriusCoordEstado`, no los datos).
- Los vehículos 50044 (garantías) y 50086 (inspectores) siguen «Inspeccionado» sin informe: son casos de otras pantallas, sin informe en su escena.
- La leyenda del PDF de calificación aún dice «No asegurable» como franja de estado (código, no datos).

**Escenas**

Sin escenas nuevas; cambian los datos de cxriesgosestados, r0noinsp, r0nomio, r0evidencias, cxr0, cxr0dcalificar, cxr0emodulo, cxr0ebandeja, cxr0eresumen, colacalconsistente, riesgosestados y r0informes.

Registro: `project/registro-envios.md`. Inventario: filas de `datos-cx-fases.js`, `datos-cx-colacal.js`, `SIRIUS Back-office.dc.html` y `datos-escenas.js`, y la sección «Estado por fases de cada vehículo en los datos de demostración (etapa AV-3 · DEC-271)».

Tiempo de la etapa: inicio 21/11/2026 22:38 · fin 21/11/2026 22:56 · 18 min

---

## 18/10/2026 · 20:30 — Etapa AV-2

Publiqué la versión 373 de SIRIUS (los archivos subieron en la 372; esta versión cierra el registro con el tiempo de la etapa). Con «Agrupar por: Riesgo», la carta de un vehículo ya enviado dice «Enviado por el cliente · N de N fotos», con tono de éxito, igual que el «✓ Enviado» de la app del cliente. En «Agrupar por: Visita», la fila «Por vehículo» lo muestra como «PAU6044 5 de 5 · enviado». Sin `enviado`, nada cambia.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia | Qué no cambia |
|---|---|---|
| `Coordinacion.dc.html` | `cartaDe`: `porRiesgo[ref]` usa `x.enviado` para el texto y trae su `tone`; la fila «Por vehículo» agrega «· enviado» | Estado de la visita, acciones, enlace, último avance |
| `sirius-coordcartas.js` | La carta bajo un vehículo usa el `tone` de `porRiesgo` (también la visita vigente de la historia) | Pilas, botones, historia |
| `datos-cx-coordinacion.js` | Escena `cxautoavance`: el primer vehículo pasa a `enviado = true`, 5 de 5 (total de la visita 7 de 21) | Los demás casos |
| Archivos vigilados, `sirius-conexion.js` | Sin cambio | `sirius-conexion.js` sigue en 70 bytes; no sube ninguna versión |

**Qué cambió**

- El texto del estado de un vehículo enviado es «Enviado por el cliente · N de N fotos»; el de los demás sigue igual.
- `porRiesgo` lleva su propio tono (`success` si está enviado) y la carta lo usa en lugar del de la visita.
- La fila «Por vehículo» agrega « · enviado» solo al vehículo enviado.
- En la escena, el total de la visita pasó de 33 a 21 para que sume con los dos vehículos (5 + 16).

**Prueba cruzada (cxautoavance)**

| Vista | PAU6044 (enviado) | AU044M |
|---|---|---|
| Riesgo | Enviado por el cliente · 5 de 5 fotos (verde) | En curso por el cliente · 2 de 16 fotos (ámbar), igual que antes |
| Visita | Por vehículo: PAU6044 5 de 5 · enviado · AU044M 2 de 16; total 7 de 21 fotos | — |

Las acciones de ambas cartas son las mismas de antes (Copiar enlace, Reenviar enlace, Cancelar visita…), y el último avance de cada una no cambió.

**Verificado**

- **Sintaxis:** `node --check` y el verificador de los .dc.html, sin errores.
- **Regresión (antes y después, IGUAL):** coordcartas, coordcartascx, coordcartashist y coordcartasvisita.
- **Pantalla:** capturas por riesgo y por visita a 1280×720 y 1920×1080, sin texto cortado.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**

- La conexión real con `enviado` de la base: usé datos simulados.
- Un vehículo enviado en la historia (vigente): la escena tiene una sola visita.
- Firefox y Safari.

**Diferencias**

- Una visita con todos los vehículos enviados sigue con el estado de la visita (la define la base, no esta etapa).
- El total de la escena cambió de 33 a 21 fotos.

**Escenas**

Sin escenas nuevas; `cxautoavance` cambió (primer vehículo enviado).

Registro: `project/registro-envios.md`. Inventario: filas de `Coordinacion.dc.html`, `sirius-coordcartas.js` y `datos-cx-coordinacion.js`, y la línea AV-2 en la sección de AV-1.

Tiempo de la etapa: inicio 21/11/2026 22:03 · fin 21/11/2026 22:06 · 3 min

---

## 18/10/2026 · 20:30 — Etapa AV-1

Publiqué la versión 371 de SIRIUS (los archivos subieron en la 370; esta versión cierra el registro con el tiempo de la etapa). Las cartas de Coordinación ya muestran el avance de la autoinspección por vehículo. Bajo un vehículo («Agrupar por: Riesgo») la carta muestra el estado con las fotos de ese vehículo («N de M fotos») y su «Último avance» («Hoy 09:15 · Posterior»). Con «Agrupar por: Visita» muestra el total de la visita y, si hay más de un vehículo, la fila «Por vehículo» («PAU6044 5 de 17 · AU044M 2 de 16»). El «Último avance» usa el nombre del paso, nunca su código. Sin `avance.vehiculos`, todo queda como antes.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia | Qué no cambia |
|---|---|---|
| `SIRIUS Back-office.dc.html` | Un solo constructor del avance (`cxAvanceTxt`, el texto «Hoy 12:40 · paso») y `avance.vehiculos` con `{ ref, fotos, total, enviado, texto }`; la escena nueva en `KNOWN_ESC`, en las escenas simuladas y en `cartasIni` | Los datos que entrega la conexión, los permisos y el resto de las visitas |
| `Coordinacion.dc.html` | `cartaDe`: `porRiesgo[ref]` (estado con fotos y último avance) y la fila «Por vehículo» | Las demás filas de la carta, el estado de la visita y el orden |
| `sirius-coordcartas.js` | La pila pasa su `rid` a la carta (visita principal, historia vigente y «otras»); `delRiesgo` elige el avance del vehículo | Las pilas, la historia y los botones |
| `datos-cx-coordinacion.js`, `datos-escenas.js` | Caso 50057 con dos vehículos y la escena `cxautoavance` (813 escenas) | Los demás casos y escenas |
| Archivos vigilados, `sirius-conexion.js`, `sirius-agenda.js` | Sin cambio | `sirius-conexion.js` sigue en 70 bytes; no sube ninguna versión |

**Qué cambió**

- **Una sola regla del texto:** `cxAvanceTxt(ultimo, paso)` da «Hoy 12:40 · Lateral derecho» (o «19/11 16:05 · Frontal»), con el día de Ecuador y `pasoNombre || paso`. Se usa para la visita y para cada vehículo.
- **Por vehículo:** la carta recibe `porRiesgo[ref] = { estadoTxt, ultimo }`. Cuando la visita tiene más de un vehículo, agrega «Por vehículo» con la placa (o la referencia si no hay placa) y «N de M».
- **Carta bajo un vehículo:** el estado dice «estado · N de M fotos» con las fotos de ese vehículo, «Último avance» es el suyo (si no tiene, «—») y no aparece «Por vehículo». Lo mismo en la visita vigente de la historia y en «Otra visita abierta de este riesgo».
- **Carta por visita:** total de la visita («7 de 33 fotos»), el último avance de la visita y «Por vehículo».
- **Antes:** ambos vehículos mostraban «7 de 33 fotos» y el código «exteriores_posterior».

**Prueba cruzada (escena cxautoavance)**

| Vista | PAU6044 | AU044M | Visita |
|---|---|---|---|
| Riesgo | 5 de 17 fotos · 19/11 16:05 · Frontal | 2 de 16 fotos · Hoy 09:15 · Posterior | — |
| Visita | — | — | 7 de 33 fotos · Hoy 09:15 · Posterior · Por vehículo: PAU6044 5 de 17 · AU044M 2 de 16 |

5 + 2 = 7 y 17 + 16 = 33. Ningún vehículo muestra los números del otro, y no sale ningún código de paso. `?fagrupar=visita` da lo mismo que hacer clic en «Visita».

**Verificado**

- **Sintaxis:** `node --check` de los .js y el verificador de los .dc.html, sin errores.
- **Regresión (antes y después, IGUAL):** coordcartas (también `?fhist=1` y `?fhist=1&fsel=V3`), coordcartashist, coordcartasvisita, coordcartascx (también `?fhist=1` y Visita), cxvisclienteagendada, cxvisitaenlace y estadoparcial.
- **Pantalla:** capturas de la carta por riesgo y por visita a 1280×720 y a 1920×1080, sin texto cortado.
- `sirius-conexion.js` sigue en 70 bytes. Total de escenas: 813.

**No verificado**

- La historia (vigente) con `vehiculos`: la escena tiene una sola visita y no hay anteriores.
- La conexión real con `avance.vehiculos` de la base: usé datos simulados.
- Firefox y Safari.

**Diferencias**

- El «Último avance» de un vehículo sin avance muestra «—».
- «Por vehículo» tampoco aparece en el detalle de la historia.
- En la escena, el encabezado del caso dice «Agendado 3/8 · Coordinación 2 de 2 agendados», derivado de los datos simulados (igual que en 50054).
- La fecha del primer vehículo depende del día real («hace 2 días»).

**Escenas**

Nueva: `cxautoavance` (área «Coordinación», conexión simulada): dos vehículos en una visita de autoinspección, 5 de 17 (hace 2 días, «Frontal») y 2 de 16 (hoy, «Posterior»); con `?fagrupar=visita`, «7 de 33 fotos» y «Por vehículo».

Registro: `project/registro-envios.md`. Inventario: filas de `SIRIUS Back-office.dc.html`, `Coordinacion.dc.html`, `sirius-coordcartas.js`, `datos-cx-coordinacion.js` y `datos-escenas.js`, y la sección «Avance de la autoinspección por vehículo en las cartas (etapa AV-1)».

Tiempo de la etapa: inicio 21/11/2026 21:49 · fin 21/11/2026 21:56 · 7 min

---

## 18/10/2026 · 20:30 — Etapa A-1

Publiqué la versión 369 de SIRIUS (los archivos subieron en la 368; esta versión cierra el registro con el tiempo de la etapa). `datos-completar-informe.js` ya no falla cuando los ejemplos están vaciados: sin el caso molde 20202 no siembra nada. Reproduje a la letra el reemplazo de la asesoría.

**Mapa de impacto**

| Archivo | Qué cambia |
|---|---|
| `datos-completar-informe.js` | Una línea por dos, en la siembra de los casos 30004 a 30007 |
| Todo lo demás | Sin cambio: ningún archivo de configuración vigilado (no sube ninguna versión) y `sirius-conexion.js` sigue en 70 bytes |

**Qué cambió**

- La línea `const molde = E.vehiculos.find(v => v.caso === '20202'), evMolde = …` pasó a `const molde = (E.vehiculos || []).find(v => v.caso === '20202'), evMolde = …`.
- Se agregó debajo `if (!molde) return;` con el comentario «21/11 · sin el caso molde (la conexión ya vació los ejemplos, DEC-195): no se siembran ejemplos».
- Sin la conexión no cambia nada: el molde existe y la demostración siembra sus casos como antes.

**Verificado**

- **Sintaxis:** `node --check` sin errores. El diff contra el archivo anterior son exactamente esas dos líneas.
- **Sin molde:** con `SIRIUS_EJEMPLO` sin `vehiculos`, el script termina sin error y no agrega casos (antes: «Cannot read properties of undefined (reading 'informe')»).
- **Escenas** con los casos 30004 a 30007 (infcompletar, ctrllista y calcxcalif), frente a la versión anterior: los 4 casos se siembran, el texto de la pantalla es idéntico y no hay errores.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**

- La conexión real: probé el caso sin molde con datos simulados, no con la base.

**Diferencias**

- Ninguna visible. Solo cambia el comportamiento cuando el molde no existe.

**Escenas**

Sin escenas nuevas.

Registro: `project/registro-envios.md`. Inventario: fila de `datos-completar-informe.js` (sin sección nueva).

Tiempo de la etapa: inicio 21/11/2026 21:12 · fin 21/11/2026 21:14 · 2 min

---

## 18/10/2026 · 20:30 — Etapa AG-1

Publiqué la versión 367 de SIRIUS (los archivos subieron en la 366; esta versión cierra el registro con el tiempo de la etapa). La Agenda tiene ahora un encabezado compacto (DEC-269). Arriba queda una fila de título con ⓘ y «Más». Debajo va una barra de trabajo en una línea que queda fija al desplazar: vista, navegación, rango, buscador de inspector, «Filtros», hora y «Leyenda». Si hay filtros activos, aparece una línea de fichas. La tabla ocupa el resto de la pantalla, con el encabezado de días y la columna «Inspector» fijos. Solo cambió el diseño: con los mismos filtros, la tabla muestra las mismas visitas e inspectores que antes.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué cambia | Qué no cambia |
|---|---|---|
| `Agenda.dc.html` | El encabezado (título, Pedidos y Duración, pestañas, navegación, seis filtros y leyenda), el ancho de la columna «Inspector» (190 → 240 px), el alto de la tabla y el espacio entre bloques (16 → 8 px) | `pasa()`, `filas()`, `rango()`, `mover()`, `pedirMover`/`validar`, el resumen, «Mover», los permisos (`puedeMover`, `gestionaRed`, `soloYo`, `alcanceSuc`) y los datos que recibe |
| `SIRIUS Back-office.dc.html` | Solo se registran las 4 escenas nuevas (`KNOWN_ESC`, rol Coordinador y lista `agendaEscena`) | `agendaDatos` y `agendaCx` (los datos de la Agenda, sin y con la conexión) |
| `datos-escenas.js` | 4 escenas nuevas en el área «Agenda» | — |
| `sirius-agenda.js`, `sirius-red-fuente.js`, reglas de mover, datos y archivos vigilados | Sin cambio | `sirius-conexion.js` sigue en 70 bytes; no sube ninguna versión |

**Qué cambió**

- **Fila de título (≈ 48 px):**
  - «Agenda de inspecciones» (o «Mi agenda») a 24 px, el tamaño de título de sección.
  - El botón ⓘ abre la descripción de siempre y anuncia los atajos.
  - A la derecha, el menú «Más ▾» con «Pedidos de los inspectores» (con su número si tiene pedidos) y «Duración de las visitas», los dos con «(demostración)» cuando hay conexión. Abren lo mismo que antes, y al cerrarlos el foco vuelve a «Más». El menú se maneja con las flechas, Inicio y Fin, y se cierra con Esc.
- **Barra de trabajo (52 px, `position: sticky`):**
  - Selector segmentado Día / Semana / Lista, con el patrón de U-7.
  - Botones ‹ · Hoy · › con `aria-label` «Semana anterior», «Semana siguiente» o «Día anterior», «Día siguiente», y con `aria-keyshortcuts`.
  - El rango de fechas.
  - «Buscar inspector…»: un cuadro con sugerencias que ignora las tildes. Elegir un nombre aplica el mismo filtro que el desplegable de antes, y ✕ lo quita.
  - «Filtros» con el número de filtros activos.
  - A la derecha, la hora en texto pequeño y «Leyenda».
  - Debajo de 1440 px la hora se ve como «Ecuador 19:15»; el texto completo queda en el título del elemento y para el lector de pantalla.
  - Pasa a dos líneas cuando no cabe, sin desplazamiento lateral: con el menú lateral abierto a 1280 px, o con «Filtros 2» a 1280 px.
- **Panel «Filtros»:**
  - Se despliega anclado al botón y no es modal.
  - Muestra Sucursal, Tipo, Modalidad, Confirmación y, solo con la conexión, Ciudad y zona, en una cuadrícula de 3 columnas. Las opciones son las mismas de antes.
  - Se aplica al cambiar, y al pie tiene «Limpiar filtros».
  - Se cierra con Esc o con un clic fuera, y el foco vuelve al botón.
  - Con filtros activos aparece la línea de fichas («Sucursal: Quito ✕», «Modalidad: Presencial ✕») y «Limpiar todo».
- **Preferencias:** los filtros y el buscador se mantienen al pasar entre Día, Semana y Lista. Se recuerdan por usuario como las columnas de la bandeja (`localStorage`, clave `sirius.agenda.filtros.<usuario>`). Las escenas no los leen ni los guardan.
- **Leyenda:** una ventanita con los mismos elementos de hoy y la nota de la carga.
- **Tabla:**
  - Mide su alto para llegar al pie de la pantalla (mínimo 260 px).
  - El encabezado de días y la columna «Inspector» quedan fijos; en Lista también queda fijo el encabezado de columnas.
  - La columna «Inspector» mide 240 px. La jornada y la cobertura se cortan en dos líneas con «…» y se leen completas en un tooltip al pasar el cursor o con el foco (solo cuando el texto se cortó; Esc lo oculta).
- **Atajos:** ← y → mueven la semana o el día, H va a Hoy y F abre los filtros. No actúan en los campos, en los menús ni en las ventanitas. Tampoco dentro de la tabla, porque ahí las flechas desplazan la tabla, ni con una ventana abierta.

**Medidas** (distancia de la primera fila de inspectores al inicio del área de contenido, debajo de la barra superior · inspectores visibles sin desplazarse)

| Escena | Pantalla | Antes | Después |
|---|---|---|---|
| agendasemana | 1920 × 1080 | 344 px · 6 de 6 | **189 px · 6 de 6** |
| cxagenda | 1920 × 1080 | 344 px · 4 | **189 px · 5** |
| agendasemana | 1280 × 720 | 444 px · 2 | **189 px · 5** |
| cxagenda | 1280 × 720 | 464 px · 0 | **189 px · 2** |
| cxagenda con el menú lateral abierto (como tu navegador) | 1905 × 868 | 392 px · 2 | 189 px · 3 |

Sin desplazamiento lateral de la página en ninguna (`scrollWidth = clientWidth`). La meta se cumple: ≤ 230 px y 4 o más inspectores visibles a 1920 × 1080, y 2 o más a 1280 × 720. Con el menú lateral abierto a 1280 × 720, la barra usa dos líneas: primera fila a 233 px y 2 inspectores visibles.

**Prueba cruzada**

- **Texto de la tabla antes y después, con los mismos filtros:** igual en agendasemana, agendadia, cxagenda y cxagendafiltros, en Semana, Día y Lista. También en agendaok, agendamover, cxagendamover, redfuentejornada y redfuentebloqueo. En cxagenda solo cambió el minuto de «vence» de las ofertas, que sigue la hora real.
- **Cada filtro combinado con el buscador frente al desplegable «Inspector» de la versión anterior:** cada opción de cada filtro del panel, sola y con cada inspector. Fueron 294 combinaciones en cxagenda (los 5 filtros, Ciudad y zona incluida) y 182 en agendasemana. Las 476 dan el mismo texto de tabla.

**Verificado**

- **Teclado:**
  - El orden de Tab recorre ⓘ, Más, Día, Semana, Lista, ‹, Hoy, ›, el buscador, Filtros, Leyenda y luego la tabla.
  - Filtros con Enter pone el foco en «Sucursal», y Tab pasa a «Tipo».
  - Esc cierra el panel, el menú «Más», la Leyenda y el ⓘ, y en cada caso el foco vuelve a su botón. Al cerrar Pedidos o Duración, el foco vuelve a «Más».
  - Un clic fuera cierra el panel.
- **Atajos:** → avanza una semana, ←← retrocede dos, H vuelve a hoy y F abre el panel con el foco en «Sucursal». Escribiendo «hf» y → dentro del buscador no se mueve la semana ni se abre el panel.
- **Buscador:** «luis» sugiere «Luis Andrade» y Enter lo elige. El filtro se mantiene al pasar a Día, y ✕ lo quita y deja el foco en el cuadro.
- **Tooltip:** con el foco en la jornada de Luis Andrade muestra «09:00–18:00 · Quito · Zona Valles Cumbayá y Tumbaco · Sucursal Ambato», y Esc lo oculta.
- **Barra fija:** a 1280 × 420, con la página desplazada, la barra queda a 0 px del borde superior.
- **Preferencias:** con Sucursal Quito, Modalidad Presencial y Marco Tapia elegidos, al recargar y volver a la Agenda siguen elegidos. «Limpiar todo» los quita.
- **Regresión de las escenas de Agenda:** agendaok, agendamover, agendadia, redfuentejornada (también con `?fvista=semana`), redfuentebloqueo, cxagenda y cxagendamover (también con `?fmov=choque`). Los textos de los diálogos son iguales y no hay errores. Revisé las capturas del detalle del bloqueo a 1280 y de «Mover la visita» a 1920.
- **Capturas antes y después** a 1280 × 720 y 1920 × 1080, y de las 4 escenas nuevas en ambas resoluciones.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**

- Lector de pantalla real (NVDA o VoiceOver): revisé los roles y nombres accesibles en el DOM.
- Firefox y Safari.
- La conexión real (no simulada).

**Diferencias** (todas de diseño)

- **Encabezado:** las pestañas pasan a un selector segmentado. El desplegable «Inspector» pasa a ser un buscador. Los otros filtros pasan a un panel, la leyenda a una ventanita, Pedidos y Duración al menú «Más», y la descripción al ⓘ.
- **Limpiar:** antes, «Limpiar filtros» quitaba los 6 filtros, el inspector incluido. Ahora, «Limpiar filtros» del panel quita los 5 del panel y «Limpiar todo» de las fichas quita también el inspector del buscador.
- **Recordar filtros:** los filtros se recuerdan por usuario. Antes volvían a «Todas» al entrar.
- **Columna «Inspector»:** 240 px en lugar de 190. El texto largo de jornada y cobertura se corta a dos líneas, pero sigue completo para el lector y en el tooltip.
- **Alto de la tabla:** antes era `100vh − 300 px`, ahora se mide.
- **Hora:** debajo de 1440 px se ve abreviada.
- **No existe la escena agendalista:** comparé la Lista abriendo agendasemana, agendadia y cxagenda y pasando a Lista.
- **Back-office:** se cambió solo para registrar las escenas nuevas.

**Escenas**

| Escena | Qué muestra |
|---|---|
| agendafiltros | El panel «Filtros» abierto con el foco en «Sucursal» |
| agendafiltroschips | Sucursal Quito y Modalidad Presencial activos: «Filtros 2» y las fichas con «Limpiar todo» |
| agendaleyenda | La ventanita «Leyenda» abierta |
| agendamas | El menú «Más» abierto con «Pedidos de los inspectores» y «Duración de las visitas» |

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (3 archivos y la sección «Agenda: encabezado compacto y más espacio para trabajar»).

Tiempo de la etapa: inicio 21/11/2026 19:06 · fin 21/11/2026 19:27 · 21 min

---

## 18/10/2026 · 20:30 — Etapa R-5b

Publiqué la versión 365 de SIRIUS (los archivos subieron en la 364; esta versión cierra el registro con el tiempo de la etapa). Ahora la cobertura de un inspector son sus filas de la Red de inspectores, y solo ellas (DEC-266). El modelo viejo de la ficha salió de SiriusCobertura: el respaldo con zonas heredadas y las ediciones de la sesión ya no existen. Con la conexión, la pantalla ignora `u.cobertura` y `u.zonas`. El hallazgo principal: sin la conexión, la Agenda, Coordinar visita y el portal no usaban las filas, sino las «zonas» de cada inspector convertidas en sucursales. Por eso cambia la cobertura de 7 de los 10 inspectores de la demostración: son las diferencias aceptadas y van una por una en **Diferencias**. En las escenas con la conexión simulada convertí los datos viejos en filas equivalentes, y ahí no cambia ningún nivel.

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué usaba | Ahora |
|---|---|---|
| `sirius-cobertura.js` | `S.de`, `deBase`, `S.migrar`, `S.zonasHeredadas`, `S.normalizar`, `S.ed`, `S.enSesion`, `S.quitarSesion`, `S.avisos`, `S.guardar` y el `Editor`; `cubre`, `corto`, `resumen` y `sinCobertura` con respaldo del modelo viejo | Solo filas; `filasDe` por el lector |
| `sirius-red-fuente.js` | — | `filas(n)`, el único lector de las filas |
| `Usuarios.dc.html` | `ufVmCx` (`u.cobertura` o `migrar(zonas)`), `ufVmDemo` (`C.de`), `sinCobertura`, `normalizar`/`limpiar`/`quitarSesion` al guardar, la tarjeta con el `Editor` | Filas; tarjeta de solo lectura |
| `sirius-usuarios-base.js` | Campo `cobertura` y «(migrada de sus zonas)» en el historial | Solo `coberturaFilas` |
| `sirius-usuarios-ficha.js` | `CoberturaCampo` (corto, resumen, normalizar, MODOS y avisos) | Sale (no se usaba desde R-4) |
| `sirius-maestros.js` | `S.ed` en maestrosrenombrar | Sale |
| `sirius-portal-lugar.js` | `S.ed` con coberturas de demostración | Filas en la Red de la sesión |
| `sirius-agenda.js`, `Agenda.dc.html`, `sirius-portal-caso.js` | `cubre`/`corto` con respaldo de `zonas` | Solo filas |
| `SIRIUS Back-office.dc.html` | `corto(i)` si traía `cobertura`; si no, sus zonas | `corto` de las filas |
| `sirius-lugar.js`, `Coordinacion.dc.html` (resumen), `sirius-app-inspector.js` (resumen), `sirius-ciudades-zonas.js` (`conZona`), `sirius-zonas.js` (`quitarZonas`) | La API de SiriusCobertura por nombre | Sin cambio de código: ahora la API responde con filas |
| `sirius-red.js` y `datos-red.js` | «Viene de la ficha» sin «Quitar»; `aplicar('retirar')` rechazaba esas filas | Filas normales con «Quitar» |
| `datos-cx-usuarios.js`, `datos-cx-lugar.js`, `datos-cx-fases.js`, `datos-cx-inspectores.js` | `cobertura` y `zonas` de usuarios e inspectores simulados | `coberturaFilas` equivalentes |
| `datos-usuarios.js` (vigilado) | No tiene cobertura ni zonas | **No cambia** (sigue en 1.7) |

**Qué cambió**

- `SiriusCobertura` 2.0 trabaja solo con filas:
  - `filasDe` toma `coberturaFilas` del objeto o, por nombre o identificación, `SiriusRedFuente.filas`.
  - `cubre`, `corto`, `resumen` y `sinCobertura` usan `cubreFilas`, `vigentes` y `ambitoTxt`.
  - `inspectores()` usa la lista del lector.
  - `conZona` y `quitarZonas` trabajan sobre las filas.
  - `fijarFilas` sirve a las escenas para poner filas en la Red de la sesión.
- `SiriusRedFuente.filas(n)`:
  - Sin la conexión, lee la Red de la sesión o SIRIUS_RED.
  - Con la conexión, lee `SIRIUS_CONEXION.red` y, si la Red no las trae, `coberturaFilas` del inspector o del usuario de la base. Nunca lee la demostración.
- Red › Por inspector: sin «Viene de la ficha»; todas las filas tienen «Quitar». `datos-red.js` 1.3: la fila de Paola Vinueza pasa a origen «Red de inspectores» con historial «Cobertura traída de la ficha (R-5b)». La escena redcx ya no muestra «Viene de la ficha».
- Usuarios: la tarjeta «Cobertura» es de solo lectura, con el resumen de las filas y «Abrir en Red de inspectores». Ya no hay cobertura de la sesión ni «Sin guardar en la base» para la cobertura.

**Paridad** (foto ANTES y DESPUÉS, sin conexión y con la conexión simulada)

| Punto | Resultado |
|---|---|
| (a) Nivel de cobertura, 246 lugares (cada zona, «zona por confirmar», cada ciudad sin zonas y cada sucursal), conexión simulada: cxcoordins (5 inspectores), lugarbuscar (6) y cxagenda (6) | Igual (0 diferencias) |
| (a) Lo mismo sin la conexión (10 inspectores) | Igual en Marco Tapia, Paola Vinueza y Jorge Pazmiño; los otros 7 cambian donde el modelo viejo y las filas no coincidían (ver Diferencias) |
| (b) Sugerencias de Coordinar visita en coord, cxcoordins y lugarbuscar (texto) | Igual |
| (c) Portal de demostración (portalagenda, portalporagenda) | Horarios: 118 inmediatos y 18 por la red → 113 y 23 (Cristian Vaca ya no tiene cobertura). El texto que se ve es igual |
| (d) Cobertura de la ficha (usfichaoperacion, cobertura, coberturazonainactiva, coberturasucursales) | Igual |
| (d) Agenda (agendasemana, agendaok) | Cambia el texto corto junto al nombre («Sucursal Quito» en lugar de «Sucursales: Quito»; Cristian «Sin cobertura») |
| (d) App del inspector | insphoy igual; inspyo: Mauricio «Atiende cualquier lugar de Quito» en lugar de «la sucursal Quito» |
| (e) Red › Por zona y Por sucursal (redzona, redsucursal, redzonaprobar) | Igual |

**Prueba cruzada**

En la Red se quita la fila «Sucursal Quito» de Marco Tapia y se le da a Cristian Vaca «Quito (ciudad completa)»:

| Pantalla | Antes | Después |
|---|---|---|
| Coordinar visita (Quito · Centro) | Marco en «ciudad»; Cristian «fuera» | Marco «fuera»; Cristian en «ciudad» |
| Portal de demostración | Marco en 113 horarios inmediatos; Cristian en 0 | Marco en 0; Cristian en 118 |
| Agenda | Marco «Sucursal Quito» y cubre; Cristian «Sin cobertura» | Marco «Sin cobertura» y no cubre; Cristian «Quito (toda la ciudad)» y cubre |
| Red › Por zona (Quito · Centro) | Inmediata: Marco, Mauricio y Sofía | Inmediata: Cristian, Mauricio y Sofía |

**Verificado**

- **Conexión temporal activa (no simulada)** en una copia aparte: Gabriela Toapanta trae `cobertura` «todas» y `zonas` Guayaquil, que contradicen sus `coberturaFilas` (solo la zona Sur de Quito).
  - SiriusCobertura, la Agenda conectada, Coordinar visita y Usuarios usan las filas: cubre Sur, no cubre Norte ni Guayaquil, y el texto corto es «Quito · Zona Sur».
  - El usuario de la base ya no tiene el campo `cobertura`.
  - `sirius-conexion.js` sigue en 70 bytes.
- La fila traída de la ficha (Paola Vinueza) tiene «Quitar» y se quita con motivo. «Abrir en Red de inspectores» abre la Red con el inspector.
- **Regresión del texto** contra la versión anterior: 27 escenas de la paridad y 88 más. Las 17 que cambian son las de Diferencias; ninguna da errores.
- Capturas de redcx y coberturalectura a 1280×720 y 1920×1080.
- **Búsqueda** de «migrar», «zonasHeredadas», «u.cobertura», «Viene de la ficha» y «Ficha de usuario»: solo quedan en comentarios históricos, en el historial de `datos-red.js` y en la migración de flujos (otro tema). `u.coberturaFilas` es el campo nuevo.

**No verificado**

- La base real (`red_inspectores` y las filas de producción).
- Firefox y Safari.

**Diferencias** (donde el modelo viejo daba distinto a las filas)

- **Cristian Vaca:** antes, sucursales Quito y Manta; no tiene filas. Queda sin cobertura: «Sin cobertura» en la Agenda y en Usuarios, ya no aparece en el portal ni como candidato.
- **Pedro Lasso:** antes, sucursales Manta y Guayaquil; no tiene filas. Queda sin cobertura.
- **Renata Cobo (inactiva):** antes «Todas»; su única fila está vencida. Queda sin cobertura.
- **Diana Cárdenas:** antes, sucursales Quito y Guayaquil; ahora solo la zona Norte de Quito. La zona Centro empieza el 01/11.
- **Luis Andrade:** antes, sucursales Quito y Ambato; ahora la zona Valles Cumbayá y Tumbaco y la sucursal Ambato.
- **Sofía Arteaga:** antes, sucursales Quito, Ambato y Cuenca; ahora la sucursal Quito y Riobamba (ciudad completa).
- **Mauricio Endara:** antes, sucursal Quito; ahora Quito (ciudad completa). Cubre igual en Quito, pero por ciudad.
- **Portal de demostración:** de 118 inmediatos y 18 por la red pasa a 113 y 23.
- **Texto corto con el formato de las filas:** «Sucursal Quito» en lugar de «Sucursales: Quito»; «Quito · Zonas Norte y Centro» en lugar de «Quito: Norte y Centro». Se ve en la Agenda, la Agenda conectada, Usuarios y la cuenta bancaria.
- **Usuarios:** la lista avisa «3 sin cobertura». La ficha de Mauricio (coberturalectura) muestra el resumen de sus filas en lugar del editor viejo.
- **zonaseliminar:** nombra a «Diana Cárdenas y Mauricio Endara» (el orden de la Red) en lugar de «Mauricio Endara y Diana Cárdenas».
- **Red › Por inspector:** sale la nota «Las filas que vienen de la ficha se cambian en Usuarios…».
- **Escenas de cobertura de Usuarios:** cobertura, coberturalectura, coberturazonainactiva, usrsinguardar y cxusrsesion ya no siembran la cobertura de la sesión. Solo coberturazonainactiva sigue marcando la zona inactiva.
- **Escenas con la conexión simulada:** `coberturaFilas` equivalentes a su cobertura o zonas anteriores. Con la conexión, la cobertura nunca sale de la demostración.

**Escenas**

Sin escenas nuevas. Cambian las descripciones de redcx, coberturalectura, zonaseliminar y maestrosrenombrar.

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (18 archivos y la sección «La cobertura sale solo de las filas de la Red»).

Tiempo de la etapa: inicio 21/11/2026 18:16 · fin 21/11/2026 18:51 · 35 min

---

## 18/10/2026 · 20:30 — Etapa R-5a

Publiqué la versión 363 de SIRIUS (los archivos subieron en la 362; esta versión cierra el registro con el tiempo de la etapa). La jornada, la capacidad, las modalidades, los ramos, «recibe ofertas» y los bloqueos de cada inspector ya se leen con un solo lector de la Red de inspectores (`sirius-red-fuente.js`, DEC-266 y DEC-268), y `SIRIUS_AGENDA` 1.2 ya no los tiene. Con los mismos datos, la Agenda, Coordinar visita, la Agenda conectada, el monitor y el portal dan exactamente lo mismo que antes. Un cambio hecho en la Red ahora se ve en todas esas pantallas. Antes de tocar nada te pregunté qué valores debían quedar en la Red para cuatro inspectores donde las fuentes no coincidían, y elegiste «Paridad primero».

**Mapa de impacto (hecho antes de cambiar)**

| Archivo | Qué leía | Ahora |
|---|---|---|
| `sirius-agenda.js` | `A.disp`, `A.trabaja`, `A.bloqueos` y la capacidad de `validar` desde `SIRIUS_AGENDA.disponibilidad` y `.bloqueos` | El lector (misma forma de respuesta) |
| `Coordinacion.dc.html` | `jornada(nombre)` y `capacidad(n)` de `SIRIUS_AGENDA.disponibilidad` y `base.escena.disponibilidad` | El lector |
| `SIRIUS Back-office.dc.html` | Agenda conectada (`d0` de `AG.disponibilidad` y `coordEscena.disponibilidad`); escena de Mauricio Endara (`SIRIUS_AGENDA.red`) | El lector (`disp`, `capacidad`, `deRed`) |
| `Usuarios.dc.html` | `ufJornada`, y modalidades y «recibe» de `ufVmDemo` | El lector |
| `sirius-monitor.js` | Capacidad (jornada) y disponibilidad (bloqueos) de cada persona | El lector |
| `sirius-portal-caso.js` | `AGD()`: agenda fija, red de ofertas, orden, credencial y organización | El lector (`agenda`, `ofertas`, `disp`, `deRed`) |
| `sirius-cobertura.js` | `inspectores()` y `zonasHeredadas()` con `A.disponibilidad` y `A.red` | El lector |
| `ConfiguracionGeneral.dc.html` | Número de inspectores con jornada propia | El lector |
| `datos-cx-inspectores.js` | cxcoordjornada sumaba a `SIRIUS_AGENDA.disponibilidad` | Red de la escena (`SIRIUS_CONEXION.red`) |
| `datos-red.js` | La demostración de la Red | Valores escritos, 1.2 |
| No estaban en la lista | `sirius-app-inspector.js` (red, jornada y bloqueos del inspector) y las escenas de Coordinar visita por fases (`datos-cx-fases.js`, `coordEscena.disponibilidad`; `datos-cx-lugar.js`) | El lector y la Red de la escena |
| Sin cambios | `jornadaDefecto`, `intentosSinRespuesta`, `confirmacion`, `traslado`, `franjaMinima`, `vistas`, `vistaInicial`, `autoagendamiento`; la cobertura de la ficha (R-5b); `sirius-conexion.js` (70 bytes); archivos vigilados salvo `datos-agenda-liquidaciones.js` | — |

**Qué cambió**

- **Lector único** `sirius-red-fuente.js` (`window.SiriusRedFuente`): `fuente()`, `inspector`, `lista`, `jornada` (propia o la jornada por defecto, con `propia`), `trabaja`, `capacidad`, `modalidades`, `ramos`, `recibe`, `bloqueos` (la forma exacta de `A.bloqueos`) y `bloqueosDe`. La conversión de días (Red 1 a 7, Agenda 0 a 6) se hace solo aquí. Se carga antes de `sirius-agenda.js`, `sirius-cobertura.js` y `sirius-portal-caso.js` en el Back-office, Agenda, Portal, Formularios y Usuarios; también en Configuración general.
- **Fuente:** con la conexión, real o simulada, `SIRIUS_CONEXION.red`. Sin ella, la Red de la sesión (lo que se guarda en Red › Por inspector) o `SIRIUS_RED`.
- **Transición hasta R-5b:** `disp(n)`/`agenda()` y `deRed(n)`/`ofertas()` devuelven los registros con la forma anterior. La credencial, la ciudad base, la ubicación, las zonas heredadas y la organización van en `ficha` de cada inspector de la Red.
- **`datos-red.js` 1.2:** lleva escritos los valores que antes resultaban. Sofía Arteaga queda con Presencial y los tres grupos, sin jornada propia y sin capacidad. Mauricio Endara, Pedro Lasso y Renata Cobo quedan sin jornada propia. Los bloqueos traídos de la Agenda tienen origen «Red de inspectores» y en el historial «Bloqueo traído de la Agenda (R-5a)». `aplicar('desbloquear')` ya no rechaza esos bloqueos.
- **`SIRIUS_AGENDA` 1.1 → 1.2** (`datos-agenda-liquidaciones.js`, vigilado): sin `disponibilidad`, `red` ni `bloqueos`. El resto de las claves queda igual, carácter por carácter.
- **Red › Por inspector:** los bloqueos ya no dicen «Viene de la Agenda» y tienen «Quitar». Sin jornada propia dice «Sin jornada propia: usa la jornada por defecto (Lunes a sábado, 08:30 a 17:30)».
- **Agenda:** el bloqueo se ve igual («Bloqueado …: motivo»). Para quien tiene «Gestionar la red de inspectores» es un botón que abre su detalle con «Gestionar en Red de inspectores» (Red › Por inspector con esa persona). Se cierra con Esc o con un clic fuera y el foco vuelve al bloqueo. Los demás ven el bloqueo sin el enlace.

**Paridad** (foto ANTES con la versión anterior y foto DESPUÉS, sin conexión y con la conexión simulada)

| Punto | Resultado |
|---|---|
| (a) `A.trabaja`, `A.bloqueos` y `A.disp` de 10 inspectores × 14 días (19/10 al 01/11) | Igual |
| (a) Jornada y capacidad de Coordinación (coord, cxcoordins, cxcoordjornada) | Igual |
| (a) Jornada de la ficha de Usuarios | Igual en los 10 |
| (a) Modalidades y «recibe» de la ficha | Igual salvo 3 (ver Diferencias) |
| (b) Inspectores, jornadas y capacidad de Coordinar visita y de la Agenda conectada (cxagenda) | Igual |
| (b) Cobertura, zonas heredadas, credencial, organización y perfil de la app | Igual |
| (c) Monitor (monitorresp y monitorcarga) | Igual |
| (d) Portal del 20152 (portalagenda y portalporagenda) | 118 horarios inmediatos y 18 por la red, antes y después |
| (e) Texto de agendaok, agendamover, agendadia, agendasemana, cxagenda, cxagendamover, coord, coordchoque, cxcoordins, cxcoordjornada, lugarbuscar, usuarios, monitorresp, monitorcarga, portalagenda, portalporagenda, portalhoras, cxcoordfases y coordfechahora | Igual. En cxagenda y cxagendamover solo cambia la hora real de Ecuador, y en portalporagenda el enlace aleatorio |
| (e) usfichaoperacion | Cambia: Sofía con los valores que usan las demás pantallas |

**Prueba cruzada**

El mismo cambio en la Red (jornada de Marco Tapia L–V 09:00–13:00 y un bloqueo el 22/10 de 09:00 a 11:00), en cada pantalla:

| Pantalla | Antes del cambio | Después |
|---|---|---|
| Agenda | 08:00–17:00 junto al nombre | 09:00–13:00, «Bloqueado 09:00–11:00: Reunión…», y mover a las 15:00 «queda fuera de la jornada de Marco Tapia (09:00 a 13:00)» |
| Coordinar visita | lun a vie, 08:00–17:00 | lun a vie, 09:00–13:00; las 15:00 «Fuera de la jornada de Marco Tapia (lun a vie, 09:00–13:00)» |
| Ficha de Usuarios | 08:00–17:00 | 09:00–13:00 |
| Monitor (cargabilidad) | 44 % | 106 % |
| Portal de demostración | Marco en 113 horarios inmediatos (45 por la tarde) | 56, ninguno por la tarde |

Las dos escenas nuevas muestran lo mismo.

**Verificado**

- **Conexión temporal activa (no simulada)** en una copia aparte, con `SIRIUS_CONEXION.red` propia (Marco 09:00–13:00, capacidad 4 y un bloqueo el 24/11) y sin `SIRIUS_AGENDA.disponibilidad`. La Agenda conectada y Coordinar visita usan esa jornada, esa capacidad y ese bloqueo, y la demostración (08:00–17:00) no interviene. `sirius-conexion.js` sigue en 70 bytes.
- **Detalle del bloqueo:** Esc lo cierra y devuelve el foco; Enter lo abre; «Gestionar en Red de inspectores» abre Red › Por inspector con Marco. Desde allí, «Quitar» un bloqueo traído de la Agenda lo saca de la Agenda y queda en el historial. El Inspector ve el bloqueo sin el enlace.
- **Escenas nuevas** a 1280×720 y 1920×1080, sin errores ni desplazamiento lateral.
- **Regresión del texto contra la versión anterior:** 154 escenas a 1280×720 (Red, Agenda, Coordinar visita, Usuarios, portal, app del inspector, monitor, honorarios, notificaciones y coordinación con la conexión simulada) y 15 a 1920×1080. Diferentes: solo las 11 que se explican en Diferencias.
- **Búsqueda en todo el proyecto:** `SIRIUS_AGENDA` con `disponibilidad`, `.red` o `bloqueos` queda solo en el lector, en `datos-red.js` y en comentarios históricos.
- **Archivos vigilados:** cambió solo `datos-agenda-liquidaciones.js` (SIRIUS_AGENDA 1.2). `datos-usuarios.js`, `datos-portal-cliente.js`, `datos-notificaciones.js` y `datos-zonas.js` quedan iguales.
- Sintaxis de los 23 archivos cambiados.

**No verificado**

- La base real (`red_inspectores` y `redAccion` reales): solo conexión temporal y simulada.
- Firefox y Safari; lector de pantalla sobre el detalle del bloqueo.
- La app del inspector y el portal con la Red cambiada desde la pantalla de la Red (solo por el lector y la prueba cruzada).

**Diferencias**

- **Ficha de Usuarios, 3 valores que antes se contradecían con el portal:** Mauricio Endara pasa de «Presencial» a «Presencial, Virtual guiada» (el portal ya le ofrecía las dos). Pedro Lasso (invitación vencida) y Renata Cobo (inactiva) pasan de «recibe de la red» a «No recibe ofertas», que es lo que dice la Red y lo que hacía el portal.
- **Red de inspectores, por tu elección «Paridad primero»:**
  - Sofía Arteaga queda con Presencial, Vehículos, Ramos Generales y Equipo y maquinaria, sin jornada propia y sin capacidad.
  - Mauricio Endara, Pedro Lasso y Renata Cobo, sin jornada propia; Mauricio y Renata, sin capacidad.
  - Se ve en las escenas red, redasignar, redsincob, redcx, redlistalarga, redzonaasignar y redsucursalasignar, y en la tarjeta «Operación» de usfichaoperacion, cobertura y coberturazonainactiva.
  - Los bloqueos ya tienen «Quitar» y su historial.
- **Escenas y lectores:**
  - La escena «coordins» no existe; usé coord, coordchoque y cxcoordins.
  - Encontré dos lectores más fuera de la lista: la app del inspector y las escenas de Coordinar visita por fases.
- **Texto en Configuración general (agendajornada):** «con jornada propia en la Agenda» pasa a «en la Red de inspectores».
- **Agenda:**
  - Con la conexión, cuando los bloqueos vienen de la Red de la base, la leyenda dice «Bloqueo (con su motivo)» en lugar de «(demostración)».
  - En redfuentejornada, «fuera de jornada por la tarde» se ve en la vista Día del 22/10. La Semana (`?fvista=semana`) muestra «09:00–13:00» junto al nombre, porque no dibuja horas.
- **Red de la sesión:** el lector lee la Red de la sesión porque los cambios de Red › Por inspector se guardan allí, no en `SIRIUS_RED`. Además, los archivos de datos se ejecutan dos veces al cargar.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `redfuentejornada` | Jornada de Marco Tapia cambiada en la Red a L–V 09:00–13:00: Agenda Día del 22/10 fuera de jornada desde las 13:00; `?fvista=semana` con «09:00–13:00» |
| `redfuentebloqueo` | Bloqueo nuevo de la Red (22/10, 09:00–11:00) en la Agenda Semana con su detalle abierto y «Gestionar en Red de inspectores» |

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (filas de los 23 archivos, `sirius-red-fuente.js` nuevo, 2 escenas y la sección «Una sola fuente para la operación de los inspectores»).

Tiempo de la etapa: inicio 21/11/2026 16:47 · fin 21/11/2026 17:46 · 59 min

---

## 18/10/2026 · 20:30 — Etapa U-8

Publiqué la versión 361 de SIRIUS (los archivos subieron en la 360; esta versión cierra el registro con el tiempo de la etapa). Con la conexión real el rol activo sale siempre del usuario de la sesión (DEC-267): ya no hay rol de respaldo, la pantalla queda tapada hasta que llega el usuario, se fija su rol principal y, si el rol deja de ser uno de los suyos o hay «ver como otro usuario», se corrige solo. Apliqué los 8 reemplazos de la asesoría, solo en `SIRIUS Back-office.dc.html`, y no cambia nada sin la conexión ni con la conexión simulada.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| `cxUsuario()` | Sin usuario devuelve `rol: ''` y `roles: []` (antes «Coordinador de inspecciones») |
| `cxRolEstado()` y `cxRolValido(st)` (nuevas) | Una sola regla del rol activo con la conexión real |
| `cxActivar()` y estado inicial con la conexión | No buscan el rol de un usuario ausente |
| `cxSuscribir()` | Al resolverse `X.listo` fija el rol del usuario |
| `componentDidUpdate` | Vigila que el rol activo sea uno de los roles del usuario y quita «ver como otro usuario» |
| Render (`role`) | Con la conexión real, sin rol de respaldo |
| `pick` de «Ver como otro usuario» | Con la conexión real no hace nada |
| Arranque con la conexión real: rol, menú lateral y menú del perfil | Salen del usuario de la sesión |
| Sin cambios | Demostración, conexión simulada y escenas, base, archivos vigilados, `sirius-conexion.js` (70 bytes) |

**Qué cambió**

Los 8 reemplazos exactos de la asesoría, en este orden: `cxUsuario()`; las funciones nuevas `cxRolEstado()` y `cxRolValido(st)` antes del comentario «Casos y detalles solo de la conexión»; `cxActivar()`; `cxSuscribir()`; el estado inicial con la conexión; `pick`; `componentDidUpdate`; y el `role` del render.

**Prueba cruzada** (copia aparte con una conexión temporal activa, no simulada, con `usuario` null al montar y `listo` que se resuelve a los 2 s)

| Caso | Antes | Ahora |
|---|---|---|
| (a) Santiago Ortiz, Ejecutivo comercial | Quedaba «Coordinador de inspecciones» con Red de inspectores, Reportes y Administración | «Ejecutivo comercial»; menú Inicio, Solicitudes, Agenda, Garantías y Reportes, sin Red de inspectores |
| (b) Andrea Salazar con roles Coordinador y Administrador | Entraba como Coordinador | Entra como Coordinador, cambia a Administrador desde el perfil y se mantiene tras 3 s |
| (c) «Ver como otro usuario» forzado (panel oculto mostrado) | Cambiaba el rol y el menú | No cambia nada ni a los 3 s |
| Mientras el usuario no llega | Menú de Coordinador completo | Pantalla «Preparando tu espacio de trabajo», sin rol |

`sirius-conexion.js` vuelve a su contenido mínimo (70 bytes): la conexión temporal solo existió en copias aparte.

**Verificado**

- Los 8 reemplazos: el archivo cambia solo en 7 bloques (el primero junta los reemplazos 1 y 2); el resto es igual al anterior. Sintaxis correcta.
- Sin la conexión: «Ver como otro usuario» (Santiago Ortiz y Verónica Lema) e «Ir a una escena» dan lo mismo que antes (813 escenas listadas).
- Escenas con la conexión simulada y de demostración (cxlimpio, redzonacx, garsincaso, cxagenda, demousuarios, inicio, inicioadm, iniciocom, redzona, cxgarantiacumplir, campanavacia): 11 de 11 iguales a 1280×720 y a 1920×1080.
- Sin errores de consola en la prueba con la conexión temporal.

**No verificado**

- La conexión real de producción (Supabase y el usuario real de la sesión): solo probé una conexión temporal con la forma del contrato.
- Que la base ignore el rol de pantalla (lo indica la asesoría; no lo probé).
- Firefox y Safari.

**Diferencias**

- Ninguna respecto de los 8 reemplazos pedidos. El mensaje de la prueba pedía «cinco líneas» para el paso 2: las pegué tal cual, y son seis líneas físicas (tres de comentario, `cxRolEstado()` y las dos de `cxRolValido`).

**Escenas**

Sin escenas nuevas ni cambiadas.

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (fila del Back-office y sección «Rol activo blindado con la conexión»).

Tiempo de la etapa: inicio 21/11/2026 16:28 · fin 21/11/2026 16:36 · 8 min

---

## 18/10/2026 · 20:30 — Etapa G-3d

Publiqué la versión 359 de SIRIUS (los archivos subieron en la 358; esta versión cierra el registro con el tiempo de la etapa). Garantías e Inicio ya no se detienen cuando la base trae una garantía sin su caso (DEC-261): se omite, no se muestra y no se cuenta. Antes del cambio la escena nueva fallaba con «Cannot read properties of null (reading 'asegurado')»; ahora carga sin errores y los números son los mismos con y sin la garantía huérfana. No cambió ninguna regla de Garantías.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Cómo usaba `state.gar` | Qué se hizo |
|---|---|---|
| `garVals` (lista, pestañas y contadores) | `infos` con `c: caseById(id)`; las filas leían `i.c.asegurado`, `ident`, `ramo`, `broker` y `fecha` | Los ids salen de `garIdsConCaso()`; filas, pestañas y contadores cuentan la misma lista |
| Lista `garantias` de `inicioCtx` (tarjetas de Inicio) | `byId[id] \|\| caseById(id) \|\| {}`: la garantía sin caso entraba con datos vacíos | Misma función: se omite |
| Contador de respaldos por revisar de Inicio | Recorría todas las claves de `state.gar` | Misma función |
| Ícono de Garantías de la barra lateral | Recorría todas las claves de `state.gar` | Misma función |
| Aviso de lista vacía («Sin garantías en seguimiento») | Contaba las claves de `state.gar` | Cuenta `garIdsConCaso()`: con solo una huérfana dice lo mismo que sin garantías |
| Solicitud `smI` (solicitar inspección) | Exigía la garantía, no el caso | Exige también el caso |
| Panel `gpI`, `cxFalta`, notificaciones, portal y monitor | Ya exigían el caso o leen solo `garInfo` | Sin cambios |
| Sin cambios | Reglas, pestañas, acciones, archivos de configuración vigilados, `sirius-conexion.js` (70 bytes), `SiriusGarantiasBase` | — |

**Qué cambió**

- `garIdsConCaso()` en el Back-office: devuelve los ids de `state.gar` cuyo caso existe. Es la única regla; la usan `garVals`, `inicioCtx`, el contador de respaldos de Inicio, el ícono de la barra lateral, el aviso de lista vacía y `smI`.
- Escena nueva `garsincaso` (conexión simulada, Verónica Lema): la base trae GAR-50099-1, con un respaldo, de un caso que no está en la lista. `?fvista=inicio` abre Inicio y `?huerfana=0` quita la garantía para comparar.

**Prueba cruzada**

| Punto | Con la garantía huérfana | Sin ella |
|---|---|---|
| Pendientes: contador = filas | 2 = 2 (50044, 50042) | 2 = 2 |
| Vencidas | 1 = 1 (50041) | 1 = 1 |
| Por revisar | 1 = 1 (50041) | 1 = 1 |
| Cumplidas | 1 = 1 (50043) | 1 = 1 |
| Todas | 4 = 4 | 4 = 4 |
| Ícono de Garantías en la barra lateral | 1 | 1 |
| «Respaldos por validar» de Inicio | 1 en 1 caso | 1 en 1 caso |

Antes del cambio, con la misma escena, el Back-office fallaba (también en Inicio, porque `garVals` se arma siempre).

**Verificado**

- `garsincaso` a 1280×720 y 1920×1080, en Garantías y en Inicio: sin errores de consola y sin desplazamiento lateral.
- Regresión de 24 escenas de Garantías, Inicio y campana a 1280×720 y 1920×1080 contra la versión anterior: 23 de 24 iguales en cada resolución. La diferente (`campanaavisos`) cambia solo por la hora real que escribe el aviso («15:49» contra «15:50»): la versión anterior contra sí misma da la misma diferencia.
- Sintaxis del Back-office y de los datos.

**No verificado**

- Con la base real (SQL 55): una garantía cuyo caso llega en la recarga siguiente. El cambio hace que aparezca cuando el caso exista, pero no lo probé con datos reales.
- Firefox y Safari.

**Diferencias**

- La campana del encabezado no lee `state.gar` (sus avisos vienen de `notificaciones`), así que no cambió; sí cambió el contador de respaldos de la barra lateral y el de Inicio.
- Para que Inicio de Verónica cuente respaldos, los casos de la escena llevan a Verónica Lema como ejecutivo.
- `?huerfana=0` es un parámetro agregado solo para la comparación de la escena.
- Con solo una garantía huérfana, la lista vacía dice «Sin garantías en seguimiento» (igual que sin garantías), no «No hay casos en esta pestaña».

**Escenas**

| Escena | Qué se ve |
|---|---|
| `garsincaso` | Garantías con 4 casos y pestañas 2 · 1 · 1 · 1 · 4; la garantía del caso 50099 no aparece ni se cuenta |
| `garsincaso` con `?fvista=inicio` | Inicio: «Respaldos por validar 1 en 1 caso» e ícono de Garantías en 1 |
| `garsincaso` con `?huerfana=0` | Los mismos números sin la garantía huérfana |

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (escena `garsincaso` y sección «Garantías sin su caso en pantalla»).

Tiempo de la etapa: inicio 21/11/2026 15:50 · fin 21/11/2026 16:03 · 13 min

---

## 18/10/2026 · 20:30 — Etapa R-3b

Publiqué la versión 357 de SIRIUS (los archivos subieron en la 356; esta versión cierra el registro con el tiempo de la etapa). Red de inspectores ya tiene las vistas «Por zona» y «Por sucursal», además de un solo diálogo «Asignar inspectores» para zonas, ciudades, sucursales y todas las sucursales. Las listas salen de `redLugar` con la regla de DEC-265: con la conexión, de la función `red_lugar` de la base; sin ella, de una base simulada con la misma forma. La prueba cruzada dio igual en los cinco puntos. Por inspector, Coordinación y los archivos vigilados no cambiaron. En este mensaje no llegó la maqueta, así que armé las vistas según la descripción (ver **Diferencias**).

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| `sirius-red.js` (v1.1) | Por zona (`PorZona`, `MapaRed`), Por sucursal (`PorSucursal`) y el diálogo único (`AsignarLugar`). `S.lugar` llama a `redLugar` o a la base simulada. `S.categoria` aplica la Definición para «Aporta» y el efecto. |
| `datos-red.js` (v1.1, no vigilado) | `SIRIUS_RED.lugar(datos, red)` con las vistas 'ciudad', 'sucursales' y 'probar'. `SIRIUS_CX_COORD.redLugar` y las escenas `redzonacx` y `redzonacxerror`. |
| `SIRIUS Back-office.dc.html` | La conexión simulada suma `redLugar`. Escenas en `KNOWN_ESC`, en la apertura de la Red y en `redEscena`. |
| `datos-escenas.js` | 9 escenas nuevas (805 en total). |
| Sin cambios | Por inspector, SiriusCobertura, Coordinación, el portal, Agenda, Usuarios, Ciudades y zonas, los archivos vigilados (`datos-zonas.js`, `datos-usuarios.js`, `datos-agenda-liquidaciones.js`, `datos-portal-cliente.js`…) y `sirius-conexion.js` (70 bytes). |

**Qué cambió**

- **Base simulada (`SIRIUS_RED.lugar`):**
  - Usa `SIRIUS_RED.inspectores` (estado Activo y filas vigentes a `hoy`), `SiriusCobertura.cubreFilas`, las zonas activas publicadas, `SiriusZonas.zonaDePublicada` para «probar» y las 11 sucursales.
  - Devuelve las tres formas del contrato.
  - La zona por confirmar cuenta solo todas, la ciudad completa y la sucursal, y amplía la red cuando hace falta.
  - Calcula las alertas de zona y de ciudad en el orden pedido.
- **Conexión simulada:** `redLugar` usa la misma función. Con `?cxok=0` (y en `redzonacxerror`) responde `{ ok: false, mensaje }`.
- **Por zona:**
  - **Barra superior:** selector «Ciudad» con las ciudades que tienen zonas y las de las 11 sucursales; por defecto, la sucursal del usuario o Quito. Al lado, «N zonas publicadas · N inspectores atienden <ciudad>» con la alerta en su tono, y el botón «Asignar inspectores».
  - **Mapa:**
    - Cada zona activa tiene un círculo y un punto con su nombre, o su área si la tiene: azul con propios, ámbar sin propios, rojo sin inspectores.
    - Un clic en una zona la elige y lleva a su tarjeta con el foco.
    - Una ciudad sin zonas muestra solo su radio.
    - La leyenda tiene las cuatro entradas.
  - **Panel «Probar una dirección»** (abajo a la izquierda):
    - Usa la búsqueda de SiriusUbicacion o un clic en el mapa, y deja el marcador «Dirección probada».
    - Muestra la zona calculada, el mensaje y las listas «Confirmación inmediata» y «Red», con la nota de red ampliada cuando corresponde.
    - Si la dirección es de otra ciudad, cambia el selector.
  - **Columna derecha:**
    - «Atienden toda la ciudad», con tipo, etiquetas, «Asignar» y la nota de «zona por confirmar».
    - «Por sucursal <sucursal>», con su nota.
    - Una tarjeta por zona: «Inmediata N · Red N» (y «Solo Coordinación N»), los nombres, los propios, la alerta en texto y «Asignar a esta zona».
    - Sin zonas, una sola tarjeta «Toda la ciudad (sin zonas)».
- **Diálogo «Asignar inspectores»** (único):
  - **Título y nivel:** el título depende del punto de entrada. Desde una zona se elige el nivel: «Esta zona» o «Toda la ciudad».
  - **Filtros y tabla:**
    - Filtros: Buscar, Tipo y Recibe ofertas.
    - Solo aparecen inspectores activos. Columnas: Inspector (tipo · agencia), Modalidades, Cobertura actual y «Aporta».
    - Quien ya cubre el ámbito queda deshabilitado con «Ya la atiende por la sucursal X / toda la ciudad / esta zona».
  - **Fechas y motivo:** «Vigente desde», «Hasta (opcional)» y «Motivo (obligatorio)», de 10 caracteres o más.
  - **Efecto:** «Efecto en <ámbito>» muestra «Confirmación inmediata: a → b» y «Red: a → b». Cuando corresponde agrega «Deja de estar «sin inspectores (propios)»» o «Rige desde el dd/mm: hoy no cambia».
  - **Guardar:** el pie aclara que la asignación queda en el historial y no cambia cuentas ni roles. «Asignar N inspectores» llama a `redAccion('asignar', …)`. Con `{ ok: false }`, el diálogo sigue abierto con los datos; con `{ ok: true }`, se cierra, la vista vuelve a pedir `redLugar` y aparece el aviso de la base.
- **Por sucursal:**
  - Las dos definiciones y la tarjeta «Atienden todas las sucursales» (con la lista o «Nadie tiene hoy cobertura «todas»…», y «Asignar»).
  - La tabla de las 11 sucursales, con «Ver en el mapa» (abre Por zona con esa ciudad y el foco en la pestaña) y «Asignar» (nivel sucursal).
  - La nota al pie.
- **Estados:** las dos vistas tienen carga, vacío y error, y se usan con teclado (pestañas con flechas, casillas con Espacio, Esc cierra y el foco vuelve al botón).

**Prueba cruzada**

| Punto | Resultado |
|---|---|
| (a) Listas Inmediata y Red de cada tarjeta = Por inspector (nivel de SiriusCobertura en la zona + la Definición) | 12 de 12 zonas iguales: Quito 5, Guayaquil 4, Cuenca 3 |
| (b) «Probar» en el punto de cada zona = la misma zona y las mismas listas que su tarjeta | 12 de 12 iguales |
| (c) Cada fila de Por sucursal = resumen y alerta de su ciudad en Por zona («Ver en el mapa») | 11 de 11 iguales (Quito «3 zonas sin inspectores propios»; Cuenca y Guayaquil «Sin red»; Loja, Machala, Santo Domingo, Ibarra, Manta y El Coca «Sin inspectores»; Riobamba y Ambato sin alerta) |
| (d) Sin la conexión = conexión simulada (7 ciudades, sucursales y 3 pruebas) | Respuesta idéntica, byte a byte |
| (e) Tras «Asignar», la tarjeta recargada = el efecto previsto | Zona Sur con Cristian Vaca y Luis Andrade: previsto «Inmediata 3 → 4 · Red 2 → 3 · Deja de estar sin propios»; tarjeta: «Inmediata 4 · Red 3», sin alerta. Igual sin la conexión y con la simulada. Loja con Cristian Vaca: «0 → 1 · Deja de estar sin inspectores» y la fila queda en Inmediata 1, «Sin red». |

**Verificado**

- **Pantallas:** las 9 escenas a 1280 × 720 y 1920 × 1080, sin desplazamiento lateral ni errores. A 1024 × 768 la columna derecha baja debajo del mapa.
- **Diálogo:**
  - Sin motivo: «Escribe el motivo (mínimo 10 caracteres).».
  - «Hasta» anterior a «desde»: aparece el mensaje de la base y el diálogo sigue abierto con el motivo escrito.
  - «Desde» futuro: «Rige desde el 05/11: hoy no cambia».
  - «Toda la ciudad» recalcula el efecto (4 → 5).
  - Quedan deshabilitados Marco Tapia y Sofía Arteaga («por la sucursal Quito») y Mauricio Endara («por toda la ciudad»).
- **Conexión simulada:** `redAccion` recibe `{ nivel: 'zona', inspectores, motivo, ciudad: '1701', zona: 'z1701-3', desde }` y la red de la conexión cambia. `redzonacxerror` muestra «La base rechazó la consulta (prueba)» y no cambia nada.
- **Probar:**
  - «Conocoto» (con flechas y Enter): Valle de los Chillos.
  - «Malecón»: cambia a Guayaquil · Zona Centro.
  - Una dirección sin ubicar: «zona por confirmar».
  - «Quitar» limpia el panel.
- **Copia aparte con una conexión temporal** (activa, no simulada):
  - `redLugar` con las formas del contrato y las claves vacías quitadas: las tarjetas muestran «Red: nadie» y 0.
  - La asignación llega a `redAccion` y la tarjeta se recarga.
  - Con `{ ok: false }`: el aviso y nada más. Sin `redLugar`: «La conexión todavía no calcula la red por lugar (falta el SQL 75)».
  - En el proyecto, `sirius-conexion.js` sigue con su contenido mínimo (70 bytes).
- **Regresión contra la copia anterior, texto visible:**
  - A 1280 × 720, 22 de 22 iguales: Por inspector (`red`, `redsincob`, `redasignar`, `redoperacion`, `redsinpermiso`, `redcx`, `redlistalarga`), Coordinación con sugerencias por cobertura (`lugarbuscar`, `lugarlejos`, `lugarfuera`, `lugarrg`, `cxlugar`, `cxcoordins`, `cxcoordmismo`, `coordoferta`, `coordagendada`, `cxvisitacliente`), `cobertura`, `usfichaoperacion`, `zonas`, `zonasprobar` y `portalsinhorarios`.
  - A 1920 × 1080, 8 de 8 iguales.
- **Archivos:** solo cambiaron `sirius-red.js`, `datos-red.js`, `SIRIUS Back-office.dc.html` y `datos-escenas.js`. Ningún archivo vigilado cambió, así que no subí ninguna versión.

**No verificado**

- La función `red_lugar` real (SQL 75) y sus mensajes. La base simulada usa mensajes propios con la misma idea.
- El mapa base con teselas reales: en esta vista están bloqueadas y aparece «Mapa base no disponible en esta vista».
- Firefox, Safari y lectores de pantalla sobre los marcadores del mapa (Leaflet los hace enfocables y abren con Enter).

**Diferencias**

- **Maqueta:** no llegó adjunta. La disposición sigue la descripción: barra arriba, mapa flexible a la izquierda y columna de 380–460 px a la derecha.
- **Listas en las tarjetas:** además de «Inmediata N · Red N», cada tarjeta muestra los nombres, para que se vea quién ofrece el portal (y para la prueba (a)).
- **Vista 'sucursales':** la base simulada devuelve `inmediata`, `red` y `coordinacion` como listas de nombres; la pantalla también acepta números. «probar» devuelve además `coordinacion` y `sucursal`, y `lugar.zona` va como `{ id, nombre }`.
- **«Atienden en la ciudad»:**
  - «Ana (toda la ciudad) · N por zonas».
  - «Sin zonas: ciudad completa» cuando la ciudad no tiene zonas y nadie la atiende por ciudad.
  - «— (N zonas publicadas)» cuando tiene zonas y nadie la atiende por ciudad ni por zona.
- **«Ya la atiende por todas las sucursales»:** lo sumé para quien tiene cobertura «todas».
- **Efecto en «todas las sucursales»:** sale de quienes ya tienen «todas», sin la línea «deja de estar».
- **Ciudad por defecto:** Andrea Salazar no tiene sucursal en sus datos, así que abre Quito.
- **Mapa:** el círculo de cada zona mide un décimo del radio de la ciudad (1,5 km en Quito); es solo visual. El mapa mide al menos 460 px, así que a 1280 × 720 la página baja un poco. Con un resultado, el panel «Probar» tapa parte del mapa.
- **Escena `redzonacxerror`:** equivale a `?cxok=0` (la conexión simulada responde `{ ok: false }` a todo).

**Escenas**

| Escena | Qué se ve |
|---|---|
| `redzona` | Quito: 5 zonas, «3 zonas sin inspectores propios», mapa, leyenda, probar y la columna derecha |
| `redzonasinzonas` | Ambato sin zonas: solo el radio y «Toda la ciudad (sin zonas)» con Inmediata 1 · Red 1 |
| `redzonaprobar` | Av. Amazonas probada: «Quito · Zona Norte», Inmediata 4 y Red 2, iguales a su tarjeta |
| `redzonaconfirmar` | «Calle sin nombre…»: «Quito · zona por confirmar», Inmediata 3 y Red 2 |
| `redzonaasignar` | Diálogo desde la zona Sur con Cristian Vaca y Luis Andrade: «3 → 4 · 2 → 3 · Deja de estar «sin inspectores propios»» |
| `redsucursal` | Las definiciones, «Atienden todas las sucursales» y la tabla de las 11 sucursales |
| `redsucursalasignar` | Diálogo de la sucursal Loja con Cristian Vaca: «0 → 1 · Deja de estar «sin inspectores»» |
| `redzonacx` | Conexión simulada con `redLugar`: igual que `redzona` |
| `redzonacxerror` | Conexión simulada con `{ ok: false }`: aviso y vista vacía |

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (sección «Red de inspectores por lugar: Por zona y Por sucursal»).

Tiempo de la etapa: inicio 21/11/2026 14:43 · fin 21/11/2026 15:15 · 32 min

---

## 18/10/2026 · 20:30 — Etapa U-7

Publiqué la versión 355 de SIRIUS (los archivos subieron en la 354; esta versión cierra el registro con el tiempo de la etapa). El selector «Agrupar por» (Riesgo | Visita) de Coordinación › cartas ya no recorta el resaltado del botón elegido en las esquinas exteriores: reproduje el cambio de `sirius-coordcartas.js` tal como lo pasó la asesoría. Encontré un segundo selector con el mismo patrón, el de nivel de cada permiso en Usuarios › Roles y permisos, y le apliqué la misma corrección. Los dos se ven completos en los dos estados y con el foco del teclado. Una diferencia mía queda en **Diferencias**.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| `sirius-coordcartas.js`, `.cc-seg` | Contenedor con 3 px de relleno y 2 px de separación, sin `overflow:hidden`; botones de 36 px con esquina de 7 px y fondo transparente; `.cc-seg button:focus-visible` con contorno de 2 px. Se quita `.cc-seg button+button`. `[aria-checked="true"]` queda igual. |
| `Usuarios.dc.html`, nivel por permiso | El contenedor de los radios (Sin acceso, Ver, Editar…) usa el mismo patrón: sin recorte, relleno de 3 px, separación de 2 px, botones de 28 px con esquina de 7 px y sin raya entre botones. El elegido conserva su contorno interior de 2 px. |
| Revisados, sin cambio | `.cg-seg` (Calificación › Garantías) y `.scv-seg` (Modalidad en Coordinar visita): el elegido se rellena por completo y el recorte sigue la esquina del contenedor; no tienen contorno interior. |
| Sin cambios | Resto de Coordinación, `sirius-conexion.js` (70 bytes) y los archivos de configuración vigilados (no sube ninguna versión). |

**Qué cambió**

- **«Agrupar por»:** antes el botón elegido era cuadrado dentro de un contenedor de esquina de 10 px con recorte, y el contorno interior de 2 px quedaba cortado en las esquinas exteriores. Ahora el botón tiene su propia esquina de 7 px, dentro del relleno de 3 px del contenedor, y el contorno se ve completo en los dos botones.
- **Foco por teclado:** `.cc-seg button:focus-visible` pinta el contorno de 2 px con 2 px de separación; como el contenedor ya no recorta, el anillo se ve entero.
- **Selector de nivel por permiso (Usuarios):** misma corrección. Para que la fila no crezca, el botón pasa de 32 a 28 px; el selector queda 2 px más alto que antes.

**Prueba cruzada**

| Punto | Antes | Ahora |
|---|---|---|
| «Agrupar por», Riesgo elegido (1280 y 1920) | Esquinas exteriores izquierdas del botón cortadas | Contorno completo con esquinas redondeadas |
| «Agrupar por», Visita elegido | Esquinas exteriores derechas cortadas | Contorno completo |
| Altura del selector «Agrupar por» | 42 px | 44 px |
| Nivel por permiso, Sin acceso y Ver elegidos | Esquinas exteriores cortadas | Contorno completo |
| Altura del selector de nivel | 35 px | 37 px |
| Cambio de agrupación y de nivel | Funciona con clic y con flechas | Igual: las flechas cambian la opción y el foco acompaña |
| Resto de las dos pantallas | — | Sin diferencias de píxeles fuera de la franja del selector; en 1280 × 720 el contenido de Coordinación queda 2 px más abajo |

**Verificado**

- `coordcartas` y `coordcartasvisita` a 1280 × 720 y 1920 × 1080, sin desplazamiento horizontal ni errores en consola.
- Vista ampliada (3×) del selector «Agrupar por» en los dos estados (Riesgo y Visita) y con el foco del teclado, en las dos resoluciones.
- `monitorpermiso` (nivel por permiso, con el contorno de la fila resaltada) a 1280 × 720 y 1920 × 1080 con la vista ampliada en los dos estados y con el foco; la escena `roles` carga sin errores.
- Comparación píxel a píxel de las capturas «antes» y «después»: solo cambia la zona de los selectores (y, en 1280 × 720, el contenido de Coordinación baja 2 px).
- `sirius-conexion.js` sigue en 70 bytes. El catálogo tiene 796 escenas.

**No verificado**

- Firefox y Safari.
- Lector de pantalla: el selector conserva `role="radiogroup"` y `aria-checked`, sin cambios.

**Diferencias**

- **Color del foco:** el contorno de foco que se ve en «Agrupar por» es el de todo el Back-office (celeste, 3 px), no el azul de 2 px de la regla nueva. Dejé la regla de la asesoría tal cual; con el foco en un radio ya elegido, el anillo celeste rodea al azul sin recortarse.
- **Selector de nivel en Usuarios:** lo corregí además del pedido, porque tenía el mismo patrón (contenedor con recorte, botón cuadrado, contorno interior de 2 px). Usé botones de 28 px, no de 36, para no estirar las filas de la lista.
- `.cg-seg` y `.scv-seg` no se tocaron: se rellenan por completo al elegir y no tienen contorno interior, así que no pierden nada en las esquinas.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `coordcartas` | Caso 20196 agrupado por riesgo, con «Riesgo» elegido |
| `coordcartasvisita` | El mismo caso agrupado por visita, con «Visita» elegida |
| `monitorpermiso` | Roles y permisos con el selector de nivel de «Ver el monitor del proceso» |

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (sección «Selectores segmentados sin esquinas cortadas»).

Tiempo de la etapa: inicio 21/11/2026 11:48 · fin 21/11/2026 11:55 · 7 min

---

## 18/10/2026 · 20:30 — Etapa S-1b

Publiqué la versión 353 de SIRIUS (los archivos subieron en la 352; esta versión cierra el registro con el tiempo de la etapa). Nueva solicitud ya envía a la base todo lo que pide el formulario. El Resumen muestra a la persona completa y la póliza. «Editar solicitud» y «Duplicar» funcionan, y el enlace del cliente sale por uno, dos o tres canales. En Administración hay una entrada «Portal del cliente». Cuatro decisiones mías están en **Diferencias**.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| Nueva solicitud (`NuevaSolicitud.dc.html`) | `cxPersona` y `cxPoliza` arman el asegurado, el solicitante y la póliza del contrato. La prop `modo` abre el formulario para editar o duplicar. La fecha y hora de la solicitud son las reales. |
| Back-office › Resumen | «Solicitante y asegurado» (uno o dos bloques) y «Póliza» salen de una sola función (`solPersonas`, `solCampos`, `solPoliza`) con la base o con la ficha del caso. |
| Back-office › menú del caso | «Editar solicitud» (habilitado o deshabilitado con su motivo) y «Duplicar» abren Nueva solicitud. |
| Back-office › envíos de enlace | `cxEnlaceContrato`: todo `enviarEnlace` sale con `canales` y `destino*`. |
| Coordinar visita (`sirius-coordinar.js`) y Coordinación | `CanalesUI`, una sola pieza para el autoagendamiento y la autoinspección. El aviso tras enviar y la carta dicen los canales. |
| Administración | Entrada «Portal del cliente», con la misma pantalla de Formularios de inspección. |
| Base simulada | `editarSolicitud`; `crearCaso` guarda la solicitud completa; un envío por canal; casos 50059 y 50060. |
| Sin cambios | Riesgos, lugar y modalidad de Nueva solicitud, carga masiva, `sirius-conexion.js` y los archivos de configuración vigilados. |

**Qué cambió**

- **Nueva solicitud:** `crearCaso` lleva el asegurado completo (tipo y número de identificación, nombre, nombres, apellidos, nacimiento, estado civil, género, fijo, provincia y cantón con código del INEC, dirección y contacto). El solicitante va solo si no es el asegurado, y la póliza lleva fecha y hora, broker, correo APS, orden y tipo. Un dato vacío no se envía.
- **Resumen:** con el mismo solicitante hay un bloque «Solicitante y asegurado»; si son distintos, dos (Solicitante y Asegurado). Cada uno muestra nombres o razón social, tipo y número de identificación, fecha de nacimiento, estado civil, género, celular, teléfono fijo, correo, provincia, cantón y dirección, con «—» si falta. El bloque «Póliza» muestra fecha y hora de la solicitud, broker, correo APS, orden de emisión y tipo de solicitud.
- **«Editar solicitud»** (en el Resumen y en el menú; Coordinador de inspecciones, Ejecutivo comercial o Administrador):
  - Abre el formulario con los datos cargados. La identificación del asegurado queda fija y el paso 3 (riesgos) se bloquea con «Los riesgos no se editan aquí».
  - Pide un motivo de 10 caracteres o más y envía solo lo que cambió.
  - Muestra el mensaje de la base y vuelve al caso, donde el Historial dice «Editó la solicitud».
  - Fuera de coordinación queda deshabilitado con «Solo mientras el caso está en coordinación».
- **«Duplicar»:** copia personas, póliza, sucursal, ramo, lugar, riesgos y datos adicionales. En Vehículos la placa y el VIN quedan vacíos y se muestra el aviso «Duplicado del caso N: revisa los datos y completa la placa». Se guarda con `crearCaso` y «Duplicado del caso N» al inicio de las observaciones.
- **Enlace del cliente:** WhatsApp, SMS y Correo son casillas de selección múltiple (al menos una), cada una con su disponibilidad y el motivo si no está. «Enviar a» muestra el correo para Correo y el número para WhatsApp y SMS. La vista previa tiene una pestaña por canal.
- **Menú de Administración:** nueva entrada «Portal del cliente».

**Prueba cruzada**

Lo que llega a la base (conexión simulada):

| Envío | Antes | Ahora |
|---|---|---|
| `crearCaso` (cxnuevaveh, mismo solicitante) | asegurado: identificación, nombre, provincia, cantón, dirección, contacto | Lo mismo, más nombres, apellidos y `poliza` {fechaSolicitud, broker, correoAps, tipoSolicitud}; sin `solicitante`; sin `ordenEmision` porque está vacía |
| `crearCaso` (duplicado de 50060, solicitante distinto) | Se perdía el solicitante | `solicitante` completo (nacimiento, estado civil, género, fijo…), asegurado con RUC, `observaciones: «Duplicado del caso 50060»`, placa nueva PDH2240 |
| `editarSolicitud` (50060) | No existía | `{ caso, cambios: { asegurado (sin identificación), solicitante }, motivo }`; solo los bloques que cambiaron |
| `enviarEnlace` de autoinspección con tres canales | `canal: 'WhatsApp'`, `destinatario {…}` | `canales: [WhatsApp, SMS, Correo]`, `destinoTipo`, `destinoNombre`, `destinoCorreo`, `destinoNumero` |
| `enviarEnlace` de autoagendamiento con un canal (al chofer) | `canal`, `destinatario` | `canales: [WhatsApp]`, `destinoTipo: otro`, `destinoNumero`, `destinoRelacion: Chofer`, sin correo |

En la pantalla:

- El caso nuevo duplicado (50061) muestra en el Resumen los dos bloques y «Renovación».
- Tras editar 50060, el Resumen trae la dirección nueva y el Historial «Editó la solicitud · asegurado, solicitante · Motivo: …».
- Sin conexión, editar 20152 cambia el tipo de solicitud en el Resumen y deja el evento en el Historial.

**Verificado**

- Las seis escenas a 1280×720 y 1920×1080, sin desplazamiento horizontal.
- «Editar solicitud» sin motivo muestra el error. Con motivo guarda, vuelve al caso y deja el evento en el Historial, con y sin conexión.
- En 50059 «Agendado», el botón y el menú están deshabilitados con su motivo.
- «Duplicar» exige la placa en el paso 3 antes de registrar.
- La vista previa cambia por canal: Correo agrega el asunto. La carta y el aviso de la autoinspección enviada dicen «Enviado por WhatsApp, SMS y Correo».
- Administración › Portal del cliente abre la pantalla de las pestañas Apariencias…Agenda.
- **Regresión contra la versión anterior (texto visible):** en Nueva solicitud, `ns2`, `ns3v`, `ns3g` y `cxnuevarg` salen iguales. En `ns1g`, `ns4`, `nsbpm`, `cxnuevaveh` y `cxnuevaramos` solo cambia la fecha de la solicitud (ya no es la fija «16/10/26 · 13:40»). En los enlaces por un canal, `enlacesincorreo` y `cxvisitaenlace` salen iguales; `enlaceagenda` cambia solo el token aleatorio. En `coordautoinsp`, `envioenlace`, `coordenlaceauto` y `coordcontacto` solo se suman las casillas de canales, la disponibilidad y las pestañas de la vista previa. El Resumen sin solicitante distinto (20196) mantiene un solo bloque, con los campos nuevos en «—».
- `sirius-conexion.js` sigue en 70 bytes. El catálogo tiene 796 escenas.

**No verificado**

- Firefox y Safari.
- La base real: probé contra la base simulada con la forma del contrato (SQL 72 y SQL 73).
- La reconversión de la provincia y el cantón cuando la base los manda como nombre y no como código. El Resumen acepta las dos formas; el formulario de edición usa el nombre.

**Diferencias**

- La fecha y hora de la solicitud ya no es la fija de la demostración: con la conexión es la hora real de Ecuador; sin ella, el reloj del prototipo. Al editar se conserva la del caso.
- Si el caso no trae nombres y apellidos por separado (casos de ejemplo), el formulario de edición los parte del nombre completo: las dos últimas palabras son apellidos.
- En la edición no aparecen los datos adicionales (no son parte de `editarSolicitud`). En el duplicado se copian los del caso; los del vehículo se vuelven a pedir.
- En una base simulada, `crearCaso` ahora responde en todas las escenas conectadas, para que «Duplicar» se pueda probar desde 50059 y 50060. Al editar, desmarcar «El asegurado es el mismo solicitante» deja al asegurado con su identificación y pide los datos del solicitante.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `solcompleta` | 20152 con Solicitante y Asegurado distintos, todos los datos y «Póliza» |
| `soleditar` | «Editar solicitud» de 20152 con la identificación fija (`?fpaso=4`: el motivo pendiente) |
| `soleditarfuera` | 50059 «Agendado» con conexión simulada: «Editar solicitud» deshabilitado y el menú abierto |
| `solduplicar` | Duplicado de 20196 con el aviso y los vehículos sin placa |
| `enlacecanales` | Enlace de autoinspección con los tres canales y la vista previa por canal (`?fenviar=1` envía) |
| `solcx` | 50060 con los datos del contrato: asegurado con RUC, solicitante distinto y póliza |

También abrí `cxnuevaveh`, `coordenlaceauto`, `coordvis` y `nsmarca` para la regresión.

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (sección «Solicitud completa, editar, duplicar y enlace por varios canales»).

Tiempo de la etapa: inicio 21/11/2026 01:15 · fin 21/11/2026 02:00 · 45 min

---

## 18/10/2026 · 20:30 — Etapa G-4

Publiqué la versión 351 de SIRIUS (los archivos subieron en la 350; esta versión cierra el registro con el tiempo de la etapa). La pestaña Coordinación ya se ve en cartas, como en la maqueta: una pila por riesgo (o por visita), con la visita vigente arriba y las anteriores detrás. Las anteriores se despliegan en una línea de tiempo y «Volver a apilar» las recoge. El estado de cada carta es el de la visita (G-3e) y sus acciones son las de siempre. Cuatro decisiones mías están en **Diferencias**.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| Coordinación › «Visitas del caso» | La grilla de tarjetas pasa a `SiriusCoordCartas` (nuevo `sirius-coordcartas.js`). `cartaDe` arma cada carta con el mismo estado y las mismas acciones de la tarjeta. |
| Coordinación › acciones | «Ver en Agenda» en las agendadas; «Copiar enlace» pasa a la fila Enlace; «En curso por el cliente» con Reenviar enlace y Cancelar visita. |
| Back-office | `verAgenda` → Agenda › Día con la fecha y el inspector; «Reagendada» y «Enlace caducado» en `cxEstadoVisita`; `hist`, `avance` y canales del enlace en `cxVisitasBase`; 4 escenas. |
| Estado nuevo «Reagendada» | Cerrada en la regla del estado (`sirius-coordestado.js`), en la Agenda (`sirius-agenda.js`, `Agenda.dc.html`, `agendaVisitas`, Agenda conectada) y en los filtros de visitas abiertas del Back-office y de Coordinación. |
| Base simulada (`datos-cx-coordinacion.js`) | Caso 50054 de la maqueta; `reenviarEnlace` acepta un enlace «En curso». |
| Sin cambios | Coordinar visita (fases), cabecera y franja del caso, bandeja, Agenda (salvo «Reagendada»), portal, `sirius-conexion.js`. |

**Qué cambió**

- **Barra:** «Agrupar por» Riesgo (por defecto) o Visita, filtros «Todos N» y uno por riesgo, y el botón principal «Coordinar visita».
- **Pila:** una por riesgo, con el título del riesgo. Agrupado por visita, los riesgos con la misma visita vigente van en una sola pila («V4 · Presencial · PBA4521…»).
- **Carta de arriba:** muestra V4, la modalidad, el estado real, el origen («Por el cliente · agenda fija / red») y la fecha y hora en grande. Debajo van Lugar (ciudad · zona · dirección y su origen), Inspector (con su tipo), Recibe y Enlace (estado, canales, vencimiento y «Copiar enlace»).
- **Acciones de la carta:** Reagendar, Cambiar inspector, Ver en Agenda y «Cancelar visita…» con motivo. Las visitas «Por agendar», «Buscando inspector», con oferta o con enlace conservan sus acciones de siempre.
- **Anteriores:** asoman hasta dos capas detrás y el botón «N visitas anteriores» las despliega. Desplegadas, se ven de la más nueva a la más antigua en una línea de tiempo. Cada una es un botón que abre su resumen (estado, fecha, motivo y quién), sin acciones ni enlaces. «Volver a apilar» las recoge y devuelve el foco al botón.
- **Sin anteriores o sin visita:** «Sin visitas anteriores.» o la carta «Sin visita» con «Coordinar visita».
- **Teclado:** cartas, filtros y botones se recorren con Tab; «Agrupar por» es un grupo de opciones con flechas. El estado siempre va con texto y un punto, no solo con color.

**Prueba cruzada**

Cada visita conserva su estado y sus acciones con las cartas. Comparé la versión anterior y la nueva en 17 escenas de Coordinación, 33 visitas.

| Visitas | Estado | Acciones |
|---|---|---|
| Agendadas (19) | Igual | Igual, más «Ver en Agenda» |
| Oferta enviada (3) | Igual | Igual (Anular oferta) |
| Enlace enviado, autoinspección enviada, enlace abierto (3) | Igual | Igual; con la base, «Copiar enlace» pasa de botón a la fila Enlace |
| En curso (4) | Igual | Igual (Cambiar inspector; portal y enlace en la autoinspección) |
| Realizada (1) | Igual | Igual (Ver informe) |
| Canceladas (3) | Igual | Sin acciones, ahora detrás como anteriores |

En `coordcartascx` probé las acciones contra la base simulada:

| Acción | Qué se envió o abrió |
|---|---|
| «Cancelar visita…» de V4 | `cancelarVisita { caso: 50054, visita: 4, modalidad: Presencial, motivo }`. La V4 pasa detrás, la pila queda «Sin visita» y muestra 4 anteriores. |
| Reenviar enlace de V5 | `reenviarEnlace { visita: 5, tipo: Autoinspección, canal: Correo }` |
| Ver en Agenda | Agenda › Día del viernes 27/11 con Mauricio Endara y la V4 a las 15:00 (la V3 reagendada no aparece; carga 1 de 6) |

Sin conexión (20196), Ver en Agenda lleva al martes 20/10 con Marco Tapia, con 1 de 6 de carga.

**Verificado**

- Las cuatro escenas a 1280×720 y 1920×1080, sin desplazamiento horizontal.
- `coordcartascx` coincide con la maqueta (pantallas 1 y 2): V4 «Viernes 27/11 · 15:00 a 15:45», enlace «Abierto por el cliente · enviado por WhatsApp y correo · vence 30/11 · Copiar enlace» y V5 «En curso por el cliente · 5 de 9 fotos». Desplegadas: V3 «Reagendada → V4», V2 «Presencial · Riobamba · pedida a la red · Cancelada» y V1 «Enlace de autoagendamiento · Enlace caducado».
- Coordinar visita desde la carta: Reagendar, Cambiar inspector y «Coordinar visita» de la barra (con conexión), y «Coordinar visita» de la carta «Sin visita», Reagendar y Ver en Agenda (sin conexión). Todos abren lo que corresponde.
- Teclado: Tab recorre Riesgo › filtros › Coordinar visita › carta V4 › Copiar enlace › sus acciones › «3 visitas anteriores» › carta V5. Al desplegar, el foco va a «Volver a apilar» y vuelve al botón al apilar. Las flechas cambian «Agrupar por».
- Regresión de las escenas de Coordinación (agendada `coordvis`, `cabeceraver`, `coordagendada`; oferta `estadooferta`, `cxvisitacliente`; autoinspección `enlaceciclo`, `cxvisitaenlace`; enlace abierto `cxvisclienteagendada`; multirriesgo `cabeceracoordinar`, `cxcabecera`, `coordagrupartodos`): estado y acciones iguales.
- La cabecera y la franja de `cxestadofases`, `cabeceraver` y `cxcabecera` salen iguales que antes. Las Agendas `cxagenda`, `agendamover`, `agendadia`, `agendaok` y `cxagendamover`, y `riesgosestados`, `bandejaexp` e `inicio`, también.
- `sirius-conexion.js` sigue en 70 bytes. El catálogo tiene 790 escenas.

**No verificado**

- `envioenlace` abre el caso sin visitas: no comparé la carta después de enviar el enlace.
- Firefox y Safari.
- Que la base real envíe «Reagendada», `reemplazadaPor`, `canceladoPor`, `canceladoEn`, `motivoReagenda`, `reagendadaEn`, `reemplazoEn` y `avance`. Son los campos que lee la carta; sin ellos, el resumen de una anterior muestra lo que haya (estado, fecha, motivo de cancelación).

**Diferencias**

- La escena sin conexión usa el caso de ejemplo 20196, que tiene 3 vehículos, no 2. El tercero muestra la carta «Sin visita», que también pide la etapa. La maqueta con 2 vehículos (Martina Cordero) es `coordcartascx`.
- La autoinspección del segundo vehículo es V5, no V1: el número de visita es único en el caso.
- A 1280×720, las cuatro acciones de la carta agendada ocupan dos líneas; a 1920×1080 caben en una.
- Un enlace caducado solo es la carta de arriba si es la visita más nueva del riesgo. Si el riesgo tuviera otra visita abierta, se muestra aparte con sus acciones, no detrás. «Reagendada» es una visita cerrada en todas partes (Agenda, estado del riesgo, filtros) y un enlace caducado no impide reagendar.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `coordcartas` | 20196 sin conexión: PBA4521 con la V4 arriba y 3 anteriores detrás, GSE1098 con la autoinspección en curso y el tercero «Sin visita» |
| `coordcartashist` | Las anteriores de PBA4521 desplegadas en línea de tiempo, con «Volver a apilar» (?fsel=V3 abre su resumen) |
| `coordcartasvisita` | La pestaña agrupada por visita |
| `coordcartascx` | 50054 con la conexión simulada, como la maqueta (?fhist=1 despliega las anteriores) |

También abrí `coordvis`, `estadooferta`, `enlaceciclo`, `cabeceracoordinar`, `cxvisclienteagendada`, `cxcancelarvisitanumero`, `cxvisitacliente`, `coordcancelavisitas`, `coordrg` y `cxagenda` para la regresión.

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (sección «Pestaña Coordinación en cartas»).

Tiempo de la etapa: inicio 21/11/2026 00:31 · fin 21/11/2026 01:04 · 33 min

---

## 18/10/2026 · 20:30 — Etapa R-4

Publiqué la versión 349 de SIRIUS (los archivos subieron en la 348; esta versión cierra el registro con el tiempo de la etapa). En Usuarios, la ficha de un inspector ya no deja editar su cobertura ni su jornada: muestra la tarjeta «Operación (solo lectura)» con lo que dice la Red de inspectores y el botón «Abrir en Red de inspectores». Tipo, agencia y honorarios siguen editables. En Administración › Portal del cliente hay una pestaña «Agenda» con los tres plazos editables. Cuatro decisiones mías están en **Diferencias**.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| Usuarios › ficha (`sirius-usuarios-ficha.js`) | Se quitan «Cobertura y zonas», «Jornada» y los campos «Modalidades que hace», «Ramos» y «Recibe ofertas»; entra `operacionCard`; «Inspección» pasa a «Vínculo: tipo y agencia»; el alcance de quien solo es Inspector dice «no aplica» |
| Usuarios › guardar y crear (`Usuarios.dc.html`) | `ufCambiosCx`, `ufGuardar` y `ufCrear` ya no envían cobertura, jornada, modalidades, ramos ni «recibe ofertas» |
| Red de inspectores (`sirius-red.js`) | `operacionDe(nombre)` entrega el resumen para la ficha; la Red se abre con una persona elegida |
| Back-office | `confIr` acepta `{ red: nombre }`; las escenas nuevas están en `KNOWN_ESC` |
| Portal del cliente (`sirius-portal-cliente.js`, `datos-portal-cliente.js`) | Pestaña «Agenda» con tres campos numéricos, motivo e Historial; valores vigentes en `agenda.*` |
| Portal del cliente › lógica (`sirius-portal-caso.js`) | `ANTICIPA()` y `RED_ANTES()` leen los números; el texto queda de respaldo |
| Versiones | `datos-usuarios.js` 1.7 y `datos-portal-cliente.js` 1.4 (DEC-262: por encima de la publicada en la base) |
| Sin cambios | Red › Por inspector (sus tablas y su barra), Agenda, Coordinación, honorarios, `sirius-conexion.js` |

**Qué cambió**

- Ficha de un inspector: la tarjeta «Operación (solo lectura)» tiene fondo teal claro, el título a la izquierda, el botón principal «Abrir en Red de inspectores» a la derecha y la lista Cobertura, Modalidades y ramos, Recibe ofertas y Jornada («Lunes a sábado, 08:00 a 18:00 · capacidad 6 por día»). Al pie: «La gestiona el negocio (permiso “Gestionar la red de inspectores”). Desde aquí no se edita.» Los datos salen de `SIRIUS_CONEXION.red`; sin conexión, de `SIRIUS_RED`.
- «Vínculo: tipo y agencia»: Tipo de inspector, Agencia y Honorarios, con la nota «Se queda en Usuarios: el tipo y la agencia deciden qué datos puede ver y cómo se le paga».
- Un usuario que solo es Inspector ve «Alcance de trabajo: no aplica. Ve los casos de sus visitas.»
- «Abrir en Red de inspectores» abre Red de inspectores › Por inspector con esa persona elegida.
- Al guardar la ficha ya no se envían cobertura, jornada, modalidades, ramos ni «recibe ofertas».
- Portal del cliente › Agenda: «Plazo para cambiar o cancelar la cita» (1 a 24 horas hábiles), «Anticipación para confirmación inmediata» (30 a 480 minutos) y «Anticipación para pedir a la red» (1 a 24 horas hábiles), cada uno con su explicación, su rango y su campo. Se publican con motivo y quedan en «Historial de Agenda».
- Versiones de configuración: `datos-usuarios.js` pasa a 1.7 y `datos-portal-cliente.js` a 1.4.

**Prueba cruzada**

Lo que se envía al guardar la ficha de un inspector:

| Cambio hecho en la ficha | Antes | Ahora |
|---|---|---|
| Alexandre Abascal: tipo Agencia y agencia Eurosurvey (`cxusrcobertura`) | `tipo`, `agencia`, `cobertura`, `tipoInspector`, `agenciaRuc` | `tipo`, `agencia`, `tipoInspector`, `agenciaRuc` (sin `cobertura`) |
| Sofía Arteaga: celular | — (escena nueva) | `{ celular }` |
| Sofía Arteaga: agencia | — | `{ agencia, agenciaRuc }` |

La ficha ya no tiene campos de cobertura, jornada, modalidades, ramos ni «recibe ofertas», así que esas claves no pueden salir en ningún guardado ni alta.

Lo que ve el cliente en el portal (caso con horarios, mismos datos, solo cambian los tres números):

| Plazo | Valor | Horarios inmediatos | Horarios por la red |
|---|---|---|---|
| Vigentes | 4 h hábiles · 120 min · 4 h hábiles | 118 | 18 |
| Publicados en la prueba | 8 h hábiles · 480 min · 12 h hábiles | 109 | 9 |

El plazo para cambiar o cancelar pasó de 4 a 8 horas hábiles. Con los valores vigentes, las 16 escenas del portal y de formularios salen idénticas a antes.

**Verificado**

- `usfichaoperacion` y `portalplazos` a 1280×720 y 1920×1080, sin desplazamiento horizontal. La ficha de Sofía Arteaga muestra «Sucursal Quito · Riobamba (ciudad completa)», «Presencial, Virtual guiada · Vehículos, Ramos Generales», «De Coordinación y de la red» y «Lunes a sábado, 08:00 a 18:00 · capacidad 6 por día».
- «Abrir en Red de inspectores» abre Red › Por inspector con Sofía Arteaga elegida.
- Portal › Agenda: 30 horas hábiles, 20 minutos y 0 horas dan el mensaje de rango; con 6, 90 y 8 y un motivo se publica la versión 2, el portal lee los tres números y los textos explicativos de la agenda pasan a «90 minutos», «8 horas hábiles» y «6 h hábiles».
- Regresión contra la versión anterior (texto visible, 1280×720): ficha de un usuario interno sin rol Inspector (`usrfichanoinsp`), `usrlista`, `cargatardia`, `cxreinvitar`, `usuariosuspender`, `roles`, `roleseditar`, `agencias`, `cxusuarios`, `cxusuarioeditar`, `usmenuabajo`, `redlistalarga`, `rolescomparar`, `monitorpermiso` y `cxagenciasinspectores` salen iguales. Cambian solo las fichas de inspector y el alta (`usrnuevo`, `usrduplicado`, `cxusuariocrear`, `cxmaestros`), donde las secciones de cobertura, jornada y ofertas pasan a la tarjeta de solo lectura.
- El alta con rol Inspector (`usrnuevo`) muestra la tarjeta sin botón y la ficha de un usuario interno sin rol Inspector se ve igual que antes. No guardé un alta nueva en esta etapa.
- `sirius-conexion.js` sigue en 70 bytes. Catálogo: 786 escenas.

**No verificado**

- El botón «Abrir en Red de inspectores» deshabilitado para un rol sin el permiso: lo comprobé en el código (`onRed` solo se pasa con `SiriusUsuarios.puede(rol, 'red')`), pero no abrí la ficha con un rol sin ese permiso.
- La versión que la base tiene publicada de `datos-portal-cliente.js` y de `datos-usuarios.js`: no la conozco desde el prototipo; los archivos publicados traían 1.5 y 1.2, y subí a 1.7 (el ejemplo de DEC-262) y 1.4, por encima de esos. Si la base ya publicó una versión mayor, hay que subirlas otra vez.
- La Red solo está simulada en `usfichaoperacion`; con la conexión real, el formato de `SIRIUS_CONEXION.red` es el que ya usa la Red de inspectores.
- Firefox y Safari.

**Diferencias**

- El resumen de cobertura de la ficha se escribe con «(ciudad completa)» en cada ciudad entera («Sucursal Quito · Riobamba (ciudad completa)»), como en tu ejemplo; el resumen corto de la Red usa «toda la ciudad» solo cuando hay una sola fila.
- Los inspectores que la Red no tiene (por ejemplo, en las escenas con conexión simulada sin `red`) muestran «La red de inspectores todavía no tiene la operación de este inspector. Se define en Red de inspectores.» en lugar de datos inventados.
- Al publicar los plazos también actualizo los textos explicativos de la agenda (`horarios`, `red.plazo` y `cambiar.nota`) para que no digan otro número que los campos.
- En el alta de un usuario la tarjeta no lleva botón (no hay a quién abrir en la Red todavía) y explica que la operación se asigna en Red de inspectores cuando el usuario ya existe.
- Reescribí las descripciones de `usrficha`, `usrsinguardar`, `cxusrcobertura`, `cobertura`, `coberturasucursales`, `coberturazonainactiva` y `cxcobertura`, porque esas escenas ya no editan la cobertura.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `usfichaoperacion` | Ficha de Sofía Arteaga (cobertura mixta, conexión simulada): «Vínculo: tipo y agencia» editable y «Operación (solo lectura)» con «Abrir en Red de inspectores» |
| `portalplazos` | Portal del cliente › Agenda con los tres plazos y un cambio sin publicar en cada uno (6 h hábiles, 90 min, 8 h hábiles) y la barra «3 cambios sin publicar» con motivo |

También abrí `usrficha`, `usrsinguardar`, `cxusrcobertura`, `cobertura`, `coberturazonainactiva`, `usrfichanoinsp` y `usrnuevo` para comprobar el cambio y la regresión.

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (sección «La operación del inspector en solo lectura y los plazos del portal editables»).

Tiempo de la etapa: inicio 20/11/2026 22:28 · fin 20/11/2026 23:05 · 37 min

---

## 18/10/2026 · 20:30 — Etapa G-3e

Publiqué la versión 346 de SIRIUS (los archivos subieron en la 345; esta versión cierra el registro con el tiempo de la etapa). Coordinación ya muestra el estado real de la visita: una visita que agendó el cliente se ve «Agendada», con fecha, hora, inspector y sus acciones, aunque su enlace siga abierto. La cabecera del caso ya no dice «Autoinspección en curso» sin autoinspección, y la lista de la Red de inspectores se desplaza por su cuenta. Tres decisiones mías están en **Diferencias**.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| Back-office › `cxVisitasBase` | La regla del estado de la tarjeta revisaba primero el enlace («en curso» → «En curso por el cliente») y después la visita. Ahora hay una sola función, `cxEstadoVisita`, donde manda el estado de la visita |
| Coordinación › tarjeta de visita | Acepta «Enlace abierto por el cliente» (tono neutral, acciones del enlace) y muestra Reagendar, Cambiar inspector y Cancelar visita en las «Agendada» del cliente |
| Cabecera del caso (`withR`, `caseById`) | `cxSubReal` quita «Autoinspección en curso» si no hay una autoinspección en curso |
| Red de inspectores › Por inspector | Lista y ficha con desplazamiento propio, alto de la ventana, posición conservada y teclado |
| Sin cambios | Autoinspección (enviada y en curso), ofertas, Cerrada sin inspección, Agenda, Portal del cliente, `sirius-conexion.js` |

**Qué cambió**

- Estado de la tarjeta: Agendada, En camino, En curso, Por sincronizar, Buscando inspector, Sin respuesta, Realizada y Cancelada se muestran como son, con sus datos y acciones, también si la agendó el cliente.
- «En curso por el cliente» solo sale de un enlace de Autoinspección en uso. Un enlace de Autoagendamiento abierto en una visita «Por agendar» es «Enlace abierto por el cliente» (neutral).
- Cabecera del caso: «Autoinspección en curso» solo si hay una visita de autoinspección en curso.
- Red › Por inspector: la lista y la ficha tienen desplazamiento vertical propio, barra visible y alto máximo igual al de la ventana disponible. Elegir a alguien no mueve la lista; ↑ ↓ Inicio Fin y Tab la recorren.

**Prueba cruzada** (6 estados de enlace × 10 estados de visita = 60 combinaciones, antes y ahora)

| Enlace | Visita | Antes | Ahora |
|---|---|---|---|
| Autoagendamiento en curso | Por agendar | En curso por el cliente | Enlace abierto por el cliente |
| Autoagendamiento en curso | Agendada, En camino, En curso, Por sincronizar, Buscando inspector, Sin respuesta | En curso por el cliente | El estado de la visita |
| Autoagendamiento vigente | Agendada, En camino, En curso, Por sincronizar, Buscando inspector, Sin respuesta | Enlace enviado | El estado de la visita |
| Autoinspección (vigente, en curso, vencido) | Todos | — | Sin cambios (0 de 30) |
| Sin enlace; visitas Realizada, Cancelada, Cerrada | Todos | — | Sin cambios |

Cambian 13 de 60, todas con enlace de Autoagendamiento. Filtro del subestado: 8 de 8 casos correctos.

**Verificado**

- `cxvisclienteagendada` a 1280×720 y 1920×1080: V1 «Agendada», cita 21/10/26 · 10:00, Mauricio Endara, enlace y las tres acciones; V2 «Enlace abierto por el cliente»; cabecera «Agendado». Reagendar abre el panel con la cita y Cancelar visita pide el motivo.
- `redlistalarga` a 1280×720 y 1920×1080: 30 inspectores; lista y ficha con barra visible y alto 419 px (1280×720) y 779 px (1920×1080); al desplazar la lista a 600 px y elegir a Karina Zurita la posición queda en 600; ↑ ↓ Inicio Fin recorren la lista y Tab pasa a la ficha.
- Regresión contra la versión anterior (texto visible, 1280×720): cxvisitaenlace, cxvisitacancelar, cxcancelarvisitanumero, cxnumerocruce, cxvisitacliente, redcx, redsincob, redasignar, redoperacion, usmenuabajo, cxlimpio, envioenlace y red, 13 de 13 iguales.
- `sirius-conexion.js` sigue en 70 bytes. Catálogo: 784 escenas.

**No verificado**

- La barra visible se comprobó en Chromium; en Firefox usa `scrollbar-width: thin` y en macOS con barras ocultas por el sistema no lo probé.
- «Cambiar la fecha» del portal con el enlace abierto de una visita agendada no se ejecutó de punta a punta en esta etapa.

**Diferencias**

- Una visita con enlace de Autoagendamiento vigente (sin abrir) y ya agendada también muestra «Agendada» en vez de «Enlace enviado»: es el mismo error de fondo y lo corrige la misma regla.
- «Enlace abierto por el cliente» usa las mismas acciones que «Enlace enviado» (Reenviar, Generar nuevo, Copiar, Cancelar visita).
- La lista y la ficha son `sticky`; con la ventana de 1280×720 la lista muestra unas cuatro filas porque el título y las pestañas ocupan la parte de arriba.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `cxvisclienteagendada` | Caso 30052 con conexión simulada: V1 agendada por el cliente con su enlace abierto y V2 «Enlace abierto por el cliente» |
| `redlistalarga` | Red de inspectores › Por inspector con 30 inspectores y desplazamiento propio |

También abrí `cxvisitacliente`, `redcx` y `usmenuabajo` para comprobar que no cambian.

Registro: `project/registro-envios.md`. Inventario: `project/inventario-proyecto.md` (sección «Estado real de la visita en Coordinación y lista de la Red con desplazamiento»).

Tiempo de la etapa: inicio 20/11/2026 20:45 · fin 20/11/2026 21:01 · 16 min

---

## 18/10/2026 · 20:30 — Etapa U-6

Publiqué la versión 342 de SIRIUS (los archivos subieron en la 341; esta versión cierra el registro con el tiempo de la etapa). El menú «…» de fila ya no se recorta: se dibuja en una capa flotante sobre la página, con un solo componente (`sirius-menu-fila.js`) que usan todas las tablas. Tres decisiones mías están en **Diferencias**: Agencias y Roles hoy no tienen menú «…», las acciones bloqueadas muestran su motivo debajo y la escena usa los datos de ejemplo.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué cambia |
|---|---|
| Usuarios › Usuarios (`Lista`, la de la captura) | El menú se abría dentro del contenedor con desplazamiento de la tabla (`overflow:auto`) y se recortaba. Ahora usa el componente compartido |
| DataTable (Campos personalizados, Flujo, Notificaciones, Catálogos › Grupos, Formularios, Motores de IA, Documentos base, Conexiones, Documento PDF y las demás) | Ya era `position:fixed`, pero con su propia copia de la posición (estimaba la altura) y del teclado. Pasa al componente compartido |
| Calificación › tabla de garantías | Tenía otro menú absoluto dentro de la tabla, que ni cerraba con Esc. Pasa al componente compartido |
| Agencias y Roles | No tienen menú «…» hoy (Agencias: Ver ficha, Editar y Subir logo como botones; Roles es un rol a la vez). Si una acción suya pasa a `menu: true`, usa el componente sin tocar nada |
| Menús de cabecera (Más acciones del caso, del informe, del catálogo y del motor) | No son de fila: sin cambios |
| Back-office | Carga `sirius-menu-fila.js` y registra la escena `usmenuabajo` |
| `sirius-conexion.js` | Sin cambios: 70 bytes |

**Qué cambió**
- **Componente único (`sirius-menu-fila.js`):** `SiriusMenuFila.abrir(...)` (sin React, lo usa DataTable) y `SiriusMenuFila.Boton` (React, lo usan Usuarios y Garantías). El menú vive en `document.body`, con `position:fixed` y z-index 1400, por encima de la tabla y de su desplazamiento.
- **Posición desde el botón:** abre hacia abajo si cabe; si no, hacia arriba; si no cabe en ninguno, hacia donde haya más espacio, con desplazamiento dentro del menú. Queda alineado al borde derecho del botón y a 8 px del borde de la ventana. El ancho va de 220 a 340 px.
- **Foco y teclado:** al abrir, el foco va a la primera acción disponible. ↑ ↓ (circulares), Inicio y Fin recorren. Esc y Tab cierran y devuelven el foco al botón. Clic fuera, desplazar la página y cambiar el tamaño cierran sin mover el foco. El clic del botón alterna y solo hay un menú abierto.
- **Acciones bloqueadas:** llevan su motivo (visible debajo y en `title`), quedan `aria-disabled` y no se ejecutan.
- **Código quitado:** la plantilla y la posición del menú en DataTable, el estado y el CSS `.uf-menu` de Usuarios, y `cgMenu` y `.cg-menu` de Garantías.
- **Escena nueva `usmenuabajo`:** Usuarios con el filtro «ga» (tres filas) y el menú de la última fila abierto.

**Prueba cruzada**

| Comprobación | Resultado |
|---|---|
| Acciones de cada menú, antes y después, en 13 pantallas con «…» (todas las filas) | 117 menús y 283 acciones idénticas (texto, bloqueada y motivo). Única diferencia: los 9 menús de Garantías ahora tienen nombre accesible («Más acciones de …»); antes no |
| Cálculo de la posición con 5 casos (cabe abajo, solo cabe arriba, no cabe en ninguno, borde izquierdo, borde derecho) | Los 5 con el resultado esperado |
| ¿Queda otra implementación de menú de fila? | No: los únicos `role="menu"` restantes son los 4 menús de cabecera |
| Texto visible antes y después en 15 pantallas (1280 × 720) y 8 (1920 × 1080) | 15 de 15 y 8 de 8 iguales |

**Verificado**
- **`usmenuabajo`, a 1280 × 720 y a 1920 × 1080:** el menú completo dentro de la ventana, sin desplazamiento lateral y con el foco en «Abrir ficha».
- **Hacia arriba:** con la ventana a 560 y a 480 px de alto, el menú de la última fila abre hacia arriba y se ve completo.
- **Menú de la primera fila (Usuarios), en ambos tamaños:** 23 de 23 comprobaciones.
  - Posición: completo en la ventana.
  - Teclado: flechas, Inicio, Fin, Esc, Tab y el foco devuelto al botón.
  - Cierre y apertura: clic fuera, el botón que alterna, un solo menú abierto, desplazar la página y «Abrir ficha» que abre la ficha.
- **Otras tablas:** el primer y el último «…» de 13 pantallas, a 1280 × 720 y a 1920 × 1080, 26 de 26 en cada tamaño. Cada uno se ve completo y visible de verdad (comprobado con `elementFromPoint`), `aria-expanded` correcto, Esc cierra y el foco vuelve.
- **Acciones:** 9 de 9. En Garantías, «Quitar con motivo» abre el cuadro y «Ver historial» cambia a «Ocultar historial». En Flujo, «Ver casos» cierra el menú y actúa. En Usuarios, una acción bloqueada no cierra ni ejecuta, y su motivo se ve.
- **Sin errores de consola** en ninguna de las pantallas probadas. `sirius-conexion.js` en 70 bytes.

**No verificado**
- **Otros navegadores y lector de pantalla:** probé en Chromium; no en Safari ni Firefox, y los roles (`menu`, `menuitem`, `aria-expanded`, `aria-disabled`) los comprobé por atributo, no con un lector.
- **Pantallas táctiles:** arrastrar la página cierra el menú (igual que desplazar con la rueda); no lo probé con un dedo.
- **Datos de la base real:** la escena usa los datos de ejemplo. No probé con la base real de Supabase.

**Diferencias**
- **Datos de la escena:** con el filtro «ga» salen Gabriela Toapanta, Carolina Vega y Sofía Arteaga (datos de ejemplo), no Gabriela Suárez ni Gabriela Torres de la captura (esos son de la base real). Son tres filas y el menú de la última queda abierto, como se pidió.
- **Agencias y Roles:** hoy no tienen menú «…», así que no hay nada que cambiarles. Quedan cubiertos porque usan DataTable.
- **Motivo de la acción bloqueada:** ahora se ve debajo de la acción, también en Usuarios y Garantías (antes solo en el tooltip). Por eso el menú puede llegar a 340 px de ancho.
- **Garantías:** el menú ahora cierra con Esc y con clic fuera, y tiene nombre accesible.
- **Desplazar la página cierra el menú**, en lugar de dejarlo flotando lejos del botón.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `usmenuabajo` | Usuarios con el filtro «ga» (tres filas) y el menú de la última fila abierto: Abrir ficha, Volver a invitar, Cambiar estado… e Inactivar…, completo sobre la página |

También abrí `usrlista` (menú de la primera fila), `usrficha`, `roles`, `cxagenciasinspectores`, `cpers`, `flujo`, `notifreglas`, `grupos`, `form`, `motoresvl`, `iadocs`, `iacnx`, `dpdocs`, `calgarrg`, `calgarnivel2`, `usuarios`, `agendaok`, `zonas` y `catalogos`.

La respuesta quedó en `project/registro-envios.md` y el inventario en `project/inventario-proyecto.md` (archivo nuevo, filas de los archivos tocados, componente compartido, escena y una sección nueva).

Tiempo de la etapa: inicio 20/11/2026 00:21 · fin 20/11/2026 00:57 · 36 min

---

## 18/10/2026 · 20:30 — Etapa R-3a

Publiqué la versión 340 de SIRIUS (los archivos subieron en la 339; esta versión cierra el registro con el tiempo de la etapa). Ya existe el menú «Red de inspectores» (después de Agenda) con la vista «Por inspector», según la maqueta aprobada (DEC-262). Lo ven el Administrador y el Coordinador de inspecciones, que tienen la acción nueva «Gestionar la red de inspectores». La cobertura, la operación, la jornada y los bloqueos de cada inspector se leen y se guardan solo ahí: con la conexión, en `SIRIUS_CONEXION.red` y `redAccion`; sin ella, en `datos-red.js`. Por zona y Por sucursal muestran «Llega en la próxima etapa».

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Menú lateral | Agenda, Calificación… | «Red de inspectores» (ícono de ubicación) después de Agenda, solo con «Gestionar la red de inspectores». El Ejecutivo comercial y los demás roles no lo ven; el menú del Inspector y del Control de calidad no cambia |
| Matriz de permisos (`datos-usuarios.js`, `sirius-usuarios.js`) | Sin la acción | Grupo «Red de inspectores» con «Gestionar la red de inspectores» (Administrador y Coordinador, Editar) y la nota «el rol Gestor de inspecciones está pendiente de definir». Se ve en Roles y permisos |
| `SiriusCobertura.cubre` (Coordinar visita, sugerencias por cobertura, ofertas, portal) | Un modo por inspector (todas, sucursales o ciudad y zonas) | Si el usuario o inspector trae `coberturaFilas`, decide con las filas vigentes en el orden de la base. **Sin `coberturaFilas`, igual que antes** |
| `SiriusCobertura.resumen` / `corto` | Texto del modo único | Con filas, enumera todas (cobertura mixta). Sin filas, igual |
| Usuarios de la base (`sirius-usuarios-base.js`) | `norm` descartaba campos desconocidos | Conserva `coberturaFilas` y `coberturaMixta` para que `cubre` los use |
| Usuarios › ficha | — | Sin cambios visibles. `verIr` abre la ficha también sin la conexión cuando se llega desde «Ver identidad y acceso en Usuarios» |
| Ciudades y zonas | — | Sin cambios; la Red lee sus nombres y zonas activas |
| Agenda | — | Sin cambios (R-4). Sus bloqueos se ven en la Red como «Viene de la Agenda» |
| Conexión simulada (`cxSimBoot`) | Sin `redAccion` | Trae `redAccion` (escena `redcx`; `?cxok=0` responde `{ ok: false }`) |
| `sirius-conexion.js` | Línea mínima | Sin cambios (70 bytes) |

**Qué cambió**
- **Menú y permisos:** `pinIcon` y el ítem `red` en `navItems`; `SU.visible(rol, 'red')` lee el grupo «Red de inspectores» de la matriz; `isRed` monta `SiriusRedInspectores`.
- **`sirius-red.js` (nuevo):**
  - `SiriusRed` lee la red de la conexión o de la demostración y envía las acciones a `redAccion`, o a la sesión sin la conexión, siempre con motivo de 10 caracteres o más.
  - `SiriusRedInspectores` arma la cabecera, la frase de propósito y las tres pestañas.
  - Por inspector tiene lista con buscador (nombre, agencia o ciudad), filtros «Todos», «Sin cobertura» y «Solo red» (los que reciben ofertas de la red) y etiqueta «Sin cobertura».
  - La ficha muestra tipo, agencia, estado, recibe ofertas, Cobertura (tabla con nivel, ámbito, vigencia, quién asignó y motivo; las no vigentes atenuadas con «Desde dd/mm» o «Venció el dd/mm»), Operación, Jornada con el aviso de única fuente, Bloqueos e Historial.
  - Diálogos «Agregar cobertura» (nivel, sucursal, ciudad o zona activa, desde, hasta y motivo), «Quitar cobertura», «Agregar bloqueo» y «Quitar bloqueo».
  - Barra con «Motivo del cambio (obligatorio)» y «Guardar cambios» solo para la operación y la jornada; queda fija abajo mientras hay cambios sin guardar.
  - Las filas de la ficha y los bloqueos de la Agenda dicen «Viene de la ficha» y «Viene de la Agenda», sin «Quitar».
- **`datos-red.js` (nuevo):** `SIRIUS_RED` con la forma del contrato y los 10 inspectores del ejemplo.
  - Sofía Arteaga tiene cobertura mixta: sucursal Quito y Riobamba, ciudad completa.
  - Cristian Vaca y Pedro Lasso no tienen cobertura; Diana Cárdenas tiene la zona Centro desde el 01/11 (aún no rige) y Renata Cobo una fila vencida.
  - Paola Vinueza tiene una fila «Viene de la ficha» y los bloqueos de la Agenda.
  - `aplicar()` es la base simulada de `redAccion`, con sus validaciones y mensajes (motivo, sucursal, ciudad, zona activa, fechas, repetida vigente, filas de la ficha y bloqueos de la Agenda).
- **`sirius-cobertura.js` (v1.1):** `filasDe`, `filaVigente`, `cubreFilas` (todas → ciudad → zona activa → sucursal; sin zonas activas cuenta como la ciudad completa; sin zona conocida, «parcial» solo con `{ parcial: true }`), `resumenFilas`, `cortoFilas` y `ambitoTxt`.
- **Escenas:** 6 nuevas con el área «Red de inspectores» (781 en el catálogo; `KNOWN_ESC` 738).

**Prueba cruzada** (lo que muestra Por inspector = `SiriusCobertura.cubre` = la regla de la base)

| Comprobación | Resultado |
|---|---|
| 10 inspectores × 48 lugares (Quito por las zonas Norte, Centro, Sur y Valles, Riobamba, Guayaquil, Ambato y Cuenca × 6 sucursales): nivel en Por inspector, en `SiriusCobertura.cubre({ coberturaFilas })` y en una implementación independiente de la regla de la base | 480 de 480 iguales, sin conexión y con la conexión simulada |
| «Sin cobertura» de la lista contra las filas vigentes | Cristian Vaca, Pedro Lasso y Renata Cobo en los tres |
| Resumen de Sofía Arteaga en la ficha y en `SiriusCobertura.resumen` con la conexión temporal | «Atiende los casos de la sucursal Quito, estén donde estén, y cualquier lugar de Riobamba.» en ambos |
| Sofía Arteaga: sucursal Quito en Guayaquil / Riobamba con sucursal Ambato / Ambato / Quito Norte con sucursal Guayaquil | sucursal / ciudad / no cubre / no cubre |
| Zona sin zona conocida | `nivel: null` con «Falta la zona del lugar…»; «parcial» solo con `{ parcial: true }` |
| Inspector de la conexión sin `coberturaFilas` (Jorge Pazmiño) | Igual que antes: «Atiende la sucursal Ambato» |

**Verificado**
- **Escenas a 1280×720 y 1920×1080, sin desplazamiento lateral:** `red`, `redsincob`, `redasignar`, `redoperacion`, `redsinpermiso` y `redcx`.
- **Sin la conexión:**
  - Agregar una zona sin motivo dice «Escribe el motivo (mínimo 10 caracteres).»; con motivo agrega la fila y el resumen la enumera.
  - Repetirla dice «Sofía Arteaga ya tiene esa cobertura vigente.».
  - Quitar, agregar un bloqueo y cambiar la capacidad funcionan; sin motivo la barra lo pide y con motivo queda en el historial «Capacidad por día: 6 → 5».
  - Los filtros (3 sin cobertura, 3 de la red) y la búsqueda por ciudad y por agencia responden bien.
- **Con la conexión simulada:** cada acción llega a `redAccion` con la forma del contrato y la red de la conexión cambia; la fila de la ficha no tiene «Quitar». Con `?cxok=0` aparece el error de la base y nada cambia.
- **Copia aparte con una conexión temporal** (activa, no simulada):
  - La pantalla lee `SIRIUS_CONEXION.red`, sin el aviso de demostración, y el bloqueo llega a `redAccion`.
  - Con `red: null` dice «La base todavía no tiene la red de inspectores».
  - `SiriusCobertura.cubre('Sofía Arteaga', …)` usa las `coberturaFilas` de la conexión.
- **«Ver identidad y acceso en Usuarios»:** como Administrador abre la ficha de Sofía Arteaga.
- **Regresión, versión anterior contra la nueva**, texto visible sin el menú lateral:
  - A 1280×720, 27 de 27 iguales: Coordinación con sugerencias por cobertura (`lugarbuscar`, `lugarlejos`, `lugarfuera`, `lugarrg`, `cxlugar`, `cxcoordins`, `cxcoordmismo`, `coordoferta`, `coordagendada`, `cxvisitacliente`), Usuarios (`usrficha`, `usrlista`, `cobertura`, `coberturalectura`, `cxusrcobertura`, `coberturazonainactiva`, `usrsinguardar`), Agenda (`agendaok`, `agendamover`, `agendadia`, `cxagenda`, `cxagendafiltros`) y Ciudades y zonas (`zonas`, `zonasagregar`, `zonaslectura`, `ciudadesbuscar`), más `usrroles`. Las escenas de Usuarios se repitieron después de tocar `verIr`.
  - A 1920×1080, 7 de 7 iguales.
- **Sintaxis y conexión:** revisión de sintaxis de todos los archivos tocados; `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- **Base real de Supabase:** la red, `redAccion` y sus mensajes reales. La base simulada usa mensajes propios con la misma idea.
- **Refresco tras una acción con la base real:** depende de que la conexión vuelva a leer `red` (como con `suscribir`).
- **Formato de fechas y horas:** en el navegador de prueba (inglés) los campos se vieron como mm/dd/aaaa y AM/PM; en un navegador en español salen dd/mm/aaaa y 24 h.

**Diferencias con la maqueta y el pedido**
- **Inspectora mixta:** es Sofía Arteaga, una inspectora del ejemplo, y no «Gabriela Suárez», para que el enlace a Usuarios abra una ficha que existe. La lista tiene los 10 inspectores del ejemplo y no 12.
- **«Ver identidad y acceso en Usuarios»:** solo lo ve quien gestiona usuarios (Administrador). El Coordinador no puede abrir fichas de usuario, así que ve el texto «Identidad y acceso: en Usuarios y roles (los gestiona el Administrador)».
- **«Solo red»:** lo interpreté como los inspectores que reciben ofertas de la red (`recibeOfertas: 'red'`).
- **Coordinación sin la conexión:** sigue con la cobertura de siempre; la demostración de la red no la alimenta, para no cambiar Coordinación antes de R-4. Por eso Cristian Vaca sale «Sin cobertura» en la Red y en Coordinación cubre Quito como antes.
- **Barra de «Guardar cambios»:** se queda al final de la ficha cuando no hay cambios y queda fija abajo solo mientras hay cambios sin guardar.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `red` | Coordinador · Por inspector con Sofía Arteaga (cobertura mixta) |
| `redsincob` | Filtro «Sin cobertura» (3) con Cristian Vaca |
| `redasignar` | «Agregar cobertura» abierto con nivel zona y Quito |
| `redoperacion` | Capacidad 6 → 5 y jornada hasta 17:00, con el motivo pendiente |
| `redsinpermiso` | Ejecutivo comercial: el menú no aparece |
| `redcx` | Conexión simulada con la fila «Viene de la ficha» |

También abrí `roles` (Roles y permisos muestra la acción nueva con la nota del rol pendiente), `lugarbuscar`, `usrficha`, `agendaok` y `zonas`, sin cambios.

Registrado en `project/registro-envios.md`; `project/inventario-proyecto.md` con las filas de los archivos tocados y los dos nuevos, las 6 escenas y la sección «Red de inspectores › Por inspector (etapa R-3a · DEC-262)».

Tiempo de la etapa: inicio 19/11/2026 23:19 · fin 19/11/2026 23:49 · 30 min

---

## 18/10/2026 · 20:30 — Etapa G-3c

Publiqué la versión 336 de SIRIUS (los archivos subieron en la 335 y esta versión cierra el registro con el tiempo de la etapa). Con la conexión, Coordinación ya lee de `visitasBase[]` si la visita la agendó el cliente (DEC-260): la tarjeta muestra «Agendada por el cliente · agenda fija» o «· red», «Origen: cliente (GPS, mapa, dirección buscada o confirmó la de la solicitud)» y, si la oferta la pidió el cliente, «Oferta a inspectores (pedida por el cliente)». Las acciones, el orden de la tarjeta y lo que se ve sin la conexión no cambiaron.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Coordinación › tarjeta de la visita (etiqueta «Agendada por el cliente · …») | Solo la encendía el portal simulado (`porCliente`, `origenCita`); con la conexión nunca salía | Sale de `visitasBase[].origen`: `'Cliente · agenda fija'` → «· agenda fija»; `'Cliente · red'` → «· red»; `'Coordinador'` (o vacío) → sin etiqueta. Se oculta si la visita está Cancelada, como hoy |
| Coordinación › «Ciudad y zona» y «Origen: cliente (…)» | Con la conexión solo salía «Ciudad y zona»; «Origen» exigía `lugarCliente`, que solo ponía el portal simulado | Si la visita es del cliente y trae `lugar` (objeto con `ciudad`): `lugarCliente` → «Origen: cliente (GPS / mapa / dirección buscada / confirmó la de la solicitud)». Una visita del Coordinador con lugar no muestra «Origen» |
| Coordinación › «Oferta a inspectores» | Siempre «Oferta a inspectores» | «Oferta a inspectores (pedida por el cliente)» si `oferta.porCliente` es `true`; si no, igual que antes |
| Coordinación › campo «Agendada por el cliente: Desde el portal…» | Solo con el portal simulado (datos que la base no entrega: hora de agendamiento, organización, credencial) | Sin cambios para el portal; **no se agrega a las visitas de la base** (la etiqueta ya lo dice y esos datos no vienen) |
| Coordinación › franja de resumen, acciones, orden de los campos | — | Sin cambios |
| Agenda (`filasCx`, rejilla y detalle) | Lee `visitasBase[]` directo; no usa `porCliente` | Sin cambios (no necesitaba tocarse) |
| Historial | Eventos de la base (`eventos`) | Sin cambios |
| Portal del cliente simulado (G-2d) | Escribe `porCliente`, `origenCita` y `lugarCliente` en `visits` | Sin cambios |
| Sin la conexión | Visitas de ejemplo | Sin cambios |
| `sirius-conexion.js` | Línea mínima | Sin cambios (70 bytes) |

**Qué cambió**
- **`SIRIUS Back-office.dc.html`:** un solo conversor, `cxVisitasBase`, que arma todas las tarjetas de la base. Nueva función `cxPorCliente(vb)`: `'Cliente · agenda fija'` → `porCliente: true`, `origenCita: 'fija'`; `'Cliente · red'` → `porCliente: true`, `origenCita: 'red'`; en ambos, `lugarCliente: true` si `vb.lugar` es un objeto con `ciudad`. Cualquier otro origen no suma nada. La oferta de la tarjeta trae `porCliente` desde `visitasBase[].oferta.porCliente` (solo `true` vale). La escena nueva se registra en el enrutado de Coordinación y en `KNOWN_ESC` (732).
- **`Coordinacion.dc.html`:** el campo «Oferta a inspectores» suma « (pedida por el cliente)» cuando `ofe.porCliente`; el campo «Agendada por el cliente: Desde el portal…» solo se agrega a las visitas que no vienen de la base. La etiqueta y «Origen» ya existían y no se tocaron.
- **`datos-cx-coordinacion.js`:** escena nueva `cxvisitacliente` (caso 30041, conexión simulada, Coordinador): V1 «Agendada · Cliente · agenda fija» con Mauricio Endara, lugar con origen GPS en «Quito · Zona Norte»; V2 «Buscando inspector · Cliente · red» con la oferta `porCliente` a 1 inspector (Pablo Heredia) en Riobamba (dirección buscada).
- **`datos-escenas.js`:** la escena en el catálogo (775 escenas).

**Prueba cruzada** (`visitasBase[].origen`, `lugar` y `oferta.porCliente` leídos en cada lugar con la misma función)

| Dato de la base | Tarjeta (etiqueta) | «Ciudad y zona» / «Origen» | «Oferta a inspectores» | Agenda | Historial |
|---|---|---|---|---|---|
| V1 · `Cliente · agenda fija` + lugar GPS | «Agendada por el cliente · agenda fija» | «Quito · Zona Norte» / «cliente (GPS)» | — | Igual que antes | Igual que antes |
| V2 · `Cliente · red` + oferta `porCliente` | «Agendada por el cliente · red» | «Riobamba · Ciudad sin zonas» / «cliente (dirección buscada)» | «(pedida por el cliente): 1: Pablo Heredia» | Igual que antes | Igual que antes |
| `Coordinador` con lugar (caso 30042 · V1) | Sin etiqueta | «Quito · Zona Norte» / sin «Origen» | — | Igual que antes | Igual que antes |
| `Cliente · agenda fija` Cancelada (30042 · V2) | Etiqueta oculta | Sin «Origen» (no trae lugar) | — | Igual que antes | Igual que antes |

**Verificado**
- `cxvisitacliente` a 1280×720 y 1920×1080: V1 muestra «Agendada por el cliente · agenda fija», «Ciudad y zona: Quito · Zona Norte» y «Origen: cliente (GPS)»; V2 muestra «Agendada por el cliente · red» y «Oferta a inspectores (pedida por el cliente): 1: Pablo Heredia»; sin errores en la consola; las acciones de cada tarjeta son las de siempre (V1: Reagendar, Cambiar inspector, Cancelar visita; V2: Anular oferta).
- Regresión, versión anterior contra la nueva, texto completo de la pantalla a 1280×720: 29 de 29 escenas iguales (Coordinación con visitas de la base: `cxvisitaenlace`, `cxvisitacancelar`, `cxcancelarvisitanumero`, `cxnumerocruce`, `cxcoordins`, `cxcoordmismo`, `cxvisitariesgos`, `cxlugar`, `lugarbuscar`, `lugarlejos`, `lugarfuera`, `coordoferta`, `coordofertaabierta`, `coordagendada`, `coordcancelavisitas`, `cxestadoparcial`, `cxcabecera`, `coordtabresumen`, `coordenlaceauto`, `cxestadofases`, `coordagrupar`; portal G-2d: `portallugargps`, `portallugarbuscar`, `portalsinubicar`, `portalsinhorarios`, `portalrgconfirmar`, `portalautoinsplugar`; y `portalagendado`, `portalredok`).
- Copia de prueba con una conexión temporal (`activo: true`, sin `simulada`) con los casos 30041 y 30042: la tarjeta, «Origen» y la oferta salen igual que en la escena; la visita del Coordinador no lleva etiqueta; la cancelada del cliente la oculta. Pestañas Historial y Agenda de ambos casos, versión anterior contra nueva, a 1280×720 y 1920×1080: iguales.
- Revisión de sintaxis de las dos pantallas y de `datos-cx-coordinacion.js`; `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- Con la base real de Supabase: la prueba usó una conexión de prueba con la forma del contrato. Que la base entregue `origen`, `lugar` y `oferta.porCliente` como dice el contrato (SQL 46) se comprueba al conectarla.

**Diferencias**
- El campo «Agendada por el cliente: Desde el portal el …» **no** aparece en las visitas de la base: sus datos (hora de agendamiento, organización, credencial) no vienen en `visitasBase[]`. La etiqueta de arriba ya lo indica. Con el portal simulado sigue igual.
- Una visita del cliente sin `lugar` muestra la etiqueta, pero no «Origen».
- Una visita con `oferta` y estado «Buscando inspector» se muestra «Oferta enviada», como desde G-2c2.

**Escenas**

| Escena | Qué se ve |
|---|---|
| `cxvisitacliente` | Caso 30041 (Coordinador, conexión simulada): V1 agendada por el cliente en la agenda fija, con GPS en Quito · Zona Norte; V2 en la red con la oferta pedida por el cliente a 1 inspector de Riobamba |

También abrí `cxvisitaenlace`, `cxnumerocruce`, `coordoferta`, `portallugargps` y `portalagendado`, sin cambios.

Registrado en `project/registro-envios.md`; `project/inventario-proyecto.md` con las filas de los cuatro archivos, la escena y la sección «Visita agendada por el cliente con la conexión (etapa G-3c)».

Tiempo de la etapa: inicio 19/11/2026 10:48 · fin 19/11/2026 11:02 · 14 min

---

## 18/10/2026 · 20:30 — Etapa N-2e

Publiqué la versión 331 de SIRIUS. Los bloques Banner y Pie del editor de plantillas, y el logo de la configuración de envío, ahora suben su imagen al almacén público «correo» de Supabase (`subirImagenCorreo`). La plantilla guarda la dirección completa y la vista previa, «Ver correo» y la prueba enviada muestran la misma imagen.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Editor › bloques Banner y Pie | «Subir PNG o JPG» solo en pantalla (`b.img`, 1 MB); para una imagen nueva había que subirla a GitHub (`assets/correo`) y cambiar la plantilla por SQL | Con la conexión: «Subir imagen» / «Cambiar imagen» → `subirImagenCorreo`; `archivo` = la dirección completa, sin `b.img` |
| Editor › miniatura y nombre | Miniatura solo de `b.img`; el nombre era el del archivo local | Miniatura y nombre también de la dirección completa; «Quitar imagen» vuelve al logo |
| `sirius-correo-render.js` › `R.imagen` | `b.img`, o `opciones.assets` + nombre (si está en `opciones.archivos`), o el logo | `b.img`, o una dirección `https://` tal cual, o `opciones.assets` + nombre, o el logo; sigue sin navegador y lo usa también la función de envío |
| Vista previa del editor y «Ver correo» | Armaban el correo con `R.html` | Igual; ahora dibujan la imagen subida |
| «Enviar prueba a mi correo» | Armaba con la plantilla guardada | Igual; la plantilla ya trae la dirección |
| Configuración de envío › logo | Se leía de `envio.logo`, sin pantalla para cambiarlo | Sección «Logo de los correos»: subir, cambiar y quitar; se guarda con la configuración |
| `NC.envio()` | No devolvía `logo`, `assets` ni `archivos`: al guardar la configuración de envío se perdían | Los conserva |
| WhatsApp (imagen del encabezado) | Solo en pantalla | Sin cambios |
| Sin la conexión | Imagen solo en pantalla | Igual, con el aviso «Sin la conexión, la imagen se ve solo en esta pantalla: no se guarda con la plantilla.» |
| `sirius-conexion.js` | Línea mínima | Sin cambios (70 bytes) |

**Qué cambió**
- **`sirius-correo-render.js`:** `R.imagen` usa tal cual la dirección que empieza con `https://` (sin `opciones.assets` ni `opciones.archivos`); `http://` y `javascript:` no valen. Los nombres de siempre (`banner-inspeccion.jpg`, …) siguen con `opciones.assets`. Nuevo `R.esUrlImagen`.
- **Editor de plantillas:**
  - Con la conexión, el botón dice «Subir imagen» («Cambiar imagen» si ya hay una); acepta PNG, JPG, GIF o WebP hasta 2 MB y revisa tipo y peso antes de subir.
  - Mientras sube, «Subiendo…» y el botón no responde. Al terminar guarda `archivo` = `url`, quita `b.img` y mide el ancho (aviso si no son 600 px).
  - Si falla, el mensaje de la conexión queda junto al botón y la plantilla no cambia.
  - «Quitar imagen» deja el bloque sin imagen: usa el logo. La estructura de la izquierda y la miniatura muestran el nombre del archivo, no la dirección.
- **`sirius-notif-cola.js` (v1.6):** `subirImagen(archivo)` llama a `SIRIUS_CONEXION.subirImagenCorreo(archivo, nombre)` y entrega `{ ok, mensaje, url, ruta }` (un error de la base sale solo con su mensaje); `validarImagen`, `puedeSubirImagen`, `esUrlImagen` y `nombreImagen`. La **Configuración de envío** suma «Logo de los correos» (miniatura, nombre, subir o cambiar, «Quitar logo»), con la barra «cambios sin guardar» y el motivo de siempre.
- **Base simulada** (`datos-cx-notif.js`, `SIRIUS Back-office.dc.html`): la conexión simulada trae `subirImagenCorreo`. Tarda 1,2 s para ver «Subiendo…», guarda la imagen en memoria y devuelve una dirección con la forma de la real. Solo el Administrador sube; `?cxok=0` responde `{ ok: false }`; la escena de error responde «La imagen pesa más de 2 MB».

**Prueba cruzada** (`plantillasubirimagen`, «Enlace de autoinspección», caso 50013; se sube `banner600.png`, se guarda la plantilla con motivo, se envía la prueba y se abre «Ver correo» en la Bitácora)

| Dónde | Resultado |
|---|---|
| Editor, al terminar de subir | Botón «Cambiar imagen», nombre `banner600.png`, miniatura y «Quitar imagen»; «Cambios sin guardar» |
| Plantilla en memoria antes de guardar | Sin cambios (se guarda al publicar) |
| Vista previa | Imagen de 600 px, texto alternativo «Inspección de tu vehículo», huella 67902c3e |
| Plantilla guardada | Bloque 1 `banner`, `archivo` = `https://…/storage/v1/object/public/correo/…-banner600.png`, sin `b.img`, ancho 600 |
| Vista previa tras guardar | La misma huella 67902c3e |
| «Enviar prueba a mi correo» | «Prueba en la cola · Para andrea.salazar@asur.ec · Lo recibirás como Asegurado o contacto (Mónica Andrade)» |
| Bitácora › «Ver correo» de la prueba | La misma huella 67902c3e y la misma imagen (600 px) |

Los dos tamaños dan lo mismo. La simulación dibuja la imagen desde la memoria: la dirección guardada es la que va en el correo.

**Verificado (1280×720 y 1920×1080)**
- `plantillasubirimagen`: la prueba cruzada de arriba; además un `.txt` («Usa una imagen PNG, JPG, GIF o WebP.»), un PNG de 4,1 MB («La imagen pesa 4,1 MB; el máximo es 2 MB.») y una de 480 px («Aviso: la imagen mide 480 px de ancho; se recomienda 600 px.») no cambian la plantilla ni llaman a la base más que con las dos imágenes válidas.
- `plantillaimagenerror`: «Subiendo…» y luego «La imagen pesa más de 2 MB» junto al botón; el bloque queda «Sin imagen», sin «Quitar imagen», y el editor sigue sin cambios por guardar.
- «Quitar imagen»: el bloque vuelve a «Sin imagen» y la vista previa deja de mostrar la imagen. Con `?cxok=0` aparece «La base rechazó la acción (prueba)» y la plantilla no cambia.
- Configuración de envío (`cxnotifcola`): «Subir imagen» → «Subiendo…» → «Cambiar imagen» con miniatura y «1 cambio sin guardar»; al guardar, `envio.logo` = la dirección completa y `NC.opciones().logo` la trae; «Quitar logo» lo deja «Sin logo».
- Sin la conexión (`notifeditor`): el botón sigue «Subir PNG o JPG», la imagen se ve en la miniatura con su nombre y el aviso «Sin la conexión, la imagen se ve solo en esta pantalla…».
- `sirius-correo-render.js` sin `window` ni `document` (Node): banner y pie con dirección completa (con y sin opciones, y aunque no esté en `opciones.archivos`) usan esa dirección; un banner con `banner-inspeccion.jpg` usa `opciones.assets`; un nombre que no está en `opciones.archivos` cae al logo; `http://` y `javascript:` no dan imagen; las comillas van escapadas. El archivo anterior falla las cuatro primeras comprobaciones.
- Regresión: `correoigual`, `vistapreviabase` y `notifprueba` (y la prueba cruzada de N-2d con los casos 50013 y 50012, huella vista previa = «Ver correo» de la prueba), `botondestino`, `plantillapublicada`, `vercorreobase`, `notifeditor`, `cxnotifcola`, `bitacoraorden`, `bitacoratardia`, `campanaavisos`, `notifporaprobar` e `inicio` abren sin error de página.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real: no subí ninguna imagen a Supabase. Lo que sí está probado es el código de la pantalla con la forma `{ ok, mensaje, url, ruta }` de la simulación.
- Que `subirImagenCorreo(archivo, nombre)` reciba el objeto `File` tal cual y que `url` sea la dirección pública completa; si la base devolviera solo la ruta, la pantalla muestra «La base no devolvió la dirección de la imagen».
- La función de envío de la base con el archivo nuevo: `sirius-correo-render.js` funciona sin navegador, pero no corrí `sirius-notificar`.
- Que los clientes de correo muestren la imagen: algunos no admiten WebP ni GIF animado, y varios bloquean las imágenes externas hasta que la persona las autoriza.
- El permiso real del almacén: aquí la base simulada solo deja subir al Administrador; en la real lo decide SQL 64.

**Diferencias**
- **Nombre mostrado:** se quita el prefijo numérico con que la base simulada arma la ruta (`1795…-banner600.png` → `banner600.png`). Solo es lo que se ve; `archivo` guarda la dirección completa.
- **Aviso sin la conexión:** es un texto nuevo; antes no había aviso.
- **`NC.envio()` conserva `logo`, `assets` y `archivos`:** no estaba pedido. Sin esto, guardar la configuración de envío los descartaba.
- **Imagen del encabezado de WhatsApp:** sigue solo en pantalla; no se tocó.
- **Plantillas con nombres de siempre** (`pie-aseguradora.png`): se leen igual con `opciones.assets`.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `plantillasubirimagen` | Andrea Salazar · Administrador (conexión simulada) | «Enlace de autoinspección» con un Banner sin imagen: «Subir imagen», «Subiendo…», miniatura, vista previa con la imagen y, al guardar, la plantilla con `archivo` = https://… |
| `plantillaimagenerror` | Andrea Salazar · Administrador (conexión simulada) | La conexión responde «La imagen pesa más de 2 MB»: el mensaje junto al botón y la plantilla sin cambios |

También abrí `correoigual`, `vistapreviabase`, `notifprueba`, `vercorreobase`, `botondestino`, `plantillapublicada`, `notifeditor`, `cxnotifcola`, `bitacoraorden`, `bitacoratardia`, `campanaavisos`, `notifporaprobar` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 22:57 · fin 18/11/2026 23:16 · 19 min**

---

## 18/10/2026 · 20:30 — Etapa N-1d

Publiqué la versión 329 de SIRIUS. Esta etapa reproduce en el artifact la corrección que la asesoría ya aplicó en GitHub: la Bitácora vuelve a leer `notificacionesEnvio` cuando la conexión trae una lista nueva. Antes se quedaba en «La cola está vacía · Mostrando 0 de 0» si la lista llegaba después del primer dibujo.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| `NC.cargar` | Guardaba la copia y el objeto `SIRIUS_CONEXION` (`NC._X`) | Guarda también `NC._arr = X.notificacionesEnvio`, la lista de la que salió la copia |
| `NC.copia` | Recargaba solo si cambiaba `SIRIUS_CONEXION` o si `NC.E` no era una lista | Recarga también si `NC._arr !== X.notificacionesEnvio` (llegó tarde o la trajo el sondeo) |
| Bitácora, Historial del caso, campana (cuenta de «por aprobar» y fallidos), «Enviar ahora» | Leían `NC.lista()` / `NC.copia()` | Igual; ahora esa lectura ya sigue a la lista nueva |
| Campana (`NC.avisos`, `SIRIUS_CONEXION.avisos`) | Lee la lista de la conexión en cada llamada; lo leído en la sesión (`NC._leidos`) solo se descartaba si cambiaba el objeto de la conexión | Misma regla: guarda la lista de la que sacó lo leído (`NC._la`); si `avisos` es otra lista, lo leído de la sesión se descarta y manda la base |
| Cola de ejemplo (`N.cola`, sin la conexión) | Copia propia | Sin cambios |
| Contexto del correo (N-2d) | Se lee por caso y plantilla | Sin cambios |
| `sirius-conexion.js` | Línea mínima | Sin cambios (70 bytes) |

**Qué cambió**
- **`sirius-notif-cola.js` (v1.5):** las dos líneas de la corrección de GitHub, igual que ahí.
  - `cargar` guarda `NC._arr = X.notificacionesEnvio` (y `null` sin la conexión).
  - `copia` recarga si `NC._X !== X`, si `NC.E` no es una lista o si `NC._arr !== X.notificacionesEnvio`.
- **Campana:** `NC.avisos` aplica la misma regla a su lista. Cuando la conexión trae otra lista de avisos, lo que se marcó como leído en esta sesión se descarta y vale lo que dice la base. Con la misma lista (la base que aún no se relee, `?cxpasivo=1`) se conserva.
- **Base simulada** (`datos-cx-notif.js`, `SIRIUS Back-office.dc.html`): la escena `bitacoratardia` trae la conexión sin `notificacionesEnvio`. Cuando la Bitácora ya está a la vista, 1,5 s después la base entrega la lista (una lista nueva) y el Back-office solo vuelve a dibujar, sin pasar por `ncRecargar`.

**Prueba cruzada** (misma página, sin recargar; módulo anterior frente al corregido)

| Paso | Módulo anterior | Módulo corregido |
|---|---|---|
| `bitacoratardia`: la Bitácora a la vista, sin la lista | «Mostrando 0 de 0» · «La cola está vacía» | Igual |
| La base entrega la lista (1,5 s después) | Sigue «Mostrando 0 de 0» | «Mostrando 8 de 8» y «Estado: Todos (8)», en menos de 1,5 s |
| `bitacoraorden`: la base cambia a una lista de 3 filas y el Back-office se vuelve a dibujar | Sigue «Mostrando 8 de 8» | «Mostrando 3 de 3» |
| La base cambia a una lista vacía | Sigue «Mostrando 8 de 8» | «Mostrando 0 de 0» |
| `campanaavisos`: marcar AV-7001 | 1 sin leer | 1 sin leer |
| La base trae otra lista de 3 avisos sin leer | 2 sin leer (arrastra lo leído) | 3 sin leer |
| Marcar un aviso de esa lista | — | 2 sin leer |

**Verificado (1280×720 y 1920×1080)**
- `bitacoratardia`: primero la cola vacía, ya sin «Preparando tu espacio de trabajo», y 1,4 s después las 8 filas con su orden y su hora real. La página no se recarga (una marca puesta en la ventana sigue ahí). Con el módulo anterior la cola se queda vacía.
- `bitacoraorden`: 8 filas ordenadas, como en N-2c. `ENV-5907` (canal app con «Simulado» explícito) sigue «Enviado» y «Simulado».
- `campanaavisos`: la prueba cruzada de N-1c sale igual (número 2; abrir AV-7001 abre «Caso 50013» y el número pasa a 1; Bitácora con ENV-7101 y ENV-7103 en «Leído» y ENV-7102 «Entregado»; «Marcar todas» deja el número en blanco y las tres filas en «Leído»; la base recibe `marcarAvisoLeido { ids: ['AV-7001'] }` y `marcarAvisosLeidos {}`). También con `?cxpasivo=1`. `campanavacia` dice «No tienes avisos nuevos».
- `notifporaprobar` (sin la conexión): cola de ejemplo con «Bitácora (4 por aprobar)» y la campana con su número.
- `monitorcampana`, `cxnotifcola`, `vistapreviabase`, `vercorreobase`, `colacalconsistente`, `cxnotificaciones` e `inicio` abren sin error de página en los dos tamaños.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real: la corrección ya la probó la asesoría en GitHub; aquí no la corrí con la conexión real, solo con la base simulada.
- La regla compara la lista por identidad (`!==`). Si la base real agrega filas al mismo arreglo (por ejemplo con `push`) sin cambiar el arreglo, la copia no se entera hasta `ncRecargar` (cada 60 s, al volver a la pestaña y tras las acciones).
- La copia se vuelve a leer cuando algo dibuja la pantalla; si la base entrega la lista y nada la vuelve a dibujar, la Bitácora se actualiza en el siguiente dibujo o en el sondeo de 60 s.
- En la simulación, el sondeo de 60 s (`ncRecargar`) ya llamaba a `NC.cargar()`; no reproduje el fallo del sondeo que se vio en GitHub.

**Diferencias**
- **La campana (`NC.avisos`) no estaba en la corrección de GitHub:** la agregué por la definición 2 (misma regla para otras listas). Si la asesoría prefiere dejar solo las dos líneas de `cargar` y `copia`, se quita sin tocar lo demás.
- **La escena** no usa el sondeo de 60 s: la base entrega la lista y el Back-office solo se vuelve a dibujar, para que la prueba dure segundos.
- **Contexto del correo (N-2d):** su lectura por caso y plantilla no depende de la lista de la conexión; no se tocó.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `bitacoratardia` | Andrea Salazar · Administrador (conexión simulada) | Notificaciones › Bitácora con la cola vacía y, 1,5 s después, las 8 filas de la base, sin recargar |

También abrí `bitacoraorden`, `campanaavisos`, `campanavacia`, `notifporaprobar`, `monitorcampana`, `cxnotifcola`, `vistapreviabase`, `vercorreobase`, `colacalconsistente`, `cxnotificaciones` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 21:54 · fin 18/11/2026 22:10 · 16 min**

---

## 18/10/2026 · 20:30 — Etapa N-1c

Publiqué la versión 326 de SIRIUS. La campana ahora muestra los avisos que la base deja con el canal «App» (SQL 61), junto con lo que ya mostraba. Abrir un aviso lo marca leído y abre el caso; las filas «En SIRIUS» de la Bitácora pasan de «Entregado» a «Leído» con la misma lista.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Campana (cabecera de todas las pantallas) | Solo `notificaciones[]` de la base, las del Monitor y los conflictos | Suma `SIRIUS_CONEXION.avisos[]` con `SiriusNotifCola.avisos`, sin duplicar; cada aviso con su texto, el caso, la regla y la hora real «dd/mm/aa · hh:mm» |
| Número de la campana | Contaba lo no leído de esa lista | Cuenta también los avisos no leídos; el mismo número en todas las pantallas |
| Abrir un aviso | — | `marcarAvisoLeido { ids }` y abre el caso |
| «Marcar todas como leídas» | Marcaba las de la pantalla | También llama a `marcarAvisosLeidos {}` |
| Campana sin avisos | «Sin notificaciones» | «No tienes avisos nuevos» (con `avisos[]` vacío) |
| Notificaciones › Bitácora | Las filas del canal App eran «Simulado» | Estado «Entregado» o «Leído», con la nota «Aviso en la campana»; «Enviar ahora» no las toca |
| Historial del caso | Solo los correos | Suma «Avisos en SIRIUS» con el mismo estado |
| Inicio | No muestra avisos | Sin cambios |
| Sin la conexión | — | La campana queda como hoy |

**Qué cambió**
- **`sirius-notif-cola.js` (v1.4):** una sola lista de avisos.
  - `avisos()`: los de la base, del más reciente al más antiguo (hasta 60), con la hora de Ecuador; la usan la campana, la Bitácora y el Historial.
  - `avisosSinLeer()`, `avisoDeFila()`, `conAviso()` y `avisosDeCaso()`.
  - `marcarAvisos(ids)` marca en la lista de la conexión, en las filas En SIRIUS de la cola y en lo leído de esta sesión.
- **Campana:**
  - Los avisos se suman a lo que ya mostraba. No se duplica un aviso que tenga el mismo id, ni el que tenga el mismo caso y el mismo texto.
  - Cada aviso muestra título, texto, «Caso N · Rxx · dd/mm/aa · hh:mm»; los no leídos van destacados (fondo y punto) y se cuentan en el número.
  - El icono depende de la regla: R04, R08 y R16 alerta; R09 y R10 rechazo; R11 adjunto; R17 visita.
- **Acciones:**
  - `avisoAccion`: con `{ ok: true }` se marca en la copia; con `{ ok: false }` no cambia nada y se ve el mensaje de la base.
  - `ncRecargar` (cada 60 s, al volver a la pestaña y tras las acciones que generan avisos) también vuelve a leer `avisos`.
- **Bitácora:** las filas del canal app ya no son «Simulado» por defecto. La fila y el aviso se unen por `aviso`, por el mismo id o por caso + regla + texto; si el aviso está leído, la fila dice «Leído».

**Prueba cruzada** (`campanaavisos`, conexión simulada: R09 y R17 sin leer, R11 leído)

| Paso | Campana (número y avisos) | Bitácora (filas En SIRIUS) | Historial del caso 50013 | Acciones a la base |
|---|---|---|---|---|
| Al abrir | 2 sin leer: R09 y R17 con punto; R11 leído | ENV-7101 y ENV-7102 Entregado; ENV-7103 Leído (según los datos de la escena) | — | — |
| Abrir el aviso R09 (caso 50013) | Abre «Caso 50013»; número 1 | ENV-7101 Leído · ENV-7102 Entregado · ENV-7103 Leído | R09 Leído · R11 Leído | `marcarAvisoLeido { ids: ['AV-7001'] }` |
| Ir a Bitácora y a Solicitudes | Número 1 en las dos pantallas | — | — | — |
| «Marcar todas como leídas» | Sin número; «Sin leer (0)» | ENV-7102 Leído (las tres en Leído) | — | `marcarAvisosLeidos {}` |

El mismo resultado sale con la base que no cambia sus listas hasta que se vuelven a leer (`?cxpasivo=1`), porque la copia aplica la misma regla.

**Verificado (1280×720 y 1920×1080)**
- `campanaavisos`: la campana con 3 avisos y el número 2; texto, caso, regla y hora real en cada uno; la prueba cruzada de arriba (abrir un aviso, ir a la Bitácora y a Solicitudes, «Marcar todas»).
- `campanavacia`: «No tienes avisos nuevos», sin número.
- `monitorcampana` (sin la conexión): la campana sigue igual, con los avisos del Monitor.
- `bitacoraorden`: 8 filas de la base, del más reciente al más antiguo y en un solo formato (la fila En SIRIUS de esa escena sigue marcada «Simulado» porque así llega).
- `notifporaprobar`, `cxnotifcola`, `notifverkorreo`, `vistapreviabase`, `vercorreobase`, `colacalconsistente`, `cxnotificaciones` e `inicio` abren sin error de página.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real (SQL 61): que `avisos[]` llegue con esos campos y que la fila del canal App de `notificacionesEnvio[]` traiga `aviso` (o el mismo id, o el mismo caso, regla y texto); si no, la fila no cambia a «Leído» hasta que la base la actualice.
- Que `marcarAvisoLeido` y `marcarAvisosLeidos` respondan `{ ok, mensaje, leidos }` como en la simulación, y que `recargar('avisos')` exista; sin él, los avisos nuevos aparecen al volver a abrir SIRIUS.
- La regla de «sin duplicar»: se probó con id y con caso + texto; la base real puede mandar avisos y notificaciones con otros textos.

**Diferencias**
- **Texto de la Bitácora:** el aviso de arriba dice ahora «WhatsApp y SMS están simulados» (antes, «WhatsApp, SMS y En SIRIUS»).
- **Inicio** no muestra avisos: no se tocó.
- **Al abrir un aviso** siempre se abre el caso en Resumen, también si la regla es de garantías (R04 y R10).

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `campanaavisos` | Andrea Salazar · Administrador (conexión simulada) | La campana con 3 avisos (R09 y R17 sin leer, R11 leído) y el número 2; abrir uno lo marca leído y abre el caso; «Marcar todas como leídas» |
| `campanavacia` | Andrea Salazar · Administrador (conexión simulada) | La campana sin avisos: «No tienes avisos nuevos» |

También abrí `monitorcampana`, `bitacoraorden`, `notifporaprobar`, `cxnotifcola`, `notifverkorreo`, `vistapreviabase`, `vercorreobase`, `colacalconsistente`, `cxnotificaciones` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 18:26 · fin 18/11/2026 18:38 · 12 min**

---

## 18/10/2026 · 20:30 — Etapa N-2d

Publiqué la versión 324 de SIRIUS. Esta etapa corrige N-2c: con la conexión, la vista previa del editor y «Ver correo» arman el correo con los mismos datos que la base. El aviso «Este caso no tiene enlace activo…» ya sale solo cuando, en el contexto de la base, el botón queda sin dirección.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Editor › vista previa del correo | Contexto armado con los datos de la pantalla (el 50013 salía sin enlace aunque la base sí lo tenía) | Con la conexión, `contextoNotificacion(caso, plantilla)` y `sirius-correo-render.js`; mientras llega, «Cargando los datos del caso…» |
| Editor › aviso del botón y línea «Destino» | Según la pantalla | Según el contexto de la base: el aviso sale solo si el destino queda vacío |
| Editor › quién lo recibe | No se decía | «Así lo verá: Asegurado o contacto (nombre)», con el destinatario del contexto |
| Editor › «Enviar prueba a mi correo» | El asunto salía de la pantalla | El asunto sale del contexto de la base y la ventana dice «Lo recibirás como …» |
| Bitácora › «Ver correo» | Se armaba con los datos de la pantalla | Con `notificacionContexto(id)`: plantilla, asunto y contexto que guardó la base; «Cargando…» o el error |
| Errores de la base | Ya salían solo con su mensaje en las acciones | También al leer el contexto (`SiriusNotifCola.msg`) |
| Sin la conexión (o sin esas funciones) | Datos de la pantalla | Igual |

**Qué cambió**
- **`sirius-notif-cola.js` (v1.3):**
  - `contextoBase` y `notifBase` leen `SIRIUS_CONEXION.contextoNotificacion` y `notificacionContexto`. Cada una da `cargando`, `ok`, `error` o `sin` (la base no tiene datos).
  - `completar` deja el contexto de la base listo para armar el correo: enlace, enlaces, tablas, compañía, mensaje y destinatario. Se respeta el destinatario de la base `{ nombre, rol, sinDestino }`.
  - `htmlCtx`, `asuntoCtx`, `avisosCtx` y `quien` arman el correo, el asunto, los avisos y la línea «Así lo verá».
  - `msg` saca solo el mensaje de un error de la base, aunque llegue como JSON.
- **Editor de plantillas:**
  - `baseCtx()` hace una lectura por caso y plantilla; al cambiar el caso de ejemplo se vuelve a leer.
  - «Cargando los datos del caso…» mientras llega. Si la base responde un error, se ve solo su mensaje y no se arma el correo con otros datos. Si la base no tiene datos del caso, se usan los de la pantalla y no se dice «Así lo verá».
  - La prueba usa el mismo contexto para el asunto.
- **«Ver correo»:** cuando la notificación viene de la base se pide su contexto; muestra «Cargando los datos del correo…», el correo tal como se envió o se enviará, o el mensaje del error. El texto de la ventana dice «los datos que guardó la base para este correo».
- **Base simulada** (`datos-cx-notif.js`, `SIRIUS Back-office.dc.html`):
  - La conexión simulada trae las dos funciones nuevas. Con `?cxok=0` responden `{ ok: false }`; con `?cxctx=error`, el JSON crudo de un error; con `?cxctx=sin`, sin datos.
  - Cada notificación y cada prueba que llega a la cola guarda su contexto; la prueba lo guarda con el destinatario típico de la plantilla.

**Prueba cruzada** (conexión simulada, plantilla «Visita agendada»; la misma plantilla guardada en las tres vistas)

| Caso | Vista previa del editor | «Ver correo» de la prueba enviada | «Ver correo» de la cola | Iguales |
|---|---|---|---|---|
| 50013 (enlace activo) | Botón «Cambiar la fecha» → `https://clientes.asur.ec/caso/50013?token=PC-50013-X7K2`; sin aviso; huella f632b7a0; «Así lo verá: Asegurado o contacto (Mónica Andrade)» | Mismo botón y destino; sin aviso; huella f632b7a0 | ENV-6001: mismo botón y destino; huella f632b7a0 | Sí |
| 50012 (sin enlace) | Sin botón; aviso «Este caso no tiene enlace activo: el botón «Cambiar la fecha» no saldrá.»; huella 5eacbe2f; «Así lo verá: Asegurado o contacto (Fernanda Prueba)» | Sin botón; mismo aviso; huella 5eacbe2f | ENV-6002: sin botón; mismo aviso; huella 5eacbe2f | Sí |

La ventana de la prueba dice «Lo recibirás como Asegurado o contacto (Mónica Andrade)» (caso 50013) y «… (Fernanda Prueba)» (caso 50012), con el asunto «[Prueba] Tu inspección está agendada para el 22/10/26» y «… para el 19/10/26».

**Verificado (1280×720 y 1920×1080)**
- `vistapreviabase`: el 50013 muestra el botón con el portal del caso y «Así lo verá: Asegurado o contacto (Mónica Andrade)»; al elegir el 50012, a los 100 ms se ve «Cargando los datos del caso…» y después el aviso, sin botón. La línea «Destino» dice lo mismo que la vista previa.
- `vercorreobase`: ENV-6001 abre con su botón; ENV-6002 sin botón y con su aviso; ENV-6003 muestra solo «El contexto de la notificación ENV-6003 ya no está disponible» (el JSON crudo no se ve).
- `?cxctx=error` en la vista previa: se ve solo «No se pudo armar el contexto del caso 50013». Con `?cxctx=sin` se usan los datos de la pantalla y no aparece «Así lo verá».
- `botondestino`, `plantillapublicada` y `notifprueba` siguen bien. La prueba cruzada de N-2c (publicar la versión 4, recargar, editor, vista previa, historial y prueba) da lo mismo, ahora con los datos de la base.
- El resto del barrido (`notifverkorreo`, `notifporaprobar`, `cxnotifcola`, `bitacoraorden`, `correoigual`, `notifinterruptor`, `enlacebloqueado`, `historialreloj`, `notifeditor` e `inicio`) abre sin error de página en los dos tamaños.
- `sirius-correo-render.js` no cambió (sigue funcionando en Node, sin navegador) y `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real: que `contextoNotificacion` y `notificacionContexto` devuelvan exactamente esa forma. En esta etapa la plantilla de `notificacionContexto` se acepta como objeto o como identificador; si la base la manda de otra forma, «Ver correo» usa la plantilla vigente.
- Si la base devuelve el destinatario de la prueba como el del destinatario de la regla (el cliente): aquí se simula así.
- Con la base real, el tiempo de respuesta de `contextoNotificacion` al cambiar de caso en la vista previa: hay una lectura por caso y plantilla.

**Diferencias**
- **La condición de la regla** («Este caso no cumple la condición de R05…») y las variables del campo Asunto siguen con los datos de la pantalla: no se tocaron en esta etapa.
- **Si la base responde un error**, la vista previa no muestra un correo (solo el mensaje), para no enseñar datos distintos a los del envío.
- **Sin la conexión:** todo sigue como en N-2c.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `vistapreviabase` | Andrea Salazar · Administrador (conexión simulada) | La vista previa de «Visita agendada» con los datos de la base: 50013 con botón y 50012 sin botón y con aviso, con «Así lo verá: …» |
| `vercorreobase` | Andrea Salazar · Administrador (conexión simulada) | «Ver correo» de ENV-6001 con el contexto guardado de la base; ENV-6002 sin botón; ENV-6003 con el error |

También abrí `botondestino`, `plantillapublicada`, `notifprueba`, `notifverkorreo`, `notifporaprobar`, `cxnotifcola`, `bitacoraorden`, `correoigual`, `notifinterruptor`, `enlacebloqueado`, `historialreloj`, `notifeditor` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 17:51 · fin 18/11/2026 18:07 · 16 min**

---

## 18/10/2026 · 20:30 — Etapa N-2c

Publiqué la versión 321 de SIRIUS. Esta etapa corrige N-2b en cuatro puntos. El botón del correo lleva al destino que se elige y, si el caso no tiene esa dirección, no sale. La plantilla publicada es la que se ve al reabrir y al recargar. Con la conexión, la Bitácora muestra solo la cola de la base, de la más reciente a la más antigua, con la hora real. La prueba va al correo del usuario de la conexión.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| `sirius-correo-render.js` (botón) | Destino «sirius» o una URL; sin enlace caía al portal general con otro caso (20152) | Lista de destinos; cada uno sale del caso del correo; sin dirección válida, el botón no sale |
| Editor › bloque Botón | URL o «sirius» | Selector «Destino del botón», con el destino ya resuelto para el caso de la vista previa |
| Editor › Guardar y publicar | Publicaba sin versión de la base; el historial lo registraba, pero al reabrir volvía la anterior | Publica la versión vigente + 1; la cabecera dice «versión vigente de la base: N (fecha · quién)» |
| Editor › Historial | Entrada solo en la página | «Publicó la versión N (plantilla «…»)» con la fecha real, publicada junto con la plantilla |
| Vista previa y «Ver correo» | Botón al portal general | El mismo destino, y el aviso «Este caso no tiene enlace activo: el botón no saldrá» |
| Bitácora | Mezclaba filas de la base con filas de ejemplo; orden por estado | Con la conexión, solo `notificacionesEnvio[]`, ordenadas por la hora de envío o de creación |
| Back-office | `?caso=N` no existía | Abre el caso; si falta iniciar sesión, lo abre al entrar |
| Función de envío (sirius-notificar) | Mismo archivo de armado | Mismo archivo; ahora lee `enlace` y `enlaces` de la base (SQL 59d) |
| «Enviar prueba a mi correo» | «Tu usuario no tiene correo registrado» con la conexión | Usa `SIRIUS_CONEXION.usuario.correo` |

**Qué cambió**
- **Destino del botón** (`SiriusCorreoRender.DESTINOS`):
  - Opciones: enlace del cliente para este caso (`enlace.url`), autoagendamiento, autoinspección, caso en el Back-office (`enlaces.caso`), portal general, Back-office inicio y otra dirección URL, que admite `{{…}}`.
  - Automático («sirius»): para clientes y brókeres, el enlace del caso; para internos, el caso en el Back-office.
  - Sin dirección válida (http, https o mailto, sin variables vacías), el bloque no se arma. Ya no se usa el portal general como respaldo.
  - `avisos(plantilla, contexto)` da el aviso del botón. Lo muestran el editor y «Ver correo».
- **Contexto del correo:** `enlace` es solo el del caso: `{ url, vence }`. `enlaces` trae autoagendamiento, autoinspección, caso, portal y backoffice de la base. Sin la base, se arman con los enlaces vigentes del caso y con `envio.enlaces`.
- **Plantillas publicadas:**
  - Guardar pide `publicarConfiguracion` con la versión vigente + 1.
  - La vigente se lee de `SIRIUS_CONEXION.configuracion.SIRIUS_NOTIFICACIONES` o de `__version`, que anota `sirius-publicar.js` al publicar.
  - La entrada del historial va dentro de lo publicado. Si la base responde `{ ok: false }`, se revierte.
- **Causa del error de N-2b:** `datos-notificaciones.js` se ejecutaba dos veces al montar las pantallas y la segunda vez reemplazaba lo publicado por la plantilla original. Ahora se carga una sola vez.
- **Bitácora:** con la conexión, solo la cola de la base, de la más reciente a la más antigua por `enviadoEn` o `fecha`, en «dd/mm/aa · hh:mm», debajo «Creado …». «Simulado» se distingue con su etiqueta, en el mismo orden.
- **`?caso=N`:** abre el caso en Solicitudes. Si la conexión existe pero falta iniciar sesión, el número queda en `sessionStorage` (`sirius.casoPend`) y el caso se abre al entrar. Si no existe, se ve «No encontramos el caso».
- **Prueba:** usa `SIRIUS_CONEXION.usuario.correo` (o `email`). Si está vacío: «La base no tiene correo para tu usuario. Pide que lo registren en Usuarios y roles.»

**Prueba cruzada** (`plantillapublicada`, conexión simulada, plantilla «Visita agendada», caso 50012)

Cambios: el asunto pasa a «No {{caso.numero}} · Tu inspección está agendada para el {{visita.fecha}}» y el destino del botón a «Caso en el Back-office». Guardé con motivo y recargué la página.

| Dónde | Antes | Después de publicar | Después de recargar |
|---|---|---|---|
| Base (`configuracion.SIRIUS_NOTIFICACIONES`) | Versión 3 | Versión 4 (`publicarConfiguracion`, versión 4) | Versión 4 |
| Editor (cabecera y campo Asunto) | Versión 3 · asunto anterior | Versión 4 · asunto nuevo | Versión 4 · asunto nuevo |
| Vista previa | «Tu inspección está agendada para el 19/10/26» | «No 50012 · …» · botón a `…?caso=50012` · huella 467796db | Igual: huella 467796db |
| Historial | — | «Publicó la versión 4 (plantilla «Visita agendada»)», 18/11/26 · 16:02 | Igual |
| Prueba | — | — | «[Prueba] No 50012 · …», Para andrea.salazar@asur.ec, «Pendiente» |
| Bitácora › fila de la prueba › «Ver correo» | — | — | Primera fila, 18/11/26 · 16:02 · huella 467796db, igual a la vista previa |

**Verificado (1280×720 y 1920×1080)**
- `botondestino`: con el caso 30031, «Enlace del cliente» lleva a `https://clientes.asur.ec/autoinspeccion?token=AI-7Q2K9X`. El caso 50012, sin enlace activo, no tiene botón y se ve el aviso. Con «Caso en el Back-office», el botón lleva a `…?caso=50012`, y con `https://clientes.asur.ec/caso/{{caso.numero}}` a `…/caso/50012`.
- `sirius-correo-render.js` sin navegador (Node): un cliente sin enlace no tiene botón; con enlace usa ese enlace y no el portal general; un interno con «automático» va a `enlaces.caso`.
- `plantillapublicada`: la prueba cruzada de arriba.
- `bitacoraorden`: 8 filas, todas `ENV-…` de la base, sin filas de ejemplo, de 16:02 a 06:03, en un solo formato. Las de SMS, WhatsApp y En SIRIUS son «Simulado» y van en su hora.
- `casoporenlace` (`&caso=50013`): abre «Caso 50013». Con la conexión sin sesión, el caso queda pendiente y se abre al iniciar sesión.
- `notifprueba`: la prueba va a andrea.salazar@asur.ec, el correo del usuario de la conexión.
- `correoigual` y `notifinterruptor` abren sin error de página.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real (SQL 59d): que `enlace` y `enlaces` lleguen con esos nombres y que `configuracion_vigente` devuelva `{ version, fecha, por, datos }`. Si la base no trae la versión vigente, se usa la que anotó la última publicación.
- El inicio de sesión real con `?caso=N`: depende de que la conexión real tenga más datos que `activo` antes de iniciar sesión y de que el navegador permita sessionStorage.
- La función sirius-notificar con los destinos nuevos: el archivo ya funciona sin navegador.

**Diferencias**
- **Otras configuraciones:** catálogos, formularios, facultades y otras se publican con el mismo `SiriusPublicar`. Si su archivo de datos también se ejecuta dos veces, podrían tener el mismo problema. No lo revisé en esta etapa.
- **Sin la conexión:** la Bitácora sigue mostrando la cola de ejemplo junto con la bitácora antigua.
- **Plantillas guardadas con destino «sirius» o una URL:** se leen igual. «sirius» queda como «Automático».

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `botondestino` | Andrea Salazar · Administrador (conexión simulada) | El editor de «Visita agendada» con el bloque Botón: 30031 con enlace y 50012 sin enlace, con el aviso |
| `plantillapublicada` | Andrea Salazar · Administrador (conexión simulada) | La versión vigente de la base en el editor; publicar y recargar mantiene la plantilla |
| `bitacoraorden` | Andrea Salazar · Administrador (conexión simulada) | La Bitácora con solo la cola de la base, de la más reciente a la más antigua, con la hora real |
| `casoporenlace` | Andrea Salazar (conexión simulada) | `?escena=casoporenlace&caso=50013` abre el caso 50013 |

También abrí `correoigual`, `notifinterruptor`, `notifprueba`, `notifporaprobar`, `notifverkorreo`, `cxnotifcola`, `enlacebloqueado`, `historialreloj`, `notifeditor` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 15:48 · fin 18/11/2026 16:10 · 22 min**

---

## 18/10/2026 · 20:30 — Etapa N-2b

Publiqué la versión 317 de SIRIUS. El correo que se envía ahora es idéntico a la vista previa: los dos los arma `sirius-correo-render.js`. Además hay un interruptor «Notificaciones», el enlace de autoagendamiento se bloquea cuando ya hay una cita, el Historial usa la hora real de Ecuador con la conexión y la Bitácora se refresca sola.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Vista previa del editor de plantillas | Su propio armado (React) | El HTML de `sirius-correo-render.js` en un iframe con `srcdoc`, con un caso real elegido |
| «Ver correo» (Bitácora) | Otro armado propio | El mismo HTML, en un iframe |
| Función de envío sirius-notificar | Armaba el correo a su manera | Puede cargar el mismo archivo (`module.exports` o `globalThis.SiriusCorreoRender`) |
| Cabecera de Notificaciones | — | Interruptor «Notificaciones: Encendidas / Apagadas», con confirmación y motivo, solo para el Administrador |
| Bitácora | Se actualizaba solo al salir y volver | Se refresca cada 60 s y al volver a la pestaña del navegador; con «Apagadas», aviso y filas «Simulado» |
| Configuración de envío | Aprobación activa | Con «Encendidas», la aprobación no aplica: se conserva atenuada |
| Plantillas | Sin regla de cancelación propia | Regla R23 con la plantilla «solicitud_cancelada» |
| «Enviar prueba a mi correo» | La base no tenía la acción | Usa `enviarPruebaNotificacion`; la prueba entra a la cola |
| Coordinar visita › Contacto | «Enviar enlace de autoagendamiento» activo aunque hubiera cita | Bloqueado con «Hay una cita agendada para el dd/mm · hh:mm: no se puede enviar el enlace» |
| Errores de la base | A veces el JSON crudo (`{"code":"P0001",…}`) | Solo el mensaje |
| Historial, pestaña Coordinación, Inicio, SLA y vencimientos | Mezclaban horas de la base con el reloj simulado y dos formatos de fecha | Con la conexión, hora real de Ecuador; Historial siempre «dd/mm/aa · hh:mm»; las horas de la base con zona se pasan a Ecuador |

**Qué cambió**
- **`sirius-correo-render.js` (nuevo):** no tiene dependencias ni usa el DOM.
  - `html(plantilla, contexto, opciones)`: correo completo con estilos en línea, ancho máximo 600 px y Mulish con respaldo Arial.
  - `asunto(plantilla, contexto)`: el asunto con las variables llenas.
  - Bloques: banner, texto, tabla libre, tabla de datos (filtro, columnas, máximo y «vacío»), botón, separador y pie.
  - Botón con destino «sirius»: lleva al portal para clientes y brókeres, y al Back-office para internos.
  - Imágenes: se toman de `opciones.assets` + archivo; si no existen, se usa el logo con su texto alternativo.
  - Variables `{{a.b}}` con los valores escapados; una variable sin dato muestra «—».
- **Contexto del correo:** `SiriusNotifCola.contexto` arma el contexto con la forma de la base, a partir de los datos del caso. `SiriusNotifCola.opciones` saca los enlaces, las imágenes y el logo de `SIRIUS_NOTIFICACIONES.envio`, que también lee la función de envío.
- **Interruptor:**
  - Lee `SIRIUS_NOTIFICACIONES.envio.activo` y lo cambia con `configurarEnvioNotificaciones { activo, motivo }`.
  - Con «Apagadas», la Bitácora avisa «Los correos nuevos quedan «Simulado»: no salen», con quién las apagó, cuándo y por qué.
  - Con «Encendidas», la aprobación por regla no aplica y se ve atenuada.
- **Prueba:** `enviarPruebaNotificacion` pone la prueba en la cola: «Pendiente», o «Simulado» si las notificaciones están apagadas.
- **R23:** regla «Solicitud cancelada» con la plantilla `solicitud_cancelada`. Las filas de cancelación usan R23.
- **Enlace de autoagendamiento:** una sola función (`agBloqueo`) mira si todos los riesgos del caso están en una visita abierta. Lo usan Contacto y la pestaña Coordinación. Un botón bloqueado muestra el aviso al pasar el cursor.
- **Errores de la base:** `cxMsg` saca el mensaje de un JSON o de una excepción, en todas las acciones de la base.
- **Reloj real:** con la conexión, `SIRIUS_EJEMPLO.ahora()`, `hoy()`, `fechaDemo` y `horaDemo` leen la hora de Ecuador (UTC−5). Sin la conexión, sigue el reloj de demostración.
- **Formato de fechas:** el Historial, la Bitácora y la pestaña Coordinación pasan a Ecuador las horas de la base con zona y usan «dd/mm/aa · hh:mm».
- **Refresco:** la Bitácora vuelve a leer la cola cada 60 s y al volver a la pestaña del navegador. Usa `recargar('notificacionesEnvio')` si la conexión lo tiene y, si no, relee `notificacionesEnvio[]`.

**Prueba cruzada**

1. La vista previa de cada plantilla y el HTML de `sirius-correo-render.js`, con el caso 20178:

| Plantilla | Vista previa = HTML de la función |
|---|---|
| gar_recordatorio, gar_vencidas, visita_confirmada, enlace_autoinspeccion, enlace_autoagendamiento, enlace_agenda_recordatorio, enlace_recordatorio, documento_revision, interno_aviso, solicitud_cancelada, prueba_bloques y encuesta | Iguales en las 12 |
| prueba_bloques en el editor (iframe) | Igual: 5215 caracteres, huella 26592955 |
| prueba_bloques en Node, sin `window` ni `document` (como la función de envío) | Igual a la página |

2. Las fechas de un mismo evento (`historialreloj`, prueba de las 13:08 de Ecuador, horas de la base en UTC):

| Evento | Base | Historial | Bitácora | Pestaña Coordinación |
|---|---|---|---|---|
| Visita agendada (V1) y su R05 | 16:33 UTC | 18/11/26 · 11:33 | 18/11/26 · 11:33 (salió 11:33) | — |
| Intento de contacto | 15:48 UTC | 18/11/26 · 10:48 | — | 18/11/26 · 10:48 |
| Eventos de la pantalla (nota y enlace) | — | Hora real de Ecuador; el enlace «vence el 25/11/26», no el 25/10 | — | — |

**Verificado (1280×720 y 1920×1080)**
- Las 5 escenas nuevas, `notifporaprobar`, `notifverkorreo`, las de Coordinar visita (`coordcontacto`, `cxcoordcontacto`, `coordagendada`, `enlaceagenda`, `coordfases`, `cxvisitacancelar` y `cxestadoparcial`) y otras abren sin error de página.
- `sirius-correo-render.js` en un contexto sin `window` ni `document`: arma el correo, escapa `<Andina>`, filtra «Pendientes», manda el botón al portal para un bróker, usa el logo cuando falta el banner y el pie del almacén.
- `notifinterruptor`: sin motivo no cambia. Encender con motivo quita el aviso; apagar lo devuelve. Con las notificaciones apagadas, la prueba queda «Simulado» en la Bitácora. A la base van `configurarEnvioNotificaciones` y `enviarPruebaNotificacion` con su forma.
- `enlacebloqueado`: el botón queda deshabilitado con el aviso «Hay una cita agendada para el 19/10 · 10:00: no se puede enviar el enlace».
- Error de la base con `{"code":"P0001",…,"message":"Todos los riesgos del caso ya están en una visita abierta"}`, tanto como respuesta como en una excepción: se ve solo «Todos los riesgos del caso ya están en una visita abierta».
- `notifprueba`: la prueba aparece «Pendiente» en la Bitácora.
- Refresco: un correo agregado fuera de la pantalla aparece al volver a la pestaña, y su cambio a «Enviado» aparece solo a los 60 s.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La función de envío real (sirius-notificar) cargando `sirius-correo-render.js`: lo tiene que conectar la asesoría. El archivo ya funciona sin navegador.
- Las imágenes reales: en el proyecto no hay banners ni logo. Sin `envio.assets` ni `envio.logo`, el banner sale como una franja con su texto alternativo, igual en la vista previa y en el envío.
- Si la conexión real tiene `recargar('notificacionesEnvio')` o actualiza `notificacionesEnvio[]` por su cuenta: sin ninguna de las dos, el refresco relee lo que ya tiene.

**Diferencias**
- **Reloj real:** se usa con la conexión real. Entre las escenas simuladas, solo `historialreloj` lo usa; las demás siguen con el reloj de demostración para que sean repetibles.
- **Escena «Probar envío» simulada:** la antigua `notifprueba` ahora se llama `notifprobarenvio`. `notifprueba` es la prueba con la base.
- **Plantillas nuevas:** «Prueba de bloques (todos)» (Borrador) se agregó para la escena `correoigual`, y «solicitud_cancelada» para R23.
- **Variable sin dato:** muestra «—» también en la vista previa; antes el editor la marcaba como «Sin dato en este caso». Así la vista previa es igual al envío.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `correoigual` | Andrea Salazar · Administrador | La vista previa y el HTML de `sirius-correo-render.js`, lado a lado e iguales |
| `notifinterruptor` | Andrea Salazar · Administrador (conexión simulada) | «Notificaciones: Apagadas», el aviso en la Bitácora y dos correos «Simulado»; encender y apagar con motivo |
| `enlacebloqueado` | Andrea Salazar · Coordinador (conexión simulada) | Contacto del caso 50012 con «Enviar enlace de autoagendamiento» bloqueado |
| `historialreloj` | Andrea Salazar (conexión simulada, reloj real) | Historial del caso 50012 con hora real y un solo formato |
| `notifprueba` | Andrea Salazar · Administrador (conexión simulada) | «Enviar prueba a mi correo» con la base y la prueba «Pendiente» en la Bitácora |

También abrí `notifporaprobar`, `notifverkorreo`, `cxnotifcola`, `notifprobarenvio`, `notifeditor`, `notifbitacora`, `coordcontacto`, `cxcoordcontacto`, `coordagendada`, `enlaceagenda`, `coordfases`, `cxvisitacancelar`, `cxestadoparcial`, `historden` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 12:41 · fin 18/11/2026 13:09 · 28 min**

---

## 18/10/2026 · 20:30 — Etapa N-2

Publiqué la versión 314 de SIRIUS. La Bitácora de Notificaciones ahora es la cola real de correos: con la conexión lee `notificacionesEnvio[]` y desde ahí se aprueba, se rechaza, se reenvía y se envía ahora. La configuración de envío y las plantillas se guardan en la base con la publicación de configuración que ya existía.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué toma de la cola o de la configuración | Antes | Ahora |
|---|---|---|---|
| Notificaciones › Bitácora | La cola (`notificacionesEnvio[]`) | Lista de envíos con «Reenviar» solo en fallidos; reenviar lo dejaba «Enviado» | Cola con filtros (estado, regla, canal, caso y fecha), selección, «Aprobar», «Rechazar…», «Reenviar», «Ver correo» y «Enviar ahora» |
| Notificaciones › pestañas | Cuenta de «Por aprobar» | — | «Bitácora (N por aprobar)», con la misma cuenta que la campana |
| Notificaciones › Configuración de envío (nueva) | `SIRIUS_NOTIFICACIONES.envio` | No existía | Remitente (solo lectura), correo sin destinatario, aprobación de clientes y brókeres, y aprobación por regla |
| Notificaciones › Plantillas (editor) | `SIRIUS_NOTIFICACIONES.plantillas` | Se guardaba solo en la sesión | Con la conexión se publica en la base; además, «Enviar prueba a mi correo» |
| Notificaciones › Reglas | `SIRIUS_NOTIFICACIONES` | Se publicaba el objeto completo | Igual, pero sin la cola de ejemplo |
| Historial del caso | Correos del caso | No aparecían | Sección «Correos del caso» con su estado |
| Campana | Por aprobar y fallidos | No aparecían | Arriba, para el Administrador: «Correos de la cola», con la misma cuenta, y el enlace a la Bitácora |
| Coordinar visita (agendar y enviar el enlace) | La base genera R05 y R19 | — | Tras agendarVisita, ofertarVisita y enviarEnlace se vuelve a leer la cola si la conexión sabe recargar |
| Cancelar la solicitud | La base genera «Solicitud cancelada» | — | Igual: tras cancelarSolicitud y cancelarVisita |
| Garantías (recordatorios R01 a R04) | La base genera los correos | «Reenviar» dejaba el envío «Enviado» | «Reenviar» usa la regla de la cola (vuelve a la cola) y se vuelve a leer la cola tras las acciones de garantías |

**Qué cambió**
- **Módulo nuevo `sirius-notif-cola.js` (`SiriusNotifCola`):**
  - Una sola función lee la cola (`lista`) y la cuenta (`cuenta`, `deCaso`, `campana`). La Bitácora, la pestaña, el Historial y la campana usan esa misma.
  - `ops` aplica las reglas de las cuatro acciones. La usan la base simulada y el Back-office, que aplica lo mismo a su copia cuando la base responde `{ ok: true }`.
- **Bitácora:**
  - Filtros por estado («Por aprobar» primero y con su contador), regla, canal, caso y fecha.
  - Columnas: hora, caso, regla, destinatario (nombre, rol y correo), asunto, estado, intentos y motivo. «[Sin destinatario]» aparece resaltado.
  - Selección múltiple con «Aprobar» y «Rechazar…»; el motivo del rechazo es obligatorio.
  - En cada fila: «Ver correo», «Aprobar», «Rechazar…» y, si falló, fue rechazado u omitido, «Reenviar».
  - Arriba, «Enviar ahora» con el resultado («3 enviados · 1 fallido» y «Ver el fallido»).
  - Las filas de WhatsApp, SMS y En SIRIUS llevan «Simulado»: no salen todavía.
- **Ver correo:** De, Para y Asunto, y el correo armado con la plantilla y los datos del caso (banner, texto, tabla libre o de datos, botón y pie). Un dato que falta se marca «Sin dato».
- **Configuración de envío (pestaña nueva):**
  - Remitente en solo lectura: david.mena.coordinador@gmail.com.
  - Correo para notificaciones sin destinatario.
  - «Los mensajes a clientes y brókeres requieren aprobación» (Sí o No).
  - Por regla, «Requiere aprobación» (Heredar, Sí o No), con el resultado de cada una.
  - Los cambios se resaltan con «antes: …». La barra muestra «N cambios sin guardar · Motivo · Descartar · Guardar en la base».
- **Plantillas:**
  - Con la conexión, guardar una plantilla la publica en la base; con `{ ok: false }` se revierte.
  - «Enviar prueba a mi correo» pide la acción `enviarPruebaNotificacion` para el usuario actual, con la plantilla guardada y el caso de la vista previa. La base todavía no la tiene: la pantalla avisa y no la simula. Sin la conexión, queda «Pendiente» en la cola de ejemplo.
- **Reenviar:** un correo fallido, rechazado u omitido vuelve a la cola: «Pendiente» si ya estaba aprobado, o «Por aprobar» si necesita aprobación.

**Prueba cruzada** (`cxnotifcola`, conexión simulada: aprobar el R05 del cliente del caso 50012, ENV-5801)

| Dónde | Antes | Después de «Aprobar» | Después de «Enviar ahora» |
|---|---|---|---|
| Base (`notificacionesEnvio[]`) | Por aprobar | Pendiente | Enviado |
| Bitácora (fila ENV-5801) | Por aprobar | Pendiente («Aprobó Andrea Salazar») | Enviado |
| Pestaña | Bitácora (4 por aprobar) | Bitácora (3 por aprobar) | Bitácora (3 por aprobar) |
| Historial del caso 50012 | Por aprobar | Pendiente | Enviado |
| Campana | «4 correos por aprobar · 1 fallido», con el R05 al cliente | «3 correos por aprobar · 1 fallido», sin ese R05 | Igual: el R05 ya no espera al Administrador |

Lo que se envió a la base en la escena:
- `aprobarNotificacion { ids: ['ENV-5801'] }` → `{ ok: true, mensaje: '1 correo aprobado: sale en el siguiente minuto' }`
- `enviarNotificacionesAhora {}` → `{ ok: true, enviados: 3, fallidos: 0 }`
- `rechazarNotificacion { ids: ['ENV-5804'], motivo: 'La cancelación la comunica el ejecutivo' }` → Rechazado
- `reenviarNotificacion { id: 'ENV-5807' }` → de Fallido a Pendiente
- `publicarConfiguracion { clave: 'SIRIUS_NOTIFICACIONES', … }` con `envio` dentro y sin la cola
- `enviarPruebaNotificacion` → la base respondió «Acción desconocida» y la pantalla avisó sin crear nada

**Verificado (1280×720 y 1920×1080)**
- Las 5 escenas nuevas y 16 que ya existían (Notificaciones, el P-6g-2 `cxnotificaciones`, Garantías, Coordinar visita e Inicio) abren sin error de página: 21 por tamaño.
- `notifporaprobar`: elegí 3 y «Aprobar» los dejó «Pendiente». La pestaña bajó a cero y la campana pasó de «4 por aprobar · 1 fallido» a «1 fallido». «Rechazar…» sin motivo muestra el error; con motivo queda «Rechazado».
- `notifenviar`: «3 enviados · 1 fallido». El R01 a una dirección no válida queda «Fallido» con el motivo, y «Reenviar» lo devuelve a «Pendiente».
- `notifverkorreo`: el correo del R05 del caso 20137 con De, Para, Asunto («…agendada para el 11/10/26») y la tabla de la visita con los datos del caso.
- `notifconfig`: dos cambios con «antes: …»; sin motivo no guarda; con motivo queda en `SIRIUS_NOTIFICACIONES.envio`. Con la conexión simulada sale `publicarConfiguracion` con `envio` y sin la cola.
- «Enviar prueba a mi correo»: con la conexión avisa sin simular; sin ella deja una prueba «Pendiente».
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real en GitHub (SQL 58 y la función sirius-notificar): el envío real cada minuto, los motivos reales de «Fallido» y el nombre exacto de la regla de cancelación. Aquí uso «Solicitud cancelada» como identificador de la regla.
- `enviarPruebaNotificacion`: el nombre y la forma `{ plantilla, caso, destinatario, destinatarioNombre, asunto }` son una propuesta.
- Que tras agendar, enviar el enlace o cancelar aparezcan los correos nuevos sin recargar la página. Depende de que la conexión tenga `recargar('notificacionesEnvio')`; si no lo tiene, aparecen al volver a abrir SIRIUS.

**Diferencias**
- **«Configuración de envío»** es una pestaña de Notificaciones, no una entrada aparte del menú de Administración.
- **«Reenviar»** ahora devuelve el correo a la cola en lugar de marcarlo «Enviado». También aplica en la escena `cxnotificaciones` de P-6g-2.
- **Sin la conexión**, la Bitácora muestra la cola de ejemplo junto con la bitácora antigua (entregados, leídos, invitaciones y pruebas). Esas filas antiguas no tienen acciones.
- **La campana** no cuenta los correos como «sin leer»: es un resumen arriba, como el de Calificación.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `notifporaprobar` | Andrea Salazar · Administrador | Bitácora en «Por aprobar» (2 R05, 1 R19 y 1 cancelada), para aprobar 3 y rechazar 1 con motivo |
| `notifenviar` | Andrea Salazar · Administrador | «Enviar ahora» con «3 enviados · 1 fallido» y la fila «Fallido» con «Reenviar» |
| `notifverkorreo` | Andrea Salazar · Administrador | «Ver correo» del R05 del caso 20137 con los datos del caso |
| `notifconfig` | Andrea Salazar · Administrador | Configuración de envío y aprobación por regla |
| `cxnotifcola` | Andrea Salazar · Administrador (conexión simulada) | La cola de la base del caso 50012, lo que se envía en cada acción y la prueba cruzada |

También abrí `notifreglas`, `notifregla`, `notifnueva`, `notifplant`, `notifver`, `notifcanales`, `notifbitacora`, `notifeditor`, `notifprueba`, `notifvariables`, `notifcasoaviso`, `cxnotificaciones`, `cxgarantiacumplir`, `cxvisitacancelar`, `coordagendada` e `inicio`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 11:29 · fin 18/11/2026 12:03 · 34 min**

---

## 18/10/2026 · 20:30 — Etapa U-3a2

Publiqué la versión 312 de SIRIUS. Usuarios y roles ya no falla si `sirius-usuarios-ficha.js` termina de cargar después del primer dibujo: muestra «Cargando usuarios…» y, cuando el archivo llega, vuelve a dibujar y aparece la lista. Apliqué la misma corrección que ya está en GitHub y revisé las demás páginas.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué usa de un archivo que carga la propia página | Antes | Ahora |
|---|---|---|---|
| Usuarios (lista) | `SiriusUsuariosFicha.Lista` | Si el objeto aún era null: «Cannot read properties of null (reading 'Lista')» y la página no se recuperaba | «Cargando usuarios…» y, al llegar el archivo, la lista |
| Usuarios (ficha abierta) | `SiriusUsuariosFicha.Ficha` | Igual | Igual que la lista |
| Liquidaciones (panel del honorario) | `SiriusHonorarioPanel` | Si no estaba, el panel no se dibujaba y no se volvía a intentar | «Cargando honorarios…» y, al llegar, el panel |
| Agenda, Configuración general, Mi perfil, Liquidaciones (ventanas) | `SiriusModal` | Si no estaba, usan el modal del sistema de diseño | Sin cambios |
| Las demás páginas | Objetos de archivos que carga el Back-office al inicio | — | Sin cambios |
| Escena `cargatardia` | — | No existía | Usuarios con el archivo de la ficha 1 s tarde |

**Qué cambió**
- **`Usuarios.dc.html`** (igual que en GitHub):
  - `ufEsperar()`: si `window.SiriusUsuariosFicha` no está, revisa cada 150 ms durante 20 s como máximo; cuando llega (o se acaba el tiempo) vuelve a dibujar la página con `setState` y `fk + 1`.
  - `ufCargando()`: llama a `ufEsperar()` y muestra «Cargando usuarios…»; si pasaron los 20 s, «No se pudo cargar la lista de usuarios: recarga con Ctrl+F5.»
  - `ufListaNode()`: si `this.UF()` es null, devuelve `ufCargando()`.
  - `ufFichaNode()`: si no hay ficha abierta devuelve null; si `this.UF()` es null, devuelve `ufCargando()`.
- **`Liquidaciones.dc.html`:** `glEsperar(nombre)` espera el objeto con el mismo método (150 ms, 20 s) y `drawerHon()` muestra «Cargando honorarios…» mientras `SiriusHonorarioPanel` no esté.
- **Escena `cargatardia`:** igual que `usrlista`, pero el Back-office retrasa 1 s la entrada de `sirius-usuarios-ficha.js` al `<head>`. El segundo se cuenta desde que desaparece «Preparando tu espacio de trabajo», para que «Cargando usuarios…» se vea.

**Páginas revisadas** (las 33 `.dc.html`)
- **Corregidas (2):** Usuarios y Liquidaciones.
- **Revisadas sin cambio, con riesgo cubierto (3):** Agenda, Configuración general y Mi perfil. Usan `SiriusModal` y, si falta, el modal del sistema de diseño.
- **Revisadas sin cambio (28):** Calificación, CalificacionRG, Campos, Catálogos, Cola de calificación, Conflictos, Coordinación, DataTable, DocumentoPdf, EditorPlantilla, FilterBar, Flujo, Formularios, FotosEvidencias, Garantías y políticas, InformeRG, Inicio, Inspector, Modelos, Motores de IA, Niveles, Notificaciones, Nueva solicitud, Nueva solicitud (revisión), Portal, SalidaVeh, Login y el Back-office. Los objetos que usan (`SiriusLiqProceso`, `SiriusGarantiasBase`, `SiriusColaCalificacion`, `SiriusCobertura` y otros) también los carga el Back-office al inicio.
- **Cómo lo comprobé:** para cada objeto `Sirius…` que usa una página, busqué en qué archivo se define y si el Back-office lo carga al inicio. Solo tres objetos se definen únicamente en archivos que carga la página: `SiriusUsuariosFicha` (Usuarios), `SiriusHonorarioPanel` (Liquidaciones) y `SiriusModal` (cuatro páginas).

**Verificado (1280×720 y 1920×1080)**
- `cargatardia`: «Cargando usuarios…» y, al llegar el archivo, la lista con 12 filas, sin error de página y sin desborde horizontal.
- Con la copia anterior de Usuarios, la misma escena reproduce el error de GitHub y no se recupera. Con la corrección se recupera.
- Si el archivo nunca llega, a los 20 s aparece «No se pudo cargar la lista de usuarios: recarga con Ctrl+F5.».
- 12 escenas sin error de página a cada tamaño: `cargatardia`, `usrlista`, `usrficha`, `usrsinguardar`, `usrnuevo`, `cxusrcobertura`, `honoragencia`, `honorsubasta`, `honormoto`, `agenda`, `cobertura` y `coberturalectura`.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- «Cargando honorarios…» en Liquidaciones: no pude provocarlo. Con el archivo retrasado, la página no llega a dibujar el panel antes de que llegue. Comprobé la sintaxis y que las escenas de honorarios abren sin error.
- Que en GitHub los archivos del Back-office lleguen siempre antes de dibujar cada página: las 120 etiquetas `<script>` se añaden sin esperar. Hasta ahora solo falló Usuarios.
- En las pruebas con el navegador aparecen dos avisos de consola que ya estaban antes: un archivo que no se encuentra (404) y un `<path d="{{ n.d }}">` sin reemplazar. No son de esta etapa.

**Diferencias**
- La espera de Usuarios es igual a la de GitHub. La de Liquidaciones es mía: usa el mismo método, con otro nombre (`glEsperar`).
- No cambié ninguna acción de la base ni ninguna pantalla cuando los archivos llegan a tiempo.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `cargatardia` | Andrea Salazar · Administrador (conexión simulada) | Usuarios con el archivo de la ficha 1 s tarde: «Cargando usuarios…» y luego la lista |

También abrí `usrlista`, `usrficha`, `usrsinguardar`, `usrnuevo`, `cxusrcobertura`, `honoragencia`, `honorsubasta`, `honormoto`, `agenda`, `cobertura` y `coberturalectura`.

Registré la respuesta completa en `registro-envios.md` y actualicé `inventario-proyecto.md`.

**Tiempo de la etapa: inicio 18/11/2026 07:48 · fin 18/11/2026 08:04 · 16 min**

---

## 18/10/2026 · 20:30 — Etapa U-3a

Publiqué la versión 309 de SIRIUS. Usuarios tiene una lista con filtros y alertas y una sola ficha editable, que reemplaza «Ver» y «Editar». También encontré y corregí la causa del caso de Alexandre Abascal: la cobertura que quedaba solo en la sesión tenía prioridad sobre la de la base. Ahora la ficha parte de lo que tiene la base y marca «Sin guardar en la base» cuando no coincide (DEC-254). Las acciones de la base son las mismas: crearUsuario, editarUsuario, cambiarEstadoUsuario y reinvitarUsuario.

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Qué toma del usuario | Antes | Ahora |
|---|---|---|---|
| Usuarios › lista | Todo | Tabla con «Ver ficha» (ojo), «Editar» (lápiz) y un menú; sin búsqueda ni alertas | Búsqueda y filtros (rol, tipo, agencia, estado, «Sin cobertura»), alertas «N invitados · N sin cobertura», clic en la fila = ficha, una sola acción «⋯» |
| Usuarios › ficha | Todo | Dos vistas: «Ver» (con la cobertura y su propio guardado) y «Editar» (sin la cobertura) | Una ficha: secciones editables, cambios resaltados, un solo editarUsuario; lo guardado manda |
| Agencias (inspectores por RUC) | tipo, agencia, agenciaRuc | Por RUC (`inspectoresDeAgencia`) | Igual; el tipo y la agencia se cambian en la ficha (editarUsuario manda agenciaRuc) |
| Coordinar visita (candidatos por cobertura y zonas; «Agrupar por dirección») | cobertura, tipo, agencia | Un inspector de la base sin cobertura ni zonas contaba como «Todas» | Sin cobertura no es candidato («fuera de cobertura»); «Agrupar por dirección» no usa datos del usuario: sin cambios |
| Agenda (filas de inspectores) | tipo, agencia, cobertura, jornada | Igual | Sin cambios en la pantalla; refleja lo guardado |
| App del inspector (ofertas) | cobertura, recibe ofertas | Las ofertas van a quien cubre | Igual; «Recibe ofertas» queda en la ficha y en la base |
| Liquidaciones (proveedor y tipo de inspector) | tipo, agencia, identificación | El inspector ve «Mis honorarios» según su tipo y agencia | Sin cambios en la pantalla; la ficha muestra «Honorarios» con la misma regla (`proveedorDe`) |
| Inicio del Administrador (alertas) | estado, identificación | «Invitaciones pendientes» y «Fichas sin identificación» llevan a la lista filtrada | Igual: abren la lista nueva con el filtro |
| Ciudades y zonas (zonas usadas por cada inspector) | cobertura | `conZona` lee la cobertura de cada inspector | Igual; ahora sin cobertura no cuenta |
| Historial del usuario | Cambios | Panel aparte | Sección «Historial» de la ficha (con la conexión, lo enviado a la base) |
| Página de entrada (activación e invitación por correo) | correo, estado | Enlace de activación en la ficha | Igual; además, «Invitación enviada por correo a …» cuando la base dice que salió, o el enlace con «Copiar enlace» |

**Qué cambió**
- **Lista:**
  - Búsqueda por nombre, correo o identificación, y filtros por rol, tipo, agencia y estado.
  - Columnas: usuario y correo, identificación (o «Sin identificación»), roles, tipo y agencia, cobertura («Sin cobertura» en rojo para los inspectores), estado («Invitado · vence en 3 d») y último acceso.
  - Arriba, las alertas: «3 invitados (1 por vencer)» y «2 sin cobertura», que filtran la lista.
  - Un clic en la fila abre la ficha. Cada fila tiene una sola acción «⋯». Se quitaron el ojo y el lápiz.
- **Ficha única:**
  - Cabecera: avatar, nombre, correo, último acceso, estado, roles y tipo, con «Volver a invitar» e «Inactivar…».
  - Índice a la izquierda (con un punto donde hay cambios) y secciones: Datos e identificación, Acceso y roles, Inspección, Cobertura y zonas (mapa con las zonas marcadas y lista), Jornada, Facultad, Pagos e Historial.
  - Quien no es inspector no ve Inspección, Cobertura ni Jornada.
- **Guardar:**
  - Cada cambio se resalta con su valor anterior («antes: Interno»).
  - La barra fija «N cambios sin guardar · Motivo · Descartar · Guardar en la base» envía un solo editarUsuario con todos los cambios.
  - Si la base rechaza un cambio, el mensaje sale en su sección y el cambio sigue resaltado, con «Sin guardar en la base».
  - Al guardar con éxito, la ficha vuelve a leer la base.
- **Correo de acceso:**
  - De un Activo no se escribe encima: «Cambiar correo…» abre «Volver a invitar» con «Correo nuevo» y el aviso de desvinculación.
  - De un Invitado, cambiarlo y guardar genera una invitación nueva.
  - Después se muestra «Invitación enviada por correo a …» o, si no salió, el enlace con «Copiar enlace».
- **Crear:** «Invitar usuario» abre la misma ficha en modo nuevo. Una cédula o un correo repetidos muestran el mensaje junto al campo con «Abrir la ficha de …».

**Prueba cruzada** (escena `cxusrcobertura`, con la conexión simulada: Alexandre Abascal pasa a Agencia · Eurosurvey y a la cobertura Quito Norte y Centro)

| Dónde | Antes de guardar | Después de «Guardar en la base» |
|---|---|---|
| Ficha | Interno · Sin cobertura | Agencia · Eurosurvey · «Atiende en Quito (Norte y Centro)» · Honorarios: los liquida Eurosurvey |
| Lista | Interno · «Sin cobertura» | Eurosurvey · «Quito: Norte y Centro» |
| Agencias | Eurosurvey: 4 inspectores (sin él) | Eurosurvey: 5 inspectores (Mauricio Endara, Alexandre Abascal, …) |
| Agenda | «Alexandre Abascal · Interno · Sin cobertura» | «Alexandre Abascal · Agencia · Eurosurvey · Quito: Norte y Centro» |
| Coordinar visita (50012, lugar en Quito, zona Norte) | «Alexandre Abascal (fuera de cobertura)» | En «Cubren la zona Norte (1)»: Alexandre Abascal · Agencia Eurosurvey |
| Liquidaciones (la regla del proveedor) | Interno: sin proveedor | Proveedor: agencia Eurosurvey (RUC 1791456320001) |

Todas coinciden.

**Verificado (1280×720 y 1920×1080)**
- Sin errores: las 8 escenas nuevas (con sus variantes `?fsesion=1`, `?fcorreo=0` y `?fpaso=panel`), `maestrosusuarios` (y `?fid=valida`), `usrreinvitar` (y `?rvista=enlace`), `usrcambiocorreo` y `cxusuarios`. También `cxusuarioeditar`, `cxusuariocrear`, `cxreinvitar`, `cobertura`, `coberturalectura`, `usuarioficha` y `maestrossinid?fvista=editar`.
- Con clics:
  - Lista: el menú «⋯», el filtro «2 sin cobertura» y el clic en la fila.
  - Ficha: guardar los 3 cambios (la ficha se recarga sin la barra y la cabecera dice «Agencia · Eurosurvey»), «Descartar», el rechazo de la cobertura y «Usar lo de la sesión».
  - Crear: con el correo enviado y sin enviar; la cédula repetida y «Abrir la ficha de Alexandre Abascal».
  - Correo nuevo de un Activo.
- Sin la conexión: invitar (`maestrosusuarios`, con el error de la cédula junto al campo), volver a invitar y la ficha de un usuario de ejemplo.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La prueba con la base real en GitHub, incluido si la respuesta de crearUsuario y reinvitarUsuario trae `correoEnviado` (también se acepta `correo.enviado`; sin el dato, la ficha muestra el enlace).
- Liquidaciones en pantalla: la sesión simulada es del Administrador. Verifiqué la regla del proveedor (la misma función que usa la ficha), no la vista «Mis honorarios» del inspector.

**Diferencias**
- Un inspector de la base sin cobertura ni zonas ahora queda «Sin cobertura» y no es candidato. Antes contaba como «Todas».
- «Modalidades», «Ramos», «Recibe ofertas», «Sucursal» y «Jornada» son campos nuevos de editarUsuario. Las otras pantallas todavía no los leen de la base, salvo la Agenda sin la conexión.
- Sin «Gestionar usuarios» (por ejemplo, un Coordinador), la ficha sigue siendo la de antes, en solo lectura.
- Sin la conexión, el menú «⋯» mantiene Reenviar invitación, Revocar, Suspender y Reactivar, que siguen existiendo en esa fuente.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `usrlista` | Andrea Salazar · Administrador | Lista con filtros, alertas y Alexandre Abascal «Sin cobertura» |
| `usrficha` | Andrea Salazar · Administrador | Ficha de Alexandre Abascal con 3 cambios resaltados y la barra de guardar |
| `usrfichanoinsp` | Andrea Salazar · Administrador | Ficha de Carla Ponce (Finanzas de agencia), sin Inspección ni Cobertura |
| `usrsinguardar` | Andrea Salazar · Administrador | La base rechaza la cobertura: mensaje y «Sin guardar en la base» (`?fsesion=1`: la cobertura solo en la sesión) |
| `usrnuevo` | Andrea Salazar · Administrador | Ficha en modo nuevo: «Invitación enviada por correo a …» (`?fcorreo=0`: el enlace) |
| `usrduplicado` | Andrea Salazar · Administrador | Cédula repetida con «Abrir la ficha de Alexandre Abascal» |
| `usrcorreonuevo` | Andrea Salazar · Administrador | Correo nuevo de Mauricio Endara: aviso de desvinculación e invitación enviada (`?fpaso=panel`) |
| `cxusrcobertura` | Andrea Salazar · Administrador | La prueba cruzada en la lista, Agencias, la Agenda y Coordinar visita |

También abrí `maestrosusuarios`, `usrreinvitar`, `usrcambiocorreo`, `cxusuarios`, `cxusuarioeditar`, `cxusuariocrear`, `cxreinvitar`, `cobertura`, `coberturalectura`, `usuarioficha` y `maestrossinid`.

**Tiempo de la etapa: inicio 18/11/2026 06:12 · fin 18/11/2026 06:52 · 40 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-2e

Publiqué la versión 306 de SIRIUS. «Agrupar por dirección» volvió, esta vez dentro de Coordinar visita, en la barra de vehículos. Muestra las propuestas de visita por dirección, «Usar esta agrupación» deja seleccionados esos vehículos y, al ofertar o agendar, se ofrece seguir con la siguiente propuesta. No cambió ninguna otra función (DEC-252).

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes (P-6g-2d) | Ahora |
|---|---|---|
| Coordinar visita › barra de vehículos | Modalidad y vehículos (casillas); sin forma de armar visitas por dirección | Se suma «Agrupar por dirección» (solo casos de Vehículos con varios riesgos y visita nueva). Abre el panel con las propuestas |
| Coordinar visita › fases (Contacto, Lugar, Inspector y horario) | Contacto y Lugar con los vehículos marcados a mano | «Usar esta agrupación» cambia los vehículos y el lugar por defecto (la dirección de la propuesta); el contacto y lo escrito no se pierden |
| Coordinar visita › pie con la oferta enviada | «Anular oferta…», «Volver al caso», «Siguiente caso» | Suma «Coordinar la siguiente: 1 vehículo en Av. …» si la visita salió de una agrupación y quedan vehículos libres |
| Aviso de la visita agendada (tras «Agendar visita») | «Entendido» | Suma «Coordinar la siguiente: …» en las mismas condiciones; el aviso se ensancha para que el botón quepa |
| Pestaña Coordinación › franja de estado | «2 de 3 agendados», «Oferta enviada a N…» | Sin cambios de diseño; debe coincidir con las visitas que crea cada propuesta |
| Pestaña Riesgos | Estado, inspector y visita de cada vehículo | Sin cambios; debe coincidir con la franja |
| Agenda | Las visitas por inspector | Sin cambios |
| Bandeja | Estado del caso, vehículos y responsable | Sin cambios; debe coincidir con la franja |
| Pestaña Coordinación › «Vehículos por coordinar» | Salió en P-6g-2d | Sigue sin estar; la función vive en Coordinar visita |
| Cabecera «Coordinar visita», «Registrar contacto», menú «⋯» | Abren Coordinar visita | Sin cambios |

**Qué cambió**
- **«Agrupar por dirección» (barra de vehículos):**
  - Muestra una propuesta por dirección: «Visita propuesta 1 · 2 vehículos · PRB1212, PR121A» y su dirección.
  - Los vehículos que ya están en una visita abierta no aparecen.
  - Si no queda ninguno: «No quedan vehículos por coordinar: todos están en una visita abierta (V1, V2).»
  - Con la oferta enviada se puede abrir, pero «Usar esta agrupación» queda apagado («Para cambiar los vehículos, anula la oferta.»).
- **«Usar esta agrupación»:** deja seleccionados esos vehículos para la visita que se está coordinando y pone su dirección como lugar por defecto; la propuesta en uso dice «En uso». Si la modalidad quedara bloqueada para esos vehículos, pasa a Presencial, como al marcar un vehículo.
- **Seguir con la siguiente:**
  - Tras ofertar, el pie suma «Coordinar la siguiente: 1 vehículo en Av. de los Shyris y Nacio…».
  - Tras agendar, el aviso de la visita trae el mismo botón.
  - Abre Coordinar visita con los vehículos de la siguiente propuesta ya seleccionados, el mismo contacto y la misma modalidad (si sirve), en la fase Lugar.
- **Una sola función (DEC-252):** las propuestas del panel, el botón «Coordinar la siguiente», el aviso tras agendar y la propuesta de la pestaña salen de `propuestasDe`; ninguna pantalla agrupa por su cuenta.
- **Con y sin la conexión:** igual. Sin la conexión, el caso 20196 de ejemplo (3 vehículos, 2 direcciones).

**Prueba cruzada (caso de 3 vehículos en 2 direcciones: agrupar, crear las 2 visitas y comparar)**

| Paso (escena `coordagrupar`, con la conexión simulada) | Resultado |
|---|---|
| «Agrupar por dirección» | 2 propuestas: 1 = PRB1212 y PR121A (Av. Mariscal Sucre S12-45 y Ajaví); 2 = PRB1213 (Av. de los Shyris y Naciones Unidas, La Carolina) |
| «Usar esta agrupación» en la 1 | PRB1212 y PR121A marcados, PRB1213 no; Lugar «Quito · zona Sur · de la solicitud, por revisar»; la propuesta 1 dice «En uso» |
| Agendar la V1 (13:45, Cristian Vaca) | «Visita V1 agendada» con «Coordinar la siguiente: 1 vehículo en Av. de los Shyris y Nacio…» |
| «Coordinar la siguiente» | Solo PRB1213 marcado, Lugar «Quito · zona Norte», misma modalidad (Presencial) |
| Agendar la V2 (15:00, Mauricio Endara) | «Visita V2 agendada»; ya no hay botón de siguiente |

| Dónde se mira | Qué dice |
|---|---|
| Franja de la pestaña Coordinación | «Coordinación 3 de 3 agendados» |
| Encabezado del caso | «3 de 3 agendados» |
| Pestaña Riesgos | PRB1212 y PR121A: Agendado, Cristian Vaca, V1 · 16/10 13:45. PRB1213: Agendado, Mauricio Endara, V2 · 16/10 15:00 |
| Bandeja | 50012 · 3 vehículos · Agendado · responsable Cristian Vaca |

Las cuatro pantallas coinciden. La escena `coordagrupar?fpaso=oferta` (oferta de la V1) deja el pie con «Coordinar la siguiente»; `coordagrupartodos` (V1 agendada y PRB1213 ofertada) dice que no quedan vehículos.

**Verificado (1280×720 y 1920×1080)**
- Las 2 escenas nuevas (con sus 4 variantes `?fpaso=`), `coordtabresumen`, `coordofertaabierta`, `coordagendada`, `coordsinguardar`, `coord`, `coordfases`, `cxcoordfases` y `coordoferta`, sin errores de página.
- Con clics, a los dos tamaños: usar la 1 y la 2, el estado «En uso», ofertar y seguir, agendar y seguir, el panel con la oferta enviada y con todos los vehículos en visitas, y el recorrido completo de la prueba cruzada.
- Sin la conexión (caso 20196): «Agrupar por dirección» propone 2 visitas (2 vehículos y 1), «Usar esta agrupación», agendar la primera y «Coordinar la siguiente» con el vehículo restante.
- Sin regresiones de P-6g-2d: pie con oferta abierta, «Anular oferta…», visita agendada, «Cancelar visita…» y «Salir» con y sin datos.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La prueba con la base real en GitHub.
- La Agenda con las 2 visitas nuevas: la Agenda semanal muestra la semana real (noviembre) y las visitas de la escena son de octubre. La Agenda no cambió en esta etapa.

**Diferencias**
- «Agrupar por dirección» ya no está en la pestaña Coordinación (donde lo sacó P-6g-2d) ni como lista con casillas; está en la barra de vehículos de Coordinar visita. «Crear visita con los seleccionados» no vuelve: la visita se arma en Coordinar visita con los vehículos de la barra.
- En una visita que se reagenda (por ejemplo, desde la Agenda) no se ofrece «Agrupar por dirección»: ahí no se arman visitas nuevas.
- «Coordinar la siguiente» aparece solo si la visita salió de una agrupación y quedan vehículos libres.
- El aviso de la visita agendada es más ancho cuando trae «Coordinar la siguiente» (para que el texto no se corte).

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `coordagrupar` | Andrea Salazar · Coordinador | 50012 con 3 vehículos en 2 direcciones: panel con 2 propuestas. `?fpaso=usar`, `oferta`, `agendar` o `siguiente` recorren el camino |
| `coordagrupartodos` | Andrea Salazar · Coordinador | V1 agendada y PRB1213 ofertada: «No quedan vehículos por coordinar…» |

También abrí `coordtabresumen`, `coordofertaabierta`, `coordagendada`, `coordsinguardar`, `coord` (20196, sin la conexión), `coordfases`, `cxcoordfases` y `coordoferta`.

**Tiempo de la etapa: inicio 18/11/2026 01:13 · fin 18/11/2026 01:42 · 29 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-2d

Publiqué la versión 302 de SIRIUS. La pestaña Coordinación ya no repite botones: arriba, una franja de resumen; luego Contacto, de solo lectura, y Visitas del caso. La única entrada a Coordinar visita es la acción principal de la cabecera. En Coordinar visita, el pie cambia según lo que ya se envió o agendó. No cambió ninguna función, solo desde dónde se activa (DEC-252).

**Mapa de impacto (hecho antes de cambiar)**

| Lugar | Antes | Ahora |
|---|---|---|
| Pestaña Coordinación › arriba | Bloque grande «Recomendación del sistema»: puntaje, alertas y modalidad con su motivo | Franja de una línea: puntaje y nivel, modalidad recomendada (el motivo en la ayuda al pasar el cursor), «N alertas», que abre la lista, y estado de la coordinación |
| Pestaña › «Intentos de contacto» | «Llamar y registrar intento», «Enviar enlace de autoagendamiento» y «Cancelar la solicitud…»; tarjeta del enlace con reenviar y generar | «Contacto»: el historial de intentos y enlaces, de solo lectura, con un único «Registrar contacto» que abre Coordinar visita › Contacto |
| Pestaña › «Vehículos por coordinar» (varios riesgos) | Casillas, «Agrupar por dirección», «Crear visita con los seleccionados» y «Crear esta visita» | Sale. Los vehículos se eligen en la barra de Coordinar visita; el estado de cada uno está en la franja («2 de 3 agendados») y en la pestaña Riesgos |
| Pestaña › tarjeta «Coordinar inspección» (un riesgo) | «Coordinar visita» | Sale |
| Pestaña › «Visitas del caso» | Sin visitas: «Aún no hay visitas agendadas para este caso.» | Sin cambios en las tarjetas. Sin visitas: «Aún no hay visitas. Usa «Coordinar visita» arriba.», sin botón |
| Cabecera › acción principal | «Coordinar inspección» o «Agendar visita» solo bajaban a la pestaña. «Coordinar visita» abría Coordinar visita cuando ya había visitas | «Coordinar visita» abre siempre Coordinar visita con lo que falta por coordinar. «Ver visita» sigue igual |
| Cabecera › menú «⋯» | «Agendar · abre Coordinación» y «Cancelar por coordinación» (transiciones del flujo; la segunda abría la ventana genérica de cancelar) | «Agendar» no se repite cuando la cabecera ya abre Coordinar visita. «Cancelar la solicitud…» abre Coordinar visita › Contacto con la cancelación y el motivo del catálogo |
| Coordinar visita › pie | Siempre «Salir · ← fase anterior · secundaria · principal». Con la oferta enviada: «Anular oferta» (sin confirmar) y «Listo · siguiente caso»; «Salir» preguntaba aunque no hubiera nada que guardar | Según el estado: edición como antes; oferta abierta: franja, «Anular oferta…» (confirma), «Volver al caso» y «Siguiente caso»; visita agendada sin cambios: «Cancelar visita…», «Volver al caso» y «Siguiente caso» |
| Coordinar visita › Contacto y Lugar con la oferta abierta | Se podían editar | Se ven, pero no se editan: «Para cambiar el lugar (o el contacto), anula la oferta.» |
| Bandeja › acción «Coordinar inspección» de la fila | Abre el caso en la pestaña Coordinación | Sin cambios |
| Agenda › abrir la coordinación de una visita | Coordinar visita en «Reagendar», pie de edición | Igual, con el pie de visita agendada hasta que cambie algo |
| Inicio del Coordinador › «Para hoy» | Abre la pestaña Coordinación | Sin cambios; ahí, la acción principal |

**Qué cambió**
- **Pestaña Coordinación:** franja de resumen, Contacto de solo lectura con «Registrar contacto» y Visitas del caso. Salieron la tarjeta «Coordinar inspección» y la lista de vehículos con «Crear visita».
- **Cabecera:**
  - La acción principal se llama «Coordinar visita» y es la única entrada a Coordinar visita desde la pestaña.
  - «Cancelar la solicitud…» está en el menú «⋯»; reemplaza a la transición «Cancelar por coordinación» cuando el caso está en coordinación.
- **Coordinar visita:**
  - El pie cambia según el estado: edición, oferta abierta o visita agendada.
  - «Anular oferta…» pide confirmación.
  - «Salir» y «Volver al caso» solo preguntan si hay algo escrito sin enviar.
  - «Listo · siguiente caso» pasa a «Siguiente caso».
  - «Cancelar visita…» abre la misma ventana con motivo de la tarjeta de la visita.
  - Los atajos siguen igual: Ctrl+Enter ejecuta la acción principal y Alt+← / Alt+→ cambian de fase.

**Prueba cruzada (cada función, desde dónde se activa)**

| Función | Antes | Ahora |
|---|---|---|
| Llamar y registrar el intento | Pestaña («Llamar y registrar intento») y Coordinar visita › Contacto | Coordinar visita › Contacto. En la pestaña, «Registrar contacto» lleva ahí |
| Enviar el enlace de autoagendamiento | Pestaña y Coordinar visita › Contacto | Coordinar visita › Contacto |
| Cancelar la solicitud | Pestaña, Coordinar visita › Contacto y menú «⋯» («Cancelar por coordinación», otra ventana) | Menú «⋯» («Cancelar la solicitud…», que lleva a Coordinar visita › Contacto) y Coordinar visita › Contacto |
| Coordinar (abrir Coordinar visita) | Cabecera (a veces solo bajaba), tarjeta «Coordinar inspección», «Crear visita con los seleccionados», «Crear esta visita» y «Agendar» del menú | Cabecera «Coordinar visita» |
| Ofertar | Coordinar visita › Inspector y horario | Sin cambios |
| Anular la oferta | Pie de Coordinar visita (solo en Inspector y horario, sin confirmar) y tarjeta de la visita en la pestaña | Pie de Coordinar visita («Anular oferta…», confirma, en cualquier fase) y tarjeta de la visita |
| Cancelar una visita | Tarjeta de la visita en la pestaña | Tarjeta de la visita y pie de Coordinar visita con la visita agendada («Cancelar visita…», la misma ventana con motivo) |
| Siguiente caso | Pie («Listo · siguiente caso», «Siguiente caso» sin contacto, «Agendar y siguiente») | Pie («Siguiente caso», «Agendar y siguiente») |

Ninguna de estas funciones se perdió y ninguna aparece dos veces en la misma pantalla. Sí salió el atajo «Agrupar por dirección» (ver Diferencias). En la pestaña quedan la cabecera «Coordinar visita» y el enlace «Registrar contacto»; los dos llevan a la misma pantalla, como pide la definición. La tarjeta de la visita y el pie de Coordinar visita están en pantallas distintas.

**Verificado (1280×720 y 1920×1080)**
- Las 4 escenas nuevas y 21 existentes de la pestaña y de Coordinar visita, sin errores: `coord`, `coordvis`, `coordrg`, `coordchoque`, `coordauto`, `coordfases`, `coordcontacto`, `coordcancelar`, `coordmarco`, `coordsalir`, `cxcoordfases`, `cxcabecera`, `coordcancelavisitas`, `cxcoordcontacto`, `coordoferta`, `coordautoinsp`, `coordvirtual`, `cxcoordins`, `cxcoordcambiar`, `coordenlaceauto` y `cxestadoparcial`.
- Con clics:
  - «Registrar contacto» y la cabecera abren Coordinar visita › Contacto.
  - «Cancelar la solicitud…» del menú lo abre con la cancelación desplegada.
  - «3 alertas» abre la lista de alertas.
  - Con la oferta: Lugar y Contacto bloqueados con su aviso; «Anular oferta…» → «Volver» la mantiene y «Anular oferta» vuelve al pie de edición. «Volver al caso» sale sin preguntar.
  - Visita agendada: al elegir «Libre 08:00» vuelve el pie de edición (pide el motivo del cambio); «Cancelar visita…» abre «Cancelar visita V1».
  - «Salir» sin nada escrito sale directo; con una nota pregunta.
- La pregunta al salir con la oferta enviada se reprodujo en la versión anterior (`coordoferta`, marcar un inspector, enviar y «Salir»). En esta versión ya no aparece.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La prueba con la base real en GitHub.

**Diferencias**
- «Agrupar por dirección» y las propuestas «Crear esta visita» salieron con la lista de vehículos: era otra entrada a Coordinar visita. Si quieres conservar la agrupación, puede ir en la barra de vehículos de Coordinar visita.
- La acción principal «Coordinar inspección» o «Agendar visita» ahora se llama «Coordinar visita» y abre Coordinar visita; antes solo bajaba a la pestaña.
- «Cancelar caso» del menú sigue para los demás roles y estados. En coordinación, para el Coordinador y el Administrador, se ve «Cancelar la solicitud…».
- Con la oferta abierta, la barra de modalidad y vehículos tampoco se edita en Contacto y Lugar; en Inspector y horario todo sigue como antes.
- La tarjeta del enlace de autoagendamiento en la pestaña es de solo lectura; se reenvía o se genera desde Coordinar visita › Contacto.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `coordtabresumen` | Andrea Salazar · Coordinador | 50012: franja «2 de 3 agendados», Contacto con «Registrar contacto», visitas y el menú «⋯» con «Cancelar la solicitud…» |
| `coordofertaabierta` | Andrea Salazar · Coordinador | V3 ofertada a 4: franja, «Anular oferta…», «Volver al caso», «Siguiente caso»; Lugar sin editar |
| `coordagendada` | Andrea Salazar · Coordinador | V1 agendada: «Cancelar visita…», «Volver al caso», «Siguiente caso» |
| `coordsinguardar` | Andrea Salazar · Coordinador | Nota escrita sin registrar: «Salir» pregunta |

También abrí `coord` (20196, con 3 alertas y «Sin contacto · 0 intentos»), `coordrg`, `coordfases`, `cxcoordfases`, `coordoferta`, `coordsalir` y `cxcabecera`.

**Tiempo de la etapa: inicio 17/11/2026 23:57 · fin 18/11/2026 00:17 · 20 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-2c

Publiqué la versión 300 de SIRIUS. Las cuatro secciones del panel de Calificación usan ahora una sola sección plegable (DEC-250). «Por calificar» sale de una sola función compartida, con la misma regla y la misma unidad en la bandeja, el menú Calificación, el Inicio y la campana (DEC-252).

**Mapa de impacto (DEC-252, hecho antes de cambiar nada)**

| Lugar | Qué mostraba antes | Qué muestra ahora |
|---|---|---|
| Bandeja › pestaña «En calificación» | Casos en «Pendiente calificación» o «de suscripción», más casos con un vehículo por calificar (solo con la conexión). Sin nivel y sin informes | Casos con al menos un informe por calificar de tu nivel (N) |
| Bandeja › «En suscripción» (Suscriptor) | Casos en «Pendiente calificación de suscripción» | Casos con informes de nivel 2 del Suscriptor |
| Bandeja › línea bajo las pestañas (nueva) | — | «Por calificar: N casos · M informes · V vencidos». Con filtros, dice también la cifra sin filtros |
| Bandeja › cada fila | «1 por calificar» solo con la conexión y fuera de calificación | «M por calificar» en toda fila con informes en tu cola; el título dice cuántos están vencidos |
| Bandeja › «SLA vencido» | SLA del caso | Además, los casos con un informe de tu cola con el SLA de calificación vencido |
| Bandeja › qué casos ve el Ejecutivo de inspecciones y el Suscriptor | Solo «su» ejecutivo o sus ramos | También los casos que tienen informes en su cola (si no, la bandeja contaba menos que el menú) |
| Menú Calificación › cabecera (nueva) | — | «Tu cola de nivel 1 / de nivel 2 / Cola de todos: N casos · M informes · V vencidos» |
| Menú Calificación › indicadores y pestañas | «Por calificar» = filas de nivel 1 (en casos o en informes según la conexión); «Vencidos» por su cuenta | «Por calificar» o «En suscripción» = M informes, «en N casos»; Vencidos = V; pestañas «Por calificar (M1)» y «En suscripción (M2)». «Ver: Mis riesgos / Todos» sigue filtrando |
| Menú Calificación › filas | El SLA del caso (con la conexión, el de coordinación) | Con la conexión, el SLA de calificación de cada informe (desde que quedó completo) |
| Inicio › Ejecutivo de inspecciones, tarjeta «Por calificar» y «Para hoy» | Filas «mías» de nivel 1 y «N con SLA vencido» | M informes y «Informes en N casos · V vencidos»; «Para hoy», una fila por caso |
| Inicio › Suscriptor, tarjeta «En suscripción» | Casos (no informes) y el grupo | M informes y «Informes en N casos · V vencidos» |
| Inicio › Administrador | No tiene tarjeta de calificación; «Casos por estado» cuenta casos por estado del flujo | Sin cambios: «Casos por estado» lleva su propio nombre |
| Campana (nueva línea) | — | Ejecutivo de inspecciones, Suscriptor y Administrador: «Por calificar · N casos · M informes · V vencidos» y «Calificación ›». No cuenta como aviso sin leer |
| Caso › pestaña Riesgos, columna de calificación | «Por calificar» a todo vehículo inspeccionado sin veredicto | Con la conexión, la misma regla: «Por calificar», «Determinado por el inspector · Dentro de su facultad» o «Esperando informe» |
| Monitor del proceso, Historial, PDF, app del inspector, portal del cliente | No muestran «por calificar» | Sin cambios |
| Menú lateral › Calificación | Sin contador | Sin cambios |
| Datos de la conexión | informes[] (estado, decision, fueraFacultad, completadoEn) y calificaciones[] (nivel, hora) | Los mismos campos; el contrato no cambia |

**Qué cambió**
- **Evidencias plegable (DEC-250):**
  - Las cuatro secciones (Recomendaciones del inspector, Resumen del informe, Evidencias, Puntaje y controles) se dibujan con la misma sección plegable, `SiriusCalGar.plegable`.
  - Las cuatro comparten el encabezado (botón con aria-expanded), el indicador ▾/▸ y el estado recordado por usuario.
  - Plegada, una sección muestra solo su contador; Evidencias, por ejemplo, «18 fotos · 2 doc.».
  - El clic lee el estado del momento, no el del último dibujo.
- **Una sola fuente (DEC-252):**
  - `sirius-cola-calificacion.js` (`SiriusColaCalificacion`) toma la cola de `SiriusCalificacion.cola`.
  - Da `resumen(cola, rol)`: N casos, M informes, V vencidos, por caso y por nivel, y el texto «N casos · M informes · V vencidos».
  - La usan la bandeja, el menú, el Inicio y la campana. `cxNPorCal` salió.
- **Regla:**
  - Por calificar = informe completo sin el veredicto del nivel que le toca, en un caso no cancelado ni emitido.
  - Llega por estar fuera de facultad o porque se envió a calificación. Un informe completado dentro de la facultad de quien lo completó ya no está por calificar.
  - Nivel 1 = Ejecutivo de inspecciones; nivel 2 = Suscriptor.
  - Cada usuario ve los de su nivel que son suyos (responsable, cola compartida o grupo); el Administrador y los roles sin nivel ven todos.
- **SLA de calificación con la conexión:** corre desde que el informe quedó completo (nivel 1) o desde la calificación de nivel 1 (nivel 2), con el plazo de la etapa del flujo.

**Verificado**
- Prueba cruzada a 1280×720 y 1920×1080, con y sin la conexión (tabla abajo): todas las cifras coinciden en cada lugar.
- `calevidplegable` y `calgarnueva`:
  - Cada sección se pliega y se abre con un clic; Evidencias, también con dos clics seguidos.
  - Plegada, se ve su contador.
  - El estado queda en `sirius.cal.panel.<usuario>` y sigue igual al recargar.
- Caso 50051, pestaña Riesgos: PBA5101 «Por calificar», PBA5102 «Determinado por el inspector», PBA5103 «Esperando informe».
- Sin errores en `calcola`, `calsusc`, `calreasignar`, `calcolatodos`, `calctl`, `calgarplegada`, `calgarnivel2`, `calgarrg`, `cxgarantiaspropuestas`, `cxr0dcalificar`, `cxr0dadmin`, `cxlimpio`, `inicio` y `notif`.
- `sirius-conexion.js` sigue en 70 bytes.

**Prueba cruzada (mismos datos, mismo usuario)**

| Lugar | Ejecutivo · con conexión | Suscriptor · con conexión | Administrador · con conexión | Ejecutivo · sin conexión | Suscriptor · sin conexión | Administrador · sin conexión |
|---|---|---|---|---|---|---|
| Bandeja › pestaña | En calificación 4 | En suscripción 2 | En calificación 6 | En calificación 8 | En suscripción 1 | En calificación 10 |
| Bandeja › línea | 4 casos · 6 informes · 2 vencidos | 2 · 2 · 1 | 6 · 8 · 3 | 8 · 12 · 2 | 1 · 1 · 0 | 10 · 14 · 2 |
| Bandeja › filas con «M por calificar» | 4 (1+2+2+1) | 2 (1+1) | 6 | 8 | 1 | 10 |
| Menú › cabecera | 4 · 6 · 2 | 2 · 2 · 1 | 6 · 8 · 3 | 8 · 12 · 2 | 1 · 1 · 0 | 10 · 14 · 2 |
| Menú › indicador y Vencidos | 6 en 4 casos · 2 | 2 en 2 casos · 1 | 8 en 6 casos · 3 | 12 en 8 casos · 2 | 1 en 1 caso · 0 | 14 en 10 casos · 2 |
| Menú › pestañas | Por calificar (6) | En suscripción (2) | Por calificar (6) · En suscripción (2) | Por calificar (12) | En suscripción (1) | Por calificar (13) · En suscripción (1) |
| Inicio › tarjeta | Por calificar 6 · en 4 casos · 2 vencidos | En suscripción 2 · en 2 casos · 1 vencido | No tiene tarjeta | Por calificar 12 · en 8 casos · 2 vencidos | En suscripción 1 · en 1 caso · 0 vencidos | No tiene tarjeta |
| Campana | 4 · 6 · 2 | 2 · 2 · 1 | 6 · 8 · 3 | 8 · 12 · 2 | 1 · 1 · 0 | 10 · 14 · 2 |

- Con la conexión se usó `colacalconsistente`. Sin la conexión, `calcola` (Verónica Lema), `calsusc` (Ricardo Almeida) y `calreasignar` (Andrea Salazar), con la bandeja sin filtros.
- `cxr0emodulo` y `cxr0ebandeja` (50012): 1 caso · 1 informe · 0 vencidos en el menú, el indicador y la bandeja, como Ejecutivo y como Administrador.
- La versión anterior con los mismos datos de `colacalconsistente`, como Ejecutivo, daba:
  - bandeja 5 casos (incluía 50055 y 50056, de nivel 2, y dejaba fuera 50052);
  - menú e Inicio, 7 informes con 0 vencidos (incluía PBA5102, completado dentro de facultad).
  - Sin la conexión: bandeja 9 casos y menú 8 casos.

**No verificado**
- La prueba con la base real en GitHub. En nuestras escenas, Evidencias ya se plegaba antes de este cambio, así que no reproduje la falla. Ahora las cuatro secciones son el mismo componente; si en GitHub sigue sin plegarse, necesito el caso y el navegador.
- El SLA de calificación con la base usa `completadoEn` o `enviadoEn` del informe y `hora` de la calificación de nivel 1. Si la base no los manda, no hay vencidos (como antes).

**Diferencias**
- La pestaña «En calificación» ya no cuenta:
  - casos en «Pendiente calificación» sin un informe completo por calificar;
  - casos de nivel 2 para el Ejecutivo de inspecciones.
  El estado del caso («En calificación») se sigue viendo en su etiqueta.
- La bandeja del Ejecutivo de inspecciones y la del Suscriptor muestran también los casos con informes en su cola, aunque el ejecutivo del caso sea otro (50052 es de Verónica Lema).
- «SLA vencido» de la bandeja suma los casos con el SLA de calificación vencido.
- El indicador del Administrador en el menú cuenta los dos niveles (antes, solo el nivel 1).
- La línea de la campana es un resumen, no un aviso: no suma «sin leer».
- `calevidplegable` empieza con las cuatro secciones plegadas para que se vean juntas a 1280×720.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `calevidplegable` | Verónica Lema · Ejecutivo de inspecciones | 50040: las cuatro secciones con el mismo encabezado y ▸; Evidencias plegada con «18 fotos · 2 doc.» |
| `colacalconsistente` | Daniela Ruiz · Ejecutivo de inspecciones | 6 casos y 9 informes: bandeja, menú (`?fvista=calificacion`), Inicio (`?fvista=inicio`) y campana (`?fcampana=1`), con 4 casos · 6 informes · 2 vencidos |
| `colacalconsistente&frol=sus` | Ricardo Almeida · Suscriptor | Los de nivel 2: 2 casos · 2 informes · 1 vencido |
| `colacalconsistente&frol=admin` | Andrea Salazar · Administrador | Todos: 6 casos · 8 informes · 3 vencidos |

También abrí `cxr0emodulo`, `cxr0ebandeja`, `calgarnueva`, `calcola`, `calsusc`, `calreasignar` y el Inicio de cada rol.

**Tiempo de la etapa: inicio 17/11/2026 21:54 · fin 17/11/2026 22:31 · 37 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-2b

Publiqué la versión 296 de SIRIUS. La calificación con garantías tiene la distribución de la propuesta aprobada (DEC-250): una barra de decisión arriba, la tabla de garantías como protagonista, un panel de contexto que se pliega y el pie fijo.

**Qué cambió**
- **Barra de decisión (una línea):**
  - Veredicto como selector compacto, plazo global, «Fecha límite», «Próximo vencimiento» y la facultad.
  - El plazo global es el mayor de los plazos de las garantías; se puede escribir uno mayor, nunca uno menor.
  - La fecha límite es la de la garantía que vence más tarde; el próximo vencimiento, la de la más próxima.
  - Con «No aprobado» la tabla se oculta y se pide el motivo del catálogo.
- **Garantías:**
  - Encabezado «N de M · del inspector · tuyas · del nivel 2» y «＋ Del catálogo» (con el plazo de la matriz).
  - El ramo aparece una sola vez, encima de la tabla.
  - Columnas: Garantía (título, código y origen), texto para el asegurado editable en línea (hasta 3 líneas), plazo con «vence», prioridad, estado y «⋯» (Quitar con motivo, Ver historial).
  - Lo quitado queda tachado, con su motivo y «↺ Deshacer», hasta grabar.
- **Panel de contexto:**
  - Secciones que se pliegan por separado: Recomendaciones del inspector («✓ Es la garantía N», «Quitada por ti · Volver a agregar», «＋ Agregar como garantía»), Resumen del informe, Evidencias y Puntaje y controles.
  - «» Plegar el panel» lo deja en una franja de 52 px con íconos y contadores; un clic en un ícono lo abre en esa sección.
  - El estado se recuerda por usuario.
- **Pie fijo:** «N garantías · fecha límite · se enviarán al BPM al grabar», «Guardar borrador» y «Grabar calificación».
- **Dónde aplica:** nivel 1, nivel 2 (Suscriptor) y Vehículos, con un solo riesgo.
- **Con la conexión:** al grabar se envía definirGarantias como en P-6g-2; el contrato no cambia.

**Verificado**
- Abrí 8 escenas a 1280×720 y 1920×1080 (las 5 nuevas, `cxgarantiaspropuestas`, `calrggar` y `gaprobar`), más la calificación de Vehículos y la de demostración de nivel 1 y nivel 2. Fueron 22 capturas sin errores.
- A 1280 px con el panel expandido, el texto de cada garantía se lee en 2 líneas como máximo (medido en `calgarnueva`, `calgarnivel2`, `calgarrg` y `cxgarantiaspropuestas`); a 1920 px, en 1. Si el texto es más largo, crece hasta 3 líneas y luego se desplaza.
- La barra de decisión cabe en una línea a 1280 px.
- Quitar sin motivo da el aviso; con motivo, la fila queda tachada y la recomendación pasa a «Quitada por ti». «↺» y «Volver a agregar» la devuelven, y «＋ Agregar como garantía» suma «Orden y limpieza» como garantía 4.
- Plazos:
  - Si una garantía pasa a 90 días, el plazo global sube a 90 y la fecha límite al 16/01/2027.
  - Un plazo global de 120 se acepta.
  - Uno de 20 da «El plazo global no puede ser menor que el mayor de las garantías (90 días)».
- El panel plegado se recuerda en otro caso del mismo usuario. Un clic en el ícono de Evidencias o de Recomendaciones lo abre en esa sección, y cerrar una sección también se recuerda.
- «No aprobado» sin motivo no se graba; con motivo se graba sin garantías y la vista muestra el motivo.
- Grabaciones:
  - Nivel 1: definirGarantias lleva cada garantía con su origen (Inspector o Calificador).
  - Nivel 2: el dictamen pide la confirmación con los cambios frente al nivel 1. En la base quedan Pendientes 1 del Inspector, 1 del Calificador y 1 del Nivel 2, y las quitadas quedan «Retirada».
- `calrggar`, `gaprobar`, `gar`, `n2done`, `notifbitacora`, `cxgarantiacumplir`, `iniciocom` y `liqporliquidar` dan el mismo texto que en la versión anterior.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- «Guardar borrador» guarda en la sesión del navegador, no en la base.
- La facultad que muestra la barra es la del nivel de la pantalla; no se calcula con los umbrales de facultad del usuario.

**Diferencias**
- Una recomendación del inspector sin código del catálogo (como «Orden y limpieza») no entra sola a la tabla: queda en el panel para agregarla. Las que tienen código entran como antes.
- Una recomendación agregada desde el panel conserva el origen «Inspector»; las agregadas del catálogo llevan «Calificador» o «Nivel 2».
- Seguí la propuesta en el pie: «Cancelar» salió; se sale con las pestañas o con «←».
- Vehículos no tiene garantías: usa la barra (veredicto y cobertura o motivo), la observación, el pie y el panel.
- Con varios ramos, en la calificación de garantías de una reinspección y en la pantalla de Ramos Generales por informe (`calrggar`) sigue el formulario anterior.
- «Puntaje y controles» muestra los datos del informe que traen puntaje o controles; si no hay, lo dice.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `calgarnueva` | Verónica Lema · Ejecutivo de inspecciones | 50040: barra de decisión, 3 garantías (2 del inspector y 1 tuya), una quitada con «↺», panel expandido con 4 recomendaciones |
| `calgarplegada` | Verónica Lema · Ejecutivo de inspecciones | El mismo caso con el panel en la franja; el ícono de recomendaciones lo abre en esa sección |
| `calgarnoaprobado` | Verónica Lema · Ejecutivo de inspecciones | «No aprobado»: sin tabla y con el motivo obligatorio |
| `calgarnivel2` | Ricardo Almeida · Suscriptor | Agrega «Botón de pánico» (Nivel 2) y quita «Detectores de humo» con motivo |
| `calgarrg` | Verónica Lema · Ejecutivo de inspecciones | 50046 de Ramos Generales: 6 garantías con texto ancho y «vence» |

También abrí `cxgarantiaspropuestas`, `calrggar`, `gaprobar`, la calificación de Vehículos (`veh`), `n1` y `n2`.

**Tiempo de la etapa: inicio 17/11/2026 05:55 · fin 17/11/2026 06:27 · 32 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-2

Publiqué la versión 293 de SIRIUS. Las garantías (origen, seguimiento, ampliación, cierre y endosos) y la bitácora de Notificaciones ya leen la base y envían sus acciones, con las mismas pantallas de siempre.

**Qué cambió**
- **Origen de las garantías:**
  - Con la conexión, la calificación de nivel 1 trae las recomendaciones del inspector como garantías propuestas (origen «Inspector»), con el plazo de la matriz.
  - El calificador quita o agrega (origen «Calificador») y el nivel 2 también (origen «Nivel 2»).
  - Al grabar la calificación final se envía definirGarantias: quedan «Pendientes» con su vencimiento y su endoso de inclusión «En cola». Las propuestas que se quitaron quedan «Retirada».
- **Seguimiento (módulo Garantías):**
  - Cumplir envía cumplirGarantia { id, respaldo, nota }. El respaldo es la foto o el documento adjunto, o el caso hijo; sin respaldo, la base lo rechaza.
  - La ampliación envía solicitarAmpliacion y la garantía queda «En ampliación». La aprueba o rechaza el calificador final con resolverAmpliacion: el nuevo vencimiento y el endoso de modificación de plazo.
  - Nuevo: «Retirar garantía» con motivo (solo calificador o nivel 2).
  - «Solicitar cierre» envía cerrarSeguimiento; si queda alguna pendiente, sale el mensaje de la base.
  - Cada garantía muestra su vencimiento, plazo y origen. En los endosos, «Marcar enviado» y «Marcar aplicado» (el BPM es simulado).
- **Notificaciones:**
  - La Bitácora lee notificacionesEnvio[] de la base, con «Reenviar» en el envío fallido.
  - Los recordatorios de garantías salen de las garantías de la base. Reglas, plantillas y campana siguen igual.
- **Con { ok: false }** no cambia nada y se muestra el mensaje.
- **Sin la conexión** todo queda como antes.

**Verificado**
- Abrí 15 escenas a 1280×720 y 1920×1080: 30 capturas sin errores. Son las 6 nuevas más gar, garpanel, gendosos, gaprobar, gampliar, gcola, calrggar, n1 y notifbitacora.
- `cxgarantiaspropuestas`, el flujo completo:
  - El calificador quita «Alarma contra robo», agrega CCTV y deriva.
  - Como Suscriptor agrega «Botón de pánico» y graba el dictamen.
  - En la base quedan 4 Pendientes: 2 del Inspector, 1 del Calificador y 1 del Nivel 2. Cada una tiene su plazo (30 o 60 días), su vencimiento y su endoso «En cola», y la alarma queda «Retirada».
- Cumplir con foto y nota deja la garantía «Cumplida» con el endoso «En cola», y «Marcar aplicado» lo deja «Aplicado».
- Ampliación de 10 días: la garantía queda «En ampliación». Al aprobarla, el vencimiento pasa al 02/11/26 y el endoso de plazo queda «En cola».
- Retirar: el Ejecutivo comercial no ve el botón y la calificadora sí.
- Cierre: sin pendientes queda «Seguimiento cerrado». Con una pendiente sale «No se puede cerrar el seguimiento: queda 1 garantía pendiente (Detectores de humo)».
- Reenviar un WhatsApp fallido lo deja «Enviado · reenviado».
- Cumplir sin respaldo y `?cxok=0` dan { ok: false }: la base y la pantalla no cambian y sale el mensaje.
- En una copia aparte con una conexión temporal comprobé la forma exacta de las 8 acciones.
- Sin la conexión, 15 escenas existentes (Garantías, calificación, Inicio y Notificaciones) dan el mismo texto que antes.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La respuesta de la base real (SQL 55) y del BPM real: los endosos se marcan a mano.
- Subir el archivo de respaldo a un almacenamiento: la ruta es el nombre del archivo adjunto.

**Diferencias**
- La ampliación se pide para el conjunto, como hoy, y se envía una solicitarAmpliacion por cada garantía pendiente o vencida.
- La fecha límite del caso es el vencimiento más próximo de las garantías abiertas.
- Con la conexión, el Ejecutivo comercial también puede marcar una garantía como cumplida; la base exige el respaldo.
- En las escenas, Verónica Lema tiene dos roles (comercial y calificadora, o calificadora y Suscriptor) para probar cada flujo en una sola sesión.
- Corregí un error que ya existía: enviar al BPM un caso de Ramos Generales calificado fallaba porque no trae adjuntos de vehículo.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `cxgarantiaspropuestas` | Verónica Lema · Ejecutivo de inspecciones y Suscriptor | 3 propuestas del inspector en la calificación de 50040; quitar, agregar y dictamen: 4 Pendientes con origen y vencimiento |
| `cxgarantiacumplir` | Santiago Ortiz · Ejecutivo comercial | Cumplir con foto y nota; endoso de cumplimiento «En cola» → «Aplicado» |
| `cxgarantiaampliacion` | Verónica Lema · Ejecutivo comercial y calificadora | Solicitar y aprobar la ampliación; nuevo vencimiento y endoso de plazo; `?fvista=solicitada`; «Retirar garantía» |
| `cxgarantiacierre` | Santiago Ortiz · Ejecutivo comercial | Cierre sin pendientes; `?fvista=pendiente`: el mensaje que lo impide |
| `cxnotificaciones` | Andrea Salazar · Administrador | Bitácora de la base con el envío fallido y «Reenviar» |
| `cxgarantiaserror` | Santiago Ortiz · Ejecutivo comercial | Cumplir sin respaldo: { ok: false } y nada cambia |

También abrí `gar`, `garpanel`, `gendosos`, `gaprobar`, `gampliar`, `gcola`, `calrggar`, `n1` y `notifbitacora`, y comparé sin la conexión `iniciocom`, `iniciosus`, `n2done`, `gsolicitar`, `notifreglas` y `cxlimpio`.

**Tiempo de la etapa: inicio 16/11/2026 23:39 · fin 17/11/2026 00:20 · 41 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1f

Publiqué la versión 290 de SIRIUS. «Por facturar» ahora tiene filtros y selección masiva, y el Inicio de Finanzas de agencia lee la base igual que Liquidaciones.

**Qué cambió**
- **«Por facturar» con filtros (DEC-247):**
  - La misma barra de «Por liquidar»: buscar (caso, placa, asegurado o número de liquidación), desde y hasta (fecha de inspección o de aprobación de la liquidación), tipo (Todos, Liquidaciones aprobadas, Honorarios preacordados), ramo, modalidad, sucursal y línea de negocio, con el contador «N de M» y «Limpiar filtros».
  - Una liquidación se muestra si alguna de sus líneas cumple lo elegido. Los filtros se recuerdan en la pestaña durante la sesión.
- **Selección masiva:**
  - «Seleccionar todo» en la cabecera marca o desmarca lo visible con los filtros de ese momento. Cada grupo tiene su casilla, y con una parte marcada las casillas quedan en estado intermedio (—).
  - La barra dice cuántas liquidaciones, preacordados e inspecciones hay marcados, el subtotal a facturar (el mismo de «Nueva factura») y trae «Quitar selección».
  - Al cambiar un filtro, lo marcado que queda fuera se conserva: la barra dice «3 marcados fuera del filtro» y «Ver solo lo marcado» los muestra.
- **Inicio del proveedor con la base:**
  - Finanzas de agencia (y el inspector independiente con la conexión) ve 5 tarjetas de SiriusLiqProceso: Por liquidar, En aprobación en la aseguradora, Por corregir (con su motivo), Por facturar (con su subtotal) y Facturas por validar o devueltas. Cada una abre su pestaña de Liquidaciones.
  - «Para hoy» sale de la misma fuente. Quité la tarjeta «Marcados «Revisar»» y ya no sale el aviso «Datos de demostración» en ese Inicio con la base.

**Verificado**
- Abrí las 3 escenas nuevas, `liqfacturarsri`, `liqporliquidar`, `iniciofin`, `facturadevuelta` e `inicioins` a 1280×720 y 1920×1080: 16 capturas sin errores.
- `facturarmasivo`: 28 por facturar (3 liquidaciones y 25 preacordados). «Seleccionar todo» marca las 28 y el subtotal pasa a USD 1.294,80, igual en la barra y en «Nueva factura»; al desmarcar vuelve a cero. Las casillas de grupo marcan y desmarcan solo su grupo.
- Filtros: sucursal Guayaquil deja 8 de 28; «Seleccionar todo» marca solo esas 8 (USD 120,00). Al pasar a Quito quedan «8 marcados fuera del filtro», «Ver solo lo marcado» los muestra y «Volver al filtro» regresa. También probé buscar, ramo, modalidad, línea, fechas y tipo; al ir a Seguimiento y volver, los filtros siguen.
- Inicio de Carla Ponce con la conexión: 3 por liquidar (USD 36,00), 1 en aprobación, 1 por corregir, 4 por facturar (USD 940,00) y 2 facturas (1 por validar y 1 devuelta). Cada tarjeta abre su pestaña. No sale el aviso de demostración.
- La consulta al SRI de `liqfacturarsri` sigue coincidiendo (subtotal USD 195,60), con y sin la conexión. Un clic en una fila reinicia la consulta.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- El Inicio del inspector independiente con la conexión: en esa vista el menú no trae «Inicio», así que probé el modelo con los datos de Luis Andrade (1 por liquidar, 2 por facturar) pero no lo vi en pantalla.
- Cómo se comporta «Seleccionar todo» con cientos de filas reales: lo probé con 28.
- La respuesta real de la base: las tarjetas leen la base simulada.

**Diferencias**
- Con la conexión, el Inicio del inspector independiente trae las mismas 5 tarjetas de liquidación y deja sus tarjetas de agenda; sin la conexión conserva las de siempre.
- Cuando hay 5 tarjetas se muestran en 3 columnas y en 5 desde 1500 px de ancho (el resto de los roles sigue con 4).
- En la fecha «desde/hasta», una liquidación entra si su aprobación o alguna de sus inspecciones cae en el rango.
- Datos de prueba míos: 21 preacordados y 3 liquidaciones más para las escenas nuevas (solo existen en ellas).

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `facturarmasivo` | Carla Ponce · Finanzas de agencia | 28 por facturar; «Seleccionar todo» y los grupos en estado intermedio; barra «2 liquidaciones · 6 preacordados · 10 inspecciones», USD 1.032,80 |
| `facturarfiltros` | Carla Ponce · Finanzas de agencia | Sucursal Guayaquil y tipo preacordados (7 de 28); 6 marcados, 3 fuera del filtro; «Ver solo lo marcado» |
| `inicioproveedorcx` | Carla Ponce · Finanzas de agencia | Con la conexión simulada: 5 tarjetas de la base (3 · 1 · 1 · 4 · 2), «Para hoy» de 4 pendientes y sin aviso de demostración |

También abrí `liqfacturarsri`, `liqporliquidar`, `iniciofin`, `facturadevuelta` e `inicioins`.

**Tiempo de la etapa: inicio 16/11/2026 23:02 · fin 16/11/2026 23:23 · 21 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1e

Publiqué la versión 286 de SIRIUS. La tarifa de Vehículos ahora es por tipo (Liviano, Pesado y Moto) con un catálogo y una tabla de equivalencias que se editan, y la ficha de Usuarios tiene «Volver a invitar».

**Qué cambió**
- **Tipos de vehículo del tarifario (DEC-249):**
  - La tarifa fija de Vehículos es por modalidad y por tipo: Liviano, Pesado y Moto. En Eurosurvey, presencial Liviano USD 12,00, Pesado USD 17,00 y Moto USD 10,00.
  - Liquidaciones › Tarifarios › «Tipos de vehículo del tarifario»: el catálogo se agrega, se renombra y se desactiva con vigencia. Un tipo desactivado no se elige en tarifarios nuevos y las inspecciones anteriores conservan su tarifa.
  - Tabla de equivalencias editable: Sedán, SUV y Camioneta → Liviano; Camión y Bus → Pesado; Moto → Moto. Sin equivalencia, el cálculo usa el primer tipo vigente.
  - El tipo aparece en el panel del cálculo («ASEGURABLE // CIUDAD BASE // MOTO» y «Tipo Moto … tarifa presencial moto USD 10,00»), en la mesa, en la revisión y en el PDF (columna «Tipo», «1 liviano · 1 pesado · 1 moto» y la línea de tarifa).
- **«Volver a invitar» (DEC-249, solo el Administrador):**
  - Con la base: reinvitarUsuario { email, nuevoEmail?, motivo } → { ok, mensaje, activacion }. Aplica a Invitado, a Inactivo que nunca activó su cuenta y a Activo cuando se quiere cambiar su correo de acceso.
  - El panel muestra el correo actual, «Correo nuevo» y el motivo (10 caracteres o más). En una cuenta activa con correo nuevo avisa: «La cuenta actual se desvincula; la persona activará una cuenta nueva con el correo nuevo».
  - Al confirmar, la ficha muestra el enlace de activación con «Copiar enlace» y el usuario queda «Invitado».
  - Editar el correo de un invitado también devuelve y muestra el enlace nuevo. Para un inactivo que nunca activó y para una cuenta vinculada, el mensaje de la base sale tal cual, con el botón «Volver a invitar» al lado.
  - Sin la conexión funciona igual, con un enlace de prueba.

**Verificado**
- Abrí las 5 escenas nuevas, `honorclase`, `liqpdf`, `maestrosusuarios` y `cxusuarios` a 1280×720 y 1920×1080: 18 capturas sin errores.
- `honormoto`: moto USD 10,00, camioneta USD 12,00 y bus USD 17,00; subtotal USD 39,00. Descargué el PDF: la línea de la moto dice «Moto», la tarjeta «1 liviano · 1 pesado · 1 moto» y los USD 39,00 coinciden. Con la conexión simulada sale el mismo contenido, salvo la insignia «Prueba conectada».
- Catálogo: agregué «Cuatrimoto», la renombré, le agregué una equivalencia y la desactivé. Un nombre corto, un nombre repetido y una equivalencia repetida dan su mensaje.
- «Volver a invitar» con la conexión simulada: el mensaje de la cuenta vinculada sale con el botón, el panel trae el correo nuevo y el aviso, y la ficha queda «Invitado» con su enlace. Un correo repetido da { ok: false } y el estado no cambia. Editar el correo de un invitado devuelve el enlace.
- La consulta al SRI de `liqfacturarsri` sigue coincidiendo (subtotal USD 195,60).
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- «Copiar enlace» en un navegador de escritorio con permisos reales de portapapeles, y el nombre del PDF con «ó» al descargar en Chrome o Edge.
- La respuesta real de la base a reinvitarUsuario: los mensajes y el enlace son los de la base simulada; el correo con la invitación no se envía.
- Cambiar una equivalencia no recalcula los honorarios ya calculados: solo vale para los informes nuevos.

**Diferencias**
- En pantalla «clase» pasó a «tipo»; en el contrato con la base el campo sigue siendo `calculo.clase`, con el valor nuevo `'moto'`.
- La Suzuki GN125 del caso 50012 (Motocicleta) pasa de Liviano a Moto: USD 10,00 en vez de USD 12,00 en las escenas de «Por facturar». Por eso el subtotal de `liqfacturarsri` es USD 195,60 y no USD 197,60.
- La tarifa general del tipo Moto (presencial USD 12,00, virtual guiada USD 8,00) es un valor de prueba mío.
- En una cuenta activa el correo nuevo es obligatorio (en el resto es opcional): sin él no habría nada que cambiar.
- Sin la conexión, la ficha no edita el correo (sigue siendo único y fijo); el cambio de correo va solo por «Volver a invitar».
- Datos de prueba: Renata Cobo es un usuario nuevo sin la conexión (Inactivo que nunca activó), y Diego Salinas, de la base simulada, ahora tampoco activó su cuenta.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `honormoto` | Carla Ponce · Finanzas de agencia | #001414 aprobada con moto, camioneta y bus (USD 39,00); panel de la moto: presencial USD 10,00; «Descargar PDF» |
| `tarifatipos` | Mónica Ríos · Finanzas | Catálogo de tipos de vehículo (Liviano, Pesado, Moto) y tabla de equivalencias |
| `usrreinvitar` | Administrador | «Volver a invitar» a Renata Cobo, Inactivo que nunca activó; `?rvista=enlace`: queda «Invitado» con su enlace |
| `usrcambiocorreo` | Administrador | «Volver a invitar» a Daniela Ruiz, Activa, con el aviso de desvinculación; `?rvista=enlace`: enlace nuevo |
| `cxreinvitar` | Administrador | Con la conexión simulada: reinvitarUsuario de Diego Salinas; `?cxdup=1`: { ok: false } «El correo ya lo usa otro usuario»; `?cxactivo=1`: cuenta activa |

También abrí `honorclase`, `liqpdf`, `maestrosusuarios`, `cxusuarios`, `liqfacturarsri`, `liqfinanzas`, `tarifarioeur`, `honorcalculo`, `liqmesa` y `liqdocumento`.

**Tiempo de la etapa: inicio 16/11/2026 20:38 · fin 16/11/2026 21:00 · 22 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1d

Publiqué la versión 282 de SIRIUS. La liquidación aprobada ya se descarga como PDF con el diseño aprobado: encabezado con el logo, sello «APROBADA» y marca de agua «APROBADO» en todas las páginas. La tarifa de Vehículos ahora es por clase y la movilización se mide desde la ciudad base de cada proveedor.

**Qué cambió**
- **PDF de la liquidación (DEC-248):**
  - El generador de PDF del prototipo (sirius-pdf.js, jsPDF) dibuja el documento con texto y formas, como el adjunto, y lo descarga como «Liquidación_001414_v1.pdf».
  - Contenido:
    - encabezado claro con el logo de SIRIUS, la aseguradora, la ciudad y la fecha;
    - número grande con versión y período;
    - sello «APROBADA» con fecha, hora y versión;
    - marca de agua en diagonal, tenue, en todas las páginas;
    - tarjetas de proveedor, inspecciones por clase, fuera de ciudad base y subtotal a facturar;
    - barra de composición del subtotal con porcentajes;
    - tabla con la franja por estado del caso, su leyenda y el encabezado repetido en cada página (en Ramos Generales, nivel, horas y equipos en lugar de la clase);
    - cierre con el subtotal aprobado, IVA y total informativos, la nota de la factura, «Presentado por» y «Aprobado por»;
    - pie con el código de verificación y «Página N de M».
  - «Descargar PDF» aparece solo con la liquidación Aprobada, Facturada o Pagada: en Seguimiento del proveedor, en «Por facturar», en «Liquidaciones» de la aseguradora y en Finanzas. En los demás estados, la vista previa queda en pantalla y no se descarga.
- **Tarifa de Vehículos por clase:**
  - La tarifa es por modalidad y clase (Liviano, Pesado; catálogo parametrizable). La clase sale del tipo de vehículo del riesgo.
  - Eurosurvey: presencial liviano USD 12,00 y pesado USD 17,00.
  - El editor del tarifario muestra la tarifa por modalidad y clase.
- **Ciudad base:**
  - Cada proveedor tiene su ciudad base (cantón INEC) en su ficha: Eurosurvey, Quito; Luis Andrade, Santo Domingo.
  - Si la inspección es en otra ciudad, la línea es «Ciudad no base» y se cobran los km por carretera desde la ciudad base hasta la visita, × USD 0,20 en Eurosurvey.
  - Nuevo parámetro del tarifario «Medición de km»: ida (inicial) o ida y vuelta.
  - En la ciudad base, sin movilización. Reemplaza la regla del radio urbano.
- **Pantallas:**
  - El panel lateral muestra arriba la referencia de la línea («ASEGURABLE // CIUDAD NO BASE // LIVIANO // 19,1 KM × 0,20 = 3,82») y una sección «Ciudad y movilización».
  - La mesa y la revisión muestran bajo el caso el cantón y «Base» o «No base».

**Verificado**
- Abrí 9 escenas a 1280×720 y 1920×1080 (las 5 nuevas más `liqrevision`, `liqfinanzas`, `liqmesa` y `honorcalculo`) y otras 10 que ya existían; ninguna dio errores. A 1280 px la mesa y la revisión caben sin desplazar (1066 px).
- Descargué el PDF de `liqpdf`:
  - 12 líneas que suman USD 197,40, igual al subtotal aprobado;
  - sello, marca de agua, «Página 1 de 1» y el código de verificación;
  - con la conexión simulada sale el mismo contenido.
- Con 84 líneas (las mismas repetidas) salen 3 páginas, con el encabezado de la tabla y la marca de agua en cada una.
- `liqpdfrg` muestra nivel, horas y equipos. `liqdocumento` y Finanzas descargan su PDF. `liqpdfsinaprobar` no tiene «Descargar PDF».
- `honorclase`: liviano USD 12,00, pesado USD 17,00 y liviano fuera de la ciudad base 19,1 km × 0,20 = 3,82, que da USD 15,82.
- La prueba del contrato de `cxliqproceso` sigue en 19 de 19.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La descarga en un navegador de escritorio. En el navegador de prueba el archivo se descarga, pero el nombre con «ó» llega como «download»; con un nombre sin tilde sí se respeta. Conviene confirmarlo en Chrome o Edge.
- La distancia real por carretera. El prototipo usa los km del informe y, si faltan, la línea recta × 1,25; falta el servicio de rutas.
- El PDF en lectores de pantalla.

**Diferencias**
- La tabla usa el azul marino del sistema; no copié el tono exacto del adjunto.
- Como en la #001412 real, las 12 inspecciones de `liqpdf` se liquidan todas. El contrato de Eurosurvey del prototipo sigue con Vehículos «Preacordada», así que en otras escenas los livianos en la ciudad base van directo a «Por facturar». ¿Cambio el parámetro del contrato a «Requiere liquidación»?
- El número es #001414 y no #001412, porque las liquidaciones de prueba empiezan en 1414.
- La regla nueva cambia montos de escenas anteriores. Para que tenga sentido, PCK2210 se inspecciona en Rumiñahui, PBX4410 en Mejía, TBA1235 en Ambato (136 km), PFJ3628 de Luis en La Concordia y la planta en Quito.
- El contrato con la base suma campos: `calificacion` y, en `calculo`, `clase`, `ciudadBase`, `ciudadVisita`, `enBase` y `kmMedicion`. La ficha del proveedor suma `ciudadBase`.
- La calculadora anterior (`honorpropuesta`) usa la tarifa del liviano. Su movilización sigue con la regla anterior.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `liqpdf` | Carla Ponce · Finanzas de agencia | #001414 aprobada (12 líneas, 3 fuera de la ciudad base, USD 197,40); «Descargar PDF» |
| `liqpdfrg` | Carla Ponce | PDF con 2 líneas de Ramos Generales (nivel, horas y equipos) |
| `liqpdfsinaprobar` | Carla Ponce | Enviada y por corregir: sin «Descargar PDF», solo vista previa |
| `honorclase` | Carla Ponce | Liviano USD 12,00, pesado USD 17,00 y liviano fuera de la ciudad base USD 15,82 |
| `fichaciudadbase` | Administrador | Ficha de Eurosurvey con su ciudad base Quito; `?fvista=luis`: Luis Andrade, Santo Domingo |

Todas las de Liquidaciones, con `&cx=1`, van con la conexión simulada. También abrí `liqrevision`, `liqfinanzas`, `liqmesa`, `honorcalculo`, `liqdocumento`, `liqfacturarsri`, `liqindependiente`, `tarifarios`, `tarifarioeur`, `honorpropuesta`, `usuarios`, `maestrosagencias`, `agenda` e `iniciofin`.

**Tiempo de la etapa: inicio 16/11/2026 19:22 · fin 16/11/2026 19:47 · 25 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1c

Publiqué la versión 279 de SIRIUS. Ya está el lado de la aseguradora: «Por aprobar» con la revisión a pantalla completa, y las pestañas de Finanzas («Facturas por validar» con la consulta al SRI, «Por pagar» y «Pagadas»). También está el mensaje del inspector de agencia de planta. Liquidaciones usa el contrato de la base (SQL 53) con las mismas pantallas, con y sin la conexión. Corregí lo observado en P-6g-1b.

**Qué cambió**
- **Panel del cálculo:**
  - «Cálculo» (en «Por liquidar», en la mesa y en la revisión) abre un panel lateral a la derecha con la estructura de la ficha del inspector en Usuarios. Muestra placa o bien, caso y asegurado; el camino de aprobación; las partes del cálculo; el tiempo medido y la referencia; y los km.
  - Se cierra con «×» o Esc y no tapa la barra de selección.
  - Ya no está la sección «Cálculo del honorario» de arriba.
- **Km y camino:**
  - La explicación usa los mismos km del cálculo: «km sugeridos 18 (centro de Quito al punto, menos el radio urbano de 15 km) · km cobrados 27 · comentario: …».
  - El camino se lee «Tarifa preacordada · pasa a liquidación por los km» (o «por el ajuste»).
- **«Por liquidar»:** la casilla y Caso quedan fijos al desplazarse hacia los lados.
- **«Por aprobar»:**
  - La lista muestra número, proveedor, sucursales, versión, inspecciones, cuántas cambiaron frente al cálculo y subtotal.
  - La revisión ocupa toda la pantalla, con «‹ Por aprobar» y «Siguiente ›». Es una hoja con la fila de títulos fija y estas columnas: caso, asegurado, placa o bien, nivel (con el sugerido), horas con «!» y su valor calculado, km con los sugeridos, comentario del proveedor, subtotal calculado, subtotal propuesto y observación.
  - Las líneas cambiadas se resaltan. Desde la v2 aparece arriba «Cambios desde la v1» con el subtotal antes y ahora, y las líneas quitadas, agregadas o corregidas.
  - «Observar» habilita la observación y el subtotal sugerido en la misma fila.
  - «Devolver para corregir» exige al menos una línea observada y un motivo. «Aprobar» aprueba toda la liquidación y no se puede pulsar mientras haya observaciones.
- **Finanzas:**
  - «Facturas por validar»: cada factura muestra su consulta al SRI (estado, RUC, número, fecha, subtotal ✓), lo que incluye y el subtotal aprobado, con «Validar» o «Devolver» con motivo.
  - «Por pagar»: registra el pago de una o varias facturas con fecha y referencia.
  - «Pagadas»: el historial.
- **Inspector de agencia:** si la agencia no paga a sus inspectores por inspección, ve «Eres inspector de planta». Si paga, ve «Mis honorarios con Eurosurvey», informativo.
- **Contrato con la base:**
  - El honorario lleva `calculo { … }`, `ajuste { … } | null` y `aprobacion 'Preacordada' | 'Liquidación'`. La liquidación lleva `observaciones [{ linea, texto, subtotalSugerido }]` y `versiones [{ version, enviada, resultado, por, cambios }]`. La factura lleva `sri { … }`.
  - Las 13 acciones tienen la forma indicada: `enviarLiquidacion { lineas }` → { id, numero } y `enviarFactura { clave, liquidaciones, honorarios }` (la base vuelve a consultar el SRI).
  - El borrador vive en la sesión del proveedor («Borrador 1») y recibe su número al enviarlo.
- **Prueba del contrato:** la escena `cxliqproceso` tiene «Prueba del contrato con la base», que envía las 13 acciones y muestra cada respuesta.
- **Inicio:** los indicadores del proveedor y de Finanzas van en subtotal y llevan a las pestañas nuevas.

**Verificado**
- Abrí 13 escenas a 1280×720 y 1920×1080 (las 6 nuevas más `liqcalculopanel` con `?fvista=planta` y `liqplanta` con `?fvista=si`, y las 7 de P-6g-1b) y todas cargan sin errores. A 1280 px la revisión cabe sin desplazar (1066 px en 1066 px).
- Abrí también otras 14 escenas sin errores: `liquidaciones`, `liqdetalle`, `liqfactura`, `facturagrupo`, `facturadevuelta`, `mishonorarios`, `tarifarios`, `cuentainspector`, `agenciapagos`, `honorpropuesta`, `liqdevolver`, `liqdocumento` (también con `?fvista=factura`), `inicio` e `iniciofin`.
- Con y sin la conexión se ven las mismas pantallas: el texto de 9 escenas es idéntico con y sin `?cx=1`. No queda nada de la pantalla de P-6g-1 en el proyecto ni en lo publicado.
- Forma exacta, en una copia aparte con una conexión temporal que revisa las claves de cada acción y de los datos:
  - Se enviaron 32 acciones de las 13 clases desde 7 escenas, todas con la forma exacta y con los datos del contrato sin campos de más.
  - `cxliqproceso`: 19 de 19 como se esperaba. `devolverLiquidacion` sin observaciones da { ok: false } («Observa al menos una línea»), y `enviarFactura` con subtotal distinto también («El subtotal de la factura en el SRI (USD 949,70) no coincide con lo marcado (USD 946,20)»).
- Recorridos:
  - Revisión: observar PCK2210 y devolver con 2 observaciones; pasa a la siguiente («1 de 1»).
  - v2: «Aprobar» deja las 3 líneas en «Por facturar».
  - Finanzas: validar, devolver con motivo y pagar 2 facturas.
  - Mesa: enviar el Borrador 1 lo vuelve #001414 · v1.
  - Quitar y descartar en un borrador no llegan a la base.
  - Con `cxok=0`, el cambio se deshace y se muestra el mensaje.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- La base real (SQL 53) y el servicio real del SRI: lo probé con la conexión simulada.
- La descarga real de PDF y Word.
- El uso con lectores de pantalla.

**Diferencias**
- El panel del cálculo usa la estructura de la ficha de Usuarios, pero va acoplado a la derecha y sin fondo oscuro, para no tapar la barra de selección.
- El borrador no tiene número hasta enviarlo («Borrador 1»), porque el contrato asigna el número en `enviarLiquidacion`. En P-6g-1b se veía como #001414.
- Retirado:
  - La pantalla de P-6g-1 (`sirius-honorarios-base.js`, `datos-cx-honorarios.js` y sus 5 escenas cx*) ya no estaba desde P-6g-1b. Ahora lo comprobé también en lo publicado.
  - En esta etapa salen la sección «Cálculo del honorario», el detalle y los formularios anteriores de la aseguradora, sus pestañas «Honorarios» y «Facturas» y la fila «▾» de la mesa.
  - En el modelo salen las acciones `crearLiquidacion` y `cargarFactura` hacia la base.
- Queda en Liquidaciones el código del recorrido anterior a DEC-247 (etapas 11 y 11-b). Ya no se usa, pero no lo borré en esta etapa.
- «Aprobar» no se puede pulsar mientras haya observaciones, para que no haya aprobación parcial.
- Los contadores de la aseguradora solo aparecen si son mayores que 0, para que las 8 pestañas de Finanzas quepan a 1280 px.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `liqcalculopanel` | Carla Ponce · Finanzas de agencia | Panel del cálculo de PCK2210 (sugeridos 18, cobrados 27, comentario); `?fvista=planta`: la planta con «!» |
| `liqrevision` | Verónica Lema · Ejecutivo de inspecciones | #001414 · v1 a pantalla completa, bodega observada (sugerido USD 146) y «Devolver para corregir (1)» |
| `liqrevisionv2` | Verónica Lema | v2 con «Cambios desde la v1: USD 986,80 → USD 932,50» y «Aprobar» |
| `liqfinanzas` | Mónica Ríos · Finanzas | Validar con la consulta al SRI, devolver otra, pagar dos, «Pagadas» |
| `liqplanta` | Mauricio Endara · Inspector | «Eres inspector de planta»; `?fvista=si`: «Mis honorarios con Eurosurvey» |
| `cxliqproceso` | Carla Ponce (con la conexión) | Prueba del contrato: 13 acciones y sus 2 { ok: false } esperados |

Todas, con `&cx=1`, van con la conexión simulada. También abrí `honorcalculo`, `liqporliquidar`, `liqmesa`, `liqmesavarias`, `liqunicidad`, `liqfacturarsri`, `liqindependiente`, `liqdevolver`, `liqdocumento`, `liquidaciones`, `liqdetalle`, `tarifarios`, `honorpropuesta`, `facturagrupo` y `cuentainspector`.

**Tiempo de la etapa: inicio 16/11/2026 16:33 · fin 16/11/2026 17:09 · 36 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1b (con la maqueta aprobada)

Publiqué la versión 275 de SIRIUS. La etapa P-6g-1b está rehecha sobre la maqueta aprobada: cada inspección entregada llega con su honorario precalculado, y el proveedor trabaja en cuatro pestañas («Por liquidar», «Mesa de trabajo», «Por facturar» con la clave de acceso del SRI y «Seguimiento»). Los componentes y los colores son los del sistema de diseño.

**Qué cambió**
- **Honorario precalculado (DEC-247 · 1):** hay uno por inspección y por vehículo o bien. Usa el tarifario vigente en la fecha de la inspección: el contrato del proveedor y, para lo que el contrato no define, el general.
  - Vehículos: tarifa fija por modalidad.
  - Ramos Generales: hora-hombre por nivel (Básico 50, N1 80, N2 100), redacción por hora y equipos por tramos escalonados.
  - Las horas medidas se redondean a la media hora superior y el nivel se sugiere por el riesgo.
  - Las horas fuera del 50 %–150 % de la referencia del nivel llevan «!» con su explicación.
  - km = distancia del centro a la visita − radio urbano, nunca negativo, × valor por km. Sin valor por km: «km por valorar» y movilización 0.
  - Todo es subtotal; el IVA y el total solo aparecen al pie, como información.
- **Caminos (DEC-247 · 2):**
  - Un preacordado sin km ni ajuste va directo a «Por facturar».
  - Ramos Generales, o cualquier honorario con km o con ajuste, va a «Por liquidar».
  - «Ajustar» un preacordado lo pasa a «Por liquidar» con un aviso; «Quitar el ajuste» lo devuelve.
- **Unicidad (DEC-247 · 3):** un honorario está en una sola liquidación no anulada, y un honorario o una liquidación en una sola factura no devuelta. Quitar un honorario («×») o anular su liquidación lo devuelve a «Por liquidar».
- **«Por liquidar»:**
  - Lista amplia con caso y orden, asegurado, línea de negocio, sucursal, ramo, modalidad, placa o bien, fecha, inspector, por qué se liquida y subtotal. El subtotal va fijo a la derecha, con el enlace «Cálculo».
  - Filtros de fechas, ramo, modalidad, sucursal y línea de negocio, y búsqueda por caso, placa o asegurado.
  - Selección con un clic en la fila y «marcar todo».
  - Barra de selección con cantidad, subtotal, «Quitar selección», «Agregar a #N» y «Crear liquidación y abrir la mesa».
  - La tarjeta «Cálculo del honorario» muestra las partes del cálculo, el tiempo medido, la referencia y los km.
- **«Mesa de trabajo»:**
  - Las liquidaciones abiertas aparecen arriba como fichas; se ve una o «Ver todas a la vez».
  - Cada liquidación tiene «Vista previa», «Anular» y «Enviar a aprobación» (o «Reenviar vN+1»).
  - La hoja tiene la fila de títulos fija, «Caso · sucursal» fijo a la izquierda y el subtotal y las acciones fijos a la derecha.
  - Se editan nivel, horas, equipos, km, ajuste ± y comentario. En Vehículos la base lleva candado y solo cambian los km.
  - La celda cambiada se resalta y el subtotal muestra debajo «calculado USD …».
  - Todo cambio pide comentario: si falta, la celda se resalta y no se puede enviar. Tras cambiar un valor, el foco pasa al comentario de esa fila.
  - «▾» muestra el cálculo de Ramos Generales y «×» quita la línea.
  - En una liquidación «Por corregir», la observación aparece bajo su línea con «Aceptar» el subtotal sugerido.
  - El pie muestra el subtotal resaltado, y el IVA y el total como información.
- **«Por facturar»:**
  - Dos grupos: «Liquidaciones aprobadas» y «Honorarios preacordados».
  - Panel «Nueva factura» con el subtotal a facturar (IVA y total como información), la clave de acceso de 49 dígitos y «Consultar en el SRI».
  - Compara el estado AUTORIZADO, el RUC del emisor y el subtotal. «Enviar factura» solo se habilita con los tres ✓; si algo no coincide, dice qué y todo sigue pendiente.
- **«Seguimiento»:** liquidaciones enviadas, por corregir, aprobadas, facturadas y pagadas, y las facturas con su estado, con «Documento» y «Corregir».
- **Documento:** «Liquidación de honorarios de inspección #N · vN» en PDF y Word, con las partes del cálculo, los km, el ajuste con su comentario y la observación. El pie lleva subtotal, IVA y total.
- **`sirius-sri.js` (nuevo):**
  - `SIRIUS_SRI.consultar(clave) → { estado, ruc, numero, fecha, subtotal, iva, total }`, simulado.
  - `validarClave` revisa los 49 dígitos, el tipo 01 y el dígito verificador.
  - `SIRIUS_SRI.servicio` queda listo para conectar el servicio real.
- **Con la conexión:**
  - Acciones nuevas: `crearLiquidacion`, `enviarLiquidacion { id }`, `ajustarHonorario { id, cambios, comentario }`, `aceptarSugerencia` y `cargarFactura` con la clave.
  - Corrección: con la conexión, la tarifa de la agencia caía en el general. Ahora se busca por RUC en el catálogo local.
- **Colores:**
  - Tokens del sistema: encabezado de tabla de la DataTable con una línea `--border-strong` para dar contraste, y «Anular» como botón secundario con `--color-danger` (el sistema no tiene variante de peligro).
  - Celda cambiada en `--color-brand-wash`, comentario faltante en `--color-danger-bg`, «!» en `--color-warning`.
  - El amarillo propio de las líneas retenidas pasa a `--color-warning-bg`.
- **Escenas:**
  - 5 nuevas y 4 retiradas (`liqcaminos`, `liqproveedor`, `liqcorregir`, `liqfacturar`), con las descripciones revisadas.
  - El lado de la aseguradora sigue como estaba hasta P-6g-1c, adaptado a los campos nuevos.

**Verificado**
- Abrí las 7 escenas nuevas y `tarifarios`, `honorpropuesta` (la calculadora), `facturagrupo` y `cuentainspector` a 1280×720 y 1920×1080: 24 capturas, sin errores de página.
- Mesa a 1280: la tabla mide 1066 px en un contenedor de 1066 px. Caso, placa, celdas, comentario y subtotal se ven sin desplazar. La fila de títulos queda fija al desplazar (probado a 1280×560).
- Valores:
  - PRB1212: USD 16,50.
  - PCK2210 con 18 km: USD 23,70.
  - Bodega Básico 2,4→2,5 h y 1,4→1,5 h, 0 equipos: USD 146.
  - Planta N1 6,4→6,5 h «!», 3 h y 14 equipos: USD 760.
  - TBA1235 con 32 km: USD 29,30.
  - PFJ3628 de Luis: 12 km «por valorar», USD 18.
  - Factura: USD 169,70 + 3 × USD 16,50 = USD 219,20, con IVA USD 32,88 y total USD 252,08.
- Flujos, sin la conexión y con la conexión (`&cx=1`):
  - `liqmesa`: «Enviar» está deshabilitado mientras falta un comentario. Al cambiar los equipos, el foco pasa al comentario. Con los comentarios escritos, la #001414 queda Enviada v1.
  - `liqunicidad`: «×» quita la bodega, que vuelve a «Por liquidar» y se agrega a la #001415. Al anular, vuelven sus líneas.
  - `liqporliquidar`: la búsqueda «PCK» deja 1 de 5. «Crear liquidación y abrir la mesa» crea la #001415 con 2 líneas.
  - `liqmesavarias`: «Aceptar USD 79,00» y luego «Reenviar v2» dejan la #001414 Enviada v2.
  - `liqfacturarsri`: la clave coincide, se envía la factura 001-002-000000412 y queda «Por validar». Con `?fvista=nocoincide`, el subtotal difiere en USD 3,50, «Enviar factura» queda deshabilitado y todo sigue pendiente.
  - Ajustar PRB1212 con 6 km lo pasa a «Por liquidar»; «Quitar el ajuste» lo devuelve.
  - Con `cxok=0`, se muestra «La base no guardó el cambio…» y el cambio se deshace.
- Colores: en el código nuevo no hay otro color fijo que `#FFFFFF`.
- `sirius-conexion.js` sigue en 70 bytes.

**No verificado**
- No probé la consulta real al SRI: la consulta es simulada.
- No probé la descarga real de PDF y Word en un navegador con ventanas emergentes.
- No probé con lectores de pantalla.
- El lado de la aseguradora no se rediseñó: es parte de P-6g-1c.

**Diferencias**
- Colores: el encabezado de tabla y la barra de selección usan los tonos del sistema (claros), no el azul oscuro de la maqueta.
- «Agregar a #N» es un solo botón cuando hay una liquidación abierta; con varias, aparece un selector.
- Anular en Borrador no pide motivo; en «Por corregir» pide un motivo de 10 caracteres o más, que queda en el historial.
- Las horas medidas de `honorcalculo` son 2,4 h y 1,4 h (bodega) y 6,4 h (planta). Al redondearlas dan las horas pedidas.
- No hay ninguna escena llamada «calculadora»: abrí `honorpropuesta`.

**Escenas**

| Escena | Quién | Qué muestra |
|---|---|---|
| `honorcalculo` | Carla Ponce · Finanzas de agencia | Cálculo de 4 honorarios: tarifa fija, 18 km, bodega Básico y planta N1 con «!» |
| `liqporliquidar` | Carla Ponce | Lista filtrada por Quito con 2 marcadas y la barra de selección |
| `liqmesa` | Carla Ponce | #001414 con 4 líneas; cambios con comentario; «Enviar» deshabilitado mientras falta uno |
| `liqmesavarias` | Carla Ponce | «Ver todas a la vez»: #001414 «Por corregir» con su observación y «Aceptar», y #001415 en Borrador |
| `liqunicidad` | Carla Ponce | 2 Borrador; quitar la bodega y agregarla a la otra; anular devuelve las líneas |
| `liqfacturarsri` | Carla Ponce | 1 aprobada + 3 preacordados; la clave coincide; `?fvista=nocoincide`: diferencia de USD 3,50 |
| `liqindependiente` | Luis Andrade · Inspector | Preacordados en «Por facturar» y una presencial con km «por valorar» en «Por liquidar» |

Todas, con `&cx=1`, van con la conexión simulada. También abrí `tarifarios`, `honorpropuesta`, `facturagrupo`, `cuentainspector`, `liqdevolver` y `liqdocumento`.

**Tiempo de la etapa: inicio 16/11/2026 15:04 · fin 16/11/2026 15:47 · 43 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1b

Liquidaciones sigue ahora el proceso real (DEC-247). Los honorarios preacordados quedan listos para facturar. Los variables los agrupa el proveedor en una liquidación con número y versión, que la aseguradora aprueba o devuelve para corregir. El proveedor factura liquidaciones aprobadas y preacordados juntos. Todo usa las mismas pantallas con y sin la conexión, y se retiró la pantalla simplificada de P-6g-1. Quedó publicado en la **Versión 270**; la Versión 271 solo completa en el registro la hora de fin.

**Qué cambió**
- **Un solo modelo, con y sin la conexión:** `SiriusLiqProceso` calcula el honorario y aplica las reglas de las 13 acciones. Con la conexión, cada acción va a la base; con { ok: false }, todo vuelve atrás y se muestra el mensaje. La base simulada usa las mismas reglas.
- **Honorario:** uno por inspección y por vehículo o bien, calculado al entregar el informe.
  - Valor base del tarifario: Vehículos con tarifa fija por modalidad; Ramos Generales con la calculadora hora-hombre.
  - Más la movilización: km sugeridos (centro de la ciudad a la visita, menos el radio urbano) por el valor por km. Sin valor por km, dice «km por valorar».
  - Preacordado (sin km y sin ajuste) → directo a «Por facturar». Si no → «Por liquidar».
  - Ajustar un preacordado avisa «Al ajustar, este honorario necesita liquidación»; quitar el ajuste lo devuelve.
- **Proveedor** (Finanzas de agencia o inspector independiente): pestañas Honorarios, Liquidar, Liquidaciones, Facturar y Facturas, además de su cuenta o «Pagos a nuestros inspectores».
  - Liquidar: filtros de fechas, modalidad y ramo; ajuste de valor o km con nota obligatoria; vista previa; envío (v1).
  - Por corregir: aceptar el valor sugerido en un clic, ajustar, quitar, agregar, «Reenviar (vN+1)» o anular.
  - Facturar: dos grupos (liquidaciones aprobadas completas y preacordados uno por uno) y el total esperado con el IVA vigente.
- **Aseguradora** (Ejecutivo de inspecciones, Finanzas y Administrador, configurable):
  - «Por aprobar» con la columna Versión y, por proveedor, cuántas liquidaciones tuvieron más de una versión.
  - El detalle resalta las líneas ajustadas (propuesto frente a tarifario) y, desde la v2, muestra solo lo que cambió.
  - «Aprobar» aprueba la liquidación completa. «Devolver para corregir» pide líneas observadas (texto y valor sugerido opcional) y un motivo.
  - Finanzas valida o devuelve la factura y registra el pago.
- **Unicidad:** un honorario está en una sola liquidación no anulada, y un honorario o una liquidación en una sola factura no devuelta. Quitar o anular devuelve a «Por liquidar»; una factura devuelta deja todo en «Por facturar».
- **Documento:** la orden de pago «#001414 · v2» y la factura, con caso, orden, ramo, asegurado, modalidad, placa o bien, fecha, estado del caso, base, km, movilización, ajuste con su nota, observación y total. Se descargan en PDF (imprimir) y en Word, con su plantilla.
- **Historial** por versión (quién, cuándo, resultado, observaciones y cambios) y de cada factura.
- **Tarifario:** «Aprobación» por grupo (inicial: Vehículos «Preacordada», Ramos Generales «Requiere liquidación») y «Valor por km fuera del perímetro urbano» (sin valor inicial). Salen «Momento y responsable de liquidar» y la validación previa de la agencia.
- **Ficha de la agencia:** «Paga a sus inspectores por inspección» (inicial: no). Con «no», el inspector de agencia no ve honorarios ni el menú «Honorarios»; con «sí», ve «Mis honorarios con <agencia>».
- **Inicio:** tareas del proceso nuevo para el proveedor (liquidar, corregir, facturar, factura devuelta), los aprobadores y Finanzas.
- **Retirado:** `sirius-honorarios-base.js`, `datos-cx-honorarios.js` y las 5 escenas cx* de P-6g-1.

**Verificado**
- `liqcaminos` (con y sin la conexión): 4 preacordados «Por facturar» (USD 16,50 y 12,00), PBX4410 con 20 km sugeridos × USD 0,40 «Por liquidar» y la bodega USD 121,00. Ajustar uno avisa y lo pasa a «Por liquidar»; quitar el ajuste lo devuelve.
- `liqproveedor`: ajusté 35 km con nota, vi la vista previa y envié la #001414 · v1 (USD 174,23).
- `liqdevolver`: la línea ajustada sale resaltada; al devolver, la liquidación queda «Por corregir» con la observación y el motivo en el historial.
- `liqcorregir`: aceptar la sugerencia, quitar la bodega y reenviar dejan la v2 (con la conexión, envía `aceptarSugerencia`, `editarLiquidacion` y `reenviarLiquidacion`). Con `?fvista=aprobador`, «Qué cambió desde la v1» y «Líneas que cambiaron (1 de 1)»; se aprueba.
- `liqunicidad`: «Liquidar» vacío; al quitar la bodega aparece y entra en la #001415. Con la conexión, al anular, sus 2 líneas vuelven y van en la #001415.
- `liqfacturar`: con otro total, «No coincide: el total debe ser USD 225,98» junto al campo y nada se envía. Con el total correcto (USD 196,50 + 29,48 = 225,98) queda «Por validar». Con `?fvista=devuelta`, todo vuelve a «Por facturar» con el aviso.
- `liqindependiente` (con la conexión): Luis factura sus 2 preacordados (USD 34,50) y envía su Ramos Generales.
- `liqplanta`: sin pago, el inspector no ve honorarios; con `?fvista=si`, «Mis honorarios con Eurosurvey» (con y sin la conexión).
- `liqdocumento`: el documento «#001414 · v2»; la factura se valida y se paga.
- **Conexión temporal en una copia aparte:** las 13 acciones salieron con la forma exacta del contrato. Las ids de la base reemplazan a las de la pantalla, y una respuesta { ok: false } devolvió todo a como estaba.
- Inicio de Luis (`facturadevuelta`) muestra «Corregir factura» y «Facturar». `iniciofin` e `inicioeje` abren sin errores.
- Abrí las 9 escenas nuevas sin y con la conexión simulada, y `tarifarios`, `facturagrupo`, `facturadevuelta`, `agenciapagos`, `cuentainspector`, `cuentaaprobar` y `mishonorarios`, a 1280×720 y 1920×1080, sin errores en la consola.
- `sirius-conexion.js` sigue con su línea mínima (70 bytes). KNOWN_ESC 663 y 706 escenas.

**No verificado**
- Las capturas adjuntas («Solicitud de liquidación» y «Aprobación de liquidaciones») no llegaron a esta sesión; me guié por su descripción.
- Contra la base real: solo con la base simulada y la conexión temporal.
- El cálculo al entregar un informe en el prototipo: los honorarios salen de los informes entregados de datos-liq-proceso.js; no lo conecté al envío del informe en Completar o en la app.
- Imprimir y descargar Word: los botones existen, pero no abrí el PDF ni el .doc en otro programa.
- Las escenas existentes no tienen variante con la conexión (`?cx=1` solo arma las 9 nuevas).

**Diferencias**
- La «Factura que agrupa» y la «Factura devuelta» se rehicieron sobre el modelo nuevo; las pantallas son nuevas, con los mismos componentes de Liquidaciones. Las escenas `liquidaciones`, `liqdetalle`, `liqfactura`, `facturagrupo`, `facturadevuelta` y `mishonorarios` ahora muestran el proceso nuevo.
- Aceptar el valor sugerido deja la línea exactamente en ese valor, sin km aparte (el valor sugerido se toma como el total de la línea).
- El ajuste guarda «valor de la inspección» y «km»; el total es valor más km por valor por km.
- No hay «Borrador» guardado: la liquidación nace «Enviada · v1» desde «Liquidar». Anular solo se ofrece en «Por corregir».
- Con la conexión, «Paga a sus inspectores por inspección» se lee de `agencias[].pagaInspectores`. Cambiarlo con la conexión no tiene acción en el contrato: hoy solo se cambia sin la conexión.
- Tarifarios, Configuración y Cuentas siguen con datos de ejemplo también con la conexión. El aviso «Datos de demostración» vuelve a Liquidaciones solo si la base no trae `honorarios[]`.
- Las escenas `honoragencia`, `honorporliquidar`, `honorsubasta` y `montodecimal` (aprobación honorario por honorario, validación de la agencia, subasta y monto con decimales) quedan fuera del recorrido: abren sin errores, pero con las pestañas nuevas.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `liqcaminos` | 6 honorarios de Eurosurvey: 4 preacordados, 1 con km y 1 de Ramos Generales; ajustar un preacordado lo pasa a «Por liquidar» |
| `liqproveedor` | «Liquidar»: ajustar con km adicional y nota, vista previa y enviar (v1) |
| `liqdevolver` | Ejecutivo de inspecciones: la v1 con la línea ajustada resaltada y «Devolver para corregir» con valor sugerido |
| `liqcorregir` | Aceptar la sugerencia, quitar una línea y reenviar (v2); `?fvista=aprobador`: solo los cambios y aprobar |
| `liqunicidad` | Quitar o anular devuelve el honorario a «Liquidar» y entra en una liquidación nueva |
| `liqfacturar` | Factura con 1 liquidación y 3 preacordados; total errado; `?fvista=devuelta` |
| `liqindependiente` | Luis Andrade factura sus preacordados y liquida su Ramos Generales |
| `liqplanta` | Inspector de agencia sin honorarios; `?fvista=si`: «Mis honorarios con Eurosurvey» |
| `liqdocumento` | Documento «#001414 · v2»; `?fvista=factura`: la factura con su detalle |

Todas con `&cx=1` van con la conexión simulada. También abrí `tarifarios`, `facturagrupo`, `facturadevuelta`, `agenciapagos`, `cuentainspector`, `cuentaaprobar`, `mishonorarios`, `liqfactura`, `iniciofin` e `inicioeje` para comparar.

**Tiempo de la etapa: inicio 16/11/2026 10:35 · fin 16/11/2026 11:13 · 38 min**

---

## 18/10/2026 · 20:30 — Etapa P-6g-1

Con la conexión, Liquidaciones trabaja con los honorarios y las liquidaciones de la base: Finanzas aprueba, rechaza y corrige honorarios, y genera, cierra, aprueba, paga o anula liquidaciones. Cada rol ve solo lo suyo. Sin la conexión, Liquidaciones queda como antes. Quedó publicado en la **Versión 266**; la Versión 267 solo completa en el registro la hora de fin.

**Qué cambió**
- **Módulo nuevo `SiriusHonorariosBase`:** lee `SIRIUS_CONEXION.honorarios` y `SIRIUS_CONEXION.liquidaciones`. Muestra el nombre actual del inspector y de la agencia por su identificación y RUC (DEC-214), y aplica las 9 acciones. Cada cambio se ve al instante; con { ok: false } todo vuelve atrás y se muestra el mensaje de la base.
- **Honorarios (Finanzas y Administrador):**
  - Contadores por estado y filtros de período y estado.
  - «Aprobar seleccionados», con un comentario opcional.
  - «Rechazar» y «Corregir» piden el motivo (10 caracteres o más) y, al corregir, el monto; el mensaje sale junto al campo. Un rechazado corregido vuelve a «Por aprobar».
- **Liquidaciones (Finanzas y Administrador):**
  - «Generar liquidación» por período y beneficiario: la agencia por su RUC o el inspector independiente por su cédula. La lista solo ofrece beneficiarios con honorarios aprobados.
  - En el detalle: «Quitar» y «Agregar honorarios aprobados» mientras está «Abierta»; luego «Cerrar», «Aprobar», «Registrar pago» (fecha y referencia obligatorias, cuenta opcional) y «Anular» con motivo. Debajo, el historial.
  - Los honorarios pasan a «Liquidado» al entrar en la liquidación y a «Pagado» con el pago; quitarlos o anular la liquidación los devuelve a «Aprobado».
- **Quién ve qué:**
  - Finanzas de agencia ve solo lo de su RUC, sin acciones.
  - El inspector independiente ve sus honorarios y sus liquidaciones.
  - El inspector de agencia ve «Mis honorarios con <agencia>»: sus honorarios y lo acumulado del mes, sin la liquidación de su agencia.
- **Back-office:** carga los dos archivos nuevos, abre las escenas con su rol y quita el aviso «Datos de demostración» de Liquidaciones con la conexión.

**Verificado**
- `cxhonorarios`: aprobar HON-6101 y HON-6102 envía `aprobarHonorarios { ids }`, y los contadores pasan de 4 a 2 «Por aprobar» y de 6 a 8 «Aprobado». «Rechazar» sin motivo muestra «Escribe el motivo (mínimo 10 caracteres).» junto al campo y no envía nada; con motivo, envía `rechazarHonorario { id, motivo }` y «Rechazado» pasa de 1 a 2.
- `cxliquidaciongen`: generar la de Eurosurvey (3 honorarios, USD 74,50), quitar HON-6106 (2, USD 60,50), cerrar, aprobar y pagar. Sin referencia, el pago no se envía y avisa junto al campo. Los honorarios pasan a «Liquidado» y luego a «Pagado». Las 5 acciones salieron con la forma del contrato.
- `cxliquidacionerror`: cerrar la liquidación vacía envía `cerrarLiquidacion`; la base responde { ok: false }, la liquidación sigue «Abierta» y se muestra el mensaje. Con `?fvista=anular`, la «Cerrada» queda «Anulada» y sus 2 honorarios vuelven a «Aprobado».
- `cxliquidacionindep`: la de Luis Andrade por su cédula se cierra. Con `?fvista=inspector`, Luis ve solo lo suyo.
- `cxliquidacionagencia`: Finanzas de agencia ve solo honorarios de Eurosurvey (ni Luis Andrade ni Inspecciones Andinas) y ningún botón. Con `?fvista=inspector`, Mauricio ve sus 3 honorarios y USD 84,00 acumulados, sin la liquidación.
- **Conexión temporal en una copia aparte** (`sirius-conexion.js` reemplazado solo allí): las 9 acciones salieron con la forma exacta del contrato. Una respuesta { ok: false } al cerrar devolvió todo a como estaba. Liquidaciones también se abrió desde el menú con esa conexión.
- **Sin la conexión:** las 15 escenas existentes (`liquidaciones`, `liqdetalle`, `liqfactura`, `liqtarifas`, `tarifarios`, `tarifarioeur`, `compltarifa`, `honoragencia`, `facturagrupo`, `honorsubasta`, `montodecimal`, `honorporliquidar`, `agenciapagos`, `cuentainspector`, `cuentaaprobar`) dan el mismo texto que antes.
- Abrí las 5 escenas nuevas (y sus variantes) y esas 15 a 1280×720 y 1920×1080, sin errores en la consola.
- `sirius-conexion.js` sigue con su línea mínima (70 bytes). KNOWN_ESC 659 y 702 escenas.

**No verificado**
- Contra la base real: solo con la base simulada y con la conexión temporal de la copia.
- La app del inspector (`sirius-app-inspector.js`) sigue mostrando sus honorarios con datos de ejemplo; conecté la sección de honorarios del Back-office.
- No probé un período sin honorarios ni el cambio de mes (el período actual sale del reloj de Ecuador).
- No probé con teclado las casillas de la tabla ni el detalle, solo con clic.

**Diferencias**
- Con la conexión, Liquidaciones no muestra Tarifarios, Configuración (IVA), Facturas, Cuentas bancarias ni «Pagos a nuestros inspectores»: no están en la base todavía y siguen con datos de ejemplo sin la conexión.
- «Cerrar» una liquidación sin honorarios no se bloquea en la pantalla: avisa debajo y envía, y la base la rechaza (así lo pide la escena `cxliquidacionerror`). Pagar sin fecha o sin referencia sí se frena en la pantalla.
- Una liquidación generada sin honorarios aprobados queda «Abierta» y vacía; no se puede generar otra igual (mismo período y beneficiario) mientras no se anule.
- El inspector de agencia ve el estado de cada honorario («Liquidado», «Pagado»), pero no la liquidación, su total ni a otros inspectores. El monto que ve es el que la base registra para su visita.
- Finanzas de agencia ve los montos de su agencia, pero no puede aprobar ni liquidar.
- El historial de la liquidación lo arma la pantalla con lo hecho en la sesión; el de la base llega en `historial`.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxhonorarios` | Finanzas aprueba 2 honorarios y rechaza 1 con motivo; los contadores por estado cambian |
| `cxliquidaciongen` | Generar la liquidación de Eurosurvey (RUC 1791456320001) del período actual, quitar un honorario, cerrar, aprobar y pagar con fecha y referencia |
| `cxliquidacionindep` | La liquidación de Luis Andrade por su cédula; `?fvista=inspector`, como Luis |
| `cxliquidacionagencia` | Finanzas de agencia de Eurosurvey ve solo lo suyo; `?fvista=inspector`, Mauricio Endara con sus honorarios sin montos de la liquidación |
| `cxliquidacionerror` | La base rechaza cerrar sin honorarios; `?fvista=anular`, anular una liquidación cerrada |

También abrí `liquidaciones`, `liqdetalle`, `liqfactura`, `liqtarifas`, `tarifarios`, `tarifarioeur`, `compltarifa`, `honoragencia`, `facturagrupo`, `honorsubasta`, `montodecimal`, `honorporliquidar`, `agenciapagos`, `cuentainspector` y `cuentaaprobar` para comparar.

**Tiempo de la etapa: inicio 16/11/2026 07:41 · fin 16/11/2026 08:04 · 23 min**

---

## 18/10/2026 · 20:30 — Etapa P-6f-d (con el lugar contraído)

Nueva solicitud muestra el lugar de inspección contraído, con una casilla para abrirlo. Los mensajes de validación junto al campo y las agencias con sus inspectores por RUC ya estaban en la Versión 261; en esta etapa los volví a abrir y probar junto con el lugar contraído. Quedó publicado en la **Versión 263**; la Versión 264 solo completa en el registro la hora de fin.

**Qué cambió**
- **Lugar de la inspección contraído (Nueva solicitud, vehículos y equipos):**
  - La sección empieza contraída, con la casilla «Ya tengo la dirección de la inspección» y el texto «Si aún no la tienes, se confirma en el contacto».
  - Al marcarla se abre con la provincia, el cantón, la dirección, la referencia y el mapa (solo el punto, sin zonas).
  - Al desmarcarla se contrae y lo escrito no se envía. Si había algo escrito, antes avisa «Se descartará la dirección escrita: …» con los botones «Descartar la dirección» y «Conservarla»; si no había nada, se contrae sin aviso.
  - En la revisión y envío, sin dirección dice «Lugar de inspección: Se confirmará en el contacto». Con la conexión, `crearCaso` lleva `solicitud` vacía y los riesgos sin dirección ni ciudad.
  - En Ramos Generales no móviles, cada ubicación sigue con su dirección obligatoria (DEC-222).
- **Mensajes de validación con la conexión (ya en la Versión 261):** la cédula, el pasaporte y el RUC muestran el mensaje junto al campo al salir de él y al intentar guardar; el botón no envía nada a la base con un error; si la base rechaza la identificación o el RUC, el mensaje también sale junto al campo, además del aviso general.
- **Agencias por RUC (ya en la Versión 261):** «Inspectores» cuenta y lista comparando `agencias[].ruc` con `usuarios[].agenciaRuc` e `inspectores[].agenciaRuc`; sin RUC, por el nombre. Liquidaciones reconoce a la agencia también por RUC; tarifas, Control de calidad y selectores no leen personas de la conexión y no cambiaron.

**Verificado**
- `nuevalugarcontraido`: contraída al abrir y sin campos de dirección ni mapa; marcar la casilla abre el editor (dirección, referencia y mapa, sin zonas); desmarcarla con «Av. Amazonas N36-152» escrita muestra «Se descartará la dirección escrita»; «Conservarla» deja la dirección y la casilla marcada; «Descartar la dirección» contrae y, al volver a marcarla, el campo está vacío; desmarcarla sin nada escrito no avisa; el paso 4 dice «Lugar de inspección: Se confirmará en el contacto». Variantes `?fvista=marcado`, `aviso` y `revision` abiertas.
- `crearCaso`: con el lugar contraído (`nuevalugarcontraido&fvista=revision` y `nuevasindir`) `solicitud` va vacía; con la dirección de Quito (`nuevasinzonas`) lleva provincia, ciudad, dirección, referencia y punto.
- `cxvalidacedula`: con 1709991260 el mensaje sale junto al campo y no envía `crearUsuario`; con `?cxvalida=1` (1709991267) sí envía. `cxagenciasinspectores`: Eurosurvey con 2 inspectores (Mauricio Endara y Valeria Cevallos), Inspecciones Andinas con 1 y Peritajes del Pacífico «Sin inspectores».
- Abrí las 3 escenas nuevas y `nuevasindir`, `nuevasinzonas`, `cxnuevaveh`, `maestrosusuarios`, `maestrosagencias`, `cxmaestros`, `cxusuarios` y `liquidaciones` a 1280×720 y 1920×1080, sin errores en la consola. Comparé el texto con la versión anterior: `maestrosusuarios`, `maestrosagencias`, `cxmaestros`, `cxusuarios` y `liquidaciones` salieron iguales; `nuevasindir`, `nuevasinzonas` y `cxnuevaveh` cambian solo por la casilla y por «Lugar de inspección».
- `sirius-conexion.js` sigue con su línea mínima (70 bytes). KNOWN_ESC 654 y 697 escenas.

**No verificado**
- Equipos: el lugar contraído usa el mismo código que vehículos, pero solo abrí vehículos.
- Todo lo de la conexión está probado solo con la base simulada, no con una real.
- No probé el teclado en la casilla (Tab y Espacio), solo el clic.
- Control de calidad, tarifas y selectores no los abrí con la conexión: solo revisé el código.

**Diferencias**
- Con la casilla marcada, la dirección sigue siendo opcional: marcarla y dejarla vacía no da error; es como si no se hubiera escrito.
- Las escenas que ya traían un lugar escrito (`cxnuevaveh`, `nuevasinzonas`) abren la sección desplegada y con la casilla marcada: la casilla se deduce de lo escrito.
- En la revisión y envío, la etiqueta pasa de «Lugar de la inspección» a «Lugar de inspección», y sin dirección el valor es «Se confirmará en el contacto» (antes, «Sin dirección: se confirma en el contacto»).
- Con la casilla, la ayuda del editor ya no repite «Si aún no la tienes, se confirma en el contacto»: dice «Si aún no la tienes, desmarca la casilla».
- El aviso de descarte sale bajo la casilla como texto, con dos botones; no es una ventana aparte.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `nuevalugarcontraido` | Nueva solicitud de Vehículos, paso 3, con el lugar contraído; marcar la casilla lo abre; `?fvista=aviso` muestra el aviso de descarte; `?fvista=revision` el paso 4 con «se confirmará en el contacto» |
| `cxvalidacedula` | Crear usuario con la cédula 1709991260: mensaje rojo junto al campo y nada se envía; `?cxvalida=1` envía |
| `cxagenciasinspectores` | Agencias: Eurosurvey con 2 inspectores (Mauricio Endara y Valeria Cevallos) por RUC |

También abrí `nuevasindir`, `nuevasinzonas`, `cxnuevaveh`, `maestrosusuarios`, `maestrosagencias`, `cxmaestros`, `cxusuarios` y `liquidaciones` para comparar.

**Tiempo de la etapa: inicio 15/11/2026 23:58 · fin 16/11/2026 00:09 · 11 min**

---

## 18/10/2026 · 20:30 — Etapa P-6f-d

Con la conexión, los mensajes de validación de la identificación y del RUC salen junto al campo, y Agencias cuenta y lista sus inspectores por RUC. Quedó publicado en la **Versión 261**; la Versión 262 solo completa en el registro la hora de fin.

**Qué cambió**
- **Mensajes junto al campo (Usuarios crear y editar, y Agencias):**
  - La cédula, el pasaporte y el RUC muestran el mensaje en rojo junto al campo al salir de él y al intentar guardar, igual que sin la conexión («La cédula no es válida (dígito verificador).»).
  - Si la base responde un error de identificación o de RUC («La identificación 1709991275 ya está registrada (Carlos Mora).»), también sale junto al campo, además del aviso general.
  - «Crear usuario» y «Guardar cambios» se pueden pulsar aunque haya un error: no envían nada a la base y muestran los mensajes junto a cada campo. Sigue el texto «Para continuar: …».
- **Agencias por RUC (DEC-214):**
  - La columna «Inspectores» cuenta y lista a los inspectores comparando `agencias[].ruc` con `usuarios[].agenciaRuc` e `inspectores[].agenciaRuc`. Mauricio Endara y Valeria Cevallos llegan con agencia «Eurosurvey S.A.» y su RUC, y se cuentan en Eurosurvey (nombre comercial).
  - Sin RUC («Sin identificación»), la relación de transición es por el nombre comercial o la razón social con que llega la persona.
  - Una persona que está como usuario y como inspector de la base se cuenta una sola vez (por identificación; sin ella, por nombre). La columna «Usuarios» usa la misma relación.
  - El filtro de agencia de Usuarios, la columna Agencia, la ficha y el usuario conectado (`cxUsuario`) usan la misma relación y muestran el nombre comercial; el formulario de editar no marca un cambio de agencia si solo difiere el nombre.
- **Otros lugares con agencia e inspector:** Liquidaciones reconoce al proveedor como agencia también por RUC o razón social. Tarifas y cuentas (por identificador interno de la agencia), Control de calidad y los selectores (por nombre del inspector) no leen personas de la conexión; los revisé y no cambié nada.

**Verificado**
- `cxvalidacedula` con la cédula 1709991260: mensaje rojo junto al campo y «Crear usuario» no envía `crearUsuario`; con `?cxvalida=1` (1709991267) envía `crearUsuario` con `agenciaRuc` «1791456320001»; con `?cxdup=1` la base la rechaza y el mensaje también sale junto al campo.
- Escribir una cédula inválida (1709991268) en `cxmaestros` y salir del campo muestra el mensaje; en `cxusuarioeditar`, 1709991260 y «Guardar cambios» no envían nada; en la agencia nueva, un RUC de 10 dígitos muestra «El RUC tiene 13 dígitos (escribiste 10)» y no envía `guardarAgencia`; con los datos correctos sí envía.
- `cxagenciasinspectores`: Eurosurvey «2 inspectores» (Mauricio Endara, Valeria Cevallos), Inspecciones Andinas «1 inspector» (Sofía Arteaga, por RUC), Peritajes del Pacífico «Sin inspectores».
- Abrí las 2 escenas nuevas y `maestrosusuarios`, `maestrosagencias`, `cxmaestros`, `cxusuarios` y `liquidaciones` a 1280×720 y 1920×1080, sin errores en la consola. Comparé el texto de esas 5 y de `cxusuarioeditar` con la versión anterior: salieron iguales.
- `sirius-conexion.js` sigue con su línea mínima (70 bytes). KNOWN_ESC 653 y 696 escenas.

**No verificado**
- Contra una base real: la relación por RUC y el rechazo de identificación solo los probé con la base simulada.
- Un usuario sin `agenciaRuc` en una agencia con RUC se relaciona por nombre (transición); no probé nombres que se parezcan sin ser iguales.
- Control de calidad, tarifas y selectores no los abrí con la conexión: solo revisé el código.

**Diferencias**
- **Qué causaba cada problema:** el mensaje de la identificación dependía de `tried`, y con la conexión el botón estaba deshabilitado mientras había un error, así que `tried` nunca se marcaba. Agencias comparaba `usuario.agencia === agencia.nombre`, y los inspectores llegan con la razón social «Eurosurvey S.A.» mientras la agencia se muestra por su nombre comercial «Eurosurvey».
- El botón de guardar ya no se deshabilita por falta de datos con la conexión (P-6f-0h): se puede pulsar y muestra qué falta junto a cada campo, como la versión sin la conexión. Sigue deshabilitado sin cambios, con el rol propio de Administrador quitado y mientras envía.
- En las semillas de las escenas con la conexión, los usuarios de agencia ahora llegan con la razón social y `agenciaRuc`, como los de la base real.
- La columna «Inspectores» de Agencias ahora muestra los nombres debajo del conteo.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxvalidacedula` | Crear usuario con la cédula 1709991260: mensaje rojo junto al campo y nada se envía; `?cxvalida=1` (1709991267) envía; `?cxdup=1` la base la rechaza |
| `cxagenciasinspectores` | Agencias: Eurosurvey con 2 inspectores (Mauricio Endara y Valeria Cevallos) por RUC |

También abrí `maestrosusuarios`, `maestrosagencias`, `cxmaestros`, `cxusuarios`, `cxusuarioeditar` y `liquidaciones` para comparar.

**Tiempo de la etapa: inicio 15/11/2026 23:35 · fin 15/11/2026 23:47 · 12 min**

---

## 18/10/2026 · 20:30 — Etapa P-6f-c

Nueva solicitud usa ahora provincia y cantón del catálogo INEC (con búsqueda al escribir), la dirección de inspección es opcional en vehículos y equipos, y no muestra zonas. Calificación marca la opción al instante. Quedó publicado en la **Versión 259**; la Versión 260 solo completa en el registro la hora de fin.

**Qué cambió**
- **Provincia y Cantón (solicitante, asegurado y cada ubicación):** salen de SIRIUS_GEOGRAFIA, solo los activos (24 provincias y 223 cantones; quedan fuera «Zona en estudio» y 2 cantones no activos). Los dos tienen búsqueda al escribir, con el nombre exacto primero («Quito» antes que «Puerto Quito»). El cantón se habilita al elegir la provincia y se vacía si la provincia cambia; si lo escrito no está en la lista, vuelve al valor anterior. Al enviar se pide un valor de la lista.
- **Dirección de inspección:**
  - En vehículos y equipos es opcional, con el texto «Si aún no la tienes, se confirma en el contacto».
  - El resumen dice «Sin dirección: se confirma en el contacto».
  - Con la conexión, `solicitud` (y los riesgos de esos grupos) puede ir sin dirección, ciudad ni punto: lo vacío no viaja.
  - En Ramos Generales, cada ubicación asegurada sigue con su cantón y su dirección (DEC-222).
- **Sin zonas en Nueva solicitud:** el editor de lugar no dibuja la calculadora de zonas ni las áreas o puntos de zonas en el mapa; si la dirección se ubica, se ve solo el punto. Las zonas siguen en Coordinar visita, Agenda, Ciudades y zonas y la app del inspector.
- **Con la conexión:**
  - crearCaso lleva `asegurado.provincia` y `asegurado.canton` con los códigos del INEC («17», «1701») y `asegurado.direccion`.
  - La base simulada acepta la solicitud sin dirección y valida esos códigos.
  - `sirius-conexion.js` sigue con su línea mínima (70 bytes).
- **Calificación al instante:** el formulario (Vehículos) ya no avisa a toda la pantalla del caso en cada opción; guarda su borrador en un módulo nuevo (`sirius-cal-borrador.js`) y solo «Aplicar a otros vehículos» se suscribe. En Ramos Generales el borrador dejó de ir al estado de la pantalla.

**Verificado**
- Abrí las 4 escenas nuevas (con las variantes de `nuevageo`), `cxnuevaveh`, `cxnuevarg`, `cxnuevaflota`, `cxr0dadmin` y `cxr0emodulo` a 1280 × 720 y 1920 × 1080: 22 aperturas sin errores de página.
- `nuevageo`:
  - La lista abre con las 24 provincias; al escribir «tungu» queda Tungurahua y el cantón ofrece 9 (Ambato, Baños de Agua Santa, Cevallos, Mocha, Patate, Quero, San Pedro de Pelileo, Santiago de Píllaro y Tisaleo).
  - Con «pel» queda San Pedro de Pelileo.
  - Al cambiar a Pichincha el cantón queda vacío y ofrece sus 8; «zzz» da «No hay cantones con ese nombre en la provincia.».
  - Sin provincia, el cantón está deshabilitado.
- `nuevasindir`: «Registrar solicitud» envía crearCaso con `solicitud: {}` (sin direccion, ciudad ni punto), `asegurado.provincia` «17», `asegurado.canton` «1701» y `asegurado.direccion`; abre el caso 50013 «En coordinación».
- `nuevasinzonas`: al escribir «Av. Amazonas» y elegir la sugerencia, el mapa tiene 1 punto, 0 áreas y 0 cajas de zona; no hay textos como «Zona Norte» ni «Cambiar la zona».
- `cxnuevarg`: crearCaso sigue llevando dirección y ciudad en cada ubicación (Quito y Guayaquil).
- Tiempo desde el clic hasta pintar la opción (mismo navegador de pruebas, 6 cambios por escena):

| Formulario | Antes | Ahora |
|---|---|---|
| Vehículos: «Es asegurable» / «No asegurable» (`calrapida`) | 931 a 1073 ms | 4 a 12 ms (17 a 35 ms hasta el cuadro pintado) |
| Vehículos: cobertura o motivo (lista) | no medido | 5 ms (12 ms hasta pintar) |
| Ramos Generales: veredicto por ramo | 46 a 74 ms | 10 a 21 ms |
| Completar el informe (informe y decisión) | 22 a 47 ms | sin cambio |

- «Aplicar a otros vehículos» sigue el borrador: habilitado con «Es asegurable» y cobertura, deshabilitado con «No asegurable» sin motivo, habilitado al elegir el motivo, y abre la ventana con los otros vehículos.
- Comparé el texto de 21 escenas existentes con la versión anterior: 17 salieron iguales (`ns1g`, `ns3v`, `ns4`, `nsvacio`, `nsmarca`, `nsbpm`, `coordfases`, `cxnuevaveh`, `cxnuevaerror`, `cxnuevaramos`, `veh`, `calveh`, `calrg`, `calrgveredicto`, `cxr0dadmin`, `cxr0emodulo` y `ciudadesbuscar`); las 4 que cambian (`ns2`, `ns3g`, `cxnuevarg`, `cxnuevaflota`) difieren porque las listas de provincia y cantón ahora son buscables.

**No verificado**
- Los tiempos son de mi navegador de pruebas. Antes veía cerca de 1 s donde tú ves unos 2 s; no los medí en tu equipo.
- Completar el informe no lo cambié: su formulario es parte de la pantalla del caso. Mide 22 a 47 ms aquí; en un equipo el doble de lento rondaría 45 a 95 ms, muy cerca del límite de 100 ms.
- No probé las flechas arriba y abajo de las listas de provincia y cantón, solo escribir, Enter, Tab y el clic.
- crearCaso con los campos nuevos solo contra la base simulada, no contra una real.
- El mapa base (las teselas) no carga en mi entorno: vi el punto sobre fondo gris, no el mapa completo.

**Diferencias**
- **Qué causaba el retraso:** cada opción de Calificación (`onDraftChange`) hacía un `setState` en el Back-office y toda la pantalla del caso (más de 1 MB de plantilla) se volvía a pintar antes de que el navegador marcara la opción. Ahora el borrador va a `SiriusCalBorrador` y solo se vuelve a pintar el botón «Aplicar a otros vehículos», y solo cuando el borrador pasa a completo o incompleto. En Ramos Generales el borrador queda en un campo de la pantalla y no en el estado.
- En Completar el informe no hubo ese aviso: el formulario del informe vive en la pantalla del caso y ya responde en menos de 100 ms.
- Con el selector de Nueva solicitud se guarda el nombre (por ejemplo «Tungurahua», «Ambato») y los códigos del INEC se calculan al enviar; en el editor de lugar de cada ubicación se guarda el código.
- «Ciudad» pasa a llamarse «Cantón» en el lugar de Nueva solicitud; Coordinar visita y el portal conservan «Ciudad».
- En vehículos y equipos, si el lugar queda vacío, la solicitud no lleva ciudad; la base usa la de la sucursal, como ya hacía Coordinación.
- Corregí un detalle del catálogo: «Los Ríos» salía como «los Ríos» en las listas de provincias.
- El orden de las coincidencias («Quito» antes que «Puerto Quito») también aplica a las listas de marca y modelo.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `nuevageo` | Paso 2 con las 24 provincias; `?fvista=tungurahua` (cantón con Ambato…) y `?fvista=pichincha` |
| `nuevasindir` | Vehículos en «Revisión y envío» sin dirección; crearCaso sin solicitud.direccion y con asegurado.provincia y canton |
| `nuevasinzonas` | Dirección de Quito ubicada: el mapa muestra solo el punto, sin zonas ni calculadora |
| `calrapida` | Calificación de 20196 como Ejecutivo: alternar «Es asegurable» y «No asegurable» se marca al instante |

También abrí `cxnuevaveh`, `cxnuevarg`, `cxnuevaflota`, `cxr0dadmin` y `cxr0emodulo`, además de `ns2`, `ns3g`, `calveh`, `calrg`, `calrgveredicto`, `infcompletarcaso`, `infpasoinforme`, `cxr0bcompletar` y `ciudadesbuscar` para comparar y medir.

**Tiempo de la etapa: inicio 15/11/2026 23:05 · fin 15/11/2026 23:32 · 27 min**

---

## 18/10/2026 · 20:30 — Etapa P-6f-b

Agencias, inspectores y usuarios ya se identifican por su identificación (DEC-214): el RUC de cada agencia y la cédula o el pasaporte de cada persona, con validación junto al campo, únicos en la compañía y con la etiqueta «Sin identificación» para las fichas anteriores. Quedó publicado en la **Versión 257**; la Versión 258 solo completa en el registro la hora de fin.

**Qué cambió**
- **Validaciones (`sirius-maestros.js`, nuevo):** cédula de 10 dígitos con provincia 01 a 24 o 30, tercer dígito menor que 6 y dígito verificador (módulo 10). Pasaporte de 5 a 20 letras o números. RUC de 13 dígitos que termina en 001. Los mensajes salen junto al campo, por ejemplo «La cédula no es válida (dígito verificador).» o «El RUC debe terminar en 001.».
- **Usuarios:** la lista tiene la columna «Identificación». Invitar y editar piden «Tipo de identificación» (Cédula o Pasaporte) y el número, y rechazan uno repetido con «Esa identificación ya está registrada (Marco Tapia)». Al editar también se puede cambiar el nombre.
- **Agencias:** la ficha y el formulario tienen razón social, nombre comercial y RUC obligatorio y único.
- **Referencias por identificación:** lo nuevo se guarda con la identificación y se muestra con el nombre actual. Cuando alguien cambia de nombre, el anterior queda como alias de su identificación, así que lo que aún guarda el nombre viejo sigue apuntando a la misma persona y muestra el nombre nuevo. Esto aplica a:
  - la cobertura del inspector;
  - la disponibilidad, los bloqueos y las visitas en la Agenda;
  - la tarifa propia que la agencia paga al inspector;
  - las reglas de completado con inspector independiente (DEC-207);
  - las facultades y los responsables (la búsqueda de la persona acepta nombre, identificación o nombre anterior);
  - «Mis honorarios» y el filtro de proveedor de Liquidaciones.
- **Fichas sin identificación:** llevan la etiqueta «Sin identificación» en Usuarios y Agencias. Para guardar cualquier cambio hay que completarlas primero; mientras tanto siguen funcionando con su nombre. El Inicio del Administrador muestra «N fichas sin identificación» con «Completar», que abre Usuarios filtrado.
- **Con la conexión:**
  - usuarios[] e inspectores[] traen tipoIdentificacion e identificacion; agencias[] traen ruc, razonSocial y nombreComercial;
  - crearUsuario y editarUsuario llevan { tipoIdentificacion, identificacion } y agenciaRuc junto a la agencia;
  - acción nueva guardarAgencia { ruc, razonSocial, nombreComercial, estado } → { ok, mensaje }, desde «Editar» de la agencia;
  - agendarVisita y ofertarVisita llevan inspectorId e inspectoresId además del nombre.
- `sirius-conexion.js` sigue con su línea mínima (70 bytes).

**Verificado**
- Abrí las 5 escenas nuevas (14 variantes) y 11 que ya existían (`usuarios`, `usuarioinvitar`, `agencias`, `agenciatarifas`, `cxusuarios`, `coordfases`, `cxcoordfases`, `agendasemana`, `cxagenda`, `liquidaciones`, `mishonorarios`) a 1280 × 720 y 1920 × 1080, sin errores en la consola.
- Comparé con la versión anterior el texto de 27 escenas.
  - Dieron exactamente el mismo texto 15: Coordinar visita (`coordfases`, `cxcoordfases`, `coordfechahora`, `coordoferta`), Agenda (`agendasemana`, `agendadia`, `agendamover`, `cxagenda`), Liquidaciones (`liquidaciones`, `liqdetalle`, `mishonorarios`, `agenciapagos`), `inicioadm`, `complreglas` y `cuentamascara`.
  - En las 12 de Usuarios y Agencias la primera diferencia es la columna «Identificación» o el nombre comercial; no revisé el resto del texto de esas pantallas.
- `maestrosusuarios`:
  - 1709991268 da «La cédula no es válida (dígito verificador).»;
  - con 1709991267 (`?fid=valida`) se invita a Camila Reyes y aparece con su cédula;
  - con la de Marco Tapia (`?fid=repetida`) dice «Esa identificación ya está registrada (Marco Tapia)».
- `maestrosagencias`: «El RUC tiene 13 dígitos (escribiste 12).» y, con `?fid=sin001`, «El RUC debe terminar en 001.».
- `maestrosrenombrar`: Diana Cárdenas pasa a «Diana Cárdenas Vela».
  - Su ficha conserva la cobertura «Quito: Centro y Sur», guardada por su cédula.
  - En la Agenda (`?fvista=agenda`) salen con el nombre nuevo su jornada, su bloqueo del 20/10 y dos visitas: una guardada con el nombre anterior (20141) y otra con su identificación (20178).
  - En Eurosurvey (`?fvista=tarifa`) su tarifa dice «Diana Cárdenas Vela · Ramos Generales · USD 14,00 por hora».
- `maestrossinid`:
  - Paola Vinueza y Peritajes del Pacífico salen con «Sin identificación»;
  - el Inicio dice «2 fichas sin identificación»;
  - al editar aparece «Completa la identificación para guardar los cambios de esta ficha (DEC-214).» y, en la agencia, «Escribe el RUC.».
- `cxmaestros`:
  - crearUsuario sale con { tipoIdentificacion: 'Cédula', identificacion: '0909991259', agencia: 'Eurosurvey', agenciaRuc: '1791456320001', … };
  - con `?cxdup=1` la base responde { ok: false } y la pantalla dice «La base no guardó el cambio: La identificación 1709991275 ya está registrada (Carlos Mora). Se deshizo el cambio.»;
  - con `?fvista=agencia` guardarAgencia sale con { ruc: '1793012345001', razonSocial: 'Verifica Inspecciones Técnicas S.A.', nombreComercial: 'Verifica', estado: 'Activa' }.
- Las 27 identificaciones de prueba y los 4 RUC pasan las validaciones.

**No verificado**
- Una base real: los nombres de los campos (tipoIdentificacion, identificacion, ruc, agenciaRuc, inspectorId, inspectoresId) son los acordados, pero no los probé contra la base de la asesoría.
- No envié agendarVisita ni ofertarVisita desde Coordinar visita para ver inspectorId en pantalla: se agrega en el paso común de envío, revisado solo en el código.
- Honorarios del inspector, cuentas bancarias y la tarifa «Completado de informe» siguen buscando por nombre: después de un cambio de nombre no comprobé que se sigan encontrando.
- No probé la pantalla con un pasaporte válido de punta a punta: probé la regla y el mensaje.

**Diferencias**
- En Coordinar visita, la Agenda, Usuarios y Liquidaciones los selectores muestran el nombre actual y usan ese nombre como valor; la identificación se resuelve al guardar o al enviar. El selector de la regla de completado sí usa la identificación como valor.
- La agencia del usuario sigue guardando el identificador interno de la agencia (por ejemplo «eurosurvey»), que no depende del nombre; también se encuentra por su RUC.
- Algunas pantallas vuelven a cargar los datos del ejemplo al abrirse. Por eso los cambios de nombre y las fichas sin identificación de la sesión se guardan como cambios que se vuelven a aplicar; al cambiar de escena se olvidan.
- Con la conexión, las personas salen solo de la base: las del ejemplo no se mezclan con las de la base.
- Identificaciones de prueba (no son de personas reales, LOPDP):
  - Usuarios del ejemplo (cédulas): 0909991010 Andrea Salazar, 1709991028 Verónica Lema, 1709991036 Daniela Ruiz, 0909991044 Santiago Ortiz, 1709991051 Ricardo Almeida, 1709991069 Rodrigo Salvador, 0909991077 Mónica Ríos, 1709991085 Marco Tapia, 1709991093 Cristian Vaca, 0909991101 Paola Vinueza, 1709991119 Luis Andrade, 1709991127 Diana Cárdenas, 0909991135 Mauricio Endara, 1709991143 Sofía Arteaga, 1709991150 Jorge Pazmiño, 0909991168 Carla Ponce, 1709991176 Patricia Andrade, 1709991184 Gabriela Torres y 0909991192 Pedro Lasso.
  - Pasaporte: PA4815162 de Felipe Andrade.
  - Base simulada: 1709991218 David Mena, 0909991226 Gabriela Toapanta, 1709991234 Carolina Vega, 1709991242 Diego Salinas, 1709991275 Carlos Mora (inspector sin usuario) y 0909991259 Valeria Cevallos.
  - Escena `maestrosusuarios`: 1709991267 Camila Reyes.
  - RUC: 1791456320001 Eurosurvey S.A., 1792788441001 Inspecciones Andinas Cía. Ltda., 0992671543001 Peritajes del Pacífico S.A. y 1793012345001 Verifica.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `maestrosusuarios` | Columna «Identificación»; cédula inválida, válida (`?fid=valida`) y repetida (`?fid=repetida`) |
| `maestrosagencias` | Agencias con RUC; RUC de 12 dígitos o, con `?fid=sin001`, que no termina en 001 |
| `maestrosrenombrar` | Diana Cárdenas → «Diana Cárdenas Vela»: cobertura, Agenda (`?fvista=agenda`) y tarifa (`?fvista=tarifa`) con el nombre nuevo |
| `maestrossinid` | Fichas «Sin identificación»; aviso del Inicio (`?fvista=inicio`); completar al editar (`?fvista=editar`, `?fvista=agencia`) |
| `cxmaestros` | Conexión simulada: crearUsuario con identificación, { ok: false } por cédula repetida (`?cxdup=1`) y guardarAgencia (`?fvista=agencia`) |

También abrí `usuarios`, `usuarioinvitar`, `agencias`, `agenciatarifas`, `cxusuarios`, `coordfases`, `cxcoordfases`, `agendasemana`, `cxagenda`, `liquidaciones` y `mishonorarios`.

**Tiempo de la etapa: inicio 15/11/2026 22:13 · fin 15/11/2026 22:49 · 36 min**

---

## 18/10/2026 · 20:30 — Etapa R-0e

El módulo Calificación del menú lateral lista cada informe de vehículo por calificar —«50012 · PR121A»— aunque el caso siga «En coordinación», la pestaña «En calificación» de la bandeja cuenta ese caso y el resumen del inspector de PR121A ya dice «Presencial · Mauricio Endara». Quedó publicado en la **Versión 255**; la Versión 256 solo completa en el registro la hora de fin.

**Qué cambió**
- **Módulo Calificación:** con la conexión y varios vehículos, cada fila es el informe de un vehículo, con la misma regla de la cola de R-0d (completo y sin veredicto, fuera de facultad o enviado a calificación) y sin mirar el estado del caso. La fila trae el caso, «50012 · PR121A» (con marca, modelo y año debajo), «Llegó por», «Nivel» (1 en Por calificar; 2 en suscripción) y «Antigüedad» (desde que el informe quedó completo). Los indicadores, la frase de la lista y los conteos dicen «informe de vehículo», no «caso». «Calificar» abre la pestaña Calificación del caso con ese vehículo elegido.
- **Quién lo ve:** mientras el caso sigue en otra fase, el responsable de la fila es «Ejecutivos de inspecciones» (cola compartida): el Ejecutivo la ve en «Mis riesgos» y el Administrador, en «Todos». Si el caso ya está en «Pendiente calificación», manda el responsable del caso, como antes.
- **Bandeja, pestaña «En calificación»:** el contador y la lista incluyen los casos con al menos un vehículo por calificar, estén en la fase que estén. La fila dice «En coordinación» con la nota «1 por calificar».
- **Resumen del informe del inspector:** con varios vehículos, modalidad e inspector salen de `riesgos[].visita` y de la plantilla del informe de ese vehículo; la conclusión y los hallazgos, de su informe («Sin daños registrados» si no hay daños). Con un solo vehículo queda igual.
- **Sin cambios** en el contrato con la conexión (no hay acciones nuevas) ni en `sirius-conexion.js`, que sigue con su línea mínima.

**Verificado**
- Abrí `cxr0emodulo` (como Ejecutivo y con `?frol=admin`), `cxr0ebandeja`, `cxr0eresumen`, `cxr0dcalificar`, `cxr0dadmin` y 9 escenas del módulo Calificación que ya existían (`calcola`, `calcolatodos`, `calsusc`, `calctl`, `calhonor`, `calhist`, `calreasignar`, `modcal`, `modhist`) a 1280 × 720 y 1920 × 1080: sin errores en la consola.
- Comparé con la versión anterior el texto de 27 escenas: `calcola`, `calcolatodos`, `calsusc`, `calctl`, `calctlobs`, `calhonor`, `calhist`, `calreasignar`, `calcolaacciones`, `modcal`, `modhist`, `cal20196`, `hist20196`, `bandejaexp`, `bandejaaseg`, `g1cal`, `calveh`, `calvehapply`, `calrgbandeja`, `cxr0dcalidad`, `calcxcalif`, `cxlimpio`, `calpdfcx`, `cxestadoparcial`, `cxcabecera`, `cxr0` y `cxriesgosestados`. Dieron exactamente el mismo texto: los casos de un solo vehículo aparecen en el módulo y en la bandeja igual que antes. Solo cambian `cxr0dcalificar` («1 informe de vehículo» en vez de «1 caso», más Nivel y Antigüedad) y `cxr0dadmin` (conclusión y hallazgos de PR121A).
- `cxr0emodulo`: Daniela Ruiz (Ejecutivo de inspecciones, «Mis riesgos») y Andrea Salazar (Administrador, «Todos») ven «50012 · PR121A», nivel 1, «Fuera de facultad», con el caso «En coordinación». «Calificar» abre el caso 50012 en Calificación con PR121A elegido.
- `cxr0ebandeja`: Todos 7, En coordinación 1 y En calificación 1; la fila de 50012 dice «En coordinación» y «1 por calificar».
- `cxr0eresumen`: con la visita llegando solo en `riesgos[].visita`, la versión anterior decía «Inspector: Autoinspección» y conclusión «—» (lo reproduje). Ahora dice «Presencial · Mauricio Endara», conclusión «Moto en buen estado; el manubrio y las luces funcionan.» y hallazgos «Sin daños registrados».
- Probé la fórmula de «Antigüedad» con fechas anteriores al reloj: «3 h», «1 día 5 h», «2 días»; sin fecha, «—».
- `sirius-conexion.js` quedó en 70 bytes.

**No verificado**
- Una base real: «Nivel» y «Antigüedad» leen `completadoEn` o `enviadoEn` del informe; no pude confirmar que la base real use esos nombres.
- En pantalla «Antigüedad» dice «Menos de 1 h»: las fechas del informe simulado (17/11) son posteriores al reloj del prototipo (18/10).
- «Nivel 2» con la conexión: no hay una escena con un vehículo en suscripción, así que no lo vi en pantalla.
- No abrí el módulo como Suscriptor con la conexión ni reasigné desde el Administrador una fila de la cola compartida.

**Diferencias**
- El responsable de la fila es «Ejecutivos de inspecciones» (cola compartida) mientras el caso no esté en calificación; el caso trae como responsable a Andrea Salazar y, sin esto, el Ejecutivo no vería nada en «Mis riesgos». Es una decisión mía.
- La nota de la bandeja dice solo «1 por calificar»; «2 de 3 agendados» pasa al texto del título de la fila.
- «Nivel» y «Antigüedad» solo salen cuando la lista trae informes con la conexión; sin ella la tabla es la misma de antes.
- `cxr0ebandeja` se abre como Administrador: la bandeja de Daniela Ruiz no trae el caso 50012 (su responsable es Andrea Salazar) y no lo cambié.
- `cxr0eresumen` quita `riesgos` y `modalidad` de la visita del caso para que se vea la situación que daba «Autoinspección».

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxr0emodulo` | Calificación como Ejecutivo de inspecciones (`?frol=admin`: como Administrador): «50012 · PR121A», nivel 1, antigüedad, con el caso «En coordinación» |
| `cxr0ebandeja` | Bandeja, pestaña «En calificación»: cuenta 50012; la fila dice «En coordinación · 1 por calificar» |
| `cxr0eresumen` | Calificación de PR121A: el resumen del inspector dice «Presencial · Mauricio Endara» |

También abrí `cxr0dcalificar`, `cxr0dadmin`, `calcola`, `calcolatodos`, `calsusc`, `calctl`, `calhonor`, `calhist`, `calreasignar`, `modcal` y `modhist`.

**Tiempo de la etapa: inicio 15/11/2026 21:39 · fin 15/11/2026 21:54 · 15 min**

---

## 18/10/2026 · 20:30 — Etapa P-6f

Con la conexión, «Nueva solicitud» ya crea el caso en la base (crearCaso), incluidas flotas y Ramos Generales con varias ubicaciones, y el caso nuevo se abre «En coordinación». Quedó publicado en la **Versión 253**; la Versión 254 solo completa en el registro la hora de fin.

**Qué cambió**
- **crearCaso:** al registrar con la conexión se envía `{ grupoRamo, ramo, sucursal, asegurado { tipoIdentificacion, identificacion, nombre, contacto { nombre, celular, correo } }, solicitud { provincia, ciudad, direccion, referencia, punto }, riesgos [ { composicion, placa, marca, modelo, anio, tipo, suma, descripcion, direccion, ciudad } ], modalidadSugerida, observaciones, origen: 'Back-office' }`. Con `{ ok: true, caso }` se relee la conexión y se abre el caso. Con `{ ok: false }` el formulario se queda en «Revisión y envío» con lo escrito y muestra «No se creó el caso» con el mensaje de la base.
- **Lugar e INEC:** Vehículos y Equipo y maquinaria tienen «Lugar de la inspección» con el mismo componente que Coordinar visita (provincia y ciudad del INEC, dirección buscada con SiriusUbicacion, referencia y punto). En Ramos Generales no móviles, cada ubicación lleva su tipo de bien, su suma y su lugar, con «Agregar otra ubicación».
- **Flotas y tipo:** la flota sigue con un vehículo por fila; cada vehículo tiene «Tipo de vehículo», que puede quedar «Sin tipo» (va `tipo: null`).
- **Validaciones con la conexión,** con su mensaje junto al campo: identificación (cédula de 10 dígitos, RUC de 13), celular de 10 dígitos que empiece con 0, correo obligatorio y válido, placa ecuatoriana, año entre 1950 y el próximo, suma mayor que 0, al menos un riesgo, placa repetida en la solicitud y lugar con ciudad y dirección. La base simulada además rechaza una placa que ya está en un caso abierto.
- **«Requiere inspección»:** en Catálogos › Ramos la columna «Inspeccionable» se llama «Requiere inspección». Al guardar, la marca llega a Nueva solicitud en la sesión. Agregué al catálogo, con la marca apagada, Accidentes personales, Riesgos especiales, Fiel cumplimiento, Buen uso de anticipo y Garantía aduanera; Transporte, Responsabilidad civil y Fidelidad ya estaban apagados.
- **Base simulada:** crea el caso con el número siguiente (50013), «Registrado» y enseguida «En coordinación» con el coordinador de su sucursal, con riesgos, contacto, ciudad, dirección y eventos en el Historial.
- **Sin la conexión** Nueva solicitud queda igual. `sirius-conexion.js` sigue mínimo.

**Verificado**
- Abrí las 5 escenas nuevas (más `cxnuevaramos?fvista=catalogo`) y las 13 de Nueva solicitud que ya existían (`ns1g`, `ns2`, `ns3v`, `nsbulk`, `ns3g`, `ns4`, `nsbpm`, `nsmarca`, `nsvacio`, `cpersnueva`, `emsolicitud`, `embulk`, `emotro`) a 1280 × 720 y 1920 × 1080: sin errores en la consola.
- Sin la conexión, esas 13 escenas muestran exactamente el mismo texto que la versión anterior.
- `cxnuevaveh`: «Registrar solicitud» envía crearCaso con PCK2210 (`tipo: 'SUV o Jeep'`) e IB456K (`tipo: null`), ambos con ciudad 1701 y la dirección del lugar, y se abre el caso 50013 «En coordinación» con Andrea Salazar.
- `cxnuevaflota`: junto a la placa sale «Placa repetida: ya está en el vehículo 2 de este caso.». Con GSC4410 se guarda y crearCaso lleva los 5 vehículos.
- `cxnuevarg`: crearCaso lleva 2 riesgos «Ubicación», Bodega en 1701 (Av. Mariscal Sucre S12-45 y Ajaví) y Local comercial en 0901 (Av. Francisco de Orellana, Kennedy Norte), y se abre el caso.
- `cxnuevaerror`: la base responde «PRB1212 ya está en el caso 50012 (En coordinación)». El formulario sigue en «Revisión y envío» con lo escrito y el mensaje.
- `cxnuevaramos`: la lista ofrece Incendio, Robo, Dinero y valores, Equipo electrónico, Rotura de maquinaria, Todo riesgo construcción y Equipo y maquinaria. Catálogos › Ramos muestra «Requiere inspección», y al apagarla en Robo (con motivo) Robo deja de salir en la lista de Nueva solicitud.
- Validaciones con la conexión: celular 1987766554 da «Ingresa un celular de 10 dígitos que empiece con 0.», correo vacío «Ingresa el correo: se usa para coordinar.», cédula 12345 «La cédula tiene 10 dígitos.», RUC de 11 «El RUC tiene 13 dígitos.», años 1949 y 2028 «Ingresa un año entre 1950 y 2027.» y placa PB4-21 el mensaje del formato.
- Copia aparte con una conexión temporal (no simulada): llené el formulario a mano y crearCaso salió con la forma exacta de arriba (`provincia: '17'`, `ciudad: '1701'`, `punto: [-0.1765, -78.4845]`, `anio: 2021`, `tipo: 'SUV o Jeep'`, `origen: 'Back-office'`).

**No verificado**
- Una base real: el número del caso, el estado y el responsable los pone la base. La regla de la sucursal solo la emula la base simulada.
- El mensaje «Ingresa un valor del casco mayor que 0» con un valor 0 (lo cubre el código; no lo escribí en la prueba).
- Equipo y maquinaria con crearCaso: el payload usa los equipos y el lugar, pero no abrí una escena conectada de equipos.
- Cómo responde la base real cuando `ramo` es el primero de varios ramos.

**Diferencias**
- `ramo` lleva un solo ramo; si la solicitud de Ramos Generales tiene varios, los demás van en `observaciones` («Ramos de la solicitud: …») porque el contrato no tiene lista de ramos.
- `provincia` va como código INEC de dos dígitos («17»), como la ciudad.
- Agregué «Modalidad sugerida» (Presencial, Virtual guiada, Autoinspección; por defecto Presencial) y «Observaciones», que el formulario no tenía.
- El catálogo de marcas no tiene marcas de motos: la moto de `cxnuevaveh` (Suzuki GN125) viene en la escena; a mano solo se puede elegir una marca del catálogo.
- Con la conexión, la ubicación del paso 2 (provincia, cantón y dirección del solicitante) se sigue pidiendo como antes, pero el lugar que viaja es el del paso 3.
- Los ramos nuevos del catálogo también aparecen en las listas que ya mostraban todos los ramos (responsables del completado y monitor).

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxnuevaveh` | Vehículos: auto con tipo y moto «Sin tipo»; crearCaso y el caso 50013 abierto |
| `cxnuevaflota` | Flota de 5 con placa repetida: aviso junto al campo; corregida, se crea |
| `cxnuevarg` | Incendio con 2 ubicaciones (Quito y Guayaquil), cada una con su dirección |
| `cxnuevaramos` | Lista de ramos sin los que no se inspeccionan; con `?fvista=catalogo`, Catálogos con «Requiere inspección» |
| `cxnuevaerror` | La base responde { ok: false } («PRB1212 ya está en el caso 50012…»): se conserva lo escrito |

También abrí `ns1g`, `ns2`, `ns3v`, `nsbulk`, `ns3g`, `ns4`, `nsbpm`, `nsmarca`, `nsvacio`, `cpersnueva`, `emsolicitud`, `embulk` y `emotro`.

**Tiempo de la etapa: inicio 15/11/2026 21:03 · fin 15/11/2026 21:36 · 33 min**

---

## 18/10/2026 · 20:30 — Etapa R-0d

Con la conexión, los informes por vehículo aparecen en las bandejas aunque el caso siga «En coordinación», y el Administrador puede completar, devolver y calificar todo avisando en qué rol actúa. Quedó publicado en la **Versión 251**; la Versión 252 solo completa en el registro la hora de fin.

**Qué cambió**
- **«Informes por completar» por informe:** con la conexión y un caso de varios vehículos, la bandeja deja de mirar el estado del caso y lista un informe por fila según el estado de ese informe: «Datos de campo» o «Por completar» en «Por completar», «Devuelto» en «Devueltos al inspector» y «Completo» reciente en «Completados». La fila dice «50012 · PR121A» y «Completar» abre el informe con ese vehículo elegido. Quién completa se decide con la visita de cada vehículo (Control de calidad de Eurosurvey si el inspector de esa visita es de Eurosurvey, como Mauricio Endara). Con un solo vehículo, o sin la conexión, la bandeja no cambia.
- **Calificación por informe:** la cola del Ejecutivo de inspecciones, el Suscriptor y el Administrador decide «por calificar» con el informe de cada vehículo (completo y sin veredicto), muestra la placa de cada uno y en «Llegó por» dice «Fuera de facultad» o «Enviado a calificación». «Calificar» abre ese vehículo.
- **Administrador con acceso total:** puede completar, devolver y calificar cualquier informe y nivel. Antes de confirmar, el formulario de Calificación y la barra de completar dicen «Actúas como Administrador en lugar de <rol>» (Ejecutivo de inspecciones, Suscriptor, Control de calidad, Ejecutivo de inspecciones o Inspector, según quién corresponda). El Historial termina el evento con «(como Administrador)». Su calificación cuenta en el nivel que corresponde al caso.
- **Con la conexión:** `completarInforme`, `devolverCoordinacion` y `calificar` llevan el mismo `riesgo` («50012-V2») que con el rol normal y agregan `comoAdmin: true` cuando actúa el Administrador. La base simulada usa el usuario de la escena para anotar quién actuó. `sirius-conexion.js` sigue mínimo.
- **Escenas nuevas:** `cxr0dcalidad`, `cxr0dadmin` y `cxr0dcalificar`.

**Verificado**
- Abrí `cxr0dcalidad`, `cxr0dadmin`, `cxr0dcalificar`, `cxr0b`, `cxr0bcompletar`, `infcompletar` y `calcola` a 1280 × 720 y 1920 × 1080: sin errores en la consola.
- `cxr0dcalidad` (Patricia Andrade): «Por completar (2)» con «50012 · PRB1212» y «50012 · PR121A» aunque el caso dice «En coordinación · 2 de 3 agendados». «Completar» de PR121A abre el caso 50012 en Informe con `infSel` = 50012-V2 y sin aviso de Administrador. Tras devolver PR121A (`devolverCoordinacion` con `riesgo: '50012-V2'`), la fila pasa a «Devueltos al inspector (1)» y en «Por completar» queda solo PRB1212.
- `cxr0dcalificar` (Daniela Ruiz): «Por calificar (1)» con «50012 · PR121A» y «Llegó por: Fuera de facultad»; PRB1212 no aparece porque su informe sigue en «Datos de campo». «Calificar» abre Calificación con PR121A elegido.
- `cxr0dadmin`: el formulario de PR121A dice «Actúas como Administrador en lugar de Ejecutivo de inspecciones» antes de «Grabar calificación». Al grabar se envía `calificar` con `riesgo: '50012-V2'` y `comoAdmin: true`, y el Historial anota «Calificación · PR121A: Asegurable · Todo riesgo · Calificado por Andrea Salazar · … (como Administrador)».
- Completar y devolver como Administrador en `cxr0bcompletar`: la barra dice «Actúas como Administrador en lugar de Control de calidad»; `completarInforme` y `devolverCoordinacion` salen con `riesgo: '50012-V2'` y `comoAdmin: true`, y el Historial termina en «(como Administrador)».
- Un solo vehículo igual que antes: comparé el texto de pantalla contra la versión anterior en `infcompletar`, `infcompletarcx`, `autotercero`, `calcola`, `calcolatodos`, `calsusc`, `calhist`, `calctl` y `cxr0b`: idénticos. En `cxr0bcompletar` y `cxr0cauto` solo se agrega el aviso del Administrador.

**No verificado**
- Una base real: `fueraFacultad`, `motivoEnvio`, `completadoEn` y `comoAdmin` son los nombres que supuse para esos datos del informe y de las acciones.
- El nivel 2 (Suscriptor) como Administrador con la conexión: el aviso dice «en lugar de Suscriptor» pero no lo probé con un caso en suscripción de varios vehículos.
- Un caso de varios vehículos con un inspector independiente o interno en «Informes por completar» (probé solo Control de calidad de Eurosurvey y el Administrador).
- Ramos Generales y Equipo y maquinaria: no se tocaron sus bandejas.

**Diferencias**
- El Historial dice «Calificación · PR121A: Asegurable · Todo riesgo · Calificado por … (como Administrador)» y no «Calificó el riesgo … (como Administrador)»: mantuve el texto que ya usaba la calificación y le agregué el final.
- «Devuelto» entra en la pestaña «Devueltos al inspector» y no en «Por completar», como ya separaba la bandeja; un informe devuelto a coordinación también queda ahí.
- En las filas por vehículo la columna «Avance» muestra «—»: el avance se calcula al abrir el informe.
- Con la conexión, el Administrador (Andrea Salazar) ya no aparece como «Verónica Lema» al calificar: se usa el nombre del usuario real.
- El aviso del Administrador sale también en los informes de un solo vehículo cuando él completa (por el código; no abrí una escena así).

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxr0dcalidad` | Patricia Andrade (Control de calidad · Eurosurvey): «Informes por completar» con «50012 · PRB1212» y «50012 · PR121A», caso «En coordinación»; «Completar» abre el vehículo |
| `cxr0dadmin` | Administrador califica PR121A: «Actúas como Administrador en lugar de Ejecutivo de inspecciones» y Historial «(como Administrador)» |
| `cxr0dcalificar` | Ejecutivo de inspecciones: Calificación lista «50012 · PR121A» (informe completo, fuera de facultad); PRB1212 sigue por completar |

También abrí `cxr0b`, `cxr0bcompletar`, `infcompletar` y `calcola`.

**Tiempo de la etapa: inicio 15/11/2026 20:20 · fin 15/11/2026 20:48 · 28 min**

---

## 18/10/2026 · 20:30 — Etapa R-0c

Los campos automáticos del informe de cada vehículo ya salen de su propia visita, y un automático que llega vacío se puede registrar a mano. Quedó publicado en la **Versión 249**; la Versión 250 solo completa en el registro la hora de fin.

**Qué cambió**
- **Automáticos por vehículo:** con varios vehículos y la conexión, el informe de cada uno toma de su visita (`riesgos[].visita` y la de `visitasBase` con ese número) la fecha y hora de inspección (llegada o, si no hay, la cita), la modalidad realizada y el inspector que ejecutó. La persona que atiende y la relación con el asegurado salen de lo que envió la app para ese vehículo o, si no viene, de `quienRecibe` / `relacionQuienRecibe` de la visita. Con un solo vehículo todo queda como antes. La causa era doble: la fecha salía de la primera foto de todo el caso y una línea comentada dejaba sin efecto la modalidad, el inspector y la persona que atiende de la visita.
- **«Inspector que ejecutó»:** con la conexión, sus opciones son los inspectores activos de `SIRIUS_CONEXION.inspectores` (sin la agencia como registro propio). El valor que trae el informe se muestra siempre, aunque no esté en la lista, y ya no sale «Por confirmar».
- **Automático vacío (Vehículos y Ramos Generales):** un automático bloqueado que llega sin valor se habilita, con «Sin dato del sistema: regístralo» y sigue obligatorio. Registrado, queda «Editado» (en la conexión, origen «Back-office»), se anota en el historial («Informe editado · 50012-V2 · Persona que atiende: sin dato del sistema → «Jorge Salazar»…») al guardar o completar, y si después llega el dato del sistema se conserva lo registrado y el del sistema sale como «Sistema: …». «Fecha y hora de carga» sigue calculándose al completar.
- **Neumáticos con la conexión:** `respuestas.veh_neumaticos` acepta filas `{ pos, marca, medida, labrado }` y llena la grilla (lo necesitaba el informe de prueba para poder completarse).
- **Escenas nuevas:** `cxr0cauto` y `cxr0cvacio`, con rol Administrador. `sirius-conexion.js` sigue mínimo.

**Verificado**
- Abrí `cxr0cauto`, `cxr0cvacio`, `cxr0b`, `cxr0bcompletar`, `infcompletarcx` y `autonoaplica` (y `cxr0b` en Calificación) a 1280 × 720 y 1920 × 1080: sin errores en la consola.
- `cxr0cauto`: PR121A muestra «Mauricio Endara», «17/11/2026 · 10:00» (su visita; antes salía la primera foto del caso, 09:10 de PRB1212) y «Jorge Salazar» (persona que atiende de su visita); los tres campos siguen bloqueados.
- `cxr0cvacio`: «Inspector que ejecutó» y «Persona que atiende» quedan habilitados con «Sin dato del sistema: regístralo» y «Obligatorio pendiente»; la lista de inspectores trae a Mauricio Endara, Diana Cárdenas, Cristian Vaca, Luis Andrade, Marco Tapia y Paola Vinueza. Al registrarlos, el informe pasa a «sin pendientes», quedan «Editado» y se anotan en el historial. Al elegir «Confirmar el criterio del inspector» y pulsar «Completar y enviar» se envía `completarInforme` con `riesgo: '50012-V2'` y esos dos campos con origen «Back-office»; `guardarInforme` también los lleva.
- Valor registrado más dato del sistema posterior (probado dándole «Cristian Vaca» a un campo cuyo sistema dice «Mauricio Endara»): sigue editable, muestra «Editado», «Sistema: Mauricio Endara» y «Registrado por…».
- Ramos Generales (caso 20195, un dato de la solicitud con valor vacío): se habilita con el aviso; al registrar «Av. Amazonas N36-152» el chip dice «Editado», el origen guardado es Manual con `registro` y el historial anota «Informe editado · Dirección: sin dato del sistema → …».
- Un solo vehículo igual que antes: comparé campo por campo (habilitado o no, valor) contra la versión anterior en `infcompletarcx`, `autonoaplica`, `informecompleto`, `infcompletar`, `infcxfotos`, `autoporseccion`, `autodecision` y `cxlimpio`: idénticos, con los automáticos bloqueados.

**No verificado**
- Una base real: `quienRecibe` y `relacionQuienRecibe` son los nombres que supuse para el contacto en sitio de la visita (también acepta `contactoSitio { nombre, relacion }`).
- Que la app envíe `veh_persona_atiende` y `veh_relacion_asegurado` con otro origen que «Campo».
- El informe de Ramos Generales con un automático vacío real: lo probé quitando el valor de un campo que llega de la solicitud, no hay una escena con ese caso.
- Las demás plantillas (Equipos y maquinaria) con la regla del automático vacío.

**Diferencias**
- Con varios vehículos, la fecha y hora de inspección ya no es la de la primera foto sino la de la visita del vehículo (llegada o cita). Con un solo vehículo sigue siendo la de la primera foto.
- Con varios vehículos, lo que la visita dice de modalidad, inspector y fecha manda sobre lo que traiga el informe; la persona que atiende y la relación mandan las del informe.
- «Fecha y hora de carga» queda fuera de la regla del automático vacío, porque el sistema la fija al completar.
- Un automático registrado sigue editable (para poder corregirlo); si llega el dato del sistema, no lo reemplaza.
- Agregué la lectura de las filas de neumáticos de la conexión, que no se pedía.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxr0cauto` | 50012 con dos informes: PR121A (visita de Mauricio Endara, atiende Jorge Salazar) y PRB1212 (visita de Diana Cárdenas); automáticos bloqueados |
| `cxr0cvacio` | PR121A sin persona que atiende ni inspector: se habilitan con «Sin dato del sistema: regístralo», quedan «Editado» y el informe se puede completar |

También abrí `cxr0b`, `cxr0bcompletar`, `infcompletarcx` y `autonoaplica`.

**Tiempo de la etapa: inicio 15/11/2026 19:23 · fin 15/11/2026 19:48 · 25 min**

---

## 18/10/2026 · 20:30 — Etapa R-0b

Con la conexión, el informe, completar y calificar ya son por vehículo: cada vehículo tiene su propio informe, el selector muestra solo los que lo tienen y las acciones de la base llevan el vehículo. Quedó publicado en la **Versión 247**; la Versión 248 solo completa en el registro la hora de fin.

**Qué cambió**
- **Selector por vehículo (Informe y Calificación):** con la conexión, `informes[caso]` trae un informe por vehículo (`riesgoId` «50012-V1», `riesgo`, `estado`, `respuestas`, `plantilla`, `criterio`, `decision`). Solo los vehículos con informe están en el selector; los demás salen aparte en «Sin informe todavía (Por coordinar / Agendado / En curso)» según su estado.
- **Completar, devolver y calificar actúan sobre el vehículo elegido:** la cabecera, la plantilla (PR121A con «Motocicletas»), el inspector, la visita, el criterio del inspector y las respuestas son los de ese vehículo. «Motivo del inspector» sale del comentario de su criterio.
- **Contadores:** «N de M con informe» (Riesgos) y «N de M vehículos calificados» salen de los informes. Si el caso no trae informes (escenas `cxr0` y `cxriesgosestados`), se cuentan por el estado del riesgo, como antes.
- **Evidencias por vehículo:** el informe y la calificación muestran solo las fotos del vehículo elegido; las que no traen riesgo se ven en todos y se rotulan «Sin vehículo». Con un solo riesgo todo queda igual.
- **Acciones con `riesgo`:** `completarInforme { caso, riesgo, respuestas, decision, criterio, motivo }`, `guardarInforme { caso, riesgo, respuestas }`, `devolverCoordinacion { caso, riesgo, motivo }` y `calificar { caso, riesgo, datos, estadoDestino }` con el id del vehículo («50012-V2»). Con `{ ok: false }` vuelve todo atrás, incluido el estado del informe de ese vehículo.
- **Escenas nuevas:** `cxr0b` (50012 con PRB1212 y PR121A con informe y PRB1213 «Por coordinar») y `cxr0bcompletar` (abre en PR121A «Por completar»; `?cxok=0` hace que la base rechace). Las dos con rol Administrador. `sirius-conexion.js` sigue mínimo.

**Verificado**
- Abrí `cxr0b` (Informe, Calificación, Evidencias y Riesgos), `cxr0bcompletar` (Informe y Calificación), `r0informes`, `r0evidencias` y las escenas existentes de completar y calificar (`infcompletarcx`, `infcxfotos`, `calcxcalif`, `calveh`, `calvehapply`, `cal20196`, `informecompleto`, `infcompletar`, `calpdfcx`, `cxr0`, `cxriesgosestados`) a 1280 × 720 y 1920 × 1080: sin errores en la consola.
- `cxr0b`: el selector muestra PRB1212 y PR121A, PRB1213 aparece en «Sin informe todavía (Por coordinar)», «0 de 3 vehículos calificados» y las evidencias del vehículo elegido son 4 fotos y 1 documento «Sin vehículo»; en Evidencias, chips PRB1212 (5) y PR121A (5).
- Forma exacta de cada acción, con la conexión simulada y un registrador de llamadas puesto desde la prueba (el proyecto no se tocó): `guardarInforme { caso: '50012', riesgo: '50012-V2', respuestas }`, `devolverCoordinacion { caso: '50012', riesgo: '50012-V2', motivo }`, `completarInforme { caso: '50012', riesgo: '50012-V2', respuestas, decision: 'determinar', criterio: 'Asegurable', motivo: '' }` y `calificar { caso: '50012', riesgo: '50012-V2', datos: { veredicto: 'si', cobertura: 'Todo riesgo', motivo: '', observacion, mode: 'veh' }, estadoDestino: 'Inspeccionado' }`. Solo cambió PR121A; PRB1212 y PRB1213 quedaron igual.
- Con `?cxok=0`, completar PR121A queda revertido (sin estado propio del informe) y sale «La base rechazó la acción (prueba)».
- Tras calificar PR121A, el contador pasó a «1 de 3 vehículos calificados · 1 asegurable» y su tarjeta dice «Asegurable · Todo riesgo».

**No verificado**
- Una base real: las respuestas de la base de prueba son de la simulación. Tampoco el plazo (SLA) por vehículo ni casos con más de tres vehículos.
- Completar con todos los campos obligatorios llenos desde la interfaz: para probar el envío puse el avance en cero desde la prueba; el formulario con 13 pendientes sigue bloqueando «Completar y enviar», como corresponde.
- El informe del portal del inspector (`completarInforme` y `guardarInforme` de la app) no cambió.

**Diferencias**
- `completarInforme`, `guardarInforme` y `devolverCoordinacion` **no llevaban `riesgo`**. Propuesta (ya aplicada): agregar `riesgo` con el id del vehículo («50012-V2») solo con la conexión y varios vehículos; con un solo riesgo se omite y todo queda como estaba.
- `calificar` ya llevaba `riesgo`, pero con la placa; con varios vehículos ahora lleva el id («50012-V2») y con un solo riesgo sigue llevando la placa.
- Un informe sin `riesgoId` reconocible no se muestra en un caso con varios vehículos.
- El nombre de plantilla «Motocicletas» se asocia al formulario «Motos v1».
- Se supone que quien completa y califica en las escenas nuevas es el Administrador; con otro rol el formulario queda en solo lectura como antes.
- Tras grabar una calificación, la pantalla vuelve al primer vehículo por calificar.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxr0b` | 50012 con la conexión simulada: PRB1212 y PR121A con informe, PRB1213 «Por coordinar»; pestañas Informe, Calificación, Evidencias y Riesgos |
| `cxr0bcompletar` | Abre en PR121A «Por completar»; completar envía `completarInforme` con riesgo «50012-V2»; `?cxok=0` hace que la base rechace |

También abrí `r0informes`, `r0evidencias` y las escenas de completar y calificar ya existentes.

**Tiempo de la etapa: inicio 15/11/2026 17:31 · fin 15/11/2026 17:59 · 28 min**

---

## 18/10/2026 · 20:30 — Etapa R-0

El back-office ya muestra lo que pasa cuando una visita lleva varios vehículos: el tipo y la plantilla de cada uno, los que no se pudieron inspeccionar y por qué, las fotos por vehículo y el informe y la calificación por vehículo. Quedó publicado en la **Versión 245**; la Versión 246 solo completa en el registro la hora de fin.

**Qué cambió**
- **Tipo y plantilla por riesgo (Riesgos):** columna «Tipo y plantilla» con «Moto · plantilla Motocicletas · confirmado en la app» y, si cambió, «antes: Sedán». Aparece solo cuando algún vehículo trae el tipo confirmado en la app.
- **Vehículo no inspeccionado:** sale de su visita y vuelve a «Por coordinar» con la nota «No inspeccionado · El vehículo no está en el sitio · Mauricio Endara · 17/11 11:40». Se ve en Riesgos, en la fila de «Vehículos por coordinar» de Coordinación y en el Historial.
- **«El vehículo no es mío» (cliente):** además queda «Revisar datos de la solicitud», con un aviso en el caso para el Coordinador de inspecciones, el Administrador, el Ejecutivo comercial y el Ejecutivo de inspecciones. Se cierra con «Datos revisados» y una nota de al menos 10 caracteres; si la base rechaza la acción, el aviso queda abierto con su mensaje.
- **Visita cerrada sin inspección:** si ningún vehículo se pudo inspeccionar, la visita queda «Cerrada sin inspección» con el motivo, no cuenta como abierta ni asignada y su tarjeta no tiene acciones; sus vehículos vuelven a «Por coordinar».
- **Evidencias por vehículo:** cada foto muestra su vehículo (placa o bien) y hay chips para filtrar por vehículo, con «Todos», combinables con los de canal. El visor agrega la fila «Vehículo».
- **Informe y calificación por vehículo:** el selector de vehículo queda arriba del informe y de la calificación, y Riesgos cuenta «N de M con informe». En `r0informes`, el vehículo sin informe aparece «Sin informe» en el selector.
- **Catálogo «Motivos de no inspección de un vehículo»** (Catálogos › Vehículos): lista Inspector (El vehículo no está en el sitio; El cliente no lo autoriza; El vehículo está, pero no está disponible; Otro) y lista Cliente (No tengo el vehículo conmigo; El vehículo no es mío; Otro); «Otro» exige detalle.
- **Con la conexión:** `casos[].riesgos[]` con `tipoConfirmado`, `plantilla`, `tipoAnterior`, `noInspeccionado { motivo, detalle, por, hora, origen }` y `revisarDatos { motivo, hora }`; `casos[].visitasBase[]` con «Cerrada sin inspección» y `motivoCierre`; evidencias con su riesgo («50012-V1»); acción nueva `datosRevisados { caso, riesgo, nota }` → `{ ok, mensaje }`. `sirius-coordestado.js` pasa a v1.3.

**Verificado**
- Abrí las 7 escenas nuevas y `estadofasecurso`, `riesgosestados` y `cabeceracoordinar` a 1280 × 720 y 1920 × 1080 (`r0informes` en las pestañas Informe y Riesgos): sin errores en la consola. Ajusté el ancho de «Tipo y plantilla» porque en 1920 se cortaba «confirmado en la app».
- `r0tipo`: PR121A «Moto · plantilla Motocicletas · confirmado en la app» y PRB1213 «Camioneta · plantilla Camionetas y pesados livianos · confirmado en la app» con «antes: Sedán».
- `r0noinsp`, `r0nomio` y `r0sininsp`: motivo, quién y cuándo en Riesgos y Coordinación; en `r0sininsp` la visita queda «Cerrada sin inspección» sin acciones.
- «Datos revisados» en `r0nomio` y `cxr0`: sin nota muestra «Escribe una nota de al menos 10 caracteres.»; con nota cierra el aviso, muestra «Datos revisados · PRB1213» y deja el evento en el Historial; con `?cxok=0` el aviso queda abierto con «La base rechazó la acción (prueba)».
- `r0evidencias`: 12 fotos, chips por vehículo y `?fveh=` filtrado. `r0informes`: «2 de 3 con informe» y «0 de 3 vehículos calificados». Catálogos: los 7 motivos, con «Otro» en las dos listas.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** probé con la base simulada; si la real entrega los campos con otro formato, se verá según lo que reciba.
- **Informe por vehículo con la conexión:** con la conexión el informe sigue siendo el único del caso; `r0informes` es una escena de sesión (20196) que reutiliza el selector que ya existía.
- **Aviso sin conexión:** el aviso y «Datos revisados» solo se ven con la conexión (en `r0nomio` y `cxr0`).
- **Duplicados en Catálogos:** no probé qué pasa al repetir un motivo con el mismo nombre en la misma lista.
- **Reglas de visibilidad del aviso por rol:** los cuatro roles son mi definición; no probé cada uno.

**Diferencias**
- **Historial:** sus eventos salen de los `eventos` de la base; el back-office no inventa el texto.
- **Catálogo:** las apps lo leen; el back-office muestra lo que la base guarda.
- **Chips de Evidencias:** salen de los vehículos que tienen fotos.
- **Nombre del catálogo:** «Motivos de no inspección de un vehículo», para no confundirlo con el catálogo «Motivos de no inspección» de los casos que no requieren inspección, que sigue aparte.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `r0tipo` | 50012 con tipo y plantilla confirmados en la app (Moto; Camioneta, «antes: Sedán»); abre Riesgos |
| `r0noinsp` | PRB1213 no inspeccionado («El vehículo no está en el sitio»), de vuelta en «Por coordinar»; abre Coordinación |
| `r0nomio` | «El vehículo no es mío»: «Revisar datos de la solicitud», aviso y «Datos revisados» |
| `r0sininsp` | Visita «Cerrada sin inspección» con motivo y sin acciones |
| `r0evidencias` | 12 fotos con su vehículo y filtro por vehículo (`?fveh=`) |
| `r0informes` | 20196 con informe por vehículo: 2 con informe y 1 sin informe; abre Informe (`?ptab=cal` Calificación) |
| `cxr0` | Los tres casos juntos con la conexión simulada (`?cxok=0`: la base rechaza «Datos revisados») |

También abrí `estadofasecurso`, `riesgosestados` y `cabeceracoordinar` (1280 × 720 y 1920 × 1080) sin errores.

Tiempo de la etapa: inicio 15/11/2026 16:55 · fin 15/11/2026 17:13 · 18 min

---

## 18/10/2026 · 20:30 — Etapa G-2c11

La pestaña Riesgos del caso ahora muestra, para cada vehículo (y cada ramo), el mismo estado, el mismo inspector y la misma visita que la pestaña Coordinación y la bandeja. Antes mostraba «En curso» / «En coordinación», «Por asignar» y «En coordinación» aunque la visita ya estuviera realizada. Quedó publicado en la **Versión 243**; la Versión 244 solo completa en el registro la hora de fin.

**Qué cambió**
- **Una sola fuente por riesgo (`sirius-coordestado.js`, v1.2):** con la conexión, `casos[].riesgos[].estado` y `casos[].riesgos[].visita { n, estado, inicio, inspector }`; sin ella, el mismo cálculo con las visitas de la sesión. Las funciones nuevas `tono`, `inspectorDe` y `visitaTexto` dicen cómo se muestra un riesgo, y `riesgoVista(r)` del back-office las entrega a las pantallas.
- **Pestaña Riesgos (Vehículos, Equipo móvil y Ramos Generales):**
  - **Estado:** Por coordinar, Oferta enviada, Enlace enviado, Agendado, En curso, Inspeccionado, o el estado del riesgo en Informe y Calificación. En Ramos Generales la columna ya no se llama «Informe».
  - **Inspector:** el de su visita o «Por asignar».
  - **Visita asignada:** «V6 · 17/10 10:00», «V6 · realizada 17/10», «V3» (sin cita) o «Sin visita» (sin visita o con la visita cancelada).
  - Asegurabilidad, Emisión y «N de M con informe» no cambian.
- **Revisión de las demás pantallas:** la pestaña Coordinación y la cabecera ya leían la regla. La bandeja la usaba solo con el caso en Coordinación o en Inspección y, en una fase posterior, mostraba el texto de la sesión («Visita 17/10/26 · 08:00»); ahora usa la misma fuente en cualquier fase y dice «Visita V6 · realizada 17/10». Ningún otro lugar calcula el estado de un riesgo por su cuenta.
- **Escenas nuevas:** `riesgosestados` y `cxriesgosestados` (base simulada). Registro e inventario actualizados.

**Verificado**
- **Escenas nuevas** a 1280 × 720 y 1920 × 1080, en la pestaña Riesgos, en Coordinación y en la bandeja: sin errores en la consola. En `riesgosestados`, PBA4521 y GSE1098 «Inspeccionado · Diana Cárdenas · V6 · realizada 17/10» y Kia Sportage «En curso · Marco Tapia · V8 · 18/10 20:00»; en `cxriesgosestados`, PRB1212 y PR121A «Inspeccionado · Mauricio Endara · V6 · realizada 15/10» y PRB1213 «En curso · Diana Cárdenas · V8 · 16/10 13:00». Las tres pantallas dicen lo mismo en cada vehículo.
- **Escenas existentes**, en las tres pantallas y en los dos tamaños: `estadofasecurso` (2 en curso en la V1 y 1 «Por coordinar · Por asignar · Sin visita»), `estadofaseinspeccion` (el tercero «Agendado · V2 · 21/10 09:00»), `estadoparcial` y `cabeceracoordinar` (2 «Agendado» con V1 y V2 y 1 por coordinar). También con la conexión simulada: `cxestadofases`, `cxestadoparcial` y `cxcabecera` (1280 × 720).
- **Ramos Generales:** `riesgos` (20195) muestra «En calificación», el inspector y «V1 · realizada 16/10»; `riesgosexc` (con Emisión) conserva sus columnas.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** probé con la base simulada, que entrega los campos del contrato; si la real los entrega con otro formato de fecha, la visita se verá según lo que reciba.
- **Equipo móvil con varios equipos:** la columna usa el mismo código que Vehículos, pero no abrí una escena de Equipo móvil con varias visitas.
- **Riesgos cancelados o excluidos en la pestaña:** `visitaTexto` e `inspectorDe` tratan la visita cancelada como «Sin visita» y «Por asignar»; no armé una escena con un riesgo así.
- **Orden por columna** (Estado y Visita asignada) en la pestaña Riesgos: lo dejé definido, pero no lo probé con el clic.

**Diferencias**
- **Bandeja en fases posteriores:** las filas de riesgo de un caso en Informe o Calificación ahora dicen «Visita V6 · realizada 17/10» y «Inspector: …» según la visita, y no el texto de la sesión.
- **Ramos Generales:** la columna «Informe» pasa a «Estado» y muestra el estado del riesgo («En calificación», «Inspeccionado») en lugar de «Informe registrado» / «Pendiente de informe».
- **Visita sin cita** (enlace enviado): «V3» sin fecha, no «Enlace enviado».
- **Responsable en `riesgosestados`:** el caso queda «En curso» con el inspector de la visita en curso (Marco Tapia).

**Escenas**

| Escena | Qué muestra |
|---|---|
| `riesgosestados` | Nueva: 20196 con 2 vehículos inspeccionados (V6 realizada) y 1 en curso (V8); abre la pestaña Riesgos (`?ptab=coord` abre Coordinación, `?fvista=bandeja` la bandeja) |
| `cxriesgosestados` | Nueva, con la conexión simulada: 50012 con `riesgos[].estado` y `.visita` de la base |
| `estadofasecurso`, `estadofaseinspeccion`, `estadoparcial`, `cabeceracoordinar` | Revisadas: mismo estado por riesgo en las tres pantallas |
| `riesgos`, `riesgosexc` | Revisadas: Ramos Generales con «Estado» |

También abrí `cxestadofases`, `cxestadoparcial`, `cxcabecera` y `coordcancelavisitas` (sin errores).

Tiempo de la etapa: inicio 15/11/2026 15:21 · fin 15/11/2026 15:37 · 16 min

---

## 18/10/2026 · 20:30 — Etapa G-2c10

El estado de un caso con varios vehículos ahora lo manda el riesgo más atrasado (DEC-239): mientras uno siga por coordinar, el caso sigue «En coordinación», aunque otros ya estén en curso, y la tarea de coordinación no desaparece de la bandeja. Quedó publicado en la **Versión 241**; la Versión 242 solo completa en el registro la hora de fin.

**Qué cambió**
- **La regla por fases (`sirius-coordestado.js`, v1.1):** el caso toma la fase del riesgo más atrasado y, dentro de ella, el estado más activo.
  - Fases: 1 Coordinación (Por coordinar, Oferta enviada, Enlace enviado), 2 Inspección (Agendado, En curso), 3 Informe y 4 Calificación.
  - En Inspección, «En curso» si algún riesgo está en curso y, si no, «Agendado».
  - Subestado, en este orden y solo lo que haya: «N de M agendados», «N en curso», «Oferta enviada», «Enlace enviado».
  - Con 2 en curso y 1 por coordinar: «En coordinación · 2 de 3 agendados · 2 en curso». Con 2 en curso y 1 agendado: «En curso · 1 de 3 agendado».
  - No cuentan los riesgos cancelados, excluidos ni con «No requiere inspección». Con un solo riesgo no cambia nada. Las fases 3 y 4 quedan como hoy.
- **Responsable y acción principal según la fase:** en Coordinación, el coordinador y «Coordinar visita» (con «Ver visita» en el menú «⋮»); en Inspección, el inspector (el de la visita en curso primero) y «Ver visita».
- **Al registrar la llegada o el estado «En curso» de una visita** (app del inspector, Agenda, autoinspección), el caso se recalcula con la regla: el estado sale de las visitas, y el «En curso» que dejaba la sesión ya no pisa a un caso con un riesgo por coordinar.
- **Lectura de la base:** si la base entrega `subestado`, se muestra tal cual (ahora también con «En curso»). Si entrega «En curso» sin subestado y algún riesgo sigue en Coordinación, el back-office lo corrige con la regla y el responsable pasa a ser el de la fase.
- **Pantallas:**
  - **Cabecera:** el chip dice «En coordinación · 2 de 3 agendados · 2 en curso» o «En curso · 1 de 3 agendado».
  - **Bandeja:** ubica el caso en la pestaña de su fase y muestra el subestado debajo del estado, también en «En curso»; cada fila de vehículo muestra su propio estado (En curso, Agendado, Por coordinar).
  - **Coordinación:** cuenta los vehículos por coordinar y marca cada uno con su estado.
  - **Registro de la coordinación:** la línea «Caso: …» agrega «N en curso».
- **Escenas nuevas:** `estadofasecurso`, `estadofaseinspeccion` y `cxestadofases` (base simulada; `?ffase=inspeccion` agenda el tercer vehículo). Registro e inventario actualizados (DEC-239).

**Verificado**
- **Escenas nuevas** a 1280 × 720 y 1920 × 1080, en la bandeja y con `?fvista=caso`: sin errores en la consola y sin desplazamiento lateral.
  - `estadofasecurso`: «En coordinación · 2 de 3 agendados · 2 en curso», responsable Andrea Salazar y «Coordinar visita».
  - `estadofaseinspeccion`: «En curso · 1 de 3 agendado», responsable Marco Tapia y «Ver visita»; el caso sale de la pestaña En coordinación.
  - `cxestadofases`: la base entrega «En coordinación» con «2 de 3 agendados · 2 en curso» (responsable Andrea Salazar, «Coordinar visita»); con `?ffase=inspeccion`, «En curso · 1 de 3 agendado» (responsable Mauricio Endara, «Ver visita»). Cada riesgo trae su estado y su visita.
- **Recálculo al registrar la llegada** (la misma llamada que hace la app): en `cabeceraver` (3 Agendados) la V1 en curso deja «En curso · 2 de 3 agendados» con el inspector; en `estadoparcial`, «En coordinación · 2 de 3 agendados · 1 en curso» con la coordinadora; en `estadooferta`, «En coordinación · 1 de 3 agendados · 1 en curso · Oferta enviada».
- **La regla sola, con 18 combinaciones:** las dos de la definición, 3 agendados («Agendado»), 3 en curso, oferta y enlace, autoinspección con enlace vigente, 3 por coordinar («Registrado»), cancelados y «No requiere inspección» que no cuentan, un solo riesgo, Informe y Calificación (como hoy) y un caso emitido (sin cambios).
- **Escenas existentes, comparadas con la versión anterior** (texto completo de la pantalla): estadoparcial, estadocompleto, estadooferta (también con `?fvista=caso`), cabeceracoordinar, cabeceraver, cxestadoparcial y cxcabecera, a 1280 × 720 y a 1920 × 1080: idénticas. Un solo riesgo igual: coord, coordchoque, coordauto, coordvis, coordrg, riesgos, bandejaexp, calveh, portalagendado, portalencurso, enlacevencidocurso, inspllegada, cxvisitaenlace, cxagenda, coordfases, coordvehiculoduplicado, coordriesgorg y cxcoordfases (1280 × 720): idénticas. `coordcancelavisitas` también es idéntica; su aviso «La solicitud quedó Cancelada» dura unos 6 segundos y aparece igual en las dos versiones (una captura hecha en el borde de ese tiempo lo perdió y no es un cambio).
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** no probé contra la base real; la base simulada calcula con la misma regla. Si la base real entrega estado y subestado con otra regla, se muestra lo suyo.
- **Llegada desde un teléfono real** y la sincronización de la app sin señal; solo la llamada que hace la app, en las escenas.
- **Riesgos excluidos o «No requiere inspección» en pantalla:** la regla los deja fuera (probado sola), pero no armé una escena con uno de ellos.
- **Informe y Calificación por riesgo (fases 3 y 4):** siguen como hoy, a la espera de DEC-209/212.
- **Con la conexión, una llegada registrada por la base** mientras la pantalla está abierta (suscripción): no la probé.

**Diferencias**
- **Singular solo en Inspección:** «1 de 3 agendado» sale en singular únicamente en Inspección, como en el ejemplo; en Coordinación se mantiene «N de M agendados» de DEC-238 («1 de 3 agendados»).
- **«N de M agendados» en Coordinación cuenta a los que ya van en curso** (están coordinados); por eso «2 de 3 agendados · 2 en curso». En Inspección cuenta solo a los «Agendado».
- **Riesgos ya en Informe o Calificación junto a otros por coordinar** cuentan como coordinados en «N de M agendados», igual que en DEC-238.
- **Caso en Inspección con riesgos en fase 3 o 4:** muestra «En curso» o «Agendado» según los que siguen en Inspección, sin subestado de los demás; se completa con DEC-209/212.
- **Escena `cxestadofases` sin el registro de la base:** el historial es el de 50012 de las escenas de fases.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `estadofasecurso` | Nueva: 20196 con 2 vehículos en una visita En curso y 1 por coordinar: «En coordinación · 2 de 3 agendados · 2 en curso», coordinadora y «Coordinar visita» (`?fvista=caso` abre el caso) |
| `estadofaseinspeccion` | Nueva: 2 En curso y 1 Agendado: «En curso · 1 de 3 agendado», inspector y «Ver visita» |
| `cxestadofases` | Nueva, con la conexión simulada: 50012 con el estado y el subestado de la base y cada riesgo con el suyo (`?ffase=inspeccion`: «En curso · 1 de 3 agendado») |
| `estadoparcial`, `estadocompleto`, `estadooferta` | Revisadas: idénticas |
| `cabeceracoordinar`, `cabeceraver` | Revisadas: idénticas |

También abrí `cxestadoparcial` y `cxcabecera` (idénticas) y 18 escenas de un solo riesgo y de Coordinación.

Tiempo de la etapa: inicio 15/11/2026 11:16 · fin 15/11/2026 11:36 · 20 min

---

## 18/10/2026 · 20:30 — Etapa G-2c9

«Cancelar visita» ahora le dice a la base cuál visita es: V3 manda `visita: 3`, y lo mismo hacen «Reenviar enlace» y «Generar nuevo enlace» desde la tarjeta. Al revisarlo encontré además otra causa, que explica que la base no cambiara: desde G-2c2, esas acciones de la tarjeta no salían del back-office. Las dos cosas están corregidas y publicadas en la **Versión 239**; la Versión 240 solo completa en el registro la hora de fin.

**Qué cambió**
- **Número en las acciones de una visita (`cxVisitaAccion`):** toma el número de la tarjeta (`cxBase.n`, la «Vn» del caso en el orden en que se crearon) y lo agrega:
  - `cancelarVisita { caso, visita, modalidad, motivo }`.
  - `reenviarEnlace { caso, visita, tipo, canal }`.
  - `enviarEnlace { caso, visita, canal, destinatario, modalidad, tipo }` en «Generar nuevo enlace» y en el envío desde una visita que aún no tiene enlace.
  - `ofertarVisita`, `anularOferta` y `agendarVisita` ya lo llevaban y no cambian.
  - «Reenviar» y «Generar enlace nuevo» del enlace de autoinspección desde Coordinación también llevan `visita`.
- **Causa de que no llegara a la base (`coordAction`):** en la primera línea había un comentario `//` de G-2c2 que, por estar en la misma línea, dejaba comentada la rama que manda las acciones de la tarjeta a la conexión. Con la conexión activa, cancelar una visita solo la marcaba «Cancelada» en la pantalla, y reenviar, generar enlace y copiar tampoco pasaban por `cxVisitaAccion`. Pasó a comentario `/* */`. Busqué el mismo patrón en los demás archivos del proyecto y no encontré otro caso.
- **Lo de la sesión no contradice a la base (`cxOv`):** lo que se muestra mientras responde la base (`cxVisOv`) ahora guarda la versión de datos con la que se creó y se descarta cuando los datos se recargan. Con `{ ok: true }` se recarga la base y se descarta; con `{ ok: false }` se descarta y la tarjeta vuelve a su estado, con el mensaje de la base. Si la base no cambió la visita que se pidió cancelar, la tarjeta sigue «Agendada».
- **Base simulada de las escenas:** `cancelarVisita` cancela la visita del número recibido (V3 es V3, aunque V4 sea más reciente). Si la visita no está abierta responde `{ ok: false }` con «La visita V2 está cancelada: no se puede cancelar». Sin `visita`, cancela la abierta más reciente de la modalidad, como hacía la base antes del SQL 43. La última petición queda en `window.__sirCancelUltima`.
- **Escena nueva `cxcancelarvisitanumero`**, con el preset `cxcancelar:Vn` en Coordinación para abrir el diálogo de la visita elegida.
- **Archivos:** `SIRIUS Back-office.dc.html`, `Coordinacion.dc.html`, `datos-cx-coordinacion.js` y `datos-escenas.js`; registro e inventario actualizados (`cancelarVisita` con `visita`).

**Verificado**
- **Escena nueva:** con la conexión simulada, el caso 50012 con V1, V3 y V4 abiertas y V2 cancelada. Al cancelar V3 la conexión recibe `cancelarVisita { caso: '50012', visita: 3, modalidad: 'Presencial', motivo }`. Solo V3 queda «Cancelada»; V1 y V4 siguen «Agendada» en la pantalla y en la base simulada. Sin errores en la consola.
- **Rechazo:** con `?fvisita=2`, la pantalla ve V2 «Agendada» pero en la base ya está cancelada. Al cancelarla, la base responde `{ ok: false }`, sale «La visita V2 está cancelada: no se puede cancelar» y las cuatro tarjetas quedan como estaban.
- **Manda la base:** con una conexión que cancela otra visita (V4) en lugar de V3, la pantalla termina con V4 «Cancelada» y V3 «Agendada»; no queda la V3 cancelada de la sesión.
- **Copia aparte con una conexión temporal** (la copia publicada no se tocó): abrí el caso 50012 desde la bandeja, en Coordinación, y cancelé V3. La conexión recibió exactamente `{"tipo":"cancelarVisita","datos":{"caso":"50012","visita":3,"modalidad":"Presencial","motivo":"Prueba en la copia."}}`. Como esa conexión no cambia datos, la tarjeta volvió a «Agendada»: manda la base.
- **Tamaños:** `cxcancelarvisitanumero` (con y sin `?fvisita=2`), `coordcancelavisitas` y `cxvisitacancelar` a 1280 × 720 y a 1920 × 1080: sin errores y sin desplazamiento lateral. El diálogo se abre con «Cancelar visita V3» (V2 con `?fvisita=2`, V1 en `cxvisitacancelar`).
- **`cxvisitacancelar` (30031):** cancelar V1 envía `visita: 1` y deja V1 «Cancelada». Con `?cxok=0` sale «La base rechazó la acción (prueba)» y la tarjeta sigue «Autoinspección enviada».
- **`cxvisitaenlace` (30031):** «Reenviar enlace» envía `reenviarEnlace { caso: '30031', visita: 1, tipo: 'Autoinspección', canal: 'WhatsApp' }`. «Generar nuevo enlace» envía `enviarEnlace { caso, visita: 1, canal, destinatario, modalidad, tipo }`.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** no probé contra la base real ni el SQL 43. No pude reproducir aquí que la base cancelara la visita equivocada; lo verifiqué con la base simulada, que ahora hace lo que dice el SQL 43.
- **Recarga en pleno envío:** una recarga por la suscripción mientras la acción sigue pendiente descarta la superposición antes de la respuesta; no la probé con una conexión que notifique cambios.
- **«Copiar enlace»:** vuelve a pasar por `cxVisitaAccion` con la corrección, pero no lo probé en esta etapa.
- **Otras acciones sobre una visita:** el envío del enlace desde una visita «Por agendar» sin enlace no lo probé a mano.
- **Cancelar la solicitud (`coordcancelavisitas`):** la abrí a los dos tamaños, pero no repetí el recorrido completo de cancelar la solicitud.

**Diferencias**
- **Qué corrige realmente:** la falta del número no era la única causa. Hasta esta versión, con la conexión activa, esas acciones de la tarjeta no salían del back-office. Si en tus pruebas sí llegaba `cancelarVisita` sin número, esa prueba corrió con una copia que no tenía el comentario de G-2c2.
- **Sin número cuando la visita aún no existe:** el `enviarEnlace` de un envío nuevo desde el formulario de Coordinación (la visita se crea al enviar) no lleva `visita`; la base la crea y la numera.
- **Envío desde «Enviar enlace» de una modalidad sin visita:** tampoco lleva `visita`, por la misma razón; con visita sí lo lleva.
- **Recarga:** con `{ ok: true }` el orden es recargar y luego descartar lo de la sesión.
- **Base simulada:** sin `visita`, cancela la abierta más reciente de la modalidad, como la base antes del SQL 43; solo sirve para pruebas.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxcancelarvisitanumero` | Nueva: 50012 con V1, V3 y V4 abiertas y V2 cancelada; el diálogo «Cancelar visita V3»; al confirmar, `visita: 3` y solo V3 «Cancelada». Con `?fvisita=2`, la V2 desfasada y la respuesta `{ ok: false }` «La visita V2 está cancelada: no se puede cancelar» |
| `coordcancelavisitas` | Revisada: cancelar la solicitud deja las visitas «Cancelada», sin cambios |
| `cxvisitacancelar` | Revisada: cancelar V1 de 30031 envía `visita: 1`; con `?cxok=0` la tarjeta vuelve atrás con el mensaje |

También abrí `cxvisitaenlace` (reenviar y generar nuevo enlace, con `visita: 1`) y `cxvisitacancelar` con `?cxok=0`.

Tiempo de la etapa: inicio 15/11/2026 10:36 · fin 15/11/2026 10:48 · 12 min

---

## 18/10/2026 · 20:30 — Etapa G-2d

El portal del cliente ahora pide primero el lugar y después muestra los horarios. El cliente usa su ubicación o escribe la dirección y elige una sugerencia. Ve el punto en un mapa pequeño que puede mover y lee en qué ciudad y zona será la inspección. Recién entonces ve los horarios, y solo los de los inspectores que cubren ese lugar. La autoinspección también pide el lugar antes de empezar. El lugar elegido llega a la tarjeta de la visita en Coordinación con su origen y, con la conexión, va en la acción con la que el portal agenda o pide la cita. Quedó publicada en la **Versión 237** (la Versión 238 solo completa en este registro la hora de fin).

**Qué cambió**
- **Paso Lugar (módulo nuevo `sirius-portal-lugar.js`, `SiriusPortalLugar`):**
  - **Ubicarse:** «Usar mi ubicación» usa el GPS del celular, con permiso. Si se niega o falla, sale «No pudimos usar tu ubicación: escribe la dirección» y el cursor queda en «Buscar la dirección». La otra vía es escribir la dirección y elegir una sugerencia (`SiriusUbicacion.buscar`), o usarla «tal como la escribí».
  - **Mapa pequeño (`SiriusMapa`):** el punto se puede arrastrar para ajustarlo. Si la dirección no se ubicó, se toca el mapa para marcar el punto.
  - **Mensaje de zona (`SiriusLugar` y `SiriusZonas`):** «Tu inspección será en Quito · Zona Norte», con «Si el punto no es correcto, muévelo»; «Tu inspección será en Ambato» en una ciudad sin zonas; o «No pudimos ubicar tu dirección» con «Toca el mapa o continúa; un coordinador confirmará la zona».
  - **Datos que completa el cliente:** «Dirección exacta» (se llena con lo buscado y se puede editar) y «Referencia».
  - **Ramos Generales no móviles:** muestra la dirección de la solicitud con su mapa, sin GPS, y pregunta «¿La inspección es en esta dirección?». Si el cliente dice «No», escribe la correcta y queda «Por confirmar» para el Coordinador.
  - `SiriusLugar` acepta ahora el origen 'GPS'.
- **Autoagendamiento (`sirius-portal-caso.js`):**
  - **Pasos:** 1 Lugar · 2 Horario · 3 Confirmación. El botón principal va al final y dice el paso siguiente: «Siguiente: Horario», «Siguiente: Confirmación» y «Confirmar la cita».
  - **Horarios por cobertura:** el paso Horario se titula «Horarios para Quito · Zona Norte» y tiene «Cambiar el lugar». La agenda fija y la red solo ofrecen a quienes cubren ese lugar (`SiriusCobertura` con la ciudad y la zona). Con «zona por confirmar», solo a quienes cubren toda la ciudad.
  - **Sin horarios:** si nadie cubre el lugar, sale «No hay horarios inmediatos para tu zona: te contactará un coordinador» y «Registramos tu pedido». En el caso quedan el evento, la tarea y el aviso al Coordinador.
  - **Paso Confirmación:** muestra el lugar y el horario, y pide quién recibe al inspector y su celular.
- **Autoinspección (`sirius-portal.js`):** «Paso 1 de 2 · Lugar» va después de los consentimientos y antes de empezar, sin horarios. «Siguiente: Autoinspección» lo registra en el caso y en su visita.
- **Coordinación:** la tarjeta de la visita agendada por el cliente muestra «Ciudad y zona» y «Origen: cliente (GPS)», o «mapa», «dirección buscada» o «confirmó la de la solicitud», en cualquier modalidad.
- **Con la conexión:** la cita confirmada se envía con `agendarVisita` y el pedido sin cita se envía con `pedirCita`. Las dos llevan el lugar `{ provincia, ciudad, direccion, referencia, punto, zona: { id, nombre } | null, estadoZona, lejos, origen }`, con la forma de `agendarVisita`. El detalle está en Diferencias.
- **Archivos:**
  - **Páginas:** `Portal.dc.html` carga ahora Leaflet y los módulos del lugar.
  - **Escenas:** `datos-escenas.js` tiene 657 y `KNOWN_ESC` 614.
  - **Corrección:** el portal ya no falla con un enlace que no existe; muestra «No encontramos este enlace».

**Verificado**
- **Escenas nuevas a 390 × 844 y 1280 × 720:** las seis, sin errores de consola y sin desplazamiento lateral dentro del portal.
  - **portallugargps:** GPS simulado en Quito Norte → «Tu inspección será en Quito · Zona Norte», con el pin en el mapa. El punto se ajusta y el paso Horario dice «Horarios para Quito · Zona Norte». La agenda fija ofrece a Marco Tapia y Diana Cárdenas (Diana cubre toda Quito; Cristian Vaca, que cubre el Sur, queda fuera) y la red a Luis Andrade y Mauricio Endara.
  - **portallugarbuscar:** «Kennedy Norte» → «Guayaquil · Zona Norte», con horarios de Paola Vinueza y Diana Cárdenas.
  - **portalsinubicar:** «calle 123» → «No pudimos ubicar tu dirección», y el paso Horario dice «Horarios para Quito · zona por confirmar», solo con Diana Cárdenas.
  - **portalsinhorarios:** Conocoto (Quito · Zona Valle de los Chillos) → el mensaje sin horarios y «Registramos tu pedido». En el caso quedaron el evento en el Historial y el aviso «El cliente del caso 20152 no encontró horarios para Quito · Zona Valle de los Chillos».
  - **portalrgconfirmar:** muestra la dirección de la solicitud (Quito · Zona Valle de los Chillos), sin «Usar mi ubicación». Al responder «No» y escribir la dirección correcta, queda «Esta dirección queda por confirmar».
  - **portalautoinsplugar:** «Paso 1 de 2 · Lugar» antes del tipo de vehículo. Al seguir, la tarjeta V1 (Autoinspección) en Coordinación muestra «Quito · Zona Norte» y «Origen: cliente (GPS)».
- **Permiso de GPS denegado:**
  - Con `?fgps=denegado`, y en `Portal.dc.html` con el permiso negado del navegador, sale «No pudimos usar tu ubicación: escribe la dirección» y el cursor queda en «Buscar la dirección».
  - Después se buscó «Malecón», se eligió la sugerencia y se pasó a «Horarios para Guayaquil · Zona Centro».
  - Con el permiso concedido (GPS de Chromium en Guayaquil), la autoinspección mostró «Guayaquil · Zona Norte».
- **Recorrido completo:** se eligió el horario, se confirmó la cita y la tarjeta V1 de Coordinación quedó con «Quito · Zona Norte», «Origen cliente (GPS)» y la dirección.
- **Copia aparte con conexión temporal (caso 70001):**
  - **Cita con cupo:** la conexión recibió `agendarVisita { caso, visita: 1, accion: 'agendar', inicio: '2026-10-19T10:30:00-05:00', minutos: 45, inspector, modalidad, direccion, observaciones, motivo, riesgos, lugar: { provincia: '17', ciudad: '1701', direccion, referencia, punto, zona: { id: 'z1701-1', nombre: 'Norte' }, estadoZona: 'Calculada', lejos: false, origen: 'GPS' }, fueraCobertura: null, canal: 'Portal del cliente', origenCita: 'fija' }`.
  - **Horario de la red:** recibió `pedirCita { motivo: 'red', fecha, inicio, minutos, lugar, contacto, inspectores, canal }`.
  - **Sin horarios:** recibió `pedirCita { motivo: 'sinHorarios', …, lugar }`.
- **Escenas del portal existentes:** las 44 (16 del portal del caso y 28 de la autoinspección y del enlace), a 390 × 844 y 1280 × 720, comparadas una por una con la versión anterior.
  - **Iguales:** todas menos las de la agenda.
  - **Cambian como se pide:** portalagenda, portalapartado, portalhoras y portalrg pasan a «Paso 2 de 3 · Horario», con «Horarios para Quito · Zona …» y «Siguiente: Confirmación», y con los mismos horarios de antes. portallugar pasa a «Confirma tu cita», con el lugar y el horario. portalred nombra la zona.
  - **portalvideo2:** solo cambia el contador del video.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** no probé con la base real, el servicio de mapas real ni el GPS de un celular real (solo el de Chromium, permitido y negado).
- **Mapa base:** no carga en esta vista; el mapa funciona sobre el fondo neutro con la nota.
- **Portal de un caso de la base:** no probé abrirlo con la conexión desde la pantalla. En la copia lo abrí directamente, porque con la conexión los enlaces de ejemplo de los casos de la base se aíslan.
- **Pantallas táctiles:** no probé arrastrar el punto con el dedo.

**Diferencias**
- **Acciones con la conexión:** salen de `SIRIUS Back-office.dc.html`.
  - **`agendarVisita`:** con `accion: 'agendar'`, o `'reagendar'` cuando el cliente cambia la cita, y `canal: 'Portal del cliente'`. La envía `portalCasoAgendar`, por `cxPortal`.
  - **`pedirCita`, acción nueva que la base debe implementar:** cubre lo que no termina en una cita, sea un horario de la red o la falta de horarios (`motivo: 'red' | 'sinHorarios'`). La envían `redPedida` y `pedidoSinHorarios` de `portalCasoInit`.
  - **Lugar:** el lugar lleva también `lejos`, como en `agendarVisita`.
- **Sucursal para la cobertura:** es la de la ciudad del lugar (Guayaquil → sucursal Guayaquil). Si esa ciudad no tiene sucursal, se usa la del caso. Así, los inspectores que atienden por sucursal no reciben un lugar de otra ciudad.
- **Origen del punto:** ajustar el punto conserva el origen (GPS o búsqueda). «Mapa» queda solo cuando el punto se marca tocando el mapa en una dirección que no se ubicó.
- **Ciudad del GPS:** sale del centro de ciudad más cercano, a menos de 40 km. La «Dirección exacta» se prellena con la dirección de prueba más cercana, a menos de 1,5 km. En producción lo resolverá el servicio de mapas.
- **Ramos Generales con «No»:** la dirección escrita va con origen «dirección buscada», sin punto, y queda por confirmar. Sus horarios son de quienes cubren toda la ciudad.
- **Autoinspección con la conexión:** el lugar queda en la cronología y en la visita, pero no se envía a la base, porque no existe una acción para cambiar solo el lugar de una visita de autoinspección.
- **Textos:** los del paso Lugar están en el código y todavía no se editan en las Apariencias del portal. Los títulos de los pasos 1 y 3 usan los bloques que ya existían cuando aplican.
- **Escenas anteriores:** las del autoagendamiento llegan con el lugar de la solicitud ya elegido.
- **Reloj:** los horarios del portal siguen con el reloj del prototipo, como antes, también con la conexión.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `portallugargps` | GPS simulado en Quito Norte, ajuste del punto y «Horarios para Quito · Zona Norte» (`?fpaso=lugar` se queda en Lugar; `?fgps=denegado`, el permiso negado) |
| `portallugarbuscar` | «Kennedy Norte» → Guayaquil · Zona Norte y sus horarios |
| `portalsinubicar` | «calle 123» → zona por confirmar; horarios de quienes cubren toda Quito |
| `portalsinhorarios` | Ningún inspector cubre la zona: el mensaje y el pedido registrado |
| `portalrgconfirmar` | Ramos Generales con el lugar de la solicitud; «No» y la dirección correcta (`?fpaso=horario` avanza) |
| `portalautoinsplugar` | La autoinspección pide el lugar antes de empezar |

También abrí las 44 escenas del portal que ya existían a 390 × 844 y 1280 × 720 contra la versión anterior, y `Portal.dc.html` suelto, con un enlace del portal del caso y otro de autoinspección.

Tiempo de la etapa: inicio 15/11/2026 09:37 · fin 15/11/2026 10:12 · 35 min

---

## 18/10/2026 · 20:30 — Etapa G-2e2

La acción principal de la cabecera del caso ahora sale de lo que falta por hacer. Si el caso está en la fase de coordinación y algún riesgo está «Por coordinar», dice «Coordinar visita» y abre Coordinar visita con esos riesgos ya marcados; «Ver visita» pasa al menú «⋮». Si no queda nada por coordinar, sigue siendo «Ver visita» y abre la visita en curso o la próxima por hora. Rige con y sin la conexión. Quedó publicada en la **Versión 235** (la Versión 236 solo completa en este registro la hora de fin).

**Qué cambió**
- **Cabecera del caso (`SIRIUS Back-office.dc.html`):**
  - **Regla:** «Coordinar visita» si el caso está en Registrado, En coordinación, Reaperturado o Enlace caducado, tiene visitas y algún riesgo «Por coordinar» (misma regla de DEC-238 que la pestaña y la bandeja: `SiriusCoordEstado`; con la conexión sale de `casos[].riesgos[].estado`). Si no, «Ver visita» (visita con cita o en curso) y, en las demás fases, lo que había (informe, calificación…).
  - **Roles:** solo Coordinador de inspecciones y Administrador. Los demás roles ven la cabecera como antes; con el Ejecutivo comercial no sale ni «Coordinar visita» ni «Ver visita».
  - **Permiso:** «Coordinar visita» se pide con el mismo permiso de la matriz que «Ver visita» («Coordinar visitas, reagendar, cambiar inspector, dividir, cancelar»).
- **Al pulsar «Coordinar visita»:** abre la pestaña Coordinación y Coordinar visita en la fase Contacto, con los vehículos por coordinar marcados y sin tocar los que ya tienen visita (preset `porcoordinar` en `Coordinacion.dc.html`; sigue el mismo camino de «Abrir Coordinar visita» de la Agenda).
- **Menú «⋮»:** con «Coordinar visita» como principal y alguna visita, el menú trae «Ver visita» (ícono de ojo, antes de «Duplicar»).
- **«Ver visita» abre la visita justa:** la que está en curso o, si no, la siguiente por hora (la última si todas pasaron). Lleva a «Visitas del caso» y deja esa visita enfocada y resaltada (`data-visita` en cada visita de Coordinación). Usa el reloj de la conexión (hora real de Ecuador) o el del prototipo.
- **Escenas:** `cabeceracoordinar`, `cabeceraver` y `cxcabecera` (en `datos-escenas.js`, `KNOWN_ESC`, `datos-cx-fases.js` y `SIRIUS Back-office.dc.html`).
- **Registro:** `datos-escenas.js` (651) y `KNOWN_ESC` (608).

**Verificado**
- **cabeceracoordinar** (caso 20196, 3 vehículos: V1 y V2 agendados, Kia Sportage por coordinar), a 1280 × 720 y 1920 × 1080, con el Coordinador: botón «Coordinar visita»; al pulsarlo se abre «Coordinar visita V3» con el Kia Sportage marcado (los otros dos «en V1» y «en V2» sin marcar); el menú «⋮» trae «Ver visita», que enfoca V1 (19/10, la próxima).
- **cabeceraver** (los 3 agendados), a los dos tamaños: botón «Ver visita» y el menú sin «Ver visita» repetido; el botón enfoca V1.
- **cxcabecera** (conexión simulada, caso 50012, PRB1213 por coordinar), a los dos tamaños, como Coordinador y como Administrador: «Coordinar visita»; abre «Coordinar visita V3» con PRB1213 marcado; «Ver visita» está en el menú y enfoca V1.
- **Ejecutivo comercial** (`?rol=Ejecutivo%20comercial`), cabeceracoordinar y cabeceraver a los dos tamaños: la cabecera no tiene botón principal y el menú solo trae «Duplicar», «Ver bitácora» y «Cancelar caso».
- **Escenas existentes con acción en la cabecera**, a 1280 × 720 y comparadas una por una con la versión anterior: envioenlace, coord, coordchoque, enlaceagenda y cxcoordins («Coordinar inspección»), y coordvis, cxvisitaenlace y cxcoordjornada («Ver visita») quedan igual. Solo cambian las que tienen un vehículo por coordinar y ya tienen visitas, como se pide: cxestadoparcial, coordfases y coordvehiculoduplicado pasan de «Ver visita» a «Coordinar visita». estadoparcial, estadooferta y estadocompleto abren la bandeja y no muestran cabecera.
- Sin errores de consola ni desplazamiento lateral en ninguna escena. `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- Con la base real; solo probé la simulada.
- Una escena con la visita «En curso» como destino de «Ver visita»: la elección de la visita en curso está en el código, pero ninguna escena la muestra junto a un riesgo por coordinar.
- Casos en «Enlace caducado» y «Reaperturado» con visitas: probados por el código, sin escena.
- Con la conexión simulada el usuario solo puede ser Coordinador o Administrador, así que el Ejecutivo comercial solo se probó sin conexión.
- Las escenas existentes de arriba, a 1920 × 1080.

**Diferencias**
- **Sin visitas todavía:** si el caso aún no tiene ninguna visita, la acción sigue siendo «Coordinar inspección» (o «Agendar visita» con el contacto hecho), como dice DEC-163. «Coordinar visita» reemplaza a «Ver visita» solo cuando ya hay visitas y queda algo por coordinar.
- **Riesgo por coordinar dentro de una visita sin cita** (por ejemplo, una visita «Por agendar» o con el enlace caducado): ahí no hay un vehículo libre que marcar. «Coordinar visita» lleva a «Visitas del caso» en vez de abrir el panel.
- **Fase «Enlace caducado»:** antes mostraba «Ver visita» como acción secundaria; ahora, si hay un riesgo por coordinar, muestra «Coordinar visita» como principal.
- **Fase de apertura:** «Coordinar visita» abre en Contacto (como «Llamar y registrar intento»), no en Inspector y horario.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cabeceracoordinar` | Caso 20196 con V1 y V2 agendados y el tercer vehículo por coordinar: botón «Coordinar visita» (abre Coordinar visita V3 con ese vehículo marcado) y «Ver visita» en el menú «⋮» |
| `cabeceraver` | El mismo caso con los 3 vehículos agendados: botón «Ver visita», que enfoca la próxima visita |
| `cxcabecera` | Conexión simulada: caso 50012 con PRB1213 por coordinar; «Coordinar visita» abre Coordinar visita V3 con PRB1213 marcado |

También abrí envioenlace, coord, coordvis, coordchoque, estadoparcial, estadooferta, estadocompleto, cxestadoparcial, cxvisitaenlace, coordfases, enlaceagenda, cxcoordins, cxcoordjornada y coordvehiculoduplicado a 1280 × 720, para comparar con la versión anterior.

Tiempo de la etapa: inicio 15/11/2026 08:54 · fin 15/11/2026 09:10 · 16 min

---

## 18/10/2026 · 20:30 — Etapa G-2e

Con la conexión, la Agenda de inspecciones ya usa solo datos de la base: los inspectores activos con su jornada y su cobertura, las visitas de cada caso, las ofertas y las visitas por agendar en «Sin asignar», y la hora real de Ecuador. Mover una visita es reagendarla en la base con `agendarVisita`. Ya no sale la banda «Datos de demostración». Sin la conexión, la Agenda queda igual que antes. Quedó publicada en la **Versión 233** (la Versión 234 solo completa en este registro la hora de fin).

**Qué cambió**
- **Datos de la base (`SIRIUS Back-office.dc.html`, `agendaCx`):**
  - **Inspectores:** los activos de `SIRIUS_CONEXION.inspectores`, con su cobertura (`SiriusCobertura`) y su jornada. La jornada sale de `SIRIUS_AGENDA.disponibilidad` por nombre o, si no tiene, de `SIRIUS_AGENDA.jornadaDefecto`; la capacidad del día es la de su disponibilidad o 6.
  - **Visitas:** las de `casos[].visitasBase` con fecha y hora (Agendada, En camino, En curso y las realizadas de hoy), con el caso, los riesgos, el lugar «Ciudad · Zona», la modalidad, el estado y la etiqueta «Fuera de cobertura».
  - **Fila «Sin asignar»:** las visitas con «Oferta enviada» (en cada día de su rango, con el vencimiento y a cuántos inspectores se envió) y las «Por agendar».
- **Reloj real de Ecuador (DEC-230):** «Hora de Ecuador: dd/mm/aaaa · hh:mm», la columna «Hoy · hh:mm», la marca «Ahora · hh:mm» entre las visitas de hoy (Semana), la línea roja de la hora actual (Día) y lo ya pasado sombreado. «Hoy» va al día real.
- **Filtro «Ciudad y zona»:** se suma a los de hoy. Lista las ciudades (`SIRIUS_GEOGRAFIA`) con sus zonas (`SIRIUS_ZONAS`) y las de las visitas y las coberturas; filtra las visitas por su lugar y los inspectores por su cobertura. Con un inspector elegido, también se ven las ofertas que se le enviaron.
- **Mover = reagendar:**
  - Se arrastra la visita o se usa «Mover» en su resumen, con un motivo de al menos 10 caracteres.
  - Se valida como en Coordinar visita (`SiriusAgenda.validarCx`): jornada y días del inspector, choques y hora pasada bloquean. Fuera de cobertura no bloquea: lo avisa y el botón dice «Mover fuera de cobertura».
  - Se envía `agendarVisita { caso, visita, accion: 'reagendar', inicio, minutos, inspector, riesgos, lugar, motivo, fueraCobertura }`.
  - Mientras la base responde, la visita se ve en su nuevo lugar con «Guardando…». Con `{ ok: false }` vuelve a su lugar y sale «La base no guardó el cambio» con el mensaje de la base.
- **Resumen de la visita:** muestra la visita (Vn), la ciudad y zona, la dirección y el motivo de «Fuera de cobertura». Su botón «Abrir Coordinar visita» abre el caso en «Reagendar visita Vn», fase Inspector y horario (preset `agenda:Vn` en `Coordinacion.dc.html`).
- **Lo que aún no está en la base** sigue con datos de ejemplo y lleva «(demostración)»: «Pedidos de los inspectores (demostración)», «Duración de las visitas (demostración)», «Bloqueo (demostración)» en la leyenda y los cupos apartados («Cupo apartado (demostración)»).
- **Archivos nuevos y escenas:**
  - **`datos-cx-agenda.js` (nuevo):** la base simulada y las escenas `cxagenda`, `cxagendamover` y `cxagendafiltros`.
  - **Registro:** `datos-escenas.js` (648) y `KNOWN_ESC` (605).
  - **`sirius-agenda.js`:** `validarCx` y `CHECKS_CX`.

**Verificado**
- **cxagenda (1280 × 720 y 1920 × 1080):**
  - Mauricio Endara «Agencia · Eurosurvey · 08:30–17:30» (jornada por defecto) tiene 2 visitas: 60101 «Quito · Norte» y 60102 «Quito · Sur» con «Fuera de cobertura».
  - Aparecen Diana Cárdenas, Cristian Vaca, Luis Andrade, Marco Tapia y Paola Vinueza con sus visitas de la base. La visita cancelada no aparece.
  - «Sin asignar» muestra la oferta del caso 60108 («Oferta enviada · V1 · vence …», del día base a dos días hábiles después, a 3 inspectores) y la visita por agendar del caso 60109.
  - No sale la banda de demostración.
- **Hoy y la línea de la hora actual:** con el reloj del navegador en el martes 17/11/2026 a las 10:20 de Ecuador, la columna dice «Hoy · 10:20», «Ahora · 10:20» queda entre la visita de las 09:00 y la de las 11:00, la vista Día dibuja la línea y el lunes dice «Ya pasó». Con la hora real (domingo 15/11, 00:5x) la escena se abre en el lunes 16/11.
- **cxagendamover:**
  - **Por defecto:** «Mover la visita» con las 4 comprobaciones en «cumple» y el motivo.
  - **`?fmov=choque`:** «Choca con la visita V1 del caso 60102 (11:00–11:45)».
  - **`?fmov=jornada`:** «De 17:30 a 18:15 queda fuera de la jornada de Mauricio Endara (lun a sáb, 08:30–17:30)».
  - **`?fmov=fuera`:** «Cristian Vaca no cubre Quito · Norte (su cobertura: Quito: Sur)» con «Mover fuera de cobertura».
  - **`?fmov=enviar`:** la visita queda a las 15:00 en la base.
  - **`?fmov=base`:** «La base no guardó el cambio» con el mensaje de la base, y la visita sigue a las 09:00.
- **cxagendafiltros:** «Ciudad y zona» = Quito · Norte e inspector Mauricio Endara: solo su visita del norte (la del sur queda fuera).
- **Por la pantalla:**
  - Arrastrar una visita de Mauricio a otro día abre «Mover la visita» con las comprobaciones.
  - Resumen → «Mover» → 16:00 → «Revisar y mover» abre la misma ventana.
  - «Abrir Coordinar visita» abre «Reagendar visita V1» del caso 60102 en la fase Inspector y horario.
  - La vista Lista incluye la realizada de hoy, las agendadas, la oferta y la visita por agendar.
- **Copia aparte con una conexión temporal** (solo en la copia; `sirius-conexion.js` con `activo: true` y un `accion()` que registra): al mover la visita 70001 V1 a las 14:00 desde el resumen, la conexión recibió `agendarVisita { caso: '70001', visita: 1, accion: 'reagendar', inicio: '2026-11-16T14:00:00-05:00', minutos: 45, inspector: 'Mauricio Endara', riesgos: ['70001-V1'], lugar: { provincia, ciudad: '1701', direccion, referencia, punto, zona: { id: 'z1701-1', nombre: 'Norte' }, estadoZona, lejos, origen }, motivo, fueraCobertura: null }`. No salió la banda y el reloj dijo «Hora de Ecuador».
- **Sin la conexión:** agendasemana, agendadia, agendamover y agendaok a 1280 × 720 y 1920 × 1080 dan capturas idénticas píxel a píxel a las de la versión anterior.
- **Otras escenas:** coordfases, cxcoordjornada, cxestadoparcial, coordvehiculoduplicado (`?freag=1`) y agendajornada siguen sin errores.
- En todas las escenas probadas no hubo errores de consola, la página no se desplazó lateralmente y scrollY quedó en 0.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- Con la base real (solo la conexión simulada y la copia con una conexión temporal que no guarda nada).
- Visitas «En camino» o «En curso» y enlaces de autoinspección vigentes que vengan de la base: no hay una escena con esos datos.
- La Agenda conectada con el rol Inspector («Mi agenda»).
- Arrastrar con el teclado o en pantallas táctiles (el arrastre es con el ratón; con el teclado se usa «Mover»).

**Diferencias**
- **Día de apertura:** la escena se abre en el «día base»: hoy si es hábil y todavía no son las 13:00; si no, el siguiente día hábil. Fuera de ese horario, «Hoy» y la línea quedan fuera de la semana que se ve; se llega con «Hoy». La Agenda conectada se abre, como antes, en hoy o en el siguiente día hábil.
- **Motivo y cobertura:** fuera de cobertura usa el mismo motivo del reagendamiento y se envía como `fueraCobertura: { motivo }` (en los demás casos, `null`), igual que en Coordinar visita.
- **Lo que no se valida al mover:** con la conexión no se validan la capacidad del día, la modalidad que hace el inspector ni los bloqueos (que son de demostración). Coordinar visita tampoco los valida.
- **Visitas que no se mueven:** las «En camino», «En curso», realizadas, ofertas y por agendar no se mueven desde la Agenda («Mover» deshabilitado con su motivo). En una oferta o una visita por agendar, «Abrir Coordinar visita» abre la pestaña Coordinación sin el panel.
- **Tipo de inspector:** el tipo «Independiente» de la base se muestra como «Externo» (el filtro Tipo ya tenía Interno, Externo y Agencia).
- **Mensaje de la base:** cuando la base rechaza, el aviso general del sistema muestra también su mensaje, además de la ventana.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `cxagenda` | Semana con los inspectores y las visitas de la base: Mauricio Endara con 2 visitas (una «Fuera de cobertura»), la oferta y la visita por agendar en «Sin asignar», «Hoy» y la línea de la hora actual |
| `cxagendamover` | Mover la visita V1 de 60101 a las 15:00 con motivo; `?fmov=choque`, `jornada`, `fuera`, `enviar` y `base` (la base responde `{ ok: false }`) |
| `cxagendafiltros` | «Ciudad y zona» = Quito · Norte e inspector Mauricio Endara |

También abrí agendasemana, agendadia, agendamover y agendaok (sin la conexión) a los dos tamaños, y coordfases, cxcoordjornada, cxestadoparcial, coordvehiculoduplicado y agendajornada a 1280 × 720.

Tiempo de la etapa: inicio 15/11/2026 00:33 · fin 15/11/2026 00:56 · 23 min

---

## 18/10/2026 · 20:30 — Etapa G-2c8

Un caso con varios riesgos ya no pasa a «Agendado» cuando se agenda la primera visita: sigue «En coordinación · N de M agendados» hasta que todos los riesgos tengan cita, el responsable sigue siendo el coordinador y el SLA de coordinación del riesgo pendiente sigue corriendo (DEC-238). Cada riesgo muestra su propio estado en la bandeja y en la pestaña Coordinación. Quedó publicada en la **Versión 230** (las Versiones 231 y 232 solo completan en este registro las versiones y la hora de fin). Probé las 4 escenas nuevas y las de bandeja y Coordinación a 1280 × 720 y 1920 × 1080, sin errores de consola, sin desplazamiento de la página y sin desborde horizontal.

**Qué cambió**
- **Una sola regla (`sirius-coordestado.js`, nuevo, v1.0):** un riesgo está «coordinado» si tiene una visita abierta con cita (Agendada o En camino), está en curso, o está en una visita de Autoinspección con el enlace enviado y vigente. No cuentan un riesgo sin visita, una visita «Por agendar», una oferta («Oferta enviada») ni un enlace de autoagendamiento sin respuesta. El caso en la fase de coordinación (Registrado, En coordinación, Reaperturado, Enlace caducado, Agendado) queda «En coordinación» mientras algún riesgo no esté coordinado, con el subestado «N de M agendados» (+ «Oferta enviada» / «Enlace enviado»); «Agendado» cuando todos lo están, y entonces el responsable pasa a ser el inspector. Con un solo riesgo todo queda igual que antes y las fases posteriores no cambian.
- **Sesión (`SIRIUS Back-office.dc.html`):** `coordAction` reevalúa todos los riesgos del caso al agendar, reagendar, cambiar el inspector, ofertar, anular una oferta, enviar un enlace y cancelar una visita; el historial agrega «Caso: …» y el aviso dice, por ejemplo, «el caso sigue En coordinación (2 de 3)». `withR` calcula el estado de cada riesgo y el estado y subestado del caso.
- **Con la conexión:** cada elemento de `casos[].riesgos` trae `estado` (su estado de coordinación) y `visita { n, estado, inicio, inspector }` o `null`; el caso trae `estado` y `subestado` ya calculados por la base. Si un riesgo no trae visita, se calcula con `visitasBase`; si la base no trae `subestado`, la pantalla lo calcula con la misma regla. La base simulada (`datos-cx-fases.js`) entrega ahora esos datos y los recalcula después de agendar, ofertar y anular una oferta.
- **Bandeja:** las filas de cada riesgo muestran su visita («Visita V1 · 19/10 · 10:00»), el inspector y su estado (Por coordinar, Oferta enviada, Enlace enviado, Agendado, En curso) en lugar del estado del caso; la fila del caso dice «En coordinación» con «2 de 3 agendados» debajo, y la cabecera del caso «En coordinación · 2 de 3 agendados».
- **Pestaña Coordinación (`Coordinacion.dc.html`):** el contador y la lista de «Vehículos por coordinar» usan la misma regla («1 de 3»); las filas que no se pueden elegir dicen su estado real (Agendado, Oferta enviada) en lugar de solo «en V1».
- **Escenas nuevas:** `estadoparcial`, `estadocompleto`, `estadooferta` y `cxestadoparcial` (`?fvista=caso` abre la pestaña Coordinación), en `datos-escenas.js` (645), `KNOWN_ESC` (602), `datos-flujo.js` y `datos-cx-fases.js`.

**Verificado**
- **estadoparcial (caso 20196, 3 vehículos):** la fila del caso dice «En coordinación · 2 de 3 agendados», responsable Andrea Salazar y SLA «6 h»; los riesgos dicen «Visita V1 · 19/10 · 10:00 · Marco Tapia · Agendado», «Visita V2 · 20/10 · 14:00 · Diana Cárdenas · Agendado» y «Sin visita · Inspector por asignar · Por coordinar».
- **estadocompleto:** al agendarse solo el tercer vehículo (V3, 21/10 11:00) el caso pasa a «Agendado», el responsable es Marco Tapia, el SLA cambia a «2 d» y los tres riesgos quedan Agendado con su visita.
- **estadooferta:** el caso sigue «En coordinación · 1 de 3 agendados · Oferta enviada»; el vehículo de la oferta dice «Oferta enviada» y la pestaña Coordinación lo muestra deshabilitado con ese estado.
- **cxestadoparcial (caso 50012 con la conexión simulada):** «En coordinación · 2 de 3 agendados», responsable Andrea Salazar; PRB1212 y PR121A Agendado, PRB1213 Por coordinar («Sin visita»). Con `?fvista=caso`: «Vehículos por coordinar 1 de 3».
- **Acciones de la sesión por la pantalla:** al cancelar la visita V2 de `estadoparcial`, el caso queda «En coordinación · 1 de 3 agendados» y el contador pasa a «2 de 3»; el aviso dice «Visita V2 cancelada». Agendar el tercer vehículo está cubierto por `estadocompleto`.
- **Caso de un solo riesgo:** la regla devuelve el estado y el subestado sin cambios (Registrado, En coordinación, Agendado y Reaperturado, con el riesgo coordinado o no); en la bandeja (bandejaexp) los casos de un riesgo (20152, 20186, 20190) siguen con su estado de siempre y sin subestado.
- **Escenas anteriores** (bandejaexp, bandejaaseg, filtros, cxresponsableobjeto, coord, coordautoinsp, coordmarco, coordfases, coordvehiculoduplicado con `?fpestana=1`, coordcancelavisitas, coordoferta, coordrg, coordvis, cxcoordfases, cxcoordcontacto y coordriesgorg con `?fpestana=1` y `?fdividir=1`) a 1280 × 720 y 1920 × 1080: sin errores de consola, la página no se desplaza y no hay desborde horizontal. Al revisarlas, `cxresponsableobjeto` y `coordriesgorg` arrastraban un subestado que ya no correspondía a su caso; las corregí para que recalculen después de armarlo.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- Con la base y la conexión reales (solo la simulada).
- Por la pantalla: reagendar, cambiar el inspector, ofertar, anular una oferta y enviar un enlace en un caso con varios riesgos; comparten el mismo bloque de `coordAction` que cancelar y agendar, que sí probé. El cambio de inspector abre su pantalla completa, pero no pude terminar el cambio en la prueba automática.
- El efecto del estado del caso y de su responsable sobre el SLA con la conexión real (con la simulada se usa el responsable que entrega la base).
- Un caso con varios riesgos y un enlace de Autoinspección vigente, o con una visita «En curso», más allá de la regla (no hay una escena con esos datos).

**Diferencias**
- En la fila del caso, el subestado va como una línea debajo de «En coordinación»; la cabecera y la vista rápida lo muestran en la misma línea («En coordinación · 2 de 3 agendados»).
- El subestado se omite cuando ningún riesgo está agendado y no hay oferta ni enlace; el contador «N de M» de la pestaña Coordinación solo aparece cuando algún riesgo ya está en una visita.
- Un enlace de autoagendamiento sin respuesta dice «Enlace enviado» pero no cuenta como coordinado; el de Autoinspección vigente sí cuenta.
- Para no tocar el resto del flujo, los estados nuevos de un riesgo se guardan en la sesión como «En coordinación» o «Agendado»; los nombres nuevos se calculan solo para mostrarlos.
- Las escenas de fases (coordfases y las que parten de ella) ahora entregan el caso 50012 «En coordinación · 1 de 3 agendados» y no «Agendado» fijo; `cxresponsableobjeto` y `coordriesgorg` conservan su estado.
- Las escenas nuevas de la sesión usan el caso 20196.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `estadoparcial` | Caso 20196 con V1 y V2 agendados y un vehículo por coordinar: «En coordinación · 2 de 3 agendados», responsable el coordinador y el estado de cada vehículo en la bandeja; `?fvista=caso` abre la pestaña Coordinación |
| `estadocompleto` | Se agenda el tercer vehículo: el caso pasa a «Agendado» y el responsable es el inspector |
| `estadooferta` | Un vehículo en oferta: el caso sigue «En coordinación · 1 de 3 agendados · Oferta enviada» |
| `cxestadoparcial` | Con la conexión simulada: forma de `casos[].riesgos[].estado` y `.visita` y del subestado del caso 50012 |

También abrí bandejaexp, bandejaaseg, filtros, cxresponsableobjeto, coord, coordautoinsp, coordmarco, coordfases, coordvehiculoduplicado, coordcancelavisitas, coordoferta, coordrg, coordvis, cxcoordfases, cxcoordcontacto y coordriesgorg a los dos tamaños.

Tiempo de la etapa: inicio 14/11/2026 23:56 · fin 15/11/2026 00:23 · 27 min

---

## 18/10/2026 · 20:30 — Etapa G-2c7

Las migas de la barra superior ya nunca se superponen, en ninguna pantalla del sistema: ocupan solo el espacio libre entre el borde izquierdo de la barra y el grupo de la derecha, y cuando falta espacio se recortan en el orden pedido. Quedó publicada en la **Versión 228** (la Versión 229 solo completa en este registro la hora de fin). La causa era que «Caso N» es un botón sin recorte dentro de una miga que sí se encogía: su texto se salía de su caja y se montaba sobre la siguiente miga y sobre la campana.

**Qué cambió**
- **Migas (`SIRIUS Back-office.dc.html`):** el `<nav>` ya no se arma con una lista de la plantilla; `crumbsLayout()` lo dibuja a partir de las migas que calcula `renderVals` y vuelve a medir con la barra (`ResizeObserver`), al cambiar el tamaño de la ventana, al abrir o cerrar el menú lateral y al cargar las fuentes. Orden de recorte: 1) la pantalla actual se recorta con «…» y conserva unos 120 px; 2) los intermedios («Solicitudes», «Bandeja») pasan a un botón «…»; 3) «Caso N» queda completo mientras quepa (si ni así cabe, se recorta con «…» hasta unos 64 px y, después, también pasa al menú); con casi nada de espacio todo va al menú, y si ni el «…» cabe no se dibuja nada. Cada elemento recortado muestra su texto completo como título.
- **Botón «…»:** abre, con clic, Enter o Espacio, un menú con los elementos ocultos. Los que son enlaces siguen siéndolo (con el marco de Coordinar visita, «Bandeja» pide la confirmación de salir si hay algo pendiente); los que no lo son («Solicitudes») aparecen como texto sin enlace. Esc lo cierra y devuelve el foco al «…»; flechas arriba y abajo, Inicio y Fin mueven el foco; Tab lo cierra y sigue con la miga siguiente; un clic fuera también lo cierra.
- **Grupo de la derecha:** no se recorta. Si el espacio libre de las migas (con «Prueba conectada» completa) es menor de 300 px, «Prueba conectada» pasa a ser solo el punto de color, con su texto como título y como nombre accesible (`role=img`).
- **Escena nueva `migasangostas`** (`?fmenu=1` con el menú lateral expandido), en `datos-cx-fases.js`, `datos-escenas.js` (641) y `KNOWN_ESC` (598). `sirius-coordinar.js`: el clic automático sobre «Bandeja» de `coordsalir` busca `nav button[data-mg-i]`, y el preset `contacto.menu` expande el menú lateral.

**Verificado**
- **Superposición y desplazamiento lateral:** migasangostas, coordmarco, bandejaexp, un caso (coordrg, caso 20195) y Ciudades y zonas (zonas), a 1024 × 720, 1280 × 720, 1330 × 720 y 1920 × 1080, con el menú lateral contraído y expandido (más 1180 × 720 en las dos de Coordinar): 50 combinaciones, sin superposición entre migas ni con el grupo de la derecha, sin que el `<nav>` desborde, sin desplazamiento horizontal y sin errores de consola.
- **Cómo queda (migasangostas y coordmarco):** a 1024 contraído, «… › Caso 50012 › Coordinar visita V2»; a 1024 expandido, «… › Coordinar visita V2»; a 1180 contraído, las cuatro migas con la pantalla actual recortada; a 1330 contraído, las cuatro completas; a 1330 expandido, las cuatro con «Coordinar visita…» recortada y su texto completo como título. «Prueba conectada» pasa a punto a 1024 y se ve con texto a 1280 y más.
- **Teclado (1024 contraído):** Tab llega al «…» después del menú lateral; Enter abre el menú con el foco en «Solicitudes» (sin enlace) y «Bandeja»; Esc lo cierra con el foco de vuelta en el «…» sin salir de Coordinar; Espacio lo abre; Tab lo cierra y sigue en «Caso 50012»; el clic fuera lo cierra; Enter en «Bandeja» va a la bandeja.
- **Confirmación de salir:** con `?fsalir=0` a 1024, «Bandeja» desde el menú «…» pide «Tienes una coordinación sin agendar. ¿Salir?» con el foco en «Seguir coordinando»; Esc se queda y el foco vuelve al «…». A 1330, la escena `coordsalir` sigue abriendo la confirmación sola.
- **Escenas anteriores** (coordmarco, coordsalir, coordriesgorg, coordfases, coordautoinsp, coordcancelar, coordvehiculoduplicado, coordrg, cxcoordfases, cxcoordcontacto y bandejaexp) a 1280 × 720 y 1920 × 1080: la página no se desplaza, no hay desborde horizontal ni errores, y la capa de Coordinar sigue terminando en el borde inferior de la ventana.
- Con anchos extremos (900, 760 y 640 px, fuera de lo pedido) las migas siguen sin superponerse: se reducen al «…» y, si no cabe nada, desaparecen.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- Con la base y la conexión reales (solo la simulada).
- La lectura del menú «…» con un lector de pantalla.
- Otros usuarios o roles con nombres más largos que «Andrea Salazar · Coordinador de inspecciones» (el cálculo se hace con el ancho real del grupo, pero solo probé ese).
- Anchos menores de unos 900 px con el menú lateral expandido: la barra completa deja de caber en la ventana (el grupo de la derecha no se recorta, como se pidió) y aparece desplazamiento lateral de la página; es anterior a esta etapa.

**Diferencias**
- «Solicitudes» no es un enlace en las migas (ya no lo era); en el menú «…» aparece como texto sin enlace, con el título «Indica dónde estás; no tiene enlace».
- Para que el foco del botón no se recorte, el `<nav>` tiene 6 px de relleno vertical y 4 px lateral compensado con margen; la barra sigue midiendo 48 px.
- El punto de «Prueba conectada» se decide con el espacio libre de las migas (menos de 300 px), no con el ancho de la ventana.
- Las migas ya no son una lista de la plantilla: las dibuja código (`crumbsLayout`), y el botón «Bandeja» del marco se busca como `nav button[data-mg-i]`.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `migasangostas` | Coordinar visita de 50012 para probar a 1024, 1180 y 1330 × 720: migas sin superposición y «…» con el menú «Solicitudes» y «Bandeja»; `?fmenu=1` con el menú lateral expandido |

También abrí coordmarco, bandejaexp, coordrg y zonas (Ciudades y zonas) a los cuatro tamaños, con el menú contraído y expandido.

Tiempo de la etapa: inicio 14/11/2026 23:26 · fin 14/11/2026 23:47 · 21 min

---

## 18/10/2026 · 20:30 — Etapa G-2c6

Coordinar visita ya se muestra dentro del marco del sistema —barra superior, migas y menú lateral— y un riesgo queda en una sola visita abierta también en Ramos Generales (DEC-237). Quedó publicada en la **Versión 226** (la Versión 227 solo completa en este registro la hora de fin). Probé las 3 escenas nuevas y las de Coordinación a 1280 × 720 y 1920 × 1080: con la capa abierta, la página no se desplaza, no hay desborde horizontal y la consola no muestra errores.

**Qué cambió**
- **Marco del sistema (`sirius-coordinar.js` v1.3):** la capa de Coordinar visita y de «Contacto del caso» queda debajo de la barra superior de siempre (notificaciones, «Prueba conectada», usuario y rol; sus paneles se abren por encima) y al lado del menú lateral, que se contrae a íconos al entrar y se vuelve a abrir al salir si estaba abierto. No muestra las pestañas del caso: la barra de fases es su navegación y «Historial del caso» da el contexto. Se agregó la flecha «Volver al caso». La página de atrás queda inerte, de modo que con Tab se llega al menú, las migas, notificaciones, usuario y rol, y luego a la capa.
- **Migas (`SIRIUS Back-office.dc.html`):** «Solicitudes › Bandeja › Caso N › Coordinar visita VN» (o «… › Contacto del caso»); «Bandeja» y «Caso N» son enlaces.
- **Salir sin perder trabajo:** por las migas, el menú, la flecha, «Salir» o «Listo», si hay algo pendiente (Lugar o Inspector y horario con cambios desde la primera interacción, una nota sin registrar, una oferta o un enlace a medio preparar) sale «Tienes una coordinación sin agendar. ¿Salir?» con «Seguir coordinando» (foco por defecto; Esc también) y «Salir sin guardar». Los intentos ya registrados se conservan siempre. Sin nada pendiente, sale sin preguntar. La capa informa su estado en `window.SIRIUS_COORD_MARCO`.
- **Un riesgo, una sola visita abierta, en todos los ramos:** en la fase de riesgos, en «Dividir visita», en la pestaña Coordinación (`Coordinacion.dc.html`) y en la comprobación de la sesión (`agendar`, `ofertar`, `reagendar` y `dividir`), con el mismo texto de Vehículos: «<riesgo> · en V1», deshabilitado, con título «<riesgo> ya está en la visita V1 (Agendada)». La base simulada ya lo rechazaba para todos.
- **Escenas nuevas:** `coordmarco`, `coordsalir` (`?fsalir=0|limpio`) y `coordriesgorg` (`?fpestana=1`, `?fdividir=1`), en `datos-cx-fases.js`, `datos-escenas.js` (640) y `KNOWN_ESC` (597).

**Verificado**
- **coordmarco (1280 × 720 y 1920 × 1080):** migas «Solicitudes › Bandeja › Caso 50012 › Coordinar visita V2», menú contraído, capa debajo de la barra (672 de 720 y 1032 de 1080 de alto), sin desplazamiento de la página.
- **coordsalir:** la escena hace clic en «Bandeja» con una nota sin registrar y sale la confirmación con el foco en «Seguir coordinando»; Esc y Enter en «Seguir» se quedan; Tab cicla entre los dos botones; Enter en «Salir sin guardar» va a la bandeja. Con `?fsalir=limpio` sale directo. Con `?fsalir=0`, el menú «Agenda», «Salir», la flecha y «Caso 50012» piden confirmación y el foco vuelve al botón de origen.
- **Teclado:** Tab recorre menú (Expandir, Inicio, Solicitudes, Agenda, Reportes, Administración), migas, Notificaciones, Usuario, «Volver al caso», «Historial» y el contenido; la página de atrás no recibe foco.
- **coordriesgorg:** «Bodega principal · en V1» queda deshabilitada (`aria-disabled`, con título) y «Oficinas administrativas» se puede elegir; en la pestaña se ven las filas deshabilitadas; «Dividir visita» abre el formulario; la base simulada rechaza un duplicado y acepta reagendar V1 y agendar V2; con `onAction`, dividir deja V1 [R1] y V2 [R2]. En el caso de sesión 20195 (coordrg), ofertar un riesgo ya agendado se rechaza con «… ya está en la visita V9 (Agendada)».
- **Escenas relacionadas a ambos tamaños (40 en cada uno):** coordfases (3 variantes), coordautoinsp, coordcancelar, coordvehiculoduplicado, coordrg, coordcontacto, coordoferta, coordofertamarcar, coordlugarotraciudad, coordmodalidades, coordfechahora, coordvirtual, coordenlaceauto, coordeditarcontacto, coordotronumero, coordcancelavisitas, cxcoordfases, cxcoordcontacto, cxlugar, lugar*, coordvis, coord, cxcoordins, cxcoordcambiar, cxvisitacancelar, cxresponsableobjeto y bandejaexp: página sin desplazar, sin desborde horizontal y sin errores.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- Con la base real y la conexión real (solo la simulada).
- La lectura de la confirmación con un lector de pantalla.
- El envío completo de «Dividir visita» desde la pantalla (se probó el formulario, `onAction` y la base).

**Diferencias**
- La capa pasó de diálogo modal (`role=dialog`) a región; la página de atrás queda inerte.
- El menú lateral se contrae por programa y se vuelve a abrir al salir.
- «Pendiente» se calcula desde la primera interacción con la capa (cambios en lugar, inspector, fecha, hora, dirección, observaciones, motivo, canal o validez), más la nota y la oferta; «Listo» también pregunta si hay algo pendiente.
- Una visita Realizada sigue contando como ocupada en Coordinación («· en V1»), pero no en la comprobación `vehDup` de la sesión.
- «Reagendar» en Ramos Generales sigue mostrando solo los riesgos de la propia visita.
- En `coordsalir`, el clic en «Bandeja» es automático.

**Escenas**

| Escena | Qué muestra |
|---|---|
| `coordmarco` | Coordinar visita (Inspector y horario) dentro del marco: barra, migas y menú contraído |
| `coordsalir` | Nota sin registrar y clic en «Bandeja»: confirmación; `?fsalir=0` solo la nota; `?fsalir=limpio` sale directo |
| `coordriesgorg` | Ramos Generales con 2 ubicaciones, la «Bodega principal · en V1» deshabilitada; `?fpestana=1` en la pestaña, `?fdividir=1` con «Dividir visita» |

También abrí coordfases, coordautoinsp, coordcancelar, coordvehiculoduplicado y coordrg a ambos tamaños.

Tiempo de la etapa: inicio 14/11/2026 22:03 · fin 14/11/2026 22:24 · 21 min

---

## 18/10/2026 · 20:30 — Etapa G-2c5

La etapa G-2c5 quedó publicada en la **Versión 224**; la Versión 225 solo completa en este registro la hora de fin. El responsable de un caso ya es siempre texto y los filtros de la bandeja no dejan de dibujarse por un valor inesperado: con el 50012 de la conexión simulada (Agendado, sin responsable y con el inspector como objeto) la bandeja se dibuja y dice «Valeria Cevallos». Probé la escena nueva, las que ya existían de la bandeja y las de Coordinación a 1280 × 720 y 1920 × 1080, sin el error de `renderVals`.

**Qué cambió**
- **`datos-flujo.js` (v1.4):** nueva `F.texto(v)` (texto, o el `nombre` de un objeto, o vacío). `F.responsable` devuelve siempre texto: si el inspector de la visita o `caso.inspector` es un objeto, usa su `nombre`; si no hay nombre, sigue con la regla siguiente («Por asignar»). Lo que el flujo no resuelve queda en «—».
- **Armado de cada caso:** `finish` (y por eso `caseById`) deja `responsable` siempre como texto; `responsableBase` y `respFlujo` se convierten a su nombre si no eran texto. Esto cubre las reasignaciones, `respFlujo`, la bandeja compartida y el responsable que informa la conexión. Al cargar los casos de la conexión, un responsable que no es texto se convierte a su nombre antes de que nadie lo use; el inspector de `visitasBase` también pasa a texto.
- **Filtros de la bandeja:** las listas de Sucursal y Responsable convierten cada valor a texto antes de ordenar con `localeCompare` (objeto → su nombre) y descartan los vacíos (y «—» en Responsable). Si encuentran un valor que no era texto, avisan una sola vez en la consola: «[SIRIUS] Casos con sucursal que no es texto: [ids]» o «[SIRIUS] Caso con responsable que no es texto: id, valor».
- **Otros `localeCompare`:** revisé los 19 del proyecto. Toqué `DataTable` (al ordenar por columna, un objeto se ordena por su nombre y no por «[object Object]») y `sirius-enlace.js` (`proximos` ordenaba `a.at` sin convertir). El resto ordena catálogos, ciudades, marcas, provincias o fechas que ya se pasan por `String(...)` o que no vienen de los casos.
- **Escena `cxresponsableobjeto`** (`?fsuc=1`).

**Verificado**
- **Causa reproducida:** con los archivos de antes de esta etapa y la escena nueva, la pantalla queda sin dibujar con «SIRIUS Back-office.renderVals(): a.localeCompare is not a function». Con los archivos nuevos se dibuja.
- **cxresponsableobjeto (1280 × 720 y 1920 × 1080):** la fila 50012 dice «Agendado · Valeria Cevallos»; el filtro de Sucursal trae Todos y Quito; el de Responsable trae Todos, Andrea Salazar y Valeria Cevallos; la consola muestra «[SIRIUS] Caso con responsable que no es texto: 50012, {"nombre":"Valeria Cevallos","tipo":"agencia","agencia":"Eurosurvey S.A."}» una sola vez, aunque la pantalla se dibuje varias veces. Sin errores de consola y sin desplazamiento horizontal.
- **Ordenar por la columna Responsable** (clic dos veces): Valeria Cevallos queda al final en ascendente y primero en descendente, sin error.
- **`?fsuc=1`** (otro caso con la sucursal como objeto): la bandeja se dibuja, el filtro de Sucursal sigue con Todos y Quito, y la consola avisa «[SIRIUS] Casos con sucursal que no es texto: [50007]» una vez, además del aviso del responsable.
- **Escenas ya existentes, a 1280 × 720 y 1920 × 1080:** bandejaexp, bandejaaseg, filtros, cpersfiltro, flujoportomar, flujoacciones, flujotomar, calrgbandeja, cxlimpio, coordvis, coord, coordcancelavisitas, coordvehiculoduplicado, lugarbuscar, cxcoordfases, cxlugar, autorecibida, reasignar, inicio y coordfases: sin errores de consola, sin avisos nuevos y sin desplazamiento horizontal.
- `sirius-conexion.js` queda con su línea mínima. La escena nueva está en `datos-escenas.js` (637) y en `KNOWN_ESC` (594).

**No verificado**
- La conexión real: probé con la simulada. Con la asesoría ya corregida, el responsable llega como nombre y estos avisos no deberían salir.
- Otras pantallas con un objeto como responsable o inspector (Agenda, Informes por completar, Monitor): no las recorrí con la escena nueva; el responsable que ven ya es texto porque sale de `finish`.
- El caso de un objeto sin `nombre` (queda «Por asignar» o «—»): lo cubre el código, pero no lo abrí en pantalla.

**Diferencias**
- **Avisos de la consola:** además de lo pedido, el aviso del responsable sale cuando el flujo tuvo que convertir un inspector que llegó como objeto, aunque la lista del filtro ya vea texto; es el caso del 50012, que si no el aviso nunca saldría. Una visita cancelada no avisa.
- **Responsable vacío:** si el flujo no encuentra a nadie, ahora dice «—» (antes quedaba vacío) y ese valor no entra en el filtro.
- **Escena:** abre con los filtros de la bandeja limpios; sin eso el filtro por defecto (Responsable = Andrea Salazar) deja fuera al 50012. Para dejarlo en Agendado, los 3 vehículos van en una sola visita V1.
- **`localeCompare` tocados:** `SIRIUS Back-office` (listas de Sucursal y Responsable), `DataTable` (orden de columnas) y `sirius-enlace.js` (`proximos`). Revisados sin cambios: `sirius-enlace.js` (otras dos, ya con `String`), `sirius-lugar.js` y `sirius-zonas.js` (provincias y ciudades), `sirius-solicitud-equipos.js` y `NuevaSolicitud` (marcas), `CalificacionRG` e `InformeRG` (ids de fotos, con `String`), `MotoresIA` (alcance del motor), `Formularios` (fecha de la versión) y `ConfiguracionGeneral` (fecha del historial, con `String`).

**Escenas**

| Escena | Qué muestra |
|---|---|
| cxresponsableobjeto | Con la conexión simulada, 50012 en Agendado sin responsable y con el inspector como objeto: la bandeja dice «Valeria Cevallos», los filtros de Sucursal y Responsable se abren y la consola avisa una vez (`?fsuc=1`: otro caso con la sucursal como objeto) |

También abrí bandejaexp, bandejaaseg, filtros, cpersfiltro, flujoportomar, flujoacciones, flujotomar, calrgbandeja, cxlimpio, coordvis, coord, coordcancelavisitas, coordvehiculoduplicado, lugarbuscar, cxcoordfases, cxlugar, autorecibida, reasignar, inicio y coordfases.

Tiempo de la etapa: inicio 14/11/2026 21:34 · fin 14/11/2026 21:49 · 15 min

---

## 18/10/2026 · 20:30 — Etapa G-2c4

Publiqué la etapa G-2c4 (Versión 222 con los archivos; la Versión 223 solo completa en este registro la hora de fin). Cancelar la solicitud ahora cancela también las visitas, un vehículo ya no puede estar en dos visitas abiertas, la oferta tiene «Marcar todos» y «Desmarcar todos», y revisé que la búsqueda de direcciones no filtre por la ciudad del caso (DEC-237). Las 4 escenas nuevas, coordcancelar, coordoferta y coordfases abren sin errores y sin desplazar la página a 1280 × 720 y 1920 × 1080.

**Qué cambió**
- **Cancelar la solicitud (sesión y conexión):** cancela todo lo abierto del caso.
  - Las visitas Por agendar, Buscando inspector, Oferta enviada, Agendada, En camino y Sin respuesta pasan a «Cancelada», con el motivo. La tarjeta dice «Cancelada · motivo» y no tiene acciones.
  - Las ofertas abiertas se retiran y los enlaces vigentes del caso (autoagendamiento y autoinspección) se anulan.
  - La banda roja agrega «Visitas canceladas: V1, V2.» y el recuadro avisa, antes de confirmar, qué visitas también se cancelan.
  - Con una visita En curso o Por sincronizar el recuadro muestra «Hay una visita en curso: espera a que termine o cancélala con el inspector.» y el botón no cancela. La base responde el mismo texto con `{ ok: false }`.
  - Con la conexión, al confirmar se vuelven a leer las visitas de la base (vienen «Cancelada»). `casos[].cancelacion` trae `{ motivo, detalle, por, hora }` y se ve en la pestaña Coordinación («Cancelado por … · fecha») y en la banda roja. Con `{ ok: false }` todo vuelve atrás.
- **Un vehículo, una sola visita abierta:**
  - En la línea de vehículos de Coordinar visita, el que está en otra visita abierta sale deshabilitado como «PRB1212 · en V1», con el título «PRB1212 ya está en la visita V1 (Agendada)». Al reagendar esa visita, sus vehículos sí se eligen.
  - En «Vehículos por coordinar» aparecen también, deshabilitados, los vehículos que ya están en una visita (el contador sigue contando solo los libres). Sin ninguno libre, «Crear visita con los seleccionados» dice: «Todos los vehículos ya están en una visita: no queda ninguno libre para una visita nueva».
  - `agendarVisita` y `ofertarVisita` llevan `riesgos` (ids del caso: «50012-V1»…). La base rechaza el duplicado con «PRB1212 ya está en la visita V1 (Agendada)» y se muestra tal cual.
  - Una causa que encontré: con la conexión, las visitas «Oferta enviada» no contaban como abiertas, y la línea de vehículos no marcaba los ocupados. Ahora cuenta toda visita que no esté Cancelada.
- **Oferta:** «Marcar todos» y «Desmarcar todos» arriba de los inspectores, con «N de M marcados». Por defecto siguen marcados los que cubren el lugar. «Enviar oferta a N» se deshabilita sin inspectores marcados y su título dice «Marca al menos un inspector».
- **Lugar:** no encontré nada en el prototipo que filtre las sugerencias por la ciudad del caso (revisé `SiriusUbicacion`, la fase Lugar y `SiriusLugar`): la ciudad solo ordena primero las de esa ciudad. Un resultado de otra ciudad cambia provincia, ciudad y zona sin pedir confirmación. Agregué una salvaguarda: si la conexión devuelve un resultado sin ciudad, se toma la que nombra el texto («…, Guayaquil») y solo al final la del caso.

**Verificado**
- **coordcancelavisitas:** cancelar deja V1 y V2 «Cancelada · El cliente desiste de la póliza» y la banda dice «Visitas canceladas: V1, V2.». Con `?fconf=0` se ve el recuadro con las visitas abiertas que también se cancelan. Con `?fpaso=tarjetas` la pestaña muestra las dos tarjetas «Cancelada · motivo» sin acciones y la causa en «Intentos de contacto». Con `?fcurso=1` aparece el aviso con «Visita V1 · En curso» y no se envía nada a la base.
- **Con la conexión simulada:** `cancelarSolicitud` sale con `{ caso, motivo, detalle }`; con `?cxok=0` las visitas vuelven a «Agendada» y «Oferta enviada» y se muestra «La base rechazó la acción (prueba)». Llamé a la base directamente con una visita En curso y responde el aviso sin cambiar nada.
- **Sesión (sin conexión, caso 20196 con 3 vehículos):** cancelar deja las 2 visitas «Cancelada · Solicitud duplicada», quita la oferta y revoca el enlace vigente. Con una visita En curso responde `{ ok: false }` con el aviso y las visitas no cambian. Agendar u ofertar un vehículo que ya está en otra visita, o reagendar sumándolo, devuelve «PBA4521 ya está en la visita V1 (Agendada)» o el equivalente.
- **coordvehiculoduplicado:** en una visita nueva, «PRB1212 · en V1» sale deshabilitado (`aria-disabled`) y un clic no lo marca; con `?freag=1` PRB1212 se puede elegir; con `?fpestana=1` la casilla de «Vehículos por coordinar» sale deshabilitada. Con `?frech=1` (agendar) y `?frech=oferta` (ofertar) la base responde «PRB1212 ya está en la visita V1 (Agendada)» con `riesgos` ["50012-V1","50012-V2"] en la solicitud.
- **coordofertamarcar:** por defecto quedan 4 de 6 marcados (los que cubren); con clics reales, «Desmarcar todos» deja 0 de 6 y «Enviar oferta a 0» deshabilitado; «Marcar todos» marca 6; marcar uno habilita «Enviar oferta a 1». Con los 6 marcados, enviar muestra «Oferta enviada a 6».
- **coordlugarotraciudad:** con la escena abierta se ve Guayaquil (Guayas), zona Centro y las zonas de Guayaquil. Escribiendo «Kennedy» en la búsqueda de la escena `?fantes=1` (50012, Quito) las sugerencias traen Guayaquil, y buscar «Malecón 2000» cambia provincia, ciudad y zona (Quito · zona Sur → Guayaquil · zona Centro) sin confirmación.
- **Tamaños:** las 4 escenas (con sus variantes), coordcancelar, coordoferta y coordfases, a 1280 × 720 y 1920 × 1080: la pantalla ocupa exactamente la ventana, sin desplazamiento de página, sin errores de consola y sin «undefined» ni «[object Object]». Además revisé a 1280 × 720 otras 25 escenas relacionadas (Contacto, modalidades, fecha y hora, autoinspección, cxcoordfases con `?fof=1` y `?cxok=0`, lugar, agenda y cxvisitacancelar, entre otras): sin errores.
- `sirius-conexion.js` queda con su línea mínima. Las 7 escenas existen en `datos-escenas.js` (636 en total) y en `KNOWN_ESC` (593).

**No verificado**
- Las variantes `?frech=1` y `?frech=oferta` de coordvehiculoduplicado solo a 1280 × 720 (a 1920 × 1080 abrí la escena base, `?freag=1` y `?fpestana=1`).
- La base real y la búsqueda de direcciones con un servicio real de mapas: usé la conexión simulada y el diccionario de prueba. Revisa a mano, con tu conexión, que `buscarDireccion` devuelva `ciudad` en cada resultado (coordlugarotraciudad).
- Que el aviso de visita En curso salga igual con estados reales de la base como «Por sincronizar» o una autoinspección que el cliente está haciendo: lo probé con «En curso» (coordcancelavisitas `?fcurso=1`).
- El tooltip visual al pasar el mouse sobre «PRB1212 · en V1» (comprobé el título, no cómo se pinta el tooltip) y un lector de pantalla (coordvehiculoduplicado).
- Con la base real, que cancelar anule también los enlaces en la base: el simulador solo cambia el estado del enlace de la visita; en SIRIUS los enlaces se revocan en el motor de enlaces.

**Diferencias**
- **Lo que cuenta como abierto:** «Oferta enviada» (SIRIUS) equivale a «Buscando inspector» (base). La tarjeta y el título del vehículo dicen «Oferta enviada»; el mensaje de la base simulada dice «Buscando inspector». Mi base simulada ahora guarda así las ofertas nuevas y sus `riesgos`; antes las guardaba «Por agendar» sin riesgos.
- **Autoinspección en curso:** una autoinspección que el cliente está haciendo («En curso por el cliente») también impide cancelar la solicitud, igual que «En curso» y «Por sincronizar». No venía en tu definición; dime si prefieres que solo bloqueen las dos primeras.
- **Dividir visitas (solo ramos):** para cumplir la regla, ahora se envía primero la visita de origen con los riesgos que le quedan y luego la nueva; antes iba al revés. Con la conexión, si falla la primera no se envía la segunda.
- **Un caso cancelado:** su pestaña ya no lista «Vehículos por coordinar» como «Por coordinar» (antes, al quedar sin visitas abiertas, volvían a salir). Dice «Caso cancelado: ya no hay vehículos por coordinar.».
- **Solo vehículos:** la regla se aplica a casos de Vehículos; en Ramos Generales no cambió nada.
- **Nombre del campo:** `casos[].cancelacion` usa `hora` (mi simulador usaba `en`); SIRIUS acepta también `obs`, `by` y `at` de la sesión.
- **Rechazo de la base:** como en etapas anteriores, tras un rechazo al agendar u ofertar la pantalla de Coordinación vuelve a empezar y el mensaje se muestra como aviso; no queda el formulario abierto con el texto.

**Escenas**

| Escena | Qué muestra |
|---|---|
| coordcancelavisitas | V1 Agendada y V2 con oferta; cancelar la solicitud las deja «Cancelada · motivo» y retira la oferta (`?fconf=0`: el recuadro; `?fpaso=tarjetas`: las tarjetas; `?fcurso=1`: el aviso de visita En curso) |
| coordvehiculoduplicado | PRB1212 en la V1: «PRB1212 · en V1» deshabilitado (`?freag=1`: reagendar la V1; `?fpestana=1`: la pestaña; `?frech=1` y `?frech=oferta`: el rechazo de la base) |
| coordofertamarcar | «Marcar todos» y «Desmarcar todos» de la oferta (`?fmarcar=ninguno`: sin marcar; `?fmarcar=todos`: todos) |
| coordlugarotraciudad | Desde 50012 (Quito), «Malecón 2000» cambia a Guayaquil, provincia, ciudad y zona (`?fantes=1`: el lugar de la solicitud) |

También abrí coordcancelar, coordoferta, coordfases (y sus variantes de Lugar y Horario), coordcontacto, coordotronumero, coordenlaceauto, coordeditarcontacto, cxcoordcontacto (con `?fpaso=cancelar` y `?cxok=0`), coordautoinsp, coordvirtual, coordmodalidades, coordfechahora, cxcoordfases (con `?fof=1` y `?cxok=0`), coordvis, coordauto, coord, coordchoque, cxvisitacancelar, cxcoordcambiar, cxcoordins, cxvisitariesgos, lugarbuscar, lugarfuera y agendajornada.

Tiempo de la etapa: inicio 14/11/2026 20:50 · fin 14/11/2026 21:22 · 32 min

---

## 18/10/2026 · 20:30 — Etapa G-2c3

Publiqué la etapa G-2c3 (Versión 220 con los archivos; la Versión 221 solo completa en este registro la hora de fin). La fase Contacto de «Coordinar visita» quedó como en la maqueta G-1f (DEC-237). A la izquierda está «Llamada», con a quién se llama, el cronómetro, la nota y los 6 resultados de un clic; a la derecha, los intentos, el «Historial del caso» y el enlace de autoagendamiento. La cancelación de la solicitud se hace en el mismo lugar y deja el caso bloqueado con una banda roja.

**Qué cambió**
- **«Llamar a»:** una lista con tres opciones.
  - **Contacto para la coordinación:** Nombre, Celular (WhatsApp) y Correo, con «Editar contacto». Usa las mismas reglas y se guarda con la visita, como antes, y el formulario incluye los campos de contacto parametrizables.
  - **Contacto en sitio:** el de la fase Lugar. Ahora es propio: por defecto es el de la coordinación, se guarda en la visita como `sitio` y va a la base en `direccion.quien` y `direccion.cel`.
  - **Otro número:** celular de 10 dígitos que empieza con 0, nombre y relación. No se guarda como contacto del caso; con un celular mal escrito aparece «El celular debe tener 10 dígitos y empezar con 0.» y «Llamar» queda deshabilitado.
- **Llamada:**
  - Debajo de la lista, el número grande y «Llamar» con la etiqueta «vía Genesis».
  - Durante la llamada hay cronómetro, «Colgar» y el guion. El recuadro del contacto se oculta mientras dura, para que los resultados se vean sin desplazar a 1280 × 720.
- **«Nota del intento» y «Registrar el resultado»:**
  - 6 botones de un clic: Contestó, No contestó, Buzón de voz, Número equivocado, Pidió llamar luego y Prefiere agendar solo (teclas 1 a 6).
  - El intento guarda la nota, a quién se llamó (nombre, relación y número) y la duración, y queda en los intentos y en el historial del caso.
  - Un resultado distinto de «Contestó» cuelga la llamada. Sin contacto, el pie ofrece también «Siguiente caso».
  - Se eliminó el formulario aparte «Registrar intento de contacto».
- **«Cancelar la solicitud…»** (botón con borde rojo; reemplaza «Cancelar por coordinación»):
  - Abre un recuadro con el aviso «Todo el caso queda Cancelado y se avisa a quien la solicitó.», el motivo y el detalle (10 caracteres o más).
  - Al confirmar aparece la banda roja «Caso cancelado · motivo. Ya no se puede coordinar.». El resto de la pantalla queda bloqueado e inerte y el pie ofrece «Siguiente caso».
  - Queda en los intentos y en el historial.
  - Usa la regla que ya existía: el permiso de cancelar en Registrado, En coordinación, Reaperturado o Enlace caducado; el estado Cancelado; y el aviso al Ejecutivo comercial.
- **Catálogo «Motivos de cancelación»:** nuevo en Catálogos (grupo Caso, usado en Coordinación), con los valores iniciales El cliente desiste de la póliza, La póliza no se emitirá, Vehículo vendido o dado de baja, Solicitud duplicada, Datos del cliente incorrectos y Otro. No existía un catálogo de motivos de cancelación.
- **A la derecha:**
  - «Intentos de contacto (N)», con fecha, resultado, duración, quién, a quién se llamó y la nota.
  - El botón «Historial del caso».
  - El recuadro «Enlace de autoagendamiento»: canal (WhatsApp, SMS o correo, «vía Genesis»), «Enviar a» (las mismas tres opciones, o el correo si el canal es Correo), estado del envío y «Enviar de nuevo». Se destaca en ámbar con N intentos sin respuesta (No contestó, Buzón de voz o Número equivocado) o con «Prefiere agendar solo».
  - Con Autoinspección, en lugar del recuadro: «El enlace de autoinspección se envía en la fase siguiente. No aplica el autoagendamiento.».
- **Configuración general › Agenda:** nuevo parámetro «Intentos sin respuesta para sugerir el enlace de autoagendamiento», de 1 a 10 y con valor inicial 3. Pide motivo, queda en el historial y, con la conexión, se publica como parte de `SIRIUS_AGENDA` (nuevo `sirius-intentos.js`).
- **Campos reubicados:**
  - «Observaciones para el inspector» pasa a la fase Lugar, debajo de la referencia.
  - «Indicaciones para el contacto» pasa a la fase Enlace de autoinspección, con «Enviar a» igual al de Contacto.
  - Ambos se ven en la tarjeta de la visita y viajan a la base.
- **«Historial del caso»:**
  - Hay un botón en la cabecera de Coordinar visita y otro en Contacto.
  - Abren un cajón con la misma cronología de la pestaña Historial y los filtros Todo, Contacto, Visitas y Estado, con su cantidad.
  - Se cierra con Esc o con ✕, y el foco vuelve al botón.
- **Atajos:** solo en la fase Contacto y fuera de los campos. L llama o cuelga y 1 a 6 registran el resultado. Siguen Ctrl+Enter y Alt+← / Alt+→.
- **Pestaña Coordinación:** los botones pasan a «Llamar y registrar intento» y «Cancelar la solicitud…» y abren Coordinar visita en Contacto. Si no hay riesgos por coordinar, se abre «Contacto del caso», solo con la fase Contacto. La lista de intentos de la pestaña muestra a quién y la duración.
- **Con la conexión:**
  - `intentoContacto { caso, medio: 'Llamada', resultado, obs (la nota), destino: { tipo ('coordinacion' | 'sitio' | 'otro'), nombre, numero, relacion }, duracionSeg } → { ok, mensaje }`.
  - `enviarEnlace` con `{ canal, destinatario: { tipo, nombre, numero } }` o, por correo, `{ tipo, nombre, correo }`.
  - Nueva `cancelarSolicitud { caso, motivo, detalle } → { ok, mensaje }`.
  - Con `{ ok: false }` todo vuelve atrás: el intento, la nota, el enlace o la cancelación; y se muestra el mensaje.

**Verificado**
- **Sin desplazar la página y sin errores, a 1280 × 720 y 1920 × 1080:**
  - Las 6 escenas nuevas y sus variantes. Coordinar visita mide lo mismo que la ventana y el pie queda en el borde inferior.
  - coordfases (Contacto, `?ffase=lugar` y `?ffase=horario`), coordautoinsp y coordvirtual.
  - También coord, coordchoque, coordauto, coordvis, coordrg, coordcxmoto, envioenlace, enlaceagenda, cxvisitaenlace, cxvisitacancelar, cxcoordins, cxcoordpasado, cxcoordcambiar, cxcoordmismo, cxcoordjornada, cxvisitariesgos, cxnumerocruce, coordmodalidades, coordfechahora, coordoferta, cxcoordfases, lugarbuscar y lugarfuera.
- **coordcontacto:**
  - Llamada al contacto para la coordinación con cronómetro y guion.
  - Intento «16/10/26 · 13:40 · Contestó · 1:36 · A Fernanda Prueba (contacto para la coordinación) · 0990000012» con la nota.
  - Con `?fhist=1`, el cajón muestra Todo (7), Contacto (3), Visitas (1) y Estado (3).
- **coordotronumero:**
  - Jorge Pillajo (Chofer) · 0991234567: «No contestó · 0:23» cuelga, y el pie ofrece «Siguiente caso».
  - Con `?fnum=9`, el error del celular aparece y «Llamar» queda deshabilitado.
- **coordenlaceauto:** con 3 intentos sin respuesta el recuadro queda en ámbar («3 intentos sin respuesta: envía el enlace para que agende solo.»). Con `?fenviar=1` se envía por WhatsApp al chofer («Enviado por WhatsApp a Jorge Pillajo (Chofer) · 0991234567») y deja de estar destacado.
- **coordcancelar:**
  - Aparecen la banda roja «Caso cancelado · El cliente desiste de la póliza. Ya no se puede coordinar.» y el pie «Caso cancelado · … · Siguiente caso».
  - El resto queda bloqueado (`inert`) y la cancelación aparece primera en los intentos.
  - Con `?fconf=0` se ve el recuadro con el motivo y el detalle.
- **coordeditarcontacto:** el celular pasa de 0990000012 a 0987654321 en el contacto, en «Llamar a», en «Enviar a» y en el número grande. Con `?fedit=1` se ve el formulario con «Listo».
- **cxcoordcontacto:**
  - `intentoContacto { caso: '50012', medio: 'Llamada', resultado: 'Contestó', obs: 'Confirma la visita el lunes en la mañana.', destino: { tipo: 'coordinacion', nombre: 'Fernanda Prueba', numero: '0990000012', relacion: '' }, duracionSeg: 62 }`.
  - Con `?fpaso=enlace`: `enviarEnlace { caso, canal: 'WhatsApp', destinatario: { tipo: 'otro', nombre: 'Jorge Pillajo', numero: '0991234567', relacion: 'Chofer' }, modalidad: 'Presencial', tipo: 'Autoagendamiento' }`.
  - Con `?fpaso=cancelar`: `cancelarSolicitud { caso: '50012', motivo: 'El cliente desiste de la póliza', detalle: '…' }`.
  - Con `?cxok=0`, en los tres casos se ve «La base rechazó la acción (prueba)»: el intento no queda y la nota vuelve, el enlace no queda enviado, y la cancelación no se aplica y el recuadro vuelve con lo escrito.
- **Teclado** (coordfases):
  - L inicia la llamada.
  - Un 1 escrito dentro de la nota no registra nada.
  - Fuera de los campos, 2 registra «No contestó» y cuelga; L y 1 registran «Contestó» sin colgar; L cuelga.
  - Esc cierra el historial.
  - Ctrl+Enter pasa a Lugar y, en Inspector y horario, agenda.
- **Campos reubicados:**
  - «Observaciones para el inspector» se ve en Lugar; en Virtual guiada, en Inspector y horario. Al agendar sale en `agendarVisita.observaciones` («Llamar 10 minutos antes de llegar; el guardia pide cédula.») y la tarjeta de la visita la muestra después de volver a leer la base.
  - «Indicaciones para el contacto» se ve en Enlace de autoinspección. Sale en `enviarEnlace.indicaciones` con `destinatario { tipo: 'otro', nombre: 'Carla Ruiz', numero: '0987001122', relacion: 'Hija' }`, y la tarjeta la muestra.
- **Pestaña Coordinación:** «Llamar y registrar intento» abre Coordinar visita en Contacto; «Cancelar la solicitud…» la abre con el recuadro de cancelación; en coordvis, sin riesgos por coordinar, se abre «Contacto del caso» (1 de 1, «Listo»).
- **Configuración general › Agenda:** el valor pasó de 3 a 2 con motivo («Vigente: 2 intentos.», `SIRIUS_AGENDA.intentosSinRespuesta` = 2, en el historial).
- **Catálogos:** «Motivos de cancelación» (6 registros vigentes).
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real y Genesis:** probé con la conexión simulada; no hay una llamada real (el cronómetro lo lleva la pantalla).
- **Mapa base:** el artifact bloquea las teselas.
- **Lector de pantalla:** revisé roles y nombres en el código, sin un lector real.
- **Foco al cerrar el historial:** en la prueba el cajón se abrió por código, así que no comprobé que el foco vuelva al botón.

**Diferencias**
- **Medio del intento:** el formulario aparte pedía Medio (Llamada, WhatsApp o Correo) y Fecha y hora (se podía registrar un intento pasado). En Contacto el medio es siempre «Llamada» y la fecha es la de ahora.
  - Propuesta: los mensajes por WhatsApp o SMS ya quedan como envíos de enlace (vía Genesis). Si hace falta registrar un contacto por WhatsApp o correo, que sea un séptimo botón «Otro medio…» debajo de los resultados, con medio y fecha.
- **Resultados:** los anteriores «No contesta» y «Pidió llamar después» siguen leyéndose. «No contesta» cuenta como sin respuesta.
- **Cancelación:** el motivo anterior «Cliente no contesta» exigía 3 intentos; ya no está en el catálogo inicial, así que esa condición no se aplica. El evento ahora dice «Solicitud cancelada · motivo · «detalle» · Caso Cancelado · Notificado a … (Ejecutivo comercial)». La fecha de la cancelación usa el reloj de Coordinación.
- **Contacto en sitio:** antes era el mismo campo que el contacto para la coordinación; ahora es propio. `agendarVisita.direccion.quien` y `cel` son el contacto en sitio.
- **Contratos:**
  - `enviarEnlace.destinatario` pasa de texto a objeto, también en los reenvíos.
  - `agendarVisita` suma `observaciones` y `enviarEnlace` de autoinspección suma `indicaciones`. Antes esos textos no llegaban a la base.
- **Enlace de autoagendamiento:** desde Contacto va por un solo canal, sin la ventana de modalidad; usa la modalidad elegida (Presencial o Virtual guiada; con Documental o No requiere inspección no está disponible). El botón de la pestaña «Enviar enlace de autoagendamiento» sigue con su ventana. El estado del envío muestra lo enviado en la sesión; con un enlace anterior en los datos, su estado.
- **Con la conexión:** si el celular sale del contacto del caso, el nombre del contacto para la coordinación sale también de allí (en 50012, «Fernanda Prueba» en lugar del asegurado).
- **Barra de fases:** Contacto se marca ✓ solo con un resultado registrado en la sesión o con la solicitud cancelada; si no, dice «Último: …».
- **Ubicación de algunos campos:**
  - En Virtual guiada, que no tiene fase Lugar, las observaciones van en Inspector y horario.
  - En Documental, en su fase.
  - En Autoinspección, el contacto en sitio es por defecto el de la coordinación.
- **Escenas con la conexión simulada:** usan el reloj de demostración (16/10/2026 13:40). El historial muestra «(registrado 20:30)» porque el Back-office sella con su reloj de ejemplo, una diferencia que ya existía.

**Escenas**

| Escena | Qué muestra |
|---|---|
| coordcontacto | Llamar al contacto para la coordinación, nota y «Contestó»; el intento con a quién y la duración (`?fhist=1`: «Historial del caso» abierto) |
| coordotronumero | Otro número (Jorge Pillajo, chofer) y «No contestó» (`?fnum=9`: el error con 9 dígitos) |
| coordenlaceauto | 3 intentos sin respuesta: el enlace destacado, con el chofer en «Enviar a» (`?fenviar=1`: enviado) |
| coordcancelar | Cancelar la solicitud con motivo y detalle: banda roja y bloqueo (`?fconf=0`: el recuadro sin confirmar) |
| coordeditarcontacto | «Editar contacto» cambia el celular a 0987654321 (`?fedit=1`: el formulario abierto) |
| cxcoordcontacto | `intentoContacto` (`?fpaso=enlace`: `enviarEnlace` con `destinatario`; `?fpaso=cancelar`: `cancelarSolicitud`; `?cxok=0`: `{ ok: false }`) |

También abrí coordfases (con `?ffase=lugar` y `?ffase=horario`), coordautoinsp, coordvirtual, coord, coordchoque, coordauto, coordvis, coordrg, coordcxmoto, envioenlace, enlaceagenda, cxvisitaenlace, cxvisitacancelar, cxcoordins, cxcoordpasado, cxcoordcambiar, cxcoordmismo, cxcoordjornada, cxvisitariesgos, cxnumerocruce, coordmodalidades, coordfechahora, coordoferta, cxcoordfases, lugarbuscar, lugarfuera, agendajornada y catalogos.

Tiempo de la etapa: inicio 14/11/2026 19:37 · fin 14/11/2026 20:21 · 44 min

---

## 18/10/2026 · 20:30 — Etapa G-2c2

Publiqué la etapa G-2c2 (Versión 218 con los archivos; la Versión 219 solo completa en este registro la hora de fin). Agendar, reagendar y cambiar inspector ahora se hacen en «Coordinar visita», una pantalla completa por fases según la modalidad. Las modalidades se evalúan con las reglas parametrizadas y los vehículos elegidos. Incluye la fase Inspector y horario con fecha y hora validadas y la oferta a inspectores (DEC-237).

**Qué cambió**
- **«Coordinar visita» (nuevo `sirius-coordinar.js`, `SiriusCoordinar`):** se abre al agendar, reagendar o cambiar inspector, y desde «Coordinar visita» en la tarjeta «Coordinar inspección» de un caso de un solo riesgo.
  - **Cabecera:** caso, asegurado, sucursal y SLA.
  - **Una línea compacta:** modalidad y vehículos.
  - **Barra de fases:** número o ✓ y el resumen de lo decidido. Se visitan con un clic o con Alt+← / Alt+→. El lugar que viene de la solicitud dice «de la solicitud, por revisar» hasta pasar por Lugar.
  - **Fases por modalidad:**
    - Presencial: Contacto · Lugar · Inspector y horario.
    - Virtual guiada: Contacto · Inspector y horario.
    - Autoinspección: Contacto · Enlace de autoinspección.
    - Documental y No requiere inspección: Contacto más su fase.
  - **Pie con orden fijo:** Salir · ← fase anterior · secundaria · principal (azul, la última), y «N de M». Ctrl+Enter ejecuta la principal. Las principales son:
    - «Siguiente: <fase> →».
    - «Agendar visita», con la secundaria «Agendar y siguiente».
    - Con una oferta: «Listo · siguiente caso», con la secundaria «Anular oferta».
    - «Enviar enlace de autoinspección».
  - **Siguiente caso:** abre el siguiente caso del usuario en coordinación (Registrado, En coordinación, Reaperturado o Enlace caducado), ordenado por SLA.
- **Modalidades según las reglas (`SiriusModalidades.ofrecerPara`):**
  - Se evalúan con los vehículos elegidos. Una modalidad bloqueada muestra 🔒, no se puede elegir y su título da el motivo, por ejemplo «PRB1213: suma asegurada USD 33.200 supera USD 30.000 (regla «Autoinspección hasta USD 30.000» de la plantilla Vehículos livianos)».
  - Si la modalidad elegida queda bloqueada al cambiar los vehículos, vuelve a Presencial con el aviso «La modalidad Autoinspección quedó bloqueada (…): se cambió a Presencial.».
- **Contacto:** los intentos de contacto de siempre (Registrar intento, Enviar enlace de autoagendamiento —no con Autoinspección—, Cancelar por coordinación) y los datos de contacto.
- **Lugar:**
  - A la izquierda, el formulario; a la derecha, el mapa grande.
  - Una sola búsqueda llena «Dirección para el inspector», que se puede editar.
  - Atajos «Dirección de la solicitud» e «Igual que la V1».
  - Zona con su estado y «Cambiar zona».
  - Referencia, y ciudad y contacto en sitio plegados.
  - Se conserva todo lo de G-2c: zona calculada como copia, «Zona por confirmar», lejos del centro y Ramos Generales.
- **Inspector y horario:**
  - Días rápidos (hoy y los 5 siguientes) y duración calculada con el inicio y el fin.
  - Fecha, Hora de inicio y Hora de fin con `SiriusFecha`: máscara, calendario, selector de hora, Hoy/Ahora, fecha de hoy a +60 días y fin propuesto con la duración por defecto (45 min).
  - Los campos se aplican al salir del grupo, con Enter o al elegir en el calendario o el selector; campos y tablero quedan sincronizados.
  - **Validaciones:**
    - Fecha u hora pasadas: «La hora ya pasó: hoy son las HH:MM.».
    - Fin anterior al inicio y menos de 15 minutos.
    - Jornada (días y horas) y choques: «Choca con su visita de 10:30 a 11:15 (caso 20186).». El choque ahora bloquea.
  - «Primer libre» y «Ofrecer al cliente» (3 horarios libres y distintos de quienes cubren el lugar).
  - **Tablero por cobertura:** ocupados con su caso, fuera de jornada rayado, pasado sombreado con la línea de la hora actual, fantasma (rojo con el motivo cuando no se puede), bloque elegido, «Libre HH:MM →» y «Fuera de cobertura» plegado, con el motivo en el pie.
- **Oferta a inspectores:**
  - Panel con los inspectores (por defecto, los que cubren el lugar), rango de fechas, vigencia (1, 2, 4 u 8 h) y nota.
  - Al enviar, el pie dice «Oferta enviada a N inspectores · del … al …» con «Anular oferta».
  - La visita queda «Oferta enviada» en la tarjeta, también con «Anular oferta».
- **Enlace de autoinspección:**
  - Canal (WhatsApp, SMS o correo), vigencia 24/48/72 h, vehículos y vista previa.
  - Usa la acción de enlaces que ya existía. Con Autoinspección no se ofrece el autoagendamiento.
- **Reagendar y Cambiar inspector:** abren el mismo flujo en Inspector y horario. En Cambiar inspector, la fecha y la hora quedan fijas.
- **Con la conexión:**
  - `agendarVisita`, como en G-2c.
  - Nuevo `ofertarVisita { caso, visita, modalidad, inspectores [nombres], desde (AAAA-MM-DD), hasta, minutos, vigenciaHoras, nota, lugar } → { ok, mensaje, ofertas, vence }`.
  - Nuevo `anularOferta { caso, visita } → { ok, mensaje }`.
  - Con `{ ok: false }` todo vuelve atrás y se muestra el mensaje.
  - `visitasBase[].oferta` se lee como «Oferta enviada».
  - `enviarEnlace` lleva el canal elegido.
  - Las reglas se leen de la configuración publicada.

**Verificado**
- **Sin scroll de la página y sin errores, a 1280 × 720 y 1920 × 1080:**
  - Las 7 escenas nuevas y sus variantes, en cada fase. La pantalla mide lo mismo que la ventana y el pie queda al borde inferior.
  - Las escenas de Coordinación que ya existían: coord, coordchoque, coordauto, coordvis, coordrg, coordcxmoto, envioenlace, enlaceagenda, cxvisitaenlace, cxvisitacancelar, cxcoordins, cxcoordpasado, cxcoordcambiar, cxcoordmismo, cxcoordjornada, cxvisitariesgos y cxnumerocruce.
  - Las de G-2c: lugarbuscar, lugarmapa, lugarlejos, lugarfuera, lugarrg y cxlugar.
- **Teclado:**
  - Ctrl+Enter pasa de Contacto a Lugar y agenda en Inspector y horario.
  - Alt+← y Alt+→ cambian de fase.
  - Escribir una fecha y pasar con Tab dentro del grupo no aplica; Enter aplica.
  - De 09:00 a 10:00 da 60 min, y Ctrl+Enter crea la V2 con la vista previa de WhatsApp.
- **Calendario y selector:** el día 20 del calendario se aplica; el selector en 11:30 deja el fin en 12:15; un clic en el tablero a las 15:00 elige ese horario.
  - «Primer libre» con Luis Andrade da 09:00.
  - Un fin anterior al inicio da su error.
- **coordfechahora** (reloj de demostración, 16/10/2026 13:40):
  - Hoy 09:00 → «La hora ya pasó: hoy son las 13:40.».
  - `?fh=manana` → mañana de 14:00 a 15:00 = 60 min con Diana Cárdenas.
  - `?fh=choque` → «Choca con su visita de 10:00 a 10:45 (caso 20200).».
- **coordmodalidades:** con PRB1213 aparece el aviso y la modalidad pasa a Presencial. Qué reglas bloquean cada modalidad:

  | Modalidad | Regla | Con PRB1213 |
  |---|---|---|
  | Presencial | ninguna (siempre disponible) | disponible |
  | Virtual guiada | solo activa o no en la plantilla | disponible |
  | Autoinspección | criterios de la plantilla: suma asegurada ≤ USD 30.000 y año ≥ 2015 | 🔒 «PRB1213: suma asegurada USD 33.200 supera USD 30.000 (regla «Autoinspección hasta USD 30.000» de la plantilla Vehículos livianos)» |
  | Documental | apagada en la plantilla | 🔒 «Documental no activa en la plantilla Vehículos livianos» |
  | No requiere inspección | ninguna | disponible |

  Con Virtual guiada no aparece la fase Lugar.
- **Grupos del tablero** (coordfases `?ffase=horario`): «Cubren la zona Sur» (Cristian Vaca); «Cubren toda la ciudad o la sucursal» (Luis Andrade, Diana Cárdenas, Marco Tapia); «Fuera de cobertura (2)».
  - «Ofrecer al cliente» propone lun 19/10 08:00 con Cristian, 09:30 con Cristian y 11:00 con Luis.
  - En lugarfuera, el motivo se pide en el pie y el grupo «Fuera de cobertura» queda abierto.
- **coordoferta:** la oferta se envía a 3 inspectores (vence 16/10/26 15:40) y luego se anula.
- **coordautoinsp:** el enlace se envía una sola vez, con el canal y el texto de la vista previa correctos.
- **cxcoordfases:**
  - `agendarVisita` lleva `riesgos ['50012-V1', '50012-V2']`, `inicio '2026-10-17T14:00'`, `minutos 60`, `lugar` (zona z1701-3 Sur) y `fueraCobertura null`.
  - `ofertarVisita` lleva `inspectores ['Cristian Vaca', 'Diana Cárdenas', 'Luis Andrade']`, `desde '2026-10-19'`, `hasta '2026-10-21'`, `vigenciaHoras 2` y `lugar`; después, `anularOferta { caso, visita: 2 }`.
  - Con `?cxok=0`, todo vuelve atrás y se ve «La base rechazó la acción (prueba)».
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** probé con la conexión simulada.
- **Mapa base:** el artifact bloquea las teselas, así que lo probé sobre el fondo neutro.
- **Aceptación de la oferta en la app del inspector:** se construye en G-3.
- **Lector de pantalla:** revisé roles y nombres en el código, sin un lector real.

**Diferencias**
- **De dónde salen las reglas de cada modalidad:** de la plantilla vigente del ramo en la configuración publicada.
  - El interruptor de cada modalidad (`modalidades`, DEC-204) decide si está activa.
  - La autoinspección tiene además sus criterios por vehículo (`criteriosA`: suma asegurada máxima, año mínimo, carrocerías y sucursales, DEC-206).
  - En las escenas, la plantilla es «Vehículos livianos» simulada (Documental apagada; autoinspección hasta USD 30.000 y desde 2015).
  - **Falta:** Virtual guiada y Documental no tienen reglas por vehículo parametrizables. La maqueta usa Virtual hasta USD 50.000 y Documental solo para 0 km; habría que agregarlas a la plantilla.
- **coordmodalidades:** la escena de P-6e-1 se reemplazó por la de esta etapa.
- **El choque bloquea:** antes era una advertencia.
- **Un solo riesgo:** el formulario en línea se cambió por la tarjeta «Coordinar inspección» con «Coordinar visita».
- **Formulario anterior:** se mantiene en «Dividir visita» y «Generar nuevo enlace».
- **Documental y No requiere inspección:** tienen su propia fase (no están en la maqueta).
- **Vigencia del enlace de autoinspección:** 24/48/72 h, en lugar de los «10 días» configurados. Por defecto, 48 h.
- **Lugar por defecto:** la dirección de la solicitud, que se busca al abrir.
- **Reloj:** las escenas simuladas usan el de demostración (16/10/2026 13:40); con la conexión se usa la hora real del Ecuador (DEC-230). El botón «Hoy» de `SiriusFecha` sigue con `SIRIUS_EJEMPLO.ahora` (18/10/2026 20:30), una diferencia que ya existía.
- **Intersección:** ya no se muestra, como en G-2c.
- **Cambiar inspector:** la fecha y la hora quedan fijas.

**Escenas**

| Escena | Qué muestra |
|---|---|
| coordfases | Presencial: Contacto → Lugar → Inspector y horario → Agendar (`?ffase=lugar|horario`) |
| coordmodalidades | PRB1213 bloquea Autoinspección con su motivo y la elegida vuelve a Presencial con el aviso; Documental bloqueada (`?fveh=3`) |
| coordfechahora | Hoy 09:00 da el error; mañana de 14:00 a 15:00 = 60 min; calendario y selector (`?fh=manana`, `?fh=choque`) |
| coordoferta | Oferta a 3 inspectores y anular (`?fof=enviada`) |
| coordautoinsp | Fases Contacto · Enlace; enviar el enlace (`?fenviar=1`) |
| coordvirtual | Virtual guiada, sin la fase Lugar |
| cxcoordfases | Datos que reciben `agendarVisita` y `ofertarVisita` (`?fof=1`); `?cxok=0`: `{ ok: false }` |

También abrí coord, coordchoque, coordauto, coordvis, coordrg, coordcxmoto, envioenlace, enlaceagenda, cxvisitaenlace, cxvisitacancelar, cxcoordins, cxcoordpasado, cxcoordcambiar, cxcoordmismo, cxcoordjornada, cxvisitariesgos, cxnumerocruce, lugarbuscar, lugarmapa, lugarlejos, lugarfuera, lugarrg y cxlugar.

Tiempo de la etapa: inicio 14/11/2026 18:42 · fin 14/11/2026 19:21 · 39 min

---

## 18/10/2026 · 20:30 — Etapa G-2c

Publiqué la etapa G-2c (Versión 216 con los archivos; la Versión 217 solo completa en este registro la hora de fin, que se toma al terminar de publicar). Al agendar o reagendar una visita presencial, Coordinación ahora tiene «Lugar de la inspección»: la dirección o el punto en el mapa, la zona calculada o confirmada, y las sugerencias de inspectores agrupadas por cobertura. También se puede asignar a alguien fuera de cobertura, con un motivo obligatorio que queda en el historial (DEC-222, DEC-224 y DEC-225).

**Qué cambió**
- **«Lugar de la inspección» (`SiriusLugar.Editor`, nuevo `sirius-lugar.js`):** reemplaza la dirección, la intersección y el mapa de referencia en agendar, reagendar y dividir visitas presenciales.
  - **Provincia y ciudad:** listas que dependen una de otra, con SIRIUS_GEOGRAFIA.
  - **Dirección:** campo con «Buscar» y sugerencias desde 3 letras (`SiriusUbicacion.buscar`; flechas y Enter eligen). Al elegir una dirección se ubica el punto, y la ciudad puede cambiar. Si no se encuentra: «No se pudo ubicar la dirección. Marca el punto en el mapa o elige la zona.».
  - **Referencia.**
  - **Mapa (`SiriusMapa`):** muestra las zonas de la ciudad y el punto, que se puede arrastrar; un clic marca el punto.
  - **Zona:** el nombre y el estado («Calculada», «Calculada · lejos del centro», «Confirmada», «Zona por confirmar» o «Ciudad sin zonas»), con su nota, «Cambiar la zona» (las zonas activas) y «Confirmar zona X».
- **El lugar (DEC-222):**
  - Forma: `{ provincia, ciudad, direccion, referencia, punto, zona { id, nombre }, estadoZona, lejos, origen }`.
  - La zona se calcula con lo publicado y se guarda como copia del momento: si después se renombra o se elimina, la visita conserva la que tenía.
  - **Lugar por defecto:** el de la visita (al reagendar o dividir); en Ramos Generales no móviles, el del riesgo; si no, el de la visita anterior o la dirección del riesgo con la ciudad del caso.
- **Ramos Generales no móviles:** el lugar sale de la dirección del riesgo. Si no trae punto, se busca al abrir; si no se encuentra, queda «Zona por confirmar». El Coordinador lo puede modificar.
- **Sugerencias (DEC-224):** la lista de inspectores se agrupa en «Cubren la zona», «Cubren toda la ciudad o la sucursal» (incluye a los de «Todas») y «Fuera de cobertura (N)», plegado.
  - Usa `SiriusCobertura.cubre(inspector, { sucursal del caso, ciudad, zonaId })`. Con la zona por confirmar, se sugiere a quienes cubren toda la ciudad.
  - Dentro de cada grupo, el orden es por menos visitas del día.
  - Cada fila muestra el nombre, el tipo o la agencia, la jornada, «N visitas el dd/mm» y la razón («Atiende la zona Norte», «Atiende toda Quito»… o «No cubre este lugar. <resumen de su cobertura>»).
- **Fuera de cobertura (DEC-225):**
  - Al elegir a alguien de ese grupo, aparecen la alerta «X no cubre este lugar. Puedes asignarlo igual: escribe el motivo; la alerta y el motivo quedan en el historial.», su cobertura y el campo «Motivo» (10 caracteres o más).
  - «Agendar visita» o «Guardar cambios» no se habilitan sin el motivo. Vale también para «Cambiar inspector».
  - La tarjeta lleva la etiqueta discreta «Fuera de cobertura», con el motivo en el título.
  - El historial guarda «· Alerta de cobertura: X no cubre este lugar. … Motivo: …».
- **Tarjeta de la visita:** «Ciudad y zona» («Quito · Zona Norte», o «Zona por confirmar» en ámbar) y la dirección.
- **Con la conexión:**
  - `agendarVisita` lleva `lugar { provincia, ciudad, direccion, referencia, punto, zona: { id, nombre } | null, estadoZona, lejos, origen }` y `fueraCobertura: { motivo } | null`.
  - El lugar se lee de `casos[].visitasBase[].lugar`; si no viene, se arma con la dirección de texto y la ciudad del caso, con «Zona por confirmar».
  - Con `{ ok: false }`, todo vuelve atrás y se muestra el mensaje.
- **Agenda y red:** `cubre` recibe también la ciudad y la zona del lugar de la visita cuando existen, así que un inspector «Por ciudad y zona» ya cubre las visitas con lugar en su zona.

**Verificado**
- **Las 6 escenas nuevas a 1280 × 720 y 1920 × 1080:** sin errores, sin scroll horizontal y sin errores de consola.
- **Escenas de Coordinación ya existentes**, comparadas con la versión publicada antes (215): coord, coordchoque, coordauto, coordvis, coordrg, coordmodalidades, coordcxmoto, envioenlace, enlaceagenda, enlaceagendamodalidad, cxvisitaenlace, cxvisitacancelar, cxcoordins, cxcoordpasado, cxcoordcambiar, cxcoordmismo, cxcoordjornada, cxvisitariesgos y cxnumerocruce.
  - Solo cambian el lugar en los formularios presenciales, «Ciudad y zona» en las tarjetas («Quito · Zona por confirmar»; en coordrg «Manta · Ciudad sin zonas») y la carga, que pasa de «hoy» a «el dd/mm».
  - Sin errores a las dos medidas (enlaceagenda, solo a 1280).
- **Agenda, red y portal:** agendasemana, agendamover, agendaok, portalhoras, inspofertas, inspaceptar y enlaceagendamodalidad quedan con el mismo texto. En portalredok, la tarjeta de Coordinación suma «Guayaquil · Zona por confirmar».
- **Zona y grupos de sugerencias:**

  | Escena | Zona | Cubren la zona | Cubren toda la ciudad o la sucursal | Fuera de cobertura |
  |---|---|---|---|---|
  | lugarbuscar («Av. Amazonas y Naciones Unidas») | Zona Norte · Calculada (a 4,6 km) | Mauricio Endara | Marco Tapia (0 visitas), Luis Andrade (1), Gabriela Toapanta (2) | Cristian Vaca (Sur), Paola Vinueza (Guayaquil) |
  | lugarlejos (Mitad del Mundo) | Zona Norte · Calculada · lejos del centro (15,1 km, radio 15) → Confirmada con `?lconf=1` | Mauricio Endara | Marco Tapia, Luis Andrade, Gabriela Toapanta | Cristian Vaca, Paola Vinueza |
  | lugarmapa («calle 123») | Zona por confirmar, con «No se pudo ubicar…» | — | Marco Tapia, Luis Andrade, Gabriela Toapanta | Cristian Vaca, Paola Vinueza, Mauricio Endara |
  | lugarmapa `?lpunto=1` (punto en Quitumbe) | Zona Sur · Calculada | Cristian Vaca | Marco Tapia, Luis Andrade, Gabriela Toapanta | Paola Vinueza, Mauricio Endara |

- **lugarfuera:** con Paola Vinueza aparecen la alerta y el motivo, y «Agendar visita» queda deshabilitado. Con `?lguardar=1`, la visita queda con «Fuera de cobertura» (el título lleva el motivo) y «Quito · Zona Norte». En el Historial queda «Visita agendada · V1 · Paola Vinueza · Quito · Zona Norte · Alerta de cobertura: Paola Vinueza no cubre este lugar. Motivo: …».
- **lugarrg:** el lugar sale de `riesgosBase` («Av. de los Shyris y Naciones Unidas, La Carolina», Quito, sin punto). Se busca al abrir y queda en la zona Norte calculada. Con `?lmod=1`, el punto movido por el Coordinador da la zona Centro confirmada y la referencia.
- **cxlugar:**
  - `agendarVisita` envía `lugar { provincia: '17', ciudad: '1701', direccion, referencia, punto: [-0.1765, -78.4845], zona: { id: 'z1701-1', nombre: 'Norte' }, estadoZona: 'Calculada', lejos: false, origen: 'Búsqueda' }` y `fueraCobertura { motivo }`.
  - La base simulada lo guarda en `visitasBase[0]`, y la tarjeta lo vuelve a leer.
  - Con `?cxok=0`, la visita no se crea y se ve «La base rechazó la acción (prueba)».
- **Agenda y red con un inspector «Por ciudad y zona» (Quito, Norte):**
  - `SiriusAgenda.validar` no da aviso de cobertura para una visita con lugar en la zona Norte. Para una en la zona Sur da «… no cubre Quito · Zona Sur (su cobertura: Quito: Norte).». Sin lugar, como antes, falta el lugar.
  - En la red, `redDe` lo incluye para la zona Norte y no para la Sur ni sin lugar.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** probé con la conexión simulada; la búsqueda de direcciones usa el diccionario de prueba.
- **Mapa base:** el artifact bloquea las teselas, así que lo probé sobre el fondo neutro.
- **Lector de pantalla:** revisé los nombres y roles en el código, pero no lo probé con un lector real.
- **Portal:** la red ya usa el lugar si el enlace lo trae, pero el portal todavía no lo define. Lo verifiqué solo llamando a `redDe`.

**Diferencias**
- **De dónde sale la dirección del riesgo (Ramos Generales no móvil):**
  - Con la conexión: `casos[].riesgosBase[i]` de composición «Ubicación», con `datos.direccion` y `datos.ciudad` (y, si vienen, `datos.provincia`, `datos.referencia` y `datos.punto` o `datos.latitud`/`datos.longitud`).
  - Sin la conexión: `riesgos[].dir` del caso o, si no, la dirección del solicitante o asegurado de la solicitud, con la ciudad de la sucursal del caso.
  - Equipo y maquinaria se trata como móvil.
- **Solo en visitas presenciales:** el lugar y los grupos aparecen en las visitas presenciales y en «Cambiar inspector» de una visita presencial. En virtual guiada, documental y autoinspección la lista de inspectores sigue como antes.
- **Intersección:** ya no hay campo propio; va en la dirección o en la referencia.
- **Carga del día:** dice «N visitas el dd/mm» también cuando es hoy, en todas las listas de inspectores.
- **Vehículos sin visita anterior:** el lugar empieza con la dirección del riesgo y la ciudad del caso, en «Zona por confirmar», hasta que se busca o se marca el punto (no se busca solo).
- **Cambiar de provincia o de ciudad:** se borran la dirección y el punto.
- **Con `{ ok: false }`:** Coordinación vuelve a empezar como en P-6f-0e, sin la visita y con el mensaje de la base.
- **Historial con la conexión:** la alerta y el motivo los registra la base (en la base simulada, como un evento del caso). Sin la conexión, Coordinación los agrega al historial.

**Escenas**

| Escena | Qué muestra |
|---|---|
| lugarbuscar | 50012 V1: buscar «Av. Amazonas y Naciones Unidas» → zona Norte calculada; Mauricio Endara cubre la zona y los demás, toda la ciudad o la sucursal |
| lugarmapa | «calle 123» no se encuentra → zona por confirmar (`?lpunto=1`: punto en el mapa → zona Sur calculada) |
| lugarlejos | Mitad del Mundo → «Calculada · lejos del centro» (`?lconf=1`: zona confirmada) |
| lugarfuera | Paola Vinueza fuera de cobertura: alerta y motivo obligatorio (`?lguardar=1`: etiqueta en la tarjeta y línea en el historial) |
| lugarrg | 50013 de Ramos Generales no móvil: el lugar sale del riesgo y se ubica al abrir (`?lmod=1`: modificado por el Coordinador) |
| cxlugar | `agendarVisita` con `lugar` y `fueraCobertura` (`?cxok=0`: `{ ok: false }`) |

También abrí coord, coordchoque, coordauto, coordvis, coordrg, coordmodalidades, coordcxmoto, envioenlace, enlaceagenda, enlaceagendamodalidad, cxvisitaenlace, cxvisitacancelar, cxcoordins, cxcoordpasado, cxcoordcambiar, cxcoordmismo, cxcoordjornada, cxvisitariesgos, cxnumerocruce, agendasemana, agendamover, agendaok, portalhoras, portalredok, inspofertas e inspaceptar.

Tiempo de la etapa: inicio 14/11/2026 14:12 · fin 14/11/2026 14:42 · 30 min

---

## 18/10/2026 · 20:30 — Etapa G-2a2

Publiqué la etapa G-2a2 (Versión 214 con los archivos; la Versión 215 solo completa en este registro la hora de fin, que se toma al terminar de publicar). Rehice «Ciudades y zonas» con la disposición de la maqueta G-1b, adaptada al sistema de diseño y con los íconos del proyecto (DEC-235): el mapa ocupa todo el espacio libre y queda un solo panel a la derecha, ajustable y contraíble. Ahora también se pueden eliminar zonas.

**Qué cambió**
- **Disposición:** el mapa ocupa todo el espacio libre y a la derecha queda un solo panel; ya no está la columna de ciudades.
  - **Cabecera:** la ciudad en una lista desplegable con búsqueda (nombre de uso común, oficial o provincia), «Con zonas / Todas», «N zonas» o «Sin publicar» en cada ciudad y, dentro de la lista, la fuente del INEC 2026. Se abre con clic o Enter y se cierra con Esc o con un clic fuera. Debajo van los chips del resumen y dos botones: Historial y Contraer.
  - **Cuerpo con desplazamiento:** «Agregar zona», las tarjetas y las inactivas plegadas.
  - **Pie fijo, siempre a la vista:** sin cambios, «Publicado · versión N · fecha» e «Historial (N)». Con cambios: «Ver cambios», el motivo y «Publicar».
- **Panel ajustable y contraíble:**
  - El tirador del borde izquierdo cambia el ancho entre 300 y 560 px, con el mouse o con las flechas cuando tiene el foco (Inicio y Fin van al mínimo y al máximo).
  - «Contraer», Enter o doble clic en el tirador dejan un riel con la ciudad, el número de zonas, los cambios sin publicar y «Expandir».
  - El ancho y el estado se recuerdan durante la sesión, y el mapa se reajusta.
- **Barra de dibujo abajo al centro del mapa:**
  - Al dibujar un área: «Área de X · N puntos», la ayuda corta, el error del borde cruzado, «Cerrar área», «Deshacer» y «Cancelar».
  - Al agregar: «Nueva zona X · clic en el mapa donde está su centro» y «Cancelar».
  - Mientras se dibuja o se agrega se ocultan las otras barras.
- **«Probar una dirección»:** barra compacta abajo a la izquierda.
  - Texto libre con «Buscar», sugerencias mientras se escribe (flechas y Enter eligen) y «✕» para limpiar; un clic en el mapa también prueba ese punto.
  - Sin resultado: «Zona por confirmar · «texto» no se pudo ubicar. Marca el punto en el mapa.».
  - Elegir una dirección de otra ciudad cambia la ciudad.
- **`SiriusUbicacion` (`sirius-ubicacion.js`, nuevo):**
  - `buscar(texto, codCiudad)` devuelve una promesa de `[{ texto, ciudad, punto }]`.
  - Usa `SIRIUS_CONEXION.buscarDireccion` si existe; si no, un diccionario con las 8 direcciones de G-2a y 8 de la maqueta (La Carolina, El Inca, Quitumbe, Carcelén, Calderón, Tumbaco, Malecón 2000 y Parque Calderón).
- **«Ajustes de la ciudad»:** caja compacta abajo a la derecha con el radio y «Ver radios». Solo aparece si la ciudad tiene zonas, y es de solo lectura para quien no es Administrador.
- **Historial:** un cajón que se abre sobre el mapa desde la derecha, con cada versión (número, fecha, quién, motivo y cambios). Se cierra con Esc o «Cerrar» y ya no ocupa el cuerpo del panel.
- **Eliminar zona** (solo el Administrador):
  - «Eliminar» en rojo, la última acción de cada tarjeta, también en las inactivas.
  - La confirmación va dentro de la tarjeta: «¿Eliminar la zona X?», «Los casos y visitas que ya la usan conservan el nombre que tenían.», «Se quitará de la cobertura de A y B» (o «Ningún inspector la tiene en su cobertura»), y los botones «Eliminar» y «Cancelar».
  - Después aparece un aviso con «Deshacer», y en «Ver cambios», «Eliminó la zona X (se quita de la cobertura de …)».
  - Al publicar, la zona sale de SIRIUS_ZONAS y de las coberturas de los inspectores.
- **Ids que no se reutilizan:** cada ciudad lleva su contador `siguienteId`, que «Agregar zona» usa y avanza. Al cargar queda en el número más alto + 1 (Quito 6, Guayaquil 5, Cuenca 4).
- **Accesibilidad:** la lista de ciudades, el tirador, los botones del riel, el cajón y la confirmación de eliminar funcionan con teclado y tienen nombre para el lector de pantalla.
- **Se mantiene todo lo de G-2a:**
  - Punto fantasma y arrastre de puntos; la cruz y la línea guía; tres formas de cerrar un área; Retroceso y Esc; los avisos de área.
  - Solo punto, desactivar y activar con «Deshacer», y renombrar.
  - Solo lectura para quien no es Administrador, y la publicación con motivo y con la conexión.

**Verificado**
- **Las 11 escenas de zonas a 1280 × 720 y 1920 × 1080:**
  - El mapa ocupa el espacio libre: 678 × 614 junto a un panel de 380 px a 1280, y 1318 × 974 a 1920.
  - El pie con «Publicar» se ve sin desplazarse, sin scroll de la página ni horizontal, y sin errores.
- **Con el mouse:**
  - Arrastrar el tirador 100 px deja el panel en 484 px; más allá se detiene en 560. El mapa de Leaflet toma el ancho nuevo (574 y 498 px).
  - El doble clic deja el riel y el mapa pasa a 1022 px; «Expandir» lo devuelve con el mismo ancho.
  - Al dibujar el área de Norte, la barra queda abajo. Un clic justo encima de la barra agrega un punto, Retroceso lo quita y un clic en el primer punto cierra el área (resultado: «Zona Norte · dentro de su área dibujada»).
  - «carol» sugiere La Carolina, y ↓ con Enter la elige. «✕» limpia. «malecón» con «Buscar» cambia a Guayaquil (zona Centro, a 0,6 km). «calle 123» queda en zona por confirmar, y un clic en el mapa marca el punto.
  - Eliminar Centro y luego «Deshacer» la devuelve, y los cambios vuelven a cero.
  - Eliminar Sur estando inactiva funciona igual.
  - «Agregar zona» después de eliminar crea z1701-6, no reutiliza el id.
- **Con el teclado:**
  - Tirador: tres veces → lo deja en 500 px, Inicio en 300 y cuatro veces ← en 380. Enter lo contrae y deja el foco en «Expandir»; Enter ahí lo expande y deja el foco en «Contraer».
  - Lista de ciudades: Enter la abre con el foco en el buscador. «guaya», ↓ y Enter eligen Guayaquil y el foco vuelve al botón de la ciudad. Esc cierra la lista, y un clic fuera también (ese clic no marca un punto en el mapa).
  - Confirmación de eliminar: el foco va a «Eliminar»; Esc cancela y devuelve el foco al «Eliminar» de la tarjeta; Enter confirma.
  - Cajón: Enter en Historial lo abre con el foco en cerrar; Esc lo cierra y devuelve el foco al botón; «Cerrar» también lo cierra.
- **Escenas nuevas:**
  - **zonaspanel:** el panel a 500 px; con `?zriel=1`, el riel «Quito · 5 zonas».
  - **zonasbuscar:** «quitumbe» → «Zona Sur · su punto está a 2 km»; `?zq=malecón` → Guayaquil, zona Centro; `?zq=calle 123` → zona por confirmar.
  - **zonaseliminar:** la confirmación de Centro nombra a Mauricio Endara y Diana Cárdenas. Con `?zelim=1`, Centro ya eliminada con «Deshacer» y el cambio pendiente.
  - **zonashistorial:** el cajón con la versión 2 (radio de 15 a 12 km, de Andrea Salazar, con su motivo) y la versión 1 inicial.
- **Conexión temporal en una copia aparte** (`sirius-conexion.js` que solo registra, no publicada):
  - Elimino Centro con las coberturas de la escena y publico: se envía `publicarConfiguracion { clave: 'SIRIUS_ZONAS', version: 2 }` con Quito en z1701-1, z1701-3, z1701-4 y z1701-5 y `siguienteId: 6` (Guayaquil 5, Cuenca 4).
  - Después, Mauricio Endara queda con [z1701-1] y Diana Cárdenas con [z1701-3].
  - Con `{ ok: false }` todo vuelve atrás: Centro sigue en SIRIUS_ZONAS y en las dos coberturas, el cambio sigue sin publicar y se ve «La base no aceptó la versión. La publicación se deshizo: los cambios siguen sin publicar.».
- **Lo demás, sin cambios:** cobertura, coberturasucursales, coberturalectura, coberturazonainactiva, cxcobertura, catalogos, usuarios, agendasemana e inspyo dan el mismo texto que la versión publicada antes (213), a las dos medidas.
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **Base real:** probé con la conexión simulada y una temporal; `buscarDireccion` solo con el diccionario de prueba.
- **Lector de pantalla:** revisé los nombres y roles en el código y el foco con el teclado, pero no lo probé con un lector real.
- **Mapa base:** el artifact bloquea las teselas, así que todo se probó sobre el fondo neutro.
- **Pantallas táctiles:** no probé el tirador ni el dibujo con el dedo.
- **Casos y visitas que conservan su zona:** la regla y el texto quedan definidos, pero la copia del nombre en el caso se construye en G-2c.

**Diferencias**
- **Pie sin cambios:** para el Administrador, además de «Publicado · versión N · fecha» e «Historial (N)», se ve el motivo deshabilitado y «Publicar» deshabilitado, para que el botón siempre esté a la vista. El Coordinador ve «Solo lectura…».
- **Caja de ajustes:** dice «Radio» para que quepa a 1280; el lector de pantalla lee «Radio de referencia en kilómetros».
- **«Expandir» del riel:** es un botón de ícono con nombre y título «Expandir el panel de zonas».
- **Chips:** una ciudad sin zonas muestra el chip «Sin zonas» en lugar de «0 zonas activas».
- **Sugerencias:** aparecen desde 3 letras y van primero las de la ciudad abierta.
- **Escenas:** cada escena vuelve el panel a 380 px expandido; el ancho se recuerda solo mientras se navega.
- **Zona nueva sin publicar:** eliminarla la quita sin dejar cambio (desaparece su «Agregó la zona X»).
- **Ciudad sin zonas al publicar:** una ciudad publicada que se queda sin zonas conserva su entrada con `zonas: []` y su contador. Para la asignación sigue siendo «sin zonas».
- **Coberturas:** si a un inspector se le eliminan todas las zonas que tenía en una ciudad, esa ciudad sale de su cobertura, para que no pase a «toda la ciudad». Si era su única ciudad, queda en «Por ciudad y zona» sin ciudades (no cubre ningún caso) hasta que el Administrador la edite; al guardar se pide «Agrega al menos una ciudad.».
- **`SiriusZonas.DIRECCIONES`:** queda por compatibilidad, pero la pantalla usa `SiriusUbicacion`. Las 8 direcciones de G-2a mantienen su orden, así que `?zdir=n` muestra lo mismo.
- **Avisos:** salen arriba al centro del mapa.

**Escenas**

| Escena | Qué muestra |
|---|---|
| zonas | Quito con sus 5 zonas: el mapa ocupa el espacio libre y a la derecha está el panel único con el pie «Publicado · versión 1» |
| zonasagregar | Agregar «Carcelén»: barra abajo al centro y punto fantasma (`?zrep=1`: nombre repetido) |
| zonasarea | Área de Norte dibujada (`?zcruce=1`: barra de dibujo con el error del borde cruzado; `?zpunto=1`: vuelve a solo punto con «Deshacer») |
| zonasprobar | «Mitad del Mundo» en Norte · lejos del centro (`?zdir=2`, `?zdir=6`, `?zdir=7`) |
| zonaspublicar | Conexión simulada, 2 cambios y el motivo en el pie fijo (`?cxok=0`) |
| zonaslectura | Coordinador: solo lectura, sin «Eliminar» y con el radio fijo |
| ciudadesbuscar | La lista desplegable de ciudades con «El Coca» (`?ztodas=1`: las 223) |
| zonaspanel | Panel a 500 px (`?zriel=1`: riel) |
| zonasbuscar | «quitumbe» → Sur (`?zq=malecón` → Guayaquil; `?zq=calle 123` → por confirmar) |
| zonaseliminar | Confirmación de eliminar Centro con los inspectores afectados (`?zelim=1`: eliminada, con «Deshacer») |
| zonashistorial | Cajón del historial con 2 versiones |

También abrí cobertura, coberturasucursales, coberturalectura, coberturazonainactiva, cxcobertura, catalogos, usuarios, agendasemana e inspyo, comparadas con la versión 213 a 1280 × 720 y 1920 × 1080.

Tiempo de la etapa: inicio 14/11/2026 13:34 · fin 14/11/2026 13:58 · 24 min

---

## 18/10/2026 · 20:30 — Etapa G-2b

Publiqué la etapa G-2b (Versión 212 con los archivos; la Versión 213 solo completa en este registro la hora de fin, que se toma al terminar de publicar). Las «zonas» del inspector, que en realidad eran sucursales, pasan a ser su cobertura, con un solo modo por inspector: «Todas», «Por sucursales» o «Por ciudad y zona» (DEC-223). Con la migración, la Agenda y la red dan los mismos resultados que antes.

**Qué cambió**
- **`SiriusCobertura` (`sirius-cobertura.js`):**
  - `cubre(inspector, { sucursal, ciudad, zonaId })` devuelve `{ nivel: 'zona' | 'ciudad' | 'sucursal' | 'todas' | null, por }`, por ejemplo «Atiende la zona Norte», «Atiende toda Quito», «Atiende la sucursal Quito» o «Atiende todas las inspecciones».
  - `resumen()` da la frase de la maqueta y `corto()` el texto de las listas; además están `avisos()`, `migrar()` y `guardar()`, y el componente `Editor`.
  - Las coberturas apuntan al código de la ciudad y al id de la zona. Una zona inactiva o eliminada deja de contar; la eliminada se quita al guardar.
- **Ficha del inspector en Usuarios y roles:** la sección «Cobertura», como en la maqueta.
  - Los tres modos son tarjetas de opción: Tab llega a la marcada, las flechas cambian de modo y Enter o Espacio eligen.
  - «Por sucursales» muestra las 11 sucursales. «Por ciudad y zona» tiene «Agregar ciudad» con buscador del INEC; en cada ciudad, «Toda la ciudad» o sus zonas activas (se excluyen entre sí) y «Quitar».
  - Debajo van los avisos, el resumen en una frase, el motivo y «Guardar cobertura», que se habilita solo con cambios y motivo válido.
  - Solo lectura para quien no es Administrador. Está en la ficha del ejemplo, en la del inspector independiente y en la de la base.
- **Lista de Usuarios:** columna «Cobertura» con el resumen corto («Quito: Norte y Centro», «Sucursales: Quito, Ambato», «Todas»), también en Inspectores independientes y en la lista de la base. En la lista de la base reemplaza a «Zonas».
- **Agenda y red de inspectores:** usan `cubre` con la sucursal del caso.
  - En la Agenda: la validación al mover una visita («Cobertura del inspector»), el filtro por sucursal y el texto bajo cada inspector.
  - En el portal de autoagendamiento: la agenda fija y la red que recibe las ofertas.
  - Si el modo es «Por ciudad y zona» y el caso no tiene lugar, no cubre y la validación lo explica («…: falta el lugar de la inspección para saber si cubre…»).
- **App del inspector › Yo:** la cobertura en solo lectura, con su resumen, en lugar de las zonas. Ya no se piden zonas desde la app; los pedidos de modalidades siguen.
- **Con la conexión:**
  - La cobertura se lee de `SIRIUS_CONEXION.usuarios[].cobertura` y `SIRIUS_CONEXION.inspectores[].cobertura`; si no viene, `migrar(zonas)`.
  - Guardar envía `editarUsuario { email, cambios: { cobertura }, motivo }`; con `{ ok: false }` vuelve atrás y muestra el mensaje.
  - En Coordinación, el texto bajo el inspector usa la cobertura cuando la base la trae.

**Verificado**
- **Escena cobertura:** Mauricio Endara empieza en «Por ciudad y zona» con Quito (Norte y Centro). Paso a «Toda la ciudad», busco «amba» y agrego Ambato. «Guardar cobertura» se habilita solo con el motivo, y al guardar queda «Atiende en Quito (toda la ciudad) y Ambato (toda la ciudad).». El historial del usuario lo registra y la lista muestra «Quito: toda la ciudad · Ambato: toda la ciudad».
- **Teclado en los modos:** las flechas mueven el foco y la selección; Espacio y Enter eligen.
- **coberturasucursales:** Luis Andrade en «Por sucursales» con Quito y Ambato.
- **coberturalectura:** la misma ficha vista por el Coordinador, en solo lectura, sin botones ni campos.
- **coberturazonainactiva:** Sofía Arteaga con los avisos «Sus zonas en Quito están inactivas: no recibe inspecciones ahí» y «La zona eliminada z0101-9 ya no cuenta en su cobertura».
- **cxcobertura (conexión simulada):** la cobertura migrada «Sucursales: Quito»; guardar envía `editarUsuario` con `{ email, cambios: { cobertura: { modo: 'ciudad', sucursales: [], ciudades: [{ cod: '1701', zonas: ['z1701-1'] }] } }, motivo }`. Con `?cxok=0` vuelve a la cobertura anterior con «La base rechazó la acción (prueba). Se deshizo el cambio.».
- **Conexión temporal en una copia aparte:** la cobertura de `usuarios[]` y de `inspectores[]` se lee tal cual («Quito: Norte y Centro»); quitar Centro y guardar envía `editarUsuario` con la cobertura nueva; con `{ ok: false }` vuelve atrás.
- **Misma respuesta que antes:**
  - En las 110 combinaciones de inspector de la Agenda y la red con cada una de las 11 sucursales, `cubre` da lo mismo que las zonas de antes.
  - agendamover sigue en «no cumple» («Marco Tapia no cubre Ambato…») y agendaok en «cumple».
  - El filtro por sucursal de la Agenda muestra los mismos inspectores para cada sucursal.
  - portalhoras, portalredok, enlaceagendamodalidad, inspofertas, inspaceptar, insptomada, inspofertaagencia e inspofertaindep quedan con el mismo texto.
- **Las 5 escenas nuevas y las de Usuarios, Agenda e Inicio a 1280 × 720 y 1920 × 1080:** sin errores ni scroll horizontal.
- `sirius-conexion.js` queda con su línea mínima.

**cubre() de 4 inspectores en 3 lugares (todos con sucursal Quito)**
Las coberturas son las de la maqueta G-1. En el prototipo, Mauricio Endara usa la de la escena cobertura; Diana Cárdenas y Marco Tapia quedan migrados a «Por sucursales».

| Inspector y cobertura | Quito · zona Norte | Ambato | Guayaquil · zona Sur |
|---|---|---|---|
| Mauricio Endara · Quito (Norte y Centro) | zona · «Atiende la zona Norte» | null · «No atiende Ambato» | null · «No atiende Guayaquil» |
| Diana Cárdenas · Quito (toda la ciudad) | ciudad · «Atiende toda Quito» | null · «No atiende Ambato» | null · «No atiende Guayaquil» |
| Luis Andrade · sucursales Quito y Ambato | sucursal · «Atiende la sucursal Quito» | sucursal · «Atiende la sucursal Quito» | sucursal · «Atiende la sucursal Quito» |
| Marco Tapia · todas | todas · «Atiende todas las inspecciones» | todas · «Atiende todas las inspecciones» | todas · «Atiende todas las inspecciones» |

**No verificado**
- **Base real:** probé con la conexión simulada y una temporal.
- **Lector de pantalla:** no probé las tarjetas de modo con uno.
- **Lugar del caso:** hasta G-2c, ningún caso trae ciudad ni zona, así que un inspector en «Por ciudad y zona» no cubre ningún caso de la Agenda ni de la red.

**Diferencias**
- **Cómo quedó cada inspector de ejemplo** (de sus zonas de la Agenda o la red):

  | Inspector | Cobertura |
  |---|---|
  | Marco Tapia | Sucursales: Quito |
  | Cristian Vaca | Sucursales: Quito, Manta |
  | Paola Vinueza | Sucursales: Guayaquil |
  | Luis Andrade | Sucursales: Quito, Ambato |
  | Diana Cárdenas | Sucursales: Quito, Guayaquil |
  | Jorge Pazmiño | Sucursales: Ambato, Cuenca |
  | Mauricio Endara | Sucursales: Quito |
  | Sofía Arteaga | Sucursales: Quito, Ambato, Cuenca |
  | Pedro Lasso | Sucursales: Manta, Guayaquil |

  Con la base simulada, Gabriela Toapanta y Diego Salinas quedan «Sucursales: Quito». Ninguno tenía zonas vacías, así que ninguno pasó a «Todas». Las coberturas por ciudad de las escenas viven solo en la sesión.
- **Textos que cambian, no resultados:** bajo cada inspector de la Agenda se lee «Sucursales: Quito» en lugar de «Quito». La validación dice «Cobertura del inspector» y «(su cobertura: Sucursales: Quito)». En «Yo», «Solo en tu cobertura, grupos y modalidades».
- **Pedidos de zonas desde la app:** se retiró «Editar» de las zonas en «Yo» (la cobertura la edita el Administrador). La escena inspyo ya no siembra el pedido de Ambato; los pedidos de modalidades y su aprobación siguen igual.
- **Ciudad sin zonas activas:** si todas las zonas de una ciudad quedan inactivas, la ciudad cuenta como «sin zonas» y se atiende entera, según «Una ciudad sin zonas siempre es la ciudad entera». El aviso de zonas inactivas aparece cuando la ciudad tiene otras zonas activas pero ninguna de las del inspector.
- **Zona del lugar:** en «Por ciudad y zona», con ciudad pero sin zona, `cubre` responde «Falta la zona del lugar para saber si cubre».
- **Sin sucursales o sin ciudades:** no se puede guardar («Elige al menos una sucursal.» / «Agrega al menos una ciudad.»).
- **Crear y Editar de la base:** siguen con «Zonas del inspector» (DEC-233); la cobertura se edita en la ficha.
- **Historial:** sin la conexión, el cambio queda en el historial del usuario («Cobertura: antes → después»). Con la conexión, en el historial de la base, y si no venía cobertura dice «… (migrada de sus zonas)».

**Escenas**

| Escena | Qué muestra |
|---|---|
| cobertura | Ficha de Mauricio Endara (Administrador) en «Por ciudad y zona» con Quito (Norte y Centro); se cambia a «Toda la ciudad», se agrega Ambato y se guarda con motivo |
| coberturasucursales | Luis Andrade en «Por sucursales» (Quito y Ambato), migrado de sus zonas |
| coberturalectura | La ficha de Mauricio Endara vista por el Coordinador, en solo lectura |
| coberturazonainactiva | Sofía Arteaga: su única zona en Quito está inactiva (aviso) y una zona eliminada en Cuenca |
| cxcobertura | Con la conexión simulada, guardar envía `editarUsuario` con la cobertura (`?cxok=0`: `{ ok: false }`) |

También abrí usuarios, usuarioinvitar, usuarioficha, usuariosuspender, inspdispositivo, roles, roleseditar, rolessolocambios, rolesguardar, rolescomparar, agencias, monitorpermiso, agenciatarifas, cuentaagencia, cuentamascara, agenciaopcion, cxusuarios, cxusuariocrear, cxusuarioeditar, cxusuarioestado, agendasemana, agendadia, agendamover, agendaok, inicio, iniciocoo, inicioadm, coordinacion, portalhoras, portalredok, enlaceagenda, enlaceagendamodalidad, portalporagenda, inspofertas, inspaceptar, insptomada, inspofertaagencia, inspofertaindep e inspyo.

Tiempo de la etapa: inicio 14/11/2026 11:56 · fin 14/11/2026 12:39 · 43 min

---

## 18/10/2026 · 20:30 — Etapa G-2a

Publiqué la etapa G-2a (Versión 210 con los archivos; la Versión 211 solo completa en este registro la hora de fin, que se toma al terminar de publicar). Hay una pantalla nueva, «Ciudades y zonas», con las 223 ciudades del INEC y las zonas de Quito, Guayaquil y Cuenca sobre un mapa Leaflet local. Solo el Administrador edita y publica, siempre con motivo. Se retiró «Ciudad → sucursal».

**Qué cambió**
- **Dónde está:** Administración › Ciudades y zonas, como entrada propia del menú debajo de «Catálogos». En el índice de Catálogos, la fila «Ciudades y zonas» reemplaza a «Ciudad → sucursal» y lleva a la misma pantalla.
- **Tres columnas, como la maqueta:**
  - Izquierda: buscador por nombre de uso común, nombre oficial o provincia («Quito» y «El Coca» encuentran sus nombres oficiales); filtro «Con zonas / Todas»; lista con la provincia, el código y la etiqueta «N zonas» o «Sin publicar»; la nota de la fuente (INEC 2026, 223 cantones activos y 2 en estudio, estructura de gobernanza).
  - Centro: el mapa.
  - Derecha: la barra de zonas, con cabecera y pie fijos; solo el cuerpo se desplaza.
- **Barra de zonas:**
  - Cabecera: ciudad, código INEC, nombre oficial y «N zonas activas · Radio X km»; con más de 8 zonas activas, el aviso «Más de 8 zonas: cuesta configurar la cobertura».
  - Cuerpo: «Agregar zona»; tarjetas con el borde del color de su zona, nombre editable (Enter guarda, Esc cancela, sin nombres repetidos), tipo «Punto» o «Área · N pts», avisos y acciones «Ver», «Dibujar área» o «Redibujar», «Volver a solo punto» y «Desactivar»; inactivas plegadas con «Activar»; secciones plegables «Probar una dirección», «Ajustes de la ciudad» (radio y «Ver los radios en el mapa») e «Historial de publicaciones».
  - Pie fijo: con cambios, «N cambios sin publicar», «Ver cambios», «Descartar», el motivo (10 caracteres o más) y «Publicar»; sin cambios, «Publicado · versión N · fecha».
  - Pasar el mouse por una tarjeta agranda su punto; un clic en un punto marca su tarjeta.
- **Agregar, mover y dibujar:** como la maqueta, con punto fantasma, «Deshacer», arrastre de puntos, dibujo de áreas con cruz, línea guía, cierre por tres caminos, Retroceso, Esc, rechazo del borde cruzado y los dos avisos que se aceptan.
- **Mapa reutilizable (`sirius-mapa.js`, `SiriusMapa`):** Leaflet 1.9.4 local, OpenStreetMap y Esri de respaldo. Si las teselas no cargan, el mapa funciona sobre un fondo neutro con la nota «Mapa base no disponible en esta vista».
- **Reglas y datos (`sirius-zonas.js`, `SiriusZonas`):** `zonaDe(codCiudad, [lat, lng] | null)` devuelve `{ tipo: 'area' | 'punto' | 'sinZonas' | 'sinUbicar', zona, distanciaKm, lejos }` con la regla de asignación; además guarda la copia de trabajo, los cambios, la publicación y el historial.
- **Publicación:** con la conexión, `SiriusPublicar` con la clave `SIRIUS_ZONAS` (todo el objeto con la versión siguiente) y el motivo; con `{ ok: false }` la publicación vuelve atrás y se muestra el mensaje. Sin la conexión queda en la sesión. Cada publicación deja su historial (quién, cuándo, motivo y cambios).
- **Archivos nuevos en `project/`:** `datos-geografia.js` (copiado tal cual), `datos-zonas.js`, `leaflet.js`, `leaflet.css`, `sirius-zonas.js`, `sirius-mapa.js`, `sirius-ciudades-zonas.js` (la pantalla) y `datos-cx-zonas.js` (la conexión simulada de zonaspublicar).

**Verificado**
- **Las 7 escenas a 1280 × 720 y 1920 × 1080:** el pie con «Publicar» se ve sin desplazar, sin scroll horizontal ni errores nuevos.
- **Con el mouse, en la escena zonas:**
  - Agregar: el campo recibe el cursor; «Norte» avisa «Ya hay una zona con ese nombre en Quito.»; el punto fantasma «Carcelén» sigue al mouse y un clic lo coloca; la tarjeta se ilumina y aparece «Zona Carcelén agregada…» con «Deshacer», que la quita. Esc cancela. Sin nombre queda «Zona 6».
  - Mover: arrastrar Centro deja «Movió el punto de Centro».
  - Dibujar: 4 clics y Retroceso dejan 3; se cierra con clic en el primer punto, con doble clic (sin zoom) y con «Cerrar área». Esc abandona. Un clic sobre un punto mientras se dibuja agrega un vértice y no selecciona la zona.
  - El borde cruzado se rechaza con «El borde del área se cruza consigo mismo…» y sigue el dibujo. Un área de Centro que no contiene su punto y cruza la de Sur muestra «El punto de la zona está fuera de su área» y «Se superpone con Sur: donde se crucen, gana la más cercana».
  - «Volver a solo punto» y «Desactivar» (con «Norte quedó inactiva: sus direcciones pasan a la zona más cercana.») vuelven atrás con «Deshacer».
  - Renombrar con Enter, rechazo de un nombre repetido y Esc que cancela.
  - Pasar el mouse por Sur agranda su punto; un clic en Norte marca su tarjeta.
  - «Publicar» queda deshabilitado con motivo corto; con motivo, «Publicado · versión 2 · 18/10/2026 20:30» y el historial con los cambios. «Descartar» vuelve a lo publicado.
- **zonaspublicar (conexión simulada):** se envía `publicarConfiguracion` con `clave: 'SIRIUS_ZONAS'`, `version: 2` y `datos` completo (`version` «2», `vigencia`, `reglas` y las 3 ciudades, con Quito en radio 12 y Centro movido). Con `?cxok=0` vuelve a «2 cambios sin publicar» y muestra «La base rechazó la acción (prueba)…».
- **Conexión temporal en una copia aparte:** como Administrador, desde el menú, cambiar el radio de Quito a 14 y publicar envía la clave `SIRIUS_ZONAS` y el objeto completo con la versión 2; con `{ ok: false }` todo vuelve atrás.
- **zonaslectura:** el Coordinador ve todo en solo lectura (sin «Agregar zona», nombres sin editar, puntos sin arrastrar, solo «Ver», y en el pie «Solo lectura: solo el Administrador edita y publica las zonas.»).
- **ciudadesbuscar:** «El Coca» encuentra Francisco de Orellana; «quito» encuentra Quito y Puerto Quito; «Todas» lista las 223 ciudades activas.
- **Desde Catálogos:** la fila «Ciudades y zonas» abre la pantalla.
- **Sin cambios no pedidos:** catalogoveh, siluetas, catalogoramos, sucursales11, inicio, inicioadm, iniciocoo, usuarios, roles, cxusuarios, confgeneral, agendajornada, resumenflotabase y coordinacion quedan con el mismo texto que antes. En catalogos solo cambia la fila «Ciudad → sucursal» por «Ciudades y zonas».
- `sirius-conexion.js` queda con su línea mínima.

**Zona de cada dirección de prueba**

| Dirección | Ciudad | Zona |
|---|---|---|
| Av. Amazonas N36-152 y Naciones Unidas | Quito | Norte (su punto a 4,6 km) |
| Av. Mariscal Sucre S12-45 y Ajaví | Quito | Sur (2,1 km) |
| Conocoto, calle García Moreno y Montúfar | Quito | Valle de los Chillos (2,3 km) |
| Interoceánica km 12, Cumbayá | Quito | Valles Cumbayá y Tumbaco (1,8 km) |
| Mitad del Mundo, San Antonio de Pichincha | Quito | Norte · lejos del centro (15,1 km; radio 15 km) |
| Av. Francisco de Orellana, Kennedy Norte | Guayaquil | Norte (2,2 km) |
| Av. Cevallos y Montalvo | Ambato | Ciudad sin zonas (se asigna por ciudad) |
| Calle sin nombre, barrio La Esperanza | Quito | Zona por confirmar (no se pudo ubicar) |

**No verificado**
- **Mapa base real:** en mis pruebas las teselas estaban bloqueadas, así que vi la nota y el fondo neutro, no OpenStreetMap ni Esri.
- **Teclado y lector de pantalla en el mapa:** las acciones de las tarjetas funcionan con teclado, pero mover un punto o dibujar un área solo se hace con el mouse.
- **Uso en otras pantallas:** Coordinación, el portal y las ofertas todavía no llaman a `zonaDe`.

**Diferencias**
- **Entrada propia del menú:** además de la fila en Catálogos, porque el Coordinador no ve Catálogos y debe ver las zonas en solo lectura. Todos los roles ven «Ciudades y zonas»; solo el Administrador edita.
- **Dónde se usaba «Ciudad → sucursal»:** solo en Catálogos («Usado en» vacío) con su dato `ciudadSucursal` de `datos-ejemplo.js` (Otavalo → Ibarra). Ninguna pantalla, regla ni salida lo leía. Se retiró la fila del índice; el dato queda sin uso en `datos-ejemplo.js` y Catálogos deja de publicarlo.
- **Rechazo de la base:** con `{ ok: false }` vuelven atrás la versión, lo publicado y el historial, pero los cambios quedan sin publicar para no perder lo editado. El aviso general dice «Se deshizo el cambio».
- **Versión única:** `SIRIUS_ZONAS` tiene una sola versión. Publicar una ciudad sube la versión del objeto, y los cambios sin publicar de otras ciudades no viajan.
- **Fecha de la versión 1:** el archivo no trae fecha, así que el pie dice «Publicado · versión 1 · datos iniciales». Las publicaciones usan el reloj del prototipo.
- **Ciudades sin centro aproximado:** solo 12 tienen centro en `datos-geografia.js`. En las demás el mapa no se mueve y aparece una nota.
- **`zonaDe` y `zonaDePublicada`:** `zonaDe` usa lo que se ve en la pantalla, incluidos los cambios sin publicar. Para Coordinación, el portal y las ofertas agregué `zonaDePublicada`, que usa solo lo publicado.
- **Zona nueva renombrada:** el cambio sigue siendo «Agregó la zona X» con el nombre nuevo.
- **Avisos y «Deshacer»:** el aviso se oculta al empezar a agregar o dibujar, para no tapar el mapa. «Activar» también tiene «Deshacer».
- **Variantes de las escenas:** se abren con parámetros (`?zrep=1`, `?zcruce=1`, `?zpunto=1`, `?zdir=n`, `?cxok=0`, `?ztodas=1`).
- **Diseño:** el título va en la columna izquierda, como en la maqueta, con tipografía, botones y etiquetas del sistema de diseño. El mapa aísla sus capas para que los paneles del Back-office queden por encima.

**Escenas**

| Escena | Qué muestra |
|---|---|
| zonas | Administrador, Quito con sus 5 zonas y los radios de 15 km |
| zonasagregar | Agregar «Carcelén» con el punto fantasma (`?zrep=1`: «Norte» y el aviso de nombre repetido) |
| zonasarea | El área de Norte dibujada (`?zcruce=1`: borde cruzado rechazado; `?zpunto=1`: «Volver a solo punto» con «Deshacer») |
| zonasprobar | «Mitad del Mundo» en Norte · lejos del centro (`?zdir=2`: Conocoto en Valle de los Chillos; `?zdir=7`: «Calle sin nombre», por confirmar; `?zdir=6`: Ambato, sin zonas) |
| zonaspublicar | 2 cambios, «Ver cambios» y el motivo, con la conexión simulada (`?cxok=0`: `{ ok: false }`) |
| zonaslectura | Coordinador de inspecciones, todo en solo lectura |
| ciudadesbuscar | «El Coca» encuentra Francisco de Orellana (`?ztodas=1`: «Todas» con las 223 activas) |

También abrí catalogos, catalogoveh, siluetas, catalogoramos, sucursales11, inicio, inicioadm, iniciocoo, usuarios, roles, cxusuarios, confgeneral, agendajornada, resumenflotabase y coordinacion.

Tiempo de la etapa: inicio 14/11/2026 10:02 · fin 14/11/2026 11:02 · 60 min

---

## 18/10/2026 · 20:30 — Etapa P-6f-0h

Publiqué la etapa P-6f-0h (Versión 208 con los archivos; la Versión 209 solo completa en este registro la hora de fin, que se toma al terminar de publicar). «Expandir todo / Contraer todo» ya sale con 2 riesgos o más, a la derecha del título, y el botón de confirmar de Usuarios se habilita —y se ve habilitado— solo cuando se puede guardar.

**Qué cambió**
- **Expandir todo / Contraer todo (DEC-226):** con 2 riesgos o más, a la derecha del título «Objeto a asegurar · N …» hay un botón de texto: «Expandir todo» si alguna tarjeta está cerrada, «Contraer todo» si todas están abiertas. Lleva `aria-expanded` y `aria-controls`; con 1 riesgo no aparece. Antes salía solo con 4 o más y encima de las tarjetas.
- **Apertura inicial:** no cambia. Hasta 3 riesgos, todas abiertas; con 4 o más, todas cerradas. Lo abierto se mantiene mientras se navega por el caso.
- **Cambiar estado, Crear usuario y Editar usuario (DEC-233):** el botón de confirmar está `disabled` de verdad y se ve gris cuando no se puede guardar, y se ve azul y habilitado cuando sí se puede. Debajo del motivo, una nota «Para continuar: …» dice lo que falta.
  - Cambiar estado: habilitado solo con un estado nuevo distinto del actual y no bloqueado, y un motivo de 10 caracteres o más.
  - Crear usuario: nombre, correo válido, al menos un rol, agencia si es de agencia, sucursales y grupos si se eligen, zonas si es inspector, y el motivo.
  - Editar usuario: lo mismo, más que haya algo que cambiar y que el Administrador no se quite su propio rol de Administrador.
- **Causa del botón gris:** «Cambiar estado» se pintaba con una variante «danger» que el sistema de diseño no tiene; con «Suspendido» o «Inactivo» salía sin estilo y parecía deshabilitado, aunque respondía al clic. Ahora todos los botones de confirmar de Usuarios usan la variante principal.
- **Escena nueva:** cxusuarioestado.

**Verificado**
- **Riesgos, a 1280 × 720 y 1920 × 1080:** resumenflotabase (3 abiertas, «Contraer todo»), resumenflota5 (5 cerradas, «Expandir todo»), resumenequipos2 (2 abiertas, botón) y resumenvehsol (1 riesgo, sin botón). El botón queda en la misma fila del título, a su derecha, sin scroll horizontal.
- **Teclado:** con Tab desde el campo anterior el foco llega al botón; Enter alterna entre «Contraer todo» y «Expandir todo» y las tarjetas siguen al botón en las tres escenas con botón.
- **Lo abierto se mantiene:** en 50012 cerré la tarjeta 2, salí a Inicio y volví por Solicitudes › Bandeja; seguía cerrada y el botón decía «Expandir todo».
- **cxusuarioestado:** sin estado ni motivo, gris y deshabilitado; con «Suspendido» y motivo corto, deshabilitado; con motivo válido, azul y habilitado (también con «Inactivo»); con el estado actual y motivo válido (`?cxmismo=1`), deshabilitado; un clic forzado sobre el botón gris no hace nada. Con `?cxestado=1` y un clic, Gabriela Toapanta queda «Suspendido».
- **Crear y Editar:** deshabilitados con motivo corto, sin nombre, con correo inválido, sin cambios y con `?cxyo=1` (el Administrador sin su rol); habilitados con los datos completos.
- **Escenas a 1280 × 720 y 1920 × 1080 desde el selector:** cxusuarioestado, cxusuarios, cxusuariocrear y cxusuarioeditar, sin errores ni scroll horizontal.
- **Sin cambios no pedidos:** 16 escenas de Usuarios, inicio, inicioadm, iniciocoo, resumenequipo, resumenubicacion, resumenvehsol y resumenflota5 quedan con el mismo texto que antes; solo resumenflota, resumenflotabase y resumenequipos2 suman «Contraer todo».
- `sirius-conexion.js` queda con su línea mínima.

**No verificado**
- **La base real:** el caso 50012 de verdad no lo abrí; probé con la conexión simulada que arma un caso igual.
- **Lector de pantalla:** `aria-expanded` y `aria-controls` están puestos, pero no los oí con uno.

**Diferencias**
- **Causa de las tarjetas cerradas en el 50012:** no pude reproducirlas. Con la conexión simulada (resumenflotabase, 3 vehículos) las 3 abren al entrar, también entrando por la Bandeja, y el estado de «abierto» se reinicia al cambiar de escena. El único camino que encontré es que alguien toque la cabecera de una tarjeta: como lo abierto se conserva, siguen así al volver. No hacía falta corregir la apertura; con el botón nuevo se abren o cierran todas de una vez. Con la base real no lo probé.
- **Dónde va el botón:** lo moví a la fila del título (un componente aparte, `SiriusRiesgos.Todos`), en vez de dejarlo dentro de las tarjetas.
- **Botón deshabilitado y su motivo:** un botón `disabled` no muestra el aviso al pasar el mouse ni con el foco, así que agregué la nota «Para continuar: …» dentro del panel. Antes, «Crear» y «Editar» usaban el modo del sistema de diseño que deja el botón enfocable con aviso; ahora, como pediste, quedan deshabilitados de verdad.
- **Paneles de ejemplo (sin la conexión):** solo cambia el color de los botones que se pintaban con «danger» (dar de baja, revocar y similares: ahora azules, antes sin estilo). Sus reglas de cuándo se habilitan no las toqué.
- **Escena cxusuarioestado:** abre vacía (sin estado ni motivo). `?cxestado=1` la abre con «Suspendido» y motivo; `?cxmismo=1`, con el estado actual y motivo.
- **Inventario:** la fila de `registro-envios.md` tenía 372727 caracteres y ya eran 372766; la corregí.

**Escenas**

| Escena | Qué muestra |
|---|---|
| resumenflotabase | 3 vehículos de la base, las 3 tarjetas abiertas y «Contraer todo» a la derecha del título |
| resumenflota5 | 5 vehículos con las tarjetas cerradas y «Expandir todo» |
| resumenequipos2 | 2 equipos con el botón (abiertos, «Contraer todo») |
| cxusuarioestado | «Cambiar estado» de Gabriela Toapanta, usuaria activa de la base: sin motivo el botón está gris y deshabilitado, con motivo válido se habilita y con su estado actual sigue deshabilitado (`?cxestado=1`, `?cxmismo=1`) |

También abrí resumenvehsol (1 riesgo, sin botón), cxusuarios, cxusuariocrear y cxusuarioeditar, usuarios, usuarioinvitar, usuarioficha, usuariosuspender, inspdispositivo, roles, roleseditar, rolessolocambios, rolesguardar, rolescomparar, agencias, monitorpermiso, agenciatarifas, cuentaagencia, cuentamascara, agenciaopcion, inicio, inicioadm, iniciocoo, resumenflota, resumenequipo y resumenubicacion.

Tiempo de la etapa: inicio 14/11/2026 08:08 · fin 14/11/2026 08:28 · 20 min

---

## 18/10/2026 · 20:30 — Etapa P-6f-0g

Publiqué la etapa P-6f-0g (Versión 206 con los archivos; la Versión 207 solo completa en este registro la hora de fin, que se toma al terminar de publicar). Con la conexión, Administración › Usuarios y roles ya muestra los usuarios y las agencias de la base, y permite crear, editar y cambiar el estado de un usuario (DEC-233). Sin la conexión, queda igual.

**Qué cambió**
- **Lista, ficha y filtros:** salen de `SIRIUS_CONEXION.usuarios`; la pestaña Agencias, de `SIRIUS_CONEXION.agencias`. Ningún usuario sale del ejemplo.
  - Columnas: usuario y correo, tipo, agencia, roles, alcance, zonas, estado y cuenta («Vinculada» o «Sin vincular»).
  - Filtros: tipo (Interno, Agencia, Independiente), rol, estado (Activo, Invitado, Suspendido, Inactivo) y agencia.
  - La ficha muestra los datos de la base, qué ve en SIRIUS según sus roles y el historial del usuario.
- **Crear usuario:** nombre, correo, celular, tipo, agencia, roles, sucursales, grupos, zonas (si es inspector) y motivo. Llama a `crearUsuario`. El usuario queda «Invitado» y su ficha muestra «Enlace de activación» con el botón «Copiar»; el enlace lo devuelve la base. Con su correo y una contraseña activa la cuenta y pasa a «Activo». En la prueba todos activan así; Google para internos (DEC-128) queda para producción.
- **Editar:** correo, celular, agencia, roles, alcance y zonas, con motivo de 10 caracteres o más. `editarUsuario` lleva el correo actual y en `cambios` solo lo que cambió.
- **Cambiar estado:** Activo, Suspendido o Inactivo, con motivo, por `cambiarEstadoUsuario`. Cada opción que no aplica queda bloqueada con su razón.
- **Rechazo de la base:** el cambio se ve al instante; con `{ ok: false }` vuelve atrás, el panel sigue abierto con lo escrito y muestra «La base no guardó el cambio: <mensaje>. Se deshizo el cambio.».
- **El propio Administrador:** no puede quitarse su rol de Administrador («No puedes quitarte tu propio rol de Administrador. Pide a otro Administrador que lo haga.», con «Guardar cambios» bloqueado) ni suspenderse o darse de baja («No puedes suspenderte ni darte de baja a ti mismo.»).
- **Archivos nuevos:** `sirius-usuarios-base.js` (`SiriusUsuariosBase`: lista, historial y enlaces de la sesión) y `datos-cx-usuarios.js` (escenas con la base simulada).
- **Escenas nuevas:** cxusuarios, cxusuariocrear y cxusuarioeditar.

**Verificado**
- **Escenas nuevas a 1280×720 y 1920×1080, desde el selector:** cxusuarios, cxusuariocrear y cxusuarioeditar, sin errores ni scroll horizontal.
- **cxusuarios:** 8 usuarios de la base (5 activos, 2 invitados y 1 inactivo) con sus correos de prueba, por ejemplo david.mena.coordinador+agencia@gmail.com. Se abre la ficha de David Mena con «Cuenta vinculada».
  - Filtros: Invitado deja a Carolina Vega y Sofía Arteaga («Mostrando 2 de 8»); Eurosurvey, a David Mena y Mauricio Endara; Independiente, a Luis Andrade y Diego Salinas.
  - Agencias: Eurosurvey (1 inspector, 2 usuarios), Inspecciones Andinas (1 y 1) y Peritajes del Pacífico (sin inspectores, Inactiva).
- **cxusuariocrear:** al crear a Valeria Cevallos (Eurosurvey, Inspector, Quito) queda «Invitado», sin vincular, con su enlace de activación. «Copiar» deja el enlace en el portapapeles y avisa «Enlace de activación copiado.». Con un correo que ya existe, la base responde «El correo ya lo usa otro usuario» y el usuario no queda en la lista.
- **cxusuarioeditar:**
  - Agregar «Ejecutivo de inspecciones» a David Mena con motivo se guarda, queda en su historial y en la lista.
  - Con `?cxdup=1` (correo de Luis Andrade) la base responde «El correo ya lo usa otro usuario» y David Mena vuelve a sus datos.
  - Con `?cxyo=1` (Andrea Salazar sin el rol de Administrador) aparece el aviso y «Guardar cambios» queda bloqueado; no se envía nada.
- **Cambiar estado:** Gabriela Toapanta pasa a «Suspendido» con motivo; con `?cxok=0` vuelve a «Activo» con el mensaje de la base. Carolina Vega (invitada) solo puede pasar a «Inactivo». En la fila de Andrea Salazar, «Cambiar estado» está bloqueado.
- **Sin la conexión, comparadas con la versión anterior a las dos medidas:** usuarios, usuarioinvitar, usuarioficha, usuariosuspender, inspdispositivo, roles, roleseditar, rolessolocambios, rolesguardar, rolescomparar, agencias, monitorpermiso, agenciatarifas, cuentaagencia, cuentamascara y agenciaopcion quedan iguales. También inicio, inicioadm e iniciocoo.
- **Inicio con la conexión:** «Invitaciones pendientes» muestra 2 (los invitados de la base).
- **Conexión temporal** (copia aparte, no simulada, con 3 usuarios y 1 agencia):
  - `crearUsuario`: `{ nombre, email (en minúsculas), celular, agencia: 'Eurosurvey', rol: 'Inspector', roles: ['Inspector'], tipoInspector: 'agencia', alcance: { sucursales: [], grupos: [] }, zonas: ['Quito'], motivo }`; la ficha mostró el enlace que devolvió la base.
  - `editarUsuario`: `{ email, cambios: { roles: ['Inspector', 'Ejecutivo de inspecciones'] }, motivo }`.
  - `cambiarEstadoUsuario`: `{ email, estado: 'Inactivo', motivo }`.
  - Con `{ ok: false }` el usuario creado no quedó y la edición volvió atrás, con el mensaje de la base.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: `SIRIUS_CONEXION.usuarios` y `agencias`, las tres acciones, `sirius-usuarios-base.js`, `datos-cx-usuarios.js`, 597 escenas en datos-escenas y KNOWN_ESC 554.

**No verificado**
- **La base real:** se probó contra la conexión simulada y una temporal.
- **La activación:** ocurre en la base (enlace, correo y contraseña); en el prototipo no se recorre. Al activarse, el usuario se verá «Activo» cuando la base lo mande.
- **Usuarios sin «Gestionar usuarios»** (Finanzas, Finanzas de agencia, Coordinador): con la conexión siguen viendo Agencias e Inspectores independientes del ejemplo, como antes; no los pasé a la base.

**Diferencias**
- **Correo editable:** el contrato lista roles, agencia, alcance, zonas y celular; agregué el correo porque `editarUsuario` lleva «el actual» y el error de ejemplo es de correo repetido.
- **Tipo:** se elige al crear; al editar se muestra sin cambiar (el contrato no lo incluye en los cambios).
- **Estados:** «Activo» solo para quien ya vinculó su cuenta; un invitado solo puede pasar a «Inactivo» (para anular la invitación).
- **Enlace de activación:** se guarda en la sesión al crear. Para los invitados que ya venían de la base, la ficha dice «La base no envió el enlace de este usuario: se entrega al crearlo», salvo que la base mande `usuarios[].activacion` (opcional, agregado al contrato).
- **Duplicados:** el correo repetido lo valida la base, no la pantalla, para que se vea su mensaje.
- **Agencias con la conexión:** solo nombre, estado, inspectores y usuarios. RUC, logo, cuenta y tarifas no llegan de la base en esta etapa, así que esa pestaña no tiene acciones.
- **Inicio:** con la conexión, «Invitaciones pendientes» cuenta los invitados de la base (antes contaba los del ejemplo).
- **Roles y permisos:** sin cambio; la matriz sigue en la configuración del prototipo.

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| cxusuarios | Los 8 usuarios de la base (Invitado y Activo) y la ficha de David Mena, con la cuenta vinculada |
| cxusuariocrear | Crear a Valeria Cevallos, inspectora de Eurosurvey: con «Crear usuario» queda «Invitado» con su enlace de activación y «Copiar» |
| cxusuarioeditar | Agregar un rol a David Mena con motivo; con `?cxdup=1`, «El correo ya lo usa otro usuario»; con `?cxyo=1`, el aviso al quitarse el propio rol de Administrador |

También abrí usuarios, usuarioinvitar, usuarioficha, usuariosuspender, inspdispositivo, roles, roleseditar, rolessolocambios, rolesguardar, rolescomparar, agencias, monitorpermiso, agenciatarifas, cuentaagencia, cuentamascara, agenciaopcion, inicio, inicioadm e iniciocoo.

Tiempo de la etapa: inicio 14/11/2026 07:09 · fin 14/11/2026 07:34 · 25 min

---

## 18/10/2026 · 20:30 — Etapa P-6f-0f2

Publiqué la etapa P-6f-0f2 (Versión 205). La primera publicación quedó como Versión 204 con el registro diciendo 203; la Versión 205 solo corrige el número en el registro y no cambia nada más. La jornada por defecto de las visitas ya no está fija en Coordinación: es un parámetro de la Agenda, con valor inicial lun a sáb, 08:30–17:30, que el Administrador cambia en Configuración general (DEC-232).

**Qué cambió**
- **El parámetro:** `SIRIUS_AGENDA.jornadaDefecto = { dias: [1, 2, 3, 4, 5, 6], desde: '08:30', hasta: '17:30' }` (1 = lunes) en `datos-agenda-liquidaciones.js`. Se usa cuando el inspector no tiene jornada propia en `SIRIUS_AGENDA.disponibilidad`. Sin el parámetro, todo usa el valor inicial.
- **Quién lo lee:** Coordinación, la propuesta de las escenas con la conexión y `SiriusFecha.propuestaVisita`, que ahora respeta los días y las horas de la jornada. Los errores muestran el valor vigente, por ejemplo «Fuera de la jornada de las visitas (lun a vie, 09:00–17:00)».
- **Dónde se edita:** Administración › Configuración general › pestaña «Agenda» › «Jornada por defecto de las visitas».
  - Casillas lun–dom y «Desde» y «Hasta» cada 15 minutos. El texto de ayuda dice «Se usa cuando el inspector no tiene jornada propia en la Agenda».
  - Valida que haya al menos un día («Marca al menos un día.») y que «Desde» sea anterior a «Hasta».
  - Pide motivo de 10 caracteres o más y queda en el historial con el nombre y la fecha.
  - Con la conexión se publica con `SiriusPublicar` como parte de `SIRIUS_AGENDA`; con `{ ok: false }` el cambio vuelve atrás y se ve el mensaje de la base.
  - Finanzas la ve en solo lectura, con la nota «Solo el Administrador edita la jornada por defecto de las visitas.».
- **Archivo nuevo:** `sirius-jornada.js` (`SiriusJornada`: guardar, validar, historial, reinicio). Guarda el valor editado y el historial en un solo módulo, porque los componentes vuelven a ejecutar los archivos de datos y reemplazan `SIRIUS_AGENDA`.
- **Escena nueva `agendajornada`** (Administrador, con la conexión simulada solo en la escena): el parámetro con su valor inicial, el borrador lun a vie 09:00–17:00 con motivo, el error de horas y el caso 50095 para ver Coordinación con la jornada nueva.

**Verificado**
- **Escenas a 1280×720 y 1920×1080, desde el selector:** agendajornada, cxcoordjornada, cxcoordins, cxcoordmismo, cxcoordcambiar, cxcoordpasado y cxvisitariesgos, más confgeneral, confimpuestos, confmoneda, agendasemana, agendadia, agendamover y agendaok. Ninguna mostró errores ni scroll horizontal.
- **agendajornada, guardar lun a vie 09:00–17:00:**
  - El valor vigente pasa de «lun a sáb, 08:30–17:30» a «lun a vie, 09:00–17:00».
  - El historial muestra «Jornada por defecto de las visitas: lun a sáb, 08:30–17:30 → lun a vie, 09:00–17:00», el motivo y «Publicada en la base · versión 1».
  - `SIRIUS_AGENDA.jornadaDefecto` queda en `{ dias: [1, 2, 3, 4, 5], desde: '09:00', hasta: '17:00' }`.
- **Errores:**
  - `?jdesde=18:00`: «La hora «Desde» debe ser anterior a «Hasta» (18:00 no es anterior a 17:00).», con «Guardar cambios» sin efecto y nada en el historial.
  - Sin ningún día marcado: «Marca al menos un día.».
  - Motivo de menos de 10 caracteres: «Escribe el motivo (mínimo 10 caracteres): queda en el historial.».
  - `?cxok=0`: la base rechaza, el valor vuelve a lun a sáb, 08:30–17:30, el historial queda vacío y se ve «La base rechazó la acción (prueba). Se deshizo el cambio.».
- **Coordinación con la jornada nueva** (en la misma página, caso 50095, Gabriela Toapanta sin jornada propia; reloj real 14/11/2026, de madrugada):
  - Propone el lunes 16/11 a las 09:00.
  - Presencial de 16:30 a 17:15 da «Fuera de la jornada de las visitas (lun a vie, 09:00–17:00)» en la hora de fin; de 08:30 a 09:15, en la hora de inicio.
  - Un sábado (21/11) a las 10:00 da el mismo error; el viernes 20/11 de 09:00 a 09:45 no tiene error.
  - Luis Andrade, con jornada propia (09:00–18:00), no tiene error el sábado 21/11 de 09:00 a 09:45.
- **Sin editar:** como Finanzas (confimpuestos › Agenda) las casillas y las horas están bloqueadas y no hay botón de guardar. Al cambiar a una escena sin la conexión simulada, el valor y el historial vuelven al inicio.
- **Comparación con la versión anterior** (sin la conexión): coord, coordchoque, coordauto, coordvis, envioenlace, enlaceagenda, enlacesincorreo, coordcxmoto, cxvisitaenlace, cxvisitacancelar, cxnumerocruce, agendasemana y agendadia quedan iguales; en enlaceagenda solo cambia el código del enlace, que es al azar. Con la conexión, cxcoordjornada, cxcoordins, cxcoordcambiar, cxcoordmismo, cxcoordpasado y cxvisitariesgos también quedan iguales al abrirse, salvo lo que aparece en Diferencias.
- **Búsqueda en el proyecto:** la jornada fija estaba en tres archivos y ya no queda en ninguno.
  - `Coordinacion.dc.html`: `jornada()` usaba lun a sáb, 08:00–18:00.
  - `datos-cx-inspectores.js`: `prop()` tenía un respaldo 08:00–08:45.
  - `sirius-fecha.js`: `propuestaVisita` proponía «mañana a las 08:00» y hasta las 18:00.
  - El valor inicial 08:30–17:30 queda solo en `datos-agenda-liquidaciones.js` y en `SiriusFecha.JORNADA_INICIAL`.
  - Se dejaron a propósito, porque son otra cosa: el horario de los mensajes a clientes (`sirius-enlace.js` y `datos-notificaciones.js`, 08:00–19:00), los recordatorios de la app (`datos-app-inspector.js`, 15:00 y 18:00), el eje de la rejilla de `Agenda.dc.html`, el calendario de SIRIUS_FLUJO (`datos-flujo.js` y `sirius-portal-caso.js`) y las jornadas propias de cada inspector. `sirius-agenda.js` no tenía jornada por defecto.
- **Conexión temporal** (copia aparte, no simulada, con un Administrador): al guardar, `accion('publicarConfiguracion')` recibió `clave: 'SIRIUS_AGENDA'`, `version: 1`, `datos` con todo `SIRIUS_AGENDA` (13 claves, incluida `jornadaDefecto` = lun a vie 09:00–17:00 y las 6 jornadas de `disponibilidad`) y el motivo. Con `{ ok: false }` el valor vuelve a lun a sáb, 08:30–17:30 y el historial queda vacío.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: `SIRIUS_AGENDA.jornadaDefecto`, `publicarConfiguracion` de `SIRIUS_AGENDA`, `sirius-jornada.js`, 594 escenas en datos-escenas y KNOWN_ESC 551.

**No verificado**
- **La base real:** se probó contra la conexión simulada y una temporal.
- **De día:** las pruebas se hicieron de madrugada (reloj real). Con el reloj a media jornada no se revisó la propuesta en pantalla.
- **Días salteados:** no probé una jornada con días no seguidos (p. ej. lun, mié, vie). El texto se arma separado por comas.
- **Otras pantallas con la jornada nueva:** la app del inspector y los portales leen sus propias jornadas; no hay cambio en ellos y no los revisé con el valor editado.

**Diferencias**
- **Dónde se edita:** Configuración general ya tenía lugar (pestañas Compañía, Moneda e Impuestos), así que agregué la pestaña «Agenda» ahí y no en la pantalla de la Agenda.
- **Dónde vive el valor editado:** en `SiriusJornada` (memoria de la sesión, como el resto de Configuración general) y se refleja en `SIRIUS_AGENDA.jornadaDefecto`. Con la conexión, el valor definitivo es el que publica la base.
- **Arreglo que no estaba pedido, en `sirius-usuarios.js`:** un comentario en línea ocultaba `conflictos`, `cfgGeneral` e `impuestos` en la matriz de permisos. Por eso Configuración general no abría para nadie y `confgeneral`, `confimpuestos` y `confmoneda` caían en Inicio. Ahora abren; el Administrador ve Configuración general y Conflictos, y Finanzas ve Configuración general. Es la única diferencia visible en las escenas sin conexión (menú de Administración y esas tres escenas).
- **Qué cambió en cada escena que mostraba 08:00–18:00:**
  - cxcoordjornada: Gabriela Toapanta (sin jornada propia) pasa de «sábado 14/11 a las 08:00» a «sábado 14/11 a las 08:30»; la propuesta inicial también (08:30). Mauricio Endara (lun a vie, 08:00–17:00) y Luis Andrade (09:00–18:00) siguen igual.
  - cxcoordins: la primera propuesta pasa de 08:00–08:45 a 08:30–09:15.
  - cxcoordcambiar y cxcoordmismo: sin cambio (la visita del próximo lunes de 10:00 a 10:45).
  - cxcoordpasado y cxvisitariesgos: sin cambio (Luis Andrade, con jornada propia; el error «La hora ya pasó: hoy se puede agendar desde las 07:00.» sigue igual).
- **Días de los inspectores:** un `dias` con 0 en la jornada propia de un inspector se lee como domingo (7).
- **Jornada de Mauricio Endara:** existe solo en cxcoordjornada, como en la etapa anterior.
- **Qué se publica:** `datos` es `SIRIUS_AGENDA` completo con `jornadaDefecto`, y `version` sale de `SiriusPublicar.versionDe('SIRIUS_AGENDA', 0)`.
- **Fecha del historial:** usa la del prototipo (18/10/2026 · 20:30); Coordinación en agendajornada usa el reloj real, como las demás escenas de la base.
- **agendajornada:** es una escena con la conexión simulada solo en la escena, con el caso 50095 «En coordinación».

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| agendajornada | Configuración general › Agenda: el parámetro con su valor inicial y el borrador lun a vie 09:00–17:00 con motivo (con `?jdesde=18:00`, el error de horas; con `?cxok=0`, el rechazo); el caso 50095 sirve para ver Coordinación con la jornada nueva |
| cxcoordjornada | Reagendar fuera de la jornada de Mauricio Endara; el caso 50092 compara propuestas, ahora con 08:30 para quien no tiene jornada propia |
| cxcoordins | Coordinar inspección: primera propuesta a las 08:30 |

También abrí cxcoordmismo, cxcoordcambiar, cxcoordpasado, cxvisitariesgos, confgeneral, confimpuestos, confmoneda, agendasemana, agendadia, agendamover, agendaok, coord, coordchoque, coordauto, coordvis, envioenlace, enlaceagenda, enlacesincorreo, coordcxmoto, cxvisitaenlace, cxvisitacancelar y cxnumerocruce.

---

## 18/10/2026 · 20:30 — Etapa P-6f-0f

Publiqué la etapa P-6f-0f (Versión 202). Con la conexión, Coordinación ya no ofrece al inspector actual, respeta la jornada de cada inspector y guarda en la base los vehículos y la dirección de cada visita (DEC-232). Sin la conexión, queda igual.

**Qué cambió**
- **Mismo inspector:** en «Cambiar inspector», el inspector actual no aparece en la lista. Si se escribe su nombre, se ve «No hay inspectores con ese criterio» y el aviso «Ya es el inspector de esta visita».
- **Jornada del inspector:**
  - Sale de la Agenda (`SIRIUS_AGENDA.disponibilidad`, por nombre). Si el inspector no tiene jornada configurada, se usa lun a sáb, 08:00–18:00.
  - La propuesta es el primer espacio libre de 45 minutos dentro de la jornada del inspector elegido, sin chocar con sus visitas de la base. Al elegir otro inspector se vuelve a proponer, mientras la fecha y la hora no se hayan tocado.
  - Fuera de la jornada aparece el error en línea «Fuera de la jornada de <inspector> (<días>, <inicio>–<fin>)». Va en la hora de inicio o, si solo el fin se pasa, en la hora de fin. Se vuelve a validar al cambiar de inspector.
- **Vehículos de la visita:**
  - `agendarVisita` lleva `riesgos` en agendar, reagendar y cambiar inspector.
  - Al dividir se envían dos llamadas: «agendar» de la visita nueva con su riesgo y «reagendar» de la de origen con los que le quedan y el motivo «Se dividió la visita: …».
  - La tarjeta toma los vehículos de `visitasBase[].riesgos`; sin ese dato, la visita lleva todos los del caso.
  - «Vehículos por coordinar» cuenta solo los que no están en una visita abierta.
  - Después de `{ ok: true }` la pantalla vuelve a leer la base. Con `{ ok: false }` la visita vuelve con sus vehículos anteriores, Coordinación se cierra sin la vista previa del mensaje y se ve el mensaje de la base.
- **Dirección de la visita:** se toma de `visitasBase[].direccion` y, sin ese dato, de la del caso.

**Verificado**
- **Escenas a 1280×720 y 1920×1080, desde el selector:** cxcoordmismo, cxcoordjornada, cxvisitariesgos, cxcoordins, cxcoordpasado y cxcoordcambiar. Ninguna mostró errores ni scroll horizontal.
- **Sin la conexión, comparadas con la versión anterior a las dos medidas:** coord, coordchoque, coordauto, coordvis, envioenlace, enlaceagenda, enlaceagendamodalidad, enlacesincorreo, coordcxmoto, cxvisitaenlace, cxvisitacancelar y cxnumerocruce.
  - Quedan iguales.
  - En enlaceagenda solo cambia el código del enlace, que se genera al azar en cada carga.
- **cxcoordmismo:** con «Mauricio Endara» escrito, la lista queda vacía y aparece «Ya es el inspector de esta visita».
- **cxcoordjornada** (reloj real 14/11/2026, 00:27):
  - Reagendar la visita del lunes 16/11 a las 00:00 y a las 19:00 (`?cxhora=19:00`) da «Fuera de la jornada de Mauricio Endara (lun a vie, 08:00–17:00)».
  - De 16:45 a 17:30 el error aparece en la hora de fin.
  - En el caso 50092 se propone:
    - Mauricio Endara (lun a vie): lunes 16/11 a las 08:00.
    - Gabriela Toapanta, sin jornada (lun a sáb, 08:00–18:00): sábado 14/11 a las 08:00.
    - Luis Andrade (de 09:00 a 18:00 en la Agenda): sábado 14/11 a las 09:00.
  - Al pasar de Mauricio a Gabriela con 16:45–17:30, el error se quita. Al volver a Mauricio, el error regresa.
- **cxvisitariesgos:**
  - Nueva visita con PRB1212, Luis Andrade y la dirección «Av. Mariana de Jesús E7-42 y La Pradera, Quito».
  - La base guardó `riesgos: ['50093-V1']` y esa dirección. Al releer, la tarjeta muestra PRB1212 y esa dirección.
  - «Vehículos por coordinar» muestra 2 (PR121A y PRB1213, con «Marca, Modelo, Año») y ningún «Sin placa».
  - Con `?cxrech=1` la visita no queda, vuelven los 3 vehículos y se ve «El inspector Luis Andrade no existe en la base».
- **cxcoordcambiar:** cambiar a Luis Andrade y reagendar siguen funcionando, también con `?cxrech=1`. El reagendar guarda `riesgos` y `direccion` en la base.
- **Conexión temporal** (copia aparte, no simulada): `agendarVisita` llegó con `riesgos` en todos los casos.
  - Agendar: `riesgos: ['50093-V1']`, con la dirección escrita.
  - Reagendar: `riesgos: ['50093-V1']` y el motivo.
  - Dividir una visita de Ramos Generales con 2 riesgos:
    - «agendar» de la V2 con `['50094-R2']`;
    - «reagendar» de la V1 con `['50094-R1']` y «Se dividió la visita: 1 riesgo pasa a la V2»;
    - la pantalla muestra las dos visitas como las guardó la base.
  - Con `{ ok: false }` la visita no quedó y volvieron los 3 vehículos.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados:
  - contrato con `agendarVisita.riesgos`, `visitasBase[].riesgos` y `direccion`;
  - `riesgos[]` con `label`, `detalle` y `nowrap`;
  - 593 escenas en datos-escenas y KNOWN_ESC 550.

**No verificado**
- **La base real:** se probó contra la conexión simulada y una temporal.
- **El caso 50012 de la base:** no lo tengo.
- **De día:** las pruebas se hicieron de madrugada (reloj real). Con el reloj a media jornada no se revisó en pantalla.
- **Jornadas de la Agenda:** no probé días no seguidos (p. ej. lun, mié, vie). El texto se arma igual, separado por comas.

**Diferencias**
- **Visitas abiertas:** cuentan como asignadas, además de las cuatro que pide la etapa, «Autoinspección enviada», «En curso por el cliente» y «Realizada». Así un vehículo ya inspeccionado no vuelve a «por coordinar».
- **Reagendar:** solo permite quitar vehículos de la visita, no agregar. Para agregar se crea otra visita.
- **Dividir:** en el prototipo solo se ofrece en Ramos Generales, como antes. Por eso lo probé con riesgos y no con vehículos, y el motivo dice «riesgo» o «vehículo» según el ramo.
- **Jornada de Mauricio Endara:** existe solo en cxcoordjornada (en `coordEscena.disponibilidad`, sin tocar `SIRIUS_AGENDA`). En las demás escenas no tiene jornada configurada.
- **cxcoordcambiar y cxcoordmismo:** la visita pasa al próximo lunes de 10:00 a 10:45. Antes se calculaba con la hora real y de madrugada caía fuera de toda jornada.
- **Agenda de las escenas:** las visitas de demostración de Mauricio caen dentro de lun a sáb, 08:00–18:00.
- **cxcoordins:** al elegir a Mauricio Endara se propone su primer espacio libre (09:45 en la prueba). Antes quedaba la hora con choque. El aviso de choque se ve si se escribe 08:00.
- **Rechazo de la base:** con `{ ok: false }`, Coordinación se cierra y vuelve a empezar. Antes quedaba abierta la vista previa «Visita agendada» aunque la base la había rechazado.

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| cxcoordmismo | Cambiar inspector escribiendo al inspector actual: «Ya es el inspector de esta visita» |
| cxcoordjornada | Reagendar a las 00:00 (o 19:00 con `?cxhora=19:00`) fuera de la jornada de Mauricio Endara (lun a vie, 08:00–17:00); el caso 50092 sirve para comparar propuestas |
| cxvisitariesgos | Nueva visita con 1 de 3 vehículos y su dirección; al agendar quedan 2 por coordinar (con `?cxrech=1`, el rechazo) |

También abrí cxcoordins, cxcoordpasado, cxcoordcambiar, coord, coordchoque, coordauto, coordvis, envioenlace, enlaceagenda, enlaceagendamodalidad, enlacesincorreo, coordcxmoto, cxvisitaenlace, cxvisitacancelar y cxnumerocruce.

---

## 18/10/2026 · 20:30 — Etapa P-6f-0e

Publiqué la etapa P-6f-0e (Versión 201). Con la conexión, Coordinación usa los inspectores y el reloj de la base (DEC-230 y DEC-231). Sin la conexión, queda igual.

**Revisión del punto 3:** con la conexión, Reagendar y Cambiar inspector no se guardaban en la base: solo cambiaban en pantalla. Ahora se guardan con `agendarVisita`, como pide DEC-231.

**Qué cambió**
- **Reloj real (DEC-230):** en los casos de la base, «hoy», la propuesta, la carga del día y las validaciones usan la fecha y hora reales de Ecuador (America/Guayaquil).
  - **Propuesta:** hoy a la hora mínima si la visita termina antes de las 18:00; si no, mañana a las 08:00.
  - **Hora mínima:** la actual redondeada a los 15 minutos siguientes. Antes, el error es «La hora ya pasó: hoy se puede agendar desde las HH:MM.».
  - **Duración:** mínimo 15 minutos («La visita debe durar al menos 15 minutos.») y 45 por defecto. La hora de fin sigue a la de inicio hasta que se cambia, y una videollamada sin hora de fin se envía con 45 minutos.
  - Los casos de ejemplo y las escenas simuladas anteriores siguen con el reloj de demostración.
- **Inspectores de la base (DEC-231):**
  - **Lista:** sale de `SIRIUS_CONEXION.inspectores`, solo con los activos y sin agencias. Debajo del nombre muestra «Agencia Eurosurvey · Quito», «Independiente · Quito», «Interno · Quito» o «Sin zonas».
  - **Carga y choques:** «N visitas el dd/mm» y los choques salen de las visitas de la base de todos los casos, sin las Cancelada, Enviada ni Terminada.
  - **Guardado:** agendar, reagendar y cambiar inspector envían `agendarVisita { caso, visita, accion, inicio, minutos, inspector, modalidad, direccion, motivo }`.
  - **Motivo:** reagendar y cambiar inspector piden un motivo obligatorio (mínimo 10 caracteres). Cambiar inspector conserva la fecha y la hora.
  - **Rechazo:** con `{ ok: false }` la visita vuelve como estaba y se muestra el mensaje de la base.
- **Arreglos con la conexión:**
  - El celular y el correo «—» de la ficha ya no llegan como contacto de la visita; antes impedían agendar y reagendar.
  - Al reagendar una visita de la base, la tarjeta muestra la cita nueva.

**Verificado**
- **Escenas a 1280×720 y 1920×1080, desde el selector:** cxcoordins, cxcoordpasado y cxcoordcambiar. Ninguna mostró errores ni scroll horizontal.
- **Escenas anteriores comparadas con la versión anterior** a las dos medidas: coord, coordchoque, coordauto, coordvis, envioenlace, enlaceagenda, enlaceagendamodalidad, enlacesincorreo, coordcxmoto, cxvisitaenlace, cxvisitacancelar y cxnumerocruce.
  - Quedan iguales.
  - En enlaceagenda solo cambia el código del enlace, que se genera al azar en cada carga.
- **cxcoordins** (reloj real 13/11/2026 23:19; propone 14/11 de 08:00 a 08:45):
  - La lista muestra «Mauricio Endara · Agencia Eurosurvey · Quito · 2 visitas el 14/11», «Luis Andrade · Independiente · Quito · 0 visitas el 14/11» y «Gabriela Toapanta · Interno · Quito · 0 visitas el 14/11». No aparecen la agencia Eurosurvey como inspector ni Diego Salinas (inactivo).
  - Las visitas Cancelada y Terminada de Mauricio no cuentan.
  - Al elegirlo aparece «Mauricio Endara tiene otra visita de 08:00 a 08:45».
  - Con Luis Andrade se agenda y la base simulada guarda la visita de 08:00 a 08:45.
- **cxcoordpasado:** el formulario abre con hoy 13/11/2026 de 22:15 a 23:00 (45 minutos) y el error en línea «La hora ya pasó: hoy se puede agendar desde las 23:30.».
- **cxcoordcambiar:**
  - Abre con Luis Andrade y el motivo escrito. Al confirmar, la tarjeta pasa a Luis Andrade con la misma cita.
  - Con `?cxrech=1` la tarjeta vuelve a Mauricio Endara y aparece «El inspector Luis Andrade no existe en la base».
  - Un motivo de 5 caracteres muestra «Escribe el motivo (mínimo 10 caracteres).».
  - Al reagendar: la hora de fin sigue a la de inicio (10:00 → 10:45), 10 minutos dan «La visita debe durar al menos 15 minutos.» y, con el motivo, la tarjeta muestra «Cita 14/11/26 · 10:00».
- **Conexión temporal** (copia aparte, no simulada): `agendarVisita` llegó con esta forma:
  - Agendar: `accion: 'agendar'`, `visita: 1`, `inicio: '2026-11-14T08:00:00-05:00'`, `minutos: 45`, `inspector: 'Luis Andrade'`, la modalidad, la dirección y `motivo: ''`.
  - Cambiar inspector: `accion: 'cambiarInspector'` con la misma `inicio` y el motivo.
  - Reagendar: `accion: 'reagendar'`, `inicio: '2026-11-14T11:00:00-05:00'` y el motivo.
  - Con `{ ok: false }` la visita volvió y se vio «El inspector Gabriela Toapanta no existe en la base». También probé «La hora elegida ya pasó».
  - Un inspector interno sin zonas aparece como «Interno · Sin zonas».
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: contrato con `SIRIUS_CONEXION.inspectores` y `agendarVisita`, 590 escenas en datos-escenas y KNOWN_ESC 547.

**No verificado**
- La base real: se probó contra una conexión simulada y una temporal.
- La propuesta en otro horario del día: la probé a las 23:19 y 23:34 (propone mañana a las 08:00). La regla de hoy a la hora mínima la revisé con cálculos, no en pantalla a media jornada.
- El caso 50012 de la base: no lo tengo. Con el reloj real y la duración mínima ya no se puede agendar una visita como la del 18/10 de 20:30 a 20:32.

**Diferencias**
- **Escenas simuladas anteriores** (cxvisitaenlace, cxvisitacancelar, cxnumerocruce y las de autoinspección): siguen con la lista y el reloj de demostración, porque su conexión simulada no trae `inspectores`. Con una conexión real que no envíe `inspectores`, la lista queda vacía.
- **Solo para las tres escenas nuevas:** la conexión simulada usa el reloj real (`relojReal`), y las visitas de Mauricio Endara se calculan para el día que propone Coordinación al abrir la escena.
- **Escenas nuevas en presencial:** cxcoordins y cxcoordpasado abren en Presencial, para que se vea la hora de fin y los 45 minutos. La recomendación del sistema sigue siendo Virtual guiada.
- **Inspector interno en las escenas:** se llama Gabriela Toapanta, inventado para la base simulada. «Sin zonas» se probó con la conexión temporal.
- **Duración por defecto:** antes, una visita sin hora de fin se enviaba con 60 minutos; ahora va con 45.

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| cxcoordins | Inspectores de la base con su línea y la carga del día; Mauricio Endara con 2 visitas el día propuesto |
| cxcoordpasado | Hora ya pasada del día real, con el error en línea y la duración propuesta de 45 minutos |
| cxcoordcambiar | Cambiar inspector con motivo; con `?cxrech=1`, «El inspector Luis Andrade no existe en la base» |

También abrí coord, coordchoque, coordauto, coordvis, envioenlace, enlaceagenda, enlaceagendamodalidad, enlacesincorreo, coordcxmoto, cxvisitaenlace, cxvisitacancelar y cxnumerocruce.

---

## 18/10/2026 · 20:30 — Etapa P-6f-0b

Publiqué la etapa P-6f-0b (Versión 200). La primera publicación quedó como Versión 199 con el registro diciendo 197; la Versión 200 solo corrige el número en el registro y no cambia nada más.

Agrega «Eliminar formulario» y el bloqueo de versiones con visitas en curso (DEC-217, amplía DEC-208), y los conteos de Formularios con la base (D-6).

**Qué cambió**
- **Eliminar formulario (DEC-217):**
  - Está en el menú de la fila y en el editor, y solo lo ve el Administrador.
  - **Cuándo se deshabilita:** si no se puede eliminar, queda deshabilitado con el primer motivo, en este orden:
    - «Tiene una versión Vigente» o «Programada»;
    - «Tiene N informes vinculados»;
    - «La usan N casos activos»;
    - visitas en curso;
    - «La nombra la regla de completado N» u otra configuración publicada (criterios de autoinspección y documentos requeridos de Modalidades, documentos del cliente, controles, documentos PDF y reglas de llenado).
  - **Casos activos:** con la conexión, los de `casos[].formularios` (con o sin « vN») cuyo estado no es final en SIRIUS_FLUJO. Sin la conexión, los usos de ejemplo.
  - **Diálogo:**
    - muestra el nombre y las versiones que se quitan (número y estado);
    - muestra la revisión: «Se revisaron N informes de la plantilla: 0 vinculados», los casos activos revisados y las configuraciones;
    - pide un motivo de una línea (`data-eliminar-motivo`, mínimo 10 caracteres), y «Eliminar formulario» queda deshabilitado hasta escribirlo;
    - avisa «Esto no se puede deshacer». Ya no hay «Deshacer».
  - **Con la conexión:**
    - Se publica `SIRIUS_FORMULARIOS` sin el formulario y con `eliminados`, para que un formulario del prototipo no reaparezca al volver a leer la base.
    - El historial dice «Eliminó el formulario <nombre> · <motivo>».
    - Con `{ ok: false }` el formulario vuelve y se muestra el mensaje. El nombre queda libre.
- **Eliminar versión (DEC-217):**
  - Se bloquea con «Tiene N visitas en curso con esta versión» (`visitasBase[].plantilla`).
  - Las visitas en curso sin versión registrada no bloquean. El diálogo avisa «1 visita en curso sin versión registrada» y cuenta las visitas revisadas.
- **Conteos con la base (D-6):**
  - «Informes con esta versión» sale de `SIRIUS_CONEXION.informes` (la función de DEC-208).
  - «Casos en curso» sale de las visitas en curso con esa versión.
  - Los casos activos de la plantilla salen de `casos[].formularios`.
  - Se usan en las subfilas de la lista, el panel Versiones («Uso: Informes N · casos en curso N»), el editor, «Retirar» y su diálogo.
  - Sin la conexión, los conteos son los de antes.

**Verificado**
- **Escenas a 1280×720 y 1920×1080, desde el selector:** formeliminar, formeliminarbloq, versionvisitacurso, cxformconteos, versioneliminar, versioneliminarok y la lista de Formularios (escena form). Ninguna mostró errores ni scroll horizontal.
- **Sin conexión:** la lista (form y formmodalidades) queda idéntica a la versión anterior. En versioneliminar y versioneliminarok solo cambian el botón «Eliminar formulario» y el formato «Uso: Informes N · casos en curso N»; los números son los mismos (por ejemplo, «Uso: Informes 1.284 · casos en curso 23» en la versión 1).
- **formeliminarbloq:** los cuatro formularios muestran «Eliminar formulario» deshabilitado con «Tiene una versión Vigente», «Tiene 3 informes vinculados», «La usan 2 casos activos» (el tercer caso, Emitida, no cuenta) y «La nombra la regla de completado 2».
- **formeliminar:**
  - El diálogo dice «Se revisaron 0 informes de la plantilla: 0 vinculados» y «Se revisó 1 caso activo de la base: 0 usan la plantilla».
  - Con 9 caracteres el botón sigue deshabilitado; con el motivo se habilita.
  - Al confirmar, el formulario desaparece de la lista y el historial dice «Eliminó el formulario Inspección de bodegas (prueba) · Formulario de prueba sin uso» y «Publicada en la base (SIRIUS_FORMULARIOS · eliminarFormulario · versión 1)».
  - Con `?cxok=0` vuelve con «La base rechazó la acción (prueba). Se deshizo el cambio.».
- **versionvisitacurso:** la v1 tiene «Eliminar versión» bloqueado con «Tiene 1 visita en curso con esta versión» («Uso: Informes 0 · casos en curso 1»). La v2 se puede eliminar, y el diálogo dice «Se revisaron 2 visitas en curso de la plantilla: 0 con esta versión» y «1 visita en curso sin versión registrada».
- **cxformconteos (Vehículos livianos con la base simulada):**

| Versión | Informes con esta versión | Casos en curso |
|---|---|---|
| v4 (Vigente) | 5 (1 de la base y 4 de la escena) | 3 |
| v3 (Retirada) | 2 | 1 |

  - Los casos en curso de la v4 son 50071 y 50072 (presencial en curso) y 50073 (autoinspección con enlace en curso). El de la v3 es 50074.
  - La visita terminada del 50075 (Emitida) no cuenta.
  - Casos activos de la plantilla: 4 (50071 a 50074), calculados con la misma regla del código.
  - Sin conexión, los de ejemplo son «Informes 1.284 · casos en curso 23» en la v1 y 0 en las demás.
- **Prueba con una conexión temporal** (copia aparte):
  - Al eliminar «Inspección de bodegas (prueba)», `publicarConfiguracion` lleva `clave: 'SIRIUS_FORMULARIOS'`, `datos.formularios` sin él, `eliminados: ['fpr1']`, `cambio.accion: 'eliminarFormulario'` y el motivo.
  - Al volver a abrir Formularios no reaparece, y tampoco un formulario del prototipo marcado como eliminado (Pesados).
  - Con `{ ok: false }` vuelve a la lista con el mensaje.
- **Roles:**
  - Solo el Administrador ve Formularios en el menú.
  - Forzando el rol del componente a Coordinador de inspecciones, Ejecutivo de inspecciones y Suscriptor, «Eliminar formulario» no aparece ni en el menú de la fila ni en el editor.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: contrato con `visitasBase[].plantilla` y `eliminados`, 587 escenas en datos-escenas y KNOWN_ESC 544.

**No verificado**
- Que la base real envíe `visitasBase[].plantilla` y acepte `eliminados` en `SIRIUS_FORMULARIOS`: se probó contra una conexión simulada y una temporal.
- La recarga real de la página con la base: la simulé leyendo otra vez la base al volver a abrir Formularios.

**Diferencias**
- **Lista:** no hay una columna de uso; los conteos van en las subfilas de versiones. Con la conexión, la subfila agrega «· casos en curso: N». Sin la conexión, queda igual.
- **Panel Versiones:** el uso dice «Uso: Informes N · casos en curso N» también sin conexión (antes, «Informes: N · casos en curso: N»; mismos números). El panel tiene 36 px de margen a la derecha: el aviso «Tiene 1 visita en curso con esta versión» del botón deshabilitado salía 4 px de la pantalla a 1280.
- **Regla de completado:** las reglas no tienen hoy una condición de plantilla en su pantalla. La revisión lee `plantilla`, `plantillas`, `formulario` o `formularios` si una regla los trae; la escena lo simula en la regla 2.
- **Documentos requeridos de Modalidades:** cuentan como configuración que nombra la plantilla. Los formularios vigentes ya están bloqueados antes por su versión Vigente.
- **Antes solo se podían eliminar formularios en borrador; ahora también** los que tienen solo versiones Retiradas sin uso. Todos pasan por el diálogo con motivo.
- **Arreglos en el editor con formularios publicados en la base:** un campo publicado sin opciones o una grilla sin columnas ya no rompen el editor, y las versiones sin autor ya no dicen «por undefined».

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| formeliminar | Formulario de prueba con v1 y v2 Retiradas; se elimina con motivo y queda en el historial |
| formeliminarbloq | Cuatro formularios bloqueados, cada uno con su motivo |
| versionvisitacurso | v1 bloqueada por 1 visita en curso; v2 permitida con el aviso de 1 visita sin versión registrada |
| cxformconteos | Vehículos livianos con conteos de la base simulada |

También abrí versioneliminar, versioneliminarok y la lista de Formularios (escena form).

---

## 18/10/2026 · 20:30 — Etapa P-6f-0d

Publiqué la etapa P-6f-0d (Versión 196). La primera publicación quedó como Versión 195 con el registro diciendo 194; la Versión 196 solo corrige el número en el registro y no cambia nada más.

Con varios riesgos, el Resumen muestra cada riesgo en su propia tarjeta con contorno y cabecera, y los valores en una tabla con «Total del caso» (DEC-226). Con un solo riesgo no cambia nada.

**Qué cambió**
- **Título:** «Objeto a asegurar · 3 vehículos» («· 2 equipos», «· N ubicaciones», «· N ramos»).
- **Tarjeta por riesgo:** borde de 1 px (`--border-default`), esquinas de 8 px y 12 px entre tarjetas.
- **Cabecera** (fondo `--surface-subtle`, 12 × 16 px de relleno), en una línea:
  - el número en un círculo;
  - el bien con su identificación en negrita: «Kia Rio 2022 · PRB1212», «Excavadora Caterpillar 320 GC · CAT0320GCJ5H01234» o la dirección;
  - el estado con el mismo chip de la bandeja;
  - el valor total a la derecha;
  - la flecha.
- **Abrir y cerrar:** toda la cabecera abre y cierra con clic, Enter o Espacio, con `aria-expanded` y `aria-controls`. Bajo 720 px, el estado y el valor bajan a una segunda línea.
- **Cuerpo:** los campos de DEC-219 en dos columnas (una bajo 720 px). Al final, los valores del riesgo: Casco, Extras y Total, o Suma asegurada.
- **Abiertas o cerradas:**
  - Con hasta 3 riesgos, todas abiertas. Con 4 o más, cerradas, con «Expandir todo» / «Contraer todo».
  - Lo abierto se mantiene al navegar por el caso y no se guarda.
- **Tabla de valores:**
  - «Vehículo | Casco | Extras | Total»; para equipos, ubicaciones y ramos, «Riesgo | Suma asegurada».
  - Cifras a la derecha, separador fino entre filas y «Total del caso» en negrita con borde superior de 2 px.
- **Dónde aplica:** con la conexión (`cxObjeto`) y en los casos de ejemplo de varios riesgos.
- **Componente nuevo:** `sirius-riesgos.js` (`SiriusRiesgos.Tarjetas`).

**Verificado**
- **Escenas a 1280×720, 1920×1080 y 700×800:** abrí resumenflotabase, resumenflota5, resumenequipos2, resumenvehsol y el caso de ejemplo 20196. Ninguna mostró errores, «[object Object]» ni scroll horizontal. resumenflota5 y resumenequipos2 también abren desde el selector.
- **Totales calculados:**

| Escena o caso | Riesgos | Total del caso |
|---|---|---|
| resumenflotabase | 15.000 + 2.400 + 33.200 | USD 50.600,00 |
| resumenflota5 | 15.000 + 2.400 + 33.200 + 29.300 + 28.400 | USD 108.300,00 |
| resumenequipos2 | 31.500 + 185.000 | USD 216.500,00 |
| resumenvehsol (un riesgo) | 18.500 + 650 | USD 19.150,00, sin cambios |
| 20196 (ejemplo) | 30.900 + 21.000 + 35.840 | USD 87.740,00 |
| 20198 (ejemplo) | 31.200 + 18.900 | USD 50.100,00 |
| 20204 (ejemplo, equipos) | 100.000 + 180.000 + 28.000 | USD 308.000,00 |

  Los tres casos de ejemplo dan el mismo total que en la versión anterior.
- **Estado inicial:** resumenflota5 abre con las 5 tarjetas cerradas y «Expandir todo». resumenflotabase, resumenequipos2 y 20196 abren con todas las tarjetas abiertas.
- **Teclado:** Tab llega a «Expandir todo» y luego a cada cabecera, y cada `aria-controls` apunta a su cuerpo. Enter y Espacio la abren y la cierran, y el foco queda en la cabecera. «Expandir todo» abre las 5 y cambia a «Contraer todo».
- **Navegación por el caso:** después de cerrar la tarjeta 2 y pasar a Historial y volver al Resumen, sigue cerrada.
- **Con un solo riesgo:** resumenvehsol, veh, resumenequipo, resumenubicacion y svflota quedan idénticas a la versión anterior.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: 583 escenas en datos-escenas y KNOWN_ESC 540.

**No verificado**
- Ubicaciones múltiples con la conexión: el código las arma, pero no hay escena.
- Casos de ejemplo de varios ramos de Ramos Generales: no encontré uno con más de un riesgo para abrirlo.
- Lectores de pantalla: revisé los atributos, no la lectura con un lector real.

**Diferencias**
- **Ancho de 720 px:** se mide sobre la ventana, no sobre la tarjeta. A 1280 la tarjeta mide 678 px y usa el diseño ancho; a 700 px usa el angosto.
- **Tabla bajo 720 px:** con vehículos queda «Vehículo | Total», con casco y extras debajo del nombre, porque las cuatro columnas no entraban en unos 290 px.
- **Montos que no vienen:** aparecen como «—», por ejemplo los extras de la Kia y la Suzuki en las escenas simuladas.
- **Cabecera:** es un elemento con `role="button"`, porque contiene el chip de estado.
- **Equipos del caso 20204:** el título sale del tipo, la marca, el modelo y la serie (PIN) de `SIRIUS_EQUIPOS.ejemplo`. El cuerpo muestra campos de equipo; antes decía «Ramo» y «Línea de negocio».
- **Estado en las escenas simuladas:** cada riesgo muestra el estado del caso simulado («Por completar»), mientras la cabecera del caso dice «Agendado». Viene de la simulación de P-6f-0a; no lo cambié.

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| resumenflota5 | 5 vehículos con las tarjetas cerradas, «Expandir todo» y la tabla con Total del caso USD 108.300 |
| resumenequipos2 | 2 equipos móviles con las tarjetas abiertas y Total del caso USD 216.500 |

También abrí resumenflotabase, resumenvehsol y el caso de ejemplo 20196.

---

## 18/10/2026 · 20:30 — Etapa P-6f-0c

Publiqué la etapa P-6f-0c (Versión 193). Aplica el catálogo de sucursales de Aseguradora del Sur (DEC-220) y publica Provincias en la forma del archivo (DEC-187).

**Qué cambió**
- **Sucursales (DEC-220):**
  - `SUC` queda con las 11 sucursales, en este orden: Quito, Loja, Cuenca, Machala, Santo Domingo, Riobamba, Ambato, Ibarra, Manta, El Coca y Guayaquil.
  - «Quito Norte» y «Quito Sur» pasan a «Quito» en 17 archivos: casos de ejemplo, alcance de los usuarios, zonas de los inspectores (agenda, red y app), agencias, Niveles, monitor, completado, coordinación, notificaciones y descripciones de escenas.
  - Las listas quedan sin repetidos (['Quito Norte', 'Quito Sur'] queda ['Quito']).
  - En los pesos de los datos de ejemplo de Niveles, Quito suma 30 + 15 = 45.
  - La lógica de las zonas de los inspectores no cambió (transitorio hasta DEC-223). «Latacunga» de catalogosforma sigue como ejemplo de sucursal nueva.
- **Provincias (DEC-187):**
  - Se publica como `provinciaRegion`, un objeto `{ provincia: región }` como en `datos-ejemplo.js`. Antes iba como `prov`, una lista de registros. Al publicar se quita la clave `prov` anterior.
  - La lectura acepta también lo publicado antes con el id de la pantalla (`prov`). Aplica en Catálogos, el motor de calificación, el informe de Ramos Generales y las listas de Formularios.
  - Lo guardado vuelve a `SIRIUS_EJEMPLO.catalogos.provinciaRegion` en memoria. «Ciudad → sucursal» no cambia.

**Verificado**
- **Búsqueda de «Quito Norte» y «Quito Sur»** en todo el proyecto, sin contar registro-envios.md ni inventario-proyecto.md: antes 74 coincidencias en 17 archivos; ahora 0.
- **Escena sucursales11:** Catálogos › Sucursales muestra «1–11 de 11» y Nueva solicitud › Sucursal ofrece las mismas 11 en el mismo orden.
- **Escenas a 1280×720 y 1920×1080:** abrí sucursales11, catalogosforma, niv, flujoresp, monitor, inspyo, agendasemana, agendadia, agendamover, agendaok, usuarios, usuarioinvitar, usuarioficha, usuariosuspender, agencias, roles y complprobar. Ninguna mostró errores, «[object Object]» ni scroll horizontal. Las comparé con la versión anterior, leyendo «Quito Norte» y «Quito Sur» como «Quito».
- **niv y roles:** idénticas a la versión anterior.
- **Escenas con cambios esperados por el nuevo catálogo:**
  - Catálogos › Sucursales: «1–11 de 11» (en catalogosforma, «1–12 de 12»).
  - Flujo y SLA › Responsables, coordinador por sucursal: «1–11 de 11» (antes «1–7 de 7»).
  - Los filtros de sucursal de Agenda y de Monitor listan las 11.
  - En Usuarios (lista, ficha, suspender), Agencias, inspyo y agendamover, los valores repetidos quedan en uno: «Quito» donde decía «Quito, Quito». En agendamover: «(sus zonas: Quito)».
- **Escenas del Monitor:** el monitor y sus escenas muestran los mismos números que antes. La única diferencia es la lista de sucursales del filtro. La campana también queda en 17.
- **Provincias con una conexión temporal** (copia aparte): al guardar una provincia nueva, `publicarConfiguracion` lleva `clave: 'SIRIUS_CATALOGOS'` y `datos.provinciaRegion` como objeto (25 provincias, con la nueva en «Insular»), sin clave `prov`. Con `{ ok: false }` vuelve a 24 provincias.
- **Lectura de `prov`:** con el catálogo en la forma anterior (`prov`, lista de `{ provincia, region }`), Catálogos › Provincia → región muestra las filas.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: 581 escenas en datos-escenas y KNOWN_ESC 538.

**No verificado**
- Que la base real acepte `provinciaRegion` como objeto; se probó contra una conexión temporal.
- Las escenas de Agenda y Usuarios que no están en la lista de arriba, ni otras pantallas con filtros de sucursal. Solo busqué el texto en el código.

**Diferencias**
- **Monitor:** el modelo de ejemplo usa pesos por sucursal. Con un solo «Quito» (0,27 + 0,11 = 0,38), los cuellos de botella cambiaban (por ejemplo, 6 pasaban a 5 y la campana bajaba de 17 a 16). Para que el monitor muestre lo mismo, Quito queda con 0,27 y «Quito Sur» pasó a **Santo Domingo** con 0,11, en el mismo lugar de la lista. Es el único caso donde usé otra sucursal.
- **Niveles:** los datos de ejemplo suman 45 en Quito, como pediste.
- **Coordinación:** las zonas «Quito norte» y «Quito sur y valles» pasaron a «Quito» y «Quito y valles». Ahí eran el texto de la zona de cada inspector.
- **Se mantiene «Quito norte» (con minúscula)** en el mapa esquemático de la ruta del día de la app del inspector (datos-ejemplo.js, sirius-app-inspector.js y una descripción de escena). Es el esquema geográfico del mapa y no una sucursal.
- **Alcance «Elegir» y «no cubre»:** no necesitaron otra sucursal. Marco Tapia y el segundo inspector de Eurosurvey quedan con una sola sucursal («Quito»); agendamover sigue mostrando que Marco Tapia no cubre Ambato.
- **Dato que ya existía:** en `datos-ejemplo.js`, Galápagos tiene como región «Galápagos» y no «Insular». No lo cambié.
- **Fuera de alcance:** quedan sin cambiar «Ciudad → sucursal» (DEC-221, etapa posterior) y las zonas de los inspectores (DEC-223).

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| sucursales11 | Catálogos › Sucursales con las 11; Nueva solicitud › Sucursal con las mismas, en ese orden |

También abrí catalogosforma, niv, flujoresp, monitor, inspyo, las de Agenda (agendasemana, agendadia, agendamover, agendaok) y las de Usuarios (usuarios, usuarioinvitar, usuarioficha, usuariosuspender, agencias, roles).

---

## 18/10/2026 · 20:30 — Etapa P-6f-0a

Publiqué la etapa P-6f-0a (Versión 192). Corrige tres cosas de la etapa anterior: los catálogos publicados en la forma del archivo (DEC-187), el cilindraje del Resumen (DEC-219) y la barra fija sin pendientes repetidos (DEC-218).

La primera publicación quedó como Versión 191 con el registro diciendo 190; la Versión 192 solo corrige el número en el registro y no cambia nada más.

**Qué cambió**
- **Catálogos publicados (DEC-187):**
  - Sucursales, Coberturas, Piezas, Tipos de daño, Gravedad, Motivos de No asegurable, Motivos de no inspección y Resultados de verificación se publican como lista de texto, solo con los vigentes y en el orden de la pantalla.
  - Cada uno usa su clave del archivo: noaseg → `motivosNoAsegurable`, noinsp → `motivosNoInspeccion`, verif → `verificacion`.
  - `ciudadSucursal` y `actividadesExcluidas` no cambian.
  - Al guardar, con o sin conexión, `SIRIUS_EJEMPLO.catalogos` se actualiza en memoria con esa misma forma. Con `{ ok: false }` se deshace. Al cambiar de escena vuelve a lo del archivo.
  - Lectura defensiva: cada elemento se acepta como texto o como `{ nombre }` en Nueva solicitud, Flujo y SLA, Niveles, Agenda, Monitor, Coordinación (motivos de no inspección), el informe, la app de la visita, la grilla, las listas de Formularios y los PDF (piezas).
- **Cilindraje (DEC-219):** «Objeto a asegurar» lee `datos.cc` o, si no viene, `datos.cilindraje`, con el mismo formato («125 cc»).
- **Barra fija (DEC-218):** después del desglose queda solo «39 de 66 campos aplicables». Ahora dice «6 pendientes (ver los controles · 4 obligatorios del informe · la decisión) · 39 de 66 campos aplicables». La cabecera de la pestaña Informe y la bandeja no cambian.

**Verificado**
- **Selector a 1280×720 y 1920×1080:** abrí catalogosforma, resumenflotabase, infcompletarcaso, resumenflota y catalogos. Ninguna mostró errores, «[object Object]» ni scroll horizontal. También niv, flujoresp, monitor y catalogoveh, por ser pantallas que leen catálogos.
- **catalogosforma:** Sucursales muestra «Latacunga» (Creada en SIRIUS, Vigente). Al abrir Nueva solicitud, la lista de Sucursal es Quito Norte, Quito Sur, Guayaquil, Cuenca, Manta, Ambato, Ibarra y Latacunga, todas como texto.
- **resumenflotabase:**
  - En la bandeja, el caso 50012 muestra «3 vehículos» y «PRB1212 +2».
  - En el Resumen, «Objeto a asegurar» trae «Vehículo 1 · …» a «Vehículo 3 · …». La Suzuki GN125 muestra «125 cc», leído de `datos.cilindraje`.
  - Los totales por vehículo son 15.000, 2.400 y 33.200 (32.000 + 1.200 de extras). El «Total del caso» es USD 50.600,00.
- **Barra fija en infcompletarcaso:** muestra «6 pendientes (ver los controles · 4 obligatorios del informe · la decisión) · 39 de 66 campos aplicables».
- **Publicación con una conexión temporal** (copia aparte):
  - Con `{ ok: true }`, Sucursales y Motivos de No asegurable publican `publicarConfiguracion` con la clave `SIRIUS_CATALOGOS` y listas de texto.
  - Sucursales publica «Quito Norte … Ibarra, Latacunga» y Motivos de No asegurable termina en «Chasis con corrosión estructural». No aparecen claves `noaseg`, `noinsp` ni `verif`.
  - Con `{ ok: false }`, el registro y la memoria vuelven a como estaban («Se deshizo el cambio»).
- **Lectura defensiva:** con los catálogos de la sesión convertidos a `{ nombre }`, Nueva solicitud, Agenda (`SiriusUsuarios.sucursales`), la grilla y las listas de Formularios siguen mostrando el texto.
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: 580 escenas en datos-escenas y KNOWN_ESC 537.

**No verificado**
- Lectura defensiva en Niveles, Flujo y SLA, Monitor, Coordinación, la app de la visita y los PDF: solo se comprobó que sus escenas abren sin error. No las probé con catálogos en forma de registros.
- Que la base real acepte `SIRIUS_CATALOGOS` con listas de texto: se probó contra una conexión temporal.

**Diferencias**
- En la escena resumenflotabase, el estado de cada vehículo es el del caso, porque `riesgosBase` no trae estado por riesgo.
- Los catálogos de texto guardados vuelven a los del archivo al cambiar de escena (no antes). Si el catálogo se reabre en la misma sesión, los registros Inactivos no se ven, porque en memoria solo quedan los vigentes.
- Quedan sin cambiar los catálogos que son registros: `ciudad` y `prov` se siguen publicando con el id de la pantalla (no con `ciudadSucursal` ni `provinciaRegion`), igual que Ramos y Líneas de negocio. Los dejé como pediste; conviene revisarlos en otra etapa.

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| catalogosforma | Catálogos › Sucursales con «Latacunga» guardada; Nueva solicitud la muestra como texto |
| resumenflotabase | Caso de tres vehículos como el 50012: «3 vehículos», «PRB1212 +2» y Total del caso USD 50.600 |

También abrí infcompletarcaso, resumenflota y catalogos.

---

## 18/10/2026 · 20:30 — Etapa P-6f-0

Publiqué la etapa P-6f-0 (Versión 189). Incluye:

- el avance del informe por campos aplicables (DEC-218);
- «Objeto a asegurar» armado desde la solicitud (DEC-219);
- «Enviar a calificación» para quien completa sin inspector en sitio (DEC-215);
- la facultad con tope de suma asegurada (DEC-216).

DEC-217 queda reservada.

**Qué cambió**
- **Avance (DEC-218):**
  - **Qué cuenta:** solo los campos aplicables, es decir, los visibles en la modalidad del caso. No cuentan los de Cálculo ni los «No aplica»; estos se siguen mostrando.
  - **Texto:** «1 obligatorio pendiente · 13 de 32 campos aplicables» y «Sin obligatorios pendientes · …».
  - **Dónde se ve:**
    - En la cabecera de la pestaña Informe.
    - En la barra fija, después del desglose. Ejemplo: «6 pendientes (ver los controles · 4 obligatorios del informe · la decisión) · 4 obligatorios pendientes · 39 de 66 campos aplicables».
    - En la bandeja «Informes por completar».
    - En el Historial: «Borrador del informe guardado · 1 obligatorio pendiente · 13 de 32 campos aplicables · sigue «Por completar»».
  - **Tooltip:** «Campos aplicables: los de la plantilla para esta modalidad, sin los que no aplican ni los calculados».
  - La barra de porcentaje usa llenos sobre aplicables. Ramos Generales no cambia.
- **Objeto a asegurar (DEC-219):** con conexión, Resumen arma la tarjeta con `casos[].riesgosBase`. Sin `riesgosBase`, queda como antes, y ningún dato sale del caso de ejemplo.
  - **Vehículo:**
    - Siempre muestra Placa, Marca, Modelo, Año, VIN y Número de motor, con «—» si faltan.
    - El resto aparece solo si viene. La carrocería se muestra con su nombre de SIRIUS_SILUETAS.
    - Valores: Casco, Extras y Valor total asegurado.
  - **Equipo:** muestra Suma asegurada.
  - **Ubicación del bien:** muestra Edificio, Contenidos y Total.
  - **Flota:** cada riesgo aparece como «Vehículo N · estado», en el mismo orden. Abajo va el total de cada vehículo (casco más extras) y el «Total del caso».
  - **Informe › Valores:** si la respuesta no trae el casco o los extras, los toma de `riesgosBase` con origen «Solicitud».
- **Enviar a calificación (DEC-215):**
  - Es la tercera opción, después de No asegurable, con la descripción pedida.
  - La observación es obligatoria (mínimo 10 caracteres). El resultado dice «El caso pasa a calificación por tu decisión.».
  - Envía `completarInforme { caso, respuestas, decision: 'determinar', criterio: 'Enviar a calificación', motivo }`.
  - El Historial registra «Completó el informe · Enviado a calificación por decisión de Patricia Andrade · <observación>».
  - La calificación muestra la observación como «Motivo del envío». El interno no cambia.
- **Facultad con tope (DEC-216):**
  - **Niveles:**
    - Campo «Tope de suma asegurada (USD)», con SiriusMonto y la ayuda pedida, en el valor global y en las excepciones.
    - Columna «Tope» en la tabla de excepciones: Eurosurvey USD 40.000; las demás, «Sin tope».
    - «Consultar inspector» muestra el tope efectivo y su origen, por ejemplo «Viene de la agencia Eurosurvey». La cadena de herencia muestra el tope de cada nivel.
    - Cada cambio pide motivo y queda en el Historial de cambios.
  - **Publicación con conexión:** cada cambio se publica como `SIRIUS_FACULTADES`. Con `{ ok: false }`, se deshace.
  - **Lectura:** `window.SIRIUS_FACULTADES` manda en:
    - SiriusUsuarios.facultadDe;
    - SiriusCompletar.facultad y facultadResp;
    - Niveles y «Probar reglas»;
    - el informe;
    - la ficha del usuario;
    - la app del inspector.
  - **Suma asegurada del caso:** la mayor de sus riesgos.
  - **Textos:**
    - «Facultad de Eurosurvey: Determinar solo Asegurable · hasta USD 40.000 · este caso queda Inspeccionado como Asegurable.»
    - «… · la suma asegurada (USD 42.000,00) supera el tope: pasa a calificación.»
    - Sin tope, no se menciona el monto.

**Verificado**
- **Selector a 1280×720 y 1920×1080:** abrí las 9 escenas nuevas más infcompletarcaso, autodecision, autonoaplica, valorestotal, cxnumerocruce y niv. Ninguna mostró errores ni scroll horizontal.
- **Conteos DEC-218,** hechos recorriendo cada sección del informe y contando los campos:
  - **50009** (Motos · Autoinspección, avanceaplicables): 36 visibles − 3 «No aplica» − 1 Cálculo = 32 aplicables. Hay 13 llenos y 1 obligatorio pendiente (el kilometraje).
  - **30004** (Vehículos livianos · Presencial, infcompletarcaso): 72 visibles − 0 «No aplica» − 6 Cálculo = 66 aplicables. Hay 39 llenos (35 campos de texto o lista y 4 Sí/No respondidos) y 4 obligatorios pendientes.
  - Las dos cifras coinciden con lo que muestra la pantalla.
- **Sin conexión:** comparé contra la versión anterior inicio, veh, n1, usuarioficha, infbandeja, infcompletarcaso, calcxcalif y cxnumerocruce. Solo cambian el texto del avance y el tope (en la ficha, «Tope de suma asegurada · Sin tope»).
- **Prueba interna con conexión** (copia aparte):
  - **`riesgosBase`:** las cuatro formas se ven en Resumen, y Valores toma 18.500 y 650 de `riesgosBase`.
  - **`completarInforme` con «Enviar a calificación»:** con `{ ok: true }` el caso pasa a calificación. Con `{ ok: false }` vuelve a «Informe por completar» con el mensaje.
  - **`publicarConfiguracion`:** se probó editando la excepción de Eurosurvey a 45.000. Con `{ ok: false }` vuelve a 40.000 con «Se deshizo el cambio».
  - **`SIRIUS_FACULTADES` con tope 35.000:** manda en Niveles y en el informe; la moto de 38.900 pasa a calificación.
  - **Calificación:** muestra «Motivo del envío».
- `sirius-conexion.js` quedó con su línea mínima (comparación byte a byte).
- Inventario y registro actualizados: contrato, DEC-215, DEC-216, DEC-218, DEC-219 y KNOWN_ESC 535.

**No verificado**
- La tabla de inspectores de Niveles («Facultad efectiva por inspector») no tiene columna de tope; el tope se ve en «Consultar inspector».
- La app del inspector solo muestra el tope en «Tu facultad»; su decisión en la visita no se probó con una suma sobre el tope.

**Diferencias**
- En la bandeja, el avance va en dos líneas por el ancho de la columna: «13 de 32 campos aplicables» y debajo «1 obligatorio pendiente».
- Ajusté anchos de la tabla de excepciones para que entre la columna «Tope» a 1280.
- Con conexión, Niveles no muestra «Excepción actualizada» antes de saber la respuesta. Solo aparece el aviso de la publicación o el del rechazo.
- autoenviarcalif abre con la observación escrita. Con `?cxobs=0` se ve sin observación y con la validación.
- En la flota, el estado de cada vehículo es el del caso, porque `riesgosBase` no trae estado por riesgo.

**Escenas** (desde el selector):

| Escena | Qué muestra |
|---|---|
| avanceaplicables | Avance por campos aplicables |
| resumenvehsol | Vehículo con todos los datos de la solicitud |
| resumenflota | Flota de tres vehículos |
| resumenequipo | Equipo móvil |
| resumenubicacion | Ubicación del bien |
| autoenviarcalif | Envío a calificación con observación (sin ella con `?cxobs=0`) |
| facultadtope | Moto de 38.900 dentro del tope de 40.000 |
| facultadtopefuera | Moto de 42.000 sobre el tope de 40.000 |
| nivelestope | Tope en Niveles de calificación |

También abrí infcompletarcaso, autodecision, autonoaplica, valorestotal, cxnumerocruce y niv.

---

## 18/10/2026 · 20:30 — Etapa P-6e-4

Publiqué la etapa P-6e-4 (Versión 188): el informe de autoinspección arma las fotos por sección con la plantilla publicada, muestra el video, no exige campos que no aplican, calcula el total de la solicitud y la decisión sigue DEC-211. El login usa el diseño «Dividido».

**Qué cambió**
- **Fotos por sección:** lo que publica Formularios trae los pasos sin «sec» y las secciones como objetos. El back-office tomaba cada paso como «Otras fotos» y agregaba ese bloque una vez por paso, siempre con las fotos 17 y 18. Ahora cada paso toma su sección de la plantilla del informe (DEC-194), las secciones se normalizan y «Otras fotos» aparece una sola vez, solo con pasos que no están en la plantilla (un extra o el video). Los pasos de Motos declaran ahora su sección.
- **Video de 360°:** una evidencia con `tipoArchivo: 'video'` se trata como video: miniatura con reproducir y duración, y reproducción en el visor único con controles. Ya no sale como imagen rota. D-7 corregido: la duración va arriba a la derecha y el nombre abajo.
- **Estado de las secciones:** con la conexión, el informe usa la plantilla y la versión del informe (antes siempre «Vehículos livianos v1») y lo que la versión publicada dice en «Obligatorio» y «Quién lo llena». Una sección queda «Completa» solo si todos sus obligatorios aplicables tienen valor.
- **No aplica:** en Vehículos livianos y Motos, columna Autoinspección, «Inspector que ejecutó», «Persona que atiende» y «Relación con el asegurado» quedan «No aplica». Se cambia en Formularios › Campos › «Quién lo llena», que ahora ofrece esa opción. Además, en cualquier modalidad, un campo que nadie puede llenar no cuenta como pendiente.
- **Total de la solicitud:** valor del casco más valor de extras de la solicitud, bloqueado y con el origen «Cálculo».
- **Decisión sin inspector (DEC-211):** el paso 3 no muestra «Criterio del inspector».
  - La agencia o el independiente eligen Asegurable o No asegurable (con motivo) y se muestra su facultad, por ejemplo «Facultad de Eurosurvey: Determinar solo Asegurable · este caso queda Inspeccionado» o «… pasa a calificación».
  - El interno sigue con «Completar y calificar».
  - «Devolver a coordinación» (motivo obligatorio) deja el informe «Devuelto» y el caso «En coordinación»; con la conexión, `devolverCoordinacion { caso, motivo }`.
- **Login:** el diseño «Dividido» con la constelación es el predeterminado.
- **Escenas nuevas (7):** `autoporseccion`, `autovideovisor`, `autonoaplica`, `autodecision`, `autodevolver`, `valorestotal` y `login`.

**Verificado**
- Abrí desde el selector las 7 escenas nuevas y `infcompletarcaso`, `infvalores`, `autorecibida` y `autointerno` a 1280×720 y 1920×1080, sin errores ni desplazamiento horizontal.
- En `autoporseccion` ninguna sección se repite: hay 10 secciones y «Otras fotos» una sola vez, con el extra y el video. La suma por sección (18) es igual a la galería (18), y no hay ninguna imagen rota.
- En `autovideovisor` el video se reproduce en el visor con controles.
- En `autonoaplica` los tres campos dicen «No aplica · autoinspección» y el informe queda «sin pendientes». En `valorestotal` el Total de la Solicitud es USD 19.150,00, bloqueado y con «Cálculo». Con la versión publicada que pide año y vigencia de la matrícula, «Matrícula y propietario» queda «Por completar · 2 obligatorios vacíos».
- Flujos en la simulación: Asegurable dentro de la facultad de Eurosurvey → Inspeccionado; No asegurable fuera de la facultad → a calificación; Devolver → «En coordinación». Con `{ ok: false }` todo volvió a «Informe por completar» con el mensaje. El interno sigue completando y calificando en un paso.
- Prueba interna con conexión en una copia aparte: se enviaron `completarInforme { …, decision: determinar, criterio: Asegurable }` y `devolverCoordinacion { caso, motivo }`, y con `{ ok: false }` la pantalla volvió atrás. `sirius-conexion.js` de la copia publicada sigue con su contenido mínimo.
- Sin conexión, los casos presenciales de ejemplo se ven igual, salvo el conteo de campos (ver Diferencias). Comparé `infcompletarcaso`, `infvalores`, `infpasoinforme` e `infdecision` texto a texto con la versión anterior.

**No verificado**
- No probé con la base real de GitHub (50007 y 50009). Reproduje su forma con una versión publicada en Formularios armada desde las plantillas del prototipo.
- No probé el independiente de punta a punta: usa el mismo camino que la agencia, con su propia facultad.

**Diferencias**
- La facultad que se muestra es la de determinación que ya está configurada (Eurosurvey «Determinar solo Asegurable»). Hoy no existe un tope en USD por agencia, así que no aparece «hasta USD 40.000».
- El «Total» de la Solicitud ya no se cuenta como campo por llenar, así que el conteo baja en uno también en los casos de ejemplo («39 de 66» en lugar de «40 de 67»).
- «Devolver a coordinación» también está disponible para el interno.
- La escena del visor se llama `autovideovisor`, porque `autovideo` ya era una escena de Formularios.
- Los pasos de Motos ahora declaran su sección, así que sus fotos también se reparten por sección en presencial.

---

## 18/10/2026 · 20:30 — Etapa P-6e-3

Publiqué la etapa P-6e-3 (Versión 187; la primera publicación quedó como Versión 186 con este número mal escrito y la republiqué con el número corregido). Con la conexión, los casos de la base ya no toman datos de un caso de ejemplo con el mismo número; Coordinación arma las visitas con `visitasBase` y ofrece acciones para las visitas con enlace; el Coordinador y el Administrador ven las mismas acciones.

**Qué cambió**
- **DEC-200 completo:** al cargar la conexión, y cada vez que un archivo de datos se vuelve a ejecutar, se quitan de todos los datos de ejemplo (`SIRIUS_*`) las entradas de los casos de la base: claves por número de caso o riesgo, filas con ese `caso` o `id`, y tuplas. En 30007 eso eliminó el SLA de ejemplo («Vencido hace 2 h»), la fila, el vehículo (PCD5521), la visita, los eventos y las evidencias del ejemplo, los datos de SiriusCompletar y la dirección de evidencias. El mismo criterio cubre SiriusCompletado y los demás conjuntos por número de caso. Lo que la base no trae queda «—», «Sin dato» o «SLA —». Lo que la pantalla copia de la base (consentimientos, Datos adicionales) va marcado y no se quita.
- **Visitas desde la base:** la tarjeta sale de `visitasBase`, con los estados «Enlace enviado · vence …», «Autoinspección enviada · vence …», «En curso por el cliente», «Realizada», «Cancelada», «Por agendar» y, como hoy, «Agendada». Muestra el vencimiento del enlace, el enlace (sin cortar el código) y el último envío.
- **Acciones de la tarjeta:**
  - Con enlace: «Reenviar enlace» (`reenviarEnlace { caso, tipo, canal }`), «Generar nuevo enlace» (confirmación; `enviarEnlace` del mismo tipo), «Copiar enlace» y «Cancelar visita» (`cancelarVisita { caso, modalidad, motivo }`, motivo obligatorio).
  - Agendada: como hoy.
  - Por agendar: «Enviar enlace de autoagendamiento» y «Enviar enlace de autoinspección» (deshabilitada con el motivo si la plantilla o los criterios no la permiten).
  - El cambio se ve mientras responde la base: con `{ ok: false }` la tarjeta vuelve atrás y se muestra el mensaje; con `{ ok: true }` se vuelven a leer los datos del caso.
- **Coordinador y Administrador:** la cabecera calculaba las visitas solo para el rol Coordinador de inspecciones. Por eso, con el mismo usuario, el Administrador veía «Coordinar inspección» y el Coordinador «Ver visita». Ahora los dos usan las visitas del caso y el mismo permiso, así que la acción es la misma.
- **Escenas nuevas (3):** `cxvisitaenlace`, `cxvisitacancelar` y `cxnumerocruce`.

**Verificado**
- Abrí desde el selector `cxvisitaenlace`, `cxvisitacancelar`, `cxnumerocruce`, `coord`, `coordvis` y `coordmodalidades` a 1280×720 y 1920×1080, sin errores ni desplazamiento horizontal.
- Sin conexión, `coord`, `coordvis`, `coordchoque`, `coordauto`, `envioenlace`, `enlaceagenda` (salvo el token aleatorio), `enlacesincorreo`, `coordrg`, `coordcxmoto` y `coordmodalidades` quedan igual que antes, comparados texto a texto con la versión anterior.
- `coord`, `coordvis`, `cxvisitaenlace` y `cxnumerocruce` muestran las mismas acciones con el rol Coordinador de inspecciones y con Administrador.
- En `cxnumerocruce` (30007 de la base) no aparece ningún dato del ejemplo (PCD5521, Mauricio Endara, Carolina Mejía, Renault Duster ni su comentario) en las seis pestañas ni en Solicitudes, Informes por completar, Agenda, Inicio, Calificación y Reportes, con los dos roles. Mauricio Endara solo aparece en Inicio como inspector del catálogo, sin el caso. El SLA queda «SLA —».
- Prueba interna con conexión en una copia separada, con seis casos que cubren todos los estados:
  - Se enviaron `reenviarEnlace { caso, tipo, canal }`, `enviarEnlace { caso, canal, destinatario, modalidad, tipo }` (nuevo enlace y envío desde «Por agendar») y `cancelarVisita { caso, modalidad, motivo }`.
  - Con `{ ok: true }` las tarjetas se recargaron; con `{ ok: false }` volvieron atrás con el mensaje.
  - `sirius-conexion.js` de la copia publicada sigue con su contenido mínimo.
- `cxlimpio`, `historden`, `calcxcalif`, `calpdfcx`, `infcxfotos`, `autorecibida` y `autointerno` abren sin errores.

**No verificado**
- La base real de GitHub: probé con una conexión de prueba con la forma del contrato. No comprobé qué devuelve la base al reenviar (el canal) ni cuándo pasa un enlace a «En curso».
- El texto del diálogo «Cancelar visita» es el de siempre («Sus riesgos vuelven a "por coordinar"…»); no dice que la base invalida los enlaces.

**Diferencias**
- Con la conexión, el panel «Informe en PDF» de un caso de la base se armaba con el vehículo de ejemplo del mismo número (por ejemplo 30004 en `cxlimpio` e `historden`). Por DEC-200 ya no se arma, y «Ver PDF» dice «El PDF no está disponible para este caso» hasta que la base entregue el informe en la forma del PDF. El «Origen del veredicto» sí se mantiene: ahora sale de la calificación de la base.
- «Generar nuevo enlace» de una visita de la base pide confirmación sin motivo, porque `enviarEnlace` no lleva motivo. Sin conexión, sigue pidiendo el motivo como antes.
- «Cancelar visita» también aparece en una visita «Por agendar», para poder cerrarla.

---

## 18/10/2026 · 20:30 — Etapa P-6e-2

Publiqué la etapa P-6e-2 (Versión 184; la primera publicación quedó como Versión 183 con este número mal escrito y la republiqué con el número corregido): cuando no hay inspector en sitio, quién completa el informe ahora lo decide una configuración (DEC-207), con su tarifa de completado y los casos de autoinspección armados con los datos de la base.

**Qué cambió**
- **Administración › Flujo y SLA › «Completado del informe»:** reglas en orden (ramo, modalidad, sucursal, suma asegurada hasta → Interno, Agencia con su selector o Inspector independiente con el suyo, más el plazo en horas hábiles). Gana la primera que coincide y la última es el destino por defecto, Interno, fijo. Tiene el panel «Probar con un caso», «Así se ve en el caso» y se publica con motivo como `SIRIUS_COMPLETADO` = { version, reglas, porDefecto }.
- **Tarifa «Completado de informe»:** cada agencia y cada inspector independiente la tiene en su tarifario (Liquidaciones › Tarifarios), se publica en `SIRIUS_HONORARIOS.completadoInforme` y Liquidaciones muestra el honorario con el concepto «Completado de informe». Sin tarifa propia queda «por definir»; el Interno no cobra.
- **En el caso:** el Resumen y el encabezado del informe dicen «Responsable del completado: … · por <regla>», y el Coordinador y el Administrador tienen «Reasignar…» mientras no se haya enviado, con destino, agencia o inspector y un motivo obligatorio que queda en el Historial.
- **Interno:** el paso 3 es «Criterio y calificación» con «Completar y calificar»: queda calificado en un solo paso y el caso pasa directo a Inspeccionado, sin «Pendiente calificación» y sin honorario. **Agencia e Independiente** completan como hasta ahora y el caso pasa a «Pendiente calificación» con su honorario.
- **Bandeja «Informes por completar»:** cada persona ve lo que le toca según el responsable, con la modalidad y el responsable en la columna «Inspector · Responsable».
- **Autoinspección con la conexión:** el caso toma estado y subestado de la base («Informe por completar · Autoinspección recibida»), la visita se ve «Realizada» en la modalidad Autoinspección con «Recibida dd/mm/aa · hh:mm», y las evidencias (fotos, documentos y el video de 360°) quedan en el canal «Autoinspección», en la pestaña Evidencias y en el panel «Evidencias de campo». Calificación cuenta «5 fotos · 2 documentos · 1 video» y el Historial dice «Informe de autoinspección recibido» desde el Portal del cliente.
- **Escenas nuevas (7):** `complreglas`, `complprobar`, `compltarifa`, `autorecibida`, `autointerno`, `autotercero` y `reasignar`.

**Verificado**
- Las 7 escenas nuevas más `infcompletarcaso`, `calctrl` y `cxlimpio` abren desde el selector a 1280×720 y 1920×1080 sin errores y sin scroll horizontal. Corregí un desborde horizontal de `autointerno` (el tooltip oculto de «Ver PDF» deshabilitado salía del ancho; ahora esa tarjeta se apila) y el catálogo de sucursales de las reglas, que salía vacío.
- Interno completa y califica en un paso: el caso queda Inspeccionado · Asegurable, sin «Pendiente calificación». Agencia completa y el caso pasa a calificación con el honorario HON-COM-30010 de USD 12,00 «Por aprobar». «Reasignar…» cambia el responsable y muestra el honorario (USD 8,00 con Luis Andrade).
- Los cinco momentos del caso de autoinspección (enlace enviado, en curso, recibida, completado, calificado) se ven bien en Coordinación, Calificación e Historial; cuando el estado cambia en la sesión, el subestado de la base se borra.
- Prueba interna con conexión en una copia separada (`sirius-conexion.js` publicado sigue con su única línea mínima): `completarInforme` con `decision: determinar` y `criterio: Asegurable` (Interno), `completarInforme` de Agencia con revert y mensaje con `{ ok: false }`, `reasignarCompletado` con revert con `{ ok: false }`, y `publicarConfiguracion` de `SIRIUS_COMPLETADO` (versión 2, motivo y plazo de 36 h) y de `SIRIUS_HONORARIOS` (versión 3, `completadoInforme` con Eurosurvey USD 15,00 y Luis Andrade USD 8,00).

**No verificado**
- Completar como Inspector independiente con la conexión: comparte el código de Agencia, pero no lo recorrí de punta a punta.
- El cálculo del honorario y del plazo en la base real: aquí se calcula con los datos simulados y el reloj del prototipo.
- Con la conexión, `estadoCaso` del honorario queda con el estado anterior al envío («Informe por completar»); lo recalcula la base.

**Diferencias**
- En la escena `autotercero` el caso no trae controles pendientes, así que no aparece el paso «Controles» con «Ya los vi»; ese paso sigue como en DEC-198.
- La etiqueta del video 360° se ve encimada con su duración en el visor de evidencias; es del componente existente y no lo toqué.
- El módulo Flujo sigue con el aviso «Datos de demostración» con la conexión, como en etapas anteriores.

---

## 18/10/2026 · 20:30 — Etapa P-6e-1c

Publiqué la etapa P-6e-1c (Versión 180; la primera publicación quedó como Versión 179 con este número mal escrito y la republiqué con el número corregido): en Formularios, el Administrador puede eliminar una versión Retirada de una plantilla cuando ningún informe la usa (DEC-208). Es una excepción acotada a «inactivar en lugar de eliminar», porque esa versión no tiene usos. Todo lo demás de Formularios se ve igual.

**Qué cambió**
- **Acción «Eliminar versión»:** en Formularios › plantilla › Versiones, cada versión que no es borrador muestra el botón secundario «Eliminar versión». Se habilita solo en una Retirada sin informes vinculados y si la persona es Administrador. En las demás queda deshabilitada y el motivo se lee en una línea: «Solo el Administrador puede eliminar», «Es la única versión de la plantilla», «Está vigente», «Está programada» o «Tiene N informes vinculados». Los borradores se siguen descartando como hoy.
- **Informes vinculados:** con la conexión se cuentan los de `SIRIUS_CONEXION.informes` cuya plantillaClave y plantillaVersion coinciden con la plantilla y la versión. Un informe con la versión vacía (la app envió «local») no cuenta para ninguna versión con número. Sin conexión se cuentan los informes del prototipo que usan esa plantilla y versión.
- **Confirmación:** un diálogo con el nombre y el número de la versión, cuántos informes se revisaron (0 vinculados a esa versión) y un motivo obligatorio. Al confirmar, la versión sale de la plantilla y el historial queda con «Eliminó la vN (sin informes vinculados)», el motivo, la persona y la fecha.
- **Numeración:** el número eliminado no se reutiliza. La plantilla guarda el número más alto que tuvo (`ultima`) y la siguiente versión nueva sigue desde ahí.
- **Con la conexión:** se publica `SIRIUS_FORMULARIOS` sin esa versión, con SiriusPublicar y el motivo (acción `eliminarVersion` en `cambio`). Si la base responde `{ ok: false }`, la versión vuelve y se muestra el mensaje.
- **Una sola versión:** la única versión de una plantilla no se puede eliminar.
- **Escenas nuevas:** `versioneliminar` (Vehículos livianos con v3 y v2 Retiradas sin informes, v1 Retirada con 1.284 informes y v4 Vigente) y `versioneliminarok` (después de eliminar la v2, con el historial abierto en esa línea).
- **Inventario:** registré la etapa P-6e-1c y DEC-208, `eliminarVersion` y `ultima` en el contrato de SIRIUS_FORMULARIOS, y KNOWN_ESC en 509.

**Verificado**
- **Selector a 1280 × 720 y 1920 × 1080:** `versioneliminar`, `versioneliminarok`, `versionesplantilla` y `formmodalidades` abren sin errores, sin texto roto y sin desplazamiento horizontal.
- **Lista de versiones (`versioneliminar`):** v3 y v2 con «Eliminar versión» habilitado; v1 con «Tiene 1.284 informes vinculados»; v4 con «Está vigente»; v5 Borrador con «Descartar borrador».
- **Diálogo:** muestra «Eliminar la versión 3 de Vehículos livianos», los informes revisados y los vinculados; sin motivo el campo marca error y la versión sigue; con motivo, la versión sale, el historial queda con la línea y `ultima` guarda 5.
- **Numeración:** probé una versión Programada v6 retirada y eliminada (la más alta, sin informes); la versión nueva que se creó después fue la v7, no la 6 ni la 5.
- **Rol:** como el Coordinador no entra a Formularios (la pantalla lo lleva al Inicio), forcé el rol en el componente. Con un rol que no es Administrador, el botón queda deshabilitado en v4, v2 y v1 con «Solo el Administrador puede eliminar».
- **Prueba interna con conexión** (copia aparte, archivo temporal, sin publicar; a ambos tamaños), con informes de Vehículos livianos v3, de Motos v1 y uno con la versión vacía:
  - La v3 queda con «Tiene 1 informe vinculado» y la v2 y la v1 se pueden eliminar, aunque el prototipo tenga 1.284 en la v1.
  - Eliminar la v2 publicó `SIRIUS_FORMULARIOS` (versión 2, motivo escrito, `eliminarVersion`) sin la v2 y con `ultima` 5.
  - Con `{ ok: false }`, al eliminar la v1 se mostró «La base rechazó el cambio. Se deshizo el cambio.» y la v1 volvió.
  - Después, `sirius-conexion.js` quedó idéntico a su contenido mínimo.
- **Sin cambios donde no debía:** `form`, `formmodalidades`, `formcriteriosA`, `vlhist`, `em`, `rg`, `doccatalogo`, `docusoplantilla`, `mapaeditar` y `coordmodalidades` tienen el mismo texto y los mismos píxeles que en la etapa anterior. `versionesplantilla` cambia por diseño: aparece «Eliminar versión» y el texto de la nota.

**No verificado**
- La conexión real con la base: la prueba usó un archivo temporal que acepta o rechaza la publicación.
- Que la base real acepte `eliminarVersion` y quite la versión, y que la app y los portales no la sigan usando.
- Un Coordinador real frente a la pantalla de Formularios: no se abre para ese rol; el rol se probó forzándolo en el componente.

**Diferencias**
- **Orden de los motivos:** cuando hay varios, se muestra primero el del rol, luego «única versión», «Está vigente» o «Está programada» y al final los informes vinculados.
- **«Está programada»:** lo agregué a los motivos que pediste, porque una versión programada tampoco se puede eliminar.
- **Botón junto a «Retirar versión»:** en las Retiradas el botón «Retirar versión» sigue deshabilitado como antes y «Eliminar versión» va a su lado; lo dejé así para no cambiar el resto de la lista.
- **Informes sin conexión:** uso el mayor entre el conteo del prototipo de la versión y los vehículos o equipos de ejemplo que la usan, para no contar dos veces. Con la conexión, el conteo del prototipo no se usa.
- **Informes revisados:** son los de la plantilla (con la conexión, los de esa plantilla en `SIRIUS_CONEXION.informes`; sin ella, la suma de la plantilla). Los vinculados son los de esa versión.
- **Historial:** la línea sale como «Eliminó la vN (sin informes vinculados)» y, como en las demás acciones, aparece después de los cambios de las versiones. En `versioneliminarok` la escena deja la línea a la vista.
- **Nota de la lista de versiones:** cambié el texto («Las versiones con informes no se eliminan, solo se retiran; una versión retirada sin informes vinculados la elimina el Administrador»), porque el anterior decía que nunca se eliminaban.
- **Casos en curso:** no es una de las tres condiciones de DEC-208, así que no la agregué. Una Retirada puede tener casos en curso que conservan su versión (en el prototipo, la v1 de Vehículos livianos muestra 23), y esos casos podrían crear informes con ella después. En el prototipo la v1 igual queda bloqueada por sus informes; conviene decidir si los casos en curso también deben impedir eliminar.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** versioneliminar, versioneliminarok, versionesplantilla, formmodalidades.

---

## 18/10/2026 · 20:30 — Etapa P-6e-1b

Publiqué la etapa P-6e-1b (Versión 176; la primera publicación quedó como Versión 175 con este número mal escrito y la republiqué con el número corregido): con la conexión, Coordinación ya no adivina la plantilla del caso por el ramo; la toma de los datos que entrega la base (formularios, carrocerias, anios y sumaAsegurada del caso) y evalúa con ellos los criterios de la autoinspección. Solo cambió la fuente: las reglas de DEC-204 y DEC-206, las pantallas y los casos de ejemplo sin conexión se ven igual que en P-6e-1.

**Qué cambió**
- **Plantilla del caso:** con la conexión, si el caso trae `formularios` con un valor, se usa el del primer riesgo sin el sufijo de versión («Motos v3» pasa a «Motos»). Si no, sigue la regla anterior (vehículos o equipos de ejemplo y luego el ramo). Una moto ya recibe las modalidades de Motos y no las de Vehículos livianos.
- **Criterios de la autoinspección:** con la conexión, la suma asegurada, el año y la carrocería salen de `sumaAsegurada`, `anios` y `carrocerias` del caso, y la sucursal de los datos del caso. Con varios riesgos se evalúa cada uno y el motivo nombra la placa o la descripción, por ejemplo «El vehículo es anterior a 2012 (BBB2222)». Un dato que falta no bloquea.
- **Una sola función para todo:** `plantillaDeCaso` es la única que decide la plantilla de un caso. Coordinación, la recomendación de modalidad y el enlace de autoagendamiento reciben su resultado; revisé el código y no hay otro lugar que derive la plantilla de un caso. La vista previa de documentos trabaja por plantilla, no por caso.
- **Escena nueva `coordcxmoto`:** simula la conexión solo en Coordinación con un caso de Vehículos cuyo riesgo trae formularios [«Motos»] y carrocerias [«moto»]. Se ofrecen Presencial, Virtual guiada y Autoinspección, y Documental aparece deshabilitada con «Documental no activa en la plantilla Motos». La simulación se limpia al cambiar de escena.
- **Inventario:** registré la etapa P-6e-1b, KNOWN_ESC 507 y las claves `formularios`, `carrocerias`, `anios` y `sumaAsegurada` del caso en el contrato de SIRIUS_CONEXION.

**Verificado**
- **Selector a 1280 × 720 y 1920 × 1080:** `coordcxmoto`, `coordmodalidades` y `formmodalidades` abren sin errores, sin texto roto y sin desplazamiento horizontal. En `coordcxmoto` Presencial, Virtual guiada y Autoinspección se ofrecen y Documental sale deshabilitada con el motivo pedido.
- **Sin conexión igual que en P-6e-1:** `coordmodalidades` tiene el mismo texto y los mismos píxeles que en la copia de P-6e-1, igual que `formmodalidades`, `formcriteriosA`, `coordvis`, `doccatalogo`, `docusoplantilla`, `form`, `versionesplantilla`, `mapaeditar`, `coordenlace` y `envioenlace`.
- **Prueba interna con conexión** (copia aparte, archivo temporal, sin publicar; a ambos tamaños en la pantalla de Coordinación del caso):
  - Un caso con formularios [«Equipo y maquinaria v2»] ofrece solo Presencial; las otras tres modalidades salen deshabilitadas con «… no activa en la plantilla Equipo y maquinaria».
  - Un caso con [«Vehículos livianos v4»] y sumaAsegurada 42.000 queda sin autoinspección con «La suma asegurada supera USD 30.000» (criterios con suma máxima de 30.000).
  - Un caso con formularios [«Motos v3»] ofrece Autoinspección y no Documental.
  - Un caso con dos riesgos (uno de 2008, con anio mínimo 2012) queda sin autoinspección con «El vehículo es anterior a 2012 (BBB2222)». Otro con carrocería «furgoneta» fuera de los criterios dice «La carrocería furgoneta no está en los criterios (DDD4444)». Otro con sucursal Loja dice «La sucursal Loja no está en los criterios».
  - Un caso sin los datos del riesgo no se bloquea y usa la plantilla del ramo.
  - Después, `sirius-conexion.js` quedó idéntico a su contenido mínimo.
- **Registro de escenas:** `coordcxmoto` está en el registro y en KNOWN_ESC, que ahora tiene 507 nombres.

**No verificado**
- La conexión real con la base: la prueba usó un archivo temporal con los campos del contrato, no la conexión de GitHub.
- Que la conexión real entregue los campos con exactamente estos nombres y formas (`carrocerias` como id de silueta, `anios` y `placas` por riesgo, `sumaAsegurada` como número o lista).

**Diferencias**
- **Motivo con el nombre de la plantilla:** cuando la plantilla sale de los datos del caso, el motivo la nombra («Documental no activa en la plantilla Motos»). Cuando sale de los casos de ejemplo se queda como en P-6e-1, para que `coordmodalidades` no cambie.
- **`sumaAsegurada` único con varios riesgos:** si llega como un número del caso y hay varios riesgos, se evalúa una sola vez para el caso, sin placa en el motivo. Si llega como lista, cada riesgo usa la suya.
- **Carrocerías:** la base manda el id de la silueta (`sedan`, `camioneta`, `moto`) y los criterios usan nombres («Sedán», «Camioneta doble cabina»). Comparo el id con el nombre, con los tipos que incluye la silueta y con el prefijo (`camioneta` cumple «Camioneta doble cabina»). Una carrocería que no está en el catálogo se compara por su texto.
- **Primer valor:** si el primer elemento de `formularios` viene vacío, se usa el primero que traiga valor.
- **Datos que no son del riesgo:** con la conexión, si el caso no trae `sumaAsegurada`, `anios` ni `carrocerias`, la suma y el año siguen saliendo del caso y del texto de `bien`, como en P-6e-1.
- **`coordcxmoto`:** el caso de la escena es el 20186 de ejemplo con los datos de la conexión puestos encima (placa IMB4417, año 2021, suma USD 8.500), porque un caso nuevo de la base no existe en los datos del prototipo. El caso simulado conserva su historial y datos de contacto.
- **Escena `coordmodalidades`:** el bloque de su segunda instancia ahora se muestra con una condición (`cmBOn`) para compartir la página con `coordcxmoto`; no cambia nada de lo que se ve.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** coordcxmoto, coordmodalidades, formmodalidades.

---

## 18/10/2026 · 20:30 — Etapa P-6e-1

Publiqué la etapa P-6e-1 (Versión 173) con dos de las tres piezas de configuración de P-6e: las modalidades por plantilla (DEC-204, que reemplaza DEC-182) con sus criterios para ofrecer la autoinspección (DEC-206), y el catálogo de documentos del cliente con su uso en cada plantilla (DEC-203). Todo se configura en Formularios, se publica con motivo y queda en las versiones (Borrador, Vigente, Retirada). Coordinación ya no usa una regla fija: ofrece lo que diga la plantilla vigente. Sin conexión, los casos de ejemplo siguen funcionando.

**Qué cambió**
- **Modalidades por plantilla (DEC-204):** la lista de Formularios tiene una tabla «Modalidades por plantilla» con un interruptor por modalidad.
  - Debajo de cada interruptor dice el número de pasos de esa columna o, si está apagada, «en diseño · N pasos» o «sin diseñar».
  - En Ubicación – Ramos Generales dice «por módulos» o «se diseña, no se ofrece».
  - Cambiar un interruptor crea o edita el borrador. La fila muestra el cambio («Documental desactivada · sin publicar») y «Revisar y publicar el borrador», que abre la publicación con motivo.
  - La única modalidad activa no se puede apagar. Apagar una modalidad no borra sus pasos.
  - Valores iniciales: Vehículos livianos con las cuatro; Motos con Presencial, Virtual guiada y Autoinspección; Equipo y maquinaria y Ramos Generales solo con Presencial.
- **Criterios para la autoinspección (DEC-206):** en la plantilla › Autoinspección hay un bloque «Cuándo se ofrece» con el interruptor «Aplicar criterios adicionales». Al activarlo se definen suma asegurada máxima, año mínimo, carrocerías y sucursales, todos opcionales, y se guardan como `criteriosA` en la versión.
- **Coordinación según la plantilla:** ofrece una modalidad solo si está activa en la plantilla vigente del ramo y, para la autoinspección, si el caso cumple los criterios. Las demás se ven deshabilitadas con el motivo en una línea («Autoinspección no activa en la plantilla», «La suma asegurada supera USD 25.000»). Una nota dice de qué plantilla salen.
- **Catálogo de documentos del cliente (DEC-203):** nueva pestaña Formularios › Portal del cliente › Documentos, global para los dos portales.
  - A la izquierda está el catálogo; al centro, el editor (nombre, ícono, captura, mínimo y máximo, paso de la plantilla de cada foto o cara, lecturas y estado).
  - A la derecha, la vista previa del celular con los requeridos y «+ Agregar otro documento», por plantilla y por portal.
  - «Publicar catálogo» pide motivo y publica `SIRIUS_DOCUMENTOS_CLIENTE` con su propia clave.
  - Valores iniciales: Matrícula y Licencia (frente y reverso, con lecturas), Cédula (frente y reverso), Contrato de compraventa (de 1 a 15 fotos), Factura de un extra (1 foto por extra declarado) y Ficha técnica del equipo en Borrador.
- **Uso en cada plantilla:** en Autoinspección › Documentos y extras, una tabla con cada documento del catálogo, su uso (Requerido, Otro documento o No se usa) y los portales donde aplica (Agendamiento, Autoinspección). Se guarda como `documentos` en la versión. Un documento en Borrador se ve y no se puede usar.
- **Publicación:** `SIRIUS_FORMULARIOS` lleva `modalidades`, `criteriosA` y `documentos` en cada versión.
- **Escenas nuevas:** formmodalidades, formcriteriosA, coordmodalidades, doccatalogo y docusoplantilla.
- **Archivos nuevos:** `datos-modalidades.js` (datos iniciales y de escenas) y `sirius-modalidades.js` (lógica y pantallas). Inventario al día; `KNOWN_ESC` pasa a 506.

**Verificado**
- **Selector a 1280 × 720 y 1920 × 1080:** las cinco escenas nuevas, form, versionesplantilla, mapaeditar y coordvis abren sin errores ni desplazamiento horizontal.
- **Modalidades:**
  - Apagar Documental en Pesados creó el borrador v3 y siguió mostrando sus 9 pasos («en diseño · 9 pasos»); las versiones 1 y 2 conservan sus pasos.
  - En Equipo y maquinaria, Presencial (la única activa) está bloqueada con «Debe quedar al menos una modalidad activa» y el clic no la apaga. En Motos, al dejar solo la autoinspección, esta quedó bloqueada.
  - Publicar sin motivo marca el error; con motivo, la v3 de Pesados quedó Vigente y Coordinación la toma.
- **Coordinación:**
  - En coordmodalidades, 20186 tiene la autoinspección deshabilitada con «La suma asegurada supera USD 25.000» y un clic no la elige. 20190 (Robo) tiene Virtual guiada, Autoinspección y Documental deshabilitadas con «… no activa en la plantilla».
  - Sin criterios activos, 20186 y 20152 ofrecen todas las modalidades, incluida la autoinspección.
- **Criterios:** en formcriteriosA, cambiar la suma a 35.000 la guarda en `criteriosA` del borrador v5 con su línea en el registro de la versión.
- **Catálogo:** doccatalogo abre con el contrato elegido y visible en la vista previa. Publicar sin motivo marca el error; con motivo (contrato hasta 20 fotos, Ficha técnica Vigente) el catálogo pasó a la versión 2.
- **Uso de documentos:** al cambiar la cédula a Requerido, el cambio quedó en el borrador v5; la vigente v4 sigue con «Otro documento».
- **Sin conexión:** 12 escenas sin relación con esta etapa tienen el mismo texto y los mismos píxeles que en la C2-23. form, autotallerdocs y portalcliente cambian por las piezas nuevas. enlaceagenda cambia su enlace en cada carga, también en la C2-23.
- **Prueba interna con conexión** (copia aparte, no publicada; a 1280 × 720 y a 1920 × 1080):
  - Publicar el borrador de Pesados envió `publicarConfiguracion` con `SIRIUS_FORMULARIOS`: 5 plantillas y en cada versión `modalidades`, `criteriosA` y `documentos`. Coordinación pasó a leer esa versión de la base.
  - Publicar el catálogo envió `SIRIUS_DOCUMENTOS_CLIENTE` versión 2 con el motivo.
  - Después, `sirius-conexion.js` quedó idéntico a su contenido mínimo.

**No verificado**
- La conexión real con la base.
- Que la app del inspector y los portales del cliente lean estas claves. El simulador del portal todavía muestra sus documentos de ejemplo y no lee `SIRIUS_DOCUMENTOS_CLIENTE` ni el uso por plantilla.
- La tercera pieza de P-6e (completado del informe), que va en otra etapa.

**Diferencias**
- **Documental en Ramos Generales y Equipo y maquinaria:** con DEC-182 se ofrecía; con «solo Presencial» ya no. Se recupera activándola en la plantilla. «No requiere inspección» no es una modalidad de la plantilla y se ofrece siempre.
- **Valores que el pedido no definía:** Pesados queda con las cuatro modalidades (como hoy). Motos: matrícula y licencia requeridas, cédula y contrato como «Otro documento», factura de extras no se usa (no tiene extras). Pesados usa los mismos documentos que Vehículos livianos. Equipo y maquinaria y Ramos Generales no usan documentos del catálogo.
- **Criterios sin dato:** si el caso no trae suma, año, carrocería o sucursal, ese criterio no lo bloquea (20152 no tiene vehículo cargado). Con varios vehículos, el motivo nombra la placa.
- **Plantilla del caso:** sale del formulario del primer vehículo o equipo; sin él, Vehículos livianos para Vehículos y Ubicación – Ramos Generales para los demás ramos.
- **Sin conexión:** publicar una plantilla cambia lo que ve Coordinación solo en la sesión. Con la conexión, Coordinación lee `SIRIUS_FORMULARIOS`.
- **coordmodalidades:** simula la vigente de Vehículos livianos con suma máxima de USD 25.000, porque el único caso de Vehículos por coordinar con suma es de USD 27.800. Muestra los dos casos uno tras otro en una página de escena. El ejemplo de USD 40.000 está en formcriteriosA, en el borrador.
- **Catálogo:** agregué `porExtra` para «1 foto por extra declarado», porque `captura` solo admite frente y reverso o varias fotos. Las fotos de la factura van al paso `extras_extras` y la ficha técnica a `eq_doc_ficha`. El borrador v5 de Vehículos livianos quitó el paso del contrato; el catálogo lo sigue usando porque está en la vigente v4.
- **Documentos y extras:** la tabla nueva convive con la lista anterior de pasos de documentos activos y desactivados de la autoinspección. Las dos siguen en la pestaña.
- **Enlace de autoagendamiento:** ofrece solo Presencial y Virtual guiada si están activas; si ninguna lo está, queda Presencial.
- **Corrección de la C2-23:** la escena disenod1 mostraba debajo «Aún no hay nada por aquí»; ya no.
- **Números de decisión:** usé DEC-203, DEC-204 y DEC-206 como pide el pedido; DEC-205 queda sin usar.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** formmodalidades, formcriteriosA, coordmodalidades, doccatalogo, docusoplantilla, form, versionesplantilla, mapaeditar, coordvis.

---

## 18/10/2026 · 20:30 — Etapa C2-23

Publiqué la etapa C2-23 (Versión 172): las mejoras de diseño D-1 a D-4, solo de presentación. No cambié funciones, reglas, atajos, textos de los eventos ni acciones de la conexión. La registré como mejora de diseño con el número DEC-202, porque el pedido no trae número.

**Qué cambió**
- **D-1 · Marco de la evidencia** (la pieza compartida de la revisión de controles, en «Informe por completar › Controles» y en Calificación): el fondo del marco y las franjas a los lados de la foto son un solo neutro, #F1F4F8. El marco lleva borde de 1 px con `--border-subtle` y radio de 12 px. La barra de zoom es una píldora blanca con la sombra suave del sistema (`--shadow-sm`) y botones sin relleno con texto oscuro; el foco visible no cambia. El rótulo de la foto es un chip blanco al 90 % con texto oscuro. El fondo oscuro queda solo en «Pantalla completa» del visor único.
- **D-2 · Fecha única:** el Historial y la Actividad reciente muestran todas las fechas como «dd/mm/aa · hh:mm» con espacios duros, vengan en ISO, como «dd/mm/aaaa · hh:mm» o ya en ese formato. Cambia solo cómo se muestran: el texto de los eventos y el orden son los mismos.
- **D-3 · Foco de la vista rápida:** al abrirla, el foco pasa al botón de cierre solo en ese momento. Guardo el valor anterior de `quickOpen`, el mismo recurso de la C2-22.
- **D-4 · Botón del menú lateral:** el contenedor del menú pasa a `z-index` 100 (sobre la cabecera y el panel principal, debajo de los paneles y los modales), así que todo el círculo queda visible y responde al clic. El cursor es de mano en todo el círculo, que mide 32 × 32 px. Posición e ícono son los mismos.
- **Escenas:** `ctrllista`, `calctrl`, `cxlimpio` e `historden` actualizadas. Escena nueva `disenod1`: la revisión de controles del caso 30004 en Control de calidad y, debajo, en Calificación, con la misma pieza.
- **Inventario:** etapa C2-23 como mejora de diseño (D-1 a D-4), DEC-202; `KNOWN_ESC` pasa a 501.

**Verificado**
- **Selector a 1280 × 720 y 1920 × 1080:** disenod1, ctrllista, calctrl, cxlimpio, historden y bandejaexp (con el menú lateral) abren sin errores ni desplazamiento horizontal.
- **D-1:** en las tres escenas con marco, el fondo mide rgb(241, 244, 248), el borde 1 px con el color de `--border-subtle` y el radio 12 px. La barra de zoom es blanca, redonda y con sombra, y el rótulo es blanco al 90 % con texto oscuro. La altura del marco es la misma que antes (255 y 460 px en ctrllista; 241 y 460 en calctrl) y la fila de decisión sigue visible a 1280 × 720. «Pantalla completa» abre el visor único oscuro (rgb(11, 26, 46)), también desde disenod1.
- **D-2:** en cxlimpio e historden las 10 fechas del Historial salen «dd/mm/aa · hh:mm» con espacios duros, en los dos sentidos. «11/11/2026 · 18:12» se ve «11/11/26 · 18:12». El orden y el botón de la C2-22 funcionan igual.
- **D-3:** al abrir la vista rápida el foco queda en «Cerrar vista rápida», y ya no vuelve a él cuando después se pasa a otro botón y el estado se actualiza.
- **D-4:** con el menú cerrado y abierto, seis puntos del círculo (centro, los cuatro lados y el borde derecho) responden al clic, y un clic en la mitad derecha lo abre y lo cierra. El botón mide 32 × 32 px con cursor de mano.
- **Sin cambios de texto:** 20 escenas tienen el mismo texto que en la C2-22. En píxeles solo difiere el recuadro del botón del menú (116 a 132 por 56 a 93 px), que ahora se ve entero.
- **Prueba interna con conexión** (copia aparte, no publicada): eventos con «dd/mm/aaaa · hh:mm» con espacios normales y duros, «dd/mm/aa», ISO y uno sin hora. Todas las fechas salen «dd/mm/aa · hh:mm» y el orden es correcto en ambos sentidos a ambos tamaños; la Actividad son las tres más recientes. Después, `sirius-conexion.js` quedó idéntico a su contenido mínimo.

**No verificado**
- Los atajos y el foco del marco con un lector de pantalla o con una tablet táctil: medí tamaños y puntos, no probé la mano ni el toque.
- La disposición del marco con una foto real y de proporción muy distinta: probé la imagen de ejemplo y las fotos de cxlimpio.

**Diferencias**
- **D-3, corrección a la C2-22:** el pedido dice que el foco no pasaba al abrir. Medí antes de cambiar: sí pasaba, porque sin estado anterior la condición siempre era verdadera. El defecto real era que el foco se volvía a forzar en cada actualización mientras la vista estaba abierta, aunque la persona ya estuviera en otro botón. Ahora ocurre solo al abrir. En mi respuesta de la C2-22 dije que no se ejecutaba; eso estaba mal. El menú de acciones del caso tiene la misma condición (foco al primer ítem en cada actualización); no lo toqué porque no estaba en el pedido y no lo medí en pantalla.
- **D-1, la foto:** el borde de 1 px es parte del marco con la misma altura total, así que la foto queda 2 px más baja (193 a 191 px a 1280 × 720; 398 a 396 px a 1920 × 1080). El dibujo de ejemplo conserva su propio fondo, un poco más oscuro que #F1F4F8, y se ve como una lámina sobre el marco; las fotos reales usan las franjas #F1F4F8. Para eso `sirius-evidencias.js` recibe un tercer parámetro opcional de fondo en la imagen en grande; el visor único no lo usa.
- **D-1, video y control sin foto:** como el marco ahora es claro, el anillo de la vuelta del video, su botón de reproducir y el aviso «Este control no tiene foto» pasan de blanco a texto oscuro para poder leerse.
- **D-1, escena disenod1:** muestra las dos revisiones una tras otra, no lado a lado, porque cada una necesita dos columnas y a 1280 px no caben juntas. Usa los controles reales del caso 30004; decidir ahí no guarda nada y avisa «Demostración del diseño D-1».
- **D-2:** la fecha de Informe › Inspección sigue como llega (por ejemplo «10/11/2026 · 06:02»), porque el pedido limita el formato único al Historial y a la Actividad reciente.
- **D-4:** el botón es del componente del menú lateral del sistema de diseño; no lo modifiqué, lo corregí desde el Back-office con el `z-index` del contenedor y una regla de cursor.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** disenod1, ctrllista, calctrl, cxlimpio, historden, bandejaexp.

---

## 18/10/2026 · 20:30 — Etapa C2-22

Publiqué la etapa C2-22 (Versión 171). El Historial de un caso conectado ya sale en orden cronológico real. La causa era que `cxTs` leía «11/11/2026 · 18:00» como 11/11/2020 a medianoche; ahora lee el año completo y la hora. Además, el Historial del caso tiene un botón para cambiar el orden. Registré la regla como DEC-201, porque el pedido no trae número.

**Qué cambió**
- **Lectura de fechas:** en `cxTs` el año de cuatro dígitos se prueba antes que el de dos, y la hora se lee después del año con espacios normales o duros. Corregí el mismo defecto donde aparecía: `infHours` (horas entre la inspección y la carga del Informe), la hora de «Cargar fotos» desde el back-office, la fecha corta de las fotos (`evVals`), la fecha de la determinación al migrar un flujo (`flujoMigrar`), la fecha de la visita de un caso de ejemplo (`visitsFor`) y la fecha y hora de cada foto en `sirius-fotos-veh.js`. En `sirius-fecha.js` solo cambié el orden de las alternativas; el campo ya funcionaba porque su patrón termina en `$`.
- **Botón de orden del Historial:** a la derecha del título, un botón de texto pequeño, sin fondo ni borde, del color de enlace. Dice «↓ Más recientes primero» y, al tocarlo, «↑ Más antiguos primero»; la lista se invierte al instante. Lleva `aria-pressed` («true» con los más antiguos primero) y un `aria-label` que dice el orden actual. Cada vez que se abre un caso arranca en descendente; la preferencia vive solo en el estado de la sesión, sin almacenamiento del navegador. Funciona igual con y sin conexión.
- **Resumen › Actividad reciente:** sin botón; siempre muestra las tres más recientes, con la misma lectura de fechas.
- **Escenas:** `cxlimpio` ahora trae «Solicitud registrada» del 08/11/2026 19:15 y tres eventos con el año escrito con cuatro dígitos («11/11/2026 · 18:12», «11/11/2026 · 18:00» y «10/11/2026 · 05:53»). Escena nueva `historden`: abre el Historial de cxlimpio con «↑ Más antiguos primero».
- **Inventario:** etapa C2-22, DEC-201, filas y tamaños al día; `KNOWN_ESC` pasa a 500.

**Verificado**
- **Selector:** cxlimpio, historden y calveh (un caso de ejemplo sin conexión) abren a 1280 × 720 y a 1920 × 1080 sin errores ni desplazamiento horizontal. También abrí calcxcalif, infcompletarcaso y evunificadas.
- **cxlimpio:** el Historial (10 filas) empieza en «11/11/2026 · 18:12» y termina en «Solicitud registrada 08/11/26 · 19:15 · BPM de Emisión». Los eventos del mismo día quedan por hora: 18:12 antes que 18:00 el 11/11, y 05:57 antes que 05:53 el 10/11. En historden el orden es el inverso.
- **Actividad reciente en cxlimpio:** 11/11/2026 · 18:12, 11/11/2026 · 18:00 y 10/11/26 · 19:30, sin botón y sin cambios al invertir el Historial.
- **Botón:** el texto, `aria-pressed` y `aria-label` cambian y vuelven al pulsar de nuevo; el orden se mantiene al pasar a otra pestaña del mismo caso y vuelve a «Más recientes primero» al cerrar y reabrir el caso. No se usa localStorage ni sessionStorage. Con el caso de ejemplo sin conexión el botón también invierte la lista.
- **Sin conexión:** 20 escenas (inicio, calveh, calrg, bandejaexp, coordvis, evunificadas, infcompletarcaso, calcxcalif, infcxfotos, calpdfcx, calctrlsusc, evidencias, catalogos, motoresvl, g1cal, riesgos, veh, gsolicitar2, informeautomaticos y flujos) tienen el mismo texto y los mismos píxeles que en la C2-21. El recorrido de pestañas de cxlimpio a ambos tamaños no muestra «16/10/26», «Santiago Ortiz» ni «vlocal».
- **Prueba interna con conexión** (copia aparte en `cxtest/c222`, no publicada): eventos reales con «dd/mm/aaaa · hh:mm» con espacios normales y duros, «dd/mm/aa», ISO y uno sin hora, más fotos con el año de cuatro dígitos. El orden es correcto en ambos sentidos a ambos tamaños, la Actividad son las tres más recientes y Informe › Inspección muestra la primera foto («10/11/2026 · 06:02»). Después, `sirius-conexion.js` quedó idéntico a su contenido mínimo.

**No verificado**
- La conexión real con la base y el formato exacto de la hora que enviará: probé ISO, «dd/mm/aa» y «dd/mm/aaaa» con espacios normales y duros.
- El botón con un lector de pantalla: comprobé los atributos, no la lectura.

**Diferencias**
- **Eventos con el mismo minuto:** quedan en el orden en que llegan («Visita terminada» e «Informe de campo recibido de la app» a las 18:10 del 10/11); al invertir, se invierten también entre sí. Un evento con fecha y sin hora cuenta como las 00:00.
- **Formato visible:** las horas ISO se muestran con año de dos dígitos y las escritas como texto se muestran como llegan, con cuatro. Por eso cxlimpio mezcla «11/11/2026 · 18:12» con «10/11/26 · 19:30»; no reformateé para no cambiar el texto de los eventos.
- **Sin conexión:** el botón invierte la lista tal como viene; no reordené por fecha, para que los casos de ejemplo sigan igual.
- **Reinicio del orden:** el framework no entrega el estado anterior a `componentDidUpdate`, así que guardo el caso anterior para volver a descendente al abrir otro. Por lo mismo, el enfoque automático del botón de cierre de la vista rápida, que usa ese estado anterior, no se ejecuta; lo vi en el código y no lo toqué.
- **Datos de cxlimpio:** «Solicitud registrada» pasó del 09/11/2026 23:40 al 08/11/2026 19:15, como pide el pedido; los textos de los tres eventos nuevos son inventados («Comentario del ejecutivo», «Comentario del coordinador» e «Inspector en camino»).
- **Estilo:** el botón usa 13 px y el subrayado de los demás botones de texto del sistema; la etapa no trae medidas.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** cxlimpio, historden, calveh, calcxcalif, infcompletarcaso, evunificadas.

---

## 18/10/2026 · 20:30 — Etapa C2-21

Publiqué la etapa C2-21 (Versión 170). Con la conexión, un caso de la base ya no se arma con la ficha del caso de ejemplo que tiene el mismo número (30004). Cada dato sale de la base y, si no viene, se ve «—» o «Sin dato». Sin conexión todo sigue igual. El pedido no trae número de decisión, así que la registré como DEC-200.

**Qué cambió**
- **Historial:** queda en orden de lo más reciente a lo más antiguo, por fecha y hora completas. Incluye en ese orden «Informe de campo recibido de la app» con su hora real. «Solicitud registrada» usa `registrado` y el origen del caso (por ejemplo «BPM de Emisión»), nunca una persona. Resumen › Actividad reciente muestra las tres acciones más recientes. Las horas ISO se ven «dd/mm/aa · hh:mm» y ya no se cortan.
- **Resumen › Inspección:** «Realizada» es el fin de la visita (o la llegada); el inspector y la modalidad vienen de la visita de la base; sin visita realizada dice «—».
- **Coordinación › Visitas del caso:** la visita es la de la base, con su estado. «Fecha y hora» dice «Cita 11/11/26 · 10:30 · Llegada 10/11/26 · 05:57 · Fin 10/11/26 · 18:10». Si la base no trae visita, no se arma ninguna.
- **Informe › encabezado:** Visita (modalidad y fecha real), Inspección (primera foto del caso o llegada), Carga (`enviadoEn`), Registrado por (`enviadoPor`). Los campos «Fecha y hora de inspección» y «Fecha y hora de carga» del formulario usan los mismos datos. La etiqueta de estado es la del informe en la base («Completo» se ve «Enviado»).
- **Plantilla y versión:** se muestra `plantillaClave` con `plantillaVersion`. Con la versión vacía dice «Vehículos livianos · Presencial · versión de la app sin número» y los pasos se toman de la vigente de Formularios (SIRIUS_FORMULARIOS si la base la publicó). «(vigente)» aparece solo cuando la versión del informe es la vigente. Las fotos se agrupan por las secciones de esa plantilla y «Otras fotos» queda para pasos que no están en ella.
- **Documentos:** una sola regla para Informe, Calificación y Evidencias: son documentos las fotos de pasos del grupo Documentos de la plantilla, de cualquier canal.
- **Datos adicionales:** con la conexión ya no aparecen los valores de ejemplo; se leen de `campos` del caso y de cada riesgo.
- **Escena nueva `cxlimpio`:** simula la conexión completa con el caso 30004 Inspeccionado (creado el 09/11/2026 23:40, cita el 11/11/2026 10:30, llegada el 10/11/2026 05:57, fin el 10/11/2026 18:10, informe sin número de versión enviado el 10/11/2026 18:10 y eventos desordenados). El selector sigue disponible; al cambiar de escena la página se recarga y la simulación desaparece.
- **Inventario:** registré la etapa C2-21, la regla «con la conexión, ningún dato del caso de ejemplo» (DEC-200), las claves nuevas del contrato (`registrado`, `visita.fin`, `visita.agendadoEn`, `visita.origen`, `visita.estado`, `informes[].plantillaClave` y `plantillaVersion`) y KNOWN_ESC en 499.

**Verificado**
- **Selector:** abrí cxlimpio, calcxcalif, infcompletarcaso y evunificadas a 1280 × 720 y 1920 × 1080, sin errores ni desplazamiento horizontal.
- **cxlimpio:** recorrí Resumen, Coordinación, Informe, Evidencias, Calificación e Historial en ambos tamaños. Ninguna pestaña muestra «16/10/26», «Santiago Ortiz», «vlocal», «Mauricio Endara» ni «Patricia Andrade». El Historial (7 filas) está en orden descendente y la Actividad reciente son sus tres primeras filas. «Solicitud registrada» aparece el 09/11/26 · 23:40 con «BPM de Emisión». Informe y Calificación cuentan 3 documentos (21 fotos · 3 documentos).
- **Limpieza:** desde cxlimpio el selector abre otra escena (calcxcalif e infcompletarcaso), la conexión vuelve a estar inactiva y se ven los datos de ejemplo.
- **Sin conexión:** 20 escenas (calcxcalif, infcompletarcaso, evunificadas, calctrl, calctrlcalificado, calpdfcx, infcxfotos, coord, svresumen, calveh, calrg, inicio, ctrlvistos, calvistos, evidencias, veh, infcompletarcx, visorzoom, formbase y bandejaexp) tienen el mismo texto que en la C2-20. En calctrl, calpdfcx y evidencias los píxeles a veces varían entre cargas, también en la copia de la C2-20.
- **Prueba interna con conexión** (copia aparte, con los datos del caso 30004):
  - Se cumple todo lo anterior a 1280 y 1920.
  - Con SIRIUS_FORMULARIOS (v6 vigente, con pasos distintos de los del ejemplo), las fotos se agrupan por esa plantilla; solo un paso desconocido queda en «Otras fotos». Los dos contadores dan 3 documentos, uno de ellos del portal del cliente.
  - La versión vacía dice «versión de la app sin número», la 6 dice «v6 (vigente)» y la 5 dice «v5» sin vigente.
  - La prueba de la C2-20 sigue dando lo mismo.
- **Cierre:** `sirius-conexion.js` quedó idéntico a su contenido mínimo (comparado byte a byte).

**No verificado**
- La conexión real con la base: las pruebas usan datos que armé con la forma del pedido. No conozco las claves exactas de pasos ni de `plantillaClave` que envía la app real.
- El contenido del PDF de un caso de la base: el panel «Informe en PDF» todavía usa la plantilla del vehículo de ejemplo para dibujar el documento, y no lo revisé.
- Lo que se registra en la sesión con la conexión (por ejemplo, una acción nueva) lleva la hora del reloj del prototipo; no comprobé dónde queda en el orden del Historial.

**Diferencias** (de dónde sale cada dato con la conexión)
- **Resumen › Objeto a asegurar:** la placa, la marca, el modelo y el año salen de `solicitud`, y la cobertura del caso. El casco y los extras son los montos asegurados que trae el informe de la base (`veh_valor_asegurado_casco` y `veh_valor_asegurado_extras`) y el total es su suma. Sin esos montos no se muestran valores. No apliqué ninguna regla de reemplazo por el valor sugerido.
- **Coordinación › Recomendación del sistema:** no sale de la ficha del ejemplo. Es la regla fija del prototipo (vehículo sin alertas → Virtual guiada, 82/100) salvo que la base envíe `detalles[id].rec`. La dejé y queda anotada.
- **Datos de póliza:**
  - Broker, Origen, Orden de emisión y Sucursal salen del caso de la base.
  - Correo APS dice «—» si no llega.
  - Línea de negocio y Tipo de solicitud son los valores por defecto («Vehículos» y «Emisión nueva»).
- **Datos adicionales:** antes mostraban los valores de ejemplo de Administración › Campos si el número coincidía. Ahora salen de `campos` del caso y de cada riesgo, una clave opcional que agregué al contrato porque el pedido no nombraba ninguna. Sin ella dicen «Sin dato».
- **Agencia de inspección:** sale de `inspector.agencia` del caso o del directorio de inspectores del prototipo, no de la ficha del ejemplo; con un inspector que no está en ese directorio dice «—».
- **cxlimpio:** como simula la conexión completa, la aplicación entra en modo conectado con un solo caso y la etiqueta «Prueba conectada», y el panel de demostración sigue visible.
- **Orden de la visita:** en los datos de la escena la cita (11/11) es posterior a la llegada y al fin (10/11); se muestra tal cual llega.
- **Versión vigente sin Formularios publicado:** con la conexión, si la base no publica SIRIUS_FORMULARIOS, la vigente es la del prototipo (v4). Por eso un informe que no trae ningún dato de plantilla ahora dice «v4 (vigente)», antes «v3 (vigente)», que salía de otro archivo.
- **Fechas de la C2-20:** las fechas con hora del bloque «Tu calificación» y del pie de la C2-20 ahora usan espacios duros; se ven igual pero no se cortan.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** cxlimpio, calcxcalif, infcompletarcaso, evunificadas.

---

## 18/10/2026 · 20:30 — Etapa C2-20

Publiqué la etapa C2-20 (Versión 169; la herramienta asignó primero la 168, que tenía el mismo contenido pero con otro número en este registro, y la volví a publicar con el número corregido). Con la conexión, «Tu calificación» y todo lo que muestra el veredicto o quién calificó ahora salen de `SIRIUS_CONEXION.calificaciones[idCaso]`, no del dato de reserva (Verónica Lema · 15/10/26 · 16:40). Sin conexión todo sigue igual. Como el pedido no trae número de decisión, lo registré como DEC-199, a continuación de DEC-198.

**Qué cambió**
- **«Tu calificación»:** muestra la calificación más reciente del caso (la de nivel más alto si hay varias en el mismo riesgo): «Asegurable» o «No asegurable», cobertura (o motivo de rechazo) solo si la trae, observación, quién la registró con su rol y la fecha y hora. La etiqueta dice «Determinada al completar el informe» (nivel 0), «Calificación del Ejecutivo» (nivel 1) o «Calificación del Suscriptor» (nivel 2).
- **Sin calificaciones en la base:** el bloque no muestra datos de ejemplo. Dice «Este caso no tiene una calificación registrada» o, si la persona puede calificar (Pendiente calificación), muestra el formulario como hoy.
- **Pie de la revisión de controles:** «Calificación registrada el <fecha> por <persona>» usa la misma fuente que el bloque (primero la calificación de la sesión, después la de la base), así que ambos coinciden. Sin calificación y con el caso ya inspeccionado dice «Este caso no tiene una calificación registrada» (antes decía «pendiente»).
- **Otros lugares con la conexión:** el Resumen (calificación de inspección con nivel 0 o 1, de suscripción con nivel 2; sin calificación queda «Pendiente»), el encabezado del caso (veredicto, cobertura, quién y cuándo, completando solo lo que el caso no trae), cada riesgo de un caso con varios y el PDF disponible («Calificado por … el …»). El Historial solo lee los eventos de la base y no usaba el dato de reserva.
- **Escena nueva `calcxcalif`:** 30004 Inspeccionado como Ejecutivo de inspecciones, con la conexión simulada solo en la pestaña Calificación (nivel 0 «Asegurable» de Patricia Andrade y nivel 1 «Asegurable · Todo riesgo» de Verónica Lema, con observación). La simulación se limpia al cambiar de escena.
- **Inventario:** etapa C2-20, DEC-199, la clave `calificaciones` en el contrato de `SIRIUS_CONEXION` y KNOWN_ESC en 498.

**Verificado**
- **Selector:** abrí desde el selector, a 1280 × 720 y 1920 × 1080, calcxcalif, calctrl, calctrlcalificado y calpdfcx: sin errores de la aplicación ni desplazamiento horizontal.
- **calcxcalif:** el bloque dice «Calificación del Ejecutivo», «Asegurable», Cobertura «Todo riesgo», «Verónica Lema · Ejecutivo de inspecciones» y «18/10/26 · 20:24»; el pie dice «Calificación registrada el 18/10/26 · 20:24 por Verónica Lema», la misma persona y la misma fecha.
- **Sin conexión:** calctrlcalificado, calctrl, calpdfcx, calctrlbloqueo, calctrltodo, svresumen, calvistos, ctrltodos, calveh y calrg tienen el mismo texto que en la C2-19; en calctrlcalificado los píxeles a veces varían entre cargas, también en la copia de la C2-19 (animación), y el texto es igual.
- **Limpieza:** al pasar de calcxcalif a calpdfcx desde la aplicación, la simulación desaparece y el bloque vuelve a los datos de ejemplo.
- **Prueba interna con conexión (copia aparte):** con dos calificaciones muestra la de nivel 1; con tres, la del Suscriptor (nivel 2); sin calificaciones muestra «Este caso no tiene una calificación registrada», sin dato de reserva, tanto en el bloque como en el Resumen («Pendiente», «Aún no se califica») y en el PDF (sin «Calificado por»). Con el caso en Pendiente calificación y sin calificaciones aparece el formulario. El encabezado toma el veredicto de la base, y un caso con dos riesgos muestra quién calificó cada uno (Patricia Andrade y Verónica Lema) y «1 de 2 asegurables».
- **PDF:** con la conexión, el origen del veredicto sale «Calificado por Verónica Lema el 18/10/26 · 20:24».
- **sirius-conexion.js** quedó idéntico a su contenido mínimo (comparado byte a byte).

**No verificado**
- La conexión real con la base: las pruebas usan datos que armé yo en una copia aparte, con la forma que describe el pedido.
- Casos de Ramos Generales y de equipos con la conexión: tienen sus propios paneles de calificación y no los cambié.
- En la primera corrida de las escenas aparecieron errores de red al cargar recursos externos del entorno de pruebas; no vienen de la aplicación y no se repitieron al filtrar la red.

**Diferencias**
- Con la conexión el chip del bloque dice «Asegurable» o «No asegurable», como pide el pedido; sin conexión sigue diciendo «Es asegurable».
- calpdfcx sigue mostrando la calificación de ejemplo en el bloque, porque esa escena simula la conexión solo en el panel «Informe en PDF»; no es un caso que venga de la base.
- Si la base trae un caso sin `aseg`, el encabezado usa el veredicto de la calificación más reciente; si el caso ya lo trae, se respeta el del caso. `califUser` y `califFecha` siempre se toman de la calificación.
- En calcxcalif la lista de controles todavía dice «Calificar está bloqueado» porque 30004 tiene un control de severidad alta pendiente; es el comportamiento de la C2-19 y no lo cambié (calpdfcx dice lo mismo).
- Un veredicto distinto de «Asegurable» o «No asegurable» se ignora.
- Los riesgos de un caso con varios se buscan por id, etiqueta, placa o id de ejemplo; si ninguna calificación coincide, el riesgo queda como llega de la base.

**Escenas abiertas desde el selector (1280 × 720 y 1920 × 1080):** calcxcalif, calctrl, calctrlcalificado, calpdfcx.

---

## 18/10/2026 · 20:30 — Etapa C2-19

Publiqué la etapa C2-19 (Versión 166). Con DEC-198, que reemplaza la parte de DEC-185 que permitía a Control de calidad marcar controles, los controles los revisa solo el calificador (Ejecutivo de inspecciones y Administrador). Control de calidad y el inspector independiente los ven con su evidencia y confirman «Ya los vi»; el Suscriptor solo los consulta.

**Qué cambió**
- **Paso Controles para quien completa el informe** (Control de calidad e inspector independiente): la pestaña dice «1 Controles · Por ver» y, al confirmar, «✓ Controles · Vistos». La lista, los filtros y la evidencia mantienen la disposición de C2-14. Ya no aparecen Conforme, Requiere acción, el comentario por control, «Marcar todos como conformes» ni los atajos A y R; J y K siguen.
- **Estado en solo lectura:** cada control muestra el estado del calificador («Pendiente del calificador», «Conforme» o «Requiere acción», con su comentario).
- **«Ya los vi · continuar al informe ›»:** un solo botón al pie y en la fila bajo la evidencia, con comentario opcional. Registra que se vieron todos los controles del caso, queda en el Historial y pasa al paso Informe. Después la lista muestra «Vistos el <fecha> por <persona>» y «Continuar al informe ›». Si llega un control nuevo, solo ese queda «Por ver» y el paso vuelve a «Por ver».
- **Pendientes y envío:** para estos roles, el paso Controles cuenta como un solo pendiente («ver los controles») en la barra. «Completar y enviar» exige haberlos visto, también si se llama directamente. Devolver al inspector no lo exige. El resto de las condiciones de envío no cambia.
- **Calificador:** la revisión de Calificación sigue como en la C2-17 y agrega en el encabezado de la lista «Vistos por <persona> (<rol>) el <fecha>». Sin conexión, los controles del informe de un caso que ya pasó la inspección ahora se revisan en Calificación con la misma lista, el bloqueo por severidad alta y el contador de la pestaña. El Administrador ve el paso Controles completo en «Informe por completar» y además tiene «Ya los vi».
- **Con la conexión:** «Ya los vi» envía `verControles { caso, comentario }`; con `{ ok: false }` la pantalla vuelve atrás y muestra el mensaje. Los controles con `vistoEn` y `vistoPor` muestran «Vistos el … por …» (y el rol si llega `vistoRol`). `revisarControl` y `revisarControles` solo salen para el calificador; para los demás la pantalla responde «Solo el calificador revisa los controles; tú confirmas que los viste» sin llamar a la base.
- **Otros lugares:** la pestaña Evidencias, el visor y «Con control» en Informe › Fotos ya eran de solo lectura para los controles (solo filtran o llevan a la lista). El panel de la autoinspección ya dependía de «Calificar nivel 1».
- **Matriz de permisos** (datos-usuarios.js v2.0): nueva acción «Ver los controles y confirmar que se vieron» (Administrador E; Inspector y Control de calidad P). «Calificar nivel 1» incluye revisar los controles del caso.
- **Datos:** el caso 30006 (Luis Andrade, independiente) trae dos controles (datos-completar-informe.js v1.6).
- **Escenas:**
  - Actualizadas: infcompletarcaso; ctrllista (ahora del Administrador); ctrltodos (ahora del calificador en Calificación); infprimerpendiente (controles vistos, no revisados) y calctrl (solo la descripción). También infcompletarcambiar e infcompletarind, con los controles ya vistos.
  - Nuevas: ctrlvistos, ctrlvistosok, ctrlindep y calvistos.
  - KNOWN_ESC pasa a 497 nombres. En el inventario quedó la etapa C2-19 con DEC-198.

**Verificado**
- **Selector:** abrí, a 1280 × 720 y 1920 × 1080, infcompletarcaso, ctrllista, ctrltodos, infprimerpendiente, calctrl, ctrlvistos, ctrlvistosok, ctrlindep, calvistos, infcompletarcambiar, infcompletarind, calctrlfin y calctrlcalificado: sin errores ni desplazamiento horizontal. Los únicos avisos de la consola son las cargas externas bloqueadas del entorno.
- **Control de calidad (ctrlvistos):**
  - No hay botones Conforme, Requiere acción ni «Marcar todos».
  - J pasa al siguiente control; A y R no cambian ningún estado.
  - Enviar sin haber visto los controles se rechaza con «No se envió: falta confirmar que viste los controles («Ya los vi»)».
  - «Ya los vi» del pie lleva al paso Informe, deja el paso en «✓ Vistos», baja la barra de 6 a 5 pendientes y deja «Controles vistos · Patricia Andrade · Control de calidad (agencia) · confirmó que vio 9 controles» en el Historial. Después el envío pasa (30004 quedó Inspeccionado).
- **Control nuevo (ctrlvistosok):** al quitar un control de los vistos, solo ese muestra «Por ver», aparece «1 control nuevo por ver» y el paso vuelve a «Por ver».
- **Inspector independiente y otras pantallas:** en ctrlindep el inspector tampoco puede cambiar controles. En evunificadas, evidencias y visorzoom (Control de calidad) no hay ningún botón que cambie un control.
- **Calificador:** en calctrl la revisión, J/K/A/R, el bloqueo y «Continuar a la calificación ›» funcionan como en la C2-17. calctrl, calctrlcalificado, calctrlbloqueo, calctrltodo, calctrlsusc y svresumen quedaron con el mismo texto y los mismos píxeles que en la C2-18. calctrlfin tiene el mismo texto y una diferencia de píxeles que ya aparecía al compararla consigo misma por la animación.
- **calvistos:** con «Vistos por Patricia Andrade (Control de calidad) el 18/10/26 · 20:12», A en el control de severidad alta quita el bloqueo de la calificación.
- **ctrltodos:** «Marcar todos» sin la casilla de altas muestra «Confirma que revisaste los controles de severidad alta.»; con ella deja 9 de 9 revisados, sin bloqueo y con los dos «Continuar a la calificación ›».
- **Suscriptor:** en calvistos no tiene botones de revisión y A no hace nada.
- **Administrador (ctrllista):** revisa (A deja «7 pendientes») y tiene «Ya los vi».
- **Prueba interna con conexión** (cxtest/c219, Patricia Andrade con 30004):
  - «Ya los vi» envió `verControles { caso: 30004, comentario }`.
  - Con `{ ok: false }` el paso sigue «Por ver» y aparece el mensaje de la base.
  - Con `{ ok: true }` el paso queda «✓ Vistos» y la lista dice «Vistos el 18/10/26 · 20:30 por Patricia Andrade».
  - Con `vistoEn` y `vistoPor`, la lista dice «Vistos el 18/10/26 · 19:58 por Patricia Andrade».
  - Como Ejecutivo de inspecciones, la Calificación muestra «Vistos por Patricia Andrade (Control de calidad) el 18/10/26 · 19:58» y A envía `revisarControl`.
  - Como Control de calidad, una llamada directa a `revisarControl` se rechaza sin enviar nada.
  - Después comparé sirius-conexion.js del proyecto con el contenido mínimo: idéntico.

**No verificado:** la conexión real con la base (`verControles`, `vistoEn`, `vistoPor` y el rechazo de la base a `revisarControl` para otros roles se probaron con una conexión simulada); un envío completo sin datos inyectados (para probar el envío forcé «sin campos pendientes», porque los casos de ejemplo tienen obligatorios pendientes); y la pantalla Roles y permisos con la nueva acción.

**Diferencias**
- Para que quien completa el informe pueda verlos sin errores, la lista ahora muestra «Conforme» cuando la base trae «Correcto» y «Pendiente» ante un estado desconocido. Antes un control «Correcto» de la base rompía la lista en solo lectura con el filtro Todos.
- Sin conexión, la lista del calificador en Calificación aparece en los casos de ejemplo con controles del informe que ya pasaron la inspección (30004 a 30008), con el contador de la pestaña. Por eso calpdfcx (30004 Inspeccionado) muestra ahora la revisión y el «8» en la pestaña Calificación.
- En los pasos de completar con la escena de Control de calidad (evunificadas, infpasoinforme, infvalores, infsino, inftestigos, infextras, infdecision), el paso dice «Por ver» en lugar de «8 pendientes» y la barra cuenta «ver los controles» como uno.
- El Administrador mantiene el conteo y el envío de antes (no le exige «Ya los vi»), porque revisa.
- El Ejecutivo de inspecciones que abre «Informe por completar» ve los controles en solo lectura con «el calificador revisa los controles en la pestaña Calificación»: los revisa en Calificación.
- Con la conexión, «Vistos por … (rol)» solo muestra el rol si la base trae `vistoRol`.
- La descripción anterior de infcompletarcambiar decía «Todo listo para enviar», pero ya en la C2-18 quedaban 2 obligatorios del informe; no lo cambié.

---

## 18/10/2026 · 20:30 — Etapa C2-18

Publiqué la etapa C2-18 (Versión 165; la herramienta asignó primero la 164 y la republiqué solo para corregir este número, sin otros cambios): con la conexión, «Informe en PDF › Generar informe» evalúa la disponibilidad de cada documento con los datos del caso que llegan de la base y no con los del caso de ejemplo (DEC-197).
- **Causa:** el caso 30004 de la conexión coincide por número con un vehículo de ejemplo (`30004-V1`, informe «Por completar»), y `svVehiculos` e `infEstado` leían ese vehículo. Por eso «Informe de inspección» salía deshabilitado con «hoy: Por completar» aunque la base tuviera el informe completo y el caso Inspeccionado.
- **Fuente de la base:** con la conexión, `cxCaso(c)` entrega el estado del caso, el veredicto y el estado del informe de `SIRIUS_CONEXION`. Equivalencia del estado del informe (`cxInfEq`): «Completo» y «Enviado» cuentan como «Enviado»; «Datos de campo» y «Por completar», como «Por completar»; «Devuelto», como «Devuelto». Si la base no trae el estado del informe, se deduce del estado del caso (Devuelto al inspector, Informe por completar o un estado posterior a la inspección). El veredicto sale de `aseg` del caso, la misma fuente del encabezado, y, si falta y el caso ya está inspeccionado, del criterio registrado (`criterioInspector.valor`). Las reglas de disponibilidad no cambian, solo la fuente; el texto de ayuda muestra el estado resultante (por ejemplo, «hoy: Por completar»).
- **Otros lugares:** `infEstado` es la única fuente del estado del informe en la pestaña Informe, la lista de informes del caso y el indicador de enviado (`vehSent`); ahora usa la base con la conexión. El estado del caso y el veredicto del encabezado, el Resumen, la Bandeja y «Informes por completar» ya salían de la conexión (`c.estado`, `c.aseg`, `c.criterioInspector`). En «Informe enviado desde la app» (sirius-conexion-vistas.js) el color de éxito también cubre «Completo».
- **Línea «Calificación registrada…»:** con la conexión sale de la calificación de la sesión o de lo que registró la base: `detalles[id].califs` con estado distinto de Pendiente o, si no, el evento del caso con «calific» o «dictamen» (y, si el caso ya está inspeccionado, «complet», «determin» o «decisi»), con el actor y la hora del evento. Si la base no la trae, la línea dice «Este caso no tiene una calificación pendiente». La fecha ISO se muestra como «dd/mm/aa · hh:mm». Antes salía del dato de reserva «Verónica Lema · 15/10/26 · 16:40» que arma la pantalla para los casos de ejemplo.
- **Escena calpdfcx** (área Salida): pestaña Calificación de 30004 como Ejecutivo de inspecciones, con la conexión simulada solo en este panel (`window.__sirCxPdfSim`: Inspeccionado, informe «Completo», criterio Asegurable). Los tres documentos quedan habilitados y abren el PDF aprobado; la simulación se limpia al cambiar de escena (`irEscena`). KNOWN_ESC pasa a 493 nombres. En el inventario quedó la etapa C2-18 con DEC-197.

**Verificado:**
- Abrí desde el selector, a 1280 × 720 y 1920 × 1080, calpdfcx, calctrl, calctrlfin y calctrlcalificado: sin errores ni desplazamiento horizontal. Los únicos avisos de la consola son las cargas externas bloqueadas del entorno.
- En calpdfcx, «Resumen para el APS», «Informe de inspección» y «Ambos» están habilitados y no aparece el texto de ayuda de documentos no disponibles. «Ver vista previa» abrió el PDF aprobado en los tres casos: el Resumen con 1 página, el Informe de inspección con 6 y Ambos con las dos pestañas, la del Resumen y la del Informe de inspección. Al pasar a otra escena la simulación se borra (`__sirCxPdfSim` queda sin definir).
- Sin conexión no cambió nada: svresumen, svflota, svsinveredicto, svpdq, dp1aps, empdf, calctrl, calctrlfin, calctrlcalificado, infcompletarcaso, evunificadas, calveh y calcola tienen el mismo texto y los mismos píxeles que en la C2-17 (en calctrlfin, svsinveredicto y calcola hubo una comparación con píxeles distintos que se repitió idéntica; la misma escena comparada consigo misma también varió una vez, por la animación de la pantalla).
- Prueba interna con conexión en una copia aparte (cxtest/c218, usuario Ejecutivo de inspecciones). Caso 30004 Inspeccionado, Asegurable y con el informe «Completo»: el panel habilita los tres documentos. Caso 30005 en Pendiente calificación con el informe «Por completar»: los tres documentos quedan deshabilitados y el texto dice «Informe de inspección: Disponible cuando el informe del vehículo esté Enviado (hoy: Por completar)». En la pestaña Informe, 30004 muestra «Enviado» y 30005 «Por completar». La línea de calificación de 30004 salió del evento de la base («Calificación registrada el 16/10/26 · 11:20 por Daniela Ruiz»); sin eventos, dice «Este caso no tiene una calificación pendiente». Después comparé sirius-conexion.js del proyecto con el contenido mínimo: idéntico.

**No verificado:** la conexión real con la base. El nombre del campo del estado del informe (`informes[id][0].estado`) y de los eventos de calificación se tomó del contrato ya documentado (P-6b, `eventos` con `accion`, `actor` y `hora`), pero no se probó con los datos reales. Tampoco probé la descarga del PDF ni la del ZIP (en este entorno se bloquea la biblioteca externa) ni la generación en un caso de la base cuyo número no exista entre los vehículos de ejemplo.

**Diferencias:**
- El panel «Informe en PDF» sigue armando el contenido del PDF con el vehículo de ejemplo del mismo número de caso: con la conexión solo cambia la disponibilidad (estado del informe, estado del caso y veredicto) y el resultado del documento. Un caso de la base sin vehículo de ejemplo con su número sigue mostrando «El PDF no está disponible para este caso»; armar el PDF solo con los datos de la base es un cambio mayor y no lo hice.
- «Completo» nunca aparece en el texto de ayuda: con ese estado el informe cuenta como Enviado y el documento está habilitado, por lo que no hay texto. «Datos de campo» se muestra como «Por completar», según la equivalencia pedida.
- La etiqueta «Datos de campo / Por completar / Completo» del encabezado de la pestaña Informe se calcula con los campos llenos del formulario, no con el estado de la base, y no la cambié. En «Informe enviado desde la app» el texto sigue siendo el estado de la base («Completo») y solo cambié su color.
- «Informes por completar» toma el estado y el criterio de la conexión, pero el nombre del vehículo, la placa, la agencia y la hora de la visita de los casos 30004 a 30008 siguen saliendo de los datos de ejemplo cuando el número coincide (no cambia el estado ni el veredicto). No lo cambié para no tocar su diseño.
- El bloque «Tu calificación» de la pestaña Calificación sigue usando el dato de reserva (Verónica Lema · 15/10/26 · 16:40) cuando el caso está inspeccionado y tiene `aseg`: solo cambié la línea del pie de la C2-17. Lo dejo anotado para decidirlo aparte.
- El veredicto usa `aseg` del caso y, si falta y el caso ya está inspeccionado, el criterio registrado; el encabezado sigue mostrando solo `aseg`.
- En la escena calpdfcx el encabezado y el bloque de calificación vienen de los datos de ejemplo (el caso se pone en Inspeccionado y Asegurable); lo único simulado como conexión es el panel «Informe en PDF».

---

## 18/10/2026 · 20:30 — Etapa C2-17

Publiqué la etapa C2-17 (Versión 162): la «Revisión de controles» de Calificación usa la misma disposición que el paso Controles de «Informe por completar» (C2-14), y «Continuar a la calificación ›» solo aparece cuando hay algo que calificar (DEC-196).
- **Misma disposición que la C2-14:** SiriusControlesLista toma ahora por defecto el alto disponible para la evidencia (entre 220 y 460 px) cuando no se le pasa `alturaEvid`; así Calificación (autoinspección y conexión) y cualquier otro lugar en dos columnas usan las mismas reglas que el paso Controles. La foto va con object-fit: contain, la barra de zoom y «Pantalla completa» (que abre el visor único) quedan dentro de la evidencia, y la fila de decisión va justo debajo de la foto; el bloque «Evidencia / Contexto» de la autoinspección quedó debajo de la decisión. Con la disposición compacta los atajos J/K/A/R pasan a la ayuda del comentario (como en los pasos) y el «Conforme · persona · fecha» va en una sola línea.
- **«Continuar a la calificación ›» solo con algo que calificar:** la lista recibe `calificable` (el `canCalificar` de la calificación: rol, facultad y el estado que hoy habilita el formulario, sin calificación registrada). Con `calificable === false` no hay botón ni en el pie ni en la fila de decisión, y el pie muestra «Calificación registrada el <fecha> por <persona>» o, si no hay, «Este caso no tiene una calificación pendiente». La revisión de controles sigue disponible según los permisos de siempre.
- **Acción «evidencia» con motivo:** con la conexión, evSet envía `{ caso, paso, id, estado, motivo, observacion, dano }`; el motivo va al excluir y vacío en los demás cambios (si solo se edita la observación de una foto excluida, conserva su motivo). Sin conexión no cambia nada.
- **Escenas:** calctrl y calctrlfin actualizadas; nueva calctrlcalificado (20186 calificado como Asegurable por Juan Pérez, estado Inspeccionado, 14 de 14 controles revisados, sin ningún botón «Continuar» y con «Calificación registrada el 18/10/26 · 20:29 por Juan Pérez»). KNOWN_ESC pasa a 492 nombres. En el inventario quedó la etapa C2-17 con DEC-196.

**Verificado:**
- Abrí desde el selector, a 1280 × 720 y 1920 × 1080, calctrl, calctrlfin, calctrlcalificado, ctrllista e infcompletarcaso, y además calctrllecturas, calctrlbloqueo, calctrltodo, calctrlsusc, ctrltodos, infprimerpendiente, evunificadas e infpasoinforme: sin errores ni desplazamiento horizontal. Los únicos avisos de la consola son las cargas externas bloqueadas del entorno.
- calctrl a 1280 × 720, sin desplazar la página: la foto entera (object-fit: contain, 179 px de alto dentro de una evidencia de 241 px), la franja de contexto, la barra de zoom con «Pantalla completa» y la fila de decisión (termina en el píxel 718 de 720). Antes la decisión quedaba en el píxel 1458. A 1920 × 1080 la evidencia llega a 460 px y la decisión queda en 905. calctrl y ctrllista tienen la misma estructura y las mismas reglas; ctrllista termina su decisión en 654.
- calctrlfin muestra «Continuar a la calificación ›» en el pie y en la fila de decisión (2 botones). calctrlcalificado no muestra ninguno y lee «Calificación registrada el 18/10/26 · 20:29 por Juan Pérez». calctrlsusc (Suscriptor, solo lectura) muestra «Este caso no tiene una calificación pendiente» y ningún botón.
- Reglas de revisión en calctrl: J y K cambian de control; A deja «1 de 14 revisadas»; R sin comentario muestra «Escribe qué acción hace falta.»; con 3 altas pendientes sigue el aviso «Calificar está bloqueado» y no hay botón; al decidir los 14 el bloqueo desaparece y aparecen los 2 botones.
- Sin conexión, evunificadas, infpasoinforme e infprimerpendiente quedaron idénticas a la etapa C2-16 en texto y en píxeles; infcompletarcaso, ctrllista y ctrltodos quedaron con el mismo texto (los píxeles cambian unos pocos px por el ajuste de espacios, ver Diferencias).
- Prueba interna con conexión en una copia aparte (cxtest/c217, usuario Ejecutivo de inspecciones, 30004 en Inspeccionado/Asegurable con 9 de 9 controles revisados y 30005 en Pendiente calificación): en 30004 la pestaña Calificación no muestra ningún botón y muestra la línea del pie; en 30005, con controles pendientes, tampoco hay botón (bloqueo) y, al revisar los 9, aparecen los 2 botones «Continuar a la calificación ›». Excluir la Foto «Frontal» de 30005 con motivo envió la acción «evidencia» con { caso: 30005, paso: exteriores_frontal, id: cx39-01, estado: Excluida, motivo: «Foto movida, no se distingue el vehículo», observacion: «», dano: null }; confirmarla después la envió con motivo vacío. Las acciones revisarControl salieron una por control. Después comparé sirius-conexion.js del proyecto con el contenido mínimo: idéntico (`window.SIRIUS_CONEXION = window.SIRIUS_CONEXION || { activo: false };`).

**No verificado:** la conexión real con la base (la acción «evidencia» con motivo y los estados de los casos se probaron con una conexión simulada), el modo con varios vehículos de la base en Calificación y la revisión con teclado y lector de pantalla en esta disposición.

**Diferencias:**
- El componente no tiene una tira de miniaturas: lo que queda visible junto a la foto es la barra de zoom con «Pantalla completa». No agregué una tira porque no existe en la C2-14 y habría cambiado la disposición.
- La disposición compacta es ahora el valor por defecto de SiriusControlesLista (cuando no se pasa `alturaEvid`). Para que la decisión quepa a 1280 × 720 también en Calificación ajusté espacios de la lista compartida (franja de contexto, separación y fila de decisión: unos 2 a 6 px). En ctrllista, infcompletarcaso y ctrltodos el texto es idéntico, pero la foto crece unos 14 px y los píxeles ya no coinciden con la C2-16.
- En Calificación, la fila de decisión pasa a ir justo debajo de la foto y el bloque «Evidencia / Contexto» de la autoinspección queda debajo (antes iba entre ambos). Los atajos J/K/A/R siguen funcionando; su recordatorio visible ahora está en la ayuda del campo Comentario.
- El pie de la lista muestra «Este caso no tiene una calificación pendiente» también cuando la persona solo mira (Suscriptor) o el estado no admite calificar. «Calificación registrada…» sale solo si el caso tiene una calificación guardada (nivel 1 o la de la sesión).
- «Continuar a la calificación ›» depende de `canCalificar`, que es la regla que ya habilitaba el formulario. El bloque de calificación de varios vehículos (vehVals) no cambió.
- En 30004 de la prueba interna, la línea del pie salió «Calificación registrada el 15/10/26 · 16:40 por Verónica Lema»; no revisé de dónde sale esa fecha y esa persona en un caso de la base, así que el texto exacto con la conexión real queda por confirmar.

---

## 18/10/2026 · 20:30 — Etapa C2-16

Publiqué la etapa C2-16 (Versión 161): con la conexión activa, Informe › Fotos lee las evidencias de la base (DEC-195). Antes armaba las fotos con el riesgo de ejemplo, por eso 30004 mostraba «Foto 1… Exteriores 16/10/26» con autos dibujados mientras la pestaña Evidencias mostraba las 39 reales.
- **Misma fuente que Evidencias:** «Por sección» y «Galería» arman las fotos con SIRIUS_CONEXION.evidencias del caso (evLista → evCx), la lista de la pestaña Evidencias, del visor único y de «Fotos de esta sección». Cada foto muestra el nombre del paso, fecha y hora, canal, ubicación («Sin GPS» si no hay), validación, lecturas y la imagen de la URL firmada. Una evidencia sin URL dice «Sin imagen»; nunca un auto de ejemplo.
- **Plantilla del caso:** el nombre y la sección del paso salen de la plantilla del caso, por el nombre y la versión del informe o, si no los trae, la vigente. La sección sale del atributo sec del paso (DEC-194). evCx ya no fija «Vehículos livianos v1», así que Informe › Fotos y Evidencias muestran los mismos nombres.
- **Filtros y cumplimiento:** Todas, Asignadas, Confirmadas, Excluidas, Sin GPS y Con control (controles pendientes del caso cuyo detalle.paso es el de la foto) con los mismos conteos de la pestaña Evidencias. El cumplimiento por modalidad («N de M · falta …») y los grupos de «Por sección» usan los pasos de la plantilla del caso y esas evidencias.
- **Acciones:** confirmar, excluir con motivo (mínimo 5 caracteres), reincorporar y observar pasan por evSet: estado, motivo e historial del caso y la acción «evidencia» de la conexión, que se deshace si la base la rechaza. Quien edita es quien edita en la pestaña Evidencias (el Control de calidad que completa el caso también).
- **Otros lugares:** el visor único, «Fotos de esta sección» (cpFotosIds ahora usa la plantilla del caso) y la pestaña Evidencias ya leían la conexión. El PDF de vehículos y la salida (SalidaVeh) usaban fotos de ejemplo: con la conexión leen las mismas fotos no excluidas, con la imagen real o «Sin imagen · paso».
- **Escena infcxfotos:** simula la conexión solo en esta vista, con 6 evidencias de 30004 (2 sin GPS, 1 con el control de la placa, 1 sin imagen) en SIRIUS_COMPLETAR.cxFotosPrueba. La simulación se limpia al cambiar de escena. KNOWN_ESC pasa a 491 nombres. En el inventario quedó la etapa C2-16 con DEC-195.

**Verificado:**
- Abrí desde el selector, a 1280 × 720 y 1920 × 1080, infcxfotos, evunificadas, infpasoinforme e infcompletarcaso: sin errores ni desplazamiento horizontal. Los únicos avisos de la consola son las cargas externas bloqueadas del entorno (fuentes y bibliotecas).
- Sin conexión, evunificadas, infpasoinforme e infcompletarcaso quedaron idénticas a la etapa C2-15 en texto y en píxeles. Svresumen, dp1aps y calrgsalida, que usan el PDF y la salida, también quedaron idénticas en píxeles. Sin conexión, el PDF de 30004 y los documentos de SalidaVeh tienen el mismo contenido de antes, con las 39 «Foto de ejemplo».
- En infcxfotos los conteos son Todas 6, Sin GPS 2 y Con control 1 (la placa trasera). Hay 5 imágenes y 1 «Sin imagen» (el habitáculo del motor), la lectura «Placa: PRB2Z04 · 93 %» y ninguna imagen de ejemplo. Excluir la Foto 1 sin motivo muestra «Escribe el motivo (mínimo 5 caracteres)» y no cambia nada; con motivo dan Excluidas 1 y Asignadas 5, y la tarjeta muestra el motivo. Confirmar la Foto 2 da Confirmadas 1 y Asignadas 4. El visor abre las mismas 6 con «1 de 6».
- Al pasar de infcxfotos a evunificadas, la simulación se limpia (39 fotos de ejemplo, sin imágenes de la base); al volver a infcxfotos se arma de nuevo.
- Prueba interna con conexión en una copia aparte (cxtest/c216, con las 39 evidencias de 30004: 36 con imagen, 3 sin URL, 2 sin GPS y 5 con control): Informe › Fotos muestra Todas 39 en «Por sección» y en «Galería», con 36 imágenes y 3 «Sin imagen», sin fotos de ejemplo. Los 39 nombres de paso son los de la pestaña Evidencias, con la plantilla v1, con la v4 y con la vigente a 1280, y con la v1 a 1920.
- En esa copia, «Fotos de esta sección» coincide con lo esperado en las 12 secciones (Identificación 13, Matrícula 3, Uso 5, Verificación 3, Accesorios 12, Neumáticos 5, Testigos 1, Averías 7). El PDF (Ver PDF en «Criterio y decisión») muestra 38 imágenes (36 fotos y las 2 de referencia), 3 «Sin imagen» y ninguna «Foto de ejemplo». La salida da 39 fotos en el Informe (36 con imagen, 3 sin) y 4 en el Resumen (3 con imagen, 1 sin).
- En esa copia, excluir la Foto 1 con motivo y confirmar la Foto 2 enviaron la acción «evidencia» a la conexión (exteriores_frontal Excluida, exteriores_posterior Confirmada). Ambas quedaron en la lista de la pestaña Evidencias y en el historial del caso. sirius-conexion.js sigue con su única línea mínima.

**No verificado:** la conexión real con las URL firmadas de la base, que esas imágenes carguen en el PDF descargado (la vista previa sí las muestra; el archivo real y los permisos de origen cruzado no se probaron) y el comportamiento con un caso de varios vehículos de la base.

**Diferencias:**
- La vista «Fotos» aparece en un caso de la base aunque no tenga un riesgo de ejemplo, siempre que tenga al menos una evidencia que no sea video. Antes ese caso no tenía la vista.
- Con la conexión, quien edita en Informe › Fotos es quien edita en la pestaña Evidencias (evPuede). Sin la conexión sigue el permiso de antes.
- Con la conexión, el PDF y la salida no incluyen las fotos excluidas. Sin la conexión no hay exclusión y no cambia nada.
- Con la conexión, los nombres de paso en la pestaña Evidencias salen primero de la plantilla del caso (antes, de la etiqueta de la plantilla vigente): si el informe trae otra versión, algún nombre puede cambiar. Un paso que la plantilla no tiene conserva su nombre de siempre.
- Los videos no aparecen en Informe › Fotos (siguen en el panel de evidencias y el visor). La hora de la evidencia se muestra como llega, salvo si es ISO, que se pasa a «dd/mm/aa · hh:mm».
- En infcxfotos solo Informe › Fotos, el visor y «Fotos de esta sección» leen la simulación: la pestaña Evidencias de esa escena sigue con las de ejemplo, porque la simulación no activa toda la conexión.
- El bloque de evidencias de la calificación de varios vehículos (vehEvid) sigue leyendo SiriusFotosVeh por riesgo: con un caso de la base sale vacío y no usa fotos de ejemplo. No lo cambié porque no es la vista de fotos.

---

## 18/10/2026 · 20:30 — Etapa C2-15

Publiqué la etapa C2-15 (Versión 160): el mapa de captura y la guía de la cámara de cada paso se editan desde Formularios con la biblioteca de siluetas (DEC-190; observaciones 1 y 2).
- **Solo en el borrador:** en Formularios › Pasos de foto, el mapa se edita solo en un borrador. En una versión vigente o retirada, puntos, orden y guías quedan de solo lectura con «Para cambiar el mapa, crea un borrador» y el botón «Editar: crea el borrador vN» (o «abre» si ya existe).
- **Controles de arriba:** Modalidad (Presencial, Virtual guiada y Autoinspección, cada una con su número de pasos), Carrocería por grupo, «Copiar posiciones de» otra carrocería (escaladas a la caja de destino) y «Vista previa en la app».
- **Orden por modalidad:** cada modalidad tiene su lista numerada. Se reordena arrastrando o con Alt + ↑ / ↓, y los documentos van aparte, al final. Presencial usa ordenP con la regla de C2-13. Virtual guiada y Autoinspección guardan ordenV y ordenA con la misma regla; si no existen, se crean con el orden de la lista. Reordenar en la lista de Pasos de foto cambia las tres columnas igual, solo entre pasos marcados en cada una.
- **Posiciones:** se guardan en mapaPos[carrocería][paso], en coordenadas de la vista superior. La sugerida sale de SIRIUS_SILUETAS.mapaCaptura; si el paso tiene otro identificador en la plantilla (por ejemplo, «Lateral izquierdo» de Motos), toma la del paso equivalente y se corre 20 unidades si ese punto ya está ocupado. Los puntos numerados se arrastran o se mueven con las flechas (2 unidades), unidos por la ruta punteada. El panel del paso tiene «Volver a la sugerida» y «Quitar del dibujo». Los pasos sin posición van a «Sin ubicar»: eliges uno y haces clic en el dibujo, o usas «Ubicar al centro». Los documentos no se dibujan.
- **Guía de la cámara:** está en el panel del mapa y en el editor del paso. Se elige «Silueta», con las vistas frente, lateral izquierdo, posterior, lateral derecho y superior en miniaturas de la carrocería, o «Marco», con placa, franja, documento, tablero, círculo y libre. Se guarda como guia y, en el formato de hoy, como el texto guide («Silueta · frente», «Franja · VIN»). La vista previa es oscura, horizontal o vertical. Las versiones sin guia la toman de guide.
- **Biblioteca de siluetas:** «Cargar imagen o silueta» ahora es «Agregar una silueta a la biblioteca». El diálogo pide carrocería, vista, archivo SVG y motivo. Revisa que el SVG tenga un solo contorno (DEC-147) y muestra la silueta en estilo guía. Si la vista ya existe, el botón dice «Reemplazar en la biblioteca». Queda en el historial y, con la conexión, se publica SIRIUS_SILUETAS por SiriusPublicar.
- **Vista previa en la app:** muestra un celular con el mapa y los puntos hecho / actual / pendiente, «Siguiente: N · nombre», los pasos sin punto y los documentos.
- **Guardado:** todo queda en la versión de la plantilla y se publica en SIRIUS_FORMULARIOS (pubDatos) al guardar el borrador y al publicar.
- **Escenas:** actualicé mapacaptura (ahora Vehículos livianos v4 vigente, de solo lectura) y mapacapturaem. Agregué mapaeditar, mapasinubicar, mapaguia (Motos v3 borrador), mapacelular y siluetanueva. KNOWN_ESC pasa a 490 nombres. En el inventario, DEC-190 quedó «Aplicada (C2-15)».

**Verificado:**
- Abrí desde el selector las 7 escenas a 1280 × 720 y 1920 × 1080, sin errores ni desplazamiento horizontal. Pasoseditar, presencial19, pasoguia, autopasosem y formbase también abren sin errores.
- En mapaeditar, el Frente movido (160, 6 · movida) vuelve con «Volver a la sugerida» a 316, 62 · sugerida. Tres flechas ↑ llevan el Lateral izquierdo de 300, 4 a 300, −2. Arrastrar el Posterior lo deja en 42, 68 y «Volver a la sugerida» lo regresa a 4, 62. Al descartar el borrador v5 con motivo, el mapa abre la v4 de solo lectura con el Frente en 316, 62.
- Alt + ↓ sobre Frontal en Presencial cambia ordenP: Lateral izquierdo pasa a 1 y Frontal a 2, igual en el panel «Columna Presencial». Las listas de Virtual guiada y Autoinspección no cambian.
- En mapaguia, el VIN grabado pasado a Silueta y luego a Marco franja vuelve a «Franja · VIN». El Frente con la vista posterior da «Silueta · posterior» y vuelve a «Silueta · frente». El editor del paso muestra el mismo texto.
- La v4 vigente es de solo lectura: arrastrar, mover con flechas y Alt + ↓ no cambian nada, y los botones de la guía y «Volver a la sugerida» tienen aria-disabled con el aviso.
- En mapasinubicar, «Número de motor» está en «Sin ubicar» (1). Con un clic en el dibujo queda en 160, −8, y «Sin ubicar» baja a 0.
- El SVG con 2 formas o con 2 trazos se rechaza con su mensaje. Un polígono se acepta y, con motivo de 10 caracteres o más, queda en la biblioteca.
- Con una conexión de prueba en una copia aparte, guardar el borrador v6 y publicarlo envió SIRIUS_FORMULARIOS con mapaPos (sedán, Frente en 312, 62), ordenV (38), ordenA (15) y guia del Frente {marco: placa} con guide «Placa · frontal». Agregar una silueta envió SIRIUS_SILUETAS con su motivo. sirius-conexion.js sigue con su única línea mínima.

**No verificado:** la conexión real, y que la app del inspector y el portal usen mapaPos, ordenV y ordenA.

**Diferencias:**
- La app del inspector y el portal todavía no leen mapaPos, ordenV, ordenA ni la guia nueva; siguen con su recorrido y leen guide. Por eso la vista previa lo aclara.
- En Formularios, el editor reemplaza la vista anterior del mapa de Autoinspección («Mapa / Interior / Extras / Documentos»). Esa vista sigue en la pestaña Autoinspección.
- Mover un punto, reordenar o cambiar una guía suma un cambio sin guardar cada vez, así que las flechas suman uno por pulsación.
- Los pasos que no tienen sugerida en mapaCaptura toman la de su paso equivalente. Por eso en Vehículos livianos solo «Número de motor» queda sin ubicar en mapasinubicar, y en Motos todos tienen punto.
- mapacapturaem ya abría vacía antes de esta etapa: al recargar los datos se perdía la plantilla de Equipo y maquinaria. Formularios ahora la vuelve a armar con SiriusEquipos.construir().
- «Agregar una silueta a la biblioteca» está en el editor del paso, que solo se edita en un borrador. El ejemplo del diálogo es un lateral, por eso abre con la vista «Lateral izquierdo».

---

## 18/10/2026 · 20:30 — Etapa C2-14

Publiqué la etapa C2-14 (Versión 159): «Informe por completar» ahora se completa en tres pasos y aplica DEC-192, DEC-193 y DEC-194.
- **Pasos:** «1 Controles · N pendientes», «2 Informe · N pendientes» y «3 Criterio y decisión · Pendiente / Listo», con ✓ cuando un paso no tiene pendientes. La pantalla abre en el primer paso con pendientes. Si el caso no tiene controles, empieza en Informe (30006).
- **Cabecera del caso:** en una fila muestra el vehículo y la placa, la modalidad, el plazo en color y el inspector con su agencia. Su menú ⋮ suma «Ver PDF del informe», «Descargar PDF» y «Ver evidencias de campo».
- **Barra fija:** suma los pendientes de los tres pasos con su desglose, y «Ir al primer pendiente» cambia de paso si hace falta.
- **Controles:** es la misma revisión en dos columnas. La foto toma el alto disponible, sin recortarse, y el botón dice «Guardar y siguiente ›»; sin pendientes, «Continuar al informe ›».
- **Informe:** el índice muestra el estado y las fotos de cada sección, y se ve una sección a la vez con «Sección anterior» y «Sección siguiente», o todas seguidas con la casilla. A la derecha aparece «Fotos de esta sección», tomadas de los pasos de la plantilla cuya sección coincide (DEC-194).
- **Valores, Sí/No y Extras:** Valores se muestra en dos columnas (Solicitud | Sugerido) con dos tarjetas, y los campos Sí/No son interruptores. La suma de Extras lee la columna «Valor (USD)», también con la conexión.
- **Criterio y decisión:** a la izquierda, el criterio del inspector y «Lo que revisaste»; a la derecha, la decisión con sus mismas reglas y la tarjeta del PDF. El PDF aprobado se abre en un panel lateral con «Pantalla completa».
- **Escenas:** actualicé infcompletarcaso, ctrllista, ctrltodos, infprimerpendiente y evunificadas, y agregué infpasoinforme, infvalores, infsino, inftestigos, infextras e infdecision. En el inventario, DEC-192, DEC-193 y DEC-194 quedaron como «Aplicadas (C2-14)».

**Verificado:**
- Abrí desde el selector las 11 escenas a 1280 × 720 y 1920 × 1080, sin errores ni desplazamiento horizontal.
- En ctrllista a 1280 × 720 se ven sin desplazarse la foto entera (225 px), la franja y la fila de decisión, por encima de la barra.
- Pendientes y envío iguales a C2-13 en 30004: con 5 pendientes (4 del informe y la decisión) «Completar y enviar» no está disponible; con «Devolver al inspector» y motivo se habilita y devuelve igual. Controles: 1 de 9 revisados, con 1 de severidad alta pendiente.
- En infextras, «Spoiler · 150» da USD 150,00, USD 19.950,00 y +0,8 %; al quitarlo, USD 0,00, USD 19.800,00 y 0,0 %. El valor asegurado de extras no cambia.
- Un interruptor guarda «Sí» o «No», y cambia también con su etiqueta y con Espacio. Marcado obligatorio solo en la prueba, uno sin responder sube Informe de 4 a 5 pendientes.
- El menú ⋮ y la tarjeta abren el mismo documento (6 páginas), y en svpdq el PDF tiene el mismo contenido que en C2-13. Informecompleto, calctrl, svpdq e infcompletarrg no cambiaron.
- Con una conexión de prueba en una copia aparte, revisarControl, revisarControles, guardarInforme y completarInforme salen con las mismas claves y valores que en C2-13. sirius-conexion.js sigue con su contenido mínimo.

**No verificado:** la descarga real del PDF (en la prueba el generador no se carga, sale su aviso) y la conexión real.

**Diferencias:**
- Las pestañas del caso (Resumen, Informe…) siguen arriba. En esta pantalla la cabecera oculta el ciclo y el botón «Completar el informe».
- Los controles pendientes cuentan en la barra pero, como antes, no bloquean el envío.
- Antes el PDF solo se abría con el informe enviado; ahora el Informe de inspección también se abre mientras se completa.
- Agregué «Spoiler» al catálogo de extras.
- «Ir al primer pendiente» enfoca el campo pendiente (Número de motor); en C2-13 caía en Placa.
- La imagen de ejemplo ya no se recorta tampoco en el visor.
- Ramos Generales no cambia.
- La herramienta dejó los cambios en la Versión 158, y la 159 solo corrige este registro con el número real.

---

## 18/10/2026 · 20:30 — Etapa C2-13

Publiqué la etapa C2-13 (Versión 156): con la conexión, Formularios muestra lo publicado en la base y la columna Presencial queda en el orden correcto.
- **Lee lo publicado:** con `SIRIUS_CONEXION.activo` y `window.SIRIUS_FORMULARIOS`, los formularios salen de la base (copia profunda, pasada por `verNorm()`) sin la siembra de versiones; un formulario del prototipo que no venga se agrega al final. Bajo el título de la lista va «Versiones leídas de la base · última publicación: fecha · persona». Sin conexión todo sigue igual.
- **Historial y publicación:** `pubDatos()` agrega `historial` (200 líneas), `publicadoEn` y `publicadoPor`; con `{ ok: true }`, `window.SIRIUS_FORMULARIOS` queda con lo publicado (guardar borrador, publicar, programar, descartar y retirar); con `{ ok: false }` no cambia y se revierte.
- **Evento «sirius-configuracion»:** sin cambios sin guardar ni ventana abierta, Formularios vuelve a leer y conserva la vista, el formulario y la versión; con cambios, avisa «Hay una versión más reciente publicada en la base…» sin perder lo escrito. Se quita al salir.
- **Escena `formbase`:** simula la base con Vehículos livianos v5 «Vigente» (motivo «Prueba de configuración viva») y la v4 «Retirada»; se limpia al cambiar de escena.
- **Orden de Presencial:** un paso marcado entra en `ordenP` justo después del paso Presencial que lo precede en la lista (al inicio si no hay); al desmarcarlo sale; al guardar y publicar `ordenP` queda con exactamente los marcados, y el panel «Columna Presencial · N pasos» muestra ese orden. Vigentes y retiradas no cambian.
- **Inventario:** etapa C2-13, la clave `SIRIUS_FORMULARIOS` y el evento en el contrato `SIRIUS_CONEXION`.

**Verificado:** abrí desde el selector formbase, form, versionesplantilla, pasoseditar, presencial19 y confpublicar a 1280 × 720 y 1920 × 1080, sin errores ni desplazamiento horizontal; form, versionesplantilla y presencial19 se ven igual que en C2-12. En formbase, Vehículos livianos muestra la v5 «Vigente» y la v4 «Retirada», sigue así al ir a Inicio y volver, y al cambiar de escena la simulación se limpia. En pasoseditar, un paso marcado entre «Frontal» y «Posterior» entra justo después de «Frontal» (20 pasos), y al desmarcarlo sale (19). Prueba interna con conexión (copia aparte; `sirius-conexion.js` mínimo): Formularios abre con la v5; publicar la v6 con `{ ok: true }` y salir y volver muestra la v6, con `ordenP` igual a los 20 pasos marcados; con `{ ok: false }` se revierte y `window.SIRIUS_FORMULARIOS` no cambia; el evento con cambios sin guardar muestra el aviso y conserva lo escrito.
**No verificado:** la conexión real de GitHub (lectura de la base y evento reales) y publicar contra una base real.
**Diferencias:** en los datos del prototipo «Frontal» y «Posterior» están juntos en la lista, así que para probar el caso moví «Lateral izquierdo» entre ellos con Alt + ↑ y luego lo marqué. Con la conexión y sin los datos de ejemplo cargados, la lista sale solo de lo publicado. En form a 1920 la captura difiere de la de C2-12 en una columna de 1 px (borde de la ventana). Pediste la Versión 153, pero la herramienta numera por su cuenta: los cambios quedaron en la Versión 155 y esta corrección del registro, que ya dice la versión real, en la 156.

---

## 18/10/2026 · 20:30 — Etapa C2-12

Publiqué la etapa C2-12 (Versión 152): cada versión de plantilla trae su estado, y la app usa solo la «Vigente».
- **Estados:** cada versión guarda su estado («Borrador», «Vigente» o «Retirada», que reemplaza a «Dada de baja»), `vigenteDesde` y `motivo`, con una sola «Vigente» por plantilla. Vehículos livianos queda con la v4 «Vigente», la v5 «Borrador» y de la v1 a la v3 «Retirada»; Motos, con la v2 «Vigente». La app elige por estado, nunca por número, y `SIRIUS_FORMULARIOS` publica todas las versiones con su estado y el contrato.
- **Edición de pasos en el borrador:** se puede cambiar el nombre, el orden, el grupo, la guía y las modalidades; el identificador no cambia.
- **Versiones (N):** muestra el historial con estado y motivo, y las acciones «Publicar versión», «Descartar borrador» y «Retirar versión», todas con motivo. Con la conexión, guardar un borrador sale como «Borrador»; publicar, descartar y retirar se publican y se revierten si la base rechaza el cambio. Escenas nuevas: versionesplantilla y pasoseditar.

**Verificado:** abrí desde el selector versionesplantilla, pasoseditar, presencial19, form y confpublicar a 1280 × 720 y 1920 × 1080, sin errores ni desplazamiento horizontal. Probé Alt + ↓, cambiar el nombre, el grupo y la guía conservando el identificador, publicar la v5 (la v4 pasa a «Retirada»), descartar con motivo obligatorio y programar y luego retirar. Con una conexión de prueba: guardar envía el borrador como «Borrador» con la vigente en la 4, publicar envía la 5 «Vigente», y descartar con `{ ok: false }` se revierte.
**No verificado:** retirar con la conexión y una base real.
**Diferencias:** se mantiene «Programada» mientras espera su fecha. «Retirar versión» solo se activa en versiones sin casos en curso que no sean la única vigente; con los datos actuales aparece no disponible, con su motivo.

---

## 18/10/2026 · 20:30 — Etapa C2-11

Publiqué la etapa C2-11 (Versión 151): la columna Presencial de las plantillas queda con los pasos de la app del inspector, como versión nueva con el motivo «Presencial alineada con la app del inspector (etapa C2-11)».
- **Vehículos livianos v4** (vigente desde el 18/10/2026): Presencial pasa de 39 a los 19 pasos de la app, en su orden, con su guía y su lectura. Hay dos pasos nuevos: «Número de motor» (franja, alimenta `veh_numero_motor`) y «Neumáticos» (1 a 4 fotos). Los otros 22 quedan sin marcar en Presencial y las demás modalidades no cambian. La v3 queda dada de baja y el borrador pasa a ser la v5.
- **Motos v2:** 12 pasos; creé con su guía los 5 que faltaban (laterales, Motor, VIN grabado y Neumáticos). La v1 queda dada de baja.
- **App:** arma el recorrido con la versión vigente y cada visita conserva la suya; los casos en curso siguen en v1 (20202). El inventario documenta la equivalencia app → plantilla (`frente` → `exteriores_frontal`…) y la escena nueva es presencial19.

**Verificado:** abrí desde el selector presencial19, form, inspcaptura, inspcapturamoto, informecompleto y evunificadas a 1280 × 720 y 1920 × 1080: existen en el registro, sin errores nuevos ni desplazamiento horizontal. presencial19 muestra 19 pasos en Presencial; la app, «5/19» y «3/12» con v4 y Motos v2; 20202 sigue en v1. El historial registra «de 39 a 19» con el motivo.
**No verificado:** la publicación en la base con la conexión (no la probé en esta etapa) y la lectura de estas versiones desde la app real.
**Diferencias:** las versiones vienen en los datos; con la conexión llegan a la base la próxima vez que el Administrador guarde en Formularios, porque `SIRIUS_FORMULARIOS` publica todos los formularios con sus versiones. Los pasos sin guía indicada quedan «Libre». En Motos usé los nombres de la app («Frente», «Neumáticos»). Las escenas pasoguia, disenadorllenado y km abren ahora el borrador v5.

---

## 18/10/2026 · 20:30 — Etapa C2-9d

Publiqué la etapa C2-9d (Versión 150): la revisión de controles en dos columnas queda más contenida y el botón final cambia.
- **Evidencia:** la foto o el video miden el 52 % del alto visible, entre 280 y 460 px (416 px a 1280 × 800 y 460 px a 1920 × 1080), con la foto ajustada sin recortar y centrada; zoom y «Pantalla completa» siguen igual. La columna derecha no tiene desplazamiento interno y la decisión queda fija abajo.
- **Menos saturación:** contexto y «Leído frente a Solicitud» van en una sola franja (en dos filas si no caben), separaciones de 14 px y la etiqueta de datos de la foto es de 11 px, semitransparente y se oculta al pasar el mouse.
- **Botón final:** sin controles pendientes, «Siguiente pendiente» se reemplaza por «Continuar a la calificación ›» (en la decisión y en el pie izquierdo): en Calificación va al paso «2 · Calificación del riesgo»; en el Informe, a «Criterio y decisión». Con altas pendientes no aparece.
- **Escenas:** calctrl, ctrllista, ctrlvideo, ctrltodos y calctrlfin actualizadas (calctrlfin muestra el botón con todo revisado).

**Verificado:** abrí desde el selector calctrl, ctrllista, ctrlvideo, ctrltodos, calctrlfin e infcompletarcaso a 1280 × 800 y 1920 × 1080: existen en el registro, sin errores de la página ni desplazamiento horizontal. Medí la altura de la evidencia (416 y 460 px), el texto de la etiqueta (11 px) y que se oculta con el mouse. En ctrltodos, tras «Marcar todos» aparece el botón y lleva a «Criterio y decisión»; en calctrlfin pliega la revisión y deja visible «2 · Calificación del riesgo».
**No verificado:** la revisión que llega por la conexión (`SiriusCxControles`, solo el código) y el aspecto en 1280 × 720.
**Diferencias:** «Ver en el mapa» pasó de la etiqueta de la foto a la franja de contexto, porque la etiqueta se oculta con el mouse; con solo controles no altos pendientes, el pie de Calificación conserva un «Continuar a la calificación ›» secundario (regla de C2-9c); el bloque «Evidencia / Contexto» bajo la foto no cambió, así que la página sigue desplazándose.

---

## 18/10/2026 · 20:30 — Etapa C2-10

Publiqué la etapa C2-10 (Versión 149) y registré DEC-187 en el inventario. Con la conexión, cada versión de configuración que guarda el Administrador se publica en la base con `accion('publicarConfiguracion', { clave, version, datos, motivo })`, con el objeto completo ya cambiado.
- **Pantallas:** Formularios (incluye pasos de foto, campos, autoinspección y portal), Catálogos, Controles, Notificaciones, Flujo y SLA, Honorarios y Tarifas.
- **Resultado:** con `{ ok: true }` aparece el aviso «Publicado: la app y los portales lo verán al volver a abrirse» y el historial anota «Publicada en la base» con la fecha. Con `{ ok: false }` el cambio se revierte y se muestra el mensaje. En el inventario quedó qué clave y qué parte publica cada pantalla. La escena nueva es confpublicar.

**Verificado**
- Abrí desde el selector, a 1280 y 1920 px, confpublicar, form (no existe una escena «formularios»), catalogo, catalogocontroles, notifreglas (en lugar de «notificaciones») y flujoeditor: sin errores ni desplazamiento horizontal. En demostración el texto no cambió.
- Prueba interna con conexión (archivo temporal, ya mínimo): el color (SIRIUS_CATALOGOS_MAESTROS v2), el umbral (SIRIUS_CONTROLES v2) y el paso de foto (SIRIUS_FORMULARIOS v4) enviaron la clave, la versión, el motivo y el objeto completo. Con `{ ok: false }` los tres volvieron atrás.

**No verificado:** Notificaciones, Flujo, Honorarios y Tarifas con la conexión (solo la sintaxis) y una base real.

**Diferencias:** Siluetas, Modelos, Niveles, Garantías y políticas, Motores de IA, Campos y Configuración general todavía no publican. confpublicar simula la base.

---

## 18/10/2026 · 20:30 — Etapa C2-9c

Publiqué la etapa C2-9c (Versión 148) y registré el ajuste en DEC-185. La revisión de controles vuelve a las dos columnas de 12d-3, con el contenido de C2-9 y C2-9b. Aplica en Calificación y en el Informe mientras se completa, con y sin conexión.
- **Izquierda (360 px):** avance «N de M revisados · K de severidad alta pendientes», barra, conteo por severidad, filtros y la lista con el control elegido resaltado. Al pie quedan fijos «Marcar todos como conformes» y «Continuar a calificar», que se habilita cuando no quedan controles de severidad alta pendientes.
- **Derecha:** encabezado con anterior y siguiente, franja de contexto y «Leído frente a Solicitud» con el carácter dudoso. Debajo, la evidencia en grande: foto con zoom y «Pantalla completa» al visor, video con el arco de la vuelta, o lo declarado si no hay evidencia. Abajo y fija, la decisión con comentario y «Siguiente pendiente». Atajos J/K, A y R, que no actúan mientras se escribe.
- **Catálogo:** cada cambio guardado crea una versión nueva con motivo; la anterior queda reemplazada. En calctrlsusc, la foto de 20204-E2 ya está entre las evidencias.

**Verificado**
- Abrí desde el selector, a 1280 y 1920 px, calctrl, calctrltodo, calctrlfin, calctrlsusc, ctrllista, ctrltodos, ctrlvideo, catalogocontroles, infcompletarcaso y conexion: sin errores ni desplazamiento horizontal.
- J, K y A funcionan; R sin comentario pide el comentario y no actúa dentro del campo. «Continuar a calificar» sigue bloqueado con altas pendientes.
- Editar el umbral de «Foto lejos» crea la versión 2, vigente, y deja la 1 reemplazada.
- Prueba con conexión: la individual, la masiva y la reversión con `{ ok: false }` funcionan.

**No verificado:** el PDF y una base real.

**Diferencias:** las decisiones no saltan solas al siguiente control (se usa «Siguiente pendiente»). La evidencia propia de la autoinspección (comparaciones, cronología, mapa) sigue debajo de la foto.

---

## 18/10/2026 · 20:30 — Etapa C2-9b

Publiqué la etapa C2-9b (Versión 147) y registré DEC-188 en el inventario.
- **Catálogo único:** Administración › Controles reúne 25 controles comunes a todas las modalidades (versión 1, vigente desde el 18/10/2026). Muestra severidad, umbral, unidad, «Aplica a» según tu tabla, ramos y activo, y editar pide motivo. Son los 21 que tenía la autoinspección más los 4 nuevos de la presencial. La configuración de la autoinspección ya solo referencia este catálogo.
- **Video:** la fila del control muestra la miniatura con reproducción y «285° de 300° · 0:31 · 8,3 MB»; «Ver video» abre el visor en modo video. Evidencias y el panel del Informe lo muestran como una evidencia más. Con la conexión acepta `{ tipo: 'video', url, grados, duracion, tamano }`, documentado en el contrato.
- **Lista de C2-9:** conserva la alerta con su evidencia, «Revisar todo» unificado con «Marcar todos», el bloqueo de calificar y la solo lectura del Suscriptor.

**Verificado**
- Abrí desde el selector, a 1280 y 1920 px, catalogocontroles, ctrlvideo, ctrllista, ctrltodos, calctrl, calctrltodo, calctrlfin y calctrlsusc, además de autocontroles: sin errores ni desplazamiento horizontal.
- Los conteos por modalidad son Autoinspección 20, Presencial 21 y Virtual guiada 17. calctrltodo abre la confirmación y calctrlfin queda sin pendientes ni bloqueo. «Ir a Administración › Controles» lleva al catálogo.
- En una prueba interna con conexión (archivo temporal, ya mínimo), un control de video muestra «240° de 300° · 0:48 · 7,2 MB» y abre el visor en modo video.

**No verificado:** un video real con archivo y el PDF.

**Diferencias:** «Daños detectados por el sistema» no estaba en tu tabla y lo dejé para todas las modalidades. Al editar el catálogo se registra el cambio en el historial, pero no se crea una versión nueva. En 20186 el video mide 285°, no los 240° del ejemplo.

---

## 18/10/2026 · 20:30 — Etapa C2-9

Publiqué la etapa C2-9 (Versión 144) y registré DEC-185 en el inventario. Los controles se revisan en una lista compacta en Calificación (nivel 1 y Suscriptor) y en el Informe mientras se completa (Control de calidad e inspector), con y sin conexión.
- **Resumen:** arriba se ven Alta, Media y Baja, «N pendientes de M», los filtros (Pendientes por defecto), «Expandir todo», «Contraer todo», «Marcar todos como conformes» y el aviso mientras haya controles de severidad alta pendientes. La regla de bloqueo no cambia.
- **Fila:** muestra el punto de severidad con texto accesible, la miniatura o «Sin foto», el tipo y el detalle, y el estado con el comentario. Al desplegarla aparecen la foto con «Ver en el visor», Conforme o Requiere acción (con comentario obligatorio) y la evidencia propia de cada control de la autoinspección.
- **Marcar todos:** pide un comentario común y, si hay controles de severidad alta, una casilla de confirmación. Deja una línea en el Historial. Con la conexión llama a `revisarControles` y con `{ ok: false }` se revierte.
- **Escenas:** ctrllista y ctrltodos son nuevas; actualicé calctrl y las otras escenas de controles.

**Verificado**
- Abrí desde el selector, a 1280 y 1920 px, ctrllista, ctrltodos, las 10 escenas calctrl, calctrlsusc, calveh, infcompletarcaso, evunificadas y conexion: sin errores ni desplazamiento horizontal. Corregí un desbordamiento a 1920 px.
- En calctrl: Requiere acción sin comentario se detiene; con comentario deja 13 de 14. Marcar todos exige el comentario y la casilla, deja 0 pendientes, quita el bloqueo y escribe la línea del Historial. «Ver en el visor» abre el visor.
- Prueba interna con conexión (archivo temporal, ya mínimo): `revisarControl` y `revisarControles` envían los datos correctos. Con `{ ok: false }` ambos se revierten y muestran el mensaje. La lista también sale en el Informe por completar.

**No verificado:** la revisión con una base real, el PDF y el resto de pantallas.

**Diferencias:** 30004 trae ahora los 9 tipos de control, así que infcompletarcaso y evunificadas muestran la lista. Ya no hay atajos de teclado J/K/A/R. En calctrlsusc (20204-E2) la foto no está entre las evidencias y no ofrece el visor.

---

## 18/10/2026 · 20:30 — Etapa C2-8

Publiqué la etapa C2-8 (Versión 140). Con la conexión, el informe del back-office ahora muestra lo guardado.
- **Lectura:** en todas las etapas, cada campo sale de `informes[id].respuestas` por su clave de plantilla. Si no está, se usa la clave de la app: motor, km, marca, modelo y las demás de la equivalencia. El valor puede llegar como texto o como objeto, y se muestra con su origen y su confianza. Lo guardado en el back-office tiene prioridad sobre lo de la app.
- **Guardar:** «Guardar borrador» y «Completar y enviar» envían los 96 campos con su clave, origen y confianza. Con `{ ok: true }` la pantalla vuelve a leer la conexión sin perder lo escrito.
- **Evidencias:** la columna derecha es siempre el panel unificado, plegable y con las fotos reales. Las fotos que llegan sin archivo se marcan «Prueba».
- **Sin la tabla:** se quitó «Informe enviado desde la app». En su lugar, el Historial muestra «Informe de campo recibido de la app» con quién y cuándo. El encabezado indica la plantilla y su versión; si la conexión no la trae, la vigente.

**Verificado**
- Prueba interna con un archivo temporal (no publicado), en un caso en calificación: motor (lectura, 93 %), km (campo), marca (solicitud), modelo (corregido en campo, junto al valor de la solicitud), valor comercial y persona que atiende (sistema) aparecen en su campo. No aparece la tabla y el panel muestra 1 foto real y 1 de prueba.
- Guardé, recargué la página y se ve lo mismo: 10 de 67 campos · 26 obligatorios pendientes, con «Editado» en lo que cambié. sirius-conexion.js volvió a su contenido mínimo.
- Abrí desde el selector, a 1280 y 1920 px, informecompleto, informeautomaticos, informeprecargados, infcompletarcaso, evunificadas, calveh y conexion: sin errores ni desplazamiento horizontal, y su texto no cambió.

**No verificado:** «Completar y enviar» con recarga contra una base real (solo probé el guardado) y el PDF.

**Diferencias:** sin conexión, la demostración mantiene su lista de pasos de foto. infcompletarcx ahora muestra el avance (4 de 67 campos) en lugar de «—».

---

## 18/10/2026 · 20:30 — Etapa C2-7b

Publiqué la etapa C2-7b (Versión 139) y amplié DEC-186 en el inventario.
- **Diseñador:** los campos de catálogo tienen dos atributos nuevos, «Catálogo de origen» y «Depende de». Se editan en el panel del campo y entran en la comparación de versiones. Vehículos livianos v3 (vigente desde el 18/10/2026) los configura así: Marca → Marcas; Modelo → Modelos, que depende de Marca; Color → Colores, un catálogo maestro nuevo con 15 colores; Tipo de licencia → Categorías de licencia. La v2 queda dada de baja y el borrador pasa a ser la v4.
- **Informe y app:** el campo dependiente solo ofrece las opciones de su padre y se limpia cuando el padre cambia, también al corregir la marca. Un valor que no está en el catálogo queda «Por confirmar». Quité el vínculo que estaba programado en datos-ejemplo.js; las listas no cambian.

**Verificado**
- Abrí desde el selector, a 1280 y 1920 px, disenadorllenado, inspinfoclave, catalogodependiente, informeprecargados y catalogo (Catálogos): sin errores ni desplazamiento horizontal.
- En el informe, cambié la marca de Chevrolet a Kia: el modelo se limpió y quedaron 4 opciones. En la app, de Toyota a Hyundai: el modelo se limpió y quedaron 3. En 20152, el modelo «Rio» que viene de la solicitud queda «Por confirmar».

**No verificado:** la alerta «Por confirmar» en el informe del back-office, el PDF y la conexión real.

**Diferencias:** la plantilla no tiene un campo Versión; las versiones siguen dentro de Modelo. El catálogo de licencias se llama «Categorías de licencia». Cuando hay 3 modelos o menos, la app los muestra como botones.

---

## 18/10/2026 · 20:30 — Etapa C2-7

Publiqué la etapa C2-7 (Versión 138) y registré DEC-186 en el inventario.
- **Diseñador:** cada campo tiene «Cómo se llena», «Dónde se captura» y «Obligatorio para», editables y dentro de la comparación de versiones. Vehículos livianos v2 trae los 96 campos configurados; la lista está en el inventario.
- **Informe:** los automáticos salen llenos, con origen «Sistema» y sin edición. Los precargados dicen «Solicitud», o «Corregido en campo» junto al valor de la solicitud. Las lecturas muestran su confianza y quedan «por confirmar» bajo el umbral. Los catálogos se editan con su lista.
- **Por completar:** lo muestra toda sección con un obligatorio pendiente, incluidas Verificaciones externas y Neumáticos. El índice y la barra cuentan igual.
- **App:** «Información clave» muestra lo que la plantilla marca en Campo. Los catálogos salen como lista, los precargados con «Confirmar» o «Corregir» y las lecturas con «Confirmar lectura» o «Corregir». Los obligatorios para terminar cuentan como pendientes.
- **Contrato:** los casos llevan `solicitud` y `visita`.

**Verificado**
- Abrí estas escenas desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal: disenadorllenado, informeautomaticos, informeprecargados, inspinfoclave, informecompleto, infcompletarcaso, inspterminarpend, form, conexion, evunificadas y calveh. No hay escena «formularios»; revisé form.
- Cifras: el caso 30004 pasa de 3 a 5 pendientes para enviar. inspterminarpend sigue con 3 (Motor, Kilometraje y confirmar VIN). El VIN al 84 % queda por confirmar porque el umbral es 90 %.

**No verificado:** el PDF, la conexión real y el resto de pantallas.

**Diferencias**
- La v1 queda dada de baja, la v2 vigente desde 18/10/2026 y el borrador anterior pasa a v3. Los casos de ejemplo siguen mostrando «v1», pero aplican el llenado de la v2.
- Los campos de cálculo son «Automático» con fuente «Cálculo de la plantilla». Los pasos «VIN grabado» y «Número de motor» se nombran tal como los indicaste.
- Información clave suma accesorios y la relación con el asegurado. El PDF no cambió.

---

## 18/10/2026 · 20:30 — Etapa C2-6

Publiqué la etapa C2-6 (Versión 137). Registré DEC-184 en el registro de decisiones del inventario.
- **Una sola fuente de evidencias:** el caso tiene un único conjunto de evidencias, para Vehículos y para Ramos Generales (en RG, el paso es el grupo de insumos y la sección es el módulo). Cada evidencia lleva sección, canal, hora, dispositivo, ubicación con precisión, distancia a la dirección, validación, lecturas, estado, daños y observación. Con la conexión sale de `SIRIUS_CONEXION.evidencias`; los campos nuevos están en el contrato.
- **Tres entradas, mismas evidencias:** el panel «Evidencias de campo» muestra miniaturas por sección y cada sección del formulario tiene «N fotos de esta sección». Informe › Fotos suma el filtro «Con control» y un punto de aviso. La pestaña Evidencias agrupa por canal, con filtro, y se retiró su visor pequeño.
- **Un solo visor:** lo usan las tres entradas, «Ampliar foto» de los controles y «Ver foto» de la conexión. Tiene zoom de 50 % a 500 %, rueda, arrastre, «Rotar», teclado, «N de M», tira y panel con Estado, Metadatos, Ubicación con mapa, Daños y Observación. Cada cambio queda en el Historial y llama a `accion('evidencia')`; si responde `{ ok: false }`, se revierte.

**Verificado**
- Existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal:
  - Nuevas: evunificadas, visorzoom, evrg y evidencias.
  - Actualizadas: infcompletarcaso e infrgev.
  - Revisadas: calveh, calctrl, infcompletarcx, conexion y vfgal.
- 30004 tiene 39 evidencias en el panel, en Fotos («Todas (39)»), en la pestaña y en el visor («1 de 39»). La foto Frontal está a 22 m de la dirección.
- Una foto excluida en el visor sale igual en la pestaña. En una copia aparte, con la conexión, el estado vuelve atrás con el aviso «se activa después».

**No verificado**: el resto de las pantallas y la conexión real.

**Diferencias**
- La escena «evidencias» no existía; la creé.
- La pestaña Evidencias ya no repite la galería por vehículo.
- Las imágenes son de ejemplo.
- En 20195 aparece además el canal «Contexto externo», que viene en los datos.
- Con la conexión, el Control de calidad entra en Inicio y debe tocar «Informes por completar».

---

## 18/10/2026 · 20:30 — Etapa C2-5

Publiqué la etapa C2-5 (Versión 136). No cambié ninguna regla aprobada.
- **Enlaces:** la vista previa siempre muestra el texto completo y el enlace, con «Copiar enlace». El envío del autoagendamiento pide «Canal del mensaje»: por defecto WhatsApp si hay celular y consentimiento, y sin correo no se ofrece correo. Sin ningún canal posible, se bloquea con «Falta un dato de contacto del cliente». Con la conexión, se muestra el enlace que devuelve `accion('enviarEnlace')`.
- **Conexión:** «Informes por completar» usa `SIRIUS_CONEXION.casos` con `inspector { nombre, tipo, agencia }` y `vence`, ya documentados en el contrato. El Control de calidad ve los casos de su agencia aunque el nombre llegue con mayúsculas o con «S.A.».
- **Administrador:** coordina y completa con las opciones del Control de calidad. En la matriz pasa a Aprobar en Liquidar honorarios y en Aprobar cambios de cuenta bancaria.
- **App:** «Mis inspecciones» agrupa las visitas en Atrasadas, Hoy, Mañana y la fecha completa, con un mapa por grupo. «Terminar la visita» bloqueado dice cuántos pendientes hay y cuáles, con «Ir al siguiente pendiente».

**Verificado**
- Existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal:
  - Nuevas: enlacesincorreo, infcompletarcx, inspmisinspecciones e inspterminarpend.
  - Revisadas: enlaceagenda, enlaceagendamodalidad, infcompletar, inspterminar, insphoy y conexion.
- infcompletarcx: Patricia ve 40101 y 40102 («usado 90 %» y «usado 42 %») y 40103 en Devueltos. No ve el caso de otra agencia ni el del independiente.
- inspterminarpend: muestra «3 pendientes»; «Ir al siguiente pendiente» enfoca Motor y luego Kilometraje.
- Como Administrador probé «Coordinar inspección» y confirmar, cambiar o devolver.

**No verificado**: el resto de las pantallas, la conexión real, el enlace devuelto por una conexión y el dictamen final del Administrador.

**Diferencias**
- El autoagendamiento sale por defecto solo por WhatsApp (antes, WhatsApp y SMS); se puede agregar SMS.
- El Administrador completa siempre con las opciones del Control de calidad, también en casos de inspectores internos o independientes.
- infcompletarcx usa una conexión de prueba solo en memoria; al recargar vuelve la demostración.
- La lista de pendientes muestra hasta 4 y luego «y N más».

---

## 18/10/2026 · 20:30 — Etapa C2-4

Publiqué la etapa C2-4 (Versión 133). En la app del inspector ya nadie determina en campo.
- **Terminar la visita (todos):** después de fotos y documentos, «Información clave» muestra solo los campos de campo con su origen (Campo, Lectura, Solicitud), y «Tu criterio de asegurabilidad» pide comentario si es No asegurable. «Terminar la visita» se habilita sin obligatorios pendientes y pasa el caso a «Informe por completar» (T23, 24 h hábiles); sin señal, va por la cola.
- **Internos e independientes:** eligen «Completar el informe ahora» o «Completarlo después». En la app, el informe completo tiene índice desplegable con estados, «Criterio y decisión» al final, evidencias en una hoja y barra fija; envía con T24 o T25. Ramos Generales se redacta en el back-office.
- **Agencia:** solo termina la visita y luego ve «Lo completa el Control de calidad de Eurosurvey»; no hay determinación en la app.
- **Visitas:** «Informes por completar» con el plazo en color y «Completar»; «Devueltos» con el motivo y «Reenviar corregido» (T27, el plazo se reinicia). La facultad sigue en «Yo».

**Verificado**
- Las nuevas inspterminar, inspterminarind, inspcompletarapp, inspdevuelto e inspporcompletar, las actualizadas inspform, inspfaltan, inspdeterminar e inspsinfacultad, y las revisadas insphoy, inspmapa, inspcamveh, inspcola, inspsync, inspcaptura, infcompletar e inspbo existen en el registro de escenas. Las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal.
- Cálculos: 20152, terminada a las 09:10 y vista a las 10:30, muestra «usado 6 %» (80 de 1.440 min hábiles). Con 215.400 km, la regla «Kilometraje alto» lleva a calificación. Al llenar el valor sugerido, el único pendiente, 20152 pasa a Inspeccionado · Asegurable.

**No verificado**: el resto de las pantallas, la conexión real y `completarInforme` desde la app con la conexión activa.

**Diferencias**: la marca de información clave vive en los datos de la app, porque la plantilla no la tiene. 20152 nace en la v2 de Vehículos. inspdeterminar e inspsinfacultad ahora completan el informe en la app (Luis Andrade). «Enviada» pasa a «Terminada». La app usa su reloj (20/10) y el back-office el suyo (18/10 20:30). «Complétalo en el back-office», para agencias que lo permiten, no tiene escena propia.

---

## 18/10/2026 · 20:30 — Etapa C2-3b

Publiqué la etapa C2-3b (Versión 132). Solo cambia la disposición; las reglas de C2-3 se mantienen.
- **Completar (Vehículos):** a la izquierda está el índice de secciones, con «Criterio y decisión» al final, resaltada mientras está pendiente. Al centro van todas las secciones y, al final, «Criterio y decisión»: criterio en campo, opciones según el rol y observaciones para el calificador. A la derecha, las evidencias plegables por grupo, con documentos y controles. Abajo, una barra fija con avance, pendientes, «Ir al siguiente pendiente», «Guardar borrador» y la acción principal, que se habilita sin pendientes.
- **Desde la bandeja:** «Completar» abre el informe en el primer pendiente, con el aviso «Te llevamos al primer pendiente».
- **Ramos Generales:** usa la misma disposición, con módulos «Redactado» o «Por redactar», los insumos vinculados por módulo e «Insumos de campo» plegable. «Cargar insumos» llama a `accion('cargarInsumo')`.

**Verificado**
- infcompletarcaso, infcompletarcambiar, infdevuelto, infcompletarind, infcompletarrg, la nueva infprimerpendiente, y además infcompletar, informecompleto, infrgev, calveh y conexion: existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal. Las cinco que revisé además no cambian frente a la Versión 131.
- En 30004 la barra dice «3 pendientes para enviar» (2 obligatorios y la decisión) e «Ir al siguiente pendiente» lleva a Motor. En una copia aparte con la conexión, si la carga de insumos responde «se activa después», se deshace y aparece ese aviso. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: el resto de las pantallas y la conexión real con la base.

**Diferencias**: la decisión ya no viene marcada; cuenta como pendiente hasta que se elige. La sección «Asegurabilidad» de la plantilla no aparece en esta disposición, porque la reemplaza «Criterio y decisión». Los insumos cargados se ven en el panel y en el Historial, pero todavía no en la galería de Fotos. El índice de Vehículos usa los íconos de estado que ya tenía, no puntos.

---

## 18/10/2026 · 20:30 — Etapa C2-3

Publiqué la etapa C2-3 (Versión 131). DEC-180 quedó registrada en el registro de decisiones del inventario.
- **Flujo:** nuevo estado «Informe por completar» entre «En curso» y la determinación o la calificación (Vehículos presencial y virtual guiada; Ramos Generales presencial). Plazo de 24 h hábiles desde el fin de la visita, alerta al 80 % y, al vencer, tarea al Coordinador en su Inicio. El motor publica la v2 de los tres flujos con T23 a T27; los casos activos siguen en la v1.
- **Quién completa:** el inspector interno o independiente, que determina con su facultad. En las agencias completa su Control de calidad, que confirma el criterio, lo cambia (con motivo; va a calificación con los dos criterios) o lo devuelve (con motivo; al reenviar, el plazo se reinicia). «Completar y enviar» se habilita sin obligatorios pendientes, «Guardar borrador» lo deja «Por completar» y todo queda en el Historial.
- **Rol «Control de calidad (agencia)»:** está en Roles y permisos, con Patricia Andrade (Eurosurvey) y la bandeja «Informes por completar» (tres pestañas, por plazo). La ficha de la agencia tiene «Operación» con «Sus inspectores completan su propio informe», con motivo e historial. Los inspectores ven un menú reducido: Mis casos, Informes por completar, Agenda y Honorarios.
- **Informe y conexión:** a la derecha están el criterio en campo, las evidencias con sus controles, la decisión según el rol y el plazo; en Ramos Generales se redacta el informe RG. La conexión suma `guardarInforme`, `completarInforme`, el rol con su agencia y `criterioInspector`.

**Verificado**
- Las 8 escenas nuevas y informecompleto, calveh, calctrl, coord, flujoeditor, roles, monitor, infrgev, conexion y bandejaexp: existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal.
- Plazos calculados: 30004 lleva el 23 %, 30005 el 81 % (en alerta), 30006 el 8 % y 30007 venció hace 2 h 30 min. 30004 tiene 2 obligatorios pendientes y «Completar y enviar» queda deshabilitado con el motivo.
- En una copia aparte con la conexión, las dos acciones salieron con su forma y, con `ok: false`, volvieron el estado, el plazo y la decisión. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: el resto de las pantallas y la conexión real con la base.

**Diferencias**: no existe la inspectora independiente «Gabriela Suárez»; usé a Luis Andrade, con una facultad nueva (Asegurable y No asegurable) para que pueda determinar. Ramos Generales no tiene facultad del inspector, así que esa determinación va a calificación. Cambié los modelos de la maqueta que no están en el catálogo (por ejemplo, RAV4 por Seltos). El Monitor y la Bandeja suman los 6 casos de ejemplo nuevos.

---

## 18/10/2026 · 20:30 — Etapa C2-2

Publiqué la etapa C2-2 (Versión 130). DEC-179 y DEC-182 quedaron registradas en el registro de decisiones del inventario, junto con el ajuste de DEC-178.
- **Informe completo (DEC-179):** en Vehículos, el Informe muestra todas las secciones y campos de la plantilla, incluidos los de valoración. Cada campo dice de dónde viene («Campo», «Solicitud», «Lectura · N %» con «Por confirmar» bajo 90 %, o «Por completar»), y los obligatorios sin dato aparecen como «Obligatorio pendiente».
- El encabezado muestra la plantilla y su versión, «N de M campos · K obligatorios pendientes», la leyenda de orígenes y el estado (Datos de campo / Por completar / Completo). Con la conexión, los valores salen de las respuestas de la app y de la solicitud. Ramos Generales sigue con InformeRG.
- **Enlace de autoagendamiento:** el botón está disponible siempre en Presencial y Virtual guiada. El Coordinador elige la modalidad; el mensaje la menciona y el portal ofrece los horarios y la duración de esa modalidad (la videollamada dura 30 min). Con la conexión, la modalidad elegida sale en `enviarEnlace`.
- **Recordatorios por tipo:** R13 a R15 son de autoinspección y R20 a R22 de autoagendamiento («Agenda tu inspección»). Notificaciones indica en el nombre de cada regla a qué tipo aplica.
- **Solo presencial en Ramos Generales y Equipo y maquinaria (DEC-182):** no se ofrecen Virtual guiada ni Autoinspección, ni en Coordinación ni en el enlace, y aparece la nota pedida.

**Verificado**
- Las escenas nuevas informecompleto, enlaceagendamodalidad y recordatoriostipo, y además form, infrgev, vfsec, calveh, enlaceagenda, enlacetipos, coord, conexion, notifreglas y enlacerecordatorios: existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal.
- En informecompleto aparecen 40 de 67 campos y 2 obligatorios pendientes (motor y kilometraje). En recordatoriostipo, la tarjeta del enlace muestra R20 enviado y R22 programado.
- En una prueba con la conexión en una copia aparte, el caso de Robo solo ofreció Presencial y el enlace salió con la modalidad elegida. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: la conexión real con la base.

**Diferencias**: las escenas «formularios» e «informe» no existen; en su lugar revisé form (Formularios), vfsec (Informe de Vehículos) e infrgev (Ramos Generales, sin cambios). La plantilla no tenía «valor comercial de referencia» ni «fuente del valor»: los agregué a la sección Valores. En lugar de cambiar R13 a R15, creé R20 a R22.

---

## 18/10/2026 · 20:30 — Etapa C2-1

Publiqué la etapa C2-1 (Versión 129). DEC-178 quedó registrada en el registro de decisiones del inventario.
- **Enlace de autoagendamiento (nuevo):** botón «Enviar enlace de autoagendamiento» en Coordinación › Intentos de contacto. Solo funciona en Presencial o Virtual guiada y desde el primer intento; si no aplica, aparece deshabilitado con el motivo. Abre la vista previa con el texto de la regla nueva por WhatsApp, SMS o correo según los consentimientos, con «Copiar enlace». El cliente ve el portal del caso (estado, Agenda y Documentos) sin la captura de fotos.
- **Enlace de autoinspección:** sale solo desde la modalidad Autoinspección y abre la autoinspección; su texto y su línea de tiempo dicen «autoinspección».
- **Tipo de enlace:** el caso guarda el tipo de cada enlace, y la tarjeta («Estado del enlace de …»), la línea de tiempo, la cronología y el Historial lo muestran. Un enlace nuevo invalida solo el anterior del mismo tipo. Reenviar, ampliar, revocar y los recordatorios aplican a los dos.
- **Notificaciones y conexión:** regla nueva «Enlace de autoagendamiento» con sus canales y su plantilla. `enviarEnlace` ahora lleva `tipo`.

**Verificado**
- Las escenas nuevas enlaceagenda, enlacetipos y portalporagenda, y además coord, envioenlace, enlaceciclo, portalestado, portalagenda y conexion: existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal.
- En coord, envioenlace, enlaceciclo, portalestado y portalagenda, frente a la Versión 128, solo se agregan el botón y el tipo en «Estado del enlace de autoinspección». En envioenlace (Autoinspección) el botón explica por qué no aplica.
- En enlaceagenda, revocar el enlace dejó la tarjeta en «Revocado» con su cronología. En notifreglas aparece la regla R19.
- En una prueba con la conexión en una copia aparte, los dos envíos salieron con su `tipo` y su enlace real. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: la conexión real con la base.

**Diferencias**: pediste la regla como R16, pero R16 ya es «Enlace caducado sin completar»; la regla nueva quedó como R19. Los recordatorios del enlace de autoagendamiento usan las mismas reglas R13 a R15, así que R15 dice «Autoinspección sin completar».

---

## 18/10/2026 · 20:30 — Etapa P-6d

Publiqué la etapa P-6d (Versión 128). DEC-177 quedó registrada en el registro de decisiones del inventario, y DEC-176 aparece como reemplazada.
- Barra de la aplicación: una sola franja de 48 px con la ruta, la campana, la etiqueta de conexión y el usuario con su rol en una línea.
- Cabecera compacta de una línea: ← · «Caso N» · estado · SLA · ramo · asegurado · placa · responsable · ciclo en miniatura con la etapa y «N/M» · acción · ⋮ · expandir. Los textos que no caben se recortan con puntos suspensivos y el texto completo queda en title y para los lectores de pantalla.
- La cabecera solo aparece expandida al entrar desde la Bandeja en Resumen; en las demás pestañas es compacta. El chevron (con aria-expanded) mantiene lo elegido mientras sigas en la pestaña, y la transición respeta prefers-reduced-motion.
- Las pestañas quedan fijas al desplazarse. La altura fija sobre el contenido baja de 319–370 px a 146 px con la cabecera compacta (≈ 224 px más en calveh, coord y vfevid).
- Revisión de controles: muestra cualquier tipo de control con su detalle legible (foto del paso, metros, «Leída PBC9999 · Solicitud PRB2204», informe frente a la solicitud, año, validación, falta de GPS y motivo). Si el control trae evidencia, «Ver foto» la abre en el visor.

**Verificado**
- cpersdet (Resumen), calctrl, calveh, coord, vfevid, conexion y bandejaexp: existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px. No hay errores ni desplazamiento horizontal; con la cabecera compacta, las pestañas terminan a 146 px.
- Prueba interna en una copia aparte, como Ejecutivo de inspecciones, Coordinador y Suscriptor: la cabecera aparece expandida en Resumen y compacta en las otras 5 pestañas. Los 9 tipos de control se leen completos y «Ver foto» abre el visor. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: prefers-reduced-motion activado (no lo probé en un navegador con esa preferencia) y la conexión real.

**Diferencias**: la escena «evidencias» no existe; en su lugar revisé vfevid. La barra de 48 px cambia todas las pantallas, no solo el detalle del caso. Las escenas que abren un caso en Resumen se tratan como si se entrara desde la Bandeja.

---

## 18/10/2026 · 20:30 — Etapa P-6c2

Publiqué la etapa P-6c2 (Versión 127). Con la conexión, al enviar el enlace primero se llama a `accion('enviarEnlace')`, y la vista previa se abre con la respuesta.
- Con `{ ok: true, enlace }`, la vista previa, «Copiar enlace», la tarjeta y la línea de tiempo del enlace, la visita y la cronología del caso muestran el enlace real. Sin enlace se muestra «Enlace generado en la base (sin dirección)»; con `{ ok: false }` el caso no se marca como enviado y aparece el mensaje.
- «Copiar enlace» está dentro de la vista previa. En demostración se sigue usando el enlace simulado clientes.asur.ec.

**Verificado**
- enlaceciclo, envioenlace y conexion están en el registro de escenas; las abrí desde el selector a 1280 y 1920 px. No hay errores y el texto es igual al de la Versión 126. En envioenlace la vista previa sigue mostrando clientes.asur.ec/a/….
- Prueba interna en una copia aparte: la vista previa y lo copiado mostraron https://ejemplo.test/?t=ABC, también al reenviar. Probé los casos sin enlace y con `{ ok: false }`. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: la conexión real con la base.

**Diferencias**: el portal del prototipo no abre el enlace real (es externo), así que «Abrir el portal del cliente» sigue usando el enlace simulado interno.

---

## 18/10/2026 · 20:30 — Etapa P-6c

Publiqué la etapa P-6c (Versión 126). DEC-176 quedó registrada en el registro de decisiones del inventario, y en el contrato se agregó la forma de las acciones.
- DEC-176: la barra del ciclo tiene un botón con chevron y `aria-expanded`. Está expandida en Resumen y se contrae al cambiar de pestaña; lo que elige el usuario se mantiene mientras siga en esa pestaña. Contraída muestra «Ciclo de inspección», la etapa actual, «Etapa N de M» y el estado del caso.
- Calificación con la conexión: el informe de la app (cada campo con valor, origen y confianza; estado general; extras; daños; determinación) aparece en «Resumen del informe del inspector» y en «Motivo del inspector». «Evidencias del informe» cuenta las fotos y las abre en el visor.
- Con controles de severidad alta pendientes no se puede calificar. La lista de Calificación muestra los casos de la conexión.
- Acciones: salen con la forma exacta del punto 3. Con `{ ok: false }` se revierte el cambio y se muestra el mensaje; si la respuesta trae enlace, el aviso ofrece «Copiar enlace».

**Verificado**
- cpersdet (Resumen), calctrl, calveh, coord, bandejaexp y conexion: existen en el registro de escenas y las abrí desde el selector a 1280 y 1920 px. No hay errores ni desplazamiento horizontal, y el texto es igual al de la Versión 125 salvo la franja del ciclo.
- Prueba interna en una copia aparte, con los tres roles: el Ejecutivo de inspecciones encontró el bloqueo, revisó el control como «Conforme» y calificó P-0002; el Suscriptor dio el dictamen de P-0003; el Coordinador registró un intento, agendó una visita presencial, envió el enlace de autoinspección y vio los controles en solo lectura.
- En esa prueba, las cinco acciones salieron con la forma exacta, la barra se comportó según DEC-176 y, con `{ ok: false }`, la revisión y la calificación se revirtieron. `sirius-conexion.js` volvió a su contenido mínimo.

**No verificado**: la conexión real con la base. «Copiar enlace» no se puede usar mientras la vista previa del mensaje sigue abierta, porque la ventana tapa el aviso.

**Diferencias**: en Vehículos el Suscriptor no tiene dictamen (el flujo pasa directo a Inspeccionado), así que el dictamen se probó en P-0003 (Robo). Reagendar, cambiar el inspector, dividir, ampliar o revocar el enlace y cancelar todavía no se envían a la conexión, porque el contrato no los define.

---

## 18/10/2026 · 20:30 — Etapa P-6b

Etapa P-6b publicada (Versión 125). Con la conexión activa, el caso muestra las evidencias, los controles y el informe que llegan de la base; en demostración nada visible cambia. El contrato (`evidencias`, `controles` e `informes`) quedó documentado en el inventario.
- Evidencias: la galería sale de `evidencias[id]`, agrupada por canal y en el orden de los pasos de la plantilla presencial o de la autoinspección. Las etiquetas salen de la plantilla o, si no, de la tabla pedida.
- Cada miniatura muestra la foto o «Imagen de prueba». El visor muestra paso, canal, hora, GPS con «Ver en el mapa», la validación y las lecturas del paso.
- Calificación › «Revisión de controles»: cada control va con su evidencia, «Conforme» / «Requiere acción» y comentario (obligatorio si requiere acción). Guardar llama a `accion('revisarControl')`, y la llegada fuera del radio muestra la distancia y el motivo.
- Informe: los campos se ven con su valor, origen («Foto «Frente»», «Inspector», «Solicitud») y confianza. También el estado general, los extras, los daños, las observaciones, la determinación, quién lo envió y cuándo. Sin informe, el estado vacío actual.

**Verificado** (conexion, calctrl y calveh abiertas desde el selector a 1280 y 1920 px, sin errores ni desplazamiento horizontal, con el mismo texto que la Versión 124)
- Prueba interna (copia aparte) como Ejecutivo de inspecciones y como Coordinador: 3 fotos y 2 de prueba en su orden, el visor completo, el control a 420 m con su foto y el informe completo, sin errores. El Coordinador solo puede leer los controles.
- Al guardar sin comentario aparece el aviso; con comentario se llama a `revisarControl` y se muestra la respuesta de P-6c. `sirius-conexion.js` siguió con su contenido mínimo.

**No verificado**: la conexión real con fotos de la base.

**Diferencias**: las escenas «evidencias» e «informe» no existen en el registro; en su lugar revisé vfevid y doccampos, iguales a antes. Corregí un error de P-6a (versiones 123 y 124): «Conforme» y «Requiere acción» de los controles de la autoinspección no se registraban. Con la conexión, el bloque «Evidencias del informe» de la calificación todavía cuenta 0 fotos.

---

## 18/10/2026 · 20:30 — Etapa P-6a2

Etapa P-6a2 publicada (Versión 124). Con la conexión activa, ninguna pantalla falla por un caso que no está en la base, y en demostración todo queda igual.
- Cualquier apertura de un caso por número (detalle, «Garantías del caso», campana, vista rápida, Inicio, Agenda, Monitor, Calificación y Garantías) comprueba que exista. Si no existe, no abre ni navega y avisa «El caso N no está en la base de la prueba».
- Notificaciones y garantías salen solo de la conexión; se agregaron al contrato `notificaciones` y `garantias`, ambas opcionales. Sin ellas se ve «Sin notificaciones» o «Sin garantías en seguimiento».
- Agenda, Liquidaciones, Monitor e Inicio muestran arriba «Datos de demostración: este módulo se conecta en una etapa siguiente».
- Si la conexión se activa después de cargar, se quitan las semillas de demostración y se cierran los paneles; esa era la causa probable del error con «Garantías del caso».

**Verificado** (`conexion`, garpanel, notif, bandejaexp, monitor y calctrl abiertas desde el selector a 1280 y 1920 px: sin errores ni desplazamiento horizontal y con el mismo texto que antes, igual que gar, agendasemana, liquidaciones y la página sin escena)
- Prueba interna con Coordinador, Administrador y Ejecutivo de inspecciones (2 casos, más notificaciones y garantías hacia 20137 y 20178): campana, Garantías y su panel, vista rápida, Agenda, Liquidaciones, Monitor, Calificación e Inicio sin ningún error; los enlaces a 20137 y 19272 mostraron el aviso.
- Activación tardía con el panel de 20137 abierto: se cerró sin error. `sirius-conexion.js` sigue con su contenido mínimo, porque la prueba usó una copia aparte.

**No verificado**: la conexión real de la copia publicada.

**Diferencias**: el panel de garantías se abre desde su lista (no hay acceso desde la vista rápida de la Bandeja). Las notificaciones de la conexión sin `aud` llegan a cualquier rol.

---

## 18/10/2026 · 20:30 — Etapa P-6a

Etapa P-6a publicada (Versión 123). El back-office queda listo para la prueba de concepto con base de datos. El artifact no se conecta a nada y en modo demostración se ve igual que antes.
- `sirius-conexion.js` solo define `SIRIUS_CONEXION = { activo: false }` y se carga en el `<head>` antes de `support.js`. Está registrado en el inventario con el contrato completo.
- Con `activo` en true, los casos, detalles, eventos y usuario salen solo de la conexión, sin los de la pantalla, `SIRIUS_EJEMPLO` ni semillas. Desaparecen el bloque «Demostración», las escenas y `?demo`.
- El rol solo se cambia entre `usuario.roles`, «Cerrar sesión» llama a `cerrarSesion()` y la cabecera dice «Prueba conectada». Se muestra el cargador mientras `listo` no termina.
- `suscribir` vuelve a dibujar sin perder la pestaña ni los filtros. `accion()` ya se llama al registrar un intento de contacto, enviar un enlace, agendar una visita, revisar un control y calificar.

**Verificado** (`conexion` está en `KNOWN_ESC` (437) y `datos-escenas.js`; la abrí desde el selector junto con bandejaexp, coord, calctrl, monitor e inicioadm, a 1280 y 1920 px: sin errores ni desplazamiento horizontal; todas salvo `conexion` iguales al texto anterior)
- Sin escena, la página y el menú del usuario quedan idénticos a la versión anterior.
- Prueba interna (Coordinador y 2 casos): la Bandeja mostró solo P-0001 y P-0002, y P-0002 sin detalle abrió sus 6 pestañas sin errores. `suscribir` actualizó el Historial, y luego volví al contenido mínimo.

**No verificado**: la conexión real, que solo existe en la copia publicada.

**Diferencias**: con la conexión, el responsable es el que informa la base. Monitor, Liquidaciones, Garantías, la app del inspector y el portal siguen con sus datos de ejemplo (fases siguientes). Evidencias sin datos muestra su estado vacío actual.

---

## 18/10/2026 · 20:30 — Etapa 15-4

Etapa 15-4 publicada (Versión 122). Los honorarios dependen del tipo de inspector, la agencia tiene su tarifa a sus inspectores y hay cuentas bancarias (DEC-174). Se lee `honorarios` de `SIRIUS_APP_INSPECTOR` v1.2; lo nuevo va en `datos-tarifas-cuentas.js` y `sirius-tarifas-cuentas.js`.
- Ficha de la agencia en Usuarios y roles › Agencias: «Tarifas a sus inspectores» por grupo de ramo (fija en Vehículos; por visita u hora en los demás), general o propia, con vigencia, motivo e historial. Eurosurvey paga USD 9,00 a Mauricio Endara. La edita Finanzas de agencia (y el Administrador); Coordinador y Finanzas, solo lectura.
- App: en la oferta, el de agencia ve «Tarifa de tu agencia» y el independiente «Tarifa de la aseguradora». «Yo»: de agencia, visitas y acumulado con la aclaración pedida; independiente, por aprobar, aprobados y pagados (simulado) con detalle por visita y cuenta ···4521.
- Liquidaciones: «Pagos a nuestros inspectores» (informativa) para Finanzas de agencia; «Cuenta bancaria» para el independiente; «Cuentas bancarias» para Finanzas, que aprueba o rechaza cambios con motivo. El cambio queda pendiente y los pagos usan la cuenta anterior.
- Cuentas: banco del catálogo, tipo, número de 6 a 20 dígitos, titular y RUC o cédula iguales a la ficha. Enmascaradas fuera de Finanzas y del titular; dato personal en el diccionario. Módulo financiero (CNX-12) anotado en el inventario y el backlog.

**Verificado** (las 10 escenas están en `KNOWN_ESC` (436) y `datos-escenas.js`; las abrí desde el selector junto con inspyo, inspofertas, liquidaciones, calhonor, usuarios, agencias y roles, a 1280 y 1920 px: sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- inspofertaagencia muestra USD 9,00 «Tarifa de tu agencia» e inspofertaindep USD 18,00 «Tarifa de la aseguradora» para la misma oferta.
- cuentaaprobar: al aprobar, Produbanco pasa a vigente y la anterior al historial. cuentamascara muestra ···4521 y la cédula ···3640.
- Validación: número con letras, titular o RUC distintos de la ficha y motivo corto se rechazan. Una tarifa nueva sin valor, fecha o motivo no se guarda.

**No verificado**: el envío de facturas y el estado de pago real con CNX-12 (en backlog; hoy simulado).

**Diferencias**: el único independiente de los datos es Luis Andrade, no una inspectora. Corregí que Mauricio veía en sus ofertas la tarifa de la aseguradora a Eurosurvey (USD 16,50) y en Liquidaciones lo de la agencia. Coordinador, Finanzas y Finanzas de agencia ven ahora Usuarios y roles reducido. Las visitas por mes de los inspectores de agencia son de ejemplo más los informes de sus casos.

---

## 18/10/2026 · 20:30 — Etapa 15-3

Etapa 15-3 publicada (Versión 121). La app del inspector tiene el mapa de la ruta del día, el aviso de ofertas y el trabajo sin conexión (DEC-173); lee `mapa`, `sonido` y `sinConexion` de `SIRIUS_APP_INSPECTOR` v1.2, sin cambios.
- Mapa en «Hoy»: esquema propio de Quito norte en SVG con las visitas numeradas en orden de hora, la línea de la ruta y tu ubicación. Tocar un número muestra hora, caso y dirección con «Abrir» y «Navegar» (la navegación del celular). Anotado: en producción, servicio de mapas CNX-04.
- Ofertas: tres tonos con Web Audio y vibración, tarjeta resaltada como «Nueva» y contador de la pestaña. «Sonido de ofertas» en «Yo»; el sonido se habilita tras el primer toque. Prueba «Recibir una oferta (con sonido)»; en producción, notificación push.
- Sin conexión: fotos, eventos e informe entran a una cola local en orden, con identificador. Franja con los tres estados («Simular sin señal»), aviso a las 24 h y bloqueo a los 7 días. Al volver la señal se sincroniza sola, en orden y sin duplicar.
- La visita enviada sin señal dice «Informe listo · por sincronizar» y luego su estado real. En el Back-office el caso queda «En curso · por sincronizar» con la última sincronización; la cronología registra lo sincronizado.

**Verificado** (las 9 escenas están en `KNOWN_ESC` (426) y `datos-escenas.js`; las abrí desde el selector junto con insphoy, inspofertas, inspsinsenal, inspmapa, inspdeterminar, inspllegada, insptomada, bandejaexp y calcola, a 1280 y 1920 px: sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- inspmapavisita: el 2 abre 20186 a las 11:00 con «Abrir» (lleva al detalle) y «Navegar»; Escape cierra.
- inspsonido: «Sonó el aviso de tres tonos» tras tocar la app; con el sonido apagado, solo vibración.
- inspcola: «Recuperar señal» sincroniza 12 de 12 en orden y 20152 pasa a Inspeccionado (T10) con 39 fotos en Evidencias. En inspsync la primera foto ya estaba recibida y no se duplicó.
- inspcola24 e inspbloqueo7: aviso de 24 h con los días que quedan y bloqueo; caseporsync: «Última sincronización 20/10/26 · 08:40».

**No verificado**: el sonido, la vibración, la señal real y la navegación en un celular (en el prototipo se simulan).

**Diferencias**: 20190 está en Sangolquí, fuera de Quito norte: se dibuja en el borde con el lugar y la distancia. Para tener tres visitas, 20186 queda aceptada desde la red a las 11:00 en insphoy, insphoymapa e inspmapavisita. En inspsync se simula un corte antes de la confirmación. Los honorarios por tipo de inspector son de 15-4.

---

## 18/10/2026 · 20:30 — Etapa 15-2

Etapa 15-2 publicada (Versión 120). La visita de la app del inspector sigue la plantilla presencial (DEC-173); `datos-app-inspector.js` v1.2 va tal cual y lo de 15-3 y 15-4 no se tocó.
- Tipo de vehículo con los íconos de la biblioteca de siluetas, marcado el de la solicitud; cambiarlo con fotos pide confirmar, las borra y queda en la cronología. El tipo decide la plantilla y el contorno.
- Pasos y formulario de la columna Presencial (Vehículos livianos v1: 39 pasos; Motos v1: 12). Secciones plegables con obligatorios, leídos con origen y confianza (≥ 90 % precarga, 60–89 % «Por confirmar»), extras con Verificado o No lo tiene y daños con zona, tipo y gravedad. «Para enviar falta: …» bloquea el envío.
- Mapa de captura con anillo N/M, puntos del exterior y «Siguiente · paso N de M»; «Ver todos los pasos» por grupos con miniaturas. Cada foto se registra al usarla y entra a Evidencias con el canal «App del inspector».
- Cámara: contorno y detector en horizontal, marco en vertical, un único mensaje y «Tomar igual» a los 6 s. Solo gira la capa de la interfaz según la posición física (gravedad), con o sin bloqueo de rotación, y la revisión va en esa capa. Igual en la cámara del portal.
- Determinación según la facultad y las reglas de envío (RG y Equipo y maquinaria siempre a calificación); el envío aplica T10 o T09 con sus efectos. Interfaz con el logo sin recuadro, avatar, desbloqueo con lema e íconos de línea sin emojis.

**Verificado** (las 13 escenas están en `KNOWN_ESC` (417) y `datos-escenas.js`, abiertas desde el selector junto con insphoy, inspofertas, inspllegada, portalcamara, portaldoccamara, form, vfevid y evcasorg, a 1280 y 1920 px, sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- inspmapa: 5/39 y la siguiente al centro; «Usar esta foto» la registra y avisa la que sigue; «Repetir» vuelve a la cámara sin cerrarla.
- inspcamgiro: con el bloqueo, el marco gira entero y la interfaz de la cámara se lee derecha; portalrotacion ya no bloquea.
- inspform: placa (97 %) y año (96 %) precargados y VIN (84 %) por confirmar. inspfaltan: 9 fotos, 25 campos, el VIN y el extra.
- inspdeterminar: Asegurable (Eurosurvey solo determina Asegurable) → T10, cronología con los leídos, Evidencias con 39 fotos «App del inspector» e Informe con el origen. inspsinfacultad: 215.400 km cumple «Kilometraje alto» y solo queda T09.

**No verificado**: el acelerómetro, la cámara y el detector en un celular real (en el prototipo se simulan).

**Diferencias**: Motos no tenía columna Presencial: agregué Motos v1 (8 fotos, 4 documentos y las secciones de Vehículos livianos sin carrocería). La columna Presencial de Vehículos livianos v1 exige 39 pasos (la réplica usa 19). R06 pasa a las 15:00 y «Sin respuesta» a las 18:00. Corregí un error de la etapa 14 (versiones 116 a 119) que dejaba sin galería las Evidencias de Vehículos y Ramos Generales. 20152 no tiene vehículo de ejemplo: la app crea uno en la sesión. Mauricio Endara y Sofía Arteaga entran a la lista de inspectores. La v1.2 usa DEC-174 para los honorarios por tipo: Roles y permisos pasa a DEC-175. La firma de quien atiende queda para 15-3.

---

## 18/10/2026 · 20:30 — Etapa 15-1

Etapa 15-1 publicada (Versión 119). La app del inspector (DEC-173) tiene acceso, Hoy, Ofertas de la red, Visitas y Yo a 390 px en `Inspector.dc.html`; `datos-app-inspector.js` va tal cual.
- Correcciones de 14b: R06 sale a las 17:00 del día anterior; el año leído en la matrícula se compara con la solicitud (alerta media); las alertas de documentos y de llegada salen en «Controles de la inspección» también en presencial y virtual.
- Acceso: se entra como un inspector de ejemplo con huella o PIN simulados y el aviso de renovación cada 7 días; la ficha del usuario lista sus celulares con «Revocar dispositivo» y motivo.
- Hoy: visitas del día desde la Agenda real con duración, bien, dirección, caso, estado y ruta esquemática; «Avisar voy en camino» activa «Tu inspector va en camino» en el portal con la hora estimada y queda en la cronología.
- Ofertas: la cita pedida a la red llega a los externos y agencias que cumplen, con cuándo, dónde y distancia, bien, honorario de su tarifario, choques y tiempo restante. «Aceptar» asigna (T03, R06 y confirmación al cliente) y a los demás les dice «La tomó otro inspector»; «No puedo» lleva motivo opcional. Los internos no ven ofertas. Reemplaza la aceptación simulada de 14b.
- Visitas: contacto en sitio y «Llegué» con geocerca de 150 m; fuera, con motivo, T08 y alerta; los pasos dicen «Disponible en 15-2». Yo: «Recibir ofertas», zonas y modalidades (lo que amplía va al Coordinador), honorarios del mes y calificación. Sin señal, la franja cuenta lo pendiente y el caso queda «En curso · por sincronizar».

**Verificado** (las 11 escenas están en `KNOWN_ESC` (404) y `datos-escenas.js`, abiertas desde el selector junto con portalred, portalredok, portalsinred, agendasemana, coord, liquidaciones y calctrl, a 1280 y 1920 px, sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- 20186 pide a la red el miércoles 21/10 a las 16:30: Mauricio Endara ve la oferta (USD 16,50, a 4,1 km); al aceptarla queda en su agenda y el portal muestra su nombre, Eurosurvey y su credencial. Si acepta Sofía Arteaga, él ve «La tomó otro inspector»; el choque con 20190 pide confirmar y «No puedo» queda en la cronología.
- Marco Tapia (interno) tiene Ofertas deshabilitada con el motivo y «Recibir ofertas» no aplica.
- La llegada a 420 m deja T08, cronología y alerta media; con 20152 en calificación salen «Controles de la inspección» con la llegada y el año 2023 frente a 2019.
- Revocar el celular anterior de Mauricio y aprobar su pedido de Ambato desde «Para hoy» funcionan con motivo. coord, calctrl y liquidaciones dan el mismo texto que antes.

**No verificado**: la PWA en un celular real (huella, PIN, push y GPS) y la cola completa sin conexión (15-2).

**Diferencias**: Mauricio Endara pasa a Eurosurvey (en 14b era independiente), así que su tarifa de Vehículos es la del convenio: USD 16,50, no 18,00. La oferta de 20186 es a las 16:30 del miércoles (a las 09:00 hay agenda fija) y agregué su enlace presencial. El día de Mauricio tiene 20152 y 20190 (20145 es de Jorge Pazmiño en Ambato). Las zonas siguen el catálogo de sucursales (sin Cumbayá ni Valle de los Chillos). La regla de «Sin respuesta» de la Agenda (17:00 del día anterior) coincide ahora con R06: queda por definir. El Coordinador aprueba los pedidos en la Agenda porque no tiene Usuarios. Agregué los usuarios Mauricio Endara y Sofía Arteaga con sus celulares. Roles y permisos (10b-c) pasa a DEC-174.

---

## 18/10/2026 · 20:30 — Etapa 14b

Etapa 14b publicada (Versión 117). El autoagendamiento sirve para todos los grupos de ramo con horarios cada 30 minutos y red de inspectores (DEC-172); los documentos se toman con la cámara guiada y llenan el informe. `datos-portal-cliente.js` v1.2 va tal cual.
- Agenda: inicio cada 30 min si la visita termina antes del cierre del bloque y empieza en 2 h hábiles o más. Duración por grupo (45, 120 y 90 min) o por ramo en Agenda › «Duración de las visitas», con motivo e historial. «Confirmación inmediata»: agenda fija libre, apartada 10 min, T03 con ese inspector. «Otros horarios»: van a la red.
- Red: «Te estamos buscando un inspector» con los consultados y el plazo; se puede cambiar o cancelar. El caso queda «En coordinación · buscando inspector en la red» y la Bandeja muestra el tiempo. El primero que acepta queda asignado (T03, R06 y confirmación con nombre, organización y credencial; la aceptación se simula hasta la etapa 15). Si nadie acepta: «No encontramos un inspector para ese horario» con «Elegir otro horario» y tarea al Coordinador. Coordinación dice «Agendada por el cliente · agenda fija» o «· red».
- Documentos: cámara guiada a pantalla completa (tarjeta o A4, aviso en horizontal, cinco indicadores con un mensaje, disparo o «Tomar igual» a los 6 s, recorte y «Usar esta foto / Repetir»); cámara del sistema de respaldo y PDF solo en digitales. Cada cara llena sus campos con «Origen: Portal del cliente · …» (≥ 90 % precarga, 60–89 % «Por confirmar», < 60 % en blanco). Placa o identificación distintas de la solicitud dan una alerta alta en los controles; Evidencias muestra la validación y los campos.

**Verificado** (las 9 escenas nuevas están en `KNOWN_ESC` (393) y `datos-escenas.js`, abiertas desde el selector junto con portalagenda, portaldocs, portalestado, portalcita, portalcamino, docrevisar, coord, agendasemana y calctrl, a 1280 y 1920 px, sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- portalhoras: el martes 20/10 tiene agenda fija de 14:00 a 16:00 y red de 08:30 a 12:00 y a las 16:30. Pedí a la red, cambié el horario y Mauricio Endara aceptó: T03 y cronología con quién aceptó. «Nadie acepta» deja la tarea en Inicio; cancelar vuelve a Mi inspección.
- Cámara: dispara sola, «Tomar igual» marca la foto y girar muestra el aviso; las dos caras dejan la Matrícula «En revisión». doccampos: placa y año precargados, VIN por confirmar y vigencia en blanco. docalerta: 15 controles, con 0915234870 contra 0992876543001.
- La duración pide motivo y queda en el historial. El simulador suma «búsqueda en la red» y «cámara guiada». coord, calctrl y agendadia dan el mismo texto que antes.

**No verificado**: la oferta en la app del inspector (etapa 15), ni una cámara o un mapa reales.

**Diferencias**: Luis Andrade es externo y pasa de la agenda fija a la red. La red (Mauricio Endara, Sofía Arteaga y Pedro Lasso inactivo), sus credenciales y los bloqueos del martes 20/10 en la mañana son datos de ejemplo nuevos (agendasemana los muestra). La cita de portalcita y portalcamino dura ahora 45 min (08:30–09:15). R06 sigue a las 08:00 (la v1.2 dice 17:00). El año 2023 de la matrícula de 20152 se anota frente al 2019 de la solicitud, sin alerta. La alerta del documento se ve en los controles de los casos con autoinspección. «Girar el celular» vuelve al portal del caso. Roles y permisos (10b-c) pasa a DEC-173.

---

## 18/10/2026 · 20:30 — Etapa 14

Etapa 14 publicada (Versión 116). El portal del cliente tiene Mi inspección, Agenda y Documentos con el mismo enlace del caso (DEC-171); `datos-portal-cliente.js` va tal cual.
- Navegación inferior con el contador de documentos pendientes. En autoinspección no hay Agenda: «Ver mi inspección y documentos» desde «Salir» y «Listo», con la autoinspección como acción pendiente.
- Mi inspección: línea de tiempo por `estadoCliente` y la acción pendiente arriba, sin calificación, motivos, alertas ni datos internos. Los textos salen de los bloques de contenido de la apariencia (9 pantallas nuevas con variables).
- Agenda: cupos reales de la zona del riesgo en los próximos 10 días hábiles (jornada, bloqueos, visitas y capacidad). El cupo queda apartado 10 minutos y se ve en la Agenda; al confirmar, visita «Agendada por el cliente» con el inspector del cupo, T03 por «Autoagendamiento del cliente», R06 y cronología.
- Cambiar o cancelar hasta 4 h hábiles antes; cancelar deja el caso «En coordinación» con tarea en «Para hoy». Día de la visita: inspector, credencial y hora estimada, sin teléfono ni foto.
- Documentos: Pendiente, En revisión, Aceptado y «Volver a subir» con motivo; foto o PDF hasta 10 MB. En Evidencias, quien lo pidió lo acepta o rechaza con motivo y el cliente recibe R18. Ramos Generales emitido: garantías por acreditar con su fecha límite; el respaldo llega a Garantías.

**Verificado** (las 10 escenas nuevas están en `KNOWN_ESC` (384) y `datos-escenas.js`, abiertas desde el selector; junto con portalbienvenida, portalmapa2, enlaceciclo, agendasemana, coord, simulador y gendosos, a 1280 y 1920 px, sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- 20152 agenda solo: martes 20/10 de 10:30 a 12:30 con Marco Tapia (3 y 4 cupos por franja), y el caso pasa a Agendado por T03 con su inspector. El cambio al 22/10 y la cancelación quedan en el Historial, con la tarea del Coordinador.
- portalcita: la cita del lunes 19/10 a las 08:30 está a menos de 4 h hábiles, así que cambiar y cancelar quedan bloqueados con el mensaje.
- Subir un PDF lo deja «En revisión»; un archivo de 11 MB o un .txt dan error. Daniela Ruiz rechaza la factura de los aros con motivo (R18 por WhatsApp y SMS) y el portal muestra «Volver a subir»; Andrea Salazar ve los botones bloqueados.
- portalbienvenida, portalmapa2, enlaceciclo, agendasemana, coord y gendosos dan el mismo texto que antes; el simulador suma el grupo «Portal del caso».

**No verificado**: la cámara de un celular real y un mapa real (el mapa es referencial).

**Diferencias**: 20152 es de Guayaquil en los casos, pero el ejemplo lo ubica en Quito con Marco Tapia y «Kia Rio 2023» (el caso dice 2019); el enlace usa la zona Quito Norte. R06 sale al confirmar y su recordatorio va a las 08:00 del día anterior (regla de Notificaciones), no a las 17:00. Agregué credenciales para los demás inspectores y la regla R18 con su plantilla (ahora son 18 reglas y 8 plantillas). Tampoco se puede agendar a menos de 4 h hábiles. «Salir» y «Listo» de la autoinspección suman un botón. La decisión de Roles y permisos (10b-c) pasa a DEC-172.

---

## 18/10/2026 · 20:30 — Etapa 10b-c

Etapa 10b-c publicada (Versión 115). Roles y permisos se edita un rol a la vez, el Monitor queda como DEC-170 y el enlace que vence «En curso» ya no pierde lo cargado.
- Pantalla: ocupa el alto de la ventana y solo se desplaza la lista de permisos (encabezado, herramientas y barra inferior fijos). A la izquierda, roles de 280 px con «Sistema» o «Propio», usuarios y «N sin guardar»; a la derecha, módulos plegables con «N de M con acceso» y un selector de nivel (grupo de radio) que solo ofrece los niveles válidos de cada permiso.
- Buscador, «Solo cambios», chips de niveles, «Antes: …» en la fila cambiada, guardar con «antes → después», impacto y motivo obligatorio (queda en el «Historial del rol»), confirmación al cambiar de rol con cambios y «Comparar roles» con encabezado y primera columna fijos. Flechas en la lista de roles y en cada selector.
- DEC-170: el Monitor se renumeró en el inventario y en los archivos (DEC-168 queda para la placa o el VIN dudoso de 12d-3b; DEC-169 es el enlace).
- Ajuste de 13: T05 sale de «Agendado» y de «En curso» en la v1 de los tres flujos (`datos-flujo-motor.js` v1.2). Al vencer en curso, el caso pasa a «Enlace caducado» con lo cargado guardado; el enlace nuevo (T06) continúa desde ese avance y la cronología lo registra.

**Verificado** (las 7 escenas nuevas o actualizadas —roles, roleseditar, monitorpermiso, rolessolocambios, rolesguardar, rolescomparar y enlacevencidocurso— están en `KNOWN_ESC` (374) y `datos-escenas.js`, abiertas desde el selector; con usuarios, usuarioficha, inicioadm, monitor, enlaceciclo y enlacevencido a 1280 y 1920 px sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- Se edita un rol sin desplazamiento horizontal desde 1280 px; buscar «monitor» encuentra «Ver el monitor del proceso»; guardar muestra el impacto (usuario afectado y menú lateral) y no avanza sin motivo; tras guardar, el rol pierde «Nueva solicitud» en el menú.
- enlacevencidocurso: 3 de 10 fotos, T05 «En curso» → «Enlace caducado»; al generar uno nuevo vuelve a «Agendado» (T06) y el portal dice «llevas 3 de 10 fotos».
- usuarios, usuarioficha, inicioadm, monitor y enlaceciclo dan el mismo texto que antes; enlacevencido solo cambia la nota de T05.

**No verificado**: el uso con lector de pantalla y en pantallas menores de 1280 px.

**Diferencias**: los roles del sistema siguen sin editarse (se ven en solo lectura con «Duplicar este rol»; la maqueta sugería editarlos con motivo y mantuve la regla de 10b); «Duplicar rol» salió de la cabecera y ahora es «Duplicar» en la lista de roles; a 1280×720 la lista de permisos queda de unos 220 px por el título y las pestañas de la página; enlacevencidocurso cuenta «de 10 fotos» como el portal, mientras las escenas de 13 dicen «de 16».

---

## 18/10/2026 · 20:30 — Etapa 13

Etapa 13 publicada (Versión 114). El enlace de autoinspección tiene su ciclo de vida completo y los estados propios definen su propio plazo.
- Ajuste de 16f-2: el estado propio fija su etapa de SLA y su plazo en horas hábiles desde el panel; «Revisión técnica» = 16 h en Suscripción, y el Badge y la Bandeja lo usan igual que los originales.
- Estados del enlace (calculados con los eventos y el reloj): Generado, Enviado, Entregado, Abierto, En curso con avance, Completado, Vencido, Invalidado y Revocado. Entregado y Abierto se simulan por el canal (Genesys o Gmail) y el primer acceso al portal.
- Coordinación: la visita muestra estado, vencimiento y línea de tiempo, con Reenviar, Reenviar por otro canal, Ampliar vigencia (motivo, hasta el máximo), Revocar (motivo; el portal dice «Este enlace ya no es válido») y Generar uno nuevo.
- Recordatorios R13 (24 h hábiles sin abrir), R14 (24 h sin acciones) y R15 (2 días antes): editables en Portal del cliente › Flujo, con consentimiento por canal, horario de clientes y registro en la Bitácora y la cronología del caso.
- Vencimiento: T05 a «Enlace caducado» con aviso al Coordinador; un enlace nuevo aplica T06. «Pedir un enlace nuevo» y «No soy yo» crean la tarea en «Para hoy»; «No soy yo» además invalida el enlace.

**Verificado** (las 8 escenas nuevas están en `KNOWN_ESC` (370) y `datos-escenas.js`, abiertas desde el selector; a 1280 y 1920 px sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal)
- enlaceciclo (20186): R13 el 15/10 09:00 y R14 el 16/10 10:30 por WhatsApp y SMS, próximo R15 el 20/10 09:00, avance 6 de 16 fotos. enlaceampliar: el máximo es 01/11 09:00 (+3 días); +5 y +7 quedan bloqueados con su motivo.
- enlacerevocar y enlacerevocado: el portal muestra el mensaje de enlace no válido. enlacetarea: dos filas en «Para hoy» con detalle. enlacerecordatorios: R13 a R15 con «Editar» y el cambio queda en el historial de Notificaciones.
- enlacevencido: R13 el 12/10 (el 09/10 es feriado), R15 el 14/10, vence el 16/10 09:00, pasa a «Enlace caducado» y un enlace nuevo aplica T06. flujoslapropio: «Revisión técnica» 16 h.
- envioenlace, portalcaducado, portalencurso, notifbitacora, iniciocoo y flujoportomar abren sin errores.

**No verificado**: la entrega y la apertura reales por Genesys y Gmail (se simulan con minutos reales sobre el reloj congelado).

**Diferencias** (cambios sobre pantallas aprobadas): enlaceunico muestra la tarjeta del enlace y su «Reenviar enlace» pasa a «Reenviar»; Notificaciones queda con 17 reglas y 7 plantillas; flujoportomar muestra el SLA «2 d» de 20195; la tabla de Estados muestra el plazo; un caso «En curso» cuyo enlace vence no pasa por T05 (solo desde «Agendado»), pero el Coordinador recibe el aviso.

---

## 18/10/2026 · 20:30 — Etapa 16f-3b

Etapa 16f-3b publicada (Versión 111). El Monitor ya tiene sus cinco vistas, `datos-monitor.js` v1.1 va tal cual y el diseño se ajustó a la maqueta v2.
- Ajustes de 16f-3: el Monitor pasa a DEC-168 en el inventario y en los archivos. El traspaso lento es alta sobre 6 h y media entre 4 y 6 h. El retrabajo usa «Calidad (retrabajo)» con su acción. El acceso sale de la matriz con la acción «Ver el monitor del proceso» (Administrador y Coordinador).
- Responsables y SLA: tabla por persona con sus colores y variación frente al período anterior, más los bloques SLA por rol, traspasos más lentos y devoluciones o reaperturas. Cada fila abre la Bandeja de esa persona.
- Tareas: tabla por tipo con barra de antigüedad, vencidas y responsable, más las 5 más antiguas (el caso se abre; «Reasignar» pide motivo e impacto).
- Cargabilidad: mapa de calor de los próximos 5 días hábiles, con ausencias y bloqueos de Agenda. La simulación mueve N casos y «Reasignar ahora» los reasigna con Historial.
- Diseño según la maqueta: contadores en las pestañas, flujo acumulado en 5 bandas con la marca roja del 08/10, tarjetas de cuello con «Acción sugerida», chips y barras en la tabla de etapas, y antigüedad y causas lado a lado.

**Verificado** (las 7 escenas nuevas están en `KNOWN_ESC` (362) y `datos-escenas.js`, abiertas desde el selector; a 1280 y 1920 px sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal):
- Verónica Lema: 19 casos a cargo, 10 vencidos, SLA 49 % (el más bajo) y carga 188 %. En monitorsim (5 casos a Daniela Ruiz), Verónica baja a 165 %, Daniela sube de 73 % a 95 % y la espera de Pendiente calificación pasa de 6,2 d a 3,9 d. Al confirmar, se reasignan 5 casos y 20141 lo registra en su Historial.
- Traspaso Inspector → Calificación de 7,9 h con severidad alta. Los 3 primeros cuellos coinciden con el esperado v1.1.
- La tarea más antigua (20178) abre su caso. En monitorpermiso, el Ejecutivo comercial no ve el Monitor; el rol propio con la acción activada, sí.
- monitor, monitorcfd, monitorcuello, monitoretapas, agendasemana, iniciocoo y usuarios funcionan; agendasemana, iniciocoo y usuarios dan el mismo texto que antes, salvo la campana.

**No verificado**: el diseño se comparó con la maqueta solo en capturas de 1280 y 1920 px.

**Diferencias**:
- Andrea Salazar también sale sobrecargada (176 %): coordina sola y el trabajo de coordinación es de 1,5 h por caso. Honorarios por aprobar y Facturas por validar quedan en 0, porque Liquidaciones no tiene pendientes. Los inspectores no se reasignan desde aquí (se hace en Agenda o Coordinación).
- Hay 6 cuellos altos, así que la campana del Administrador y la del Coordinador suman 2 avisos más que en 16f-3. La matriz de Roles y permisos muestra la fila nueva.
- En 12d-3b, DEC-168 ya era la placa o el VIN con carácter dudoso; el número queda repetido.

---

## 18/10/2026 · 20:30 — Etapa 16f-3

Etapa 16f-3 publicada (Versión 109). Administración › Flujo y SLA tiene la pestaña «Monitor» (Administrador y Coordinador) con Resumen y Etapas y cuellos; Responsables y SLA, Tareas y Cargabilidad son pestañas visibles con «Disponible en la próxima etapa». `datos-monitor.js` va tal cual y DEC-167 quedó en el inventario.
- Cronología: cada cambio de estado guarda entrada, inicio y fin del trabajo, actor y rol. La histórica de ejemplo sale del generador (semilla 20261018, 30 días + el período anterior) y se suma a la de los casos actuales, que además registran en vivo los cambios de la sesión.
- Resumen: 7 indicadores con su variación (rojo si empeora), flujo acumulado con la marca del 08/10 y cuellos ordenados por aporte, con causa y acción sugerida. Etapas y cuellos: tabla por estado, antigüedad (p50/p85, en rojo sobre p85) y causas.
- Cada número, banda, cuello, fila, punto o tramo abre la Bandeja con «Filtro: Monitor: …»; los casos de ejemplo llevan «Ejemplo» y abren su «Cronología». Los cuellos altos avisan en la campana al Administrador y a los Coordinadores de la sucursal.

**Verificado** (las 8 escenas están en `KNOWN_ESC` (355) y `datos-escenas.js`, abiertas desde el selector; a 1280 y 1920 px sin [object Object], undefined, NaN, cortes ni desplazamiento horizontal):
- Calculado (esperado): en proceso 46 (42), cerrados por día 5,5 (6,1), ciclo 5,9 d y p90 10,5 d (2,4 y 5,8 d), eficiencia 11 % (18 %), SLA 84 % (81 %), retrabajo 11 % (14 %). Calificación se ensancha desde el 08/10 (de 4 a 22 casos, +3,0 por día; Verónica Lema tiene 19). Primer cuello: Pendiente calificación · contención de recursos (alta, 64 % del aumento).
- monitorcuello abre la Bandeja «Monitor: Pendiente calificación · sobre el SLA» (65 casos); el aviso de la campana abre ese cuello; monitorfiltro compara Vehículos + Autoinspección.
- flujos, flujoeditor, bandejaexp, calcola, inicioadm e iniciocoo: mismo texto que antes, salvo lo de Diferencias.

**No verificado**: la maqueta del Monitor no llegó adjunta (solo `datos-monitor.js`), así que el diseño no se comparó con ella.

**Diferencias**:
- El ciclo y la eficiencia quedan lejos de lo esperado porque los tiempos de `generador.tiempos` suman más de 2,4 d. El cuello 2 (Traspaso Inspector → Calificación de 7,9 h · lotes) sale media, porque la regla de traspaso solo da media (se esperaba alta). El retrabajo da 16 % (no 21 %) y su causa «calidad» no está en `causas`.
- La campana suma 4 avisos (al Administrador y a Andrea Salazar como Coordinadora). El Coordinador ahora ve Administración › Flujo y SLA, solo con Monitor. Flujo y SLA suma la pestaña «Monitor».
- Nuevo `datos-monitor-ejemplo.js` con la calibración del generador. DEC-167 ya existía (12d-3b, controles): conviene renumerar una de las dos.

---

## 18/10/2026 · 20:30 — Etapa 16f-2

Etapa 16f-2 publicada (Versión 104). El motor de flujo ya funciona en los casos: cada caso tiene su flujo y versión, sus acciones salen de las transiciones, el responsable se asigna por rol y hay bandeja compartida y migración de casos.

**Verificado** (escenas abiertas desde el selector; las 6 nuevas están en `KNOWN_ESC` (347) y en `datos-escenas.js`; a 1280 y 1920 px sin [object Object], undefined, NaN, texto cortado ni desplazamiento horizontal)
- Casos de ejemplo con la v1: bandejaexp, coord, coordvis, calcola, calveh, calvehapply, calrg, emcalif, emsusc, gendosos, g1cal, riesgos, calctrl, portalcerrado, inicios y conflictos dan el mismo texto que antes. flujoeditor solo suma el botón para plegar el panel.
- flujoacciones: el menú de 20190 (Reaperturado, RG v1) como Coordinador muestra «Registrar contacto o enviar enlace» y «Cancelar por coordinación», con su destino. Abren la pantalla de siempre.
- flujodurante2: «Devolver» en 20141 exige motivo y campos. Al confirmar, el caso pasa a «Devuelto al inspector», el responsable es Cristian Vaca (de la visita) y la tarea queda en el Historial.
- flujoportomar: Ricardo Almeida ve «Por tomar (1)» con 20195 en «Revisión técnica» (RG v2); mientras nadie lo toma, el responsable es «Suscriptor (bandeja compartida)». flujotomar: al tomarlo pasa a ser el responsable, y «Devolver a la bandeja» pide motivo y lo vuelve al rol; las dos acciones quedan en el Historial.
- flujomigrar: el mapeo sugiere cada estado por nombre y exige uno para «Reaperturado», que desaparece en la v2; sin ese mapeo, «Migrar» queda deshabilitado con el motivo. Al migrar, los 13 casos pasan a la v2 y 20190 pasa a «En coordinación», con su mapeo en el Historial.
- flujopanel: con el panel plegado el lienzo pasa de 714 a 1066 px a 1280 px; el panel se abre al seleccionar y se vuelve a plegar.
- calctrlsusc: vuelve «Ver en Evidencias», que lleva a la pestaña, y sigue sin botones de decisión.

**No verificado:** condiciones en árbol con datos reales de un caso (las de la v1 son descriptivas), y la pantalla por debajo de 1280 px.

**Diferencias:**
- La acción principal de la cabecera se conserva; las demás transiciones van al menú del caso. En las pestañas, las acciones no cambian.
- Las transiciones de la v1 con pantalla propia abren esa pantalla; solo las que no la tienen usan el diálogo nuevo («Devolver», «Enviar a revisión técnica», «Terminar revisión técnica»). Donde existe T19, «Cancelar por coordinación» reemplaza a «Cancelar caso» en el menú.
- El responsable por rol se aplica al entrar a un estado por el flujo; los demás casos conservan el de SIRIUS_FLUJO.
- La v2 de RG con bandeja compartida se publica solo dentro de las escenas de demostración. En la migración también entran los casos hijos de garantías.
- «Revisión técnica» no tiene SLA, porque no está en SIRIUS_FLUJO.

---

## 18/10/2026 · 20:30 — Etapa 16f-1c

Etapa 16f-1c publicada (Versión 100). El editor de flujo pasa al patrón «blueprint»: lienzo central (Diagrama o Tabla), panel de 400 px con Estados y Transiciones (Antes, Durante y Después) y barra inferior fija con Publicar, Guardar borrador, Cancelar y la validación. Las reglas de 16f-1 no cambian.

**Verificado** (escenas abiertas desde el selector; las 2 nuevas están en `KNOWN_ESC` (341) y en `datos-escenas.js`; a 1280 y 1920 px sin [object Object], undefined, NaN, texto cortado ni desplazamiento horizontal de la página)
- Todas las transiciones tienen su etiqueta (19 en Vehículos, 22 a 23 en Ramos Generales), sin superposiciones. «Exportar como imagen» descarga un PNG legible.
- flujoborrador: «Revisión técnica» seleccionada con «Salidas (0)», el aviso y «+ Agregar». «Corregir» (o «+ Agregar») y elegir el destino crean T23: dos clics y queda sin errores.
- flujotransicion (T22, Antes), flujodurante (T11 «Devolver»: motivo obligatorio y «Campos señalados») y flujodespues (T03 «Agendar»: R06 y responsable «De la visita»). Los cambios en Durante y Después se guardan en la transición.
- flujotabla: el encabezado y la primera columna quedan fijos, y la fila seleccionada sigue al panel. flujocorregir: la lista de 3 errores, cada uno con «Corregir». flujovalido y flujoeditor, correctos.
- «Guardar borrador» se habilita solo con cambios; «Cancelar» pide confirmar y deja el borrador como estaba al guardarlo. Teclado: flechas, Enter y Esc con devolución del foco.
- flujonucleo: «Eliminar estado» de «Inspeccionado» bloqueado con el motivo. flujopublicar: motivo e impacto; la v1 queda reemplazada con sus 13 casos y los 27 casos no cambian de estado.
- flujos, conflictos, flujo, flujotrans y calcola: texto idéntico al de antes.

**No verificado:** la pantalla por debajo de 1280 px.

**Diferencias:**
- A 1280 px el lienzo mide 714 px, porque el panel tiene 400 px fijos; a 1920 px mide unos 1350 px.
- Los cambios se aplican al borrador al hacerlos: «Guardar borrador» marca el punto al que vuelve «Cancelar».
- «Mensaje de confirmación» es un dato nuevo de la transición, vacío en la v1. En Después, el responsable se elige entre los tipos de asignación y se conserva el texto original.
- Cuando una etiqueta no cabe en su flecha, se aparta y una guía punteada la une a la flecha.

---

## 18/10/2026 · 20:30 — Etapa 16f-1b

Etapa 16f-1b publicada (Versión 99). El editor de flujo ahora ocupa una sola pantalla en tres columnas: lista de estados, diagrama y panel del elemento. Arriba queda una barra fija con la validación y «Corregir»; las reglas de 16f-1 no cambian.

**Verificado** (escenas abiertas desde el selector; las 3 nuevas están en `KNOWN_ESC` (339) y en `datos-escenas.js`; a 1280 y 1920 px sin [object Object], undefined, NaN, texto cortado ni desplazamiento horizontal de la página)
- flujoborrador: «Revisión técnica» queda seleccionada en la lista y en el diagrama, y el panel muestra «Este estado necesita al menos una salida» junto a «+ Agregar salida».
- Corrección en dos clics: «Corregir» abre «Agregar salida» y al elegir «Pendiente calificación» se crea T23 «Terminar revisión técnica» con el rol Suscriptor; el error y el conflicto se resuelven.
- flujovalido: muestra «Salidas (1)» y queda sin errores. flujocorregir: 3 errores, cada uno con «Corregir»; el de «Revisión de garantías» no alcanzable abre «Agregar entrada» y se resuelve al elegir el origen.
- flujotransicion: la flecha T22 queda seleccionada con su panel y las demás flechas atenuadas. flujoeditor: Vehículos v1 en solo lectura.
- flujotabla: el encabezado y la primera columna quedan fijos al desplazar.
- Teclado: las flechas recorren la lista, Enter abre el panel con el foco en su título y Esc lo cierra y devuelve el foco. «−», «+» y «Ajustar» funcionan.
- flujonucleo: «Eliminar estado» de «Inspeccionado» queda bloqueado con el motivo. flujopublicar: pide motivo e impacto; al publicar, la v1 queda reemplazada con sus 13 casos y los 27 casos no cambian de estado.
- flujos, conflictos, flujo, flujosla, flujotrans y calcola: texto idéntico al de antes.

**No verificado:** la pantalla por debajo de 1280 px.

**Diferencias:**
- Con el editor abierto se oculta el encabezado de Flujo y SLA (título, pestañas y «Aplica a»); se vuelve con «‹ Flujos».
- Los cambios del panel se guardan en el borrador al hacerlos, sin botón «Guardar». Una salida nueva sugiere el botón «Terminar …» y el rol del estado, y una entrada nueva sugiere «Enviar a …».
- A 1280 px el diagrama abre al 75 % y se desplaza hasta lo seleccionado; «Ajustar» lo muestra entero al 40 %.
- En la vista de tabla se edita con el formulario de 16f-1, y cada estado tiene «Abrir en el panel».

---

## 18/10/2026 · 20:30 — Etapa 16f-1

Etapa 16f-1 publicada (Versión 96). Flujo y SLA tiene la pestaña «Flujos», con editor por tablas, diagrama automático, validación en vivo y publicación. `datos-flujo-motor.js` va tal cual y SIRIUS_FLUJO sigue calculando el SLA y el Badge.

**Verificado** (escenas abiertas desde el selector; las 6 nuevas están en `KNOWN_ESC` (336) y en `datos-escenas.js`; a 1280 y 1920 px sin [object Object], undefined, NaN, texto cortado ni desplazamiento horizontal de la página)
- flujos: 3 vigentes (Vehículos sin suscripción, 13 casos activos; Ramos Generales con suscripción, 13; Equipo y maquinaria con suscripción, 1) y el borrador v2 de Ramos Generales con 1 error; las acciones que no aplican quedan deshabilitadas con su motivo.
- flujoeditor: Vehículos v1 en solo lectura, con un diagrama de 13 estados y 24 flechas; tocar un estado o una flecha abre su fila.
- flujoborrador: «Revisión técnica» no tiene salida. «Ir a la fila» lleva al estado, Publicar queda deshabilitado y el conflicto bloqueante se abre en el Centro de conflictos, con ida y vuelta al borrador.
- Por la interfaz agregué la salida, también con condiciones en árbol: el error y el conflicto se resolvieron y el diagrama pasó de 27 a 28 flechas. Un estado propio sin transiciones dio dos errores (inalcanzable y sin salida).
- flujovalido: sin errores. flujopublicar: rechaza un motivo corto y el impacto muestra por estado los 13 casos de la v1. Al publicar, la v1 queda «Reemplazada» con sus 13 casos, la v2 queda vigente con 0, la publicación va al Historial de cambios y los estados de los 27 casos no cambian.
- flujonucleo: «Eliminar» de «Inspeccionado» queda bloqueado con el motivo; solo cambia su etiqueta corta y el tipo tiene candado.
- flujo, flujosla, flujoresp, flujotrans, conflictos y calcola: iguales a antes, salvo la pestaña nueva y el texto de solo lectura de Estados y Transiciones.
- Inventario: DEC-145 (reemplaza a DEC-098), archivos nuevos y backlog «Editor visual del flujo con arrastre: después de 16f (fase D)».

**No verificado:** la pantalla a 390 px y Flujo.dc.html abierto fuera del Back-office (ahí no hay Centro de conflictos).

**Diferencias:**
- «Estados y transiciones» eran dos pestañas (Estados y Transiciones): las dos pasan a solo lectura con el botón «Ir a «Flujos»».
- El conflicto de un borrador con errores se abre cuando se abre o edita el borrador, no al cargar, para no cambiar el Centro de conflictos en las demás escenas.
- El «permiso correspondiente» se comprueba como un rol que existe en la matriz y tiene permisos sobre casos; falta la relación entre cada transición y su acción de la matriz.
- Un estado cuenta solo sus salidas propias: el origen del sistema «*antes de Inspeccionado» no cuenta como salida, porque si no «Revisión técnica» no daría el error esperado.
- En el diagrama, algunas etiquetas de las flechas largas tapan en parte un estado.

---

## 18/10/2026 · 20:30 — Etapa 12d-3c

Etapa 12d-3c publicada (Versión 95). Los controles de la autoinspección los revisa solo quien tiene «Calificar nivel 1» en la matriz; el Suscriptor de un riesgo derivado los ve en solo lectura.

**Verificado** (escenas abiertas desde el selector; las dos nuevas están en `KNOWN_ESC` (330) y en `datos-escenas.js`; a 1280 y 1920 px sin [object Object], undefined, NaN, texto cortado ni desplazamiento horizontal)
- 20186 (Vehículos): bandeja, chip y contador solo para Ejecutivo de inspecciones y Administrador; Suscriptor, Coordinador, Ejecutivo comercial, Finanzas e Inspector no ven nada.
- Matriz: darle «Calificar nivel 1» al Suscriptor le abre la bandeja, y quitárselo al Ejecutivo se la cierra.
- calctrlsusc: Ricardo Almeida en 20204-E2 ve «7 revisadas · 2 requieren acción», quién revisó y cuándo, y cada alerta con su evidencia, sin botones de decisión.
- calctrlsuscveh: Ricardo Almeida en 20186 no ve bandeja, chip, contador, bloque del Informe ni distintivos en Evidencias.
- Bloqueo: con altas sin revisar se bloquea el nivel 1 (también el de equipos, 2 altas); el dictamen del Suscriptor se graba.
- calctrl, calctrltodo, calctrlfin, emsusc, iniciosus, emcalif, emfotos e inicioeje: texto idéntico al de antes.
- Inventario: DEC-165 con esta regla y DEC-151 corregida (1 a 10 MB, hasta 45 s, vuelta mínima de 300°).

**No verificado:** un rol propio creado desde Usuarios (solo cambié la matriz en memoria); un caso derivado de Ramos Generales (misma regla, sin escena); 390 px.

**Diferencias:** 20204 no tenía autoinspección, así que agregué una de ejemplo de 20204-E2 que solo carga calctrlsusc; en Equipos el bloque va sobre las tarjetas; el indicador de Inicio y el bloqueo ahora siguen el permiso; en solo lectura no hay enlaces a otras pestañas.

---

## 18/10/2026 · 20:30 — Etapa 12d-3b

Etapa 12d-3b publicada (Versión 94). Los controles se revisan en una bandeja de dos paneles, cada alerta junto a su evidencia, y la calificación se habilita al terminar.

**Verificado** (escenas abiertas desde el selector; todas están en `KNOWN_ESC` (328) y en `datos-escenas.js`; sin [object Object], undefined, NaN ni desplazamiento horizontal a 1280 y 1920)
- calctrl: «0 de 14 revisadas · 3 altas pendientes», alertas por severidad y la primera con evidencia, contexto y enlaces; el paso 2 queda bloqueado. El chip «14 controles por revisar» y el contador de la pestaña llevan a la bandeja.
- calctrllecturas: foto con la zona de la placa y «G5C781O» frente a «GSC7810», con los dos caracteres resaltados. «Corregir dato» exige motivo y deja la alerta en Conforme; el Informe muestra GSC7810 «Corregido por Verónica Lema» con «Ver control».
- Decisiones: «Requiere acción» no avanza sin comentario; cada decisión pasa a la siguiente pendiente y queda en el Historial. J y K mueven, A y R deciden; escribiendo no actúan.
- calctrlalertas (filtro Revisadas), calctrlvideo (reproductor y vuelta de 285°) y calctrlcrono (tramo resaltado). calctrlbloqueo: «Calificar inspección» con altas sin revisar abre el bloqueo, e «Ir a las alertas» lleva a la primera alta.
- calctrltodo: «Revisar todo» muestra la cantidad por severidad y no confirma sin «Revisé la evidencia de las alertas altas»; la alerta que requiere acción no cambia.
- calctrlfin: «Controles revisados» y paso 2 habilitado; «Continuar a calificar» pliega a «14 revisadas · 2 requieren acción».
- evidistintivo: las fotos con alerta llevan el distintivo, que abre la bandeja en esa alerta.
- Inicio: inicioeje vuelve a 4 indicadores; en calctrl, «Por calificar» muestra «1 con alertas altas sin revisar», que abre la bandeja de 20186.
- Ver como otro usuario: Ricardo Almeida (Suscriptor) y Andrea Salazar (Administrador) ven bandeja, chip e Informe; como Coordinador, Inspector o Ejecutivo comercial no ven nada.
- Error «createElement»: el archivo de controles creaba un elemento de React al cargarse; si React llegaba después, fallaba y el panel no existía. Ahora lo crea al pintar: antes 3 errores en 72 aperturas, ahora 0.
- calveh, calcola, dp1aps y portalcerrado no cambian; portalrechazo llega a la confirmación «Listo» y deja el registro en el caso.

**No verificado**
- El reproductor, el mapa y el motor de verificación siguen simulados. No revisé la bandeja a 390 px.

**Diferencias**
- Una placa o un VIN con «carácter dudoso» ahora genera alerta (antes solo «No coincide»): 14 alertas, 3 altas.
- En el Informe, el resumen y los datos OCR van en un bloque sobre el formulario, no dentro de cada campo.
- Evidencias muestra también las 6 fotos de pasos que la plantilla no tenía (laterales, VIN, tablero y llanta). «Ver como otro usuario» con un caso abierto se queda en el caso.

---

## 18/10/2026 · 20:30 — Etapa 12d-3

Etapa 12d-3 publicada (Versión 93). Los calificadores ven en 20186 los controles de la autoinspección, no pueden calificar con alertas altas sin revisar y portalrechazo se completa desde la computadora.

**Verificado** (escenas abiertas desde el selector; todas están en `KNOWN_ESC` (325) y en `datos-escenas.js`; sin [object Object], undefined, NaN ni desplazamiento horizontal a 1280 y 1920)
- calctrl: el panel aparece sobre la calificación y en la pestaña Informe. El resumen muestra «Autoinspección cerrada», Alta 2 · Media 9 · Baja 2 y «Revisado por». Hay pestañas Lecturas, Alertas (13), Fotos (16), Video, Extras (4) y Cronología.
- calctrllecturas: la placa posterior «G5C781O» (71 %, 3 de 5 lecturas, motor de extracción) sale «Coincide (carácter dudoso)». La corrección exige un motivo de al menos 10 caracteres; luego la fila queda «Corregido: GSC7810» y se registra en el Historial.
- calctrlalertas: cada alerta tiene «Ver evidencia» (foto, mapa o tramo de la cronología) y «Revisada» con comentario opcional. Las revisiones van al Historial y el resumen pasa a «Revisado por Verónica Lema».
- calctrlbloqueo: «Grabar calificación» con 2 altas sin revisar no graba y muestra el modal con la lista y «Ir a las alertas». Después de revisarlas, graba.
- calctrlvideo: 31 s, 8,3 MB, vuelta de 285° con su alerta; la reproducción avanza. calctrlcrono: 36 acciones, filtro por tipo y mapa con las fotos agrupadas por punto.
- Extras: Cubre balde «No lo tengo» baja el valor de los extras de USD 2.000,00 a USD 1.350,00; Neblineros (agregado por el cliente) queda por valorar.
- Inicio del Ejecutivo: el indicador marca 1 con 20186 y lleva a la Bandeja filtrada; en inicioeje marca 0.
- El Coordinador no ve el panel (portalcerrado), y en el portal no hay nada de esto. dp1aps, calveh, calcola, portalencurso y portalcerrado no cambian.
- portalgiro y portalrechazo: el marco se ajusta al alto de la ventana (al 73 % en vertical a 720 px) y «Girar el celular» lo pone vertical para los documentos. «Usar esta foto» y «Repetir» quedan fijos abajo. portalrechazo llega a «¡Listo, Jorge!» a 390, 1280 y 1920, y el envío deja el registro en vivo en el caso.

**No verificado**
- El Suscriptor y el Administrador ven el panel por código, pero no los abrí: el selector de rol de esta escena solo ofrece Ejecutivo.
- El motor de verificación, el indicio de pantalla y el video están simulados. El mapa es esquemático, sin calles.
- En dos barridos apareció una vez un error de carga («createElement»); repetido 10 veces, no se reprodujo.

**Diferencias**
- El Inicio del Ejecutivo tiene 5 indicadores (la regla decía hasta 4); el quinto pasa a una segunda fila a 1280.
- Agregué a datos-ejemplo.js la autoinspección cerrada de 20186 con valores de extras declarados. La revisión de la foto dice «Repetir» en lugar de «Tomar de nuevo», y en la computadora el giro rota el marco, no la imagen.

---

## 18/10/2026 · 20:30 — Etapa 12d-2b

Etapa 12d-2b publicada (Versión 91): la acción principal del caso enfoca el panel de gestión, el enlace ya no sale del modal, portalrechazo se completa desde la computadora, la Bandeja separa estado y avance y el logo se desplaza con su texto.

**Verificado** (escenas abiertas desde el selector; todas están en `KNOWN_ESC` (318) y en `datos-escenas.js`; sin [object Object], undefined, NaN ni desplazamiento horizontal a 1280 y 1920)
- Acción principal: «Coordinar inspección» (envioenlace, coord), «Agendar visita» (tras registrar un intento «Contestó») y «Ver visita» (coordvis). Abre Coordinación, desplaza al panel, enfoca su primer campo y lo resalta 2 s; con la pestaña ya abierta el clic también lo repite.
- envioenlace: el modal parte el enlace dentro del recuadro y «Copiar enlace» confirma «Enlace copiado»; nada sale del modal ni de la tarjeta a 390, 1280 y 1920.
- portalrechazo: completo a 390, 1280 y 1920 desde la computadora (fotos con giro simulado, interior, extras, 4 documentos, video, declaración y «¡Listo, Jorge!»). La pantalla de rotación y la revisión de cada foto tienen «‹ Volver»; el disparo queda visible.
- portalencurso: chip «En curso · Autoinspección» y barra con «5/10 fotos · 0/4 docs»; el detalle completo está en el tooltip; sin cortes a 1280 y 1920.
- menuscroll: menú expandido desplazado 306 px hasta Administración; el logo y «by aseguradora del sur» se mueven juntos.
- coord, coordvis, bandejaexp, portalmapa2, portalcamaralat y portalextras: sin errores; solo cambia lo pedido.

**No verificado**
- Cámara real ni celular físico: desde la computadora el giro es simulado. «Copiar enlace» lo probé en un navegador sin interfaz; en el tuyo puede pedir permiso del portapapeles.

**Diferencias**
- La acción principal aparece también como «Ver visita» para el Coordinador en casos Agendado, En curso y Enlace caducado (antes no había botón).
- La columna Estado de la Bandeja pasó de 125 a 184 px para que el chip no se corte; «Responsable» queda más a la derecha a 1280.
- El enlace y el vencimiento de la tarjeta de visita ya no son de una sola línea; con 1080 px de alto menuscroll no necesita desplazarse.

---

## 18/10/2026 · 20:30 — Etapa 12d-2

Etapa 12d-2 publicada (Versión 88): el portal sigue el flujo vigente con la experiencia de la réplica probada en campo, y cada acción del cliente queda en el caso en el momento.

**Verificado** (todas las escenas abiertas desde el selector; están en `KNOWN_ESC` (317) y en `datos-escenas.js`; sin [object Object], undefined, NaN ni desplazamiento horizontal a 1280 y 1920)
- portaltipo: los cuatro tipos tienen ícono y la camioneta de la solicitud aparece marcada. Cambiar de tipo con fotos tomadas pide confirmación y borra.
- portalmapa2: 6 pasos en el mapa con «‹ Tipo» y tarjetas Interior (4), Extras (3 declarados) y Documentos (4). El avance dice «3 de 10 fotos · 0 de 4 documentos».
- portalcamaralat: «Lateral izquierdo» en horizontal, con el contorno centrado, los indicadores abajo y «Listo: toma la foto». La foto tomada pasa a «Foto lista» y suma al avance. portalrotacion muestra «Tu pantalla no está girando» y bloquea la captura.
- portalrechazo: una foto de frente en el lateral da «Repite esta foto» con «Tomar de nuevo» y, en el segundo intento, «Mi foto es correcta: usarla igual».
- portalavisoocr: si el kilometraje no se lee, solo avisa, con «Mi foto se ve bien: continuar» y «Tomar de nuevo».
- portalextras: Aros de aleación (Lo tengo, con foto), Cubre balde (No lo tengo, sin foto) y Radio con pantalla pendiente; «Listo» sigue bloqueado hasta responder todos.
- portalvideo2 cuenta segundos, MB y vuelta; al detener en 290° avisa que la vuelta no fue completa. portalsalir y portalretomar muestran «Tu avance quedó guardado» y «Hola de nuevo, Jorge» con miniaturas.
- portalencurso: 20186 aparece en la Bandeja como «Autoinspección en curso · 5 de 10 fotos · 0 de 4 documentos».
- portalcerrado: 20186 queda en Pendiente calificación; el Historial registra cada acción con hora y ubicación y termina en «Autoinspección cerrada».
- El simulador y el portal muestran los mismos 10 pasos. Revisé simulador, simuladorcamara, autotaller, envioenlace, bandejaexp, coord y calcola: la regresión no cambia nada.

**No verificado**
- No lo probé con una cámara real ni en un celular. El detector, el OCR y la grabación del video están simulados y marcados «simulado»; la huella que detecta fotos repetidas sí se calcula.
- La ubicación real depende del permiso del navegador; en las pruebas quedó simulada y así se marca.

**Diferencias**
- portalvehiculo ahora abre «Elegir el tipo», porque la confirmación del vehículo de la etapa 12b ya no está en el flujo. portalcerca lleva al mapa, porque la foto de cerca está desactivada.
- Agregué a datos-ejemplo.js los extras declarados de 20186; la v2.0 no los trae.
- La cámara simulada tiene un selector «Foto de ejemplo» (Correcta, Tomada de frente, Repetida, Sin lectura) para probar la validación.
- El evento de envío ya no menciona el comprobante.

---

## 18/10/2026 · 20:30 — Etapa 12d-1d

Etapa 12d-1d publicada (Versión 85): la configuración del portal tiene dos niveles (Portal del cliente global y Autoinspección por plantilla), un catálogo de apariencias, textos con variables y un solo simulador.

**Verificado** (todas las escenas abiertas desde el selector; están en `KNOWN_ESC` (305) y en `datos-escenas.js`; sin [object Object], undefined, NaN ni desplazamiento horizontal a 1280 y 1920)
- portalcliente: Formularios › Portal del cliente tiene Apariencias, Flujo, Controles y Video. La plantilla ya no tiene la subpestaña Portal: muestra «Usa: Flujo v1 · Apariencia según asignación» e «Ir a Portal del cliente».
- flujoretirados: 10 pasos vigentes numerados de corrido; «Retirados (2)» queda cerrado, con motivo y decisión (DEC-146, DEC-155).
- aparienciacrear: «Aseguradora del Sur · campaña» se crea duplicada, en borrador, con logo-campania.svg. Al subir archivos reales, uno de 1,1 MB y otro con fondo blanco dan error. aparienciaeliminar: Eurosurvey se elimina con motivo, y «Eliminar» de la compañía está bloqueado con su motivo.
- simulador: 29 pantallas vigentes agrupadas, celular de 390 px y editor a la derecha. Al escribir, el celular cambia; «Insertar variable» busca e inserta; las flechas cambian de pantalla.
- simuladorvariables: con datos vacíos se ve «tu vehículo». simuladorlopdp: {{contacto.celular}} da error en línea y bloquea «Publicar». simuladorcamara, simuladorvalida y simuladorvencido abren su pantalla.
- «Ver en el simulador» abre la pantalla exacta desde el panel del paso, Validación y Documentos y extras. «Abrir el catálogo de extras» lleva a Catálogos › Extras de vehículo filtrado por Camioneta.
- El portal usa los bloques: «Hola, Jorge. ¿Eres tú?» y «Sí, soy Jorge: empezar». Revisé autotaller, autotallerpaso, autotallervalida, autotallerdocs, autoextras, extrascat, portalbienvenida y portalsincedula; la regresión solo cambia lo esperado.

**No verificado**
- La aprobación de Legal solo pide una referencia al publicar Consentimientos o Declaración: no hay un flujo de aprobación.
- El portal real sigue con sus pasos de 12b (20 fotos) y sin «Elegir el tipo»; el simulador usa los pasos de la plantilla (14).

**Diferencias**
- El máximo de caracteres se mide sobre el texto que ve el cliente (con los datos de ejemplo). Medido en bruto, el botón del archivo «Sí, soy {{contacto.nombre}}: empezar» pasa de 32.
- Para los mensajes de validación, el archivo solo describe el bloque, así que usé los textos de la 12d-1b con {{paso.nombre}}. Consentimientos usa el texto de datos-ejemplo, porque el del archivo es un marcador.
- autoextras ya no muestra el celular ni edita el mensaje: el texto de Extras es de la apariencia y se edita en el simulador.
- En el portal, el botón de Consentimientos dice «Ver el mapa de fotos», como trae el archivo, aunque después pasa por Vehículo.

---

## 18/10/2026 · 20:30 — Etapa 12d-1c

Etapa 12d-1c publicada (Versión 81): la autoinspección se configura en un espacio de trabajo de una sola pantalla, y el portal ya no pide la cédula.

**Verificado** (todas las escenas abiertas desde el selector; están en `KNOWN_ESC` (295) y en `datos-escenas.js`; sin [object Object], undefined, NaN ni desplazamiento horizontal a 1280 y 1920)
- autotaller: el mapa (máx. 320 px) y la lista de 10 pasos se ven juntos sin desplazar la página. Chips: 10 pasos, 4 documentos, 7 extras y 16 desactivados. «Pasos desactivados (14)» empieza plegado.
- Tocar un punto del mapa o una fila resalta los dos y abre el panel de 440 px. Esc lo cierra y devuelve el foco a la fila. En el borrador, Alt + flechas cambia el orden y lo anota en el historial; el interruptor pide motivo.
- autotallerpaso: abre «VIN grabado» en la pestaña Validación; la vista previa del celular se pliega en Guía. En OCR, «MPATFS86JLTOO4512» da «Coincide (carácter dudoso)» y «…XX…» da «No coincide».
- autotallervalida: una tabla por tipo con sus umbrales; los mensajes se abren solo con «Ver mensajes».
- autotallerdocs: los documentos activos y la cédula desactivada, y los extras por carrocería con enlace al catálogo.
- portalsincedula y portalbienvenida: «¿Eres Jorge?» lleva a Consentimientos (Paso 1) y de ahí a Vehículo (Paso 2). «Ten a mano» muestra matrícula y licencia, sin cédula, y «No soy yo» cierra el enlace. autovideo: de 1 a 10 MB.
- Revisadas sin errores: autopasos, autopasosmoto, autopasosem, autoextras, autovalida, motorverifica, autoayudavin y mapacaptura. La regresión contra la versión anterior solo cambia lo esperado.

**No verificado**
- No vi en pantalla, en la ficha del caso, el evento «Sí, soy yo» ni la tarea del Coordinador por «No soy yo»; el código está conectado.
- El portal sigue sin la pantalla «Elegir el tipo» que lista el flujo.

**Diferencias**
- Agregué una cuarta subpestaña, «Portal», con Flujo, Controles, Video y Apariencia; autoflujo, autocontroles, autovideo y autoapariencia abren ahí.
- En Pasos de foto, la tabla de autoinspección se reemplaza por una nota con «Abrir Autoinspección». El mapa y el panel del paso siguen ahí, así que autoextras, autovalida y autoayudavin no cambian.
- Equipo y maquinaria ahora tiene la pestaña Autoinspección, y portalidentidad abre los consentimientos.
- El portal renumera sus pasos: Vehículo pasa de Paso 3 a Paso 2.

---

## 18/10/2026 · 20:30 — Etapa 12d-1b

Etapa 12d-1b publicada (Versión 78): la configuración de la autoinspección v1.7 ya está en Formularios, Motores de IA y Coordinación.

**Verificado** (todas las escenas abiertas desde el selector; están en `KNOWN_ESC` (290) y en `datos-escenas.js`; sin errores a 1280 y 1920)
- autopasos: el auto suma 10 pasos (6 en el mapa y 4 en Interior) y 4 documentos (matrícula y licencia), más los extras. Neumático delantero derecho, tablero de instrumentos, volante, asientos y la cédula quedan desactivados con su motivo. En el borrador v2 reactivé «Volante» con motivo.
- autoextras: cada extra dice «Declarado en la solicitud» y se responde con «Lo tengo» (detalle y foto) o «No lo tengo» (motivo opcional). «Continuar al video» espera una respuesta por extra, y el mensaje al cliente se edita con motivo.
- autovalida: «Lateral izquierdo» valida un vehículo de lado (cobertura del 35 %, más de 1,45 veces más ancho que alto). La columna Validación muestra «Kilometraje · sin lectura solo avisa», y las opciones al cliente son botones.
- motorverifica: IA-07-VL está en Borrador con 19 prompts por paso, cada uno con versión y umbral; aparece en Motores de IA › Vehículos livianos.
- Pestañas de Autoinspección:
  - autoflujo y autocontroles (18 controles): un control editado muestra su impacto y pide motivo.
  - autovideo pide de 4 a 10 MB, 45 s y una vuelta mínima de 300°.
  - En las apariencias, el color #7FD1C9 (1,77:1) bloquea «Publicar»; con un color AA se publica con motivo.
- enlaceunico: «Generar uno nuevo» pide motivo, deja el enlace anterior «Invalidado» (ya no abre el portal) y lo anota en el Historial. En envioenlace, el enlace nuevo (token de 22 caracteres) abre el portal.
- extrascat y envioenlace no cambian de texto.

**No verificado**
- El portal del cliente todavía no usa estos pasos, el flujo, los extras ni la validación: sigue como en 12b.
- El registro en vivo (DEC-159) solo quedó en el inventario; no está implementado.

**Diferencias**
- Por la v1.7, la moto queda con 7 pasos y 4 documentos, y mapacaptura y autoayudavin muestran 6 puntos en el mapa.
- autoflujo, autocontroles y autovideo abren el borrador v2 para poder editarlos; la apariencia es de la compañía, no de una versión.
- En Motores de IA, IA-07-VL (motor propio, sin motor base) se lista en Vehículos livianos y al final de «Todos»; motoresvl pasa de 3 a 4 motores.

---

## 18/10/2026 · 20:30 — Etapa 12d-1

Etapa 12d-1 publicada (Versión 70): la columna «Autoinspección», la ayuda del VIN, los contornos y el catálogo de extras ya funcionan en Formularios y Catálogos.

**Verificado**
- Contornos: las 40 guías son un solo trazo punteado con el viewBox de `cajaContorno`, sin líneas internas. Las usan la guía del paso, su vista previa y la cámara del portal; el PDF sigue en estilo «pdf» (dp1diag y empdfdiag no cambian).
- autopasos (Vehículos livianos v1): 14 pasos (7 en el mapa y 7 en Interior), extras declarados y 6 documentos. Parabrisas, placas, los 4 laterales y los 3 pasos de VIN anteriores están desactivados con motivo. En el borrador v2 reactivé «Parabrisas» (rechaza un motivo de menos de 10 caracteres) y creé «Gancho de remolque» con guía, posición y OCR.
- autopasosmoto: 8 pasos y 6 documentos. autopasosem: 9 pasos y 4 documentos, con las 4 diagonales desactivadas.
- mapacaptura y mapacapturaem: el dibujo muestra solo los pasos del mapa, con los laterales al medio de cada lado; debajo van Interior, Extras y Documentos.
- pasoguia: frente en horizontal, con el contorno al 86 % del alto, los indicadores abajo, un único mensaje, el disparador a la derecha y el nivel.
- autoayudavin (camioneta): lugares numerados, incluido el larguero; en el borrador moví un lugar con motivo.
- extrascat: 11 extras y «Cubre balde» solo en camioneta. Inactivarlo pide motivo, «Eliminar» queda deshabilitado con sus usos y el cambio llega a los pasos «Extra: <nombre>».
- Las escenas están en `KNOWN_ESC` (281) y en `datos-escenas.js`; abiertas desde el selector a 1280 y 1920 no dan errores. form, siluetas, dp1diag, empdfdiag, portalmapa y portalcamara muestran el mismo texto que antes.

**No verificado**
- Que el portal del cliente use los pasos nuevos: sigue con los de 12b.

**Diferencias**
- formem: el alcance ahora dice «Autoinspección: 9 pasos y 4 documentos» en lugar de «Sin autoinspección».
- DEC-147 y DEC-150 no tienen rótulo en el archivo; en el inventario quedan pendientes de confirmar.
- El contrato de compraventa dejó de pedirse en autoinspección para que queden 6 documentos. En moto, la ayuda del VIN muestra solo los lugares propios de la moto.
- La vista previa de la guía muestra el texto de ayuda debajo del marco.

---

## 18/10/2026 · 20:30 — Etapa 12b

Etapa 12b publicada (Versión 63): el portal del cliente para la autoinspección funciona de punta a punta con el caso 20186 y está conectado al Back-office.

**Verificado**
- Recorrido completo, entrando por el selector en envioenlace como Coordinador:
  - «Enviar enlace de autoinspección» pasa 20186 a Agendado. La Agenda muestra «Enlace vigente · hasta 28/10 20:30» y la Bitácora registra la regla R07 por WhatsApp y SMS.
  - Desde «Abrir el portal del cliente» completé identidad (el caso pasa a En curso), una corrección del año, 21 fotos con la foto de cerca, la declaración y el envío.
  - Al final, 20186 queda en Pendiente calificación y Evidencias muestra las 21 fotos con canal Portal del cliente. El Historial registra, a nombre del cliente, los consentimientos, los datos leídos, la discrepancia y el envío.
- Las 15 escenas están en `KNOWN_ESC` (276) y en `datos-escenas.js`. Abiertas desde el selector a 390, 1280 y 1920 no muestran errores, [object Object] ni undefined, y no hay desplazamiento horizontal. Por dirección y por selector se ven igual. Con teclado, a 390 px, llegué de la bienvenida hasta una foto aceptada.
- Enlaces: con un token vacío o desconocido aparece un mensaje con el contacto de la compañía. Con el vencido (20152) solo queda «Pedir un enlace nuevo», que crea la tarea para el Coordinador. Ningún paso permite subir desde la galería.
- Cámara y envío:
  - El disparador espera a las validaciones y las fotos horizontales piden «Gira el celular».
  - Se lee «Leímos GSC7810 · 91 %» y cada foto se puede repetir hasta 3 veces.
  - Sin red, el envío dice «Sin internet…» y se completa al reconectar.
- En los PDF descargados, 20204-E1 dice «Superficial · 1,2 dm²» y E3 «Media · 0,8 dm²».
- Comparadas con 12a-b, coord, coordvis, agendasemana, notifbitacora, vfsec, calcola y bandejaexp tienen el mismo texto.

**No verificado**
- La cámara y el GPS reales del dispositivo: el navegador de pruebas no tiene cámara. Solo probé la simulación; el aviso cuando se rechaza el permiso no lo pude ver.

**Diferencias**
- El enlace vencido es de 20152 (48 h, venció el 15/10) y no de 20188, que tiene una visita documental ya realizada.
- A 20186 le agregué el contacto Jorge Villacís Mora para poder enviarle el enlace. En las escenas portal… el enlace se envió a las 19:30.
- Agenda: el resumen de una autoinspección se rompía porque no tiene fecha; ahora muestra «Enlace enviado el …».
- El comprobante se descarga en HTML. En la Coordinación, la visita con enlace del portal muestra «Abrir el portal del cliente».

---

## 18/10/2026 · 20:30 — Etapa 12a-b

Etapa 12a-b publicada (Versión 62): las tres observaciones solo pasaban al entrar por el selector de escenas; quedaron corregidas y verificadas por ese mismo camino.

**Verificado**
- Causa común: el selector armaba la escena sin correr lo que esta hace al montarse (daños, calificación de equipos y repintado al llegar el motor). Ahora corre igual que con la dirección: 15 escenas, entre ellas siluetas, mapacapturaem, danosfoto, danosajustar, empdf, empdftarjetas, dp1diag y calcola, dan el mismo texto por la dirección y por el selector.
- pasoguia abre el borrador v2: cambié la orientación a vertical y desactivé «Luz», y la vista previa pasa a vertical sin el chip Luz. En una versión Vigente, el panel muestra «Editar: …» y cada campo bloqueado explica el motivo en su tooltip; con «Editar» se sigue en la misma pestaña y el mismo paso, ya en el borrador.
- danoscalif (20141, por el selector): no se graba ni desde la pestaña, ni desde «Calificar inspección» de la cabecera, ni desde el módulo Calificación; el dictamen (`saveCalif`) también se bloquea. Aparece «Revisa los daños detectados antes de calificar (2)» y «Revisar daños» abre el visor en la foto posterior, que es el primer daño pendiente.
- Averías en los datos: 20204-E1 (cucharón, Rayón, Baja, F-13) y 20204-E3 (mástil, Desprendimiento, Media, F-14). empdfdiag y empdfdiag3 abren la vista previa en el diagrama, con la cargadora y el montacargas y la marca en su zona. Los PDF descargados (6 páginas) traen el diagrama y no tienen dibujos negros.
- «Siluetas y zonas» quedó en Generales. Las escenas están en `KNOWN_ESC` (261) y en `datos-escenas.js`. A 1280 y 1920 no hay errores; de 16 escenas anteriores, solo catalogos cambia (por el grupo).

**No verificado**
- «Aplicar a otros vehículos/equipos» con 20141, porque tiene un solo vehículo: los bloqueé y los probé con 20196 y 20204. Tampoco probé el dictamen del Suscriptor desde su pantalla con 20141.

**Diferencias**
- Vehículos livianos ya tenía un borrador v2, así que su botón dice «Editar: abre el borrador v2»; en Equipo y maquinaria dice «crea el borrador v2».
- Con las averías reales, el diagrama también sale en empdf y empdftarjetas: el PDF de 20204-E1 pasa a 6 páginas. Las averías no traen profundidad ni superficie, así que se muestran con «—».
- «Revisar daños» ya no abre una ventana dentro de la calificación: lleva al visor del informe.
- Por el selector, calcola mostraba «Sin alertas» en 20195 (ya pasaba antes de la 12a); quedó corregido.

---

## 18/10/2026 · 20:30 — Etapa 12a

Etapa 12a publicada (Versión 61): biblioteca de siluetas, guías y mapa de captura, detección de daños y pendientes de 8c.

**Verificado**
- Integridad: los 5 archivos reconstruidos en 8c (ColaCalificacion, sirius-inicio, sirius-equipos, datos-equipo-maquinaria y datos-conflictos) tienen el mismo SHA-256 local y publicado en la Versión 60. Comparé 38 escenas anteriores con esa versión: 34 quedan iguales y 4 cambian como se esperaba (catalogos, dpeditor, dppresentacion y vfvisor).
- Firmas: bajan junto con la trazabilidad o las observaciones. El PDF real de 20204-E1 tiene 5 páginas, igual que la vista previa.
- Sin permiso, «Calificar» no aparece, tampoco para un rol propio. Diana Cárdenas y los demás roles sin permiso siguen sin verlo.
- «Otro (describir)» elegido en el informe de 20204-E1 abre «Valor fuera de catálogo» en Conflictos.
- El PDF usa SIRIUS_SILUETAS: 20196-V1 mantiene sus 2 averías (Media y Baja) en la silueta SUV y empdfdiag muestra la cargadora. Al rasterizar los PDF reales, 0 % de los píxeles salen negros.
- Daños: 20141-V1 muestra 2 Propuestos con profundidad «Por confirmar»; al descartar el rayón queda 1. Ajustar con las flechas recalcula la superficie (2 → 2,9 dm²) y la gravedad (Media). La calificación no graba hasta revisar los daños, y cada cambio guarda quién y cuándo.
- Catálogos › Siluetas y zonas: 8 carrocerías × 4 vistas × 3 estilos; renombrar una zona exige motivo y queda en el historial. La Guía y el Mapa de captura funcionan en Vehículos livianos v1 y en Equipo y maquinaria v1.
- Las 10 escenas nuevas están en `KNOWN_ESC` (260) y en `datos-escenas.js`. A 1280 y 1920 no hay errores en ellas, en dp1diag ni en dp1veh, dp1aps, svflota, empdf, empdftarjetas, vfsec, vfvisor, form, formem, calcola y calveh.

**No verificado**
- La guía y el mapa en un celular real (llegan en 12b y 15) y el .zip de 20204 en esta etapa.

**Diferencias**
- 20141-V1: su avería del informe ahora sigue al daño detectado, que está Propuesto. No pasa a la grilla ni al PDF hasta revisarlo, por eso svsinveredicto baja de 7 a 6 páginas. Mientras tanto, la gravedad sale de la regla (Baja).
- El diagrama de Equipo y maquinaria solo aparece si hay averías, como en Vehículos. 20204-E1 no tiene, así que empdfdiag agrega una a mano en el cucharón. Para volver a 5 páginas compacté las filas de las tarjetas.
- El Mapa de captura es un bloque dentro de Pasos de foto, no una pestaña aparte. «Siluetas y zonas» quedó en el grupo Vehículos aunque incluye la maquinaria.
- El visor de fotos ya no pasa del alto de la pantalla (el panel lateral se desplaza) y las miniaturas con daños muestran «N daño(s)». La revisión de daños dura solo la sesión.

---

## 18/10/2026 · 20:30 — Etapa 8c

Etapa 8c publicada (Versión 60): cierra la fase B de Equipo y maquinaria.

**Verificado**
- Permisos: en 20204, con cada rol del selector y desde emflota, Inspector, Coordinador, Ejecutivo comercial, Finanzas y Finanzas de agencia no ven «Calificar inspección» (cabecera, pestaña, Bandeja, Calificación ni Inicio); Administrador y Ejecutivo de inspecciones sí. emflotains (Diana Cárdenas, Riesgos) no lo muestra.
- Presentación: Frase, Tabla y Tarjetas en el diseñador. empdftarjetas muestra Documentación 1, Mantenimiento 1, Uso sin novedades y Seguridad 1 (GPS «No», en rojo con ícono), sin partir tarjetas. Vehículos queda idéntico (misma huella en dp1veh, svpdq, dp1aps y svresumen).
- «Otro (describir)»: en solicitud, carga masiva e informe pide 5 caracteres o más; emotroconf muestra «Valor fuera de catálogo» con «Agregar al catálogo»; el PDF imprime la descripción.
- Descarga real: PDF de 20204-E1 (6 páginas) e Informes_20204.zip con 6 PDF; las páginas coinciden con la vista previa.
- Las 5 escenas nuevas están en `KNOWN_ESC` (250) y en `datos-escenas.js`, y el selector las encuentra. A 1280 y 1920 no hay errores en ellas ni en emflota, eminsp, emcalif, empdf, empdfaps, dp1veh, dpeditor, conflictos, embulk y emsolicitud. Corregí un desborde de 10 px en emotro (tooltip de «Agregar equipo»).

**No verificado**
- Los colores y el ícono de las tarjetas en otro lector de PDF distinto del de las pruebas; el texto cortado solo se revisó mirando capturas.

**Diferencias**
- Documentación dice «1 novedad», no 2: la bitácora en «No» cuenta en Mantenimiento, que es su grupo. Seguridad sí dice «1 novedad».
- emotro abre la solicitud y emotroconf la advertencia en Conflictos (dos escenas). «Valor fuera de catálogo» reemplaza el nombre anterior del conflicto, que decía «recibido por API».
- El informe con «Otro» no abre el conflicto, solo la solicitud. En el diseñador, Vehículos solo ofrece Frase. Un rol propio sin el permiso ve «Calificar» deshabilitado con su motivo, no oculto.
- empdf pasó de 5 a 6 páginas (la 3 solo lleva firmas). El .zip trae 6 PDF cuando E2 tiene su dictamen; en empdf sin dictamen trae 5.
- Al publicar, la herramienta sobrescribió 5 archivos con su versión anterior; los reconstruí y repetí barrido y auditoría por rol con los mismos resultados.

---

## 18/10/2026 · 20:30 — Etapa 8b

Etapa 8b publicada (Versión 58): Equipo y maquinaria ya califica por equipo en dos niveles, sugiere seguimientos desde los hallazgos, genera su PDF y su resumen para el APS, y la Nueva solicitud tiene una sección de equipos con carga masiva.

**Verificado**
- eminsp: Diana Cárdenas edita el VRN de 20204-E1. Con 120.000, la relación queda en 83 %, el valor real en USD 60.000,00 y la alerta sigue. La cabecera no muestra «Calificar inspección»: las acciones del caso salen de la matriz de permisos.
- «Ajustar VRN» pide un motivo de al menos 10 caracteres. Recalcula relación, alerta y hallazgos, y deja «Ajustado en calificación por Verónica Lema · 18/10/26 · 20:30» sin reabrir el informe.
- emflota (con teclado): «Ver informe» abre la pestaña Informe con ese equipo, y los chips cambian con las flechas, Inicio y Fin.
- Las grillas validan tipo, obligatoria, mínimo, máximo, formato y catálogo en dos lugares: en el informe en borrador (bloquean el envío y llevan el foco a la celda) y en la vista previa de Formularios.
- emcalif: E2 muestra «Derivación obligatoria a Suscripción» con la casilla fija y su motivo. Al grabar, E2 pasa a «En suscripción» y el caso a Ricardo Almeida. «Aplicar a otros equipos» deja el origen «Aplicado desde Caterpillar 966M XE».
- emsusc: el dictamen de Ricardo deja el caso en «Inspeccionado», y su cola «En suscripción» muestra E2 con «Derivación obligatoria».
- emsegsug: los 4 sugeridos esperados aparecen con su hallazgo y sus equipos (matrícula en E1 y E3). Aceptar, editar y descartar con motivo quedan en el historial. En Honorarios, «Revisión Máquina y Equipos» suma 3 equipos (USD 45,00) dentro de un total de USD 166,00, con la movilización por definir.
- empdf: el informe de E1 abre con el infraseguro y muestra USD 100.000,00, USD 385.000,00, USD 192.500,00 y 26 %, con la regla proporcional explicada. Los componentes van por excepción y no hay silueta. empdfaps no tiene valor real ni reglas. El panel ofrece «Todos los equipos» (.zip) y el diseñador edita los dos documentos.
- emsolicitud y embulk: todo se elige del catálogo y la serie sin PIN entra con aviso. Probé un .xlsx real con las columnas en otro orden: se mapearon por encabezado y una fila salió con sus errores. La plantilla trae listas desde la hoja «Catálogos». Registrar creó un caso de 5 equipos.
- Las 8 escenas están en `KNOWN_ESC` (245) y en `datos-escenas.js`, y el selector las encuentra desde formem. A 1280 y 1920 no hay errores, ni en ellas ni en eminforme, emvrnsin, emflota, emfotos, calcola, ns3v, nsbulk, dp1veh, dp1aps, svpdq, dprg y formem. Vehículos y Ramos Generales muestran el mismo texto que antes.

**No verificado**
- La descarga real del PDF y del .zip de equipos: probé la vista previa paginada, no el archivo.

**Diferencias**
- Con un VRN de 120.000 la relación es 83 % y la alerta no se quita, porque 83 % sigue siendo infraseguro (umbral de 90 %). Solo se quita con un VRN de 111.111 o menos. Respeté la regla de los datos.
- Cambios en pantallas aprobadas: eminforme y emvrnsin muestran la barra «Informe en PDF», emflota tiene la columna Acciones y formem tiene la pestaña «Documento PDF».
- El resumen para el APS muestra suma asegurada, VRN y relación con la recomendación. La solicitud no ofrece «Otro (describir)» porque exigiría texto libre.

---

## 18/10/2026 · 20:30 — Etapa 8a-b

Etapa 8a-b publicada (Versión 57): el selector de escenas ya encuentra todas las escenas, Grupos de ramo muestra el impacto al crear y deja eliminar solo los grupos vacíos, y Formularios tiene un editor de grillas con columnas tipadas, filas y vista previa.

**Verificado**
- Desde formem el selector encuentra eminforme, emvrnsin, emflota, emfotos, grupos, formem y las 4 escenas nuevas; con Enter abre eminforme. Si una pantalla no trae el registro, el selector lo carga al abrirse (lo probé quitándolo).
- grupocrear: el panel muestra «Nuevo grupo sin ramos ni casos; aparecerá en Catálogos › Ramos para asignarlo». Al guardar, el grupo nuevo se elimina con motivo desde ⋯ y desaparece también de la configuración.
- En Vehículos y Ramos Generales, «Eliminar» queda deshabilitado con el tooltip «Grupo del sistema: nunca se elimina. Tiene N ramos y M casos activos». grupoeliminar abre la confirmación de «Ingeniería» con su motivo.
- grillaeditor: el campo «Registro de revisiones» (claves em_descripcion, em_fecha, em_estado) acepta columnas de Moneda, Número, Sí/No, Catálogo maestro y Foto con claves em_…. La vista previa las muestra con su control y valor de ejemplo, y Bajar y arrastrar reordenan las columnas.
- grillafijas: las 7 filas de Estado por componentes se agregan, editan, reordenan y quitan.
- Neumáticos, extras, averías, verificaciones externas y las grillas de los módulos de Ramos Generales (Procesos, Equipo electrónico) se ven con sus tipos reales sin cambiar sus datos.
- Un campo nuevo en Equipo y maquinaria nace como em_nuevo_campo, de tipo Texto y con «Sin precarga».
- grupocrear, grupoeliminar, grillaeditor y grillafijas están en `KNOWN_ESC` (237) y en `datos-escenas.js`. A 1280 y 1920, estas escenas y grupos, formem, form, formkm, eminforme, emvrnsin, emflota y emfotos no muestran [object Object], undefined, textos cortados ni desplazamiento de la página.

**No verificado**
- Un selector de escenas en pantallas abiertas fuera del Back-office: hoy solo el Back-office lo tiene.
- Que el informe y la captura usen las validaciones nuevas de columnas: por ahora viven en el constructor.

**Diferencias**
- La causa real del selector no era Formularios: las 4 escenas de 20204 tenían el área «Solicitudes», que no está en la lista de áreas, y el selector las descartaba en cualquier pantalla. Las pasé a «Informe» y «Bandeja y casos», y el selector ya no descarta áreas desconocidas.
- Las grillas guardan sus columnas como texto. El editor deduce el tipo y solo al editar guarda la versión con tipos junto a la de siempre. «Peligros (selección múltiple…)» se muestra como Lista propia.
- En el panel de propiedades, «Ninguna» pasó a «Sin precarga» para todos los campos sin precarga.

---

## 18/10/2026 · 20:30 — Etapa 8a

Etapa 8a publicada (Versión 55): Equipo y maquinaria ya tiene grupos y composiciones, catálogo de equipos, la plantilla «Equipo y maquinaria v1», valores con VRN y el caso 20204 con un informe por equipo. `datos-equipo-maquinaria.js` va tal cual y está en el inventario.

**Verificado**
- Catálogos › Grupos de ramo: Vehículos y Ramos Generales con composiciones, mezcla, niveles por defecto, ramos y estado. Las composiciones se ven en solo lectura. Editar o inactivar pide motivo y muestra el impacto (10 ramos, 4 casos activos y los ramos que quedarían fuera). Un grupo con casos no se elimina. La tabla de ramos ya mostraba grupo y tipo de objeto.
- Catálogos › grupo «Equipo y maquinaria»: categorías y tipos, marcas y modelos y referencias de VRN, editables con motivo. Lo que se edita llega a las sugerencias del informe.
- Formularios › «Equipo y maquinaria v1» (Equipo móvil): 11 secciones y 66 campos (grillas de componentes, averías e implementos), 21 pasos en 7 grupos (Presencial y Virtual guiada, sin autoinspección), extracción y aviso de PIN. Tiene vista de estructura.
- 20204-E1: suma asegurada USD 100.000,00, VRN USD 385.000,00, relación 26 % con «Infraseguro: asegurado al 26 % del VRN…» y valor real USD 192.500,00 (8 años, 50 %). E2: 92 % sin alerta y USD 132.600,00. E3: 90 %, USD 18.600,00 y «Serie sin formato PIN».
- Sin evidencia, el VRN queda «Por confirmar» y «Enviar informe» está bloqueado con su motivo. Hay sugerencias del catálogo y, con simulación activa, del motor de contexto externo.
- 20204 sale en la Bandeja («3 equipos») y en Calificación con 3 filas y SLA «6 h» en tiempo. El detalle muestra los equipos como una flota, el informe con secciones, valores y fotos (18 por equipo, con galería y el GPS de cada foto) y su historial.
- La resolución va por ramo → composición → grupo. Equipo y maquinaria: modelo horaHombre por ramo, 2 niveles por ramo y SLA de 16 h por grupo.
- grupos, equiposcat, formem, eminforme, emvrnsin, emflota y emfotos están en `KNOWN_ESC` (233) y en `datos-escenas.js`; form entra por prefijo. A 1280 y 1920, estas escenas, form, motoresvl, catalogoramos, bandejaexp, calcola, flujo y tarifarios no muestran [object Object], undefined, textos cortados ni desplazamiento de la página.

**No verificado**
- Comparación completa de todas las escenas contra la versión 53.
- Grabar la calificación de un equipo en la pestaña Calificación. Hoy solo cambian los textos a «por equipo».

**Diferencias**
- `modeloPorGrupo` ya no tiene «Equipo y maquinaria»: pasó a `modeloPorRamo` y `H.modeloDe` resuelve ramo → composición → grupo. Saqué el atajo del Back-office que trataba ese ramo como grupo; el resultado sigue siendo horaHombre.
- La cola de Verónica sube de 9 a 12. 20204 genera un honorario «Por liquidar»: horaHombre, 3 equipos por USD 45 y movilización «Por definir» (El Coca).
- No registré las 11 secciones como módulos de la Biblioteca para no mezclarlas con Ramos Generales; usan los mismos tipos de campo. La plantilla agrega además los datos de la inspección comunes.
- Catálogos ya no muestra el estado vacío «Aún no hay nada por aquí» debajo de tablas cortas.
- El proyecto no tiene un mapa de captura de fotos que reutilizar: cada foto muestra su GPS en la galería. No creé un mapa nuevo.

---

## 18/10/2026 · 20:30 — Etapa 11b-c

Etapa 11b-c publicada (Versión 52): Daniela Ruiz tiene dos casos de ejemplo en Guayaquil (20202 por calificar y 20203 con revisión de control) y la escena nueva calcoladani.

**Verificado**
- Con Daniela: Por calificar 1 (20202, GSD4410 Toyota Fortuner 2024, «Vehículos de alto valor», «6 h» en tiempo) y Revisión de control 1 (GBF2290 de 20203, determinó Paola Vinueza, muestreo 25 %); no ve «Honorarios por aprobar». Con Verónica Lema la cola sigue en 9 (calcola). «Conforme» sobre GBF2290 baja el indicador a 0 y «Calificar» abre 20202 con «Volver a Calificación».
- Los dos casos traen informe enviado y 39 fotos cada uno (20202: 38 de 38 exigidas en Presencial y 7 de 7 documentos), visita de Paola Vinueza, historial y origen del veredicto. No generan honorario y el panel dice «Inspectora interna: sin honorarios».
- Bandeja del Administrador: 28 → 30 casos (En calificación 8 → 9); inicio de Daniela con 1 y 1; bandejaexp e inicioeje de Verónica sin cambios.
- calcoladani, calcola, calctl, inicioeje, bandejaexp y demousuarios están en `KNOWN_ESC` (226) y en `datos-escenas.js`; a 1280 y 1920 sin [object Object], undefined, textos cortados ni desplazamiento de la página.

**No verificado**
- Comparación completa de todas las escenas contra la versión 50: solo revisé las pedidas, calcolatodos y las que muestran honorarios.

**Diferencias**
- Con «Ver como otro usuario», la Bandeja del Ejecutivo ahora es la de ese usuario (Daniela ve sus 7 casos; antes veía los de Verónica).
- La nota de honorarios aparece también en casos de inspectores internos que ya existían: cal20196, calveh y calvehapply (Marco Tapia) y modcal (Paola Vinueza).
- Con «Todos» (calcolatodos) la cola sube a 10 riesgos y la revisión de control a 2. 20203 tiene un solo riesgo: su revisión se resuelve desde la cola (el ojo abre el informe). Corregí que, al volver de un caso, la primera pestaña elegida se revertía. El horario de 20203 (10:00–10:45) y su muestreo (25 %, el de Paola) son supuestos míos.

---

## 18/10/2026 · 20:30 — Etapa 11b-b

Etapa 11b-b publicada (Versión 50): Calificación tiene una sola columna «Acciones», «Riesgo» más claro, revisión de control con «Conforme» y «Con observación», vuelta a la cola, y el selector de demostración lista a todos los usuarios activos.

**Verificado**
- Una sola columna «Acciones» fija a la derecha en las 5 pestañas («Calificar», «Conforme» y «Con observación», «Revisar», «Ver» o «Editar», más el icono «Ver resumen» con tooltip y aria-label); solo «Caso» queda fijo a la izquierda y ninguna columna fija tapa a otra. «Asegurado» se lee completo, a 1280 (con desplazamiento horizontal) y a 1920.
- Riesgo: 20200 «Sede de la Alianza Francesa, Cuenca» con «Incendio y líneas aliadas» debajo; 20195 con «3 ramos: …»; 20189 «Sin placa» y «Toyota, Corolla Cross, 2026».
- «Con observación» (calctlobs, PCX2207 de 20198): motivo enfocado al abrir, error con menos de 10 caracteres, vista previa de lo que recibe Diana Cárdenas, Guardar, Cancelar y Esc. «Conforme» registra sin ventana; «Deshacer» dentro de 5 s lo revierte y pasados los 5 s desaparece. Inicio de Diana con la retroalimentación (calctlret).
- «Calificar» abre el caso con «Volver a Calificación» y regresa a la misma pestaña, los mismos filtros y el mismo desplazamiento.
- Selector: 14 usuarios Activos por rol, con búsqueda; «Dan» deja solo a Daniela Ruiz; Andrea Salazar sale una vez con sus dos roles; Invitados e Inactivos no salen. Con Daniela las pestañas son Por calificar, Revisión de control y Calificados, sin «Honorarios por aprobar».
- calctlobs, calctlret, calcolaacciones, demousuarios, calcola, calcolatodos, calsusc, calctl, calhonor, calhist, calreasignar, ctlriesgos e inicioeje están en `KNOWN_ESC` (225) y en `datos-escenas.js`; a 1280 y 1920 sin [object Object], undefined, textos cortados ni desplazamiento horizontal de la página.

**No verificado**
- Comparación completa de todas las escenas contra la versión 49 (solo revisé las del módulo Calificación y las que usan la tabla).
- Lectores de pantalla reales: revisé roles y etiquetas, no los escuché.

**Diferencias**
- La columna «Acción» separada desapareció; «Marcar como revisado» de la pantalla de control ahora hace lo mismo que «Conforme».
- Daniela Ruiz tiene el rol Ejecutivo de inspecciones, así que sin «Honorarios por aprobar» se debe a su ficha (sin facultad), no al rol.

---

## 18/10/2026 · 20:30 — Etapa 11b

Etapa 11b publicada (Versión 49): Calificación tiene su página con la cola del calificador, revisión de control, honorarios por aprobar y calificados, reutilizando las pantallas y los datos de siempre.

**Verificado**
- Las 8 escenas nuevas (calcola, calcolatodos, calsusc, calctl, calctlobs, calhonor, calhist, calreasignar) y las que pediste (inicioeje, iniciosus, calrg, calveh, calvehapply, ctl, ctlriesgos, honordespues, bandejaexp) están en `KNOWN_ESC` y en `datos-escenas.js`; a 1280 y 1920 sin [object Object], undefined ni textos cortados.
- calcola: 9 riesgos de 7 casos por SLA (primero 20141, vencido hace 1 d); el inicio de Verónica Lema marca «Por calificar 9» y «Ver los 9» abre la página con «Mis riesgos». 20196 muestra 3 filas (PBA4521, GSE1098 y el Kia sin placa); «Calificar» abre el caso con GSE1098 enfocado.
- Indicadores filtran (Vencidos: 2 filas). Daniela Ruiz no ve «Honorarios por aprobar». Ricardo Almeida ve «En suscripción» (20137).
- Revisión de control: PCX2207 de 20198 (Diana Cárdenas, muestreo 10 %). «Con observación» exige motivo (mínimo 10 caracteres), llega al inicio de Diana y a «Revisiones de control» de su ficha; «Conforme» registra con la fecha del reloj.
- Honorarios: aprobar (USD 309,50), ajustar o devolver y aprobar después. Calificados: 20160 y 20199 editables; los emitidos, solo lectura.
- Reasignación del Administrador: 20188 y 20181 pasan a Daniela Ruiz con motivo e impacto, el SLA no se reinicia y queda en el historial.
- Niveles: los umbrales de dinero usan el campo común (55000,5 queda «USD 55.000,50»; «abc» marca error).
- Barrido de 250 escenas anteriores contra la versión 45: solo cambian `usuarioficha` (sección nueva) e `inicioeje` (muestra el riesgo). Inventario actualizado.

**No verificado**
- La emisión por el BPM real que cierra la edición en Calificados (se probó con los estados de los datos).

**Diferencias**
- 20196 está «Emitida» en los datos: calcola, calcolatodos y calreasignar la devuelven a calificación (ingreso de demo en `datos-flujo.js`); en Calificados queda solo lectura.
- Alertas de Ramos Generales solo para 20195 (único con datos del motor); «Llegó por» en Ramos Generales muestra «Sin facultad» (no hay facultad de RG en los datos); 20189 no tiene vehículo y aparece «Sin placa».
- «Calificar» abre el caso en Solicitudes con «Regresar a la bandeja»; «Marcar como revisado» del control antiguo ahora se registra como «Con observación»; calctlobs abre el inicio de Diana, donde llega la retroalimentación.

---

## 18/10/2026 · 20:30 — Etapa 11-c

Etapa 11-c publicada (Versión 45): moneda e IVA configurables, un solo campo de dinero con decimales y quién y cuándo liquida.

**Verificado**
- Las 7 escenas nuevas (confgeneral, confimpuestos, confmoneda, montodecimal, honorporliquidar, honorsinfacultad, honordespues) y las 10 que pediste (tarifarios, tarifarioeur, honorpropuesta, honorcalif, honoragencia, liqdetalle, facturagrupo, iniciofin, dp1veh, notifeditor) están en `KNOWN_ESC` (214) y en `datos-escenas.js` (257); en 1280 y 1920 sin [object Object], undefined, desbordes ni errores de consola.
- Montos: 12,5 y 12.5 se guardan como 12,5 (también 1.234,50 y 1,234.50); 12,555 avisa «Usa hasta 2 decimales». Al salir del campo se muestra con `formatoMonto`. En COP, 1234,5 se muestra «COP 1.235» (sin decimales); al volver a USD, «USD 1.234,50».
- IVA: una factura del 15/03/2024 usa 12 % (USD 20,16 sobre un subtotal de 18,00) y las de octubre de 2026, 15 % (USD 20,70). Una vigencia nueva cierra la anterior y un cruce se rechaza con su motivo; las facturadas conservan su IVA.
- Configuración general: el Administrador edita las tres pestañas; Finanzas solo Impuestos (Compañía y Moneda quedan en lectura).
- Liquidar después: 20198 (Eurosurvey) queda «Por liquidar» hasta que Carla Ponce lo liquida en lote; entonces pasa a «Por aprobar».
- Facultad: Daniela Ruiz solo ve «Aprobar después»; Verónica Lema ve «Aprobar» (tope USD 500), «Ajustar con motivo», «Devolver» y «Aprobar después». Con este último, 20195 queda «Por aprobar» en su inicio y en Liquidaciones › Honorarios.
- Barrido de las 250 escenas anteriores en 1280 y 1920: cambian 41 y todas por lo pedido («$» → «USD 0,00», Eurosurvey «Por liquidar», IVA con su fecha, 2 filas nuevas en Roles, etiqueta de Moneda en Campos); las otras 209 son idénticas.
- Datos tal cual: `datos-compania.js`, `datos-honorarios.js` (v1.1) y `datos-agenda-liquidaciones.js` (v1.2) son copias idénticas de lo que subiste. Inventario actualizado (DEC-139).

**No verificado**
- El PDF descargado de verdad (solo la vista previa, ya con USD) y otras monedas en cada pantalla (probé COP en memoria).

**Diferencias**
- Los costos de IA de Motores de IA siguen en USD fijo; los textos «(USD)» de `datos-salida-veh.js` y `datos-notificaciones.js` quedan como vienen (el código usa los valores reales).
- Eurosurvey tiene un solo honorario (20198), así que el lote de Carla es de 1. Su liquidación pasa directo a «Por aprobar»: es la validación de la agencia.
- Las filas «Configurar compañía y moneda» y «Configurar impuestos» de Roles se agregan al cargar; `datos-usuarios.js` no cambió. En Niveles, los umbrales de dinero siguen con campo numérico (se muestran con `formatoMonto`).

---

## 18/10/2026 · 20:30 — Etapa 11-b

Etapa 11-b publicada (Versión 38): calculadora de honorarios con tarifarios, flujo del honorario y de la factura, rol «Finanzas de agencia» y el foco de las ventanas corregido.

**Verificado**
- Las 8 escenas nuevas (tarifarios, tarifarioeur, honorpropuesta, honorcalif, honoragencia, facturagrupo, facturadevuelta, honorsubasta) están en `KNOWN_ESC` (207) y en `datos-escenas.js` (250). Con agendasemana, agendadia, agendamover, agendaok, liqdetalle, liqfactura, liquidaciones, mishonorarios, iniciofin, iniciocoo, iniciovacio, calrg y calveh, las abrí en 1280 y 1920: sin [object Object] ni undefined, sin desplazamiento horizontal ni errores de consola, y ningún badge, código o fecha cortado.
- Foco: la causa era el Modal del sistema de diseño, que volvía a enfocar en cada render; lo usaban Agenda, Liquidaciones y Mi perfil, y ahora usan SiriusModal, que enfoca solo al abrir. Escribí 18 caracteres en mover visita, retener, ajustar, guardar tarifario, propuesta y ajuste del honorario, Flujo (flujoslaedit), Garantías (gampliar), Usuarios (usuariosuspender) y Notificaciones (notifregla): ningún campo pierde el foco. En la versión 37, mover visita y retener lo perdían en la primera letra.
- 20195 se calcula por hora-hombre como Inspector Riesgos Básicos (el nivel máximo del contrato de Luis):
  - Visita: 09:08–12:02 sin la pausa de 10:12–10:38 = 2 h 28 min → 2 h 30 min × USD 50 = USD 125.
  - Redacción: sin sesiones medidas, usa la referencia de 1 h 30 min × USD 15 = USD 22,50.
  - Equipos: 11 equipos (5 filas de rg_ee_equipos) = USD 162; con 16 equipos, USD 220.
  - Movilización: Manta queda fuera de su ciudad base (Quito), así que sale «Por definir» y no suma.
  - Total: USD 309,50.
- Flujo probado: Luis ajusta a USD 400 con motivo (+29,24 %, «Revisar», «Por aprobar»). Si se devuelve, aparece «Revisar propuesta» en su inicio. Carla Ponce valida 20198 → «Por aprobar»; al aprobarlo entra en la liquidación de octubre de Eurosurvey (USD 37,95). Tope del Ejecutivo: USD 500. Subir el básico a USD 55 muestra un impacto de USD 309,50 → 322,00.
- Factura: agosto (subasta, USD 207,00) + octubre (USD 20,70) = USD 227,70 en una sola factura. Un valor que no coincide se explica y no se envía. Al devolverla, la liquidación queda «Factura devuelta» y aparece «Corregir factura» en el inicio de Luis. Si la carga Finanzas, sigue «Factura devuelta» hasta que Luis la confirma.
- Visitas: 20145 con Jorge Pazmiño (20/10 10:00, «Confirmada») y 20137-G1 con Cristian Vaca (19/10 09:00, «Sin respuesta» por la regla de las 17:00, también en iniciocoo).
- Barrido de las 242 escenas anteriores en 1280 y 1920: solo cambian por lo pedido (panel Honorarios en las calificaciones de 20195 y 20198, Usuarios 17 y Roles 8, Cristian Vaca en Garantías y en el correo de ejemplo, «Sin respuesta», Agenda y Liquidaciones). El resto de las diferencias son del momento de carga de los PDF.

**No verificado**
- La carga de un archivo real de factura (solo se guarda el nombre) y el arrastre con mouse real.

**Diferencias**
- Escenas ajustadas: iniciovacio pasa a Paola Vinueza y agendadia a Cristian Vaca. agendaok mueve 20145 de Jorge a Luis Andrade, que también cubre Ambato. liqfactura ahora la abre Luis, y liqtarifas muestra Configuración (las tarifas pasaron a Tarifarios). En inicioins, Marco Tapia ya no tiene visitas próximas.
- Las fotos dan 2 h 28 min de visita y el ejemplo del archivo dice 3 h (09:00–12:00). La redacción no tiene sesiones registradas, así que uso la referencia.
- Estados iniciales derivados del caso: 20160 Aprobado, 20195 Por aprobar y 20198 Por validar en la agencia. Por eso la liquidación de octubre de Luis solo tiene 20160 (USD 20,70) y la de Eurosurvey no aparece hasta aprobar 20198. El honorario de subasta (20172) y la liquidación de agosto son un ejemplo en memoria.
- El Ejecutivo de inspecciones ahora ve Liquidaciones, solo con la pestaña Honorarios, porque la matriz le da «Aprobar honorarios».

---

## 18/10/2026 · 20:30 — Etapa 11

Etapa 11 publicada (Versión 37): Agenda, Liquidaciones e inicio de Finanzas; «Ver agenda» y «Ver reportes» ya vienen en datos-usuarios.js v1.2 (sin parche) y la confirmación de visitas sale de SIRIUS_AGENDA.

**Verificado**
- Las 10 escenas nuevas (agendasemana, agendadia, agendamover, agendaok, liquidaciones, liqdetalle, liqfactura, liqtarifas, iniciofin, mishonorarios) están en `KNOWN_ESC` (199) y en `datos-escenas.js` (242). Con iniciocoo, inicioins, coord, coordvis, bandejaexp y usuarios las abrí en 1280 y 1920: sin [object Object] ni undefined, sin desplazamiento horizontal y sin errores de consola.
- Agenda (semana del 19/10): 20137-G1 el lunes 09:00 «Por confirmar» y 20145 el martes 10:00 «Confirmada», los dos con Marco Tapia. El bloqueo de Marco del 21/10 de 13:00 a 17:00 se ve sombreado. Las vacaciones de Paola (26 al 30/10) también. El 02/11 y el 03/11 salen como feriados. Marco ve solo su agenda, en vista Día y sin «Mover».
- Mover 20145 al bloqueo de Marco del 21/10 a las 14:00 (arrastrando o con «Mover»): aviso con «Sin bloqueos» y «Zona» sin cumplir, y la visita no se mueve. Moverla a Jorge Pazmiño el 20/10 a las 10:00 cumple todo y pide motivo. La visita queda con Jorge, el SLA y el responsable lo siguen, y el cambio entra en el Historial de 20145. «Abrir en Coordinación» abre el caso en esa pestaña.
- Coordinador: «Para hoy» suma «Visita de mañana sin confirmar» de 20137-G1 (4 filas).
- Liquidaciones: las 3 de septiembre del historial y 2 de octubre abiertas. La de Luis Andrade suma 20160-R1 (ABC7733, USD 18,00) y 20195-R1/R2/R3 (Incendio, Robo y Equipo electrónico, USD 60,00 c/u), más USD 10,00 de traslado (Manta). Total: USD 208,00 + IVA 15 % (USD 31,20) = USD 239,20. Eurosurvey: 20198-V1 y V2 a USD 16,50 de convenio (USD 37,95).
- Flujo completo probado: retener y ajustar con motivo recalculan, cerrar, aprobar, factura de USD 300,00 explicada y bloqueada, factura correcta validada, «Enviar a pago» (CNX-12). En liqtarifas, RG Presencial a USD 65 muestra el impacto: USD 277,15 → 294,40.
- Inicio de Finanzas: 0 por aprobar, 0 esperando factura, USD 271,40 por pagar y USD 1.325,38 pagados en octubre. Sin pendientes muestra el corte del 31/10; en liqfactura aparece «Validar factura».
- Barrido de las 232 escenas anteriores en 1280 y 1920: solo cambian inicio, iniciocoo, notif y notifcom (la fila nueva). El resto de las diferencias son del momento de carga de los PDF.

**No verificado**
- El arrastre con mouse real (lo probé con eventos de arrastre en Chromium); ningún dato trae un enlace de autoinspección vigente (lo probé con uno en memoria).

**Diferencias**
- 20145 y 20137-G1 están asignadas a Marco Tapia, pero sus sucursales (Ambato y Manta) no están en sus zonas: cualquier movimiento suyo con Marco falla por zona.
- No aplico sola la regla de las 17:00 del día anterior («Sin respuesta»): 20137-G1 habría pasado a «Sin respuesta» a las 20:30 y se esperaba «Por confirmar». Cuenta como sin confirmar todo lo que no esté «Confirmada».
- El traslado se cobra si la sucursal del caso no está en las zonas del inspector, porque el archivo no define «ciudad base». La fecha de la línea es la determinación del riesgo, el envío del informe de RG o, si no hay, la visita.
- «Cerrar antes del corte» existe solo en el prototipo; liqfactura simula cierre, aprobación y factura de Luis. Agencias sin hechos en octubre (Andinas) no generan liquidación. Ajustes y retenciones se ven sin editar.

---

## 18/10/2026 · 20:30 — Etapa 9

Etapa 9 publicada (Versión 36): inicio por rol según SIRIUS_INICIO, menú de todos los roles desde la matriz, dominio asur.ec y los dos errores de consola corregidos.

**Verificado**
- Las 7 escenas nuevas (inicioadm, iniciocom, iniciocoo, inicioins, inicioeje, iniciosus, iniciovacio) están en `KNOWN_ESC` (189) y en `datos-escenas.js` (232). Con inicio, bandejaexp, filtros, conflictos, usuarios, roles, catalogoedit, catalogovehmod y catalogoramos las abrí en 1280 y 1920: sin [object Object] ni undefined, sin desplazamiento horizontal ni textos cortados.
- Administrador: 4 conflictos abiertos (los mismos 4 de Conflictos, solo advertencias), 2 invitaciones pendientes (1 vencida, Pedro Lasso, con «Reenviar»), 5 casos con SLA vencido y 0 integraciones con falla.
- Comercial: 24 casos activos; «Por crear orden de emisión» = 3 (20160, 20198 y 20199, con «Crear orden»); 1 garantía por vencer (20145) y 2 vencidas (20158 y 20178).
- Coordinador: «Por coordinar» = 3, con 20152 (vencido) primero y luego 20186 y 20190; 2 visitas de hoy y mañana; 0 enlaces por caducar; 0 visitas sin inspector. Al cambiar de Administrador a Coordinador, cambia el inicio.
- Inspector (Marco Tapia): 1 visita hoy, 2 informes por terminar, 0 devueltos y 2 próximas visitas. iniciovacio (Jorge Pazmiño): «Nada pendiente para hoy» y, como siguiente vencimiento, la visita de 20145 el martes 20/10 a las 10:00.
- Ejecutivo: 6 por calificar (los 2 vencidos primero), 1 revisión de control, 3 respaldos y 0 ampliaciones. Suscriptor: 20137 (1 h) en suscripción, la ampliación de 20178 por aprobar, 1 emitido por excepción y 0 calificados por él en el mes. Finanzas: saludo y Liquidaciones.
- Cada indicador abre la Bandeja (o Garantías o Usuarios) filtrada con su mismo número. Cada fila abre su pestaña: «Crear orden» va a Resumen y «Calificar» a Calificación.
- Barrido de las 225 escenas anteriores en 1280 y 1920: solo cambia lo esperado (dominio, inicio, filtro nuevo de Usuarios). Ya no aparecen el error «panel» ni el React #130 (antes salía en 17 a 21 escenas).

**No verificado**
- No probé otro navegador que Chromium ni un lector de pantalla.

**Diferencias**
- Menú (antes → ahora): Comercial pierde Calificación, Liquidaciones y Administración. Coordinador pierde Calificación, Garantías, Liquidaciones y Administración. Inspector pierde Nueva solicitud, Calificación, Garantías, Reportes y Administración. Ejecutivo y Suscriptor pierden Nueva solicitud, Liquidaciones y Administración. Administrador y Finanzas quedan igual.
- «Ver agenda» y «Ver reportes» no vienen en datos-usuarios.js v1.1: las agrega sirius-usuarios.js en memoria y deja de hacerlo cuando el archivo las traiga. Las escenas de Garantías sin rol abren como Administrador (gactiva suma un aviso); notif y notifcom quedan como Coordinador con el Inicio de fondo.
- Siguen decidiendo por rol fijo: las pantallas de Administración salvo Usuarios (isForms, isNiveles, isFlujo, isNotif, isConf…), canCoord, canCalRG, los permisos de Garantías y los filtros de la Bandeja por rol.
- Agenda y Calificación aún no tienen pantalla: sus indicadores abren la Bandeja filtrada. Faltan datos de confirmación de visitas y de endosos rechazados, así que esas filas no salen. Con la simulación activa, ninguna integración falla. iniciovacio asigna a Jorge la visita de 20145 que trae el archivo.
- Causas: React #130 = sirius-escenas.js dibujaba SiriusModal antes de que cargara sirius-modal.js; «panel» = Catalogos usaba el estado anterior, que el runtime no entrega. En notifeditsms, el SMS baja de 132 a 115 caracteres porque el enlace es más corto.

---

## 18/10/2026 · 20:30 — Etapa 10b

Etapa 10b publicada (Versión 34): Usuarios y roles (Usuarios, Roles y permisos, Agencias), invitaciones con Google o contraseña, Mi perfil con Gmail, y el remitente de los correos leído desde los usuarios.

**Verificado**
- Las 12 escenas nuevas están en `KNOWN_ESC` (182) y en `datos-escenas.js` (225). Con conflictos, notifcanales, notifprueba, bandejaexp, inicio y el login real (normal y con `?invitacion=`) las abrí en 1280 y 1920, sin [object Object] ni undefined, sin desplazamiento horizontal y sin Badges ni fechas cortados.
- 16 usuarios (13 activos, 1 invitado, 1 invitación vencida, 1 inactivo). Los conflictos de Gmail de Ricardo Almeida y Mónica Ríos siguen como antes. Al conectar Gmail Ricardo, su conflicto se cierra y su correo sale de su cuenta; al retirarlo se reabre.
- Invitar valida dominio, correo único y celular; deja «Invitado» con vencimiento a 72 h y una fila en la Bitácora. Reenviar invalida el enlace anterior («Este enlace ya no vale»).
- Suspender a Verónica Lema: 7 casos a cargo; no confirma hasta reasignarlos (a Daniela Ruiz) y queda en el historial. Quitar «Coordinador» a Andrea Salazar muestra 3 casos, 1 responsabilidad y que no queda otro coordinador.
- Rol duplicado «Ejecutivo comercial (copia)» sin «Crear solicitud manual»: muestra el impacto y su usuario pierde «Nueva solicitud» (menú y Bandeja).
- Acceso: «Continuar con Google»; bienvenida de Gabriela Torres; contraseña con reglas en vivo (Continuar queda inactivo con una incumplida); código 482913 lleva a «Todo listo» y deja a Pedro Lasso «Activo»; invitación vencida con «Pedir una nueva invitación».
- Logo de agencia subido en Inspecciones Andinas sale en el encabezado del PDF; sin logo queda el texto. Los enlaces de Conflictos (Reenviar invitación) y de la ficha del inspector (Niveles › Facultad) abren su destino.
- Las 213 escenas anteriores en 1280 y 1920: solo cambian 7 por los datos nuevos (Canales, «De:» de Marco Tapia, nota de Mónica, y una de PDF por el momento de carga).

**No verificado**
- Google y el envío de correos son simulados; no probé otro navegador que Chromium ni lector de pantalla.

**Diferencias**
- La matriz decide el menú y «Nueva solicitud» solo en roles propios; el menú de los 7 roles del sistema sigue como lo aprobado (Coordinador aún ve Calificación y Garantías). Siguen por rol fijo Niveles, Formularios, Flujo, Notificaciones, Conflictos y el resto de controles; Reportes (todos menos Finanzas) no tiene acción en la matriz.
- Facultades solo existen para Vehículos. Cambiar de escena reinicia los cambios de usuarios. El código es fijo (solo prototipo) y un interno que crea contraseña no lo pide. Nombre, correo y tipo no se editan tras invitar; revocar deja «Inactivo».
- Con los datos nuevos Canales muestra 11 cuentas, Marco Tapia envía desde su cuenta y Mónica dice «Debe volver a autorizar Gmail». Eurosurvey se muestra como «Logo del proveedor».
- `catalogoedit`, `catalogovehmod` y `catalogoramos` ya daban un error de consola («panel») antes; no lo toqué. El error React #130 aparece a veces igual en la versión anterior.

---

## 18/10/2026 · 20:30 — Etapa DP2-b

Etapa DP2-b publicada (Versión 32): el diseñador tiene condiciones en árbol con grupos y frase en vivo, logos con fondo claro u oscuro, pantalla completa idéntica a la vista previa, y Ramos Generales aplica estilo y logos desde la v2.

**Verificado**
- Las 4 escenas nuevas (`dpcondgrupo`, `dpcondmixta`, `dplogoder`, `dplogofondo`) están en `KNOWN_ESC` (170) y en `datos-escenas.js` (213). Con `dpeditor`, `dpcondicion`, `dpestilo`, `dpborrador` y `dprg` las abrí en 1280 y 1920, sin errores ni desplazamiento horizontal.
- Condiciones: Y se evalúa antes que O, los grupos llegan a 2 niveles y se desagrupan, cada fila tiene su conector y «Quitar», y todo funciona con teclado. Las de un solo conector dan el mismo resultado. En `dpcondgrupo` el Conductor habitual de 20196-V1 (28 puntos, licencia hasta 2028) no se muestra, y con «puntos < 30» sí; `dpcondmixta` dice «Se muestra si (… y …) o …».
- Logo a la derecha (PNG subido, fondo claro): se ve en la vista previa, en pantalla completa, en «Generar informe» y en el PDF descargado de 8 páginas. El contorno celeste sale en 1 bloque del editor y en 0 elementos de pantalla completa y de la salida; el PDF no lo trae.
- Logos: miré los 6 archivos y ninguno estaba al revés. Elegir «Aseguradora del Sur (fondo oscuro)» en el encabezado muestra el aviso, y «Usar» pone la versión clara. La base de Vehículos usa `ads-horizontal.png`.
- Ramos Generales: los PDF de 20195 en v1 (Resumen de 4 páginas e Informe técnico de 23) son idénticos byte a byte. Un borrador con logo derecho, márgenes de 18 mm y color propio sale con encabezado, 2 logos y pie «Plantilla de documento v2 · Código … · Página 1 de 23».
- De las 209 escenas anteriores, 198 quedan iguales; cambian solo las del diseñador (`dpeditor`, `dpcondicion`, `dpestilo`, `dpborrador`, `dppublicar`, `dprg`) y 5 salieron iguales al repetirlas. Las 6 escenas del PDF de Ramos Generales, `dp1veh`, `dp1diag`, `dp1sinhall`, `dp1aps` y `svflota` quedan iguales en texto e imagen; `form` y `notifeditor` solo cambian cuándo aparece el contador de la campana.

**No verificado**
- Otros navegadores y la carga real desde cdnjs; subir un SVG (solo probé PNG); la frase en vivo con lector de pantalla. Elegir una sección o un logo con clic solo funciona con puntero (con teclado se elige en la lista).

**Diferencias**
- Agregué el operador «caducada» (fecha anterior al reloj del prototipo) porque «licencia caducada» no se podía expresar. El contorno de selección no existía y lo creé (bloque, encabezado o logo seleccionado, solo en el editor). Un grupo de una sola condición no lleva paréntesis en la frase.
- Biblioteca: sumé `compania-oscuro`, `sirius-claro` y `sirius-oscuro`. `sirius-logo-oscuro.png` es un póster negro opaco (de ahí el «rectángulo oscuro» al elegir SIRIUS); queda marcado oscuro con su aviso. El encabezado se trata siempre como fondo claro.
- En Ramos Generales v2 el color principal solo pinta el encabezado. «BORRADOR» de la vista previa va centrado en la hoja, igual que en pantalla completa. Corregí `SalidaVeh` para que arme las páginas al llegar desde otra escena (antes quedaba en «Armando las páginas…»; pasaba también antes de esta etapa).

---

## 18/10/2026 · 20:30 — Etapa DP2

Etapa DP2 publicada (Versión 28): Formularios de inspección tiene la pestaña «Documento PDF» con el diseñador, Ramos Generales se arma con secciones del modelo y quedan aplicados los dos ajustes de DP1 (v1.3).

**Verificado**
- Las 8 escenas nuevas (`dpdocs`, `dpeditor`, `dpcondicion`, `dpestilo`, `dpborrador`, `dppublicar`, `dprg`, `dpnuevo`) están en `KNOWN_ESC` (166) y en `datos-escenas.js` (209). Las abrí en 1280 y 1920, sin errores ni desplazamiento horizontal. `datos-documentos-pdf.js` v1.3 está tal cual.
- `dp1veh`: Equipamiento trae «radio fijo, aros de aluminio…» y «Estado del vehículo» es un solo capítulo con 4 líneas. La página 2 sigue con el diagrama y su tabla.
- Ramos Generales: rg-resumen (9 secciones) y rg-informe (26) salen de `SIRIUS_SALIDA_RG`. Los PDF de 20195 (Resumen, 4 páginas; Informe técnico, 23) son idénticos byte a byte y las 6 escenas del PDF de Ramos Generales quedan iguales en texto e imagen.
- `dpborrador`: la vista previa trae «BORRADOR» y no trae Trazabilidad, mientras «Generar informe» la conserva. Al publicar con motivo, `dppublicar` anuncia «Quita la sección «Trazabilidad»» y nombra los 9 vehículos con informe enviado. Después de publicar, 20196-V1 ya no trae Trazabilidad, su pie dice «Plantilla de documento v2 · Página 1 de 8» y la descarga suma 1 PDF generado con la v2.
- Una base no se puede eliminar, y el único Vigente de un destino no se puede retirar (los dos con su motivo). Probé Agregar copiando veh-informe, Subir, Bajar, arrastrar, la condición con Y, Agregar sección, el contraste AA (#88CCFF da 1,73:1 y bloquea Publicar), subir un logo PNG y publicar un documento nuevo.
- `dprg`: con el borrador sin Linderos, la vista previa de 20195 ya no lo muestra, y la versión Vigente lo conserva.
- `dp1aps`, `svflota` (el .zip sigue con 6 PDF), `notifeditor` y `form` quedan iguales. `dp1diag`, `dp1sinhall`, `svpdq` y `svsinveredicto` cambian solo por la v1.3. Barrido de las 201 escenas anteriores: 190 quedan iguales, y además de las de la v1.3 cambian `formrg`, `formkm` y `formkmdel` por la pestaña nueva. En `notifsindato`, `gpolprueba20195` y `gpolpruebahotel` solo cambia el momento en que aparece el contador de la campana.

**No verificado**
- Otros navegadores y la carga real desde cdnjs. Tampoco probé subir un SVG (solo un PNG) ni el arrastre con lector de pantalla.

**Diferencias**
- Extras está entre las secciones de «Estado del vehículo» en el archivo, así que el capítulo se arma en la posición de la primera y Extras queda después.
- Calificación del riesgo y el Anexo del Informe técnico quedan como «personalizada» de solo lectura. Agregué los tipos `portada`, `indice` y `capitulo` a `tiposSeccion`. El estilo y los logos de los documentos de Ramos Generales se guardan, pero todavía no cambian su composición.
- «Plantilla de documento vN» sale desde la v2 para que la v1 de Ramos Generales siga idéntica. «PDF generados» cuenta los de la sesión (descargas, .zip y envío a emisión) y empieza en 0. La marca de agua del archivo no se imprime porque solo se genera con el informe Enviado; «BORRADOR» va solo en la vista previa del diseñador.
- Ajusté `sirius-pdf.js` para que la paginación respete la escala de la vista previa; con escala 1 el resultado no cambia. `dpnuevo` crea el documento al abrir la escena, y las bases dicen «Base del modelo» en Actualizado.

---

## 18/10/2026 · 20:30 — Etapa DP1

Etapa DP1 publicada (Versión 27): el PDF de Vehículos (Informe y Resumen para el APS) se arma ahora desde `SIRIUS_DOCUMENTOS_PDF` v1.2, con un renderizador por tipo de sección, el encabezado con logos y el pie verificable.

**Verificado**
- Las 4 escenas nuevas (`dp1veh`, `dp1diag`, `dp1sinhall`, `dp1aps`) y las 4 actualizadas están en `KNOWN_ESC` (158) y en `datos-escenas.js` (201). Las abrí en 1280 y 1920: sin «undefined», sin desplazamiento horizontal y ningún bloque se sale de su página. `datos-documentos-pdf.js` está tal cual.
- 20196-V1 coincide con `esperado`. La página 1 trae la tarjeta, el resultado (Calificado por Verónica Lema · regla −12,1 % · Emitido por excepción), 3 hallazgos (plaqueta panorámica ALTA; 2 averías con la puerta delantera derecha como la mayor y −12,1 % «posible sobreseguro», MEDIA) y los valores 29.700 / 26.100 con extras de 1.200. La página 2 trae neumáticos y testigos en una línea, el diagrama con su tabla y los extras con total USD 1.200. 20175-V1 (`dp1sinhall`) sale sin hallazgos, averías ni extras.
- `dp1diag`: medí las 5 vistas en el SVG y todas dan 292 de largo y 104 de ancho. La avería 1 (#b7791f, Media) sale en el lateral derecho y en la superior, y la 2 (#6b7a8c, Baja) en la superior y en la posterior. La tabla no se desborda. El SVG no tiene clases ni `<use>`, y en el PDF descargado las siluetas salen en color.
- PDF: el Informe de 20196-V1 tiene 8 páginas, igual que la vista previa. El Resumen (`dp1aps`) cabe en 1 página y no muestra reglas, excepción, verificaciones ni valores sugeridos. El .zip de 20196 sigue con 6 PDF (1 + 8, 1 + 6 y 1 + 5 páginas).
- Ramos Generales: los PDF de 20195 (Resumen e Informe técnico) son idénticos byte a byte. Las 6 escenas del PDF RG, `svbarra`, `vfsec`, `vfvisor`, `veh` y `crearorden` quedan iguales en texto e imagen; `vfvisor` en 1920 salió igual al repetirla.
- Las firmas dejan 16 mm de separación y 20 mm para firmar, en un bloque que no se parte. En la autoinspección (20196-V3) sale la declaración.

**No verificado**
- Otros navegadores y la carga real desde cdnjs. El espacio para el logo de la agencia solo lo comprobé en el modelo (20198-V1, Eurosurvey), porque no hay ninguna escena con agencia.

**Diferencias**
- Asegurado y Conductor van lado a lado, como en la maqueta. Cada sección del archivo conserva su capítulo numerado, y las de una línea van compactas en lugar de agruparse en «Estado del vehículo».
- Los hallazgos usan el texto del archivo («… (Media)»). F-n es la numeración de fotos del vehículo: las averías son F-45 y F-44, no F-12 y F-11. «Generado» usa el reloj del prototipo (18/10/2026 · 20:30).
- El registro fotográfico incluye también Motor y Airbags, que no están en `grupos`. Equipamiento no lista radio ni aros porque no son Sí/No. La columna Forma se oculta si no tiene datos. La trazabilidad solo muestra los eventos con fecha, y 20196-V1 no tiene fecha de emisión.

---

## 18/10/2026 · 20:30 — Etapa 10n-conflictos

Etapa 10n-conflictos publicada (Versión 25): hay un centro de conflictos en Administración › Conflictos. Los conflictos se calculan en vivo, inactivan o pausan solo lo afectado y vuelven solos al resolverse.

**Verificado**
- Las 5 escenas nuevas están en `KNOWN_ESC` (154) y en `datos-escenas.js` (197). Las abrí en 1280 y 1920, sin errores ni desplazamiento horizontal. `datos-conflictos.js` y la v1.3 están tal cual.
- Al cargar hay 0 bloqueantes. Las advertencias son las de Mónica Ríos (gmail_vencido) y la semilla de Meta, más las 2 que se explican en Diferencias.
- Al apagar `caso.poliza`, el impacto dice «Esto inactivará 1 plantilla (Garantías por vencer) y pausará R01, R02 y R03».
- Al confirmar se abre 1 bloqueante. `gar_recordatorio` pasa a «Inactiva por conflicto» (su estado base sigue Activa) y las reglas se pausan con tooltip. Llega el aviso a la campana y el contador del menú sube a 5.
- «Reactivar la variable» (enlace directo) lo pasa a Resuelto. La plantilla vuelve a Activa sola, se registran 4 entradas «Reactivada al resolverse el conflicto» y llega el aviso de resuelto.
- «Descartar» pide motivo y solo aparece en las advertencias. Inactivar un campo usado en una plantilla anuncia «Esto inactivará 1 plantilla (Aviso interno) y pausará R09 y R10».
- `conflictoeditor` muestra la franja roja con «Reactivar la variable» y «Ver dónde se usa».
- Datos v1.3: el nombre ya no genera aviso LOPDP; `compania.telefono` sale como «1800 737 787 (ejemplo)»; `riesgo.vin` de 20175 es MR0HA3FS8L0412736; `enlace_autoinspeccion` abre con 20196.
- Revisé las 192 escenas anteriores: 89 iguales y 93 que solo cambian en el contador de la campana. Otras 7 cambian por la v1.3 o por la franja de Meta (`notifvariables`, `notifvaroff`, `notifvar`, `notifvarerr`, `notifvarlopdp`, `notifsindato` y `notifeditwa`). Las 3 restantes salen iguales con una espera larga. `notifreglas`, `notifplant`, `notifeditor`, `notifbitacora` y `cpers` solo cambian en la campana.

**No verificado**
- No lo probé en otros navegadores ni con un registro real de envíos programados.

**Diferencias**
- Al cargar hay 4 advertencias, no 2. Ricardo Almeida tiene Gmail «Sin conectar» y 1 caso activo, y R06 avisa a clientes solo por WhatsApp y SMS: los dos cumplen la detección del archivo. Mónica Ríos no tiene casos a su cargo; la incluyo porque «Permiso vencido» cuenta siempre y el archivo la da como ejemplo.
- `caso.poliza` también está en WhatsApp y SMS, así que R02 se pausa en Correo y WhatsApp, y R03 en los tres canales; R01 solo en Correo.
- La campana recibe los avisos de inicio (4 al Administrador y 1 a Ricardo Almeida), por eso cambia su contador en 93 escenas.
- El 18/10/26 no hay envíos programados, así que la Bitácora todavía no tiene filas «Omitido · plantilla inactiva por conflicto». El estado se filtra con las pestañas, y los «filtros guardados» son los filtros por campo personalizado que estén aplicados en la Bandeja.

---

## 18/10/2026 · 20:30 — Etapa 10n-variables

Etapa 10n-variables publicada (Versión 23): Notificaciones tiene la pestaña Variables (el diccionario v1.2) y el editor ofrece y valida las variables según su disponibilidad y la LOPDP.

**Verificado**
- Las 6 escenas nuevas están en `KNOWN_ESC` (149) y en `datos-escenas.js` (192). Las abrí en 1280 y 1920, sin errores ni desplazamiento horizontal. `datos-notificaciones.js` es la v1.2 sin cambios.
- Hay 58 variables del sistema y 5 campos personalizados activos. Nacen no disponibles `asegurado.identificacion`, `riesgo.vin`, `riesgo.valorAsegurado`, `visita.inspectorCelular` y `campo.monto_credito` (su «ver» no es «Todos los roles»).
- Desactivar `caso.poliza` pide un motivo y muestra el impacto (1 plantilla y R01–R03). El cambio queda en el Historial. En `gar_recordatorio` la variable aparece «No está disponible» y la plantilla no se puede guardar. `{{caso.foo}}` se marca «No existe».
- Con la cédula activada, el selector no la ofrece en `gar_recordatorio`, que tiene destinatarios externos, y sí en «Aviso interno», que solo tiene destinatarios internos.
- `{{asegurado.correo}}` se inserta desde el selector y se resuelve con el correo del contacto (alfredo.mendoza@gmail.com en 20137-G1). `notifvarlopdp` muestra el aviso LOPDP sin bloquear el guardado.
- `notifsindato`: con 20137, la póliza se ve como el chip «Sin dato en este caso».
- Revisé las 186 escenas anteriores: 166 quedan iguales. Cambian 7 escenas de Notificaciones solo por la pestaña nueva, y 10 del editor por el chip y por `broker.nombre`. `motoresvlprueba`, `gpolpoliticas` y `gpolpruebahotel` salen iguales con una espera larga. `notifreglas` solo cambia en las pestañas; `cpers` queda igual.

**No verificado**
- No lo probé en otros navegadores ni con un lector de pantalla sobre el interruptor «Disponible».

**Diferencias**
- `enlace_autoinspeccion` abre con 20196, no con 20187. Ni la Bitácora ni el historial registran ese evento en 20187, que es presencial y no tiene enlace. 20196 tiene el enlace de autoinspección enviado el 16/10/26 a las 11:10.
- `broker.nombre` ahora es la persona del APS (por ejemplo, Lucía Vera) y la agencia pasó a `broker.agencia`.
- El aviso LOPDP también sale para `{{asegurado.nombre}}` en `gar_recordatorio`, porque R01 envía al Bróker.
- `compania.telefono`, `riesgo.vin` y `visita.inspectorCelular` no tienen fuente en los datos, así que siempre salen sin dato. `asegurado.celular` no lo usa ninguna plantilla, por eso el impacto de `notifvaroff` sale vacío.

---

## 18/10/2026 · 20:30 — Etapa 10n-plantillas-b

Etapa 10n-plantillas-b publicada (Versión 22): el editor de plantillas tiene vista previa ajustable, tablas de datos y libres, caso de ejemplo según la regla, y una guardia de salida que cubre el menú, las migas y el rol.

**Verificado**
- Las 6 escenas nuevas están en `KNOWN_ESC` (143) y en `datos-escenas.js` (186). Las abrí en 1280 y 1920, sin errores ni desplazamiento horizontal. `datos-notificaciones.js` es la v1.1 sin cambios.
- Separador: en 1280 empieza en 427 / 427 px. Con Flecha izquierda pasa de 427 a 411, con Mayús + flecha suma 64 px, Inicio y Fin van a los extremos, el doble clic vuelve a 427 y arrastrar 60 px lo deja en 367. El ancho queda en sessionStorage.
- Con 1280 px y la estructura visible: «Escritorio · 600 px · Ajustado al 61 %». En `notifamplia` se ve al 100 %; en `notifcompleta`, Esc y la X cierran la ventana y el foco vuelve a «Pantalla completa».
- `notiftablalibre`: las 5 filas salen con `th scope="row"`. `notiftablagrid`: encabezados de columna y de fila; Tab y Mayús + Tab recorren las celdas; filas y columnas se agregan y quitan; `{{caso.foo}}` en una celda bloquea «Guardar».
- En móvil, la tabla de garantías con 4 columnas se muestra como una tarjeta por fila.
- Ninguna de las 6 plantillas queda bloqueada por texto alternativo. La prueba por SMS usa 0991234567 por defecto y el aviso de SMS es `limites.sms.nota`.
- `notifcasoaviso`: 20178 muestra «faltan 0 días» y el aviso «no cumple la condición de R01: … lo tiene «Vencido»». El caso por defecto es el primero que cumple: 20137 (R01), 20158 (R04), 20137-G1 (R05) y 20175 (R12).
- Con cambios sin guardar, el menú lateral, la miga «Notificaciones» y el cambio de rol piden confirmación. «Seguir editando» se queda en el editor.
- Revisé las 180 escenas anteriores: 170 iguales. Cambian `notifcanales` (texto de la v1.1) y las 8 del editor (ya no hay bloqueo, cambia la disposición y el caso). `gpolprueba20200` sale igual con una espera larga. `notifreglas` y `notifbitacora` iguales; `notifeditsms` sigue en 1 → 2 segmentos.

**No verificado**
- Otros navegadores (la escala usa CSS `zoom`) y el arrastre con pantalla táctil.

**Diferencias**
- `notifeditor` ahora abre con 20137, que no tiene póliza («La póliza —»). La póliza de 20178 se ve en `notifcasoaviso`.
- Las reglas por evento (R07, R10, R11) no tienen condición de caso, así que cualquier caso las cumple: `enlace_autoinspeccion` toma 20137, sin placa.
- En las tablas de datos, Ramos solo trae puntaje y banda si la calificación se guardó en la sesión. La miga «Notificaciones» es un enlace mientras el editor está abierto.

---

## 18/10/2026 · 20:30 — Etapa 10n-plantillas

Etapa 10n-plantillas publicada (Versión 21): Administración › Notificaciones › Plantillas tiene un editor por canal con la vista previa de un caso, las variables, «Probar envío» y un guardado con motivo e impacto.

**Verificado**
- Las 8 escenas nuevas están en `KNOWN_ESC` (137) y en `datos-escenas.js` (180). Las abrí en 1280 y 1920, y también en 1100, donde la vista previa pasa a una pestaña. No hay errores ni scroll horizontal.
- `notifeditor`: el caso 20178 muestra la póliza POL-2026-113870 y una tabla con sus 2 garantías pendientes (la cumplida no aparece).
- `notifeditsms`: con el caso 20137 el SMS tiene 132 caracteres. Con «inspección» son 2 segmentos (70/67 por segmento) y sin la tilde, 1 (160).
- La encuesta (Borrador) muestra el botón «Responder la encuesta» con https://encuestas.aseguradoradelsur.com.ec/inspeccion. Una URL http:// bloquea «Guardar».
- `notifvarerr`: `{{caso.foo}}` queda marcado y «Guardar» no abre nada. `notifvar` lista los 5 campos personalizados activos.
- `notifprueba`: la prueba va a andrea.salazar@aseguradoradelsur.com.ec y la Bitácora suma «Prueba de plantilla» con el estado «Prueba».
- «Guardar» pide un motivo, muestra las reglas y los canales afectados, y registra el cambio en el Historial. «Volver» con cambios pide confirmación y deja el foco en «Editar · nombre».
- Al quitar el WhatsApp de gar_recordatorio aparece el aviso de que lo usan R02 y R03. Al editar un WhatsApp Aprobado se avisa que se crea una versión «En revisión».
- Imagen de 400 px: se carga con un aviso de ancho. El contraste AA se calcula en línea. Los bloques se reordenan arrastrando o con Subir y Bajar. Esc cierra cada ventana y devuelve el foco.
- Barrido de 172 escenas: solo cambian `notifplant` y `notifver` (texto y «Agregar plantilla») y `notifbitacora` (filtro «Prueba»). `notifreglas`, `notifregla`, `notifcanales` y `cpers` quedan iguales.

**No verificado**
- No lo probé en otros navegadores ni con la carga real desde cdnjs.

**Diferencias**
- El banner y el pie de las plantillas del archivo no tienen texto alternativo. Por eso «Guardar» queda bloqueado en 4 de ellas hasta que se escriba.
- Tu usuario no tiene celular en los datos, así que el destino de la prueba por SMS o WhatsApp empieza vacío.
- Con `segmentosSms`, ñ y é cuentan como GSM: el aviso de 70 caracteres solo sale con á, í, ó, ú u otros caracteres fuera de GSM.
- Salir por el menú lateral no pide confirmación; solo la piden «Volver» y recargar la página. En 20178 se ve «faltan -11 días» porque el plazo venció el 07/10.

---

## 18/10/2026 · 20:30 — Etapa VF

Etapa VF publicada (Versión 20): el PDF de Vehículos queda en una barra contraída con la vista previa en una ventana superpuesta, y las fotos y evidencias de Vehículos usan el componente de S5.

**Verificado**
- Las 7 escenas nuevas (`svbarra`, `calfoco`, `vfsec`, `vfgal`, `vfvisor`, `vfevid`, `vfdocs`) y `svpdq` están en `KNOWN_ESC` (129) y en `datos-escenas.js` (172). Las abrí en 1280 y 1920: sin «undefined» y sin desplazamiento horizontal.
- S5 pasó a `FotosEvidencias.dc.html`. Las escenas de S5 (`infrgev`, `infrgevcob`, `infrgfotosgal`, `infrgvisor`, `evcasorg`, `infrgdoc`) y las 6 del PDF de Ramos Generales quedan iguales en texto e imagen. Los PDF de 20195 son idénticos byte a byte.
- `svbarra`: la página de 20175 mide 1732 px. Esc y «Cerrar» contraen el panel y devuelven el foco a «Generar informe». La ventana atrapa el foco y al cerrarse lo devuelve a «Ver vista previa».
- Los PDF del SV siguen con las mismas páginas (13 y 2 de 20175; .zip de 20196 con 6). Solo cambia la foto lateral izquierda.
- Pasos: 42, sin ids repetidos. Cada vehículo con fotos gana la del lateral izquierdo de atrás, un minuto después (20188, Documental, no la exige). Ninguna foto se pierde.
- `vfgal` y `vfvisor`: 20196-V1 muestra sus 2 extras y 2 daños con enlace a su fila. Las fotos de Neumáticos, Extras y Averías se abren en el visor. `vfevid`: 20196-V3 (Autoinspección) da «20 de 20 · completo».
- `vfsec`: se puede confirmar, excluir con motivo y escribir una observación; el visor responde a Esc y a las flechas. La calificación de 20141 cuenta las fotos reales sin las excluidas. Un vehículo sin fotos muestra «Sin fotos registradas».
- `calfoco`: el título queda bajo el encabezado y con el foco, también con movimiento reducido.
- Barrido de 172 escenas: además de las nuevas, cambian `svpdq`, `svresumen`, `svflota` y `svsinveredicto`. En `veh`, `ctl`, `modcal`, `cal20196`, `calveh` y `calvehapply` solo cambia la barra.

**No verificado**
- Otros navegadores y la carga real desde cdnjs: revisa `svpdq` y `vfvisor` a mano.

**Diferencias**
- El foco en la sección se aplica en «Calificar», «Aplicar a otros vehículos», «Ver informe de…», los enlaces de CalificacionRG al informe y «Ver la fila…» de una foto.
- La calificación de un solo vehículo agrega el título «Calificación del vehículo · placa» y también toma las fotos reales.
- El panel «Evidencias» del formulario conserva su visor (zoom y campos extraídos).
- En el PDF, la foto del lateral izquierdo cambia de id (`…_de_a-1` a `…_de_ade-1`).
- `svsinveredicto` muestra la ventana encima del panel con el Resumen deshabilitado.
- Para excluir una foto, el motivo pide al menos 5 caracteres.

---

## 18/10/2026 · 20:30 — Etapa SV

Etapa SV publicada (Versión 19): salida en PDF de Vehículos, con un Resumen para el APS y un Informe de inspección por vehículo, desde «Generar informe» en las pestañas Informe y Calificación.

**Verificado**
- `svpdq`, `svresumen`, `svflota` y `svsinveredicto` están en `KNOWN_ESC` (122) y en `datos-escenas.js` (165); las abrí en 1280 y 1920, sin «undefined» ni desplazamiento horizontal de la página.
- Motor común `sirius-pdf.js`: las escenas del PDF de Ramos Generales (`calrgsalida`, `calrgemision`, `salrgtecnico`, `salrglinderos`, `salrgpci`, `salrganexo`) quedan iguales en texto e imagen, y los PDF de 20195 (Resumen de 4 páginas e Informe técnico de 23) son idénticos byte a byte, sin contar la fecha de creación.
- Los cuatro textos de `esperado` aparecen en el Informe de cada vehículo; en 20196-V1 la emisión por excepción, la regla y «Posible sobreseguro» salen solo en el Informe.
- `svflota`: `Informes_20196.zip` con 6 PDF (Resúmenes de 3, 2 y 2 páginas; Informes de 14, 12 y 9). `svresumen`: el Resumen de 20175 tiene 2 páginas. `svpdq`: el PDF tiene 13 páginas, igual que la vista previa.
- `svsinveredicto`: «Pendiente de calificación»; Resumen y Ambos quedan no disponibles (`aria-disabled`) y muestran el motivo en el tooltip y debajo de las opciones.
- «Enviar a emisión» (`crearorden`, 20160) registra como adjuntos `Resumen-APS_20160_ABC7733.pdf` e `Informe-de-inspeccion_20160_ABC7733.pdf`.
- Barrido de 165 escenas: `crearorden` y las demás siguen iguales; `veh`, `ctl`, `modcal`, `cal20196`, `calveh` y `calvehapply` solo agregan la barra «Informe en PDF».

**No verificado**
- La carga de html2canvas, jsPDF y JSZip desde cdnjs (bloqueada en mi entorno; probé con copias de las mismas versiones) y otros navegadores: revisa la descarga en `svpdq` y en `svflota`.

**Diferencias**
- Fotos principales: «Vista frontal», «Lateral izquierdo», «Parte posterior» y «Odómetro» se toman de los pasos Frontal, Lateral izquierdo de adelante hacia atrás, Posterior y Kilometraje.
- Con un vehículo y Ambos, «Descargar PDF» baja el documento de la pestaña visible. La barra se muestra a todos los roles salvo Inspector.
- «Extras sobre el casco» usa asegurado de extras ÷ asegurado del casco, como dice el archivo, y no la fórmula de la plantilla (sugeridos).

---

## 18/10/2026 · 20:30 — Etapa 10n

Etapa 10n publicada (Versión 18): Administración › Notificaciones (solo Administrador) con Reglas, Plantillas, Canales y Bitácora, leyendo todo de `SIRIUS_NOTIFICACIONES`; reemplaza a «Plantillas de notificación» en el menú.

**Verificado**
- `notifreglas`, `notifregla`, `notifnueva`, `notifplant`, `notifver`, `notifcanales` y `notifbitacora` están en `KNOWN_ESC` (118) y en `datos-escenas.js` (161, área Administración); las abrí todas.
- `notifreglas`: 12 reglas (1 inactiva); `notifplant`: 6 plantillas, `enlace_autoinspeccion` con WhatsApp «En revisión» y `encuesta` en Borrador, ambas con Badge de advertencia; `notifcanales`: Ricardo Almeida «Sin conectar» y Mónica Ríos «Permiso vencido».
- `notifregla` (R02): el canal SMS con `gar_vencidas` explica en línea que no tiene variante SMS; `notifnueva`: panel vacío con tipo «Por evento». `notifver`: `gar_recordatorio` en WhatsApp, solo lectura.
- `notifbitacora`: 7 envíos del caso 20178 (1 Fallido), con el motivo en el tooltip.
- Impacto calculado con los casos del Back-office para las 12 reglas; el de SLA usa horas hábiles y coincide con la Bandeja.
- Panel: cierra con X, Esc y clic fuera, y el foco vuelve al botón; los cambios duran la sesión (al recargar vuelve el dato de origen).
- DataTable (nuevo tipo `chips`): `bandejaexp`, `form`, `gpolmatriz`, `mcalcriterios`, `nivreg`, `motoresvl`, `flujo` y `cpers` iguales a la versión anterior en 1280 y 1920; las otras 154 escenas, sin cambios.
- 1280 y 1920: sin «undefined» ni [object Object]; borde derecho alineado en 1920; en 1280 el desplazamiento horizontal queda solo dentro de la tabla de Reglas.

**No verificado**
- Navegadores distintos de Chromium; revisa `notifreglas` y `notifbitacora` a mano.
- Editor de plantillas: no existe todavía (próximo envío); «Ver» abre solo la vista previa.

**Diferencias**
- Ninguna con lo pedido. El plazo de visita se lee de `SIRIUS_FLUJO.ingresos[id].visita`, porque las visitas no están en el estado del Back-office.

---

## 18/10/2026 · 20:30 — Etapa 16g-c

Etapa 16g-c publicada (Versión 17): la placa usa una sola regla (`SIRIUS_PLACA`, que lee `validacionesFormato` «placa») y el paso de vehículos abre vacío con «Agregar vehículo» y «Cargar desde Excel».

**Verificado**
- `nsvacio`, `ns3v`, `nsbulk`, `nsmarca`, `bandejaexp`, `veh`, `calveh` y `coord` están en `KNOWN_ESC` (111) y en `datos-escenas.js` (154).
- Barrido de 154 escenas contra la Versión 16: 129 iguales; 21 cambian solo el texto de las placas (`bandejaexp`, `bandejaaseg`, `filtros`, `veh`, `riesgosexc`, `coord`, `coordchoque`, `coordauto`, `coordvis`, `hist20196`, `modhist`, `ctlriesgos`, `crearorden`, `ctl`, `modcal`, `cal20196`, `calveh`, `calvehapply`, `calrgbandeja`, `cpersdet`, `cpersfiltro`); en Nueva solicitud, `ns3v` y `nsbulk` cambian el botón a «Cargar desde Excel», `nsmarca` además muestra «Cancelar», y `nsvacio` es nueva. Sin errores ni «undefined».
- Bandeja: 20141 muestra PBC3018; la búsqueda con «pbc-3018», «PBC 3018» y «PBC3018» lo encuentra, igual que el filtro Placa con «pbc 3018».
- `prueba-carga-vehiculos.xlsx`: 4 válidas y 4 con error, sin cambios; se guardan PCA1234, GBX7788 y MBC9001 (la fila 3 no tiene placa).
- `nsvacio`: archivo y luego GSE-1098 a mano → 5 vehículos (GSE1098). Si el archivo ya trae «gse 1098», el manual da «Placa repetida: ya está en el vehículo 1 de este caso.». PCD4821 y PB123C pasan; «PBC-301» y PB4-21 dan error.
- Plantilla con el ejemplo PBA4521 y los dos formatos en Instrucciones; al subirla, sus 2 filas son válidas. «Cancelar» del primer vehículo descarta sin guardar.

**No verificado**
- PDF de 20141: en el prototipo solo la Calificación de Ramos Generales genera PDF; el informe y el Detalle de 20141 muestran PBC3018. El campo Placa del informe viene de la solicitud y no se edita, así que su nueva validación no se probó en pantalla. Coordinación no tiene entrada de placa.

**Diferencias**
- Faltaba «Cancelar» en el formulario del primer vehículo (sin vehículos agregados), y el paso abría ese formulario solo. El modal de carga ya lo tenía al subir y en la vista previa.
- El aviso manual ahora dice «Placa repetida: ya está en el vehículo N de este caso.» (antes «Esta placa ya está…»).
- En la vista previa de la carga, una placa inválida se muestra tal como viene (PB4-21); las válidas, sin guion.
- También quité el guion de PBA-4521 en «Nueva solicitud revision.dc.html» (página de revisión antigua).

---

## 18/10/2026 · 20:30 — Etapa 16g-b

Etapa 16g-b publicada (Versión 16): la carga masiva lee el archivo real (.xlsx, .xls y .csv por encabezado) y «Descargar plantilla» genera un .xlsx con catálogos y validaciones.

**Verificado**
- `nsbulk`, `ns3v`, `ns4`, `nsmarca` y `cpersnueva` existen en `KNOWN_ESC` y en `datos-escenas.js` (153). `nsbulk`: 6 filas válidas y 2 con error (PB4-21 y Chery); `ns3v`, `ns4`, `nsmarca` y `cpersnueva` quedan idénticas; de 133 escenas solo cambia `nsbulk`.
- Los dos adjuntos (el CSV con otro orden de columnas) y su copia .xls dan 4 filas válidas (2, 3, 4, 7) y 4 con error: fila 5 placa con formato inválido, 6 marca fuera del catálogo, 8 año inválido, 9 falta Uso comercial. Como Ejecutivo comercial, la fila 2 entra con Monto del crédito USD 15.000,00 (se ve en la Revisión).
- Otros casos: «Falta la columna Marca» sin vista previa; «Se ignoró la columna Observaciones»; 201 filas dan error y 200 pasan; CSV con coma, comillas y BOM; varios errores de una fila separados por «;»; se usa la hoja «Vehículos» aunque no sea la primera.
- Plantilla descargada y abierta con ExcelJS: hojas Vehículos, Catálogos e Instrucciones; 6 validaciones por columna (Marca, Modelo con OFFSET/MATCH, Año 1980–2027, Cobertura, Uso comercial Sí/No, Monto 0–250.000); LibreOffice la abre; al subirla, sus 2 filas de ejemplo salen válidas. SheetJS se carga al abrir el modal y ExcelJS al pedir la plantilla.

**No verificado**
- Excel de escritorio (la lista dependiente de Modelo se comprobó solo en el XML y en LibreOffice); roles distintos de Ejecutivo comercial y Coordinador; las pruebas usaron copias locales de las dos bibliotecas, no el CDN real.

**Diferencias**
- Con el Coordinador (rol por defecto de las escenas) Monto del crédito prendario no entra: ese rol no puede editarlo, así que la columna se ignora con aviso, igual que en el formulario.
- `SIRIUS_CATALOGOS_MAESTROS` no tiene coberturas: la hoja Catálogos usa la lista de Nueva solicitud.
- Placa también es columna obligatoria; las filas de `demoBulk()` llevan Uso comercial «No» y la vista previa muestra los campos personalizados bajo cada vehículo; los importes aceptan 1.234,56 o 1234.56.

---

## 18/10/2026 · 20:30 — Etapa 16g

Etapa 16g publicada (Versión 15): Garantías con endosos al BPM, ampliación y cierre, leídos de `SIRIUS_SEGUIMIENTO`; Registrar exige Canal de venta.

**Verificado**
- `gendosos`, `gaprobar`, `gampliar`, `gcierre`, `gcola`, `gar`, `garpanel`, `gsolicitar`, `gresp`, `g1cal`, `g1det`, `notif`, `ns3v` y `nsbulk` están en `KNOWN_ESC` (110) y `datos-escenas.js` (153); las nuevas abren sin errores en 1280 y 1920.
- 20178: Vencido, solicitud de 20 días hasta el 27/10/26. Al aprobar (Ricardo Almeida) pasa a Pendiente con límite 27/10/26 y aparece «Modificación del plazo de garantías · Enviado»; rechazar pide motivo. Todo queda en el Historial.
- 20158: 2 endosos En cola. `gampliar` con 45 días: «La ampliación va de 1 a 30 días.»; por fecha calcula los días; con 10 días queda la solicitud para Verónica Lema.
- `gcierre`: «No vigente» deja «Cerrado por póliza no vigente»; «Vigente» no cierra y lo explica en línea. Esc cierra primero el panel lateral y el foco vuelve al botón.
- Endosos automáticos: dictamen del Suscriptor en 20137 → «Inclusión» En cola; CalificacionRG de 20195 → «Inclusión» con 3 garantías; calificar 20137-G1 → «Cumplimiento» En cola; cumplir g1 de 20178 → «Cumplimiento» Enviado. Un rechazado (dato inyectado) muestra el motivo y «Reenviar».
- `ns3v`: Registrar vuelve al paso 1 y marca Canal de venta. `nsbulk`: 6 filas válidas y 2 con error (PB4-21 y Chery).
- De 133 escenas cambian solo las de Garantías (pestañas y panel), `nsbulk`, `ns4` y `catalogovehcnx`, por lo explicado abajo.

**No verificado**
- Roles distintos de Ejecutivo comercial, Suscriptor y Ejecutivo de inspecciones; la respuesta del BPM (Aplicado o Rechazado) no tiene simulación en pantalla.

**Diferencias**
- 20145 (Agendado) conserva sus garantías: `gresp2` abre su panel y `notif` usa su aviso.
- En el Back-office, 20158 tenía g2 Cumplida; `SIRIUS_SEGUIMIENTO` dice que solo g1 se cumplió y la ampliación exige Pendiente o Vencido. La dejé Pendiente: 20158 pasa de Cumplidas a Vencidas (Vencidas 2, Cumplidas 0).
- Los modales abiertos desde el panel de Garantías quedaban debajo del panel (también «Marcar como cumplida» en la versión publicada): subí `--z-modal` a 1600.
- `ns4` ahora muestra «Falta 1 campo obligatorio» en Revisión (sin Canal de venta); `catalogovehcnx` muestra los 3 modelos nuevos del catálogo.
- El cierre usa un selector «Respuesta simulada del BPM» en su panel; la lista de Garantías ya venía filtrada para el Ejecutivo comercial.

---

## 18/10/2026 · 20:30 — Etapa 10c-c

Etapa 10c-c publicada (Versión 14): Marca y Modelo de Nueva solicitud salen del catálogo (combos con búsqueda), con los dos ajustes de campos personalizados.

**Verificado**
- `nsmarca`, `ns3v`, `ns1g`, `ns4`, `nsbpm`, `cpersnueva` y `crearorden` están en `KNOWN_ESC` (105) y en `datos-escenas.js` (148); abren sin errores.
- `nsmarca`: Marca Kia y 3 opciones de Modelo (Sportage, Sportage LX, Seltos). Modelo está deshabilitado sin marca; al cambiar la marca se limpia; texto libre no vale («Selecciona el modelo.»); la placa PCK-2210 precarga Hyundai y Tucson dentro del combo.
- CSV: «Kia;Picanto» da «modelo fuera del catálogo para esa marca»; «Daihatsu» da «marca fuera del catálogo»; «kia;SPORTAGE lx» y «Kía;Seltos» valen.
- BPM: con un modelo fuera del catálogo inyectado en 20141, el Detalle avisa «Revisar: no está en el catálogo de marcas y modelos»; hoy ningún vehículo de ejemplo está fuera.
- Como Coordinador, `ns3v` no muestra Monto del crédito. En Revisión salen los 3 vehículos con Uso comercial Sí. Con un vehículo sin Uso comercial, Siguiente y Registrar no avanzan y la lista marca «Falta Uso comercial».
- `ns3v`, `ns1g`, `ns4`, `nsbpm`, `cpersnueva`, `crearorden`, `veh`, `coord` y `filtros` salen idénticas a la versión anterior en 1280 y 1920. De 133 escenas solo cambia `nsbulk`.

**No verificado**
- Teclado completo del combo con lector de pantalla; roles distintos de Coordinador, Ejecutivo comercial y Administrador.

**Diferencias**
- `nsbulk` cambia por la nueva regla: del archivo de demo ahora son 4 filas válidas y 4 con error (Soluto, CX-30, Sail y Chery no están en el catálogo); antes solo fallaba la placa.
- Los vehículos de la carga masiva no traen Uso comercial: ahora piden completarlo antes de Siguiente.
- El caso de `ns3v` sigue sin Canal de venta (dato del paso 1); Registrar no lo exige, solo los datos de cada vehículo.

---

## 18/10/2026 · 20:30 — Etapa 10c-b

Etapa 10c-b publicada (Versión 13): `datos-campos.js` v1.1 tal cual; al crear no se bloquea nada por origen y el Detalle muestra «Recibido de <origen>» y el aviso «Revisar».

**Verificado**
- `cpersnueva`, `cpersapi`, `cpersdet`, `cpersfiltro`, `ns3v` y `n1` están en `KNOWN_ESC` (104) y en `datos-escenas.js` (147); abren sin errores.
- `cpersnueva` (Ejecutivo comercial): Canal de venta y Número de cotización editables; «Usa el formato COT-2026-004512» sale y se quita al corregir.
- El paso 4 muestra los Datos adicionales del caso y de cada vehículo.
- `cpersapi` (20187): «COT-26-5108 · Recibido de Sur One» con aviso «Revisar…»; corregirlo pide motivo, queda en el Historial y el aviso desaparece.
- 20186: «Bróker · Recibido de BPM de Emisión». `cpersfiltro` sigue en 5 casos.
- `ns3v`, `n1`, `veh`, `coord`, `bandejaexp` y `filtros` salen idénticas pixel a pixel en 1280 y 1920; de 133 escenas solo cambian `ns1g`, `nsbpm`, `crearorden` y `ns4`, por diseño (dos más variaron en una pasada y salieron idénticas al repetir).

**No verificado**
- Teclado completo y roles distintos de Ejecutivo comercial, Coordinador y Administrador.

**Diferencias**
- `cpersdet` (20141) no sale sin marca: «Agencia · Recibido de BPM de Emisión», porque 20141 tiene orden de emisión y cuenta como origen BPM. No cambié su origen; dime si debe ser Manual.
- Al crear se muestran todos los campos activos que aplican, sin filtrar por quién los ve.
- Los 3 vehículos ya cargados en `ns3v` no tienen Uso comercial y en Revisión salen «Sin dato».

---

## 18/10/2026 · 20:30 — Etapa 10c-consumo

Etapa 10c-consumo publicada (Versión 12): los campos personalizados se ven en Nueva solicitud, Detalle, Coordinación y Bandeja; todo se lee de `SIRIUS_CAMPOS`.
**0.** No puedo decir qué texto cambió: la medición de 16-b guardó solo longitudes. Hoy `calveh`, `calvehapply` y `g1cal` miden lo mismo que antes de 16-b (1458, 1312 y 930), estable en 12 cargas e igual con `datos-flujo.js` v1.1 o v1.2, con «6 h» y «1 d». No hay error que corregir; la medición de 16-b es la que se aparta.

**Verificado**
- `cpersnueva`, `cpersdet` y `cpersfiltro` están en `KNOWN_ESC` (103) y en `datos-escenas.js` (146); abren en 1280 y 1920 sin errores.
- `cpersfiltro`: 5 casos (20160, 20184, 20186, 20196, 20200); con Uso comercial = Sí, 2 (20196 y 20198).
- `cpersdet`: Agencia, COT-2026-004512 y, en PBC-3018, Uso comercial No y USD 18.000,00. 20160 y 20170 muestran «Código de campaña VERANO26 · Campo inactivo». Editar Canal de venta pide motivo y queda en el Historial; el Coordinador no ve Monto del crédito ni edita Canal.
- `cpersnueva`: «Usa el formato COT-2026-004512»; al corregir avanza. En `ns3v` el vehículo nuevo pide Uso comercial y al registrar queda en el caso nuevo (20197-V4).
- Coordinación de 20190 (Ramos Generales): pide Contacto de seguridad en sitio al agendar, valida 80 caracteres y lo deja en el Historial.
- `ns3v`, `n1`, `veh`, `coord` y `bandejaexp` salen idénticas pixel a pixel en 1280 y 1920; `filtros` cambia solo por los 2 filtros nuevos. De 133 escenas previas solo cambian, como se espera, `ns1g`, `nsbpm` y `crearorden`.

**No verificado**
- El paso 4 (Revisión) no muestra los Datos adicionales; teclado completo y roles distintos de Administrador, Coordinador y Ejecutivo comercial.

**Diferencias**
- La escena `nueva` no existe en el registro; revisé `ns3v`. La Bandeja no tiene «Más filtros»: los filtros van al panel «Filtrar».
- Corregí un error previo de Coordinación: Nombre, Celular y Correo del contacto no mostraban su casilla; sin eso no se podía pedir el Contacto de seguridad.
- `cpersnueva` usa Administrador (Número de cotización solo lo edita ese rol). Los campos del riesgo van en un bloque «Datos adicionales del vehículo N» bajo el formulario del vehículo.

---

## 18/10/2026 · 20:30 — Etapa 10c

Etapa 10c publicada (Versión 11): Administración › Campos personalizados (solo Administrador), después de «Formularios de inspección». `datos-campos.js` entra tal cual y se carga después de `datos-ejemplo.js`; la pantalla (`Campos.dc.html`) lee todo de `SIRIUS_CAMPOS`.
**0. Vencimiento de 20195:** no era un error de la app. 20195 está en calificación (16 h): `calcular` da 20/10 · 12:00 sin feriado y 21/10 · 12:00 con 19/10 feriado, como dices. El «22/10 · 17:00» salió de mi verificación anterior (registro sin ese estado y hora en UTC); el registro ya está corregido.

**Verificado**
- `cpers`, `cpersnuevo`, `cpersedit`, `cpersinact` y `cpershist` están en `KNOWN_ESC` (100 nombres) y en `datos-escenas.js` (143 escenas); abren en 1280 y 1920 sin errores ni «undefined». Migas «Administración › Campos personalizados»; el Coordinador no ve el menú.
- `cpersedit`: aplica a 9 casos activos de Ramos Generales y 7 quedan sin valor («No se bloquean; se pedirá al grabar»).
- Casos con valor, calculados del archivo: Canal de venta 12, Número de cotización 2, Uso comercial 5, Monto del crédito 2, Contacto de seguridad 2, Código de campaña 2.
- Agregar, editar, inactivar y ver historial funcionan con motivo, impacto y validación en línea; el panel cierra con X, Esc y clic fuera y el foco vuelve a su botón; el tope de 4 filtros se explica en línea.
- Toqué DataTable (celdas atenuadas): bandejaexp, form, gpolmatriz, mcalcriterios, nivreg, motoresvl y flujo salen idénticas pixel a pixel; 133 escenas previas sin errores.

**No verificado**
- Reactivar con el tope de filtros lleno, teclado completo y otros roles distintos de Coordinador.
- `calveh`, `calvehapply` y `g1cal` difieren 2 a 13 caracteres de la medición de la etapa 16-b (SLA «6 h» y «1 d» correctos); no ubiqué la causa.

**Diferencias**
- Canal de venta 12 (esperabas 14) y Uso comercial 5 casos (esperabas 6; son 7 riesgos): salen del archivo, no los ajusté.
- «Casos activos» excluye los casos hijos de garantías (-G1…): sin eso, Ramos Generales daría 13 y no 9.
- «Pantallas donde aparece» es regla mía (el archivo no la trae): Detalle siempre; Nueva solicitud si es «Nueva solicitud» u «Opcional»; Coordinación; Filtros de la Bandeja.
- El tipo «Catálogo maestro» lista `SIRIUS_CATALOGOS_MAESTROS` (no existe `SIRIUS_CATALOGOS`); la lista de roles está en el componente.

---

## 18/10/2026 · 20:30 — Etapa 10c (detenida)

**Vencimiento de 20195 en `flujoferiado`:** no era un error de la app sino de mi verificación. 20195 está en «Pendiente calificación» (Ramos Generales, 16 h): sin feriado vence el 20/10 · 12:00 y con 19/10 feriado, el 21/10 · 12:00 (calculado con `SIRIUS_FLUJO.calcular`, hora local). Lo que informé (22/10 · 17:00) usaba el registro sin ese estado (24 h) y leía la hora en UTC. Corregido arriba.

**Etapa 10c no iniciada:** el adjunto de este mensaje fue `datos-flujo.js` (idéntico a la v1.2 ya publicada), no `datos-campos.js`. No hay `SIRIUS_CAMPOS` en el proyecto, así que no construí la pantalla ni las escenas `cpers*` para no inventar datos.

---

## 18/10/2026 · 20:30 — Etapa 16-pantalla-b

`datos-flujo.js` v1.2 reemplazado tal cual; `Flujo.dc.html` sin el cambio a `esHabil` ni el envoltorio de `calcular`: «Agregar feriado» solo agrega a `SIRIUS_FLUJO.calendario.feriados` (con sucursal si el alcance es Sucursal). Los paneles de feriado, SLA y responsables cierran con X, Esc y clic fuera, y el foco vuelve al botón que los abrió.

**Verificado** (escenas comprobadas en `KNOWN_ESC` y `datos-escenas.js`: flujoferiado, flujosla, flujoresp, bandejaexp, inicio)
- `flujoferiado`, 19/10/26 nacional: 20145 «1 d» → «4 h» y 20137-G1 «3 h» → «2 h». Solo sucursal Manta: cambia la etiqueta solo de 20137-G1 («3 h» → «2 h»). El vencimiento de 20195 pasa del 20/10 · 12:00 al 21/10 · 12:00 en ambos casos (corregido en la Etapa 10c: la cifra anterior salía del registro sin el estado que usa la Bandeja y de una hora leída en UTC).
- Paneles (feriado, SLA, Responsables): X, Esc y clic fuera cierran; el foco vuelve a «Agregar feriado» y a «Guardar cambios».
- Coordinador (`inicio`, rol Coordinador): el menú no muestra «Flujo y SLA».
- Regresión de 133 escenas sin errores.

**No verificado**
- El movimiento de vencimiento de 20137 no lo medí por separado (sí 20195 y las etiquetas).
- Foco al volver desde el menú ⋯ de Responsables: tras clic fuera quedó en «Editar · Cuenca»; Eliminar de feriados no probado.
- Otros roles, teclado completo y 1920 px.

**Diferencias**
- `inventario-proyecto.md` actualizado (v1.2, sin parche). «Locales» ya no existe: todos los feriados están en un solo arreglo.

---

## 18/10/2026 · 20:30 — Etapa 16-pantalla

Administración › Flujo y SLA está publicada (Versión 8): menú después de «Niveles de calificación», migas, cabecera, filtro «Aplica a» (grupo de ramo) y las cinco pestañas, solo Administrador. Todo se lee de `SIRIUS_FLUJO`; no duplica datos. `DataTable` no se tocó.

**Verificado** (escenas del registro, abiertas en 1280 y 1920 sin errores ni «undefined»)
- `flujo`, `flujosla`, `flujoslaedit`, `flujocal`, `flujoferiado`, `flujoresp`, `flujotrans`: las 7 están en `KNOWN_ESC` (95 nombres) y en `datos-escenas.js` (138 escenas).
- `flujoslaedit`: Calificación · Vehículos de 8 a 6 h muestra exactamente 3 casos: 20181 «Vencido hace 7 h» → «Vencido hace 1 d»; 20188 «5 h» → «3 h» (En tiempo → Por vencer); 20189 «1 d» → «6 h».
- Al confirmar con motivo, la Bandeja muestra esos tres valores y el Historial lo registra; sin motivo no guarda.
- Casos activos por estado (calculados): 2, 2, 2, 6, 1, 8, 2 y 1; coinciden con la Bandeja. «Ver casos» abre la Bandeja filtrada por el estado.
- `flujoferiado`: 19/10/26 nacional cambia 2 vencimientos (20145 «1 d» → «4 h», 20137-G1 «3 h» → «2 h»).
- Regresión de 133 escenas: sin cambios de pantalla, título ni errores.

**No verificado**
- Roles distintos de Administrador (el menú oculta Flujo y SLA con la misma lista que Niveles): abrir `inicio` como Coordinador.
- Editar y eliminar feriado, feriado de sucursal, cambio de Suscriptor, filtro «Aplica a» en SLA y teclado del panel: no los ejecuté.
- En 1280 la tabla de Estados desplaza dentro de la tabla (Acciones fija); `flujotrans` y `flujoresp` en 1920 solo los revisé sin errores, no a simple vista.

**Diferencias**
- `datos-flujo.js` guarda los feriados en un conjunto fijo y no distingue sucursales; para que el feriado cambie los vencimientos, `Flujo.dc.html` cambia `esHabil` y envuelve `calcular` en memoria (el archivo no se tocó).
- Días y jornada son de solo lectura (no pediste editarlos). Coordinador y Suscriptor se editan escribiendo el nombre, porque los datos no traen lista de usuarios.
- El Historial solo trae los cambios de la sesión; no inventé entradas iniciales. `flujoferiado` abre con la fecha 19/10/26 puesta para mostrar el impacto.

---

## 18/10/2026 · 20:30 — Etapa 16-b · ajustes

Etapa 16-b publicada (Versión 7): `datos-flujo.js` v1.1 puesto tal cual; quité el `try/catch` de `finish()`; `regIngreso` se borró y los tres puntos llaman a `SIRIUS_FLUJO.registrarIngreso(id)`. Creé `registro-envios.md` y lo agregué al inventario.

**Verificado** (escenas `calveh`, `calvehapply`, `g1cal`, `coord` y `bandejaexp`, todas del registro)
- 20196: «6 h» en `calveh`, `calvehapply` y `coord`. 20137-G1 en `g1cal`: «1 d».
- Bandeja (Administrador): las 28 filas son idénticas a la etapa 16; 5 vencidos y 4 por vencer (20137-G1, 20166, 20200, 20137).
- Sin errores nuevos en consola en `g1cal` y `calveh`.

**No verificado**
- Casos creados o reabiertos en la demo con `registrarIngreso`: no los ejecuté.
- Solo revisé las cinco escenas pedidas, no las 133.

**Diferencias**
- Ninguna frente a lo esperado. Sigue pendiente de la etapa 16 la diferencia de 20195 («1 d» en vez de «2 d»), que no tocaste en v1.1.

---

## 18/10/2026 · 20:30 — Etapa 16 · datos de flujo, SLA y responsables

Etapa 16 está publicada como Versión 6: SLA y responsable ahora salen de `datos-flujo.js`. Salvo 20195 y la escena `calveh`, los resultados coinciden con lo esperado.

**Hecho**
- `datos-flujo.js` está copiado tal cual. Lo carga el Back-office antes de `datos-ejemplo.js`. Coordinación no muestra SLA ni responsable, así que no lo carga.
- `finish()` calcula `sla` y responsable con `SIRIUS_FLUJO`, y ahora también para los hijos como `20137-G1`. El Badge toma etiqueta, tono y tooltip del resultado.
- Quité todos los `sla` fijos, incluido `ov('20196', {sla: 6})`. 20200 pasó a «Verónica Lema». Los estados heredados se normalizan al cargar.
- `inventario-proyecto.md` tiene la fila nueva y una sección «Flujo, SLA y responsables».
- Revisé `bandejaexp`, `filtros`, `coord`, `n1` y `veh` (todas existen en el registro). Las medidas son con Administrador, salvo `coord`, `n1` y `veh`, que abren como Coordinador. El barrido de 133 escenas no muestra errores nuevos ni textos «undefined».

**Verificado**
- Vencidos (5): 20152, 20170, 20184 y 20141 con «Vencido hace 1 d»; 20181 con «Vencido hace 7 h». El filtro «SLA vencido» muestra esos 5 y el orden por SLA funciona.
- Por vencer: 20137-G1 y 20166 («3 h»), 20200 y 20137 («1 h»).
- En tiempo: 20186, 20145, 20187 y 20189 («1 d»), 20190 («2 d»), 20188 («5 h»).
- 20196 en `coord`: «6 h».
- Responsables: 20160, 20198 y 20199 → Santiago Ortiz; 20163, 20175, 20178 y 20196 → «—»; 20172 → Daniela Ruiz; 20137 → Ricardo Almeida.
- 20145 y 20137-G1 no tienen visita en Coordinación ni en los datos de ejemplo, así que no hay choque con el archivo.

**No verificado**
- Los casos creados, reabiertos o con hijos nuevos dentro de la demo: la lógica está, pero no los ejecuté.

**Diferencias**
- 20195 muestra «1 d», no «2 d». Está en Pendiente calificación (16 h, ingreso 16/10 12:00); «2 d» saldría si estuviera En curso (24 h). No toqué ni el archivo ni el estado.
- En `calveh` y `calvehapply`, 20196 pasa a «Vencido hace 1 d»; antes mostraba «6 h» por el valor fijo. Esas entradas de `escenas` son de la etapa coord, pero el caso está en calificación.
- El cambio de estado de 20145 es consecuencia de la regla del archivo, no del cálculo del SLA. Con la regla de Agendado, su responsable pasó de Andrea Salazar a Marco Tapia. Lo mismo ocurre con los hijos: 20158-G1, 20178-G1 y 20178-G2 ya no muestran al inspector, sino al ejecutivo.
- En `g1cal`, el archivo no trae `desde` para 20137-G1. `calcular` fallaba con ese caso y lo envolví en un `try/catch`, así que el caso queda sin SLA («—»).
- Los casos nuevos o reabiertos en la demo arrancan su reloj en el «ahora» del prototipo. Lo añadí yo (`regIngreso`, solo en memoria), porque `datos-flujo.js` no los conoce.
- 20200 ahora cuenta como Pendiente calificación (antes, por su estado heredado, no entraba en esa pestaña), y «En calificación» pasó de 6 a 7 casos.
