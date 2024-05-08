import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './select-autocomplete.store.action';
import { State } from './select-autocomplete.store.reducer';

export const stayingScheduleListFeatureState = createFeatureSelector<State>(storeKey);

export const getStayingScheduleList = createSelector(
  stayingScheduleListFeatureState,
  (state) => state.stayingScheduleList
);

export const getDeleteStatus = createSelector(
  stayingScheduleListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  stayingScheduleListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  stayingScheduleListFeatureState,
  (state) => state.error
);
