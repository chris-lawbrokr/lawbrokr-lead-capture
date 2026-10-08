import { useEffect, useLayoutEffect, useRef } from "react";
import { INTRO_SLIDE_MS } from "../config";
import { QUESTION_STEPS } from "../data/steps";
import { useChatFlow } from "../hooks/useChatFlow";
import { cn } from "../lib/cn";
import { prefersReducedMotion } from "../lib/motion";
import { BookingPanel } from "./chat/BookingPanel";
import { ChoiceList } from "./chat/ChoiceList";
import { ContactDetailsForm } from "./chat/ContactDetailsForm";
import { EmailCaptureForm } from "./chat/EmailCaptureForm";
import { MessageBubble } from "./chat/MessageBubble";
import { OtherInput } from "./chat/OtherInput";
import { TypingIndicator } from "./chat/TypingIndicator";
import { MobileBrandBar } from "./MobileBrandBar";
import { Progress } from "./ui/Progress";

/**
 * Right-hand column. The transcript is one continuous list from the first
 * frame — the opening greeting is already the first bubble in it, just centred
 * in the column because nothing else is there yet. Once the email is in, the
 * column switches to top-aligned and the same bubble travels up into place; it
 * is never unmounted, so it slides rather than cross-fading with a copy of
 * itself.
 */
export function ChatPanel() {
  const {
    messages,
    phase,
    stage,
    isTyping,
    promptReady,
    step,
    totalSteps,
    submitIntro,
    answerQuestion,
    submitContact,
  } = useChatFlow();

  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const introTopRef = useRef<number | null>(null);

  // Note where the greeting sits while it is still centred, before the layout
  // flips. `leaving` is the beat in between, which is what makes this possible.
  useLayoutEffect(() => {
    if (phase === "leaving" && listRef.current) {
      introTopRef.current = listRef.current.getBoundingClientRect().top;
    }
  }, [phase]);

  // FLIP. The list has already jumped to the top of the column by the time this
  // runs, so put it back where it was and let it travel from there.
  useLayoutEffect(() => {
    if (phase !== "chat") return;

    const list = listRef.current;
    const scroll = scrollRef.current;
    const from = introTopRef.current;
    introTopRef.current = null;

    if (!list || !scroll || from === null || prefersReducedMotion()) return;

    const delta = from - list.getBoundingClientRect().top;
    if (Math.abs(delta) < 1) return;

    // The offset list would otherwise push the column into a brief scrollbar.
    scroll.style.overflow = "hidden";
    list.style.transition = "none";
    list.style.transform = `translateY(${delta}px)`;

    const raf = requestAnimationFrame(() => {
      list.style.transition = `transform ${INTRO_SLIDE_MS}ms var(--ease-out)`;
      list.style.transform = "translateY(0)";
    });

    const clear = () => {
      list.style.transition = "";
      list.style.transform = "";
      scroll.style.overflow = "";
    };
    const timer = setTimeout(clear, INTRO_SLIDE_MS + 60);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clear();
    };
  }, [phase]);

  // Keep the newest line in view as the transcript grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && phase === "chat") el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, promptReady, stage, phase]);

  const intro = phase !== "chat";
  const question = stage.name === "question" ? QUESTION_STEPS[stage.index] : undefined;

  // The panel is exactly the screen's height at every size, so the header and
  // footer stay put and only the transcript between them scrolls. dvh rather
  // than vh so a phone's browser toolbars can't push the footer off-screen.
  return (
    <main className="flex h-dvh flex-col bg-card lg:sticky lg:top-0 lg:pb-12">
      {/* On a phone the title, bar and step count each take a full-width row.
          From sm up the step count moves to the right of the title and the bar
          shortens beneath them. */}
      <header className="sticky top-0 z-10 grid gap-2 bg-card px-4 pt-4 pb-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-4 sm:px-8 sm:pt-8 sm:pb-8 lg:px-14 lg:pt-12 lg:pb-12">
        <h2 className="text-xl font-semibold">
          Book with an AI marketing expert
        </h2>
        <Progress
          value={Math.min(step, totalSteps)}
          max={totalSteps}
          label="Progress through the questions"
          className="sm:col-span-2 sm:row-start-2 sm:max-w-40"
        />
        <p
          className="text-sm tabular-nums text-muted-foreground sm:col-start-2 sm:row-start-1"
          aria-live="polite"
        >
          Step {Math.min(step, totalSteps)} of {totalSteps}
        </p>
      </header>

      <div
        ref={scrollRef}
        className={cn(
          // min-h-0 is what lets this shrink inside the flex column so it, and
          // not the page, takes the overflow — without it the panel just grows
          // and carries the header off the top of the screen. It's also a size
          // container, so a long answer list can cap itself at what fits here.
          "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain scrollbar-hidden px-4 [container-type:size] sm:px-8 lg:px-14",
          intro && "justify-center",
        )}
      >
        {/* Breathing room at both ends of the transcript below lg. The bottom is
            shorter because the sticky footer carries part of that gap as its
            own white padding; with the last form's mb-5 the two ends match. */}
        <div ref={listRef} className="pt-6 pb-2 sm:pt-8 sm:pb-5 lg:py-0">
          <div aria-live="polite">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          {isTyping && <TypingIndicator bare={intro} />}

          {intro && promptReady && (
            <div
              className={cn(
                "transition-opacity duration-[180ms] ease-out",
                phase === "leaving" && "pointer-events-none opacity-0",
              )}
            >
              <EmailCaptureForm onSubmit={submitIntro} />
            </div>
          )}

          {!intro && promptReady && stage.name === "question" && question?.kind === "choice" && (
            <ChoiceList
              key={stage.index}
              options={question.options}
              freeTextOnOther={question.freeTextOnOther}
              multiSelect={question.multiSelect}
              onPick={(value) => answerQuestion(stage.index, value)}
            />
          )}

          {!intro && promptReady && stage.name === "question" && question?.kind === "text" && (
            <OtherInput
              key={stage.index}
              label={question.label}
              placeholder={question.placeholder}
              autoComplete={question.autoComplete}
              onSubmit={(value) => answerQuestion(stage.index, value)}
            />
          )}

          {!intro && promptReady && stage.name === "contact" && (
            <ContactDetailsForm onSubmit={submitContact} />
          )}

          {!intro && promptReady && stage.name === "booking" && (
            <BookingPanel lead={stage.lead} />
          )}
        </div>
      </div>

      <MobileBrandBar />
    </main>
  );
}
