import { useEffect, useId, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { QUIZ_ADVANCE_MS } from '../../config';
import { GOAL_PHRASE, QUIZ } from '../../data/quiz';
import { cn } from '../../../lib/cn';
import type { QuizAnswers, QuizKey } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Overline } from '../ui/Overline';

interface WaitingQuizProps {
  answers: QuizAnswers;
  onAnswer: (key: QuizKey, value: string) => void;
  onReset: () => void;
}

/**
 * Four quick questions to fill the scan. Picking an answer holds it highlighted
 * for a beat, then moves on; any question can be skipped. The answers tailor
 * the report, so once they're in the card says so and offers a redo.
 */
export function WaitingQuiz({ answers, onAnswer, onReset }: WaitingQuizProps) {
  const [index, setIndex] = useState(0);
  const advanceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleId = useId();

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const question = QUIZ[index];

  // Any pending advance is cancelled first, so a skip straight after a pick
  // can't move on twice.
  const advance = () => {
    clearTimeout(advanceRef.current);
    setIndex((current) => current + 1);
  };

  const pick = (option: string) => {
    if (!question) return;
    onAnswer(question.key, option);
    clearTimeout(advanceRef.current);
    advanceRef.current = setTimeout(advance, QUIZ_ADVANCE_MS);
  };

  const redo = () => {
    clearTimeout(advanceRef.current);
    onReset();
    setIndex(0);
  };

  return (
    <Card className="flex shrink-0 flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <Overline tone="accent">
          {question ? `While you wait · ${index + 1} of ${QUIZ.length}` : 'While you wait'}
        </Overline>
        <div aria-hidden="true" className="flex gap-1">
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

      {question ? (
        <>
          <p id={titleId} className="font-display text-xl leading-[26px] font-semibold text-pretty text-primary-900">
            {question.title}
          </p>
          <div role="group" aria-labelledby={titleId} className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
            {question.options.map((option) => {
              const chosen = answers[question.key] === option;
              return (
                <Button
                  key={option}
                  variant={chosen ? 'default' : 'outline'}
                  aria-pressed={chosen}
                  onClick={() => pick(option)}
                  // 44px to tap on a phone; wraps rather than clipping a long answer.
                  className="h-auto min-h-11 w-full py-2 whitespace-normal sm:min-h-9"
                >
                  {option}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-[19px] text-pretty text-muted-foreground">{question.hint}</span>
            <Button variant="ghost" size="sm" onClick={advance}>
              Skip
            </Button>
          </div>
        </>
      ) : (
        <div className="flex animate-pop items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check aria-hidden="true" className="size-4" />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="font-display text-lg leading-6 font-semibold text-primary-900">
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
