import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  pad?: boolean;
  hover?: boolean;
  children: ReactNode;
}

export function Card({ pad = true, hover, className, children, ...rest }: Props) {
  return (
    <div
      className={cx('card', pad && 'card-pad', hover && 'card-hover', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHead({
  title,
  sub,
  action,
  className,
}: {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('card-head', className)}>
      <div className="card-head-txt">
        <h3 className="card-title">{title}</h3>
        {sub && <p className="card-sub">{sub}</p>}
      </div>
      {action && <div className="card-head-action">{action}</div>}
    </div>
  );
}
