import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function PageHead({
  title,
  subtitle,
  action,
  crumbs,
  icon,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  crumbs?: Array<{ label: string; to?: string }>;
  icon?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div className="page-head-txt">
        {crumbs && crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={i} className="crumb">
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={13} />}
              </span>
            ))}
          </nav>
        )}
        <h1 className="page-title">
          {icon && <span className="page-title-icon">{icon}</span>}
          {title}
        </h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {action && <div className="page-head-action">{action}</div>}
    </div>
  );
}

export function SectionHead({
  title,
  sub,
  action,
}: {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}
