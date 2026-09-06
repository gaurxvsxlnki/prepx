import { ArrowRight, BookOpen } from 'lucide-react';
import type { ContinueLearning } from '../../types';
import { getBook, getChapter, subjectOf } from '../../data/content';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ContinueCard({ data }: { data: ContinueLearning }) {
  const book = getBook(data.bookId);
  const chapter = getChapter(data.bookId, data.chapterId);
  if (!book || !chapter) return null;
  const subj = subjectOf(book.subject);
  const to = `/reader/${book.id}/chapter/${chapter.id}/${data.pageNumber}`;
  const chapterLabel = `${chapter.title} · p. ${data.pageNumber}`;

  return (
    <div className="cont-card" style={{ '--subj': subj.color } as React.CSSProperties}>
      <div className="cont-card-glow" aria-hidden />
      <div className="cont-card-head">
        <Badge tone="neutral">
          <span className="badge-subject">
            <span className="subject-dot" style={{ background: subj.color }} />
            {subj.name} · CLASS {book.klass}
          </span>
        </Badge>
        <BookOpen size={16} className="cont-card-icon" />
      </div>
      <h3 className="cont-card-title">{chapter.title}</h3>
      <p className="cont-card-path">
        {book.title} — {chapter.description.slice(0, 90)}…
      </p>
      <div className="cont-card-progress">
        <ProgressBar value={data.progressPct} showLabel />
        <span className="cont-card-meta">
          Page {data.pageNumber} / {chapter.pageCount}
        </span>
      </div>
      <div className="cont-card-foot">
        <span className="cont-card-chapter">{chapterLabel}</span>
        <Button to={to} size="md" className="cont-card-cta" trailing={<ArrowRight size={16} />}>
          Continue
        </Button>
      </div>
    </div>
  );
}
