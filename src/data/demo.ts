/* ============================================================
   Demo data — realistic, clearly-typed stand-ins for database
   responses. Phase 2 replaces these arrays with Supabase queries;
   every consumer renders from these shapes only.
   ============================================================ */

import type {
  ActivityItem,
  ContinueLearning,
  DiagramItem,
  ExamGoalCode,
  FlashcardDeck,
  Profile,
  PyqPaper,
  QuizSet,
  Recommendation,
  StudyStat,
  SubjectProgress,
} from '../types';

/** Fully-onboarded persona used by "Explore demo dashboard". */
export const DEMO_PERSONA: Profile = {
  user_id: 'u_demo_premium',
  full_name: 'Gaurav Sharma',
  email: 'gaurav.sharma@prepx.demo',
  avatar_url: null,
  class: '11',
  board: 'cbse',
  exam_goal: 'boards',
  subjects: ['physics', 'chemistry', 'biology', 'mathematics'],
  language: 'english',
  onboarded: true,
  created_at: new Date(Date.now() - 90 * 864e5).toISOString(),
  updated_at: new Date().toISOString(),
};

/** Students studying right now — live demo ticker (real count in Phase 2). */
export const LIVE_STUDENTS = 127;

/* ---------- Dashboard stat cards ---------- */
export const STUDY_STATS: StudyStat[] = [
  { id: 'q', label: 'Questions solved', value: '1,284', delta: '+36 this week', trend: 'up' },
  { id: 'pyq', label: 'PYQs attempted', value: '436', delta: '+12 this week', trend: 'up' },
  { id: 'acc', label: 'Accuracy', value: '87%', delta: '+2% this month', trend: 'up' },
  { id: 'streak', label: 'Study streak', value: '12 days', delta: 'Personal best', trend: 'up' },
];

export const CONTINUE_LEARNING: ContinueLearning = {
  bookId: 'bio-11',
  chapterId: 'living-world',
  pageNumber: 7,
  progressPct: 72,
};

export const SUBJECT_PROGRESS: SubjectProgress[] = [
  { subject: 'physics', pct: 64, chaptersDone: 4, chaptersTotal: 8, minutesThisWeek: 186 },
  { subject: 'chemistry', pct: 72, chaptersDone: 6, chaptersTotal: 9, minutesThisWeek: 240 },
  { subject: 'biology', pct: 81, chaptersDone: 7, chaptersTotal: 10, minutesThisWeek: 305 },
  { subject: 'mathematics', pct: 58, chaptersDone: 5, chaptersTotal: 9, minutesThisWeek: 132 },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'a1', kind: 'page', title: 'Read The Living World — p. 7', meta: 'Biology · Class 11', timeAgo: '32 min ago' },
  { id: 'a2', kind: 'quiz', title: 'Solved 12 MCQs — Basic Concepts of Chemistry', meta: '92% accuracy', timeAgo: '2 h ago' },
  { id: 'a3', kind: 'pyq', title: 'PYQ drill · NEET pattern — Biological Classification', meta: '17 / 20 correct', timeAgo: 'yesterday' },
  { id: 'a4', kind: 'flashcard', title: 'Reviewed 18 flashcards — Units & Measurements', meta: '14 mastered', timeAgo: 'yesterday' },
  { id: 'a5', kind: 'diagram', title: 'Bookmarked a diagram — Animal cell', meta: 'Biology', timeAgo: '2 days ago' },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    reason: 'Because you finished page 9 of The Living World',
    title: 'Start Biological Classification',
    subtitle: '13 real NCERT pages · questions on every page',
    kind: 'page',
    href: '/books/bio-11/chapter/biological-classification',
    cta: 'Open chapter',
  },
  {
    id: 'r2',
    reason: '3 flashcards due for review',
    title: 'Revise Units & Measurements',
    subtitle: 'Flashcard deck · 18 cards · 14 mastered',
    kind: 'flashcard',
    href: '/flashcards',
    cta: 'Review now',
  },
  {
    id: 'r3',
    reason: 'Weak spot: mole concept (58%)',
    title: 'Drill stoichiometry MCQs',
    subtitle: 'Some Basic Concepts of Chemistry · p. 12',
    kind: 'quiz',
    href: '/books/chem-11/chapter/basic-concepts',
    cta: 'Start drill',
  },
  {
    id: 'r4',
    reason: 'NEET pattern · last year',
    title: 'Attempt a 20-question PYQ set',
    subtitle: 'Biological Classification · 25 minutes',
    kind: 'pyq',
    href: '/pyqs',
    cta: 'Attempt set',
  },
];

