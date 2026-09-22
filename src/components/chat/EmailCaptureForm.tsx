import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface EmailCaptureFormProps {
  onSubmit: (email: string) => Promise<void>;
}

/** The opening step's field. Sits under the greeting while it is still centred. */
export function EmailCaptureForm({ onSubmit }: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || pending) return;

    setPending(true);
    await onSubmit(trimmed);
  };

  return (
    <form className="mt-8 animate-fade-in" onSubmit={handleSubmit}>
      <TextField
        label="Work email"
        type="email"
        size="lg"
        autoComplete="email"
        placeholder="you@yourfirm.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" size="lg" loading={pending} className="mt-4">
        Continue
      </Button>
    </form>
  );
}
