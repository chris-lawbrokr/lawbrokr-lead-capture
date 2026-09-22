import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';

/** Free-text fallback shown when someone picks "Other". */
export function OtherInput({ onSubmit }: { onSubmit: (value: string) => void }) {
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
    <form className="mb-5 flex animate-fade-in items-end gap-2" onSubmit={handleSubmit}>
      <div className="flex-1">
        <TextField
          ref={inputRef}
          label="Your answer"
          type="text"
          placeholder="Head of intake"
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <Button type="submit" disabled={!value.trim()}>
        Continue
      </Button>
    </form>
  );
}
