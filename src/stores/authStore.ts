// ============================================
// NEXUS — Auth Store
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface PrivacySettings {
  lastSeen: boolean;
  profilePhoto: boolean;
  readReceipts: boolean;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  pin: string | null;
  privacySettings: PrivacySettings;

  // Auth actions
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id'>>) => void;

  // PIN / Lock
  setPin: (pin: string) => void;
  removePin: () => void;
  verifyPin: (pin: string) => boolean;
  lock: () => void;
  unlock: () => void;

  // Privacy
  togglePrivacy: (key: keyof PrivacySettings) => void;
  setPrivacy: (settings: Partial<PrivacySettings>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLocked: false,
      pin: null,
      privacySettings: {
        lastSeen: true,
        profilePhoto: true,
        readReceipts: true,
      },

      // ── Login ────────────────────────────────────
      login: (user) =>
        set({ user, isAuthenticated: true, isLocked: false }),

      // ── Logout ───────────────────────────────────
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLocked: false,
        }),

      // ── Update Profile ───────────────────────────
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // ── PIN Management ───────────────────────────
      setPin: (pin) => set({ pin }),
      removePin: () => set({ pin: null, isLocked: false }),

      verifyPin: (pin) => {
        const correct = get().pin === pin;
        if (correct) set({ isLocked: false });
        return correct;
      },

      lock: () => {
        const { pin } = get();
        if (pin) set({ isLocked: true });
      },

      unlock: () => set({ isLocked: false }),

      // ── Privacy ──────────────────────────────────
      togglePrivacy: (key) =>
        set((state) => ({
          privacySettings: {
            ...state.privacySettings,
            [key]: !state.privacySettings[key],
          },
        })),

      setPrivacy: (settings) =>
        set((state) => ({
          privacySettings: { ...state.privacySettings, ...settings },
        })),
    }),
    {
      name: 'nexus-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pin: state.pin,
        privacySettings: state.privacySettings,
        // Don't persist isLocked — always start unlocked, user locks manually
      }),
    }
  )
);
