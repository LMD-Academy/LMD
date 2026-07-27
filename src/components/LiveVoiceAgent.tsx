import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  Radio,
  Sliders,
  ChevronRight,
  BrainCircuit,
  Headphones,
  RotateCcw,
  Zap,
  BookOpen
} from 'lucide-react';
import { useTTSVoice } from '../hooks/useTTSVoice';

interface LiveVoiceAgentProps {
  initialTopic?: string;
  onClose?: () => void;
}

export const LiveVoiceAgent: React.FC<LiveVoiceAgentProps> = ({
  initialTopic = 'LMD Degree Pathways & Modern Computer Science',
  onClose
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [discussionMode, setDiscussionMode] = useState<'socratic' | 'deep_dive' | 'oral_exam' | 'clarification'>('socratic');
  const [studentInput, setStudentInput] = useState('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(30);

  const { speak, stop, isPlaying, rate, setRate } = useTTSVoice();

  // Simulated transcript history
  const [transcript, setTranscript] = useState<Array<{ sender: 'agent' | 'user'; text: string; timestamp: string }>>([
    {
      sender: 'agent',
      text: `Greetings, Scholar! I am Kudo Agent. Welcome to your Live Socratic Audio Discussion on "${topic}". How would you like to explore this topic today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Audio wave pulsing effect
  useEffect(() => {
    let interval: any;
    if (isLiveSessionActive || isPlaying) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 70) + 30);
      }, 150);
    } else {
      setAudioLevel(15);
    }
    return () => clearInterval(interval);
  }, [isLiveSessionActive, isPlaying]);

  const presetTopics = [
    'LMD Accreditation & Semester Credit System (ECTS)',
    'Distributed Systems & Consensus Protocols (Raft/Paxos)',
    'Quantum Computing: Qubits & Superposition',
    'Neural Network Optimization & Gradient Descent',
    'Ethical Governance in Autonomous AI Systems'
  ];

  const handleStartSession = () => {
    setIsLiveSessionActive(true);
    const greeting = `Live Socratic Voice Discussion initialized for topic: "${topic}". Ask your first question or state a premise to explore!`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTranscript((prev) => [...prev, { sender: 'agent', text: greeting, timestamp: time }]);
    speak(greeting);
  };

  const handleEndSession = () => {
    setIsLiveSessionActive(false);
    stop();
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || studentInput;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript((prev) => [...prev, { sender: 'user', text, timestamp: time }]);
    if (!textToSend) setStudentInput('');

    // Simulate Agent Socratic Response
    setTimeout(() => {
      let agentResponse = '';
      if (discussionMode === 'socratic') {
        agentResponse = `That is a fundamental observation regarding "${text}". Let's dissect the core hypothesis: What underlying constraint or principle makes this model work? Consider the trade-off between consistency and availability.`;
      } else if (discussionMode === 'deep_dive') {
        agentResponse = `Analyzing "${text}" through a rigorous academic lens. Mechanically, this relies on vector transformations and high-dimensional space mapping. Notice how the gradient updates adjust the weights iteratively.`;
      } else if (discussionMode === 'oral_exam') {
        agentResponse = `Examiner Question: You mentioned "${text}". How would you prove its correctness or defend against edge-case failures in a production environment?`;
      } else {
        agentResponse = `To clarify "${text}": Think of it as a pipeline where each stage processes and validates inputs before passing them down the stack.`;
      }

      setTranscript((prev) => [...prev, { sender: 'agent', text: agentResponse, timestamp: time }]);
      setIsAgentSpeaking(true);
      speak(agentResponse);
    }, 1000);
  };

  return (
    <div className="bg-[#0b1820] border border-[#1b3d4f] rounded-3xl p-5 md:p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#183747] relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-slate-950 font-black shadow-lg shadow-cyan-900/50">
            <Headphones className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-lg tracking-tight">Kudo Socratic Live Voice Discussion</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                Interactive Voice Agent
              </span>
            </div>
            <p className="text-xs text-[#7ea1b2]">Engage in real-time vocal Q&A, deep-dives, and Socratic oral debates</p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2">
          {isLiveSessionActive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE AUDIO SESSION ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#122834] border border-[#1e3e50] text-[#7ea1b2] text-xs font-medium">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Agent Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Discussion Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Col: Topic Selection & Discussion Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] space-y-3">
            <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Discussion Topic</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic or academic lesson..."
              className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1a3848] text-white text-xs focus:outline-none focus:border-cyan-400"
            />

            <div className="space-y-1.5">
              <span className="text-[10px] text-[#638797] font-semibold">Preset Topics:</span>
              <div className="space-y-1">
                {presetTopics.map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTopic(pt)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#09161e] hover:bg-[#122a38] text-[11px] text-[#86a8b7] hover:text-white transition-colors truncate block border border-white/5"
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discussion Mode Selector */}
          <div className="p-4 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] space-y-2.5">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Pedagogical Discussion Depth</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'socratic', label: 'Socratic Discovery', desc: 'Guiding questions' },
                { id: 'deep_dive', label: 'Academic Deep Dive', desc: 'Rigorous breakdown' },
                { id: 'oral_exam', label: 'Oral Exam Prep', desc: 'Interactive defense' },
                { id: 'clarification', label: 'Quick Explanation', desc: 'Step-by-step summary' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setDiscussionMode(m.id as any)}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    discussionMode === m.id
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 font-bold shadow-md'
                      : 'bg-[#09161e] text-[#7ea1b2] border-[#183646] hover:bg-white/5'
                  }`}
                >
                  <p className="text-xs">{m.label}</p>
                  <p className="text-[9px] opacity-75">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Session Launch & Audio Control Panel */}
          <div className="p-4 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] space-y-3">
            {!isLiveSessionActive ? (
              <button
                onClick={handleStartSession}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-900/40 active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Live Voice Discussion</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleEndSession}
                  className="w-full py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>End Live Session</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#183646]">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isMicMuted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isMicMuted ? 'Muted' : 'Mic On'}</span>
                  </button>

                  <div className="flex items-center gap-1 bg-[#07131a] p-1 rounded-xl border border-[#1b3d4f] text-[10px]">
                    {[0.8, 1.0, 1.25, 1.5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setRate(s)}
                        className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                          rate === s ? 'bg-cyan-500 text-slate-950' : 'text-[#7ea0b1]'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Col: Live Waveform Visualizer & Interactive Transcript */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Animated Waveform Visualizer */}
          <div className="p-5 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 h-20 w-full px-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const heightVal = isLiveSessionActive || isPlaying
                  ? Math.max(10, (Math.sin(i + audioLevel) + 1) * 35 + Math.random() * 20)
                  : 8;

                return (
                  <div
                    key={i}
                    className="w-2 rounded-full transition-all duration-150 bg-gradient-to-t from-cyan-600 via-teal-400 to-emerald-300"
                    style={{ height: `${heightVal}px` }}
                  />
                );
              })}
            </div>

            <p className="text-xs font-semibold text-[#82a4b3] mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isPlaying
                  ? 'Kudo Agent Speaking...'
                  : isLiveSessionActive
                  ? 'Listening for student input...'
                  : 'Click "Start Live Voice Discussion" to begin'}
              </span>
            </p>
          </div>

          {/* Discussion Transcript Log */}
          <div className="p-4 rounded-2xl bg-[#08131a] border border-[#183646] h-[280px] overflow-y-auto space-y-3 text-xs leading-relaxed">
            {transcript.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-tr-none'
                      : 'bg-[#0e212c] border border-[#1c3d4f] text-gray-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-cyan-200/70 font-semibold">
                    <span>{msg.sender === 'user' ? 'You' : 'Kudo Agent'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick Voice Prompt / Text Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type or speak your question to Kudo Agent..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a171f] border border-[#1b3e50] text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Speak</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
