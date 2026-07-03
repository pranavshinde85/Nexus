import { Note } from '../types';

const day = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const initialNotes: Note[] = [
  {
    id: 'n1', title: 'Q4 Sprint Planning Notes', type: 'text', coverColor: '#7C3AED', pinned: true,
    tags: ['work', 'sprint', 'planning'],
    content: '<h2>Sprint Goals</h2><p>Focus on the core product features for the Q4 release. Key deliverables include:</p><ul><li>Complete the new dashboard redesign</li><li>Implement real-time notifications</li><li>Fix critical auth bugs reported by QA</li></ul><h3>Team Assignments</h3><p>Alex — Backend API refactoring</p><p>Priya — UI component library</p><p>Marcus — Illustration assets</p><hr><p><strong>Next review:</strong> Friday 3pm</p>',
    createdAt: day(5), updatedAt: day(1),
  },
  {
    id: 'n2', title: 'Article Draft: Future of AI', type: 'text', coverColor: '#3B82F6', pinned: false,
    tags: ['writing', 'ai', 'draft'],
    content: '<h1>The Future of AI in Everyday Apps</h1><p>Artificial intelligence is no longer a futuristic concept—it\'s embedded in the tools we use daily. From smart assistants to code completion, AI is transforming how we work, create, and communicate.</p><p>In this article, I explore three key trends that will shape the next decade of AI-powered applications:</p><h2>1. Contextual Understanding</h2><p>Future AI systems will understand not just what you say, but the context around it—your schedule, preferences, and history.</p><h2>2. Multimodal Interactions</h2><p>Voice, text, images, and gestures will blend seamlessly in AI interfaces.</p><h2>3. Privacy-First AI</h2><p>On-device processing will become the norm, keeping user data private while still delivering powerful features.</p>',
    createdAt: day(10), updatedAt: day(3),
  },
  {
    id: 'n3', title: 'Trip Packing List ✈️', type: 'checklist', coverColor: '#10B981', pinned: false,
    tags: ['personal', 'travel'],
    content: '',
    checklist: [
      { id: 'cl1', text: 'Passport & travel documents', checked: true },
      { id: 'cl2', text: 'Phone charger & power bank', checked: true },
      { id: 'cl3', text: 'Noise-canceling headphones', checked: true },
      { id: 'cl4', text: 'Toiletries bag', checked: false },
      { id: 'cl5', text: 'Weather-appropriate clothing', checked: false },
      { id: 'cl6', text: 'Travel insurance printout', checked: false },
      { id: 'cl7', text: 'Snacks for the flight', checked: false },
    ],
    createdAt: day(3), updatedAt: day(1),
  },
  {
    id: 'n4', title: 'Sprint Backlog Tasks', type: 'checklist', coverColor: '#F59E0B', pinned: false,
    tags: ['work', 'sprint'],
    content: '',
    checklist: [
      { id: 'cl8', text: 'Setup CI/CD pipeline', checked: true },
      { id: 'cl9', text: 'Write unit tests for auth module', checked: true },
      { id: 'cl10', text: 'Design system documentation', checked: false },
      { id: 'cl11', text: 'API endpoint review', checked: false },
      { id: 'cl12', text: 'Performance benchmarks', checked: false },
    ],
    createdAt: day(7), updatedAt: day(2),
  },
  {
    id: 'n5', title: 'React Hooks Cheatsheet', type: 'text', coverColor: '#06B6D4', pinned: true,
    tags: ['code', 'react', 'reference'],
    content: '<h2>Essential React Hooks</h2><pre><code>// useState\nconst [count, setCount] = useState(0);\n\n// useEffect\nuseEffect(() =&gt; {\n  fetchData();\n  return () =&gt; cleanup();\n}, [dependency]);\n\n// useCallback\nconst memoized = useCallback(() =&gt; {\n  doSomething(a, b);\n}, [a, b]);\n\n// useMemo\nconst expensive = useMemo(() =&gt; {\n  return computeExpensiveValue(a);\n}, [a]);</code></pre><h3>Custom Hook Pattern</h3><pre><code>function useLocalStorage(key, initialValue) {\n  const [stored, setStored] = useState(() =&gt; {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : initialValue;\n  });\n  // ...\n}</code></pre>',
    createdAt: day(20), updatedAt: day(8),
  },
  {
    id: 'n6', title: 'Meeting with Client — Key Takeaways', type: 'text', coverColor: '#EC4899', pinned: false,
    tags: ['work', 'client', 'meeting'],
    content: '<h2>Client Meeting — Dec 5</h2><p><strong>Attendees:</strong> John (Client), Priya, Alex, Me</p><h3>Key Points</h3><ul><li>Client wants to launch MVP by end of January</li><li>Mobile-first approach confirmed</li><li>Budget approved for additional developer</li><li>Weekly demos starting next Monday</li></ul><h3>Action Items</h3><ul><li>Send updated timeline by Friday</li><li>Schedule design review with client\'s team</li><li>Prepare cost breakdown for Phase 2</li></ul><blockquote>Client emphasized: "Quality over speed — we want it done right"</blockquote>',
    createdAt: day(6), updatedAt: day(6),
  },
  {
    id: 'n7', title: 'Random Ideas 💡', type: 'text', coverColor: '#F97316', pinned: false,
    tags: ['ideas', 'personal'],
    content: '<h2>App Ideas</h2><ul><li>AI-powered meal planner based on what\'s in the fridge</li><li>Habit tracker with social accountability</li><li>Voice journal that auto-transcribes and tags entries</li></ul><h2>Blog Post Ideas</h2><ul><li>"Why I switched from VS Code to Neovim"</li><li>"Building a design system from scratch"</li><li>"The art of code review"</li></ul>',
    createdAt: day(15), updatedAt: day(4),
  },
  {
    id: 'n8', title: 'Sketch: App Logo Concepts', type: 'sketch', coverColor: '#8B5CF6', pinned: false,
    tags: ['design', 'branding'],
    content: '',
    sketchData: '',
    createdAt: day(12), updatedAt: day(9),
  },
];
