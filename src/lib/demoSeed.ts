/* Demo-only seed: fabricates a realistic 8-week study history for the
   demo persona so dashboards/analytics can be seen working. Never run
   for real accounts — those start from an empty (honest) state. */

import type { TrackEvent } from '../types/study';
import type { SubjectCode } from '../types';

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const iso = (daysAgo: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(rnd(hour) * 60), 0, 0);
  return d.toISOString();
};

type SeedSubject = { subject: SubjectCode; bookId: string; chapters: Array<{ id: string; rate: number; pages: number }> };

const PLAN: SeedSubject[] = [
  {
    subject: 'biology',
    bookId: 'bio-11',
    chapters: [
      { id: 'living-world', rate: 0.86, pages: 9 },
      { id: 'biological-classification', rate: 0.9, pages: 13 },
    ],
  },
  { subject: 'chemistry', bookId: 'chem-11', chapters: [{ id: 'basic-concepts', rate: 0.8, pages: 28 }] },
  { subject: 'physics', bookId: 'phys-11', chapters: [{ id: 'units-measurements', rate: 0.48, pages: 14 }] },
];

export function seedPersonaActivity(): TrackEvent[] {
  const events: TrackEvent[] = [];
  let n = 1;

  // 56 days back → today. The most recent 12 days are all active (streak).
  for (let day = 55; day >= 0; day--) {
    const active =
      day < 12 ? true : day < 20 ? rnd(day) > 0.3 : rnd(day * 1.7) > 0.55;
    if (!active) continue;

    // page views
    for (const s of PLAN) {
      if (rnd(n++) > 0.75) continue;
      const ch = s.chapters[Math.floor(rnd(n) * s.chapters.length)];
      void rnd(n);
      const page = Math.min(s.chapters.length === 1 ? ch.pages : 1 + Math.floor(rnd(n++) * (ch.pages - 1)), ch.pages);
      events.push({
        id: `se-${n++}`,
        at: iso(day, 8 + Math.floor(rnd(n) * 10)),
        kind: 'page_view',
        subject: s.subject,
        bookId: s.bookId,
        chapterId: ch.id,
        pageNumber: page,
        minutes: 4,
        label: `Read ${ch.id === 'living-world' ? 'The Living World' : ch.id === 'biological-classification' ? 'Biological Classification' : ch.id === 'basic-concepts' ? 'Basic Concepts of Chemistry' : 'Units and Measurements'} — p. ${page}`,
      });
    }

    // question attempts across chapters (subject accuracy emerges from rates)
    const attempts = 16 + Math.floor(rnd(n++) * 12);
    for (let i = 0; i < attempts; i++) {
      const s = (() => {
        const r = rnd(n++);
        return r < 0.5 ? PLAN[0] : r < 0.8 ? PLAN[1] : r < 0.88 ? PLAN[2] : PLAN[0];
      })();
      const ch = s.chapters[Math.floor(rnd(n++) * s.chapters.length)];
      const correct = rnd(n++) < ch.rate;
      const isPyq = rnd(n++) < 0.25;
      events.push({
        id: `se-${n++}`,
        at: iso(day, 16 + Math.floor(rnd(n) * 7)),
        kind: isPyq ? 'pyq' : 'question',
        subject: s.subject,
        bookId: s.bookId,
        chapterId: ch.id,
        correct,
        minutes: isPyq ? 2 : 1,
        label: `${correct ? 'Solved' : 'Missed'} ${isPyq ? 'an exam-pattern' : 'a'} question · ${ch.id}`,
      });
    }

    // a quiz or flashcard burst on alternate days
    if (day % 2 === 0) {
      const s = (() => {
        const r = rnd(n++);
        return r < 0.5 ? PLAN[0] : r < 0.8 ? PLAN[1] : r < 0.88 ? PLAN[2] : PLAN[0];
      })();
      events.push({
        id: `se-${n++}`,
        at: iso(day, 20 + Math.floor(rnd(n) * 2)),
        kind: 'flashcard',
        subject: s.subject,
        minutes: 5,
        label: `Reviewed flashcards · ${s.subject}`,
      });
    }
  }

  // Ensure the "Continue learning" card shows The Living World at p. 7 today.
  events.push({
    id: `se-${n++}`,
    at: new Date().toISOString(),
    kind: 'page_view',
    subject: 'biology',
    bookId: 'bio-11',
    chapterId: 'living-world',
    pageNumber: 7,
    minutes: 6,
    label: 'Read The Living World — p. 7',
  });
  return events;
}
