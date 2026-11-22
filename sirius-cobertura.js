// SIRIUS · Cobertura del inspector (v2.0 · etapa R-5b · DEC-266 · 21/11/2026; v1.1 en R-3a · DEC-262; v1.0 en G-2b · DEC-223).
// R-5b: la cobertura de un inspector son sus filas de la Red de inspectores, y solo ellas: [{ id, nivel ('todas' | 'sucursal' | 'ciudad' | 'zona'), sucursal, ciudad (COD_CANTON),
//   zona (id), desde, hasta, vigente, origen, motivo }]. Sin filas vigentes no tiene cobertura: ya no hay respaldo con el modelo viejo de la ficha ({ modo, sucursales, ciudades }),
//   ni zonas heredadas, ni ediciones de la sesión (la ficha es de solo lectura desde R-4). Las filas se leen con SiriusRedFuente.filas (único lector de la Red).
// cubre() decide con las filas vigentes en el orden de la base: «todas» → ciudad completa → zona (activa; si la ciudad ya no tiene zonas activas cuenta como la ciudad completa;
//   sin zona conocida, «parcial» solo si se pide con { parcial: true }) → sucursal. resumen() y corto() enumeran todas las filas vigentes (cobertura mixta).
// Uso: SiriusCobertura.cubre(inspector, { sucursal, ciudad, zonaId }, { parcial, hoy }) → { nivel: 'zona' | 'ciudad' | 'sucursal' | 'todas' | 'parcial' | null, por, faltaLugar?, sinCobertura? };
//      resumen(inspector), corto(inspector), sinCobertura(inspector), filasDe(inspector); inspector = nombre, identificación u objeto (con coberturaFilas o con nombre).
(function () {
  'use strict';
  const W = window; if (W.SiriusCobertura) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), ON = [];
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  const S = { hist: [] };
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  const Z = () => W.SiriusZonas || null, UB = () => W.SiriusUsuariosBase || null, X = () => W.SIRIUS_CONEXION || null;
  const arr = (x) => (Array.isArray(x) ? x.filter((v) => v != null && v !== '').map(String) : []);
  S.lista = (a) => { a = a.slice(); if (a.length <= 1) return a.join(''); const u = a.pop(); return a.join(', ') + ' y ' + u; };
  S.sucursales = () => { const E = W.SIRIUS_EJEMPLO || {}, L = ((E.catalogos || {}).sucursales || []).map((x) => (typeof x === 'string' ? x : x && (x.nombre || x.n))).filter(Boolean); return L.length ? L : ['Quito', 'Loja', 'Cuenca', 'Machala', 'Santo Domingo', 'Riobamba', 'Ambato', 'Ibarra', 'Manta', 'El Coca', 'Guayaquil']; };
  S.ciudadNombre = (cod) => { const c = Z() && Z().ciudad(cod); return c ? c.nombre : String(cod); };
  // Zonas publicadas de una ciudad (todas, con su estado) y las activas.
  const zonasCiudad = (cod) => { const z = Z() && Z().publicadasDe ? Z().publicadasDe(cod) : null; return z ? z.zonas : []; };
  const activasCiudad = (cod) => zonasCiudad(cod).filter((x) => x.estado !== 'Inactiva');
  S.zonasCiudad = (cod) => zonasCiudad(cod); S.zonasActivas = (cod) => activasCiudad(cod); // U-3a: para la ficha única (mapa y lista de zonas)
  S.zonaNombre = (cod, id) => { const x = zonasCiudad(cod).find((y) => y.id === id); return x ? x.nombre : id; };
  const nombreDe = (ins) => (typeof ins === 'string' ? ins : ins ? String(ins.inspector || ins.nombre || ins.n || '') : '');
  // ---------- R-3a · DEC-262: filas de cobertura (Red de inspectores) ----------
  S.NIVELES = [['todas', 'Todas'], ['sucursal', 'Sucursal'], ['ciudad', 'Ciudad completa'], ['zona', 'Zona']];
  S.nivelTxt = (n) => { const x = S.NIVELES.find((y) => y[0] === n); return x ? x[1] : String(n || ''); };
  S.hoy = () => { const C = X(), r = C && C.activo === true && C.red && C.red.hoy; if (r) return String(r).slice(0, 10); const SC = W.SiriusCompania, iso = SC && SC.ahoraIso ? SC.ahoraIso() : null; if (iso) return String(iso).slice(0, 10);
    const E = W.SIRIUS_EJEMPLO, d = E && typeof E.ahora === 'function' ? E.ahora() : new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  // Vigente: lo que diga la base (vigente) o, si no viene, desde ≤ hoy ≤ hasta (fechas AAAA-MM-DD).
  S.filaVigente = (f, hoy) => { if (!f) return false; if (typeof f.vigente === 'boolean') return f.vigente; hoy = hoy || S.hoy(); const d = String(f.desde || '').slice(0, 10), a = String(f.hasta || '').slice(0, 10); return (!d || d <= hoy) && (!a || hoy <= a); };
  // R-5b · DEC-266: las filas del inspector son las de la Red y solo ellas: las que trae el objeto (coberturaFilas) o, por su nombre o identificación, las del lector único
  // (SiriusRedFuente.filas: sin la conexión, la Red de la sesión o SIRIUS_RED; con la conexión, SIRIUS_CONEXION.red o coberturaFilas de la base). Sin filas = sin cobertura.
  S.filasDe = (ins) => { if (ins && typeof ins === 'object' && Array.isArray(ins.coberturaFilas)) return ins.coberturaFilas; const n = nombreDe(ins), RF = W.SiriusRedFuente; return n && RF && RF.filas ? RF.filas(n) : []; };
  S.vigentes = (F, hoy) => (Array.isArray(F) ? F : []).filter((f) => f && S.filaVigente(f, hoy));
  S.ambitoTxt = (f) => { f = f || {}; if (f.nivel === 'todas') return 'Todas las inspecciones'; if (f.nivel === 'sucursal') return String(f.sucursal || '—');
    const nom = f.ciudad ? S.ciudadNombre(f.ciudad) : '—'; return f.nivel === 'zona' ? nom + ' · Zona ' + S.zonaNombre(f.ciudad, String(f.zona || '')) : nom; };
  S.cubreFilas = (F, lugar, op) => { lugar = lugar || {}; op = op || {}; const v = S.vigentes(F, op.hoy), ciu = lugar.ciudad ? String(lugar.ciudad) : '', nom = ciu ? S.ciudadNombre(ciu) : '';
    if (!v.length) return { nivel: null, por: 'Sin cobertura vigente: no recibe inspecciones', sinCobertura: true };
    if (v.some((f) => f.nivel === 'todas')) return { nivel: 'todas', por: 'Atiende todas las inspecciones' };
    if (ciu && v.some((f) => f.nivel === 'ciudad' && String(f.ciudad) === ciu)) return { nivel: 'ciudad', por: 'Atiende toda ' + nom };
    let faltaZona = false; const zs = ciu ? v.filter((f) => f.nivel === 'zona' && String(f.ciudad) === ciu) : [];
    if (zs.length) { const act = activasCiudad(ciu); if (!act.length) return { nivel: 'ciudad', por: 'Atiende toda ' + nom + ' (la ciudad ya no tiene zonas activas)' };
      const validas = zs.map((f) => String(f.zona || '')).filter((id) => act.some((z) => z.id === id));
      if (lugar.zonaId) { if (validas.indexOf(String(lugar.zonaId)) >= 0) return { nivel: 'zona', por: 'Atiende la zona ' + S.zonaNombre(ciu, String(lugar.zonaId)) }; }
      else if (validas.length) { if (op.parcial) return { nivel: 'parcial', por: 'Atiende ' + (validas.length === 1 ? 'la zona ' : 'las zonas ') + S.lista(validas.map((id) => S.zonaNombre(ciu, id))) + ' de ' + nom + '; falta la zona del lugar' }; faltaZona = true; } }
    if (lugar.sucursal && v.some((f) => f.nivel === 'sucursal' && f.sucursal === lugar.sucursal)) return { nivel: 'sucursal', por: 'Atiende la sucursal ' + lugar.sucursal };
    if (faltaZona) return { nivel: null, por: 'Falta la zona del lugar para saber si cubre', faltaLugar: true };
    if (!ciu && v.some((f) => f.nivel === 'ciudad' || f.nivel === 'zona')) return { nivel: null, por: 'Falta el lugar de la inspección para saber si cubre', faltaLugar: true };
    if (!ciu && !lugar.sucursal) return { nivel: null, por: 'Falta el lugar de la inspección para saber si cubre', faltaLugar: true };
    return { nivel: null, por: ciu ? 'No atiende ' + (zs.length && lugar.zonaId ? 'la zona ' + S.zonaNombre(ciu, String(lugar.zonaId)) + ' de ' + nom : nom) + (lugar.sucursal ? ' ni la sucursal ' + lugar.sucursal : '') : 'No atiende la sucursal ' + lugar.sucursal }; };
  const unirFrases = (p) => { if (p.length <= 1) return p.join(''); const u = p[p.length - 1], r = p.slice(0, -1); return r.join(', ') + (r[r.length - 1].indexOf(',') >= 0 ? ', y ' : ' y ') + u; };
  S.resumenFilas = (F, hoy) => { const v = S.vigentes(F, hoy); if (!v.length) return 'Sin cobertura vigente: no recibe inspecciones.'; if (v.some((f) => f.nivel === 'todas')) return 'Atiende todas las inspecciones, en cualquier ciudad.';
    const suc = [], ciu = [], zon = {}, out = []; v.forEach((f) => { if (f.nivel === 'sucursal' && suc.indexOf(f.sucursal) < 0) suc.push(f.sucursal); else if (f.nivel === 'ciudad') { const n = S.ciudadNombre(f.ciudad); if (ciu.indexOf(n) < 0) ciu.push(n); } else if (f.nivel === 'zona') { const k = String(f.ciudad); (zon[k] = zon[k] || []).push(S.zonaNombre(k, String(f.zona || ''))); } });
    if (suc.length) out.push('los casos de ' + (suc.length === 1 ? 'la sucursal ' : 'las sucursales ') + S.lista(suc) + ', estén donde estén');
    Object.keys(zon).forEach((k) => out.push((zon[k].length === 1 ? 'la zona ' : 'las zonas ') + S.lista(zon[k]) + ' de ' + S.ciudadNombre(k)));
    if (ciu.length) out.push('cualquier lugar de ' + S.lista(ciu));
    return 'Atiende ' + unirFrases(out) + '.'; };
  S.cortoFilas = (F, hoy) => { const v = S.vigentes(F, hoy); if (!v.length) return 'Sin cobertura'; if (v.some((f) => f.nivel === 'todas')) return 'Todas';
    const zon = {}, out = []; v.forEach((f) => { if (f.nivel === 'zona') { const k = String(f.ciudad); (zon[k] = zon[k] || []).push(S.zonaNombre(k, String(f.zona || ''))); } });
    v.forEach((f) => { if (f.nivel === 'sucursal') out.push('Sucursal ' + f.sucursal); else if (f.nivel === 'ciudad') out.push(S.ciudadNombre(f.ciudad) + (v.length === 1 ? ' (toda la ciudad)' : '')); else if (f.nivel === 'zona' && zon[String(f.ciudad)]) { out.push(S.ciudadNombre(f.ciudad) + ' · ' + (zon[String(f.ciudad)].length === 1 ? 'Zona ' : 'Zonas ') + S.lista(zon[String(f.ciudad)])); delete zon[String(f.ciudad)]; } });
    return out.filter((x, i, a) => a.indexOf(x) === i).join(' · '); };
  // ¿Cubre este lugar? lugar = { sucursal, ciudad (COD_CANTON), zonaId }. op = { parcial, hoy }. Solo con las filas de la Red.
  S.cubre = (ins, lugar, op) => S.cubreFilas(S.filasDe(ins), lugar, op);
  S.resumen = (ins) => S.resumenFilas(S.filasDe(ins));
  S.corto = (ins) => S.cortoFilas(S.filasDe(ins));
  S.sinCobertura = (ins) => !S.vigentes(S.filasDe(ins)).length;
  // ---------- Zonas (G-2a2 · DEC-235): a quién afecta eliminar una zona y cómo sale de las coberturas al publicar ----------
  // Inspectores: los de la Red (lector único) y, con la conexión, los de la base.
  S.inspectores = () => { const out = [], add = (n) => { if (n && out.indexOf(n) < 0) out.push(n); }, RF = W.SiriusRedFuente; if (RF) RF.lista().forEach(add);
    const B = UB(); if (B && B.activo && B.activo()) B.lista().forEach((u) => { if (B.esInspector(u.roles)) add(u.nombre); });
    const C = X(); if (C && C.activo === true && Array.isArray(C.inspectores)) C.inspectores.forEach((i) => add(i && i.nombre)); return out; };
  // Quienes tienen una fila de esa zona (vigente o futura: eliminar la zona también la afecta).
  S.conZona = (cod, id) => S.inspectores().filter((n) => S.filasDe(n).some((f) => f && f.nivel === 'zona' && String(f.ciudad) === String(cod) && String(f.zona) === String(id) && (S.filaVigente(f) || String(f.desde || '') > S.hoy())));
  // Al publicar la eliminación (sin la conexión): las filas de esas zonas salen de la Red de la sesión. Con la conexión las actualiza la base.
  const redSesion = () => { if (X() && X().activo === true) return null; const SR = W.SiriusRed, r = SR && SR.demo ? SR.demo() : W.SIRIUS_RED; return r && Array.isArray(r.inspectores) ? r : null; };
  S.quitarZonas = (cod, ids) => { const r = redSesion(); let n = 0; if (!r) return 0; r.inspectores.forEach((i) => { const a = (i.cobertura || []).length; i.cobertura = (i.cobertura || []).filter((f) => !(f.nivel === 'zona' && String(f.ciudad) === String(cod) && ids.indexOf(String(f.zona)) >= 0)); n += a - i.cobertura.length; });
    if (n) { const SR = W.SiriusRed; if (SR && SR.avisar) SR.avisar(); avisar(); } return n; };
  // Escenas (las llaman Usuarios y Ciudades y zonas al abrir la escena). R-5b: ya no siembran la cobertura de la ficha; zonaseliminar pone filas de zona en la Red de la sesión.
  S.fijarFilas = (n, F) => { const r = redSesion(), i = r && r.inspectores.find((x) => x.nombre === n); if (!i) return false; i.cobertura = F.map((f, k) => Object.assign({ id: 'rc-e' + k + '-' + String(n).replace(/\W/g, '').slice(0, 6), sucursal: '', ciudad: '', zona: '', desde: '2026-10-01', hasta: '', vigente: true, origen: 'Red de inspectores', motivo: 'Escena de demostración' }, f)); avisar(); return true; };
  S.escena = (e) => {
    if (e === 'coberturazonainactiva') { const SZ = Z(); if (SZ && SZ.tocar) { const cz = SZ.tocar('1701'), x = cz.zonas.find((y) => y.id === 'z1701-5'); if (x && x.estado !== 'Inactiva') { x.estado = 'Inactiva'; SZ.registrar('1701', 'Desactivó ' + x.nombre, 'est:' + x.id); SZ.publicar('1701', 'Escena: zona fuera de servicio por obras en la vía.', 'Escena de demostración'); } } }
    if (e === 'zonaseliminar') { S.fijarFilas('Mauricio Endara', [{ nivel: 'zona', ciudad: '1701', zona: 'z1701-1' }, { nivel: 'zona', ciudad: '1701', zona: 'z1701-2' }]); S.fijarFilas('Diana Cárdenas', [{ nivel: 'zona', ciudad: '1701', zona: 'z1701-2' }, { nivel: 'zona', ciudad: '1701', zona: 'z1701-3' }]); }
    avisar(); };
  S.reset = () => { S.hist = []; avisar(); };
  W.SiriusCobertura = S;
})();
