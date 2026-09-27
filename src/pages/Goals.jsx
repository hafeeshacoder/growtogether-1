import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import CoupleGoalModal from '../components/CoupleGoalModal';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useCollection } from '../hooks/useCollection';
import { GoalsRepo, CoupleGoalsRepo, uid } from '../db/repository';
import { checkAndUnlockAchievements } from '../services/achievementService';

const SECTIONS = [
  { id: 'personal', label: 'Personal Goals', emoji: '🏠' },
  { id: 'career', label: 'Career Goals', emoji: '💼' },
  { id: 'learning', label: 'Learning Goals', emoji: '📚' },
];

export default function Goals() {
  const { activeUser, users } = useApp();
  const { showToast } = useToast();
  const { items: allGoals, reload } = useCollection(GoalsRepo, activeUser?.id);
  const { items: coupleGoals, reload: reloadCouple } = useCollection(CoupleGoalsRepo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [coupleModalOpen, setCoupleModalOpen] = useState(false);
  const [editingCouple, setEditingCouple] = useState(null);
  const [deletingCouple, setDeletingCouple] = useState(null);

  const myGoals = useMemo(() => allGoals.filter((g) => g.userId === activeUser?.id), [allGoals, activeUser]);

  const afterChange = async () => {
    if (!activeUser) return;
    const { newlyUnlocked } = await checkAndUnlockAchievements(activeUser.id);
    newlyUnlocked.forEach((a) => showToast(`🏆 Achievement unlocked: ${a.title}!`));
  };

  const saveGoal = async (goal) => {
    const record = { ...goal, id: goal.id || uid('goal'), userId: activeUser.id, createdAt: goal.createdAt || Date.now() };
    await GoalsRepo.save(record);
    await reload();
    await afterChange();
    setModalOpen(false);
    setEditing(null);
    showToast(goal.id ? 'Goal updated 🌷' : 'Goal added 🎯');
  };

  const updateProgress = async (goal, value) => {
    await GoalsRepo.save({ ...goal, progress: value });
    await reload();
    await afterChange();
    if (value >= 100) showToast('Goal completed! 🏆');
  };

  const removeGoal = async () => {
    if (!deleting) return;
    await GoalsRepo.remove(deleting.id);
    await reload();
    showToast('Goal removed');
    setDeleting(null);
  };

  const saveCouple = async (goal) => {
    const record = { ...goal, id: goal.id || uid('cgoal'), createdAt: goal.createdAt || Date.now() };
    await CoupleGoalsRepo.save(record);
    await reloadCouple();
    await afterChange();
    setCoupleModalOpen(false);
    setEditingCouple(null);
    showToast(goal.id ? 'Couple goal updated 💕' : 'Couple goal added ❤️');
  };

  const updateCoupleProgress = async (goal, value) => {
    await CoupleGoalsRepo.save({ ...goal, progress: value });
    await reloadCouple();
    if (value >= 100) showToast('You completed a goal together! ❤️');
  };

  const removeCouple = async () => {
    if (!deletingCouple) return;
    await CoupleGoalsRepo.remove(deletingCouple.id);
    await reloadCouple();
    showToast('Couple goal removed');
    setDeletingCouple(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Goals</h1>
        <Button size="sm" icon={<Plus size={16} />} onClick={() => { setEditing(null); setModalOpen(true); }}>Add Goal</Button>
      </div>

      {SECTIONS.map((section) => {
        const goals = myGoals.filter((g) => g.category === section.id);
        return (
          <div key={section.id}>
            <h2 className="font-semibold text-sm text-ink dark:text-white mb-2.5">{section.emoji} {section.label}</h2>
            {goals.length === 0 ? (
              <p className="text-xs text-muted pl-1">No {section.label.toLowerCase()} yet.</p>
            ) : (
              <div className="space-y-2.5">
                {goals.map((g) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    accentEmoji={section.emoji}
                    onUpdateProgress={updateProgress}
                    onEdit={(goal) => { setEditing(goal); setModalOpen(true); }}
                    onDelete={setDeleting}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-semibold text-sm text-ink dark:text-white">❤️ Couple Goals</h2>
          <Button size="sm" variant="outline" icon={<Plus size={14} />} onClick={() => { setEditingCouple(null); setCoupleModalOpen(true); }}>Add</Button>
        </div>
        {coupleGoals.length === 0 ? (
          <EmptyState emoji="💕" title="No shared goals yet" message="Create a goal you'll work toward together." />
        ) : (
          <div className="space-y-3">
            {coupleGoals.map((g) => {
              const creator = users.find((u) => u.id === g.createdBy);
              return (
                <Card key={g.id} className="bg-gradient-to-br from-primary-50/60 to-white dark:from-primary-900/20 dark:to-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-ink dark:text-white">{g.title}</p>
                      {g.description && <p className="text-xs text-muted mt-0.5">{g.description}</p>}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted flex-wrap">
                        {g.deadline && <span>🎯 Due {g.deadline}</span>}
                        {creator && <span>· Created by {creator.avatar} {creator.name}</span>}
                        <span>· Shared</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="text-xs text-primary-600 dark:text-primary-300 font-medium" onClick={() => { setEditingCouple(g); setCoupleModalOpen(true); }}>Edit</button>
                      <button className="text-xs text-danger font-medium ml-2" onClick={() => setDeletingCouple(g)}>Delete</button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar value={g.progress} className="flex-1" color="from-rose-400 to-primary-700" />
                    <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 w-10 text-right">{g.progress}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={g.progress} aria-label="Update shared progress"
                    onChange={(e) => updateCoupleProgress(g, Number(e.target.value))}
                    className="w-full accent-primary-600 mt-2"
                  />
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <GoalModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={saveGoal} goal={editing} />
      <CoupleGoalModal open={coupleModalOpen} onClose={() => { setCoupleModalOpen(false); setEditingCouple(null); }} onSave={saveCouple} goal={editingCouple} users={users} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={removeGoal} title="Delete goal?" message={`"${deleting?.title}" will be removed.`} confirmLabel="Delete" danger />
      <ConfirmDialog open={!!deletingCouple} onClose={() => setDeletingCouple(null)} onConfirm={removeCouple} title="Delete couple goal?" message={`"${deletingCouple?.title}" will be removed for both of you.`} confirmLabel="Delete" danger />
    </div>
  );
}
