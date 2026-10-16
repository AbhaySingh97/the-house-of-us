/**
 * ============================================================================
 * PROCEDURAL ROMANTIC AUDIO SYNTHESIZER (WEB AUDIO API)
 * ============================================================================
 * 
 * Provides an emotional, intimate soundscape without requiring external
 * audio files. Synthesizes rain on windows, warm romantic ambient chords,
 * footsteps, wooden door creaks, chimes, and puzzle solve fanfares.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private rainGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVol: number = 0.75;
  private musicVol: number = 0.65;
  private sfxVol: number = 0.8;

  private rainSource: AudioNode | null = null;
  private musicInterval: number | null = null;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Ambient Rain bus
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      this.isInitialized = true;
      this.startRainAmbience();
      this.startAmbientRomanticMusic();
    } catch (e) {
      console.warn("Web Audio API not supported or initialized:", e);
    }
  }

  public setVolumes(master: number, music: number, sfx: number, muted: boolean) {
    this.masterVol = master;
    this.musicVol = music;
    this.sfxVol = sfx;
    this.isMuted = muted;

    if (!this.ctx || !this.masterGain || !this.musicGain || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVol, t, 0.05);
    this.musicGain.gain.setTargetAtTime(this.musicVol, t, 0.05);
    this.sfxGain.gain.setTargetAtTime(this.sfxVol, t, 0.05);
  }

  // --- PROCEDURAL RAIN ON GLASS ---
  private startRainAmbience() {
    if (!this.ctx || !this.rainGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise with gentle droplets
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 120;

      noiseNode.connect(highpass);
      highpass.connect(filter);
      filter.connect(this.rainGain);
      noiseNode.start();
      this.rainSource = noiseNode;
    } catch (e) {
      console.warn("Rain ambience generation error:", e);
    }
  }

  // --- PROCEDURAL ROMANTIC CHORDS (Ethereal Piano/Pad) ---
  private startAmbientRomanticMusic() {
    if (this.musicInterval !== null) return;

    // Gentle chord progressions in C / A minor / F major
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
      [174.61, 261.63, 329.63, 392.00], // Fmaj7 (F3, C4, E4, G4)
      [196.00, 293.66, 392.00, 440.00]  // Gsus  (G3, D4, G4, A4)
    ];

    let chordIndex = 0;

    const playNextPad = () => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const chord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      const duration = 7.5;
      const t = this.ctx.currentTime;

      chord.forEach((freq, noteIdx) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const noteFilter = this.ctx.createBiquadFilter();

        osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        // Gentle filter sweep
        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(400, t);
        noteFilter.frequency.exponentialRampToValueAtTime(750, t + 2);
        noteFilter.frequency.exponentialRampToValueAtTime(350, t + duration);

        // Soft envelope: slow fade in, gentle sustain, soft fade out
        noteGain.gain.setValueAtTime(0.0001, t);
        noteGain.gain.exponentialRampToValueAtTime(0.05, t + 2);
        noteGain.gain.exponentialRampToValueAtTime(0.035, t + duration - 2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + duration);
      });
    };

    // Play immediately then loop
    playNextPad();
    this.musicInterval = window.setInterval(playNextPad, 6800);
  }

  // --- SOUND EFFECTS ---

  public playFootstep() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playDoorCreak(opening: boolean = true) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Creak oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.Q.value = 5;

    if (opening) {
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(260, t + 0.35);
      osc.frequency.linearRampToValueAtTime(190, t + 0.6);
      filter.frequency.setValueAtTime(450, t);
    } else {
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.4);
      filter.frequency.setValueAtTime(320, t);
    }

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.65);

    // Latch click
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const ct = this.ctx.currentTime;
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(800, ct);
      click.frequency.exponentialRampToValueAtTime(120, ct + 0.05);
      clickGain.gain.setValueAtTime(0.15, ct);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ct + 0.05);

      click.connect(clickGain);
      clickGain.connect(this.sfxGain);
      click.start(ct);
      click.stop(ct + 0.05);
    }, opening ? 80 : 500);
  }

  public playPickup() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.001, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.12, t + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.35);
    });
  }

  public playChime() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1174.66, t); // D6

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  public playLanternIgnite(pitchFactor: number = 1.0) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const notes = [440, 554.37, 659.25].map(n => n * pitchFactor);
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0.08, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.7);
    });
  }

  public playSuccess() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Uplifting romantic harp arpeggio
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.09);

      gain.gain.setValueAtTime(0.001, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.16, t + i * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.85);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.9);
    });
  }

  public playError() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.setValueAtTime(150, t + 0.12);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  public playFinalReveal() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Resonant celestial chord
    const freqs = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);

      gain.gain.setValueAtTime(0.001, t + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.2, t + i * 0.07 + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.07);
      osc.stop(t + 4.5);
    });
  }

  public dispose() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.rainSource) {
      try { (this.rainSource as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.rainSource = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
    this.isInitialized = false;
  }
}

export const soundEngine = new SoundEngine();
