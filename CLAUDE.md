# SIRIUS · reglas persistentes del proyecto

## Patrón de Administración (regla vigente · 22/10/2026)
Reemplaza el ancho máximo de 1440 px y absorbe la variante "Tabla ancha". Aplica a toda pantalla nueva de Administración sin que se repita.

1. **Páginas con tablas o matrices:** el contenido ocupa todo el ancho disponible junto a la barra lateral, con los márgenes laterales del patrón y **sin ancho máximo**. Cabecera, pestañas y tabla quedan alineadas al mismo ancho.
2. **Formularios, editores y textos largos** (p. ej. Instrucciones de un motor) mantienen un ancho de lectura cómodo (≈ 900–980 px); no se estiran.
3. **La tabla ocupa el 100 % de su contenedor** (`<dc-import name="DataTable" fill="{{ true }}">`). Cada columna tiene ancho mínimo (`width` o `minWidth`); las de texto largo (nombre, alcance, activador, "Usado por", "También configurado en") llevan `flex: true` y se reparten el espacio sobrante en proporción a su mínimo. Texto hasta dos líneas y luego elipsis con tooltip; enlaces y Badges nunca se cortan (`nowrap`).
4. **Desplazamiento horizontal solo** cuando la suma de anchos mínimos no cabe, y siempre dentro de la tabla.
5. **Columnas fijas al desplazar:** la columna que identifica la fila y Acciones a la derecha. Si la primera columna es un código, el código y el nombre se fijan juntos (`sticky: true` en ambas; el componente suma los desplazamientos).
6. Bandeja: conserva sus anchos mínimos y columnas fijas aprobadas (no usa `fill`).
7. Se mantienen: cabecera en una fila (título, descripción, acción principal, Historial de cambios), pestañas, acciones de fila ("Editar" visible, "⋯" con el resto), todo cambio con motivo e historial.

## Regla de verificación (vigente · 23/10/2026)
Aplica a cada envío.

1. Al terminar cada envío, verifica tú mismo el resultado antes de responder; el usuario solo revisará a mano lo que no puedas comprobar.
2. Comprueba en el registro de escenas que existe cada escena que informes, y ábrela.
3. Calcula sobre los datos cada cifra que informes (totales, conteos, versiones); nunca la estimes.
4. En cada pantalla afectada revisa, en 1280 × 720 y en 1920 × 1080: que se vea lo pedido con los datos del archivo; que no haya [object Object], undefined ni textos vacíos; que las tablas sigan la regla de tablas fluidas (borde derecho en 1920; en 1280, desplazamiento solo dentro de la tabla con la columna que identifica la fila y Acciones fijas); que ningún Badge, código, placa ni fecha se corte; que los enlaces y escenas abran su destino; que las migas tengan la ruta completa; y que no haya cambios en pantallas que no se pidieron.
5. Si no puedes comprobar algo (un ancho, una interacción, un estado), no lo des por bueno: márcalo "No verificado" con el motivo y la escena para revisarlo a mano.
6. Si el envío pide "Verificación mínima", revisa solo los puntos 2 y 3 y marca el resto "No verificado".
7. Termina cada respuesta con este bloque, en español:
   - **Verificado:** lo comprobado, con la escena de cada punto.
   - **No verificado:** lo que no pudiste comprobar, con motivo y escena.
   - **Diferencias:** lo que no coincide con lo pedido o con los datos, sin corregirlo por tu cuenta.

## Reloj del prototipo (vigente · 24/10/2026)
1. Toda fecha u hora «actual» se obtiene de `SIRIUS_EJEMPLO.ahora()` o `SIRIUS_EJEMPLO.hoy()` (18/10/2026 · 20:30); nunca de la fecha del navegador. `new Date()` y `Date.now()` solo se usan para identificadores.
2. Ningún dato de ejemplo tiene fecha posterior al reloj, salvo plazos, vencimientos, vigencias y programaciones.
3. Las acciones de una sesión de demostración llevan la fecha y hora del reloj y se ordenan por el orden en que ocurren.

## Controles accesibles (regla vigente · 24/10/2026)
1. **Interruptores, casillas y opciones** se operan con teclado (Tab para llegar, Espacio para cambiar), tienen foco visible y anuncian su rol y estado. Hacer clic en su etiqueta también los cambia.
2. **Un botón que no aplica y tiene un motivo** no se desactiva con `disabled`: queda enfocable, no ejecuta la acción, se anuncia como no disponible (`aria-disabled`) y muestra su motivo en el tooltip al recibir foco y al pasar el mouse.
3. **Códigos, placas, fechas y Badges nunca se parten**, y se logra con estilo (sin salto de línea). Nunca se agregan caracteres invisibles ni se cambia el texto: al copiar un código se copia exactamente lo que se ve.

# Mudanza a Claude

