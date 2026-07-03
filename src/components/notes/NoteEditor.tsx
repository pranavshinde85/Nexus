import { useState, useEffect, useCallback } from 'react';
import { useNotesStore } from '../../stores/notesStore';
import { ToolbarEditor } from './ToolbarEditor';
import { SketchPad } from './SketchPad';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExt from '@tiptap/extension-underline';
import { motion } from 'framer-motion';
import { ArrowLeft, Pin, Trash2, Sparkles, Check, X, Plus } from 'lucide-react';
import { NOTE_COLORS } from '../../utils/constants';
import { cn } from '../../utils/cn';

export function NoteEditor() {
  const { notes, activeNoteId, setActiveNote, updateNote, deleteNote, pinNote } = useNotesStore();
  const note = notes.find((n) => n.id === activeNoteId);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [title, setTitle] = useState(note?.title || '');
  const [tagInput, setTagInput] = useState('');
  const [showAI, setShowAI] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your note...' }),
      UnderlineExt,
    ],
    content: note?.content || '',
    onUpdate: ({ editor }) => {
      if (!note) return;
      setSaveStatus('saving');
      updateNote(note.id, { content: editor.getHTML(), updatedAt: new Date().toISOString() });
    },
    editorProps: {
      attributes: { class: 'min-h-[300px] p-4 focus:outline-none text-text-primary text-[15px] leading-relaxed' },
    },
  });

  // Auto-save indicator
  useEffect(() => {
    if (saveStatus === 'saving') {
      const t = setTimeout(() => setSaveStatus('saved'), 1000);
      return () => clearTimeout(t);
    }
    if (saveStatus === 'saved') {
      const t = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);

  // Save title on change
  useEffect(() => {
    if (!note || title === note.title) return;
    const t = setTimeout(() => {
      updateNote(note.id, { title, updatedAt: new Date().toISOString() });
      setSaveStatus('saving');
    }, 500);
    return () => clearTimeout(t);
  }, [title]);

  const addTag = () => {
    if (!tagInput.trim() || !note) return;
    const tags = [...note.tags, tagInput.trim().toLowerCase()];
    updateNote(note.id, { tags });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    if (!note) return;
    updateNote(note.id, { tags: note.tags.filter((t) => t !== tag) });
  };

  if (!note) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="h-full flex flex-col bg-navy-900"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-navy-800/80 backdrop-blur-lg">
        <button onClick={() => setActiveNote(null)} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1" />
        {saveStatus !== 'idle' && (
          <span className={cn('text-[11px] font-medium', saveStatus === 'saved' ? 'text-success' : 'text-text-muted')}>
            {saveStatus === 'saving' ? 'Saving...' : '✓ Saved'}
          </span>
        )}
        <button onClick={() => pinNote(note.id)} className={cn('p-1.5 rounded-lg transition-colors', note.pinned ? 'text-violet' : 'text-text-secondary hover:text-text-primary')}>
          <Pin size={18} className={note.pinned ? 'rotate-45' : ''} />
        </button>
        <div className="relative">
          <button onClick={() => setShowAI(!showAI)} className="p-1.5 rounded-lg text-violet hover:bg-violet/10 transition-colors">
            <Sparkles size={18} />
          </button>
          {showAI && (
            <div className="absolute right-0 top-9 z-20 glass-elevated rounded-xl p-1 min-w-[140px] shadow-elevated">
              {['Rewrite', 'Summarize', 'Expand'].map((a) => (
                <button key={a} onClick={() => setShowAI(false)} className="w-full px-3 py-2 text-xs text-left text-text-secondary hover:text-text-primary hover:bg-white/[0.04] rounded-lg transition-colors">
                  ✨ {a}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => { deleteNote(note.id); setActiveNote(null); }} className="p-1.5 rounded-lg text-text-secondary hover:text-danger transition-colors">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Cover color picker */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.06]">
        {NOTE_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => updateNote(note.id, { coverColor: c })}
            className={cn('w-5 h-5 rounded-full transition-transform', note.coverColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-navy-900 scale-110' : '')}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full px-4 py-3 bg-transparent text-xl font-bold text-text-primary placeholder:text-text-muted focus:outline-none"
        />

        {/* Tags */}
        <div className="flex items-center gap-1.5 px-4 pb-2 flex-wrap">
          {note.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-violet/10 text-violet">
              {tag}
              <button onClick={() => removeTag(tag)}><X size={10} /></button>
            </span>
          ))}
          <div className="inline-flex items-center">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="+ tag"
              className="bg-transparent text-[11px] text-text-muted w-12 focus:w-20 focus:outline-none transition-all placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Editor or SketchPad */}
        {note.type === 'sketch' ? (
          <div className="px-4 h-[400px]">
            <SketchPad data={note.sketchData} onChange={(data) => updateNote(note.id, { sketchData: data })} />
          </div>
        ) : (
          <div className="tiptap-editor">
            <ToolbarEditor editor={editor} />
            <EditorContent editor={editor} />
          </div>
        )}

        {/* Checklist */}
        {note.type === 'checklist' && note.checklist && (
          <div className="px-4 pb-4 space-y-1">
            {note.checklist.map((item) => (
              <label key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {
                    const updated = note.checklist!.map((c) => c.id === item.id ? { ...c, checked: !c.checked } : c);
                    updateNote(note.id, { checklist: updated });
                  }}
                  className="w-4 h-4 rounded border-white/20 bg-transparent accent-violet"
                />
                <span className={cn('text-sm', item.checked ? 'text-text-muted line-through' : 'text-text-primary')}>{item.text}</span>
              </label>
            ))}
          </div>
        )}

        <div className="h-20" />
      </div>
    </motion.div>
  );
}
