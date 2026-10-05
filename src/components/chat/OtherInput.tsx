import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

interface OtherInputProps {
  onSubmit: (value: string) => void;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  /**
   * Submitted when the field is left empty, and shown as its placeholder so the
   * field shows what will be sent. Without it, an answer is required.
   */
  fallback?: string;
}

/**
 * Free-text answer: the fallback shown when someone picks "Other", which can be
 * skipped, and the control for questions that are answered by typing.
 */
export function OtherInput({
  onSubmit,
  label = 'Your answer',
  autoComplete,
  fallback,
  placeholder = fallback,
}: OtherInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answer = value.trim() || fallback;
    if (!answer) return;
    onSubmit(answer);
  };

  return (
    <form className="mt-5 mb-5 animate-fade-in" onSubmit={handleSubmit}>
      <TextField
        ref={inputRef}
        label={label}
        type="text"
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={!fallback}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {/* Sized like the multi-select Continue, so both read as the same step. */}
      <Button type="submit" disabled={!value.trim() && !fallback} className="mt-4 min-h-11 w-full sm:min-h-9 sm:w-auto">
        Continue
      </Button>
    </form>
  );
}
