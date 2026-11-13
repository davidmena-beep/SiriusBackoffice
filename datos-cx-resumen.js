// SIRIUS · Resumen desde la solicitud, avance del informe, «Enviar a calificación» y facultad con tope, con la conexión simulada (v1.0 · provisional · etapa P-6f-0 · 18/10/2026)
// Decisiones: DEC-215 («Enviar a calificación» de quien completa sin inspector en sitio), DEC-216 (facultad con tope de suma asegurada),
// DEC-218 (avance = campos aplicables) y DEC-219 («Objeto a asegurar» desde casos[].riesgosBase).
// Forma del contrato (SIRIUS_CONEXION.casos[i].riesgosBase): [{ descripcion, composicion ('Vehículo' | 'Equipo móvil' | 'Ubicación'), suma, datos }]:
//  · Vehículo: datos { placa, marca, modelo, anio, vin, motor, version, color, carroceria (id de SIRIUS_SILUETAS o nombre), clase, uso, cc, pasajeros, paisOrigen,
//    extras: [texto], cobertura, valorExtras }; suma = casco.
//  · Equipo móvil: datos { tipoEquipo, marca, modelo, anio, serie, h (horómetro, horas), ubicacion }; suma = suma asegurada.
//  · Ubicación: datos { tipoRiesgo, direccion, ciudad, giro, construccion, pisos, areaM2, anioConstruccion, coberturas: [texto], valorEdificio, valorContenidos }; suma = total.
// P-6f-0a: cilindraje = datos.cc o datos.cilindraje (la base lo guarda como «cilindraje»). Escena resumenflotabase: flota como la del 50012 de la base.
// Se suma a SIRIUS_CX_AUTO (datos-cx-autoinspeccion.js): mismas escenas simuladas (cxSimBoot) que se limpian al cambiar de escena. Ningún dato sale de un caso de ejemplo (DEC-200).
(function () {
  const A = window.SIRIUS_CX_AUTO; if (!A) return;
  const veh = (o) => ({ descripcion: o.placa + ' · ' + o.marca + ' ' + o.modelo + ' ' + o.anio, composicion: 'Vehículo', suma: o.suma, datos: o });
  const R = {
    // Un vehículo con todos los datos de la solicitud (50007, Vehículos livianos). La respuesta no trae casco ni extras: Informe › Valores los toma de riesgosBase.
    resumenvehsol: [veh({ placa: 'PDR3307', marca: 'Toyota', modelo: 'RAV4', anio: 2022, vin: 'JTMW43FV7ND118842', motor: 'A25A-H418230', version: 'XLE 2.5 4x2 AT', color: 'Gris plata', carroceria: 'suv', clase: 'Jeep', uso: 'Particular', cc: 2487, pasajeros: 5, paisOrigen: 'Japón', extras: ['Parlantes adicionales', 'Aros de lujo'], cobertura: 'Todo riesgo', valorExtras: 650, suma: 18500 })],
    // Flota de tres vehículos (los totales de cada uno = casco + extras; el último sin extras ni datos opcionales).
    resumenflota: [
      veh({ placa: 'PDT1180', marca: 'Chevrolet', modelo: 'D-Max', anio: 2023, vin: 'MPATFS86JPT004512', motor: '4JJ1-990142', version: 'Hi Ride 3.0 4x4', color: 'Blanco', carroceria: 'camioneta', clase: 'Camioneta', uso: 'Comercial', cc: 2999, pasajeros: 5, paisOrigen: 'Tailandia', extras: ['Barra antivuelco'], valorExtras: 900, suma: 27800 }),
      veh({ placa: 'PDT1181', marca: 'Chevrolet', modelo: 'D-Max', anio: 2023, vin: 'MPATFS86JPT004533', motor: '4JJ1-990187', version: 'Hi Ride 3.0 4x4', color: 'Blanco', carroceria: 'camioneta', clase: 'Camioneta', uso: 'Comercial', valorExtras: 900, suma: 27800 }),
      veh({ placa: 'PDT2290', marca: 'Kia', modelo: 'Soluto', anio: 2024, vin: '', motor: '', suma: 14900 })],
    // P-6f-0a · DEC-219: flota como la del caso 50012 de la base (casos[].riesgos + riesgosBase): Kia Rio PRB1212 USD 15.000; Suzuki GN125 PR121A USD 2.400 (con «cilindraje», no «cc»); Toyota Hilux PRB1213 USD 32.000 con extras de USD 1.200. Total del caso USD 50.600.
    resumenflotabase: [
      veh({ placa: 'PRB1212', marca: 'Kia', modelo: 'Rio', anio: 2022, vin: 'KNADN512BN6418830', motor: 'G4LC-NW418830', carroceria: 'sedan', uso: 'Particular', suma: 15000 }),
      veh({ placa: 'PR121A', marca: 'Suzuki', modelo: 'GN125', anio: 2023, vin: 'LC6PCJK14P0301127', motor: 'F408-0301127', carroceria: 'moto', uso: 'Particular', cilindraje: 125, suma: 2400 }),
      veh({ placa: 'PRB1213', marca: 'Toyota', modelo: 'Hilux', anio: 2022, vin: 'MR0FB8CD8N0817716', motor: '2GD-FTV-817716', carroceria: 'camioneta', uso: 'Comercial', extras: ['Barra antivuelco', 'Estribos'], valorExtras: 1200, suma: 32000 })],
    // Equipo móvil (montacargas) con su suma asegurada.
    resumenequipo: [{ descripcion: 'Montacargas Toyota 8FGCU25 · serie 8FGCU25-71844', composicion: 'Equipo móvil', suma: 31500, datos: { tipoEquipo: 'Montacargas', marca: 'Toyota', modelo: '8FGCU25', anio: 2021, serie: '8FGCU25-71844', h: 4320, ubicacion: 'Bodega Carcelén, Quito' } }],
    // Ubicación (local comercial) con edificio y contenidos.
    resumenubicacion: [{ descripcion: 'Local comercial · Av. Remigio Crespo 4-21, Cuenca', composicion: 'Ubicación', suma: 245000, datos: { tipoRiesgo: 'Local comercial', direccion: 'Av. Remigio Crespo 4-21 y Guayas', ciudad: 'Cuenca', giro: 'Venta de electrodomésticos', construccion: 'Hormigón armado y mampostería', pisos: 2, areaM2: 420, anioConstruccion: 2009, coberturas: ['Incendio y líneas aliadas', 'Robo', 'Equipo electrónico'], valorEdificio: 180000, valorContenidos: 65000 } }],
    // Motos de Eurosurvey (tope USD 40.000): dentro (38.900) y fuera por monto (42.000).
    facultadtope: [veh({ placa: 'IB123C', marca: 'BMW', modelo: 'R 1250 GS Adventure', anio: 2024, vin: 'WB10J1300RZ418827', motor: '12EB-0418827', carroceria: 'moto', uso: 'Particular', cc: 1254, pasajeros: 2, paisOrigen: 'Alemania', cobertura: 'Todo riesgo', suma: 38900 })],
    facultadtopefuera: [veh({ placa: 'IB123C', marca: 'Harley-Davidson', modelo: 'Road Glide', anio: 2024, vin: '1HD1KTP14RB641205', motor: 'M8-641205', carroceria: 'moto', uso: 'Particular', cc: 1923, pasajeros: 2, paisOrigen: 'Estados Unidos', cobertura: 'Todo riesgo', suma: 42000 })],
    // Moto de 50009 para avance y «Enviar a calificación».
    moto: [veh({ placa: 'IB123C', marca: 'Honda', modelo: 'XR150L', anio: 2024, vin: '9C2KD0810RR012345', motor: 'KD08E-1012345', carroceria: 'moto', uso: 'Particular', cc: 149, pasajeros: 2, paisOrigen: 'Brasil', cobertura: 'Todo riesgo', suma: 3900 })],
  };
  // escena → [caso, quien completa, rol, riesgos, ramo, caso de la base]
  const ESC = {
    avanceaplicables: ['50009', 'agencia', 'cc', 'moto'],
    resumenvehsol: ['50007', 'interno', 'ejecutivo', 'resumenvehsol'],
    resumenflota: ['50021', 'interno', 'ejecutivo', 'resumenflota'],
    resumenflotabase: ['50012', 'interno', 'ejecutivo', 'resumenflotabase'],
    resumenequipo: ['50031', 'interno', 'ejecutivo', 'resumenequipo'],
    resumenubicacion: ['50041', 'interno', 'ejecutivo', 'resumenubicacion'],
    autoenviarcalif: ['50009', 'agencia', 'cc', 'moto'],
    facultadtope: ['50009', 'agencia', 'cc', 'facultadtope'],
    facultadtopefuera: ['50009', 'agencia', 'cc', 'facultadtopefuera'],
  };
  const PER = { '50012': ['Transportes del Austro Cía. Ltda.', '0190512346001', 'Flota PRB1212, PR121A y PRB1213', 'PRB1212'], '50021': ['Transportes Cañar Cía. Ltda.', '0190381127001', 'Flota PDT1180, PDT1181 y PDT2290', 'PDT1180'], '50031': ['Logística Norte Andina S.A.', '1792233814001', 'Montacargas Toyota 8FGCU25, 2021', ''], '50041': ['Comercial Austro Hogar S.A.', '0190445519001', 'Local comercial · Av. Remigio Crespo 4-21, Cuenca', ''] };
  const base = A.cxSim.bind(A);
  Object.keys(ESC).forEach((k) => { A.cxEscenas[k] = ESC[k].slice(0, 3); });
  A.cxSim = function (escena) { const e = ESC[escena]; if (!e) return base(escena);
    const X = base(escena); if (!X) return null; const c = X.casos[0], id = e[0], rb = JSON.parse(JSON.stringify(R[e[3]] || []));
    c.riesgosBase = rb; c.cobertura = 'Todo riesgo';
    if (PER[id]) { const p = PER[id];
      Object.assign(c, { id: id, orden: 'EMI-2026-1190' + id.slice(-2), asegurado: p[0], ident: p[1], bien: p[2], placa: p[3], solicitud: { formularios: [rb[0].composicion === 'Vehículo' ? 'Vehículos livianos' : rb[0].composicion] }, sucursal: id === '50041' ? 'Cuenca' : 'Quito Norte' });
      if (rb[0].composicion !== 'Vehículo') Object.assign(c, { ramo: rb[0].composicion === 'Ubicación' ? 'Ramos Generales' : 'Equipo y maquinaria', tipoRiesgo: rb[0].composicion === 'Ubicación' ? 'Ramos Generales' : 'Equipo y maquinaria' }); }
    // P-6f-0a: la lista de riesgos de la bandeja («3 vehículos», «PRB1212 +2») sale de casos[].riesgos, como en la base.
    if (escena === 'resumenflotabase') { c.tipoRiesgo = 'Vehículos'; c.riesgos = rb.map((r, i) => ({ id: id + '-V' + (i + 1), label: r.datos.placa, nowrap: true, detalle: r.datos.marca + ', ' + r.datos.modelo + ', ' + r.datos.anio, cobertura: 'Todo riesgo', total: r.suma + (r.datos.valorExtras || 0), estado: c.estado })); }
    const inf = (X.informes[id] || [])[0];
    if (inf && escena === 'resumenvehsol') { delete inf.respuestas.veh_valor_asegurado_casco; delete inf.respuestas.veh_valor_asegurado_extras; }
    if (inf && /^facultadtope/.test(escena)) { const d = rb[0].datos; c.solicitud = { marca: d.marca, modelo: d.modelo, anio: d.anio, placa: d.placa }; c.bien = 'Placa ' + d.placa + ', ' + d.anio; Object.assign(inf.respuestas, { veh_marca: { valor: d.marca, org: 'solicitud' }, veh_modelo: { valor: d.modelo, org: 'solicitud' } }); }
    // DEC-218: en avanceaplicables queda 1 obligatorio sin llenar (el kilometraje).
    if (inf && escena === 'avanceaplicables') delete inf.respuestas.veh_kilometraje;
    return X; };
  A.cxResumen = { riesgos: R, escenas: ESC };
})();
