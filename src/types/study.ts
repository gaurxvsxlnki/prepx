/* ============================================================
   Phase 2 — study & practice domain types.
   These mirror the Phase 2 Supabase tables 1:1 so the demo
   datasets can be swapped for database rows without touching UI.
   ============================================================ */

import type { SubjectCode } from './index';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionKind =
  | 'mcq'
  | 'assertion'
  | 'short'
  | 'numerical'
  | 'long'
  | 'conceptual';
export type QuestionSource =
  | 'ncert'
  | 'exemplar'
  | 'pyq'
  | 'board'
  | 'prepx'
  | 'demo';

export type PyqExam = 'jee' | 'neet' | 'cbse' | 'icse' | 'state';

/** Where an item appears in the reader's right-hand panel. */
export type ReaderSection = 'important' | 'mcq' | 'pyq' | 'concept';

export interface StudyQuestion {
  id: string;
  chapterId: string; // content-graph chapter id ("" = general)
  subject?: SubjectCode; // set for unmapped/general rows
  /** 1-based textbook pages this item belongs to (demo page-mapping). */
  pages: number[];
  section: ReaderSection;
  kind: QuestionKind;
  difficulty: Difficulty;
  topic: string;
  text: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  source: QuestionSource;
  sourceLabel?: string; // e.g. 'Demo · NEET pattern 2022'
  exam?: PyqExam; // populated for PYQ items
  year?: number; // populated for PYQ items
  marks?: number;
  isDemo: boolean;
}

export interface StudyFlashcard {
  id: string;
  deckId: string;
  chapterId: string;
  subject: SubjectCode;
  pages: number[]; // page mapping (concept appears on these pages)
  front: string;
  back: string;
  tag: string;
  isDemo: boolean;
}

export interface DiagramLabel {
  id: string;
  text: string;
  /** Normalised anchor (0–100) where the labelled figure appears. */
  x: number;
  y: number;
}

export interface DiagramItem {
  id: string;
  bookId: string;
  title: string;
  subject: SubjectCode;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
  caption: string;
  /** Region captions shown in the viewer (labels are part of content QA). */
  labels: DiagramLabel[];
  examRelevance: string;
  isDemo: boolean;
}

/* ---------- Activity / progress ---------- */
export type TrackKind =
  | 'page_view'
  | 'question'
  | 'pyq'
  | 'quiz'
  | 'flashcard'
  | 'diagram';

export interface TrackEvent {
  id: string;
  at: string; // ISO
  kind: TrackKind;
  subject: SubjectCode;
  chapterId?: string;
  bookId?: string;
  pageNumber?: number;
  correct?: boolean;
  /** Question/card id when the event is an attempt (powers “unattempted”). */
  refId?: string;
  minutes: number;
  label: string;
}

export interface StudyDay {
  day: string; // yyyy-mm-dd
  minutes: number;
  events: number;
}

export interface ChapterStat {
  chapterId: string;
  attempted: number;
  correct: number;
  accuracy: number; // 0-100 or null when insufficient
  sufficientData: boolean;
}

export interface SubjectStat {
  subject: SubjectCode;
  attempted: number;
  correct: number;
  accuracy: number;
  minutes: number;
}

export interface ProgressSummary {
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  pyqAttempted: number;
  pyqCorrect: number;
  quizAttempted: number;
  quizAvg: number;
  pagesRead: number;
  minutesTotal: number;
  streakDays: number;
  longestStreak: number;
  activeDays: number;
  last7Min: number[];
  daily: StudyDay[];
  subjects: SubjectStat[];
  chapters: ChapterStat[];
  weakChapters: ChapterStat[];
  strongChapters: ChapterStat[];
}

export type CardRating = 'again' | 'hard' | 'good' | 'easy';
