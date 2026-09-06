import { useState } from 'react';
import { Bookmark, Check, ChevronDown, Flag, Lightbulb, X } from 'lucide-react';
import type { StudyQuestion } from '../../types/study';
import { Badge, type BadgeTone } from '../ui/Badge';
import { useUi } from '../../stores/ui';
import { cx } from '../../lib/utils';

export const KIND_LABEL: Record<StudyQuestion['kind'], string> = {
  mcq: 'MCQ',
  assertion: 'Assertion–Reason',
  short: 'Short answer',
  numerical: 'Numerical',
  long: 'Long answer',
  conceptual: 'Conceptual',
};

export const KIND_TONE: Record<StudyQuestion['kind'], BadgeTone> = {
  mcq: 'accent',
  assertion: 'info',
  short: 'neutral',
  numerical: 'warn',
  long: 'rose',
  conceptual: 'default',
};

export const EXAM_LABEL: Record<string, string> = {
  jee: 'JEE pattern',
  neet: 'NEET pattern',
  cbse: 'CBSE pattern',
  icse: 'ICSE pattern',
  state: 'State board pattern',
};

export const DIFF_DOT = {
  easy: 'var(--ok)',
  medium: 'var(--warn)',
  hard: 'var(--danger)',
} as const;

const diffLevel = (d: StudyQuestion['difficulty']) =>
  d === 'easy' ? 1 : d === 'medium' ? 2 : 3;

export function StudyQuestionCard({
  q,
  bookmarked,
  onToggleBookmark,
  onAnswered,
  showExamBadge,
  className,
}: {
  q: StudyQuestion;
  bookmarked?: boolean;
  onToggleBookmark?: (q: StudyQuestion) => void;
  onAnswered?: (q: StudyQuestion, correct: boolean) => void;
  showExamBadge?: boolean;
  className?: string;
}) {
  const showToast = useUi((s) => s.showToast);
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const answered = picked != null;
  const showOptions = Boolean(q.options && q.options.length > 0);

  const pick = (o: string) => {
    if (answered) return;
    setPicked(o);
    if (onAnswered) onAnswered(q, o === q.answer);
  };

  return (
    <article className={cx('q-card', className)}>
      <div className="q-meta">
        <span className="q-kinds">
          <Badge tone={KIND_TONE[q.kind]}>{KIND_LABEL[q.kind]}</Badge>
          {showExamBadge && q.exam && (
            <Badge tone="warn">
              {EXAM_LABEL[q.exam]} {q.year ? `· ${q.year}` : ''}
            </Badge>
          )}
          {q.isDemo && <Badge tone="neutral">DEMO</Badge>}
        </span>
        <span className="q-diff" title={`Difficulty: ${q.difficulty}`}>
          <span className="q-diff-dots">
            {[1, 2, 3].map((l) => (
              <span
                key={l}
                className="q-diff-dot"
                style={{
                  background:
                    l <= diffLevel(q.difficulty)
                      ? DIFF_DOT[q.difficulty]
                      : 'var(--overlay-3)',
                }}
              />
            ))}
          </span>
        </span>
      </div>

      <p className="q-text">{q.text}</p>
      <span className="q-topic">{q.topic}</span>

      {showOptions && (
        <div className="q-opts">
          {q.options!.map((o, i) => {
            const isAnswer = q.answer === o;
            const isPicked = picked === o;
            return (
              <button
                key={i}
                type="button"
                className={cx(
                  'q-opt',
                  answered && isAnswer && 'is-correct',
                  answered && isPicked && !isAnswer && 'is-wrong',
                )}
                onClick={() => pick(o)}
                disabled={answered}
              >
                <span className="q-opt-key">{String.fromCharCode(65 + i)}</span>
                <span className="q-opt-txt">{o}</span>
                {answered && isAnswer && <Check size={15} className="q-opt-flag" />}
                {answered && isPicked && !isAnswer && <X size={15} className="q-opt-flag" />}
              </button>
            );
          })}
        </div>
      )}

      {answered && (
        <div
          className={cx(
            'q-verdict',
            picked === q.answer ? 'is-right' : 'is-wrong',
          )}
        >
          {picked === q.answer ? '✓ Correct' : '✗ Incorrect'}
        </div>
      )}

      <div className="q-foot">
        <button
          type="button"
          className={cx('q-reveal', open && 'is-open')}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Hide solution' : 'Show solution'}
          <ChevronDown size={14} />
        </button>
        <div className="q-actions">
          <button
            type="button"
            className="q-report"
            aria-label="Report question"
            onClick={() => showToast('Report submitted (demo) — flagged for content QA.')}
          >
            <Flag size={14} />
          </button>
          {onToggleBookmark && (
            <button
              type="button"
              className={cx('q-bm', bookmarked && 'is-on')}
              aria-label="Bookmark"
              onClick={() => onToggleBookmark(q)}
            >
              <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="q-solution">
          <div className="q-sol-title">
            <Lightbulb size={14} /> Answer
          </div>
          <p>{q.answer ?? '—'}</p>
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
