import { useState, useMemo } from 'react';
import { useTasksStore } from '../../stores/tasksStore';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { PRIORITY_COLORS } from '../../utils/constants';
import { TaskCard } from './TaskCard';

export function CalendarView() {
  const { tasks } = useTasksStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const result: Date[] = [];
    let day = start;
    while (day <= end) { result.push(day); day = addDays(day, 1); }
    return result;
  }, [currentMonth]);

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));
  }, [tasks, selectedDate]);

  const getTaskDots = (date: Date) => {
    return tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), date) && t.status !== 'done').slice(0, 3);
  };

  return (
    <div className="px-4 py-2 h-full overflow-y-auto pb-20 md:pb-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-sm font-semibold text-text-primary">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-text-muted py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day, i) => {
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const dots = getTaskDots(day);

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'calendar-day',
                !inMonth && 'opacity-30',
                today && !selected && 'today',
                selected && 'selected'
              )}
            >
              <span className="text-xs">{format(day, 'd')}</span>
              {dots.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dots.map((t, j) => (
                    <div key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[t.priority] }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day tasks */}
      {selectedDate && (
        <div>
          <h4 className="text-xs font-semibold text-text-secondary mb-2">{format(selectedDate, 'EEEE, MMMM d')}</h4>
          <div className="space-y-2">
            {selectedTasks.length > 0 ? selectedTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            )) : (
              <p className="text-xs text-text-muted text-center py-6">No tasks for this day</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
