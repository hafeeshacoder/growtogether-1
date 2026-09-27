import { ROUTINE_MODES } from '../data/constants';

export default function ModeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ROUTINE_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`p-3 rounded-xl2 border-2 text-center transition-all ${
            value === m.id
              ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/40 dark:to-slate-800 shadow-soft'
              : 'border-transparent bg-white dark:bg-slate-800'
          }`}
          aria-pressed={value === m.id}
        >
          <div className="text-2xl mb-1">{m.icon}</div>
          <p className="text-xs font-semibold text-ink dark:text-white">{m.label}</p>
        </button>
      ))}
    </div>
  );
}
