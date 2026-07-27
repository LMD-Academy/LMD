import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music,
  Globe,
  Brain,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  Play,
  RotateCcw,
  Code2,
  Bug,
  Award,
  Cpu,
  Plus,
  Trash2,
  Bot,
  Zap,
  Activity,
  FileCode
} from 'lucide-react';
import { OfflineAnalyticsTracker } from '../services/offlineAnalytics';

interface TestCase {
  id: string;
  description: string;
  inputArgs: any[];
  expectedOutput: any;
  isErrorExpected?: boolean;
}

interface CodeChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  functionName: string;
  starterCode: string;
  testCases: TestCase[];
  solutionExplanation: string;
}

const PREDEFINED_CHALLENGES: CodeChallenge[] = [
  {
    id: 'optics_focal_length',
    title: 'STEM Physics: Lensmaker Focal Length Formula',
    category: 'Physics & Optics',
    difficulty: 'Intermediate',
    description: 'Implement `calculateFocalLength(r1, r2, n, thickness)` using the Lensmaker equation. Calculate focal length in mm rounded to 2 decimal places.',
    functionName: 'calculateFocalLength',
    starterCode: `function calculateFocalLength(r1, r2, n, thickness = 0) {
  // Check valid refractive index
  if (n <= 1) throw new Error("Refractive index must be greater than 1");
  
  // Lensmaker formula: 1/f = (n-1) * (1/r1 - 1/r2 + ((n-1)*d)/(n*r1*r2))
  const term1 = 1 / r1;
  const term2 = 1 / r2;
  const term3 = thickness === 0 ? 0 : ((n - 1) * thickness) / (n * r1 * r2);
  
  const invF = (n - 1) * (term1 - term2 + term3);
  if (invF === 0) return Infinity;
  
  return Math.round((1 / invF) * 100) / 100;
}`,
    testCases: [
      {
        id: 'tc1',
        description: 'Symmetric Thin Biconvex Lens (d=0, r1=100, r2=-100, n=1.5)',
        inputArgs: [100, -100, 1.5, 0],
        expectedOutput: 100
      },
      {
        id: 'tc2',
        description: 'Thick Lens with thickness d=10mm (r1=150, r2=-150, n=1.52, d=10)',
        inputArgs: [150, -150, 1.52, 10],
        expectedOutput: 146.52
      },
      {
        id: 'tc3',
        description: 'Planoconvex Lens with flat surface (r1=200, r2=999999, n=1.5, d=0)',
        inputArgs: [200, 999999, 1.5, 0],
        expectedOutput: 400
      },
      {
        id: 'tc4',
        description: 'Invalid Refractive Index (n=0.95)',
        inputArgs: [100, -100, 0.95, 0],
        expectedOutput: 'Refractive index must be greater than 1',
        isErrorExpected: true
      }
    ],
    solutionExplanation: 'Uses the full optical thickness correction term to compute precise focal length in millimeter units.'
  },
  {
    id: 'quantum_hadamard',
    title: 'Quantum Computing: Hadamard Gate Transformation',
    category: 'Quantum Computing',
    difficulty: 'Advanced',
    description: 'Implement `applyHadamard(stateVector)` for a single qubit state vector `[alpha, beta]`. Returns transformed state vector rounded to 3 decimal places.',
    functionName: 'applyHadamard',
    starterCode: `function applyHadamard(stateVector) {
  if (!Array.isArray(stateVector) || stateVector.length !== 2) {
    throw new Error("State vector must be a 2-element array");
  }
  const factor = 1 / Math.sqrt(2);
  const q0 = factor * (stateVector[0] + stateVector[1]);
  const q1 = factor * (stateVector[0] - stateVector[1]);
  return [Math.round(q0 * 1000) / 1000, Math.round(q1 * 1000) / 1000];
}`,
    testCases: [
      {
        id: 'tc1',
        description: 'Superposition from state |0> = [1, 0]',
        inputArgs: [[1, 0]],
        expectedOutput: [0.707, 0.707]
      },
      {
        id: 'tc2',
        description: 'Superposition from state |1> = [0, 1]',
        inputArgs: [[0, 1]],
        expectedOutput: [0.707, -0.707]
      },
      {
        id: 'tc3',
        description: 'Reversibility test H(H(|0>)) = [1, 0]',
        inputArgs: [[0.707, 0.707]],
        expectedOutput: [1, 0]
      },
      {
        id: 'tc4',
        description: 'Invalid input vector format',
        inputArgs: [[1, 2, 3]],
        expectedOutput: 'State vector must be a 2-element array',
        isErrorExpected: true
      }
    ],
    solutionExplanation: 'Applies normalized 2x2 Hadamard matrix multiplication H = 1/sqrt(2) * [[1,1],[1,-1]].'
  },
  {
    id: 'raft_heartbeat',
    title: 'Distributed Systems: Raft Consensus Heartbeat Evaluator',
    category: 'Distributed Systems',
    difficulty: 'Intermediate',
    description: 'Implement `evaluateHeartbeat(lastHeartbeat, currentTime, timeoutMs)`. Returns "FOLLOWER" if heartbeat is fresh, "ELECTION_NEEDED" if timed out, or throws on invalid timestamp.',
    functionName: 'evaluateHeartbeat',
    starterCode: `function evaluateHeartbeat(lastHeartbeat, currentTime, timeoutMs) {
  if (currentTime < lastHeartbeat) throw new Error("Invalid timestamp");
  const elapsed = currentTime - lastHeartbeat;
  if (elapsed > timeoutMs) return "ELECTION_NEEDED";
  return "FOLLOWER";
}`,
    testCases: [
      {
        id: 'tc1',
        description: 'Fresh Heartbeat within election timeout',
        inputArgs: [1000, 1100, 150],
        expectedOutput: 'FOLLOWER'
      },
      {
        id: 'tc2',
        description: 'Heartbeat Timeout exceeded',
        inputArgs: [1000, 1200, 150],
        expectedOutput: 'ELECTION_NEEDED'
      },
      {
        id: 'tc3',
        description: 'Exact Timeout boundary',
        inputArgs: [1000, 1150, 150],
        expectedOutput: 'FOLLOWER'
      },
      {
        id: 'tc4',
        description: 'Corrupted clock skew (currentTime < lastHeartbeat)',
        inputArgs: [1000, 950, 150],
        expectedOutput: 'Invalid timestamp',
        isErrorExpected: true
      }
    ],
    solutionExplanation: 'Simulates Raft follower node heartbeat timers to determine when candidate election mode must be triggered.'
  },
  {
    id: 'memoized_fibonacci',
    title: 'Algorithms: Memoized High-Performance Fibonacci Engine',
    category: 'Data Structures',
    difficulty: 'Beginner',
    description: 'Implement `fastFibonacci(n, memo = {})` returning Nth Fibonacci number for n <= 50 efficiently.',
    functionName: 'fastFibonacci',
    starterCode: `function fastFibonacci(n, memo = {}) {
  if (n < 0) throw new Error("Input must be non-negative");
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fastFibonacci(n - 1, memo) + fastFibonacci(n - 2, memo);
  return memo[n];
}`,
    testCases: [
      {
        id: 'tc1',
        description: 'Base Case F(0)',
        inputArgs: [0],
        expectedOutput: 0
      },
      {
        id: 'tc2',
        description: 'Standard Case F(10)',
        inputArgs: [10],
        expectedOutput: 55
      },
      {
        id: 'tc3',
        description: 'Large Value F(50) performance check',
        inputArgs: [50],
        expectedOutput: 12586269025
      },
      {
        id: 'tc4',
        description: 'Negative Input Error Handling',
        inputArgs: [-5],
        expectedOutput: 'Input must be non-negative',
        isErrorExpected: true
      }
    ],
    solutionExplanation: 'Applies dynamic programming top-down memoization to reduce time complexity from O(2^n) to O(n).'
  }
];

