import React, { useState, useRef, useEffect } from 'react';
import { ApiService } from '../services/api';
import {
  X,
  Send,
  Sparkles,
  Brain,
  Zap,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AgenticAiIcon } from './AgenticAiIcon';
import { BrilliantExplainer } from './BrilliantExplainer';
import { TTSPlayer } from './TTSPlayer';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContextLessonTitle?: string;
  initialContextContent?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  thinkingProcess?: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  initialContextLessonTitle,
  initialContextContent,
}) => {
  const [activeTab, setActiveTab] = useState<'socratic_dialogue' | 'brilliant_explainer'>('socratic_dialogue');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'tutor',
      text: `Hello! I am **Kudo Agent** (powered by Socratic Discovery Engine). ${
        initialContextLessonTitle ? `I see you are currently investigating **"${initialContextLessonTitle}"**.` : ''
      } Ask me anything! I break down complex LMD concepts step-by-step, generate visual analogies, and guide active discovery through targeted questions.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [thinkingMode, setThinkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const tutorMsgId = `tut-${Date.now()}`;
    const tutorMsg: Message = {
      id: tutorMsgId,
      sender: 'tutor',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, tutorMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    let capturedThinking: string | undefined;

    await ApiService.askTutorStream(
      {
        prompt,
        contextLessonTitle: initialContextLessonTitle,
        contextContent: initialContextContent,
        thinkingMode,
      },
      (chunkText, thinkingProcess) => {
        if (thinkingProcess) {
          capturedThinking = thinkingProcess;
        }
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tutorMsgId
              ? {
                  ...msg,
                  text: msg.text + chunkText,
                  thinkingProcess: capturedThinking || msg.thinkingProcess
                }
              : msg
          )
        );
      }
    );

    setMessages(prev =>
      prev.map(msg => (msg.id === tutorMsgId ? { ...msg, isStreaming: false } : msg))
    );
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0f2129] border border-[#1e3c4a] rounded-3xl max-w-4xl w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden relative text-white">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-[#0d1d24] via-[#102732] to-[#0d1f27] border-b border-[#1b3846] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <AgenticAiIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">Kudo Agent — Socratic AI Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {thinkingMode ? 'Deep Reasoning' : 'Instant Discovery'}
                </span>
              </div>
              <p className="text-[11px] text-[#86a8b7]">
                Guided Active Discovery & Interactive Problem Solving
              </p>
            </div>
          </div>

          {/* Sub-Header Navigation Tabs & Thinking Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0a1820] p-1 rounded-xl border border-[#1a3848] text-xs">
              <button
                onClick={() => setActiveTab('socratic_dialogue')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'socratic_dialogue'
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-[#82a4b3] hover:text-white'
                }`}
              >
                Socratic Assistant
              </button>
              <button
                onClick={() => setActiveTab('brilliant_explainer')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'brilliant_explainer'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow'
                    : 'text-[#82a4b3] hover:text-white'
                }`}
              >
                Concepts That Click
              </button>
            </div>

            {/* Deep Reasoning Mode Toggle */}
            <button
              onClick={() => setThinkingMode(!thinkingMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                thinkingMode
                  ? 'bg-purple-600/20 border-purple-400 text-purple-200 shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title="Toggle High Reasoning Thinking Mode"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Deep Mode</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: SOCRATIC DIALOGUE THREAD */}
        {activeTab === 'socratic_dialogue' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-3 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-700 to-teal-700 text-white rounded-br-none'
                        : 'bg-[#12242d] text-gray-200 border border-[#1e3c4a] rounded-bl-none'
                    }`}
                  >
                    {msg.thinkingProcess && (
                      <div className="text-[10px] font-mono text-cyan-300 bg-[#0d1d24] p-2.5 rounded-xl border border-cyan-500/20">
                        🧠 <strong>Deep Reasoning Step:</strong> {msg.thinkingProcess}
                      </div>
                    )}

                    <div className="whitespace-pre-line leading-relaxed text-xs">
                      {msg.text || (msg.isStreaming ? (
                        <span className="text-[#7292a1] italic flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                          Reasoning & streaming response...
                        </span>
                      ) : '')}
                      {msg.isStreaming && msg.text && (
                        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse align-middle rounded-xs" />
                      )}
                    </div>

                    {msg.sender === 'tutor' && !msg.isStreaming && msg.text && (
                      <div className="pt-2 border-t border-white/10">
                        <TTSPlayer text={msg.text} title="Listen to Agentic AI Response" compact={true} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && !messages.some(m => m.isStreaming) && (
                <div className="flex items-center gap-2 text-xs text-cyan-300 bg-[#12242d] p-3.5 rounded-2xl w-fit border border-[#1e3c4a]">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Agentic AI is establishing stream connection...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="px-4 py-2 border-t border-[#1b3846] flex items-center gap-2 overflow-x-auto text-[11px] bg-[#0c181f] shrink-0">
              <span className="text-[#7ea0af] font-semibold shrink-0">Discovery Prompts:</span>
              {[
                'Explain step-by-step with analogy',
                'Give an interactive practice question',
                'Why does this formula work mathematically?',
                'Show me Python or code implementation'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/20 shrink-0 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Prompt Input Footer */}
            <div className="p-3.5 border-t border-[#1b3846] bg-[#0d1c23] flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Agentic AI anything or request an explanation..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#11242e] border border-[#1e3d4c] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputPrompt.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-40 text-white shadow-md shadow-cyan-900/30 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BRILLIANT INTERACTIVE EXPLAINER */}
        {activeTab === 'brilliant_explainer' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <BrilliantExplainer />
          </div>
        )}
      </div>
    </div>
  );
};
