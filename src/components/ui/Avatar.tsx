import { cx, initialsOf } from '../../lib/utils';

export function Avatar({
  name,
  src,
  size = 36,
  className,
}: {
  name?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  return src ? (
    <img
      src={src}
      alt={name ?? 'avatar'}
      width={size}
      height={size}
      className={cx('avatar', className)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    <span
      aria-hidden
      className={cx('avatar', 'avatar-initials', className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initialsOf(name)}
    </span>
  );
}