export const AIFeaturesStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'testing_harness' | 'creative' | 'grounding' | 'chat'>('testing_harness');

  // Testing Harness State
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(PREDEFINED_CHALLENGES[0].id);
  const selectedChallenge = PREDEFINED_CHALLENGES.find(c => c.id === selectedChallengeId) || PREDEFINED_CHALLENGES[0];
  const [userCode, setUserCode] = useState<string>(selectedChallenge.starterCode);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [isExecutingTests, setIsExecutingTests] = useState<boolean>(false);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);
  const [aiDebugAdvice, setAiDebugAdvice] = useState<string | null>(null);
  const [isGeneratingAiCode, setIsGeneratingAiCode] = useState<boolean>(false);
  const [isGeneratingDebug, setIsGeneratingDebug] = useState<boolean>(false);

  // Creative Studio State
  const [imagePrompt, setImagePrompt] = useState('An futuristic AI research laboratory with liquid glass holographic monitors and glowing cyan energy nodes');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [resolution, setResolution] = useState<string>('1K');
  const [isProImage, setIsProImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Veo Video State
  const [videoPrompt, setVideoPrompt] = useState('Cinematic aerial flythrough of an autonomous neural network processing quantum data streams');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Lyria Music State
  const [musicPrompt, setMusicPrompt] = useState('Ambient lofi piano beat with soft vinyl crackle for deep focus study');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);

  // Grounding State
  const [searchQuery, setSearchQuery] = useState('Latest breakthroughs in autonomous agentic AI and multi-agent systems 2026');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Thinking Mode State
  const [thinkingPrompt, setThinkingPrompt] = useState('Analyze the time complexity of Raft distributed consensus under network partition scenarios.');
  const [thinkingResult, setThinkingResult] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Chat State
  const [chatModel, setChatModel] = useState<'lite' | 'pro'>('lite');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hello! I am your Gemini 3.1 AI Assistant. How can I help you master your coursework today?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Challenge Switcher Handler
  const handleSelectChallenge = (challengeId: string) => {
    const ch = PREDEFINED_CHALLENGES.find(c => c.id === challengeId);
    if (ch) {
      setSelectedChallengeId(ch.id);
      setUserCode(ch.starterCode);
      setTestResults([]);
      setExecutionLogs([]);
      setHasExecuted(false);
      setAiDebugAdvice(null);
    }
  };

  // Run Real-Time Unit Test Harness
  const handleRunTestHarness = () => {
    setIsExecutingTests(true);
    setAiDebugAdvice(null);
    setExecutionLogs([]);

    setTimeout(() => {
      const logs: string[] = [];
      const results: any[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push('[ERROR] ' + args.map(a => String(a)).join(' ')),
        warn: (...args: any[]) => logs.push('[WARN] ' + args.map(a => String(a)).join(' '))
      };

      try {
        const factory = new Function('console', `${userCode}; return typeof ${selectedChallenge.functionName} === 'function' ? ${selectedChallenge.functionName} : null;`);
        const targetFn = factory(customConsole);

        if (!targetFn) {
          logs.push(`❌ Error: Function '${selectedChallenge.functionName}' was not defined.`);
          setTestResults([]);
          setExecutionLogs(logs);
          setHasExecuted(true);
          setIsExecutingTests(false);
          return;
        }

        for (const tc of selectedChallenge.testCases) {
          const t0 = performance.now();
          let actual: any;
          let passed = false;
          let errorMsg: string | undefined;

          try {
            actual = targetFn(...tc.inputArgs);
            const duration = Math.round((performance.now() - t0) * 100) / 100;

            if (tc.isErrorExpected) {
              passed = false;
              errorMsg = `Expected error but returned ${JSON.stringify(actual)}`;
            } else if (Array.isArray(tc.expectedOutput)) {
              passed = JSON.stringify(actual) === JSON.stringify(tc.expectedOutput);
            } else if (typeof tc.expectedOutput === 'number') {
              passed = Math.abs(actual - tc.expectedOutput) < 0.05;
            } else {
              passed = actual === tc.expectedOutput;
            }

            results.push({
              id: tc.id,
              description: tc.description,
              inputArgs: tc.inputArgs,
              expected: tc.expectedOutput,
              actual,
              passed,
              executionTimeMs: duration,
              errorMsg: passed ? undefined : `Expected ${JSON.stringify(tc.expectedOutput)}, got ${JSON.stringify(actual)}`
            });
          } catch (err: any) {
            const duration = Math.round((performance.now() - t0) * 100) / 100;
            if (tc.isErrorExpected) {
              passed = true;
              actual = `Error: ${err.message}`;
            } else {
              passed = false;
              errorMsg = `Runtime Error: ${err.message}`;
              actual = `Error: ${err.message}`;
            }

            results.push({
              id: tc.id,
              description: tc.description,
              inputArgs: tc.inputArgs,
              expected: tc.isErrorExpected ? 'Error thrown' : tc.expectedOutput,
              actual,
              passed,
              executionTimeMs: duration,
              errorMsg
            });
          }
        }

        setTestResults(results);
        setExecutionLogs(logs);
        setHasExecuted(true);

        const allPassed = results.length > 0 && results.every(r => r.passed);
        if (allPassed) {
          OfflineAnalyticsTracker.trackEvent(selectedChallenge.id, 'unit_test_harness', 'interaction', 100);
        }
      } catch (parseErr: any) {
        logs.push(`❌ Syntax / Compilation Error: ${parseErr.message}`);
        setTestResults([]);
        setExecutionLogs(logs);
        setHasExecuted(true);
      } finally {
        setIsExecutingTests(false);
      }
    }, 300);
  };

  // Gemini AI Auto-Generate Solution Snippet
  const handleGenerateAiSolution = async () => {
    setIsGeneratingAiCode(true);
    setAiDebugAdvice(null);
    try {
      const prompt = `Write a clean, correct, and production-ready JavaScript implementation for function '${selectedChallenge.functionName}' that solves the following challenge:\nTitle: ${selectedChallenge.title}\nDescription: ${selectedChallenge.description}\n\nReturn ONLY the JavaScript code block without markdown tags or extraneous conversational filler so it can run inside a test harness.`;
      
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, thinkingMode: false })
      });
      const data = await res.json();
      if (data && data.reply) {
        let cleanCode = data.reply.replace(/```javascript/g, '').replace(/```js/g, '').replace(/```/g, '').trim();
        setUserCode(cleanCode);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAiCode(false);
    }
  };

  // Gemini AI Debug Assistant for Failed Test Cases
  const handleDiagnoseFailures = async () => {
    setIsGeneratingDebug(true);
    try {
      const failedCases = testResults.filter(r => !r.passed);
      const prompt = `Diagnose why the following JavaScript code failed its unit test harness:\n\nFUNCTION: ${selectedChallenge.functionName}\nUSER CODE:\n${userCode}\n\nFAILED TEST CASES:\n${JSON.stringify(failedCases, null, 2)}\n\nEXECUTION LOGS:\n${executionLogs.join('\n')}\n\nProvide a concise 2-bullet diagnosis explaining: 1) What logic error occurred, and 2) Exactly how to correct the code.`;

      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, thinkingMode: true })
      });
      const data = await res.json();
      if (data && data.reply) {
        setAiDebugAdvice(data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDebug(false);
    }
  };

  // Other AI Studio Handlers
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio, resolution, isPro: isProImage })
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoUrl(null);
    try {
      const res = await fetch('/api/gemini/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio })
      });
      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    setAudioUrl(null);
    try {
      const res = await fetch('/api/gemini/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt })
      });
      const data = await res.json();
      setAudioUrl(data.audioUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleSearchGrounding = async () => {
    setIsSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setSearchResult(data.result);
      setSearchSources(data.sources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHighThinking = async () => {
    setIsThinking(true);
    setThinkingResult(null);
    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: thinkingPrompt, thinkingMode: true })
      });
      const data = await res.json();
      setThinkingResult(data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, thinkingMode: chatModel === 'pro' })
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const totalPassCount = testResults.filter(r => r.passed).length;
  const is100PercentPass = testResults.length > 0 && totalPassCount === testResults.length;

  return (
    <div className="p-5 md:p-6 rounded-3xl bg-[#0a161f] border border-[#1b3b4a] text-white space-y-6 shadow-2xl animate-fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#163240] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Dynamic Execution Harness
            </span>
            <span className="text-[11px] text-[#7195a6]">Environment-based Code Evaluation & AI Studio</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Zalamati Next-Gen AI & Code Testing Studio</h2>
        </div>

        {/* Studio Mode Selector Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#051117] p-1.5 rounded-2xl border border-[#183848]">
          {[
            { id: 'testing_harness', label: 'Code Test Harness', icon: Terminal },
            { id: 'creative', label: 'Creative Media', icon: Sparkles },
            { id: 'grounding', label: 'Grounding & Thinking', icon: Globe },
            { id: 'chat', label: 'Gemini Chatbot', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-md'
                    : 'text-[#80a2b3] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. DYNAMIC ENVIRONMENT CODE TEST HARNESS TAB */}
      {activeTab === 'testing_harness' && (
        <div className="space-y-6">
          {/* Challenge Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PREDEFINED_CHALLENGES.map((ch) => {
              const isSelected = ch.id === selectedChallengeId;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#102a38] border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-[#071720] border-[#153444] text-[#7195a6] hover:text-white hover:bg-[#0c202b]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className="text-cyan-400">{ch.category}</span>
                    <span className={`px-1.5 py-0.2 rounded border ${
                      ch.difficulty === 'Beginner' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' :
                      ch.difficulty === 'Intermediate' ? 'text-amber-400 border-amber-500/30 bg-amber-950/40' :
                      'text-purple-400 border-purple-500/30 bg-purple-950/40'
                    }`}>
                      {ch.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs line-clamp-1 text-white">{ch.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Active Challenge Information Banner */}
          <div className="p-4 rounded-2xl bg-[#071924] border border-[#163647] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{selectedChallenge.title}</h3>
              </div>
              <p className="text-xs text-[#82a6b7] leading-relaxed">{selectedChallenge.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateAiSolution}
                disabled={isGeneratingAiCode}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                title="Use Gemini AI to generate starter or full code implementation"
              >
                {isGeneratingAiCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                <span>AI Auto-Solution</span>
              </button>

              <button
                onClick={() => setUserCode(selectedChallenge.starterCode)}
                className="px-3 py-2 rounded-xl bg-[#0e2430] hover:bg-[#163342] text-[#81a5b6] hover:text-white border border-[#1b3d4f] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reset code to starter template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Code Editor & Test Harness Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Code Editor Container */}
            <div className="p-4 rounded-2xl bg-[#051118] border border-[#163546] space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#14303f] pb-2 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>{selectedChallenge.functionName}.js</span>
                </div>
                <span className="text-[10px] text-[#5e8293] font-mono">JS Sandbox Runtime</span>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={12}
                className="w-full p-3.5 rounded-xl bg-[#020b10] border border-[#132c3a] text-xs text-emerald-300 font-mono leading-relaxed focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Write your solution function here..."
              />

              <button
                onClick={handleRunTestHarness}
                disabled={isExecutingTests}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
              >
                {isExecutingTests ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing Unit Tests...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-slate-950" />
                    <span>Execute Unit Test Harness</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Environment Test Results & Execution Metrics */}
            <div className="p-4 rounded-2xl bg-[#051118] border border-[#163546] space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#14303f] pb-2 text-xs">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Test Suite Runner</span>
                </div>
                {hasExecuted && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    is100PercentPass ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}>
                    {totalPassCount} / {testResults.length} Passed ({Math.round((totalPassCount / (testResults.length || 1)) * 100)}%)
                  </span>
                )}
              </div>

              {/* Test Cases Results List */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {!hasExecuted ? (
                  <div className="p-8 rounded-xl bg-[#020b10] border border-[#122a38] text-center space-y-2 text-[#618495]">
                    <Terminal className="w-8 h-8 text-cyan-500/50 mx-auto animate-pulse" />
                    <p className="text-xs">Click "Execute Unit Test Harness" to run student code against the sandbox test cases.</p>
                  </div>
                ) : (
                  testResults.map((tr) => (
                    <div
                      key={tr.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                        tr.passed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 font-semibold">
                          {tr.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span className="line-clamp-1">{tr.description}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#6c8f9f] shrink-0">{tr.executionTimeMs}ms</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#020a0f] p-2 rounded-lg border border-white/5">
                        <div>
                          <span className="text-gray-400">Expected: </span>
                          <span className="text-cyan-300">{JSON.stringify(tr.expected)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Actual: </span>
                          <span className={tr.passed ? 'text-emerald-300' : 'text-rose-300 font-bold'}>{JSON.stringify(tr.actual)}</span>
                        </div>
                      </div>

                      {tr.errorMsg && (
                        <p className="text-[10px] text-rose-400 font-mono">{tr.errorMsg}</p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Console Execution Output Stream */}
              {executionLogs.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#02080d] border border-[#112735] text-[10px] font-mono text-[#80a2b3] space-y-1">
                  <div className="text-cyan-400 font-bold uppercase text-[9px] tracking-wider border-b border-[#0f222e] pb-1">
                    Console Standard Output Log:
                  </div>
                  {executionLogs.map((log, idx) => (
                    <div key={idx} className="line-clamp-2">{log}</div>
                  ))}
                </div>
              )}

              {/* Failures AI Diagnosis Action */}
              {hasExecuted && !is100PercentPass && (
                <button
                  onClick={handleDiagnoseFailures}
                  disabled={isGeneratingDebug}
                  className="w-full py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isGeneratingDebug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bug className="w-3.5 h-3.5 text-purple-400" />}
                  <span>Diagnose Failures with Gemini AI</span>
                </button>
              )}

              {/* 100% Pass Award Banner */}
              {hasExecuted && is100PercentPass && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between gap-2 shadow-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                    <div>
                      <h5 className="font-extrabold text-white">All Unit Tests Passed!</h5>
                      <p className="text-[10px] text-emerald-300">+100 Learning Progress XP Earned</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Debug Diagnostic Output Panel */}
          {aiDebugAdvice && (
            <div className="p-4 rounded-2xl bg-[#081b26] border border-purple-500/40 text-xs text-purple-200 space-y-2 shadow-xl animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-purple-300 border-b border-purple-500/20 pb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Gemini AI Tutor Debug Diagnosis</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-[11px] font-mono text-purple-100">{aiDebugAdvice}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. CREATIVE MEDIA TAB */}
      {activeTab === 'creative' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Generator Card */}
            <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#183848] pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Gemini Image Generator</h3>
                </div>
                <button
                  onClick={() => setIsProImage(!isProImage)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                    isProImage ? 'bg-purple-950 text-purple-300 border-purple-500/40' : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {isProImage ? 'Pro Image Model' : 'Flash Image Model'}
                </button>
              </div>

              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
                placeholder="Describe image to generate..."
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#7297a8] uppercase">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-[#051117] border border-[#1a3848] text-cyan-300 font-bold focus:outline-none"
                  >
                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map((ratio) => (
                      <option key={ratio} value={ratio}>{ratio}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7297a8] uppercase">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-[#051117] border border-[#1a3848] text-cyan-300 font-bold focus:outline-none"
                  >
                    {['1K', '2K', '4K'].map((res) => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGeneratingImage ? 'Generating Image...' : 'Generate Image'}</span>
              </button>

              {generatedImage && (
                <div className="rounded-xl overflow-hidden border border-[#1a3848] bg-[#051117] p-2">
                  <img src={generatedImage} alt="Generated AI preview" className="w-full rounded-lg object-cover" />
                </div>
              )}
            </div>

            {/* Veo Video Generator Card */}
            <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#183848] pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Veo Video Generator</h3>
                </div>
              </div>

              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-purple-400"
                placeholder="Describe video clip to generate..."
              />

              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
              >
                {isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                <span>{isGeneratingVideo ? 'Rendering Veo Video...' : 'Generate Veo Video'}</span>
              </button>

              {videoUrl && (
                <div className="rounded-xl overflow-hidden border border-[#1a3848] bg-[#051117] p-2">
                  <video src={videoUrl} controls className="w-full rounded-lg" autoPlay loop muted />
                </div>
              )}
            </div>
          </div>

          {/* Lyria Music Generator */}
          <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
              <Music className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Lyria Music Generator</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-emerald-400"
                placeholder="Describe music style or mood..."
              />

              <button
                onClick={handleGenerateMusic}
                disabled={isGeneratingMusic}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 shrink-0"
              >
                {isGeneratingMusic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                <span>{isGeneratingMusic ? 'Synthesizing...' : 'Generate Music'}</span>
              </button>
            </div>

            {audioUrl && (
              <div className="p-3 rounded-xl bg-[#051117] border border-emerald-500/30 flex items-center gap-4">
                <Music className="w-5 h-5 text-emerald-400 shrink-0" />
                <audio src={audioUrl} controls className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. GROUNDING & THINKING TAB */}
      {activeTab === 'grounding' && (
        <div className="space-y-6">
          {/* Google Search Grounding */}
          <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Google Search Grounding</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <button
                onClick={handleSearchGrounding}
                disabled={isSearching}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-2 shrink-0"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                <span>Search Live Web</span>
              </button>
            </div>

            {searchResult && (
              <div className="p-4 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-[#a2c2d1] leading-relaxed space-y-3">
                <div>{searchResult}</div>
                {searchSources.length > 0 && (
                  <div className="pt-2 border-t border-[#122b38] flex flex-wrap gap-2 text-[10px]">
                    <span className="font-bold text-cyan-400">Sources:</span>
                    {searchSources.map((s, idx) => (
                      <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="text-cyan-300 underline hover:text-white">
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* High Thinking Mode */}
          <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">High Thinking Mode (`gemini-3.1-pro-preview`)</h3>
            </div>

            <textarea
              value={thinkingPrompt}
              onChange={(e) => setThinkingPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-purple-400"
            />

            <button
              onClick={handleHighThinking}
              disabled={isThinking}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              <span>{isThinking ? 'Thinking Deeply...' : 'Execute Deep Reasoning'}</span>
            </button>

            {thinkingResult && (
              <div className="p-4 rounded-xl bg-[#051117] border border-purple-500/30 text-xs text-purple-200 leading-relaxed font-mono whitespace-pre-wrap">
                {thinkingResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. GEMINI CHATBOT TAB */}
      {activeTab === 'chat' && (
        <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#183848] pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Gemini Multi-Turn AI Chatbot</h3>
            </div>

            <div className="flex items-center gap-1.5 bg-[#051117] p-1 rounded-xl border border-[#183848]">
              <button
                onClick={() => setChatModel('lite')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  chatModel === 'lite' ? 'bg-cyan-500 text-slate-950' : 'text-[#7297a8]'
                }`}
              >
                Flash-Lite
              </button>
              <button
                onClick={() => setChatModel('pro')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  chatModel === 'pro' ? 'bg-purple-500 text-white' : 'text-[#7297a8]'
                }`}
              >
                Pro Thinking
              </button>
            </div>
          </div>

          <div className="min-h-[260px] max-h-[360px] overflow-y-auto p-4 rounded-xl bg-[#051117] border border-[#1a3848] space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-[#10222e] text-[#b0d2e0] border border-[#1c3e50] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini is thinking...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask Gemini anything about your courses..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendChat}
              disabled={isChatLoading}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
