/* Onboarding option sets. Driven by class + prior choices so younger
   classes never see irrelevant competitive options. */

import type {
  BoardCode,
  ClassCode,
  ExamGoalCode,
  LanguageCode,
  SubjectCode,
} from '../types';

export interface Option<V extends string> {
  value: V;
  label: string;
  hint?: string;
}

export const CLASS_OPTIONS: Option<ClassCode>[] = [
  { value: '9', label: '9th', hint: 'Foundation year' },
  { value: '10', label: '10th', hint: 'Board year' },
  { value: '11', label: '11th', hint: 'JEE · NEET start' },
  { value: '12', label: '12th', hint: 'Final year' },
];

/** Class-dependent exam-goal options. */
export const EXAM_OPTIONS: Record<'younger' | 'senior', Option<ExamGoalCode>[]> = {
  younger: [
    { value: 'boards', label: 'Boards', hint: 'School exams first' },
    { value: 'jee-boards', label: 'Boards + JEE foundation', hint: 'Start early for JEE' },
    { value: 'neet-boards', label: 'Boards + NEET foundation', hint: 'Start early for NEET' },
  ],
  senior: [
    { value: 'boards', label: 'Boards', hint: 'CBSE / ICSE / State' },
    { value: 'jee', label: 'JEE', hint: 'Main + Advanced' },
    { value: 'neet', label: 'NEET', hint: 'Medical entrance' },
    { value: 'jee-boards', label: 'JEE + Boards', hint: 'Both together' },
    { value: 'neet-boards', label: 'NEET + Boards', hint: 'Both together' },
  ],
};

export function examOptionsFor(klass: ClassCode | null): Option<ExamGoalCode>[] {
  return EXAM_OPTIONS[klass === '11' || klass === '12' ? 'senior' : 'younger'];
}

export const BOARD_OPTIONS: Option<BoardCode>[] = [
  { value: 'cbse', label: 'CBSE', hint: 'Central Board of Secondary Education' },
  { value: 'icse', label: 'ICSE / ISC', hint: 'CISCE board' },
  { value: 'state', label: 'State Board', hint: 'Your state board' },
  { value: 'other', label: 'Other', hint: 'International or other boards' },
];

export const SUBJECT_OPTIONS: Record<ExamGoalCode, SubjectCode[]> = {
  boards: ['physics', 'chemistry', 'biology', 'mathematics', 'english'],
  jee: ['physics', 'chemistry', 'mathematics'],
  neet: ['physics', 'chemistry', 'biology'],
  'jee-boards': ['physics', 'chemistry', 'mathematics', 'english'],
  'neet-boards': ['physics', 'chemistry', 'biology', 'english'],
};

export const LANGUAGE_OPTIONS: Option<LanguageCode>[] = [
  { value: 'english', label: 'English', hint: 'Full English' },
  { value: 'hinglish', label: 'Hinglish', hint: 'Hindi + English mix' },
  { value: 'hindi', label: 'Hindi', hint: 'Full Hindi' },
];

export const MAX_SUBJECTS = 4;
