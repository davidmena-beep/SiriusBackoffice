// SIRIUS · Intentos sin respuesta para sugerir el enlace de autoagendamiento (v1.0 · etapa G-2c3 · DEC-237 · 18/10/2026).
// Coordinar visita › Contacto destaca en ámbar el recuadro «Enlace de autoagendamiento» cuando el caso tiene este número de intentos sin respuesta
// (No contestó, Buzón de voz o Número equivocado) o la persona «Prefiere agendar solo».
// Parametrizable: vive en SIRIUS_AGENDA.intentosSinRespuesta (número de 1 a 10; valor inicial 3). Lectura: SiriusIntentos.maximo() (primero lo editado en la sesión).
// Edición: Administración › Configuración general › Agenda (solo el Administrador) con SiriusIntentos.guardar(n, motivo, por); pide motivo y queda en el historial.
// Con la conexión se publica con SiriusPublicar como parte de SIRIUS_AGENDA (igual que la jornada por defecto); con { ok: false } el cambio vuelve atrás.
(function () {
  'use strict';
  const W = window; if (W.SiriusIntentos) return;
  const INICIAL = 3, ON = [], S = { valor: null, hist: [] };
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  const valido = (n) => Number.isInteger(+n) && +n >= 1 && +n <= 10;
  S.INICIAL = INICIAL; S.OPCIONES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  S.maximo = () => { if (S.valor != null) return S.valor; const v = (W.SIRIUS_AGENDA || {}).intentosSinRespuesta; return valido(v) ? +v : INICIAL; };
  S.historial = () => S.hist.slice();
  const ahora = () => { const SC = W.SiriusCompania; if (SC && SC.ahoraIso) return SC.ahoraIso(); const E = W.SIRIUS_EJEMPLO || {}, d = E.ahora ? E.ahora() : new Date(), z = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + 'T' + z(d.getHours()) + ':' + z(d.getMinutes()); };
  const aplicar = (v) => { S.valor = v == null ? null : +v; if (W.SIRIUS_AGENDA) { if (v == null) delete W.SIRIUS_AGENDA.intentosSinRespuesta; else W.SIRIUS_AGENDA.intentosSinRespuesta = +v; } };
  // Guarda el valor nuevo (motivo de 10 caracteres o más). Devuelve una promesa { ok, mensaje?, local? }.
  S.guardar = (n, motivo, por) => { const mot = String(motivo || '').trim(), antes = S.maximo();
    if (!valido(n)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Elige un número de 1 a 10.' });
    if (+n === antes) return Promise.resolve({ ok: false, validacion: true, mensaje: 'No hay cambios para guardar.' });
    if (mot.length < 10) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const prev = S.valor; aplicar(+n); S.hist.unshift({ fecha: ahora(), por: por || '', que: 'Intentos sin respuesta para sugerir el enlace de autoagendamiento: ' + antes + ' → ' + n, motivo: mot, estado: 'Guardado' }); const reg = S.hist[0]; avisar();
    const SP = W.SiriusPublicar; if (!SP || !SP.activo || !SP.activo()) return Promise.resolve({ ok: true, local: true });
    const datos = Object.assign({}, JSON.parse(JSON.stringify(W.SIRIUS_AGENDA || {})), { intentosSinRespuesta: +n });
    return SP.publicar({ clave: 'SIRIUS_AGENDA', version: SP.versionDe ? SP.versionDe('SIRIUS_AGENDA', 0) : 1, datos, motivo: mot, pantalla: 'Configuración general › Agenda › Intentos sin respuesta', aviso: 'Publicado: Coordinación usa el valor nuevo desde ahora',
      revertir: () => { aplicar(prev); const i = S.hist.indexOf(reg); if (i >= 0) S.hist.splice(i, 1); avisar(); },
      alPublicar: (info) => { reg.estado = 'Publicado en la base · versión ' + info.version; avisar(); } }); };
  W.SiriusIntentos = S;
})();
