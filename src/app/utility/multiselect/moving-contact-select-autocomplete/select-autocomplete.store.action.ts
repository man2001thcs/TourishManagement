import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/autocomplete/movingschedule';

export const initial = createAction(`[${storeKey}] initial`);

export const getMovingContactList = createAction(
  `[${storeKey}] getMovingContactList`,
  props<{ payload: any }>()
);

export const getMovingContactListSuccess = createAction(
  `[${storeKey}] getMovingContactListSuccess`,
  props<{ response: any }>()
);

export const getMovingContactListFailed = createAction(
  `[${storeKey}] getMovingContactListFailed`,
  props<{ response: any }>()
);

export const getMovingContactListSystemFailed = createAction(
  `[${storeKey}] getMovingContactListSystemFailed`,
  props<{ error: any }>()
);

export const resetMovingContactList = createAction(
  `[${storeKey}] resetMovingContactSystemFailed`
);

const actions = union({
  initial,

  getMovingContactList,
  getMovingContactListFailed,
  getMovingContactListSystemFailed,

  resetMovingContactList,
});

export type MovingContactListUnionActions = typeof actions;
