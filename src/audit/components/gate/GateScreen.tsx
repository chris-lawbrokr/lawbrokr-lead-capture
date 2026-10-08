import { useId } from 'react';
import { Lock } from 'lucide-react';
import type { AuditReport, Lead } from '../../types';
import { IconTile } from '../ui/IconTile';
import { Overline } from '../ui/Overline';
import { LeadForm } from './LeadForm';
import { ScorePreview } from './ScorePreview';

interface GateScreenProps {
  report: AuditReport;
  onUnlock: (lead: Lead) => Promise<void>;
}

/**
 * Step 3: the score, blurred, with the lead form floating over it. Both sit in
 * the same grid cell, so the card overlaps the preview without taking it out of
 * the page's flow, and both are centred: the card on the preview, and the pair
 * in the window below the header. When they're taller than the window they
 * start at the top and the page scrolls instead.
 */
export function GateScreen({ report, onUnlock }: GateScreenProps) {
  const titleId = useId();

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-gutter py-[clamp(16px,3vh,32px)]">
      <div className="grid w-full max-w-[980px]">
        <ScorePreview report={report} />

        <section
          aria-labelledby={titleId}
          className="relative flex w-[min(100%,480px)] animate-pop flex-col gap-4 self-center justify-self-center rounded-xl bg-card p-6 shadow-md [grid-area:1/1]"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <IconTile icon={Lock} size="sm" />
              <Overline tone="accent">Your score is ready</Overline>
            </div>
            <h1
              id={titleId}
              className="font-display text-[26px] leading-[1.15] font-semibold text-pretty text-primary-900"
            >
              Unlock your health score
            </h1>
            <p className="text-sm leading-[21px] text-pretty text-muted-foreground">
              {report.headline} Tell us where to send the full breakdown.
            </p>
          </div>
          <LeadForm onSubmit={onUnlock} />
        </section>
      </div>
    </main>
  );
}
