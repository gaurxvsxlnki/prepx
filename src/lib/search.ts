/* Global search across the study catalogue.
   Demo mode scans the local datasets; in production these same shapes
   are served by `ilike` queries over the content tables. */

import { BOOKS, subjectOf } from '../data/content';
import { QUESTION_BANK } from '../data/questions';
import { FLASHCARDS } from '../data/flashcards';
import { DIAGRAMS } from '../data/diagrams';
import type { SubjectCode } from '../types';

export interface SearchHit {
  id: string;
  kind: 'book' | 'chapter' | 'question' | 'pyq' | 'flashcard' | 'diagram';
  title: string;
  meta: string;
  href: string;
  demo?: boolean;
}

export interface SearchResults {
  chapters: SearchHit[];
  questions: SearchHit[];
  pyqs: SearchHit[];
  flashcards: SearchHit[];
  diagrams: SearchHit[];
  count: number;
}

const normalize = (s: string) => s.toLowerCase();

export function searchStudy(raw: string, limit = 6): SearchResults {
  const q = normalize(raw.trim());
  const chapters: SearchHit[] = [];
  const questions: SearchHit[] = [];
  const pyqs: SearchHit[] = [];
  const flashcards: SearchHit[] = [];
  const diagrams: SearchHit[] = [];

  if (q.length < 2) return { chapters, questions, pyqs, flashcards, diagrams, count: 0 };

  for (const b of BOOKS) {
    for (const c of b.chapters) {
      const hay = normalize(`${c.title} ${c.description} ${c.topics.join(' ')} ${b.title}`);
      if (hay.includes(q)) {
        chapters.push({
          id: c.id,
          kind: 'chapter',
          title: c.title,
          meta: `${b.title} · Class ${b.klass} · ${c.pageCount} pages`,
          href: `/books/${b.id}/chapter/${c.id}`,
          demo: !c.available,
        });
      }
    }
  }

  for (const x of QUESTION_BANK) {
    const hay = normalize(x.text + ' ' + x.topic);
    if (!hay.includes(q)) continue;
    const s = x.section === 'pyq' ? pyqs : questions;
    const subjLabel = x.subject ? subjectOf(x.subject).name : 'Chapter practice';
    s.push({
      id: x.id,
      kind: x.section === 'pyq' ? 'pyq' : 'question',
      title: x.text.slice(0, 110) + (x.text.length > 110 ? '…' : ''),
      meta: `${subjLabel} · ${x.topic} · ${x.difficulty}`,
      href: pyqHref(x),
      demo: x.isDemo,
    });
  }

  for (const f of FLASHCARDS) {
    if (
      !normalize(f.front + ' ' + f.back + ' ' + f.tag).includes(q)
    ) continue;
    flashcards.push({
      id: f.id,
      kind: 'flashcard',
      title: f.front,
      meta: `${subjectOf(f.subject).name} · ${f.tag}`,
      href: `/flashcards/study?deck=${f.deckId}`,
      demo: f.isDemo,
    });
  }

  for (const d of DIAGRAMS) {
    if (!normalize(d.title + ' ' + d.caption).includes(q)) continue;
    diagrams.push({
      id: d.id,
      kind: 'diagram',
      title: d.title,
      meta: `${subjectOf(d.subject).name} · page ${d.pageNumber}`,
      href: `/diagrams`,
      demo: d.isDemo,
    });
  }

  const count =
    chapters.length + questions.length + pyqs.length + flashcards.length + diagrams.length;

  return {
    chapters: chapters.slice(0, limit),
    questions: questions.slice(0, limit),
    pyqs: pyqs.slice(0, limit),
    flashcards: flashcards.slice(0, limit),
    diagrams: diagrams.slice(0, limit),
    count,
  };
}

function pyqHref(x: { chapterId: string }): string {
  return x.chapterId ? '/pyqs' : '/pyqs';
}

export function subjectName(code: SubjectCode): string {
  return subjectOf(code).name;
}
