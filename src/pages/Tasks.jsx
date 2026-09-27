import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useCollection } from '../hooks/useCollection';
import { TasksRepo, uid } from '../db/repository';
import { todayISO } from '../utils/dateUtils';
import { recomputeTodayProgress } from '../services/progressService';
import { checkAndUnlockAchievements } from '../services/achievementService';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'high', label: 'High Priority' },
];

export default function Tasks() {
  const { activeUser } = useApp();
  const { showToast } = useToast();
  const { items: allTasks, reload } = useCollection(TasksRepo, activeUser?.id);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const tasks = useMemo(() => {
    let list = allTasks.filter((t) => t.userId === activeUser?.id);
    if (filter === 'today') list = list.filter((t) => t.date === todayISO());
    if (filter === 'completed') list = list.filter((t) => t.completed);
    if (filter === 'pending') list = list.filter((t) => !t.completed);
    if (filter === 'high') list = list.filter((t) => t.priority === 'high');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [allTasks, activeUser, filter, search]);

  const afterChange = async () => {
    if (!activeUser) return;
    await recomputeTodayProgress(activeUser.id);
    const { newlyUnlocked } = await checkAndUnlockAchievements(activeUser.id);
    newlyUnlocked.forEach((a) => showToast(`🏆 Achievement unlocked: ${a.title}!`));
  };

  const toggle = async (task) => {
    const updated = { ...task, completed: !task.completed };
    await TasksRepo.save(updated);
    await reload();
    await afterChange();
    showToast(updated.completed ? 'Task completed! ✓' : 'Task marked pending');
  };

  const save = async (task) => {
    const record = { ...task, id: task.id || uid('task'), userId: activeUser.id, createdAt: task.createdAt || Date.now() };
    await TasksRepo.save(record);
    await reload();
    await afterChange();
    setModalOpen(false);
    setEditing(null);
    showToast(task.id ? 'Task updated 🌷' : 'Task added ✨');
  };

  const remove = async () => {
    if (!deleting) return;
    await TasksRepo.remove(deleting.id);
    await reload();
    await afterChange();
    showToast('Task removed');
    setDeleting(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Tasks</h1>
        <Button size="sm" icon={<Plus size={16} />} onClick={() => { setEditing(null); setModalOpen(true); }}>Add</Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f.id
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft'
                : 'bg-white dark:bg-slate-800 text-muted border border-primary-100 dark:border-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          emoji="🌷"
          title="No tasks here"
          message="Add a task to start making progress today."
          action={<Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>+ Add Task</Button>}
        />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {tasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onToggle={toggle}
                onEdit={(task) => { setEditing(task); setModalOpen(true); }}
                onDelete={(task) => setDeleting(task)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={save} task={editing} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete task?"
        message={`"${deleting?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
