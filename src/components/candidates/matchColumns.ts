import type { CandidateMatch } from '@/types/domain';

export type SortKey = 'rank' | 'name' | 'experience' | 'score' | 'skills';
export type SortDirection = 'asc' | 'desc';

export interface RankedCandidate {
  candidate: CandidateMatch;
  rank: number;
}

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export interface MatchColumn {
  key: SortKey | 'actions';
  label: string;
  info?: string;
  // Fixed width so the table fits its card; the Skills column takes whatever is left.
  width?: string;
}

export const DEFAULT_SORT: SortState = { key: 'rank', direction: 'asc' };

export const MATCH_COLUMNS: MatchColumn[] = [
  { key: 'rank', width: 'w-16', label: '#', info: 'Position by match score. 1 is the closest fit for the job description.' },
  { key: 'name', width: 'w-[22%]', label: 'Candidate' },
  { key: 'experience', width: 'w-28', label: 'Experience' },
  {
    key: 'score',
    width: 'w-32',
    label: 'Score',
    info: 'How closely the resume matches the job description, from 0 to 100%. Green is strong, amber fair, red weak.',
  },
  {
    key: 'skills',
    label: 'Skills',
    info: 'Green tags are required skills the candidate has. Amber tags are required skills missing from the resume. Sorts by skills matched.',
  },
  {
    key: 'actions',
    width: 'w-24',
    label: 'Actions',
    info: 'Opens the resume, interview questions and chat for this candidate in one place.',
  },
];

const COMPARERS: Record<SortKey, (a: RankedCandidate, b: RankedCandidate) => number> = {
  rank: (a, b) => a.rank - b.rank,
  name: (a, b) => a.candidate.name.localeCompare(b.candidate.name),
  experience: (a, b) => a.candidate.yearsExperience - b.candidate.yearsExperience,
  score: (a, b) => a.candidate.score - b.candidate.score,
  skills: (a, b) => a.candidate.matchedSkills.length - b.candidate.matchedSkills.length,
};

// Ties keep the score ranking so the order is stable and predictable.
export function sortRows(rows: RankedCandidate[], { key, direction }: SortState): RankedCandidate[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => factor * COMPARERS[key](a, b) || a.rank - b.rank);
}

// Names and ranks read best ascending; everything else starts with the biggest value.
function firstDirection(key: SortKey): SortDirection {
  return key === 'rank' || key === 'name' ? 'asc' : 'desc';
}

export function nextSort(current: SortState, key: SortKey): SortState {
  if (current.key !== key) return { key, direction: firstDirection(key) };
  return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}
