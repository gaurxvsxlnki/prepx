import { create } from 'zustand';
import type { AuthUser, Profile } from '../types';
import { authMode, supabase } from '../lib/supabase';
import {
  getStoredProfile,
  storeProfile,
} from '../lib/demo-db';

const blank = (user: AuthUser): Profile => ({
  user_id: user.id,
  full_name: user.full_name ?? user.email?.split('@')[0] ?? 'Student',
  email: user.email ?? '',
  phone: user.phone ?? null,
  avatar_url: user.avatar_url ?? null,
  class: null,
  board: null,
  exam_goal: null,
  subjects: [],
  language: 'english',
  onboarded: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

interface ProfileState {
  profile: Profile | null;
  ready: boolean;
  load(user: AuthUser): Promise<void>;
  update(partial: Partial<Profile>): Promise<void>;
  markOnboarded(): Promise<void>;
  reset(): void;
}

async function loadFromSupabase(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase!
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    user_id: data.user_id,
    full_name: data.full_name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? null,
    avatar_url: data.avatar_url ?? null,
    class: data.class ?? null,
    board: data.board ?? null,
    exam_goal: data.exam_goal ?? null,
    subjects: data.subjects ?? [],
    language: data.language ?? null,
    onboarded: data.onboarded ?? false,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

async function persistToSupabase(p: Profile): Promise<void> {
  await supabase!
    .from('profiles')
    .upsert(
      {
        user_id: p.user_id,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone,
        avatar_url: p.avatar_url,
        class: p.class,
        board: p.board,
        exam_goal: p.exam_goal,
        subjects: p.subjects,
        language: p.language,
        onboarded: p.onboarded,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
}

export const useProfile = create<ProfileState>((set, get) => ({
  profile: null,
  ready: false,

  async load(user: AuthUser) {
    let profile: Profile | null = null;

    if (authMode === 'supabase' && supabase) {
      profile = await loadFromSupabase(user.id);
      // First visit: let the DB trigger seed a row; mirror locally too.
      if (!profile) profile = blank(user);
    } else {
      profile = getStoredProfile(user.id) ?? blank(user);
      // Keep demo accounts' sign-in details fresh.
      if (profile.full_name === '' && user.full_name) profile.full_name = user.full_name;
    }

    // Ensure locally cached profile is fresh for fast next-loads.
    storeProfile(profile);
    set({ profile, ready: true });
  },

  async update(partial: Partial<Profile>) {
    const current = get().profile;
    if (!current) return;
    const next: Profile = {
      ...current,
      ...partial,
      updated_at: new Date().toISOString(),
    };
    storeProfile(next);
    set({ profile: next });
    if (authMode === 'supabase' && supabase) {
      await persistToSupabase(next);
    }
  },

  async markOnboarded() {
    const current = get().profile;
    if (!current) return;
    if (!current.onboarded) {
      await get().update({ onboarded: true });
    }
  },

  reset() {
    set({ profile: null, ready: false });
  },
}));
