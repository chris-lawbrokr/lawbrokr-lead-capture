import type { QuestionStep } from '../types';

export const FIRM_SIZES = [
  '1–5 attorneys',
  '6–15 attorneys',
  '16–50 attorneys',
  '50+ attorneys',
] as const;

export const QUESTION_STEPS: readonly QuestionStep[] = [
  {
    id: 'jobtitle',
    kind: 'choice',
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
    kind: 'choice',
    prompt: 'Good to know. Which practice areas does your firm focus on? Pick all that apply.',
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
    multiSelect: true,
  },
  {
    id: 'company',
    kind: 'text',
    prompt: 'Got it. What’s the name of your firm?',
    label: 'Firm name',
    placeholder: 'Harbor Law Group',
    autoComplete: 'organization',
  },
  {
    id: 'primary_pain_point',
    kind: 'choice',
    prompt: 'What’s pulling you to look at Lawbrokr right now?',
    options: [
      'We’re missing calls and leads without knowing it',
      'We’re not sure which marketing spend actually converts',
      'Our follow up on new leads is inconsistent',
      'Just exploring for now',
    ],
  },
  {
    id: 'firm_size',
    kind: 'choice',
    prompt:
      'We see lots of firms of many sizes have this issue — just to confirm, how many people work at your firm?',
    options: FIRM_SIZES,
  },
] as const;

/** The answer that marks a lead as merely browsing. */
export const EXPLORING_ANSWER = 'Just exploring for now';

/** email capture + questions + contact details + booking */
export const TOTAL_STEPS = QUESTION_STEPS.length + 3;
