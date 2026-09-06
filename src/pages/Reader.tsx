import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { getBook, getChapter, subjectOf } from '../data/content';
import { getPageContent, chapterBankSize } from '../data/questions';
import { FLASHCARDS } from '../data/flashcards';
import type { StudyFlashcard, StudyQuestion } from '../types/study';
import { ReaderControls } from '../components/reader/ReaderControls';
import { PagePanel } from '../components/reader/PagePanel';
import { QuestionsPanel } from '../components/reader/QuestionsPanel';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useBookmarks, bookmarkKey } from '../stores/bookmarks';
import { useActivity } from '../stores/activity';
import { useUi } from '../stores/ui';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.6;
const ZOOM_STEP = 0.2;

const EMPTY_PAGE = { important: [], mcq: [], pyq: [] };

export default function Reader() {
  const { bookId, chapterId: chapterIdParam, pageNumber: pageNumberParam } = useParams();
  const nav = useNavigate();
  const showToast = useUi((s) => s.showToast);
  const bookmarks = useBookmarks();
  const activity = useActivity();
  const rootRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  /* Resolve content: 3-param route uses chapter + page; 2-param route uses
     the book's first available chapter (spec: /reader/:bookId/:pageId). */
  const book = bookId ? getBook(bookId) : undefined;

  const chapter = useMemo(() => {
    if (chapterIdParam) return getChapter(bookId ?? '', chapterIdParam);
    const first = book?.chapters.find((c) => c.available) ?? book?.chapters[0];
    return first;
  }, [book, bookId, chapterIdParam]);

  const pageNumberRaw = pageNumberParam ? Number(pageNumberParam) : NaN;
  const pageNumber =
    !Number.isFinite(pageNumberRaw) || !chapter
      ? 1
      : Math.min(Math.max(1, Math.round(pageNumberRaw)), Math.max(1, chapter.pageCount));

  const page = chapter?.pages.find((p) => p.number === pageNumber) ?? chapter?.pages[0];

  /* Page-wise content for the exact page on screen. */
  const content = useMemo(
    () => (chapter ? getPageContent(chapter.id, pageNumber) : EMPTY_PAGE),
    [chapter, pageNumber],
  );

  const concepts = useMemo(
    () =>
      chapter
        ? FLASHCARDS.filter(
            (f) => f.chapterId === chapter.id && f.pages.includes(pageNumber),
          )
        : [],
    [chapter, pageNumber],
  );

  /* Track this page read (powers Continue learning + streaks). */
  useEffect(() => {
    if (!book || !chapter || !chapter.available || !page) return;
    activity.record({
      kind: 'page_view',
      subject: book.subject,
      bookId: book.id,
      chapterId: chapter.id,
      pageNumber,
      label: `Read ${chapter.title} — p. ${pageNumber}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id, pageNumber]);

  /* Fullscreen plumbing */
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else if (rootRef.current) {
      rootRef.current.requestFullscreen().catch(() => undefined);
    }
  }, []);

  const goToPage = useCallback(
    (n: number) => {
      const ch = chapter?.id;
      const target = `/reader/${bookId}/${ch ? `chapter/${ch}/` : ''}${n}`;
      nav(target, { replace: true });
    },
    [bookId, chapter, nav],
  );

  /* Bookmark helpers */
  const isBookmarked = useCallback(
    (key: string) => bookmarks.isBookmarked(key),
    [bookmarks],
  );

  const togglePageBookmark = useCallback(() => {
    if (!book || !chapter) return;
    const href = `/reader/${book.id}/chapter/${chapter.id}/${pageNumber}`;
    const already = bookmarks.isBookmarked(bookmarkKey('page', href));
    bookmarks.toggle({
      kind: 'page',
      title: `${book.title} · ${chapter.title} — p. ${pageNumber}`,
      subtitle: `${subjectOf(book.subject).name} · Class ${book.klass}`,
      href,
    });
    showToast(already ? 'Bookmark removed' : 'Page bookmarked');
  }, [book, chapter, pageNumber, bookmarks, showToast]);

  const toggleQuestionBookmark = useCallback(
    (q: StudyQuestion) => {
      const kind = q.section === 'pyq' ? 'pyq' : 'question';
      const already = bookmarks.isBookmarked(bookmarkKey(kind, q.id));
      bookmarks.toggle({
        kind,
        title: q.text.slice(0, 110) + (q.text.length > 110 ? '…' : ''),
        subtitle: `${chapter?.title ?? 'Chapter'} · ${q.topic} · p. ${pageNumber}`,
        href: kind === 'pyq' ? '/pyqs' : `/reader/${bookId}/chapter/${chapter?.id}/${pageNumber}`,
      });
      showToast(already ? 'Removed from bookmarks' : 'Bookmarked');
    },
    [bookmarks, bookId, chapter, pageNumber, showToast],
  );

  const toggleConceptBookmark = useCallback(
    (f: StudyFlashcard) => {
      const already = bookmarks.isBookmarked(bookmarkKey('flashcard', f.id));
      bookmarks.toggle({
        kind: 'flashcard',
        title: f.front,
        subtitle: `Concept card · ${f.tag} · p. ${pageNumber}`,
        href: `/flashcards/study?deck=${f.deckId}`,
      });
      showToast(already ? 'Removed from bookmarks' : 'Card bookmarked');
    },
    [bookmarks, pageNumber, showToast],
  );

  const onAnswer = useCallback(
    (q: StudyQuestion, correct: boolean) => {
      if (!book) return;
      activity.record({
        kind: q.section === 'pyq' ? 'pyq' : 'question',
        subject: book.subject,
        bookId: book.id,
        chapterId: chapter?.id,
        pageNumber,
        correct,
        label: `${correct ? 'Solved' : 'Missed'} ${q.topic} · p. ${pageNumber}`,
      });
    },
    [activity, book, chapter, pageNumber],
  );

  if (!book || !chapter) {
    return (
      <div className="page-inner">
        <EmptyState
          icon={<AlertTriangle size={26} />}
          title="Book or chapter not found"
          text="This content is not part of the catalogue yet."
          actionLabel="Browse books"
          to="/books"
        />
      </div>
    );
  }

  if (chapter.pageCount === 0 || !page) {
    return <Navigate to={`/books/${book.id}/chapter/${chapter.id}`} replace />;
  }

  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));

  const pageBookmarkKey = bookmarkKey(
    'page',
    `/reader/${book.id}/chapter/${chapter.id}/${pageNumber}`,
  );
  const pageBookmarked = isBookmarked(pageBookmarkKey);
  const bankSize = chapterBankSize(chapter.id);

  return (
    <div className="reader-root" ref={rootRef}>
      <ReaderControls
        pageNumber={pageNumber}
        pageCount={chapter.pageCount}
        zoom={zoom}
        bookmarked={pageBookmarked}
        canZoomOut={zoom > MIN_ZOOM}
        canZoomIn={zoom < MAX_ZOOM}
        onPrev={() => goToPage(Math.max(1, pageNumber - 1))}
        onNext={() => goToPage(Math.min(chapter.pageCount, pageNumber + 1))}
        onZoomOut={zoomOut}
        onZoomIn={zoomIn}
        onFit={() => setZoom(1)}
        onToggleBookmark={togglePageBookmark}
        onToggleFullscreen={toggleFullscreen}
        fullscreen={fullscreen}
        chapterLabel={`${book.title} · ${chapter.title}`}
      />

      <div className="reader-split">
        <section className="reader-left" aria-label="Textbook page">
          <PagePanel page={page} chapter={chapter} width={zoom * 100} />
        </section>
        <QuestionsPanel
          chapter={chapter}
          pageNumber={pageNumber}
          content={content}
          concepts={concepts}
          totalInBank={bankSize}
          onToggleQuestionBookmark={toggleQuestionBookmark}
          isQuestionBookmarked={(q) =>
            isBookmarked(bookmarkKey(q.section === 'pyq' ? 'pyq' : 'question', q.id))
          }
          onAnswer={onAnswer}
          onToggleConceptBookmark={toggleConceptBookmark}
          isConceptBookmarked={(f) => isBookmarked(bookmarkKey('flashcard', f.id))}
        />
      </div>

      <div className="reader-legend">
        {chapter.available ? (
          <p>
            Reading <strong>“{chapter.title}”</strong> — {chapter.pages.length} real NCERT page
            images · page {pageNumber} of {chapter.pageCount}
          </p>
        ) : (
          <p>Chapter pages are still being imported — questions below are live.</p>
        )}
        <div className="reader-legend-actions">
          <Button to={`/books/${book.id}/chapter/${chapter.id}`} variant="ghost" size="sm">
            Chapter overview
          </Button>
        </div>
      </div>
    </div>
  );
}
