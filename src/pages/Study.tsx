import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarClock, Flame, Plus } from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Ring } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { ContinueCard } from '../components/dashboard/ContinueCard';
import { useProfile } from '../stores/profile';
import { BOOKS, subjectOf } from '../data/content';
import { CONTINUE_LEARNING, SUBJECT_PROGRESS } from '../data/demo';
import { SubjectIcon } from '../components/common/SubjectBadge';

export default function Study() {
  const profile = useProfile((s) => s.profile);
  const subjects =
    profile?.subjects && profile.subjects.length > 0
      ? profile.subjects
      : (['physics', 'chemistry', 'biology', 'mathematics'] as const);

  const books = BOOKS.filter((b) => (subjects as string[]).includes(b.subject));

  return (
    <div>
      <PageHead
        icon={<BookOpen size={22} />}
        title="My Study"
        subtitle={
          profile?.exam_goal
            ? `Preparing for ${profile.exam_goal.replace('-', ' + ').toUpperCase()} · Class ${profile.class}`
            : 'Your personalised study space'
        }
        action={
          <Button to="/books" variant="soft">
            <Plus size={15} /> Add books
          </Button>
        }
      />

      <div className="study-grid">
        <div className="study-main">
          <section>
            <div className="section-head">
              <h2 className="section-title">Continue learning</h2>
              <Link to="/dashboard" className="px-link">
                Dashboard
              </Link>
            </div>
            <ContinueCard data={CONTINUE_LEARNING} />
          </section>

          <section className="mt-section">
            <div className="section-head">
              <h2 className="section-title">Your books</h2>
            </div>
            <div className="study-books">
              {books.map((b) => {
                const subj = subjectOf(b.subject);
                const progress = SUBJECT_PROGRESS.find((s) => s.subject === b.subject)?.pct ?? 0;
                return (
                  <Card key={b.id} hover className="study-book">
                    <div className="study-book-head">
                      <span className="study-book-ic" style={{ background: subj.soft, color: subj.color }}>
                        <SubjectIcon code={b.subject} size={18} />
                      </span>
                      <div className="px-grow">
                        <h3>{b.title}</h3>
                        <p className="px-muted-2 px-fs-sm">Class {b.klass} · NCERT</p>
                      </div>
                      <Badge tone="neutral">{progress}%</Badge>
                    </div>
                    <div className="study-book-chapters">
                      {b.chapters.slice(0, 4).map((c) => (
                        <Link
                          key={c.id}
                          to={`/books/${b.id}/chapter/${c.id}`}
                          className={c.available ? 'sb-chapter' : 'sb-chapter is-soon'}
                        >
                          {c.position}. {c.title}
                          {c.available && <ArrowRight size={13} />}
                        </Link>
                      ))}
                    </div>
                    <Link to={`/books/${b.id}`} className="study-book-all">
                      View all chapters →
                    </Link>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="study-side">
          <Card className="study-goal-card">
            <Ring value={62} size={120} stroke={10}>
              <strong style={{ fontSize: 'var(--fs-2xl)' }}>62%</strong>
              <span className="px-fs-xs px-muted-2">weekly goal</span>
            </Ring>
            <div className="study-goal-txt">
              <strong>Daily goal: 60 min</strong>
              <p className="px-muted-2 px-fs-sm">
                You studied 3.2 h yesterday — above target. Keep it up.
              </p>
              <div className="study-goal-row">
                <CalendarClock size={14} />
                Reminder set for 8:00 PM
              </div>
            </div>
          </Card>

          <Card className="streak-card">
            <div className="streak-flame">
              <Flame size={26} fill="currentColor" />
            </div>
            <div>
              <strong className="streak-val">12-day streak</strong>
              <p className="px-muted-2 px-fs-sm">Best: 12 · Your longest run</p>
            </div>
          </Card>

          <Card>
            <h3 className="card-sm-title">Focus sessions this week</h3>
            <ul className="focus-list">
              <li>
                <span>Mon</span>
                <span className="focus-bar"><i style={{ width: '42%' }} /></span>
                <strong>64m</strong>
              </li>
              <li>
                <span>Wed</span>
                <span className="focus-bar"><i style={{ width: '32%' }} /></span>
                <strong>48m</strong>
              </li>
              <li>
                <span>Fri</span>
                <span className="focus-bar"><i style={{ width: '57%' }} /></span>
                <strong>85m</strong>
              </li>
              <li>
                <span>Sun</span>
                <span className="focus-bar"><i style={{ width: '100%' }} /></span>
                <strong>156m</strong>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
