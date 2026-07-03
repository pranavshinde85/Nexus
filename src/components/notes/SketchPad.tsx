import { useRef, useState, useCallback, useEffect } from 'react';
import { Eraser, Undo2, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const COLORS = ['#F0F6FF', '#7C3AED', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6'];
const SIZES = [2, 5, 10];

interface SketchPadProps { data?: string; onChange?: (data: string) => void; }

export function SketchPad({ data, onChange }: SketchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#F0F6FF');
  const [size, setSize] = useState(3);
  const [eraser, setEraser] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent) => {
    setDrawing(true);
    lastPos.current = getPos(e);
    const canvas = canvasRef.current;
    if (canvas) history.current.push(canvas.toDataURL());
  };

  const draw = (e: React.PointerEvent) => {
    if (!drawing || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = eraser ? '#0D1117' : color;
    ctx.lineWidth = eraser ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    setDrawing(false);
    lastPos.current = null;
    if (canvasRef.current) onChange?.(canvasRef.current.toDataURL());
  };

  const undo = () => {
    const prev = history.current.pop();
    if (!prev) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const img = new window.Image();
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); };
    img.src = prev;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) { history.current.push(canvas.toDataURL()); ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  };

  return (
    <div className="flex flex-col h-full">
      <canvas
        ref={canvasRef}
        className="flex-1 cursor-crosshair rounded-lg touch-none"
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />
      <div className="flex items-center justify-center gap-3 py-2 px-4 glass rounded-xl mt-2">
        {COLORS.map((c) => (
          <button key={c} onClick={() => { setColor(c); setEraser(false); }} className={cn('w-6 h-6 rounded-full border-2 transition-transform', color === c && !eraser ? 'border-white scale-110' : 'border-transparent')} style={{ backgroundColor: c }} />
        ))}
        <div className="w-px h-5 bg-white/[0.06] mx-1" />
        {SIZES.map((s) => (
          <button key={s} onClick={() => setSize(s)} className={cn('rounded-full bg-text-primary transition-transform', size === s ? 'ring-2 ring-violet' : '')} style={{ width: s + 6, height: s + 6 }} />
        ))}
        <div className="w-px h-5 bg-white/[0.06] mx-1" />
        <button onClick={() => setEraser(!eraser)} className={cn('p-1.5 rounded-lg transition-colors', eraser ? 'bg-violet/20 text-violet' : 'text-text-secondary hover:text-text-primary')}>
          <Eraser size={16} />
        </button>
        <button onClick={undo} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
          <Undo2 size={16} />
        </button>
        <button onClick={clear} className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
