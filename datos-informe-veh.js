// SIRIUS · Valores complementarios de informes de Vehículos para la salida en PDF (v1 · provisional · etapa SV · 31/10/2026)
// Completa, solo para 4 vehículos de ejemplo, los campos de la plantilla «Vehículos livianos» v1 que datos-ejemplo.js no trae.
// Regla: un valor que ya existe en SIRIUS_EJEMPLO.vehiculos (base, informe.campos o informe.grillas) manda; este archivo nunca lo
// reemplaza. Los cálculos (kilometraje por año, valores sugeridos, diferencias) no se guardan aquí: los resuelve la salida.
// Vehículos: 20175-V1 (PDQ9031), 20196-V1 (PBA4521), 20196-V2 (GSE1098) y 20196-V3 (Kia Sportage 2026 sin placa).
// Los demás vehículos muestran «—» en lo que no tengan.
(function () {
  const S = 'inspector'; // origen de los valores registrados por el inspector o el calificador
  window.SIRIUS_INFORME_VEH = {
    version: '1', vigencia: 'Provisional',
    complementos: {
      '20175-V1': {
        campos: {
          veh_persona_atiende: 'Paúl Ortega Jaramillo', veh_relacion_asegurado: 'Asegurado',
          veh_vin: 'MR0HA3FS8L0412736', veh_numero_motor: '1GD4127365', veh_color: 'Gris', veh_pais_origen: 'Japón', veh_cilindraje: 2755, veh_pasajeros: 7, veh_combustible: 'Diésel', veh_camv_cpn: 'CPN-2020-118844',
          veh_nombre_matricula: 'Paúl Ortega Jaramillo', veh_identificacion_propietario: '1714528390', veh_gad_matriculacion: 'Quito', veh_anio_matricula: 2026, veh_vigencia_matricula: '30/06/2027', veh_interes_asegurable: 'Propietario', veh_contrato_compraventa: 'No',
          veh_ciudad_circulacion: 'Quito', veh_anio_compra: 2020, veh_conductor_habitual: 'Es el asegurado', veh_tipo_licencia: 'B', veh_caducidad_licencia: '14/02/2029', veh_puntos_licencia: 30,
          veh_verificacion_chasis_relieve: 'Verificado', veh_verificacion_sticker_vin: 'Verificado', veh_verificacion_plaqueta_panoramica: 'Verificado',
          veh_telemetria: 'No', veh_satelital: 'Sí', veh_proveedor_satelital: 'Hunter', veh_descripcion_satelital: 'Rastreo con botón de pánico, contrato vigente hasta 2027', veh_blindaje: 'No',
          veh_radio: 'Fijo', veh_aros: 'Aluminio', veh_cantidad_airbags: 7, veh_vidrios_electricos: 'Sí', veh_laminas_seguridad: 'Sí', veh_aire_acondicionado: 'Sí', veh_neblineros: 'Sí', veh_estribos: 'Sí', veh_parrilla: 'No', veh_sunroof: 'No', veh_techo_panoramico: 'No', veh_camara_retro: 'Sí',
          veh_testigo_check_engine: 'Apagado', veh_testigo_abs: 'Apagado', veh_testigo_airbag: 'Apagado', veh_testigo_presion_aceite: 'Apagado', veh_testigo_bateria: 'Apagado', veh_testigo_temperatura: 'Apagado', veh_testigo_frenos: 'Apagado',
          veh_decision_inspector: 'Enviar a calificación', veh_cobertura: 'Todo riesgo', veh_motivo_envio_a_calificacion: 'Vehículo de alto valor (USD 41.500): requiere calificación.',
          veh_observacion_general: 'Vehículo en buen estado general, sin daños visibles. Mantenimientos en concesionario al día según el cliente.', veh_firma_atiende: 'Firma de Paúl Ortega Jaramillo',
        },
        grillas: {
          neu: { 'Delantera izquierda': { marca: 'Michelin', medida: '265/60 R18', labrado: '5,8' }, 'Delantera derecha': { marca: 'Michelin', medida: '265/60 R18', labrado: '5,9' }, 'Trasera izquierda': { marca: 'Michelin', medida: '265/60 R18', labrado: '5,2' }, 'Trasera derecha': { marca: 'Michelin', medida: '265/60 R18', labrado: '5,3' }, 'Repuesto': { marca: 'Michelin', medida: '265/60 R18', labrado: '8,0' } },
          ext: [],
          ave: [],
          vex: { _all: { res: 'Sin novedad', at: '03/10/26 · 16:20', forma: 'Consulta automática' } },
        },
      },
      '20196-V1': {
        campos: {
          veh_persona_atiende: 'Ramiro Paz', veh_relacion_asegurado: 'Empleado',
          veh_numero_motor: '2ZR8312047', veh_pais_origen: 'Brasil', veh_cilindraje: 1798, veh_pasajeros: 5, veh_combustible: 'Gasolina', veh_camv_cpn: 'CAMV-2022-551208',
          veh_gad_matriculacion: 'Quito', veh_interes_asegurable: 'Propietario', veh_contrato_compraventa: 'No',
          veh_ciudad_circulacion: 'Quito', veh_anio_compra: 2022, veh_conductor_habitual: 'Otra persona', veh_cedula_conductor: '1720458813', veh_nombre_conductor: 'Ramiro Paz', veh_edad_conductor: 38, veh_tipo_licencia: 'B', veh_caducidad_licencia: '22/09/2028', veh_puntos_licencia: 28,
          veh_verificacion_chasis_relieve: 'Verificado', veh_verificacion_sticker_vin: 'Verificado', veh_verificacion_plaqueta_panoramica: 'No verificado',
          veh_telemetria: 'Sí', veh_tipo_dispositivo: 'GPS', veh_fecha_instalacion: '12/04/2022', veh_voucher: 'VCH-88214', veh_imei: '356938035643809', veh_id_dispositivo: 'GPS-PBA4521', veh_satelital: 'No', veh_blindaje: 'No',
          veh_radio: 'Fijo', veh_aros: 'Aluminio', veh_cantidad_airbags: 7, veh_vidrios_electricos: 'Sí', veh_laminas_seguridad: 'Sí', veh_aire_acondicionado: 'Sí', veh_neblineros: 'Sí', veh_estribos: 'No', veh_parrilla: 'No', veh_sunroof: 'No', veh_techo_panoramico: 'No', veh_camara_retro: 'Sí',
          veh_decision_inspector: 'Enviar a calificación', veh_cobertura: 'Todo riesgo', veh_motivo_envio_a_calificacion: 'Valor sugerido del casco 12,1 % menor al asegurado.',
          veh_observacion_general: 'Parachoques posterior con rayón y puerta delantera derecha con abolladura. El cliente indica siniestro de 2024.', veh_firma_atiende: 'Firma de Ramiro Paz',
        },
      },
      '20196-V2': {
        campos: {
          veh_persona_atiende: 'Ramiro Paz', veh_relacion_asegurado: 'Empleado',
          veh_vin: '8LBETF3W5K0345612', veh_numero_motor: '4JJ1-904417', veh_color: 'Blanco', veh_pais_origen: 'Ecuador', veh_cilindraje: 2999, veh_pasajeros: 5, veh_combustible: 'Diésel', veh_camv_cpn: 'CPN-2019-307715',
          veh_nombre_matricula: 'Distribuidora Andina de Alimentos S.A.', veh_identificacion_propietario: '1792456781001', veh_gad_matriculacion: 'Quito', veh_anio_matricula: 2026, veh_vigencia_matricula: '31/05/2027', veh_interes_asegurable: 'Propietario', veh_contrato_compraventa: 'No',
          veh_ciudad_circulacion: 'Quito', veh_anio_compra: 2019, veh_conductor_habitual: 'Otra persona', veh_cedula_conductor: '1709923456', veh_nombre_conductor: 'Luis Guamán', veh_edad_conductor: 45, veh_tipo_licencia: 'C', veh_caducidad_licencia: '03/11/2027', veh_puntos_licencia: 30,
          veh_verificacion_chasis_relieve: 'Verificado', veh_verificacion_sticker_vin: 'Verificado', veh_verificacion_plaqueta_panoramica: 'Verificado',
          veh_telemetria: 'No', veh_satelital: 'Sí', veh_proveedor_satelital: 'Carseg', veh_descripcion_satelital: 'Rastreo satelital con apagado remoto', veh_blindaje: 'No',
          veh_radio: 'Fijo', veh_aros: 'Hierro', veh_cantidad_airbags: 2, veh_vidrios_electricos: 'Sí', veh_laminas_seguridad: 'No', veh_aire_acondicionado: 'Sí', veh_neblineros: 'No', veh_estribos: 'Sí', veh_parrilla: 'No', veh_sunroof: 'No', veh_techo_panoramico: 'No', veh_camara_retro: 'No',
          veh_testigo_check_engine: 'Apagado', veh_testigo_abs: 'Apagado', veh_testigo_airbag: 'Apagado', veh_testigo_presion_aceite: 'Apagado', veh_testigo_bateria: 'Apagado', veh_testigo_temperatura: 'Apagado', veh_testigo_frenos: 'Apagado',
          veh_decision_inspector: 'Determinar como asegurable', veh_cobertura: 'Pérdida total',
          veh_observacion_general: 'Desgaste normal por uso; sin daños relevantes.', veh_firma_atiende: 'Firma de Ramiro Paz',
        },
        grillas: {
          neu: { 'Delantera izquierda': { marca: 'Firestone', medida: '245/70 R16', labrado: '4,6' }, 'Delantera derecha': { marca: 'Firestone', medida: '245/70 R16', labrado: '4,8' }, 'Trasera izquierda': { marca: 'Firestone', medida: '245/70 R16', labrado: '4,1' }, 'Trasera derecha': { marca: 'Firestone', medida: '245/70 R16', labrado: '4,3' }, 'Repuesto': { marca: 'Firestone', medida: '245/70 R16', labrado: '7,5' } },
          ext: [], ave: [],
        },
      },
      '20196-V3': {
        campos: {
          veh_persona_atiende: 'Ramiro Paz', veh_relacion_asegurado: 'Empleado',
          veh_vin: 'U5YPU81CBTL204518', veh_numero_motor: 'G4NA-TL204518', veh_color: 'Negro', veh_pais_origen: 'Corea del Sur', veh_cilindraje: 1999, veh_pasajeros: 5, veh_combustible: 'Gasolina',
          veh_nombre_matricula: 'Distribuidora Andina de Alimentos S.A.', veh_identificacion_propietario: '1792456781001', veh_interes_asegurable: 'Propietario', veh_contrato_compraventa: 'Sí',
          veh_ciudad_circulacion: 'Quito', veh_anio_compra: 2026, veh_conductor_habitual: 'Otra persona', veh_cedula_conductor: '1720458813', veh_nombre_conductor: 'Ramiro Paz', veh_edad_conductor: 38, veh_tipo_licencia: 'B',
          veh_verificacion_chasis_relieve: 'No aplica', veh_verificacion_sticker_vin: 'Verificado', veh_verificacion_plaqueta_panoramica: 'No aplica',
          veh_telemetria: 'No', veh_satelital: 'No', veh_blindaje: 'No',
          veh_radio: 'Fijo', veh_aros: 'Aluminio', veh_cantidad_airbags: 6, veh_vidrios_electricos: 'Sí', veh_laminas_seguridad: 'No', veh_aire_acondicionado: 'Sí', veh_neblineros: 'Sí', veh_estribos: 'No', veh_parrilla: 'Sí', veh_sunroof: 'No', veh_techo_panoramico: 'Sí', veh_camara_retro: 'Sí',
          veh_testigo_check_engine: 'Apagado', veh_testigo_abs: 'Apagado', veh_testigo_airbag: 'Apagado', veh_testigo_presion_aceite: 'Apagado', veh_testigo_bateria: 'Apagado', veh_testigo_temperatura: 'Apagado', veh_testigo_frenos: 'Apagado',
          veh_cobertura: 'Todo riesgo',
          veh_observacion_general: 'Vehículo 0 km entregado por el concesionario el 15/10/26. Factura y acta de entrega revisadas.',
        },
        grillas: {
          neu: { 'Delantera izquierda': { marca: 'Kumho', medida: '235/60 R18', labrado: '8,0' }, 'Delantera derecha': { marca: 'Kumho', medida: '235/60 R18', labrado: '8,0' }, 'Trasera izquierda': { marca: 'Kumho', medida: '235/60 R18', labrado: '8,0' }, 'Trasera derecha': { marca: 'Kumho', medida: '235/60 R18', labrado: '8,0' }, 'Repuesto': { marca: 'Kumho', medida: '235/60 R18', labrado: '8,0' } },
          ext: [], ave: [],
          vex: { _all: { res: 'Sin novedad', at: '16/10/26 · 11:20', forma: 'Consulta automática' } },
        },
      },
    },
    origen: S,
  };
})();
