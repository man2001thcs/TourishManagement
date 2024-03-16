import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/tourishCategoryList';

export const initial = createAction(`[${storeKey}] initial`);

export const getTourishCategoryList = createAction(
  `[${storeKey}] getTourishCategoryList`,
  props<{ payload: any }>()
);

export const getTourishCategoryListSuccess = createAction(
  `[${storeKey}] getTourishCategoryListSuccess`,
  props<{ response: any }>()
);

export const getTourishCategoryListFailed = createAction(
  `[${storeKey}] getTourishCategoryListFailed`,
  props<{ response: any }>()
);

export const getTourishCategoryListSystemFailed = createAction(
  `[${storeKey}] getTourishCategoryListSystemFailed`,
  props<{ error: any }>()
);

export const deleteTourishCategory = createAction(
  `[${storeKey}] deleteTourishCategory`,
  props<{ payload: any }>()
);

export const deleteTourishCategorySuccess = createAction(
  `[${storeKey}] deleteTourishCategorySuccess`,
  props<{ response: any }>()
);

export const deleteTourishCategoryFailed = createAction(
  `[${storeKey}] deleteTourishCategoryFailed`,
  props<{ response: any }>()
);

export const deleteTourishCategorySystemFailed = createAction(
  `[${storeKey}] deleteTourishCategorySystemFailed`,
  props<{ error: any }>()
);


export const resetTourishCategoryList = createAction(
  `[${storeKey}] resetTourishCategorySystemFailed`
);

const actions = union({
  initial,

  getTourishCategoryList,
  getTourishCategoryListFailed,
  getTourishCategoryListSystemFailed,

  deleteTourishCategory,
  deleteTourishCategoryFailed,
  deleteTourishCategorySystemFailed,

  resetTourishCategoryList,
});

export type TourishCategoryListUnionActions = typeof actions;
