/* ════════════════════════════════════════════
   wave.js — Canvas animations
   1. Wave grid (arrival section)
   2. Frequency lines (investigation 003)
   ════════════════════════════════════════════ */

// ── WAVE GRID ──────────────────────────────
const WaveGrid = (() => {
  // Cols/rows are computed dynamically in resize()
  // to keep cells roughly square at any viewport size
  let COLS = 26;
  let ROWS = 16;

  let canvas, ctx, W, H;
  let mouseXN = 0.5;
  let mouseYN = 0.5;
  let startTime = null;
  let rafId = null;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    // Target ~55px cell size so grid stays square on any viewport
    COLS = Math.max(6, Math.round(W / 55));
    ROWS = Math.max(6, Math.round(H / 55));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    const cellW = W / COLS;
    const cellH = H / ROWS;
    const amp = Math.min(W, H) * 0.024;

    // Horizontal wave lines
    for (let row = 0; row <= ROWS; row++) {
      const opacity = 0.06 + (row / ROWS) * 0.08;
      ctx.strokeStyle = `rgba(250,250,250,${opacity})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();

      for (let col = 0; col <= COLS; col++) {
        const x = col * cellW;
        const baseY = row * cellH;
        const nx = col / COLS;
        const ny = row / ROWS;

        const wave1 = Math.sin(nx * 5 - t * 0.5 + ny * 1.8) * amp;
        const wave2 = Math.sin(nx * 2.8 + t * 0.32 + ny * 3.2) * amp * 0.45;

        const dx = nx - mouseXN;
        const dy = ny - mouseYN;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseWave = Math.sin(dist * 7 - t * 1.1) * amp * 0.7 * Math.exp(-dist * 1.8);

        const y = baseY + wave1 + wave2 + mouseWave;

        col === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    // Vertical lines — very subtle
    ctx.strokeStyle = 'rgba(250,250,250,0.04)';
    for (let col = 0; col <= COLS; col++) {
      ctx.beginPath();

      for (let row = 0; row <= ROWS; row++) {
        const x = col * cellW;
        const baseY = row * cellH;
        const nx = col / COLS;
        const ny = row / ROWS;
        const wave = Math.sin(ny * 3 - t * 0.38 + nx * 2) * amp * 0.35;
        const y = baseY + wave;

        row === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  function loop(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;
    draw(t);
    rafId = requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('wave-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
      mouseXN = e.clientX / window.innerWidth;
      mouseYN = e.clientY / window.innerHeight;
    });

    if (reducedMotion) {
      // Single static frame — no animation loop
      draw(0);
    } else {
      rafId = requestAnimationFrame(loop);
    }
  }

  return { init };
})();


// ── SPATIAL AUDIO CANVAS ───────────────────
const FreqCanvas = (() => {
  let canvas, ctx;
  let startTime = null;

  const W = 320, H = 320;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Listener — center
  const lisX = 185, lisY = 160;

  // Source orbits a semi-arc to the left of the listener
  const arcR    = 72;                 // orbit radius
  const arcMid  = Math.PI;           // centre of arc = straight left
  const arcSpan = Math.PI * 0.48;    // ±86° sweep

  function getSrc(t) {
    const angle = arcMid + Math.sin(t * 0.28) * arcSpan;
    return {
      x: lisX + arcR * Math.cos(angle),
      y: lisY + arcR * Math.sin(angle),
      angle
    };
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    const src = getSrc(t);

    // ── Arc trajectory guide ──
    ctx.beginPath();
    ctx.arc(lisX, lisY, arcR, arcMid - arcSpan, arcMid + arcSpan);
    ctx.strokeStyle = 'rgba(250,250,250,0.07)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Reference rings from listener ──
    for (let r = 32; r <= 128; r += 32) {
      ctx.beginPath();
      ctx.arc(lisX, lisY, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250,250,250,0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // ── Propagating wavefronts from source ──
    for (let i = 0; i < 4; i++) {
      const phase   = (t * 0.55 + i * 0.9) % 3.6;
      const r       = phase * 44;
      const opacity = Math.max(0, 0.6 * (1 - phase / 3.6));
      ctx.beginPath();
      ctx.arc(src.x, src.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,47,0,${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // ── Arrival arc at listener — rotates with source ──
    const arrivalAngle = Math.atan2(src.y - lisY, src.x - lisX);
    const arcPhase     = (t * 0.55) % 3.6;
    const arcOpacity   = Math.max(0, 0.55 * (1 - arcPhase / 3.6));
    ctx.beginPath();
    ctx.arc(lisX, lisY, 16, arrivalAngle - 0.55, arrivalAngle + 0.55);
    ctx.strokeStyle = `rgba(255,47,0,${arcOpacity})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // ── Dashed line: source → listener ──
    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(lisX, lisY);
    ctx.strokeStyle = 'rgba(250,250,250,0.05)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Sound source: red square ──
    ctx.fillStyle = '#FF2F00';
    ctx.fillRect(src.x - 3.5, src.y - 3.5, 7, 7);

    // ── Listener: white square ──
    ctx.fillStyle = 'rgba(250,250,250,0.8)';
    ctx.fillRect(lisX - 3.5, lisY - 3.5, 7, 7);
  }

  function loop(ts) {
    if (!startTime) startTime = ts;
    draw((ts - startTime) / 1000);
    requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('freq-canvas');
    if (!canvas) return;
    canvas.width  = W;
    canvas.height = H;
    ctx = canvas.getContext('2d');

    if (reducedMotion) {
      draw(0);
    } else {
      requestAnimationFrame(loop);
    }
  }

  return { init };
})();
