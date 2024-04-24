import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/movingScheduleInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getMovingSchedule = createAction(
  `[${storeKey}] getMovingSchedule`,
  props<{ payload: any }>()
);

export const getMovingScheduleSuccess = createAction(
  `[${storeKey}] getMovingScheduleSuccess`,
  props<{ response: any }>()
);

export const getMovingScheduleFailed = createAction(
  `[${storeKey}] getMovingScheduleFailed`,
  props<{ response: any }>()
);

export const getMovingScheduleSystemFailed = createAction(
  `[${storeKey}] getMovingScheduleSystemFailed`,
  props<{ error: any }>()
);

export const editMovingSchedule = createAction(
  `[${storeKey}] editMovingSchedule`,
  props<{ payload: any }>()
);

export const editMovingScheduleSuccess = createAction(
  `[${storeKey}] editMovingScheduleSuccess`,
  props<{ response: any }>()
);

export const editMovingScheduleFailed = createAction(
  `[${storeKey}] editMovingScheduleFailed`,
  props<{ response: any }>()
);

export const editMovingScheduleSystemFailed = createAction(
  `[${storeKey}] editMovingScheduleSystemFailed`,
  props<{ error: any }>()
);

export const resetMovingSchedule = createAction(
  `[${storeKey}] resetMovingScheduleFailed`
);

const actions = union({
  initial,
  
  getMovingSchedule,
  getMovingScheduleFailed,
  getMovingScheduleSystemFailed,

  editMovingSchedule,
  editMovingScheduleFailed,
  editMovingScheduleSystemFailed,

  resetMovingSchedule,
});

export type MovingScheduleUnionActions = typeof actions;
