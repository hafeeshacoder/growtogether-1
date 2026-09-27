import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Logo from './components/Logo';
import AppLayout from './layouts/AppLayout';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Together from './pages/Together';
import ProgressPage from './pages/Progress';
import Achievements from './pages/Achievements';
import Reflection from './pages/Reflection';
import Profile from './pages/Profile';
import DataBackup from './pages/DataBackup';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg dark:bg-slate-900 gap-4">
      <Logo size={56} animated />
      <p className="text-sm text-muted">Loading GrowTogether…</p>
    </div>
  );
}

function DbErrorScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg dark:bg-slate-900 px-6 text-center gap-3">
      <div className="text-5xl">😔</div>
      <h1 className="font-display font-bold text-xl text-ink dark:text-white">Storage unavailable</h1>
      <p className="text-sm text-muted max-w-xs">
        Your browser doesn't support (or is blocking) local storage, so GrowTogether can't save your data here.
        Try a different browser, or disable private/incognito mode.
      </p>
    </div>
  );
}

function RequireOnboarded({ children }) {
  const { onboarded } = useApp();
  if (!onboarded) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { onboarded, dbReady, dbError } = useApp();

  if (dbError) return <DbErrorScreen />;
  if (onboarded === null || !dbReady) return <LoadingScreen />;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={onboarded ? <Navigate to="/dashboard" replace /> : <Splash />} />
        <Route path="/onboarding" element={onboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />} />

        <Route element={<RequireOnboarded><AppLayout /></RequireOnboarded>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/together" element={<Together />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/data-backup" element={<DataBackup />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
