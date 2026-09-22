import { useState } from 'react';
import { Menu } from 'lucide-react';
import { BrandSheet } from './BrandSheet';
import { Button } from './ui/Button';

/**
 * Below lg the brand column is gone, so this footer row carries the logo and
 * the way back to what the column used to say. It sticks to the bottom the way
 * the header sticks to the top, and owns the panel's bottom padding so that
 * space sticks with it instead of scrolling away beneath it.
 */
export function MobileBrandBar() {
  const [open, setOpen] = useState(false);

  // The top padding is solid white, so scrolling content clears the logo by
  // that much. It is part of the transcript's bottom gap; ChatPanel's list
  // padding is sized around it so both ends of the transcript match.
  return (
    <footer className="sticky bottom-0 z-10 flex items-center justify-between bg-card px-4 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-8 lg:hidden">
      <div className="flex items-center gap-3">
        <img src="/brand/lb-icon-dark.svg" alt="" className="h-6 w-auto" />
        <img src="/brand/lb-wordmark-indigo.svg" alt="Lawbrokr" className="h-6 w-auto" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label="About Lawbrokr"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        // Keep the 44px touch target but let it overhang, so the row is only
        // as tall as the logo and the gap above is measured from what you see.
        className="-my-2.5"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>

      <BrandSheet open={open} onClose={() => setOpen(false)} />
    </footer>
  );
}
