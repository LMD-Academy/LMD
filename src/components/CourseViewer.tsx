import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Course, Lesson, StudentProgress, AdaptiveLevel, LanguageCode } from '../types';
import { ApiService } from '../services/api';
import { WorkspaceService } from '../services/workspace';
import { getAccessToken, googleSignIn } from '../services/firebase';
import confetti from 'canvas-confetti';
import { AutonomousParagraphExplainer } from './AutonomousParagraphExplainer';
import { ArticleLiveVoiceNarrator } from './ArticleLiveVoiceNarrator';
import { StudyWorkbenchDrawer } from './StudyWorkbenchDrawer';
import { CodeSandbox } from './CodeSandbox';
import { WebSpeechLecturer } from './WebSpeechLecturer';
import { RealtimeLessonAnnotator } from './RealtimeLessonAnnotator';
import { OfflineAnalyticsTracker } from '../services/offlineAnalytics';
import { PeerMatchCollaborator } from './PeerMatchCollaborator';
import { SnapshotService, LearningSnapshot } from '../services/snapshotService';
import { VoiceCommandController } from './VoiceCommandController';
import { AutoGlossaryCard } from './AutoGlossaryCard';
import { ConfettiXPBurstOverlay } from './ConfettiXPBurstOverlay';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Brain,
  HelpCircle,
  Sparkles,
  Globe,
  Download,
  Award,
  ChevronRight,
  BookOpen,
  RotateCcw,
  Zap,
  Sliders,
  Check,
  Code2,
  PanelRightOpen,
  FolderSync,
  ExternalLink,
  FileText,
  RefreshCw,
  Users,
  Bookmark,
  X
} from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  studentProgress?: StudentProgress;
  onUpdateProgress: (progress: StudentProgress) => void;
  onBack: () => void;
  onOpenAITutorWithContext: (lessonTitle: string, lessonContent: string) => void;
  onCourseCompleted: (courseTitle: string, score: number) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  studentProgress,
  onUpdateProgress,
  onBack,
  onOpenAITutorWithContext,
  onCourseCompleted,
  isFocusMode = false,
  onToggleFocusMode = () => {},
}) => {
  // Navigation State
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const activeModule = course.modules[activeModuleIndex] || course.modules[0];
  const activeLesson: Lesson = activeModule?.lessons[activeLessonIndex] || activeModule?.lessons[0];

  // Translation State
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Audio Narration State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Flashcards state
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isEvaluatingQuiz, setIsEvaluatingQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Local Completed Lessons set
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(
    studentProgress?.completedLessonIds || []
  );

  const [currentAdaptiveLevel, setCurrentAdaptiveLevel] = useState<AdaptiveLevel>(
    studentProgress?.adaptiveLevel || 'standard'
  );
  const [adaptiveAlert, setAdaptiveAlert] = useState<string | null>(null);

  // Retractable Workbench Drawer State
  const [isWorkbenchDrawerOpen, setIsWorkbenchDrawerOpen] = useState(false);

  // Engagement time-on-page analytics tracker
  useEffect(() => {
    if (!activeLesson) return;
    let secondsElapsed = 0;
    
    // Log initial page view interaction
    OfflineAnalyticsTracker.trackEvent(course.id, activeLesson.id, 'interaction', 1);

    const interval = setInterval(() => {
      secondsElapsed += 10;
      OfflineAnalyticsTracker.trackEvent(course.id, activeLesson.id, 'time_on_page', 10);
    }, 10000);

    return () => {
      clearInterval(interval);
      if (secondsElapsed > 0) {
        OfflineAnalyticsTracker.trackEvent(course.id, activeLesson.id, 'time_on_page', secondsElapsed % 10);
      }
    };
  }, [course.id, activeModuleIndex, activeLessonIndex, activeLesson]);

  // Background AI Executive Summary State
  const [moduleSummaries, setModuleSummaries] = useState<Record<string, string>>({});
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Google Drive & PDF Export State
  const [isExportingDrive, setIsExportingDrive] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
  const [exportedFolderUrl, setExportedFolderUrl] = useState<string | null>(null);

  // Peer Collab & Sidebar States
  const [isPeerSidebarOpen, setIsPeerSidebarOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(3);

  // Quiz wrong questions tracking & Remedial material states
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ question: string; studentAnswer: string; correctAnswer: string; explanation: string }>>([]);
  const [remedialGuide, setRemedialGuide] = useState<{
    gapsAnalysis: string;
    remedialMaterial: string;
    microModules?: Array<{
      title: string;
      duration: string;
      concept: string;
      practiceQuestion: {
        question: string;
        options: string[];
        answerIndex: number;
        explanation: string;
      };
    }>;
  } | null>(null);
  const [isGeneratingRemedial, setIsGeneratingRemedial] = useState(false);
  const [activeMicroPracticeAnswer, setActiveMicroPracticeAnswer] = useState<{ [key: number]: { selectedIndex: number; isCorrect: boolean } }>({});

  // Background Environment Snapshot & Resume state
  const [resumeSnapshot, setResumeSnapshot] = useState<LearningSnapshot | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);

  // Auto-Glossary & Confetti States
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [confettiOverlay, setConfettiOverlay] = useState<{ isVisible: boolean; message?: string; xpAmount?: number }>({
    isVisible: false
  });

  // Load environment snapshot from Firestore / LocalStorage on mount
  useEffect(() => {
    if (!course?.id) return;
    SnapshotService.loadSnapshot(course.id).then((snap) => {
      if (snap && (snap.activeModuleIndex !== activeModuleIndex || snap.activeLessonIndex !== activeLessonIndex)) {
        setResumeSnapshot(snap);
        setShowResumeBanner(true);
      }
    });
  }, [course?.id]);

  // Background auto-save environment state snapshot to Firestore
  useEffect(() => {
    if (!course?.id || !activeLesson) return;
    const saveTimer = setTimeout(() => {
      SnapshotService.saveSnapshot({
        courseId: course.id,
        activeModuleIndex,
        activeLessonIndex,
        activeLessonId: activeLesson.id,
        scrollPosition: window.scrollY || 0,
        activeTab: 'content',
        timestamp: Date.now()
      });
    }, 1200);
    return () => clearTimeout(saveTimer);
  }, [course?.id, activeModuleIndex, activeLessonIndex, activeLesson?.id]);

  // Resume where left off handler
  const handleResumeSession = () => {
    if (!resumeSnapshot) return;
    setActiveModuleIndex(resumeSnapshot.activeModuleIndex);
    setActiveLessonIndex(resumeSnapshot.activeLessonIndex);
    setShowResumeBanner(false);
    setTimeout(() => {
      if (resumeSnapshot.scrollPosition) {
        window.scrollTo({ top: resumeSnapshot.scrollPosition, behavior: 'smooth' });
      }
    }, 300);
  };

  // Academic Integrity Checker state
  const [studentProjectText, setStudentProjectText] = useState('');
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);
  const [integrityReport, setIntegrityReport] = useState<{
    alignmentScore: number;
    verifiedConcepts: string[];
    missingConcepts: string[];
    feedbackReport: string;
  } | null>(null);

  // Random online student fluctuation
  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 5) + 3);
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(2, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 15000);
    return () => clearInterval(interval);
  }, [activeLessonIndex, activeModuleIndex]);

  // Reset lesson-specific states on switch
  useEffect(() => {
    setWrongAnswers([]);
    setRemedialGuide(null);
    setStudentProjectText('');
    setIntegrityReport(null);
  }, [activeLessonIndex, activeModuleIndex]);

  // Export Course Structure & Notes to Formatted PDF using jsPDF
  const handleExportToPdf = () => {
    setIsExportingPdf(true);
    setExportSuccessMsg(null);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Decorative Top Banner
      doc.setFillColor(14, 31, 41); // Slate dark #0e1f29
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(34, 211, 238); // Cyan
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('LMDpro Academy - Academic Course Brief', 14, 16);

      doc.setTextColor(180, 205, 218);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Course: ${course.title}`, 14, 24);
      doc.text(`Level: ${course.level}  |  Category: ${course.category}  |  Duration: ${course.durationHours}h`, 14, 30);

      let y = 46;

      // Section 1: Course Structure & Modules Summary
      doc.setTextColor(14, 31, 41);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Course Structure & Syllabus Modules', 14, y);
      y += 8;

      course.modules.forEach((mod, mIdx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(235, 245, 252);
        doc.rect(14, y - 5, 182, 8, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Module ${mIdx + 1}: ${mod.title}`, 17, y);
        y += 8;

        mod.lessons.forEach((les, lIdx) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(`• Lesson ${lIdx + 1}: ${les.title} (${les.durationMinutes} mins)`, 21, y);
          y += 5.5;
        });
        y += 3;
      });

      y += 4;
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Section 2: Active Module Executive Summary
      doc.setFillColor(224, 242, 254);
      doc.rect(14, y - 5, 182, 9, 'F');
      doc.setTextColor(3, 105, 161);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`2. Executive Summary - ${activeModule.title}`, 17, y);
      y += 11;

      const activeSummary = moduleSummaries[activeModule.id] || activeModule.executiveSummary || 'Executive summary generated via LMDpro AI Engine.';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);

      const splitSummary = doc.splitTextToSize(activeSummary, 180);
      splitSummary.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += 5;
      });

      y += 6;
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Section 3: Active Lesson Notes & Key Takeaways
      doc.setFillColor(220, 252, 231);
      doc.rect(14, y - 5, 182, 9, 'F');
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`3. Active Lesson Notes: ${activeLesson.title}`, 17, y);
      y += 11;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);

      const splitContent = doc.splitTextToSize(activeLesson.content, 180);
      splitContent.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += 5;
      });

      if (activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0) {
        y += 6;
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Takeaways & Core Concepts:', 14, y);
        y += 6;

        activeLesson.keyTakeaways.forEach((kt) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          const splitKt = doc.splitTextToSize(`• ${kt}`, 176);
          splitKt.forEach((line: string) => {
            doc.text(line, 17, y);
            y += 5;
          });
        });
      }

      // Save PDF File
      const safeCourseTitle = course.title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      doc.save(`${safeCourseTitle}-Notes.pdf`);
      setExportSuccessMsg(`Exported PDF document: "${safeCourseTitle}-Notes.pdf"!`);
      setTimeout(() => setExportSuccessMsg(null), 5000);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setExportSuccessMsg('Failed to generate PDF document.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Automatic Background AI Service: Generate ~200-word executive summary for active module
  useEffect(() => {
    if (!activeModule) return;
    if (!moduleSummaries[activeModule.id] && !activeModule.executiveSummary) {
      setIsGeneratingSummary(true);
      ApiService.generateModuleExecutiveSummary(
        activeModule.title,
        activeModule.description,
        activeModule.lessons.map((l) => l.title)
      )
        .then((summary) => {
          setModuleSummaries((prev) => ({ ...prev, [activeModule.id]: summary }));
        })
        .catch((err) => console.error('Error generating executive summary:', err))
        .finally(() => setIsGeneratingSummary(false));
    }
  }, [activeModuleIndex, activeModule]);

  // Handle Export Course Notes & AI Explainers to 'LMDpro Academy' Folder in Google Drive
  const handleExportToLMDproDrive = async () => {
    setIsExportingDrive(true);
    setExportSuccessMsg(null);
    try {
      let token = getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }

      if (!token) {
        setExportSuccessMsg('Google Drive authentication required. Please sign in.');
        return;
      }

      const activeSummary =
        moduleSummaries[activeModule.id] ||
        activeModule.executiveSummary ||
        'Module executive summary generated via Zalamati AI Engine.';

      const fileContent = `# ${course.title}
## ${activeModule.title} - Executive Summary & Quick Review

${activeSummary}

---
### Active Lesson Notes: ${activeLesson.title}

${activeLesson.content}

### Key Takeaways
${activeLesson.keyTakeaways?.map((k) => `- ${k}`).join('\n') || '- Master core principles and execution loops.'}

---
*Exported directly to LMDpro Academy Drive Folder via Zalamati eLearning Platform*
`;

      const safeCourseTitle = course.title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const safeModuleTitle = activeModule.title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const fileName = `${safeCourseTitle} - ${safeModuleTitle} Notes.md`;

      const result = await WorkspaceService.exportToLMDproAcademyFolder(token, fileName, fileContent, 'text/markdown');

      if (result) {
        setExportedFolderUrl(result.folderUrl);
        setExportSuccessMsg(`Successfully saved "${fileName}" to 'LMDpro Academy' folder in Google Drive!`);
      } else {
        setExportSuccessMsg('Drive export failed. Please verify permissions.');
      }
    } catch (e) {
      console.error('Drive export error:', e);
      setExportSuccessMsg('Export error occurred.');
    } finally {
      setIsExportingDrive(false);
    }
  };

  // Handle lesson change
  useEffect(() => {
    setTranslatedContent(null);
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveFlashcardIndex(0);
    setIsFlashcardFlipped(false);
  }, [activeModuleIndex, activeLessonIndex]);

  // Handle Translation
  const handleTranslate = async (lang: LanguageCode) => {
    setActiveLanguage(lang);
    if (lang === 'en') {
      setTranslatedContent(null);
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await ApiService.translateText(activeLesson.content, lang);
      setTranslatedContent(translated);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Audio Playback
  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    // 1. Check if server TTS is available
    if (!audioDataUri) {
      setIsLoadingAudio(true);
      const audioUri = await ApiService.generateTTSAudio(activeLesson.audioScript || activeLesson.title);
      setIsLoadingAudio(false);
      if (audioUri) {
        setAudioDataUri(audioUri);
        if (audioRef.current) {
          audioRef.current.src = audioUri;
          audioRef.current.playbackRate = audioSpeed;
          audioRef.current.play();
          return;
        }
      }
    } else if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
      audioRef.current.play();
      return;
    }

    // 2. Fallback to Web Speech Synthesis API if server audio isn't returned
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeLesson.audioScript || activeLesson.title);
      utterance.rate = audioSpeed;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Submit Quiz Question
  const handleAnswerSubmit = async (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const quiz = activeLesson.quizzes[currentQuizIndex];
    if (!quiz) return;

    setIsEvaluatingQuiz(true);

    const evalResult = await ApiService.evaluateQuizResponse({
      question: quiz.question,
      studentAnswer: quiz.options[optionIndex],
      correctAnswer: quiz.options[quiz.correctAnswerIndex],
      explanation: quiz.explanation,
      currentAdaptiveLevel: currentAdaptiveLevel
    });

    setIsEvaluatingQuiz(false);
    setQuizFeedback(evalResult.feedback);
    if (evalResult.isCorrect) {
      setQuizScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [
        ...prev,
        {
          question: quiz.question,
          studentAnswer: quiz.options[optionIndex],
          correctAnswer: quiz.options[quiz.correctAnswerIndex],
          explanation: quiz.explanation
        }
      ]);
    }
    if (evalResult.newAdaptiveLevel) {
      setCurrentAdaptiveLevel(evalResult.newAdaptiveLevel);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex + 1 < activeLesson.quizzes.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizFeedback(null);
    } else {
      // Quiz finished for this lesson!
      const isLessonComplete = !completedLessonIds.includes(activeLesson.id);
      let updatedCompleted = completedLessonIds;
      if (isLessonComplete) {
        updatedCompleted = [...completedLessonIds, activeLesson.id];
        setCompletedLessonIds(updatedCompleted);
      }

      // Calculate adaptive difficulty adjustment based on quiz accuracy
      const totalQs = activeLesson.quizzes.length || 1;
      const pct = Math.round((quizScore / totalQs) * 100);
      let newLevel: AdaptiveLevel = 'standard';
      let alertMsg = '';

      if (pct >= 80) {
        newLevel = 'accelerated';
        alertMsg = `⚡ Adaptive Learning Engine Triggered: Exceptional Performance (${pct}% Score)! Complexity elevated to Accelerated Challenge Track for upcoming course modules.`;
      } else if (pct < 50) {
        newLevel = 'remedial';
        alertMsg = `💡 Adaptive Learning Engine Triggered: Performance (${pct}% Score). Switched to Remedial Track with step-by-step conceptual practice.`;
      } else {
        newLevel = 'standard';
        alertMsg = `🎯 Adaptive Learning Engine Triggered: Solid Performance (${pct}% Score). Standard Reinforced Track maintained for next lessons.`;
      }

      setCurrentAdaptiveLevel(newLevel);
      setAdaptiveAlert(alertMsg);

      // Trigger automatic Remedial material generation if gaps identified
      if (wrongAnswers.length > 0 || pct < 100) {
        setIsGeneratingRemedial(true);
        ApiService.generateQuizRemediation(activeLesson.title, activeLesson.content, wrongAnswers)
          .then(res => {
            setRemedialGuide(res);
          })
          .catch(err => {
            console.error('Failed to compile remedial guide:', err);
          })
          .finally(() => {
            setIsGeneratingRemedial(false);
          });
      }

      // Calculate total progress
      const totalCourseLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const progressPercentage = Math.round((updatedCompleted.length / totalCourseLessons) * 100);

      const updatedProgress: StudentProgress = {
        userId: 'usr-student-01',
        courseId: course.id,
        completedLessonIds: updatedCompleted,
        quizResults: {
          ...(studentProgress?.quizResults || {}),
          [activeLesson.id]: {
            courseId: course.id,
            lessonId: activeLesson.id,
            score: quizScore,
            totalQuestions: totalQs,
            percentage: pct,
            passed: pct >= 50,
            feedback: alertMsg,
            completedAt: new Date().toISOString(),
            adaptiveLevelAdjusted: newLevel
          }
        },
        overallProgressPercentage: progressPercentage,
        adaptiveLevel: newLevel,
        lastAccessedAt: new Date().toISOString(),
        timeSpentMinutes: (studentProgress?.timeSpentMinutes || 0) + activeLesson.durationMinutes
      };

      onUpdateProgress(updatedProgress);
      setShowQuizModal(false);

      // Trigger Confetti Celebration & XP Burst Overlay
      setConfettiOverlay({
        isVisible: true,
        message: `Lesson Quiz Completed! (${pct}% Score)`,
        xpAmount: pct >= 80 ? 150 : 100
      });

      // Check if course completed 100%
      if (progressPercentage >= 100) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onCourseCompleted(course.title, 98);
      }
    }
  };

  const startQuizForLesson = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizFeedback(null);
    setQuizScore(0);
    setShowQuizModal(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        className="hidden"
      />

      {/* Top Bar with Back Button & Adaptive Level Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Voice Command Interface */}
          <VoiceCommandController
            onNextLesson={() => {
              if (activeLessonIndex + 1 < activeModule.lessons.length) {
                setActiveLessonIndex(activeLessonIndex + 1);
              } else if (activeModuleIndex + 1 < course.modules.length) {
                setActiveModuleIndex(activeModuleIndex + 1);
                setActiveLessonIndex(0);
              }
            }}
            onPrevLesson={() => {
              if (activeLessonIndex > 0) {
                setActiveLessonIndex(activeLessonIndex - 1);
              } else if (activeModuleIndex > 0) {
                setActiveModuleIndex(activeModuleIndex - 1);
                setActiveLessonIndex(course.modules[activeModuleIndex - 1].lessons.length - 1);
              }
            }}
            onOpenQuiz={() => startQuizForLesson()}
            onOpenDashboard={() => onBack()}
            onReadLesson={() => handleToggleAudio()}
            onToggleNotes={() => setIsWorkbenchDrawerOpen(!isWorkbenchDrawerOpen)}
            onTogglePeerCollab={() => setIsPeerSidebarOpen(!isPeerSidebarOpen)}
            onToggleWorkbench={() => setIsWorkbenchDrawerOpen(!isWorkbenchDrawerOpen)}
            onToggleGlossary={() => setIsGlossaryOpen(!isGlossaryOpen)}
            onVerifyIntegrity={() => {
              if (activeLesson) {
                setIsCheckingIntegrity(true);
                ApiService.checkAcademicIntegrity(activeLesson.content, activeLesson.title, activeLesson.content)
                  .then(report => setIntegrityReport(report))
                  .catch(e => console.error(e))
                  .finally(() => setIsCheckingIntegrity(false));
              }
            }}
          />

          {/* Auto-Glossary Toggle Button */}
          <button
            onClick={() => setIsGlossaryOpen(!isGlossaryOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isGlossaryOpen
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-[#0e222f] hover:bg-[#183648] text-cyan-300 border-cyan-500/30'
            }`}
            title="Toggle Lesson Auto-Glossary Terminology"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Glossary</span>
          </button>

          {/* Immersive Focus Mode Button */}
          <button
            onClick={() => {
              onToggleFocusMode();
              OfflineAnalyticsTracker.trackEvent(course.id, activeLesson.id, 'interaction', 1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isFocusMode
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
            title="Toggle immersive Focus Mode"
          >
            <Zap className={`w-3.5 h-3.5 ${isFocusMode ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`} />
            <span>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Adaptive Level: <strong className="capitalize">{currentAdaptiveLevel}</strong></span>
          </div>

          <button
            onClick={() => onOpenAITutorWithContext(activeLesson.title, activeLesson.content)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-purple-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tutor Context</span>
          </button>

          <button
            onClick={() => setIsPeerSidebarOpen(!isPeerSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-md transition-all active:scale-95 ${
              isPeerSidebarOpen
                ? 'bg-[#1b0d2d] border-purple-500 text-purple-300'
                : 'bg-[#0e222f] hover:bg-[#183648] text-cyan-300 border-cyan-500/30'
            }`}
            title="Toggle Peer Messaging Sidebar"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Peer Collab ({onlineCount})</span>
          </button>

          <button
            onClick={() => setIsWorkbenchDrawerOpen(!isWorkbenchDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e222f] hover:bg-[#183648] text-cyan-300 text-xs font-bold border border-cyan-500/30 shadow-md transition-all active:scale-95"
            title="Open Slim Right Study Workbench Sidebar"
          >
            <PanelRightOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Study Workbench</span>
          </button>
        </div>
      </div>

      {/* Resume Where You Left Off Firestore Banner */}
      {showResumeBanner && resumeSnapshot && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d2230] via-[#102b3d] to-[#0c1c28] border border-cyan-500/40 text-xs text-white shadow-xl flex items-center justify-between animate-fade-in gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Bookmark className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">Firestore Learning Snapshot Found</span>
              <p className="font-semibold text-gray-200">
                Resume from Module {resumeSnapshot.activeModuleIndex + 1}, Lesson {resumeSnapshot.activeLessonIndex + 1}?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResumeSession}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              Resume Session ⚡
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Course Player Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module & Lesson Sidebar */}
        {!isFocusMode && (
          <div className="lg:col-span-1 space-y-4 bg-[#13131c] border border-white/10 rounded-2xl p-5 h-fit">
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-sm line-clamp-1">{course.title}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{course.category}</p>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {course.modules.map((mod, mIdx) => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-xs font-bold text-indigo-300 flex items-center justify-between uppercase tracking-wider">
                    <span>Mod {mIdx + 1}: {mod.title}</span>
                  </div>

                  <div className="space-y-1">
                    {mod.lessons.map((les, lIdx) => {
                      const isSelected = mIdx === activeModuleIndex && lIdx === activeLessonIndex;
                      const isCompleted = completedLessonIds.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveModuleIndex(mIdx);
                            setActiveLessonIndex(lIdx);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all text-xs ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 font-semibold'
                              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0 ml-1">{les.durationMinutes}m</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Lesson Content Area */}
        <div className={`${isFocusMode ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6`}>
          {/* Adaptive Learning Algorithm Notification Banner */}
          {adaptiveAlert && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 border border-purple-500/40 text-xs text-purple-200 flex items-start justify-between gap-3 shadow-xl animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-xs flex items-center gap-2">
                    <span>Adaptive Learning Engine Active</span>
                    <span className="px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-mono border border-cyan-500/30">
                      {currentAdaptiveLevel} Track
                    </span>
                  </div>
                  <p className="mt-1 text-gray-200 leading-relaxed">{adaptiveAlert}</p>
                </div>
              </div>
              <button
                onClick={() => setAdaptiveAlert(null)}
                className="text-gray-400 hover:text-white p-1"
                title="Dismiss Alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Web Speech API Audio Narration Engine */}
          <WebSpeechLecturer
            lessonTitle={activeLesson.title}
            lessonContent={translatedContent || activeLesson.content}
          />

          {/* Lesson View Panel */}
          <div className="bg-[#13131c] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
            {/* Header Title & Translation selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {activeModule.title}
                </span>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {activeLesson.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Retractable Workbench Drawer Trigger */}
                <button
                  onClick={() => setIsWorkbenchDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/30 transition-all shadow-md"
                >
                  <PanelRightOpen className="w-4 h-4" />
                  <span>Study Workbench & Notes</span>
                </button>

                {/* Translate dropdown */}
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <Globe className="w-4 h-4 text-indigo-400 ml-2" />
                  <select
                    value={activeLanguage}
                    onChange={(e) => handleTranslate(e.target.value as LanguageCode)}
                    className="bg-transparent text-xs text-gray-200 font-semibold p-1 focus:outline-none cursor-pointer"
                  >
                    <option value="en" className="bg-[#161622]">🇺🇸 English</option>
                    <option value="es" className="bg-[#161622]">🇪🇸 Español</option>
                    <option value="fr" className="bg-[#161622]">🇫🇷 Français</option>
                    <option value="de" className="bg-[#161622]">🇩🇪 Deutsch</option>
                    <option value="ar" className="bg-[#161622]">🇸🇦 العربية</option>
                    <option value="ja" className="bg-[#161622]">🇯🇵 日本語</option>
                    <option value="zh" className="bg-[#161622]">🇨🇳 中文</option>
                    <option value="hi" className="bg-[#161622]">🇮🇳 हिन्दी</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Article Voice Narrator & Socratic Agent */}
            <ArticleLiveVoiceNarrator
              lessonTitle={activeLesson.title}
              lessonContent={activeLesson.content}
            />

            {/* Quick Review: Module Executive Summary Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a1b26] via-[#0d2332] to-[#071722] border border-[#1b3e52] shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#143447]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Quick Review</h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                        200-Word Executive Summary
                      </span>
                    </div>
                    <p className="text-[11px] text-[#789cae]">AI-generated synthesis for {activeModule.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportToPdf}
                    disabled={isExportingPdf}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Export complete course structure and study notes into a formatted PDF"
                  >
                    {isExportingPdf ? (
                      <div className="w-3.5 h-3.5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>Export to PDF</span>
                  </button>

                  <button
                    onClick={handleExportToLMDproDrive}
                    disabled={isExportingDrive}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Export Notes and Executive Summary to 'LMDpro Academy' Google Drive Folder"
                  >
                    {isExportingDrive ? (
                      <div className="w-3.5 h-3.5 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FolderSync className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>Export to 'LMDpro Academy' Drive</span>
                  </button>
                </div>
              </div>

              {exportSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between gap-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{exportSuccessMsg}</span>
                  </div>
                  {exportedFolderUrl && (
                    <a
                      href={exportedFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 font-bold hover:underline flex items-center gap-1 text-[11px] shrink-0"
                    >
                      <span>Open Folder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-200 leading-relaxed bg-[#05131b] p-4 rounded-xl border border-[#123142]">
                {isGeneratingSummary ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-cyan-300 text-xs font-semibold">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Generating module executive summary via Gemini AI...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-xs text-gray-200 space-y-2">
                    {(
                      moduleSummaries[activeModule.id] ||
                      activeModule.executiveSummary ||
                      'Executive summary ready for review.'
                    )
                      .split('\n\n')
                      .map((chunk, idx) => (
                        <p key={idx} className="whitespace-pre-line">{chunk}</p>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Body Content */}
            <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-4">
              {isTranslating ? (
                <div className="flex items-center justify-center py-12 text-purple-300 gap-2">
                  <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  <span>Translating lesson via Gemini AI...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {(translatedContent || activeLesson.content)
                    .split('\n\n')
                    .filter((p) => p.trim().length > 0)
                    .map((paragraphText, pIdx) => (
                      <p key={pIdx} className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                        {paragraphText}
                      </p>
                    ))}

                  {/* Single High-Impact Autonomous Visual Explainer */}
                  <AutonomousParagraphExplainer
                    lessonTitle={activeLesson.title}
                    lessonContent={activeLesson.content}
                  />

                  {/* Embedded Interactive Code Sandbox */}
                  <CodeSandbox lessonTitle={activeLesson.title} />

                  {/* Real-Time Shared Cloud Note-Taking Component */}
                  <RealtimeLessonAnnotator
                    courseId={course.id}
                    lessonId={activeLesson.id}
                    lessonTitle={activeLesson.title}
                    sections={[
                      'General Lesson Overview',
                      `${activeLesson.title} - Core Concepts`,
                      'Key Takeaways & Application'
                    ]}
                  />

                  {/* Academic Integrity & Concept Alignment Checker */}
                  <div className="p-6 rounded-2xl bg-[#090f16] border border-cyan-500/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Award className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">Academic Integrity Checker</h4>
                          <p className="text-[10px] text-gray-400">Verify concept alignment with the course Knowledge Graph</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                        Concept Alignment Engine
                      </span>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        value={studentProjectText}
                        onChange={(e) => setStudentProjectText(e.target.value)}
                        placeholder="Paste your project summary, research notes, or written explanation here to analyze alignment with lesson concepts before final submission..."
                        className="w-full min-h-[100px] bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition-all font-sans"
                      />

                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">
                          Characters: {studentProjectText.length}
                        </span>
                        <button
                          onClick={async () => {
                            if (!studentProjectText.trim()) return;
                            setIsCheckingIntegrity(true);
                            try {
                              const report = await ApiService.checkAcademicIntegrity(
                                studentProjectText,
                                activeLesson.title,
                                activeLesson.content
                              );
                              setIntegrityReport(report);
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsCheckingIntegrity(false);
                            }
                          }}
                          disabled={isCheckingIntegrity || !studentProjectText.trim()}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-slate-950 font-extrabold text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          {isCheckingIntegrity ? 'Analyzing alignment...' : 'Scan Alignment & Verify'}
                        </button>
                      </div>

                      {/* Report display */}
                      {integrityReport && (
                        <div className="p-4 rounded-xl bg-[#03080e] border border-cyan-500/30 text-xs space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Verification Result</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400">Alignment Score:</span>
                              <span className={`font-mono font-bold ${integrityReport.alignmentScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {integrityReport.alignmentScore}%
                              </span>
                            </div>
                          </div>

                          <div className="prose prose-invert text-[11px] text-gray-300 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                              <div>
                                <span className="text-emerald-400 font-bold block mb-1">✔ Verified Concepts</span>
                                <ul className="list-disc list-inside space-y-1 text-gray-400">
                                  {integrityReport.verifiedConcepts.map((c, i) => (
                                    <li key={i}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <span className="text-amber-400 font-bold block mb-1">⚠ Gaps / Omissions</span>
                                <ul className="list-disc list-inside space-y-1 text-gray-400">
                                  {integrityReport.missingConcepts.map((c, i) => (
                                    <li key={i}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="border-t border-white/5 pt-2.5 mt-2.5 text-gray-200 leading-relaxed whitespace-pre-line">
                              {integrityReport.feedbackReport}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Remedial Study Guide Card */}
                  {remedialGuide && (
                    <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#16120b] via-[#0f0e0a] to-[#121609] border border-amber-500/40 text-xs space-y-4 shadow-xl animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                            <Brain className="w-4 h-4 animate-bounce" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Remedial Study Guide</h4>
                            <p className="text-[10px] text-amber-300/80">Tailored practice concepts created based on your recent quiz gaps</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                          Knowledge Gaps Addressed
                        </span>
                      </div>

                      <div className="p-3 bg-[#0c0a07] border border-amber-500/20 rounded-xl">
                        <p className="text-[11px] italic text-amber-200">
                          <strong>Tutor Analysis:</strong> {remedialGuide.gapsAnalysis}
                        </p>
                      </div>

                      <div className="prose prose-invert text-xs text-gray-300 space-y-3 bg-[#0a0907] p-4 rounded-xl border border-white/5 leading-relaxed">
                        <div className="space-y-2">
                          {remedialGuide.remedialMaterial.split('\n\n').map((chunk, idx) => (
                            <p key={idx} className="whitespace-pre-line">{chunk}</p>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Micro-Learning Modules & Remedial Practice Questions */}
                      {remedialGuide.microModules && remedialGuide.microModules.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-amber-500/20">
                          <h5 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
                            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            Suggested Personalized Micro-Learning Modules
                          </h5>

                          <div className="grid grid-cols-1 gap-3">
                            {remedialGuide.microModules.map((m, mIdx) => {
                              const answerState = activeMicroPracticeAnswer[mIdx];
                              return (
                                <div key={mIdx} className="p-3.5 rounded-xl bg-[#090806] border border-amber-500/30 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-amber-200 text-xs">{m.title}</span>
                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                                      ⏱ {m.duration} • {m.concept}
                                    </span>
                                  </div>

                                  {/* Remedial Practice Question */}
                                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                                      Remedial Practice Question:
                                    </span>
                                    <p className="font-semibold text-gray-200 text-[11px]">{m.practiceQuestion.question}</p>

                                    <div className="space-y-1.5 pt-1">
                                      {m.practiceQuestion.options.map((opt, oIdx) => {
                                        const isSelected = answerState?.selectedIndex === oIdx;
                                        const isCorrect = oIdx === m.practiceQuestion.answerIndex;
                                        return (
                                          <button
                                            key={oIdx}
                                            onClick={() => {
                                              setActiveMicroPracticeAnswer(prev => ({
                                                ...prev,
                                                [mIdx]: { selectedIndex: oIdx, isCorrect }
                                              }));
                                              if (isCorrect) {
                                                setConfettiOverlay({
                                                  isVisible: true,
                                                  message: 'Remedial Concept Mastered!',
                                                  xpAmount: 50
                                                });
                                              }
                                            }}
                                            className={`w-full text-left p-2 rounded-lg text-[11px] border transition-all cursor-pointer ${
                                              isSelected
                                                ? isCorrect
                                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                                                  : 'bg-rose-500/20 border-rose-500 text-rose-200'
                                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                                            }`}
                                          >
                                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {answerState && (
                                      <div className={`p-2 rounded-lg text-[10px] font-semibold border ${
                                        answerState.isCorrect ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                                      }`}>
                                        <span className="block font-bold">{answerState.isCorrect ? '✔ Correct Answer!' : '✖ Needs Review:'}</span>
                                        <p className="mt-0.5">{m.practiceQuestion.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            setRemedialGuide(null);
                            setWrongAnswers([]);
                            startQuizForLesson();
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/15 cursor-pointer"
                        >
                          Retake Practice Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Key Takeaways */}
            {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2 text-xs text-indigo-200">
                  {activeLesson.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flashcards Deck */}
            {activeLesson.flashcards && activeLesson.flashcards.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Spaced Repetition Flashcards ({activeFlashcardIndex + 1}/{activeLesson.flashcards.length})
                  </h4>
                </div>

                <div
                  onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                  className="p-8 rounded-2xl bg-gradient-to-tr from-[#1a1a28] to-[#222236] border border-white/10 hover:border-purple-500/50 cursor-pointer text-center min-h-[140px] flex flex-col items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    {isFlashcardFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Flip)'}
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {isFlashcardFlipped
                      ? activeLesson.flashcards[activeFlashcardIndex]?.back
                      : activeLesson.flashcards[activeFlashcardIndex]?.front}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      setIsFlashcardFlipped(false);
                      setActiveFlashcardIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={activeFlashcardIndex === 0}
                    className="px-3 py-1.5 rounded-lg bg-white/5 disabled:opacity-30 text-gray-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setIsFlashcardFlipped(false);
                      setActiveFlashcardIndex(prev => Math.min(activeLesson.flashcards.length - 1, prev + 1));
                    }}
                    disabled={activeFlashcardIndex === activeLesson.flashcards.length - 1}
                    className="px-3 py-1.5 rounded-lg bg-white/5 disabled:opacity-30 text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Action Bar: Take Interactive Quiz */}
            {activeLesson.quizzes && activeLesson.quizzes.length > 0 && (
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-400">
                  Ready to test your knowledge and adjust your adaptive level?
                </div>

                <button
                  onClick={startQuizForLesson}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] w-full sm:w-auto justify-center"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Start Interactive Quiz ({activeLesson.quizzes.length} Qs)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Quiz Modal */}
      {showQuizModal && activeLesson.quizzes[currentQuizIndex] && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161622] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Adaptive Quiz • Question {currentQuizIndex + 1} of {activeLesson.quizzes.length}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeLesson.quizzes[currentQuizIndex].question}
                </h3>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {activeLesson.quizzes[currentQuizIndex].options.map((option, oIdx) => {
                const isSelected = selectedOption === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswerSubmit(oIdx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-purple-400 font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* AI Grading & Feedback */}
            {isEvaluatingQuiz && (
              <div className="flex items-center justify-center py-4 text-purple-300 gap-2 text-xs">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Evaluating response via Gemini AI...</span>
              </div>
            )}

            {quizFeedback && (
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Tutor Grading Feedback:</span>
                </div>
                <p>{quizFeedback}</p>

                <div className="pt-2">
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    {currentQuizIndex + 1 < activeLesson.quizzes.length ? 'Next Question' : 'Complete Quiz'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sliding Peer Messaging Drawer Sidebar */}
      {isPeerSidebarOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#070b12] border-l border-purple-500/30 shadow-2xl p-5 flex flex-col justify-between transition-all duration-300 animate-fade-in backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400 animate-pulse" />
              <div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Peer Collab Channel</h3>
                <p className="text-[10px] text-purple-300">{onlineCount} active students online</p>
              </div>
            </div>
            <button
              onClick={() => setIsPeerSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            <PeerMatchCollaborator
              courseId={course.id}
              lessonId={activeLesson.id}
              lessonTitle={activeLesson.title}
            />
          </div>
        </div>
      )}

      {/* Retractable Study Workbench Drawer */}
      <StudyWorkbenchDrawer
        isOpen={isWorkbenchDrawerOpen}
        onClose={() => setIsWorkbenchDrawerOpen(false)}
        lessonContext={activeLesson?.content}
      />

      {/* Auto-Generating Glossary Drawer */}
      <AutoGlossaryCard
        lessonTitle={activeLesson?.title || 'Lesson'}
        lessonContent={activeLesson?.content || ''}
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Confetti Celebration & XP Burst Overlay */}
      <ConfettiXPBurstOverlay
        isVisible={confettiOverlay.isVisible}
        message={confettiOverlay.message}
        xpAmount={confettiOverlay.xpAmount}
        onComplete={() => setConfettiOverlay({ isVisible: false })}
      />
    </div>
  );
};
