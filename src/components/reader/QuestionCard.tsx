import { useState } from 'react';
import { Bookmark, Check, ChevronDown, Lightbulb } from 'lucide-react';
import type { Question } from '../../types';
import { Badge, type BadgeTone } from '../ui/Badge';
import { cx } from '../../lib/utils';

const KIND_LABEL: Record<Question['kind'], string> = {
  mcq: 'MCQ',
  assertion: 'Assertion',
  short: 'Short answer',
  pyq: 'PYQ',
  diagram: 'Diagram',
};

const KIND_TONE: Record<Question['kind'], BadgeTone> = {
  mcq: 'accent',
  assertion: 'info',
  short: 'neutral',
  pyq: 'warn',
  diagram: 'rose',
};

const DIFF_DOT = {
  easy: 'var(--ok)',
  medium: 'var(--warn)',
  hard: 'var(--danger)',
} as const;

function Options({ q }: { q: Question }) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="q-opts">
      {q.options?.map((o, i) => {
        const isAnswer = q.answer === o;
        const isPicked = picked === o;
        return (
          <button
            key={i}
            type="button"
            className={cx(
              'q-opt',
              picked && isAnswer && 'is-correct',
              picked && isPicked && !isAnswer && 'is-wrong',
            )}
            onClick={() => !picked && setPicked(o)}
            disabled={Boolean(picked)}
          >
            <span className="q-opt-key">{String.fromCharCode(65 + i)}</span>
            <span className="q-opt-txt">{o}</span>
            {picked && isAnswer && <Check size={15} className="q-opt-flag" />}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionCard({ q, onToggleBookmark, bookmarked }: {
  q: Question;
  onToggleBookmark?: () => void;
  bookmarked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const showOptions = q.options && q.options.length > 0 && q.kind !== 'diagram';

  return (
    <article className="q-card">
      <div className="q-meta">
        <Badge tone={KIND_TONE[q.kind]}>{KIND_LABEL[q.kind]}</Badge>
        <span className="q-diff" title={`Difficulty: ${q.difficulty}`}>
          <span className="q-diff-dots">
            {([1, 2, 3] as const).map((level) => (
              <span
                key={level}
                className="q-diff-dot"
                style={{
                  background:
                    level <=
                    (q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3)
                      ? DIFF_DOT[q.difficulty]
                      : 'var(--overlay-3)',
                }}
              />
            ))}
          </span>
        </span>
      </div>

      <p className="q-text">{q.text}</p>

      {showOptions && <Options q={q} />}

      {q.kind === 'short' && q.answer && (
        <div className="q-short-hint">Tap to reveal a model answer.</div>
      )}

      <div className="q-foot">
        <button
          type="button"
          className={cx('q-reveal', open && 'is-open')}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Hide solution' : q.kind === 'mcq' || q.kind === 'assertion' ? 'Show answer' : 'Model answer'}
          <ChevronDown size={14} />
        </button>
        {onToggleBookmark && (
          <button
            type="button"
            className={cx('q-bm', bookmarked && 'is-on')}
            onClick={onToggleBookmark}
            aria-label="Bookmark question"
          >
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {open && q.answer && (
        <div className="q-solution">
          <div className="q-sol-title">
            <Lightbulb size={14} /> Answer
          </div>
          <p>{q.answer}</p>
          {q.explanation && (
            <>
              <div className="q-sol-title q-sol-why">Why</div>
              <p className="q-sol-exp">{q.explanation}</p>
            </>
          )}
        </div>
      )}
    </article>
  );
}
