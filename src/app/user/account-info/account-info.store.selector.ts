import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './account-info.store.action';
import { State } from './account-info.store.reducer';

export const userFeatureState = createFeatureSelector<State>(storeKey);

export const getAccount = createSelector(
  userFeatureState,
  (state) => state.user
);

export const editAccount = createSelector(
  userFeatureState,
  (state) => state.userReturn
);

export const getMessage = createSelector(
  userFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  userFeatureState,
  (state) => state.error
);
