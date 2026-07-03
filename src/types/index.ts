// ============================================
// NEXUS — Type Definitions
// ============================================

// --- Common ---
export type ThemeMode = 'dark' | 'light' | 'system';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskView = 'list' | 'board' | 'calendar';
export type TaskFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';
export type VaultCategory = 'all' | 'documents' | 'images' | 'videos' | 'others';
export type VaultViewMode = 'grid' | 'list';
export type NoteType = 'text' | 'checklist' | 'voice' | 'sketch';
export type MessageType = 'text' | 'image' | 'voice' | 'file' | 'location';
export type ActiveTab = 'chat' | 'vault' | 'notes' | 'tasks' | 'assistant';

// --- User ---
export interface User {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  bio?: string;
  online?: boolean;
  lastSeen?: string;
}

// --- Messaging ---
export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  timestamp: string;
  read: boolean;
  delivered: boolean;
  replyTo?: string;
  reactions: Reaction[];
  fileName?: string;
  fileSize?: string;
  duration?: number; // voice note seconds
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  pinned: boolean;
  archived: boolean;
  muted: boolean;
  typing?: boolean;
  online?: boolean;
  lastSeen?: string;
  isEncrypted: boolean;
}

export interface Status {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: string;
  viewed: boolean;
}

// --- Vault ---
export interface VaultFile {
  id: string;
  name: string;
  type: string; // mime type
  category: VaultCategory;
  size: number; // bytes
  thumbnail?: string;
  dateUploaded: string;
  tags: string[];
  starred: boolean;
  folderId: string | null;
  secure: boolean;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children: string[]; // folder IDs
  fileCount: number;
  color?: string;
}

// --- Notes ---
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  coverColor: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  checklist?: ChecklistItem[];
  sketchData?: string; // base64 canvas data
}

// --- Tasks ---
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate: string | null;
  dueTime: string | null;
  subtasks: Subtask[];
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  reminders: string[];
  createdAt: string;
  completedAt: string | null;
  streak?: number;
}

// --- AI Assistant ---
export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

// --- App State ---
export interface AppState {
  activeTab: ActiveTab;
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  isOnboarded: boolean;
  apiKey: string;
}
