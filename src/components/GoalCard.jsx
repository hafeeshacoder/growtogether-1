import { useState } from 'react';
import ProgressBar from './ProgressBar';
import { Pencil, Trash2 } from 'lucide-react';

export default function GoalCard({ goal, onUpdateProgress, onEdit, onDelete, accentEmoji = '🎯' }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(goal.progress);

  return (
    <div className="p-4 rounded-xl2 bg-white dark:bg-slate-800 border border-primary-50 dark:border-slate-700 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-xl">{accentEmoji}</span>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-ink dark:text-white">{goal.title}</p>
            {goal.description && <p className="text-xs text-muted mt-0.5">{goal.description}</p>}
            {goal.deadline && <p className="text-[11px] text-primary-500 mt-1">🎯 Due {goal.deadline}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(goal)} aria-label="Edit goal" className="p-1.5 text-muted hover:text-primary-600"><Pencil size={14} /></button>
          <button onClick={() => onDelete(goal)} aria-label="Delete goal" className="p-1.5 text-muted hover:text-danger"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={goal.progress} className="flex-1" />
        <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 w-10 text-right">{goal.progress}%</span>
      </div>
      {editing ? (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="flex-1 accent-primary-600"
            aria-label="Update progress"
          />
          <button
            className="text-xs font-semibold text-primary-700 dark:text-primary-300"
            onClick={() => { onUpdateProgress(goal, value); setEditing(false); }}
          >
            Save
          </button>
        </div>
      ) : (
        <button className="text-xs text-primary-600 dark:text-primary-300 font-medium mt-2" onClick={() => setEditing(true)}>
          Update progress
        </button>
      )}
    </div>
  );
}
