import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';
import { inputClasses, labelClasses } from './TextField';

interface SelectFieldProps extends Omit<ComponentPropsWithRef<'select'>, 'id'> {
  label: string;
  placeholder: string;
  options: readonly string[];
  full?: boolean;
}

export function SelectField({
  label,
  placeholder,
  options,
  full = false,
  className,
  ...props
}: SelectFieldProps) {
  const id = useId();

  return (
    <div className={cn(full && 'sm:col-span-2')}>
      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={cn(inputClasses, className)} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
