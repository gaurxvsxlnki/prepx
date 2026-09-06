import { useParams } from 'react-router-dom';
import { AlertTriangle, BookOpen, CheckCircle2, Clock, FileText } from 'lucide-react';
import { getBook } from '../data/content';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BookCoverArt } from '../components/books/BookCover';
import { EmptyState } from '../components/ui/EmptyState';
import { subjectOf } from '../data/content';
import { Button } from '../components/ui/Button';
import { cx } from '../lib/utils';

export default function BookDetail() {
  const { bookId } = useParams();
  const book = bookId ? getBook(bookId) : undefined;

  if (!book) {
    return (
      <EmptyState
        icon={<AlertTriangle size={26} />}
        title="Book not found"
        actionLabel="Back to books"
        to="/books"
      />
    );
  }
  const subj = subjectOf(book.subject);
  const totalPages = book.chapters.reduce((s, c) => s + c.pageCount, 0);
  const available = book.chapters.filter((c) => c.available);

  return (
    <div>
      <PageHead
        crumbs={[
          { label: 'Books', to: '/books' },
          { label: `${book.title} · Class ${book.klass}` },
        ]}
        title={book.title}
        action={
          available.length > 0 ? (
            <Button to={`/books/${book.id}/chapter/${available[0].id}`}>
              <BookOpen size={16} /> Start reading
            </Button>
          ) : undefined
        }
      />

      <Card className="book-detail">
        <BookCoverArt book={book} size="lg" />
        <div className="book-detail-body">
          <div className="book-detail-meta">
            <Badge tone="subject" className="bd-subject">
              <span className="subject-dot" style={{ background: subj.color }} />
              {subj.name}
            </Badge>
            <Badge>Class {book.klass}</Badge>
            <Badge tone="neutral">{book.publisher}</Badge>
          </div>
          <h2 className="book-detail-title">{book.subtitle}</h2>
          <p className="book-detail-desc">{book.description}</p>
          <div className="book-detail-stats">
            <span>
              <FileText size={15} /> {book.chapters.length} chapters
            </span>
            <span>
              <Clock size={15} /> {totalPages} real pages
            </span>
            <span>
              <CheckCircle2 size={15} /> {available.length} chapters image-ready
            </span>
          </div>
        </div>
      </Card>

      <div className="section-head section-head-mt">
        <h2 className="section-title">Chapters</h2>
        <span className="px-muted-2 px-fs-sm">
          {available.length} of {book.chapters.length} chapters with real pages
        </span>
      </div>

      <div className="chapter-list">
        {book.chapters.map((c) => {
          const ready = c.available;
          return (
            <Card key={c.id} hover={ready} className={cx('chapter-row', !ready && 'is-soon')}>
              <div className="chapter-num">{String(c.position).padStart(2, '0')}</div>
              <div className="px-grow">
                <div className="chapter-row-top">
                  <h3 className="chapter-title">{c.title}</h3>
                  {ready ? (
                    <Badge tone="ok">Real pages</Badge>
                  ) : (
                    <Badge tone="neutral">Phase 2</Badge>
                  )}
                </div>
                <p className="chapter-desc">{c.description}</p>
                <div className="chapter-topics">
                  {c.topics.map((t) => (
                    <span key={t} className="topic-chip">
                      {t}
                    </span>
                  ))}
                  <span className="chapter-pages px-muted-2">
                    {c.pageCount} pages
                  </span>
                </div>
              </div>
              <div className="chapter-actions">
                {ready ? (
                  <Button
                    variant="soft"
                    size="sm"
                    to={`/books/${book.id}/chapter/${c.id}`}
                    trailing={<BookOpen size={14} />}
                  >
                    Open
                  </Button>
                ) : (
                  <span className="px-muted-2 px-fs-sm">Importing pages…</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
