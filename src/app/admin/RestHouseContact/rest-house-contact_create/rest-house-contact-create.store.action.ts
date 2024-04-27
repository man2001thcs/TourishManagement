import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/RestHouseContactCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createRestHouseContact = createAction(
  `[${storeKey}] createRestHouseContact`,
  props<{ payload: any }>()
);

export const createRestHouseContactSuccess = createAction(
  `[${storeKey}] createRestHouseContactSuccess`,
  props<{ response: any }>()
);

export const createRestHouseContactFailed = createAction(
  `[${storeKey}] createRestHouseContactFailed`,
  props<{ response: any }>()
);

export const createRestHouseContactSystemFailed = createAction(
  `[${storeKey}] createRestHouseContactSystemFailed`,
  props<{ error: any }>()
);

export const resetRestHouseContact = createAction(
  `[${storeKey}] resetRestHouseContactSystemFailed`
);

const actions = union({
  initial,

  createRestHouseContact,
  createRestHouseContactFailed,
  createRestHouseContactSystemFailed,

  resetRestHouseContact,
});

export type RestHouseContactUnionActions = typeof actions;
