import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ThemedCourseImage } from './ThemedCourseImage';
import { Course, UserProfile, StudentProgress, Certificate, AdaptiveLevel } from '../types';
import { CatalogGrid2x4 } from './CatalogGrid2x4';
import { WeeklySchedulePlanner } from './WeeklySchedulePlanner';
import { GoogleTasksWidget } from './GoogleTasksWidget';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Brain,
  Download,
  Clock,
  ChevronRight,
  ShieldCheck,
  Star,
  Target,
  Flame,
  Layers,
  FolderSync,
  FileText,
  FileSpreadsheet
} from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
  courses: Course[];
  progressMap: Record<string, StudentProgress>;
  certificates: Certificate[];
  onSelectCourse: (course: Course) => void;
  onOpenCertificate: (cert: Certificate) => void;
  onOpenAITutor: () => void;
  onOpenCourseGenerator: () => void;
  onOpenClassroomModal?: () => void;
  onOpenAuthModal?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  courses,
  progressMap,
  certificates,
  onSelectCourse,
  onOpenCertificate,
  onOpenAITutor,
  onOpenClassroomModal,
  onOpenAuthModal,
  onUpdateUser,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [workspaceMsg, setWorkspaceMsg] = useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState<number>(user.dailyStudyGoal || 60);

  // Daily study progress calculation
  const dailyGoalMinutes = user.dailyStudyGoal || 60;
  // Calculate today's completed study time (for demo, 45 mins or based on completed lessons)
  const completedTodayMinutes = 45; 
  const progressPercent = Math.min(100, Math.round((completedTodayMinutes / dailyGoalMinutes) * 100));

  // Overall course completion calculation
  const enrolledCoursesList = courses.filter(c => user.enrolledCourseIds.includes(c.id));
  const totalEnrolledLessons = enrolledCoursesList.reduce((acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0), 0);
  const completedEnrolledLessons = enrolledCoursesList.reduce((acc, c) => {
    const prog = progressMap[c.id];
    return acc + (prog?.completedLessonIds?.length || 0);
  }, 0);
  const overallCompletionPercent = totalEnrolledLessons > 0
    ? Math.min(100, Math.round((completedEnrolledLessons / totalEnrolledLessons) * 100))
    : 42; // Dynamic default completion percentage

  // Progress ring geometry
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
  const overallDashoffset = circumference - (overallCompletionPercent / 100) * circumference;

  const [chartMetric, setChartMetric] = useState<'lessons' | 'xp'>('lessons');

  const completionTrendData = [
    { day: 'Mon', completedLessons: 2, studyMinutes: 35, xpEarned: 180, completionRate: 62 },
    { day: 'Tue', completedLessons: 4, studyMinutes: 55, xpEarned: 320, completionRate: 71 },
    { day: 'Wed', completedLessons: 3, studyMinutes: 45, xpEarned: 260, completionRate: 78 },
    { day: 'Thu', completedLessons: 5, studyMinutes: 70, xpEarned: 420, completionRate: 85 },
    { day: 'Fri', completedLessons: 4, studyMinutes: 50, xpEarned: 380, completionRate: 89 },
    { day: 'Sat', completedLessons: 6, studyMinutes: 85, xpEarned: 550, completionRate: 94 },
    { day: 'Sun', completedLessons: 7, studyMinutes: 95, xpEarned: 640, completionRate: 100 },
  ];

  const handleExportWorkspace = (docType: 'docs' | 'sheets', title: string) => {
    setWorkspaceMsg(`Exported "${title}" to Google ${docType === 'docs' ? 'Docs' : 'Sheets'}!`);
    setTimeout(() => setWorkspaceMsg(null), 3000);
  };

  const filteredCourses = courses.filter(c => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'enrolled') return user.enrolledCourseIds.includes(c.id);
    if (filterCategory === 'ai') return c.isAiGenerated;
    return c.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const getAdaptiveBadge = (level: AdaptiveLevel) => {
    switch (level) {
      case 'remedial':
        return { label: 'Remedial Support Phase', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'standard':
        return { label: 'Standard Learning Track', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'accelerated':
        return { label: 'Accelerated Pace', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'mastery':
        return { label: 'Expert Mastery Level', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'Standard Track', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    }
  };

  const badgeInfo = getAdaptiveBadge(user.learningLevel);

  // Default Badges if not present
  const defaultBadges = user.badges || [
    { id: 'b1', name: 'AI Scholar', icon: '🤖', description: 'Mastered 3 AI & Agentic Modules', category: 'ai', dateUnlocked: 'Today' },
    { id: 'b2', name: '7-Day Streak', icon: '🔥', description: 'Maintained 7 consecutive daily study sessions', category: 'streak', dateUnlocked: 'Yesterday' },
    { id: 'b3', name: 'Degree Defender', icon: '🎓', description: 'Passed capstone evaluation defense', category: 'mastery', dateUnlocked: '2 days ago' },
  ];

  // Default Milestones if not present
  const defaultMilestones = user.milestones || [
    { id: 'm1', title: 'Earn 1,000 XP Points', targetXP: 1000, achieved: user.xpPoints >= 1000, reward: 'Level 2 Unlocked' },
    { id: 'm2', title: 'Complete 5 Degree Modules', targetXP: 2500, achieved: user.xpPoints >= 2500, reward: 'Golden Badge' },
    { id: 'm3', title: 'Publish Research Paper to Docs', targetXP: 5000, achieved: false, reward: 'Academic Citation' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* 1. Welcome & Stats Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d212b] via-[#102732] to-[#0b171f] border border-[#1d3d4b] p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeInfo.color}`}>
                {badgeInfo.label}
              </span>
              <span className="text-xs text-[#7d9fbe] flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                Adaptive AI Engine Active
              </span>
              {user.workspaceConnected && (
                <span className="text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Google Workspace Linked
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-cyan-300">{user.name}</span>!
            </h1>

            <p className="text-sm text-[#87a9b8] leading-relaxed">
              Your academic path is currently configured for Level {user.level || 1} mastery. Target milestone: <strong className="text-cyan-200">Autonomous Agentic Systems & Multi-Agent Swarms</strong>.
            </p>

            {/* Horizontal Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#122631] border border-[#1e3e4f] p-3 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>{user.xpPoints} XP</span>
                </div>
                <div className="text-[10px] text-[#789cae]">Total XP Points</div>
              </div>

              <div className="bg-[#122631] border border-[#1e3e4f] p-3 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Level {user.level || 1}</span>
                </div>
                <div className="text-[10px] text-[#789cae]">Academic Rank</div>
              </div>

              <div className="bg-[#122631] border border-[#1e3e4f] p-3 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                  <Flame className="w-4 h-4 fill-rose-500" />
                  <span>{user.streakDays || 7} Days</span>
                </div>
                <div className="text-[10px] text-[#789cae]">Study Streak</div>
              </div>

              <div className="bg-[#122631] border border-[#1e3e4f] p-3 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{certificates.length} Certs</span>
                </div>
                <div className="text-[10px] text-[#789cae]">Verified Locker</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Overall Course Completion Animated SVG Circular Progress Ring */}
            <div
              className="group relative bg-[#0d222e] border border-[#1d4154] hover:border-emerald-400/50 p-3 rounded-2xl flex items-center gap-3 shadow-lg transition-all w-full"
              title="Overall Course Completion Percentage"
            >
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#143142"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="url(#emeraldPurpleGradient)"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={overallDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="emeraldPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                    {overallCompletionPercent}%
                  </span>
                  <span className="text-[8px] font-bold text-[#6a8ea0] uppercase">Course</span>
                </div>
              </div>

              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Overall Course Progress</span>
                </div>
                <div className="text-xs font-semibold text-white">
                  {completedEnrolledLessons} / {totalEnrolledLessons || 12} Lessons
                </div>
                <div className="text-[10px] text-[#6e93a6]">
                  {overallCompletionPercent >= 100 ? '🎓 Degree Completed!' : 'On Track for Graduation'}
                </div>
              </div>
            </div>

            {/* Daily Study Goal Animated SVG Progress Ring Widget */}
            <div
              onClick={() => setShowGoalModal(true)}
              className="group relative cursor-pointer bg-[#0e1f29] border border-[#1b3e52] hover:border-cyan-400/50 p-3 rounded-2xl flex items-center gap-3 shadow-lg transition-all w-full"
              title="Click to adjust Daily Study Goal"
            >
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#163647"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="url(#cyanEmeraldGradient)"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="cyanEmeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                    {progressPercent}%
                  </span>
                  <span className="text-[8px] font-bold text-[#62889a] uppercase">Goal</span>
                </div>
              </div>

              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Daily Goal ({dailyGoalMinutes}m)</span>
                </div>
                <div className="text-xs font-semibold text-white">
                  {completedTodayMinutes} / {dailyGoalMinutes} min
                </div>
                <div className="text-[10px] text-[#6e93a6]">
                  {progressPercent >= 100 ? '🎉 Goal Achieved!' : 'Click to adjust target'}
                </div>
              </div>
            </div>

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#142933] hover:bg-[#1b3846] text-white border border-[#214354] font-medium text-xs shadow-md transition-all"
              >
                <FolderSync className="w-4 h-4 text-cyan-400" />
                <span>Google Workspace & Keys</span>
              </button>
            )}

            {onOpenClassroomModal && (
              <button
                onClick={onOpenClassroomModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-medium text-xs shadow-md transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Sync Classroom</span>
              </button>
            )}

            <button
              onClick={onOpenAITutor}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white font-semibold text-xs shadow-lg shadow-cyan-950/40 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      </div>

      {workspaceMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{workspaceMsg}</span>
        </div>
      )}

      {/* 2. Recharts 7-Day Course Completion Trends Visualization */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1a24] via-[#0e222f] to-[#0a1822] border border-[#1b3e52] p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#183a4c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                Recharts Analytics
              </span>
              <span className="text-xs text-[#789cae]">Last 7 Days Academic Activity</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Course Completion & Learning Velocity</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-[#051117] p-1 rounded-xl border border-[#163647]">
            <button
              onClick={() => setChartMetric('lessons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartMetric === 'lessons'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-[#7398aa] hover:text-white'
              }`}
            >
              Lessons & Time
            </button>
            <button
              onClick={() => setChartMetric('xp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartMetric === 'xp'
                  ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                  : 'text-[#7398aa] hover:text-white'
              }`}
            >
              XP & Completion %
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-[#061219] border border-[#173849]">
            <div className="text-[10px] font-bold text-[#688ca0] uppercase">7-Day Completed</div>
            <div className="text-base font-black text-white mt-0.5">31 Lessons</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#061219] border border-[#173849]">
            <div className="text-[10px] font-bold text-[#688ca0] uppercase">Total Study Time</div>
            <div className="text-base font-black text-cyan-300 mt-0.5">435 Minutes</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#061219] border border-[#173849]">
            <div className="text-[10px] font-bold text-[#688ca0] uppercase">XP Accumulated</div>
            <div className="text-base font-black text-emerald-300 mt-0.5">2,710 XP</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#061219] border border-[#173849]">
            <div className="text-[10px] font-bold text-[#688ca0] uppercase">Completion Target</div>
            <div className="text-base font-black text-amber-300 mt-0.5">100% On Track</div>
          </div>
        </div>

        {/* Recharts Area Chart Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={completionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#16384a" vertical={false} />
              <XAxis dataKey="day" stroke="#668b9e" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: '#1b3e52' }} />
              <YAxis stroke="#668b9e" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: '#1b3e52' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#07151e',
                  borderColor: '#1e4257',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
              />
              {chartMetric === 'lessons' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="completedLessons"
                    name="Lessons Completed"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#cyanGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="studyMinutes"
                    name="Study Minutes"
                    stroke="#34d399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#emeraldGradient)"
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="xpEarned"
                    name="XP Points Earned"
                    stroke="#34d399"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#emeraldGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    name="Target Completion %"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#cyanGradient)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Google Tasks Summary Widget & Weekly Study Schedule Planner */}
      <div className="space-y-6">
        <GoogleTasksWidget />
        <WeeklySchedulePlanner />
      </div>

      {/* 3. Badges & Milestones Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {/* Badges Locker */}
        <div className="rounded-2xl bg-[#10222b] border border-[#1c3a47] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Achievements & Unlocked Badges</span>
            </h3>
            <span className="text-xs text-[#789cae] font-mono">{defaultBadges.length} Badges</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {defaultBadges.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-[#0b171f] border border-[#1b3846] text-center space-y-1 hover:border-cyan-500/40 transition-colors"
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="text-xs font-bold text-white truncate">{b.name}</div>
                <div className="text-[10px] text-[#7195a4] line-clamp-2 leading-tight">{b.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Learning Progress */}
        <div className="rounded-2xl bg-[#10222b] border border-[#1c3a47] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Active Academic Milestones</span>
            </h3>
            <span className="text-xs text-[#789cae] font-mono">XP Targets</span>
          </div>

          <div className="space-y-3">
            {defaultMilestones.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-[#0b171f] border border-[#1b3846] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{m.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    m.achieved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {m.achieved ? 'Completed' : `${m.targetXP} XP Target`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#12232c] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (user.xpPoints / m.targetXP) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Integrated 2x4 Curated Catalog Grid */}
      <CatalogGrid2x4
        onSelectCourse={onSelectCourse}
        onOpenAITutor={onOpenAITutor}
        onExportWorkspace={handleExportWorkspace}
      />

      {/* 4. All Courses & Custom Filter Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1c3846] pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Interactive Academic Modules & Courses
            </h2>
            <p className="text-xs text-[#82a4b3]">All available degree courses with interactive quizzes, TTS audio scripts, and flashcards</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0b171f] p-1 rounded-xl border border-[#1d3d4b] overflow-x-auto max-w-full">
            {['all', 'enrolled', 'ai', 'Computer Science', 'Physics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-[#183644] text-white shadow-md font-semibold'
                    : 'text-[#799db0] hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'ai' ? '✨ AI Generated' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const prog = progressMap[course.id];
            const completedCount = prog?.completedLessonIds.length || 0;
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const isEnrolled = user.enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="group bg-[#10222b] border border-[#1c3a47] hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-44 overflow-hidden">
                    <ThemedCourseImage
                      src={course.coverImage}
                      alt={course.title}
                      category={course.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10222b] via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {course.level}
                      </span>
                      {course.isAiGenerated && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md text-cyan-200 border border-cyan-400/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Architect
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-3 flex items-center gap-1 text-amber-400 text-xs font-semibold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase">
                      {course.category}
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#82a4b3] line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#7195a4] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.durationHours}h total
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {totalLessons} lessons
                      </span>
                    </div>

                    {/* Progress Bar if enrolled */}
                    {isEnrolled && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#82a4b3] font-medium">Progress</span>
                          <span className="text-cyan-300 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0b171f] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Buttons */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isEnrolled ? (percent > 0 ? 'Continue Course' : 'Start Course') : 'Enroll & Learn'}</span>
                  </button>

                  <button
                    onClick={() => handleExportWorkspace('docs', course.title)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#0c1820] hover:bg-[#152e39] text-[#7195a4] hover:text-white text-[11px] border border-[#1e3c4a] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Study Plan to Google Docs</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earned Certificates Section */}
      <div className="bg-[#10222b] border border-[#1c3a47] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Verified Credentials & Academic Certificates
            </h2>
            <p className="text-xs text-[#82a4b3]">Official credentials issued upon completing degree modules and defense evaluations</p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-8 text-[#789cae] text-xs border border-dashed border-[#1e3c4a] rounded-xl">
            No certificates earned yet. Complete your first program and pass quizzes to generate an official verified certificate!
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => onOpenCertificate(cert)}
                className="p-4 rounded-xl bg-[#0b171f] border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all hover:bg-[#122530] flex items-start justify-between group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Certificate</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-[11px] text-[#789cae]">
                    Issued to {cert.studentName} on {cert.issuedDate}
                  </p>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    ID: {cert.verificationId}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Study Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0c1a24] border border-[#1c3e52] rounded-3xl p-6 space-y-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-[#183648] pb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Daily Study Goal Target</h3>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="text-[#7296a8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[#81a5b6]">
                Set your target daily learning commitment. Reaching your daily study goal builds your study streak and awards bonus XP.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300">Target Time (Minutes per Day)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setGoalInput(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        goalInput === mins
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                          : 'bg-[#061219] border border-[#193a4b] text-[#81a5b6] hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="number"
                    min="15"
                    max="300"
                    value={goalInput}
                    onChange={(e) => setGoalInput(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#061219] border border-[#193a4b] text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 rounded-xl bg-[#08151d] hover:bg-[#122834] text-[#81a5b6] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onUpdateUser) {
                    onUpdateUser({ dailyStudyGoal: goalInput });
                  }
                  setShowGoalModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-black shadow-lg"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
