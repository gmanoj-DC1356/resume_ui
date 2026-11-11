import { Card } from '@/components/common/Card';
import { JD_TEXT_MIN_LENGTH } from '@/components/jd/validateJd';

interface JdGuideProps {
  title: string;
  text: string;
  skills: string[];
}

const TIPS = [
  'List must-have skills first; they weigh most in the ranking.',
  'Paste the real responsibilities and requirements, not just a headline.',
  'Use the skill names candidates write on resumes (e.g. "PostgreSQL").',
];

function ChecklistItem({ done, label }: Readonly<{ done: boolean; label: string }>) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
          done ? 'bg-brand-good text-white' : 'border border-brand-line text-transparent'
        }`}
      >
        ✓
      </span>
      <span className={done ? 'text-brand-text' : 'text-brand-muted'}>
        {label}
        <span className="sr-only">{done ? ' (done)' : ' (to do)'}</span>
      </span>
    </li>
  );
}

// Live readiness checklist plus writing tips, shown beside the job description form.
export function JdGuide({ title, text, skills }: Readonly<JdGuideProps>) {
  return (
    <div className="space-y-6">
      <Card title="Ready to match?">
        <ul className="space-y-2">
          <ChecklistItem done={title.trim().length > 0} label="Job title added" />
          <ChecklistItem
            done={text.trim().length >= JD_TEXT_MIN_LENGTH}
            label="Description is detailed enough"
          />
          <ChecklistItem done={skills.length > 0} label="Key skills added" />
        </ul>
      </Card>
      <Card title="Tips for better matches">
        <ul className="list-disc space-y-2 pl-5 text-sm text-brand-muted">
          {TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
