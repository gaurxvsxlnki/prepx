import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, MessageSquareText, Phone } from 'lucide-react';
import { AuthShell, AuthError, Divider } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Input';
import { useAuth } from '../stores/auth';
import { authMode } from '../lib/supabase';
import { DEMO_OTP } from '../lib/demo-db';
import { GoogleIcon } from '../components/auth/GoogleIcon';

type Tab = 'email' | 'phone';

export default function Login() {
  const { user, status, error, clearError, signInWithGoogle, signInDemoPersona, sendOtp, verifyOtp, signIn } = useAuth();
  const [tab, setTab] = useState<Tab>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (status === 'authed' && user) {
      const from = (loc.state as { from?: string } | null)?.from;
      nav(from && from !== '/login' ? from : '/dashboard', { replace: true });
    }
  }, [status, user, nav, loc.state]);

  const google = async () => {
    setBusy(true);
    await signInWithGoogle();
    setBusy(false);
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setLocalError('Enter your email and password.');
      return;
    }
    setLocalError(null);
    setBusy(true);
    await signIn(email.trim(), password);
    setBusy(false);
  };

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (phone.trim().length < 8) {
      setLocalError('Enter a valid phone number with country code.');
      return;
    }
    setLocalError(null);
    setBusy(true);
    await sendOtp(phone.trim());
    if (!useAuth.getState().error) setCodeSent(true);
    setBusy(false);
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setBusy(true);
    await verifyOtp(phone.trim(), code.trim());
    setBusy(false);
  };

  const errorMsg = error ?? localError;

  return (
    <AuthShell>
      <div className="auth-head">
        <h2>Welcome back</h2>
        <p>Sign in to continue your preparation.</p>
      </div>

      <div className="auth-methods">
        <Button block variant="secondary" size="lg" onClick={google} disabled={busy} icon={<GoogleIcon />}>
          Continue with Google
        </Button>
        {authMode === 'demo' && (
          <Button
            block
            variant="soft"
            size="lg"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await signInDemoPersona();
              setBusy(false);
            }}
          >
            Explore the demo dashboard
          </Button>
        )}
      </div>

      <Divider />

      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={tab === 'email' ? 'is-active' : ''}
          onClick={() => {
            setTab('email');
            clearError();
          }}
        >
          <Mail size={15} /> Email
        </button>
        <button
          type="button"
          role="tab"
          className={tab === 'phone' ? 'is-active' : ''}
          onClick={() => {
            setTab('phone');
            clearError();
          }}
        >
          <MessageSquareText size={15} /> Mobile OTP
        </button>
      </div>

      {tab === 'email' ? (
        <form className="auth-form" onSubmit={submitEmail}>
          <Field label="Email">
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <div className="auth-row-between">
            <span />
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>
          <AuthError error={errorMsg} />
          <Button block size="lg" type="submit" disabled={busy} trailing={<ArrowRight size={16} />}>
            Sign in
          </Button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={codeSent ? submitCode : sendCode}>
          {!codeSent ? (
            <>
              <Field
                label="Phone number"
                hint={
                  authMode === 'demo'
                    ? `Demo mode: no SMS is sent — enter any number, then use OTP ${DEMO_OTP}.`
                    : 'We will send a 6-digit verification code via SMS.'
                }
              >
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="+91 98xxxxxx00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              <AuthError error={errorMsg} />
              <Button block size="lg" type="submit" disabled={busy}>
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="auth-code-sent">
                <Phone size={15} />
                Code sent to <strong>{phone}</strong>
                {authMode === 'demo' && <> — demo OTP is {DEMO_OTP}.</>}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setCodeSent(false);
                    clearError();
                  }}
                >
                  Change number
                </button>
              </div>
              <Field label="6-digit code">
                <Input
                  inputMode="numeric"
                  placeholder="••••••"
                  maxLength={6}
                  value={code}
                  autoFocus
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />
              </Field>
              <AuthError error={errorMsg} />
              <Button block size="lg" type="submit" disabled={busy || code.length < 4}>
                Verify & continue
              </Button>
            </>
          )}
        </form>
      )}
    </AuthShell>
  );
}
