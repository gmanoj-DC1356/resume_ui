import type { QuestionLevel } from '@/types/domain';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CandidateState {
  selectedResumeId: string | null;
  questionLevel: QuestionLevel;
}

const initialState: CandidateState = {
  selectedResumeId: null,
  questionLevel: 'medium',
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    selectCandidate(state, action: PayloadAction<string>) {
      state.selectedResumeId = action.payload;
    },
    setQuestionLevel(state, action: PayloadAction<QuestionLevel>) {
      state.questionLevel = action.payload;
    },
  },
});

export const { selectCandidate, setQuestionLevel } = candidateSlice.actions;
export default candidateSlice.reducer;
