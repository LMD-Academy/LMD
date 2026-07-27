import React, { useState } from 'react';
import { Course, LanguageCode } from '../types';
import { ApiService } from '../services/api';
import { Sparkles, X, PlusCircle, BookOpen, Layers, CheckCircle } from 'lucide-react';

interface AICourseArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: Course) => void;
}

export const AICourseArchitectModal: React.FC<AICourseArchitectModalProps> = ({
  isOpen,
  onClose,
  onCourseCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence & Tech');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Intermediate');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const course = await ApiService.generateCourse({
        topic,
        category,
        level,
        language,
      });

      onCourseCreated(course);
      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error('Course creation error:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#13131c] border border-purple-500/30 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Course Architect Studio</h3>
              <p className="text-xs text-gray-400">Generate full multi-module courses with AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-white/5 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">Course Topic / Subject *</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Distributed Ledger Systems & Smart Contracts"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a28] border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="Artificial Intelligence & Tech">AI & Technology</option>
                <option value="Physics & Science">Physics & Science</option>
                <option value="Business & Leadership">Business & Leadership</option>
                <option value="Data & Analytics">Data & Analytics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-300">Target Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a28] border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">Primary Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a28] border border-white/10 text-white text-xs focus:outline-none"
            >
              <option value="en">English 🇺🇸</option>
              <option value="es">Español 🇪🇸</option>
              <option value="fr">Français 🇫🇷</option>
              <option value="de">Deutsch 🇩🇪</option>
              <option value="ar">العربية 🇸🇦</option>
              <option value="ja">日本語 🇯🇵</option>
              <option value="zh">中文 🇨🇳</option>
              <option value="hi">हिन्दी 🇮🇳</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'AI Engine Architecting Course...' : 'Generate Full Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
