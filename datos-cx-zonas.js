// SIRIUS · Ciudades y zonas con la conexión simulada (v1.0 · provisional · etapa G-2a · DEC-221 y DEC-234 · 18/10/2026)
// Escena zonaspublicar: el Administrador publica 2 cambios de Quito; la base simulada recibe accion('publicarConfiguracion', { clave: 'SIRIUS_ZONAS', version, datos, motivo })
// y responde { ok: true } (con ?cxok=0 responde { ok: false } y la publicación vuelve atrás). Se suma a SIRIUS_CX_COORD (datos-cx-coordinacion.js), que limpia la escena al cambiar.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC) return;
  const ADM = { nombre: 'Andrea Salazar', email: 'andrea.salazar.admin@gmail.com', rol: 'Administrador', roles: ['Administrador', 'Coordinador de inspecciones'] };
  const ESC = { zonaspublicar: true };
  const baseCC = CC.cxSim.bind(CC);
  Object.keys(ESC).forEach((k) => { CC.cxEscenas[k] = ['', 'ninguna']; });
  CC.cxSim = function (escena) { if (!ESC[escena]) return baseCC(escena);
    return { usuario: ADM, casos: [], detalles: {}, eventos: {}, evidencias: {}, controles: {}, informes: {}, calificaciones: {}, inspectores: [] }; };
  CC.cxZonas = { escenas: ESC };
})();
