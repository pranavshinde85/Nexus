// ============================================
// NEXUS — AI Assistant Store
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { AssistantMessage } from '../types';

interface AssistantStore {
  messages: AssistantMessage[];
  isTyping: boolean;

  // Actions
  addMessage: (partial: Omit<AssistantMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, updates: Partial<Omit<AssistantMessage, 'id'>>) => void;
  deleteMessage: (id: string) => void;
  setTyping: (v: boolean) => void;
  clearHistory: () => void;
}

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      messages: [],
      isTyping: false,

      // ── Add Message ──────────────────────────────
      addMessage: (partial) => {
        const id = nanoid();
        const message: AssistantMessage = {
          ...partial,
          id,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, message] }));
        return id;
      },

      // ── Update Message (for streaming) ───────────
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      // ── Delete Message ───────────────────────────
      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })),

      // ── Set Typing ──────────────────────────────
      setTyping: (v) => set({ isTyping: v }),

      // ── Clear History ────────────────────────────
      clearHistory: () => set({ messages: [], isTyping: false }),
    }),
    {
      name: 'nexus-assistant',
      partialize: (state) => ({
        messages: state.messages,
        // Don't persist isTyping — always reset to false on reload
      }),
    }
  )
);
