import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library } from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Badge';
import { BookCoverLink } from '../components/books/BookCover';
import { SubjectBadge } from '../components/common/SubjectBadge';
import { BOOKS, CLASSES, SUBJECTS } from '../data/content';
import { useProfile } from '../stores/profile';
import { cx } from '../lib/utils';
import type { ClassCode, SubjectCode } from '../types';

export default function Books() {
  const profile = useProfile((s) => s.profile);
  const [klass, setKlass] = useState<ClassCode | 'all'>(
    profile?.class ?? 'all',
  );
  const [subject, setSubject] = useState<SubjectCode | 'all'>('all');

  const visible = useMemo(
    () =>
      BOOKS.filter(
        (b) => (klass === 'all' || b.klass === klass) &&
          (subject === 'all' || b.subject === subject),
      ),
    [klass, subject],
  );

  const classChips: Array<ClassCode | 'all'> = ['all', ...CLASSES.map((c) => c.code)];

  return (
    <div>
      <PageHead
        icon={<Library size={22} />}
        title="Books"
        subtitle="Every textbook as real pages — questions attached to each one."
        action={
          <span className="px-muted-2 px-fs-sm">{BOOKS.length} titles · NCERT</span>
        }
      />

      <div className="filter-bar">
        <div className="chip-row">
          {classChips.map((c) => (
            <Chip key={c} selected={klass === c} onClick={() => setKlass(c)}>
              {c === 'all' ? 'All classes' : `Class ${c}`}
            </Chip>
          ))}
        </div>
        <div className="chip-row">
          {(['all', ...SUBJECTS.map((s) => s.code)] as const).map((s) => (
            <Chip
              key={s}
              selected={subject === s}
              onClick={() => setSubject(s === 'all' ? 'all' : (s as SubjectCode))}
            >
              {s === 'all' ? 'All subjects' : subjectOfLabel(s)}
            </Chip>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <Card className="books-empty">
          <BookOpen size={28} className="px-muted-2" />
          <h3>No books in this slice yet</h3>
          <p className="px-muted-2">
            The Class {klass !== 'all' ? klass : ''} catalogue is being imported. Phase 1 ships
            the full Class 11 NCERT set for Biology, Chemistry and Physics.
          </p>
        </Card>
      ) : (
        <div className="books-grid">
          {visible.map((b) => {
            const chapters = b.chapters.length;
            const avail = b.chapters.filter((c) => c.available).length;
            return (
              <Card key={b.id} hover className="book-card">
                <BookCoverLink book={b} to={`/books/${b.id}`} />
                <div className="book-card-body">
                  <div className="book-card-meta">
                    <SubjectBadge code={b.subject} />
                    <span className="px-muted-2 px-fs-sm">Class {b.klass}</span>
                  </div>
                  <h3 className="book-card-title">{b.title}</h3>
                  <p className="book-card-sub">{b.subtitle}</p>
                  <div className="book-card-stats">
                    <span>{chapters} chapters</span>
                    <span className="px-muted-2">·</span>
                    <span className={cx(!avail && 'px-muted-2')}>
                      {avail > 0 ? `${avail} with real pages` : 'pages in Phase 2'}
                    </span>
                  </div>
                  <Link to={`/books/${b.id}`} className="book-card-open">
                    Open book →
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function subjectOfLabel(s: string): string {
  return SUBJECTS.find((x) => x.code === s)?.name ?? s;
}
