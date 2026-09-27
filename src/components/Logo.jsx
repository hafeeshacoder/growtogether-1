export default function Logo({ size = 40, animated = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-pulseHeart' : ''} ${className}`}
      role="img"
      aria-label="GrowTogether logo"
    >
      <defs>
        <linearGradient id="logoHeart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id="logoLeaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
      </defs>
      <path
        d="M32 54 C14 42 6 32 6 21 C6 12 13 6 21 6 C26 6 30 9 32 13 C34 9 38 6 43 6 C51 6 58 12 58 21 C58 32 50 42 32 54 Z"
        fill="url(#logoHeart)"
      />
      <path
        d="M32 40 C32 40 32 26 32 20 C32 20 24 20 22 12 C22 12 34 10 34 22 C38 16 46 16 46 16 C46 16 44 26 34 28 C32 32 32 36 32 40 Z"
        fill="url(#logoLeaf)"
        opacity="0.95"
      />
    </svg>
  );
}
