// File Name: audio.js
// Synthesized Web Audio API utility (0 bytes external MP3 audio assets)

let audioCtx = null;
let isAudioMuted = true; // default muted for respectful UX

/**
 * Toggle audio mute state
 */
export const toggleAudioMute = () => {
  isAudioMuted = !isAudioMuted;
  if (!isAudioMuted) {
    playCyberBlip(880, 0.04, "sine");
  }
  return isAudioMuted;
};

export const getIsAudioMuted = () => isAudioMuted;

/**
 * Synthesizes a futuristic, clean 20-40ms cybernetic UI blip
 */
export const playCyberBlip = (freq = 640, duration = 0.03, type = "sine") => {
  if (isAudioMuted || typeof window === "undefined") return;

  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }

    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, audioCtx.currentTime + duration);

    // Soft click envelope (avoids speaker popping)
    gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Silently ignore audio exceptions
  }
};
