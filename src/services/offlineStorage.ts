import { Course, StudentProgress, Certificate, UserProfile, StudyGuide, ForumThread, ForumReply, LeaderboardUser } from '../types';
import { DEFAULT_COURSES, INITIAL_CERTIFICATES } from '../data/defaultCourses';

const STORAGE_KEYS = {
  USER_PROFILE: 'zalamati_user_profile',
  COURSES: 'zalamati_courses',
  PROGRESS: 'zalamati_student_progress',
  CERTIFICATES: 'zalamati_certificates',
  OFFLINE_MODE: 'zalamati_offline_mode',
  OFFLINE_QUIZ_QUEUE: 'zalamati_offline_quiz_queue',
  STUDY_GUIDES: 'zalamati_study_guides',
  FORUM_THREADS: 'zalamati_forum_threads',
  CERTS_ENCRYPTION_KEY: 'zalamati_certs_encryption_key',
};

export const defaultUser: UserProfile = {
  id: 'usr-student-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@lmdpro.app',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  organization: 'LMDpro Academy',
  language: 'en',
  learningLevel: 'standard',
  xpPoints: 1450,
  level: 2,
  badges: [
    { id: 'b1', name: 'AI Scholar', icon: '🤖', description: 'Mastered 3 AI & Agentic Modules', category: 'ai', dateUnlocked: 'Today' },
    { id: 'b2', name: '7-Day Streak', icon: '🔥', description: 'Maintained 7 consecutive daily study sessions', category: 'streak', dateUnlocked: 'Yesterday' },
    { id: 'b3', name: 'Degree Defender', icon: '🎓', description: 'Passed capstone evaluation defense', category: 'mastery', dateUnlocked: '2 days ago' },
  ],
  milestones: [
    { id: 'm1', title: 'Earn 1,000 XP Points', targetXP: 1000, achieved: true, reward: 'Level 2 Unlocked' },
    { id: 'm2', title: 'Complete 5 Degree Modules', targetXP: 2500, achieved: false, reward: 'Golden Badge' },
    { id: 'm3', title: 'Publish Research Paper to Docs', targetXP: 5000, achieved: false, reward: 'Academic Citation' },
  ],
  streakDays: 7,
  offlineSyncEnabled: true,
  completedCourseIds: [],
  enrolledCourseIds: ['course-ai-agentic-systems', 'course-quantum-computing']
};

