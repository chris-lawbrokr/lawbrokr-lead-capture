import { useEffect, useRef } from 'react';
import { BENCHMARKS } from '../../data/sample';
import { prefersReducedMotion } from '../../../lib/motion';
import type { Discovery } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { IconTile } from '../ui/IconTile';
import { Overline } from '../ui/Overline';
import { Spinner } from '../ui/Spinner';

interface FindingsFeedProps {
  progress: number;
  discoveries: readonly Discovery[];
}

/**
 * "What we're finding": a feed of findings that appear as the scan passes each
 * one's threshold. When the card has a fixed height (the two-column layout) the
 * feed scrolls inside it and follows the newest finding.
 */
export function FindingsFeed({ progress, discoveries }: FindingsFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const shown = discoveries.filter((discovery) => progress >= discovery.at);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [shown.length]);

  return (
    <Card className="flex min-h-[120px] flex-1 flex-col gap-3.5 p-5">
      <div className="flex items-center justify-between gap-3">
        <Overline>What we’re finding</Overline>
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.round((progress / 100) * BENCHMARKS.pagesRead)} pages read
        </span>
      </div>

      <div
        ref={listRef}
        aria-live="polite"
        className="-mr-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
      >
        {shown.length === 0 && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Spinner label="Loading" />
            Knocking on your site’s front door…
          </div>
        )}

        {shown.map((discovery) => (
          <div key={discovery.title} className="flex animate-pop items-start gap-3">
            <IconTile icon={discovery.icon} tone="accent" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-pretty text-primary-900">{discovery.title}</span>
                <span className="text-[13px] leading-[19px] text-pretty text-muted-foreground">{discovery.detail}</span>
              </div>
              {discovery.avatars && (
                <div aria-hidden="true" className="flex gap-1.5">
                  {discovery.avatars.map((initials) => (
                    <Avatar key={initials} initials={initials} />
                  ))}
                </div>
              )}
              {discovery.chips && (
                <div className="flex flex-wrap gap-1.5">
                  {discovery.chips.map((chip) => (
                    <Badge key={chip} variant="accent" uppercase={false}>
                      {chip}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
