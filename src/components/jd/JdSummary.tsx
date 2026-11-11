import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Tag } from '@/components/common/Tag';
import type { JdSnapshot } from '@/types/domain';

interface JdSummaryProps {
  jd: JdSnapshot | null;
  onEdit: () => void;
}

// Shows which job description the current matches belong to, or prompts for one.
export function JdSummary({ jd, onEdit }: Readonly<JdSummaryProps>) {
  if (!jd) {
    return (
      <Card title="No job description yet">
        <p className="text-sm text-brand-muted">
          Add a job title, description and key skills to see ranked candidates.
        </p>
        <Button className="mt-4" onClick={onEdit}>
          Add job description
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
            Matching against
          </p>
          <h2 className="text-lg font-semibold text-brand-primary">{jd.title}</h2>
          <div className="mt-2">
            {jd.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </Card>
  );
}
