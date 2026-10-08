import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { BrandContent, BrandLogo } from './BrandPanel';

interface BrandSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The brand pitch as a sheet, which is what the design system calls for below
 * lg. Built on a native <dialog> so the dialog semantics it specifies — top
 * layer, focus trap, Esc to close, the rest of the page inert — come from the
 * platform rather than from hand-rolled key handling.
 *
 * The logo and close button sit in a footer that mirrors the page's mobile
 * footer, so the X lands where the menu button that opened the sheet was.
 */
export function BrandSheet({ open, onClose }: BrandSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // At 400px wide or less the sheet fills the screen, so its corners only round
  // once there's page showing beside it.
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="About Lawbrokr"
      className="sheet m-0 ml-auto h-dvh max-h-none w-full max-w-100 overscroll-contain bg-primary p-0 text-primary-foreground min-[401px]:rounded-l-xl"
    >
      <div className="flex h-full flex-col">
        {/* my-auto rather than justify-center: it centres the content when it
            fits but still lets it scroll from the top when it doesn't. The
            padding steps down on a phone so more of it fits on screen. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 sm:py-10">
          <div className="my-auto">
            <BrandContent showLogo={false} compact />
          </div>
        </div>

        <footer className="flex items-center justify-between px-4 pt-4 pb-4 sm:px-8 sm:pb-8">
          <BrandLogo />

          {/* Overhangs its row and the gutter like the menu button it
              replaces, so the row is only as tall as the logo and the X sits
              exactly where that was. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-my-2.5 -mr-3 inline-flex size-11 items-center justify-center rounded-md text-primary-foreground transition-colors duration-[120ms] ease-out hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </footer>
      </div>
    </dialog>
  );
}
