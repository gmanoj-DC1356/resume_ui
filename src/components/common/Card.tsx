import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className = '' }: Readonly<CardProps>) {
  return (
    <section
      className={`rounded-2xl border border-brand-line bg-brand-surface p-5 shadow-sm ${className}`}
    >
      {title && <h3 className="text-base font-semibold text-brand-primary">{title}</h3>}
      {description && <p className="mt-1 text-sm text-brand-muted">{description}</p>}
      <div className={title ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}
