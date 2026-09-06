import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ label, children, active, size = 'md', className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx('icon-btn', `icon-btn-${size}`, active && 'is-active', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
