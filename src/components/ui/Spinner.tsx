import { cx } from '../../lib/utils';

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cx('spinner', className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}

export function FullLoader({ label = 'Loading PrepX…' }: { label?: string }) {
  return (
    <div className="full-loader">
      <div className="full-loader-mark">P</div>
      <Spinner size={18} />
      <p className="full-loader-label">{label}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size={22} />
    </div>
  );
}
