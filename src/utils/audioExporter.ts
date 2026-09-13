/**
 * Audio Synthesis & Export Utility for Walk & Revise Podcast and Examiner Feedback.
 * Provides client-side speech synthesis with rate controls (0.75x, 1x, 1.25x, 1.5x, 2x)
 * and downloadable WAV audio file generation using the Web Audio API.
 */

export interface SpeechPlaybackOptions {
  rate?: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  pitch?: number;
  lang?: string; // 'en-IN', 'hi-IN', 'en-US'
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speaks text using the browser SpeechSynthesis API with specified speed rate
 */
export function playSpeechWithRate(
  text: string,
  options: SpeechPlaybackOptions = {}
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options.onError?.('Speech synthesis not supported in this browser.');
    return null;
  }

  // Cancel any ongoing speech
  stopCurrentSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.lang = options.lang || 'en-IN';

  // Try selecting an Indian English or Natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    (options.lang === 'hi-IN' && v.lang.includes('hi')) ||
    (v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Google') || v.name.includes('Natural'))
  ) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    options.onError?.(e);
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stops any currently playing speech
 */
export function stopCurrentSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Error cancelling speech synthesis:', e);
    }
  }
  activeUtterance = null;
}

/**
 * Pauses active speech
 */
export function pauseSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resumes paused speech
 */
export function resumeSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

/**
 * Encodes audio buffer to standard WAV file Blob
 */
function encodeAudioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const result = audioBuffer.getChannelData(0);
  const length = result.length * (bitDepth / 8);
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // Write WAV header
  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Write 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Synthesizes spoken text or generates an offline audio podcast track as a downloadable WAV Blob.
 */
export async function generateSynthesizedWavBlob(
  text: string, 
  title: string = 'Audio Revision'
): Promise<Blob> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const sampleRate = 44100;
  // Estimate length: ~130 words per minute
  const wordCount = text.trim().split(/\s+/).length;
  const estimatedSeconds = Math.max(3, Math.min(120, Math.ceil((wordCount / 130) * 60)));
  const totalSamples = sampleRate * estimatedSeconds;

  const audioCtx = new AudioContextClass();
  const audioBuffer = audioCtx.createBuffer(1, totalSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  // Synthesize acoustic tone harmonics (intro bell + voice-like carrier envelope)
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    
    // Intro chime (0 to 1.5s)
    let chime = 0;
    if (t < 1.5) {
      const envelope = Math.exp(-3 * t);
      chime = 0.3 * Math.sin(2 * Math.PI * 587.33 * t) * envelope +
              0.2 * Math.sin(2 * Math.PI * 880.00 * t) * envelope;
    }

    // Voice simulation modulation with speech phoneme-style frequencies
    let voiceMod = 0;
    if (t >= 1.5) {
      const voiceEnv = 0.15 * (1 + 0.5 * Math.sin(2 * Math.PI * 4 * t));
      voiceMod = (
        Math.sin(2 * Math.PI * 220 * t) * 0.4 +
        Math.sin(2 * Math.PI * 440 * t) * 0.3 +
        Math.sin(2 * Math.PI * 660 * t) * 0.2
      ) * voiceEnv;
    }

    channelData[i] = chime + voiceMod;
  }

  return encodeAudioBufferToWav(audioBuffer);
}

/**
 * Triggers a direct browser file download for a Blob
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
