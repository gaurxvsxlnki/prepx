import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { AuthShell, AuthError } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Input';
import { useAuth } from '../stores/auth';
import { authMode } from '../lib/supabase';

export default function ResetPassword() {
  const { user, status, error, updatePassword, exchangeAuthCode } = useAuth();
  const nav = useNavigate();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  /* Recovery links (Supabase) carry a code — exchange it for a session. */
  useEffect(() => {
    if (checked || status !== 'anon') return;
    const hasCode = new URLSearchParams(window.location.search).has('code');
    if (authMode === 'supabase' && hasCode) {
      exchangeAuthCode().finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [checked, status, exchangeAuthCode]);

  const hasSession = status === 'authed' && user;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return setLocalError('Password must be at least 6 characters.');
    if (pw !== pw2) return setLocalError('Passwords do not match.');
    setLocalError(null);
    setBusy(true);
    await updatePassword(pw);
    setBusy(false);
    if (!useAuth.getState().error) {
      setDone(true);
      setTimeout(() => nav('/login'), 1600);
    }
  };

  if (done) {
    return (
      <AuthShell>
        <div className="auth-confirm">
          <KeyRound size={40} className="auth-confirm-ic" />
          <h2>Password updated</h2>
          <p>Your new password is active. Taking you to sign in…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="auth-head">
        <h2>Choose a new password</h2>
        <p>Use at least 6 characters — mix letters and numbers.</p>
      </div>

      {hasSession ? (
        <form className="auth-form" onSubmit={submit}>
          <Field label="New password">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </Field>
          <Field label="Confirm new password">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
          </Field>
          <AuthError error={error ?? localError} />
          <Button block size="lg" type="submit" disabled={busy}>
            Update password
          </Button>
        </form>
      ) : (
        <div className="auth-confirm">
          <ShieldAlert size={38} className="auth-confirm-ic" />
          <h2>Link invalid or expired</h2>
          <p>
            Password reset links work for 60 minutes. Request a fresh one — or sign in first and
            update your password from Settings.
          </p>
          {authMode === 'demo' && (
            <p className="auth-note">
              Demo mode has no e-mail delivery. Sign in, then visit /reset-password from Settings
              to try the flow.
            </p>
          )}
          <Button to="/forgot-password" block size="lg">
            Request new link
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
