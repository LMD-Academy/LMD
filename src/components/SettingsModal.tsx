import React, { useState } from 'react';
import { UserProfile, LanguageCode, UserRole } from '../types';
import {
  X,
  Settings,
  User,
  Cpu,
  Globe,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Key,
  ShieldCheck,
  BookOpen,
  Check,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { getTranslation } from '../services/localization';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  isOffline: boolean;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onToggleOffline: () => void;
  onOpenWorkspaceAuth: () => void;
  onOpenClassroomModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  isOffline,
  onUpdateUser,
  onLanguageChange,
  onToggleOffline,
  onOpenWorkspaceAuth,
  onOpenClassroomModal,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'integrations' | 'privacy'>('general');
  const [geminiKey, setGeminiKey] = useState(user.geminiApiKey || '');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  const t = getTranslation(user.language);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    onUpdateUser({ geminiApiKey: geminiKey });
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  const handleToggleTheme = (newTheme: 'dark' | 'light') => {
    onUpdateUser({ theme: newTheme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#0b1820] border border-[#1b3a4a] text-white shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#0d202b] border-b border-[#1c3e50] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Platform Settings & Configurations</h2>
              <p className="text-xs text-[#82a3b2]">Manage preferences, AI keys, integrations, and display themes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/70 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1c3e50] bg-[#09151c] px-6 text-xs font-medium text-[#82a3b2]">
          {[
            { id: 'general', label: 'General & Appearance', icon: Sliders },
            { id: 'ai', label: 'AI & Gemini Models', icon: Cpu },
            { id: 'integrations', label: 'Classroom & Workspace', icon: BookOpen },
            { id: 'privacy', label: 'Privacy & PII Sanitizer', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-semibold bg-[#0d202b]/60'
                    : 'border-transparent hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* TAB 1: GENERAL & APPEARANCE */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Theme Toggle Section */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Theme Mode Preference</h3>
                    <p className="text-[#82a3b2]">Choose between executive night dark mode or crisp daylight mode</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleToggleTheme('dark')}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      (user.theme || 'dark') === 'dark'
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold shadow-md'
                        : 'bg-[#09151c] border-[#1a3848] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-cyan-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">{t.themeDark}</div>
                      <div className="text-[10px] text-[#7193a2]">Default Night Mode</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleToggleTheme('light')}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      user.theme === 'light'
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md'
                        : 'bg-[#09151c] border-[#1a3848] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">{t.themeLight}</div>
                      <div className="text-[10px] text-[#7193a2]">Crisp Daylight Mode</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Platform Localization Language</h3>
                    <p className="text-[#82a3b2]">Translate degree curricula, AI tutoring, and system actions into your preferred language</p>
                  </div>
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { code: 'en', flag: '🇺🇸', label: 'English' },
                    { code: 'es', flag: '🇪🇸', label: 'Español' },
                    { code: 'fr', flag: '🇫🇷', label: 'Français' },
                    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
                    { code: 'ar', flag: '🇸🇦', label: 'العربية' },
                    { code: 'ja', flag: '🇯🇵', label: '日本語' },
                    { code: 'zh', flag: '🇨🇳', label: '中文' },
                    { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onLanguageChange(lang.code as LanguageCode)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        user.language === lang.code
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-[#09151c] border-[#1a3848] text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="text-xs">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline Storage Toggle */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Offline Storage & Offline Sync</h3>
                  <p className="text-[#82a3b2]">Cache entire degree courses, quizzes, and certificates in local IndexedDB storage</p>
                </div>
                <button
                  onClick={onToggleOffline}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    isOffline
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                  <span>{isOffline ? 'Offline Forced Active' : 'Cloud Sync Active'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI & GEMINI MODELS */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Custom Gemini API Key</h3>
                    <p className="text-[#82a3b2]">Optionally enter your own Google AI Studio Gemini API Key for zero-rate-limit tutoring and course generation</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Key is encrypted and stored locally in memory/IndexedDB.</span>
                    <button
                      onClick={handleSaveApiKey}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-md flex items-center gap-1.5"
                    >
                      {savedKeySuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Key className="w-4 h-4" />}
                      <span>{savedKeySuccess ? 'Key Saved Successfully!' : 'Save Gemini Key'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Active Model Roster & Cognitive Routing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">PRIMARY MACRO ENGINE</span>
                    <h4 className="font-bold text-white">Gemini 3.1 Pro & Flash</h4>
                    <p className="text-[11px] text-[#7193a2]">Used for complex curriculum generation, multimodal RAG, and deep reasoning.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-1">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">EDGE MICRO ENGINE</span>
                    <h4 className="font-bold text-white">Nano Banana Pro (Local WASM)</h4>
                    <p className="text-[11px] text-[#7193a2]">Zero-latency client inference, local DOM analysis, and instant PII redaction.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Google Classroom Integration
                  </h3>
                  <p className="text-[#82a3b2]">Sync active courses, student rosters, assignment grades, and capstone submissions.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenClassroomModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-all"
                >
                  Launch Classroom Sync
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Google Workspace OAuth Gateway
                  </h3>
                  <p className="text-[#82a3b2]">Connect Google Drive, Sheets, Gmail, and Docs to export degree transcripts and research.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWorkspaceAuth();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] border border-cyan-500/30 text-cyan-300 font-semibold transition-all"
                >
                  {user.workspaceConnected ? 'Workspace Connected' : 'Connect Workspace'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Client-Side PII Sanitizer & Privacy Rules
                </h3>
                <p className="text-[#82a3b2]">
                  All student data, queries, and uploaded documents pass through an automated local edge sanitizer prior to external LLM requests.
                </p>
                <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                  <div className="text-xs font-semibold text-cyan-300">Active Redaction Filters:</div>
                  <ul className="list-disc pl-4 space-y-1 text-[#7193a2]">
                    <li>Automated email address & phone number masking (`[REDACTED_EMAIL]`)</li>
                    <li>SSN, credit card, and government identification stripping</li>
                    <li>Local token hashing for vector store anonymity</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#08131a] border-t border-[#1c3e50] flex justify-end gap-2 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] text-cyan-300 font-semibold transition-all border border-cyan-500/20"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
