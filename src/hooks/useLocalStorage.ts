"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage on mount (client only)
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // Ignore parse errors, use default
    }
    setHydrated(true);
  }, [key]);

  // Persist to localStorage on change (skip initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore quota errors
    }
  }, [key, storedValue, hydrated]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) =>
        typeof value === "function" ? (value as (prev: T) => T)(prev) : value,
      );
    },
    [],
  );

  return [storedValue, setValue];
}
