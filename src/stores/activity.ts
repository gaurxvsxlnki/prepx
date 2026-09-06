import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SubjectCode } from '../types';
import type { TrackEvent, TrackKind } from '../types/study';
import { uid } from '../lib/utils';
import { seedPersonaActivity } from '../lib/demoSeed';

export interface ActivityInput {
  kind: TrackKind;
  subject: SubjectCode;
  bookId?: string;
  chapterId?: string;
  pageNumber?: number;
  correct?: boolean;
  refId?: string;
  minutes?: number;
  label: string;
}

interface ActivityState {
  events: TrackEvent[];
  seededFor: string | null;
  /** Seeds the demo persona with a realistic (clearly demo) history. */
  ensureSeed(userId: string): void;
  record(input: ActivityInput): TrackEvent;
  clear(): void;
}

export const useActivity = create<ActivityState>()(
  persist(
    (set, get) => ({
      events: [],
      seededFor: null,

      ensureSeed(userId) {
        if (get().seededFor === userId) return;
        const events = userId === 'u_demo_premium' ? seedPersonaActivity() : [];
        set({ events, seededFor: userId });
      },

      record(input) {
        const ev: TrackEvent = {
          id: uid('ev'),
          at: new Date().toISOString(),
          kind: input.kind,
          subject: input.subject,
          bookId: input.bookId,
          chapterId: input.chapterId,
          pageNumber: input.pageNumber,
          correct: input.correct,
          refId: input.refId,
          minutes: input.minutes ?? (input.kind === 'page_view' ? 4 : 1),
          label: input.label,
        };
        set({ events: [...get().events.slice(-2999), ev] });
        return ev;
      },

      clear() {
        set({ events: [], seededFor: null });
      },
    }),
    { name: 'prepx.activity.v1' },
  ),
);
