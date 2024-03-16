import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './tourish_category-detail.store.action';
import { State } from './tourish_category-detail.store.reducer';

export const tourishCategoryFeatureState = createFeatureSelector<State>(storeKey);

export const getTourishCategory = createSelector(
  tourishCategoryFeatureState,
  (state) => state.tourishCategory
);

export const editTourishCategory = createSelector(
  tourishCategoryFeatureState,
  (state) => state.tourishCategoryReturn
);

export const getMessage = createSelector(
  tourishCategoryFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  tourishCategoryFeatureState,
  (state) => state.error
);
