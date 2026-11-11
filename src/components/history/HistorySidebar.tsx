import type { SessionFilters } from '@/api/endpoints/sessions.api';
import { Card } from '@/components/common/Card';
import { TextInput } from '@/components/common/TextInput';
import { HistoryItem } from '@/components/history/HistoryItem';
import { useSessions } from '@/hooks/useSessions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setHistoryFilter,
  setHistorySearch,
  type HistoryFilter,
} from '@/store/slices/historySlice';

const DAYS_IN_WEEK = 7;
const MS_PER_DAY = 86_400_000;
const MAX_SEARCH_LENGTH = 100;

const FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'match', label: 'Match' },
  { id: 'questions', label: 'Questions' },
  { id: 'week', label: 'This week' },
];

function toSessionFilters(filter: HistoryFilter, searchQuery: string): SessionFilters {
  const query = searchQuery.trim() || undefined;
  if (filter === 'week') {
    return { query, from: new Date(Date.now() - DAYS_IN_WEEK * MS_PER_DAY).toISOString() };
  }
  return { query, type: filter === 'all' ? undefined : filter };
}

interface HistorySidebarProps {
  selectedSessionId: string | null;
  onOpenSession: (id: string) => Promise<void>;
}

export function HistorySidebar({ selectedSessionId, onOpenSession }: Readonly<HistorySidebarProps>) {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.history.filter);
  const searchQuery = useAppSelector((state) => state.history.searchQuery);
  const { data, isPending, isError } = useSessions(toSessionFilters(filter, searchQuery));

  return (
    <Card title="History">
      <TextInput
        type="search"
        aria-label="Search history"
        placeholder="Search sessions…"
        value={searchQuery}
        maxLength={MAX_SEARCH_LENGTH}
        onChange={(event) => dispatch(setHistorySearch(event.target.value))}
      />
      <div role="group" aria-label="Filter history" className="my-3 flex flex-wrap gap-1.5">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === filter}
            onClick={() => dispatch(setHistoryFilter(id))}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              id === filter
                ? 'bg-brand-primary text-white'
                : 'bg-brand-primary-soft text-brand-primary hover:bg-brand-line'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {isPending && <p className="text-sm text-brand-muted">Loading history…</p>}
      {isError && <p className="text-sm text-brand-bad">Could not load history.</p>}
      {data?.length === 0 && <p className="text-sm text-brand-muted">No sessions yet.</p>}
      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((entry) => (
            <li key={entry.id}>
              <HistoryItem
                entry={entry}
                selected={entry.id === selectedSessionId}
                onOpen={onOpenSession}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
