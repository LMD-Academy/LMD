import React, { useState } from 'react';
import { DEGREE_PROGRAMS } from '../data/degreePrograms';
import { Course } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Bot,
  FileSpreadsheet,
  FileText,
  Award,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface CatalogGrid2x4Props {
  onSelectCourse: (course: Course) => void;
  onOpenAITutor: () => void;
  onExportWorkspace: (docType: 'docs' | 'sheets', title: string) => void;
}

// 8 Curated Featured Programs with unique geometric background SVG styles
export const CURATED_8_PROGRAMS = [
  {
    program: DEGREE_PROGRAMS[0], // M.S. AI & Machine Learning
    themeColor: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-cyan-500/30',
    accentText: 'text-cyan-400',
    geoStyle: 'circles',
    title: 'M.S. Artificial Intelligence & Cognitive Architecture',
    description: 'Co-developed with DeepMind Academic Labs. Master deep neural networks, transformer models, multimodal agents, and LLM fine-tuning.'
  },
  {
    program: DEGREE_PROGRAMS[10], // M.S. Cybersecurity
    themeColor: 'from-slate-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'border-slate-500/30',
    accentText: 'text-slate-300',
    geoStyle: 'polygons',
    title: 'M.S. Cybersecurity & Zero-Trust Cloud Architecture',
    description: 'Advanced threat modeling, cryptographic protocols, cloud security posture management, and offensive security research.'
  },
  {
    program: DEGREE_PROGRAMS[20], // M.S. Data Science
    themeColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/30',
    accentText: 'text-emerald-400',
    geoStyle: 'waves',
    title: 'M.S. Data Science & Quantitative Analytics',
    description: 'High-dimensional data processing, statistical inference, Bayesian modeling, distributed data pipelines, and predictive algorithms.'
  },
  {
    program: DEGREE_PROGRAMS[30], // M.S. Software Engineering
    themeColor: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'border-blue-500/30',
    accentText: 'text-blue-400',
    geoStyle: 'gridLines',
    title: 'M.S. Autonomous Systems & Robotics Engineering',
    description: 'ROS2 robotics frameworks, spatial computer vision, SLAM navigation algorithms, and embodied physical AI control systems.'
  },
  {
    program: DEGREE_PROGRAMS[40], // M.S. Quantum
    themeColor: 'from-cyan-600/20 via-slate-500/10 to-transparent',
    borderColor: 'border-cyan-500/30',
    accentText: 'text-cyan-300',
    geoStyle: 'radii',
    title: 'B.S. Quantum Computing & Quantum Physics',
    description: 'Qiskit programming, quantum algorithms, qubit state superposition, entanglement mechanics, and fault-tolerant computing.'
  },
  {
    program: DEGREE_PROGRAMS[50], // M.S. Bio
    themeColor: 'from-teal-600/20 via-emerald-500/10 to-transparent',
    borderColor: 'border-teal-500/30',
    accentText: 'text-teal-300',
    geoStyle: 'dotsMesh',
    title: 'M.S. Computational Biology & Bioinformatics',
    description: 'Genomic sequencing analysis, protein structure prediction via AlphaFold pipelines, and biostatistical machine learning.'
  },
  {
    program: DEGREE_PROGRAMS[60], // M.S. Finance
    themeColor: 'from-teal-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'border-teal-500/30',
    accentText: 'text-teal-400',
    geoStyle: 'contours',
    title: 'B.S. Quantitative Finance & Algorithmic Trading',
    description: 'Financial econometrics, Black-Scholes options pricing models, stochastic calculus, and high-frequency execution pipelines.'
  },
  {
    program: DEGREE_PROGRAMS[70], // Executive Leadership
    themeColor: 'from-slate-600/20 via-teal-500/10 to-transparent',
    borderColor: 'border-slate-500/30',
    accentText: 'text-slate-300',
    geoStyle: 'hexagons',
    title: 'M.S. Executive Leadership & Corporate Strategy',
    description: 'Organizational transformation, global enterprise management, AI-driven corporate decision frameworks, and strategic M&A.'
  }
];

