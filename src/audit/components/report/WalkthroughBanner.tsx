import { useId } from 'react';
import { ButtonLink } from '../ui/Button';

/**
 * The closing pitch on brand purple — one of the two dark surfaces the design
 * system allows, so everything on it is white or a pale tint.
 */
export function WalkthroughBanner({ bookingUrl }: { bookingUrl: string }) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-wrap items-center justify-between gap-6 rounded-lg bg-primary-900 p-8"
    >
      <div className="flex min-w-0 flex-[1_1_420px] items-start gap-5">
        <img src="/brand/lb-icon-white.svg" alt="" className="h-9 w-auto shrink-0" />
        <div className="flex flex-col gap-1.5">
          <h2
            id={titleId}
            className="font-display text-[26px] leading-[1.2] font-semibold text-balance text-primary-foreground"
          >
            Turn the traffic you already have into consultations.
          </h2>
          <p className="text-[15px] leading-[22px] text-pretty text-primary-100">
            Lawbrokr puts a short, chat-style intake in front of every visitor. We’ll show you where it fits on
            your site.
          </p>
        </div>
      </div>
      <ButtonLink variant="secondary" size="lg" href={bookingUrl} target="_blank" rel="noopener noreferrer" className="print:hidden">
        Book a 15-minute walkthrough
      </ButtonLink>
    </section>
  );
}
