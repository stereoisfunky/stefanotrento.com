/* ════════════════════════════════════════════
   player.js — Track player + ambient drone
   ════════════════════════════════════════════ */

// ── TRACK PLAYER ───────────────────────────
const Player = (() => {

  function init(playBtn, playIconEl, timeEl, waveformEl, durationSecs, durationDisplay) {
    if (!playBtn || !waveformEl) return;

    let playing = false;
    let progress = 0;
    let interval = null;
    const BAR_COUNT = waveformEl.children.length || 64;

    function fmt(s) {
      return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    }

    function updateDisplay() {
      const bars = waveformEl.querySelectorAll('.wf-bar');
      const playedCount = Math.floor((progress / durationSecs) * BAR_COUNT);
      bars.forEach((bar, i) => {
        bar.classList.remove('played', 'active');
        if (i < playedCount) bar.classList.add('played');
        if (i === playedCount) bar.classList.add('active');
      });
      if (timeEl) timeEl.textContent = `${fmt(progress)} / ${durationDisplay}`;
    }

    waveformEl.addEventListener('click', e => {
      const rect = waveformEl.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      progress = Math.round(fraction * durationSecs);
      updateDisplay();
    });

    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      if (playing) {
        playIconEl.setAttribute('d', 'M0 0 L4 0 L4 12 L0 12 Z M6 0 L10 0 L10 12 L6 12 Z');
        interval = setInterval(() => {
          progress = Math.min(progress + 1, durationSecs);
          updateDisplay();
          if (progress >= durationSecs) {
            playing = false;
            playIconEl.setAttribute('d', 'M0 0 L10 6 L0 12 Z');
            clearInterval(interval);
          }
        }, 1000);
      } else {
        playIconEl.setAttribute('d', 'M0 0 L10 6 L0 12 Z');
        clearInterval(interval);
      }
    });

    updateDisplay();
  }

  return { init };
})();


// ── AMBIENT DRONE ───────────────────────────
const Drone = (() => {
  let audioCtx = null;
  let masterGain = null;
  let nodes = [];
  let playing = false;

  function start() {
    if (playing) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 4);
    masterGain.connect(audioCtx.destination);

    // Three layered sine tones — A1 / E2 / A2
    [55, 82.5, 110].forEach((freq, i) => {
      const osc     = audioCtx.createOscillator();
      const gain    = audioCtx.createGain();
      const lfo     = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      // Slow pitch breathing via LFO
      lfo.type = 'sine';
      lfo.frequency.value = 0.08 + i * 0.03;
      lfoGain.gain.value = freq * 0.008;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.value = 0.3 - i * 0.06;
      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      lfo.start();

      nodes.push(osc, lfo, gain);
    });

    playing = true;
  }

  function stop() {
    if (!playing || !audioCtx) return;

    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);

    setTimeout(() => {
      nodes.forEach(n => { try { n.stop(); } catch(e) {} });
      audioCtx.close();
      audioCtx = null;
      masterGain = null;
      nodes = [];
      playing = false;
    }, 2200);
  }

  function toggle(btn, labelEl) {
    if (!playing) {
      start();
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Stop ambient sound');
      if (labelEl) labelEl.textContent = 'Stop ambient';
    } else {
      stop();
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Play ambient sound');
      if (labelEl) labelEl.textContent = 'Play ambient';
    }
  }

  function isPlaying() { return playing; }

  return { start, stop, toggle, isPlaying };
})();
