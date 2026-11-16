// SIRIUS · Datos maestros por identificación (v1.0 · etapa P-6f-b · DEC-214 · 15/11/2026).
// Agencias por RUC (13 dígitos que terminan en 001, único) y personas (internos, inspectores independientes y de agencia) por tipo de
// identificación (Cédula o Pasaporte) e identificación, obligatorias y únicas en la compañía.
// Referencias: lo que apunta a una persona o agencia guarda su clave (la identificación; sin ella, el nombre como referencia de transición)
// y muestra su nombre actual. Si alguien cambia de nombre, el nombre anterior queda como alias de su identificación: lo que todavía
// guarde el nombre viejo sigue resolviendo a la misma persona y se muestra con el nombre nuevo.
// Uso: SiriusMaestros.cedula(v) / pasaporte(v) / ruc(v) / ident(tipo, v) → '' o el mensaje junto al campo;
//      persona(ref), clave(ref), nombre(ref), mismo(a, b), buscar(mapa, ref) (lee un mapa guardado por nombre o por identificación);
//      agencia(ref), agenciaClave(ref), agenciaNombre(ref); repetida(tipo, ident, excluirNombre), rucRepetido(ruc, excluirId);
//      renombrar(ref, nuevo) (personas), sinIdentificacion() → { usuarios, agencias, total }; identTxt(persona).
(function () {
  'use strict';
  const W = window; if (W.SiriusMaestros) return;
  const M = {}, ON = [];
  M.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  const avisar = () => { cache = null; ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } }); };
  M.avisar = avisar;
  const sd = (s) => String(s == null ? '' : s).trim();
  M.TIPOS = ['Cédula', 'Pasaporte'];

  // ---------- Validaciones (mensaje junto al campo) ----------
  M.cedula = (v) => { v = sd(v); if (!v) return 'Escribe la cédula.'; if (!/^\d+$/.test(v)) return 'La cédula solo lleva números.'; if (v.length !== 10) return 'La cédula tiene 10 dígitos (escribiste ' + v.length + ').';
    const p = Number(v.slice(0, 2)); if (!((p >= 1 && p <= 24) || p === 30)) return 'La cédula no es válida (provincia: los dos primeros dígitos van de 01 a 24 o son 30).';
    if (Number(v[2]) >= 6) return 'La cédula no es válida (el tercer dígito debe ser menor que 6).';
    let s = 0; for (let i = 0; i < 9; i++) { let x = Number(v[i]) * (i % 2 === 0 ? 2 : 1); if (x > 9) x -= 9; s += x; }
    return (10 - (s % 10)) % 10 === Number(v[9]) ? '' : 'La cédula no es válida (dígito verificador).'; };
  M.pasaporte = (v) => { v = sd(v); if (!v) return 'Escribe el número de pasaporte.'; return /^[A-Za-z0-9]{5,20}$/.test(v) ? '' : 'El pasaporte lleva de 5 a 20 letras o números, sin espacios ni signos.'; };
  M.ruc = (v) => { v = sd(v); if (!v) return 'Escribe el RUC.'; if (!/^\d+$/.test(v)) return 'El RUC solo lleva números.'; if (v.length !== 13) return 'El RUC tiene 13 dígitos (escribiste ' + v.length + ').';
    return v.slice(10) === '001' ? '' : 'El RUC debe terminar en 001.'; };
  M.ident = (tipo, v) => (!tipo ? 'Elige el tipo de identificación.' : tipo === 'Pasaporte' ? M.pasaporte(v) : M.cedula(v));
  M.normal = (tipo, v) => (tipo === 'Pasaporte' ? sd(v).toUpperCase() : sd(v).replace(/\D/g, ''));

  // ---------- Personas ----------
  // Fuentes: usuarios del ejemplo (SIRIUS_USUARIOS) y, con la conexión, usuarios[] e inspectores[] de la base.
  let cache = null;
  M.alias = {}; // nombre anterior → clave (identificación)
  // Los cambios de la sesión (renombres y, en la escena maestrossinid, fichas sin identificación) se vuelven a aplicar si una pantalla recarga los datos del ejemplo.
  M.parches = { renombres: [], quitarId: [], quitarRuc: [] };
  M.aplicar = () => { const U = W.SIRIUS_USUARIOS || {}, E = W.SIRIUS_EJEMPLO || {}, P = M.parches;
    P.renombres.forEach((r) => { (U.usuarios || []).forEach((u) => { if (u.nombre === r.viejo && (!r.clave || !u.identificacion || u.identificacion === r.clave)) u.nombre = r.nuevo; }); (E.inspectores || []).forEach((i) => { if (i.n === r.viejo) { i.n = r.nuevo; if (r.clave) i.id = r.clave; } }); });
    P.quitarId.forEach((n) => { const u = (U.usuarios || []).find((x) => x.nombre === n); if (u && u.identificacion) { delete u.tipoIdentificacion; delete u.identificacion; } });
    P.quitarRuc.forEach((id) => { const a = (U.agencias || []).find((x) => x.id === id); if (a && a.ruc) a.ruc = ''; }); };
  const lista = () => {
    if (cache) return cache; M.aplicar(); const L = [], visto = {};
    const add = (o, fuente) => { if (!o || !sd(o.nombre || o.n)) return; const id = sd(o.identificacion), k = id || 'n:' + sd(o.nombre || o.n); if (visto[k]) return; visto[k] = 1;
      L.push({ nombre: sd(o.nombre || o.n), tipoIdentificacion: id ? (o.tipoIdentificacion || 'Cédula') : '', identificacion: id, correo: o.correo || o.email || '', ref: o, fuente }); };
    const X = W.SIRIUS_CONEXION; if (!(X && X.activo)) ((W.SIRIUS_USUARIOS || {}).usuarios || []).forEach((u) => add(u, 'ejemplo')); // con la conexión, solo personas de la base
    if (X && X.activo) { (Array.isArray(X.usuarios) ? X.usuarios : []).forEach((u) => add(u, 'base')); (Array.isArray(X.inspectores) ? X.inspectores : []).forEach((u) => add(u, 'base')); }
    cache = L; Promise.resolve().then(() => { cache = null; }); return L; };
  M.personas = () => lista().slice();
  M.persona = (ref) => { const r = sd(ref); if (!r) return null; const L = lista();
    let p = L.find((x) => x.identificacion && x.identificacion === r) || L.find((x) => x.nombre === r); if (p) return p;
    let a = M.alias[r], n = 0; while (a && M.alias[a] && n++ < 8) a = M.alias[a]; // cadena de renombres
    return a ? (L.find((x) => x.identificacion && x.identificacion === a) || L.find((x) => x.nombre === a) || null) : null; };
  M.clave = (ref) => { const p = M.persona(ref); return p ? (p.identificacion || p.nombre) : sd(ref); };
  M.nombre = (ref) => { const p = M.persona(ref); return p ? p.nombre : sd(ref); };
  M.mismo = (a, b) => !!sd(a) && !!sd(b) && M.clave(a) === M.clave(b);
  M.identTxt = (p) => (p && sd(p.identificacion) ? (p.tipoIdentificacion || 'Cédula') + ' ' + sd(p.identificacion) : 'Sin identificación');
  // Lee un mapa guardado por identificación o (datos anteriores) por nombre: primero la clave, luego el nombre actual, luego cualquier nombre anterior.
  M.buscar = (mapa, ref) => { if (!mapa || !sd(ref)) return undefined; const k = M.clave(ref); if (mapa[k] !== undefined) return mapa[k]; const n = M.nombre(ref); if (mapa[n] !== undefined) return mapa[n]; if (mapa[ref] !== undefined) return mapa[ref];
    const o = Object.keys(mapa).find((x) => M.clave(x) === k); return o === undefined ? undefined : mapa[o]; };
  // Identificación repetida en la compañía (excluye a la persona que se edita).
  M.repetida = (tipo, ident, excluir) => { const v = M.normal(tipo, ident); if (!v) return ''; const ex = excluir ? M.clave(excluir) : '';
    const p = lista().find((x) => x.identificacion && x.identificacion.toUpperCase() === v.toUpperCase() && (x.identificacion || x.nombre) !== ex);
    return p ? 'Esa identificación ya está registrada (' + p.nombre + '). La identificación es única en la compañía.' : ''; };
  // Cambio de nombre: el nombre anterior queda como alias de la clave. Actualiza el usuario y el catálogo de inspectores del ejemplo.
  M.renombrar = (ref, nuevo) => { const p = M.persona(ref), n = sd(nuevo); if (!p || !n || p.nombre === n) return null; const viejo = p.nombre, k = p.identificacion || n;
    if (p.ref) { if ('nombre' in p.ref || !('n' in p.ref)) p.ref.nombre = n; else p.ref.n = n; }
    const E = W.SIRIUS_EJEMPLO || {}; (E.inspectores || []).forEach((i) => { if (i.n === viejo) { i.n = n; if (p.identificacion) i.id = p.identificacion; } });
    Object.keys(M.alias).forEach((a) => { if (M.alias[a] === viejo) M.alias[a] = k; }); M.alias[viejo] = k; M.renombres.push({ viejo, nuevo: n }); M.parches.renombres.push({ viejo, nuevo: n, clave: p.identificacion || '' }); avisar(); return { viejo, nuevo: n, clave: k }; };
  // Al cambiar de escena: el catálogo de inspectores vuelve a sus nombres y se olvidan los alias de la sesión (los usuarios los repone SiriusUsuarios.reset).
  M.renombres = [];
  M.reset = () => { const E = W.SIRIUS_EJEMPLO || {}; M.renombres.slice().reverse().forEach((r) => (E.inspectores || []).forEach((i) => { if (i.n === r.nuevo) i.n = r.viejo; })); M.renombres = []; M.parches = { renombres: [], quitarId: [], quitarRuc: [] }; Object.keys(M.alias).forEach((a) => { delete M.alias[a]; }); avisar(); };

  // ---------- Agencias ----------
  const agencias = () => { M.aplicar(); const L = ((W.SIRIUS_USUARIOS || {}).agencias || []).slice(); const X = W.SIRIUS_CONEXION; if (X && X.activo && Array.isArray(X.agencias)) X.agencias.forEach((a) => { if (a && !L.some((b) => (a.ruc && b.ruc === a.ruc))) L.push(a); }); return L; };
  M.agencias = () => agencias();
  M.agencia = (ref) => { const r = sd(ref).toLowerCase(); if (!r) return null; const L = agencias();
    return L.find((a) => sd(a.ruc) === r) || L.find((a) => sd(a.id).toLowerCase() === r) || L.find((a) => [a.nombre, a.razonSocial, a.nombreComercial].some((x) => sd(x).toLowerCase() === r))
      || L.find((a) => [a.nombre, a.razonSocial, a.nombreComercial].some((x) => { const t = sd(x).toLowerCase(); return t && (t.indexOf(r) === 0 || r.indexOf(t) === 0); })) || null; };
  M.agenciaClave = (ref) => { const a = M.agencia(ref); return a ? (sd(a.ruc) || a.id || a.nombre) : sd(ref); };
  M.agenciaNombre = (ref) => { const a = M.agencia(ref); return a ? (a.nombre || a.razonSocial || a.nombreComercial) : sd(ref); };
  M.rucRepetido = (ruc, excluir) => { const v = sd(ruc); if (!v) return ''; const a = agencias().find((x) => sd(x.ruc) === v && x.id !== excluir && x.nombre !== excluir);
    return a ? 'Ese RUC ya es de ' + (a.nombre || a.razonSocial) + '. El RUC es único.' : ''; };

  // ---------- Fichas sin identificación (datos anteriores a DEC-214) ----------
  M.sinIdentificacion = () => { M.aplicar(); const us = ((W.SIRIUS_USUARIOS || {}).usuarios || []).filter((u) => !sd(u.identificacion) && u.estado !== 'Inactivo'), ag = ((W.SIRIUS_USUARIOS || {}).agencias || []).filter((a) => !sd(a.ruc));
    return { usuarios: us, agencias: ag, total: us.length + ag.length }; };
  // Catálogo de inspectores del ejemplo: cada uno lleva la identificación de su usuario.
  M.sincronizar = () => { const E = W.SIRIUS_EJEMPLO || {}; (E.inspectores || []).forEach((i) => { const p = M.persona(i.n); if (p && p.identificacion) i.id = p.identificacion; }); };
  // Escenas (solo en el prototipo). maestrosrenombrar: Diana Cárdenas (cédula de prueba 1709991127) pasa a «Diana Cárdenas Vela»; su cobertura y una tarifa propia quedan
  // guardadas por su identificación. maestrossinid: Paola Vinueza y Peritajes del Pacífico quedan sin identificación. Idempotente: se vuelve a aplicar si los datos se recargan.
  M.escena = (e) => { const U = W.SIRIUS_USUARIOS; if (!U) return;
    if (e === 'maestrossinid') { if (M.parches.quitarId.indexOf('Paola Vinueza') < 0) M.parches.quitarId.push('Paola Vinueza'); if (M.parches.quitarRuc.indexOf('pacifico') < 0) M.parches.quitarRuc.push('pacifico'); M.aplicar(); avisar(); }
    if (e === 'maestrosrenombrar') { const id = '1709991127', nuevo = 'Diana Cárdenas Vela', C = W.SiriusCobertura, TC = W.SiriusTarifasCuentas, TS = TC && TC.S ? TC.S() : null;
      if (C && C.ed && !C.ed[id]) C.ed[id] = { modo: 'ciudad', sucursales: [], ciudades: [{ cod: '1701', zonas: ['z1701-2', 'z1701-3'] }] };
      if (TS && Array.isArray(TS.tarifas) && !TS.tarifas.some((x) => x.id === 'TAI-EUR-DC')) TS.tarifas.push({ id: 'TAI-EUR-DC', agencia: 'eurosurvey', inspector: 'Diana Cárdenas', inspectorId: id, grupo: 'Ramos Generales', unidad: 'hora', valor: 14, desde: '2026-10-01', hasta: null, motivo: 'Tarifa propia por su experiencia en Ramos Generales.', por: 'Carla Ponce', fecha: '2026-09-28T10:00' });
      const u = (U.usuarios || []).find((x) => x.identificacion === id); if (!u || u.nombre === nuevo) return;
      const SU = W.SiriusUsuarios; if (SU && !M.alias[u.nombre]) SU.editar(u.nombre, { nombre: nuevo }, 'Andrea Salazar', 'Actualizó su nombre según el registro civil.'); else { u.nombre = nuevo; avisar(); } } };
  W.SiriusMaestros = M;
  try { M.sincronizar(); } catch (e) { /* nada */ }
})();
