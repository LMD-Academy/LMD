import React, { useState, useEffect } from 'react';
import {
  ListTodo,
  CheckSquare,
  Square,
  Plus,
  GripVertical,
  Trash2,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Tag,
  X,
  AlertCircle,
  Zap
} from 'lucide-react';
import { getAccessToken, googleSignIn, initAuth } from '../services/firebase';
import { WorkspaceService, GoogleTask } from '../services/workspace';

export interface LocalTaskItem extends GoogleTask {
  subject?: string;
  priority?: 'High' | 'Medium' | 'Low';
  isLocalOnly?: boolean;
}

export const GoogleTasksWidget: React.FC = () => {
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Pre-populated task list (draggable and interactive)
  const [tasks, setTasks] = useState<LocalTaskItem[]>([
    {
      id: 'task-1',
      title: 'Submit Deep Learning Capstone Proposal',
      notes: 'Include multi-agent swarm architecture diagram and loss curves.',
      status: 'needsAction',
      due: new Date(Date.now() + 86400000 * 2).toISOString(), // in 2 days
      subject: 'AI & Swarms',
      priority: 'High',
      isLocalOnly: true
    },
    {
      id: 'task-2',
      title: 'Review Quantum Circuits Lecture Notes',
      notes: 'Focus on Shor algorithm and Grover search complexity bounds.',
      status: 'needsAction',
      due: new Date(Date.now() + 86400000 * 3).toISOString(),
      subject: 'Quantum Physics',
      priority: 'Medium',
      isLocalOnly: true
    },
    {
      id: 'task-3',
      title: 'Complete Distributed Systems Consensus Lab',
      notes: 'Run Raft node failure scenario benchmarks.',
      status: 'needsAction',
      due: new Date(Date.now() + 86400000 * 5).toISOString(),
      subject: 'Computer Science',
      priority: 'High',
      isLocalOnly: true
    },
    {
      id: 'task-4',
      title: 'Schedule Socratic AI Tutor Mock Session',
      notes: 'Prepare 5 tricky edge cases for prompt evaluation.',
      status: 'completed',
      due: new Date(Date.now() - 86400000).toISOString(),
      subject: 'GenAI Studio',
      priority: 'Low',
      isLocalOnly: true
    }
  ]);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // New task form modal / collapse
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newSubject, setNewSubject] = useState('Core Course');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    const unsubscribe = initAuth((_user, token) => {
      if (token) {
        setAccessTokenState(token);
        loadGoogleTasks(token);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadGoogleTasks = async (tokenStr?: string) => {
    const token = tokenStr || accessToken || getAccessToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const liveTasks = await WorkspaceService.fetchTasks(token);
      if (liveTasks && liveTasks.length > 0) {
        // Map Google Tasks into local format preserving priority/subject defaults
        const mapped: LocalTaskItem[] = liveTasks.map((t) => ({
          ...t,
          subject: 'Google Task',
          priority: 'Medium',
          isLocalOnly: false
        }));
        setTasks(mapped);
        setStatusMsg('Loaded live tasks from Google Tasks!');
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setIsLoading(true);
      const res = await googleSignIn();
      if (res && res.accessToken) {
        setAccessTokenState(res.accessToken);
        loadGoogleTasks(res.accessToken);
      }
    } catch (e) {
      console.error('Google Sign-in error:', e);
      setStatusMsg('Auth failed or cancelled.');
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'needsAction' : 'completed';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const token = accessToken || getAccessToken();
    if (token && !task.isLocalOnly) {
      await WorkspaceService.updateTask(token, taskId, { status: newStatus });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const token = accessToken || getAccessToken();
    if (token && task && !task.isLocalOnly) {
      await WorkspaceService.deleteTask(token, taskId);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const token = accessToken || getAccessToken();

    let createdTask: GoogleTask | null = null;
    if (token) {
      createdTask = await WorkspaceService.createTask(
        token,
        newTitle,
        newNotes,
        newDueDate ? new Date(newDueDate).toISOString() : undefined
      );
    }

    const newTaskItem: LocalTaskItem = {
      id: createdTask?.id || 'local-task-' + Date.now(),
      title: newTitle,
      notes: newNotes,
      status: 'needsAction',
      due: newDueDate ? new Date(newDueDate).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      subject: newSubject || 'General',
      priority: newPriority,
      isLocalOnly: !createdTask
    };

    setTasks((prev) => [newTaskItem, ...prev]);

    setNewTitle('');
    setNewNotes('');
    setNewDueDate('');
    setIsAddingTask(false);

    setStatusMsg('Task created successfully!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...tasks];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setTasks(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'upcoming') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="rounded-3xl bg-[#081720] border border-[#1b3e52] p-5 shadow-2xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#163a4d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-tight">Upcoming Google Tasks</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                Draggable
              </span>
            </div>
            <p className="text-xs text-[#7398ab]">
              {pendingCount} pending task{pendingCount !== 1 ? 's' : ''} • {completedCount} completed
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {accessToken ? (
            <button
              onClick={() => loadGoogleTasks()}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#0d2532] hover:bg-[#143447] text-[#81a6ba] hover:text-cyan-300 border border-[#1b3d52] transition-all"
              title="Refresh Google Tasks"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          ) : (
            <button
              onClick={handleConnectGoogle}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Connect Google Tasks API"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Connect Google Tasks</span>
            </button>
          )}

          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 hover:bg-cyan-400 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-[#81a6ba] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 bg-[#041118] p-1 rounded-xl border border-[#133243]">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === 'upcoming'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-[#6e92a4] hover:text-white'
            }`}
          >
            Upcoming ({pendingCount})
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-[#6e92a4] hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-[#6e92a4] hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <span className="text-[10px] text-[#5e8194] hidden sm:block italic">
          💡 Tip: Drag handles to prioritize tasks
        </span>
      </div>

      {/* Quick Add Form Panel */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-[#041219] border border-[#193d52] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#143245]">
            <h4 className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Create New Google Task</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-[#6d91a3] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task Title (e.g. Finish Swarm Optimization Assignment)"
              className="w-full px-3 py-2 rounded-xl bg-[#091d28] border border-[#18394c] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />

            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Notes or checklist details..."
              className="w-full px-3 py-2 rounded-xl bg-[#091d28] border border-[#18394c] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#6d91a3] font-bold block mb-1">Subject / Tag</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#091d28] border border-[#18394c] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#6d91a3] font-bold block mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#091d28] border border-[#18394c] text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#6d91a3] font-bold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#091d28] border border-[#18394c] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#6d91a3] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all"
            >
              Save to Google Tasks
            </button>
          </div>
        </form>
      )}

      {/* Draggable Task List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#041117] border border-dashed border-[#17374a] text-xs text-[#628597] space-y-2">
            <ListTodo className="w-8 h-8 mx-auto text-[#2b5368]" />
            <p>No tasks match the selected filter.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isCompleted = task.status === 'completed';
            const isBeingDragged = draggedIndex === index;
            const isOver = dragOverIndex === index;

            const priorityColor =
              task.priority === 'High'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : task.priority === 'Low'
                ? 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

            return (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 group ${
                  isBeingDragged
                    ? 'opacity-40 bg-[#091f2c] border-cyan-400 scale-[0.98]'
                    : isOver
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : isCompleted
                    ? 'bg-[#040e13] border-[#102733] opacity-60'
                    : 'bg-[#05141c] hover:bg-[#091f2c] border-[#153648] shadow-md'
                }`}
              >
                {/* Drag Handle */}
                <div
                  className="cursor-grab active:cursor-grabbing text-[#3d6377] hover:text-cyan-400 transition-colors"
                  title="Drag to reorder task priority"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Checkbox Toggle */}
                <button
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className="text-cyan-400 hover:scale-110 transition-transform focus:outline-none"
                  title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                >
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Square className="w-5 h-5 text-[#4e7488] hover:text-cyan-300" />
                  )}
                </button>

                {/* Task Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-xs font-bold truncate transition-all ${
                        isCompleted ? 'line-through text-[#5f8194]' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.subject && (
                      <span className="px-2 py-0.5 rounded-md bg-[#0a2330] text-[10px] text-cyan-300 font-mono border border-cyan-500/20">
                        {task.subject}
                      </span>
                    )}

                    {task.priority && (
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${priorityColor}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>

                  {task.notes && (
                    <p className="text-[11px] text-[#7196a8] line-clamp-1">{task.notes}</p>
                  )}

                  {task.due && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#52788c]">
                      <Calendar className="w-3 h-3 text-cyan-500/70" />
                      <span>Due: {new Date(task.due).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-[#557a8f] hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link to Google Tasks */}
      <div className="pt-2 border-t border-[#133243] flex items-center justify-between text-[11px] text-[#638799]">
        <span>Google Workspace Integration</span>
        <a
          href="https://tasks.google.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-cyan-400 hover:underline font-bold"
        >
          <span>Open Google Tasks Web</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
