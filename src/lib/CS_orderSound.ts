let CS_audioContext: AudioContext | null = null;
let CS_alarmAudio: HTMLAudioElement | null = null;
let CS_alarmBlobUrl: string | null = null;
let CS_audioReady = false;

function CS_getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!CS_audioContext) {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    CS_audioContext = new Ctx();
  }
  return CS_audioContext;
}

function CS_buildAlarmWavBlobUrl(): string {
  const sampleRate = 44100;
  const durationSec = 0.85;
  const numSamples = Math.floor(sampleRate * durationSec);
  const bytesPerSample = 2;
  const dataSize = numSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const burst = Math.floor(t / 0.11) % 2 === 0 ? 1 : 0.35;
    const freq = 880 + (Math.floor(t / 0.11) % 4) * 110;
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.55 * burst;
    view.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, sample * 32767)), true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

function CS_getAlarmAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!CS_alarmBlobUrl) {
    CS_alarmBlobUrl = CS_buildAlarmWavBlobUrl();
  }
  if (!CS_alarmAudio) {
    CS_alarmAudio = new Audio(CS_alarmBlobUrl);
    CS_alarmAudio.preload = "auto";
  }
  return CS_alarmAudio;
}

async function CS_primeHtmlAudio(): Promise<boolean> {
  const audio = CS_getAlarmAudio();
  if (!audio) return false;
  try {
    audio.volume = 0.001;
    audio.currentTime = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    return true;
  } catch {
    return false;
  }
}

async function CS_primeWebAudio(): Promise<boolean> {
  const ctx = CS_getAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (ctx.state !== "running") return false;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
    return true;
  } catch {
    return false;
  }
}

/** Llamar en el primer clic/toque del usuario (requerido en producción / HTTPS). */
export async function CS_unlockOrderAudio(): Promise<boolean> {
  const htmlOk = await CS_primeHtmlAudio();
  const webOk = await CS_primeWebAudio();
  CS_audioReady = htmlOk || webOk;
  return CS_audioReady;
}

export function CS_isOrderAudioReady(): boolean {
  return CS_audioReady;
}

function CS_playBeepWeb(
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

async function CS_playWebAudioAlarm(): Promise<boolean> {
  const ctx = CS_getAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (ctx.state !== "running") return false;

    const now = ctx.currentTime;
    const beepPattern = [880, 1100, 880, 1320];
    beepPattern.forEach((freq, i) => {
      CS_playBeepWeb(ctx, now + i * 0.11, freq, 0.12, 0.42, "square");
    });
    beepPattern.forEach((freq, i) => {
      CS_playBeepWeb(ctx, now + 0.55 + i * 0.11, freq, 0.12, 0.38, "square");
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
    return true;
  } catch {
    return false;
  }
}

async function CS_playHtmlAlarm(): Promise<boolean> {
  const audio = CS_getAlarmAudio();
  if (!audio) return false;
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export async function CS_playNewOrderSound(): Promise<void> {
  if (typeof window === "undefined") return;

  if (!CS_audioReady) {
    await CS_unlockOrderAudio();
  }

  const webPlayed = await CS_playWebAudioAlarm();
  if (!webPlayed) {
    await CS_playHtmlAlarm();
  }
}
