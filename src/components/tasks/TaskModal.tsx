import { useState, useEffect } from 'react';
import { useTasksStore } from '../../stores/tasksStore';
import { Task, Priority } from '../../types';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PRIORITY_COLORS, TASK_CATEGORIES } from '../../utils/constants';
import { nanoid } from 'nanoid';

interface TaskModalProps { isOpen: boolean; onClose: () => void; editTask?: Task; }

export function TaskModal({ isOpen, onClose, editTask }: TaskModalProps) {
  const { createTask, updateTask, deleteTask } = useTasksStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Work');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setDueDate(editTask.dueDate?.split('T')[0] || '');
      setDueTime(editTask.dueTime || '');
      setPriority(editTask.priority);
      setCategory(editTask.category);
      setRecurring(editTask.recurring);
      setSubtasks([...editTask.subtasks]);
    } else {
      setTitle(''); setDescription(''); setDueDate(''); setDueTime('');
      setPriority('medium'); setCategory('Work'); setRecurring('none'); setSubtasks([]);
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate + 'T12:00:00').toISOString() : null,
      dueTime: dueTime || null,
      priority,
      category,
      recurring,
      subtasks,
    };
    if (editTask) {
      updateTask(editTask.id, data);
    } else {
      createTask(data);
    }
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: nanoid(), title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-navy-800 rounded-t-2xl md:rounded-2xl overflow-hidden shadow-elevated border border-white/[0.06] max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-text-primary">{editTask ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title..." className="input-nexus py-3 text-sm font-medium" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="input-nexus py-2 text-sm resize-none h-16" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-nexus py-2 text-xs" />
            </div>
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">Time</label>
              <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="input-nexus py-2 text-xs" />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-text-muted mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                <button key={p} onClick={() => setPriority(p)} className={cn('flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all border', priority === p ? 'border-current' : 'border-transparent bg-white/[0.03]')} style={{ color: PRIORITY_COLORS[p], backgroundColor: priority === p ? PRIORITY_COLORS[p] + '15' : undefined }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-nexus py-2 text-xs">
                {TASK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">Recurring</label>
              <select value={recurring} onChange={(e) => setRecurring(e.target.value as any)} className="input-nexus py-2 text-xs">
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-text-muted mb-1.5 block">Subtasks</label>
            {subtasks.map((st) => (
              <div key={st.id} className="flex items-center gap-2 py-1">
                <button onClick={() => setSubtasks(subtasks.map(s => s.id === st.id ? { ...s, completed: !s.completed } : s))}>
                  {st.completed ? <CheckSquare size={14} className="text-violet" /> : <Square size={14} className="text-text-muted" />}
                </button>
                <span className={cn('text-xs flex-1', st.completed && 'line-through text-text-muted')}>{st.title}</span>
                <button onClick={() => setSubtasks(subtasks.filter(s => s.id !== st.id))} className="text-text-muted hover:text-danger"><Trash2 size={12} /></button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-1">
              <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubtask()} placeholder="Add subtask..." className="input-nexus py-1.5 text-xs flex-1" />
              <button onClick={addSubtask} className="p-1.5 rounded-lg text-violet hover:bg-violet/10"><Plus size={14} /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3 border-t border-white/[0.06]">
          {editTask && (
            <button onClick={() => { deleteTask(editTask.id); onClose(); }} className="px-4 py-2.5 rounded-xl text-danger text-sm hover:bg-danger/10 transition-colors">Delete</button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-text-secondary text-sm">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl gradient-violet text-white text-sm font-medium shadow-glow-sm">Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
