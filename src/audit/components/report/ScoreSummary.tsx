import type { AuditReport, CategoryReport } from '../../types';
import { ScoreRing } from '../ScoreRing';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Overline } from '../ui/Overline';

interface ScoreSummaryProps {
  report: AuditReport;
  priorities: readonly CategoryReport[];
  /** How the score compared with the visitor's guess, or '' if they didn't guess. */
  guess: string;
}

/** The overall score beside the three fixes that matter most. */
export function ScoreSummary({ report, priorities, guess }: ScoreSummaryProps) {
  return (
    <Card
      as="section"
      aria-label="Overall score"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-8 p-7"
    >
      <div className="flex flex-wrap items-center gap-6">
        <ScoreRing value={report.overall} className="size-[140px]">
          <span className="font-display text-[44px] leading-none font-semibold text-primary-900 tabular-nums">
            {report.overall}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">out of 100</span>
        </ScoreRing>
        <div className="flex flex-[1_1_180px] flex-col items-start gap-2.5">
          <Badge variant={report.band.variant}>{report.band.label}</Badge>
          <p className="font-display text-xl leading-[26px] font-semibold text-pretty text-primary-900">
            {report.headline}
          </p>
          {guess && <span className="text-sm leading-[21px] text-muted-foreground">{guess}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2>
          <Overline>Fix these first</Overline>
        </h2>
        <ol className="flex flex-col gap-3">
          {priorities.map((category, index) => (
            <li key={category.key} className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary-100 text-[13px] font-semibold text-primary-900 tabular-nums">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold text-primary-900">{category.title}</span>
                <span className="text-[13px] leading-[19px] text-pretty text-muted-foreground">{category.short}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
