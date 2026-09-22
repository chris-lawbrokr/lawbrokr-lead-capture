import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { inputClasses } from '../ui/TextField';

/** Free-text fallback shown when someone picks "Other". */
export function OtherInput({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="mb-5 flex gap-2 animate-rise">
      <input
        ref={inputRef}
        type="text"
        className={`${inputClasses} flex-1`}
        placeholder="Type your answer"
        aria-label="Your answer"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submit();
          }
        }}
      />
      <Button variant="brand" onClick={submit} disabled={!value.trim()}>
        Continue
      </Button>
    </div>
  );
}
