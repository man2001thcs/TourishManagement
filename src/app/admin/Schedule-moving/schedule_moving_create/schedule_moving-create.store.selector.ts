import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './schedule_moving-create.store.action';
import { State } from './schedule_moving-create.store.reducer';

export const MovingScheduleFeatureState = createFeatureSelector<State>(storeKey);

export const createMovingSchedule = createSelector(
  MovingScheduleFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  MovingScheduleFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  MovingScheduleFeatureState,
  (state) => state.error
);
