import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { FormGrid } from '../ui/FormGrid';
import { TextField } from '../ui/TextField';

interface EmailCaptureFormProps {
  onSubmit: (email: string) => Promise<void>;
}

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
    <form className="mb-5 animate-rise" onSubmit={handleSubmit}>
      <FormGrid className="mb-4">
        <TextField
          label="Work email"
          type="email"
          autoComplete="email"
          required
          full
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormGrid>
      <Button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Continue'}
      </Button>
      <p className="mt-[10px] text-[0.8rem] text-muted">
        We'll follow up either way, even if you don't finish this.
      </p>
    </form>
  );
}
