import { Message } from '../../types';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Image, Mic, FileText, MapPin, SmilePlus } from 'lucide-react';
import { ReactionPicker } from './ReactionPicker';
import { useState } from 'react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showAvatar?: boolean;
  chatAvatar?: string;
  onReply?: (msg: Message) => void;
  onReact?: (messageId: string, emoji: string) => void;
  replyPreview?: Message | null;
}

export function MessageBubble({ message, isSent, showAvatar, chatAvatar, onReply, onReact, replyPreview }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);
  const time = format(new Date(message.timestamp), 'h:mm a');

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden mb-1">
            <div className="w-[200px] h-[150px] bg-gradient-to-br from-violet/30 to-blue-500/30 flex items-center justify-center">
              <Image size={32} className="text-text-secondary/50" />
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Mic size={14} />
            </div>
            <div className="flex-1">
              <div className="flex gap-[2px] items-center h-6">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn('w-[3px] rounded-full', isSent ? 'bg-white/40' : 'bg-violet/40')}
                    animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
              <span className="text-[10px] opacity-60">{message.duration}s</span>
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-sm font-medium line-clamp-1">{message.fileName || message.content}</p>
              {message.fileSize && <p className="text-[10px] opacity-60">{message.fileSize}</p>}
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-success" />
            <span className="text-sm">Shared location</span>
          </div>
        );
      default:
        return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn('flex gap-2 px-4 py-0.5 group', isSent ? 'justify-end' : 'justify-start')}
      onDoubleClick={() => onReply?.(message)}
    >
      {!isSent && showAvatar && (
        <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center text-sm flex-shrink-0 mt-auto">
          {chatAvatar}
        </div>
      )}
      {!isSent && !showAvatar && <div className="w-7 flex-shrink-0" />}

      <div className={cn('relative max-w-[75%] min-w-[80px]')}>
        {/* Reply preview */}
        {replyPreview && (
          <div className={cn(
            'text-xs px-3 py-1.5 rounded-t-xl mb-[-4px] border-l-2 border-violet',
            isSent ? 'bg-white/5' : 'bg-white/5'
          )}>
            <p className="text-violet text-[10px] font-medium">Reply</p>
            <p className="text-text-secondary truncate">{replyPreview.content}</p>
          </div>
        )}

        <div
          className={cn(
            'relative px-3 py-2',
            isSent ? 'bubble-sent text-white' : 'bubble-received text-text-primary'
          )}
          onMouseEnter={() => setShowReactions(false)}
        >
          {renderContent()}

          <div className={cn('flex items-center gap-1 mt-1', isSent ? 'justify-end' : 'justify-start')}>
            <span className={cn('text-[10px]', isSent ? 'text-white/50' : 'text-text-muted')}>{time}</span>
            {isSent && (
              message.read
                ? <CheckCheck size={12} className="text-blue-400" />
                : <Check size={12} className={cn(message.delivered ? 'text-white/50' : 'text-white/30')} />
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={cn('flex gap-1 mt-0.5', isSent ? 'justify-end' : 'justify-start')}>
            {message.reactions.map((r, i) => (
              <span key={i} className="text-xs bg-navy-700 border border-white/[0.06] rounded-full px-1.5 py-0.5">
                {r.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Reaction trigger */}
        <button
          onClick={() => setShowReactions(!showReactions)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-navy-700 border border-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
            isSent ? '-left-9' : '-right-9'
          )}
        >
          <SmilePlus size={13} className="text-text-secondary" />
        </button>

        <AnimatePresence>
          {showReactions && (
            <div className={cn('absolute bottom-full mb-1 z-20', isSent ? 'right-0' : 'left-0')}>
              <ReactionPicker
                onSelect={(emoji) => onReact?.(message.id, emoji)}
                onClose={() => setShowReactions(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
