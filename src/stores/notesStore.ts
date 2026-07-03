// ============================================
// NEXUS — Notes Store
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Note, NoteType, ChecklistItem } from '../types';

interface NotesStore {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  filterTags: string[];

  // Setters
  setNotes: (notes: Note[]) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterTags: (tags: string[]) => void;
  toggleFilterTag: (tag: string) => void;

  // CRUD
  createNote: (partial?: {
    title?: string;
    content?: string;
    type?: NoteType;
    coverColor?: string;
    tags?: string[];
    checklist?: ChecklistItem[];
  }) => string;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;

  // Actions
  pinNote: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  toggleChecklistItem: (noteId: string, itemId: string) => void;
  addChecklistItem: (noteId: string, text: string) => void;
  removeChecklistItem: (noteId: string, itemId: string) => void;

  // Computed helpers
  filteredNotes: () => Note[];
  activeNote: () => Note | undefined;
  allTags: () => string[];
}

// ── Seed Data ───────────────────────────────
const seedNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Project Roadmap Q3',
    content:
      '<p>Focus areas for Q3 include scaling the backend infrastructure, launching the mobile app beta, and integrating the new AI-powered search.</p><p>Key milestones:</p><ul><li>Backend migration complete by July 15</li><li>Mobile beta launch August 1</li><li>AI search MVP by September</li></ul>',
    type: 'text',
    coverColor: '#7C3AED',
    tags: ['work', 'roadmap'],
    pinned: true,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-10T14:30:00Z',
  },
  {
    id: 'note-2',
    title: 'Weekly Grocery List',
    content: '',
    type: 'checklist',
    coverColor: '#10B981',
    tags: ['personal', 'shopping'],
    pinned: false,
    createdAt: '2026-06-08T09:00:00Z',
    updatedAt: '2026-06-11T08:15:00Z',
    checklist: [
      { id: 'cl-1', text: 'Avocados (3)', checked: true },
      { id: 'cl-2', text: 'Almond milk', checked: true },
      { id: 'cl-3', text: 'Chicken breast', checked: false },
      { id: 'cl-4', text: 'Spinach', checked: true },
      { id: 'cl-5', text: 'Greek yogurt', checked: false },
    ],
  },
  {
    id: 'note-3',
    title: 'Design Inspiration',
    content:
      '<p>Collected references for the new dashboard redesign. Look into glassmorphism patterns, dark gradients, and micro-interaction libraries.</p>',
    type: 'text',
    coverColor: '#F59E0B',
    tags: ['design', 'work'],
    pinned: true,
    createdAt: '2026-06-05T16:20:00Z',
    updatedAt: '2026-06-09T11:45:00Z',
  },
  {
    id: 'note-4',
    title: 'Quick Sketch — App Flow',
    content: '',
    type: 'sketch',
    coverColor: '#F43F5E',
    tags: ['design'],
    pinned: false,
    createdAt: '2026-06-07T13:00:00Z',
    updatedAt: '2026-06-07T14:00:00Z',
    sketchData: '',
  },
  {
    id: 'note-5',
    title: 'Meeting Notes — Sync',
    content:
      '<p>Attendees: Alice, Bob, Charlie</p><p>Discussed sprint priorities and blockers. Action items:</p><ol><li>Alice to finalize API contracts</li><li>Bob to set up staging environment</li><li>Charlie to review PR #482</li></ol><p>Next sync: Thursday 2 PM</p>',
    type: 'text',
    coverColor: '#3B82F6',
    tags: ['work', 'meetings'],
    pinned: false,
    createdAt: '2026-06-10T14:00:00Z',
    updatedAt: '2026-06-10T15:00:00Z',
  },
];

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: seedNotes,
      activeNoteId: null,
      searchQuery: '',
      filterTags: [],

      // ── Setters ──────────────────────────────────
      setNotes: (notes) => set({ notes }),
      setActiveNote: (id) => set({ activeNoteId: id }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setFilterTags: (tags) => set({ filterTags: tags }),
      toggleFilterTag: (tag) =>
        set((state) => ({
          filterTags: state.filterTags.includes(tag)
            ? state.filterTags.filter((t) => t !== tag)
            : [...state.filterTags, tag],
        })),

      // ── Create Note ──────────────────────────────
      createNote: (partial) => {
        const id = nanoid();
        const now = new Date().toISOString();
        const note: Note = {
          id,
          title: partial?.title ?? 'Untitled Note',
          content: partial?.content ?? '',
          type: partial?.type ?? 'text',
          coverColor: partial?.coverColor ?? '#7C3AED',
          tags: partial?.tags ?? [],
          pinned: false,
          createdAt: now,
          updatedAt: now,
          checklist: partial?.checklist,
        };
        set((state) => ({ notes: [note, ...state.notes], activeNoteId: id }));
        return id;
      },

      // ── Update Note ──────────────────────────────
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, ...updates, updatedAt: new Date().toISOString() }
              : n
          ),
        })),

      // ── Delete Note ──────────────────────────────
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        })),

      // ── Duplicate Note ───────────────────────────
      duplicateNote: (id) => {
        const source = get().notes.find((n) => n.id === id);
        if (!source) return;
        const now = new Date().toISOString();
        const duplicate: Note = {
          ...source,
          id: nanoid(),
          title: `${source.title} (Copy)`,
          pinned: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [duplicate, ...state.notes] }));
      },

      // ── Pin / Unpin Note ─────────────────────────
      pinNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, pinned: !n.pinned } : n
          ),
        })),

      // ── Tags ─────────────────────────────────────
      addTag: (id, tag) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id && !n.tags.includes(tag)
              ? { ...n, tags: [...n.tags, tag], updatedAt: new Date().toISOString() }
              : n
          ),
        })),

      removeTag: (id, tag) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  tags: n.tags.filter((t) => t !== tag),
                  updatedAt: new Date().toISOString(),
                }
              : n
          ),
        })),

      // ── Checklist ────────────────────────────────
      toggleChecklistItem: (noteId, itemId) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  checklist: n.checklist?.map((item) =>
                    item.id === itemId
                      ? { ...item, checked: !item.checked }
                      : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : n
          ),
        })),

      addChecklistItem: (noteId, text) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  checklist: [
                    ...(n.checklist ?? []),
                    { id: nanoid(), text, checked: false },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : n
          ),
        })),

      removeChecklistItem: (noteId, itemId) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  checklist: n.checklist?.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : n
          ),
        })),

      // ── Computed ─────────────────────────────────
      filteredNotes: () => {
        const { notes, searchQuery, filterTags } = get();
        let result = notes;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q)
          );
        }
        if (filterTags.length > 0) {
          result = result.filter((n) =>
            filterTags.some((tag) => n.tags.includes(tag))
          );
        }
        // Pinned notes always come first
        return result.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      },

      activeNote: () => {
        const { notes, activeNoteId } = get();
        return notes.find((n) => n.id === activeNoteId);
      },

      allTags: () => {
        const tags = new Set<string>();
        get().notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
      },
    }),
    { name: 'nexus-notes' }
  )
);
