/**
 * Plays a pleasant synthetic two-tone chime using browser Web Audio API.
 * Does not require external audio files or MP3 assets.
 */
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Primary tone (E5 ~ 659.25 Hz) transitioning to (G5 ~ 783.99 Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {
    // Browsers block audio before first user interaction; ignore silently
    console.debug("[Audio] Chime playback prevented by browser autoplay policy:", err);
  }
};
