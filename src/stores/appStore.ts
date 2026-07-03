// ============================================
// NEXUS — App Store
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActiveTab, ThemeMode } from '../types';

interface AppStore {
  activeTab: ActiveTab;
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  isOnboarded: boolean;
  apiKey: string;
  searchOpen: boolean;
  setActiveTab: (tab: ActiveTab) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setOnboarded: (v: boolean) => void;
  setApiKey: (key: string) => void;
  setSearchOpen: (v: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeTab: 'chat',
      theme: 'dark',
      sidebarCollapsed: false,
      isOnboarded: false,
      apiKey: '',
      searchOpen: false,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setOnboarded: (v) => set({ isOnboarded: v }),
      setApiKey: (key) => set({ apiKey: key }),
      setSearchOpen: (v) => set({ searchOpen: v }),
    }),
    { name: 'nexus-app' }
  )
);
