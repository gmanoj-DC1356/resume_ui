import { CandidateRow } from '@/components/candidates/CandidateRow';
import { ColumnHeader } from '@/components/candidates/ColumnHeader';
import {
  DEFAULT_SORT,
  MATCH_COLUMNS,
  nextSort,
  sortRows,
  type RankedCandidate,
  type SortKey,
  type SortState,
} from '@/components/candidates/matchColumns';
import { type TipAlign } from '@/components/common/InfoTip';
import { MatchStats } from '@/components/candidates/MatchStats';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { TextInput } from '@/components/common/TextInput';
import { useCandidateSearch } from '@/hooks/useCandidateSearch';
import type { CandidateMatch } from '@/types/domain';
import { isAxiosError } from 'axios';
import { useState } from 'react';

const AUTH_STATUSES = new Set([401, 403]);
const AUTH_MESSAGE = 'Sign in to the matching service to see results.';
const GENERIC_ERROR_MESSAGE = 'Matches could not be loaded. Please try again later.';
const MAX_FILTER_LENGTH = 60;

interface CandidateListProps {
  selectedResumeId: string | null;
  onOpen: (resumeId: string) => void;
}

function errorMessage(error: unknown): string {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  return status !== undefined && AUTH_STATUSES.has(status) ? AUTH_MESSAGE : GENERIC_ERROR_MESSAGE;
}

function rankByScore(candidates: CandidateMatch[]): RankedCandidate[] {
  return [...candidates]
    .sort((a, b) => b.score - a.score)
    .map((candidate, index) => ({ candidate, rank: index + 1 }));
}

function matchesFilter({ candidate }: RankedCandidate, filter: string): boolean {
  const haystack = [
    candidate.name,
    candidate.role,
    ...candidate.matchedSkills,
    ...candidate.missingSkills,
  ];
  return haystack.some((value) => value.toLowerCase().includes(filter));
}

interface MatchesTableProps extends CandidateListProps {
  rows: RankedCandidate[];
  sort: SortState;
  onSort: (key: SortKey) => void;
}

function tipAlign(index: number): TipAlign {
  if (index === 0) return 'start';
  return index === MATCH_COLUMNS.length - 1 ? 'end' : 'center';
}

function MatchesTable({ rows, sort, onSort, ...actions }: Readonly<MatchesTableProps>) {
  return (
    <div className="rounded-xl border border-brand-line">
      <table className="w-full table-fixed text-sm">
        <caption className="sr-only">Top ranked candidates for the job description</caption>
        <thead className="bg-brand-primary-soft">
          <tr>
            {MATCH_COLUMNS.map((column, index) => (
              <ColumnHeader
                key={column.key}
                column={column}
                align={tipAlign(index)}
                sort={sort}
                onSort={onSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ candidate, rank }) => (
            <CandidateRow
              key={candidate.resumeId}
              candidate={candidate}
              rank={rank}
              selected={candidate.resumeId === actions.selectedResumeId}
              onOpen={actions.onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingRows() {
  return (
    <div role="status" aria-label="Finding matches" className="space-y-3">
      {['first', 'second', 'third'].map((row) => (
        <div key={row} className="h-14 animate-pulse rounded-xl bg-brand-primary-soft" />
      ))}
    </div>
  );
}

// Top matches as a table, ranked by the backend (POST /api/v1/screening/search/).
export function CandidateList(props: Readonly<CandidateListProps>) {
  const { data, isLoading, isError, error, refetch, isFetching } = useCandidateSearch();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  const ranked = rankByScore(data ?? []);
  const needle = filter.trim().toLowerCase();
  const filtered = needle ? ranked.filter((item) => matchesFilter(item, needle)) : ranked;
  const rows = sortRows(filtered, sort);

  return (
    <div className="space-y-6">
      {data && <MatchStats candidates={data} />}
      <Card title="Top matches">
        {isLoading && <LoadingRows />}
        {isError && (
          <div role="alert" className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-brand-bad">{errorMessage(error)}</p>
            <Button size="sm" variant="secondary" disabled={isFetching} onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        )}
        {data?.length === 0 && (
          <p className="text-sm text-brand-muted">
            No matching candidates found. Try broader skills or a fuller description.
          </p>
        )}
        {data && data.length > 0 && (
          <>
            <TextInput
              type="search"
              aria-label="Filter matches"
              placeholder="Filter by name, role or skill…"
              value={filter}
              maxLength={MAX_FILTER_LENGTH}
              onChange={(event) => setFilter(event.target.value)}
              className="mb-4 w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-sm shadow-sm sm:w-80"
            />
            {rows.length > 0 ? (
              <MatchesTable
                {...props}
                rows={rows}
                sort={sort}
                onSort={(key) => setSort((current) => nextSort(current, key))}
              />
            ) : (
              <p className="text-sm text-brand-muted">No candidates match that filter.</p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
