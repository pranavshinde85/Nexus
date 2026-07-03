import { Task } from '../../types';
import { useTasksStore } from '../../stores/tasksStore';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, ChevronRight, RotateCcw } from 'lucide-react';
import { formatDueDate, isOverdue } from '../../utils/formatters';
import { PRIORITY_COLORS } from '../../utils/constants';

interface TaskCardProps { task: Task; onClick?: () => void; }

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { toggleComplete } = useTasksStore();
  const done = task.status === 'done';
  const overdue = !done && isOverdue(task.dueDate);
  const completedSubs = task.subtasks.filter((s) => s.completed).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn('flex items-start gap-3 px-4 py-3 rounded-xl bg-surface border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group')}
      style={{ borderLeftColor: PRIORITY_COLORS[task.priority], borderLeftWidth: '3px' }}
      onClick={onClick}
    >
      <button
        onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
        className="mt-0.5 flex-shrink-0"
      >
        <motion.div whileTap={{ scale: 0.8 }}>
          {done ? (
            <CheckCircle2 size={20} className="text-violet fill-violet/20" />
          ) : (
            <Circle size={20} className="text-text-muted group-hover:text-violet transition-colors" />
          )}
        </motion.div>
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', done ? 'text-text-muted line-through' : 'text-text-primary')}>{task.title}</p>
        {task.description && <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{task.description}</p>}

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {task.dueDate && (
            <span className={cn('flex items-center gap-1 text-[11px]', overdue ? 'text-danger' : 'text-text-muted')}>
              <Calendar size={10} />
              {formatDueDate(task.dueDate)}
              {task.dueTime && ` ${task.dueTime}`}
            </span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[task.priority] + '20', color: PRIORITY_COLORS[task.priority] }}>
            {task.priority}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-text-muted">{task.category}</span>
          {task.recurring !== 'none' && <RotateCcw size={10} className="text-text-muted" />}
          {task.subtasks.length > 0 && (
            <span className="text-[10px] text-text-muted">{completedSubs}/{task.subtasks.length} subtasks</span>
          )}
        </div>
      </div>

      <ChevronRight size={16} className="text-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </motion.div>
  );
}
