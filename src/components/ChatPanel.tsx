import { useEffect, useRef } from 'react';
import { QUESTION_STEPS } from '../data/steps';
import { useChatFlow } from '../hooks/useChatFlow';
import { BookingPanel } from './chat/BookingPanel';
import { ChoiceList } from './chat/ChoiceList';
import { ContactDetailsForm } from './chat/ContactDetailsForm';
import { EmailCaptureForm } from './chat/EmailCaptureForm';
import { MessageBubble } from './chat/MessageBubble';
import { TypingIndicator } from './chat/TypingIndicator';
import { Progress } from './ui/Progress';

/** Right-hand column: the guided conversation itself. */
export function ChatPanel() {
  const {
    messages,
    stage,
    isTyping,
    promptReady,
    step,
    totalSteps,
    submitEmail,
    answerQuestion,
    submitContact,
  } = useChatFlow();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view as the transcript grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, promptReady, stage]);

  return (
    <main className="flex flex-col bg-card px-4 pt-8 pb-10 sm:px-8 lg:px-14 lg:pt-16">
      <header className="mb-5 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold">Talk to an AI expert</h2>
          <p className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
            Step {Math.min(step, totalSteps)} of {totalSteps}
          </p>
        </div>
        <Progress value={Math.min(step, totalSteps)} max={totalSteps} label="Progress through the questions" />
      </header>

      <div ref={scrollRef} className="min-h-100 flex-1 overflow-y-auto pr-1">
        <div aria-live="polite">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        {isTyping && <TypingIndicator />}

        {promptReady && stage.name === 'email' && <EmailCaptureForm onSubmit={submitEmail} />}

        {promptReady && stage.name === 'question' && (
          <ChoiceList
            key={stage.index}
            options={QUESTION_STEPS[stage.index].options}
            freeTextOnOther={QUESTION_STEPS[stage.index].freeTextOnOther}
            onPick={(value) => answerQuestion(stage.index, value)}
          />
        )}

        {promptReady && stage.name === 'contact' && <ContactDetailsForm onSubmit={submitContact} />}

        {promptReady && stage.name === 'booking' && <BookingPanel />}
      </div>
    </main>
  );
}
