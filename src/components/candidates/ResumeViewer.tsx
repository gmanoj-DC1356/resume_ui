import { Card } from '@/components/common/Card';
import { useCandidateSearch } from '@/hooks/useCandidateSearch';
import { useResumePdf } from '@/hooks/useResumePdf';
import type { ResumeViewMode } from '@/types/domain';
import { useEffect, useRef } from 'react';

const VIEWER_HEIGHT_CLASS = 'h-[70vh]';

interface ResumeViewerProps {
  resumeId: string | null;
  mode: ResumeViewMode;
}

interface PdfFrameProps {
  pdf: Blob;
  title: string;
}

// The object URL is created and revoked in the same effect so it is never leaked or reused after revoke.
function PdfFrame({ pdf, title }: Readonly<PdfFrameProps>) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const url = URL.createObjectURL(pdf);
    frame.src = url;
    return () => URL.revokeObjectURL(url);
  }, [pdf]);

  return <iframe ref={frameRef} title={title} className={`${VIEWER_HEIGHT_CLASS} w-full rounded-md border border-brand-line`} />;
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
  return <PdfFrame pdf={data} title={`Resume of ${name}`} />;
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
