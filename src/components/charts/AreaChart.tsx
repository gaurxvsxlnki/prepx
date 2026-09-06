import { useId } from 'react';

export function AreaChart({
  values,
  labels,
  height = 160,
  color,
  format,
}: {
  values: number[];
  labels?: string[];
  height?: number;
  color?: string;
  format?: (v: number) => string;
}) {
  const gid = useId();
  const w = 600;
  const h = 200;
  const pad = 6;
  const max = Math.max(...values, 1);
  const step = (w - pad * 2) / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => [
    pad + i * step,
    h - pad - (v / max) * (h - pad * 2 - 8),
  ]);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `M${pts[0][0].toFixed(1)},${(h - pad).toFixed(1)} L${line
    .split(' ')
    .join(' L')} L${pts[pts.length - 1][0].toFixed(1)},${(h - pad).toFixed(1)} Z`;
  const colorHex = color ?? 'var(--acc)';

  return (
    <div className="area-chart">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ height }}
        aria-hidden
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorHex} stopOpacity="0.34" />
            <stop offset="100%" stopColor={colorHex} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={w - pad}
            y1={h * f}
            y2={h * f}
            stroke="var(--border-faint)"
            strokeDasharray="3 6"
          />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <polyline
          points={line}
          fill="none"
          stroke={colorHex}
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {pts[pts.length - 1] && (
          <circle
            cx={pts[pts.length - 1][0]}
            cy={pts[pts.length - 1][1]}
            r="4.5"
            fill={colorHex}
            stroke="var(--surface-1)"
            strokeWidth="2"
          />
        )}
      </svg>
      {labels && (
        <div className="area-x">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
      {format && (
        <span className="area-last" aria-hidden>
          {format(values[values.length - 1])}
        </span>
      )}
    </div>
  );
}
