import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Layers,
  ListChecks,
  MonitorSmartphone,
  ScanText,
  Sparkles,
  Target,
} from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { LIVE_STUDENTS } from '../data/demo';

export default function Landing() {
  return (
    <div className="landing">
      <header className="land-top">
        <div className="land-container land-top-inner">
          <Link to="/" aria-label="PrepX home">
            <Logo />
          </Link>
          <nav className="land-nav" aria-label="Sections">
            <a href="#why">Why PrepX</a>
            <a href="#how">How it works</a>
            <a href="#reader">The reader</a>
          </nav>
          <div className="land-top-actions">
            <Link to="/login" className="btn btn-ghost btn-md">
              <span className="btn-label">Sign in</span>
            </Link>
            <Link to="/signup" className="btn btn-primary btn-md">
              <span className="btn-label">Start free</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="land-hero">
        <div className="land-container land-hero-grid">
          <div className="land-hero-copy">
            <span className="land-eyebrow">
              <Sparkles size={13} /> Exam prep, rebuilt around the NCERT page
            </span>
            <h1 className="land-h1">
              Open the real page.
              <br />
              <span className="land-h1-accent">Master the exam.</span>
            </h1>
            <p className="land-lead">
              PrepX turns every genuine NCERT textbook page into a live study surface —
              the important questions, PYQs, flashcards and diagrams for that exact page,
              ready before you finish reading.
            </p>
            <div className="land-cta-row">
              <Link to="/signup" className="btn btn-primary btn-lg">
                <span className="btn-label">Start preparing free</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign in
              </Link>
            </div>
            <ul className="land-trust">
              <li><CheckCircle2 size={15} /> No credit card</li>
              <li><CheckCircle2 size={15} /> Real NCERT pages</li>
              <li><CheckCircle2 size={15} /> Private by design</li>
            </ul>
          </div>

          <div className="land-hero-visual" aria-hidden>
            <div className="visa reader-visa">
              <div className="visa-top">
                <span className="visa-dot" />
                <span className="visa-title">Biology · Class 11</span>
                <span className="visa-chip">p. 4 / 9</span>
              </div>
              <div className="visa-body">
                <div className="visa-page">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <span key={i} className="visa-line" style={{ width: `${88 - (i % 4) * 9}%` }} />
                  ))}
                  <span className="visa-fig" />
                  <span className="visa-line" style={{ width: '70%' }} />
                  <span className="visa-line" style={{ width: '55%' }} />
                </div>
                <div className="visa-q">
                  <span className="vq-head">Questions from this page</span>
                  {[0, 1].map((i) => (
                    <div key={i} className="vq-card">
                      <span className="vq-chip" />
                      <span className="vq-line w90" />
                      <span className="vq-line w60" />
                      <span className="vq-opt" />
                      <span className="vq-opt" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="visa live-card">
              <span className="live-dot" />
              <span>{LIVE_STUDENTS} students studying now</span>
            </div>
            <div className="visa flash-card">
              <Layers size={14} /> 6 flashcards due · Taxonomy terms
            </div>
          </div>
        </div>
        <div className="land-strip">
          <span>NCERT-aligned</span>·<span>CBSE</span>·<span>ICSE</span>·
          <span>State boards</span>·<span>JEE Main</span>·<span>JEE Advanced</span>·
          <span>NEET (UG)</span>·<span>Classes 9–12</span>
        </div>
      </section>

      {/* Why */}
      <section className="land-section" id="why">
        <div className="land-container">
          <div className="land-head">
            <h2>A study operating system — not another test app</h2>
            <p>
              Textbooks, past papers, revision and analytics in one calm, focused place. Built
              dark-first so long sessions stay easy on the eyes.
            </p>
          </div>
          <div className="land-features">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature">
                <span className="feature-ic" style={{ '--fc': f.color } as React.CSSProperties}>
                  <f.icon size={19} strokeWidth={1.8} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section className="land-section land-alt" id="how">
        <div className="land-container">
          <div className="land-head">
            <h2>Three steps to your first perfect page</h2>
          </div>
          <div className="land-steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="step">
                <span className="step-num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reader showcase */}
      <section className="land-section" id="reader">
        <div className="land-container land-reader-row">
          <div className="land-reader-copy">
            <span className="land-eyebrow"><ScanText size={13} /> The page reader</span>
            <h2>The real textbook page. Never a fake.</h2>
            <p>
              PrepX shows the genuine printed NCERT page — original typography, diagrams, page
              numbers and margins. Questions sit beside it, not on top of it.
            </p>
            <ul className="land-reader-list">
              <li><CheckCircle2 size={15} /> Desktop & tablet: independent split-screen reading</li>
              <li><CheckCircle2 size={15} /> Mobile: page, controls, then questions — one scroll</li>
              <li><CheckCircle2 size={15} /> Zoom, fit, fullscreen and page bookmarks</li>
              <li><CheckCircle2 size={15} /> Questions, PYQs, flashcards per page in Phase 2</li>
            </ul>
            <Link to="/signup" className="btn btn-primary btn-md land-reader-cta">
              <span className="btn-label">Try the reader</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="land-reader-visual" aria-hidden>
            <div className="mock-split">
              <div className="mock-page">
                <span className="mock-pg-num">2</span>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="mock-line" style={{ width: `${92 - (i % 5) * 8}%` }} />
                ))}
              </div>
              <div className="mock-q">
                <strong>Questions from this page</strong>
                <span className="mline" />
                <span className="mline" />
                <span className="mopt" />
                <span className="mopt" />
                <span className="mbtn">Show answer</span>
              </div>
            </div>
            <div className="mock-controls">
              <span>◀</span><span>Page 2 / 9</span><span>▶</span>
              <i />
              <span>100%</span><span>Fit</span><span>⌗</span><span>⛶</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="land-cta-band">
        <div className="land-container land-cta-inner">
          <h2>Your syllabus is waiting — page one is ready.</h2>
          <p>Join students prepping for Boards, JEE and NEET on real NCERT pages.</p>
          <div className="land-cta-row">
            <Link to="/signup" className="btn btn-primary btn-lg">
              <span className="btn-label">Create free account</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="btn btn-ghost-inverse btn-lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="land-foot">
        <div className="land-container land-foot-inner">
          <Logo />
          <p>© {new Date().getFullYear()} PrepX · For Classes 9–12, Boards · JEE · NEET</p>
          <div className="land-foot-links">
            <a href="#why">Product</a>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: BookOpen, title: 'Real NCERT pages', text: 'Not HTML lookalikes — the actual printed textbook page as an image, with its diagrams and layout intact.', color: 'var(--acc-2)' },
  { icon: ListChecks, title: 'Questions on the page', text: 'MCQs, PYQs and assertion-reason sets that belong to the exact content you are reading.', color: 'var(--ok)' },
  { icon: Layers, title: 'Flashcards that follow you', text: 'Terms and facts turn into spaced-repetition cards right from the pages you cover.', color: 'var(--warn)' },
  { icon: Target, title: 'Exam-aware', text: 'One path serves Boards, JEE and NEET — pattern drills tuned to each exam.', color: 'var(--rose)' },
  { icon: Brain, title: 'Smarter analytics', text: 'Accuracy, streaks and subject progress that tell you what to revise — not just how long you sat.', color: 'var(--info)' },
  { icon: MonitorSmartphone, title: 'Calm, focused design', text: 'Dark, distraction-light interface that feels like a premium tool — on phone, tablet and desktop.', color: 'var(--acc-2)' },
];

const STEPS = [
  { title: 'Set your class & goal', text: 'Class 9–12, Boards, JEE or NEET. PrepX builds your bookshelf and plan.' },
  { title: 'Open a real textbook page', text: 'The actual NCERT page renders crisply — zoom, fit or fullscreen it.' },
  { title: 'Practice in the same view', text: 'Answer what belongs to that page, bookmark it, and move on with clear progress.' },
];
