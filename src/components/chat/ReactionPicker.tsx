import { motion } from 'framer-motion';
import { EMOJI_REACTIONS } from '../../utils/constants';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="glass-elevated rounded-full px-2 py-1.5 flex gap-1 shadow-elevated"
      onMouseLeave={onClose}
    >
      {EMOJI_REACTIONS.map((emoji, i) => (
        <motion.button
          key={emoji}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 500 }}
          onClick={() => { onSelect(emoji); onClose(); }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-lg"
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
}
