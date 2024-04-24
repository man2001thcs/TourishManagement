import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './schedule_moving-detail.store.action';
import { State } from './schedule_moving-detail.store.reducer';

export const movingScheduleFeatureState = createFeatureSelector<State>(storeKey);

export const getMovingSchedule = createSelector(
  movingScheduleFeatureState,
  (state) => state.movingSchedule
);

export const editMovingSchedule = createSelector(
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
