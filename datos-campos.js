// SIRIUS · Campos personalizados del caso y del riesgo (v1.1 · provisional · etapa 10c · 31/10/2026)
// v1.1: el origen solo aplica a casos que llegan por integración; en la solicitud manual todo se llena a mano.
//       Valores de integración que no cumplen la validación se guardan y se marcan «Revisar» (no se rechazan).
// Fuente única de: definición de los campos adicionales que la compañía agrega a la solicitud (fuera del informe,
// que es de Formularios de inspección), sus reglas, sus valores en los casos de ejemplo y su historial.
// Consumen: Administración › Campos personalizados, Nueva solicitud, Detalle del caso y filtros de la Bandeja.
(function () {
  const C = {
    version: '1.1', vigencia: 'Provisional', compania: 'Aseguradora del Sur',
    entidades: [
      { id: 'caso', nombre: 'Caso', nota: 'Un valor por caso' },
      { id: 'riesgo', nombre: 'Riesgo', nota: 'Un valor por vehículo o equipo (id del riesgo, p. ej. 20141-V1). En Ramos Generales usa Caso: hay una sola ubicación.' },
    ],
    tipos: [
      { id: 'texto', nombre: 'Texto', validaciones: ['largo máximo', 'patrón'] },
      { id: 'numero', nombre: 'Número', validaciones: ['mínimo', 'máximo', 'decimales'] },
      { id: 'moneda', nombre: 'Moneda (según la configuración de la compañía)', validaciones: ['mínimo', 'máximo'] },
      { id: 'fecha', nombre: 'Fecha', validaciones: ['desde', 'hasta'] },
      { id: 'sino', nombre: 'Sí o no', validaciones: [] },
      { id: 'lista', nombre: 'Lista propia', validaciones: [] },
      { id: 'catalogo', nombre: 'Catálogo maestro', validaciones: [], nota: 'Toma las opciones de un catálogo de SIRIUS_CATALOGOS' },
    ],
    // Momento en que el campo se pide; «Opcional» = nunca obligatorio.
    momentos: ['Nueva solicitud', 'Coordinación', 'Opcional'],
    origenes: ['Manual', 'BPM de Emisión', 'Sur One'],
    reglas: [
      'La clave usa minúsculas, números y guion bajo, es única en la compañía y no cambia después de crear el campo.',
      'Un campo con valores no se elimina: se inactiva. Deja de pedirse y sus valores se ven en solo lectura en el Detalle.',
      'El tipo no cambia si el campo tiene valores. Una opción de lista en uso no se borra: se inactiva.',
      'Volver obligatorio un campo no bloquea los casos existentes: se exige la próxima vez que se graba en ese momento.',
      'El origen indica de dónde llega el valor cuando el caso se crea por integración (API del BPM de Emisión o de Sur One). En ese caso el usuario ya lo ve lleno y solo lo cambia quien tenga permiso de edición, con motivo.',
      'En la solicitud manual el usuario llena todos los campos activos que aplican, sin importar su origen; los obligatorios se validan en línea antes de grabar.',
      'Después de creado el caso, cada campo se edita según «Quién edita».',
      'Un valor recibido por integración que no cumple la validación no rechaza el caso: se guarda y se marca «Revisar» en el Detalle.',
      'Hasta 4 campos pueden ofrecerse como filtro en la Bandeja.',
      'Todo cambio pide motivo y muestra el impacto antes de confirmar: casos activos donde aplica, casos activos sin valor y pantallas donde aparece.',
    ],
    maxFiltrosBandeja: 4,
    campos: [
      { clave: 'canal_venta', etiqueta: 'Canal de venta', entidad: 'caso', tipo: 'lista', opciones: [{ v: 'Agencia' }, { v: 'Bróker' }, { v: 'Directo' }, { v: 'Banca seguros' }, { v: 'Feria comercial', activa: false }],
        ayuda: 'Canal por el que llegó el negocio.', aplicaA: ['Vehículos', 'Ramos Generales'], momento: 'Nueva solicitud', origen: 'BPM de Emisión', campoOrigen: 'canalVenta',
        ver: 'Todos los roles', editar: ['Ejecutivo comercial', 'Administrador'], filtroBandeja: true, estado: 'Activo', orden: 1, creado: ['Andrea Salazar', '2026-09-28T10:20'] },
      { clave: 'numero_cotizacion', etiqueta: 'Número de cotización', entidad: 'caso', tipo: 'texto', validacion: { patron: '^COT-\\d{4}-\\d{6}$', ejemplo: 'COT-2026-004512', largoMax: 15 },
        ayuda: 'Cotización de Sur One que originó la solicitud.', aplicaA: ['Vehículos', 'Ramos Generales'], momento: 'Opcional', origen: 'Sur One', campoOrigen: 'numeroCotizacion',
        ver: 'Todos los roles', editar: ['Administrador'], filtroBandeja: false, estado: 'Activo', orden: 2, creado: ['Andrea Salazar', '2026-09-28T10:24'] },
      { clave: 'uso_comercial', etiqueta: 'Uso comercial', entidad: 'riesgo', tipo: 'sino',
        ayuda: 'El vehículo presta servicio a terceros (carga, transporte o reparto).', aplicaA: ['Vehículos'], momento: 'Nueva solicitud', origen: 'Manual',
        ver: 'Todos los roles', editar: ['Ejecutivo comercial', 'Coordinador de inspecciones', 'Administrador'], filtroBandeja: true, estado: 'Activo', orden: 3, creado: ['Andrea Salazar', '2026-10-02T15:05'] },
      { clave: 'monto_credito', etiqueta: 'Monto del crédito prendario', entidad: 'riesgo', tipo: 'moneda', validacion: { min: 0, max: 250000 },
        ayuda: 'Solo si el vehículo está prendado; el beneficiario acreedor se registra en la solicitud.', aplicaA: ['Vehículos'], momento: 'Opcional', origen: 'Manual',
        ver: ['Ejecutivo comercial', 'Ejecutivo de inspecciones', 'Suscriptor', 'Administrador'], editar: ['Ejecutivo comercial', 'Administrador'], filtroBandeja: false, estado: 'Activo', orden: 4, creado: ['Andrea Salazar', '2026-10-02T15:12'] },
      { clave: 'contacto_seguridad', etiqueta: 'Contacto de seguridad en sitio', entidad: 'caso', tipo: 'texto', validacion: { largoMax: 80 },
        ayuda: 'Persona que abre el acceso al inspector (guardia, administrador del local).', aplicaA: ['Ramos Generales'], momento: 'Coordinación', origen: 'Manual',
        ver: 'Todos los roles', editar: ['Coordinador de inspecciones', 'Administrador'], filtroBandeja: false, estado: 'Activo', orden: 5, creado: ['Andrea Salazar', '2026-10-06T09:40'] },
      { clave: 'codigo_campana', etiqueta: 'Código de campaña', entidad: 'caso', tipo: 'texto', validacion: { largoMax: 12 },
        ayuda: 'Campaña comercial asociada.', aplicaA: ['Vehículos'], momento: 'Opcional', origen: 'Manual',
        ver: 'Todos los roles', editar: ['Ejecutivo comercial', 'Administrador'], filtroBandeja: false, estado: 'Inactivo', orden: 6, creado: ['Andrea Salazar', '2026-08-18T11:00'],
        inactivado: ['Andrea Salazar', '2026-10-01T08:45', 'La campaña Verano Seguro 2026 terminó el 30/09'] },
    ],
    // Valores de ejemplo: caso o id de riesgo → { clave: valor }. Los casos sin valor muestran «Sin dato».
    valores: {
      '20141': { canal_venta: 'Agencia', numero_cotizacion: 'COT-2026-004512' },
      '20141-V1': { uso_comercial: false, monto_credito: 18000 },
      '20152': { canal_venta: 'Directo' },
      '20160': { canal_venta: 'Bróker', codigo_campana: 'VERANO26' },
      '20160-V1': { uso_comercial: false },
      '20170': { canal_venta: 'Agencia', codigo_campana: 'VERANO26' },
      '20170-V1': { uso_comercial: false, monto_credito: 12500 },
      '20186': { canal_venta: 'Bróker' },
      '20196': { canal_venta: 'Bróker', numero_cotizacion: 'COT-2026-003977' },
      '20196-V1': { uso_comercial: true }, '20196-V2': { uso_comercial: true }, '20196-V3': { uso_comercial: true },
      '20198': { canal_venta: 'Banca seguros' },
      '20198-V1': { uso_comercial: true },
      '20137': { canal_venta: 'Agencia', contacto_seguridad: 'Wilson Zambrano, jefe de bodega' },
      '20166': { canal_venta: 'Directo' },
      '20184': { canal_venta: 'Bróker' },
      '20195': { canal_venta: 'Agencia', contacto_seguridad: 'Wilson Zambrano, jefe de bodega' },
      '20200': { canal_venta: 'Bróker' },
      '20187': { canal_venta: 'Directo', numero_cotizacion: 'COT-26-5108' }, // Caso de Sur One: la cotización llegó por API con formato inválido → «Revisar»
    },
    historial: [
      { fecha: '2026-10-06T09:40', por: 'Andrea Salazar', campo: 'contacto_seguridad', accion: 'Creó el campo', motivo: 'Los inspectores llegan y no tienen a quién pedir el acceso' },
      { fecha: '2026-10-02T15:12', por: 'Andrea Salazar', campo: 'monto_credito', accion: 'Creó el campo', motivo: 'Suscripción revisa la prenda al calificar' },
      { fecha: '2026-10-02T15:05', por: 'Andrea Salazar', campo: 'uso_comercial', accion: 'Creó el campo', motivo: 'Separar vehículos de flota con uso comercial' },
      { fecha: '2026-10-01T08:45', por: 'Andrea Salazar', campo: 'codigo_campana', accion: 'Inactivó el campo', motivo: 'La campaña Verano Seguro 2026 terminó el 30/09' },
      { fecha: '2026-09-30T17:10', por: 'Andrea Salazar', campo: 'canal_venta', accion: 'Inactivó la opción «Feria comercial»', motivo: 'Ya no se usa ese canal' },
      { fecha: '2026-09-28T10:24', por: 'Andrea Salazar', campo: 'numero_cotizacion', accion: 'Creó el campo', motivo: 'Trazabilidad con Sur One' },
      { fecha: '2026-09-28T10:20', por: 'Andrea Salazar', campo: 'canal_venta', accion: 'Creó el campo', motivo: 'Lo envía el BPM de Emisión' },
    ],
  };
  const grupo = (caso) => { const E = window.SIRIUS_EJEMPLO, r = E && E.ramos && E.ramos.find(x => x.nombre === caso.ramo); return r ? r.grupo : (caso.ramo === 'Vehículos' ? 'Vehículos' : 'Ramos Generales'); };
  C.campo = (clave) => C.campos.find(c => c.clave === clave) || null;
  // Campos activos que aplican a un caso (entidad 'caso' o 'riesgo'), en orden.
  C.camposDe = (caso, entidad, incluirInactivos) => C.campos.filter(c => c.entidad === entidad && c.aplicaA.includes(grupo(caso)) && (incluirInactivos || c.estado === 'Activo')).sort((a, b) => a.orden - b.orden);
  C.valor = (id, clave) => { const v = C.valores[id]; return v && clave in v ? v[clave] : null; };
  C.puedeVer = (campo, rol) => campo.ver === 'Todos los roles' || campo.ver.includes(rol);
  C.puedeEditar = (campo, rol) => campo.estado === 'Activo' && campo.editar.includes(rol);
  // Valida un valor; devuelve '' si es válido o el mensaje de error.
  C.validar = (campo, v) => {
    if (v === null || v === undefined || v === '') return '';
    const x = campo.validacion || {};
    if (campo.tipo === 'texto') { if (x.largoMax && String(v).length > x.largoMax) return 'Máximo ' + x.largoMax + ' caracteres.'; if (x.patron && !new RegExp(x.patron).test(v)) return 'Usa el formato ' + x.ejemplo + '.'; }
    if (campo.tipo === 'numero' || campo.tipo === 'moneda') { const n = Number(v); if (isNaN(n)) return 'Ingresa un número.'; const fm = (k) => campo.tipo === 'moneda' && window.SIRIUS_COMPANIA ? window.SIRIUS_COMPANIA.formatoMonto(k) : k; if (x.min != null && n < x.min) return 'El mínimo es ' + fm(x.min) + '.'; if (x.max != null && n > x.max) return 'El máximo es ' + fm(x.max) + '.'; }
    if (campo.tipo === 'lista' && !campo.opciones.some(o => o.v === v && o.activa !== false)) return 'Elige una opción de la lista.';
    return '';
  };
  // ¿El valor llegó por integración? Solo si el caso se creó por el mismo sistema que el origen del campo.
  C.recibido = (campo, caso) => campo.origen !== 'Manual' && !!caso && caso.origen === campo.origen && C.valor(caso.id, campo.clave) !== null;
  // En la creación manual todo campo activo se llena (sin bloqueo por origen); después se edita según «Quién edita».
  C.editable = (campo, rol, creando) => campo.estado === 'Activo' && (creando ? true : campo.editar.includes(rol));
  // Aviso para valores recibidos que no cumplen la validación ('' si no hay aviso).
  C.revisar = (campo, caso) => { if (!C.recibido(campo, caso)) return ''; const e = C.validar(campo, C.valor(caso.id, campo.clave)); return e ? 'Revisar: el valor recibido de ' + campo.origen + ' no cumple la validación. ' + e : ''; };
  // Formato para mostrar.
  C.mostrar = (campo, v) => {
    if (v === null || v === undefined || v === '') return 'Sin dato';
    if (campo.tipo === 'sino') return v ? 'Sí' : 'No';
    if (campo.tipo === 'moneda') return window.SIRIUS_COMPANIA.formatoMonto(Number(v));
    return String(v);
  };
  window.SIRIUS_CAMPOS = C;
})();
