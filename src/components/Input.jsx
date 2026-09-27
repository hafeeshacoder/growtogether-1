export function Field({ label, htmlFor, error, children, hint }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-ink dark:text-primary-50 mb-1.5">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted mt-1">{hint}</p>}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

const baseInput =
  'w-full rounded-xl border border-primary-100 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-ink dark:text-white placeholder:text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus:border-primary-400 transition-colors';

export function Input({ className = '', ...rest }) {
  return <input className={`${baseInput} ${className}`} {...rest} />;
}

export function Textarea({ className = '', rows = 3, ...rest }) {
  return <textarea rows={rows} className={`${baseInput} resize-none ${className}`} {...rest} />;
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select className={`${baseInput} appearance-none ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function DateInput(props) {
  return <Input type="date" {...props} />;
}

export function TimeInput(props) {
  return <Input type="time" {...props} />;
}

export default Input;
