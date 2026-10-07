import { COUNT_UP_MS } from '../../config';
import { useCountUp } from '../../hooks/useCountUp';
import type { AuditReport } from '../../types';
import { ScoreRing } from '../ScoreRing';
import { Badge } from '../ui/Badge';

/**
 * The report's shape, blurred behind the gate: the ring counting up to the
 * score, the band, and a tile per category. Enough to show there's a result
 * worth unlocking without giving it away. Hidden from assistive tech, since
 * none of it is meant to be read yet.
 */
export function ScorePreview({ report }: { report: AuditReport }) {
  const shown = useCountUp(report.overall, COUNT_UP_MS);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex flex-col items-center gap-5 blur-[4px] select-none [grid-area:1/1]"
    >
      <ScoreRing value={shown} className="size-[190px]">
        <span className="font-display text-[64px] leading-none font-semibold text-primary-900 tabular-nums blur-[5px]">
          {shown}
        </span>
        <span className="mt-1 text-[13px] text-muted-foreground">out of 100</span>
      </ScoreRing>
      <Badge variant={report.band.variant}>{report.band.label}</Badge>
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        {report.categories.map(({ key, icon: Icon, title, metric, score }) => (
          <div key={key} className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-primary-900">
              <Icon className="size-4" />
              <span className="text-[13px] font-semibold">{title}</span>
            </div>
            <span className="font-display text-[28px] leading-none font-semibold text-primary-900">{metric}</span>
            <div className="h-2 overflow-hidden rounded-[2px] bg-neutral-100">
              <div className="h-full rounded-[2px] bg-chart-1" style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
