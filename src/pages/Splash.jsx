import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import FloatingHearts from '../components/FloatingHearts';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding', { replace: true }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blush via-bg to-primary-100 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950 overflow-hidden px-6">
      <FloatingHearts count={7} />
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <Logo size={92} animated />
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-rose-deep dark:text-primary-200 mt-5">
          GrowTogether
        </h1>
        <p className="text-primary-700 dark:text-primary-300 font-medium mt-3">
          Two journeys. One purpose.
        </p>
        <p className="text-primary-700 dark:text-primary-300 font-medium">Grow together. ❤️</p>
      </motion.div>
      <motion.div
        className="absolute bottom-14 flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary-400 animate-sparkle"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </motion.div>
    </div>
  );
}
