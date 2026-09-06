import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, BookX, FileSearch, Image as ImageIcon, Layers, Zap } from 'lucide-react';
import { getBook, subjectOf } from '../data/content';
import { bankForChapter, chapterBankSize, getPageContent } from '../data/questions';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useQuiz } from '../stores/quiz';
import { useUi } from '../stores/ui';

export default function ChapterDetail() {
  const { bookId, chapterId } = useParams();
  const nav = useNavigate();
  const showToast = useUi((s) => s.showToast);
  const quiz = useQuiz();
  const book = bookId ? getBook(bookId) : undefined;
  const chapter = chapterId
    ? book?.chapters.find((c) => c.id === chapterId)
    : undefined;

  if (!book || !chapter) {
    return (
      <EmptyState
        icon={<AlertTriangle size={26} />}
        title="Chapter not found"
        actionLabel="Back to books"
        to="/books"
      />
    );
  }
  const subj = subjectOf(book.subject);
  const bank = chapterBankSize(chapter.id);
  const page1 = chapter.available ? getPageContent(chapter.id, 1) : null;

  const startChapterQuiz = () => {
    // Build quiz from the question bank of this chapter (max 12 items).
    const items = bankForChapter(chapter.id).filter(
      (q) => q.options && q.options.length > 0,
    );
    if (items.length === 0) {
      showToast('No auto-scored questions in this chapter bank yet.');
      return;
    }
    quiz.start(items.slice(0, 12), {
      type: 'chapter',
      chapterId: chapter.id,
      subject: book.subject,
      label: `${chapter.title}`,
    });
    nav('/quiz/run');
  };

  return (
    <div>
      <PageHead
        crumbs={[
          { label: 'Books', to: '/books' },
          { label: `${book.title}`, to: `/books/${book.id}` },
          { label: chapter.title },
        ]}
        title={chapter.title}
        subtitle={chapter.description}
        action={
          chapter.available ? (
            <Button to={`/reader/${book.id}/chapter/${chapter.id}/1`} trailing={<BookOpen size={16} />}>
              Open reader
            </Button>
          ) : undefined
        }
      />

      <div className="chapter-quick">
        <Badge tone="subject">
          <span className="subject-dot" style={{ background: subj.color }} />
          {subj.name} · Class {book.klass}
        </Badge>
        <Badge tone="accent">{chapter.pageCount} pages</Badge>
        {chapter.available ? (
          <Badge tone="ok">
            <Layers size={12} /> Real NCERT pages
          </Badge>
        ) : (
          <Badge tone="neutral">
            <BookX size={12} /> Pages not imported yet
          </Badge>
        )}
        <Badge tone="neutral">{bank} items in chapter bank</Badge>
      </div>

      <div className="chapter-topics-line">
        {chapter.topics.map((t) => (
          <span key={t} className="topic-chip">
            {t}
          </span>
        ))}
      </div>

      <div className="section-head section-head-mt">
        <h2 className="section-title">Practice on this chapter</h2>
      </div>
      <div className="practice-strip">
        {chapter.available && page1 && (
          <Card hover className="practice-card">
            <h4>Page-wise drill</h4>
            <p>
              {page1.important.length + page1.mcq.length + page1.pyq.length} items mapped to
              page 1 · more on every page
            </p>
            <Button
              variant="soft"
              size="sm"
              to={`/reader/${book.id}/chapter/${chapter.id}/1`}
            >
              Start on page 1
            </Button>
          </Card>
        )}
        <Card hover className="practice-card">
          <h4>Chapter quiz</h4>
          <p>Auto-scored MCQs pulled from this chapter’s bank</p>
          <Button variant="soft" size="sm" onClick={startChapterQuiz}>
            <Zap size={14} /> Start quiz
          </Button>
        </Card>
        <Card hover className="practice-card">
          <h4>Flashcards</h4>
          <p>Concept cards for this chapter — spaced review</p>
          <Button variant="soft" size="sm" to="/flashcards">
            View decks
          </Button>
        </Card>
        <Card hover className="practice-card">
          <h4>Important diagrams</h4>
          <p>Figures flagged across this chapter’s pages</p>
          <Button variant="soft" size="sm" to="/diagrams">
            Browse
          </Button>
        </Card>
      </div>

      {chapter.available ? (
        <>
          <div className="section-head section-head-mt">
            <h2 className="section-title">
              <ImageIcon size={18} /> Pages of this chapter
            </h2>
            <span className="px-muted-2 px-fs-sm">Click a page to open it in the reader</span>
          </div>
          <Card pad={false} className="pages-shell">
            <div className="pages-grid">
              {chapter.pages.map((p) => (
                <Link
                  key={p.number}
                  to={`/reader/${book.id}/chapter/${chapter.id}/${p.number}`}
                  className="page-tile"
                  title={`Open page ${p.printedNumber}`}
                >
                  {p.asset?.url ? (
                    <img
                      src={p.asset.url}
                      alt={`Page ${p.printedNumber} preview`}
                      loading="lazy"
                      className="page-tile-img"
                    />
                  ) : (
                    <span className="page-tile-ph">
                      <FileSearch size={20} />
                    </span>
                  )}
                  <span className="page-tile-num">p. {p.printedNumber}</span>
                </Link>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card className="soon-card">
          <EmptyState
            icon={<BookX size={26} />}
            title="Real pages are still being imported"
            text={`“${chapter.title}” keeps its full structure and ${chapter.pageCount}-page index here. Once page images land, every page gets its own Important / MCQ / PYQ / Concepts rail.`}
            actionLabel="Browse books with pages"
            to="/books"
          />
        </Card>
      )}
    </div>
  );
}
