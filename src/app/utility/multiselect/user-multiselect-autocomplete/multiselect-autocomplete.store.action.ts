import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/autocomplete/userList';

export const initial = createAction(`[${storeKey}] initial`);

export const getUserList = createAction(
  `[${storeKey}] getUserList`,
  props<{ payload: any }>()
);

export const getUserListSuccess = createAction(
  `[${storeKey}] getUserListSuccess`,
  props<{ response: any }>()
);

export const getUserListFailed = createAction(
  `[${storeKey}] getUserListFailed`,
  props<{ response: any }>()
);

export const getUserListSystemFailed = createAction(
  `[${storeKey}] getUserListSystemFailed`,
  props<{ error: any }>()
);

export const resetUserList = createAction(
  `[${storeKey}] resetUserSystemFailed`
);

const actions = union({
  initial,

  getUserList,
  getUserListFailed,
  getUserListSystemFailed,

  resetUserList,
});

export type UserListUnionActions = typeof actions;
