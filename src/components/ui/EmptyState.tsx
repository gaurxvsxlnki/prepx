import type { ReactNode } from 'react';
import { Button } from './Button';

export function EmptyState({
  icon,
  title,
  text,
  actionLabel,
  onAction,
  to,
  compact,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
  to?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'empty empty-compact' : 'empty'}>
      {icon && <div className="empty-icon">{icon}</div>}
      <h3 className="empty-title">{title}</h3>
      {text && <p className="empty-text">{text}</p>}
      {actionLabel &&
        (to ? (
          <Button to={to} variant="soft" size="sm">
            {actionLabel}
          </Button>
        ) : (
          <Button variant="soft" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
