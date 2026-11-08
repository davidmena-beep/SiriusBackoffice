// SIRIUS · Equipo y maquinaria (etapa 8a · DEC-141, DEC-142 y DEC-143). Lee SIRIUS_EQUIPOS (datos-equipo-maquinaria.js) y arma, una sola vez:
//   · la plantilla «Equipo y maquinaria v1» en SIRIUS_EJEMPLO.plantillas (secciones, campos y los 21 pasos de foto; Formularios y el informe leen de aquí),
//   · el caso de ejemplo 20204 (fila del caso con un riesgo por equipo, visita, detalle e historial) y SIRIUS_EJEMPLO.equipos (un informe por equipo),
//   · las fotos de cada equipo en SIRIUS_EJEMPLO.evidencias (pasos exigidos en Presencial).
// Cálculos (window.SiriusEquipos): valor real con la depreciación de valores.depreciacion, relación suma asegurada / VRN con sus alertas,
// validación del número de serie (identificacion.pin), sugerencias de VRN (catálogo de referencias y motor de contexto externo simulado),
// hallazgos y reglas de envío. Nada se guarda aquí: los cambios de la sesión los guarda cada pantalla.
(function () {
  if (window.SiriusEquipos) return;
  var D = function () { return window.SIRIUS_EQUIPOS || {}; }, E = function () { return window.SIRIUS_EJEMPLO || {}; };
  var PL = 'Equipo y maquinaria v1', RAMO = 'Equipo y maquinaria';
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var fecha = function (iso) { var m = /^(\d{4})-(\d\d)-(\d\d)/.exec(iso || ''); return m ? m[3] + '/' + m[2] + '/' + m[1].slice(2) : (iso || ''); };
  var SE = { PLANTILLA: PL, RAMO: RAMO };

  // ---------- Cálculos ----------
  SE.anioActual = function () { var e = E(); return e.ahora ? e.ahora().getFullYear() : 2026; };
  SE.pinValido = function (s) { var I = (D().identificacion || {}).pin || {}; return new RegExp(I.patron || '^[A-Z0-9]{17}$').test(String(s || '')); };
  // Depreciación por antigüedad (años desde la puesta en servicio) + ajuste por horas sobre lo esperado; nunca menos del piso.
  SE.depreciacion = function (anios, horometro) {
    var V = (D().valores || {}).depreciacion || {}, T = V.porAntiguedad || [], base = 0;
    for (var i = 0; i < T.length; i++) { if (T[i][0] == null || anios <= T[i][0]) { base = T[i][1]; break; } }
    var esperadas = (V.horasEsperadasPorAnio || 1500) * Math.max(anios, 0), exceso = (Number(horometro) || 0) - esperadas, ajuste = exceso > 0 ? Math.min(15, 5 * Math.floor(exceso / 2000)) : 0;
    var piso = V.piso == null ? 30 : V.piso, total = Math.min(base + ajuste, 100 - piso);
    return { base: base, ajuste: ajuste, total: total, piso: piso, esperadas: esperadas, exceso: exceso };
  };
  // Valores de un equipo. o: { vrn, fuente, evidencia } de la sesión (si el informe está en borrador).
  SE.valores = function (eq, o) {
    o = o || {}; var sa = Number(eq.sumaAsegurada) || 0, vrn = o.vrn !== undefined ? o.vrn : eq.vrn, ev = o.evidencia !== undefined ? o.evidencia : (eq.vrnEvidencia !== undefined ? eq.vrnEvidencia : eq.vrnFuente || '');
    var anios = Math.max(0, SE.anioActual() - (Number(eq.anioServicio) || SE.anioActual())), hAnio = anios ? Math.round((Number(eq.horometro) || 0) / anios) : null;
    var dp = SE.depreciacion(anios, eq.horometro), real = vrn ? Math.max(Math.round(vrn * (1 - dp.total / 100)), Math.round(vrn * dp.piso / 100)) : null;
    var rel = vrn ? sa / vrn * 100 : null, relR = rel == null ? null : Math.round(rel), alerta = null, A = (D().valores || {}).alertas || [];
    if (rel != null && rel < 90) { var a = A.find(function (x) { return x.id === 'infraseguro'; }) || { texto: 'Infraseguro: asegurado al {pct} % del VRN' }; alerta = { id: 'infraseguro', tono: 'warning', texto: a.texto.replace('{pct}', relR) }; }
    if (rel != null && rel > 110) { var b = A.find(function (x) { return x.id === 'sobreseguro'; }) || { texto: 'Sobreseguro: {pct} % sobre el VRN' }; alerta = { id: 'sobreseguro', tono: 'warning', texto: b.texto.replace('{pct}', Math.round(rel - 100)) }; }
    var impl = (eq.implementos || []).reduce(function (s, x) { return s + (Number(x[3]) || 0); }, 0);
    return { sa: sa, vrn: vrn == null ? null : Number(vrn), fuente: o.fuente !== undefined ? o.fuente : SE.fuenteDe(eq.vrnFuente), evidencia: ev, porConfirmar: !vrn || !String(ev || '').trim(), anios: anios, hAnio: hAnio, dep: dp, real: real, rel: rel, relR: relR, alerta: alerta, implementos: impl };
  };
  SE.fuenteDe = function (txt) { var t = String(txt || ''), F = ['Cotización', 'Lista de precios', 'Factura de equipo nuevo', 'Catálogo de referencias']; for (var i = 0; i < F.length; i++) if (t.indexOf(F[i]) === 0 || (i === 0 && /^Cotizaci/.test(t))) return F[i]; return t ? 'Cotización' : ''; };
  // Sugerencia del catálogo de referencias (tipo, marca y modelo; si no hay del modelo, la del tipo y la marca).
  SE.referencia = function (eq, refs) { var R = refs || ((D().valores || {}).referencias || []);
    return R.find(function (r) { return r.tipo === eq.tipo && r.marca === eq.marca && r.modelo === eq.modelo; }) || R.find(function (r) { return r.tipo === eq.tipo && r.marca === eq.marca; }) || null; };
  // Motor de contexto externo (simulado): solo con la simulación activa; siempre lo confirma el inspector con evidencia.
  SE.sugerenciaIA = function (eq, sim) { if (!sim) return null; var r = SE.referencia(eq); if (!r) return null;
    return { vrn: Math.round(r.vrn * 1.02 / 500) * 500, fuente: 'Motor de contexto externo (simulado) · precio publicado del distribuidor para ' + r.marca + ' ' + r.modelo + ' (' + r.capacidad + ')', fecha: '2026-10-14' }; };
  // Hallazgos del informe (SIRIUS_EQUIPOS.hallazgos) y reglas de envío a calificación (calificacion.reglasEnvio).
  SE.hallazgos = function (eq, val) { var H = D().hallazgos || [], out = [], hoy = E().ahora ? E().ahora() : new Date(2026, 9, 18), iso = hoy.getFullYear() + '-' + pad(hoy.getMonth() + 1) + '-' + pad(hoy.getDate());
    var add = function (id, rep) { var h = H.find(function (x) { return x.id === id; }); if (!h) return; var t = h.texto; Object.keys(rep || {}).forEach(function (k) { t = t.replace('{' + k + '}', rep[k]); }); out.push({ id: id, texto: t, severidad: h.severidad }); };
    var doc = eq.documentacion || {}, man = eq.mantenimiento || {}, seg = eq.seguridad || {}, uso = eq.uso || {}, comp = eq.componentes || {};
    if (val.alerta && val.alerta.id === 'infraseguro') add('infraseguro', { pct: val.relR });
    if (doc.matricula === 'No' || doc.matricula === 'En trámite') add('sinMatricula');
    if (val.hAnio != null && (val.hAnio > 3000 || (val.hAnio < 100 && uso.uso))) add('horometro', { hAnio: val.hAnio.toLocaleString('es-EC') });
    var hace12 = (hoy.getFullYear() - 1) + '-' + pad(hoy.getMonth() + 1) + '-' + pad(hoy.getDate());
    if (man.bitacora === 'No' && (!man.ultimo || man.ultimo < hace12)) add('sinMantenimiento');
    if (seg.gps === 'No' && val.sa > 80000) add('sinGps');
    if (doc.licencia === 'No' || (doc.vigenciaLicencia && doc.vigenciaLicencia < iso)) add('licencia');
    if (seg.extintor === 'No' || (seg.vigenciaExtintor && seg.vigenciaExtintor < iso)) add('extintor');
    if (comp['Sistema hidráulico'] === 'Malo') add('hidraulico');
    if (uso.pernocta === 'Vía pública' || uso.vigilancia === 'Ninguna') add('pernocta');
    if (val.anios > 15) add('antiguedad', { anios: val.anios });
    if (val.alerta && val.alerta.id === 'sobreseguro') add('sobreseguro', { pct: Math.round(val.rel - 100) });
    return out; };
  SE.reglas = function (eq, val) { var out = [], doc = eq.documentacion || {};
    if (val.sa > 150000) out.push({ regla: 'Suma asegurada mayor a 150.000', pct: window.SIRIUS_COMPANIA ? window.SIRIUS_COMPANIA.formatoMonto(val.sa, { decimales: 0 }) : String(val.sa), nivel2: true });
    if (val.alerta && val.alerta.id === 'infraseguro') out.push({ regla: 'Infraseguro mayor a 10 %', pct: val.relR + ' % del VRN' });
    if (doc.matricula === 'No' || doc.matricula === 'En trámite') out.push({ regla: 'Sin matrícula o en trámite', pct: doc.matricula });
    if (val.anios > 15) out.push({ regla: 'Antigüedad mayor a 15 años', pct: val.anios + ' años' });
    if (val.hAnio != null && val.hAnio > 3000) out.push({ regla: 'Horómetro inconsistente', pct: val.hAnio + ' h/año' });
    return out; };
  // Composición del ramo (tipo de objeto de SIRIUS_EJEMPLO.ramos).
  SE.composicionDe = function (ramo) { var r = (E().ramos || []).find(function (x) { return x.nombre === ramo; }); return r ? r.tipoObjeto : ''; };
  SE.equipo = function (rid) { return (E().equipos || []).find(function (x) { return x.riesgo === rid; }) || null; };
  SE.delCaso = function (id) { return (E().equipos || []).filter(function (x) { return x.caso === id; }); };

  // ---------- Plantilla «Equipo y maquinaria v1» ----------
  function plantilla() {
    var Q = D(), C = Q.categorias || [], MM = Q.marcasModelos || [], SINO = ['Sí', 'No'];
    var F = function (k, l, t, o) { return Object.assign({ k: k, l: l, t: t }, o || {}); };
    var tipos = [].concat.apply([], C.map(function (c) { return c.tipos; })), marcas = MM.map(function (m) { return m.marca; }), modelos = [].concat.apply([], MM.map(function (m) { return m.modelos; }));
    var campos = {
      eqi: [F('em_categoria', 'Categoría', 'Catálogo', { req: 'PV', opts: C.map(function (c) { return c.nombre; }), help: 'Catálogos maestros › Categorías y tipos de equipo.' }),
        F('em_tipo', 'Tipo', 'Catálogo', { req: 'PV', opts: tipos, help: 'Lista según la categoría elegida.' }),
        F('em_tipo_descripcion', 'Descripción del equipo', 'Texto', { req: 'PV', vis: { k: 'em_tipo', v: 'Otro (describir)' }, minLen: 5, help: 'Obligatoria si el tipo es «Otro (describir)»: mínimo 5 caracteres. El PDF muestra esta descripción y el caso queda en Conflictos como «Valor fuera de catálogo».' }),
        F('em_marca', 'Marca', 'Catálogo', { req: 'PV', opts: marcas, src: ['Extracción automática'], help: 'Catálogos maestros › Marcas y modelos de equipo.' }),
        F('em_modelo', 'Modelo', 'Catálogo', { req: 'PV', opts: modelos, src: ['Extracción automática'], help: 'Catálogo según la marca elegida.' }),
        F('em_color', 'Color', 'Texto'), F('em_anio_fabricacion', 'Año de fabricación', 'Número', { req: 'PV', src: ['Extracción automática'], help: 'Placa del fabricante.' }),
        F('em_anio_servicio', 'Año de puesta en servicio', 'Número', { req: 'PV', help: (Q.identificacion || {}).anios || '' }), F('em_pais', 'País de origen', 'Texto'),
        F('em_serie_pin', 'Número de serie (PIN)', 'Texto', { req: 'PV', src: ['Extracción automática'], help: (((Q.identificacion || {}).pin || {}).norma || '') + '. Si no tiene 17 caracteres: aviso «Serie sin formato PIN» (no bloquea).', valida: 'pin' }),
        F('em_numero_motor', 'Número de motor', 'Texto'), F('em_capacidad', 'Capacidad', 'Texto', { help: 'Valor y unidad: t, kg, kW o m³.' }), F('em_peso_operativo', 'Peso operativo (kg)', 'Número', { src: ['Extracción automática'] }),
        F('em_horometro', 'Horómetro (h)', 'Número', { req: 'PV', src: ['Extracción automática'], help: (Q.identificacion || {}).horometro || '' }),
        F('em_horas_anio', 'Horas por año', 'Cálculo', { f: '{em_horometro} ÷ años desde la puesta en servicio' })],
      eqd: [F('em_matricula', 'Matrícula o registro', 'Opción única', { req: 'PV', opts: ['Sí', 'No', 'En trámite'] }), F('em_numero_matricula', 'Número de matrícula', 'Texto', { req: 'PV', vis: { k: 'em_matricula', v: 'Sí' } }),
        F('em_fecha_tramite', 'Fecha del trámite', 'Fecha', { req: 'PV', vis: { k: 'em_matricula', v: 'En trámite' } }), F('em_documento_propiedad', 'Documento de propiedad', 'Opción única', { opts: ['Factura', 'Contrato'] }),
        F('em_licencia', 'Licencia del operador', 'Sí/No', { req: 'PV', opts: SINO }), F('em_tipo_licencia', 'Tipo de licencia', 'Catálogo', { opts: ['E', 'G'], vis: { k: 'em_licencia', v: 'Sí' }, src: ['Extracción automática'] }),
        F('em_vigencia_licencia', 'Vigencia de la licencia', 'Fecha', { vis: { k: 'em_licencia', v: 'Sí' }, src: ['Extracción automática'] }), F('em_permiso_operacion', 'Permiso de operación', 'Opción única', { opts: ['Sí', 'No', 'No aplica'] }),
        F('em_ficha_tecnica', 'Ficha técnica o catálogo', 'Sí/No', { opts: SINO }), F('em_contrato_arrendamiento', 'Contrato de arrendamiento', 'Sí/No', { opts: SINO, vis: { k: 'em_uso', v: 'Alquiler a terceros' } })],
      equ: [F('em_uso', 'Uso', 'Opción única', { req: 'PV', opts: ['Propio', 'Alquiler a terceros', 'Contratista'] }), F('em_actividad', 'Actividad', 'Catálogo', { req: 'PV', opts: ['Construcción', 'Minería', 'Petrolera', 'Agrícola', 'Portuaria', 'Industrial', 'Otra'] }),
        F('em_horas_dia', 'Horas promedio por día', 'Número'), F('em_turnos', 'Turnos por día', 'Número'), F('em_operador', 'Operador', 'Opción única', { opts: ['Propio', 'Tercero'] }), F('em_experiencia_operador', 'Experiencia del operador (años)', 'Número'),
        F('em_lugar_trabajo', 'Lugar de trabajo actual', 'Texto'), F('em_pernocta', 'Lugar donde pasa la noche', 'Opción única', { req: 'PV', opts: ['Patio cerrado', 'Obra', 'Vía pública'] }),
        F('em_traslados', 'Traslados entre obras', 'Opción única', { opts: ['Cama baja', 'Por sus medios', 'No se traslada'] })],
      eqm: [F('em_bitacora', 'Bitácora', 'Sí/No', { req: 'PV', opts: SINO }), F('em_preventivo', 'Mantenimiento preventivo', 'Sí/No', { req: 'PV', opts: SINO }), F('em_frecuencia', 'Frecuencia (cada N horas)', 'Número', { vis: { k: 'em_preventivo', v: 'Sí' } }),
        F('em_correctivo', 'Mantenimiento correctivo', 'Sí/No', { opts: SINO }), F('em_ultimo_mantenimiento', 'Último mantenimiento', 'Fecha'), F('em_horometro_ultimo', 'Horómetro en el último mantenimiento', 'Número'),
        F('em_mantenimiento_quien', 'Quién lo realiza', 'Opción única', { opts: ['Personal propio', 'Concesionario', 'Taller externo'] }), F('em_chequeo_previo', 'Chequeo antes del uso por el operador', 'Sí/No', { opts: SINO })],
      eqs: [F('em_extintor', 'Extintor', 'Sí/No', { req: 'PV', opts: SINO }), F('em_vigencia_extintor', 'Vigencia del extintor', 'Fecha', { vis: { k: 'em_extintor', v: 'Sí' } }), F('em_gps', 'GPS o rastreo', 'Sí/No', { req: 'PV', opts: SINO }),
        F('em_gps_proveedor', 'Proveedor del rastreo', 'Texto', { vis: { k: 'em_gps', v: 'Sí' } }), F('em_inmovilizador', 'Inmovilizador', 'Sí/No', { opts: SINO }), F('em_alarma_retroceso', 'Alarma de retroceso', 'Sí/No', { opts: SINO }),
        F('em_rops', 'Cabina con estructura antivuelco (ROPS/FOPS)', 'Opción única', { opts: ['Sí', 'No', 'No aplica'] }), F('em_balizas', 'Balizas y luces', 'Sí/No', { opts: SINO }),
        F('em_vigilancia', 'Vigilancia del lugar de pernocta', 'Opción única', { opts: ['Guardia', 'Cámaras', 'Ninguna'] })],
      eqc: [F('em_componentes', 'Estado por componentes', 'Grilla', { req: 'PV', cols: ['Componente', 'Estado', 'Observación', 'Foto'], rows: ['Motor', 'Sistema hidráulico', 'Neumáticos u orugas', 'Cabina y vidrios', 'Implemento', 'Estructura y chasis', 'Sistema eléctrico'], help: 'Estado: Bueno, Regular o Malo.' })],
      eqa: [F('em_averias', 'Averías', 'Grilla', { cols: ['Pieza', 'Tipo de daño', 'Gravedad', 'Foto'], preex: true, help: 'Preexistencias del equipo; mismo modelo que Vehículos.' })],
      eqx: [F('em_implementos', 'Implementos y accesorios', 'Grilla', { cols: ['Descripción', 'Marca', 'Serie', 'Valor'], help: 'Se suman como extras.' })],
      eqv: [F('em_suma_asegurada', 'Suma asegurada', 'Moneda', { locked: true, src: ['Solicitud'], help: 'De la solicitud; no se edita en el informe.' }),
        F('em_vrn', 'VRN de referencia', 'Moneda', { req: 'PV', min: 0, help: (Q.valores || {}).vrn || '' }),
        F('em_vrn_fuente', 'Fuente del VRN', 'Catálogo', { req: 'PV', opts: ['Cotización', 'Lista de precios', 'Factura de equipo nuevo', 'Catálogo de referencias'] }),
        F('em_vrn_evidencia', 'Evidencia del VRN', 'Texto', { req: 'PV', help: (Q.valores || {}).sinEvidencia || '' }), F('em_modelo_equivalente', 'Modelo equivalente', 'Texto', { help: 'Si el original ya no se fabrica.' }),
        F('em_valor_real', 'Valor real', 'Cálculo', { f: 'VRN × (1 − depreciación); nunca menos del 30 % del VRN', help: ((Q.valores || {}).depreciacion || {}).nota || '' }),
        F('em_relacion_sa_vrn', 'Relación suma asegurada / VRN', 'Cálculo', { f: '{em_suma_asegurada} / {em_vrn} × 100', alertas: [{ op: 'menor', a: 90, txt: 'Infraseguro' }, { op: 'mayor', a: 110, txt: 'Sobreseguro' }] }),
        F('em_valor_implementos', 'Valor de implementos', 'Cálculo', { f: 'SUMA({em_implementos}.valor)' })],
      eqh: [F('em_siniestros', 'Siniestros en los últimos 3 años', 'Sí/No', { opts: SINO }), F('em_siniestros_detalle', 'Detalle', 'Texto', { vis: { k: 'em_siniestros', v: 'Sí' } })],
      eqr: [F('em_decision_inspector', 'Decisión del inspector', 'Opción única', { req: 'PV', opts: ['Enviar a calificación'], help: 'Al inicio solo puede enviar a calificación (sin determinación del inspector).' }),
        F('em_observacion_general', 'Observación general', 'Texto'), F('em_firma_atiende', 'Firma de quien atiende', 'Foto', { req: 'P' })] };
    var secciones = (Q.formulario || {}).secciones.map(function (s) { return [s.id, s.titulo]; });
    var EX = { eq_placa_fabricante: ['Placa del fabricante'], eq_tablero: ['Horómetro'], eq_doc_licencia_f: ['Licencia del operador'], eq_doc_matricula: ['Matrícula del equipo'] };
    var SEC = { Exteriores: ['eqc', 'eqa'], Cabina: ['eqc'], Identificación: ['eqi'], Equipamiento: ['eqc'], Seguridad: ['eqs'], Daños: ['eqa'], Documentos: ['eqd'] };
    var pasos = (Q.pasosFoto || []).map(function (p) { var rep = p[0] === 'eq_danos';
      return { id: p[0], group: p[2], name: p[1], req: { P: !!p[3], V: !!p[4], A: false, D: false }, min: p[3] || p[4] ? 1 : 0, max: rep ? 30 : 1, rep: rep, ex: EX[p[0]] || [], feedsX: [], link: rep ? 'em_averias' : '',
        guide: 'Marco de encuadre · ' + p[1].toLowerCase(), sec: p[0] === 'eq_tablero' ? ['eqi', 'eqc'] : (SEC[p[2]] || []), doc: p[0] === 'eq_doc_matricula' ? 'Matrícula del equipo' : p[0] === 'eq_doc_licencia_f' ? 'Licencia del operador' : p[0] === 'eq_placa_fabricante' ? 'Placa del fabricante' : '',
        pd: /licencia/.test(p[0]), vis: p[0] === 'eq_gps' ? { k: 'em_gps', v: 'Sí' } : null }; });
    var F0 = Q.formulario || {};
    return { nombre: F0.ramo || RAMO, version: F0.version || 1, estado: F0.estado || 'Vigente', desde: '2026-10-14', mod: '2026-10-13', by: 'Andrea Salazar', composicion: F0.composicion || 'Equipo móvil', tipoObjeto: 'Equipo móvil',
      sinAutoinspeccion: true, extraccion: (Q.extraccion || []).slice(), pasos: pasos, campos: campos, secciones: secciones };
  }

  // ---------- Caso de ejemplo 20204 ----------
  function construir() {
    var e = E(), Q = D(), X = Q.ejemplo; if (!e || !X || !Q.formulario) return;
    e.plantillas = e.plantillas || {}; if (!e.plantillas[PL]) e.plantillas[PL] = plantilla();
    if ((e.casos || []).some(function (c) { return c.id === X.caso; })) return;
    var GPS = [-0.4634, -76.9842], insp = ['14/10/26 · 09:40', '14/10/26 · 10:35', '14/10/26 · 11:25'], carga = '15/10/26 · 15:50';
    e.equipos = e.equipos || []; e.evidencias = e.evidencias || {};
    var riesgos = X.equipos.map(function (q, i) {
      var val = SE.valores(q), envio = SE.reglas(q, val), doc = q.documentacion || {}, uso = q.uso || {}, man = q.mantenimiento || {}, seg = q.seguridad || {};
      var cm = {
        em_categoria: q.categoria, em_tipo: q.tipo, em_tipo_descripcion: q.descripcion, em_marca: q.marca, em_modelo: q.modelo, em_color: q.color, em_anio_fabricacion: q.anioFab, em_anio_servicio: q.anioServicio, em_pais: q.pais, em_serie_pin: q.pin, em_numero_motor: q.motor, em_capacidad: q.capacidad, em_horometro: q.horometro,
        em_matricula: doc.matricula, em_numero_matricula: doc.numero || '', em_fecha_tramite: doc.tramite ? fecha(doc.tramite) : '', em_licencia: doc.licencia, em_tipo_licencia: doc.tipoLicencia || '', em_vigencia_licencia: doc.vigenciaLicencia ? fecha(doc.vigenciaLicencia) : '',
        em_uso: uso.uso, em_actividad: uso.actividad, em_horas_dia: uso.horasDia, em_operador: uso.operador, em_pernocta: uso.pernocta,
        em_bitacora: man.bitacora, em_preventivo: man.preventivo, em_frecuencia: man.frecuencia, em_ultimo_mantenimiento: man.ultimo ? fecha(man.ultimo) : '', em_mantenimiento_quien: man.quien, em_chequeo_previo: man.chequeo,
        em_extintor: seg.extintor, em_vigencia_extintor: seg.vigenciaExtintor ? fecha(seg.vigenciaExtintor) : '', em_gps: seg.gps, em_gps_proveedor: seg.proveedor || '', em_alarma_retroceso: seg.alarmaRetroceso, em_rops: seg.rops, em_vigilancia: uso.vigilancia,
        em_suma_asegurada: q.sumaAsegurada, em_vrn: q.vrn, em_vrn_fuente: SE.fuenteDe(q.vrnFuente), em_vrn_evidencia: q.vrnFuente, em_decision_inspector: 'Enviar a calificación' };
      var campos = {}; Object.keys(cm).forEach(function (k) { if (cm[k] !== undefined && cm[k] !== '') campos[k] = { v: cm[k] }; });
      var grillas = { em_componentes: Object.keys(q.componentes || {}).map(function (k) { return { componente: k, estado: q.componentes[k], obs: '', foto: q.componentes[k] !== 'No aplica' }; }), em_averias: (q.averias || []).map(function (a) { return { pieza: a.pieza, desc: a.descripcion || '', tipo: a.tipo, grav: a.gravedad, sup: a.superficie != null ? String(a.superficie).replace('.', ',') : '', prof: a.profundidad || '', foto: a.foto || '', estado: 'aceptada', by: X.visita.inspector, at: insp[i] || carga }; }),   // etapa 12a-b
        em_implementos: (q.implementos || []).map(function (x) { return { desc: x[0], marca: x[1], serie: x[2], valor: x[3] }; }) };
      var label = q.marca + ' ' + q.modelo, ev = [['15/10/26 · 16:00', envio.length ? 'Enviado a calificación por regla: ' + envio.map(function (r) { return r.regla + (r.pct ? ' (' + r.pct + ')' : ''); }).join(', ') : 'Enviado a calificación', 'Sistema'], [carga, 'Informe de inspección registrado · ' + label, X.visita.inspector]];
      e.equipos.push({ caso: X.caso, riesgo: q.id, label: label, placa: '', marca: q.marca, modelo: q.modelo, anio: q.anioFab, tipo: q.tipo, categoria: q.categoria, modalidad: X.visita.modalidad, inspector: X.visita.inspector, fechaInspeccion: fecha(X.visita.fecha), formulario: PL,
        informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: X.visita.inspector, inspeccion: insp[i], carga: carga, campos: campos, grillas: grillas }, sucursal: X.sucursal, lugar: X.ciudad, resultado: 'regla', envio: envio, eventos: ev, eq: q });
      // Fotos de los pasos exigidos en Presencial (con hora, GPS del patio y el dispositivo de la app del inspector).
      var T = e.plantillas[PL], fotos = {}, j = 0, m = /(\d\d)\/(\d\d)\/(\d\d) · (\d\d):(\d\d)/.exec(insp[i]);
      T.pasos.forEach(function (s) { if (!s.req.P) return; var t = new Date(2000 + Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]) + Math.floor(j * 1.4)), k = j++;
        fotos[s.id] = [{ id: q.id + '-' + s.id + '-1', at: pad(t.getDate()) + '/' + pad(t.getMonth() + 1) + '/' + String(t.getFullYear()).slice(2) + ' · ' + pad(t.getHours()) + ':' + pad(t.getMinutes()),
          gps: { lat: +(GPS[0] + i * 0.00018 + ((k * 7) % 11 - 5) * 0.00001).toFixed(5), lng: +(GPS[1] + i * 0.00021 + ((k * 5) % 9 - 4) * 0.00001).toFixed(5), prec: 4 + (k % 5) }, disp: 'Samsung Galaxy A54 · App del inspector 3.2', canal: 'App del inspector', marca: '' }]; });
      e.evidencias[q.id] = { fotos: fotos };
      return { id: q.id, label: label, nowrap: true, detalle: q.tipo + ' · ' + q.anioFab, cobertura: 'Todo riesgo', total: q.sumaAsegurada, estado: 'Pendiente calificación', envio: envio };
    });
    var V = X.visita, ct = X.contacto || {};
    e.casos.push({ id: X.caso, orden: 'OE-2026-09040', origen: X.origen, ramo: RAMO, ramos: [RAMO], broker: X.broker, asegurado: X.asegurado, ident: X.ruc, placa: '', bien: X.equipos.length + ' equipos · ' + X.ciudad.replace(/ \(.*\)$/, ''), fecha: '2026-10-13', sucursal: X.sucursal, ciudad: X.ciudad.replace(/ \(.*\)$/, ''),
      prov: 'Orellana', canton: 'Francisco de Orellana', dir: X.direccion, tel: ct.celular, correo: ct.correo, backoffice: X.backoffice, estado: X.estado, responsable: X.backoffice, comercial: X.comercial, tipoRiesgo: RAMO, composicion: 'Equipo móvil', riesgos: riesgos });
    e.visitas = e.visitas || {}; e.visitas[X.caso] = [{ id: 'V1', mod: V.modalidad, inspector: V.inspector, fecha: V.fecha, hIni: V.franja[0], hFin: V.franja[1], dir: X.direccion, inter: '', ref: 'Patio de maquinaria', riesgos: X.equipos.map(function (q) { return q.id; }), estado: 'Realizada', cName: ct.nombre, cCel: ct.celular, cMail: ct.correo }];
    e.detallesCasos = e.detallesCasos || {};
    e.detallesCasos[X.caso] = { same: true, sol: { nombre: X.asegurado, ident: X.ruc, correo: ct.correo, tel: ct.celular, prov: 'Orellana', canton: 'Francisco de Orellana', dir: X.direccion }, objTitle: 'Equipos', obj: [], values: [],
      contacto: { nombre: ct.nombre + ' (' + ct.cargo + ')', cel: ct.celular, correo: ct.correo }, rec: { score: 46, nivel: 'Riesgo medio', alertas: [], modalidad: 'Presencial', motivo: 'Tres equipos en un mismo patio; fuera de la ciudad base del inspector.' },
      aps: '—', linea: 'Corporativos', tipo: 'Emisión nueva', califs: [{ title: 'Calificación', estado: 'Pendiente', obs: 'Cada equipo se califica con su propio informe.', user: '—', fecha: '—' }], seg: null,
      insp: { modalidad: V.modalidad, inspector: V.inspector, realizada: fecha(V.fecha) + ' · ' + V.franja[0], lugarLabel: 'Dirección', lugar: X.direccion + ', ' + X.ciudad },
      events: [['15/10/26 · 16:00', 'Informes de los ' + X.equipos.length + ' equipos enviados · pasa a calificación', 'Sistema'], [carga, 'Informes de inspección registrados · ' + X.equipos.length + ' equipos', V.inspector], [fecha(V.fecha) + ' · ' + V.franja[0], 'Visita presencial realizada · ' + V.inspector + ' (Eurosurvey) · ' + (V.nota || ''), V.inspector], ['13/10/26 · 10:20', 'Solicitud registrada · ' + X.equipos.length + ' equipos', 'Andrea Salazar']] };
  }
  SE.construir = construir;
  window.SiriusEquipos = SE;
  // Los scripts pueden cargar en cualquier orden: se arma cuando SIRIUS_EJEMPLO y SIRIUS_EQUIPOS ya existen (las pantallas llaman también a construir()).
  SE.listo = function () { return !!(window.SIRIUS_EJEMPLO && window.SIRIUS_EJEMPLO.casos && window.SIRIUS_EQUIPOS && window.SIRIUS_EQUIPOS.ejemplo); };
  if (SE.listo()) construir(); else { var t0 = setInterval(function () { if (SE.listo()) { clearInterval(t0); construir(); } }, 20); }
})();
