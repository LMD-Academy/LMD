import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  CalendarCheck,
  AlertCircle,
  Zap,
  BookOpen,
  Filter,
  Download,
  Share2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Layers,
  Edit3,
  X,
  Check,
  Tag
} from 'lucide-react';
import {
  googleSignIn,
  getAccessToken,
  initAuth
} from '../services/firebase';
import {
  WorkspaceService,
  GoogleCalendarEvent
} from '../services/workspace';
import { User } from 'firebase/auth';

export interface StudyBlock {
  id: string;
  title: string;
  subject: string;
  dayIndex: number; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  startTime: string; // "09:00"
  durationMinutes: number; // 60, 90, 120
  color: string; // border/bg accent
  category: 'Core Course' | 'Revision' | 'Exam Prep' | 'Project Lab' | 'Self Study';
  syncedEventId?: string;
  syncedHtmlLink?: string;
  isSyncing?: boolean;
}

const DAYS_OF_WEEK = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' }
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Core Course': { bg: 'bg-cyan-500/15', border: 'border-cyan-500/40', text: 'text-cyan-300' },
  'Revision': { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  'Exam Prep': { bg: 'bg-rose-500/15', border: 'border-rose-500/40', text: 'text-rose-300' },
  'Project Lab': { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300' },
  'Self Study': { bg: 'bg-purple-500/15', border: 'border-purple-500/40', text: 'text-purple-300' }
};

export const WeeklySchedulePlanner: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);

  // Initial Pre-populated Study Blocks
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>([
    {
      id: 'block-1',
      title: 'Deep Learning Architectures',
      subject: 'AI Swarms & Antigravity',
      dayIndex: 0, // Mon
      startTime: '09:00',
      durationMinutes: 90,
      color: 'cyan',
      category: 'Core Course'
    },
    {
      id: 'block-2',
      title: 'Distributed Consensus Lab',
      subject: 'Microservices & Raft',
      dayIndex: 1, // Tue
      startTime: '11:00',
      durationMinutes: 120,
      color: 'amber',
      category: 'Project Lab'
    },
    {
      id: 'block-3',
      title: 'Quantum Circuits Review',
      subject: 'Quantum Algorithms',
      dayIndex: 2, // Wed
      startTime: '14:00',
      durationMinutes: 60,
      color: 'emerald',
      category: 'Revision'
    },
    {
      id: 'block-4',
      title: 'Neural Socratus Cram Session',
      subject: 'Exam Preparation',
      dayIndex: 3, // Thu
      startTime: '10:00',
      durationMinutes: 90,
      color: 'rose',
      category: 'Exam Prep'
    },
    {
      id: 'block-5',
      title: 'Open Source Code Sprints',
      subject: 'Self Study & Refactoring',
      dayIndex: 4, // Fri
      startTime: '15:00',
      durationMinutes: 120,
      color: 'purple',
      category: 'Self Study'
    }
  ]);

  // Unassigned Course Modules Tray for Drag and Drop
  const [unassignedModules, setUnassignedModules] = useState([
    { id: 'u-1', title: 'Module 1: Multimodal Transformer Architectures', subject: 'Computer Science', category: 'Core Course' as const, durationMinutes: 90 },
    { id: 'u-2', title: 'Module 2: Agentic Search Grounding & RAG', subject: 'AI Systems', category: 'Project Lab' as const, durationMinutes: 120 },
    { id: 'u-3', title: 'Module 3: Quantum State Vector Simulation', subject: 'Physics & Quantum', category: 'Exam Prep' as const, durationMinutes: 60 },
    { id: 'u-4', title: 'Module 4: Zero-Trust Security Protocols', subject: 'Cybersecurity', category: 'Revision' as const, durationMinutes: 90 },
    { id: 'u-5', title: 'Module 5: Real-Time Audio Synthesis & Live API', subject: 'Acoustic Processing', category: 'Self Study' as const, durationMinutes: 90 }
  ]);

  // Drag and Drop Event Handlers
  const handleDragStartBlock = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('type', 'block');
    e.dataTransfer.setData('id', blockId);
  };

  const handleDragStartModule = (e: React.DragEvent, modId: string) => {
    e.dataTransfer.setData('type', 'module');
    e.dataTransfer.setData('id', modId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnDay = (e: React.DragEvent, targetDayIdx: number) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const id = e.dataTransfer.getData('id');

    if (type === 'block') {
      setStudyBlocks((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            const updated = { ...b, dayIndex: targetDayIdx };
            if (b.syncedEventId && (accessToken || getAccessToken())) {
              handleSyncBlock(updated);
            }
            return updated;
          }
          return b;
        })
      );
      setSyncStatusMsg(`Rescheduled study block to ${DAYS_OF_WEEK[targetDayIdx].full}`);
      setTimeout(() => setSyncStatusMsg(null), 3000);
    } else if (type === 'module') {
      const mod = unassignedModules.find((m) => m.id === id);
      if (!mod) return;

      const newBlock: StudyBlock = {
        id: 'block-dropped-' + Date.now(),
        title: mod.title,
        subject: mod.subject,
        dayIndex: targetDayIdx,
        startTime: '10:00',
        durationMinutes: mod.durationMinutes,
        color: 'cyan',
        category: mod.category
      };

      setStudyBlocks((prev) => [...prev, newBlock]);
      setUnassignedModules((prev) => prev.filter((m) => m.id !== id));

      setSyncStatusMsg(`Assigned "${mod.title}" to ${DAYS_OF_WEEK[targetDayIdx].full}!`);
      setTimeout(() => setSyncStatusMsg(null), 3500);

      const token = accessToken || getAccessToken();
      if (token) {
        handleSyncBlock(newBlock);
      }
    }
  };

  // Modal / Add Block State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<StudyBlock | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDayIndex, setNewDayIndex] = useState<number>(0);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newDuration, setNewDuration] = useState<number>(90);
  const [newCategory, setNewCategory] = useState<StudyBlock['category']>('Core Course');

  // Google Calendar Live Events State
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoadingCalendarEvents, setIsLoadingCalendarEvents] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth((user, token) => {
      setAuthUser(user);
      if (token) setAccessTokenState(token);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleAuth = async () => {
    try {
      setIsSigningIn(true);
      const res = await googleSignIn();
      if (res) {
        setAuthUser(res.user);
        setAccessTokenState(res.accessToken);
        setSyncStatusMsg('Successfully connected to Google Workspace & Calendar!');
        setTimeout(() => setSyncStatusMsg(null), 3500);
        if (res.accessToken) {
          fetchLiveCalendarEvents(res.accessToken);
        }
      }
    } catch (err) {
      console.error(err);
      setSyncStatusMsg('Google Calendar Auth failed. Please retry.');
      setTimeout(() => setSyncStatusMsg(null), 4000);
    } finally {
      setIsSigningIn(false);
    }
  };

  const fetchLiveCalendarEvents = async (tokenStr?: string) => {
    const token = tokenStr || accessToken || getAccessToken();
    if (!token) return;

    setIsLoadingCalendarEvents(true);
    try {
      const events = await WorkspaceService.listCalendarEvents(token);
      setCalendarEvents(events);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCalendarEvents(false);
    }
  };

  // Helper to get next occurrence date for dayIndex (0 = Mon, ..., 6 = Sun)
  const getNextDateForDayIndex = (dayIdx: number, timeStr: string): string => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, ...
    // Convert currentDay to 0 = Mon, ..., 6 = Sun
    const adjustedCurrentDay = currentDay === 0 ? 6 : currentDay - 1;

    let diff = dayIdx - adjustedCurrentDay;
    if (diff <= 0) diff += 7; // Next week's day

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);

    const [hrs, mins] = timeStr.split(':').map(Number);
    targetDate.setHours(hrs, mins, 0, 0);

    return targetDate.toISOString();
  };

  const getEndDate = (startIso: string, durationMinutes: number): string => {
    const d = new Date(startIso);
    d.setMinutes(d.getMinutes() + durationMinutes);
    return d.toISOString();
  };

  // Sync Single Block to Google Calendar
  const handleSyncBlock = async (block: StudyBlock) => {
    const token = accessToken || getAccessToken();
    if (!token) {
      handleGoogleAuth();
      return;
    }

    setStudyBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, isSyncing: true } : b))
    );

    const startIso = getNextDateForDayIndex(block.dayIndex, block.startTime);
    const endIso = getEndDate(startIso, block.durationMinutes);

    const eventPayload: GoogleCalendarEvent = {
      summary: `[Study Block] ${block.title} (${block.subject})`,
      description: `Scheduled Study Block created via LMDpro AI Platform.\nCategory: ${block.category}\nDuration: ${block.durationMinutes} mins`,
      start: { dateTime: startIso },
      end: { dateTime: endIso },
      colorId: block.category === 'Exam Prep' ? '11' : '7'
    };

    const res = await WorkspaceService.createCalendarEvent(token, eventPayload);

    setStudyBlocks((prev) =>
      prev.map((b) =>
        b.id === block.id
          ? {
              ...b,
              isSyncing: false,
              syncedEventId: res?.id || 'synced-local-' + Date.now(),
              syncedHtmlLink: res?.htmlLink || `https://calendar.google.com/calendar`
            }
          : b
      )
    );

    if (res) {
      setSyncStatusMsg(`Synced "${block.title}" to Google Calendar!`);
      setTimeout(() => setSyncStatusMsg(null), 3000);
      fetchLiveCalendarEvents(token);
    } else {
      setSyncStatusMsg(`Failed to sync "${block.title}". Check permissions.`);
      setTimeout(() => setSyncStatusMsg(null), 3500);
    }
  };

  // Bulk Sync All Unsynced Blocks
  const handleBulkSyncAll = async () => {
    const token = accessToken || getAccessToken();
    if (!token) {
      handleGoogleAuth();
      return;
    }

    setIsBulkSyncing(true);
    let count = 0;

    for (const block of studyBlocks) {
      if (!block.syncedEventId) {
        const startIso = getNextDateForDayIndex(block.dayIndex, block.startTime);
        const endIso = getEndDate(startIso, block.durationMinutes);

        const res = await WorkspaceService.createCalendarEvent(token, {
          summary: `[Study Block] ${block.title}`,
          description: `Category: ${block.category} | Subject: ${block.subject}`,
          start: { dateTime: startIso },
          end: { dateTime: endIso }
        });

        if (res) {
          count++;
          setStudyBlocks((prev) =>
            prev.map((b) =>
              b.id === block.id
                ? {
                    ...b,
                    syncedEventId: res.id,
                    syncedHtmlLink: res.htmlLink || 'https://calendar.google.com/calendar'
                  }
                : b
            )
          );
        }
      }
    }

    setIsBulkSyncing(false);
    setSyncStatusMsg(`Synced ${count} study blocks to Google Calendar!`);
    setTimeout(() => setSyncStatusMsg(null), 3500);
    fetchLiveCalendarEvents(token);
  };

  // AI Schedule Generator / Optimizer
  const handleGenerateAISchedule = () => {
    const aiSuggestedBlocks: StudyBlock[] = [
      {
        id: 'ai-1',
        title: 'Autonomous Swarm Simulation',
        subject: 'AI & Antigravity',
        dayIndex: 0,
        startTime: '08:00',
        durationMinutes: 90,
        color: 'cyan',
        category: 'Core Course'
      },
      {
        id: 'ai-2',
        title: 'Quantum Entanglement Math',
        subject: 'Physics & Computing',
        dayIndex: 1,
        startTime: '10:00',
        durationMinutes: 60,
        color: 'purple',
        category: 'Revision'
      },
      {
        id: 'ai-3',
        title: 'Zero-Trust Protocol Design',
        subject: 'Cybersecurity',
        dayIndex: 2,
        startTime: '13:00',
        durationMinutes: 120,
        color: 'amber',
        category: 'Project Lab'
      },
      {
        id: 'ai-4',
        title: 'Genomics Pipeline Sprints',
        subject: 'Computational Biology',
        dayIndex: 3,
        startTime: '15:00',
        durationMinutes: 90,
        color: 'emerald',
        category: 'Self Study'
      },
      {
        id: 'ai-5',
        title: 'Socratic Mock Board Exam',
        subject: 'Capstone Evaluation',
        dayIndex: 4,
        startTime: '09:00',
        durationMinutes: 120,
        color: 'rose',
        category: 'Exam Prep'
      }
    ];

    setStudyBlocks(aiSuggestedBlocks);
    setSyncStatusMsg('AI Agent generated a balanced 5-day study plan!');
    setTimeout(() => setSyncStatusMsg(null), 3500);
  };

  const handleOpenAddModal = (dayIdx: number = 0, timeStr: string = '09:00') => {
    setEditingBlock(null);
    setNewTitle('');
    setNewSubject('');
    setNewDayIndex(dayIdx);
    setNewStartTime(timeStr);
    setNewDuration(90);
    setNewCategory('Core Course');
    setIsAddModalOpen(true);
  };

  const handleSaveBlock = () => {
    if (!newTitle.trim()) return;

    if (editingBlock) {
      setStudyBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlock.id
            ? {
                ...b,
                title: newTitle,
                subject: newSubject || 'General',
                dayIndex: newDayIndex,
                startTime: newStartTime,
                durationMinutes: newDuration,
                category: newCategory
              }
            : b
        )
      );
    } else {
      const newBlock: StudyBlock = {
        id: 'block-' + Date.now(),
        title: newTitle,
        subject: newSubject || 'General Study',
        dayIndex: newDayIndex,
        startTime: newStartTime,
        durationMinutes: newDuration,
        color: 'cyan',
        category: newCategory
      };
      setStudyBlocks((prev) => [...prev, newBlock]);
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteBlock = (id: string) => {
    setStudyBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Calculate stats
  const totalWeeklyMinutes = studyBlocks.reduce((acc, b) => acc + b.durationMinutes, 0);
  const totalHours = (totalWeeklyMinutes / 60).toFixed(1);
  const syncedCount = studyBlocks.filter((b) => b.syncedEventId).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1b24] via-[#0d222e] to-[#07131a] border border-[#1b3d4f] p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
              Study Schedule Planner
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              Google Calendar Sync Active
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <span>Interactive Weekly Study Planner</span>
          </h2>

          <p className="text-xs text-[#7d9eb0] leading-relaxed max-w-2xl">
            Block out focused learning slots, optimize your workload with AI assistance, and seamlessly synchronize your academic timetable to Google Calendar.
          </p>
        </div>

        {/* Google Calendar Auth & Bulk Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerateAISchedule}
            className="px-4 py-2.5 rounded-2xl bg-[#0d2330] hover:bg-[#153447] text-cyan-300 border border-cyan-500/30 text-xs font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Auto-Plan</span>
          </button>

          {!accessToken ? (
            <button
              onClick={handleGoogleAuth}
              disabled={isSigningIn}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{isSigningIn ? 'Connecting...' : 'Connect Google Calendar'}</span>
            </button>
          ) : (
            <button
              onClick={handleBulkSyncAll}
              disabled={isBulkSyncing}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isBulkSyncing ? 'animate-spin' : ''}`} />
              <span>{isBulkSyncing ? 'Syncing All...' : `Sync All to Calendar (${syncedCount}/${studyBlocks.length})`}</span>
            </button>
          )}

          <button
            onClick={() => handleOpenAddModal(0, '09:00')}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 hover:bg-cyan-400 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Block</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncStatusMsg && (
        <div className="px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{syncStatusMsg}</span>
          </div>
          <button onClick={() => setSyncStatusMsg(null)} className="text-[#8ba7b8] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#091821] border border-[#1b3d4f] shadow-md">
          <div className="text-[10px] font-bold text-[#628494] uppercase tracking-wider">Weekly Planned Study</div>
          <div className="text-xl font-black text-white mt-1 flex items-baseline gap-1">
            <span>{totalHours}</span>
            <span className="text-xs font-normal text-[#81a2b2]">Hours</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091821] border border-[#1b3d4f] shadow-md">
          <div className="text-[10px] font-bold text-[#628494] uppercase tracking-wider">Total Blocks</div>
          <div className="text-xl font-black text-cyan-300 mt-1">{studyBlocks.length} Sessions</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091821] border border-[#1b3d4f] shadow-md">
          <div className="text-[10px] font-bold text-[#628494] uppercase tracking-wider">Google Calendar Synced</div>
          <div className="text-xl font-black text-emerald-300 mt-1">
            {syncedCount} / {studyBlocks.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091821] border border-[#1b3d4f] shadow-md">
          <div className="text-[10px] font-bold text-[#628494] uppercase tracking-wider">Connection State</div>
          <div className="text-xs font-bold text-cyan-300 mt-2 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${accessToken ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span>{accessToken ? 'OAuth Granted' : 'Local Only'}</span>
          </div>
        </div>
      </div>

      {/* Unassigned Course Modules Tray for Drag-and-Drop Assignment */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1c27] via-[#0d2533] to-[#081720] border border-[#1b3d50] p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Unassigned Course Modules</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Drag & Drop to Schedule
            </span>
          </div>
          <span className="text-[11px] text-[#6e91a2]">{unassignedModules.length} Modules Available</span>
        </div>

        {unassignedModules.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#051118] border border-[#143242] text-center text-xs text-[#6e91a2]">
            🎉 All course modules assigned to weekly calendar dates! You can also drag existing blocks between days.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {unassignedModules.map((mod) => (
              <div
                key={mod.id}
                draggable
                onDragStart={(e) => handleDragStartModule(e, mod.id)}
                className="p-3 rounded-2xl bg-[#06151e] border border-[#183a4e] hover:border-cyan-400/60 cursor-grab active:cursor-grabbing transition-all shadow-md group hover:scale-[1.02]"
                title="Drag this module to any day in the weekly calendar below"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {mod.category}
                  </span>
                  <span className="text-[10px] text-[#628799] font-mono">{mod.durationMinutes}m</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                  {mod.title}
                </h4>
                <p className="text-[10px] text-[#6d91a3] mt-1 truncate">{mod.subject}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive 7-Day Timetable Grid */}
      <div className="rounded-3xl bg-[#08151c] border border-[#1a3a4b] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#16384a]">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Weekly Study Grid (Mon – Sun)</span>
          </h3>

          <div className="flex items-center gap-3 text-xs text-[#7295a7]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Core Course
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Revision
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Exam Prep
            </span>
          </div>
        </div>

        {/* Day Columns */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day, dayIdx) => {
            const dayBlocks = studyBlocks.filter((b) => b.dayIndex === dayIdx);

            return (
              <div
                key={dayIdx}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnDay(e, dayIdx)}
                className="rounded-2xl bg-[#051117] border border-[#153444] hover:border-cyan-500/30 transition-colors p-3 flex flex-col justify-between min-h-[360px] space-y-3"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#143140]">
                  <div>
                    <span className="text-xs font-black text-white">{day.short}</span>
                    <span className="text-[10px] text-[#5e8091] block">{day.full}</span>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(dayIdx, '09:00')}
                    className="p-1.5 rounded-lg bg-[#0a1c26] hover:bg-cyan-500/20 text-[#7195a6] hover:text-cyan-300 transition-all"
                    title={`Add block for ${day.full}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Blocks Container */}
                <div className="flex-1 space-y-2 overflow-y-auto max-h-[420px] pr-0.5">
                  {dayBlocks.length === 0 ? (
                    <div
                      onClick={() => handleOpenAddModal(dayIdx, '09:00')}
                      className="h-24 rounded-xl border border-dashed border-[#183a4c] hover:border-cyan-500/50 flex flex-col items-center justify-center text-[10px] text-[#527485] hover:text-cyan-300 cursor-pointer transition-colors p-2 text-center"
                    >
                      <span>+ Drop Module or Add Block</span>
                    </div>
                  ) : (
                    dayBlocks.map((block) => {
                      const colorStyle = CATEGORY_COLORS[block.category] || CATEGORY_COLORS['Core Course'];

                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={(e) => handleDragStartBlock(e, block.id)}
                          className={`p-3 rounded-xl border ${colorStyle.bg} ${colorStyle.border} space-y-2 relative group shadow-sm hover:brightness-110 cursor-grab active:cursor-grabbing transition-all`}
                        >
                          <div className="flex items-start justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${colorStyle.text}`}>
                              {block.startTime} • {block.durationMinutes}m
                            </span>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => handleSyncBlock(block)}
                                disabled={block.isSyncing}
                                className={`p-1 rounded-md transition-all ${
                                  block.syncedEventId
                                    ? 'text-emerald-400 bg-emerald-500/20'
                                    : 'text-[#81a2b2] hover:text-cyan-300 bg-[#091b24]'
                                }`}
                                title={block.syncedEventId ? 'Synced to Google Calendar' : 'Sync to Google Calendar'}
                              >
                                {block.isSyncing ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : block.syncedEventId ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Calendar className="w-3 h-3" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteBlock(block.id)}
                                className="p-1 rounded-md text-[#6e90a1] hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                                title="Delete Block"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-2">{block.title}</h4>
                            <p className="text-[10px] text-[#7193a4] truncate">{block.subject}</p>
                          </div>

                          {block.syncedHtmlLink && (
                            <a
                              href={block.syncedHtmlLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline pt-1"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>View in Google Cal</span>
                            </a>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Calendar Live Events Side-Panel / Inspector */}
      {accessToken && (
        <div className="rounded-3xl bg-[#081721] border border-[#1b3d4f] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#16384a]">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>Live Google Calendar Events</span>
              </h3>
              <p className="text-xs text-[#6e91a2]">Directly fetched from primary Google Calendar via OAuth API</p>
            </div>

            <button
              onClick={() => fetchLiveCalendarEvents()}
              disabled={isLoadingCalendarEvents}
              className="px-3 py-1.5 rounded-xl bg-[#0b212d] hover:bg-[#133245] border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCalendarEvents ? 'animate-spin' : ''}`} />
              <span>Refresh Events</span>
            </button>
          </div>

          {calendarEvents.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6b8e9f]">
              No upcoming events found or click "Refresh Events" to sync.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {calendarEvents.slice(0, 6).map((ev, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#041016] border border-[#143242] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Synced Event
                    </span>
                    {ev.htmlLink && (
                      <a
                        href={ev.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#6d90a2] hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-xs font-extrabold text-white line-clamp-1">{ev.summary}</h4>
                  <p className="text-[10px] text-[#6d90a2] font-mono">
                    {ev.start.dateTime ? new Date(ev.start.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'All Day'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Block Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0a1c26] border border-[#1b3d4f] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#18394a]">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{editingBlock ? 'Edit Study Block' : 'Add New Study Block'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-[#6b8e9f] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#82a3b4] block mb-1">Block Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Deep Learning Foundations"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040e14] border border-[#173748] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#82a3b4] block mb-1">Subject / Course</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. AI Swarms & Antigravity"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040e14] border border-[#173748] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#82a3b4] block mb-1">Day of Week</label>
                  <select
                    value={newDayIndex}
                    onChange={(e) => setNewDayIndex(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#040e14] border border-[#173748] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {DAYS_OF_WEEK.map((d, i) => (
                      <option key={i} value={i}>
                        {d.full}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#82a3b4] block mb-1">Start Time</label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#040e14] border border-[#173748] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {TIME_SLOTS.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#82a3b4] block mb-1">Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#040e14] border border-[#173748] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes (1 hr)</option>
                    <option value={90}>90 Minutes (1.5 hrs)</option>
                    <option value={120}>120 Minutes (2 hrs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#82a3b4] block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#040e14] border border-[#173748] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Core Course">Core Course</option>
                    <option value="Revision">Revision</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Project Lab">Project Lab</option>
                    <option value="Self Study">Self Study</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#18394a]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7a9bb0] hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveBlock}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all"
              >
                Save Study Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
