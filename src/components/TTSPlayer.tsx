import React from 'react';
import { useTTSVoice } from '../hooks/useTTSVoice';
import { Volume2, VolumeX, Play, Pause, Square, FastForward, Sliders } from 'lucide-react';

interface TTSPlayerProps {
  text: string;
  title?: string;
  compact?: boolean;
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({
  text,
  title = 'Listen to Audio Narrator',
  compact = false
}) => {
  const {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice
  } = useTTSVoice();

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(text);
    }
  };

  const rates = [0.75, 1.0, 1.25, 1.5, 2.0];

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e222e] border border-cyan-500/20 text-xs text-cyan-300">
        <button
          onClick={handleTogglePlay}
          className="p-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 transition-colors flex items-center justify-center"
          title={isPlaying ? 'Pause' : 'Play Audio Narrator'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <span className="font-medium text-[11px] truncate max-w-[120px]">{title}</span>
        {isPlaying && (
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full" />
            <span className="w-1 h-4 bg-teal-300 animate-pulse delay-75 rounded-full" />
            <span className="w-1 h-2 bg-cyan-300 animate-pulse delay-150 rounded-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-[#0d1d25] border border-[#1b3d4f] shadow-md space-y-2.5 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">{title}</h4>
            <p className="text-[10px] text-[#7ea0b1]">Neural Voice Narration & Audio Guide</p>
          </div>
        </div>

        {/* Waveform graphic when active */}
        {isPlaying && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="w-1 h-3 bg-cyan-400 animate-[bounce_1s_infinite_100ms] rounded-full" />
            <span className="w-1 h-5 bg-teal-300 animate-[bounce_1s_infinite_300ms] rounded-full" />
            <span className="w-1 h-2 bg-cyan-200 animate-[bounce_1s_infinite_200ms] rounded-full" />
            <span className="w-1 h-4 bg-purple-400 animate-[bounce_1s_infinite_400ms] rounded-full" />
            <span className="text-[10px] font-mono text-cyan-300 ml-1">PLAYING</span>
          </div>
        )}
      </div>

      {/* Main Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#183645]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-950/40 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              onClick={stop}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs transition-colors"
              title="Stop Narration"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-[#09151c] p-1 rounded-xl border border-[#1b3d4f] text-[10px]">
          <FastForward className="w-3 h-3 text-[#648797] ml-1" />
          {rates.map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-1.5 py-0.5 rounded-lg font-mono font-bold transition-colors ${
                rate === r
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-[#82a4b3] hover:text-white'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>

        {/* Voice Selector Dropdown */}
        {voices.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-[#7ea0b1]">
            <Sliders className="w-3 h-3 text-cyan-400" />
            <select
              value={selectedVoice?.voiceURI || ''}
              onChange={(e) => {
                const found = voices.find((v) => v.voiceURI === e.target.value);
                if (found) setSelectedVoice(found);
              }}
              className="bg-[#09151c] border border-[#1b3d4f] rounded-lg px-2 py-1 text-[10px] text-gray-200 focus:outline-none focus:border-cyan-500 max-w-[140px] truncate"
            >
              {voices.slice(0, 10).map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name.replace(/Google|Microsoft|Apple/g, '').trim()} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
