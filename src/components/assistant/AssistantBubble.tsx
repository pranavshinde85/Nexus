import { AssistantMessage } from '../../types';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';

interface AssistantBubbleProps { message: AssistantMessage; }

export function AssistantBubble({ message }: AssistantBubbleProps) {
  const isAI = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2 px-4 py-1', isAI ? 'justify-start' : 'justify-end')}
    >
      {isAI && (
        <div className="w-7 h-7 rounded-full gradient-violet flex items-center justify-center flex-shrink-0 mt-auto shadow-glow-sm">
          <Sparkles size={13} className="text-white" />
        </div>
      )}
      <div className={cn('max-w-[80%] min-w-[60px]')}>
        <div className={cn('px-4 py-2.5', isAI ? 'assistant-bubble' : 'user-bubble-assistant')}>
          <p className={cn('text-sm leading-relaxed whitespace-pre-wrap', message.isStreaming && 'typing-cursor')}>
            {message.content}
          </p>
        </div>
        <p className={cn('text-[10px] text-text-muted mt-0.5 px-1', isAI ? 'text-left' : 'text-right')}>
          {format(new Date(message.timestamp), 'h:mm a')}
        </p>
      </div>
    </motion.div>
  );
}
