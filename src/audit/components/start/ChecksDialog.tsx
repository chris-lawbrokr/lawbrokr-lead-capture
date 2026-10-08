import { useEffect, useId, useRef } from 'react';
import type { MouseEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { CHECKS } from '../../data/checks';
import { Button } from '../ui/Button';
import { IconTile } from '../ui/IconTile';

/**
 * The five checks as cells 1px apart on the border colour, which draws the rules
 * between them. On the page they sit in a bordered, rounded card; `bleed` drops
 * that frame so they run edge to edge inside the dialog's card, their text in
 * line with the dialog's title.
 */
export function ChecksList({ bleed = false, className }: { bleed?: boolean; className?: string }) {
  return (
    <ul
      className={cn(
        'grid gap-px bg-border',
        bleed ? 'grid-cols-1' : 'overflow-hidden rounded-lg border border-border',
        className,
      )}
    >
      {CHECKS.map((check) => (
        <li key={check.key} className={cn('flex flex-col gap-2.5 bg-card', bleed ? 'px-gutter py-5' : 'p-5')}>
          <IconTile icon={check.icon} />
          <span className="text-sm font-semibold text-primary-900">{check.title}</span>
          <span className="text-[13px] leading-[19px] text-pretty text-muted-foreground">{check.blurb}</span>
        </li>
      ))}
    </ul>
  );
}

interface ChecksDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "What we check" once the checks no longer fit in a row on the page: a card
 * centred over the page, tall enough for about three checks, with a 56px bar carrying the title and the close button and the checks
 * scrolling beneath it. A native <dialog>, so the focus trap, Esc to close and
 * the page going inert come from the platform; a tap on the page around it
 * closes it too.
 */
export function ChecksDialog({ open, onClose }: ChecksDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The card's content fills the dialog, so a click that lands on the dialog
  // itself came through its backdrop.
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={closeOnBackdrop}
      aria-labelledby={titleId}
      // m-auto centres it. On a phone it's the width less 16px of page at each
      // side; from sm up it widens to 42rem with at least 32px either side.
      // The height shows the bar, three checks and the top of a fourth, which
      // says there's more to scroll: 32rem on a phone, where each description
      // takes two lines, and 29.5rem from sm up, where it takes one. On a
      // short screen it keeps at least 40px of page above and below instead.
      // With no tint behind it, the border and shadow set the white card off
      // from the near-white page.
      className="checks-dialog m-auto h-[min(32rem,calc(100dvh-5rem))] max-h-none w-[calc(100%-2rem)] max-w-none sm:h-[min(29.5rem,calc(100dvh-5rem))] sm:w-[min(42rem,calc(100%-4rem))] overflow-hidden rounded-xl border border-border bg-card p-0 text-foreground shadow-md"
    >
      <div className="flex h-full flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-gutter">
          <h2 id={titleId} className="text-lg font-semibold text-primary-900">
            What we check
          </h2>
          {/* Overhangs its row so the 44px target doesn't add height, and the
              X itself lines up with the gutter. */}
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose} className="-my-2.5 -mr-3">
            <X aria-hidden="true" className="size-5" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ChecksList bleed />
        </div>
      </div>
    </dialog>
  );
}
