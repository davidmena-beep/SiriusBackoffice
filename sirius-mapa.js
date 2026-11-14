// SIRIUS · Mapa reutilizable (v1.0 · etapa G-2a · DEC-221 y DEC-234 · 18/10/2026). Lo usan Ciudades y zonas y, más adelante, Coordinación y el portal.
// Basado en Leaflet 1.9.4 local (leaflet.js y leaflet.css del proyecto: no se carga de internet).
// Mapa base: OpenStreetMap; si sus teselas fallan, Esri (World Street Map). Donde no cargan (el artifact las bloquea), el mapa funciona igual sobre un
// fondo neutro y en una esquina aparece la nota «Mapa base no disponible en esta vista».
// Uso: const m = SiriusMapa.crear(elemento, { centro: [lat, lng], zoom }) → { map, capa (L.layerGroup), vista(centro, zoom), invalidar(), destruir(), sinBase() }.
//   SiriusMapa.pin(color, texto, grande) e SiriusMapa.pinCaso() devuelven íconos (L.divIcon) para L.marker.
//   SiriusMapa.dibujarZonas(capa, ciudadZonas, { radios, color(zona) }) dibuja las áreas (relleno suave) y los radios de referencia (punteados) de las zonas activas.
(function () {
  'use strict';
  const W = window; if (W.SiriusMapa) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const OSM = { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', o: { maxZoom: 19, attribution: '© OpenStreetMap' } };
  const ESRI = { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', o: { maxZoom: 19, attribution: 'Mapa base © Esri · datos de Esri, HERE, Garmin y OpenStreetMap' } };
  const NOTA = 'Mapa base no disponible en esta vista';
  const M = { BASES: [OSM, ESRI], NOTA };
  let estilo = false;
  const ponerEstilo = () => { if (estilo || !W.document) return; estilo = true; const s = document.createElement('style'); s.setAttribute('data-sirius-mapa', '1');
    s.textContent = '.smapa{position:relative;z-index:0;isolation:isolate;background:#E6ECF1;font-family:var(--font-brand)}' +
      '.smapa .leaflet-container{background:#E6ECF1;font-family:var(--font-brand)}' +
      '.smapa.dibujando,.smapa.dibujando .leaflet-grab,.smapa.dibujando .leaflet-interactive,.smapa.dibujando .leaflet-marker-icon{cursor:crosshair!important}' +
      '.smapa-et{display:inline-block;background:#fff;border-radius:6px;padding:2px 6px;font:700 12px/1.3 var(--font-brand),sans-serif;color:var(--text-strong,#011E41);box-shadow:0 1px 3px rgba(0,0,0,.25);white-space:nowrap}' +
      '.smapa-et.grande{font-size:13.5px;box-shadow:0 0 0 2px var(--color-brand,#00AEEF)}' +
      '.smapa-nota.arriba{top:8px;bottom:auto}.smapa-nota{position:absolute;right:8px;bottom:22px;z-index:900;pointer-events:none;background:rgba(255,255,255,.92);border-radius:6px;padding:4px 8px;font-size:12px;color:var(--text-muted,#6B6B6B);box-shadow:0 1px 3px rgba(0,0,0,.15)}';
    document.head.appendChild(s); };
  M.pin = (color, txt, grande) => W.L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0],
    html: '<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)"><span class="smapa-et' + (grande ? ' grande' : '') + '">' + esc(txt) + '</span><svg width="' + (grande ? 28 : 22) + '" height="' + (grande ? 38 : 30) + '" viewBox="0 0 22 30" aria-hidden="true"><path d="M11 29s9-10.5 9-17A9 9 0 1 0 2 12c0 6.5 9 17 9 17Z" fill="' + esc(color) + '" stroke="#fff" stroke-width="2"/><circle cx="11" cy="12" r="3.5" fill="#fff"/></svg></div>' });
  M.pinCaso = () => W.L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0], html: '<svg width="30" height="40" viewBox="0 0 30 40" style="transform:translate(-15px,-40px)" aria-hidden="true"><path d="M15 39s12-14 12-23A12 12 0 1 0 3 16c0 9 12 23 12 23Z" fill="#011E41" stroke="#fff" stroke-width="2.5"/><circle cx="15" cy="16" r="5" fill="#00AEEF"/></svg>' });
  M.dibujarZonas = (capa, cz, o) => { o = o || {}; const L = W.L, act = (cz && cz.zonas || []).filter((x) => x.estado !== 'Inactiva'), col = o.color || (() => '#00AEEF');
    act.forEach((x) => { if (x.area && x.area.length >= 3) L.polygon(x.area, { color: col(x), weight: 2.5, fillColor: col(x), fillOpacity: 0.16, interactive: false }).addTo(capa); });
    if (o.radios && cz && cz.radio) act.forEach((x) => L.circle(x.punto, { radius: cz.radio * 1000, color: col(x), weight: 1.5, dashArray: '6 6', fillColor: col(x), fillOpacity: 0.04, interactive: false }).addTo(capa)); };
  M.crear = (el, o) => { o = o || {}; const L = W.L; if (!L || !el) return null; ponerEstilo(); el.classList.add('smapa');
    const map = L.map(el, { zoomControl: true, attributionControl: true }).setView(o.centro || [-1.5, -78.5], o.zoom || 11);
    const nota = document.createElement('div'); nota.className = 'smapa-nota' + (o.notaArriba ? ' arriba' : ''); /* G-2a2: la nota puede ir arriba a la derecha */ nota.textContent = NOTA; nota.hidden = true; nota.setAttribute('role', 'note'); el.appendChild(nota);
    let k = 0, fallas = 0, cargadas = 0, base = null, sin = false, reloj = null;
    const marcarSin = () => { if (sin || cargadas) return; sin = true; nota.hidden = false; if (base) { map.removeLayer(base); base = null; } };
    const poner = () => { if (base) map.removeLayer(base); fallas = 0; base = L.tileLayer(M.BASES[k].url, M.BASES[k].o).addTo(map); base.bringToBack();
      base.on('tileload', () => { cargadas++; if (sin) { sin = false; nota.hidden = true; } });
      base.on('tileerror', () => { fallas++; if (fallas === 4 && !cargadas) { if (k < M.BASES.length - 1) { k++; poner(); } else marcarSin(); } }); };
    poner(); reloj = setTimeout(marcarSin, o.espera || 6000);
    const capa = L.layerGroup().addTo(map);
    const inst = { map, capa, L, nota,
      vista: (c, z) => { if (c) map.setView(c, z || map.getZoom()); },
      invalidar: () => { try { map.invalidateSize(); } catch (e) { /* nada */ } },
      sinBase: () => sin,
      destruir: () => { clearTimeout(reloj); try { map.remove(); } catch (e) { /* nada */ } if (nota.parentNode) nota.parentNode.removeChild(nota); el.classList.remove('smapa'); el._siriusMapa = null; } }; el._siriusMapa = inst; /* para pruebas y para quien lo necesite desde el elemento */ return inst; };
  W.SiriusMapa = M;
})();
