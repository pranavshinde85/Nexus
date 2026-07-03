import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Code, Minus, Undo, Redo } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ToolbarEditorProps { editor: any; }

export function ToolbarEditor({ editor }: ToolbarEditorProps) {
  if (!editor) return null;

  const groups = [
    [
      { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
      { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
      { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), label: 'Underline' },
      { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), label: 'Strike' },
    ],
    [
      { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), label: 'H1' },
      { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'H2' },
      { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), label: 'H3' },
    ],
    [
      { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet' },
      { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Ordered' },
      { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock'), label: 'Code' },
      { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, label: 'Divider' },
    ],
    [
      { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false, label: 'Undo' },
      { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false, label: 'Redo' },
    ],
  ];

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto scrollbar-hide glass sticky top-0 z-10 border-b border-white/[0.06]">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && <div className="w-px h-5 bg-white/[0.06] mx-1" />}
          {group.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              title={btn.label}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                btn.active ? 'bg-violet/20 text-violet' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
            >
              <btn.icon size={15} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
