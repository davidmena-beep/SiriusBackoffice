// SIRIUS · Publicar la configuración en la base (prototipo · etapa C2-10 · DEC-187). Con SIRIUS_CONEXION activo, cada versión de configuración que se
// guarda en Administración se publica con accion('publicarConfiguracion', { clave, version, datos, motivo }): clave es el nombre del objeto de
// configuración (p. ej. SIRIUS_CATALOGOS_MAESTROS), datos el objeto completo ya con el cambio (sin funciones) y version la versión nueva.
// Con { ok: true }: aviso «Publicado: la app y los portales lo verán al volver a abrirse» y la pantalla anota «Publicada en la base» con la fecha.
// Con { ok: false } (o un error): se revierte el cambio (revertir) y se muestra el mensaje. Solo el Administrador publica.
// Sin conexión (demostración) no hace nada: devuelve { ok: true, local: true } y ninguna pantalla cambia.
// Uso: SiriusPublicar.publicar({ clave, version?, base?, datos, motivo, pantalla, revertir(), alPublicar({ version, fecha }) }) → promesa.
// El back-office entrega el contexto (rol, aviso, usuario y hora) en SiriusPublicar.ctx. `simular` solo lo usa la escena confpublicar.
(function () {
  'use strict';
  const W = window; if (W.SiriusPublicar) return;
  const reg = {}, ON = [];
  const limpio = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x));
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  const S = { ctx: null, registro: reg, simular: false };
  S.activo = () => S.simular || !!(W.SIRIUS_CONEXION && W.SIRIUS_CONEXION.activo === true && typeof W.SIRIUS_CONEXION.accion === 'function');
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  S.ultima = (clave) => (reg[clave] || [])[0] || null;
  S.versionDe = (clave, base) => { const b = Number(base), u = S.ultima(clave); return Math.max(isNaN(b) ? 0 : b, u ? u.version : 0) + 1; };
  S.publicar = (o) => { o = o || {}; if (!S.activo()) return Promise.resolve({ ok: true, local: true });
    const ctx = S.ctx || {}, rol = ctx.rol ? ctx.rol() : 'Administrador', toast = (m) => { if (ctx.toast) ctx.toast(m); };
    if (rol !== 'Administrador') { if (o.revertir) o.revertir(); const r = { ok: false, mensaje: 'Solo el Administrador publica la configuración en la base; el cambio no se guardó.' }; toast(r.mensaje); return Promise.resolve(r); }
    const version = o.version != null ? Number(o.version) : S.versionDe(o.clave, o.base), carga = { clave: o.clave, version, datos: limpio(o.datos), motivo: String(o.motivo || '').trim() };
    let pr; try { pr = S.simular && !(W.SIRIUS_CONEXION && W.SIRIUS_CONEXION.activo === true) ? Promise.resolve({ ok: true }) : Promise.resolve(W.SIRIUS_CONEXION.accion('publicarConfiguracion', carga)); } catch (e) { pr = Promise.reject(e); }
    return pr.then((r) => r || { ok: true }, (e) => ({ ok: false, mensaje: String((e && e.message) || e || 'Error de la conexión') })).then((r) => {
      if (r.ok === false) { if (o.revertir) o.revertir(); toast((r.mensaje || 'No se pudo publicar en la base') + '. Se deshizo el cambio.'); return r; }
      const fecha = ctx.ahora ? ctx.ahora() : '18/10/26 · 20:30', info = { version, fecha, motivo: carga.motivo, por: ctx.usuario ? ctx.usuario() : '', pantalla: o.pantalla || '' };
      (reg[o.clave] = reg[o.clave] || []).unshift(info); if (o.alPublicar) { try { o.alPublicar(info); } catch (e) { /* nada */ } }
      toast('Publicado: la app y los portales lo verán al volver a abrirse'); avisar(); return Object.assign({}, r, info, { ok: true }); }); };
  W.SiriusPublicar = S;
})();
