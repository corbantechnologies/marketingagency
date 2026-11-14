"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "ljk:dismissible-change";

function read(key: string, alsoSession: boolean): boolean {
  if (typeof window === "undefined" || !key) return false;
  try {
    if (window.localStorage.getItem(key) === "true") return true;
    if (alsoSession && window.sessionStorage.getItem(key) === "true") return true;
  } catch {
    // Storage can be blocked (private mode); treat as not dismissed.
  }
  return false;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * A "dismissed" flag remembered in localStorage (and optionally sessionStorage).
 * Reads storage without setState-in-effect, and renders "not dismissed" on the server.
 */
export function useDismissible(key: string, options: { alsoSession?: boolean } = {}) {
  const alsoSession = Boolean(options.alsoSession);
  const dismissed = useSyncExternalStore(
    subscribe,
    () => read(key, alsoSession),
    () => false
  );

  const dismiss = useCallback(() => {
    if (typeof window === "undefined" || !key) return;
    try {
      window.localStorage.setItem(key, "true");
      if (alsoSession) window.sessionStorage.setItem(key, "true");
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(EVENT));
  }, [key, alsoSession]);

  const restore = useCallback(() => {
    if (typeof window === "undefined" || !key) return;
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(EVENT));
  }, [key]);

  return [dismissed, dismiss, restore] as const;
}
