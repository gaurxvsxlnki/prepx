import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterX, Info, ListFilter, Play, SlidersHorizontal } from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { StudyQuestionCard } from '../components/practice/StudyQuestionCard';
import {
  PYQ_BANK,
  PYQ_YEAR_MAX,
  PYQ_YEAR_MIN,
  chapterBankSize,
  subjectOfRow,
} from '../data/questions';
import { BOOKS, subjectOf } from '../data/content';
import { useQuiz } from '../stores/quiz';
import { useActivity } from '../stores/activity';
import { useBookmarks, bookmarkKey } from '../stores/bookmarks';
import { useUi } from '../stores/ui';
import type { Difficulty, PyqExam, StudyQuestion } from '../types/study';
import type { SubjectCode } from '../types';
import { cx } from '../lib/utils';

const EXAM_OPTIONS: Array<{ value: PyqExam; label: string }> = [
  { value: 'jee', label: 'JEE' },
  { value: 'neet', label: 'NEET' },
  { value: 'cbse', label: 'CBSE Board' },
  { value: 'icse', label: 'ICSE' },
  { value: 'state', label: 'State Boards' },
];
const SUBJECT_OPTIONS: SubjectCode[] = ['physics', 'chemistry', 'biology'];
const DIFF_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

type SortKey = 'newest' | 'oldest' | 'difficulty' | 'unattempted';
const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'difficulty', label: 'Hardest first' },
  { value: 'unattempted', label: 'Unattempted first' },
];

const YEARS = Array.from(
  { length: PYQ_YEAR_MAX - PYQ_YEAR_MIN + 1 },
  (_, i) => PYQ_YEAR_MAX - i,
);

