import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './rest-house-contact-detail.store.action';
import { State } from './rest-house-contact-detail.store.reducer';

export const RestHouseContactFeatureState = createFeatureSelector<State>(storeKey);

export const getRestHouseContact = createSelector(
  RestHouseContactFeatureState,
  (state) => state.RestHouseContact
);

export const editRestHouseContact = createSelector(
  RestHouseContactFeatureState,
  (state) => state.RestHouseContactReturn
);

export const getMessage = createSelector(
  RestHouseContactFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  RestHouseContactFeatureState,
  (state) => state.error
);
