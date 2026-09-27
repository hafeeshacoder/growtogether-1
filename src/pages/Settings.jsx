import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bell, Database, User, Info } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const THEMES = [
  { id: 'light', label: 'Light', emoji: '🌸' },
  { id: 'dark', label: 'Dark', emoji: '🌙' },
  { id: 'auto', label: 'Auto', emoji: '🌷' },
];

export default function Settings() {
  const { theme, changeTheme, activeUser } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const requestNotifications = async () => {
    if (typeof Notification === 'undefined') {
      showToast('Notifications are not supported on this browser.', 'info');
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm === 'granted') {
      showToast('Notifications enabled 🔔');
      new Notification('GrowTogether 🌸', { body: 'You\'ll get gentle reminders to stay on track.' });
    } else {
      showToast('Notifications permission was not granted.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Settings</h1>

      <Card>
        <button className="w-full flex items-center justify-between" onClick={() => navigate('/profile')}>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-white"><User size={16} /> Profile — {activeUser?.name}</span>
          <ChevronRight size={16} className="text-muted" />
        </button>
      </Card>

      <Card>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-3">Theme</h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              aria-pressed={theme === t.id}
              className={`p-3 rounded-xl2 border-2 text-center transition-all ${theme === t.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-transparent bg-primary-50/40 dark:bg-slate-700/40'}`}
            >
              <div className="text-lg mb-1">{t.emoji}</div>
              <p className="text-xs font-medium text-ink dark:text-white">{t.label}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 font-semibold text-sm text-ink dark:text-white mb-2"><Bell size={16} /> Notifications</h2>
        {notifStatus === 'unsupported' ? (
          <p className="text-xs text-muted">Notifications aren't supported in this browser. Everything else still works perfectly. 🌸</p>
        ) : notifStatus === 'granted' ? (
          <p className="text-xs text-success font-medium">✓ Notifications are enabled.</p>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Get gentle local reminders (optional).</p>
            <Button size="sm" variant="outline" onClick={requestNotifications}>Enable</Button>
          </div>
        )}
      </Card>

      <Card>
        <button className="w-full flex items-center justify-between" onClick={() => navigate('/data-backup')}>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-white"><Database size={16} /> Backup & Restore</span>
          <ChevronRight size={16} className="text-muted" />
        </button>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 font-semibold text-sm text-ink dark:text-white mb-2"><Info size={16} /> About</h2>
        <p className="text-xs text-muted leading-relaxed">
          GrowTogether is a romantic daily routine and career growth planner for two people growing together.
          It works entirely offline — there is no server, no account, and no tracking. Your data is stored
          only in this browser, on this device, using IndexedDB. You're always in control: export a backup
          anytime from Data & Backup.
        </p>
        <p className="text-[11px] text-muted mt-3">Version 1.0.0 · Made with 💕</p>
      </Card>
    </div>
  );
}
