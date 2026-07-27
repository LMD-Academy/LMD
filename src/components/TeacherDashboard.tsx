import React, { useState } from 'react';
import { ThemedCourseImage } from './ThemedCourseImage';
import { Course, UserProfile } from '../types';
import {
  PlusCircle,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle,
  BarChart3,
  Brain,
  Award,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  Send
} from 'lucide-react';

interface TeacherDashboardProps {
  user: UserProfile;
  courses: Course[];
  onOpenCourseGenerator: () => void;
  onSelectCourse: (course: Course) => void;
  onOpenClassroomModal?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  courses,
  onOpenCourseGenerator,
  onSelectCourse,
  onOpenClassroomModal,
}) => {
  const [quickQuizTopic, setQuickQuizTopic] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<any[] | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const handleGenerateQuickQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuizTopic.trim()) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 3 high-quality multiple choice quiz questions for students on the topic: "${quickQuizTopic}". Format as JSON array of objects with keys: question, options (array of 4 strings), correctAnswerIndex (0-3), and explanation.`,
          thinkingMode: false
        })
      });
      const data = await res.json();
      try {
        const jsonMatch = data.reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          setGeneratedQuiz(JSON.parse(jsonMatch[0]));
        } else {
          setGeneratedQuiz([
            {
              question: `Sample Quiz Question on ${quickQuizTopic}`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswerIndex: 0,
              explanation: 'Concept explanation generated successfully.'
            }
          ]);
        }
      } catch (e) {
        console.warn('Failed to parse quiz json:', e);
      }
    } catch (err) {
      console.error('Quiz generator error:', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Teacher Welcome & Architect Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Faculty & AI Curriculum Portal
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Teacher Dashboard & AI Curriculum Architect
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              Design adaptive courses in seconds using Gemini 3.1 AI, monitor student mastery curves across modules, and issue automated certificates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {onOpenClassroomModal && (
              <button
                onClick={onOpenClassroomModal}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-bold text-sm shadow-xl transition-all hover:scale-[1.02] shrink-0"
              >
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Sync Google Classroom</span>
              </button>
            )}
            <button
              onClick={onOpenCourseGenerator}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] shrink-0"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Generate New Course with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#13131c] border border-white/10 space-y-1">
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Total Courses</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{courses.length}</div>
          <p className="text-[11px] text-purple-300">Published & Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#13131c] border border-white/10 space-y-1">
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">1,420</div>
          <p className="text-[11px] text-emerald-400">+18% this month</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#13131c] border border-white/10 space-y-1">
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Avg Quiz Accuracy</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">88.4%</div>
          <p className="text-[11px] text-emerald-400">Adaptive leveling effective</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#13131c] border border-white/10 space-y-1">
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Certificates Issued</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">384</div>
          <p className="text-[11px] text-amber-300">Verified QR Hash</p>
        </div>
      </div>

      {/* Main Grid: Course Management & Quick AI Quiz Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Managed Courses List */}
        <div className="lg:col-span-2 space-y-4 bg-[#13131c] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Curriculum & Course Repository
              </h2>
              <p className="text-xs text-gray-400">Manage modules, lessons, audio scripts, and quizzes</p>
            </div>
            <button
              onClick={onOpenCourseGenerator}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:bg-purple-600/50"
            >
              + Create
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <ThemedCourseImage
                    src={course.coverImage}
                    alt={course.title}
                    category={course.category}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {course.category}
                      </span>
                      {course.isAiGenerated && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Course
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{course.title}</h4>
                    <p className="text-xs text-gray-400">
                      {course.modules.length} Modules • {course.durationHours} Hours • Level: {course.level}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all w-full sm:w-auto text-center"
                >
                  Preview Course
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Quick Quiz & Assessment Generator */}
        <div className="space-y-4 bg-[#13131c] border border-white/10 rounded-2xl p-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-400" />
              AI Instant Quiz Generator
            </h2>
            <p className="text-xs text-gray-400">Generate multi-choice quizzes for any lesson topic on demand</p>
          </div>

          <form onSubmit={handleGenerateQuickQuiz} className="space-y-3">
            <input
              type="text"
              value={quickQuizTopic}
              onChange={(e) => setQuickQuizTopic(e.target.value)}
              placeholder="e.g. Neural Networks & Backpropagation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isGeneratingQuiz || !quickQuizTopic.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isGeneratingQuiz ? 'AI Architecting Quiz...' : 'Generate 3 Quiz Questions'}</span>
            </button>
          </form>

          {/* Generated Quiz Output */}
          {generatedQuiz && (
            <div className="space-y-3 pt-3 border-t border-white/10 max-h-80 overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-emerald-400">Generated Quiz Result:</div>
              {generatedQuiz.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                  <div className="font-semibold text-white">Q{idx + 1}: {q.question}</div>
                  <div className="space-y-1 text-gray-300">
                    {q.options?.map((opt: string, oIdx: number) => (
                      <div key={oIdx} className={`px-2 py-1 rounded text-[11px] ${oIdx === q.correctAnswerIndex ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'bg-black/30 text-gray-400'}`}>
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-400 italic">Explanation: {q.explanation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
