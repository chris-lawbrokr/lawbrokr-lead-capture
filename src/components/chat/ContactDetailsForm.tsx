import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { FIRM_SIZES } from '../../data/steps';
import { normalizePhone, PHONE_INVALID } from '../../lib/phone';
import type { ContactDetails } from '../../types';
import { Button } from '../ui/Button';
import { FormGrid, SelectField, TextField } from '../ui/Field';
import { PhoneField } from '../ui/PhoneField';

interface ContactDetailsFormProps {
  onSubmit: (details: ContactDetails) => Promise<void>;
}

const EMPTY: ContactDetails = { name: '', phone: '', firm: '', site: '', size: '' };

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
      name: details.name.trim(),
      phone,
      firm: details.firm.trim(),
      site: details.site.trim(),
      size: details.size,
    });
  };

  return (
    <form className="mt-8 mb-5 animate-fade-in" onSubmit={handleSubmit}>
      <FormGrid className="mb-4">
        <TextField
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Dana Whitfield"
          required
          value={details.name}
          onChange={(event) => set('name')(event.target.value)}
        />
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
          label="Firm name"
          type="text"
          autoComplete="organization"
          placeholder="Harbor Law Group"
          required
          value={details.firm}
          onChange={(event) => set('firm')(event.target.value)}
        />
        <TextField
          label="Firm website"
          type="url"
          placeholder="https://harborlaw.com"
          required
          value={details.site}
          onChange={(event) => set('site')(event.target.value)}
        />
        <SelectField
          label="Firm size"
          placeholder="Select one"
          options={FIRM_SIZES}
          required
          full
          value={details.size}
          onChange={(event) => set('size')(event.target.value)}
        />
      </FormGrid>
      <Button type="submit" size="lg" loading={pending}>
        Get on the calendar
      </Button>
    </form>
  );
}
