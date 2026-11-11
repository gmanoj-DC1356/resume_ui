import { Tag } from '@/components/common/Tag';
import type { CandidateMatch } from '@/types/domain';

const STRONG_SCORE = 80;
const FAIR_SCORE = 60;
const MAX_PERCENT = 100;

function clampPercent(score: number): number {
  return Math.min(MAX_PERCENT, Math.max(0, score));
}

function scoreTone(score: number): { text: string; bar: string } {
  if (score >= STRONG_SCORE) return { text: 'text-brand-good', bar: 'bg-brand-good' };
  if (score >= FAIR_SCORE) return { text: 'text-brand-warn', bar: 'bg-brand-warn' };
  return { text: 'text-brand-bad', bar: 'bg-brand-bad' };
}

interface CandidateRowProps {
  candidate: CandidateMatch;
  rank: number;
  selected: boolean;
  onOpen: (resumeId: string) => void;
}

export function CandidateRow({
  candidate,
  rank,
  selected,
  onOpen,
}: Readonly<CandidateRowProps>) {
  const { resumeId, name } = candidate;
  return (
    <tr
      className={`border-t border-brand-line transition-colors odd:bg-white even:bg-brand-bg/40 hover:bg-brand-primary-soft/60 ${
        selected ? 'bg-brand-primary-soft' : ''
      }`}
    >
      <td className="px-3 py-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
          {rank}
        </span>
      </td>
      <th scope="row" className="break-words px-3 py-3 text-left font-semibold">
        {name}
        <span className="block text-xs font-normal text-brand-muted">{candidate.role}</span>
      </th>
      <td className="px-3 py-3 text-brand-text">{candidate.yearsExperience} yrs</td>
      <td className="px-3 py-3">
        <span className={`font-semibold ${scoreTone(candidate.score).text}`}>{candidate.score}%</span>
        <div className="mt-1 h-1.5 rounded bg-brand-line">
          <div
            className={`h-full rounded ${scoreTone(candidate.score).bar}`}
            style={{ width: `${clampPercent(candidate.score)}%` }}
          />
        </div>
      </td>
      <td className="px-3 py-3">
        {candidate.matchedSkills.map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
        {candidate.missingSkills.map((skill) => (
          <Tag key={skill} variant="warn">
            {skill}
          </Tag>
        ))}
      </td>
      <td className="px-3 py-3">
        <button
          type="button"
          title="Open resume, questions and chat"
          aria-label={`Open resume, interview questions and chat for ${name}`}
          onClick={() => onOpen(resumeId)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary transition-colors hover:bg-brand-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-brand-accent"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
