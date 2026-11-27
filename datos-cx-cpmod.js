// SIRIUS · Campos de Coordinación por modalidad, con la conexión simulada (v1.0 · provisional · etapa L-6 · 27/11/2026)
// «Contacto de seguridad en sitio» (momento Coordinación) se pide solo en Presencial (campo.modalidades = ['Presencial']).
// Escenas (Ramos Generales, caso 50012 con «Oficinas administrativas» por coordinar; la plantilla «Ubicación – Ramos Generales» ofrece la autoinspección solo en estas escenas):
//   coordcpauto → Coordinar visita en Autoinspección, fase Contacto: no pide el contacto de seguridad.
//   coordcppres → lo mismo en Presencial: sí lo pide (y sin escribirlo marca el error al avanzar).
// Los datos son de demostración, no los de la base real. La configuración real de las modalidades de Ramos Generales no cambia.
(function () {
  const CC = window.SIRIUS_CX_COORD; if (!CC || !CC.cxSim || !CC.cxEscenas || !CC.cxEscenas.coordriesgorg) return;
  const MOD = { coordcpauto: 'Autoinspección', coordcppres: 'Presencial' };
  Object.keys(MOD).forEach((k) => { CC.cxEscenas[k] = ['50012', 'ninguna']; });
  const prev = CC.cxSim.bind(CC);
  CC.cxSim = function (escena) {
    if (!MOD[escena]) return prev(escena);
    const X = prev('coordriesgorg'); if (X && X.coordEscena && X.coordEscena.fases) X.coordEscena.fases = Object.assign({}, X.coordEscena.fases, { fase: 'contacto', mod: MOD[escena] });
    return X; };
  CC.cxCpMod = { escenas: MOD, plantillaRG: 'Ubicación – Ramos Generales', modalidadesRG: { P: true, V: false, A: true, D: false } };
})();
