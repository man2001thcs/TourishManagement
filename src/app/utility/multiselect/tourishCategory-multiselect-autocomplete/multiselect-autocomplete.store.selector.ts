import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './multiselect-autocomplete.store.action';
import { State } from './multiselect-autocomplete.store.reducer';

export const tourishCategoryListFeatureState = createFeatureSelector<State>(storeKey);

export const getTourishCategoryList = createSelector(
  tourishCategoryListFeatureState,
  (state) => state.tourishCategoryList
);

export const getDeleteStatus = createSelector(
  tourishCategoryListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  tourishCategoryListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  tourishCategoryListFeatureState,
  (state) => state.error
);
