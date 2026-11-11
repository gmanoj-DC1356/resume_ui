import type { WorkspaceModule } from '@/types/domain';

interface ModuleDefinition {
  id: WorkspaceModule;
  label: string;
  needsCandidate: boolean;
}

const MODULES: ModuleDefinition[] = [
  { id: 'jd', label: '1 · Job description', needsCandidate: false },
  { id: 'matches', label: '2 · Matches', needsCandidate: false },
  { id: 'candidate', label: '3 · Resume, questions & chat', needsCandidate: true },
];

interface ModuleTabsProps {
  active: WorkspaceModule;
  onChange: (module: WorkspaceModule) => void;
}

// The candidate tab is a destination, not a menu item: it is only entered from the Matches table.
export function ModuleTabs({ active, onChange }: Readonly<ModuleTabsProps>) {
  return (
    <nav
      aria-label="Workspace modules"
      className="mb-6 flex flex-wrap gap-1 rounded-xl border border-brand-line bg-white p-1 shadow-sm"
    >
      {MODULES.map(({ id, label, needsCandidate }) => (
        <button
          key={id}
          type="button"
          disabled={needsCandidate && id !== active}
          title={needsCandidate && id !== active ? 'Open a candidate from the Matches table' : undefined}
          aria-current={id === active ? 'page' : undefined}
          onClick={() => onChange(id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
            id === active
              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow'
              : 'text-brand-muted hover:bg-brand-primary-soft hover:text-brand-primary disabled:opacity-40'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
