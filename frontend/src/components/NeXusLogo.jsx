// NeXusLogo.jsx — drop this anywhere in your React Vite project
// Usage: <NeXusLogo size={48} /> or <NeXusLogo size={200} />

export default function NeXusLogo({ size = 200 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-label="neXus logo"
      role="img"
    >
      <defs>
        <linearGradient id="nx-bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f1117" />
          <stop offset="100%" stopColor="#1a1d24" />
        </linearGradient>
        <linearGradient id="nx-xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9fef00" />
          <stop offset="100%" stopColor="#6fba00" />
        </linearGradient>
        <filter id="nx-glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nx-softglow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="200" height="200" rx="38" ry="38" fill="url(#nx-bgGrad)" />

      {/* Grid lines */}
      <line x1="0" y1="100" x2="200" y2="100" stroke="#9fef00" strokeWidth="0.3" strokeOpacity="0.08" />
      <line x1="100" y1="0" x2="100" y2="200" stroke="#9fef00" strokeWidth="0.3" strokeOpacity="0.08" />

      {/* Outer hexagon ring */}
      <polygon
        points="100,18 172,59 172,141 100,182 28,141 28,59"
        fill="none" stroke="#9fef00" strokeWidth="1" strokeOpacity="0.15"
      />

      {/* Inner hexagon ring */}
      <polygon
        points="100,38 155,69 155,131 100,162 45,131 45,69"
        fill="none" stroke="#9fef00" strokeWidth="0.8" strokeOpacity="0.1"
      />

      {/* Glow halo */}
      <ellipse cx="100" cy="100" rx="44" ry="44" fill="#9fef00" fillOpacity="0.07" filter="url(#nx-softglow)" />

      {/* X — stroke 1 */}
      <line x1="62" y1="62" x2="138" y2="138"
        stroke="url(#nx-xGrad)" strokeWidth="18" strokeLinecap="round"
        filter="url(#nx-glow)"
      />

      {/* X — stroke 2 */}
      <line x1="138" y1="62" x2="62" y2="138"
        stroke="url(#nx-xGrad)" strokeWidth="18" strokeLinecap="round"
        filter="url(#nx-glow)"
      />

      {/* Dark center diamond */}
      <rect x="89" y="89" width="22" height="22" rx="2" fill="#0f1117" transform="rotate(45 100 100)" />

      {/* Corner dots */}
      <circle cx="62" cy="62" r="5" fill="#9fef00" fillOpacity="0.85" filter="url(#nx-glow)" />
      <circle cx="138" cy="62" r="5" fill="#9fef00" fillOpacity="0.85" filter="url(#nx-glow)" />
      <circle cx="62" cy="138" r="5" fill="#9fef00" fillOpacity="0.85" filter="url(#nx-glow)" />
      <circle cx="138" cy="138" r="5" fill="#9fef00" fillOpacity="0.85" filter="url(#nx-glow)" />

      {/* NEXUS label */}
      <text
        x="100" y="192"
        fontFamily="'Georgia', serif"
        fontSize="9"
        fontWeight="700"
        fill="#9fef00"
        fillOpacity="0.5"
        textAnchor="middle"
        letterSpacing="4"
      >NEXUS</text>
    </svg>
  );
}
