/**
 * Peaceful Ambient Spiritual Audio Engine
 * Uses Web Audio API synthesizer for infinite soothing Tanpura / OM harmonic drone,
 * with volume control, mute, and auto-pausing on video playback.
 */

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.15; // Unobtrusive low volume
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfoNode: OscillatorNode | null = null;
  private wasPlayingBeforeVideo: boolean = false;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public play() {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      if (this.isPlaying) return;

      this.stop(); // Clear any existing

      const now = this.audioCtx.currentTime;

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      const currentVol = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(currentVol, 0.001), now + 2); // Soft 2-second fade-in
      this.masterGain.connect(this.audioCtx.destination);

      // Spiritual Drone Frequencies (Root C3 = 130.81Hz, Fifth G3 = 196.00Hz, Octave C4 = 261.63Hz, Warm harmonics)
      const freqs = [130.81, 196.00, 261.63, 392.00];

      // LFO for slow ambient breathing wave (0.1 Hz)
      this.lfoNode = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      this.lfoNode.frequency.setValueAtTime(0.12, now); // Slow 8-second swell
      lfoGain.gain.setValueAtTime(0.04, now);
      this.lfoNode.connect(lfoGain);
      this.lfoNode.start();

      this.oscillators = freqs.map((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const oscGain = this.audioCtx!.createGain();

        // Warm sine wave tones
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Mix volume per harmonic
        const baseGain = 0.08 / (idx + 1);
        oscGain.gain.setValueAtTime(baseGain, now);
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);

        osc.start(now);
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {
      console.warn("Ambient audio initialization failed:", e);
    }
  }

  public pause() {
    if (!this.audioCtx || !this.isPlaying) return;
    if (this.masterGain) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        this.stop();
      }, 850);
    } else {
      this.stop();
    }
  }

  public stop() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.oscillators = [];

    if (this.lfoNode) {
      try { this.lfoNode.stop(); this.lfoNode.disconnect(); } catch {}
      this.lfoNode = null;
    }

    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch {}
      this.masterGain = null;
    }

    this.isPlaying = false;
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      const targetVol = this.isMuted ? 0.0001 : this.volume;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(targetVol, 0.0001), now + 0.3);
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.setValueAtTime(Math.max(this.volume, 0.0001), now);
    }
  }

  /**
   * Called when a video starts playing in the platform
   */
  public onVideoPlay() {
    if (this.isPlaying) {
      this.wasPlayingBeforeVideo = true;
      this.pause();
    }
  }

  /**
   * Called when video stops playing or closes
   */
  public onVideoPauseOrEnded() {
    if (this.wasPlayingBeforeVideo) {
      this.wasPlayingBeforeVideo = false;
      this.play();
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume
    };
  }
}

export const ambientEngine = new AmbientAudioEngine();
