import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';
import { ActiveTab } from '../../types';
import { cn } from '../../utils/cn';
import { MessageCircle, FolderArchive, StickyNote, CheckSquare, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs: { id: ActiveTab; icon: typeof MessageCircle; label: string }[] = [
  { id: 'chat', icon: MessageCircle, label: 'Chats' },
  { id: 'vault', icon: FolderArchive, label: 'Vault' },
  { id: 'notes', icon: StickyNote, label: 'Notes' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'assistant', icon: Bot, label: 'AI' },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();
  const chats = useChatStore((s) => s.chats);
  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <nav className="bottom-nav md:hidden safe-bottom" id="bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const showBadge = tab.id === 'chat' && totalUnread > 0;

        return (
          <button
            key={tab.id}
            id={`nav-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200',
              isActive ? 'text-violet' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {showBadge && (
                <span className="absolute -top-1.5 -right-2.5 badge text-[10px] min-w-[16px] h-[16px] px-1">
                  {totalUnread > 99 ? '99+' : totalUnread}
                </span>
              )}
            </div>
            <span className={cn('text-[10px] font-medium', isActive && 'text-violet')}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
