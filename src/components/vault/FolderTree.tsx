import { useVaultStore } from '../../stores/vaultStore';
import { cn } from '../../utils/cn';
import { Folder, Star, Lock, ChevronRight, ChevronDown, FolderPlus, Files } from 'lucide-react';
import { useState } from 'react';

export function FolderTree() {
  const { folders, activeFolderId: activeFolder, setActiveFolder } = useVaultStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['f1', 'f2']));

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const rootFolders = folders.filter((f) => f.parentId === null);

  const renderFolder = (folderId: string, depth: number = 0) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return null;
    const children = folders.filter((f) => f.parentId === folderId);
    const isExpanded = expanded.has(folderId);
    const isActive = activeFolder === folderId;

    return (
      <div key={folderId}>
        <button
          onClick={() => { setActiveFolder(folderId); if (children.length) toggle(folderId); }}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
            isActive ? 'bg-violet/10 text-violet' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
          )}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {children.length > 0 ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <div className="w-3.5" />}
          <Folder size={16} style={{ color: folder.color || '#8B949E' }} />
          <span className="flex-1 text-left truncate">{folder.name}</span>
          <span className="text-[10px] text-text-muted">{folder.fileCount}</span>
        </button>
        {isExpanded && children.map((c) => renderFolder(c.id, depth + 1))}
      </div>
    );
  };

  return (
    <div className="p-2 space-y-0.5">
      <button
        onClick={() => setActiveFolder(null)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
          activeFolder === null ? 'bg-violet/10 text-violet' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
        )}
      >
        <Files size={16} />
        <span className="flex-1 text-left">All Files</span>
      </button>

      <button
        onClick={() => setActiveFolder('starred')}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
          activeFolder === 'starred' ? 'bg-violet/10 text-violet' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
        )}
      >
        <Star size={16} />
        <span className="flex-1 text-left">Starred</span>
      </button>

      <div className="h-px bg-white/[0.06] my-2" />

      {rootFolders.map((f) => renderFolder(f.id))}

      <div className="h-px bg-white/[0.06] my-2" />

      <button
        onClick={() => setActiveFolder('secure')}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
          activeFolder === 'secure' ? 'bg-violet/10 text-violet' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
        )}
      >
        <Lock size={16} />
        <span className="flex-1 text-left">Secure Vault</span>
      </button>
    </div>
  );
}
