// SIRIUS · Columna Presencial de las plantillas alineada con la app del inspector (v1 · etapa C2-11 · 18/10/2026).
// La app del inspector arma su recorrido con la columna Presencial de la versión VIGENTE de la plantilla del ramo (Formularios › pasos de foto).
// Esta etapa deja esa columna con los pasos que hoy usa la app (19 en Vehículos livianos y 12 en Motos), en su orden, con su guía y su lectura,
// como versión nueva de cada plantilla (Vehículos livianos v4 y Motos v2). Los demás pasos no se borran: quedan sin marcar en Presencial y
// siguen en Virtual guiada, Autoinspección y Documental sin cambios. Los casos en curso conservan la versión con la que empezaron.
// Cada paso: app (identificador del paso en la app) · id (paso de la plantilla) · nombre · grupo · guia { tipo: silueta | franja | tarjeta | libre, vista }
//   · guide (texto de la guía en Formularios) · lee (lecturas: Placa, VIN, Motor, Kilometraje) · alimenta (campos) · min/max · nuevo (paso creado en esta etapa) · ayuda.
// Solo datos; la versión de Formularios la arma Formularios.dc.html y el recorrido de la app, sirius-app-visita.js.
window.SIRIUS_PRESENCIAL = {
  version: 1, etapa: 'C2-11', decision: 'DEC-187', desde: '2026-10-18', mod: '2026-10-18 20:30', por: 'Andrea Salazar',
  motivo: 'Presencial alineada con la app del inspector (etapa C2-11)',
  plantillas: {
    'Vehículos livianos': { formulario: 'f1', version: 4, base: 'Vehículos livianos v1', clave: 'Vehículos livianos v4', pasos: [
      { app: 'frente', id: 'exteriores_frontal', nombre: 'Frontal', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'frente' }, guide: 'Silueta · frente', lee: ['Placa'] },
      { app: 'lat_izq', id: 'exteriores_lateral_izquierdo_de_ade', nombre: 'Lateral izquierdo de adelante hacia atrás', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'lateral_izq' }, guide: 'Silueta · lateral izquierdo' },
      { app: 'posterior', id: 'exteriores_posterior', nombre: 'Posterior', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'posterior' }, guide: 'Silueta · posterior', lee: ['Placa'] },
      { app: 'lat_der', id: 'exteriores_lateral_derecho_de_ade', nombre: 'Lateral derecho de adelante hacia atrás', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'lateral_der' }, guide: 'Silueta · lateral derecho' },
      { app: 'parabrisas', id: 'exteriores_parabrisas', nombre: 'Parabrisas', grupo: 'Exteriores', guia: { tipo: 'libre' }, guide: 'Libre · parabrisas' },
      { app: 'motor', id: 'motor_habitaculo_del_motor', nombre: 'Habitáculo del motor', grupo: 'Motor', guia: { tipo: 'libre' }, guide: 'Libre · habitáculo del motor' },
      { app: 'vin', id: 'identificacion_chasis_en_relieve', nombre: 'Chasis en relieve', grupo: 'Identificación', guia: { tipo: 'franja' }, guide: 'Franja · VIN', lee: ['VIN'] },
      { app: 'motor_n', id: 'identificacion_numero_motor', nombre: 'Número de motor', grupo: 'Identificación', guia: { tipo: 'franja' }, guide: 'Franja · número de motor', lee: ['Motor'], alimenta: ['veh_numero_motor'], nuevo: true },
      { app: 'km', id: 'interiores_kilometraje', nombre: 'Kilometraje', grupo: 'Interiores', guia: { tipo: 'franja' }, guide: 'Franja · kilometraje', lee: ['Kilometraje'] },
      { app: 'tablero', id: 'interiores_tablero_de_instrumento', nombre: 'Tablero de instrumentos', grupo: 'Interiores', guia: { tipo: 'libre' }, guide: 'Libre · tablero de instrumentos' },
      { app: 'consola', id: 'interiores_radio_y_aire_acondicio', nombre: 'Radio y aire acondicionado', grupo: 'Interiores', guia: { tipo: 'libre' }, guide: 'Libre · radio y aire acondicionado' },
      { app: 'asientos_d', id: 'interiores_asientos_delanteros', nombre: 'Asientos delanteros', grupo: 'Interiores', guia: { tipo: 'libre' }, guide: 'Libre · asientos delanteros' },
      { app: 'asientos_t', id: 'interiores_asientos_posteriores', nombre: 'Asientos posteriores', grupo: 'Interiores', guia: { tipo: 'libre' }, guide: 'Libre · asientos posteriores' },
      { app: 'neum', id: 'llantas_neumaticos', nombre: 'Neumáticos', grupo: 'Llantas', guia: { tipo: 'libre' }, guide: 'Libre · las 4 llantas', min: 1, max: 4, nuevo: true, ayuda: 'Las 4 llantas en una foto o en varias (mínimo 1).' },
      { app: 'llanta', id: 'llantas_emergencia', nombre: 'Emergencia', grupo: 'Llantas', guia: { tipo: 'libre' }, guide: 'Libre · llanta de emergencia' },
      { app: 'mat_f', id: 'documentos_matricula_frontal', nombre: 'Matrícula frontal', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · matrícula frontal', lee: ['Placa', 'VIN'] },
      { app: 'mat_r', id: 'documentos_matricula_posterior', nombre: 'Matrícula posterior', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · matrícula posterior' },
      { app: 'lic_f', id: 'documentos_licencia_frontal', nombre: 'Licencia frontal', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · licencia frontal' },
      { app: 'lic_r', id: 'documentos_licencia_posterior', nombre: 'Licencia posterior', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · licencia posterior' },
    ] },
    'Motos': { formulario: 'f2', version: 2, base: 'Motos v1', clave: 'Motos v2', pasos: [
      { app: 'frente', id: 'exteriores_frontal', nombre: 'Frente', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'frente' }, guide: 'Silueta · frente' },
      { app: 'lat_izq', id: 'exteriores_lateral_izquierdo', nombre: 'Lateral izquierdo', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'lateral_izq' }, guide: 'Silueta · lateral izquierdo' },
      { app: 'posterior', id: 'exteriores_posterior', nombre: 'Posterior', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'posterior' }, guide: 'Silueta · posterior', lee: ['Placa'] },
      { app: 'lat_der', id: 'exteriores_lateral_derecho', nombre: 'Lateral derecho', grupo: 'Exteriores', guia: { tipo: 'silueta', vista: 'lateral_der' }, guide: 'Silueta · lateral derecho' },
      { app: 'motor', id: 'motor_motor', nombre: 'Motor', grupo: 'Motor', guia: { tipo: 'libre' }, guide: 'Libre · motor' },
      { app: 'vin', id: 'identificacion_vin_grabado', nombre: 'VIN grabado', grupo: 'Identificación', guia: { tipo: 'franja' }, guide: 'Franja · VIN', lee: ['VIN'] },
      { app: 'km', id: 'interiores_kilometraje', nombre: 'Kilometraje', grupo: 'Interiores', guia: { tipo: 'franja' }, guide: 'Franja · kilometraje', lee: ['Kilometraje'] },
      { app: 'neum', id: 'llantas_neumaticos', nombre: 'Neumáticos', grupo: 'Llantas', guia: { tipo: 'libre' }, guide: 'Libre · las 2 llantas', min: 1, max: 2, ayuda: 'Las 2 llantas en una foto o en varias (mínimo 1).' },
      { app: 'mat_f', id: 'documentos_matricula_frontal', nombre: 'Matrícula frontal', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · matrícula frontal', lee: ['Placa', 'VIN'] },
      { app: 'mat_r', id: 'documentos_matricula_posterior', nombre: 'Matrícula posterior', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · matrícula posterior' },
      { app: 'lic_f', id: 'documentos_licencia_frontal', nombre: 'Licencia frontal', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · licencia frontal' },
      { app: 'lic_r', id: 'documentos_licencia_posterior', nombre: 'Licencia posterior', grupo: 'Documentos', guia: { tipo: 'tarjeta' }, guide: 'Documento · licencia posterior' },
    ] },
  },
};
// Versiones nuevas en los datos de ejemplo (las lee la app del inspector); las anteriores quedan para los casos en curso.
(function () {
  const E = window.SIRIUS_EJEMPLO, SP = window.SIRIUS_PRESENCIAL; if (!E || !E.plantillas || !SP) return;
  const clon = (x) => JSON.parse(JSON.stringify(x));
  E.plantillasVigentes = E.plantillasVigentes || {};
  Object.keys(SP.plantillas).forEach((nombre) => { const D = SP.plantillas[nombre], B = E.plantillas[D.base]; if (!B || E.plantillas[D.clave]) return;
    const T = clon(B), ids = D.pasos.map((x) => x.id);
    D.pasos.forEach((x) => { let s = T.pasos.find((q) => q.id === x.id);
      if (!s) { s = { id: x.id, group: x.grupo, name: x.nombre, req: { P: true, V: false, A: false, D: false }, min: x.min || 1, max: x.max || 1, rep: false, ex: [], feedsX: [], link: '', guide: x.guide, sec: [], doc: '', pd: false, vis: null, nuevo: true };
        let i = -1; T.pasos.forEach((q, k) => { if (q.group === x.grupo) i = k; }); T.pasos.splice(i >= 0 ? i + 1 : T.pasos.length, 0, s); }
      s.name = x.nombre; s.guide = x.guide; s.guia = clon(x.guia); if (x.min) s.min = x.min; if (x.max) s.max = x.max; if (x.ayuda) s.ayuda = x.ayuda;
      (x.lee || []).forEach((l) => { if (s.ex.indexOf(l) < 0) s.ex.push(l); }); (x.alimenta || []).forEach((k) => { if (s.feedsX.indexOf(k) < 0) s.feedsX.push(k); }); });
    T.pasos.forEach((s) => { s.req = Object.assign({}, s.req, { P: ids.indexOf(s.id) >= 0 }); });
    Object.assign(T, { version: D.version, estado: 'Vigente', desde: SP.desde, motivo: SP.motivo, ordenPresencial: ids.slice(), nota: 'Etapa C2-11: columna Presencial alineada con la app del inspector' });
    E.plantillas[D.clave] = T; E.plantillasVigentes[nombre] = D.clave; });
})();
