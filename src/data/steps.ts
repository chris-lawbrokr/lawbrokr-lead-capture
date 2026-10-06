import type { QuestionStep } from '../types';

export const FIRM_SIZES = [
  '1–5 staff',
  '6–15 staff',
  '16–50 staff',
  '50+ staff',
] as const;

/**
 * Each firm size as HubSpot stores it: the option values of the company "Firm
 * Size" property. HubSpot rejects anything that isn't an exact match, and the
 * property is inconsistent — "1–5" has an en dash, the others a hyphen — so
 * copy these from the property rather than retyping them.
 */
const FIRM_SIZE_HUBSPOT_VALUES: Record<(typeof FIRM_SIZES)[number], string> = {
  '1–5 staff': '1–5',
  '6–15 staff': '6-15',
  '16–50 staff': '16-50',
  '50+ staff': '50+',
};

/** The HubSpot "Firm Size" value for a firm-size answer, or '' if there isn't one. */
export function firmSizeForHubspot(answer: string | undefined): string {
  return FIRM_SIZE_HUBSPOT_VALUES[answer as (typeof FIRM_SIZES)[number]] ?? '';
}

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
    prompt: 'Good to know. Which practice areas does your firm focus on? Select all that apply.',
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
    prompt: 'What’s pulling you to look at Lawbrokr right now? Select all that apply.',
    options: [
      'We’re missing leads without knowing it',
      'More granular data & Attribution tracking',
      'Stronger client experience',
      'Our follow-up on new leads is inconsistent',
      'Just exploring for now',
    ],
    multiSelect: true,
  },
  {
    id: 'firm_size',
    kind: 'choice',
    prompt:
      'We see lots of firms of many sizes have these issues, just to confirm, how many people work at your firm?',
    options: FIRM_SIZES,
  },
] as const;

/** The answer that marks a lead as merely browsing. */
export const EXPLORING_ANSWER = 'Just exploring for now';

/** email capture + questions + contact details + booking */
export const TOTAL_STEPS = QUESTION_STEPS.length + 3;
