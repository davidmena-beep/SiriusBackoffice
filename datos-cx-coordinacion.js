// SIRIUS · Coordinación con la conexión: visitas de la base (visitasBase) y casos con número de un caso de ejemplo (v1.0 · provisional · etapa P-6e-3 · 18/10/2026)
// Decisiones: DEC-200 (con la conexión, ningún dato de un caso de la base sale de un caso de ejemplo) y DEC-209 (enlaces de la visita).
// Forma del contrato (SIRIUS_CONEXION.casos[i].visitasBase): [{ n, modalidad, estado ('Por agendar' | 'Agendada' | 'En curso' | 'Terminada' | 'Cancelada'), inicio, fin, agendadoEn,
//   origen, inspector, enlace: { tipo ('Autoagendamiento' | 'Autoinspección'), estado ('Vigente' | 'En curso' | 'Usado' | 'Vencido' | 'Invalidado'), vence, url } | null,
//   enlaces: [{ tipo, estado, enviadoEn, canal, vence }] }].
// Acciones que acepta la base: enviarEnlace { caso, canal, destinatario, modalidad, tipo } (crea la visita y el enlace e invalida solo el anterior del mismo tipo),
// reenviarEnlace { caso, tipo, canal } (reenvía el mismo enlace vigente), cancelarVisita { caso, visita, modalidad, motivo } (G-2c9: cancela esa visita exacta, la «Vn» de la tarjeta; sin «visita» cancelaba la abierta más reciente de la modalidad;
// responde { ok: false, mensaje: 'La visita V2 está cancelada: no se puede cancelar' } si no está abierta) e invalida sus enlaces y agendarVisita (como hoy, para reagendar).
// cxEscenas: escenas que arman la conexión simulada solo en esa pantalla (cxSimBoot); se limpia al cambiar de escena.
(function () {
  const U = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones', 'Administrador'] };
  // Caso de la base: ninguna persona, placa ni fecha es de un caso de ejemplo con el mismo número.
  const caso = (id, extra) => Object.assign({ id: id, orden: 'EMI-2026-118' + id.slice(-3), origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Seguros Pacífico Brokers', asegurado: 'Mónica Villacís Paz', ident: '1714409821', placa: 'PDQ4072', bien: 'Placa PDQ4072, 2022',
    fecha: '2026-10-17', registrado: '2026-10-17T16:05', sucursal: 'Quito', backoffice: 'Andrea Salazar', estado: 'En coordinación', responsable: 'Andrea Salazar', comercial: 'Carolina Vega', flujoVersion: 2,
    solicitud: { marca: 'Toyota', modelo: 'Corolla Cross', anio: 2022, placa: 'PDQ4072', carroceria: 'SUV', sumaAsegurada: 24500, formularios: ['Vehículos livianos'] },
    contacto: { nombre: 'Mónica Villacís', cel: '0998815530', correo: 'monica.villacis@correo.ec' }, consentimiento: { whatsapp: true, sms: true, correo: true }, dir: 'Av. 6 de Diciembre N33-42 y Bossano, Quito' }, extra || {});
  const url = (tipo, tk) => 'https://clientes.asur.ec/' + (tipo === 'Autoinspección' ? 'autoinspeccion' : 'agendar') + '?token=' + tk;
  const visitas = {
    // Visita «Por agendar» con enlace de Autoinspección vigente (se envió el 18/10 a las 09:12 por WhatsApp; vence en 48 h).
    autoinspeccion: [{ n: 1, modalidad: 'Autoinspección', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-10-18T09:12', origen: 'Coordinador', inspector: '',
      enlace: { tipo: 'Autoinspección', estado: 'Vigente', vence: '2026-10-20T09:12', url: url('Autoinspección', 'AI-7Q2K9X') },
      enlaces: [{ tipo: 'Autoinspección', estado: 'Vigente', enviadoEn: '2026-10-18T09:12', canal: 'WhatsApp', vence: '2026-10-20T09:12' }] }],
    // Visita «Por agendar» con enlace de Autoagendamiento vigente (el cliente todavía no elige la fecha).
    autoagendamiento: [{ n: 1, modalidad: 'Presencial', estado: 'Por agendar', inicio: null, fin: null, agendadoEn: '2026-10-18T10:40', origen: 'Coordinador', inspector: '',
      enlace: { tipo: 'Autoagendamiento', estado: 'Vigente', vence: '2026-10-19T10:40', url: url('Autoagendamiento', 'AG-3M8P1D') },
      enlaces: [{ tipo: 'Autoagendamiento', estado: 'Invalidado', enviadoEn: '2026-10-17T16:30', canal: 'SMS', vence: '2026-10-18T16:30' }, { tipo: 'Autoagendamiento', estado: 'Vigente', enviadoEn: '2026-10-18T10:40', canal: 'WhatsApp', vence: '2026-10-19T10:40' }] }],
  };
  // G-2c9: 50012 con cuatro visitas presenciales (V1, V3 y V4 abiertas; V2 cancelada) para comprobar que «Cancelar visita» lleva el número de la tarjeta.
  const pres = (n, estado, ini, fin, ins, extra) => Object.assign({ n: n, modalidad: 'Presencial', estado: estado, inicio: ini, fin: fin, agendadoEn: '2026-10-17T16:30', origen: 'Coordinador', inspector: ins, enlace: null, enlaces: [] }, extra || {});
  visitas.cancelarnumero = [pres(1, 'Agendada', '2026-10-19T09:00', '2026-10-19T09:45', 'Mauricio Endara'), pres(2, 'Cancelada', '2026-10-19T14:00', '2026-10-19T14:45', 'Marco Tapia', { motivoCancelacion: 'El cliente cambió la fecha' }),
    pres(3, 'Agendada', '2026-10-20T10:00', '2026-10-20T10:45', 'Diana Cárdenas'), pres(4, 'Agendada', '2026-10-21T15:00', '2026-10-21T15:45', 'Cristian Vaca')];
  const sim = (id, vis, extra) => { const c = caso(id, Object.assign({ visitasBase: JSON.parse(JSON.stringify(vis)) }, extra || {}));
    const eventos = [
      { hora: '2026-10-17T16:05', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' },
      { hora: vis[0].agendadoEn, accion: vis[0].enlace ? 'Enlace enviado' : 'Visita agendada', detalle: vis[0].enlace ? vis[0].enlace.tipo + ' · WhatsApp al 0998815530' : 'Presencial · ' + (vis[0].inspector || ''), actor: 'Andrea Salazar', rol: 'Coordinador de inspecciones' } ];
    return { usuario: U, casos: [c], detalles: {}, eventos: { [id]: eventos }, evidencias: { [id]: [] }, controles: { [id]: [] }, informes: { [id]: [] }, calificaciones: { [id]: [] } }; };
  window.SIRIUS_CX_COORD = {
    version: '1.0',
    // escena → [caso, conjunto de visitas, pestaña del caso (1 = Coordinación)]
    cxEscenas: { cxvisitaenlace: ['30031', 'autoinspeccion'], cxvisitacancelar: ['30031', 'autoinspeccion'], cxcancelarvisitanumero: ['50012', 'cancelarnumero'], cxnumerocruce: ['30007', 'autoagendamiento'] },
    cxSim: function (escena) { const e = this.cxEscenas[escena]; if (!e) return null; let vv = visitas[e[1]], desfase = null;
      if (escena === 'cxcancelarvisitanumero') { const f = (function () { try { return new URLSearchParams(location.search).get('fvisita') || ''; } catch (er) { return ''; } })(); window.__sirCancelUltima = null;
        if (f === '2') { vv = JSON.parse(JSON.stringify(vv)); vv[1] = Object.assign(vv[1], { estado: 'Agendada', inicio: '2026-10-19T14:00', fin: '2026-10-19T14:45', inspector: 'Marco Tapia', motivoCancelacion: undefined }); desfase = { n: 2 }; /* la pantalla aún la ve «Agendada»; en la base otra persona ya la canceló */ } }
      const X = sim(e[0], vv); if (desfase) X.cxDesfase = desfase; return X; },
    // Base simulada de las escenas: aplica las acciones de visitas sobre SIRIUS_CONEXION.casos[i].visitasBase (como lo haría la base) y devuelve el enlace.
    aplicar: function (X, tipo, d) { const c = ((X && X.casos) || []).find((x) => x && String(x.id) === String((d || {}).caso)); if (!c) return null; const V = c.visitasBase = c.visitasBase || [];
      const E = window.SIRIUS_EJEMPLO || {}, a = typeof E.ahora === 'function' ? E.ahora() : null, two = (n) => (n < 10 ? '0' : '') + n;
      const iso = (t) => t.getFullYear() + '-' + two(t.getMonth() + 1) + '-' + two(t.getDate()) + 'T' + two(t.getHours()) + ':' + two(t.getMinutes());
      const now = a instanceof Date ? a : new Date(2026, 9, 18, 20, 30), mas = (h) => iso(new Date(now.getTime() + h * 3600000)), abierta = (v) => v && ['Terminada', 'Cancelada'].indexOf(v.estado) < 0;
      if (tipo === 'reenviarEnlace') { const v = V.find((x) => abierta(x) && x.enlace && x.enlace.tipo === d.tipo && x.enlace.estado === 'Vigente'); if (!v) return { ok: false, mensaje: 'No hay un enlace vigente de ' + d.tipo + ' para reenviar' };
        v.enlaces = (v.enlaces || []).concat([{ tipo: d.tipo, estado: 'Vigente', enviadoEn: iso(now), canal: d.canal || '', vence: v.enlace.vence, reenvio: true }]); return { enlace: v.enlace.url }; }
      if (tipo === 'enviarEnlace') { const tk = (d.tipo === 'Autoinspección' ? 'AI-' : 'AG-') + Math.random().toString(36).slice(2, 8).toUpperCase(), enl = { tipo: d.tipo, estado: 'Vigente', vence: mas(d.tipo === 'Autoinspección' ? 48 : 24), url: url(d.tipo, tk) };
        V.forEach((x) => { if (x.enlace && x.enlace.tipo === d.tipo && x.enlace.estado === 'Vigente') { x.enlace = Object.assign({}, x.enlace, { estado: 'Invalidado' }); (x.enlaces || []).forEach((y) => { if (y.tipo === d.tipo && y.estado === 'Vigente') y.estado = 'Invalidado'; }); } });
        let v = V.find((x) => abierta(x) && x.estado === 'Por agendar' && x.modalidad === d.modalidad); if (!v) { v = { n: V.reduce((m, x) => Math.max(m, x.n || 0), 0) + 1, modalidad: d.modalidad, estado: 'Por agendar', inicio: null, fin: null, agendadoEn: iso(now), origen: 'Coordinador', inspector: '', enlaces: [] }; V.push(v); }
        v.enlace = enl; v.enlaces = (v.enlaces || []).concat([{ tipo: d.tipo, estado: 'Vigente', enviadoEn: iso(now), canal: d.canal || '', vence: enl.vence }]); return { enlace: enl.url }; }
      if (tipo === 'cancelarVisita') { try { window.__sirCancelUltima = JSON.parse(JSON.stringify({ tipo: tipo, datos: d })); } catch (er) { /* nada */ }
        let v;
        if (d.visita != null) { v = V.find((x, i) => (x.n || i + 1) === d.visita); if (!v) return { ok: false, mensaje: 'La visita V' + d.visita + ' no existe en el caso ' + c.id }; if (X.cxDesfase && X.cxDesfase.n === d.visita && abierta(v)) { v.estado = 'Cancelada'; v.motivoCancelacion = 'Cancelada por otra persona'; (v.enlaces || []).forEach((y) => { if (y.estado === 'Vigente' || y.estado === 'En curso') y.estado = 'Invalidado'; }); }
          if (!abierta(v)) return { ok: false, mensaje: 'La visita V' + d.visita + ' está ' + String(v.estado).toLowerCase() + ': no se puede cancelar' }; if (d.modalidad && v.modalidad !== d.modalidad) return { ok: false, mensaje: 'La visita V' + d.visita + ' es ' + v.modalidad + ', no ' + d.modalidad }; }
        else { v = V.slice().reverse().find((x) => abierta(x) && x.modalidad === d.modalidad); if (!v) return { ok: false, mensaje: 'No hay una visita abierta de ' + d.modalidad }; } /* sin «visita»: la abierta más reciente de la modalidad (como la base antes del SQL 43) */
        v.estado = 'Cancelada'; v.motivoCancelacion = d.motivo || ''; if (v.enlace) v.enlace = Object.assign({}, v.enlace, { estado: 'Invalidado' }); (v.enlaces || []).forEach((y) => { if (y.estado === 'Vigente' || y.estado === 'En curso') y.estado = 'Invalidado'; }); return {}; }
      return null; },
    // Datos que no deben aparecer en 30007 de la base (vienen del caso de ejemplo 30007 de «Informes por completar»).
    ejemplo30007: ['PCD5521', 'Mauricio Endara', 'Carolina Mejía', 'Renault', 'Duster'],
  };
})();
