import { useEffect, useId } from 'react';
import { Check } from 'lucide-react';
import { CHECKS } from '../../data/checks';
import { cn } from '../../../lib/cn';
import { prefersReducedMotion } from '../../../lib/motion';
import { Card } from '../ui/Card';
import { IconTile } from '../ui/IconTile';
import { Spinner } from '../ui/Spinner';

/** Each check owns an equal share of the progress bar. */
const SHARE = 100 / CHECKS.length;

/**
 * The five checks as a list that ticks itself off. The active row is tinted and
 * narrates its current sub-step; finished rows get a check, queued ones stay grey.
 * The card is shorter than the five rows, so the list scrolls, and it follows
 * the active row down as the scan moves on.
 */
export function ScanChecklist({ progress, className }: { progress: number; className?: string }) {
  const listId = useId();
  const activeIndex = Math.min(CHECKS.length - 1, Math.floor(progress / SHARE));
  const finished = progress >= 100;

  // Bring the check being worked on into view by scrolling the list alone,
  // never the page (which scrollIntoView would also move). Rows measure from
  // the list, which is what `relative` on it is for. It runs again when the
  // scan finishes: on a phone the "See my score" button takes height from
  // this card then, which can push the last row back out of view.
  useEffect(() => {
    const list = document.getElementById(listId);
    const row = list?.children[activeIndex];
    if (!list || !(row instanceof HTMLElement)) return;
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    const bottom = row.offsetTop + row.offsetHeight;
    if (bottom > list.scrollTop + list.clientHeight) list.scrollTo({ top: bottom - list.clientHeight, behavior });
    else if (row.offsetTop < list.scrollTop) list.scrollTo({ top: row.offsetTop, behavior });
  }, [listId, activeIndex, finished]);

  return (
    <Card as="ol" id={listId} className={cn('relative flex flex-col overflow-y-auto overscroll-contain', className)}>
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
