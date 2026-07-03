import { useMemo, useRef, useEffect, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Phone, Video, MoreVertical } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../../types';
import { format, isToday, isYesterday } from 'date-fns';
import { CURRENT_USER_ID } from '../../utils/constants';

export function ChatView() {
  const { activeChatId, setActiveChat, chats, sendMessage, addReaction, markAsRead } = useChatStore();
  const chat = chats.find((c) => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  useEffect(() => {
    if (activeChatId) markAsRead(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages.length]);

  const groupedMessages = useMemo(() => {
    if (!chat) return [];
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    
    chat.messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msg.timestamp, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  }, [chat?.messages]);

  if (!chat) return null;

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const handleSend = (content: string, type?: string) => {
    sendMessage(chat.id, content, (type as any) || 'text');
    setReplyTo(null);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="h-full flex flex-col bg-navy-900"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/[0.06] bg-navy-800/80 backdrop-blur-lg">
        <button
          onClick={() => setActiveChat(null)}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] md:hidden"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-lg relative">
          {chat.avatar}
          {chat.online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-navy-800" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-text-primary truncate">{chat.name}</h2>
          <p className="text-[11px] text-text-secondary">
            {chat.typing ? (
              <span className="text-success">typing...</span>
            ) : chat.online ? (
              'online'
            ) : chat.isGroup ? (
              `${chat.participants.length} members`
            ) : (
              'last seen recently'
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success">
            <Lock size={10} />
            <span className="text-[10px] font-medium">E2E</span>
          </div>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04]">
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex justify-center my-3">
              <span className="text-[11px] text-text-muted bg-navy-800/80 px-3 py-1 rounded-full">
                {getDateLabel(group.date)}
              </span>
            </div>
            {group.messages.map((msg, i) => {
              const isSent = msg.senderId === CURRENT_USER_ID;
              const prevMsg = i > 0 ? group.messages[i - 1] : null;
              const showAvatar = !isSent && (!prevMsg || prevMsg.senderId !== msg.senderId);
              const replyMsg = msg.replyTo ? chat.messages.find(m => m.id === msg.replyTo) : null;

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isSent={isSent}
                  showAvatar={showAvatar}
                  chatAvatar={chat.avatar}
                  onReply={(m) => setReplyTo(m)}
                  onReact={(msgId, emoji) => addReaction(chat.id, msgId, emoji)}
                  replyPreview={replyMsg || null}
                />
              );
            })}
          </div>
        ))}

        {chat.typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </motion.div>
  );
}
