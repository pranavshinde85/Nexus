import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';
import { ActiveTab } from '../../types';
import { cn } from '../../utils/cn';
import { MessageCircle, FolderArchive, StickyNote, CheckSquare, Bot, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs: { id: ActiveTab; icon: typeof MessageCircle; label: string }[] = [
  { id: 'chat', icon: MessageCircle, label: 'Chats' },
  { id: 'vault', icon: FolderArchive, label: 'Vault' },
  { id: 'notes', icon: StickyNote, label: 'Notes' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'assistant', icon: Bot, label: 'AI' },
];

export function Sidebar() {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useAppStore();
  const chats = useChatStore((s) => s.chats);
  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <aside
      className={cn('sidebar hidden md:flex', !sidebarCollapsed && 'expanded')}
      id="sidebar"
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-white/[0.06]">
        <AnimatePresence mode="wait">
          {sidebarCollapsed ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <Sparkles className="text-violet" size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-violet" size={22} />
              <span className="text-lg font-bold text-gradient">NEXUS</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 p-3 mt-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const showBadge = tab.id === 'chat' && totalUnread > 0;

          return (
            <button
              key={tab.id}
              id={`sidebar-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-3 rounded-xl transition-all duration-200',
                sidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3',
                isActive
                  ? 'bg-violet/15 text-violet'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-violet"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2.5 badge text-[10px] min-w-[16px] h-[16px] px-1">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && (
                <span className={cn('text-sm font-medium', isActive && 'font-semibold')}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          id="sidebar-toggle"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
