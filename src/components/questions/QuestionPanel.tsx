import { Card } from '@/components/common/Card';
import { SAMPLE_QUESTIONS } from '@/constants/sampleData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuestionLevel } from '@/store/slices/candidateSlice';
import type { CandidateMatch, QuestionLevel } from '@/types/domain';

interface LevelOption {
  id: QuestionLevel;
  name: string;
  description: string;
}

const LEVELS: LevelOption[] = [
  { id: 'low', name: 'Low', description: 'Fundamentals and core concepts from the resume.' },
  { id: 'medium', name: 'Medium', description: 'Applied scenarios tied to the job description.' },
  {
    id: 'high',
    name: 'High',
    description: 'Deep-dive and design questions for the gaps and senior skills.',
  },
];

interface QuestionPanelProps {
  candidate: CandidateMatch;
}

// Questions are sample data until the question-generation endpoint is wired up.
export function QuestionPanel({ candidate }: Readonly<QuestionPanelProps>) {
  const dispatch = useAppDispatch();
  const level = useAppSelector((state) => state.candidate.questionLevel);
  const activeLevel = LEVELS.find((option) => option.id === level);

  return (
    <Card
      title={`Interview questions · ${candidate.name}`}
      description={`${candidate.role} · ${candidate.yearsExperience} yrs. Questions are tailored to this candidate at three difficulty levels.`}
    >
      <div role="group" aria-label="Difficulty level" className="flex flex-wrap gap-2">
        {LEVELS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === level}
            onClick={() => dispatch(setQuestionLevel(option.id))}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              option.id === level
                ? 'border-transparent bg-brand-primary text-white'
                : 'border-brand-line bg-white text-brand-muted hover:bg-brand-primary-soft'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-brand-muted">{activeLevel?.description}</p>

      <ol className="mt-5 space-y-3">
        {SAMPLE_QUESTIONS[level].map((question, index) => (
          <li
            key={question.text}
            className="flex gap-3 rounded-xl border border-brand-line bg-brand-bg/50 p-4 text-sm"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-xs font-semibold text-white">
              {index + 1}
            </span>
            {question.text}
          </li>
        ))}
      </ol>
    </Card>
  );
}