/* ---------- Study statistics (charts) ---------- */
export const WEEKLY_ACTIVITY = [
  { day: 'Mon', minutes: 64, questions: 42 },
  { day: 'Tue', minutes: 92, questions: 61 },
  { day: 'Wed', minutes: 48, questions: 27 },
  { day: 'Thu', minutes: 118, questions: 74 },
  { day: 'Fri', minutes: 85, questions: 52 },
  { day: 'Sat', minutes: 134, questions: 96 },
  { day: 'Sun', minutes: 156, questions: 108 },
];

/** Focus minutes over the last 14 days. */
export const FORTNIGHT_MINUTES = [38, 52, 74, 61, 90, 105, 47, 82, 66, 112, 128, 94, 137, 118];

export const ACCURACY_DONUT = [
  { label: 'Correct', value: 87, color: 'var(--ok)' },
  { label: 'Incorrect', value: 13, color: 'rgba(248,113,113,0.65)' },
];

/* ---------- PYQs / quizzes / flashcards / diagrams ---------- */
export const PYQ_PAPERS: PyqPaper[] = [
  {
    id: 'pyq-bio-cls-1',
    title: 'Biological Classification · full set',
    sourceLabel: 'NEET pattern · 20 Q',
    subject: 'biology',
    year: 2024,
    questions: 20,
    minutes: 25,
    status: 'new',
  },
  {
    id: 'pyq-chem-mole',
    title: 'Mole concept & stoichiometry',
    sourceLabel: 'JEE Main pattern · 15 Q',
    subject: 'chemistry',
    year: 2024,
    questions: 15,
    minutes: 30,
    status: 'attempted',
    score: '11/15',
  },
  {
    id: 'pyq-phys-units',
    title: 'Units & Measurements',
    sourceLabel: 'NEET pattern · 12 Q',
    subject: 'physics',
    year: 2023,
    questions: 12,
    minutes: 15,
    status: 'attempted',
    score: '10/12',
  },
  {
    id: 'pyq-bio-living',
    title: 'The Living World · revision set',
    sourceLabel: 'Board pattern · 10 Q',
    subject: 'biology',
    year: 2024,
    questions: 10,
    minutes: 15,
    status: 'attempted',
    score: '9/10',
  },
];

export const QUIZ_SETS: QuizSet[] = [
  {
    id: 'qz-bio-lw',
    title: 'The Living World · page drill',
    subject: 'biology',
    questions: 12,
    minutes: 10,
    status: 'new',
    href: '/books/bio-11/chapter/living-world',
  },
  {
    id: 'qz-chem-bc',
    title: 'Basic Concepts of Chemistry',
    subject: 'chemistry',
    questions: 15,
    minutes: 15,
    status: 'perfect',
    bestScore: 100,
    href: '/books/chem-11/chapter/basic-concepts',
  },
  {
    id: 'qz-phys-um',
    title: 'Units & Measurements',
    subject: 'physics',
    questions: 10,
    minutes: 10,
    status: 'attempted',
    bestScore: 80,
    href: '/books/phys-11/chapter/units-measurements',
  },
  {
    id: 'qz-bio-bc',
    title: 'Biological Classification',
    subject: 'biology',
    questions: 15,
    minutes: 12,
    status: 'new',
    href: '/books/bio-11/chapter/biological-classification',
  },
];

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  { id: 'fc-bio-taxo', title: 'Taxonomy terms', subject: 'biology', cards: 24, due: 4, mastered: 18, chapterId: 'living-world' },
  { id: 'fc-bio-kingdom', title: 'Five-kingdom systems', subject: 'biology', cards: 18, due: 6, mastered: 9, chapterId: 'biological-classification' },
  { id: 'fc-chem-formula', title: 'Formulas & units', subject: 'chemistry', cards: 30, due: 3, mastered: 24, chapterId: 'basic-concepts' },
  { id: 'fc-phys-dims', title: 'Dimensions & errors', subject: 'physics', cards: 20, due: 8, mastered: 11, chapterId: 'units-measurements' },
];

