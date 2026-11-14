/**
 * Library sync state shared by the main panel (status line) and the
 * settings page (Sync button). Polls the backend so a sync started from
 * anywhere (startup auto-sync, the other view) is reflected.
 */

import { useEffect, useRef, useState } from 'react';
import { call, toaster } from '@decky/api';
import { syncLibraryProgressive } from '../lib/syncUtils';
import { useTranslation } from '../i18n';

export function useLibrarySync(onProgressUpdate?: () => void) {
  const { t } = useTranslation();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Set while a sync started from this view is running - its own
  // completion message wins over the poller's generic one.
  const localSyncRef = useRef(false);
  const onUpdateRef = useRef(onProgressUpdate);
  onUpdateRef.current = onProgressUpdate;
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTransient = (msg: string, ms: number) => {
    setMessage(msg);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setMessage(null), ms);
  };

  useEffect(() => () => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
  }, []);

  useEffect(() => {
    const pollSync = async () => {
      if (localSyncRef.current) return;
      try {
        const res = await call<[], { success: boolean; syncing: boolean; current: number; total: number }>('get_sync_progress');
        if (res.success && res.syncing) {
          setMessage(t('settings.syncingProgress', { current: res.current, total: res.total }));
          setSyncing(true);
        } else if (res.success && !res.syncing && syncing) {
          setSyncing(false);
          onUpdateRef.current?.();
          if (res.total && res.total > 0) {
            showTransient(t('settings.syncComplete'), 5000);
          } else {
            setMessage(null);
          }
        }
      } catch (err) {}
    };
    const interval = setInterval(pollSync, syncing ? 500 : 2000);
    return () => clearInterval(interval);
  }, [syncing]);

  const syncLibrary = async () => {
    localSyncRef.current = true;
    try {
      setSyncing(true);
      setMessage(t('settings.syncStarting'));

      const result = await syncLibraryProgressive((current, total) => {
        setMessage(t('settings.syncingProgress', { current, total }));
        if (current % 10 === 0 || current === total) {
          onUpdateRef.current?.();
        }
      });

      onUpdateRef.current?.();
      const newTagsSuffix = result.new_tags
        ? t('settings.syncCompleteNewTags', { count: result.new_tags })
        : '';
      const msg = t('settings.syncCompleteDetailed', { synced: result.synced ?? 0, newTags: newTagsSuffix });
      showTransient(msg, 10000);
      toaster.toast({ title: 'Deck Progress Tracker', body: msg, duration: 5000 });
    } catch (err: any) {
      setMessage(t('settings.syncError', { error: err?.message || 'Unknown' }));
    } finally {
      localSyncRef.current = false;
      setSyncing(false);
    }
  };

  return { syncing, message, syncLibrary };
}
