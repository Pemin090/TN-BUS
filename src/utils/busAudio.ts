// Web Audio API synthesizer for realistic bus sounds: Conductor Bell and Pneumatic Air Horn

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play authentic Tamil Nadu bus conductor two-stroke brass bell ("Tring! Tring!")
 */
export function playConductorBell(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Stroke 1
  playBellStroke(ctx, now, 2200);
  // Stroke 2 shortly after
  playBellStroke(ctx, now + 0.14, 2350);
}

function playBellStroke(ctx: AudioContext, startTime: number, freq: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  // Slight metallic harmonics
  osc.frequency.exponentialRampToValueAtTime(freq * 0.98, startTime + 0.25);

  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(0.25, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.36);
}

/**
 * Play authentic Tamil Nadu Highway dual-tone bus air horn ("Pomp-Pomp!")
 */
export function playBusAirHorn(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.45;

  // Dual tone air horn frequencies: 310 Hz and 370 Hz
  const freqs = [310, 370, 620];

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = idx === 2 ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + duration);

    // Filter to give that pneumatic air-chamber body
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.setValueAtTime(0.12, now + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  });
}
