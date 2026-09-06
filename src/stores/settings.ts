import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePref = 'dark' | 'light' | 'system';
export type AccentPref = 'violet' | 'indigo' | 'sky' | 'emerald' | 'rose';
export type FontScalePref = 'sm' | 'md' | 'lg';
export type DensityPref = 'comfortable' | 'compact';
export type MotionPref = 'full' | 'reduced' | 'off';

export interface SettingsState {
  theme: ThemePref;
  accent: AccentPref;
  fontScale: FontScalePref;
  density: DensityPref;
  motion: MotionPref;
  sidebarCollapsed: boolean;
  dailyGoalMinutes: number;
  reminderTime: string | null;
  notifications: {
    dailyReminder: boolean;
    streakAlerts: boolean;
    weeklyReport: boolean;
    productUpdates: boolean;
  };
  set<K extends keyof SettingsState>(key: K, value: SettingsState[K]): void;
  setNotifications<K extends keyof SettingsState['notifications']>(
    key: K,
    value: SettingsState['notifications'][K],
  ): void;
  resetAll(): void;
}

export const ACCENTS: AccentPref[] = ['violet', 'indigo', 'sky', 'emerald', 'rose'];

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accent: 'violet',
      fontScale: 'md',
      density: 'comfortable',
      motion: 'full',
      sidebarCollapsed: false,
      dailyGoalMinutes: 60,
      reminderTime: '20:00',
      notifications: {
        dailyReminder: true,
        streakAlerts: true,
        weeklyReport: false,
        productUpdates: false,
      },
      set(key, value) {
        set({ [key]: value } as Partial<SettingsState>);
      },
      setNotifications(key, value) {
        set((s) => ({
          notifications: { ...s.notifications, [key]: value },
        }));
      },
      resetAll() {
        set({
          theme: 'dark',
          accent: 'violet',
          fontScale: 'md',
          density: 'comfortable',
          motion: 'full',
          sidebarCollapsed: false,
          dailyGoalMinutes: 60,
          reminderTime: '20:00',
          notifications: {
            dailyReminder: true,
            streakAlerts: true,
            weeklyReport: false,
            productUpdates: false,
          },
        });
      },
    }),
    { name: 'prepx.settings.v1' },
  ),
);
