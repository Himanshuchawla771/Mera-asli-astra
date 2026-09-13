import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * High-Performance Debounce & Throttle Engine for StudyMentor AI
 * Minimizes CPU usage, eliminates UI lag, and reduces unnecessary server and API load.
 */

/**
 * Standard Debounce: Delays executing func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

/**
 * Standard Throttle: Enforces that func is executed at most once per limit milliseconds.
 * Uses leading edge by default so user feedback is instantaneous.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastRan = 0;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    lastArgs = args;

    if (!lastRan && options.leading === false) {
      lastRan = now;
    }

    const remaining = limit - (now - lastRan);

    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastRan = now;
      func(...args);
      lastArgs = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        lastRan = options.leading === false ? 0 : Date.now();
        timeout = null;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastRan = 0;
    lastArgs = null;
  };

  return throttled;
}

/**
 * React Hook: useDebounce
 * Returns a debounced version of any state value (e.g. search term, filter string).
 * Ideal for avoiding heavy recalculations or API queries on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React Hook: useDebouncedCallback
 * Memoizes a debounced callback function across re-renders.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
      timerRef.current = null;
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return Object.assign(debounced, { cancel });
}

/**
 * React Hook: useThrottledCallback
 * Memoizes a throttled callback function across re-renders.
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit = 500
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  const lastRunRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  const throttled = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    lastArgsRef.current = args;

    const remaining = limit - (now - lastRunRef.current);

    if (remaining <= 0 || remaining > limit) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastRunRef.current = now;
      callbackRef.current(...args);
      lastArgsRef.current = null;
    } else if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        timerRef.current = null;
        if (lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
          lastArgsRef.current = null;
        }
      }, remaining);
    }
  }, [limit]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastRunRef.current = 0;
    lastArgsRef.current = null;
  }, []);

  return Object.assign(throttled, { cancel });
}

/**
 * Global Action Lock: Prevents accidental double/rapid clicks on buttons
 * (e.g., 'Evaluate Paper', 'Generate Test', 'Send Message').
 * Returns true if the action was successfully locked (i.e. allowed to proceed),
 * or false if it was rejected due to an active cooldown.
 */
const activeActionLocks = new Map<string, number>();

export function acquireActionLock(actionKey: string, cooldownMs = 1500): boolean {
  const now = Date.now();
  const last = activeActionLocks.get(actionKey) || 0;

  if (now - last < cooldownMs) {
    // Action is currently locked to prevent duplicate execution
    return false;
  }

  activeActionLocks.set(actionKey, now);
  return true;
}

/**
 * Wrap an async function with instant Leading-Edge Locking
 * Discards rapid concurrent calls while the operation is pending or within cooldown.
 */
export function withActionLock<T extends (...args: any[]) => Promise<any>>(
  actionKey: string,
  fn: T,
  cooldownMs = 1500
): (...args: Parameters<T>) => Promise<ReturnType<T> | void> {
  let isExecuting = false;

  return async (...args: Parameters<T>) => {
    if (isExecuting) return;
    if (!acquireActionLock(actionKey, cooldownMs)) return;

    try {
      isExecuting = true;
      return await fn(...args);
    } finally {
      isExecuting = false;
    }
  };
}
