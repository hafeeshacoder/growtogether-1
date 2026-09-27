import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { UsersRepo } from '../db/repository';
import { AVATARS } from '../data/constants';
import { computeUserStats } from '../services/achievementService';

export default function Profile() {
  const { activeUser, refresh } = useApp();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', careerGoal: '', quote: '', avatar: '🌸' });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (activeUser) {
      setForm({
        name: activeUser.name || '',
        careerGoal: activeUser.careerGoal || '',
        quote: activeUser.quote || '',
        avatar: activeUser.avatar || '🌸',
      });
      computeUserStats(activeUser.id).then(setStats);
    }
  }, [activeUser]);

  const save = async (e) => {
    e.preventDefault();
    if (!activeUser) return;
    await UsersRepo.save({ ...activeUser, ...form, name: form.name.trim() });
    refresh();
    setEditing(false);
    showToast('Profile updated 🌸');
  };

  if (!activeUser) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Profile</h1>

      <Card className="text-center">
        <Avatar emoji={form.avatar} size="xl" className="mx-auto" ring />
        {!editing ? (
          <>
            <h2 className="font-display font-bold text-lg text-ink dark:text-white mt-3">{activeUser.name}</h2>
            <p className="text-sm text-primary-600 dark:text-primary-300">{activeUser.careerGoal || 'No career goal set yet'}</p>
            {activeUser.quote && <p className="text-xs text-muted italic mt-2">"{activeUser.quote}"</p>}
            <Button size="sm" variant="outline" className="mt-4" onClick={() => setEditing(true)}>Edit Profile</Button>
          </>
        ) : (
          <form onSubmit={save} className="text-left mt-4 space-y-3">
            <div className="flex justify-center gap-2 flex-wrap">
              {AVATARS.map((a) => (
                <button
                  type="button" key={a} onClick={() => setForm((f) => ({ ...f, avatar: a }))}
                  aria-label={`Choose avatar ${a}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${form.avatar === a ? 'bg-primary-200 dark:bg-primary-800 ring-2 ring-primary-500' : 'bg-primary-50 dark:bg-slate-700'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="pf-name" className="text-xs font-medium text-muted">Name</label>
              <input id="pf-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label htmlFor="pf-goal" className="text-xs font-medium text-muted">Career Goal</label>
              <input id="pf-goal" value={form.careerGoal} onChange={(e) => setForm((f) => ({ ...f, careerGoal: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label htmlFor="pf-quote" className="text-xs font-medium text-muted">Personal Quote</label>
              <input id="pf-quote" value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Your motto..." />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" fullWidth onClick={() => setEditing(false)}>Cancel</Button>
              <Button type="submit" fullWidth>Save</Button>
            </div>
          </form>
        )}
      </Card>

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center py-4">
            <p className="text-xl">🔥</p>
            <p className="font-bold text-ink dark:text-white">{stats.streak}</p>
            <p className="text-[11px] text-muted">Current Streak</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-xl">✓</p>
            <p className="font-bold text-ink dark:text-white">{stats.totalTasksCompleted}</p>
            <p className="text-[11px] text-muted">Tasks Completed</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-xl">📚</p>
            <p className="font-bold text-ink dark:text-white">{stats.studyHoursTotal.toFixed(1)}h</p>
            <p className="text-[11px] text-muted">Study Hours</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-xl">💻</p>
            <p className="font-bold text-ink dark:text-white">{stats.codingDays}</p>
            <p className="text-[11px] text-muted">Coding Days</p>
          </Card>
        </div>
      )}
    </div>
  );
}
