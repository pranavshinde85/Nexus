// ============================================
// NEXUS — Chat Store (Zustand)
// ============================================
import { create } from 'zustand';
import { Chat, Message, Status } from '../types';

const CURRENT_USER_ID = 'user-self';

// ── Helpers ──────────────────────────────────
const now = new Date();
const minutesAgo = (n: number) => new Date(now.getTime() - n * 60000).toISOString();
const hoursAgo = (n: number) => new Date(now.getTime() - n * 3600000).toISOString();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

let _msgCounter = 0;
const uid = () => `msg-${++_msgCounter}-${Math.random().toString(36).slice(2, 6)}`;

const msg = (
  chatId: string,
  senderId: string,
  content: string,
  timestamp: string,
  overrides: Partial<Message> = {},
): Message => ({
  id: uid(),
  chatId,
  senderId,
  type: 'text',
  content,
  timestamp,
  read: senderId === CURRENT_USER_ID,
  delivered: true,
  reactions: [],
  ...overrides,
});

// ── Mock Chats ───────────────────────────────
const mockChats: Chat[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    avatar: '👩‍💻',
    isGroup: false,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u1', name: 'Sarah Chen', avatar: '👩‍💻', online: true },
    ],
    messages: [
      msg('c1', 'u1', 'Hey! Have you seen the new design specs?', daysAgo(1)),
      msg('c1', CURRENT_USER_ID, 'Not yet, can you share them?', daysAgo(1)),
      msg('c1', 'u1', 'Sure! I\'ll send them over now 📎', hoursAgo(5)),
      msg('c1', 'u1', 'design-specs-v2.png', hoursAgo(5), { type: 'image' }),
      msg('c1', CURRENT_USER_ID, 'These look amazing! Love the new color palette 🎨', hoursAgo(4), { read: true }),
      msg('c1', 'u1', 'Thanks! The gradient system is the key improvement', hoursAgo(3)),
      msg('c1', CURRENT_USER_ID, 'Can we hop on a call to discuss the animations?', hoursAgo(2), { read: true }),
      msg('c1', 'u1', 'Absolutely! How about 3pm?', minutesAgo(45)),
      msg('c1', CURRENT_USER_ID, 'Perfect, I\'ll set up the meeting', minutesAgo(30), { read: true }),
      msg('c1', 'u1', 'Great, talk to you then! 🚀', minutesAgo(15), {
        reactions: [{ emoji: '👍', userId: CURRENT_USER_ID }],
      }),
    ],
    lastMessage: undefined,
    unreadCount: 2,
    pinned: true,
    archived: false,
    muted: false,
    typing: false,
    online: true,
    isEncrypted: true,
  },
  {
    id: 'c2',
    name: 'Marcus Johnson',
    avatar: '👨‍🎨',
    isGroup: false,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u2', name: 'Marcus Johnson', avatar: '👨‍🎨' },
    ],
    messages: [
      msg('c2', CURRENT_USER_ID, 'How\'s the illustration going?', hoursAgo(8)),
      msg('c2', 'u2', 'Almost done! Working on the final touches', hoursAgo(7)),
      msg('c2', 'u2', 'Voice message', hoursAgo(6), { type: 'voice', duration: 34 }),
      msg('c2', CURRENT_USER_ID, 'That sounds great!', hoursAgo(5), { read: false, delivered: true }),
    ],
    lastMessage: undefined,
    unreadCount: 0,
    pinned: false,
    archived: false,
    muted: false,
    typing: false,
    online: false,
    lastSeen: hoursAgo(1),
    isEncrypted: true,
  },
  {
    id: 'c3',
    name: 'Elena Volkov',
    avatar: '🧑‍🔬',
    isGroup: false,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u3', name: 'Elena Volkov', avatar: '🧑‍🔬', online: true },
    ],
    messages: [
      msg('c3', 'u3', 'The experiment results are in!', hoursAgo(2)),
      msg('c3', 'u3', 'results_q2_2026.pdf', hoursAgo(2), {
        type: 'file',
        fileName: 'results_q2_2026.pdf',
        fileSize: '2.4 MB',
      }),
      msg('c3', CURRENT_USER_ID, 'Downloading now, thanks!', hoursAgo(1), { read: true }),
      msg('c3', 'u3', 'Let me know if you have questions 🔬', minutesAgo(20)),
    ],
    lastMessage: undefined,
    unreadCount: 1,
    pinned: true,
    archived: false,
    muted: false,
    typing: true,
    online: true,
    isEncrypted: true,
  },
  {
    id: 'c4',
    name: 'Raj Patel',
    avatar: '👨‍💼',
    isGroup: false,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u4', name: 'Raj Patel', avatar: '👨‍💼' },
    ],
    messages: [
      msg('c4', 'u4', 'Meeting moved to Thursday', daysAgo(2)),
      msg('c4', CURRENT_USER_ID, 'Got it, thanks for the heads up', daysAgo(2), { read: false, delivered: true }),
      msg('c4', 'u4', 'Conference Room B, Floor 3', daysAgo(1), { type: 'location' }),
      msg('c4', 'u4', 'Here\'s the location for Thursday\'s meeting', daysAgo(1)),
    ],
    lastMessage: undefined,
    unreadCount: 2,
    pinned: false,
    archived: false,
    muted: true,
    typing: false,
    online: false,
    lastSeen: hoursAgo(3),
    isEncrypted: true,
  },
  {
    id: 'c5',
    name: 'Aisha Kamara',
    avatar: '👩‍🎤',
    isGroup: false,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u5', name: 'Aisha Kamara', avatar: '👩‍🎤', online: true },
    ],
    messages: [
      msg('c5', 'u5', 'Check out this new track I produced! 🎵', hoursAgo(12)),
      msg('c5', CURRENT_USER_ID, 'Playing it now...', hoursAgo(11), { read: true }),
      msg('c5', CURRENT_USER_ID, 'This is fire! 🔥🔥🔥', hoursAgo(11), {
        read: true,
        reactions: [{ emoji: '❤️', userId: 'u5' }],
      }),
      msg('c5', 'u5', "Haha thanks! I'll send you the full album when it's ready", hoursAgo(10)),
    ],
    lastMessage: undefined,
    unreadCount: 0,
    pinned: false,
    archived: false,
    muted: false,
    typing: false,
    online: true,
    isEncrypted: true,
  },
  {
    id: 'c6',
    name: 'Design Team',
    avatar: '🎨',
    isGroup: true,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u1', name: 'Sarah Chen', avatar: '👩‍💻', online: true },
      { id: 'u2', name: 'Marcus Johnson', avatar: '👨‍🎨' },
      { id: 'u5', name: 'Aisha Kamara', avatar: '👩‍🎤', online: true },
    ],
    messages: [
      msg('c6', 'u1', 'Sprint review at 4pm today', hoursAgo(6)),
      msg('c6', 'u2', 'Will the new mockups be ready?', hoursAgo(5)),
      msg('c6', CURRENT_USER_ID, 'Yes, uploading them now', hoursAgo(4), { read: true }),
      msg('c6', 'u5', 'Amazing work everyone! 🎉', hoursAgo(3), {
        reactions: [
          { emoji: '🙏', userId: CURRENT_USER_ID },
          { emoji: '❤️', userId: 'u1' },
        ],
      }),
      msg('c6', 'u1', "Let's ship it! 🚀", minutesAgo(90)),
    ],
    lastMessage: undefined,
    unreadCount: 3,
    pinned: false,
    archived: false,
    muted: false,
    typing: false,
    online: false,
    isEncrypted: true,
  },
  {
    id: 'c7',
    name: 'Dev Squad',
    avatar: '💻',
    isGroup: true,
    participants: [
      { id: CURRENT_USER_ID, name: 'You', avatar: '😎', online: true },
      { id: 'u3', name: 'Elena Volkov', avatar: '🧑‍🔬', online: true },
      { id: 'u4', name: 'Raj Patel', avatar: '👨‍💼' },
    ],
    messages: [
      msg('c7', 'u4', 'CI pipeline is green ✅', hoursAgo(24)),
      msg('c7', 'u3', 'Deployed to staging successfully', hoursAgo(20)),
      msg('c7', CURRENT_USER_ID, 'Running smoke tests now', hoursAgo(18), { read: true }),
    ],
    lastMessage: undefined,
    unreadCount: 0,
    pinned: false,
    archived: false,
    muted: true,
    typing: false,
    online: false,
    isEncrypted: true,
  },
];