export const CatalogGrid2x4: React.FC<CatalogGrid2x4Props> = ({
  onSelectCourse,
  onOpenAITutor,
  onExportWorkspace
}) => {
  const [exportedMsg, setExportedMsg] = useState<string | null>(null);

  const handleQuickExport = (docType: 'docs' | 'sheets', title: string) => {
    onExportWorkspace(docType, title);
    setExportedMsg(`Exported "${title}" to Google ${docType === 'docs' ? 'Docs' : 'Sheets'}!`);
    setTimeout(() => setExportedMsg(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1c3846] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Featured Degree Programs
            </h2>
          </div>
          <p className="text-xs text-[#82a4b3] mt-1">
            Explore accredited academic specializations tailored for professional excellence
          </p>
        </div>
      </div>

      {exportedMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportedMsg}</span>
        </div>
      )}

      {/* 2x4 Bento Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {CURATED_8_PROGRAMS.map((item, idx) => {
          const course = item.program;

          return (
            <div
              key={idx}
              className={`group relative rounded-2xl bg-[#10222b] border ${item.borderColor} hover:border-cyan-400/60 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
            >
              {/* Custom Themed Header with Animated Geometrical Lines */}
              <div className={`relative h-32 bg-gradient-to-br ${item.themeColor} overflow-hidden p-4 flex flex-col justify-between border-b border-[#1a3847]`}>
                {/* SVG Animated Geometrical Lines Background */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id={`grid-${idx}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-300" />
                    </pattern>
                  </defs>

                  {item.geoStyle === 'circles' && (
                    <g stroke="currentColor" strokeWidth="0.8" fill="none" className="text-cyan-300">
                      <circle cx="80%" cy="30%" r="20" className="animate-pulse" />
                      <circle cx="80%" cy="30%" r="40" />
                      <circle cx="80%" cy="30%" r="65" />
                    </g>
                  )}

                  {item.geoStyle === 'polygons' && (
                    <g stroke="currentColor" strokeWidth="0.8" fill="none" className="text-purple-300">
                      <polygon points="10,10 50,20 30,70" />
                      <polygon points="80,20 120,80 160,30" />
                      <path d="M0,40 Q40,10 80,40 T160,40" />
                    </g>
                  )}

                  {item.geoStyle === 'waves' && (
                    <g stroke="currentColor" strokeWidth="1" fill="none" className="text-emerald-300">
                      <path d="M0,20 C40,60 80,0 120,40 S200,20 240,60" />
                      <path d="M0,40 C40,80 80,20 120,60 S200,40 240,80" />
                    </g>
                  )}

                  {item.geoStyle === 'gridLines' && (
                    <rect width="100%" height="100%" fill={`url(#grid-${idx})`} />
                  )}

                  {item.geoStyle === 'radii' && (
                    <g stroke="currentColor" strokeWidth="0.8" fill="none" className="text-fuchsia-300">
                      <line x1="0" y1="0" x2="200" y2="100" />
                      <line x1="100" y1="0" x2="100" y2="120" />
                      <line x1="0" y1="60" x2="200" y2="60" />
                    </g>
                  )}

                  {item.geoStyle === 'dotsMesh' && (
                    <g fill="currentColor" className="text-amber-300">
                      <circle cx="20" cy="20" r="2" />
                      <circle cx="60" cy="30" r="2" />
                      <circle cx="100" cy="20" r="2" />
                      <circle cx="140" cy="40" r="2" />
                      <circle cx="40" cy="70" r="2" />
                      <circle cx="120" cy="80" r="2" />
                    </g>
                  )}

                  {item.geoStyle === 'contours' && (
                    <g stroke="currentColor" strokeWidth="0.8" fill="none" className="text-teal-300">
                      <ellipse cx="50%" cy="50%" rx="30%" ry="20%" />
                      <ellipse cx="50%" cy="50%" rx="55%" ry="40%" />
                    </g>
                  )}

                  {item.geoStyle === 'hexagons' && (
                    <g stroke="currentColor" strokeWidth="0.8" fill="none" className="text-rose-300">
                      <polygon points="30,10 50,10 60,30 50,50 30,50 20,30" />
                      <polygon points="80,10 100,10 110,30 100,50 80,50 70,30" />
                    </g>
                  )}
                </svg>

                {/* Header Top Level Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-black/40 backdrop-blur-md ${item.accentText} border-white/10`}>
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold bg-black/40 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Header Bottom Program Title */}
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-200 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#82a4b3] line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-1 border-t border-[#1a3847]">
                  <div className="flex items-center justify-between text-[11px] text-[#7195a4]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {course.durationHours} Hours
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-medium">
                      <Award className="w-3 h-3 text-amber-400" />
                      +300 XP
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-1.5">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                    >
                      <span>Explore Program</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={onOpenAITutor}
                        className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#142832] hover:bg-[#1c3846] text-[#93b7c7] hover:text-white text-[11px] transition-colors border border-[#1d3d4b]"
                        title="Interactive Learning Guide"
                      >
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>Guide</span>
                      </button>

                      <button
                        onClick={() => handleQuickExport('docs', item.title)}
                        className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#142832] hover:bg-[#1c3846] text-[#93b7c7] hover:text-white text-[11px] transition-colors border border-[#1d3d4b]"
                        title="Export Study Guide to Google Docs"
                      >
                        <FileText className="w-3 h-3 text-emerald-400" />
                        <span>Export Doc</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
