export default function Avatar({ emoji = '🌸', size = 'md', ring = false, className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-base', md: 'w-11 h-11 text-xl', lg: 'w-16 h-16 text-3xl', xl: 'w-24 h-24 text-5xl' };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center flex-shrink-0 ${ring ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900' : ''} ${className}`}
    >
      <span>{emoji}</span>
    </div>
  );
}
