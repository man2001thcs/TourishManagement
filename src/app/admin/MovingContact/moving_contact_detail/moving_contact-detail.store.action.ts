import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/MovingContactInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getMovingContact = createAction(
  `[${storeKey}] getMovingContact`,
  props<{ payload: any }>()
);

export const getMovingContactSuccess = createAction(
  `[${storeKey}] getMovingContactSuccess`,
  props<{ response: any }>()
);

export const getMovingContactFailed = createAction(
  `[${storeKey}] getMovingContactFailed`,
  props<{ response: any }>()
);

export const getMovingContactSystemFailed = createAction(
  `[${storeKey}] getMovingContactSystemFailed`,
  props<{ error: any }>()
);

export const editMovingContact = createAction(
  `[${storeKey}] editMovingContact`,
  props<{ payload: any }>()
);

export const editMovingContactSuccess = createAction(
  `[${storeKey}] editMovingContactSuccess`,
  props<{ response: any }>()
);

export const editMovingContactFailed = createAction(
  `[${storeKey}] editMovingContactFailed`,
  props<{ response: any }>()
);

export const editMovingContactSystemFailed = createAction(
  `[${storeKey}] editMovingContactSystemFailed`,
  props<{ error: any }>()
);

export const resetMovingContact = createAction(
  `[${storeKey}] resetMovingContactFailed`
);

const actions = union({
  initial,
  
  getMovingContact,
  getMovingContactFailed,
  getMovingContactSystemFailed,

  editMovingContact,
  editMovingContactFailed,
  editMovingContactSystemFailed,

  resetMovingContact,
});

export type MovingContactUnionActions = typeof actions;
