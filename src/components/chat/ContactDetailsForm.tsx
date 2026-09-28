import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { normalizePhone, PHONE_INVALID } from '../../lib/phone';
import type { ContactDetails } from '../../types';
import { Button } from '../ui/Button';
import { FormGrid, TextField } from '../ui/Field';
import { PhoneField } from '../ui/PhoneField';

interface ContactDetailsFormProps {
  onSubmit: (details: ContactDetails) => Promise<void>;
}

const EMPTY: ContactDetails = {
  phone: '',
  site: '',
};

export function ContactDetailsForm({ onSubmit }: ContactDetailsFormProps) {
  const [details, setDetails] = useState<ContactDetails>(EMPTY);
  const [phoneError, setPhoneError] = useState<string>();
  const [pending, setPending] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof ContactDetails) => (value: string) =>
    setDetails((current) => ({ ...current, [key]: value }));

  // Empty fields are left to the browser's `required` check, which runs before
  // this handler. A tel input has no format check of its own, so that part is ours.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const phone = normalizePhone(details.phone);
    if (!phone) {
      setPhoneError(PHONE_INVALID);
      phoneRef.current?.focus();
      return;
    }

    setPending(true);
    await onSubmit({
      phone,
      site: details.site.trim(),
    });
  };

  return (
    <form className="mt-8 mb-5 animate-fade-in" onSubmit={handleSubmit}>
      <FormGrid className="mb-4">
        <PhoneField
          ref={phoneRef}
          label="Phone"
          autoComplete="tel"
          placeholder="(415) 555-0132"
          required
          error={phoneError}
          value={details.phone}
          onValueChange={(phone) => {
            set('phone')(phone);
            if (phoneError && normalizePhone(phone)) setPhoneError(undefined);
          }}
          onBlur={() => {
            if (details.phone.trim() && !normalizePhone(details.phone)) setPhoneError(PHONE_INVALID);
          }}
        />
        <TextField
          label="Firm website"
          type="url"
          placeholder="https://harborlaw.com"
          required
          value={details.site}
          onChange={(event) => set('site')(event.target.value)}
        />
      </FormGrid>
      <Button type="submit" size="lg" loading={pending}>
        Submit details
      </Button>
    </form>
  );
}
