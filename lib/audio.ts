// ─────────────────────────────────────────────────────────────────────────────
// lib/audio.ts
// Native Web Audio API synthesizer for retro 8-bit sound effects.
// ─────────────────────────────────────────────────────────────────────────────

class SoundEffects {
  private ctx: AudioContext | null = null

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
  }

  playClick() {
    // Deprecated click sound as requested by user.
  }

  playSwosh() {
    this.init()
    if (!this.ctx) return
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    // Smooth retro 8-bit frequency sweep (swosh)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(100, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.04, now + 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  }

  playTyping(character?: 'pm_bot' | 'senior_dev' | 'frontend_dev' | 'dinesh' | 'you') {
    this.init()
    if (!this.ctx) return
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    let baseFreq = 180
    let rangeFreq = 120
    let duration = 0.05
    let type: OscillatorType = 'triangle'
    let volume = 0.05

    if (character === 'senior_dev') {
      // Sofía Rodríguez: Clear, high-pitched calm tone
      baseFreq = 280
      rangeFreq = 45
      type = 'triangle'
      duration = 0.045
      volume = 0.045
    } else if (character === 'pm_bot') {
      // Santiago Rivera: Mid-pitched, clean sine wave beeps
      baseFreq = 190
      rangeFreq = 50
      type = 'sine'
      duration = 0.045
      volume = 0.05
    } else if (character === 'frontend_dev') {
      // Nicolás Álvarez: Mid-pitch, retro game square wave bleeps
      baseFreq = 150
      rangeFreq = 50
      type = 'square'
      duration = 0.045
      volume = 0.02
    } else if (character === 'dinesh') {
      // Dinesh Patel: Low-mid pitch, deep retro triangle wave
      baseFreq = 120
      rangeFreq = 40
      type = 'triangle'
      duration = 0.05
      volume = 0.04
    } else if (character === 'you') {
      // Player typing
      baseFreq = 190
      rangeFreq = 80
      type = 'triangle'
      duration = 0.04
      volume = 0.04
    } else {
      // Default / CI logs
      baseFreq = 180
      rangeFreq = 120
      type = 'triangle'
      duration = 0.05
      volume = 0.05
    }

    osc.type = type
    osc.frequency.setValueAtTime(baseFreq + Math.random() * rangeFreq, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(baseFreq / 2.5, this.ctx.currentTime + duration)

    gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + duration)
  }

  playSuccess() {
    // Deprecated success arpeggio sound as requested by user.
  }

  playError() {
    this.init()
    if (!this.ctx) return
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.linearRampToValueAtTime(80, now + 0.3)

    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  }

  playNotification() {
    this.init()
    if (!this.ctx) return
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const now = this.ctx.currentTime

    const playNote = (freq: number, delay: number, duration: number) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + delay)
      
      gain.gain.setValueAtTime(0.04, now + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration)
      
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      
      osc.start(now + delay)
      osc.stop(now + delay + duration)
    }

    playNote(880, 0, 0.08)       // A5
    playNote(1320, 0.05, 0.2)     // E6
  }

  playStamp() {
    this.init()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const now = this.ctx.currentTime

    // 1. The Clang (metal impact transient)
    const osc1 = this.ctx.createOscillator()
    const gain1 = this.ctx.createGain()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(320, now)
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.12)
    gain1.gain.setValueAtTime(0.08, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    osc1.connect(gain1)
    gain1.connect(this.ctx.destination)

    // 2. The Thud (deep cardboard/wood desk resonance)
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(90, now)
    osc2.frequency.linearRampToValueAtTime(40, now + 0.3)
    gain2.gain.setValueAtTime(0.15, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc2.connect(gain2)
    gain2.connect(this.ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.12)
    osc2.start(now)
    osc2.stop(now + 0.3)
  }
}

export const sfx = new SoundEffects()
