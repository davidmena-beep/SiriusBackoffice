// SIRIUS · Formularios con la conexión simulada: eliminar formulario, visitas en curso con su versión y conteos con la base (v1.0 · provisional · etapa P-6f-0b · 18/10/2026)
// Decisiones: DEC-217 (eliminar formulario; eliminar versión con visitas en curso, amplía DEC-208) y D-6 (conteos de Formularios con la base).
// Forma del contrato que usa (SIRIUS_CONEXION): casos[].formularios (nombres de plantilla, con o sin « vN»), casos[].estado (final si su responsable en SIRIUS_FLUJO es «ninguno»),
// casos[].visitasBase[].plantilla = { nombre, version } (la versión con que empezó la visita; null si no empezó o si es anterior al registro) e informes[id][] con plantillaClave y plantillaVersion.
// Se suma a SIRIUS_CX_AUTO (datos-cx-autoinspeccion.js): las mismas escenas simuladas (cxSimBoot), que se limpian al cambiar de escena. Ningún dato sale de un caso de ejemplo (DEC-200).
(function () {
  const A = window.SIRIUS_CX_AUTO; if (!A) return;
  const ESC = ['formeliminar', 'formeliminarbloq', 'versionvisitacurso', 'cxformconteos'];
  ESC.forEach((k) => { A.cxEscenas[k] = ['50007', 'interno', 'ejecutivo']; });
  const esc0 = () => { try { return new URLSearchParams(location.search).get('escena') || ''; } catch (e) { return ''; } };
  const ADM = { nombre: 'Andrea Salazar', email: 'andrea.salazar@asur.ec', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
  const ver = (n, estado, desde, extra) => Object.assign({ n: n, estado: estado, desde: desde, vigenteDesde: estado === 'Borrador' ? '' : desde, mod: desde, by: 'Andrea Salazar', motivo: estado === 'Retirada' ? 'Plantilla de prueba retirada' : 'Plantilla de prueba', informes: 0, log: [] }, extra || {});
  const form = (id, name, versions) => ({ id: id, name: name, tipo: 'Vehículos', alcance: 'Vehículos livianos', tipoObjeto: 'Vehículo', versions: versions });
  // Formularios que la base trae en cada escena (además de Vehículos livianos y Motos).
  const FORMS = {
    formeliminar: [form('fpr1', 'Inspección de bodegas (prueba)', [ver(1, 'Retirada', '2026-09-01'), ver(2, 'Retirada', '2026-09-20')])],
    formeliminarbloq: [form('fpa', 'Prueba A con versión vigente', [ver(1, 'Vigente', '2026-10-01')]), form('fpb', 'Prueba B con informes', [ver(1, 'Retirada', '2026-09-01'), ver(2, 'Retirada', '2026-09-15')]),
      form('fpc', 'Prueba C en uso', [ver(1, 'Retirada', '2026-09-01')]), form('fpd', 'Prueba D en una regla', [ver(1, 'Retirada', '2026-09-01')])],
    versionvisitacurso: [form('fvis', 'Prueba de visitas en curso', [ver(1, 'Retirada', '2026-08-01'), ver(2, 'Retirada', '2026-09-01'), ver(3, 'Vigente', '2026-10-01')])],
  };
  const baseF = A.formularios;
  A.formularios = function (E) { const r = baseF(E), e = esc0(); if (ESC.indexOf(e) < 0 || !r) return r;
    const f1 = r.formularios.find((x) => x.id === 'f1'), v1 = f1 && f1.versions[0], cuerpo = v1 ? { steps: v1.steps, secs: v1.secs } : { steps: [], secs: [] };
    (FORMS[e] || []).map((f0) => JSON.parse(JSON.stringify(f0))).forEach((f) => { f.versions.forEach((v) => { Object.assign(v, JSON.parse(JSON.stringify(cuerpo))); }); r.formularios.push(f); const vg = f.versions.find((v) => v.estado === 'Vigente'); r.vigentes[f.id] = vg ? vg.n : null; });
    // cxformconteos: Vehículos livianos con la versión anterior retirada en la base.
    if (e === 'cxformconteos' && f1) { const n = v1.n; f1.versions.unshift(Object.assign(JSON.parse(JSON.stringify(v1)), { n: n - 1, estado: 'Retirada', desde: '2026-08-01', vigenteDesde: '2026-08-01', motivo: 'Reemplazada por la versión ' + n })); }
    return r; };
  const caso = (X, id, estado, formularios, extra) => { const c = Object.assign(JSON.parse(JSON.stringify(X.casos[0])), { id: id, orden: 'EMI-2026-1191' + id.slice(-2), estado: estado, subestado: '', formularios: formularios, bien: 'Placa PDR' + id.slice(-4) }, extra || {});
    X.casos.push(c); X.eventos[id] = []; X.evidencias[id] = []; X.controles[id] = []; X.informes[id] = X.informes[id] || []; X.calificaciones[id] = []; return c; };
  const inf = (X, id, n, plantillaClave, version) => { const I = X.informes[id] = X.informes[id] || []; for (let i = 0; i < n; i++) I.push({ riesgo: id + '-V1', estado: 'Completo', plantilla: plantillaClave + ' · Presencial', plantillaClave: plantillaClave + ' · Presencial', plantillaVersion: version, respuestas: {} }); };
  const vis = (estado, plantilla, extra) => Object.assign({ n: 1, modalidad: 'Presencial', estado: estado, inicio: '2026-10-18T09:00', fin: '', agendadoEn: '2026-10-16T10:00', origen: 'Coordinación', inspector: 'Marco Tapia', enlace: null, enlaces: [], plantilla: plantilla }, extra || {});
  const baseS = A.cxSim.bind(A);
  A.cxSim = function (escena) { if (ESC.indexOf(escena) < 0) return baseS(escena); const X = baseS(escena); if (!X) return null; X.usuario = JSON.parse(JSON.stringify(ADM));
    if (escena === 'formeliminarbloq') {
      // b) 3 informes vinculados (2 de la v1 y 1 de la v2); c) 2 casos activos (y uno «Emitida», que no cuenta); d) la regla de completado 2 la nombra.
      inf(X, '50007', 2, 'Prueba B con informes', 1); inf(X, '50007', 1, 'Prueba B con informes', 2);
      caso(X, '50061', 'En coordinación', ['Prueba C en uso v1']); caso(X, '50062', 'Agendado', ['Prueba C en uso']); caso(X, '50063', 'Emitida', ['Prueba C en uso v1']);
      // La regla 2 del completado publicado nombra la plantilla (en la configuración viva de SiriusCompletado y en SIRIUS_COMPLETADO).
      const C = window.SIRIUS_COMPLETADO; if (C && C.reglas && C.reglas[1]) C.reglas[1].plantilla = 'Prueba D en una regla';
      const SCo = window.SiriusCompletado; if (SCo && SCo.snap && SCo.restore) { const sn = SCo.snap(); if (sn.reglas && sn.reglas[1]) { sn.reglas[1].plantilla = 'Prueba D en una regla'; SCo.restore(sn); } } }
    if (escena === 'versionvisitacurso') {
      // v1: 1 visita presencial en curso que empezó con la versión 1. Otra visita en curso (autoinspección del cliente) sin versión registrada.
      caso(X, '50064', 'En curso', ['Prueba de visitas en curso'], { visitasBase: [vis('En curso', { nombre: 'Prueba de visitas en curso', version: 1 })] });
      caso(X, '50065', 'En curso', ['Prueba de visitas en curso'], { visitasBase: [vis('Por agendar', null, { modalidad: 'Autoinspección', inspector: '', inicio: '', origen: 'Enlace', enlace: { tipo: 'Autoinspección', estado: 'En curso', vence: '2026-10-21T09:00', url: 'https://sirius.ec/ai/Hq7Lm2Pz' } })] }); }
    if (escena === 'cxformconteos') {
      // Vehículos livianos (vigente vN y retirada vN-1): informes y visitas en curso de la base, distintos de los de ejemplo.
      const F = A.formularios(window.SIRIUS_EJEMPLO || {}), f1 = F.formularios.find((x) => x.id === 'f1'), nv = f1 ? Math.max.apply(null, f1.versions.map((v) => v.n)) : 4, va = nv - 1;
      inf(X, '50007', 4, 'Vehículos livianos', nv); inf(X, '50007', 2, 'Vehículos livianos', va);
      caso(X, '50071', 'En curso', ['Vehículos livianos v' + nv], { visitasBase: [vis('En curso', { nombre: 'Vehículos livianos · Presencial', version: nv })] });
      caso(X, '50072', 'En curso', ['Vehículos livianos'], { visitasBase: [vis('En curso', { nombre: 'Vehículos livianos', version: nv })] });
      caso(X, '50073', 'Agendado', ['Vehículos livianos'], { visitasBase: [vis('Por agendar', null, { modalidad: 'Autoinspección', inspector: '', inicio: '', origen: 'Enlace', enlace: { tipo: 'Autoinspección', estado: 'En curso', vence: '2026-10-21T09:00', url: 'https://sirius.ec/ai/Rt4Kp8Wd' }, plantilla: { nombre: 'Vehículos livianos · Autoinspección', version: nv } })] });
      caso(X, '50074', 'En curso', ['Vehículos livianos'], { visitasBase: [vis('En curso', { nombre: 'Vehículos livianos', version: va })] });
      caso(X, '50075', 'Emitida', ['Vehículos livianos'], { visitasBase: [vis('Terminada', { nombre: 'Vehículos livianos', version: va }, { fin: '2026-10-10T11:00' })] }); }
    return X; };
  A.cxFormularios = { escenas: ESC, formularios: FORMS };
})();
