import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Flag,
  RotateCcw,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import { useQuiz } from '../stores/quiz';
import { useActivity } from '../stores/activity';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { KIND_LABEL, KIND_TONE } from '../components/practice/StudyQuestionCard';
import { cx } from '../lib/utils';

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function QuizRun() {
  const quiz = useQuiz();
  const activity = useActivity();
  const nav = useNavigate();
  const { status, items, source, index, answers, startedAt, timeLimitSec, result } = quiz;

  const [elapsed, setElapsed] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const q = items[index];

  /* Timer */
  useEffect(() => {
    if (status === 'active') setElapsed(0);
  }, [startedAt, status]);

  useEffect(() => {
    if (status !== 'active' || !startedAt) return;
    const iv = setInterval(() => {
      const sec = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(sec);
      if (timeLimitSec != null && sec >= timeLimitSec) {
        quiz.finish(sec);
      }
    }, 500);
    return () => clearInterval(iv);
  }, [status, startedAt, timeLimitSec, quiz]);

  const recordedRef = useRef(false);

  /* Record every answered question into activity once the session completes. */
  useEffect(() => {
    if (status === 'active') recordedRef.current = false;
    if (status !== 'done' || recordedRef.current || !source) return;
    recordedRef.current = true;
    const kind = source.type === 'pyq' ? 'pyq' : 'quiz';
    for (const q of items) {
      const a = answers[q.id];
      if (!a || a.picked == null) continue;
      activity.record({
        kind,
        subject: source.subject,
        chapterId: source.type === 'chapter' ? source.chapterId : undefined,
        correct: Boolean(a.correct),
        refId: q.id,
        label: `${a.correct ? 'Solved' : 'Missed'} ${q.topic} · ${source.label}`,
      });
    }
  }, [status, source, items, answers, activity]);

  const skip = useCallback(
    (delta: number) => {
      if (!items[index] && delta < 0) return;
      quiz.go(delta);
      setShowReview(false);
    },
    [quiz, items, index],
  );

  const finishNow = useCallback(() => {
    if (status !== 'active') return;
    quiz.finish(timeLimitSec != null ? Math.max(elapsed, 0) : elapsed);
  }, [quiz, status, timeLimitSec, elapsed]);

  const answeredCount = items.filter((i) => answers[i.id]?.picked != null).length;
  const markedCount = items.filter((i) => answers[i.id]?.marked).length;

  /* Guard: never landed with an idle session */
  if (status === 'idle' && !source) {
    return <Navigate to="/quizzes" replace />;
  }

  /* ---------- RESULTS ---------- */
  if (status === 'done' && result) {
    const strong = result.topicBreakdown.filter(
      (t) => t.total >= 2 && (t.correct / t.total) * 100 >= 75,
    );
    const weak = result.topicBreakdown.filter(
      (t) => t.total >= 2 && (t.correct / t.total) * 100 < 60,
    );
    const missed = items.filter(
      (i) => !answers[i.id]?.picked || !answers[i.id]?.correct,
    );
    const retryMissed = missed.filter((m) => m.options && m.options.length > 0);

    return (
      <div className="qr-page">
        <div className="qr-head">
          <div>
            <div className="px-muted-2 px-fs-sm">
              {source?.type === 'pyq' ? 'PYQ practice' : 'Quiz'} · {source?.label}
            </div>
            <h1 className="page-title qr-title">Session complete</h1>
          </div>
          <div className="qr-head-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (retryMissed.length > 0 && source) {
                  quiz.start(retryMissed, { ...source, label: `${source.label} — missed` });
                } else nav('/quizzes');
              }}
            >
              <RotateCcw size={14} /> {retryMissed.length > 0 ? 'Retry missed' : 'New quiz'}
            </Button>
            <Button variant="ghost" size="sm" to="/quizzes">
              Back to quizzes
            </Button>
          </div>
        </div>

        <div className="qr-result-grid">
          <Card className="qr-score-card">
            <div
              className={cx(
                'qr-score-ring',
                result.accuracy >= 70 ? 'is-good' : result.accuracy >= 45 ? 'is-mid' : 'is-low',
              )}
            >
              <strong>{result.accuracy}%</strong>
              <span>accuracy</span>
            </div>
            <div className="qr-score-meta">
              <p>
                <CheckCircle2 size={15} /> {result.correct} correct
              </p>
              <p>
                <XCircle size={15} /> {result.incorrect} incorrect
              </p>
              <p>
                <span className="qr-dot-muted" /> {result.skipped} skipped
              </p>
            </div>
          </Card>

          <Card className="qr-stats">
            <div className="qr-stat">
              <span>Questions</span>
              <strong>{result.total}</strong>
            </div>
            <div className="qr-stat">
              <span>Time taken</span>
              <strong>{fmt(result.timeSec)}</strong>
            </div>
            <div className="qr-stat">
              <span>Marked review</span>
              <strong>{markedCount}</strong>
            </div>
          </Card>

          <Card className="qr-topics">
            <h3>Topic signal</h3>
            {weak.length === 0 && strong.length === 0 && (
              <p className="px-muted-2 px-fs-sm">
                Keep attempting — topic-level analysis needs at least 2 questions per topic.
              </p>
            )}
            {weak.length > 0 && (
              <>
                <div className="px-fs-xs px-muted-2 qr-topic-label">Focus next</div>
                {weak.map((t) => (
                  <div key={t.topic} className="qr-topic-row is-weak">
                    <span>{t.topic}</span>
                    <Badge tone="rose">
                      {Math.round((t.correct / t.total) * 100)}%
                    </Badge>
                  </div>
                ))}
              </>
            )}
            {strong.length > 0 && (
              <>
                <div className="px-fs-xs px-muted-2 qr-topic-label">Strong</div>
                {strong.map((t) => (
                  <div key={t.topic} className="qr-topic-row is-strong">
                    <span>{t.topic}</span>
                    <Badge tone="ok">
                      {Math.round((t.correct / t.total) * 100)}%
                    </Badge>
                  </div>
                ))}
              </>
            )}
          </Card>
        </div>

        <div className="section-head section-head-mt">
          <h2 className="section-title">Review</h2>
        </div>
        <div className="qr-review-list">
          {items.map((i, idx) => {
            const a = answers[i.id];
            return (
              <Card key={i.id} className="qr-review-item">
                <div className="qr-review-top">
                  <span className="qr-review-num">Q{idx + 1}</span>
                  {a?.picked == null ? (
                    <Badge tone="neutral">Skipped</Badge>
                  ) : a.correct ? (
                    <Badge tone="ok">Correct</Badge>
                  ) : (
                    <Badge tone="rose">Incorrect</Badge>
                  )}
                  <span className="qr-review-topic">{i.topic}</span>
                </div>
                <p className="q-text">{i.text}</p>
                {i.options && (
                  <div className="qr-review-opts">
                    {i.options.map((o, oi) => {
                      const isAnswer = o === i.answer;
                      const isPicked = o === a?.picked;
                      return (
                        <div
                          key={oi}
                          className={cx(
                            'qr-ropt',
                            isAnswer && 'is-answer',
                            isPicked && !isAnswer && 'is-picked-wrong',
                          )}
                        >
                          <span className="q-opt-key">{String.fromCharCode(65 + oi)}</span>
                          <span className="q-opt-txt">{o}</span>
                          {isAnswer && <Check size={14} />}
                          {isPicked && !isAnswer && <X size={14} />}
                        </div>
                      );
                    })}
                  </div>
                )}
                {i.explanation && (
                  <p className="qr-review-exp px-fs-sm">
                    <Flag size={13} /> {i.explanation}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- SESSION (active) ---------- */
  const total = items.length;
  const remaining = timeLimitSec != null ? Math.max(0, timeLimitSec - elapsed) : null;

  return (
    <div className="qr-page">
      <div className="qr-topbar">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => nav('/quizzes')}>
          <ArrowLeft size={15} /> Exit
        </button>
        <div className="qr-source">
          {source?.type === 'pyq' ? 'PYQ practice' : 'Quiz'}
          {source ? <ChevronRight size={13} /> : null}
          <strong>{source?.label}</strong>
        </div>
        <span className={cx('qr-timer', remaining != null && remaining <= 30 && 'is-low')}>
          <Timer size={15} />
          {remaining != null ? fmt(remaining) : fmt(elapsed)}
        </span>
      </div>

      <div className="qr-progress">
        <div className="qr-progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      {q ? (
        <div className="qr-main">
          <div className="qr-palette" aria-hidden>
            {items.map((i, idx) => {
              const a = answers[i.id];
              return (
                <button
                  key={i.id}
                  type="button"
                  className={cx(
                    'qr-chip',
                    idx === index && 'is-current',
                    a?.picked != null && 'is-answered',
                    a?.marked && 'is-marked',
                  )}
                  onClick={() => {
                    quiz.go(idx - index);
                    setShowReview(false);
                  }}
                  title={`Q${idx + 1}${a?.picked != null ? ' · answered' : ''}${a?.marked ? ' · review' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <Card className="qr-card">
            <div className="q-meta">
              <span className="q-kinds">
                <Badge tone={KIND_TONE[q.kind]}>{KIND_LABEL[q.kind]}</Badge>
                {q.isDemo && <Badge tone="neutral">DEMO</Badge>}
                <Badge tone="neutral">{q.topic}</Badge>
              </span>
              <span className="px-fs-xs px-muted-2">
                {index + 1} / {total}
              </span>
            </div>

            <p className="q-text qr-question">{q.text}</p>

            {q.options ? (
              <div className="q-opts">
                {q.options.map((o, oi) => {
                  const state = answers[q.id];
                  const isPicked = state?.picked === o;
                  const isAnswer = q.answer === o;
                  const locked = state?.picked != null;
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={cx(
                        'q-opt',
                        locked && isAnswer && 'is-correct',
                        locked && isPicked && !isAnswer && 'is-wrong',
                      )}
                      onClick={() => {
                        quiz.answer(o);
                        setShowReview(true);
                      }}
                      disabled={locked}
                    >
                      <span className="q-opt-key">{String.fromCharCode(65 + oi)}</span>
                      <span className="q-opt-txt">{o}</span>
                      {locked && isAnswer && <Check size={15} className="q-opt-flag" />}
                      {locked && isPicked && !isAnswer && <X size={15} className="q-opt-flag" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyState compact title="Free-response question" text="Quizzes auto-score MCQs — free response lives in chapter practice." />
            )}

            {showReview && answers[q.id]?.picked != null && (
              <div
                className={cx(
                  'q-verdict qr-verdict',
                  answers[q.id].correct ? 'is-right' : 'is-wrong',
                )}
              >
                {answers[q.id].correct ? '✓ Correct' : '✗ Incorrect'}
              </div>
            )}

            {showReview && answers[q.id]?.picked != null && q.answer && (
              <div className="q-solution qr-solution">
                <div className="q-sol-title">Answer</div>
                <p>{q.answer}</p>
                {q.explanation && (
                  <>
                    <div className="q-sol-title q-sol-why">Why</div>
                    <p className="q-sol-exp">{q.explanation}</p>
                  </>
                )}
              </div>
            )}

            <div className="qr-actions">
              <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => skip(-1)}>
                <ArrowLeft size={14} /> Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={() => quiz.markReview()}>
                <Flag size={14} />
                {answers[q.id]?.marked ? 'Unmark review' : 'Mark for review'}
              </Button>
              {index < total - 1 ? (
                <Button variant="soft" size="sm" onClick={() => skip(1)}>
                  Next <ArrowRight size={14} />
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={finishNow}>
                  <Check size={14} /> Finish
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState title="Nothing here" text="The quiz session has no questions." actionLabel="Quizzes" to="/quizzes" />
      )}

      <div className="qr-footer">
        <span className="px-muted-2 px-fs-xs">
          {answeredCount}/{total} answered · {markedCount} marked · answers lock after one attempt
        </span>
        <Link to="/progress" className="px-muted-2 px-fs-xs">
          See how this affects your progress →
        </Link>
      </div>
    </div>
  );
}
