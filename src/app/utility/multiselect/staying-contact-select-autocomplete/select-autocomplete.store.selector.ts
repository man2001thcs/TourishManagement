import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './select-autocomplete.store.action';
import { State } from './select-autocomplete.store.reducer';

export const movingscheduleListFeatureState = createFeatureSelector<State>(storeKey);

export const getRestHouseContactList = createSelector(
  movingscheduleListFeatureState,
  (state) => state.movingscheduleList
);

export const getDeleteStatus = createSelector(
  movingscheduleListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  movingscheduleListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  movingscheduleListFeatureState,
  (state) => state.error
);
