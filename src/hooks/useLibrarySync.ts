/**
 * Library sync state for the main panel (Sync button + status line).
 *
 * A sync started with the button runs in module scope, not in the
 * component: closing the Quick Access panel unmounts the plugin, but the
 * sync keeps going and a reopened panel picks its progress up again (and
 * can't start a second one on top of it). Syncs started elsewhere (the
 * automatic startup sync) are followed by polling the backend while the
 * panel is mounted.
 */

import { useEffect, useRef, useState } from 'react';
import { call } from '@decky/api';
import { syncLibraryProgressive } from '../lib/syncUtils';
import { notify } from '../lib/notifications';
import { translate } from '../i18n';

const POLL_IDLE_MS = 2000;
const POLL_SYNCING_MS = 500;

// --- manual sync, shared by every mounted panel -------------------------

interface ManualSyncState {
  running: boolean;
  message: string | null;
  /** Bumped on every progress tick so mounted panels can refresh lists. */
  tick: number;
}

let manual: ManualSyncState = { running: false, message: null, tick: 0 };
let clearMessageTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function setManual(patch: Partial<ManualSyncState>) {
  manual = { ...manual, ...patch };
  listeners.forEach((listener) => listener());
}

function showManualMessage(message: string, clearAfterMs?: number) {
  if (clearMessageTimer) clearTimeout(clearMessageTimer);
  clearMessageTimer = clearAfterMs
    ? setTimeout(() => {
        clearMessageTimer = null;
        setManual({ message: null });
      }, clearAfterMs)
    : null;
  setManual({ message });
}

async function startManualSync(): Promise<void> {
  if (manual.running) return;
  setManual({ running: true });
  showManualMessage(translate('sync.starting'));
  try {
    const result = await syncLibraryProgressive((current, total) => {
      const refresh = current % 10 === 0 || current === total;
      showManualMessage(translate('sync.progress', { current, total }));
      if (refresh) setManual({ tick: manual.tick + 1 });
    });
    if (!result.success) {
      throw new Error(result.error || 'Unknown');
    }
    const newTagsSuffix = result.new_tags ? translate('sync.completeNewTags', { count: result.new_tags }) : '';
    const msg = translate('sync.completeDetailed', { synced: result.synced ?? 0, newTags: newTagsSuffix });
    showManualMessage(msg, 10000);
    // Started from the plugin UI, so always report back (even with
    // notifications Off) - the panel may be closed by the time it ends.
    notify('manual', msg);
  } catch (err: any) {
    const msg = translate('sync.error', { error: err?.message || 'Unknown' });
    showManualMessage(msg, 15000);
    notify('manual', msg);
  } finally {
    setManual({ running: false, tick: manual.tick + 1 });
  }
}

// --- hook ---------------------------------------------------------------

export function useLibrarySync(onProgressUpdate?: () => void) {
  const [manualState, setManualState] = useState<ManualSyncState>(manual);
  // Progress of a sync this panel didn't start (startup auto-sync)
  const [backendSyncing, setBackendSyncing] = useState(false);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const onUpdateRef = useRef(onProgressUpdate);
  onUpdateRef.current = onProgressUpdate;

  useEffect(() => {
    const listener = () => setManualState(manual);
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Refresh the tag lists while a manual sync runs and when it ends
  useEffect(() => {
    if (manualState.tick > 0) onUpdateRef.current?.();
  }, [manualState.tick]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let wasSyncing = false;
    let lastTotal = 0;
    let clearTimer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      let syncing = wasSyncing;
      if (!manual.running) {
        try {
          const res = await call<[], { success: boolean; syncing: boolean; current: number; total: number }>('get_sync_progress');
          if (cancelled) return;
          if (res.success && res.syncing) {
            syncing = true;
            lastTotal = res.total;
            if (clearTimer) clearTimeout(clearTimer);
            setBackendSyncing(true);
            setBackendMessage(translate('sync.progress', { current: res.current, total: res.total }));
          } else if (res.success && wasSyncing) {
            syncing = false;
            setBackendSyncing(false);
            onUpdateRef.current?.();
            // The backend resets total to 0 at the end, so use the last one seen
            if (lastTotal > 0) {
              setBackendMessage(translate('sync.complete'));
              clearTimer = setTimeout(() => setBackendMessage(null), 5000);
            } else {
              setBackendMessage(null);
            }
          }
        } catch (err) {
          // backend not ready - try again next tick
        }
      } else if (wasSyncing) {
        // Our own sync took over the status line
        syncing = false;
        setBackendSyncing(false);
        setBackendMessage(null);
      }
      wasSyncing = syncing;
      if (!cancelled) timer = setTimeout(poll, syncing ? POLL_SYNCING_MS : POLL_IDLE_MS);
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, []);

  return {
    syncing: manualState.running || backendSyncing,
    message: manualState.running || manualState.message ? manualState.message : backendMessage,
    syncLibrary: startManualSync,
  };
}
