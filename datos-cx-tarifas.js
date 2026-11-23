// SIRIUS · Escenas del panel de tarifarios por conceptos con la conexión simulada (v1.0 · provisional · etapa H-2 · DEC-275 y DEC-278 · 23/11/2026)
// tarifmatriz, tarifconcepto, tarifnuevo, tarifcontrato, tarifprobar, tarifpublicar (?fvista=cero bloqueada, ?fvista=publicada) y tarifsololectura (puedePublicar false).
// La base simulada (SIRIUS_TARIFAS_SIM, con la v5 publicada de David) responde honorariosConfig, honorarioProbar, honorariosImpacto y honorariosPublicar a través de
// SIRIUS_CONEXION (cxSimBoot los pasa desde SIRIUS_CX_COORD). Usuario: David Alejandro Mena, Administrador. Los honorarios abiertos de la base van en X.honorarios
// con su calculo.lineas (para «En uso» del panel del concepto).
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim) return;
  const ESC = ['tarifmatriz', 'tarifconcepto', 'tarifnuevo', 'tarifcontrato', 'tarifprobar', 'tarifpublicar', 'tarifsololectura'];
  ESC.forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  const SIM = () => window.SIRIUS_TARIFAS_SIM, clon = (x) => JSON.parse(JSON.stringify(x));
  const rechazo = () => { try { return new URLSearchParams(location.search).get('cxok') === '0'; } catch (e) { return false; } };
  const no = () => Promise.resolve({ ok: false, mensaje: 'La base rechazó la acción (prueba)' });
  // Las cuatro funciones de la base (las llama SIRIUS_CONEXION en cualquier escena con la conexión simulada).
  CC.honorariosConfig = function () { return SIM() ? SIM().honorariosConfig() : Promise.resolve({ ok: false, mensaje: 'La base no tiene la configuración de honorarios' }); };
  CC.honorarioProbar = function (X, caso, riesgo, servicio, borrador) { return SIM() ? SIM().honorarioProbar(caso, riesgo, servicio, borrador) : Promise.resolve({ aplica: false, motivo: 'La base no responde' }); };
  CC.honorariosImpacto = function (X, borrador, desde) { return SIM() ? SIM().honorariosImpacto(borrador, desde) : no(); };
  CC.honorariosPublicar = function (X, borrador, motivo, desde) { if (rechazo()) return no(); return SIM() ? SIM().honorariosPublicar(borrador, motivo, desde) : no(); };
  const DAVID = { nombre: 'David Alejandro Mena', email: 'david.mena@asur.ec', rol: 'Administrador', roles: ['Administrador'], tipo: 'Interno', estado: 'Activo' };
  // Honorarios abiertos de la base simulada en la forma de la conexión (id, caso, riesgo, estado, proveedor, servicio, calculo.lineas).
  const honorarios = () => (SIM() ? SIM().abiertos() : []).map((x) => ({ id: 'HON-' + x.vehiculo + (x.servicio === 'completado' ? '-C' : ''), caso: x.caso, orden: '', riesgo: x.vehiculo, placa: x.placa || '', bien: x.bien || '', asegurado: '', linea: 'Individuales', ramo: x.ramo, modalidad: x.modalidad, sucursal: x.sucursal, fecha: x.fecha, visita: 1, estado: x.estado,
    proveedor: { tipo: 'agencia', nombre: 'Eurosurvey', identificacion: x.proveedor.ruc }, inspector: '', inspectorId: '', servicio: x.servicio, aprobacion: x.calculo.aprobacion === 'preacordada' ? 'Preacordada' : 'Liquidación', subtotal: x.calculo.subtotal, estadoCaso: '', ajuste: null, liquidacionId: '', facturaId: '',
    calculo: { tarifario: 'Contrato Eurosurvey 2026', clase: x.clase || null, ciudadBase: '1701', ciudadVisita: '1701', enBase: true, kmMedicion: 'ida', nivel: x.nivel || null, nivelSugerido: x.nivel || null, horasVisita: x.horasVisita || null, horasRedaccion: x.horasRedaccion || null, medidoVisita: x.horasVisita || null, medidoRedaccion: x.horasRedaccion || null, equipos: x.equipos || 0, km: 0,
      lineas: x.calculo.lineas.map((l) => ({ concepto: l.concepto, nombre: l.nombre, cantidad: l.cantidad, unidad: l.unidad, unitario: l.unitario, valor: l.valor, origen: l.origen === 'contrato' ? 'Contrato Eurosurvey 2026' : 'Tarifario general RTG 2025', aprobacion: l.aprobacion === 'preacordada' ? 'Preacordada' : 'Liquidación', porDefinir: !!l.porDefinir })) } }));
  const baseCC = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) { if (ESC.indexOf(escena) < 0) return baseCC(escena); const S = SIM(); if (S) { S.reiniciar(); S.estado.puedePublicar = escena !== 'tarifsololectura'; } if (window.SiriusTarifas) window.SiriusTarifas.reiniciar();
    const U0 = CC.cxUsuarios || { usuarios: [], agencias: [] }, LP = window.SiriusLiqProceso; if (LP) { LP.borr = []; LP._cc = null; }
    return { usuario: clon(DAVID), casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, usuarios: clon(U0.usuarios || []).concat([clon(DAVID)]), agencias: clon(U0.agencias || []), inspectores: [],
      honorarios: honorarios(), liquidaciones: [], facturas: [], seq: { liq: 1418, fac: 1 }, tarifas: { escena } }; };
  const V = (window.SIRIUS_LIQ_PROCESO || {}).vistas; if (V) ESC.forEach((k) => { V[k] = { tab: 'Tarifarios' }; });
  CC.cxTarifas = { escenas: ESC };
})();
