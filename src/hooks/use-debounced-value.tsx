import { useEffect, useState } from 'react';

// Returns `value` once it has stopped changing for `delayMs`. Useful when a value feeds a query arg,
// where every distinct intermediate value would otherwise be its own request and cache entry.
const useDebouncedValue = <T,>(value: T, delayMs: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);

    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
};

export default useDebouncedValue;
