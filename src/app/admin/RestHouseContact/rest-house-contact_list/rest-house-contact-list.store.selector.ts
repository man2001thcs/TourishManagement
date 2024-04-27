import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './rest-house-contact-list.store.action';
import { State } from './rest-house-contact-list.store.reducer';

export const RestHouseContactListFeatureState = createFeatureSelector<State>(storeKey);

export const getRestHouseContactList = createSelector(
  RestHouseContactListFeatureState,
  (state) => state.RestHouseContactList
);

export const getDeleteStatus = createSelector(
  RestHouseContactListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  RestHouseContactListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  RestHouseContactListFeatureState,
  (state) => state.error
);
