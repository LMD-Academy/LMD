import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Star,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Calendar,
  Lock,
  Unlock,
  Users,
  Target
} from 'lucide-react';
import { UserProfile, LeaderboardUser, Badge, Milestone } from '../types';
import { OfflineStorageService } from '../services/offlineStorage';

interface GamificationLeaderboardViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const GamificationLeaderboardView: React.FC<GamificationLeaderboardViewProps> = ({
  user,
  onUpdateUser
}) => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState<'global' | 'weekly'>('global');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const loaded = OfflineStorageService.getLeaderboardUsers(user);
    setLeaderboardUsers(loaded);
  }, [user]);

  // Streak Multiplier Calculation
  const streakDays = user.streakDays || 7;
  const streakMultiplier = streakDays >= 14 ? 2.0 : streakDays >= 7 ? 1.5 : streakDays >= 3 ? 1.2 : 1.0;

  // Next level XP
  const nextLevelXP = user.level * 1000;
  const currentLevelProgress = Math.min(100, Math.round(((user.xpPoints % 1000) / 1000) * 100));

  // Current User Rank
  const currentUserRank = leaderboardUsers.findIndex(u => u.isCurrentUser || u.id === user.id) + 1;
  const userAhead = currentUserRank > 1 ? leaderboardUsers[currentUserRank - 2] : null;
  const xpDifferenceToNextRank = userAhead ? userAhead.xpPoints - user.xpPoints + 1 : 0;

  // All Milestone Badges
  const ALL_BADGES: Badge[] = [
    {
      id: 'b1',
      name: 'AI Scholar',
      icon: '🤖',
      description: 'Mastered 3 AI & Agentic System Modules',
      category: 'ai',
      dateUnlocked: 'Unlocked'
    },
    {
      id: 'b2',
      name: '7-Day Streak Warrior',
      icon: '🔥',
      description: 'Maintained 7 consecutive daily learning sessions',
      category: 'streak',
      dateUnlocked: 'Unlocked'
    },
    {
      id: 'b3',
      name: 'Degree Defender',
      icon: '🎓',
      description: 'Passed capstone thesis defense evaluation',
      category: 'mastery',
      dateUnlocked: 'Unlocked'
    },
    {
      id: 'b4',
      name: 'Study Guide Architect',
      icon: '💡',
      description: 'Generated 3 personalized AI study guides',
      category: 'learning',
      dateUnlocked: 'Unlocked'
    },
    {
      id: 'b5',
      name: 'Community Catalyst',
      icon: '🗣️',
      description: 'Posted 5 helpful responses in the student forum',
      category: 'learning',
      dateUnlocked: '3 / 5 completed'
    },
    {
      id: 'b6',
      name: 'Quantum Pioneer',
      icon: '⚛️',
      description: 'Scored 100% on Quantum Computing Module Quiz',
      category: 'mastery',
      dateUnlocked: 'Locked'
    }
  ];

  const DAYS_OF_WEEK = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: true },
    { day: 'Sat', active: true },
    { day: 'Sun', active: true }
  ];

  return (
    <div className="space-y-8 text-slate-100">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 p-6 md:p-8 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Academy Gamification Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
              Achievements, Streaks & Global Leaderboard
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Earn XP by completing daily lessons, taking adaptive quizzes, creating study guides, and helping classmates in the community forum.
            </p>
          </div>

          {/* Quick Rank Badge */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center space-x-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-md">
              #{currentUserRank}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Global Rank</div>
              <div className="text-sm font-bold text-amber-300 flex items-center space-x-1">
                <span>{user.xpPoints} XP</span>
                <span className="text-[10px] text-emerald-400">({streakMultiplier}x XP Boost)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Visual Learning Streak Widget & XP Level Meter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Visual Streak Card (6 cols) */}
        <div className="md:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Learning Streak</h3>
                <p className="text-xs text-slate-400">Consistent study unlocks XP multipliers</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold text-amber-400 font-display flex items-center space-x-1">
                <span>{streakDays}</span>
                <span className="text-xs font-normal text-slate-400">Days</span>
              </div>
            </div>
          </div>

          {/* 7-Day Activity Calendar Dots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>Weekly Calendar</span>
              <span className="text-emerald-400 font-bold">{streakMultiplier}x XP Multiplier Active!</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center space-y-1 transition-all ${
                    d.active
                      ? 'bg-gradient-to-b from-amber-950/40 to-slate-950 border-amber-500/50 text-amber-300 shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">{d.day}</div>
                  <div className="text-xs font-extrabold">{d.active ? '🔥' : '•'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Protection & Multiplier Callout */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Streak Freeze Shield: <strong>1 Active Token</strong></span>
            </div>
            <span className="text-slate-500 text-[10px]">Auto-protects weekend breaks</span>
          </div>
        </div>

        {/* Level Progress & XP Meter (6 cols) */}
        <div className="md:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Academic Level & XP</h3>
                <p className="text-xs text-slate-400">Target Level {user.level + 1} at {nextLevelXP} XP</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase">
              Level {user.level} Scholar
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">{user.xpPoints} Total XP</span>
              <span className="text-cyan-400">{currentLevelProgress}% to Level {user.level + 1}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>

          {/* Points Distribution Matrix */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-400">Completed Lessons</span>
              <p className="font-bold text-white text-sm">+100 XP each</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-400">Adaptive Quizzes</span>
              <p className="font-bold text-white text-sm">+50 XP each</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-400">AI Study Guides</span>
              <p className="font-bold text-white text-sm">+30 XP each</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-400">Forum Responses</span>
              <p className="font-bold text-white text-sm">+30 XP each</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Badges & Milestone Achievements */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Milestone Badges & Honors</h3>
          </div>
          <span className="text-xs text-slate-400">
            {ALL_BADGES.filter(b => b.dateUnlocked !== 'Locked').length} of {ALL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = badge.dateUnlocked !== 'Locked';
            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-900 to-amber-950/20 border-amber-500/30 text-slate-100 hover:border-amber-500/50'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-normal line-clamp-2">
                    {badge.description}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-amber-400/80 pt-0.5">
                    {badge.dateUnlocked}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Leaderboard Rankings Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Academy Leaderboard</h3>
          </div>

          {/* Subtabs */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLeaderboardTab('global')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                leaderboardTab === 'global'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All-Time Global
            </button>
            <button
              onClick={() => setLeaderboardTab('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                leaderboardTab === 'weekly'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Sprint
            </button>
          </div>
        </div>

        {/* Current User Rank Push Banner */}
        {currentUserRank > 1 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-cyan-300 font-medium">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>
                You are only <strong>{xpDifferenceToNextRank} XP</strong> away from overtaking Rank #{currentUserRank - 1}!
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md font-bold">
              Next Goal
            </span>
          </div>
        )}

        {/* Table Rows */}
        <div className="space-y-2.5">
          {leaderboardUsers.map((lbUser, idx) => {
            const rank = idx + 1;
            const isSelf = lbUser.isCurrentUser || lbUser.id === user.id;

            let tierColor = 'border-slate-800 bg-slate-950/60';
            let rankBadge = `${rank}`;
            if (rank === 1) {
              tierColor = 'border-amber-500/50 bg-amber-950/20 text-amber-300';
              rankBadge = '🥇';
            } else if (rank === 2) {
              tierColor = 'border-slate-400/40 bg-slate-900/60 text-slate-200';
              rankBadge = '🥈';
            } else if (rank === 3) {
              tierColor = 'border-amber-700/40 bg-amber-950/10 text-amber-400';
              rankBadge = '🥉';
            }

            return (
              <div
                key={lbUser.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${tierColor} ${
                  isSelf ? 'ring-2 ring-cyan-400/80 bg-cyan-950/30' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="w-8 text-center text-sm font-extrabold text-slate-400">
                    {rankBadge}
                  </span>

                  <img
                    src={lbUser.avatarUrl}
                    alt={lbUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${isSelf ? 'text-cyan-300' : 'text-white'}`}>
                        {lbUser.name} {isSelf && '(You)'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {lbUser.tier} Tier
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-3 mt-0.5">
                      <span>Level {lbUser.level}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 text-amber-400">
                        <Flame className="w-3 h-3" />
                        <span>{lbUser.streakDays} Day Streak</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-amber-400 font-display">
                    {leaderboardTab === 'weekly' ? lbUser.weeklyXP : lbUser.xpPoints} XP
                  </div>
                  <span className="text-[10px] text-slate-500">{lbUser.badgeCount} Badges</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
