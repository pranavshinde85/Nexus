import { VaultFile } from '../../types';
import { useVaultStore } from '../../stores/vaultStore';
import { formatFileSize, formatFullDate } from '../../utils/formatters';
import { Star, FileText, Image, Film, Package, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';

const categoryIcons: Record<string, typeof FileText> = { documents: FileText, images: Image, videos: Film, others: Package };

interface FileRowProps { file: VaultFile; onClick?: () => void; }

export function FileRow({ file, onClick }: FileRowProps) {
  const { starFile } = useVaultStore();
  const Icon = categoryIcons[file.category] || Package;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{file.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">{formatFileSize(file.size)}</span>
          <span className="text-[11px] text-text-muted">·</span>
          <span className="text-[11px] text-text-muted">{formatFullDate(file.dateUploaded)}</span>
          {file.tags.slice(0, 1).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet/10 text-violet">{t}</span>
          ))}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); starFile(file.id); }} className="p-1.5">
        <Star size={14} className={file.starred ? 'text-warning fill-warning' : 'text-text-muted'} />
      </button>
    </button>
  );
}
