import { cn } from '../../lib/cn';

interface ProgressProps {
  value: number;
  max: number;
  label: string;
  className?: string;
}

/**
 * Determinate progress. Primary bar on a muted track, radius-full (the one
 * shape besides avatar and switch that is allowed to be fully round), 300ms
 * width per the motion scale.
 */
export function Progress({ value, max, label, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('h-1 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-[300ms] ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
