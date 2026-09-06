import { ArrowRight, BookOpen, FileText, Timer, Users } from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EXAM_HUBS } from '../data/demo';
import { BOOKS, subjectOf } from '../data/content';
import { SubjectBadge, SubjectIcon } from '../components/common/SubjectBadge';
import { useProfile } from '../stores/profile';
import { Button } from '../components/ui/Button';
import type { ClassCode } from '../types';

export function ExamMark({ code, className }: { code: 'jee' | 'neet' | 'boards'; className?: string }) {
  const map = { jee: ['exam-ico', 'exam-ico-jee', 'J'], neet: ['exam-ico', 'exam-ico-neet', 'N'], boards: ['exam-ico', 'exam-ico-board', 'B'] } as const;
  const [a, b, letter] = map[code];
  return <span className={`${a} ${b} ${className ?? ''}`}>{letter}</span>;
}

export function ExamHub({ code }: { code: 'jee' | 'neet' | 'boards' }) {
  const hub = EXAM_HUBS[code];
  const profile = useProfile((s) => s.profile);
  const klass: ClassCode = (profile?.class ?? '11') as ClassCode;
  const books = BOOKS.filter((b) => (hub.subjects as string[]).includes(b.subject) && b.klass === klass);

  return (
    <div>
      <PageHead
        icon={<ExamMark code={code} />}
        title={code.toUpperCase()}
        subtitle={hub.blurb}
        action={
          <Badge tone="accent">
            <Users size={13} /> {hub.aspirants}
          </Badge>
        }
      />

      <div className="hub-hero">
        <div className="hub-hero-card">
          <div className="hub-hero-row">
            <ExamMark code={code} />
            <div>
              <strong>{code.toUpperCase()}</strong>
              <span>{hub.pattern}</span>
            </div>
            <span className="hub-hero-dot" />
            <span className="px-muted-2 px-fs-sm">{hub.monthsLeft}</span>
          </div>
          <p className="hub-hero-blurb">{hub.blurb}</p>
          <div className="hub-hero-tags">
            {hub.subjects.map((s) => (
              <SubjectBadge key={s} code={s} />
            ))}
          </div>
        </div>
        <div className="hub-hero-stats">
          <Card className="hub-stat">
            <strong>2,100+</strong>
            <span>chapter sets</span>
          </Card>
          <Card className="hub-stat">
            <strong>1,900+</strong>
            <span>PYQs tagged</span>
          </Card>
          <Card className="hub-stat">
            <strong>Y2Y</strong>
            <span>patterns mapped</span>
          </Card>
        </div>
      </div>

      <div className="section-head section-head-mt">
        <h2 className="section-title">NCERT books for this path</h2>
        <Button to="/books" variant="ghost" size="sm">
          All books <ArrowRight size={14} />
        </Button>
      </div>
      <div className="books-grid books-grid-3">
        {books.map((b) => {
          const s = subjectOf(b.subject);
          const ready = b.chapters.filter((c) => c.available).length;
          return (
            <Card key={b.id} hover className="book-card">
              <div className="book-mini-head">
                <span className="book-mini-ic" style={{ background: s.soft, color: s.color }}>
                  <SubjectIcon code={b.subject} size={20} />
                </span>
                <div>
                  <h3>{b.title}</h3>
                  <p className="px-muted-2 px-fs-sm">Class {b.klass} · NCERT</p>
                </div>
              </div>
              <p className="px-muted-2 px-fs-sm">
                {b.chapters.length} chapters · {ready} with real page images
              </p>
              <Button
                to={`/books/${b.id}`}
                variant="soft"
                size="sm"
                className="hub-open"
              >
                <BookOpen size={14} /> Open book
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="section-head section-head-mt">
        <h2 className="section-title">Pattern practice</h2>
        <span className="px-muted-2 px-fs-sm">full engine in Phase 2</span>
      </div>
      <div className="hub-practice">
        {hub.papers.slice(0, 3).map((p) => (
          <Card key={p.id} hover className="hub-practice-card">
            <FileText size={18} className="px-muted-2" />
            <div className="px-grow">
              <strong>{p.title}</strong>
              <p className="px-muted-2 px-fs-sm">{p.sourceLabel} · {p.year}</p>
            </div>
            <span className="px-muted-2">
              <Timer size={14} /> {p.minutes}m
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
