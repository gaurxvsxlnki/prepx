import { useMemo } from 'react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  Flame,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Target,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ContinueCard } from '../components/dashboard/ContinueCard';
import { SearchBox } from '../components/dashboard/SearchBox';
import { AreaChart } from '../components/charts/AreaChart';
import { Badge } from '../components/ui/Badge';
import { Ring } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useProfile } from '../stores/profile';
import { useActivity } from '../stores/activity';
import { useLiveCount } from '../stores/presence';
import {
  buildSummary,
  continueTarget,
  dailySeries,
  weakChapterContext,
} from '../lib/progress';
import { firstNameOf, greeting } from '../lib/utils';
import { subjectOf } from '../data/content';
import { SubjectIcon, SubjectBadge } from '../components/common/SubjectBadge';
import type { TrackEvent } from '../types/study';
import type { SubjectCode } from '../types';

const SCOPE: SubjectCode[] = ['physics', 'chemistry', 'biology', 'mathematics'];

const ACTIVITY_UI: Record<
  TrackEvent['kind'],
  { icon: ComponentType<{ size?: number | string }>; cls: string }
> = {
  page_view: { icon: BookOpen, cls: 'page' },
  question: { icon: Sparkles, cls: 'quiz' },
  quiz: { icon: Sparkles, cls: 'quiz' },
  pyq: { icon: Target, cls: 'pyq' },
  flashcard: { icon: Layers, cls: 'flashcard' },
  diagram: { icon: ImageIcon, cls: 'diagram' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
}

function minutesLast7(events: TrackEvent[], subject: SubjectCode): number {
  const cutoff = Date.now() - 7 * 864e5;
  return Math.round(
    events
      .filter((e) => e.subject === subject && new Date(e.at).getTime() >= cutoff)
      .reduce((s, e) => s + e.minutes, 0),
  );
}

export default function Dashboard() {
  const profile = useProfile((s) => s.profile);
  const events = useActivity((s) => s.events);
  const live = useLiveCount();

  const name = profile?.full_name ?? 'there';
  const scope = profile?.subjects && profile.subjects.length > 0 ? profile.subjects : SCOPE;

  const summary = useMemo(() => buildSummary(events, scope), [events, scope]);
  const continueData = useMemo(() => continueTarget(events), [events]);
  const chart14 = useMemo(() => dailySeries(events, 14), [events]);
  const fortnightMin = chart14.reduce((s, d) => s + d.minutes, 0);
  const goalDays = chart14.slice(-7).filter((d) => d.minutes >= 30).length;

  const recent = useMemo(
    () => [...events].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6),
    [events],
  );

  const focusRows = useMemo(
    () => weakChapterContext(summary.weakChapters).filter((r) => r.href),
    [summary.weakChapters],
  );

  const hasData = summary.questionsAttempted + summary.pyqAttempted + summary.pagesRead + summary.minutesTotal > 0;

  const attemptTotal =
    summary.questionsAttempted + summary.pyqAttempted + summary.quizAttempted;

  return (
    <div className="dash">
      {/* Greeting + search + live indicator */}
      <div className="dash-hero">
        <div>
          <h1 className="dash-greet">
            {greeting()}, {firstNameOf(name)} <span aria-hidden>👋</span>
          </h1>
          <p className="dash-sub">Keep your preparation moving.</p>
        </div>
        <div className="dash-hero-side">
          <SearchBox />
          <span className="live-pill dash-live">
            <span className="live-dot" />
            {live} students studying now
          </span>
        </div>
      </div>

      {!hasData ? (
        <Card className="dash-empty">
          <EmptyState
            icon={<BookOpen size={26} />}
            title="Your study engine is ready"
            text="Open a real NCERT page and answer what's mapped to it — every read, attempt and card here updates your dashboard."
            actionLabel="Start with a book"
            to="/books"
          />
        </Card>
      ) : (
        <>
          {/* Stat strip */}
          <div className="stat-grid">
            <Card className="stat-card" hover>
              <div className="stat-val">{summary.questionsAttempted + summary.quizAttempted}</div>
              <div className="stat-label">questions answered</div>
              <div className="stat-delta">
                <ArrowUpRight size={13} className="stat-delta-ic" />
                {summary.questionsCorrect} correct
              </div>
            </Card>
            <Card className="stat-card" hover>
              <div className="stat-val">{summary.pyqAttempted}</div>
              <div className="stat-label">PYQs attempted</div>
              <div className="stat-delta">
                <ArrowUpRight size={13} className="stat-delta-ic" />
                {summary.pyqCorrect} correct
              </div>
            </Card>
            <Card className="stat-card" hover>
              <div className="stat-val">{summary.accuracy}%</div>
              <div className="stat-label">accuracy</div>
              <div className="stat-delta">
                <ArrowUpRight size={13} className="stat-delta-ic" />
                {attemptTotal} attempts
              </div>
            </Card>
            <Card className="stat-card" hover>
              <div className="stat-val">{summary.streakDays} day</div>
              <div className="stat-label">study streak</div>
              <div className="stat-delta">
                <span className="stat-delta-flat">•</span>
                longest {summary.longestStreak}
              </div>
            </Card>
          </div>

          {/* Main grid */}
          <div className="dash-grid">
            <div className="dash-col">
              <section className="dash-section">
                <div className="section-head">
                  <h2 className="section-title">Continue learning</h2>
                  <Link to="/study" className="px-link">
                    View study space
                  </Link>
                </div>
                {continueData ? (
                  <ContinueCard data={continueData} />
                ) : (
                  <Card>
                    <p className="px-muted-2 px-fs-sm">
                      You haven’t opened a textbook yet — pick one and the reader will remember
                      your exact page.
                    </p>
                  </Card>
                )}
              </section>

              <section className="dash-section">
                <div className="section-head">
                  <h2 className="section-title">Study statistics</h2>
                  <span className="px-muted-2 px-fs-sm">last 14 days</span>
                </div>
                <Card>
                  <div className="stat-summary">
                    <div>
                      <div className="stat-big">{Math.round(fortnightMin / 60)} h</div>
                      <div className="stat-label">focused this fortnight</div>
                    </div>
                    <div>
                      <div className="stat-big">
                        {fortnightMin > 0 ? Math.round(fortnightMin / 14) : 0}{' '}
                        <span className="px-fs-md">min/day</span>
                      </div>
                      <div className="stat-label">daily average</div>
                    </div>
                    <div>
                      <div className="stat-big ok">✓ goal</div>
                      <div className="stat-label">{goalDays} of 7 days met</div>
                    </div>
                  </div>
                  {fortnightMin > 0 ? (
                    <AreaChart
                      values={chart14.map((d) => d.minutes)}
                      height={150}
                      format={(v) => `${v} min today`}
                    />
                  ) : (
                    <p className="px-muted-2 px-fs-sm">Reading pages logs study minutes here.</p>
                  )}
                </Card>
              </section>

              <section className="dash-section">
                <div className="section-head">
                  <h2 className="section-title">Recent activity</h2>
                  <Link to="/progress" className="px-link">
                    Full progress
                  </Link>
                </div>
                <Card pad={false} className="activity-card">
                  {recent.length === 0 ? (
                    <p className="px-muted-2 px-fs-sm px-s4" style={{ padding: 'var(--s4)' }}>
                      Activity appears here as you study.
                    </p>
                  ) : (
                    <ul className="activity-list">
                      {recent.map((a) => {
                        const ui = ACTIVITY_UI[a.kind];
                        const I = ui.icon as ComponentType<{ size?: number }>;
                        return (
                          <li key={a.id} className="activity-item">
                            <span className={`activity-ic activity-ic-${ui.cls}`}>
                              <I size={15} />
                            </span>
                            <div className="px-grow activity-body">
                              <p className="activity-title">{a.label}</p>
                              <p className="activity-meta">
                                {subjectOf(a.subject).name}
                                {a.minutes ? ` · ${a.minutes} min` : ''}
                              </p>
                            </div>
                            <span className="activity-time">{timeAgo(a.at)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Card>
              </section>
            </div>

            <div className="dash-col">
              <section className="dash-section">
                <div className="section-head">
                  <h2 className="section-title">Preparation overview</h2>
                </div>
                <Card>
                  <div className="overview">
                    <Ring value={summary.accuracy} size={132} stroke={11}>
                      <strong className="overview-val">{summary.accuracy}%</strong>
                      <span className="overview-cap">accuracy</span>
                    </Ring>
                    <div className="overview-stats">
                      <div className="overview-row">
                        <span className="overview-dot" style={{ background: 'var(--ok)' }} />
                        <div>
                          <strong>{summary.questionsCorrect + summary.pyqCorrect}</strong>
                          <span>correct answers</span>
                        </div>
                      </div>
                      <div className="overview-row">
                        <span className="overview-dot" style={{ background: 'var(--acc)' }} />
                        <div>
                          <strong>{summary.pagesRead}</strong>
                          <span>pages read</span>
                        </div>
                      </div>
                      <div className="overview-row">
                        <span className="overview-dot" style={{ background: 'var(--warn)' }} />
                        <div>
                          <strong>{summary.streakDays}-day</strong>
                          <span>study streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overview-foot">
                    <Badge tone="ok">
                      <Flame size={13} /> {summary.streakDays > 0 ? 'On a roll' : 'Start today'}
                    </Badge>
                    <Link to="/progress" className="px-link px-fs-sm">
                      Details <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </Card>
              </section>

              <section className="dash-section">
                <div className="section-head">
                  <h2 className="section-title">Subject performance</h2>
                  <Link to="/books" className="px-link">
                    Browse books
                  </Link>
                </div>
                <Card pad={false} className="subj-card">
                  <ul className="subj-list">
                    {summary.subjects.map((sp) => {
                      const s = subjectOf(sp.subject);
                      const weekly = minutesLast7(events, sp.subject);
                      return (
                        <li key={sp.subject} className="subj-row">
                          <span className="subj-ic" style={{ background: s.soft, color: s.color }}>
                            <SubjectIcon code={sp.subject} size={17} />
                          </span>
                          <div className="px-grow">
                            <div className="subj-row-head">
                              <span className="subj-name">{s.name}</span>
                              <span className="subj-pct">{sp.accuracy}%</span>
                            </div>
                            <div className="subj-bar">
                              <span
                                className="subj-bar-fill"
                                style={{ width: `${sp.accuracy}%`, background: s.color }}
                              />
                            </div>
                            <div className="subj-row-meta">
                              {sp.attempted} attempts · {sp.correct} correct · {weekly} min this
                              week
                            </div>
                          </div>
                          <SubjectBadge code={sp.subject} showName={false} />
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </section>

              <section className="dash-section">
                <div className="section-head">
                  <h2 className="section-title">Recommended study</h2>
                  <span className="px-muted-2 px-fs-sm">for you</span>
                </div>
                <div className="rec-stack">
                  {focusRows.slice(0, 2).map((r) => (
                    <Link key={r.stat.chapterId} to={r.href!} className="rec-card">
                      <div className="rec-top">
                        <span className="rec-reason">
                          Weak — {r.stat.accuracy}% accuracy · focus next
                        </span>
                        <ArrowUpRight size={14} className="px-muted-2" />
                      </div>
                      <strong className="rec-title">{r.title}</strong>
                      <p className="rec-sub">
                        {r.stat.attempted} attempts · {r.bank} items in the chapter bank
                      </p>
                      <span className="rec-cta">Drill this chapter →</span>
                    </Link>
                  ))}
                  <Link to="/quizzes" className="rec-card">
                    <div className="rec-top">
                      <span className="rec-reason">Timed practice</span>
                      <ArrowUpRight size={14} className="px-muted-2" />
                    </div>
                    <strong className="rec-title">Quiz yourself</strong>
                    <p className="rec-sub">Chapter, subject or PYQ pattern — auto-scored with explanations.</p>
                    <span className="rec-cta">Build a quiz →</span>
                  </Link>
                  <Link to="/reader/bio-11/chapter/living-world/3" className="rec-card">
                    <div className="rec-top">
                      <span className="rec-reason">Real NCERT page</span>
                      <ArrowUpRight size={14} className="px-muted-2" />
                    </div>
                    <strong className="rec-title">The Living World — p. 3</strong>
                    <p className="rec-sub">Read the page, then solve what is mapped to that exact page.</p>
                    <span className="rec-cta">Open reader →</span>
                  </Link>
                  <div className="rec-note">
                    <Sparkles size={13} /> Demo catalogue — quick links stay, weak-topic picks come
                    from your live analytics.
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
