import { motion } from 'framer-motion';
import { Check, Pencil, Trash2, Copy } from 'lucide-react';
import { getCategory } from '../data/constants';

export default function ActivityCard({ activity, status = 'upcoming', onToggle, onEdit, onDelete, onDuplicate }) {
  const cat = getCategory(activity.category);
  const isCurrent = status === 'current';
  const isDone = activity.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center gap-3 p-3.5 rounded-xl2 border transition-colors ${
        isCurrent
          ? 'bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/40 dark:to-slate-800 border-primary-300 shadow-soft'
          : isDone
          ? 'bg-primary-50/40 dark:bg-slate-800/40 border-transparent opacity-70'
          : 'bg-white dark:bg-slate-800 border-primary-50 dark:border-slate-700'
      }`}
    >
      <div className="flex flex-col items-center w-16 flex-shrink-0">
        <span className="text-xs font-semibold text-muted">{activity.startTime}</span>
        <span className="text-[10px] text-muted">{activity.endTime}</span>
      </div>
      <button
        onClick={() => onToggle(activity)}
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
        className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-lg transition-all ${
          isDone ? 'bg-success text-white' : 'bg-primary-50 dark:bg-slate-700'
        }`}
      >
        {isDone ? <Check size={18} /> : activity.icon}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold text-ink dark:text-white truncate ${isDone ? 'line-through decoration-primary-400' : ''}`}>
          {activity.title}
        </p>
        <span className="text-[11px] text-muted">{cat.icon} {cat.label}</span>
        {isCurrent && <span className="ml-2 text-[10px] font-semibold text-primary-700 dark:text-primary-300">● Now</span>}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onDuplicate?.(activity)} aria-label="Duplicate activity" className="p-1.5 text-muted hover:text-primary-600"><Copy size={15} /></button>
        <button onClick={() => onEdit(activity)} aria-label="Edit activity" className="p-1.5 text-muted hover:text-primary-600"><Pencil size={15} /></button>
        <button onClick={() => onDelete(activity)} aria-label="Delete activity" className="p-1.5 text-muted hover:text-danger"><Trash2 size={15} /></button>
      </div>
    </motion.div>
  );
}
