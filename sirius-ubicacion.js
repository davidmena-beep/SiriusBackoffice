// SIRIUS · Ubicar direcciones (v1.0 · etapa G-2a2 · DEC-235 · 18/10/2026). Lo usan Ciudades y zonas («Probar una dirección») y, después, Coordinación y el portal.
// SiriusUbicacion.buscar(texto, codCiudad) → promesa de [{ texto, ciudad (COD_CANTON), punto: [lat, lng] | null }] (punto null: la dirección existe pero no se pudo ubicar).
// Si existe window.SIRIUS_CONEXION.buscarDireccion(texto, codCiudad), la usa (la asesoría la conectará a un servicio real de mapas); si no, busca en el diccionario
// de direcciones de prueba (las de la maqueta G-1b). Con menos de 3 letras devuelve []. Primero van las de la ciudad pedida.
(function () {
  'use strict';
  const W = window; if (W.SiriusUbicacion) return;
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const U = {};
  U.DIRECCIONES = [
    { texto: 'Av. Amazonas N36-152 y Naciones Unidas', ciudad: '1701', punto: [-0.1765, -78.4845] },
    { texto: 'Av. Mariscal Sucre S12-45 y Ajaví', ciudad: '1701', punto: [-0.2620, -78.5340] },
    { texto: 'Conocoto, calle García Moreno y Montúfar', ciudad: '1701', punto: [-0.2920, -78.4790] },
    { texto: 'Interoceánica km 12, Cumbayá', ciudad: '1701', punto: [-0.2005, -78.4310] },
    { texto: 'Mitad del Mundo, San Antonio de Pichincha', ciudad: '1701', punto: [-0.0022, -78.4558] },
    { texto: 'Av. Francisco de Orellana, Kennedy Norte', ciudad: '0901', punto: [-2.1700, -79.8950] },
    { texto: 'Av. Cevallos y Montalvo', ciudad: '1801', punto: [-1.2420, -78.6280] },
    { texto: 'Calle sin nombre, barrio La Esperanza', ciudad: '1701', punto: null },
    { texto: 'Av. de los Shyris y Naciones Unidas, La Carolina', ciudad: '1701', punto: [-0.1770, -78.4800] },
    { texto: 'Av. Eloy Alfaro y Av. de la Prensa, El Inca', ciudad: '1701', punto: [-0.1480, -78.4790] },
    { texto: 'Quitumbe, Av. Cóndor Ñan', ciudad: '1701', punto: [-0.2950, -78.5500] },
    { texto: 'Carcelén, Av. Diego de Vásquez', ciudad: '1701', punto: [-0.0950, -78.4740] },
    { texto: 'Calderón, Av. Geovanny Calles', ciudad: '1701', punto: [-0.0990, -78.4220] },
    { texto: 'Tumbaco, Av. Interoceánica y Juan Montalvo', ciudad: '1701', punto: [-0.2130, -78.4010] },
    { texto: 'Malecón 2000, Av. Simón Bolívar', ciudad: '0901', punto: [-2.1940, -79.8800] },
    { texto: 'Parque Calderón, calle Simón Bolívar', ciudad: '0101', punto: [-2.8970, -79.0045] }
  ];
  const nomCiudad = (cod) => { const Z = W.SiriusZonas, c = Z && Z.ciudad ? Z.ciudad(cod) : null; return c ? c.nombre : ''; };
  // Búsqueda en el diccionario (sin promesa): la frase completa o todas sus palabras de 3 letras o más.
  U.buscarLocal = (texto, cod) => { const n = norm(texto); if (n.length < 3) return [];
    const pal = n.split(/\s+/).filter((w) => w.length > 2);
    return U.DIRECCIONES.filter((d) => { const t = norm(d.texto + ' ' + nomCiudad(d.ciudad)); return t.includes(n) || (pal.length && pal.every((w) => t.includes(w))); })
      .sort((a, b) => (b.ciudad === cod ? 1 : 0) - (a.ciudad === cod ? 1 : 0)).slice(0, 6).map((d) => ({ texto: d.texto, ciudad: d.ciudad, punto: d.punto ? d.punto.slice() : null })); };
  U.conServicio = () => !!(W.SIRIUS_CONEXION && typeof W.SIRIUS_CONEXION.buscarDireccion === 'function');
  U.buscar = (texto, cod) => { const X = W.SIRIUS_CONEXION;
    if (X && typeof X.buscarDireccion === 'function') { let pr; try { pr = Promise.resolve(X.buscarDireccion(texto, cod)); } catch (e) { pr = Promise.resolve([]); }
      return pr.then((r) => (Array.isArray(r) ? r : []).filter((x) => x && x.texto).map((x) => ({ texto: String(x.texto), ciudad: String(x.ciudad || cod || ''), punto: Array.isArray(x.punto) && x.punto.length === 2 ? [+x.punto[0], +x.punto[1]] : null })), () => []); }
    return Promise.resolve(U.buscarLocal(texto, cod)); };
  W.SiriusUbicacion = U;
})();
