import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { useCollection } from '../hooks/useCollection';
import {
  TasksRepo, DailyProgressRepo, CoupleGoalsRepo, AchievementsRepo, LittleThingsRepo, uid,
} from '../db/repository';
import { todayISO } from '../utils/dateUtils';
import { computeUserStats } from '../services/achievementService';
import { LITTLE_THINGS_TEMPLATES } from '../data/constants';

export default function Together() {
  const { users } = useApp();
  const { items: tasks } = useCollection(TasksRepo);
  const { items: progress } = useCollection(DailyProgressRepo);
  const { items: coupleGoals } = useCollection(CoupleGoalsRepo);
  const { items: achievements } = useCollection(AchievementsRepo);
  const { items: littleThings, reload: reloadLT } = useCollection(LittleThingsRepo);
  const [stats, setStats] = useState({});

  useEffect(() => {
    (async () => {
      const entries = await Promise.all(users.map(async (u) => [u.id, await computeUserStats(u.id)]));
      setStats(Object.fromEntries(entries));
    })();
  }, [users, tasks, progress]);

  const today = todayISO();

  const userSummary = useMemo(() => users.map((u) => {
    const todayTasks = tasks.filter((t) => t.userId === u.id && t.date === today);
    const completed = todayTasks.filter((t) => t.completed).length;
    const pct = todayTasks.length ? Math.round((completed / todayTasks.length) * 100) : 0;
    return { user: u, pct, completed, total: todayTasks.length };
  }), [users, tasks, today]);

  const combinedPct = userSummary.length
    ? Math.round(userSummary.reduce((s, u) => s + u.pct, 0) / userSummary.length)
    : 0;

  const totalStudyHours = progress.filter((p) => p.date === today).reduce((s, p) => s + (p.studyHours || 0), 0);
  const totalCodingHours = progress.filter((p) => p.date === today).reduce((s, p) => s + (p.codingHours || 0), 0);
  const combinedStreak = users.length ? Math.max(...users.map((u) => stats[u.id]?.streak ?? 0)) : 0;

  const todaysThings = LITTLE_THINGS_TEMPLATES.map((tpl) => {
    const record = littleThings.find((lt) => lt.templateId === tpl.id && lt.date === today);
    return { ...tpl, record };
  });

  const toggleThing = async (tpl) => {
    if (tpl.record) {
      await LittleThingsRepo.save({ ...tpl.record, done: !tpl.record.done });
    } else {
      await LittleThingsRepo.save({ id: uid('lt'), templateId: tpl.id, date: today, done: true });
    }
    await reloadLT();
  };

  if (users.length === 0) {
    return <EmptyState emoji="❤️" title="No profiles yet" message="Add a partner profile to start your journey together." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Our Journey ❤️</h1>
        <p className="text-sm text-muted">Two people. One beautiful path forward.</p>
      </div>

      <div className={`grid gap-3 ${userSummary.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {userSummary.map(({ user, pct }) => (
          <Card key={user.id} className="text-center">
            <Avatar emoji={user.avatar} size="lg" className="mx-auto" />
            <p className="font-semibold text-sm text-ink dark:text-white mt-2">{user.name}</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300 mt-1">{pct}%</p>
            <p className="text-[11px] text-muted">today's progress</p>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary-600 to-rose-deep text-white text-center">
        <p className="text-3xl mb-1">🌱</p>
        <p className="font-display font-semibold text-lg">Growing Together</p>
        <p className="text-4xl font-bold mt-2">{combinedPct}%</p>
        <p className="text-xs opacity-90 mt-1">combined daily progress</p>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center py-3">
          <p className="text-xl">📚</p>
          <p className="font-bold text-ink dark:text-white">{totalStudyHours.toFixed(1)}h</p>
          <p className="text-[10px] text-muted">study</p>
        </Card>
        <Card className="text-center py-3">
          <p className="text-xl">💻</p>
          <p className="font-bold text-ink dark:text-white">{totalCodingHours.toFixed(1)}h</p>
          <p className="text-[10px] text-muted">coding</p>
        </Card>
        <Card className="text-center py-3">
          <p className="text-xl">🔥</p>
          <p className="font-bold text-ink dark:text-white">{combinedStreak || 0}</p>
          <p className="text-[10px] text-muted">streak</p>
        </Card>
      </div>

      <div>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-2.5">🎯 Shared Goals</h2>
        {coupleGoals.length === 0 ? (
          <EmptyState emoji="💕" title="No shared goals yet" message="Visit the Goals page to create one together." />
        ) : (
          <div className="space-y-2.5">
            {coupleGoals.slice(0, 4).map((g) => (
              <Card key={g.id}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-ink dark:text-white">{g.title}</p>
                  <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} color="from-rose-400 to-primary-700" />
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-2.5">🏆 Achievements</h2>
        <p className="text-xs text-muted mb-2">{achievements.length} unlocked together</p>
        <div className="flex gap-2 flex-wrap">
          {achievements.slice(0, 8).map((a) => (
            <span key={a.id} className="text-2xl" title={a.title}>{a.icon}</span>
          ))}
          {achievements.length === 0 && <p className="text-xs text-muted">No achievements yet — keep going!</p>}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-2.5">Little Things That Matter</h2>
        <div className="space-y-2">
          {todaysThings.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => toggleThing(tpl)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl2 border text-left transition-colors ${
                tpl.record?.done
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300'
                  : 'bg-white dark:bg-slate-800 border-primary-50 dark:border-slate-700'
              }`}
            >
              <span className="text-xl">{tpl.emoji}</span>
              <span className="flex-1 text-sm font-medium text-ink dark:text-white">{tpl.label}</span>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${tpl.record?.done ? 'bg-success border-success text-white' : 'border-primary-300'}`}>
                {tpl.record?.done ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
