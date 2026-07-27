import React, { useState, useEffect } from 'react';
import {
  Bot,
  Brain,
  Cpu,
  Zap,
  Activity,
  Terminal,
  Layers,
  Database,
  Search,
  Code,
  Shield,
  CheckCircle2,
  X,
  Play,
  RotateCw,
  Sparkles,
  Network
} from 'lucide-react';

interface AgentInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProgramTitle?: string;
}

export const AgentInspectorModal: React.FC<AgentInspectorModalProps> = ({
  isOpen,
  onClose,
  selectedProgramTitle = 'Autonomous AI Agent Swarms & Antigravity Reasoning'
}) => {
  const [activeTab, setActiveTab] = useState<'a2a' | 'computer_use' | 'memory' | 'reasoning'>('a2a');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [executionStep, setExecutionStep] = useState(0);

  const initialLogs = [
    `[SYS_INIT] Antigravity Hybrid Agent Engine initialized. Target: "${selectedProgramTitle}"`,
    `[A2A_MESH] OrchestratorAgent connected to 4 Sub-Agents: [CurriculumCrawler, RAGEmbedder, AssessmentGen, CodeVerifier]`,
    `[REASONING] Prompt decomposition: Parsing 100 degree program modules across Coursera, MITx, edX, and Google Skills.`,
    `[FUNCTION_CALL] google_search_grounding({ query: "${selectedProgramTitle} syllabus MITx Coursera" })`,
    `[EMBEDDING] Vectorizing 2,400 textbook sections with Gemini Embedding 2 (dimension: 1536).`,
    `[MEMORY_BANK] Vertex AI Memory Bank synchronized with zero contradictions.`,
    `[COMPUTER_USE] DOM Viewport attached: headless Chromium container crawling course catalog...`
  ];

  useEffect(() => {
    if (isOpen) {
      setLogs(initialLogs);
      setExecutionStep(initialLogs.length);
    }
  }, [isOpen, selectedProgramTitle]);

  const handleTriggerSimulation = () => {
    setIsExecuting(true);
    const newLog = `[AGENT_EXEC] (${new Date().toLocaleTimeString()}) Triggering live Agent-to-Agent consensus cycle for "${selectedProgramTitle}"...`;
    setLogs(prev => [...prev, newLog]);

    setTimeout(() => {
      setLogs(prev => [...prev, `[TOOL_CALL] rtrvr_rover_sdk.scrape_authenticated_session({ url: "https://mitx.mit.edu/courses" })`]);
    }, 800);

    setTimeout(() => {
      setLogs(prev => [...prev, `[PII_REDACTION] Nano Banana Pro local edge model cleared 12 email tags.`]);
    }, 1600);

    setTimeout(() => {
      setLogs(prev => [...prev, `[A2A_RESULT] Consensus reached (Confidence: 99.8%). Curriculum graph verified.`]);
      setIsExecuting(false);
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0d0d16] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with dual gradient */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Antigravity Agent Command Center</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Live Agent Mesh
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Agent2Agent Collaboration, Computer Use, Long-Context Memory & Thinking Reasoning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-black/40">
          <button
            onClick={() => setActiveTab('a2a')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all ${
              activeTab === 'a2a'
                ? 'bg-blue-600/30 text-blue-300 border-t-2 border-blue-500 border-x border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Agent2Agent (A2A) Mesh</span>
          </button>

          <button
            onClick={() => setActiveTab('computer_use')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all ${
              activeTab === 'computer_use'
                ? 'bg-purple-600/30 text-purple-300 border-t-2 border-purple-500 border-x border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Computer Use & Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all ${
              activeTab === 'memory'
                ? 'bg-emerald-600/30 text-emerald-300 border-t-2 border-emerald-500 border-x border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2M+ Long Context & RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('reasoning')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all ${
              activeTab === 'reasoning'
                ? 'bg-amber-600/30 text-amber-300 border-t-2 border-amber-500 border-x border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Thinking & Reasoning Graph</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: A2A Mesh */}
          {activeTab === 'a2a' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <Bot className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-white">Master Orchestrator</div>
                  <div className="text-[10px] text-blue-300 mt-1">Gemini 3.1 Flash-Lite</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Task Planning & Routing</div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <Search className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-white">Curriculum Crawler</div>
                  <div className="text-[10px] text-purple-300 mt-1">Steel.dev Playwright</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Headless Scrape & Parsing</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <Database className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-white">RAG Embedder</div>
                  <div className="text-[10px] text-emerald-300 mt-1">Gemini Embedding 2</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Vector Search Indexing</div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <Shield className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <div className="text-xs font-bold text-white">Edge Edge Redactor</div>
                  <div className="text-[10px] text-amber-300 mt-1">Nano Banana Pro</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Zero-Latency Local PII</div>
                </div>
              </div>

              {/* Execution Status Card */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Target Program: <span className="text-blue-300">{selectedProgramTitle}</span>
                  </div>
                  <button
                    onClick={handleTriggerSimulation}
                    disabled={isExecuting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isExecuting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isExecuting ? 'Executing Consensus...' : 'Run Agent2Agent Consensus'}</span>
                  </button>
                </div>

                {/* Console Log Stream */}
                <div className="bg-black/80 rounded-xl p-3 border border-white/10 font-mono text-[11px] text-emerald-400 space-y-1 max-h-48 overflow-y-auto">
                  {logs.map((log, idx) => (
                    <div key={idx} className="line-clamp-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Computer Use */}
          {activeTab === 'computer_use' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Spatial Computer Use Viewport (Steel.dev & Playwright)
                  </h3>
                  <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    Active Headless Session
                  </span>
                </div>

                <div className="aspect-video w-full rounded-xl bg-black border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                  {/* Mock Screenshot Viewport */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 border-b border-white/10 flex items-center px-3 gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="text-[9px] text-gray-400 font-mono truncate ml-2">https://mitx.mit.edu/courses/degree-curriculum</div>
                  </div>

                  <div className="mt-6 p-6 text-center space-y-2">
                    <Code className="w-8 h-8 text-purple-400 mx-auto" />
                    <div className="text-xs font-bold text-gray-200">Autonomous Viewport Inspector</div>
                    <p className="text-[11px] text-gray-400 max-w-md">
                      Capturing element coordinates, parsing HTML tables, extracting quiz answer keys, and structuring full syllabus modules automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Memory */}
          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Vertex AI Memory Bank
                  </div>
                  <p className="text-xs text-gray-300">
                    Maintains persistent user profiles, course progress, and multi-session skill growth with real-time contradiction resolution.
                  </p>
                  <div className="text-[10px] text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    Status: Synchronized across 100 Degree Programs
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Gemini 2M+ Context Window
                  </div>
                  <p className="text-xs text-gray-300">
                    Houses full textbooks, research papers, video transcripts, and complete degree syllabus documents simultaneously in prompt context.
                  </p>
                  <div className="text-[10px] text-blue-300 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    Capacity: 2,000,000 Tokens (In Use: 412,500 Tokens)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reasoning */}
          {activeTab === 'reasoning' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-400" />
                    Prompt Decomposition & Thought Signatures
                  </h3>
                  <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Thinking Budget: 4,096 Tokens
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-gray-300 font-mono text-[11px] space-y-1">
                    <div className="text-amber-400 font-semibold">{"<thought_signature>"}</div>
                    <div className="pl-3 text-gray-400">
                      1. Analyze user request for degree program synthesis.<br />
                      2. Deconstruct curriculum requirements into 3 core modules.<br />
                      3. Query vector store for prerequisites and accrediting standards.<br />
                      4. Generate multi-option quizzes and interactive flashcards.<br />
                      5. Validate JSON schema against TypeScript interfaces.
                    </div>
                    <div className="text-amber-400 font-semibold">{"</thought_signature>"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
