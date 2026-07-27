import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Tag,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Sparkles,
  Bookmark,
  Share2,
  Check,
  MessageSquare
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../services/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

export interface LessonNote {
  id: string;
  courseId: string;
  lessonId: string;
  sectionTitle: string;
  content: string;
  tag: 'Key Insight' | 'Exam Topic' | 'Question' | 'Summary' | 'General';
  authorName: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

interface RealtimeLessonAnnotatorProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  sections?: string[];
}

export const RealtimeLessonAnnotator: React.FC<RealtimeLessonAnnotatorProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  sections = ['General Lesson Overview', 'Core Concepts', 'Practical Application']
}) => {
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>(sections[0] || 'General Lesson Overview');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<LessonNote['tag']>('Key Insight');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeFilterTag, setActiveFilterTag] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentUserId = auth.currentUser?.uid || 'guest_student';
  const currentUserName = auth.currentUser?.displayName || 'Learner (You)';

  // Real-time Firestore Sync Effect
  useEffect(() => {
    const localStorageKey = `lmdpro_notes_${courseId}_${lessonId}`;

    // Load local cache initially
    try {
      const cached = localStorage.getItem(localStorageKey);
      if (cached) {
        setNotes(JSON.parse(cached));
      }
    } catch (e) {
      console.warn('Local note cache parse error:', e);
    }

    // Attach Firestore real-time listener if available
    let unsubscribe: () => void = () => {};

    try {
      const notesRef = collection(db, 'lessonNotes');
      const q = query(
        notesRef,
        where('courseId', '==', courseId),
        where('lessonId', '==', lessonId)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedNotes: LessonNote[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedNotes.push({
              id: docSnap.id,
              courseId: data.courseId,
              lessonId: data.lessonId,
              sectionTitle: data.sectionTitle || 'General',
              content: data.content || '',
              tag: data.tag || 'General',
              authorName: data.authorName || 'Learner',
              userId: data.userId || 'guest',
              createdAt: data.createdAt ? new Date(data.createdAt.seconds ? data.createdAt.seconds * 1000 : data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
            });
          });

          // Sort notes newest first
          fetchedNotes.sort((a, b) => (b.id > a.id ? 1 : -1));
          setNotes(fetchedNotes);
          setIsCloudSynced(true);
          localStorage.setItem(localStorageKey, JSON.stringify(fetchedNotes));
        },
        (error) => {
          console.warn('Firestore real-time note sync warning:', error);
          setIsCloudSynced(false);
        }
      );
    } catch (err) {
      console.warn('Firestore notes query unavailable, using local persistence:', err);
      setIsCloudSynced(false);
    }

    return () => unsubscribe();
  }, [courseId, lessonId]);

  // Add Note Handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsSaving(true);
    const noteId = `note-${Date.now()}`;
    const newNote: LessonNote = {
      id: noteId,
      courseId,
      lessonId,
      sectionTitle: selectedSection,
      content: newNoteContent.trim(),
      tag: selectedTag,
      authorName: currentUserName,
      userId: currentUserId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state & local storage immediately for zero-latency UX
    const updated = [newNote, ...notes];
    setNotes(updated);
    const localStorageKey = `lmdpro_notes_${courseId}_${lessonId}`;
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setNewNoteContent('');

    // Persist to Cloud Firestore
    try {
      const noteDocRef = doc(db, 'lessonNotes', noteId);
      await setDoc(noteDocRef, {
        ...newNote,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsCloudSynced(true);
    } catch (err) {
      console.warn('Cloud sync save offline fallback:', err);
      setIsCloudSynced(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Note Handler
  const handleDeleteNote = async (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    const localStorageKey = `lmdpro_notes_${courseId}_${lessonId}`;
    localStorage.setItem(localStorageKey, JSON.stringify(filtered));

    try {
      const noteDocRef = doc(db, 'lessonNotes', id);
      await deleteDoc(noteDocRef);
    } catch (err) {
      console.warn('Delete cloud note fallback:', err);
    }
  };

  const handleCopyNote = (note: LessonNote) => {
    const textToCopy = `[${note.sectionTitle} - ${note.tag}] ${note.content} (by ${note.authorName})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = activeFilterTag === 'All'
    ? notes
    : notes.filter((n) => n.tag === activeFilterTag || n.sectionTitle === activeFilterTag);

  return (
    <div className="rounded-2xl bg-[#08151c] border border-[#163647] p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header with Cloud Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#143242] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              Real-Time Cloud Lesson Notes
            </h3>
            <p className="text-[11px] text-[#63879a]">
              Annotate <span className="text-cyan-300 font-semibold">{lessonTitle}</span> & sync across devices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
            isCloudSynced
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
          }`}>
            {isCloudSynced ? (
              <>
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Firestore Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Local Offline Cache</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Note Creation Form */}
      <form onSubmit={handleAddNote} className="space-y-3 bg-[#040e13] p-3.5 rounded-xl border border-[#13303f]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Section Selector */}
          <div>
            <label className="text-[10px] font-bold text-[#63879a] uppercase tracking-wider block mb-1">
              Annotate Section:
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {sections.map((sec, idx) => (
                <option key={idx} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Selector */}
          <div>
            <label className="text-[10px] font-bold text-[#63879a] uppercase tracking-wider block mb-1">
              Note Category Tag:
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value as LessonNote['tag'])}
              className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="Key Insight">💡 Key Insight</option>
              <option value="Exam Topic">🎯 Exam Topic</option>
              <option value="Question">❓ Question / Doubt</option>
              <option value="Summary">📝 Summary Note</option>
              <option value="General">📌 General</option>
            </select>
          </div>
        </div>

        {/* Note Content Text Area */}
        <textarea
          rows={2}
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder={`Type note annotation for "${selectedSection}"...`}
          className="w-full bg-[#07151d] border border-[#183c50] rounded-xl p-2.5 text-xs text-white placeholder-[#537688] focus:outline-none focus:border-cyan-400 resize-none"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="text-[10px] text-[#55788a] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Annotating as: <strong className="text-gray-200">{currentUserName}</strong></span>
          </div>

          <button
            type="submit"
            disabled={isSaving || !newNoteContent.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Save Cloud Note</span>
          </button>
        </div>
      </form>

      {/* Filter Chips */}
      {notes.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[#55788a] font-semibold text-[10px] uppercase shrink-0">Filter:</span>
          {['All', 'Key Insight', 'Exam Topic', 'Question', 'Summary'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilterTag(tag)}
              className={`px-2 py-0.5 rounded-lg border shrink-0 transition-all ${
                activeFilterTag === tag
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-[#040e13] text-[#63879a] border-[#13303f] hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Note Cards List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filteredNotes.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#040d12] border border-[#112733] text-center text-xs text-[#55788a]">
            No notes added for this lesson yet. Type an annotation above to get started!
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-xl bg-[#061219] border border-[#143242] space-y-1.5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                    note.tag === 'Exam Topic'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      : note.tag === 'Key Insight'
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                      : note.tag === 'Question'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {note.tag}
                  </span>
                  <span className="text-[#688ca0] font-medium truncate max-w-[160px]">
                    {note.sectionTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#4d6d7e] font-mono">{note.createdAt}</span>
                  <button
                    onClick={() => handleCopyNote(note)}
                    className="p-1 text-[#55788a] hover:text-cyan-300 transition-colors"
                    title="Copy Note Text"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-[#55788a] hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">
                {note.content}
              </p>

              <div className="text-[10px] text-[#4d6d7e] font-sans pt-1 border-t border-[#0e232f]">
                By <strong className="text-[#7298ab]">{note.authorName}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
