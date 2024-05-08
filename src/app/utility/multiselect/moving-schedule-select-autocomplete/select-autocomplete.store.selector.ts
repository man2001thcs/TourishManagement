import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './select-autocomplete.store.action';
import { State } from './select-autocomplete.store.reducer';

export const movingScheduleListFeatureState = createFeatureSelector<State>(storeKey);

export const getMovingScheduleList = createSelector(
  movingScheduleListFeatureState,
  (state) => state.movingScheduleList
);

export const getDeleteStatus = createSelector(
  movingScheduleListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  movingScheduleListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  movingScheduleListFeatureState,
  (state) => state.error
);
