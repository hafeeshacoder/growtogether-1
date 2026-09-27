export default function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`bg-white dark:bg-slate-800/70 rounded-xl2 shadow-card p-4 sm:p-5 border border-primary-50 dark:border-slate-700 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
