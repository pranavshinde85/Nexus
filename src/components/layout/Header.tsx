import { useAppStore } from '../../stores/appStore';
import { TAB_LABELS } from '../../utils/constants';
import { Search, User, Settings } from 'lucide-react';

interface HeaderProps {
  onProfileClick?: () => void;
}

export function Header({ onProfileClick }: HeaderProps) {
  const { activeTab, setSearchOpen } = useAppStore();

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-white/[0.06] bg-navy-900/80 backdrop-blur-lg sticky top-0 z-30"
      id="app-header"
    >
      <h1 className="text-lg font-semibold text-text-primary">
        {TAB_LABELS[activeTab]}
      </h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          id="header-search"
        >
          <Search size={20} />
        </button>
        <button
          onClick={onProfileClick}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          id="header-profile"
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
