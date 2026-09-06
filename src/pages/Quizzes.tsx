import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles, Zap } from 'lucide-react';
import { PageHead, SectionHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SubjectBadge } from '../components/common/SubjectBadge';
import { useQuiz } from '../stores/quiz';
import { BOOKS, subjectOf } from '../data/content';
import { PYQ_BANK, QUESTION_BANK, chapterBankSize, subjectOfRow } from '../data/questions';
import { useUi } from '../stores/ui';
import type { SubjectCode } from '../types';
import type { PyqExam, StudyQuestion } from '../types/study';
import { cx } from '../lib/utils';

type ScopeKind = 'chapter' | 'subject' | 'pyq';

export default function Quizzes() {
  const nav = useNavigate();
  const quiz = useQuiz();
  const showToast = useUi((s) => s.showToast);

  const [scope, setScope] = useState<ScopeKind>('chapter');
  const [chapterId, setChapterId] = useState<string>('');
  const [subject, setSubject] = useState<SubjectCode>('biology');
  const [exam, setExam] = useState<PyqExam | 'mixed'>('mixed');
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(true);

  const chapterList = useMemo(
    () =>
      BOOKS.flatMap((b) =>
        b.chapters
          .filter((c) => chapterBankSize(c.id) > 0)
          .map((c) => ({ ...c, book: b, size: chapterBankSize(c.id) })),
      ),
    [],
  );

  const quizItems = useMemo((): { items: StudyQuestion[]; label: string; subj: SubjectCode } => {
    if (scope === 'chapter') {
      const found = chapterList.find((c) => c.id === chapterId);
      const base = found
        ? QUESTION_BANK.filter((q) => q.chapterId === chapterId && q.options && q.options.length)
        : chapterList[0]
          ? QUESTION_BANK.filter(
              (q) => q.chapterId === chapterList[0].id && q.options && q.options.length,
            )
          : [];
      return {
        items: base,
        label: `${found?.title ?? chapterList[0]?.title ?? 'Chapter'}`,
        subj: found ? found.book.subject : (chapterList[0]?.book.subject ?? 'biology'),
      };
    }
    if (scope === 'subject') {
      const items = QUESTION_BANK.filter(
        (q) => subjectOfRow(q) === subject && q.options && q.options.length,
      );
      return { items, label: subjectOf(subject).name, subj: subject };
    }
    const items = PYQ_BANK.filter(
      (q) => (exam === 'mixed' || q.exam === exam) && q.options && q.options.length,
    );
    return {
      items,
      label: exam === 'mixed' ? 'Mixed PYQs' : `${exam.toUpperCase()} PYQs`,
      subj: items[0] ? subjectOfRow(items[0]) : 'biology',
    };
  }, [scope, chapterId, subject, exam, chapterList]);

  const start = (n = count, extra?: Partial<{ timed: boolean }>) => {
    const useTimed = extra?.timed ?? timed;
    const items = quizItems.items;
    if (items.length === 0) {
      showToast('No auto-scored questions in that scope yet.');
      return;
    }
    const picked = [...items].sort(() => Math.random() - 0.5).slice(0, n);
    const activeChapter = chapterId || chapterList[0]?.id || '';
    const source =
      scope === 'chapter'
        ? { type: 'chapter' as const, chapterId: activeChapter, subject: quizItems.subj, label: quizItems.label }
        : scope === 'subject'
          ? { type: 'subject' as const, subject: quizItems.subj, label: quizItems.label }
          : { type: 'pyq' as const, subject: quizItems.subj, label: quizItems.label };
    quiz.start(picked, source, {
      timeLimitSec: useTimed ? picked.length * 75 : undefined,
    });
    nav('/quiz/run');
  };

  return (
    <div>
      <PageHead
        icon={<Zap size={22} />}
        title="Quizzes"
        subtitle="Timed, auto-scored drills built from chapter banks, subjects and PYQ patterns."
      />

      <div className="qz-grid">
        <Card className="qz-builder">
          <div className="section-head">
            <div>
              <h2 className="section-title">Build a quiz</h2>
              <p className="section-sub">Pick a scope, then start — questions come from real page banks.</p>
            </div>
          </div>

          <div className="seg" role="tablist">
            {(
              [
                ['chapter', 'Chapter'],
                ['subject', 'Subject'],
                ['pyq', 'PYQs'],
              ] as Array<[ScopeKind, string]>
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={scope === k}
                className={cx('seg-btn', scope === k && 'is-active')}
                onClick={() => setScope(k)}
              >
                {label}
              </button>
            ))}
          </div>

          {scope === 'chapter' && (
            <div className="qz-field">
              <label className="qz-label">Chapter</label>
              <div className="qz-chapters">
                {chapterList.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={cx('chip', chapterId === c.id && 'is-active')}
                    onClick={() => setChapterId(c.id)}
                  >
                    {c.title}
                    <span className="chip-sub">
                      {subjectOf(c.book.subject).name} · {c.size}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {scope === 'subject' && (
            <div className="qz-field">
              <label className="qz-label">Subject</label>
              <div className="chip-row">
                {(['physics', 'chemistry', 'biology'] as SubjectCode[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={cx('chip', subject === s && 'is-active')}
                    onClick={() => setSubject(s)}
                  >
                    {subjectOf(s).name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {scope === 'pyq' && (
            <div className="qz-field">
              <label className="qz-label">Exam pattern</label>
              <div className="chip-row">
                {(
                  [
                    ['mixed', 'Mixed'],
                    ['jee', 'JEE'],
                    ['neet', 'NEET'],
                    ['cbse', 'CBSE Board'],
                  ] as Array<[PyqExam | 'mixed', string]>
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    className={cx('chip', exam === k && 'is-active')}
                    onClick={() => setExam(k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="qz-field">
            <label className="qz-label">Question count</label>
            <div className="chip-row">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={cx('chip', count === n && 'is-active')}
                  onClick={() => setCount(n)}
                >
                  {n} questions
                </button>
              ))}
            </div>
          </div>

          <div className="qz-field">
            <label className="qz-label">Mode</label>
            <div className="chip-row">
              <button
                type="button"
                className={cx('chip', timed && 'is-active')}
                onClick={() => setTimed(true)}
              >
                <Clock size={13} /> Timed ({Math.round(count * 1.2)} min)
              </button>
              <button
                type="button"
                className={cx('chip', !timed && 'is-active')}
                onClick={() => setTimed(false)}
              >
                Untimed practice
              </button>
            </div>
          </div>

          <div className="qz-start">
            <span className="px-muted-2 px-fs-sm">
              {quizItems.items.length} available · starting {Math.min(count, quizItems.items.length)}
            </span>
            <Button
              trailing={<ArrowRight size={15} />}
              disabled={quizItems.items.length === 0}
              onClick={() => start(count)}
            >
              Start quiz
            </Button>
          </div>
        </Card>

        <Card className="qz-side">
          <h3 className="qz-side-title">
            <Sparkles size={16} /> Quick start
          </h3>
          <p className="px-muted-2 px-fs-sm">One-tap drills from ready-made pools.</p>
          <div className="qz-quick">
            {chapterList.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                className="qz-quick-row"
                onClick={() => {
                  setScope('chapter');
                  setChapterId(c.id);
                  start(5, { timed: false });
                }}
              >
                <SubjectBadge code={c.book.subject} />
                <span className="px-grow">
                  <strong>{c.title}</strong>
                  <small>
                    {subjectOf(c.book.subject).name} · {c.size} items
                  </small>
                </span>
                <Badge tone="accent">5Q</Badge>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <SectionHead title="How quizzes feed analytics" sub="Every attempt is recorded against your subject & chapter — accuracy, weak topics and streaks update automatically on the Progress page." />

      <div className="qz-facts">
        <Card className="qz-fact">
          <strong>1×</strong>
          <span>Attempt per question — honest scoring</span>
        </Card>
        <Card className="qz-fact">
          <strong>✓</strong>
          <span>Instant explanation after each answer</span>
        </Card>
        <Card className="qz-fact">
          <strong>🧠</strong>
          <span>Weak-topic signal from ≥2 attempts per topic</span>
        </Card>
      </div>
    </div>
  );
}
