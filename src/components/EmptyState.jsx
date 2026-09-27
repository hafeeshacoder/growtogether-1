export default function EmptyState({ emoji = '🌷', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="font-semibold text-ink dark:text-white mb-1">{title}</h3>
      {message && <p className="text-sm text-muted max-w-xs mb-4">{message}</p>}
      {action}
    </div>
  );
}
