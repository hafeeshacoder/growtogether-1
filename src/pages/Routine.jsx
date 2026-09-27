import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import ModeSelector from '../components/ModeSelector';
import ActivityCard from '../components/ActivityCard';
import ActivityModal from '../components/ActivityModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useCollection } from '../hooks/useCollection';
import { ActivitiesRepo, getSetting, setSetting, uid } from '../db/repository';
import { nowMinutes, timeToMinutes } from '../utils/dateUtils';
import { recomputeTodayProgress } from '../services/progressService';
import { checkAndUnlockAchievements } from '../services/achievementService';
import { ROUTINE_MODES } from '../data/constants';

export default function Routine() {
  const { activeUser } = useApp();
  const { showToast } = useToast();
  const { items: allActivities, reload } = useCollection(ActivitiesRepo, activeUser?.id);
  const [mode, setMode] = useState('normal');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!activeUser) return;
    (async () => {
      const saved = await getSetting(`routineMode_${activeUser.id}`, 'normal');
      setMode(saved);
    })();
  }, [activeUser]);

  const changeMode = async (m) => {
    setMode(m);
    if (activeUser) await setSetting(`routineMode_${activeUser.id}`, m);
  };

  const activities = useMemo(
    () =>
      allActivities
        .filter((a) => a.userId === activeUser?.id && a.mode === mode)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    [allActivities, activeUser, mode]
  );

  const now = nowMinutes();
  const getStatus = (a) => {
    const start = timeToMinutes(a.startTime);
    const end = timeToMinutes(a.endTime);
    if (a.completed) return 'completed';
    if (now >= start && now <= end) return 'current';
    return 'upcoming';
  };

  const toggle = async (activity) => {
    const updated = { ...activity, completed: !activity.completed };
    await ActivitiesRepo.save(updated);
    await reload();
    if (activeUser) {
      await recomputeTodayProgress(activeUser.id);
      const { newlyUnlocked } = await checkAndUnlockAchievements(activeUser.id);
      newlyUnlocked.forEach((a) => showToast(`🏆 Achievement unlocked: ${a.title}!`));
    }
    showToast(updated.completed ? 'Nice! Activity completed 🌸' : 'Marked as not done');
  };

  const save = async (activity) => {
    const record = {
      ...activity,
      id: activity.id || uid('act'),
      userId: activeUser.id,
      day: activity.day || 'all',
      createdAt: activity.createdAt || Date.now(),
    };
    await ActivitiesRepo.save(record);
    await reload();
    setModalOpen(false);
    setEditing(null);
    showToast(activity.id ? 'Activity updated 🌷' : 'Activity added ✨');
  };

  const remove = async () => {
    if (!deleting) return;
    await ActivitiesRepo.remove(deleting.id);
    await reload();
    showToast('Activity removed');
    setDeleting(null);
  };

  const duplicate = async (activity) => {
    const copy = { ...activity, id: uid('act'), title: `${activity.title} (copy)`, completed: false, createdAt: Date.now() };
    await ActivitiesRepo.save(copy);
    await reload();
    showToast('Activity duplicated 💫');
  };

  const modeInfo = ROUTINE_MODES.find((m) => m.id === mode);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">My Routine</h1>
        <Button size="sm" icon={<Plus size={16} />} onClick={() => { setEditing(null); setModalOpen(true); }}>Add</Button>
      </div>

      <ModeSelector value={mode} onChange={changeMode} />
      {modeInfo && <p className="text-xs text-muted text-center -mt-2">{modeInfo.desc}</p>}

      {activities.length === 0 ? (
        <EmptyState
          emoji="🌷"
          title="Nothing planned yet"
          message="Let's make today meaningful."
          action={<Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>+ Add Activity</Button>}
        />
      ) : (
        <div className="space-y-2.5">
          {activities.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              status={getStatus(a)}
              onToggle={toggle}
              onEdit={(act) => { setEditing(act); setModalOpen(true); }}
              onDelete={(act) => setDeleting(act)}
              onDuplicate={duplicate}
            />
          ))}
        </div>
      )}

      <ActivityModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={save}
        activity={editing}
        mode={mode}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete activity?"
        message={`"${deleting?.title}" will be removed from your routine.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
