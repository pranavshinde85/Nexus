import { useAppStore } from '../../stores/appStore';
import { Plus, MessageCirclePlus, Upload, FilePlus, ListPlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const fabActions = {
  chat: { icon: MessageCirclePlus, label: 'New Chat', color: 'from-violet to-violet-dark' },
  vault: { icon: Upload, label: 'Upload', color: 'from-violet to-violet-dark' },
  notes: { icon: FilePlus, label: 'New Note', color: 'from-violet to-violet-dark' },
  tasks: { icon: ListPlus, label: 'New Task', color: 'from-violet to-violet-dark' },
  assistant: { icon: Sparkles, label: 'New Chat', color: 'from-violet to-violet-dark' },
};

interface FABProps {
  onAction?: () => void;
}

export function FAB({ onAction }: FABProps) {
  const activeTab = useAppStore((s) => s.activeTab);
  const [isHovered, setIsHovered] = useState(false);
  const action = fabActions[activeTab];
  const Icon = action.icon;

  return (
    <motion.button
      className="fab"
      id="fab-button"
      onClick={onAction}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={24} className="text-white" />
        </motion.div>
      </AnimatePresence>

      {/* Tooltip on hover (desktop only) */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 whitespace-nowrap text-sm font-medium text-text-primary glass px-3 py-1.5 rounded-lg hidden md:block"
          >
            {action.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
