import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useSession } from '../../stores/auth';
import { useProfile } from '../../stores/profile';
import { FullLoader } from '../ui/Spinner';

/** Loads the current user's profile exactly once while signed in. */
function useProfileGate(): { profileReady: boolean } {
  const user = useAuth((s) => s.user);
  const ready = useProfile((s) => s.ready);
  const load = useProfile((s) => s.load);

  useEffect(() => {
    if (user && !ready) {
      load(user).catch((err) => console.error('profile load failed', err));
    }
  }, [user, ready, load]);

  return { profileReady: ready };
}

/** Protected area: auth required + onboarding required (except /onboarding). */
export function AuthGate() {
  const { user, authed, loading } = useSession();
  const { profileReady } = useProfileGate();
  const profile = useProfile((s) => s.profile);
  const loc = useLocation();

  if (loading) return <FullLoader label="Opening PrepX…" />;
  if (!authed || !user) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }
  if (!profileReady) return <FullLoader label="Setting up your space…" />;
  if (profile && !profile.onboarded && loc.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}

/** Public area: authed users go straight to the dashboard. */
export function GuestGate() {
  const { authed, loading } = useSession();
  if (loading) return <FullLoader label="Opening PrepX…" />;
  if (authed) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
