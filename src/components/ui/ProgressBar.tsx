import { cx } from '../../lib/utils';

export function ProgressBar({
  value,
  color,
  size = 'md',
  showLabel = false,
  className,
}: {
  value: number; // 0–100
  color?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('pbar', `pbar-${size}`, className)} role="progressbar" aria-valuenow={pct}>
      <div
        className="pbar-fill"
        style={{
          width: `${pct}%`,
          ...(color ? { background: color } : {}),
        }}
      />
      {showLabel && <span className="pbar-label">{pct}%</span>}
    </div>
  );
}

export function Ring({
  value,
  size = 120,
  stroke = 9,
  color,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--overlay-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? 'var(--acc)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.7s var(--ease-out)' }}
        />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}
