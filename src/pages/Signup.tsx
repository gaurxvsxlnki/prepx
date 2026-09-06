import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthShell, AuthError, Divider } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Input';
import { useAuth } from '../stores/auth';
import { authMode } from '../lib/supabase';
import { GoogleIcon } from '../components/auth/GoogleIcon';

export default function Signup() {
  const { error, clearError, signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [needConfirm, setNeedConfirm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) return setLocalError('Please enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setLocalError('Enter a valid email address.');
    if (password.length < 6) return setLocalError('Password must be at least 6 characters.');
    if (password !== confirm) return setLocalError('Passwords do not match.');
    setLocalError(null);
    setBusy(true);
    try {
      const res = await signUp(email.trim(), password, fullName.trim());
      setNeedConfirm(res.needsEmailConfirm);
    } finally {
      setBusy(false);
    }
  };

  const errMsg = error ?? localError;

  if (needConfirm) {
    return (
      <AuthShell>
        <div className="auth-confirm">
          <CheckCircle2 size={40} className="auth-confirm-ic" />
          <h2>Check your inbox</h2>
          <p>
            We sent a confirmation link to <strong>{email}</strong>. Open it to activate your
            account, then sign in.
          </p>
          <Button to="/login" block size="lg">
            Go to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="auth-head">
        <h2>Create your account</h2>
        <p>Join PrepX — free to start, built for serious prep.</p>
      </div>

      <Button block variant="secondary" size="lg" disabled={busy} onClick={() => signInWithGoogle()}>
        <GoogleIcon /> Continue with Google
      </Button>

      <Divider label="or sign up with email" />

      <form className="auth-form" onSubmit={submit}>
        <Field label="Full name">
          <Input
            autoComplete="name"
            placeholder="Gaurav Sharma"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError();
            }}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
          />
        </Field>
        <div className="auth-pair">
          <Field label="Password">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
            />
          </Field>
          <Field label="Confirm password">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                clearError();
              }}
            />
          </Field>
        </div>
        {authMode === 'demo' && (
          <p className="auth-note">
            Demo mode: no e-mail is sent. Your account is created instantly so you can explore
            onboarding.
          </p>
        )}
        <AuthError error={errMsg} />
        <Button block size="lg" type="submit" disabled={busy} trailing={<ArrowRight size={16} />}>
          Create account
        </Button>
        <p className="auth-terms">
          By continuing you agree to the Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
