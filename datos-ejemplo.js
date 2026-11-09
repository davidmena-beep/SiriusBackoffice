// Fuente única de datos de ejemplo de vehículos (SIRIUS prototipo).
// Todo dato de ejemplo nuevo se agrega solo aquí. Lo leen SIRIUS Back-office y Niveles de calificación.
// resultado: determinado (por el inspector) · regla (enviado por regla) · facultad (enviado por facultad) · decision (enviado por decisión del inspector)
(function () {
  const VL1 = 'Vehículos livianos v1';
  const SUC = ['Quito Norte', 'Quito Sur', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato', 'Ibarra']; // catálogo único de sucursales (Nueva solicitud, Datos de póliza, informe, reglas)
  // Pasos de foto de la plantilla (Formularios › Pasos de foto y el panel de evidencias del informe leen de aquí).
  // vis: el paso solo se ve (y solo es obligatorio) si el campo indicado tiene ese valor · req: modalidades donde la foto es obligatoria (P presencial, V virtual guiada, A autoinspección, D documental) · sec: secciones del informe donde se muestra primero (la primera es la principal) · doc: nombre del documento que usan los campos extraídos · pd: contiene datos personales.
  const slug = (s, n) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, n || 22).replace(/_+$/, '');
  const PASOS = (() => { const out = [], g = (group, names, o) => names.forEach(n => { o = o || {}; const f = (x, dv) => typeof x === 'function' ? x(n) : (x === undefined ? dv : x); const req = f(o.req, true);
      out.push({ id: slug(group) + '_' + slug(n), group, name: n, req: { P: req, V: req, A: f(o.A, req), D: f(o.D, false) }, min: o.min === undefined ? 1 : o.min, max: o.max || 1, rep: !!o.rep, ex: f(o.ex, []), feedsX: f(o.feeds, []), link: o.link || '', guide: o.guide ? o.guide(n) : 'Silueta · ' + n.toLowerCase(), sec: f(o.sec, []), doc: f(o.doc, ''), pd: !!f(o.pd, false), vis: f(o.vis, null) }); });
    g('Exteriores', ['Frontal', 'Posterior', 'Parabrisas', 'Lateral derecho de adelante hacia atrás', 'Lateral derecho de atrás hacia adelante', 'Lateral izquierdo de adelante hacia atrás', 'Lateral izquierdo de atrás hacia adelante'], { ex: n => n === 'Frontal' ? ['Marca y modelo', 'Color', 'Daños'] : ['Daños'], sec: ['veh', 'ave'], doc: n => n === 'Lateral izquierdo de adelante hacia atrás' ? 'Foto lateral izquierda' : n === 'Lateral derecho de adelante hacia atrás' ? 'Foto lateral derecha' : '' });
    g('Motor', ['Habitáculo del motor'], { ex: ['Motor'], sec: ['veh'] });
    g('Identificación', ['Placa delantera', 'Placa trasera', 'Chasis en relieve', 'Sticker VIN', 'Plaqueta panorámica VIN'], { ex: n => n.startsWith('Placa ') ? ['Placa'] : ['VIN'], feeds: n => n === 'Chasis en relieve' ? ['veh_verificacion_chasis_relieve'] : n === 'Sticker VIN' ? ['veh_verificacion_sticker_vin'] : n.startsWith('Plaqueta') ? ['veh_verificacion_plaqueta_panoramica'] : [], sec: n => n.startsWith('Placa ') ? ['veh'] : ['ver', 'veh'] });
    g('Documentos', ['Matrícula frontal', 'Matrícula posterior', 'Contrato de compraventa', 'Cédula frontal', 'Cédula posterior', 'Licencia frontal', 'Licencia posterior'], { D: true, ex: n => n.startsWith('Matrícula') ? ['Datos de la matrícula'] : n.startsWith('Cédula') ? ['Datos de la cédula'] : n.startsWith('Licencia') ? ['Datos de la licencia'] : [], sec: n => n.startsWith('Matrícula') || n.startsWith('Contrato') ? ['mat'] : ['uso'], doc: n => n === 'Matrícula frontal' ? 'Matrícula' : '', pd: n => !n.startsWith('Contrato'), vis: n => n.startsWith('Contrato') ? { k: 'veh_contrato_compraventa', v: 'Sí' } : null });
    g('Interiores', ['Puerta del conductor', 'Puerta del pasajero', 'Puerta posterior derecha', 'Puerta posterior izquierda', 'Tablero lateral izquierdo', 'Tablero lateral derecho', 'Tablero de instrumentos', 'Kilometraje', 'Radio y aire acondicionado', 'Cámara de retro', 'Asientos delanteros', 'Asientos posteriores', 'Techo o sunroof', 'Cajuela o balde'], { ex: n => n === 'Tablero de instrumentos' ? ['Testigos del tablero'] : n === 'Kilometraje' ? ['Kilometraje'] : [], A: false, feeds: n => n === 'Cámara de retro' ? ['veh_camara_retro'] : [], sec: n => n === 'Tablero de instrumentos' ? ['tes'] : n === 'Kilometraje' ? ['uso'] : ['acc'], doc: n => n === 'Tablero de instrumentos' ? 'Foto del tablero' : '' });
    g('Airbags', ['Airbags'], { rep: true, max: 12, req: false, feeds: () => ['veh_cantidad_airbags'], sec: ['acc'] });
    g('Llantas', ['Delantera derecha', 'Delantera izquierda', 'Trasera derecha', 'Trasera izquierda', 'Emergencia'], { ex: ['Profundidad del labrado'], A: false, guide: n => 'Llanta ' + n.toLowerCase() + ' con calibrador', sec: ['neu'] });
    g('Extras', ['Extras'], { rep: true, min: 0, max: 20, req: false, link: 'veh_extras', sec: ['ext'] });
    g('Daños', ['Daños'], { rep: true, min: 0, max: 30, req: false, ex: ['Daños'], link: 'veh_averias', sec: ['ave'] });
    const REQ_D = ['Matrícula frontal', 'Matrícula posterior', 'Cédula frontal', 'Cédula posterior', 'Frontal', 'Posterior', 'Lateral derecho de adelante hacia atrás', 'Lateral izquierdo de adelante hacia atrás', 'Tablero de instrumentos'];
    out.forEach(s => { s.req.D = REQ_D.includes(s.name); });
    // Etapa VF: el slug de 22 letras deja dos pasos con el mismo id («Lateral izquierdo de adelante…» y «…de atrás…»). Los repetidos se alargan a 24 letras, igual que el lateral derecho.
    const rep = {}; out.forEach(s => { rep[s.id] = (rep[s.id] || 0) + 1; }); out.forEach(s => { if (rep[s.id] > 1) s.id = slug(s.group) + '_' + slug(s.name, 24); });
    return out; })();
  // Campos de los módulos de Ramos Generales (envío 1B1). Solo definición: los puntajes se configuran en Modelos de calificación.
  // origen: Solicitud · Contexto externo · Inspector · IA · ia: elegible para IA · na: admite No aplica · alias: clave del check list actual.
  const MOD_CAMPOS = (() => {
    const F = (k, l, t, o) => Object.assign({ k, l, t, req: false, origen: 'Inspector', fuente: '', ia: false, na: false, alias: '', locked: false, ro: false, opts: [], cols: [], unidad: '', formula: '', nota: '', vis: null, pol: '', aplica: '' }, o || {});
    // ev: evidencias esperadas de la sección (captura libre, sin orden) · docs: documentos con lectura de documentos.
    const S = (id, nombre, campos, rep, pasos) => ({ id, nombre, rep: rep || null, campos, evidencias: (pasos || []).filter(p => p.etiqueta), documentos: (pasos || []).filter(p => p.doc) });
    // Evidencia esperada: etiqueta del catálogo compartido · req: 'si' | 'no' | { k, v } (Visible si) · min · porInstancia · respalda: campos que sustenta · ia.
    let EVN = 0; const E = (etiqueta, o) => Object.assign({ id: 'ev' + String(++EVN).padStart(3, '0'), etiqueta, req: 'no', min: 0, porInstancia: false, respalda: [], ia: true }, o || {});
    // Documento: req false | true | { giros: [...] } · respalda: campos que sustenta la lectura del documento.
    const D = (k, name, o) => Object.assign({ doc: true, k, name, req: false, lectura: true, alias: '', respalda: [] }, o || {});
    const CHR = (...ns) => ns.map(n => 'rg_ele_chk_' + String(n).padStart(2, '0'));
    const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
    // Pasos de foto y de documento: vinculados a su sección, con imagen guía, obligatoriedad por modalidad (P presencial, V virtual guiada, A autoinspección, D documental) y elegibilidad para IA.
    const P = (k, name, o) => { o = o || {}; const r = !!o.req; return Object.assign({ k, name, kind: 'foto', guide: 'Silueta · ' + name.toLowerCase(), req: { P: r, V: r, A: r, D: false }, ia: true, rep: false, min: r ? 1 : 0, max: 1, alias: '', vis: null, nota: '' }, o.kind === 'documento' ? { ia: false, guide: 'Documento completo y legible' } : {}, o, { req: o.reqM || { P: r, V: r, A: r, D: false } }); };
    // Bloques repetibles: fijo (instancias con código estable) o libre (el inspector agrega; el código se genera solo).
    const FIJO = (labels) => ({ tipo: 'fijo', items: labels.map(l => ({ cod: l.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_'), label: l })) });
    const LIBRE = (prefijo, por) => ({ tipo: 'libre', prefijo, por });
    const GIROS = ['Casa habitación', 'Edificios', 'HORECA', 'Educación', 'Comercial', 'Servicios', 'Construcción', 'Industrial', 'Estación de servicios', 'Cooperativas'];
    const SCVS = { origen: 'Contexto externo', fuente: 'SCVS' };
    const LIN = ['Norte', 'Sur', 'Este', 'Oeste'], AMZ = ['Sísmico', 'Inundación', 'Volcánico', 'Vientos y rayos', 'Maremoto', 'Deslizamiento'];
    const EDIF = LIBRE('edif', 'edificación'), SN = ['Sí', 'No'];
    const NA_GIRO = 'No aplica automático en los giros Casa habitación, Edificios, Educación y Servicios; el inspector puede cambiarlo con motivo';
    const CHK = [['Tableros rotulados y accesibles'], ['Cables expuestos o mal canalizados', '-'], ['Conexiones improvisadas o empalmes sin protección', '-'], ['Protecciones en buen estado'], ['Cajas de conexión con tapa'], ['Puesta a tierra visible'], ['Señalización de riesgo eléctrico'], ['Sin polvo, humedad ni inflamables junto a equipos'], ['Accesos a tableros libres'], ['EPP dieléctrico', '+', 1], ['Herramientas aisladas', '+', 1], ['Zonas de aproximación NFPA 70E', '+', 1], ['Bloqueo y etiquetado (LOTO)', '+', 1], ['Planos eléctricos actualizados'], ['Procedimientos de emergencia exhibidos'], ['Equipos con potencial de arco identificados', '+', 1], ['Barreras o distancias de seguridad por arco', '+', 1]];
    const SCVS2 = { origen: 'Contexto externo', fuente: 'SCVS' };
    const EXT = { origen: 'Contexto externo', nota: 'Editable por el inspector' };
    const PROT = ['Blindaje', 'Rejas', 'Láminas de seguridad', 'Sin protección'], DIST = ['Menos de 1 km', '1 a 5 km', 'Más de 5 km'], TIEMPO = ['Menos de 5 min', '5 a 10 min', 'Más de 10 min'];
    const VIG = { k: 'rg_rob_vig_existe', v: 'Sí' }, CCTV = { k: 'rg_rob_cctv_existe', v: 'Sí' };
    const AGR = ['Almacenamiento interior sin ventilación', 'Sin dique de contención', 'Cerca de fuentes de ignición', 'Sin señalización', 'Recipientes no aprobados', 'Sin conexión a tierra en trasvase', 'Cantidad sobre el límite del área', 'Trasvase sin control', 'Sin extintor adecuado'];
    const AGK = (...ns) => ns.map(n => 'rg_cmb_agr_' + String(n).padStart(2, '0')), RM = { ramos: ['Rotura de maquinaria'] };
    return {
      m22: [
        S('trc_obr', 'Datos de la obra', [
          F('rg_trc_tipo_obra', 'Tipo de obra', 'Opción única', { req: true, opts: ['Edificación', 'Vial', 'Hidráulica', 'Industrial', 'Otra'] }),
          F('rg_trc_area', 'Área de la obra', 'Número', { req: true, unidad: 'm²' }),
          F('rg_trc_constructor', 'Constructor', 'Texto', { req: true }),
          F('rg_trc_avance', 'Avance de la obra', 'Número', { req: true, unidad: '%' }),
          F('rg_trc_fecha_inicio', 'Fecha de inicio', 'Fecha', { nota: 'Según el cronograma' }),
          F('rg_trc_fecha_fin', 'Fecha de fin', 'Fecha', { nota: 'Según el cronograma' })], null,
          [E('ev_frente_obra', { req: 'si', min: 2, respalda: ['rg_trc_tipo_obra', 'rg_trc_avance'] }),
           D('rg_trc_doc_permiso', 'Permiso de construcción', { req: true, respalda: ['rg_trc_tipo_obra'] }), D('rg_trc_doc_cronograma', 'Cronograma de obra', { req: true, respalda: ['rg_trc_fecha_inicio', 'rg_trc_fecha_fin', 'rg_trc_avance'] }), D('rg_trc_doc_especificaciones', 'Especificaciones técnicas', { req: true, respalda: ['rg_trc_tipo_obra', 'rg_trc_area'] })]),
        S('trc_seg', 'Seguridad en obra', [
          F('rg_trc_cerramiento', '¿Tiene cerramiento?', 'Sí/No', { opts: SN }),
          F('rg_trc_vigilancia', '¿Tiene vigilancia?', 'Sí/No', { opts: SN }),
          F('rg_trc_almacen_materiales', 'Almacén de materiales', 'Opción única', { opts: ['Bodega cerrada', 'Patio abierto', 'Sin control'] })], null,
          [E('ev_almacen_materiales', { respalda: ['rg_trc_almacen_materiales'] }), E('ev_cerramiento', { req: { k: 'rg_trc_cerramiento', v: 'Sí' }, min: 1, respalda: ['rg_trc_cerramiento'] })])],
      m16: [
        S('ocu_ocu', 'Ocupación', [
          F('rg_ocu_ciiu', 'Ocupación (CIIU)', 'Catálogo', { ro: true, lee: 'rg_gen_ciiu' }),
          F('rg_ocu_riesgo_ciiu', 'Riesgo según CIIU', 'Cálculo', { ro: true, opts: ['Bajo', 'Medio', 'Alto'], formula: 'Según el catálogo CIIU de la ocupación' }),
          F('rg_ocu_clase_mrl', 'Clase MRL', 'Catálogo', { nota: 'Catálogo MRL' }),
          F('rg_ocu_carga_combustible', 'Carga combustible', 'Opción única', { req: true, ia: true, opts: ['Baja', 'Moderada', 'Alta'] }),
          F('rg_ocu_riesgo_nfpa', 'Riesgo de ocupación NFPA', 'Opción única', { req: true, opts: ['Ligero', 'Ordinario', 'Extra'], nota: 'Lo usa el cálculo de extintores requeridos' })])],
      m17: [
        S('pro_pro', 'Procesos', [
          F('rg_pro_procesos', 'Procesos', 'Grilla', { cols: ['Proceso', 'Descripción', 'Área', 'Peligros (selección múltiple: Calor, Chispas, Polvo combustible, Químicos, Presión)', 'Controles'], nota: 'Filas libres: el inspector usa «Agregar fila»' }),
          F('rg_pro_permiso_caliente', '¿Hay permiso de trabajo en caliente?', 'Sí/No', { opts: SN }),
          F('rg_pro_descripcion', 'Descripción de los procesos', 'Texto', { origen: 'IA', ia: true, nota: 'Texto redactado' })], null,
          [E('ev_linea_proceso', { req: 'si', min: 2, respalda: ['rg_pro_procesos', 'rg_pro_descripcion'] })])],
      m18: [
        S('alm_bod', 'Bodega', [
          F('rg_alm_nombre', 'Nombre de la bodega', 'Texto', { req: true }),
          F('rg_alm_area', 'Área', 'Número', { req: true, unidad: 'm²' }),
          F('rg_alm_altura_apilamiento', 'Altura de apilamiento', 'Número', { unidad: 'm' }),
          F('rg_alm_tipo', 'Tipo de almacenamiento', 'Opción única', { ia: true, opts: ['Estanterías', 'Racks', 'Pallets en piso', 'Granel'] }),
          F('rg_alm_clase_mercancia', 'Clase de mercancía según NFPA 13', 'Opción única', { req: true, opts: ['Clase I', 'Clase II', 'Clase III', 'Clase IV', 'Plásticos grupo A', 'Plásticos grupo B', 'Plásticos grupo C'] }),
          F('rg_alm_separacion_techo', 'Separación al techo', 'Opción única', { ia: true, opts: ['0,90 m o más', 'Menos de 0,90 m'] }),
          F('rg_alm_pasillos_libres', '¿Pasillos libres?', 'Sí/No', { opts: SN, ia: true }),
          F('rg_alm_valor', 'Valor almacenado', 'Moneda', { unidad: 'USD' })], LIBRE('bod', 'bodega'),
          [E('ev_bodega', { req: 'si', min: 2, porInstancia: true, respalda: ['rg_alm_tipo', 'rg_alm_clase_mercancia', 'rg_alm_pasillos_libres'] }), E('ev_apilamiento', { porInstancia: true, respalda: ['rg_alm_altura_apilamiento', 'rg_alm_separacion_techo'] })])],
      m19: [
        S('cmb_sus', 'Sustancias', [
          F('rg_cmb_sustancias', 'Sustancias combustibles e inflamables', 'Grilla', { cols: ['Sustancia', 'Clase NFPA 30 (IA, IB, IC, II, IIIA, IIIB, Gas)', 'Cantidad', 'Tipo de recipiente', 'Ubicación'], nota: 'Filas libres: el inspector usa «Agregar fila»' })], null,
          [E('ev_area_combustibles', { req: 'si', min: 1, respalda: ['rg_cmb_sustancias'].concat(AGK(1, 2, 3, 4, 5)) })]),
        S('cmb_agr', 'Factores agravantes', AGR.map((l, i) => F(AGK(i + 1)[0], l, 'Sí/No', { opts: SN, factor: 'Agravante' })).concat([
          F('rg_cmb_porcentaje_agravantes', 'Porcentaje de agravantes', 'Cálculo', { ro: true, unidad: '%', formula: 'Agravantes presentes ÷ agravantes evaluados' })])),
        S('cmb_glp', 'GLP', [
          F('rg_cmb_glp', '¿Usa GLP?', 'Sí/No', { opts: SN }),
          F('rg_cmb_glp_ubicacion', 'Ubicación de los cilindros', 'Opción única', { opts: ['Exterior', 'Interior con ventilación superior e inferior', 'Interior sin ventilación'], vis: { k: 'rg_cmb_glp', v: 'Sí' } }),
          F('rg_cmb_glp_kg', 'Cantidad de GLP', 'Número', { unidad: 'kg' })], null,
          [E('ev_cilindros_glp', { req: { k: 'rg_cmb_glp', v: 'Sí' }, min: 1, respalda: ['rg_cmb_glp_ubicacion', 'rg_cmb_glp_kg'] })])],
      m20: [
        S('maq_equ', 'Equipos', [
          F('rg_maq_equipos', 'Maquinaria fija', 'Grilla', { cols: ['Tipo', 'Marca', 'Modelo', 'Serie', 'Año', 'Potencia', 'Valor (USD)'], nota: 'Filas libres: el inspector usa «Agregar fila»' })], null,
          [E('ev_maquinaria', { req: 'si', min: 2, respalda: ['rg_maq_equipos', 'rg_maq_protecciones'] }), E('ev_placa_datos', { req: RM, min: 1, respalda: ['rg_maq_equipos'] }),
           D('rg_maq_doc_listado', 'Listado valorado de maquinaria', { req: RM, respalda: ['rg_maq_equipos'] })]),
        S('maq_man', 'Mantenimiento y operación', [
          F('rg_maq_mantenimiento', 'Tipo de mantenimiento', 'Opción única', { req: true, opts: ['Predictivo', 'Preventivo con bitácora', 'Correctivo', 'Ninguno'] }),
          F('rg_maq_ultimo_mantenimiento', 'Fecha del último mantenimiento', 'Fecha'),
          F('rg_maq_operadores_capacitados', '¿Operadores capacitados?', 'Sí/No', { opts: SN }),
          F('rg_maq_protecciones', '¿Tiene guardas y paros de emergencia?', 'Sí/No', { opts: SN, ia: true })], null,
          [D('rg_maq_doc_bitacora', 'Bitácora de mantenimiento', { req: RM, respalda: ['rg_maq_mantenimiento', 'rg_maq_ultimo_mantenimiento'] })])],
      m21: [
        S('bmb_bmb', 'Bombas', [
          F('rg_bmb_tipo', 'Tipo de bomba', 'Opción múltiple', { req: true, opts: ['Eléctrica', 'Diésel', 'Jockey'] }),
          F('rg_bmb_listada', '¿Listada UL o FM?', 'Sí/No', { opts: SN }),
          F('rg_bmb_caudal', 'Caudal', 'Número', { unidad: 'gpm' }),
          F('rg_bmb_presion', 'Presión', 'Número', { unidad: 'psi' }),
          F('rg_bmb_arranque_automatico', '¿Arranque automático?', 'Sí/No', { opts: SN })], null,
          [E('ev_cuarto_bombas', { req: 'si', min: 1, respalda: ['rg_bmb_tipo', 'rg_bmb_listada'] }), E('ev_tablero_bombas', { req: 'si', min: 1, respalda: ['rg_bmb_arranque_automatico', 'rg_bmb_energia_alterna'] })]),
        S('bmb_pru', 'Pruebas y respaldo', [
          F('rg_bmb_pruebas', 'Pruebas', 'Opción única', { opts: ['Semanal registrada', 'Mensual', 'Sin registro'] }),
          F('rg_bmb_energia_alterna', '¿Tiene energía alterna?', 'Sí/No', { opts: SN }),
          F('rg_bmb_reserva_exclusiva', '¿Reserva exclusiva para incendios?', 'Sí/No', { ro: true, opts: SN, lee: 'rg_pci_reserva_exclusiva' })], null,
          [E('ev_tanque_reserva', { req: { k: 'rg_pci_reserva_exclusiva', v: 'Sí' }, min: 1, respalda: ['rg_bmb_reserva_exclusiva'] })])],
      m13: [
        S('rob_cer', 'Cerramiento y accesos', [
          F('rg_rob_cerramiento', 'Cerramiento perimetral', 'Opción única', { req: true, ia: true, alias: 'robo_inp_seguridad', opts: ['Muro de hormigón o bloque', 'Reja metálica', 'Malla', 'Mixto', 'Abierto'] }),
          F('rg_rob_cerramiento_altura', 'Altura del cerramiento', 'Opción única', { opts: ['Menos de 1,50 m', '1,50 a 2,00 m', 'Más de 2,00 m'] }),
          F('rg_rob_proteccion_adicional', 'Protección adicional', 'Opción múltiple', { opts: ['Cerco eléctrico', 'Concertina', 'Alambre de púas', 'Ninguna'] }),
          F('rg_rob_puertas', 'Protección de puertas', 'Opción única', { req: true, ia: true, alias: 'robo_inp_puertas', opts: PROT }),
          F('rg_rob_ventanas', 'Protección de ventanas', 'Opción única', { req: true, ia: true, alias: 'robo_inp_ventanas', opts: PROT })], null,
          [E('ev_cerramiento', { req: 'si', min: 1, porInstancia: 'lindero (módulo Linderos)', respalda: ['rg_rob_cerramiento', 'rg_rob_cerramiento_altura', 'rg_rob_proteccion_adicional'] }), E('ev_puertas_acceso', { req: 'si', min: 1, respalda: ['rg_rob_puertas'] }), E('ev_ventanas', { respalda: ['rg_rob_ventanas'] })]),
        S('rob_vig', 'Guardianía', [
          F('rg_rob_vig_existe', '¿Tiene vigilancia humana?', 'Sí/No', { req: true, opts: SN, alias: 'robo_inp_bool_existencia_vigilancia_humana' }),
          F('rg_rob_vig_tipo', 'Tipo de vigilancia', 'Opción única', { alias: 'robo_inp_vigilancia', opts: ['Empresa de seguridad privada', 'Personal propio', 'Conserje'], vis: VIG }),
          F('rg_rob_vig_armada', '¿Vigilancia armada?', 'Sí/No', { opts: SN, vis: VIG }),
          F('rg_rob_vig_rondas', '¿Hace rondas?', 'Sí/No', { opts: SN, vis: VIG }),
          F('rg_rob_vig_turnos', 'Turnos', 'Opción única', { opts: ['1x8', '1x12', '2x12', '24 h'], vis: VIG }),
          F('rg_rob_vig_dias', 'Días de vigilancia', 'Opción única', { opts: ['5 días', '6 días', '7 días'], vis: VIG }),
          F('rg_rob_vig_horario_inicio', 'Horario de inicio', 'Texto', { alias: 'robo_inp_horario_vigilancia_inicio', nota: 'Hora (hh:mm)', vis: VIG }),
          F('rg_rob_vig_horario_fin', 'Horario de fin', 'Texto', { alias: 'robo_inp_horario_vigilancia_fin', nota: 'Hora (hh:mm)', vis: VIG }),
          F('rg_rob_vig_empresa', 'Empresa de seguridad', 'Texto', { vis: VIG })], null,
          [E('ev_garita_guardia', { req: VIG, min: 1, respalda: ['rg_rob_vig_existe', 'rg_rob_vig_tipo'] })]),
        S('rob_cctv', 'CCTV', [
          F('rg_rob_cctv_existe', '¿Tiene CCTV?', 'Sí/No', { req: true, opts: SN, alias: 'robo_inp_bool_existencia_cctv' }),
          F('rg_rob_cctv_tipo', 'Tipo de cámaras', 'Opción única', { opts: ['IP', 'Analógica'], vis: CCTV }),
          F('rg_rob_cctv_conexion', 'Conexión', 'Opción única', { opts: ['Cableada', 'Inalámbrica'], vis: CCTV }),
          F('rg_rob_cctv_cobertura', 'Cobertura', 'Opción única', { ia: true, alias: 'robo_inp_cobertura', opts: ['Total', 'Parcial en zonas críticas', 'Parcial'], vis: CCTV }),
          F('rg_rob_cctv_monitoreo_situ', '¿Monitoreo en sitio?', 'Sí/No', { opts: SN, vis: CCTV }),
          F('rg_rob_cctv_monitoreo_remoto', '¿Monitoreo remoto?', 'Sí/No', { opts: SN, vis: CCTV }),
          F('rg_rob_cctv_grabacion', 'Grabación', 'Opción única', { opts: ['NVR o nube', 'DVR', 'Sin grabación'], vis: CCTV }),
          F('rg_rob_cctv_resguardo_dias', 'Días de resguardo de grabación', 'Número', { unidad: 'días', alias: 'robo_inp_capacidada_grabacion', vis: CCTV })], null,
          [E('ev_camaras', { req: CCTV, min: 1, respalda: ['rg_rob_cctv_tipo', 'rg_rob_cctv_cobertura'] })]),
        S('rob_ala', 'Alarma', [
          F('rg_rob_alarma_existe', '¿Tiene alarma de intrusión?', 'Sí/No', { req: true, opts: SN, alias: 'robo_inp_bool_alarma_intrusion' }),
          F('rg_rob_alarma_activacion', 'Activación', 'Opción única', { alias: 'robo_inp_alarma', opts: ['Sensor de movimiento', 'Contactos magnéticos', 'Mixta'] }),
          F('rg_rob_alarma_monitoreo', 'Monitoreo de la alarma', 'Opción única', { opts: ['Remoto por empresa o autoridades', 'Local', 'Sin monitoreo'] }),
          F('rg_rob_boton_panico', '¿Tiene botón de pánico?', 'Sí/No', { opts: SN })], null,
          [E('ev_central_alarma', { req: { k: 'rg_rob_alarma_existe', v: 'Sí' }, min: 1, respalda: ['rg_rob_alarma_activacion', 'rg_rob_alarma_monitoreo'] })]),
        S('rob_upc', 'UPC', [
          F('rg_rob_upc_nombre', 'UPC más cercana', 'Texto', EXT),
          F('rg_rob_upc_distancia', 'Distancia a la UPC', 'Opción única', Object.assign({ opts: DIST }, EXT)),
          F('rg_rob_upc_tiempo', 'Tiempo de respuesta', 'Opción única', Object.assign({ opts: TIEMPO }, EXT))])],
      m14: [
        S('dyv_dyv', 'Dinero y valores', [
          F('rg_dyv_monto_max', 'Monto máximo en efectivo', 'Opción única', { req: true, opts: ['0 a 20.000 USD', '20.000 a 50.000 USD', 'Más de 50.000 USD'], nota: 'Tramo que usa el esquema de garantías de cooperativas' }),
          F('rg_dyv_resguardo', 'Resguardo', 'Opción única', { req: true, ia: true, opts: ['Caja fuerte empotrada en piso o pared', 'Caja fuerte no empotrada', 'Cajón con llave', 'Sin resguardo'] }),
          F('rg_dyv_vidrios_blindados_caja', '¿Vidrios blindados en caja?', 'Sí/No', { opts: SN, na: true }),
          F('rg_dyv_boton_panico_caja', '¿Botón de pánico en caja?', 'Sí/No', { opts: SN, na: true }),
          F('rg_dyv_frecuencia_recoleccion', 'Frecuencia de recolección', 'Opción única', { opts: ['Diaria', 'Varias por semana', 'Semanal', 'Menor'] }),
          F('rg_dyv_transporte', 'Transporte de valores', 'Opción única', { req: true, opts: ['Empresa de seguridad o blindado', 'Resguardo policial', 'Personal propio', 'Sin protección'] })], null,
          [E('ev_caja_fuerte', { req: 'si', min: 1, respalda: ['rg_dyv_resguardo'] }), E('ev_area_caja', { req: { k: 'rg_gen_giro', v: 'Cooperativas o Comercial' }, min: 1, respalda: ['rg_dyv_vidrios_blindados_caja', 'rg_dyv_boton_panico_caja'] })])],
      m15: [
        S('ee_inv', 'Inventario', [
          F('rg_ee_equipos', 'Equipos', 'Grilla', { cols: ['Tipo', 'Marca', 'Modelo', 'Serie', 'Ubicación', 'Valor (USD)', 'Año'], nota: 'Se alimenta desde la lectura del listado de equipos' })], null,
          [E('ev_equipos', { req: 'si', min: 3, respalda: ['rg_ee_equipos'] }), D('rg_ee_doc_listado', 'Listado detallado y valorado de equipos', { req: true, respalda: ['rg_ee_equipos'] })]),
        S('ee_cua', 'Cuarto técnico', [
          F('rg_ee_cuarto_existe', '¿Tiene cuarto técnico?', 'Sí/No', { opts: SN }),
          F('rg_ee_cuarto_distancia_fuentes', 'Distancia a fuentes de interferencia', 'Opción única', { opts: ['A 2 m o más de transformadores, ascensores y aire acondicionado', 'Menos de 2 m'] }),
          F('rg_ee_cuarto_humedad', 'Riesgo de agua', 'Opción única', { ia: true, opts: ['Sin humedad ni desagües encima', 'Con riesgo de agua'] }),
          F('rg_ee_climatizacion', 'Climatización', 'Opción única', { opts: ['Climatización dedicada', 'Ventilación natural', 'Ninguna'] }),
          F('rg_ee_temperatura', 'Temperatura', 'Opción única', { opts: ['20 a 25 °C', 'Fuera de rango'] }),
          F('rg_ee_humedad_relativa', 'Humedad relativa', 'Opción única', { opts: ['40 a 60 %', 'Fuera de rango', 'No medida'] })], null,
          [E('ev_cuarto_tecnico', { req: { k: 'rg_ee_cuarto_existe', v: 'Sí' }, min: 1, respalda: ['rg_ee_cuarto_distancia_fuentes', 'rg_ee_cuarto_humedad'] }), E('ev_rack_servidores', { respalda: ['rg_ee_circuitos_dedicados', 'rg_ee_tierra'] }), E('ev_climatizacion', { req: { k: 'rg_ee_climatizacion', v: 'Climatización dedicada' }, min: 1, respalda: ['rg_ee_climatizacion', 'rg_ee_temperatura'] })]),
        S('ee_ele', 'Protección eléctrica', [
          F('rg_ee_tierra', 'Puesta a tierra', 'Opción única', { opts: ['Medida 5 ohmios o menos con certificado', 'Visible sin medición', 'No tiene'] }),
          F('rg_ee_circuitos_dedicados', '¿Circuitos dedicados?', 'Sí/No', { opts: SN }),
          F('rg_ee_ups', '¿Tiene UPS?', 'Sí/No', { opts: SN }),
          F('rg_ee_ups_autonomia', 'Autonomía de la UPS', 'Número', { unidad: 'minutos', vis: { k: 'rg_ee_ups', v: 'Sí' } }),
          F('rg_ee_supresor', '¿Tiene supresor de picos?', 'Sí/No', { opts: SN }),
          F('rg_ee_generador', '¿Tiene generador?', 'Sí/No', { opts: SN })], null,
          [E('ev_ups', { req: { k: 'rg_ee_ups', v: 'Sí' }, min: 1, respalda: ['rg_ee_ups', 'rg_ee_ups_autonomia'] })]),
        S('ee_pci', 'Protección contra incendio del área', [
          F('rg_ee_detector_cuarto', '¿Detector en el cuarto?', 'Sí/No', { opts: SN }),
          F('rg_ee_extintor_tipo', 'Tipo de extintor', 'Opción única', { opts: ['CO2 o agente limpio', 'Solo PQS', 'No tiene'] }),
          F('rg_ee_supresion', 'Sistema de supresión', 'Opción única', { opts: ['Agente limpio automático', 'Rociadores de agua', 'Ninguna'] })], null,
          [E('ev_extintor_cuarto', { req: { k: 'rg_ee_extintor_tipo', op: '≠', v: 'No tiene' }, min: 1, respalda: ['rg_ee_extintor_tipo'] })]),
        S('ee_man', 'Mantenimiento y continuidad', [
          F('rg_ee_plan_mantenimiento', 'Plan de mantenimiento', 'Opción única', { req: true, opts: ['Contrato vigente', 'Interno con registro', 'Sin plan'] }),
          F('rg_ee_respaldo_datos', '¿Hay respaldo de datos?', 'Sí/No', { opts: SN }),
          F('rg_ee_plan_continuidad', '¿Hay plan de continuidad?', 'Sí/No', { opts: SN, na: true })], null,
          [D('rg_ee_doc_plan_mant', 'Plan de mantenimiento', { respalda: ['rg_ee_plan_mantenimiento'] })])],
      m08: [
        S('ges_pla', 'Plan de emergencia y brigadas', [
          F('rg_ges_plan_emergencia', 'Plan de emergencia', 'Opción única', { req: true, opts: ['Entregado y vigente', 'Existe pero no se entregó', 'No existe'] }),
          F('rg_ges_plan_evaluacion', 'Evaluación del plan', 'Opción única', { opts: ['Adecuado', 'Parcial', 'Deficiente'], vis: { k: 'rg_ges_plan_emergencia', v: 'Entregado y vigente' } }),
          F('rg_ges_brigadas', '¿Tiene brigadas de emergencia?', 'Sí/No', { req: true, opts: SN, alias: 'inc_inp_bool_brigadas' }),
          F('rg_ges_simulacros', 'Simulacros', 'Opción única', { opts: ['En el último año', 'Hace más de un año', 'Nunca'] })], null,
          [E('ev_senal_evacuacion', { respalda: ['rg_ges_plan_evaluacion', 'rg_con_medios_egreso'] }), E('ev_punto_encuentro', { respalda: ['rg_ges_plan_evaluacion', 'rg_ges_simulacros'] }),
           D('rg_ges_doc_plan', 'Plan de emergencia', { respalda: ['rg_ges_plan_emergencia', 'rg_ges_plan_evaluacion'] }), D('rg_ges_doc_brigadas', 'Registro de brigadas y simulacros', { respalda: ['rg_ges_brigadas', 'rg_ges_simulacros'] })]),
        S('ges_ges', 'Orden, mantenimiento y certificaciones', [
          F('rg_ges_orden_aseo', 'Orden y aseo', 'Opción única', { req: true, ia: true, alias: 'inc_inp_bool_orden', opts: ['Excelente', 'Regular o parcial', 'Malo'] }),
          F('rg_ges_cert_gestion', '¿Tiene certificación de gestión?', 'Sí/No', { opts: SN }),
          F('rg_ges_cert_gestion_cual', '¿Cuál certificación?', 'Texto', { vis: { k: 'rg_ges_cert_gestion', v: 'Sí' } }),
          F('rg_ges_mant_equipos', '¿Hay mantenimiento de equipos?', 'Sí/No', { opts: SN }),
          F('rg_ges_trabajos_caliente', '¿Hay control de trabajos en caliente?', 'Sí/No', { opts: SN, na: true }),
          F('rg_ges_trabajos_altura', '¿Hay control de trabajos en altura?', 'Sí/No', { opts: SN, na: true }),
          F('rg_ges_cert_ambiental', '¿Tiene certificación ambiental?', 'Sí/No', { opts: SN, na: true }),
          F('rg_ges_cert_social', '¿Tiene certificación social?', 'Sí/No', { opts: SN, na: true })], null,
          [E('ev_orden_aseo', { req: 'si', min: 2, respalda: ['rg_ges_orden_aseo'] })])],
      m09: [
        S('bom_per', 'Permiso de funcionamiento', [
          F('rg_bom_permiso', 'Permiso de bomberos', 'Opción única', { req: true, opts: ['Vigente del año en curso', 'Vencido', 'No presentado'] }),
          F('rg_bom_vigencia', 'Vigencia del permiso', 'Fecha', { origen: 'IA', fuente: 'Lectura del documento' })], null,
          [D('rg_bom_doc_permiso', 'Permiso de bomberos', { alias: 'fotodoc_inp_carga_permiso_bomberos', req: { giros: ['Comercial', 'Industrial', 'Servicios', 'HORECA', 'Educación', 'Estación de servicios'] }, respalda: ['rg_bom_permiso', 'rg_bom_vigencia'] })]),
        S('bom_est', 'Estación más cercana', [
          F('rg_bom_estacion', 'Estación de bomberos', 'Texto', EXT),
          F('rg_bom_distancia', 'Distancia a la estación', 'Opción única', Object.assign({ opts: ['Menos de 1 km', '1 a 5 km', 'Más de 5 km'] }, EXT)),
          F('rg_bom_tiempo', 'Tiempo de respuesta', 'Opción única', Object.assign({ opts: ['Menos de 5 min', '5 a 10 min', 'Más de 10 min'] }, EXT))])],
      m10: [
        S('sin_his', 'Historial de siniestros', [
          F('rg_sin_siniestros', 'Siniestros registrados', 'Grilla', Object.assign({ cols: ['Ramo', 'Fecha', 'Estado (Reportado, Liquidado, Pagado, Pago parcial)', 'Monto (USD)'], nota: 'Filas desde el contexto externo' }, SCVS2)),
          F('rg_sin_declarado', 'Siniestralidad declarada', 'Texto', { nota: 'Lo que informa el entrevistado' }),
          F('rg_sin_cantidad_5_anios', 'Siniestros en los últimos 5 años', 'Cálculo', { ro: true, formula: 'Cuenta de filas de la grilla con fecha en los últimos 5 años' })])],
      m11: [
        S('pmp_esc', 'Escenario', [
          F('rg_pmp_escenario', 'Descripción del escenario', 'Texto', { req: true, origen: 'IA', ia: true, nota: 'Texto redactado' }),
          F('rg_pmp_afectacion', 'Afectación del valor asegurable', 'Opción única', { req: true, opts: ['0–20 %', '20–40 %', '40–60 %', '60–80 %', '80–100 %'] }),
          F('rg_pmp_interrupcion', '¿Hay interrupción del negocio?', 'Sí/No', { opts: SN }),
          F('rg_pmp_paralizacion', 'Tiempo de paralización', 'Opción única', { opts: ['Menos de 1 mes', '1 a 3 meses', '3 a 6 meses', '6 a 9 meses', 'Más de 9 meses'], vis: { k: 'rg_pmp_interrupcion', v: 'Sí' } })], LIBRE('esc', 'escenario'))],
      m12: [
        S('cnc_con', 'Conclusiones', [
          F('rg_cnc_agravantes', 'Factores agravantes', 'Texto', { origen: 'IA', ia: true, alias: 'conclusiones_inp_factores_agravantes', formula: 'Lista desde los criterios en las dos bandas más bajas', nota: 'Lista calculada más texto redactado' }),
          F('rg_cnc_atenuantes', 'Factores atenuantes', 'Texto', { origen: 'IA', ia: true, alias: 'conclusiones_inp_factores_atenuantes', formula: 'Lista desde los criterios en la banda más alta', nota: 'Lista calculada más texto redactado' }),
          F('rg_cnc_resumen', 'Resumen ejecutivo', 'Texto', { req: true, origen: 'IA', ia: true, alias: 'conclusiones_inp_resumen_ejecutivo', nota: 'Texto redactado' }),
          F('rg_cnc_recomendacion_inspector', 'Recomendación del inspector', 'Texto', { nota: 'No influye en la calificación' })])],
      m05: [
        S('con_dat', 'Datos', [
          F('rg_con_nombre', 'Nombre de la edificación', 'Texto', { req: true }),
          F('rg_con_area', 'Área', 'Número', { req: true, unidad: 'm²' }),
          F('rg_con_descripcion', 'Descripción', 'Texto', { origen: 'IA', ia: true, nota: 'Texto redactado' })], EDIF,
          [E('ev_fachada', { req: 'si', min: 1, porInstancia: true, respalda: ['rg_con_pisos', 'rg_con_conservacion', 'rg_con_paredes'] })]),
        S('con_alt', 'Altura', [
          F('rg_con_pisos', 'Número de pisos', 'Opción única', { req: true, opts: ['1–3', '4–6', 'Más de 6'] }),
          F('rg_con_altura_m', 'Altura', 'Número', { unidad: 'm' }),
          F('rg_con_subsuelos', 'Subsuelos', 'Opción única', { opts: ['Sin subsuelos', '1', '2 o más'] })], EDIF),
        S('con_eda', 'Edad y conservación', [
          F('rg_con_anio_construccion', 'Año de construcción', 'Número'),
          F('rg_con_edad', 'Edad', 'Cálculo', { ro: true, unidad: 'años', formula: 'Año actual − año de construcción' }),
          F('rg_con_conservacion', 'Estado de conservación', 'Opción única', { req: true, ia: true, alias: 'inc_inp_conservacion', opts: ['Excelente o nuevo', 'Bueno', 'Regular', 'Malo'] })], EDIF),
        S('con_mat', 'Materiales', [
          F('rg_con_paredes', 'Paredes', 'Opción única', { req: true, ia: true, alias: 'inc_inp_paredes', opts: ['Hormigón o bloque', 'Metálica con gypsum', 'Mixta', 'Madera o combustible'] }),
          F('rg_con_techo', 'Techo', 'Opción única', { req: true, ia: true, alias: 'inc_inp_techo', opts: ['Losa de hormigón', 'Metálico o teja', 'Traslúcido más de 30 %', 'Paja o madera'] }),
          F('rg_con_estructura', 'Estructura', 'Opción única', { ia: true, opts: ['Hormigón armado', 'Acero protegido', 'Acero sin protección', 'Madera', 'Mixta'] }),
          F('rg_con_entrepisos', 'Entrepisos', 'Opción única', { na: true, opts: ['Losa de hormigón', 'Metálico', 'Madera'] }),
          F('rg_con_resistencia_fuego', 'Resistencia al fuego', 'Opción única', { opts: ['RF 120', 'RF 90', 'RF 60', 'RF 30', 'Sin RF'] })], EDIF,
          [E('ev_estructura', { porInstancia: true, respalda: ['rg_con_estructura', 'rg_con_entrepisos'] }), E('ev_cubierta_interior', { req: 'si', min: 1, porInstancia: true, respalda: ['rg_con_techo'] })]),
        S('con_sep', 'Separación y egreso', [
          F('rg_con_dist_edificio_cercano', 'Distancia al edificio más cercano', 'Número', { unidad: 'm' }),
          F('rg_con_medios_egreso', 'Medios de egreso', 'Opción única', { req: true, ia: true, alias: 'inc_inp_bool_medios_egreso', opts: ['Existen y libres', 'No existen u obstruidos'] })], EDIF,
          [E('ev_medios_egreso', { porInstancia: true, respalda: ['rg_con_medios_egreso'] })]),
        S('con_cie', 'Cierre', [
          F('rg_con_observaciones', 'Observaciones', 'Texto', { origen: 'IA', ia: true, nota: 'Texto redactado' }),
          F('rg_con_preexistencias', 'Preexistencias', 'Texto', { nota: 'Alimenta las preexistencias del caso' })], EDIF)],
      m06: [
        S('ele_chk', 'Lista de verificación', CHK.map(([l, pol, na], i) => F('rg_ele_chk_' + String(i + 1).padStart(2, '0'), l, 'Sí/No', { req: true, opts: SN, pol: pol || '+', na: !!na, aplica: na ? NA_GIRO : '' })), null,
          [E('ev_tablero_principal', { req: 'si', min: 1, respalda: CHR(...rango(1, 9), 16, 17) }), E('ev_tablero_secundario', { porInstancia: true, respalda: CHR(...rango(1, 5), ...rango(7, 9)) }), E('ev_puesta_tierra', { respalda: CHR(6) }), E('ev_senal_procedimientos', { respalda: CHR(7, 15) }), E('ev_seguridad_ocupacional', { respalda: CHR(...rango(10, 13)) })]),
        S('ele_man', 'Mantenimiento', [
          F('rg_ele_mantenimiento', 'Tipo de mantenimiento', 'Opción única', { req: true, alias: 'inc_inp_mantenimiento', opts: ['Predictivo o termografía', 'Preventivo con bitácora', 'Correctivo', 'Ninguno'] }),
          F('rg_ele_ultima_termografia', 'Fecha de la última termografía', 'Fecha', { vis: { k: 'rg_ele_mantenimiento', v: 'Predictivo o termografía' } })], null,
          [D('rg_ele_doc_bitacora', 'Bitácora de mantenimiento', { alias: 'fotodoc_inp_carga_bitacoras', respalda: ['rg_ele_mantenimiento', 'rg_ele_ultima_termografia'] }), D('rg_ele_doc_planos', 'Planos eléctricos', { alias: 'fotodoc_inp_carga_planos', respalda: CHR(14) })])],
      m07: [
        S('pci_ext', 'Extintores', [
          F('rg_pci_ext_existe', '¿Tiene extintores?', 'Sí/No', { req: true, opts: SN, alias: 'inc_inp_bool_extintores' }),
          F('rg_pci_extintores', 'Extintores', 'Grilla', { alias: 'inc_inp_extintores', cols: ['Agente (PQS, CO2, Agua, Agente limpio, Clase K)', 'Capacidad (lb)', 'Cantidad', 'Ubicación', 'Fecha de última recarga'], nota: 'Filas libres: el inspector usa «Agregar fila»', vis: { k: 'rg_pci_ext_existe', v: 'Sí' } }),
          F('rg_pci_tipo_riesgo', 'Tipo de riesgo según NFPA 10', 'Opción única', { opts: ['Ligero', 'Ordinario', 'Extra'] }),
          F('rg_pci_ext_requeridos', 'Extintores requeridos', 'Cálculo', { ro: true, formula: 'Área construida ÷ cobertura por tipo de riesgo (Ligero 278,7 m²)', nota: 'Cálculo normativo' }),
          F('rg_pci_ext_senalizados', '¿Están señalizados?', 'Sí/No', { opts: SN, ia: true, alias: 'inc_inp_bool_senial' }),
          F('rg_pci_ext_mantenimiento', 'Mantenimiento de extintores', 'Opción única', { ia: true, opts: ['Vigente con etiqueta', 'Vencido', 'Sin evidencia'] })], null,
          [E('ev_extintor', { req: { k: 'rg_pci_ext_existe', v: 'Sí' }, min: 1, respalda: ['rg_pci_extintores', 'rg_pci_ext_senalizados', 'rg_pci_ext_mantenimiento'] }), D('rg_pci_doc_certificado', 'Certificado de mantenimiento de extintores', { respalda: ['rg_pci_ext_mantenimiento'] })]),
        S('pci_det', 'Detección y alarma', [
          F('rg_pci_det_existe', '¿Tiene detección y alarma?', 'Sí/No', { req: true, opts: SN, alias: 'inc_inp_bool_existencia_alarma' }),
          F('rg_pci_det_tipo', 'Tipo de detección', 'Opción múltiple', { ia: true, alias: 'inc_inp_tipo_deteccion', opts: ['Humo', 'Temperatura', 'Llama', 'Gas', 'Pulsadores manuales'] }),
          F('rg_pci_det_instalados', 'Detectores instalados', 'Número'),
          F('rg_pci_det_requeridos', 'Detectores requeridos', 'Cálculo', { ro: true, formula: 'Área construida ÷ 84 m²', nota: 'Cálculo normativo' }),
          F('rg_pci_det_central', 'Central de alarma', 'Opción única', { opts: ['Centralizada, zonificada y supervisada', 'Local o manual', 'No tiene'] }),
          F('rg_pci_det_senales', 'Señales acústicas y ópticas en todas las zonas', 'Sí/No', { opts: SN })], null,
          [E('ev_detectores_central', { req: { k: 'rg_pci_det_existe', v: 'Sí' }, min: 1, respalda: ['rg_pci_det_tipo', 'rg_pci_det_central'] })]),
        S('pci_red', 'Red hídrica', [
          F('rg_pci_red_existe', '¿Tiene red hídrica?', 'Sí/No', { req: true, opts: SN, alias: 'inc_inp_bool_red_hidrica' }),
          F('rg_pci_red_tipo', 'Tipo de red', 'Opción múltiple', { alias: 'inc_inp_tipo_hidrico', opts: ['Rociadores', 'Gabinetes con bomba', 'Gabinetes sin bomba', 'Hidrantes'], vis: { k: 'rg_pci_red_existe', v: 'Sí' } }),
          F('rg_pci_reserva_m3', 'Reserva de agua', 'Número', { unidad: 'm³' }),
          F('rg_pci_reserva_exclusiva', '¿Reserva exclusiva para incendios?', 'Sí/No', { opts: SN })], null,
          [E('ev_gabinetes_rociadores', { req: { k: 'rg_pci_red_existe', v: 'Sí' }, min: 1, respalda: ['rg_pci_red_tipo'] })])],
      m01: [
        S('gen_ase', 'Asegurado y entrevista', [
          F('rg_gen_asegurado', 'Asegurado', 'Texto', { req: true, origen: 'Solicitud', locked: true, alias: 'dat_inp_asegurado' }),
          F('rg_gen_ruc', 'RUC', 'Texto', { req: true, origen: 'Solicitud', locked: true, alias: 'dat_inp_ruc', nota: '13 dígitos' }),
          F('rg_gen_representante_legal', 'Representante legal', 'Texto', SCVS),
          F('rg_gen_entrevistado', 'Nombre del entrevistado', 'Texto', { req: true, alias: 'dat_inp_entrevistado' }),
          F('rg_gen_cargo_entrevistado', 'Cargo del entrevistado', 'Texto', { req: true, alias: 'dat_inp_cargo_entrevista' }),
          F('rg_gen_telefono', 'Teléfono', 'Texto', { alias: 'dat_inp_telefono' }),
          F('rg_gen_email', 'Correo electrónico', 'Texto', { alias: 'dat_inp_email' }),
          F('rg_gen_tipo_propiedad', 'Tipo de propiedad', 'Opción única', { req: true, opts: ['Propio', 'Arrendado', 'Comodato'], alias: 'dat_inp_tipo_propiedad' }),
          F('rg_gen_anio_inicio', 'Año de inicio de operaciones', 'Número', { req: true, alias: 'dat_inp_anio_operaciones' })]),
        S('gen_lab', 'Información laboral', [
          F('rg_gen_personal', 'Personal por categoría', 'Grilla', { cols: ['Categoría', 'Número', 'Turnos', 'Horario inicio', 'Horario fin', 'Jornadas'], nota: 'Filas libres: el inspector usa «Agregar fila»' })]),
        S('gen_eco', 'Información económica', [
          F('rg_gen_giro', 'Tipo de riesgo (giro)', 'Catálogo', { req: true, origen: 'Solicitud', opts: GIROS, nota: 'Precargado desde el giro de la solicitud; el inspector puede corregirlo' }),
          F('rg_gen_ciiu', 'Ocupación (CIIU)', 'Catálogo', { req: true, alias: 'dat_inp_act_eco', nota: 'Catálogo CIIU' }),
          F('rg_gen_objeto_social', 'Objeto social', 'Texto', SCVS),
          F('rg_gen_fecha_constitucion', 'Fecha de constitución', 'Fecha', SCVS),
          F('rg_gen_situacion_legal', 'Situación legal', 'Texto', SCVS),
          F('rg_gen_perfil', 'Perfil del riesgo', 'Texto', { origen: 'IA', ia: true, nota: 'Texto redactado' })])],
      m02: [
        S('ubi_geo', 'Ubicación geográfica', [
          F('rg_ubi_direccion', 'Dirección', 'Texto', { req: true, origen: 'Solicitud', alias: 'dat_inp_direccion' }),
          F('rg_ubi_parroquia', 'Parroquia', 'Texto'),
          F('rg_ubi_canton', 'Cantón', 'Catálogo', { req: true }),
          F('rg_ubi_provincia', 'Provincia', 'Catálogo', { req: true, alias: 'dat_inp_provincia' }),
          F('rg_ubi_latitud', 'Latitud', 'Número', { req: true, alias: 'dat_inp_latitud', nota: 'Desde el GPS de las fotos o el mapa' }),
          F('rg_ubi_longitud', 'Longitud', 'Número', { req: true, alias: 'dat_inp_longitud', nota: 'Desde el GPS de las fotos o el mapa' }),
          F('rg_ubi_altitud', 'Altitud', 'Número', { origen: 'Contexto externo', unidad: 'm s. n. m.' })]),
        S('ubi_pre', 'Predio y edificaciones', [
          F('rg_ubi_area_predio', 'Área del predio', 'Número', { unidad: 'm²' }),
          F('rg_ubi_num_edificaciones', 'Número de edificaciones', 'Cálculo', { ro: true, formula: 'Cuenta de edificaciones en Descripción constructiva' }),
          F('rg_ubi_area_construccion', 'Área de construcción', 'Cálculo', { ro: true, unidad: 'm²', formula: 'Suma de las áreas en Descripción constructiva' }),
          F('rg_ubi_dist_mar', 'Distancia al mar', 'Número', { origen: 'Contexto externo', unidad: 'm', nota: 'Distancia geográfica' }),
          F('rg_ubi_dist_rio', 'Distancia al río', 'Número', { origen: 'Contexto externo', unidad: 'm', nota: 'Distancia geográfica' })], null,
          [E('ev_vista_satelital', { req: 'si', min: 1, respalda: ['rg_ubi_latitud', 'rg_ubi_longitud', 'rg_ubi_area_predio'] })])],
      m03: [
        S('lin', 'Lindero', [
          F('rg_lin_tipo_riesgo', 'Tipo de riesgo colindante', 'Catálogo', { req: true, ia: true, opts: ['Vía pública', 'Vivienda o riesgo ligero', 'Comercio', 'Industria', 'Baldío', 'Río o quebrada', 'Otro'] }),
          F('rg_lin_descripcion', 'Descripción', 'Texto', { alias: LIN.map(x => 'inc_inp_' + x.toLowerCase()).join(' · '), nota: 'El alias cambia según el lindero' }),
          F('rg_lin_altura_colindante', 'Altura del colindante', 'Opción única', { na: true, opts: ['1–2 pisos', '3–5 pisos', 'Más de 5'], nota: 'No aplica si es vía pública' }),
          F('rg_lin_tipo_estructura', 'Tipo de estructura', 'Catálogo', { na: true, ia: true, opts: ['Hormigón armado', 'Mampostería confinada', 'Metálica', 'Madera', 'Mixta'] }),
          F('rg_lin_distancia', 'Distancia al colindante', 'Número', { req: true, unidad: 'm' }),
          F('rg_lin_dist_min_colapso', 'Distancia mínima por colapso', 'Cálculo', { ro: true, unidad: 'm', formula: 'Por definir', nota: 'Cálculo normativo' }),
          F('rg_lin_dist_min_golpeteo', 'Distancia mínima por golpeteo', 'Cálculo', { ro: true, unidad: 'm', formula: 'Por definir', nota: 'Cálculo normativo' })], FIJO(LIN),
          [E('ev_lindero', { req: 'si', min: 1, porInstancia: true, respalda: ['rg_lin_tipo_riesgo', 'rg_lin_altura_colindante', 'rg_lin_tipo_estructura', 'rg_lin_distancia'] })])],
      m04: [
        S('nat_zon', 'Zona sísmica', [
          F('rg_nat_zona_sismica', 'Zona sísmica y factor Z', 'Texto', { origen: 'Contexto externo', ro: true, nota: 'Zona y factor Z según el cantón' })]),
        S('nat_amz', 'Amenazas', [
          F('rg_nat_exposicion', 'Exposición', 'Opción única', { req: true, na: true, opts: ['Baja', 'Media', 'Alta'] }),
          F('rg_nat_descripcion', 'Descripción de la amenaza', 'Texto', { origen: 'IA', ia: true, nota: 'Texto redactado' }),
], FIJO(AMZ),
          [E('ev_mapa_amenaza', { porInstancia: true, respalda: ['rg_nat_exposicion'], ia: false })]),
        S('nat_ray', 'Protección contra rayos', [
          F('rg_nat_pararrayos', '¿Tiene pararrayos?', 'Sí/No', { opts: ['Sí', 'No'] }),
          F('rg_nat_requiere_pararrayos', '¿Requiere pararrayos?', 'Sí/No', { opts: ['Sí', 'No'] }),
          F('rg_nat_justificacion_pararrayos', 'Justificación', 'Texto', { req: true, vis: { k: 'rg_nat_requiere_pararrayos', v: 'No' } })])],
    };
  })();
  const MOD_PREF = { m01: 'rg_gen_', m02: 'rg_ubi_', m03: 'rg_lin_', m04: 'rg_nat_', m05: 'rg_con_', m06: 'rg_ele_', m07: 'rg_pci_', m08: 'rg_ges_', m09: 'rg_bom_', m10: 'rg_sin_', m11: 'rg_pmp_', m12: 'rg_cnc_', m13: 'rg_rob_', m14: 'rg_dyv_', m15: 'rg_ee_', m16: 'rg_ocu_', m17: 'rg_pro_', m18: 'rg_alm_', m19: 'rg_cmb_', m20: 'rg_maq_', m21: 'rg_bmb_', m22: 'rg_trc_' };
  window.SIRIUS_EJEMPLO = {
    // Lista única de ramos. grupo: Vehículos · Ramos de ubicación · Equipo móvil. inspeccionable: solo esos aparecen en SIRIUS (lo decide el Administrador; pantalla futura en Catálogos). estado: Vigente · Inactivo. Un ramo nuevo se agrega solo aquí.
    // La Bandeja y Nueva solicitud usan todos los inspeccionables; las pantallas de Ramos Generales (ramosRG) además filtran por grupo.
    // Lista única de ramos (S10a-2). grupo: catálogo editable "Grupos de ramos". tipoObjeto: del sistema (Vehículo · Ubicación · Equipo móvil), define cómo se arma el informe; no se edita.
    gruposRamos: ['Vehículos', 'Ramos Generales'],
    ramos: [['Vehículos', 'Vehículos', 'Vehículo', true], ['Incendio y líneas aliadas', 'Ramos Generales', 'Ubicación', true], ['Robo', 'Ramos Generales', 'Ubicación', true], ['Dinero y valores', 'Ramos Generales', 'Ubicación', true], ['Equipo electrónico', 'Ramos Generales', 'Ubicación', true], ['Rotura de maquinaria', 'Ramos Generales', 'Ubicación', true], ['Todo riesgo construcción', 'Ramos Generales', 'Ubicación', true], ['Responsabilidad civil', 'Ramos Generales', 'Ubicación', false], ['Transporte', 'Ramos Generales', 'Ubicación', false], ['Fidelidad', 'Ramos Generales', 'Ubicación', false], ['Equipo y maquinaria', 'Ramos Generales', 'Equipo móvil', true]].map(([nombre, grupo, tipoObjeto, inspeccionable]) => ({ nombre, grupo, tipoObjeto, inspeccionable, estado: 'Vigente' })),
    ramosSirius() { return this.ramos.filter(r => r.inspeccionable && r.estado === 'Vigente'); },
    ramosDe(...tipos) { return this.ramosSirius().filter(r => tipos.includes(r.tipoObjeto)).map(r => r.nombre); },
    // Líneas de negocio de Aseguradora del Sur: catálogo propio, independiente del ramo. Solo las que admiten inspecciones aparecen en Nueva solicitud.
    lineasNegocio: [['Corporativos', true], ['Personas', true], ['Automotriz', true], ['Cuentas Públicas', true], ['IFIS', true], ['Fianzas', false]].map(([nombre, admiteInspecciones]) => ({ nombre, admiteInspecciones, estado: 'Vigente' })),
    lineasInspeccion() { return this.lineasNegocio.filter(l => l.admiteInspecciones && l.estado === 'Vigente').map(l => l.nombre); },
    get ramosRG() { return this.ramosDe('Ubicación', 'Equipo móvil'); },
    // Inspectores de ejemplo. La facultad efectiva se calcula en Niveles de calificación (Interno hereda la del tipo de inspector).
    inspectores: [
      { n: 'Marco Tapia', tipo: 'Interno', ag: '' },
      { n: 'Cristian Vaca', tipo: 'Interno', ag: '' },
      { n: 'Paola Vinueza', tipo: 'Interno', ag: '', g: 'F' },
      { n: 'Luis Andrade', tipo: 'Externo', ag: '' },
      { n: 'Diana Cárdenas', tipo: 'Agencia', ag: 'Eurosurvey' },
      { n: 'Jorge Pazmiño', tipo: 'Agencia', ag: 'Inspecciones Andinas' },
      { n: 'Mauricio Endara', tipo: 'Agencia', ag: 'Eurosurvey' }, // etapa 15-2: red de inspectores (facultad de su agencia en la app)
      { n: 'Sofía Arteaga', tipo: 'Agencia', ag: 'Inspecciones Andinas', g: 'F' },
    ],
    // Flujo de autoinspección (lo edita Formularios › Autoinspección; Coordinación toma de aquí la vigencia del enlace).
    autoinspeccion: { vigenciaDias: 10, recordatorioDias: 2, reintentos: 3,
      // Etapa 12b · flujo del portal del cliente (Formularios › Autoinspección, anexo 7.4): pasos en orden y si están activos.
      flujo: [['bienvenida', 'Bienvenida y consentimiento de datos', true], ['identidad', 'Validación de identidad', true], ['datos', 'Confirmación de datos del vehículo', true], ['fotos', 'Pasos de foto', true], ['video', 'Video de recorrido', false], ['declaracion', 'Declaración del cliente', true], ['envio', 'Envío', true]],
      contactoCompania: { telefono: '1800 278 466 (ejemplo)', correo: 'servicio.cliente@asur.ec (ejemplo)', horario: 'lunes a viernes de 08:00 a 18:00' },
      // Etapa 12d-2 · extras declarados en la solicitud (DEC-156): el portal los muestra con «Declarado en la solicitud».
      extrasDeclarados: { '20186': ['Aros de aleación', 'Cubre balde', 'Radio con pantalla'] },
      // Etapa 12d-3 · autoinspección cerrada de ejemplo de 20186 (escenas calctrl…): lo que dejó el registro en vivo del portal, con las lecturas
      // (valor, confianza, lecturas que coinciden, origen), la validación de capa 1 y el motor de verificación por paso (simulado), la ubicación
      // de cada foto, el video, los extras y la cronología. Los controles y sus alertas se calculan con SIRIUS_AUTOINSPECCION.controles.
      resultados: {
        '20186': { caso: '20186', riesgo: '20186-V1', visita: 'V1', tipo: 'camioneta', abierto: '2026-10-18T19:40', cerrada: '2026-10-18T20:22', declaracion: 'Jorge Villacís Mora',
          solicitud: { placa: 'GSC7810', vin: 'MPATFS86JLT004512', km: 74200 },
          tipoCambios: [{ at: '2026-10-18T19:43', de: 'SUV o Jeep', a: 'Camioneta', fotos: 0 }],
          fotos: [
            { paso: 'exteriores_frontal', at: '2026-10-18T19:44', gps: { lat: -2.17032, lng: -79.92215, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, lectura: { campo: 'Placa frontal', valor: 'GSC7810', conf: 96, lecturas: [5, 5], origen: 'Celular' }, motor: { coincide: true, conf: 97, motivo: 'Frente completo con la placa visible' } },
            { paso: 'exteriores_lateral_izquierdo', at: '2026-10-18T19:47', gps: { lat: -2.17035, lng: -79.92219, prec: 9 }, validacion: 'Rechazada y usada igual', regla: 'Proporción 1,25 (un lateral pide más de 1,45)', rechazos: 2, encuadre: 'verificado', pantalla: 6, motor: { coincide: true, conf: 81, motivo: 'Lateral izquierdo; la foto corta la parte trasera del balde' } },
            { paso: 'exteriores_posterior', at: '2026-10-18T19:49', gps: { lat: -2.17038, lng: -79.92212, prec: 7 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 3, lectura: { campo: 'Placa posterior', valor: 'G5C781O', conf: 71, lecturas: [3, 5], origen: 'Motor de extracción' }, motor: { coincide: true, conf: 94, motivo: 'Posterior con la placa; reflejo sobre dos caracteres' } },
            { paso: 'exteriores_lateral_derecho', at: '2026-10-18T19:51', gps: { lat: -2.17031, lng: -79.92209, prec: 10 }, validacion: 'Aprobada', encuadre: 'no verificado', pantalla: 5, motor: { coincide: true, conf: 92, motivo: 'Lateral derecho completo' } },
            { paso: 'motor_habitaculo_del_motor', at: '2026-10-18T19:53', gps: { lat: -2.16826, lng: -79.92196, prec: 12 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 7, motor: { coincide: true, conf: 90, motivo: 'Motor con el capó abierto' } },
            { paso: 'identificacion_vin', at: '2026-10-18T19:55', gps: { lat: -2.17033, lng: -79.92214, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 2, lectura: { campo: 'VIN', valor: 'MPATFS86JLT004512', conf: 93, lecturas: [4, 5], origen: 'Celular' }, motor: { coincide: true, conf: 95, motivo: 'VIN grabado en la pared de fuego' } },
            { paso: 'interiores_kilometraje', at: '2026-10-18T19:57', gps: { lat: -2.17034, lng: -79.92216, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 9, lectura: { campo: 'Kilometraje', valor: '74250', conf: 88, lecturas: [3, 3], origen: 'Motor de extracción' }, motor: { coincide: true, conf: 91, motivo: 'Odómetro digital encendido' } },
            { paso: 'interiores_tablero_completo', at: '2026-10-18T20:09', gps: { lat: -2.17032, lng: -79.92217, prec: 9 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 11, motor: { coincide: true, conf: 89, motivo: 'Volante y tablero completos' } },
            { paso: 'interiores_tablero_central', at: '2026-10-18T20:11', gps: { lat: -2.17031, lng: -79.92215, prec: 9 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 72, motor: { coincide: false, conf: 58, motivo: 'Patrón de píxeles y brillo uniforme: parece una foto de otra pantalla' } },
            { paso: 'llanta_emergencia', at: '2026-10-18T20:12', gps: { lat: -2.17029, lng: -79.92220, prec: 140 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 3, motor: { coincide: true, conf: 87, motivo: 'Llanta de emergencia completa' } },
            { paso: 'extra:Aros de aleación', at: '2026-10-18T20:13', gps: { lat: -2.17036, lng: -79.92218, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, motor: { coincide: true, conf: 90, motivo: 'Aro de aleación de 17″' } },
            { paso: 'extra:Neblineros', at: '2026-10-18T20:14', gps: { lat: -2.17033, lng: -79.92213, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 5, motor: { coincide: true, conf: 86, motivo: 'Neblinero delantero derecho' } },
            { paso: 'documentos_matricula_frontal', at: '2026-10-18T20:15', gps: { lat: -2.17032, lng: -79.92214, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 6, motor: { coincide: true, conf: 96, motivo: 'Matrícula, cara frontal' } },
            { paso: 'documentos_matricula_posterior', at: '2026-10-18T20:15', gps: { lat: -2.17032, lng: -79.92214, prec: 8 }, validacion: 'Lectura no lograda', regla: 'Sin lectura de la vigencia por reflejo', encuadre: 'verificado', pantalla: 5, motor: { coincide: true, conf: 64, motivo: 'Matrícula, cara posterior; reflejo sobre la vigencia' } },
            { paso: 'documentos_licencia_frontal', at: '2026-10-18T20:16', gps: { lat: -2.17032, lng: -79.92214, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, motor: { coincide: true, conf: 95, motivo: 'Licencia de conducir, cara frontal' } },
            { paso: 'documentos_licencia_posterior', at: '2026-10-18T20:17', gps: { lat: -2.17032, lng: -79.92214, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, motor: { coincide: true, conf: 93, motivo: 'Licencia de conducir, cara posterior' } },
          ],
          video: { at: '2026-10-18T20:19', seg: 31, bytes: 8703180, vuelta: 285, gps: { lat: -2.17032, lng: -79.92215, prec: 9 } },
          extras: [
            { nombre: 'Aros de aleación', decl: true, valor: 900, r: 'si', det: { Marca: 'Enkei', 'Rin (pulgadas)': '17' }, foto: 'extra:Aros de aleación' },
            { nombre: 'Cubre balde', decl: true, valor: 650, r: 'no', motivo: 'Lo retiré' },
            { nombre: 'Radio con pantalla', decl: true, valor: 450, r: 'si', det: { Marca: 'Pioneer', Modelo: 'DMH-1770' }, nota: 'Se ve en la foto «Tablero central con radio»' },
            { nombre: 'Neblineros', decl: false, r: 'si', det: { Marca: 'Hella' }, foto: 'extra:Neblineros' },
          ],
          danos: [{ pieza: 'Puerta trasera izquierda', tipo: 'Rayón', gravedad: 'Moderado', foto: 'exteriores_lateral_izquierdo', conf: 82 }],
          eventos: [
            ['2026-10-18T19:40', 'acceso', 'Abrió el enlace de autoinspección'], ['2026-10-18T19:40', 'acceso', 'Confirmó «Soy yo»'], ['2026-10-18T19:41', 'acceso', 'Aceptó los consentimientos (datos: sí · WhatsApp: sí · SMS: no)'],
            ['2026-10-18T19:41', 'permiso', 'Permitió la ubicación (precisión de 8 m)'], ['2026-10-18T19:42', 'tipo', 'Eligió el tipo: SUV o Jeep'], ['2026-10-18T19:43', 'tipo', 'Cambió el tipo: SUV o Jeep → Camioneta (0 fotos borradas)'], ['2026-10-18T19:43', 'permiso', 'Permitió la cámara'],
            ['2026-10-18T19:46', 'validacion', 'Foto rechazada por validación en «Lateral izquierdo»: Proporción 1,25 (un lateral pide más de 1,45)'], ['2026-10-18T19:47', 'validacion', 'Foto rechazada otra vez en «Lateral izquierdo»; usó la foto igual'],
            ['2026-10-18T19:58', 'acceso', 'Salió y guardó el avance (7 de 10 fotos · 0 de 4 documentos)'], ['2026-10-18T20:08', 'acceso', 'Retomó la inspección (7 de 10 fotos · 0 de 4 documentos)'],
            ['2026-10-18T20:13', 'extra', 'Respondió el extra «Aros de aleación»: Lo tengo (Enkei, 17″)'], ['2026-10-18T20:13', 'extra', 'Respondió el extra «Cubre balde»: No lo tengo (Lo retiré)'], ['2026-10-18T20:13', 'extra', 'Respondió el extra «Radio con pantalla»: Lo tengo (Pioneer DMH-1770)'], ['2026-10-18T20:14', 'extra', 'Agregó el extra «Neblineros» (no estaba declarado)'],
            ['2026-10-18T20:15', 'validacion', 'Lectura no lograda en «Matrícula posterior»: continuó con su foto'],
            ['2026-10-18T20:18', 'video', 'Empezó a grabar el video'], ['2026-10-18T20:19', 'video', 'Subió el video de 360° (31 s, 8,3 MB, vuelta de 285°)'],
            ['2026-10-18T20:21', 'envio', 'Aceptó la declaración (Jorge Villacís Mora)'], ['2026-10-18T20:22', 'envio', 'Envió la inspección · Autoinspección cerrada'],
          ] },
      },
      // Etapa 12d-3c · autoinspección de ejemplo del equipo 20204-E2 (excavadora Komatsu PC210LC-11, derivado a Suscripción). Solo la cargan las escenas calctrlsusc… (el caso 20204 no se muestra con controles en las demás).
      escenasEquipos: {
        '20204': { caso: '20204', riesgo: '20204-E2', visita: 'V1', tipo: 'equipo', abierto: '2026-10-15T13:00', cerrada: '2026-10-15T13:41', declaracion: 'Gabriela Andrade Toapanta',
          solicitud: {}, tipoCambios: [],
          fotos: [
            { paso: 'equipo_frontal', nombre: 'Frente del equipo', sec: 'Equipo', at: '2026-10-15T13:02', gps: { lat: -0.46605, lng: -76.98702, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, motor: { coincide: true, conf: 90, motivo: 'Frente del equipo' } },
            { paso: 'equipo_lateral_izquierdo', nombre: 'Lateral izquierdo', sec: 'Equipo', at: '2026-10-15T13:05', gps: { lat: -0.46608, lng: -76.98698, prec: 9 }, validacion: 'Rechazada y usada igual', encuadre: 'verificado', pantalla: 4, regla: 'Proporción 1,18 (un lateral pide más de 1,45)', rechazos: 2, motor: { coincide: true, conf: 79, motivo: 'Lateral izquierdo; la foto corta el contrapeso' } },
            { paso: 'equipo_posterior', nombre: 'Parte posterior', sec: 'Equipo', at: '2026-10-15T13:08', gps: { lat: -0.46611, lng: -76.98705, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, motor: { coincide: true, conf: 90, motivo: 'Parte posterior' } },
            { paso: 'equipo_lateral_derecho', nombre: 'Lateral derecho', sec: 'Equipo', at: '2026-10-15T13:10', gps: { lat: -0.46603, lng: -76.98699, prec: 10 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 4, motor: { coincide: true, conf: 90, motivo: 'Lateral derecho' } },
            { paso: 'equipo_placa_pin', nombre: 'Placa del fabricante (PIN)', sec: 'Equipo', at: '2026-10-15T13:12', gps: { lat: -0.46606, lng: -76.98701, prec: 8 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 5, motor: { coincide: true, conf: 93, motivo: 'Placa del fabricante con el PIN legible' } },
            { paso: 'equipo_horometro', nombre: 'Horómetro', sec: 'Equipo', at: '2026-10-15T13:14', gps: { lat: -0.46604, lng: -76.98703, prec: 9 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 71, motor: { coincide: false, conf: 57, motivo: 'Patrón de píxeles y brillo uniforme: parece una foto de otra pantalla' } },
            { paso: 'equipo_cabina', nombre: 'Cabina y tablero', sec: 'Equipo', at: '2026-10-15T13:16', gps: { lat: -0.46605, lng: -76.98700, prec: 9 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 6, motor: { coincide: true, conf: 90, motivo: 'Cabina y tablero' } },
            { paso: 'equipo_cuchara', nombre: 'Cuchara e implemento', sec: 'Equipo', at: '2026-10-15T13:31', gps: { lat: -0.46228, lng: -76.98690, prec: 11 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 3, motor: { coincide: true, conf: 88, motivo: 'Cuchara de 1,2 m³ con desgaste normal' } },
            { paso: 'equipo_hidraulico', nombre: 'Cilindros hidráulicos', sec: 'Equipo', at: '2026-10-15T13:33', gps: { lat: -0.46606, lng: -76.98702, prec: 9 }, validacion: 'Aprobada', encuadre: 'verificado', pantalla: 3, motor: { coincide: true, conf: 90, motivo: 'Cilindros hidráulicos' } },
            { paso: 'equipo_tren_rodaje', nombre: 'Tren de rodaje (orugas)', sec: 'Equipo', at: '2026-10-15T13:36', gps: { lat: -0.46607, lng: -76.98704, prec: 9 }, validacion: 'Aprobada', encuadre: 'no verificado', pantalla: 4, motor: { coincide: true, conf: 90, motivo: 'Tren de rodaje (orugas)' } },
          ],
          video: { at: '2026-10-15T13:39', seg: 38, bytes: 9856000, vuelta: 240, gps: { lat: -0.46605, lng: -76.98701, prec: 9 } },
          extras: [], danos: [],
          eventos: [
            ['2026-10-15T13:00', 'acceso', 'Abrió el enlace de autoinspección'], ['2026-10-15T13:00', 'acceso', 'Confirmó «Soy yo»'], ['2026-10-15T13:01', 'permiso', 'Permitió la ubicación (precisión de 8 m)'], ['2026-10-15T13:01', 'permiso', 'Permitió la cámara'],
            ['2026-10-15T13:05', 'validacion', 'Foto rechazada por validación en «Lateral izquierdo»: Proporción 1,18 (un lateral pide más de 1,45)'], ['2026-10-15T13:06', 'validacion', 'Foto rechazada otra vez en «Lateral izquierdo»; usó la foto igual'],
            ['2026-10-15T13:18', 'acceso', 'Salió y guardó el avance (7 de 10 fotos)'], ['2026-10-15T13:29', 'acceso', 'Retomó la inspección (7 de 10 fotos)'],
            ['2026-10-15T13:38', 'video', 'Empezó a grabar el video'], ['2026-10-15T13:39', 'video', 'Subió el video de 360° (38 s, 9,4 MB, vuelta de 240°)'],
            ['2026-10-15T13:41', 'envio', 'Aceptó la declaración (Gabriela Andrade Toapanta)'], ['2026-10-15T13:41', 'envio', 'Envió la inspección · Autoinspección cerrada'],
          ] },
      },
      tiempoEstimado: '15 a 20 minutos', aMano: ['El vehículo, en un lugar con buena luz y espacio para rodearlo', 'Tu cédula', 'La matrícula del vehículo', 'Tu licencia de conducir', 'El celular con batería y datos'],
      consentimiento: { datos: { titulo: 'Tratamiento de tus datos personales', texto: 'Aseguradora del Sur usará tus datos, las fotos y su ubicación solo para inspeccionar el vehículo y emitir tu póliza. Puedes pedir acceso, corrección o eliminación de tus datos cuando quieras.', pendiente: 'Texto provisional · pendiente de definición LOPDP' },
        whatsapp: 'Quiero recibir avisos de mi inspección por WhatsApp', sms: 'Quiero recibir avisos de mi inspección por SMS' },
      identidad: { digitos: 6, intentos: 3, reenviarSeg: 60, codigoPrueba: '482913' },
      declaracion: 'Declaro que las fotos son del vehículo indicado, que las tomé hoy en el lugar registrado y que la información que entrego es verdadera. Sé que una declaración falsa puede dejar sin efecto la cobertura.',
      // Enlaces de ejemplo (?token= en Portal.dc.html). Los que se envían desde Coordinación se crean en la sesión.
      enlaces: [
        // 20186: enlace de 10 días enviado el 18/10 a las 19:30 (escenas portal…); «Enviar enlace de autoinspección» en Coordinación crea uno nuevo en la sesión.
        { token: '20186-AI', caso: '20186', riesgo: '20186-V1', visita: 'V1', envio: '2026-10-18T19:30', vence: '2026-10-28T19:30', contacto: { nombre: 'Jorge Villacís Mora', cargo: 'Jefe de flota', cedula: '0915234870', cel: '0987123470' } },
        // 20152: enlace de 48 horas enviado el 13/10 que venció sin envío; el caso volvió a coordinación (escena portalcaducado).
        { token: '20152-AI', caso: '20152', riesgo: '20152-R1', visita: 'V1', envio: '2026-10-13T09:00', vence: '2026-10-15T09:00', contacto: { nombre: 'Luis Fernando Cevallos', cargo: 'Asegurado', cedula: '0923456781', cel: '0991825530' } },
      ],
      // Lectura automática simulada por paso (dato y confianza). Se compara con la solicitud y avisa sin bloquear.
      lecturas: { identificacion_placa_delantera: { campo: 'Placa', valor: 'GSC7810', conf: 94 }, identificacion_placa_trasera: { campo: 'Placa', valor: 'GSC7810', conf: 91 }, identificacion_chasis_en_relieve: { campo: 'VIN', valor: 'MPATFS86JLT004512', conf: 88 },
        identificacion_sticker_vin: { campo: 'VIN', valor: 'MPATFS86JLT004512', conf: 93 }, identificacion_plaqueta_panoramica_vi: { campo: 'VIN', valor: 'MPATFS86JLT004512', conf: 86 }, interiores_kilometraje: { campo: 'Kilometraje', valor: '74.230 km', conf: 90 },
        documentos_matricula_frontal: { campo: 'Matrícula · placa', valor: 'GSC7810', conf: 95 }, documentos_matricula_posterior: { campo: 'Matrícula · propietario', valor: 'Transportes del Litoral S.A.', conf: 92 }, documentos_cedula_frontal: { campo: 'Cédula', valor: '0915234870', conf: 96 },
        documentos_cedula_posterior: { campo: 'Cédula · nombre', valor: 'Jorge Villacís Mora', conf: 90 }, documentos_licencia_frontal: { campo: 'Licencia · tipo', valor: 'B', conf: 89 }, documentos_licencia_posterior: { campo: 'Licencia · vigencia', valor: '12/03/2029', conf: 87 } },
      // Posible daño que el sistema detecta en la foto lateral derecha (simulado): pide la foto de cerca (SIRIUS_CAPTURA.danos.fotoDeCerca).
      danoSimulado: { foto: 'exteriores_lateral_derecho_de_ade', zona: 'puerta_delantera_der', pieza: 'Puerta delantera derecha', confianza: 68 } },
    // ---------- Etapa 14 · Portal del cliente del caso (DEC-171) ----------
    // Enlace único del caso (mismo formato que DEC-146) para presencial y virtual guiada: Mi inspección, Agenda y Documentos.
    // zona: la del riesgo para los cupos de la Agenda (si falta, la sucursal del caso). 20152 está en Quito (dirección de SIRIUS_PORTAL_CLIENTE.ejemplo).
    portalCliente: {
      enlaces: [
        { token: 'Pq3Lm8Tz5Rk2Wn7Vb4Xc9d', caso: '20152', riesgo: '20152-R1', modalidad: 'Presencial', zona: 'Quito Norte', direccion: 'Av. 6 de Diciembre N34-120 y Portugal, Quito', referencia: 'Edificio Torre Azul, parqueadero subsuelo 2', vehiculo: 'Kia Rio 2023', gps: [-0.1836, -78.4807], envio: '2026-10-17T10:20', contacto: { nombre: 'Luis Fernando Cevallos', cargo: 'Asegurado', cel: '0991825530' } },
        { token: 'Rg5Hv8Wq2Mx7Tn4Lc9Pz1s', caso: '20190', riesgo: '20190-R1', modalidad: 'Presencial', zona: 'Quito Norte', direccion: 'Av. General Enríquez y Río Santiago, Sangolquí', referencia: 'Bodega de Farmacias del Valle, portón gris', gps: [-0.3317, -78.4479], envio: '2026-10-16T09:30', contacto: { nombre: 'Gabriela Ortega', cargo: 'Jefa de compras', cel: '0987654321' } }, // etapa 14b · Ramos Generales
        // Etapa 15-1 · 20186 pidió en el portal una visita presencial en La Carolina: es la oferta de la red de la app del inspector (SIRIUS_APP_INSPECTOR.ejemplo).
        { token: 'Cr8Kd3Nw6Qy1Ft5Hm2Lp7v', caso: '20186', riesgo: '20186-V1', modalidad: 'Presencial', zona: 'Quito Norte', direccion: 'Av. Amazonas N36-152 y Naciones Unidas, La Carolina, Quito', referencia: 'Patio de Transportes del Litoral, ingreso por la calle lateral', vehiculo: 'Chevrolet D-Max 2020', gps: [-0.1765, -78.4847], envio: '2026-10-19T09:10', contacto: { nombre: 'Jorge Villacís Mora', cargo: 'Jefe de flota', cel: '0987123470' } },
        { token: 'Gr6Tn2Qw9Lp4Zx7Hc3Vm8k', caso: '20178', riesgo: '20178-R1', modalidad: 'Presencial', envio: '2026-09-07T11:10', contacto: { nombre: 'Patricia Andrade Ruiz', cargo: 'Administradora de la clínica', cel: '0987654321' } },
      ],
      // Documentos pedidos al cliente (origen: devolucion, ejecutivo, extra). Las garantías de Ramos Generales salen del seguimiento del caso (Garantías).
      origenes: { devolucion: 'Pedido en una devolución', ejecutivo: 'Pedido por tu ejecutivo', extra: 'Factura o soporte de un extra declarado', garantia: 'Garantía de tu póliza' },
      documentos: {
        '20152': [
          { id: 'D1', nombre: 'Matrícula del vehículo', detalle: 'Frente y reverso', origen: 'ejecutivo', pidio: 'Daniela Ruiz', pedido: '2026-10-17T10:30', estado: 'Pendiente', caras: ['matricula_frente', 'matricula_reverso'], marco: 'tarjeta' },
          { id: 'D2', nombre: 'Licencia de conducir', detalle: 'Frente y reverso', origen: 'ejecutivo', pidio: 'Daniela Ruiz', pedido: '2026-10-17T10:30', caras: ['licencia_frente', 'licencia_reverso'], marco: 'tarjeta', estado: 'Volver a subir', motivo: 'La foto está borrosa: vuelve a tomarla con buena luz.', archivo: { nombre: 'licencia.jpg', bytes: 1843200, at: '2026-10-17T19:12' }, revisado: ['Daniela Ruiz', '2026-10-18T09:40'] },
          { id: 'D3', nombre: 'Factura de los aros de aleación', detalle: '', origen: 'extra', opcional: true, pidio: 'Daniela Ruiz', pedido: '2026-10-17T10:30', caras: ['factura_extra'], marco: 'a4', digital: true, estado: 'En revisión', archivo: { nombre: 'factura-aros.pdf', bytes: 412672, at: '2026-10-18T12:40' } },
          { id: 'D4', nombre: 'Cédula del propietario', detalle: 'Frente y reverso', origen: 'ejecutivo', pidio: 'Daniela Ruiz', pedido: '2026-10-17T10:30', caras: ['cedula_frente', 'cedula_reverso'], marco: 'tarjeta', estado: 'Aceptado', archivo: { nombre: 'cedula.jpg', bytes: 1310720, at: '2026-10-17T19:10' }, revisado: ['Daniela Ruiz', '2026-10-18T09:38'] },
        ],
        // Etapa 14b · Ramos Generales (20190): documentos en hoja A4; el inventario es digital y admite PDF.
        '20190': [
          { id: 'D1', nombre: 'Croquis de la bodega', detalle: 'Accesos, extintores y puertas', origen: 'ejecutivo', pidio: 'Daniela Ruiz', pedido: '2026-10-16T10:00', estado: 'Pendiente', caras: ['croquis'], marco: 'a4' },
          { id: 'D2', nombre: 'Inventario valorizado', detalle: 'Último corte de inventario', origen: 'ejecutivo', pidio: 'Daniela Ruiz', pedido: '2026-10-16T10:00', estado: 'Pendiente', caras: ['inventario'], marco: 'a4', digital: true },
        ],
      },
      // Etapa 14b · nombre de cada cara para la cámara guiada y destino de sus campos en el formulario (SIRIUS_PORTAL_CLIENTE.documentos.campos usa claves cortas).
      caras: { matricula_frente: 'Matrícula · frente', matricula_reverso: 'Matrícula · reverso', licencia_frente: 'Licencia · frente', licencia_reverso: 'Licencia · reverso', cedula_frente: 'Cédula · frente', cedula_reverso: 'Cédula · reverso', factura_extra: 'Factura', croquis: 'Croquis', inventario: 'Inventario' },
      destinos: { veh_placa: 'veh_placa', veh_vin: 'veh_vin', veh_anio: 'veh_anio_modelo', prop_identificacion: 'veh_identificacion_propietario', mat_caducidad: 'veh_vigencia_matricula', lic_numero: 'veh_cedula_conductor', lic_categoria: 'veh_tipo_licencia', lic_vencimiento: 'veh_caducidad_licencia', ext_factura_valor: null },
      etiquetas: { veh_placa: 'Placa', veh_vin: 'VIN o chasis', veh_anio: 'Año del modelo', prop_identificacion: 'Identificación del propietario', mat_caducidad: 'Vigencia de la matrícula', lic_numero: 'Cédula del conductor', lic_categoria: 'Tipo de licencia', lic_vencimiento: 'Caducidad de la licencia', ext_factura_valor: 'Valor de la factura del extra' },
      // Lectura simulada de cada cara (valor y confianza) en el prototipo; en producción la confirma el motor de extracción de SIRIUS.
      lecturas: {
        '20152': { matricula_frente: { veh_placa: ['GSE1120', 97], veh_vin: ['KNADN512AP6123457', 84], veh_anio: ['2023', 96] }, matricula_reverso: { prop_identificacion: ['0923456781', 93], mat_caducidad: ['14/03/2027', 55] },
          licencia_frente: { lic_numero: ['0923456781', 92], lic_categoria: ['B', 95], lic_vencimiento: ['12/08/2030', 74] }, factura_extra: { ext_factura_valor: ['USD 640,00', 91] } },
        '20186': { matricula_frente: { veh_placa: ['GSC7810', 96], veh_vin: ['MPATFS86JLT004512', 92], veh_anio: ['2020', 95] }, matricula_reverso: { prop_identificacion: ['0915234870', 94], mat_caducidad: ['30/06/2027', 88] } },
      },
      // Escena docalerta: el ejecutivo de 20186 pidió la matrícula por el portal y el cliente la subió (la identificación no coincide con la solicitud).
      escenas: { docalerta: { caso: '20186', documentos: [{ id: 'D1', nombre: 'Matrícula del vehículo', detalle: 'Frente y reverso', origen: 'ejecutivo', pidio: 'Verónica Lema', pedido: '2026-10-18T19:50', estado: 'Pendiente', caras: ['matricula_frente', 'matricula_reverso'], marco: 'tarjeta' }] } },
    },
    // Reglas de envío a calificación (Niveles de calificación las edita; el informe las evalúa).
    reglas: [
      {id: 'r1', name: 'Vehículos de alto valor', desc: '', sys: false, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'El valor sugerido del casco supera USD 40.000. Revisa el valor comercial y los extras.', desde: '2026-10-01', hasta: '', active: true, 'n30':14, mod: {d: '2026-10-01', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'valor_sug', op: 'mayor', a: '40000', b: '', list: []}]}]},
      {id: 'r2', name: 'Antigüedad mayor a 10 años', desc: '', sys: false, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'El vehículo tiene más de 10 años. Revisa su estado general y la asegurabilidad.', desde: '2026-10-01', hasta: '', active: true, 'n30':22, mod: {d: '2026-10-01', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'antig', op: 'mayor', a: '10', b: '', list: []}]}]},
      {id: 'r3', name: 'Kilometraje alto', desc: '', sys: false, scope: 'veh', form: 'Vehículos livianos', ver: 'Ambos', root: 'all', motivo: 'El kilometraje supera los 200.000 km.', desde: '2026-10-01', hasta: '', active: true, 'n30':6, mod: {d: '2026-10-01', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'km', op: 'mayor', a: '200000', b: '', list: []}]}]},
      {id: 'r4', name: 'Kilometraje inconsistente', desc: 'Detecta odómetros alterados o mal registrados.', sys: false, scope: 'veh', form: 'Vehículos livianos', ver: 'Ambos', root: 'all', motivo: 'El kilometraje es menor a 1.000 km en un vehículo de más de 2 años. Verifica la foto del tablero.', desde: '2026-10-01', hasta: '', active: true, 'n30':2, mod: {d: '2026-10-14', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'km', op: 'menor', a: '1000', b: '', list: []}, {v: 'antig', op: 'mayor', a: '2', b: '', list: []}]}]},
      {id: 'r5', name: 'Diferencia de valor', desc: '', sys: false, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'El valor sugerido del casco difiere más del 10 % del valor asegurado del casco. Posible infraseguro o sobreseguro.', desde: '2026-10-01', hasta: '', active: true, 'n30':9, mod: {d: '2026-10-01', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'any', conds: [{v: 'dif', op: 'mayor', a: '10', b: '', list: []}, {v: 'dif', op: 'menor', a: '-10', b: '', list: []}]}]},
      {id: 'r6', name: 'Blindados', desc: '', sys: false, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'Vehículo blindado. Revisa el certificado, el nivel y el proveedor del blindaje.', desde: '2026-10-01', hasta: '', active: true, 'n30':3, mod: {d: '2026-10-01', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'blindaje', op: 'igual', a: 'Sí', b: '', list: []}]}]},
      {id: 'r7', name: 'Sucursal Guayaquil · marcas de alto robo', desc: '', sys: false, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'Marca con alta siniestralidad por robo en Guayaquil.', desde: '2026-10-01', hasta: '', active: false, 'n30':0, mod: {d: '2026-10-09', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'sucursal', op: 'igual', a: 'Guayaquil', b: '', list: []}, {v: 'marca', op: 'está en la lista', a: '', b: '', list: ['Toyota', 'Chevrolet', 'Kia', 'Hyundai']}]}]},
      {id: 'r8', name: 'Vehículo sin contrato de compraventa', desc: 'Cuando el propietario de la matrícula no es el asegurado y no hay contrato.', sys: false, scope: 'veh', form: 'Vehículos livianos', ver: 'Ambos', root: 'all', motivo: 'No hay contrato de compraventa que respalde el interés asegurable.', desde: '2026-10-01', hasta: '', active: true, 'n30':7, mod: {d: '2026-10-02', by: 'Andrea Salazar'}, review: {field: '¿Presenta contrato de compraventa?', key: 'veh_contrato_compraventa', form: 'Vehículos livianos', version: 2, others: 'versión 1'}, groups: [{mode: 'all', conds: [{v: 'contrato', op: 'igual', a: 'No', b: '', list: []}]}]},
      {id: 'r9', name: 'Autoinspección', desc: 'La autoinspección la realiza el cliente: no hay inspector que pueda determinar.', sys: false, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'Inspección realizada por el cliente mediante autoinspección. Requiere calificación del Ejecutivo de inspecciones.', desde: '2026-10-01', hasta: '', active: true, 'n30':18, mod: {d: '2026-10-01', by: 'Andrea Salazar'}, review: null, groups: [{mode: 'all', conds: [{v: 'modalidad', op: 'igual', a: 'Autoinspección', b: '', list: []}]}]},
      {id: 's1', name: 'Discrepancias entre fuentes', desc: '', sys: true, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'Hay datos con discrepancia entre fuentes sin resolver.', desde: '2026-10-01', hasta: '', active: true, 'n30':11, mod: {d: '2026-09-15', by: 'Sistema'}, review: null, groups: [{mode: 'all', conds: [{v: 'discrep', op: 'mayor', a: '0', b: '', list: []}]}]},
      {id: 's2', name: 'Fotos cargadas desde galería', desc: '', sys: true, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'Una o más fotos se cargaron desde la galería y no desde la cámara.', desde: '2026-10-01', hasta: '', active: true, 'n30':4, mod: {d: '2026-09-15', by: 'Sistema'}, review: null, groups: [{mode: 'all', conds: [{v: 'galeria', op: 'mayor', a: '0', b: '', list: []}]}]},
      {id: 's3', name: 'Verificación externa con novedad', desc: '', sys: true, scope: 'veh', form: 'Todos los formularios', ver: 'Ambos', root: 'all', motivo: 'Una verificación externa (Fiscalía, ANT, SRI u otra) devolvió novedad.', desde: '2026-10-01', hasta: '', active: true, 'n30':5, mod: {d: '2026-09-15', by: 'Sistema'}, review: null, groups: [{mode: 'all', conds: [{v: 'vext', op: 'igual', a: 'Sí', b: '', list: []}]}]},
    ],
    // Facultad del inspector por tipo de riesgo: valor global y excepciones.
    facultades: {veh: {fac: 'Sin facultad', mue: 10, exc: [{id: 'e1', level: 'tipo', name: 'Interno', fac: 'Determinar Asegurable y No asegurable', mue: '', desde: '2026-10-01', hasta: '', by: 'Andrea Salazar'}, {id: 'e2', level: 'agencia', name: 'Eurosurvey', fac: 'Determinar solo Asegurable', mue: '', desde: '2026-10-01', hasta: '', by: 'Andrea Salazar'}, {id: 'e3', level: 'insp', name: 'Paola Vinueza', fac: 'Determinar solo Asegurable', mue: 25, desde: '2026-10-01', hasta: '2026-12-31', by: 'Andrea Salazar'}, {id: 'e4', level: 'insp', name: 'Luis Andrade', fac: 'Determinar Asegurable y No asegurable', mue: '', desde: '2026-10-15', hasta: '', by: 'Andrea Salazar'}]}}, // etapa C2-3 · e4: el independiente Luis Andrade determina desde el back-office (DEC-180)
    // Catálogos del informe.
    catalogos: {
      sucursales: SUC,
      // Ciudades sin oficina propia: sucursal que las atiende (Administración › Catálogos).
      ciudadSucursal: [{ ciudad: 'Otavalo', prov: 'Imbabura', sucursal: 'Ibarra' }],
      motivosNoInspeccion: ['Vehículo 0 km con factura del concesionario', 'Renovación sin cambios con inspección vigente', 'Vehículo inspeccionado en otra póliza en los últimos 30 días', 'Excepción autorizada por suscripción'],
      extras: ['Aros de aleación', 'Láminas de seguridad', 'Neblineros', 'Estribos', 'Barra antivuelco', 'Cubre balde', 'Radio con pantalla', 'Cámara de retro', 'Sensores de parqueo', 'Portaequipaje', 'Sistema de sonido'],
      coberturas: ['Todo riesgo', 'Pérdida total', 'Daños propios y RC'],
      motivosNoAsegurable: ['Daños preexistentes no reparados', 'Estado general fuera de política', 'Documentación inconsistente', 'Modificaciones no declaradas', 'Uso no permitido por la póliza'],
      piezas: ['Parachoques delantero', 'Parachoques posterior', 'Capó', 'Guardafango delantero izquierdo', 'Guardafango delantero derecho', 'Guardafango posterior izquierdo', 'Guardafango posterior derecho', 'Puerta delantera izquierda', 'Puerta delantera derecha', 'Puerta posterior izquierda', 'Puerta posterior derecha', 'Techo', 'Compuerta o maletero', 'Parabrisas', 'Faro delantero izquierdo', 'Faro delantero derecho', 'Retrovisor izquierdo', 'Retrovisor derecho'],
      danos: ['Rayón', 'Abolladura', 'Rotura', 'Corrosión', 'Faltante'],
      gravedad: ['Baja', 'Media', 'Alta'],
      verificacion: ['Sin novedad', 'Con novedad', 'Servicio no disponible'],
    },
    // Ramos Generales · Biblioteca de módulos (Formularios › Biblioteca de módulos). Solo estructura: secciones sin campos todavía.
    modulos: [
      ['m01', 'Información general del riesgo', 'Común', ['Datos del asegurado', 'Datos de la inspección', 'Giro del negocio']],
      ['m02', 'Ubicación', 'Común', ['Dirección', 'Geolocalización', 'Entorno']],
      ['m03', 'Linderos', 'Común', ['Lindero']],
      ['m04', 'Riesgos de la naturaleza', 'Común', ['Inundación', 'Deslizamiento', 'Sismo y actividad volcánica', 'Vientos']],
      ['m05', 'Descripción constructiva', 'Común', ['Estructura', 'Paredes', 'Cubierta', 'Pisos', 'Antigüedad y conservación']],
      ['m06', 'Sistema eléctrico', 'Común', ['Acometida y tableros', 'Cableado', 'Generación de respaldo', 'Mantenimiento']],
      ['m07', 'Protección contra incendios', 'Común', ['Extintores', 'Detección y alarma', 'Red de hidrantes', 'Rociadores']],
      ['m08', 'Planes de gestión', 'Común', ['Plan de emergencia', 'Brigadas', 'Simulacros']],
      ['m09', 'Cuerpo de bomberos', 'Común', ['Estación más cercana', 'Tiempo de respuesta', 'Permiso de funcionamiento']],
      ['m10', 'Siniestralidad', 'Común', ['Siniestros anteriores', 'Medidas adoptadas']],
      ['m11', 'Estimación de pérdidas', 'Común', ['Escenario', 'Pérdida máxima probable', 'Pérdida máxima posible']],
      ['m12', 'Conclusiones', 'Común', ['Recomendaciones', 'Garantías', 'Opinión del inspector']],
      ['m13', 'Seguridad física (Robo)', 'Por ramo', ['Accesos', 'Cerraduras y rejas', 'Alarma y monitoreo', 'Guardianía', 'Videovigilancia']],
      ['m14', 'Dinero y valores', 'Por ramo', ['Caja fuerte', 'Manejo de efectivo', 'Transporte de valores']],
      ['m15', 'Equipo electrónico', 'Por ramo', ['Inventario de equipos', 'Protección eléctrica', 'Climatización', 'Mantenimiento']],
      ['m16', 'Ocupación', 'Por actividad', ['Actividad', 'Personal y turnos', 'Horario de operación']],
      ['m17', 'Procesos', 'Por actividad', ['Descripción del proceso', 'Riesgos del proceso']],
      ['m18', 'Almacenamiento', 'Por actividad', ['Bodega', 'Tipo de mercadería', 'Disposición y altura']],
      ['m19', 'Combustibles e inflamables', 'Por actividad', ['Inventario', 'Almacenamiento', 'Manipulación']],
      ['m20', 'Maquinaria', 'Por actividad', ['Inventario de maquinaria', 'Mantenimiento', 'Antigüedad']],
      ['m21', 'Sistema de bombas', 'Por actividad', ['Bombas contra incendios', 'Reservorio', 'Pruebas de funcionamiento']],
      ['m22', 'Todo riesgo construcción', 'Por ramo', []],
    ].map(([id, nombre, categoria, secciones]) => { const est = MOD_CAMPOS[id]; return { id, nombre, categoria, prefijo: MOD_PREF[id], version: 1, estado: 'Vigente', desde: '2026-10-18', borrador: null, secciones: est ? est.map(s => s.nombre) : secciones, estructura: est || null,
      nota: id === 'm12' ? 'El puntaje, la banda y las garantías no son campos de este módulo: salen de Modelos de calificación y de Garantías.' : id === 'm22' ? 'Este módulo no tiene criterios de calificación: se llena y aparece en el informe, pero no afecta la calificación hasta configurarlos.' : '', compania: 'Aseguradora del Sur' }; }),
    // Etiquetas de evidencia: catálogo compartido (Formularios › Etiquetas de evidencia). descIA orienta a la IA al clasificar las fotos del set libre.
    etiquetasEvidencia: [
      ['ev_vista_satelital', 'Vista satelital', 'Imagen aérea o satelital del predio con sus límites y los predios vecinos visibles.'],
      ['ev_lindero', 'Lindero', 'Vista desde el predio hacia uno de sus límites, con el colindante completo y la separación visible.'],
      ['ev_mapa_amenaza', 'Mapa de referencia de amenaza', 'Mapa oficial de amenaza natural (sísmica, inundación, volcánica u otra) con el predio ubicado.'],
      ['ev_fachada', 'Fachada', 'Fachada exterior completa de una edificación, de esquina a esquina, con todos sus pisos.'],
      ['ev_estructura', 'Estructura y entrepisos', 'Columnas, vigas o losas de entrepiso visibles desde el interior.'],
      ['ev_cubierta_interior', 'Cubierta interior', 'Cubierta vista desde el interior, con su material y la estructura de soporte.'],
      ['ev_medios_egreso', 'Medios de egreso', 'Salida de emergencia, puerta o ruta de evacuación, con su señalización.'],
      ['ev_tablero_principal', 'Tablero principal abierto', 'Tablero eléctrico principal con la tapa abierta, breakers y cableado visibles.'],
      ['ev_tablero_secundario', 'Tablero secundario', 'Tablero eléctrico secundario, abierto o cerrado, con su rotulación.'],
      ['ev_puesta_tierra', 'Puesta a tierra', 'Varilla, barra o conexión del sistema de puesta a tierra.'],
      ['ev_senal_procedimientos', 'Señalización y procedimientos', 'Señales de riesgo eléctrico o procedimientos de emergencia exhibidos junto a los equipos.'],
      ['ev_seguridad_ocupacional', 'Seguridad eléctrica ocupacional', 'EPP dieléctrico, herramientas aisladas, zonas de aproximación o candados y tarjetas de bloqueo.'],
      ['ev_extintor', 'Extintor', 'Extintor completo, con su etiqueta de recarga legible y su señalización.'],
      ['ev_detectores_central', 'Detectores y central', 'Detector de humo, temperatura o llama instalado, o el panel de la central de alarma.'],
      ['ev_gabinetes_rociadores', 'Gabinetes o rociadores', 'Gabinete contra incendios abierto, hidrante o rociadores instalados en el techo.'],
      ['ev_senal_evacuacion', 'Señalización de evacuación', 'Señales de ruta de evacuación o de salida de emergencia instaladas.'],
      ['ev_punto_encuentro', 'Punto de encuentro', 'Punto de encuentro señalizado, exterior a las edificaciones.'],
      ['ev_cerramiento', 'Cerramiento', 'Cerramiento perimetral de un lindero: muro, reja o malla, con su altura y protección adicional.'],
      ['ev_puertas_acceso', 'Puertas de acceso', 'Puerta de acceso exterior con su protección: blindaje, rejas o láminas.'],
      ['ev_ventanas', 'Ventanas', 'Ventanas exteriores con su protección: rejas, láminas o blindaje.'],
      ['ev_camaras', 'Cámaras', 'Cámara de CCTV instalada o monitor con las vistas de las cámaras.'],
      ['ev_central_alarma', 'Central de alarma', 'Panel o teclado de la alarma de intrusión, o sus sensores instalados.'],
      ['ev_garita_guardia', 'Garita o guardia', 'Garita de vigilancia o guardia en su puesto.'],
      ['ev_caja_fuerte', 'Caja fuerte', 'Caja fuerte o resguardo de efectivo, con su anclaje visible.'],
      ['ev_area_caja', 'Área de caja', 'Ventanilla o área de caja, con sus vidrios y controles de seguridad.'],
      ['ev_cuarto_tecnico', 'Cuarto técnico', 'Vista general del cuarto técnico o de servidores.'],
      ['ev_rack_servidores', 'Rack o servidores', 'Rack, servidores o equipos de comunicaciones con su cableado.'],
      ['ev_ups', 'UPS', 'UPS o banco de baterías con su placa visible.'],
      ['ev_climatizacion', 'Climatización', 'Equipo de climatización o termómetro e higrómetro del área.'],
      ['ev_extintor_cuarto', 'Extintor del cuarto técnico', 'Extintor ubicado dentro o junto al cuarto de servidores o equipos.'],
      ['ev_linea_proceso', 'Línea de proceso', 'Vista de una línea o área de producción con sus equipos y operación.'],
      ['ev_bodega', 'Bodega', 'Vista general del interior de una bodega con su mercadería y pasillos.'],
      ['ev_apilamiento', 'Apilamiento', 'Mercadería apilada que muestra su altura y la separación al techo.'],
      ['ev_area_combustibles', 'Área de combustibles', 'Área donde se almacenan o trasvasan combustibles o inflamables, con sus recipientes.'],
      ['ev_cilindros_glp', 'Cilindros de GLP', 'Cilindros o tanque de GLP con su ubicación y ventilación visibles.'],
      ['ev_maquinaria', 'Maquinaria', 'Máquina fija completa en su lugar de operación, con guardas visibles.'],
      ['ev_placa_datos', 'Placa de datos', 'Placa de identificación de una máquina con marca, modelo, serie o potencia legibles.'],
      ['ev_cuarto_bombas', 'Cuarto de bombas', 'Vista del cuarto de bombas contra incendios con las bombas instaladas.'],
      ['ev_tablero_bombas', 'Tablero de control de bombas', 'Tablero de control de las bombas contra incendios con su selector y luces.'],
      ['ev_tanque_reserva', 'Tanque de reserva', 'Tanque o cisterna de reserva de agua para incendios.'],
      ['ev_frente_obra', 'Frente de obra', 'Vista general del frente de obra que muestra su avance y la maquinaria en uso.'],
      ['ev_almacen_materiales', 'Almacén de materiales', 'Bodega o patio donde se guardan los materiales de la obra.'],
      ['ev_equipos', 'Equipo electrónico', 'Equipo electrónico asegurado con su marca, modelo o placa de serie visibles.'],
      ['ev_orden_aseo', 'Orden y aseo', 'Vista general de un área de trabajo o bodega que muestra su orden y limpieza.'],
    ].map(([id, nombre, descIA]) => ({ id, nombre, descIA, estado: 'Vigente', compania: 'Aseguradora del Sur' })),
    // Plantillas modulares de Ramos Generales. regla: cuándo se activa el módulo en un caso · rep: bloque repetible.
    plantillasRG: { 'Ubicación – Ramos Generales v1': { id: 'f4', nombre: 'Ubicación – Ramos Generales', version: 1, estado: 'Vigente', desde: '2026-10-18', tipo: 'Ramos Generales', tipoObjeto: 'Ubicación', alcance: 'Ramos de ubicación', modoCaptura: 'Libre', compania: 'Aseguradora del Sur', mod: '2026-10-18', by: 'Andrea Salazar',
      modulos: (() => { // campos: activación por respuesta de un campo ({ k, l, op: '=' | 'incluye', vals }).
        const txt = (g, r, c) => { const p = []; if (g.length) p.push('Giro ' + g.join(' o ')); if (r.length) p.push((p.length ? 'si ' : 'Solo si ') + 'el caso incluye ' + r.join(' o ')); (c || []).forEach(x => p.push((p.length ? 'si ' : 'Solo si ') + x.l + ' ' + x.op + ' ' + x.vals.join(' o '))); return p.length ? p.join(', o ') : 'Siempre'; };
        const C = (giros, ramos, campos) => ({ tipo: giros.length ? 'giro' : ramos.length ? 'ramo' : (campos || []).length ? 'campo' : 'siempre', giros, ramos, campos: campos || [], texto: txt(giros, ramos, campos) }), S = C([], []), IC = ['Industrial', 'Comercial'];
        const reglas = { m13: C([], ['Robo']), m14: C([], ['Dinero y valores']), m15: C([], ['Equipo electrónico']), m17: C(IC, []), m18: C(IC, []), m19: C(IC, []), m22: C([], ['Todo riesgo construcción']), m20: C(['Industrial'], ['Rotura de maquinaria']), m21: C(['Industrial', 'Estación de servicios'], [], [{ k: 'rg_pci_red_tipo', l: 'Tipo de red', op: 'incluye', vals: ['Rociadores', 'Gabinetes con bomba'] }]) };
        const rep = { m03: { tipo: 'fijo', texto: '4 fijos: Norte, Sur, Este, Oeste', items: ['Norte', 'Sur', 'Este', 'Oeste'] }, m05: { tipo: 'libre', texto: 'Por edificación' }, m18: { tipo: 'libre', texto: 'Por bodega' }, m11: { tipo: 'libre', texto: 'Por escenario' } };
        return ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm22', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21'].map(id => ({ id, regla: reglas[id] || S, rep: rep[id] || null })); })() } },
    // Plantillas de informe: secciones de cada versión (Formularios y la pestaña Informe leen de aquí).
    plantillas: { 'Vehículos livianos v1': { nombre: 'Vehículos livianos', version: 1, pasos: PASOS, campos: {
        ins: [
          {k: 'veh_fecha_hora_inspeccion', l: 'Fecha y hora de inspección', t: 'Fecha', req: 'PVA', locked: true, src: ['Extracción automática'], help: 'Se toma de los metadatos de las fotos.'},
          {k: 'veh_modalidad_realizada', l: 'Modalidad realizada', t: 'Catálogo', req: 'PVAD', locked: true, src: ['Solicitud'], opts: ['Presencial', 'Virtual guiada', 'Autoinspección', 'Documental'], help: 'Precargada de la visita.'},
          {k: 'veh_agencia', l: 'Sucursal', t: 'Catálogo', req: 'PV', src: ['Solicitud'], fix: true, opts: SUC, help: 'Se toma de la solicitud; no se edita en el informe.'},
          {k: 'veh_inspector_ejecuto', l: 'Inspector que ejecutó', t: 'Catálogo', req: 'PV', locked: true, src: ['Solicitud'], opts: ['Marco Tapia', 'Luis Andrade', 'Diana Cárdenas']},
          {k: 'veh_persona_atiende', l: 'Persona que atiende', t: 'Texto', req: 'P', lmax: 120},
          {k: 'veh_relacion_asegurado', l: 'Relación con el asegurado', t: 'Catálogo', req: 'P', opts: ['Asegurado', 'Familiar', 'Empleado', 'Conductor', 'Otro']},
          {k: 'veh_fecha_hora_carga', l: 'Fecha y hora de carga', t: 'Fecha', locked: true, sys: true, by: {P: 'Back-office',V: 'Back-office',A: 'Back-office',D: 'Back-office'}, help: 'Campo del sistema: se registra al cargar el informe y no se edita.'}
        ],
        veh: [
          {k: 'veh_placa', l: 'Placa', t: 'Texto', code: 'VEH_PLACA', req: 'PVAD', src: ['Solicitud', 'Servicio de placas', 'Extracción automática'], fmt: 'Placa', rules: true},
          {k: 'veh_marca', l: 'Marca', t: 'Catálogo', code: 'VEH_MARCA', req: 'PVAD', src: ['Servicio de placas', 'Extracción automática'], opts: ['Chevrolet', 'Kia', 'Hyundai', 'Toyota', 'Mazda', 'Renault', 'Nissan']},
          {k: 'veh_modelo', l: 'Modelo o versión', t: 'Catálogo', code: 'VEH_MODELO', req: 'PVAD', src: ['Servicio de placas', 'Extracción automática'], opts: ['Onix LT', 'Sportage LX', 'Tucson GL', 'Hilux 4x4']},
          {k: 'veh_anio_modelo', l: 'Año del modelo', t: 'Número', code: 'VEH_ANIO', req: 'PVAD', src: ['Servicio de placas'], min: 1980, max: 2027, rules: true},
          {k: 'veh_vin', l: 'VIN o chasis', t: 'Texto', code: 'VEH_VIN', req: 'PVAD', src: ['Servicio de placas', 'Extracción automática'], fmt: 'VIN', lmax: 17},
          {k: 'veh_numero_motor', l: 'Motor', t: 'Texto', req: 'PV', src: ['Servicio de placas', 'Extracción automática']},
          {k: 'veh_tipo_carroceria', l: 'Tipo de carrocería', t: 'Catálogo', code: 'VEH_CARROCERIA', req: 'PVAD', src: ['Servicio de placas'], opts: ['Sedán', 'Hatchback', 'SUV', 'Camioneta cabina simple', 'Camioneta doble cabina', 'Otros']},
          {k: 'veh_clase', l: 'Clase', t: 'Catálogo', req: 'PV', src: ['Servicio de placas'], opts: ['Automóvil', 'Jeep', 'Camioneta', 'Furgoneta']},
          {k: 'veh_color', l: 'Color', t: 'Catálogo', req: 'PV', src: ['Servicio de placas', 'Extracción automática'], opts: ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul']},
          {k: 'veh_pais_origen', l: 'País de origen', t: 'Catálogo', src: ['Servicio de placas'], opts: ['Ecuador', 'Colombia', 'Corea del Sur', 'Japón', 'China', 'Brasil']},
          {k: 'veh_cilindraje', l: 'Cilindraje', t: 'Número', src: ['Servicio de placas'], min: 50, max: 8000, help: 'En centímetros cúbicos.'},
          {k: 'veh_pasajeros', l: 'Pasajeros', t: 'Número', src: ['Servicio de placas'], min: 1, max: 60},
          {k: 'veh_combustible', l: 'Combustible', t: 'Opción única', opts: ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico']},
          {k: 'veh_camv_cpn', l: 'CAMV o CPN', t: 'Texto', src: ['Servicio de placas']}
        ],
        mat: [
          {k: 'veh_nombre_matricula', l: 'Nombre en la matrícula', t: 'Texto', req: 'PVAD', src: ['Extracción automática']},
          {k: 'veh_identificacion_propietario', l: 'Identificación del propietario', t: 'Texto', req: 'PVAD', src: ['Solicitud', 'Extracción automática'], fmt: 'Cédula'},
          {k: 'veh_gad_matriculacion', l: 'GAD de matriculación', t: 'Catálogo', src: ['Extracción automática'], opts: ['Quito', 'Guayaquil', 'Cuenca', 'Manta']},
          {k: 'veh_anio_matricula', l: 'Año de la matrícula', t: 'Número', src: ['Extracción automática'], min: 1990, max: 2027},
          {k: 'veh_vigencia_matricula', l: 'Vigencia de la matrícula', t: 'Fecha', src: ['Extracción automática']},
          {k: 'veh_interes_asegurable', l: 'Interés asegurable', t: 'Opción única', req: 'PVD', opts: ['Propietario', 'Arrendatario', 'Acreedor prendario', 'Otro']},
          {k: 'veh_contrato_compraventa', l: '¿Presenta contrato de compraventa?', t: 'Sí/No', opts: ['Sí', 'No'], rules: true}
        ],
        uso: [
          {k: 'veh_uso', l: 'Uso', t: 'Opción única', req: 'PVA', src: ['Solicitud'], opts: ['Particular', 'Comercial', 'Público', 'Cuenta propia', 'Alquiler'], rules: true},
          {k: 'veh_ciudad_circulacion', l: 'Ciudad de circulación', t: 'Catálogo', req: 'PV', src: ['Solicitud', 'Cliente 360'], opts: ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato'], help: 'Buscador de cantones.'},
          {k: 'veh_anio_compra', l: 'Año de compra', t: 'Número', min: 1980, max: 2026},
          {k: 'veh_kilometraje', l: 'Kilometraje', t: 'Número', req: 'PVA', src: ['Extracción automática'], min: 0, max: 999999, rules: true, help: 'Lectura del odómetro, en km.'},
          {k: 'veh_kilometraje_anual', l: 'Kilometraje por año', t: 'Cálculo', f: '{veh_kilometraje} / MAX(1, AÑO(HOY()) - {veh_anio_compra})', help: 'Kilometraje dividido para los años transcurridos desde la compra (mínimo 1). Se recalcula al cambiar el kilometraje o el año de compra.'},
          {k: 'veh_conductor_habitual', l: 'Conductor habitual', t: 'Opción única', req: 'PVA', src: ['Cliente 360'], opts: ['Es el asegurado', 'Otra persona']},
          {k: 'veh_cedula_conductor', l: 'Cédula del conductor', t: 'Texto', req: 'PVA', fmt: 'Cédula', vis: {k: 'veh_conductor_habitual', v: 'Otra persona'}},
          {k: 'veh_nombre_conductor', l: 'Nombre del conductor', t: 'Texto', req: 'PVA', vis: {k: 'veh_conductor_habitual', v: 'Otra persona'}},
          {k: 'veh_edad_conductor', l: 'Edad del conductor', t: 'Número', min: 16, max: 99, vis: {k: 'veh_conductor_habitual', v: 'Otra persona'}},
          {k: 'veh_tipo_licencia', l: 'Tipo de licencia', t: 'Catálogo', src: ['Extracción automática'], opts: ['A', 'B', 'C', 'D', 'E', 'F', 'G']},
          {k: 'veh_caducidad_licencia', l: 'Caducidad de la licencia', t: 'Fecha', src: ['Extracción automática']},
          {k: 'veh_puntos_licencia', l: 'Puntos de la licencia', t: 'Número', min: 0, max: 30}
        ],
        ver: [
          {k: 'veh_verificacion_chasis_relieve', l: 'Número de chasis en relieve', t: 'Opción única', req: 'PV', opts: ['Verificado', 'No verificado', 'No aplica']},
          {k: 'veh_verificacion_sticker_vin', l: 'Sticker VIN', t: 'Opción única', req: 'PV', opts: ['Verificado', 'No verificado', 'No aplica']},
          {k: 'veh_verificacion_plaqueta_panoramica', l: 'Plaqueta panorámica', t: 'Opción única', req: 'PV', opts: ['Verificado', 'No verificado', 'No aplica']}
        ],
        acc: [
          {k: 'veh_telemetria', l: 'Telemetría', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_tipo_dispositivo', l: 'Tipo de dispositivo', t: 'Catálogo', opts: ['GPS', 'OBD', 'Cámara'], vis: {k: 'veh_telemetria', v: 'Sí'}},
          {k: 'veh_fecha_instalacion', l: 'Fecha de instalación', t: 'Fecha', vis: {k: 'veh_telemetria', v: 'Sí'}},
          {k: 'veh_voucher', l: 'Voucher', t: 'Texto', vis: {k: 'veh_telemetria', v: 'Sí'}},
          {k: 'veh_imei', l: 'IMEI', t: 'Texto', lmax: 15, vis: {k: 'veh_telemetria', v: 'Sí'}},
          {k: 'veh_id_dispositivo', l: 'ID del dispositivo', t: 'Texto', vis: {k: 'veh_telemetria', v: 'Sí'}},
          {k: 'veh_satelital', l: 'Satelital', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_proveedor_satelital', l: 'Proveedor satelital', t: 'Catálogo', opts: ['Hunter', 'Carseg', 'Otro'], vis: {k: 'veh_satelital', v: 'Sí'}},
          {k: 'veh_descripcion_satelital', l: 'Descripción del satelital', t: 'Texto', vis: {k: 'veh_satelital', v: 'Sí'}},
          {k: 'veh_blindaje', l: 'Blindaje', t: 'Sí/No', opts: ['Sí', 'No'], rules: true},
          {k: 'veh_proveedor_blindaje', l: 'Proveedor de blindaje', t: 'Texto', req: 'PV', vis: {k: 'veh_blindaje', v: 'Sí'}},
          {k: 'veh_nivel_blindaje', l: 'Nivel de blindaje', t: 'Opción única', req: 'PV', opts: ['I', 'IIA', 'II', 'IIIA', 'III', 'IV'], vis: {k: 'veh_blindaje', v: 'Sí'}},
          {k: 'veh_descripcion_blindaje', l: 'Descripción del blindaje', t: 'Texto', vis: {k: 'veh_blindaje', v: 'Sí'}},
          {k: 'veh_radio', l: 'Radio', t: 'Opción única', opts: ['No tiene', 'Fijo', 'Desmontable']},
          {k: 'veh_aros', l: 'Aros', t: 'Opción única', opts: ['Originales', 'Aluminio', 'Magnesio', 'Hierro']},
          {k: 'veh_cantidad_airbags', l: 'Airbags', t: 'Número', min: 0, max: 12, help: 'Cantidad.'},
          {k: 'veh_vidrios_electricos', l: 'Vidrios eléctricos', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_laminas_seguridad', l: 'Láminas de seguridad', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_aire_acondicionado', l: 'Aire acondicionado', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_neblineros', l: 'Neblineros', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_estribos', l: 'Estribos', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_parrilla', l: 'Parrilla', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_sunroof', l: 'Sunroof', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_techo_panoramico', l: 'Techo panorámico', t: 'Sí/No', opts: ['Sí', 'No']},
          {k: 'veh_camara_retro', l: 'Cámara de retro', t: 'Sí/No', opts: ['Sí', 'No']}
        ],
        neu: [
          {k: 'veh_neumaticos', l: 'Estado de neumáticos', t: 'Grilla', req: 'PV', src: ['Extracción automática'], cols: ['Posición', 'Marca', 'Medida', 'Labrado (mm)', 'Foto'], rows: ['Delantera izquierda', 'Delantera derecha', 'Trasera izquierda', 'Trasera derecha', 'Repuesto'], preex: true, help: 'Medida con el formato 205/55 R16. Labrado desde la foto con calibrador.', alertas: [{col: 'labrado', op: 'menor', a: 1.6, txt: 'Labrado bajo el mínimo'}]}
        ],
        tes: [
          {k: 'veh_testigo_check_engine', l: 'Check engine', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true},
          {k: 'veh_testigo_abs', l: 'ABS', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true},
          {k: 'veh_testigo_airbag', l: 'Airbag', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true},
          {k: 'veh_testigo_presion_aceite', l: 'Presión de aceite', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true},
          {k: 'veh_testigo_bateria', l: 'Batería', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true},
          {k: 'veh_testigo_temperatura', l: 'Temperatura', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true},
          {k: 'veh_testigo_frenos', l: 'Frenos', t: 'Opción única', req: 'PV', src: ['Extracción automática'], opts: ['Encendido', 'Apagado', 'No aplica'], preex: true}
        ],
        ext: [
          {k: 'veh_extras', l: 'Extras', t: 'Grilla', cols: ['Descripción', 'Marca', 'Valor (USD)', 'Foto'], help: 'Descripción desde el catálogo de extras.'}
        ],
        ave: [
          {k: 'veh_averias', l: 'Averías', t: 'Grilla', src: ['Extracción automática'], cols: ['Pieza', 'Tipo de daño', 'Gravedad', 'Superficie (dm²)', 'Origen', 'Foto'], help: 'Pieza de catálogo normalizado, sin duplicados. Tipo de daño: rayón, abolladura, rotura, corrosión o faltante. Gravedad: Baja, Media o Alta.', preex: true}
        ],
        vex: [
          {k: 'veh_verificaciones_externas', l: 'Verificaciones externas', t: 'Grilla', by: {P: 'Back-office',V: 'Back-office',A: 'Back-office',D: 'Back-office'}, cols: ['Consulta', 'Resultado', 'Fecha y hora', 'Forma', 'Observación'], rows: ['Fiscalía por placa', 'Fiscalía por cédula', 'ANT', 'Siniestralidad', 'SRI', 'Codificación del VIN'], help: 'Resultado: Sin novedad, Con novedad o Servicio no disponible. La observación es obligatoria si hay novedad.'}
        ],
        val: [
          {k: 'veh_valor_asegurado_casco', l: 'Valor asegurado del casco', t: 'Moneda', locked: true, src: ['Solicitud']},
          {k: 'veh_valor_asegurado_extras', l: 'Valor asegurado de extras', t: 'Moneda', locked: true, src: ['Solicitud']},
          {k: 'veh_valor_asegurado_total', l: 'Valor asegurado total', t: 'Moneda', locked: true, src: ['Solicitud']},
          {k: 'veh_valor_comercial_referencia', l: 'Valor comercial de referencia', t: 'Moneda', src: ['Guía de precios'], min: 0, help: 'Precio de mercado de la marca, modelo y año.'}, // etapa C2-2 · DEC-179
          {k: 'veh_fuente_valor', l: 'Fuente del valor', t: 'Catálogo', opts: ['Guía de precios', 'Factura', 'Avalúo', 'Criterio del inspector'], help: 'De dónde sale el valor sugerido.'}, // etapa C2-2 · DEC-179
          {k: 'veh_valor_sugerido_casco', l: 'Valor sugerido del casco', t: 'Moneda', code: 'VAL_SUG_CASCO', req: 'PVD', min: 0, help: 'Lo ingresa el inspector, en USD.'},
          {k: 'veh_valor_sugerido_extras', l: 'Valor sugerido de extras', t: 'Cálculo', code: 'VAL_SUG_EXTRAS', f: 'SUMA({veh_extras}.valor)'},
          {k: 'veh_valor_sugerido_total', l: 'Total sugerido', t: 'Cálculo', code: 'VAL_SUG_TOTAL', f: '{veh_valor_sugerido_casco} + {veh_valor_sugerido_extras}'},
          {k: 'veh_diferencia_valor', l: 'Diferencia del casco', t: 'Cálculo', f: '({veh_valor_sugerido_casco} − {veh_valor_asegurado_casco}) / {veh_valor_asegurado_casco} × 100', help: 'Con signo. Solo compara el casco.', alertas: [{op: 'mayor', a: 10, txt: 'Posible infraseguro'}, {op: 'menor', a: -10, txt: 'Posible sobreseguro'}]},
          {k: 'veh_extras_sobre_casco', l: 'Extras sobre el casco', t: 'Cálculo', f: '{veh_valor_sugerido_extras} / {veh_valor_sugerido_casco} × 100', help: 'Porcentaje de los extras sugeridos sobre el casco sugerido.', alertas: [{op: 'mayor', a: 20, txt: 'Extras sobre el límite de la política'}]}
        ],
        ase: [
          {k: 'veh_decision_inspector', l: 'Decisión del inspector', t: 'Opción única', code: 'ASEG_DECISION', req: 'PVD', opts: ['Determinar como asegurable', 'Determinar como no asegurable', 'Enviar a calificación'], help: 'Las opciones dependen de la facultad del inspector.'},
          {k: 'veh_cobertura', l: 'Cobertura', t: 'Opción única', code: 'ASEG_COBERTURA', req: 'PVD', opts: ['Todo riesgo', 'Pérdida total', 'Daños propios y RC']},
          {k: 'veh_motivo_no_asegurable', l: 'Motivo de no asegurable', t: 'Texto', req: 'PVD', vis: {k: 'veh_decision_inspector', v: 'Determinar como no asegurable'}},
          {k: 'veh_motivo_envio_a_calificacion', l: 'Motivo de envío a calificación', t: 'Texto', req: 'PVD', vis: {k: 'veh_decision_inspector', v: 'Enviar a calificación'}},
          {k: 'veh_condiciones_poliza', l: 'Condiciones de póliza', t: 'Texto', help: 'Texto informativo.'},
          {k: 'veh_observacion_general', l: 'Observación general', t: 'Texto', lmax: 1000},
          {k: 'veh_firma_atiende', l: 'Firma de quien atiende', t: 'Foto', req: 'P', vis: {k: 'veh_modalidad_realizada', v: 'Presencial'}, help: 'Solo en modalidad Presencial.'}
        ]
      },
      secciones: [['ins', 'Datos de la inspección'], ['veh', 'Identificación del vehículo'], ['mat', 'Matrícula y propietario'], ['uso', 'Uso y conductor'], ['ver', 'Verificación de identificación'], ['acc', 'Accesorios y seguridad'], ['neu', 'Neumáticos'], ['tes', 'Testigos del tablero'], ['ext', 'Extras'], ['ave', 'Averías'], ['vex', 'Verificaciones externas'], ['val', 'Valores'], ['ase', 'Asegurabilidad']] } },
    // Casos migrados desde el Back-office (fila de la Bandeja). En casos con varios riesgos, el estado de cada vehículo va en estadoRiesgo.
    casos: [
      { id: '20152', orden: '', ramo: 'Vehículos', broker: 'Directo', asegurado: 'Luis Fernando Cevallos', ident: '0923456781', placa: 'GSE1120', bien: 'Placa GSE1120, 2019', fecha: '2026-10-12', sucursal: 'Guayaquil', backoffice: 'Daniela Ruiz', estado: 'En coordinación', responsable: 'Andrea Salazar', comercial: 'Santiago Ortiz', intentos: [{ fecha: '2026-10-17T10:15', medio: 'Llamada', resultado: 'No contesta', obs: 'Timbra sin respuesta.', by: 'Andrea Salazar' }] },
      { id: '20186', orden: 'EMI-408332', origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Austro Brokers', asegurado: 'Transportes del Litoral S.A.', ident: '0992876543001', placa: 'GSC7810', bien: 'GSC7810', fecha: '2026-10-15', sucursal: 'Guayaquil', correo: 'flota@translitoral.ec', tel: '04 268 3310', contacto: { nombre: 'Jorge Villacís Mora', cel: '0987123470', correo: 'jvillacis@translitoral.ec' }, backoffice: 'Verónica Lema', estado: 'En coordinación', responsable: 'Andrea Salazar', comercial: 'Santiago Ortiz', intentos: [{ fecha: '2026-10-16T09:30', medio: 'Llamada', resultado: 'Pidió llamar después', obs: 'El jefe de flota confirma disponibilidad por la tarde.', by: 'Andrea Salazar' }] },
      { id: '20188', orden: '', ramo: 'Vehículos', broker: 'Tecniseguros', asegurado: 'Rosa Elena Chiriboga', ident: '1712894563', placa: 'PCQ4417', bien: 'Placa PCQ4417, 2023', fecha: '2026-10-15', sucursal: 'Quito Norte', prov: 'Pichincha', canton: 'Quito', dir: 'Av. 6 de Diciembre N34-120 y Checoslovaquia', tel: '0991827364', correo: 'rosa.chiriboga@gmail.com', backoffice: 'Verónica Lema', estado: 'Pendiente calificación', responsable: 'Verónica Lema', comercial: 'Santiago Ortiz' },
      { id: '20202', orden: '', ramo: 'Vehículos', broker: 'Broker Pacífico', asegurado: 'Comercial Pacífico Norte S.A.', ident: '0992871564001', placa: 'GSD4410', bien: 'Placa GSD4410, 2024', fecha: '2026-10-15', sucursal: 'Guayaquil', prov: 'Guayas', canton: 'Guayaquil', dir: 'Av. Francisco de Orellana, Mz. 111, Guayaquil', tel: '0998770142', correo: 'compras@pacificonorte.ec', backoffice: 'Daniela Ruiz', estado: 'Pendiente calificación', responsable: 'Daniela Ruiz', comercial: 'Santiago Ortiz' },
      { id: '20203', orden: 'OE-2026-09031', ramo: 'Vehículos', broker: 'Directo', asegurado: 'Ana Lucía Mendoza Vera', ident: '0912345678', placa: 'GBF2290', placas: ['GBF2290'], bien: 'GBF2290', fecha: '2026-10-14', sucursal: 'Guayaquil', backoffice: 'Daniela Ruiz', estado: 'Inspeccionado', responsable: 'Daniela Ruiz', comercial: 'Santiago Ortiz', tipoRiesgo: 'Vehículos',
        riesgos: [{ id: '20203-V1', label: 'GBF2290', nowrap: true, detalle: 'Hyundai, Tucson, 2023', cobertura: 'Todo riesgo', total: 29800, estado: 'Inspeccionado', aseg: 'Asegurable', obs: 'Vehículo en buen estado, sin daños.', det: { by: 'Paola Vinueza', at: '15/10/26 · 11:05' }, control: { revisado: false } }] },
      { id: '20189', orden: '', ramo: 'Vehículos', broker: 'Broker Pacífico', asegurado: 'Fernando Vásquez Ortiz', ident: '0918273645', placa: '', bien: 'Toyota, Corolla Cross, 2026', fecha: '2026-10-16', sucursal: 'Guayaquil', backoffice: 'Verónica Lema', estado: 'Pendiente calificación', responsable: 'Verónica Lema', comercial: 'Santiago Ortiz' },
      { id: '20181', orden: '', ramo: 'Vehículos', broker: 'Directo', asegurado: 'Esteban Ruiz Calderón', ident: '1309234567', placa: 'MBC3345', bien: 'Placa MBC3345, 2022', fecha: '2026-10-09', sucursal: 'Manta', backoffice: 'Verónica Lema', estado: 'Pendiente calificación', responsable: 'Verónica Lema', comercial: 'Santiago Ortiz' },
      { id: '20160', orden: '', ramo: 'Vehículos', broker: 'Directo', asegurado: 'Carla Viteri', ident: '1712345678', placa: 'ABC7733', bien: 'Placa ABC7733, 2024', fecha: '2026-10-06', sucursal: 'Quito Norte', backoffice: 'Verónica Lema', estado: 'Inspeccionado', aseg: 'Asegurable', cobertura: 'Todo riesgo', responsable: 'Andrea Salazar', comercial: 'Santiago Ortiz' },
      { id: '20163', orden: '', ramo: 'Vehículos', broker: 'Broker Pacífico', asegurado: 'Jorge Andrés Paredes', ident: '1803456712', placa: '', bien: 'Chevrolet, Onix, 2025', fecha: '2026-10-15', sucursal: 'Ambato', backoffice: 'Verónica Lema', estado: 'Cancelado', cancelAt: 1, responsable: 'Andrea Salazar', comercial: 'Santiago Ortiz',
        intentos: [{ fecha: '2026-10-15T09:10', medio: 'Llamada', resultado: 'No contesta', obs: 'Timbra sin respuesta.', by: 'Andrea Salazar' }, { fecha: '2026-10-15T12:30', medio: 'WhatsApp', resultado: 'No contesta', obs: 'Mensaje entregado, sin respuesta.', by: 'Andrea Salazar' }, { fecha: '2026-10-15T16:05', medio: 'Llamada', resultado: 'No contesta', obs: 'Buzón de voz; se dejó mensaje.', by: 'Andrea Salazar' }],
        cancelacion: { motivo: 'Cliente no contesta', obs: 'Tres intentos sin respuesta por llamada y WhatsApp en el mismo día.', by: 'Andrea Salazar', at: '2026-10-15T16:20' } },
      { id: '20190', orden: '', ramo: 'Robo', broker: 'Austro Brokers', asegurado: 'Farmacias del Valle Cía. Ltda.', ident: '1791234560001', placa: '', bien: 'Bodega, Sangolquí', fecha: '2026-10-15', sucursal: 'Quito Norte', backoffice: 'Daniela Ruiz', estado: 'Reaperturado', responsable: 'Andrea Salazar', comercial: 'Santiago Ortiz',
        intentos: [{ fecha: '2026-10-15T10:00', medio: 'Llamada', resultado: 'Número equivocado', obs: 'El celular registrado pertenece a otra persona.', by: 'Andrea Salazar' }],
        cancelacion: { motivo: 'Datos de contacto incompletos o incorrectos', obs: 'El celular no corresponde al cliente y la solicitud no tiene correo.', by: 'Andrea Salazar', at: '2026-10-15T10:20' },
        reapertura: { cel: '0987654321', correo: 'compras@farmaciasdelvalle.ec', instr: 'Llamar a Gabriela Ortega, jefa de compras, de 09:00 a 12:00. La bodega atiende de lunes a viernes.', by: 'Santiago Ortiz', at: '2026-10-16T09:15' } },
      { id: '20170', orden: '', ramo: 'Vehículos', broker: 'Asesores Andinos', asegurado: 'Gabriela Montalvo', ident: '1004567823', placa: 'GBT5512', bien: 'Placa GBT5512, 2021', fecha: '2026-10-11', sucursal: 'Ibarra', backoffice: 'Verónica Lema', estado: 'Devuelto al inspector', responsable: 'Cristian Vaca', comercial: 'Santiago Ortiz' },
      { id: '20196', orden: 'OE-2026-09020', ramo: 'Vehículos', broker: 'Broker Pacífico', asegurado: 'Distribuidora Andina de Alimentos S.A.', ident: '1792456781001', placa: 'PBA4521', placas: ['PBA4521', 'GSE1098'], bien: 'PBA4521', fecha: '2026-10-16', sucursal: 'Quito Norte', backoffice: 'Verónica Lema', estado: 'Emitida', responsable: 'Marco Tapia', comercial: 'Santiago Ortiz', tipoRiesgo: 'Vehículos',
        riesgos: [{ id: '20196-V1', label: 'PBA4521', nowrap: true, detalle: 'Toyota, Corolla Cross, 2022', cobertura: 'Todo riesgo', total: 29700, estado: 'En coordinación', dir: 'Av. Eloy Alfaro N45-210, Quito · patio de la empresa', recMod: 'Presencial' }, { id: '20196-V2', label: 'GSE1098', nowrap: true, detalle: 'Chevrolet, D-Max, 2019', cobertura: 'Pérdida total', total: 21000, estado: 'En coordinación', dir: 'Av. Eloy Alfaro N45-210, Quito · patio de la empresa', recMod: 'Presencial' }, { id: '20196-V3', label: 'Kia, Sportage, 2026', detalle: 'Sin placa', cobertura: 'Todo riesgo', total: 35840, estado: 'En coordinación', dir: 'Concesionario Kia Granados · Av. Granados E12-70, Quito', recMod: 'Autoinspección' }] },
    ],
    // Historial y notificaciones base de los casos de coordinación (20163 cancelado, 20190 reaperturado). Más reciente primero.
    eventos: {
      '20163': [['15/10/26 · 16:20', 'Caso cancelado por coordinación · Cliente no contesta · Tres intentos sin respuesta por llamada y WhatsApp en el mismo día. · Notificado a Santiago Ortiz (Ejecutivo comercial)', 'Andrea Salazar'], ['15/10/26 · 16:05', 'Intento de contacto · Llamada · No contesta · Buzón de voz; se dejó mensaje.', 'Andrea Salazar'], ['15/10/26 · 12:30', 'Intento de contacto · WhatsApp · No contesta · Mensaje entregado, sin respuesta.', 'Andrea Salazar'], ['15/10/26 · 09:10', 'Intento de contacto · Llamada · No contesta · Timbra sin respuesta. · Caso en coordinación', 'Andrea Salazar']],
      '20190': [['16/10/26 · 09:15', 'Caso reaperturado · contactos actualizados: 0987654321, compras@farmaciasdelvalle.ec · Instrucciones: Llamar a Gabriela Ortega, jefa de compras, de 09:00 a 12:00. La bodega atiende de lunes a viernes. · Responsable: Andrea Salazar (Coordinador)', 'Santiago Ortiz'], ['15/10/26 · 10:20', 'Caso cancelado por coordinación · Datos de contacto incompletos o incorrectos · El celular no corresponde al cliente y la solicitud no tiene correo. · Notificado a Santiago Ortiz (Ejecutivo comercial)', 'Andrea Salazar'], ['15/10/26 · 10:00', 'Intento de contacto · Llamada · Número equivocado · El celular registrado pertenece a otra persona. · Caso en coordinación', 'Andrea Salazar']],
    },
    notificaciones: [
      { id: 'n-20190-reap', aud: 'Coordinador de inspecciones', kind: 'visita', text: 'Santiago Ortiz reaperturó el caso 20190 con contactos actualizados', caseId: '20190', ts: '2026-10-16T09:15', read: false },
      { id: 'n-20163-canc', aud: 'Ejecutivo comercial', kind: 'visita', text: 'Andrea Salazar canceló el caso 20163 por coordinación: Cliente no contesta', caseId: '20163', ts: '2026-10-15T16:20', read: false },
    ],
    // Visitas base por caso. Las demos de etapas previas de 20196 usan las suyas mientras están activas.
    visitas: {
      '20187': [{ id: 'V1', mod: 'Presencial', inspector: 'Marco Tapia', fecha: '2026-10-18', hIni: '09:00', hFin: '10:00', dir: 'Av. Remigio Crespo y Av. Fray Vicente Solano, Cuenca', inter: '', ref: '', riesgos: ['20187-R1'], estado: 'En curso', cName: 'Daniela Mora Paredes', cCel: '0987123456', cMail: '' }],
      '20188': [{ id: 'V1', mod: 'Documental', inspector: '', fecha: '2026-10-16', hIni: '', hFin: '', dir: '', inter: '', ref: '', riesgos: ['20188-R1'], estado: 'Realizada', cName: 'Rosa Elena Chiriboga', cCel: '0991827364', cMail: '' }],
      '20202': [{ id: 'V1', mod: 'Presencial', inspector: 'Paola Vinueza', fecha: '2026-10-16', hIni: '10:00', hFin: '10:45', dir: 'Av. Francisco de Orellana, Mz. 111, Guayaquil', inter: '', ref: 'Ingreso por la garita principal', riesgos: ['20202-R1'], estado: 'Realizada', cName: 'Mauricio Intriago', cCel: '0998770142', cMail: 'compras@pacificonorte.ec' }],
      '20203': [{ id: 'V1', mod: 'Presencial', inspector: 'Paola Vinueza', fecha: '2026-10-15', hIni: '10:00', hFin: '10:45', dir: 'Cdla. Kennedy Norte, Mz. 205 V. 12, Guayaquil', inter: '', ref: '', riesgos: ['20203-V1'], estado: 'Realizada', cName: 'Ana Lucía Mendoza Vera', cCel: '0987345612', cMail: 'ana.mendoza@gmail.com' }],
      '20189': [{ id: 'V1', mod: 'No requiere inspección', inspector: '', fecha: '', hIni: '', hFin: '', dir: '', inter: '', ref: '', riesgos: ['20189-R1'], estado: 'Realizada', motivo: 'Vehículo 0 km con factura del concesionario', nrObs: 'Factura FAC-001-2318 de Toyota del Pacífico y fotos de entrega revisadas.', by: 'Andrea Salazar', at: '17/10/26 · 15:20', cName: 'Fernando Vásquez Ortiz', cCel: '0998231467', cMail: '' }],
      '20181': [{ id: 'V1', mod: 'Presencial', inspector: 'Cristian Vaca', fecha: '2026-10-10', hIni: '10:00', hFin: '11:00', dir: 'Av. Flavio Reyes y calle 20, Manta', inter: '', ref: '', riesgos: ['20181-R1'], estado: 'Realizada', cName: 'Esteban Ruiz Calderón', cCel: '0993456781', cMail: '' }],
      '20160': [{ id: 'V1', mod: 'Presencial', inspector: 'Luis Andrade', fecha: '2026-10-08', hIni: '10:00', hFin: '11:00', dir: 'Av. República de El Salvador N34-120, Quito', inter: 'Suiza', ref: '', riesgos: ['20160-R1'], estado: 'Realizada', cName: 'Carla Viteri', cCel: '0991234567', cMail: '' }],
      '20170': [{ id: 'V1', mod: 'Presencial', inspector: 'Cristian Vaca', fecha: '2026-10-13', hIni: '14:00', hFin: '15:00', dir: 'Av. Mariano Acosta 21-45, Ibarra', inter: 'Av. El Retorno', ref: '', riesgos: ['20170-R1'], estado: 'Realizada', cName: 'Gabriela Montalvo', cCel: '0987654321', cMail: '' }],
      '20196': [{ id: 'V1', mod: 'Presencial', inspector: 'Marco Tapia', fecha: '2026-10-16', hIni: '09:00', hFin: '10:30', dir: 'Av. Eloy Alfaro N45-210, Quito · patio de la empresa', inter: 'De los Juncos', ref: 'Ingreso por la puerta 2', riesgos: ['20196-V1', '20196-V2'], estado: 'Realizada', cName: 'Ramiro Paz', cCel: '0998124470', cMail: 'flota@andinaalimentos.ec' }, { id: 'V2', mod: 'Autoinspección', inspector: '', fecha: '', hIni: '', hFin: '', validez: '10 días', enlace: 'sirius.ec/ai/20196-V2', envio: '2026-10-16T11:10', dir: 'Concesionario Kia Granados · Av. Granados E12-70, Quito', riesgos: ['20196-V3'], estado: 'Realizada', cName: 'Ramiro Paz', cCel: '0998124470', cMail: 'flota@andinaalimentos.ec' }],
    },
    // Estado inicial propio de una demo (?escena=). Las demos no fuerzan estados fuera de aquí.
    escenas: {
      editenvio: { casos: { '20137': { estado: 'Enviado a emisión', aseg: 'Asegurable' } }, eventos: { '20137': [['16/10/26 · 11:30', 'Resultado de calificación enviado al BPM de Emisión · todos los riesgos, con motivos y seguimientos', 'Sistema']] } },
    },
    vehiculos: [
      { caso: '20196', riesgo: '20196-V1', placa: 'PBA4521', marca: 'Toyota', modelo: 'Corolla Cross', anio: 2022, km: 41300, aseg: 29700, sug: 26100, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Marco Tapia', fechaInspeccion: '16/10/26', formulario: VL1, extras: [{ desc: 'Aros de aleación', valor: 800 }, { desc: 'Láminas de seguridad', valor: 400 }], informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Marco Tapia', inspeccion: '16/10/26 · 09:15', carga: '16/10/26 · 10:40', ase: { obs: 'Valor de mercado menor al asegurado' }, campos: { veh_marca: { src: 'placas' }, veh_modelo: { src: 'placas' }, veh_anio_modelo: { src: 'placas' }, veh_vin: { v: '9BRBD48E2N2581047', src: 'ext', doc: 'Matrícula', conf: 96, disc: { vals: [{ v: '9BRBD48E2N2581047', f: 'Matrícula' }, { v: '9BRBD48E2N2581O47', f: 'Decodificación del VIN' }], res: { by: 'Marco Tapia', f: 'Matrícula' } } }, veh_color: { v: 'Plata', src: 'ext', doc: 'Foto lateral izquierda', conf: 84, confBy: 'Marco Tapia' }, veh_nombre_matricula: { v: 'Distribuidora Andina de Alimentos S.A.', src: 'ext', doc: 'Matrícula', conf: 97 }, veh_identificacion_propietario: { v: '1792456781001', src: 'ext', doc: 'Matrícula', conf: 98 }, veh_anio_matricula: { v: '2026', src: 'ext', doc: 'Matrícula', conf: 95 }, veh_vigencia_matricula: { v: '31/03/2027', src: 'ext', doc: 'Matrícula', conf: 93 }, veh_testigo_check_engine: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_abs: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_airbag: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_presion_aceite: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_bateria: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_temperatura: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_frenos: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 } }, grillas: { neu: { 'Delantera izquierda': { marca: 'Bridgestone', medida: '215/60 R17', labrado: '6,2', conf: 94 }, 'Delantera derecha': { marca: 'Bridgestone', medida: '215/60 R17', labrado: '6,0', conf: 93 }, 'Trasera izquierda': { marca: 'Bridgestone', medida: '215/60 R17', labrado: '5,1', conf: 95 }, 'Trasera derecha': { marca: 'Bridgestone', medida: '215/60 R17', labrado: '5,4', conf: 92 }, 'Repuesto': { marca: 'Bridgestone', medida: '215/60 R17', labrado: '7,8', conf: 96 } }, ext: { 'Aros de aleación': { marca: 'Enkei' }, 'Láminas de seguridad': { marca: '3M' } }, ave: [{ pieza: 'Parachoques posterior', tipo: 'Rayón', grav: 'Baja', sup: '1,5', conf: 91, estado: 'aceptada', by: 'Marco Tapia', at: '16/10/26 · 10:05' }, { pieza: 'Puerta delantera derecha', tipo: 'Abolladura', grav: 'Media', sup: '3', conf: 88, estado: 'aceptada', by: 'Marco Tapia', at: '16/10/26 · 10:06' }], vex: { _all: { res: 'Sin novedad', at: '16/10/26 · 10:20' } } } }, sucursal: 'Quito Norte', clase: 'Jeep', carroceria: 'SUV', uso: 'Comercial', averias: 1, gravedad: 'Media', resultado: 'regla', envio: [{ regla: 'Diferencia de valor', pct: '−12,1 %' }], motivoInsp: 'Siniestro previo en 2024: validar la reparación del parachoques posterior', conclusion: 'Daño previo reparado; pintura sin diferencias de tono', hallazgos: ['Parachoques posterior reemplazado', 'Sin daños estructurales', 'Odómetro: 41.300 km'], estadoRiesgo: {estado: 'Inspeccionado', aseg: 'No asegurable', motivoRech: 'Daños preexistentes no reparados', obs: 'Parachoques posterior con daño previo sin reparar.', user: 'Verónica Lema', fecha: '16/10/26 · 12:40', emi: {res: 'Emitido por excepción', poliza: 'POL-2026-118296', motivo: 'Cliente corporativo con la flota completa en la compañía', autorizador: 'Rodrigo Salvador · Gerencia técnica'}, envio: [{regla: 'Diferencia de valor', motivo: 'El valor sugerido del casco difiere más del 10 % del valor asegurado del casco. Posible infraseguro o sobreseguro.', detalle: 'Diferencia del casco: −12,1 % · sugerido del casco USD 26.100 · asegurado del casco USD 29.700', pct: '−12,1 %'}], recom: 'Asegurable · Todo riesgo'} },
      { caso: '20196', riesgo: '20196-V2', placa: 'GSE1098', marca: 'Chevrolet', modelo: 'D-Max', anio: 2019, km: 132800, aseg: 21000, sug: 20500, cobertura: 'Pérdida total', modalidad: 'Presencial', inspector: 'Marco Tapia', fechaInspeccion: '16/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Marco Tapia', inspeccion: '16/10/26 · 09:45', carga: '16/10/26 · 10:35', grillas: { vex: { _all: { res: 'Sin novedad', at: '16/10/26 · 10:25' } } } }, sucursal: 'Quito Norte', clase: 'Camioneta', carroceria: 'Camioneta doble cabina', uso: 'Comercial', resultado: 'determinado', vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Antigüedad mayor a 5 años; revisar estado general', conclusion: 'Desgaste normal por uso', hallazgos: ['Llantas con 60% de vida útil', 'Carrocería sin daños', 'Odómetro: 132.800 km'], estadoRiesgo: {estado: 'Inspeccionado', aseg: 'Asegurable', cobertura: 'Pérdida total', obs: 'Desgaste normal por uso; sin daños relevantes.', user: '', fecha: '', det: {by: 'Marco Tapia', at: '16/10/26 · 10:35'}, emi: {res: 'Emitido', poliza: 'POL-2026-118297'}} },
      { caso: '20196', riesgo: '20196-V3', placa: '', label: 'Kia, Sportage, 2026', marca: 'Kia', modelo: 'Sportage', anio: 2026, km: 12, aseg: 35840, sug: 35840, cobertura: 'Todo riesgo', modalidad: 'Autoinspección', inspector: '', fechaInspeccion: '16/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V2', canal: 'Portal del cliente', registradoPor: 'Ramiro Paz · contacto del asegurado', inspeccion: '16/10/26 · 11:02', carga: '16/10/26 · 11:10', revisado: { by: 'Marco Tapia', at: '16/10/26 · 11:18' } }, sucursal: 'Quito Norte', clase: 'Jeep', carroceria: 'SUV', uso: 'Comercial', resultado: 'regla', envio: [{ regla: 'Autoinspección', pct: '' }], motivoInsp: 'Vehículo nuevo sin placa; validar factura del concesionario', conclusion: 'Vehículo 0 km sin daños', hallazgos: ['Factura del concesionario verificada', 'Sin daños visibles', 'Odómetro: 12 km'], estadoRiesgo: {estado: 'Inspeccionado', aseg: 'Asegurable', cobertura: 'Todo riesgo', obs: 'Vehículo 0 km sin daños.', user: 'Verónica Lema', fecha: '16/10/26 · 12:50', emi: {res: 'Emitido', poliza: 'POL-2026-118298'}, envio: [{regla: 'Autoinspección', motivo: 'Inspección realizada por el cliente mediante autoinspección. Requiere calificación del Ejecutivo de inspecciones.', detalle: 'Modalidad: Autoinspección', pct: ''}], recom: 'Sin recomendación: la autoinspección no tiene inspector'} },
      { caso: '20198', riesgo: '20198-V1', placa: 'PCX2207', marca: 'Hyundai', modelo: 'Tucson', anio: 2023, km: 28400, aseg: 31200, sug: 30600, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Diana Cárdenas', fechaInspeccion: '15/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Diana Cárdenas', inspeccion: '15/10/26 · 10:40', carga: '15/10/26 · 11:00', grillas: { vex: { _all: { res: 'Sin novedad', at: '15/10/26 · 10:55' } } } }, sucursal: 'Quito Norte', clase: 'Jeep', carroceria: 'SUV', uso: 'Comercial', resultado: 'determinado', control: { revisado: false }, vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Emisión nueva de flota; inspección estándar antes de emitir', conclusion: 'Vehículo en buen estado, sin daños', hallazgos: ['Carrocería y pintura sin daños', 'Llantas con 80% de vida útil', 'Odómetro: 28.400 km'] },
      { caso: '20198', riesgo: '20198-V2', placa: 'PCY8840', marca: 'Renault', modelo: 'Duster', anio: 2022, km: 52100, aseg: 18900, sug: 18400, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Diana Cárdenas', fechaInspeccion: '15/10/26', formulario: VL1, sucursal: 'Quito Norte', clase: 'Jeep', carroceria: 'SUV', uso: 'Comercial', resultado: 'determinado', vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Emisión nueva de flota; inspección estándar antes de emitir', conclusion: 'Rayón leve en puerta trasera derecha, registrado como preexistencia', hallazgos: ['Rayón leve en puerta trasera derecha', 'Sin daños estructurales', 'Odómetro: 52.100 km'] },
      { caso: '20199', riesgo: '20199-V1', placa: 'GBA3391', marca: 'Toyota', modelo: 'Hilux', anio: 2018, km: 168500, aseg: 24500, sug: 23800, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Paola Vinueza', fechaInspeccion: '14/10/26', formulario: VL1, sucursal: 'Guayaquil', clase: 'Camioneta', carroceria: 'Camioneta doble cabina', uso: 'Comercial', resultado: 'determinado', vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Camioneta de carga con 8 años de uso; revisar balde y chasis', conclusion: 'Uso intensivo, sin daños estructurales', hallazgos: ['Desgaste del balde por carga', 'Corrosión superficial en el chasis', 'Odómetro: 168.500 km'] },
      { caso: '20199', riesgo: '20199-V2', placa: 'GBC1150', marca: 'Nissan', modelo: 'Frontier', anio: 2021, km: 61900, aseg: 27800, sug: 27100, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Paola Vinueza', fechaInspeccion: '14/10/26', formulario: VL1, sucursal: 'Guayaquil', clase: 'Camioneta', carroceria: 'Camioneta doble cabina', uso: 'Comercial', resultado: 'determinado', vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Emisión nueva de flota; inspección estándar antes de emitir', conclusion: 'Sin daños', hallazgos: ['Carrocería sin daños', 'Llantas con 70% de vida útil', 'Odómetro: 61.900 km'] },
      { caso: '20141', riesgo: '20141-V1', placa: 'PBC3018', marca: 'Toyota', modelo: 'Corolla Cross', anio: 2022, km: 38240, aseg: 28500, accesorios: 1200, sug: 28500, cobertura: 'Todo riesgo', modalidad: 'Virtual guiada', inspector: 'Cristian Vaca', fechaInspeccion: '11/10/26', formulario: VL1, informe: { estado: 'Enviado', canal: 'Videollamada guiada', registradoPor: 'Cristian Vaca', enviadoPor: 'Cristian Vaca', inspeccion: '11/10/26 · 10:00', carga: '11/10/26 · 10:30', campos: { veh_marca: { src: 'placas' }, veh_modelo: { src: 'placas' }, veh_anio_modelo: { src: 'placas' }, veh_color: { v: 'Blanco', src: 'ext', doc: 'Foto lateral izquierda', conf: 92 }, veh_nombre_matricula: { v: 'María José Andrade', src: 'ext', doc: 'Matrícula', conf: 97 }, veh_identificacion_propietario: { v: '1717283940', src: 'ext', doc: 'Matrícula', conf: 98 }, veh_testigo_check_engine: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }, veh_testigo_abs: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }, veh_testigo_airbag: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }, veh_testigo_presion_aceite: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }, veh_testigo_bateria: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }, veh_testigo_temperatura: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }, veh_testigo_frenos: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 } },
        grillas: { neu: { 'Delantera izquierda': { marca: 'Yokohama', medida: '215/60 R17', labrado: '6,8', conf: 93 }, 'Delantera derecha': { marca: 'Yokohama', medida: '215/60 R17', labrado: '6,6', conf: 92 }, 'Trasera izquierda': { marca: 'Yokohama', medida: '215/60 R17', labrado: '6,1', conf: 94 }, 'Trasera derecha': { marca: 'Yokohama', medida: '215/60 R17', labrado: '6,3', conf: 93 }, 'Repuesto': { marca: 'Yokohama', medida: '215/60 R17', labrado: '8,0', conf: 95 } },
          ave: [{ pieza: 'Parachoques posterior', tipo: 'Abolladura', grav: 'Media', sup: '2', conf: 90, estado: 'aceptada', by: 'Cristian Vaca', at: '11/10/26 · 10:12' }],
          vex: { _all: { res: 'Sin novedad', at: '11/10/26 · 10:24', forma: 'Consulta automática' }, 'Fiscalía por placa': { res: 'Con novedad', at: '11/10/26 · 10:24', forma: 'Consulta automática', obs: 'Denuncia de robo de 2023 asociada a la placa, en estado archivada. Validar con la asegurada.' } } } },
      sucursal: 'Quito Norte', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', vext: 'Sí', averias: 1, gravedad: 'Media', resultado: 'regla', envio: [{ regla: 'Verificación externa con novedad', pct: '' }], motivoInsp: 'Daño previo en parachoques posterior; requiere validar cobertura', conclusion: 'Enviado a calificación por daño previo', hallazgos: ['Daño previo en parachoques posterior', 'Carrocería y pintura sin otros daños', 'Odómetro: 38.240 km'] },
      { caso: '20160', riesgo: '20160-V1', placa: 'ABC7733', marca: 'Kia', modelo: 'Seltos', anio: 2024, km: 18400, aseg: 27900, sug: 27400, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Luis Andrade', fechaInspeccion: '08/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Luis Andrade', inspeccion: '08/10/26 · 10:15', carga: '10/10/26 · 11:05', ase: { recom: 'Asegurable' } }, sucursal: 'Quito Norte', lugar: 'Quito', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', resultado: 'facultad', calificacion: { aseg: 'Asegurable', cobertura: 'Todo riesgo', by: 'Verónica Lema', at: '15/10/26 · 16:40', origen: 'Calificado por Verónica Lema' }, eventos: [['15/10/26 · 16:40', 'Calificación: Asegurable · Todo riesgo', 'Verónica Lema'], ['10/10/26 · 11:20', 'Enviado a calificación por facultad: el inspector no tiene facultad para determinar', 'Sistema'], ['10/10/26 · 11:05', 'Informe de inspección registrado', 'Luis Andrade']], conclusion: 'Enviado a calificación: el inspector no tiene facultad para determinar', hallazgos: ['Sin daños visibles', 'Odómetro: 18.400 km'] },
      { caso: '20170', riesgo: '20170-V1', placa: 'GBT5512', marca: 'Kia', modelo: 'Sportage', anio: 2021, km: 96500, aseg: 22900, sug: 19800, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Cristian Vaca', fechaInspeccion: '13/10/26', formulario: VL1, informe: { estado: 'Devuelto', visita: 'V1', canal: 'App del inspector', registradoPor: 'Cristian Vaca', inspeccion: '13/10/26 · 14:20', carga: '13/10/26 · 15:05', campos: { veh_testigo_check_engine: { v: 'Encendido', src: 'ext', doc: 'Foto del tablero', conf: 93 }, veh_testigo_abs: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_airbag: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_presion_aceite: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_bateria: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_temperatura: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 }, veh_testigo_frenos: { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 95 },  veh_kilometraje: { v: '96500', src: 'ext', doc: 'Foto del tablero', conf: 76 }, veh_tipo_carroceria: { v: '', src: 'ext', doc: 'Foto lateral derecha', conf: 41 } }, grillas: { neu: { 'Delantera izquierda': { marca: 'Continental', medida: '225/65 R17', labrado: '4,8', conf: 93 }, 'Delantera derecha': { marca: 'Continental', medida: '225/65 R17', labrado: '4,6', conf: 92 }, 'Trasera izquierda': { marca: 'Continental', medida: '225/65 R17', labrado: '1,4', conf: 94 }, 'Trasera derecha': { marca: 'Continental', medida: '225/65 R17', labrado: '3,9', conf: 91 }, 'Repuesto': { marca: 'Continental', medida: '225/65 R17', labrado: '7,1', conf: 95 } }, extManual: [{ desc: 'Sistema de sonido', marca: 'Pioneer', valor: '4500', by: 'Cristian Vaca' }], ave: [{ pieza: 'Guardafango delantero izquierdo', tipo: 'Rayón', grav: 'Baja', sup: '1', conf: 82, estado: 'propuesta' }], vex: { _all: { res: 'Sin novedad', at: '13/10/26 · 14:50' }, SRI: { res: 'Servicio no disponible', at: '13/10/26 · 14:52' } } } }, sucursal: 'Ibarra', lugar: 'Ibarra', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', contrato: 'No', resultado: 'regla', galeria: 1, envio: [{ regla: 'Diferencia de valor', pct: '−13,5 %' }, { regla: 'Vehículo sin contrato de compraventa', pct: '' }, { regla: 'Fotos cargadas desde galería', pct: '' }], estadoCaso: 'Devuelto al inspector', responsable: 'Cristian Vaca', devolucion: { motivo: 'Confirma el valor sugerido del casco y revisa si presenta contrato de compraventa; si lo presenta, adjunta la foto.', by: 'Verónica Lema', at: '14/10/26 · 10:05', campos: [{ campo: 'Valor sugerido del casco', sec: 'val' }, { campo: '¿Presenta contrato de compraventa?', sec: 'mat' }] }, eventos: [['14/10/26 · 10:05', 'Devuelto al inspector · Confirma el valor sugerido del casco y revisa si presenta contrato de compraventa; si lo presenta, adjunta la foto.', 'Verónica Lema'], ['13/10/26 · 15:20', 'Enviado a calificación por regla: Diferencia de valor (−13,5 %), Vehículo sin contrato de compraventa, Fotos cargadas desde galería', 'Sistema'], ['13/10/26 · 15:05', 'Informe de inspección registrado', 'Cristian Vaca']], conclusion: 'Enviado a calificación por reglas', hallazgos: ['Sin contrato de compraventa', 'Odómetro: 96.500 km'] },
      { caso: '20175', riesgo: '20175-V1', placa: 'PDQ9031', marca: 'Toyota', modelo: 'Fortuner', anio: 2020, km: 98000, aseg: 42000, sug: 41500, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Marco Tapia', fechaInspeccion: '03/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'Back-office', registradoPor: 'Verónica Lema', inspeccion: '03/10/26 · 10:10', carga: '03/10/26 · 16:30' }, sucursal: 'Quito Norte', lugar: 'Quito', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', resultado: 'regla', envio: [{ regla: 'Vehículos de alto valor', pct: 'USD 41.500' }], calificacion: { aseg: 'Asegurable', cobertura: 'Todo riesgo', by: 'Verónica Lema', at: '04/10/26 · 11:15' }, emision: { res: 'Emitido', poliza: 'POL-2026-117842', fecha: '06/10/26' }, eventos: [['06/10/26 · 09:30', 'Respuesta del BPM de Emisión: Emitido · POL-2026-117842', 'BPM de Emisión'], ['04/10/26 · 11:15', 'Calificación: Asegurable · Todo riesgo', 'Verónica Lema'], ['03/10/26 · 16:10', 'Enviado a calificación por regla: Vehículos de alto valor (USD 41.500)', 'Sistema']], conclusion: 'Enviado a calificación por regla', hallazgos: ['Sin daños visibles', 'Odómetro: 98.000 km'] },
      { caso: '20187', riesgo: '20187-V1', placa: '', marca: 'Kia', modelo: 'Sportage', anio: 2026, km: 12, aseg: 32500, sug: 32500, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Marco Tapia', fechaInspeccion: '18/10/26', formulario: VL1, informe: { estado: 'Borrador', visita: 'V1', canal: 'App del inspector', registradoPor: 'Marco Tapia', inspeccion: '18/10/26 · 09:20', carga: '' }, sucursal: 'Cuenca', lugar: 'Cuenca', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', contrato: 'Sí', hallazgos: [] },
      { caso: '20188', riesgo: '20188-V1', placa: 'PCQ4417', marca: 'Hyundai', modelo: 'Creta', anio: 2023, km: 28400, aseg: 21800, sug: 21500, cobertura: 'Todo riesgo', modalidad: 'Documental', inspector: '', fechaInspeccion: '16/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'Back-office', registradoPor: 'Daniela Ruiz', inspeccion: '16/10/26 · 10:00', carga: '16/10/26 · 11:40' }, sucursal: 'Quito Norte', lugar: 'Quito', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', contrato: 'Sí', resultado: 'facultad', eventos: [['16/10/26 · 11:45', 'Enviado a calificación · modalidad Documental, sin inspector que determine', 'Sistema'], ['16/10/26 · 11:40', 'Informe de inspección registrado desde el back-office · modalidad Documental', 'Daniela Ruiz']], hallazgos: ['Revisión documental de matrícula, fotos y factura'] },
      { caso: '20202', riesgo: '20202-V1', placa: 'GSD4410', marca: 'Toyota', modelo: 'Fortuner', anio: 2024, km: 8200, aseg: 46900, sug: 46500, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Paola Vinueza', fechaInspeccion: '16/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Paola Vinueza', inspeccion: '16/10/26 · 10:05', carga: '16/10/26 · 15:30', grillas: { vex: { _all: { res: 'Sin novedad', at: '16/10/26 · 10:25' } } } }, sucursal: 'Guayaquil', lugar: 'Guayaquil', clase: 'Jeep', carroceria: 'SUV', uso: 'Comercial', resultado: 'regla', envio: [{ regla: 'Vehículos de alto valor', pct: 'USD 46.500', motivo: 'El valor sugerido del casco supera USD 40.000. Revisa el valor comercial y los extras.', detalle: 'Valor sugerido del casco: USD 46.500 · asegurado del casco USD 46.900 · umbral USD 40.000' }], vext: 'No', galeria: 0, discrep: 0, porconf: 0, eventos: [['16/10/26 · 15:30', 'Enviado a calificación por regla: Vehículos de alto valor (USD 46.500)', 'Sistema'], ['16/10/26 · 15:30', 'Informe de inspección registrado', 'Paola Vinueza']], motivoInsp: 'Vehículo de alto valor de una empresa; inspección estándar antes de emitir', conclusion: 'Enviado a calificación por regla', hallazgos: ['Carrocería y pintura sin daños', 'Llantas con 90% de vida útil', 'Odómetro: 8.200 km'] },
      { caso: '20203', riesgo: '20203-V1', placa: 'GBF2290', marca: 'Hyundai', modelo: 'Tucson', anio: 2023, km: 31500, aseg: 29800, sug: 29300, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Paola Vinueza', fechaInspeccion: '15/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Paola Vinueza', inspeccion: '15/10/26 · 10:05', carga: '15/10/26 · 11:00', grillas: { vex: { _all: { res: 'Sin novedad', at: '15/10/26 · 10:25' } } } }, sucursal: 'Guayaquil', lugar: 'Guayaquil', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', resultado: 'determinado', control: { revisado: false }, vext: 'No', galeria: 0, discrep: 0, porconf: 0, motivoInsp: 'Emisión nueva; inspección estándar antes de emitir', conclusion: 'Vehículo en buen estado, sin daños', hallazgos: ['Carrocería y pintura sin daños', 'Llantas con 75% de vida útil', 'Odómetro: 31.500 km'] },
      // Etapa 12b · vehículo de 20186 (autoinspección por el portal del cliente; sin informe hasta que el cliente envía).
      { caso: '20186', riesgo: '20186-V1', placa: 'GSC7810', marca: 'Chevrolet', modelo: 'D-Max', anio: 2020, km: 74200, aseg: 27800, sug: 27800, cobertura: 'Todo riesgo', modalidad: 'Autoinspección', inspector: '', fechaInspeccion: '', formulario: VL1, sucursal: 'Guayaquil', lugar: 'Guayaquil', clase: 'Camioneta', carroceria: 'Camioneta doble cabina', uso: 'Comercial', vin: 'MPATFS86JLT004512', eventos: [] },
      { caso: '20181', riesgo: '20181-V1', placa: 'MBC3345', marca: 'Mazda', modelo: 'CX-5', anio: 2022, km: 610, aseg: 25500, sug: 24800, cobertura: 'Todo riesgo', modalidad: 'Presencial', inspector: 'Cristian Vaca', fechaInspeccion: '10/10/26', formulario: VL1, informe: { estado: 'Enviado', visita: 'V1', canal: 'App del inspector', registradoPor: 'Cristian Vaca', inspeccion: '10/10/26 · 10:20', carga: '10/10/26 · 11:00', ediciones: [{ by: 'Andrea Salazar', at: '17/10/26 · 09:40', motivo: 'Error de digitación confirmado con la matrícula', cambios: [{ k: 'veh_anio_modelo', campo: 'Año del modelo', antes: '2021', nuevo: '2022' }] }], campos: { veh_modelo: { v: 'CX-5', disc: { vals: [{ v: 'CX-5', f: 'Servicio de placas' }, { v: 'CX-30', f: 'Reconocimiento visual', conf: 71 }] } } } }, sucursal: 'Manta', lugar: 'Manta', clase: 'Jeep', carroceria: 'SUV', uso: 'Particular', discrep: 1, resultado: 'regla', envio: [{ regla: 'Kilometraje inconsistente', pct: '610 km' }, { regla: 'Discrepancias entre fuentes', pct: '' }], eventos: [['17/10/26 · 09:40', 'Reglas evaluadas nuevamente tras la edición · Enviado a calificación por regla: Kilometraje inconsistente (610 km), Discrepancias entre fuentes', 'Andrea Salazar'], ['17/10/26 · 09:40', 'Informe editado · MBC3345 · Año del modelo: 2021 → 2022 · Motivo: Error de digitación confirmado con la matrícula', 'Andrea Salazar'], ['10/10/26 · 11:05', 'Enviado a calificación por regla: Kilometraje inconsistente (610 km), Discrepancias entre fuentes', 'Sistema'], ['10/10/26 · 11:00', 'Informe de inspección registrado', 'Cristian Vaca']], conclusion: 'Enviado a calificación por reglas', hallazgos: ['Odómetro con lectura baja para la antigüedad', 'Odómetro: 610 km'] },
    ],
  };
  // Evidencias por riesgo: fotos de cada paso con fecha y hora, GPS, dispositivo, canal y marcas (galeria · bo · sin GPS).
  // Los informes enviados sin configuración propia reciben las fotos obligatorias de su modalidad desde la App del inspector, con GPS.
  (function () {
    const E = window.SIRIUS_EJEMPLO, MOD = { Presencial: 'P', 'Virtual guiada': 'V', 'Autoinspección': 'A', Documental: 'D' }, z = (n) => String(n).padStart(2, '0');
    const at = (base, k) => { const m = /(\d\d)\/(\d\d)\/(\d\d) · (\d\d):(\d\d)/.exec(base || '') || [0, '16', '10', '26', '09', '00']; const t = new Date(2000 + Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]) + k); return z(t.getDate()) + '/' + z(t.getMonth() + 1) + '/' + String(t.getFullYear()).slice(2) + ' · ' + z(t.getHours()) + ':' + z(t.getMinutes()); };
    const CFG = {
      '20196-V1': { canal: 'App del inspector', disp: 'Samsung Galaxy A54 · App del inspector 3.2', gps: [-0.1647, -78.4780], opt: { airbags_airbags: 2 },
        filas: { extras_extras: [['ext', 'Aros de aleación'], ['ext', 'Láminas de seguridad']], danos_danos: [['ave', 'Parachoques posterior'], ['ave', 'Puerta delantera derecha']] } },
      '20141-V1': { canal: 'Videollamada guiada', disp: 'Captura de videollamada guiada · SIRIUS Meet', gps: [-0.2006, -78.4327], filas: { danos_danos: [['ave', 'Parachoques posterior']] } },
      '20196-V3': { canal: 'Portal del cliente', disp: 'iPhone 13 · navegador Safari', gps: [-0.1890, -78.4890], reint: { identificacion_sticker_vin: 2 } },
      '20188-V1': { canal: 'Back-office', bo: { by: 'Daniela Ruiz' } },
      '20202-V1': { canal: 'App del inspector', disp: 'Samsung Galaxy A54 · App del inspector 3.2', gps: [-2.1709, -79.9224] },
      '20203-V1': { canal: 'App del inspector', disp: 'Samsung Galaxy A54 · App del inspector 3.2', gps: [-2.1894, -79.8891] },
      '20170-V1': { canal: 'App del inspector', disp: 'Motorola Edge 40 · App del inspector 3.2', gps: [0.3517, -78.1223], galeria: ['Kilometraje'],
        filas: { extras_extras: [['ext', 'Sistema de sonido']], danos_danos: [['ave', 'Guardafango delantero izquierdo']] } },
    };
    const build = (v, cfg) => { const M = MOD[v.modalidad] || 'P', inf = v.informe || {}, fotos = {}; let k = 0;
      PASOS.forEach(s => { const fl = (cfg.filas || {})[s.id], n = fl ? fl.length : s.req[M] ? Math.max(1, s.min) : ((cfg.opt || {})[s.id] || 0); if (!n || (cfg.omit || []).includes(s.name) || (s.vis && s.vis.k === 'veh_contrato_compraventa' && v.contrato === 'No')) return;
        fotos[s.id] = Array.from({ length: n }, (x, i) => { const gal = (cfg.galeria || []).includes(s.name) && i === 0, bo = cfg.bo, j = k++, g = cfg.gps || [-0.18, -78.48];
          return Object.assign({ id: v.riesgo + '-' + s.id + '-' + (i + 1), at: at(inf.inspeccion, Math.floor(j * (M === 'A' ? 0.4 : 0.9))), gps: gal || bo ? null : { lat: +(g[0] + ((j * 7) % 11 - 5) * 0.00001).toFixed(5), lng: +(g[1] + ((j * 5) % 9 - 4) * 0.00001).toFixed(5), prec: 4 + (j % 5) }, disp: bo ? 'Archivo subido desde el back-office' : cfg.disp || 'Samsung Galaxy A34 · App del inspector 3.2', canal: cfg.canal || inf.canal || 'App del inspector', marca: gal ? 'galeria' : bo ? 'bo' : '' }, bo ? { by: bo.by, meta: true, carga: inf.carga } : {},
            fl ? { fila: { g: fl[i][0], label: fl[i][1] } } : {}, (cfg.reint || {})[s.id] && i === 0 ? { reint: cfg.reint[s.id] } : {}); }); });
      // Etapa VF: la foto que ya existía del lateral izquierdo pasa al paso «de adelante hacia atrás»; el de «atrás hacia adelante» recibe una con los mismos metadatos, un minuto después.
      const ADE = 'exteriores_lateral_izquierdo_de_ade', ATR = 'exteriores_lateral_izquierdo_de_atr';
      if (fotos[ADE] && fotos[ATR]) { const prev = fotos[ATR]; fotos[ADE] = prev.map(f => Object.assign({}, f, { id: f.id.replace(ATR, ADE) })); fotos[ATR] = prev.map(f => Object.assign({}, f, { at: f.at ? at(f.at, 1) : f.at })); }
      return { fotos }; };
    // Los testigos del tablero no tienen valor por defecto: los informes enviados o devueltos los traen como dato leído de la foto del tablero.
    const TK = ['check_engine', 'abs', 'airbag', 'presion_aceite', 'bateria', 'temperatura', 'frenos'];
    E.vehiculos.forEach(v => { const inf = v.informe; if (!inf || !['Enviado', 'Devuelto'].includes(inf.estado) || !['Presencial', 'Virtual guiada'].includes(v.modalidad)) return; inf.campos = inf.campos || {}; TK.forEach(k => { if (!inf.campos['veh_testigo_' + k]) inf.campos['veh_testigo_' + k] = { v: 'Apagado', src: 'ext', doc: 'Foto del tablero', conf: 94 }; }); });
    E.evidencias = {};
    E.vehiculos.forEach(v => { const inf = v.informe; if (!inf || !['Enviado', 'Devuelto'].includes(inf.estado)) return; E.evidencias[v.riesgo] = build(v, CFG[v.riesgo] || {}); });
  })();
})();

// Etapa 11b-c · detalle de 20203 (Ana Lucía Mendoza Vera): tiene un riesgo con revisión de control, así que su detalle no sale de la derivación de un solo vehículo.
(function () { const E = window.SIRIUS_EJEMPLO; E.detallesCasos = E.detallesCasos || {};
  E.detallesCasos['20203'] = { same: true, sol: { nombre: 'Ana Lucía Mendoza Vera', ident: '0912345678', correo: 'ana.mendoza@gmail.com', tel: '098 734 5612', prov: 'Guayas', canton: 'Guayaquil', dir: 'Cdla. Kennedy Norte, Mz. 205 V. 12' },
    objTitle: 'Vehículos', obj: [], values: [], contacto: { nombre: 'Ana Lucía Mendoza Vera', cel: '0987345612', correo: 'ana.mendoza@gmail.com' },
    rec: { score: 28, nivel: 'Riesgo bajo', alertas: [], modalidad: 'Presencial', motivo: 'Vehículo particular de menos de tres años.' }, aps: '—', linea: 'Vehículos', tipo: 'Emisión nueva',
    califs: [{ title: 'Calificación', estado: 'Pendiente', obs: 'Cada vehículo se califica con su propio informe.', user: '—', fecha: '—' }], seg: null,
    insp: { modalidad: 'Presencial', inspector: 'Paola Vinueza', realizada: '15/10/26 · 10:05', lugarLabel: 'Dirección', lugar: 'Cdla. Kennedy Norte, Mz. 205 V. 12, Guayaquil' },
    events: [['16/10/26 · 09:15', 'Muestreo de control: GBF2290 seleccionado para revisión posterior (25 %)', 'Sistema'], ['15/10/26 · 11:05', 'Evaluación de determinación · GBF2290: Paola Vinueza, facultad efectiva Determinar solo Asegurable (asignada al inspector) · 11 reglas evaluadas · ninguna se cumple · Asegurable · Todo riesgo · Determinado por la inspectora · Paola Vinueza · 15/10/26 · 11:05', 'Sistema'], ['15/10/26 · 11:00', 'Informe de inspección registrado', 'Paola Vinueza'], ['14/10/26 · 16:00', 'Solicitud registrada · 1 vehículo', 'Santiago Ortiz']] };
})();

// Fecha de la demo: fija; la hora es la real del equipo. Todo evento nuevo (carga, envío, intento, edición) usa esta fecha.
(function () { const E = window.SIRIUS_EJEMPLO; E.fechaDemo = '2026-10-18'; E.horaDemo = '20:30';
  E.ahora = () => { const [y, m, dd] = E.fechaDemo.split('-').map(Number), [h, mi] = E.horaDemo.split(':').map(Number); return new Date(y, m - 1, dd, h, mi, 0); };
  E.hoy = () => { const [y, m, dd] = E.fechaDemo.split('-').map(Number); return new Date(y, m - 1, dd); }; })();

// Configuraciones de extracción automática por documento (tooltip del origen en el informe).
(function () { window.SIRIUS_EJEMPLO.configExtraccion = { 'Foto del tablero': { nombre: 'Tablero · testigos y odómetro', version: 1, vigencia: '01/08/26' }, 'Foto lateral derecha': { nombre: 'Carrocería · vista lateral', version: 1, vigencia: '01/08/26' }, 'Foto lateral izquierda': { nombre: 'Carrocería · vista lateral', version: 1, vigencia: '01/08/26' }, 'Matrícula': { nombre: 'Matrícula vehicular', version: 1, vigencia: '01/08/26' } }; })();

// Modelos de calificación (BO-25). Pesos de módulos y niveles en porcentaje; los puntos se derivan de la escala.
(function () { window.SIRIUS_EJEMPLO.modelosCalificacion = [
  { id: 'sv3', nombre: 'Scoring V3 – Ramos de ubicación', compania: 'Aseguradora del Sur', version: 1, estado: 'Borrador', vigenteDesde: null, plantilla: 'Ubicación – Ramos Generales', creado: '2026-10-18',
    escala: { min: 0, max: 100, dec: 1, sentido: 'Mayor es mejor', agregacion: 'Suma' },
    bandas: [
      { id: 'pref', etiqueta: 'Preferente', desde: 85, hasta: 100, color: '#2F6A0F', resultado: 'Asegurable', seguimientos: 'Ninguno' },
      { id: 'est', etiqueta: 'Estándar', desde: 70, hasta: 84.9, color: '#7BB342', resultado: 'Asegurable', seguimientos: 'Recomendaciones de mejora' },
      { id: 'sub', etiqueta: 'Subestándar', desde: 50, hasta: 69.9, color: '#C99A06', resultado: 'Asegurable con garantías', seguimientos: 'Garantías obligatorias · plazo de la garantía con mayor plazo' },
      { id: 'cri', etiqueta: 'Crítico', desde: 0, hasta: 49.9, color: '#9E1B0E', resultado: 'No asegurable', seguimientos: 'Envío a nivel 2 si se solicita excepción' } ],
    niveles: [
      { id: 'n1', etiqueta: 'Cumplimiento óptimo', desde: 90, hasta: 100, uso: 'Atenuante' },
      { id: 'n2', etiqueta: 'Cumplimiento estándar', desde: 70, hasta: 89, uso: '' },
      { id: 'n3', etiqueta: 'Deficiencia menor', desde: 50, hasta: 69, uso: '' },
      { id: 'n4', etiqueta: 'Factor de riesgo agravado', desde: 25, hasta: 49, uso: 'Agravante' },
      { id: 'n5', etiqueta: 'Incumplimiento crítico', desde: 0, hasta: 24, uso: 'Agravante' } ],
    modulos: [
      { id: 'A', nombre: 'Construcción', peso: 30, agregacion: 'Suma' },
      { id: 'B', nombre: 'Gestión y entorno', peso: 35, agregacion: 'Suma' },
      { id: 'C1', nombre: 'Protección incendio', peso: 20, agregacion: 'Suma' },
      { id: 'C2', nombre: 'Protección robo', peso: 15, agregacion: 'Suma' },
      { id: 'C3', nombre: 'Protección de equipo electrónico', peso: 15, agregacion: 'Suma', provisional: true } ],
    composicion: [
      { ramo: 'Incendio y líneas aliadas', mods: ['A', 'B', 'C1'] },
      { ramo: 'Robo', mods: ['A', 'B', 'C2'] },
      { ramo: 'Equipo electrónico', mods: ['A', 'B', 'C3'] },
      { ramo: 'Incendio y Robo', mods: ['A', 'B', 'C1', 'C2'] } ] },
  { id: 'eu5', nombre: 'Eurosurvey 1 a 5', compania: 'Aseguradora del Sur', version: 1, estado: 'Borrador', vigenteDesde: null, plantilla: 'Ubicación – Ramos Generales', creado: '2026-10-18',
    escala: { min: 1, max: 5, dec: 1, sentido: 'Mayor es mejor', agregacion: 'Promedio' },
    bandas: [], niveles: [], modulos: [], composicion: [] } ];
  window.SIRIUS_EJEMPLO.historialModelos = [
    { when: '18/10/26 · 08:50', by: 'Andrea Salazar', where: 'Eurosurvey 1 a 5 · versión 1', what: 'Creó el modelo en Borrador con escala 1 a 5 y agregación por promedio', motivo: '' },
    { when: '18/10/26 · 08:20', by: 'Andrea Salazar', where: 'Scoring V3 – Ramos de ubicación · versión 1', what: 'Creó el modelo en Borrador ligado a la plantilla «Ubicación – Ramos Generales»', motivo: 'Migración del Scoring V3 vigente en Excel' } ]; })();

// Criterios de Scoring V3 (2B). pct: peso en % del módulo · ref: puntos de referencia de la tabla (la tabla se guarda como fracción ref) · combina: combinación de instancias en bloques repetibles.
(function () { const E = window.SIRIUS_EJEMPLO, M = { A: 30, B: 35, C1: 20, C2: 15, C3: 15 };
  const C = (id, nombre, mod, campos, forma, ref, tabla, o) => Object.assign({ id, nombre, mod, campos, forma, pct: ref / M[mod] * 100, ref, tabla: tabla.map(t => ({ cuando: t[0], p: t[1], prov: !!t[2], manual: !!t[3] })), combina: '', admiteNA: false, naCuando: '' }, o || {});
  const AREA = 'Ponderado por área (rg_con_area)', PEOR = 'Peor caso';
  E.modelosCalificacion.find(m => m.id === 'sv3').criterios = [
    C('A.1', 'Paredes', 'A', ['rg_con_paredes'], 'Tabla de opciones', 8, [['Hormigón o bloque', 8], ['Metálica con gypsum', 5], ['Mixta', 2], ['Madera o combustible', 0]], { combina: AREA }),
    C('A.2', 'Techos', 'A', ['rg_con_techo'], 'Tabla de opciones', 7, [['Losa de hormigón', 7], ['Metálico o teja', 5], ['Traslúcido más de 30 %', 3], ['Paja o madera', 0]], { combina: AREA }),
    C('A.3', 'Estado', 'A', ['rg_con_conservacion'], 'Tabla de opciones', 8, [['Excelente o nuevo', 8], ['Bueno', 5], ['Regular', 2], ['Malo', 0]], { combina: AREA }),
    // nivel fijado por opción (si falta, el nivel sale del porcentaje)
    C('A.4', 'Pisos y altura', 'A', ['rg_con_pisos', 'rg_con_subsuelos'], 'Condición', 4, [['rg_con_pisos = 1–3 y rg_con_subsuelos = Sin subsuelos', 4], ['rg_con_pisos = 4–6 y rg_con_subsuelos = Sin subsuelos', 2], ['rg_con_pisos = Más de 6, o rg_con_subsuelos con subsuelo', 0]], { combina: PEOR }),
    C('A.5', 'Medios de egreso', 'A', ['rg_con_medios_egreso'], 'Tabla de opciones', 3, [['Existen y libres', 3], ['No existen u obstruidos', 0]], { combina: PEOR }),
    C('B.1', 'Mantenimiento eléctrico', 'B', ['rg_ele_mantenimiento'], 'Tabla de opciones', 10, [['Predictivo o termografía', 10], ['Preventivo con bitácora', 7], ['Correctivo', 3], ['Ninguno', 0]]),
    C('B.2', 'Orden y aseo', 'B', ['rg_ges_orden_aseo'], 'Tabla de opciones', 8, [['Excelente', 8], ['Regular o parcial', 4], ['Malo', 0]]),
    C('B.3', 'Actividad', 'B', ['rg_ocu_riesgo_ciiu'], 'Tabla de opciones', 10, [['Bajo', 10], ['Medio', 6], ['Alto', 0]]),
    C('B.4', 'Linderos', 'B', ['rg_lin_tipo_riesgo'], 'Tabla de opciones', 7, [['Vía pública', 7], ['Vivienda o riesgo ligero', 7], ['Comercio', 3], ['Industria', 0], ['Baldío', 0], ['Río o quebrada', 0], ['Otro', null, false, true]], { combina: 'Peor caso entre los 4 linderos' }),
    C('C.1', 'Detección', 'C1', ['rg_pci_det_existe', 'rg_pci_det_central'], 'Condición', 6, [['rg_pci_det_central = Centralizada, zonificada y supervisada', 6], ['rg_pci_det_central = Local o manual', 3], ['rg_pci_det_existe = No, o rg_pci_det_central = No tiene', 0]]),
    C('C.2', 'Extintores', 'C1', ['rg_pci_ext_existe', 'rg_pci_extintores', 'rg_pci_ext_requeridos', 'rg_pci_ext_mantenimiento'], 'Condición', 5, [['rg_pci_ext_existe = No', 0], ['Existen, suma de la columna «Cantidad» de rg_pci_extintores ≥ rg_pci_ext_requeridos y rg_pci_ext_mantenimiento = Vigente con etiqueta', 5], ['En otro caso', 2]]),
    C('C.3', 'Red hídrica', 'C1', ['rg_pci_red_tipo'], 'Mejor opción (selección múltiple)', 8, [['Rociadores', 8], ['Gabinetes con bomba', 6], ['Gabinetes sin bomba', 3, true], ['Hidrantes', 3, true], ['Sin red (rg_pci_red_existe = No)', 0]]),
    C('C.4', 'Brigadas', 'C1', ['rg_ges_brigadas'], 'Sí/No', 1, [['Sí', 1], ['No', 0]]),
    C('C.5', 'Seguridad física', 'C2', ['rg_rob_cerramiento', 'rg_rob_proteccion_adicional'], 'Condición', 5, [['rg_rob_cerramiento = Muro de hormigón o bloque, o cualquier cerramiento con Cerco eléctrico o Concertina', 5], ['Reja metálica, Malla o Mixto sin protección adicional', 3], ['rg_rob_cerramiento = Abierto', 0]]),
    C('C.6', 'Vigilancia y CCTV', 'C2', ['rg_rob_vig_existe', 'rg_rob_vig_turnos', 'rg_rob_vig_dias', 'rg_rob_alarma_existe', 'rg_rob_cctv_existe'], 'Condición', 10, [['Guardia 24 h (rg_rob_vig_turnos = 24 h o 2x12 y rg_rob_vig_dias = 7 días) + alarma + CCTV', 10], ['Guardia o alarma, con o sin CCTV', 7], ['Solo CCTV', 3], ['Nada', 0]]),
    C('C.7', 'Puesta a tierra', 'C3', ['rg_ee_tierra'], 'Tabla de opciones', 4, [['Medida 5 ohmios o menos con certificado', 4], ['Visible sin medición', 2], ['No tiene', 0]]),
    C('C.8', 'Respaldo de energía', 'C3', ['rg_ee_ups', 'rg_ee_supresor'], 'Condición', 3, [['rg_ee_ups = Sí y rg_ee_supresor = Sí', 3], ['Solo uno de los dos', 2], ['Ninguno', 0]]),
    C('C.9', 'Ambiente del cuarto técnico', 'C3', ['rg_ee_climatizacion', 'rg_ee_cuarto_humedad'], 'Condición', 3, [['Climatización dedicada y Sin humedad ni desagües encima', 3], ['Solo uno de los dos', 1], ['Ninguno', 0]], { admiteNA: true, naCuando: 'rg_ee_cuarto_existe = No' }),
    C('C.10', 'Extinción apta', 'C3', ['rg_ee_extintor_tipo'], 'Tabla de opciones', 3, [['CO2 o agente limpio', 3], ['Solo PQS', 1], ['No tiene', 0]]),
    C('C.11', 'Mantenimiento de equipos', 'C3', ['rg_ee_plan_mantenimiento'], 'Tabla de opciones', 2, [['Contrato vigente', 2], ['Interno con registro', 1], ['Sin plan', 0]]) ];
  E.renombresClaves = E.renombresClaves || []; })();

// Reglas de severidad de Scoring V3 (2C). Se evalúan después del puntaje y solo suben la exigencia. Las ve el calificador.
// cond.t: modulo (mod '*' = cualquiera, % de su máximo) · criterio (pts) · campo · banda (op 'peor' = igual o peor) · ncrit (módulos críticos)
(function () { const E = window.SIRIUS_EJEMPLO, m = E.modelosCalificacion.find(x => x.id === 'sv3');
  const ef = (o) => Object.assign({ garantia: false, garantias: [], tope: false, banda: 'sub', nivel2: false, alerta: false }, o);
  m.severidad = [
    { id: 's1', nombre: 'Módulo crítico', tipo: 'regla', join: 'o', conds: [{ t: 'modulo', mod: '*', op: '<', v: 40 }], efectos: ef({ garantia: true, garantias: ['Garantía del módulo crítico'], tope: true, banda: 'sub', alerta: true }), ramos: [], giros: [], msg: 'Un módulo quedó bajo el 40 % de su máximo. Se exige su garantía y el resultado no puede pasar de Subestándar.', activa: true },
    { id: 's2', nombre: 'Sin detección en ocupaciones con público', tipo: 'regla', join: 'o', conds: [{ t: 'criterio', crit: 'C.1', op: '=', v: 0 }], efectos: ef({ garantia: true, garantias: ['Sistema de detección y alarma contra incendio'], alerta: true }), ramos: ['Incendio y líneas aliadas', 'Incendio y Robo'], giros: ['Comercial', 'Educación', 'HORECA', 'Servicios', 'Industrial'], msg: 'No tiene detección y la ocupación recibe público. Exige el sistema de detección y alarma.', activa: true },
    { id: 's3', nombre: 'Sin permiso de bomberos', tipo: 'regla', join: 'o', conds: [{ t: 'campo', k: 'rg_bom_permiso', op: 'en', vals: ['No presentado', 'Vencido'] }], efectos: ef({ garantia: true, garantias: ['Permiso de bomberos vigente del año en curso'], alerta: true }), ramos: [], giros: ['Comercial', 'Industrial', 'Servicios', 'HORECA', 'Educación', 'Estación de servicios'], msg: 'El permiso de bomberos no está vigente o no se presentó. En este giro es requerido.', activa: true },
    { id: 's4', nombre: 'Sin extintores', tipo: 'regla', join: 'o', conds: [{ t: 'criterio', crit: 'C.2', op: '=', v: 0 }], efectos: ef({ garantia: true, garantias: ['Extintores vigentes y recargados'], tope: true, banda: 'sub', alerta: true }), ramos: ['Incendio y líneas aliadas', 'Incendio y Robo'], giros: [], msg: 'No hay extintores. Se exigen extintores vigentes y el resultado no puede pasar de Subestándar.', activa: true },
    { id: 's5', nombre: 'Riesgo crítico', tipo: 'regla', join: 'o', conds: [{ t: 'banda', op: '=', b: 'cri' }, { t: 'ncrit', op: '>=', v: 2 }], efectos: ef({ nivel2: true, alerta: true }), ramos: [], giros: [], msg: 'Banda Crítico o dos o más módulos críticos. Requiere evaluación de suscripción (nivel 2).', activa: true },
    { id: 's6', nombre: 'Exclusión de política', tipo: 'exclusion', activa: true } ];
  E.girosRG = ['Casa habitación', 'Edificios', 'HORECA', 'Educación', 'Comercial', 'Servicios', 'Construcción', 'Industrial', 'Estación de servicios', 'Cooperativas']; })();

// Etapa 2D: caso 20200 (Alianza Francesa) e informes de muestra del simulador. valores: clave → valor; los campos de bloques repetibles van como lista (una por instancia).
(function () { const E = window.SIRIUS_EJEMPLO;
  const AF = { rg_con_area: [780], rg_con_paredes: ['Hormigón o bloque'], rg_con_techo: ['Traslúcido más de 30 %'], rg_con_conservacion: ['Bueno'], rg_con_pisos: ['1–3'], rg_con_subsuelos: ['Sin subsuelos'], rg_con_medios_egreso: ['Existen y libres'],
    rg_lin_tipo_riesgo: ['Vía pública', 'Vía pública', 'Vía pública', 'Vivienda o riesgo ligero'], rg_lin_orientacion: ['Norte', 'Sur', 'Este', 'Oeste'],
    rg_ele_mantenimiento: 'Ninguno', rg_ges_orden_aseo: 'Excelente', rg_ocu_riesgo_ciiu: 'Bajo', rg_ocu_riesgo_nfpa: 'Ligero',
    rg_pci_det_existe: 'Sí', rg_pci_det_tipo: ['Pulsadores manuales'], rg_pci_det_central: 'Local o manual', rg_pci_det_instalados: 0, rg_pci_det_requeridos: 10,
    rg_pci_ext_existe: 'Sí', rg_pci_extintores: [{ 'Agente (PQS, CO2, Agua, Agente limpio, Clase K)': 'PQS', 'Capacidad (lb)': 10, Cantidad: 3 }], rg_pci_ext_requeridos: 3, rg_pci_ext_mantenimiento: 'Sin evidencia',
    rg_pci_red_existe: 'No', rg_pci_red_tipo: [], rg_pci_reserva_m3: 60, rg_pci_reserva_exclusiva: 'No', rg_ges_brigadas: 'No', rg_ges_plan_emergencia: 'No existe', rg_bom_permiso: 'No presentado' };
  E.casos.push({ id: '20200', orden: '', ramo: 'Incendio y líneas aliadas', broker: 'Directo', asegurado: 'Alianza Francesa de Cuenca', ident: '0190117898001', placa: '', bien: 'Sede de la Alianza Francesa, Cuenca', fecha: '2026-10-16', sucursal: 'Cuenca', ciudad: 'Cuenca (Azuay)', giro: 'Educación', backoffice: 'Verónica Lema', estado: 'En calificación', responsable: 'Verónica Lema', comercial: 'Santiago Ortiz',
    nota: 'Resultado del informe original de Eurosurvey: 3,1 en escala 1 a 5',
    informe: { estado: 'Enviado', plantilla: 'Ubicación – Ramos Generales', version: 1, inspector: 'Diana Cárdenas', agencia: 'Eurosurvey', fecha: '2026-10-17', valores: AF } });
  E.eventos = E.eventos || {}; E.eventos['20200'] = [['17/10/26 · 16:10', 'Nota: Resultado del informe original de Eurosurvey: 3,1 en escala 1 a 5', 'Diana Cárdenas'], ['17/10/26 · 16:05', 'Informe enviado a calificación · plantilla «Ubicación – Ramos Generales» v1', 'Diana Cárdenas']];
  const G = { rg_con_area: [1000], rg_con_paredes: ['Hormigón o bloque'], rg_con_techo: ['Losa de hormigón'], rg_con_conservacion: ['Excelente o nuevo'], rg_con_pisos: ['1–3'], rg_con_subsuelos: ['Sin subsuelos'], rg_con_medios_egreso: ['Existen y libres'],
    rg_lin_tipo_riesgo: ['Vía pública', 'Vía pública', 'Vía pública', 'Vía pública'], rg_ele_mantenimiento: 'Predictivo o termografía', rg_ges_orden_aseo: 'Excelente', rg_ocu_riesgo_ciiu: 'Bajo',
    rg_pci_det_existe: 'Sí', rg_pci_det_central: 'Centralizada, zonificada y supervisada', rg_pci_ext_existe: 'Sí', rg_pci_extintores: [{ Cantidad: 6 }], rg_pci_ext_requeridos: 4, rg_pci_ext_mantenimiento: 'Vigente con etiqueta', rg_pci_red_existe: 'Sí', rg_pci_red_tipo: ['Rociadores'], rg_ges_brigadas: 'Sí',
    rg_rob_cerramiento: 'Muro de hormigón o bloque', rg_rob_proteccion_adicional: ['Ninguna'], rg_rob_vig_existe: 'Sí', rg_rob_vig_turnos: '24 h', rg_rob_vig_dias: '7 días', rg_rob_alarma_existe: 'Sí', rg_rob_cctv_existe: 'Sí',
    rg_ee_cuarto_existe: 'Sí', rg_ee_tierra: 'Medida 5 ohmios o menos con certificado', rg_ee_ups: 'Sí', rg_ee_supresor: 'Sí', rg_ee_climatizacion: 'Climatización dedicada', rg_ee_cuarto_humedad: 'Sin humedad ni desagües encima', rg_ee_extintor_tipo: 'CO2 o agente limpio', rg_ee_plan_mantenimiento: 'Contrato vigente', rg_bom_permiso: 'Vigente del año en curso' };
  const M = (n, nombre, ramo, giro, o) => ({ id: 'M' + String(n).padStart(2, '0'), muestra: true, nombre, ramo, giro, valores: Object.assign(JSON.parse(JSON.stringify(G)), o || {}) });
  E.muestraSimulador = [
    M(1, 'Almacén de electrodomésticos', 'Incendio y líneas aliadas', 'Comercial'),
    M(2, 'Restaurante de comida rápida', 'Incendio y líneas aliadas', 'HORECA', { rg_con_techo: ['Metálico o teja'], rg_con_conservacion: ['Bueno'], rg_ele_mantenimiento: 'Preventivo con bitácora', rg_ges_orden_aseo: 'Regular o parcial', rg_ocu_riesgo_ciiu: 'Medio', rg_pci_red_tipo: ['Gabinetes con bomba'] }),
    M(3, 'Ferretería de barrio', 'Robo', 'Comercial', { rg_ocu_riesgo_ciiu: 'Medio', rg_ges_orden_aseo: 'Regular o parcial', rg_rob_cerramiento: 'Reja metálica', rg_rob_vig_turnos: '1x12', rg_rob_vig_dias: '6 días', rg_rob_alarma_existe: 'No', rg_rob_cctv_existe: 'No' }),
    M(4, 'Bodega de repuestos', 'Robo', 'Servicios', { rg_con_paredes: ['Mixta'], rg_con_conservacion: ['Regular'], rg_ele_mantenimiento: 'Correctivo', rg_ges_orden_aseo: 'Regular o parcial', rg_ocu_riesgo_ciiu: 'Medio', rg_lin_tipo_riesgo: ['Comercio', 'Vía pública', 'Comercio', 'Vía pública'], rg_rob_cerramiento: 'Abierto', rg_rob_vig_existe: 'No', rg_rob_alarma_existe: 'No' }),
    M(5, 'Centro de datos regional', 'Equipo electrónico', 'Servicios', { rg_ee_tierra: 'Visible sin medición', rg_ee_supresor: 'No', rg_ee_cuarto_humedad: 'Con riesgo de agua', rg_ee_extintor_tipo: 'Solo PQS', rg_ee_plan_mantenimiento: 'Interno con registro' }),
    M(6, 'Unidad educativa · laboratorio', 'Equipo electrónico', 'Educación', { rg_con_techo: ['Metálico o teja'], rg_con_conservacion: ['Bueno'], rg_ele_mantenimiento: 'Preventivo con bitácora', rg_ges_orden_aseo: 'Regular o parcial', rg_ee_cuarto_existe: 'No', rg_ee_tierra: 'No tiene', rg_ee_ups: 'No', rg_ee_supresor: 'No', rg_ee_extintor_tipo: 'No tiene', rg_ee_plan_mantenimiento: 'Sin plan' }),
    M(7, 'Planta de plásticos', 'Incendio y Robo', 'Industrial', { rg_lin_tipo_riesgo: ['Industria', 'Vía pública', 'Industria', 'Vía pública'], rg_ocu_riesgo_ciiu: 'Alto', rg_pci_det_central: 'Local o manual', rg_pci_ext_existe: 'No', rg_pci_extintores: [], rg_pci_red_tipo: ['Gabinetes sin bomba'], rg_rob_vig_turnos: '1x12' }),
    M(8, 'Colegio particular', 'Incendio y líneas aliadas', 'Educación', { rg_pci_det_existe: 'No', rg_pci_det_central: 'No tiene' }),
    M(9, 'Vivienda de adobe con taller', 'Incendio y líneas aliadas', 'Casa habitación', { rg_con_paredes: ['Madera o combustible'], rg_con_techo: ['Paja o madera'], rg_con_conservacion: ['Malo'], rg_con_pisos: ['4–6'], rg_con_medios_egreso: ['No existen u obstruidos'], rg_ele_mantenimiento: 'Ninguno', rg_ges_orden_aseo: 'Malo', rg_lin_tipo_riesgo: ['Baldío', 'Vía pública', 'Vivienda o riesgo ligero', 'Vía pública'], rg_pci_det_existe: 'No', rg_pci_det_central: 'No tiene', rg_pci_ext_existe: 'No', rg_pci_extintores: [], rg_pci_red_existe: 'No', rg_pci_red_tipo: [], rg_ges_brigadas: 'No', rg_bom_permiso: 'No presentado' }),
    M(10, 'Hotel boutique', 'Robo', 'HORECA', { rg_con_techo: ['Metálico o teja'], rg_ges_orden_aseo: 'Regular o parcial', rg_ele_mantenimiento: 'Preventivo con bitácora', rg_con_conservacion: ['Bueno'] }),
    M(11, 'Supermercado de barrio', 'Incendio y Robo', 'Comercial', { rg_con_techo: ['Traslúcido más de 30 %'], rg_con_conservacion: ['Bueno'], rg_ele_mantenimiento: 'Preventivo con bitácora', rg_ges_orden_aseo: 'Regular o parcial', rg_pci_det_central: 'Local o manual', rg_pci_red_tipo: ['Gabinetes con bomba'], rg_rob_cerramiento: 'Reja metálica', rg_rob_proteccion_adicional: ['Cerco eléctrico'], rg_rob_vig_turnos: '1x12', rg_rob_cctv_existe: 'No', rg_bom_permiso: 'Vencido' }),
    M(12, 'Gasolinera', 'Incendio y líneas aliadas', 'Estación de servicios', { rg_ocu_riesgo_ciiu: 'Alto', rg_ele_mantenimiento: 'Correctivo' }) ]; })();

// Base: Scoring V3 v1 publicada (Vigente desde 18/10/26) y ligada a la plantilla. A.3 «Bueno» fija su nivel en Cumplimiento estándar.
(function () { const E = window.SIRIUS_EJEMPLO, m = E.modelosCalificacion.find(x => x.id === 'sv3');
  m.criterios.find(c => c.id === 'A.3').tabla.find(r => r.cuando === 'Bueno').nivel = 'n2';
  m.estado = 'Vigente'; m.vigenteDesde = '18/10/26'; m.vigenteVersion = 1;
  m.publicado = JSON.parse(JSON.stringify({ escala: m.escala, bandas: m.bandas, niveles: m.niveles, modulos: m.modulos, composicion: m.composicion, criterios: m.criterios, severidad: m.severidad }));
  E.historialModelos.unshift({ when: '18/10/26 · 09:45', by: 'Andrea Salazar', where: 'Scoring V3 – Ramos de ubicación · versión 1', what: 'Publicó la versión 1, vigente desde 18/10/26 y ligada a la plantilla «Ubicación – Ramos Generales»', motivo: 'Reemplaza la matriz Scoring V3 en Excel' }); })();

// Etapa 3 · Catálogo de seguimientos (BO-26). tipo: Garantía · Documento · Preexistencia · Recomendación de mejora. relacion: criterio o clave del formulario.
(function () { const E = window.SIRIUS_EJEMPLO, INC = 'Incendio y líneas aliadas', ROB = 'Robo', DYV = 'Dinero y valores', EE = 'Equipo electrónico', EM = 'Equipo y maquinaria', RM = 'Rotura de maquinaria';
  const I = (codigo, titulo, tipo, ramos, o) => Object.assign({ id: codigo.toLowerCase(), codigo, titulo, tipo, ramos, solucion: '', plazo: 60, relacion: '', estado: 'Vigente', version: 1 }, o);
  E.catalogoSeguimientos = [
    I('GAR-INC-01', 'Permiso de bomberos vigente del año en curso', 'Garantía', [INC], { solucion: 'Obtén o renueva el permiso de funcionamiento del Cuerpo de Bomberos de tu cantón para el año en curso.', plazo: 45, relacion: 'rg_bom_permiso' }),
    I('GAR-INC-02', 'Extintores vigentes y recargados', 'Garantía', [INC], { solucion: 'Recarga los extintores vencidos e instala los que faltan según el área y el tipo de riesgo.', plazo: 30, relacion: 'C.2' }),
    I('GAR-INC-03', 'Sistema de detección y alarma contra incendio', 'Garantía', [INC], { solucion: 'Instala un sistema de detección y alarma con central zonificada, detectores, pulsadores y señales acústicas y ópticas en todas las áreas.', plazo: 90, relacion: 'C.1' }),
    I('GAR-INC-04', 'Detectores de humo', 'Garantía', [INC], { solucion: 'Instala detectores de humo en oficinas, bodegas y áreas de almacenamiento.', plazo: 60, relacion: 'rg_pci_det_tipo' }),
    I('GAR-INC-05', 'Red hídrica', 'Garantía', [INC], { solucion: 'Implementa una red hídrica contra incendio con gabinetes, bomba y reserva de agua exclusiva.', plazo: 120, relacion: 'C.3' }),
    I('GAR-INC-06', 'Rociadores', 'Garantía', [INC], { solucion: 'Instala rociadores automáticos en las áreas de mayor carga combustible.', plazo: 180, relacion: 'C.3' }),
    I('GAR-INC-07', 'Plan de emergencia y evacuación', 'Garantía', [INC], { solucion: 'Elabora el plan de emergencia, señaliza las rutas de evacuación y capacita a tu personal.', plazo: 90, relacion: 'rg_ges_plan_emergencia' }),
    I('GAR-ROB-01', 'Guardianía', 'Garantía', [ROB], { solucion: 'Contrata guardianía para el horario sin actividad.', plazo: 30, relacion: 'rg_rob_vig_existe' }),
    I('GAR-ROB-02', 'Guardianía armada 8 horas laborables', 'Garantía', [ROB], { solucion: 'Contrata guardianía armada durante las 8 horas laborables.', plazo: 30, relacion: 'rg_rob_vig_turnos' }),
    I('GAR-ROB-03', 'Guardianía armada 24/7', 'Garantía', [ROB], { solucion: 'Contrata guardianía armada las 24 horas, los 7 días de la semana.', plazo: 30, relacion: 'C.6' }),
    I('GAR-ROB-04', 'CCTV', 'Garantía', [ROB], { solucion: 'Instala cámaras en accesos, perímetro y áreas de valor, con grabación de al menos 30 días.', plazo: 60, relacion: 'rg_rob_cctv_existe' }),
    I('GAR-ROB-05', 'Alarma contra robo', 'Garantía', [ROB], { solucion: 'Instala una alarma contra intrusión con sensores en accesos y zonas de valor.', plazo: 45, relacion: 'rg_rob_alarma_existe' }),
    I('GAR-ROB-06', 'Monitoreo y respuesta armada', 'Garantía', [ROB], { solucion: 'Contrata monitoreo de la alarma con respuesta armada.', plazo: 45, relacion: 'C.6' }),
    I('GAR-ROB-07', 'Sensores de movimiento', 'Garantía', [ROB], { solucion: 'Instala sensores de movimiento en bodegas y áreas sin vigilancia.', plazo: 60, relacion: 'rg_rob_alarma_existe' }),
    I('GAR-ROB-08', 'Sensores en puertas y ventanas', 'Garantía', [ROB], { solucion: 'Instala sensores magnéticos en puertas y ventanas exteriores.', plazo: 60, relacion: 'rg_rob_ventanas' }),
    I('GAR-DYV-01', 'Vidrios blindados en el área de caja', 'Garantía', [DYV], { solucion: 'Instala vidrios blindados en las ventanillas y el área de caja.', plazo: 90, relacion: 'm14' }),
    I('GAR-DYV-02', 'Botón de pánico', 'Garantía', [DYV], { solucion: 'Instala un botón de pánico en caja conectado a la central de monitoreo.', plazo: 30, relacion: 'm14' }),
    I('GAR-DYV-03', 'Caja fuerte empotrada al piso o pared', 'Garantía', [DYV], { solucion: 'Empotra la caja fuerte al piso o a la pared.', plazo: 30, relacion: 'm14' }),
    I('GAR-DYV-04', 'Resguardo policial para el traslado de dinero', 'Garantía', [DYV], { solucion: 'Solicita resguardo policial para cada traslado de dinero.', plazo: 30, relacion: 'm14' }),
    I('GAR-DYV-05', 'Empresa de seguridad o blindado para el traslado de dinero', 'Garantía', [DYV], { solucion: 'Contrata una empresa de transporte de valores o un blindado para los traslados.', plazo: 30, relacion: 'm14' }),
    I('DOC-01', 'Bitácoras y cronograma de mantenimientos', 'Documento', [EE, EM, RM], { solucion: 'Envía las bitácoras del último año y el cronograma de mantenimiento de tus equipos.', plazo: 30, relacion: 'C.11' }),
    I('DOC-02', 'Listado detallado y valorado de bienes', 'Documento', [EE, EM, RM], { solucion: 'Envía el listado de equipos con marca, modelo, serie y valor.', plazo: 30, relacion: 'm15' }),
    I('DOC-03', 'Copia del permiso de bomberos', 'Documento', [INC], { solucion: 'Envía una copia legible del permiso de funcionamiento de Bomberos.', plazo: 15, relacion: 'rg_bom_doc_permiso' }),
    I('DOC-04', 'Plan de emergencia aprobado', 'Documento', [INC], { solucion: 'Envía el plan de emergencia aprobado por la autoridad.', plazo: 30, relacion: 'rg_ges_doc_plan' }),
    I('DOC-05', 'Certificados de mantenimiento y recarga de extintores', 'Documento', [INC], { solucion: 'Envía los certificados vigentes de mantenimiento y recarga de los extintores.', plazo: 30, relacion: 'rg_pci_ext_mantenimiento' }),
    I('REC-01', 'Rotular tableros y señalizar riesgo eléctrico', 'Recomendación de mejora', [INC], { solucion: 'Rotula los circuitos de cada tablero y coloca señales de riesgo eléctrico.', plazo: 180, relacion: 'rg_ele_mantenimiento' }),
    I('REC-02', 'Levantar diagrama unifilar y planos eléctricos', 'Recomendación de mejora', [INC, EE], { solucion: 'Levanta el diagrama unifilar y los planos eléctricos actualizados.', plazo: 180, relacion: 'm06' }),
    I('REC-03', 'Mantenimiento profesional de extintores con registro mensual', 'Recomendación de mejora', [INC], { solucion: 'Contrata el mantenimiento de extintores y registra la inspección mensual en su tarjeta.', plazo: 180, relacion: 'C.2' }),
    I('REC-04', 'Sectorizar áreas de mayor carga combustible', 'Recomendación de mejora', [INC], { solucion: 'Separa con muros o distancias las áreas de mayor carga combustible.', plazo: 180, relacion: 'm18' }),
    I('REC-05', 'Proteger elementos no estructurales ante sismo', 'Recomendación de mejora', [INC, EE], { solucion: 'Ancla estanterías, equipos y elementos colgantes para que no caigan en un sismo.', plazo: 180, relacion: 'm04' }) ];
  E.historialCatalogo = [{ when: '18/10/26 · 08:30', by: 'Andrea Salazar', where: 'Catálogo de seguimientos', what: 'Cargó 30 ítems iniciales: 20 garantías, 5 documentos y 5 recomendaciones de mejora', motivo: 'Carga inicial de la etapa 3' }];
  // Reglas de severidad: «Exigir garantía» elige ítems del catálogo. Módulo crítico: un ítem por módulo de calificación.
  ['sv3'].forEach(id => { const m = E.modelosCalificacion.find(x => x.id === id), link = (sid, o) => { const r = m.severidad.find(x => x.id === sid); Object.assign(r.efectos, o); delete r.efectos.garantias; };
    link('s1', { garantia: true, porModulo: { A: '', B: '', C1: 'gar-inc-03', C2: 'gar-rob-05', C3: 'doc-01' }, items: [] });
    link('s2', { items: ['gar-inc-03'] }); link('s3', { items: ['gar-inc-01'] }); link('s4', { items: ['gar-inc-02'] });
    ['s5'].forEach(s => { m.severidad.find(x => x.id === s).efectos.items = []; delete m.severidad.find(x => x.id === s).efectos.garantias; });
    m.publicado = JSON.parse(JSON.stringify(Object.assign({}, m.publicado, { severidad: m.severidad }))); }); })();

// Preexistencias del catálogo (3B).
(function () { const E = window.SIRIUS_EJEMPLO, R = ['Incendio y líneas aliadas', 'Robo', 'Dinero y valores', 'Equipo electrónico', 'Equipo y maquinaria', 'Rotura de maquinaria'], P = (n, titulo, sol, rel) => ({ id: 'pre-' + n, codigo: 'PRE-' + n, titulo, tipo: 'Preexistencia', ramos: R, solucion: sol, plazo: 90, relacion: rel, estado: 'Vigente', version: 1 });
  E.catalogoSeguimientos.push(
    P('01', 'Fisuras estructurales', 'Repara las fisuras en elementos estructurales con un profesional y envía su informe.', 'm05'),
    P('02', 'Humedad activa en muros o cubierta', 'Elimina la filtración y repara los muros o la cubierta afectados.', 'm05'),
    P('03', 'Corrosión de armaduras o estructura metálica', 'Trata la corrosión y protege la estructura metálica o las armaduras expuestas.', 'm05'),
    P('04', 'Asentamientos diferenciales', 'Haz evaluar los asentamientos por un ingeniero estructural y aplica su solución.', 'm05'),
    P('05', 'Daños por sismos anteriores', 'Repara los daños de sismos anteriores y envía el informe del profesional.', 'm04'),
    P('06', 'Instalación eléctrica deteriorada', 'Cambia el cableado y los tableros deteriorados con un electricista calificado.', 'm06'));
  E.historialCatalogo.unshift({ when: '18/10/26 · 10:15', by: 'Andrea Salazar', where: 'Catálogo de seguimientos', what: 'Agregó 6 preexistencias (PRE-01 a PRE-06)', motivo: '' }); })();

// Etapa 10a · DEC-077: norma, prioridad, evidencia, hallazgo y ubicación de cada ítem salen de datos-catalogos-maestros.js (fuente única; aquí ya no se repiten).
(function () { const E = window.SIRIUS_EJEMPLO, S = (window.SIRIUS_CATALOGOS_MAESTROS || {}).seguimientos || [];
  E.catalogoSeguimientos.forEach(x => { const s = S.find(z => z.codigo === x.codigo) || {}; ['norma', 'prioridad', 'evidencia', 'hallazgo', 'ubicacion'].forEach(k => { x[k] = s[k] || ''; }); }); })();

// Etapa 3B · Matriz de garantías mínimas por ramo y giro, reglas de sustitución y calificación guardada del caso 20200.
// fila: ítem del catálogo · giros donde se exige · cond: se exige solo si (campo numérico; suma las instancias). «Ya cumple» sale solo de la condición de cumplimiento del ítem del catálogo.
(function () { const E = window.SIRIUS_EJEMPLO, INC = 'Incendio y líneas aliadas', ROB = 'Robo', DYV = 'Dinero y valores', EE = 'Equipo electrónico', EM = 'Equipo y maquinaria', RM = 'Rotura de maquinaria', TRC = 'Todo riesgo construcción', PUB = ['Comercial', 'Educación', 'HORECA', 'Servicios', 'Industrial', 'Estación de servicios'];
  // «Se considera cumplido si…» del catálogo: criterio del modelo vigente (t: criterio) o campo del formulario (t: campo). Sin condición, el ítem nunca sale como «Ya cumple».
  const CU = { 'gar-inc-02': { t: 'criterio', crit: 'C.2', op: '=', v: 5 }, 'gar-inc-03': { t: 'criterio', crit: 'C.1', op: '=', v: 6 }, 'gar-inc-01': { t: 'campo', k: 'rg_bom_permiso', vals: ['Vigente del año en curso'] },
    'gar-rob-01': { t: 'campo', k: 'rg_rob_vig_existe', vals: ['Sí'] }, 'gar-rob-04': { t: 'campo', k: 'rg_rob_cctv_existe', vals: ['Sí'] }, 'gar-rob-05': { t: 'campo', k: 'rg_rob_alarma_existe', vals: ['Sí'] } };
  E.catalogoSeguimientos.forEach(x => { x.cumplido = CU[x.id] || null; });
  E.historialCatalogo.unshift({ when: '18/10/26 · 11:40', by: 'Andrea Salazar', where: 'Matriz de garantías', what: 'Cargó la matriz inicial (11 garantías en 4 ramos) y 3 reglas de sustitución', motivo: 'Envío 3B: la red hídrica se exige desde 1.000 m² de construcción' }); })();


// Envío 3C · Políticas de suscripción (BO-26, provisional). Solo las ven el calificador y el Suscriptor; el inspector nunca.
// grupos: se cumple la política si se cumple algún grupo (o); dentro del grupo, todas las condiciones (y). conds: { k, op: 'menor' | 'mayor' | 'igual' | 'es' | 'catalogo', a, vals, cat }.
// consecuencias: alerta (Mostrar alerta) · nivel2 (Requerir evaluación de suscripción) · noAsegurable (Sugerir No asegurable salvo excepción).
(function () { const E = window.SIRIUS_EJEMPLO, INC = 'Incendio y líneas aliadas';
  E.catalogos = E.catalogos || {};
  E.catalogos.provinciaRegion = { Esmeraldas: 'Costa', 'Manabí': 'Costa', 'Santa Elena': 'Costa', Guayas: 'Costa', 'Los Ríos': 'Costa', 'El Oro': 'Costa', 'Santo Domingo de los Tsáchilas': 'Costa',
    Carchi: 'Sierra', Imbabura: 'Sierra', Pichincha: 'Sierra', Cotopaxi: 'Sierra', Tungurahua: 'Sierra', 'Bolívar': 'Sierra', Chimborazo: 'Sierra', 'Cañar': 'Sierra', Azuay: 'Sierra', Loja: 'Sierra',
    'Sucumbíos': 'Oriente', Napo: 'Oriente', Orellana: 'Oriente', Pastaza: 'Oriente', 'Morona Santiago': 'Oriente', 'Zamora Chinchipe': 'Oriente', 'Galápagos': 'Galápagos' };
  // Catálogo editable «Actividades excluidas» (códigos CIIU provisionales).
  E.catalogos.actividadesExcluidas = [{ codigo: 'C1610.01', nombre: 'Aserraderos' }, { codigo: 'C1610.02', nombre: 'Procesamiento de madera de balsa' }];
  // Campo calculado rg_ubi_region en el módulo de ubicación, junto a la provincia.
  (E.modulos || []).forEach(mo => (mo.estructura || []).forEach(sc => { const c = sc.campos || [], i = c.findIndex(x => x.k === 'rg_ubi_provincia');
    if (i >= 0 && !c.some(x => x.k === 'rg_ubi_region')) c.splice(i + 1, 0, Object.assign({}, c[i], { k: 'rg_ubi_region', l: 'Región', t: 'Cálculo', req: false, ro: true, alias: '', origen: 'Sistema', opts: ['Costa', 'Sierra', 'Oriente', 'Galápagos'], formula: 'Según la provincia (catálogo provincia → región)', nota: '' })); }));
  const fuente = (sec) => ({ doc: 'Manual de suscripción de Ramos Generales (borrador)', sec });
  E.politicasSuscripcion = [
    { id: 'pol01', codigo: 'POL-01', nombre: 'Cercanía al mar', ramos: [INC], giros: [], tipo: 'Absoluta', excepcion: 'Reaseguros', join: 'o',
      grupos: [{ conds: [{ k: 'rg_ubi_dist_mar', op: 'menor', a: 250 }] }], consecuencias: ['nivel2', 'noAsegurable'],
      texto: 'No se aseguran riesgos a menos de 250 m del mar sin aprobación de Reaseguros.', fuente: fuente('Sección 4.2 · Riesgos costeros'), desde: '2026-10-01', hasta: '', activa: true },
    { id: 'pol02', codigo: 'POL-02', nombre: 'Cercanía a ríos, esteros o quebradas', ramos: [INC], giros: [], tipo: 'Absoluta', excepcion: 'Reaseguros', join: 'o',
      grupos: [{ conds: [{ k: 'rg_ubi_dist_rio', op: 'menor', a: 300 }] }], consecuencias: ['nivel2', 'noAsegurable'],
      texto: 'No se aseguran riesgos a menos de 300 m de ríos, esteros o quebradas sin aprobación de Reaseguros.', fuente: fuente('Sección 4.3 · Riesgos hídricos'), desde: '2026-10-01', hasta: '', activa: true },
    { id: 'pol03', codigo: 'POL-03', nombre: 'Antigüedad de la construcción', ramos: [INC], giros: [], tipo: 'Relativa', excepcion: 'Inspección favorable', join: 'o',
      grupos: [{ conds: [{ k: 'rg_ubi_region', op: 'es', vals: ['Costa'] }, { k: 'rg_con_edad', op: 'mayor', a: 30 }] }, { conds: [{ k: 'rg_ubi_region', op: 'es', vals: ['Sierra', 'Oriente', 'Galápagos'] }, { k: 'rg_con_edad', op: 'mayor', a: 40 }] }],
      consecuencias: ['alerta', 'nivel2'], texto: 'Las construcciones de más de 30 años en la Costa o de más de 40 años en la Sierra, el Oriente y Galápagos requieren una inspección favorable.', fuente: fuente('Sección 5.1 · Edad de la construcción'), desde: '2026-10-01', hasta: '', activa: true },
    { id: 'pol04', codigo: 'POL-04', nombre: 'Actividades excluidas', ramos: [], giros: [], tipo: 'Absoluta', excepcion: 'Reaseguros', join: 'o',
      grupos: [{ conds: [{ k: 'rg_gen_ciiu', op: 'catalogo', cat: 'actividadesExcluidas' }] }], consecuencias: ['nivel2', 'noAsegurable'],
      texto: 'No se aseguran las actividades del catálogo «Actividades excluidas» sin aprobación de Reaseguros.', fuente: fuente('Anexo 2 · Actividades excluidas'), desde: '2026-10-01', hasta: '', activa: true } ];
  E.historialCatalogo = E.historialCatalogo || [];
  E.historialCatalogo.unshift({ when: '18/10/26 · 13:15', by: 'Andrea Salazar', where: 'Políticas de suscripción', what: 'Cargó 4 políticas de suscripción provisionales (POL-01 a POL-04) y el catálogo «Actividades excluidas»', motivo: 'Envío 3C' });
  // 20200: distancia al río, año de construcción (26 años) y provincia (Azuay, Sierra).
  const c = (E.casos || []).find(x => x.id === '20200'); if (c && c.informe) Object.assign(c.informe.valores, { rg_ubi_provincia: 'Azuay', rg_ubi_dist_rio: 450, rg_con_anio_construccion: [2000], rg_ubi_dist_mar: 180000, rg_gen_ciiu: 'P8559.02 · Actividades de enseñanza de idiomas y clases de conversación' }); // CIIU provisional: por confirmar con el catálogo CIIU del SRI
  // Muestra: hotel en Manta, puntaje alto, a 120 m del mar.
  const base = (E.muestraSimulador || [])[0];
  if (base && !E.muestraSimulador.some(x => x.nombre === 'Hotel en Manta')) E.muestraSimulador.push({ id: 'M13', muestra: true, nombre: 'Hotel en Manta', ramo: INC, giro: 'HORECA',
    valores: Object.assign(JSON.parse(JSON.stringify(base.valores)), { rg_ubi_provincia: 'Manabí', rg_ubi_dist_mar: 120, rg_ubi_dist_rio: 900, rg_con_anio_construccion: [2015], rg_gen_ciiu: 'I5510.01 · Hoteles' }) }); })();

// Corrección de la plantilla "Ubicación – Ramos Generales" v1 (23/10/26 · motivo: "Alineación con motores de IA"). Origen: ajustes-formulario-ubicacion-rg.js
(function () { const E = window.SIRIUS_EJEMPLO;
  E.definicionElegibleIA = 'El campo acepta propuestas de un motor con modelo de lenguaje (extracción visual, lectura de documentos o redacción). Los datos de contexto externo se rigen por su fuente.';
  const IA = ['rg_ele_chk_01', 'rg_ele_chk_02', 'rg_ele_chk_03', 'rg_ele_chk_04', 'rg_ele_chk_05', 'rg_ele_chk_06', 'rg_ele_chk_07', 'rg_ele_chk_08', 'rg_ele_chk_09', 'rg_ele_chk_15', 'rg_ele_chk_16', 'rg_ele_chk_17',
    'rg_pci_extintores', 'rg_cmb_glp_ubicacion', 'rg_bom_permiso', 'rg_bom_vigencia', 'rg_ges_plan_emergencia', 'rg_ele_mantenimiento', 'rg_ele_ultima_termografia', 'rg_ele_chk_14', 'rg_ee_equipos', 'rg_maq_equipos',
    'rg_ee_plan_mantenimiento', 'rg_maq_mantenimiento', 'rg_maq_ultimo_mantenimiento', 'rg_lin_descripcion'], COMB = ['ev_bodega', 'ev_linea_proceso', 'ev_area_combustibles'];
  E.modulos.forEach(m => (m.estructura || []).forEach(s => {
    (s.campos || []).forEach(c => { if (IA.includes(c.k)) c.ia = true;
      if (c.k === 'rg_dyv_monto_max') Object.assign(c, { t: 'Moneda', opts: [], nota: 'Los tramos de Cooperativas (matriz de garantías) se evalúan con este valor.' });
      if (c.k === 'rg_pro_permiso_caliente') Object.assign(c, { ro: true, lee: 'rg_ges_trabajos_caliente' }); });
    (s.evidencias || []).forEach(e => {
      if (COMB.includes(e.etiqueta) && !e.respalda.includes('rg_ocu_carga_combustible')) e.respalda.push('rg_ocu_carga_combustible');
      if (e.etiqueta === 'ev_tanque_reserva') e.respalda = ['rg_pci_reserva_exclusiva'];
      if (e.etiqueta === 'ev_placa_datos') { e.req = { k: 'rg_maq_equipos', op: 'tiene al menos', v: 'una fila' }; e.min = 1; }
      if (e.etiqueta === 'ev_extintor_cuarto') { e.req = { k: 'rg_ee_extintor_tipo', op: '≠', v: 'No tiene' }; e.min = 1; }
      if (e.etiqueta === 'ev_cerramiento' && e.porInstancia) e.porInstancia = false; }); })); })();

// Documentos esperados de lectura (IA-03) cargados en la plantilla "Ubicación – Ramos Generales" v1 (23/10/26). docId une las declaraciones de un mismo documento en varias secciones.
(function () { const E = window.SIRIUS_EJEMPLO, MM = {}; E.modulos.forEach(m => { MM[m.id] = m; });
  const SPEC = [
    ['doc_permiso_bomberos', 'Permiso de bomberos', '', [['m09', 'bom_per', 'rg_bom_doc_permiso', ['rg_bom_permiso', 'rg_bom_vigencia']]]],
    ['doc_plan_emergencia', 'Plan de emergencia', '', [['m08', 'ges_pla', 'rg_ges_doc_plan', ['rg_ges_plan_emergencia']]]],
    ['doc_termografia', 'Informe de termografía o mantenimiento eléctrico', '', [['m06', 'ele_man', 'rg_ele_doc_bitacora', ['rg_ele_mantenimiento', 'rg_ele_ultima_termografia']]]],
    ['doc_planos_electricos', 'Planos eléctricos', '', [['m06', 'ele_chk', 'rg_ele_doc_planos', ['rg_ele_chk_14']]]],
    ['doc_listado_bienes', 'Listado detallado y valorado de bienes', 'DOC-02', [['m15', 'ee_inv', 'rg_ee_doc_listado', ['rg_ee_equipos']], ['m20', 'maq_equ', 'rg_maq_doc_listado', ['rg_maq_equipos']]]],
    ['doc_certificado_extintores', 'Certificado de mantenimiento y recarga de extintores', '', [['m07', 'pci_ext', 'rg_pci_doc_certificado', ['rg_pci_ext_mantenimiento', 'rg_pci_extintores'], { rg_pci_extintores: 'columna Fecha de última recarga' }]]],
    ['doc_bitacoras_mantenimiento', 'Bitácoras y cronograma de mantenimientos', 'DOC-01', [['m15', 'ee_man', 'rg_ee_doc_plan_mant', ['rg_ee_plan_mantenimiento']], ['m20', 'maq_man', 'rg_maq_doc_bitacora', ['rg_maq_mantenimiento', 'rg_maq_ultimo_mantenimiento']]]]];
  const find = (k) => { for (const m of E.modulos) for (const s of m.estructura) { const i = (s.documentos || []).findIndex(x => x.k === k); if (i >= 0) return { s, i }; } return null; };
  SPEC.forEach(([docId, name, seg, secs]) => secs.forEach(([mid, sid, k, campos, detalle]) => { const sc = MM[mid].estructura.find(s => s.id === sid), f = find(k); let d;
    if (f) { d = f.s.documentos[f.i]; if (f.s !== sc) { f.s.documentos.splice(f.i, 1); sc.documentos.push(d); } } else { d = { doc: true, k, alias: '' }; sc.documentos = sc.documentos || []; sc.documentos.push(d); }
    Object.assign(d, { name, req: false, lectura: true, respalda: campos.slice(), docId }); if (seg) d.seguimiento = seg; if (detalle) d.detalle = detalle; })); })();

// Ajustes v1.4 (23/10/26): más campos elegibles para IA y cronograma de obra sin rg_trc_avance.
(function () { const E = window.SIRIUS_EJEMPLO, IA = ['rg_ges_brigadas', 'rg_ges_simulacros', 'rg_trc_tipo_obra', 'rg_trc_area', 'rg_trc_fecha_inicio', 'rg_trc_fecha_fin'];
  E.modulos.forEach(m => m.estructura.forEach(s => { (s.campos || []).forEach(c => { if (IA.includes(c.k)) c.ia = true; }); (s.documentos || []).forEach(x => { if (x.k === 'rg_trc_doc_cronograma') x.respalda = x.respalda.filter(k => k !== 'rg_trc_avance'); }); })); })();

// Ajustes F1 (23/10/26 · motivo: "Correcciones previas al informe de Ramos Generales"): corrección de la plantilla "Ubicación – Ramos Generales" v1, sin versión nueva. Origen: ajustes-formulario-ubicacion-rg.js (v2)
(function () { const E = window.SIRIUS_EJEMPLO, SECS = []; E.modulos.forEach(m => (m.estructura || []).forEach(s => SECS.push(s)));
  const F = (k) => { for (const s of SECS) { const c = (s.campos || []).find(x => x.k === k); if (c) return c; } return null; };
  // 1 · Espejos: una sola clave guarda el dato; estos lo muestran en solo lectura, sin valor propio, sin obligatoriedad ni "Elegible para IA", y no cuentan como campos de captura.
  [{ k: 'rg_ocu_ciiu', lee: 'rg_gen_ciiu', l: 'Ocupación (CIIU)', nota: 'rg_ocu_riesgo_ciiu se calcula desde rg_gen_ciiu' },
   { k: 'rg_bmb_reserva_exclusiva', lee: 'rg_pci_reserva_exclusiva', l: '¿Reserva exclusiva para incendios?', nota: '' },
   { k: 'rg_pro_permiso_caliente', lee: 'rg_ges_trabajos_caliente', l: '¿Hay control de trabajos en caliente?', nota: 'Se unifica la etiqueta con la del dato original' }]
    .forEach(x => { const c = F(x.k); if (c) Object.assign(c, { t: 'Espejo', espejo: true, l: x.l, lee: x.lee, nota: x.nota, ro: true, req: false, ia: false, na: false, opts: [], formula: '' }); });
  // 2 · Etiquetas: "Tanque de reserva" pasa a Protección contra incendios › Red hídrica (las condiciones de "Extintor del cuarto técnico" y "Placa de datos" ya estaban aplicadas).
  const red = E.modulos.find(m => m.id === 'm07').estructura.find(s => s.id === 'pci_red');
  SECS.forEach(s => { const i = (s.evidencias || []).findIndex(e => e.etiqueta === 'ev_tanque_reserva'); if (i >= 0 && s !== red) { const e = s.evidencias.splice(i, 1)[0]; Object.assign(e, { req: { k: 'rg_pci_reserva_exclusiva', v: 'Sí' }, min: 1, respalda: ['rg_pci_reserva_exclusiva'] }); (red.evidencias = red.evidencias || []).push(e); } });
  // 3 · Documentos esperados de Todo riesgo construcción: ninguno es requerido (la exigencia la da la matriz de garantías).
  SECS.forEach(s => (s.documentos || []).forEach(x => { if (['rg_trc_doc_permiso', 'rg_trc_doc_cronograma', 'rg_trc_doc_especificaciones'].includes(x.k)) x.req = false; }));
  // 4 · Identificación del asegurado: precargada de la solicitud y bloqueada para el inspector.
  Object.assign(F('rg_gen_ruc'), { l: 'Identificación (cédula o RUC)', origen: 'Solicitud', precarga: 'Solicitud: tipo y número de identificación del asegurado', fuente: 'tipo y número de identificación del asegurado', locked: true, nota: 'Se muestra con el tipo ("Cédula · 1309876543"). Contexto externo (CNX-03) solo consulta si el tipo es RUC de sociedad.' });
  Object.assign(F('rg_gen_asegurado'), { origen: 'Solicitud', precarga: 'Solicitud: nombre del asegurado', fuente: 'nombre del asegurado', locked: true }); })();

// Ajustes F2 (24/10/26 · motivo: "Alineación del informe con los motores y la cobertura de evidencia"): corrección de la plantilla "Ubicación – Ramos Generales" v1, sin versión nueva. Origen: ajustes-formulario-ubicacion-rg.js (v3)
(function () { const E = window.SIRIUS_EJEMPLO, SECS = []; E.modulos.forEach(m => (m.estructura || []).forEach(s => SECS.push(s)));
  const F = (k) => { for (const s of SECS) { const c = (s.campos || []).find(x => x.k === k); if (c) return c; } return null; };
  // 1 · Columna «Estado del manómetro» de la grilla de extintores (opción única, elegible para IA: la propone IA-02).
  const ext = F('rg_pci_extintores'), MAN = 'Estado del manómetro', OPM = ['En zona de operación (verde)', 'Descargado (zona roja izquierda)', 'Sobrecargado (zona roja derecha)'];
  if (ext && !ext.cols.some(c => c.indexOf(MAN) === 0)) { const i = ext.cols.findIndex(c => c.indexOf('Fecha de última recarga') === 0); ext.cols.splice(i + 1, 0, MAN + ' (opción única: ' + OPM.join(' ¦ ') + ')'); ext.colsIa = [MAN]; ext.colsOpts = Object.assign(ext.colsOpts || {}, { [MAN]: OPM }); }
  // 2 · Etiquetas exigidas solo si el módulo tiene lo que deben mostrar.
  SECS.forEach(s => (s.evidencias || []).forEach(e => {
    if (e.etiqueta === 'ev_linea_proceso') { e.req = { k: 'rg_pro_procesos', op: 'tiene al menos', v: 'una fila' }; e.min = 2; }
    if (e.etiqueta === 'ev_area_combustibles') { e.req = { k: 'rg_cmb_sustancias', op: 'tiene al menos', v: 'una fila' }; e.min = 1; } }));
  // 3 · Provincia y cantón precargados de la solicitud (el inspector puede cambiarlos; queda Modificado con el valor de la solicitud).
  const nota = 'Precargado de la solicitud (Nueva solicitud, paso 3). Si el inspector lo cambia, queda Modificado con el valor de la solicitud';
  Object.assign(F('rg_ubi_provincia'), { origen: 'Solicitud', precarga: 'Solicitud: provincia', fuente: 'provincia de la solicitud', locked: false, nota });
  Object.assign(F('rg_ubi_canton'), { origen: 'Solicitud', precarga: 'Solicitud: cantón', fuente: 'cantón de la solicitud', locked: false, nota });
  // 4 · Riesgo según CIIU: la fórmula nombra la clave que guarda el dato.
  F('rg_ocu_riesgo_ciiu').formula = 'Según el catálogo CIIU de rg_gen_ciiu'; })();

// Ajustes F3 (18/10/26 · motivo: "Observaciones por capítulo y evidencias de contexto para el Informe técnico"): corrección de la plantilla "Ubicación – Ramos Generales" v1, sin versión nueva. Origen: ajustes-formulario-ubicacion-rg-f3.js (DEC-067 y DEC-070). Solo agrega.
(function () { const E = window.SIRIUS_EJEMPLO;
  [['m03', 'rg_lin_observaciones', 'Observaciones de los linderos'], ['m04', 'rg_nat_observaciones', 'Observaciones de los riesgos de la naturaleza'], ['m16', 'rg_ocu_observaciones', 'Observaciones de la ocupación'], ['m18', 'rg_alm_observaciones', 'Observaciones del almacenamiento'], ['m19', 'rg_cmb_observaciones', 'Observaciones de combustibles e inflamables'], ['m15', 'rg_ee_observaciones', 'Observaciones del equipo electrónico'], ['m06', 'rg_ele_observaciones', 'Observaciones del sistema eléctrico'], ['m13', 'rg_rob_observaciones', 'Observaciones de la seguridad física'], ['m07', 'rg_pci_observaciones', 'Observaciones de la protección contra incendios'], ['m08', 'rg_ges_observaciones', 'Observaciones de los planes de gestión'], ['m09', 'rg_bom_observaciones', 'Observaciones del cuerpo de bomberos'], ['m10', 'rg_sin_observaciones', 'Observaciones de la siniestralidad']].forEach(([mid, k, l]) => { const m = E.modulos.find(x => x.id === mid); if (!m || (m.estructura || []).some(s => (s.campos || []).some(c => c.k === k))) return;
    m.estructura.push({ id: mid + '_obs', nombre: 'Observaciones', rep: null, campos: [{ k, l, t: 'Texto', req: false, origen: 'IA', fuente: '', ia: true, na: false, alias: '', locked: false, ro: false, opts: [], cols: [], unidad: '', formula: '', nota: 'Texto redactado', vis: null, pol: '', aplica: '' }], evidencias: [], documentos: [] });
    if (Array.isArray(m.secciones)) m.secciones = m.estructura.map(s => s.nombre); });
  const EV = E.modulos.flatMap(m => m.estructura || []).flatMap(s => s.evidencias || []), mx = EV.reduce((n, e) => Math.max(n, Number(String(e.id).replace(/\D/g, '')) || 0), 0); let nx = mx;
  [['m16', 'Actividad y mercancía', 'ev_actividad', ['rg_ocu_carga_combustible', 'rg_ocu_riesgo_nfpa'], ''], ['m09', 'Ruta a la estación de bomberos', 'ev_ruta_bomberos', ['rg_bom_distancia', 'rg_bom_tiempo'], 'Contexto externo (mapa de ruta)'], ['m13', 'Ruta a la UPC', 'ev_ruta_upc', ['rg_rob_upc_distancia', 'rg_rob_upc_tiempo'], 'Contexto externo (mapa de ruta)']].forEach(([mid, nom, cod, resp, org]) => {
    const m = E.modulos.find(x => x.id === mid); if (!m || EV.some(e => e.etiqueta === cod)) return; const sec = m.estructura.find(s => (s.campos || []).some(c => c.k === resp[0])) || m.estructura[0]; nx++;
    sec.evidencias = (sec.evidencias || []).concat([Object.assign({ id: 'ev' + String(nx).padStart(3, '0'), etiqueta: cod, req: 'no', min: 0, porInstancia: false, respalda: resp, ia: false }, org ? { origen: org } : {})]);
    if (E.etiquetasEvidencia && !E.etiquetasEvidencia.some(x => x.id === cod)) E.etiquetasEvidencia.push({ id: cod, nombre: nom, descIA: '', estado: 'Vigente', compania: 'Aseguradora del Sur' }); }); })();

// Etapa 10a · VL-F1 (18/10/26 · motivo: "Opciones desde los catálogos maestros"): corrección de la plantilla "Vehículos livianos" v1, sin versión nueva. Origen: ajustePlantillaVL en datos-catalogos-maestros.js. Solo cambia de dónde salen las opciones.
(function () { const E = window.SIRIUS_EJEMPLO, CM = window.SIRIUS_CATALOGOS_MAESTROS, A = CM && CM.ajustePlantillaVL, T = A && E.plantillas && E.plantillas[A.plantilla + ' v' + A.version]; if (!T) return;
  const F = (k) => { for (const g of Object.keys(T.campos)) { const c = T.campos[g].find(x => x.k === k); if (c) return c; } return null; };
  const mapa = {}, todos = []; CM.marcas.forEach(m => { mapa[m.marca] = []; m.modelos.forEach(o => [o.modelo].concat(o.versiones.map(v => o.modelo + ' ' + v)).forEach(t => { mapa[m.marca].push(t); todos.push(t); })); });
  A.campos.forEach(a => { const c = F(a.clave); if (!c) return; c.opcionesDe = a.opciones;
    if (a.clave === 'veh_marca') c.opts = CM.marcas.map(m => m.marca);
    if (a.clave === 'veh_modelo') { c.opts = todos; c.optsPor = { campo: 'veh_marca', mapa }; }
    if (a.clave === 'veh_tipo_licencia') c.opts = CM.licencias.map(l => l.codigo); }); })();

// Envío 5A (24/10/26): caso 20195 (Ramos Generales) movido desde el Back-office. El informe vive solo en datos-informe-rg.js (window.SIRIUS_INFORMES_RG) y se referencia por número de caso.
// Dependencias explícitas de los cálculos (dep): la interfaz y las políticas leen estas claves, no el texto de la fórmula.
(function () { const E = window.SIRIUS_EJEMPLO, DEP = { rg_ocu_riesgo_ciiu: { dep: ['rg_gen_ciiu'], catalogo: 'Actividades económicas (CIIU)' }, rg_ubi_region: { dep: ['rg_ubi_provincia'], catalogo: 'provinciaRegion' }, rg_con_edad: { dep: ['rg_con_anio_construccion'] } };
  E.modulos.forEach(m => (m.estructura || []).forEach(s => (s.campos || []).forEach(c => { if (DEP[c.k]) Object.assign(c, DEP[c.k]); })));
  const RG = window.SIRIUS_INFORMES_RG, X = RG && RG.casos && RG.casos['20195']; if (!X || E.casos.some(c => c.id === '20195')) return;
  // Etapa 6: 20195 parte del informe Enviado (bloque envio); las escenas infrg* del Borrador (menos infrgenviado) usan los valores originales.
  E.borradorRG = () => { let q = ''; try { q = new URLSearchParams(location.search).get('escena') || ''; } catch (er) {} return (q.startsWith('infrg') && !['infrgenviado', 'infrgfotosgal', 'infrgvisor'].includes(q)) || q === 'infcompletarrg'; }; // etapa C2-3: infcompletarrg redacta el informe en borrador
  const VB = () => { const Z = RG.envio; let l = X.informe.valores; if (!Z || E.borradorRG()) return l; l = l.slice(); (Z.valores || []).concat(Z.cambiosPosteriores || []).forEach(z => { const i = l.findIndex(v => v.clave === z.clave && (z.instancia ? v.instancia === z.instancia : !v.instancia)), nv = Object.assign({ clave: z.clave }, z.instancia ? { instancia: z.instancia } : {}, { valor: z.valor, origen: z.origen }); if (i >= 0) l[i] = nv; else l.push(nv); }); return l; };
  const C = X.caso, U = C.ubicacion, ciudad = U.canton, dir = U.direccion;
  E.casos.push({ id: '20195', orden: 'OE-2026-09014', ramo: C.ramos[0].ramo, ramos: C.ramos.map(r => r.ramo), broker: 'Broker Pacífico', asegurado: C.asegurado, ident: C.identificacion.numero, identTipo: C.identificacion.tipo, giro: C.giro, placa: '',
    bien: U.tipoBien + ', ' + ciudad, fecha: '2026-10-16', sucursal: 'Manta', backoffice: 'Verónica Lema', estado: C.estado, responsable: C.visita.inspector, comercial: 'Santiago Ortiz', tipoRiesgo: 'Ramos Generales',
    riesgos: C.ramos.map((r, i) => ({ id: '20195-R' + (i + 1), label: r.ramo, detalle: r.linea, total: r.valorAsegurado, estado: C.estado, dir, recMod: C.visita.modalidad })),
    informe: { rg: '20195', estado: X.informe.estado, plantilla: X.informe.plantilla, version: Number(X.informe.versionPlantilla),
      // Vista plana para las políticas y el simulador: clave → valor; los campos por instancia van como lista en el orden de las instancias.
      get valores() { const I = X.informe.instancias, ord = {}; [].concat(I.edificaciones, I.bodegas, I.escenarios).forEach((x, i) => { ord[x.id] = i; }); I.linderos.forEach((x, i) => { ord[x] = i; }); I.amenazas.forEach((x, i) => { ord[x] = i; });
        const o = {}, CI = (window.SIRIUS_CATALOGO_CIIU || {}).actividades || []; VB().forEach(v => { if (v.valor === null || v.valor === undefined) return; if (v.instancia) { const a = o[v.clave] = Array.isArray(o[v.clave]) ? o[v.clave] : []; a[ord[v.instancia]] = v.valor; } else o[v.clave] = v.valor; });
        // Cálculo: riesgo según el código CIIU guardado (catálogo datos-catalogo-ciiu.js, coincidencia exacta).
        const hit = CI.find(a => a.codigo === o.rg_gen_ciiu); if (hit) o.rg_ocu_riesgo_ciiu = hit.riesgo; return o; } } });
  E.visitas = E.visitas || {}; E.visitas['20195'] = [{ id: C.visita.codigo, mod: C.visita.modalidad, inspector: C.visita.inspector, fecha: '2026-10-16', hIni: C.visita.desde, hFin: C.visita.hasta, dir, inter: 'Junto a la gasolinera', ref: 'Bodega con portón verde', riesgos: ['20195-R1', '20195-R2', '20195-R3'], estado: C.visita.estado, cName: C.asegurado, cCel: '0998124471', cMail: 'alfredo.mendoza@gmail.com' }];
  E.detallesCasos = E.detallesCasos || {}; E.detallesCasos['20195'] = { same: true,
    sol: { nombre: 'Alfredo Antonio Mendoza Zambrano', ident: C.identificacion.numero, identTipo: C.identificacion.tipo, correo: 'alfredo.mendoza@gmail.com', tel: '099 812 4471', prov: 'Manabí', canton: 'Manta', dir: 'Av. 24 de Mayo y calle 13, barrio Córdova' },
    contacto: { nombre: C.asegurado, cel: '0998124471', correo: 'alfredo.mendoza@gmail.com' },
    rec: { score: 64, nivel: 'Riesgo medio', alertas: [{ text: 'Zona de alto riesgo de robo' }, { riesgo: 'Incendio y líneas aliadas', text: 'Valor asegurado mayor a $300.000' }], modalidad: 'Presencial', motivo: 'Tres ramos en una sola ubicación con valor asegurado alto: una visita presencial los cubre a todos.' },
    objTitle: 'Ubicación del bien', obj: [['Tipo de bien', U.tipoBien], ['Giro', C.giro], ['Provincia', U.provincia], ['Cantón', U.canton], ['Dirección', dir, false, '1 / -1']], values: [],
    aps: 'emisiones@brokerpacifico.ec', linea: 'Por ramo', tipo: 'Emisión nueva',
    califs: [{ title: 'Calificación de inspección', estado: 'Pendiente', obs: 'Se califica cuando el informe se envíe.', user: '—', fecha: '—' }, { title: 'Calificación de suscripción', estado: 'Pendiente', obs: 'Aún no se califica.', user: '—', fecha: '—' }],
    seg: null,
    insp: { modalidad: C.visita.modalidad, inspector: C.visita.inspector, realizada: '16/10/26 · 09:00', lugarLabel: 'Dirección', lugar: dir },
    events: [['16/10/26 · 09:00', 'Visita V1 iniciada · 3 ramos', 'Luis Andrade'], ['15/10/26 · 18:00', 'Visita V1 agendada · Presencial · Luis Andrade', 'Andrea Salazar'], ['15/10/26 · 17:30', 'Solicitud registrada · 3 ramos', 'Andrea Salazar']] }; })();

// Envío 5A-3: búsqueda en el catálogo CIIU de dos niveles (clase y subclase). Una subclase sin riesgo propio hereda el de su clase.
(function () { const rx = /[A-Z]\d{4}(?:\.\d{2})?/;
  window.SIRIUS_CIIU = {
    codeOf(t) { const m = rx.exec(String(t === undefined || t === null ? '' : t)); return m ? m[0] : ''; },
    lista() { const C = window.SIRIUS_CATALOGO_CIIU || {}; return (C.actividades || []).map(x => ({ codigo: x.codigo, descripcion: x.descripcion, riesgo: x.riesgo, clase: x.codigo, nivel: 'clase', heredado: false })).concat((C.subclases || []).map(s => { const k = (C.actividades || []).find(x => x.codigo === s.clase); return { codigo: s.codigo, descripcion: s.descripcion, riesgo: s.riesgo || (k ? k.riesgo : null), clase: s.clase, nivel: 'subclase', heredado: !s.riesgo }; })); },
    buscar(t) { const c = this.codeOf(t); return c ? this.lista().find(x => x.codigo === c) || null : null; },
    subclasesDe(clase) { return ((window.SIRIUS_CATALOGO_CIIU || {}).subclases || []).filter(s => s.clase === clase); } };
  const E = window.SIRIUS_EJEMPLO, RG = window.SIRIUS_INFORMES_RG, c = E.casos.find(x => x.id === '20195'); if (!c || !c.informe) return;
  // La vista plana de 20195 calcula el riesgo con el catálogo de dos niveles.
  const desc = Object.getOwnPropertyDescriptor(c.informe, 'valores'); if (desc && desc.get) Object.defineProperty(c.informe, 'valores', { get() { const o = desc.get.call(this), h = window.SIRIUS_CIIU.buscar(o.rg_gen_ciiu); if (h && h.riesgo) o.rg_ocu_riesgo_ciiu = h.riesgo; return o; }, configurable: true, enumerable: true }); })();

// Etapa 10a · carga de los catálogos maestros en el historial del catálogo (fecha, persona y motivo de "historial").
(function () { const E = window.SIRIUS_EJEMPLO, CM = window.SIRIUS_CATALOGOS_MAESTROS; if (!E || !E.historialCatalogo || !CM || !CM.historial) return; const h = CM.historial, m = /^(\d\d)\/(\d\d)\/\d\d(\d\d) (\d\d:\d\d)$/.exec(h.fecha);
  E.historialCatalogo.unshift({ when: m ? m[1] + '/' + m[2] + '/' + m[3] + ' · ' + m[4] : h.fecha, by: h.persona, where: 'Catálogos maestros', what: 'Cargó los catálogos maestros: ' + CM.seguimientos.length + ' seguimientos (norma, prioridad, evidencia, hallazgo y ubicación), ' + CM.licencias.length + ' categorías de licencia, ' + CM.marcas.length + ' marcas con sus modelos, ' + CM.wmi.length + ' WMI y ' + CM.mapasAmenaza.length + ' mapas de amenaza', motivo: h.motivo }); })();

// Etapa 6 · 6B: registro del cambio a la matriz v1.1 en el historial del catálogo (fecha del reloj del prototipo).
(function () { const E = window.SIRIUS_EJEMPLO; if (!E || !E.historialCatalogo || !E.ahora) return; const d = E.ahora(), z = (n) => String(n).padStart(2, '0');
  E.historialCatalogo.unshift({ when: z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(2) + ' · ' + z(d.getHours()) + ':' + z(d.getMinutes()), by: 'Andrea Salazar', where: 'Matriz de garantías', what: 'Matriz v1.1 · sustituciones corregidas y códigos de Robo', motivo: 'Inicio de la etapa 6 · datos-matriz-garantias.js v1.1' }); })();

// S2b: bloque f3 del informe 20195 (12 textos de observaciones aceptados y fotos F35 a F45). Se aplica junto con envio; las escenas del Borrador (etapa 5) no lo aplican.
// Independiente del orden de carga de los scripts de datos: reintenta hasta que existan el ejemplo, el informe y su bloque f3.
(function () { const borr = () => { const E = window.SIRIUS_EJEMPLO; if (E && E.borradorRG) return E.borradorRG(); let q = ''; try { q = new URLSearchParams(location.search).get('escena') || ''; } catch (er) {} return (q.startsWith('infrg') && !['infrgenviado', 'infrgfotosgal', 'infrgvisor'].includes(q)) || q === 'infcompletarrg'; };
  let n = 0; const ap = () => { const RG = window.SIRIUS_INFORMES_RG, E = window.SIRIUS_EJEMPLO; if (!E || !RG || !RG.f3 || !RG.redaccion || !RG.casos || !RG.casos['20195']) return false; if (RG.redaccion.__f3 === RG.f3) return true;
    const X = RG.casos['20195'], tx0 = RG.redaccion.textos, fo0 = X.informe.fotos, tx1 = tx0.concat(RG.f3.textos), fo1 = fo0.concat(RG.f3.fotos);
    Object.defineProperty(RG.redaccion, 'textos', { get() { return borr() ? tx0 : tx1; }, configurable: true, enumerable: true }); Object.defineProperty(X.informe, 'fotos', { get() { return borr() ? fo0 : fo1; }, configurable: true, enumerable: true }); RG.redaccion.__f3 = RG.f3; return true; };
  if (ap()) return; const t = setInterval(() => { if (ap() || ++n > 300) clearInterval(t); }, 100); })();

// Etapa 15-2 · DEC-173: plantilla Motos v1 con su columna Presencial (pasos de foto y formulario), que la plantilla de Motos no tenía en el
// prototipo (la autoinspección de motos usaba el recorrido de Vehículos livianos filtrado), y lecturas simuladas de la visita en la app.
(function () { const E = window.SIRIUS_EJEMPLO; if (!E || !E.plantillas || E.plantillas['Motos v1']) return; const VL = E.plantillas['Vehículos livianos v1']; if (!VL) return;
  const P = (id, group, name, o) => Object.assign({ id, group, name, req: { P: true, V: true, A: true, D: false }, min: 1, max: 1, rep: false, ex: [], feedsX: [], link: '', guide: 'Silueta · ' + name.toLowerCase(), sec: [], doc: '', pd: false, vis: null }, o || {});
  const pasos = [P('exteriores_frontal', 'Exteriores', 'Frontal'), P('exteriores_lateral_izquierdo', 'Exteriores', 'Lateral izquierdo'), P('exteriores_posterior', 'Exteriores', 'Posterior'), P('exteriores_lateral_derecho', 'Exteriores', 'Lateral derecho'),
    P('motor_motor', 'Motor', 'Motor'), P('identificacion_vin_grabado', 'Identificación', 'VIN grabado', { ex: ['VIN'] }), P('interiores_kilometraje', 'Interiores', 'Kilometraje', { ex: ['Kilometraje'] }), P('llantas_neumaticos', 'Llantas', 'Neumáticos (2)'),
    P('documentos_matricula_frontal', 'Documentos', 'Matrícula frontal', { req: { P: true, V: true, A: true, D: true } }), P('documentos_matricula_posterior', 'Documentos', 'Matrícula posterior', { req: { P: true, V: true, A: true, D: true } }), P('documentos_licencia_frontal', 'Documentos', 'Licencia frontal'), P('documentos_licencia_posterior', 'Documentos', 'Licencia posterior')];
  const sin = (L, ks) => L.filter(x => ks.indexOf(x.k) < 0), C = VL.campos;
  E.plantillas['Motos v1'] = { nombre: 'Motos', version: 1, pasos, secciones: [['ins', 'Datos de la inspección'], ['veh', 'Identificación del vehículo'], ['mat', 'Matrícula y propietario'], ['uso', 'Uso y conductor'], ['neu', 'Neumáticos'], ['ext', 'Extras'], ['ave', 'Averías'], ['ase', 'Asegurabilidad']],
    campos: { ins: C.ins, veh: sin(C.veh, ['veh_tipo_carroceria']), mat: C.mat, uso: C.uso, neu: C.neu.map(x => Object.assign({}, x, { rows: ['Delantera', 'Trasera'] })), ext: C.ext, ave: C.ave, ase: C.ase }, nota: 'Etapa 15-2: columna Presencial completada para la app del inspector' };
  E.appInspector = { lecturas: { '20152': { veh_placa: ['GSE1120', 97, 'identificacion_placa_delantera'], veh_vin: ['KNADN512AP6123457', 84, 'identificacion_sticker_vin'], veh_kilometraje: ['41250', 95, 'interiores_kilometraje'], veh_anio_modelo: ['2023', 96, 'documentos_matricula_frontal'], veh_color: ['Plata', 93, 'exteriores_frontal'] } } };
})();
// Etapa 15-3 · mapa esquemático de Quito norte para «Hoy» de la app del inspector (solo en el prototipo: la página publicada no carga
// mapas externos; en producción se usa el servicio de mapas CNX-04 con calles reales). Coordenadas aproximadas [latitud, longitud].
(function () {
  const E = window.SIRIUS_EJEMPLO; if (!E) return; E.appInspector = E.appInspector || {};
  E.appInspector.mapa = {
    nombre: 'Quito norte', area: { lat: [-0.216, -0.112], lng: [-78.525, -78.448] },
    nota: 'Mapa esquemático del prototipo · en producción, servicio de mapas (CNX-04) con calles reales y tu ubicación GPS',
    parques: [
      { n: 'Parque La Carolina', pts: [[-0.1770, -78.4844], [-0.1768, -78.4820], [-0.1875, -78.4849], [-0.1878, -78.4878]] },
      { n: 'Parque Bicentenario', pts: [[-0.1500, -78.4865], [-0.1500, -78.4925], [-0.1200, -78.4955], [-0.1200, -78.4893]] }],
    calles: [
      { n: 'Av. Mariscal Sucre', eje: 'ns', pts: [[-0.216, -78.5200], [-0.195, -78.5165], [-0.175, -78.5130], [-0.155, -78.5090], [-0.135, -78.5045], [-0.112, -78.5000]] },
      { n: 'Av. América', eje: 'ns', pts: [[-0.216, -78.5085], [-0.200, -78.5065], [-0.185, -78.5040], [-0.170, -78.5010], [-0.158, -78.4995]] },
      { n: 'Av. La Prensa', eje: 'ns', pts: [[-0.158, -78.4995], [-0.140, -78.5010], [-0.112, -78.5025]] },
      { n: 'Av. 10 de Agosto', eje: 'ns', pts: [[-0.216, -78.5030], [-0.200, -78.4990], [-0.185, -78.4950], [-0.170, -78.4925], [-0.155, -78.4935], [-0.140, -78.4955], [-0.112, -78.4970]] },
      { n: 'Av. Amazonas', eje: 'ns', pts: [[-0.216, -78.4988], [-0.200, -78.4946], [-0.1895, -78.4900], [-0.1765, -78.4847], [-0.165, -78.4836], [-0.150, -78.4855], [-0.135, -78.4870], [-0.112, -78.4886]] },
      { n: 'Av. de los Shyris', eje: 'ns', pts: [[-0.1880, -78.4851], [-0.1765, -78.4819], [-0.1640, -78.4800]] },
      { n: 'Av. 6 de Diciembre', eje: 'ns', pts: [[-0.216, -78.4938], [-0.200, -78.4880], [-0.1836, -78.4807], [-0.170, -78.4780], [-0.155, -78.4762], [-0.140, -78.4746], [-0.112, -78.4722]] },
      { n: 'Av. Eloy Alfaro', eje: 'diag', pts: [[-0.1960, -78.4900], [-0.1880, -78.4840], [-0.1800, -78.4770], [-0.1700, -78.4705], [-0.1580, -78.4650], [-0.1450, -78.4600], [-0.1300, -78.4545]] },
      { n: 'Av. Patria', eje: 'eo', pts: [[-0.2080, -78.5080], [-0.2045, -78.4910]] },
      { n: 'Av. Colón', eje: 'eo', pts: [[-0.2010, -78.5070], [-0.1990, -78.4870]] },
      { n: 'Av. Orellana', eje: 'eo', pts: [[-0.1935, -78.5050], [-0.1915, -78.4830]] },
      { n: 'Av. República', eje: 'eo', pts: [[-0.1885, -78.5040], [-0.1880, -78.4851]] },
      { n: 'Av. Naciones Unidas', eje: 'eo', pts: [[-0.1772, -78.5020], [-0.1765, -78.4847], [-0.1760, -78.4760]] },
      { n: 'Av. Gaspar de Villarroel', eje: 'eo', pts: [[-0.1700, -78.5005], [-0.1690, -78.4740]] },
      { n: 'Av. El Inca', eje: 'eo', pts: [[-0.1555, -78.4990], [-0.1545, -78.4800], [-0.1535, -78.4680]] },
      { n: 'Av. de los Granados', eje: 'eo', pts: [[-0.1475, -78.4745], [-0.1430, -78.4640], [-0.1400, -78.4560]] }],
    rotulos: ['Av. Amazonas', 'Av. 6 de Diciembre', 'Av. 10 de Agosto', 'Av. Naciones Unidas', 'Av. Eloy Alfaro', 'Av. El Inca', 'Av. América', 'Av. Orellana']
  };
})();
