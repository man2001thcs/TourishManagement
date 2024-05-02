import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/stayingScheduleInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getStayingSchedule = createAction(
  `[${storeKey}] getStayingSchedule`,
  props<{ payload: any }>()
);

export const getStayingScheduleSuccess = createAction(
  `[${storeKey}] getStayingScheduleSuccess`,
  props<{ response: any }>()
);

export const getStayingScheduleFailed = createAction(
  `[${storeKey}] getStayingScheduleFailed`,
  props<{ response: any }>()
);

export const getStayingScheduleSystemFailed = createAction(
  `[${storeKey}] getStayingScheduleSystemFailed`,
  props<{ error: any }>()
);

export const editStayingSchedule = createAction(
  `[${storeKey}] editStayingSchedule`,
  props<{ payload: any }>()
);

export const editStayingScheduleSuccess = createAction(
  `[${storeKey}] editStayingScheduleSuccess`,
  props<{ response: any }>()
);

export const editStayingScheduleFailed = createAction(
  `[${storeKey}] editStayingScheduleFailed`,
  props<{ response: any }>()
);

export const editStayingScheduleSystemFailed = createAction(
  `[${storeKey}] editStayingScheduleSystemFailed`,
  props<{ error: any }>()
);

export const resetStayingSchedule = createAction(
  `[${storeKey}] resetStayingScheduleFailed`
);

const actions = union({
  initial,
  
  getStayingSchedule,
  getStayingScheduleFailed,
  getStayingScheduleSystemFailed,

  editStayingSchedule,
  editStayingScheduleFailed,
  editStayingScheduleSystemFailed,

  resetStayingSchedule,
});

export type StayingScheduleUnionActions = typeof actions;
