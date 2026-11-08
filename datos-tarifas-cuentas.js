// SIRIUS · Tarifas de la agencia a sus inspectores y cuentas bancarias (etapa 15-4 · DEC-174) · v1.0 · PROVISIONAL
// Solo datos: la lógica está en sirius-tarifas-cuentas.js (SiriusTarifasCuentas). Complementa SIRIUS_APP_INSPECTOR.honorarios (v1.2),
// SIRIUS_HONORARIOS (tarifa de la aseguradora a cada proveedor), SIRIUS_LIQUIDACIONES y SIRIUS_USUARIOS (agencias e inspectores).
// · tarifasAgencia: lo que cada agencia paga a SUS inspectores (no es lo que la aseguradora paga a la agencia). Por grupo de ramo:
//   fija por visita en Vehículos; por visita o por hora en Ramos Generales y en Equipo y maquinaria. «General de la agencia» (inspector null)
//   o propia de un inspector (reemplaza a la general solo en su grupo). Vigencia sin cruces: una tarifa nueva cierra la anterior.
// · cuentas: cuenta bancaria vigente de cada agencia (titular y RUC) y de cada inspector independiente (titular y cédula). Un cambio queda
//   «Pendiente de aprobación» hasta que Finanzas lo aprueba con motivo; mientras tanto los pagos usan la cuenta anterior.
// · El número de cuenta es dato personal (LOPDP): fuera de Finanzas y del propio titular se muestra enmascarado (···4521).
// · actividad: visitas de ejemplo de los inspectores de agencia por mes (las de octubre, hasta el 18/10). Se suman los honorarios de los casos.
// · pagosSimulados: estado de pago que en producción devolverá el sistema financiero contable (CNX-12); aquí son datos de ejemplo «simulado».
window.SIRIUS_TARIFAS_CUENTAS = {
  version: '1.0',
  vigencia: 'Provisional (etapa 15-4 · DEC-174)',
  bancos: ['Banco Pichincha', 'Banco Guayaquil', 'Banco del Pacífico', 'Produbanco', 'Banco Internacional', 'Banco Bolivariano', 'Banco del Austro', 'Banco General Rumiñahui', 'Banco de Loja', 'Banco Solidario', 'Cooperativa JEP'],
  tiposCuenta: ['Ahorros', 'Corriente'],
  validacion: { digitosMin: 6, digitosMax: 20, motivoMin: 10 },
  grupos: [
    { id: 'Vehículos', unidades: ['visita'], nota: 'Tarifa fija por visita' },
    { id: 'Ramos Generales', unidades: ['visita', 'hora'], nota: 'Por visita o por hora' },
    { id: 'Equipo y maquinaria', unidades: ['visita', 'hora'], nota: 'Por visita o por hora' }],
  quienEdita: 'Finanzas de agencia (solo su agencia) y el Administrador; el resto de la aseguradora la ve en solo lectura.',
  tarifasAgencia: [
    { id: 'TAI-EUR-0', agencia: 'eurosurvey', inspector: null, grupo: 'Vehículos', unidad: 'visita', valor: 8.00, desde: '2025-01-01', hasta: '2025-12-31', motivo: 'Tarifa 2025 de la agencia', por: 'Carla Ponce', at: '2024-12-20T10:00' },
    { id: 'TAI-EUR-1', agencia: 'eurosurvey', inspector: null, grupo: 'Vehículos', unidad: 'visita', valor: 8.50, desde: '2026-01-01', hasta: null, motivo: 'Tarifa 2026 de la agencia (contrato Eurosurvey 2026)', por: 'Carla Ponce', at: '2025-12-18T16:20' },
    { id: 'TAI-EUR-2', agencia: 'eurosurvey', inspector: null, grupo: 'Ramos Generales', unidad: 'hora', valor: 20.00, desde: '2026-01-01', hasta: null, motivo: 'Tarifa 2026 de la agencia (contrato Eurosurvey 2026)', por: 'Carla Ponce', at: '2025-12-18T16:20' },
    { id: 'TAI-EUR-3', agencia: 'eurosurvey', inspector: null, grupo: 'Equipo y maquinaria', unidad: 'visita', valor: 35.00, desde: '2026-01-01', hasta: null, motivo: 'Tarifa 2026 de la agencia (contrato Eurosurvey 2026)', por: 'Carla Ponce', at: '2025-12-18T16:20' },
    { id: 'TAI-EUR-4', agencia: 'eurosurvey', inspector: 'Mauricio Endara', grupo: 'Vehículos', unidad: 'visita', valor: 9.00, desde: '2026-10-01', hasta: null, motivo: 'Se suma a la red de inspectores (DEC-172) con más disponibilidad y zonas', por: 'Carla Ponce', at: '2026-09-28T11:05' },
    { id: 'TAI-AND-1', agencia: 'andinas', inspector: null, grupo: 'Vehículos', unidad: 'visita', valor: 8.00, desde: '2026-01-01', hasta: null, motivo: 'Tarifa 2026 de la agencia', por: 'Andrea Salazar', at: '2026-01-05T09:30' },
    { id: 'TAI-AND-2', agencia: 'andinas', inspector: null, grupo: 'Ramos Generales', unidad: 'visita', valor: 45.00, desde: '2026-01-01', hasta: null, motivo: 'Tarifa 2026 de la agencia', por: 'Andrea Salazar', at: '2026-01-05T09:30' }],
  // Identificación de los inspectores independientes tal como está en su ficha (la de las agencias es su RUC en SIRIUS_USUARIOS.agencias).
  identificaciones: { 'Luis Andrade': { tipo: 'Cédula', numero: '1715203640' } },
  cuentas: [
    { titular: 'agencia:eurosurvey', banco: 'Banco Guayaquil', tipo: 'Corriente', numero: '0012873360', nombre: 'Eurosurvey S.A.', identificacion: '1791456320001', desde: '2026-01-02', aprobada: { por: 'Mónica Ríos', at: '2026-01-02T10:15', motivo: 'Cuenta del contrato Eurosurvey 2026, con certificado bancario' } },
    { titular: 'agencia:andinas', banco: 'Banco del Austro', tipo: 'Corriente', numero: '3104457788', nombre: 'Inspecciones Andinas Cía. Ltda.', identificacion: '1792788441001', desde: '2026-01-06', aprobada: { por: 'Mónica Ríos', at: '2026-01-06T12:40', motivo: 'Cuenta del contrato 2026, con certificado bancario' } },
    { titular: 'insp:Luis Andrade', banco: 'Banco Pichincha', tipo: 'Ahorros', numero: '2204714521', nombre: 'Luis Andrade', identificacion: '1715203640', desde: '2026-02-03', aprobada: { por: 'Mónica Ríos', at: '2026-02-03T09:20', motivo: 'Primera cuenta del inspector, con certificado bancario' } }],
  // Cambio pedido por el titular y todavía sin aprobar (los pagos siguen yendo a la cuenta vigente).
  cambios: [
    { id: 'CC-0007', titular: 'insp:Luis Andrade', banco: 'Produbanco', tipo: 'Corriente', numero: '27059038806', nombre: 'Luis Andrade', identificacion: '1715203640', estado: 'Pendiente de aprobación', por: 'Luis Andrade', at: '2026-10-18T19:10', motivo: 'Abrí una cuenta corriente para recibir los pagos de mis honorarios' }],
  actividad: [
    { agencia: 'eurosurvey', inspector: 'Diana Cárdenas', periodo: '2026-09', grupo: 'Vehículos', visitas: 21 },
    { agencia: 'eurosurvey', inspector: 'Diana Cárdenas', periodo: '2026-09', grupo: 'Ramos Generales', visitas: 2, horas: 7 },
    { agencia: 'eurosurvey', inspector: 'Mauricio Endara', periodo: '2026-09', grupo: 'Vehículos', visitas: 15 },
    { agencia: 'eurosurvey', inspector: 'Diana Cárdenas', periodo: '2026-10', grupo: 'Vehículos', visitas: 7 },
    { agencia: 'eurosurvey', inspector: 'Diana Cárdenas', periodo: '2026-10', grupo: 'Ramos Generales', visitas: 1, horas: 3.5 },
    { agencia: 'eurosurvey', inspector: 'Mauricio Endara', periodo: '2026-10', grupo: 'Vehículos', visitas: 9 },
    { agencia: 'andinas', inspector: 'Sofía Arteaga', periodo: '2026-09', grupo: 'Vehículos', visitas: 12 },
    { agencia: 'andinas', inspector: 'Jorge Pazmiño', periodo: '2026-09', grupo: 'Vehículos', visitas: 9 },
    { agencia: 'andinas', inspector: 'Sofía Arteaga', periodo: '2026-10', grupo: 'Vehículos', visitas: 6 },
    { agencia: 'andinas', inspector: 'Jorge Pazmiño', periodo: '2026-10', grupo: 'Vehículos', visitas: 5 }],
  pagosSimulados: [
    { liquidacion: 'LIQ-2026-09-LAN', estado: 'Pagada', fecha: '2026-10-16', referencia: 'SPI-2026-104477', simulado: true, nota: 'Estado de pago de ejemplo: en producción lo devuelve el sistema financiero contable (CNX-12)' },
    { liquidacion: 'LIQ-2026-09-EUR', estado: 'Pagada', fecha: '2026-10-10', referencia: 'SPI-2026-101932', simulado: true, nota: 'Estado de pago de ejemplo (CNX-12)' }],
  moduloFinanciero: 'Backlog (no se construye ahora): estado «Pagado» además de por aprobar y aprobado; la factura aprobada se envía al sistema financiero contable de la aseguradora (CNX-12) y este devuelve el estado de pago (pendiente, pagada con fecha y referencia, rechazada con motivo), visible para Finanzas, la agencia y el inspector independiente.'
};
