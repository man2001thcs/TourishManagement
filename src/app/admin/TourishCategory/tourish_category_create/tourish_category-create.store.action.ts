import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/TourishCategoryCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createTourishCategory = createAction(
  `[${storeKey}] createTourishCategory`,
  props<{ payload: any }>()
);

export const createTourishCategorySuccess = createAction(
  `[${storeKey}] createTourishCategorySuccess`,
  props<{ response: any }>()
);

export const createTourishCategoryFailed = createAction(
  `[${storeKey}] createTourishCategoryFailed`,
  props<{ response: any }>()
);

export const createTourishCategorySystemFailed = createAction(
  `[${storeKey}] createTourishCategorySystemFailed`,
  props<{ error: any }>()
);

export const resetTourishCategory = createAction(
  `[${storeKey}] resetTourishCategorySystemFailed`
);

const actions = union({
  initial,

  createTourishCategory,
  createTourishCategoryFailed,
  createTourishCategorySystemFailed,

  resetTourishCategory,
});

export type TourishCategoryUnionActions = typeof actions;
