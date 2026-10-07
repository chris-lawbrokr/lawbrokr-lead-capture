import { Calendar, Download } from 'lucide-react';
import { GOAL_PHRASE } from '../../data/quiz';
import { formatDate } from '../../lib/format';
import { meetingLink } from '../../lib/hubspot';
import { guessVerdict, prioritiesFor } from '../../lib/scoring';
import type { AuditReport, Lead, QuizAnswers } from '../../types';
import { Button, ButtonLink } from '../ui/Button';
import { Overline } from '../ui/Overline';
import { CategoryCard } from './CategoryCard';
import { ScoreSummary } from './ScoreSummary';
import { WalkthroughBanner } from './WalkthroughBanner';

interface ReportScreenProps {
  report: AuditReport;
  answers: QuizAnswers;
  /** Who unlocked it, for pre-filling the scheduler. Null on a dev preview. */
  lead: Lead | null;
  ranAt: Date;
}

/**
 * Step 4: the full report. The quiz's goal puts its category first in "Fix
 * these first" and names the focus in the subtitle. "Download PDF" is the
 * browser's print dialog; the actions hide themselves on paper.
 */
export function ReportScreen({ report, answers, lead, ranAt }: ReportScreenProps) {
  const bookingUrl = meetingLink(lead);
  const meta = [
    `Run ${formatDate(ranAt)}`,
    `Compared against ${report.competitors.length} firms near you`,
    answers.goal && `Focused on ${GOAL_PHRASE[answers.goal] ?? answers.goal.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="flex flex-1 justify-center px-gutter pt-[clamp(32px,6vh,56px)] pb-16">
      <div className="flex w-full max-w-[1120px] flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Overline>Marketing web audit</Overline>
            <h1 className="font-display text-[length:clamp(28px,4vw,40px)] leading-[1.1] font-semibold break-words text-primary-900">
              {report.domain}
            </h1>
            <span className="text-sm text-muted-foreground">{meta}</span>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <Download aria-hidden="true" className="size-4" />
              Download PDF
            </Button>
            <ButtonLink href={bookingUrl} target="_blank" rel="noopener noreferrer">
              <Calendar aria-hidden="true" className="size-4" />
              Book a walkthrough
            </ButtonLink>
          </div>
        </div>

        <ScoreSummary
          report={report}
          priorities={prioritiesFor(report.categories, answers.goal)}
          guess={guessVerdict(answers.guess, report.overall)}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-4">
          {report.categories.map((category) => (
            <CategoryCard key={category.key} category={category} />
          ))}
        </div>

        <WalkthroughBanner bookingUrl={bookingUrl} />
      </div>
    </main>
  );
}
