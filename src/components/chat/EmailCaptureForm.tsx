import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { EMAIL_INVALID, EMAIL_REQUIRED, isValidEmail } from '../../lib/validation';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface EmailCaptureFormProps {
  onSubmit: (email: string) => Promise<void>;
}

/** The opening step's field. Sits under the greeting while it is still centred. */
export function EmailCaptureForm({ onSubmit }: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError(trimmed ? EMAIL_INVALID : EMAIL_REQUIRED);
      inputRef.current?.focus();
      return;
    }

    setPending(true);
    await onSubmit(trimmed);
  };

  // The browser's own check passes `a@b`, so validation is ours alone
  // (noValidate) and shows inline like every other error in the design system.
  // An error appears on blur or submit, and clears the moment the value is fixed.
  return (
    <form className="mt-8 animate-fade-in" noValidate onSubmit={handleSubmit}>
      <TextField
        ref={inputRef}
        label="Work email"
        type="email"
        size="lg"
        autoComplete="email"
        placeholder="you@yourfirm.com"
        required
        error={error}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (error && isValidEmail(event.target.value.trim())) setError(undefined);
        }}
        onBlur={() => {
          const trimmed = email.trim();
          if (trimmed && !isValidEmail(trimmed)) setError(EMAIL_INVALID);
        }}
      />
      <Button type="submit" size="lg" loading={pending} className="mt-4">
        Continue
      </Button>
    </form>
  );
}
