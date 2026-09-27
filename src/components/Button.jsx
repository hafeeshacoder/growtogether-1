export default function Button({
  children, variant = 'primary', size = 'md', className = '', icon, fullWidth, disabled, type = 'button', ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft hover:shadow-glow',
    secondary: 'bg-primary-50 text-primary-800 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-100',
    outline: 'border-2 border-primary-300 text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:border-primary-700 dark:hover:bg-primary-900/30',
    ghost: 'text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-900/30',
    danger: 'bg-danger text-white hover:brightness-95',
    soft: 'bg-white text-primary-700 shadow-card hover:shadow-soft dark:bg-slate-800 dark:text-primary-200',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
