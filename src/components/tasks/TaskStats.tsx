import { useTasksStore } from '../../stores/tasksStore';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';

export function TaskStats() {
  const { tasks } = useTasksStore();
  const today = new Date().toDateString();
  const completedToday = tasks.filter((t) => t.completedAt && new Date(t.completedAt).toDateString() === today).length;
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length;
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done' && new Date(t.dueDate).toDateString() !== today).length;
  const pct = total > 0 ? (totalDone / total) * 100 : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="px-4 py-3 border-b border-white/[0.06]">
      {overdue > 0 && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-warning/10 border border-warning/20">
          <AlertTriangle size={14} className="text-warning" />
          <span className="text-xs text-warning">You have {overdue} overdue task{overdue > 1 ? 's' : ''}</span>
        </motion.div>
      )}
      <div className="flex items-center gap-4">
        <svg width="68" height="68" className="flex-shrink-0">
          <circle cx="34" cy="34" r={r} fill="none" stroke="#1C2333" strokeWidth="5" />
          <motion.circle
            cx="34" cy="34" r={r} fill="none" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            transform="rotate(-90 34 34)"
          />
          <text x="34" y="37" textAnchor="middle" className="text-xs font-bold fill-text-primary">{Math.round(pct)}%</text>
        </svg>
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{completedToday}</p>
            <p className="text-[10px] text-text-muted">Today</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">{totalDone}</p>
            <p className="text-[10px] text-text-muted">Done</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary flex items-center justify-center gap-1"><Flame size={14} className="text-warning" /> 3</p>
            <p className="text-[10px] text-text-muted">Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
