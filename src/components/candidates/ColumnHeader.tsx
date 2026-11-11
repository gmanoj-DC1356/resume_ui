import type { MatchColumn, SortKey, SortState } from '@/components/candidates/matchColumns';
import { InfoTip, type TipAlign } from '@/components/common/InfoTip';

interface ColumnHeaderProps {
  column: MatchColumn;
  align: TipAlign;
  sort: SortState;
  onSort: (key: SortKey) => void;
}

function ariaSort(active: boolean, sort: SortState): 'ascending' | 'descending' | 'none' {
  if (!active) return 'none';
  return sort.direction === 'asc' ? 'ascending' : 'descending';
}

export function ColumnHeader({ column, align, sort, onSort }: Readonly<ColumnHeaderProps>) {
  const { key, label, info, width } = column;
  const sortKey = key === 'actions' ? null : key;
  const active = sortKey !== null && sort.key === sortKey;

  return (
    <th
      scope="col"
      aria-sort={sortKey ? ariaSort(active, sort) : undefined}
      className={`${width ?? ''} px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-muted first:rounded-tl-xl last:rounded-tr-xl`}
    >
      <span className="inline-flex items-center">
        {sortKey ? (
          <button
            type="button"
            onClick={() => onSort(sortKey)}
            className={`inline-flex items-center gap-1 uppercase tracking-wide hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-accent ${
              active ? 'text-brand-primary' : ''
            }`}
          >
            {label}
            <span aria-hidden="true" className={active ? '' : 'opacity-40'}>
              {active && sort.direction === 'desc' ? '▼' : '▲'}
            </span>
          </button>
        ) : (
          label
        )}
        {info && <InfoTip label={label} align={align}>
            {info}
          </InfoTip>}
      </span>
    </th>
  );
}
