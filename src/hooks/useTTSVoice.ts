import { useState, useEffect, useCallback, useRef } from 'react';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useTTSVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentText, setCurrentText] = useState<string>('');
  const [charIndex, setCharIndex] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available system voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        // Prefer natural or English voices
        const englishVoice = available.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
        ) || available.find(v => v.lang.startsWith('en')) || available[0];
        setSelectedVoice(englishVoice);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const speak = useCallback(
    (text: string, options?: TTSOptions) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser.');
        return;
      }

      // Stop previous utterance
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);

      if (!text || !text.trim()) return;

      // Clean markdown characters for clearer speech
      const cleanText = text
        .replace(/[*#_`~]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/file:\/\/\/[^\s]+/g, 'file path');

      setCurrentText(cleanText);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options?.rate ?? rate;
      utterance.pitch = options?.pitch ?? pitch;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word' || event.name === 'sentence') {
          setCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCharIndex(0);
        if (options?.onEnd) options.onEnd();
      };

      utterance.onerror = (err) => {
        console.error('TTS error:', err);
        setIsPlaying(false);
        setIsPaused(false);
        if (options?.onError) options.onError(err);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, selectedVoice]
  );

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCharIndex(0);
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    rate,
    setRate,
    pitch,
    setPitch,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentText,
    charIndex
  };
}
