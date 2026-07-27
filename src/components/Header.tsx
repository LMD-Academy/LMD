import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserRole, LanguageCode, Course } from '../types';
import {
  Search,
  Settings,
  X,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { AgenticAiIcon } from './AgenticAiIcon';
import { PomodoroTimer } from './PomodoroTimer';

interface HeaderProps {
  user: UserProfile;
  courses?: Course[];
  onSelectCourse?: (course: Course) => void;
  onOpenAITutor: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenSearch?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRoleChange?: (role: UserRole) => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  onOpenCourseGenerator?: () => void;
  onOpenClassroomModal?: () => void;
  onOpenAgentInspector?: () => void;
  onOpenRagIndexer?: () => void;
  onOpenLegalModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  courses = [],
  onSelectCourse,
  onOpenAITutor,
  onOpenProfile,
  onOpenSettings,
  activeTab,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-complete suggestions logic
  const filteredCourses = searchQuery.trim() === ''
    ? []
    : courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tags && c.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseClick = (course: Course) => {
    if (onSelectCourse) {
      onSelectCourse(course);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0a171f]/95 dark:bg-[#0a171f]/95 light:bg-white/90 backdrop-blur-xl border-b border-[#162e3a] light:border-slate-200 px-3 md:px-5 flex items-center justify-between gap-3 transition-all">
      {/* 1. Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xs md:max-w-md" ref={searchRef}>
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#5e8292] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search & jump to courses..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-[#040e13] border border-[#163647] text-xs text-white placeholder-[#5e8292] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#5e8292] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Auto-complete Dropdown */}
          {isSearchFocused && filteredCourses.length > 0 && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-[#0d1f29] border border-[#1b3e50] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in p-1.5 space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-[#163647]">
                Matching Courses ({filteredCourses.length})
              </div>
              {filteredCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#163647] flex items-center justify-between gap-2 group transition-all"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {course.title}
                      </div>
                      <div className="text-[10px] text-[#789cae] truncate">
                        {course.category} • {course.level}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#527788] group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}

          {isSearchFocused && searchQuery.trim() !== '' && filteredCourses.length === 0 && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-[#0d1f29] border border-[#1b3e50] rounded-2xl shadow-2xl p-3 z-50 text-center text-xs text-[#6e90a1]">
              No matching courses found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* Right Navigation: Pomodoro Timer, Docs, Settings, Profile, AI Button */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* 1. Pomodoro Study Timer */}
        <PomodoroTimer />

        {/* 2. Docs Button */}
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'docs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-[#8ba8b7] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Platform Documentation"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Docs</span>
        </button>

        {/* 3. Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-[#85a8b7] hover:text-white hover:bg-white/5 border border-transparent transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* 4. Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center pl-1 border-l border-[#1a3848] group"
          title="Profile"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full border border-cyan-500/30 object-cover group-hover:border-cyan-400 transition-all"
          />
        </button>

        {/* 5. AI Button */}
        <button
          onClick={onOpenAITutor}
          className="p-2 rounded-xl bg-gradient-to-r from-[#0f6674] to-[#137b8c] hover:from-[#137b8c] hover:to-[#178eA2] text-cyan-300 shadow-lg shadow-cyan-900/40 transition-all active:scale-95 border border-cyan-400/30 flex items-center justify-center group"
          title="AI Assistant / Kudo Agent"
        >
          <div className="group-hover:rotate-12 transition-transform">
            <AgenticAiIcon size={20} />
          </div>
        </button>
      </div>
    </header>
  );
};


