import { useEffect, useState } from 'react';
import { QUOTES } from '../data/quotes';

export default function QuoteCard({ className = '' }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl2 bg-gradient-to-br from-primary-600 via-primary-700 to-rose-deep text-white p-5 shadow-soft ${className}`}>
      <div className="absolute -top-6 -right-6 text-7xl opacity-20 select-none">✨</div>
      <p className="relative text-sm font-medium leading-relaxed">{QUOTES[idx]}</p>
    </div>
  );
}
