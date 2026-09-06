import type { ReactNode } from 'react';

export function Donut({
  segments,
  size = 150,
  stroke = 13,
  children,
}: {
  segments: Array<{ value: number; color: string }>;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--overlay-2)"
          strokeWidth={stroke}
        />
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const offset = -acc * c;
          acc += frac;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className="donut-label">{children}</div>
    </div>
  );
}
