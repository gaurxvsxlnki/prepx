/* Supabase bootstrap. When VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are
   not provided the app runs in local demo mode (no secrets in frontend). */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith('http'),
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // handled on /auth/callback
      },
    })
  : null;

export const authMode: 'supabase' | 'demo' = supabase ? 'supabase' : 'demo';
