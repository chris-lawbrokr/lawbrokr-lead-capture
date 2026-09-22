import type { QuestionStep } from '../types';

export const QUESTION_STEPS: readonly QuestionStep[] = [
  {
    id: 'role',
    prompt: 'Thanks. What’s your role at the firm?',
    options: [
      'Managing partner / owner',
      'Marketing director',
      'Operations lead',
      'Attorney',
      'Other',
    ],
    freeTextOnOther: true,
  },
  {
    id: 'practice_area',
    prompt: 'Good to know. What’s your primary practice area?',
    options: [
      'Personal injury',
      'Family law',
      'Estates & probate',
      'Criminal defense',
      'Immigration',
      'Employment law',
      'Business & corporate',
      'Real estate',
      'Workers’ compensation',
      'Other',
    ],
    freeTextOnOther: true,
  },
  {
    id: 'primary_pain_point',
    prompt: 'Last one. What’s pulling you to look at Lawbrokr right now?',
    options: [
      'We’re missing calls and leads without knowing it',
      'We’re not sure which marketing spend actually converts',
      'Our follow up on new leads is inconsistent',
      'Just exploring for now',
    ],
  },
] as const;

/** The answer that marks a lead as merely browsing. */
export const EXPLORING_ANSWER = 'Just exploring for now';

/** email capture + questions + contact details + booking */
export const TOTAL_STEPS = QUESTION_STEPS.length + 3;

export const FIRM_SIZES = [
  '1–5 attorneys',
  '6–15 attorneys',
  '16–50 attorneys',
  '50+ attorneys',
] as const;
