// SIRIUS · Informe conectado de Equipo y maquinaria con la conexión simulada (v1.0 · provisional · etapa L-7 · 27/11/2026)
// En la base, el informe del caso trae plantillaClave «Equipo y maquinaria · Autoinspección» y su versión; el formulario (secciones, campos y pasos) sale de lo publicado
// en Formularios (SIRIUS_FORMULARIOS: pasos sin «sec», con los campos que alimentan en feeds). Esta base simulada solo sirve a las escenas de pantallas:
//   infequipo (caso 50075 · Informe por completar: secciones reales, procedencia, fotos por sección y avance) · infequipobandeja (la Bandeja › Informes por completar; al abrir el caso va a Informe).
// El formulario «Equipo y maquinaria» v3 se arma con la plantilla del prototipo (sirius-equipos.js) en la forma que publica Formularios; las respuestas y las fotos son de demostración,
// no las de la base real (allí: 11 secciones y 67 campos).
(function () {
  const A = window.SIRIUS_CX_AUTO; if (!A || !A.cxSim) return;
  const ESC = { infequipo: ['50075', 'interno', 'ejecutivo'], infequipobandeja: ['50075', 'interno', 'ejecutivo'] };
  Object.keys(ESC).forEach((k) => { A.cxEscenas[k] = ESC[k]; });
  const esc0 = () => { try { return new URLSearchParams(location.search).get('escena') || ''; } catch (e) { return ''; } };
  const ID = '50075', RID = '50075-E1', CLAVE = 'Equipo y maquinaria · Autoinspección', VER = 3;
  // La plantilla del prototipo sin tocar los datos de ejemplo: SiriusEquipos.construir() sobre un SIRIUS_EJEMPLO de paso (el caso 20204 ya «existe» y no se agrega).
  const tplEM = () => { const SE = window.SiriusEquipos; if (!SE || !SE.construir) return null; const real = window.SIRIUS_EJEMPLO, stub = { plantillas: {}, casos: [{ id: '20204' }] }; let T = null;
    try { window.SIRIUS_EJEMPLO = stub; SE.construir(); T = stub.plantillas['Equipo y maquinaria v1'] || null; } catch (e) { T = null; } finally { window.SIRIUS_EJEMPLO = real; } return T; };
  // Versión publicada (forma de Formularios): en Autoinspección se piden los mismos campos que en Presencial; los pasos no traen «sec».
  const version = (T) => { const C = T.campos || {};
    const secs = (T.secciones || []).map((sc) => ({ id: sc[0], label: sc[1], fields: (C[sc[0]] || []).map((f) => { const r = f.req || '', p = r.indexOf('P') >= 0;
      return { key: f.k, label: f.l, type: f.t, req: { P: p, V: r.indexOf('V') >= 0, A: p && ['Grilla', 'Cálculo', 'Foto'].indexOf(f.t) < 0 && !f.locked, D: r.indexOf('D') >= 0 }, by: { P: 'Inspector', V: 'Inspector', A: 'Cliente', D: 'Back-office' },
        src: f.src || [], help: f.help || '', fmt: f.fmt || 'Ninguno', opts: f.opts || [], vis: f.vis || null, cols: f.cols || [], rows: f.rows || [], locked: !!f.locked, formula: f.f || '' }; }) }));
    const steps = (T.pasos || []).map((s) => { const o = Object.assign({}, s, { req: Object.assign({}, s.req, { A: true }), feeds: (s.sec || []).map((sid) => ((C[sid] || [])[0] || {}).k).filter(Boolean) }); delete o.sec; return o; });
    return { n: VER, estado: 'Vigente', desde: '2026-11-20', vigenteDesde: '2026-11-20', by: 'Andrea Salazar', motivo: 'Autoinspección de equipos', secs, steps, ordenA: steps.map((s) => s.id) }; };
  const baseF = A.formularios;
  A.formularios = function (E) { const r = baseF(E); if (!r || !ESC[esc0()]) return r; const T = tplEM(); if (!T) return r;
    r.formularios.push({ id: 'f5', name: 'Equipo y maquinaria', tipo: 'Ramos Generales', alcance: 'Equipo y maquinaria', tipoObjeto: 'Equipo móvil', versions: [version(T)] }); r.vigentes.f5 = VER; return r; };
  const svg = (t, c) => 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="' + c + '"/><text x="200" y="158" text-anchor="middle" font-family="Arial" font-size="22" fill="#fff">' + t + '</text></svg>');
  const R = (valor, org, conf) => Object.assign({ valor: valor, org: org }, conf ? { conf: conf } : {});
  const baseSim = A.cxSim.bind(A);
  A.cxSim = function (escena) { if (!ESC[escena]) return baseSim(escena);
    const X = baseSim('autoporseccion'), T = tplEM(); if (!X || !T) return X; const c = X.casos[0], viejo = c.id, inf = (X.informes[viejo] || [])[0];
    Object.assign(c, { id: ID, orden: 'EMI-2026-119075', ramo: 'Equipo y maquinaria', tipoRiesgo: 'Ramos Generales', asegurado: 'Logística Norte Andina S.A.', ident: '1792233814001', placa: '', placas: [],
      bien: 'Montacargas Toyota 8FGCU25 · serie 8FGCU25-41872', fecha: '2026-11-24', registrado: '2026-11-24T09:10', vence: '2026-11-28T16:20', formularios: ['Equipo y maquinaria'], solicitud: { formularios: ['Equipo y maquinaria'] },
      contacto: { nombre: 'Marcelo Ortiz', cel: '0991230075' },
      riesgos: [{ id: RID, label: 'Montacargas Toyota 8FGCU25', detalle: 'Montacargas · 2021', cobertura: 'Todo riesgo', estado: 'Informe por completar' }],
      riesgosBase: [{ id: RID, descripcion: 'Montacargas Toyota 8FGCU25 · serie 8FGCU25-41872', composicion: 'Equipo móvil', suma: 42000, datos: { tipo: 'Montacargas', marca: 'Toyota', modelo: '8FGCU25', anio: 2021, serie: '8FGCU25-41872' } }] });
    c.visita = Object.assign({}, c.visita, { modalidad: 'Autoinspección', fin: '2026-11-25T16:20' });
    Object.assign(inf, { riesgo: RID, riesgoId: RID, plantilla: CLAVE, plantillaClave: CLAVE, plantillaVersion: VER, enviadoEn: '2026-11-25T16:20', enviadoPor: 'Marcelo Ortiz', canal: 'Autoinspección' });
    // Lo que dejó el cliente y la lectura de la placa del fabricante; el resto queda por completar (el avance cuenta lo que falta).
    inf.respuestas = { em_categoria: R('Manipulación de carga', 'Cliente'), em_tipo: R('Montacargas', 'Cliente'), em_marca: R('Toyota', 'foto:eq_placa_fabricante', 0.96), em_modelo: R('8FGCU25', 'foto:eq_placa_fabricante', 0.91),
      em_anio_fabricacion: R('2021', 'foto:eq_placa_fabricante', 0.88), em_serie_chasis: R('8FGCU25-41872', 'foto:eq_placa_fabricante', 0.83), em_horometro: R('3480', 'foto:eq_tablero', 0.9), em_color: R('Amarillo', 'Cliente'),
      em_uso: R('Propio', 'Cliente'), em_actividad: R('Industrial', 'Cliente'), em_pernocta: R('Patio cerrado', 'Cliente'), em_extintor: R('Sí', 'Cliente'), em_gps: R('No', 'Cliente'), em_suma_asegurada: R('42000', 'solicitud') };
    const ev = (T.pasos || []).filter((s) => s.id !== 'eq_danos').map((s, i) => ({ id: 'eq-' + (i + 1), paso: s.id, pasoNombre: s.name, url: svg(s.name, ['#3E6FA8', '#2B7A5F', '#8A5A1F', '#5B3F8C', '#356B72'][i % 5]), hora: '25/11/26 · 16:' + String(2 + i).padStart(2, '0'),
      canal: 'Autoinspección', tipoArchivo: /^eq_doc/.test(s.id) ? 'documento' : 'foto', validacion: { vertical: true, encuadre: true, luz: true, nitidez: true, reflejo: true }, gps: [-0.2153, -78.5008], precision: 12 }));
    const hist = [{ hora: '2026-11-25T16:20', accion: 'Autoinspección recibida', detalle: ev.length + ' evidencias · Montacargas Toyota 8FGCU25', actor: 'Marcelo Ortiz', rol: 'Cliente' }, { hora: '2026-11-24T09:10', accion: 'Solicitud recibida', detalle: 'Desde el BPM de Emisión', actor: 'BPM de Emisión', rol: 'Sistema' }];
    const out = { usuario: X.usuario, casos: [c], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {} };
    out.eventos[ID] = hist; out.evidencias[ID] = ev; out.controles[ID] = []; out.informes[ID] = [inf]; out.calificaciones[ID] = []; out.equipo = { escena: escena }; return out; };
  A.cxEquipo = { escenas: Object.keys(ESC), caso: ID, plantillaClave: CLAVE, version: VER };
})();
