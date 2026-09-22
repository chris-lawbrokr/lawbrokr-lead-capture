import { ExternalLink } from 'lucide-react';
import { CONFIG } from '../../config';

/** Final step: the scheduler, framed as a card. */
export function BookingPanel() {
  return (
    <div className="mb-5 animate-rise overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-lg font-semibold">Pick a time that works</h3>
        <p className="text-sm text-muted-foreground">20-minute call with our team.</p>
      </div>
      <iframe
        className="block h-140 w-full border-0"
        src={CONFIG.hubspotMeetingLink}
        title="Book a discovery call"
      />
      <div className="flex items-center gap-1.5 px-5 py-4 text-sm text-muted-foreground">
        Calendar not loading?
        <a
          className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
          href={CONFIG.hubspotMeetingLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open it in a new tab
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>
    </div>
  );
}
