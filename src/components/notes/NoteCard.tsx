import { Note } from '../../types';
import { motion } from 'framer-motion';
import { Pin, CheckSquare, Pencil } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

interface NoteCardProps { note: Note; onClick: () => void; }

export function NoteCard({ note, onClick }: NoteCardProps) {
  const checklistProgress = note.checklist
    ? `${note.checklist.filter(c => c.checked).length}/${note.checklist.length}`
    : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="note-card bg-surface text-left w-full"
    >
      {/* Cover color */}
      <div className="h-2 rounded-t-xl" style={{ backgroundColor: note.coverColor }} />

      <div className="p-3">
        {note.pinned && (
          <Pin size={12} className="text-violet mb-1 rotate-45" />
        )}

        <h3 className="text-sm font-semibold text-text-primary line-clamp-1 mb-1">
          {note.title || 'Untitled Note'}
        </h3>

        {note.type === 'checklist' && checklistProgress ? (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
            <CheckSquare size={12} />
            <span>{checklistProgress} completed</span>
          </div>
        ) : note.type === 'sketch' ? (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
            <Pencil size={12} />
            <span>Sketch note</span>
          </div>
        ) : (
          <p className="text-xs text-text-secondary line-clamp-3 mb-1.5" dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]+>/g, ' ').substring(0, 120) }} />
        )}

        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
          {note.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet/10 text-violet">{tag}</span>
          ))}
          <span className="text-[10px] text-text-muted ml-auto">{formatRelativeTime(note.updatedAt)}</span>
        </div>
      </div>
    </motion.button>
  );
}
