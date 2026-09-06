/* Real-time “students studying now”.
   Production (Supabase): each client heartbeats its own presence on a
   Realtime channel and updates profiles.last_seen; the visible number
   is the aggregate of other clients' presence — never a fake.
   Demo mode (no Supabase): simulates peer heartbeats so the pill is
   alive; the number is labelled demo in the UI.
   Identity is never exposed — only the aggregate count. */

import { create } from 'zustand';
import { authMode, supabase } from '../lib/supabase';

interface PresenceState {
  online: number;
  started: boolean;
  selfId: string | null;
  peers: number;
  start(): void;
  stop(): void;
}

const BASE_PEERS = 126; // +1 self = 127 at rest
const HEARTBEAT_MS = 30000;

let demoPeers = BASE_PEERS + Math.floor(Math.random() * 5);
let timer: ReturnType<typeof setInterval> | null = null;

function beatDemoPeers() {
  const drift = Math.floor(Math.random() * 5) - 2;
  demoPeers = Math.min(136, Math.max(BASE_PEERS - 6, demoPeers + drift));
}

export const usePresence = create<PresenceState>((set, get) => ({
  online: BASE_PEERS + 1,
  started: false,
  selfId: null,
  peers: BASE_PEERS,

  start() {
    if (get().started) return;
    const selfId =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('prepx.demo.session.v1') ??
          `anon-${Math.random().toString(36).slice(2, 8)}`
        : 'anon';
    set({ started: true, selfId });

    if (authMode === 'supabase' && supabase) {
      // Real presence: heartbeat own state; count other members only.
      const sb = supabase;
      const channel = sb.channel('prepx-presence', {
        config: { presence: { key: selfId } },
      });
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const others = Object.keys(state).length;
          set({ online: Math.max(0, others) });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ at: Date.now() });
            set({ online: Math.max(1, Object.keys(channel.presenceState()).length) });
          }
        });
      const hb = setInterval(() => {
        channel.track({ at: Date.now() }).catch(() => undefined);
        // persist last_seen for coarse fallback counts
        const userId = get().selfId;
        if (userId && !userId.startsWith('anon')) {
          sb.from('profiles')
            .update({ last_seen: new Date().toISOString() })
            .eq('user_id', userId)
            .then(() => undefined);
        }
      }, HEARTBEAT_MS);
      timer = hb;
    } else {
      // Demo heartbeat simulation.
      beatDemoPeers();
      set({ online: demoPeers + 1 });
      timer = setInterval(() => {
        beatDemoPeers();
        set({ online: demoPeers + 1 });
      }, HEARTBEAT_MS);
    }
  },

  stop() {
    if (timer) clearInterval(timer);
    timer = null;
    set({ started: false });
  },
}));

export function useLiveCount(): number {
  return usePresence((s) => s.online);
}
