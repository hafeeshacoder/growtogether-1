import { NavLink } from 'react-router-dom';
import { Home, CalendarClock, ListChecks, Target, Heart } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/routine', label: 'Routine', icon: CalendarClock },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/together', label: 'Together', icon: Heart },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-primary-50 dark:border-slate-700 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex justify-around items-stretch">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2.5 flex-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-primary-700 dark:text-primary-300' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
