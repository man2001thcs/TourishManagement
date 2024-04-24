import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/MovingScheduleCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createMovingSchedule = createAction(
  `[${storeKey}] createMovingSchedule`,
  props<{ payload: any }>()
);

export const createMovingScheduleSuccess = createAction(
  `[${storeKey}] createMovingScheduleSuccess`,
  props<{ response: any }>()
);

export const createMovingScheduleFailed = createAction(
  `[${storeKey}] createMovingScheduleFailed`,
  props<{ response: any }>()
);

export const createMovingScheduleSystemFailed = createAction(
  `[${storeKey}] createMovingScheduleSystemFailed`,
  props<{ error: any }>()
);

export const resetMovingSchedule = createAction(
  `[${storeKey}] resetMovingScheduleSystemFailed`
);

const actions = union({
  initial,

  createMovingSchedule,
  createMovingScheduleFailed,
  createMovingScheduleSystemFailed,

  resetMovingSchedule,
});

export type MovingScheduleUnionActions = typeof actions;
