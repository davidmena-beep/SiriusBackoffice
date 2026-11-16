// SIRIUS · Borrador de la calificación de un vehículo (etapa P-6f-c).
// Antes, cada opción del formulario de Calificación avisaba a toda la pantalla del caso (setState del Back-office) y esa pantalla se volvía a
// pintar completa (más de 1 s) antes de que el navegador marcara la opción. Ahora el formulario guarda su borrador aquí, sin tocar la pantalla del
// caso, y solo el botón «Aplicar a otros vehículos» (que depende de que el borrador esté completo) se suscribe a los cambios.
// Uso: SiriusCalBorrador.set(clave, { veredicto, cobertura, motivo, obs } | null), get(clave), valido(borrador), on(fn) → off();
//   componente SiriusCalBorrador.Aplicar { formKey, fijo, fijoOk, otros, puede, onAplicar(borrador | null), inicial }.
(function () {
  'use strict';
  const W = window; if (W.SiriusCalBorrador) return;
  const B = {}, D = {}, ON = [];
  B.valido = (d) => !!(d && d.veredicto && (d.veredicto === 'si' ? d.cobertura : d.motivo));
  B.get = (k) => D[String(k)] || null;
  B.set = (k, d) => { const clave = String(k); const ant = D[clave] || null; if (d) D[clave] = d; else delete D[clave];
    if (B.valido(ant) === B.valido(d || null)) return; // solo se avisa cuando cambia si «Aplicar a otros vehículos» se puede usar
    ON.slice().forEach((f) => { try { f(clave); } catch (e) { /* nada */ } }); };
  B.on = (f) => { ON.push(f); return () => { const i = ON.indexOf(f); if (i >= 0) ON.splice(i, 1); }; };
  function Aplicar(p) {
    const React = W.React, NS = W.AseguradoraDelSurDesignSystem_4fbf29 || {}, Btn = NS.Button, [, n] = React.useState(0);
    React.useEffect(() => B.on(() => n((x) => x + 1)), []);
    const d = B.get(p.formKey) || p.inicial || null, ok = p.fijo ? !!p.fijoOk : B.valido(d);
    const motivo = !p.otros ? 'No hay otros vehículos por calificar' : !ok ? 'Elige primero el veredicto y la cobertura' : !p.puede ? 'No puedes calificar: tu rol no tiene permiso o el caso ya está emitido' : undefined;
    const clic = () => { if (p.onAplicar) p.onAplicar(p.fijo ? null : (B.get(p.formKey) || p.inicial || null)); }; // el borrador de ese momento, no el del último pintado
    return Btn ? React.createElement(Btn, { variant: 'secondary', size: 'sm', onClick: clic, unavailableReason: motivo }, 'Aplicar a otros vehículos')
      : React.createElement('button', { type: 'button', onClick: motivo ? undefined : clic, 'aria-disabled': motivo ? 'true' : undefined, title: motivo }, 'Aplicar a otros vehículos');
  }
  B.Aplicar = Aplicar;
  W.SiriusCalBorrador = B;
})();
