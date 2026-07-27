import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Terminal, Code2, Copy, Check, Sparkles, Trash2, Bug } from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  lessonTitle?: string;
}

interface ConsoleOutput {
  id: string;
  type: 'log' | 'warn' | 'error' | 'result' | 'info';
  content: string;
  timestamp: string;
}

const PRESET_SNIPPETS = [
  {
    name: 'Array Transformation',
    code: `// Array Transformation & Map/Filter
const courses = [
  { title: 'Neural Networks', students: 120, rating: 4.9 },
  { title: 'Quantum Computing', students: 85, rating: 4.7 },
  { title: 'Cybersecurity', students: 210, rating: 4.8 }
];

const popular = courses
  .filter(c => c.students > 100)
  .map(c => \`\${c.title} (\${c.students} enrolled)\`);

console.log("Popular Courses:", popular);`
  },
  {
    name: 'Async Promise Pipeline',
    code: `// Async Promise Simulation
async function fetchCourseData(id) {
  console.log(\`[API] Requesting course \${id}...\`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, status: '200 OK', topic: 'Multimodal AI' });
    }, 300);
  });
}

async function runPipeline() {
  const result = await fetchCourseData('LMD-101');
  console.log("Received payload:", result);
}

runPipeline();`
  },
  {
    name: 'Object Destructuring',
    code: `// Modern Object & Array Mechanics
const student = {
  name: 'Alex Rivera',
  major: 'Computer Science',
  skills: ['TypeScript', 'Python', 'PyTorch'],
  stats: { gpa: 3.92, completedModules: 14 }
};

const { name, stats: { gpa } } = student;
const [primarySkill, ...otherSkills] = student.skills;

console.log(\`Student \${name} has GPA \${gpa}\`);
console.log(\`Primary Skill: \${primarySkill}, Others:\`, otherSkills);`
  }
];

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ initialCode, lessonTitle }) => {
  const defaultCode = initialCode || PRESET_SNIPPETS[0].code;
  const [code, setCode] = useState<string>(defaultCode);
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const runCode = () => {
    setIsRunning(true);
    const newOutputs: ConsoleOutput[] = [];
    const getTime = () => new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });

    // Custom console wrapper
    const customConsole = {
      log: (...args: any[]) => {
        newOutputs.push({
          id: Math.random().toString(),
          type: 'log',
          content: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          timestamp: getTime()
        });
      },
      info: (...args: any[]) => {
        newOutputs.push({
          id: Math.random().toString(),
          type: 'info',
          content: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          timestamp: getTime()
        });
      },
      warn: (...args: any[]) => {
        newOutputs.push({
          id: Math.random().toString(),
          type: 'warn',
          content: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          timestamp: getTime()
        });
      },
      error: (...args: any[]) => {
        newOutputs.push({
          id: Math.random().toString(),
          type: 'error',
          content: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          timestamp: getTime()
        });
      }
    };

    try {
      // Execute in isolated function context with mocked console
      const runFn = new Function('console', code);
      const returnValue = runFn(customConsole);

      if (returnValue !== undefined) {
        newOutputs.push({
          id: Math.random().toString(),
          type: 'result',
          content: `Return value: ${typeof returnValue === 'object' ? JSON.stringify(returnValue, null, 2) : String(returnValue)}`,
          timestamp: getTime()
        });
      }
    } catch (err: any) {
      newOutputs.push({
        id: Math.random().toString(),
        type: 'error',
        content: `Runtime Error: ${err.message || String(err)}`,
        timestamp: getTime()
      });
    } finally {
      setOutputs(newOutputs);
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="rounded-2xl bg-[#091720] border border-[#1b3e52] shadow-2xl overflow-hidden my-6">
      {/* Header Bar */}
      <div className="p-3.5 bg-[#0e222e] border-b border-[#18394a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Interactive JavaScript Sandbox</h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live JS Engine
              </span>
            </div>
            <p className="text-[10px] text-[#789cae]">
              {lessonTitle ? `Practice code snippets for ${lessonTitle}` : 'Execute JavaScript in real-time'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <select
            onChange={(e) => {
              const selected = PRESET_SNIPPETS.find(s => s.name === e.target.value);
              if (selected) setCode(selected.code);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#08151c] border border-[#1d4154] text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
          >
            <option value="">Load Preset Snippet...</option>
            {PRESET_SNIPPETS.map((s) => (
              <option key={s.name} value={s.name} className="bg-[#0e222e] text-white">
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-[#08151c] hover:bg-[#153444] text-[#86aac0] hover:text-white border border-[#1d4154] transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Run (Ctrl+Enter)</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#18394a]">
        {/* Code Input Area */}
        <div className="p-4 bg-[#061219] flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#6d91a3] font-mono">
            <span>// javascript (es6+)</span>
            <span>{code.split('\n').length} lines</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="// Write JS code here..."
            spellCheck={false}
            rows={10}
            className="w-full bg-transparent font-mono text-xs text-cyan-200 leading-relaxed focus:outline-none resize-y min-h-[200px]"
          />
        </div>

        {/* Real-time Console Output */}
        <div className="p-4 bg-[#040e14] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#143242]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Console Output</span>
            </div>
            {outputs.length > 0 && (
              <button
                onClick={() => setOutputs([])}
                className="text-[10px] font-semibold text-[#6d91a3] hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] space-y-1.5 font-mono text-xs">
            {outputs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-[#537688]">
                <Bug className="w-6 h-6 mb-1 opacity-50 text-cyan-400" />
                <p className="text-xs">Click 'Run' or press Ctrl+Enter to execute JavaScript</p>
              </div>
            ) : (
              outputs.map((out) => {
                let badgeStyle = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
                if (out.type === 'error') badgeStyle = 'text-red-400 bg-red-950/40 border-red-500/30';
                if (out.type === 'warn') badgeStyle = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
                if (out.type === 'result') badgeStyle = 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30';

                return (
                  <div
                    key={out.id}
                    className={`p-2 rounded-lg border text-xs leading-relaxed whitespace-pre-wrap ${badgeStyle}`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-70 mb-0.5">
                      <span className="uppercase font-bold">[{out.type}]</span>
                      <span>{out.timestamp}</span>
                    </div>
                    <div>{out.content}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
