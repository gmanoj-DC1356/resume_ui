import type { JdSnapshot } from '@/types/domain';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface JdState {
  submitted: JdSnapshot | null;
  // Set when a past search from History is being viewed; its saved results are shown instead of a new search.
  savedSessionId: string | null;
}

const initialState: JdState = { submitted: null, savedSessionId: null };

// Holds the last validated job description in memory only (never persisted to browser storage).
const jdSlice = createSlice({
  name: 'jd',
  initialState,
  reducers: {
    submitJd(state, action: PayloadAction<JdSnapshot>) {
      state.submitted = action.payload;
      state.savedSessionId = null;
    },
    openSavedSearch(state, action: PayloadAction<{ sessionId: string; jd: JdSnapshot }>) {
      state.submitted = action.payload.jd;
      state.savedSessionId = action.payload.sessionId;
    },
    clearJd(state) {
      state.submitted = null;
      state.savedSessionId = null;
    },
  },
});

export const { submitJd, openSavedSearch, clearJd } = jdSlice.actions;
export default jdSlice.reducer;
