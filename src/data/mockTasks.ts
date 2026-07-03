import { Task } from '../types';

const today = () => {
  const d = new Date(); d.setHours(23,59,0,0); return d.toISOString();
};
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate()-n); d.setHours(12,0,0,0); return d.toISOString(); };
const daysFromNow = (n: number) => { const d = new Date(); d.setDate(d.getDate()+n); d.setHours(12,0,0,0); return d.toISOString(); };

export const initialTasks: Task[] = [
  {
    id: 't1', title: 'Finalize Q4 presentation deck', description: 'Add final revenue charts and executive summary slide', status: 'in-progress', priority: 'urgent', category: 'Work',
    dueDate: today(), dueTime: '14:00', subtasks: [
      { id: 'st1', title: 'Update revenue charts', completed: true },
      { id: 'st2', title: 'Write executive summary', completed: false },
      { id: 'st3', title: 'Add team photo slide', completed: true },
    ],
    recurring: 'none', reminders: ['1h'], createdAt: daysAgo(3), completedAt: null,
  },
  {
    id: 't2', title: 'Review pull request #247', description: 'Alex\'s auth module refactor needs code review', status: 'todo', priority: 'high', category: 'Work',
    dueDate: today(), dueTime: '16:00', subtasks: [], recurring: 'none', reminders: [], createdAt: daysAgo(1), completedAt: null,
  },
  {
    id: 't3', title: 'Grocery shopping', description: 'Buy vegetables, fruits, milk, and bread', status: 'todo', priority: 'medium', category: 'Personal',
    dueDate: today(), dueTime: '18:00', subtasks: [
      { id: 'st4', title: 'Vegetables & fruits', completed: false },
      { id: 'st5', title: 'Dairy products', completed: false },
    ],
    recurring: 'weekly', reminders: ['1h'], createdAt: daysAgo(1), completedAt: null,
  },
  {
    id: 't4', title: 'Morning yoga session', description: '30 minutes of stretching and meditation', status: 'done', priority: 'medium', category: 'Health',
    dueDate: today(), dueTime: '07:00', subtasks: [], recurring: 'daily', reminders: ['30m'], createdAt: daysAgo(30), completedAt: new Date().toISOString(),
  },
  {
    id: 't5', title: 'Update portfolio website', description: 'Add latest 3 projects and update bio section', status: 'todo', priority: 'low', category: 'Personal',
    dueDate: daysFromNow(3), dueTime: null, subtasks: [
      { id: 'st6', title: 'Screenshot new projects', completed: false },
      { id: 'st7', title: 'Write case studies', completed: false },
      { id: 'st8', title: 'Update bio and photo', completed: false },
    ],
    recurring: 'none', reminders: [], createdAt: daysAgo(5), completedAt: null,
  },
  {
    id: 't6', title: 'Pay electricity bill', description: 'Due amount: $142.50', status: 'todo', priority: 'high', category: 'Finance',
    dueDate: daysAgo(1), dueTime: null, subtasks: [], recurring: 'monthly', reminders: ['1d'], createdAt: daysAgo(7), completedAt: null,
  },
  {
    id: 't7', title: 'Read "System Design Interview" Ch. 5-7', description: 'Focus on distributed systems and caching patterns', status: 'in-progress', priority: 'medium', category: 'Learning',
    dueDate: daysFromNow(5), dueTime: null, subtasks: [
      { id: 'st9', title: 'Chapter 5: Design Consistent Hashing', completed: true },
      { id: 'st10', title: 'Chapter 6: Key-Value Store', completed: false },
      { id: 'st11', title: 'Chapter 7: Unique ID Generator', completed: false },
    ],
    recurring: 'none', reminders: [], createdAt: daysAgo(10), completedAt: null,
  },
  {
    id: 't8', title: 'Schedule dentist appointment', description: 'Regular 6-month checkup overdue', status: 'todo', priority: 'high', category: 'Health',
    dueDate: daysAgo(3), dueTime: null, subtasks: [], recurring: 'none', reminders: [], createdAt: daysAgo(14), completedAt: null,
  },
  {
    id: 't9', title: 'Prepare design system docs', description: 'Document all tokens, components, and usage guidelines', status: 'in-progress', priority: 'high', category: 'Work',
    dueDate: daysFromNow(2), dueTime: '12:00', subtasks: [], recurring: 'none', reminders: ['1d'], createdAt: daysAgo(4), completedAt: null,
  },
  {
    id: 't10', title: 'Call mom', description: 'Weekly catch-up call', status: 'done', priority: 'low', category: 'Personal',
    dueDate: daysAgo(1), dueTime: '19:00', subtasks: [], recurring: 'weekly', reminders: [], createdAt: daysAgo(7), completedAt: daysAgo(1),
  },
  {
    id: 't11', title: 'Complete TypeScript course module 8', description: 'Advanced generics and conditional types', status: 'done', priority: 'medium', category: 'Learning',
    dueDate: daysAgo(2), dueTime: null, subtasks: [], recurring: 'none', reminders: [], createdAt: daysAgo(8), completedAt: daysAgo(2),
  },
  {
    id: 't12', title: 'Fix mobile nav animation bug', description: 'Bottom sheet transition is janky on iOS Safari', status: 'done', priority: 'urgent', category: 'Work',
    dueDate: daysAgo(1), dueTime: null, subtasks: [], recurring: 'none', reminders: [], createdAt: daysAgo(3), completedAt: daysAgo(1),
  },
  {
    id: 't13', title: 'Write unit tests for task store', description: 'Ensure all actions and computed values are tested', status: 'done', priority: 'medium', category: 'Work',
    dueDate: daysAgo(2), dueTime: null, subtasks: [], recurring: 'none', reminders: [], createdAt: daysAgo(5), completedAt: daysAgo(2),
  },
  {
    id: 't14', title: 'Research new state management libs', description: 'Compare Zustand, Jotai, and Valtio for next project', status: 'done', priority: 'low', category: 'Learning',
    dueDate: daysAgo(4), dueTime: null, subtasks: [], recurring: 'none', reminders: [], createdAt: daysAgo(10), completedAt: daysAgo(4),
  },
  {
    id: 't15', title: 'Plan team offsite event', description: 'Book venue and send invites for next month', status: 'in-progress', priority: 'low', category: 'Work',
    dueDate: daysFromNow(14), dueTime: null, subtasks: [
      { id: 'st12', title: 'Research venues', completed: true },
      { id: 'st13', title: 'Get budget approval', completed: false },
      { id: 'st14', title: 'Send calendar invites', completed: false },
    ],
    recurring: 'none', reminders: ['1w'], createdAt: daysAgo(7), completedAt: null,
  },
];
