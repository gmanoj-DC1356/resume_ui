import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

// Typed wrappers around the plain react-redux hooks — use these throughout the app.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
