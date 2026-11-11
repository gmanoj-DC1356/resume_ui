import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'warn';
}

export function Tag({ children, variant = 'default' }: TagProps) {
  const classes =
    variant === 'warn'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-brand-secondary-soft text-teal-800';
  return (
    <span className={`mr-1 inline-block rounded-full px-2 py-0.5 text-xs ${classes}`}>
      {children}
    </span>
  );
}
