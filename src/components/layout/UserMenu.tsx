import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../stores/auth';
import { useProfile } from '../../stores/profile';
import { useSettings } from '../../stores/settings';
import { cx } from '../../lib/utils';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const profile = useProfile((s) => s.profile);
  const resetProfile = useProfile((s) => s.reset);
  const resetSettings = useSettings((s) => s.resetAll);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const name = profile?.full_name || user?.full_name || 'Student';
  const email = profile?.email || user?.email || '';

  const go = (to: string) => {
    setOpen(false);
    nav(to);
  };

  const logout = async () => {
    setOpen(false);
    await signOut();
    resetProfile();
    resetSettings();
    nav('/');
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className={cx('user-menu-trigger', open && 'is-open')}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={name} src={profile?.avatar_url} size={34} />
        <span className="user-menu-caret" />
      </button>
      {open && (
        <div className="user-menu-pop" role="menu">
          <div className="user-menu-id">
            <Avatar name={name} src={profile?.avatar_url} size={40} />
            <div className="user-menu-id-txt">
              <strong className="px-truncate">{name}</strong>
              <span className="px-truncate">{email}</span>
            </div>
          </div>
          <div className="user-menu-sep" />
          <button type="button" role="menuitem" onClick={() => go('/profile')}>
            <User size={16} /> My profile
          </button>
          <button type="button" role="menuitem" onClick={() => go('/settings')}>
            <Settings size={16} /> Settings
          </button>
          <div className="user-menu-sep" />
          <button type="button" role="menuitem" className="is-danger" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
