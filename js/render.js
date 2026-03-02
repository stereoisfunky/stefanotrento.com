/* ════════════════════════════════════════════
   render.js — Reads JSON content files,
   builds all DOM content dynamically.
   Nothing is hardcoded in index.html.
   ════════════════════════════════════════════ */

const Render = (() => {

  // ── FETCH HELPERS ──────────────────────────
  async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  }

  // ── ABOUT ──────────────────────────────────
  function renderAbout(data) {
    const container = document.getElementById('about-content');
    if (!container) return;

    // Left column
    const left = document.createElement('div');
    left.className = 'about-left';

    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'About';

    const title = document.createElement('h2');
    title.className = 'about-title';
    title.textContent = data.title;

    const designerLine = document.createElement('p');
    designerLine.className = 'about-designer-line';
    designerLine.textContent = data.designer_line;

    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'about-body';
    data.body.forEach(para => {
      const p = document.createElement('p');
      p.textContent = para;
      bodyWrap.appendChild(p);
    });

    left.append(label, title, designerLine, bodyWrap);

    // Right column — telescope
    const right = document.createElement('div');
    right.className = 'about-right';

    const telescope = document.createElement('div');
    telescope.className = 'telescope';

    data.telescope.forEach(item => {
      const row = document.createElement('div');
      row.className = 'telescope-item';

      const year = document.createElement('div');
      year.className = 'tel-year';
      year.textContent = item.year;

      const text = document.createElement('div');
      text.className = 'tel-text';

      if (item.signal && item.signal_text) {
        // Split text around the signal phrase and wrap it in <em>
        const parts = item.text.split(item.signal_text);
        text.appendChild(document.createTextNode(parts[0]));
        const em = document.createElement('em');
        em.textContent = item.signal_text;
        text.appendChild(em);
        if (parts[1]) text.appendChild(document.createTextNode(parts[1]));
      } else {
        text.textContent = item.text;
      }

      row.append(year, text);
      telescope.appendChild(row);
    });

    right.appendChild(telescope);
    container.append(left, right);
  }

  // ── INVESTIGATIONS ─────────────────────────
  function buildFragment(type) {
    const wrap = document.createElement('div');

    if (type === 'redacted') {
      wrap.className = 'frag-financial';
      wrap.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 280 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Document border -->
          <rect x="0.5" y="0.5" width="279" height="339" stroke="#FAFAFA" stroke-width="0.5"/>
          <!-- Header band -->
          <rect x="0.5" y="0.5" width="279" height="36" fill="#FAFAFA" fill-opacity="0.06"/>
          <rect x="14" y="12" width="56" height="4" rx="1" fill="#FAFAFA"/>
          <rect x="14" y="20" width="34" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.4"/>
          <rect x="218" y="13" width="48" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.3"/>
          <rect x="218" y="20" width="32" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.18"/>

          <!-- Step 01 -->
          <rect x="14" y="48" width="10" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.25"/>
          <rect x="34" y="48" width="96" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.45"/>
          <rect x="34" y="56" width="148" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.25"/>
          <rect x="34" y="64" width="72" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.3"/>
          <rect x="34" y="74" width="220" height="14" rx="1" stroke="#FAFAFA" stroke-width="0.4" stroke-opacity="0.2"/>
          <rect x="38" y="79" width="55" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.14"/>
          <line x1="0.5" y1="98" x2="279.5" y2="98" stroke="#FAFAFA" stroke-width="0.3" stroke-opacity="0.12"/>

          <!-- Step 02 -->
          <rect x="14" y="110" width="10" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.25"/>
          <rect x="34" y="110" width="120" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.45"/>
          <rect x="34" y="118" width="84" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.25"/>
          <rect x="34" y="128" width="104" height="14" rx="1" stroke="#FAFAFA" stroke-width="0.4" stroke-opacity="0.2"/>
          <rect x="38" y="133" width="42" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.14"/>
          <rect x="148" y="128" width="106" height="14" rx="1" stroke="#FAFAFA" stroke-width="0.4" stroke-opacity="0.2"/>
          <rect x="152" y="133" width="60" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.14"/>
          <line x1="0.5" y1="153" x2="279.5" y2="153" stroke="#FAFAFA" stroke-width="0.3" stroke-opacity="0.12"/>

          <!-- Step 03 — abandonment point -->
          <rect x="14" y="165" width="10" height="4" rx="1" fill="#FF2F00" fill-opacity="0.9"/>
          <rect x="34" y="165" width="88" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.45"/>
          <rect x="34" y="173" width="132" height="4" rx="1" fill="#FAFAFA" fill-opacity="0.25"/>
          <rect x="34" y="183" width="220" height="14" rx="1" stroke="#FAFAFA" stroke-width="0.4" stroke-opacity="0.2"/>
          <!-- Red abandonment marker -->
          <line x1="255" y1="153" x2="255" y2="208" stroke="#FF2F00" stroke-width="0.8" stroke-opacity="0.65"/>
          <rect x="251" y="177" width="5" height="5" fill="#FF2F00" fill-opacity="0.85"/>
          <line x1="0.5" y1="208" x2="279.5" y2="208" stroke="#FAFAFA" stroke-width="0.3" stroke-opacity="0.12"/>

          <!-- Steps 04–07: ghosted / removed -->
          <line x1="14" y1="211" x2="244" y2="211" stroke="#FAFAFA" stroke-width="0.3" stroke-opacity="0.07" stroke-dasharray="3 4"/>
          <rect x="14" y="222" width="8" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="222" width="104" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="229" width="66" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.05"/>

          <rect x="14" y="244" width="8" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="244" width="88" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="251" width="120" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.05"/>

          <rect x="14" y="266" width="8" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="266" width="72" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="273" width="96" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.05"/>

          <rect x="14" y="288" width="8" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>
          <rect x="34" y="288" width="60" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.07"/>

          <!-- Footer band -->
          <rect x="0.5" y="308" width="279" height="31" fill="#FAFAFA" fill-opacity="0.03"/>
          <rect x="14" y="319" width="44" height="3" rx="1" fill="#FAFAFA" fill-opacity="0.15"/>
          <rect x="188" y="317" width="76" height="7" rx="1" fill="#FAFAFA" fill-opacity="0.08"/>
        </svg>`;

    } else if (type === 'navigation') {
      wrap.className = 'frag-nav';
      const motionPath = 'M 60 240 L 60 180 L 120 180 L 120 120 L 180 120 L 180 60 L 240 60';
      const animated = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      wrap.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="60" x2="300" y2="60" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="0" y1="120" x2="300" y2="120" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="0" y1="180" x2="300" y2="180" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="0" y1="240" x2="300" y2="240" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="60" y1="0" x2="60" y2="300" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="120" y1="0" x2="120" y2="300" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="180" y1="0" x2="180" y2="300" stroke="#FAFAFA" stroke-width="0.5"/>
          <line x1="240" y1="0" x2="240" y2="300" stroke="#FAFAFA" stroke-width="0.5"/>
          <path d="${motionPath}"
                stroke="#FAFAFA" stroke-width="1.2" stroke-dasharray="4 4"/>
          <circle cx="60" cy="240" r="4" fill="#FAFAFA"/>
          <circle cx="240" cy="60" r="4" fill="#FF2F00" opacity="0.25"/>
          <rect x="68" y="232" width="40" height="6" rx="1" fill="#FAFAFA" opacity="0.3"/>
          <rect x="248" y="52" width="36" height="6" rx="1" fill="#FAFAFA" opacity="0.3"/>
        </svg>`;
      // Create animated dot via SVG DOM (not innerHTML) so Safari/iOS
      // properly initialises the SMIL animation engine for the element.
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = wrap.querySelector('svg');
      if (animated) {
        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#FF2F00');
        const anim = document.createElementNS(svgNS, 'animateMotion');
        anim.setAttribute('dur', '14s');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('rotate', 'none');
        anim.setAttribute('keyPoints', '0;1;1');
        anim.setAttribute('keyTimes', '0;0.82;1');
        anim.setAttribute('calcMode', 'linear');
        anim.setAttribute('path', motionPath);
        dot.appendChild(anim);
        svg.appendChild(dot);
      } else {
        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('cx', '240');
        dot.setAttribute('cy', '60');
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#FF2F00');
        svg.appendChild(dot);
      }

    } else if (type === 'frequency') {
      wrap.className = 'frag-sound';
      const canvas = document.createElement('canvas');
      canvas.id = 'freq-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      wrap.appendChild(canvas);
    }

    return wrap;
  }

  function renderInvestigations(data) {
    const container = document.getElementById('investigations-container');
    if (!container) return;

    data.forEach(inv => {
      const section = document.createElement('section');
      section.className = 'investigation';
      section.id = inv.id;
      section.setAttribute('aria-label', inv.number);

      // Left content
      const left = document.createElement('div');
      left.className = 'inv-left reveal';

      const num = document.createElement('div');
      num.className = 'inv-number';
      num.textContent = inv.number;

      // Question history
      const qHistory = document.createElement('div');
      qHistory.className = 'question-history';
      inv.question_history.forEach(q => {
        const entry = document.createElement('div');
        entry.className = 'q-entry' + (q.current ? ' current' : '');

        const date = document.createElement('div');
        date.className = 'q-date';
        date.textContent = q.year;

        const text = document.createElement('div');
        text.className = 'q-text';
        text.textContent = q.text;

        entry.append(date, text);
        qHistory.appendChild(entry);
      });

      // Annotations
      const annotations = document.createElement('div');
      annotations.className = 'annotations';
      inv.annotations.forEach(ann => {
        const item = document.createElement('div');
        item.className = 'annotation' + (ann.current ? ' current-ann' : '');

        const date = document.createElement('div');
        date.className = 'ann-date';
        date.textContent = ann.date;

        const label = document.createElement('div');
        label.className = 'ann-label';
        label.textContent = ann.label;

        const text = document.createElement('div');
        text.className = 'ann-text';
        text.textContent = ann.text;

        item.append(date, label, text);
        annotations.appendChild(item);
      });

      left.append(num, qHistory, annotations);

      // Craft callout
      if (inv.craft_callout) {
        const callout = document.createElement('div');
        callout.className = 'craft-callout';
        const p = document.createElement('p');
        p.textContent = inv.craft_callout;
        callout.appendChild(p);
        left.appendChild(callout);
      }

      // Right visual
      const right = document.createElement('div');
      right.className = 'inv-right';

      const fragment = document.createElement('div');
      fragment.className = 'fragment';
      fragment.appendChild(buildFragment(inv.visual));
      right.appendChild(fragment);

      // Ambient toggle — only for inv with ambient_toggle: true
      if (inv.ambient_toggle) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'sound-toggle-inline';
        toggle.id = 'soundToggle';
        toggle.setAttribute('aria-label', 'Toggle ambient sound');
        toggle.innerHTML = `
          <div class="sound-bars">
            <div class="sound-bar"></div>
            <div class="sound-bar"></div>
            <div class="sound-bar"></div>
            <div class="sound-bar"></div>
            <div class="sound-bar"></div>
          </div>
          <span id="soundLabel">Play ambient</span>`;
        right.appendChild(toggle);
      }

      // Layout: visual left or right
      if (inv.visual_left) {
        section.append(right, left);
      } else {
        section.append(left, right);
      }

      container.appendChild(section);
    });
  }

  // ── PRESENT ────────────────────────────────
  function buildPlayer(track) {
    const player = document.createElement('div');

    if (track.bandcamp_id) {
      // ── Bandcamp embed ──
      player.className = 'sound-player sound-player--embed';
      const embedSrc = `https://bandcamp.com/EmbeddedPlayer/track=${track.bandcamp_id}/size=small/bgcol=000000/linkcol=FF2F00/tracklist=false/transparent=true/`;
      player.innerHTML = `
        <div class="player-label">Currently listening</div>
        <iframe class="bandcamp-embed" src="${embedSrc}"
          seamless title="${track.title} by ${track.artist}"></iframe>`;
    } else {
      // ── Visual simulation player ──
      player.className = 'sound-player';
      const BAR_COUNT = 64;
      const heights = Array.from({length: BAR_COUNT}, () => Math.random() * 0.7 + 0.15);

      player.innerHTML = `
        <div class="player-label">Currently listening</div>
        <div class="player-track">${track.title}</div>
        <div class="player-artist">${track.artist} — ${track.label}</div>
        <div class="waveform" id="waveform"></div>
        <div class="player-controls">
          <button type="button" class="play-btn" id="playBtn" aria-label="Play">
            <svg viewBox="0 0 10 12" fill="currentColor">
              <path id="playIcon" d="M0 0 L10 6 L0 12 Z"/>
            </svg>
          </button>
          <div class="player-time" id="playerTime">0:00 / ${track.duration_display}</div>
        </div>
        <a class="player-link" href="${track.url}" target="_blank" rel="noopener noreferrer">Bandcamp ↗</a>`;

      setTimeout(() => {
        const waveformEl = player.querySelector('#waveform');
        if (!waveformEl) return;
        heights.forEach(h => {
          const bar = document.createElement('div');
          bar.className = 'wf-bar';
          bar.style.height = (h * 36) + 'px';
          waveformEl.appendChild(bar);
        });
        Player.init(
          player.querySelector('#playBtn'),
          player.querySelector('#playIcon'),
          player.querySelector('#playerTime'),
          waveformEl,
          track.duration_seconds,
          track.duration_display
        );
      }, 0);
    }

    return player;
  }

  function renderPresent(data) {
    const sidebar = document.getElementById('timeline-sidebar');
    const content = document.getElementById('season-content');
    if (!sidebar || !content) return;

    // Sidebar label
    const label = document.createElement('div');
    label.className = 'tl-section-label';
    label.textContent = 'Present';
    sidebar.appendChild(label);

    // Build year groups
    data.forEach((yearGroup, yi) => {
      // ── Sidebar year button ──
      const entry = document.createElement('button');
      entry.type = 'button';
      entry.className = 'timeline-entry' + (yi === 0 ? ' active' : '');
      entry.dataset.year = yi;
      entry.setAttribute('aria-pressed', yi === 0 ? 'true' : 'false');
      entry.innerHTML = `
        <div class="tl-dot" aria-hidden="true"></div>
        <div class="tl-label">${yearGroup.year}</div>`;
      sidebar.appendChild(entry);

      // ── Year pane in content area ──
      const yearPane = document.createElement('div');
      yearPane.className = 'year-pane' + (yi === 0 ? ' active' : '');
      yearPane.dataset.year = yi;

      // Season chip row — always shown
      const chips = document.createElement('div');
      chips.className = 'season-chips';
      chips.setAttribute('role', 'tablist');
      chips.setAttribute('aria-label', `${yearGroup.year} seasons`);

      yearGroup.seasons.forEach((season, si) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.id = `season-tab-${yi}-${si}`;
        chip.className = 'season-chip' + (si === 0 ? ' active' : '');
        chip.dataset.season = si;
        chip.setAttribute('role', 'tab');
        chip.setAttribute('aria-selected', si === 0 ? 'true' : 'false');
        chip.setAttribute('tabindex', si === 0 ? '0' : '-1');
        chip.textContent = season.season;
        chips.appendChild(chip);
      });

      yearPane.appendChild(chips);

      // Season content panes — wrapped in a grid container to prevent height jumps
      const panesWrapper = document.createElement('div');
      panesWrapper.className = 'season-panes';

      yearGroup.seasons.forEach((season, si) => {
        const pane = document.createElement('div');
        pane.id = `season-panel-${yi}-${si}`;
        pane.className = 'season-pane' + (si === 0 ? ' active' : '');
        pane.dataset.season = si;
        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-labelledby', `season-tab-${yi}-${si}`);
        pane.setAttribute('tabindex', '0');

        const question = document.createElement('div');
        question.className = 'season-question';
        question.textContent = season.question;

        const answer = document.createElement('div');
        answer.className = 'season-answer';
        answer.textContent = season.answer;

        const objects = document.createElement('div');
        objects.className = 'season-objects';
        season.objects.forEach(obj => {
          const item = document.createElement('div');
          item.className = 'season-object';
          item.innerHTML = `
            <div class="obj-label">${obj.label}</div>
            <div class="obj-value">${obj.value}</div>`;
          objects.appendChild(item);
        });

        pane.append(question, answer, objects);
        if (season.track) pane.appendChild(buildPlayer(season.track));
        panesWrapper.appendChild(pane);
      });

      yearPane.appendChild(panesWrapper);

      content.appendChild(yearPane);

      // Season chip switching (within year pane)
      const allChips = Array.from(yearPane.querySelectorAll('.season-chip'));
      allChips.forEach((chip, idx) => {
        chip.addEventListener('click', e => {
          e.preventDefault();
          const si = chip.dataset.season;
          allChips.forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-selected', 'false');
            c.setAttribute('tabindex', '-1');
          });
          yearPane.querySelectorAll('.season-pane').forEach(p => p.classList.remove('active'));
          chip.classList.add('active');
          chip.setAttribute('aria-selected', 'true');
          chip.setAttribute('tabindex', '0');
          const target = yearPane.querySelector(`.season-pane[data-season="${si}"]`);
          if (target) target.classList.add('active');
        });

        chip.addEventListener('keydown', e => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const next = (idx + dir + allChips.length) % allChips.length;
            allChips[next].focus();
            allChips[next].click();
          }
        });
      });
    });

    // Year switching (sidebar)
    sidebar.querySelectorAll('.timeline-entry').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const yi = btn.dataset.year;
        sidebar.querySelectorAll('.timeline-entry').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        content.querySelectorAll('.year-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const pane = content.querySelector(`.year-pane[data-year="${yi}"]`);
        if (pane) pane.classList.add('active');
      });
    });
  }

  // ── INIT ───────────────────────────────────
  async function init() {
    try {
      const [about, investigations, present] = await Promise.all([
        fetchJSON('content/about.json'),
        fetchJSON('content/investigations.json'),
        fetchJSON('content/present.json')
      ]);

      renderAbout(about);
      renderInvestigations(investigations);
      renderPresent(present);

    } catch (err) {
      console.error('Render error:', err);
    }
  }

  return { init };
})();
