// ──────────────────────────────────────────────────
// Enhanced Audio Narration Engine — Equal Groups
// Natural, teacher-like speech for young learners
// ──────────────────────────────────────────────────

let currentQueue = null;
let isSpeaking = false;
let currentAudio = null;
let playId = 0;
const elevenLabsCache = new Map();

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';

let audioMap = {};
try {
  import('./audioMap.js').then(module => {
    audioMap = module.audioMap || {};
  }).catch(() => {});
} catch (e) { }

const SPEECH_STYLES = {
  statement: { rate: 0.85, pitch: 1.18, volume: 0.95 },
  question: { rate: 0.78, pitch: 1.32, volume: 0.98 },
  encouragement: { rate: 0.90, pitch: 1.35, volume: 1.0 },
  emphasis: { rate: 0.72, pitch: 1.25, volume: 0.98 },
  thinking: { rate: 0.80, pitch: 1.15, volume: 0.92 },
  celebration: { rate: 0.98, pitch: 1.42, volume: 1.0 },
  instruction: { rate: 0.82, pitch: 1.20, volume: 0.95 },
};

export async function getAudioUrl(text, style) {
  if (audioMap && audioMap[text]) {
    return audioMap[text];
  }
  console.warn(`No local audio found for: "${text}"`);
  return null;
}

export function speak(text, enabled = true, style = 'statement') {
  return new Promise(async (resolve) => {
    if (!enabled || !text) { resolve(); return; }

    playId++;
    const currentPlayId = playId;
    isSpeaking = true;

    try {
      const audioUrl = await getAudioUrl(text, style);
      if (!audioUrl) {
        // No local audio found, immediately resolve
        isSpeaking = false;
        resolve();
        return;
      }

      if (currentPlayId !== playId) { isSpeaking = false; resolve(); return; }

      if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }

      currentAudio = new Audio(audioUrl);
      currentAudio.onended = () => { isSpeaking = false; resolve(); };
      currentAudio.onerror = () => { isSpeaking = false; resolve(); };
      await currentAudio.play();
      return;
    } catch (error) {
      console.error("Local audio failed to play:", error);
      isSpeaking = false;
      resolve();
    }
  });
}

// ─── Narration Segment Types ────────────────────
export function seg(text, style = 'statement', pause = 400) {
  return { text, style, pause };
}

export const say = (text, pause = 0) => seg(text, 'statement', pause);
export const ask = (text, pause = 0) => seg(text, 'question', pause);
export const cheer = (text, pause = 0) => seg(text, 'encouragement', pause);
export const emphasize = (text, pause = 0) => seg(text, 'emphasis', pause);
export const think = (text, pause = 0) => seg(text, 'thinking', pause);
export const celebrate = (text, pause = 0) => seg(text, 'celebration', pause);
export const instruct = (text, pause = 0) => seg(text, 'instruction', pause);
export const pause = (ms = 0) => seg('', 'statement', ms);

export function preloadNarration(segments) {
  if (!segments) return;
  segments.forEach(seg => {
    if (seg.text && seg.text.trim()) {
      getAudioUrl(seg.text, seg.style).catch(() => { });
    }
  });
}

export function narrate(segments, enabled = true) {
  const queueId = Symbol('narration');
  currentQueue = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (currentQueue === queueId) {
      isSpeaking = false;
      currentQueue = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments || segments.length === 0) return;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (cancelled || currentQueue !== queueId) return;

      if (i + 1 < segments.length) {
        const nextSeg = segments[i + 1];
        if (nextSeg.text && nextSeg.text.trim()) {
          getAudioUrl(nextSeg.text, nextSeg.style).catch(console.error);
        }
      }

      if (segment.text && segment.text.trim()) {
        await speak(segment.text, true, segment.style);
      }

      if (segment.pause > 0 && !cancelled && currentQueue === queueId) {
        await new Promise(r => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}

export function stopNarration() {
  playId++;
  currentQueue = null;
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
  isSpeaking = false;
}

// ─── Simple tone generation ──────────────────────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export function playTone(frequency, duration = 200) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) { /* silent fallback */ }
}

export const sounds = {
  correct: () => { playTone(523, 150); setTimeout(() => playTone(659, 150), 150); setTimeout(() => playTone(784, 200), 300); },
  wrong: () => { playTone(220, 300); },
  badge: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 200), i * 150)); },
  click: () => playTone(440, 80),
  streak: () => { playTone(880, 100); setTimeout(() => playTone(1100, 150), 100); },
};
