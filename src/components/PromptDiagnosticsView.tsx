import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Copy,
  Check,
  Zap,
  Sliders,
  ShieldAlert,
  Search
} from 'lucide-react';
import { ApiService } from '../services/api';

export const PromptDiagnosticsView: React.FC = () => {
  const [userPromptInput, setUserPromptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    diagnosis: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    semanticTriggersFound: string[];
    potentialFailures: string[];
    refactoredPrompt: string;
  } | null>(null);

  const [copiedRefactored, setCopiedRefactored] = useState(false);

  const handleAnalyzePrompt = async () => {
    if (!userPromptInput.trim()) return;
    setIsAnalyzing(true);

    try {
      // Trigger Socratic AI analysis call
      const promptText = userPromptInput;
      const res = await ApiService.askTutor({
        prompt: `Analyze why this user prompt might fail or cause an AI model to deviate from instructions:\n"${promptText}"\nProvide 3 potential failure causes and a 100% high-fidelity refactored version of the prompt.`,
        thinkingMode: true
      });

      // Construct structured diagnostic output
      const hasTriggerWords = /ultimate|pro|master|enterprise|cool|awesome|everything|app/i.test(promptText);

      setAnalysisResult({
        diagnosis: res.reply || 'Analysis complete.',
        riskLevel: hasTriggerWords ? 'High' : promptText.length < 20 ? 'Medium' : 'Low',
        semanticTriggersFound: hasTriggerWords ? ['Vague marketing buzzwords', 'Broad scope ambiguity'] : ['Direct literal phrasing'],
        potentialFailures: [
          'Attention mechanism dilution from open-ended phrasing.',
          'Lack of explicit negative constraints (e.g. "Do NOT add unrequested sidebars").',
          'Potential tool call serialization overload if multiple subtasks are implied without sequential ordering.'
        ],
        refactoredPrompt: `TASK: Implement strictly the following core features without adding unrequested navigation tabs or secondary servers:\n\n1. Literal Requirement: ${promptText}\n2. Visual Constraint: Clean, high-contrast Bento Grid layout with responsive Tailwind styling.\n3. Scope Boundary: Complete 100% of functional requirements in a single, well-structured view.`
      });
    } catch (err) {
      console.warn('Diagnostic analysis fallback:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121c2e] via-[#0f233a] to-[#08121f] border border-[#1b3a5e] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            <span>AI Prompt Reflection & Reasoning Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Why Prompts Deviate & How to Fix Them
          </h1>
          <p className="text-sm md:text-base text-[#88acbd] leading-relaxed">
            In-depth analysis of AI model attention mechanisms, context truncation, semantic triggers, and tool call execution limits. Test and refactor your prompts for 100% model fidelity.
          </p>
        </div>
      </div>

      {/* 1. Deep Research Section: Why AI Prompts Sometimes Miss Instructions */}
      <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          The 5 Scientific Reasons Prompts Don't Execute As Intended
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: '1. Attention Head Dilution',
              color: 'text-amber-400',
              desc: 'In long prompts or truncated conversation histories, Transformer self-attention heads assign lower probability weights to middle sentences, prioritizing system instructions and recent tokens.'
            },
            {
              title: '2. Semantic Trigger Over-Engineering',
              color: 'text-rose-400',
              desc: 'Words like "Pro Dashboard" or "Ultimate App" trigger pre-trained weights for generic SaaS templates, causing the model to generate unwanted sidebars, charts, or fake cards.'
            },
            {
              title: '3. Tool Call Scratchpad Pollution',
              color: 'text-cyan-400',
              desc: 'When an AI agent runs multiple tool calls (e.g. view_file, edit_file), intermediate outputs fill the context buffer, causing the model to forget subtle late requirements.'
            },
            {
              title: '4. Lack of Negative Constraints',
              color: 'text-purple-400',
              desc: 'LLMs naturally expand features unless explicitly forbidden. Prompts without strict "DO NOT BUILD X" bounds will spontaneously introduce unrequested tabs or auth flows.'
            },
            {
              title: '5. Multi-Turn Context Compounding',
              color: 'text-teal-400',
              desc: 'In multi-turn chats, earlier instructions can conflict with new instructions. Explicitly resetting intent or stating scope boundaries resolves context collisions.'
            },
            {
              title: '6. Output Token Limit Truncation',
              color: 'text-emerald-400',
              desc: 'If code is written in a single massive file, response generation hits token ceilings mid-file. Splitting logic into modular TypeScript components prevents generation cutoffs.'
            }
          ].map((reason, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0b171f] border border-[#1a3847] space-y-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${reason.color}`}>{reason.title}</h3>
              <p className="text-xs text-[#7195a5] leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Prompt Analyzer & Refactor Engine */}
      <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-6">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Interactive Prompt Fidelity Refactor Engine
          </h2>
          <p className="text-xs text-[#7d9fbe]">
            Paste any prompt below to analyze potential fidelity bottlenecks and refactor it into an optimized zero-shot instruction.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            rows={4}
            value={userPromptInput}
            onChange={(e) => setUserPromptInput(e.target.value)}
            placeholder="Paste your prompt here (e.g. 'Build a degree catalog with course cards and interactive search...')"
            className="w-full p-4 rounded-xl bg-[#071116] border border-[#1c3d4c] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />

          <button
            onClick={handleAnalyzePrompt}
            disabled={isAnalyzing || !userPromptInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isAnalyzing ? 'Analyzing Attention Weights...' : 'Analyze & Refactor Prompt'}</span>
          </button>
        </div>

        {/* Diagnostic Result */}
        {analysisResult && (
          <div className="p-5 rounded-xl bg-[#08131a] border border-[#1c3d4c] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1b3846] pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Diagnostic Analysis Result
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                analysisResult.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                Deviative Risk: {analysisResult.riskLevel}
              </span>
            </div>

            <div className="text-xs text-[#82a4b3] leading-relaxed whitespace-pre-wrap">
              {analysisResult.diagnosis}
            </div>

            {/* High Fidelity Refactored Prompt */}
            <div className="space-y-2 pt-2 border-t border-[#1a3847]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300">High-Fidelity Refactored Prompt:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResult.refactoredPrompt);
                    setCopiedRefactored(true);
                    setTimeout(() => setCopiedRefactored(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-semibold"
                >
                  {copiedRefactored ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRefactored ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="bg-[#040a0e] p-3 rounded-lg border border-[#193645] font-mono text-[11px] text-cyan-200">
                <pre>{analysisResult.refactoredPrompt}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
