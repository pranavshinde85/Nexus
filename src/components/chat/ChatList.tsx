import { useMemo, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { StatusBar } from './StatusBar';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Search, Pin, VolumeX, Archive } from 'lucide-react';
import { formatChatTime } from '../../utils/formatters';
import { CURRENT_USER_ID } from '../../utils/constants';

export function ChatList() {
  const { chats, setActiveChat, searchQuery, setSearchQuery } = useChatStore();
  const [localSearch, setLocalSearch] = useState('');

  const query = localSearch.toLowerCase();
  const visibleChats = useMemo(() => {
    return chats
      .filter((c) => !c.archived)
      .filter((c) => !query || c.name.toLowerCase().includes(query) || c.lastMessage?.content.toLowerCase().includes(query));
  }, [chats, query]);

  const pinnedChats = visibleChats.filter((c) => c.pinned);
  const otherChats = visibleChats.filter((c) => !c.pinned);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <StatusBar />

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search chats..."
            className="input-nexus pl-9 py-2 text-sm"
            id="chat-search"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {pinnedChats.length > 0 && (
          <div className="px-4 py-1">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Pinned</span>
          </div>
        )}

        {pinnedChats.map((chat, i) => (
          <ChatRow key={chat.id} chat={chat} index={i} onClick={() => setActiveChat(chat.id)} />
        ))}

        {pinnedChats.length > 0 && otherChats.length > 0 && (
          <div className="px-4 py-1 mt-1">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">All Chats</span>
          </div>
        )}

        {otherChats.map((chat, i) => (
          <ChatRow key={chat.id} chat={chat} index={i + pinnedChats.length} onClick={() => setActiveChat(chat.id)} />
        ))}

        {visibleChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
            <p className="text-sm">No chats found</p>
          </div>
        )}

        {/* Bottom padding for mobile nav */}
        <div className="h-20 md:h-4" />
      </div>
    </div>
  );
}

function ChatRow({ chat, index, onClick }: { chat: any; index: number; onClick: () => void }) {
  const lastMsg = chat.lastMessage;
  const isSentByMe = lastMsg?.senderId === CURRENT_USER_ID;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
      id={`chat-row-${chat.id}`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
          {chat.avatar}
        </div>
        {chat.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-navy-900" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">{chat.name}</span>
            {chat.pinned && <Pin size={12} className="text-text-muted flex-shrink-0 rotate-45" />}
            {chat.muted && <VolumeX size={12} className="text-text-muted flex-shrink-0" />}
          </div>
          <span className={cn(
            'text-[11px] flex-shrink-0 ml-2',
            chat.unreadCount > 0 ? 'text-success font-medium' : 'text-text-muted'
          )}>
            {lastMsg ? formatChatTime(lastMsg.timestamp) : ''}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-text-secondary truncate flex-1">
            {chat.typing ? (
              <span className="text-success italic">typing...</span>
            ) : lastMsg ? (
              <>
                {isSentByMe && <span className="text-text-muted">You: </span>}
                {chat.isGroup && !isSentByMe && lastMsg.senderId !== CURRENT_USER_ID && (
                  <span className="text-text-muted">{chat.participants.find((p: any) => p.id === lastMsg.senderId)?.name?.split(' ')[0] || ''}: </span>
                )}
                {lastMsg.type === 'image' ? '📷 Photo' :
                 lastMsg.type === 'voice' ? '🎤 Voice message' :
                 lastMsg.type === 'file' ? `📎 ${lastMsg.fileName || 'File'}` :
                 lastMsg.type === 'location' ? '📍 Location' :
                 lastMsg.content}
              </>
            ) : (
              'No messages yet'
            )}
          </p>
          {chat.unreadCount > 0 && (
            <span className="badge ml-2 flex-shrink-0">{chat.unreadCount}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
