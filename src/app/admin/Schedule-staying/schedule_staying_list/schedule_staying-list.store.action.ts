import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/stayingScheduleList';

export const initial = createAction(`[${storeKey}] initial`);

export const getStayingScheduleList = createAction(
  `[${storeKey}] getStayingScheduleList`,
  props<{ payload: any }>()
);

export const getStayingScheduleListSuccess = createAction(
  `[${storeKey}] getStayingScheduleListSuccess`,
  props<{ response: any }>()
);

export const getStayingScheduleListFailed = createAction(
  `[${storeKey}] getStayingScheduleListFailed`,
  props<{ response: any }>()
);

export const getStayingScheduleListSystemFailed = createAction(
  `[${storeKey}] getStayingScheduleListSystemFailed`,
  props<{ error: any }>()
);

export const deleteStayingSchedule = createAction(
  `[${storeKey}] deleteStayingSchedule`,
  props<{ payload: any }>()
);

export const deleteStayingScheduleSuccess = createAction(
  `[${storeKey}] deleteStayingScheduleSuccess`,
  props<{ response: any }>()
);

export const deleteStayingScheduleFailed = createAction(
  `[${storeKey}] deleteStayingScheduleFailed`,
  props<{ response: any }>()
);

export const deleteStayingScheduleSystemFailed = createAction(
  `[${storeKey}] deleteStayingScheduleSystemFailed`,
  props<{ error: any }>()
);


export const resetStayingScheduleList = createAction(
  `[${storeKey}] resetStayingScheduleSystemFailed`
);

const actions = union({
  initial,

  getStayingScheduleList,
  getStayingScheduleListFailed,
  getStayingScheduleListSystemFailed,

  deleteStayingSchedule,
  deleteStayingScheduleFailed,
  deleteStayingScheduleSystemFailed,

  resetStayingScheduleList,
});

export type StayingScheduleListUnionActions = typeof actions;
