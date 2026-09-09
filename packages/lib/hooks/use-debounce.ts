import { useCallback, useEffect, useRef, useState } from "react";

/* =========================
 * useDebounce (generic)
 * ========================= */

type UseDebounceOptions<T> = {
  enabled?: boolean;
  isEqual?: (a: T, b: T) => boolean;
};

type UseDebounceReturn<T> = {
  debounced: T;
  isDebouncing: boolean;
  flush: () => void;
  cancel: () => void;
};

export function useDebounce<T>(
  value: T,
  delayMs: number,
  { enabled = true, isEqual }: UseDebounceOptions<T> = {},
): UseDebounceReturn<T> {
  const [debounced, setDebounced] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestValueRef = useRef<T>(value);

  const eq = useCallback(
    (a: T, b: T) => {
      if (isEqual) {
        return isEqual(a, b);
      }
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch {
        return Object.is(a, b);
      }
    },
    [isEqual],
  );

  // keep latest value in a ref
  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsDebouncing(false);
  }, []);

  const flush = useCallback(() => {
    cancel();
    setDebounced(latestValueRef.current);
  }, [cancel]);

  useEffect(() => {
    if (!enabled) {
      // pass-through when disabled
      cancel();
      if (!eq(debounced, value)) {
        setDebounced(value);
      }
      return;
    }

    // If effectively equal, do nothing.
    if (eq(value, debounced)) {
      return;
    }

    cancel();
    setIsDebouncing(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIsDebouncing(false);
      setDebounced(latestValueRef.current);
    }, delayMs);

    return cancel;
  }, [value, delayMs, enabled, debounced, eq, cancel]);

  // cleanup on unmount
  useEffect(() => () => cancel(), [cancel]);

  return { debounced, isDebouncing, flush, cancel };
}
