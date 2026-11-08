// SIRIUS · Diccionario de variables de notificación (etapa 10n-variables · DEC-123).
// Lee SIRIUS_NOTIFICACIONES.diccionario y agrega solos los campos personalizados activos de SIRIUS_CAMPOS como
// {{campo.<clave>}} (grupo «Campos personalizados», disponibles si su «ver» es «Todos los roles»). La disponibilidad
// cambia solo en la sesión. Lo usan Notificaciones (pestaña Variables) y EditorPlantilla (insertar, validar y LOPDP).
(function () {
  var V = {};
  V.N = function () { return window.SIRIUS_NOTIFICACIONES || null; };
  V.C = function () { return window.SIRIUS_CAMPOS || null; };
  V.CLASES = ['General', 'Dato personal', 'Dato sensible'];
  V.TONO = { 'General': 'neutral', 'Dato personal': 'warning', 'Dato sensible': 'danger' };
  V.GRUPO_CAMPOS = 'Campos personalizados';
  // Destinatarios externos a la compañía; «Asegurado o contacto» es el titular de sus propios datos.
  V.EXTERNOS = ['Asegurado o contacto', 'Bróker (APS)', 'Correo fijo'];
  function camposDisp() { var N = V.N(); return N._dispCampos || (N._dispCampos = {}); }
  // Lista completa: sistema (58) + campos personalizados activos.
  V.lista = function () {
    var N = V.N(), C = V.C(); if (!N) return [];
    var sys = (N.diccionario || []).map(function (v) { return Object.assign({ campo: false }, v); });
    var cd = camposDisp(), cps = C ? C.campos.filter(function (c) { return c.estado === 'Activo'; }).sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); }).map(function (c) {
      var base = c.ver === 'Todos los roles';
      return { grupo: V.GRUPO_CAMPOS, clave: 'campo.' + c.clave, etiqueta: c.etiqueta, origen: 'Campo personalizado', clasificacion: 'General', disponible: cd[c.clave] != null ? cd[c.clave] : base, ejemplo: '', campo: true, ver: Array.isArray(c.ver) ? c.ver.join(', ') : c.ver };
    }) : [];
    return sys.concat(cps);
  };
  V.grupos = function () { var g = []; V.lista().forEach(function (v) { if (g.indexOf(v.grupo) < 0) g.push(v.grupo); }); return g; };
  V.info = function (clave) { var L = V.lista(); for (var i = 0; i < L.length; i++) if (L[i].clave === clave) return L[i]; return null; };
  // 'ok' (disponible) · 'off' (existe pero no está disponible) · 'none' (no existe). {{mensaje}} es interna de «Aviso interno».
  V.estado = function (clave) { if (clave === 'mensaje') return 'ok'; var x = V.info(clave); return !x ? 'none' : x.disponible ? 'ok' : 'off'; };
  V.motivo = function (clave) { var e = V.estado(clave); return e === 'none' ? 'No existe' : e === 'off' ? 'No está disponible: actívala en Variables' : ''; };
  V.recalcular = function () { var N = V.N(); var g = []; N.diccionario.forEach(function (v) { if (g.indexOf(v.grupo) < 0) g.push(v.grupo); });
    N.variables = g.map(function (x) { return { grupo: x, items: N.diccionario.filter(function (v) { return v.grupo === x && v.disponible; }).map(function (v) { return v.clave; }) }; }).filter(function (x) { return x.items.length; }); };
  // Texto de un campo personalizado en una notificación: dinero con el formato de la compañía; sí/no como Sí/No.
  V.textoCampo = function (clave, y) { var Cp = window.SIRIUS_CAMPOS, f = Cp && Cp.campos ? Cp.campos.find(function (c) { return c.clave === clave; }) : null; if (y == null || y === '') return ''; if (typeof y === 'boolean') return y ? 'Sí' : 'No'; if (f && f.tipo === 'moneda' && window.SIRIUS_COMPANIA && isFinite(Number(y))) return window.SIRIUS_COMPANIA.formatoMonto(Number(y)); return String(y); };
  V.setDisponible = function (clave, on) { var N = V.N(); if (clave.indexOf('campo.') === 0) camposDisp()[clave.slice(6)] = !!on; else { var v = N.variable(clave); if (v) v.disponible = !!on; } V.recalcular(); };
  // Todos los textos de una plantilla (asunto, bloques, celdas, botones y variantes).
  V.textos = function (p) { var out = [];
    if (p.correo) { out.push(p.correo.asunto || ''); (p.correo.bloques || []).forEach(function (b) { ['contenido', 'texto', 'alt', 'titulo', 'vacio'].forEach(function (k) { if (b[k]) out.push(String(b[k])); }); (b.celdas || []).forEach(function (r) { r.forEach(function (x) { if (x) out.push(String(x)); }); }); }); }
    if (p.whatsapp) { out.push(p.whatsapp.cuerpo || ''); (p.whatsapp.botones || []).forEach(function (b) { out.push(b.texto || ''); }); }
    if (p.sms) out.push(p.sms.texto || ''); if (p.app) out.push(p.app.texto || ''); return out; };
  V.usadas = function (p) { var N = V.N(), s = {}; V.textos(p).forEach(function (t) { N.variablesEn(t).forEach(function (v) { s[v] = 1; }); }); return Object.keys(s); };
  V.usos = function (clave) { var N = V.N(); return N.plantillas.filter(function (p) { return V.usadas(p).indexOf(clave) >= 0; }); };
  V.reglasDe = function (ids) { var N = V.N(); return N.reglas.filter(function (r) { return ids.indexOf(r.plantilla) >= 0; }); };
  // Titular del dato personal (para saber si un destinatario externo es otra persona).
  V.titular = function (clave) { var x = V.info(clave); if (!x) return ''; if (clave === 'visita.inspectorCelular') return 'Inspector de la visita'; if (x.grupo === 'Bróker') return 'Bróker (APS)'; if (['Asegurado', 'Contacto', 'Riesgo', 'Visita', V.GRUPO_CAMPOS].indexOf(x.grupo) >= 0) return 'Asegurado o contacto'; return ''; };
  V.soloInternos = function (reglas) { return reglas.length > 0 && reglas.every(function (r) { return r.a.every(function (a) { return V.EXTERNOS.indexOf(a) < 0; }); }); };
  // Avisos LOPDP de una variable para las reglas dadas: personal → externos distintos del titular; sensible → cualquier externo.
  V.lopdp = function (clave, reglas) { var x = V.info(clave); if (!x || x.clasificacion === 'General') return null; var tit = V.titular(clave), ext = {};
    reglas.forEach(function (r) { r.a.forEach(function (a) { if (V.EXTERNOS.indexOf(a) >= 0 && (x.clasificacion === 'Dato sensible' || a !== tit)) (ext[a] = ext[a] || []).push(r.id); }); });
    var ks = Object.keys(ext); if (!ks.length) return null; return { clave: clave, etiqueta: x.etiqueta, clasificacion: x.clasificacion, a: ks.map(function (k) { return k + ' (' + ext[k].join(', ') + ')'; }) }; };
  window.SiriusVariables = V;
})();
