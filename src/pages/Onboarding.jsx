import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { AVATARS } from '../data/constants';
import { loadDemoData, createFreshProfile } from '../services/seedService';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const CARDS = [
  { emoji: '🌱', title: 'Build Better Routines', text: 'Plan your days and make every hour count.' },
  { emoji: '🎯', title: 'Grow Your Career', text: 'Turn your daily habits into long-term progress.' },
  { emoji: '❤️', title: 'Grow Together', text: 'Support each other, celebrate progress, and build your future together.' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('cards'); // cards | create
  const [name, setName] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();
  const { showToast } = useToast();

  const goDashboard = () => navigate('/dashboard', { replace: true });

  const tryDemo = async () => {
    setBusy(true);
    await loadDemoData();
    await completeOnboarding();
    showToast('Demo loaded! Explore GrowTogether ✨');
    goDashboard();
  };

  const createProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    await createFreshProfile(name.trim(), careerGoal.trim(), avatar);
    await completeOnboarding();
    showToast(`Welcome, ${name.trim()}! 🌸`);
    goDashboard();
  };

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 py-10 bg-bg dark:bg-slate-900">
        <div className="max-w-sm mx-auto w-full">
          <div className="flex justify-center mb-6"><Logo size={56} /></div>
          <h1 className="font-display font-bold text-2xl text-center text-ink dark:text-white mb-1">Create My Profile</h1>
          <p className="text-sm text-muted text-center mb-6">Let's set up your GrowTogether space 🌸</p>
          <form onSubmit={createProfile} className="space-y-4">
            <div className="flex justify-center gap-2 flex-wrap">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAvatar(a)}
                  aria-label={`Choose avatar ${a}`}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${avatar === a ? 'bg-primary-200 dark:bg-primary-800 ring-2 ring-primary-500' : 'bg-primary-50 dark:bg-slate-800'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="ob-name" className="text-xs font-medium text-muted">Your Name</label>
              <input
                id="ob-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-700 dark:bg-slate-800 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. Hafeeza"
              />
            </div>
            <div>
              <label htmlFor="ob-goal" className="text-xs font-medium text-muted">Career Goal</label>
              <input
                id="ob-goal"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-700 dark:bg-slate-800 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. AI Engineer"
              />
            </div>
            <Button type="submit" fullWidth size="lg" disabled={busy}>{busy ? 'Setting up...' : 'Start My Journey 🌷'}</Button>
            <Button type="button" variant="ghost" fullWidth onClick={() => setMode('cards')}>Back</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bg to-blush dark:from-slate-900 dark:to-slate-900 px-6 py-8">
      <div className="flex justify-center mb-4"><Logo size={44} /></div>
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="max-w-sm w-full text-center bg-white dark:bg-slate-800 rounded-xl2 shadow-soft p-8"
          >
            <div className="text-5xl mb-4">{CARDS[step].emoji}</div>
            <h2 className="font-display font-bold text-xl text-ink dark:text-white mb-2">{CARDS[step].title}</h2>
            <p className="text-sm text-muted">{CARDS[step].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 my-6">
        {CARDS.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-primary-600' : 'w-1.5 bg-primary-200 dark:bg-slate-600'}`} />
        ))}
      </div>
      <div className="max-w-sm w-full mx-auto space-y-3">
        {step < CARDS.length - 1 ? (
          <Button fullWidth size="lg" onClick={() => setStep((s) => s + 1)}>Next</Button>
        ) : (
          <>
            <Button fullWidth size="lg" disabled={busy} onClick={tryDemo}>{busy ? 'Loading demo...' : 'Try Demo ✨'}</Button>
            <Button fullWidth size="lg" variant="outline" onClick={() => setMode('create')}>Create My Profile 🌸</Button>
          </>
        )}
        <button className="w-full text-center text-xs text-muted py-1" onClick={tryDemo}>Skip</button>
      </div>
    </div>
  );
}
