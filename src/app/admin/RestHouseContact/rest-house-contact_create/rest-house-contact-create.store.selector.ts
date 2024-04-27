import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './rest-house-contact-create.store.action';
import { State } from './rest-house-contact-create.store.reducer';

export const RestHouseContactFeatureState = createFeatureSelector<State>(storeKey);

export const createRestHouseContact = createSelector(
  RestHouseContactFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  RestHouseContactFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  RestHouseContactFeatureState,
  (state) => state.error
);
