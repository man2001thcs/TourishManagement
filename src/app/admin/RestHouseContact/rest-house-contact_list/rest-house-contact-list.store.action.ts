import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/RestHouseContactList';

export const initial = createAction(`[${storeKey}] initial`);

export const getRestHouseContactList = createAction(
  `[${storeKey}] getRestHouseContactList`,
  props<{ payload: any }>()
);

export const getRestHouseContactListSuccess = createAction(
  `[${storeKey}] getRestHouseContactListSuccess`,
  props<{ response: any }>()
);

export const getRestHouseContactListFailed = createAction(
  `[${storeKey}] getRestHouseContactListFailed`,
  props<{ response: any }>()
);

export const getRestHouseContactListSystemFailed = createAction(
  `[${storeKey}] getRestHouseContactListSystemFailed`,
  props<{ error: any }>()
);

export const deleteRestHouseContact = createAction(
  `[${storeKey}] deleteRestHouseContact`,
  props<{ payload: any }>()
);

export const deleteRestHouseContactSuccess = createAction(
  `[${storeKey}] deleteRestHouseContactSuccess`,
  props<{ response: any }>()
);

export const deleteRestHouseContactFailed = createAction(
  `[${storeKey}] deleteRestHouseContactFailed`,
  props<{ response: any }>()
);

export const deleteRestHouseContactSystemFailed = createAction(
  `[${storeKey}] deleteRestHouseContactSystemFailed`,
  props<{ error: any }>()
);


export const resetRestHouseContactList = createAction(
  `[${storeKey}] resetRestHouseContactSystemFailed`
);

const actions = union({
  initial,

  getRestHouseContactList,
  getRestHouseContactListFailed,
  getRestHouseContactListSystemFailed,

  deleteRestHouseContact,
  deleteRestHouseContactFailed,
  deleteRestHouseContactSystemFailed,

  resetRestHouseContactList,
});

export type RestHouseContactListUnionActions = typeof actions;
