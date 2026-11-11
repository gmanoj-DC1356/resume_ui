import { apiClient } from '@/api/axiosClient';
import { isCandidateMatch, isStringArray } from '@/api/endpoints/screening.api';
import type { CandidateMatch, HistoryEntry, JdSnapshot } from '@/types/domain';

export interface SessionFilters {
  type?: 'match' | 'questions';
  from?: string;
  to?: string;
  query?: string;
  page?: number;
}

const SESSIONS_PATH = '/v1/matching/sessions/';

function sessionPath(id: string): string {
  return `${SESSIONS_PATH}${encodeURIComponent(id)}/`;
}

// GET /api/v1/matching/sessions/
export async function fetchSessions(filters: SessionFilters = {}): Promise<HistoryEntry[]> {
  const { data } = await apiClient.get<unknown>(SESSIONS_PATH, { params: filters });
  // Reject anything but a list (e.g. an HTML page when the API is unreachable) so the UI shows its error state.
  if (!Array.isArray(data)) {
    throw new TypeError('Unexpected response from GET sessions: expected a list');
  }
  return data as HistoryEntry[];
}

// PATCH /api/v1/matching/sessions/<id>/ — rename a history entry.
export async function renameSession(id: string, title: string): Promise<HistoryEntry> {
  const { data } = await apiClient.patch<HistoryEntry>(sessionPath(id), { title });
  return data;
}

// DELETE /api/v1/matching/sessions/<id>/
export async function deleteSession(id: string): Promise<void> {
  await apiClient.delete(sessionPath(id));
}

export interface SavedSearch {
  jd: JdSnapshot;
  candidates: CandidateMatch[];
}

// GET /api/v1/matching/sessions/<id>/ — the job description and ranked results saved for a past search.
export async function fetchSavedSearch(id: string): Promise<SavedSearch> {
  const { data } = await apiClient.get<unknown>(sessionPath(id));
  const body = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>;
  const { title, jobDescription, skills, candidates } = body;
  if (
    typeof title !== 'string' ||
    typeof jobDescription !== 'string' ||
    !isStringArray(skills) ||
    !Array.isArray(candidates) ||
    !candidates.every(isCandidateMatch)
  ) {
    throw new TypeError('Unexpected response from the saved search: malformed data');
  }
  return { jd: { title, text: jobDescription, skills }, candidates };
}
