import { VaultFile } from '../../types';
import { useVaultStore } from '../../stores/vaultStore';
import { formatFileSize, formatFullDate } from '../../utils/formatters';
import { motion } from 'framer-motion';
import { Star, MoreVertical, FileText, Image, Film, Package, Download, Share2, Pencil, Trash2, FolderInput } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const categoryIcons: Record<string, typeof FileText> = { documents: FileText, images: Image, videos: Film, others: Package };
const categoryColors: Record<string, string> = { documents: 'from-blue-500/20 to-blue-600/20', images: 'from-emerald-500/20 to-emerald-600/20', videos: 'from-rose-500/20 to-rose-600/20', others: 'from-gray-500/20 to-gray-600/20' };

interface FileCardProps { file: VaultFile; onClick?: () => void; }

export function FileCard({ file, onClick }: FileCardProps) {
  const { starFile, deleteFile } = useVaultStore();
  const [showMenu, setShowMenu] = useState(false);
  const Icon = categoryIcons[file.category] || Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="note-card bg-surface group"
      onClick={onClick}
    >
      {/* Thumbnail area */}
      <div className={cn('h-28 flex items-center justify-center bg-gradient-to-br', categoryColors[file.category] || categoryColors.others)}>
        <Icon size={32} className="text-text-secondary/50" />
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium text-text-primary truncate flex-1">{file.name}</p>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button onClick={(e) => { e.stopPropagation(); starFile(file.id); }} className="p-1 rounded transition-colors">
              <Star size={14} className={file.starred ? 'text-warning fill-warning' : 'text-text-muted'} />
            </button>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 rounded text-text-muted hover:text-text-primary">
                <MoreVertical size={14} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 z-30 glass-elevated rounded-xl p-1 min-w-[130px] shadow-elevated" onClick={(e) => e.stopPropagation()}>
                  {[
                    { icon: Download, label: 'Download' },
                    { icon: Share2, label: 'Share' },
                    { icon: Pencil, label: 'Rename' },
                    { icon: FolderInput, label: 'Move' },
                    { icon: Trash2, label: 'Delete', danger: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { if (item.label === 'Delete') deleteFile(file.id); setShowMenu(false); }}
                      className={cn('flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs transition-colors', item.danger ? 'text-danger hover:bg-danger/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]')}
                    >
                      <item.icon size={13} /> {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-text-muted">{formatFileSize(file.size)}</span>
          <span className="text-[11px] text-text-muted">·</span>
          <span className="text-[11px] text-text-muted">{formatFullDate(file.dateUploaded)}</span>
        </div>
        {file.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {file.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet/10 text-violet">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
