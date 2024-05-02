import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './schedule_staying-create.store.action';
import { State } from './schedule_staying-create.store.reducer';

export const StayingScheduleFeatureState = createFeatureSelector<State>(storeKey);

export const createStayingSchedule = createSelector(
  StayingScheduleFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  StayingScheduleFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  StayingScheduleFeatureState,
  (state) => state.error
);
