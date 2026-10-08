import type { LucideIcon } from 'lucide-react';

/** The four screens, in order. */
export type AuditStep = 'start' | 'scan' | 'gate' | 'report';

/** Which set of sample results to show. See `data/sample.ts`. */
export type Scenario = 'low' | 'mid' | 'high';

/** The five things the audit scores. */
export type CategoryKey = 'reviews' | 'speed' | 'bounce' | 'traffic' | 'visibility';

/** One of the checks, as listed on the start screen and ticked off during the scan. */
export interface Check {
  key: CategoryKey;
  icon: LucideIcon;
  title: string;
  blurb: string;
  /** What the scan says it is doing, in order, while this check is active. */
  steps: readonly string[];
}

/** The raw measurements behind a report. */
export interface AuditMetrics {
  /** Google rating, out of 5. */
  rating: number;
  /** Google review count. */
  reviews: number;
  /** Seconds to load on a phone. */
  mobile: number;
  /** Seconds to load on desktop. */
  desktop: number;
  /** Percent of visitors who leave after one page. */
  bounce: number;
  /** Estimated visits a month. */
  visits: number;
  /** Search visibility, out of 100. */
  seo: number;
  /** AI-answer visibility, out of 100. */
  geo: number;
}

export interface Competitor {
  name: string;
  rating: number;
  reviews: number;
}

export interface Band {
  label: 'Healthy' | 'Room to grow' | 'Needs attention';
  variant: 'success' | 'warning' | 'destructive';
}

/** One bar in a category's comparison chart. */
export interface ComparisonRow {
  label: string;
  value: string;
  /** Bar width, 2–100. */
  pct: number;
  /** The visitor's own firm, drawn in the stronger fill. */
  mine: boolean;
}

export interface CategoryReport extends Check {
  score: number;
  band: Band;
  /** The headline number, like "4.4" or "5.2s". */
  metric: string;
  metricLabel: string;
  rows: ComparisonRow[];
  /** The full recommendation. */
  fix: string;
  /** The recommendation in a line, for "Fix these first". */
  short: string;
}

export interface AuditReport {
  domain: string;
  metrics: AuditMetrics;
  competitors: readonly Competitor[];
  overall: number;
  band: Band;
  categories: CategoryReport[];
  /** One line summing up how many things need fixing. */
  headline: string;
}

/** A finding that appears in the scan's feed once progress passes `at`. */
export interface Discovery {
  at: number;
  icon: LucideIcon;
  title: string;
  detail: string;
  avatars?: readonly string[];
  chips?: readonly string[];
}

export type QuizKey = 'guess' | 'goal' | 'reply' | 'source';

export interface QuizQuestion {
  key: QuizKey;
  title: string;
  options: readonly string[];
}

export type QuizAnswers = Partial<Record<QuizKey, string>>;

/** Who unlocked the report, from the gate form. */
export interface Lead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practiceArea: string;
  wantsCall: boolean;
}

/** A name/value pair in the shape the HubSpot Forms API expects. */
export interface HubspotField {
  name: string;
  value: string;
}

/** Which submission this is. The audit sends one, when the gate is unlocked. */
export type SubmissionStage = 'audit';
