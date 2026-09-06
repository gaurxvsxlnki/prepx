import { create } from 'zustand';

interface UiState {
  drawerOpen: boolean;
  searchOpen: boolean;
  toast: string | null;
  openDrawer(): void;
  closeDrawer(): void;
  toggleDrawer(): void;
  openSearch(): void;
  closeSearch(): void;
  toggleSearch(): void;
  showToast(message: string): void;
  clearToast(): void;
}

export const useUi = create<UiState>((set) => ({
  drawerOpen: false,
  searchOpen: false,
  toast: null,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  showToast: (message) => set({ toast: message }),
  clearToast: () => set({ toast: null }),
}));

export function useToast(): string | null {
  return useUi((s) => s.toast);
}
