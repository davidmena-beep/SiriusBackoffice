// SIRIUS · App del inspector (v1.2 · provisional · etapa 15-2 · 07/11/2026) · DEC-173 y DEC-174
// v1.2: prueba en celular: tipo de vehículo, pasos y formulario de la columna Presencial, interfaz que gira con el celular,
//       logos, botones con íconos, mapa embebido con la ruta, sonido de ofertas y honorarios según el tipo de inspector.
// v1.1: visita completa (captura, formulario, determinación), cola sin conexión y horario de confirmación de la visita.
// Aprobada por el negocio con la maqueta del 15 y sus 5 definiciones. Una sola app (PWA) para inspectores internos y externos.
window.SIRIUS_APP_INSPECTOR = {
  version: '1.2', vigencia: 'Provisional',
  secciones: ['Hoy', 'Ofertas', 'Visitas', 'Yo'],
  // ---------- Acceso ----------
  acceso: {
    instalacion: 'Dirección web de la app (p. ej. inspectores.asur.ec) y «Agregar a la pantalla de inicio»; sin tiendas en el MVP.',
    alta: 'Internos: invitación del Administrador e ingreso con Google (DEC-113). Externos y agencias: invitación del Administrador o de su agencia; usuario, contraseña y código por correo la primera vez en cada celular (DEC-128).',
    dispositivo: 'El primer ingreso exige conexión y registra el celular como dispositivo de confianza; luego se desbloquea con huella, rostro o PIN de 6 dígitos, también sin señal.',
    renovacion: 'La sesión se renueva conectándose al menos cada 7 días; el Administrador puede revocar un dispositivo (al reconectarse, se borran sus datos locales).',
    tecnologia: 'Producción: PWA en Angular 22 (service worker, IndexedDB cifrado, cola de sincronización con subidas reanudables, push web); empaquetado con Capacitor a decisión de Citytech (T-06).',
  },
  // ---------- Hoy ----------
  hoy: {
    contenido: 'Visitas del día en orden de hora con duración, bien, dirección, caso y estado (Pendiente, En curso, Enviada); mapa con la ruta sugerida, kilómetros y la primera hora; «Abrir la ruta del día» en el navegador del celular.',
    estados: ['Pendiente', 'En camino', 'En curso', 'Enviada', 'Por sincronizar'],
    voyEnCamino: '«Avisar voy en camino» envía al cliente el aviso del portal («Tu inspector va en camino» con la hora estimada) y queda en la cronología.',
  },
  // ---------- Ofertas de la red (DEC-172) ----------
  ofertas: {
    quien: 'Solo inspectores externos y agencias de la red con «Recibir ofertas» encendido, habilitados para el grupo de ramo y la modalidad, con la zona del riesgo entre sus zonas; los internos reciben visitas por asignación (definición 5).',
    envio: 'La oferta se envía a la vez a todos los que cumplen y la primera persona que acepta queda asignada (T03); a los demás se les retira con «La tomó otro inspector» (definición 2).',
    tarjeta: ['Grupo y modalidad', 'Cuándo (día, hora y duración)', 'Dónde (zona y distancia desde su ubicación o ciudad base)', 'Bien', 'Honorario', 'Choques con su agenda', 'Tiempo restante del plazo de búsqueda'],
    honorario: 'El de su tarifario: fijo en Vehículos; estimado en Ramos Generales y Equipo y maquinaria con la calculadora hora-hombre (DEC-137); el definitivo sigue el flujo del honorario (definición 3).',
    choques: 'Si la oferta choca con una visita o un bloqueo, se muestra «Choca con tu visita de las 11:00» y «Aceptar» pide confirmación.',
    acciones: ['Aceptar', 'No puedo (motivo opcional: horario, distancia, otro)'],
    aviso: 'Notificación push con sonido al llegar una oferta; contador en la pestaña Ofertas.',
  },
  // ---------- Visita ----------
  visita: {
    llegada: { radioMetros: 150, regla: '«Llegué: iniciar la visita» registra hora y ubicación; se habilita a menos de 150 m de la dirección; más lejos, se puede iniciar con motivo y genera una alerta para el calificador (definición 1).' },
    pasos: ['Fotos guiadas (mismo mapa, contornos, validaciones y OCR de la autoinspección; pasos de la columna Presencial de la plantilla)', 'Documentos con la cámara guiada (campos al formulario)', 'Formulario del informe (secciones vigentes; campos precargados por fotos y documentos con su origen)', 'Determinación y envío según la facultad del inspector y las reglas de envío (T09 y T10 del flujo) o envío a calificación'],
    contacto: 'Contacto en sitio con «Llamar» (marcador del celular) y «Avisar voy en camino»; sin mostrar al inspector datos del asegurado que no necesite.',
  },
  // ---------- Visita completa (15-2) ----------
  visitaCompleta: {
    captura: 'Pasos de la columna Presencial de la plantilla (Vehículos livianos: los 10 de la autoinspección más matrícula y licencia, frente y reverso) en una grilla con el siguiente resaltado; cada paso abre la misma cámara guiada de la autoinspección: fotos del vehículo en horizontal con el contorno y el detector (encuadre «Acércate», «Aléjate», «Centra»), documentos en vertical con el marco y la verificación de bordes y reflejo, indicadores abajo con un único mensaje, «Tomar igual» a los 6 s, revisión «Usar esta foto / Repetir». Cada foto guarda hora, ubicación, validación y lecturas.',
    formulario: 'Secciones del formulario vigente de la plantilla; los campos leídos (placa, VIN, kilometraje, año) se precargan con su origen y confianza (90 % precarga, 60–89 % «Por confirmar») y el inspector puede corregirlos (origen «Inspector»). Las secciones obligatorias bloquean el envío con la lista de faltantes.',
    determinacion: 'Con facultad (Vehículos, monto dentro del tope de su ficha y sin reglas de envío cumplidas): Asegurable, No asegurable (motivo) o Enviar a calificación (T10 o T09). Sin facultad o con una regla cumplida: solo Enviar a calificación (T09), con el motivo de la regla.',
    ramosGenerales: 'En Ramos Generales y Equipo y maquinaria la visita usa el formulario por secciones de su plantilla y siempre envía a calificación (sin determinación del inspector).',
  },
  confirmacionVisita: {
    regla: 'R06 sale el día anterior a las 15:00 con «Confirmar» y «Cambiar»; si el cliente no confirma hasta las 18:00, la visita queda «Sin respuesta» y el Coordinador recibe una tarea (resuelve el choque de 15-1 entre R06 y «Sin respuesta» a las 17:00).',
    horaRecordatorio: '15:00', horaSinRespuesta: '18:00',
  },
  // ---------- Ajustes de la prueba en celular (07/11) ----------
  tipoVehiculo: 'Al iniciar la visita, «Tipo de vehículo» con íconos (sedán o hatchback, SUV o Jeep, camioneta, moto), marcado según la solicitud; cambiarlo con fotos tomadas pide confirmación, las borra y queda en la cronología. El tipo decide la plantilla (Vehículos livianos o Motos) y el contorno de cada foto.',
  segunPlantilla: 'La secuencia de fotos y el formulario salen de la plantilla vigente del ramo en su columna Presencial (Formularios › pasos de foto y secciones del formulario), no de la autoinspección. Ejemplo de la réplica: Vehículos livianos v1 · Presencial con 15 fotos y 4 documentos; formulario Identificación, Estado general, Extras declarados, Daños y Observaciones; Motos con 8 fotos y 4 documentos.',
  rotacion: 'El video de la cámara ocupa la pantalla tal como está y la capa de la interfaz (guía, mensajes, botones y revisión) gira según la posición física del celular, medida con la gravedad del acelerómetro (girar de lado) y no con la inclinación hacia arriba o abajo: apuntar al vehículo inclinando el celular no bloquea; solo se exige horizontal en las fotos del vehículo y vertical en los documentos. Funciona con o sin bloqueo de rotación y sin pantalla completa. La foto se endereza al guardarla. La revisión «Usar esta foto / Repetir» aparece en la misma capa (sigue la posición del celular) y «Repetir» vuelve a la cámara sin reabrirla; un toque abre la cámara (se ignoran toques repetidos mientras abre).',
  interfaz: 'Encabezado con el logo de Aseguradora del Sur y SIRIUS; pantalla de desbloqueo con el logo; en la visita, botones con íconos: Llamar, Voy en camino, Navegar y el botón principal «Llegué: iniciar la visita».',
  mapa: 'Mapa embebido en «Hoy» (OpenStreetMap) con las visitas numeradas en orden de hora, la ruta y la ubicación del inspector; «Navegar» abre la navegación del celular hacia la visita.',
  sonido: 'Oferta nueva: sonido corto de tres tonos y vibración (activable en «Yo»); en producción, notificación push con sonido aunque la app esté cerrada.',
  // ---------- Honorarios según el tipo de inspector (DEC-174) ----------
  honorarios: {
    agencia: 'El inspector de una agencia recibe ofertas, pero el monto que ve es el que le paga su agencia (tarifa agencia → inspector, configurada por la agencia en Usuarios y roles › Agencias › Inspectores). En «Yo» ve sus visitas y lo acumulado con su agencia; no ve lo que la agencia tiene por aprobar, aprobado o facturado con la aseguradora.',
    independiente: 'El inspector independiente ve la tarifa de la aseguradora en cada oferta y en «Yo» sus honorarios por aprobar, aprobados y pagados.',
    agenciaFinanzas: 'La agencia (rol Finanzas de agencia) ve sus liquidaciones, facturas y pagos con la aseguradora, y las tarifas que paga a cada inspector.',
    cuentas: 'Parametrización de cuentas bancarias: en la agencia (banco, tipo, número, titular, RUC) y en cada inspector independiente (banco, tipo, número, titular, cédula), con validación, aprobación de Finanzas al cambiarla y número enmascarado (···4521) fuera de Finanzas (dato personal, LOPDP).',
    pendienteFinanciero: 'Módulo financiero (backlog): «Pagado» además de por aprobar y aprobado; la factura aprobada se envía al sistema financiero contable de la aseguradora (CNX-12) y este devuelve el estado de pago (pendiente, pagada con fecha y referencia, rechazada con motivo), visible para Finanzas, la agencia y el inspector independiente.',
  },
  // ---------- Sin conexión ----------
  sinConexion: {
    regla: 'Se puede capturar y completar todo sin señal: fotos, documentos, formulario y envío quedan en una cola local cifrada y se sincronizan solos al volver la señal (subidas reanudables e idempotentes).',
    retencionDias: 7, avisoHoras: 24,
    avisos: ['Franja «Sin señal · N archivos por sincronizar»', 'Aviso si hay pendientes de más de 24 h', 'Bloqueo de la cola si pasan 7 días sin sincronizar: la app pide conectarse antes de seguir'],
    estadoEnSirius: 'Mientras no sincroniza, el caso muestra «En curso · por sincronizar» con la hora de la última sincronización (definición 4).',
  },
  // ---------- Yo ----------
  yo: {
    contenido: ['Recibir ofertas de la red (encendido o apagado; solo externos y agencias)', 'Zonas', 'Horario disponible y bloqueos (Agenda)', 'Modalidades', 'Mis honorarios del mes (por aprobar, aprobados, visitas, fecha de liquidación; quién factura)', 'Mi calificación (nota de los clientes, devoluciones, puntualidad)'],
    edicion: 'Zonas, horario y modalidades se editan desde la app y quedan pendientes de aprobación del Coordinador si amplían el alcance.',
  },
  // ---------- Correcciones de 14b ----------
  correcciones: [
    'R06 (recordatorio de la visita) sale el día anterior (hora vigente en confirmacionVisita: 15:00).',
    'El año leído en la matrícula se compara con el de la solicitud: si difiere, alerta media en los controles.',
    'Las alertas de los documentos del portal aparecen en los controles del calificador también en inspecciones presenciales y virtuales (no solo con autoinspección).',
  ],
  ejemplo: { inspector: 'Mauricio Endara', organizacion: 'Eurosurvey', tipo: 'Red', dia: 'Mar 20/10', visitas: ['20152 · 08:30', '20145 · 11:00', '20190 · 15:00'], ofertas: ['20186 · Mié 21/10 09:00 · USD 18,00', '20201 · Jue 22/10 14:00 · USD 115,00 estimado'] },
};
