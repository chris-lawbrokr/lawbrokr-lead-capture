import { useId, useState } from 'react';
import type { SubmitEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { CHECKS } from '../../data/checks';
import { cleanDomain, isValidDomain } from '../../lib/domain';
import { URL_INVALID } from '../../lib/validation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Field';
import { IconTile } from '../ui/IconTile';
import { Overline } from '../ui/Overline';

/**
 * Step 1: the pitch, the URL field and what the audit looks at. The field takes
 * anything that reduces to a domain, so a pasted `https://www.firm.com/contact`
 * works as well as `firm.com`.
 */
export function StartScreen({ onStart }: { onStart: (domain: string) => void }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const id = useId();
  const errorId = `${id}-err`;

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
    <main className="flex flex-1 flex-col items-center px-gutter pt-[clamp(48px,10vh,112px)] pb-16">
      <div className="flex w-full max-w-[720px] flex-col items-center gap-4 text-center">
        <Overline tone="accent">Free marketing web audit</Overline>
        <h1 className="font-display text-[length:clamp(36px,5.5vw,56px)] leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-primary-900">
          See how your firm’s website stacks up against the firms down the street.
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[26px] text-pretty text-muted-foreground">
          We’ll check your reviews, speed, traffic and how often search engines and AI assistants recommend
          you. Takes about 30 seconds.
        </p>
      </div>

      {/* The browser's own URL check would reject a bare `firm.com`, so
          validation is ours alone (noValidate). */}
      <form noValidate onSubmit={handleSubmit} className="mt-10 flex w-full max-w-[600px] flex-col gap-2">
        <label htmlFor={id} className="text-sm font-medium text-primary-900">
          Firm URL
        </label>
        <div className="flex flex-wrap gap-2">
          <div className="min-w-0 flex-[1_1_300px]">
            <Input
              id={id}
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
          <Button type="submit" size="lg">
            Run my audit
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
        {error && (
          <span id={errorId} role="alert" className="text-[13px] text-destructive-subtle-foreground">
            {error}
          </span>
        )}
        <span className="text-[13px] text-muted-foreground">Free. Nothing to install, and we never touch your site.</span>
      </form>

      <section aria-labelledby={`${id}-checks`} className="mt-[72px] flex w-full max-w-[1040px] flex-col gap-4">
        <h2 id={`${id}-checks`} className="text-center">
          <Overline>What we check</Overline>
        </h2>
        {/* Cells sit 1px apart on the border colour, which draws the rules between them. */}
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px overflow-hidden rounded-lg border border-border bg-border">
          {CHECKS.map((check) => (
            <li key={check.key} className="flex flex-col gap-2.5 bg-card p-5">
              <IconTile icon={check.icon} />
              <span className="text-sm font-semibold text-primary-900">{check.title}</span>
              <span className="text-[13px] leading-[19px] text-pretty text-muted-foreground">{check.blurb}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
