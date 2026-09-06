import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Crosshair,
  Flame,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { PageHead, SectionHead } from '../components/common/PageScaffold';
import { Card, CardHead } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AreaChart } from '../components/charts/AreaChart';
import { Donut } from '../components/charts/Donut';
import { EmptyState } from '../components/ui/EmptyState';
import { useActivity } from '../stores/activity';
import { useProfile } from '../stores/profile';
import { buildSummary, dailySeries, weakChapterContext } from '../lib/progress';
import { subjectOf } from '../data/content';
import { SubjectIcon } from '../components/common/SubjectBadge';
import type { ChapterStat } from '../types/study';
import type { SubjectCode } from '../types';

const SCOPE: SubjectCode[] = ['physics', 'chemistry', 'biology', 'mathematics'];

const fmtMin = (m: number) => (m >= 60 ? `${(m / 60).toFixed(1)}h` : `${m}m`);

export default function Progress() {
  const events = useActivity((s) => s.events);
  const profile = useProfile((s) => s.profile);
  const subjects = profile?.subjects && profile.subjects.length > 0 ? profile.subjects : SCOPE;

  const summary = useMemo(() => buildSummary(events, subjects), [events, subjects]);
  const focus14 = useMemo(() => dailySeries(events, 14), [events]);
  const week = useMemo(() => dailySeries(events, 7), [events]);
  const chapterRows = useMemo(() => weakChapterContext(summary.chapters), [summary.chapters]);

  const total14 = focus14.reduce((s, d) => s + d.minutes, 0);
  const best14 = Math.max(...focus14.map((d) => d.minutes), 0);
  const bestDay = focus14.find((d) => d.minutes === best14 && best14 > 0);
  const hasData = summary.questionsAttempted + summary.pyqAttempted + summary.pagesRead + summary.minutesTotal > 0;

  /* 35-day heat strip */
  const heat = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.at.slice(0, 10), (map.get(e.at.slice(0, 10)) ?? 0) + e.minutes);
    const now = new Date();
    return Array.from({ length: 35 }, (_, i) => {
      const d = new Date(now.getTime() - (34 - i) * 864e5);
      const k = d.toISOString().slice(0, 10);
      return { key: k, minutes: map.get(k) ?? 0 };
    });
  }, [events]);

  const donutSegments = [
    { value: Math.max(summary.questionsCorrect + summary.pyqCorrect, 0), color: 'var(--ok)' },
    {
      value: Math.max(
        summary.questionsAttempted +
          summary.pyqAttempted +
          summary.quizAttempted -
          (summary.questionsCorrect + summary.pyqCorrect),
        0,
      ),
      color: 'var(--danger)',
    },
  ];

  return (
    <div>
      <PageHead
        icon={<TrendingUp size={22} />}
        title="Progress"
        subtitle="Where your preparation stands — updated live from every page, question and quiz."
      />

      {!hasData ? (
        <Card>
          <EmptyState
            icon={<Sparkles size={24} />}
            title="No study activity yet"
            text="Open a textbook page, answer a question or run a quiz — this page updates automatically from your session history."
            actionLabel="Open a book"
            to="/books"
          />
        </Card>
      ) : (
        <>
          <div className="stat-grid">
            <Card className="stat-card">
              <div className="stat-val">{fmtMin(total14)}</div>
              <div className="stat-label">focus · 14 days</div>
              <div className="stat-delta up">
                {summary.activeDays > 0 ? `${summary.activeDays} active day${summary.activeDays === 1 ? '' : 's'}` : '—'}
              </div>
            </Card>
            <Card className="stat-card">
              <div className="stat-val">
                {best14 > 0 ? fmtMin(best14) : '—'}
              </div>
              <div className="stat-label">
                {bestDay ? `best day · ${bestDay.label}` : 'best day this fortnight'}
              </div>
              <div className="stat-delta up">{best14 > 0 ? 'keep pushing' : 'no sessions yet'}</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-val">{summary.accuracy}%</div>
              <div className="stat-label">answer accuracy</div>
              <div className="stat-delta up">
                {summary.questionsAttempted + summary.pyqAttempted + summary.quizAttempted} attempts
              </div>
            </Card>
            <Card className="stat-card">
              <div className="stat-val">{summary.streakDays}</div>
              <div className="stat-label">day streak</div>
              <div className="stat-delta up">
                longest {summary.longestStreak} · {summary.minutesTotal} min total
              </div>
            </Card>
          </div>

          <div className="prog-grid">
            <Card className="prog-main">
              <CardHead
                title="Focus minutes"
                sub="Daily study time over the last 14 days"
                action={<Badge tone="accent">{fmtMin(week.reduce((s, d) => s + d.minutes, 0))} this week</Badge>}
              />
              {focus14.every((d) => d.minutes === 0) ? (
                <p className="px-muted-2 px-fs-sm">No study minutes logged in the last 14 days.</p>
              ) : (
                <AreaChart values={focus14.map((d) => d.minutes)} height={190} format={(v) => `${v} min`} />
              )}
            </Card>

            <Card>
              <CardHead
                title="Answer accuracy"
                sub={`${summary.questionsAttempted + summary.pyqAttempted + summary.quizAttempted} MCQs & PYQs`}
              />
              <div className="donut-center-wrap">
                <Donut segments={donutSegments} size={170} stroke={16}>
                  <strong style={{ fontSize: 'var(--fs-3xl)' }}>{summary.accuracy}%</strong>
                  <span className="px-fs-xs px-muted-2">accurate</span>
                </Donut>
                <div className="donut-legend">
                  <span>
                    <i style={{ background: 'var(--ok)' }} /> Correct ·{' '}
                    {summary.questionsCorrect + summary.pyqCorrect}
                  </span>
                  <span>
                    <i style={{ background: 'var(--danger)' }} /> Wrong ·{' '}
                    {summary.questionsAttempted +
                      summary.pyqAttempted +
                      summary.quizAttempted -
                      (summary.questionsCorrect + summary.pyqCorrect)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="prog-grid">
            <Card className="prog-main">
              <CardHead title="This week" sub="Minutes per day" />
              <div className="hbar-list">
                {week.map((d) => (
                  <div key={d.label} className="hbar-row">
                    <span className="hbar-day">{d.label}</span>
                    <span className="hbar-track">
                      <i style={{ width: `${Math.min(100, (d.minutes / 160) * 100)}%` }} />
                    </span>
                    <strong className="hbar-val">{d.minutes}m</strong>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHead title="Consistency" sub="Last 5 weeks of study" />
              <div className="heat-grid">
                {heat.map((d) => (
                  <span
                    key={d.key}
                    className="heat-cell"
                    style={{
                      background:
                        d.minutes === 0
                          ? 'var(--overlay)'
                          : d.minutes > 100
                            ? 'var(--acc)'
                            : d.minutes > 45
                              ? 'var(--acc-soft-2)'
                              : 'var(--acc-soft)',
                    }}
                    title={d.minutes ? `${d.minutes} min` : 'No study'}
                  />
                ))}
              </div>
              <div className="heat-legend">
                <span>Less</span>
                <i className="heat-dot" />
                <i className="heat-dot" />
                <i className="heat-dot" />
                <i className="heat-dot" />
                <span>More</span>
              </div>
            </Card>
          </div>

          <Card className="prog-subjects">
            <CardHead
              title="Subject performance"
              sub="Attempts, accuracy and time per subject"
              action={<Activity size={16} className="px-muted-2" />}
            />
            <div className="prog-subj-grid">
              {summary.subjects.length === 0 && (
                <p className="px-muted-2 px-fs-sm">Answer questions to build per-subject stats.</p>
              )}
              {summary.subjects.map((sp) => {
                const s = subjectOf(sp.subject);
                return (
                  <div key={sp.subject} className="prog-subj">
                    <div className="prog-subj-head">
                      <span className="prog-subj-name">
                        <span style={{ color: s.color }}>
                          <SubjectIcon code={sp.subject} size={16} />
                        </span>
                        {s.name}
                      </span>
                      <strong>{sp.accuracy}%</strong>
                    </div>
                    <div className="subj-bar">
                      <span
                        className="subj-bar-fill"
                        style={{ width: `${sp.accuracy}%`, background: s.color }}
                      />
                    </div>
                    <p className="px-muted-2 px-fs-sm">
                      {sp.attempted} attempt{sp.attempted === 1 ? '' : 's'} · {sp.correct} correct ·{' '}
                      {fmtMin(sp.minutes)} studied
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <SectionHead
            title="Chapter-level analysis"
            sub="Only chapters with enough attempts are labelled weak or strong — low-attempt chapters stay neutral."
          />
          <Card pad={false} className="prog-chapters">
            {chapterRows.length === 0 ? (
              <p className="px-muted-2 px-fs-sm" style={{ padding: 'var(--s4)' }}>
                No attempted chapters yet — quizzes and reader answers feed this table.
              </p>
            ) : (
              <ul className="prog-chapter-list">
                {chapterRows.map(({ stat, title, href }) => (
                  <li key={stat.chapterId} className="prog-chapter-row">
                    <div className="px-grow">
                      <div className="prog-chapter-head">
                        <span className="prog-chapter-title">{title}</span>
                        {stat.sufficientData ? (
                          <TagStat stat={stat} />
                        ) : (
                          <Badge tone="neutral">more data needed</Badge>
                        )}
                      </div>
                      <div className="subj-bar prog-chapter-bar">
                        <span
                          className="subj-bar-fill"
                          style={{
                            width: `${stat.accuracy}%`,
                            background:
                              stat.accuracy >= 85
                                ? 'var(--ok)'
                                : stat.accuracy >= 65
                                  ? 'var(--warn)'
                                  : 'var(--danger)',
                          }}
                        />
                      </div>
                      <p className="px-muted-2 px-fs-xs">
                        {stat.attempted} attempt{stat.attempted === 1 ? '' : 's'} · {stat.correct}{' '}
                        correct · {stat.accuracy}%
                      </p>
                    </div>
                    {href && (
                      <Link to={href} className="px-link px-fs-sm" aria-label={`Open ${title}`}>
                        <ArrowUpRight size={15} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}

      <div className="prog-note">
        <Crosshair size={14} /> Analytics update live from your session history · demo history is seeded for the demo account only.
        <CalendarDays size={14} /> Weekly reports: off (enable in Settings)
        <Flame size={14} /> Streak counts days with real study activity
      </div>
    </div>
  );
}

function TagStat({ stat }: { stat: ChapterStat }) {
  const label =
    stat.accuracy >= 85 ? 'Strong' : stat.accuracy >= 65 ? 'Average' : 'Needs focus';
  const tone =
    stat.accuracy >= 85 ? 'ok' : stat.accuracy >= 65 ? 'warn' : 'rose';
  return (
    <Badge tone={tone as 'ok' | 'warn' | 'rose'}>
      <BookOpen size={11} /> {label} · {stat.accuracy}%
    </Badge>
  );
}
