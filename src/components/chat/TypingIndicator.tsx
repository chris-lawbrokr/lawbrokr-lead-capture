import { cn } from '../../lib/cn';

interface TypingIndicatorProps {
  /**
   * Drop the bubble and centre the dots. Used by the opening prompt, where
   * there is no transcript for a bubble to line up with yet — so the dots grow
   * and the gap opens up to carry the weight the bubble used to.
   */
  bare?: boolean;
}

/**
 * Fades in like every other line. It is the first thing to appear on an AI turn,
 * so without it the whole response reads as popping in, however carefully the
 * bubble that follows fades.
 */
export function TypingIndicator({ bare = false }: TypingIndicatorProps) {
  const dot = cn('animate-bounce-dot rounded-full bg-primary', bare ? 'size-2' : 'size-1.5');

  return (
    <div className={cn('flex animate-fade-in', bare ? 'justify-center' : 'mb-3 justify-start')}>
      <div
        role="status"
        aria-label="Lawbrokr is typing"
        className={cn(
          'inline-flex items-center',
          bare ? 'gap-1.5' : 'gap-1 rounded-lg rounded-tl-none border border-border bg-muted px-4 py-4',
        )}
      >
        <span className={dot} />
        <span className={cn(dot, '[animation-delay:0.18s]')} />
        <span className={cn(dot, '[animation-delay:0.36s]')} />
      </div>
    </div>
  );
}
