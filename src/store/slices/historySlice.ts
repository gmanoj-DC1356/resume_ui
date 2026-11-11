import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type HistoryFilter = 'all' | 'match' | 'questions' | 'week';

interface HistoryState {
  filter: HistoryFilter;
  searchQuery: string;
}

const initialState: HistoryState = {
  filter: 'all',
  searchQuery: '',
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistoryFilter(state, action: PayloadAction<HistoryFilter>) {
      state.filter = action.payload;
    },
    setHistorySearch(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setHistoryFilter, setHistorySearch } = historySlice.actions;
export default historySlice.reducer;
