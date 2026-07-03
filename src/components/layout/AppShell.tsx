import { ReactNode } from 'react';
import { useAppStore } from '../../stores/appStore';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { cn } from '../../utils/cn';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-navy-900" id="app-shell">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main
        className={cn(
          'flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300',
          'md:ml-[72px]',
          !sidebarCollapsed && 'md:ml-[240px]'
        )}
      >
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
