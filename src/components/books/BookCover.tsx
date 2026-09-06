import { Link } from 'react-router-dom';
import type { Book } from '../../types';
import { subjectOf } from '../../data/content';
import { SubjectIcon } from '../common/SubjectBadge';
import { cx } from '../../lib/utils';

export function BookCoverArt({ book, size = 'md' }: { book: Book; size?: 'sm' | 'md' | 'lg' }) {
  const subj = subjectOf(book.subject);
  return (
    <div
      className={cx('book-cover', `book-cover-${size}`)}
      style={{ '--cover': book.coverAccent } as React.CSSProperties}
      aria-hidden
    >
      <div className="book-cover-sheen" />
      <div className="book-cover-top">
        <span className="book-cover-subject">
          <SubjectIcon code={book.subject} size={size === 'lg' ? 18 : 14} />
        </span>
        <span className="book-cover-ed">NCERT</span>
      </div>
      <div className="book-cover-mid">
        <SubjectIcon code={book.subject} size={size === 'lg' ? 54 : size === 'md' ? 38 : 24} />
      </div>
      <div className="book-cover-bot">
        <span className="book-cover-title">{book.title}</span>
        <span className="book-cover-class">Class {book.klass} · {subj.name}</span>
      </div>
    </div>
  );
}

export function BookCoverLink({ book, to }: { book: Book; to: string }) {
  return (
    <Link to={to} className="book-cover-link" aria-label={`${book.title} — ${book.subtitle}`}>
      <BookCoverArt book={book} />
    </Link>
  );
}
