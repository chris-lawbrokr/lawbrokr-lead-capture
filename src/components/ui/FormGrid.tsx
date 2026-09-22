import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Two-column field grid that collapses to one column on narrow screens. */
export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)}>{children}</div>;
}
