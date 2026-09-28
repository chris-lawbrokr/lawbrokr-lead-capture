import { useLayoutEffect, useRef } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { formatPhoneInput, phoneDigits } from '../../lib/phone';
import { TextField } from './Field';

interface PhoneFieldProps extends Omit<ComponentProps<typeof TextField>, 'type' | 'value' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
}

/** How many digits (and a leading +) sit in `text`. */
const countDigits = (text: string) => phoneDigits(text).length;

/** The index just after the `count`th digit of a formatted value. */
function indexAfterDigit(formatted: string, count: number): number {
  if (count === 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/[\d+]/.test(formatted[i]) && ++seen === count) return i + 1;
  }
  return formatted.length;
}

/**
 * A tel input that formats as it is typed: `4155550132` reads `(415) 555-0132`.
 *
 * Reformatting on every keystroke has two classic failure modes, both handled
 * here. The caret would jump to the end, so it is put back beside the same
 * digit it was next to. And backspace over a `)` or `-` would delete it only
 * for the formatter to put it straight back, so it takes the digit before it.
 */
export function PhoneField({ value, onValueChange, ...props }: PhoneFieldProps) {
  const pendingCaret = useRef<{ input: HTMLInputElement; digits: number } | null>(null);

  useLayoutEffect(() => {
    const caret = pendingCaret.current;
    if (!caret) return;
    pendingCaret.current = null;
    const position = indexAfterDigit(value, caret.digits);
    caret.input.setSelectionRange(position, position);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    let raw = input.value;
    let digitsBeforeCaret = countDigits(raw.slice(0, input.selectionStart ?? raw.length));

    // Only punctuation was deleted: take the neighbouring digit instead.
    const { inputType } = event.nativeEvent as InputEvent;
    if (phoneDigits(raw) === phoneDigits(value)) {
      const digits = phoneDigits(raw);
      if (inputType === 'deleteContentBackward' && digitsBeforeCaret > 0) {
        raw = digits.slice(0, digitsBeforeCaret - 1) + digits.slice(digitsBeforeCaret);
        digitsBeforeCaret -= 1;
      } else if (inputType === 'deleteContentForward') {
        raw = digits.slice(0, digitsBeforeCaret) + digits.slice(digitsBeforeCaret + 1);
      }
    }

    const next = formatPhoneInput(raw);
    if (next === value) {
      // Nothing to change — a letter, say. React would restore the old value
      // and drop the caret at the end; restore it here with the caret in place.
      input.value = value;
      const position = indexAfterDigit(value, digitsBeforeCaret);
      input.setSelectionRange(position, position);
      return;
    }

    pendingCaret.current = { input, digits: digitsBeforeCaret };
    onValueChange(next);
  };

  return <TextField type="tel" value={value} onChange={handleChange} {...props} />;
}
