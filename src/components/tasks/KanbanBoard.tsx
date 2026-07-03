import { useTasksStore } from '../../stores/tasksStore';
import { TaskCard } from './TaskCard';
import { TaskStatus } from '../../types';
import { cn } from '../../utils/cn';

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#8B949E' },
  { id: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'done', label: 'Done', color: '#10B981' },
];

export function KanbanBoard() {
  const { tasks, updateTask } = useTasksStore();

  return (
    <div className="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-hide h-full pb-20 md:pb-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="kanban-column min-w-[260px] flex-1">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-xs font-semibold text-text-primary">{col.label}</span>
              <span className="text-[10px] text-text-muted ml-auto">{colTasks.length}</span>
            </div>
            <div className="space-y-2 flex-1">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-text-muted text-xs rounded-lg border border-dashed border-white/[0.06]">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
