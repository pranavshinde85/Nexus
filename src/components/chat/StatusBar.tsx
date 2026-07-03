import { useChatStore } from '../../stores/chatStore';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function StatusBar() {
  const statuses = useChatStore((s) => s.statuses);

  const myStatus = {
    id: 'my-status',
    avatar: '😊',
    userName: 'Your story',
    viewed: true,
    isOwn: true,
  };

  const allStatuses = [myStatus, ...statuses.map(s => ({ ...s, isOwn: false }))];

  return (
    <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/[0.06]">
      {allStatuses.map((status, i) => (
        <motion.button
          key={status.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex flex-col items-center gap-1 min-w-[60px]"
        >
          <div className={cn(
            'relative rounded-full p-[2px]',
            status.isOwn ? 'status-ring-none' : (('viewed' in status && status.viewed) ? 'status-ring-viewed' : 'status-ring')
          )}>
            <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
              {status.avatar}
            </div>
            {status.isOwn && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-violet flex items-center justify-center border-2 border-navy-900">
                <Plus size={10} className="text-white" />
              </div>
            )}
          </div>
          <span className="text-[10px] text-text-secondary truncate max-w-[60px]">
            {status.userName}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
