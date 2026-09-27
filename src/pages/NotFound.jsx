import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg dark:bg-slate-900 px-6 text-center gap-3">
      <Logo size={56} />
      <h1 className="font-display font-bold text-2xl text-ink dark:text-white">Page not found</h1>
      <p className="text-sm text-muted max-w-xs">This page wandered off. Let's get you back to your journey.</p>
      <Link to="/dashboard">
        <Button className="mt-2">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
