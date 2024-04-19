import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'guest/userReclaim';

export const initial = createAction(`[${storeKey}] initial`);

export const reclaimUser = createAction(
  `[${storeKey}] getReclaimUser`,
  props<{ payload: any }>()
);

export const reclaimUserSuccess = createAction(
  `[${storeKey}] getReclaimUserSuccess`,
  props<{ response: any }>()
);

export const reclaimUserFailed = createAction(
  `[${storeKey}] getReclaimUserFailed`,
  props<{ response: any }>()
);

export const reclaimUserSystemFailed = createAction(
  `[${storeKey}] getReclaimUserSystemFailed`,
  props<{ error: any }>()
);

export const assignPassword = createAction(
  `[${storeKey}] assignPassword`,
  props<{ payload: any }>()
);

export const assignPasswordSuccess = createAction(
  `[${storeKey}] assignPasswordSuccess`,
  props<{ response: any }>()
);

export const assignPasswordFailed = createAction(
  `[${storeKey}] assignPasswordFailed`,
  props<{ response: any }>()
);

export const assignPasswordSystemFailed = createAction(
  `[${storeKey}] assignPasswordSystemFailed`,
  props<{ error: any }>()
);

export const resetUser = createAction(
  `[${storeKey}] resetUserFailed`
);

const actions = union({
  initial,

  reclaimUser,
  reclaimUserSuccess,
  reclaimUserFailed,
  reclaimUserSystemFailed,

  assignPassword,
  assignPasswordSuccess,
  assignPasswordFailed,
  assignPasswordSystemFailed,

  resetUser,
});

export type UserUnionActions = typeof actions;
