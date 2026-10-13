import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../lib/cn';
import { meetingLink } from '../../lib/hubspot';
import type { Lead } from '../../types';

interface BookingPanelProps {
  lead: Lead;
}

/**
 * The furthest the scheduler shrinks to fit the screen. Past this its text gets
 * too small to read comfortably, so a shorter screen scrolls instead.
 */
const MIN_FRAME_SCALE = 0.8;

/** The design system's lg breakpoint, from which the step should fit the screen. */
const FIT_QUERY = '(min-width: 1024px)';

/**
 * Final step. The details are already in HubSpot by the time this shows, so the
 * scheduler takes the place of the transcript straight away, with everything
 * they've told us filled in. From lg up the brand column narrows at the same
 * moment (see App), which is what gives HubSpot room for its side-by-side
 * calendar and times rather than the stacked layout it falls back to when
 * squeezed into half the page.
 */
export function BookingPanel({ lead }: BookingPanelProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLParagraphElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState<number>();
  const [room, setRoom] = useState<number>();

  // The embedded scheduler posts its content height, which is how HubSpot's own
  // embed script sizes the frame. Growing the frame to fit leaves this region as
  // the only thing that scrolls, rather than a frame scrolling inside it.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const height: unknown = event.data?.height;
      if (typeof height === 'number' && height > 0) setFrameHeight(height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // HubSpot's side-by-side layout is a fixed ~715px tall, more than a laptop
  // screen leaves under the header, so from lg up the frame shrinks to the room
  // it has: the region less the link beneath it. The region is sized by the
  // panel rather than by what's in it, so watching it catches every resize.
  // Below lg the panel is the whole page and scrolling it is expected, so the
  // frame keeps its natural size there.
  useEffect(() => {
    const region = regionRef.current;
    const link = linkRef.current;
    if (!region || !link) return;
    const fit = window.matchMedia(FIT_QUERY);
    const measure = () => setRoom(fit.matches ? region.clientHeight - link.offsetHeight : undefined);
    const observer = new ResizeObserver(measure);
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  const scale =
    frameHeight && room !== undefined
      ? Math.min(1, Math.max(MIN_FRAME_SCALE, room / frameHeight))
      : 1;

  // HubSpot draws its own card, inset 4px inside the frame, so the side padding
  // here is the header's less those 4px — that puts the card's edges in line
  // with the title rather than adding a border of our own. The link gets the
  // 4px back so it lines up with the title too.
  //
  // The scheduler doesn't always report its height. Until it does, the frame
  // fills whatever the link leaves, so the link stays in view for exactly the
  // case it's there for. Once it does, the link follows straight after the card.
  //
  // Shrinking is a transform on the frame, so HubSpot lays out at full size
  // exactly as it would otherwise; the wrapper takes the shrunk height so the
  // link still follows straight after. The wrapper is there from the start so
  // the frame is never remounted, which would reload the calendar.
  return (
    <div
      ref={regionRef}
      className="flex min-h-0 flex-1 animate-fade-in flex-col overflow-y-auto overscroll-contain scrollbar-hidden px-3 sm:px-7 lg:px-13 xl:px-19"
    >
      <div
        className={cn('flex flex-col', frameHeight ? 'shrink-0' : 'flex-1')}
        style={frameHeight ? { height: frameHeight * scale } : undefined}
      >
        <iframe
          ref={frameRef}
          // shrink-0 keeps the frame at its full height inside the shorter
          // wrapper; only the transform may make it smaller, or HubSpot would
          // be cut off inside it.
          className={cn('block w-full origin-top border-0', frameHeight ? 'shrink-0' : 'flex-1')}
          style={
            frameHeight
              ? { height: frameHeight, transform: scale < 1 ? `scale(${scale})` : undefined }
              : undefined
          }
          src={meetingLink(lead, { embed: true })}
          title="Book a discovery call"
        />
      </div>

      {/* Its bottom padding matches the transcript's below lg, where the sticky
          footer supplies the rest of the gap; from lg up the panel's own bottom
          padding takes over. */}
      <p ref={linkRef} className="flex shrink-0 flex-wrap items-center gap-x-1.5 px-1 pt-4 pb-2 text-sm text-muted-foreground sm:pb-5 lg:pb-0">
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
      </p>
    </div>
  );
}
