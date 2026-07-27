import React, { useState, useMemo } from 'react';
import { DEGREE_PROGRAMS } from '../data/degreePrograms';
import { Course } from '../types';
import {
  GraduationCap,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  ArrowRight,
  Brain,
  Compass,
  FileText,
  Bookmark,
  Scale,
  X,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

interface DegreeProgramsCatalogProps {
  onSelectCourse: (course: Course) => void;
}

export const DegreeProgramsCatalog: React.FC<DegreeProgramsCatalogProps> = ({
  onSelectCourse
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Interactive features state
  const [savedProgramIds, setSavedProgramIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [comparedPrograms, setComparedPrograms] = useState<Course[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [previewProgram, setPreviewProgram] = useState<Course | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    DEGREE_PROGRAMS.forEach(p => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const toggleBookmark = (id: string) => {
    setSavedProgramIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (prog: Course) => {
    setComparedPrograms(prev => {
      const exists = prev.some(p => p.id === prog.id);
      if (exists) return prev.filter(p => p.id !== prog.id);
      if (prev.length >= 3) return prev;
      return [...prev, prog];
    });
  };

  // Filter programs cleanly
  const filteredPrograms = useMemo(() => {
    return DEGREE_PROGRAMS.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        selectedDegreeLevel === 'All' ||
        (selectedDegreeLevel === 'Master' && p.degreeMetadata.degreeLevel.includes('Master')) ||
        (selectedDegreeLevel === 'Bachelor' && p.degreeMetadata.degreeLevel.includes('Bachelor')) ||
        (selectedDegreeLevel === 'Doctorate' && (p.degreeMetadata.degreeLevel.includes('Ph.D') || p.degreeMetadata.degreeLevel.includes('Doctor'))) ||
        (selectedDegreeLevel === 'PostDoc' && (p.degreeMetadata.degreeLevel.includes('Post-Doc') || p.degreeMetadata.degreeLevel.includes('Research')));

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchesSaved = !showSavedOnly || savedProgramIds.includes(p.id);

      return matchesSearch && matchesLevel && matchesCategory && matchesSaved;
    });
  }, [searchQuery, selectedDegreeLevel, selectedCategory, showSavedOnly, savedProgramIds]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage) || 1;

  // Paginated items
  const currentPrograms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPrograms, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* 1. Hero Section matching Screenshot 2 with Geometric Contour Mesh */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#122b34] via-[#0f232b] to-[#0a151b] border border-[#1e3c4a] p-8 md:p-16 text-center shadow-2xl">
        {/* Animated Geometric Concentric Polygon / Contour Wave Mesh matching Screenshot 2 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-25">
          <svg
            className="w-[900px] h-[900px] text-cyan-400 animate-contour-pulse"
            viewBox="0 0 500 500"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            {/* Concentric polygon / topological contour lines */}
            <polygon points="250,50 380,100 430,220 380,350 250,420 120,350 70,220 120,100" opacity="0.2" />
            <polygon points="250,80 350,120 390,220 350,320 250,380 150,320 110,220 150,120" opacity="0.3" />
            <polygon points="250,110 320,140 350,220 320,290 250,340 180,290 150,220 180,140" opacity="0.4" />
            <polygon points="250,140 290,160 310,220 290,260 250,290 210,260 190,220 210,160" opacity="0.5" />
            <polygon points="250,170 270,180 280,220 270,240 250,250 230,240 220,220 230,180" opacity="0.6" />
            <ellipse cx="250" cy="220" rx="200" ry="140" opacity="0.25" strokeDasharray="4 4" />
            <ellipse cx="250" cy="220" rx="160" ry="110" opacity="0.3" />
            <ellipse cx="250" cy="220" rx="120" ry="80" opacity="0.4" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LMDpro Global Academic Platform</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            LMDpro — Elevate Your Learning Experience
          </h1>
          <p className="text-base md:text-lg text-[#9ab8c6] leading-relaxed max-w-2xl mx-auto font-normal">
            Your AI-powered partner for accredited LMD degree pathways, skill enhancement, and career advancement. Experience universal education, tailored to you.
          </p>
        </div>
      </div>

      {/* 2. Brand Value Proposition Section matching Screenshot 2 */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Transform Your Career with AI-Driven Learning
        </h2>
        <p className="text-sm text-[#87a7b5] leading-relaxed">
          LMDpro leverages cutting-edge AI to provide an educational experience that is truly personalized, effective, and geared toward real-world professional growth.
        </p>
      </div>

      {/* 3. Feature Highlights Cards matching Screenshot 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-[#11242d] border border-[#1d3c4a] p-6 space-y-3 shadow-lg hover:border-cyan-500/40 transition-colors group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">AI-Powered Learning Paths</h3>
          <p className="text-xs text-[#82a3b2] leading-relaxed">
            Dynamically creates personalized learning journeys based on your profile and goals, leveraging real-time content and comprehensive skill gap analysis.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#11242d] border border-[#1d3c4a] p-6 space-y-3 shadow-lg hover:border-cyan-500/40 transition-colors group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Comprehensive Course Catalog</h3>
          <p className="text-xs text-[#82a3b2] leading-relaxed">
            Explore a vast library of courses across Technology, Business, Leadership, and more. Content is structured for deep learning from foundations to executive strategy.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#11242d] border border-[#1d3c4a] p-6 space-y-3 shadow-lg hover:border-cyan-500/40 transition-colors group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">AI Academic Research Agent</h3>
          <p className="text-xs text-[#82a3b2] leading-relaxed">
            Leverage our AI research assistant for in-depth topic exploration, literature synthesis, and structured insight extraction from validated knowledge bases.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#11242d] border border-[#1d3c4a] p-6 space-y-3 shadow-lg hover:border-cyan-500/40 transition-colors group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Intelligent Resume Builder</h3>
          <p className="text-xs text-[#82a3b2] leading-relaxed">
            Import data from LinkedIn, design with customizable templates, and optimize content with AI suggestions tailored to specific job descriptions and ATS scoring.
          </p>
        </div>
      </div>

      {/* 4. Curriculum Bento Cards with faded geometrical lines matching Screenshot 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Leadership Fundamentals', category: 'Executive Leadership', pathType: 'triangle' },
          { title: 'Business Management', category: 'Corporate Strategy', pathType: 'arcs' },
          { title: 'Agile Methodology', category: 'Project Engineering', pathType: 'wave' },
          { title: 'Product Design', category: 'User Experience', pathType: 'stripes' }
        ].map((card, idx) => (
          <div
            key={idx}
            onClick={() => {
              const matched = DEGREE_PROGRAMS.find(p => p.category.toLowerCase().includes(card.title.toLowerCase())) || DEGREE_PROGRAMS[idx];
              onSelectCourse(matched);
            }}
            className="group relative h-56 rounded-2xl bg-gradient-to-b from-[#122832] to-[#0b171f] border border-[#1e3e4d] hover:border-cyan-400/60 p-5 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl"
          >
            {/* Geometrical faded lines background graphics matching Screenshot 1 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 group-hover:opacity-35 transition-opacity">
              {card.pathType === 'triangle' && (
                <svg className="w-full h-full text-cyan-300" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                  <polygon points="120,40 180,160 60,160" strokeWidth="1.5" />
                  <circle cx="150" cy="80" r="2" fill="currentColor" />
                  <circle cx="160" cy="90" r="2" fill="currentColor" />
                  <circle cx="140" cy="100" r="2" fill="currentColor" />
                  <circle cx="170" cy="110" r="2" fill="currentColor" />
                </svg>
              )}
              {card.pathType === 'arcs' && (
                <svg className="w-full h-full text-cyan-300" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M0,80 Q100,20 200,120" />
                  <path d="M0,100 Q100,40 200,140" />
                  <path d="M0,120 Q100,60 200,160" />
                  <path d="M0,140 Q100,80 200,180" />
                </svg>
              )}
              {card.pathType === 'wave' && (
                <svg className="w-full h-full text-cyan-300" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10,120 C50,80 70,160 110,120 C150,80 170,160 190,120" />
                  <circle cx="60" cy="60" r="15" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              )}
              {card.pathType === 'stripes' && (
                <svg className="w-full h-full text-cyan-300" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                  <line x1="40" y1="180" x2="160" y2="40" strokeWidth="2" />
                  <line x1="60" y1="190" x2="180" y2="50" strokeWidth="1" strokeDasharray="2 2" />
                  <rect x="140" y="140" width="20" height="20" rx="4" strokeWidth="1" />
                </svg>
              )}
            </div>

            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold relative z-10">
              {card.category}
            </span>

            <div className="relative z-10">
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                {card.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-2 font-medium">
                <span>View Program</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Clean Search & Filter Controls */}
      <div className="rounded-2xl bg-[#11242d] border border-[#1d3d4b] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Academic Program Catalog</h3>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {comparedPrograms.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold hover:bg-cyan-900/60 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Compare ({comparedPrograms.length}/3)</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowSavedOnly(!showSavedOnly);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                showSavedOnly
                  ? 'bg-teal-950/80 border-teal-500/50 text-teal-300'
                  : 'bg-[#0b171f] border-[#1d3a47] text-[#80a2b1] hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-teal-400" />
              <span>Saved ({savedProgramIds.length})</span>
            </button>

            <span className="text-[#80a2b1] hidden md:inline">
              Showing <strong className="text-white">{currentPrograms.length}</strong> of{' '}
              <strong className="text-white">{filteredPrograms.length}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#608798]" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b171f] border border-[#1d3a47] text-white placeholder-[#5a8090] text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Degree Level Filter */}
          <select
            value={selectedDegreeLevel}
            onChange={e => {
              setSelectedDegreeLevel(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-[#0b171f] border border-[#1d3a47] text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="All">All Academic Levels (Bachelor to Post-Doc)</option>
            <option value="Bachelor">Bachelor's Degrees (180 ECTS)</option>
            <option value="Master">Master's Degrees (120 ECTS)</option>
            <option value="Doctorate">Doctorate & Ph.D. Level (180 ECTS)</option>
            <option value="PostDoc">Post-Doctoral Quantum Research (Advanced)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-[#0b171f] border border-[#1d3a47] text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="All">All Disciplines</option>
            {categories.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Programs List View */}
      <div className="space-y-4">
        {currentPrograms.map((prog, index) => {
          const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
          const isMaster = prog.degreeMetadata.degreeLevel.includes('Master');
          const isSaved = savedProgramIds.includes(prog.id);
          const isCompared = comparedPrograms.some(p => p.id === prog.id);

          return (
            <div
              key={prog.id}
              className="group rounded-2xl bg-[#11242d] border border-[#1d3d4b] hover:border-cyan-500/50 p-6 transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Program Information */}
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-md">
                    #{globalIndex}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isMaster
                      ? 'bg-cyan-950/50 border-cyan-800/40 text-cyan-300'
                      : 'bg-teal-950/50 border-teal-800/40 text-teal-300'
                  }`}>
                    {prog.degreeMetadata.degreeLevel}
                  </span>
                  <span className="text-xs text-[#7195a4] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{prog.durationHours} Hours</span>
                  </span>
                  <span className="text-xs text-[#7195a4] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-teal-400" />
                    <span>{prog.degreeMetadata.credits} Credits</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-2">
                  <span>{prog.title}</span>
                </h3>

                <p className="text-xs text-[#85a8b7] leading-relaxed">
                  {prog.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {prog.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[#0a1820] border border-[#1c3947] text-[10px] text-[#81a5b4] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => toggleBookmark(prog.id)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-center transition-colors ${
                    isSaved
                      ? 'bg-teal-950/80 border-teal-500/50 text-teal-300'
                      : 'bg-[#0b171f] border-[#1d3d4b] text-[#7095a5] hover:text-white'
                  }`}
                  title={isSaved ? 'Remove Bookmark' : 'Bookmark Program'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={() => toggleCompare(prog)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    isCompared
                      ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                      : 'bg-[#0b171f] border-[#1d3d4b] text-[#7095a5] hover:text-white'
                  }`}
                  title="Compare Program"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>

                <button
                  onClick={() => setPreviewProgram(prog)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#142832] hover:bg-[#1c3846] border border-[#1e3e4f] text-[#91b8c8] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Syllabus</span>
                </button>

                <button
                  onClick={() => onSelectCourse(prog)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 transition-all active:scale-95"
                >
                  <span>View Program</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Pagination Controls */}
      <div className="flex items-center justify-between pt-4 text-xs">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#11242d] border border-[#1d3d4b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#18323e] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-[#81a5b4]">
          Page <strong className="text-white">{currentPage}</strong> of{' '}
          <strong className="text-white">{totalPages}</strong>
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#11242d] border border-[#1d3d4b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#18323e] transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 8. Interactive Syllabus Modal */}
      {previewProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0c1a21] border border-[#1e3c4a] rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 overflow-y-auto text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider">
                  {previewProgram.degreeMetadata.degreeLevel} • {previewProgram.degreeMetadata.credits} Credits
                </span>
                <h3 className="text-2xl font-bold text-white">{previewProgram.title}</h3>
                <p className="text-xs text-[#82a4b3]">{previewProgram.category}</p>
              </div>
              <button
                onClick={() => setPreviewProgram(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#9bbccb] leading-relaxed">
              {previewProgram.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Semester Curriculum & Modules</span>
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {previewProgram.modules.map((mod, idx) => (
                  <div key={mod.id} className="p-4 rounded-2xl bg-[#12242e] border border-[#1e3c4a] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                      <span>Module 0{idx + 1}</span>
                      <span className="text-[10px] text-[#7a9dae]">{mod.lessons.length} Lessons</span>
                    </div>
                    <h5 className="text-sm font-bold text-white">{mod.title}</h5>
                    <ul className="text-[11px] text-[#81a5b4] space-y-1">
                      {mod.lessons.map(l => (
                        <li key={l.id} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
                          <span className="truncate">{l.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e3c4a]">
              <button
                onClick={() => setPreviewProgram(null)}
                className="px-4 py-2.5 rounded-xl bg-[#12242e] text-[#81a5b4] text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const selected = previewProgram;
                  setPreviewProgram(null);
                  onSelectCourse(selected);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold flex items-center gap-2"
              >
                <span>Enroll in Program</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Side-by-Side Program Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c1a21] border border-[#1e3c4a] rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 overflow-y-auto text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Program Comparison ({comparedPrograms.length}/3)</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {comparedPrograms.map(prog => (
                <div key={prog.id} className="p-4 rounded-2xl bg-[#12242e] border border-[#1e3c4a] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">{prog.degreeMetadata.degreeLevel}</span>
                    <h4 className="text-sm font-bold text-white">{prog.title}</h4>
                    <p className="text-[11px] text-[#81a5b4] line-clamp-3">{prog.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#1e3c4a] text-xs">
                    <div className="flex justify-between text-[#81a5b4]">
                      <span>Credits:</span>
                      <strong className="text-white">{prog.degreeMetadata.credits}</strong>
                    </div>
                    <div className="flex justify-between text-[#81a5b4]">
                      <span>Duration:</span>
                      <strong className="text-white">{prog.durationHours} hrs</strong>
                    </div>
                    <div className="flex justify-between text-[#81a5b4]">
                      <span>Modules:</span>
                      <strong className="text-white">{prog.modules.length}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCompareModal(false);
                      onSelectCourse(prog);
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold"
                  >
                    Select Program
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
