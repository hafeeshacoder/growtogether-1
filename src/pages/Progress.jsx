import { useMemo, useState } from 'react';
import Card from '../components/Card';
import WeeklyBarChart from '../components/WeeklyBarChart';
import CircularProgress from '../components/CircularProgress';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { useCollection } from '../hooks/useCollection';
import { DailyProgressRepo, GoalsRepo } from '../db/repository';
import { getWeekDates, WEEKDAY_LABELS, daysAgoISO } from '../utils/dateUtils';
import { computeUserStats } from '../services/achievementService';
import { useEffect } from 'react';

const RANGES = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

export default function Progress() {
  const { activeUser } = useApp();
  const { items: allProgress } = useCollection(DailyProgressRepo, activeUser?.id);
  const { items: allGoals } = useCollection(GoalsRepo, activeUser?.id);
  const [range, setRange] = useState('week');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!activeUser) return;
    computeUserStats(activeUser.id).then(setStats);
  }, [activeUser, allProgress]);

  const myProgress = useMemo(() => allProgress.filter((p) => p.userId === activeUser?.id), [allProgress, activeUser]);
  const myGoals = useMemo(() => allGoals.filter((g) => g.userId === activeUser?.id), [allGoals, activeUser]);

  const weekDates = getWeekDates();
  const weekData = weekDates.map((d) => myProgress.find((p) => p.date === d));

  const rangeDates = useMemo(() => {
    if (range === 'week') return weekDates;
    if (range === 'month') return Array.from({ length: 30 }, (_, i) => daysAgoISO(29 - i));
    return myProgress.map((p) => p.date).sort();
  }, [range, myProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  const rangeRecords = myProgress.filter((p) => rangeDates.includes(p.date));
  const avgCompletion = rangeRecords.length
    ? Math.round(rangeRecords.reduce((s, p) => s + (p.percentage || 0), 0) / rangeRecords.length)
    : 0;
  const totalTasksDone = rangeRecords.reduce((s, p) => s + (p.completedTasks || 0), 0);
  const totalStudy = rangeRecords.reduce((s, p) => s + (p.studyHours || 0), 0);
  const totalCoding = rangeRecords.reduce((s, p) => s + (p.codingHours || 0), 0);

  const avgGoalProgress = myGoals.length
    ? Math.round(myGoals.reduce((s, g) => s + g.progress, 0) / myGoals.length)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Progress</h1>

      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              range === r.id ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft' : 'bg-white dark:bg-slate-800 text-muted border border-primary-100 dark:border-slate-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center justify-center py-5">
          <CircularProgress value={avgCompletion} size={100} label="avg" />
        </Card>
        <div className="grid grid-rows-3 gap-3">
          <Card className="flex items-center justify-between py-2.5 px-4">
            <span className="text-xs text-muted">✓ Tasks done</span>
            <span className="font-bold text-ink dark:text-white">{totalTasksDone}</span>
          </Card>
          <Card className="flex items-center justify-between py-2.5 px-4">
            <span className="text-xs text-muted">📚 Study hours</span>
            <span className="font-bold text-ink dark:text-white">{totalStudy.toFixed(1)}h</span>
          </Card>
          <Card className="flex items-center justify-between py-2.5 px-4">
            <span className="text-xs text-muted">💻 Coding hours</span>
            <span className="font-bold text-ink dark:text-white">{totalCoding.toFixed(1)}h</span>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm text-ink dark:text-white">This Week's Completion</h2>
          <span className="text-xs text-muted">🔥 {stats?.streak ?? 0} day streak</span>
        </div>
        {weekData.every((d) => !d) ? (
          <EmptyState emoji="📈" title="No data yet this week" message="Complete tasks to see your weekly chart." />
        ) : (
          <WeeklyBarChart labels={WEEKDAY_LABELS} values={weekData.map((d) => d?.percentage || 0)} max={100} valueSuffix="%" />
        )}
      </Card>

      <Card>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-4">Study vs Coding Hours (This Week)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-muted mb-1 text-center">📚 Study</p>
            <WeeklyBarChart labels={WEEKDAY_LABELS} values={weekData.map((d) => d?.studyHours || 0)} valueSuffix="h" barColor="from-primary-300 to-primary-600" />
          </div>
          <div>
            <p className="text-[11px] text-muted mb-1 text-center">💻 Coding</p>
            <WeeklyBarChart labels={WEEKDAY_LABELS} values={weekData.map((d) => d?.codingHours || 0)} valueSuffix="h" barColor="from-rose-400 to-rose-deep" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-ink dark:text-white">🎯 Average Goal Progress</h2>
          <span className="text-sm font-bold text-primary-700 dark:text-primary-300">{avgGoalProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-primary-50 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full transition-all duration-700" style={{ width: `${avgGoalProgress}%` }} />
        </div>
      </Card>
    </div>
  );
}
