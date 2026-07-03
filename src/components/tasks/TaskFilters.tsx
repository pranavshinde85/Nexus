import { TaskFilter } from '../../types';
import { useTasksStore } from '../../stores/tasksStore';
import { cn } from '../../utils/cn';

const filters: { id: TaskFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
];

export function TaskFilters() {
  const { tasks, activeFilter, setFilter } = useTasksStore();
  const today = new Date().toDateString();
  const counts: Record<string, number> = {
    all: tasks.length,
    today: tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === today && t.status !== 'done').length,
    upcoming: tasks.filter((t) => t.dueDate && new Date(t.dueDate) > new Date() && t.status !== 'done').length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done' && new Date(t.dueDate).toDateString() !== today).length,
    completed: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => setFilter(f.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
            activeFilter === f.id ? 'bg-violet text-white shadow-glow-sm' : 'bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
          )}
        >
          {f.label}
          <span className={cn('text-[10px] px-1 py-0 rounded-full min-w-[16px] text-center', activeFilter === f.id ? 'bg-white/20' : 'bg-white/[0.06]')}>
            {counts[f.id] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
