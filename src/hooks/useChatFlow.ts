import { useCallback, useEffect, useRef, useState } from 'react';
import { INTRO_EXIT_MS, TYPING_DELAY_MS } from '../config';
import { EXPLORING_ANSWER, firmSizeForHubspot, QUESTION_STEPS, TOTAL_STEPS } from '../data/steps';
import { companyDomain, submitToHubSpot, trackEngagement } from '../lib/hubspot';
import { prefersReducedMotion } from '../lib/motion';
import type { Answers, ChatMessage, ContactDetails, IntroDetails, Lead, LeadHeat, Stage } from '../types';

const GREETING = 'Hi there, I’m Jake, one of Lawbrokr’s AI experts. Let’s start with your Name & Email';
const CONTACT_PROMPT =
  'Great, that’s really helpful. Let’s get you booked in with our team. Book below.';

/** Stable identity for a stage, used to tell whether its prompt has landed. */
function stageKey(stage: Stage): string {
  return stage.name === 'question' ? `question:${stage.index}` : stage.name;
}

/** The bot line that introduces a stage, or null when the stage speaks for itself. */
function promptFor(stage: Stage): string | null {
  switch (stage.name) {
    case 'email':
      return GREETING;
    case 'question':
      return QUESTION_STEPS[stage.index].prompt;
    case 'contact':
      return CONTACT_PROMPT;
    case 'booking':
      // The scheduler opens straight away, so there's nothing to introduce.
      return null;
  }
}

/** 1-indexed position of a stage in the progress label. */
function stepNumber(stage: Stage): number {
  switch (stage.name) {
    case 'email':
      return 1;
    case 'question':
      return stage.index + 2;
    case 'contact':
      return QUESTION_STEPS.length + 2;
    case 'booking':
      return TOTAL_STEPS;
  }
}

/**
 * How the panel is presenting itself. The email step stands on its own as a
 * centred prompt; `leaving` is the beat where it fades before the transcript
 * takes over.
 */
export type Phase = 'intro' | 'leaving' | 'chat';

/**
 * Drives the whole conversation: an append-only transcript plus a single
 * `stage` describing what is being asked for right now.
 *
 * Each stage change schedules its bot line behind a typing delay. Rather than
 * tracking "typing" and "ready" as separate state, both are derived from
 * `spokenKey` — the stage whose prompt has actually landed — which keeps the
 * indicator and the interactive control from ever disagreeing.
 */
export function useChatFlow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<Stage>({ name: 'email' });
  const [spokenKey, setSpokenKey] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');

  const answersRef = useRef<Answers>({});
  const leadRef = useRef<Lead>({});
  const trackedRef = useRef(false);

  // Every stage gets at most one bot line and one user line, so each line's id
  // is derived from its stage and a repeat is dropped. Effects can re-run
  // without the transcript resetting — Fast Refresh does it on every save,
  // StrictMode on mount, a double-click on any answer — and none of them can
  // stack a duplicate bubble.
  const say = useCallback((author: ChatMessage['author'], stage: Stage, text: string) => {
    const id = `${author}:${stageKey(stage)}`;
    setMessages((current) =>
      current.some((message) => message.id === id) ? current : [...current, { id, author, text }],
    );
  }, []);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackEngagement();
  }, []);

  useEffect(() => {
    const text = promptFor(stage);
    if (text === null) return;

    const key = stageKey(stage);
    const timer = setTimeout(() => {
      say('bot', stage, text);
      setSpokenKey(key);
    }, TYPING_DELAY_MS);

    return () => clearTimeout(timer);
  }, [stage, say]);

  const promptReady = promptFor(stage) === null || spokenKey === stageKey(stage);

  const computeLeadHeat = (): LeadHeat =>
    answersRef.current.primary_pain_point === EXPLORING_ANSWER ? 'cool' : 'hot';

  const submitIntro = useCallback(
    async ({ firstName, lastName, email }: IntroDetails) => {
      Object.assign(leadRef.current, { firstName, lastName, email });
      setPhase('leaving');

      // Fade the intro out while the submission is in flight, so the wait costs
      // nothing. Honouring reduced motion here as well as in CSS keeps the
      // transition from becoming a plain delay for anyone who has asked for less.
      await Promise.all([
        submitToHubSpot('intro', [
          { name: 'email', value: email },
          { name: 'firstname', value: firstName },
          { name: 'lastname', value: lastName },
        ]),
        new Promise((resolve) => setTimeout(resolve, prefersReducedMotion() ? 0 : INTRO_EXIT_MS)),
      ]);

      // The greeting is already the first line of the transcript, spoken by the
      // stage effect — the intro was only ever showing it in a different frame.
      say('user', { name: 'email' }, `${firstName} ${lastName} · ${email}`);
      setPhase('chat');
      setStage({ name: 'question', index: 0 });
    },
    [say],
  );

  const answerQuestion = useCallback(
    (index: number, value: string | readonly string[]) => {
      const values = typeof value === 'string' ? [value] : value;
      answersRef.current[QUESTION_STEPS[index].id] = values.join(';');
      say('user', { name: 'question', index }, values.join(', '));
      setStage(
        index + 1 < QUESTION_STEPS.length
          ? { name: 'question', index: index + 1 }
          : { name: 'contact' },
      );
    },
    [say],
  );

  const submitContact = useCallback(
    async (details: ContactDetails) => {
      const answers = answersRef.current;
      const lead = Object.assign(leadRef.current, details, {
        firm: answers.company,
        size: answers.firm_size,
      });

      await submitToHubSpot('details', [
        { name: 'email', value: lead.email ?? '' },
        { name: 'firstname', value: lead.firstName ?? '' },
        { name: 'lastname', value: lead.lastName ?? '' },
        { name: 'company', value: lead.firm ?? '' },
        { name: 'firm_website', value: details.site },
        { name: 'firm_domain', value: companyDomain(details.site) },
        { name: 'firm_size', value: firmSizeForHubspot(lead.size) },
        { name: 'jobtitle', value: answers.jobtitle ?? '' },
        { name: 'practice_area', value: answers.practice_area ?? '' },
        { name: 'primary_pain_point', value: answers.primary_pain_point ?? '' },
        { name: 'lead_heat', value: computeLeadHeat() },
      ]);

      setStage({ name: 'booking', lead: { ...lead } });
    },
    [],
  );

  return {
    messages,
    phase,
    stage,
    isTyping: !promptReady,
    promptReady,
    step: stepNumber(stage),
    totalSteps: TOTAL_STEPS,
    submitIntro,
    answerQuestion,
    submitContact,
  };
}
