import React, { useState } from 'react';
import { UserProfile, Badge, Milestone } from '../types';
import {
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Gift,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Trophy,
  Share2,
  Globe,
  MessageSquare
} from 'lucide-react';

interface AchievementsPanelProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  user,
  onUpdateUser
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'mastery' | 'streak' | 'learning'>('all');
  const [claimedRewards, setClaimedRewards] = useState<Record<string, boolean>>({});
  const [claimAnimation, setClaimAnimation] = useState<string | null>(null);
  const [hasSharedToday, setHasSharedToday] = useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  const triggerParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }> = [];

    const colors = ['#FF007F', '#00E5FF', '#39FF14', '#FFD700', '#FF4500', '#6200EE'];

    // Burst particles from the center
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3, // upper middle near claim notification
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        radius: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.006
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // gravity
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animate();
  };

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const xpPoints = user.xpPoints || 1250;
  const level = user.level || Math.floor(xpPoints / 1000) + 1;
  const currentLevelXP = xpPoints % 1000;
  const xpToNextLevel = 1000 - currentLevelXP;

  const handleShareToSocial = (platform: string) => {
    if (hasSharedToday) return;

    const shareText = encodeURIComponent(`I am advancing my Computer Science degree with LMDpro AI Tutor! Join the 100% free open-source degree movement: ${window.location.origin}`);
    let shareUrl = '';

    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
    else shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;

    window.open(shareUrl, '_blank', 'width=600,height=400');

    // Grant Daily Share Bonus
    const bonusXP = 100;
    const newXP = user.xpPoints + bonusXP;
    const newLevel = Math.floor(newXP / 1000) + 1;

    setHasSharedToday(true);
    setClaimAnimation(`+${bonusXP} XP Daily Social Share Reward Claimed! 🎉`);
    setTimeout(() => triggerParticles(), 100);

    onUpdateUser({
      xpPoints: newXP,
      level: newLevel
    });

    setTimeout(() => setClaimAnimation(null), 3000);
  };

  const handleClaimReward = (milestone: Milestone) => {
    if (claimedRewards[milestone.id]) return;

    // Award bonus XP
    const rewardXP = 250;
    const newXP = user.xpPoints + rewardXP;
    const newLevel = Math.floor(newXP / 1000) + 1;

    setClaimedRewards(prev => ({ ...prev, [milestone.id]: true }));
    setClaimAnimation(`+${rewardXP} XP Bonus Claimed! 🎉`);
    setTimeout(() => triggerParticles(), 100);

    onUpdateUser({
      xpPoints: newXP,
      level: newLevel,
      milestones: user.milestones.map(m => m.id === milestone.id ? { ...m, achieved: true } : m)
    });

    setTimeout(() => setClaimAnimation(null), 3000);
  };

  const filteredBadges = (user.badges || []).filter(b => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  return (
    <div className="relative p-5 sm:p-6 rounded-2xl bg-[#0b1820] border border-[#1b3a4a] text-white shadow-2xl space-y-6">
      {/* Immersive Particle-Effect Notification Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50 rounded-2xl"
      />
      {/* Top Banner: Level, Streak, XP Bar */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-[#0d232f] via-[#112d3c] to-[#0e2735] border border-cyan-500/20 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {claimAnimation && (
          <div className="absolute top-3 right-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs animate-bounce shadow-lg z-20">
            {claimAnimation}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Level Circle Badge */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-900/40 shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#09151c] flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Level</span>
                <span className="text-2xl font-black text-white">{level}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                Scholar Engineer
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-[#82a4b3]">
                Next Title: <strong className="text-teal-300">Master AI Architect</strong> ({xpToNextLevel} XP needed)
              </p>
            </div>
          </div>

          {/* XP Progress Bar & Streak Flame */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 font-mono">{currentLevelXP} / 1000 XP</span>
                <span className="text-[10px] text-[#7092a2]">({xpPoints} Total XP)</span>
              </div>

              {/* Animated Daily Streak Flame */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="font-black text-xs">{user.streakDays || 7} Day Streak</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-[#08131a] rounded-full p-0.5 border border-[#1b3d4f] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${(currentLevelXP / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183645] pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Unlocked Academic Badges</h3>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 bg-[#0d1e28] p-1 rounded-xl border border-[#1b3d4f] text-xs">
            {[
              { id: 'all', label: 'All Badges' },
              { id: 'ai', label: 'AI Engine' },
              { id: 'mastery', label: 'Mastery' },
              { id: 'streak', label: 'Streak' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-[#82a4b3] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-xl bg-[#0e212b] border border-[#1d3d4e] hover:border-cyan-500/40 transition-all flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#09151c] border border-cyan-500/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {badge.icon}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                <p className="text-[11px] text-[#7ea0b1] line-clamp-2">{badge.description}</p>
                <span className="text-[10px] text-cyan-400 font-semibold block pt-0.5">
                  Unlocked {badge.dateUnlocked || 'Recently'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Milestones & Claimable Rewards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">Academic Milestones & XP Bonus Rewards</h3>
        </div>

        <div className="space-y-2">
          {/* Daily Social Media Share Reward Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0b212d] to-[#0e2736] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                <Share2 className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white">Daily Social Media Share Challenge</h4>
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">+100 XP REWARD</span>
                </div>
                <p className="text-[11px] text-[#7ea0b1] mt-0.5">
                  Share LMDpro's open-source degree movement on LinkedIn, Twitter, or Facebook to earn 100 XP daily!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleShareToSocial('twitter')}
                disabled={hasSharedToday}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                  hasSharedToday
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-[#1da1f2]/20 border border-[#1da1f2]/40 text-[#1da1f2] hover:bg-[#1da1f2]/30'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>X / Twitter</span>
              </button>

              <button
                onClick={() => handleShareToSocial('linkedin')}
                disabled={hasSharedToday}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                  hasSharedToday
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-[#0a66c2]/20 border border-[#0a66c2]/40 text-[#0a66c2] hover:bg-[#0a66c2]/30'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {(user.milestones || []).map((m) => {
            const isClaimed = claimedRewards[m.id] || m.achieved;
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-[#0e212b] border border-[#1d3d4e] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${isClaimed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-purple-500/10 border-purple-500/30 text-purple-300'}`}>
                    {isClaimed ? <CheckCircle2 className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{m.title}</h4>
                    <span className="text-[11px] text-[#7ea0b1]">{m.reward}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimReward(m)}
                  disabled={isClaimed}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                    isClaimed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-md active:scale-95'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Claimed</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Claim +250 XP</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
