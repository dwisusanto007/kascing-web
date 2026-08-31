"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "loading" | "success" | "error";

interface AsyncDataResult<T> {
  status: Status;
  data: T | null;
  error: Error | null;
  isSlow: boolean;
  retry: () => void;
}

interface InternalState<T> {
  key: string;
  status: Status;
  data: T | null;
  error: Error | null;
  isSlow: boolean;
}

/**
 * Simulates a network fetch for mock data, with debug query params so QA can
 * deliberately trigger edge cases without a real backend:
 *  - ?debugError=1  forces the loader to fail (tests error boundary/retry)
 *  - ?debugSlow=1   forces a long delay (tests the ">4s masih memuat" notice)
 */
export function useAsyncData<T>(loader: () => T, deps: unknown[]): AsyncDataResult<T> {
  const searchParams = useSearchParams();
  const debugSlow = searchParams.get("debugSlow") === "1";
  const debugError = searchParams.get("debugError") === "1";
  const [attempt, setAttempt] = useState(0);

  const key = JSON.stringify([deps, debugSlow, debugError, attempt]);

  // Latest-ref pattern: always holds the current loader without needing it
  // in the effect's dependency array (the loader is a fresh closure every render).
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [state, setState] = useState<InternalState<T>>(() => ({
    key,
    status: "loading",
    data: null,
    error: null,
    isSlow: false,
  }));

  // Reset synchronously during render when the inputs change, instead of in an
  // Effect — the pattern React recommends for "state that resets when inputs change".
  if (state.key !== key) {
    setState({ key, status: "loading", data: null, error: null, isSlow: false });
  }

  useEffect(() => {
    let cancelled = false;

    const slowTimer = setTimeout(() => {
      if (!cancelled) {
        setState((s) => (s.key === key ? { ...s, isSlow: true } : s));
      }
    }, 4000);

    const delay = debugSlow ? 6000 : 300 + Math.random() * 500;
    const timer = setTimeout(() => {
      if (cancelled) return;
      clearTimeout(slowTimer);
      if (debugError) {
        setState((s) =>
          s.key === key
            ? { ...s, status: "error", error: new Error("Simulated error: gagal memuat data dari server.") }
            : s,
        );
        return;
      }
      try {
        const result = loaderRef.current();
        setState((s) => (s.key === key ? { ...s, status: "success", data: result } : s));
      } catch (e) {
        setState((s) =>
          s.key === key ? { ...s, status: "error", error: e instanceof Error ? e : new Error("Terjadi kesalahan.") } : s,
        );
      }
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(slowTimer);
    };
  }, [key, debugSlow, debugError]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { status: state.status, data: state.data, error: state.error, isSlow: state.isSlow, retry };
}
