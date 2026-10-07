import { RotateCcw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './ui/Button';

/**
 * The 56px top bar on every step: logo and product name, plus a way back to
 * the start once there's a report on screen. On a phone there isn't room for
 * the product name and that button side by side, so the name gives way.
 */
export function AppHeader({ onRestart }: { onRestart?: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-gutter">
      <div className="flex min-w-0 items-center gap-3">
        <img src="/brand/lb-wordmark-indigo.svg" alt="Lawbrokr" className="block h-5 w-auto" />
        <span aria-hidden="true" className={cn('h-5 w-px bg-border', onRestart && 'max-sm:hidden')} />
        <span
          className={cn('text-sm font-medium whitespace-nowrap text-muted-foreground', onRestart && 'max-sm:hidden')}
        >
          Marketing web audit
        </span>
      </div>

      {onRestart && (
        <Button variant="ghost" size="sm" onClick={onRestart} className="print:hidden">
          <RotateCcw aria-hidden="true" className="size-4" />
          Run another audit
        </Button>
      )}
    </header>
  );
}
