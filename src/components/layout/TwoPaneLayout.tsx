import type { ReactNode } from 'react';

interface TwoPaneLayoutProps {
  main: ReactNode;
  aside?: ReactNode;
}

// Active module on the left, session history in a sidebar on the right (omitted when there is no aside).
export function TwoPaneLayout({ main, aside }: Readonly<TwoPaneLayoutProps>) {
  return (
    <div
      className={`mx-auto grid max-w-[1600px] grid-cols-1 gap-6 p-6 ${
        aside ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''
      }`}
    >
      <main className="min-w-0">{main}</main>
      {aside && (
        <aside aria-label="Session history" className="min-w-0">
          {aside}
        </aside>
      )}
    </div>
  );
}
