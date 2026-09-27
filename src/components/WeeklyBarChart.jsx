export default function WeeklyBarChart({ labels, values, max, valueSuffix = '', barColor = 'from-primary-400 to-primary-700' }) {
  const safeMax = max || Math.max(1, ...values);
  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {values.map((v, i) => {
        const pct = Math.max(2, Math.round((v / safeMax) * 100));
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-[10px] text-muted mb-1">{v}{valueSuffix}</span>
            <div className="w-full bg-primary-50 dark:bg-slate-700 rounded-lg flex items-end h-full overflow-hidden">
              <div
                className={`w-full bg-gradient-to-t ${barColor} rounded-lg transition-all duration-700`}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted mt-1 font-medium">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}
