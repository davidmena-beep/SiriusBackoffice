// SIRIUS · Garantías y envíos de notificaciones con la base (v1.0 · provisional · etapa P-6g-2 · 16/11/2026)
// Contrato (SQL 55): SIRIUS_CONEXION.garantias[] = { id, caso, riesgo, codigo, titulo, texto, ramo, prioridad, plazoDias, vence, estado
//   ('Propuesta' | 'Pendiente' | 'En ampliación' | 'Cumplida' | 'Vencida' | 'Retirada'), origen ('Inspector' | 'Calificador' | 'Nivel 2'),
//   respaldo { tipo ('foto' | 'documento' | 'casoHijo'), ruta, nota } | null, cumplidaEn, ampliaciones [{ solicitada, nuevoVence, motivo, estado
//   ('Solicitada' | 'Aprobada' | 'Rechazada' | 'Sin efecto'), resolvio }], endosos [{ tipo ('inclusion' | 'cumplimiento' | 'plazo'), estado ('En cola' |
//   'Enviado' | 'Aplicado' | 'Rechazado'), fecha, motivo }], historial [{ fecha, que, por, motivo? }] }.
// SIRIUS_CONEXION.notificacionesEnvio[] = { id, caso, regla, canal, destinatario, estado ('Enviado' | 'Entregado' | 'Leído' | 'Fallido' | 'Omitido'), contenido, fecha, error }.
// Acciones (responden { ok, mensaje }): definirGarantias, cumplirGarantia, solicitarAmpliacion, resolverAmpliacion, retirarGarantia, cerrarSeguimiento,
// marcarEndoso y reenviarNotificacion. GB.ops aplica las reglas del negocio: la usan la base simulada (datos-cx-garantias.js) y el Back-office, que
// con { ok: true } aplica lo mismo a su copia (GB.L) y con { ok: false } no cambia nada y muestra el mensaje.
// Origen (política del negocio): la recomendación del inspector entra «Propuesta» (origen Inspector); el calificador quita o agrega (Calificador) y el
// nivel 2 revisa (Nivel 2); al grabar la calificación final quedan «Pendientes» con el plazo de la matriz (catálogo, por título y ramo) y su vencimiento.
(function () {
  const GB = { version: '1.0' };
  const clon = (x) => JSON.parse(JSON.stringify(x == null ? null : x)), sd = (s) => String(s == null ? '' : s), z = (n) => String(n).padStart(2, '0');
  GB.X = () => { const X = typeof window !== 'undefined' ? window.SIRIUS_CONEXION : null; return X && X.activo === true ? X : null; };
  GB.activo = () => { const X = GB.X(); return !!(X && Array.isArray(X.garantias)); };
  GB.enviosActivo = () => { const X = GB.X(); return !!(X && Array.isArray(X.notificacionesEnvio)); };
  GB.ahoraIso = () => { const E = window.SIRIUS_EJEMPLO || {}, a = typeof E.ahora === 'function' ? E.ahora() : new Date(); return a.getFullYear() + '-' + z(a.getMonth() + 1) + '-' + z(a.getDate()) + 'T' + z(a.getHours()) + ':' + z(a.getMinutes()); };
  GB.hoy = () => GB.ahoraIso().slice(0, 10);
  GB.sumar = (iso, dias) => { const p = sd(iso).slice(0, 10).split('-').map(Number), t = new Date(p[0], p[1] - 1, p[2] + Number(dias || 0)); return t.getFullYear() + '-' + z(t.getMonth() + 1) + '-' + z(t.getDate()); };
  GB.dias = (a, b) => { const f = (s) => { const p = sd(s).slice(0, 10).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }; return Math.round((f(b) - f(a)) / 86400000); };
  GB.fecha = (iso) => { if (!iso) return '—'; const s = sd(iso), d = s.slice(0, 10).split('-'), t = s.slice(11, 16); return d[2] + '/' + d[1] + '/' + d[0].slice(2) + (t ? ' · ' + t : ''); };
  GB.ESTADOS = ['Propuesta', 'Pendiente', 'En ampliación', 'Cumplida', 'Vencida', 'Retirada'];
  GB.ABIERTAS = ['Propuesta', 'Pendiente', 'En ampliación', 'Vencida']; // impiden cerrar el seguimiento
  GB.ORIGENES = ['Inspector', 'Calificador', 'Nivel 2'];
  GB.RESPALDOS = ['foto', 'documento', 'casoHijo'];
  GB.ENDOSOS = { inclusion: 'Inclusión de garantías', cumplimiento: 'Cumplimiento de garantías', plazo: 'Modificación del plazo de garantías' };
  GB.ESTADOS_ENDOSO = ['En cola', 'Enviado', 'Aplicado', 'Rechazado'];
  GB.RETIRAN = ['Ejecutivo de inspecciones', 'Suscriptor', 'Administrador']; // el calificador o el nivel 2
  GB.estadoDe = (g) => g && g.estado === 'Pendiente' && g.vence && g.vence < GB.hoy() ? 'Vencida' : (g || {}).estado;
  GB.catalogo = () => ((window.SIRIUS_EJEMPLO || {}).catalogoSeguimientos || []).filter((x) => x.tipo === 'Garantía');
  GB.plazoDe = (titulo, ramo) => { const C = GB.catalogo(), x = C.find((c) => c.titulo === titulo && c.ramo && c.ramo === ramo) || C.find((c) => c.titulo === titulo); return x && x.plazo > 0 ? x.plazo : 30; };
  GB.codigoDe = (titulo) => (GB.catalogo().find((c) => c.titulo === titulo) || {}).codigo || '';
  GB.norm = (g) => Object.assign({ codigo: '', texto: '', ramo: '', prioridad: 'Media', plazoDias: null, vence: null, origen: 'Inspector', respaldo: null, cumplidaEn: null }, g, { id: sd(g.id), caso: sd(g.caso), ampliaciones: Array.isArray(g.ampliaciones) ? g.ampliaciones : [], endosos: Array.isArray(g.endosos) ? g.endosos : [], historial: Array.isArray(g.historial) ? g.historial : [] });
  // Copia de trabajo del Back-office (lo que la base devolvió; con { ok: true } se le aplica la misma regla).
  GB.L = []; GB.E = null;
  GB.cargar = () => { const X = GB.X(); GB.L = X && Array.isArray(X.garantias) ? clon(X.garantias).filter((g) => g && g.id && g.caso).map(GB.norm) : []; GB.E = X && Array.isArray(X.notificacionesEnvio) ? clon(X.notificacionesEnvio) : null; GB._cargada = true; return GB.L; };
  GB.lista = () => { if (!GB._cargada && GB.X()) GB.cargar(); return GB.L; };
  GB.envios = () => { GB.lista(); return GB.E; };
  GB.bitacoraActiva = () => Array.isArray(GB.envios());
  GB.deCaso = (caso, L) => (L || GB.lista()).filter((g) => g.caso === sd(caso));
  GB.propuestas = (caso) => GB.deCaso(caso).filter((g) => g.estado === 'Propuesta');
  GB.g = (id, L) => (L || GB.lista()).find((g) => g.id === sd(id)) || null;
  GB.cierreDe = (caso, L) => { let c = null; GB.deCaso(caso, L).forEach((g) => g.historial.forEach((h) => { if (h.que === 'Seguimiento cerrado' && (!c || h.fecha > c.fecha)) c = h; })); return c; };

  // ---------- Reglas (la base simulada y el Back-office usan las mismas) ----------
  const ev = (g, que, ctx, extra) => g.historial.push(Object.assign({ fecha: ctx.fecha, que, por: ctx.por || '' }, extra || {}));
  const endoso = (g, tipo, ctx, motivo) => g.endosos.push({ tipo, estado: 'En cola', fecha: ctx.fecha, motivo: motivo || '' });
  const pl = (n, a, b) => n + ' ' + (n === 1 ? a : b);
  GB.ops = (L, tipo, d, ctx) => { d = d || {}; ctx = Object.assign({ fecha: GB.ahoraIso(), por: '', rol: '' }, ctx || {}); const hoy = ctx.fecha.slice(0, 10), no = (m) => ({ ok: false, mensaje: m }), G = (id) => GB.g(id, L);
    if (tipo === 'definirGarantias') { const caso = sd(d.caso); if (!caso) return no('Falta el caso'); if (!Array.isArray(d.garantias)) return no('Faltan las garantías');
      for (const x of d.garantias) { if (!sd(x.titulo).trim()) return no('Cada garantía necesita su título'); if (GB.ORIGENES.indexOf(x.origen) < 0) return no('Origen no válido: ' + sd(x.origen || 'sin origen')); if (x.plazoDias != null && !(Number(x.plazoDias) > 0)) return no('El plazo de ' + x.titulo + ' debe ser mayor que cero'); }
      if (L.some((g) => g.caso === caso && g.estado !== 'Propuesta' && g.estado !== 'Retirada')) return no('Las garantías del caso ' + caso + ' ya están definidas');
      const prop = L.filter((g) => g.caso === caso && g.estado === 'Propuesta' && (!d.riesgo || !g.riesgo || g.riesgo === d.riesgo)), usadas = [], ramo0 = (prop[0] || {}).ramo || d.ramo || '';
      let n = L.filter((g) => g.caso === caso).reduce((m, g) => Math.max(m, Number(sd(g.id).split('-').pop()) || 0), 0);
      d.garantias.forEach((x) => { let g = prop.find((p) => usadas.indexOf(p.id) < 0 && ((x.codigo && p.codigo === x.codigo) || p.titulo === x.titulo));
        if (!g) { g = GB.norm({ id: 'GAR-' + caso + '-' + (++n), caso, riesgo: sd(d.riesgo), codigo: x.codigo || GB.codigoDe(x.titulo), titulo: x.titulo, texto: x.texto || '', ramo: ramo0, prioridad: 'Media', origen: x.origen, estado: 'Propuesta' }); L.push(g); ev(g, 'Agregada por ' + (x.origen === 'Nivel 2' ? 'el nivel 2' : 'el calificador'), ctx); }
        usadas.push(g.id); const plazo = Number(x.plazoDias) > 0 ? Number(x.plazoDias) : GB.plazoDe(x.titulo, g.ramo);
        Object.assign(g, { titulo: x.titulo, texto: x.texto != null ? x.texto : g.texto, codigo: x.codigo || g.codigo || GB.codigoDe(x.titulo), origen: x.origen, plazoDias: plazo, vence: GB.sumar(hoy, plazo), estado: 'Pendiente' });
        ev(g, 'Pendiente · vence el ' + GB.fecha(g.vence), ctx); endoso(g, 'inclusion', ctx); });
      prop.filter((p) => usadas.indexOf(p.id) < 0).forEach((p) => { p.estado = 'Retirada'; ev(p, 'Retirada', ctx, { motivo: 'Quitada en la calificación' }); });
      return { ok: true, mensaje: pl(usadas.length, 'garantía pendiente', 'garantías pendientes') }; }
    if (tipo === 'cumplirGarantia') { const g = G(d.id); if (!g) return no('La garantía ' + sd(d.id) + ' no existe'); const e = GB.estadoDe(g);
      if (['Pendiente', 'Vencida', 'En ampliación'].indexOf(e) < 0) return no('La garantía está ' + sd(e).toLowerCase() + ': no se puede cumplir');
      const r = d.respaldo; if (!r || GB.RESPALDOS.indexOf(r.tipo) < 0 || !sd(r.ruta).trim()) return no('Para cumplir la garantía hace falta un respaldo: foto, documento o caso hijo de reinspección');
      if (sd(d.nota).trim().length < 3) return no('Escribe la nota de cómo se cumplió');
      g.ampliaciones.forEach((a) => { if (a.estado === 'Solicitada') a.estado = 'Sin efecto'; });
      g.estado = 'Cumplida'; g.respaldo = { tipo: r.tipo, ruta: sd(r.ruta), nota: sd(d.nota).trim() }; g.cumplidaEn = ctx.fecha; ev(g, 'Cumplida', ctx, { motivo: sd(d.nota).trim() }); endoso(g, 'cumplimiento', ctx);
      return { ok: true, mensaje: 'Garantía cumplida' }; }
    if (tipo === 'solicitarAmpliacion') { const g = G(d.id); if (!g) return no('La garantía ' + sd(d.id) + ' no existe'); const e = GB.estadoDe(g), A = (window.SIRIUS_SEGUIMIENTO || {}).ampliacion || { maxVeces: 2, maxDias: 30 };
      if (['Pendiente', 'Vencida'].indexOf(e) < 0) return no('La ampliación se pide con la garantía pendiente o vencida; está ' + sd(e).toLowerCase());
      if (!/^\d{4}-\d{2}-\d{2}$/.test(sd(d.nuevoVence))) return no('Falta la nueva fecha de vencimiento');
      if (g.vence && d.nuevoVence <= g.vence) return no('La nueva fecha debe ser posterior al vencimiento actual (' + GB.fecha(g.vence) + ')');
      const dd = GB.dias(g.vence || hoy, d.nuevoVence); if (dd > A.maxDias) return no('La ampliación va de 1 a ' + A.maxDias + ' días');
      if (g.ampliaciones.filter((a) => a.estado === 'Aprobada').length >= A.maxVeces) return no('Ya se usaron las ' + A.maxVeces + ' ampliaciones permitidas');
      if (sd(d.motivo).trim().length < 3) return no('Escribe el motivo de la ampliación');
      g.ampliaciones.push({ solicitada: ctx.fecha, nuevoVence: d.nuevoVence, motivo: sd(d.motivo).trim(), estado: 'Solicitada', resolvio: '', por: ctx.por, previo: e });
      g.estado = 'En ampliación'; ev(g, 'Ampliación solicitada hasta el ' + GB.fecha(d.nuevoVence), ctx, { motivo: sd(d.motivo).trim() });
      return { ok: true, mensaje: 'Ampliación solicitada' }; }
    if (tipo === 'resolverAmpliacion') { const g = G(d.id); if (!g) return no('La garantía ' + sd(d.id) + ' no existe'); const a = g.ampliaciones.slice().reverse().find((x) => x.estado === 'Solicitada');
      if (!a) return no('La garantía no tiene una ampliación por resolver'); if (typeof d.aprobar !== 'boolean') return no('Indica si se aprueba o se rechaza');
      if (!d.aprobar && sd(d.motivo).trim().length < 3) return no('Escribe el motivo del rechazo');
      a.estado = d.aprobar ? 'Aprobada' : 'Rechazada'; a.resolvio = ctx.por; a.resuelta = ctx.fecha; a.motivoResolucion = sd(d.motivo).trim(); g.estado = 'Pendiente';
      if (d.aprobar) { const ant = g.vence; g.vence = a.nuevoVence; ev(g, 'Ampliación aprobada: vence el ' + GB.fecha(g.vence), ctx); endoso(g, 'plazo', ctx, 'Vencimiento ' + GB.fecha(ant) + ' → ' + GB.fecha(g.vence)); }
      else ev(g, 'Ampliación rechazada', ctx, { motivo: sd(d.motivo).trim() });
      return { ok: true, mensaje: d.aprobar ? 'Ampliación aprobada' : 'Ampliación rechazada' }; }
    if (tipo === 'retirarGarantia') { const g = G(d.id); if (!g) return no('La garantía ' + sd(d.id) + ' no existe'); const e = GB.estadoDe(g);
      if (ctx.rol && GB.RETIRAN.indexOf(ctx.rol) < 0) return no('Solo el calificador o el nivel 2 retiran una garantía');
      if (['Cumplida', 'Retirada'].indexOf(e) >= 0) return no('La garantía ya está ' + sd(e).toLowerCase());
      if (sd(d.motivo).trim().length < 3) return no('Escribe el motivo del retiro');
      g.ampliaciones.forEach((a) => { if (a.estado === 'Solicitada') a.estado = 'Sin efecto'; }); g.estado = 'Retirada'; ev(g, 'Retirada', ctx, { motivo: sd(d.motivo).trim() });
      return { ok: true, mensaje: 'Garantía retirada' }; }
    if (tipo === 'cerrarSeguimiento') { const caso = sd(d.caso), gs = L.filter((g) => g.caso === caso); if (!gs.length) return no('El caso ' + caso + ' no tiene garantías');
      if (GB.cierreDe(caso, L)) return no('El seguimiento del caso ' + caso + ' ya está cerrado');
      const pend = gs.filter((g) => GB.ABIERTAS.indexOf(GB.estadoDe(g)) >= 0);
      if (pend.length) return no('No se puede cerrar el seguimiento: ' + (pend.length === 1 ? 'queda 1 garantía pendiente' : 'quedan ' + pend.length + ' garantías pendientes') + ' (' + pend.map((g) => g.titulo).join(', ') + ')');
      if (sd(d.motivo).trim().length < 3) return no('Escribe el motivo del cierre');
      gs.forEach((g) => ev(g, 'Seguimiento cerrado', ctx, { motivo: sd(d.motivo).trim() }));
      return { ok: true, mensaje: 'Seguimiento cerrado' }; }
    if (tipo === 'marcarEndoso') { const g = G(d.id); if (!g) return no('La garantía ' + sd(d.id) + ' no existe'); if (!GB.ENDOSOS[d.tipo]) return no('Tipo de endoso no válido: ' + sd(d.tipo));
      if (GB.ESTADOS_ENDOSO.indexOf(d.estado) < 0 || d.estado === 'En cola') return no('Estado de endoso no válido: ' + sd(d.estado));
      const e = g.endosos.slice().reverse().find((x) => x.tipo === d.tipo); if (!e) return no('La garantía no tiene un endoso de ' + GB.ENDOSOS[d.tipo].toLowerCase());
      if (e.estado === 'Aplicado') return no('El endoso ya está aplicado'); if (d.estado === 'Rechazado' && sd(d.motivo).trim().length < 3) return no('Escribe el motivo del rechazo del BPM');
      e.estado = d.estado; e.actualizado = ctx.fecha; if (d.motivo) e.motivo = sd(d.motivo).trim(); ev(g, 'Endoso de ' + GB.ENDOSOS[d.tipo].toLowerCase() + ': ' + d.estado.toLowerCase(), ctx);
      return { ok: true, mensaje: 'Endoso ' + d.estado.toLowerCase() }; }
    return no('Acción desconocida: ' + sd(tipo)); };
  GB.opsEnvio = (E, d, ctx) => { ctx = Object.assign({ fecha: GB.ahoraIso() }, ctx || {}); const n = (E || []).find((x) => sd(x.id) === sd((d || {}).id)); if (!n) return { ok: false, mensaje: 'El envío ' + sd((d || {}).id) + ' no existe' };
    if (n.estado !== 'Fallido') return { ok: false, mensaje: 'Solo se reenvía un envío fallido' };
    n.estado = 'Enviado'; n.errorPrevio = n.error || ''; n.error = ''; n.fecha = ctx.fecha; n.reenvios = (n.reenvios || 0) + 1; return { ok: true, mensaje: 'Notificación reenviada' }; };

  // ---------- Pantallas: el módulo Garantías y el seguimiento por caso con la forma de siempre ----------
  const EST = { Cumplida: 'Cumplido', Vencida: 'Vencido', Pendiente: 'Pendiente', 'En ampliación': 'En ampliación', Retirada: 'Retirada' };
  GB.seguimiento = (gs) => gs.filter((g) => g.estado !== 'Propuesta');
  GB.item = (g, old) => { const e = GB.estadoDe(g), est = EST[e] || e, r = g.respaldo, hc = g.historial.slice().reverse().find((h) => h.que === 'Cumplida') || {}, hr = g.historial.slice().reverse().find((h) => h.que === 'Retirada') || {};
    return { id: g.id, desc: g.titulo, obs: g.texto, estado: est, gb: true, origen: g.origen, codigo: g.codigo, vence: g.vence, plazoDias: g.plazoDias, riesgo: g.riesgo, ramo: g.ramo, prioridad: g.prioridad,
      resp: est === 'Cumplido' || est === 'Retirada' ? [] : ((old || {}).resp || []), en: est === 'Cumplido' && r && r.tipo === 'casoHijo' ? r.ruta : undefined,
      verif: est === 'Cumplido' && r && r.tipo !== 'casoHijo' ? { via: r.tipo === 'foto' ? 'foto de respaldo' : 'documento de respaldo', by: hc.por || 'la base', at: GB.fecha(g.cumplidaEn), obs: r.nota || '', archivo: r.ruta } : undefined,
      retiro: est === 'Retirada' ? { motivo: hr.motivo || '', por: hr.por || '', fecha: hr.fecha || '' } : null };
  };
  GB.aGar = (casos, prev) => { const out = {}, ids = Array.from(new Set(GB.lista().map((g) => g.caso)));
    ids.forEach((caso) => { const gs = GB.seguimiento(GB.deCaso(caso)); if (!gs.length) return; const c = (casos || []).find((x) => String(x.id) === caso) || {}, pv = (prev || {})[caso] || {};
      const ab = gs.filter((g) => ['Pendiente', 'Vencida', 'En ampliación'].indexOf(GB.estadoDe(g)) >= 0), vs = (ab.length ? ab : gs.filter((g) => g.estado !== 'Retirada')).map((g) => g.vence).filter(Boolean).sort();
      const lim = ab.length ? vs[0] : (vs[vs.length - 1] || GB.hoy()), ct = c.contacto || {};
      out[caso] = { aps: c.aps || '—', apsMail: c.apsMail || '', dir: c.dir || c.direccion || '', contacto: { nombre: ct.nombre || c.asegurado || '', cargo: ct.cargo || '', cel: ct.cel || '', fijo: ct.fijo || '', correo: ct.correo || '', horario: ct.horario || '' },
        base: lim, plazo: 0, limite: lim, gb: true, garantias: gs.map((g) => GB.item(g, (pv.garantias || []).find((x) => x.id === g.id))), documentos: [], preexistencias: [] }; });
    return out; };
  const EE = { 'En cola': 'cola', Enviado: 'enviado', Aplicado: 'aplicado', Rechazado: 'rechazado' };
  GB.aSeg = (casos) => { const out = {}, ids = Array.from(new Set(GB.lista().map((g) => g.caso)));
    ids.forEach((caso) => { const gs = GB.seguimiento(GB.deCaso(caso)); if (!gs.length) return; const c = (casos || []).find((x) => String(x.id) === caso) || {}, cz = GB.cierreDe(caso);
      const endosos = []; gs.forEach((g) => g.endosos.forEach((e, i) => endosos.push({ tipo: e.tipo, estado: EE[e.estado] || 'cola', fecha: e.fecha, respuesta: e.actualizado || null, motivo: e.motivo || '', garantias: [g.id], gb: { id: g.id, tipo: e.tipo, i } })));
      endosos.sort((a, b) => a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0);
      const sol = {}; gs.forEach((g) => g.ampliaciones.forEach((a) => { const k = a.solicitada + '|' + a.nuevoVence + '|' + a.estado, s = sol[k] || (sol[k] = { tipo: 'ampliacion', estado: a.estado === 'Sin efecto' ? 'Rechazada' : a.estado, fecha: a.solicitada, por: a.por || '—', dias: GB.dias(g.vence && a.estado !== 'Aprobada' ? g.vence : a.nuevoVence, a.nuevoVence) || GB.dias(a.solicitada, a.nuevoVence), nuevaFecha: a.nuevoVence, motivo: a.motivo, motivoRechazo: a.motivoResolucion || (a.estado === 'Sin efecto' ? 'Sin efecto' : ''), gbIds: [] }); s.gbIds.push(g.id); }));
      out[caso] = { poliza: (c.emi && c.emi.poliza) || c.poliza || null, calificadorFinal: c.califUser || c.backoffice || '', endosos, solicitudes: Object.keys(sol).map((k) => sol[k]).sort((a, b) => a.fecha < b.fecha ? -1 : 1), gb: true, __cx: true,
        cierre: cz ? { estado: 'Seguimiento cerrado', fecha: cz.fecha, por: cz.por, motivo: cz.motivo || '' } : null }; });
    return out; };
  // Calificación: las propuestas del inspector entran como garantías del formulario (con su origen y el plazo de la matriz).
  GB.prefill = (caso) => { const P = GB.propuestas(caso).filter((g) => !!g.codigo); if (!P.length) return null; /* P-6g-2b: una recomendación sin código del catálogo queda solo en el panel de contexto */ return { estado: '', obs: '', responsable: '', plazo: '', items: { garantias: P.map((g) => ({ id: g.id, ramo: g.ramo, desc: g.titulo, obs: g.texto, estado: 'Pendiente', prioridad: g.prioridad || 'Media', plazo: String(g.plazoDias || GB.plazoDe(g.titulo, g.ramo)), origen: g.origen || 'Inspector', codigo: g.codigo })), documentos: [], preexistencias: [] } }; };
  GB.riesgoDe = (caso) => (GB.deCaso(caso).find((g) => g.riesgo) || {}).riesgo || '';
  // Notificaciones: la bitácora con la forma de SIRIUS_NOTIFICACIONES.bitacora.
  GB.bitacora = () => (GB.envios() || []).map((n) => ({ id: sd(n.id), fecha: n.fecha, regla: n.regla || '', caso: sd(n.caso) || '—', canal: n.canal, a: n.destinatario, remitente: n.remitente || 'SIRIUS', estado: n.estado, motivo: n.error || '', contenido: n.contenido || '', reenvios: n.reenvios || 0, base: true }));
  // Si un componente vuelve a ejecutar este archivo, se conserva la copia de trabajo (lo que ya respondió la base).
  const prev = window.SiriusGarantiasBase; if (prev && prev._cargada) { GB.L = prev.L; GB.E = prev.E; GB._cargada = true; }
  window.SiriusGarantiasBase = GB;
})();
