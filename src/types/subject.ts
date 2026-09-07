/* ============================================================
   PrepX subject registry — declarative table of every subject
   PrepX supports, including CBSE Class 9-12 syllabus subjects,
   elective/Humanities subjects, and NCERT English/Hindi/Sanskrit
   textbook labels.

   Kept separate from the chart-colour SUBJECTS array in
   `src/data/content.ts` (which only lists the core academic
   subjects rendered on the dashboard). Consumers that need the
   full registry import from here. Phase 3 content modules import
   the typed names from here so chapter entries cannot drift from
   the supported set.
   ============================================================ */

import type { SubjectCode } from './index';

/** Human-readable name for every subject code in scope. */
export const SUBJECT_NAMES: Readonly<Record<SubjectCode, string>> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  mathematics: 'Mathematics',
  science: 'Science',
  english: 'English',
  hindi: 'Hindi',
  accounts: 'Accountancy',
  economics: 'Economics',
  business: 'Business Studies',
  geography: 'Geography',
  history: 'History',
  political: 'Political Science',
  sociology: 'Sociology',
  psychology: 'Psychology',
  'physical-education': 'Physical Education',
  computer: 'Computer Science',
  informatics: 'Informatics Practices',
  honeydew: 'English (Honeydew)',
  beehive: 'English (Beehive)',
  'first-flight': 'English (First Flight)',
  footprints: 'English (Footprints Without Feet)',
  kshitiz: 'Hindi (Kshitij)',
  kritika: 'Hindi (Kritika)',
  sanskrit: 'Sanskrit (Shashwati)',
  it: 'Information Technology',
  'computer-science': 'Computer Science (Python)',
  'informatics-practices': 'Informatics Practices',
  aipmt: 'NEET (AIPMT)',
  jeemain: 'JEE Main',
  jeeadvanced: 'JEE Advanced',
  cbse: 'CBSE (Board)',
  icse: 'ICSE (Board)',
  state: 'State Board',
  kshitij: 'Hindi (Kshitij)',
  seba: 'Assam SEBA',
  'mathematics-instruction': 'Mathematics (Instruction)',
};

/** Subject code → canonical NCERT / CBSE book label, where one exists. */
export const SUBJECT_NCERT_LABEL: Readonly<Record<SubjectCode, string | null>> = {
  physics: 'NCERT Physics',
  chemistry: 'NCERT Chemistry',
  biology: 'NCERT Biology',
  mathematics: 'NCERT Mathematics',
  science: 'NCERT Science',
  english: 'NCERT English',
  hindi: 'NCERT Hindi',
  accounts: 'NCERT Accountancy',
  economics: 'NCERT Economics',
  business: 'NCERT Business Studies',
  geography: 'NCERT Geography',
  history: 'NCERT History',
  political: 'NCERT Political Science',
  sociology: 'NCERT Sociology',
  psychology: 'NCERT Psychology',
  'physical-education': 'NCERT Physical Education',
  computer: 'NCERT Computer Science',
  informatics: 'NCERT Informatics Practices',
  honeydew: 'NCERT Honeydew (Class 12)',
  beehive: 'NCERT Beehive (Class 10)',
  'first-flight': 'NCERT First Flight (Class 10)',
  footprints: 'NCERT Footprints Without Feet (Class 10)',
  kshitiz: 'NCERT Kshitij (Class 11 Hindi)',
  kritika: 'NCERT Kritika (Class 11 Hindi)',
  sanskrit: 'NCERT Shashwati (Class 9 Sanskrit)',
  it: 'NCERT Information Technology',
  'computer-science': 'NCERT Computer Science (Python)',
  'informatics-practices': 'NCERT Informatics Practices',
  aipmt: 'NEET (AIPMT) Paper',
  jeemain: 'JEE Main Paper',
  jeeadvanced: 'JEE Advanced Paper',
  cbse: 'CBSE Board Paper',
  icse: 'ICSE Board Paper',
  state: 'State Board Paper',
  kshitij: 'NCERT Kshitij',
  seba: 'Assam SEBA',
  'mathematics-instruction': 'Mathematics (Instruction)',
};

/** Every subject code currently in scope. */
export const ALL_SUBJECT_CODES = Object.keys(SUBJECT_NAMES) as SubjectCode[];

export function isStandardSubject(code: string): code is SubjectCode {
  return code in SUBJECT_NAMES;
}

export function subjectName(code: SubjectCode): string {
  return SUBJECT_NAMES[code] ?? code;
}

export function subjectLabel(code: SubjectCode): string {
  return SUBJECT_NCERT_LABEL[code] ?? code;
}