export class OfflineStorageService {
  static getProfile(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse user profile from local storage:', e);
    }
    return defaultUser;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }

  static getCourses(): Course[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load courses from storage:', e);
    }
    return DEFAULT_COURSES;
  }

  static saveCourses(courses: Course[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses:', e);
    }
  }

  static saveCourse(newCourse: Course): Course[] {
    const courses = this.getCourses();
    const existingIndex = courses.findIndex(c => c.id === newCourse.id);
    if (existingIndex >= 0) {
      courses[existingIndex] = newCourse;
    } else {
      courses.unshift(newCourse);
    }
    this.saveCourses(courses);
    return courses;
  }

  static getProgressMap(): Record<string, StudentProgress> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load progress map:', e);
    }
    return {};
  }

  static saveProgress(progress: StudentProgress): void {
    try {
      const map = this.getProgressMap();
      map[progress.courseId] = progress;
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  private static toBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  }

  private static fromBase64(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  private static getOrCreateCertEncryptionSecret(): string {
    let secret = localStorage.getItem(STORAGE_KEYS.CERTS_ENCRYPTION_KEY);
    if (!secret) {
      const random = crypto.getRandomValues(new Uint8Array(32));
      secret = this.toBase64(random);
      localStorage.setItem(STORAGE_KEYS.CERTS_ENCRYPTION_KEY, secret);
    }
    return secret;
  }

  private static async getCertCryptoKey(): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const secret = this.getOrCreateCertEncryptionSecret();
    const keyMaterial = await crypto.subtle.digest('SHA-256', enc.encode(secret));
    return crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  }

  private static async encryptText(plainText: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.getCertCryptoKey();
    const enc = new TextEncoder();
    const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plainText));
    const payload = {
      iv: this.toBase64(iv),
      data: this.toBase64(new Uint8Array(cipherBuffer)),
    };
    return JSON.stringify(payload);
  }

  private static async decryptText(payloadText: string): Promise<string> {
    const payload = JSON.parse(payloadText) as { iv: string; data: string };
    const iv = this.fromBase64(payload.iv);
    const data = this.fromBase64(payload.data);
    const key = await this.getCertCryptoKey();
    const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(plainBuffer);
  }

  static async getCertificates(): Promise<Certificate[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (saved) {
        try {
          const decrypted = await this.decryptText(saved);
          const parsed = JSON.parse(decrypted);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const encrypted = await this.encryptText(JSON.stringify(parsed));
            localStorage.setItem(STORAGE_KEYS.CERTIFICATES, encrypted);
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load certificates:', e);
    }
    return INITIAL_CERTIFICATES;
  }

  static async saveCertificate(cert: Certificate): Promise<Certificate[]> {
    const certs = await this.getCertificates();
    if (!certs.some(c => c.id === cert.id || c.verificationId === cert.verificationId)) {
      certs.unshift(cert);
      try {
        const encrypted = await this.encryptText(JSON.stringify(certs));
        localStorage.setItem(STORAGE_KEYS.CERTIFICATES, encrypted);
      } catch (e) {
        console.error('Failed to save certificate:', e);
      }
    }
    return certs;
  }

  static isOfflineForced(): boolean {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE) === 'true';
  }

  static setOfflineForced(forced: boolean): void {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, forced ? 'true' : 'false');
  }

  // --- STUDY GUIDES STORAGE ---
  static getStudyGuides(): StudyGuide[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDY_GUIDES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load study guides:', e);
    }
    return [
      {
        id: 'guide-sample-1',
        title: 'Mastery Guide: Autonomous AI Agent Architecture',
        subject: 'Autonomous AI Agents',
        overallSummary: 'Focusing on multi-agent dispatch loops, tool calling protocols, and error resilience under high concurrency.',
        adaptiveLevel: 'accelerated',
        conceptSummaries: [
          {
            conceptTitle: '1. Autonomous Dispatch & Tool Calling Loops',
            summary: 'Agents process inputs through iterative perception-action loops, evaluating tool output before yielding execution states.',
            keyTakeaways: [
              'Tool schemas must explicitly define required parameter constraints.',
              'Implement fallback handlers for non-responsive external RPC APIs.',
              'Limit recursive loop depth to prevent infinite reflection cycles.'
            ],
            codeOrFormulaExample: `async function agentLoop(state) {\n  let action = await planNextStep(state);\n  while(!action.isFinal) {\n    const toolResult = await executeTool(action.toolName, action.args);\n    state.history.push({ action, toolResult });\n    action = await planNextStep(state);\n  }\n  return action.finalOutput;\n}`
          }
        ],
        practiceQuestions: [
          {
            id: 'pq-s1',
            question: 'What is the primary advantage of adding structured response schemas to tool declarations?',
            options: [
              'It guarantees deterministic type parsing across LLM calls',
              'It speeds up network transit time by 500%',
              'It disables the need for error logging',
              'It automatically deploys code to production'
            ],
            correctAnswerIndex: 0,
            detailedExplanation: 'Structured response schemas constrain LLM outputs to expected JSON parameters, preventing syntax errors and missing fields.',
            hint: 'Focus on deterministic parsing and type safety.'
          }
        ],
        actionPlan: [
          { stepNumber: 1, action: 'Complete Agentic AI Practice Lab', rationale: 'Verify hands-on execution of tool calls.' },
          { stepNumber: 2, action: 'Review Error Handling Guidelines', rationale: 'Prevent unhandled agent timeouts.' }
        ],
        createdAt: 'Yesterday'
      }
    ];
  }

  static saveStudyGuide(guide: StudyGuide): StudyGuide[] {
    const guides = this.getStudyGuides();
    guides.unshift(guide);
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_GUIDES, JSON.stringify(guides));
    } catch (e) {
      console.error('Failed to save study guide:', e);
    }
    return guides;
  }

  // --- COMMUNITY FORUM STORAGE ---
  static getForumThreads(): ForumThread[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORUM_THREADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load forum threads:', e);
    }
    return [
      {
        id: 'thread-1',
        title: 'How do you handle rate-limiting when orchestrating multi-agent LLM swarms?',
        category: '🤖 AI Engineering & Swarms',
        authorId: 'usr-student-02',
        authorName: 'Elena Rostova',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        content: 'I am building a research swarm that queries Gemini 3.1 Flash for search grounding and code execution in parallel. When spawning 8+ agents simultaneously, I occasionally hit HTTP 429 rate limits. What exponential backoff or token bucket strategy works best in Express TypeScript applications?',
        tags: ['Agents', 'Rate Limiting', 'Gemini API', 'TypeScript'],
        upvotes: 24,
        replyCount: 3,
        isSolved: true,
        createdAt: '2 hours ago',
        replies: [
          {
            id: 'reply-1-1',
            threadId: 'thread-1',
            authorId: 'usr-teacher-01',
            authorName: 'Prof. Marcus Vance',
            authorRole: 'teacher',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            content: 'Great question, Elena! The recommended architecture is a token-bucket queue queueing rate limiter using p-limit or p-queue on the server-side. Additionally, wrap your `ai.models.generateContent` calls with an exponential jitter retry loop:\n\n```ts\nasync function callWithRetry(fn, maxRetries = 3) {\n  for(let i = 0; i < maxRetries; i++) {\n    try { return await fn(); }\n    catch(e) {\n      if (e.status === 429) {\n        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000 + Math.random() * 500));\n      } else throw e;\n    }\n  }\n}\n```\n\nThis prevents the "thundering herd" problem across parallel workers.',
            upvotes: 31,
            isTeacherAnswer: true,
            isAcceptedSolution: true,
            createdAt: '1 hour ago'
          },
          {
            id: 'reply-1-2',
            threadId: 'thread-1',
            authorId: 'usr-student-03',
            authorName: 'Devon Zhao',
            authorRole: 'student',
            authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            content: 'I also noticed switching heavy grounding tasks to `gemini-3.1-flash-lite` reduced latency by 40% while staying well within standard quota limits!',
            upvotes: 12,
            isTeacherAnswer: false,
            isAcceptedSolution: false,
            createdAt: '45 mins ago'
          }
        ]
      },
      {
        id: 'thread-2',
        title: 'Understanding Quantum Phase Estimation & Shor\'s Algorithm prerequisites',
        category: '⚛️ Quantum Computing & Physics',
        authorId: 'usr-student-04',
        authorName: 'Aisha Patel',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        content: 'Module 3 of the Quantum Computing Degree covers Quantum Fourier Transform (QFT) and Phase Estimation. Can someone clarify why Hadamard gates are applied to all control qubits before applying controlled-unitary operations?',
        tags: ['Quantum', 'QFT', 'Physics', 'Algorithms'],
        upvotes: 18,
        replyCount: 1,
        isSolved: false,
        createdAt: '5 hours ago',
        replies: [
          {
            id: 'reply-2-1',
            threadId: 'thread-2',
            authorId: 'usr-teacher-02',
            authorName: 'Dr. Sophia Al-Mansoor',
            authorRole: 'teacher',
            authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
            content: 'Applying Hadamard gates to the control qubits initialized in $|0\\rangle$ creates an equal superposition of all computational basis states $2^{-n/2} \\sum_x |x\\rangle$. This allows the controlled unitaries to kick phase shifts into every state simultaneously, preparing the register for inverse QFT!',
            upvotes: 19,
            isTeacherAnswer: true,
            isAcceptedSolution: false,
            createdAt: '3 hours ago'
          }
        ]
      },
      {
        id: 'thread-3',
        title: 'Best practices for storing Firebase Auth tokens in offline-first PWA applications',
        category: '💻 Full-Stack & Systems',
        authorId: 'usr-student-01',
        authorName: 'Alex Rivera',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        content: 'When offline mode is toggled in LMDpro Academy, what is the best strategy to keep user achievements and progress cached without risking state drift when reconnecting?',
        tags: ['Firebase', 'Offline Storage', 'Architecture'],
        upvotes: 15,
        replyCount: 0,
        isSolved: false,
        createdAt: '1 day ago',
        replies: []
      }
    ];
  }

  static saveForumThread(newThread: ForumThread): ForumThread[] {
    const threads = this.getForumThreads();
    threads.unshift(newThread);
    try {
      localStorage.setItem(STORAGE_KEYS.FORUM_THREADS, JSON.stringify(threads));
    } catch (e) {
      console.error('Failed to save forum thread:', e);
    }
    return threads;
  }

  static addForumReply(threadId: string, reply: ForumReply): ForumThread[] {
    const threads = this.getForumThreads();
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      if (!thread.replies) thread.replies = [];
      thread.replies.push(reply);
      thread.replyCount = thread.replies.length;
      if (reply.isAcceptedSolution) {
        thread.isSolved = true;
      }
      try {
        localStorage.setItem(STORAGE_KEYS.FORUM_THREADS, JSON.stringify(threads));
      } catch (e) {
        console.error('Failed to save reply:', e);
      }
    }
    return threads;
  }

  static toggleUpvoteThread(threadId: string): ForumThread[] {
    const threads = this.getForumThreads();
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      if (thread.userUpvoted) {
        thread.upvotes = Math.max(0, thread.upvotes - 1);
        thread.userUpvoted = false;
      } else {
        thread.upvotes += 1;
        thread.userUpvoted = true;
      }
      try {
        localStorage.setItem(STORAGE_KEYS.FORUM_THREADS, JSON.stringify(threads));
      } catch (e) {
        console.error('Failed to save upvote:', e);
      }
    }
    return threads;
  }

  static toggleUpvoteReply(threadId: string, replyId: string): ForumThread[] {
    const threads = this.getForumThreads();
    const thread = threads.find(t => t.id === threadId);
    if (thread && thread.replies) {
      const reply = thread.replies.find(r => r.id === replyId);
      if (reply) {
        if (reply.userUpvoted) {
          reply.upvotes = Math.max(0, reply.upvotes - 1);
          reply.userUpvoted = false;
        } else {
          reply.upvotes += 1;
          reply.userUpvoted = true;
        }
        try {
          localStorage.setItem(STORAGE_KEYS.FORUM_THREADS, JSON.stringify(threads));
        } catch (e) {
          console.error('Failed to save reply upvote:', e);
        }
      }
    }
    return threads;
  }

  // --- LEADERBOARD USERS ---
  static getLeaderboardUsers(currentUser: UserProfile): LeaderboardUser[] {
    const defaultLeaderboard: LeaderboardUser[] = [
      {
        id: 'usr-top-1',
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        role: 'student',
        level: 5,
        xpPoints: 4850,
        weeklyXP: 1250,
        streakDays: 14,
        badgeCount: 8,
        tier: 'Diamond'
      },
      {
        id: 'usr-top-2',
        name: 'Devon Zhao',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        role: 'student',
        level: 4,
        xpPoints: 3900,
        weeklyXP: 980,
        streakDays: 11,
        badgeCount: 6,
        tier: 'Diamond'
      },
      {
        id: 'usr-top-3',
        name: 'Aisha Patel',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        role: 'student',
        level: 4,
        xpPoints: 3420,
        weeklyXP: 820,
        streakDays: 9,
        badgeCount: 5,
        tier: 'Diamond'
      },
      {
        id: currentUser.id,
        name: currentUser.name || 'Alex Rivera (You)',
        avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        role: currentUser.role,
        level: currentUser.level || 2,
        xpPoints: currentUser.xpPoints || 1450,
        weeklyXP: Math.min(currentUser.xpPoints, 620),
        streakDays: currentUser.streakDays || 7,
        badgeCount: currentUser.badges ? currentUser.badges.length : 3,
        tier: currentUser.xpPoints >= 3000 ? 'Diamond' : currentUser.xpPoints >= 1500 ? 'Emerald' : 'Gold',
        isCurrentUser: true
      },
      {
        id: 'usr-top-5',
        name: 'Kenji Sato',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        role: 'student',
        level: 2,
        xpPoints: 1200,
        weeklyXP: 450,
        streakDays: 5,
        badgeCount: 3,
        tier: 'Gold'
      },
      {
        id: 'usr-top-6',
        name: 'Sarah Jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        role: 'student',
        level: 1,
        xpPoints: 850,
        weeklyXP: 310,
        streakDays: 3,
        badgeCount: 2,
        tier: 'Silver'
      }
    ];

    // Sort by XP points descending
    return defaultLeaderboard.sort((a, b) => b.xpPoints - a.xpPoints);
  }
}
