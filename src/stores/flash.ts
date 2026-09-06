import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardRating } from '../types/study';

/** Simple spaced-review state per card. Levels map to intervals:
 *  again=0 · hard=1 · good=2 · easy=3  → next review after [0,1,2,4,8] days */
export interface CardState {
  level: number;
  reviews: number;
  last: string; // ISO
}

const INTERVAL_DAYS = [0, 1, 2, 4, 8];

interface FlashState {
  cards: Record<string, CardState>;
  review(cardId: string, rating: CardRating): void;
  reset(): void;
}

export const useFlash = create<FlashState>()(
  persist(
    (set, get) => ({
      cards: {},

      review(cardId, rating) {
        const prev = get().cards[cardId];
        const base = rating === 'again' ? -1 : rating === 'hard' ? 0 : rating === 'good' ? 1 : 2;
        const level = Math.max(0, Math.min(4, (prev?.level ?? -1) + base + 1));
        set({
          cards: {
            ...get().cards,
            [cardId]: {
              level,
              reviews: (prev?.reviews ?? 0) + 1,
              last: new Date().toISOString(),
            },
          },
        });
      },

      reset() {
        set({ cards: {} });
      },
    }),
    { name: 'prepx.flash.v1' },
  ),
);

export function isDue(cardState: CardState | undefined): boolean {
  if (!cardState) return true;
  const interval = INTERVAL_DAYS[cardState.level] ?? 8;
  if (interval === 0) return true;
  const dueAt = new Date(cardState.last).getTime() + interval * 864e5;
  return Date.now() >= dueAt;
}

export function mastered(cardState: CardState | undefined): boolean {
  return Boolean(cardState && cardState.level >= 3);
}
