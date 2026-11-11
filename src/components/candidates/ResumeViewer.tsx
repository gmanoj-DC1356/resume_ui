import { Card } from '@/components/common/Card';
import { useCandidateSearch } from '@/hooks/useCandidateSearch';
import { useResumePdf } from '@/hooks/useResumePdf';
import type { ResumeViewMode } from '@/types/domain';
import { lazy, Suspense } from 'react';

// pdf.js is large, so it loads only when a resume is opened instead of with the first page.
const PdfReader = lazy(() => import('@/components/candidates/reader/PdfReader').then((module) => ({ default: module.PdfReader })));

interface ResumeViewerProps {
  resumeId: string | null;
  mode: ResumeViewMode;
}

function PdfPane({ resumeId, name }: Readonly<{ resumeId: string; name: string }>) {
  const { data, isPending, isError } = useResumePdf(resumeId);

  if (isPending) return <p role="status" className="text-sm text-brand-muted">Loading resume…</p>;
  if (isError) {
    return (
      <p role="alert" className="text-sm text-brand-bad">
        The resume could not be loaded. Please try again later.
      </p>
    );
  }
  return (
    <Suspense fallback={<p role="status" className="text-sm text-brand-muted">Loading resume…</p>}>
      <PdfReader pdf={data} title={`Resume of ${name}`} />
    </Suspense>
  );
}

export function ResumeViewer({ resumeId, mode }: Readonly<ResumeViewerProps>) {
  const { data: candidates } = useCandidateSearch();
  const candidate = candidates?.find((item) => item.resumeId === resumeId);

  if (!candidate) {
    return (
      <Card title="Resume viewer">
        <p className="text-sm text-brand-muted">
          Choose Resume or Summary on a candidate to read it here.
        </p>
      </Card>
    );
  }

  return (
    <Card title={`${mode === 'pdf' ? 'Resume' : 'Summary'} · ${candidate.name}`}>
      {mode === 'pdf' ? (
        <PdfPane resumeId={candidate.resumeId} name={candidate.name} />
      ) : (
        <p className="text-sm text-brand-text">{candidate.summary}</p>
      )}
    </Card>
  );
}
