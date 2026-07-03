// ============================================
// NEXUS — Vault Store
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { VaultFile, Folder, VaultCategory, VaultViewMode } from '../types';

interface VaultStore {
  files: VaultFile[];
  folders: Folder[];
  activeFolderId: string | null;
  viewMode: VaultViewMode;
  category: VaultCategory;
  searchQuery: string;

  // Setters
  setFiles: (files: VaultFile[]) => void;
  setFolders: (folders: Folder[]) => void;
  setViewMode: (mode: VaultViewMode) => void;
  setCategory: (cat: VaultCategory) => void;
  setActiveFolder: (id: string | null) => void;
  setSearchQuery: (q: string) => void;

  // File actions
  addFile: (file: Omit<VaultFile, 'id' | 'dateUploaded'>) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, name: string) => void;
  moveFile: (fileId: string, folderId: string | null) => void;
  starFile: (id: string) => void;
  toggleSecure: (id: string) => void;

  // Folder actions
  createFolder: (name: string, parentId?: string | null, color?: string) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;

  // Computed helpers
  filteredFiles: () => VaultFile[];
  currentFolderFiles: () => VaultFile[];
  getFolder: (id: string) => Folder | undefined;
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      files: [],
      folders: [],
      activeFolderId: null,
      viewMode: 'grid',
      category: 'all',
      searchQuery: '',

      // ── Setters ──────────────────────────────────
      setFiles: (files) => set({ files }),
      setFolders: (folders) => set({ folders }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setCategory: (cat) => set({ category: cat }),
      setActiveFolder: (id) => set({ activeFolderId: id }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ── Add File ─────────────────────────────────
      addFile: (partial) => {
        const file: VaultFile = {
          ...partial,
          id: nanoid(),
          dateUploaded: new Date().toISOString(),
        };
        set((state) => ({
          files: [file, ...state.files],
          folders: state.folders.map((f) =>
            f.id === file.folderId
              ? { ...f, fileCount: f.fileCount + 1 }
              : f
          ),
        }));
      },

      // ── Delete File ──────────────────────────────
      deleteFile: (id) =>
        set((state) => {
          const file = state.files.find((f) => f.id === id);
          return {
            files: state.files.filter((f) => f.id !== id),
            folders: file?.folderId
              ? state.folders.map((folder) =>
                  folder.id === file.folderId
                    ? { ...folder, fileCount: Math.max(0, folder.fileCount - 1) }
                    : folder
                )
              : state.folders,
          };
        }),

      // ── Rename File ──────────────────────────────
      renameFile: (id, name) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        })),

      // ── Move File ────────────────────────────────
      moveFile: (fileId, folderId) =>
        set((state) => {
          const file = state.files.find((f) => f.id === fileId);
          if (!file) return state;
          const oldFolderId = file.folderId;
          return {
            files: state.files.map((f) =>
              f.id === fileId ? { ...f, folderId } : f
            ),
            folders: state.folders.map((folder) => {
              if (folder.id === oldFolderId)
                return { ...folder, fileCount: Math.max(0, folder.fileCount - 1) };
              if (folder.id === folderId)
                return { ...folder, fileCount: folder.fileCount + 1 };
              return folder;
            }),
          };
        }),

      // ── Star / Unstar File ───────────────────────
      starFile: (id) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, starred: !f.starred } : f
          ),
        })),

      // ── Toggle Secure ────────────────────────────
      toggleSecure: (id) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, secure: !f.secure } : f
          ),
        })),

      // ── Create Folder ────────────────────────────
      createFolder: (name, parentId = null, color) => {
        const id = nanoid();
        const folder: Folder = {
          id,
          name,
          parentId: parentId ?? null,
          children: [],
          fileCount: 0,
          color,
        };
        set((state) => ({
          folders: [
            ...state.folders.map((f) =>
              f.id === parentId
                ? { ...f, children: [...f.children, id] }
                : f
            ),
            folder,
          ],
        }));
      },

      // ── Delete Folder ────────────────────────────
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders
            .filter((f) => f.id !== id)
            .map((f) => ({
              ...f,
              children: f.children.filter((childId) => childId !== id),
            })),
          files: state.files.map((f) =>
            f.folderId === id ? { ...f, folderId: null } : f
          ),
          activeFolderId:
            state.activeFolderId === id ? null : state.activeFolderId,
        })),

      // ── Rename Folder ────────────────────────────
      renameFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        })),

      // ── Computed ─────────────────────────────────
      filteredFiles: () => {
        const { files, category, searchQuery } = get();
        let result = files;
        if (category !== 'all') {
          result = result.filter((f) => f.category === category);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter((f) => f.name.toLowerCase().includes(q));
        }
        return result;
      },

      currentFolderFiles: () => {
        const { files, activeFolderId } = get();
        return files.filter((f) => f.folderId === activeFolderId);
      },

      getFolder: (id) => get().folders.find((f) => f.id === id),
    }),
    { name: 'nexus-vault' }
  )
);
