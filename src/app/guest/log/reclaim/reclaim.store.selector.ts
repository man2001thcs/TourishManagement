import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './reclaim.store.action';
import { State } from './reclaim.store.reducer';

export const userFeatureState = createFeatureSelector<State>(storeKey);

export const reclaimUser = createSelector(
  userFeatureState,
  (state) => state.userReturn
);

export const assignPassword = createSelector(
  userFeatureState,
  (state) => state.assignPasswordReturn
);

export const getMessage = createSelector(
  userFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  userFeatureState,
  (state) => state.error
);
