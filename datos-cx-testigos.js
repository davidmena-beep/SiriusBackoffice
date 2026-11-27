// SIRIUS · Testigos del tablero con la conexión simulada (v1.0 · provisional · etapa L-5 · DEC-300 · 26/11/2026)
// La asesoría integró la lectura del tablero (SQL 101 y función de Supabase lectura-tablero): los 7 testigos los lee una IA desde la foto «Tablero de instrumentos».
// Esta base simulada solo sirve a las escenas de pantallas; parte del caso 50068 (GRZ3276) de datos-cx-lectura.js y le agrega lo que dejaría esa lectura:
//   testigoscaso (Informe › Testigos del tablero: miniatura de la foto, 7 testigos como switches con su estado y «Otros testigos encendidos» en fichas)
//   testigossinfoto (lo mismo sin la foto del paso: «Sin foto del tablero») · testigoscontroles (Controles: «Lectura: testigos encendidos en el tablero»).
// Estados de la demostración: Check engine Apagado (Lectura · 94 %) · ABS Apagado (Editado: la lectura vio Encendido) · Airbag Apagado (Lectura) · Presión de aceite Apagado (Lectura) ·
//   Batería sin valor (Sin revisar) · Temperatura Apagado (Por confirmar, 72 %) · Frenos Encendido (Lectura · 88 %); Otros testigos: Presión de neumáticos y Cinturón de seguridad.
// informes[].respuestas.__lecturas[clave] = { valor, origen, evidencia, conf, por_confirmar, fecha }. Los datos son de demostración, no los de la base real.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim || !CC.cxEscenas || !CC.cxEscenas.leccaso) return;
  const ESC = { testigoscaso: '50068', testigossinfoto: '50068', testigoscontroles: '50068' };
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = [ESC[k], 'ninguna']; });
  const LEC = 'Lectura automática', HLEC = '2026-11-25T21:45:30-05:00', PASO = 'interiores_tablero_de_instrumento';
  // [clave, valor que se ve en el informe, valor que leyó la IA, confianza, por_confirmar]
  const T = [['veh_testigo_check_engine', 'Apagado', 'Apagado', 0.94, false], ['veh_testigo_abs', 'Apagado', 'Encendido', 0.81, false], ['veh_testigo_airbag', 'Apagado', 'Apagado', 0.92, false],
    ['veh_testigo_presion_aceite', 'Apagado', 'Apagado', 0.91, false], ['veh_testigo_bateria', '', '', 0, false], ['veh_testigo_temperatura', 'Apagado', 'Apagado', 0.72, true], ['veh_testigo_frenos', 'Encendido', 'Encendido', 0.88, false],
    ['veh_testigos_otros', 'Presión de neumáticos, Cinturón de seguridad', 'Presión de neumáticos, Cinturón de seguridad', 0.86, false]];
  const aplicar = (X, esc) => {
    const id = '50068', inf = (X.informes[id] || [])[0]; if (!inf) return X;
    const resp = inf.respuestas, lec = resp.__lecturas = resp.__lecturas || {};
    T.forEach((x) => { if (x[1] === '' && x[2] === '') { resp[x[0]] = { valor: '', org: 'Por completar' }; return; } resp[x[0]] = { valor: x[1], org: LEC }; lec[x[0]] = { valor: x[2], origen: LEC, evidencia: PASO, conf: x[3], por_confirmar: x[4], fecha: HLEC }; });
    X.evidencias[id] = esc === 'testigossinfoto' ? [] : [{ id: '50068-ev-1', riesgo: '50068-V1', paso: PASO, pasoNombre: 'Tablero completo', url: 'assets/grz3277/f07.jpg', fecha: '2026-11-25T21:35', hora: '2026-11-25T21:35',
      gps: { lat: -1.28357, lng: -78.63906 }, canal: 'Autoinspección', tipoArchivo: 'foto', estado: 'Confirmada' }];
    X.controles[id] = esc === 'testigoscontroles' || esc === 'testigoscaso' ? [{ id: 'ctl-tab-1', tipo: 'Lectura: testigos encendidos en el tablero', severidad: 'Media', detalle: { paso: PASO, testigos: ['Frenos'] }, estado: 'Pendiente', comentario: '', hora: '2026-11-25T21:46' }] : [];
    X.testigos = { escena: esc }; return X; };
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { return ESC[escena] ? aplicar(baseCC('leccaso'), escena) : baseCC(escena); };
  CC.cxTestigos = { escenas: Object.keys(ESC), claves: T.map((x) => x[0]) };
})();
