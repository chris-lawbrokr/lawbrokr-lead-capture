import { useCallback, useEffect, useRef, useState } from 'react';
import { TYPING_DELAY_MS } from '../config';
import { EXPLORING_ANSWER, QUESTION_STEPS, TOTAL_STEPS } from '../data/steps';
import { submitToHubSpot, trackEngagement } from '../lib/hubspot';
import type { Answers, ChatMessage, ContactDetails, Lead, LeadHeat, Stage } from '../types';

const GREETING = "Hi there, I'm one of Lawbrokr's AI Experts. What's your work email?";
const CONTACT_PROMPT =
  "Great, that's really helpful. Just need a few details and I'll get you booked in with our team.";

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

let nextMessageId = 0;

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

  const answersRef = useRef<Answers>({});
  const leadRef = useRef<Lead>({});
  const trackedRef = useRef(false);

  const say = useCallback((author: ChatMessage['author'], text: string) => {
    setMessages((current) => [...current, { id: `m${nextMessageId++}`, author, text }]);
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
      say('bot', text);
      setSpokenKey(key);
    }, TYPING_DELAY_MS);

    // Clearing on teardown also makes StrictMode's double-mount a no-op:
    // the first timer never fires, so the line is only ever spoken once.
    return () => clearTimeout(timer);
  }, [stage, say]);

  const promptReady = promptFor(stage) === null || spokenKey === stageKey(stage);

  const computeLeadHeat = (): LeadHeat =>
    answersRef.current.primary_pain_point === EXPLORING_ANSWER ? 'cool' : 'hot';

  const submitEmail = useCallback(
    async (email: string) => {
      leadRef.current.email = email;
      await submitToHubSpot([{ name: 'email', value: email }]);
      say('user', email);
      setStage({ name: 'question', index: 0 });
    },
    [say],
  );

  const answerQuestion = useCallback(
    (index: number, value: string) => {
      answersRef.current[QUESTION_STEPS[index].id] = value;
      say('user', value);
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
      Object.assign(leadRef.current, details);
      const answers = answersRef.current;

      await submitToHubSpot([
        { name: 'email', value: leadRef.current.email ?? '' },
        { name: 'firstname', value: details.name },
        { name: 'phone', value: details.phone },
        { name: 'company', value: details.firm },
        { name: 'firm_website', value: details.site },
        { name: 'firm_size', value: details.size },
        { name: 'role', value: answers.role ?? '' },
        { name: 'practice_area', value: answers.practice_area ?? '' },
        { name: 'primary_pain_point', value: answers.primary_pain_point ?? '' },
        { name: 'lead_heat', value: computeLeadHeat() },
      ]);

      say('user', `${details.name} · ${details.firm}`);
      setStage({ name: 'booking' });
    },
    [say],
  );

  return {
    messages,
    stage,
    isTyping: !promptReady,
    promptReady,
    step: stepNumber(stage),
    totalSteps: TOTAL_STEPS,
    submitEmail,
    answerQuestion,
    submitContact,
  };
}
