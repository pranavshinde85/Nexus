import { useMemo, useState } from 'react';
import { useVaultStore } from '../../stores/vaultStore';
import { VaultCategory, VaultFile } from '../../types';
import { StorageBar } from './StorageBar';
import { FileCard } from './FileCard';
import { FileRow } from './FileRow';
import { FolderTree } from './FolderTree';
import { FilePreview } from './FilePreview';
import { cn } from '../../utils/cn';
import { Search, Grid3X3, List, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories: { id: VaultCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'documents', label: '📄 Docs' },
  { id: 'images', label: '🖼️ Images' },
  { id: 'videos', label: '🎬 Videos' },
  { id: 'others', label: '📦 Others' },
];

export function VaultView() {
  const { files, viewMode, setViewMode, activeFolderId: activeFolder, category, setCategory } = useVaultStore();
  const [search, setSearch] = useState('');
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);

  const filteredFiles = useMemo(() => {
    let result = files;
    if (activeFolder === 'starred') result = result.filter((f) => f.starred);
    else if (activeFolder === 'secure') result = result.filter((f) => f.secure);
    else if (activeFolder) result = result.filter((f) => f.folderId === activeFolder);
    if (category !== 'all') result = result.filter((f) => f.category === category);
    if (search) result = result.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.tags.some((t) => t.includes(search.toLowerCase())));
    return result;
  }, [files, activeFolder, category, search]);

  const starredFiles = files.filter((f) => f.starred);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <StorageBar />

      {/* Category tabs */}
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-hide border-b border-white/[0.06]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              category === cat.id
                ? 'bg-violet text-white shadow-glow-sm'
                : 'text-text-secondary hover:text-text-primary bg-white/[0.03] hover:bg-white/[0.06]'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search + view toggle */}
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="input-nexus pl-9 py-2 text-xs" />
        </div>
        <div className="flex bg-navy-700 rounded-lg p-0.5">
          <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded-md transition-colors', viewMode === 'grid' ? 'bg-violet text-white' : 'text-text-muted')}>
            <Grid3X3 size={14} />
          </button>
          <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded-md transition-colors', viewMode === 'list' ? 'bg-violet text-white' : 'text-text-muted')}>
            <List size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Folder tree (desktop) */}
        <div className="hidden lg:block w-56 border-r border-white/[0.06] overflow-y-auto">
          <FolderTree />
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 md:pb-4">
          {/* Starred section */}
          {activeFolder === null && category === 'all' && starredFiles.length > 0 && !search && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2 mt-2">
                <Star size={14} className="text-warning" />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Starred</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {starredFiles.slice(0, 4).map((f) => (
                  <FileCard key={f.id} file={f} onClick={() => setPreviewFile(f)} />
                ))}
              </div>
              <div className="h-px bg-white/[0.06] mt-4" />
            </div>
          )}

          {/* Main files */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {filteredFiles.map((f) => (
                  <FileCard key={f.id} file={f} onClick={() => setPreviewFile(f)} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-1">
                {filteredFiles.map((f) => (
                  <FileRow key={f.id} file={f} onClick={() => setPreviewFile(f)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
              <p className="text-sm">No files found</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
      </AnimatePresence>
    </div>
  );
}
