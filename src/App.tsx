import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, Course, StudentProgress, Certificate, LanguageCode } from './types';
import { OfflineStorageService } from './services/offlineStorage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { CatalogGrid2x4 } from './components/CatalogGrid2x4';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SchoolDashboard } from './components/SchoolDashboard';
import { TeamDashboard } from './components/TeamDashboard';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { CourseViewer } from './components/CourseViewer';
import { DegreeProgramsCatalog } from './components/DegreeProgramsCatalog';
import { AITutorModal } from './components/AITutorModal';
import { AICourseArchitectModal } from './components/AICourseArchitectModal';
import { CertificateModal } from './components/CertificateModal';
import { GoogleClassroomModal } from './components/GoogleClassroomModal';
import { AgentInspectorModal } from './components/AgentInspectorModal';
import { DeepCrawlRagModal } from './components/DeepCrawlRagModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { LegalModal } from './components/LegalModal';
import { LiveVoiceAgent } from './components/LiveVoiceAgent';
import { DocumentationView } from './components/DocumentationView';
import { DeveloperApiEngineView } from './components/DeveloperApiEngineView';
import { OpenSourceView } from './components/OpenSourceView';
import { DonateSupportView } from './components/DonateSupportView';
import { AboutProjectView } from './components/AboutProjectView';
import { PromptDiagnosticsView } from './components/PromptDiagnosticsView';
import { AchievementsPanel } from './components/AchievementsPanel';
import { BrilliantExplainer } from './components/BrilliantExplainer';
import { InteractiveStudyTools } from './components/InteractiveStudyTools';
import { AIFeaturesStudio } from './components/AIFeaturesStudio';
import { FeaturedSolutionsView } from './components/FeaturedSolutionsView';
import { WeeklySchedulePlanner } from './components/WeeklySchedulePlanner';
import { AIStudyGuideGenerator } from './components/AIStudyGuideGenerator';
import { CommunityForumView } from './components/CommunityForumView';
import { GamificationLeaderboardView } from './components/GamificationLeaderboardView';
import { testFirestoreConnection } from './services/firebase';
import { VisualKnowledgeGraph } from './components/VisualKnowledgeGraph';
import { StemCadSimulation } from './components/StemCadSimulation';

