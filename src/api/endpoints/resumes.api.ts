import { apiClient } from '@/api/axiosClient';

const PDF_MIME_TYPE = 'application/pdf';
const RESUME_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

// GET /api/resumes/{resumeId}/pdf — streams the stored resume for in-app reading.
export async function fetchResumePdf(resumeId: string): Promise<Blob> {
  if (!RESUME_ID_PATTERN.test(resumeId)) {
    throw new TypeError('Invalid resume id');
  }
  const { data } = await apiClient.get<Blob>(`/resumes/${encodeURIComponent(resumeId)}/pdf`, {
    responseType: 'blob',
    headers: { Accept: PDF_MIME_TYPE },
  });
  // Reject anything that is not a PDF (e.g. an HTML error page) so it is never rendered.
  if (!(data instanceof Blob) || data.type !== PDF_MIME_TYPE) {
    throw new TypeError('Unexpected response from resume endpoint: expected a PDF');
  }
  return data;
}
