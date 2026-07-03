import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './stores/appStore';
import { useChatStore } from './stores/chatStore';
import { useVaultStore } from './stores/vaultStore';
import { useNotesStore } from './stores/notesStore';
import { useTasksStore } from './stores/tasksStore';
import { useAuthStore } from './stores/authStore';
import { initialFiles, initialFolders } from './data/mockFiles';
import { initialTasks } from './data/mockTasks';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { FAB } from './components/layout/FAB';

import { ChatList } from './components/chat/ChatList';
import { ChatView } from './components/chat/ChatView';
import { VaultView } from './components/vault/VaultView';
import { NotesList } from './components/notes/NotesList';
import { NoteEditor } from './components/notes/NoteEditor';
import { TasksView } from './components/tasks/TasksView';
import { AssistantView } from './components/assistant/AssistantView';
import { OnboardingScreen } from './components/auth/OnboardingScreen';
import { ProfileScreen } from './components/auth/ProfileScreen';
import { PinLock } from './components/auth/PinLock';
import { TaskModal } from './components/tasks/TaskModal';
import { UploadModal } from './components/vault/UploadModal';

function App() {
  const { activeTab, isOnboarded } = useAppStore();
  const activeChatId = useChatStore((s) => s.activeChatId);
  const activeNoteId = useNotesStore((s) => s.activeNoteId);
  const { isLocked } = useAuthStore();

  const [showProfile, setShowProfile] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Seed stores with mock data on first mount
  useEffect(() => {
    const vault = useVaultStore.getState();
    if (vault.files.length === 0) {
      vault.setFiles(initialFiles as any);
      vault.setFolders(initialFolders);
    }
    const tasks = useTasksStore.getState();
    if (tasks.tasks.length === 0) {
      tasks.setTasks(initialTasks as any);
    }
  }, []);

  // Onboarding screen
  if (!isOnboarded) {
    return <OnboardingScreen />;
  }

  // PIN lock screen
  if (isLocked) {
    return <PinLock />;
  }

  // Profile screen
  if (showProfile) {
    return <ProfileScreen onClose={() => setShowProfile(false)} />;
  }

  // Handle FAB action
  const handleFabAction = () => {
    switch (activeTab) {
      case 'tasks':
        setShowTaskModal(true);
        break;
      case 'vault':
        setShowUploadModal(true);
        break;
      case 'notes':
        useNotesStore.getState().createNote({
          title: '',
          content: '',
          type: 'text',
          coverColor: '#7C3AED',
          tags: [],
        });
        break;
      default:
        break;
    }
  };

  // Render active module content
  const renderContent = () => {
    if (activeTab === 'chat' && activeChatId) {
      return <ChatView key="chat-view" />;
    }
    if (activeTab === 'notes' && activeNoteId) {
      return <NoteEditor key="note-editor" />;
    }

    switch (activeTab) {
      case 'chat':
        return <ChatList key="chat-list" />;
      case 'vault':
        return <VaultView key="vault" />;
      case 'notes':
        return <NotesList key="notes" />;
      case 'tasks':
        return <TasksView key="tasks" />;
      case 'assistant':
        return <AssistantView key="assistant" />;
      default:
        return <ChatList key="chat-list" />;
    }
  };

  const showHeaderAndFab = !(
    (activeTab === 'chat' && activeChatId) ||
    (activeTab === 'notes' && activeNoteId) ||
    activeTab === 'assistant'
  );

  return (
    <AppShell>
      {showHeaderAndFab && (
        <Header onProfileClick={() => setShowProfile(true)} />
      )}

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeChatId || '') + (activeNoteId || '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showHeaderAndFab && <FAB onAction={handleFabAction} />}

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </AppShell>
  );
}

export default App;
