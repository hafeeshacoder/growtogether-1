import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import Avatar from './Avatar';
import Button from './Button';
import { useApp } from '../context/AppContext';
import { UsersRepo, uid } from '../db/repository';
import { AVATARS } from '../data/constants';
import { useToast } from '../context/ToastContext';

export default function UserSwitcher({ open, onClose }) {
  const { users, activeUserId, switchUser, refresh } = useApp();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [avatar, setAvatar] = useState('💙');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const user = {
      id: uid('user'),
      name: name.trim(),
      role: 'Partner',
      avatar,
      careerGoal: careerGoal.trim(),
      quote: '',
      createdAt: Date.now(),
    };
    await UsersRepo.save(user);
    await switchUser(user.id);
    refresh();
    showToast(`Welcome, ${user.name}! 🌸`);
    setAdding(false);
    setName('');
    setCareerGoal('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={adding ? 'Add New Profile' : 'Switch Profile'}>
      {!adding ? (
        <div className="space-y-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={async () => { await switchUser(u.id); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl2 border transition-colors ${
                u.id === activeUserId
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-transparent hover:bg-primary-50/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Avatar emoji={u.avatar} />
              <div className="text-left">
                <p className="font-semibold text-sm text-ink dark:text-white">{u.name}</p>
                <p className="text-xs text-muted">{u.careerGoal || 'No career goal set'}</p>
              </div>
            </button>
          ))}
          <Button variant="outline" fullWidth icon={<Plus size={16} />} onClick={() => setAdding(true)}>
            Add Another Profile
          </Button>
        </div>
      ) : (
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex justify-center gap-2 flex-wrap">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAvatar(a)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${avatar === a ? 'bg-primary-200 dark:bg-primary-800 ring-2 ring-primary-500' : 'bg-primary-50 dark:bg-slate-700'}`}
                aria-label={`Choose avatar ${a}`}
              >
                {a}
              </button>
            ))}
          </div>
          <div>
            <label htmlFor="new-name" className="text-xs font-medium text-muted">Name</label>
            <input
              id="new-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Their name"
            />
          </div>
          <div>
            <label htmlFor="new-goal" className="text-xs font-medium text-muted">Career Goal</label>
            <input
              id="new-goal"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="mt-1 w-full rounded-xl border border-primary-100 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="e.g. Product Designer"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={() => setAdding(false)}>Back</Button>
            <Button type="submit" fullWidth>Create Profile</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
