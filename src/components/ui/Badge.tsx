import type { ReactNode } from 'react';
import { cx } from '../../lib/utils';

export type BadgeTone =
  | 'default'
  | 'accent'
  | 'ok'
  | 'warn'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'subject'
  | 'rose';

export function Badge({
  tone = 'default',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx('badge', `badge-${tone}`, className)}>{children}</span>;
}

export function Chip({
  selected,
  onClick,
  children,
  className,
  disabled,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx('chip', selected && 'chip-selected', className)}
    >
      {children}
    </button>
  );
}
