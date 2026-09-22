import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Form primitives. Control height 36, radius-md, 1px --input border (the 3:1
 * non-text boundary), 2px --ring focus. The label is always a real `<label for>`;
 * placeholders are examples, never labels (design system §2 Forms).
 */

const control =
  'w-full px-3 rounded-md border border-input bg-card text-foreground ' +
  'transition-[color,border-color,box-shadow] duration-[120ms] ease-out ' +
  'placeholder:text-neutral-500 hover:not-disabled:border-neutral-500 ' +
  'focus-visible:outline-none focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_var(--primary-200)] ' +
  'aria-invalid:border-destructive disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed';

/* Design system: Input sizes sm 32 / default 36 / lg 40. */
const controlSizes = {
  default: 'h-9 text-sm',
  lg: 'h-10 text-base',
} as const;

type ControlSize = keyof typeof controlSizes;

const labelClass = 'text-sm font-medium text-foreground';

function FieldShell({
  id,
  label,
  hint,
  error,
  full,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', full && 'sm:col-span-2')}>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <span id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} role="alert" className="text-xs font-medium text-destructive-subtle-foreground">
          {error}
        </span>
      )}
    </div>
  );
}

interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'id' | 'size'> {
  label: string;
  hint?: string;
  error?: string;
  full?: boolean;
  size?: ControlSize;
}

export function TextField({
  label,
  hint,
  error,
  full,
  size = 'default',
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} full={full}>
      <input
        id={id}
        className={cn(control, controlSizes[size], className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends Omit<ComponentPropsWithRef<'select'>, 'id'> {
  label: string;
  placeholder: string;
  options: readonly string[];
  hint?: string;
  error?: string;
  full?: boolean;
}

export function SelectField({
  label,
  placeholder,
  options,
  hint,
  error,
  full,
  className,
  ...props
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} full={full}>
      <div className="relative">
        <select
          id={id}
          className={cn(control, controlSizes.default, 'cursor-pointer appearance-none pr-9', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </FieldShell>
  );
}

/** Two-column field grid, collapsing to one column below sm. */
export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}>{children}</div>;
}
