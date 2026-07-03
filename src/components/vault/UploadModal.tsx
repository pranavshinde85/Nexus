import { motion } from 'framer-motion';
import { X, Upload, Tag } from 'lucide-react';

interface UploadModalProps { isOpen: boolean; onClose: () => void; }

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  if (!isOpen) return null;

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
        className="w-full max-w-md bg-navy-800 rounded-2xl overflow-hidden shadow-elevated border border-white/[0.06]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-text-primary">Upload Files</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-violet/30 transition-colors cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-violet/10 flex items-center justify-center">
              <Upload size={24} className="text-violet" />
            </div>
            <p className="text-sm text-text-primary font-medium">Drag files here or click to browse</p>
            <p className="text-xs text-text-muted">Supports PDF, DOCX, images, videos, and more</p>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block">Tags</label>
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-text-muted" />
                <input type="text" placeholder="Add tags (comma separated)" className="input-nexus py-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-secondary mb-1.5 block">Destination Folder</label>
              <select className="input-nexus py-2 text-sm">
                <option value="">Root</option>
                <option value="f1">Work</option>
                <option value="f2">Personal</option>
                <option value="f3">Projects</option>
                <option value="f4">Travel</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3 border-t border-white/[0.06]">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/[0.04] text-text-secondary text-sm hover:bg-white/[0.06] transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl gradient-violet text-white text-sm font-medium shadow-glow-sm hover:shadow-glow transition-all">
            Upload
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
