import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './schedule_staying-detail.store.action';
import { State } from './schedule_staying-detail.store.reducer';

export const stayingScheduleFeatureState = createFeatureSelector<State>(storeKey);

export const getStayingSchedule = createSelector(
  stayingScheduleFeatureState,
  (state) => state.stayingSchedule
);

export const editStayingSchedule = createSelector(
  stayingScheduleFeatureState,
  (state) => state.stayingScheduleReturn
);

export const getMessage = createSelector(
  stayingScheduleFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  stayingScheduleFeatureState,
  (state) => state.error
);
