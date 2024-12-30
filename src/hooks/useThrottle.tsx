import { useEffect, useMemo, useRef } from 'react';

function useThrottle(fn: () => void, delay: number): () => void {
  const lastExecuted = useRef(0); // Always called
  const savedFn = useRef(fn);    // Always called

  useEffect(() => {
    savedFn.current = fn; // Keep the latest version of `fn`
  }, [fn]);

  const throttledFn = useMemo(() => {
    return () => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        savedFn.current();
      }
    };
  }, [delay]);

  return throttledFn;
}

export default useThrottle;