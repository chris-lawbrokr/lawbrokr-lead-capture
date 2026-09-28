import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ContactDetails } from '../../types';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface ContactDetailsFormProps {
  onSubmit: (details: ContactDetails) => Promise<void>;
}

export function ContactDetailsForm({ onSubmit }: ContactDetailsFormProps) {
  const [site, setSite] = useState('');
  const [pending, setPending] = useState(false);

  // An empty or malformed URL is left to the browser's own check, which runs
  // before this handler.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    await onSubmit({ site: site.trim() });
  };

  return (
    <form className="mt-8 mb-5 animate-fade-in" onSubmit={handleSubmit}>
      <div className="mb-4">
        <TextField
          label="Firm website"
          type="url"
          placeholder="https://harborlaw.com"
          required
          value={site}
          onChange={(event) => setSite(event.target.value)}
        />
      </div>
      <Button type="submit" size="lg" loading={pending}>
        Submit details
      </Button>
    </form>
  );
}
