// SIRIUS · Configuración general de la compañía (v1 · provisional · etapa 11-c · 03/11/2026)
// Fuente única de: moneda y formato de montos, impuestos con vigencias (IVA), país, zona horaria e idioma.
// Toda pantalla, PDF, notificación y cálculo que muestre o sume dinero usa esta configuración. Decisión: DEC-139.
window.SIRIUS_COMPANIA = {
  version: '1', vigencia: 'Provisional',
  nombre: 'Aseguradora del Sur', pais: 'Ecuador', zonaHoraria: 'America/Guayaquil', idioma: 'es-EC',
  moneda: {
    codigo: 'USD', simbolo: 'USD', nombre: 'Dólar estadounidense', decimales: 2,
    separadorDecimal: ',', separadorMiles: '.', formato: '{simbolo} {monto}', // USD 1.234,50
    entrada: 'Se acepta coma o punto como separador decimal al escribir (12,5 · 12.5 · 1.234,50 · 1,234.50); al salir del campo se muestra con el formato de la compañía.',
    cambio: 'Cambiar la moneda no convierte los valores guardados: solo cambia cómo se muestran. Pide motivo y muestra el impacto (tarifarios, honorarios abiertos y liquidaciones sin pagar).',
  },
  monedasDisponibles: [
    { codigo: 'USD', simbolo: 'USD', nombre: 'Dólar estadounidense', decimales: 2 },
    { codigo: 'COP', simbolo: 'COP', nombre: 'Peso colombiano', decimales: 0 },
    { codigo: 'PEN', simbolo: 'S/', nombre: 'Sol peruano', decimales: 2 },
    { codigo: 'EUR', simbolo: '€', nombre: 'Euro', decimales: 2 },
  ],
  // Impuestos con vigencia: se aplica la tasa vigente en la fecha del hecho (cierre de la liquidación o fecha de la factura).
  impuestos: [
    { id: 'iva', nombre: 'IVA', tipo: 'Porcentaje', aplicaA: 'Honorarios de inspección (liquidaciones)', fechaBase: 'Fecha de la factura; si no hay, la del cierre de la liquidación',
      vigencias: [
        { tasa: 12, desde: '2016-06-01', hasta: '2024-03-31', nota: 'Tasa anterior' },
        { tasa: 15, desde: '2024-04-01', hasta: null, nota: 'Tasa vigente en Ecuador' },
      ] },
    { id: 'retencion', nombre: 'Retenciones', tipo: 'Por definir', aplicaA: 'Según el tipo de proveedor', vigencias: [], nota: 'Por definir con Contabilidad' },
  ],
  reglas: [
    'Una vigencia nueva cierra la anterior el día previo; no se permiten huecos ni cruces de fechas.',
    'Cambiar una tasa no recalcula liquidaciones ya facturadas; las abiertas se recalculan y se muestra el impacto antes de confirmar.',
    'Configuración general la edita el Administrador; Finanzas puede editar impuestos.',
  ],
};
(function () {
  const C = window.SIRIUS_COMPANIA;
  // Convierte texto escrito por el usuario a número: el último separador (coma o punto) es el decimal; los demás son miles.
  // Si el monto tiene más decimales que la moneda, la pantalla avisa «Usa hasta N decimales».
  C.leerMonto = (t) => { let s = String(t == null ? '' : t).trim().replace(/[^\d.,-]/g, ''); if (!s) return null;
    const ic = s.lastIndexOf(','), ip = s.lastIndexOf('.'), dec = Math.max(ic, ip);
    if (dec >= 0) { const frac = s.slice(dec + 1); const ent = s.slice(0, dec).replace(/[.,]/g, '');
      s = ent + '.' + frac; }
    const n = Number(s); return isNaN(n) ? null : n; };
  C.formatoMonto = (n, opts) => { if (n == null || isNaN(n)) return '—'; const m = C.moneda, d = (opts && opts.decimales != null) ? opts.decimales : m.decimales;
    const [e, f] = Math.abs(n).toFixed(d).split('.'); const miles = e.replace(/\B(?=(\d{3})+(?!\d))/g, m.separadorMiles);
    const txt = (n < 0 ? '−' : '') + miles + (d ? m.separadorDecimal + f : ''); return m.formato.replace('{simbolo}', m.simbolo).replace('{monto}', txt); };
  C.tasa = (id, fechaIso) => { const i = C.impuestos.find(x => x.id === id); if (!i) return null; const f = fechaIso || '9999-12-31';
    const v = i.vigencias.find(v => v.desde <= f && (!v.hasta || f <= v.hasta)); return v ? v.tasa : null; };
})();
