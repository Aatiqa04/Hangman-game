// Lightweight sound effects via WebAudio — no asset files needed.
// Each helper plays a short synthesized blip; safe to call on every interaction.
// AudioContext is created lazily on first call (Android/iOS require a user
// gesture before audio can start — we never construct it at module load).
let ctx;
let muted = false;

function ac() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try { ctx = new Ctor(); } catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ freq = 440, type = 'sine', duration = 0.12, volume = 0.18, slide = 0 }) {
  if (muted) return;
  const a = ac();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(60, freq + slide), a.currentTime + duration);
  g.gain.setValueAtTime(0, a.currentTime);
  g.gain.linearRampToValueAtTime(volume, a.currentTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + duration);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + duration + 0.02);
}

export const sfx = {
  correct() { tone({ freq: 660, type: 'triangle', duration: 0.18, volume: 0.15, slide: 220 }); },
  wrong()   { tone({ freq: 220, type: 'sawtooth', duration: 0.22, volume: 0.14, slide: -90 }); },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone({ freq: f, type: 'triangle', duration: 0.18, volume: 0.18 }), i * 90));
  },
  lose() {
    [330, 247, 196, 147].forEach((f, i) => setTimeout(() => tone({ freq: f, type: 'sawtooth', duration: 0.25, volume: 0.16 }), i * 110));
  },
  click()  { tone({ freq: 520, type: 'square', duration: 0.05, volume: 0.06 }); },
  tick()   { tone({ freq: 880, type: 'square', duration: 0.04, volume: 0.05 }); },
  level()  { [523, 784, 1046].forEach((f, i) => setTimeout(() => tone({ freq: f, type: 'sine', duration: 0.16, volume: 0.18 }), i * 80)); },
};

export function setMuted(value) { muted = value; }
export function isMuted() { return muted; }
