import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl2 border border-primary-100 dark:border-slate-600 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
      />
    </div>
  );
}
