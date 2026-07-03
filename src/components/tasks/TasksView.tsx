import { useMemo } from 'react';
import { useTasksStore } from '../../stores/tasksStore';
import { TaskStats } from './TaskStats';
import { TaskFilters } from './TaskFilters';
import { TaskCard } from './TaskCard';
import { KanbanBoard } from './KanbanBoard';
import { CalendarView } from './CalendarView';
import { cn } from '../../utils/cn';
import { List, Columns3, CalendarDays } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { isOverdue } from '../../utils/formatters';

export function TasksView() {
  const { tasks, viewMode, setViewMode, activeFilter } = useTasksStore();

  const filteredTasks = useMemo(() => {
    const today = new Date().toDateString();
    switch (activeFilter) {
      case 'today':
        return tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === today && t.status !== 'done');
      case 'upcoming':
        return tasks.filter((t) => t.dueDate && new Date(t.dueDate) > new Date() && t.status !== 'done');
      case 'overdue':
        return tasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate));
      case 'completed':
        return tasks.filter((t) => t.status === 'done');
      default:
        return tasks.filter((t) => t.status !== 'done');
    }
  }, [tasks, activeFilter]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <TaskStats />

      {/* View switcher */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <TaskFilters />
        <div className="flex bg-navy-700 rounded-lg p-0.5 flex-shrink-0 ml-2">
          {[
            { id: 'list' as const, icon: List },
            { id: 'board' as const, icon: Columns3 },
            { id: 'calendar' as const, icon: CalendarDays },
          ].map((v) => (
            <button key={v.id} onClick={() => setViewMode(v.id)} className={cn('p-1.5 rounded-md transition-colors', viewMode === v.id ? 'bg-violet text-white' : 'text-text-muted')}>
              <v.icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto px-4 py-2 space-y-2 pb-20 md:pb-4">
              {filteredTasks.map((t) => <TaskCard key={t.id} task={t} />)}
              {filteredTasks.length === 0 && <p className="text-sm text-text-muted text-center py-12">No tasks match this filter</p>}
            </motion.div>
          )}
          {viewMode === 'board' && (
            <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-hidden">
              <KanbanBoard />
            </motion.div>
          )}
          {viewMode === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-hidden">
              <CalendarView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
