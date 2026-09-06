import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookmarkItem } from '../types';
import { uid } from '../lib/utils';

interface BookmarksState {
  items: BookmarkItem[];
  toggle(item: Omit<BookmarkItem, 'id' | 'addedAt'>): void;
  remove(id: string): void;
  isBookmarked(key: string): boolean;
  clearAll(): void;
}

const keyOf = (item: Omit<BookmarkItem, 'id' | 'addedAt'>) => `${item.kind}:${item.href}`;

export const useBookmarks = create<BookmarksState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle(item) {
        const existing = get().items.find((i) => keyOf(i) === keyOf(item));
        if (existing) {
          set({ items: get().items.filter((i) => i.id !== existing.id) });
        } else {
          set({
            items: [
              {
                ...item,
                id: uid('bm'),
                addedAt: new Date().toISOString(),
              },
              ...get().items,
            ],
          });
        }
      },
      remove(id) {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isBookmarked(key) {
        return get().items.some(
          (i) => `${i.kind}:${i.href}` === key || i.href === key,
        );
      },
      clearAll() {
        set({ items: [] });
      },
    }),
    { name: 'prepx.bookmarks.v1' },
  ),
);

export function bookmarkKey(kind: string, href: string): string {
  return `${kind}:${href}`;
}
