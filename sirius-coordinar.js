// SIRIUS · Coordinar visita por fases (v1.1 · etapa G-2c3 · DEC-237 · 18/10/2026; v1.0 en G-2c2). Reemplaza la columna larga de «Coordinar inspección» (maqueta G-1f).
// G-2c3 · fase Contacto como la maqueta: «Llamada» (Llamar a: contacto para la coordinación con «Editar contacto», contacto en sitio u otro número; Llamar/Colgar «vía Genesis»
// con cronómetro y guion; nota del intento y 6 resultados de un clic, teclas 1 a 6; «Cancelar la solicitud…») y, a la derecha, «Intentos de contacto (N)», «Historial del caso»
// y el enlace de autoagendamiento (destacado con N intentos sin respuesta o «Prefiere agendar solo»). Atajos de Contacto fuera de los campos: L llama o cuelga; 1 a 6, el resultado.
// Modo 'contacto': solo la fase Contacto (casos sin riesgos por coordinar).
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
      '.scv-cuerpo{flex:1 1 auto;min-height:0;display:flex;flex-direction:column}.scv-cuerpo.bloq{pointer-events:none;opacity:.5;user-select:none}' +
      '.scv-banda{padding:8px 20px;background:var(--color-danger,#B3261E);color:#fff;font-size:14.5px;font-weight:700}' +
      '.scv-tel{border:1px solid var(--border-subtle);border-radius:12px;padding:8px 12px;margin-bottom:10px}.scv-tel-f{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}' +
      '.scv-numg{font-size:20px;font-weight:800;color:var(--text-strong);letter-spacing:.02em;font-variant-numeric:tabular-nums}.scv-reloj{font-variant-numeric:tabular-nums;font-weight:800;font-size:16px;color:var(--color-danger,#B3261E)}' +
      '.scv-bt{height:36px;padding:0 16px;border-radius:8px;border:1.5px solid transparent;font:700 14px var(--font-brand);cursor:pointer;color:#fff}.scv-bt.verde{background:#1E7B3C;border-color:#1E7B3C}.scv-bt.rojo{background:var(--color-danger,#B3261E);border-color:var(--color-danger,#B3261E)}.scv-bt:disabled{opacity:.45;cursor:not-allowed}' +
      '.scv-bt.borde{background:#fff;color:var(--color-danger,#B3261E);border-color:var(--color-danger,#B3261E);height:34px;font-size:13.5px}.scv-bt.borde:hover{background:#FDECEA}' +
      '.scv-guion{background:var(--surface-subtle,#F3F5F8);border-radius:10px;padding:6px 10px;font-size:13px;line-height:1.4;color:var(--text-strong);margin-top:8px}' +
      '.scv-res6{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:6px 0 10px}.scv-res6 button{border:1.5px solid var(--border-default);border-radius:8px;background:#fff;padding:7px 8px;font:700 13px var(--font-brand);color:var(--text-strong);cursor:pointer;text-align:left;display:flex;align-items:center;gap:6px}.scv-res6 button:hover{border-color:var(--color-brand);background:var(--cyan-100)}.scv-res6 button:disabled{opacity:.5;cursor:not-allowed}' +
      '.scv-kbd{font:700 11px var(--font-brand);border:1px solid var(--border-default);border-bottom-width:2px;border-radius:4px;padding:0 5px;color:var(--text-muted);background:#fff}' +
      '.scv-cto{border:1px solid var(--border-subtle);border-radius:10px;padding:6px 12px;margin:-2px 0 10px;background:var(--surface-subtle,#F7F8FA)}.scv-cto dl{margin:2px 0 0;display:grid;grid-template-columns:repeat(3,minmax(0,auto));gap:0 16px;font-size:13.5px}.scv-cto dt{font-size:12px;color:var(--text-muted)}.scv-cto dd{margin:0;font-weight:600;color:var(--text-strong);overflow-wrap:anywhere}' +
      '.scv-otro{display:grid;grid-template-columns:130px 1fr 150px;gap:6px;margin-top:6px}.scv-otro .scv-in{height:36px}' +
      '.scv-canc{border:1.5px solid var(--color-danger,#B3261E);border-radius:12px;padding:10px 12px;margin-top:4px}.scv-canc b{color:var(--color-danger,#B3261E)}' +
      '.scv-ints{list-style:none;margin:6px 0 12px;padding:0;font-size:13.5px}.scv-ints li{display:flex;flex-direction:column;gap:1px;padding:6px 0;border-bottom:1px solid var(--border-subtle)}.scv-ints .r1{display:flex;justify-content:space-between;gap:8px}.scv-ints li.canc b{color:var(--color-danger,#B3261E)}' +
      '.scv-enl{border:1px solid var(--border-subtle);border-radius:12px;padding:10px 12px}.scv-enl.sug{border-color:#E9C46A;background:var(--color-warning-bg,#FFF4D6)}.scv-enl .warn{color:#7A4F0E;font-weight:700}' +
      '.scv-hist{position:absolute;top:0;right:0;bottom:0;width:440px;max-width:92vw;z-index:30;background:#fff;box-shadow:-8px 0 24px rgba(1,30,65,.18);display:flex;flex-direction:column}.scv-hist-c{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border-subtle)}.scv-hist-c h3{margin:0;font-size:16px;color:var(--text-strong)}' +
      '.scv-hist-f{display:flex;gap:5px;flex-wrap:wrap;padding:8px 16px}.scv-hist-l{list-style:none;margin:0;padding:0 16px 16px;overflow:auto;flex:1 1 auto;font-size:13.5px}.scv-hist-l li{padding:7px 0;border-bottom:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:2px}' +
      '.scv-x{border:1px solid var(--border-default);background:#fff;border-radius:8px;width:32px;height:32px;cursor:pointer;font-weight:800;color:var(--text-muted)}' +
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
    const fasesL = x.modo === 'contacto' ? [['contacto', 'Contacto']] : fasesDe(p.mod); // G-2c3: modo 'contacto' (sin riesgos por coordinar), solo la fase Contacto
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
    // ---------- Contacto (G-2c3 · DEC-237): llamada, resultado, cancelación, enlace de autoagendamiento e historial del caso ----------
    const RESULTADOS = ['Contestó', 'No contestó', 'Buzón de voz', 'Número equivocado', 'Pidió llamar luego', 'Prefiere agendar solo'];
    const SIN_RESP = ['No contestó', 'No contesta', 'Buzón de voz', 'Número equivocado']; // intentos sin respuesta (No contesta: el resultado anterior a G-2c3)
    const numOk = (n) => /^0\d{9}$/.test(String(n || '').replace(/\s/g, ''));
    const D0 = Object.assign({ tipo: 'coordinacion', nombre: '', numero: '', relacion: '' }, p.dest || {});
    const destDe = (d) => d.tipo === 'sitio' ? { tipo: 'sitio', nombre: p.sNom || '', numero: String(p.sCel || '').replace(/\s/g, ''), relacion: '' }
      : d.tipo === 'otro' ? { tipo: 'otro', nombre: String(d.nombre || '').trim(), numero: String(d.numero || '').replace(/\D/g, ''), relacion: String(d.relacion || '').trim() }
      : { tipo: 'coordinacion', nombre: p.cName || '', numero: String(p.cCel || '').replace(/\s/g, ''), relacion: '' };
    const dest = destDe(D0), destOk = numOk(dest.numero);
    const relTxt = (d) => d.tipo === 'sitio' ? 'contacto en sitio' : d.tipo === 'otro' ? (d.relacion || 'otro número') : 'contacto para la coordinación';
    const [llamada, setLlamada] = React.useState(null), [, setSeg] = React.useState(0);
    React.useEffect(() => { if (!llamada) return undefined; const k = setInterval(() => setSeg((n) => n + 1), 500); return () => clearInterval(k); }, [llamada]);
    const segs = llamada ? Math.max(0, Math.floor((Date.now() - llamada.ini) / 1000)) : 0, mmss = (s) => z2(Math.floor(s / 60)) + ':' + z2(s % 60);
    const [nota, setNota] = React.useState(''), [ultRes, setUltRes] = React.useState(null), [numT, setNumT] = React.useState(false), [editC, setEditC] = React.useState(false);
    const [canc, setCanc] = React.useState(null), [hist, setHist] = React.useState(false), [hFil, setHFil] = React.useState('Todo'), [canalAG, setCanalAG] = React.useState(null), [agEnv, setAgEnv] = React.useState(false);
    const cancelado = x.cancelado || null, histDe = React.useRef(null), cuerpo = React.useRef(null);
    React.useEffect(() => { if (cuerpo.current) cuerpo.current.inert = !!cancelado; }, [!!cancelado]); // caso cancelado: el resto de la pantalla no se puede usar
    const abrirHist = () => { histDe.current = document.activeElement; setHist(true); };
    const cerrarHist = () => { setHist(false); const a = histDe.current; setTimeout(() => { if (a && a.isConnected && a.focus) a.focus(); }, 0); };
    React.useEffect(() => { if (hist) { const b = document.getElementById('scv-hist-cerrar'); if (b) b.focus(); } }, [hist]);
    const llamar = () => { if (cancelado) return; if (!destOk) { setNumT(true); avisar('Revisa el celular: debe tener 10 dígitos y empezar con 0.'); return; } setLlamada({ ini: Date.now() - (pre.llamarHace || 0) * 1000 }); };
    const colgar = () => setLlamada(null);
    const registrar = (r) => { if (cancelado || !x.registrarIntento) return; if (!destOk) { setNumT(true); avisar('Revisa el celular: debe tener 10 dígitos y empezar con 0.'); return; }
      const seg = llamada ? Math.max(0, Math.round((Date.now() - llamada.ini) / 1000)) : 0, n0 = nota.trim(), d = dest;
      const pr = x.registrarIntento({ resultado: r, obs: n0, destino: { tipo: d.tipo, nombre: d.nombre, numero: d.numero, relacion: d.tipo === 'otro' ? d.relacion : '' }, duracionSeg: seg });
      setNota(''); setUltRes(r); if (llamada && r !== 'Contestó') setLlamada(null); // un resultado distinto de «Contestó» cuelga la llamada
      avisar('Registrado: ' + r + '. Queda en los intentos y en el historial del caso.');
      if (pr && pr.then) pr.then((q) => { if (q && q.ok === false) { setNota(n0); setUltRes(null); avisar(q.mensaje || 'No se pudo registrar el intento.'); } }); };
    const confirmarCanc = () => { if (!canc) return; const m = canc.motivo, d = String(canc.detalle || '').trim(); if (!m || d.length < 10 || !x.cancelar) return; setLlamada(null);
      const pr = x.cancelar(m, d); setCanc(null); avisar('La solicitud quedó Cancelada. Se avisó a quien la solicitó.');
      if (pr && pr.then) pr.then((q) => { if (q && q.ok === false) { setCanc({ motivo: m, detalle: d }); avisar(q.mensaje || 'No se pudo cancelar la solicitud.'); } }); };
    const AGx = x.autoagenda || {}, canalesAG = AGx.canales || [{ canal: 'WhatsApp', ok: true }, { canal: 'SMS', ok: true }, { canal: 'Correo', ok: !!String(p.cMail || '').trim() }];
    const canal = canalAG || (canalesAG.find((y) => y.ok) || { canal: 'WhatsApp' }).canal;
    const sinResp = (x.intentos || []).filter((i) => SIN_RESP.indexOf(i.resultado) >= 0).length, maxI = x.maxIntentos || 3;
    const prefiere = ultRes === 'Prefiere agendar solo' || (x.intentos || []).some((i) => i.resultado === 'Prefiere agendar solo');
    const agSug = !AGx.motivo && !agEnv && (sinResp >= maxI || prefiere);
    const enviarAG = () => { if (AGx.motivo || !x.enviarAutoagenda) return; if (canal !== 'Correo' && !destOk) { setNumT(true); avisar('Revisa el celular del destinatario: 10 dígitos y empieza con 0.'); return; }
      const d = canal === 'Correo' ? { tipo: 'coordinacion', nombre: p.cName || '', correo: String(p.cMail || '').trim() } : { tipo: dest.tipo, nombre: dest.nombre, numero: dest.numero };
      if (dest.tipo === 'otro' && canal !== 'Correo') d.relacion = dest.relacion;
      const pr = Promise.resolve(x.enviarAutoagenda({ canal, destinatario: d })); setAgEnv({ txt: 'por ' + canal + ' a ' + (d.nombre || 'el contacto') + (d.tipo === 'otro' ? ' (' + (d.relacion || 'otro número') + ')' : d.tipo === 'sitio' ? ' (contacto en sitio)' : '') + ' · ' + (d.numero || d.correo || '') + ' · ahora' }); avisar('Enlace de autoagendamiento enviado por ' + canal + ' a ' + (d.nombre || 'el contacto') + '. Queda en el historial del caso.');
      pr.then((q) => { if (q && q.ok === false) { setAgEnv(false); avisar(q.mensaje || 'No se pudo enviar el enlace.'); } }); };
    // Escenas (G-2c3): pasos de la fase Contacto que se ejecutan solos (llamar, nota, resultado, otro número, editar el contacto, enlace y cancelación).
    const esc = React.useRef(false), escF = React.useRef({}); escF.current = { registrar, enviarAG, confirmarCanc, setNota, abrirHist, setEditC, setNumT, setCanc, llamar };
    React.useEffect(() => { const E = pre.contacto; if (esc.current || !E) return; esc.current = true; const F = () => escF.current;
      if (E.llamar) setTimeout(() => F().llamar(), 150);
      if (E.nota) setTimeout(() => F().setNota(E.nota), 250);
      if (E.numT) F().setNumT(true);
      if (E.editar) { F().setEditC(true); if (E.editar.cCel) setTimeout(() => x.patch({ cCel: E.editar.cCel }), 300); if (E.editar.cerrar) setTimeout(() => F().setEditC(false), 900); }
      if (E.cancelar) F().setCanc({ motivo: E.cancelar.motivo || '', detalle: E.cancelar.detalle || '' });
      if (E.resultado) setTimeout(() => F().registrar(E.resultado), 700);
      if (E.enviarEnlace) setTimeout(() => F().enviarAG(), 700);
      if (E.cancelar && E.cancelar.confirmar) setTimeout(() => F().confirmarCanc(), 800);
      if (E.historial) setTimeout(() => F().abrirHist(), 1100); }, []);
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
      if (f === 'contacto') { const u = (x.intentos || [])[0]; const okC = !['cName', 'cCel', 'cMail'].some((k) => e[k]) && !Object.keys(e).some((k) => /^cp_/.test(k)); if (cancelado) return ['Solicitud cancelada', true]; return [ultRes ? ultRes + ' · ahora' : u ? 'Último: ' + u.resultado + ' · ' + u.when : (okC ? 'Sin registrar' : 'Revisa el contacto'), okC && !!ultRes]; } // G-2c3: ✓ con el resultado registrado aquí
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
    const faltaOtra = () => { if (!(p.riesgos || []).length) return 'Elige al menos un ' + (x.vehNombre === 'Vehículos' ? 'vehículo' : 'riesgo') + '.'; const c = contactoFalta(); if (c) return c;
      if (fase === 'enlace' && (p.canal || 'WhatsApp') !== 'Correo' && !numOk((p.dest && p.dest.tipo === 'otro' ? p.dest.numero : p.dest && p.dest.tipo === 'sitio' ? p.sCel : p.cCel))) return 'Revisa el celular del destinatario (10 dígitos que empiezan con 0).'; const k = Object.keys(errs).find((y) => errs[y] && y !== 'riesgos'); return k ? MSG(k) : ''; };
    // ---------- acciones del pie ----------
    const ejecutar = (fn) => { if (pendRef.current) return; if (fase === 'horario') aplicarDr(); pendRef.current = fn; setTick((k) => k + 1); };
    const agendar = (sigCaso) => ejecutar(() => x.submit({ siguiente: sigCaso }));
    let res = null, secB = null, priB = null, motivos = [];
    if (cancelado) { res = [h('b', { key: 'b', style: { color: 'var(--color-danger,#B3261E)' } }, 'Caso cancelado'), ' · ' + cancelado.motivo, h('small', { key: 's' }, 'Se avisó a quien la solicitó. Ya no se puede coordinar este caso.')];
      priB = btn('primary', 'Siguiente caso', () => x.siguiente && x.siguiente(), { id: 'scv-principal', title: 'Ctrl+Enter' }); } // G-2c3 · DEC-237
    else if (fase === 'horario' && x.oferta) { const o = x.oferta;
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
    else { const u = (x.intentos || [])[0], sinC = fase === 'contacto' && !!ultRes && ultRes !== 'Contestó';
      res = [h('b', { key: 'b' }, fase === 'contacto' ? 'Contacto' : 'Lugar'), ' · ' + (fase === 'contacto' ? (ultRes || (u ? u.resultado + ' · ' + u.when : 'Registra el resultado del intento')) : lugarTxt()),
        h('small', { key: 's' }, sinC ? 'Sin contacto: puedes pasar al siguiente caso o continuar igual.' : sig ? 'Luego: ' + sig[1] + '.' : 'Los intentos quedan en el caso y en su historial.')];
      if (sinC && x.siguiente) secB = btn('secondary', 'Siguiente caso', () => x.siguiente(), { id: 'scv-sigcaso' }); // G-2c3: sin contacto, como la maqueta
      priB = sig ? btn('primary', 'Siguiente: ' + sig[1] + ' →', () => irFase(sig[0]), { id: 'scv-principal', title: 'Ctrl+Enter' }) : btn('primary', 'Listo', x.salir, { id: 'scv-principal', title: 'Ctrl+Enter' }); }
    // ---------- atajos ----------
    const fx = React.useRef({}); fx.current = { fasesL, kF, irFase, fase, hist, cerrarHist, cancelado: !!cancelado, registrar, alternar: () => (llamada ? colgar() : llamar()) };
    React.useEffect(() => { const esc = (e) => { if (e.key === 'Escape' && fx.current.hist) { e.preventDefault(); e.stopPropagation(); fx.current.cerrarHist(); } }; document.addEventListener('keydown', esc, true); return () => document.removeEventListener('keydown', esc, true); }, []); // Esc cierra el historial
    React.useEffect(() => { const k = (e) => { const F = fx.current; const ae = document.activeElement; if (!raiz.current || (ae && ae !== document.body && !raiz.current.contains(ae) && ae.closest && ae.closest('[role="dialog"]'))) return; // con otra ventana abierta (p. ej. registrar un intento), los atajos son de esa ventana
        if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); if (F.cancelado) return; const n = Math.max(0, Math.min(F.fasesL.length - 1, F.kF + (e.key === 'ArrowRight' ? 1 : -1))); F.irFase(F.fasesL[n][0]); return; }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); const b = document.getElementById('scv-principal'); if (b && !b.disabled) b.click(); return; }
        // G-2c3: en la fase Contacto y fuera de los campos, L llama o cuelga y 1 a 6 registran el resultado.
        const a2 = document.activeElement, enCampo = !!a2 && (/^(INPUT|TEXTAREA|SELECT)$/.test(a2.tagName) || a2.isContentEditable);
        if (F.fase !== 'contacto' || F.cancelado || F.hist || enCampo || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return; const kk = String(e.key || '').toLowerCase();
        if (kk === 'l') { e.preventDefault(); F.alternar(); } else if (/^[1-6]$/.test(kk)) { e.preventDefault(); F.registrar(['Contestó', 'No contestó', 'Buzón de voz', 'Número equivocado', 'Pidió llamar luego', 'Prefiere agendar solo'][+kk - 1]); } };
      document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);
    // Escenas: envío automático o panel de oferta abierto.
    const auto = React.useRef(false);
    React.useEffect(() => { if (auto.current || !pre.enviar) return; auto.current = true; setTimeout(() => { const b = document.getElementById(pre.enviar === 'oferta' ? 'scv-oferta-enviar' : 'scv-principal'); if (b && !b.disabled) b.click(); }, 700); }, []);

    // ================= Vistas de las fases =================
    const vContacto = () => { const I = x.intentos || [], cp = x.cp || [], cancOk = !!x.cancelar && x.puedeCancelar !== false;
      const campo = (k, lab, o) => { o = o || {}; const err = (x.touched || {})[k] && errs[k]; return h('div', { className: 'scv-campo', key: k, style: { marginBottom: 8 } }, h('label', { className: 'scv-lb', htmlFor: 'scv-' + k }, lab, o.req ? h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *') : null),
        h('input', { id: 'scv-' + k, className: 'scv-in', style: { height: 36 }, value: o.value != null ? o.value : (p[k] || ''), inputMode: o.im, placeholder: o.ph || '', 'aria-invalid': err ? 'true' : undefined, onChange: (e) => x.patch({ [k]: e.target.value }), onBlur: () => x.touch && x.touch(k) }),
        err ? h('span', { role: 'alert', className: 'scv-err', style: { fontWeight: 600 } }, errs[k]) : null); };
      // «Llamar a» y «Enviar a»: contacto para la coordinación, contacto en sitio u otro número (celular de 10 dígitos que empieza con 0, nombre y relación; no se guarda como contacto del caso).
      const selDest = (id, lab) => { const malN = D0.tipo === 'otro' && numT && !numOk(D0.numero), setD = (o) => x.patch({ dest: Object.assign({}, D0, o) });
        return h('div', { className: 'scv-campo', style: { marginBottom: 8 } }, h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } }, h('label', { className: 'scv-lb', htmlFor: id, style: { margin: 0, whiteSpace: 'nowrap' } }, lab),
          h('select', { id, className: 'scv-in', style: { height: 36, flex: '1 1 auto', minWidth: 0 }, value: D0.tipo, 'data-scv-destino': D0.tipo, onChange: (e) => { setNumT(false); setD({ tipo: e.target.value }); } },
            h('option', { value: 'coordinacion' }, 'Contacto para la coordinación · ' + (p.cName || 'sin nombre') + ' · ' + (p.cCel || 'sin celular')),
            h('option', { value: 'sitio' }, 'Contacto en sitio · ' + (p.sNom || 'sin nombre') + ' · ' + (p.sCel || 'sin celular')),
            h('option', { value: 'otro' }, 'Otro número…'))),
          D0.tipo === 'otro' ? h('div', { className: 'scv-otro' },
            h('input', { id: id + '-num', className: 'scv-in', 'aria-label': 'Celular del otro número', inputMode: 'numeric', maxLength: 10, placeholder: 'Celular (09…)', value: D0.numero || '', 'aria-invalid': malN ? 'true' : undefined, 'aria-describedby': malN ? id + '-err' : undefined, onChange: (e) => setD({ numero: e.target.value.replace(/\D/g, '').slice(0, 10) }), onBlur: () => setNumT(true) }),
            h('input', { id: id + '-nom', className: 'scv-in', 'aria-label': 'Nombre de la persona', placeholder: 'Nombre', value: D0.nombre || '', onChange: (e) => setD({ nombre: e.target.value }) }),
            h('input', { id: id + '-rel', className: 'scv-in', 'aria-label': 'Relación con el cliente', placeholder: 'Relación (chofer, hijo…)', value: D0.relacion || '', onChange: (e) => setD({ relacion: e.target.value }) })) : null,
          malN ? h('span', { id: id + '-err', role: 'alert', className: 'scv-err', 'data-scv-numerr': '' }, 'El celular debe tener 10 dígitos y empezar con 0.') : D0.tipo === 'otro' ? h('span', { className: 'scv-nota' }, 'No se guarda como contacto del caso.') : null); };
      const guion = p.mod === 'Autoinspección' ? '¿Le puedo enviar un enlace para que haga la autoinspección desde su celular?' : p.mod === 'Virtual guiada' ? '¿Qué día y a qué hora le queda mejor la videollamada con el inspector?' : '¿En qué dirección y en qué horario le queda mejor la visita del inspector?';
      const ctoErr = ['cName', 'cCel', 'cMail'].concat(cp.map((c) => c.k)).some((k) => errs[k]);
      const cto = h('div', { className: 'scv-cto', 'data-scv-cto': '' }, h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } }, h('b', { style: { fontSize: 13.5, color: 'var(--text-strong)' } }, 'Contacto para la coordinación'),
          editC ? null : h('button', { type: 'button', className: 'scv-rap', id: 'scv-editar-cto', style: { padding: '3px 10px' }, onClick: () => setEditC(true) }, 'Editar contacto')),
        editC ? h('div', { role: 'group', 'aria-label': 'Editar el contacto para la coordinación', style: { marginTop: 6 } }, campo('cName', 'Nombre', { req: true }),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' } }, campo('cCel', 'Celular (WhatsApp)', { req: true, im: 'numeric', ph: '09XXXXXXXX' }), campo('cMail', 'Correo electrónico', { im: 'email' })),
            cp.map((c) => campo(c.k, c.label, { req: true, ph: c.ph, value: c.value })),
            h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, btn('secondary', 'Listo', () => { ['cName', 'cCel', 'cMail'].concat(cp.map((c) => c.k)).forEach((k) => x.touch && x.touch(k)); if (!ctoErr) setEditC(false); }, { size: 'sm', id: 'scv-cto-listo' }),
              h('span', { className: 'scv-nota' }, 'Se guarda con la visita, como antes.')))
          : h('dl', null, h('div', null, h('dt', null, 'Nombre'), h('dd', { 'data-scv-cto-nom': '' }, p.cName || '—')), h('div', null, h('dt', null, 'Celular (WhatsApp)'), h('dd', { 'data-scv-cto-cel': '' }, p.cCel || '—')), h('div', null, h('dt', null, 'Correo'), h('dd', null, p.cMail || '—'))),
        !editC && ctoErr ? h('div', { className: 'scv-err', role: 'alert' }, contactoFalta()) : null);
      const ints = (cancelado ? [h('li', { key: 'canc', className: 'canc', 'data-scv-int-canc': '' }, h('span', { className: 'r1' }, h('span', null, (cancelado.when || 'Ahora') + ' · ', h('b', null, 'Solicitud cancelada · ' + cancelado.motivo)), h('span', { className: 'scv-nota' }, cancelado.by || '')), cancelado.obs ? h('span', { className: 'scv-nota', style: { color: 'var(--text-body)' } }, '«' + cancelado.obs + '»') : null)] : [])
        .concat(I.map((it, k) => h('li', { key: k, 'data-scv-int': it.resultado }, h('span', { className: 'r1' }, h('span', null, it.when + ' · ', h('b', null, it.resultado), it.dur ? h('span', { className: 'scv-nota' }, ' · ' + it.dur) : null, it.destino ? null : h('span', { className: 'scv-nota' }, ' · ' + (it.medio || ''))), h('span', { className: 'scv-nota' }, it.by)),
          it.destino ? h('span', { className: 'scv-nota', 'data-scv-int-a': '' }, 'A ' + it.destino) : null, it.obs && it.obs !== '—' ? h('span', { className: 'scv-nota', style: { color: 'var(--text-body)' } }, '«' + it.obs + '»') : null)));
      const enlace = p.mod === 'Autoinspección' ? h('div', { className: 'scv-enl', 'data-scv-enlace': 'autoinspeccion' }, h('b', { style: { color: 'var(--text-strong)' } }, 'Autoinspección'), h('div', { className: 'scv-nota' }, 'El enlace de autoinspección se envía en la fase siguiente. No aplica el autoagendamiento.'))
        : h('div', { className: 'scv-enl' + (agSug ? ' sug' : ''), 'data-scv-enlace': 'autoagenda', 'data-scv-sugerido': agSug ? '1' : '0', role: 'group', 'aria-label': 'Enlace de autoagendamiento' }, h('b', { style: { color: 'var(--text-strong)' } }, 'Enlace de autoagendamiento'),
          AGx.motivo ? h('div', { className: 'scv-nota' }, 'No disponible: ' + AGx.motivo) : agSug ? h('div', { className: 'scv-nota warn', role: 'note' }, sinResp >= maxI ? sinResp + ' intentos sin respuesta: envía el enlace para que agende solo.' : 'Prefiere agendar solo: envía el enlace.') : h('div', { className: 'scv-nota' }, 'La persona elige el lugar y el horario en el portal.'),
          h('div', { role: 'radiogroup', 'aria-label': 'Canal del enlace', style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', margin: '6px 0' } }, canalesAG.map((c) => h('button', { key: c.canal, type: 'button', role: 'radio', className: 'scv-tg', style: { height: 30 }, 'aria-checked': canal === c.canal ? 'true' : 'false', 'aria-pressed': canal === c.canal ? 'true' : 'false', disabled: !c.ok || !!AGx.motivo, title: c.ok ? '' : (c.porque || 'Sin consentimiento o sin el dato de contacto'), onClick: () => setCanalAG(c.canal) }, c.canal)),
            h('span', { className: 'scv-chip', title: 'Central telefónica, WhatsApp y SMS (conexión por API en producción)' }, 'vía Genesis')),
          canal === 'Correo' ? h('div', { className: 'scv-campo', style: { marginBottom: 8 } }, h('span', { className: 'scv-lb' }, 'Enviar a'), h('span', null, (p.cName || 'Contacto') + ' · ' + (String(p.cMail || '').trim() || 'sin correo'))) : selDest('scv-enviara', 'Enviar a'),
          agEnv || AGx.estado ? h('div', { className: 'scv-nota', 'data-scv-ag-estado': '', role: 'status', style: { marginBottom: 6 } }, h('span', { className: 'scv-chip ok', style: { height: 22, fontSize: 12 } }, 'Enviado'), ' ' + (agEnv ? agEnv.txt : AGx.estado)) : null,
          btn(agSug ? 'primary' : 'secondary', agEnv || AGx.estado ? 'Enviar de nuevo' : 'Enviar enlace de autoagendamiento', enviarAG, { size: 'sm', id: 'scv-enviar-ag', disabled: !!AGx.motivo || !!cancelado, title: AGx.motivo || undefined }));
      return h('div', { className: 'scv-vista' },
        h('section', { className: 'scv-col', 'aria-label': 'Llamada', style: { flex: '1 1 0', maxWidth: 600, borderRight: '1px solid var(--border-subtle)' } },
          h('h3', null, 'Llamada'), selDest('scv-llamar', 'Llamar a'), (D0.tipo === 'coordinacion' && !llamada) || editC ? cto : null, // durante la llamada, el número y el nombre ya están en el recuadro
          h('div', { className: 'scv-tel' }, h('div', { className: 'scv-tel-f' }, h('span', { className: 'scv-numg', 'data-scv-numero': '' }, dest.numero || '—'), h('span', { className: 'scv-nota' }, (dest.nombre || 'Sin nombre') + ' · ' + relTxt(dest)),
              llamada ? h('span', { className: 'scv-reloj', role: 'timer', 'aria-label': 'Duración de la llamada', 'data-scv-reloj': '' }, mmss(segs)) : null),
            h('div', { className: 'scv-tel-f', style: { marginTop: 6, justifyContent: 'flex-start' } }, llamada ? h('button', { type: 'button', className: 'scv-bt rojo', id: 'scv-colgar', title: 'Atajo: L', onClick: colgar }, 'Colgar')
                : h('button', { type: 'button', className: 'scv-bt verde', id: 'scv-llamar-btn', title: 'Atajo: L · por Genesis', disabled: !destOk || !!cancelado, onClick: llamar }, 'Llamar'),
              h('span', { className: 'scv-chip', title: 'Central telefónica y WhatsApp (conexión por API en producción)' }, 'vía Genesis'), h('span', { className: 'scv-nota' }, 'Atajo: L')),
            llamada ? h('div', { className: 'scv-guion', 'data-scv-guion': '' }, h('b', null, 'Guion: '), '«Buenos días. Le llamo de Aseguradora del Sur por la inspección de ' + (x.vehTxt || 'su vehículo') + (x.asegurado ? ' a nombre de ' + String(x.asegurado).replace(/\.+$/, '') : '') + '. ' + guion + '»') : null),
          h('div', { className: 'scv-campo', style: { marginBottom: 8 } }, h('label', { className: 'scv-lb', htmlFor: 'scv-nota-int' }, 'Nota del intento'), h('textarea', { id: 'scv-nota-int', className: 'scv-in', rows: 2, value: nota, placeholder: 'Lo que dice la persona: cómo llegar, horario, quién atiende…', onChange: (e) => setNota(e.target.value) })),
          h('div', { id: 'scv-res-t', title: 'Guarda el resultado, la nota, a quién se llamó y la duración en los intentos y en el historial del caso' }, h('b', { style: { fontSize: 14, color: 'var(--text-strong)' } }, 'Registrar el resultado'), h('span', { className: 'scv-nota' }, ' · con la nota, a quién y la duración · ' + sinResp + ' sin respuesta de ' + maxI)),
          h('div', { className: 'scv-res6', role: 'group', 'aria-labelledby': 'scv-res-t' }, RESULTADOS.map((r, k) => h('button', { key: r, type: 'button', 'data-scv-res': r, disabled: !!cancelado, title: 'Atajo: ' + (k + 1), onClick: () => registrar(r) }, h('span', { className: 'scv-kbd', 'aria-hidden': 'true' }, String(k + 1)), r))),
          cancOk ? (canc ? h('div', { className: 'scv-canc', role: 'group', 'aria-labelledby': 'scv-canc-t', 'data-scv-canc': '' }, h('b', { id: 'scv-canc-t' }, 'Cancelar la solicitud de inspección'),
              h('div', { className: 'scv-nota', style: { color: 'var(--color-danger,#B3261E)', fontWeight: 600, margin: '2px 0 8px' } }, 'Todo el caso queda Cancelado y se avisa a quien la solicitó.'),
              h('div', { className: 'scv-campo', style: { marginBottom: 8 } }, h('label', { className: 'scv-lb', htmlFor: 'scv-canc-m' }, 'Motivo', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
                h('select', { id: 'scv-canc-m', className: 'scv-in', style: { height: 38 }, value: canc.motivo, onChange: (e) => setCanc(Object.assign({}, canc, { motivo: e.target.value })) }, [h('option', { key: '', value: '' }, 'Elige el motivo…')].concat((x.motivosCanc || []).map((m) => h('option', { key: m, value: m }, m))))),
              h('div', { className: 'scv-campo', style: { marginBottom: 8 } }, h('label', { className: 'scv-lb', htmlFor: 'scv-canc-d' }, 'Detalle', h('span', { 'aria-hidden': 'true', style: { color: 'var(--color-danger)' } }, ' *')),
                h('textarea', { id: 'scv-canc-d', className: 'scv-in', rows: 2, value: canc.detalle, 'aria-describedby': 'scv-canc-a', placeholder: 'Qué dijo la persona (mínimo 10 caracteres)', onChange: (e) => setCanc(Object.assign({}, canc, { detalle: e.target.value })) }),
                h('span', { id: 'scv-canc-a', className: 'scv-nota' }, String(canc.detalle || '').trim().length + ' de 10 caracteres como mínimo')),
              h('div', { style: { display: 'flex', gap: 8 } }, btn('ghost', 'Volver', () => setCanc(null), { size: 'sm', id: 'scv-canc-no' }), h('button', { type: 'button', className: 'scv-bt rojo', id: 'scv-canc-si', style: { height: 34, fontSize: 13.5 }, disabled: !(canc.motivo && String(canc.detalle || '').trim().length >= 10), onClick: confirmarCanc }, 'Cancelar la solicitud')))
            : h('button', { type: 'button', className: 'scv-bt borde', id: 'scv-canc-abrir', disabled: !!cancelado, onClick: () => { setCanc({ motivo: '', detalle: '' }); setTimeout(() => { const s = document.getElementById('scv-canc-m'); if (s) s.focus(); }, 30); } }, 'Cancelar la solicitud…')) : null),
        h('section', { className: 'scv-col', 'aria-label': 'Intentos de contacto y enlace', style: { flex: '1 1 0', maxWidth: 860 } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } }, h('h3', { style: { margin: 0 } }, 'Intentos de contacto ', h('span', { className: 'scv-nota', 'data-scv-nint': String(I.length) }, '(' + I.length + ')')), btn('secondary', 'Historial del caso', abrirHist, { size: 'sm', id: 'scv-hist-abrir2' })),
          ints.length ? h('ul', { className: 'scv-ints', 'data-scv-intentos': '' }, ints) : h('p', { className: 'scv-nota' }, 'Aún no hay intentos de contacto registrados.'),
          enlace)); };

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
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-obs' }, 'Observaciones para el inspector'), h('textarea', { id: 'scv-obs', className: 'scv-in', rows: 2, value: p.obs || '', placeholder: 'Ej. Llamar antes de llegar; el guardia pide cédula en la entrada.', onChange: (e) => x.patch({ obs: e.target.value }) })), // G-2c3: antes en Contacto
          h('details', { style: { marginBottom: 10 } }, h('summary', { style: { cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'var(--cyan-700)' } }, 'Ciudad: ' + SLm.ciudadNombre(l.ciudad) + (l.provincia ? ' (' + ((provs.find((y) => y.cod === l.provincia) || {}).nombre || '') + ')' : '') + ' · cambiar'),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 } },
              h('select', { 'aria-label': 'Provincia', className: 'scv-in', value: l.provincia, onChange: (e) => { const c = SLm.ciudadesDe(e.target.value)[0]; setQ(''); ponerLugar({ provincia: e.target.value, ciudad: c ? c.cod : '', direccion: '', referencia: l.referencia, punto: null, origen: l.origen }); } }, provs.map((y) => h('option', { key: y.cod, value: y.cod }, y.nombre))),
              h('select', { 'aria-label': 'Ciudad', className: 'scv-in', value: l.ciudad, onChange: (e) => { setQ(''); ponerLugar({ provincia: l.provincia, ciudad: e.target.value, direccion: '', referencia: l.referencia, punto: null, origen: l.origen }); } }, ciudades.map((y) => h('option', { key: y.cod, value: y.cod }, y.nombre))))),
          h('details', { open: !!errs.sCel }, h('summary', { style: { cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'var(--cyan-700)' } }, 'Contacto en sitio: ' + (p.sNom || '—') + ' · ' + (p.sCel || '—') + ' · cambiar'), // G-2c3: propio, distinto del contacto para la coordinación
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 140px', gap: 8, marginTop: 6 } }, h('input', { id: 'scv-snom', 'aria-label': 'Nombre del contacto en sitio', className: 'scv-in', value: p.sNom || '', onChange: (e) => x.patch({ sNom: e.target.value }) }), h('input', { id: 'scv-scel', 'aria-label': 'Celular del contacto en sitio', className: 'scv-in', inputMode: 'numeric', maxLength: 10, 'aria-invalid': errs.sCel ? 'true' : undefined, value: p.sCel || '', onChange: (e) => x.patch({ sCel: e.target.value.replace(/\D/g, '').slice(0, 10) }) })),
            errs.sCel ? h('span', { role: 'alert', className: 'scv-err' }, errs.sCel) : h('span', { className: 'scv-nota' }, 'Quién recibe al inspector en el lugar. Se puede llamar desde la fase Contacto.'))),
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
          h('span', { className: 'scv-nota', 'data-scv-dur': String(dur) }, 'Duración: ' + dur + ' min'),
          p.mod === 'Virtual guiada' && x.modo !== 'inspector' ? h('div', { style: { flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 260 } }, h('label', { className: 'scv-lb', htmlFor: 'scv-obs', style: { margin: 0, whiteSpace: 'nowrap' } }, 'Observaciones para el inspector'), h('input', { id: 'scv-obs', className: 'scv-in', style: { height: 34 }, value: p.obs || '', placeholder: 'Opcional', onChange: (e) => x.patch({ obs: e.target.value }) })) : null), // G-2c3: Virtual guiada no tiene fase Lugar
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
      const selDestE = (id) => { const malN = D0.tipo === 'otro' && numT && !numOk(D0.numero), setD = (o) => x.patch({ dest: Object.assign({}, D0, o) });
        return h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: id }, 'Enviar a'),
          h('select', { id, className: 'scv-in', value: D0.tipo, 'data-scv-destino': D0.tipo, onChange: (e) => { setNumT(false); setD({ tipo: e.target.value }); } }, h('option', { value: 'coordinacion' }, 'Contacto para la coordinación · ' + (p.cName || 'sin nombre') + ' · ' + (p.cCel || 'sin celular')),
            h('option', { value: 'sitio' }, 'Contacto en sitio · ' + (p.sNom || 'sin nombre') + ' · ' + (p.sCel || 'sin celular')), h('option', { value: 'otro' }, 'Otro número…')),
          D0.tipo === 'otro' ? h('div', { className: 'scv-otro' }, h('input', { id: id + '-num', className: 'scv-in', 'aria-label': 'Celular del otro número', inputMode: 'numeric', maxLength: 10, placeholder: 'Celular (09…)', value: D0.numero || '', 'aria-invalid': malN ? 'true' : undefined, onChange: (e) => setD({ numero: e.target.value.replace(/\D/g, '').slice(0, 10) }), onBlur: () => setNumT(true) }),
            h('input', { className: 'scv-in', 'aria-label': 'Nombre de la persona', placeholder: 'Nombre', value: D0.nombre || '', onChange: (e) => setD({ nombre: e.target.value }) }), h('input', { className: 'scv-in', 'aria-label': 'Relación con el cliente', placeholder: 'Relación (chofer, hijo…)', value: D0.relacion || '', onChange: (e) => setD({ relacion: e.target.value }) })) : null,
          malN ? h('span', { role: 'alert', className: 'scv-err' }, 'El celular debe tener 10 dígitos y empezar con 0.') : null); };
      return h('div', { className: 'scv-vista' },
        h('section', { className: 'scv-col', 'aria-label': 'Enlace de autoinspección', style: { flex: '1 1 0', maxWidth: 560, borderRight: '1px solid var(--border-subtle)' } },
          h('h3', null, 'Enlace de autoinspección'), h('p', { className: 'scv-nota', style: { marginTop: 0 } }, 'El cliente toma las fotos con su celular, guiado paso a paso. Su lugar lo confirma en el portal (GPS o dirección).'),
          h('div', { className: 'scv-campo' }, h('span', { className: 'scv-lb' }, (x.vehNombre === 'Vehículos' ? 'Vehículos' : 'Riesgos') + ' incluidos'), h('span', { 'data-scv-vehs': '' }, x.vehTxt)),
          h('div', { className: 'scv-campo', role: 'radiogroup', 'aria-label': 'Enviar por' }, h('span', { className: 'scv-lb' }, 'Enviar por'), h('div', { style: { display: 'flex', gap: 6 } }, ['WhatsApp', 'SMS', 'Correo'].map((c) => { const ok = c === 'Correo' ? !!String(p.cMail || '').trim() : !!String(p.cCel || '').trim();
            return h('button', { key: c, type: 'button', role: 'radio', className: 'scv-tg', 'aria-checked': canal === c ? 'true' : 'false', 'aria-pressed': canal === c ? 'true' : 'false', disabled: !ok, title: ok ? '' : (c === 'Correo' ? 'Sin correo del contacto' : 'Sin celular del contacto'), onClick: () => x.patch({ canal: c }) }, c); }))),
          canal === 'Correo' ? h('div', { className: 'scv-campo' }, h('span', { className: 'scv-lb' }, 'Enviar a'), h('span', null, (p.cName || 'Contacto') + ' · ' + (p.cMail || 'sin correo'))) : selDestE('scv-enviar-ai'), // G-2c3: «Enviar a» igual al de Contacto
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-obs' }, 'Indicaciones para el contacto'), h('textarea', { id: 'scv-obs', className: 'scv-in', rows: 2, value: p.obs || '', placeholder: 'Ej. Toma las fotos con luz de día y con el vehículo limpio.', onChange: (e) => x.patch({ obs: e.target.value }) })), // G-2c3: antes en Contacto
          h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-vig' }, 'Vigencia'), h('select', { id: 'scv-vig', className: 'scv-in', style: { width: 160 }, value: String(vh), onChange: (e) => x.patch({ validez: e.target.value + ' horas' }) }, [24, 48, 72].map((v) => h('option', { key: v, value: String(v) }, v + ' horas'))))),
        h('section', { className: 'scv-col', 'aria-label': 'Vista previa del mensaje', style: { flex: '1 1 0' } }, h('h3', null, 'Vista previa del mensaje'), h('div', { className: 'scv-prev', 'data-scv-prev': '' }, x.previa ? x.previa(p) : ''))); };
    const vDocumental = () => h('div', { className: 'scv-vista' }, h('section', { className: 'scv-col', style: { flex: '1 1 0', maxWidth: 620 }, 'aria-label': 'Revisión documental' }, h('h3', null, 'Revisión documental'),
      h('p', { className: 'scv-nota', style: { marginTop: 0 } }, 'El inspector revisa los documentos y las fotos del cliente hasta la fecha límite.'),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-dfecha' }, 'Fecha límite de revisión *'), SF() ? h(SF(), { id: 'scv-dfecha', value: p.fecha || '', onChange: (e) => x.patch({ fecha: e.target.value }), modo: 'fecha', formato: 'iso', min: hoy, max: ult, height: 40, width: 180 }) : null),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-dins' }, 'Inspector *'), h('select', { id: 'scv-dins', className: 'scv-in', style: { maxWidth: 320 }, value: p.inspector || '', onChange: (e) => x.patch({ inspector: e.target.value }) }, [h('option', { key: '', value: '' }, 'Elige…')].concat((x.INS || []).map((i) => h('option', { key: i.n, value: i.n }, i.n))))),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-obs' }, 'Observaciones para el inspector'), h('textarea', { id: 'scv-obs', className: 'scv-in', rows: 2, value: p.obs || '', onChange: (e) => x.patch({ obs: e.target.value }) }))));
    const vNri = () => h('div', { className: 'scv-vista' }, h('section', { className: 'scv-col', style: { flex: '1 1 0', maxWidth: 620 }, 'aria-label': 'Motivo' }, h('h3', null, 'No requiere inspección'),
      h('p', { className: 'scv-nota', style: { marginTop: 0 } }, 'Los riesgos pasan directamente a calificación, sin informe de inspección.'),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-nmot' }, 'Motivo *'), h('select', { id: 'scv-nmot', className: 'scv-in', value: p.motivo || '', onChange: (e) => x.patch({ motivo: e.target.value }) }, [h('option', { key: '', value: '' }, 'Selecciona el motivo')].concat((x.motivosNR || []).map((m) => h('option', { key: m, value: m }, m))))),
      h('div', { className: 'scv-campo' }, h('label', { className: 'scv-lb', htmlFor: 'scv-nobs' }, 'Observación *'), h('textarea', { id: 'scv-nobs', className: 'scv-in', rows: 3, value: p.nrObs || '', placeholder: 'Ej. Factura del concesionario y fotos de entrega revisadas.', onChange: (e) => x.patch({ nrObs: e.target.value }) }))));

    // ================= Cuerpo =================
    const vista = fase === 'contacto' ? vContacto() : fase === 'lugar' ? vLugar() : fase === 'horario' ? vHorario() : fase === 'enlace' ? vEnlace() : fase === 'documental' ? vDocumental() : vNri();
    const cab = h('header', { className: 'scv-cab' }, h('h2', { id: 'scv-t' }, x.titulo), h('span', { className: 'scv-nota', style: { fontSize: 14 } }, 'Caso ' + x.casoId + (x.asegurado ? ' · ' + x.asegurado : '')),
      x.sucursal ? h('span', { className: 'scv-chip' }, 'Sucursal ' + x.sucursal) : null, x.sla ? h('span', { className: 'scv-chip' + (x.slaTono === 'danger' || x.slaTono === 'warning' ? ' warn' : '') }, 'SLA: ' + x.sla) : null,
      h('span', { style: { marginLeft: 'auto' } }, btn('secondary', 'Historial del caso', abrirHist, { size: 'sm', id: 'scv-hist-abrir' }))); // G-2c3
    const vehs = x.riesgosOpc || [], bloqTxt = (mods.find((y) => y.label === p.mod && !y.ok) || {}).motivo;
    const barra = x.modo === 'contacto' ? null : h('div', { className: 'scv-barra', 'data-scv-barra': '' },
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
      ant && !cancelado ? btn('secondary', '← ' + ant[1], () => irFase(ant[0]), { id: 'scv-ant', title: 'Alt+←' }) : null, secB, priB);
    // Historial del caso (G-2c3): la misma cronología de la pestaña Historial, con filtros; se cierra con Esc.
    const tipoH = (t) => /intento de contacto|autoagendamiento|llamad/i.test(t) ? 'Contacto' : /visita|oferta|inspector|autoinspecci|agend/i.test(t) ? 'Visitas' : /cancel|estado|solicitud|reapert|asignad|caso|calific|emiti|recibid/i.test(t) ? 'Estado' : 'Otros';
    const histL = hist ? (x.historial ? x.historial() : []).map((e) => Object.assign({ tipo: tipoH(String(e.evento || '')) }, e)) : [];
    const histV = histL.filter((e) => hFil === 'Todo' || e.tipo === hFil);
    const cajon = hist ? h('aside', { className: 'scv-hist', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'scv-hist-t', 'data-scv-hist': '' },
      h('div', { className: 'scv-hist-c' }, h('h3', { id: 'scv-hist-t' }, 'Historial del caso ' + x.casoId), h('button', { type: 'button', className: 'scv-x', id: 'scv-hist-cerrar', 'aria-label': 'Cerrar el historial (Esc)', onClick: cerrarHist }, '✕')),
      h('div', { className: 'scv-hist-f', role: 'group', 'aria-label': 'Filtrar el historial' }, ['Todo', 'Contacto', 'Visitas', 'Estado'].map((f) => h('button', { key: f, type: 'button', className: 'scv-tg', style: { height: 30 }, 'aria-pressed': hFil === f ? 'true' : 'false', 'data-scv-hfil': f, onClick: () => setHFil(f) }, f + ' (' + (f === 'Todo' ? histL.length : histL.filter((e) => e.tipo === f).length) + ')'))),
      histV.length ? h('ul', { className: 'scv-hist-l', 'data-scv-hist-lista': '' }, histV.map((e, k) => h('li', { key: k, 'data-scv-htipo': e.tipo }, h('span', { style: { display: 'flex', justifyContent: 'space-between', gap: 8 } }, h('span', { style: { color: 'var(--text-strong)', fontWeight: 600 } }, e.evento), h('span', { className: 'scv-nota', style: { whiteSpace: 'nowrap' } }, e.fecha)), h('span', { className: 'scv-nota' }, (e.usuario || '—') + ' · ' + e.tipo))))
        : h('p', { className: 'scv-nota', style: { padding: '0 16px' } }, 'Sin eventos de este tipo.')) : null;
    const banda = cancelado ? h('div', { className: 'scv-banda', role: 'alert', 'data-scv-banda': '' }, 'Caso cancelado · ' + cancelado.motivo + '. Ya no se puede coordinar.') : null;
    const cuerpoEl = h('div', { ref: cuerpo, className: 'scv-cuerpo' + (cancelado ? ' bloq' : ''), 'aria-disabled': cancelado ? 'true' : undefined, 'data-scv-cuerpo': '' }, barra, pasos, vista);
    return h('div', { ref: raiz, className: 'scv', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'scv-t', 'data-scv-fase-actual': fase, 'data-scv-cancelado': cancelado ? '1' : undefined }, cab, banda, cuerpoEl, pie, cajon,
      aviso ? h('div', { className: 'scv-aviso', role: 'status', 'aria-live': 'polite', 'data-scv-aviso': '' }, aviso) : null);
  }
  W.SiriusCoordinar = SiriusCoordinar;
})();
