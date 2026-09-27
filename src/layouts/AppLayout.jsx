import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Navbar from '../components/Navbar';
import InstallPrompt from '../components/InstallPrompt';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-bg dark:bg-slate-900 text-ink dark:text-primary-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 py-5 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <InstallPrompt />
    </div>
  );
}
