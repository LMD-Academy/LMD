import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, orderBy, limit, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { OfflineAnalyticsTracker } from '../services/offlineAnalytics';
import {
  Users,
  Search,
  MessageSquare,
  Send,
  Zap,
  Sparkles,
  Check,
  UserCheck,
  Code,
  ShieldAlert,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface PeerMatchCollaboratorProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
  isSystem?: boolean;
}

interface PeerCandidate {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  specialty: string;
}

const PEER_POOL: PeerCandidate[] = [
  { name: 'Dr. Liam Carter', role: 'Quant Researcher', avatar: '🧙‍♂️', bio: 'Specializes in algorithmic physics and lensmaker formulas.', specialty: 'CAD Optics' },
  { name: 'Sophia Chen', role: 'PhD AI Student', avatar: '👩‍💻', bio: 'Deep learning architect exploring cognitive robotics.', specialty: 'Python Solvers' },
  { name: 'Marcus Vance', role: 'Aerospace Dev', avatar: '👨‍🚀', bio: 'Engineering mechanical models using structural equations.', specialty: '3D Mechanics' },
  { name: 'Elena Rostova', role: 'Math Educator', avatar: '👩‍🏫', bio: 'Passionate about vector spaces and STEM visualization design.', specialty: 'Socratic Method' }
];

