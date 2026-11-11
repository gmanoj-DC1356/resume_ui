import { useId } from 'react';

export type TipAlign = 'start' | 'center' | 'end';

// Where the tooltip sits under the icon; edge columns anchor it inward so it never spills past the table.
const ALIGN_CLASSES: Record<TipAlign, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

interface InfoTipProps {
  label: string;
  align?: TipAlign;
  children: string;
}

// An "i" button whose explanation shows on hover and keyboard focus, and is read out via aria-describedby.
export function InfoTip({ label, align = 'center', children }: Readonly<InfoTipProps>) {
  const tipId = useId();
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={`About ${label}`}
        aria-describedby={tipId}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-muted/60 text-[10px] font-bold normal-case leading-none text-brand-muted hover:bg-brand-primary-soft focus-visible:outline-2 focus-visible:outline-brand-accent"
      >
        i
      </button>
      <span
        id={tipId}
        role="tooltip"
        className={`pointer-events-none absolute ${ALIGN_CLASSES[align]} top-full z-20 mt-2 w-56 rounded-lg bg-brand-text px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100`}
      >
        {children}
      </span>
    </span>
  );
}
