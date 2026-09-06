/* Auth service — thin, backend-agnostic facade.
   supabase mode → Supabase Auth; demo mode → local emulation. */
import type { AuthUser } from '../types';
import { authMode, supabase } from './supabase';
import {
  DEMO_OTP,
  findAccount,
  getAccount,
  getSessionUserId,
  removeSessionAccount,
  seedDemoPersona,
  setSessionUserId,
  upsertAccount,
  type DemoAccount,
} from './demo-db';

export interface SignupResult {
  needsEmailConfirm: boolean;
}

function toAuthUser(a: {
  id: string;
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  provider: AuthUser['provider'];
}): AuthUser {
  return {
    id: a.id,
    email: a.email ?? null,
    phone: a.phone ?? null,
    full_name: a.full_name ?? null,
    avatar_url: a.avatar_url ?? null,
    provider: a.provider,
  };
}

/* ---------------- Supabase-backed ---------------- */
async function sbGetSession(): Promise<AuthUser | null> {
  const { data } = await supabase!.auth.getSession();
  const s = data.session?.user;
  if (!s) return null;
  return toAuthUser({
    id: s.id,
    email: s.email,
    phone: s.phone,
    full_name: (s.user_metadata?.full_name as string) ?? s.email,
    avatar_url: (s.user_metadata?.avatar_url as string) ?? s.user_metadata?.picture,
    provider: (s.app_metadata?.provider as AuthUser['provider']) ?? 'email',
  });
}

/* ---------------- Demo-backed ---------------- */
function demoGetSession(): AuthUser | null {
  const id = getSessionUserId();
  if (!id) return null;
  const a = getAccount(id);
  if (!a) {
    setSessionUserId(null);
    return null;
  }
  return toAuthUser(a);
}

function demoSignInGoogle(): AuthUser {
  // Simulates a Google OAuth handshake with minimum profile scope.
  let a = findAccount((x) => x.provider === 'google');
  if (!a) {
    a = {
      id: `u_google_${Math.random().toString(36).slice(2, 10)}`,
      email: 'gaurav.sharma@gmail.com',
      full_name: 'Gaurav Sharma',
      provider: 'google',
      created_at: new Date().toISOString(),
    };
    upsertAccount(a);
  }
  setSessionUserId(a.id);
  return toAuthUser(a);
}

function demoSignUpEmail(email: string, password: string, fullName: string): AuthUser {
  const existing = findAccount((x) => x.email === email);
  if (existing) {
    if (existing.provider === 'email' && existing.password) {
      throw new Error('An account with this email already exists. Please sign in.');
    }
    throw new Error('This email is already linked to another sign-in method.');
  }
  const a: DemoAccount = {
    id: `u_email_${Math.random().toString(36).slice(2, 10)}`,
    email,
    password, // demo only — never store plaintext in production
    full_name: fullName || email.split('@')[0],
    provider: 'email',
    created_at: new Date().toISOString(),
  };
  upsertAccount(a);
  setSessionUserId(a.id);
  return toAuthUser(a);
}

/* ---------------- Public facade ---------------- */
export const authBackend = {
  mode: authMode,

  async getSession(): Promise<AuthUser | null> {
    return authMode === 'supabase' ? sbGetSession() : demoGetSession();
  },

  async signInGoogle(): Promise<AuthUser | null> {
    if (authMode === 'supabase') {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Minimum profile scope — no email/contact permissions requested.
          scopes: '',
          queryParams: { access_type: 'online', prompt: 'select_account' },
        },
      });
      if (error) throw error;
      return null; // full-page redirect in progress
    }
    return demoSignInGoogle();
  },

  async signInDemoPersona(): Promise<AuthUser> {
    const a = seedDemoPersona();
    return toAuthUser(a);
  },

  async sendOtp(phone: string): Promise<{ sent: boolean }> {
    if (authMode === 'supabase') {
      const { error } = await supabase!.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      return { sent: true };
    }
    // Demo mode: OTP is fixed (shown in the UI) so the loop is testable.
    return { sent: true };
  },

  async verifyOtp(phone: string, code: string): Promise<AuthUser> {
    if (authMode === 'supabase') {
      const { data, error } = await supabase!.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms',
      });
      if (error) throw error;
      if (!data.user) throw new Error('Could not verify code.');
      return toAuthUser({
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
        full_name: data.user.user_metadata?.full_name as string | undefined,
        provider: 'phone',
      });
    }
    if (code !== DEMO_OTP) throw new Error('Incorrect code. Demo OTP is 123456.');
    let a = findAccount((x) => x.phone === phone);
    if (!a) {
      a = {
        id: `u_phone_${Math.random().toString(36).slice(2, 10)}`,
        phone,
        full_name: 'Student',
        provider: 'phone',
        created_at: new Date().toISOString(),
      };
      upsertAccount(a);
    }
    setSessionUserId(a.id);
    return toAuthUser(a);
  },

  async signUpEmail(email: string, password: string, fullName: string): Promise<SignupResult> {
    if (authMode === 'supabase') {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      const sessionCreated = Boolean(data.session);
      return { needsEmailConfirm: !sessionCreated };
    }
    demoSignUpEmail(email, password, fullName);
    return { needsEmailConfirm: false };
  },

  async signInEmail(email: string, password: string): Promise<AuthUser> {
    if (authMode === 'supabase') {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        throw new Error(
          error.message.includes('Invalid login') ? 'Incorrect email or password.' : error.message,
        );
      }
      const u = data.user;
      return toAuthUser({
        id: u.id,
        email: u.email,
        full_name: (u.user_metadata?.full_name as string) ?? u.email,
        avatar_url: u.user_metadata?.avatar_url as string | undefined,
        provider: 'email',
      });
    }
    const a = findAccount((x) => x.email === email && x.provider === 'email');
    if (!a || a.password !== password) {
      throw new Error('Incorrect email or password.');
    }
    setSessionUserId(a.id);
    return toAuthUser(a);
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (authMode === 'supabase') {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    }
    // Demo: no e-mail is sent; the reset page explains this.
  },

  async updatePassword(newPassword: string): Promise<void> {
    if (authMode === 'supabase') {
      const { error } = await supabase!.auth.updateUser({ password: newPassword });
      if (error) throw error;
    }
  },

  async signOut(): Promise<void> {
    if (authMode === 'supabase') {
      await supabase!.auth.signOut();
      return;
    }
    removeSessionAccount();
  },

  async exchangeAuthCode(): Promise<AuthUser | null> {
    if (authMode === 'supabase') {
      const { data, error } = await supabase!.auth.exchangeCodeForSession(
        window.location.href,
      );
      if (error) throw error;
      const s = data.user;
      if (!s) return null;
      return toAuthUser({
        id: s.id,
        email: s.email,
        full_name: (s.user_metadata?.full_name as string) ?? s.email,
        avatar_url: s.user_metadata?.avatar_url as string | undefined,
        provider: (s.app_metadata?.provider as AuthUser['provider']) ?? 'email',
      });
    }
    return demoGetSession();
  },
};