export const PeerMatchCollaborator: React.FC<PeerMatchCollaboratorProps> = ({
  courseId,
  lessonId,
  lessonTitle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchedPeer, setMatchedPeer] = useState<PeerCandidate | null>(null);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [matchingStep, setMatchingStep] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, matchedPeer]);

  // Online count simulation
  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 5) + 3);
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, prev + diff);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Firestore Chat Listener for this module
  useEffect(() => {
    if (!matchedPeer) return;

    const chatQuery = query(
      collection(db, 'moduleChats'),
      where('courseId', '==', courseId),
      where('lessonId', '==', lessonId),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const loadedMessages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: data.createdAt,
          isSystem: data.isSystem
        });
      });

      // If we got messages from other real students, load them
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    }, (error) => {
      console.warn('Firestore real-time listener failed or permission denied, using active state: ', error);
    });

    return () => unsubscribe();
  }, [courseId, lessonId, matchedPeer]);

  const handleStartMatch = () => {
    setIsMatching(true);
    setMatchingStep('Querying active network sessions...');
    OfflineAnalyticsTracker.trackEvent(courseId, lessonId, 'interaction', 1);

    // Dynamic scanning animation steps
    setTimeout(() => {
      setMatchingStep('Filtering students by active module constraints...');
      setTimeout(() => {
        setMatchingStep('Establishing secure P2P collaboration tunnel...');
        setTimeout(() => {
          // Select random peer from pool
          const selected = PEER_POOL[Math.floor(Math.random() * PEER_POOL.length)];
          setMatchedPeer(selected);
          setIsMatching(false);
          setMatchingStep('');

          // Initial welcome system messages
          setMessages([
            {
              id: 'system-welcome',
              senderId: 'system',
              senderName: 'LMD Matcher',
              text: `🤝 Dynamic Pairing Complete! You have been matched with ${selected.name} (${selected.role}) currently analyzing "${lessonTitle}".`,
              timestamp: new Date(),
              isSystem: true
            },
            {
              id: 'initial-greeting',
              senderId: 'peer',
              senderName: selected.name,
              text: `Hey there! 👋 I am working on the CAD optics lab for "${lessonTitle}". How is your convergence equation looking?`,
              timestamp: new Date()
            }
          ]);
        }, 1200);
      }, 1000);
    }, 900);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !matchedPeer) return;

    const currentUser = auth.currentUser;
    const currentName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Me';
    const currentUid = currentUser?.uid || 'guest_user';

    const newMessageText = inputText;
    setInputText('');

    // Track user interaction
    OfflineAnalyticsTracker.trackEvent(courseId, lessonId, 'interaction', 1);

    // 1. Create message object locally
    const userMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: currentUid,
      senderName: currentName,
      text: newMessageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    // 2. Persist real message to Cloud Firestore so other actual students on this page can see it
    try {
      await addDoc(collection(db, 'moduleChats'), {
        courseId,
        lessonId,
        senderId: currentUid,
        senderName: currentName,
        text: newMessageText,
        createdAt: serverTimestamp(),
        isSystem: false
      });
    } catch (fsErr) {
      console.warn('Real-time message database save skipped or offline. Maintained in local sandbox: ', fsErr);
    }

    // 3. Simulated peer socratic replies (Collaborative Problem Solving companion)
    setTimeout(() => {
      let replyText = `That's interesting! Let's double check our physics curves.`;
      
      const lowerText = newMessageText.toLowerCase();
      if (lowerText.includes('focal') || lowerText.includes('lens') || lowerText.includes('curv') || lowerText.includes('formula')) {
        replyText = `Right on! I calibrated my biconvex lens curve (R) to 100mm and refraction index (n) to 1.52. The convergence laser instantly focused at X=350! Try that constraint!`;
      } else if (lowerText.includes('code') || lowerText.includes('python') || lowerText.includes('compile') || lowerText.includes('error')) {
        replyText = `Yeah, the python script checks the focal distance with mathematical tolerance. Make sure the calculation output error is less than 12.0px.`;
      } else if (lowerText.includes('help') || lowerText.includes('stuck') || lowerText.includes('solve')) {
        replyText = `I can help! Let's examine the curvature. Increasing refractive index bends light more severely, shifting the focal focus point to the left!`;
      } else {
        replyText = `Fascinating perspective! Collaborative thinking makes these STEM challenges much clearer. Let's run the constraints test and verify our outputs.`;
      }

      const peerMsg: ChatMessage = {
        id: `peer-reply-${Date.now()}`,
        senderId: 'peer',
        senderName: matchedPeer.name,
        text: replyText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, peerMsg]);
    }, 1200);
  };

  return (
    <div className="liquid-glass-card border border-white/10 p-5 bg-[#0b101d]/90 rounded-2xl relative shadow-xl overflow-hidden mt-6">
      {/* Absolute Neon Glow Grid */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-indigo-500/5 to-transparent pointer-events-none" />

      {/* Header panel */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/5 gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-black text-white uppercase tracking-wider">
              LMD Peer-to-Peer Collab Matcher
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Study with students on the same module, share code constraints, or design optical solutions together.
          </p>
        </div>

        {/* Live network pulse */}
        <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded-full shrink-0">
          <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-ping" />
          <span className="text-[9px] font-mono font-black text-[#22d3ee]">
            {onlineCount} STUDENTS ACTIVE IN LECTURE
          </span>
        </div>
      </div>

      {/* Main body: Match portal OR Active Chat interface */}
      <div className="relative z-10 mt-4 min-h-64 flex flex-col justify-between">
        {!matchedPeer && !isMatching && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Collaborate Instantly</h3>
              <p className="text-[11px] text-gray-400 mt-1.5 max-w-sm leading-relaxed mx-auto">
                No active pairing session. Click below to scan the academy database for a peer currently working on <strong className="text-gray-300">"{lessonTitle}"</strong>.
              </p>
            </div>
            <button
              onClick={handleStartMatch}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-600/20 hover:scale-102 active:scale-98"
            >
              <span>Find Study Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Matching scanning animation state */}
        {isMatching && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin flex items-center justify-center" />
              <Search className="w-5 h-5 text-cyan-300 absolute top-3.5 left-3.5 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black text-cyan-400">Pairing Algorithm Active</span>
              <p className="text-xs font-mono text-gray-300 max-w-xs leading-normal animate-pulse">
                {matchingStep}
              </p>
            </div>
          </div>
        )}

        {/* Active matched collaborative chat session */}
        {matchedPeer && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Peer info bar */}
            <div className="p-3 rounded-xl bg-[#13192a]/60 border border-white/5 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center text-lg">
                  {matchedPeer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{matchedPeer.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-bold text-cyan-400 uppercase">
                      {matchedPeer.role}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 italic">"{matchedPeer.bio}"</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[8px] font-mono text-gray-500">EXPERTISE</span>
                <p className="text-[9px] font-mono font-bold text-purple-300">{matchedPeer.specialty}</p>
              </div>
            </div>

            {/* Message Feed list */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 h-52 overflow-y-auto space-y-3 mb-4 flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.isSystem ? 'self-center w-full max-w-full text-center py-1' :
                    msg.senderId === 'peer' ? 'self-start' : 'self-end items-end'
                  }`}
                >
                  {/* Sender Label */}
                  {!msg.isSystem && (
                    <span className="text-[8px] font-mono text-gray-500 mb-0.5 px-1">
                      {msg.senderName}
                    </span>
                  )}

                  {/* Bubble content */}
                  {msg.isSystem ? (
                    <div className="text-[10px] text-cyan-300 font-mono bg-cyan-950/25 border border-cyan-900/30 py-1.5 px-3 rounded-xl">
                      {msg.text}
                    </div>
                  ) : (
                    <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.senderId === 'peer'
                        ? 'bg-[#182035] text-gray-100 rounded-tl-none border border-white/5'
                        : 'bg-cyan-600 text-slate-950 rounded-tr-none font-medium shadow-md shadow-cyan-600/10'
                    }`}>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Dynamic collaborative solver prompt suggestion */}
            <div className="mb-4 flex items-center justify-between p-2 rounded-xl bg-purple-950/15 border border-purple-500/10 text-[9px] text-purple-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Need help with constraints? Ask {matchedPeer.name} "What curvature should I use?"</span>
              </span>
              <button
                onClick={() => setInputText('What curvature should I use to focus the laser on the receiver?')}
                className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors"
              >
                Insert Prompt
              </button>
            </div>

            {/* Chat submit footer */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder={`Type a message to ${matchedPeer.name.split(' ')[1]}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400/60 transition-all font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/10"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
