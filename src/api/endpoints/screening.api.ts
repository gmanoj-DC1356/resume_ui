import { apiClient } from '@/api/axiosClient';
import type { CandidateMatch } from '@/types/domain';

export interface CandidateSearchRequest {
  jobTitle: string;
  skills: string[];
  jobDescription: string;
  topN: number;
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function isCandidateMatch(value: unknown): value is CandidateMatch {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.resumeId === 'string' &&
    typeof item.candidateRef === 'string' &&
    typeof item.name === 'string' &&
    typeof item.role === 'string' &&
    typeof item.yearsExperience === 'number' &&
    typeof item.score === 'number' &&
    isStringArray(item.matchedSkills) &&
    isStringArray(item.missingSkills) &&
    typeof item.summary === 'string'
  );
}

// POST /api/v1/screening/search/ — ranked candidates for a job title, skills and description.
export async function searchCandidates(request: CandidateSearchRequest): Promise<CandidateMatch[]> {
  const { data } = await apiClient.post<unknown>('/v1/screening/search/', request);
  // Reject anything but a list of well-formed candidates (e.g. an HTML page when the API is unreachable).
  if (!Array.isArray(data) || !data.every(isCandidateMatch)) {
    throw new TypeError('Unexpected response from the candidate search: malformed candidate list');
  }
  return data;
}
