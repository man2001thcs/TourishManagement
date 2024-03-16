import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/TourishCategoryInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getTourishCategory = createAction(
  `[${storeKey}] getTourishCategory`,
  props<{ payload: any }>()
);

export const getTourishCategorySuccess = createAction(
  `[${storeKey}] getTourishCategorySuccess`,
  props<{ response: any }>()
);

export const getTourishCategoryFailed = createAction(
  `[${storeKey}] getTourishCategoryFailed`,
  props<{ response: any }>()
);

export const getTourishCategorySystemFailed = createAction(
  `[${storeKey}] getTourishCategorySystemFailed`,
  props<{ error: any }>()
);

export const editTourishCategory = createAction(
  `[${storeKey}] editTourishCategory`,
  props<{ payload: any }>()
);

export const editTourishCategorySuccess = createAction(
  `[${storeKey}] editTourishCategorySuccess`,
  props<{ response: any }>()
);

export const editTourishCategoryFailed = createAction(
  `[${storeKey}] editTourishCategoryFailed`,
  props<{ response: any }>()
);

export const editTourishCategorySystemFailed = createAction(
  `[${storeKey}] editTourishCategorySystemFailed`,
  props<{ error: any }>()
);

export const resetTourishCategory = createAction(
  `[${storeKey}] resetTourishCategoryFailed`
);

const actions = union({
  initial,
  
  getTourishCategory,
  getTourishCategoryFailed,
  getTourishCategorySystemFailed,

  editTourishCategory,
  editTourishCategoryFailed,
  editTourishCategorySystemFailed,

  resetTourishCategory,
});

export type TourishCategoryUnionActions = typeof actions;
