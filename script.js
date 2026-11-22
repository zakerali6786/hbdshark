/**
 * BIRTHDAY WEBSITE - INTERACTIVE PASSCODE CONTROLLER
 * Required Passcode: 0911
 */

document.addEventListener('DOMContentLoaded', () => {
  const CORRECT_PASSCODE = '0911';
  const MAX_DIGITS = 4;

  let currentPasscode = '';
  let isChecking = false;
  let soundEnabled = true;

  // DOM Elements
  const slots = document.querySelectorAll('.passcode-slot');
  const keypadGrid = document.getElementById('keypadGrid');
  const enterBtn = document.getElementById('enterBtn');
  const feedbackBanner = document.getElementById('feedbackBanner');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const modalStep1 = document.getElementById('modalStep1');
  const modalStep2 = document.getElementById('modalStep2');
  const modalStep3 = document.getElementById('modalStep3');
  const step1YesBtn = document.getElementById('step1YesBtn');
  const step1NoBtn = document.getElementById('step1NoBtn');
  const step2YesBtn = document.getElementById('step2YesBtn');
  const step2NoBtn = document.getElementById('step2NoBtn');
  const step3ContinueBtn = document.getElementById('step3ContinueBtn');
  const passcodeStage = document.getElementById('passcodeStage');
  const errorOverlay = document.getElementById('errorOverlay');
  const errorTryAgainBtn = document.getElementById('errorTryAgainBtn');

  // Page 2 Elements
  const page2Container = document.getElementById('page2Container');
  const candlelightHalo = document.getElementById('candlelightHalo');
  const leftPopper = document.getElementById('leftPopper');
  const rightPopper = document.getElementById('rightPopper');
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const backToLockBtn = document.getElementById('backToLockBtn');
  const replayCelebrationBtn = document.getElementById('replayCelebrationBtn');
  const candleItems = document.querySelectorAll('.candle-item');
  const birthdayCake = document.getElementById('birthdayCake');
  const magicPaperPlane = document.getElementById('magicPaperPlane');
  const letterOverlay = document.getElementById('letterOverlay');
  const letterCloseBtn = document.getElementById('letterCloseBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  // Page 3 & Flight Transition Elements
  const cloudTransitionOverlay = document.getElementById('cloudTransitionOverlay');
  const flightMapPage = document.getElementById('flightMapPage');
  const mapViewportWindow = document.getElementById('mapViewportWindow');
  const mapPanningCanvas = document.getElementById('mapPanningCanvas');
  const flightTrack = document.getElementById('flightTrack');
  const flightTrackProgress = document.getElementById('flightTrackProgress');
  const trackMaskPath = document.getElementById('trackMaskPath');
  const mapFlyingPlane = document.getElementById('mapFlyingPlane');
  const checkpointPins = document.querySelectorAll('.checkpoint-pin');
  const mapSpeechBubble = document.getElementById('mapSpeechBubble');
  const bubbleCloseBtn = document.getElementById('bubbleCloseBtn');
  const bubblePhoto = document.getElementById('bubblePhoto');
  const bubbleTitle = document.getElementById('bubbleTitle');
  const bubbleCaption = document.getElementById('bubbleCaption');
  const bubblePrevBtn = document.getElementById('bubblePrevBtn');
  const bubbleNextBtn = document.getElementById('bubbleNextBtn');
  const mapBackToCakeBtn = document.getElementById('mapBackToCakeBtn');
  const replayMapFlightBtn = document.getElementById('replayMapFlightBtn');

  // MEMORY MAP CHECKPOINT DATA (4 Stops along the zig-zag flight journey)
  // Stop 1 & Stop 3 (Odd #1, #3): Crests at y=150 -> Bubble opens BELOW (placement-bottom)
  // Stop 2 & Stop 4 (Even #2, #4): Dips at y=670 -> Bubble opens ABOVE (placement-top)
  const MEMORY_CHECKPOINTS = [
    {
      stopIndex: 0,
      progress: 0.0,
      x: 480,
      y: 150,
      placement: 'bottom',
      title: 'Where It All Began ✨',
      image: 'assets/memory1.jpg',
      caption: 'From the very first day we crossed paths, who knew we’d end up sharing countless unforgettable memories, nonstop laughs, and inside jokes!'
    },
    {
      stopIndex: 1,
      progress: 0.3405,
      x: 1440,
      y: 670,
      placement: 'top',
      title: 'Unfiltered Laughter & Chaos 😂',
      image: 'assets/memory2.jpg',
      caption: 'The kind of uncontrollable laughing fits where our stomachs hurt and nobody else understands what’s even funny except us.'
    },
    {
      stopIndex: 2,
      progress: 0.6810,
      x: 2400,
      y: 150,
      placement: 'bottom',
      title: 'Adventures & Midnight Talks 🚗',
      image: 'assets/memory3.jpg',
      caption: 'Spontaneous food runs, endless late-night drives, deep talks, and all the random escapades that made everyday life feel like a movie.'
    },
    {
      stopIndex: 3,
      progress: 1.0,
      x: 3280,
      y: 670,
      placement: 'top',
      title: 'To Forever & Beyond 🌟',
      image: 'assets/memory4.jpg',
      caption: 'Here’s to another year of being an absolute legend. No matter where life takes us, you’ll always have a best friend in me. Happy Birthday Shark 🦈!'
    }
  ];

  let currentModalStep = 1;
  let page2TimeoutIds = [];
  let flightTrackLength = 1000;
  let currentFlightProgress = 0.0;
  let currentStopIndex = 0;
  let isPlaneFlying = false;

  function showCelebrationStep(step) {
    currentModalStep = step;
    if (modalStep1) modalStep1.style.display = step === 1 ? 'block' : 'none';
    if (modalStep2) modalStep2.style.display = step === 2 ? 'block' : 'none';
    if (modalStep3) modalStep3.style.display = step === 3 ? 'block' : 'none';
  }

  // ========================================================
  // WEB AUDIO SYNTHESIZER
  // ========================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft wooden / marimba key tap
  function playKeySound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Gentle error buzz
  function playErrorSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(170, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Comedic "Wah-Wah-Wah-Waaahhh" Sad Trombone / Boo Sound
  function playBooSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // 4-tone descending sad trombone notes
      const notes = [
        { freq: 164.81, start: 0, dur: 0.26 },        // E3
        { freq: 155.56, start: 0.28, dur: 0.26 },     // Eb3
        { freq: 146.83, start: 0.56, dur: 0.26 },     // D3
        { freq: 138.59, start: 0.84, dur: 0.75, slide: 112.0 } // Db3 sliding down to 112 Hz
      ];

      notes.forEach((n) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        if (n.slide) {
          osc.frequency.linearRampToValueAtTime(n.slide, now + n.start + n.dur);
        }

        // Low-pass filter for muted brass trombone timbre
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.24, now + n.start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch (e) {
      console.warn('Boo sound error:', e);
    }
  }

  // Sweet celebratory chime melody (C5 -> E5 -> G5 -> C6)
  function playSuccessSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + index * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.1 + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + index * 0.1);
        osc.stop(audioCtx.currentTime + index * 0.1 + 0.45);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Gentle match / candle ignite sound
  function playCandleLightSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Party Popper "POP!" Sound
  function playPopperSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start();
      whiteNoise.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn('Popper sound error:', e);
    }
  }

  // Celebratory Fanfare (G4 -> C5 -> E5 -> G5 -> C6)
  function playCelebrationFanfare() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const chord = [392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.7);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.7);
      });
    } catch (e) {
      console.warn('Fanfare sound error:', e);
    }
  }

  // Soft whoosh when blowing candles
  function playBlowSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.35);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start();
      whiteNoise.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn('Blow sound error:', e);
    }
  }

  // Soft knife slice sound
  function playSliceSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 0.2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.2);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start();
      whiteNoise.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.warn('Slice sound error:', e);
    }
  }

  // Paper flutter / magical chime sound for letter/plane
  function playLetterOpenSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 880.00, 1046.50]; // C5 -> E5 -> A5 -> C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.35);
      });
    } catch (e) {
      console.warn('Letter open sound error:', e);
    }
  }

  // Soft whoosh sound for paper plane soaring through clouds
  function playFlightWhooshSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.6);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.18;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1150, audioCtx.currentTime + 0.28);
      filter.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.6);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.24, audioCtx.currentTime + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start();
      whiteNoise.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn('Flight sound error:', e);
    }
  }

  // Gentle bright chime when reaching each checkpoint stop
  function playChimeSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const chimeNotes = [783.99, 1046.50]; // G5 -> C6
      chimeNotes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.45);
      });
    } catch (e) {
      console.warn('Chime sound error:', e);
    }
  }

  // ========================================================
  // PASSCODE LOGIC & DISPLAY
  // ========================================================
  function updateDisplay() {
    slots.forEach((slot, index) => {
      const textSpan = slot.querySelector('.slot-text');
      if (index < currentPasscode.length) {
        textSpan.textContent = '*';
        slot.classList.add('filled');
      } else {
        textSpan.textContent = '';
        slot.classList.remove('filled', 'error', 'success');
      }
    });
  }

  function addDigit(digit) {
    if (isChecking) return;
    if (currentPasscode.length < MAX_DIGITS) {
      currentPasscode += digit;
      playKeySound();
      updateDisplay();
      clearFeedback();
    }
  }

  function removeDigit() {
    if (isChecking) return;
    if (currentPasscode.length > 0) {
      currentPasscode = currentPasscode.slice(0, -1);
      playKeySound();
      updateDisplay();
      clearFeedback();
    }
  }

  function clearAll() {
    if (isChecking) return;
    currentPasscode = '';
    updateDisplay();
    clearFeedback();
  }

  function clearFeedback() {
    feedbackBanner.textContent = '';
    slots.forEach(s => s.classList.remove('shake', 'error', 'success'));
  }

  function showFeedback(text, isError = true) {
    feedbackBanner.textContent = text;
    feedbackBanner.style.color = isError ? '#8c2a1a' : '#236c39';
  }

  // Verify Passcode
  function verifyPasscode() {
    if (isChecking) return;

    if (currentPasscode.length < MAX_DIGITS) {
      showFeedback('Please enter all 4 digits ♡', true);
      slots.forEach(s => s.classList.add('shake'));
      playErrorSound();
      setTimeout(() => {
        slots.forEach(s => s.classList.remove('shake'));
      }, 500);
      return;
    }

    isChecking = true;

    if (currentPasscode === CORRECT_PASSCODE) {
      // SUCCESS!
      slots.forEach(s => s.classList.add('success'));
      showFeedback('Passcode accepted! ✨', false);
      playSuccessSound();
      triggerConfetti();

      setTimeout(() => {
        showCelebrationStep(1);
        celebrationOverlay.classList.add('active');
        isChecking = false;
      }, 700);

    } else {
      // INCORRECT PASSCODE: Play Boo / Womp-Womp Sound & Show Error Popup
      slots.forEach(s => {
        s.classList.add('error');
        s.classList.add('shake');
      });
      showFeedback('Incorrect passcode! 👻', true);
      playBooSound();

      setTimeout(() => {
        slots.forEach(s => {
          s.classList.remove('shake');
        });
        if (errorOverlay) {
          errorOverlay.classList.add('active');
        }
        isChecking = false;
      }, 450);
    }
  }

  // ========================================================
  // CELEBRATION CONFETTI
  // ========================================================
  function triggerConfetti() {
    if (typeof confetti === 'function') {
      const colors = ['#f4d08a', '#e8b472', '#ffffff', '#e38b75', '#d47355'];

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: colors
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: colors
        });
      }, 250);
    }
  }

  // ========================================================
  // KEYPAD INTERACTION
  // ========================================================
  keypadGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.keypad-btn');
    if (!btn) return;

    initAudio();
    const key = btn.dataset.key;

    if (key >= '0' && key <= '9') {
      addDigit(key);
    } else if (key === '#') {
      removeDigit();
    } else if (key === '*') {
      playKeySound();
    }
  });

  enterBtn.addEventListener('click', () => {
    initAudio();
    verifyPasscode();
  });

  // Physical Keyboard Support
  window.addEventListener('keydown', (e) => {
    // If error modal is active, Enter or Escape closes it
    if (errorOverlay && errorOverlay.classList.contains('active')) {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        closeErrorModal();
      }
      return;
    }

    if (celebrationOverlay && celebrationOverlay.classList.contains('active')) {
      if (e.key === 'Enter') {
        if (currentModalStep === 1 && step1YesBtn) step1YesBtn.click();
        else if (currentModalStep === 2 && step2YesBtn) step2YesBtn.click();
        else if (currentModalStep === 3 && step3ContinueBtn) step3ContinueBtn.click();
      } else if (e.key === 'Escape') {
        if (currentModalStep === 1 && step1NoBtn) step1NoBtn.click();
        else if (currentModalStep === 2 && step2NoBtn) step2NoBtn.click();
        else if (currentModalStep === 3 && step3ContinueBtn) step3ContinueBtn.click();
      }
      return;
    }

    if (letterOverlay && letterOverlay.classList.contains('active')) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        closeLetterModal();
      }
      return;
    }

    if (page2Container && page2Container.style.display === 'flex') {
      if (e.key === 'Escape') {
        if (backToLockBtn) backToLockBtn.click();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (blowCandlesBtn && !blowCandlesBtn.disabled) blowCandlesBtn.click();
      }
      return;
    }

    initAudio();

    if (e.key >= '0' && e.key <= '9') {
      addDigit(e.key);
      highlightKey(e.key);
    } else if (e.key === 'Backspace') {
      removeDigit();
      highlightKey('#');
    } else if (e.key === 'Enter') {
      enterBtn.classList.add('active');
      setTimeout(() => enterBtn.classList.remove('active'), 150);
      verifyPasscode();
    } else if (e.key === 'Escape') {
      clearAll();
    }
  });

  function closeErrorModal() {
    if (errorOverlay) {
      errorOverlay.classList.remove('active');
    }
    currentPasscode = '';
    updateDisplay();
    clearFeedback();
  }

  function highlightKey(key) {
    const btn = document.querySelector(`.keypad-btn[data-key="${key}"]`);
    if (btn) {
      btn.classList.add('active-press');
      setTimeout(() => btn.classList.remove('active-press'), 150);
    }
  }

  // Sound Toggle
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.title = soundEnabled ? 'Sound Effects: ON' : 'Sound Effects: MUTED';
  });

  // Error Modal Action
  if (errorTryAgainBtn) {
    errorTryAgainBtn.addEventListener('click', () => {
      closeErrorModal();
    });
  }

  // ========================================================
  // CELEBRATION MULTI-STEP MODAL & PAGE 2 CONTROLLER
  // ========================================================
  function clearPage2Timeouts() {
    page2TimeoutIds.forEach(id => clearTimeout(id));
    page2TimeoutIds = [];
  }

  function proceedToNextPage() {
    celebrationOverlay.classList.remove('active');
    startPage2Celebration();
  }

  // Multi-step modal navigation
  if (step1YesBtn) {
    step1YesBtn.addEventListener('click', () => {
      showCelebrationStep(2);
    });
  }

  if (step1NoBtn) {
    step1NoBtn.addEventListener('click', () => {
      showCelebrationStep(3);
    });
  }

  if (step2YesBtn) {
    step2YesBtn.addEventListener('click', () => {
      proceedToNextPage();
    });
  }

  if (step2NoBtn) {
    step2NoBtn.addEventListener('click', () => {
      showCelebrationStep(3);
    });
  }

  if (step3ContinueBtn) {
    step3ContinueBtn.addEventListener('click', () => {
      showCelebrationStep(2);
    });
  }

  // ========================================================
  // PAGE 2: CELEBRATION SEQUENCE
  // (Full Dark Room -> Candle Lighting -> Lights On & Poppers -> Happy Birthday Shark 🦈)
  // ========================================================
  function startPage2Celebration() {
    clearPage2Timeouts();

    if (passcodeStage) passcodeStage.style.display = 'none';
    if (page2Container) page2Container.style.display = 'flex';

    // Reset cake slice, paper plane, and letter
    if (birthdayCake) birthdayCake.classList.remove('cake-sliced');
    if (magicPaperPlane) magicPaperPlane.classList.remove('revealed');
    closeLetterModal();

    // 1. Initial State: Full Dark Room
    page2Container.classList.add('dark-mode');
    page2Container.classList.remove('lights-on');

    if (candlelightHalo) {
      candlelightHalo.style.opacity = '0';
      candlelightHalo.style.transform = 'translate(-50%, -50%) scale(0.3)';
    }

    if (blowCandlesBtn) {
      blowCandlesBtn.textContent = '🎂 Make a Wish & Blow the Candles! 💨';
      blowCandlesBtn.disabled = false;
    }

    // Reset candles to unlit
    candleItems.forEach(candle => {
      candle.classList.remove('lit', 'blown');
    });

    // 2. Sequential Candle Lighting (Candles 1 to 5)
    const haloSteps = [
      { scale: 0.55, opacity: 0.35 },
      { scale: 0.75, opacity: 0.52 },
      { scale: 0.95, opacity: 0.70 },
      { scale: 1.15, opacity: 0.86 },
      { scale: 1.35, opacity: 1.0 }
    ];

    candleItems.forEach((candle, index) => {
      const delay = 600 + index * 520;
      const tid = setTimeout(() => {
        candle.classList.add('lit');
        playCandleLightSound();

        if (candlelightHalo && haloSteps[index]) {
          candlelightHalo.style.opacity = haloSteps[index].opacity;
          candlelightHalo.style.transform = `translate(-50%, -50%) scale(${haloSteps[index].scale})`;
        }
      }, delay);
      page2TimeoutIds.push(tid);
    });

    // 3. LIGHTS ON + POPPERS + "HAPPY BIRTHDAY SHARK 🦈"
    const lightsOnDelay = 600 + candleItems.length * 520 + 800; // ~3800ms
    const tidLights = setTimeout(() => {
      page2Container.classList.remove('dark-mode');
      page2Container.classList.add('lights-on');

      playPopperSound();
      playCelebrationFanfare();

      // Poppers animation trigger
      if (leftPopper) {
        leftPopper.classList.add('popping');
        setTimeout(() => leftPopper.classList.remove('popping'), 600);
      }
      if (rightPopper) {
        rightPopper.classList.add('popping');
        setTimeout(() => rightPopper.classList.remove('popping'), 600);
      }

      // Dual confetti popper cannons
      triggerPoppersConfetti();
    }, lightsOnDelay);
    page2TimeoutIds.push(tidLights);
  }

  function triggerPoppersConfetti() {
    if (typeof confetti === 'function') {
      const colors = ['#f4d08a', '#e8b472', '#ffffff', '#e38b75', '#6fb9a5', '#e59db4'];

      // Left cannon blast
      confetti({
        particleCount: 85,
        angle: 55,
        spread: 65,
        origin: { x: 0.08, y: 0.72 },
        colors: colors
      });

      // Right cannon blast
      confetti({
        particleCount: 85,
        angle: 125,
        spread: 65,
        origin: { x: 0.92, y: 0.72 },
        colors: colors
      });

      // Ambient center celebration shower
      setTimeout(() => {
        confetti({
          particleCount: 65,
          spread: 90,
          origin: { y: 0.45 },
          colors: colors
        });
      }, 350);
    }
  }

  // Make a Wish & Blow Candles Button Action -> Cut Slice -> Reveal Paper Plane
  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener('click', () => {
      playBlowSound();

      // Blow all flames
      candleItems.forEach(candle => {
        candle.classList.remove('lit');
        candle.classList.add('blown');
      });

      // Star celebration confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 85,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#ffe600', '#ffd000', '#ffffff', '#ff9900', '#ff6b6b']
        });
      }

      blowCandlesBtn.textContent = '🍰 Cutting a slice for you...';
      blowCandlesBtn.disabled = true;

      // 1. Cut slice out of the cake
      setTimeout(() => {
        playSliceSound();
        if (birthdayCake) birthdayCake.classList.add('cake-sliced');
      }, 850);

      // 2. Reveal Magic Paper Plane from the slice
      setTimeout(() => {
        playLetterOpenSound();
        if (magicPaperPlane) {
          magicPaperPlane.classList.add('revealed');
        }
        blowCandlesBtn.textContent = '✈️ Tap the paper plane to start your journey! 🗺️';
      }, 1650);
    });
  }

  // ========================================================
  // PAGE 3: MEMORY MAP & CLOUD FLIGHT TRANSITION
  // ========================================================

  // 1. Launch Cloud Flight Transition from Page 2 to Page 3
  function launchCloudFlightTransition() {
    playFlightWhooshSound();

    if (cloudTransitionOverlay) {
      cloudTransitionOverlay.style.display = 'flex';
      cloudTransitionOverlay.classList.remove('active');
      void cloudTransitionOverlay.offsetWidth; // Force CSS reflow to restart animations
      cloudTransitionOverlay.classList.add('active');
    }

    // Mid-flight (~750ms): swap views behind the cloud curtain
    setTimeout(() => {
      if (passcodeStage) passcodeStage.style.display = 'none';
      if (page2Container) page2Container.style.display = 'none';
      if (flightMapPage) flightMapPage.style.display = 'flex';

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Initialize map path and position plane at Stop 1 (index 0)
      initFlightTrack();
      flyPlaneToStop(0, false);
    }, 750);

    // End transition (~1550ms): fade out cloud curtain
    setTimeout(() => {
      if (cloudTransitionOverlay) {
        cloudTransitionOverlay.classList.remove('active');
        setTimeout(() => {
          cloudTransitionOverlay.style.display = 'none';
        }, 400);
      }
      playChimeSound();

      // Confetti shower celebrating arrival on the map
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.35 },
          colors: ['#ffe600', '#f48c78', '#69c3a9', '#ffffff', '#e8a93a']
        });
      }

      // Open Speech Bubble for Stop 1
      showSpeechBubbleAtStop(0);
    }, 1550);
  }

  // Camera Panning: Smoothly centers the viewport window around the plane (both X and Y)
  function panCameraToPlane(planeX, planeY) {
    if (!mapPanningCanvas || !mapViewportWindow) return;
    const viewportWidth = mapViewportWindow.clientWidth || window.innerWidth;
    const viewportHeight = mapViewportWindow.clientHeight || window.innerHeight;
    const canvasWidth = 3700;
    const canvasHeight = 840;

    // Horizontal scroll
    const maxScrollX = Math.max(0, canvasWidth - viewportWidth);
    const targetScrollX = Math.max(0, Math.min(maxScrollX, planeX - (viewportWidth / 2)));

    // Vertical framing to ensure plane and entire enlarged bubble are visible
    const maxScrollY = Math.max(0, canvasHeight - viewportHeight);
    let targetScrollY = 0;
    if (maxScrollY > 0) {
      if (planeY !== undefined) {
        // Crests (Stop 1 & 3): plane at 150, bubble opens below to ~695 -> center interest is ~425
        // Dips (Stop 2 & 4): plane at 670, bubble opens above to ~135 -> center interest is ~405
        const focusY = (planeY < 400) ? 425 : 405;
        targetScrollY = Math.max(0, Math.min(maxScrollY, focusY - (viewportHeight / 2)));
      } else {
        targetScrollY = maxScrollY / 2;
      }
    }

    mapPanningCanvas.style.transform = `translate3d(-${targetScrollX}px, -${targetScrollY}px, 0)`;
  }

  // Initialize Flight Track length & pin alignment
  function initFlightTrack() {
    if (flightTrack) {
      flightTrackLength = flightTrack.getTotalLength() || 3266;
      if (trackMaskPath) {
        trackMaskPath.style.strokeDasharray = `${flightTrackLength}`;
        trackMaskPath.style.strokeDashoffset = `${flightTrackLength}`;
      }
    }
    alignPinsToFlightTrack();
  }

  // Dynamically pin checkpoint markers precisely along the SVG curve
  function alignPinsToFlightTrack() {
    if (!flightTrack) return;
    const len = flightTrackLength || flightTrack.getTotalLength() || 3266;
    MEMORY_CHECKPOINTS.forEach((checkpoint, idx) => {
      const pin = document.querySelector(`.checkpoint-pin[data-stop="${idx}"]`);
      if (pin) {
        let ptX = checkpoint.x;
        let ptY = checkpoint.y;
        if (len && len > 0) {
          const pt = flightTrack.getPointAtLength(len * checkpoint.progress);
          if (pt && (pt.x !== 0 || pt.y !== 0)) {
            ptX = pt.x;
            ptY = pt.y;
          }
        }
        pin.style.left = `${ptX}px`;
        pin.style.top = `${ptY}px`;
      }
    });
  }

  // Position paper plane at exact progress [0.0 - 1.0] and align rotation to curve tangent
  function positionPlaneAtProgress(progress) {
    if (!flightTrack || !mapFlyingPlane) return;
    const len = flightTrackLength || flightTrack.getTotalLength() || 3266;
    if (!len || len === 0) return;
    const dist = Math.max(0, Math.min(len, len * progress));
    const pt = flightTrack.getPointAtLength(dist);

    // Sample adjacent points along curve to determine instantaneous flight tangent
    const sampleOffset = 4;
    const aheadDist = Math.min(len, dist + sampleOffset);
    const behindDist = Math.max(0, dist - sampleOffset);
    const ptAhead = flightTrack.getPointAtLength(aheadDist);
    const ptBehind = flightTrack.getPointAtLength(behindDist);

    let angle = Math.atan2(ptAhead.y - ptBehind.y, ptAhead.x - ptBehind.x) * (180 / Math.PI);
    if (isNaN(angle)) angle = 0;

    mapFlyingPlane.style.left = `${pt.x}px`;
    mapFlyingPlane.style.top = `${pt.y}px`;
    mapFlyingPlane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Update traveled track mask to reveal vibrant highlighted orange dots
    if (trackMaskPath) {
      trackMaskPath.style.strokeDashoffset = `${len * (1 - progress)}`;
    }

    // Pan camera to follow plane in both X and Y
    panCameraToPlane(pt.x, pt.y);
  }

  // Speech Bubble: Show memory popup anchored at active stop
  function showSpeechBubbleAtStop(stopIndex) {
    if (!mapSpeechBubble || !flightTrack) return;
    const data = MEMORY_CHECKPOINTS[stopIndex];
    if (!data) return;

    const len = flightTrackLength || flightTrack.getTotalLength() || 3266;
    let pinX = data.x;
    let pinY = data.y;
    if (len && len > 0) {
      const pt = flightTrack.getPointAtLength(len * data.progress);
      if (pt && (pt.x !== 0 || pt.y !== 0)) {
        pinX = pt.x;
        pinY = pt.y;
      }
    }

    // Update photo, title, and caption inside the speech bubble
    if (bubblePhoto) {
      bubblePhoto.src = data.image;
      bubblePhoto.alt = data.title;
    }
    if (bubbleTitle) bubbleTitle.textContent = data.title;
    if (bubbleCaption) bubbleCaption.textContent = data.caption;

    // Update navigation button states
    if (bubblePrevBtn) {
      bubblePrevBtn.disabled = stopIndex === 0;
    }
    if (bubbleNextBtn) {
      if (stopIndex < MEMORY_CHECKPOINTS.length - 1) {
        bubbleNextBtn.textContent = 'Fly to Next Stop ✈️';
      } else {
        bubbleNextBtn.textContent = 'Read Birthday Note 💌';
      }
    }

    // Explicit placement:
    // Odd stops (Stop 1 & Stop 3, indices 0 & 2): crests -> ALWAYS placement-bottom (opens BELOW)
    // Even stops (Stop 2 & Stop 4, indices 1 & 3): dips -> ALWAYS placement-top (opens ABOVE)
    const isOddStop = (stopIndex === 0 || stopIndex === 2);
    const placement = isOddStop ? 'bottom' : 'top';
    mapSpeechBubble.className = `map-speech-bubble placement-${placement}`;
    mapSpeechBubble.style.display = 'flex';

    // 44px vertical clearance from waypoint dot
    if (placement === 'bottom') {
      mapSpeechBubble.style.top = `${pinY + 44}px`;
    } else {
      mapSpeechBubble.style.top = `${pinY - 44}px`;
    }

    // Horizontal anchor: centered on pinX, clamped within canvas bounds for 620px bubble
    const bubbleWidth = 620;
    const halfWidth = bubbleWidth / 2;
    const canvasWidth = 3700;
    const clampedX = Math.max(halfWidth + 24, Math.min(canvasWidth - halfWidth - 24, pinX));
    mapSpeechBubble.style.left = `${clampedX}px`;

    // Adjust tail position so it always points precisely at pinX
    const tail = mapSpeechBubble.querySelector('.bubble-tail');
    if (tail) {
      const tailOffset = pinX - clampedX;
      tail.style.left = `calc(50% + ${tailOffset}px)`;
    }

    // Pan camera to frame this stop and bubble perfectly
    panCameraToPlane(pinX, pinY);

    // Force CSS reflow and trigger pop-in bounce animation
    void mapSpeechBubble.offsetWidth;
    mapSpeechBubble.classList.add('open');
  }

  // Speech Bubble: Hide memory popup
  function hideSpeechBubble() {
    if (mapSpeechBubble) {
      mapSpeechBubble.classList.remove('open');
    }
  }

  // Smoothly fly paper plane along SVG dotted path to target stop
  function flyPlaneToStop(targetStopIndex, smooth = true) {
    if (targetStopIndex < 0 || targetStopIndex >= MEMORY_CHECKPOINTS.length) return;
    const targetData = MEMORY_CHECKPOINTS[targetStopIndex];
    const targetProgress = targetData.progress;

    // Hide speech bubble during flight
    hideSpeechBubble();

    if (!smooth) {
      currentFlightProgress = targetProgress;
      currentStopIndex = targetStopIndex;
      positionPlaneAtProgress(targetProgress);
      updateStopUI(targetStopIndex);
      return;
    }

    if (isPlaneFlying) return;
    isPlaneFlying = true;

    playFlightWhooshSound();

    const startProgress = currentFlightProgress;
    const progressDiff = targetProgress - startProgress;
    const duration = Math.max(750, Math.abs(progressDiff) * 1500); // 750ms - 1500ms based on distance
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animateFlight(currentTime) {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      const easedT = easeInOutCubic(t);

      currentFlightProgress = startProgress + progressDiff * easedT;
      positionPlaneAtProgress(currentFlightProgress);

      if (t < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        currentFlightProgress = targetProgress;
        positionPlaneAtProgress(targetProgress);
        currentStopIndex = targetStopIndex;
        isPlaneFlying = false;

        playChimeSound();
        updateStopUI(targetStopIndex);

        // Small sparkle celebration when landing on the stop
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 28,
            spread: 50,
            origin: { y: 0.52 },
            colors: ['#f4d08a', '#e8b472', '#ffffff', '#e38b75', '#6fb9a5']
          });
        }

        // Pop open the speech bubble at the new stop!
        showSpeechBubbleAtStop(targetStopIndex);
      }
    }

    requestAnimationFrame(animateFlight);
  }

  // Update active state on map pins
  function updateStopUI(stopIndex) {
    checkpointPins.forEach((pin, idx) => {
      pin.classList.toggle('active', idx === stopIndex);
    });
  }

  // Paper Plane Click Action on Cake -> Cloud Flight Transition
  if (magicPaperPlane) {
    magicPaperPlane.addEventListener('click', () => {
      launchCloudFlightTransition();
    });
    magicPaperPlane.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        launchCloudFlightTransition();
      }
    });
  }

  // Checkpoint Map Pins Click
  checkpointPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const stop = parseInt(pin.getAttribute('data-stop'), 10);
      if (!isNaN(stop)) {
        if (stop === currentStopIndex) {
          // If already on this stop, toggle/open speech bubble
          if (mapSpeechBubble && mapSpeechBubble.classList.contains('open')) {
            hideSpeechBubble();
          } else {
            showSpeechBubbleAtStop(stop);
          }
        } else {
          flyPlaneToStop(stop);
        }
      }
    });
  });

  // Clicking the flying paper plane itself opens the memory bubble
  if (mapFlyingPlane) {
    mapFlyingPlane.addEventListener('click', () => {
      showSpeechBubbleAtStop(currentStopIndex);
    });
  }

  // Speech Bubble Controls
  if (bubbleCloseBtn) {
    bubbleCloseBtn.addEventListener('click', hideSpeechBubble);
  }

  if (bubblePrevBtn) {
    bubblePrevBtn.addEventListener('click', () => {
      if (currentStopIndex > 0) {
        flyPlaneToStop(currentStopIndex - 1);
      }
    });
  }

  if (bubbleNextBtn) {
    bubbleNextBtn.addEventListener('click', () => {
      if (currentStopIndex < MEMORY_CHECKPOINTS.length - 1) {
        flyPlaneToStop(currentStopIndex + 1);
      } else {
        // At final destination, reveal the heartfelt birthday letter
        openLetterModal();
      }
    });
  }

  // Back to Cake Button from Map
  if (mapBackToCakeBtn) {
    mapBackToCakeBtn.addEventListener('click', () => {
      hideSpeechBubble();
      if (flightMapPage) flightMapPage.style.display = 'none';
      if (page2Container) page2Container.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Replay Map Flight Button (Flies back to Stop 1)
  if (replayMapFlightBtn) {
    replayMapFlightBtn.addEventListener('click', () => {
      flyPlaneToStop(0);
    });
  }

  // Window resize keeps map pins aligned with SVG track
  window.addEventListener('resize', () => {
    if (flightMapPage && flightMapPage.style.display !== 'none') {
      initFlightTrack();
      positionPlaneAtProgress(currentFlightProgress);
      if (mapSpeechBubble && mapSpeechBubble.classList.contains('open')) {
        showSpeechBubbleAtStop(currentStopIndex);
      }
    }
  });

  // Birthday Letter Modal Functions
  function openLetterModal() {
    playLetterOpenSound();
    if (letterOverlay) {
      letterOverlay.style.display = 'flex';
      setTimeout(() => {
        letterOverlay.classList.add('active');
      }, 20);
    }
  }

  function closeLetterModal() {
    if (letterOverlay) {
      letterOverlay.classList.remove('active');
      setTimeout(() => {
        letterOverlay.style.display = 'none';
      }, 350);
    }
  }

  if (letterCloseBtn) {
    letterCloseBtn.addEventListener('click', closeLetterModal);
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', closeLetterModal);
  }

  // Navigation: Back to lock screen & Replay
  if (backToLockBtn) {
    backToLockBtn.addEventListener('click', () => {
      clearPage2Timeouts();
      page2Container.style.display = 'none';
      if (flightMapPage) flightMapPage.style.display = 'none';
      passcodeStage.style.display = 'flex';
      currentPasscode = '';
      showCelebrationStep(1);
      updateDisplay();
      clearFeedback();
    });
  }

  if (replayCelebrationBtn) {
    replayCelebrationBtn.addEventListener('click', () => {
      startPage2Celebration();
    });
  }

  updateDisplay();
});
