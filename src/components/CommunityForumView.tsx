import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  PlusCircle,
  ThumbsUp,
  CheckCircle,
  ShieldCheck,
  Search,
  Filter,
  Tag,
  User,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  ArrowLeft,
  X,
  Send,
  HelpCircle,
  Flame
} from 'lucide-react';
import { UserProfile, ForumThread, ForumReply } from '../types';
import { OfflineStorageService } from '../services/offlineStorage';

interface CommunityForumViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const CATEGORIES = [
  'All Categories',
  '🤖 AI Engineering & Swarms',
  '💻 Full-Stack & Systems',
  '⚛️ Quantum Computing & Physics',
  '📐 Mathematics & Logic',
  '💬 General Discussion & Study Groups'
];

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  user,
  onUpdateUser
}) => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'top' | 'unanswered' | 'solved'>('latest');
  
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);

  // New Thread Form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('🤖 AI Engineering & Swarms');
  const [newContent, setNewContent] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('AI, Agents, Help');

  // Reply Form
  const [replyContent, setReplyContent] = useState<string>('');

  useEffect(() => {
    const loaded = OfflineStorageService.getForumThreads();
    setThreads(loaded);
  }, []);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      upvotes: 1,
      replyCount: 0,
      isSolved: false,
      createdAt: 'Just now',
      userUpvoted: true,
      replies: []
    };

    const updatedThreads = OfflineStorageService.saveForumThread(newThread);
    setThreads(updatedThreads);

    // Award +15 XP for starting a community thread
    const updatedUser: UserProfile = {
      ...user,
      xpPoints: user.xpPoints + 15
    };
    OfflineStorageService.saveProfile(updatedUser);
    onUpdateUser(updatedUser);

    setNewTitle('');
    setNewContent('');
    setShowNewThreadModal(false);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyContent.trim()) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      threadId: activeThread.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      content: replyContent.trim(),
      upvotes: 0,
      isTeacherAnswer: user.role === 'teacher',
      isAcceptedSolution: false,
      createdAt: 'Just now'
    };

    const updatedThreads = OfflineStorageService.addForumReply(activeThread.id, newReply);
    setThreads(updatedThreads);

    // Update current active thread view
    const current = updatedThreads.find(t => t.id === activeThread.id);
    if (current) setActiveThread(current);

    // Award +30 XP for helping a classmate or contributing to forum
    const updatedUser: UserProfile = {
      ...user,
      xpPoints: user.xpPoints + 30
    };
    OfflineStorageService.saveProfile(updatedUser);
    onUpdateUser(updatedUser);

    setReplyContent('');
  };

  const handleToggleUpvoteThread = (threadId: string) => {
    const updatedThreads = OfflineStorageService.toggleUpvoteThread(threadId);
    setThreads(updatedThreads);
    if (activeThread && activeThread.id === threadId) {
      const current = updatedThreads.find(t => t.id === threadId);
      if (current) setActiveThread(current);
    }
  };

  const handleToggleUpvoteReply = (threadId: string, replyId: string) => {
    const updatedThreads = OfflineStorageService.toggleUpvoteReply(threadId, replyId);
    setThreads(updatedThreads);
    if (activeThread && activeThread.id === threadId) {
      const current = updatedThreads.find(t => t.id === threadId);
      if (current) setActiveThread(current);
    }
  };

  // Filtering Logic
  const filteredThreads = threads
    .filter(t => {
      if (selectedCategory !== 'All Categories' && t.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'top') return b.upvotes - a.upvotes;
      if (sortBy === 'unanswered') return a.replyCount - b.replyCount;
      if (sortBy === 'solved') return (b.isSolved ? 1 : 0) - (a.isSolved ? 1 : 0);
      return 0; // Default latest
    });

  return (
    <div className="space-y-8 text-slate-100">
      {/* Forum Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/20 p-6 md:p-8 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Academy Knowledge Exchange</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
              Community Forum & Q&A
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect with fellow researchers, ask questions on course concepts, share project insights, and get verified guidance from academy faculty.
            </p>
          </div>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-cyan-500 to-teal-400 hover:from-indigo-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Ask Question (+15 XP)</span>
          </button>
        </div>
      </div>

      {/* Main Forum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Categories & Stats (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Categories</span>
            </h3>

            <div className="space-y-1">
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveThread(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gamification Helper Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Forum Rewards</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn XP by helping fellow students! Verified teacher answers and accepted solution badges boost your global leaderboard ranking.
            </p>
            <div className="pt-1 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Start Discussion</span>
                <span className="text-emerald-400 font-bold">+15 XP</span>
              </div>
              <div className="flex justify-between">
                <span>Post Answer</span>
                <span className="text-emerald-400 font-bold">+30 XP</span>
              </div>
              <div className="flex justify-between">
                <span>Accepted Solution</span>
                <span className="text-emerald-400 font-bold">+50 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Thread List OR Thread Detail (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {activeThread ? (
            /* THREAD DETAIL VIEW */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Back to List Button */}
              <button
                onClick={() => setActiveThread(null)}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Discussion Threads</span>
              </button>

              {/* Thread Main Card */}
              <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    {activeThread.category}
                  </span>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeThread.createdAt}</span>
                    </span>
                    {activeThread.isSolved && (
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white font-display">
                  {activeThread.title}
                </h2>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeThread.authorAvatar}
                      alt={activeThread.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-100">
                          {activeThread.authorName}
                        </span>
                        {activeThread.authorRole === 'teacher' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            <span>Instructor</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 capitalize">
                        {activeThread.authorRole} Learner
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleUpvoteThread(activeThread.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
                      activeThread.userUpvoted
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{activeThread.upvotes}</span>
                  </button>
                </div>

                {/* Content */}
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pt-2">
                  {activeThread.content}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                  {activeThread.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      <Tag className="w-3 h-3 text-indigo-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Replies Section */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Answers & Responses ({activeThread.replies?.length || 0})</span>
                </h3>

                <div className="space-y-4">
                  {activeThread.replies && activeThread.replies.length > 0 ? (
                    activeThread.replies.map(reply => (
                      <div
                        key={reply.id}
                        className={`p-6 rounded-2xl border space-y-4 ${
                          reply.isAcceptedSolution
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : reply.isTeacherAnswer
                            ? 'bg-amber-950/20 border-amber-500/30'
                            : 'bg-slate-900/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={reply.authorAvatar}
                              alt={reply.authorName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-100">
                                  {reply.authorName}
                                </span>
                                {reply.isTeacherAnswer && (
                                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                                    <span>Verified Instructor</span>
                                  </span>
                                )}
                                {reply.isAcceptedSolution && (
                                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>Accepted Solution</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">{reply.createdAt}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleUpvoteReply(activeThread.id, reply.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                              reply.userUpvoted
                                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{reply.upvotes}</span>
                          </button>
                        </div>

                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                      No answers yet. Be the first to answer and earn +30 XP!
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleAddReply} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Post Your Answer
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder="Provide a clear explanation or solution... Markdown is supported."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="py-2.5 px-5 rounded-xl font-bold text-xs bg-indigo-500 hover:bg-indigo-400 text-slate-950 transition-all flex items-center space-x-2 disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Response (+30 XP)</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            /* THREAD LIST VIEW */
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search threads or tags..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  {[
                    { id: 'latest', label: 'Latest' },
                    { id: 'top', label: 'Top Upvoted' },
                    { id: 'unanswered', label: 'Unanswered' },
                    { id: 'solved', label: 'Solved' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSortBy(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        sortBy === tab.id
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thread Cards */}
              <div className="space-y-3">
                {filteredThreads.length > 0 ? (
                  filteredThreads.map(thread => (
                    <motion.div
                      key={thread.id}
                      onClick={() => setActiveThread(thread)}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-800/40">
                          {thread.category}
                        </span>
                        <div className="flex items-center space-x-3 text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{thread.createdAt}</span>
                          </span>
                          {thread.isSolved && (
                            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Solved</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {thread.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                        <div className="flex items-center space-x-2">
                          <img
                            src={thread.authorAvatar}
                            alt={thread.authorName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-slate-300 font-medium">{thread.authorName}</span>
                          {thread.authorRole === 'teacher' && (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                              Instructor
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-slate-400">
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{thread.upvotes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                            <span>{thread.replyCount} replies</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
                    No discussion threads found in this category.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showNewThreadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Create New Discussion Thread</h3>
                </div>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Thread Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. How to implement quantum state superposition in TypeScript?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    >
                      {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tags (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={e => setNewTags(e.target.value)}
                      placeholder="e.g. Agents, TypeScript, Gemini"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question / Discussion Details
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Provide full context, code snippets, or specific questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadModal(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-slate-950 transition-all flex items-center space-x-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish Thread (+15 XP)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
