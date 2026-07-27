import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Sparkles,
  Globe,
  Sliders,
  Check,
  Radio
} from 'lucide-react';

interface WebSpeechLecturerProps {
  lessonTitle: string;
  lessonContent: string;
  onParagraphSpoken?: (index: number) => void;
}

export const WebSpeechLecturer: React.FC<WebSpeechLecturerProps> = ({
  lessonTitle,
  lessonContent,
  onParagraphSpoken
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentSentence, setCurrentSentence] = useState<string>('');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (!synthRef.current) return;
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoiceName) {
          // Default to natural English voice or first available
          const defaultVoice = availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                             availableVoices.find(v => v.lang.startsWith('en')) ||
                             availableVoices[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      };

      updateVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel();

    // Clean markdown symbols from lessonContent for clean narration
    const cleanText = `${lessonTitle}. ${lessonContent}`
      .replace(/#+\s+/g, '')
      .replace(/\*+/g, '')
      .replace(/`{3}[\s\S]*?`{3}/g, 'Code snippet omitted for brevity.')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    const chosenVoice = voices.find(v => v.name === selectedVoiceName);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const spokenSoFar = cleanText.substring(event.charIndex, event.charIndex + 60);
        setCurrentSentence(spokenSoFar);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentence('');
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentence('');
    }
  };

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[#07131b] border border-[#163647] p-3 md:p-4 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left Status & Title */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/30'
              : 'bg-[#0d222e] border border-[#1b4359] text-cyan-400'
          }`}>
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">Audio Narration Engine</h4>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 font-mono px-1.5 py-0.2 rounded border border-cyan-500/30">
                Web Speech API
              </span>
            </div>
            <p className="text-[11px] text-[#63879a]">
              Synthesizing lecture audio in real time
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying && !isPaused ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-400/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Read Lecture</span>
            </button>
          ) : isPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all"
            >
              <Pause className="w-3.5 h-3.5 fill-slate-950" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-400/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Resume</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-xl bg-[#0c202b] hover:bg-[#163647] text-[#6a8ea0] hover:text-white border border-[#163647] transition-all"
              title="Stop Narration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-xl border transition-all ${
              showSettings
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#0c202b] hover:bg-[#163647] text-[#6a8ea0] hover:text-white border-[#163647]'
            }`}
            title="Voice & Speed Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Currently spoken sentence highlight */}
      {isPlaying && currentSentence && (
        <div className="p-2.5 rounded-xl bg-[#040e14] border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2 animate-fade-in">
          <Radio className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <span className="italic font-sans text-[11px] truncate">{currentSentence}...</span>
        </div>
      )}

      {/* Speech Voice & Speed Customization Dropdown */}
      {showSettings && (
        <div className="p-3 rounded-xl bg-[#040e13] border border-[#143445] space-y-3 animate-fade-in text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Voice Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-[#63879a] uppercase tracking-wider block mb-1">
                Voice Selection:
              </label>
              <select
                value={selectedVoiceName}
                onChange={(e) => setSelectedVoiceName(e.target.value)}
                className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Rate Control */}
            <div>
              <label className="text-[10px] font-bold text-[#63879a] uppercase tracking-wider block mb-1">
                Narration Speed: <span className="text-cyan-300">{rate}x</span>
              </label>
              <div className="flex items-center gap-1.5 bg-[#0a1c26] p-1 rounded-lg border border-[#183a4c]">
                {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      rate === r
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-[#63879a] hover:text-white'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
