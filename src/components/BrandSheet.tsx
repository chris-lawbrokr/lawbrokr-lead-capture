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

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="About Lawbrokr"
      className="sheet m-0 ml-auto h-dvh max-h-none w-full max-w-100 overscroll-contain rounded-l-xl bg-primary p-0 text-primary-foreground"
    >
      <div className="flex h-full flex-col">
        {/* my-auto rather than justify-center: it centres the content when it
            fits but still lets it scroll from the top when it doesn't. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-10 sm:px-8">
          <div className="my-auto">
            <BrandContent showLogo={false} compact />
          </div>
        </div>

        <footer className="flex items-center justify-between px-4 pt-4 pb-4 sm:px-8 sm:pb-8">
          <BrandLogo />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 items-center justify-center rounded-md text-primary-foreground transition-colors duration-[120ms] ease-out hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </footer>
      </div>
    </dialog>
  );
}
