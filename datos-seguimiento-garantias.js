// SIRIUS · Garantías después de la calificación: endosos al BPM, ampliación y cierre (v2 · provisional · etapa 16g · 31/10/2026)
// Fuente única de: reglas de endoso con el BPM de Emisión, solicitudes de ampliación de plazo y de cierre, y su
// estado en los casos de ejemplo. Las garantías, plazos y respaldos de cada caso siguen en el Back-office
// (seguimientos por caso); este archivo no los repite. Los recordatorios NO van aquí: son reglas del módulo de
// Notificaciones (etapa 10n).
(function () {
  const G = {
    version: '2', vigencia: 'Provisional',
    // ---------- Responsable del seguimiento ----------
    responsable: 'Ejecutivo comercial', // gestiona el cumplimiento en el módulo Garantías
    // ---------- Endosos con el BPM de Emisión ----------
    endosos: [
      { id: 'inclusion', nombre: 'Inclusión de garantías', cuando: 'Al grabar la calificación final con garantías (Calificador o Suscriptor según el caso)',
        sinPoliza: 'Queda «En cola» y se envía solo cuando el BPM confirma la emisión', datos: ['Caso', 'Póliza', 'Garantías con su plazo', 'Fecha límite', 'Calificador final'] },
      { id: 'cumplimiento', nombre: 'Cumplimiento de garantías', cuando: 'Al marcar una o más garantías como Cumplido (agrupa las cumplidas en el mismo acto)',
        sinPoliza: 'Queda «En cola» hasta la emisión', datos: ['Caso', 'Póliza', 'Garantías cumplidas', 'Cómo se cumplió (respaldo o caso hijo)', 'Fecha'] },
      { id: 'plazo', nombre: 'Modificación del plazo de garantías', cuando: 'Al aprobarse una ampliación de plazo',
        sinPoliza: 'Queda «En cola» hasta la emisión', datos: ['Caso', 'Póliza', 'Fecha límite anterior', 'Nueva fecha límite', 'Motivo'] },
    ],
    estadosEndoso: [
      { id: 'cola', nombre: 'En cola', badge: 'neutral', nota: 'Sin póliza todavía' },
      { id: 'enviado', nombre: 'Enviado', badge: 'brand' },
      { id: 'aplicado', nombre: 'Aplicado', badge: 'success' },
      { id: 'rechazado', nombre: 'Rechazado', badge: 'danger', nota: 'Muestra el motivo del BPM; el Ejecutivo comercial puede reenviar' },
    ],
    // Operaciones nuevas con el BPM (provisional; van a la sección 5 del anexo).
    bpm: [
      { operacion: 'Solicitud de endoso de garantías', sentido: 'SIRIUS → BPM de Emisión', tipos: ['Inclusión de garantías', 'Cumplimiento de garantías', 'Modificación del plazo de garantías'] },
      { operacion: 'Respuesta de endoso', sentido: 'BPM de Emisión → SIRIUS', respuestas: ['Aplicado', 'Rechazado'] },
      { operacion: 'Consulta de vigencia de póliza', sentido: 'SIRIUS → BPM de Emisión', respuestas: ['Vigente', 'No vigente (cancelada, anulada o vencida)'] },
    ],
    // ---------- Ampliación de plazo ----------
    ampliacion: {
      solicita: 'Ejecutivo comercial', aprueba: 'Calificador final del caso (Suscriptor si dictaminó; si no, el Ejecutivo de inspecciones que calificó)',
      cuando: 'Con el conjunto Pendiente o Vencido', maxVeces: 2, maxDias: 30, motivo: true,
      alAprobar: 'Nueva fecha límite para todo el conjunto; el estado vuelve a Pendiente si estaba Vencido; genera el endoso de Modificación del plazo',
      alRechazar: 'Queda la fecha anterior; el motivo del rechazo se ve en el Historial',
    },
    // ---------- Cierre por póliza no vigente ----------
    cierre: {
      solicita: 'Ejecutivo comercial', motivo: true,
      validacion: 'SIRIUS consulta la vigencia de la póliza al BPM; si no está vigente, cierra el seguimiento sin endoso',
      siVigente: 'No se cierra; se explica en línea que la póliza sigue vigente',
      estadoFinal: 'Cerrado por póliza no vigente',
    },
    estadosSolicitud: ['Solicitada', 'Aprobada', 'Rechazada'],
    // ---------- Casos de ejemplo ----------
    // 20178 (Emitida, POL-2026-113870, calificador final Ricardo Almeida): base 07/09/26 + 30 días = vence 07/10/26;
    // g2 cumplida por 20178-G1 (24/09); g1 y g3 pendientes; respaldo de g1 subido el 15/10.
    casos: {
      '20178': {
        poliza: 'POL-2026-113870', calificadorFinal: 'Ricardo Almeida',
        endosos: [
          { tipo: 'inclusion', estado: 'aplicado', fecha: '2026-09-07T10:15', respuesta: '2026-09-08T16:40', garantias: ['g1', 'g2', 'g3'] },
          { tipo: 'cumplimiento', estado: 'aplicado', fecha: '2026-09-24T15:30', respuesta: '2026-09-25T09:10', garantias: ['g2'] },
        ],
        solicitudes: [
          { tipo: 'ampliacion', estado: 'Solicitada', fecha: '2026-10-15T11:30', por: 'Santiago Ortiz', dias: 20, nuevaFecha: '2026-10-27',
            motivo: 'El cliente subió la factura del regulador; la UPS se instala la semana del 19/10' },
        ],
      },
      // 20158 (Inspeccionado, sin póliza): las garantías ya están establecidas; g1 cumplida por 20158-G1.
      '20158': {
        poliza: null, calificadorFinal: 'Verónica Lema',
        endosos: [
          { tipo: 'inclusion', estado: 'cola', fecha: '2026-09-15T12:00', garantias: ['g1', 'g2'] },
          { tipo: 'cumplimiento', estado: 'cola', fecha: '2026-09-28T17:05', garantias: ['g1'] },
        ],
        solicitudes: [],
      },
    },
  };
  G.endoso = (id) => G.endosos.find(e => e.id === id) || null;
  G.estadoEndoso = (id) => G.estadosEndoso.find(e => e.id === id) || null;
  // Valida una ampliación: '' si vale o el mensaje.
  G.validarAmpliacion = (caso, dias) => {
    const c = G.casos[caso] || { solicitudes: [] }, hechas = c.solicitudes.filter(s => s.tipo === 'ampliacion' && s.estado === 'Aprobada').length;
    if (c.solicitudes.some(s => s.estado === 'Solicitada')) return 'Ya hay una solicitud pendiente de aprobación.';
    if (hechas >= G.ampliacion.maxVeces) return 'Ya se usaron las ' + G.ampliacion.maxVeces + ' ampliaciones permitidas.';
    if (!(dias >= 1 && dias <= G.ampliacion.maxDias)) return 'La ampliación va de 1 a ' + G.ampliacion.maxDias + ' días.';
    return '';
  };
  window.SIRIUS_SEGUIMIENTO = G;
})();
