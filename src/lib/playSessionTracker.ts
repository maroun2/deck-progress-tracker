/**
 * Play Session Tracker
 *
 * Steam's own `minutes_playtime_forever` (read via appStore.GetAppOverviewByAppID)
 * doesn't update reliably for non-Steam shortcuts. As a fallback, this tracks
 * real session start/stop times via SteamClient's native game lifetime
 * notifications - a stable global API, not fragile module-scanning - and
 * reports elapsed session time to the backend, which only applies it for
 * non-Steam appids (regular Steam games already have reliable playtime).
 */
import { call } from '@decky/api';

interface AppLifetimeNotification {
  unAppID: number;
  nInstanceID: string;
  bRunning: boolean;
}

const sessionStarts = new Map<number, number>();

function handleAppLifetimeNotification(data: AppLifetimeNotification) {
  if (data.bRunning) {
    sessionStarts.set(data.unAppID, Date.now());
    return;
  }

  const startedAt = sessionStarts.get(data.unAppID);
  sessionStarts.delete(data.unAppID);
  if (!startedAt) {
    return;
  }

  const seconds = Math.round((Date.now() - startedAt) / 1000);
  if (seconds <= 0) {
    return;
  }

  call<[{ appid: string; seconds: number }], { success: boolean }>(
    'record_play_session',
    { appid: String(data.unAppID), seconds }
  ).catch(() => {
    // Best-effort: a missed session just means this game's tracked
    // playtime undercounts until the next successful session.
  });
}

/**
 * Starts listening for game start/stop events. Returns a cleanup function
 * (or null if the SteamClient API isn't available), to call on unmount.
 */
export function startPlaySessionTracking(): (() => void) | null {
  try {
    const steamClient = (window as any).SteamClient;
    const registration = steamClient?.GameSessions?.RegisterForAppLifetimeNotifications?.(
      handleAppLifetimeNotification
    );

    if (!registration) {
      return null;
    }

    return () => {
      try {
        registration.unregister?.();
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  } catch (e) {
    return null;
  }
}
