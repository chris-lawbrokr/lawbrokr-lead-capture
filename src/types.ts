/** One multiple-choice question in the qualifying sequence. */
export interface QuestionStep {
  /** Matches the HubSpot property the answer is written to. */
  id: 'role' | 'practice_area' | 'primary_pain_point';
  prompt: string;
  options: readonly string[];
  /** When true, picking "Other" swaps the chips for a free-text input. */
  freeTextOnOther?: boolean;
}

/** Answers collected from the qualifying questions, keyed by step id. */
export type Answers = Partial<Record<QuestionStep['id'], string>>;

/** Contact details gathered on the final form. */
export interface ContactDetails {
  name: string;
  phone: string;
  firm: string;
  site: string;
  size: string;
}

export interface Lead extends Partial<ContactDetails> {
  email?: string;
}

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
  | { name: 'booking' };

export type LeadHeat = 'hot' | 'cool';

/** A name/value pair in the shape the HubSpot Forms API expects. */
export interface HubspotField {
  name: string;
  value: string;
}
