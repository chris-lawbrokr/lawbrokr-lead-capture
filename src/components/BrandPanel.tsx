import { PILLARS, PROOF } from '../data/brand';
import { cn } from '../lib/cn';

/**
 * The brand pitch itself, without any of the surrounding chrome. It appears in
 * two places — the left column from lg up, and the sheet behind the menu button
 * below that — so it owns its own rhythm and nothing else.
 *
 * One rhythm holds it together: `space-y-10` sets an identical 40px between the
 * five blocks below, and the only tighter gaps are inside a pair that reads as
 * one thing — a heading and its deck, a stat and its caption, the pillar rows.
 *
 * The sheet passes `showLogo={false}` because it carries the logo in its footer,
 * and `compact` to step the type and rhythm down a size for a phone.
 */
export function BrandContent({
  showLogo = true,
  compact = false,
}: {
  showLogo?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'space-y-8' : 'space-y-10'}>
      {showLogo && <BrandLogo />}

      <div>
        <h1
          className={cn(
            'max-w-[12ch] font-display font-semibold tracking-tight',
            compact ? 'text-4xl' : 'text-5xl',
          )}
        >
          Speak with an AI expert.
        </h1>
        <p
          className={cn(
            'max-w-[40ch] text-primary-foreground/80',
            compact ? 'mt-3 text-sm' : 'mt-4 text-base',
          )}
        >
          Tell us a bit about your firm. We&rsquo;ll ask a few quick questions, then get you on the
          calendar with our team.
        </p>
      </div>

      <dl className={compact ? 'space-y-4' : 'space-y-5'}>
        {PILLARS.map((pillar) => (
          <div key={pillar.name} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium sm:w-[17ch] sm:shrink-0">{pillar.name}</dt>
            <dd className="text-sm text-primary-foreground/80">{pillar.description}</dd>
          </div>
        ))}
      </dl>

      <div>
        <p
          className={cn(
            'font-display font-semibold tracking-tight tabular-nums',
            compact ? 'text-3xl' : 'text-4xl',
          )}
        >
          {PROOF.stat}
        </p>
        <p className="mt-2 max-w-[34ch] text-sm text-primary-foreground/80">{PROOF.copy}</p>
      </div>

      <p className="text-xs text-primary-foreground/70">Conversion intelligence for law</p>
    </div>
  );
}

/** The white lockup, for the brand-purple surfaces. */
export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <img src="/brand/lb-icon-white.svg" alt="" className="h-6 w-auto" />
      <img src="/brand/lb-wordmark-white.svg" alt="Lawbrokr" className="h-6 w-auto" />
    </div>
  );
}

/**
 * Left-hand brand column, from lg up. Below that the column is dropped
 * entirely and this content moves behind the menu button in the mobile footer —
 * on a phone the flow is the whole point of the page, and the pitch should not
 * stand between the visitor and the first question.
 *
 * Brand purple is one of the two dark surfaces the design system allows, so
 * everything on it is white. No rules, no tints — spacing carries the structure.
 */
export function BrandPanel() {
  return (
    <aside className="hidden flex-col justify-center bg-primary px-4 py-10 text-primary-foreground sm:px-8 lg:flex lg:px-14 lg:py-16">
      <BrandContent />
    </aside>
  );
}
