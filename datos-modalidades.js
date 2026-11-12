// SIRIUS · Modalidades por plantilla, criterios para ofrecer la autoinspección y catálogo de documentos del cliente
// (v1.1 · etapas P-6e-1 y P-6e-1b · DEC-203, DEC-204 y DEC-206). Solo datos: la lógica y las pantallas están en sirius-modalidades.js.
//
// · SIRIUS_MODALIDADES.porPlantilla[nombre de la plantilla]: valores iniciales de cada versión cuando todavía no los tiene guardados.
//   modalidades = { P, V, A, D } (Presencial, Virtual guiada, Autoinspección, Documental; al menos una activa) · DEC-204 (reemplaza DEC-182).
//   criteriosA = { activo, sumaMax, anioMin, carrocerias, sucursales } · DEC-206 (todos opcionales; sin activar, la autoinspección se ofrece en todos los casos del ramo).
//   documentos = { idDoc: { uso: 'requerido' | 'otro' | 'no', portales: { agendamiento, autoinspeccion } } } · DEC-203.
// · SIRIUS_DOCUMENTOS_CLIENTE: catálogo global de documentos del cliente (vale para los dos portales), publicado con SiriusPublicar como su propia clave.
// · escenas: datos que usan solo las escenas de demostración (se limpian al cambiar de escena).
(function () {
  const AMBOS = { agendamiento: true, autoinspeccion: true }, NINGUNO = { agendamiento: false, autoinspeccion: false };
  const uso = (u, p) => ({ uso: u, portales: Object.assign({}, p || (u === 'no' ? NINGUNO : AMBOS)) });
  const sinCriterios = () => ({ activo: false, sumaMax: null, anioMin: null, carrocerias: [], sucursales: [] });
  window.SIRIUS_MODALIDADES = {
    version: '1.1', etapa: 'P-6e-1b',
    nombres: { P: 'Presencial', V: 'Virtual guiada', A: 'Autoinspección', D: 'Documental' },
    // Igual que hoy con DEC-182: Vehículos livianos y Pesados con las cuatro; Motos sin Documental; Equipo y maquinaria y Ramos Generales solo Presencial.
    porPlantilla: {
      'Vehículos livianos': { modalidades: { P: true, V: true, A: true, D: true }, criteriosA: sinCriterios(),
        documentos: { matricula: uso('requerido'), licencia: uso('requerido'), cedula: uso('otro'), contrato: uso('otro'), factura_extra: uso('otro'), ficha_tecnica: uso('no') } },
      'Motos': { modalidades: { P: true, V: true, A: true, D: false }, criteriosA: sinCriterios(),
        documentos: { matricula: uso('requerido'), licencia: uso('requerido'), cedula: uso('otro'), contrato: uso('otro'), factura_extra: uso('no'), ficha_tecnica: uso('no') } },
      'Pesados': { modalidades: { P: true, V: true, A: true, D: true }, criteriosA: sinCriterios(),
        documentos: { matricula: uso('requerido'), licencia: uso('requerido'), cedula: uso('otro'), contrato: uso('otro'), factura_extra: uso('otro'), ficha_tecnica: uso('no') } },
      'Equipo y maquinaria': { modalidades: { P: true, V: false, A: false, D: false }, criteriosA: sinCriterios(),
        documentos: { matricula: uso('no'), licencia: uso('no'), cedula: uso('no'), contrato: uso('no'), factura_extra: uso('no'), ficha_tecnica: uso('no') } },
      'Ubicación – Ramos Generales': { modalidades: { P: true, V: false, A: false, D: false }, criteriosA: sinCriterios(),
        documentos: { matricula: uso('no'), licencia: uso('no'), cedula: uso('no'), contrato: uso('no'), factura_extra: uso('no'), ficha_tecnica: uso('no') } }
    },
    // Opciones del bloque «Cuándo se ofrece» (DEC-206).
    carrocerias: ['Sedán', 'Hatchback', 'SUV', 'Camioneta cabina simple', 'Camioneta doble cabina', 'Furgoneta', 'Moto'],
    sucursales: ['Quito Norte', 'Quito Sur', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato', 'Ibarra'],
    escenas: {
      // formmodalidades: el borrador de Motos activa Documental (sin publicar).
      formmodalidades: { plantilla: 'Motos', modalidad: 'D', valor: true },
      // formcriteriosA: el borrador de Vehículos livianos con los criterios activos.
      formcriteriosA: { plantilla: 'Vehículos livianos', criteriosA: { activo: true, sumaMax: 40000, anioMin: 2012, carrocerias: ['Sedán', 'Hatchback', 'SUV'], sucursales: [] } },
      // coordmodalidades: la versión vigente de Vehículos livianos con criterios (suma asegurada hasta USD 25.000); 20186 (USD 27.800) y 20190 (Robo).
      coordmodalidades: { casos: ['20186', '20190'], vigentes: { 'Vehículos livianos': { criteriosA: { activo: true, sumaMax: 25000, anioMin: null, carrocerias: [], sucursales: [] } } } },
      // coordcxmoto (P-6e-1b): un caso de Vehículos con los datos que entrega la conexión; el riesgo trae formularios ['Motos'] y carrocerias ['moto'].
      coordcxmoto: { caso: '20186', datos: { placa: 'IMB4417', bien: 'IMB4417', placas: ['IMB4417'], formularios: ['Motos'], carrocerias: ['moto'], anios: [2021], sumaAsegurada: 8500 } }
    }
  };
  window.SIRIUS_DOCUMENTOS_CLIENTE = {
    version: 1, publicadoEn: '18/10/2026 · 20:30', publicadoPor: 'Andrea Salazar', motivo: 'Catálogo inicial de documentos del cliente (DEC-203)',
    documentos: [
      { id: 'matricula', nombre: 'Matrícula del vehículo', icono: 'vehiculo', captura: 'frenteReverso', min: 2, max: 2, pasos: ['documentos_matricula_frontal', 'documentos_matricula_posterior'], lecturas: ['Placa', 'Marca', 'Modelo', 'Año', 'VIN', 'Propietario'], estado: 'Vigente' },
      { id: 'licencia', nombre: 'Licencia de conducir', icono: 'tarjeta', captura: 'frenteReverso', min: 2, max: 2, pasos: ['documentos_licencia_frontal', 'documentos_licencia_posterior'], lecturas: ['Nombre', 'Número de licencia', 'Tipo', 'Vigencia'], estado: 'Vigente' },
      { id: 'cedula', nombre: 'Cédula de identidad', icono: 'tarjeta', captura: 'frenteReverso', min: 2, max: 2, pasos: ['documentos_cedula_frontal', 'documentos_cedula_posterior'], lecturas: [], estado: 'Vigente' },
      { id: 'contrato', nombre: 'Contrato de compraventa', icono: 'documento', captura: 'varias', min: 1, max: 15, pasos: ['documentos_contrato_de_compravent'], lecturas: [], estado: 'Vigente' },
      { id: 'factura_extra', nombre: 'Factura de un extra', icono: 'factura', captura: 'varias', min: 1, max: 1, porExtra: true, pasos: ['extras_extras'], lecturas: [], estado: 'Vigente' },
      { id: 'ficha_tecnica', nombre: 'Ficha técnica del equipo', icono: 'documento', captura: 'varias', min: 1, max: 5, pasos: ['eq_doc_ficha'], lecturas: [], estado: 'Borrador' }
    ]
  };
})();
