// SIRIUS · Centro de conflictos de configuración (v1 · provisional · etapa 10n-conflictos · 02/11/2026)
// Fuente única de: tipos de conflicto, cómo se detectan, qué bloquean, cómo se resuelven y quién los recibe.
// Los conflictos se CALCULAN en vivo desde la configuración (no se guardan): este archivo define las reglas de detección y
// trae solo los que no se pueden calcular en el prototipo (respuestas externas, como un rechazo de Meta). Decisión: DEC-124.
(function () {
  const K = {
    version: '1', vigencia: 'Provisional',
    principios: [
      'Antes de confirmar un cambio que genera conflictos, el impacto los muestra: «Esto inactivará 1 plantilla y pausará R01, R02 y R03».',
      'Un objeto con conflicto bloqueante pasa a «Inactiva por conflicto» de forma automática; nunca se borra ni se edita solo.',
      'Cuando el conflicto se resuelve (por cualquier vía), el objeto vuelve a su estado anterior solo y queda en el Historial: «Reactivada al resolverse el conflicto».',
      'Un envío que no se pudo hacer por un conflicto queda en la Bitácora como «Omitido · plantilla inactiva por conflicto»; no se reintenta solo al resolverse.',
      'Todo conflicto avisa al Administrador en la campana (uno por objeto, no por cada envío) y aparece en Administración › Conflictos.',
      'Un conflicto se resuelve con la acción sugerida (enlace directo) o se descarta con motivo solo si no es bloqueante.',
    ],
    severidades: [
      { id: 'bloqueante', nombre: 'Bloqueante', badge: 'danger', nota: 'Inactiva el objeto y detiene los envíos que dependen de él' },
      { id: 'advertencia', nombre: 'Advertencia', badge: 'warning', nota: 'No detiene nada; conviene revisarlo' },
    ],
    // Tipos de conflicto. detecta: condición que se evalúa en vivo. afecta: qué pasa. resolver: acciones sugeridas (enlaces).
    tipos: [
      { id: 'var_no_disponible', modulo: 'Notificaciones', severidad: 'bloqueante', nombre: 'Variable no disponible en una plantilla',
        detecta: 'Una plantilla activa usa una variable con «Disponible» apagado', afecta: 'La plantilla pasa a «Inactiva por conflicto» y las reglas que la usan quedan «Pausadas por conflicto» en ese canal',
        resolver: ['Reactivar la variable', 'Editar la plantilla y reemplazar la variable'] },
      { id: 'var_inexistente', modulo: 'Notificaciones', severidad: 'bloqueante', nombre: 'Variable que ya no existe',
        detecta: 'Una plantilla usa {{campo.<clave>}} de un campo personalizado inactivo o eliminado', afecta: 'Igual que el anterior',
        resolver: ['Reactivar el campo personalizado', 'Editar la plantilla'] },
      { id: 'regla_sin_plantilla', modulo: 'Notificaciones', severidad: 'bloqueante', nombre: 'Regla sin plantilla activa',
        detecta: 'Una regla activa usa una plantilla inactiva, en borrador o sin variante para uno de sus canales', afecta: 'La regla se pausa en ese canal; los demás canales siguen',
        resolver: ['Editar la plantilla', 'Cambiar la plantilla de la regla', 'Quitar el canal de la regla'] },
      { id: 'whatsapp_rechazada', modulo: 'Notificaciones', severidad: 'bloqueante', nombre: 'Plantilla de WhatsApp rechazada por Meta',
        detecta: 'Meta rechazó la versión enviada a revisión y no hay una versión aprobada anterior', afecta: 'WhatsApp se omite y la regla usa su siguiente canal',
        resolver: ['Editar la variante de WhatsApp y reenviar a revisión'] },
      { id: 'gmail_vencido', modulo: 'Notificaciones', severidad: 'advertencia', nombre: 'Permiso de Gmail vencido',
        detecta: 'Un usuario con casos a su cargo tiene la conexión de Gmail «Permiso vencido» o «Sin conectar»', afecta: 'Sus correos salen de la cuenta institucional',
        resolver: ['Reenviar la invitación para conectar Gmail'], destinatarioExtra: 'El propio usuario' },
      { id: 'sin_consentimiento', modulo: 'Notificaciones', severidad: 'advertencia', nombre: 'Regla a clientes solo por WhatsApp o SMS',
        detecta: 'Una regla a «Asegurado o contacto» no tiene Correo entre sus canales', afecta: 'Los clientes sin consentimiento no reciben el aviso',
        resolver: ['Agregar Correo a la regla'] },
      { id: 'filtro_campo_inactivo', modulo: 'Campos personalizados', severidad: 'advertencia', nombre: 'Filtro guardado con un campo inactivo',
        detecta: 'Un filtro guardado de la Bandeja usa un campo personalizado inactivo', afecta: 'El filtro ignora ese campo',
        resolver: ['Reactivar el campo', 'Editar el filtro'] },
      { id: 'catalogo_valor', modulo: 'Catálogos maestros', severidad: 'advertencia', nombre: 'Valor fuera de catálogo',
        detecta: 'Un caso activo tiene marca o modelo «Revisar: no está en el catálogo», o un equipo con tipo «Otro (describir)»', afecta: 'El informe precarga «Por confirmar»; el equipo «Otro» se acepta con su descripción',
        resolver: ['Agregar al catálogo', 'Abrir el caso'] },
      { id: 'sla_sin_responsable', modulo: 'Flujo y SLA', severidad: 'advertencia', nombre: 'Sucursal sin coordinador',
        detecta: 'Una sucursal con casos activos no tiene Coordinador asignado en Flujo y SLA › Responsables', afecta: 'Sus casos muestran «Por asignar»',
        resolver: ['Asignar coordinador'] },
      // Etapa 16f-1 · DEC-145: validación del editor de flujos.
      { id: 'flujo_invalido', modulo: 'Flujo y SLA', severidad: 'bloqueante', nombre: 'Borrador de flujo con errores',
        detecta: 'Un borrador de flujo abierto o editado no pasa la validación: estado sin salida o inalcanzable, transición duplicada, transición manual sin rol con permisos, sin un único estado inicial o sin un estado de núcleo', afecta: 'No se puede publicar; la versión vigente sigue rigiendo los casos',
        resolver: ['Abrir el borrador del flujo'] },
    ],
    // Conflictos que el prototipo no puede calcular (respuesta externa). Se suman a los calculados.
    semilla: [
      { tipo: 'whatsapp_rechazada', objeto: 'enlace_autoinspeccion', detalle: 'Meta rechazó «autoinspeccion_enlace_v3» el 17/10/26 · 09:40: «El botón lleva a un dominio no verificado».', desde: '2026-10-17T09:40',
        nota: 'Tiene versión aprobada anterior (v2), así que en el prototipo queda como advertencia, no bloqueante' },
    ],
    // Ejemplo calculado que debe aparecer con los datos actuales: Mónica Ríos «Permiso vencido» (gmail_vencido, advertencia).
    estados: ['Abierto', 'Resuelto', 'Descartado'],
    campana: { a: 'Administrador', texto: { abre: 'Conflicto de configuración: {objeto} · {tipo}', resuelve: 'Se resolvió el conflicto de {objeto}; volvió a estar activa' }, agrupa: 'Uno por objeto y tipo' },
  };
  K.tipo = (id) => K.tipos.find(t => t.id === id) || null;
  window.SIRIUS_CONFLICTOS = K;
})();
