import { fetchResumePdf } from '@/api/endpoints/resumes.api';
import { skipToken, useQuery } from '@tanstack/react-query';

// Backs the resume viewer via GET /api/v1/resumes/{id}/pdf/; idle until a resume is selected.
export function useResumePdf(resumeId: string | null) {
  return useQuery({
    queryKey: ['resume-pdf', resumeId],
    queryFn: resumeId === null ? skipToken : () => fetchResumePdf(resumeId),
    retry: false,
  });
}
