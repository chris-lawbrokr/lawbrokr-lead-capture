import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

/**
 * Counts from zero up to `target` over `duration`, easing out (cubic) so it
 * slows into the final number. With reduced motion it starts at the target.
 */
export function useCountUp(target: number, duration: number): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
