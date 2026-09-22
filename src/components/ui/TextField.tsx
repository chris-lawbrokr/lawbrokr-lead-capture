import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'id'> {
  label: string;
  /** Span both columns of the form grid. */
  full?: boolean;
}

export const inputClasses =
  'w-full rounded-card border border-line bg-white px-3 py-[10px] font-sans text-[0.95rem] ' +
  'text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-1 ' +
  'focus-visible:outline-clay-500';

export const labelClasses = 'mb-[5px] block text-[0.82rem] text-muted';

export function TextField({ label, full = false, className, ...props }: TextFieldProps) {
  const id = useId();

  return (
    <div className={cn(full && 'sm:col-span-2')}>
      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={cn(inputClasses, className)} {...props} />
    </div>
  );
}
