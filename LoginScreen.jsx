// LoginScreen — SIRIUS login. Layout "Dividido" (ADS header + universe panel left + form right) or
// "Inmersivo" (universe full screen + form in a DS Card). Universe = layered canvas (local --space-* palette).
function LoginHeader() {
  return (
    <header style={{ height: 'var(--login-header-height)', flex: '0 0 auto', display: 'flex', alignItems: 'center', padding: '0 60px', background: '#fff', borderBottom: '2px solid var(--cyan-700)' }}>
      <img src="assets/ads-horizontal.png" alt="Aseguradora del Sur" style={{ height: 62 }} />
    </header>
  );
}

// Login-only palette (DS exception, scoped to the universe root).
const SPACE_VARS = { '--space-void': '#050819', '--space-indigo': '#0f0e2e', '--space-deep': '#11173f', '--space-blue': '#1a275f', '--space-violet': '#241a51' };
const SP_CSS = `
@keyframes spFadeIn{from{opacity:0}to{opacity:1}}
@keyframes spHalo{0%,100%{filter:drop-shadow(0 0 14px color-mix(in srgb,var(--cyan-500) 15%,transparent))}50%{filter:drop-shadow(0 0 14px color-mix(in srgb,var(--cyan-500) 35%,transparent))}}
@keyframes spNode{0%,100%{filter:drop-shadow(0 0 8px color-mix(in srgb,var(--cyan-500) 25%,transparent))}50%{filter:drop-shadow(0 0 10px color-mix(in srgb,var(--cyan-500) 50%,transparent))}}
`;
// Canis Major — real positions (RA hours, Dec degrees), brightness 0..1.
const CMA = {
  stars: {
    sirius: [6.7525, -16.716, 1], mirzam: [6.3783, -17.956, 0.62], muliphein: [7.0627, -15.633, 0.42],
    iota: [6.9356, -17.054, 0.38], theta: [6.9034, -12.039, 0.4], omicron2: [7.0501, -23.833, 0.48],
    wezen: [7.1399, -26.393, 0.68], adhara: [6.9771, -28.972, 0.74], aludra: [7.4016, -29.303, 0.55],
    furud: [6.3385, -30.063, 0.48], nu2: [6.6113, -19.256, 0.34],
  },
  lines: [['mirzam', 'nu2'], ['nu2', 'sirius'], ['sirius', 'iota'], ['iota', 'theta'], ['iota', 'muliphein'], ['sirius', 'omicron2'], ['omicron2', 'wezen'], ['wezen', 'adhara'], ['adhara', 'furud'], ['wezen', 'aludra']],
};
function spRand(seed) { let t = seed; return () => { t = (t + 0x6D2B79F5) | 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
function spMode(m) {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return 'estatica';
  const k = String(m || 'Completa').toLowerCase();
  return k.startsWith('red') ? 'reducida' : k.startsWith('est') ? 'estatica' : 'completa';
}
function spColor(el, v, fb) {
  const h = ((el && getComputedStyle(el).getPropertyValue(v)) || fb).trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

function SpaceUniverse({ animacion, avoidRefs, logosRef, phraseRef, areaRef, constelacion }) {
  const showCma = String(constelacion || 'fondo').toLowerCase() !== 'ninguna';
  const rootRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const mode = spMode(animacion);
  React.useEffect(() => {
    const cv = canvasRef.current, root = rootRef.current; if (!cv || !root) return;
    const ctx = cv.getContext('2d');
    const C = {
      void: spColor(root, '--space-void', '#050819'), indigo: spColor(root, '--space-indigo', '#0f0e2e'), deep: spColor(root, '--space-deep', '#11173f'),
      blue: spColor(root, '--space-blue', '#1a275f'), violet: spColor(root, '--space-violet', '#241a51'),
      blue7: spColor(root, '--blue-700', '#0033A1'), cyan5: spColor(root, '--cyan-500', '#00AEEF'), cyan3: spColor(root, '--cyan-300', '#5BC8F5'), white: [255, 255, 255],
    };
    const rnd = spRand(424242);
    let W = 1, H = 1, dpr = 1, base = null, nebulas = [], far = [], mid = [], near = [], cma = null, cmaLines = null, logoBox = null, phraseBox = null, areaBox = null, avoid = [];
    const rel = (el) => { if (!el) return null; const a = el.getBoundingClientRect(), b = cv.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; };
    const sprite = (size, color, alpha, lobes) => {
      const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
      const r = rnd;
      for (let i = 0; i < lobes; i++) {
        const x = size * (0.32 + r() * 0.36), y = size * (0.32 + r() * 0.36), rad = size * (0.22 + r() * 0.2);
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, rgba(color, alpha)); gr.addColorStop(0.55, rgba(color, alpha * 0.45)); gr.addColorStop(1, rgba(color, 0));
        g.fillStyle = gr; g.fillRect(0, 0, size, size);
      }
      if ('filter' in g) { const c2 = document.createElement('canvas'); c2.width = c2.height = size; const g2 = c2.getContext('2d'); g2.filter = `blur(${Math.round(size * 0.06)}px)`; g2.drawImage(c, 0, 0); return c2; }
      return c;
    };
    function layout() {
      const b = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, b.width); H = Math.max(1, b.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      // base gradient (void corners → indigo/deep center, blue area bottom-left)
      base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height;
      const g = base.getContext('2d'); g.scale(dpr, dpr);
      g.fillStyle = rgba(C.void, 1); g.fillRect(0, 0, W, H);
      const R = Math.hypot(W, H) * 0.62;
      let gr = g.createRadialGradient(W * 0.5, H * 0.46, 0, W * 0.5, H * 0.46, R);
      gr.addColorStop(0, rgba(C.deep, 1)); gr.addColorStop(0.45, rgba(C.indigo, 1)); gr.addColorStop(1, rgba(C.void, 1));
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      gr = g.createRadialGradient(W * 0.12, H * 0.92, 0, W * 0.12, H * 0.92, Math.max(W, H) * 0.55);
      gr.addColorStop(0, rgba(C.blue, 0.9)); gr.addColorStop(1, rgba(C.blue, 0));
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // regions to keep clear
      logoBox = rel(logosRef && logosRef.current);
      avoid = (avoidRefs || []).map(r => rel(r.current)).filter(Boolean);
      phraseBox = rel(phraseRef && phraseRef.current);
      areaBox = rel(areaRef && areaRef.current);
      const lx = logoBox ? logoBox.x + logoBox.w / 2 : W * 0.4, ly = logoBox ? logoBox.y + logoBox.h / 2 : H * 0.4;
      const M = Math.max(W, H);
      nebulas = [
        { img: sprite(256, C.violet, 0.95, 4), cx: W * 0.86, cy: H * 0.14, s: M * 0.95, per: 96, ph: 0.3, amp: 0.035, lo: 0.42, hi: 0.6 },
        { img: sprite(256, C.blue7, 0.75, 4), cx: W * 0.12, cy: H * 0.88, s: M * 0.9, per: 118, ph: 1.7, amp: 0.03, lo: 0.3, hi: 0.5 },
        { img: sprite(256, C.cyan5, 0.08 / 0.5, 3), cx: lx, cy: ly, s: M * 0.55, per: 72, ph: 2.6, amp: 0.02, lo: 0.3, hi: 0.5 },
      ];
      const area = W * H;
      far = Array.from({ length: Math.round(area / 1700) }, () => ({ x: rnd(), y: rnd(), a: 0.15 + rnd() * 0.25 }));
      mid = Array.from({ length: Math.round(area / 9000) }, () => ({ x: rnd(), y: rnd(), r: 0.75 + rnd() * 0.25, a: 0.35 + rnd() * 0.35, tw: rnd() < 0.5, p: 3 + rnd() * 3, ph: rnd() * 6.28, col: rnd() < 0.35 ? C.cyan3 : C.white }));
      // near sparkles: 5, away from logos/avoid rects
      near = [];
      let guard = 0;
      while (near.length < 5 && guard++ < 400) {
        const x = 0.05 + rnd() * 0.9, y = 0.05 + rnd() * 0.9, px = x * W, py = y * H;
        const blocked = [logoBox, phraseBox].concat(avoid).some(b => b && px > b.x - 40 && px < b.x + b.w + 40 && py > b.y - 40 && py < b.y + b.h + 40);
        if (!blocked && near.every(n => Math.hypot(n.x * W - px, n.y * H - py) > M * 0.18)) near.push({ x, y, len: 4 + rnd() * 3, p: 4 + rnd() * 3, ph: rnd() * 6.28 });
      }
      placeConstellation();
      drawFrame(T);
    }
    function placeConstellation() {
      cma = null; cmaLines = null; if (!showCma) return;
      const ra0 = 6.87, dec0 = -21, cosd = Math.cos(dec0 * Math.PI / 180);
      const pts = {}; let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      for (const k in CMA.stars) { const [ra, dec, b] = CMA.stars[k]; const x = -(ra - ra0) * 15 * cosd, y = -(dec - dec0); pts[k] = { x, y, b }; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
      const sw = maxX - minX, sh = maxY - minY;
      const A = areaBox || { x: 0, y: 0, w: W, h: H };
      const lb = logoBox || { x: A.x + A.w * 0.125, y: A.y + A.h * 0.4, w: A.w * 0.75, h: A.h * 0.2 };
      const pb = phraseBox || { y: A.y + A.h * 0.85, h: 24 };
      const zones = [{ x: A.x + 32, y: A.y + 32, w: A.w - 64, h: lb.y - 48 - (A.y + 32) }, { x: A.x + 32, y: lb.y + lb.h + 40, w: A.w - 64, h: pb.y - 32 - (lb.y + lb.h + 40) }].filter(z => z.h > 60);
      const Z = zones.sort((p, q) => Math.min(q.w / sw, q.h / sh) - Math.min(p.w / sw, p.h / sh))[0] || { x: A.x, y: A.y, w: A.w, h: A.h * 0.3 };
      const scale = Math.min(Z.w * 0.9 / sw, Z.h * 0.92 / sh);
      const ox = Z.x + (Z.w - sw * scale) / 2, oy = Z.y + (Z.h - sh * scale) / 2;
      const P = {}; for (const k in pts) P[k] = { x: ox + (pts[k].x - minX) * scale, y: oy + (pts[k].y - minY) * scale, b: pts[k].b, ph: rnd() * 6.28, p: 4 + rnd() * 3 };
      cma = P;
      // static lines, pre-rendered with a soft blur
      cmaLines = document.createElement('canvas'); cmaLines.width = cv.width; cmaLines.height = cv.height;
      const g = cmaLines.getContext('2d'); g.scale(dpr, dpr);
      if ('filter' in g) g.filter = 'blur(1.2px)';
      g.lineWidth = 1.2; g.lineCap = 'round'; g.strokeStyle = rgba(C.white, 0.11);
      for (const [a, b] of CMA.lines) { g.beginPath(); g.moveTo(P[a].x, P[a].y); g.lineTo(P[b].x, P[b].y); g.stroke(); }
    }
    let T = 0, comet = null, nextComet = 4 + rnd() * 6;
    const moving = mode === 'completa';
    function drawFrame(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1; ctx.drawImage(base, 0, 0, W, H);
      // nebulas (breathe + slow drift)
      for (const n of nebulas) {
        const w = (2 * Math.PI * t) / n.per + n.ph;
        const breathe = mode === 'estatica' ? 0.5 : 0.5 + 0.5 * Math.sin(w);
        const dx = moving ? Math.cos(w * 0.7) * n.amp * W : 0, dy = moving ? Math.sin(w) * n.amp * H : 0;
        ctx.globalAlpha = n.lo + (n.hi - n.lo) * breathe;
        ctx.drawImage(n.img, n.cx - n.s / 2 + dx, n.cy - n.s / 2 + dy, n.s, n.s);
      }
      ctx.globalAlpha = 1;
      if (cma) drawConstellation(t);
      const ph = (2 * Math.PI * t) / 90;
      const off = (ax, ay, k) => moving ? [Math.cos(ph + k) * ax, Math.sin(ph + k) * ay] : [0, 0];
      const wrap = (v, m) => ((v % m) + m) % m;
      // far: 1px, nearly still
      let [fx, fy] = off(3, 2, 0);
      for (const s of far) { ctx.fillStyle = rgba(C.white, s.a); ctx.fillRect(wrap(s.x * W + fx, W), wrap(s.y * H + fy, H), 1, 1); }
      // mid: twinkle + slow drift
      let [mx, my] = off(12, 8, 1.3);
      for (const s of mid) {
        const a = s.tw && mode !== 'estatica' ? s.a * (0.55 + 0.45 * Math.sin((2 * Math.PI * t) / s.p + s.ph)) : s.a;
        ctx.fillStyle = rgba(s.col, a); ctx.beginPath(); ctx.arc(wrap(s.x * W + mx, W), wrap(s.y * H + my, H), s.r, 0, 6.2832); ctx.fill();
      }
      // near: four-point sparkles with pulsing cyan halo
      let [nx, ny] = off(24, 15, 2.4);
      for (const s of near) {
        const x = s.x * W + nx, y = s.y * H + ny;
        const pulse = mode === 'estatica' ? 0.5 : 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / s.p + s.ph);
        const hr = s.len * 2.6, hg = ctx.createRadialGradient(x, y, 0, x, y, hr);
        hg.addColorStop(0, rgba(C.cyan5, 0.1 + 0.12 * pulse)); hg.addColorStop(1, rgba(C.cyan5, 0));
        ctx.fillStyle = hg; ctx.fillRect(x - hr, y - hr, hr * 2, hr * 2);
        sparkle(x, y, s.len, 0.45 + 0.2 * pulse);
      }
      if (moving) drawComet(t);
    }
    function sparkle(x, y, len, a) {
      const w = len * 0.16;
      ctx.fillStyle = rgba(C.white, a);
      ctx.beginPath(); ctx.moveTo(x, y - len); ctx.lineTo(x + w, y); ctx.lineTo(x, y + len); ctx.lineTo(x - w, y); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - len * 0.8, y); ctx.lineTo(x, y + w); ctx.lineTo(x + len * 0.8, y); ctx.lineTo(x, y - w); ctx.closePath(); ctx.fill();
    }
    function drawConstellation(t) {
      ctx.drawImage(cmaLines, 0, 0, W, H);
      const still = mode === 'estatica';
      for (const k in cma) {
        const st = cma[k], sir = k === 'sirius';
        const tw = still ? 1 : 0.75 + 0.25 * Math.sin((2 * Math.PI * t) / st.p + st.ph);
        const r = sir ? 3.2 : 1.6 + 1.2 * st.b, hr = sir ? 22 + 5 * tw : r * 2.2;
        const g = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, hr);
        if (sir) { g.addColorStop(0, rgba(C.white, 0.5 * tw)); g.addColorStop(0.14, rgba(C.cyan3, 0.22 * tw)); g.addColorStop(1, rgba(C.cyan5, 0)); }
        else { g.addColorStop(0, rgba(C.white, 0.3 * tw)); g.addColorStop(0.45, rgba(C.white, 0.15 * tw)); g.addColorStop(1, rgba(C.white, 0)); }
        ctx.fillStyle = g; ctx.fillRect(st.x - hr, st.y - hr, hr * 2, hr * 2);
        if (sir) sparkle(st.x, st.y, 8, 0.3 + 0.12 * tw);
      }
    }
    function drawComet(t) {
      if (comet) {
        const p = (t - comet.t0) / comet.dur;
        if (p >= 1) { comet = null; nextComet = t + 8 + rnd() * 6; return; }
        const e = 1 - Math.pow(1 - p, 2), hx = comet.x0 + comet.dx * e, hy = comet.y0 + comet.dy * e;
        const d = Math.hypot(comet.dx, comet.dy), ux = comet.dx / d, uy = comet.dy / d, len = 130;
        const a = 0.6 * Math.sin(Math.PI * p), g = ctx.createLinearGradient(hx, hy, hx - ux * len, hy - uy * len);
        g.addColorStop(0, rgba(C.white, a)); g.addColorStop(1, rgba(C.white, 0));
        ctx.strokeStyle = g; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - ux * len, hy - uy * len); ctx.stroke();
      } else if (t >= nextComet) {
        const dx = 240 + rnd() * 120, dy = dx * 0.38;
        const lb = logoBox || { y: H * 0.3, h: H * 0.3 };
        const bands = [];
        if (lb.y - dy - 30 > H * 0.03) bands.push([H * 0.03, lb.y - dy - 30]);
        if (H * 0.96 - dy > lb.y + lb.h + 30) bands.push([lb.y + lb.h + 30, H * 0.96 - dy]);
        if (!bands.length) { nextComet = t + 8 + rnd() * 6; return; }
        const [y1, y2] = bands[Math.floor(rnd() * bands.length)];
        const right = avoid.length ? Math.min(...avoid.map(b => b.x)) - dx - 20 : W - dx;
        comet = { t0: t, dur: 1 + rnd() * 0.5, x0: Math.max(10, W * 0.04 + rnd() * Math.max(10, right - W * 0.04)), y0: y1 + rnd() * (y2 - y1), dx, dy };
      }
    }
    layout();
    const ro = new ResizeObserver(layout); ro.observe(cv); [logosRef, phraseRef, areaRef].forEach(r => r && r.current && ro.observe(r.current));
    if (mode === 'estatica') return () => ro.disconnect();
    let raf = 0, last = performance.now();
    const loop = (now) => { if (!document.hidden) { T += Math.min(0.1, (now - last) / 1000); drawFrame(T); } last = now; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [mode, showCma]);
  return (
    <div ref={rootRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, ...SPACE_VARS, background: 'var(--space-void)' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

function LogoLockup({ animacion, logosRef, phraseRef, compact }) {
  const mode = spMode(animacion), still = mode === 'estatica';
  const [hidden, setHidden] = React.useState(typeof document !== 'undefined' && document.hidden);
  React.useEffect(() => { const f = () => setHidden(document.hidden); document.addEventListener('visibilitychange', f); return () => document.removeEventListener('visibilitychange', f); }, []);
  const play = hidden ? 'paused' : 'running';
  const enter = (delay) => still ? {} : { animation: `spFadeIn var(--dur-drawer) var(--ease-gentle) ${delay}ms both`, animationPlayState: play };
  const halo = (delay) => still ? { filter: 'drop-shadow(0 0 14px color-mix(in srgb,var(--cyan-500) 25%,transparent))' } : { animation: `spHalo 5s ease-in-out ${delay}s infinite`, animationPlayState: play };
  const node = (x, y) => (
    <div style={still ? { position: 'absolute', inset: 0, filter: 'drop-shadow(0 0 9px color-mix(in srgb,var(--cyan-500) 35%,transparent))' } : { position: 'absolute', inset: 0, animation: 'spNode 5s ease-in-out -2.5s infinite', animationPlayState: play }}>
      <img src="assets/sirius-logo-oscuro-solo.png" alt="" style={{ display: 'block', width: '100%', height: 'auto', mixBlendMode: 'screen', clipPath: `circle(4.5% at ${x}% ${y}%)` }} />
    </div>
  );
  return (
    <React.Fragment>
      <style>{SP_CSS}</style>
      <div ref={logosRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '75%', maxWidth: compact ? 720 : 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 6%, 64px)', ...enter(0) }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <img src="assets/ads-logo-oscuro.png" alt="Aseguradora del Sur" style={{ width: '100%', height: 'auto', display: 'block', mixBlendMode: 'screen', ...halo(0) }} />
          </div>
          <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', minHeight: 72, background: 'var(--cyan-300)', opacity: 0.35, flex: '0 0 auto' }} />
          <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}>
            <img src="assets/sirius-logo-oscuro-solo.png" alt="SIRIUS" style={{ width: '100%', height: 'auto', display: 'block', mixBlendMode: 'screen', ...halo(-2.5) }} />
            {node(21.2, 50.3)}
            {node(31.1, 50.3)}
          </div>
        </div>
      </div>
      <p ref={phraseRef} style={{ position: 'absolute', left: '8%', right: '8%', top: '85%', transform: 'translateY(-50%)', margin: 0, textAlign: 'center', fontFamily: 'var(--font-brand)', fontSize: 'clamp(15px, 1.35vw, 20px)', color: '#FFFFFF', textWrap: 'pretty', ...enter(400) }}>Aseguradora del Sur &amp; Sirius, innovando para tu futuro.</p>
    </React.Fragment>
  );
}


// ---------- Invitación a SIRIUS (etapa 10b) ----------
// Pasos: bienvenida · gmail (internos) · password (externos y agencias, o interno que prefiere contraseña) · codigo (6 dígitos) · listo · vencida · reemplazada.
const LG_CSS = `.lg-lk{border:none;background:transparent;padding:0;cursor:pointer;font-family:var(--font-brand);font-size:14px;font-weight:700;color:var(--text-link);text-decoration:underline;text-underline-offset:3px}.lg-lk:focus-visible{outline:2px solid var(--color-brand);outline-offset:2px}`;
const LG_CODIGO = '482913';
function lgReglas(pw, u, U) {
  const low = pw.toLowerCase(), partes = String(u.nombre).toLowerCase().split(/\s+/).filter(x => x.length >= 3).concat([String(u.correo).split('@')[0].toLowerCase(), String(u.correo).toLowerCase()]), min = U.acceso.contrasena.minimo;
  const st = (ok) => pw ? (ok ? 'ok' : 'no') : 'pend';
  return [
    { st: st(pw.length >= min), txt: 'Al menos ' + min + ' caracteres' },
    { st: st(/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw)), txt: 'Una mayúscula, una minúscula y un número' },
    { st: st(!partes.some(x => x && low.includes(x))), txt: 'No contiene tu nombre ni tu correo' },
  ];
}
function LgRegla({ st, txt }) {
  const col = st === 'ok' ? 'var(--color-success, #1E8E3E)' : st === 'no' ? 'var(--color-danger)' : 'var(--text-muted)';
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: 1.35, color: st === 'no' ? 'var(--color-danger)' : 'var(--text-body)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: '0 0 auto', marginTop: 1 }}>
        {st === 'ok' ? <path d="M20 6 9 17l-5-5" /> : st === 'no' ? <path d="M18 6 6 18M6 6l12 12" /> : <circle cx="12" cy="12" r="4" />}
      </svg>
      <span>{txt}<span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{st === 'ok' ? ': cumple' : st === 'no' ? ': no cumple' : ': pendiente'}</span></span>
    </li>
  );
}
function InvitacionFlujo({ nombre, paso0, claveInicial, onInicio }) {
  const { Button, Input, Alert } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const SU = window.SiriusUsuarios, U = window.SIRIUS_USUARIOS;
  const [paso, setPaso] = React.useState(paso0);
  const [pw, setPw] = React.useState(claveInicial || '');
  const [pw2, setPw2] = React.useState(claveInicial || '');
  const [cod, setCod] = React.useState('');
  const [errCod, setErrCod] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [aviso, setAviso] = React.useState('');
  const [ver, setVer] = React.useState(0);
  const u = SU.usuario(nombre); if (!u) return null;
  const interno = u.tipo === 'Interno', primero = String(u.nombre).split(/\s+/)[0], quien = u.invitado ? u.invitado[0] : 'el Administrador';
  const h1 = { margin: '0 0 6px', fontWeight: 'var(--fw-regular)', fontSize: 'var(--login-title-size)', lineHeight: 1.15, color: 'var(--text-strong)', textAlign: 'center', textWrap: 'balance' };
  const sub = { margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-body)', textAlign: 'center', textWrap: 'pretty' };
  const wrap = { width: 340, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--font-brand)' };
  const h1Ref = React.useRef(null);
  React.useEffect(() => { if (h1Ref.current) h1Ref.current.focus(); }, [paso]);
  const T = (t) => <h1 ref={h1Ref} tabIndex={-1} style={Object.assign({ outline: 'none' }, h1)}>{t}</h1>;
  const baseRol = (SU.base(u.roles[0]) || u.roles[0]);
  const conGoogle = () => { setBusy(true); setTimeout(() => { setBusy(false); setPaso('gmail'); }, 900); };
  const autorizar = (si) => { setBusy(true); setTimeout(() => { setBusy(false); SU.completarInvitacion(u.nombre, 'Google'); if (si) SU.conectarGmail(u.nombre, u.nombre); setPaso('listo'); setVer(x => x + 1); }, 700); };
  const rg = lgReglas(pw, u, U), okReg = rg.every(r => r.st === 'ok'), coincide = pw2 === pw, okPw = okReg && pw2.length > 0 && coincide;
  const enviarCodigo = () => { setBusy(true); setTimeout(() => { setBusy(false); setPaso('codigo'); }, 700); };
  const confirmarCodigo = () => { if (cod !== LG_CODIGO) { setErrCod('El código no coincide. Revisa el último correo que te enviamos.'); return; } setBusy(true); setTimeout(() => { setBusy(false); SU.completarInvitacion(u.nombre, 'Usuario y contraseña'); setPaso('listo'); }, 700); };
  const finPw = () => { if (!okPw) return; if (interno) { SU.completarInvitacion(u.nombre, 'Usuario y contraseña'); setPaso('listo'); } else enviarCodigo(); };
  let body = null;
  if (paso === 'bienvenida') body = (
    <div style={wrap}>
      <div>{T('Te damos la bienvenida, ' + primero)}<p style={sub}>{quien} te invitó a SIRIUS, el sistema de inspecciones de {U.compania}.</p></div>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: '8px 14px', padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle, #F3F6FA)', fontSize: 14 }}>
        <dt style={{ color: 'var(--text-muted)' }}>{u.roles.length > 1 ? 'Roles' : 'Rol'}</dt><dd style={{ margin: 0, fontWeight: 700, color: 'var(--text-strong)' }}>{u.roles.join(', ')}</dd>
        <dt style={{ color: 'var(--text-muted)' }}>Alcance</dt><dd style={{ margin: 0, color: 'var(--text-strong)' }}>{SU.alcanceTxt(u.alcance)}</dd>
        <dt style={{ color: 'var(--text-muted)' }}>Tu correo</dt><dd style={{ margin: 0, color: 'var(--text-strong)', overflowWrap: 'anywhere' }}>{u.correo}</dd>
        {u.vence ? <React.Fragment><dt style={{ color: 'var(--text-muted)' }}>Vigente hasta</dt><dd style={{ margin: 0, color: 'var(--text-strong)' }}>{SU.fmtLargo(u.vence)}</dd></React.Fragment> : null}
      </dl>
      {interno ? (
        <React.Fragment>
          <Button variant="primary" size="lg" fullWidth loading={busy} onClick={conGoogle}>Continuar con Google</Button>
          <p style={{ margin: 0, textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>o <button type="button" className="lg-lk" onClick={() => setPaso('password')}>prefiero crear una contraseña</button></p>
        </React.Fragment>
      ) : <Button variant="primary" size="lg" fullWidth onClick={() => setPaso('password')}>Crear mi contraseña</Button>}
    </div>
  );
  if (paso === 'gmail') body = (
    <div style={wrap}>
      <div>{T('Permite que SIRIUS envíe correos con tu cuenta')}<p style={sub}>Entraste con la cuenta de Google <strong style={{ color: 'var(--text-strong)', overflowWrap: 'anywhere' }}>{u.correo}</strong>.</p></div>
      <p style={{ margin: 0, padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle, #F3F6FA)', fontSize: 15, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' }}>{U.invitacion.textoAutorizacion}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="primary" size="lg" loading={busy} onClick={() => autorizar(true)} style={{ flex: '1 1 140px' }}>Permitir</Button>
        <Button variant="secondary" size="lg" disabled={busy} onClick={() => autorizar(false)} style={{ flex: '1 1 140px' }}>Ahora no</Button>
      </div>
    </div>
  );
  if (paso === 'password') body = (
    <form style={wrap} noValidate onSubmit={e => { e.preventDefault(); finPw(); }}>
      <div>{T('Crea tu contraseña')}<p style={sub}>La usarás para entrar a SIRIUS con {u.correo}.</p></div>
      <Input variant="outlined" label="Contraseña nueva" type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} />
      <ul aria-live="polite" aria-label="Reglas de la contraseña" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>{rg.map((r, i) => <LgRegla key={i} {...r} />)}</ul>
      <Input variant="outlined" label="Repite la contraseña" type="password" autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} error={pw2 && !coincide ? 'Las contraseñas no coinciden' : undefined} />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{U.acceso.contrasena.reglas[2]}.</p>
      <Button variant="primary" size="lg" fullWidth type="submit" unavailableReason={okPw ? undefined : 'Cumple las tres reglas y repite la contraseña para continuar.'} onClick={finPw}>{interno ? 'Crear contraseña' : 'Continuar'}</Button>
    </form>
  );
  if (paso === 'codigo') body = (
    <form style={wrap} noValidate onSubmit={e => { e.preventDefault(); if (cod.length === 6) confirmarCodigo(); }}>
      <div>{T('Confirma tu código')}<p style={sub}>Enviamos un código de 6 dígitos a <strong style={{ color: 'var(--text-strong)', overflowWrap: 'anywhere' }}>{u.correo}</strong>.</p></div>
      <Input variant="outlined" label="Código de 6 dígitos" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={cod} onChange={e => { setCod(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrCod(''); }} error={errCod || undefined} helper={'Solo en el prototipo: el código es ' + LG_CODIGO + '.'} />
      <Button variant="primary" size="lg" fullWidth type="submit" loading={busy} unavailableReason={cod.length === 6 ? undefined : 'Escribe los 6 dígitos del código.'} onClick={confirmarCodigo}>Confirmar</Button>
      <p style={{ margin: 0, textAlign: 'center', fontSize: 14 }}><button type="button" className="lg-lk" onClick={() => { setAviso('Te enviamos un código nuevo.'); setCod(''); setErrCod(''); }}>Reenviar código</button></p>
      {aviso ? <div role="status" style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-body)' }}>{aviso}</div> : null}
    </form>
  );
  if (paso === 'listo') body = (
    <div style={wrap}>
      <div>{T('Todo listo, ' + primero)}<p style={sub}>Tu cuenta quedó activa con {u.roles.length > 1 ? 'los roles' : 'el rol'} {u.roles.join(', ')}. Vas a entrar a tu inicio.</p></div>
      {interno ? <Alert tone={u.gmail === 'Conectada' ? 'success' : 'warning'} size="sm">{u.gmail === 'Conectada' ? 'Gmail conectada: tus correos saldrán de tu cuenta.' : 'Gmail sin conectar: tus correos saldrán de la cuenta institucional. Puedes conectarla desde Mi perfil.'}</Alert> : null}
      <Button variant="primary" size="lg" fullWidth onClick={() => onInicio && onInicio(u)}>Ir a mi inicio</Button>
    </div>
  );
  if (paso === 'vencida') { const pidio = !!u.pidioNueva; body = (
    <div style={wrap}>
      <div>{T('Esta invitación venció')}<p style={sub}>La invitación de {u.nombre} venció el {SU.fmtLargo(u.vence)}. Pide una nueva y {quien} te la enviará por correo.</p></div>
      {pidio ? <Alert tone="success" size="sm">Listo: avisamos a {quien}. Cuando te llegue el correo nuevo, abre ese enlace.</Alert> : <Button variant="primary" size="lg" fullWidth loading={busy} onClick={() => { setBusy(true); setTimeout(() => { setBusy(false); SU.pedirNueva(u.nombre); setVer(x => x + 1); }, 800); }}>Pedir una nueva invitación</Button>}
    </div>
  ); }
  if (paso === 'reemplazada') body = (
    <div style={wrap}>
      <div>{T('Este enlace ya no vale')}<p style={sub}>{quien} te envió una invitación más reciente y el enlace anterior quedó invalidado. Abre el último correo que te llegó.</p></div>
    </div>
  );
  return <React.Fragment><style>{LG_CSS}</style>{body}</React.Fragment>;
}

function LoginScreen({ animacion, layout, constelacion, invitacion, paso, enlace, claveInicial, onInicio }) {
  const { LoginForm, Modal, Input, Button, Snackbar, Card } = window.AseguradoraDelSurDesignSystem_4fbf29;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [recovery, setRecovery] = React.useState(null);
  const [recLoading, setRecLoading] = React.useState(false);
  const [snack, setSnack] = React.useState('');
  const logosRef = React.useRef(null);
  const cardRef = React.useRef(null);
  const phraseRef = React.useRef(null);
  const areaRef = React.useRef(null);
  const immersive = String(layout || '').toLowerCase().startsWith('inm');

  function signIn({ email, password }) {
    setError(''); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (password.length < 6) setError('Correo o contraseña incorrectos');
      else setSnack(`Bienvenido, ${email.split('@')[0]}`);
    }, 1400);
  }
  function sendRecovery() {
    setRecLoading(true);
    setTimeout(() => { setRecLoading(false); setRecovery(null); setSnack('Te enviamos un enlace para restablecer tu contraseña'); }, 1200);
  }
  const [gLoading, setGLoading] = React.useState(false);
  function googleSignIn() { setGLoading(true); setTimeout(() => { setGLoading(false); setSnack('Bienvenido (cuenta de Google)'); }, 1200); }
  const SUx = typeof window !== 'undefined' ? window.SiriusUsuarios : null;
  const [inv0] = React.useState(() => { const usr = invitacion && SUx ? SUx.porCorreo(invitacion) : null; if (!usr) return null; const est = SUx.estadoEf(usr); const p = paso || (est === 'Invitado' ? (enlace && Number(enlace) < (usr.enlace || 1) ? 'reemplazada' : 'bienvenida') : est === 'Invitación vencida' ? 'vencida' : null); return p ? { nombre: usr.nombre, paso: p } : null; });
  const irInicio = onInicio || ((u) => { const base = SUx.base(u.roles[0]); try { location.href = 'SIRIUS Back-office.dc.html?escena=inicio&rol=' + encodeURIComponent(base); } catch (er) {} });
  const loginForm = LoginForm
    ? <LoginForm loading={loading} error={error} onSubmit={signIn} onForgotPassword={email => setRecovery(email || '')} />
    : <p style={{ fontFamily: 'var(--font-brand)', color: 'var(--text-muted)' }}>Cargando componentes…</p>;
  const form = inv0
    ? <InvitacionFlujo key={inv0.nombre + inv0.paso} nombre={inv0.nombre} paso0={inv0.paso} claveInicial={claveInicial} onInicio={irInicio} />
    : (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <style>{LG_CSS}</style>
        {loginForm}
        <div style={{ width: 'var(--login-form-width)', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20, fontFamily: 'var(--font-brand)' }}>
          <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 14 }}><span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />o<span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} /></div>
          <Button variant="secondary" size="lg" fullWidth loading={gLoading} onClick={googleSignIn}>Continuar con Google</Button>
          <p style={{ margin: 0, textAlign: 'center', fontSize: 14, lineHeight: 1.4, color: 'var(--text-muted)' }}>¿Te invitaron? Abre el enlace del correo</p>
        </div>
      </div>
    );

  return (
    <React.Fragment>
      {immersive ? (
        <div key="inm" style={{ position: 'relative', flex: 1, minHeight: 640, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 48, padding: '56px clamp(32px, 7vw, 120px)' }}>
          <SpaceUniverse animacion={animacion} logosRef={logosRef} phraseRef={phraseRef} areaRef={areaRef} constelacion={constelacion} avoidRefs={[cardRef]} />
          <div ref={areaRef} className="login-photo" style={{ position: 'relative', alignSelf: 'stretch', minHeight: 520 }}>
            <LogoLockup animacion={animacion} logosRef={logosRef} phraseRef={phraseRef} compact />
          </div>
          <div ref={cardRef} style={{ position: 'relative', justifySelf: 'end' }}>
            {Card
              ? <Card elevation="md" radius="var(--radius-md)" padding="48px 40px" style={{ boxShadow: 'var(--shadow-modal)', display: 'flex', justifyContent: 'center' }}>{form}</Card>
              : form}
          </div>
        </div>
      ) : (
        <React.Fragment key="div">
          <LoginHeader />
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(360px,1fr)' }}>
            <div className="login-photo" style={{ position: 'relative', minHeight: 480, overflow: 'hidden' }}>
              <SpaceUniverse animacion={animacion} logosRef={logosRef} phraseRef={phraseRef} constelacion={constelacion} avoidRefs={[]} />
              <LogoLockup animacion={animacion} logosRef={logosRef} phraseRef={phraseRef} />
            </div>
            <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>{form}</main>
          </div>
        </React.Fragment>
      )}

      <Modal open={recovery !== null} onClose={() => setRecovery(null)} size="sm"
        title="Recuperar contraseña" description="Te enviaremos un enlace a tu correo registrado."
        footer={<><Button variant="ghost" onClick={() => setRecovery(null)}>Cancelar</Button><Button loading={recLoading} onClick={sendRecovery}>Enviar enlace</Button></>}>
        <Input variant="outlined" label="Correo" type="email" autoComplete="username" value={recovery || ''} onChange={e => setRecovery(e.target.value)} />
      </Modal>
      <Snackbar open={!!snack} tone="success" message={snack} onClose={() => setSnack('')} />
    </React.Fragment>
  );
}
window.LoginScreen = LoginScreen;
