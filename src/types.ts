interface BaseQuestionStep {
  /** Matches the HubSpot property the answer is written to. */
  id: 'role' | 'practice_area' | 'company' | 'primary_pain_point' | 'firm_size';
  prompt: string;
}

/** A multiple-choice question. */
export interface ChoiceStep extends BaseQuestionStep {
  kind: 'choice';
  options: readonly string[];
  /** When true, picking "Other" swaps the chips for a free-text input. */
  freeTextOnOther?: boolean;
  /** When true, several options can be chosen before continuing. */
  multiSelect?: boolean;
}

/** A question answered by typing, like the firm's name. */
export interface TextStep extends BaseQuestionStep {
  kind: 'text';
  label: string;
  placeholder: string;
  autoComplete?: string;
}

/** One question in the qualifying sequence. */
export type QuestionStep = ChoiceStep | TextStep;

/**
 * Answers collected from the qualifying questions, keyed by step id. Multi-select
 * answers are stored semicolon-joined, the format HubSpot expects for
 * multiple-checkbox properties.
 */
export type Answers = Partial<Record<QuestionStep['id'], string>>;

/** Who the visitor is, gathered on the opening step. */
export interface IntroDetails {
  firstName: string;
  lastName: string;
  email: string;
}

/** Contact details gathered on the final form. */
export interface ContactDetails {
  phone: string;
  site: string;
}

/** Everything known about the visitor. The firm's name and size come from their questions. */
export type Lead = Partial<IntroDetails & ContactDetails & { firm: string; size: string }>;

/** A single line in the transcript. */
export interface ChatMessage {
  id: string;
  author: 'bot' | 'user';
  text: string;
}

/**
 * What the flow is currently asking for. The transcript is append-only; this
 * is the one interactive element rendered underneath it.
 */
export type Stage =
  | { name: 'email' }
  | { name: 'question'; index: number }
  | { name: 'contact' }
  /** Details are in; booking a time is optional and pre-filled from `lead`. */
  | { name: 'booking'; lead: Lead };

export type LeadHeat = 'hot' | 'cool';

/** A name/value pair in the shape the HubSpot Forms API expects. */
export interface HubspotField {
  name: string;
  value: string;
}
