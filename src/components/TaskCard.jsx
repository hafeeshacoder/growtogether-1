import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { getCategory, PRIORITIES } from '../data/constants';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const cat = getCategory(task.category);
  const priority = PRIORITIES.find((p) => p.id === task.priority) || PRIORITIES[1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-3.5 rounded-xl2 border bg-white dark:bg-slate-800 border-primary-50 dark:border-slate-700 ${task.completed ? 'opacity-60' : ''}`}
    >
      <button
        onClick={() => onToggle(task)}
        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        className={`w-7 h-7 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
          task.completed ? 'bg-success border-success text-white' : 'border-primary-300 text-transparent'
        }`}
      >
        {task.completed ? '✓' : '○'}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold text-ink dark:text-white truncate ${task.completed ? 'line-through decoration-primary-400' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-muted">{cat.icon} {cat.label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${priority.color}20`, color: priority.color }}>
            {priority.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(task)} aria-label="Edit task" className="p-1.5 text-muted hover:text-primary-600"><Pencil size={15} /></button>
        <button onClick={() => onDelete(task)} aria-label="Delete task" className="p-1.5 text-muted hover:text-danger"><Trash2 size={15} /></button>
      </div>
    </motion.div>
  );
}
