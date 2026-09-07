/* ============================================================
   Academic content graph — Phase 1 demo catalogue.
   Class → Board/Exam → Subject → Book → Chapter → Page → Page image

   Phase 2 note: pages/assets here will be served from the
   `books/chapters/book_pages/page_assets` tables. This module
   mirrors that schema 1:1, so swapping the data source later does
   not touch any UI component.
   ============================================================ */

import type {
  Board,
  Book,
  BookPage,
  Chapter,
  ClassCode,
  ClassLevel,
  Exam,
  Subject,
  SubjectCode,
} from '../types';

const asset = (code: string, n: number) =>
  `/assets/pages/${code}/p${String(n).padStart(3, '0')}.jpg`;

const jpg = (url: string | null) =>
  url ? { url, source: 'ncert' as const, mime: 'image/jpeg' as const } : null;

/** Build the page list of a chapter from its real NCERT page renders. */
function pagesFor(code: string, count: number): BookPage[] {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    printedNumber: i + 1,
    asset: jpg(asset(code, i + 1)),
  }));
}

/** Chapters whose real page images arrive in Phase 2 keep their structure
 *  (pageCount from the source NCERT text) but expose no assets yet. */
function emptyPages(count: number): BookPage[] {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    printedNumber: i + 1,
    asset: null,
  }));
}

/* ---------- Classes · Boards · Exams · Subjects ---------- */
export const CLASSES: ClassLevel[] = [
  { code: '9', label: '9th', name: 'Class 9', blurb: 'CBSE · ICSE · State Boards' },
  { code: '10', label: '10th', name: 'Class 10', blurb: 'CBSE · ICSE · State Boards' },
  { code: '11', label: '11th', name: 'Class 11', blurb: 'Boards · JEE · NEET' },
  { code: '12', label: '12th', name: 'Class 12', blurb: 'Boards · JEE · NEET' },
];

export const BOARDS: Board[] = [
  { code: 'cbse', name: 'CBSE', short: 'CBSE' },
  { code: 'icse', name: 'ICSE / ISC', short: 'ICSE' },
  { code: 'state', name: 'State Board', short: 'State' },
  { code: 'other', name: 'Other / International', short: 'Other' },
];

export const EXAMS: Exam[] = [
  {
    code: 'boards',
    name: 'Boards',
    full: 'School & Board Exams',
    blurb: 'Chapter-wise mastery aligned to your board syllabus.',
  },
  {
    code: 'jee',
    name: 'JEE',
    full: 'JEE Main & Advanced',
    blurb: 'Physics · Chemistry · Mathematics, tuned to JEE patterns.',
  },
  {
    code: 'neet',
    name: 'NEET',
    full: 'NEET (UG)',
    blurb: 'Physics · Chemistry · Biology, tuned to NEET patterns.',
  },
];

