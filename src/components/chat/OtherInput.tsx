import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface OtherInputProps {
  onSubmit: (value: string) => void;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
}

/**
 * Free-text answer: the fallback shown when someone picks "Other", and the
 * control for questions that are answered by typing.
 */
export function OtherInput({
  onSubmit,
  label = 'Your answer',
  placeholder = 'Head of intake',
  autoComplete,
}: OtherInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <form className="mt-5 mb-5 animate-fade-in" onSubmit={handleSubmit}>
      <TextField
        ref={inputRef}
        label={label}
        type="text"
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {/* Sized like the multi-select Continue, so both read as the same step. */}
      <Button type="submit" disabled={!value.trim()} className="mt-4 min-h-11 w-full sm:min-h-9 sm:w-auto">
        Continue
      </Button>
    </form>
  );
}
