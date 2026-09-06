import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  Home,
  LayoutGrid,
  Library,
  Menu,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';
import { cx } from '../../lib/utils';
import { useSettings } from '../../stores/settings';
import { useUi } from '../../stores/ui';
import { useAuth } from '../../stores/auth';
import { useActivity } from '../../stores/activity';
import { usePresence, useLiveCount } from '../../stores/presence';
import { authMode } from '../../lib/supabase';
import { Logo } from './Logo';
import { SidebarNav } from './SidebarNav';
import { UserMenu } from './UserMenu';
import { IconButton } from '../ui/IconButton';
import GlobalSearch from '../common/GlobalSearch';

/* ---------- Desktop sidebar ---------- */
function Sidebar() {
  const collapsed = useSettings((s) => s.sidebarCollapsed);
  const set = useSettings((s) => s.set);
  return (
    <aside
      className={cx('sidebar', collapsed && 'sidebar-collapsed')}
      aria-label="Sidebar"
    >
      <div className="sb-inner">
        <SidebarNav collapsed={collapsed} />
        <button
          type="button"
          className="sb-collapse"
          onClick={() => set('sidebarCollapsed', !collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

/* ---------- Top bar ---------- */
function Topbar() {
  const { openDrawer, openSearch, showToast } = useUi();
  const location = useLocation();
  const isReader = location.pathname.startsWith('/reader');
  const live = useLiveCount();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <IconButton label="Open menu" className="topbar-burger" onClick={openDrawer}>
          <Menu size={21} />
        </IconButton>
        <span className="topbar-mobile-logo">
          <Logo />
        </span>
      </div>
      <div className="topbar-center px-hide-md">
        {!isReader && (
          <button
            type="button"
            className="live-pill"
            title={authMode === 'supabase' ? 'Live presence via Supabase Realtime' : 'Simulated peer heartbeats (demo mode)'}
          >
            <span className="live-dot" />
            <span className="live-txt">
              {live} students studying now
              {authMode !== 'supabase' && <em className="live-demo"> · demo presence</em>}
            </span>
          </button>
        )}
      </div>
      <div className="topbar-right">
        <IconButton label="Search" className="gs-trigger" onClick={openSearch}>
          <Search size={18} />
        </IconButton>
        <IconButton
          label="Notifications"
          className="notif-btn px-hide-xs"
          onClick={() => showToast('You are all caught up — no new notifications.')}
        >
          <Bell size={18} />
          <span className="notif-dot" aria-hidden />
        </IconButton>
        <UserMenu />
      </div>
    </header>
  );
}

/* ---------- Mobile bottom navigation ---------- */
const MOBILE_NAV = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/study', label: 'Study', icon: BookOpen },
  { to: '/books', label: 'Books', icon: Library },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/pyqs', label: 'More', icon: LayoutGrid, more: true },
];

function BottomNav() {
  const { openDrawer } = useUi();
  return (
    <nav className="bottomnav" aria-label="Mobile navigation">
      {MOBILE_NAV.map((item) =>
        item.more ? (
          <button
            key={item.to}
            type="button"
            className="bn-item"
            onClick={openDrawer}
            aria-label="Open all sections"
          >
            <item.icon size={21} strokeWidth={1.9} />
            <span>{item.label}</span>
          </button>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cx('bn-item', isActive && 'is-active')}
          >
            <item.icon size={21} strokeWidth={1.9} />
            <span>{item.label}</span>
          </NavLink>
        ),
      )}
    </nav>
  );
}

/* ---------- Shell ---------- */
export default function AppShell() {
  const location = useLocation();
  const closeDrawer = useUi((s) => s.closeDrawer);
  const drawerOpen = useUi((s) => s.drawerOpen);
  const isReader = location.pathname.startsWith('/reader');
  const live = useLiveCount();
  const user = useAuth((s) => s.user);

  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  /* Start presence heartbeat + seed the demo persona's history once. */
  useEffect(() => {
    const presence = usePresence.getState();
    presence.start();
    if (user?.id) useActivity.getState().ensureSeed(user.id);
    return () => presence.stop();
  }, [user?.id]);

  return (
    <div className="shell">
      <div className="shell-desktop">
        <Sidebar />
      </div>
      <div className={cx('shell-main', isReader && 'shell-main-reader')}>
        <Topbar />
        <main className={cx('content', isReader && 'content-bleed')} id="scroll-root">
          <div className={cx('content-inner', isReader && 'content-inner-bleed')}>
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
      <GlobalSearch />

      {drawerOpen && (
        <div className="drawer-layer">
          <div className="drawer-backdrop" onClick={closeDrawer} />
          <aside className="drawer" aria-label="Menu">
            <div className="drawer-head">
              <Logo />
              <IconButton label="Close menu" onClick={closeDrawer}>
                <X size={19} />
              </IconButton>
            </div>
            <div className="drawer-nav">
              <SidebarNav onNavigate={closeDrawer} />
            </div>
            <div className="drawer-foot">
              <span className="live-pill" style={{ pointerEvents: 'none' }}>
                <span className="live-dot" />
                <span className="live-txt">{live} studying now</span>
              </span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
