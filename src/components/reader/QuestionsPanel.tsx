import { useState } from 'react';
import { Flame, Lightbulb, ScanText, Sparkles, Target } from 'lucide-react';
import type { Chapter } from '../../types';
import type { StudyFlashcard, StudyQuestion } from '../../types/study';
import type { PageContent } from '../../data/questions';
import { StudyQuestionCard } from '../practice/StudyQuestionCard';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { cx } from '../../lib/utils';

type TabKey = 'important' | 'mcq' | 'pyq' | 'concept';

const TABS: Array<{ key: TabKey; label: string; icon: typeof Flame }> = [
  { key: 'important', label: 'Important', icon: Flame },
  { key: 'mcq', label: 'MCQs', icon: Sparkles },
  { key: 'pyq', label: 'PYQs', icon: Target },
  { key: 'concept', label: 'Concepts', icon: ScanText },
];

const EMPTY_COPY: Record<Exclude<TabKey, 'concept'>, { t: string; d: string }> = {
  important: {
    t: 'No key points mapped to this page yet',
    d: '“Important for this page” content is being QA-verified page by page. Try the next page or the chapter pages grid.',
  },
  mcq: {
    t: 'No MCQs mapped to this page yet',
    d: 'Questions are tagged to their exact page. Nearby pages already have drills — flip through with the arrows.',
  },
  pyq: {
    t: 'No exam PYQs mapped to this page yet',
    d: 'Past-exam style items get page tags during content QA. Explore all PYQs in the PYQ section meanwhile.',
  },
};

export function QuestionsPanel({
  chapter,
  pageNumber,
  content,
  concepts,
  totalInBank,
  onToggleQuestionBookmark,
  isQuestionBookmarked,
  onAnswer,
  onToggleConceptBookmark,
  isConceptBookmarked,
}: {
  chapter: Chapter;
  pageNumber: number;
  content: PageContent;
  concepts: StudyFlashcard[];
  totalInBank: number;
  onToggleQuestionBookmark: (q: StudyQuestion) => void;
  isQuestionBookmarked: (q: StudyQuestion) => boolean;
  onAnswer?: (q: StudyQuestion, correct: boolean) => void;
  onToggleConceptBookmark: (f: StudyFlashcard) => void;
  isConceptBookmarked: (f: StudyFlashcard) => boolean;
}) {
  const [tab, setTab] = useState<TabKey>('important');
  const counts = {
    important: content.important.length,
    mcq: content.mcq.length,
    pyq: content.pyq.length,
    concept: concepts.length,
  };

  return (
    <aside className="reader-right" aria-label="Content for this page">
      <div className="q-panel-head">
        <div className="q-panel-title">
          <Sparkles size={16} />
          <h2>Content for this page</h2>
        </div>
        <span className="q-panel-note-tag">p. {pageNumber}</span>
      </div>

      <div className="q-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={cx('q-tab', tab === t.key && 'is-active')}
            onClick={() => setTab(t.key)}
          >
            <t.icon size={14} />
            {t.label}
            <span className="q-tab-count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div className="q-list">
        {tab === 'important' &&
          (content.important.length > 0 ? (
            content.important.map((q) => (
              <StudyQuestionCard
                key={q.id}
                q={q}
                bookmarked={isQuestionBookmarked(q)}
                onToggleBookmark={() => onToggleQuestionBookmark(q)}
                onAnswered={onAnswer}
              />
            ))
          ) : (
            <TabEmpty {...EMPTY_COPY.important} />
          ))}

        {tab === 'mcq' &&
          (content.mcq.length > 0 ? (
            content.mcq.map((q) => (
              <StudyQuestionCard
                key={q.id}
                q={q}
                bookmarked={isQuestionBookmarked(q)}
                onToggleBookmark={() => onToggleQuestionBookmark(q)}
                onAnswered={onAnswer}
              />
            ))
          ) : (
            <TabEmpty {...EMPTY_COPY.mcq} />
          ))}

        {tab === 'pyq' &&
          (content.pyq.length > 0 ? (
            content.pyq.map((q) => (
              <StudyQuestionCard
                key={q.id}
                q={q}
                showExamBadge
                bookmarked={isQuestionBookmarked(q)}
                onToggleBookmark={() => onToggleQuestionBookmark(q)}
                onAnswered={onAnswer}
              />
            ))
          ) : (
            <TabEmpty {...EMPTY_COPY.pyq} />
          ))}

        {tab === 'concept' &&
          (concepts.length > 0 ? (
            concepts.map((f) => (
              <ConceptRow
                key={f.id}
                f={f}
                bookmarked={isConceptBookmarked(f)}
                onToggleBookmark={() => onToggleConceptBookmark(f)}
              />
            ))
          ) : (
            <TabEmpty
              t="No concept cards for this page"
              d="Concept flashcards for this exact page are still being authored — nearby pages have cards."
            />
          ))}
      </div>

      <div className="q-panel-note">
        <Lightbulb size={15} />
        <span>
          Everything here is mapped to page {pageNumber} of “{chapter.title}”. Demo dataset · {totalInBank}{' '}
          items in the chapter bank feed chapter quizzes.
        </span>
      </div>
    </aside>
  );
}

function TabEmpty({ t, d }: { t: string; d: string }) {
  return <EmptyState compact title={t} text={d} />;
}

export function ConceptRow({
  f,
  bookmarked,
  onToggleBookmark,
}: {
  f: StudyFlashcard;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const [flip, setFlip] = useState(false);
  return (
    <article className={cx('q-card concept-row', flip && 'is-flipped')}>
      <div className="q-meta">
        <Badge tone="info">Concept</Badge>
        <Badge tone="neutral">DEMO</Badge>
      </div>
      <button type="button" className="concept-inner" onClick={() => setFlip((x) => !x)}>
        {!flip ? (
          <p className="q-text concept-front">{f.front}</p>
        ) : (
          <p className="q-text concept-back">{f.back}</p>
        )}
        <span className="concept-hint">{flip ? 'Tap to flip back' : 'Tap to reveal'}</span>
      </button>
      <div className="q-foot">
        <span className="q-topic">{f.tag}</span>
        <button
          type="button"
          className={cx('q-bm', bookmarked && 'is-on')}
          aria-label="Bookmark card"
          onClick={onToggleBookmark}
        >
          <Sparkles size={0} />
          {bookmarked ? '★ saved' : 'Save card'}
        </button>
      </div>
    </article>
  );
}
