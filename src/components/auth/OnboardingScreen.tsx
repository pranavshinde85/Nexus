import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';

const EMOJIS = ['😊', '😎', '🚀', '💜', '🎨', '🧑‍💻', '👩‍💼', '🦊', '🐱', '🌟', '🔥', '🎯'];

export function OnboardingScreen() {
  const { setOnboarded } = useAppStore();
  const { login } = useAuthStore();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [verifying, setVerifying] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setStep(2); }, 1000);
  };

  const handleComplete = () => {
    login({ id: 'user-self', name: name || 'User', avatar, email, bio: '' });
    setOnboarded(true);
  };

  return (
    <div className="h-screen w-screen bg-navy-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="w-20 h-20 rounded-2xl gradient-violet flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Sparkles size={36} className="text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gradient mb-2">NEXUS</h1>
              <p className="text-text-secondary text-sm mb-8">Your personal super-app</p>

              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or phone number" className="input-nexus py-3 text-sm mb-4" />
              <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl gradient-violet text-white font-semibold flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow transition-all">
                Continue <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-text-muted mt-4">By continuing, you agree to our Terms & Privacy Policy</p>
            </motion.div>
          )}

          {/* Step 1: OTP */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <button onClick={() => setStep(0)} className="text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1 text-sm mx-auto">
                <ChevronLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-bold text-text-primary mb-2">Verify your identity</h2>
              <p className="text-sm text-text-secondary mb-6">Enter the 6-digit code sent to<br /><span className="text-violet">{email || 'your email'}</span></p>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 rounded-xl bg-navy-700 border border-white/[0.06] text-center text-lg font-bold text-text-primary focus:border-violet focus:shadow-glow-sm transition-all"
                  />
                ))}
              </div>

              <button onClick={handleVerify} disabled={verifying} className="w-full py-3 rounded-xl gradient-violet text-white font-semibold shadow-glow-sm disabled:opacity-50">
                {verifying ? 'Verifying...' : 'Verify'}
              </button>
              <p className="text-[11px] text-text-muted mt-3">Didn't receive a code? <button className="text-violet">Resend</button></p>
            </motion.div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <h2 className="text-xl font-bold text-text-primary mb-6">Set up your profile</h2>

              <div className="w-20 h-20 rounded-full bg-navy-700 border-2 border-violet flex items-center justify-center text-4xl mx-auto mb-3 shadow-glow-sm">
                {avatar}
              </div>
              <div className="flex gap-2 justify-center flex-wrap mb-6">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setAvatar(e)} className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${avatar === e ? 'bg-violet/20 ring-2 ring-violet' : 'bg-navy-700 hover:bg-navy-600'}`}>
                    {e}
                  </button>
                ))}
              </div>

              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" className="input-nexus py-3 text-sm mb-4" />

              <button onClick={handleComplete} className="w-full py-3 rounded-xl gradient-violet text-white font-semibold flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow transition-all">
                Get Started <Sparkles size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex gap-2 justify-center mt-8">
          {[0, 1, 2].map((s) => (
            <div key={s} className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-violet w-6' : 'bg-navy-600'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
