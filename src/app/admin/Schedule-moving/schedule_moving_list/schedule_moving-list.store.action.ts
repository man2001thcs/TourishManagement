import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/movingScheduleList';

export const initial = createAction(`[${storeKey}] initial`);

export const getMovingScheduleList = createAction(
  `[${storeKey}] getMovingScheduleList`,
  props<{ payload: any }>()
);

export const getMovingScheduleListSuccess = createAction(
  `[${storeKey}] getMovingScheduleListSuccess`,
  props<{ response: any }>()
);

export const getMovingScheduleListFailed = createAction(
  `[${storeKey}] getMovingScheduleListFailed`,
  props<{ response: any }>()
);

export const getMovingScheduleListSystemFailed = createAction(
  `[${storeKey}] getMovingScheduleListSystemFailed`,
  props<{ error: any }>()
);

export const deleteMovingSchedule = createAction(
  `[${storeKey}] deleteMovingSchedule`,
  props<{ payload: any }>()
);

export const deleteMovingScheduleSuccess = createAction(
  `[${storeKey}] deleteMovingScheduleSuccess`,
  props<{ response: any }>()
);

export const deleteMovingScheduleFailed = createAction(
  `[${storeKey}] deleteMovingScheduleFailed`,
  props<{ response: any }>()
);

export const deleteMovingScheduleSystemFailed = createAction(
  `[${storeKey}] deleteMovingScheduleSystemFailed`,
  props<{ error: any }>()
);


export const resetMovingScheduleList = createAction(
  `[${storeKey}] resetMovingScheduleSystemFailed`
);

const actions = union({
  initial,

  getMovingScheduleList,
  getMovingScheduleListFailed,
  getMovingScheduleListSystemFailed,

  deleteMovingSchedule,
  deleteMovingScheduleFailed,
  deleteMovingScheduleSystemFailed,

  resetMovingScheduleList,
});

export type MovingScheduleListUnionActions = typeof actions;
