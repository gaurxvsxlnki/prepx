import { Link } from 'react-router-dom';
import { BookOpen, Layers, RotateCcw, Sparkles } from 'lucide-react';
import { PageHead, SectionHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SubjectBadge } from '../components/common/SubjectBadge';
import { Button } from '../components/ui/Button';
import { deckCatalogue, flashcardsForDeck } from '../data/flashcards';
import { BOOKS } from '../data/content';
import { useFlash, isDue, mastered } from '../stores/flash';
import type { SubjectCode } from '../types';

export default function Flashcards() {
  const flash = useFlash();
  const decks = deckCatalogue();

  const metaOf = (deckId: string) => {
    const deck = decks.find((d) => d.deckId === deckId);
    for (const b of BOOKS) {
      for (const c of b.chapters) {
        if (deck && c.id === deck.chapterId) {
          return { book: b, chapter: c, subject: b.subject as SubjectCode };
        }
      }
    }
    return undefined;
  };

  const dueTotal = decks.reduce((acc, d) => {
    return (
      acc +
      flashcardsForDeck(d.deckId).filter((f) => isDue(flash.cards[f.id])).length
    );
  }, 0);

  return (
    <div>
      <PageHead
        icon={<Layers size={22} />}
        title="Flashcards"
        subtitle="Spaced review for the terms, facts and definitions exams repeat."
        action={<Badge tone="warn">{dueTotal} due today</Badge>}
      />

      <div className="fc-summary">
        <Card className="fc-sum">
          <strong>{decks.length}</strong>
          <span>decks</span>
        </Card>
        <Card className="fc-sum">
          <strong>
            {decks.reduce((s, d) => s + d.total, 0)}
          </strong>
          <span>cards</span>
        </Card>
        <Card className="fc-sum">
          <strong>
            {decks.reduce(
              (s, d) =>
                s + flashcardsForDeck(d.deckId).filter((f) => mastered(flash.cards[f.id])).length,
              0,
            )}
          </strong>
          <span>mastered</span>
        </Card>
      </div>

      <div className="list-grid">
        {decks.map((d) => {
          const meta = metaOf(d.deckId);
          const cards = flashcardsForDeck(d.deckId);
          const due = cards.filter((f) => isDue(flash.cards[f.id])).length;
          const masteredCount = cards.filter((f) => mastered(flash.cards[f.id])).length;
          return (
            <Card key={d.deckId} hover className="set-card">
              <div className="set-top">
                <SubjectBadge code={meta?.subject ?? d.subject} />
                <Badge tone="neutral">
                  {masteredCount}/{d.total} mastered
                </Badge>
              </div>
              <h3>{meta?.chapter.title ?? d.chapterId}</h3>
              <p className="px-muted-2 px-fs-sm">
                {meta ? `${meta.book.title} · ` : ''}spaced review · {due} due now
              </p>
              <div className="deck-progress">
                <span
                  className="deck-progress-fill"
                  style={{ width: `${(masteredCount / d.total) * 100}%` }}
                />
              </div>
              <Button
                block
                size="sm"
                variant={due > 0 ? 'primary' : 'soft'}
                to={`/flashcards/study?deck=${d.deckId}`}
              >
                <RotateCcw size={14} /> {due > 0 ? `Review ${due} due` : 'Study deck'}
              </Button>
            </Card>
          );
        })}
      </div>

      <SectionHead
        title="How review works"
        sub="Rate each card Again / Hard / Good / Easy — intervals grow as you remember it (0 → 1 → 2 → 4 → 8 days). Your history is private and stored per account."
      />
      <div className="fc-note">
        <BookOpen size={15} />
        <span>
          These decks are fed from the chapter content bank and power the reader’s Concepts tab —
          every card knows the exact textbook page it belongs to. <Sparkles size={12} /> Demo deck:
          self-authored from NCERT text.
        </span>
        <Link to="/progress" className="px-muted-2 px-fs-sm">
          See review history →
        </Link>
      </div>
    </div>
  );
}
