import { Link } from 'react-router-dom';
import { cx } from '../../lib/utils';

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--acc-2)" />
            <stop offset="1" stopColor="var(--acc-3)" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="var(--surface-2)" />
        <path d="M20 46V18l12 4 12-4v28l-12-4-12 4z" fill="url(#lg)" />
        <path
          d="M32 22v24"
          stroke="var(--bg-app)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </span>
  );
}

export function Logo({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/dashboard" className={cx('logo', className)} aria-label="PrepX home">
      <LogoMark />
      {!compact && (
        <span className="logo-word">
          Prep<span className="logo-x">X</span>
        </span>
      )}
    </Link>
  );
}
