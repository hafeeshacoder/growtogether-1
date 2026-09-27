import { formatTimestamp } from '../utils/dateUtils';

export default function AchievementCard({ achievement, locked = false, description }) {
  return (
    <div
      className={`p-4 rounded-xl2 border text-center transition-all ${
        locked
          ? 'bg-primary-50/40 dark:bg-slate-800/40 border-dashed border-primary-100 dark:border-slate-700 opacity-60'
          : 'bg-gradient-to-br from-white to-primary-50 dark:from-slate-800 dark:to-primary-900/30 border-primary-100 dark:border-slate-700 shadow-card'
      }`}
    >
      <div className={`text-3xl mb-2 ${locked ? 'grayscale' : ''}`}>{achievement.icon}</div>
      <p className="font-semibold text-sm text-ink dark:text-white">{achievement.title}</p>
      <p className="text-[11px] text-muted mt-1">{description || achievement.description}</p>
      {!locked && achievement.unlockedAt && (
        <p className="text-[10px] text-primary-500 mt-2">Unlocked {formatTimestamp(achievement.unlockedAt)}</p>
      )}
      {locked && <p className="text-[10px] text-muted mt-2">🔒 Locked</p>}
    </div>
  );
}
