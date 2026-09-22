import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { FormGrid, TextField } from '../ui/Field';

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
          placeholder="you@yourfirm.com"
          required
          full
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormGrid>
      <Button type="submit" size="lg" loading={pending}>
        Continue
      </Button>
    </form>
  );
}