// Set lastMessage for every chat
mockChats.forEach((c) => {
  if (c.messages.length) c.lastMessage = c.messages[c.messages.length - 1];
});

// ── Mock Statuses ────────────────────────────
const mockStatuses: Status[] = [
  { id: 's1', userId: CURRENT_USER_ID, userName: 'Your status', avatar: '😎', content: '', timestamp: hoursAgo(1), viewed: true },
  { id: 's2', userId: 'u1', userName: 'Sarah Chen', avatar: '👩‍💻', content: 'Working on new designs 🎨', timestamp: minutesAgo(30), viewed: false },
  { id: 's3', userId: 'u3', userName: 'Elena Volkov', avatar: '🧑‍🔬', content: 'Lab day! 🔬', timestamp: hoursAgo(2), viewed: false },
  { id: 's4', userId: 'u5', userName: 'Aisha Kamara', avatar: '👩‍🎤', content: 'Studio vibes 🎵', timestamp: hoursAgo(4), viewed: true },
  { id: 's5', userId: 'u2', userName: 'Marcus Johnson', avatar: '👨‍🎨', content: 'New art drop coming 🖼️', timestamp: hoursAgo(6), viewed: false },
  { id: 's6', userId: 'u4', userName: 'Raj Patel', avatar: '👨‍💼', content: 'Conference prep 📊', timestamp: hoursAgo(8), viewed: true },
];

