import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Flame,
  Award,
  Zap
} from 'lucide-react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const DEFAULT_TIMES: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIMES.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    return parseInt(localStorage.getItem('pomo_completed_sessions') || '0', 10);
  });
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(() => {
    return parseInt(localStorage.getItem('pomo_total_focus_minutes') || '0', 10);
  });
  const [breakPrompt, setBreakPrompt] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  // Audio synthesize chime function via Web Audio API
  const playAudioChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playAudioChime();

      if (mode === 'focus') {
        const nextSessions = completedSessions + 1;
        const nextMinutes = totalFocusMinutes + 25;
        setCompletedSessions(nextSessions);
        setTotalFocusMinutes(nextMinutes);
        localStorage.setItem('pomo_completed_sessions', String(nextSessions));
        localStorage.setItem('pomo_total_focus_minutes', String(nextMinutes));

        const nextMode = nextSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
        setBreakPrompt(`🎉 Great job! You completed a 25-minute focus session. Take a ${nextMode === 'longBreak' ? '15-minute long' : '5-minute short'} break to refresh your mind.`);
        setMode(nextMode);
        setTimeLeft(DEFAULT_TIMES[nextMode]);
      } else {
        setBreakPrompt('☕ Break time complete! Ready to dive back into learning?');
        setMode('focus');
        setTimeLeft(DEFAULT_TIMES.focus);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, completedSessions, totalFocusMinutes]);

  // Click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(DEFAULT_TIMES[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIMES[mode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentMax = DEFAULT_TIMES[mode];
  const progressPercent = Math.round(((currentMax - timeLeft) / currentMax) * 100);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Compact Header Trigger Button */}
      <button
        onClick={() => setShowPopover(!showPopover)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
          isRunning
            ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
            : 'bg-[#08151c] border-[#183a4c] text-[#789cae] hover:text-white hover:border-cyan-500/30'
        }`}
        title="Pomodoro Study Timer & Focus Metrics"
      >
        <div className="relative flex items-center justify-center">
          <Timer className={`w-3.5 h-3.5 ${isRunning ? 'text-cyan-400 animate-spin' : 'text-teal-400'}`} />
          {isRunning && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>
        <span className="font-bold">{formatTime(timeLeft)}</span>
        <span className="hidden lg:inline-block text-[10px] text-emerald-400 uppercase font-sans font-semibold bg-[#031017] px-1.5 py-0.2 rounded border border-[#143243]">
          {mode === 'focus' ? 'Focus' : 'Break'}
        </span>
      </button>

      {/* Expanded Pomodoro Popover */}
      {showPopover && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#07131b] border border-[#1b4154] rounded-2xl shadow-2xl z-50 p-4 space-y-3.5 animate-fade-in text-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#143445] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Pomodoro Study Engine</h4>
                <p className="text-[10px] text-[#63879a]">Focus interval & periodic break tracker</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded text-[#63879a] hover:text-white transition-colors"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#040e13] p-1 rounded-xl border border-[#13303f]">
            <button
              onClick={() => handleSwitchMode('focus')}
              className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                mode === 'focus'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-[#63879a] hover:text-white'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => handleSwitchMode('shortBreak')}
              className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                mode === 'shortBreak'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-[#63879a] hover:text-white'
              }`}
            >
              Short (5m)
            </button>
            <button
              onClick={() => handleSwitchMode('longBreak')}
              className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                mode === 'longBreak'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-[#63879a] hover:text-white'
              }`}
            >
              Long (15m)
            </button>
          </div>

          {/* Large Countdown Display */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0a1e29] to-[#051117] border border-[#183c50] text-center space-y-2 relative overflow-hidden">
            <div className="text-3xl font-mono font-black text-white tracking-widest">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-[#102936] h-1.5 rounded-full overflow-hidden border border-[#1b4359]">
              <div
                className={`h-full transition-all duration-500 ${
                  mode === 'focus' ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-[#6b91a5] font-mono">
              {progressPercent}% Complete • {mode === 'focus' ? 'Deep Work Session' : 'Mind Refresh Break'}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all active:scale-95 shadow-md ${
                isRunning
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                  : 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-400/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Timer</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-[#0e2430] hover:bg-[#18394b] text-[#7a9daf] hover:text-white border border-[#17394c] transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Break Prompt Banner if completed */}
          {breakPrompt && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200 flex items-start gap-2 animate-fade-in">
              <Coffee className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{breakPrompt}</span>
                <button
                  onClick={() => setBreakPrompt(null)}
                  className="block mt-1 text-[10px] text-emerald-400 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Session Stats Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#133243]">
            <div className="p-2 rounded-xl bg-[#0a1b24] border border-[#173748] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-[#63879a]">Sessions</div>
                <div className="text-xs font-bold text-white">{completedSessions} Completed</div>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#0a1b24] border border-[#173748] flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-[#63879a]">Focus Time</div>
                <div className="text-xs font-bold text-white">{totalFocusMinutes} Mins</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
