import { useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { PHONE_REQUIRED } from '../../config';
import { PRACTICE_AREAS } from '../../data/practiceAreas';
import {
  EMAIL_INVALID,
  EMAIL_REQUIRED,
  isValidEmail,
  isValidPhone,
  NAME_REQUIRED,
  PHONE_INVALID,
} from '../../lib/validation';
import type { Lead } from '../../types';
import { Button } from '../ui/Button';
import { CheckboxField, SelectField, TextField } from '../ui/Field';

type Errors = Partial<Record<'name' | 'email' | 'phone', string>>;

/** "Dana van der Berg" → first "Dana", last "van der Berg". */
function splitName(fullName: string): Pick<Lead, 'firstName' | 'lastName'> {
  const [firstName, ...rest] = fullName.split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

/**
 * The gate's fields. Name and email are required; phone only when
 * `PHONE_REQUIRED` is on. The walkthrough box starts ticked.
 */
export function LeadForm({ onSubmit }: { onSubmit: (lead: Lead) => Promise<void> }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [wantsCall, setWantsCall] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const clearError = (key: keyof Errors) => setErrors((current) => ({ ...current, [key]: undefined }));

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const trimmed = { name: name.trim(), email: email.trim(), phone: phone.trim() };
    const next: Errors = {
      name: trimmed.name ? undefined : NAME_REQUIRED,
      email: isValidEmail(trimmed.email) ? undefined : trimmed.email ? EMAIL_INVALID : EMAIL_REQUIRED,
      phone: PHONE_REQUIRED && !isValidPhone(trimmed.phone) ? PHONE_INVALID : undefined,
    };
    setErrors(next);

    // Focus lands on the first field that needs fixing, in reading order.
    const invalid = next.name ? nameRef : next.email ? emailRef : next.phone ? phoneRef : null;
    if (invalid) {
      invalid.current?.focus();
      return;
    }

    setPending(true);
    await onSubmit({ ...splitName(trimmed.name), email: trimmed.email, phone: trimmed.phone, practiceArea, wantsCall });
  };

  // The browser's own check passes `a@b`, so validation is ours alone
  // (noValidate) and shows inline like every other error in the design system.
  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">
      <TextField
        ref={nameRef}
        label="Full name"
        required
        autoComplete="name"
        placeholder="Dana Smith"
        error={errors.name}
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          if (errors.name && event.target.value.trim()) clearError('name');
        }}
      />
      <TextField
        ref={emailRef}
        label="Work email"
        type="email"
        required
        autoComplete="email"
        placeholder="dana@yourfirm.com"
        error={errors.email}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (errors.email && isValidEmail(event.target.value.trim())) clearError('email');
        }}
        onBlur={() => {
          const value = email.trim();
          if (value && !isValidEmail(value)) setErrors((current) => ({ ...current, email: EMAIL_INVALID }));
        }}
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        <TextField
          ref={phoneRef}
          label="Phone"
          type="tel"
          required={PHONE_REQUIRED}
          hint={PHONE_REQUIRED ? undefined : 'Optional'}
          autoComplete="tel"
          placeholder="(555) 010-2048"
          error={errors.phone}
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            if (errors.phone && isValidPhone(event.target.value)) clearError('phone');
          }}
        />
        <SelectField
          label="Practice area"
          placeholder="Choose one"
          options={PRACTICE_AREAS}
          value={practiceArea}
          onChange={(event) => setPracticeArea(event.target.value)}
        />
      </div>
      <CheckboxField
        label="Walk me through it on a 15-minute call"
        checked={wantsCall}
        onChange={(event) => setWantsCall(event.target.checked)}
        className="py-1"
      />
      <Button type="submit" size="lg" loading={pending} className="w-full">
        Unlock my score
      </Button>
      <span className="text-center text-xs leading-[18px] text-muted-foreground">
        We’ll email you a copy too. No spam, and you can unsubscribe any time.
      </span>
    </form>
  );
}
