// Motor único de calificación de Ramos Generales: lo usan el Simulador de Modelos de calificación y «Probar con un caso» de Garantías y políticas.
window.SIRIUS_MOTOR = {
  fmt(n, dec) { if (n === null || n === undefined || isNaN(n)) return '—'; let s = Number(n).toFixed(dec); if (s.includes('.')) s = s.replace(/\.?0+$/, ''); return s.replace('.', ','); },
  catItem(id) { return ((window.SIRIUS_EJEMPLO || {}).catalogoSeguimientos || []).find(x => x.id === id); },
  // Modelo con el que se califica hoy: la versión vigente publicada (o el modelo tal cual si no tiene publicación).
  vigente(m) { return m && m.publicado && m.estado !== 'Vigente' ? Object.assign({}, m, m.publicado) : m; },
  arr(v) { return Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v]; },
  evalCrit(c, v) { const A = (k) => this.arr(v[k]), one = (k) => { const a = A(k); return a.length ? a[0] : undefined; }, row = (p) => p;
    if (c.admiteNA && c.naCuando) { const mm = c.naCuando.match(/^\s*([a-z0-9_]+)\s*=\s*(.+?)\s*$/i); if (mm && String(one(mm[1])) === mm[2]) return { na: true, valor: mm[1] + ' = ' + mm[2] }; }
    const comb = (vals, txts) => { if (!vals.length) return { raw: 0, valor: 'Sin dato' }; let raw; const how = c.combina || '';
      if (how.startsWith('Ponderado')) { const w = (((v.__w || {})[c.campos[0]]) || A('rg_con_area')).map(Number), tw = vals.reduce((a, _, i) => a + (w[i] || 1), 0); raw = vals.reduce((a, x, i) => a + x * (w[i] || 1), 0) / tw; }
      else if (how.startsWith('Peor')) raw = Math.min(...vals); else if (how.startsWith('Mejor')) raw = Math.max(...vals); else raw = vals.reduce((a, x) => a + x, 0) / vals.length;
      const t = [...new Set(txts)]; return { raw, valor: t.join(' · ') + (vals.length > 1 ? ' (' + vals.length + ' instancias · ' + (how || 'promedio').toLowerCase() + ')' : '') }; };
    const X = {
      'A.4': () => { const p = A('rg_con_pisos'), s = A('rg_con_subsuelos'); return comb(p.map((x, i) => (s[i] || 'Sin subsuelos') !== 'Sin subsuelos' || x === 'Más de 6' ? 0 : x === '4–6' ? 2 : 4), p.map((x, i) => x + ' pisos · ' + (s[i] || 'Sin subsuelos').toLowerCase())); },
      'C.1': () => { const e = one('rg_pci_det_existe'), ce = one('rg_pci_det_central'); return { raw: e === 'No' ? 0 : ce === 'Centralizada, zonificada y supervisada' ? 6 : ce === 'Local o manual' ? 3 : 0, valor: 'Existe: ' + (e || '—') + ' · central: ' + (ce || '—') }; },
      'C.2': () => { const e = one('rg_pci_ext_existe'), q = A('rg_pci_extintores').reduce((a, r) => a + (+r.Cantidad || 0), 0), rq = +one('rg_pci_ext_requeridos') || 0, mt = one('rg_pci_ext_mantenimiento'); const ok = e !== 'No' && q >= rq && mt === 'Vigente con etiqueta'; return { raw: e === 'No' ? 0 : ok ? 5 : 2, valor: e === 'No' ? 'No tiene extintores' : q + ' instalados de ' + rq + ' requeridos · mantenimiento ' + (mt || '—') }; },
      'C.5': () => { const ce = one('rg_rob_cerramiento'), pa = A('rg_rob_proteccion_adicional'), extra = pa.includes('Cerco eléctrico') || pa.includes('Concertina'); return { raw: ce === 'Abierto' ? 0 : ce === 'Muro de hormigón o bloque' || extra ? 5 : 3, valor: (ce || '—') + ' · ' + (pa.filter(x => x !== 'Ninguna').join(', ') || 'sin protección adicional') }; },
      'C.6': () => { const g = one('rg_rob_vig_existe') === 'Sí', g24 = g && ['24 h', '2x12'].includes(one('rg_rob_vig_turnos')) && one('rg_rob_vig_dias') === '7 días', al = one('rg_rob_alarma_existe') === 'Sí', cc = one('rg_rob_cctv_existe') === 'Sí'; return { raw: g24 && al && cc ? 10 : g || al ? 7 : cc ? 3 : 0, valor: 'Guardia: ' + (g ? one('rg_rob_vig_turnos') + ', ' + one('rg_rob_vig_dias') : 'No') + ' · alarma: ' + (al ? 'Sí' : 'No') + ' · CCTV: ' + (cc ? 'Sí' : 'No') }; },
      'C.8': () => { const n = (one('rg_ee_ups') === 'Sí' ? 1 : 0) + (one('rg_ee_supresor') === 'Sí' ? 1 : 0); return { raw: n === 2 ? 3 : n === 1 ? 2 : 0, valor: 'UPS: ' + (one('rg_ee_ups') || '—') + ' · supresor: ' + (one('rg_ee_supresor') || '—') }; },
      'C.9': () => { const n = (one('rg_ee_climatizacion') === 'Climatización dedicada' ? 1 : 0) + (one('rg_ee_cuarto_humedad') === 'Sin humedad ni desagües encima' ? 1 : 0); return { raw: n === 2 ? 3 : n === 1 ? 1 : 0, valor: (one('rg_ee_climatizacion') || '—') + ' · ' + (one('rg_ee_cuarto_humedad') || '—') }; } };
    if (c.forma === 'Condición' && X[c.id]) return X[c.id]();
    const k = c.campos[0], vals = A(k);
    if (c.forma.startsWith('Mejor')) { const hits = c.tabla.filter(r => vals.includes(r.cuando)); if (!hits.length) { const z = c.tabla.find(r => /^sin/i.test(r.cuando)); return { raw: z ? z.p : 0, valor: vals.length ? vals.join(', ') : 'Sin red' }; } return { raw: Math.max(...hits.map(r => r.p || 0)), valor: vals.join(', ') + (vals.length > 1 ? ' (mejor opción)' : '') }; }
    if (!vals.length) return { raw: 0, valor: 'Sin dato', falta: true };
    const ps = [], txts = [], nivs = []; vals.forEach(x => { const r = c.tabla.find(rr => rr.cuando === x); nivs.push(r && r.nivel || ''); if (r && r.manual) { const mp = ((v.__manual || {})[c.id]); ps.push(mp !== undefined ? mp : 0); txts.push(x + ' (puntaje manual)'); } else { ps.push(r ? r.p || 0 : 0); txts.push(x); } });
    const out = comb(ps, txts), un = [...new Set(nivs)]; if (un.length === 1 && un[0]) out.nivel = un[0]; return out; },

  // ---- Políticas de suscripción (Envío 3C). Mismo cálculo en el Simulador de Modelos y en «Probar con un caso».
  anioActual() { const E = window.SIRIUS_EJEMPLO || {}; return (E.ahora ? E.ahora() : new Date()).getFullYear(); },
  hoyISO() { const E = window.SIRIUS_EJEMPLO || {}, d = E.ahora ? E.ahora() : new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  // Valores calculados: región desde la provincia y edad desde el año de construcción (si el informe no los trae).
  derivados(v) { const E = window.SIRIUS_EJEMPLO || {}, o = Object.assign({}, v || {}), P = (E.catalogos || {}).provinciaRegion || {}, one = (k) => this.arr(o[k])[0];
    if (one('rg_ubi_region') === undefined && P[one('rg_ubi_provincia')]) o.rg_ubi_region = P[one('rg_ubi_provincia')];
    // Extintores requeridos (campo calculado): área construida ÷ cobertura según rg_ocu_riesgo_nfpa (Ligero 278,7 · Ordinario 139,4 · Extra 92,9 m²), redondeado hacia arriba. Sin tipo de riesgo se usa Ligero, como dice la fórmula del campo.
    if (one('rg_pci_ext_requeridos') === undefined) { const ar = this.arr(o.rg_con_area).map(Number).filter(x => x > 0), cob = { Ligero: 278.7, Ordinario: 139.4, Extra: 92.9 }[one('rg_ocu_riesgo_nfpa')] || 278.7; if (ar.length) o.rg_pci_ext_requeridos = Math.ceil(ar.reduce((s, x) => s + x, 0) / cob - 1e-9); }
    if (one('rg_con_edad') === undefined) { const a = this.arr(o.rg_con_anio_construccion).map(Number).filter(x => x > 0); if (a.length) o.rg_con_edad = a.map(x => this.anioActual() - x); }
    const cz = window.SIRIUS_CIIU, hz = cz && one('rg_gen_ciiu') !== undefined ? cz.buscar(one('rg_gen_ciiu')) : null; if (hz && hz.riesgo) o.rg_ocu_riesgo_ciiu = hz.riesgo;
    return o; },
  campoInfo(k) { if (!this._ci || this._ciSrc !== (window.SIRIUS_EJEMPLO || {}).modulos) { const E = window.SIRIUS_EJEMPLO || {}, m = {}; (E.modulos || []).forEach(mo => (mo.estructura || []).forEach(sc => (sc.campos || []).forEach(c => { if (c.k && !m[c.k]) m[c.k] = { l: c.l, unidad: c.unidad || '', t: c.t, opts: c.opts || [], vis: c.vis || null }; }))); this._ci = m; this._ciSrc = E.modulos; }
    return this._ci[k] || { l: k, unidad: '', t: 'Texto', opts: [], vis: null }; },
  // Campo oculto por una condición falsa (vis): el campo que lo controla tiene valor y no cumple la condición.
  campoOculto(k, v) { const f = this.campoInfo(k); if (!f.vis) return false; const x = this.arr(v[f.vis.k]); if (!x.length) return false; return f.vis.op === '≠' ? x.includes(f.vis.v) : !x.includes(f.vis.v); },
  // Criterio cuyos campos están todos ocultos: toma el nivel «No tiene» (o «Sin…») de su tabla, o 0 si el modelo no lo define. No cuenta como sin dato.
  ocultoCrit(c, v) { if (c.forma === 'Condición' || !(c.campos || []).length || !c.campos.every(k => this.campoOculto(k, v))) return null; const t = (c.tabla || []).find(r => /^(no tiene|sin\b|ning)/i.test(r.cuando)); return { raw: t ? t.p || 0 : 0, nivel: t ? t.cuando : '', valor: 'Oculto por condición · ' + (t ? 'nivel «' + t.cuando + '»' : 'el modelo no define «No tiene»: 0 pts') }; },
  ramoEn(ramos, ramo) { if (!ramos || !ramos.length) return true; const rs = ramo === 'Incendio y Robo' ? ['Incendio y líneas aliadas', 'Robo'] : [ramo]; return rs.some(r => ramos.includes(r)); },
  polEstado(p) { const h = this.hoyISO(); if (!p.activa) return 'Inactiva'; if (p.desde && p.desde > h) return 'Programada'; if (p.hasta && p.hasta < h) return 'Vencida'; return 'Vigente'; },
  CONS: { alerta: 'Mostrar alerta', nivel2: 'Requerir evaluación de suscripción', noAsegurable: 'Sugerir No asegurable salvo excepción' },
  numTxt(n) { const s = String(Math.round(n * 100) / 100).split('.'); return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (s[1] ? ',' + s[1] : ''); },
  // Una condición: { ok, sinDato, txt } con el valor del informe.
  polCond(c, v) { const E = window.SIRIUS_EJEMPLO || {}, f = this.campoInfo(c.k), vals = this.arr(v[c.k]), u = f.unidad ? ' ' + f.unidad : '';
    if (!vals.length) return { ok: false, sinDato: true, txt: f.l + ': sin dato' };
    if (c.op === 'catalogo') { const cat = ((E.catalogos || {})[c.cat] || []), CZ = window.SIRIUS_CIIU, cd = (x) => CZ ? CZ.codeOf(x) : String(x), cls = (x) => cd(x).split('.')[0];
      // Una política que lista una clase aplica a la clase y a todas sus subclases; una que lista una subclase aplica solo a esa subclase.
      const hit = vals.find(x => { const k = cd(x); return k && cat.some(z => z.codigo.indexOf('.') < 0 ? (k === z.codigo || k.indexOf(z.codigo + '.') === 0) : k === z.codigo); });
      const pre = !hit ? vals.map(x => cd(x)).find(k => k && k.indexOf('.') < 0 && cat.some(z => z.codigo.indexOf(k + '.') === 0)) : null;
      if (pre) return { ok: false, sinDato: true, precisa: pre, faltaTxt: 'precisa la subclase de ' + pre, txt: f.l + ': ' + vals.join(', ') + ' · precisa la subclase de ' + pre };
      return { ok: !!hit, txt: f.l + ': ' + vals.join(', ') + (hit ? ' (en el catálogo)' : '') }; }
    if (c.op === 'es') { const ok = vals.some(x => (c.vals || []).includes(String(x))); return { ok, txt: f.l + ': ' + vals.join(', ') }; }
    const nums = vals.map(Number).filter(x => !isNaN(x)), ok = nums.some(x => c.op === 'menor' ? x < c.a : c.op === 'mayor' ? x > c.a : x === c.a);
    return { ok, txt: f.l + ': ' + nums.map(x => this.numTxt(x)).join(', ') + u }; },
  // Evalúa las políticas vigentes para un informe { ramo, giro, valores }. Devuelve las que se activan y el detalle de todas.
  politicas(inf, lista) { const E = window.SIRIUS_EJEMPLO || {}, v = this.derivados(inf.valores || {}), out = { hits: [], todas: [], nivel2: false, alerta: false, noAsegurable: false };
    (lista || E.politicasSuscripcion || []).forEach(p => { const est = this.polEstado(p); if (est !== 'Vigente') { out.todas.push({ p, ok: false, motivo: est }); return; }
      if (!this.ramoEn(p.ramos, inf.ramo)) { out.todas.push({ p, ok: false, motivo: 'No aplica al ramo' }); return; }
      if (p.giros && p.giros.length && !p.giros.includes(inf.giro)) { out.todas.push({ p, ok: false, motivo: 'No aplica al giro' }); return; }
      const gs = (p.grupos || []).map(g => { const rs = (g.conds || []).map(c => this.polCond(c, v)); return { ok: rs.length > 0 && rs.every(r => r.ok), rs }; });
      const ok = p.join === 'y' ? gs.length > 0 && gs.every(g => g.ok) : gs.some(g => g.ok), hitG = gs.find(g => g.ok), all = [].concat(...gs.map(g => g.rs)), sd = all.filter(r => r.sinDato);
      const detalle = ok ? hitG.rs.map(r => r.txt).join(' · ') : (sd.length && sd.length === all.length ? 'Sin dato: ' + [...new Set(sd.map(r => r.txt.replace(/: sin dato$/, '')))].join(', ') : [...new Set(all.map(r => r.txt))].join(' · '));
      // Dato faltante: si ningún grupo se cumple y en alguno las condiciones con dato se cumplen pero falta otro dato, la política no se pudo evaluar (nunca se da por cumplida ni por descartada).
      const faltan = ok ? [] : [...new Set([].concat(...gs.filter(g => g.rs.some(r => r.sinDato) && g.rs.every(r => r.ok || r.sinDato)).map(g => g.rs.filter(r => r.sinDato).map(r => r.faltaTxt || r.txt.replace(/: sin dato$/, '')))))];
      const just = !!(inf.justificaciones && String(inf.justificaciones[p.id] || '').trim()), sinEval = faltan.length > 0;
      const pcl = sinEval ? [...new Set(all.filter(r => r.precisa).map(r => r.precisa))] : [], soloPre = sinEval && pcl.length > 0 && faltan.every(x => /^precisa la subclase/.test(x));
      const rec = { p, ok, sinEval, precisa: soloPre ? pcl[0] : '', justificada: sinEval && just, faltan, detalle: soloPre ? 'No se pudo evaluar · precisa la subclase de ' + pcl.join(', ') : sinEval ? 'Falta: ' + faltan.join(', ') : detalle, msg: soloPre ? 'No se pudo evaluar ' + p.codigo + ' ' + p.nombre + ' · precisa la subclase de ' + pcl.join(', ') : sinEval ? 'No se pudo evaluar ' + p.codigo + ' ' + p.nombre + ': falta ' + faltan.join(', ').toLowerCase() : '', consecuencias: (p.consecuencias || []).map(k => this.CONS[k]).filter(Boolean) }; out.todas.push(rec);
      if (sinEval) (out.sinEval = out.sinEval || []).push(rec);
      if (ok) { out.hits.push(rec); if ((p.consecuencias || []).includes('nivel2')) out.nivel2 = true; if ((p.consecuencias || []).includes('alerta')) out.alerta = true; if ((p.consecuencias || []).includes('noAsegurable')) out.noAsegurable = true; } });
    out.excepciones = [...new Set(out.hits.filter(h => (h.p.consecuencias || []).includes('noAsegurable')).map(h => h.p.excepcion).filter(x => x && x !== 'No admite'))];
    out.sinEval = out.sinEval || []; out.pendientes = out.sinEval.filter(r => !r.justificada);
    // Mientras haya políticas sin evaluar y sin justificación del calificador, el caso no puede calificarse.
    out.bloquea = out.pendientes.length > 0;
    out.sinExcepcion = out.hits.some(h => (h.p.consecuencias || []).includes('noAsegurable') && h.p.excepcion === 'No admite');
    return out; },
  sugPol(P) { if (!P || !P.noAsegurable) return ''; return P.sinExcepcion ? 'No asegurable (la política no admite excepción)' : 'No asegurable salvo excepción' + (P.excepciones.length ? ' (' + P.excepciones.join(' o ') + ')' : ''); },
  // Vista previa (opt.preview): excluye los criterios sin dato (ningún campo con valor final) y los módulos sin criterios con dato; no cambia la calificación ni guarda nada.
  calc(m, inf, opt) { const PV = !!(opt && opt.preview), E = m.escala, rg = E.max - E.min, B = m.bandas.slice().sort((a, b) => b.desde - a.desde), CR = m.criterios || [], v = this.derivados(inf.valores || {});
    const modPts = (id) => { const x = m.modulos.find(y => y.id === id); return x ? x.peso / 100 * rg : 0; };
    const comp = m.composicion.find(c => c.ramo === inf.ramo) || null;
    const bandOf = (score) => B.find(b => score >= b.desde - 1e-9) || B[B.length - 1] || null;
    const niv = m.niveles.slice().sort((a, b) => b.desde - a.desde), nivOf = (p) => niv.find(n => p >= n.desde - 1e-9) || niv[niv.length - 1];
    if (!comp) return { sinModelo: true };
    const crits = [], mods = comp.mods.map(id => { const x = m.modulos.find(y => y.id === id), cs = CR.filter(c => c.mod === id); let pts = 0, max = 0;
      cs.forEach(c => { const mp = c.pct / 100 * modPts(id), oc = this.ocultoCrit(c, v), r = oc || this.evalCrit(c, v); if (r.na) { crits.push({ c, na: true, valor: r.valor, mod: id }); return; } if (PV && !oc && (c.campos || []).every(k => !this.arr(v[k]).length)) { crits.push({ c, sinDato: true, pts: 0, max: mp, valor: 'Sin dato', mod: id }); return; } const p = c.ref ? r.raw / c.ref * mp : 0; pts += p; max += mp; crits.push({ c, pts: p, max: mp, pct: c.ref ? r.raw / c.ref * 100 : 0, valor: r.valor, falta: r.falta, mod: id, nivelFijo: r.nivel || '', oculto: !!oc }); });
      const full = modPts(id), score = max > 0 ? pts / max * full : 0, pct = max > 0 ? pts / max * 100 : 0; return { id, nombre: x ? x.nombre : id, pts: score, max: PV && !(max > 0) ? 0 : full, full, sinDato: PV && !(max > 0), nSinDato: crits.filter(k => k.mod === id && k.sinDato).length, pct, renorm: Math.abs(max - full) > 1e-9, band: bandOf(E.min + pct / 100 * rg) }; });
    const raw = mods.reduce((a, x) => a + x.pts, 0), rawMax = mods.reduce((a, x) => a + x.max, 0), total = rawMax > 0 ? E.min + raw / rawMax * rg : E.min, band = bandOf(total);
    const critMods = mods.filter(x => x.pct < 40), fired = [], notFired = []; let final = band, nivel2 = false, garantias = [], garItems = [];
    const cmp = (a, op, b) => op === '<' ? a < b - 1e-9 : op === '<=' ? a <= b + 1e-9 : op === '>' ? a > b + 1e-9 : op === '>=' ? a >= b - 1e-9 : Math.abs(a - b) < 1e-6;
    (m.severidad || []).forEach(r => { if (r.tipo === 'exclusion' || !r.activa) return; if (r.ramos.length && !r.ramos.includes(inf.ramo)) { notFired.push(r.nombre + ' (no aplica al ramo)'); return; } if (r.giros.length && !r.giros.includes(inf.giro)) { notFired.push(r.nombre + ' (no aplica al giro)'); return; }
      const det = [], res = r.conds.map(c => { if (c.t === 'modulo') { const hit = mods.filter(x => (c.mod === '*' || x.id === c.mod) && cmp(x.pct, c.op, c.v)); hit.forEach(x => det.push(x.id + ' en ' + this.fmt(x.pct, 1) + ' %')); return hit.length > 0; }
        if (c.t === 'criterio') { const x = crits.find(y => y.c.id === c.crit && !y.na); if (!x) return false; const ok = cmp(x.pts, c.op, c.v); if (ok) det.push(c.crit + ' = ' + this.fmt(x.pts, 1) + ' pts'); return ok; }
        if (c.t === 'campo') { const vals = this.arr(v[c.k]).map(String), hit = vals.some(z => (c.vals || []).includes(z)), ok = c.op === 'no_en' ? !hit : hit; if (ok) det.push(c.k + ' = ' + (vals.join(', ') || 'sin dato')); return ok; }
        if (c.t === 'banda') { const bi = B.findIndex(b => b.id === c.b), ti = B.indexOf(band), ok = c.op === 'peor' ? ti >= bi : ti === bi; if (ok) det.push('banda ' + (band ? band.etiqueta : '')); return ok; }
        if (c.t === 'ncrit') { const ok = cmp(critMods.length, c.op, c.v); if (ok) det.push(critMods.length + ' módulos críticos'); return ok; } return false; });
      const on = r.join === 'y' ? res.every(Boolean) : res.some(Boolean); if (!on) { notFired.push(r.nombre); return; }
      const e = r.efectos, efs = [];
      if (e.garantia) { const T = (id) => (this.catItem(id) || {}).titulo || id;
        if (e.porModulo) critMods.forEach(x => { const it = e.porModulo[x.id]; if (it) { garantias.push(T(it)); garItems.push({ id: it, regla: r.nombre, reglaId: r.id, modulo: x.id, pct: x.pct }); efs.push('Exige «' + T(it) + '» por ' + x.id); } else efs.push(x.id + ': sin ítem, solo alerta'); });
        else (e.items || []).forEach(id => { garantias.push(T(id)); garItems.push({ id, regla: r.nombre, reglaId: r.id }); efs.push('Exige «' + T(id) + '»'); }); }
      if (e.tope) { const tb = B.find(b => b.id === e.banda); if (tb && final && B.indexOf(final) < B.indexOf(tb)) { final = tb; efs.push('Tope ' + tb.etiqueta + ': baja el resultado'); } else if (tb) efs.push('Tope ' + tb.etiqueta + ': sin cambio'); }
      if (e.nivel2) { nivel2 = true; efs.push('Requiere evaluación de suscripción (nivel 2)'); } if (e.alerta) efs.push('Alerta al calificador');
      fired.push({ r, detalle: det.join(' · '), efectos: efs.join(' · ') }); });
    const exR = (m.severidad || []).find(r => r.tipo === 'exclusion'), pol = exR && exR.activa ? this.politicas(inf) : { hits: [], todas: [], excepciones: [], sinEval: [], pendientes: [], bloquea: false };
    if (exR && exR.activa) { if (pol.hits.length) { if (pol.nivel2) nivel2 = true; fired.push({ r: exR, politica: true, detalle: pol.hits.map(h => h.p.codigo + ' ' + h.p.nombre).join(' · '), efectos: [pol.nivel2 ? 'Requiere evaluación de suscripción (nivel 2)' : '', pol.alerta ? 'Alerta al calificador' : '', this.sugPol(pol) ? 'Sugiere ' + this.sugPol(pol).charAt(0).toLowerCase() + this.sugPol(pol).slice(1) : ''].filter(Boolean).join(' · '), msg: pol.hits.map(h => h.p.texto).join(' ') }); } else notFired.push(exR.nombre + ' (ninguna política se activa)'); }
    return { comp, mods, crits, raw, rawMax, total, band, final, provisional: PV, sinDato: crits.filter(k => k.sinDato).length, fired, notFired, nivel2, garantias, garItems, critMods, nivOf, pol, polSug: this.sugPol(pol), polNivel2: !!pol.nivel2, polBloquea: !!pol.bloquea }; }
};
