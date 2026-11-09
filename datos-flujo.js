// SIRIUS · Flujo, SLA y responsables del caso (v1.3 · provisional · etapa C2-3 · 08/11/2026)
// v1.3 (etapa C2-3 · DEC-180): estado «Informe por completar» entre «En curso» y la determinación o la calificación (Vehículos presencial y
// virtual guiada; Ramos Generales presencial), con su etapa de SLA de 24 h hábiles desde el fin de la visita, alerta al 80 % (alertaPct) y tarea
// al Coordinador al vencer; responsable «completa» (el inspector o el Control de calidad de su agencia); transiciones nuevas.
// v1.2: feriados leídos en cada cálculo (se pueden agregar en memoria) y feriados de sucursal ({ alcance: 'Sucursal', sucursal }).
// v1.1: ingresos de demo para calveh, calvehapply y g1cal; calcular devuelve null si falta el ingreso; registrarIngreso().
// Fuente única de: estados y su presentación, transiciones, SLA por etapa y grupo de ramo, calendario hábil
// (jornada y feriados), regla de responsable por estado, reasignación y fecha de ingreso a la etapa de cada caso activo.
// El SLA restante se CALCULA (nunca se escribe a mano): calcular(caso) → horas hábiles restantes (negativas si venció).
// Reloj: SIRIUS_EJEMPLO.ahora() (18/10/2026 · 20:30, domingo). Fechas futuras solo en visitas programadas.
(function () {
  const F = {
    version: '1.3', vigencia: 'Provisional',
    // ---------- Calendario hábil ----------
    calendario: {
      zona: 'America/Guayaquil',
      dias: [1, 2, 3, 4, 5],                          // lunes a viernes
      jornada: [['08:30', '13:00'], ['14:00', '17:30']], // 8 h hábiles por día
      horasDia: 8,
      // Feriados nacionales 2026 (calendario oficial del Viceministerio de Turismo; 02/01 por decreto).
      feriados: [
        ['2026-01-01', 'Año Nuevo'], ['2026-01-02', 'Año Nuevo (decreto)'], ['2026-02-16', 'Carnaval'], ['2026-02-17', 'Carnaval'],
        ['2026-04-03', 'Viernes Santo'], ['2026-05-01', 'Día del Trabajo'], ['2026-05-25', 'Batalla de Pichincha (trasladado del 24/05)'],
        ['2026-08-10', 'Primer Grito de Independencia'], ['2026-10-09', 'Independencia de Guayaquil'], ['2026-11-02', 'Día de los Difuntos'],
        ['2026-11-03', 'Independencia de Cuenca'], ['2026-12-25', 'Navidad'],
      ].map(([fecha, nombre]) => ({ fecha, nombre, alcance: 'Nacional', origen: 'Viceministerio de Turismo' })),
      // Feriados de sucursal: se agregan a feriados con { alcance: 'Sucursal', sucursal }. Sin datos (insumo del negocio).
    },
    // ---------- Semáforo ----------
    porVencerHoras: 4, // Por vencer cuando restan 4 h hábiles o menos
    // ---------- Etapas con SLA (horas hábiles por grupo de ramo) ----------
    // El reloj corre desde el ingreso a la etapa y no se pausa (MVP). Desde Inspeccionado no hay SLA ("—").
    etapas: [
      { id: 'coord', nombre: 'Coordinación', estados: ['Registrado', 'En coordinación', 'Reaperturado', 'Enlace caducado'], inicio: 'Registro del caso o reapertura', fin: 'Todos los riesgos con visita (Agendado)', sla: { 'Vehículos': 24, 'Ramos Generales': 24 }, hito: { nombre: 'Primer contacto', horas: 4, nota: 'Indicador; no cambia el Badge' } },
      { id: 'agenda', nombre: 'Visita agendada', estados: ['Agendado'], inicio: 'Visita confirmada', fin: 'Inicio de la visita (En curso)', venceCon: 'visita', toleranciaHoras: 2, nota: 'Vence 2 h hábiles después del fin de la franja de la visita más próxima' },
      { id: 'informe', nombre: 'Ejecución e informe', estados: ['En curso'], inicio: 'Fin de la franja de la visita', fin: 'Informe enviado', sla: { 'Vehículos': 8, 'Ramos Generales': 24 } },
      // Etapa C2-3 · DEC-180: el plazo corre desde el fin de la visita en la app; alerta al 80 % del plazo; vencido → tarea al Coordinador. Devuelto y reenviado: el plazo se reinicia.
      { id: 'completar', nombre: 'Completar el informe', estados: ['Informe por completar'], inicio: 'Fin de la visita en la app (datos de campo y criterio del inspector)', fin: 'Informe completado y enviado (determinación o calificación)', sla: { 'Vehículos': 24, 'Ramos Generales': 24 }, alertaPct: 80, alVencer: 'Tarea al Coordinador de la sucursal', reinicio: 'Al reenviar un informe devuelto al inspector' },
      { id: 'devuelto', nombre: 'Corrección del informe', estados: ['Devuelto al inspector'], inicio: 'Devolución', fin: 'Informe reenviado', sla: { 'Vehículos': 8, 'Ramos Generales': 16 } },
      { id: 'cal', nombre: 'Calificación', estados: ['Pendiente calificación'], inicio: 'Envío a calificación', fin: 'Calificación grabada o derivada', sla: { 'Vehículos': 8, 'Ramos Generales': 16 } },
      { id: 'susc', nombre: 'Suscripción', estados: ['Pendiente calificación de suscripción'], inicio: 'Derivación del nivel 1', fin: 'Dictamen del Suscriptor', sla: { 'Ramos Generales': 16 } },
    ],
    // ---------- Estados (nombre interno = el que ya usa el código) ----------
    // tipo: flujo · transversal · cierre. resp: regla de responsable (ver responsables).
    estados: [
      ['Registrado', 'Registrado', 'neutral', 'flujo', 'coordinador'],
      ['En coordinación', 'En coordinación', 'brand', 'flujo', 'coordinador'],
      ['Agendado', 'Agendado', 'brand', 'flujo', 'inspector'],
      ['En curso', 'En curso', 'teal', 'flujo', 'inspector'],
      ['Informe por completar', 'Por completar', 'warning', 'flujo', 'completa'], // etapa C2-3 · DEC-180
      ['Pendiente calificación', 'En calificación', 'warning', 'flujo', 'ejecutivo'],
      ['Pendiente calificación de suscripción', 'En suscripción', 'warning', 'flujo', 'suscriptor'],
      ['Inspeccionado', 'Inspeccionado', 'success', 'flujo', 'inspeccionado'],
      ['Enviado a emisión', 'En emisión', 'brand', 'flujo', 'bpm'],
      ['Emitida', 'Emitida', 'teal', 'cierre', 'ninguno'],
      ['No emitida', 'No emitida', 'neutral', 'cierre', 'ninguno'],
      ['Devuelto al inspector', 'Devuelto', 'warning', 'transversal', 'inspector'],
      ['Cancelado', 'Cancelado', 'neutral', 'cierre', 'ninguno'],
      ['Reaperturado', 'Reaperturado', 'brand', 'transversal', 'coordinador'],
      ['Enlace caducado', 'Enlace caducado', 'danger', 'transversal', 'coordinador'],
    ].map(([nombre, corta, badge, tipo, resp]) => ({ nombre, corta, badge, tipo, resp, sistema: true })),
    // Alias de datos heredados (se normalizan al cargar).
    alias: { 'En calificación': 'Pendiente calificación', 'En suscripción': 'Pendiente calificación de suscripción', 'Devuelto': 'Devuelto al inspector', 'En emisión': 'Enviado a emisión' },
    // ---------- Responsable actual ----------
    responsables: {
      coordinador: { etiqueta: 'Coordinador de inspecciones', regla: 'Coordinador asignado a la sucursal del caso' },
      inspector: { etiqueta: 'Inspector de la visita', regla: 'Inspector de la visita más próxima sin terminar (Devuelto: quien registró el informe)' },
      completa: { etiqueta: 'Quien completa el informe', regla: 'Inspector interno o independiente: él mismo · Inspector de agencia: el Control de calidad de su agencia (o el propio inspector en el back-office si la agencia lo permite)' }, // etapa C2-3 · DEC-180
      ejecutivo: { etiqueta: 'Ejecutivo de inspecciones responsable', regla: 'Ejecutivo responsable del caso' },
      suscriptor: { etiqueta: 'Suscriptor', regla: 'Suscriptor asignado al grupo de ramo' },
      inspeccionado: { etiqueta: 'Ejecutivo de inspecciones (con orden) o Ejecutivo comercial (sin orden)', regla: 'Con orden de emisión: Ejecutivo responsable · Sin orden: Ejecutivo comercial, que debe crearla' },
      bpm: { etiqueta: 'BPM de Emisión', regla: 'Sistema externo' },
      ninguno: { etiqueta: '—', regla: 'Caso cerrado' },
    },
    coordinadorPorSucursal: { '*': 'Andrea Salazar' },
    suscriptorPorGrupo: { 'Ramos Generales': 'Ricardo Almeida' },
    // ---------- Transiciones (del sistema; el editor visual de flujos es Próximamente) ----------
    // [de, a, acción, quién, motivo obligatorio]
    transiciones: [
      ['—', 'Registrado', 'Crear solicitud (BPM de Emisión, Sur One o Manual)', 'Sistema · Administrador · Ejecutivo comercial · Coordinador', false],
      ['Registrado', 'En coordinación', 'Registrar el primer intento de contacto o enviar el enlace de autoagendamiento', 'Coordinador · Administrador', false],
      ['Reaperturado', 'En coordinación', 'Registrar el primer intento de contacto o enviar el enlace', 'Coordinador · Administrador', false],
      ['En coordinación', 'Agendado', 'Todos los riesgos con visita y fecha', 'Coordinador · Administrador · cliente (autoagendamiento)', false],
      ['Agendado', 'En coordinación', 'Reagendar sin nueva fecha o quitar la visita de un riesgo', 'Coordinador · Administrador', true],
      ['Agendado', 'Enlace caducado', 'Vence el enlace de autoinspección sin envío', 'Sistema', false],
      ['Enlace caducado', 'Agendado', 'Reenviar el enlace con nuevo plazo', 'Coordinador · Administrador', false],
      ['Enlace caducado', 'En coordinación', 'Cambiar de modalidad', 'Coordinador · Administrador', true],
      ['Agendado', 'En curso', 'Iniciar la visita (o primer riesgo en ejecución)', 'Inspector · cliente (autoinspección)', false],
      ['En curso', 'Informe por completar', 'Terminar la visita en la app (datos de campo y criterio del inspector) · inicia el plazo de 24 h hábiles', 'Inspector', false], // etapa C2-3 · DEC-180 (flujos v2)
      ['Informe por completar', 'Inspeccionado', 'Completar y enviar: Asegurable o No asegurable dentro de la facultad del inspector (Control de calidad: confirmar el criterio)', 'Inspector · Control de calidad (agencia) · Administrador', false],
      ['Informe por completar', 'Pendiente calificación', 'Completar y enviar a calificación (sin facultad, «Enviar a calificación» o criterio cambiado por el Control de calidad, con los dos criterios)', 'Inspector · Control de calidad (agencia) · Administrador', false],
      ['Informe por completar', 'Devuelto al inspector', 'Devolver al inspector', 'Control de calidad (agencia) · Administrador', true],
      ['Devuelto al inspector', 'Informe por completar', 'Reenviar el informe corregido (el plazo de 24 h se reinicia)', 'Inspector', false],
      ['En curso', 'Pendiente calificación', 'Enviar el informe sin facultad, por regla o por decisión del inspector (RG: cuando todos los ramos tienen informe)', 'Inspector · Ejecutivo de inspecciones · Administrador', false],
      ['En curso', 'Inspeccionado', 'Determinación del inspector en todos los riesgos', 'Inspector (con facultad)', false],
      ['Pendiente calificación', 'Devuelto al inspector', 'Devolver el informe con campos señalados', 'Ejecutivo de inspecciones · Administrador', true],
      ['Devuelto al inspector', 'Pendiente calificación', 'Reenviar el informe corregido', 'Inspector', false],
      ['Pendiente calificación', 'Pendiente calificación de suscripción', 'Requerir evaluación de suscripción (RG)', 'Ejecutivo de inspecciones · Administrador', true],
      ['Pendiente calificación', 'Inspeccionado', 'Grabar la calificación de todos los riesgos', 'Ejecutivo de inspecciones · Administrador', false],
      ['Pendiente calificación de suscripción', 'Inspeccionado', 'Dictamen del Suscriptor', 'Suscriptor · Administrador', false],
      ['Inspeccionado', 'Enviado a emisión', 'Envío automático del resultado (caso con orden) o Crear orden de emisión', 'Sistema · Ejecutivo comercial · Administrador', false],
      ['Enviado a emisión', 'Emitida', 'Respuesta del BPM con al menos un riesgo emitido', 'BPM de Emisión', false],
      ['Enviado a emisión', 'No emitida', 'Respuesta del BPM sin riesgos emitidos', 'BPM de Emisión', false],
      ['Registrado · En coordinación · Reaperturado · Agendado · Enlace caducado', 'Cancelado', 'Cancelar por coordinación (motivo de catálogo; "Cliente no contesta" exige 3 intentos)', 'Coordinador · Administrador', true],
      ['Cualquier estado antes de Inspeccionado', 'Cancelado', 'El BPM anula la orden de emisión', 'BPM de Emisión', true],
      ['Cancelado', 'Reaperturado', 'Reaperturar con contactos e instrucciones (solo motivos de coordinación, hasta 30 días)', 'Ejecutivo comercial · Administrador', true],
    ].map(([de, a, accion, quien, motivo]) => ({ de, a, accion, quien, motivo })),
    // ---------- Reasignación ----------
    reasignacion: [
      { que: 'Inspector de una visita', quien: 'Coordinador · Administrador', donde: 'Pestaña Coordinación', motivo: true, efecto: 'Cambia el responsable si el caso está Agendado, En curso o Devuelto; el SLA no se reinicia' },
      { que: 'Ejecutivo de inspecciones responsable', quien: 'Administrador', donde: 'Detalle del caso y selección múltiple en la Bandeja', motivo: true, efecto: 'Cambia el responsable en Calificación e Inspeccionado con orden; el SLA no se reinicia' },
      { que: 'Coordinador por sucursal y Suscriptor por grupo de ramo', quien: 'Administrador', donde: 'Administración › Flujo y SLA › Responsables', motivo: true, efecto: 'Aplica a los casos activos de esa sucursal o grupo, con impacto antes de confirmar' },
      { que: 'Asignación inicial del Ejecutivo de inspecciones', quien: 'Sistema', donde: '—', motivo: false, efecto: 'Menor número de casos activos dentro del grupo de ramo (por defecto)' },
    ],
    // ---------- Ingreso a la etapa de cada caso activo (base) ----------
    // visita: [inicio, fin] de la visita más próxima (solo Agendado).
    ingresos: {
      '20152': { desde: '2026-10-12T09:00' },
      '20186': { desde: '2026-10-15T11:00' },
      '20190': { desde: '2026-10-16T09:15' },
      '20145': { visita: ['2026-10-20T10:00', '2026-10-20T11:00'] },
      '20137-G1': { visita: ['2026-10-19T09:00', '2026-10-19T10:00'] },
      '20166': { desde: '2026-10-14T12:00' },
      '20187': { desde: '2026-10-18T10:00' },
      '20195': { desde: '2026-10-16T12:00' },
      '20170': { desde: '2026-10-14T10:05' },
      '20184': { desde: '2026-10-13T11:00' },
      '20141': { desde: '2026-10-14T16:00' },
      '20181': { desde: '2026-10-15T09:30' },
      '20188': { desde: '2026-10-16T15:00' },
      '20202': { desde: '2026-10-16T15:30' },
      '20204': { desde: '2026-10-15T16:00' }, // etapa 8a · Equipo y maquinaria (3 equipos)
      '20189': { desde: '2026-10-17T15:20' },
      '20200': { desde: '2026-10-15T10:00' },
      '20137': { desde: '2026-10-15T10:12' },
      // Etapa C2-3 · DEC-180: fin de la visita (o reenvío) de los casos en «Informe por completar» y del devuelto por el Control de calidad.
      '30004': { desde: '2026-10-16T11:00' }, '30005': { desde: '2026-10-14T13:50' }, '30006': { desde: '2026-10-16T15:30' }, '30007': { desde: '2026-10-13T15:00' }, '30008': { desde: '2026-10-16T16:40' },
    },
    // Ingresos propios de una demo (?escena=); solo mientras está activa.
    escenas: {
      coord: { '20196': { desde: '2026-10-14T15:30' } }, coordchoque: { '20196': { desde: '2026-10-14T15:30' } }, coordauto: { '20196': { desde: '2026-10-14T15:30' } }, coordvis: { '20196': { desde: '2026-10-14T15:30' } },
      flujoportomar: { '20195': { desde: '2026-10-18T19:40' } }, flujotomar: { '20195': { desde: '2026-10-18T19:40' } }, // etapa 13 · entró a «Revisión técnica» el 18/10 a las 19:40 (16 h hábiles)
      // Etapa 13 · ciclo de vida del enlace: 20186 entró a su estado actual con la historia de cada escena (enlacevencido usa el ingreso que deja la transición T05).
      enlaceciclo: { '20186': { desde: '2026-10-15T09:45' } }, enlaceampliar: { '20186': { desde: '2026-10-12T09:00' } }, enlacerevocar: { '20186': { desde: '2026-10-17T10:00' } }, enlacerevocado: { '20186': { desde: '2026-10-17T10:00' } }, enlacetarea: { '20186': { desde: '2026-10-18T19:30' } }, enlacevencidocurso: { '20186': { desde: '2026-10-07T08:50' } }, // etapa 10b-c · «En curso» desde la primera acción del cliente; al vencer, T05 la deja en «Enlace caducado»
      calveh: { '20196': { desde: '2026-10-16T15:30' } }, calvehapply: { '20196': { desde: '2026-10-16T15:30' } }, // 20196 en calificación: «6 h»
      g1cal: { '20137-G1': { desde: '2026-10-16T13:20' } },
      infcompletarrg: { '20195': { desde: '2026-10-16T12:00' } }, // etapa C2-3 · DEC-180: fin de la visita de 20195 (Ramos Generales, presencial) // hija en calificación: «1 d»
      // Etapa 11b · cola de Calificación: la flota 20196 vuelve a calificación (en los datos está Emitida) con el mismo ingreso que calveh.
      calcola: { '20196': { desde: '2026-10-16T15:30' } }, calcolatodos: { '20196': { desde: '2026-10-16T15:30' } }, calreasignar: { '20196': { desde: '2026-10-16T15:30' } }, calcolaacciones: { '20196': { desde: '2026-10-16T15:30' } }, demousuarios: { '20196': { desde: '2026-10-16T15:30' } },
    },
  };

  // ---------- Cálculo ----------
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parse = (s) => { const [d, t] = s.split('T'), [y, m, dd] = d.split('-').map(Number), [h, mi] = (t || '00:00').split(':').map(Number); return new Date(y, m - 1, dd, h, mi, 0); };
  const min = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  // Día hábil para una sucursal: lee F.calendario.feriados en cada llamada (nacionales y los de esa sucursal).
  F.esHabil = (d, suc) => { const k = iso(d); return F.calendario.dias.includes(d.getDay()) && !F.calendario.feriados.some(f => f.fecha === k && (f.alcance === 'Nacional' || f.sucursal === suc)); };
  // Minutos hábiles entre a y b (a < b).
  F.minutosHabiles = (a, b, suc) => { let t = 0; const d = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    while (d <= b) { if (F.esHabil(d, suc)) F.calendario.jornada.forEach(([i, f]) => { const s = new Date(d.getTime() + min(i) * 60000), e = new Date(d.getTime() + min(f) * 60000), x = Math.max(s, a), y = Math.min(e, b); if (y > x) t += (y - x) / 60000; }); d.setDate(d.getDate() + 1); }
    return Math.round(t); };
  // Fecha en que se cumplen m minutos hábiles desde a.
  F.sumarHabiles = (a, m, suc) => { const d = new Date(a.getFullYear(), a.getMonth(), a.getDate()); let r = m;
    for (let k = 0; k < 400; k++) { if (F.esHabil(d, suc)) for (const [i, f] of F.calendario.jornada) { const s = new Date(d.getTime() + min(i) * 60000), e = new Date(d.getTime() + min(f) * 60000), x = new Date(Math.max(s, a)); if (e > x) { const disp = (e - x) / 60000; if (disp >= r) return new Date(x.getTime() + r * 60000); r -= disp; } } d.setDate(d.getDate() + 1); }
    return null; };
  F.normalizar = (estado) => F.alias[estado] || estado;
  F.estado = (nombre) => F.estados.find(e => e.nombre === F.normalizar(nombre)) || null;
  F.etapaDe = (estado) => F.etapas.find(x => x.estados.includes(F.normalizar(estado))) || null;
  F.grupoDe = (caso) => { const E = window.SIRIUS_EJEMPLO, r = E && E.ramos && E.ramos.find(x => x.nombre === caso.ramo); return r ? r.grupo : (caso.ramo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales'); };
  // Etapa 8a · DEC-141: la configuración (SLA, niveles, honorarios) se resuelve primero por ramo, luego por composición (tipo de objeto del ramo) y por último por grupo.
  F.composicionDe = (caso) => { const E = window.SIRIUS_EJEMPLO, r = E && E.ramos && E.ramos.find(x => x.nombre === caso.ramo); return r ? r.tipoObjeto : (caso.ramo === 'Vehículos' ? 'Vehículo' : 'Ubicación'); };
  F.resolver = (caso, porRamo, porComposicion, porGrupo) => { const r = caso.ramo, c = F.composicionDe(caso), g = F.grupoDe(caso);
    if (porRamo && porRamo[r] != null) return { valor: porRamo[r], por: 'ramo', clave: r }; if (porComposicion && porComposicion[c] != null) return { valor: porComposicion[c], por: 'composición', clave: c }; if (porGrupo && porGrupo[g] != null) return { valor: porGrupo[g], por: 'grupo', clave: g }; return { valor: null, por: '', clave: '' }; };
  F.slaDe = (et, caso) => F.resolver(caso, et.slaPorRamo, et.slaPorComposicion, et.sla).valor;
  // Niveles de calificación por defecto: ramo (SIRIUS_EQUIPOS.calificacion para Equipo y maquinaria) → grupo (SIRIUS_EQUIPOS.grupos).
  F.nivelesDe = (caso) => { const Q = window.SIRIUS_EQUIPOS || {}, pr = {}, pg = {}; if (Q.formulario && Q.calificacion && Q.calificacion.niveles) pr[Q.formulario.ramo] = Q.calificacion.niveles.cantidad; (Q.grupos || []).forEach(x => { if (x.estado !== 'Inactivo') pg[x.nombre] = x.nivelesPorDefecto; }); return F.resolver(caso, pr, null, pg); };
  F.ahora = () => { const E = window.SIRIUS_EJEMPLO; return E && E.ahora ? E.ahora() : parse('2026-10-18T20:30'); };
  // Devuelve null si el estado no tiene SLA; si no, { horas (decimal, negativa si venció), vence (Date), etapa, tono, etiqueta, titulo }.
  F.calcular = (caso, escena) => {
    let et = F.etapaDe(caso.estado), propio = null;
    // Etapa 13 · un estado propio del motor de flujo (p. ej. «Revisión técnica») con etapa de SLA y plazo en horas hábiles se calcula igual que los originales.
    if (!et) { const FM = window.SiriusFlujoMotor, ef = FM && FM.estadoDe ? FM.estadoDe(caso) : null; if (ef && ef.etapa && ef.slaHoras > 0) { propio = ef; et = { nombre: FM.etapaNombre(ef.etapa), propio: true }; } }
    if (!et) return null;
    const ing = (escena && F.escenas[escena] && F.escenas[escena][caso.id]) || F.ingresos[caso.id]; if (!ing) return null;
    if (et.venceCon === 'visita' ? !ing.visita : !ing.desde) return null;
    let vence; const suc = caso.sucursal;
    if (et.venceCon === 'visita') { if (!ing.visita) return null; vence = F.sumarHabiles(parse(ing.visita[1]), et.toleranciaHoras * 60, suc); }
    else { const h = propio ? propio.slaHoras : F.slaDe(et, caso); if (h == null) return null; vence = F.sumarHabiles(parse(ing.desde), h * 60, suc); }
    const now = F.ahora(), m = vence >= now ? F.minutosHabiles(now, vence, suc) : -F.minutosHabiles(vence, now, suc);
    const plazo = et.venceCon === 'visita' ? null : (propio ? propio.slaHoras : F.slaDe(et, caso)); // etapa C2-3: alerta por porcentaje usado (alertaPct)
    const umbral = et.alertaPct && plazo ? plazo * (1 - et.alertaPct / 100) : null, usado = plazo ? Math.max(0, Math.round((plazo - m / 60) / plazo * 100)) : null;
    return Object.assign({ horas: m / 60, vence, etapa: et.nombre, plazo, usado }, F.formato(m / 60, vence, umbral));
  };
  // Casos creados o reaperturados en la sesión: su reloj arranca en el «ahora» del prototipo (solo en memoria).
  F.registrarIngreso = (id) => { if (!id) return; const d = F.ahora(); F.ingresos[id] = { desde: iso(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) }; };
  // Etiqueta del Badge: menos de 8 h → "N h" (menos de 1 h → "N min"); desde 8 h → "N d" (días hábiles de 8 h, hacia abajo).
  F.formato = (h, vence, umbral) => {
    const a = Math.abs(h), m = Math.round(a * 60), hd = F.calendario.horasDia;
    const t = a >= hd ? Math.floor(a / hd) + ' d' : a >= 1 ? Math.floor(a) + ' h' : m + ' min';
    const exacto = Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') + ' hábiles';
    const v = vence ? pad(vence.getDate()) + '/' + pad(vence.getMonth() + 1) + '/' + String(vence.getFullYear()).slice(2) + ' · ' + pad(vence.getHours()) + ':' + pad(vence.getMinutes()) : '';
    if (h < 0) return { tono: 'danger', etiqueta: 'Vencido hace ' + t, titulo: 'SLA vencido hace ' + exacto + ' · venció el ' + v };
    if (h <= (umbral != null ? umbral : F.porVencerHoras)) return { tono: 'warning', etiqueta: t, titulo: 'Por vencer · quedan ' + exacto + ' · vence el ' + v };
    return { tono: 'success', etiqueta: t, titulo: 'En tiempo · quedan ' + exacto + ' · vence el ' + v };
  };
  // Responsable actual según el estado. visitaInspector: inspector de la visita más próxima (si la pantalla lo conoce).
  F.responsable = (caso, visitaInspector) => {
    const e = F.estado(caso.estado); if (!e) return caso.responsable || '—';
    switch (e.resp) {
      case 'coordinador': return F.coordinadorPorSucursal[caso.sucursal] || F.coordinadorPorSucursal['*'];
      case 'inspector': return visitaInspector || caso.inspector || caso.responsable || 'Por asignar';
      case 'completa': { const SC = window.SiriusCompletar; return (SC && SC.quienCompleta ? SC.quienCompleta(caso).nombre : '') || visitaInspector || caso.responsable || 'Por asignar'; }
      case 'ejecutivo': return caso.backoffice;
      case 'suscriptor': return F.suscriptorPorGrupo[F.grupoDe(caso)] || 'Por asignar';
      case 'inspeccionado': return caso.orden ? caso.backoffice : caso.comercial;
      case 'bpm': return 'BPM de Emisión';
      default: return '—';
    }
  };
  window.SIRIUS_FLUJO = F;
})();
