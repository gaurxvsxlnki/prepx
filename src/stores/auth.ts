import { create } from 'zustand';
import type { AuthUser } from '../types';
import { authBackend } from '../lib/auth';
import { authMode, supabase } from '../lib/supabase';
import type { SignupResult } from '../lib/auth';

export interface AuthState {
  user: AuthUser | null;
  status: 'loading' | 'authed' | 'anon';
  error: string | null;

  init(): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signInDemoPersona(): Promise<void>;
  sendOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, code: string): Promise<void>;
  signUp(email: string, password: string, fullName: string): Promise<SignupResult>;
  signIn(email: string, password: string): Promise<void>;
  requestReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  exchangeAuthCode(): Promise<void>;
  signOut(): Promise<void>;
  clearError(): void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  error: null,

  async init() {
    try {
      const user = await authBackend.getSession();
      set({ user, status: user ? 'authed' : 'anon', error: null });

      // Keep auth state global in real Supabase mode (external sign-outs,
      // token refresh) — demo mode re-reads local storage.
      if (authMode === 'supabase' && supabase) {
        supabase.auth.onAuthStateChange((_event, session) => {
          const u = session?.user;
          if (!u) {
            set({ user: null, status: 'anon' });
            return;
          }
          set({
            user: {
              id: u.id,
              email: u.email ?? null,
              phone: u.phone ?? null,
              full_name: (u.user_metadata?.full_name as string) ?? u.email ?? 'Student',
              avatar_url: (u.user_metadata?.avatar_url as string) ?? null,
              provider: 'email',
            },
            status: 'authed',
          });
        });
      }
    } catch (err) {
      console.error('auth init failed', err);
      set({ user: null, status: 'anon' });
    }
  },

  async signInWithGoogle() {
    set({ error: null });
    try {
      const user = await authBackend.signInGoogle();
      if (user) set({ user, status: 'authed' });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async signInDemoPersona() {
    set({ error: null });
    try {
      const user = await authBackend.signInDemoPersona();
      set({ user, status: 'authed' });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async sendOtp(phone: string) {
    set({ error: null });
    try {
      await authBackend.sendOtp(phone);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async verifyOtp(phone: string, code: string) {
    set({ error: null });
    try {
      const user = await authBackend.verifyOtp(phone, code);
      set({ user, status: 'authed' });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async signUp(email: string, password: string, fullName: string) {
    set({ error: null });
    const result = await authBackend.signUpEmail(email, password, fullName);
    if (authMode === 'demo') {
      const user = await authBackend.getSession();
      if (user) set({ user, status: 'authed' });
    }
    return result;
  },

  async signIn(email: string, password: string) {
    set({ error: null });
    try {
      const user = await authBackend.signInEmail(email, password);
      set({ user, status: 'authed' });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async requestReset(email: string) {
    set({ error: null });
    try {
      await authBackend.requestPasswordReset(email);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async updatePassword(password: string) {
    set({ error: null });
    try {
      await authBackend.updatePassword(password);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async exchangeAuthCode() {
    set({ error: null });
    try {
      const user = await authBackend.exchangeAuthCode();
      if (user) set({ user, status: 'authed' });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  async signOut() {
    await authBackend.signOut();
    set({ user: null, status: 'anon' });
  },

  clearError() {
    set({ error: null });
  },
}));

/** Convenience for guards while auth is resolving. */
export function useSession(): { user: AuthUser | null; authed: boolean; loading: boolean } {
  const { user, status } = useAuth();
  return { user, authed: status === 'authed', loading: status === 'loading' };
}
