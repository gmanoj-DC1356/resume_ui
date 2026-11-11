import { Tag } from '@/components/common/Tag';
import type { CandidateMatch } from '@/types/domain';

interface CandidateCardProps {
  candidate: CandidateMatch;
  rank: number;
  selected: boolean;
  onSelect: (resumeId: string) => void;
}

export function CandidateCard({ candidate, rank, selected, onSelect }: CandidateCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(candidate.resumeId)}
      className={`mb-2 block w-full rounded-lg border p-3 text-left text-sm transition-colors ${
        selected
          ? 'border-brand-secondary shadow-[0_0_0_2px_var(--color-brand-secondary-soft)]'
          : 'border-brand-line bg-white hover:bg-brand-primary-soft'
      }`}
    >
      <div className="flex items-center justify-between">
        <span>
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-xs text-white">
            {rank}
          </span>
          <b>{candidate.name}</b>
        </span>
        <span className="font-semibold text-brand-good">{candidate.score}%</span>
      </div>
      <div className="mt-1 text-brand-muted">
        {candidate.role} · {candidate.yearsExperience} yrs
      </div>
      <div className="my-2 h-1.5 rounded bg-brand-line">
        <div
          className="h-full rounded bg-gradient-to-r from-brand-secondary to-brand-good"
          style={{ width: `${candidate.score}%` }}
        />
      </div>
      <div>
        {candidate.matchedSkills.map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
        {candidate.missingSkills.map((skill) => (
          <Tag key={skill} variant="warn">
            {skill}
          </Tag>
        ))}
      </div>
    </button>
  );
}
