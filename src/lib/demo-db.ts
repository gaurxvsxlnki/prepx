/* ============================================================
   Local demo backend. Used only when Supabase env vars are absent,
   so every flow (auth, onboarding, profile) is fully navigable in
   preview/demo. Mirrors the real schema's shape 1:1.
   ============================================================ */

import type { AuthUser, Profile } from '../types';
import { DEMO_PERSONA } from '../data/demo';

const DB_KEY = 'prepx.demo.db.v1';
const SESSION_KEY = 'prepx.demo.session.v1';
export const DEMO_OTP = '123456';

export interface DemoAccount {
  id: string;
  email?: string;
  phone?: string;
  password?: string;
  full_name?: string;
  avatar_url?: string | null;
  provider: AuthUser['provider'];
  created_at: string;
}

interface DbShape {
  accounts: DemoAccount[];
}

function readDb(): DbShape {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as DbShape;
  } catch {
    /* ignore */
  }
  return { accounts: [] };
}

function writeDb(db: DbShape): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getSessionUserId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionUserId(id: string | null): void {
  if (id) localStorage.setItem(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

export function findAccount(predicate: (a: DemoAccount) => boolean): DemoAccount | undefined {
  return readDb().accounts.find(predicate);
}

export function getAccount(id: string): DemoAccount | undefined {
  return readDb().accounts.find((a) => a.id === id);
}

export function upsertAccount(account: DemoAccount): void {
  const db = readDb();
  const i = db.accounts.findIndex((a) => a.id === account.id);
  if (i >= 0) db.accounts[i] = account;
  else db.accounts.push(account);
  writeDb(db);
}

export function removeSessionAccount(): void {
  const id = getSessionUserId();
  if (!id) return;
  const db = readDb();
  db.accounts = db.accounts.filter((a) => a.id !== id);
  writeDb(db);
  setSessionUserId(null);
}

/* ---------- Profile mirror (keyed per user) ---------- */
export function profileKey(userId: string): string {
  return `prepx.profile.${userId}`;
}

export function getStoredProfile(userId: string): Profile | null {
  try {
    const raw = localStorage.getItem(profileKey(userId));
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function storeProfile(profile: Profile): void {
  localStorage.setItem(profileKey(profile.user_id), JSON.stringify(profile));
}

export function removeStoredProfile(userId: string): void {
  localStorage.removeItem(profileKey(userId));
}

/* ---------- Fully-onboarded demo persona ---------- */
export function seedDemoPersona(): DemoAccount {
  const existing = findAccount((a) => a.id === DEMO_PERSONA.user_id);
  if (existing) {
    setSessionUserId(existing.id);
    return existing;
  }
  const account: DemoAccount = {
    id: DEMO_PERSONA.user_id,
    email: DEMO_PERSONA.email,
    full_name: DEMO_PERSONA.full_name,
    provider: 'demo',
    created_at: DEMO_PERSONA.created_at,
  };
  upsertAccount(account);
  storeProfile(DEMO_PERSONA);
  setSessionUserId(account.id);
  return account;
}
