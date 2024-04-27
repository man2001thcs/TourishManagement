import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/RestHouseContactInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getRestHouseContact = createAction(
  `[${storeKey}] getRestHouseContact`,
  props<{ payload: any }>()
);

export const getRestHouseContactSuccess = createAction(
  `[${storeKey}] getRestHouseContactSuccess`,
  props<{ response: any }>()
);

export const getRestHouseContactFailed = createAction(
  `[${storeKey}] getRestHouseContactFailed`,
  props<{ response: any }>()
);

export const getRestHouseContactSystemFailed = createAction(
  `[${storeKey}] getRestHouseContactSystemFailed`,
  props<{ error: any }>()
);

export const editRestHouseContact = createAction(
  `[${storeKey}] editRestHouseContact`,
  props<{ payload: any }>()
);

export const editRestHouseContactSuccess = createAction(
  `[${storeKey}] editRestHouseContactSuccess`,
  props<{ response: any }>()
);

export const editRestHouseContactFailed = createAction(
  `[${storeKey}] editRestHouseContactFailed`,
  props<{ response: any }>()
);

export const editRestHouseContactSystemFailed = createAction(
  `[${storeKey}] editRestHouseContactSystemFailed`,
  props<{ error: any }>()
);

export const resetRestHouseContact = createAction(
  `[${storeKey}] resetRestHouseContactFailed`
);

const actions = union({
  initial,
  
  getRestHouseContact,
  getRestHouseContactFailed,
  getRestHouseContactSystemFailed,

  editRestHouseContact,
  editRestHouseContactFailed,
  editRestHouseContactSystemFailed,

  resetRestHouseContact,
});

export type RestHouseContactUnionActions = typeof actions;
