export default function ProgressBar({ value = 0, className = '', color = 'from-primary-500 to-primary-700', height = 'h-2.5', showLabel = false }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-primary-50 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${v}%` }}
          role="progressbar"
          aria-valuenow={v}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <span className="text-xs text-muted mt-1 inline-block">{v}%</span>}
    </div>
  );
}
