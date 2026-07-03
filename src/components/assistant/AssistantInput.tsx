import { useState, useRef } from 'react';
import { Send, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AssistantInputProps { onSend: (text: string) => void; disabled?: boolean; }

export function AssistantInput({ onSend, disabled }: AssistantInputProps) {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setRecording(true);
    recognition.onresult = (e: any) => { setText(e.results[0][0].transcript); setRecording(false); };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognition.start();
  };

  return (
    <div className="border-t border-white/[0.06] bg-navy-900/90 backdrop-blur-lg px-3 py-2 safe-bottom">
      <div className="flex items-center gap-2">
        <button
          onClick={handleVoice}
          className={cn('p-2 rounded-full transition-colors flex-shrink-0', recording ? 'bg-danger text-white animate-pulse' : 'text-text-secondary hover:text-text-primary')}
        >
          <Mic size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask NEXUS AI anything..."
          className="input-nexus flex-1 py-2.5 text-sm"
          disabled={disabled}
        />

        <AnimatePresence>
          {text.trim() && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleSend}
              className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center shadow-glow-sm flex-shrink-0"
            >
              <Send size={18} className="text-white ml-0.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
