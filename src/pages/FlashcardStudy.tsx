import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Layers, RotateCcw } from 'lucide-react';
import { flashcardsForDeck, deckCatalogue } from '../data/flashcards';
import { BOOKS } from '../data/content';
import { useFlash, isDue } from '../stores/flash';
import { useActivity } from '../stores/activity';
import { useBookmarks, bookmarkKey } from '../stores/bookmarks';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import type { CardRating, StudyFlashcard } from '../types/study';
import { cx } from '../lib/utils';

const RATINGS: Array<{ key: CardRating; label: string; sub: string }> = [
  { key: 'again', label: 'Again', sub: '≤ 1 day' },
  { key: 'hard', label: 'Hard', sub: '1 day' },
  { key: 'good', label: 'Good', sub: '2 days' },
  { key: 'easy', label: 'Easy', sub: '8 days' },
];

export default function FlashcardStudy() {
  const [params] = useSearchParams();
  const deckId = params.get('deck') ?? deckCatalogue()[0]?.deckId ?? '';
  const nav = useNavigate();
  const flash = useFlash();
  const activity = useActivity();
  const bookmarks = useBookmarks();

  const deck = deckCatalogue().find((d) => d.deckId === deckId);

  const [queue, setQueue] = useState<StudyFlashcard[]>([]);
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(false);
  const [done, setDone] = useState(0);
  const [againList, setAgainList] = useState<StudyFlashcard[]>([]);

  /* Build the queue once per deck: due cards first (stable during the session). */
  useEffect(() => {
    const cards = useFlash.getState().cards;
    const all = flashcardsForDeck(deckId);
    setQueue(
      [...all].sort((a, b) => {
        const da = isDue(cards[a.id]) ? 0 : 1;
        const db = isDue(cards[b.id]) ? 0 : 1;
        return da - db;
      }),
    );
    setPos(0);
    setFlip(false);
    setDone(0);
    setAgainList([]);
  }, [deckId]);

  const current = queue[pos];
  const finished = pos >= queue.length && queue.length > 0;

  const deckTitle = (() => {
    if (!deck) return deckId;
    for (const b of BOOKS) {
      for (const c of b.chapters) {
        if (c.id === deck.chapterId) return c.title;
      }
    }
    return deck.chapterId;
  })();

  const rate = (rating: CardRating) => {
    if (!current) return;
    flash.review(current.id, rating);
    activity.record({
      kind: 'flashcard',
      subject: current.subject,
      chapterId: current.chapterId,
      label: `${rating} · ${current.front}`,
    });
    if (rating === 'again') setAgainList((l) => [...l, current]);
    setDone((d) => d + 1);
    setFlip(false);
    setPos((p) => p + 1);
  };

  if (queue.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={26} />}
        title="Deck not found"
        text="This deck is not in the demo catalogue."
        actionLabel="All decks"
        to="/flashcards"
      />
    );
  }

  return (
    <div className="fcs-page">
      <div className="fcs-top">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => nav('/flashcards')}>
          <ArrowLeft size={15} /> Decks
        </button>
        <div className="fcs-title">
          <strong>{deckTitle}</strong>
          <span className="px-muted-2 px-fs-xs">spaced review · page-mapped concepts</span>
        </div>
        <Badge tone="accent">
          {Math.min(pos, queue.length)}/{queue.length}
        </Badge>
      </div>

      {!finished ? (
        <>
          <div className="fcs-progress">
            <div
              className="fcs-progress-fill"
              style={{ width: `${(pos / Math.max(queue.length, 1)) * 100}%` }}
            />
          </div>

          <div className="fcs-stage">
            <button
              type="button"
              className={cx('fcs-card', flip && 'is-flipped')}
              onClick={() => setFlip((f) => !f)}
              aria-label={flip ? 'Flip back' : 'Reveal answer'}
            >
              <span className="fcs-card-side fcs-front">
                <Badge tone="info">Concept</Badge>
                <p>{current.front}</p>
                <span className="fcs-hint">tap to reveal</span>
              </span>
              <span className="fcs-card-side fcs-back">
                <Badge tone="ok">Answer</Badge>
                <p>{current.back}</p>
                <span className="fcs-hint">tap to flip back</span>
              </span>
            </button>

            <div className="fcs-rates">
              {RATINGS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className={cx('fcs-rate', `is-${r.key}`)}
                  onClick={() => rate(r.key)}
                >
                  <strong>{r.label}</strong>
                  <small>{r.sub}</small>
                </button>
              ))}
            </div>
            <div className="fcs-meta">
              <span className="px-muted-2 px-fs-xs">{current.tag}</span>
              <button
                type="button"
                className={cx(
                  'btn-link',
                  bookmarks.isBookmarked(bookmarkKey('flashcard', current.id)) && 'is-on',
                )}
                onClick={() => {
                  const on = bookmarks.isBookmarked(bookmarkKey('flashcard', current.id));
                  bookmarks.toggle({
                    kind: 'flashcard',
                    title: current.front,
                    subtitle: `${current.tag} · ${deckTitle}`,
                    href: `/flashcards/study?deck=${deckId}`,
                  });
                  void on;
                }}
              >
                {bookmarks.isBookmarked(bookmarkKey('flashcard', current.id))
                  ? '★ saved'
                  : 'Save card'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <Card className="fcs-done">
          <div className="fcs-done-ic">
            <Check size={28} />
          </div>
          <h2>Deck complete</h2>
          <p className="px-muted-2">
            {done} cards reviewed this session
            {againList.length > 0
              ? ` · ${againList.length} marked “Again” — they will reappear soon`
              : ''}
            . Ratings update each card’s next-review interval.
          </p>
          <div className="fcs-done-actions">
            {againList.length > 0 && (
              <Button
                variant="soft"
                size="sm"
                onClick={() => {
                  const rest = queue.filter((c) => !againList.includes(c));
                  setQueue([...againList, ...rest]);
                  setPos(0);
                  setDone(0);
                  setAgainList([]);
                }}
              >
                <RotateCcw size={14} /> Replay {againList.length} again-cards
              </Button>
            )}
            <Button variant="ghost" size="sm" to="/flashcards">
              Back to decks
            </Button>
            <Link to="/progress" className="btn-link">
              Review history →
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
