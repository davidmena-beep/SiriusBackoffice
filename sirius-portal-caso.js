// SIRIUS · Portal del cliente del caso: Mi inspección, Agenda y Documentos (etapa 14 · DEC-171; etapa 14b · DEC-172).
// Lee SIRIUS_PORTAL_CLIENTE (datos-portal-cliente.js v1.2, tal cual), los enlaces, documentos y lecturas de SIRIUS_EJEMPLO.portalCliente, la Agenda
// (SIRIUS_AGENDA + SiriusAgenda: disponibilidad, zonas, capacidad, bloqueos, red y duración por ramo) y el calendario hábil de SIRIUS_FLUJO.
// Los textos salen de los bloques de contenido de la apariencia (SiriusPortalCfg.texto · DEC-162).
// · window.SiriusPortalCasoLogic: horarios cada 30 minutos en la jornada hábil de los próximos 10 días hábiles para todos los grupos de ramo
//   (duración por grupo o por ramo); «Confirmación inmediata» con inspectores de agenda fija (apartado de 10 minutos) y «Otros horarios» que
//   se ofrecen a la red (DEC-172: el primero que acepta queda asignado; si nadie acepta en el plazo, tarea al Coordinador); cambio y
//   cancelación (hasta 4 h hábiles antes; durante la búsqueda, siempre); día de la visita; documentos con la cámara guiada (caras, validación
//   de captura, lecturas a los campos del formulario con su origen y comparación con la solicitud). El Back-office conecta ctx.
// · window.SiriusPortalCaso: pantallas del celular (también en el simulador de Formularios y, en autoinspección, sin Agenda).
// · window.SiriusDocsCliente: «Documentos pedidos al cliente» en Evidencias (validación de captura, campos que llenó, aceptar o rechazar).
// · window.SiriusDuracionVisitas: duración de la visita por grupo y por ramo (Agenda), con motivo e historial.
// El cliente nunca ve calificación, motivos, alertas, lecturas ni datos internos (SIRIUS_PORTAL_CLIENTE.sinResultado).
(function () {
  if (window.SiriusPortalCaso) return;
  const W = window, R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const PC = () => W.SIRIUS_PORTAL_CLIENTE || {}, EJ = () => W.SIRIUS_EJEMPLO || {}, PCL = () => EJ().portalCliente || {}, AGD = () => W.SIRIUS_AGENDA || { disponibilidad: [], bloqueos: [], red: [] };
  const F = () => W.SIRIUS_FLUJO || null, A = () => W.SiriusAgenda || null, CFG = () => W.SiriusPortalCfg || null;
  const z2 = (n) => String(n).padStart(2, '0');
  const isoD = (d) => d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate());
  const iso = (d) => isoD(d) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes());
  const parse = (s) => { const p = String(s || '').split(/[-T:]/).map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1, p[3] || 0, p[4] || 0); };
  const min = (t) => { const p = String(t || '').split(':'); return +p[0] * 60 + +(p[1] || 0); };
  const hm = (m) => z2(Math.floor(m / 60)) + ':' + z2(m % 60);
  const hhmm = (d) => z2(d.getHours()) + ':' + z2(d.getMinutes());
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const DIAS_L = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const fDia = (f) => { const d = parse(f); return DIAS[d.getDay()] + ' ' + z2(d.getDate()) + '/' + z2(d.getMonth() + 1); };
  const fDiaLargo = (f) => { const d = parse(f); return DIAS_L[d.getDay()] + ' ' + d.getDate() + ' de ' + ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][d.getMonth()]; };
  const fFecha = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(s || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; };
  const fCorta = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(s || ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) + ' · ' + m[4] + ':' + m[5] : ''; };
  const mb = (b) => (Math.round((b || 0) / 104857.6) / 10).toLocaleString('es-EC') + ' MB';
  const num = (txt, re, d) => { const m = re.exec(String(txt || '')); return m ? +m[1] : d; };

  // ---------- Reloj: el del prototipo más el tiempo real; una escena puede fijar otro momento (día de la visita, simulado) ----------
  const T0 = Date.now();
  const S = { apartados: [], docs: {}, red: {}, camino: {}, reloj: null, relojT: 0, durRamo: null, durHist: [] };
  function now() { if (S.reloj) return new Date(parse(S.reloj).getTime() + (Date.now() - S.relojT)); const b = EJ().ahora ? EJ().ahora() : new Date(2026, 9, 18, 20, 30); return new Date(b.getTime() + (Date.now() - T0)); }
  function fijarReloj(s) { S.reloj = s || null; S.relojT = Date.now(); cambio(); }

  // ---------- Contexto que conecta el Back-office ----------
  const ON = new Set();
  const ctx = { visitas: () => [], caso: (id) => (EJ().casos || []).find((c) => c.id === id) || null, citaDe: () => null, confirmar: null, cancelar: null, docSubido: null, docRevisado: null, garantias: () => [], garLimite: () => null, garSubir: null,
    redPedida: null, redSinInspector: null, redCancelada: null, abrirApp: null, alCambio: null };
  function cambio() { ON.forEach((f) => { try { f(); } catch (e) {} }); if (ctx.alCambio) { try { ctx.alCambio(); } catch (e) {} } }
  function on(f) { ON.add(f); return () => ON.delete(f); }

  // ---------- Enlaces del caso (mismo enlace único · DEC-146) ----------
  function enlaces() { return (W.SIRIUS_PORTAL_CASO_ENLACES || []).concat(PCL().enlaces || []); }
  function enlace(token) { return token ? enlaces().find((x) => x.token === token) || null : null; }
  function autoEnlace(token) { const L = (W.SIRIUS_PORTAL_ENLACES || []).concat(((EJ().autoinspeccion || {}).enlaces) || []); return token ? L.find((x) => x.token === token) || null : null; }
  function grupoDe(c) { const f = F(); return f && f.grupoDe && c ? f.grupoDe(c) : (c && c.ramo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales'); }
  // Grupo para la agenda: Vehículos, Ramos Generales o Equipo y maquinaria (el ramo «Equipo y maquinaria» tiene su propia duración y red).
  function grupoAgenda(c) { return c && c.ramo === 'Equipo y maquinaria' ? 'Equipo y maquinaria' : grupoDe(c); }
  function datosDe(token) {
    let l = enlace(token), auto = false; if (!l) { l = autoEnlace(token); auto = !!l; } if (!l) return null;
    const c = ctx.caso(l.caso) || {}, v = (EJ().vehiculos || []).find((x) => x.riesgo === l.riesgo) || {};
    return { token: l.token, l, c, auto, caso: l.caso, riesgo: l.riesgo, modalidad: auto ? 'Autoinspección' : (l.modalidad || 'Presencial'), zona: l.zona || c.sucursal || '', contacto: l.contacto || {}, direccion: l.direccion || '', referencia: l.referencia || '',
      vehiculo: l.vehiculo || [v.marca, v.modelo, v.anio].filter(Boolean).join(' '), placa: v.placa || c.placa || '', bien: c.bien || '', estado: c.estado || '', fecha: c.fecha || '', grupo: grupoAgenda(c), ramo: c.ramo || '', vence: l.vence || '', agencia: l.agencia || null };
  }

  // ---------- Agenda (SIRIUS_PORTAL_CLIENTE.agenda v1.2) ----------
  const AGC = () => PC().agenda || {};
  const HCAMBIO = () => ((AGC().cambiar || {}).hastaHorasHabiles) || 4;
  const MINAP = () => num(AGC().confirmacionInmediata, /apartado (\d+) minutos/, 10);
  const ANTICIPA = () => num(AGC().horarios, /dentro de (\d+) horas/, 2) * 60;
  const PASO = () => AGC().pasoMinutos || 30;
  const RED_PLAZO = () => num((AGC().red || {}).plazo, /en (\d+) horas hábiles/, 2) * 60;
  const RED_ANTES = () => num((AGC().red || {}).plazo, /antes de (\d+) horas hábiles/, 4) * 60;
  const ICS_AVISO = () => num(AGC().recordatorio, /aviso (\d+) h antes/, 2);
  const MAXMB = () => 10;
  function duraciones() { if (!S.durRamo) S.durRamo = Object.assign({}, ((AGD().autoagendamiento || {}).duracionPorRamo) || {}); return S.durRamo; }
  function duracion(d) { const g = AGC().duracionPorGrupo || {}, r = duraciones(), DM = ((AGD().autoagendamiento || {}).duracionPorModalidad || {})[d.modalidad]; if (DM) return (typeof DM === 'object' ? DM[d.grupo] || DM.default : DM) || 30; return r[d.ramo] || g[d.ramo] || g[d.grupo] || 60; } // etapa C2-2: la virtual guiada tiene su duración
  function fijarDuracion(ramo, minutos, motivo, por) { const r = duraciones(), antes = r[ramo] || null; if (minutos) r[ramo] = minutos; else delete r[ramo]; S.durHist.unshift({ at: iso(now()), por, ramo, antes, despues: minutos || null, motivo }); cambio(); }
  function bloques() { const f = F(); return (f && f.calendario && f.calendario.jornada) || [['08:30', '13:00'], ['14:00', '17:30']]; }
  function minHab(a, b, suc) { const f = F(); return f && f.minutosHabiles ? f.minutosHabiles(a, b, suc) : Math.max(0, (b - a) / 60000); }
  function sumarHab(a, m) { const f = F(); return f && f.sumarHabiles ? f.sumarHabiles(a, m) : new Date(a.getTime() + m * 60000); }
  const tipoIns = (n) => ((EJ().inspectores || []).find((x) => x.n === n) || {}).tipo || 'Interno';
  const orgDe = (n) => { const x = (EJ().inspectores || []).find((y) => y.n === n) || {}, r = (AGD().red || []).find((y) => y.inspector === n); return r ? r.organizacion : x.tipo === 'Agencia' ? (x.ag || 'Agencia') : x.tipo === 'Externo' ? 'Independiente' : 'Aseguradora del Sur'; };
  // Agenda fija: internos y de agencia con disponibilidad en SIRIUS, de la zona y la modalidad (los externos van por la red).
  // Etapa G-2b · DEC-223: «cubre» usa la cobertura del inspector con la sucursal del caso (d.zona); sin SiriusCobertura, sus zonas como antes.
  const cubre = (x, d) => { const C = W.SiriusCobertura; return C ? !!C.cubre(x, { sucursal: d.zona }).nivel : (x.zonas || []).indexOf(d.zona) >= 0; };
  function fijos(d) { return (AGD().disponibilidad || []).filter((x) => cubre(x, d) && (x.modalidades || []).indexOf(d.modalidad) >= 0 && tipoIns(x.inspector) !== 'Externo'); }
  // Red (DEC-172): externos y agencias habilitados para la zona, el grupo de ramo y la modalidad.
  function redDe(d) { const AP = W.SiriusAppInspectorLogic; return (AGD().red || []).map((x) => AP && AP.alcanceRed ? AP.alcanceRed(x) : x).filter((x) => x.activo !== false && (!AP || !AP.recibe || AP.recibe(x.inspector)) && cubre(x, d) && (x.grupos || []).indexOf(d.grupo) >= 0 && (x.modalidades || []).indexOf(d.modalidad) >= 0); }
  function apartadosActivos() { const n = now(); return S.apartados.filter((x) => parse(x.hasta) > n); }
  function apartadoDe(caso) { return apartadosActivos().find((x) => x.caso === caso) || null; }
  // Inspectores de agenda fija con ese horario libre: trabaja ese día, cabe en su jornada, sin bloqueo, sin choque con otra visita o cupo
  // apartado y con capacidad del día; ordenados por menor carga del día y por el orden de la Agenda.
  function conCupo(d, fecha, ini, fin, excluir) {
    const Ag = A(); if (!Ag) return [];
    const vis = (ctx.visitas() || []).filter((v) => Ag.ocupa(v) && !(excluir && v.caso === excluir.caso && v.id === excluir.visita));
    const a0 = min(ini), b0 = min(fin), ap = apartadosActivos().filter((x) => x.caso !== d.caso);
    const out = fijos(d).filter((x) => { const n = x.inspector;
      if (!Ag.trabaja(n, fecha)) return false;
      if (a0 < min(x.jornada[0]) || b0 > min(x.jornada[1])) return false;
      if (Ag.bloqueos(n, fecha).some((b) => a0 < b.fin && b0 > b.ini)) return false;
      const vd = vis.filter((v) => v.inspector === n && v.fecha === fecha), ad = ap.filter((a) => a.inspector === n && a.fecha === fecha);
      if (vd.some((v) => { const a = min(v.hIni), b = a + Ag.dur(v); return v.hIni && a0 < b && b0 > a; })) return false;
      if (ad.some((a) => a0 < min(a.fin) && b0 > min(a.ini))) return false;
      return vd.length + ad.length + 1 <= x.capacidadDia; });
    const carga = (n) => vis.filter((v) => v.inspector === n && v.fecha === fecha).length + ap.filter((a) => a.inspector === n && a.fecha === fecha).length;
    const orden = (AGD().disponibilidad || []).map((x) => x.inspector);
    return out.sort((a, b) => carga(a.inspector) - carga(b.inspector) || orden.indexOf(a.inspector) - orden.indexOf(b.inspector));
  }
  // Horarios de los próximos 10 días hábiles: inicio cada 30 min dentro de cada bloque de la jornada, si la visita termina antes del cierre
  // del bloque y empieza en 2 h hábiles o más. «inmediata»: algún inspector de agenda fija libre; «red»: los demás, si hay red para la zona
  // y queda tiempo para buscar (más de 4 h hábiles antes del inicio).
  function horarios(token, excluir) {
    const d = datosDe(token); if (!d) return []; const f = F(), n = now(), dur = duracion(d), red = redDe(d), out = []; let x = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    for (let k = 0; out.length < 10 && k < 60; k++, x = new Date(x.getFullYear(), x.getMonth(), x.getDate() + 1)) {
      if (f && !f.esHabil(x)) continue; const fecha = isoD(x), inmediata = [], porRed = [];
      bloques().forEach(([a, b]) => { for (let t = min(a); t + dur <= min(b); t += PASO()) { const ini = hm(t), fin = hm(t + dur), mh = minHab(n, parse(fecha + 'T' + ini)); if (mh < ANTICIPA()) continue;
        const L = conCupo(d, fecha, ini, fin, excluir); if (L.length) inmediata.push({ ini, fin, inspectores: L.map((y) => y.inspector) }); else if (red.length && mh > RED_ANTES()) porRed.push({ ini, fin, red: red.length }); } });
      out.push({ fecha, inmediata, red: porRed, total: inmediata.length + porRed.length });
    }
    return out;
  }
  function apartar(token, fecha, ini, excluir) {
    const d = datosDe(token); if (!d) return null; const fin = hm(min(ini) + duracion(d)), L = conCupo(d, fecha, ini, fin, excluir); if (!L.length) return null; const n = now();
    const a = { caso: d.caso, token, fecha, ini, fin, franja: ini + ' – ' + fin, inspector: L[0].inspector, zona: d.zona, modalidad: d.modalidad, desde: iso(n), hasta: iso(new Date(n.getTime() + MINAP() * 60000)) };
    S.apartados = S.apartados.filter((x) => x.caso !== d.caso).concat([a]); cambio(); return a;
  }
  function soltar(caso) { const k = S.apartados.length; S.apartados = S.apartados.filter((x) => x.caso !== caso); if (k !== S.apartados.length) cambio(); }
  function citaDe(caso) { return ctx.citaDe ? ctx.citaDe(caso) : null; }
  function puedeCambiar(cita) { if (!cita || !cita.fecha) return { ok: false, min: 0 }; const m = minHab(now(), parse(cita.fecha + 'T' + cita.hIni)); return { ok: m >= HCAMBIO() * 60, min: m }; }
  const porDe = (d) => (d.contacto || {}).nombre || d.c.asegurado || 'El cliente';
  function confirmar(token, form) {
    const d = datosDe(token), ap = d ? apartadoDe(d.caso) : null; if (!d || !ap) return { error: 'vencido' };
    const p = { caso: d.caso, riesgo: d.riesgo, modalidad: d.modalidad, zona: d.zona, grupo: d.grupo, fecha: ap.fecha, hIni: ap.ini, hFin: ap.fin, franja: ap.franja, inspector: ap.inspector, organizacion: orgDe(ap.inspector), credencial: credencial(ap.inspector), origen: 'fija',
      dir: form.dir, ref: form.ref, recibe: form.recibe, cel: form.cel, ubicacion: form.ubicacion || null, reemplaza: form.reemplaza || null, at: iso(now()), por: porDe(d) };
    if (S.red[d.caso] && S.red[d.caso].estado !== 'aceptada') delete S.red[d.caso];
    const r = ctx.confirmar ? ctx.confirmar(p) : p; S.apartados = S.apartados.filter((x) => x.caso !== d.caso); cambio(); return r || p;
  }
  // ----- Red (DEC-172) -----
  function redCaso(caso) { return S.red[caso] || null; }
  function pedirRed(token, fecha, ini, form) {
    const d = datosDe(token); if (!d) return null; const miembros = redDe(d); if (!miembros.length) return null; const n = now(), inicio = parse(fecha + 'T' + ini), mh = minHab(n, inicio), dur = duracion(d);
    const plazo = sumarHab(n, Math.max(0, Math.min(RED_PLAZO(), mh - RED_ANTES())));
    const r = { caso: d.caso, token, fecha, ini, fin: hm(min(ini) + dur), dur, modalidad: d.modalidad, zona: d.zona, grupo: d.grupo, riesgo: d.riesgo, miembros: miembros.map((m) => m.inspector), consultados: miembros.length, desde: iso(n), plazo: iso(plazo), estado: 'buscando', form: Object.assign({}, form), reemplaza: form.reemplaza || null, por: porDe(d) };
    const prev = S.red[d.caso]; S.red[d.caso] = r; S.apartados = S.apartados.filter((x) => x.caso !== d.caso);
    if (ctx.redPedida) ctx.redPedida(r, prev && prev.estado === 'buscando' ? prev : null); cambio(); return r;
  }
  // En el prototipo la aceptación se simula (la oferta en la app del inspector es de la etapa 15): el primero que acepta queda asignado.
  function redAceptar(caso, nombre) {
    const r = S.red[caso]; if (!r || r.estado !== 'buscando') return null; const m = (AGD().red || []).find((x) => x.inspector === (nombre || r.miembros[0])); if (!m) return null; const at = iso(now());
    const p = { caso, riesgo: r.riesgo, modalidad: r.modalidad, zona: r.zona, grupo: r.grupo, fecha: r.fecha, hIni: r.ini, hFin: r.fin, franja: r.ini + ' – ' + r.fin, inspector: m.inspector, organizacion: m.organizacion, credencial: m.credencial, origen: 'red', consultados: r.consultados, buscandoDesde: r.desde,
      dir: r.form.dir, ref: r.form.ref, recibe: r.form.recibe, cel: r.form.cel, ubicacion: r.form.ubicacion || null, reemplaza: r.reemplaza, at, por: r.por };
    Object.assign(r, { estado: 'aceptada', aceptadoPor: m.inspector, organizacion: m.organizacion, credencial: m.credencial, aceptadoEn: at });
    if (ctx.confirmar) ctx.confirmar(p); cambio(); return p;
  }
  function redSinRespuesta(caso) { const r = S.red[caso]; if (!r || r.estado !== 'buscando') return null; Object.assign(r, { estado: 'sinred', venceEn: iso(now()) }); if (ctx.redSinInspector) ctx.redSinInspector(r); cambio(); return r; }
  function redCancelar(caso) { const r = S.red[caso]; if (!r) return false; delete S.red[caso]; if (r.estado === 'buscando' && ctx.redCancelada) ctx.redCancelada(r); cambio(); return true; }
  function procesarRed() { const n = now(); Object.keys(S.red).forEach((k) => { const r = S.red[k]; if (r.estado === 'buscando' && parse(r.plazo) <= n) redSinRespuesta(k); }); }
  function cancelar(token) { const d = datosDe(token), c = d ? citaDe(d.caso) : null; if (!c || !puedeCambiar(c).ok) return false; if (ctx.cancelar) ctx.cancelar({ caso: d.caso, visita: c.id, at: iso(now()), por: porDe(d) }); cambio(); return true; }
  // Día de la visita: la cita es hoy, falta menos de 1 h para la franja o está dentro de ella.
  // Etapa 15-1 · «Tu inspector va en camino» lo activa el inspector desde su app («Avisar voy en camino», DEC-173), con su hora estimada.
  function avisarCamino(caso, o) { S.camino[caso] = Object.assign({ at: iso(now()) }, o || {}); cambio(); return S.camino[caso]; }
  function caminoDe(caso) { return S.camino[caso] || null; }
  function enCamino(cita, caso) { const k = caso || (cita && cita.caso), a = k ? S.camino[k] : null; if (!cita || !cita.fecha || cita.estado !== 'Agendada' || !a) return false; const n = now(), b = parse(cita.fecha + 'T' + cita.hFin); return isoD(n) === cita.fecha && a.fecha === cita.fecha && n < b; }
  function credencial(n) { const x = (AGD().disponibilidad || []).find((d) => d.inspector === n) || (AGD().red || []).find((d) => d.inspector === n); return (x && x.credencial) || ''; }
  // Archivo de calendario (.ics) con aviso 2 h antes (SIRIUS_PORTAL_CLIENTE.agenda.recordatorio).
  function ics(c, d) { const f = (fe, ho) => fe.replace(/-/g, '') + 'T' + ho.replace(':', '') + '00';
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aseguradora del Sur//SIRIUS//ES', 'BEGIN:VEVENT', 'UID:' + d.caso + '-' + c.id + '@asur.ec', 'DTSTAMP:' + f(isoD(now()), hhmm(now())), 'DTSTART:' + f(c.fecha, c.hIni), 'DTEND:' + f(c.fecha, c.hFin), 'SUMMARY:Inspección de tu seguro · caso ' + d.caso, 'LOCATION:' + String(c.dir || '').replace(/,/g, '\\,'),
      'BEGIN:VALARM', 'TRIGGER:-PT' + ICS_AVISO() + 'H', 'ACTION:DISPLAY', 'DESCRIPTION:Tu inspección empieza en ' + ICS_AVISO() + ' horas', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'); }

  // ---------- Documentos (captura guiada, lecturas y campos) ----------
  function docsBase(caso) { if (!S.docs[caso]) S.docs[caso] = JSON.parse(JSON.stringify((((PCL().documentos) || {})[caso]) || [])); return S.docs[caso]; }
  function sembrarDocs(caso, lista) { S.docs[caso] = JSON.parse(JSON.stringify(lista || [])); cambio(); }
  function documentos(caso) { return docsBase(caso).map((d) => Object.assign({ tipo: 'doc' }, d)).concat((ctx.garantias(caso) || []).map((g) => Object.assign({ tipo: 'garantia', origen: 'garantia', caras: ['respaldo'], marco: 'a4', digital: true }, g))); }
  function pendientes(caso) { return documentos(caso).filter((d) => !d.opcional && (d.estado === 'Pendiente' || d.estado === 'Volver a subir')).length; }
  const caraNombre = (k) => ((PCL().caras || {})[k]) || (k === 'respaldo' ? 'Respaldo' : k);
  function validarArchivo(f, digital) { if (!f) return 'Elige un archivo.'; const tipo = String(f.type || ''), nom = String(f.name || ''), pdf = tipo === 'application/pdf' || /\.pdf$/i.test(nom);
    if (pdf && !digital) return 'Este documento se toma con la cámara: el PDF solo se acepta en documentos digitales.';
    if (!(/^image\//.test(tipo) || pdf || /\.(jpe?g|png|heic|webp)$/i.test(nom))) return 'Solo se aceptan fotos o PDF.';
    if ((f.size || 0) > MAXMB() * 1048576) return 'El archivo pesa ' + mb(f.size) + ': el máximo es ' + MAXMB() + ' MB.'; return ''; }
  // Lecturas de una cara → campos del formulario: 90 % o más precarga, 60–89 % «Por confirmar», bajo 60 % en blanco; comparación con la solicitud.
  function camposDe(caso, cara) { const L = (((PCL().lecturas || {})[caso]) || {})[cara] || {}, dest = PCL().destinos || {}, et = PCL().etiquetas || {}, c = ctx.caso(caso) || {}, AU = W.SiriusAuto || {};
    const solYear = (/\b(19|20)\d\d\b/.exec(c.bien || '') || [])[0] || '';
    return Object.keys(L).map((k) => { const [valor, conf] = L[k], estado = conf >= 90 ? 'Precargado' : conf >= 60 ? 'Por confirmar' : 'En blanco';
      const sol = k === 'veh_placa' ? (c.placa || '') : k === 'prop_identificacion' ? (c.ident || '') : k === 'veh_anio' ? solYear : ''; // etapa 15-1: también el año (alerta media)
      const comp = !sol || estado === 'En blanco' ? '' : k === 'veh_anio' ? (String(sol) === String(valor) ? 'Coincide' : 'No coincide') : AU.compara ? AU.compara(sol, valor) : (String(sol) === String(valor) ? 'Coincide' : 'No coincide');
      return { clave: k, destino: dest[k] || null, etiqueta: et[k] || k, valor: estado === 'En blanco' ? '' : valor, leido: valor, conf, estado, cara, caraNombre: caraNombre(cara), solicitud: sol, comparacion: comp, anioSolicitud: k === 'veh_anio' ? solYear : '' }; }); }
  function alertasDe(doc) { return (doc.campos || []).filter((x) => x.comparacion === 'No coincide' || /dudoso/.test(x.comparacion || '')).map((x) => ({ id: 'docPortal:' + doc.id + ':' + x.clave, doc: doc.id, docNombre: doc.nombre, campo: x.etiqueta, leido: x.leido, solicitud: x.solicitud, conf: x.conf, cara: x.caraNombre, comparacion: x.comparacion })); }
  // capturas: [{ cara, marcada, validacion: { vertical, encuadre, luz, nitidez, reflejo }, img, at }] o un archivo (PDF o cámara del sistema).
  function subirCapturas(caso, id, capturas, por) { const d = documentos(caso).find((x) => x.id === id); if (!d || !(d.estado === 'Pendiente' || d.estado === 'Volver a subir')) return 'Este documento ya está en revisión o aceptado.';
    const at = iso(now()), bytes = capturas.reduce((s, c) => s + (c.bytes || 1258291), 0), nombre = capturas.map((c) => c.archivo || (String(c.cara).replace(/_/g, '-') + '.jpg')).join(' + '), a = { nombre, bytes, tipo: capturas[0].tipo || 'image/jpeg', at };
    if (d.tipo === 'garantia') { if (ctx.garSubir) ctx.garSubir(caso, d.gid, a, por); cambio(); return ''; }
    const x = docsBase(caso).find((y) => y.id === id), campos = capturas.filter((c) => !c.archivo || /^image\//.test(c.tipo || '')).reduce((L, c) => L.concat(camposDe(caso, c.cara)), []);
    Object.assign(x, { estado: 'En revisión', archivo: a, motivo: '', anterior: x.motivo || '', capturas: capturas.map((c) => ({ cara: c.cara, caraNombre: caraNombre(c.cara), marcada: !!c.marcada, validacion: c.validacion || null, sistema: !!c.sistema, pdf: /pdf/.test(c.tipo || ''), at: c.at || at, img: c.img || '' })), campos });
    x.alertas = alertasDe(x); if (ctx.docSubido) ctx.docSubido(caso, Object.assign({}, x), por); cambio(); return ''; }
  function subir(caso, id, f, por, cara) { const d = documentos(caso).find((x) => x.id === id); if (!d) return 'No encontramos ese documento.'; const err = validarArchivo(f, d.digital); if (err) return err;
    const pdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name || '');
    return subirCapturas(caso, id, (pdf ? [d.caras ? d.caras[0] : 'documento'] : (cara ? [cara] : (d.caras || ['documento']))).map((k) => ({ cara: k, archivo: f.name, bytes: f.size, tipo: f.type || (pdf ? 'application/pdf' : 'image/jpeg'), sistema: !pdf, marcada: !pdf })), por); }
  function revisar(caso, id, decision, motivo, por) { const x = docsBase(caso).find((y) => y.id === id); if (!x || x.estado !== 'En revisión') return false;
    Object.assign(x, decision === 'aceptar' ? { estado: 'Aceptado', motivo: '' } : { estado: 'Volver a subir', motivo: motivo }, { revisado: [por, iso(now())] });
    if (ctx.docRevisado) ctx.docRevisado(caso, Object.assign({}, x), decision, motivo, por); cambio(); return true; }
  // Campos del informe que llenan los documentos del portal (para la pestaña Informe): { destino: { src: 'ext', conf, doc, v, nota } }.
  function specInforme(caso) { const out = {}; docsBase(caso).filter((d) => d.campos && d.estado !== 'Volver a subir').forEach((d) => d.campos.forEach((x) => { if (!x.destino) return; const prev = out[x.destino]; if (prev && prev.conf >= x.conf) return;
    out[x.destino] = { src: 'ext', conf: x.conf, doc: 'Portal del cliente · ' + x.caraNombre, v: x.conf >= 60 ? x.leido : '', nota: x.comparacion === 'No coincide' ? 'No coincide con la solicitud (' + x.solicitud + '): alerta en los controles del calificador' : x.anioSolicitud && x.leido !== x.anioSolicitud ? 'La solicitud dice ' + x.anioSolicitud : '' }; })); return out; }
  function alertasDocs(caso) { return docsBase(caso).filter((d) => d.estado !== 'Volver a subir').reduce((L, d) => L.concat(d.alertas || []), []); }
  function reset() { S.apartados = []; S.docs = {}; S.red = {}; S.camino = {}; S.reloj = null; S.durRamo = null; S.durHist = []; cambio(); }

  // ---------- Línea de tiempo del cliente (estadoCliente) ----------
  function pasos(estado) { const L = PC().estadoCliente || [], cur = L.findIndex((p) => (p.desde || []).indexOf(estado) >= 0);
    if (cur >= 0 && L[cur].paso === 'Solicitud cancelada') return [{ paso: L[cur].paso, texto: L[cur].texto || '', st: 'cur' }];
    return L.filter((p) => p.paso !== 'Solicitud cancelada').map((p, i) => ({ paso: p.paso, texto: p.texto || '', st: cur < 0 ? (i === 0 ? 'cur' : 'pend') : i < cur ? 'ok' : i === cur ? (i === L.length - 2 ? 'ok' : 'cur') : 'pend' })); }

  const Logic = { ctx, on, now, fijarReloj, enlace, datosDe, duracion, duraciones, fijarDuracion, durHist: () => S.durHist, horarios, apartar, soltar, apartadoDe, apartadosActivos, citaDe, puedeCambiar, confirmar, cancelar,
    redCaso, redDe, pedirRed, avisarCamino, caminoDe, redAceptar, redSinRespuesta, redCancelar, procesarRed, redes: () => Object.keys(S.red).map((k) => S.red[k]), enCamino, credencial, orgDe, ics, documentos, pendientes, sembrarDocs, subir, subirCapturas, revisar, validarArchivo,
    specInforme, alertasDocs, caraNombre, reset, pasos, HCAMBIO, MINAP, MAXMB, fDia, fDiaLargo, fFecha, fCorta, mb, iso, parse, hm, min };
  W.SiriusPortalCasoLogic = Logic;

  // ---------- Piezas visuales ----------
  const C = { strong: 'var(--text-strong, #0B2E59)', body: 'var(--text-body, #2b3a4d)', muted: 'var(--text-muted, #5b6b80)', line: '#dde3ea', ok: '#1f7a5c', okbg: '#e7f4ee', warn: '#7A4F0E', warnbg: '#FFF4DC', bad: '#B3261E', badbg: '#FDECEA' };
  const ESTADO_DOC = { 'Pendiente': [C.warnbg, C.warn], 'En revisión': ['#e8eef6', '#3d5a80'], 'Aceptado': [C.okbg, C.ok], 'Volver a subir': [C.badbg, C.bad] };
  function useTick(ms) { const s = R().useState(0), set = s[1]; R().useEffect(() => { const off = on(() => set((x) => x + 1)); const t = setInterval(() => { procesarRed(); set((x) => x + 1); }, ms || 15000); return () => { off(); clearInterval(t); }; }, []); }
  const chip = (txt, k) => { const c = ESTADO_DOC[txt] || ['#eef1f5', C.body]; return h('span', { key: k, style: { display: 'inline-block', whiteSpace: 'nowrap', borderRadius: 999, padding: '2px 9px', fontSize: 12, fontWeight: 800, background: c[0], color: c[1] } }, txt); };
  function Mapa(p) { return h('figure', { style: { margin: 0, display: 'flex', flexDirection: 'column', gap: 4 } },
    h('svg', { viewBox: '0 0 340 120', role: 'img', 'aria-label': 'Mapa referencial de ' + (p.dir || 'la dirección'), style: { width: '100%', height: 120, borderRadius: 12, background: '#e6edf4', display: 'block' } },
      h('path', { d: 'M0 78 H340 M0 30 H340 M70 0 V120 M190 0 V120 M290 0 V120', stroke: '#FFFFFF', strokeWidth: 9 }), h('path', { d: 'M0 100 L340 54', stroke: '#FFFFFF', strokeWidth: 5 }),
      h('circle', { cx: 170, cy: 52, r: 16, fill: p.color || '#0B5CAD', opacity: .18 }), h('path', { d: 'M170 66 C162 56 156 49 156 42 a14 14 0 1 1 28 0 c0 7 -6 14 -14 24z', fill: p.color || '#0B5CAD' }), h('circle', { cx: 170, cy: 42, r: 5, fill: '#FFFFFF' })),
    h('figcaption', { style: { fontSize: 12, color: C.muted } }, 'Mapa referencial · solo en el prototipo')); }
  const Ico = { estado: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6', agenda: 'M4 5h16v16H4z M4 10h16 M9 3v4 M15 3v4', docs: 'M6 2h9l5 5v15H6z M14 2v6h6 M9 13h6 M9 17h6', cam: 'M3 8h4l2-3h6l2 3h4v11H3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' };
  const svgI = (d, s) => h('svg', { width: s || 22, height: s || 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d }));

  // ---------- Cámara guiada de documentos (DEC-154 aplicada a los documentos del portal) ----------
  // Simulada en el prototipo: el documento se acerca al marco; los indicadores se cumplen en orden y la foto se toma sola. «No logra
  // encuadrar» deja el encuadre sin cumplir y a los 6 s aparece «Tomar igual» (la foto queda marcada). En horizontal, pide girar el celular.
  const CHK = [['vertical', 'Vertical', 'mensaje2'], ['encuadre', 'Encuadre', 'mensaje'], ['luz', 'Luz', 'mensaje3'], ['nitidez', 'Nitidez', 'mensaje4'], ['reflejo', 'Reflejo', 'mensaje5']];
  function docSvg(marco, titulo) { const t = String(titulo || '').toUpperCase().replace(/&/g, '&amp;').replace(/</g, '&lt;');
    if (marco === 'a4') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297"><rect width="210" height="297" rx="3" fill="#fbfaf6"/><rect x="16" y="16" width="120" height="10" fill="#33475b"/><text x="16" y="44" font-family="Arial" font-size="9" fill="#33475b">' + t + '</text>' + Array.from({ length: 16 }, (x, i) => '<rect x="16" y="' + (58 + i * 13) + '" width="' + (178 - (i % 4) * 22) + '" height="5" fill="#c9d1da"/>').join('') + '<rect x="130" y="250" width="64" height="26" fill="none" stroke="#9aa7b4"/></svg>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 856 540"><rect width="856" height="540" rx="34" fill="#e7efe3"/><rect width="856" height="96" rx="34" fill="#2e6b4f"/><rect y="62" width="856" height="34" fill="#2e6b4f"/><text x="40" y="62" font-family="Arial" font-size="34" font-weight="bold" fill="#ffffff">' + t + '</text><rect x="40" y="140" width="170" height="210" rx="10" fill="#c7d3c2"/>' + Array.from({ length: 7 }, (x, i) => '<rect x="250" y="' + (150 + i * 46) + '" width="' + (520 - (i % 3) * 90) + '" height="18" fill="#9fb09a"/>').join('') + '<rect x="40" y="420" width="776" height="70" rx="8" fill="#d5dfd1"/></svg>'; }
  const svgUrl = (s) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  function CamaraDoc(p) {
    const caras = p.caras || ['documento'], s0 = R().useState({ i: 0, fase: 'cam', t0: Date.now(), modo: p.inicio === 'vivo' ? 'no' : 'alinea', caps: [], actual: null }), st = s0[0], setSt = s0[1], set = (o) => setSt((x) => Object.assign({}, x, o));
    const s1 = R().useState(0), setTick = s1[1], sg = R().useState(null), grav = sg[0], setGrav = sg[1], hor = grav != null ? grav : p.orientacion === 'horizontal';
    // Etapa 15-2: en el celular, la posición física sale de la gravedad del acelerómetro (girar de lado), no de la inclinación ni de la pantalla.
    R().useEffect(() => { if (p.sim) return; const m = (e) => { const g = e.accelerationIncludingGravity; if (!g || g.x == null) return; const ax = Math.abs(g.x), ay = Math.abs(g.y); if (ax > ay * 1.35 && ax > 3) setGrav(true); else if (ay > ax * 1.35 && ay > 3) setGrav(false); }; W.addEventListener('devicemotion', m); return () => W.removeEventListener('devicemotion', m); }, []);
    R().useEffect(() => { if (p.sim) return; const t = setInterval(() => setTick((x) => x + 1), 150); return () => clearInterval(t); }, []);
    R().useEffect(() => { if (hor) set({ t0: Date.now() }); }, [hor]);
    const cara = caras[st.i], nombre = caraNombre(cara), t = p.sim ? 1200 : hor ? 0 : Date.now() - st.t0, no = st.modo === 'no';
    const ok = { vertical: !hor, luz: t > 600, reflejo: t > 1200, encuadre: !no && t > 2400, nitidez: t > 3200 }, todo = CHK.every(([k]) => ok[k]), igual = !todo && !hor && t >= 6000;
    const falta = CHK.find(([k]) => !ok[k]), T = (b, extra) => p.T('camaraDoc', b, Object.assign({ 'documento.cara': nombre }, extra || {}));
    const svg = docSvg(p.marco, nombre), tomar = (marcada) => set({ fase: 'rev', actual: { cara, marcada, validacion: Object.assign({}, ok, marcada ? { encuadre: false } : {}), img: svgUrl(svg), at: iso(now()) } });
    R().useEffect(() => { if (!p.sim && st.fase === 'cam' && todo && t >= 4000) tomar(false); });
    R().useEffect(() => { if (p.inicio === 'rev') set({ fase: 'rev', actual: { cara, marcada: false, validacion: { vertical: true, encuadre: true, luz: true, nitidez: true, reflejo: true }, img: svgUrl(svg), at: iso(now()) } }); }, []); // escena portaldocrevision
    const prog = no ? 0.55 + 0.12 * Math.sin(t / 400) : Math.min(1, t / 2400), a4 = p.marco === 'a4';
    const marcoSt = a4 ? { height: '62%', aspectRatio: '210 / 297' } : { width: '84%', aspectRatio: '85.6 / 54' };
    const docSt = { position: 'absolute', inset: 0, transform: 'translate(' + ((1 - prog) * 34) + 'px,' + ((1 - prog) * -26) + 'px) rotate(' + ((1 - prog) * -9) + 'deg) scale(' + (0.72 + 0.28 * prog) + ')', transition: 'transform .15s linear', opacity: .96 };
    const btnW = (txt, on, o) => h('button', { type: 'button', id: (o || {}).id, onClick: p.sim ? undefined : on, style: Object.assign({ minHeight: 48, padding: '0 16px', border: (o || {}).sec ? '1.5px solid #FFFFFF' : 'none', borderRadius: 12, background: (o || {}).sec ? 'transparent' : '#FFFFFF', color: (o || {}).sec ? '#FFFFFF' : '#0B2E59', fontFamily: 'var(--font-brand)', fontSize: 16, fontWeight: 800, cursor: 'pointer' }, (o || {}).st || {}) }, txt);
    const top = h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#FFFFFF' } }, h('button', { type: 'button', id: 'pc-cam-volver', onClick: p.sim ? undefined : p.onVolver, style: { minHeight: 40, padding: '0 6px', border: 'none', background: 'transparent', color: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 15, fontWeight: 800, cursor: 'pointer' } }, '‹ Volver'),
      h('h1', { style: { flex: 1, margin: 0, fontSize: 16, fontWeight: 800, textAlign: 'center' } }, T('titulo')), h('span', { style: { fontSize: 13, opacity: .85, whiteSpace: 'nowrap' } }, (st.i + 1) + ' de ' + caras.length));
    let cuerpo;
    if (st.fase === 'rev' && st.actual) {
      cuerpo = [h('div', { key: 'img', style: { flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 } }, h('img', { src: st.actual.img, alt: 'Foto de ' + nombre + ' recortada al marco', style: a4 ? { height: '70%', maxHeight: 460, boxShadow: '0 6px 20px rgba(0,0,0,.4)' } : { width: '92%', boxShadow: '0 6px 20px rgba(0,0,0,.4)', borderRadius: 10 } })),
        h('div', { key: 'pie', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 18px' } },
          st.actual.marcada ? h('p', { role: 'note', style: { margin: 0, padding: '8px 10px', borderRadius: 8, background: '#FFF4DC', color: '#7A4F0E', fontSize: 14, fontWeight: 700 } }, T('aviso')) : null,
          h('p', { style: { margin: 0, color: '#FFFFFF', fontSize: 15, textAlign: 'center' } }, T('texto')),
          btnW(T('boton'), () => { const caps = st.caps.concat([st.actual]); if (st.i + 1 < caras.length) set({ i: st.i + 1, fase: 'cam', t0: Date.now(), caps, actual: null }); else p.onListo(caps); }, { id: 'pc-cam-usar' }),
          btnW(T('boton2'), () => set({ fase: 'cam', t0: Date.now(), actual: null }), { sec: true, id: 'pc-cam-repetir' }))];
    } else {
      const msg = hor ? T('mensaje2') : todo ? T('mensaje6') : T(falta[2]);
      cuerpo = [h('div', { key: 'vista', style: { position: 'relative', flex: '1 1 auto', minHeight: 260, overflow: 'hidden', background: 'radial-gradient(circle at 40% 35%, #5b4a3a, #2a2119 70%)' } },
          h('div', { 'aria-hidden': 'true', style: Object.assign({ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)' }, marcoSt) }, h('img', { src: svgUrl(svg), alt: '', style: Object.assign({}, docSt, { width: '100%', height: '100%' }) }),
            h('div', { style: { position: 'absolute', inset: 0, border: '3px ' + (ok.encuadre ? 'solid #7ee2a0' : 'dashed #FFFFFF'), borderRadius: a4 ? 4 : 14, boxShadow: '0 0 0 2000px rgba(0,0,0,.42)' } })),
          hor ? h('div', { role: 'alert', style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(10,20,30,.82)', color: '#FFFFFF', textAlign: 'center', padding: 20 } }, h('span', { 'aria-hidden': 'true', style: { fontSize: 40 } }, '⟲'), h('b', { style: { fontSize: 18 } }, T('mensaje2'))) : null),
        h('div', { key: 'pie', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px 14px', background: '#11161c' } },
          h('p', { role: 'status', 'aria-live': 'polite', 'data-cam-msg': '1', style: { margin: 0, minHeight: 22, color: todo ? '#9ef0b7' : '#FFFFFF', fontSize: 15, fontWeight: 700, textAlign: 'center' } }, msg),
          h('ul', { 'aria-label': 'Indicadores de la cámara', style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 } }, CHK.map(([k, lab]) => h('li', { key: k, 'data-ind': k, 'data-ok': ok[k] ? '1' : '0', style: { padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,.1)', color: ok[k] ? '#9ef0b7' : '#d9dee4', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' } }, (ok[k] ? '✓ ' : '• ') + lab))),
          igual ? btnW('Tomar igual', () => tomar(true), { id: 'pc-cam-igual' }) : null,
          h('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 12px', fontSize: 13 } },
            p.onArchivo ? h('label', { style: { color: '#c9d6e3', textDecoration: 'underline', cursor: 'pointer' } }, h('input', { type: 'file', accept: 'image/*', capture: 'environment', 'aria-label': 'Usar la cámara del sistema', onChange: (ev) => { const f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (f) p.onArchivo(f, cara); }, style: { position: 'absolute', width: 1, height: 1, opacity: 0 } }), '¿No funciona la cámara? Usar la cámara del sistema') : null,
            p.digital && p.onArchivo ? h('label', { style: { color: '#c9d6e3', textDecoration: 'underline', cursor: 'pointer' } }, h('input', { type: 'file', accept: 'application/pdf', 'aria-label': 'Subir el PDF del documento', onChange: (ev) => { const f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (f) p.onArchivo(f, cara); }, style: { position: 'absolute', width: 1, height: 1, opacity: 0 } }), 'Es un documento digital: subir el PDF') : null),
          h('div', { role: 'group', 'aria-label': 'Simulación de la cámara (solo en el prototipo)', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,.15)', fontSize: 12, color: '#aab6c3' } }, 'Solo en el prototipo:',
            [['alinea', 'Se alinea sola'], ['no', 'No logra encuadrar']].map(([m, l]) => h('button', { key: m, type: 'button', 'aria-pressed': st.modo === m ? 'true' : 'false', 'data-sim-cam': m, onClick: p.sim ? undefined : () => set({ modo: m, t0: Date.now() }), style: { minHeight: 30, padding: '0 10px', borderRadius: 999, border: '1px solid #aab6c3', background: st.modo === m ? '#aab6c3' : 'transparent', color: st.modo === m ? '#11161c' : '#d9dee4', fontFamily: 'var(--font-brand)', fontSize: 12, fontWeight: 800, cursor: 'pointer' } }, l))))];
    }
    return h('div', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Cámara · ' + nombre, 'data-camara-doc': cara, 'data-fase': st.fase, style: { display: 'flex', flexDirection: 'column', minHeight: p.alto || '100%', flex: '1 1 auto', background: '#000', fontFamily: 'var(--font-brand)' } }, top, cuerpo);
  }

  // ---------- Portal del caso ----------
  // props: token, preset (escena), nonce, modo ('auto' desde la autoinspección), avance { hechas, total }, enviado, onAutoinspeccion, orientacion,
  // simulado + pantalla + T (simulador de Formularios: sin efectos), alto, sinCabecera, sinNav.
  const PRESET = { portalagenda: 'dia', portalhoras: 'dia', portalapartado: 'dia', portallugar: 'lugar', portalagendado: 'ok', portalcita: 'cita', portalcamino: 'camino', portaldocs: 'docs', portalgarantias: 'docs',
    portalred: 'red', portalredok: 'red', portalsinred: 'red', portalrg: 'dia', portaldoccamara: 'docs', portaldocrevision: 'docs' };
  const PRE_ESTADOS = ['Registrado', 'En coordinación', 'Reaperturado'];
  function SiriusPortalCaso(props) {
    useTick(15000);
    const d = datosDe(props.token), auto = props.modo === 'auto' || (d && d.auto), cita0 = d ? citaDe(d.caso) : null;
    // Agenda: presencial y virtual guiada de todos los grupos de ramo, mientras la inspección no se hizo (o con una cita vigente).
    const conAgenda = !auto && d && ['Presencial', 'Virtual guiada'].indexOf(d.modalidad) >= 0 && (PRE_ESTADOS.concat(['Agendado', 'Enlace caducado']).indexOf(d.estado) >= 0 || (cita0 && cita0.estado === 'Agendada') || !!props.simulado);
    const ini = (() => { const p = props.pantalla || PRESET[props.preset] || 'estado'; return { sec: p === 'docs' || p === 'cam' ? 'docs' : ['dia', 'lugar', 'ok', 'cita', 'red'].indexOf(p) >= 0 ? 'agenda' : 'estado', paso: p }; })();
    const s0 = R().useState(Object.assign({ dia: null, sel: null, cambio: false, form: null, tried: false, cancelar: false, err: '', up: {}, cam: props.preset === 'portaldoccamara' ? { id: 'D1', vivo: true } : props.preset === 'portaldocrevision' ? { id: 'D1', rev: true } : null, ubic: '' }, ini)), st = s0[0], setSt = s0[1];
    const set = (o) => setSt((x) => Object.assign({}, x, o));
    const top = R().useRef(null);
    R().useEffect(() => { const el = top.current; if (el && !props.simulado) { try { el.focus({ preventScroll: false }); } catch (e) {} } }, [st.paso, !!st.cam]);
    if (!d) return h('div', { style: { padding: 24, fontSize: 16, color: C.body } }, 'No encontramos este enlace.');
    const apar = CFG() ? CFG().aparienciaPara(d.agencia) : null, color = (apar && apar.colorPrincipal) || '#0B5CAD', oscuro = (apar && apar.colorOscuro) || '#0B2E59';
    const sim = !!props.simulado, red = redCaso(d.caso) || (sim && st.paso === 'red' ? redEjemplo(d) : null), cita = citaDe(d.caso) || (sim && ['cita', 'camino', 'ok'].indexOf(st.paso) >= 0 ? citaEjemplo(d) : null);
    const ap = apartadoDe(d.caso), docs = documentos(d.caso), npend = pendientes(d.caso), CC = (EJ().autoinspeccion || {}).contactoCompania || {}, dur = duracion(d);
    const gl = ctx.garLimite ? ctx.garLimite(d.caso) || {} : {}, garL = gl.fecha || '', cam = cita && enCamino(cita, d.caso), ins = red && red.estado === 'aceptada' ? red.aceptadoPor : cita ? cita.inspector : '';
    const V = { 'contacto.nombre': String((d.contacto || {}).nombre || d.c.asegurado || '').split(' ')[0], 'asegurado.nombre': d.c.asegurado || '', 'vehiculo.descripcion': d.vehiculo || '', 'vehiculo.placa': d.placa || '', 'caso.numero': d.caso, 'compania.nombre': 'Aseguradora del Sur', 'compania.telefono': CC.telefono || '',
      'riesgo.zona': d.zona, 'agenda.apartado': String(MINAP()), 'agenda.horasCambio': String(HCAMBIO()), 'agenda.duracion': dur % 60 ? dur + ' minutos' : (dur / 60) + (dur === 60 ? ' hora' : ' horas'), 'documentos.pendientes': String(npend), 'documentos.maxMB': String(MAXMB()), 'garantias.limite': garL,
      'cita.fecha': cita ? fDiaLargo(cita.fecha) : '', 'cita.franja': cita ? cita.hIni + ' – ' + cita.hFin : '', 'inspector.nombre': ins, 'inspector.credencial': ins ? credencial(ins) : '', 'inspector.organizacion': ins ? orgDe(ins) : '', 'red.consultados': String(red ? red.consultados : redDe(d).length),
      'avance.hechas': String((props.avance || {}).hechas || 0), 'avance.total': String((props.avance || {}).total || 0), 'enlace.vence': fFecha(d.vence) };
    const T = (p, b, extra) => { const VV = extra ? Object.assign({}, V, extra) : V; if (props.T) return props.T(p, b, VV); const c = CFG(); if (!c) return ''; return c.texto(p, b, VV, { agencia: d.agencia }); };
    const ir = (sec, paso, o) => { if (sim) return; set(Object.assign({ sec, paso, err: '', tried: false, cancelar: false }, o || {})); };
    // ----- Cámara guiada de un documento (pantalla completa) -----
    if (st.cam && !sim) { const doc = docs.find((x) => x.id === st.cam.id);
      if (doc) return h(CamaraDoc, { caras: doc.caras || ['documento'], marco: doc.marco || 'tarjeta', digital: !!doc.digital, orientacion: props.orientacion, alto: props.alto, inicio: st.cam.rev ? 'rev' : st.cam.vivo ? 'vivo' : '', T, onVolver: () => set({ cam: null }),
        onListo: (caps) => { const r = subirCapturas(d.caso, doc.id, caps, porDe(d)); set({ cam: null, up: Object.assign({}, st.up, { [doc.id]: r }) }); },
        onArchivo: (f, cara) => { const r = subir(d.caso, doc.id, f, porDe(d), cara); set(r ? { up: Object.assign({}, st.up, { [doc.id]: r }), cam: null } : { cam: null, up: Object.assign({}, st.up, { [doc.id]: '' }) }); } }); }
    if (sim && props.pantalla === 'cam') { const doc = docs.find((x) => x.caras && x.caras.length) || {}; return h(CamaraDoc, { sim: true, caras: doc.caras, marco: doc.marco, T, orientacion: 'vertical' }); }
    // ----- Piezas con el color de la apariencia -----
    const btn = (txt, onClick, o) => { o = o || {}; const dis = o.motivo || ''; return h('button', { type: 'button', id: o.id, key: o.key || txt, onClick: dis || sim ? undefined : onClick, 'aria-disabled': dis ? 'true' : undefined, title: dis || undefined, 'aria-describedby': o.desc,
      style: { display: 'block', width: o.auto ? 'auto' : '100%', minHeight: o.auto ? 40 : 50, padding: o.auto ? '0 14px' : '12px 14px', border: o.sec ? '1.5px solid ' + (dis ? '#c9d3de' : color) : 'none', borderRadius: 12, background: dis ? (o.sec ? '#FFFFFF' : '#e3e8ee') : o.sec ? '#FFFFFF' : o.danger ? C.bad : color, color: dis ? C.muted : o.sec ? color : '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: o.auto ? 14 : 16, fontWeight: 800, cursor: dis ? 'not-allowed' : 'pointer', whiteSpace: o.auto ? 'nowrap' : 'normal', textAlign: 'center' } }, txt); };
    const link = (txt, onClick, k) => h('button', { type: 'button', key: k || txt, onClick: sim ? undefined : onClick, style: { alignSelf: 'flex-start', minHeight: 40, padding: 0, border: 'none', background: 'transparent', color, fontFamily: 'var(--font-brand)', fontSize: 15, fontWeight: 800, cursor: 'pointer' } }, txt);
    const card = (children, hi, k) => h('div', { key: k, style: { display: 'flex', flexDirection: 'column', gap: 8, padding: '13px 14px', border: '1px solid ' + (hi ? '#bcd7f2' : C.line), borderRadius: 14, background: hi ? '#f3f8fe' : '#FFFFFF' } }, children);
    const P = (t, s2, k) => t ? h('p', { key: k, style: Object.assign({ margin: 0, fontSize: 15, lineHeight: 1.5, color: C.body, textWrap: 'pretty' }, s2 || {}) }, t) : null;
    const H1 = (t) => h('h1', { ref: top, tabIndex: -1, style: { margin: 0, fontSize: 23, lineHeight: 1.2, fontWeight: 800, color: oscuro, outline: 'none', textWrap: 'balance' } }, t);
    const B = (t, k, s2) => h('b', { key: k, style: Object.assign({ fontSize: 16, color: oscuro }, s2 || {}) }, t);
    const volver = (sec, paso) => link('‹ Volver', () => { if (paso === 'estado' || paso === 'cita' || paso === 'red') soltar(d.caso); ir(sec, paso); }, 'volver');   // salir de la agenda suelta el horario apartado
    const resumenCita = (c, conDir) => [B(fDia(c.fecha) + ' · ' + c.hIni + ' – ' + c.hFin, 'f'), conDir && c.dir ? P(c.dir, { color: C.muted, fontSize: 14 }, 'd') : null];
    const icsBtn = (c) => btn(T('agendaListo', 'boton2'), () => { try { const b = new Blob([ics(c, d)], { type: 'text/calendar' }), u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = 'inspeccion-' + d.caso + '.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000); } catch (e) {} }, { sec: true, key: 'ics', id: 'pc-ics' });
    const lugarG = d.grupo === 'Vehículos' ? '' : d.grupo === 'Equipo y maquinaria' ? '3' : '2';
    const minsDesde = (s) => Math.max(0, Math.round((now() - parse(s)) / 60000));

    let cuerpo = null;
    // ===== Mi inspección =====
    if (st.paso === 'estado') {
      const L = pasos(d.estado), estaAg = cita && cita.estado === 'Agendada';
      let accion = null, accDocs = false;
      if (auto && !props.enviado && ['Registrado', 'En coordinación', 'Agendado', 'En curso', 'Reaperturado'].indexOf(d.estado) >= 0) accion = card([B(T('autoAccion', 'titulo'), 't'), P(T('autoAccion', 'texto'), { color: C.muted, fontSize: 14 }, 'x'), btn(T('autoAccion', 'boton'), () => props.onAutoinspeccion && props.onAutoinspeccion(), { key: 'b', id: 'pc-auto' })], true, 'acc');
      else if (cam) accion = card([B(T('camino', 'titulo'), 't'), P(cita.inspector + ' · ' + fDia(cita.fecha) + ' · ' + cita.hIni + ' – ' + cita.hFin, { fontSize: 14, color: C.muted }, 'x'), btn('Ver los datos del inspector', () => ir('estado', 'camino'), { key: 'b', id: 'pc-camino' })], true, 'acc');
      else if (conAgenda && red && red.estado === 'buscando') accion = card([B(T('red', 'titulo'), 't'), P(fDia(red.fecha) + ' · ' + red.ini + ' – ' + red.fin, { fontSize: 14, color: C.muted }, 'x'), btn('Ver la búsqueda', () => ir('agenda', 'red'), { key: 'b', id: 'pc-verred' })], true, 'acc');
      else if (conAgenda && red && red.estado === 'sinred' && !estaAg) accion = card([B(T('red', 'titulo3'), 't'), P(T('red', 'texto3'), { fontSize: 14, color: C.muted }, 'x'), btn(T('red', 'boton'), () => { redCancelar(d.caso); ir('agenda', 'dia'); }, { key: 'b', id: 'pc-otrohorario' })], true, 'acc');
      else if (conAgenda && estaAg) accion = card([B('Inspección agendada', 't'), resumenCita(cita, true), btn(T('miInspeccion', 'boton2'), () => ir('agenda', 'cita'), { sec: true, key: 'b', id: 'pc-vercita' })], true, 'acc');
      else if (conAgenda && PRE_ESTADOS.indexOf(d.estado) >= 0) accion = card([B(T('agendarAccion', 'titulo'), 't'), P(T('agendarAccion', 'texto'), { color: C.muted, fontSize: 14 }, 'x'), btn(T('agendarAccion', 'boton'), () => ir('agenda', 'dia'), { key: 'b', id: 'pc-agendar' })], true, 'acc');
      else if (npend) accDocs = true, accion = card([B('Sube tus documentos', 't'), P(T('miInspeccion', 'aviso'), { color: C.muted, fontSize: 14 }, 'x'), btn(T('miInspeccion', 'boton'), () => ir('docs', 'docs'), { key: 'b', id: 'pc-docs1' })], true, 'acc');
      const sub = (p) => { if (p.paso === 'Solicitud recibida') return red && red.estado === 'buscando' ? 'Buscando un inspector para ' + fDia(red.fecha) + ' ' + red.ini : fFecha(d.fecha); if (p.paso === 'Inspección agendada') return cita && cita.fecha && p.st !== 'pend' ? fDia(cita.fecha) + ' · ' + cita.hIni + ' – ' + cita.hFin : p.st === 'cur' && conAgenda ? 'Pendiente: elige una fecha' : ''; if (p.paso === 'Inspección realizada' && cita && cita.estado === 'Realizada') return fDia(cita.fecha); return p.st === 'pend' ? '' : p.texto; };
      const tl = h('ol', { key: 'tl', 'aria-label': 'Estado de tu inspección', style: { listStyle: 'none', margin: 0, padding: 0 } }, L.map((p, i) => h('li', { key: p.paso, 'aria-current': p.st === 'cur' ? 'step' : undefined, style: { display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', gap: 10, paddingBottom: i < L.length - 1 ? 14 : 0, position: 'relative' } },
        i < L.length - 1 ? h('span', { 'aria-hidden': 'true', style: { position: 'absolute', left: 12, top: 26, bottom: 0, width: 2, background: p.st === 'ok' ? C.ok : C.line } }) : null,
        h('span', { 'aria-hidden': 'true', style: { width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 900, border: '2px solid ' + (p.st === 'ok' ? C.ok : p.st === 'cur' ? color : C.line), background: p.st === 'ok' ? C.ok : '#FFFFFF', color: p.st === 'ok' ? '#FFFFFF' : p.st === 'cur' ? color : C.muted, boxShadow: p.st === 'cur' ? '0 0 0 4px rgba(11,92,173,.13)' : 'none' } }, p.st === 'ok' ? '✓' : String(i + 1)),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 } }, h('b', { style: { fontSize: 15, color: p.st === 'pend' ? C.muted : oscuro } }, p.paso, h('span', { className: 'pc-sr', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, p.st === 'ok' ? ' (hecho)' : p.st === 'cur' ? ' (paso actual)' : ' (pendiente)')), sub(p) ? h('span', { style: { fontSize: 13, color: C.muted } }, sub(p)) : null))));
      const docsCard = npend && !accDocs ? card([B(T('miInspeccion', 'aviso'), 't', { fontSize: 15 }), btn(T('miInspeccion', 'boton'), () => ir('docs', 'docs'), { sec: true, key: 'b', id: 'pc-docs2' })], false, 'dc') : null;
      cuerpo = [H1(T('miInspeccion', 'titulo')), P(T('miInspeccion', 'texto'), { color: C.muted }, 'sub'), accion, tl, docsCard, P(T('miInspeccion', 'mensaje'), { fontSize: 13, color: C.muted }, 'ayuda')];
    }
    // ===== Agenda: día y horario (cada 30 min; confirmación inmediata o red) =====
    else if (st.paso === 'dia') {
      const exc = st.cambio && cita ? { caso: d.caso, visita: cita.id } : null, D = horarios(d.token, exc), selF = st.dia || (ap && ap.fecha) || (st.sel && st.sel.fecha) || (props.preset === 'portalhoras' && !sim ? (D.find((x) => x.red.length > 1) || {}).fecha : '') || ((D.find((x) => x.total) || D[0] || {}).fecha), dia = D.find((x) => x.fecha === selF) || D[0];
      const daysRow = h('div', { key: 'days', role: 'radiogroup', 'aria-label': 'Día de la inspección', style: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 } }, D.map((x) => { const on2 = dia && x.fecha === dia.fecha, off = !x.total;
        return h('button', { key: x.fecha, type: 'button', role: 'radio', 'aria-checked': on2 ? 'true' : 'false', 'aria-disabled': off ? 'true' : undefined, title: off ? 'Sin horarios ese día' : x.inmediata.length + ' con confirmación inmediata', 'data-dia': x.fecha, onClick: off || sim ? undefined : () => set({ dia: x.fecha }),
          style: { flex: 'none', minWidth: 64, padding: '8px 6px', borderRadius: 12, border: '1.5px solid ' + (on2 ? color : C.line), background: on2 ? '#eef5fd' : '#FFFFFF', opacity: off ? .45 : 1, cursor: off ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-brand)', textAlign: 'center', color: C.strong } },
          h('small', { style: { display: 'block', fontSize: 11, color: C.muted } }, DIAS[parse(x.fecha).getDay()]), h('b', { style: { display: 'block', fontSize: 19 } }, String(parse(x.fecha).getDate())), h('small', { style: { display: 'block', fontSize: 11, color: C.muted, whiteSpace: 'nowrap' } }, off ? 'sin horario' : MESES[parse(x.fecha).getMonth()])); }));
      const chipH = (x, tipo) => { const on2 = tipo === 'fija' ? ap && ap.fecha === dia.fecha && ap.ini === x.ini : st.sel && st.sel.tipo === 'red' && st.sel.fecha === dia.fecha && st.sel.ini === x.ini;
        return h('button', { key: tipo + x.ini, type: 'button', role: 'radio', 'aria-checked': on2 ? 'true' : 'false', 'data-hora': x.ini, 'data-tipo': tipo, onClick: sim ? undefined : () => { if (tipo === 'fija') { const a = apartar(d.token, dia.fecha, x.ini, exc); set({ sel: a ? { tipo: 'fija', fecha: dia.fecha, ini: x.ini } : null, err: a ? '' : 'Ese horario se acaba de ocupar: elige otro.' }); } else { soltar(d.caso); set({ sel: { tipo: 'red', fecha: dia.fecha, ini: x.ini, fin: x.fin }, err: '' }); } },
          style: { minHeight: 44, padding: '6px 4px', borderRadius: 10, border: '1.5px ' + (tipo === 'red' ? 'dashed ' : 'solid ') + (on2 ? color : tipo === 'red' ? '#9fb3c8' : C.line), background: on2 ? color : '#FFFFFF', color: on2 ? '#FFFFFF' : C.strong, cursor: 'pointer', fontFamily: 'var(--font-brand)', fontSize: 15, fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' } }, x.ini); };
      const grupo = (titulo, texto, L, tipo, k) => L.length ? h('section', { key: k, 'aria-label': titulo, style: { display: 'flex', flexDirection: 'column', gap: 8 } }, h('h2', { style: { margin: '4px 0 0', fontSize: 16, color: oscuro } }, titulo), P(texto, { fontSize: 13, color: C.muted }, 'x'),
        h('div', { role: 'radiogroup', 'aria-label': titulo + ' · ' + (dia ? fDiaLargo(dia.fecha) : ''), style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 } }, L.map((x) => chipH(x, tipo)))) : null;
      const apInfo = ap ? h('div', { key: 'ap', role: 'status', 'data-apartado': ap.hasta, style: { padding: '10px 12px', borderRadius: 10, background: C.warnbg, color: C.warn, fontSize: 14, lineHeight: 1.45 } }, h('b', null, ap.ini + ' – ' + ap.fin + ' apartado hasta las ' + ap.hasta.slice(11, 16) + '. '), T('agendaDia', 'aviso')) : st.sel && st.sel.tipo === 'red' ? h('div', { key: 'ap', role: 'status', style: { padding: '10px 12px', borderRadius: 10, background: '#eef5fd', color: oscuro, fontSize: 14, lineHeight: 1.45 } }, h('b', null, st.sel.ini + ' – ' + st.sel.fin + '. '), T('agendaDia', 'texto3')) : null;
      const form0 = st.form || { dir: (cita && st.cambio ? cita.dir : (red && red.form ? red.form.dir : d.direccion)) || '', ref: (cita && st.cambio ? cita.ref : d.referencia) || '', recibe: (cita && st.cambio ? cita.recibe : (d.contacto || {}).nombre) || '', cel: (cita && st.cambio ? cita.cel : (d.contacto || {}).cel) || '' };
      cuerpo = [volver(st.cambio ? 'agenda' : 'estado', st.cambio ? (red && red.estado === 'buscando' ? 'red' : 'cita') : 'estado'), H1(st.cambio ? 'Cambiar tu cita' : T('agendaDia', 'titulo')), st.cambio && cita ? P('Tu cita actual: ' + fDia(cita.fecha) + ' · ' + cita.hIni + ' – ' + cita.hFin + '. Elige el nuevo horario.', { fontSize: 14 }, 'act') : null, st.cambio && red && red.estado === 'buscando' ? P('Buscando para ' + fDia(red.fecha) + ' · ' + red.ini + '. Elige el nuevo horario.', { fontSize: 14 }, 'actr') : null,
        P(T('agendaDia', 'texto'), { color: C.muted, fontSize: 14 }, 'x'), daysRow, dia ? h('p', { key: 'dl', style: { margin: 0, fontSize: 15, fontWeight: 800, color: C.strong } }, fDiaLargo(dia.fecha).charAt(0).toUpperCase() + fDiaLargo(dia.fecha).slice(1)) : null,
        dia ? grupo(T('agendaDia', 'titulo2'), T('agendaDia', 'texto2'), dia.inmediata, 'fija', 'g1') : null, dia ? grupo(T('agendaDia', 'titulo3'), T('agendaDia', 'texto3'), dia.red, 'red', 'g2') : null,
        dia && !dia.total ? P('No hay horarios ese día: elige otro.', { color: C.muted }, 'sh') : null, st.err ? h('p', { key: 'e', role: 'alert', style: { margin: 0, color: C.bad, fontWeight: 700, fontSize: 14 } }, st.err) : null, apInfo,
        btn(T('agendaDia', 'boton'), () => ir('agenda', 'lugar', { form: form0 }), { key: 'cont', id: 'pc-continuar', motivo: ap || (st.sel && st.sel.tipo === 'red') ? '' : 'Elige un día y un horario' })];
    }
    // ===== Agenda: lugar y contacto =====
    else if (st.paso === 'lugar') {
      const f = st.form || { dir: d.direccion || '', ref: d.referencia || '', recibe: (d.contacto || {}).nombre || '', cel: (d.contacto || {}).cel || '' }, setF = (o) => set({ form: Object.assign({}, f, o) });
      const esRed = st.sel && st.sel.tipo === 'red' && !ap;
      const e = { dir: String(f.dir).trim().length < 8 ? 'Escribe la dirección (calle principal y número).' : '', recibe: String(f.recibe).trim().length < 3 ? 'Escribe el nombre de quien recibe al inspector.' : '', cel: !/^09\d{8}$/.test(String(f.cel).replace(/\s/g, '')) ? 'Escribe un celular de 10 dígitos que empiece con 09.' : '' };
      const campo = (id, lab, k, o) => { const err = st.tried ? e[k] : ''; o = o || {}; return h('div', { key: id, style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('label', { htmlFor: id, style: { fontSize: 13, fontWeight: 800, color: C.muted } }, lab),
        h(o.area ? 'textarea' : 'input', { id, rows: o.area ? 2 : undefined, value: f[k] || '', inputMode: o.mode, autoComplete: 'off', 'aria-invalid': err ? 'true' : 'false', 'aria-describedby': err ? id + '-e' : undefined, onChange: (ev) => setF({ [k]: ev.target.value }), readOnly: sim, style: { width: '100%', minHeight: 46, border: '1.5px solid ' + (err ? C.bad : C.line), borderRadius: 10, padding: '10px', fontFamily: 'var(--font-brand)', fontSize: 16, lineHeight: 1.35, color: C.strong, boxSizing: 'border-box', resize: 'vertical' } }),
        err ? h('span', { id: id + '-e', role: 'alert', style: { fontSize: 13, color: C.bad, fontWeight: 700 } }, err) : null); };
      const ubicar = () => { const listo = (lat, lng, simulada) => setF({ ubicacion: { lat, lng, simulada } }); try { if (navigator.geolocation) navigator.geolocation.getCurrentPosition((x) => listo(x.coords.latitude, x.coords.longitude, false), () => listo(-0.1807, -78.4678, true), { timeout: 3000 }); else listo(-0.1807, -78.4678, true); } catch (er) { listo(-0.1807, -78.4678, true); } };
      const vencido = !ap && !esRed && !sim, resumen = ap ? [B(fDia(ap.fecha) + ' · ' + ap.ini + ' – ' + ap.fin, 'f'), P('Apartado hasta las ' + ap.hasta.slice(11, 16) + '.', { fontSize: 13, color: C.warn, fontWeight: 700 }, 'a')] : esRed ? [B(fDia(st.sel.fecha) + ' · ' + st.sel.ini + ' – ' + st.sel.fin, 'f'), P(T('agendaDia', 'texto3'), { fontSize: 13, color: C.muted }, 'a')] : null;
      cuerpo = [volver('agenda', 'dia'), H1(T('agendaLugar', 'titulo' + lugarG)), h(Mapa, { key: 'map', dir: f.dir, color }), btn(T('agendaLugar', 'boton2'), ubicar, { sec: true, key: 'ub', id: 'pc-ubicacion' }),
        f.ubicacion ? P('Ubicación agregada' + (f.ubicacion.simulada ? ' (simulada en el prototipo)' : '') + ': ' + f.ubicacion.lat.toFixed(4) + ', ' + f.ubicacion.lng.toFixed(4), { fontSize: 13, color: C.ok, fontWeight: 700 }, 'ubok') : null,
        campo('pc-dir', 'Dirección', 'dir', { area: true }), campo('pc-ref', 'Referencia', 'ref', { area: true }), campo('pc-recibe', '¿Quién recibe al inspector?', 'recibe'), campo('pc-cel', 'Celular de quien recibe', 'cel', { mode: 'tel' }),
        resumen ? card(resumen.concat([P(T('agendaLugar', 'texto' + lugarG), { color: C.muted, fontSize: 14 }, 't')]), false, 'res') : null,
        vencido ? h('div', { key: 'v', role: 'alert', style: { padding: '10px 12px', borderRadius: 10, background: C.badbg, color: C.bad, fontSize: 14, fontWeight: 700 } }, 'El horario que apartaste venció: vuelve a elegir el día y el horario.') : null,
        st.err ? h('p', { key: 'e', role: 'alert', style: { margin: 0, color: C.bad, fontWeight: 700, fontSize: 14 } }, st.err) : null,
        btn(T('agendaLugar', 'boton'), () => { if (e.dir || e.recibe || e.cel) return set({ tried: true }); const form = Object.assign({}, f, { cel: String(f.cel).replace(/\s/g, ''), reemplaza: st.cambio && cita ? cita.id : null });
          if (esRed) { const r = pedirRed(d.token, st.sel.fecha, st.sel.ini, form); if (!r) return set({ err: 'No hay inspectores de la red para ese horario: elige otro.' }); return ir('agenda', 'red', { cambio: false, dia: null, sel: null }); }
          const r = confirmar(d.token, form); if (r && r.error) return set({ err: 'El horario que apartaste venció: vuelve a elegirlo.' }); ir('agenda', 'ok', { cambio: false, dia: null, sel: null }); }, { key: 'ok', id: 'pc-confirmar', motivo: vencido ? 'El horario apartado venció' : '' })];
    }
    // ===== Búsqueda en la red (DEC-172) =====
    else if (st.paso === 'red') {
      if (!red) cuerpo = [volver('estado', 'estado'), H1(T('red', 'titulo')), P('No hay una búsqueda en curso.', { color: C.muted }, 'n')];
      else if (red.estado === 'buscando') { const m = minsDesde(red.desde);
        cuerpo = [H1(T('red', 'titulo')), h('div', { key: 'anim', 'aria-hidden': 'true', style: { alignSelf: 'center', width: 84, height: 84, borderRadius: '50%', border: '3px dashed ' + color, display: 'grid', placeItems: 'center', color, animation: sim ? 'none' : 'pcspin 3s linear infinite' } }, svgI('M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 34)),
          h('style', { key: 'kf' }, '@keyframes pcspin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[style*="pcspin"]{animation:none!important}}'),
          P(T('red', 'texto'), { textAlign: 'center' }, 't'), card([B(fDia(red.fecha) + ' · ' + red.ini + ' – ' + red.fin, 'f'), P(red.form.dir, { color: C.muted, fontSize: 14 }, 'd'), P('Buscando desde hace ' + (m < 1 ? 'menos de 1 minuto' : m === 1 ? '1 minuto' : m < 60 ? m + ' minutos' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min') + ' · respuesta antes de las ' + red.plazo.slice(11, 16) + (red.plazo.slice(0, 10) !== isoD(now()) ? ' del ' + fDia(red.plazo.slice(0, 10)) : ''), { fontSize: 13, color: C.muted }, 'm')], true, 'c'),
          btn(T('red', 'boton2'), () => ir('agenda', 'dia', { cambio: true, dia: null, sel: null }), { sec: true, key: 'cb', id: 'pc-red-cambiar' }), btn(T('red', 'boton3'), () => { redCancelar(d.caso); ir('estado', 'estado'); }, { sec: true, key: 'cc', id: 'pc-red-cancelar' }),
          sim ? null : h('div', { key: 'proto', role: 'group', 'aria-label': 'Simulación de la red (solo en el prototipo)', style: { display: 'flex', flexDirection: 'column', gap: 6, padding: 10, borderRadius: 10, border: '1px dashed #9fb3c8', background: '#f6f8fb' } }, h('span', { style: { fontSize: 12, fontWeight: 800, color: C.muted } }, 'Solo en el prototipo · la oferta está en la app de ' + red.consultados + (red.consultados === 1 ? ' inspector' : ' inspectores') + ' de la red (DEC-173)'),
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, ctx.abrirApp ? h('button', { type: 'button', id: 'pc-red-app', onClick: () => ctx.abrirApp(d.caso), style: { minHeight: 34, padding: '0 10px', borderRadius: 8, border: '1px solid ' + color, background: '#FFFFFF', color, fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 800, cursor: 'pointer' } }, 'Abrir la app del inspector') : null,
              h('button', { type: 'button', id: 'pc-red-nadie', onClick: () => redSinRespuesta(d.caso), style: { minHeight: 34, padding: '0 10px', borderRadius: 8, border: '1px solid ' + C.bad, background: '#FFFFFF', color: C.bad, fontFamily: 'var(--font-brand)', fontSize: 13, fontWeight: 800, cursor: 'pointer' } }, 'Nadie acepta a tiempo')))]; }
      else if (red.estado === 'aceptada') { const c = cita || { fecha: red.fecha, hIni: red.ini, hFin: red.fin, dir: red.form.dir, id: 'V1' };
        cuerpo = [h('div', { key: 'ok', 'aria-hidden': 'true', style: { width: 70, height: 70, borderRadius: '50%', background: C.ok, color: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 34, margin: '10px auto 0' } }, '✓'), h('div', { key: 'h', style: { textAlign: 'center' } }, H1(T('red', 'titulo2'))),
          P(fDiaLargo(red.fecha) + ' · ' + red.ini + ' – ' + red.fin, { textAlign: 'center', fontWeight: 800, color: oscuro }, 'f'), card([B(red.aceptadoPor + ' · Inspector', 'n'), P(red.organizacion + ' · credencial ' + red.credencial, { fontSize: 14 }, 'o')], true, 'ins'), P(T('red', 'texto2'), { textAlign: 'center', color: C.muted }, 't'),
          icsBtn(c), btn(T('agendaListo', 'boton'), () => ir('estado', 'estado'), { key: 'b', id: 'pc-vermi' })]; }
      else cuerpo = [H1(T('red', 'titulo3')), P(T('red', 'texto3'), { color: C.muted }, 't'), card([B(fDia(red.fecha) + ' · ' + red.ini + ' – ' + red.fin, 'f'), P('Consultamos a ' + red.consultados + ' inspectores de la red.', { fontSize: 13, color: C.muted }, 'c')], false, 'c'),
        btn(T('red', 'boton'), () => { redCancelar(d.caso); ir('agenda', 'dia', { dia: null, sel: null }); }, { key: 'b', id: 'pc-otrohorario' })];
    }
    // ===== Cita confirmada =====
    else if (st.paso === 'ok') {
      const c = cita || {};
      cuerpo = [h('div', { key: 'ok', 'aria-hidden': 'true', style: { width: 70, height: 70, borderRadius: '50%', background: C.ok, color: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 34, margin: '10px auto 0' } }, '✓'), h('div', { key: 'h', style: { textAlign: 'center' } }, H1(T('agendaListo', 'titulo'))),
        c.fecha ? P(fDiaLargo(c.fecha) + ' · ' + c.hIni + ' – ' + c.hFin, { textAlign: 'center', fontWeight: 800, color: oscuro }, 'f') : null, c.dir ? P(c.dir, { textAlign: 'center', color: C.muted, fontSize: 14 }, 'd') : null, P(T('agendaListo', 'texto'), { textAlign: 'center', color: C.muted }, 't'),
        c.fecha ? icsBtn(c) : null, btn(T('agendaListo', 'boton'), () => ir('estado', 'estado'), { key: 'b', id: 'pc-vermi' })];
    }
    // ===== Ver o cambiar la cita =====
    else if (st.paso === 'cita') {
      if (!cita || cita.estado !== 'Agendada') cuerpo = [volver('estado', 'estado'), H1(T('cita', 'titulo')), P('Aún no tienes cita.', { color: C.muted }, 'n'), conAgenda && PRE_ESTADOS.indexOf(d.estado) >= 0 ? btn(T('agendarAccion', 'boton'), () => ir('agenda', 'dia'), { key: 'b' }) : null];
      else { const pc = puedeCambiar(cita), razon = pc.ok ? '' : 'Faltan menos de ' + HCAMBIO() + ' horas hábiles: llámanos para cambiarla';
        cuerpo = [volver('estado', 'estado'), H1(T('cita', 'titulo')), card(resumenCita(cita, true).concat(cita.origen === 'red' ? [P(cita.inspector + ' · ' + orgDe(cita.inspector) + ' · credencial ' + credencial(cita.inspector), { fontSize: 14 }, 'ir')] : []), true, 'c'),
          card([B('El día de la visita', 't', { fontSize: 15 }), P('Verás aquí el nombre de tu inspector, su organización, su credencial y el aviso «va en camino» con la hora estimada.', { fontSize: 14, color: C.muted }, 'x')], false, 'dv'),
          !pc.ok ? h('div', { key: 'blk', role: 'alert', id: 'pc-bloq', style: { padding: '10px 12px', borderRadius: 10, background: C.warnbg, color: C.warn, fontSize: 14, lineHeight: 1.45, fontWeight: 700 } }, T('cita', 'mensaje')) : null,
          btn(T('cita', 'boton'), () => ir('agenda', 'dia', { cambio: true, dia: null, sel: null }), { sec: true, key: 'cb', id: 'pc-cambiar', motivo: razon, desc: pc.ok ? undefined : 'pc-bloq' }),
          btn(T('cita', 'boton2'), () => set({ cancelar: true }), { sec: true, key: 'cc', id: 'pc-cancelar', motivo: razon, desc: pc.ok ? undefined : 'pc-bloq' }),
          st.cancelar ? h('div', { key: 'conf', role: 'alertdialog', 'aria-labelledby': 'pc-cc-t', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 14, border: '1.5px solid ' + C.bad, background: C.badbg } }, h('b', { id: 'pc-cc-t', style: { fontSize: 15, color: C.bad } }, T('cita', 'aviso')),
            btn('Sí, cancelar la cita', () => { if (cancelar(d.token)) ir('estado', 'estado'); }, { key: 'si', danger: true, id: 'pc-cancelar-si' }), btn('No, mantenerla', () => set({ cancelar: false }), { key: 'no', sec: true })) : null,
          icsBtn(cita), P(T('cita', 'texto'), { fontSize: 13, color: C.muted }, 'reg')]; }
    }
    // ===== Día de la visita =====
    else if (st.paso === 'camino') {
      const c = cita, av = caminoDe(d.caso), eta = c ? (av && av.eta) || c.hIni : '';
      cuerpo = c ? [H1(T('camino', 'titulo')), card([B(c.inspector + ' · Inspector', 'n', { fontSize: 17 }), P(orgDe(c.inspector) + ' · credencial ' + (credencial(c.inspector) || '—'), { fontSize: 15 }, 'cr'), P('Llega aprox. ' + eta + ' · tu horario es ' + c.hIni + ' – ' + c.hFin, { fontSize: 14, color: C.muted }, 'eta')], true, 'ins'),
        h(Mapa, { key: 'map', dir: c.dir, color }), P(T('camino', 'texto'), { fontSize: 13, color: C.muted }, 't'), link('Ver mi inspección', () => ir('estado', 'estado'), 'vm')] : [H1(T('camino', 'titulo')), P('Todavía no tienes una cita agendada.', null, 'n')];
    }
    // ===== Documentos (cámara guiada) =====
    else if (st.paso === 'docs') {
      const ORI = PCL().origenes || {}, L1 = docs.filter((x) => x.tipo !== 'garantia'), L2 = docs.filter((x) => x.tipo === 'garantia');
      const fila = (x) => { const puede = x.estado === 'Pendiente' || x.estado === 'Volver a subir', err = (st.up || {})[x.id] || '', idp = 'pc-p-' + x.id;
        const elegir = (ev) => { const f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (!f) return; const r = subir(d.caso, x.id, f, porDe(d)); set({ up: Object.assign({}, st.up, { [x.id]: r }) }); };
        return h('li', { key: x.id, 'data-doc': x.id, style: { display: 'flex', flexDirection: 'column', gap: 8, padding: '11px 12px', border: '1px solid ' + C.line, borderRadius: 12 } },
          h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } }, h('span', { 'aria-hidden': 'true', style: { flex: 'none', width: 36, height: 36, borderRadius: 10, background: '#f4f7fa', display: 'grid', placeItems: 'center', color: oscuro } }, svgI(Ico.docs)),
            h('div', { style: { flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } }, h('b', { style: { fontSize: 15, color: oscuro } }, x.nombre), h('small', { style: { fontSize: 12, color: C.muted } }, [x.detalle, ORI[x.origen] || '', x.opcional ? 'opcional' : ''].filter(Boolean).join(' · ')),
              x.estado === 'Volver a subir' && x.motivo ? h('small', { style: { fontSize: 13, color: C.bad, fontWeight: 700 } }, x.motivo) : null, x.archivo && x.estado !== 'Pendiente' ? h('small', { style: { fontSize: 12, color: C.muted } }, (x.estado === 'Volver a subir' ? 'Anterior: ' : 'Archivo: ') + x.archivo.nombre) : null),
            h('span', { style: { flex: 'none' } }, chip(x.estado))),
          puede ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
            h('button', { type: 'button', id: 'pc-cam-' + x.id, onClick: sim ? undefined : () => set({ cam: { id: x.id } }), style: { display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40, padding: '0 14px', border: 'none', borderRadius: 10, background: color, color: '#FFFFFF', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 800, cursor: 'pointer' } }, svgI(Ico.cam, 18), x.estado === 'Volver a subir' ? 'Tomar otra foto' : 'Tomar foto'),
            x.digital ? h('input', { id: idp, type: 'file', accept: 'application/pdf', 'aria-label': 'Subir el PDF de ' + x.nombre, onChange: elegir, disabled: sim, style: { position: 'absolute', width: 1, height: 1, opacity: 0 } }) : null,
            x.digital ? h('label', { htmlFor: idp, style: { display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '0 14px', borderRadius: 10, border: '1.5px solid ' + color, color, fontSize: 14, fontWeight: 800, cursor: 'pointer' } }, 'Subir PDF') : null) : null,
          err ? h('span', { role: 'alert', style: { fontSize: 13, color: C.bad, fontWeight: 700 } }, err) : null); };
      const lista = (L, k, lab) => h('ul', { key: k, 'aria-label': lab, style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 } }, L.map(fila));
      cuerpo = [H1(T('documentosCliente', 'titulo')), P(T('documentosCliente', 'texto'), { color: C.muted, fontSize: 14 }, 't'),
        L1.length ? lista(L1, 'l1', 'Documentos') : (L2.length ? null : P('No tienes documentos pendientes.', { color: C.muted }, 'v')),
        L2.length ? h('h2', { key: 'g', style: { margin: '6px 0 0', fontSize: 17, color: oscuro } }, T('documentosCliente', 'titulo2')) : null, L2.length ? (gl.vencida ? h('p', { key: 'g2', role: 'note', style: { margin: 0, padding: '10px 12px', borderRadius: 10, background: C.warnbg, color: C.warn, fontSize: 14, fontWeight: 700, lineHeight: 1.45 } }, T('documentosCliente', 'mensaje')) : P(T('documentosCliente', 'texto2'), { fontSize: 14, color: C.muted }, 'g2')) : null, L2.length ? lista(L2, 'l2', 'Garantías por acreditar') : null,
        P(T('documentosCliente', 'aviso'), { fontSize: 13, color: C.muted }, 'av')];
    }

    // ----- Marco: encabezado, contenido y navegación inferior -----
    const agPaso = red && (red.estado === 'buscando' || red.estado === 'sinred') ? 'red' : cita && cita.estado === 'Agendada' ? 'cita' : 'dia';
    const nav = [['estado', 'Mi inspección', Ico.estado, 'estado']].concat(conAgenda ? [['agenda', 'Agenda', Ico.agenda, agPaso]] : [], [['docs', 'Documentos', Ico.docs, 'docs']]);
    const navEl = props.sinNav ? null : h('nav', { 'aria-label': 'Secciones del portal', style: { position: 'sticky', bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(' + nav.length + ',1fr)', borderTop: '1px solid ' + C.line, background: '#FFFFFF', zIndex: 2 } }, nav.map(([sec, lab, ic, paso]) => { const on2 = st.sec === sec;
      return h('button', { key: sec, type: 'button', 'aria-current': on2 ? 'page' : undefined, 'data-nav': sec, onClick: sim ? undefined : () => { if (sec === 'agenda' && paso === 'dia' && PRE_ESTADOS.indexOf(d.estado) < 0) return ir('agenda', 'cita'); ir(sec, paso); },
        style: { position: 'relative', minHeight: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, border: 'none', background: '#FFFFFF', color: on2 ? color : C.muted, fontFamily: 'var(--font-brand)', fontSize: 12, fontWeight: 800, cursor: 'pointer' } },
        svgI(ic), lab, sec === 'docs' && npend ? h('span', { 'aria-label': npend + ' pendientes', style: { position: 'absolute', top: 5, left: '50%', marginLeft: 6, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: C.bad, color: '#FFFFFF', fontSize: 11, lineHeight: '18px' } }, String(npend)) : null); }));
    const head = props.sinCabecera ? null : h('header', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 16px', borderBottom: '2px solid ' + color } },
      h('span', { style: { fontSize: 15, fontWeight: 800, color: oscuro } }, (apar && !apar.compania && apar.nombre) || 'Aseguradora del Sur'), h('span', { style: { fontSize: 12, color: C.muted, whiteSpace: 'nowrap' } }, 'Caso ' + d.caso + (d.placa ? ' · ' + d.placa : '')));
    const nota = S.reloj && !sim ? h('div', { role: 'note', style: { padding: '6px 16px', background: '#0B2E59', color: '#FFFFFF', fontSize: 12 } }, 'Solo en el prototipo · simulación del ' + fDiaLargo(S.reloj.slice(0, 10)) + ' a las ' + S.reloj.slice(11, 16)) : null;
    return h('div', { 'data-portal-caso': d.caso, 'data-pantalla': st.paso, style: { position: 'relative', display: 'flex', flexDirection: 'column', minHeight: props.alto ? props.alto : '100%', flex: '1 1 auto', background: '#FFFFFF', fontFamily: 'var(--font-brand)' } }, head, nota,
      h('main', { style: { flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 16px 18px' } }, cuerpo), navEl);
  }
  // Simulador: cita y búsqueda de ejemplo en el primer horario disponible (nada se guarda).
  function citaEjemplo(d) { const D = horarios(d.token), x = D.find((y) => y.inmediata.length), f = x ? x.inmediata[0] : null, ej = PC().ejemplo || {}; return x && f ? { id: 'V1', fecha: x.fecha, hIni: f.ini, hFin: f.fin, inspector: ej.inspector || f.inspectores[0], dir: d.direccion || ej.direccion || '', estado: 'Agendada', porCliente: true, origen: 'fija' } : null; }
  function redEjemplo(d) { const D = horarios(d.token), x = D.find((y) => y.red.length), f = x ? x.red[0] : null, m = redDe(d); return x && f ? { caso: d.caso, fecha: x.fecha, ini: f.ini, fin: f.fin, consultados: m.length, miembros: m.map((y) => y.inspector), desde: iso(now()), plazo: iso(new Date(now().getTime() + 7200000)), estado: 'buscando', form: { dir: d.direccion } } : null; }
  W.SiriusPortalCaso = SiriusPortalCaso;

  // ---------- Back-office · Evidencias: «Documentos pedidos al cliente» ----------
  // props: caso, usuario, rol. Cada documento muestra su validación de captura (por cara) y los campos del formulario que llenó, con su
  // confianza, su estado (Precargado, Por confirmar, En blanco) y la comparación con la solicitud.
  function SiriusDocsCliente(props) {
    useTick(30000);
    const s0 = R().useState(null), dlg = s0[0], setDlg = s0[1], s1 = R().useState(''), mot = s1[0], setMot = s1[1], s2 = R().useState(false), tried = s2[0], setTried = s2[1];
    const L = docsBase(props.caso), ORI = PCL().origenes || {}, B = NS().Button, Bd = NS().Badge, M = W.SiriusModal;
    if (!L.length) return null;
    const tono = { 'Pendiente': 'warning', 'En revisión': 'brand', 'Aceptado': 'success', 'Volver a subir': 'danger' }, tonoC = { 'Precargado': 'success', 'Por confirmar': 'warning', 'En blanco': 'neutral' };
    const puede = (x) => x.estado !== 'En revisión' ? 'Solo se revisa un documento «En revisión»' : props.usuario === x.pidio || props.rol === 'Administrador' ? '' : 'Lo revisa quien lo pidió (' + x.pidio + ')';
    const cerrar = () => { setDlg(null); setMot(''); setTried(false); };
    const ok = () => { if (dlg.d === 'rechazar' && mot.trim().length < 10) { setTried(true); return; } revisar(props.caso, dlg.id, dlg.d, mot.trim(), props.usuario); cerrar(); };
    const x0 = dlg ? L.find((y) => y.id === dlg.id) : null, badge = (t, tone, k) => Bd ? h(Bd, { key: k, tone }, h('span', { style: { whiteSpace: 'nowrap' } }, t)) : h('span', { key: k }, t);
    const valid = (c) => c.pdf ? [badge('PDF del documento digital', 'neutral', 'pdf')] : c.sistema ? [badge('Cámara del sistema · encuadre no verificado', 'warning', 'sys')] : CHK.map(([k, lab]) => h('span', { key: k, style: { fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', color: c.validacion && c.validacion[k] ? 'var(--color-success)' : 'var(--color-warning-strong, #8A5A00)' } }, (c.validacion && c.validacion[k] ? '✓ ' : '! ') + lab)).concat(c.marcada ? [badge('Tomada igual', 'warning', 'mk')] : []);
    return h('section', { 'aria-labelledby': 'dc-cli-t', 'data-docs-cliente': props.caso, style: { display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 24px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF', minWidth: 0 } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, h('h3', { id: 'dc-cli-t', style: { margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-strong)' } }, 'Documentos pedidos al cliente'),
        h('span', { style: { fontSize: 14, color: 'var(--text-muted)' } }, 'El cliente los toma con la cámara guiada del portal; sus datos llenan los campos del informe con su origen. Quien pidió cada documento lo acepta o lo rechaza con motivo; el cliente recibe el aviso (regla R18).')),
      h('ul', { style: { listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' } }, L.map((x, i) => { const why = puede(x);
        return h('li', { key: x.id, 'data-doc-bo': x.id, style: { display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px', borderTop: i ? '1px solid var(--border-subtle)' : 'none' } },
          h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px' } },
            h('div', { style: { flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
              h('span', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 } }, h('b', { style: { fontSize: 15, color: 'var(--text-strong)' } }, x.nombre), badge(x.estado, tono[x.estado] || 'neutral', 'e'), (x.alertas || []).length && x.estado !== 'Volver a subir' ? badge((x.alertas.length === 1 ? '1 diferencia' : x.alertas.length + ' diferencias') + ' con la solicitud', 'danger', 'al') : null),
              h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, [x.detalle, ORI[x.origen] ? ORI[x.origen].replace('tu ejecutivo', 'el ejecutivo') : '', x.opcional ? 'opcional' : '', 'pidió ' + x.pidio].filter(Boolean).join(' · ')),
              x.archivo ? h('span', { style: { fontSize: 13, color: 'var(--text-body)' } }, h('span', { style: { overflowWrap: 'anywhere' } }, x.archivo.nombre), ' · ' + mb(x.archivo.bytes) + ' · ', h('span', { style: { whiteSpace: 'nowrap' } }, fCorta(x.archivo.at))) : null,
              x.estado === 'Volver a subir' && x.motivo ? h('span', { style: { fontSize: 13, color: 'var(--color-danger)' } }, 'Motivo: ' + x.motivo) : null,
              x.revisado ? h('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, 'Revisado por ' + x.revisado[0] + ' · ', h('span', { style: { whiteSpace: 'nowrap' } }, fCorta(x.revisado[1]))) : null),
            x.estado === 'En revisión' && B ? h('span', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
              h(B, { variant: 'secondary', size: 'sm', onClick: () => { setDlg({ id: x.id, d: 'rechazar' }); }, unavailableReason: why || undefined }, 'Rechazar'),
              h(B, { variant: 'primary', size: 'sm', onClick: () => { setDlg({ id: x.id, d: 'aceptar' }); }, unavailableReason: why || undefined }, 'Aceptar')) : null),
          (x.capturas || []).length ? h('div', { 'data-captura': x.id, style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Validación de la captura'),
            x.capturas.map((c) => h('div', { key: c.cara, style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px' } }, c.img ? h('img', { src: c.img, alt: c.caraNombre, style: { width: 56, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-subtle)' } }) : null, h('span', { style: { fontSize: 13, minWidth: 120, color: 'var(--text-body)' } }, c.caraNombre), valid(c)))) : null,
          (x.campos || []).length ? h('div', { 'data-campos': x.id, style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 } }, h('span', { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Campos del informe que llenó'),
            h('div', { style: { overflowX: 'auto' } }, h('table', { style: { borderCollapse: 'collapse', width: '100%', minWidth: 560, fontSize: 13 } }, h('thead', null, h('tr', null, ['Campo', 'Leído', 'Confianza', 'Estado', 'Solicitud'].map((t) => h('th', { key: t, scope: 'col', style: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap' } }, t)))),
              h('tbody', null, x.campos.map((c) => h('tr', { key: c.cara + c.clave, 'data-campo': c.clave }, h('td', { style: { padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' } }, h('b', { style: { color: 'var(--text-strong)' } }, c.etiqueta), h('div', { style: { fontSize: 12, color: 'var(--text-muted)' } }, 'Origen: Portal del cliente · ' + c.caraNombre)),
                h('td', { style: { padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, c.estado === 'En blanco' ? '—' : c.leido), h('td', { style: { padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' } }, c.conf + ' %'),
                h('td', { style: { padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' } }, badge(c.estado, tonoC[c.estado] || 'neutral', 's')),
                h('td', { style: { padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', color: c.comparacion === 'No coincide' ? 'var(--color-danger)' : 'var(--text-body)' } }, c.comparacion ? h('span', null, h('span', { style: { whiteSpace: 'nowrap' } }, c.solicitud), ' · ' + c.comparacion) : c.anioSolicitud && c.anioSolicitud !== c.leido ? 'Dice ' + c.anioSolicitud : '—'))))))) : null); })),
      dlg && x0 && M ? h(M, { open: true, onClose: cerrar, size: 'sm', align: 'left', title: (dlg.d === 'aceptar' ? 'Aceptar ' : 'Rechazar ') + '«' + x0.nombre + '»',
        description: dlg.d === 'aceptar' ? 'El documento queda Aceptado y el cliente recibe el aviso.' : 'El cliente verá «Volver a subir» con este motivo y recibirá el aviso.',
        footer: h(R().Fragment, null, h(B, { variant: 'ghost', onClick: cerrar }, 'Cancelar'), h(B, { variant: 'primary', onClick: ok }, dlg.d === 'aceptar' ? 'Aceptar documento' : 'Rechazar documento')) },
        dlg.d === 'rechazar' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('label', { htmlFor: 'dc-mot', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Motivo (lo ve el cliente)', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
          h('textarea', { id: 'dc-mot', rows: 3, value: mot, onChange: (e) => setMot(e.target.value), 'aria-invalid': tried && mot.trim().length < 10 ? 'true' : 'false', 'aria-describedby': 'dc-mot-h', style: { width: '100%', padding: '9px 12px', border: '1.5px solid ' + (tried && mot.trim().length < 10 ? 'var(--color-danger)' : 'var(--input-outlined-border)'), borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-brand)', fontSize: 15, boxSizing: 'border-box' }, placeholder: 'Qué debe corregir el cliente' }),
          h('span', { id: 'dc-mot-h', role: tried && mot.trim().length < 10 ? 'alert' : undefined, style: { fontSize: 13, color: tried && mot.trim().length < 10 ? 'var(--color-danger)' : 'var(--text-muted)' } }, tried && mot.trim().length < 10 ? 'Escribe el motivo (mínimo 10 caracteres): el cliente lo verá.' : 'Mínimo 10 caracteres. Sin datos internos: el cliente lo lee tal cual.'))
          : h('p', { style: { margin: 0, fontSize: 15, color: 'var(--text-body)' } }, x0.archivo ? 'Archivo: ' + x0.archivo.nombre + ' (' + mb(x0.archivo.bytes) + ').' : '')) : null);
  }
  W.SiriusDocsCliente = SiriusDocsCliente;

  // ---------- Agenda · duración de la visita por grupo y por ramo (DEC-172) ----------
  // props: puede (Coordinador o Administrador), usuario. Los cambios piden motivo y quedan en el historial; aplican a los horarios del portal.
  function SiriusDuracionVisitas(props) {
    useTick(60000);
    const s0 = R().useState(null), ed = s0[0], setEd = s0[1], B = NS().Button, M = W.SiriusModal, G = AGC().duracionPorGrupo || {}, r = duraciones();
    const ramos = ((EJ().ramosSirius ? EJ().ramosSirius() : EJ().ramos) || []).map((x) => ({ nombre: x.nombre, grupo: x.nombre === 'Equipo y maquinaria' ? 'Equipo y maquinaria' : x.grupo }));
    const opts = [30, 45, 60, 90, 120, 150, 180, 240], txtMin = (m) => m % 60 ? m + ' min' : (m / 60) + ' h';
    const base = (x) => G[x.nombre] || G[x.grupo] || 60, okM = ed && String(ed.motivo || '').trim().length >= 10;
    const td = { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', fontSize: 14 };
    return h('div', { 'data-duracion-visitas': '1', style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      h('p', { style: { margin: 0, fontSize: 14, color: 'var(--text-body)', textWrap: 'pretty' } }, 'Duración que se reserva cuando el cliente agenda su inspección desde el portal. Por defecto, la del grupo de ramo (Vehículos ' + txtMin(G['Vehículos'] || 45) + ', Ramos Generales ' + txtMin(G['Ramos Generales'] || 120) + ', Equipo y maquinaria ' + txtMin(G['Equipo y maquinaria'] || 90) + '); cada ramo puede tener la suya.'),
      h('div', { style: { overflowX: 'auto' } }, h('table', { style: { borderCollapse: 'collapse', width: '100%', minWidth: 520 } }, h('thead', null, h('tr', null, ['Ramo', 'Grupo', 'Duración', ''].map((t, i) => h('th', { key: i, scope: 'col', style: Object.assign({}, td, { fontSize: 13, color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-default)' }) }, t)))),
        h('tbody', null, ramos.map((x) => { const v = r[x.nombre]; return h('tr', { key: x.nombre, 'data-ramo': x.nombre }, h('td', { style: td }, h('b', { style: { color: 'var(--text-strong)' } }, x.nombre)), h('td', { style: td }, x.grupo), h('td', { style: Object.assign({}, td, { whiteSpace: 'nowrap' }) }, txtMin(v || base(x)), v ? h('span', { style: { marginLeft: 6, fontSize: 12, color: 'var(--color-brand)', fontWeight: 700 } }, 'propia del ramo') : h('span', { style: { marginLeft: 6, fontSize: 12, color: 'var(--text-muted)' } }, 'del grupo')),
          h('td', { style: Object.assign({}, td, { textAlign: 'right' }) }, B ? h(B, { variant: 'ghost', size: 'sm', onClick: () => setEd({ ramo: x.nombre, grupo: x.grupo, valor: v || base(x), motivo: '', tried: false }), unavailableReason: props.puede ? undefined : 'Solo el Coordinador o el Administrador cambian la duración' }, 'Cambiar') : null)); })))),
      S.durHist.length ? h('div', null, h('h4', { style: { margin: '4px 0', fontSize: 14, color: 'var(--text-strong)' } }, 'Historial'), h('ul', { style: { margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-body)' } }, S.durHist.map((x, i) => h('li', { key: i }, fCorta(x.at) + ' · ' + x.por + ' · ' + x.ramo + ': ' + (x.antes ? txtMin(x.antes) : 'la del grupo') + ' → ' + (x.despues ? txtMin(x.despues) : 'la del grupo') + ' · Motivo: ' + x.motivo)))) : null,
      ed && M ? h(M, { open: true, onClose: () => setEd(null), size: 'sm', align: 'left', title: 'Duración de la visita · ' + ed.ramo, description: 'Aplica a los horarios que ve el cliente desde ahora; las citas ya agendadas no cambian.',
        footer: h(R().Fragment, null, h(B, { variant: 'ghost', onClick: () => setEd(null) }, 'Cancelar'), h(B, { variant: 'primary', onClick: () => { if (!okM) return setEd(Object.assign({}, ed, { tried: true })); const g = G[ed.ramo] || G[ed.grupo]; fijarDuracion(ed.ramo, +ed.valor === g ? null : +ed.valor, ed.motivo.trim(), props.usuario || 'Coordinador'); setEd(null); } }, 'Guardar')) },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, h('label', { htmlFor: 'dv-min', style: { fontSize: 13, fontWeight: 700 } }, 'Duración'), h('select', { id: 'dv-min', value: ed.valor, onChange: (e) => setEd(Object.assign({}, ed, { valor: +e.target.value })), style: { height: 40, padding: '0 8px', borderRadius: 8, border: '1.5px solid var(--input-outlined-border)', fontFamily: 'var(--font-brand)', fontSize: 15 } }, opts.map((m) => h('option', { key: m, value: m }, txtMin(m) + (m === (G[ed.ramo] || G[ed.grupo]) ? ' (la del grupo)' : '')))),
          h('label', { htmlFor: 'dv-mot', style: { fontSize: 13, fontWeight: 700 } }, 'Motivo', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')), h('textarea', { id: 'dv-mot', rows: 2, value: ed.motivo, onChange: (e) => setEd(Object.assign({}, ed, { motivo: e.target.value })), 'aria-invalid': ed.tried && !okM ? 'true' : 'false', style: { padding: '8px 10px', borderRadius: 8, border: '1.5px solid ' + (ed.tried && !okM ? 'var(--color-danger)' : 'var(--input-outlined-border)'), fontFamily: 'var(--font-brand)', fontSize: 15 } }),
          ed.tried && !okM ? h('span', { role: 'alert', style: { fontSize: 13, color: 'var(--color-danger)' } }, 'Escribe el motivo (mínimo 10 caracteres): queda en el historial.') : null)) : null);
  }
  W.SiriusDuracionVisitas = SiriusDuracionVisitas;
})();
