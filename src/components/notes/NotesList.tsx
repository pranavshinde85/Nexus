import { useMemo, useState } from 'react';
import { useNotesStore } from '../../stores/notesStore';
import { NoteCard } from './NoteCard';
import { Search, Pin } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotesList() {
  const { notes, setActiveNote } = useNotesStore();
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [notes]);

  const filtered = useMemo(() => {
    let result = notes;
    if (search) result = result.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
    if (filterTag) result = result.filter((n) => n.tags.includes(filterTag));
    return result;
  }, [notes, search, filterTag]);

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  return (
    <div className="h-full overflow-y-auto">
      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="input-nexus pl-9 py-2 text-sm" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 px-4 py-1 overflow-x-auto scrollbar-hide">
        <button onClick={() => setFilterTag(null)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${!filterTag ? 'bg-violet text-white' : 'bg-white/[0.04] text-text-secondary hover:bg-white/[0.06]'}`}>
          All
        </button>
        {allTags.map((tag) => (
          <button key={tag} onClick={() => setFilterTag(filterTag === tag ? null : tag)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${filterTag === tag ? 'bg-violet text-white' : 'bg-white/[0.04] text-text-secondary hover:bg-white/[0.06]'}`}>
            {tag}
          </button>
        ))}
      </div>

      <div className="px-4 pb-20 md:pb-4">
        {pinned.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 mt-3 mb-2">
              <Pin size={12} className="text-violet rotate-45" />
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Pinned</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pinned.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => setActiveNote(note.id)} />
              ))}
            </div>
          </>
        )}

        {others.length > 0 && (
          <>
            {pinned.length > 0 && <div className="h-px bg-white/[0.06] my-4" />}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">All Notes</span>
            </div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {others.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => setActiveNote(note.id)} />
              ))}
            </motion.div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
            <p className="text-sm">No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
