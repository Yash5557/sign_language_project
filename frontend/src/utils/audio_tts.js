/**
 * Bulletproof Multilingual Speech Synthesis & Audio Engine
 * Fixes Chromium GC bugs, voice-stall issues, and missing local voice packs
 * Provides guaranteed audio feedback with Web Audio synthesis fallback.
 */

class AudioTTSManager {
  constructor() {
    this.activeUtterance = null;
    this.isSpeaking = false;
    this.voices = [];
    this.audioCtx = null;
    this.fallbackAudio = null;

    if (typeof window !== "undefined") {
      this.initVoices();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        this.voices = window.speechSynthesis.getVoices() || [];
      } catch (e) {
        console.warn("Could not load voices:", e);
      }
    }
  }

  getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play an audible acoustic confirmation chime (useful when browser blocks TTS or as feedback)
   */
  playConfirmationChime(freq = 587.33, duration = 0.18) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext blocked or muted
    }
  }

  /**
   * Find best voice matching the target language code
   */
  findBestVoice(langCode) {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const code = (langCode || "en").toLowerCase();
    const primary = code.split(/[-_]/)[0];

    // 1. Exact match (e.g. mr-IN, hi-IN, en-US)
    let match = this.voices.find(
      (v) => v.lang && v.lang.toLowerCase().replace("_", "-") === code
    );
    if (match) return match;

    // 2. Primary prefix match (e.g. 'mr', 'hi', 'en')
    match = this.voices.find(
      (v) => v.lang && v.lang.toLowerCase().startsWith(primary)
    );
    if (match) return match;

    // 3. Indian English fallback for Indian languages if Marathi/Hindi voice not installed
    if (primary === "mr" || primary === "hi") {
      match = this.voices.find(
        (v) =>
          v.lang &&
          (v.lang.toLowerCase().includes("in") ||
            v.name.toLowerCase().includes("india"))
      );
      if (match) return match;
    }

    // 4. Default voice
    return this.voices.find((v) => v.default) || this.voices[0] || null;
  }

  /**
   * Speak text with rock-solid error recovery
   */
  speak({
    text,
    lang = "en",
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
  }) {
    if (!text || !text.trim()) {
      onError(new Error("Empty text"));
      return;
    }

    // Clean text: strip emojis, brackets, excessive punctuation
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/[\[\]\(\)\{\}\*\_~#]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      onError(new Error("No speakable text after cleaning"));
      return;
    }

    this.stop();

    // Check if SpeechSynthesis is supported
    if (typeof window === "undefined" || !window.speechSynthesis) {
      this.playFallbackAudio(cleanText, lang, onStart, onEnd, onError);
      return;
    }

    try {
      // Chrome bug fix: resume before speaking
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voice = this.findBestVoice(lang);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        const langMap = { mr: "mr-IN", hi: "hi-IN", en: "en-US", es: "es-ES", fr: "fr-FR" };
        utterance.lang = langMap[lang] || "en-US";
      }

      utterance.rate = Math.max(0.6, Math.min(2.0, rate || 1.0));
      utterance.pitch = Math.max(0.5, Math.min(1.8, pitch || 1.0));
      utterance.volume = Math.max(0.1, Math.min(1.0, volume || 1.0));

      let hasStarted = false;
      let startTimeout = null;

      utterance.onstart = () => {
        hasStarted = true;
        if (startTimeout) clearTimeout(startTimeout);
        this.isSpeaking = true;
        onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.activeUtterance = null;
        if (typeof window !== "undefined") window.__activeSpeechUtterance = null;
        onEnd();
      };

      utterance.onerror = (err) => {
        console.warn("Speech synthesis error, falling back:", err);
        this.isSpeaking = false;
        this.activeUtterance = null;
        if (typeof window !== "undefined") window.__activeSpeechUtterance = null;

        // Try fallback audio if browser synthesis failed
        this.playFallbackAudio(cleanText, lang, onStart, onEnd, onError);
      };

      // CRUCIAL: Pin reference to window to defeat Chromium GC bug
      this.activeUtterance = utterance;
      if (typeof window !== "undefined") {
        window.__activeSpeechUtterance = utterance;
      }

      // Safeguard: If speech synthesis engine hangs without firing onstart within 600ms
      startTimeout = setTimeout(() => {
        if (!hasStarted) {
          console.warn("Speech synthesis did not start within 600ms; resuming queue");
          try {
            window.speechSynthesis.resume();
          } catch (e) {
            // ignore
          }
        }
      }, 600);

      window.speechSynthesis.speak(utterance);
      this.playConfirmationChime(660, 0.08); // Subtle auditory click to confirm action
    } catch (err) {
      console.warn("Exception during speech dispatch:", err);
      this.playFallbackAudio(cleanText, lang, onStart, onEnd, onError);
    }
  }

  /**
   * Fallback using online TTS audio stream or synthesized speech tones
   */
  playFallbackAudio(text, lang, onStart, onEnd, onError) {
    try {
      this.stop();
      const primaryLang = (lang || "en").split(/[-_]/)[0];
      const encoded = encodeURIComponent(text.slice(0, 150));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${primaryLang}&client=tw-ob&q=${encoded}`;

      const audio = new Audio(ttsUrl);
      this.fallbackAudio = audio;

      audio.onplay = () => {
        this.isSpeaking = true;
        onStart();
      };
      audio.onended = () => {
        this.isSpeaking = false;
        this.fallbackAudio = null;
        onEnd();
      };
      audio.onerror = () => {
        // As ultimate acoustic fallback, play a multi-tone phonetic melody
        this.playAcousticFallbackMelody(text, onStart, onEnd);
      };

      audio.play().catch(() => {
        this.playAcousticFallbackMelody(text, onStart, onEnd);
      });
    } catch (e) {
      this.playAcousticFallbackMelody(text, onStart, onEnd);
    }
  }

  /**
   * Guaranteed sound generation via Web Audio API oscillators
   */
  playAcousticFallbackMelody(text, onStart, onEnd) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) {
        onEnd();
        return;
      }
      onStart();
      this.isSpeaking = true;

      const tones = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const toneDur = 0.14;
      const totalDur = tones.length * toneDur;

      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * toneDur;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + toneDur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + toneDur);
      });

      setTimeout(() => {
        this.isSpeaking = false;
        onEnd();
      }, totalDur * 1000 + 100);
    } catch (e) {
      this.isSpeaking = false;
      onEnd();
    }
  }

  /**
   * Stop all active speech and audio
   */
  stop() {
    this.isSpeaking = false;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      window.__activeSpeechUtterance = null;
    }
    this.activeUtterance = null;

    if (this.fallbackAudio) {
      try {
        this.fallbackAudio.pause();
        this.fallbackAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.fallbackAudio = null;
    }
  }
}

export const audioTTS = new AudioTTSManager();
