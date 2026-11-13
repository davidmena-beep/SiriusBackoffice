// SIRIUS · Completado del informe por responsable (v1.0 · provisional · etapa P-6e-2 · 18/10/2026)
// Decisión DEC-207: quién completa el informe cuando no hay inspector en sitio (autoinspección y, después, otras modalidades).
//   · Presencial no cambia: completa quien inspeccionó (DEC-180, DEC-198).
//   · Interno (por defecto): el calificador (Ejecutivo de inspecciones o Administrador) completa y califica en un solo paso; sin honorario.
//   · Agencia: su Control de calidad completa con «Ya los vi» (DEC-198); el caso pasa a «Pendiente calificación»; honorario «Completado de informe» con la tarifa de esa agencia.
//   · Inspector independiente: completa él; pasa a «Pendiente calificación»; honorario «Completado de informe» con su tarifa.
// Aquí viven: las reglas iniciales (orden, criterios y destino), el destino por defecto, los textos de la pantalla y la conexión simulada de las escenas
// autorecibida, autointerno, autotercero y reasignar. La versión publicada con motivo sale de Administración › Flujo › «Completado del informe» y se
// entrega a la base como SIRIUS_COMPLETADO = { version, reglas, porDefecto }. Las tarifas «Completado de informe» viven en SIRIUS_HONORARIOS
// (cambios.completado de cada tarifario de agencia o de inspector independiente) y se publican en SIRIUS_HONORARIOS.completadoInforme.
// Con la conexión, cada informe trae responsable = { tipo: 'interno'|'agencia'|'independiente', agencia, usuario, regla, asignadoEn }.
window.SIRIUS_COMPLETADO = {
  version: 1, vigencia: 'Provisional',
  // Criterios en blanco (null) = cualquiera. sumaMax: la regla aplica si la suma asegurada es igual o menor (null = sin tope).
  reglas: [
    { ramo: null, modalidad: 'Autoinspección', sucursal: 'Guayaquil', sumaMax: null, destino: 'independiente', agencia: null, inspector: 'Luis Andrade', plazoHoras: 24 },
    { ramo: null, modalidad: 'Autoinspección', sucursal: 'Cuenca', sumaMax: 60000, destino: 'agencia', agencia: 'eurosurvey', inspector: null, plazoHoras: 24 },
  ],
  porDefecto: { destino: 'interno', plazoHoras: 24 },
  // ---------- Textos y catálogos de la pantalla ----------
  destinos: [
    { id: 'interno', nombre: 'Interno', desc: 'Lo completa y califica el equipo de Ejecutivos de inspecciones en un solo paso. Sin honorario.' },
    { id: 'agencia', nombre: 'Agencia', desc: 'Lo completa el Control de calidad de la agencia (con «Ya los vi») y pasa a «Pendiente calificación». Se paga la tarifa «Completado de informe» de esa agencia.' },
    { id: 'independiente', nombre: 'Inspector independiente', desc: 'Lo completa el inspector y pasa a «Pendiente calificación». Se paga su tarifa «Completado de informe».' },
  ],
  // Modalidades sin inspector en sitio a las que se aplican las reglas (otras se agregan aquí cuando existan).
  modalidades: ['Autoinspección'],
  intro: 'Define quién completa el informe cuando no hay inspector en sitio. Las reglas se revisan de arriba abajo y gana la primera que coincide; la última es el destino por defecto. Presencial no cambia: completa quien inspeccionó.',
  probador: { ramo: 'Vehículos', modalidad: 'Autoinspección', sucursal: 'Guayaquil', suma: 18500 },
  horasNota: 'El plazo corre en horas hábiles desde que el cliente envía la autoinspección.',
  motivoEjemplo: 'Ej. Las autoinspecciones de Guayaquil las completa un independiente para bajar la carga interna',
  // ---------- Conexión simulada de las escenas (el caso 30010 de autoinspección) ----------
  // Escena → [momento del caso, responsable, usuario]. Se arma como lo entrega la conexión: casos (estado y subestado de la base), eventos, evidencias
  // (con tipoArchivo y canal «Autoinspección») e informes con responsable. Momentos: enlace · curso · recibida · completado · calificado.
  cxEscenas: { autorecibida: ['recibida', 'interno', 'ejecutivo'], autointerno: ['recibida', 'interno', 'ejecutivo'], autotercero: ['recibida', 'agencia', 'cc'], reasignar: ['recibida', 'interno', 'coordinador'] },
  cxSim: function (momento, quien, rol) {
    momento = momento || 'recibida'; quien = quien || 'interno'; rol = rol || 'ejecutivo';
    var enc = function (s) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(s); };
    var foto = function (t, c1, c2) { return enc('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="158" text-anchor="middle" font-family="Arial" font-size="22" fill="#fff">' + t + '</text></svg>'); };
    var doc = function (t) { return enc('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F4F6FA"/><rect x="60" y="24" width="280" height="252" rx="6" fill="#fff" stroke="#B8C2D4"/><rect x="84" y="52" width="150" height="10" fill="#9AA8C0"/><rect x="84" y="78" width="232" height="6" fill="#D4DBE8"/><rect x="84" y="94" width="232" height="6" fill="#D4DBE8"/><rect x="84" y="110" width="190" height="6" fill="#D4DBE8"/><text x="200" y="230" text-anchor="middle" font-family="Arial" font-size="18" fill="#52617D">' + t + '</text></svg>'); };
    var hora = function (m) { return '16/10/26 · 17:' + (m < 10 ? '0' + m : m); };
    var ev = function (id, paso, t, c1, c2, m, extra) { return Object.assign({ id: id, paso: paso, url: foto(t, c1, c2), hora: hora(m), canal: 'Autoinspección', tipoArchivo: 'foto', validacion: { vertical: true, encuadre: true, luz: true, nitidez: true, reflejo: true }, gps: [-0.1807, -78.4678], precision: 12, dispositivo: 'Celular del cliente · navegador' }, extra || {}); };
    var todas = [
      ev('au-01', 'exteriores_frontal', 'Frontal', '#3E6FA8', '#1E3A5F', 10), ev('au-02', 'exteriores_posterior', 'Posterior', '#4A7FB8', '#25476F', 12), ev('au-03', 'exteriores_lateral_izquierdo', 'Lateral izquierdo', '#5B8EC4', '#2B5280', 14),
      ev('au-04', 'exteriores_lateral_derecho', 'Lateral derecho', '#3E6FA8', '#1E3A5F', 16), ev('au-05', 'interiores_kilometraje', 'Kilometraje', '#6A7F96', '#34465C', 20, { lecturas: { km: { valor: '8420', conf: 0.93 } } }),
      Object.assign(ev('au-06', 'documentos_matricula_frontal', 'Matrícula', '#fff', '#fff', 24), { url: doc('Matrícula'), tipoArchivo: 'documento' }),
      Object.assign(ev('au-07', 'documentos_cedula_frontal', 'Cédula', '#fff', '#fff', 26), { url: doc('Cédula del titular'), tipoArchivo: 'documento' }),
      { id: 'au-08', tipo: 'video', tipoArchivo: 'video', paso: 'video_360', url: '', hora: hora(34), canal: 'Autoinspección', grados: 352, umbral: 300, duracion: 41, tamano: 18400000, dispositivo: 'Celular del cliente · navegador', gps: [-0.1807, -78.4678], precision: 12, validacion: {} },
    ];
    var recibida = { recibida: 1, completado: 1, calificado: 1 }[momento] === 1;
    var evidencias = momento === 'enlace' ? [] : momento === 'curso' ? todas.slice(0, 3) : todas;
    var resp = quien === 'agencia' ? { tipo: 'agencia', agencia: 'Eurosurvey S.A.', usuario: 'Patricia Andrade', regla: 'Regla 2 · Autoinspección en Cuenca hasta USD 60.000', asignadoEn: '2026-10-16T17:46' }
      : quien === 'independiente' ? { tipo: 'independiente', agencia: '', usuario: 'Luis Andrade', regla: 'Regla 1 · Autoinspección en Guayaquil', asignadoEn: '2026-10-16T17:46' }
      : { tipo: 'interno', agencia: '', usuario: '', regla: 'Por defecto', asignadoEn: '2026-10-16T17:46' };
    var usuario = rol === 'cc' ? { nombre: 'Patricia Andrade', email: 'patricia.andrade@eurosurvey.com.ec', rol: 'Control de calidad (agencia)', roles: ['Control de calidad (agencia)'], tipoInspector: 'Agencia', agencia: 'Eurosurvey S.A.' }
      : rol === 'independiente' ? { nombre: 'Luis Andrade', email: 'luis.andrade@correo.com', rol: 'Inspector', roles: ['Inspector'], tipoInspector: 'Externo', agencia: '' }
      : rol === 'coordinador' ? { nombre: 'Carolina Vega', email: 'carolina.vega@asur.ec', rol: 'Coordinador de inspecciones', roles: ['Coordinador de inspecciones'] }
      : { nombre: 'Daniela Ruiz', email: 'daniela.ruiz@asur.ec', rol: 'Ejecutivo de inspecciones', roles: ['Ejecutivo de inspecciones'] };
    var terminal = momento === 'completado' ? (quien === 'interno' ? 'Inspeccionado' : 'Pendiente calificación') : momento === 'calificado' ? 'Inspeccionado' : '';
    var estado = momento === 'enlace' ? 'Agendada' : momento === 'curso' ? 'En curso' : terminal || 'Informe por completar';
    var sub = momento === 'enlace' ? 'Enlace enviado' : momento === 'curso' ? 'Autoinspección en curso' : momento === 'calificado' ? 'Calificado' : momento === 'completado' ? 'Informe completado' : 'Autoinspección recibida';
    var vis = { estado: momento === 'enlace' ? 'Agendada' : momento === 'curso' ? 'En curso' : 'Terminada', modalidad: 'Autoinspección', agendadoEn: '2026-10-16T09:30', origen: 'Cliente', inspector: '' };
    if (recibida) vis.fin = '2026-10-16T17:42';
    var caso = { id: '30010', orden: 'EMI-2026-118471', origen: 'BPM de Emisión', ramo: 'Vehículos', broker: 'Asesores Andinos', asegurado: 'Gabriela Salazar Ortiz', ident: '1712345678', placa: 'GSB4417', bien: 'Placa GSB4417, 2023', fecha: '2026-10-16', registrado: '2026-10-16T09:20', sucursal: quien === 'agencia' ? 'Cuenca' : quien === 'independiente' ? 'Guayaquil' : 'Quito', backoffice: 'Daniela Ruiz', estado: estado, subestado: sub, responsable: 'Daniela Ruiz', comercial: 'Carolina Vega', flujoVersion: 2, modalidad: 'Autoinspección',
      solicitud: { marca: 'Kia', modelo: 'Sportage', anio: 2023, placa: 'GSB4417' }, campos: { canal_venta: 'Bróker' }, contacto: { nombre: 'Gabriela Salazar', cel: '0991230045' }, dir: 'Av. República del Salvador N34-183, Quito', gps: [-0.1807, -78.4678], visita: vis };
    if (recibida && momento !== 'calificado') caso.vence = '2026-10-19T17:42';
    if (momento === 'calificado') Object.assign(caso, { aseg: 'Asegurable', cobertura: 'Todo riesgo' });
    var resp_txt = resp.tipo === 'agencia' ? 'Control de calidad de Eurosurvey' : resp.tipo === 'independiente' ? 'Luis Andrade (independiente)' : 'Interno · Ejecutivos de inspecciones';
    var hist = [{ hora: '2026-10-16T09:30', accion: 'Enlace de autoinspección enviado', detalle: 'Por WhatsApp al 0991230045', actor: 'Carolina Vega', rol: 'Coordinador de inspecciones' }];
    if (momento !== 'enlace') hist.push({ hora: '2026-10-16T17:05', accion: 'Autoinspección iniciada', detalle: 'El cliente abrió el enlace', actor: 'Gabriela Salazar', rol: 'Cliente' });
    if (recibida) hist.push({ hora: '2026-10-16T17:42', accion: 'Autoinspección enviada', detalle: '8 evidencias: 5 fotos, 2 documentos y 1 video de 360°', actor: 'Gabriela Salazar', rol: 'Cliente' }, { hora: '2026-10-16T17:46', accion: 'Responsable del completado asignado', detalle: resp_txt + ' · ' + resp.regla, actor: 'SIRIUS', rol: 'Sistema' });
    if (terminal) hist.push({ hora: '2026-10-18T19:10', accion: 'Informe completado', detalle: quien === 'interno' ? 'Completado y calificado en un paso · Asegurable · Todo riesgo' : 'Completado con «Ya los vi» · pasa a calificación', actor: quien === 'interno' ? 'Daniela Ruiz' : 'Patricia Andrade', rol: quien === 'interno' ? 'Ejecutivo de inspecciones' : 'Control de calidad (agencia)' });
    var inf = momento === 'enlace' || momento === 'curso' ? [] : [{ riesgo: '30010-V1', plantilla: 'Vehículos livianos · Autoinspección', plantillaClave: 'Vehículos livianos · Autoinspección', plantillaVersion: 1, estado: terminal ? 'Completo' : 'Datos de campo', enviadoEn: '2026-10-16T17:42', enviadoPor: 'Gabriela Salazar', canal: 'Autoinspección', responsable: resp,
      respuestas: { placa: { valor: 'GSB4417', org: 'foto:identificacion_placa_trasera', conf: 0.96 }, anio: { valor: '2023', org: 'solicitud' }, km: { valor: '8420', org: 'foto:interiores_kilometraje', conf: 0.93 }, veh_valor_asegurado_casco: { valor: '21900', org: 'solicitud' }, veh_valor_asegurado_extras: { valor: '0', org: 'solicitud' } } }];
    var cal = momento === 'calificado' || (momento === 'completado' && quien === 'interno') ? [{ riesgo: '30010-V1', nivel: 1, veredicto: 'Asegurable', cobertura: 'Todo riesgo', resultado: 'Aprobado', observacion: 'Completado y calificado en un solo paso.', por: 'Daniela Ruiz', rol: 'Ejecutivo de inspecciones', hora: '2026-10-18T19:10' }] : [];
    return { usuario: usuario, casos: [caso], detalles: {}, eventos: { '30010': hist }, evidencias: { '30010': evidencias }, controles: { '30010': [] }, informes: { '30010': inf }, calificaciones: { '30010': cal } };
  },
};