export const SUBJECTS: Subject[] = [
  { code: 'physics', name: 'Physics', color: '#6ea8fe', soft: 'rgba(110,168,254,0.16)' },
  { code: 'chemistry', name: 'Chemistry', color: '#f0a860', soft: 'rgba(240,168,96,0.16)' },
  { code: 'biology', name: 'Biology', color: '#3fd489', soft: 'rgba(63,212,137,0.16)' },
  { code: 'mathematics', name: 'Mathematics', color: '#c084fc', soft: 'rgba(192,132,252,0.16)' },
  { code: 'english', name: 'English', color: '#fb92b0', soft: 'rgba(251,146,176,0.16)' },
  { code: 'hindi', name: 'Hindi', color: '#fbbf24', soft: 'rgba(251,191,36,0.16)' },
  { code: 'accounts', name: 'Accountancy', color: '#f9739b', soft: 'rgba(249,115,155,0.12)' },
  { code: 'economics', name: 'Economics', color: '#facc15', soft: 'rgba(250,204,21,0.12)' },
  { code: 'business', name: 'Business Studies', color: '#38bdf8', soft: 'rgba(56,189,248,0.12)' },
  { code: 'computer', name: 'Computer Science', color: '#22d3ee', soft: 'rgba(34,211,238,0.12)' },
  { code: 'informatics', name: 'Informatics Practices', color: '#34d399', soft: 'rgba(52,211,153,0.12)' },
  { code: 'honeydew', name: 'English (Honeydew)', color: '#93c5fd', soft: 'rgba(147,197,253,0.12)' },
  { code: 'beehive', name: 'English (Beehive)', color: '#c4b5fd', soft: 'rgba(196,181,253,0.12)' },
  { code: 'first-flight', name: 'English (First Flight)', color: '#f9a8d4', soft: 'rgba(249,168,212,0.12)' },
  { code: 'footprints', name: 'English (Footprints)', color: '#fde68a', soft: 'rgba(253,230,138,0.12)' },
  { code: 'kshitiz', name: 'Hindi (Kshitij)', color: '#fef08a', soft: 'rgba(254,240,138,0.12)' },
  { code: 'kritika', name: 'Hindi (Kritika)', color: '#fed7aa', soft: 'rgba(254,215,170,0.12)' },
  { code: 'sanskrit', name: 'Sanskrit (Shashwati)', color: '#a7f3d0', soft: 'rgba(167,243,208,0.12)' },
  { code: 'seba', name: 'Assam SEBA', color: '#f59e0b', soft: 'rgba(245,158,11,0.12)' },
  { code: 'mathematics-instruction', name: 'Mathematics (Instruction)', color: '#c4b5fd', soft: 'rgba(196,181,253,0.12)' },
  { code: 'geography', name: 'Geography', color: '#6ee7b7', soft: 'rgba(110,231,183,0.10)' },
  { code: 'history', name: 'History', color: '#fca5a5', soft: 'rgba(252,165,165,0.10)' },
  { code: 'political', name: 'Political Science', color: '#fc8181', soft: 'rgba(252,129,129,0.10)' },
  { code: 'sociology', name: 'Sociology', color: '#fecaca', soft: 'rgba(254,202,202,0.10)' },
  { code: 'psychology', name: 'Psychology', color: '#fcd34d', soft: 'rgba(252,211,77,0.10)' },
  { code: 'physical-education', name: 'Physical Education', color: '#86efac', soft: 'rgba(134,239,172,0.10)' },
  { code: 'it', name: 'Information Technology', color: '#67e8f9', soft: 'rgba(103,232,249,0.10)' },
  { code: 'computer-science', name: 'Computer Science (Python)', color: '#38bdf8', soft: 'rgba(56,189,248,0.10)' },
  { code: 'informatics-practices', name: 'Informatics Practices', color: '#4ade80', soft: 'rgba(74,222,128,0.10)' },
  { code: 'aipmt', name: 'NEET (AIPMT)', color: '#a78bfa', soft: 'rgba(167,139,250,0.10)' },
  { code: 'jeemain', name: 'JEE Main', color: '#c084fc', soft: 'rgba(192,132,252,0.10)' },
  { code: 'jeeadvanced', name: 'JEE Advanced', color: '#e879f9', soft: 'rgba(232,121,249,0.10)' },
  { code: 'cbse', name: 'CBSE Board', color: '#f472b6', soft: 'rgba(244,114,182,0.10)' },
  { code: 'icse', name: 'ICSE Board', color: '#fda4af', soft: 'rgba(253,164,175,0.10)' },
  { code: 'state', name: 'State Board', color: '#6ee7b7', soft: 'rgba(110,231,183,0.10)' },
];

export const subjectOf = (code: SubjectCode): Subject =>
  SUBJECTS.find((s) => s.code === code) ?? SUBJECTS[0];

export const boardOf = (code: string): Board =>
  BOARDS.find((b) => b.code === code) ?? BOARDS[0];

export const classOf = (code: ClassCode): ClassLevel =>
  CLASSES.find((c) => c.code === code) ?? CLASSES[0];

