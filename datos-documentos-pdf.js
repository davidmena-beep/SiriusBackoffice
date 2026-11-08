// SIRIUS · Documentos PDF de los formularios (v1.3 · provisional · etapa DP · 02/11/2026)
// v1.3: las listas compactas se agrupan en un capítulo «Estado del vehículo»; la lista de equipamiento incluye las opciones
//       que indican presencia (radio fijo, aros de aluminio); grupos de fotos completos.
// v1.2: diagrama en un solo lienzo con las 5 vistas a escala común y siluetas detalladas; tabla de averías debajo, a todo el ancho.
// v1.1: fotos referenciales frontal y posterior en la tarjeta; diagrama de averías con siluetas en 5 vistas según la
//       carrocería; espacio de firmas de 20 mm separado del contenido anterior.
// Modelo común del diseñador «Documento PDF» de Formularios de inspección (reemplaza a BO-27) y bases iniciales.
// Cada plantilla de formulario tiene uno o más documentos PDF; cada documento es una lista de secciones con reglas de
// visibilidad, estilo, logos y pie. Todo es editable: copiar, modificar, retirar o eliminar (si no se usó). Decisiones: DEC-125 y DEC-126.
// Bases: Vehículos (diseño nuevo de SIRIUS a partir de SIAERP, Eurosurvey y el formulario físico antiguo) y Ramos Generales
// (el diseño vigente del bloque S, expresado en este modelo sin cambiar su resultado).
window.SIRIUS_DOCUMENTOS_PDF = {
  version: '1.3', vigencia: 'Provisional',

  // ---------- Principios del diseño de SIRIUS (DEC-125) ----------
  principios: [
    'Primero lo que decide: la primera página responde «qué vehículo, qué resultado, qué hay que saber y cuánto vale». El detalle viene después.',
    'Por excepción: lo normal se resume en una línea («Testigos: todos apagados (7 revisados)»); solo se detalla lo que tiene novedad o valor. Nada de casillas «No» ni de piezas sin avería.',
    'Datos estructurados, no texto: los extras van en su tabla con valor y total, nunca solo en las observaciones; las verificaciones externas van como resultado, no como capturas de pantalla.',
    'Una consulta externa que falló se informa como «No disponible» con su fecha; no se imprime la página de error.',
    'Los cálculos los hace el documento (kilometraje por año, diferencias, totales) y nunca muestran un valor imposible: sin año de compra, el kilometraje por año dice «—».',
    'Toda foto y todo dato extraído muestran su respaldo (fecha, hora, GPS y dispositivo; fuente y confianza en el documento interno).',
    'Un campo vacío no se imprime; una sección sin contenido no aparece; los capítulos se renumeran sin huecos.',
    'El documento se puede validar: pie con «Página N de M», código de verificación y fecha de generación.',
  ],

  // ---------- Modos de visibilidad de un campo ----------
  modosCampo: [
    { id: 'siempre', nombre: 'Siempre', nota: 'Si está vacío muestra «—»' },
    { id: 'conValor', nombre: 'Solo si tiene valor', nota: 'Por defecto' },
    { id: 'excepcion', nombre: 'Solo si es relevante', nota: 'Valor desfavorable según la polaridad, distinto del esperado o con alerta' },
    { id: 'condicion', nombre: 'Según condición', nota: 'Expresión sobre otros campos, p. ej. veh_conductor_habitual = «Otra persona»' },
    { id: 'nunca', nombre: 'No imprimir' },
  ],

  // ---------- Tipos de sección del diseñador ----------
  tiposSeccion: [
    { id: 'encabezado', nombre: 'Encabezado', opciones: ['logos', 'titulo', 'datosCabecera'] },
    { id: 'tarjeta', nombre: 'Tarjeta de identificación', opciones: ['campos', 'destacado', 'fotosReferencia'], nota: 'Bloque grande con la placa o la ubicación y hasta 2 fotos referenciales' },
    { id: 'resultado', nombre: 'Resultado', opciones: ['mostrarOrigen', 'mostrarEmision', 'mostrarReglas'] },
    { id: 'hallazgos', nombre: 'Hallazgos relevantes', opciones: ['reglas', 'textoSinHallazgos'], nota: 'Se arma solo con las reglas de hallazgo' },
    { id: 'campos', nombre: 'Datos', opciones: ['campos', 'columnas', 'modoPorDefecto'] },
    { id: 'lista', nombre: 'Lista compacta', opciones: ['campos', 'textoTodosNormales', 'agruparEn', 'presentacion'], nota: 'Presentación: Frase, Tabla (dato | valor) o Tarjetas (2×2, una por grupo, con el chip «N novedades»; no se parten entre páginas). Equipo y maquinaria usa Tarjetas; Vehículos se queda en Frase. Convierte un grupo de Sí/No, de estados o de opciones en una frase: «Tiene: …» o «Todos apagados». Una opción cuenta como presente si no es «No», «No tiene» ni «Ninguno» (radio «Fijo» → «radio fijo»; aros «Aluminio» → «aros de aluminio»). Las listas seguidas con el mismo agruparEn forman un solo capítulo con una línea por lista.' },
    { id: 'tabla', nombre: 'Tabla', opciones: ['grilla', 'columnas', 'totales', 'resumirSiUniforme'] },
    { id: 'valores', nombre: 'Valores', opciones: ['mostrarDiferencias', 'mostrarAlertas'] },
    { id: 'diagrama', nombre: 'Diagrama de daños', opciones: ['vistas', 'siluetaSegunCarroceria'], nota: 'Siluetas de la biblioteca SIRIUS_SILUETAS (estilo «pdf») en 5 vistas, según la carrocería o el tipo de equipo, con las averías numeradas en su zona y en su color de gravedad; solo si hay averías (etapa 12a)' },
    { id: 'verificaciones', nombre: 'Verificaciones externas', opciones: ['fuentes', 'anexarEvidencia'] },
    { id: 'texto', nombre: 'Texto', opciones: ['contenido (con variables)'] },
    { id: 'lineaTiempo', nombre: 'Línea de tiempo', opciones: ['eventos'] },
    { id: 'fotos', nombre: 'Fotos', opciones: ['grupos', 'porFila', 'tamaño', 'leyenda'] },
    { id: 'firmas', nombre: 'Firmas o declaración', opciones: ['segunModalidad', 'espacio'], nota: 'Bloque que no se parte entre páginas; 16 mm de separación del contenido anterior y 20 mm de espacio para firmar sobre cada línea' },
    { id: 'salto', nombre: 'Salto de página', opciones: [] },
    { id: 'seguimientos', nombre: 'Seguimientos del caso', opciones: ['soloAceptados'], nota: 'Equipo y maquinaria: los seguimientos sugeridos desde los hallazgos que se aceptaron en la calificación' },
  ],

  // ---------- Logos (Formularios › Documento PDF › Logos) ----------
  logos: [
    { id: 'compania', nombre: 'Aseguradora del Sur', archivo: 'assets/ads-horizontal.png', tipo: 'Compañía', uso: 'Encabezado de todos los documentos' },
    { id: 'sirius', nombre: 'SIRIUS', archivo: 'assets/sirius-logo-oscuro.png', tipo: 'Plataforma', uso: 'Pie («Generado con SIRIUS»), opcional' },
    { id: 'proveedor', nombre: 'Agencia de inspección', archivo: null, tipo: 'Agencia', uso: 'Encabezado, a la derecha, cuando inspeccionó una agencia (Eurosurvey, Inspecciones Andinas, Peritajes del Pacífico); cada agencia sube el suyo' },
  ],
  estilo: { pagina: 'A4 vertical', margenes: '14 mm', fuente: 'Mulish (respaldo Arial)', colorPrincipal: '#0B2E59', colorAcento: '#0B5CAD', marcaAgua: 'BORRADOR mientras el informe no esté Enviado',
    pie: ['Página N de M', 'Código de verificación (8 caracteres, valida el documento en SIRIUS)', 'Generado el dd/mm/aaaa · hh:mm por <usuario>'] },

  // ---------- Reglas de hallazgo de Vehículos ----------
  // severidad: alta (rojo) · media (ámbar) · baja (gris). Solo se listan las que se cumplen; orden por severidad.
  hallazgosVeh: [
    { id: 'testigo', si: 'Algún veh_testigo_* = Encendido', texto: 'Testigo encendido: {lista}', severidad: 'alta' },
    { id: 'idNoVerificada', si: 'Alguna veh_verificacion_* = No verificado', texto: 'Identificación no verificada: {lista}', severidad: 'alta' },
    { id: 'externaNovedad', si: 'Verificación externa con resultado «Con novedad»', texto: '{fuente}: {detalle}', severidad: 'alta' },
    { id: 'propiedad', si: 'Propietario de la matrícula distinto del asegurado y sin interés asegurable o sin contrato de compraventa', texto: 'La matrícula está a nombre de {propietario}', severidad: 'alta' },
    { id: 'labradoBajo', si: 'Labrado menor a 1,6 mm', texto: 'Neumático {posicion} con {labrado} mm', severidad: 'alta' },
    { id: 'averia', si: 'Hay averías', texto: '{n} averías · la mayor: {pieza} ({gravedad})', severidad: 'según gravedad' },
    { id: 'diferenciaValor', si: 'Diferencia del casco mayor a ±10 %', texto: 'Valor sugerido {pct} respecto del asegurado ({alerta})', severidad: 'media' },
    { id: 'extrasLimite', si: 'Extras sobre el casco mayor a 20 %', texto: 'Extras por {pct} del casco', severidad: 'media' },
    { id: 'matricula', si: 'Matrícula vencida o que vence en 30 días o menos', texto: 'Matrícula {vencida/vence} el {fecha}', severidad: 'media' },
    { id: 'licencia', si: 'Licencia del conductor habitual caducada', texto: 'Licencia caducada el {fecha}', severidad: 'media' },
    { id: 'kmInconsistente', si: 'Regla «Kilometraje inconsistente» cumplida', texto: 'Kilometraje inconsistente ({km} km para {anios} años)', severidad: 'media' },
    { id: 'fotoGaleria', si: 'Alguna foto cargada desde la galería', texto: '{n} fotos cargadas desde la galería', severidad: 'media' },
    { id: 'externaNoDisponible', si: 'Una verificación externa no se pudo consultar', texto: '{fuente} no disponible el {fecha}', severidad: 'baja' },
    { id: 'labradoAtencion', si: 'Labrado entre 1,6 y 3 mm', texto: 'Neumático {posicion} con {labrado} mm (desgaste)', severidad: 'baja' },
    { id: 'puntos', si: 'Puntos de licencia menores a 10', texto: 'Licencia con {puntos} puntos', severidad: 'baja' },
  ],

  // ---------- Documentos ----------
  documentos: [
    // ===== Vehículos · Informe de inspección (interno) =====
    { id: 'veh-informe', plantilla: 'Vehículos livianos v1', nombre: 'Informe de inspección vehicular', destino: 'Uso interno y emisión', estado: 'Vigente', version: 1, base: true,
      secciones: [
        { tipo: 'encabezado', logos: ['compania', 'proveedor'], titulo: 'Informe de inspección vehicular', datosCabecera: ['Caso {caso.numero}', 'Inspección {veh_fecha_hora_inspeccion}', 'Código {documento.codigo}'] },
        { tipo: 'tarjeta', titulo: null, destacado: 'veh_placa (o «Sin placa»)', campos: ['veh_marca', 'veh_modelo', 'veh_anio_modelo', 'veh_color', 'veh_uso', 'veh_kilometraje + km por año', 'veh_vin', 'veh_numero_motor'], fotosReferencia: ['exteriores_frontal', 'exteriores_posterior'], sinFoto: 'Sin foto' },
        { tipo: 'resultado', titulo: 'Resultado', mostrarOrigen: true, mostrarEmision: true, mostrarReglas: true, sinVeredicto: 'Pendiente de calificación' },
        { tipo: 'hallazgos', titulo: 'Hallazgos relevantes', reglas: 'hallazgosVeh', textoSinHallazgos: 'Sin hallazgos relevantes: testigos apagados, identificación verificada, sin averías ni novedades externas.' },
        { tipo: 'valores', titulo: 'Valores', mostrarDiferencias: true, mostrarAlertas: true, nota: 'Asegurado (solicitud) frente a sugerido (inspección): casco, extras y total.' },
        { tipo: 'campos', titulo: 'Datos de la inspección', columnas: 3, campos: [['veh_modalidad_realizada', 'siempre'], ['veh_fecha_hora_inspeccion', 'siempre'], ['inspección.lugar (ciudad y coordenadas)', 'conValor'], ['inspector o agencia', 'siempre'], ['veh_persona_atiende + relación', 'conValor'], ['caso.sucursal', 'siempre'], ['comercial.nombre', 'siempre'], ['broker.nombre', 'conValor']] },
        { tipo: 'salto' },
        { tipo: 'campos', titulo: 'Asegurado y propiedad', columnas: 2, campos: [['asegurado.nombre', 'siempre'], ['asegurado.identificacion', 'siempre'], ['veh_nombre_matricula', 'condicion: distinto del asegurado'], ['veh_interes_asegurable', 'condicion: propietario distinto'], ['veh_contrato_compraventa', 'condicion: propietario distinto'], ['veh_vigencia_matricula', 'siempre'], ['veh_gad_matriculacion', 'conValor'], ['veh_camv_cpn', 'conValor']] },
        { tipo: 'campos', titulo: 'Conductor habitual', condicion: 'veh_conductor_habitual = Otra persona', columnas: 3, campos: [['veh_nombre_conductor', 'siempre'], ['veh_edad_conductor', 'conValor'], ['veh_tipo_licencia', 'conValor'], ['veh_caducidad_licencia', 'conValor'], ['veh_puntos_licencia', 'excepcion']], resumenSiNo: 'Conductor habitual: el asegurado.' },
        { tipo: 'lista', agruparEn: 'Estado del vehículo', titulo: 'Identificación',  campos: ['veh_verificacion_chasis_relieve', 'veh_verificacion_sticker_vin', 'veh_verificacion_plaqueta_panoramica'], frase: 'Verificado: {verificados}. {noAplica en gris}', textoTodosNormales: 'Chasis, sticker VIN y plaqueta verificados.' },
        { tipo: 'lista', agruparEn: 'Estado del vehículo', titulo: 'Equipamiento', campos: ['veh_radio (opción)', 'veh_aros (opción)', 'accesorios Sí/No', 'veh_cantidad_airbags', 'veh_satelital + proveedor', 'veh_telemetria + dispositivo', 'veh_blindaje (solo si Sí, con nivel y empresa)'], frase: 'Tiene: {lista de los Sí}', nota: 'Nunca lista los «No».' },
        { tipo: 'tabla', titulo: 'Extras', grilla: 'ext', columnas: ['Descripción', 'Marca', 'Valor (USD)'], totales: true, condicion: 'hay extras' },
        { tipo: 'tabla', agruparEn: 'Estado del vehículo', titulo: 'Neumáticos', grilla: 'neu', columnas: ['Posición', 'Marca', 'Medida', 'Labrado (mm)'], resumirSiUniforme: 'Neumáticos {marca} {medida}; labrado de {min} a {max} mm (repuesto {rep} mm).' },
        { tipo: 'lista', agruparEn: 'Estado del vehículo', titulo: 'Testigos del tablero', campos: ['veh_testigo_*'], frase: 'Encendidos: {lista}', textoTodosNormales: 'Todos apagados ({n} revisados).' },
        { tipo: 'diagrama', titulo: 'Averías', vistas: ['Lateral izquierdo', 'Lateral derecho', 'Frente', 'Superior', 'Posterior'], siluetaSegunCarroceria: { 'Sedán': 'sedan', 'SUV': 'suv', 'Camioneta': 'camioneta', 'Doble cabina': 'camioneta', 'Hatchback': 'hatchback', otra: 'sedan' }, lienzo: 'Un solo SVG (viewBox 700 × 300): fila 1 laterales izquierdo (frente a la izquierda) y derecho (frente a la derecha); fila 2 frente, superior (horizontal, frente a la derecha) y posterior. Misma escala en las 5 vistas: el largo del lateral es el de la superior y el ancho del frente y del posterior es el de la superior.', dibujo: 'Siluetas con ruedas (neumático y aro), ópticas delanteras y traseras, espejos, pilares, puertas, ventanas y barras de techo; trazo #2f3e52, relleno #f4f7fa, vidrios #dfe8f1. Estilos como atributos de presentación (sin clases ni <use>) para que la vista previa, html2canvas y el PDF lo dibujen igual.', marcas: 'número de la avería en cada vista donde se ve la pieza, círculo con borde blanco, color según gravedad (Alta #b42318, Media #b7791f, Baja #6b7a8c); leyenda de colores debajo del lienzo', mapaPiezas: 'tabla pieza → vistas y posición (la arma el chat a partir de la lista de piezas del formulario)', condicion: 'hay averías' },
        { tipo: 'tabla', titulo: null, grilla: 'ave', columnas: ['#', 'Pieza', 'Tipo de daño', 'Gravedad', 'Profundidad', 'Superficie', 'Foto'], anchos: ['7%', '27%', '16%', '13%', '14%', '12%', '11%'], disposicion: 'Debajo del diagrama, a todo el ancho; table-layout fijo; # como círculo del color de la gravedad; Gravedad como etiqueta de color; Superficie con unidad («3 dm²»); Foto sin partir («F-12»)', condicion: 'hay averías' },
        { tipo: 'verificaciones', titulo: 'Verificaciones externas', fuentes: 'las del formulario', columnas: ['Fuente', 'Resultado', 'Consultada', 'Forma'], anexarEvidencia: true },
        { tipo: 'texto', titulo: 'Observaciones del inspector', contenido: '{veh_observacion_general}', condicion: 'tiene valor' },
        { tipo: 'lineaTiempo', titulo: 'Trazabilidad', eventos: ['Solicitud', 'Enlace enviado', 'Inspección iniciada', 'Informe enviado', 'Calificación', 'Envío a emisión', 'Emisión'] },
        { tipo: 'firmas', espacio: { separacion: '16 mm', firma: '20 mm' }, segunModalidad: { 'Presencial': ['Quien atiende (firma)', 'Inspector'], 'Virtual guiada': ['Inspector', 'Aceptación del cliente en la videollamada'], 'Autoinspección': ['Declaración aceptada por el cliente en el portal el {fecha}'], 'Documental': ['Ejecutivo de inspecciones'] } },
        { tipo: 'salto' },
        { tipo: 'fotos', titulo: 'Registro fotográfico', grupos: ['Exteriores', 'Identificación', 'Motor', 'Interiores', 'Airbags', 'Llantas', 'Extras', 'Daños'], porFila: 3, leyenda: 'paso · fecha hora · GPS · dispositivo' },
        { tipo: 'fotos', titulo: 'Documentos', grupos: ['Documentos'], porFila: 2, nota: 'Ocultar datos personales según LOPDP (pendiente de definir)' },
        { tipo: 'verificaciones', titulo: 'Anexo · evidencia de verificaciones', soloEvidencia: true, condicion: 'hay evidencia adjunta' },
      ] },
    // ===== Vehículos · Resumen para el APS =====
    { id: 'veh-resumen', plantilla: 'Vehículos livianos v1', nombre: 'Resumen de inspección vehicular', destino: 'Bróker (APS) y cliente', estado: 'Vigente', version: 1, base: true, paginas: 'Una',
      secciones: [
        { tipo: 'encabezado', logos: ['compania', 'proveedor'], titulo: 'Resumen de inspección vehicular', datosCabecera: ['Caso {caso.numero}', 'Inspección {veh_fecha_hora_inspeccion}', 'Código {documento.codigo}'] },
        { tipo: 'tarjeta', destacado: 'veh_placa', campos: ['veh_marca', 'veh_modelo', 'veh_anio_modelo', 'veh_color', 'veh_kilometraje'], fotosReferencia: ['exteriores_frontal', 'exteriores_posterior'], sinFoto: 'Sin foto' },
        { tipo: 'resultado', titulo: 'Resultado de la inspección', mostrarOrigen: false, mostrarEmision: false, mostrarReglas: false, sinVeredicto: 'No disponible: pendiente de calificación' },
        { tipo: 'hallazgos', titulo: 'Preexistencias', reglas: ['averia', 'testigo', 'labradoBajo', 'labradoAtencion'], textoSinHallazgos: 'Sin preexistencias: sin averías, testigos apagados y neumáticos en buen estado.' },
        { tipo: 'tabla', titulo: 'Extras declarados', grilla: 'ext', columnas: ['Descripción', 'Marca', 'Valor (USD)'], totales: true, condicion: 'hay extras' },
        { tipo: 'fotos', titulo: 'Fotos laterales', pasos: ['exteriores_lateral_izquierdo_de_ade', 'exteriores_lateral_derecho_de_ade'], porFila: 2 },
        { tipo: 'texto', contenido: 'Este resumen no reemplaza las condiciones de la póliza. Consulta el informe completo con tu ejecutivo comercial.' },
      ] },
    // ===== Equipo y maquinaria · Informe de inspección de equipo (etapa 8b · uno por equipo) =====
    // Mismos principios: primero lo que decide; componentes por excepción (solo Regular y Malo); listas compactas; sin silueta (llega en 12a).
    // Hallazgos: reglas de SIRIUS_EQUIPOS.hallazgos. Valores: SiriusEquipos.valores (con el VRN ajustado en calificación, si lo hay).
    { id: 'em-informe', plantilla: 'Equipo y maquinaria v1', nombre: 'Informe de inspección de equipo', destino: 'Uso interno y emisión', estado: 'Vigente', version: 1, base: true,
      secciones: [
        { tipo: 'encabezado', logos: ['compania', 'proveedor'], titulo: 'Informe de inspección de equipo', datosCabecera: ['Caso {caso.numero}', 'Inspección {em_fecha_hora_inspeccion}', 'Código {documento.codigo}'] },
        { tipo: 'tarjeta', titulo: null, destacado: 'em_tipo', campos: ['em_anio_fabricacion', 'em_serie_pin', 'em_horometro'], fotosReferencia: ['eq_frontal', 'eq_posterior'], sinFoto: 'Sin foto' },
        { tipo: 'resultado', titulo: 'Resultado', mostrarOrigen: true, mostrarEmision: true, mostrarReglas: true, sinVeredicto: 'Pendiente de calificación' },
        { tipo: 'hallazgos', titulo: 'Hallazgos relevantes', reglas: 'SIRIUS_EQUIPOS.hallazgos', textoSinHallazgos: 'Sin hallazgos relevantes: valores en rango, documentación al día y seguridad completa.' },
        { tipo: 'valores', titulo: 'Valores', mostrarValorReal: true, mostrarFuente: true, mostrarExplicacion: true, ejemploDanio: 50000,
          explicacion: 'La suma asegurada cubre el {pct} % del VRN. En un siniestro parcial se aplica la regla proporcional: la indemnización se reduce en la misma proporción. Por un daño de {danio} se pagarían {pago}.' },
        { tipo: 'campos', titulo: 'Datos de la inspección', columnas: 3, campos: [['em_modalidad_realizada', 'siempre'], ['em_fecha_hora_inspeccion', 'siempre'], ['inspección.lugar (ciudad y coordenadas)', 'conValor'], ['inspector o agencia', 'siempre'], ['caso.sucursal', 'conValor'], ['broker.nombre', 'conValor'], ['em_capacidad', 'conValor'], ['em_numero_motor', 'conValor'], ['em_pais', 'conValor']] },
        { tipo: 'salto' },
        { tipo: 'tabla', titulo: 'Estado por componentes', grilla: 'em_componentes', porExcepcion: ['Regular', 'Malo'], columnas: ['Componente', 'Estado', 'Observación'], textoTodosNormales: 'Todos los componentes en buen estado ({n} revisados).', restoTexto: 'Resto en buen estado: {lista}.' },
        { tipo: 'lista', agruparEn: 'Documentación, mantenimiento, uso y seguridad', presentacion: 'tarjetas', titulo: 'Documentación', campos: ['em_matricula', 'em_numero_matricula', 'em_fecha_tramite', 'em_licencia', 'em_tipo_licencia', 'em_vigencia_licencia'] },
        { tipo: 'lista', agruparEn: 'Documentación, mantenimiento, uso y seguridad', presentacion: 'tarjetas', titulo: 'Mantenimiento', campos: ['em_bitacora', 'em_preventivo', 'em_frecuencia', 'em_ultimo_mantenimiento', 'em_mantenimiento_quien', 'em_chequeo_previo'] },
        { tipo: 'lista', agruparEn: 'Documentación, mantenimiento, uso y seguridad', presentacion: 'tarjetas', titulo: 'Uso', campos: ['em_uso', 'em_actividad', 'em_horas_dia', 'em_operador', 'em_pernocta', 'em_vigilancia'] },
        { tipo: 'lista', agruparEn: 'Documentación, mantenimiento, uso y seguridad', presentacion: 'tarjetas', titulo: 'Seguridad', campos: ['em_extintor', 'em_vigencia_extintor', 'em_gps', 'em_gps_proveedor', 'em_alarma_retroceso', 'em_rops'] },
        { tipo: 'tabla', titulo: 'Implementos y accesorios', grilla: 'em_implementos', columnas: ['Descripción', 'Marca', 'Serie', 'Valor (USD)'], totales: true, condicion: 'hay implementos' },
        // Etapa 12a · DEC-133: diagrama de averías con la silueta del tipo de equipo (SIRIUS_SILUETAS.siluetaEquipo); la tabla va debajo.
        { tipo: 'diagrama', titulo: 'Averías', vistas: ['Lateral izquierdo', 'Lateral derecho', 'Frente', 'Superior', 'Posterior'], siluetaSegun: 'Tipo de equipo (SIRIUS_SILUETAS.siluetaEquipo)', condicion: 'hay averías' },
        { tipo: 'tabla', titulo: null, grilla: 'em_averias', columnas: ['#', 'Pieza', 'Tipo de daño', 'Gravedad', 'Profundidad', 'Superficie', 'Foto'], anchos: ['7%', '27%', '16%', '13%', '14%', '12%', '11%'], condicion: 'hay averías', textoSinAverias: 'Sin averías registradas.' },
        { tipo: 'seguimientos', titulo: 'Seguimientos del caso', soloAceptados: true, nota: 'Los aceptados en la calificación para este equipo.' },
        { tipo: 'texto', titulo: 'Observaciones del inspector', contenido: '{em_observacion_general}', condicion: 'tiene valor' },
        { tipo: 'lineaTiempo', titulo: 'Trazabilidad', eventos: ['Solicitud', 'Inspección iniciada', 'Informe enviado', 'Calificación', 'Envío a emisión', 'Emisión'] },
        { tipo: 'firmas', espacio: { separacion: '16 mm', firma: '20 mm' }, segunModalidad: { 'Presencial': ['Quien atiende (firma)', 'Inspector'], 'Virtual guiada': ['Inspector', 'Aceptación del cliente en la videollamada'] } },
        { tipo: 'salto' },
        { tipo: 'fotos', titulo: 'Registro fotográfico', grupos: ['Exteriores', 'Cabina', 'Identificación', 'Equipamiento', 'Seguridad', 'Daños'], porFila: 3, leyenda: 'paso · fecha hora · GPS · dispositivo' },
        { tipo: 'fotos', titulo: 'Documentos', grupos: ['Documentos'], porFila: 2, nota: 'Ocultar datos personales según LOPDP (pendiente de definir)' },
      ] },
    // ===== Equipo y maquinaria · Resumen para el APS (sin valor real ni reglas de envío) =====
    { id: 'em-resumen', plantilla: 'Equipo y maquinaria v1', nombre: 'Resumen de inspección de equipo', destino: 'Bróker (APS) y cliente', estado: 'Vigente', version: 1, base: true, paginas: 'Una',
      secciones: [
        { tipo: 'encabezado', logos: ['compania', 'proveedor'], titulo: 'Resumen de inspección de equipo', datosCabecera: ['Caso {caso.numero}', 'Inspección {em_fecha_hora_inspeccion}', 'Código {documento.codigo}'] },
        { tipo: 'tarjeta', destacado: 'em_tipo', campos: ['em_anio_fabricacion', 'em_serie_pin'], fotosReferencia: ['eq_frontal', 'eq_posterior'], sinFoto: 'Sin foto' },
        { tipo: 'resultado', titulo: 'Resultado de la inspección', mostrarOrigen: false, mostrarEmision: false, mostrarReglas: false, sinVeredicto: 'No disponible: pendiente de calificación' },
        { tipo: 'hallazgos', titulo: 'Hallazgos', reglas: ['infraseguro', 'sobreseguro', 'sinMatricula', 'licencia', 'extintor', 'sinGps', 'hidraulico', 'pernocta', 'sinMantenimiento', 'antiguedad'], textoSinHallazgos: 'Sin hallazgos: documentación al día, seguridad completa y suma asegurada acorde al valor del equipo.' },
        { tipo: 'valores', titulo: 'Suma asegurada', mostrarValorReal: false, mostrarFuente: false, mostrarExplicacion: false, recomendacion: 'Se recomienda actualizar la suma asegurada al VRN.' },
        { tipo: 'tabla', titulo: 'Componentes con novedad', grilla: 'em_componentes', porExcepcion: ['Regular', 'Malo'], columnas: ['Componente', 'Estado', 'Observación'], textoTodosNormales: 'Todos los componentes en buen estado ({n} revisados).' },
        { tipo: 'seguimientos', titulo: 'Requisitos del caso', soloAceptados: true },
        { tipo: 'texto', contenido: 'Este resumen no reemplaza las condiciones de la póliza. Consulta el informe completo con tu ejecutivo comercial.' },
      ] },
    // ===== Ramos Generales (base: el diseño vigente del bloque S) =====
    { id: 'rg-informe', plantilla: 'Ubicación (Ramos Generales)', nombre: 'Informe técnico de inspección', destino: 'Uso interno y emisión', estado: 'Vigente', version: 1, base: true,
      desde: 'SIRIUS_SALIDA_RG (documento «Informe técnico», 18 capítulos y anexo)', nota: 'Se expresa en este modelo sin cambiar el resultado: los PDF de 20195 deben quedar idénticos.' },
    { id: 'rg-resumen', plantilla: 'Ubicación (Ramos Generales)', nombre: 'Resumen para el APS', destino: 'Bróker (APS)', estado: 'Vigente', version: 1, base: true,
      desde: 'SIRIUS_SALIDA_RG (documento «Resumen para el APS»)', nota: 'Idéntico al vigente.' },
  ],

  // ---------- Reglas del diseñador (DEC-126) ----------
  reglasDisenador: [
    'Ubicación: Formularios de inspección › (plantilla) › pestaña «Documento PDF». Una plantilla puede tener varios documentos (p. ej. Informe y Resumen).',
    'Acciones: Agregar documento (vacío o copiando otro), Duplicar, Editar, Retirar (deja de usarse; los PDF ya generados no cambian) y Eliminar (solo si nunca se generó).',
    'Versiones: Borrador → Vigente → Retirada. Publicar pide motivo y muestra el impacto (documentos que se generarán distinto desde ahora). Cada PDF generado guarda la versión con la que se hizo.',
    'Editor en tres columnas, igual que el de plantillas de notificación: secciones (ordenables, con teclado), propiedades de la sección o del campo, y vista previa A4 con un caso real (separador ajustable, zoom y pantalla completa).',
    'Un campo se agrega desde la lista de campos de la plantilla de formulario (con su sección de origen); los campos calculados y las variables del caso también están disponibles.',
    'Las bases no se pueden eliminar, sí duplicar y modificar; siempre hay al menos un documento Vigente por destino.',
  ],

  // ---------- Resultado esperado de ejemplo (Informe interno) ----------
  esperado: {
    '20196-V1': 'Página 1: tarjeta PBA4521 · Toyota Corolla Cross 2022 · Plata · uso Comercial · 41.300 km; Resultado No asegurable · Daños preexistentes no reparados · Calificado por Verónica Lema · regla Diferencia de valor −12,1 % · Emitido por excepción; Hallazgos: 2 averías (la mayor: puerta delantera derecha, Media), valor sugerido −12,1 % (posible sobreseguro), plaqueta panorámica no verificada; Valores 29.700 / 26.100 casco y extras 1.200. Página 2: neumáticos resumidos en una línea (Bridgestone 215/60 R17, 5,1 a 6,2 mm; repuesto 7,8), testigos «Todos apagados (7 revisados)», diagrama con 2 marcas y su tabla, extras con total USD 1.200.',
    '20175-V1': 'Sin hallazgos relevantes; sin sección de averías ni de extras; neumáticos en una línea.',
  },
};
