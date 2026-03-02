/* ════════════════════════════════════════════
   main.js — Initialises all modules.
   Runs after render.js has built the DOM.
   ════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  // 0. Randomise arrival text before anything renders
  initArrivalText();

  // 1. Render all content from JSON first
  await Render.init();

  // 2. Start canvas animations
  WaveGrid.init();
  FreqCanvas.init();

  // 3. Cursor
  initCursor();

  // 4b. Background music toggle
  initBgMusic();

  // 4. Progress dots + scroll reveal
  initScroll();

  // 5. Ambient drone toggle (rendered by render.js inside inv-3)
  initAmbientToggle();

});


// ── ARRIVAL TEXT ────────────────────────────
function initArrivalText() {
  const variants = [
    { label: 'Listen.',  words: ['What', 'are', 'you', 'hearing\u00a0now?'] },
    { label: 'Look.',    words: ['What', 'did', 'you', 'just\u00a0miss?']   },
    { label: 'Feel.',    words: ['What', 'is',  'your', 'body\u00a0doing?'] },
    { label: 'Notice.',  words: ['Where', 'is', 'your', 'attention\u00a0now?'] },
    { label: 'Breathe.', words: ['What', 'are', 'you', 'aware\u00a0of?']   },
  ];

  const v = variants[Math.floor(Math.random() * variants.length)];

  const listenEl = document.querySelector('.listen');
  if (listenEl) listenEl.textContent = v.label;

  document.querySelectorAll('.question .w').forEach((span, i) => {
    if (v.words[i] !== undefined) span.innerHTML = v.words[i];
  });
}


// ── CURSOR ──────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
}


// ── SCROLL REVEAL + PROGRESS DOTS ───────────
function initScroll() {
  const sections = Array.from(document.querySelectorAll('section'));
  const dots = document.querySelectorAll('.prog-dot');

  // Reveal on intersection
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Reveal elements
      entry.target.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });

      // Update progress dots
      const idx = sections.indexOf(entry.target);
      if (idx !== -1) {
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === idx);
          d.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
        });
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  sections.forEach(s => observer.observe(s));

  // Dot click — scroll to section
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.section);
      if (sections[idx]) {
        sections[idx].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Reveal anything already in viewport on load
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      s.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  });

  // Hard fallback — reveal everything after 3s in case observer fails
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 3000);
}


// ── BACKGROUND MUSIC ────────────────────────
function initBgMusic() {
  const btn   = document.getElementById('bg-toggle');
  const audio = document.getElementById('bg-audio');
  if (!btn || !audio) return;

  const label = btn.querySelector('.bg-toggle-label');

  function swapLabel(text) {
    label.classList.add('fading');
    setTimeout(() => {
      label.textContent = text;
      label.classList.remove('fading');
    }, 150);
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add('playing');
      swapLabel('Stop ambient');
      btn.setAttribute('aria-label', 'Stop ambient');
    } else {
      audio.pause();
      btn.classList.remove('playing');
      swapLabel('Play ambient');
      btn.setAttribute('aria-label', 'Play ambient');
    }
  });
}


// ── AMBIENT TOGGLE ───────────────────────────
function initAmbientToggle() {
  // Rendered by render.js, so query after render
  const btn = document.getElementById('soundToggle');
  const label = document.getElementById('soundLabel');
  if (!btn) return;

  btn.addEventListener('click', () => {
    Drone.toggle(btn, label);
  });
}
