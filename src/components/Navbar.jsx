import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Logo from './Logo';
import Avatar from './Avatar';
import UserSwitcher from './UserSwitcher';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { activeUser } = useApp();
  const navigate = useNavigate();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-bg/90 dark:bg-slate-900/90 backdrop-blur border-b border-primary-50 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 md:hidden">
        <Logo size={30} />
        <span className="font-display font-bold text-ink dark:text-white">GrowTogether</span>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setSwitcherOpen(true)}
          className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-200 hover:bg-primary-100 transition-colors"
        >
          Switch
        </button>
        <button
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-slate-800 text-muted relative"
          onClick={() => navigate('/settings')}
        >
          <Bell size={19} />
        </button>
        <button aria-label="Profile" onClick={() => navigate('/profile')}>
          <Avatar emoji={activeUser?.avatar || '🌸'} size="sm" ring />
        </button>
      </div>
      <UserSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </header>
  );
}
