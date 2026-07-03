import { VaultFile } from '../../types';
import { motion } from 'framer-motion';
import { X, Download, Share2, Trash2, FileText, Image, Film, Package } from 'lucide-react';
import { formatFileSize, formatFullDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const categoryIcons: Record<string, typeof FileText> = { documents: FileText, images: Image, videos: Film, others: Package };

interface FilePreviewProps { file: VaultFile | null; onClose: () => void; }

export function FilePreview({ file, onClose }: FilePreviewProps) {
  if (!file) return null;
  const Icon = categoryIcons[file.category] || Package;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-navy-800 rounded-2xl overflow-hidden shadow-elevated border border-white/[0.06]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-text-primary truncate">{file.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
            <X size={18} />
          </button>
        </div>

        <div className="h-64 flex items-center justify-center bg-navy-900">
          {file.category === 'images' ? (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center">
              <Image size={48} className="text-text-secondary/30" />
            </div>
          ) : file.category === 'videos' ? (
            <div className="w-full h-full bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Icon size={48} className="text-text-secondary/30" />
              <p className="text-sm text-text-muted">Preview not available</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 space-y-2">
          <div className="flex gap-4 text-xs text-text-secondary">
            <span>Size: {formatFileSize(file.size)}</span>
            <span>Uploaded: {formatFullDate(file.dateUploaded)}</span>
          </div>
          {file.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {file.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 px-4 py-3 border-t border-white/[0.06]">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-violet/10 text-violet text-sm hover:bg-violet/20 transition-colors">
            <Download size={16} /> Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.04] text-text-secondary text-sm hover:bg-white/[0.06] transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/[0.04] text-danger text-sm hover:bg-danger/10 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
