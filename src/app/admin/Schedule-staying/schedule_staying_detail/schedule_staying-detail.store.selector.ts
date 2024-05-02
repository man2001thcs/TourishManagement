import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './schedule_staying-detail.store.action';
import { State } from './schedule_staying-detail.store.reducer';

export const movingScheduleFeatureState = createFeatureSelector<State>(storeKey);

export const getStayingSchedule = createSelector(
  movingScheduleFeatureState,
  (state) => state.movingSchedule
);

export const editStayingSchedule = createSelector(
  movingScheduleFeatureState,
  (state) => state.movingScheduleReturn
);

export const getMessage = createSelector(
  movingScheduleFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  movingScheduleFeatureState,
  (state) => state.error
);
