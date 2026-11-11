import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/common/Button';

const FALLBACK_NAME = 'Demo User';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function AppHeader() {
  const { user, logout } = useAuth();
  const displayName = user?.displayName ?? FALLBACK_NAME;

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-brand-primary to-brand-secondary px-6 py-3 text-white shadow-md">
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold"
          aria-hidden="true"
        >
          RC
        </span>
        <div className="leading-tight">
          <b className="block text-sm">Recruitment Copilot</b>
          <span className="text-xs text-white/80">Resume screening &amp; interview prep</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-xs">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-primary"
            aria-hidden="true"
          >
            {initialsOf(displayName)}
          </span>
          {displayName}
        </span>
        <Button variant="secondary" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
