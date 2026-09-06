import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, Brain, ScanText } from 'lucide-react';
import { Logo } from '../layout/Logo';
import { authMode } from '../../lib/supabase';

const BULLETS = [
  {
    icon: ScanText,
    title: 'Real NCERT pages',
    text: 'Open the actual printed page — not a rewrite of it.',
  },
  {
    icon: Atom,
    title: 'Questions on every page',
    text: 'MCQs, PYQs and flashcards attached to what you read.',
  },
  {
    icon: Brain,
    title: 'Built for JEE · NEET · Boards',
    text: 'One operating system for Classes 9–12 preparation.',
  },
];

export function AuthShell({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const { pathname } = useLocation();
  return (
    <div className="auth-page">
      <aside className="auth-showcase">
        <div className="auth-showcase-inner">
          <span className="auth-eyebrow">The study operating system</span>
          <h1>
            Read the real page.
            <br />
            <em>Master the exam.</em>
          </h1>
          <p className="auth-lead">
            Every NCERT page becomes a live study surface — questions, past
            papers and diagrams that belong to exactly what you are reading.
          </p>
          <ul className="auth-bullets">
            {BULLETS.map((b) => (
              <li key={b.title}>
                <span className="auth-bullet-ic">
                  <b.icon size={17} strokeWidth={1.9} />
                </span>
                <span>
                  <strong>{b.title}</strong>
                  <br />
                  {b.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="auth-proof">
            <span className="live-dot" /> 2,400+ students prepping right now
          </div>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-main-inner">
          <div className="auth-logo">
            <Logo />
          </div>
          <div className={wide ? 'auth-card auth-card-wide' : 'auth-card'}>{children}</div>
          <p className="auth-alt">
            {pathname.startsWith('/signup') ? (
              <>
                Already have an account? <Link to="/login">Sign in</Link>
              </>
            ) : pathname.startsWith('/login') ? (
              <>
                New to PrepX? <Link to="/signup">Create an account</Link>
              </>
            ) : (
              <Link to="/login">Back to sign in</Link>
            )}
          </p>
          <p className="auth-foot">© {new Date().getFullYear()} PrepX · Exam prep, reimagined</p>
        </div>
      </main>
      {authMode === 'demo' && (
        <div className="demo-ribbon">Demo auth — connect Supabase in .env to go live</div>
      )}
    </div>
  );
}

export function Divider({ label = 'or continue with' }: { label?: string }) {
  return (
    <div className="auth-divider">
      <span>{label}</span>
    </div>
  );
}

export function AuthError({ error }: { error: string | null }) {
  if (!error) return null;
  return <div className="auth-error" role="alert">{error}</div>;
}
