// SIRIUS · Ciudades y zonas (v1.1 · etapa G-2a · DEC-221 y DEC-234; G-2a2 · DEC-235: eliminar zonas y contador de ids · 18/10/2026).
// Ciudades: los cantones del INEC (window.SIRIUS_GEOGRAFIA, datos-geografia.js, solo lectura; más adelante se conectan al catálogo CANTON de gobernanza).
// Zonas: puntos de atención que define Aseguradora del Sur, solo en las ciudades que las tienen (window.SIRIUS_ZONAS, datos-zonas.js).
// Regla de asignación (toda la ciudad queda cubierta):
//   1. Dentro de un área dibujada, la zona de esa área; si el punto cae en varias áreas, la del punto más cercano.
//   2. Fuera de las áreas, la zona del punto más cercano entre las zonas sin área (si todas tienen área, entre todas).
//   3. El radio de la ciudad es de referencia: una dirección más lejos se asigna igual y se marca «lejos del centro».
//   4. «Por confirmar» solo cuando la dirección no se pudo ubicar (punto null).
// Uso (Coordinación, portal y ofertas): SiriusZonas.zonaDe(codCiudad, [lat, lng] | null)
//   → { tipo: 'area' | 'punto' | 'sinZonas' | 'sinUbicar', zona, distanciaKm, lejos, varias, radio }.
// Edición (solo el Administrador, con motivo): la pantalla Administración › Ciudades y zonas cambia la copia de trabajo de una ciudad
// (tocar + registrar), y publicar(cod, motivo) la publica: con la conexión, SiriusPublicar con la clave SIRIUS_ZONAS (el objeto completo con la
// versión siguiente); con { ok: false } la publicación vuelve atrás (los cambios siguen sin publicar) y se devuelve el mensaje. Sin la conexión queda en la sesión.
// Cada publicación deja su historial (quién, cuándo, motivo y cambios). El estado vive aquí (un solo módulo: los componentes vuelven a ejecutar los datos).
(function () {
  'use strict';
  const W = window; if (W.SiriusZonas) return;
  const clon = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x)), ON = [];
  const avisar = () => ON.slice().forEach((f) => { try { f(); } catch (e) { /* nada */ } });
  const S = {};
  S.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  S.COLORES = ['#00AEEF', '#0033A1', '#1E7B3C', '#C2410C', '#7C3AED', '#B91C1C', '#0F766E'];
  S.MAX_ZONAS = 8;
  // ---------- texto y geometría ----------
  S.norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  S.titulo = (s) => String(s || '').toLowerCase().replace(/(^|\s|\()(\p{L})/gu, (m, a, b) => a + b.toUpperCase()).replace(/\b(De|Del|La|Las|Los|Y)\b/g, (w) => w.toLowerCase());
  S.km = (a, b) => { const R = 6371, t = (x) => x * Math.PI / 180, dl = t(b[0] - a[0]), dn = t(b[1] - a[1]); const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a[0])) * Math.cos(t(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  S.fmtKm = (v) => (Math.round(v * 10) / 10).toLocaleString('es-EC', { maximumFractionDigits: 1 }) + ' km';
  S.enPoligono = (pt, poly) => { let d = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][1], yi = poly[i][0], xj = poly[j][1], yj = poly[j][0]; if (((yi > pt[0]) !== (yj > pt[0])) && (pt[1] < (xj - xi) * (pt[0] - yi) / (yj - yi) + xi)) d = !d; } return d; };
  const orient = (a, b, c) => Math.sign((b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]));
  const cruzan = (p1, p2, p3, p4) => orient(p1, p2, p3) * orient(p1, p2, p4) < 0 && orient(p3, p4, p1) * orient(p3, p4, p2) < 0;
  S.seCruza = (poly) => { const n = poly.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue; if (cruzan(poly[i], poly[(i + 1) % n], poly[j], poly[(j + 1) % n])) return true; } return false; };
  S.seSuperponen = (a, b) => { if (a.some((p) => S.enPoligono(p, b)) || b.some((p) => S.enPoligono(p, a))) return true;
    for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) if (cruzan(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true; return false; };
  S.tieneArea = (x) => !!(x && Array.isArray(x.area) && x.area.length >= 3);
  S.activa = (x) => !!x && x.estado !== 'Inactiva';
  // Avisos de un área (se aceptan): el punto fuera de su área y la superposición con otra zona activa.
  S.avisosArea = (cz, x) => { if (!S.tieneArea(x)) return []; const av = [];
    if (!S.enPoligono(x.punto, x.area)) av.push('El punto de la zona está fuera de su área');
    (cz.zonas || []).forEach((y) => { if (y !== x && S.activa(y) && S.tieneArea(y) && S.seSuperponen(x.area, y.area)) av.push('Se superpone con ' + y.nombre + ': donde se crucen, gana la más cercana'); });
    return av; };
  // ---------- ciudades (INEC) ----------
  let CIU = null;
  S.geo = () => W.SIRIUS_GEOGRAFIA || { provincias: [], ciudades: [], centros: {} };
  S.ciudades = () => { if (CIU) return CIU; const G = S.geo(), PV = {}; (G.provincias || []).forEach((p) => { PV[p.cod] = S.titulo(p.nombre); });
    CIU = (G.ciudades || []).filter((c) => c.estado === 'ACTIVO' && c.prov !== '90').map((c) => ({ cod: c.cod, nombre: c.buscador || S.titulo(c.nombre), oficial: c.nombre, oficialTxt: S.titulo(c.nombre), prov: c.prov, provNombre: PV[c.prov] || '' }));
    return CIU; };
  S.enEstudio = () => (S.geo().ciudades || []).filter((c) => c.estado !== 'ACTIVO' || c.prov === '90').length;
  S.ciudad = (cod) => S.ciudades().find((c) => c.cod === cod) || null;
  S.centro = (cod) => { const c = (S.geo().centros || {})[cod]; if (c) return c; const z = S.zonasDe(cod); return z && z.zonas[0] ? z.zonas[0].punto : null; };
  // Búsqueda por nombre de uso común, nombre oficial o provincia. Sin texto y con «Con zonas», solo las ciudades con zonas.
  S.buscar = (q, soloConZonas) => { const n = S.norm(q); let arr = S.ciudades().filter((c) => !n || S.norm(c.nombre).includes(n) || S.norm(c.oficial).includes(n) || S.norm(c.provNombre).includes(n));
    if (soloConZonas && !n) arr = arr.filter((c) => S.zonasDe(c.cod));
    return arr.slice().sort((a, b) => (S.zonasDe(b.cod) ? 1 : 0) - (S.zonasDe(a.cod) ? 1 : 0) || a.nombre.localeCompare(b.nombre, 'es')); };
  // ---------- zonas: publicado y copia de trabajo ----------
  let PUB = null, TRAB = null, CAMB = {}, HIST = [], VER_FECHA = 'datos iniciales';
  const fuente = () => W.SIRIUS_ZONAS || { version: '1', ciudades: {} };
  // Etapa G-2a2 · DEC-235: cada ciudad lleva el contador del siguiente id (siguienteId); los ids de las zonas eliminadas no se reutilizan.
  const sigDe = (cod, cz) => { let mx = 0; (cz.zonas || []).forEach((x) => { const m = String(x.id).match(/-(\d+)$/); if (m) mx = Math.max(mx, +m[1]); }); return Math.max(Number(cz.siguienteId) || 0, mx + 1); };
  const iniciar = () => { if (PUB) return; PUB = clon(fuente()); if (!PUB.ciudades) PUB.ciudades = {}; Object.keys(PUB.ciudades).forEach((c) => { PUB.ciudades[c].siguienteId = sigDe(c, PUB.ciudades[c]); }); TRAB = clon(PUB);
    HIST = [{ version: Number(PUB.version) || 1, fecha: VER_FECHA, por: 'Asesoría', ciudad: '', motivo: 'Zonas iniciales de Quito, Guayaquil y Cuenca · ' + (PUB.vigencia || 'demostración') + '.', cambios: [], estado: 'Publicada' }]; };
  S.version = () => { iniciar(); return Number(PUB.version) || 1; };
  S.fechaVersion = () => { iniciar(); return VER_FECHA; };
  S.reglas = () => { iniciar(); return PUB.reglas || {}; };
  S.publicado = () => { iniciar(); return clon(PUB); };
  S.trabajo = () => { iniciar(); return TRAB; };
  S.zonasDe = (cod) => { iniciar(); const z = TRAB.ciudades[cod]; return z && Array.isArray(z.zonas) && z.zonas.length ? z : null; };
  S.publicadasDe = (cod) => { iniciar(); const z = PUB.ciudades[cod]; return z && Array.isArray(z.zonas) && z.zonas.length ? z : null; };
  S.color = (cod, id) => { const z = S.zonasDe(cod) || S.publicadasDe(cod); const i = z ? z.zonas.findIndex((x) => x.id === id) : -1; return S.COLORES[(i < 0 ? 0 : i) % S.COLORES.length]; };
  S.activas = (cod) => { const z = S.zonasDe(cod); return z ? z.zonas.filter(S.activa) : []; };
  // Prepara la ciudad para editar (crea la ciudad con radio 10 km si aún no tiene zonas). Devuelve su objeto de trabajo.
  S.tocar = (cod) => { iniciar(); if (!TRAB.ciudades[cod]) TRAB.ciudades[cod] = { radio: 10, zonas: [] }; return TRAB.ciudades[cod]; };
  // Cambio sin publicar (txt para «Ver cambios»; clave para no repetir el mismo cambio, p. ej. mover el mismo punto dos veces).
  S.registrar = (cod, txt, clave) => { const L = CAMB[cod] = CAMB[cod] || []; if (clave) { const k = L.findIndex((x) => x.k === clave); if (k >= 0) L.splice(k, 1); } L.push({ t: txt, k: clave || null }); avisar(); };
  S.quitarCambio = (cod, clave) => { CAMB[cod] = (CAMB[cod] || []).filter((x) => x.k !== clave); avisar(); };
  S.cambios = (cod) => (CAMB[cod] || []).slice();
  S.nCambios = (cod) => (CAMB[cod] || []).length;
  S.hayCambios = () => Object.keys(CAMB).some((c) => CAMB[c].length);
  S.descartar = (cod) => { iniciar(); if (PUB.ciudades[cod]) TRAB.ciudades[cod] = clon(PUB.ciudades[cod]); else delete TRAB.ciudades[cod]; CAMB[cod] = []; avisar(); };
  S.nuevoId = (cod) => { const z = S.tocar(cod), n = sigDe(cod, z); z.siguienteId = n + 1; return 'z' + cod + '-' + n; }; // usa y avanza el contador de la ciudad
  S.siguienteId = (cod) => { iniciar(); const z = TRAB.ciudades[cod]; return z ? sigDe(cod, z) : 1; };
  // Eliminar (DEC-235): sale de la copia de trabajo; al publicar, sale de SIRIUS_ZONAS. Devuelve una función para deshacer (mientras no se publique).
  S.eliminar = (cod, id, afectados) => { const z = S.tocar(cod), pos = z.zonas.findIndex((x) => x.id === id); if (pos < 0) return null; const x = z.zonas[pos], camb = clon(CAMB[cod] || []), pz = S.publicadasDe(cod), publicada = !!(pz && pz.zonas.some((y) => y.id === id));
    z.zonas.splice(pos, 1); CAMB[cod] = (CAMB[cod] || []).filter((c) => !c.k || !/:/.test(c.k) || c.k.split(':')[1] !== id);
    if (publicada) S.registrar(cod, 'Eliminó la zona ' + x.nombre + (afectados && afectados.length ? ' (se quita de la cobertura de ' + S.lista(afectados) + ')' : ''), 'elim:' + id); else avisar();
    return () => { const z2 = S.tocar(cod); if (!z2.zonas.some((y) => y.id === id)) z2.zonas.splice(Math.min(pos, z2.zonas.length), 0, x); CAMB[cod] = camb; avisar(); }; };
  S.lista = (a) => { a = a.slice(); if (a.length <= 1) return a.join(''); const u = a.pop(); return a.join(', ') + ' y ' + u; };
  S.nombreRepetido = (cod, nombre, salvoId) => { const z = S.zonasDe(cod), v = S.norm(nombre); return !!(z && v && z.zonas.some((y) => y.id !== salvoId && S.norm(y.nombre) === v)); };
  // ---------- asignación ----------
  S.zonaDe = (cod, pt) => { iniciar(); const z = PUB_O_TRAB(cod);
    if (!pt) return { tipo: 'sinUbicar', zona: null, distanciaKm: null, lejos: false };
    if (!z) return { tipo: 'sinZonas', zona: null, distanciaKm: null, lejos: false };
    const act = z.zonas.filter(S.activa); if (!act.length) return { tipo: 'sinZonas', zona: null, distanciaKm: null, lejos: false };
    const dist = (x) => S.km(pt, x.punto), cerca = (arr) => arr.slice().sort((a, b) => dist(a) - dist(b))[0];
    const enAreas = act.filter((x) => S.tieneArea(x) && S.enPoligono(pt, x.area));
    if (enAreas.length) { const x = cerca(enAreas); return { tipo: 'area', zona: x, distanciaKm: dist(x), lejos: false, varias: enAreas.length, radio: z.radio || null }; }
    const sinArea = act.filter((x) => !S.tieneArea(x)), pool = sinArea.length ? sinArea : act, x = cerca(pool), d = dist(x);
    return { tipo: 'punto', zona: x, distanciaKm: d, lejos: !!(z.radio && d > z.radio), radio: z.radio || null }; };
  // zonaDe usa lo que se ve en la pantalla (la copia de trabajo): en la sesión, lo publicado y lo de trabajo coinciden salvo mientras se edita.
  // Para los demás módulos (Coordinación, portal y ofertas) zonaDePublicada usa solo lo publicado.
  let usarPub = false; const PUB_O_TRAB = (cod) => (usarPub ? S.publicadasDe(cod) : S.zonasDe(cod));
  S.zonaDePublicada = (cod, pt) => { usarPub = true; try { return S.zonaDe(cod, pt); } finally { usarPub = false; } };
  S.textoZona = (r) => r.tipo === 'area' || r.tipo === 'punto' ? 'Zona ' + r.zona.nombre : r.tipo === 'sinUbicar' ? 'Zona por confirmar' : 'Ciudad sin zonas';
  // Direcciones de prueba (en producción las ubica un servicio de mapas; aquí, un diccionario). p = null: no se pudo ubicar.
  S.DIRECCIONES = [
    { t: 'Av. Amazonas N36-152 y Naciones Unidas', c: '1701', p: [-0.1765, -78.4845] },
    { t: 'Av. Mariscal Sucre S12-45 y Ajaví', c: '1701', p: [-0.2620, -78.5340] },
    { t: 'Conocoto, calle García Moreno y Montúfar', c: '1701', p: [-0.2920, -78.4790] },
    { t: 'Interoceánica km 12, Cumbayá', c: '1701', p: [-0.2005, -78.4310] },
    { t: 'Mitad del Mundo, San Antonio de Pichincha', c: '1701', p: [-0.0022, -78.4558] },
    { t: 'Av. Francisco de Orellana, Kennedy Norte', c: '0901', p: [-2.1700, -79.8950] },
    { t: 'Av. Cevallos y Montalvo', c: '1801', p: [-1.2420, -78.6280] },
    { t: 'Calle sin nombre, barrio La Esperanza', c: '1701', p: null }
  ];
  // ---------- publicación ----------
  const z2 = (n) => String(n).padStart(2, '0');
  const ahora = () => { const SC = W.SiriusCompania; let iso = SC && SC.ahoraIso ? SC.ahoraIso() : null;
    if (!iso) { const E = W.SIRIUS_EJEMPLO || {}, d = E.ahora ? E.ahora() : new Date(); iso = d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate()) + 'T' + z2(d.getHours()) + ':' + z2(d.getMinutes()); }
    const m = String(iso).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); return m ? m[3] + '/' + m[2] + '/' + m[1] + ' ' + m[4] + ':' + m[5] : String(iso); };
  S.historial = (cod) => { iniciar(); return HIST.filter((h) => !cod || !h.ciudad || h.ciudad === cod).map(clon); };
  // Publica la ciudad (motivo de 10 caracteres o más). Devuelve una promesa { ok, mensaje?, version?, local? }.
  S.publicar = (cod, motivo, por) => { iniciar(); const mot = String(motivo || '').trim(), L = S.cambios(cod);
    if (!L.length) return Promise.resolve({ ok: false, validacion: true, mensaje: 'No hay cambios para publicar.' });
    if (mot.length < 10) return Promise.resolve({ ok: false, validacion: true, mensaje: 'Escribe el motivo (mínimo 10 caracteres).' });
    const antes = { pub: clon(PUB), camb: clon(CAMB[cod]), fecha: VER_FECHA }, version = S.version() + 1, ciudad = S.ciudad(cod);
    const nuevo = clon(PUB); nuevo.version = String(version); if (TRAB.ciudades[cod] && (TRAB.ciudades[cod].zonas.length || PUB.ciudades[cod])) nuevo.ciudades[cod] = clon(TRAB.ciudades[cod]); else delete nuevo.ciudades[cod]; /* G-2a2: la ciudad que se queda sin zonas conserva su contador de ids */
    const quitadas = PUB.ciudades[cod] ? PUB.ciudades[cod].zonas.map((x) => x.id).filter((id) => !(nuevo.ciudades[cod] && nuevo.ciudades[cod].zonas.some((y) => y.id === id))) : [];
    const sacarDeCoberturas = () => { const C = W.SiriusCobertura; if (C && C.quitarZonas && quitadas.length) C.quitarZonas(cod, quitadas); };
    const fecha = ahora(), reg = { version, fecha, por: por || '', ciudad: cod, ciudadNombre: ciudad ? ciudad.nombre : cod, motivo: mot, cambios: L.map((x) => x.t), estado: 'Publicada en la sesión' };
    PUB = nuevo; VER_FECHA = fecha; CAMB[cod] = []; HIST.unshift(reg); if (W.SIRIUS_ZONAS) { W.SIRIUS_ZONAS.version = nuevo.version; W.SIRIUS_ZONAS.ciudades = clon(nuevo.ciudades); } avisar();
    const SP = W.SiriusPublicar; if (!SP || !SP.activo || !SP.activo()) { sacarDeCoberturas(); return Promise.resolve({ ok: true, local: true, version }); }
    return SP.publicar({ clave: 'SIRIUS_ZONAS', version, datos: clon(nuevo), motivo: mot, pantalla: 'Administración › Ciudades y zonas · ' + reg.ciudadNombre,
      aviso: 'Publicado: las zonas de ' + reg.ciudadNombre + ' se usan desde ya en Coordinación, las ofertas y el portal.',
      revertir: () => { PUB = antes.pub; VER_FECHA = antes.fecha; CAMB[cod] = antes.camb; const i = HIST.indexOf(reg); if (i >= 0) HIST.splice(i, 1); if (W.SIRIUS_ZONAS) { W.SIRIUS_ZONAS.version = PUB.version; W.SIRIUS_ZONAS.ciudades = clon(PUB.ciudades); } avisar(); },
      alPublicar: (info) => { sacarDeCoberturas(); reg.estado = 'Publicada en la base'; if (info && info.fecha) reg.fechaBase = info.fecha; avisar(); } })
      .then((r) => (r && r.ok === false ? r : Object.assign({}, r, { ok: true, version }))); };
  S.reset = () => { PUB = null; TRAB = null; CAMB = {}; HIST = []; VER_FECHA = 'datos iniciales'; avisar(); };
  W.SiriusZonas = S;
})();
