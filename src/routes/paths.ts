import { matchPath } from 'react-router-dom';
import type { WorkspaceModule } from '@/types/domain';

// One URL per workspace tab so each can be linked to, bookmarked and reached with the browser's back button.
export const JD_PATH = '/jd';
export const MATCHES_PATH = '/matches';
export const MATCHES_SESSION_ROUTE = `${MATCHES_PATH}/:sessionId`;
export const CANDIDATE_PATH = '/candidate';
export const CANDIDATE_ROUTE = `${CANDIDATE_PATH}/:resumeId`;

// A past search opened from History gets its own address: /matches/<session id>.
export function matchesPath(sessionId?: string | null): string {
  return sessionId ? `${MATCHES_PATH}/${encodeURIComponent(sessionId)}` : MATCHES_PATH;
}

export function sessionIdFromPathname(pathname: string): string | undefined {
  const id = matchPath(MATCHES_SESSION_ROUTE, pathname)?.params.sessionId;
  return id ?? undefined;
}

// Set on the navigation that comes from a Matches table row; the candidate page refuses to open without it.
export interface CandidateNavState {
  fromMatches: true;
}

export function openedFromMatches(state: unknown): boolean {
  return typeof state === 'object' && state !== null && (state as Partial<CandidateNavState>).fromMatches === true;
}

export function candidatePath(resumeId: string): string {
  return `${CANDIDATE_PATH}/${encodeURIComponent(resumeId)}`;
}

// The workspace sits above the per-tab routes, so it reads the candidate id from the URL itself.
export function resumeIdFromPathname(pathname: string): string | undefined {
  const id = matchPath(CANDIDATE_ROUTE, pathname)?.params.resumeId;
  return id ?? undefined;
}

export function moduleFromPathname(pathname: string): WorkspaceModule {
  if (pathname.startsWith(CANDIDATE_PATH)) return 'candidate';
  return pathname.startsWith(MATCHES_PATH) ? 'matches' : 'jd';
}
