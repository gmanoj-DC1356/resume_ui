import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { Size } from './readerMath';

// Tracks an element's inner size so fit-to-width and fit-to-page follow window and layout changes.
export function useElementSize(ref: RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
