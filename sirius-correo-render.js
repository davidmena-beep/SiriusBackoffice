// SIRIUS · Un solo armado del correo (v1.0 · etapa N-2b · DEC-257 · 18/11/2026)
// Lo usan la vista previa del editor de plantillas, «Ver correo» de la Bitácora (navegador: window.SiriusCorreoRender) y la función de envío
// sirius-notificar de la base (module.exports o globalThis.SiriusCorreoRender). No usa el DOM ni depende de otros archivos: lo que se ve es lo que se envía.
//   SiriusCorreoRender.html(plantilla, contexto, opciones) → HTML completo del correo (estilos en línea, ancho máximo 600 px, Mulish con respaldo Arial).
//   SiriusCorreoRender.asunto(plantilla, contexto) → asunto con las variables llenas.
// plantilla: la de SIRIUS_NOTIFICACIONES.plantillas (usa plantilla.correo { asunto, estilo, bloques }) o directamente { asunto, estilo, bloques }.
// contexto (como lo arma la base): caso { numero, poliza, ramo, sucursal }, asegurado { nombre }, contacto { nombre, correo }, broker { nombre },
//   visita { fecha, franja, direccion, modalidad, inspector }, garantias { fechaLimite, diasRestantes, pendientes },
//   tablas { garantias: [{ codigo, nombre, detalle, estado, respaldo, fechaCumplimiento }], … }, enlace { url, vence }, mensaje,
//   destinatario { nombre, rol, sinDestino }, compania { nombre }.
// opciones: { enlaces: { portal, backoffice }, assets: 'https://…/', archivos: ['banner.png', …] (si se da, solo esos existen),
//   logo: { src, alt }, faltante: '—' (lo que va cuando una variable no tiene dato) }.
(function (root) {
  'use strict';
  const R = { version: '1.0' };
  const sd = (s) => (s == null ? '' : String(s));
  const esc = (s) => sd(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const color = (c, d) => (/^#[0-9a-f]{6}$/i.test(sd(c)) ? c : d);
  // Valor de una variable {{a.b}} en el contexto (también acepta claves planas «a.b»).
  R.valor = (ctx, ruta) => { ctx = ctx || {}; if (Object.prototype.hasOwnProperty.call(ctx, ruta)) return ctx[ruta]; let x = ctx; const p = sd(ruta).split('.');
    for (let i = 0; i < p.length; i++) { if (x == null || typeof x !== 'object') return undefined; x = x[p[i]]; } return x; };
  const vacio = (v) => v == null || v === '' || (typeof v === 'object' && !Array.isArray(v));
  // Texto con variables: el texto de la plantilla y los valores se escapan; una variable sin dato se reemplaza por opciones.faltante.
  R.llenar = (t, ctx, op, plano) => { const f = op && op.faltante != null ? op.faltante : '—';
    return sd(t).split(/(\{\{\s*[\w.]+\s*\}\})/).map((x) => { const m = /^\{\{\s*([\w.]+)\s*\}\}$/.exec(x); if (!m) return plano ? x : esc(x); const v = R.valor(ctx, m[1]); const s = vacio(v) ? f : sd(v); return plano ? s : esc(s); }).join(''); };
  const lineas = (s) => s.replace(/\r?\n/g, '<br>');
  R.cuerpo = (p) => (p && p.correo ? p.correo : p) || {};
  R.asunto = (plantilla, contexto, opciones) => R.llenar(R.cuerpo(plantilla).asunto || '', contexto, opciones, true).replace(/\s+/g, ' ').trim();
  R.externo = (rol) => /cliente|asegurado|contacto|br[oó]ker|aps/i.test(sd(rol));
  // Destino de un botón: «sirius» lleva al portal (clientes y brókeres) o al Back-office (internos); si no, la URL escrita.
  R.destino = (d, ctx, op) => { const en = (op && op.enlaces) || {}, des = (ctx && ctx.destinatario) || {};
    if (d === 'sirius' || !d) return R.externo(des.rol) || !des.rol ? (en.portal || R.valor(ctx, 'enlace.url') || en.backoffice || '') : (en.backoffice || en.portal || R.valor(ctx, 'enlace.url') || '');
    return R.llenar(d, ctx, op, true); };
  // Imagen de un banner o pie: la propia (b.img, solo en el editor), la del almacén (assets + archivo) o el logo.
  R.imagen = (b, op) => { op = op || {}; if (b.img) return { src: b.img, alt: b.alt || '' };
    const existe = b.archivo && op.assets && (!Array.isArray(op.archivos) || op.archivos.indexOf(b.archivo) >= 0);
    if (existe) return { src: sd(op.assets).replace(/\/?$/, '/') + encodeURIComponent(b.archivo), alt: b.alt || '' };
    return op.logo && op.logo.src ? { src: op.logo.src, alt: op.logo.alt || b.alt || '', logo: true } : null; };
  const ALIN = { izquierda: 'left', centro: 'center', centrado: 'center', derecha: 'right' };
  // Filas de una tabla de datos con su filtro (por _filtros si la base las marca; si no, por el estado).
  R.filas = (b, ctx) => { const all = (((ctx || {}).tablas || {})[b.fuente] || []).slice(), f = sd(b.filtro).toLowerCase();
    const ok = all.filter((r) => { if (!f || /^tod[oa]s$/.test(f) || /^pr[oó]ximas$/.test(f)) return true; if (Array.isArray(r._filtros)) return r._filtros.map((x) => sd(x).toLowerCase()).indexOf(f) >= 0;
      const e = sd(r.estado).toLowerCase(); return f.slice(0, 5) === e.slice(0, 5) || (f.indexOf('pendient') === 0 && e.indexOf('pendient') === 0) || (f.indexOf('vencid') === 0 && e.indexOf('vencid') === 0) || (f.indexOf('cumplid') === 0 && e.indexOf('cumplid') === 0) || (f.indexOf('rechaz') === 0 && e.indexOf('rechaz') === 0); });
    const mx = Math.max(1, Math.min(20, Number(b.maxFilas) || 10)); return ok.slice(0, mx); };
  const fila = (html, pad) => '<tr><td style="padding:' + (pad || '0 24px 16px') + ';">' + html + '</td></tr>';
  R.tabla = (b, ctx, op, est) => { const es = b.estilo || {}, enc = color(es.colorEncabezado, est.prim), bord = es.bordes ? '1px solid #D0D5DD' : '0', lin = es.bordes ? '1px solid #D0D5DD' : '1px solid #E4E7EC';
    let head = null, body = [], vac = '', rowHead = false;
    if (b.modo === 'libre') { const C = (b.celdas || []).map((r) => r.map((x) => R.llenar(x, ctx, op))), nc = Math.max(0, ...C.map((r) => r.length)), Rw = C.map((r) => Array.from({ length: nc }, (_, j) => r[j] || ''));
      if (b.encabezadoColumnas && Rw.length) { head = Rw[0]; body = Rw.slice(1); } else body = Rw; rowHead = !!b.titulosFila; }
    else { const cols = b.columnas || [], L = R.filas(b, ctx); head = cols.map((c) => esc(c[1])); body = L.map((r) => cols.map((c) => esc(r[c[0]] == null || r[c[0]] === '' ? '—' : r[c[0]]))); if (!L.length) vac = R.llenar(b.vacio || 'No hay filas para mostrar.', ctx, op); }
    const al = (j) => ALIN[((es.alineacion || [])[j])] || 'left';
    let h = (b.titulo ? '<p style="margin:0 0 6px;font-size:15px;font-weight:700;color:' + est.texto + ';">' + R.llenar(b.titulo, ctx, op) + '</p>' : '')
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:' + bord + ';font-size:14px;line-height:1.45;">';
    if (head && head.length) h += '<tr>' + head.map((t, j) => '<th align="' + al(j) + '" style="padding:8px 10px;background:' + enc + ';color:#FFFFFF;font-weight:700;text-align:' + al(j) + ';border:' + bord + ';">' + (t || '&nbsp;') + '</th>').join('') + '</tr>';
    body.forEach((r, ri) => { const bg = es.cebra && ri % 2 === 1 ? '#F3F6F9' : '#FFFFFF';
      h += '<tr>' + r.map((t, j) => { const th = rowHead && j === 0; return '<' + (th ? 'th' : 'td') + ' align="' + al(j) + '" style="padding:8px 10px;background:' + bg + ';text-align:' + al(j) + ';border-top:' + lin + ';' + (es.bordes ? 'border:' + bord + ';' : '') + (th ? 'font-weight:700;' : 'font-weight:400;') + 'color:' + est.texto + ';">' + (t === '' ? '&nbsp;' : t) + '</' + (th ? 'th' : 'td') + '>'; }).join('') + '</tr>'; });
    h += '</table>'; if (vac) h += '<p style="margin:6px 0 0;font-size:13px;color:#667085;">' + vac + '</p>'; return h; };
  R.bloque = (b, ctx, op, est) => { const t = b.tipo;
    if (t === 'banner') { const im = R.imagen(b, op); const alto = Math.max(40, Math.min(240, Number(b.alto) || 140));
      if (im && !im.logo) return fila('<img src="' + esc(im.src) + '" alt="' + esc(R.llenar(im.alt, ctx, op, true)) + '" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;">', '0 0 16px');
      if (im) return fila('<div style="background:' + est.prim + ';padding:20px 24px;text-align:center;"><img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" height="48" style="height:48px;border:0;"></div>', '0 0 16px');
      return fila('<div style="background:' + est.prim + ';color:#FFFFFF;padding:' + Math.round(alto / 3) + 'px 24px;text-align:center;font-size:18px;font-weight:700;">' + R.llenar(b.alt || 'Aseguradora del Sur', ctx, op) + '</div>', '0 0 16px'); }
    if (t === 'texto') return fila('<p style="margin:0;font-size:15px;line-height:1.55;color:' + est.texto + ';">' + lineas(R.llenar(b.contenido, ctx, op)) + '</p>');
    if (t === 'tabla') return fila(R.tabla(b, ctx, op, est));
    if (t === 'boton') { const sec = b.estilo === 'secundario', href = R.destino(b.destino, ctx, op);
      return fila('<a href="' + esc(href || '#') + '" target="_blank" style="display:inline-block;padding:12px 22px;border-radius:6px;font-size:15px;font-weight:700;text-decoration:none;' + (sec ? 'background:#FFFFFF;color:' + est.prim + ';border:2px solid ' + est.prim + ';' : 'background:' + est.prim + ';color:#FFFFFF;border:2px solid ' + est.prim + ';') + '">' + R.llenar(b.texto || 'Abrir', ctx, op) + '</a>'); }
    if (t === 'separador') return fila('<hr style="border:0;border-top:1px solid #E4E7EC;margin:0;">');
    if (t === 'pie') { const im = R.imagen(b, op);
      return fila((im ? '<img src="' + esc(im.src) + '" alt="' + esc(R.llenar(im.alt, ctx, op, true)) + '" height="40" style="display:block;height:40px;border:0;margin:0 0 8px;">' : '') + (b.texto ? '<p style="margin:0;font-size:12px;line-height:1.5;color:#667085;">' + lineas(R.llenar(b.texto, ctx, op)) + '</p>' : ''), '16px 24px 24px;border-top:1px solid #E4E7EC'); }
    return ''; };
  R.html = (plantilla, contexto, opciones) => { const c = R.cuerpo(plantilla), es = c.estilo || {}, op = opciones || {}, ctx = contexto || {};
    const est = { prim: color(es.primario, '#0B5CAD'), texto: color(es.texto, '#1F2A37'), fondo: color(es.fondo, '#FFFFFF') };
    const fuente = (es.fuente && es.fuente !== 'Mulish' ? "'" + sd(es.fuente).replace(/'/g, '') + "', " : '') + "Mulish, Arial, Helvetica, sans-serif";
    const as = R.asunto(plantilla, ctx, op), bl = (c.bloques || []).map((b) => R.bloque(b, ctx, op, est)).join('');
    return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(as) + '</title></head>'
      + '<body style="margin:0;padding:0;background:#F2F4F7;">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#F2F4F7;"><tr><td align="center" style="padding:24px 12px;">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:' + est.fondo + ';font-family:' + fuente + ';color:' + est.texto + ';border-radius:8px;overflow:hidden;">'
      + ((c.bloques || [])[0] && c.bloques[0].tipo === 'banner' ? '' : '<tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>') + bl + '</table></td></tr></table></body></html>'; };
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
  if (root) root.SiriusCorreoRender = R;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
