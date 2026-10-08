import { useEffect, useId, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { QUIZ_ADVANCE_MS } from '../../config';
import { GOAL_PHRASE, QUIZ } from '../../data/quiz';
import { cn } from '../../../lib/cn';
import type { QuizAnswers, QuizKey } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface WaitingQuizProps {
  answers: QuizAnswers;
  onAnswer: (key: QuizKey, value: string) => void;
  onReset: () => void;
}

/**
 * Four quick questions to fill the scan. Picking an answer holds it highlighted
 * for a beat, then moves on. Answering is optional: the scan finishes and the
 * score opens whether or not they're done. The answers tailor the report, so
 * once they're in the card says so and offers a redo.
 */
export function WaitingQuiz({ answers, onAnswer, onReset }: WaitingQuizProps) {
  const [index, setIndex] = useState(0);
  const advanceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleId = useId();

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const question = QUIZ[index];

  // A second pick during the highlight replaces the pending advance rather
  // than adding one, so the quiz can't move on twice.
  const pick = (option: string) => {
    if (!question) return;
    onAnswer(question.key, option);
    clearTimeout(advanceRef.current);
    advanceRef.current = setTimeout(() => setIndex((current) => current + 1), QUIZ_ADVANCE_MS);
  };

  const redo = () => {
    clearTimeout(advanceRef.current);
    onReset();
    setIndex(0);
  };

  // As short as the card can be: no label row and tight padding. The question
  // shares its line with the progress ticks; the answers get the line below.
  return (
    <Card className="shrink-0 px-4 py-3">
      {question ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <p id={titleId} className="font-display text-base leading-6 font-semibold text-pretty text-primary-900">
              {question.title}
            </p>
            <div aria-hidden="true" className="flex shrink-0 gap-1">
              {QUIZ.map((item, i) => (
                <span
                  key={item.key}
                  className={cn(
                    'h-1 w-5 rounded-[2px] transition-colors duration-[120ms] ease-out',
                    answers[item.key] || i < index ? 'bg-primary-900' : i === index ? 'bg-primary-300' : 'bg-neutral-200',
                  )}
                />
              ))}
            </div>
          </div>
          {/* On a phone the answers are one row that scrolls sideways, which
              keeps the card short without shrinking the 44px targets; the
              row runs to the card's edges, and its 4px of vertical padding
              keeps focus rings from being clipped. Keyed by question, so each
              new one starts scrolled back to its first answer. From sm up
              they're a grid. */}
          <div
            key={question.key}
            role="group"
            aria-labelledby={titleId}
            className="-mx-4 -my-1 flex gap-2 overflow-x-auto overscroll-x-contain px-4 py-1 sm:mx-0 sm:my-0 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:overflow-visible sm:px-0 sm:py-0"
          >
            {question.options.map((option) => {
              const chosen = answers[question.key] === option;
              return (
                <Button
                  key={option}
                  variant={chosen ? 'default' : 'outline'}
                  aria-pressed={chosen}
                  onClick={() => pick(option)}
                  // 44px to tap on a phone, at the answer's own width in the
                  // scrolling row; from sm up, grid cells that wrap a long answer.
                  className="h-auto min-h-11 shrink-0 py-2 whitespace-nowrap sm:min-h-9 sm:w-full sm:whitespace-normal"
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex animate-pop items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check aria-hidden="true" className="size-4" />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="font-display text-base leading-6 font-semibold text-primary-900">
              All set. Your report is tailored to you.
            </span>
            <span className="text-[13px] leading-[19px] text-muted-foreground">
              {answers.goal
                ? `We’ll lead with what gets you more ${GOAL_PHRASE[answers.goal] ?? answers.goal.toLowerCase()}.`
                : 'Your answers shape what we show first.'}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={redo}>
            Redo
          </Button>
        </div>
      )}
    </Card>
  );
}
