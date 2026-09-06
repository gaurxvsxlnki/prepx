import type { SubjectCode } from '../types';
import type {
  ChapterStat,
  ProgressSummary,
  SubjectStat,
  TrackEvent,
} from '../types/study';
import { BOOKS, getChapter, subjectOf } from '../data/content';
import { bankForChapter } from '../data/questions';
import type { Chapter } from '../types';

const MIN_SAMPLE = 5;

const dayKey = (isoStr: string) => isoStr.slice(0, 10);

/** Attempt-based events (correct flag meaningful). */
const attemptKinds = (e: TrackEvent) =>
  e.correct !== undefined &&
  (e.kind === 'question' || e.kind === 'pyq' || e.kind === 'quiz');

export function isActiveDay(e: TrackEvent): boolean {
  return e.minutes > 0;
}

export function buildSummary(
  events: TrackEvent[],
  scopeSubjects: SubjectCode[],
): ProgressSummary {
  const subjMap = new Map<SubjectCode, SubjectStat>();
  for (const s of scopeSubjects) {
    subjMap.set(s, {
      subject: s,
      attempted: 0,
      correct: 0,
      accuracy: 0,
      minutes: 0,
    });
  }
  const chapterMap = new Map<string, ChapterStat>();
  const daily = new Map<string, number>();

  let questionsAttempted = 0;
  let questionsCorrect = 0;
  let pyqAttempted = 0;
  let pyqCorrect = 0;
  let quizCorrect = 0;
  let quizAttempted = 0;
  let cards = 0;
  let pagesRead = 0;
  let minutesTotal = 0;

  for (const e of events) {
    minutesTotal += e.minutes;
    const subj = subjMap.get(e.subject) ?? subjMap.get(subjectOf(e.subject).code)!;
    if (subj) {
      subj.minutes += e.minutes;
      if (attemptKinds(e)) {
        subj.attempted += 1;
        if (e.correct) subj.correct += 1;
      }
    }
    if (e.chapterId) {
      const c = chapterMap.get(e.chapterId) ?? {
        chapterId: e.chapterId,
        attempted: 0,
        correct: 0,
        accuracy: 0,
        sufficientData: false,
      };
      if (attemptKinds(e)) {
        c.attempted += 1;
        if (e.correct) c.correct += 1;
      }
      chapterMap.set(e.chapterId, c);
    }

    if (e.kind === 'question') {
      questionsAttempted += 1;
      if (e.correct) questionsCorrect += 1;
    } else if (e.kind === 'pyq') {
      pyqAttempted += 1;
      if (e.correct) pyqCorrect += 1;
    } else if (e.kind === 'quiz') {
      quizAttempted += 1;
      if (e.correct) quizCorrect += 1;
    } else if (e.kind === 'flashcard') {
      cards += 1;    } else if (e.kind === 'page_view' && e.pageNumber != null) {
      pagesRead += 1;
    }

    daily.set(dayKey(e.at), (daily.get(dayKey(e.at)) ?? 0) + e.minutes);
  }

  // Accuracy (attempts across question/pyq/quiz kinds)
  const attempted = questionsAttempted + pyqAttempted + quizAttempted;
  const correct = questionsCorrect + pyqCorrect + quizCorrect;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  const subjects: SubjectStat[] = Array.from(subjMap.values())
    .map((s) => ({
      ...s,
      accuracy:
        s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0,
    }))
    .filter((s) => s.minutes > 0 || s.attempted > 0);

  const chapters: ChapterStat[] = Array.from(chapterMap.values())
    .filter((c) => c.attempted > 0)
    .map((c) => ({
      ...c,
      accuracy: Math.round((c.correct / c.attempted) * 100),
      sufficientData: c.attempted >= MIN_SAMPLE,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakChapters = chapters.filter(
    (c) => c.sufficientData && c.accuracy < 65,
  );
  const strongChapters = chapters.filter(
    (c) => c.sufficientData && c.accuracy >= 85,
  );

  // Streak
  const days = Array.from(daily.entries())
    .filter(([, m]) => m > 0)
    .map(([d]) => d)
    .sort();
  const today = new Date();
  const todayKey = dayKey(today.toISOString());
  const yesterdayKey = dayKey(new Date(today.getTime() - 864e5).toISOString());
  let streak = 0;
  let cursor = days.includes(todayKey)
    ? todayKey
    : days.includes(yesterdayKey)
      ? yesterdayKey
      : null;
  const daySet = new Set(days);
  while (cursor && daySet.has(cursor)) {
    streak += 1;
    const d = new Date(cursor);
    d.setDate(d.getDate() - 1);
    cursor = dayKey(d.toISOString());
  }
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of days) {
    if (prev) {
      const gap = Math.round(
        (new Date(d).getTime() - new Date(prev).getTime()) / 864e5,
      );
      run = gap === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  const last7Min = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * 864e5);
    return daily.get(dayKey(d.toISOString())) ?? 0;
  });

  return {
    questionsAttempted,
    questionsCorrect,
    accuracy,
    pyqAttempted,
    pyqCorrect,
    quizAttempted,
    quizAvg: quizAttempted > 0 ? Math.round((quizCorrect / quizAttempted) * 100) : 0,
    pagesRead,
    minutesTotal,
    streakDays: streak,
    longestStreak: Math.max(longest, streak),
    activeDays: days.length,
    last7Min,
    daily: Array.from(daily.entries())
      .map(([day, m]) => ({ day, minutes: m, events: 0 }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-35),
    subjects,
    chapters,
    weakChapters,
    strongChapters,
  };
}

/** Last page the user read — drives “Continue learning”. */
export function continueTarget(
  events: TrackEvent[],
): { bookId: string; chapterId: string; pageNumber: number; progressPct: number } | null {
  const pageEvents = events
    .filter((e) => e.kind === 'page_view' && e.chapterId && e.pageNumber != null)
    .sort((a, b) => b.at.localeCompare(a.at));
  if (pageEvents.length === 0) return null;
  const e = pageEvents[0];
  const chapter = getChapter(e.bookId ?? '', e.chapterId ?? '');
  const pageNumber = Math.max(1, e.pageNumber ?? 1);
  const total = chapter?.pageCount ?? pageNumber;
  return {
    bookId: e.bookId ?? '',
    chapterId: e.chapterId ?? '',
    pageNumber,
    progressPct: Math.min(100, Math.round((pageNumber / total) * 100)),
  };
}

export function recentActivity(events: TrackEvent[], n = 10): TrackEvent[] {
  return [...events].sort((a, b) => b.at.localeCompare(a.at)).slice(0, n);
}

export function dailySeries(events: TrackEvent[], days = 14) {
  const out: { label: string; minutes: number }[] = [];
  const map = new Map<string, number>();
  for (const e of events) {
    const k = dayKey(e.at);
    map.set(k, (map.get(k) ?? 0) + e.minutes);
  }
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 864e5);
    const k = dayKey(d.toISOString());
    out.push({
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      minutes: map.get(k) ?? 0,
    });
  }
  return out;
}

export function weakChapterContext(chapters: ChapterStat[]) {
  return chapters.map((c) => {
    let chapter: Chapter | undefined;
    for (const b of BOOKS) {
      const hit = b.chapters.find((ch) => ch.id === c.chapterId);
      if (hit) {
        chapter = hit;
        break;
      }
    }
    return {
      stat: c,
      title: chapter?.title ?? c.chapterId,
      bank: chapter ? bankForChapter(chapter.id).length : 0,
      available: chapter?.available ?? false,
      href: chapter ? `/books/${chapter.bookId}/chapter/${chapter.id}` : undefined,
    };
  });
}


