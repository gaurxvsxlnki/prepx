import { create } from 'zustand';
import type { StudyQuestion } from '../types/study';
import type { SubjectCode } from '../types';

export type QuizSource =
  | { type: 'chapter'; chapterId: string; label: string; subject: SubjectCode }
  | { type: 'subject'; subject: SubjectCode; label: string }
  | { type: 'pyq'; subject: SubjectCode; label: string }
  | { type: 'custom'; subject: SubjectCode; label: string };

export type QuizSourceType = QuizSource['type'];

export interface AnswerState {
  picked: string | null;
  correct: boolean | null;
  skipped: boolean;
  marked: boolean;
}

export interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  timeSec: number;
  topicBreakdown: Array<{ topic: string; correct: number; total: number }>;
}

export interface QuizOptions {
  timeLimitSec?: number;
  /** Called for every answered question (activity/analytics hook). */
  onAnswered?: (q: StudyQuestion, correct: boolean) => void;
}

interface QuizState {
  status: 'idle' | 'active' | 'done';
  items: StudyQuestion[];
  source: QuizSource | null;
  index: number;
  answers: Record<string, AnswerState>;
  startedAt: number | null;
  timeLimitSec: number | null;
  result: QuizResult | null;
  start(items: StudyQuestion[], source: QuizSource, opts?: QuizOptions): void;
  answer(picked: string): void;
  markReview(): void;
  go(delta: number): void;
  finish(timeSec: number): void;
  reset(): void;
}

let answerHook: QuizOptions['onAnswered'] = undefined;

export const useQuiz = create<QuizState>((set, get) => ({
  status: 'idle',
  items: [],
  source: null,
  index: 0,
  answers: {},
  startedAt: null,
  timeLimitSec: null,
  result: null,

  start(items, source, opts) {
    answerHook = opts?.onAnswered;
    set({
      status: 'active',
      items,
      source,
      index: 0,
      answers: {},
      startedAt: Date.now(),
      timeLimitSec: opts?.timeLimitSec ?? null,
      result: null,
    });
  },

  answer(picked) {
    const { items, index, answers } = get();
    const q = items[index];
    if (!q) return;
    const prev = answers[q.id];
    if (prev && prev.picked != null) return; // one attempt per question
    const correct = picked === q.answer;
    answerHook?.(q, correct);
    set({
      answers: {
        ...answers,
        [q.id]: { picked, correct, skipped: false, marked: false },
      },
    });
  },

  markReview() {
    const { items, index, answers } = get();
    const q = items[index];
    if (!q) return;
    const prev = answers[q.id] ?? { picked: null, correct: null, skipped: false, marked: false };
    set({
      answers: {
        ...answers,
        [q.id]: { ...prev, marked: !prev.marked },
      },
    });
  },

  go(delta) {
    const { index, items } = get();
    set({ index: Math.min(items.length - 1, Math.max(0, index + delta)) });
  },

  finish(timeSec) {
    const { items, answers } = get();
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    const topicMap = new Map<string, { correct: number; total: number }>();
    for (const q of items) {
      const a = answers[q.id];
      const bucket = topicMap.get(q.topic) ?? { correct: 0, total: 0 };
      bucket.total += 1;
      if (!a || a.picked == null) skipped += 1;
      else if (a.correct) {
        correct += 1;
        bucket.correct += 1;
      } else incorrect += 1;
      topicMap.set(q.topic, bucket);
    }
    const total = items.length;
    set({
      status: 'done',
      result: {
        total,
        correct,
        incorrect,
        skipped,
        accuracy: total > 0 ? Math.round((correct / (total - skipped || 1)) * 100) : 0,
        timeSec,
        topicBreakdown: Array.from(topicMap.entries()).map(([topic, v]) => ({
          topic,
          correct: v.correct,
          total: v.total,
        })),
      },
    });
  },

  reset() {
    answerHook = undefined;
    set({
      status: 'idle',
      items: [],
      source: null,
      result: null,
      answers: {},
      index: 0,
      startedAt: null,
      timeLimitSec: null,
    });
  },
}));

export function activeQuestion() {
  const s = useQuiz.getState();
  return s.items[s.index] ?? null;
}
