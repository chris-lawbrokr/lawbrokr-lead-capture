import { Check } from 'lucide-react';
import { CHECKS } from '../../data/checks';
import { cn } from '../../../lib/cn';
import { Card } from '../ui/Card';
import { IconTile } from '../ui/IconTile';
import { Spinner } from '../ui/Spinner';

/** Each check owns an equal share of the progress bar. */
const SHARE = 100 / CHECKS.length;

/**
 * The five checks as a list that ticks itself off. The active row is tinted and
 * narrates its current sub-step; finished rows get a check, queued ones stay grey.
 * From the two-column layout up, the rows stretch to fill the card's height.
 */
export function ScanChecklist({ progress }: { progress: number }) {
  return (
    <Card as="ol" className="flex flex-col overflow-hidden">
      {CHECKS.map((check, index) => {
        const from = index * SHARE;
        const done = progress >= from + SHARE;
        const active = !done && progress >= from;
        const stepIndex = Math.min(check.steps.length - 1, Math.floor(((progress - from) / SHARE) * check.steps.length));
        const detail = done ? 'Done' : active ? `${check.steps[stepIndex]}…` : 'Queued';

        return (
          <li
            key={check.key}
            className={cn(
              'flex flex-1 items-center gap-3.5 px-4 py-3 transition-colors duration-[180ms] ease-out',
              index > 0 && 'border-t border-border',
              active ? 'bg-primary-50' : 'bg-card',
            )}
          >
            <IconTile icon={check.icon} tone={done || active ? 'primary' : 'muted'} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span
                className={cn('text-sm font-semibold', done || active ? 'text-primary-900' : 'text-muted-foreground')}
              >
                {check.title}
              </span>
              <span className="truncate text-[13px] text-muted-foreground">{detail}</span>
            </div>
            {active && <Spinner label="Scanning" />}
            {done && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
            )}
          </li>
        );
      })}
    </Card>
  );
}
