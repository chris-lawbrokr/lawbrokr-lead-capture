import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { normalizeWebsite, WEBSITE_INVALID, WEBSITE_REQUIRED } from '../../lib/validation';
import type { ContactDetails } from '../../types';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface ContactDetailsFormProps {
  onSubmit: (details: ContactDetails) => Promise<void>;
}

export function ContactDetailsForm({ onSubmit }: ContactDetailsFormProps) {
  const [site, setSite] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const siteRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const normalized = normalizeWebsite(site);
    if (!normalized) {
      setError(site.trim() ? WEBSITE_INVALID : WEBSITE_REQUIRED);
      siteRef.current?.focus();
      return;
    }

    setPending(true);
    await onSubmit({ site: normalized });
  };

  // The browser's own URL check would reject a bare `harborlaw.com`, so
  // validation is ours alone (noValidate) and `https://` is added for them.
  return (
    <form className="mt-8 mb-5 animate-fade-in" noValidate onSubmit={handleSubmit}>
      <div className="mb-4">
        <TextField
          ref={siteRef}
          label="Firm website"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="harborlaw.com"
          required
          error={error}
          value={site}
          onChange={(event) => {
            setSite(event.target.value);
            if (error && normalizeWebsite(event.target.value)) setError(undefined);
          }}
          onBlur={() => {
            if (site.trim() && !normalizeWebsite(site)) setError(WEBSITE_INVALID);
          }}
        />
      </div>
      <Button type="submit" size="lg" loading={pending}>
        Submit details
      </Button>
    </form>
  );
}
