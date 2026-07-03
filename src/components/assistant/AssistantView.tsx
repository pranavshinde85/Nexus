import { useRef, useEffect, useState } from 'react';
import { useAssistantStore } from '../../stores/assistantStore';
import { useAppStore } from '../../stores/appStore';
import { useTasksStore } from '../../stores/tasksStore';
import { useNotesStore } from '../../stores/notesStore';
import { useChatStore } from '../../stores/chatStore';
import { AssistantBubble } from './AssistantBubble';
import { SuggestionChips } from './SuggestionChips';
import { AssistantInput } from './AssistantInput';
import { Sparkles, Settings, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AssistantView() {
  const { messages, addMessage, updateMessage, isTyping, setTyping } = useAssistantStore();
  const { apiKey, setApiKey } = useAppStore();
  const tasks = useTasksStore((s) => s.tasks);
  const notes = useNotesStore((s) => s.notes);
  const chats = useChatStore((s) => s.chats);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  const sendMessage = async (text: string) => {
    addMessage({ role: 'user' as const, content: text });

    if (!apiKey) {
      // Fallback: generate a mock AI response
      setTyping(true);
      const aiId = addMessage({ role: 'assistant', content: '', isStreaming: true });

      const todayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'done');
      const unreadCount = chats.reduce((s, c) => s + c.unreadCount, 0);
      const mockResponse = generateMockResponse(text, todayTasks.length, unreadCount, notes.length);

      // Simulate streaming
      let i = 0;
      const interval = setInterval(() => {
        i += 2;
        if (i >= mockResponse.length) {
          updateMessage(aiId, { content: mockResponse, isStreaming: false });
          setTyping(false);
          clearInterval(interval);
        } else {
          updateMessage(aiId, { content: mockResponse.substring(0, i) });
        }
      }, 15);
      return;
    }

    // Real API call
    setTyping(true);
    const aiId = addMessage({ role: 'assistant', content: '', isStreaming: true });

    try {
      const todayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'done');
      const unreadCount = chats.reduce((s, c) => s + c.unreadCount, 0);

      const systemPrompt = `You are NEXUS AI, a personal assistant integrated into the NEXUS super-app. Be concise, helpful, and friendly. Use emojis sparingly.

Context:
- User has ${tasks.length} total tasks, ${todayTasks.length} due today
- ${unreadCount} unread messages
- ${notes.length} notes
- Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

Tasks due today: ${todayTasks.map(t => t.title).join(', ') || 'None'}`;

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            ...messages.filter(m => !m.isStreaming).slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const aiContent = data.content?.[0]?.text || 'Sorry, I couldn\'t process that request.';

      // Simulate streaming for the response
      let i = 0;
      const interval = setInterval(() => {
        i += 3;
        if (i >= aiContent.length) {
          updateMessage(aiId, { content: aiContent, isStreaming: false });
          setTyping(false);
          clearInterval(interval);
        } else {
          updateMessage(aiId, { content: aiContent.substring(0, i) });
        }
      }, 10);
    } catch (err: any) {
      updateMessage(aiId, { content: `⚠️ Error: ${err.message}. Please check your API key in settings.`, isStreaming: false });
      setTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Gradient header */}
      <div className="gradient-header px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-white">NEXUS AI</h2>
          <p className="text-[11px] text-white/70">{isTyping ? 'Thinking...' : 'Your personal assistant'}</p>
        </div>
        <button onClick={() => { setKeyInput(apiKey); setShowKeyModal(true); }} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Settings size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
            <div className="w-16 h-16 rounded-full gradient-violet flex items-center justify-center shadow-glow animate-pulse-glow">
              <Bot size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-text-primary text-center">Hello! I'm NEXUS AI</h3>
            <p className="text-sm text-text-secondary text-center max-w-[280px]">Your personal assistant. Ask me about your tasks, notes, or anything else!</p>
          </div>
        )}

        {messages.map((msg) => (
          <AssistantBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length < 3 && <SuggestionChips onSelect={sendMessage} />}

      {/* Input */}
      <AssistantInput onSend={sendMessage} disabled={isTyping} />

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowKeyModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-navy-800 rounded-2xl p-5 shadow-elevated border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary">AI Settings</h3>
                <button onClick={() => setShowKeyModal(false)}><X size={18} className="text-text-secondary" /></button>
              </div>
              <label className="text-xs text-text-muted mb-1.5 block">Anthropic API Key</label>
              <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="sk-ant-..." className="input-nexus py-2.5 text-sm mb-1" />
              <p className="text-[10px] text-text-muted mb-4">Without an API key, the assistant uses mock responses.</p>
              <button onClick={() => { setApiKey(keyInput); setShowKeyModal(false); }} className="w-full py-2.5 rounded-xl gradient-violet text-white text-sm font-medium shadow-glow-sm">Save</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateMockResponse(query: string, todayTasks: number, unread: number, noteCount: number): string {
  const q = query.toLowerCase();
  if (q.includes('briefing') || q.includes('morning') || q.includes('today')) {
    return `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}! Here's your briefing:\n\n📋 ${todayTasks} task${todayTasks !== 1 ? 's' : ''} due today\n💬 ${unread} unread message${unread !== 1 ? 's' : ''}\n📝 ${noteCount} notes in your collection\n\nWould you like to review your tasks or check your messages?`;
  }
  if (q.includes('task') && q.includes('due')) {
    return `You have ${todayTasks} task${todayTasks !== 1 ? 's' : ''} due today. Would you like me to list them out, or would you prefer to create a new task?`;
  }
  if (q.includes('summarize') && q.includes('note')) {
    return `I can see you have ${noteCount} notes. To summarize a specific note, please open it and tap the ✨ Enhance button, then select "Summarize". I'll create a concise summary for you!`;
  }
  if (q.includes('create') && q.includes('task')) {
    return `I'd be happy to help create a task! Please tell me:\n\n1. **Task title** — What needs to be done?\n2. **Due date** — When should it be completed?\n3. **Priority** — Low, Medium, High, or Urgent?\n\nOr just describe it naturally, like "Remind me to call the doctor tomorrow at 10am"`;
  }
  if (q.includes('draft') && q.includes('message')) {
    return `Sure! I can help draft a message. Who would you like to message, and what's the general topic? I'll compose something for you to review before sending.`;
  }
  if (q.includes('find') && q.includes('file')) {
    return `I can search your vault! What type of file are you looking for? You can describe it by name, tag, or type (document, image, video). For example: "Find my budget spreadsheet" or "Show me travel photos."`;
  }
  if (q.includes('to-do') || q.includes('todo')) {
    return `Here's a fresh to-do list template for you:\n\n☐ Review emails and messages\n☐ Complete top priority task\n☐ Team standup / sync meeting\n☐ Work on current project\n☐ Review and plan tomorrow\n\nWould you like me to create these as actual tasks in your task manager?`;
  }
  return `I understand you're asking about: "${query}"\n\nI'm your NEXUS AI assistant — I can help with:\n\n• 📋 Managing tasks and reminders\n• 📝 Summarizing or enhancing notes\n• 📁 Finding files in your vault\n• ✉️ Drafting messages\n• 🌅 Daily briefings\n\nFor the best experience, add your Anthropic API key in settings (tap the ⚙️ icon above).`;
}
