import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Bot,
  Calendar,
  MessageSquare,
  Trophy,
  FolderSync,
  Code2,
  Mic,
  PenTool,
  Terminal,
  Check
} from 'lucide-react';
import {
  AnimatedStudioIcon,
  AnimatedDegreeIcon,
  AnimatedCatalogIcon,
  AnimatedEngineIcon,
  AnimatedShieldIcon,
  AnimatedFlameIcon,
  AnimatedNetworkIcon,
  AnimatedCadIcon,
  AnimatedTestHarnessIcon
} from './SidebarAnimatedIcons';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onOpenAuthModal: () => void;
  xpPoints: number;
  level: number;
  onOpenAITutor?: () => void;
  onOpenLegalModal?: () => void;
}

interface BackgroundServiceTool {
  id: string;
  label: string;
  icon: any;
  category: string;
  badge: string;
  color: string;
}

const ALL_BACKGROUND_TOOLS: BackgroundServiceTool[] = [
  { id: 'study_guide', label: 'AI Study Guides', icon: Sparkles, category: 'Tools', badge: 'AI', color: 'text-cyan-400' },
  { id: 'planner', label: 'Study Schedule', icon: Calendar, category: 'Tools', badge: 'Sync', color: 'text-emerald-400' },
  { id: 'forum', label: 'Community Forum', icon: MessageSquare, category: 'Community', badge: 'Q&A', color: 'text-indigo-400' },
  { id: 'leaderboard', label: 'Leaderboard & XP', icon: Trophy, category: 'Community', badge: 'Rank', color: 'text-amber-400' },
  { id: 'ai_labs', label: 'AI Features Studio', icon: Bot, category: 'AI Services', badge: 'Gemini', color: 'text-teal-300' },
  { id: 'live_voice', label: 'Live Audio Agent', icon: Mic, category: 'AI Services', badge: 'Voice', color: 'text-cyan-400' },
  { id: 'workbench', label: 'Socratic Workbench', icon: PenTool, category: 'AI Services', badge: 'Interactive', color: 'text-purple-300' },
  { id: 'prompt_diagnostics', label: 'Prompt Studio', icon: Terminal, category: 'AI Services', badge: 'Debug', color: 'text-amber-300' },
  { id: 'knowledge_base', label: 'Drive Workspace', icon: FolderSync, category: 'Workspace', badge: 'Cloud', color: 'text-emerald-400' },
  { id: 'api_engine', label: 'API Console', icon: Code2, category: 'Workspace', badge: 'Dev', color: 'text-amber-400' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTab,
  setActiveTab,
  userRole,
  onOpenAuthModal,
  xpPoints,
  level,
  onOpenAITutor,
  onOpenLegalModal,
}) => {
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState<boolean>(false);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [pinnedToolIds, setPinnedToolIds] = useState<string[]>([]); // Default: secondary buttons hidden from sidebar

  const primaryItems = [
    {
      id: 'dashboard',
      label: 'Learning Studio',
      renderIcon: (isActive: boolean) => <AnimatedStudioIcon isActive={isActive} />,
      badge: 'Main Hub',
      color: 'text-[#2dd4bf]'
    },
    {
      id: 'degrees',
      label: 'Degree Programs',
      renderIcon: (isActive: boolean) => <AnimatedDegreeIcon isActive={isActive} />,
      badge: 'Accredited',
      color: 'text-[#38bdf8]'
    },
    {
      id: 'trainings',
      label: 'Course Catalog',
      renderIcon: (isActive: boolean) => <AnimatedCatalogIcon isActive={isActive} />,
      badge: 'Catalog',
      color: 'text-[#60a5fa]'
    },
    {
      id: 'ai_labs',
      label: 'AI Feature Studio',
      renderIcon: (isActive: boolean) => <AnimatedTestHarnessIcon isActive={isActive} />,
      badge: 'Test Harness',
      color: 'text-[#34d399]'
    },
    {
      id: 'knowledge_graph',
      label: 'Knowledge Graph',
      renderIcon: (isActive: boolean) => <AnimatedNetworkIcon isActive={isActive} />,
      badge: 'D3.js Grid',
      color: 'text-[#22d3ee]'
    },
    {
      id: 'stem_cad',
      label: 'STEM CAD Studio',
      renderIcon: (isActive: boolean) => <AnimatedCadIcon isActive={isActive} />,
      badge: 'CAD Lens',
      color: 'text-[#a855f7]'
    },
  ];

  const togglePinTool = (toolId: string) => {
    setPinnedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const pinnedTools = ALL_BACKGROUND_TOOLS.filter((t) => pinnedToolIds.includes(t.id));

  return (
    <>
      {/* Mobile Overlay backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Retractable Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0a171f]/95 dark:bg-[#0a171f]/95 light:bg-white/95 backdrop-blur-xl border-r border-[#162e3a] light:border-slate-200 transition-all duration-300 flex flex-col ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Top Header & Toggle Button */}
        <div className={`h-14 flex items-center border-b border-[#162e3a] light:border-slate-200 shrink-0 px-3 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                LMD
              </div>
              <span className="font-extrabold text-sm text-white light:text-slate-900 tracking-tight">
                LMD<span className="text-cyan-400 light:text-cyan-600 font-bold">pro</span>
              </span>
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-[#7e9faf] light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/10 transition-colors"
            title={isOpen ? 'Collapse Navigation' : 'Expand Navigation'}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* User Level & XP Summary Box with Animated Flame */}
        {isOpen && (
          <div className="m-2.5 p-2.5 rounded-xl bg-[#0e212c] light:bg-slate-100 border border-[#1b3d4f] light:border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-white light:text-slate-900">
              <span className="flex items-center gap-1.5 text-cyan-300 light:text-cyan-700">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 light:text-teal-600" />
                Level {level}
              </span>
              <span className="text-[11px] text-[#7ea0b1] light:text-slate-600 flex items-center gap-1">
                <AnimatedFlameIcon className="w-3.5 h-3.5" />
                {xpPoints} XP
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#08131a] light:bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (xpPoints % 1000) / 10)}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-3">
          {/* Featured Pages Section */}
          <div className="space-y-1">
            {isOpen && (
              <h4 className="px-2.5 text-[10px] font-bold tracking-wider text-[#5f8293] light:text-slate-500 uppercase">
                Featured Pages
              </h4>
            )}
            {primaryItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#15313f] light:bg-cyan-50 light:border-cyan-300 text-white light:text-slate-900 font-semibold border border-cyan-500/30 shadow-sm'
                      : 'text-[#82a3b2] light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100'
                  }`}
                  title={item.label}
                >
                  <div className="shrink-0">{item.renderIcon(isActive)}</div>
                  {isOpen && (
                    <div className="flex-1 flex items-center justify-between text-xs overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      <span className="text-[10px] text-[#638797] light:text-slate-500 bg-[#0c1820] light:bg-slate-200 px-1.5 py-0.5 rounded border border-[#1c3846] light:border-slate-300">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Configured User Shortcuts (If Any Pinned) */}
          {pinnedTools.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#132c3a]">
              {isOpen && (
                <h4 className="px-2.5 text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                  Pinned Shortcuts
                </h4>
              )}
              {pinnedTools.map((tool) => {
                const isActive = activeTab === tool.id;
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all text-xs ${
                      isActive
                        ? 'bg-[#15313f] text-white font-semibold border border-cyan-500/30'
                        : 'text-[#7e9faf] hover:text-white hover:bg-white/5'
                    }`}
                    title={tool.label}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${tool.color}`} />
                    {isOpen && (
                      <div className="flex-1 flex items-center justify-between overflow-hidden text-[11px]">
                        <span className="truncate">{tool.label}</span>
                        <span className="text-[9px] text-[#527383] bg-[#07131a] px-1.5 py-0.2 rounded border border-[#153342]">
                          {tool.badge}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Combined Autonomous Services Engine Dropdown */}
          <div className="space-y-1 pt-2 border-t border-[#132c3a]">
            <button
              onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all text-xs font-bold ${
                isEngineDropdownOpen
                  ? 'bg-[#0f2835] text-cyan-200 border border-cyan-500/30 shadow-sm'
                  : 'text-[#7e9eaf] hover:text-white hover:bg-white/5'
              }`}
              title="Autonomous Background Engine & Services"
            >
              <AnimatedEngineIcon isActive={isEngineDropdownOpen} />
              {isOpen && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <div className="flex flex-col text-left">
                    <span className="truncate uppercase text-[10px] tracking-wider text-cyan-300">
                      Autonomous Engine
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono">Active in BG</span>
                  </div>
                  {isEngineDropdownOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#5f8191]" />
                  )}
                </div>
              )}
            </button>

            {/* Dropdown Content: Integrated Background Engine Status & Configurable Shortcuts */}
            {isEngineDropdownOpen && isOpen && (
              <div className="p-3 rounded-2xl bg-[#06141c] border border-[#163546] space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-200 border-b border-[#143140] pb-2">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Backend Pipeline
                  </span>
                  <button
                    onClick={() => setIsConfiguring(!isConfiguring)}
                    className="p-1 rounded bg-[#0e222d] hover:bg-[#163749] text-cyan-400 text-[10px] flex items-center gap-1 border border-[#1a3d52] transition-colors"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{isConfiguring ? 'Done' : 'Configure'}</span>
                  </button>
                </div>

                {!isConfiguring ? (
                  <div className="space-y-1.5 text-[11px] text-[#7192a3]">
                    <p className="leading-tight">
                      All AI Agents, Drive Sync, Study Planners & Forum Engine run automatically in the background when needed.
                    </p>
                    <div className="p-2 rounded-xl bg-[#091a24] border border-[#143242] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono">
                        <span>• AI Socratic Tutor</span>
                        <span className="text-emerald-400">Ready</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono">
                        <span>• Drive & Workspace Sync</span>
                        <span className="text-emerald-400">Connected</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono">
                        <span>• Study Schedule Sync</span>
                        <span className="text-emerald-400">Active</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <p className="text-[10px] text-cyan-300 font-medium">Pin shortcuts to left sidebar:</p>
                    {ALL_BACKGROUND_TOOLS.map((tool) => {
                      const isPinned = pinnedToolIds.includes(tool.id);
                      const IconComp = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => togglePinTool(tool.id)}
                          className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-left text-[11px] transition-colors ${
                            isPinned
                              ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200'
                              : 'bg-[#081720] border-[#143141] text-[#6c8e9f] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp className={`w-3.5 h-3.5 ${tool.color}`} />
                            <span className="truncate">{tool.label}</span>
                          </div>
                          {isPinned && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Gateway / Workspace Identity Trigger */}
        <div className="p-2 border-t border-[#162e3a] light:border-slate-200 shrink-0">
          <button
            onClick={onOpenAuthModal}
            className={`w-full flex items-center gap-2 p-2 rounded-xl bg-[#0e212c] light:bg-slate-100 hover:bg-[#15313f] border border-[#1b3d4f] light:border-slate-200 text-white light:text-slate-900 transition-all text-xs ${
              isOpen ? 'justify-between' : 'justify-center'
            }`}
            title="Google Workspace & Gemini API Key Gateway"
          >
            <div className="flex items-center gap-2">
              <AnimatedShieldIcon isActive={false} />
              {isOpen && <span>Identity & Keys</span>}
            </div>
            {isOpen && <ChevronRight className="w-3.5 h-3.5 text-[#5e8394]" />}
          </button>
        </div>
      </aside>
    </>
  );
};

