import type { AuditMetrics, Competitor, Scenario } from '../types';

/*
 * PLACEHOLDER AUDIT DATA. Nothing is measured yet: every audit is scored from
 * the `mid` sample below, with the same three competitors, whatever URL is
 * entered. These are the design export's demo numbers, kept so the flow runs end
 * to end. Before this goes in front of real firms, `auditFor` in
 * `lib/audit.ts` needs replacing with real sources (Google Places for reviews
 * and competitors, PageSpeed Insights for speed, a traffic panel for bounce and
 * visits, and an AI-answer tracker for visibility).
 */

export const SAMPLE_DOMAIN = 'smithinjurylaw.com';

export const DEFAULT_SCENARIO: Scenario = 'mid';

export const SAMPLE_SCENARIOS: Record<Scenario, AuditMetrics> = {
  low: { rating: 4.1, reviews: 23, mobile: 7.4, desktop: 3.6, bounce: 71, visits: 860, seo: 38, geo: 9 },
  mid: { rating: 4.4, reviews: 61, mobile: 5.2, desktop: 2.4, bounce: 58, visits: 2140, seo: 62, geo: 24 },
  high: { rating: 4.9, reviews: 318, mobile: 2.1, desktop: 1.1, bounce: 39, visits: 7900, seo: 88, geo: 71 },
};

export const SAMPLE_COMPETITORS: readonly Competitor[] = [
  { name: 'Hartley & Moss', rating: 4.7, reviews: 212 },
  { name: 'Reyes Injury Law', rating: 4.6, reviews: 158 },
  { name: 'Kline Legal Group', rating: 4.8, reviews: 96 },
];

/** The comparison points drawn against the firm's own numbers. */
export const BENCHMARKS = {
  /** Google's "good" largest contentful paint, in seconds. */
  speedTarget: 2.5,
  /** The longest load the speed bars are drawn against, in seconds. */
  speedScale: 8,
  legalBounce: 52,
  topBounce: 38,
  nearbyVisits: 4600,
  topVisits: 9200,
  nearbyVisibility: 58,
  /** How many AI answers are checked for a mention. */
  aiQueries: 12,
  /** How many pages the scan claims to read. */
  pagesRead: 42,
} as const;
