import { fetchSavedSearch } from '@/api/endpoints/sessions.api';
import { searchCandidates } from '@/api/endpoints/screening.api';
import { useAppSelector } from '@/store/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const TOP_RESULTS_LIMIT = 10;

// Ranked candidates for the submitted job description, or the saved results of a past search opened from History. Components share one cached result, and it is
// never refetched on its own because every search is recorded server-side.
export function useCandidateSearch() {
  const jd = useAppSelector((state) => state.jd.submitted);
  const queryClient = useQueryClient();
  const savedSessionId = useAppSelector((state) => state.jd.savedSessionId);

  return useQuery({
    queryKey: ['candidate-search', jd, savedSessionId],
    queryFn: () => {
      if (savedSessionId) return fetchSavedSearch(savedSessionId).then((saved) => saved.candidates);
      if (!jd) return Promise.resolve([]);
      return searchCandidates({
        jobTitle: jd.title,
        skills: jd.skills,
        jobDescription: jd.text,
        topN: TOP_RESULTS_LIMIT,
      }).then((results) => {
        // The server records every search, so refresh History now instead of waiting for a reload.
        void queryClient.invalidateQueries({ queryKey: ['sessions'] });
        return results;
      });
    },
    enabled: jd !== null,
    staleTime: Infinity,
  });
}
