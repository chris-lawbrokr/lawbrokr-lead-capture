import { PILLARS, PROOF } from '../data/brand';

/**
 * Left-hand brand column. Brand purple is one of the two dark surfaces the
 * design system allows, so everything on it is white: the wordmark, the display
 * hero (Host Grotesk 600 at 5xl, the visitor-hero step) and the copy. No rules,
 * no tints — spacing carries the structure.
 */
export function BrandPanel() {
  return (
    <aside className="flex flex-col justify-between gap-12 bg-primary px-4 py-10 text-primary-foreground sm:px-8 lg:px-14 lg:py-16">
      <div>
        <img src="/brand/lb-wordmark-white.svg" alt="Lawbrokr" className="h-5 w-auto" />

        <h1 className="mt-10 max-w-[12ch] font-display text-5xl font-semibold tracking-tight">Speak with an AI expert.</h1>
        <p className="mt-4 max-w-[40ch] text-base text-primary-foreground/80">
          Tell us a bit about your firm. We&rsquo;ll ask a few quick questions, then get you on the
          calendar with our team.
        </p>

        <dl className="mt-10 space-y-5">
          {PILLARS.map((pillar) => (
            <div key={pillar.name} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium sm:w-[17ch] sm:shrink-0">{pillar.name}</dt>
              <dd className="text-sm text-primary-foreground/80">{pillar.description}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10">
          <p className="font-display text-4xl font-semibold tracking-tight tabular-nums">{PROOF.stat}</p>
          <p className="mt-2 max-w-[34ch] text-sm text-primary-foreground/80">{PROOF.copy}</p>
        </div>
      </div>

      <p className="text-xs text-primary-foreground/70">Conversion intelligence for law</p>
    </aside>
  );
}
