// SIRIUS · Cómo se llena cada campo (prototipo · etapa C2-7 · DEC-186; etapa C2-7b: catálogo de origen y dependencia). Lógica sobre SIRIUS_LLENADO (datos-llenado.js): atributos de cada campo de la
// plantilla «Vehículos livianos» («Cómo se llena», «Dónde se captura», «Obligatorio para») que usan el diseñador de formularios, el informe del
// back-office, la app del inspector y el PDF. aplicar(T) deja `llenado` en cada campo de la plantilla y, si declara «Catálogo de origen», toma la lista de los catálogos
// maestros (reemplaza el vínculo VL-F1 que estaba programado en datos-ejemplo.js). opcionesCampo filtra por el valor del campo padre («Depende de»).
(function () {
  'use strict';
  const W = window; if (W.SiriusLlenado && W.SiriusLlenado.__v >= 2) return;
  const D = () => W.SIRIUS_LLENADO || {}, O = () => D().opciones || {};
  const NOM = () => Object.fromEntries((O().como || []).map(([k, l]) => [k, l])), OBL = () => Object.fromEntries((O().obligatorio || []).map(([k, l]) => [k, l]));
  function de(k) { return (D().campos || {})[k] || null; }
  function umbral(cfg) { return (cfg && cfg.umbral) || O().umbral || 90; }
  function nombreComo(k) { return NOM()[k] || k || '—'; }
  function nombreOblig(k) { return OBL()[k] || '—'; }
  // Texto corto: «Lectura de foto o documento · VIN grabado o Matrícula · 90 %», «Automático del sistema · Fecha y hora de la visita»…
  function texto(cfg) { if (!cfg) return 'Sin definir'; const b = nombreComo(cfg.como);
    if (cfg.como === 'auto') return b + (cfg.fuente ? ' · ' + cfg.fuente : '');
    if (cfg.como === 'lectura') return b + ' · ' + (cfg.pasos || []).join(' o ') + ' · ' + umbral(cfg) + ' %';
    if (cfg.como === 'captura') return b + ' · ' + (cfg.captura || 'Texto') + (cfg.catalogo ? ' · catálogo ' + nombreCatalogo(cfg.catalogo) : '');
    return b + ' · para confirmar' + (cfg.catalogo ? ' · catálogo ' + nombreCatalogo(cfg.catalogo) : ''); }
  // Etapa C2-7b · catálogos de origen (Administración › Catálogos). La lista sale de los catálogos maestros o de SIRIUS_EJEMPLO.catalogos.
  const CM = () => W.SIRIUS_CATALOGOS_MAESTROS || {}, K = () => ((W.SIRIUS_EJEMPLO || {}).catalogos) || {};
  const nz = (t) => String(t == null ? '' : t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');
  function catalogos() { return (O().catalogos || []).slice(); }
  function nombreCatalogo(id) { const c = (O().catalogos || []).find((x) => x.id === id); return c ? c.nombre : (id || '—'); }
  const modTxt = (o) => [o.modelo].concat((o.versiones || []).map((v) => o.modelo + ' ' + v));
  // lista(id, padre): opciones del catálogo; con padre, solo las del valor elegido en el campo padre (marca → modelos, modelo → versiones).
  function lista(id, padre) { const M = CM().marcas || [], tiene = padre != null && padre !== '';
    switch (id) {
      case 'marcas': return M.map((m) => m.marca);
      case 'modelos': return [].concat(...M.filter((m) => !tiene || nz(m.marca) === nz(padre)).map((m) => [].concat(...m.modelos.map(modTxt))));
      case 'versiones': { const out = []; M.forEach((m) => m.modelos.forEach((o) => { if (!tiene || modTxt(o).some((t) => nz(t) === nz(padre))) (o.versiones || []).forEach((v) => { if (!out.includes(v)) out.push(v); }); })); return out; }
      case 'colores': return (CM().colores || []).slice();
      case 'licencias': return (CM().licencias || []).map((l) => l.codigo);
      case 'wmi': return (CM().wmi || []).map((x) => x.wmi);
      case 'provincias': return Object.keys((((c) => { const m = c.provinciaRegion; if (m && !Array.isArray(m)) return m; const o = {}; (Array.isArray(m) ? m : (c.prov || [])).forEach(r => { if (r && r.provincia) o[r.provincia] = r.region; }); return o; }))(K()));
      default: { const A = { coberturas: 'coberturas', extras: 'extras', piezas: 'piezas', danos: 'danos', gravedad: 'gravedad', noaseg: 'motivosNoAsegurable', verif: 'verificacion', sucursales: 'sucursales' }[id]; return A && Array.isArray(K()[A]) ? K()[A].map((x) => typeof x === 'string' ? x : (x && (x.nombre || x.n)) || '').filter(Boolean) : []; } } }
  // Opciones de un campo según sus atributos: catálogo de origen y, si depende de otro campo, el valor de ese campo (valores: { clave: valor }).
  // Sin valor en el padre, o con un padre fuera del catálogo, ofrece la lista completa (mismo comportamiento que el ajuste VL-F1).
  function opcionesCampo(fd, valores) { const c = fd && (fd.llenado || de(fd.k)); if (!c || !c.catalogo) return ((fd && fd.opts) || []).slice();
    const pv = c.dependeDe ? (valores || {})[c.dependeDe] : null, f = pv ? lista(c.catalogo, pv) : []; return f.length ? f : lista(c.catalogo); }
  // ¿El valor está en el catálogo? Fuera del catálogo queda «Por confirmar» (regla de Catálogos maestros: se guarda tal cual y se avisa).
  function enCatalogo(fd, v, valores) { const c = fd && (fd.llenado || de(fd.k)); if (!c || !c.catalogo || v == null || v === '') return true; return opcionesCampo(fd, valores).some((t) => nz(t) === nz(v)); }
  // Campos que dependen de k (se limpian cuando cambia k).
  function dependientes(k) { const C = D().campos || {}; return Object.keys(C).filter((x) => C[x].dependeDe === k); }
  function aplicar(T) { if (!T || !T.campos) return T;
    Object.keys(T.campos).forEach((sid) => (T.campos[sid] || []).forEach((fd) => { const c = de(fd.k); if (!c) return; fd.llenado = c;
      if (c.catalogo) { const l = lista(c.catalogo); if (l.length) fd.opts = l; fd.opcionesDe = 'Catálogo ' + nombreCatalogo(c.catalogo) + (c.dependeDe ? ' (filtrado por ' + c.dependeDe + ')' : ''); delete fd.optsPor; } }));
    T.versionLlenado = D().versionPlantilla || null; return T; }
  // En la app: los que la plantilla marca en Campo o Ambos (menos los automáticos, que llena el sistema).
  function enCampo(fd) { const c = fd && (fd.llenado || de(fd.k)); if (!c) return null; return (c.donde === 'Campo' || c.donde === 'Ambos') && c.como !== 'auto'; }
  // ¿Obligatorio para este momento? momento: 'terminar' (terminar la visita) o 'completar' (completar el informe: también lo de terminar).
  function obligatorio(fd, momento) { const c = fd && (fd.llenado || de(fd.k)); if (!c) return null; return momento === 'terminar' ? c.obligatorio === 'terminar' : c.obligatorio === 'terminar' || c.obligatorio === 'completar'; }
  function aplicarEjemplo() { const E = W.SIRIUS_EJEMPLO; if (E && E.plantillas && E.plantillas['Vehículos livianos v1']) aplicar(E.plantillas['Vehículos livianos v1']); }
  aplicarEjemplo();
  W.SiriusLlenado = { __v: 2, de, umbral, texto, nombreComo, nombreOblig, aplicar, aplicarEjemplo, enCampo, obligatorio, opciones: O, catalogos, nombreCatalogo, lista, opcionesCampo, enCatalogo, dependientes };
})();
