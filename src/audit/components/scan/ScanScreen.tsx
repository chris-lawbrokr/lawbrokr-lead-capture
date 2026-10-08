import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { CHECKS, discoveriesFor } from '../../data/checks';
import type { AuditReport, QuizAnswers, QuizKey } from '../../types';
import { Button } from '../ui/Button';
import { Overline } from '../ui/Overline';
import { Progress } from '../ui/Progress';
import { FindingsFeed } from './FindingsFeed';
import { ScanChecklist } from './ScanChecklist';
import { WaitingQuiz } from './WaitingQuiz';

interface ScanScreenProps {
  domain: string;
  progress: number;
  report: AuditReport;
  answers: QuizAnswers;
  onAnswer: (key: QuizKey, value: string) => void;
  onResetAnswers: () => void;
  onShowScore: () => void;
}

/**
 * Step 2: the scan. Under the progress bar the checklist and the findings sit
 * side by side from 840px up, stacked below that, with the quiz full width
 * beneath them. Both are the same fixed height, a little short of the
 * checklist's five rows, and each scrolls its own list. The whole block sits
 * centred in the window below the header; on a short window it starts at the
 * top and the page scrolls instead.
 *
 * On a phone the screen is pinned instead, like the intake form's chat: the
 * domain and progress stay under the header, the quiz card sits at the bottom,
 * and the two cards share the space between them evenly, each scrolling its
 * own list. The page itself doesn't scroll.
 *
 * At 100% the screen stays put and a "See my score" button appears at the
 * right of the heading; nothing moves on until it's pressed.
 */
export function ScanScreen({
  domain,
  progress,
  report,
  answers,
  onAnswer,
  onResetAnswers,
  onShowScore,
}: ScanScreenProps) {
  const discoveries = useMemo(() => discoveriesFor(report.metrics, report.competitors), [report]);
  const activeIndex = Math.min(CHECKS.length - 1, Math.floor(progress / (100 / CHECKS.length)));
  const done = progress >= 100;
  const status = done ? 'Scan complete' : `Step ${activeIndex + 1} of ${CHECKS.length} · ${CHECKS[activeIndex].title}`;

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-gutter py-[clamp(16px,4vh,40px)] max-sm:h-[calc(100dvh-3.5rem)] max-sm:min-h-0 max-sm:justify-start max-sm:py-4">
      <div className="flex w-full max-w-[960px] flex-col gap-5 max-sm:min-h-0 max-sm:flex-1">
        {/* The button sits at the right, centred on the "Auditing" label and
            domain together; on a phone, where they don't fit side by side, it
            wraps under them full width. */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Overline tone="accent">Auditing</Overline>
            <h1 className="font-display text-[length:clamp(26px,3.4vw,34px)] leading-[1.1] font-semibold tracking-[-0.01em] break-words text-primary-900">
              {domain}
            </h1>
          </div>

          {done && (
            <Button size="lg" onClick={onShowScore} className="animate-pop max-sm:w-full">
              See my score
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[13px] text-muted-foreground">
            {/* Announced as it changes, so a screen reader hears the scan
                finish now that nothing moves on by itself. */}
            <span aria-live="polite">{status}</span>
            <span className="font-semibold text-primary-900 tabular-nums">{Math.floor(progress)}%</span>
          </div>
          <Progress value={Math.round(progress)} max={100} label="Audit progress" />
        </div>

        <div className="flex flex-col gap-4 max-sm:min-h-0 max-sm:flex-1">
          {/* From sm up both cards are 19rem, which shows four and a half
              checklist rows, so the cut-off one says the list scrolls. On a
              phone they split whatever height is left between the progress
              bar and the quiz into two equal rows instead. */}
          <div className="grid grid-cols-1 gap-4 min-[840px]:grid-cols-2 max-sm:min-h-0 max-sm:flex-1 max-sm:grid-rows-2">
            <ScanChecklist progress={progress} className="sm:h-76" />
            <FindingsFeed progress={progress} discoveries={discoveries} className="sm:h-76" />
          </div>

          <WaitingQuiz answers={answers} onAnswer={onAnswer} onReset={onResetAnswers} />
        </div>
      </div>
    </main>
  );
}
