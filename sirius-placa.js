// SIRIUS · Placa (etapa 16g-c · DEC-116)
// Regla única: datos-motores-ia.js → SIRIUS_DATOS_IA.validacionesFormato, id «placa».
// Normaliza (mayúsculas, sin guiones ni espacios) y valida contra los formatos de esa regla
// (automóvil ^[A-Z]{3}[0-9]{4}$, motocicleta ^[A-Z]{2}[0-9]{3}[A-Z]$). Aquí no se repiten los patrones.
(function () {
  function regla() {
    var D = window.SIRIUS_DATOS_IA || {};
    return (D.validacionesFormato || []).filter(function (x) { return x.id === 'placa'; })[0] || null;
  }
  function normalizar(v) { return String(v == null ? '' : v).toUpperCase().replace(/[-\s]/g, ''); }
  // 'auto', 'moto' o '' (no reconocida).
  function tipo(v) {
    var R = regla(), p = normalizar(v); if (!R || !p) return '';
    for (var i = 0; i < R.formatos.length; i++) {
      var f = R.formatos[i];
      if (new RegExp(f.patron).test(p)) return /motocicleta/i.test(f.tipo) ? 'moto' : 'auto';
    }
    return '';
  }
  // ¿El texto contiene la placa buscada? Compara sin guiones, espacios ni mayúsculas.
  function coincide(texto, consulta) { var q = normalizar(consulta); return !!q && normalizar(texto).indexOf(q) >= 0; }
  window.SIRIUS_PLACA = {
    regla: regla,
    normalizar: normalizar,
    tipo: tipo,
    valida: function (v) { return !!tipo(v); },
    esMoto: function (v) { return tipo(v) === 'moto'; },
    coincide: coincide,
    mensaje: 'Usa el formato ABC1234 (auto) o AB123C (moto).',
  };
})();
