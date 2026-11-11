import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const CONTROL_CLASSES =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-brand-text shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-brand-accent';

function borderClass(invalid: boolean | undefined): string {
  return invalid ? 'border-brand-bad' : 'border-brand-line hover:border-brand-secondary';
}

export function Field({ children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="mt-4 mb-1.5 block text-sm font-medium text-brand-text" {...props}>
      {children}
    </label>
  );
}

interface FieldErrorProps {
  id: string;
  message?: string;
}

export function FieldError({ id, message }: Readonly<FieldErrorProps>) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-brand-bad">
      {message}
    </p>
  );
}

interface InvalidProp {
  invalid?: boolean;
}

export function TextInput({
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & InvalidProp) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`${CONTROL_CLASSES} ${borderClass(invalid)}`}
      {...props}
    />
  );
}

export function TextArea({
  invalid,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & InvalidProp) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`${CONTROL_CLASSES} resize-y ${borderClass(invalid)}`}
      {...props}
    />
  );
}