Copia de las reglas vivas del proyecto, tal como están al cierre del envío E1, para llevarlas a otro entorno. Las reglas de arriba siguen vigentes; esta sección no las modifica. Reglas incluidas: Patrón de Administración (con las Tablas fluidas en los puntos 3 a 5), Regla de verificación, Reloj del prototipo y Controles accesibles.

### Patrón de Administración (regla vigente · 22/10/2026)
Reemplaza el ancho máximo de 1440 px y absorbe la variante "Tabla ancha". Aplica a toda pantalla nueva de Administración sin que se repita.

1. **Páginas con tablas o matrices:** el contenido ocupa todo el ancho disponible junto a la barra lateral, con los márgenes laterales del patrón y **sin ancho máximo**. Cabecera, pestañas y tabla quedan alineadas al mismo ancho.
2. **Formularios, editores y textos largos** (p. ej. Instrucciones de un motor) mantienen un ancho de lectura cómodo (≈ 900–980 px); no se estiran.
3. **La tabla ocupa el 100 % de su contenedor** (`<dc-import name="DataTable" fill="{{ true }}">`). Cada columna tiene ancho mínimo (`width` o `minWidth`); las de texto largo (nombre, alcance, activador, "Usado por", "También configurado en") llevan `flex: true` y se reparten el espacio sobrante en proporción a su mínimo. Texto hasta dos líneas y luego elipsis con tooltip; enlaces y Badges nunca se cortan (`nowrap`).
4. **Desplazamiento horizontal solo** cuando la suma de anchos mínimos no cabe, y siempre dentro de la tabla.
5. **Columnas fijas al desplazar:** la columna que identifica la fila y Acciones a la derecha. Si la primera columna es un código, el código y el nombre se fijan juntos (`sticky: true` en ambas; el componente suma los desplazamientos).
6. Bandeja: conserva sus anchos mínimos y columnas fijas aprobadas (no usa `fill`).
7. Se mantienen: cabecera en una fila (título, descripción, acción principal, Historial de cambios), pestañas, acciones de fila ("Editar" visible, "⋯" con el resto), todo cambio con motivo e historial.

### Regla de verificación (vigente · 23/10/2026)
Aplica a cada envío.

1. Al terminar cada envío, verifica tú mismo el resultado antes de responder; el usuario solo revisará a mano lo que no puedas comprobar.
2. Comprueba en el registro de escenas que existe cada escena que informes, y ábrela.
3. Calcula sobre los datos cada cifra que informes (totales, conteos, versiones); nunca la estimes.
4. En cada pantalla afectada revisa, en 1280 × 720 y en 1920 × 1080: que se vea lo pedido con los datos del archivo; que no haya [object Object], undefined ni textos vacíos; que las tablas sigan la regla de tablas fluidas (borde derecho en 1920; en 1280, desplazamiento solo dentro de la tabla con la columna que identifica la fila y Acciones fijas); que ningún Badge, código, placa ni fecha se corte; que los enlaces y escenas abran su destino; que las migas tengan la ruta completa; y que no haya cambios en pantallas que no se pidieron.
5. Si no puedes comprobar algo (un ancho, una interacción, un estado), no lo des por bueno: márcalo "No verificado" con el motivo y la escena para revisarlo a mano.
6. Si el envío pide "Verificación mínima", revisa solo los puntos 2 y 3 y marca el resto "No verificado".
7. Termina cada respuesta con este bloque, en español:
   - **Verificado:** lo comprobado, con la escena de cada punto.
   - **No verificado:** lo que no pudiste comprobar, con motivo y escena.
   - **Diferencias:** lo que no coincide con lo pedido o con los datos, sin corregirlo por tu cuenta.

### Reloj del prototipo (vigente · 24/10/2026)
1. Toda fecha u hora «actual» se obtiene de `SIRIUS_EJEMPLO.ahora()` o `SIRIUS_EJEMPLO.hoy()` (18/10/2026 · 20:30); nunca de la fecha del navegador. `new Date()` y `Date.now()` solo se usan para identificadores.
2. Ningún dato de ejemplo tiene fecha posterior al reloj, salvo plazos, vencimientos, vigencias y programaciones.
3. Las acciones de una sesión de demostración llevan la fecha y hora del reloj y se ordenan por el orden en que ocurren.

### Controles accesibles (regla vigente · 24/10/2026)
1. **Interruptores, casillas y opciones** se operan con teclado (Tab para llegar, Espacio para cambiar), tienen foco visible y anuncian su rol y estado. Hacer clic en su etiqueta también los cambia.
2. **Un botón que no aplica y tiene un motivo** no se desactiva con `disabled`: queda enfocable, no ejecuta la acción, se anuncia como no disponible (`aria-disabled`) y muestra su motivo en el tooltip al recibir foco y al pasar el mouse.
3. **Códigos, placas, fechas y Badges nunca se parten**, y se logra con estilo (sin salto de línea). Nunca se agregan caracteres invisibles ni se cambia el texto: al copiar un código se copia exactamente lo que se ve.
