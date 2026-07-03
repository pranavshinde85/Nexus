// ============================================
// NEXUS — Tasks Store
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Task, TaskStatus, TaskView, TaskFilter, Priority, Subtask } from '../types';

interface TasksStore {
  tasks: Task[];
  viewMode: TaskView;
  activeFilter: TaskFilter;
  selectedDate: string | null;
  searchQuery: string;

  // Setters
  setTasks: (tasks: Task[]) => void;
  setViewMode: (mode: TaskView) => void;
  setFilter: (filter: TaskFilter) => void;
  setSelectedDate: (date: string | null) => void;
  setSearchQuery: (q: string) => void;

  // CRUD
  createTask: (partial: {
    title: string;
    description?: string;
    priority?: Priority;
    category?: string;
    dueDate?: string | null;
    dueTime?: string | null;
    recurring?: Task['recurring'];
    subtasks?: Subtask[];
  }) => string;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;

  // Actions
  toggleComplete: (id: string) => void;
  moveToStatus: (id: string, status: TaskStatus) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Computed helpers
  filteredTasks: () => Task[];
  todayTasks: () => Task[];
  overdueTasks: () => Task[];
  completedTasks: () => Task[];
  tasksByStatus: (status: TaskStatus) => Task[];
  streak: () => number;
}

// ── Date helpers ───────────────────────────────
const startOfDay = (d: Date): Date => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const isToday = (dateStr: string): boolean => {
  const d = startOfDay(new Date(dateStr));
  const now = startOfDay(new Date());
  return d.getTime() === now.getTime();
};

const isPast = (dateStr: string): boolean => {
  const d = startOfDay(new Date(dateStr));
  const now = startOfDay(new Date());
  return d.getTime() < now.getTime();
};

export const useTasksStore = create<TasksStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      viewMode: 'list',
      activeFilter: 'all',
      selectedDate: null,
      searchQuery: '',

      // ── Setters ──────────────────────────────────
      setTasks: (tasks) => set({ tasks }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setFilter: (filter) => set({ activeFilter: filter }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ── Create Task ──────────────────────────────
      createTask: (partial) => {
        const id = nanoid();
        const task: Task = {
          id,
          title: partial.title,
          description: partial.description ?? '',
          status: 'todo',
          priority: partial.priority ?? 'medium',
          category: partial.category ?? 'General',
          dueDate: partial.dueDate ?? null,
          dueTime: partial.dueTime ?? null,
          subtasks: partial.subtasks ?? [],
          recurring: partial.recurring ?? 'none',
          reminders: [],
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
        return id;
      },

      // ── Update Task ──────────────────────────────
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      // ── Delete Task ──────────────────────────────
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      // ── Toggle Complete ──────────────────────────
      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const isDone = t.status === 'done';
            return {
              ...t,
              status: isDone ? ('todo' as TaskStatus) : ('done' as TaskStatus),
              completedAt: isDone ? null : new Date().toISOString(),
            };
          }),
        })),

      // ── Move to Status ───────────────────────────
      moveToStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  completedAt:
                    status === 'done'
                      ? new Date().toISOString()
                      : status === 'todo' || status === 'in-progress'
                        ? null
                        : t.completedAt,
                }
              : t
          ),
        })),

      // ── Subtasks ─────────────────────────────────
      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [
                    ...t.subtasks,
                    { id: nanoid(), title, completed: false },
                  ],
                }
              : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st) =>
                    st.id === subtaskId
                      ? { ...st, completed: !st.completed }
                      : st
                  ),
                }
              : t
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
                }
              : t
          ),
        })),

      // ── Computed ─────────────────────────────────
      filteredTasks: () => {
        const { tasks, activeFilter, searchQuery, selectedDate } = get();
        let result = tasks;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }

        // Date filter
        if (selectedDate) {
          result = result.filter((t) => t.dueDate === selectedDate);
        }

        // Status filter
        switch (activeFilter) {
          case 'today':
            result = result.filter(
              (t) => t.dueDate && isToday(t.dueDate) && t.status !== 'done'
            );
            break;
          case 'upcoming':
            result = result.filter(
              (t) =>
                t.dueDate &&
                !isPast(t.dueDate) &&
                !isToday(t.dueDate) &&
                t.status !== 'done'
            );
            break;
          case 'overdue':
            result = result.filter(
              (t) => t.dueDate && isPast(t.dueDate) && t.status !== 'done'
            );
            break;
          case 'completed':
            result = result.filter((t) => t.status === 'done');
            break;
          default:
            break;
        }

        return result;
      },

      todayTasks: () => {
        const { tasks } = get();
        return tasks.filter(
          (t) => t.dueDate && isToday(t.dueDate) && t.status !== 'done'
        );
      },

      overdueTasks: () => {
        const { tasks } = get();
        return tasks.filter(
          (t) => t.dueDate && isPast(t.dueDate) && t.status !== 'done'
        );
      },

      completedTasks: () => {
        const { tasks } = get();
        return tasks.filter((t) => t.status === 'done');
      },

      tasksByStatus: (status) => {
        const { tasks } = get();
        return tasks.filter((t) => t.status === status);
      },

      // ── Streak Calculator ────────────────────────
      // Counts consecutive days (ending today or yesterday)
      // where at least one task was completed.
      streak: () => {
        const { tasks } = get();
        const completedDates = new Set<string>();
        tasks.forEach((t) => {
          if (t.completedAt) {
            completedDates.add(
              startOfDay(new Date(t.completedAt)).toISOString()
            );
          }
        });

        if (completedDates.size === 0) return 0;

        let current = startOfDay(new Date());
        // If nothing was completed today, start checking from yesterday
        if (!completedDates.has(current.toISOString())) {
          current.setDate(current.getDate() - 1);
          if (!completedDates.has(current.toISOString())) return 0;
        }

        let count = 0;
        while (completedDates.has(current.toISOString())) {
          count++;
          current.setDate(current.getDate() - 1);
        }

        return count;
      },
    }),
    { name: 'nexus-tasks' }
  )
);
