import { ResumeViewer } from '@/components/candidates/ResumeViewer';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { QuestionPanel } from '@/components/questions/QuestionPanel';
import type { CandidateMatch, ResumeViewMode } from '@/types/domain';

interface CandidateDeskProps {
  candidate: CandidateMatch;
  viewMode: ResumeViewMode;
  onViewModeChange: (mode: ResumeViewMode) => void;
}

const VIEW_MODES: { id: ResumeViewMode; label: string }[] = [
  { id: 'pdf', label: 'Resume' },
  { id: 'summary', label: 'Summary' },
];

// One screen for the selected candidate: resume beside the generated interview questions,
// with the chatbot underneath for any follow-up question.
export function CandidateDesk({
  candidate,
  viewMode,
  onViewModeChange,
}: Readonly<CandidateDeskProps>) {
  return (
    <div className="space-y-6">
      {/* <InterviewBanner /> */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <div role="group" aria-label="Resume view" className="flex gap-2">
            {VIEW_MODES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={id === viewMode}
                onClick={() => onViewModeChange(id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  id === viewMode
                    ? 'border-transparent bg-brand-primary text-white'
                    : 'border-brand-line bg-white text-brand-muted hover:bg-brand-primary-soft'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ResumeViewer resumeId={candidate.resumeId} mode={viewMode} />
        </div>
        <div className="min-w-0">
          <QuestionPanel candidate={candidate} />
        </div>
      </div>
      <div>
        <ChatPanel key={candidate.resumeId} candidate={candidate} />
      </div>
    </div>
  );
}
