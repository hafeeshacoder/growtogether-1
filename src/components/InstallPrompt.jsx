import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import Button from './Button';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissedPermanently, setDismissedPermanently] = useState(
    () => localStorage.getItem('gt_install_dismissed') === '1'
  );

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissedPermanently) setVisible(true);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissedPermanently]);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('gt_install_dismissed', '1');
    setDismissedPermanently(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl2 shadow-soft border border-primary-100 dark:border-slate-700 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg flex-shrink-0">
          🌸
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-ink dark:text-white">Install GrowTogether 🌸</p>
          <p className="text-xs text-muted mt-0.5">Keep your routines with you wherever you go.</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" icon={<Download size={14} />} onClick={install}>Install App</Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>Not now</Button>
          </div>
        </div>
        <button onClick={dismiss} aria-label="Dismiss install prompt" className="text-muted p-1">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