export const DIAGRAM_ITEMS: DiagramItem[] = [
  {
    id: 'dg-fungi',
    title: 'Kingdom Fungi — types',
    subject: 'biology',
    chapterId: 'biological-classification',
    pageNumber: 8,
    imageUrl: '/assets/pages/bio-11-classification/p008.jpg',
    caption: 'Fig. 2.2 — variety of fungi (NCERT p. 8)',
  },
  {
    id: 'dg-cell-wall',
    title: 'Diatoms & silicified walls',
    subject: 'biology',
    chapterId: 'biological-classification',
    pageNumber: 5,
    imageUrl: '/assets/pages/bio-11-classification/p005.jpg',
    caption: 'Diatoms — cell wall of silica (NCERT p. 5)',
  },
  {
    id: 'dg-taxa-hierarchy',
    title: 'Taxonomic hierarchy',
    subject: 'biology',
    chapterId: 'living-world',
    pageNumber: 4,
    imageUrl: '/assets/pages/bio-11-living-world/p004.jpg',
    caption: 'Hierarchy of taxonomic categories (NCERT p. 4)',
  },
  {
    id: 'dg-vernier',
    title: 'Vernier callipers — least count',
    subject: 'physics',
    chapterId: 'units-measurements',
    pageNumber: 6,
    imageUrl: '/assets/pages/phys-11-units/p006.jpg',
    caption: 'Measurement of length instruments (NCERT p. 6)',
  },
];

/* ---------- Exam hubs (sidebar: JEE / NEET / Boards) ---------- */
export interface ExamHubData {
  code: 'jee' | 'neet' | 'boards';
  subjects: Array<'physics' | 'chemistry' | 'biology' | 'mathematics'>;
  pattern: string;
  monthsLeft: string;
  aspirants: string;
  papers: PyqPaper[];
  blurb: string;
}

export const EXAM_HUBS: Record<'jee' | 'neet' | 'boards', ExamHubData> = {
  jee: {
    code: 'jee',
    subjects: ['physics', 'chemistry', 'mathematics'],
    pattern: 'Main · Adv — PCM',
    monthsLeft: '11 months to Main',
    aspirants: '1.2M aspirants',
    papers: PYQ_PAPERS.filter((p) => p.subject !== 'biology'),
    blurb:
      'Physics, Chemistry and Mathematics built from NCERT pages up — pattern drills and chapter mastery tuned to JEE Main & Advanced.',
  },
  neet: {
    code: 'neet',
    subjects: ['physics', 'chemistry', 'biology'],
    pattern: 'UG — PCB',
    monthsLeft: '8 months to NEET',
    aspirants: '2.4M aspirants',
    papers: PYQ_PAPERS,
    blurb:
      'A page-first Biology, Chemistry and Physics path built from the exact NCERT pages NEET draws from, with pattern drills at chapter level.',
  },
  boards: {
    code: 'boards',
    subjects: ['physics', 'chemistry', 'biology', 'mathematics'],
    pattern: 'CBSE · ICSE · State',
    monthsLeft: '6 months to Boards',
    aspirants: 'High-school focused',
    papers: PYQ_PAPERS,
    blurb:
      'Chapter-wise mastery with real NCERT pages, board-pattern questions and quick revision sets — everything your school exams test.',
  },
};

export const examGoalLabel = (goal: ExamGoalCode | null): string => {
  const map: Record<ExamGoalCode, string> = {
    boards: 'Boards',
    jee: 'JEE',
    neet: 'NEET',
    'jee-boards': 'JEE + Boards',
    'neet-boards': 'NEET + Boards',
  };
  return goal ? map[goal] : '—';
};
