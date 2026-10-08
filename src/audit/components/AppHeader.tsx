import { RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * The 56px top bar on every step: the logo, plus a way back to the start once
 * there's a report on screen. It stays pinned to the top while the page
 * scrolls under it.
 */
export function AppHeader({ onRestart }: { onRestart?: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-gutter">
      <img src="/brand/lb-wordmark-indigo.svg" alt="Lawbrokr" className="block h-5 w-auto" />

      {onRestart && (
        <Button variant="ghost" size="sm" onClick={onRestart} className="print:hidden">
          <RotateCcw aria-hidden="true" className="size-4" />
          Run another audit
        </Button>
      )}
    </header>
  );
}
