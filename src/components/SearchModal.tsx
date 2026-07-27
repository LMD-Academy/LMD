import React, { useState } from 'react';
import { Course } from '../types';
import { Search, X, GraduationCap, BookOpen, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { CURATED_8_PROGRAMS } from './CatalogGrid2x4';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectProgram: (course: Course) => void;
  onSelectTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectProgram,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredPrograms = CURATED_8_PROGRAMS.filter(
    (item) =>
      item.program.title.toLowerCase().includes(query.toLowerCase()) ||
      item.program.description.toLowerCase().includes(query.toLowerCase()) ||
      item.program.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0b1820] border border-[#1b3a4a] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#0d202b] border-b border-[#1c3e50] flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search degrees, courses, research papers, API docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-[#5d8293]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-[#142e3b] text-gray-300 hover:text-white rounded-lg border border-[#1d3e50]"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {/* Section 1: Degree Programs */}
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accredited Degree Programs ({filteredPrograms.length})</span>
            </div>
            <div className="space-y-2">
              {filteredPrograms.slice(0, 4).map((item) => (
                <div
                  key={item.program.id}
                  onClick={() => {
                    onSelectProgram(item.program);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-[#0e212b] border border-[#1d4052] hover:border-cyan-400/50 hover:bg-[#122834] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        {item.program.category || 'Degree'}
                      </span>
                      <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.program.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#789cae] line-clamp-1">{item.program.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#527788] group-hover:text-cyan-400 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Active Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Individual Courses ({filteredCourses.length})</span>
              </div>
              <div className="space-y-2">
                {filteredCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      onSelectProgram(course);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#0e212b] border border-[#1d4052] hover:border-emerald-400/50 hover:bg-[#122834] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-[#789cae] line-clamp-1">{course.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#527788] group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-[#1c3e50] flex flex-wrap gap-2 text-[11px]">
            <button
              onClick={() => {
                onSelectTab('docs');
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0e212b] border border-[#1d4052] hover:bg-[#15313f] text-[#82a3b2] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Browse Platform Documentation</span>
            </button>
            <button
              onClick={() => {
                onSelectTab('api_engine');
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0e212b] border border-[#1d4052] hover:bg-[#15313f] text-[#82a3b2] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Developer API Console</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
