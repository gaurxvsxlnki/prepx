/* ============================================================
   PrepX shared domain types.
   Content graph:  Class → Board/Exam → Subject → Book → Chapter → Page
   ============================================================ */

/* ---------- Identity ---------- */
export type ClassCode = '9' | '10' | '11' | '12';
export type BoardCode = 'cbse' | 'icse' | 'state' | 'other';
export type ExamCode = 'boards' | 'jee' | 'neet';
export type ExamGoalCode =
  | 'boards'
  | 'jee'
  | 'neet'
  | 'jee-boards'
  | 'neet-boards';
export type LanguageCode = 'english' | 'hindi' | 'hinglish';
export type SubjectCode =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'mathematics'
  | 'english'
  | 'hindi'
  | 'accounts'
  | 'economics'
  | 'business'
  | 'geography'
  | 'history'
  | 'political'
  | 'sociology'
  | 'psychology'
  | 'physical-education'
  | 'computer'
  | 'informatics'
  | 'honeydew'
  | 'beehive'
  | 'first-flight'
  | 'footprints'
  | 'kshitiz'
  | 'kritika'
  | 'sanskrit'
  | 'it'
  | 'computer-science'
  | 'informatics-practices'
  | 'aipmt'
  | 'jeemain'
  | 'jeeadvanced'
  | 'cbse'
  | 'icse'
  | 'state'
  | 'kshitij'
  | 'seba'
  | 'mathematics-instruction';

export interface Profile {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  class: ClassCode | null;
  board: BoardCode | null;
  exam_goal: ExamGoalCode | null;
  subjects: SubjectCode[];
  language: LanguageCode | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  provider: 'google' | 'phone' | 'email' | 'demo';
}

export interface SessionState {
  user: AuthUser | null;
  status: 'loading' | 'authed' | 'anon';
}

/* ---------- Content graph ---------- */
export interface ClassLevel {
  code: ClassCode;
  label: string; // "11"
  name: string; // "Class 11"
  blurb: string;
}

export interface Board {
  code: BoardCode;
  name: string;
  short: string;
}

export interface Exam {
  code: ExamCode;
  name: string; // 'JEE', 'NEET', 'Boards'
  full: string;
  blurb: string;
}

export interface Subject {
  code: SubjectCode;
  name: string;
  color: string; // hex used for accents/dots
  soft: string; // rgba wash
}

export interface BookPageAsset {
  /** Absolute or app-relative URL of the REAL page image. */
  url: string | null;
  source: 'ncert' | 'upload';
  mime: 'image/jpeg' | 'image/png';
}

export interface BookPage {
  /** 1-based position of the page inside the chapter. */
  number: number;
  /** Real NCERT page-image asset (null when not yet imported). */
  asset: BookPageAsset | null;
  /** Page number as printed on the actual textbook page. */
  printedNumber: number;
}

export interface Chapter {
  id: string;
  bookId: string;
  position: number;
  title: string;
  description: string;
  topics: string[];
  /** Total real pages in this chapter (from the source PDF). */
  pageCount: number;
  pages: BookPage[];
  ncertPdf?: string; // official source PDF reference
  available: boolean; // real page assets imported?
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  subject: SubjectCode;
  klass: ClassCode;
  board: BoardCode;
  publisher: string;
  description: string;
  chapters: Chapter[];
  coverAccent: string; // hex
  ncertCode?: string;
}

export interface ContinueLearning {
  bookId: string;
  chapterId: string;
  pageNumber: number; // current 1-based page
  progressPct: number;
}

/* ---------- Content that belongs to pages ---------- */
export type QuestionKind = 'mcq' | 'assertion' | 'short' | 'pyq' | 'diagram';
export type QuestionSource = 'ncert' | 'exemplar' | 'pyq' | 'board' | 'prepx';

export interface Question {
  id: string;
  chapterId: string;
  pageNumber: number; // page this question is attached to
  kind: QuestionKind;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  source: QuestionSource;
  sourceLabel?: string; // e.g. 'NEET 2023 · Q42' | 'NCERT Exemplar'
  year?: number;
}

/* ---------- Demo / derived ---------- */
export type ActivityKind =
  | 'page'
  | 'pyq'
  | 'quiz'
  | 'flashcard'
  | 'diagram'
  | 'bookmark'
  | 'streak';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  meta: string;
  timeAgo: string;
}

export interface Recommendation {
  id: string;
  reason: string;
  title: string;
  subtitle: string;
  kind: ActivityKind;
  href: string;
  cta: string;
}

export interface StudyStat {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
}

export interface SubjectProgress {
  subject: SubjectCode;
  pct: number;
  chaptersDone: number;
  chaptersTotal: number;
  minutesThisWeek: number;
}

export interface BookmarkItem {
  id: string;
  kind: 'page' | 'question' | 'pyq' | 'flashcard' | 'diagram' | 'chapter';
  title: string;
  subtitle: string;
  href: string;
  addedAt: string; // ISO
}

export interface QuizSet {
  id: string;
  title: string;
  subject: SubjectCode;
  questions: number;
  minutes: number;
  status: 'new' | 'attempted' | 'perfect';
  bestScore?: number;
  href: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: SubjectCode;
  cards: number;
  due: number;
  mastered: number;
  chapterId?: string;
}

export interface DiagramItem {
  id: string;
  title: string;
  subject: SubjectCode;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
  caption: string;
}

export interface PyqPaper {
  id: string;
  title: string;
  sourceLabel: string;
  subject: SubjectCode;
  year: number;
  questions: number;
  minutes: number;
  status: 'new' | 'attempted';
  score?: string;
}
