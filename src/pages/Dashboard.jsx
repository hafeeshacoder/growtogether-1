import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, BookOpen, Laptop2 } from 'lucide-react';
import Card from '../components/Card';
import QuoteCard from '../components/QuoteCard';
import CircularProgress from '../components/CircularProgress';
import ActivityCard from '../components/ActivityCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ActivitiesRepo, TasksRepo, DailyProgressRepo, getSetting, setSetting, uid } from '../db/repository';
import { formatFriendlyDate, getGreeting, nowMinutes, timeToMinutes, todayISO } from '../utils/dateUtils';
import { checkAndUnlockAchievements, computeUserStats } from '../services/achievementService';

export default function Dashboard() {
  const { activeUser } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState('normal');
  const greeting = getGreeting();

  useEffect(() => {
    if (!activeUser) return;
    (async () => {
      const savedMode = await getSetting(`routineMode_${activeUser.id}`, 'normal');
      setMode(savedMode);
      const [allActivities, allTasks, allProgress] = await Promise.all([
        ActivitiesRepo.all(), TasksRepo.all(), DailyProgressRepo.all(),
      ]);
      setActivities(allActivities.filter((a) => a.userId === activeUser.id && a.mode === savedMode));
      setTasks(allTasks.filter((t) => t.userId === activeUser.id && t.date === todayISO()));
      const todayProg = allProgress.find((p) => p.userId === activeUser.id && p.date === todayISO());
      setProgress(todayProg || null);
      const stats = await computeUserStats(activeUser.id);
      setStreak(stats.streak);
    })();
  }, [activeUser]);

  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    [activities]
  );

  const now = nowMinutes();
  const getStatus = (a) => {
    const start = timeToMinutes(a.startTime);
    const end = timeToMinutes(a.endTime);
    if (a.completed) return 'completed';
    if (now >= start && now <= end) return 'current';
    return 'upcoming';
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const pct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : (progress?.percentage || 0);

  const toggleActivity = async (activity) => {
    const updated = { ...activity, completed: !activity.completed };
    await ActivitiesRepo.save(updated);
    setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (updated.completed) showToast('Nice! Activity completed 🌸');
  };

  const quickAddDone = async () => {
    if (!activeUser) return;
    let prog = progress;
    if (!prog) {
      prog = { id: uid('prog'), userId: activeUser.id, date: todayISO(), completedTasks: 0, totalTasks: 1, percentage: 0, studyHours: 0, codingHours: 0 };
    }
    prog = { ...prog, completedTasks: prog.completedTasks + 1, totalTasks: Math.max(prog.totalTasks, prog.completedTasks + 1) };
    prog.percentage = Math.round((prog.completedTasks / prog.totalTasks) * 100);
    await DailyProgressRepo.save(prog);
    setProgress(prog);
    await checkAndUnlockAchievements(activeUser.id);
    showToast('Logged progress! 💕');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">
            {greeting.text}, {activeUser?.name || 'friend'} {greeting.emoji}
          </h1>
          <p className="text-sm text-muted">{formatFriendlyDate()}</p>
        </div>
      </div>

      <QuoteCard />

      <Card className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <CircularProgress value={pct} label="Today" size={130} />
          <div className="flex-1 w-full space-y-3">
            <p className="text-sm font-semibold text-ink dark:text-white">
              {completedTasks} / {totalTasks || 0} tasks completed
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1.5 rounded-full">
                <Flame size={14} /> {streak} day streak
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1.5 rounded-full">
                <BookOpen size={14} /> {progress?.studyHours ?? 0}h study
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1.5 rounded-full">
                <Laptop2 size={14} /> {progress?.codingHours ?? 0}h coding
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={quickAddDone}>+ Log a completed task</Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-ink dark:text-white">Today's Routine</h2>
          <button className="text-xs font-medium text-primary-600 dark:text-primary-300" onClick={() => navigate('/routine')}>View all</button>
        </div>
        {sortedActivities.length === 0 ? (
          <EmptyState
            emoji="🌷"
            title="Nothing planned yet"
            message="Let's make today meaningful."
            action={<Button size="sm" onClick={() => navigate('/routine')}>+ Add Activity</Button>}
          />
        ) : (
          <div className="space-y-2.5">
            {sortedActivities.slice(0, 6).map((a) => (
              <ActivityCard key={a.id} activity={a} status={getStatus(a)} onToggle={toggleActivity} onEdit={() => navigate('/routine')} onDelete={() => navigate('/routine')} />
            ))}
          </div>
        )}
      </div>

      {totalTasks > 0 && completedTasks === totalTasks && (
        <Card className="text-center bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/30 dark:to-slate-800">
          <p className="font-display font-semibold text-primary-700 dark:text-primary-200">You showed up for yourself today. 🌸</p>
          <p className="text-xs text-muted mt-1">That's something to be proud of.</p>
        </Card>
      )}
    </div>
  );
}
