import {
  Gauge,
  LogOut,
  MapPin,
  MousePointerClick,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { formatNumber } from '../lib/format';
import type { AuditMetrics, Check, Competitor, Discovery } from '../types';
import { BENCHMARKS } from './sample';

/**
 * The five checks, in scan order. Each takes an equal fifth of the progress
 * bar, and its `steps` are spread evenly across that fifth.
 */
export const CHECKS: readonly Check[] = [
  {
    key: 'reviews',
    icon: Star,
    title: 'Google reviews',
    blurb: 'Your rating and review count against the three closest competitors.',
    steps: ['Finding your Google Business Profile', 'Locating competitors within 10 miles', 'Comparing ratings and review counts'],
  },
  {
    key: 'speed',
    icon: Gauge,
    title: 'Load speed',
    blurb: 'How long your site takes to appear on a phone and on desktop.',
    steps: ['Loading your homepage on a mid-range phone', 'Measuring largest contentful paint', 'Repeating the test on desktop'],
  },
  {
    key: 'bounce',
    icon: LogOut,
    title: 'Bounce rate',
    blurb: 'How many visitors leave after a single page.',
    steps: ['Estimating engagement from traffic panels', 'Comparing against legal-industry benchmarks'],
  },
  {
    key: 'traffic',
    icon: TrendingUp,
    title: 'Traffic volume',
    blurb: 'Estimated monthly visits, and where they come from.',
    steps: ['Estimating monthly visits', 'Splitting sources: search, direct, referral'],
  },
  {
    key: 'visibility',
    icon: Sparkles,
    title: 'SEO & GEO visibility',
    blurb: 'How often Google and AI assistants recommend your firm.',
    steps: [
      'Checking 40 local practice-area searches',
      'Asking ChatGPT, Perplexity and AI Overviews who to hire',
      'Scoring citations and directory mentions',
    ],
  },
];

/** "Hartley & Moss" → "HM": the capitalised words' first letters, two at most. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .slice(0, 2)
    .join('');
}

/** What the scan's "What we're finding" feed reveals, and at what percent. */
export function discoveriesFor(metrics: AuditMetrics, competitors: readonly Competitor[]): Discovery[] {
  return [
    {
      at: 7,
      icon: MapPin,
      title: 'Found your Google Business Profile',
      detail: `${metrics.rating.toFixed(1)} rating from ${formatNumber(metrics.reviews)} reviews`,
    },
    {
      at: 15,
      icon: Users,
      title: `Spotted ${competitors.length} competitors within 10 miles`,
      detail: competitors.map((competitor) => competitor.name).join(', '),
      avatars: competitors.map((competitor) => initials(competitor.name)),
    },
    {
      at: 31,
      icon: Smartphone,
      title: `Your homepage took ${metrics.mobile.toFixed(1)}s to load on a phone`,
      detail: `Google’s target is ${BENCHMARKS.speedTarget}s. Trying desktop next.`,
    },
    {
      at: 50,
      icon: MousePointerClick,
      title: `Followed visitors through ${BENCHMARKS.pagesRead} pages`,
      detail: 'Seeing where they leave, and comparing to other law firms.',
    },
    {
      at: 70,
      icon: TrendingUp,
      title: `About ${formatNumber(metrics.visits)} people visit each month`,
      detail: 'Now working out where they come from.',
    },
    {
      at: 87,
      icon: Sparkles,
      title: 'Asked AI assistants who to hire near you',
      detail: 'Which ones named you is in your report.',
      chips: ['ChatGPT', 'Perplexity', 'AI Overviews'],
    },
  ];
}
