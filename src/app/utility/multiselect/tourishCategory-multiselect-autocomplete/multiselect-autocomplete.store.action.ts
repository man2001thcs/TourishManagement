import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/autocomplete/tourishCategoryList';

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

export const resetTourishCategoryList = createAction(
  `[${storeKey}] resetTourishCategorySystemFailed`
);

const actions = union({
  initial,

  getTourishCategoryList,
  getTourishCategoryListFailed,
  getTourishCategoryListSystemFailed,

  resetTourishCategoryList,
});

export type TourishCategoryListUnionActions = typeof actions;
