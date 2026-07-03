import { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Image, FileText, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Message } from '../../types';

interface ChatInputProps {
  onSend: (content: string, type?: string) => void;
  replyTo?: Message | null;
  onCancelReply?: () => void;
}

export function ChatInput({ onSend, replyTo, onCancelReply }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [recording, setRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/[0.06] bg-navy-900/90 backdrop-blur-lg">
      {/* Reply preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800 border-l-2 border-violet"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet font-medium">Replying to</p>
              <p className="text-xs text-text-secondary truncate">{replyTo.content}</p>
            </div>
            <button onClick={onCancelReply} className="text-text-secondary hover:text-text-primary p-1">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 px-3 py-2">
        {/* Attachment button */}
        <div className="relative">
          <button
            onClick={() => setShowAttach(!showAttach)}
            className={cn('p-2 rounded-full transition-colors', showAttach ? 'bg-violet/20 text-violet' : 'text-text-secondary hover:text-text-primary')}
          >
            <Paperclip size={20} />
          </button>

          <AnimatePresence>
            {showAttach && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-12 left-0 glass-elevated rounded-xl p-2 flex flex-col gap-1 min-w-[140px] shadow-elevated z-20"
              >
                {[
                  { icon: Image, label: 'Photo', action: 'image' },
                  { icon: FileText, label: 'File', action: 'file' },
                  { icon: MapPin, label: 'Location', action: 'location' },
                ].map((item) => (
                  <button
                    key={item.action}
                    onClick={() => { onSend(`[${item.label}]`, item.action); setShowAttach(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors text-sm"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="input-nexus flex-1 py-2.5 text-sm"
          id="chat-input"
        />

        {/* Send or Mic button */}
        <AnimatePresence mode="wait">
          {text.trim() ? (
            <motion.button
              key="send"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleSend}
              className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center shadow-glow-sm"
            >
              <Send size={18} className="text-white ml-0.5" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setRecording(!recording)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                recording ? 'bg-danger animate-pulse' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
            >
              <Mic size={20} className={recording ? 'text-white' : ''} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
