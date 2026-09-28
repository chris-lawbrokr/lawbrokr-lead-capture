import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import type { Lead } from '../../types';
import { Button } from '../ui/Button';
import { BookingDialog } from './BookingDialog';

interface BookingPanelProps {
  lead: Lead;
}

/**
 * Final step. The details are already in HubSpot by the time this shows, so
 * booking is an offer rather than a gate: the scheduler opens in a popup only
 * when the visitor asks for it, with everything they've told us filled in. The
 * button stays in the transcript, so a closed popup can always be reopened.
 */
export function BookingPanel({ lead }: BookingPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5 mb-5 animate-fade-in">
      <Button
        size="lg"
        className="w-full sm:w-auto"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <CalendarDays aria-hidden="true" className="size-4" />
        Book a time
      </Button>

      <BookingDialog lead={lead} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
