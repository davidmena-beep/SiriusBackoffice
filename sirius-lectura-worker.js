/* SIRIUS · sirius-lectura-worker.js · 26/11/2026 · La lectura automática (PP-OCRv4) en segundo plano, fuera de la pantalla del Back-office.
   Recibe { id, url, tipo } y responde { id, lectura } o { id, error }. Carga onnxruntime-web 1.30.0 y sirius-lectura.js (misma carpeta). */
importScripts('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.wasm.min.js', 'sirius-lectura.js?v=102');
self.onmessage = async (e) => { const d = e.data || {};
  if (d.base) { self.SiriusLectura.base(d.base); return; }
  try { const lectura = await self.SiriusLectura.leer(d.url, d.tipo); self.postMessage({ id: d.id, lectura }); }
  catch (err) { self.postMessage({ id: d.id, error: String(err && err.message || err).slice(0, 200) }); } };
