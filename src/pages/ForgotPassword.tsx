import { useState } from 'react';
import { MailCheck } from 'lucide-react';
import { AuthShell, AuthError } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Input';
import { useAuth } from '../stores/auth';
import { authMode } from '../lib/supabase';

export default function ForgotPassword() {
  const { error, requestReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await requestReset(email.trim());
    setBusy(false);
    if (!useAuth.getState().error) setSent(true);
  };

  if (sent) {
    return (
      <AuthShell>
        <div className="auth-confirm">
          <MailCheck size={40} className="auth-confirm-ic" />
          <h2>Reset link sent</h2>
          <p>
            If an account exists for <strong>{email}</strong>, a password reset link is on its
            way. It expires in 60 minutes.
          </p>
          {authMode === 'demo' && (
            <p className="auth-note">
              Demo mode: no e-mail is delivered. Open{' '}
              <a href="/reset-password" className="auth-link">
                /reset-password
              </a>{' '}
              to see the reset screen.
            </p>
          )}
          <Button to="/login" block size="lg">
            Back to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="auth-head">
        <h2>Reset your password</h2>
        <p>Enter your account email and we will send a secure reset link.</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Email">
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <AuthError error={error} />
        <Button block size="lg" type="submit" disabled={busy || !email.trim()}>
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
