import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sidebar_collapsed";
const EVENT = "sidebar:collapsed-changed";

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Shared hook for the desktop sidebar collapsed state.
 * Persists to localStorage and stays in sync across components in the same tab
 * via a custom event, and across tabs via the native `storage` event.
 */
export function useSidebarCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState<boolean>(read);

  useEffect(() => {
    const sync = () => setCollapsed(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event(EVENT));
      return next;
    });
  }, []);

  return [collapsed, toggle];
}