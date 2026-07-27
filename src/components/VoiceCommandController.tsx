import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, HelpCircle, Check, AlertCircle, X } from 'lucide-react';

interface VoiceCommandControllerProps {
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  onOpenQuiz?: () => void;
  onOpenDashboard?: () => void;
  onReadLesson?: () => void;
  onToggleNotes?: () => void;
  onTogglePeerCollab?: () => void;
  onToggleWorkbench?: () => void;
  onToggleGlossary?: () => void;
  onVerifyIntegrity?: () => void;
}

export const VoiceCommandController: React.FC<VoiceCommandControllerProps> = ({
  onNextLesson,
  onPrevLesson,
  onOpenQuiz,
  onOpenDashboard,
  onReadLesson,
  onToggleNotes,
  onTogglePeerCollab,
  onToggleWorkbench,
  onToggleGlossary,
  onVerifyIntegrity
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      const cleaned = currentTranscript.trim().toLowerCase();
      setTranscript(cleaned);
      processCommand(cleaned);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  const processCommand = (text: string) => {
    if (!text) return;

    if (text.includes('next lesson') || text.includes('go next') || text.includes('forward')) {
      onNextLesson?.();
      setLastExecutedCommand('▶ Next Lesson');
      setTranscript('');
    } else if (text.includes('previous lesson') || text.includes('go back') || text.includes('previous')) {
      onPrevLesson?.();
      setLastExecutedCommand('◀ Previous Lesson');
      setTranscript('');
    } else if (text.includes('open quiz') || text.includes('start quiz') || text.includes('take quiz')) {
      onOpenQuiz?.();
      setLastExecutedCommand('📝 Start Quiz');
      setTranscript('');
    } else if (text.includes('open dashboard') || text.includes('go to dashboard') || text.includes('exit course')) {
      onOpenDashboard?.();
      setLastExecutedCommand('🏠 Open Dashboard');
      setTranscript('');
    } else if (text.includes('read lesson') || text.includes('read aloud') || text.includes('narrate')) {
      onReadLesson?.();
      setLastExecutedCommand('🔊 Read Aloud');
      setTranscript('');
    } else if (text.includes('toggle notes') || text.includes('open notes') || text.includes('show notes')) {
      onToggleNotes?.();
      setLastExecutedCommand('📓 Toggle Notes');
      setTranscript('');
    } else if (text.includes('peer') || text.includes('collab') || text.includes('chat')) {
      onTogglePeerCollab?.();
      setLastExecutedCommand('👥 Toggle Peer Collab');
      setTranscript('');
    } else if (text.includes('workbench') || text.includes('study tools')) {
      onToggleWorkbench?.();
      setLastExecutedCommand('🛠️ Toggle Workbench');
      setTranscript('');
    } else if (text.includes('glossary') || text.includes('terms') || text.includes('vocabulary')) {
      onToggleGlossary?.();
      setLastExecutedCommand('📖 Toggle Glossary');
      setTranscript('');
    } else if (text.includes('integrity') || text.includes('verify') || text.includes('check project')) {
      onVerifyIntegrity?.();
      setLastExecutedCommand('🛡️ Academic Integrity Check');
      setTranscript('');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 animate-pulse'
              : 'bg-[#0b1820] hover:bg-[#122430] text-cyan-300 border-cyan-500/30'
          }`}
          title={isListening ? 'Voice Control Active - Click to stop' : 'Click to enable Voice Navigation Commands'}
        >
          {isListening ? (
            <Mic className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          ) : (
            <MicOff className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>{isListening ? 'Voice Active...' : 'Voice Control'}</span>
        </button>

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-1.5 rounded-lg bg-[#0b1820] hover:bg-[#122430] text-gray-400 hover:text-cyan-300 border border-cyan-500/20 text-xs transition-colors cursor-pointer"
          title="Voice Command List"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Speech Recognition Feedback Toast */}
      {isListening && (
        <div className="absolute top-10 right-0 z-50 w-64 p-3 rounded-xl bg-[#09151e]/95 border border-cyan-500/40 text-[11px] text-cyan-200 shadow-2xl backdrop-blur-md animate-fade-in space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-cyan-400 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Listening...
            </span>
            <span className="text-gray-500">WebSpeech API</span>
          </div>
          <p className="font-mono text-white bg-black/40 p-2 rounded-lg min-h-[28px] break-words italic">
            "{transcript || 'Say a command...'}"
          </p>

          {lastExecutedCommand && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold border-t border-white/5 pt-1 mt-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Executed: {lastExecutedCommand}</span>
            </div>
          )}
        </div>
      )}

      {/* Voice Commands Cheat Sheet Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1820] border border-cyan-500/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <h3 className="font-extrabold text-white text-sm">Voice Command Interface</h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-300 text-[11px]">
              Enable hands-free navigation across your learning environment using standard natural speech commands:
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block">"Next Lesson"</span>
                <p className="text-gray-400 text-[10px]">Advances to the next lesson module.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block">"Previous Lesson"</span>
                <p className="text-gray-400 text-[10px]">Returns to preceding lesson.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block">"Start Quiz"</span>
                <p className="text-gray-400 text-[10px]">Opens the active lesson quiz.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block">"Read Lesson"</span>
                <p className="text-gray-400 text-[10px]">Triggers AI audio narration.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block">"Toggle Glossary"</span>
                <p className="text-gray-400 text-[10px]">Opens extracted terminology list.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block">"Verify Integrity"</span>
                <p className="text-gray-400 text-[10px]">Triggers academic concept scanner.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowHelp(false);
                  if (!isListening) toggleListening();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {isListening ? 'Close' : 'Enable Mic & Try'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
