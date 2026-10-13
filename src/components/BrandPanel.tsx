import { PROOF, TAGLINE } from "../data/brand";
import { cn } from "../lib/cn";

/**
 * The brand pitch itself, without any of the surrounding chrome. It appears in
 * two places — the left column from lg up, and the sheet behind the menu button
 * below that — so it owns its own rhythm and nothing else.
 *
 * In the column it is three groups pinned to the top, middle and bottom: the
 * logo with the tagline beside it, the headline and its deck, and the stat with
 * its caption. `justify-between` spreads them over the full height, and the gap
 * is only the floor for when the screen is too short to spread them at all.
 *
 * The sheet passes `showLogo={false}` because it carries the logo in its footer,
 * and `compact` to stack the groups at their natural height and step the type
 * down a size for a phone. With no logo to sit beside, the tagline closes the
 * stack instead.
 */
export function BrandContent({
  showLogo = true,
  compact = false,
}: {
  showLogo?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between",
        compact ? "gap-8" : "flex-1 gap-10",
      )}
    >
      {showLogo && (
        // The logo's baseline is its bottom edge, so the tagline sits on it.
        <div className="flex items-baseline gap-5">
          <BrandLogo />
          <p className="text-sm text-primary-foreground/80">{TAGLINE}</p>
        </div>
      )}

      <div>
        <h1
          className={cn(
            "max-w-xl font-display font-semibold tracking-tight",
            compact ? "text-4xl" : "text-5xl xl:text-6xl",
          )}
        >
          Speak with a Conversion Intelligence expert.
        </h1>
        <p
          className={cn(
            "max-w-[26rem] text-primary-foreground/80",
            compact ? "mt-3 text-sm" : "mt-6 text-lg xl:text-xl",
          )}
        >
          See how a digital front door captures every inquiry, day or night.
        </p>
      </div>

      {/* The caption sits on the stat's baseline, and drops beneath it when
          the two won't fit on one line. */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p
          className={cn(
            "font-display font-semibold tracking-tight tabular-nums",
            compact ? "text-3xl" : "text-4xl",
          )}
        >
          {PROOF.stat}
        </p>
        <p
          className={cn(
            "text-primary-foreground/80",
            compact ? "text-sm" : "text-base",
          )}
        >
          {PROOF.copy}
        </p>
      </div>

      {!showLogo && (
        <p className="text-xs text-primary-foreground/70">{TAGLINE}</p>
      )}
    </div>
  );
}

/** The white lockup, for the brand-purple surfaces. */
export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <img src="/brand/lb-icon-white.svg" alt="" className="h-6 w-auto" />
      <img
        src="/brand/lb-wordmark-white.svg"
        alt="Lawbrokr"
        className="h-6 w-auto"
      />
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
 *
 * The padding matches the chat panel's from lg up, so the logo lines up with
 * its title and the stat sits on its bottom margin.
 *
 * At the booking step the column narrows to make room for the scheduler, and
 * the pitch gives way to who the call is with.
 */
export function BrandPanel({ booking = false }: { booking?: boolean }) {
  return (
    <aside className="hidden flex-col bg-primary px-14 py-12 text-primary-foreground lg:flex">
      {booking ? <BookingContent /> : <BrandContent />}
    </aside>
  );
}

/**
 * The narrow column's content at the booking step, pinned top, middle and bottom
 * like the pitch it replaces. The pitch has done its job by now, so the middle
 * introduces the person they're about to book with. The tagline has no room
 * beside the logo at this width, so it moves to the foot of the column.
 */
function BookingContent() {
  return (
    <div className="flex flex-1 animate-fade-in flex-col justify-between gap-10">
      <BrandLogo />

      <div>
        <img
          src="/brand/jake.webp"
          alt=""
          width={56}
          height={56}
          className="size-14 rounded-full object-cover"
        />
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
          Last step: pick a time.
        </h1>
        <p className="mt-4 text-base text-primary-foreground/80">
          A 20-minute call with Jake, one of our Conversion Intelligence
          experts.
        </p>
      </div>

      <p className="text-sm text-primary-foreground/80">{TAGLINE}</p>
    </div>
  );
}
