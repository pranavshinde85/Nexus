import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-1">
      <div className="bubble-received px-4 py-3 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-text-secondary"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