// ── Store Interface ──────────────────────────
interface ChatStore {
  chats: Chat[];
  statuses: Status[];
  activeChatId: string | null;
  searchQuery: string;
  replyingTo: Message | null;
  isRecording: boolean;
  recordingDuration: number;

  // Setters
  setActiveChat: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setReplyingTo: (msg: Message | null) => void;
  setIsRecording: (v: boolean) => void;
  setRecordingDuration: (d: number) => void;

  // Chat actions
  sendMessage: (
    chatId: string,
    content: string,
    type?: Message['type'],
    extra?: Partial<Message>,
  ) => void;
  deleteChat: (id: string) => void;
  pinChat: (id: string) => void;
  archiveChat: (id: string) => void;
  muteChat: (id: string) => void;
  addReaction: (chatId: string, messageId: string, emoji: string) => void;
  markAsRead: (chatId: string) => void;

  // Computed helpers
  filteredChats: () => Chat[];
  activeChat: () => Chat | undefined;
}

// ── Create Store ─────────────────────────────
export const useChatStore = create<ChatStore>()((set, get) => ({
  chats: mockChats,
  statuses: mockStatuses,
  activeChatId: null,
  searchQuery: '',
  replyingTo: null,
  isRecording: false,
  recordingDuration: 0,

  // ── Setters ──────────────────────────────
  setActiveChat: (id) => {
    set({ activeChatId: id, replyingTo: null });
    if (id) get().markAsRead(id);
  },
  setSearchQuery: (q) => set({ searchQuery: q }),
  setReplyingTo: (m) => set({ replyingTo: m }),
  setIsRecording: (v) => set({ isRecording: v }),
  setRecordingDuration: (d) => set({ recordingDuration: d }),

  // ── Send Message ─────────────────────────
  sendMessage: (chatId, content, type = 'text', extra = {}) => {
    const replyTo = get().replyingTo;
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      chatId,
      senderId: CURRENT_USER_ID,
      type,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      delivered: true,
      reactions: [],
      ...(replyTo ? { replyTo: replyTo.id } : {}),
      ...extra,
    };

    set((state) => ({
      replyingTo: null,
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
            }
          : chat,
      ),
    }));
  },

  // ── Delete Chat ──────────────────────────
  deleteChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== id),
      activeChatId: state.activeChatId === id ? null : state.activeChatId,
    })),

  // ── Pin / Unpin ──────────────────────────
  pinChat: (id) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c,
      ),
    })),

  // ── Archive / Unarchive ──────────────────
  archiveChat: (id) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, archived: !c.archived } : c,
      ),
    })),

  // ── Mute / Unmute ────────────────────────
  muteChat: (id) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, muted: !c.muted } : c,
      ),
    })),

  // ── Add Reaction (toggle) ────────────────
  addReaction: (chatId, messageId, emoji) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((m) => {
                if (m.id !== messageId) return m;
                const exists = m.reactions.find(
                  (r) => r.emoji === emoji && r.userId === CURRENT_USER_ID,
                );
                return {
                  ...m,
                  reactions: exists
                    ? m.reactions.filter(
                        (r) => !(r.emoji === emoji && r.userId === CURRENT_USER_ID),
                      )
                    : [...m.reactions, { emoji, userId: CURRENT_USER_ID }],
                };
              }),
            }
          : chat,
      ),
    })),

  // ── Mark as Read ─────────────────────────
  markAsRead: (chatId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              unreadCount: 0,
              messages: chat.messages.map((m) => ({ ...m, read: true })),
            }
          : chat,
      ),
    })),

  // ── Computed ─────────────────────────────
  filteredChats: () => {
    const { chats, searchQuery } = get();
    if (!searchQuery.trim()) return chats.filter((c) => !c.archived);
    const q = searchQuery.toLowerCase();
    return chats.filter(
      (c) =>
        !c.archived &&
        (c.name.toLowerCase().includes(q) ||
          c.lastMessage?.content.toLowerCase().includes(q)),
    );
  },

  activeChat: () => {
    const { chats, activeChatId } = get();
    return chats.find((c) => c.id === activeChatId);
  },
}));
