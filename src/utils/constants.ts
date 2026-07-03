export const CURRENT_USER_ID = 'user-self';

export const CURRENT_USER = {
  id: CURRENT_USER_ID,
  name: 'You',
  avatar: '',
  phone: '+1 (555) 000-0000',
  email: 'you@nexus.app',
  bio: 'Living the NEXUS life ✨',
  online: true,
};

export const TAB_LABELS = {
  chat: 'Chats',
  vault: 'Vault',
  notes: 'Notes',
  tasks: 'Tasks',
  assistant: 'Assistant',
} as const;

export const PRIORITY_COLORS = {
  low: '#8B949E',
  medium: '#3B82F6',
  high: '#F59E0B',
  urgent: '#F43F5E',
} as const;

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const;

export const NOTE_COLORS = [
  '#7C3AED',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
] as const;

export const CATEGORY_ICONS = {
  documents: '📄',
  images: '🖼️',
  videos: '🎬',
  others: '📦',
} as const;

export const TASK_CATEGORIES = [
  'Work',
  'Personal',
  'Health',
  'Finance',
  'Shopping',
  'Learning',
  'Social',
  'Other',
] as const;

export const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'] as const;
