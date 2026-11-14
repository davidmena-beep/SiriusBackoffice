// SIRIUS · Cobertura del inspector (v1.0 · etapa G-2b · DEC-223 · 18/10/2026). Reemplaza las «zonas» del inspector (que en realidad eran sucursales).
// Cobertura = { modo: 'todas' | 'sucursales' | 'ciudad', sucursales: [], ciudades: [{ cod (COD_CANTON), zonas: [ids de SIRIUS_ZONAS] }] }, un solo modo por inspector:
//   'todas': cualquier inspección, en cualquier ciudad. 'sucursales': los casos que solicitan esas sucursales (catálogo de 11), estén donde estén.
//   'ciudad': las inspecciones en esas ciudades; en una ciudad con zonas, zonas vacías = toda la ciudad, si no, solo esas zonas; una ciudad sin zonas es siempre la ciudad entera.
// Las coberturas apuntan al id de la zona y al código de la ciudad (renombrar no rompe nada). Una zona inactiva o eliminada deja de contar (la ficha avisa; la eliminada
// se quita al guardar). Migración sin cambio de comportamiento: las «zonas» actuales pasan a 'sucursales' con esos valores; sin zonas, 'todas'.
// Fuente de la cobertura de un inspector: lo guardado en la sesión → con la conexión, SIRIUS_CONEXION.usuarios[].cobertura o inspectores[].cobertura
// → la del objeto (red o disponibilidad) → migrar(zonas). La edita el Administrador con motivo (con la conexión, editarUsuario { email, cambios: { cobertura }, motivo }).
// Uso: SiriusCobertura.cubre(inspector, { sucursal, ciudad, zonaId }) → { nivel: 'zona' | 'ciudad' | 'sucursal' | 'todas' | null, por, faltaLugar? };
//      resumen(inspector) (frase), corto(inspector) (para listas), avisos(inspector), migrar(inspector), de(inspector), guardar(...), SiriusCobertura.Editor (React).
(function () {
  'use strict';
  const W = window; if (W.SiriusCobertura) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), ON = [];
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  const S = { ed: {}, hist: [] };
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  const Z = () => W.SiriusZonas || null, UB = () => W.SiriusUsuariosBase || null, X = () => W.SIRIUS_CONEXION || null;
  const arr = (x) => (Array.isArray(x) ? x.filter((v) => v != null && v !== '').map(String) : []);
  S.lista = (a) => { a = a.slice(); if (a.length <= 1) return a.join(''); const u = a.pop(); return a.join(', ') + ' y ' + u; };
  S.MODOS = [['todas', 'Todas', 'Cualquier inspección, en cualquier ciudad.'], ['sucursales', 'Por sucursales', 'Los casos que solicitan ciertas sucursales de Aseguradora del Sur, estén donde estén.'], ['ciudad', 'Por ciudad y zona', 'Las inspecciones en ciertas ciudades; en las ciudades grandes, solo en las zonas que elijas.']];
  S.sucursales = () => { const E = W.SIRIUS_EJEMPLO || {}, L = ((E.catalogos || {}).sucursales || []).map((x) => (typeof x === 'string' ? x : x && (x.nombre || x.n))).filter(Boolean); return L.length ? L : ['Quito', 'Loja', 'Cuenca', 'Machala', 'Santo Domingo', 'Riobamba', 'Ambato', 'Ibarra', 'Manta', 'El Coca', 'Guayaquil']; };
  S.ciudadNombre = (cod) => { const c = Z() && Z().ciudad(cod); return c ? c.nombre : String(cod); };
  // Zonas publicadas de una ciudad (todas, con su estado) y las activas.
  const zonasCiudad = (cod) => { const z = Z() && Z().publicadasDe ? Z().publicadasDe(cod) : null; return z ? z.zonas : []; };
  const activasCiudad = (cod) => zonasCiudad(cod).filter((x) => x.estado !== 'Inactiva');
  S.zonaNombre = (cod, id) => { const x = zonasCiudad(cod).find((y) => y.id === id); return x ? x.nombre : id; };
  S.normalizar = (c) => { c = c || {}; const modo = ['todas', 'sucursales', 'ciudad'].indexOf(c.modo) >= 0 ? c.modo : 'todas';
    const ciudades = (Array.isArray(c.ciudades) ? c.ciudades : []).filter((x) => x && x.cod).map((x) => ({ cod: String(x.cod), zonas: arr(x.zonas) })).filter((x, i, a) => a.findIndex((y) => y.cod === x.cod) === i);
    return { modo, sucursales: arr(c.sucursales).filter((x, i, a) => a.indexOf(x) === i), ciudades }; };
  // Migración: las «zonas» actuales (sucursales) pasan a 'sucursales'; sin zonas, 'todas'.
  S.migrar = (ins) => { const z = arr(ins && ins.zonas); return z.length ? { modo: 'sucursales', sucursales: z, ciudades: [] } : { modo: 'todas', sucursales: [], ciudades: [] }; };
  const nombreDe = (ins) => (typeof ins === 'string' ? ins : ins ? String(ins.inspector || ins.nombre || ins.n || '') : '');
  // Zonas heredadas de un inspector del ejemplo (lo que hoy usan la Agenda y la red): la red, si no, la disponibilidad.
  S.zonasHeredadas = (n) => { const A = W.SIRIUS_AGENDA || {}, r = (A.red || []).find((x) => x.inspector === n), d = (A.disponibilidad || []).find((x) => x.inspector === n);
    const AP = W.SiriusAppInspectorLogic, ov = AP && AP.perfilDe ? AP.perfilDe(n) : null; return arr(ov && ov.zonas && ov.zonas.length ? ov.zonas : r ? r.zonas : d ? d.zonas : []); };
  // Con la conexión: el usuario de la base (por nombre o correo) o el inspector de SIRIUS_CONEXION.inspectores.
  const deBase = (n) => { const B = UB(); if (B && B.activo && B.activo()) { const u = B.lista().find((x) => x.nombre === n || x.email === String(n).toLowerCase()); if (u) return u.cobertura ? S.normalizar(u.cobertura) : S.migrar(u); }
    const C = X(); if (C && C.activo === true && Array.isArray(C.inspectores)) { const i = C.inspectores.find((x) => x && x.nombre === n); if (i) return i.cobertura ? S.normalizar(i.cobertura) : S.migrar(i); } return null; };
  S.de = (ins) => { const n = nombreDe(ins); if (n && S.ed[n]) return S.normalizar(S.ed[n]);
    if (ins && typeof ins === 'object' && ins.cobertura) return S.normalizar(ins.cobertura);
    const b = n ? deBase(n) : null; if (b) return b;
    if (ins && typeof ins === 'object' && Array.isArray(ins.zonas)) return S.migrar(ins);
    return S.migrar({ zonas: S.zonasHeredadas(n) }); };
  // ¿Cubre este lugar? lugar = { sucursal, ciudad (COD_CANTON), zonaId }.
  S.cubre = (ins, lugar) => { const c = (ins && ins.modo) ? S.normalizar(ins) : S.de(ins); lugar = lugar || {};
    if (c.modo === 'todas') return { nivel: 'todas', por: 'Atiende todas las inspecciones' };
    if (c.modo === 'sucursales') { const s = lugar.sucursal; if (!s) return { nivel: null, por: 'Falta la sucursal del caso para saber si cubre', faltaLugar: true };
      return c.sucursales.indexOf(s) >= 0 ? { nivel: 'sucursal', por: 'Atiende la sucursal ' + s } : { nivel: null, por: 'No atiende la sucursal ' + s }; }
    if (!lugar.ciudad) return { nivel: null, por: 'Falta el lugar de la inspección para saber si cubre', faltaLugar: true };
    const x = c.ciudades.find((y) => y.cod === String(lugar.ciudad)), nom = S.ciudadNombre(lugar.ciudad);
    if (!x) return { nivel: null, por: 'No atiende ' + nom };
    const act = activasCiudad(x.cod), validas = x.zonas.filter((id) => act.some((z) => z.id === id));
    if (!x.zonas.length || !act.length) return { nivel: 'ciudad', por: 'Atiende toda ' + nom };
    if (!validas.length) return { nivel: null, por: 'Sus zonas en ' + nom + ' están inactivas: no recibe inspecciones ahí' };
    if (!lugar.zonaId) return { nivel: null, por: 'Falta la zona del lugar para saber si cubre', faltaLugar: true };
    return validas.indexOf(lugar.zonaId) >= 0 ? { nivel: 'zona', por: 'Atiende la zona ' + S.zonaNombre(x.cod, lugar.zonaId) } : { nivel: null, por: 'No atiende la zona ' + S.zonaNombre(x.cod, lugar.zonaId) + ' de ' + nom }; };
  // Zonas de una ciudad de la cobertura que cuentan (existen y están activas) y las que no.
  const partes = (x) => { const todas = zonasCiudad(x.cod), act = activasCiudad(x.cod); return { validas: x.zonas.filter((id) => act.some((z) => z.id === id)), inactivas: x.zonas.filter((id) => todas.some((z) => z.id === id && z.estado === 'Inactiva')), eliminadas: x.zonas.filter((id) => !todas.some((z) => z.id === id)), sinZonas: !act.length }; };
  S.avisos = (ins) => { const c = (ins && ins.modo) ? S.normalizar(ins) : S.de(ins), out = []; if (c.modo !== 'ciudad') return out;
    c.ciudades.forEach((x) => { const p = partes(x); p.eliminadas.forEach((id) => out.push('La zona eliminada ' + id + ' ya no cuenta en su cobertura'));
      if (x.zonas.length && !p.sinZonas && !p.validas.length) out.push('Sus zonas en ' + S.ciudadNombre(x.cod) + ' están inactivas: no recibe inspecciones ahí'); });
    return out; };
  const ciudadTxt = (x, largo) => { const p = partes(x), nom = S.ciudadNombre(x.cod);
    if (!x.zonas.length || p.sinZonas) return largo ? nom + ' (toda la ciudad)' : nom + ': toda la ciudad';
    if (!p.validas.length) return largo ? nom + ' (sus zonas están inactivas)' : nom + ': zonas inactivas';
    const t = S.lista(p.validas.map((id) => S.zonaNombre(x.cod, id))); return largo ? nom + ' (' + t + ')' : nom + ': ' + t; };
  S.resumen = (ins) => { const c = (ins && ins.modo) ? S.normalizar(ins) : S.de(ins);
    if (c.modo === 'todas') return 'Atiende todas las inspecciones, en cualquier ciudad.';
    if (c.modo === 'sucursales') return c.sucursales.length ? 'Atiende los casos que solicitan ' + (c.sucursales.length === 1 ? 'la sucursal ' : 'las sucursales ') + S.lista(c.sucursales) + ', estén donde estén.' : 'Sin sucursales: no recibe inspecciones.';
    return c.ciudades.length ? 'Atiende en ' + S.lista(c.ciudades.map((x) => ciudadTxt(x, true))) + '.' : 'Sin ciudades: no recibe inspecciones.'; };
  S.corto = (ins) => { const c = (ins && ins.modo) ? S.normalizar(ins) : S.de(ins);
    if (c.modo === 'todas') return 'Todas';
    if (c.modo === 'sucursales') return c.sucursales.length ? 'Sucursales: ' + c.sucursales.join(', ') : 'Sin sucursales';
    return c.ciudades.length ? c.ciudades.map((x) => ciudadTxt(x, false)).join(' · ') : 'Sin ciudades'; };
  // Quita las zonas eliminadas (su id ya no existe en SIRIUS_ZONAS); se aplica al guardar.
  S.limpiar = (c) => { c = S.normalizar(c); if (c.modo !== 'ciudad') return { modo: c.modo, sucursales: c.modo === 'sucursales' ? c.sucursales : [], ciudades: [] };
    return { modo: 'ciudad', sucursales: [], ciudades: c.ciudades.map((x) => ({ cod: x.cod, zonas: x.zonas.filter((id) => zonasCiudad(x.cod).some((z) => z.id === id)), antes: x.zonas.length })).filter((x) => !(x.antes && !x.zonas.length)).map((x) => ({ cod: x.cod, zonas: x.zonas })) }; }; // G-2a2: si todas sus zonas de una ciudad se eliminaron, la ciudad sale (zonas vacías sería «toda la ciudad»)
  S.igual = (a, b) => JSON.stringify(S.limpiar(a)) === JSON.stringify(S.limpiar(b));
  // Guarda la cobertura (motivo de 10 caracteres o más). o = { nombre, email?, cobertura, motivo, por }. Con la conexión y el correo del usuario de la base,
  // editarUsuario { email, cambios: { cobertura }, motivo }; con { ok: false } vuelve atrás. Sin la conexión, queda en la sesión y en el historial del usuario.
  S.guardar = (o) => { o = o || {}; const n = o.nombre, mot = String(o.motivo || '').trim(), nueva = S.limpiar(o.cobertura), antes = S.de(n);
    if (mot.length < 10) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    if (nueva.modo === 'sucursales' && !nueva.sucursales.length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Elige al menos una sucursal.' });
    if (nueva.modo === 'ciudad' && !nueva.ciudades.length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Agrega al menos una ciudad.' });
    if (JSON.stringify(nueva) === JSON.stringify(antes)) return Promise.resolve({ ok: false, validacion: true, mensaje: 'No hay cambios para guardar.' });
    const B = UB(), conBase = !!(B && B.activo && B.activo() && o.email && B.usuario(o.email));
    const reg = { fecha: ahora(), por: o.por || '', inspector: n, antes: S.corto(antes), despues: S.corto(nueva), motivo: mot, estado: conBase ? 'Enviado a la base' : 'Guardado en la sesión' };
    if (conBase) return B.editar(o.email, { cobertura: nueva }, mot, o.por).then((r) => { if (r && r.ok) { delete S.ed[n]; S.hist.unshift(Object.assign(reg, { estado: 'Guardado en la base' })); avisar(); return { ok: true, cobertura: nueva }; } return r || { ok: false, mensaje: 'La base no guardó el cambio.' }; });
    S.ed[n] = nueva; S.hist.unshift(reg); const SU = W.SiriusUsuarios; if (SU && Array.isArray(SU.hist)) SU.hist.unshift({ fecha: SU.ahora ? SU.ahora() : reg.fecha, por: o.por || '', objeto: n, accion: 'Cobertura: ' + reg.antes + ' → ' + reg.despues, motivo: mot });
    avisar(); return Promise.resolve({ ok: true, local: true, cobertura: nueva }); };
  const z2 = (v) => String(v).padStart(2, '0');
  const ahora = () => { const SC = W.SiriusCompania; let iso = SC && SC.ahoraIso ? SC.ahoraIso() : null; if (!iso) { const d = new Date(); iso = d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes()); } return iso; };
  // Escenas (las llama Usuarios al abrir la escena).
  S.escena = (e) => {
    if (e === 'cobertura' || e === 'coberturalectura') S.ed['Mauricio Endara'] = { modo: 'ciudad', sucursales: [], ciudades: [{ cod: '1701', zonas: ['z1701-1', 'z1701-2'] }] };
    if (e === 'coberturazonainactiva') { const SZ = Z(); if (SZ && SZ.tocar) { const cz = SZ.tocar('1701'), x = cz.zonas.find((y) => y.id === 'z1701-5'); if (x && x.estado !== 'Inactiva') { x.estado = 'Inactiva'; SZ.registrar('1701', 'Desactivó ' + x.nombre, 'est:' + x.id); SZ.publicar('1701', 'Escena: zona fuera de servicio por obras en la vía.', 'Escena de demostración'); } }
      S.ed['Sofía Arteaga'] = { modo: 'ciudad', sucursales: [], ciudades: [{ cod: '1701', zonas: ['z1701-5'] }, { cod: '0101', zonas: ['z0101-2', 'z0101-9'] }] }; }
    if (e === 'zonaseliminar') { S.ed['Mauricio Endara'] = { modo: 'ciudad', sucursales: [], ciudades: [{ cod: '1701', zonas: ['z1701-1', 'z1701-2'] }] }; S.ed['Diana Cárdenas'] = { modo: 'ciudad', sucursales: [], ciudades: [{ cod: '1701', zonas: ['z1701-2', 'z1701-3'] }] }; }
    avisar(); };
  // Etapa G-2a2 · DEC-235: a quién afecta eliminar una zona y cómo sale de las coberturas al publicar.
  S.inspectores = () => { const out = [], add = (n) => { if (n && out.indexOf(n) < 0) out.push(n); }, A = W.SIRIUS_AGENDA || {};
    Object.keys(S.ed).forEach(add); (A.disponibilidad || []).forEach((x) => add(x.inspector)); (A.red || []).forEach((x) => add(x.inspector));
    const SU = W.SiriusUsuarios; if (SU && SU.usuarios) (SU.usuarios() || []).forEach((u) => { if ((u.roles || []).some((r) => (SU.base ? SU.base(r) : r) === 'Inspector')) add(u.nombre); });
    const B = UB(); if (B && B.activo && B.activo()) B.lista().forEach((u) => { if (B.esInspector(u.roles)) add(u.nombre); });
    const C = X(); if (C && C.activo === true && Array.isArray(C.inspectores)) C.inspectores.forEach((i) => add(i && i.nombre)); return out; };
  S.conZona = (cod, id) => S.inspectores().filter((n) => { const c = S.de(n); return c.modo === 'ciudad' && c.ciudades.some((x) => x.cod === String(cod) && x.zonas.indexOf(id) >= 0); });
  // Al publicar la eliminación: se quita de las coberturas guardadas en la sesión (las de la base las actualiza la base).
  S.quitarZonas = (cod, ids) => { let n = 0; Object.keys(S.ed).forEach((k) => { const c = S.normalizar(S.ed[k]); c.ciudades.forEach((x) => { if (x.cod === String(cod)) { const a = x.zonas.length; x.zonas = x.zonas.filter((id) => ids.indexOf(id) < 0); n += a - x.zonas.length; x.vacia = a > 0 && !x.zonas.length; } }); c.ciudades = c.ciudades.filter((x) => !x.vacia).map((x) => ({ cod: x.cod, zonas: x.zonas })); S.ed[k] = c; }); /* si se queda sin zonas en esa ciudad, la ciudad sale (zonas vacías sería «toda la ciudad») */ if (n) avisar(); return n; };
  S.reset = () => { S.ed = {}; S.hist = []; avisar(); };

  // ---------- Editor (React): la sección «Cobertura» de la ficha del inspector ----------
  const R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  let css = false; const ponerCss = () => { if (css || !W.document) return; css = true; const s = document.createElement('style');
    s.textContent = '.scob-modo{display:flex;gap:10px;align-items:flex-start;text-align:left;width:100%;border:1.5px solid var(--border-default);border-radius:10px;padding:10px 12px;background:#fff;cursor:pointer;font-family:var(--font-brand)}' +
      '.scob-modo[aria-checked="true"]{border-color:var(--color-brand);background:var(--cyan-100)}.scob-modo:focus-visible,.scob-mc:focus-visible,.scob-lk:focus-visible{outline:2px solid var(--color-brand);outline-offset:2px}' +
      '.scob-r{flex:0 0 16px;width:16px;height:16px;border-radius:50%;border:2px solid var(--border-default);margin-top:2px;box-sizing:border-box}.scob-modo[aria-checked="true"] .scob-r{border:5px solid var(--color-brand)}' +
      '.scob-mc{display:inline-flex;align-items:center;gap:6px;border:1.5px solid var(--border-default);border-radius:8px;padding:5px 10px;cursor:pointer;background:#fff;font:400 14px var(--font-brand);color:var(--text-body)}' +
      '.scob-mc[aria-pressed="true"]{border-color:var(--color-brand);background:var(--cyan-100);color:var(--text-strong);font-weight:700}' +
      '.scob-lk{border:0;background:none;padding:2px 0;color:var(--text-link,var(--cyan-700));font:700 13px var(--font-brand);text-decoration:underline;cursor:pointer}' +
      '.scob-in{width:100%;box-sizing:border-box;height:40px;border:1.5px solid var(--input-outlined-border,#DADADA);border-radius:var(--radius-sm,8px);padding:0 12px;font:400 14px var(--font-brand);color:var(--text-strong)}.scob-in:focus{border-color:var(--color-brand);outline:none;box-shadow:0 0 0 3px var(--cyan-100)}';
    document.head.appendChild(s); };
  const lab = (t, extra) => h('span', Object.assign({ style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, extra || {}), t);
  const nota = (t, k) => h('p', { key: k, style: { margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 } }, t);
  function Editor(p) { const React = R(); ponerCss(); const [, setN] = React.useState(0), rer = () => setN((n) => n + 1);
    React.useEffect(() => S.on(rer), []); React.useEffect(() => { const Zm = Z(); return Zm && Zm.on ? Zm.on(rer) : undefined; }, []);
    const base = S.de(p.nombre), ref = React.useRef(null);
    if (!ref.current || ref.current.de !== p.nombre) ref.current = { de: p.nombre, b: clon(base), mot: '', q: '', msg: '', err: '', busy: false };
    const st = ref.current, b = st.b, puede = !!p.puede, cambio = !S.igual(b, base), motOk = st.mot.trim().length >= 10, avs = S.avisos(b);
    const valido = !(b.modo === 'sucursales' && !b.sucursales.length) && !(b.modo === 'ciudad' && !b.ciudades.length), ok = puede && cambio && motOk && valido && !st.busy;
    const set = (f) => { f(b); st.msg = ''; st.err = ''; rer(); };
    const modos = h('div', { role: 'radiogroup', 'aria-label': 'Modo de cobertura', 'aria-readonly': puede ? undefined : 'true', style: { display: 'flex', flexDirection: 'column', gap: 8 } }, S.MODOS.map((m, i) => {
      const on = b.modo === m[0], elegir = () => { if (puede) set((x) => { x.modo = m[0]; }); };
      const tecla = (e) => { if (!puede) return; if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); elegir(); } if (/Arrow(Down|Right|Up|Left)/.test(e.key)) { e.preventDefault(); const k = (i + (/Down|Right/.test(e.key) ? 1 : 2)) % 3; set((x) => { x.modo = S.MODOS[k][0]; }); setTimeout(() => { const el = document.querySelector('[data-cob-modo="' + S.MODOS[k][0] + '"]'); if (el) el.focus(); }, 0); } };
      return h('div', { key: m[0], className: 'scob-modo', role: 'radio', 'aria-checked': on ? 'true' : 'false', 'aria-disabled': puede ? undefined : 'true', tabIndex: puede ? (on ? 0 : -1) : (on ? 0 : -1), 'data-cob-modo': m[0], onClick: elegir, onKeyDown: tecla, style: puede ? undefined : { cursor: 'default' } },
        h('span', { className: 'scob-r', 'aria-hidden': 'true' }), h('span', null, h('strong', { style: { display: 'block', fontSize: 14, color: 'var(--text-strong)' } }, m[1]), h('span', { style: { fontSize: 13, color: 'var(--text-muted)' } }, m[2]))); }));
    const marca = (txt, on, f, k, extra) => h('button', Object.assign({ key: k, type: 'button', className: 'scob-mc', 'aria-pressed': on ? 'true' : 'false', disabled: !puede, onClick: f, style: puede ? undefined : { cursor: 'default', opacity: on ? 1 : 0.7 } }, extra || {}), txt);
    let cuerpo = null;
    if (b.modo === 'sucursales') cuerpo = h('div', { key: 'su', style: { display: 'flex', flexDirection: 'column', gap: 6 } }, lab('Sucursales'),
      h('div', { role: 'group', 'aria-label': 'Sucursales', style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }, S.sucursales().map((s) => marca(s, b.sucursales.indexOf(s) >= 0, () => set((x) => { x.sucursales = x.sucursales.indexOf(s) >= 0 ? x.sucursales.filter((y) => y !== s) : x.sucursales.concat([s]); }), s))),
      !b.sucursales.length ? nota('Elige al menos una sucursal.', 'n') : null);
    if (b.modo === 'ciudad') { const SZ = Z(), res = puede && st.q.trim() && SZ ? SZ.buscar(st.q, false).filter((c) => !b.ciudades.some((x) => x.cod === c.cod)).slice(0, 6) : [];
      cuerpo = h('div', { key: 'ci', style: { display: 'flex', flexDirection: 'column', gap: 8 } }, lab('Ciudades'),
        b.ciudades.length ? null : nota('Agrega al menos una ciudad.', 'v'),
        b.ciudades.map((x, k) => { const act = activasCiudad(x.cod), pt = partes(x), nom = S.ciudadNombre(x.cod);
          return h('div', { key: x.cod, 'data-cob-ciudad': x.cod, style: { border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } }, h('strong', { style: { fontSize: 14, color: 'var(--text-strong)' } }, nom),
              puede ? h('button', { type: 'button', className: 'scob-lk', 'aria-label': 'Quitar ' + nom, onClick: () => set((y) => { y.ciudades.splice(k, 1); }) }, 'Quitar') : null),
            act.length ? h('div', { role: 'group', 'aria-label': 'Zonas de ' + nom, style: { display: 'flex', flexWrap: 'wrap', gap: 6 } },
              marca('Toda la ciudad', !x.zonas.length, () => set((y) => { y.ciudades[k].zonas = []; }), 't'),
              act.map((z) => marca(z.nombre, x.zonas.indexOf(z.id) >= 0, () => set((y) => { const L = y.ciudades[k].zonas; y.ciudades[k].zonas = L.indexOf(z.id) >= 0 ? L.filter((q) => q !== z.id) : L.concat([z.id]); }), z.id, { 'data-cob-zona': z.id })))
              : nota('Ciudad sin zonas: atiende toda la ciudad.', 'sz'),
            pt.inactivas.length && act.length ? nota('No cuenta' + (pt.inactivas.length === 1 ? ' la zona inactiva ' : 'n las zonas inactivas ') + S.lista(pt.inactivas.map((id) => S.zonaNombre(x.cod, id))) + '.', 'in') : null); }),
        puede ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' } }, h('label', { htmlFor: 'scob-agr', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Agregar ciudad'),
          h('input', { id: 'scob-agr', className: 'scob-in', type: 'search', value: st.q, placeholder: 'Escribe una ciudad (por ejemplo: Ambato)', autoComplete: 'off', 'aria-controls': 'scob-agr-l', onChange: (e) => { st.q = e.target.value; rer(); },
            onKeyDown: (e) => { if (e.key === 'Enter' && res.length) { e.preventDefault(); const c = res[0]; st.q = ''; set((y) => { y.ciudades.push({ cod: c.cod, zonas: [] }); }); } } }),
          res.length ? h('ul', { id: 'scob-agr-l', role: 'listbox', 'aria-label': 'Ciudades que coinciden', style: { listStyle: 'none', margin: 0, padding: 4, border: '1px solid var(--border-subtle)', borderRadius: 8, background: '#fff', display: 'flex', flexDirection: 'column' } },
            res.map((c) => h('li', { key: c.cod, role: 'option', 'aria-selected': 'false' }, h('button', { type: 'button', 'data-cob-agregar': c.cod, onClick: () => { st.q = ''; set((y) => { y.ciudades.push({ cod: c.cod, zonas: [] }); }); }, style: { width: '100%', textAlign: 'left', border: 0, background: 'none', padding: '6px 8px', cursor: 'pointer', font: '400 14px var(--font-brand)', color: 'var(--text-body)' } },
              h('strong', { style: { color: 'var(--text-strong)' } }, c.nombre), ' · ' + c.provNombre + (Z().zonasDe(c.cod) ? ' · con zonas' : ''))))) : st.q.trim() ? nota('Ninguna ciudad coincide.', 'nc') : null) : null); }
    const Btn = NS().Button;
    const guardar = () => { if (!ok) return; st.busy = true; rer(); S.guardar({ nombre: p.nombre, email: p.email, cobertura: b, motivo: st.mot, por: p.por }).then((r) => { st.busy = false;
      if (r && r.ok) { st.b = clon(S.de(p.nombre)); st.mot = ''; st.msg = 'Guardado. Desde ahora recibe solo las inspecciones que cubre.'; if (p.onGuardado) p.onGuardado(r); }
      else { st.b = clon(S.de(p.nombre)); st.err = ((r && r.mensaje) || 'No se pudo guardar') + (r && r.validacion ? '' : '. Se deshizo el cambio.'); } rer(); }); };
    return h('div', { 'data-cobertura': p.nombre, 'data-cob-lectura': puede ? '0' : '1', style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      lab('¿Qué inspecciones puede atender?'), modos, cuerpo,
      avs.length ? h('div', { role: 'note', 'data-cob-avisos': '', style: { display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 12px', borderRadius: 8, background: 'var(--alert-warning-bg,#FDF3DC)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' } }, avs.map((a, i) => h('span', { key: i }, a))) : null,
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, lab('Resumen'), h('p', { 'data-cob-resumen': '', style: { margin: 0, padding: '10px 12px', borderRadius: 8, background: 'var(--surface-subtle,#F5F6F8)', fontSize: 14, color: 'var(--text-strong)' } }, S.resumen(b))),
      puede ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, h('label', { htmlFor: 'scob-mot', style: { fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' } }, 'Motivo', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
        h('textarea', { id: 'scob-mot', rows: 2, value: st.mot, placeholder: 'Por qué cambia la cobertura', onChange: (e) => { st.mot = e.target.value; st.msg = ''; st.err = ''; rer(); }, className: 'scob-in', style: { height: 'auto', padding: '8px 12px', resize: 'vertical' } }),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 } }, Btn ? h(Btn, { variant: 'primary', size: 'sm', disabled: !ok, onClick: guardar }, st.busy ? 'Guardando…' : 'Guardar cobertura') : h('button', { type: 'button', disabled: !ok, onClick: guardar }, 'Guardar cobertura'),
          h('span', { 'data-cob-estado': '', role: st.err ? 'alert' : 'status', style: { fontSize: 13, fontWeight: st.err ? 600 : 400, color: st.err ? 'var(--color-danger,#B3261E)' : 'var(--text-muted)' } }, st.err || st.msg || (cambio ? (motOk ? (valido ? 'Hay cambios sin guardar.' : 'Completa la cobertura para guardar.') : 'Hay cambios: escribe el motivo (mínimo 10 caracteres).') : 'Sin cambios.'))))
        : nota('Solo lectura: la cobertura la edita el Administrador.', 'ro')); }
  S.Editor = Editor;
  W.SiriusCobertura = S;
})();
