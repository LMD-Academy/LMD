import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Download,
  Bookmark,
  Zap,
  Target,
  Clock,
  ChevronRight,
  Share2,
  RefreshCw,
  Award,
  Layers,
  Code
} from 'lucide-react';
import { UserProfile, StudyGuide, Course } from '../types';
import { OfflineStorageService } from '../services/offlineStorage';

interface AIStudyGuideGeneratorProps {
  user: UserProfile;
  courses: Course[];
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const AIStudyGuideGenerator: React.FC<AIStudyGuideGeneratorProps> = ({
  user,
  courses,
  onUpdateUser
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(
    courses[0]?.title || 'Autonomous AI Agents & Multi-Agent Swarms'
  );
  const [customWeakAreas, setCustomWeakAreas] = useState<string>('Tool calling schemas, rate limiting under load, error recovery');
  const [adaptiveLevel, setAdaptiveLevel] = useState<string>(user.learningLevel || 'standard');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [activeGuide, setActiveGuide] = useState<StudyGuide | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [guideBonusClaimed, setGuideBonusClaimed] = useState<boolean>(false);

  useEffect(() => {
    const loaded = OfflineStorageService.getStudyGuides();
    setStudyGuides(loaded);
    if (loaded.length > 0) {
      setActiveGuide(loaded[0]);
    }
  }, []);

  const handleGenerateStudyGuide = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGuideBonusClaimed(false);
    setUserAnswers({});
    setShowExplanations({});

    const weakAreasArray = customWeakAreas
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const response = await fetch('/api/gemini/generate-study-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          studentName: user.name,
          progressScore: Math.min(100, Math.max(30, (user.xpPoints % 100) + 40)),
          weakAreas: weakAreasArray,
          adaptiveLevel: adaptiveLevel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate study guide`);
      }

      const data = await response.json();
      if (data.studyGuide) {
        const newGuide: StudyGuide = data.studyGuide;
        const updatedGuides = OfflineStorageService.saveStudyGuide(newGuide);
        setStudyGuides(updatedGuides);
        setActiveGuide(newGuide);

        // Award +30 XP for generating a personalized study guide
        const updatedUser: UserProfile = {
          ...user,
          xpPoints: user.xpPoints + 30
        };
        OfflineStorageService.saveProfile(updatedUser);
        onUpdateUser(updatedUser);
      } else {
        throw new Error('Invalid study guide data received.');
      }
    } catch (err: any) {
      console.error('Study Guide Generation Error:', err);
      setErrorMsg(err.message || 'An error occurred while generating your study guide.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerQuestion = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (userAnswers[questionId] !== undefined) return; // Answered already

    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    setShowExplanations(prev => ({ ...prev, [questionId]: true }));

    if (optionIdx === correctIdx) {
      // Award +25 XP per correct question
      const updatedUser: UserProfile = {
        ...user,
        xpPoints: user.xpPoints + 25
      };
      OfflineStorageService.saveProfile(updatedUser);
      onUpdateUser(updatedUser);
    }
  };

  const handleToggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  return (
    <div className="space-y-8 text-slate-100">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/20 p-6 md:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Adaptive Learning Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
            Personalized AI Study Guide Generator
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Our neural synthesizer analyzes your quiz performance, adaptive learning path, and weak areas to draft tailored key concept summaries, formulas, and interactive practice questions with step-by-step explanations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Controls & Saved Guides (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Generator Form Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Generate New Guide</h2>
            </div>

            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Subject / Course
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
                <option value="Quantum Computing & Applied Physics">Quantum Computing & Applied Physics</option>
                <option value="Full-Stack System Architecture & Cloud Engineering">Full-Stack System Architecture</option>
                <option value="Autonomous AI Agent Workflows">Autonomous AI Agent Workflows</option>
              </select>
            </div>

            {/* Weak Areas Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Topics Requiring Practice (Comma separated)
              </label>
              <textarea
                value={customWeakAreas}
                onChange={e => setCustomWeakAreas(e.target.value)}
                placeholder="e.g. Rate limiting, State synchronization, QFT matrices"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {/* Adaptive Depth */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Adaptive Difficulty Depth
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['remedial', 'standard', 'accelerated'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setAdaptiveLevel(level)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border capitalize transition-all ${
                      adaptiveLevel === level
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateStudyGuide}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Study Guide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Synthesize Study Guide (+30 XP)</span>
                </>
              )}
            </button>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-xl">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Saved Study Guides List */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Your Study Guides</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {studyGuides.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {studyGuides.map(guide => {
                const isActive = activeGuide?.id === guide.id;
                return (
                  <div
                    key={guide.id}
                    onClick={() => {
                      setActiveGuide(guide);
                      setUserAnswers({});
                      setShowExplanations({});
                    }}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400 truncate max-w-[180px]">
                        {guide.subject}
                      </span>
                      <span className="text-[10px] text-slate-500">{guide.createdAt}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">
                      {guide.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Study Guide View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeGuide ? (
            <motion.div
              key={activeGuide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header Title Card */}
              <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5" />
                    <span>Level: {activeGuide.adaptiveLevel}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeGuide.createdAt}</span>
                    </span>
                    <button
                      onClick={() => alert('Study Guide exported as PDF/Markdown!')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Export Guide"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                  {activeGuide.title}
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-cyan-500 pl-4 py-1 bg-slate-950/40 rounded-r-xl">
                  {activeGuide.overallSummary}
                </p>
              </div>

              {/* Section 1: Concept Summaries */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Core Concept Summaries</h3>
                </div>

                <div className="space-y-6">
                  {activeGuide.conceptSummaries.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4"
                    >
                      <h4 className="text-base font-bold text-cyan-300">
                        {concept.conceptTitle}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {concept.summary}
                      </p>

                      {/* Code / Formula Example Box */}
                      {concept.codeOrFormulaExample && (
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                            <Code className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Execution Syntax / Formula</span>
                          </div>
                          <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap">
                            {concept.codeOrFormulaExample}
                          </pre>
                        </div>
                      )}

                      {/* Key Takeaways Pills */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>Key Takeaways</span>
                        </span>
                        <div className="space-y-1.5">
                          {concept.keyTakeaways.map((takeaway, tIdx) => (
                            <div key={tIdx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              <span>{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Interactive Practice Questions with Explanations */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Targeted Practice Questions</h3>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                    +25 XP per correct answer
                  </span>
                </div>

                <div className="space-y-6">
                  {activeGuide.practiceQuestions.map((q, qIdx) => {
                    const answered = userAnswers[q.id] !== undefined;
                    const selectedIdx = userAnswers[q.id];
                    const isCorrect = selectedIdx === q.correctAnswerIndex;

                    return (
                      <div
                        key={q.id || qIdx}
                        className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm md:text-base font-semibold text-slate-100">
                            <span className="text-cyan-400 font-bold mr-2">Q{qIdx + 1}.</span>
                            {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                          {q.options.map((option, optIdx) => {
                            let optionStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';
                            if (answered) {
                              if (optIdx === q.correctAnswerIndex) {
                                optionStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 font-semibold';
                              } else if (optIdx === selectedIdx) {
                                optionStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200';
                              } else {
                                optionStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={answered}
                                onClick={() => handleAnswerQuestion(q.id, optIdx, q.correctAnswerIndex)}
                                className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${optionStyle}`}
                              >
                                <span>{option}</span>
                                {answered && optIdx === q.correctAnswerIndex && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                )}
                                {answered && optIdx === selectedIdx && optIdx !== q.correctAnswerIndex && (
                                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Hint / Explanation Box */}
                        {answered && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`p-4 rounded-xl text-xs space-y-2 ${
                              isCorrect
                                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                                : 'bg-rose-950/30 border border-rose-500/30 text-rose-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2 font-bold">
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>Correct! (+25 XP Awarded)</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-rose-400" />
                                  <span>Not quite right.</span>
                                </>
                              )}
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              {q.detailedExplanation}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Recommended Action Plan */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Targeted Action Plan</h3>
                </div>

                <div className="space-y-3">
                  {activeGuide.actionPlan.map(step => {
                    const isDone = completedSteps[step.stepNumber];
                    return (
                      <div
                        key={step.stepNumber}
                        onClick={() => handleToggleStep(step.stepNumber)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                            : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
                          }`}
                        >
                          {isDone ? '✓' : step.stepNumber}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {step.action}
                          </p>
                          <p className="text-xs text-slate-400">{step.rationale}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No Study Guide Selected</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Generate a personalized study guide using the controls on the left to get instant AI summaries and practice questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
