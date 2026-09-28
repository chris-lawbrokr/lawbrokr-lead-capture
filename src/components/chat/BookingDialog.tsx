import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { meetingLink } from '../../lib/hubspot';
import type { Lead } from '../../types';
import { Button } from '../ui/Button';

interface BookingDialogProps {
  lead: Lead;
  open: boolean;
  onClose: () => void;
}

/**
 * The scheduler, as a popup that takes over the chat column — the whole screen
 * below lg, the right half from lg up, with the brand column dimmed behind it.
 * A native <dialog>, like BrandSheet, so the focus trap, Esc to close and the
 * rest of the page going inert come from the platform.
 *
 * The iframe mounts the first time the popup opens and then stays mounted, so
 * closing and reopening picks up exactly where the visitor left the calendar,
 * including its confirmation screen once they've booked.
 */
export function BookingDialog({ lead, open, onClose }: BookingDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const titleId = useId();
  const [hasOpened, setHasOpened] = useState(false);
  const [frameHeight, setFrameHeight] = useState<number>();
  if (open && !hasOpened) setHasOpened(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The embedded scheduler posts its content height, which is how HubSpot's own
  // embed script sizes the frame. Growing the frame to fit leaves the popup body
  // as the only thing that scrolls, rather than a frame scrolling inside it. It
  // doesn't always report, so until it does the frame just fills the body.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const height: unknown = event.data?.height;
      if (typeof height === 'number' && height > 0) setFrameHeight(height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="popup m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-card p-0 text-foreground lg:ml-auto lg:w-1/2"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-4 px-4 pt-4 pb-2 sm:px-8 sm:pt-8 lg:px-14 lg:pt-12">
          <div>
            <h2 id={titleId} className="text-xl font-semibold">
              Pick a time that works
            </h2>
            <p className="text-sm text-muted-foreground">20-minute call with our team.</p>
          </div>

          {/* Overhangs its row like the mobile menu button, so the 44px target
              doesn't push the title down. */}
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose} className="-my-2.5 -mr-2.5">
            <X aria-hidden="true" className="size-5" />
          </Button>
        </header>

        {/* HubSpot draws its own card, inset 4px inside the frame, so the side
            padding here is the header's less those 4px — that puts the card's
            edges in line with the title rather than adding a border of our own. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hidden px-3 sm:px-7 lg:px-13">
          {hasOpened && (
            <iframe
              ref={frameRef}
              className="block h-full min-h-full w-full border-0"
              style={frameHeight ? { height: frameHeight } : undefined}
              src={meetingLink(lead, { embed: true })}
              title="Book a discovery call"
            />
          )}
        </div>

        <footer className="flex flex-wrap items-center gap-x-1.5 px-4 pt-2 pb-4 text-sm text-muted-foreground sm:px-8 sm:pb-8 lg:px-14 lg:pb-12">
          Calendar not loading?
          <a
            className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            href={meetingLink(lead)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open it in a new tab
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </footer>
      </div>
    </dialog>
  );
}
