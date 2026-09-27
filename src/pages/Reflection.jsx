import { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useCollection } from '../hooks/useCollection';
import { ReflectionsRepo, uid } from '../db/repository';
import { MOODS } from '../data/constants';
import { todayISO, formatShortDate } from '../utils/dateUtils';

export default function Reflection() {
  const { activeUser } = useApp();
  const { showToast } = useToast();
  const { items: allReflections, reload } = useCollection(ReflectionsRepo, activeUser?.id);

  const today = todayISO();
  const mine = useMemo(
    () => allReflections.filter((r) => r.userId === activeUser?.id).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [allReflections, activeUser]
  );
  const todayEntry = mine.find((r) => r.date === today);

  const [mood, setMood] = useState(todayEntry?.mood || '');
  const [proud, setProud] = useState(todayEntry?.proud || '');
  const [learned, setLearned] = useState(todayEntry?.learned || '');
  const [tomorrowFocus, setTomorrowFocus] = useState(todayEntry?.tomorrowFocus || '');

  const save = async (e) => {
    e.preventDefault();
    if (!activeUser || !mood) return;
    const record = {
      id: todayEntry?.id || uid('refl'),
      userId: activeUser.id,
      date: today,
      mood,
      proud,
      learned,
      tomorrowFocus,
      createdAt: todayEntry?.createdAt || Date.now(),
    };
    await ReflectionsRepo.save(record);
    await reload();
    showToast('Reflection saved 🌙');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">How was your day? 🌙</h1>
        <p className="text-sm text-muted">Take a quiet moment to reflect.</p>
      </div>

      <Card>
        <form onSubmit={save} className="space-y-5">
          <div>
            <p className="text-xs font-medium text-muted mb-2">Mood</p>
            <div className="flex justify-between gap-1">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  aria-pressed={mood === m.id}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl2 border transition-all ${
                    mood === m.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-105' : 'border-transparent bg-primary-50/40 dark:bg-slate-700/40'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[9px] font-medium text-muted">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="ref-proud" className="text-xs font-medium text-muted">What are you proud of today?</label>
            <textarea id="ref-proud" value={proud} onChange={(e) => setProud(e.target.value)} rows={2}
              className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label htmlFor="ref-learned" className="text-xs font-medium text-muted">What did you learn?</label>
            <textarea id="ref-learned" value={learned} onChange={(e) => setLearned(e.target.value)} rows={2}
              className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label htmlFor="ref-focus" className="text-xs font-medium text-muted">What will you focus on tomorrow?</label>
            <textarea id="ref-focus" value={tomorrowFocus} onChange={(e) => setTomorrowFocus(e.target.value)} rows={2}
              className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <Button type="submit" fullWidth disabled={!mood}>{todayEntry ? 'Update Reflection' : 'Save Reflection'}</Button>
        </form>
      </Card>

      <div>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-2.5">Previous Reflections</h2>
        {mine.filter((r) => r.date !== today).length === 0 ? (
          <EmptyState emoji="🌙" title="No past reflections" message="Your reflection history will appear here." />
        ) : (
          <div className="space-y-2.5">
            {mine.filter((r) => r.date !== today).slice(0, 10).map((r) => {
              const m = MOODS.find((mm) => mm.id === r.mood);
              return (
                <Card key={r.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-muted">{formatShortDate(r.date)}</span>
                    <span className="text-lg">{m?.emoji}</span>
                  </div>
                  {r.proud && <p className="text-xs text-ink dark:text-white"><b>Proud:</b> {r.proud}</p>}
                  {r.learned && <p className="text-xs text-ink dark:text-white mt-1"><b>Learned:</b> {r.learned}</p>}
                  {r.tomorrowFocus && <p className="text-xs text-primary-600 dark:text-primary-300 mt-1"><b>Focus:</b> {r.tomorrowFocus}</p>}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