export default function App() {
  // Storage State
  const [user, setUser] = useState<UserProfile>(() => {
    const p = OfflineStorageService.getProfile();
    return {
      ...p,
      theme: p.theme || 'dark',
      level: p.level || 1,
      badges: p.badges || [
        { id: 'b1', name: 'AI Scholar', icon: '🤖', description: 'Mastered 3 AI & Agentic Modules', category: 'ai', dateUnlocked: 'Today' },
        { id: 'b2', name: '7-Day Streak', icon: '🔥', description: 'Maintained 7 consecutive daily study sessions', category: 'streak', dateUnlocked: 'Yesterday' },
        { id: 'b3', name: 'Degree Defender', icon: '🎓', description: 'Passed capstone evaluation defense', category: 'mastery', dateUnlocked: '2 days ago' },
      ],
      milestones: p.milestones || [
        { id: 'm1', title: 'Earn 1,000 XP Points', targetXP: 1000, achieved: p.xpPoints >= 1000, reward: 'Level 2 Unlocked' },
        { id: 'm2', title: 'Complete 5 Degree Modules', targetXP: 2500, achieved: p.xpPoints >= 2500, reward: 'Golden Badge' },
        { id: 'm3', title: 'Publish Research Paper to Docs', targetXP: 5000, achieved: false, reward: 'Academic Citation' },
      ]
    };
  });

  const [courses, setCourses] = useState<Course[]>(() => OfflineStorageService.getCourses());
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>(() => OfflineStorageService.getProgressMap());
  const [certificates, setCertificates] = useState<Certificate[]>(() => OfflineStorageService.getCertificates());
  const [isOffline, setIsOffline] = useState<boolean>(() => OfflineStorageService.isOfflineForced());

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<string>('degrees');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Modals State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [tutorContextLesson, setTutorContextLesson] = useState<{ title: string; content: string } | null>(null);
  const [showCourseArchitect, setShowCourseArchitect] = useState(false);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showAgentInspector, setShowAgentInspector] = useState(false);
  const [showRagIndexer, setShowRagIndexer] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Sync theme with DOM
  useEffect(() => {
    const currentTheme = user.theme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [user.theme]);

  const handleUpdateUser = (updatedPartial: Partial<UserProfile>) => {
    const updated = { ...user, ...updatedPartial };
    setUser(updated);
    OfflineStorageService.saveProfile(updated);
  };

  // Handle Role Switch
  const handleRoleChange = (newRole: UserRole) => {
    handleUpdateUser({ role: newRole });
    setSelectedCourse(null);
    setActiveTab('dashboard');
  };

  // Handle Language Switch
  const handleLanguageChange = (lang: LanguageCode) => {
    handleUpdateUser({ language: lang });
  };

  // Handle Toggle Offline Mode
  const handleToggleOffline = () => {
    const nextVal = !isOffline;
    setIsOffline(nextVal);
    OfflineStorageService.setOfflineForced(nextVal);
  };

  // Handle Course Creation
  const handleCourseCreated = (newCourse: Course) => {
    const updatedCourses = OfflineStorageService.saveCourse(newCourse);
    setCourses(updatedCourses);

    // Auto-enroll user in newly created course
    if (!user.enrolledCourseIds.includes(newCourse.id)) {
      handleUpdateUser({ enrolledCourseIds: [...user.enrolledCourseIds, newCourse.id] });
    }
  };

  // Handle Course Lesson Progress Update
  const handleUpdateProgress = (courseId: string, updatedProgress: StudentProgress) => {
    OfflineStorageService.saveProgress(updatedProgress);
    const newProgressMap = OfflineStorageService.getProgressMap();
    setProgressMap(newProgressMap);

    // Calculate XP reward
    const currentXP = user.xpPoints;
    const newXP = currentXP + 100;
    const newLevel = Math.floor(newXP / 1000) + 1;
    handleUpdateUser({ xpPoints: newXP, level: newLevel });
  };

  // Handle Course Completion & Certificate Generation
  const handleCourseCompleted = async (course: Course) => {
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      verificationId: `ZAL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      studentName: user.name,
      courseTitle: course.title,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      score: 98,
      instructorName: course.author || 'Prof. Autonomous Agent',
      institutionName: 'Zalamati LMDpro Academy',
      skillsAcquired: course.tags || ['AI Engineering', 'Autonomous Agents']
    };

    const updatedCerts = await OfflineStorageService.saveCertificate(newCert);
    setCertificates(updatedCerts);
    setSelectedCertificate(newCert);
  };

  // Open Tutor with Lesson context
  const handleOpenAITutorWithContext = (lessonTitle: string, lessonContent: string) => {
    setTutorContextLesson({ title: lessonTitle, content: lessonContent });
    setShowAITutor(true);
  };

  return (
    <div className={`min-h-screen ${user.theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#071319] text-gray-100'} flex flex-col font-sans selection:bg-cyan-500 selection:text-black`}>
      {/* Retractable Navigation Sidebar */}
      {!isFocusMode && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedCourse(null);
          }}
          userRole={user.role}
          onOpenAuthModal={() => setShowAuthModal(true)}
          xpPoints={user.xpPoints}
          level={user.level || 1}
          onOpenAITutor={() => setShowAITutor(true)}
          onOpenLegalModal={() => setShowLegalModal(true)}
        />
      )}

      {/* Main Layout Area shifting with Sidebar */}
      <div className={`flex-1 transition-all duration-300 ${isFocusMode ? 'pl-0' : isSidebarOpen ? 'lg:pl-64 pl-16' : 'pl-16'}`}>
        {/* Global Navigation Header */}
        {!isFocusMode && (
          <Header
            user={user}
            courses={courses}
            onSelectCourse={setSelectedCourse}
            onRoleChange={handleRoleChange}
            onLanguageChange={handleLanguageChange}
            isOffline={isOffline}
            onToggleOffline={handleToggleOffline}
            onOpenCourseGenerator={() => setShowCourseArchitect(true)}
            onOpenAITutor={() => {
              setTutorContextLesson(null);
              setShowAITutor(true);
            }}
            onOpenClassroomModal={() => setShowClassroomModal(true)}
            onOpenAgentInspector={() => setShowAgentInspector(true)}
            onOpenRagIndexer={() => setShowRagIndexer(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenSearch={() => setShowSearchModal(true)}
            onOpenLegalModal={() => setShowLegalModal(true)}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSelectedCourse(null);
            }}
          />
        )}

        {/* Main Content Area */}
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 ${isFocusMode ? 'pt-2' : 'pt-6'}`}>
          {/* Course Player View */}
          {selectedCourse ? (
            <CourseViewer
              course={selectedCourse}
              studentProgress={progressMap[selectedCourse.id]}
              onUpdateProgress={handleUpdateProgress}
              onBack={() => {
                setSelectedCourse(null);
                setIsFocusMode(false);
              }}
              onOpenAITutorWithContext={handleOpenAITutorWithContext}
              onCourseCompleted={handleCourseCompleted}
              isFocusMode={isFocusMode}
              onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
            />
          ) : activeTab === 'knowledge_graph' ? (
            <VisualKnowledgeGraph
              courses={courses}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
              }}
            />
          ) : activeTab === 'stem_cad' ? (
            <StemCadSimulation />
          ) : activeTab === 'degrees' ? (
            <DegreeProgramsCatalog onSelectCourse={setSelectedCourse} />
          ) : activeTab === 'ai_labs' || activeTab === 'ai_studio' ? (
            <AIFeaturesStudio />
          ) : activeTab === 'workbench' || activeTab === 'agentic_ai' ? (
            <InteractiveStudyTools />
          ) : activeTab === 'live_voice' ? (
            <LiveVoiceAgent />
          ) : activeTab === 'knowledge_base' ? (
            <div className="space-y-10">
              <DocumentationView />
              <div className="border-t border-[#1a3848] pt-8">
                <DeveloperApiEngineView />
              </div>
            </div>
          ) : activeTab === 'achievements' ? (
            <AchievementsPanel user={user} onUpdateUser={handleUpdateUser} />
          ) : activeTab === 'docs' ? (
            <DocumentationView />
          ) : activeTab === 'api_engine' ? (
            <DeveloperApiEngineView />
          ) : activeTab === 'open_source' ? (
            <OpenSourceView />
          ) : activeTab === 'donate' ? (
            <DonateSupportView />
          ) : activeTab === 'about' ? (
            <AboutProjectView />
          ) : activeTab === 'prompt_diagnostics' ? (
            <PromptDiagnosticsView />
          ) : activeTab === 'planner' ? (
            <WeeklySchedulePlanner />
          ) : activeTab === 'study_guide' ? (
            <AIStudyGuideGenerator
              user={user}
              courses={courses}
              onUpdateUser={handleUpdateUser}
            />
          ) : activeTab === 'forum' ? (
            <CommunityForumView
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          ) : activeTab === 'leaderboard' ? (
            <GamificationLeaderboardView
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          ) : activeTab === 'featured' ? (
            <FeaturedSolutionsView
              onSelectCourse={setSelectedCourse}
              onOpenAITutor={() => setShowAITutor(true)}
            />
          ) : activeTab === 'catalog' || activeTab === 'trainings' ? (
            <div className="space-y-12">
              <CatalogGrid2x4
                onSelectCourse={setSelectedCourse}
                onOpenAITutor={() => setShowAITutor(true)}
                onExportWorkspace={() => {}}
              />
              <div className="border-t border-[#1a3848] pt-10">
                <FeaturedSolutionsView
                  onSelectCourse={setSelectedCourse}
                  onOpenAITutor={() => setShowAITutor(true)}
                />
              </div>
            </div>
          ) : activeTab === 'research' ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#10222b] border border-[#1c3a47] space-y-3">
                <h2 className="text-xl font-bold text-white">Academic Research & Deep Crawl RAG Agent</h2>
                <p className="text-xs text-[#82a4b3]">
                  Autonomous research engine that crawls university repositories, indexes papers, and generates citations.
                </p>
                <button
                  onClick={() => setShowRagIndexer(true)}
                  className="px-4 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold"
                >
                  Launch Deep Crawl RAG Indexer
                </button>
              </div>
            </div>
          ) : activeTab === 'workspace' ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#10222b] border border-[#1c3a47] space-y-3">
                <h2 className="text-xl font-bold text-white">Google Workspace & Drive Integration</h2>
                <p className="text-xs text-[#82a4b3]">
                  Connect Google Workspace to auto-sync study guides, research papers, and certificates directly into Google Docs and Sheets.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold"
                >
                  Configure Workspace & Gemini Keys
                </button>
              </div>
            </div>
          ) : (
            /* Role Specific Dashboards */
            <div className="space-y-8">
              {/* Gamification Bar on Dashboard */}
              <AchievementsPanel user={user} onUpdateUser={handleUpdateUser} />

              {user.role === 'student' && (
                <StudentDashboard
                  user={user}
                  courses={courses}
                  progressMap={progressMap}
                  certificates={certificates}
                  onSelectCourse={setSelectedCourse}
                  onOpenCertificate={setSelectedCertificate}
                  onOpenAITutor={() => setShowAITutor(true)}
                  onOpenCourseGenerator={() => setShowCourseArchitect(true)}
                  onOpenClassroomModal={() => setShowClassroomModal(true)}
                  onOpenAuthModal={() => setShowAuthModal(true)}
                  onUpdateUser={handleUpdateUser}
                />
              )}

              {user.role === 'teacher' && (
                <TeacherDashboard
                  user={user}
                  courses={courses}
                  onOpenCourseGenerator={() => setShowCourseArchitect(true)}
                  onSelectCourse={setSelectedCourse}
                  onOpenClassroomModal={() => setShowClassroomModal(true)}
                />
              )}

              {user.role === 'school' && (
                <SchoolDashboard
                  user={user}
                  onOpenAITutor={() => setShowAITutor(true)}
                  onOpenSubscriptions={() => {}}
                />
              )}

              {user.role === 'team' && (
                <TeamDashboard
                  user={user}
                  onOpenAITutor={() => setShowAITutor(true)}
                  onOpenSubscriptions={() => {}}
                />
              )}

              {user.role === 'enterprise' && (
                <EnterpriseDashboard
                  user={user}
                  onOpenAITutor={() => setShowAITutor(true)}
                  onOpenSubscriptions={() => {}}
                  onOpenAgentInspector={() => setShowAgentInspector(true)}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      <AITutorModal
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
        initialContextLessonTitle={tutorContextLesson?.title}
        initialContextContent={tutorContextLesson?.content}
      />

      <AICourseArchitectModal
        isOpen={showCourseArchitect}
        onClose={() => setShowCourseArchitect(false)}
        onCourseCreated={handleCourseCreated}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <GoogleClassroomModal
        isOpen={showClassroomModal}
        onClose={() => setShowClassroomModal(false)}
        onImportCourse={handleCourseCreated}
        currentUser={user}
      />

      <AgentInspectorModal
        isOpen={showAgentInspector}
        onClose={() => setShowAgentInspector(false)}
        selectedProgramTitle={selectedCourse ? selectedCourse.title : 'Autonomous AI Agent Swarms & Antigravity Reasoning'}
      />

      <DeepCrawlRagModal
        isOpen={showRagIndexer}
        onClose={() => setShowRagIndexer(false)}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        certificates={certificates}
        onUpdateUser={handleUpdateUser}
        onViewCertificate={(cert) => {
          setShowProfileModal(false);
          setSelectedCertificate(cert);
        }}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
        isOffline={isOffline}
        onUpdateUser={handleUpdateUser}
        onLanguageChange={handleLanguageChange}
        onToggleOffline={handleToggleOffline}
        onOpenWorkspaceAuth={() => setShowAuthModal(true)}
        onOpenClassroomModal={() => setShowClassroomModal(true)}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        courses={courses}
        onSelectProgram={setSelectedCourse}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedCourse(null);
        }}
      />

      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
      />
    </div>
  );
}
