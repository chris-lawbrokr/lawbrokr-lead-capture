import type { CategoryKey, QuizQuestion } from '../types';

/** The score ranges offered on "Guess your health score". */
export const GUESSES = [
  { label: 'Under 40', lo: 0, hi: 39 },
  { label: '40–59', lo: 40, hi: 59 },
  { label: '60–79', lo: 60, hi: 79 },
  { label: '80 or more', lo: 80, hi: 100 },
] as const;

/** Four quick questions to fill the scan's wait. Every one can be skipped. */
export const QUIZ: readonly QuizQuestion[] = [
  {
    key: 'guess',
    title: 'Guess your health score',
    hint: 'Most firms guess high.',
    options: GUESSES.map((guess) => guess.label),
  },
  {
    key: 'goal',
    title: 'What do you want more of?',
    hint: 'We’ll put the fixes that get you there first.',
    options: ['New client calls', '5-star reviews', 'Page 1 on Google', 'Mentions in ChatGPT'],
  },
  {
    key: 'reply',
    title: 'How fast do you reply to a new web lead?',
    hint: 'The first firm to reply usually gets the call.',
    options: ['Under 5 minutes', 'Within an hour', 'Same day', 'Next day or later'],
  },
  {
    key: 'source',
    title: 'Where do most new clients find you?',
    hint: 'Helps us weigh what matters in your score.',
    options: ['Referrals', 'Google search', 'Paid ads', 'Social media'],
  },
];

/** The category a goal answer moves to the top of "Fix these first". */
export const GOAL_CATEGORY: Record<string, CategoryKey> = {
  'New client calls': 'bounce',
  '5-star reviews': 'reviews',
  'Page 1 on Google': 'visibility',
  'Mentions in ChatGPT': 'visibility',
};

/** How the "all set" line names each goal. */
export const GOAL_PHRASE: Record<string, string> = {
  'New client calls': 'new client calls',
  '5-star reviews': '5-star reviews',
  'Page 1 on Google': 'page 1 rankings',
  'Mentions in ChatGPT': 'AI mentions',
};
