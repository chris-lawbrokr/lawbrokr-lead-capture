import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  EMAIL_INVALID,
  EMAIL_REQUIRED,
  FIRST_NAME_REQUIRED,
  isValidEmail,
  LAST_NAME_REQUIRED,
} from '../../lib/validation';
import type { IntroDetails } from '../../types';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface EmailCaptureFormProps {
  onSubmit: (details: IntroDetails) => Promise<void>;
}

type Errors = Partial<Record<keyof IntroDetails, string>>;

/**
 * The opening step's fields: name side by side, email under it. Sits under the
 * greeting while it is still centred.
 */
export function EmailCaptureForm({ onSubmit }: EmailCaptureFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const clearError = (key: keyof IntroDetails) =>
    setErrors((current) => ({ ...current, [key]: undefined }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const details = { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() };
    const next: Errors = {
      firstName: details.firstName ? undefined : FIRST_NAME_REQUIRED,
      lastName: details.lastName ? undefined : LAST_NAME_REQUIRED,
      email: isValidEmail(details.email) ? undefined : details.email ? EMAIL_INVALID : EMAIL_REQUIRED,
    };
    setErrors(next);

    // Focus lands on the first field that needs fixing, in reading order.
    const invalid = next.firstName ? firstNameRef : next.lastName ? lastNameRef : next.email ? emailRef : null;
    if (invalid) {
      invalid.current?.focus();
      return;
    }

    setPending(true);
    await onSubmit(details);
  };

  // The browser's own check passes `a@b`, so validation is ours alone
  // (noValidate) and shows inline like every other error in the design system.
  // An error appears on blur or submit, and clears the moment the value is fixed.
  // The names stay side by side even on a phone; they're short enough to fit.
  return (
    <form className="mt-8 animate-fade-in" noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          ref={firstNameRef}
          label="First name"
          type="text"
          size="lg"
          autoComplete="given-name"
          placeholder="Dana"
          required
          error={errors.firstName}
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
            if (errors.firstName && event.target.value.trim()) clearError('firstName');
          }}
        />
        <TextField
          ref={lastNameRef}
          label="Last name"
          type="text"
          size="lg"
          autoComplete="family-name"
          placeholder="Whitfield"
          required
          error={errors.lastName}
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
            if (errors.lastName && event.target.value.trim()) clearError('lastName');
          }}
        />
      </div>
      <div className="mt-4">
        <TextField
          ref={emailRef}
          label="Work email"
          type="email"
          size="lg"
          autoComplete="email"
          placeholder="you@yourfirm.com"
          required
          error={errors.email}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email && isValidEmail(event.target.value.trim())) clearError('email');
          }}
          onBlur={() => {
            const trimmed = email.trim();
            if (trimmed && !isValidEmail(trimmed)) setErrors((current) => ({ ...current, email: EMAIL_INVALID }));
          }}
        />
      </div>
      <Button type="submit" size="lg" loading={pending} className="mt-4">
        Continue
      </Button>
    </form>
  );
}
