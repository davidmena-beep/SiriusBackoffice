// SIRIUS · Motor IA-07-VL «Verificación de foto por paso» (v1 · Borrador · etapa 12d-1b · DEC-157, capa 2)
// Agrega el motor a SIRIUS_DATOS_IA (datos-motores-ia.js) sin tocar ese archivo. Recibe cada foto del portal del cliente con el
// nombre de su paso y responde si coincide o no, con confianza y motivo; un prompt por paso, con su versión y su umbral.
// Si no coincide con confianza alta, la foto queda «No corresponde al paso» para el calificador; con confianza baja, para revisión.
// Fuente de los pasos: SIRIUS_AUTOINSPECCION.pasos (v1.7) de Vehículos livianos, Motos y Equipo y maquinaria.
(function () {
  const D = window.SIRIUS_DATOS_IA; if (!D || !D.motores || D.motores.some(m => m.codigo === 'IA-07-VL')) return;
  const P = (paso, nombre, prompt, umbral) => ({ paso, nombre, prompt, version: '1', umbral: umbral || 85 });
  D.motores.push({
    codigo: 'IA-07-VL', variante: 'Vehículos livianos', motorBase: null, contieneDatosPersonales: true, motivoDatosPersonales: 'Las fotos muestran la placa, el VIN y la matrícula, que se vinculan con el propietario',
    nombre: 'Verificación de foto por paso', tipo: 'Verificación de foto por paso', version: '1', estado: 'Borrador',
    versiones: [{ version: '1', estado: 'Borrador', vigenteDesde: null, publicadaPor: null, motivo: null, precisionPrueba: null }],
    conexion: 'CNX-01',
    alcance: { plantillas: ['Vehículos livianos', 'Motos', 'Equipo y maquinaria'], ramos: ['Vehículos', 'Equipo y maquinaria'], modalidades: ['Autoinspección'] },
    activador: 'Al recibir cada foto aceptada en el portal del cliente (capa 2 de la validación de contenido)',
    entradas: [{ tipo: 'Evidencia', ref: 'Foto del paso, tal como la guardó el portal (área visible y posición del contorno)' }, { tipo: 'Plantilla', ref: 'Nombre del paso y su prompt (Formularios › pasos de autoinspección)' }, { tipo: 'Metadatos', ref: 'Resultado de la capa 1 en el celular (detector, OCR, foto repetida)' }],
    salidas: [{ destino: 'Evidencia', dato: 'Coincide con el paso: Sí o No', conConfianza: true }, { destino: 'Evidencia', dato: 'Motivo en una frase', conConfianza: false },
      { destino: 'Alerta', dato: '«No corresponde al paso» para el calificador cuando no coincide con confianza alta; revisión cuando la confianza es baja', conConfianza: true }],
    umbrales: { asignar: 85, porConfirmar: 60 },
    documentosBase: [],
    instrucciones: { estado: 'Borrador', origen: 'Nuevo · etapa 12d-1b (DEC-157)', texto: 'Recibes una foto y el nombre del paso de autoinspección que debía mostrar. Responde solo si la foto corresponde a ese paso: coincide (Sí o No), tu confianza de 0 a 100 y un motivo en una frase. No leas datos (placa, VIN, kilometraje): eso lo hace el motor de extracción. No juzgues la calidad de la foto: ya se validó en el celular. Si la foto muestra una pantalla, una foto impresa u otro vehículo, responde No. Usa el prompt del paso para saber qué debe verse.' },
    promptsPorPaso: [
      P('exteriores_frontal', 'Frente', '¿Se ve el frente completo de un vehículo, de cerca y centrado, con la parrilla y los faros? Responde No si es un lateral, el posterior o una parte suelta.'),
      P('exteriores_lateral_izquierdo', 'Lateral izquierdo', '¿Se ve el lado izquierdo completo del vehículo (lado del conductor), de la defensa delantera a la trasera? Responde No si es el lado derecho, una diagonal o falta una punta.'),
      P('exteriores_posterior', 'Posterior', '¿Se ve la parte trasera completa del vehículo, con la placa y las luces posteriores?'),
      P('exteriores_lateral_derecho', 'Lateral derecho', '¿Se ve el lado derecho completo del vehículo (lado del copiloto), de la defensa delantera a la trasera?'),
      P('motor_habitaculo_del_motor', 'Motor', '¿Se ve el compartimento del motor con el capó abierto? Responde No si el capó está cerrado o es otro compartimento.'),
      P('identificacion_vin', 'VIN grabado', '¿Se ve un número de chasis grabado en el metal o en la plaqueta del parabrisas? Responde No si es un sticker, una etiqueta adhesiva o un documento.', 80),
      P('interiores_kilometraje', 'Kilometraje', '¿Se ve de cerca el odómetro de un tablero encendido? No importa si el número no se lee: eso lo revisa el motor de extracción.', 80),
      P('interiores_tablero_completo', 'Tablero completo', '¿Se ven el volante y todo el tablero, tomados desde el asiento de atrás?'),
      P('interiores_tablero_central', 'Tablero central con radio', '¿Se ve la consola central con el radio o la pantalla encendidos?'),
      P('llanta_emergencia', 'Llanta de emergencia', '¿Se ve una llanta de emergencia completa en la cajuela, el balde o bajo el vehículo?'),
      P('eq_frontal', 'Equipo · frente', '¿Se ve el frente completo de un equipo o máquina (cargadora, excavadora, montacargas u otro), centrado?'),
      P('eq_lateral_izquierdo', 'Equipo · lateral izquierdo', '¿Se ve el lado izquierdo completo del equipo?'),
      P('eq_posterior', 'Equipo · posterior', '¿Se ve la parte trasera completa del equipo?'),
      P('eq_lateral_derecho', 'Equipo · lateral derecho', '¿Se ve el lado derecho completo del equipo?'),
      P('eq_tablero', 'Equipo · tablero con horómetro', '¿Se ve el tablero encendido del equipo con el horómetro?', 80),
      P('eq_placa_fabricante', 'Equipo · placa del fabricante', '¿Se ve la placa metálica del fabricante con la serie?', 80),
      P('eq_motor', 'Equipo · motor', '¿Se ve el compartimento del motor del equipo abierto?'),
      P('eq_implemento', 'Equipo · implemento', '¿Se ve el implemento (cucharón, horquillas o brazo) completo?'),
      P('eq_rodaje', 'Equipo · rodaje', '¿Se ven los neumáticos o las orugas del equipo?'),
    ],
    reglasSalida: ['No coincide con confianza igual o mayor al umbral del paso: la foto queda «No corresponde al paso» con alerta alta para el calificador.', 'Confianza entre el umbral de revisión (60) y el del paso: la foto queda marcada para revisión.', 'Coincide: sin marca. La respuesta y su motivo quedan en el detalle de la foto.'],
  });
  const VL = ((D.variantes || {}).lista || []).find(v => v.variante === 'Vehículos livianos'); if (VL && VL.motores.indexOf('IA-07-VL') < 0) VL.motores.push('IA-07-VL');
})();
