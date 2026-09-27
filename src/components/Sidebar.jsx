import { NavLink } from 'react-router-dom';
import {
  Home, CalendarClock, ListChecks, Target, Heart, BarChart3,
  Trophy, Moon, User, Database, Settings as SettingsIcon,
} from 'lucide-react';
import Logo from './Logo';

const items = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/routine', label: 'Routine', icon: CalendarClock },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/together', label: 'Together', icon: Heart },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/reflection', label: 'Reflection', icon: Moon },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/data-backup', label: 'Data & Backup', icon: Database },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 border-r border-primary-50 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="flex items-center gap-2 px-6 py-6">
        <Logo size={34} />
        <div>
          <p className="font-display font-bold text-lg text-ink dark:text-white leading-none">GrowTogether</p>
          <p className="text-[11px] text-muted mt-0.5">Grow together. ❤️</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-1" aria-label="Primary">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft'
                  : 'text-ink/80 dark:text-primary-100/80 hover:bg-primary-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[11px] text-muted text-center">
        🔒 Your data stays on this device.
      </div>
    </aside>
  );
}