export default function Pyqs() {
  const nav = useNavigate();
  const quiz = useQuiz();
  const activity = useActivity();
  const bookmarks = useBookmarks();
  const showToast = useUi((s) => s.showToast);

  const [exam, setExam] = useState<'all' | PyqExam>('all');
  const [subject, setSubject] = useState<'all' | SubjectCode>('all');
  const [chapter, setChapter] = useState<'all' | string>('all');
  const [yearFrom, setYearFrom] = useState(PYQ_YEAR_MIN);
  const [yearTo, setYearTo] = useState(PYQ_YEAR_MAX);
  const [diff, setDiff] = useState<'all' | Difficulty>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  /* Chapter options: chapters that actually own bank rows. */
  const chapterOptions = useMemo(() => {
    const out: Array<{ id: string; subject: SubjectCode; title: string; book: string }> = [];
    for (const b of BOOKS) {
      for (const c of b.chapters) {
        if (chapterBankSize(c.id) > 0) {
          out.push({ id: c.id, subject: b.subject, title: c.title, book: b.title });
        }
      }
    }
    return out;
  }, []);

  const attemptedIds = useMemo(
    () =>
      new Set(
        activity.events
          .filter((e) => e.kind === 'pyq' && e.refId)
          .map((e) => e.refId as string),
      ),
    [activity.events],
  );

  const filtered = useMemo(() => {
    let rows = PYQ_BANK.filter((q) => {
      const subj = subjectOfRow(q);
      if (exam !== 'all' && q.exam !== exam) return false;
      if (subject !== 'all' && subj !== subject) return false;
      if (chapter !== 'all' && q.chapterId !== chapter) return false;
      if (q.year != null && (q.year < yearFrom || q.year > yearTo)) return false;
      if (diff !== 'all' && q.difficulty !== diff) return false;
      return true;
    });
    const byYear = (a: StudyQuestion, b: StudyQuestion) => (b.year ?? 0) - (a.year ?? 0);
    if (sort === 'newest') rows = [...rows].sort(byYear);
    else if (sort === 'oldest') rows = [...rows].sort((a, b) => byYear(b, a));
    else if (sort === 'difficulty')
      rows = [...rows].sort(
        (a, b) =>
          (b.marks ?? 0) - (a.marks ?? 0) ||
          (b.explanation ? 1 : 0) - (a.explanation ? 1 : 0),
      );
    else
      rows = [...rows].sort((a, b) => {
        const ua = attemptedIds.has(a.id) ? 1 : 0;
        const ub = attemptedIds.has(b.id) ? 1 : 0;
        return ua - ub || byYear(b, a);
      });
    return rows;
  }, [exam, subject, chapter, yearFrom, yearTo, diff, sort, attemptedIds]);

  const availYears = useMemo(() => {
    const set = new Set<number>();
    for (const q of PYQ_BANK) {
      if (exam !== 'all' && q.exam !== exam) continue;
      const s = subjectOfRow(q);
      if (subject !== 'all' && s !== subject) continue;
      if (q.year != null) set.add(q.year);
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [exam, subject]);

  const onExam = (e: 'all' | PyqExam) => {
    setExam(e);
    setChapter('all');
  };
  const onSubject = (s: 'all' | SubjectCode) => {
    setSubject(s);
    setChapter('all');
  };
  const resetFilters = () => {
    setExam('all');
    setSubject('all');
    setChapter('all');
    setYearFrom(PYQ_YEAR_MIN);
    setYearTo(PYQ_YEAR_MAX);
    setDiff('all');
  };

  const startPracticeSet = () => {
    const mcqs = filtered.filter((q) => q.options && q.options.length > 0);
    if (mcqs.length === 0) {
      showToast('No auto-scored items match these filters — loosen a filter.');
      return;
    }
    const subj = subject === 'all' ? subjectOfRow(mcqs[0]) : subject;
    quiz.start(mcqs.slice(0, 15), {
      type: 'pyq',
      subject: subj,
      label: `${exam === 'all' ? 'Mixed' : exam.toUpperCase()} PYQs · ${mcqs.length}Q`,
    });
    nav('/quiz/run');
  };

  const onToggleBookmark = (q: StudyQuestion) => {
    const already = bookmarks.isBookmarked(bookmarkKey('pyq', q.id));
    bookmarks.toggle({
      kind: 'pyq',
      title: q.text.slice(0, 110) + (q.text.length > 110 ? '…' : ''),
      subtitle: `${q.exam?.toUpperCase() ?? ''} ${q.year ?? ''} · ${q.topic}`.trim(),
      href: '/pyqs',
    });
    showToast(already ? 'Removed from bookmarks' : 'PYQ bookmarked');
  };

  return (
    <div>
      <PageHead
        icon={<SlidersHorizontal size={22} />}
        title="PYQ Explorer"
        subtitle="Filter past-exam pattern questions by exam, subject, chapter, year and difficulty."
        action={
          <Button variant="soft" size="sm" onClick={startPracticeSet} disabled={filtered.length === 0}>
            <Play size={14} /> Practice this set ({filtered.length})
          </Button>
        }
      />

      <Card className="pyq-filters">
        <div className="pyq-fgroup">
          <span className="pyq-fname">Exam</span>
          <div className="chip-row">
            <FilterChip active={exam === 'all'} onClick={() => onExam('all')}>
              All exams
            </FilterChip>
            {EXAM_OPTIONS.map((e) => (
              <FilterChip key={e.value} active={exam === e.value} onClick={() => onExam(e.value)}>
                {e.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="pyq-fgroup">
          <span className="pyq-fname">Subject</span>
          <div className="chip-row">
            <FilterChip active={subject === 'all'} onClick={() => onSubject('all')}>
              All subjects
            </FilterChip>
            {SUBJECT_OPTIONS.map((s) => (
              <FilterChip key={s} active={subject === s} onClick={() => onSubject(s)}>
                {subjectOf(s).name}
              </FilterChip>
            ))}
          </div>
        </div>

        {subject !== 'all' && (
          <div className="pyq-fgroup">
            <span className="pyq-fname">Chapter</span>
            <div className="chip-row pyq-chapters">
              <FilterChip active={chapter === 'all'} onClick={() => setChapter('all')}>
                All chapters
              </FilterChip>
              {chapterOptions
                .filter((c) => c.subject === subject)
                .map((c) => (
                  <FilterChip
                    key={c.id}
                    active={chapter === c.id}
                    onClick={() => setChapter(c.id)}
                  >
                    {c.title}
                  </FilterChip>
                ))}
            </div>
          </div>
        )}

        <div className="pyq-fgroup">
          <span className="pyq-fname">Year</span>
          <div className="chip-row pyq-year-row">
            <label className="pyq-year-select">
              <span>From</span>
              <select value={yearFrom} onChange={(e) => setYearFrom(Number(e.target.value))}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="pyq-year-select">
              <span>To</span>
              <select value={yearTo} onChange={(e) => setYearTo(Number(e.target.value))}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <span className="px-muted-2 px-fs-xs">· full range 2000–{PYQ_YEAR_MAX}</span>
          </div>
          {availYears.length > 0 && (yearFrom !== PYQ_YEAR_MIN || yearTo !== PYQ_YEAR_MAX) && (
            <div className="chip-row pyq-years-avail">
              {availYears.map((y) => (
                <FilterChip
                  key={y}
                  active={yearFrom === y && yearTo === y}
                  onClick={() => {
                    setYearFrom(y);
                    setYearTo(y);
                  }}
                >
                  {y}
                </FilterChip>
              ))}
            </div>
          )}
        </div>

        <div className="pyq-fgroup">
          <span className="pyq-fname">Difficulty</span>
          <div className="chip-row">
            <FilterChip active={diff === 'all'} onClick={() => setDiff('all')}>
              All
            </FilterChip>
            {DIFF_OPTIONS.map((d) => (
              <FilterChip key={d.value} active={diff === d.value} onClick={() => setDiff(d.value)}>
                {d.label}
              </FilterChip>
            ))}
          </div>
          <div className="pyq-sort">
            <ListFilter size={13} />
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pyq-filters-foot">
          <button type="button" className="btn-link" onClick={resetFilters}>
            <FilterX size={13} /> Reset filters
          </button>
          <span className="px-muted-2 px-fs-sm">
            {filtered.length} item{filtered.length === 1 ? '' : 's'} in range
          </span>
        </div>
      </Card>

      <div className="pyq-note">
        <Info size={14} />
        <span>
          Honesty rule: this dataset is clearly <Badge tone="neutral">DEMO</Badge> — items follow exam
          patterns but are not official papers. The engine below is production-shaped; official PYQs
          plug into the same rows. Years present in the demo: {Array.from(new Set(PYQ_BANK.map((q) => q.year))).sort((a, b) => (b ?? 0) - (a ?? 0)).join(', ')}.
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FilterX size={24} />}
            title="No PYQs match that filter"
            text="The demo catalogue only spans the seeded chapters and years. Loosen the range or reset filters."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        </Card>
      ) : (
        <div className="pyq-list">
          {filtered.map((q) => (
            <StudyQuestionCard
              key={q.id}
              q={q}
              showExamBadge
              className={attemptedIds.has(q.id) ? 'is-attempted' : undefined}
              bookmarked={bookmarks.isBookmarked(bookmarkKey('pyq', q.id))}
              onToggleBookmark={onToggleBookmark}
              onAnswered={(qq, correct) =>
                activity.record({
                  kind: 'pyq',
                  subject: subjectOfRow(qq),
                  chapterId: qq.chapterId || undefined,
                  correct,
                  refId: qq.id,
                  label: `${correct ? 'Solved' : 'Missed'} PYQ · ${qq.topic}`,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cx('chip', active && 'is-active')}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
