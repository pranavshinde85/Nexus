import { Chat, Status } from '../types';

const USER_SELF = 'user-self';

export const initialStatuses: Status[] = [
  { id: 's1', userId: 'u2', userName: 'Priya', avatar: '👩‍💼', content: 'Working from Bali! 🌴', timestamp: new Date(Date.now() - 3600000).toISOString(), viewed: false },
  { id: 's2', userId: 'u3', userName: 'Alex', avatar: '🧑‍💻', content: 'New project launch day 🚀', timestamp: new Date(Date.now() - 7200000).toISOString(), viewed: false },
  { id: 's3', userId: 'u5', userName: 'Dr. Meera', avatar: '🧑‍🔬', content: 'Research paper published!', timestamp: new Date(Date.now() - 18000000).toISOString(), viewed: true },
  { id: 's4', userId: 'u6', userName: 'Coach Dan', avatar: '💪', content: 'Morning run done ✅', timestamp: new Date(Date.now() - 28800000).toISOString(), viewed: true },
];

const now = Date.now();
const min = (m: number) => new Date(now - m * 60000).toISOString();
const hr = (h: number) => new Date(now - h * 3600000).toISOString();
const day = (d: number) => new Date(now - d * 86400000).toISOString();

export const initialChats: Chat[] = [
  {
    id: 'c1', name: 'Priya Sharma', avatar: '👩‍💼', isGroup: false, pinned: true, archived: false, muted: false, typing: false, online: true, isEncrypted: true, unreadCount: 3,
    participants: [{ id: 'u2', name: 'Priya Sharma', avatar: '👩‍💼', online: true }],
    messages: [
      { id: 'm1', chatId: 'c1', senderId: 'u2', type: 'text', content: 'Hey! Did you see the new design specs?', timestamp: hr(2), read: true, delivered: true, reactions: [] },
      { id: 'm2', chatId: 'c1', senderId: USER_SELF, type: 'text', content: 'Yes! They look amazing. Love the color palette 🎨', timestamp: hr(1.9), read: true, delivered: true, reactions: [{ emoji: '❤️', userId: 'u2' }] },
      { id: 'm3', chatId: 'c1', senderId: 'u2', type: 'image', content: 'design_preview.png', timestamp: hr(1.8), read: true, delivered: true, reactions: [] },
      { id: 'm4', chatId: 'c1', senderId: 'u2', type: 'text', content: 'Can we discuss the navigation flow?', timestamp: hr(1.5), read: true, delivered: true, reactions: [] },
      { id: 'm5', chatId: 'c1', senderId: USER_SELF, type: 'text', content: 'Sure! Let me pull up the wireframes', timestamp: hr(1.4), read: true, delivered: true, reactions: [] },
      { id: 'm6', chatId: 'c1', senderId: 'u2', type: 'text', content: 'Also, the client wants to add a dashboard module', timestamp: min(45), read: false, delivered: true, reactions: [] },
      { id: 'm7', chatId: 'c1', senderId: 'u2', type: 'text', content: 'I think we should schedule a call with the team', timestamp: min(30), read: false, delivered: true, reactions: [] },
      { id: 'm8', chatId: 'c1', senderId: 'u2', type: 'text', content: 'What time works for you tomorrow?', timestamp: min(5), read: false, delivered: true, reactions: [] },
    ],
    lastMessage: { id: 'm8', chatId: 'c1', senderId: 'u2', type: 'text', content: 'What time works for you tomorrow?', timestamp: min(5), read: false, delivered: true, reactions: [] },
  },
  {
    id: 'c2', name: 'Alex Chen', avatar: '🧑‍💻', isGroup: false, pinned: true, archived: false, muted: false, typing: true, online: true, isEncrypted: true, unreadCount: 0,
    participants: [{ id: 'u3', name: 'Alex Chen', avatar: '🧑‍💻', online: true }],
    messages: [
      { id: 'm9', chatId: 'c2', senderId: USER_SELF, type: 'text', content: 'Hey Alex, the PR is ready for review', timestamp: hr(4), read: true, delivered: true, reactions: [] },
      { id: 'm10', chatId: 'c2', senderId: 'u3', type: 'text', content: 'Awesome! I\'ll take a look after lunch', timestamp: hr(3.5), read: true, delivered: true, reactions: [{ emoji: '👍', userId: USER_SELF }] },
      { id: 'm11', chatId: 'c2', senderId: 'u3', type: 'text', content: 'BTW, found a bug in the auth module', timestamp: hr(3), read: true, delivered: true, reactions: [] },
      { id: 'm12', chatId: 'c2', senderId: USER_SELF, type: 'text', content: 'Oh no, what\'s the issue?', timestamp: hr(2.8), read: true, delivered: true, reactions: [] },
      { id: 'm13', chatId: 'c2', senderId: 'u3', type: 'text', content: 'Token refresh is failing on mobile browsers. I\'ll push a fix today.', timestamp: hr(2.5), read: true, delivered: true, reactions: [] },
      { id: 'm14', chatId: 'c2', senderId: USER_SELF, type: 'text', content: 'Thanks for catching that! 🙏', timestamp: hr(2), read: true, delivered: true, reactions: [{ emoji: '🙏', userId: 'u3' }] },
    ],
    lastMessage: { id: 'm14', chatId: 'c2', senderId: USER_SELF, type: 'text', content: 'Thanks for catching that! 🙏', timestamp: hr(2), read: true, delivered: true, reactions: [] },
  },
  {
    id: 'c3', name: 'Design Team 🎨', avatar: '🎨', isGroup: true, pinned: false, archived: false, muted: false, typing: false, online: false, isEncrypted: true, unreadCount: 5,
    participants: [
      { id: 'u2', name: 'Priya', avatar: '👩‍💼', online: true },
      { id: 'u4', name: 'Marcus', avatar: '👨‍🎨', online: false },
      { id: 'u7', name: 'Sofia', avatar: '👩‍🎤', online: true },
    ],
    messages: [
      { id: 'm15', chatId: 'c3', senderId: 'u2', type: 'text', content: 'Team, here\'s the updated style guide', timestamp: hr(6), read: true, delivered: true, reactions: [] },
      { id: 'm16', chatId: 'c3', senderId: 'u4', type: 'file', content: 'style_guide_v3.pdf', fileName: 'style_guide_v3.pdf', fileSize: '2.4 MB', timestamp: hr(5.5), read: true, delivered: true, reactions: [] },
      { id: 'm17', chatId: 'c3', senderId: 'u7', type: 'text', content: 'Love the new color tokens! 💜', timestamp: hr(5), read: true, delivered: true, reactions: [{ emoji: '💜', userId: 'u2' }] },
      { id: 'm18', chatId: 'c3', senderId: 'u2', type: 'text', content: 'Should we use Inter or Outfit for body text?', timestamp: hr(3), read: false, delivered: true, reactions: [] },
      { id: 'm19', chatId: 'c3', senderId: 'u4', type: 'text', content: 'Inter for sure. Better readability at small sizes', timestamp: hr(2.5), read: false, delivered: true, reactions: [] },
      { id: 'm20', chatId: 'c3', senderId: 'u7', type: 'text', content: 'Agreed! Inter it is ✅', timestamp: hr(2), read: false, delivered: true, reactions: [] },
      { id: 'm21', chatId: 'c3', senderId: 'u2', type: 'text', content: 'Perfect. Updating the Figma now', timestamp: hr(1.5), read: false, delivered: true, reactions: [] },
      { id: 'm22', chatId: 'c3', senderId: 'u4', type: 'text', content: 'Also adding dark mode variants 🌙', timestamp: hr(1), read: false, delivered: true, reactions: [] },
    ],
    lastMessage: { id: 'm22', chatId: 'c3', senderId: 'u4', type: 'text', content: 'Also adding dark mode variants 🌙', timestamp: hr(1), read: false, delivered: true, reactions: [] },
  },
  {
    id: 'c4', name: 'Marcus Rivera', avatar: '👨‍🎨', isGroup: false, pinned: false, archived: false, muted: false, typing: false, online: false, lastSeen: hr(1), isEncrypted: true, unreadCount: 0,
    participants: [{ id: 'u4', name: 'Marcus Rivera', avatar: '👨‍🎨', online: false }],
    messages: [
      { id: 'm23', chatId: 'c4', senderId: 'u4', type: 'text', content: 'Check out this illustration I made!', timestamp: day(1), read: true, delivered: true, reactions: [] },
      { id: 'm24', chatId: 'c4', senderId: 'u4', type: 'image', content: 'illustration_v2.png', timestamp: day(1), read: true, delivered: true, reactions: [{ emoji: '😮', userId: USER_SELF }] },
      { id: 'm25', chatId: 'c4', senderId: USER_SELF, type: 'text', content: 'This is incredible! How long did it take?', timestamp: day(0.9), read: true, delivered: true, reactions: [] },
      { id: 'm26', chatId: 'c4', senderId: 'u4', type: 'text', content: 'About 4 hours. Procreate on iPad Pro', timestamp: day(0.8), read: true, delivered: true, reactions: [] },
      { id: 'm27', chatId: 'c4', senderId: USER_SELF, type: 'text', content: 'We should use this for the landing page hero section', timestamp: hr(8), read: true, delivered: true, reactions: [{ emoji: '👍', userId: 'u4' }] },
    ],
    lastMessage: { id: 'm27', chatId: 'c4', senderId: USER_SELF, type: 'text', content: 'We should use this for the landing page hero section', timestamp: hr(8), read: true, delivered: true, reactions: [] },
  },
  {
    id: 'c5', name: 'Dr. Meera Patel', avatar: '🧑‍🔬', isGroup: false, pinned: false, archived: false, muted: false, typing: false, online: false, lastSeen: hr(3), isEncrypted: true, unreadCount: 1,
    participants: [{ id: 'u5', name: 'Dr. Meera Patel', avatar: '🧑‍🔬', online: false }],
    messages: [
      { id: 'm28', chatId: 'c5', senderId: USER_SELF, type: 'text', content: 'Congratulations on the paper! 🎉', timestamp: day(2), read: true, delivered: true, reactions: [] },
      { id: 'm29', chatId: 'c5', senderId: 'u5', type: 'text', content: 'Thank you so much! It was a long journey', timestamp: day(1.8), read: true, delivered: true, reactions: [] },
      { id: 'm30', chatId: 'c5', senderId: 'u5', type: 'text', content: 'Would you like to grab coffee this weekend and catch up?', timestamp: hr(5), read: false, delivered: true, reactions: [] },
    ],
    lastMessage: { id: 'm30', chatId: 'c5', senderId: 'u5', type: 'text', content: 'Would you like to grab coffee this weekend and catch up?', timestamp: hr(5), read: false, delivered: true, reactions: [] },
  },
  {
    id: 'c6', name: 'Project Alpha 🚀', avatar: '🚀', isGroup: true, pinned: false, archived: false, muted: true, typing: false, online: false, isEncrypted: true, unreadCount: 0,
    participants: [
      { id: 'u3', name: 'Alex', avatar: '🧑‍💻', online: true },
      { id: 'u2', name: 'Priya', avatar: '👩‍💼', online: true },
      { id: 'u8', name: 'Jordan', avatar: '🧑‍💼', online: false },
    ],
    messages: [
      { id: 'm31', chatId: 'c6', senderId: 'u3', type: 'text', content: 'Sprint review is at 3pm today', timestamp: day(1), read: true, delivered: true, reactions: [] },
      { id: 'm32', chatId: 'c6', senderId: 'u8', type: 'text', content: 'I\'ll present the backend progress', timestamp: day(0.95), read: true, delivered: true, reactions: [] },
      { id: 'm33', chatId: 'c6', senderId: USER_SELF, type: 'text', content: 'I\'ll demo the new UI components', timestamp: day(0.9), read: true, delivered: true, reactions: [{ emoji: '🚀', userId: 'u3' }] },
      { id: 'm34', chatId: 'c6', senderId: 'u2', type: 'text', content: 'Great! Let\'s crush it team 💪', timestamp: day(0.85), read: true, delivered: true, reactions: [{ emoji: '💪', userId: USER_SELF }, { emoji: '💪', userId: 'u3' }] },
    ],
    lastMessage: { id: 'm34', chatId: 'c6', senderId: 'u2', type: 'text', content: 'Great! Let\'s crush it team 💪', timestamp: day(0.85), read: true, delivered: true, reactions: [] },
  },
  {
    id: 'c7', name: 'Sarah Kim', avatar: '👩‍🏫', isGroup: false, pinned: false, archived: false, muted: false, typing: false, online: true, isEncrypted: true, unreadCount: 0,
    participants: [{ id: 'u9', name: 'Sarah Kim', avatar: '👩‍🏫', online: true }],
    messages: [
      { id: 'm35', chatId: 'c7', senderId: 'u9', type: 'text', content: 'Thanks for the book recommendation!', timestamp: day(3), read: true, delivered: true, reactions: [] },
      { id: 'm36', chatId: 'c7', senderId: USER_SELF, type: 'text', content: 'You\'re welcome! Let me know how you like it', timestamp: day(2.5), read: true, delivered: true, reactions: [] },
      { id: 'm37', chatId: 'c7', senderId: 'u9', type: 'voice', content: 'voice_note.ogg', duration: 12, timestamp: day(2), read: true, delivered: true, reactions: [] },
      { id: 'm38', chatId: 'c7', senderId: USER_SELF, type: 'text', content: 'Haha glad you enjoyed it! 😄', timestamp: day(1.8), read: true, delivered: true, reactions: [] },
    ],
    lastMessage: { id: 'm38', chatId: 'c7', senderId: USER_SELF, type: 'text', content: 'Haha glad you enjoyed it! 😄', timestamp: day(1.8), read: true, delivered: true, reactions: [] },
  },
  {
    id: 'c8', name: 'Mom ❤️', avatar: '👩', isGroup: false, pinned: false, archived: true, muted: false, typing: false, online: false, lastSeen: day(1), isEncrypted: true, unreadCount: 0,
    participants: [{ id: 'u10', name: 'Mom', avatar: '👩', online: false }],
    messages: [
      { id: 'm39', chatId: 'c8', senderId: 'u10', type: 'text', content: 'Don\'t forget to eat properly! 🍎', timestamp: day(3), read: true, delivered: true, reactions: [{ emoji: '❤️', userId: USER_SELF }] },
      { id: 'm40', chatId: 'c8', senderId: USER_SELF, type: 'text', content: 'Yes mom, I had a healthy lunch today 😊', timestamp: day(2.8), read: true, delivered: true, reactions: [] },
    ],
    lastMessage: { id: 'm40', chatId: 'c8', senderId: USER_SELF, type: 'text', content: 'Yes mom, I had a healthy lunch today 😊', timestamp: day(2.8), read: true, delivered: true, reactions: [] },
  },
];
