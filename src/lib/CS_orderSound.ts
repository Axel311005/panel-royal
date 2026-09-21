let CS_audioContext: AudioContext | null = null;

function CS_getAudioContext(): AudioContext {
  if (!CS_audioContext) {
    CS_audioContext = new AudioContext();
  }
  return CS_audioContext;
}

export function CS_unlockOrderAudio(): void {
  const ctx = CS_getAudioContext();
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
}

function CS_playBeep(
  ctx: AudioContext,
  start: number,
  freq: number,
  duration: number,
  volume: number,
  type: OscillatorType = "square"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function CS_playNewOrderSound(): void {
  try {
    const ctx = CS_getAudioContext();
    if (ctx.state === "suspended") return;

    const now = ctx.currentTime;
    const beepPattern = [880, 1100, 880, 1320];

    beepPattern.forEach((freq, i) => {
      CS_playBeep(ctx, now + i * 0.11, freq, 0.12, 0.42, "square");
    });

    beepPattern.forEach((freq, i) => {
      CS_playBeep(ctx, now + 0.55 + i * 0.11, freq, 0.12, 0.38, "square");
    });

    const siren = ctx.createOscillator();
    const sGain = ctx.createGain();
    siren.type = "sawtooth";
    siren.frequency.setValueAtTime(520, now + 0.35);
    siren.frequency.linearRampToValueAtTime(1600, now + 0.52);
    siren.frequency.linearRampToValueAtTime(680, now + 0.72);
    sGain.gain.setValueAtTime(0.0001, now + 0.35);
    sGain.gain.exponentialRampToValueAtTime(0.22, now + 0.4);
    sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    siren.connect(sGain);
    sGain.connect(ctx.destination);
    siren.start(now + 0.35);
    siren.stop(now + 0.78);
  } catch {
    /* navegador sin audio */
  }
}