/* ---------- Books ---------- */
export const BOOKS: Book[] = [
  {
    id: 'bio-11',
    title: 'Biology',
    subtitle: 'NCERT Textbook · Class 11',
    subject: 'biology',
    klass: '11',
    board: 'cbse',
    publisher: 'NCERT',
    ncertCode: 'kebo1',
    coverAccent: '#2f9e6d',
    description:
      'The complete NCERT Biology text for Class 11 — every page is the real printed page, with questions attached to the exact content you are reading.',
    chapters: [
      {
        id: 'living-world',
        bookId: 'bio-11',
        position: 1,
        title: 'The Living World',
        description:
          'Diversity in the living world, taxonomy, nomenclature, classification and the tools that bring order to biodiversity.',
        topics: ['Diversity', 'Nomenclature', 'Taxonomy', 'Systematics'],
        pageCount: 9,
        pages: pagesFor('bio-11-living-world', 9),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kebo101.pdf',
        available: true,
      },
      {
        id: 'biological-classification',
        bookId: 'bio-11',
        position: 2,
        title: 'Biological Classification',
        description:
          'Kingdom systems from two to five kingdoms — Monera, Protista, Fungi, Plantae and Animalia.',
        topics: ['Five Kingdom', 'Monera', 'Fungi', 'Viruses'],
        pageCount: 13,
        pages: pagesFor('bio-11-classification', 13),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kebo102.pdf',
        available: true,
      },
      {
        id: 'plant-kingdom',
        bookId: 'bio-11',
        position: 3,
        title: 'Plant Kingdom',
        description:
          'Algae, bryophytes, pteridophytes, gymnosperms and angiosperms — life cycles and classification.',
        topics: ['Algae', 'Bryophytes', 'Pteridophytes', 'Gymnosperms'],
        pageCount: 30,
        pages: emptyPages(30),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kebo103.pdf',
        available: false,
      },
      {
        id: 'animal-kingdom',
        bookId: 'bio-11',
        position: 4,
        title: 'Animal Kingdom',
        description:
          'Basis of classification and the hierarchy from Porifera to Chordata.',
        topics: ['Porifera', 'Coelenterata', 'Arthropoda', 'Chordata'],
        pageCount: 28,
        pages: emptyPages(28),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kebo104.pdf',
        available: false,
      },
    ],
  },
  {
    id: 'chem-11',
    title: 'Chemistry',
    subtitle: 'NCERT Textbook · Class 11',
    subject: 'chemistry',
    klass: '11',
    board: 'cbse',
    publisher: 'NCERT',
    ncertCode: 'kech1',
    coverAccent: '#c97f3b',
    description:
      'The complete NCERT Chemistry text for Class 11 with real page images and page-attached practice.',
    chapters: [
      {
        id: 'basic-concepts',
        bookId: 'chem-11',
        position: 1,
        title: 'Some Basic Concepts of Chemistry',
        description:
          'Matter, laws of chemical combination, mole concept, stoichiometry and concentration terms.',
        topics: ['Mole concept', 'Stoichiometry', 'Molarity'],
        pageCount: 28,
        pages: pagesFor('chem-11-basic-concepts', 28),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kech101.pdf',
        available: true,
      },
      {
        id: 'structure-of-atom',
        bookId: 'chem-11',
        position: 2,
        title: 'Structure of Atom',
        description:
          'Sub-atomic particles, atomic models, quantum numbers and electronic configuration.',
        topics: ['Bohr model', 'Quantum numbers', 'Aufbau'],
        pageCount: 32,
        pages: emptyPages(32),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kech102.pdf',
        available: false,
      },
      {
        id: 'periodic-properties',
        bookId: 'chem-11',
        position: 3,
        title: 'Classification of Elements & Periodicity',
        description:
          'Modern periodic law, trends in atomic radius, ionisation enthalpy and electronegativity.',
        topics: ['Periodic table', 'Trends'],
        pageCount: 30,
        pages: emptyPages(30),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/kech103.pdf',
        available: false,
      },
    ],
  },
  {
    id: 'phys-11',
    title: 'Physics',
    subtitle: 'NCERT Textbook · Class 11',
    subject: 'physics',
    klass: '11',
    board: 'cbse',
    publisher: 'NCERT',
    ncertCode: 'keph1',
    coverAccent: '#3d6fb3',
    description:
      'The complete NCERT Physics text for Class 11 with real page images and page-attached practice.',
    chapters: [
      {
        id: 'units-measurements',
        bookId: 'phys-11',
        position: 2,
        title: 'Units and Measurements',
        description:
          'The international system of units, dimensions, significant figures and error analysis.',
        topics: ['SI units', 'Dimensions', 'Errors'],
        pageCount: 14,
        pages: pagesFor('phys-11-units', 14),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
        available: true,
      },
      {
        id: 'physical-world',
        bookId: 'phys-11',
        position: 1,
        title: 'Physical World',
        description:
          'What physics is — scope, fundamental forces and the scientific method.',
        topics: ['Forces', 'Scientific method'],
        pageCount: 8,
        pages: emptyPages(8),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/keph101.pdf',
        available: false,
      },
      {
        id: 'motion-straight-line',
        bookId: 'phys-11',
        position: 3,
        title: 'Motion in a Straight Line',
        description:
          'Position, velocity and acceleration — kinematics in one dimension.',
        topics: ['Kinematics', 'Velocity', 'Graphs'],
        pageCount: 24,
        pages: emptyPages(24),
        ncertPdf: 'https://ncert.nic.in/textbook/pdf/keph103.pdf',
        available: false,
      },
    ],
  },
];

/* ---------- Lookups ---------- */
export function getBook(bookId: string): Book | undefined {
  return BOOKS.find((b) => b.id === bookId);
}

export function getChapter(
  bookId: string,
  chapterId: string,
): Chapter | undefined {
  return getBook(bookId)?.chapters.find((c) => c.id === chapterId);
}

export function booksForClass(klass: ClassCode): Book[] {
  return BOOKS.filter((b) => b.klass === klass);
}

export function booksForExamSubjects(subjects: SubjectCode[]): Book[] {
  return BOOKS.filter((b) => subjects.includes(b.subject));
}

/** Chapter whose pages are fully imported for the demo reader. */
export const READY_CHAPTERS: Chapter[] = BOOKS.flatMap((b) =>
  b.chapters.filter((c) => c.available && c.pages.length > 0),
);
