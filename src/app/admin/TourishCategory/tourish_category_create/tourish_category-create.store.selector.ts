import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './tourish_category-create.store.action';
import { State } from './tourish_category-create.store.reducer';

export const TourishCategoryFeatureState = createFeatureSelector<State>(storeKey);

export const createTourishCategory = createSelector(
  TourishCategoryFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  TourishCategoryFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  TourishCategoryFeatureState,
  (state) => state.error
);
