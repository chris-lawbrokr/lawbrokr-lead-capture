import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'brand' | 'choice';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Choice chips use this to render the picked state. */
  selected?: boolean;
}

const base =
  'inline-flex items-center justify-center rounded-card font-sans transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary:
    'bg-clay-500 px-[22px] py-[13px] text-[0.98rem] font-bold text-white ' +
    'hover:bg-clay-600 focus-visible:outline-brand-900 disabled:bg-[#d8cfe8] disabled:hover:bg-[#d8cfe8]',
  brand:
    'bg-brand-900 px-4 py-[10px] text-[0.92rem] font-bold text-white ' +
    'hover:bg-brand-800 focus-visible:outline-clay-500 disabled:opacity-60',
  choice:
    'border border-line bg-white px-4 py-[10px] text-left text-[0.92rem] text-ink ' +
    'hover:border-brand-900 focus-visible:outline-clay-500 disabled:opacity-100',
};

const selectedChoice = 'border-brand-900 bg-brand-900 text-white hover:border-brand-900';

export function Button({
  variant = 'primary',
  selected = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        base,
        variants[variant],
        variant === 'choice' && selected && selectedChoice,
        className,
      )}
      {...props}
    />
  );
}
