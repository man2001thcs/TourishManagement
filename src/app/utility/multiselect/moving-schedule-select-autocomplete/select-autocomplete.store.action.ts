import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/autocomplete/movingschedule';

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

export const resetMovingScheduleList = createAction(
  `[${storeKey}] resetMovingScheduleSystemFailed`
);

const actions = union({
  initial,

  getMovingScheduleList,
  getMovingScheduleListFailed,
  getMovingScheduleListSystemFailed,

  resetMovingScheduleList,
});

export type MovingScheduleListUnionActions = typeof actions;
