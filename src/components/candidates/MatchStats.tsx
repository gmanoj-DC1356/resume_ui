import type { CandidateMatch } from '@/types/domain';

interface MatchStatsProps {
  candidates: CandidateMatch[];
}

interface Stat {
  label: string;
  value: string;
}

function buildStats(candidates: CandidateMatch[]): Stat[] {
  const scores = candidates.map((candidate) => candidate.score);
  const fullMatches = candidates.filter((candidate) => candidate.missingSkills.length === 0);
  return [
    { label: 'Candidates', value: String(candidates.length) },
    { label: 'Top score', value: `${Math.max(...scores)}%` },
    { label: 'Have every skill', value: String(fullMatches.length) },
  ];
}

export function MatchStats({ candidates }: Readonly<MatchStatsProps>) {
  if (candidates.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {buildStats(candidates).map(({ label, value }) => (
        <div key={label} className="rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
          <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">{label}</dt>
          <dd className="mt-1 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-2xl font-bold text-transparent">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
