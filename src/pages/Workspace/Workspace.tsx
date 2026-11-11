import { fetchSavedSearch } from '@/api/endpoints/sessions.api';
import { CandidateList } from '@/components/candidates/CandidateList';
import { SelectCandidatePrompt } from '@/components/candidates/SelectCandidatePrompt';
import { CandidateDesk } from '@/components/candidates/CandidateDesk';
import { useCandidateSearch } from '@/hooks/useCandidateSearch';
import { HistorySidebar } from '@/components/history/HistorySidebar';
import { JdForm } from '@/components/jd/JdForm';
import { JdSummary } from '@/components/jd/JdSummary';
import { AppHeader } from '@/components/layout/AppHeader';
import { ModuleTabs } from '@/components/layout/ModuleTabs';
import { TwoPaneLayout } from '@/components/layout/TwoPaneLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCandidate } from '@/store/slices/candidateSlice';
import { openSavedSearch } from '@/store/slices/jdSlice';
import type { ResumeViewMode, WorkspaceModule } from '@/types/domain';
import {
  candidatePath,
  JD_PATH,
  MATCHES_PATH,
  matchesPath,
  moduleFromPathname,
  openedFromMatches,
  resumeIdFromPathname,
  sessionIdFromPathname,
} from '@/routes/paths';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export function Workspace() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const selectedResumeId = useAppSelector((state) => state.candidate.selectedResumeId);
  const jd = useAppSelector((state) => state.jd.submitted);
  const savedSessionId = useAppSelector((state) => state.jd.savedSessionId);
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const activeModule = moduleFromPathname(pathname);
  const [viewMode, setViewMode] = useState<ResumeViewMode>('pdf');

  const { data: candidates } = useCandidateSearch();
  // The URL names the candidate on the candidate tab; an unknown id simply finds nobody (fail closed).
  const currentResumeId = resumeIdFromPathname(pathname) ?? selectedResumeId;
  const candidate = candidates?.find((item) => item.resumeId === currentResumeId);

  const openCandidate = (resumeId: string) => {
    dispatch(selectCandidate(resumeId));
    navigate(candidatePath(resumeId), { state: { fromMatches: true } });
  };

  // Loads a past search from History. The results are cached under the same key the search hook
  // reads, so opening it does not run a new search.
  const loadSession = useCallback(
    async (sessionId: string) => {
      const saved = await fetchSavedSearch(sessionId);
      queryClient.setQueryData(['candidate-search', saved.jd, sessionId], saved.candidates);
      dispatch(openSavedSearch({ sessionId, jd: saved.jd }));
    },
    [dispatch, queryClient],
  );

  // A History card shows its saved results on the matches tab, under its own /matches/<id> address.
  const openSession = async (sessionId: string) => {
    await loadSession(sessionId);
    navigate(matchesPath(sessionId));
  };

  // A /matches/<id> link opened directly (reload, bookmark, shared) has nothing loaded yet, so fetch it.
  // An id that cannot be loaded (unknown, not yours, malformed) falls back to the plain matches page.
  const routeSessionId = sessionIdFromPathname(pathname);
  useEffect(() => {
    if (!routeSessionId || savedSessionId) return;
    loadSession(routeSessionId).catch(() => navigate(MATCHES_PATH, { replace: true }));
  }, [routeSessionId, savedSessionId, loadSession, navigate]);

  // A fresh search always lands on the plain matches page; otherwise stay on the open history entry.
  const goToNewMatches = () => navigate(MATCHES_PATH);
  const goToMatchesPath = matchesPath(savedSessionId);
  const goToMatches = () => navigate(goToMatchesPath);

  const changeModule = (module: WorkspaceModule) => {
    if (module === 'matches') goToMatches();
    else if (module === 'jd') navigate(JD_PATH);
  };

  // A candidate is opened from the Matches table only; typing or bookmarking the URL goes back to Matches.
  if (activeModule === 'candidate' && !openedFromMatches(state)) {
    return <Navigate to={goToMatchesPath} replace />;
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <TwoPaneLayout
        main={
          <>
            <ModuleTabs
              active={activeModule}
              onChange={changeModule}
            />
            {activeModule === 'jd' && <JdForm onSubmitted={goToNewMatches} />}
            {activeModule === 'matches' && (
              <div className="space-y-6">
                <JdSummary jd={jd} onEdit={() => navigate(JD_PATH)} />
                {jd && (
                  <CandidateList
                    selectedResumeId={selectedResumeId}
                    onOpen={openCandidate}
                  />
                )}
              </div>
            )}
            {activeModule === 'candidate' &&
              (candidate ? (
                <CandidateDesk
                  candidate={candidate}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              ) : (
                <SelectCandidatePrompt feature="Resume, questions and chat" onGoToMatches={goToMatches} />
              ))}
          </>
        }
        aside={
          activeModule === 'candidate' ? undefined : (
            <HistorySidebar
              // The Job description tab is for a new search, so no past entry shows as selected there.
              selectedSessionId={activeModule === 'matches' ? savedSessionId : null}
              onOpenSession={openSession}
            />
          )
        }
      />
    </div>
  );
}
