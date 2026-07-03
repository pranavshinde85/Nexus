import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { ArrowLeft, Camera, Sun, Moon, Monitor, Lock, Trash2, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ThemeMode } from '../../types';

const EMOJIS = ['😊', '😎', '🚀', '💜', '🎨', '🧑‍💻', '👩‍💼', '🦊', '🐱', '🌟'];

interface ProfileScreenProps { onClose: () => void; }

export function ProfileScreen({ onClose }: ProfileScreenProps) {
  const { user, updateProfile, privacySettings, togglePrivacy, logout } = useAuthStore();
  const { theme, setTheme, apiKey, setApiKey } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '😊');
  const [showEmojis, setShowEmojis] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);

  const handleSave = () => {
    updateProfile({ name, bio, avatar });
    setApiKey(localKey);
    setEditing(false);
  };

  const themes: { id: ThemeMode; icon: typeof Sun; label: string }[] = [
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="h-full flex flex-col bg-navy-900 overflow-y-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"><ArrowLeft size={20} /></button>
        <h2 className="text-sm font-semibold text-text-primary">Profile & Settings</h2>
        <div className="flex-1" />
        {editing ? (
          <button onClick={handleSave} className="px-3 py-1 rounded-lg bg-violet text-white text-xs font-medium">Save</button>
        ) : (
          <button onClick={() => setEditing(true)} className="px-3 py-1 rounded-lg bg-white/[0.04] text-text-secondary text-xs">Edit</button>
        )}
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-navy-700 flex items-center justify-center text-4xl border-2 border-violet shadow-glow-sm">{avatar}</div>
            {editing && (
              <button onClick={() => setShowEmojis(!showEmojis)} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-violet flex items-center justify-center border-2 border-navy-900">
                <Camera size={14} className="text-white" />
              </button>
            )}
          </div>
          {editing && showEmojis && (
            <div className="flex gap-2 flex-wrap justify-center">
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => { setAvatar(e); setShowEmojis(false); }} className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-lg hover:bg-navy-600">{e}</button>
              ))}
            </div>
          )}
          {editing ? (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-nexus py-2 text-center text-sm font-semibold max-w-[200px]" />
          ) : (
            <h3 className="text-lg font-bold text-text-primary">{user?.name || 'User'}</h3>
          )}
          {editing ? (
            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio..." className="input-nexus py-1.5 text-center text-xs max-w-[250px]" />
          ) : (
            <p className="text-xs text-text-secondary">{user?.bio || ''}</p>
          )}
        </div>

        {/* Theme */}
        <div className="glass rounded-xl p-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Appearance</h4>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button key={t.id} onClick={() => setTheme(t.id)} className={cn('flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all', theme === t.id ? 'bg-violet/15 text-violet border border-violet/30' : 'bg-white/[0.02] text-text-secondary border border-transparent')}>
                <t.icon size={18} />
                <span className="text-[11px] font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="glass rounded-xl p-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Privacy</h4>
          {[
            { key: 'lastSeen' as const, label: 'Last Seen' },
            { key: 'profilePhoto' as const, label: 'Profile Photo' },
            { key: 'readReceipts' as const, label: 'Read Receipts' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <span className="text-sm text-text-primary">{item.label}</span>
              <button onClick={() => togglePrivacy(item.key)} className={cn('w-10 h-5 rounded-full transition-colors relative', privacySettings?.[item.key] ? 'bg-violet' : 'bg-navy-600')}>
                <div className={cn('w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform', privacySettings?.[item.key] ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
          ))}
        </div>

        {/* AI Settings */}
        <div className="glass rounded-xl p-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">AI Settings</h4>
          <label className="text-xs text-text-secondary mb-1 block">Anthropic API Key</label>
          <input type="password" value={localKey} onChange={(e) => setLocalKey(e.target.value)} onBlur={() => setApiKey(localKey)} placeholder="sk-ant-..." className="input-nexus py-2 text-xs" />
        </div>

        {/* About */}
        <div className="glass rounded-xl p-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">About</h4>
          <p className="text-xs text-text-secondary">NEXUS v1.0.0</p>
        </div>

        {/* Sign out */}
        <button onClick={() => { logout(); onClose(); }} className="w-full py-3 rounded-xl border border-danger/30 text-danger text-sm font-medium flex items-center justify-center gap-2 hover:bg-danger/10 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
