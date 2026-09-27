export default function FloatingHearts({ count = 6 }) {
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {items.map((_, i) => (
        <span
          key={i}
          className="absolute text-primary-300/70 animate-floatUp"
          style={{
            left: `${8 + i * (84 / count)}%`,
            bottom: '-10%',
            fontSize: `${12 + (i % 3) * 6}px`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          {i % 2 === 0 ? '💗' : '✨'}
        </span>
      ))}
    </div>
  );
}
