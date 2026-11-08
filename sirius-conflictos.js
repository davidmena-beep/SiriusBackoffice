// SIRIUS · Motor del centro de conflictos de configuración (etapa 10n-conflictos · DEC-124).
// Calcula en vivo los 9 tipos de SIRIUS_CONFLICTOS.tipos desde la configuración (SIRIUS_NOTIFICACIONES, SIRIUS_CAMPOS,
// SIRIUS_FLUJO y los casos que entrega el Back-office) y suma la semilla. sync() aplica los efectos: plantilla «Inactiva por
// conflicto» (p.conflicto) y regla «Pausada por conflicto» solo en los canales afectados (r.pausa); al resolverse, el objeto
// vuelve solo a su estado anterior y queda en el Historial. Nunca borra ni edita la configuración.
(function () {
  var Z = {};
  var CH = [['correo', 'Correo'], ['whatsapp', 'WhatsApp'], ['sms', 'SMS'], ['app', 'En SIRIUS']];
  Z.K = function () { return window.SIRIUS_CONFLICTOS || null; };
  Z.N = function () { return window.SIRIUS_NOTIFICACIONES || null; };
  Z.ctx = { casos: function () { return []; }, filtros: function () { return []; }, ahora: function () { var E = window.SIRIUS_EJEMPLO, d = E && E.ahora ? E.ahora() : new Date(); var p = function (n) { return String(n).padStart(2, '0'); }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes()); }, rolDe: function () { return 'Administrador'; }, disparosHoy: function () { return []; } };
  Z.canalNombre = function (c) { for (var i = 0; i < CH.length; i++) if (CH[i][0] === c) return CH[i][1]; return c; };
  Z.listaY = function (a) { a = a.slice(); if (a.length <= 1) return a.join(''); var u = a.pop(); return a.join(', ') + ' y ' + u; };
  Z.canalesTxt = function (cs) { return Z.listaY(cs.map(Z.canalNombre)); };
  function textosCanal(p, c) { var v = p[c], out = []; if (!v) return out;
    if (c === 'correo') { out.push(v.asunto || ''); (v.bloques || []).forEach(function (b) { ['contenido', 'texto', 'alt', 'titulo', 'vacio'].forEach(function (k) { if (b[k]) out.push(String(b[k])); }); (b.celdas || []).forEach(function (r) { r.forEach(function (x) { if (x) out.push(String(x)); }); }); }); }
    else if (c === 'whatsapp') { out.push(v.cuerpo || ''); (v.botones || []).forEach(function (b) { out.push(b.texto || ''); }); }
    else out.push(v.texto || ''); return out; }
  Z.varsCanal = function (p, c) { var N = Z.N(), s = {}; textosCanal(p, c).forEach(function (t) { N.variablesEn(t).forEach(function (v) { s[v] = 1; }); }); return Object.keys(s); };
  function estadoVar(v) { var SV = window.SiriusVariables; return SV ? SV.estado(v) : 'ok'; }
  function tipo(id) { var K = Z.K(); return K ? K.tipo(id) : null; }
  // Reglas activas que usan la plantilla en alguno de esos canales: [{ id, canales }]
  function reglasAfectadas(pid, canales) { var N = Z.N(); return N.reglas.filter(function (r) { return r.estado === 'Activa' && r.plantilla === pid; }).map(function (r) { return { id: r.id, canales: r.canales.filter(function (c) { return canales.indexOf(c) >= 0; }) }; }).filter(function (x) { return x.canales.length; }); }
  function afectaPlantilla(p, ra) { return 'Inactiva «' + p.nombre + '»' + (ra.length ? ' y pausa ' + Z.listaY(ra.map(function (x) { return x.id + ' (' + Z.canalesTxt(x.canales) + ')'; })) : '; ninguna regla activa la usa en esos canales'); }
  // ---------- Detección (pura: no cambia nada) ----------
  Z.calcula = function () {
    var K = Z.K(), N = Z.N(), C = window.SIRIUS_CAMPOS, F = window.SIRIUS_FLUJO, out = []; if (!K || !N) return out;
    var add = function (o) { var t = tipo(o.tipo) || {}; out.push(Object.assign({ key: o.tipo + ':' + o.objeto, nombre: t.nombre || o.tipo, modulo: t.modulo || 'Notificaciones', severidad: o.severidad || t.severidad, canales: [], reglas: [] }, o)); };
    N.plantillas.forEach(function (p) { if (p.estado !== 'Activa') return;
      var off = {}, none = {}, cOff = [], cNone = [];
      CH.forEach(function (ch) { var c = ch[0]; if (!p[c]) return; Z.varsCanal(p, c).forEach(function (v) { var e = estadoVar(v); if (e === 'off') { off[v] = 1; if (cOff.indexOf(c) < 0) cOff.push(c); } if (e === 'none' && v.indexOf('campo.') === 0) { none[v] = 1; if (cNone.indexOf(c) < 0) cNone.push(c); } }); });
      var vo = Object.keys(off), vn = Object.keys(none);
      if (vo.length) { var ra = reglasAfectadas(p.id, cOff); add({ tipo: 'var_no_disponible', objeto: p.id, objTipo: 'plantilla', objNombre: p.nombre, canales: cOff, reglas: ra, vars: vo, detalle: Z.listaY(vo.map(function (v) { return '{{' + v + '}}'; })) + (vo.length === 1 ? ' no está disponible' : ' no están disponibles') + ' y se usa en ' + Z.canalesTxt(cOff) + '.', afecta: afectaPlantilla(p, ra) }); }
      if (vn.length) { var rn = reglasAfectadas(p.id, cNone); add({ tipo: 'var_inexistente', objeto: p.id, objTipo: 'plantilla', objNombre: p.nombre, canales: cNone, reglas: rn, vars: vn, detalle: Z.listaY(vn.map(function (v) { return '{{' + v + '}}'; })) + ' es de un campo personalizado inactivo o eliminado (en ' + Z.canalesTxt(cNone) + ').', afecta: afectaPlantilla(p, rn) }); }
      if (p.whatsapp && p.whatsapp.estadoMeta === 'Rechazada' && !p.whatsapp.aprobada) { var rw = reglasAfectadas(p.id, ['whatsapp']); add({ tipo: 'whatsapp_rechazada', objeto: p.id, objTipo: 'plantilla', objNombre: p.nombre, canales: ['whatsapp'], reglas: rw, detalle: 'Meta rechazó «' + p.whatsapp.nombreMeta + '» y no hay una versión aprobada anterior.', afecta: 'WhatsApp se omite' + (rw.length ? ' en ' + Z.listaY(rw.map(function (x) { return x.id; })) + '; las reglas usan su siguiente canal' : '') }); }
    });
    // Semilla (respuestas externas que el prototipo no calcula)
    (K.semilla || []).forEach(function (s) { if (out.some(function (o) { return o.key === s.tipo + ':' + s.objeto; })) return; var p = N.plantilla(s.objeto); if (!p || !p.whatsapp) return; if (p.whatsapp.reenviada && p.whatsapp.reenviada > s.desde) return;
      var sev = /advertencia/i.test(s.nota || '') ? 'advertencia' : (tipo(s.tipo) || {}).severidad, rw = reglasAfectadas(p.id, ['whatsapp']);
      add({ tipo: s.tipo, objeto: s.objeto, objTipo: 'plantilla', objNombre: p.nombre, severidad: sev, canales: ['whatsapp'], reglas: sev === 'bloqueante' ? rw : [], detalle: s.detalle, nota: s.nota, desde: s.desde, semilla: true, afecta: sev === 'bloqueante' ? 'WhatsApp se omite en ' + Z.listaY(rw.map(function (x) { return x.id; })) : 'Se sigue enviando la versión aprobada anterior; conviene corregir y reenviar a revisión.' }); });
    // Reglas
    N.reglas.forEach(function (r) { if (r.estado !== 'Activa') return; var p = N.plantilla(r.plantilla);
      var miss = r.canales.filter(function (c) { return !p || p.estado !== 'Activa' || !p[c]; });
      if (miss.length) add({ tipo: 'regla_sin_plantilla', objeto: r.id, objTipo: 'regla', objNombre: r.id + ' · ' + r.nombre, canales: miss, reglas: [{ id: r.id, canales: miss }], plantilla: r.plantilla, detalle: !p ? 'La plantilla «' + r.plantilla + '» no existe.' : p.estado !== 'Activa' ? 'Usa «' + p.nombre + '», que está ' + p.estado + '.' : '«' + p.nombre + '» no tiene variante de ' + Z.canalesTxt(miss) + '.', afecta: 'Pausa ' + r.id + ' en ' + Z.canalesTxt(miss) + (miss.length < r.canales.length ? '; los demás canales siguen' : '') });
      if (r.a.indexOf('Asegurado o contacto') >= 0 && r.canales.indexOf('correo') < 0) add({ tipo: 'sin_consentimiento', objeto: r.id, objTipo: 'regla', objNombre: r.id + ' · ' + r.nombre, detalle: r.id + ' avisa a «Asegurado o contacto» solo por ' + Z.canalesTxt(r.canales) + '.', afecta: 'Los clientes sin consentimiento para ' + Z.canalesTxt(r.canales) + ' no reciben el aviso.' });
    });
    // Cuentas de Gmail
    var casos = Z.ctx.casos() || [], activos = casos.filter(function (c) { return c.activo; });
    (((window.SIRIUS_USUARIOS || {}).usuarios || []).filter(function (x) { return x.tipo === 'Interno' && x.estado === 'Activo'; }).map(function (x) { return { usuario: x.nombre, gmail: x.gmail, nota: x.nota }; })).forEach(function (u) { var n = activos.filter(function (c) { return c.responsable === u.usuario; }).length;
      if (u.gmail === 'Permiso vencido' || (u.gmail === 'Sin conectar' && n > 0)) add({ tipo: 'gmail_vencido', objeto: 'usuario:' + u.usuario, objTipo: 'usuario', objNombre: u.usuario, usuario: u.usuario, detalle: u.usuario + ': Gmail «' + u.gmail + '»' + (u.nota ? ' (' + u.nota + ')' : '') + (n ? '; tiene ' + n + (n === 1 ? ' caso activo' : ' casos activos') + ' a su cargo.' : '.'), afecta: 'Sus correos salen de ' + N.remitente.institucional + '.' }); });
    // Filtros de la Bandeja con campos inactivos
    (Z.ctx.filtros() || []).forEach(function (cl) { var c = C && C.campo(cl); if (c && c.estado !== 'Activo') add({ tipo: 'filtro_campo_inactivo', objeto: 'filtro:' + cl, objTipo: 'filtro', objNombre: 'Filtro de la Bandeja · ' + c.etiqueta, detalle: 'El filtro de la Bandeja usa «' + c.etiqueta + '», que está inactivo.', afecta: 'El filtro ignora ese campo.' }); });
    // Valores fuera de catálogo
    activos.forEach(function (c) { if (c.revisar) add({ tipo: 'catalogo_valor', objeto: 'caso:' + c.id, objTipo: 'caso', objNombre: 'Caso ' + c.id, caso: c.id, detalle: c.revisar, afecta: 'El informe precarga «Por confirmar».' }); });
    // Etapa 16f-1 · borradores de flujo con errores de validación (se abren al validar el borrador en el editor; impiden publicar).
    var FMx = window.SiriusFlujoMotor; if (FMx && FMx.conflictos) FMx.conflictos().forEach(function (x) { add({ tipo: 'flujo_invalido', objeto: x.flujo + '-v' + x.version, objTipo: 'flujo', objNombre: 'Flujo ' + x.flujo + ' · borrador v' + x.version, flujo: x.flujo, detalle: x.nombre + ': ' + x.errores.map(function (e) { return e.txt; }).join(' '), afecta: 'No se puede publicar; la versión vigente sigue rigiendo los casos.' }); });
    // Sucursales sin coordinador
    var cps = (F && F.coordinadorPorSucursal) || {}, sucs = {}; activos.forEach(function (c) { if (c.sucursal) sucs[c.sucursal] = (sucs[c.sucursal] || 0) + 1; });
    Object.keys(sucs).forEach(function (s) { if (!cps[s] && !cps['*']) add({ tipo: 'sla_sin_responsable', objeto: 'sucursal:' + s, objTipo: 'sucursal', objNombre: 'Sucursal ' + s, detalle: s + ' tiene ' + sucs[s] + ' casos activos y ningún coordinador asignado.', afecta: 'Sus casos muestran «Por asignar».' }); });
    return out;
  };
  // ---------- Registro, efectos, Historial, Bitácora y campana ----------
  function reg() { var K = Z.K(); return K.registro || (K.registro = []); }
  Z.registro = function () { return reg(); };
  Z.abiertos = function () { return reg().filter(function (e) { return e.estado === 'Abierto'; }); };
  // Campana: avisos persistentes de la sesión (el Back-office los mezcla con sus notificaciones).
  Z.campana = []; var oyentes = [];
  Z.on = function (fn) { oyentes.push(fn); return function () { oyentes = oyentes.filter(function (x) { return x !== fn; }); }; };
  function avisar() { oyentes.slice().forEach(function (f) { try { f(); } catch (e) {} }); }
  function texto(plant, e) { var K = Z.K(); return plant.replace('{objeto}', e.objNombre).replace('{tipo}', e.nombre); }
  function campana(e, modo) { var K = Z.K(), t = (K.campana || {}).texto || {}, ts = Z.ctx.ahora();
    Z.campana.unshift({ id: 'cf-' + e.id + '-' + modo, aud: (K.campana || {}).a || 'Administrador', kind: modo === 'abre' ? 'conflicto' : 'conflictoOk', modo: modo, text: modo === 'abre' ? texto(t.abre || 'Conflicto: {objeto} · {tipo}', e) : texto(t.resuelve || 'Se resolvió el conflicto de {objeto}', e), confId: e.id, ts: ts, read: false });
    var T = tipo(e.tipo); if (T && T.destinatarioExtra && e.usuario) Z.campana.unshift({ id: 'cf-' + e.id + '-' + modo + '-u', aud: Z.ctx.rolDe(e.usuario), user: e.usuario, kind: modo === 'abre' ? 'conflicto' : 'conflictoOk', modo: modo, text: modo === 'abre' ? 'Tu conexión de Gmail necesita atención: vuelve a entrar con Google para que tus correos salgan de tu cuenta.' : 'Tu conexión de Gmail volvió a estar activa.', confId: e.id, ts: ts, read: false }); }
  Z.sync = function (origen) { var K = Z.K(), N = Z.N(); if (!K || !N) return; origen = origen || {}; var ahora = Z.ctx.ahora(), R = reg(), cur = Z.calcula(), keys = {}, H = N.historial || (N.historial = []);
    cur.forEach(function (c) { keys[c.key] = c;
      var e = R.find(function (x) { return x.key === c.key && (x.estado === 'Abierto' || x.estado === 'Descartado'); });
      if (e) { ['detalle', 'afecta', 'canales', 'reglas', 'vars', 'objNombre', 'severidad'].forEach(function (k) { e[k] = c[k]; }); return; }
      e = Object.assign({}, c, { id: 'CF-' + String(R.length + 1).padStart(3, '0'), estado: 'Abierto', abierto: { fecha: c.semilla && c.desde ? c.desde : ahora, que: c.semilla ? 'Respuesta de Meta' : (origen.que || 'Revisión de la configuración'), quien: c.semilla ? 'Meta (WhatsApp)' : (origen.quien || 'Sistema') } });
      R.push(e); campana(e, 'abre'); });
    R.forEach(function (e) { if (e.estado === 'Abierto' && !keys[e.key]) { e.estado = 'Resuelto'; e.resuelto = { fecha: ahora, que: origen.que || 'Revisión de la configuración', quien: origen.quien || 'Sistema' }; campana(e, 'resuelve'); } });
    // Efectos de los bloqueantes abiertos
    var pc = {}, rp = {}; Z.abiertos().filter(function (e) { return e.severidad === 'bloqueante'; }).forEach(function (e) {
      if (e.objTipo === 'plantilla') { var x = pc[e.objeto] || (pc[e.objeto] = { estado: N.estadosConflicto.plantilla, canales: [], ids: [], motivo: [] }); e.canales.forEach(function (c) { if (x.canales.indexOf(c) < 0) x.canales.push(c); }); x.ids.push(e.id); x.motivo.push(e.nombre + ': ' + e.detalle); }
      (e.reglas || []).forEach(function (r) { var y = rp[r.id] || (rp[r.id] = { estado: N.estadosConflicto.regla, canales: [], ids: [], motivo: [] }); r.canales.forEach(function (c) { if (y.canales.indexOf(c) < 0) y.canales.push(c); }); y.ids.push(e.id); y.motivo.push(e.nombre); }); });
    var quien = 'Sistema', mot = origen.que || 'Revisión de la configuración';
    N.plantillas.forEach(function (p) { var nx = pc[p.id] || null, was = !!p.conflicto;
      if (nx && !was) H.unshift({ fecha: ahora, por: quien, plantilla: p.id, accion: 'Inactiva por conflicto (' + nx.motivo.join('; ') + ')', motivo: mot });
      if (!nx && was) H.unshift({ fecha: ahora, por: quien, plantilla: p.id, accion: 'Reactivada al resolverse el conflicto; vuelve a «' + p.estado + '»', motivo: mot });
      if (nx) p.conflicto = nx; else delete p.conflicto; });
    N.reglas.forEach(function (r) { var nx = rp[r.id] || null, was = !!r.pausa;
      if (nx && (!was || r.pausa.canales.join() !== nx.canales.join())) { H.unshift({ fecha: ahora, por: quien, regla: r.id, accion: 'Pausada por conflicto en ' + Z.canalesTxt(nx.canales) + (nx.canales.length < r.canales.length ? '; ' + Z.canalesTxt(r.canales.filter(function (c) { return nx.canales.indexOf(c) < 0; })) + ' sigue' : ''), motivo: mot });
        // Envíos de hoy que ya no salen por el conflicto
        (Z.ctx.disparosHoy(r) || []).forEach(function (d) { nx.canales.forEach(function (c) { if (!N.bitacora.some(function (b) { return b.regla === r.id && b.caso === d.caso && b.canal === c && b.estado === 'Omitido' && b.conflicto; })) N.bitacora.unshift({ fecha: ahora, regla: r.id, caso: d.caso, canal: c, a: d.a || '—', remitente: '—', estado: 'Omitido', motivo: 'Plantilla inactiva por conflicto', conflicto: nx.ids[0] }); }); }); }
      if (!nx && was) H.unshift({ fecha: ahora, por: quien, regla: r.id, accion: 'Reactivada al resolverse el conflicto; vuelve a enviar por ' + Z.canalesTxt(r.canales), motivo: mot });
      if (nx) r.pausa = nx; else delete r.pausa; });
    avisar(); };
  // Impacto previo: aplica el cambio, calcula, lo revierte y describe lo que pasaría.
  Z.anticipa = function (aplicar, revertir) { var antes = {}; Z.calcula().forEach(function (c) { antes[c.key] = c; }); var desp; try { aplicar(); desp = Z.calcula(); } finally { revertir(); }
    var dk = {}; desp.forEach(function (c) { dk[c.key] = c; });
    var nuevos = desp.filter(function (c) { return !antes[c.key]; }), idos = Object.keys(antes).filter(function (k) { return !dk[k]; }).map(function (k) { return antes[k]; });
    var nb = nuevos.filter(function (c) { return c.severidad === 'bloqueante'; }), na = nuevos.filter(function (c) { return c.severidad !== 'bloqueante'; });
    var pl = {}, rg = {}; nb.forEach(function (c) { if (c.objTipo === 'plantilla') pl[c.objNombre] = 1; (c.reglas || []).forEach(function (r) { rg[r.id] = 1; }); });
    var lineas = [], pls = Object.keys(pl), rgs = Object.keys(rg).sort();
    if (pls.length || rgs.length) lineas.push('Esto ' + (pls.length ? 'inactivará ' + pls.length + (pls.length === 1 ? ' plantilla' : ' plantillas') + ' (' + Z.listaY(pls) + ')' : '') + (pls.length && rgs.length ? ' y ' : '') + (rgs.length ? 'pausará ' + Z.listaY(rgs) : '') + '.');
    nb.forEach(function (c) { lineas.push('Conflicto bloqueante · ' + c.nombre + ': ' + c.detalle + ' ' + c.afecta + '.'); });
    na.forEach(function (c) { lineas.push('Advertencia nueva · ' + c.nombre + ': ' + c.detalle); });
    var ib = idos.filter(function (c) { return c.severidad === 'bloqueante'; }); if (idos.length) lineas.push('Esto resolverá ' + idos.length + (idos.length === 1 ? ' conflicto' : ' conflictos') + (ib.length ? ' y reactivará ' + Z.listaY(ib.map(function (c) { return c.objNombre; }).concat([].concat.apply([], ib.map(function (c) { return (c.reglas || []).map(function (r) { return r.id; }); })))) : '') + '.');
    return { nuevos: nuevos, resueltos: idos, bloqueantes: nb, lineas: lineas, hay: lineas.length > 0 }; };
  Z.descartar = function (id, motivo, quien) { var e = reg().find(function (x) { return x.id === id; }); if (!e || e.severidad === 'bloqueante') return false; e.estado = 'Descartado'; e.descartado = { fecha: Z.ctx.ahora(), quien: quien || 'Administrador', motivo: motivo }; avisar(); return true; };
  // Acciones sugeridas (enlaces directos) por tipo; go = destino que interpreta el Back-office.
  Z.acciones = function (e) { var ed = { k: 'editor', id: e.objeto }, rg = { k: 'regla', id: e.objeto };
    var M = { var_no_disponible: [['Reactivar la variable', { k: 'var', clave: (e.vars || [])[0] }], ['Editar la plantilla y reemplazar la variable', ed]],
      var_inexistente: [['Reactivar el campo personalizado', { child: 'campos' }], ['Editar la plantilla', ed]],
      regla_sin_plantilla: [['Editar la plantilla', { k: 'editor', id: e.plantilla }], ['Cambiar la plantilla de la regla', rg], ['Quitar el canal de la regla', rg]],
      whatsapp_rechazada: [['Editar la variante de WhatsApp y reenviar a revisión', { k: 'editor', id: e.objeto, canal: 'whatsapp' }]],
      gmail_vencido: [['Reenviar la invitación para conectar Gmail', { act: 'invitar', usuario: e.usuario }]],
      sin_consentimiento: [['Agregar Correo a la regla', rg]],
      filtro_campo_inactivo: [['Reactivar el campo', { child: 'campos' }], ['Editar el filtro', { bandeja: true }]],
      catalogo_valor: [['Agregar al catálogo', { child: 'catalogos' }], ['Abrir el caso', { caso: e.caso }]],
      sla_sin_responsable: [['Asignar coordinador', { child: 'flujo' }]],
      flujo_invalido: [['Abrir el borrador del flujo', { flujo: e.flujo }]] };
    return (M[e.tipo] || []).map(function (a) { return { label: a[0], go: a[1] }; }); };
  Z.destinoObjeto = function (e) { return e.objTipo === 'plantilla' ? { k: 'editor', id: e.objeto, canal: e.tipo === 'whatsapp_rechazada' ? 'whatsapp' : '' } : e.objTipo === 'regla' ? { k: 'regla', id: e.objeto } : e.objTipo === 'usuario' ? { k: 'cuentas' } : e.objTipo === 'caso' ? { caso: e.caso } : e.objTipo === 'filtro' ? { bandeja: true } : e.objTipo === 'flujo' ? { flujo: e.flujo } : { child: 'flujo' }; };
  Z.dePlantilla = function (id) { return Z.abiertos().filter(function (e) { return e.objTipo === 'plantilla' && e.objeto === id; }); };
  window.SiriusConflictos = Z;
})();
