import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/StayingScheduleCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createStayingSchedule = createAction(
  `[${storeKey}] createStayingSchedule`,
  props<{ payload: any }>()
);

export const createStayingScheduleSuccess = createAction(
  `[${storeKey}] createStayingScheduleSuccess`,
  props<{ response: any }>()
);

export const createStayingScheduleFailed = createAction(
  `[${storeKey}] createStayingScheduleFailed`,
  props<{ response: any }>()
);

export const createStayingScheduleSystemFailed = createAction(
  `[${storeKey}] createStayingScheduleSystemFailed`,
  props<{ error: any }>()
);

export const resetStayingSchedule = createAction(
  `[${storeKey}] resetStayingScheduleSystemFailed`
);

const actions = union({
  initial,

  createStayingSchedule,
  createStayingScheduleFailed,
  createStayingScheduleSystemFailed,

  resetStayingSchedule,
});

export type StayingScheduleUnionActions = typeof actions;
