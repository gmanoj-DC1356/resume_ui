import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from '@/store/slices/candidateSlice';
import historyReducer from '@/store/slices/historySlice';
import jdReducer from '@/store/slices/jdSlice';

export const store = configureStore({
  reducer: {
    candidate: candidateReducer,
    history: historyReducer,
    jd: jdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
