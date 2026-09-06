import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthGate, GuestGate } from './components/common/Guards';
import { useAuth } from './stores/auth';
import { useSettings } from './stores/settings';
import { useUi, useToast } from './stores/ui';
import { FullLoader } from './components/ui/Spinner';
import AppShell from './components/layout/AppShell';

/* ---------- Applies persisted prefs to <html> ---------- */
function PrefsApplier() {
  const theme = useSettings((s) => s.theme);
  const accent = useSettings((s) => s.accent);
  const fontScale = useSettings((s) => s.fontScale);
  const density = useSettings((s) => s.density);
  const motion = useSettings((s) => s.motion);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const resolved = theme === 'system' ? (mq.matches ? 'light' : 'dark') : theme;
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
    };
    apply();
    root.dataset.accent = accent;
    root.dataset.fontscale = fontScale;
    root.dataset.density = density;
    root.dataset.motion = motion;
    if (theme === 'system') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme, accent, fontScale, density, motion]);
  return null;
}

/* ---------- Resets scroll on navigation (reader manages its own) ---------- */
function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith('/reader')) return;
    const el = document.getElementById('scroll-root');
    if (el) el.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

/* ---------- Toast host ---------- */
function ToastHost() {
  const toast = useToast();
  const clearToast = useUi((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3600);
    return () => clearTimeout(t);
  }, [toast, clearToast]);
  if (!toast) return null;
  return (
    <button type="button" className="toast" onClick={clearToast} role="status">
      {toast}
    </button>
  );
}

/* ---------- OAuth / email recovery code exchange ---------- */
function AuthCallback() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.status === 'loading');
  const error = useAuth((s) => s.error);
  const exchange = useAuth((s) => s.exchangeAuthCode);
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      exchange().then(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('type') === 'recovery') nav('/reset-password', { replace: true });
        else nav('/dashboard', { replace: true });
      });
    } else {
      nav('/dashboard', { replace: true });
    }
  }, [user, loading, exchange, nav]);

  if (error) return <FullLoader label="Sign-in link expired — please try again." />;
  return <FullLoader label="Completing sign-in…" />;
}

function NotFound() {
  const nav = useNavigate();
  return (
    <div className="nf-page">
      <div className="nf-code">404</div>
      <h1>This page wandered off.</h1>
      <p>The link may be broken, or the page may have moved.</p>
      <div className="nf-actions">
        <button type="button" className="btn btn-primary" onClick={() => nav('/dashboard')}>
          Go to dashboard
        </button>
      </div>
    </div>
  );
}

const withLoader =
  (Comp: React.ComponentType<Record<string, never>>) =>
  (props: Record<string, never>) => (
    <Suspense fallback={<FullLoader label="Loading…" />}>
      <Comp {...props} />
    </Suspense>
  );

const PublicLanding = withLoader(lazy(() => import('./pages/Landing')));
const PublicLogin = withLoader(lazy(() => import('./pages/Login')));
const PublicSignup = withLoader(lazy(() => import('./pages/Signup')));
const PublicForgot = withLoader(lazy(() => import('./pages/ForgotPassword')));
const PublicReset = withLoader(lazy(() => import('./pages/ResetPassword')));
const PublicOnboarding = withLoader(lazy(() => import('./pages/Onboarding')));
const PublicDashboard = withLoader(lazy(() => import('./pages/Dashboard')));
const PublicStudy = withLoader(lazy(() => import('./pages/Study')));
const PublicBooks = withLoader(lazy(() => import('./pages/Books')));
const PublicBookDetail = withLoader(lazy(() => import('./pages/BookDetail')));
const PublicChapterDetail = withLoader(lazy(() => import('./pages/ChapterDetail')));
const PublicReader = withLoader(lazy(() => import('./pages/Reader')));
const PublicPyqs = withLoader(lazy(() => import('./pages/Pyqs')));
const PublicQuizzes = withLoader(lazy(() => import('./pages/Quizzes')));
const PublicQuizRun = withLoader(lazy(() => import('./pages/QuizRun')));
const PublicFlashcards = withLoader(lazy(() => import('./pages/Flashcards')));
const PublicFlashcardStudy = withLoader(lazy(() => import('./pages/FlashcardStudy')));
const PublicDiagrams = withLoader(lazy(() => import('./pages/Diagrams')));
const PublicProgress = withLoader(lazy(() => import('./pages/Progress')));
const PublicBookmarks = withLoader(lazy(() => import('./pages/Bookmarks')));
const PublicSettings = withLoader(lazy(() => import('./pages/Settings')));
const PublicProfile = withLoader(lazy(() => import('./pages/Profile')));
const LazyExamHub = lazy(() =>
  import('./pages/ExamHub').then((m) => ({ default: m.ExamHub })),
);
const PublicExamHub = (props: { code: 'jee' | 'neet' | 'boards' }) => (
  <Suspense fallback={<FullLoader label="Loading…" />}>
    <LazyExamHub {...props} />
  </Suspense>
);

export default function App() {
  const init = useAuth((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <PrefsApplier />
      <ScrollManager />
      <Routes>
        {/* Public (guest) pages */}
        <Route element={<GuestGate />}>
          <Route path="/" element={<PublicLanding />} />
          <Route path="/login" element={<PublicLogin />} />
          <Route path="/signup" element={<PublicSignup />} />
          <Route path="/forgot-password" element={<PublicForgot />} />
        </Route>

        {/* Recovery link & signed-in password change (session may be partial) */}
        <Route path="/reset-password" element={<PublicReset />} />

        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Authenticated application */}
        <Route element={<AuthGate />}>
          <Route path="/onboarding" element={<PublicOnboarding />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<PublicDashboard />} />
            <Route path="/study" element={<PublicStudy />} />
            <Route path="/books" element={<PublicBooks />} />
            <Route path="/books/:bookId" element={<PublicBookDetail />} />
            <Route path="/books/:bookId/chapter/:chapterId" element={<PublicChapterDetail />} />
            <Route
              path="/reader/:bookId/chapter/:chapterId/:pageNumber"
              element={<PublicReader />}
            />
            <Route path="/reader/:bookId/:pageNumber" element={<PublicReader />} />
            <Route path="/pyqs" element={<PublicPyqs />} />
            <Route path="/quizzes" element={<PublicQuizzes />} />
            <Route path="/quiz/run" element={<PublicQuizRun />} />
            <Route path="/flashcards" element={<PublicFlashcards />} />
            <Route path="/flashcards/study" element={<PublicFlashcardStudy />} />
            <Route path="/diagrams" element={<PublicDiagrams />} />
            <Route path="/progress" element={<PublicProgress />} />
            <Route path="/bookmarks" element={<PublicBookmarks />} />
            <Route path="/settings" element={<PublicSettings />} />
            <Route path="/profile" element={<PublicProfile />} />
            <Route path="/jee" element={<PublicExamHub code="jee" />} />
            <Route path="/neet" element={<PublicExamHub code="neet" />} />
            <Route path="/boards" element={<PublicExamHub code="boards" />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastHost />
    </>
  );
}
