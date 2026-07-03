import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { motion } from 'framer-motion';
import { Sparkles, Fingerprint, Delete } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PinLock() {
  const { verifyPin } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      const ok = verifyPin(next);
      if (!ok) {
        setError(true);
        setTimeout(() => { setError(false); setPin(''); }, 600);
      }
    }
  };

  const handleDelete = () => setPin(pin.slice(0, -1));

  return (
    <div className="h-screen w-screen bg-navy-900 flex flex-col items-center justify-center p-6">
      <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-violet flex items-center justify-center mx-auto mb-6 shadow-glow">
          <Sparkles size={28} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-text-primary mb-2">Unlock NEXUS</h2>
        <p className="text-sm text-text-secondary mb-8">Enter your PIN to continue</p>

        {/* Dots */}
        <div className="flex gap-3 justify-center mb-10">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={pin.length > i ? { scale: [1, 1.3, 1] } : {}}
              className={cn('w-3.5 h-3.5 rounded-full transition-all', pin.length > i ? 'bg-violet shadow-glow-sm' : 'bg-navy-600')}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => (
            key === '' ? <div key="empty" /> :
            key === 'del' ? (
              <button key="del" onClick={handleDelete} className="w-16 h-14 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors mx-auto">
                <Delete size={20} />
              </button>
            ) : (
              <button key={key} onClick={() => handleDigit(key)} className="w-16 h-14 rounded-xl bg-navy-700 text-text-primary text-xl font-semibold hover:bg-navy-600 active:bg-violet/20 transition-colors mx-auto">
                {key}
              </button>
            )
          ))}
        </div>

        {/* Biometric */}
        <button className="mt-6 p-3 rounded-full text-text-secondary hover:text-violet hover:bg-violet/10 transition-colors">
          <Fingerprint size={28} />
        </button>
      </motion.div>
    </div>
  );
}
