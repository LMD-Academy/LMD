import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, Award } from 'lucide-react';

interface ConfettiXPBurstOverlayProps {
  isVisible: boolean;
  message?: string;
  xpAmount?: number;
  onComplete?: () => void;
}

export const ConfettiXPBurstOverlay: React.FC<ConfettiXPBurstOverlayProps> = ({
  isVisible,
  message = 'Module Completed! XP Boost Unlocked!',
  xpAmount = 100,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Optional subtle Web Audio chime synth sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      // Audio fallback
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      rotation: number;
      vRot: number;
      shape: 'square' | 'circle';
    }> = [];

    const colors = ['#22d3ee', '#34d399', '#f59e0b', '#ec4899', '#a855f7', '#3b82f6'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
      });
    }

    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let active = false;
      particles.forEach((p) => {
        if (p.alpha > 0) {
          active = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gravity
          p.alpha -= 0.008;
          p.rotation += p.vRot;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          if (p.shape === 'square') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      if (elapsed < 3200 && active) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating XP Burst Card Overlay */}
      <div className="relative pointer-events-auto bg-gradient-to-r from-[#0d232f] via-[#112d3c] to-[#0e2735] border-2 border-cyan-400 p-6 rounded-3xl shadow-2xl shadow-cyan-500/30 text-center space-y-3 max-w-sm w-full animate-bounce">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 mx-auto flex items-center justify-center text-cyan-300 shadow-inner">
          <Trophy className="w-8 h-8 animate-pulse text-amber-400" />
        </div>

        <div className="space-y-1">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-300 to-emerald-300 tracking-wider">
            +{xpAmount} XP BURST!
          </span>
          <p className="text-xs font-bold text-gray-200">{message}</p>
        </div>

        <button
          onClick={onComplete}
          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg cursor-pointer"
        >
          Awesome! Continue 🚀
        </button>
      </div>
    </div>
  );
};
