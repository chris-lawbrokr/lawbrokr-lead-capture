import { useEffect, useId, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { cleanDomain, isValidDomain } from '../../lib/domain';
import { URL_INVALID } from '../../lib/validation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Field';
import { Overline } from '../ui/Overline';
import { ChecksDialog, ChecksList } from './ChecksDialog';

/**
 * Step 1: the pitch, the URL field and what the audit looks at. The field takes
 * anything that reduces to a domain, so a pasted `https://www.firm.com/contact`
 * works as well as `firm.com`.
 *
 * The five checks sit in one row under the form for as long as they fit, at
 * 180px a cell: 906px with the rules and border between them. Narrower than
 * that, rather than stacking, they move into a dialog, opened from a "What we
 * check" button under the form, and the pitch, field and button sit centred as
 * one block in the screen. `main` is a size container, so that 906px is
 * measured against the actual column, not the window.
 */
export function StartScreen({ onStart }: { onStart: (domain: string) => void }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const id = useId();
  const errorId = `${id}-err`;
  const [checksOpen, setChecksOpen] = useState(false);
  const checksButtonRef = useRef<HTMLButtonElement>(null);

  // The button only shows while the checks don't fit in a row. If the window
  // widens past that with the dialog open, the row is back on the page, so the
  // dialog closes rather than sitting over it. Watching the button, not a
  // width, keeps this in step with the CSS that hides it.
  useEffect(() => {
    const button = checksButtonRef.current;
    if (!checksOpen || !button) return;
    const observer = new ResizeObserver(() => {
      if (button.getClientRects().length === 0) setChecksOpen(false);
    });
    observer.observe(button);
    return () => observer.disconnect();
  }, [checksOpen]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const domain = cleanDomain(url);
    if (!isValidDomain(domain)) {
      setError(URL_INVALID);
      return;
    }
    onStart(domain);
  };

  return (
    <main className="@container flex flex-1 flex-col items-center px-gutter">
      {/* Below 906px this fills the window under the 56px header and centres
          the block in it, with even padding in place of the top offset so the
          centring is true. */}
      <div className="flex w-full flex-col items-center pt-[clamp(48px,10vh,112px)] @max-[906px]:min-h-[calc(100dvh-3.5rem)] @max-[906px]:justify-center @max-[906px]:py-10">
        {/* One column with one rhythm: 16px between the overline, heading and
            deck, and a little more before the form so it reads as the next step. */}
        <div className="flex w-full max-w-[720px] flex-col items-center gap-4 text-center">
          <Overline tone="accent">Free marketing web audit</Overline>
          <h1 className="font-display text-[length:clamp(36px,5.5vw,56px)] leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-primary-900">
            See how your firm’s website stacks up against the firms down the street.
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[26px] text-pretty text-muted-foreground">
            We’ll check your reviews, speed, traffic and how often search engines and AI assistants recommend
            you. Takes about 30 seconds.
          </p>

          {/* The browser's own URL check would reject a bare `firm.com`, so
              validation is ours alone (noValidate). There's no visible label, so
              the field is named for screen readers with aria-label instead. */}
          <form noValidate onSubmit={handleSubmit} className="mt-2 flex w-full max-w-[600px] flex-col gap-2 text-left">
            <div className="flex flex-wrap gap-2">
              <div className="min-w-0 flex-[1_1_300px]">
                <Input
                  aria-label="Firm URL"
                  size="lg"
                  prefix="https://"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="yourfirm.com"
                  // The URL field is the whole point of the page.
                  autoFocus
                  value={url}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setError('');
                  }}
                />
              </div>
              {/* Full width once it wraps under the field on a phone, so the
                  pair stays one centred block. */}
              <Button type="submit" size="lg" className="max-sm:w-full">
                Run my audit
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
            {error && (
              <span id={errorId} role="alert" className="text-[13px] text-destructive-subtle-foreground">
                {error}
              </span>
            )}
          </form>

          <button
            ref={checksButtonRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={checksOpen}
            onClick={() => setChecksOpen(true)}
            className="min-h-11 cursor-pointer rounded-md px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring @min-[906px]:hidden"
          >
            <Overline>What we check</Overline>
          </button>
        </div>
      </div>

      <section
        aria-labelledby={`${id}-checks`}
        className="mt-12 mb-16 hidden w-full max-w-[1040px] flex-col gap-4 @min-[906px]:flex"
      >
        <h2 id={`${id}-checks`} className="text-center">
          <Overline>What we check</Overline>
        </h2>
        <ChecksList className="grid-cols-5" />
      </section>

      <ChecksDialog open={checksOpen} onClose={() => setChecksOpen(false)} />
    </main>
  );
}
