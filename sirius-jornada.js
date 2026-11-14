// SIRIUS · Jornada por defecto de las visitas (v1.0 · etapa P-6f-0f2 · DEC-232 · 18/10/2026).
// Es la jornada que Coordinación usa para agendar, reagendar y validar cuando el inspector no tiene jornada propia en SIRIUS_AGENDA.disponibilidad.
// Parametrizable: vive en SIRIUS_AGENDA.jornadaDefecto = { dias: [1…7] (1 = lunes), desde: 'HH:MM', hasta: 'HH:MM' } (datos-agenda-liquidaciones.js; valor inicial lun a sáb, 08:30–17:30).
// Lectura: SiriusFecha.jornadaDefecto() (primero lo editado en la sesión, después SIRIUS_AGENDA.jornadaDefecto, al final el valor inicial).
// Edición: Administración › Configuración general › Agenda (solo el Administrador) con SiriusJornada.guardar(); pide motivo y queda en el historial.
// Con la conexión se publica con SiriusPublicar como parte de SIRIUS_AGENDA (datos = SIRIUS_AGENDA completo con jornadaDefecto); con { ok: false } el cambio vuelve atrás.
// El valor editado y el historial viven aquí (un solo módulo: los componentes vuelven a ejecutar los archivos de datos y reemplazan SIRIUS_AGENDA).
(function () {
  'use strict';
  const W = window; if (W.SiriusJornada) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), ON = [], S = { valor: null, hist: [] };
  const SF = () => W.SiriusFecha || {};
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  S.defecto = () => SF().jornadaDefecto(); // requiere sirius-fecha.js (se carga antes): el valor inicial vive solo allí y en SIRIUS_AGENDA.jornadaDefecto
  S.txt = (j) => (SF().jornadaTxt ? SF().jornadaTxt(j || S.defecto()) : '');
  S.DIAS = [[1, 'Lun', 'lunes'], [2, 'Mar', 'martes'], [3, 'Mié', 'miércoles'], [4, 'Jue', 'jueves'], [5, 'Vie', 'viernes'], [6, 'Sáb', 'sábado'], [7, 'Dom', 'domingo']];
  // Horas cada 15 minutos (00:00 … 23:45).
  S.HORAS = (() => { const o = []; for (let m = 0; m < 24 * 60; m += 15) o.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')); return o; })();
  S.igual = (a, b) => { const x = SF().jornadaValida ? SF().jornadaValida(a) : a, y = SF().jornadaValida ? SF().jornadaValida(b) : b; return !!x && !!y && x.desde === y.desde && x.hasta === y.hasta && x.dias.join() === y.dias.join(); };
  // Errores del borrador: { dias, desde, hasta } (vacío si todo está bien).
  S.validar = (f) => { const e = {}, m = SF().aMin || ((t) => { const q = String(t).split(':').map(Number); return q[0] * 60 + (q[1] || 0); });
    if (!f || !Array.isArray(f.dias) || !f.dias.length) e.dias = 'Marca al menos un día.';
    if (!f || S.HORAS.indexOf(f.desde) < 0) e.desde = 'Elige la hora de inicio.';
    if (!f || S.HORAS.indexOf(f.hasta) < 0) e.hasta = 'Elige la hora de fin.';
    if (!e.desde && !e.hasta && m(f.desde) >= m(f.hasta)) e.hasta = 'La hora «Desde» debe ser anterior a «Hasta» (' + f.desde + ' no es anterior a ' + f.hasta + ').';
    return e; };
  S.historial = () => S.hist.slice();
  const ahora = () => { const SC = W.SiriusCompania; if (SC && SC.ahoraIso) return SC.ahoraIso(); const E = W.SIRIUS_EJEMPLO || {}, d = E.ahora ? E.ahora() : new Date(), z = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + 'T' + z(d.getHours()) + ':' + z(d.getMinutes()); };
  // valor = lo editado en la sesión (o null); espejo = lo que queda en SIRIUS_AGENDA.jornadaDefecto.
  const aplicar = (valor, espejo) => { S.valor = valor ? clon(valor) : null; if (W.SIRIUS_AGENDA) W.SIRIUS_AGENDA.jornadaDefecto = clon(espejo); };
  // Guarda la jornada nueva (motivo de 10 caracteres o más). Devuelve una promesa { ok, mensaje?, publicada? }.
  S.guardar = (f, motivo, por) => { const err = S.validar(f), mot = String(motivo || '').trim();
    if (Object.keys(err).length) return Promise.resolve({ ok: false, validacion: true, mensaje: err.dias || err.desde || err.hasta });
    if (mot.length < 10) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const prev = S.valor ? clon(S.valor) : null, antes = clon(S.defecto()), nuevo = { dias: f.dias.slice().sort((a, b) => a - b), desde: f.desde, hasta: f.hasta };
    if (S.igual(antes, nuevo)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'No hay cambios para guardar.' });
    aplicar(nuevo, nuevo); S.hist.unshift({ fecha: ahora(), por: por || '', que: 'Jornada por defecto de las visitas: ' + S.txt(antes) + ' → ' + S.txt(nuevo), motivo: mot, estado: 'Guardada' }); const reg = S.hist[0]; avisar();
    const SP = W.SiriusPublicar; if (!SP || !SP.activo || !SP.activo()) return Promise.resolve({ ok: true, local: true });
    const datos = Object.assign({}, clon(W.SIRIUS_AGENDA || {}), { jornadaDefecto: clon(nuevo) });
    return SP.publicar({ clave: 'SIRIUS_AGENDA', version: SP.versionDe ? SP.versionDe('SIRIUS_AGENDA', 0) : 1, datos, motivo: mot, pantalla: 'Configuración general › Agenda › Jornada por defecto de las visitas', aviso: 'Publicado: Coordinación usa la jornada nueva desde ahora; la app y los portales la verán al volver a abrirse',
      revertir: () => { aplicar(prev, antes); const i = S.hist.indexOf(reg); if (i >= 0) S.hist.splice(i, 1); avisar(); },
      alPublicar: (info) => { reg.estado = 'Publicada en la base · versión ' + info.version; avisar(); } }); };
  S.reset = () => { aplicar(null, SF().JORNADA_INICIAL); S.hist = []; avisar(); };
  W.SiriusJornada = S;
})();
