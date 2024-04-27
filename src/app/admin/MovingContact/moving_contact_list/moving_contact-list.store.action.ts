import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/MovingContactList';

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

export const deleteMovingContact = createAction(
  `[${storeKey}] deleteMovingContact`,
  props<{ payload: any }>()
);

export const deleteMovingContactSuccess = createAction(
  `[${storeKey}] deleteMovingContactSuccess`,
  props<{ response: any }>()
);

export const deleteMovingContactFailed = createAction(
  `[${storeKey}] deleteMovingContactFailed`,
  props<{ response: any }>()
);

export const deleteMovingContactSystemFailed = createAction(
  `[${storeKey}] deleteMovingContactSystemFailed`,
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

  deleteMovingContact,
  deleteMovingContactFailed,
  deleteMovingContactSystemFailed,

  resetMovingContactList,
});

export type MovingContactListUnionActions = typeof actions;
