import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface SelectCandidatePromptProps {
  feature: string;
  onGoToMatches: () => void;
}

// Fail-closed guard: candidate-scoped modules render this instead of their content when nobody is selected.
export function SelectCandidatePrompt({ feature, onGoToMatches }: Readonly<SelectCandidatePromptProps>) {
  return (
    <Card title="Select a candidate first">
      <p className="text-sm text-brand-muted">
        {feature} is created for one candidate at a time. Pick a candidate from the matches table to
        continue.
      </p>
      <Button className="mt-4" onClick={onGoToMatches}>
        Go to matches
      </Button>
    </Card>
  );
}
