import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/MovingContactCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createMovingContact = createAction(
  `[${storeKey}] createMovingContact`,
  props<{ payload: any }>()
);

export const createMovingContactSuccess = createAction(
  `[${storeKey}] createMovingContactSuccess`,
  props<{ response: any }>()
);

export const createMovingContactFailed = createAction(
  `[${storeKey}] createMovingContactFailed`,
  props<{ response: any }>()
);

export const createMovingContactSystemFailed = createAction(
  `[${storeKey}] createMovingContactSystemFailed`,
  props<{ error: any }>()
);

export const resetMovingContact = createAction(
  `[${storeKey}] resetMovingContactSystemFailed`
);

const actions = union({
  initial,

  createMovingContact,
  createMovingContactFailed,
  createMovingContactSystemFailed,

  resetMovingContact,
});

export type MovingContactUnionActions = typeof actions;
