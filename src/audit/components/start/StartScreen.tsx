import { useId, useState } from 'react';
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
 * On a phone the checks don't follow below. The pitch and the field fill the
 * screen, and "What we check" at its foot opens them full screen instead.
 */
export function StartScreen({ onStart }: { onStart: (domain: string) => void }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const id = useId();
  const errorId = `${id}-err`;
  const [checksOpen, setChecksOpen] = useState(false);

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
    <main className="flex flex-1 flex-col items-center px-gutter pb-16 max-sm:pb-0">
      {/* On a phone this fills the window below the 56px header, which is
          what puts the "What we check" button at its foot. */}
      <div className="flex w-full flex-col items-center pt-[clamp(48px,10vh,112px)] max-sm:min-h-[calc(100dvh-3.5rem)]">
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
        </div>

        {/* mt-auto parks it at the foot of the screen; pt-8 keeps it clear of
            the form when the screen is too short for that. */}
        <div className="mt-auto pt-8 pb-4 sm:hidden">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={checksOpen}
            onClick={() => setChecksOpen(true)}
            className="min-h-11 cursor-pointer rounded-md px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Overline>What we check</Overline>
          </button>
        </div>
      </div>

      <section aria-labelledby={`${id}-checks`} className="mt-12 flex w-full max-w-[1040px] flex-col gap-4 max-sm:hidden">
        <h2 id={`${id}-checks`} className="text-center">
          <Overline>What we check</Overline>
        </h2>
        <ChecksList className="grid-cols-[repeat(auto-fit,minmax(180px,1fr))]" />
      </section>

      <ChecksDialog open={checksOpen} onClose={() => setChecksOpen(false)} />
    </main>
  );
}
