import { useMemo } from 'react';
import { CHECKS, discoveriesFor } from '../../data/checks';
import type { AuditReport, QuizAnswers, QuizKey } from '../../types';
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
}

/**
 * Step 2: the scan. From 840px up it fits the viewport exactly — checklist on
 * the left, quiz and findings on the right, with the findings scrolling inside
 * their card. Below that it's one column at its natural height and the page
 * scrolls instead, which leaves each card room on a phone.
 */
export function ScanScreen({ domain, progress, report, answers, onAnswer, onResetAnswers }: ScanScreenProps) {
  const discoveries = useMemo(() => discoveriesFor(report.metrics, report.competitors), [report]);
  const activeIndex = Math.min(CHECKS.length - 1, Math.floor(progress / (100 / CHECKS.length)));
  const status =
    progress >= 100
      ? 'Scoring your results'
      : `Step ${activeIndex + 1} of ${CHECKS.length} · ${CHECKS[activeIndex].title}`;

  return (
    <main className="flex flex-col items-center px-gutter py-[clamp(16px,4vh,40px)] min-[840px]:h-[calc(100dvh-3.5rem)] min-[840px]:min-h-[520px]">
      <div className="flex min-h-0 w-full max-w-[960px] flex-1 flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Overline tone="accent">Auditing</Overline>
          <h1 className="font-display text-[length:clamp(26px,3.4vw,34px)] leading-[1.1] font-semibold tracking-[-0.01em] break-words text-primary-900">
            {domain}
          </h1>
          <p className="text-sm text-muted-foreground">
            Usually under a minute. Keep this tab open and we’ll show your score when it’s ready.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[13px] text-muted-foreground">
            <span>{status}</span>
            <span className="font-semibold text-primary-900 tabular-nums">{Math.floor(progress)}%</span>
          </div>
          <Progress value={Math.round(progress)} max={100} label="Audit progress" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 min-[840px]:grid-cols-2 min-[840px]:auto-rows-[minmax(0,1fr)]">
          <ScanChecklist progress={progress} />
          <div className="flex min-h-0 flex-col gap-4">
            <WaitingQuiz answers={answers} onAnswer={onAnswer} onReset={onResetAnswers} />
            <FindingsFeed progress={progress} discoveries={discoveries} />
          </div>
        </div>
      </div>
    </main>
  );
}
