import { motion } from 'framer-motion';

const chips = [
  { icon: '✨', label: 'Summarize my notes' },
  { icon: '📋', label: 'Tasks due today' },
  { icon: '✉️', label: 'Draft a message' },
  { icon: '✅', label: 'Create a task' },
  { icon: '📁', label: 'Find a file' },
  { icon: '📝', label: 'Write a to-do list' },
  { icon: '🌅', label: 'Daily briefing' },
];

interface SuggestionChipsProps { onSelect: (text: string) => void; }

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
      {chips.map((chip, i) => (
        <motion.button
          key={chip.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(chip.label)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full glass text-xs text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors hover:border-violet/30"
        >
          <span>{chip.icon}</span>
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}
