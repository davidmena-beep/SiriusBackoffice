// SIRIUS · Coordinar visita por fases (v1.0 · etapa G-2c2 · DEC-237 · 18/10/2026). Reemplaza la columna larga de «Coordinar inspección» (maqueta G-1f).
// Fases según la modalidad: Presencial = Contacto · Lugar · Inspector y horario; Virtual guiada = Contacto · Inspector y horario; Autoinspección = Contacto ·
// Enlace de autoinspección (Documental = Contacto · Revisión documental; No requiere inspección = Contacto · Motivo). Barra arriba con la modalidad (según las reglas
// parametrizadas, evaluadas con los vehículos elegidos: una bloqueada se ve con 🔒 y su motivo en el título) y los vehículos. Pie con orden fijo: Salir · ← fase anterior ·
// acción secundaria · acción principal (azul, la última) y «N de M»; Ctrl+Enter ejecuta la principal; Alt+← / Alt+→ cambian de fase.
// Es la vista: el formulario (pnl), los errores, el envío y las acciones siguen en Coordinacion.dc.html, que entrega todo en props.ctx (ver Coordinacion: fasesCtx).
// Reutiliza SiriusLugar, SiriusUbicacion, SiriusMapa, SiriusZonas, SiriusCobertura y SiriusFecha.
(function () {
  'use strict';
  const W = window; if (W.SiriusCoordinar) return;
  const R = () => W.React, h = (...a) => R().createElement(...a), NS = () => W.AseguradoraDelSurDesignSystem_4fbf29 || {};
  const SL = () => W.SiriusLugar, SF = () => W.SiriusFecha, U = () => W.SiriusUbicacion, Z = () => W.SiriusZonas, SM = () => W.SiriusMapa, CB = () => W.SiriusCobertura;
  const z2 = (n) => String(n).padStart(2, '0');
  const aMin = (t) => { const m = /^(\d{2}):(\d{2})$/.exec(String(t || '')); if (!m) return null; const a = +m[1], b = +m[2]; return a < 24 && b < 60 ? a * 60 + b : null; };
  const aHora = (m) => z2(Math.floor(m / 60)) + ':' + z2(m % 60);
  const pIso = (iso) => { const p = String(iso).split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2], 12)); };
  const sumaDias = (iso, k) => { const d = pIso(iso); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
  const dow = (iso) => { const d = pIso(iso).getUTCDay(); return d === 0 ? 7 : d; }; // lunes = 1 … domingo = 7
  const NOMD = ['', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  const ddmm = (iso) => iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '';
  const diaTxt = (iso) => iso ? NOMD[dow(iso)] + ' ' + ddmm(iso) : '';
  const ddmmaaaa = (iso) => iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : '';
  const T0 = 7 * 60, T1 = 19 * 60, SPAN = T1 - T0;
  let css = false;
  const ponerCss = () => { if (css) return; css = true; const s = document.createElement('style');
    s.textContent = '.scv{position:fixed;inset:0;z-index:1501;display:flex;flex-direction:column;background:var(--surface-subtle,#F5F6F8);font-family:var(--font-brand);color:var(--text-body)}' +
      '.scv-cab{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 20px;background:#fff;border-bottom:1px solid var(--border-subtle)}.scv-cab h2{margin:0;font-size:19px;font-weight:700;color:var(--text-strong)}' +
      '.scv-chip{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;background:var(--surface-subtle,#F3F5F8);font-size:13px;font-weight:600;color:var(--text-strong);white-space:nowrap}' +
      '.scv-chip.warn{background:var(--color-warning-bg,#FFF4D6);color:#7A4F0E}.scv-chip.ok{background:var(--green-100,#E6F4EA);color:var(--green-700,#1E7B3C)}.scv-chip.cy{background:var(--cyan-100);color:var(--text-strong)}' +
      '.scv-barra{display:flex;align-items:center;gap:8px 18px;flex-wrap:wrap;padding:8px 20px;background:#fff;border-bottom:1px solid var(--border-subtle)}.scv-g{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.scv-g>span.t{font-size:13px;font-weight:700;color:var(--text-muted)}' +
      '.scv-seg{display:inline-flex;border:1.5px solid var(--border-default);border-radius:10px;overflow:hidden}.scv-seg button{border:0;border-right:1px solid var(--border-default);background:#fff;padding:0 12px;height:32px;font:600 13.5px var(--font-brand);color:var(--text-strong);cursor:pointer;white-space:nowrap}' +
      '.scv-seg button:last-child{border-right:0}.scv-seg button[aria-checked="true"]{background:var(--color-brand);color:#fff;font-weight:700}.scv-seg button.bloq{background:var(--surface-subtle,#F3F5F8);color:var(--text-muted);cursor:not-allowed}' +
      '.scv-tg{border:1.5px solid var(--border-default);border-radius:8px;background:#fff;height:32px;padding:0 10px;font:600 13.5px var(--font-brand);color:var(--text-strong);cursor:pointer;white-space:nowrap}.scv-tg[aria-pressed="true"]{border-color:var(--color-brand);background:var(--cyan-100);font-weight:700}.scv-tg:disabled{cursor:default;opacity:.7}' +
      '.scv-pasos{display:flex;align-items:stretch;background:#fff;border-bottom:1px solid var(--border-subtle);padding:0 20px;gap:4px}.scv-pasos button{border:0;background:none;padding:8px 14px 7px;cursor:pointer;display:flex;align-items:center;gap:8px;border-bottom:3px solid transparent;font-family:var(--font-brand);text-align:left}' +
      '.scv-pasos button[aria-current="step"]{border-bottom-color:var(--color-brand)}.scv-num{flex:0 0 auto;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--neutral-300,#C9CED6);color:#fff;font-size:12px;font-weight:800}' +
      '.scv-pasos button[aria-current="step"] .scv-num{background:var(--blue-900,#011E41)}.scv-num.ok{background:var(--green-700,#1E7B3C)}.scv-pt{display:flex;flex-direction:column;line-height:1.2}.scv-pt b{font-size:14px;color:var(--text-strong)}.scv-pt small{font-size:12px;font-weight:600;color:var(--text-muted);max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.scv-vista{flex:1 1 auto;min-height:0;display:flex}.scv-col{background:#fff;overflow:auto;padding:14px 18px;min-width:0}.scv-col h3{margin:0 0 8px;font-size:16px;font-weight:700;color:var(--text-strong)}' +
      '.scv-pie{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 20px;background:#fff;border-top:1px solid var(--border-subtle);box-shadow:0 -4px 12px rgba(1,30,65,.06)}.scv-res{flex:1 1 280px;min-width:240px;font-size:14px;color:var(--text-strong)}.scv-res small{display:block;font-size:12.5px;color:var(--text-muted)}.scv-res small.falta{color:#7A4F0E;font-weight:600}' +
      '.scv-in{width:100%;box-sizing:border-box;height:40px;padding:0 10px;border:1.5px solid var(--input-outlined-border,#DADADA);border-radius:var(--radius-sm,8px);background:#fff;font:400 14.5px var(--font-brand);color:var(--text-strong)}.scv-in:focus{border-color:var(--color-brand);outline:none;box-shadow:0 0 0 3px var(--cyan-100)}' +
      'textarea.scv-in{height:auto;padding:8px 10px;resize:vertical;line-height:1.4}.scv-lb{display:block;font-size:13px;font-weight:700;color:var(--text-strong);margin-bottom:4px}.scv-campo{margin-bottom:12px}.scv-nota{font-size:12.5px;color:var(--text-muted)}' +
      '.scv-rap{border:1.5px solid var(--border-default);border-radius:8px;background:#fff;padding:5px 10px;font:600 13px var(--font-brand);color:var(--cyan-700);cursor:pointer}.scv-rap:hover{border-color:var(--color-brand)}' +
      '.scv-zona{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:10px;margin:0 0 12px;border:1px solid var(--border-subtle);background:var(--surface-subtle,#F5F6F8)}.scv-zona.warn{background:var(--color-warning-bg,#FFF4D6);border-color:#E9C46A}' +
      '.scv-sugs{list-style:none;margin:4px 0 0;padding:4px 0;border-radius:8px;box-shadow:0 8px 24px rgba(1,30,65,.18);background:#fff;position:absolute;left:0;right:0;z-index:20;max-height:220px;overflow:auto}.scv-sugs button{width:100%;border:0;background:none;text-align:left;padding:7px 12px;cursor:pointer;font:400 14px var(--font-brand)}.scv-sugs button:hover,.scv-sugs button[aria-selected="true"]{background:var(--cyan-100)}' +
      '.scv-h{flex:1;display:flex;flex-direction:column;min-width:0}.scv-hcab{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 20px 6px}.scv-hcab h3{margin:0;font-size:16px;font-weight:700;color:var(--text-strong)}' +
      '.scv-dia{border:1.5px solid var(--border-default);border-radius:8px;background:#fff;min-width:56px;height:38px;padding:0 6px;cursor:pointer;font:700 13px var(--font-brand);color:var(--text-strong);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1}.scv-dia small{font-weight:500;font-size:11px;color:var(--text-muted)}.scv-dia[aria-pressed="true"]{border-color:var(--color-brand);background:var(--cyan-100)}' +
      '.scv-man{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;padding:8px 20px;background:#fff;border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle)}.scv-man .scv-lb{font-size:12.5px;margin-bottom:3px}' +
      '.scv-err{font-size:13px;font-weight:700;color:var(--color-danger,#B3261E)}.scv-of{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:6px 20px}.scv-of b{font-size:13px;color:var(--text-strong)}' +
      '.scv-ofb{border:1.5px solid var(--border-default);border-radius:999px;background:#fff;padding:4px 12px;font:600 13px var(--font-brand);color:var(--text-strong);cursor:pointer}.scv-ofb[aria-pressed="true"]{border-color:var(--color-brand);background:var(--cyan-100)}' +
      '.scv-panel{margin:4px 20px 6px;padding:10px 12px;border:1.5px solid var(--color-brand);border-radius:12px;background:#fff}.scv-tab{flex:1 1 auto;min-height:0;overflow:auto;padding:4px 20px 10px}' +
      '.scv-esc{display:grid;grid-template-columns:250px 1fr;position:sticky;top:0;z-index:3;background:var(--surface-subtle,#F5F6F8);padding-top:2px}.scv-horas{position:relative;height:18px;margin:0 6px}.scv-horas span{position:absolute;transform:translateX(-50%);font-size:11px;color:var(--text-muted)}' +
      '.scv-gt{display:flex;align-items:center;gap:8px;margin:8px 0 4px;font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.03em}.scv-gt button{border:0;background:none;color:var(--cyan-700);font:700 12.5px var(--font-brand);cursor:pointer;text-transform:none;letter-spacing:0}' +
      '.scv-fi{display:grid;grid-template-columns:250px 1fr;align-items:center;background:#fff;border:1px solid var(--border-subtle);border-radius:10px;margin-bottom:5px;min-height:54px}.scv-fi.sel{border-color:var(--color-brand);box-shadow:0 0 0 1px var(--color-brand) inset}.scv-fi.fuera{background:#FFFDF7}' +
      '.scv-q{padding:6px 10px;border-right:1px solid var(--border-subtle);min-width:0}.scv-q .n{display:flex;justify-content:space-between;gap:6px;font-weight:700;font-size:14px;color:var(--text-strong)}.scv-q .m{font-size:11.5px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.scv-q .m3{display:flex;justify-content:space-between;gap:4px;font-size:11.5px;color:var(--text-muted)}.scv-pri{border:0;background:none;padding:0;color:var(--cyan-700);font:700 11.5px var(--font-brand);cursor:pointer}' +
      '.scv-l{position:relative;height:48px;margin:0 6px;cursor:pointer}.scv-l .fj{position:absolute;top:6px;bottom:6px;background:repeating-linear-gradient(45deg,#eee,#eee 4px,#f8f8f8 4px,#f8f8f8 8px);border-radius:4px}' +
      '.scv-l .pas{position:absolute;top:0;bottom:0;left:0;background:rgba(1,30,65,.07);pointer-events:none}.scv-l .ah{position:absolute;top:0;bottom:0;width:0;border-left:2px solid var(--color-danger,#B3261E);pointer-events:none}' +
      '.scv-l .oc{position:absolute;top:10px;bottom:10px;background:#8FA6BE;border-radius:5px;font-size:10.5px;color:#fff;padding:2px 4px;overflow:hidden;white-space:nowrap}' +
      '.scv-l .el{position:absolute;top:7px;bottom:7px;background:var(--color-brand);border-radius:6px;color:#fff;font-size:11px;font-weight:800;padding:2px 5px;white-space:nowrap;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.2)}' +
      '.scv-l .fa{position:absolute;top:7px;bottom:7px;border:2px dashed var(--color-brand);background:rgba(0,174,239,.12);border-radius:6px;pointer-events:none;font-size:11px;font-weight:700;color:var(--cyan-700);padding:1px 4px;white-space:nowrap;overflow:visible;z-index:2}' +
      '.scv-l .fa.mal{border-color:var(--color-danger,#B3261E);background:rgba(179,38,30,.08);color:var(--color-danger,#B3261E)}.scv-l .gr{position:absolute;top:0;bottom:0;border-left:1px dashed var(--border-subtle)}' +
      '.scv-mot{flex:1 1 260px;min-width:220px}.scv-mot input{width:100%;box-sizing:border-box;height:38px;border:1.5px solid #E9C46A;border-radius:8px;padding:0 10px;background:var(--color-warning-bg,#FFF4D6);font:400 14px var(--font-brand)}' +
      '.scv-aviso{position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:1502;background:var(--blue-900,#011E41);color:#fff;border-radius:10px;padding:9px 14px;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.25);max-width:80%}' +
      '.scv-prev{white-space:pre-line;background:var(--surface-subtle,#F3F5F8);border-radius:12px 12px 12px 4px;padding:12px 14px;font-size:14.5px;line-height:1.5;color:var(--text-strong)}' +
      '.scv button:focus-visible,.scv [role=radio]:focus-visible{outline:2px solid var(--color-brand);outline-offset:1px}' +
      '@media (max-width:1366px){.scv-fi,.scv-esc{grid-template-columns:210px 1fr}}';
    document.head.appendChild(s); };
  const btn = (variant, txt, onClick, o) => { o = o || {}; const B = NS().Button; return B ? h(B, Object.assign({ key: o.key || txt, variant, size: o.size || 'md', onClick, disabled: !!o.disabled }, o.title ? { title: o.title } : {}, o.id ? { id: o.id } : {}), txt) : h('button', { key: o.key || txt, type: 'button', onClick, disabled: !!o.disabled, id: o.id }, txt); };
  const sr = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' };
  const FASES = { Presencial: [['contacto', 'Contacto'], ['lugar', 'Lugar'], ['horario', 'Inspector y horario']], 'Virtual guiada': [['contacto', 'Contacto'], ['horario', 'Inspector y horario']],
    'Autoinspección': [['contacto', 'Contacto'], ['enlace', 'Enlace de autoinspección']], Documental: [['contacto', 'Contacto'], ['documental', 'Revisión documental']], 'No requiere inspección': [['contacto', 'Contacto'], ['nri', 'Motivo']] };
  const fasesDe = (mod) => FASES[mod] || FASES.Presencial;

  function SiriusCoordinar(props) {
    const React = R(), x = props.ctx || {}, p = x.p || {}; ponerCss();
    const pre = x.preset || {};
    const fasesL = fasesDe(p.mod);
    const [fase0, setFase] = React.useState(pre.fase || (x.modo === 'nueva' ? 'contacto' : 'horario'));
    const fase = fasesL.some((f) => f[0] === fase0) ? fase0 : fasesL[0][0];
    const [aviso, setAviso] = React.useState(null), tA = React.useRef(null);
    const avisar = (t) => { setAviso(t); clearTimeout(tA.current); tA.current = setTimeout(() => setAviso(null), 5000); };
    const [lugarVisto, setLugarVisto] = React.useState(x.modo !== 'nueva' || !(p.lugar && p.lugar.origen === 'Solicitud'));
    React.useEffect(() => { if (fase === 'lugar' && !lugarVisto) setLugarVisto(true); }, [fase]);
    const pendRef = React.useRef(null), [, setTick] = React.useState(0); // acción que se ejecuta después de aplicar los cambios (para que Coordinación la vea con los datos al día), una sola vez
    React.useEffect(() => { const a = pendRef.current; if (!a) return; pendRef.current = null; a(); });
    const raiz = React.useRef(null);
    // Enlace de autoinspección: vigencia de 24, 48 o 72 horas (DEC-237); otra vigencia configurada pasa a 48 horas.
    const vigOk = /^(24|48|72) horas$/.test(String(p.validez || ''));
    React.useEffect(() => { if (p.mod === 'Autoinspección' && !vigOk && x.patch) x.patch({ validez: '48 horas' }); }, [p.mod, vigOk]);
    React.useEffect(() => { const b = document.body, o = b.style.overflow; b.style.overflow = 'hidden'; return () => { b.style.overflow = o; }; }, []); // la página de atrás no se desplaza
    // ---------- tiempo ----------
    const hoy = x.hoy, ahoraMin = x.ahoraMin || 0, ult = sumaDias(hoy, 60);
    const dur = (() => { const a = aMin(p.hIni), b = aMin(p.hFin); return a != null && b != null && b > a ? b - a : (x.durDef || 45); })();
    const LG = p.mod === 'Presencial' ? (p.lugar || null) : null, SLm = SL();
    // ---------- inspectores, cobertura y agenda ----------
    const carga = (n, f) => x.slots(n, f, p.visitId).length;
    const gruposDe = (f) => { const L = x.INS || []; if (p.mod === 'Presencial' && SLm && LG) { const G = SLm.grupos(L, x.sucursal, LG, (n) => carga(n, f)); return G; }
      return { zona: [], ciudad: L.map((i, k) => ({ ins: i, c: { nivel: 'todas', por: p.mod === 'Virtual guiada' ? 'Virtual: sin desplazamiento' : 'Sin lugar' }, k: carga(i.n, f), idx: k })).sort((a, b) => a.k - b.k || a.idx - b.idx), fuera: [] }; };
    const valida = (n, f, t, d) => { if (!n || !f || t == null) return ''; const J = x.jornada(n), ji = aMin(J.ini), jf = aMin(J.fin);
      if (f === hoy && t < ahoraMin) return 'La hora ya pasó: hoy son las ' + aHora(ahoraMin) + '.';
      if (J.dias.indexOf(dow(f)) < 0) return n + ' no trabaja el ' + diaTxt(f) + ' (' + J.txt + ').';
      if (t < ji || t + d > jf) return 'Fuera de la jornada de ' + n + ' (' + J.ini + '–' + J.fin + ').';
      const c = x.slots(n, f, p.visitId).find((s) => aMin(s.a) < t + d && t < aMin(s.b)); if (c) return 'Choca con su visita de ' + c.a + ' a ' + c.b + (c.caso ? ' (caso ' + c.caso + ')' : '') + '.';
      return ''; };
    const libreDesde = (n, f, d) => { const J = x.jornada(n); if (J.dias.indexOf(dow(f)) < 0) return null; const ji = aMin(J.ini), jf = aMin(J.fin), oc = x.slots(n, f, p.visitId).map((s) => [aMin(s.a), aMin(s.b)]);
      for (let t = ji; t + d <= jf; t += 15) { if (f === hoy && t < ahoraMin) continue; if (!oc.some((o) => t < o[1] && t + d > o[0])) return t; } return null; };
    // Validación de fecha y hora (la misma del tablero), con lo aplicado.
    const validaFH = (q) => { q = q || p; if (!q.fecha && !q.hIni) return ''; if (!q.fecha) return 'Escribe la fecha (DD/MM/AAAA).';
      if (q.fecha < hoy) return 'La fecha ya pasó.'; if (q.fecha > ult) return 'La fecha debe estar entre hoy y el ' + ddmmaaaa(ult) + '.';
      if (!q.hIni) return 'Escribe la hora de inicio (HH:MM).'; const t = aMin(q.hIni); if (t == null) return 'Hora de inicio no válida (HH:MM).';
      if (q.fecha === hoy && t < ahoraMin) return 'La hora ya pasó: hoy son las ' + aHora(ahoraMin) + '.';
      const f = aMin(q.hFin); if (q.hFin && f == null) return 'Hora de fin no válida (HH:MM).'; if (f != null && f <= t) return 'La hora de fin debe ser posterior a la de inicio.'; if (f != null && f - t < 15) return 'La visita debe durar al menos 15 minutos.';
      return q.inspector ? valida(q.inspector, q.fecha, t, f != null ? f - t : dur) : ''; };
    // ---------- borrador de los campos de fecha y hora (se aplica al salir del grupo, con Enter o al elegir en el calendario o el selector) ----------
    const deP = () => ({ fecha: p.fecha || '', hIni: p.hIni || '', hFin: p.hFin || '', ins: p.inspector || '' });
    const [dr, setDr] = React.useState(deP), drRef = React.useRef(dr); drRef.current = dr;
    const firma = [p.fecha, p.hIni, p.hFin, p.inspector].join('|'), firmaR = React.useRef(firma);
    React.useEffect(() => { if (firmaR.current !== firma) { firmaR.current = firma; setDr(deP()); } }, [firma]);
    const [dia0, setDia] = React.useState(p.fecha && p.fecha >= hoy && p.fecha <= ult ? p.fecha : (pre.dia || hoy)); const dia = dia0;
    const aplicarDr = () => { const d = drRef.current, a = aMin(d.hIni), b = aMin(d.hFin); let hFin = d.hFin;
      if (a != null && (b == null || b <= a) && (!d.hFin || d.hIni !== p.hIni)) hFin = aHora(Math.min(a + dur, 23 * 60 + 59));
      const o = { fecha: d.fecha, hIni: d.hIni, hFin, inspector: d.ins, propAuto: false, hFinAuto: false }; if (d.fecha && d.fecha >= hoy && d.fecha <= ult) setDia(d.fecha);
      if (o.fecha !== p.fecha || o.hIni !== p.hIni || o.hFin !== p.hFin || o.inspector !== p.inspector) x.patch(o); };
    const elegir = (n, f, t, d) => { const o = { fecha: f, hIni: aHora(t), hFin: aHora(t + (d || dur)), inspector: n, propAuto: false, hFinAuto: false }; setDia(f); setDr({ fecha: o.fecha, hIni: o.hIni, hFin: o.hFin, ins: n }); x.patch(o); };
    // ---------- modalidad y vehículos ----------
    const mods = x.mods || [];
    const elegirMod = (m) => { const it = mods.find((y) => y.label === m); if (!it || !it.ok || m === p.mod) return; x.patch({ mod: m, inspector: m === 'Autoinspección' || m === 'No requiere inspección' ? '' : p.inspector }); };
    const toggleVeh = (id) => { const sel = p.riesgos || [], nv = sel.indexOf(id) >= 0 ? sel.filter((y) => y !== id) : sel.concat(id); if (!nv.length) { avisar('La visita necesita al menos un ' + (x.vehNombre === 'Vehículos' ? 'vehículo' : 'riesgo') + '.'); return; }
      const ms = x.modsPara ? x.modsPara(nv) : mods, it = ms.find((y) => y.label === p.mod); const o = { riesgos: nv };
      if (it && !it.ok) { o.mod = 'Presencial'; avisar('La modalidad ' + p.mod + ' quedó bloqueada (' + it.motivo + '): se cambió a Presencial.'); }
      x.patch(o); };
    // ---------- textos de las fases ----------
    const lugarTxt = () => { if (!LG) return 'Sin ubicar'; return SLm ? (LG.punto || LG.zona ? SLm.texto(LG).replace(' · Zona ', ' · zona ') : LG.direccion ? 'Zona por confirmar' : 'Sin ubicar') : LG.direccion; };
    const resumenFase = (f) => { const e = x.errs || {};
      if (f === 'contacto') { const u = (x.intentos || [])[0]; const okC = !['cName', 'cCel', 'cMail'].some((k) => e[k]) && !Object.keys(e).some((k) => /^cp_/.test(k)); return [u ? u.resultado + ' · ' + u.when : (okC ? 'Contacto: ' + (p.cName || '—') : 'Revisa el contacto'), okC && !!u]; }
      if (f === 'lugar') return [lugarTxt() + (LG && LG.origen === 'Solicitud' && !lugarVisto ? ' · de la solicitud, por revisar' : ''), !!(LG && (LG.punto || LG.zona) && String(LG.direccion || '').trim() && lugarVisto)];
      if (f === 'horario') { if (x.oferta) return ['Oferta enviada a ' + x.oferta.inspectores.length, true]; const ok = p.inspector && p.fecha && p.hIni && !validaFH(); return [p.inspector && p.fecha && p.hIni ? diaTxt(p.fecha) + ' · ' + p.hIni + ' · ' + p.inspector.split(' ')[0] : 'Sin elegir', !!ok]; }
      if (f === 'enlace') return ['Por ' + (p.canal || 'WhatsApp') + ' · ' + (p.validez || '48 horas'), false];
      if (f === 'documental') return [p.fecha ? 'Hasta el ' + ddmm(p.fecha) + (p.inspector ? ' · ' + p.inspector.split(' ')[0] : '') : 'Sin fecha', !!(p.fecha && p.inspector)];
      if (f === 'nri') return [p.motivo || 'Sin motivo', !!(p.motivo && String(p.nrObs || '').trim())];
      return ['', false]; };
    const kF = fasesL.findIndex((f) => f[0] === fase), ant = fasesL[kF - 1], sig = fasesL[kF + 1];
    const irFase = (f) => { if (f === fase) return; if (fase === 'horario') aplicarDr(); setFase(f); };
    // ---------- qué falta (pie) ----------
    const errs = x.errs || {}, MSG = x.errMsg || ((k) => errs[k]);
    const contactoFalta = () => { const k = ['cName', 'cCel', 'cMail'].concat(Object.keys(errs).filter((y) => /^cp_/.test(y))).find((y) => errs[y]); return k ? 'Revisa el contacto (fase Contacto): ' + MSG(k) : ''; };
    const fz = x.fuera; // { motivo requerido } si el inspector elegido no cubre el lugar
    const faltaHorario = () => { if (!(p.riesgos || []).length) return 'Elige al menos un ' + (x.vehNombre === 'Vehículos' ? 'vehículo' : 'riesgo') + '.';
      if (p.mod === 'Presencial' && !String(p.dir || '').trim()) return 'Falta la dirección para el inspector (fase Lugar).';
      const c = contactoFalta(); if (c) return c;
      if (!p.inspector || !p.fecha || !p.hIni) return 'Elige inspector y hora (tablero o fecha y hora).';
      const v = validaFH(); if (v) return v;
      if (fz && String(p.fueraMot || '').trim().length < 10) return 'Escribe el motivo de asignar fuera de cobertura (mínimo 10 caracteres).';
      if (x.pideMotivoCx && String(p.motivoCx || '').trim().length < 10) return 'Escribe el motivo del cambio (mínimo 10 caracteres).';
      const k = Object.keys(errs).find((y) => !['fecha', 'hIni', 'hFin', 'fueraMot', 'motivoCx', 'riesgos'].includes(y)); return k ? MSG(k) : ''; };
    const faltaOtra = () => { if (!(p.riesgos || []).length) return 'Elige al menos un ' + (x.vehNombre === 'Vehículos' ? 'vehículo' : 'riesgo') + '.'; const c = contactoFalta(); if (c) return c; const k = Object.keys(errs).find((y) => errs[y] && y !== 'riesgos'); return k ? MSG(k) : ''; };
    // ---------- acciones del pie ----------
    const ejecutar = (fn) => { if (pendRef.current) return; if (fase === 'horario') aplicarDr(); pendRef.current = fn; setTick((k) => k + 1); };
    const agendar = (sigCaso) => ejecutar(() => x.submit({ siguiente: sigCaso }));
    let res = null, secB = null, priB = null, motivos = [];
    if (fase === 'horario' && x.oferta) { const o = x.oferta;
      res = [h('b', { key: 'b' }, 'Oferta enviada a ' + o.inspectores.length + ' inspectores'), ' · del ' + diaTxt(o.desde) + ' al ' + diaTxt(o.hasta), h('small', { key: 's' }, 'Vence ' + (o.venceTxt || 'en ' + o.vigenciaHoras + ' h') + '. El primero que acepta en la app queda agendado y el back-office recibe el aviso.')];
      secB = btn('secondary', 'Anular oferta', () => ejecutar(() => x.anularOferta()), { id: 'scv-anular' }); priB = btn('primary', 'Listo · siguiente caso', () => x.siguiente(), { id: 'scv-principal', title: 'Ctrl+Enter' }); }
    else if (fase === 'horario') { const falta = faltaHorario(), ins = p.inspector, cuando = p.fecha && p.hIni ? diaTxt(p.fecha) + ' · ' + p.hIni + (p.hFin ? '–' + p.hFin : '') : '';
      res = [h('b', { key: 'b' }, ins && cuando ? cuando + ' · ' + ins : (x.modo === 'inspector' ? 'Cambiar inspector' : p.mod)), ' · ' + [p.mod === 'Presencial' ? lugarTxt() : '', x.vehTxt].filter(Boolean).join(' · '), h('small', { key: 's', className: falta ? 'falta' : '' }, falta ? 'Falta: ' + falta : fz ? 'Se agenda con alerta de cobertura.' : x.modo === 'nueva' ? 'Listo para agendar.' : 'Listo para guardar.')];
      if (fz) motivos.push(h('div', { key: 'mf', className: 'scv-mot' }, h('label', { htmlFor: 'scv-fueraMot', style: sr }, 'Motivo de asignar fuera de cobertura'), h('input', { id: 'scv-fueraMot', value: p.fueraMot || '', placeholder: ins + ' no cubre este lugar: escribe el motivo (mínimo 10 caracteres)', onChange: (e) => x.patch({ fueraMot: e.target.value }) })));
      if (x.pideMotivoCx) motivos.push(h('div', { key: 'mc', className: 'scv-mot' }, h('label', { htmlFor: 'scv-motivoCx', style: sr }, 'Motivo del cambio'), h('input', { id: 'scv-motivoCx', value: p.motivoCx || '', placeholder: (x.modo === 'inspector' ? 'Motivo del cambio de inspector' : 'Motivo del cambio de fecha') + ' (mínimo 10 caracteres)', onChange: (e) => x.patch({ motivoCx: e.target.value }) })));
      if (x.modo === 'nueva') { secB = btn('secondary', 'Agendar y siguiente', () => agendar(true), { disabled: !!falta, id: 'scv-agsig' }); priB = btn('primary', 'Agendar visita', () => agendar(false), { disabled: !!falta, id: 'scv-principal', title: 'Ctrl+Enter' }); }
      else priB = btn('primary', x.modo === 'inspector' ? 'Cambiar inspector' : 'Guardar cambios', () => agendar(false), { disabled: !!falta, id: 'scv-principal', title: 'Ctrl+Enter' }); }
    else if (fase === 'enlace' || fase === 'documental' || fase === 'nri') { const falta = faltaOtra(), lab = fase === 'enlace' ? 'Enviar enlace de autoinspección' : fase === 'documental' ? 'Agendar revisión documental' : 'Enviar a calificación';
      res = [h('b', { key: 'b' }, p.mod), ' · ' + x.vehTxt + (fase === 'enlace' ? ' · por ' + (p.canal || 'WhatsApp') : ''), h('small', { key: 's', className: falta ? 'falta' : '' }, falta ? 'Falta: ' + falta : fase === 'enlace' ? 'Revisa el canal y la vista previa.' : 'Listo.')];
      priB = btn('primary', lab, () => ejecutar(() => x.submit({})), { disabled: !!falta, id: 'scv-principal', title: 'Ctrl+Enter' }); }
    else { const u = (x.intentos || [])[0];
      res = [h('b', { key: 'b' }, fase === 'contacto' ? 'Contacto' : 'Lugar'), ' · ' + (fase === 'contacto' ? (u ? u.resultado + ' · ' + u.when : 'Registra el resultado del intento si llamaste') : lugarTxt()), h('small', { key: 's' }, 'Luego: ' + (sig ? sig[1] : '') + '.')];
      priB = btn('primary', 'Siguiente: ' + (sig ? sig[1] : '') + ' →', () => irFase(sig[0]), { id: 'scv-principal', title: 'Ctrl+Enter' }); }
    // ---------- atajos ----------
    const fx = React.useRef({}); fx.current = { fasesL, kF, irFase };
    React.useEffect(() => { const k = (e) => { const F = fx.current; const ae = document.activeElement; if (!raiz.current || (ae && ae !== document.body && !raiz.current.contains(ae) && ae.closest && ae.closest('[role="dialog"]'))) return; // con otra ventana abierta (p. ej. registrar un intento), los atajos son de esa ventana
        if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); const n = Math.max(0, Math.min(F.fasesL.length - 1, F.kF + (e.key === 'ArrowRight' ? 1 : -1))); F.irFase(F.fasesL[n][0]); return; }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); const b = document.getElementById('scv-principal'); if (b && !b.disabled) b.click(); } };
      document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);
    // Escenas: envío automático o panel de oferta abierto.
    const auto = React.useRef(false);
    React.useEffect(() => { if (auto.current || !pre.enviar) return; auto.current = true; setTimeout(() => { const b = document.getElementById(pre.enviar === 'oferta' ? 'scv-oferta-enviar' : 'scv-principal'); if (b && !b.disabled) b.click(); }, 700); }, []);

    // ================= Vistas de las fases =================
    const vContacto = () => { const I = x.intentos || [], A = x.acc || {};
      const campo = (k, lab, o) => { o = o || {}; const err = (x.touched || {})[k] && errs[k]; return h('div', { className: 'scv-campo', key: k }, h('label', { className: 'scv-lb', htmlFor: 'scv-' + k }, lab, o.req ? h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *') : null),
        h('input', { id: 'scv-' + k, className: 'scv-in', value: o.value != null ? o.value : (p[k] || ''), inputMode: o.im, placeholder: o.ph || '', 'aria-invalid': err ? 'true' : undefined, onChange: (e) => x.patch({ [k]: e.target.value }), onBlur: () => x.touch && x.touch(k) }),
        err ? h('span', { role: 'alert', className: 'scv-err', style: { fontWeight: 600 } }, errs[k]) : null); };
      return h('div', { className: 'scv-vista' },
        h('section', { className: 'scv-col', 'aria-label': 'Intentos de contacto', style: { flex: '1 1 0', borderRight: '1px solid var(--border-subtle)' } },
          h('h3', null, 'Intentos de contacto ', h('span', { className: 'scv-nota' }, '(' + I.length + ')')),
          h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', margin: '4px 0 12px' } }, btn('secondary', 'Registrar intento de contacto', A.registrar, { size: 'sm', id: 'scv-intento' }),
            p.mod !== 'Autoinspección' && A.enviarAgenda ? btn('secondary', 'Enviar enlace de autoagendamiento', A.enviarAgenda, { size: 'sm', disabled: !!A.agMotivo, title: A.agMotivo || undefined }) : null,
            A.cancelarCaso ? btn('ghost', 'Cancelar por coordinación', A.cancelarCaso, { size: 'sm' }) : null),
          p.mod === 'Autoinspección' ? h('p', { className: 'scv-nota', style: { margin: '0 0 10px' } }, 'Con Autoinspección no se ofrece el enlace de autoagendamiento: el enlace de autoinspección se envía en la fase siguiente.') : (A.agMotivo ? h('p', { className: 'scv-nota', style: { margin: '0 0 10px' } }, 'Enlace de autoagendamiento: ' + A.agMotivo) : null),
          I.length ? h('ul', { 'data-scv-intentos': '', style: { listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--border-subtle)', borderRadius: 8 } }, I.map((it, k) => h('li', { key: k, style: { padding: '8px 12px', borderTop: k ? '1px solid var(--border-subtle)' : 'none', fontSize: 14 } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8 } }, h('span', null, it.when + ' · ', h('b', null, it.resultado), ' · ' + it.medio), h('span', { className: 'scv-nota' }, it.by)), it.obs && it.obs !== '—' ? h('div', { className: 'scv-nota' }, '«' + it.obs + '»') : null)))
            : h('p', { className: 'scv-nota', style: { margin: 0 } }, 'Aún no hay intentos de contacto registrados.')),
        h('section', { className: 'scv-col', 'aria-label': 'Contacto para la coordinación', style: { flex: '1 1 0', maxWidth: 560 } },
          h('h3', null, 'Contacto para la coordinación'),
          campo('cName', 'Nombre', { req: true }), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' } }, campo('cCel', 'Celular (WhatsApp)', { req: true, im: 'numeric', ph: '09XXXXXXXX' }), campo('cMail', 'Correo electrónico', { im: 'email' })),
          (x.cp || []).map((c) => campo(c.k, c.label, { req: true, ph: c.ph, value: c.value })),
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-obs' }, p.mod === 'Autoinspección' ? 'Indicaciones para el contacto' : 'Observaciones para el inspector'),
            h('textarea', { id: 'scv-obs', className: 'scv-in', rows: 2, value: p.obs || '', placeholder: 'Ej. Llamar antes de llegar; el guardia pide cédula en la entrada.', onChange: (e) => x.patch({ obs: e.target.value }) })))); };

    // ---------- Lugar ----------
    const [q, setQ] = React.useState((LG && LG.direccion) || ''), [sugs, setSugs] = React.useState({ L: [], i: -1, open: false }), [noUb, setNoUb] = React.useState(!!p.lugarNoUbica), seq = React.useRef(0);
    const mapEl = React.useRef(null), mm = React.useRef(null), cur = React.useRef(LG); cur.current = LG;
    const ponerLugar = (nl) => { const l = SLm.calcular(nl); x.patch({ lugar: l, dir: l.direccion, ref: l.referencia, inter: '' }); };
    const usarDir = (d, origen) => { setNoUb(!d.punto); setSugs({ L: [], i: -1, open: false }); const c = d.ciudad || (LG && LG.ciudad) || x.ciudad;
      ponerLugar(Object.assign({}, LG || {}, { direccion: d.texto + (c && SLm.ciudadNombre(c) && d.texto.indexOf(SLm.ciudadNombre(c)) < 0 ? ', ' + SLm.ciudadNombre(c) : ''), ciudad: c, provincia: SLm.provDe(c), punto: d.punto ? d.punto.slice() : null, zona: null, estadoZona: '', lejos: false, origen: origen || 'Búsqueda' })); setQ(d.texto); };
    const buscar = (texto) => { const t = String(texto != null ? texto : q).trim(); if (!t || !U()) return; const k = ++seq.current;
      U().buscar(t, (LG && LG.ciudad) || x.ciudad).then((r) => { if (k !== seq.current) return; if (r.length && r[0].punto) usarDir(r[0], 'Búsqueda'); else { setNoUb(true); setSugs({ L: [], i: -1, open: false }); ponerLugar(Object.assign({}, LG || {}, { direccion: t, punto: null, zona: null, estadoZona: '', origen: 'Búsqueda' })); } }); };
    const sugerir = (t) => { const k = ++seq.current; if (!U() || String(t).trim().length < 3) { setSugs({ L: [], i: -1, open: false }); return; } U().buscar(t, (LG && LG.ciudad) || x.ciudad).then((r) => { if (k === seq.current) setSugs({ L: r, i: -1, open: r.length > 0 }); }); };
    const usarSolicitud = () => { const s = x.lugarSolicitud; if (!s) return; if (s.punto) { setNoUb(false); ponerLugar(Object.assign({}, s, { zona: null, estadoZona: '', origen: 'Solicitud' })); setQ(s.direccion); } else { setQ(s.direccion); ponerLugar(Object.assign({}, s, { origen: 'Solicitud' })); if (s.direccion) buscarSol(s); } };
    const buscarSol = (s) => { if (!U()) return; U().buscar(s.direccion, s.ciudad).then((r) => { if (r.length && r[0].punto) { setNoUb(false); ponerLugar(Object.assign({}, cur.current || s, { punto: r[0].punto.slice(), ciudad: r[0].ciudad || s.ciudad, provincia: SLm.provDe(r[0].ciudad || s.ciudad), zona: null, estadoZona: '', origen: 'Solicitud' })); } else setNoUb(true); }); };
    // Ramos Generales no móvil: el lugar del riesgo sin punto se busca al abrir (G-2c).
    const autoB = React.useRef(false); React.useEffect(() => { if (!autoB.current && p.lugarBuscar && LG && !LG.punto && LG.direccion) { autoB.current = true; x.patch({ lugarBuscar: false }); buscarSol(LG); } }, [p.mod]);
    React.useEffect(() => { if (fase !== 'lugar' || !mapEl.current || !SM() || !W.L) return; const S = Z(), l0 = cur.current || {}, c0 = l0.punto || (S && S.centro(l0.ciudad || x.ciudad)) || [-0.205, -78.49];
      const m = SM().crear(mapEl.current, { centro: c0, zoom: l0.punto ? 13 : 12, notaArriba: true }); mm.current = m; if (!m) return;
      m.map.on('click', (e) => { const l = cur.current || {}; setNoUb(false); ponerLugar(Object.assign({}, l, { ciudad: l.ciudad || x.ciudad, punto: [+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5)], zona: null, estadoZona: '', lejos: false, origen: 'Mapa' })); });
      return () => { m.destruir(); mm.current = null; }; }, [fase]);
    const centroRef = React.useRef('');
    React.useEffect(() => { const m = mm.current, M = SM(), LL = W.L, S = Z(); if (fase !== 'lugar' || !m || !LL) return; m.invalidar(); m.capa.clearLayers(); const l = LG || {}, cod = l.ciudad || x.ciudad, cz = S ? S.publicadasDe(cod) : null;
      if (cz) { M.dibujarZonas(m.capa, cz, { radios: false, color: (y) => S.color(cod, y.id) }); cz.zonas.forEach((y) => { if (y.estado === 'Inactiva') return; LL.marker(y.punto, { icon: M.pin(S.color(cod, y.id), y.nombre, !!(l.zona && l.zona.id === y.id)), interactive: false, keyboard: false, opacity: 0.85 }).addTo(m.capa); }); }
      if (l.punto) { const mk = LL.marker(l.punto, { icon: M.pinCaso(), draggable: true, title: 'Lugar de la inspección · arrastra para ajustarlo', alt: 'Lugar de la inspección', zIndexOffset: 1000 }).addTo(m.capa);
        mk.on('dragend', (e) => { const ll = e.target.getLatLng(), c = cur.current || {}; ponerLugar(Object.assign({}, c, { punto: [+ll.lat.toFixed(5), +ll.lng.toFixed(5)], zona: null, estadoZona: '', lejos: false, origen: 'Mapa' })); }); }
      const k = (l.punto || []).join(',') + '|' + cod; if (centroRef.current !== k) { centroRef.current = k; const c = l.punto || (S && S.centro(cod)); if (c) m.map.setView(c, l.punto ? 13 : 12); } });
    const vLugar = () => { const l = LG || SLm.desdeTexto('', x.ciudad, ''), act = SLm.zonasActivas(l.ciudad), r = SLm.detalle(l), est = SLm.estadoTxt(l), warn = l.estadoZona === 'Por confirmar' || (l.estadoZona === 'Calculada' && l.lejos);
      const provs = SLm.provincias(), ciudades = SLm.ciudadesDe(l.provincia);
      return h('div', { className: 'scv-vista' },
        h('section', { className: 'scv-col', 'aria-label': 'Lugar de la inspección', style: { width: 400, flex: '0 0 400px', borderRight: '1px solid var(--border-subtle)' } },
          h('h3', null, 'Lugar de la inspección'),
          h('div', { className: 'scv-campo', style: { position: 'relative' } }, h('label', { className: 'scv-lb', htmlFor: 'scv-bus' }, 'Buscar la dirección'),
            h('div', { style: { display: 'flex', gap: 6 } }, h('input', { id: 'scv-bus', className: 'scv-in', value: q, autoComplete: 'off', placeholder: 'Escribe la dirección y elige una sugerencia', role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': sugs.open ? 'true' : 'false', 'aria-controls': 'scv-sugs', 'aria-activedescendant': sugs.open && sugs.i >= 0 ? 'scv-sug-' + sugs.i : undefined,
              onChange: (e) => { setQ(e.target.value); sugerir(e.target.value); }, onBlur: () => setTimeout(() => setSugs((s) => Object.assign({}, s, { open: false })), 150),
              onKeyDown: (e) => { const n = sugs.open ? sugs.L.length : 0; if (e.key === 'ArrowDown' && n) { e.preventDefault(); setSugs((s) => Object.assign({}, s, { i: (s.i + 1) % n })); } else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setSugs((s) => Object.assign({}, s, { i: (s.i - 1 + n) % n })); } else if (e.key === 'Enter' && !e.ctrlKey) { e.preventDefault(); if (n && sugs.i >= 0) usarDir(sugs.L[sugs.i], 'Búsqueda'); else buscar(); } else if (e.key === 'Escape' && sugs.open) { e.stopPropagation(); setSugs((s) => Object.assign({}, s, { open: false })); } } }),
              btn('secondary', 'Buscar', () => buscar(), { size: 'sm', id: 'scv-buscar' })),
            sugs.open ? h('ul', { id: 'scv-sugs', role: 'listbox', className: 'scv-sugs', 'aria-label': 'Direcciones sugeridas' }, sugs.L.map((d, k) => h('li', { key: k, role: 'none' }, h('button', { type: 'button', role: 'option', id: 'scv-sug-' + k, tabIndex: -1, 'aria-selected': k === sugs.i ? 'true' : 'false', 'data-scv-sug': d.texto, onMouseDown: (e) => { e.preventDefault(); usarDir(d, 'Búsqueda'); } }, d.texto, h('span', { className: 'scv-nota' }, ' · ' + SLm.ciudadNombre(d.ciudad)))))) : null,
            noUb && !l.punto ? h('div', { role: 'alert', 'data-scv-noubica': '', style: { marginTop: 4, fontSize: 13, fontWeight: 600, color: '#7A4F0E' } }, 'No se pudo ubicar la dirección. Marca el punto en el mapa o elige la zona.') : null),
          h('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 } }, x.lugarSolicitud ? h('button', { type: 'button', className: 'scv-rap', id: 'scv-rsol', onClick: usarSolicitud }, 'Dirección de la solicitud') : null,
            x.lugarAnterior ? h('button', { type: 'button', className: 'scv-rap', id: 'scv-rant', onClick: () => { setNoUb(false); setQ(''); ponerLugar(Object.assign({}, x.lugarAnterior.lugar)); } }, 'Igual que la ' + x.lugarAnterior.id) : null),
          h('div', { className: 'scv-zona' + (warn ? ' warn' : ''), 'data-scv-zona': est },
            h('span', null, h('b', { 'data-scv-zonanom': '', style: { color: 'var(--text-strong)', fontSize: 15 } }, lugarTxt()), h('br'), h('span', { className: 'scv-nota', 'data-scv-estado': est }, est + (r && l.estadoZona === 'Calculada' && r.tipo === 'punto' ? ' · su punto está a ' + Z().fmtKm(r.distanciaKm) + (r.lejos ? ', fuera del radio (' + r.radio + ' km)' : '') : r && r.tipo === 'area' && l.estadoZona === 'Calculada' ? ' · dentro del área dibujada' : ''))),
            act.length ? h('select', { 'aria-label': 'Cambiar la zona', id: 'scv-zona', className: 'scv-in', style: { width: 170, height: 36 }, value: l.estadoZona === 'Confirmada' && l.zona ? l.zona.id : '',
              onChange: (e) => { const z = act.find((y) => y.id === e.target.value); ponerLugar(Object.assign({}, l, z ? { zona: { id: z.id, nombre: z.nombre }, estadoZona: 'Confirmada', lejos: false } : { zona: null, estadoZona: '' })); } },
              [h('option', { key: '', value: '' }, 'Cambiar zona…')].concat(act.map((y) => h('option', { key: y.id, value: y.id }, y.nombre)))) : null),
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-dirins' }, 'Dirección para el inspector ', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, '*')),
            h('textarea', { id: 'scv-dirins', className: 'scv-in', rows: 2, value: l.direccion || '', 'aria-describedby': 'scv-dirins-a', onChange: (e) => ponerLugar(Object.assign({}, l, { direccion: e.target.value })) }), h('span', { id: 'scv-dirins-a', className: 'scv-nota' }, 'Se completa con la búsqueda; puedes ajustarla.')),
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-ref' }, 'Referencia'), h('input', { id: 'scv-ref', className: 'scv-in', value: l.referencia || '', placeholder: 'Edificio, piso, cómo llegar…', onChange: (e) => ponerLugar(Object.assign({}, l, { referencia: e.target.value })) })),
          h('details', { style: { marginBottom: 10 } }, h('summary', { style: { cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'var(--cyan-700)' } }, 'Ciudad: ' + SLm.ciudadNombre(l.ciudad) + (l.provincia ? ' (' + ((provs.find((y) => y.cod === l.provincia) || {}).nombre || '') + ')' : '') + ' · cambiar'),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 } },
              h('select', { 'aria-label': 'Provincia', className: 'scv-in', value: l.provincia, onChange: (e) => { const c = SLm.ciudadesDe(e.target.value)[0]; setQ(''); ponerLugar({ provincia: e.target.value, ciudad: c ? c.cod : '', direccion: '', referencia: l.referencia, punto: null, origen: l.origen }); } }, provs.map((y) => h('option', { key: y.cod, value: y.cod }, y.nombre))),
              h('select', { 'aria-label': 'Ciudad', className: 'scv-in', value: l.ciudad, onChange: (e) => { setQ(''); ponerLugar({ provincia: l.provincia, ciudad: e.target.value, direccion: '', referencia: l.referencia, punto: null, origen: l.origen }); } }, ciudades.map((y) => h('option', { key: y.cod, value: y.cod }, y.nombre))))),
          h('details', null, h('summary', { style: { cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'var(--cyan-700)' } }, 'Contacto en sitio: ' + (p.cName || '—') + ' · ' + (p.cCel || '—') + ' · cambiar'),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 140px', gap: 8, marginTop: 6 } }, h('input', { 'aria-label': 'Nombre del contacto en sitio', className: 'scv-in', value: p.cName || '', onChange: (e) => x.patch({ cName: e.target.value }) }), h('input', { 'aria-label': 'Celular del contacto en sitio', className: 'scv-in', inputMode: 'numeric', value: p.cCel || '', onChange: (e) => x.patch({ cCel: e.target.value }) })))),
        h('section', { 'aria-label': 'Mapa del lugar', style: { flex: '1 1 auto', position: 'relative', background: '#E6ECF1', minWidth: 0 } },
          h('div', { ref: mapEl, role: 'application', 'aria-label': 'Mapa de ' + SLm.ciudadNombre(l.ciudad) + ': haz clic para marcar el lugar o arrastra el punto', style: { position: 'absolute', inset: 0 } }),
          h('div', { style: { position: 'absolute', left: 12, bottom: 22, zIndex: 900, background: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 13, boxShadow: '0 2px 8px rgba(1,30,65,.18)', pointerEvents: 'none' } }, l.punto ? 'Arrastra el punto si la ubicación no es exacta.' : 'Haz clic en el mapa para marcar el lugar.'))); };

    // ---------- Inspector y horario ----------
    const [verFuera, setVerFuera] = React.useState(!!pre.verFuera), [panelOf, setPanelOf] = React.useState(!!pre.panelOferta), [ofB, setOfB] = React.useState(null), [fant, setFant] = React.useState(null);
    const opciones = () => { const G = gruposDe(dia), cands = G.zona.map((y) => [1, y.ins]).concat(G.ciudad.map((y) => [2, y.ins])), out = [];
      for (let k = 0; k <= 60 && out.length < 3; k++) { const f = sumaDias(dia, k); for (let t = T0; t + dur <= T1 && out.length < 3; t += 15) { const u = out[out.length - 1]; if (u && u.f === f && t - u.t < 90) continue;
          const libres = cands.filter((c) => !valida(c[1].n, f, t, dur)).sort((a, b) => a[0] - b[0] || carga(a[1].n, f) - carga(b[1].n, f)); if (libres.length) out.push({ f, t, n: libres[0][1].n }); } } return out; };
    const vHorario = () => { const G = gruposDe(dia), filas = G.zona.map((y) => ({ y, g: 1 })).concat(G.ciudad.map((y) => ({ y, g: 2 })), G.fuera.map((y) => ({ y, g: 3 }))), ops = x.modo === 'inspector' ? [] : opciones(), errFH = validaFH({ fecha: dr.fecha, hIni: dr.hIni, hFin: dr.hFin, inspector: dr.ins });
      const dias = []; for (let k = 0; k < 6; k++) dias.push(sumaDias(hoy, k)); if (dias.indexOf(dia) < 0) dias.push(dia);
      const fijaHora = x.modo === 'inspector';
      const onFH = (k) => (e) => { const v = e.target.value, a = document.activeElement, tecleando = a && a.tagName === 'INPUT' && raiz.current && raiz.current.querySelector('.scv-man') && raiz.current.querySelector('.scv-man').contains(a);
        const nd = Object.assign({}, drRef.current, { [k]: v }); if (k === 'hIni' && aMin(v) != null && aMin(drRef.current.hIni) !== aMin(v)) { const b = aMin(drRef.current.hFin), a0 = aMin(drRef.current.hIni); const d0 = a0 != null && b != null && b > a0 ? b - a0 : dur; nd.hFin = aHora(Math.min(aMin(v) + d0, 23 * 60 + 59)); }
        drRef.current = nd; setDr(nd); if (!tecleando) setTimeout(aplicarDr, 0); };
      const fh = (k, lab, modo, req, mal) => h('div', { key: k }, h('label', { className: 'scv-lb', htmlFor: 'scv-' + k }, lab, req ? h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *') : null),
        SF() ? h(SF(), { id: 'scv-' + k, value: dr[k], onChange: onFH(k), modo, formato: 'iso', min: modo === 'fecha' ? hoy : undefined, max: modo === 'fecha' ? ult : undefined, height: 38, fontSize: 14, width: modo === 'fecha' ? 158 : 110, invalid: mal ? 'true' : undefined, hideError: true, disabled: fijaHora, ariaDescribedby: errFH ? 'scv-fh-err' : undefined }) : null);
      const marcaErr = (re) => !!errFH && re.test(errFH);
      const horas = []; for (let t = T0; t <= T1; t += 60) horas.push(h('span', { key: t, style: { left: ((t - T0) / SPAN * 100) + '%' } }, aHora(t)));
      const tit = { 1: 'Cubren la zona' + (LG && LG.zona ? ' ' + LG.zona.nombre : ''), 2: p.mod === 'Virtual guiada' ? 'Inspectores (virtual)' : p.mod !== 'Presencial' ? 'Inspectores' : (LG && LG.estadoZona === 'Sin zonas' ? 'Cubren la ciudad' : 'Cubren toda la ciudad o la sucursal'), 3: 'Fuera de cobertura' };
      const tabla = [h('div', { key: 'esc', className: 'scv-esc' }, h('span'), h('div', { className: 'scv-horas' }, horas))];
      [1, 2, 3].forEach((g) => { const fs = filas.filter((y) => y.g === g); if (!fs.length) return; const abierto = g < 3 || verFuera || fs.some((y) => y.y.ins.n === p.inspector);
        tabla.push(h('div', { key: 'g' + g, className: 'scv-gt', 'data-scv-grupo': tit[g] }, tit[g] + ' (' + fs.length + ')', g === 3 ? h('button', { type: 'button', id: 'scv-verfuera', 'aria-expanded': abierto ? 'true' : 'false', onClick: () => setVerFuera(!abierto) }, abierto ? 'Ocultar' : 'Mostrar') : null));
        if (!abierto) return;
        fs.forEach(({ y }) => { const i = y.ins, n = i.n, J = x.jornada(n), trab = J.dias.indexOf(dow(dia)) >= 0, ji = aMin(J.ini), jf = aMin(J.fin), ocs = x.slots(n, dia, p.visitId), lib = libreDesde(n, dia, dur), cap = x.capacidad ? x.capacidad(n) : null, sel = p.inspector === n && p.fecha === dia, lin = [];
          for (let t = T0 + 60; t < T1; t += 60) lin.push(h('span', { key: 'gr' + t, className: 'gr', style: { left: ((t - T0) / SPAN * 100) + '%' } }));
          if (!trab) lin.push(h('span', { key: 'fj', className: 'fj', title: 'No trabaja el ' + diaTxt(dia), style: { left: 0, width: '100%' } }));
          else { if (ji > T0) lin.push(h('span', { key: 'fj0', className: 'fj', title: 'Fuera de jornada', style: { left: 0, width: ((ji - T0) / SPAN * 100) + '%' } })); if (jf < T1) lin.push(h('span', { key: 'fj1', className: 'fj', title: 'Fuera de jornada', style: { left: ((jf - T0) / SPAN * 100) + '%', right: 0 } })); }
          if (dia === hoy && ahoraMin > T0) { const am = Math.min(ahoraMin, T1); lin.push(h('span', { key: 'pas', className: 'pas', title: 'Ya pasó', style: { width: ((am - T0) / SPAN * 100) + '%' } })); if (ahoraMin < T1) lin.push(h('span', { key: 'ah', className: 'ah', title: 'Ahora · ' + aHora(ahoraMin), style: { left: ((ahoraMin - T0) / SPAN * 100) + '%' } })); }
          ocs.forEach((s, k) => { const a = Math.max(T0, aMin(s.a)), b = Math.min(T1, aMin(s.b)); if (b <= a) return; lin.push(h('span', { key: 'oc' + k, className: 'oc', title: 'Ocupado ' + s.a + '–' + s.b + (s.caso ? ' · caso ' + s.caso : ''), style: { left: ((a - T0) / SPAN * 100) + '%', width: ((b - a) / SPAN * 100) + '%' } }, s.a + '–' + s.b + (s.caso ? ' · ' + s.caso : ''))); });
          if (sel) { const a = aMin(p.hIni), b = aMin(p.hFin) || a + dur; if (a != null) lin.push(h('span', { key: 'el', className: 'el', 'data-scv-elegido': '', title: p.hIni + '–' + aHora(b), style: { left: ((a - T0) / SPAN * 100) + '%', width: (Math.max(15, b - a) / SPAN * 100) + '%' } }, p.hIni + '–' + aHora(b))); }
          if (fant && fant.n === n) lin.push(h('span', { key: 'fa', className: 'fa' + (fant.err ? ' mal' : ''), style: { left: ((fant.t - T0) / SPAN * 100) + '%', width: (dur / SPAN * 100) + '%' } }, fant.err ? '✕ ' + fant.err : aHora(fant.t) + '–' + aHora(fant.t + dur)));
          const tDe = (e, el) => { const r = el.getBoundingClientRect(); if (fijaHora) return aMin(p.hIni); const t = T0 + Math.round(((e.clientX - r.left) / r.width * SPAN - dur / 2) / 15) * 15; return Math.max(T0, Math.min(T1 - dur, t)); };
          tabla.push(h('div', { key: n, className: 'scv-fi' + (sel ? ' sel' : '') + (y.c && !y.c.nivel ? ' fuera' : ''), 'data-scv-ins': n },
            h('div', { className: 'scv-q' }, h('div', { className: 'n' }, h('span', null, n), h('span', { className: 'scv-chip' + (cap && ocs.length >= cap ? ' warn' : ''), style: { height: 20, fontSize: 11.5, padding: '0 7px' }, title: ocs.length + ' visitas el ' + ddmm(dia) }, cap ? ocs.length + '/' + cap : String(ocs.length))),
              h('div', { className: 'm', title: (i.tipo || '') + ' · ' + (y.c ? (y.c.nivel ? y.c.por : 'No cubre este lugar. ' + (CB() ? CB().resumen(n) : '')) : '') }, (i.tipo || '') + ' · ' + (y.c ? (y.c.nivel ? y.c.por : 'No cubre este lugar') : '')),
              h('div', { className: 'm3' }, h('span', null, trab ? J.ini + '–' + J.fin : 'No trabaja'), lib != null && !fijaHora ? h('button', { type: 'button', className: 'scv-pri', 'data-scv-libre': n, onClick: () => elegir(n, dia, lib) }, 'Libre ' + aHora(lib) + ' →') : h('span', null, fijaHora ? '' : 'Sin espacio'))),
            h('div', { className: 'scv-l', 'aria-label': 'Línea de tiempo de ' + n + ' el ' + diaTxt(dia), role: 'group',
              onMouseMove: (e) => { const t = tDe(e, e.currentTarget); if (t == null) return; const err = valida(n, dia, t, dur); if (!fant || fant.n !== n || fant.t !== t) setFant({ n, t, err }); },
              onMouseLeave: () => setFant(null), onClick: (e) => { const t = tDe(e, e.currentTarget); if (t == null) return; const err = valida(n, dia, t, dur); if (err) { avisar(err); return; } if (fijaHora) { setDr(Object.assign({}, drRef.current, { ins: n })); x.patch({ inspector: n }); } else elegir(n, dia, t); } }, lin))); }); });
      const insOpts = filas.map(({ y, g }) => h('option', { key: y.ins.n, value: y.ins.n }, y.ins.n + (g === 3 ? ' (fuera de cobertura)' : '')));
      const ofBorr = ofB || { ins: Array.isArray(pre.ofertaIns) ? pre.ofertaIns.filter((n) => filas.some((y) => y.y.ins.n === n)) : filas.filter((y) => y.g < 3).map((y) => y.y.ins.n), desde: dia, hasta: sumaDias(dia, 2) > ult ? ult : sumaDias(dia, 2), vig: 2, nota: '' };
      const panel = panelOf ? h('div', { className: 'scv-panel', role: 'group', 'aria-label': 'Enviar oferta a inspectores', 'data-scv-panel-oferta': '' },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' } }, h('b', { style: { color: 'var(--text-strong)' } }, 'Enviar oferta a inspectores'), h('span', { className: 'scv-nota' }, 'El primero que acepta en la app queda agendado y el back-office recibe el aviso.')),
        h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', margin: '6px 0' } }, filas.map(({ y, g }) => h('button', { key: y.ins.n, type: 'button', className: 'scv-tg', style: { height: 28, fontSize: 12.5 }, 'aria-pressed': ofBorr.ins.indexOf(y.ins.n) >= 0 ? 'true' : 'false', title: y.c && y.c.nivel ? y.c.por : 'Fuera de cobertura', onClick: () => { const n = y.ins.n; setOfB(Object.assign({}, ofBorr, { ins: ofBorr.ins.indexOf(n) >= 0 ? ofBorr.ins.filter((z) => z !== n) : ofBorr.ins.concat(n) })); } }, y.ins.n + (g === 3 ? ' · fuera' : '')))),
        h('div', { style: { display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' } },
          h('div', null, h('label', { className: 'scv-lb', htmlFor: 'scv-of-de' }, 'Del'), SF() ? h(SF(), { id: 'scv-of-de', value: ofBorr.desde, onChange: (e) => setOfB(Object.assign({}, ofBorr, { desde: e.target.value })), modo: 'fecha', formato: 'iso', min: hoy, max: ult, height: 36, fontSize: 14, width: 150, hideError: true }) : null),
          h('div', null, h('label', { className: 'scv-lb', htmlFor: 'scv-of-a' }, 'Al'), SF() ? h(SF(), { id: 'scv-of-a', value: ofBorr.hasta, onChange: (e) => setOfB(Object.assign({}, ofBorr, { hasta: e.target.value })), modo: 'fecha', formato: 'iso', min: hoy, max: ult, height: 36, fontSize: 14, width: 150, hideError: true }) : null),
          h('div', null, h('label', { className: 'scv-lb', htmlFor: 'scv-of-v' }, 'Vence en'), h('select', { id: 'scv-of-v', className: 'scv-in', style: { height: 36, width: 90 }, value: ofBorr.vig, onChange: (e) => setOfB(Object.assign({}, ofBorr, { vig: +e.target.value })) }, [1, 2, 4, 8].map((v) => h('option', { key: v, value: v }, v + ' h')))),
          h('div', { style: { flex: '1 1 240px' } }, h('label', { className: 'scv-lb', htmlFor: 'scv-of-n' }, 'Nota para los inspectores'), h('input', { id: 'scv-of-n', className: 'scv-in', style: { height: 36 }, value: ofBorr.nota, placeholder: 'Opcional: el cliente prefiere la tarde…', onChange: (e) => setOfB(Object.assign({}, ofBorr, { nota: e.target.value })) })),
          btn('ghost', 'Cancelar', () => setPanelOf(false), { size: 'sm' }),
          btn('primary', 'Enviar oferta a ' + ofBorr.ins.length, () => { if (!ofBorr.desde || !ofBorr.hasta || ofBorr.desde > ofBorr.hasta) { avisar('Revisa el rango de fechas de la oferta.'); return; } ejecutar(() => { const r = x.ofertar({ inspectores: ofBorr.ins.slice(), desde: ofBorr.desde, hasta: ofBorr.hasta, vigenciaHoras: ofBorr.vig, nota: ofBorr.nota.trim(), minutos: dur }); setPanelOf(false); return r; }); }, { size: 'sm', disabled: !ofBorr.ins.length, id: 'scv-oferta-enviar' })),
        ofBorr.desde && ofBorr.hasta && ofBorr.desde > ofBorr.hasta ? h('div', { className: 'scv-err' }, 'El rango de fechas no es válido.') : null) : null;
      return h('div', { className: 'scv-vista' }, h('section', { className: 'scv-h', 'aria-label': 'Inspector y horario' },
        h('div', { className: 'scv-hcab' }, h('h3', null, 'Inspector y horario'),
          h('div', { role: 'group', 'aria-label': 'Día', style: { display: 'flex', gap: 5, flexWrap: 'wrap' } }, dias.map((f) => h('button', { key: f, type: 'button', className: 'scv-dia', 'aria-pressed': f === dia ? 'true' : 'false', 'data-scv-dia': f, disabled: fijaHora && f !== dia, onClick: () => { setDia(f); if (!fijaHora) { const nd = Object.assign({}, drRef.current, { fecha: f }); drRef.current = nd; setDr(nd); } } }, f === hoy ? 'hoy' : NOMD[dow(f)], h('small', null, ddmm(f))))),
          h('span', { className: 'scv-nota', 'data-scv-dur': String(dur) }, 'Duración: ' + dur + ' min')),
        h('div', { className: 'scv-man', role: 'group', 'aria-label': 'Fecha, hora e inspector', onBlur: (e) => { const g = e.currentTarget; setTimeout(() => { if (!g.isConnected) return; const a = document.activeElement; if (!g.contains(a)) aplicarDr(); }, 0); }, onKeyDown: (e) => { if (e.key === 'Enter' && !e.ctrlKey && /INPUT|SELECT/.test(e.target.tagName)) { e.preventDefault(); aplicarDr(); } } },
          fh('fecha', 'Fecha', 'fecha', true, marcaErr(/fecha/i)), fh('hIni', 'Hora de inicio', 'hora', true, marcaErr(/inicio|ya pasó|jornada|choca|trabaja/i)), fh('hFin', 'Hora de fin', 'hora', false, marcaErr(/fin|durar/i)),
          h('div', null, h('label', { className: 'scv-lb', htmlFor: 'scv-ins' }, 'Inspector', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
            h('select', { id: 'scv-ins', className: 'scv-in', style: { height: 38, minWidth: 220 }, value: dr.ins, onChange: (e) => { const nd = Object.assign({}, drRef.current, { ins: e.target.value }); drRef.current = nd; setDr(nd); setTimeout(aplicarDr, 0); } }, [h('option', { key: '', value: '' }, 'Elige…')].concat(insOpts))),
          fijaHora ? null : btn('secondary', 'Primer libre', () => { const n = drRef.current.ins || p.inspector; if (!n) { avisar('Elige primero el inspector.'); return; } const f0 = drRef.current.fecha && drRef.current.fecha >= hoy ? drRef.current.fecha : dia; for (let k = 0; k <= 60; k++) { const f = sumaDias(f0, k); if (f > ult) break; const t = libreDesde(n, f, dur); if (t != null) { elegir(n, f, t); return; } } avisar('Sin horarios libres en los próximos 60 días.'); }, { size: 'sm', id: 'scv-primer', title: 'El primer horario libre del inspector desde la fecha' }),
          errFH ? h('span', { id: 'scv-fh-err', role: 'alert', className: 'scv-err', 'data-scv-fherr': '' }, errFH) : h('span', { className: 'scv-nota' }, fijaHora ? 'Elige el nuevo inspector en el tablero o en la lista.' : 'o haz clic en un espacio libre del tablero')),
        fijaHora ? null : h('div', { className: 'scv-of' }, h('b', null, 'Ofrecer al cliente:'), ops.length ? ops.map((o, k) => h('button', { key: k, type: 'button', className: 'scv-ofb', 'data-scv-ofrecer': k, 'aria-pressed': p.inspector === o.n && p.fecha === o.f && p.hIni === aHora(o.t) ? 'true' : 'false', onClick: () => elegir(o.n, o.f, o.t) }, (o.f === hoy ? 'hoy' : diaTxt(o.f)) + ' · ' + aHora(o.t) + ' · ' + o.n.split(' ')[0])) : h('span', { className: 'scv-nota' }, 'Sin horarios libres para ofrecer.'),
          x.modo === 'nueva' && x.ofertar && p.mod !== 'Documental' ? h('span', { style: { marginLeft: 'auto' } }, btn('secondary', 'Enviar oferta a inspectores', () => setPanelOf(!panelOf), { size: 'sm', id: 'scv-abrir-oferta' })) : null),
        panel,
        h('div', { className: 'scv-tab', 'data-scv-tablero': '' }, tabla))); };

    // ---------- Enlace de autoinspección ----------
    const vEnlace = () => { const canal = p.canal || 'WhatsApp', vig = p.validez || '48 horas', vh = parseInt(vig, 10) || 48;
      return h('div', { className: 'scv-vista' },
        h('section', { className: 'scv-col', 'aria-label': 'Enlace de autoinspección', style: { flex: '1 1 0', maxWidth: 560, borderRight: '1px solid var(--border-subtle)' } },
          h('h3', null, 'Enlace de autoinspección'), h('p', { className: 'scv-nota', style: { marginTop: 0 } }, 'El cliente toma las fotos con su celular, guiado paso a paso. Su lugar lo confirma en el portal (GPS o dirección).'),
          h('div', { className: 'scv-campo' }, h('span', { className: 'scv-lb' }, (x.vehNombre === 'Vehículos' ? 'Vehículos' : 'Riesgos') + ' incluidos'), h('span', { 'data-scv-vehs': '' }, x.vehTxt)),
          h('div', { className: 'scv-campo', role: 'radiogroup', 'aria-label': 'Enviar por' }, h('span', { className: 'scv-lb' }, 'Enviar por'), h('div', { style: { display: 'flex', gap: 6 } }, ['WhatsApp', 'SMS', 'Correo'].map((c) => { const ok = c === 'Correo' ? !!String(p.cMail || '').trim() : !!String(p.cCel || '').trim();
            return h('button', { key: c, type: 'button', role: 'radio', className: 'scv-tg', 'aria-checked': canal === c ? 'true' : 'false', 'aria-pressed': canal === c ? 'true' : 'false', disabled: !ok, title: ok ? '' : (c === 'Correo' ? 'Sin correo del contacto' : 'Sin celular del contacto'), onClick: () => x.patch({ canal: c }) }, c); }))),
          h('div', { className: 'scv-campo' }, h('span', { className: 'scv-lb' }, 'Enviar a'), h('span', null, (p.cName || 'Contacto') + ' · ' + (canal === 'Correo' ? (p.cMail || 'sin correo') : (p.cCel || 'sin celular')))),
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-vig' }, 'Vigencia'), h('select', { id: 'scv-vig', className: 'scv-in', style: { width: 160 }, value: String(vh), onChange: (e) => x.patch({ validez: e.target.value + ' horas' }) }, [24, 48, 72].map((v) => h('option', { key: v, value: String(v) }, v + ' horas'))))),
        h('section', { className: 'scv-col', 'aria-label': 'Vista previa del mensaje', style: { flex: '1 1 0' } }, h('h3', null, 'Vista previa del mensaje'), h('div', { className: 'scv-prev', 'data-scv-prev': '' }, x.previa ? x.previa(p) : ''))); };
    const vDocumental = () => h('div', { className: 'scv-vista' }, h('section', { className: 'scv-col', style: { flex: '1 1 0', maxWidth: 620 }, 'aria-label': 'Revisión documental' }, h('h3', null, 'Revisión documental'),
      h('p', { className: 'scv-nota', style: { marginTop: 0 } }, 'El inspector revisa los documentos y las fotos del cliente hasta la fecha límite.'),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-dfecha' }, 'Fecha límite de revisión *'), SF() ? h(SF(), { id: 'scv-dfecha', value: p.fecha || '', onChange: (e) => x.patch({ fecha: e.target.value }), modo: 'fecha', formato: 'iso', min: hoy, max: ult, height: 40, width: 180 }) : null),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-dins' }, 'Inspector *'), h('select', { id: 'scv-dins', className: 'scv-in', style: { maxWidth: 320 }, value: p.inspector || '', onChange: (e) => x.patch({ inspector: e.target.value }) }, [h('option', { key: '', value: '' }, 'Elige…')].concat((x.INS || []).map((i) => h('option', { key: i.n, value: i.n }, i.n)))))));
    const vNri = () => h('div', { className: 'scv-vista' }, h('section', { className: 'scv-col', style: { flex: '1 1 0', maxWidth: 620 }, 'aria-label': 'Motivo' }, h('h3', null, 'No requiere inspección'),
      h('p', { className: 'scv-nota', style: { marginTop: 0 } }, 'Los riesgos pasan directamente a calificación, sin informe de inspección.'),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-nmot' }, 'Motivo *'), h('select', { id: 'scv-nmot', className: 'scv-in', value: p.motivo || '', onChange: (e) => x.patch({ motivo: e.target.value }) }, [h('option', { key: '', value: '' }, 'Selecciona el motivo')].concat((x.motivosNR || []).map((m) => h('option', { key: m, value: m }, m))))),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-nobs' }, 'Observación *'), h('textarea', { id: 'scv-nobs', className: 'scv-in', rows: 3, value: p.nrObs || '', placeholder: 'Ej. Factura del concesionario y fotos de entrega revisadas.', onChange: (e) => x.patch({ nrObs: e.target.value }) }))));

    // ================= Cuerpo =================
    const vista = fase === 'contacto' ? vContacto() : fase === 'lugar' ? vLugar() : fase === 'horario' ? vHorario() : fase === 'enlace' ? vEnlace() : fase === 'documental' ? vDocumental() : vNri();
    const cab = h('header', { className: 'scv-cab' }, h('h2', { id: 'scv-t' }, x.titulo), h('span', { className: 'scv-nota', style: { fontSize: 14 } }, 'Caso ' + x.casoId + (x.asegurado ? ' · ' + x.asegurado : '')),
      x.sucursal ? h('span', { className: 'scv-chip' }, 'Sucursal ' + x.sucursal) : null, x.sla ? h('span', { className: 'scv-chip' + (x.slaTono === 'danger' || x.slaTono === 'warning' ? ' warn' : '') }, 'SLA: ' + x.sla) : null);
    const vehs = x.riesgosOpc || [], bloqTxt = (mods.find((y) => y.label === p.mod && !y.ok) || {}).motivo;
    const barra = h('div', { className: 'scv-barra', 'data-scv-barra': '' },
      h('div', { className: 'scv-g' }, h('span', { className: 't', id: 'scv-mod-t' }, 'Modalidad'), h('div', { className: 'scv-seg', role: 'radiogroup', 'aria-labelledby': 'scv-mod-t' },
        mods.map((m) => h('button', { key: m.label, type: 'button', role: 'radio', 'aria-checked': p.mod === m.label ? 'true' : 'false', 'aria-disabled': !m.ok || x.modo !== 'nueva' ? 'true' : undefined, className: m.ok ? '' : 'bloq', 'data-scv-mod': m.label, title: m.ok ? m.hint : 'Bloqueada · ' + m.motivo,
          onClick: () => { if (x.modo !== 'nueva') return; if (!m.ok) { avisar('Bloqueada · ' + m.motivo); return; } elegirMod(m.label); } }, (m.ok ? '' : '🔒 ') + m.label)))),
      h('div', { className: 'scv-g' }, h('span', { className: 't' }, x.vehNombre || 'Vehículos'), vehs.map((v) => h('button', { key: v.id, type: 'button', className: 'scv-tg', 'aria-pressed': (p.riesgos || []).indexOf(v.id) >= 0 ? 'true' : 'false', 'data-scv-veh': v.label, disabled: !x.vehEditable, title: v.sub || v.label, onClick: () => toggleVeh(v.id) }, v.label))),
      bloqTxt ? h('span', { className: 'scv-nota', role: 'note' }, bloqTxt) : null);
    const pasos = h('nav', { className: 'scv-pasos', 'aria-label': 'Fases' }, fasesL.map((f, k) => { const e = resumenFase(f[0]); return h('button', { key: f[0], type: 'button', 'aria-current': fase === f[0] ? 'step' : undefined, 'data-scv-fase': f[0], onClick: () => irFase(f[0]) },
        h('span', { className: 'scv-num' + (e[1] ? ' ok' : '') }, e[1] ? '✓' : String(k + 1)), h('span', { className: 'scv-pt' }, h('b', null, f[1]), h('small', { 'data-scv-resumen': f[0] }, e[0]))); }),
      h('span', { className: 'scv-nota', style: { marginLeft: 'auto', alignSelf: 'center' } }, 'Clic en una fase para ir y volver · Alt+← / Alt+→'));
    const pie = h('footer', { className: 'scv-pie', 'data-scv-pie': '' }, h('div', { className: 'scv-res', 'data-scv-res': '' }, res), motivos,
      h('span', { className: 'scv-nota', style: { whiteSpace: 'nowrap' } }, (kF + 1) + ' de ' + fasesL.length),
      btn('ghost', 'Salir', x.salir, { id: 'scv-salir', title: 'Cierra sin agendar; los intentos registrados se conservan' }),
      ant ? btn('secondary', '← ' + ant[1], () => irFase(ant[0]), { id: 'scv-ant', title: 'Alt+←' }) : null, secB, priB);
    return h('div', { ref: raiz, className: 'scv', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'scv-t', 'data-scv-fase-actual': fase }, cab, barra, pasos, vista, pie,
      aviso ? h('div', { className: 'scv-aviso', role: 'status', 'aria-live': 'polite', 'data-scv-aviso': '' }, aviso) : null);
  }
  W.SiriusCoordinar = SiriusCoordinar;
})();
