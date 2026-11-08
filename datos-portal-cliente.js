// SIRIUS · Portal del cliente: estado, autoagendamiento y documentos (v1.2 · provisional · etapa 14b · 06/11/2026) · DEC-171 y DEC-172
// v1.2: autoagendamiento para todos los grupos de ramo; horarios cada 30 min en la jornada; confirmación inmediata con inspectores
//       de agenda fija y, para los demás horarios, búsqueda en la red de inspectores (al estilo de una app de transporte).
// v1.1: documentos con la misma captura guiada de la autoinspección (cámara inmersa, marco, indicadores y revisión) y sus datos
//       a los campos del formulario.
// Aprobado por el negocio con la maqueta del 14. Mismo enlace único del caso (DEC-146); textos con bloques y variables (DEC-162).
window.SIRIUS_PORTAL_CLIENTE = {
  version: '1.2', vigencia: 'Provisional',
  secciones: ['Mi inspección', 'Agenda', 'Documentos'],
  modalidades: 'Presencial y virtual guiada usan Agenda; autoinspección conserva su recorrido (12d) y muestra Mi inspección y Documentos.',
  grupos: 'Autoagendamiento para todos los grupos de ramo (Vehículos, Ramos Generales y Equipo y maquinaria): cada uno define la duración de la visita (Vehículos 45 min, Ramos Generales 120 min, Equipo y maquinaria 90 min, configurables por ramo), sus documentos y el texto de la pregunta del lugar.',
  // ---------- Mi inspección ----------
  estadoCliente: [
    { paso: 'Solicitud recibida', desde: ['Registrado', 'En coordinación', 'Reaperturado'] },
    { paso: 'Inspección agendada', desde: ['Agendado', 'Enlace caducado'] },
    { paso: 'Inspección realizada', desde: ['En curso'] },
    { paso: 'En revisión', desde: ['Pendiente calificación', 'Pendiente calificación de suscripción', 'Devuelto al inspector', 'Revisión técnica'] },
    { paso: 'Revisión completada', desde: ['Inspeccionado', 'Enviado a emisión', 'Emitida', 'No emitida'], texto: 'Tu asesor te contactará con el siguiente paso.' },
    { paso: 'Solicitud cancelada', desde: ['Cancelado'], texto: 'Si necesitas retomarla, escríbenos.' },
  ],
  sinResultado: 'El cliente nunca ve la calificación, sus motivos, alertas ni datos internos: solo «Revisión completada» (definición 1).',
  accionPendiente: 'Arriba, la acción que corresponde: «Agenda tu inspección», «Ver o cambiar la cita», «Sube tus documentos» o la autoinspección.',
  // ---------- Agenda ----------
  agenda: {
    horarios: 'Horas de inicio cada 30 minutos dentro de la jornada hábil (08:30–13:00 y 14:00–17:30, sin feriados), en los próximos 10 días hábiles; solo se ofrecen las horas en que la visita termina antes del cierre del bloque y que empiezan dentro de 2 horas o más.',
    pasoMinutos: 30, duracionPorGrupo: { 'Vehículos': 45, 'Ramos Generales': 120, 'Equipo y maquinaria': 90 },
    confirmacionInmediata: 'Horarios libres de inspectores de agenda fija de la zona (internos o de agencia con agenda en SIRIUS): el horario queda apartado 10 minutos y al confirmar se asigna ese inspector (T03 por «Autoagendamiento del cliente»).',
    red: {
      regla: 'Los demás horarios de la jornada se pueden pedir: al confirmar, la cita se ofrece a la red de inspectores de la zona (externos y agencias habilitados para ese grupo de ramo y modalidad); el primero que la acepta queda asignado.',
      cliente: 'Mientras tanto ve «Te estamos buscando un inspector» (enviada a N inspectores de la red cerca de su zona) y puede cambiar o cancelar; al aceptar uno, recibe la confirmación con nombre, organización y credencial por la app y por WhatsApp.',
      inspector: 'La oferta llega a la app del inspector (etapa 15) con fecha, hora, zona, duración y honorario según su tarifario; «Aceptar» o «No puedo»; gana el primero que acepta.',
      plazo: 'Si nadie acepta en 2 horas hábiles (configurable) o antes de 4 horas hábiles del inicio, el cliente ve «No encontramos un inspector para ese horario» con la opción de elegir otro y el Coordinador recibe una tarea.',
      estadoCaso: 'En SIRIUS el caso queda «En coordinación · buscando inspector en la red» hasta la aceptación; luego pasa a Agendado.',
    },
    datos: ['Dirección (con mapa y ubicación actual)', 'Referencia', 'Quién recibe al inspector (nombre y celular 09XXXXXXXX)'],
    cambiar: { hastaHorasHabiles: 4, nota: 'Cambiar o cancelar la cita hasta 4 h hábiles antes; después, solo llamando. Mientras se busca en la red, siempre se puede cambiar o cancelar.' },
    diaVisita: 'El día de la visita: «Tu inspector va en camino» con nombre, organización, credencial y hora estimada; sin teléfono personal ni foto (LOPDP).',
    recordatorio: 'R06 el día anterior a las 17:00 por el canal con consentimiento; archivo de calendario (.ics) con aviso 2 h antes.',
  },
  // ---------- Documentos ----------
  documentos: {
    origen: ['Documentos del recorrido (matrícula y licencia, frente y reverso)', 'Documentos pedidos en una devolución o por el ejecutivo', 'Facturas o soportes de extras declarados (opcionales)', 'Ramos Generales: garantías por acreditar después de la emisión (DEC-109)'],
    captura: 'Misma cámara guiada de la autoinspección (DEC-154): pantalla completa dentro del portal (no se abre la cámara del sistema), marco del documento (tarjeta 85,6 × 54 mm o hoja A4 vertical), celular en vertical, indicadores abajo (Vertical, Encuadre por bordes alineados, Luz, Nitidez con quietud, Reflejo) con un único mensaje, disparo al cumplirse o «Tomar igual» a los 6 s (marcada), recorte al marco y revisión «Usar esta foto / Repetir». La cámara del sistema queda solo como respaldo si no hay cámara en vivo; un PDF solo se acepta en documentos digitales (factura electrónica) y como opción secundaria.',
    campos: {
      matricula_frente: ['veh_placa', 'veh_vin', 'veh_anio'], matricula_reverso: ['prop_identificacion', 'mat_caducidad'],
      licencia_frente: ['lic_numero', 'lic_categoria', 'lic_vencimiento'], licencia_reverso: [], factura_extra: ['ext_factura_valor'],
      regla: 'Cada documento lleva sus campos de destino del formulario (Formularios › paso del documento). La lectura en el celular es una primera lectura; el motor de extracción de SIRIUS confirma: con 90 % o más se precarga con «Origen: Portal del cliente · <documento>», entre 60 y 89 % queda «Por confirmar» y bajo 60 % en blanco. Se compara con la solicitud (placa, identificación) con la misma regla de caracteres confundibles. El cliente no ve las lecturas.',
    },
    estados: ['Pendiente', 'En revisión', 'Aceptado', 'Volver a subir (con motivo)'],
    revision: 'Quien pidió el documento lo acepta o rechaza con motivo desde el caso (Evidencias); el rechazo notifica al cliente y vuelve a «Volver a subir».',
    aviso: 'La pestaña muestra cuántos documentos faltan; Mi inspección muestra el aviso.',
  },
  ejemplo: { caso: '20152', cliente: 'Luis Fernando Cevallos', placa: 'GSE1120', vehiculo: 'Kia Rio 2023', direccion: 'Av. 6 de Diciembre N34-120 y Portugal, Quito', inspector: 'Marco Tapia', credencial: 'AS-INS-0142' },
};
