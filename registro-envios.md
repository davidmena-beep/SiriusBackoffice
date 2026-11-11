# Registro de envíos

Respuestas finales completas de cada envío, la más reciente primero. Fecha = reloj del prototipo (`SIRIUS_EJEMPLO.ahora()`).

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
