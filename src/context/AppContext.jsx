import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsersRepo, getSetting, setSetting } from '../db/repository';
import { isIndexedDBAvailable } from '../db/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [theme, setTheme] = useState('light');
  const [onboarded, setOnboarded] = useState(null); // null = loading
  const [isDemo, setIsDemo] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    (async () => {
      const ok = await isIndexedDBAvailable();
      setDbReady(ok);
      if (!ok) {
        setDbError(true);
        setOnboarded(false);
        return;
      }
      const [allUsers, active, savedTheme, savedOnboarded, demo] = await Promise.all([
        UsersRepo.all(),
        getSetting('activeUserId', null),
        getSetting('theme', 'light'),
        getSetting('onboarded', false),
        getSetting('isDemo', false),
      ]);
      setUsers(allUsers);
      setActiveUserId(active || (allUsers[0] && allUsers[0].id) || null);
      setTheme(savedTheme || 'light');
      setOnboarded(!!savedOnboarded && allUsers.length > 0);
      setIsDemo(!!demo);
    })();
  }, [refreshTick]);

  useEffect(() => {
    const root = document.documentElement;
    let effective = theme;
    if (theme === 'auto') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.toggle('dark', effective === 'dark');
  }, [theme]);

  const changeTheme = useCallback(async (t) => {
    setTheme(t);
    await setSetting('theme', t);
  }, []);

  const switchUser = useCallback(async (userId) => {
    setActiveUserId(userId);
    await setSetting('activeUserId', userId);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await setSetting('onboarded', true);
    setOnboarded(true);
    refresh();
  }, [refresh]);

  const activeUser = useMemo(() => users.find((u) => u.id === activeUserId) || users[0] || null, [users, activeUserId]);
  const partnerUser = useMemo(() => users.find((u) => u.id !== activeUserId) || null, [users, activeUserId]);

  const value = {
    users, activeUser, partnerUser, activeUserId, switchUser,
    theme, changeTheme, onboarded, completeOnboarding, isDemo, setIsDemo,
    dbReady, dbError, refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
