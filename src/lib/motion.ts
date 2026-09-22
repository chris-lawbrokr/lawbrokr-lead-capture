/**
 * True when the visitor has asked for reduced motion. CSS already flattens the
 * animations; this is for the JavaScript side — timers and FLIP measurements
 * that would otherwise still run their full course.
 */
export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
