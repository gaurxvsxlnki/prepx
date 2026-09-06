import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailing?: ReactNode;
  to?: string; // render as link when present
  block?: boolean;
}

const CLASSES: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  soft: 'btn-soft',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  trailing,
  to,
  block,
  className,
  children,
  ...rest
}: Props) {
  const cls = cx(
    'btn',
    CLASSES[variant],
    `btn-${size}`,
    block && 'btn-block',
    className,
  );

  const inner = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-label">{children}</span>}
      {trailing && <span className="btn-trailing">{trailing}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} onClick={rest.onClick as never}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
