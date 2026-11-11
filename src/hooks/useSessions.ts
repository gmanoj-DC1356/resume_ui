import {
  deleteSession,
  fetchSessions,
  renameSession,
  type SessionFilters,
} from '@/api/endpoints/sessions.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SESSIONS_KEY = 'sessions';

// Backs the History sidebar via GET /api/v1/matching/sessions/.
export function useSessions(filters: SessionFilters = {}) {
  return useQuery({
    queryKey: [SESSIONS_KEY, filters],
    queryFn: () => fetchSessions(filters),
  });
}

// Both mutations refetch the list so the sidebar always reflects the server.
export function useRenameSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameSession(id, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [SESSIONS_KEY] }),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [SESSIONS_KEY] }),
  });
}
