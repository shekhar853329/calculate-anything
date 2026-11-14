import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  // Always initialize with `initial` so server (SSR) and client initial render match
  const [value, setValue] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage after component mounts in the browser
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch {
      // Ignore parse error or storage access denied
    }
    setIsHydrated(true);
  }, [key]);

  // Persist to localStorage only after the client has hydrated and value changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write error
    }
  }, [key, value, isHydrated]);

  return [value, setValue] as const;
}
