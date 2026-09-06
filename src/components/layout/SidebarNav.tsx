import { NavLink } from 'react-router-dom';
import { cx } from '../../lib/utils';
import { EXAM_NAV, FOOTER_NAV, MAIN_NAV, type NavItem } from './nav';
import { Logo } from './Logo';

function NavList({
  items,
  collapsed,
  onNavigate,
}: {
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <ul className="sb-list">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) => cx('sb-link', isActive && 'is-active')}
            onClick={onNavigate}
          >
            <span className="sb-ic">{<item.icon size={18} strokeWidth={1.9} />}</span>
            <span className="sb-label">{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function SidebarNav({
  collapsed,
  onNavigate,
  header,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  header?: React.ReactNode;
}) {
  return (
    <div className={cx('sb-nav', collapsed && 'sb-nav-collapsed')}>
      {header}
      <nav aria-label="Primary">
        <NavList items={MAIN_NAV} collapsed={collapsed} onNavigate={onNavigate} />

        <p className="sb-section-label">
          {collapsed ? '—' : 'Exam section'}
        </p>
        <NavList items={EXAM_NAV} collapsed={collapsed} onNavigate={onNavigate} />

        <div className="sb-footer-space" />
        <NavList items={FOOTER_NAV} collapsed={collapsed} onNavigate={onNavigate} />
      </nav>
    </div>
  );
}

export function SidebarLogoHeader({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cx('sb-header', collapsed && 'sb-header-collapsed')}>
      <Logo compact={collapsed} />
    </div>
  );
}
