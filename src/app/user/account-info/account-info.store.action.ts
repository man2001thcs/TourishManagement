import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'user/Account';

export const initial = createAction(`[${storeKey}] initial`);

export const getAccount = createAction(
  `[${storeKey}] getAccount`,
  props<{ payload: any }>()
);

export const getAccountSuccess = createAction(
  `[${storeKey}] getAccountSuccess`,
  props<{ response: any }>()
);

export const getAccountFailed = createAction(
  `[${storeKey}] getAccountFailed`,
  props<{ response: any }>()
);

export const getAccountSystemFailed = createAction(
  `[${storeKey}] getAccountSystemFailed`,
  props<{ error: any }>()
);

export const editAccount = createAction(
  `[${storeKey}] editAccount`,
  props<{ payload: any }>()
);

export const editAccountSuccess = createAction(
  `[${storeKey}] editAccountSuccess`,
  props<{ response: any }>()
);

export const editAccountFailed = createAction(
  `[${storeKey}] editAccountFailed`,
  props<{ response: any }>()
);

export const editAccountSystemFailed = createAction(
  `[${storeKey}] editAccountSystemFailed`,
  props<{ error: any }>()
);

export const resetAccount = createAction(
  `[${storeKey}] resetAccountFailed`
);

const actions = union({
  initial,
  
  getAccount,
  getAccountFailed,
  getAccountSystemFailed,

  editAccount,
  editAccountFailed,
  editAccountSystemFailed,

  resetAccount,
});

export type AccountUnionActions = typeof actions;
