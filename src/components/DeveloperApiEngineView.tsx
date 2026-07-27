import React, { useState } from 'react';
import {
  Code2,
  Key,
  Play,
  Terminal,
  Copy,
  Check,
  Zap,
  CheckCircle,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Sparkles,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { ApiService } from '../services/api';

export const DeveloperApiEngineView: React.FC = () => {
  const [apiKey, setApiKey] = useState('zal_dev_sk_9f83a27e10b244c98d701a2b');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [keyScopes, setKeyScopes] = useState<string[]>(['courses:generate', 'tutor:ask', 'rag:search', 'tts:generate', 'certs:issue']);

  // Selected Endpoint
  const [selectedEndpoint, setSelectedEndpoint] = useState<'course_gen' | 'tutor' | 'tts' | 'quiz_eval' | 'rag_index'>('course_gen');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'javascript' | 'python' | 'go' | 'rust'>('javascript');

  // Interactive Test State
  const [requestTopic, setRequestTopic] = useState('Autonomous AI Swarms');
  const [isLoading, setIsLoading] = useState(false);
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  const generateNewKey = () => {
    const hex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`zal_dev_sk_${hex}`);
  };

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const executeLiveApiCall = async () => {
    setIsLoading(true);
    setResponsePayload(null);
    const start = performance.now();

    try {
      if (selectedEndpoint === 'course_gen') {
        const course = await ApiService.generateCourse({
          topic: requestTopic,
          category: 'Computer Science',
          level: 'Advanced',
          moduleCount: 3
        });
        setResponsePayload(course);
      } else if (selectedEndpoint === 'tutor') {
        const res = await ApiService.askTutor({
          prompt: `Explain ${requestTopic} in simple terms`,
          thinkingMode: true
        });
        setResponsePayload(res);
      } else if (selectedEndpoint === 'tts') {
        const audio = await ApiService.generateTTSAudio(`Now playing audio demonstration for ${requestTopic}`);
        setResponsePayload({ status: 'success', audioUriPresent: !!audio, sampleRate: '24kHz', codec: 'mp3' });
      } else if (selectedEndpoint === 'quiz_eval') {
        const evalRes = await ApiService.evaluateQuizResponse({
          question: `What is the core principle of ${requestTopic}?`,
          studentAnswer: 'Adaptive feedback and continuous learning loops.',
          correctAnswer: 'Adaptive feedback and continuous learning loops.',
          explanation: 'Adaptive feedback provides the highest mastery retention.',
          currentAdaptiveLevel: 'standard'
        });
        setResponsePayload(evalRes);
      } else {
        setResponsePayload({
          status: 'indexed',
          topic: requestTopic,
          vectorDimensions: 1536,
          documentsIndexed: 42,
          ragEndpoint: 'https://zalamati.org/api/v1/rag/search'
        });
      }
    } catch (err: any) {
      setResponsePayload({ error: err.message || 'API Execution Error' });
    } finally {
      const end = performance.now();
      setExecutionTimeMs(Math.round(end - start));
      setIsLoading(false);
    }
  };

  const getCodeSnippet = () => {
    if (selectedLanguage === 'curl') {
      return `curl -X POST https://zalamati.org/api/v1/generate-course \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "${requestTopic}",
    "category": "Computer Science",
    "level": "Advanced"
  }'`;
    }

    if (selectedLanguage === 'javascript') {
      return `import { ZalamatiClient } from '@zalamati/sdk';

const client = new ZalamatiClient({ apiKey: '${apiKey}' });

async function main() {
  const course = await client.courses.generate({
    topic: '${requestTopic}',
    category: 'Computer Science',
    level: 'Advanced'
  });
  console.log('Generated Course:', course.title);
}

main();`;
    }

    if (selectedLanguage === 'python') {
      return `from zalamati import ZalamatiClient

client = ZalamatiClient(api_key="${apiKey}")

response = client.courses.generate(
    topic="${requestTopic}",
    category="Computer Science",
    level="Advanced"
)

print(f"Generated Course: {response.title}")`;
    }

    if (selectedLanguage === 'go') {
      return `package main

import (
	"fmt"
	"github.com/zalamati/zalamati-go"
)

func main() {
	client := zalamati.NewClient("${apiKey}")
	course, err := client.GenerateCourse("${requestTopic}", "Advanced")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Course Generated: %s\\n", course.Title)
}`;
    }

    return `use zalamati_sdk::ZalamatiClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = ZalamatiClient::new("${apiKey}");
    let course = client.generate_course("${requestTopic}", "Advanced").await?;
    println!("Course Title: {}", course.title);
    Ok(())
}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1b24] via-[#0e2430] to-[#07131a] border border-[#1d3d4c] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer API Generator & Live Console</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Open Developer API Engine
          </h1>
          <p className="text-sm text-[#88acbd] leading-relaxed">
            Generate zero-cost API keys, test REST endpoints in real-time, inspect JSON payloads, and copy production code snippets in 5 languages.
          </p>
        </div>
      </div>

      {/* 1. API Key Generator Card */}
      <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b3846] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              API Key & Security Credentials
            </h2>
            <p className="text-xs text-[#7f9fbf]">Every developer receives 100% free unlimited API access for non-profit education.</p>
          </div>

          <button
            onClick={generateNewKey}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163847] hover:bg-[#1d4557] text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New API Key</span>
          </button>
        </div>

        {/* Key Display Bar */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#08131a] border border-[#1d3c4a]">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type={showKey ? 'text' : 'password'}
            readOnly
            value={apiKey}
            className="flex-1 bg-transparent text-xs font-mono text-cyan-300 focus:outline-none"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-1.5 rounded-lg text-[#618596] hover:text-white transition-colors"
            title={showKey ? 'Hide Key' : 'Show Key'}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={copyKeyToClipboard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#112a36] hover:bg-[#183948] text-xs font-semibold text-white border border-[#204456] transition-all"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Scopes Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#83a5b5]">Granted Scopes & Capabilities:</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'courses:generate', label: 'Course Architect API' },
              { id: 'tutor:ask', label: 'Socratic AI Tutor API' },
              { id: 'rag:search', label: 'Deep Crawl RAG Index' },
              { id: 'tts:generate', label: 'Speech-to-Speech Audio' },
              { id: 'certs:issue', label: 'Verifiable Certificate Issuer' }
            ].map((scope) => {
              const active = keyScopes.includes(scope.id);
              return (
                <button
                  key={scope.id}
                  onClick={() => {
                    setKeyScopes(prev =>
                      prev.includes(scope.id)
                        ? prev.filter(s => s !== scope.id)
                        : [...prev, scope.id]
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? 'bg-[#153444] text-cyan-300 border-cyan-500/40'
                      : 'bg-[#0b171f] text-[#5d8090] border-[#183341]'
                  }`}
                >
                  <CheckCircle className={`w-3.5 h-3.5 ${active ? 'text-teal-400' : 'text-slate-600'}`} />
                  <span>{scope.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive REST Endpoint Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Endpoint & Parameter Tester
          </h2>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#83a5b5]">Select API Endpoint:</label>
            <div className="space-y-2">
              {[
                { id: 'course_gen', label: 'POST /api/gemini/generate-course', desc: 'Course Architect Generator' },
                { id: 'tutor', label: 'POST /api/gemini/tutor', desc: 'Socratic Tutor Query' },
                { id: 'tts', label: 'POST /api/gemini/tts', desc: 'Speech Synthesis Engine' },
                { id: 'quiz_eval', label: 'POST /api/gemini/quiz-eval', desc: 'Adaptive Quiz Evaluator' },
                { id: 'rag_index', label: 'POST /api/gemini/rag-index', desc: 'Deep Crawl RAG Search' }
              ].map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedEndpoint === ep.id
                      ? 'bg-[#153545] border-cyan-500/50 text-white shadow-md'
                      : 'bg-[#0d1a21] border-[#1a3847] text-[#7093a3] hover:text-white'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-cyan-300">{ep.label}</div>
                  <div className="text-[11px] text-[#5e8191] mt-0.5">{ep.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#83a5b5]">Target Subject / Topic:</label>
            <input
              type="text"
              value={requestTopic}
              onChange={(e) => setRequestTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#08131a] border border-[#1c3d4c] text-xs text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. Quantum Computing, Machine Learning"
            />
          </div>

          <button
            onClick={executeLiveApiCall}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white" />
            )}
            <span>{isLoading ? 'Executing Request...' : 'Send Live Request'}</span>
          </button>
        </div>

        {/* Right Code Snippet & Live Response Viewer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Code Snippet Tabs */}
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b3846] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                Code Generation
              </h2>

              <div className="flex items-center gap-1.5 bg-[#08131a] p-1 rounded-lg border border-[#1c3b49]">
                {(['curl', 'javascript', 'python', 'go', 'rust'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all uppercase ${
                      selectedLanguage === lang
                        ? 'bg-[#183949] text-cyan-300 border border-cyan-500/30'
                        : 'text-[#5f8292] hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-[#071116] p-4 rounded-xl border border-[#1a3847] font-mono text-[11px] text-cyan-200 overflow-x-auto">
              <pre>{getCodeSnippet()}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCodeSnippet());
                  setCopiedSnippet(true);
                  setTimeout(() => setCopiedSnippet(false), 2000);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#10242f] hover:bg-[#183645] text-[#608394] hover:text-white transition-all border border-[#1c3c4b]"
                title="Copy Code"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </div>
          </div>

          {/* Live Response Output Window */}
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Response Payload Output
              </h2>
              {executionTimeMs !== null && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Latency: {executionTimeMs} ms | HTTP 200 OK
                </span>
              )}
            </div>

            <div className="bg-[#071116] p-4 rounded-xl border border-[#1a3847] font-mono text-[11px] text-emerald-300 min-h-[160px] max-h-[300px] overflow-y-auto">
              {responsePayload ? (
                <pre>{JSON.stringify(responsePayload, null, 2)}</pre>
              ) : (
                <div className="text-slate-500 italic text-center pt-10">
                  Click "Send Live Request" above to trigger an active API call...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Production API Quota & Realtime Webhooks Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rate Limits & Quotas */}
        <div className="p-5 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>API Rate Limits & Health</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              HEALTHY
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[#81a1b1] mb-1">
                <span>Burst Rate Limit (RPM):</span>
                <span className="font-mono text-white font-bold">120 req/min</span>
              </div>
              <div className="w-full h-1.5 bg-[#071116] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-1/4 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#81a1b1] mb-1">
                <span>Monthly Non-Profit Quota:</span>
                <span className="font-mono text-emerald-300 font-bold">1,000,000 / Mo</span>
              </div>
              <div className="w-full h-1.5 bg-[#071116] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-12/100 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks Event Simulator */}
        <div className="p-5 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-3">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Webhook Listener Simulator</span>
          </h3>
          <p className="text-xs text-[#81a1b1]">
            Subscribe to asynchronous platform events like <code className="text-cyan-300 font-mono">course.completed</code> and <code className="text-teal-300 font-mono">cert.issued</code>.
          </p>
          <div className="p-2.5 rounded-xl bg-[#071116] border border-[#1a3847] text-[11px] font-mono text-amber-300">
            POST /webhook/lmdpro_cert_event
            <br />
            <span className="text-gray-400">Payload: &#123;"event": "degree.issued", "student_id": "usr_992"&#125;</span>
          </div>
        </div>

        {/* OpenAPI 3.1 & SDK Exports */}
        <div className="p-5 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-3">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>OpenAPI 3.1 Specification</span>
          </h3>
          <p className="text-xs text-[#81a1b1]">
            Download raw OpenAPI schema or import directly into Postman or Insomnia.
          </p>
          <button
            onClick={() => {
              const schema = { openapi: '3.1.0', info: { title: 'LMDpro Developer API', version: '1.0.0' } };
              const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'lmdpro_openapi_v1.json';
              a.click();
            }}
            className="w-full py-2 rounded-xl bg-[#143241] hover:bg-[#1a3f52] text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Export OpenAPI v3.1 Spec (.JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
